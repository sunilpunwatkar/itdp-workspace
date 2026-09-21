import type {
  AnalysisResult,
} from "../types/analysis";

import type {
  StockMetadata,
} from "./stockMetadataService";

export type AnalysisApiResponse =
  AnalysisResult & {
    metadata?: StockMetadata;
  };

export function buildAnalysisApiResponse(
  analysis: AnalysisResult,
  metadata: StockMetadata | null
): AnalysisApiResponse {
  if (!metadata) {
    return {
      ...analysis,
    };
  }

  return {
    ...analysis,
    metadata,
  };
}