/**
 * 通渠熊 DrainBear — 估價結果全域同步 Context
 * 估價計算機完成選擇後，將結果寫入此 Context；
 * 底部 MobileCTABar 讀取後改用預填估價詳情的 WhatsApp 連結及對應文案。
 */
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

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

export interface DiagnosisHandoff {
  /** 不含個人資料的選項摘要，用於轉換事件分類。 */
  topic: string;
  /** 手機 CTA 的簡短狀態提示。 */
  summary: string;
  /** WhatsApp 預填訊息全文。 */
  waMessage: string;
}

interface EstimateContextValue {
  estimate: EstimateResult | null;
  setEstimate: (e: EstimateResult | null) => void;
  diagnosis: DiagnosisHandoff | null;
  setDiagnosis: (diagnosis: DiagnosisHandoff | null) => void;
}

const EstimateContext = createContext<EstimateContextValue>({
  estimate: null,
  setEstimate: () => {},
  diagnosis: null,
  setDiagnosis: () => {},
});

export function EstimateProvider({ children }: { children: ReactNode }) {
  const [estimate, setEstimateState] = useState<EstimateResult | null>(null);
  const [diagnosis, setDiagnosisState] = useState<DiagnosisHandoff | null>(
    null
  );

  const setEstimate = useCallback((nextEstimate: EstimateResult | null) => {
    setEstimateState(nextEstimate);
    if (nextEstimate) setDiagnosisState(null);
  }, []);

  const setDiagnosis = useCallback((nextDiagnosis: DiagnosisHandoff | null) => {
    setDiagnosisState(nextDiagnosis);
    if (nextDiagnosis) setEstimateState(null);
  }, []);

  const value = useMemo(
    () => ({
      estimate,
      diagnosis,
      setEstimate,
      setDiagnosis,
    }),
    [diagnosis, estimate, setDiagnosis, setEstimate]
  );

  return (
    <EstimateContext.Provider value={value}>
      {children}
    </EstimateContext.Provider>
  );
}

export function useEstimate() {
  return useContext(EstimateContext);
}
