import { useState, useEffect } from "react";
import { X, Radio, Bird, MapPin, Loader2, RefreshCw } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";

interface BirdObservation {
  id: number;
  comName: string;
  sciName: string;
  locName: string;
  lat: number;
  lng: number;
  obsDt: string;
  howMany?: number;
  photoUrl?: string | null;
}

const hotspots = [
  { id: 1, x: 72, y: 42, name: "Chennai Urban Zone", freq: "110 MHz", level: "High", risk: "danger", species: "Bar-tailed Godwit, Amur Falcon", note: "Possible magnetoreception disruption" },
  { id: 2, x: 25, y: 35, name: "New York Metro", freq: "98 MHz", level: "High", risk: "danger", species: "Arctic Tern, Blackpoll Warbler", note: "Dense urban RF interference" },
  { id: 3, x: 48, y: 30, name: "Central Europe", freq: "72 MHz", level: "Moderate", risk: "moderate", species: "European Robin, White Stork", note: "Moderate RF noise detected" },
  { id: 4, x: 82, y: 55, name: "East Australia", freq: "45 MHz", level: "Low", risk: "safe", species: "Swift Parrot, Orange-bellied Parrot", note: "Minimal RF interference" },
  { id: 5, x: 55, y: 60, name: "Indian Ocean Corridor", freq: "30 MHz", level: "Low", risk: "safe", species: "Sooty Tern", note: "Open ocean, low RF" },
  { id: 6, x: 15, y: 55, name: "Amazon Basin", freq: "25 MHz", level: "Low", risk: "safe", species: "Swainson's Hawk", note: "Low population density" },
  { id: 7, x: 50, y: 25, name: "London-Paris Corridor", freq: "105 MHz", level: "High", risk: "danger", species: "Barn Swallow, Common Cuckoo", note: "High urban RF density" },
  { id: 8, x: 85, y: 35, name: "Tokyo Bay Area", freq: "95 MHz", level: "High", risk: "danger", species: "Grey-faced Buzzard", note: "Extreme RF saturation" },
];

const migrationPaths = [
  { id: "arctic-tern", points: "10,20 25,35 40,50 55,60 70,55 80,40", color: "hsl(var(--primary))" },
  { id: "bar-tailed", points: "82,55 75,45 72,42 65,35 55,28", color: "hsl(var(--rf-pulse))" },
  { id: "amur-falcon", points: "72,42 65,50 55,55 45,60 30,58", color: "hsl(var(--moderate))" },
];

// Convert lat/lng to approximate map position (simple equirectangular)
const geoToMap = (lat: number, lng: number) => ({
  x: ((lng + 180) / 360) * 100,
  y: ((90 - lat) / 180) * 100 * 1.1, // slight stretch for aspect ratio
});

