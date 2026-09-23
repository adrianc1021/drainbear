/**
 * DrainBear — temporary WhatsApp handoff context for the optional diagnosis flow.
 *
 * The public site does not expose an online price calculator. This context only
 * carries a diagnosis summary so the shared mobile CTA can keep the user's
 * selected symptoms when they choose to contact the team.
 */
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useMemo,
  useState,
} from "react";

export interface DiagnosisHandoff {
  topic: string;
  summary: string;
  waMessage: string;
}

interface ContactHandoffContextValue {
  diagnosis: DiagnosisHandoff | null;
  setDiagnosis: (diagnosis: DiagnosisHandoff | null) => void;
}

const ContactHandoffContext = createContext<ContactHandoffContextValue>({
  diagnosis: null,
  setDiagnosis: () => {},
});

export function ContactHandoffProvider({ children }: { children: ReactNode }) {
  const [diagnosis, setDiagnosisState] = useState<DiagnosisHandoff | null>(
    null
  );

  const setDiagnosis = useCallback(
    (nextDiagnosis: DiagnosisHandoff | null) => {
      setDiagnosisState(nextDiagnosis);
    },
    []
  );

  const value = useMemo(
    () => ({ diagnosis, setDiagnosis }),
    [diagnosis, setDiagnosis]
  );

  return (
    <ContactHandoffContext.Provider value={value}>
      {children}
    </ContactHandoffContext.Provider>
  );
}

export function useContactHandoff() {
  return useContext(ContactHandoffContext);
}
