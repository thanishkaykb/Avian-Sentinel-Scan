import { Bird, Radio, Layers, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

const birdTrackingData = [
  { species: "Arctic Tern", route: "Arctic → Antarctic", lat: "71.7°N", lon: "42.5°W", status: "Active" },
  { species: "Bar-tailed Godwit", route: "Alaska → New Zealand", lat: "13.1°N", lon: "80.3°E", status: "At Risk" },
  { species: "Amur Falcon", route: "Siberia → Southern Africa", lat: "26.9°N", lon: "75.8°E", status: "At Risk" },
  { species: "European Robin", route: "Scandinavia → Mediterranean", lat: "48.9°N", lon: "2.3°E", status: "Moderate" },
  { species: "Barn Swallow", route: "Europe → Sub-Saharan Africa", lat: "51.5°N", lon: "0.1°W", status: "Active" },
  { species: "Swainson's Hawk", route: "N. America → Argentina", lat: "35.2°N", lon: "97.4°W", status: "Active" },
];

const rfSensorData = [
  { location: "Chennai Tower A", freq: "110 MHz", strength: "-42 dBm", status: "High" },
  { location: "Mumbai Sector 7", freq: "98 MHz", strength: "-38 dBm", status: "High" },
  { location: "Delhi NCR Station", freq: "88 MHz", strength: "-45 dBm", status: "Moderate" },
  { location: "Rural Karnataka", freq: "25 MHz", strength: "-72 dBm", status: "Low" },
  { location: "Bangalore Urban", freq: "105 MHz", strength: "-40 dBm", status: "High" },
  { location: "Coastal Kerala", freq: "45 MHz", strength: "-60 dBm", status: "Low" },
];

const gisOverlaps = [
  { zone: "Chennai-Godwit Corridor", overlap: 87, risk: "Critical" },
  { zone: "Delhi-Robin Flyway", overlap: 62, risk: "High" },
  { zone: "Mumbai-Falcon Path", overlap: 74, risk: "High" },
  { zone: "Karnataka-Hawk Route", overlap: 23, risk: "Low" },
  { zone: "Kerala Coastal Path", overlap: 31, risk: "Moderate" },
];

const statusColor = (s: string) => {
  if (s === "High" || s === "At Risk" || s === "Critical") return "text-danger";
  if (s === "Moderate") return "text-moderate";
  return "text-safe";
};

const ResearchData = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-heading font-bold text-foreground">Research Data Panel</h1>
          <p className="text-muted-foreground text-sm mt-1">Simulated sensor readings, tracking data, and GIS analysis</p>
        </div>
        <Button variant="outline" size="sm" className="gap-2">
          <Download className="h-3.5 w-3.5" /> Export CSV
        </Button>
      </div>

      <div className="grid lg:grid-cols-2 gap-6 mb-6">
        {/* Bird Tracking */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Bird className="h-4 w-4 text-primary" />
            <h3 className="font-heading font-semibold text-foreground">Bird Tracking Data</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left py-2 pr-3">Species</th>
                  <th className="text-left py-2 pr-3">Route</th>
                  <th className="text-left py-2 pr-3">Lat</th>
                  <th className="text-left py-2 pr-3">Lon</th>
                  <th className="text-left py-2">Status</th>
                </tr>
              </thead>
              <tbody>
                {birdTrackingData.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 pr-3 text-foreground">{row.species}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{row.route}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{row.lat}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{row.lon}</td>
                    <td className={`py-2 ${statusColor(row.status)}`}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* RF Sensor Readings */}
        <div className="bg-card border border-border rounded-xl p-6">
          <div className="flex items-center gap-2 mb-4">
            <Radio className="h-4 w-4 text-danger" />
            <h3 className="font-heading font-semibold text-foreground">RF Sensor Readings</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs font-mono">
              <thead>
                <tr className="text-muted-foreground border-b border-border">
                  <th className="text-left py-2 pr-3">Location</th>
                  <th className="text-left py-2 pr-3">Frequency</th>
                  <th className="text-left py-2 pr-3">Signal</th>
                  <th className="text-left py-2">Level</th>
                </tr>
              </thead>
              <tbody>
                {rfSensorData.map((row, i) => (
                  <tr key={i} className="border-b border-border/50">
                    <td className="py-2 pr-3 text-foreground">{row.location}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{row.freq}</td>
                    <td className="py-2 pr-3 text-muted-foreground">{row.strength}</td>
                    <td className={`py-2 ${statusColor(row.status)}`}>{row.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* GIS Spatial Analysis */}
      <div className="bg-card border border-border rounded-xl p-6">
        <div className="flex items-center gap-2 mb-4">
          <Layers className="h-4 w-4 text-moderate" />
          <h3 className="font-heading font-semibold text-foreground">GIS Spatial Analysis — RF + Bird Path Overlap</h3>
        </div>
        <div className="space-y-3">
          {gisOverlaps.map((zone) => (
            <div key={zone.zone} className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground w-48 font-mono">{zone.zone}</span>
              <div className="flex-1 bg-muted rounded-full h-4 overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{
                    width: `${zone.overlap}%`,
                    background: zone.overlap > 70 ? "hsl(var(--danger))" : zone.overlap > 40 ? "hsl(var(--moderate))" : "hsl(var(--safe))",
                  }}
                />
              </div>
              <span className="text-xs font-mono w-10 text-right text-foreground">{zone.overlap}%</span>
              <span className={`text-xs font-mono w-16 text-right ${statusColor(zone.risk)}`}>{zone.risk}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ResearchData;
