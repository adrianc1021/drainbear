import { COOKIE_NAME } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { protectedProcedure, publicProcedure, router } from "./_core/trpc";
import {
  createEstimateLead,
  createInquiry,
  listEstimateLeads,
  listInquiries,
  updateInquiryStatus,
} from "./db";

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
        }),
      )
      .mutation(({ input }) => createInquiry(input)),

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

  estimate: router({
    /** 公開：估價計算機完成估價時匿名記錄 */
    record: publicProcedure
      .input(
        z.object({
          location: z.string().trim().min(1).max(50),
          building: z.string().trim().min(1).max(50),
          timeSlot: z.string().trim().min(1).max(20),
          priceLow: z.number().int().min(0).max(1_000_000),
          priceHigh: z.number().int().min(0).max(1_000_000),
          sourcePage: z.string().trim().max(200).optional(),
        }),
      )
      .mutation(({ input }) => createEstimateLead(input)),

    /** 管理員：查看估價記錄 */
    list: adminProcedure.query(() => listEstimateLeads()),
  }),
});

export type AppRouter = typeof appRouter;
