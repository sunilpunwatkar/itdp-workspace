"use client";

import {
  useState,
  useEffect,
  useCallback,
  useRef,
} from "react";

import Header from "./components/Header";
import Sidebar from "./components/Sidebar";
import Dashboard from "./components/Dashboard";
import ChartSection from "./components/ChartSection";
import MarketNews from "./components/MarketNews";
import StockAnalysis from "./components/StockAnalysis";
import SearchBar from "./components/SearchBar";
import OpportunityExperiencePage from "./components/OpportunityExperiencePage";
import type {
  AnalysisResult,
} from "./types/analysis";

import type {
  StockMetadata,
} from "./services/stockMetadataService";
import FullAnalysisPage from "./components/FullAnalysisPage";
import { runSharedClientRequest } from "./services/clientRequestCoordinator";



type AnalysisApiResponse =
  AnalysisResult & {
    metadata?: StockMetadata;
  };
export default function Home() {
  const [activePage, setActivePage] = useState("dashboard");

  const [language, setLanguage] = useState<"en" | "mr">("en");

  const [mobileOpen, setMobileOpen] = useState(false);

const handleMenuToggle = () => {
  setMobileOpen((prev) => !prev);
};

const [symbol, setSymbol] = useState("RELIANCE");

const skipNextAnalysisRef = useRef(false);

const [analysis, setAnalysis] =
    useState<AnalysisApiResponse | null>(
      null
    );

  const [loading, setLoading] = useState(false);

      const handleAnalyze = useCallback(
  async (inputSymbol: string) => {
    const finalSymbol =
      inputSymbol.trim().toUpperCase();

    if (!finalSymbol) return;

    const startedAt = performance.now();

    try {
      setLoading(true);

      console.log("Analyzing :", finalSymbol);

      const data =
        await runSharedClientRequest<AnalysisApiResponse>(
          `analysis:${finalSymbol}`,
          async () => {
            const response = await fetch(
              `/api/analysis?symbol=${encodeURIComponent(finalSymbol)}`,
              { cache: "no-store" }
            );

            if (!response.ok) {
              throw new Error(
                `Analysis API failed: ${response.status}`
              );
            }

            return response.json() as Promise<AnalysisApiResponse>;
          }
        );

      setAnalysis(data);

      console.log(
        `ANALYSIS TOTAL ${finalSymbol}:`,
        `${(performance.now() - startedAt).toFixed(2)} ms`
      );
    } catch (error) {
      console.error("Analysis Error :", error);
    } finally {
      setLoading(false);
    }
  },
  []
);

      const handleOpportunityFullAnalysis =
    useCallback(
      async (opportunitySymbol: string) => {
        try {
          const finalSymbol =
            opportunitySymbol
              .trim()
              .toUpperCase();

          if (!finalSymbol) {
            return;
          }

          setLoading(true);

          const response = await fetch(
            `/api/analysis?symbol=${finalSymbol}&ts=${Date.now()}`,
            {
              cache: "no-store",
            }
          );

          if (!response.ok) {
            throw new Error(
              "Failed to fetch opportunity analysis"
            );
          }

          const data: AnalysisApiResponse =
  await response.json();

skipNextAnalysisRef.current = true;
setSymbol(finalSymbol);
setAnalysis(data);

setActivePage(
  "full-analysis"
);
        } catch (error) {
          console.error(
            "Opportunity Analysis Error :",
            error
          );
        } finally {
          setLoading(false);
        }
      },
      []
    );

  useEffect(() => {
  if (skipNextAnalysisRef.current) {
    skipNextAnalysisRef.current = false;
    return;
  }

  handleAnalyze(symbol);
}, [handleAnalyze, symbol]);

  return (
    <>
      <Header
  mobileOpen={mobileOpen}
  onMenuToggle={handleMenuToggle}
  language={language}
  onLanguageChange={setLanguage}
/>

      <div className="itdp-app-layout">

  <Sidebar
    onMenuClick={setActivePage}
    mobileOpen={mobileOpen}
    onClose={() => setMobileOpen(false)}
  />

  <div className="itdp-main-content">

          {activePage === "dashboard" && (
            <>
              {/* ==========================
                  SEARCH / ANALYZE
              ========================== */}

              <div className="itdp-search-wrapper">
                <SearchBar
                    symbol={symbol}
                    onSymbolChange={setSymbol}
                />
              </div>

              {/* ==========================
                  LOADING
              ========================== */}

              {loading && (
                <p className="itdp-loading">
                  Analyzing...
                </p>
              )}
              <ChartSection
                symbol={symbol}
                resolvedSymbol={
                  analysis?.symbol
                }
                metadata={
                  analysis?.metadata
                }
              />

                            {/* ==========================
                  DASHBOARD
              ========================== */}

              {analysis && (
                <Dashboard
                  key={analysis.symbol}
                  analysis={analysis}
                  language={language}
                  onViewFullAnalysis={() =>
                    setActivePage(
                      "full-analysis"
                    )
                  }
                />
              )}
            </>
          )}

          {/* ==========================
              FULL ANALYSIS
          ========================== */}

          {activePage ===
            "full-analysis" &&
            analysis && (
              <FullAnalysisPage
                analysis={analysis}
                language={language}
                onBack={() =>
                  setActivePage(
                    "dashboard"
                  )
                }
              />
            )}

                    {/* ==========================
              OPPORTUNITIES
          ========================== */}

          {activePage ===
            "opportunities" && (
              <OpportunityExperiencePage
                language={language}
                onViewFullAnalysis={
                  handleOpportunityFullAnalysis
                }
              />
            )}

          {/* ==========================
              MARKET NEWS
          ========================== */}

          {activePage === "marketnews" && (
            <MarketNews />
          )}

          {/* ==========================
              STOCK ANALYSIS
          ========================== */}

          {activePage === "stock" && (
            <StockAnalysis />
          )}

        </div>
      </div>
    </>
  );
}