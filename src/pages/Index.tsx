import { Link } from "react-router-dom";
import { Bird, Radio, Compass, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/button";

const Index = () => {
  return (
    <div className="relative overflow-hidden">
      {/* Animated birds */}
      <div className="absolute top-20 left-0 opacity-20 animate-bird-fly" style={{ animationDelay: "0s" }}>
        <Bird className="h-6 w-6 text-primary" />
      </div>
      <div className="absolute top-32 left-0 opacity-15 animate-bird-fly" style={{ animationDelay: "3s" }}>
        <Bird className="h-4 w-4 text-primary" />
      </div>
      <div className="absolute top-44 left-0 opacity-10 animate-bird-fly" style={{ animationDelay: "6s" }}>
        <Bird className="h-5 w-5 text-primary" />
      </div>

      {/* RF pulse rings */}
      <div className="absolute top-40 right-40 opacity-20">
        <div className="w-16 h-16 rounded-full border border-danger animate-pulse-rf" />
      </div>
      <div className="absolute top-60 right-60 opacity-15">
        <div className="w-12 h-12 rounded-full border border-moderate animate-pulse-rf" style={{ animationDelay: "1s" }} />
      </div>

      {/* Hero */}
      <section className="container mx-auto px-4 py-24 md:py-36 text-center relative z-10">
        <div className="flex justify-center mb-6">
          <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20 glow-primary">
            <Shield className="h-8 w-8 text-primary" />
          </div>
        </div>
        <p className="text-primary font-mono text-sm tracking-widest uppercase mb-4">
          Avian RF Shield
        </p>
        <h1 className="text-4xl md:text-6xl font-heading font-bold text-foreground leading-tight max-w-4xl mx-auto mb-6">
          Electromagnetic Pollution{" "}
          <span className="text-primary">& Bird Migration</span>
        </h1>
        <p className="text-muted-foreground text-lg md:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
          Birds navigate using Earth's magnetic field, but human-generated RF signals may interfere
          with this delicate magnetoreception system. We map the invisible threats.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button asChild size="lg" className="gap-2">
            <Link to="/risk-map">
              <Compass className="h-4 w-4" />
              View Risk Map
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="gap-2">
            <Link to="/dashboard">
              <Radio className="h-4 w-4" />
              Explore Data Dashboard
            </Link>
          </Button>
        </div>

        <p className="text-muted-foreground/60 text-sm font-mono mt-16 tracking-wide">
          Mapping Invisible Threats to Protect Migratory Birds
        </p>
      </section>

      {/* Feature cards */}
      <section className="container mx-auto px-4 pb-24">
        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {[
            {
              icon: Radio,
              title: "RF Detection",
              desc: "Monitor electromagnetic radiofrequency pollution across regions in real-time.",
              color: "text-danger",
              link: "/dashboard",
            },
            {
              icon: Bird,
              title: "Bird Tracking",
              desc: "Overlay migratory bird routes with RF pollution data to identify interference zones.",
              color: "text-primary",
              link: "/risk-map",
            },
            {
              icon: Compass,
              title: "Risk Analysis",
              desc: "Predict magnetoreception disruption using spatial analysis and frequency data.",
              color: "text-moderate",
              link: "/prediction",
            },
          ].map((feature) => (
            <Link
              key={feature.title}
              to={feature.link}
              className="bg-card border border-border rounded-xl p-6 hover:border-primary/30 transition-colors group block"
            >
              <feature.icon className={`h-6 w-6 ${feature.color} mb-4`} />
              <h3 className="font-heading font-semibold text-foreground mb-2">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{feature.desc}</p>
              <ArrowRight className="h-4 w-4 text-muted-foreground mt-4 group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Index;
