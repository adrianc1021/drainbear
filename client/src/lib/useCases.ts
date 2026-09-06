import { useEffect, useState } from "react";
import {
  fetchCaseStudies,
  fetchCaseStudyBySlug,
  fetchFeaturedCaseStudies,
  type CaseStudyView,
} from "@/lib/caseRepository";

interface CaseListState {
  studies: CaseStudyView[];
  isLoading: boolean;
  error: Error | null;
}

interface CaseDetailState {
  study: CaseStudyView | null;
  isLoading: boolean;
  error: Error | null;
}

function toError(error: unknown) {
  return error instanceof Error ? error : new Error("暫時無法讀取工程案例");
}

function useCaseList(loader: () => Promise<CaseStudyView[]>, key: string) {
  const [state, setState] = useState<CaseListState>({
    studies: [],
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState(previous => ({ ...previous, isLoading: true, error: null }));

    loader()
      .then(studies => {
        if (active) setState({ studies, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) setState({ studies: [], isLoading: false, error: toError(error) });
      });

    return () => {
      active = false;
    };
  }, [key]);

  return state;
}

export function useCaseStudies() {
  return useCaseList(fetchCaseStudies, "all");
}

export function useFeaturedCaseStudies(limit = 3) {
  return useCaseList(() => fetchFeaturedCaseStudies(limit), `featured-${limit}`);
}

export function useCaseStudy(slug: string): CaseDetailState {
  const [state, setState] = useState<CaseDetailState>({
    study: null,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    let active = true;
    setState({ study: null, isLoading: true, error: null });

    fetchCaseStudyBySlug(slug)
      .then(study => {
        if (active) setState({ study, isLoading: false, error: null });
      })
      .catch((error: unknown) => {
        if (active) setState({ study: null, isLoading: false, error: toError(error) });
      });

    return () => {
      active = false;
    };
  }, [slug]);

  return state;
}