const RiskMap = () => {
  const [selected, setSelected] = useState<typeof hotspots[0] | null>(null);
  const [selectedBird, setSelectedBird] = useState<EBirdObservation | null>(null);
  const [eBirdData, setEBirdData] = useState<EBirdObservation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRegion = async (lat: number, lng: number, dist = 50) => {
    const { data, error: fnError } = await supabase.functions.invoke('ebird-observations', {
      body: { lat, lng, dist, maxResults: 20 },
    });
    if (fnError) throw fnError;
    if (data?.error) throw new Error(data.error);
    return data as EBirdObservation[];
  };

  const fetchAllRegions = async () => {
    setLoading(true);
    setError(null);
    try {
      const regions = [
        { lat: 13.08, lng: 80.27, dist: 50 },  // Chennai
        { lat: 40.71, lng: -74.01, dist: 50 },  // New York
        { lat: 48.86, lng: 2.35, dist: 50 },    // Paris/Europe
        { lat: -33.87, lng: 151.21, dist: 50 },  // Sydney
        { lat: 35.68, lng: 139.69, dist: 50 },  // Tokyo
      ];
      const results = await Promise.all(regions.map(r => fetchRegion(r.lat, r.lng, r.dist)));
      setEBirdData(results.flat());
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch eBird data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllRegions();
  }, []);

  const riskColor = (risk: string) => {
    if (risk === "danger") return "bg-danger";
    if (risk === "moderate") return "bg-moderate";
    return "bg-safe";
  };

  const riskBorder = (risk: string) => {
    if (risk === "danger") return "border-danger";
    if (risk === "moderate") return "border-moderate";
    return "border-safe";
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">RF Pollution Risk Map</h1>
          <p className="text-muted-foreground text-sm mt-1">Interactive view of RF interference along migratory routes — with live eBird data</p>
        </div>
        <div className="flex items-center gap-4 text-xs font-mono">
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-safe" /> Safe</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-moderate" /> Moderate</span>
          <span className="flex items-center gap-1.5"><span className="w-2.5 h-2.5 rounded-full bg-danger" /> High Risk</span>
          <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-primary border border-primary-foreground" /> eBird</span>
        </div>
      </div>

      {/* eBird status bar */}
      <div className="flex items-center gap-3 mb-4 text-xs font-mono text-muted-foreground">
        {loading && <><Loader2 className="h-3 w-3 animate-spin" /> Fetching live eBird observations…</>}
        {!loading && eBirdData.length > 0 && (
          <span className="text-safe">{eBirdData.length} live bird observations loaded</span>
        )}
        {error && <span className="text-danger">{error}</span>}
        <Button variant="ghost" size="sm" className="h-6 px-2 text-xs gap-1" onClick={fetchAllRegions} disabled={loading}>
          <RefreshCw className="h-3 w-3" /> Refresh
        </Button>
      </div>

      <div className="relative bg-card border border-border rounded-xl overflow-hidden" style={{ aspectRatio: "2/1" }}>
        {/* Grid overlay */}
        <svg className="absolute inset-0 w-full h-full opacity-10" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="grid" width="5%" height="10%" patternUnits="objectBoundingBox">
              <path d="M 100 0 L 0 0 0 100" fill="none" stroke="hsl(var(--foreground))" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
        </svg>

        {/* Simplified continent shapes */}
        <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 60" preserveAspectRatio="none">
          <polygon points="5,18 12,15 18,18 22,22 25,30 28,35 22,38 18,42 15,50 12,55 8,52 5,45 3,35 4,25" fill="hsl(var(--muted))" opacity="0.3" />
          <polygon points="35,15 42,12 50,15 55,20 52,28 48,32 45,30 40,25 38,20" fill="hsl(var(--muted))" opacity="0.3" />
          <polygon points="35,38 42,35 48,38 50,42 48,48 42,50 38,48 36,42" fill="hsl(var(--muted))" opacity="0.3" />
          <polygon points="62,20 68,18 75,22 78,30 82,35 85,40 88,45 92,50 88,55 82,52 78,48 75,42 72,38 68,42 65,38 62,32 60,28" fill="hsl(var(--muted))" opacity="0.3" />
          <polygon points="78,50 82,48 88,52 92,56 88,58 82,58 78,55" fill="hsl(var(--muted))" opacity="0.3" />
          <polygon points="82,30 88,28 95,32 92,38 88,35 85,32" fill="hsl(var(--muted))" opacity="0.3" />

          {/* Migration paths */}
          {migrationPaths.map((path) => (
            <polyline
              key={path.id}
              points={path.points}
              fill="none"
              stroke={path.color}
              strokeWidth="0.3"
              strokeDasharray="1,1"
              opacity="0.5"
            />
          ))}
        </svg>

        {/* RF Hotspots */}
        {hotspots.map((spot) => (
          <button
            key={spot.id}
            className="absolute group z-10"
            style={{ left: `${spot.x}%`, top: `${spot.y}%`, transform: "translate(-50%, -50%)" }}
            onClick={() => { setSelected(spot); setSelectedBird(null); }}
          >
            <div className={`w-4 h-4 rounded-full ${riskColor(spot.risk)} opacity-80 group-hover:opacity-100 transition-opacity`} />
            <div className={`absolute inset-0 w-4 h-4 rounded-full ${riskColor(spot.risk)} animate-pulse-rf`} />
          </button>
        ))}

        {/* eBird observation dots */}
        {eBirdData.map((obs, i) => {
          const pos = geoToMap(obs.lat, obs.lng);
          return (
            <button
              key={`ebird-${i}`}
              className="absolute group z-10"
              style={{ left: `${pos.x}%`, top: `${pos.y}%`, transform: "translate(-50%, -50%)" }}
              onClick={() => { setSelectedBird(obs); setSelected(null); }}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-primary opacity-70 group-hover:opacity-100 transition-opacity border border-primary-foreground/30" />
            </button>
          );
        })}

        {/* Scan line */}
        <div className="absolute inset-y-0 w-px bg-primary/30 animate-scan-line" />

        {/* Selected RF hotspot card */}
        {selected && (
          <div className={`absolute right-4 top-4 w-72 bg-card border ${riskBorder(selected.risk)} rounded-lg p-4 z-20 shadow-xl`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span className="font-heading font-semibold text-sm text-foreground">{selected.name}</span>
              </div>
              <button onClick={() => setSelected(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">RF Frequency</span>
                <span className="text-foreground">{selected.freq}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Pollution Level</span>
                <span className={selected.risk === "danger" ? "text-danger" : selected.risk === "moderate" ? "text-moderate" : "text-safe"}>
                  {selected.level}
                </span>
              </div>
              <div className="border-t border-border pt-2 mt-2">
                <div className="flex items-center gap-1 text-muted-foreground mb-1">
                  <Bird className="h-3 w-3" /> Species Affected
                </div>
                <p className="text-foreground">{selected.species}</p>
              </div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Radio className="h-3 w-3" />
                <span>{selected.note}</span>
              </div>
            </div>
          </div>
        )}

        {/* Selected eBird observation card */}
        {selectedBird && (
          <div className="absolute right-4 top-4 w-72 bg-card border border-primary rounded-lg p-4 z-20 shadow-xl">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Bird className="h-4 w-4 text-primary" />
                <span className="font-heading font-semibold text-sm text-foreground">eBird Observation</span>
              </div>
              <button onClick={() => setSelectedBird(null)} className="text-muted-foreground hover:text-foreground">
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="space-y-2 text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Species</span>
                <span className="text-foreground text-right max-w-[140px]">{selectedBird.comName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Scientific</span>
                <span className="text-muted-foreground italic text-right max-w-[140px]">{selectedBird.sciName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Location</span>
                <span className="text-foreground text-right max-w-[140px]">{selectedBird.locName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Date</span>
                <span className="text-foreground">{selectedBird.obsDt}</span>
              </div>
              {selectedBird.howMany && (
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Count</span>
                  <span className="text-primary">{selectedBird.howMany}</span>
                </div>
              )}
              <div className="flex justify-between">
                <span className="text-muted-foreground">Coords</span>
                <span className="text-foreground">{selectedBird.lat.toFixed(2)}°, {selectedBird.lng.toFixed(2)}°</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RiskMap;
