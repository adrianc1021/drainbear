/**
 * 每次頁面瀏覽(Component Mount)內的事件去重工具。
 *
 * 由 Component 以 useRef 持有實例,隨 Mount 建立、Unmount 丟棄:
 *
 *   const dedupRef = useRef<PerViewDedup>();
 *   if (!dedupRef.current) dedupRef.current = createPerViewDedup();
 *
 * - 同一次瀏覽內,同一 key 只允許一次(A → B → A 時 A 不會再次通過)
 * - 離開頁面再返回(新 Mount)時,新實例自然重新開始
 *
 * analytics.ts 保持純事件發送 Helper,不持有跨頁面狀態。
 */
export interface PerViewDedup {
  /** key 在本次瀏覽內第一次出現時回傳 true(並記住),之後一律 false */
  once(key: string): boolean;
  /** 查詢 key 是否已記錄(不改變狀態) */
  has(key: string): boolean;
}

export function createPerViewDedup(): PerViewDedup {
  const seen = new Set<string>();
  return {
    once(key: string): boolean {
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    },
    has(key: string): boolean {
      return seen.has(key);
    },
  };
}
