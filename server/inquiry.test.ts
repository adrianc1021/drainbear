import { describe, expect, it, vi, beforeEach } from "vitest";
import { appRouter } from "./routers";
import type { TrpcContext } from "./_core/context";

// Mock db helpers so tests run without a live database
vi.mock("./db", () => ({
  createInquiry: vi.fn(async () => ({ id: 1 })),
  createEstimateLead: vi.fn(async () => ({ id: 1 })),
  listEstimateLeads: vi.fn(async () => [
    {
      id: 1,
      location: "坐廁 / 馬桶",
      building: "私樓 / 屋苑",
      timeSlot: "day",
      priceLow: 600,
      priceHigh: 1200,
      sourcePage: "/guide",
      createdAt: new Date(),
    },
  ]),
  listInquiries: vi.fn(async () => [
    {
      id: 1,
      name: "陳先生",
      phone: "+852 9123 4567",
      serviceType: "residential",
      district: "觀塘",
      message: "廁所塞咗",
      status: "new",
      createdAt: new Date(),
    },
  ]),
  updateInquiryStatus: vi.fn(async () => ({ success: true })),
  getUserByOpenId: vi.fn(),
  upsertUser: vi.fn(),
}));

import { createEstimateLead, createInquiry, updateInquiryStatus } from "./db";

function makeCtx(user: TrpcContext["user"]): TrpcContext {
  return {
    user,
    req: {} as TrpcContext["req"],
    res: {} as TrpcContext["res"],
  };
}

const guestCtx = makeCtx(null);

const adminUser = {
  id: 1,
  openId: "admin-open-id",
  name: "Admin",
  email: null,
  loginMethod: null,
  role: "admin" as const,
  createdAt: new Date(),
  updatedAt: new Date(),
  lastSignedIn: new Date(),
};

const normalUser = { ...adminUser, id: 2, openId: "user-open-id", role: "user" as const };

describe("inquiry.submit", () => {
  beforeEach(() => vi.clearAllMocks());

  it("allows guests to submit a valid inquiry", async () => {
    const caller = appRouter.createCaller(guestCtx);
    const result = await caller.inquiry.submit({
      name: "陳先生",
      phone: "+852 9123 4567",
      serviceType: "residential",
      district: "觀塘",
      message: "廁所塞咗，急需上門",
    });
    expect(result).toEqual({ id: 1 });
    expect(createInquiry).toHaveBeenCalledOnce();
  });

  it("rejects invalid phone numbers", async () => {
    const caller = appRouter.createCaller(guestCtx);
    await expect(
      caller.inquiry.submit({
        name: "陳先生",
        phone: "abc",
        serviceType: "residential",
      }),
    ).rejects.toThrow();
    expect(createInquiry).not.toHaveBeenCalled();
  });

  it("rejects empty name", async () => {
    const caller = appRouter.createCaller(guestCtx);
    await expect(
      caller.inquiry.submit({
        name: "  ",
        phone: "91234567",
        serviceType: "cctv",
      }),
    ).rejects.toThrow();
  });
});

describe("inquiry.list / updateStatus access control", () => {
  beforeEach(() => vi.clearAllMocks());

  it("allows admin to list inquiries", async () => {
    const caller = appRouter.createCaller(makeCtx(adminUser));
    const rows = await caller.inquiry.list();
    expect(rows).toHaveLength(1);
    expect(rows[0].name).toBe("陳先生");
  });

  it("blocks non-admin users from listing inquiries", async () => {
    const caller = appRouter.createCaller(makeCtx(normalUser));
    await expect(caller.inquiry.list()).rejects.toThrow();
  });

  it("blocks guests from listing inquiries", async () => {
    const caller = appRouter.createCaller(guestCtx);
    await expect(caller.inquiry.list()).rejects.toThrow();
  });

  it("allows admin to update inquiry status", async () => {
    const caller = appRouter.createCaller(makeCtx(adminUser));
    const result = await caller.inquiry.updateStatus({ id: 1, status: "contacted" });
    expect(result).toEqual({ success: true });
    expect(updateInquiryStatus).toHaveBeenCalledWith(1, "contacted");
  });
});

describe("estimate.record / estimate.list", () => {
  beforeEach(() => vi.clearAllMocks());

  it("allows guests to record an estimate anonymously", async () => {
    const caller = appRouter.createCaller(guestCtx);
    const result = await caller.estimate.record({
      location: "坐廁 / 馬桶",
      building: "私樓 / 屋苑",
      timeSlot: "day",
      priceLow: 600,
      priceHigh: 1200,
      sourcePage: "/guide",
    });
    expect(result).toEqual({ id: 1 });
    expect(createEstimateLead).toHaveBeenCalledOnce();
  });

  it("rejects negative prices", async () => {
    const caller = appRouter.createCaller(guestCtx);
    await expect(
      caller.estimate.record({
        location: "坐廁 / 馬桶",
        building: "私樓 / 屋苑",
        timeSlot: "day",
        priceLow: -100,
        priceHigh: 1200,
      }),
    ).rejects.toThrow();
    expect(createEstimateLead).not.toHaveBeenCalled();
  });

  it("allows admin to list estimate leads", async () => {
    const caller = appRouter.createCaller(makeCtx(adminUser));
    const rows = await caller.estimate.list();
    expect(rows).toHaveLength(1);
    expect(rows[0].priceLow).toBe(600);
  });

  it("blocks non-admin users from listing estimate leads", async () => {
    const caller = appRouter.createCaller(makeCtx(normalUser));
    await expect(caller.estimate.list()).rejects.toThrow();
  });
});
