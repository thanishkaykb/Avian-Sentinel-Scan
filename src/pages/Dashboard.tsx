import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import { Activity, AlertTriangle, Radio, TrendingUp } from "lucide-react";

const frequencyData = [
  { freq: "100kHz", power: 12 },
  { freq: "500kHz", power: 18 },
  { freq: "1MHz", power: 35 },
  { freq: "5MHz", power: 28 },
  { freq: "10MHz", power: 45 },
  { freq: "25MHz", power: 62 },
  { freq: "50MHz", power: 78 },
  { freq: "88MHz", power: 92 },
  { freq: "100MHz", power: 88 },
  { freq: "108MHz", power: 85 },
  { freq: "120MHz", power: 70 },
  { freq: "145MHz", power: 55 },
];

const heatmapData = [
  { region: "South Asia", intensity: 89 },
  { region: "East Asia", intensity: 95 },
  { region: "Europe", intensity: 78 },
  { region: "N. America", intensity: 82 },
  { region: "S. America", intensity: 35 },
  { region: "Africa", intensity: 42 },
  { region: "Oceania", intensity: 55 },
  { region: "Arctic", intensity: 12 },
];

const timeSeriesData = Array.from({ length: 24 }, (_, i) => ({
  hour: `${i}:00`,
  rf: Math.round(40 + Math.random() * 50 + (i > 6 && i < 22 ? 20 : 0)),
  risk: Math.round(20 + Math.random() * 30 + (i > 6 && i < 22 ? 25 : 0)),
}));

const riskScore = 73;

const Dashboard = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-heading font-bold text-foreground mb-1">Monitoring Dashboard</h1>
      <p className="text-muted-foreground text-sm mb-8">Simulated environmental RF data and migration risk metrics</p>

      {/* Stats row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        {[
          { label: "Active RF Sources", value: "2,847", icon: Radio, change: "+12%" },
          { label: "Migration Routes Tracked", value: "156", icon: Activity, change: "+3" },
          { label: "High Risk Zones", value: "34", icon: AlertTriangle, change: "+5" },
          { label: "Risk Score", value: `${riskScore}/100`, icon: TrendingUp, change: "High" },
        ].map((stat) => (
          <div key={stat.label} className="bg-card border border-border rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <stat.icon className="h-4 w-4 text-muted-foreground" />
              <span className="text-xs font-mono text-primary">{stat.change}</span>
            </div>
            <p className="text-2xl font-heading font-bold text-foreground">{stat.value}</p>
            <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
          </div>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Frequency Spectrum */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-1">RF Frequency Spectrum</h3>
          <p className="text-xs text-muted-foreground mb-4 font-mono">100 kHz – 145 MHz detected frequencies</p>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={frequencyData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,18%)" />
              <XAxis dataKey="freq" tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} />
              <YAxis tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(220,22%,10%)", border: "1px solid hsl(220,20%,18%)", borderRadius: 8, fontSize: 12 }}
                labelStyle={{ color: "hsl(210,20%,90%)" }}
              />
              <Bar dataKey="power" fill="hsl(160,60%,45%)" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Pollution Heatmap */}
        <div className="bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-1">Regional RF Intensity</h3>
          <p className="text-xs text-muted-foreground mb-4 font-mono">Pollution intensity by region</p>
          <div className="space-y-3">
            {heatmapData.map((region) => (
              <div key={region.region} className="flex items-center gap-3">
                <span className="text-xs text-muted-foreground w-20 font-mono">{region.region}</span>
                <div className="flex-1 bg-muted rounded-full h-5 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-700"
                    style={{
                      width: `${region.intensity}%`,
                      background: region.intensity > 75 ? "hsl(var(--danger))" : region.intensity > 50 ? "hsl(var(--moderate))" : "hsl(var(--safe))",
                    }}
                  />
                </div>
                <span className="text-xs font-mono text-foreground w-8 text-right">{region.intensity}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Migration Risk Gauge + Timeline */}
      <div className="grid md:grid-cols-3 gap-6">
        {/* Gauge */}
        <div className="bg-card border border-border rounded-xl p-6 flex flex-col items-center justify-center">
          <h3 className="font-heading font-semibold text-foreground mb-4">Migration Disruption Risk</h3>
          <div className="relative w-40 h-40">
            <svg viewBox="0 0 120 120" className="w-full h-full">
              <circle cx="60" cy="60" r="50" fill="none" stroke="hsl(var(--muted))" strokeWidth="8" />
              <circle
                cx="60" cy="60" r="50" fill="none"
                stroke={riskScore > 70 ? "hsl(var(--danger))" : riskScore > 40 ? "hsl(var(--moderate))" : "hsl(var(--safe))"}
                strokeWidth="8"
                strokeDasharray={`${riskScore * 3.14} 314`}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
              />
              <text x="60" y="55" textAnchor="middle" className="fill-foreground text-2xl font-bold" style={{ fontSize: 24 }}>{riskScore}</text>
              <text x="60" y="72" textAnchor="middle" className="fill-muted-foreground" style={{ fontSize: 10 }}>HIGH RISK</text>
            </svg>
          </div>
          <div className="flex gap-4 mt-4 text-xs font-mono">
            <span className="text-safe">Low &lt;40</span>
            <span className="text-moderate">Med 40-70</span>
            <span className="text-danger">High &gt;70</span>
          </div>
        </div>

        {/* Timeline */}
        <div className="md:col-span-2 bg-card border border-border rounded-xl p-6">
          <h3 className="font-heading font-semibold text-foreground mb-1">24h RF Activity & Risk</h3>
          <p className="text-xs text-muted-foreground mb-4 font-mono">Real-time monitoring simulation</p>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={timeSeriesData}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(220,20%,18%)" />
              <XAxis dataKey="hour" tick={{ fill: "hsl(215,15%,55%)", fontSize: 9 }} interval={3} />
              <YAxis tick={{ fill: "hsl(215,15%,55%)", fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: "hsl(220,22%,10%)", border: "1px solid hsl(220,20%,18%)", borderRadius: 8, fontSize: 12 }}
              />
              <Area type="monotone" dataKey="rf" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.15} strokeWidth={2} />
              <Area type="monotone" dataKey="risk" stroke="hsl(var(--danger))" fill="hsl(var(--danger))" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
