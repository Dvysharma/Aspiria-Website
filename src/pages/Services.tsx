import { Layout } from "@/components/Layout";
import { useSEO } from "@/hooks/useSEO";
import { useReveal } from "@/hooks/useReveal";
import { services } from "@/data/services";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Check } from "lucide-react";

const Reveal = ({ children, delay = 0 }: { children: React.ReactNode; delay?: number }) => {
  const { ref, shown } = useReveal();
  return (
    <div
      ref={ref}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ${shown ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}
    >
      {children}
    </div>
  );
};

const Services = () => {
  useSEO({
    title: "Services | Aspiria — Strategy, Marketing, Tech, Training & More",
    description: "Explore Aspiria's 10 consulting services: strategic planning, startup consulting, digital marketing, web development, branding, training, analytics, certification, and investor connections.",
    canonical: "https://aspiria.com/services",
  });

  return (
    <Layout>
      <section className="gradient-soft py-20 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-fade-in">Our services</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
            Everything you need to <span className="gradient-text">grow with confidence</span>
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            Ten integrated practice areas, one accountable partner. Pick what you need today, scale what you need tomorrow.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-24">
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map(({ icon: Icon, title, description, points }, i) => (
            <Reveal key={title} delay={(i % 3) * 80}>
              <div className="group relative h-full p-8 rounded-2xl bg-card border border-border/80 shadow-sm hover-lift flex flex-col justify-between overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/[0.04] via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-smooth pointer-events-none" />
                <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full gradient-hero opacity-0 group-hover:opacity-[0.08] transition-smooth blur-2xl pointer-events-none" />
                <div>
                  <div className="w-14 h-14 rounded-2xl bg-primary/[0.06] dark:bg-primary/[0.03] flex items-center justify-center mb-6 group-hover:scale-110 group-hover:bg-primary group-hover:shadow-glow transition-smooth">
                    <Icon className="w-6.5 h-6.5 text-primary group-hover:text-white transition-smooth" />
                  </div>
                  <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">{title}</h3>
                  <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{description}</p>
                  <ul className="space-y-3 border-t border-border/50 pt-5">
                    {points.map((p) => (
                      <li key={p} className="flex items-start gap-2.5 text-sm text-foreground/90">
                        <Check className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span>{p}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="mt-20 text-center">
          <div className="inline-flex flex-col md:flex-row items-center gap-6 p-8 rounded-2xl bg-slate-50 dark:bg-secondary/20 border border-border/80 shadow-sm max-w-2xl mx-auto">
            <div className="text-left space-y-1">
              <h3 className="text-xl font-bold tracking-tight">Not sure where to start?</h3>
              <p className="text-muted-foreground text-sm">We'll recommend the right service in a 30-minute discovery call.</p>
            </div>
            <Button asChild size="lg" className="gradient-hero text-white border-0 shrink-0 shadow-elegant hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] transition-smooth rounded-xl px-6 font-semibold">
              <Link to="/contact">Book Consultation <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Services;
