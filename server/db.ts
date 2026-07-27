import { desc, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/mysql2";
import {
  estimateLeads,
  InsertEstimateLead,
  InsertInquiry,
  inquiries,
  InsertUser,
  users,
} from "../drizzle/schema";
import { ENV } from './_core/env';

let _db: ReturnType<typeof drizzle> | null = null;

// Lazily create the drizzle instance so local tooling can run without a DB.
export async function getDb() {
  if (!_db && process.env.DATABASE_URL) {
    try {
      _db = drizzle(process.env.DATABASE_URL);
    } catch (error) {
      console.warn("[Database] Failed to connect:", error);
      _db = null;
    }
  }
  return _db;
}

export async function upsertUser(user: InsertUser): Promise<void> {
  if (!user.openId) {
    throw new Error("User openId is required for upsert");
  }

  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot upsert user: database not available");
    return;
  }

  try {
    const values: InsertUser = {
      openId: user.openId,
    };
    const updateSet: Record<string, unknown> = {};

    const textFields = ["name", "email", "loginMethod"] as const;
    type TextField = (typeof textFields)[number];

    const assignNullable = (field: TextField) => {
      const value = user[field];
      if (value === undefined) return;
      const normalized = value ?? null;
      values[field] = normalized;
      updateSet[field] = normalized;
    };

    textFields.forEach(assignNullable);

    if (user.lastSignedIn !== undefined) {
      values.lastSignedIn = user.lastSignedIn;
      updateSet.lastSignedIn = user.lastSignedIn;
    }
    if (user.role !== undefined) {
      values.role = user.role;
      updateSet.role = user.role;
    } else if (user.openId === ENV.ownerOpenId) {
      values.role = 'admin';
      updateSet.role = 'admin';
    }

    if (!values.lastSignedIn) {
      values.lastSignedIn = new Date();
    }

    if (Object.keys(updateSet).length === 0) {
      updateSet.lastSignedIn = new Date();
    }

    await db.insert(users).values(values).onDuplicateKeyUpdate({
      set: updateSet,
    });
  } catch (error) {
    console.error("[Database] Failed to upsert user:", error);
    throw error;
  }
}

export async function getUserByOpenId(openId: string) {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot get user: database not available");
    return undefined;
  }

  const result = await db.select().from(users).where(eq(users.openId, openId)).limit(1);

  return result.length > 0 ? result[0] : undefined;
}

/** 建立一筆客戶查詢，回傳插入的 ID */
export async function createInquiry(inquiry: InsertInquiry) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  const result = await db.insert(inquiries).values(inquiry);
  return { id: result[0].insertId };
}

/** 列出所有客戶查詢（最新在前） */
export async function listInquiries() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list inquiries: database not available");
    return [];
  }
  return db.select().from(inquiries).orderBy(desc(inquiries.createdAt));
}

/** 更新查詢處理狀態 */
export async function updateInquiryStatus(
  id: number,
  status: "new" | "contacted" | "completed" | "cancelled",
) {
  const db = await getDb();
  if (!db) {
    throw new Error("Database not available");
  }
  await db.update(inquiries).set({ status }).where(eq(inquiries.id, id));
  return { success: true } as const;
}

/** 記錄一筆估價計算結果（匿名） */
export async function createEstimateLead(lead: InsertEstimateLead) {
  const db = await getDb();
  if (!db) {
    // 估價記錄屬非關鍵操作，資料庫不可用時靜默略過，不影響前端體驗
    console.warn("[Database] Cannot record estimate lead: database not available");
    return { id: 0 };
  }
  const result = await db.insert(estimateLeads).values(lead);
  return { id: result[0].insertId };
}

/** 列出估價記錄（最新在前，最多 200 筆） */
export async function listEstimateLeads() {
  const db = await getDb();
  if (!db) {
    console.warn("[Database] Cannot list estimate leads: database not available");
    return [];
  }
  return db
    .select()
    .from(estimateLeads)
    .orderBy(desc(estimateLeads.createdAt))
    .limit(200);
}
