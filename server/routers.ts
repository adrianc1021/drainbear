import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createInquiry,
  listInquiries,
  updateInquiryStatus,
} from "./db";

const inquiryAttempts = new Map<string, number[]>();
const RATE_WINDOW_MS = 10 * 60 * 1000;
const RATE_LIMIT = 5;

function requestIp(req: { ip?: string; headers: Record<string, unknown> }) {
  const cloudflare = req.headers?.["cf-connecting-ip"];
  if (typeof cloudflare === "string" && cloudflare.trim()) return cloudflare.trim().slice(0, 45);
  const forwarded = req.headers?.["x-forwarded-for"];
  const value = typeof forwarded === "string" ? forwarded.split(",")[0]?.trim() : undefined;
  return (value || req.ip || "unknown").slice(0, 45);
}

const adminProcedure = protectedProcedure.use(({ ctx, next }) => {
  if (ctx.user.role !== "admin") throw new TRPCError({ code: "FORBIDDEN" });
  return next({ ctx });
});

export const appRouter = router({
    // if you need to use socket.io, read and register route in server/_core/index.ts, all api should start with '/api/' so that the gateway can route correctly
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(opts => opts.ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return {
        success: true,
      } as const;
    }),
  }),

  inquiry: router({
    /** 公開：訪客提交服務查詢，持久保存到資料庫 */
    submit: publicProcedure
      .input(
        z.object({
          name: z.string().trim().min(1, "請輸入稱呼").max(100),
          phone: z
            .string()
            .trim()
            .min(8, "請輸入有效電話")
            .max(30)
            .regex(/^[0-9+\-\s()]+$/, "電話格式不正確"),
          serviceType: z.enum([
            "residential",
            "commercial",
            "hydrojet",
            "cctv",
            "other",
          ]),
          district: z.string().trim().max(50).optional(),
          message: z.string().trim().max(2000).optional(),
          landingPage: z.string().trim().max(500).optional(),
          gclid: z.string().trim().max(300).regex(/^[A-Za-z0-9._~-]+$/).optional(),
          clickIdType: z.enum(["gclid", "dclid", "gbraid", "wbraid"]).optional(),
          website: z.string().max(200).optional(),
          recaptchaToken: z.string().max(4000).optional(),
        }),
      )
      .mutation(async ({ input, ctx }) => {
        if (input.website) throw new TRPCError({ code: "BAD_REQUEST", message: "Invalid submission" });
        const ip = requestIp(ctx.req);
        const now = Date.now();
        const recent = (inquiryAttempts.get(ip) || []).filter(time => now - time < RATE_WINDOW_MS);
        if (recent.length >= RATE_LIMIT) {
          throw new TRPCError({ code: "TOO_MANY_REQUESTS", message: "提交次數過多，請稍後再試。" });
        }
        recent.push(now);
        inquiryAttempts.set(ip, recent);
        const { website: _website, recaptchaToken, ...storedInput } = input;
        if (process.env.RECAPTCHA_SECRET_KEY) {
          if (!recaptchaToken) throw new TRPCError({ code: "BAD_REQUEST", message: "請完成安全驗證。" });
          const response = await fetch("https://www.google.com/recaptcha/api/siteverify", {
            method: "POST",
            headers: { "content-type": "application/x-www-form-urlencoded" },
            body: new URLSearchParams({ secret: process.env.RECAPTCHA_SECRET_KEY, response: recaptchaToken }),
          });
          const result = (await response.json()) as { success?: boolean; score?: number; action?: string };
          if (!result.success || (result.score ?? 0) < 0.35 || result.action !== "inquiry_submit") {
            throw new TRPCError({ code: "BAD_REQUEST", message: "安全驗證未通過。" });
          }
        }
        const userAgent = typeof ctx.req.get === "function" ? ctx.req.get("user-agent")?.slice(0, 500) : undefined;
        return createInquiry({ ...storedInput, sourceIp: ip, userAgent });
      }),

    /** 管理員：查看所有查詢紀錄 */
    list: adminProcedure.query(() => listInquiries()),

    /** 管理員：更新處理狀態 */
    updateStatus: adminProcedure
      .input(
        z.object({
          id: z.number().int().positive(),
          status: z.enum(["new", "contacted", "completed", "cancelled"]),
        }),
      )
      .mutation(({ input }) => updateInquiryStatus(input.id, input.status)),
  }),

});

export type AppRouter = typeof appRouter;
