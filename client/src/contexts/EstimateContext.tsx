/**
 * 通渠熊 DrainBear — 估價結果全域同步 Context
 * 估價計算機完成選擇後，將結果寫入此 Context；
 * 底部 MobileCTABar 讀取後改用預填估價詳情的 WhatsApp 連結及對應文案。
 */
import { createContext, ReactNode, useContext, useMemo, useState } from "react";

export interface EstimateResult {
  /** 例如「坐廁 / 馬桶」 */
  location: string;
  /** 例如「私樓 / 屋苑」 */
  building: string;
  /** 例如「日間（07:00–23:00）」 */
  time: string;
  low: number;
  high: number;
  /** WhatsApp 預填訊息全文 */
  waMessage: string;
}

interface EstimateContextValue {
  estimate: EstimateResult | null;
  setEstimate: (e: EstimateResult | null) => void;
}

const EstimateContext = createContext<EstimateContextValue>({
  estimate: null,
  setEstimate: () => {},
});

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [estimate, setEstimate] = useState<EstimateResult | null>(null);
  const value = useMemo(() => ({ estimate, setEstimate }), [estimate]);
  return <EstimateContext.Provider value={value}>{children}</EstimateContext.Provider>;
}

export function useEstimate() {
  return useContext(EstimateContext);
}

