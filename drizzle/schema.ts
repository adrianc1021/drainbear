import { int, mysqlEnum, mysqlTable, text, timestamp, varchar } from "drizzle-orm/mysql-core";

/**
 * Core user table backing auth flow.
 * Extend this file with additional tables as your product grows.
 * Columns use camelCase to match both database fields and generated types.
 */
export const users = mysqlTable("users", {
  /**
   * Surrogate primary key. Auto-incremented numeric value managed by the database.
   * Use this for relations between tables.
   */
  id: int("id").autoincrement().primaryKey(),
  /** Manus OAuth identifier (openId) returned from the OAuth callback. Unique per user. */
  openId: varchar("openId", { length: 64 }).notNull().unique(),
  name: text("name"),
  email: varchar("email", { length: 320 }),
  loginMethod: varchar("loginMethod", { length: 64 }),
  role: mysqlEnum("role", ["user", "admin"]).default("user").notNull(),
  createdAt: timestamp("createdAt").defaultNow().notNull(),
  updatedAt: timestamp("updatedAt").defaultNow().onUpdateNow().notNull(),
  lastSignedIn: timestamp("lastSignedIn").defaultNow().notNull(),
});

export type User = typeof users.$inferSelect;
export type InsertUser = typeof users.$inferInsert;

/**
 * 客戶查詢／預約請求表
 * 儲存網站訪客透過查詢表單提交的通渠服務請求，持久保存於資料庫
 */
export const inquiries = mysqlTable("inquiries", {
  id: int("id").autoincrement().primaryKey(),
  /** 客戶稱呼 */
  name: varchar("name", { length: 100 }).notNull(),
  /** 聯絡電話（香港格式） */
  phone: varchar("phone", { length: 30 }).notNull(),
  /** 服務類型 */
  serviceType: mysqlEnum("serviceType", [
    "residential",
    "commercial",
    "hydrojet",
    "cctv",
    "other",
  ]).notNull(),
  /** 所在地區 */
  district: varchar("district", { length: 50 }),
  /** 問題描述 */
  message: text("message"),
  /** 處理狀態 */
  status: mysqlEnum("status", ["new", "contacted", "completed", "cancelled"])
    .default("new")
    .notNull(),
  /** 建立時間 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type Inquiry = typeof inquiries.$inferSelect;
export type InsertInquiry = typeof inquiries.$inferInsert;

/**
 * 估價計算機記錄表
 * 訪客在估價計算機完成估價時匿名寫入，用於分析需求分佈
 */
export const estimateLeads = mysqlTable("estimate_leads", {
  id: int("id").autoincrement().primaryKey(),
  /** 堵塞位置（如：坐廁 / 馬桶） */
  location: varchar("location", { length: 50 }).notNull(),
  /** 樓宇類型（如：私樓 / 屋苑） */
  building: varchar("building", { length: 50 }).notNull(),
  /** 時段（day / night） */
  timeSlot: varchar("timeSlot", { length: 20 }).notNull(),
  /** 估價下限 HK$ */
  priceLow: int("priceLow").notNull(),
  /** 估價上限 HK$ */
  priceHigh: int("priceHigh").notNull(),
  /** 來源頁面路徑 */
  sourcePage: varchar("sourcePage", { length: 200 }),
  /** 建立時間 */
  createdAt: timestamp("createdAt").defaultNow().notNull(),
});

export type EstimateLead = typeof estimateLeads.$inferSelect;
export type InsertEstimateLead = typeof estimateLeads.$inferInsert;
