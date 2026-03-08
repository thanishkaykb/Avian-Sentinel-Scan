import { useState } from "react";
import { Brain, Zap, Building2, Route, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

const PredictionEngine = () => {
  const [rfFreq, setRfFreq] = useState(88);
  const [urbanDensity, setUrbanDensity] = useState(65);
  const [migrationRoute, setMigrationRoute] = useState("Arctic Tern — Polar Route");
  const [result, setResult] = useState<null | { level: string; score: number; detail: string }>(null);
  const [isComputing, setIsComputing] = useState(false);

  const routes = [
    "Arctic Tern — Polar Route",
    "Bar-tailed Godwit — Pacific Flyway",
    "Amur Falcon — Indian Ocean",
    "European Robin — Mediterranean",
    "Barn Swallow — Trans-Saharan",
  ];

  const predict = () => {
    setIsComputing(true);
    setResult(null);
    setTimeout(() => {
      const score = Math.min(100, Math.round((rfFreq / 145) * 40 + (urbanDensity / 100) * 45 + Math.random() * 15));
      const level = score > 70 ? "High" : score > 40 ? "Medium" : "Low";
      const detail =
        level === "High"
          ? "Strong RF interference likely to disrupt magnetoreception in the selected migratory corridor."
          : level === "Medium"
          ? "Moderate risk of navigation interference. Periodic disruption events possible."
          : "Low RF interference expected. Migration corridor relatively clear.";
      setResult({ level, score, detail });
      setIsComputing(false);
    }, 1500);
  };

  const resultColor = result?.level === "High" ? "danger" : result?.level === "Medium" ? "moderate" : "safe";

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Prediction Engine</h1>
      <p className="text-muted-foreground text-sm mb-8">AI-style risk prediction based on RF, urban, and migration data</p>

      <div className="grid lg:grid-cols-2 gap-8 max-w-5xl">
        {/* Input panel */}
        <div className="bg-card border border-border rounded-xl p-6 space-y-6">
          <h3 className="font-heading font-semibold text-foreground flex items-center gap-2">
            <Zap className="h-4 w-4 text-moderate" /> Input Parameters
          </h3>

          <div>
            <label className="text-xs font-mono text-muted-foreground flex items-center gap-1 mb-2">
              <Zap className="h-3 w-3" /> RF Frequency (MHz)
            </label>
            <input
              type="range"
              min={1}
              max={145}
              value={rfFreq}
              onChange={(e) => setRfFreq(Number(e.target.value))}
              className="w-full accent-primary"
            />
            <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1">
              <span>1 MHz</span>
              <span className="text-foreground font-semibold">{rfFreq} MHz</span>
              <span>145 MHz</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground flex items-center gap-1 mb-2">
              <Building2 className="h-3 w-3" /> Urban Density (%)
            </label>
            <input
              type="range"
              min={0}
              max={100}
              value={urbanDensity}
              onChange={(e) => setUrbanDensity(Number(e.target.value))}
              className="w-full accent-moderate"
            />
            <div className="flex justify-between text-xs font-mono text-muted-foreground mt-1">
              <span>Rural</span>
              <span className="text-foreground font-semibold">{urbanDensity}%</span>
              <span>Dense Urban</span>
            </div>
          </div>

          <div>
            <label className="text-xs font-mono text-muted-foreground flex items-center gap-1 mb-2">
              <Route className="h-3 w-3" /> Migration Route
            </label>
            <select
              value={migrationRoute}
              onChange={(e) => setMigrationRoute(e.target.value)}
              className="w-full bg-muted border border-border rounded-md px-3 py-2 text-sm text-foreground font-mono"
            >
              {routes.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </div>

          <Button onClick={predict} className="w-full gap-2" disabled={isComputing}>
            <Brain className="h-4 w-4" />
            {isComputing ? "Computing..." : "Run Prediction"}
            {!isComputing && <ArrowRight className="h-4 w-4" />}
          </Button>
        </div>

        {/* Result panel */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center min-h-[350px]">
          {!result && !isComputing && (
            <div className="text-center">
              <Brain className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground text-sm">Configure parameters and run prediction</p>
            </div>
          )}

          {isComputing && (
            <div className="text-center">
              <div className="w-16 h-16 rounded-full border-2 border-primary border-t-transparent animate-spin mx-auto mb-4" />
              <p className="text-muted-foreground text-sm font-mono">Analyzing RF interference patterns...</p>
            </div>
          )}

          {result && (
            <div className="text-center w-full">
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg viewBox="0 0 120 120" className="w-full h-full">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
                  <circle
                    cx="60" cy="60" r="50" fill="none"
                    stroke={`hsl(var(--${resultColor}))`}
                    strokeWidth="8"
                    strokeDasharray={`${result.score * 3.14} 314`}
                    strokeLinecap="round"
                    transform="rotate(-90 60 60)"
                  />
                  <text x="60" y="55" textAnchor="middle" className="fill-foreground font-bold" style={{ fontSize: 22 }}>{result.score}</text>
                  <text x="60" y="72" textAnchor="middle" style={{ fontSize: 9 }} className="fill-muted-foreground">RISK SCORE</text>
                </svg>
              </div>

              <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-${resultColor}/20 border border-${resultColor} mb-4`}>
                <div className={`w-2.5 h-2.5 rounded-full bg-${resultColor}`} />
                <span className={`text-${resultColor} font-heading font-semibold text-sm`}>
                  {result.level} Risk
                </span>
              </div>

              <p className="text-muted-foreground text-sm max-w-xs mx-auto mt-2">{result.detail}</p>

              <div className="mt-6 p-3 bg-muted rounded-lg text-xs font-mono text-muted-foreground">
                <div>Route: {migrationRoute}</div>
                <div>RF: {rfFreq} MHz | Urban: {urbanDensity}%</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PredictionEngine;
