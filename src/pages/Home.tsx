import { useState, useEffect } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { ArrowRight, Sparkles, CheckCircle2, Quote } from "lucide-react";
import { services } from "@/data/services";
import { useSEO } from "@/hooks/useSEO";
import { useReveal } from "@/hooks/useReveal";
import { Hero3D } from "@/components/Hero3D";
import { useTheme } from "@/hooks/useTheme";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

const testimonials = [
  {
    quote: "Aspiria reshaped our go-to-market and we hit profitability six months ahead of plan.",
    name: "Priya Sharma",
    role: "Founder, NovaTech",
  },
  {
    quote: "Their branding and web work transformed how investors perceive us. Truly premium partner.",
    name: "Rahul Mehta",
    role: "CEO, GreenLeaf SME",
  },
  {
    quote: "The training program leveled up our entire leadership team in just eight weeks.",
    name: "Anita Desai",
    role: "COO, CraftHub",
  },
];

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

const Home = () => {
  const [api, setApi] = useState<any>(null);
  const { theme } = useTheme();
  const isDark = theme === "dark";

  useEffect(() => {
    if (!api) return;
    const interval = setInterval(() => {
      api.scrollNext();
    }, 5000);
    return () => clearInterval(interval);
  }, [api]);

  useSEO({
    title: "Aspiria — Where Aspirations Take Flight | Consulting for SMEs & Startups",
    description: "Strategic, marketing, technology, training, and investor solutions to help SMEs and startups grow, innovate, and achieve their aspirations.",
    canonical: "https://aspiria.com/",
  });  return (
    <Layout>
      {/* HERO */}
      <section className="relative overflow-hidden gradient-soft pt-6 pb-16 md:pt-8 md:pb-24">
        <div className="absolute inset-0 -z-10 opacity-30">
          <div className="absolute top-20 -left-20 w-96 h-96 rounded-full bg-primary/20 blur-3xl animate-float" />
          <div className="absolute bottom-10 -right-20 w-96 h-96 rounded-full bg-primary-glow/20 blur-3xl animate-float" style={{ animationDelay: "2s" }} />
        </div>

        <div className="container mx-auto px-4 flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left z-10 space-y-6 pt-6 lg:pt-0">
            <div className="inline-flex items-center gap-2 px-4.5 py-1.5 rounded-full bg-primary/[0.05] dark:bg-primary/[0.03] border border-primary/10 text-primary text-xs font-semibold tracking-wide mb-2 animate-fade-in">
              <Sparkles className="w-3.5 h-3.5" /> One-stop consulting for SMEs & startups
            </div>
            <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold leading-[1.08] tracking-tight lg:tracking-tighter animate-fade-in-up">
              Where Aspirations <br className="hidden lg:block" />
              <span className="gradient-text">Take Flight</span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground lg:max-w-xl leading-relaxed animate-fade-in-up mx-auto lg:mx-0" style={{ animationDelay: "150ms" }}>
              Aspiria empowers small and medium enterprises and startups with strategy, marketing, technology, and training — built to help your business grow, innovate, and lead.
            </p>
            <div className="flex flex-col sm:flex-row gap-3.5 justify-center lg:justify-start animate-fade-in-up pt-2" style={{ animationDelay: "300ms" }}>
              <Button asChild size="lg" className="gradient-hero text-white border-0 shadow-elegant hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] transition-smooth rounded-xl font-semibold px-6">
                <Link to="/services">Get Started <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="bg-background/40 backdrop-blur hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-smooth rounded-xl border-border px-6">
                <Link to="/contact">Book Consultation</Link>
              </Button>
            </div>
          </div>
          <div className="flex-1 w-full relative h-[400px] lg:h-[580px] animate-fade-in -mt-6 lg:mt-0" style={{ animationDelay: "400ms" }}>
            <Hero3D />
          </div>
        </div>
      </section>

      {/* SERVICES PREVIEW */}
      <section className="container mx-auto px-4 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">What we do</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Solutions that drive real growth</h2>
            <p className="text-muted-foreground text-base">Ten focused practice areas. One trusted partner.</p>
          </div>
        </Reveal>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.slice(0, 8).map(({ icon: Icon, title, description }, i) => (
            <Reveal key={title} delay={i * 60}>
              <div className="group relative p-7 rounded-2xl bg-card border border-border/80 shadow-sm hover-lift h-full flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/[0.06] dark:bg-primary/[0.03] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary group-hover:shadow-glow transition-smooth">
                    <Icon className="w-5.5 h-5.5 text-primary group-hover:text-white transition-smooth" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground tracking-tight">{title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed line-clamp-3">{description}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <div className="text-center mt-12">
          <Button asChild variant="outline" size="lg" className="rounded-xl border-border hover:bg-slate-100 hover:scale-[1.02] active:scale-[0.98] transition-smooth px-6 font-semibold">
            <Link to="/services">View all 10 services <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
          </Button>
        </div>
      </section>

      {/* WHY STRIP */}
      <section className="py-24 bg-slate-50/50 dark:bg-secondary/15 border-y border-border/50">
        <div className="container mx-auto px-4 grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-6 space-y-6">
            <Reveal>
              <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-2">Why Aspiria</p>
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 leading-tight">A premium partner committed to measurable results</h2>
              <p className="text-muted-foreground text-base leading-relaxed mb-6">
                We combine senior expertise with hands-on execution. Every engagement is personalized, every milestone is measurable.
              </p>
              <ul className="space-y-3.5">
                {[
                  "Personalized roadmaps for every business",
                  "Senior consultants on every engagement",
                  "Transparent pricing and clear deliverables",
                  "Investor & partner network access",
                ].map((t) => (
                  <li key={t} className="flex items-start gap-3 text-sm text-foreground/90">
                    <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
              <Button asChild className="mt-8 gradient-hero text-white border-0 shadow-elegant hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] transition-smooth rounded-xl font-semibold px-6">
                <Link to="/why-us">Learn more</Link>
              </Button>
            </Reveal>
          </div>
          <div className="lg:col-span-6">
            <Reveal delay={100}>
              <div className="relative">
                <div className="aspect-square max-w-[480px] mx-auto rounded-3xl gradient-hero shadow-elegant p-1">
                  <div className="w-full h-full rounded-3xl bg-card flex items-center justify-center p-6 md:p-8">
                    <div className="grid grid-cols-2 gap-4 w-full">
                      {[
                        { n: "100+", l: "Businesses Supported" },
                        { n: "50+", l: "Certifications Issued" },
                        { n: "25+", l: "Investor Intros" },
                        { n: "95%", l: "Client Retention" },
                      ].map((s) => (
                        <div key={s.l} className="rounded-2xl border border-border/80 bg-slate-50/50 dark:bg-secondary/40 p-5 text-center hover-lift duration-300">
                          <div className="text-3xl md:text-4xl font-extrabold gradient-text tracking-tight">{s.n}</div>
                          <div className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider mt-2">{s.l}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="container mx-auto px-4 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-2">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">Success stories</p>
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Trusted by ambitious founders</h2>
          </div>
        </Reveal>
        <div className="max-w-4xl mx-auto">
          <Carousel setApi={setApi} opts={{ loop: true }} className="w-full">
            <CarouselContent>
              {testimonials.map((t, i) => (
                <CarouselItem key={t.name} className="basis-1/1">
                  <div className="relative p-10 md:p-14 rounded-3xl bg-card border border-border/80 shadow-elegant flex flex-col justify-between min-h-[260px] mx-1">
                    <Quote className="absolute top-8 right-8 w-12 h-12 text-primary/10" />
                    <div className="space-y-8">
                      <p className="text-lg md:text-xl text-foreground/90 leading-relaxed italic font-medium">"{t.quote}"</p>
                      <div className="border-t border-border/50 pt-5 flex items-center gap-4.5">
                        <div className="w-12 h-12 rounded-2xl gradient-hero flex items-center justify-center text-white font-bold text-base shadow-sm shrink-0">
                          {t.name.split(' ').map(n => n[0]).join('')}
                        </div>
                        <div>
                          <div className="font-bold text-foreground tracking-tight text-base">{t.name}</div>
                          <div className="text-xs text-muted-foreground mt-1">{t.role}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden md:flex justify-end gap-3 mt-6">
              <CarouselPrevious className="relative translate-y-0 left-0 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-smooth border border-border" />
              <CarouselNext className="relative translate-y-0 right-0 hover:bg-slate-100 hover:scale-105 active:scale-95 transition-smooth border border-border" />
            </div>
          </Carousel>
        </div>
      </section>

      {/* CTA */}
      <section className="container mx-auto px-4 pb-24">
        <div className="rounded-3xl gradient-hero p-10 md:p-20 text-center text-white shadow-elegant relative overflow-hidden">
          <div className="absolute -top-20 -right-20 w-80 h-80 rounded-full bg-white/[0.08] blur-3xl animate-pulse" />
          <div className="absolute -bottom-20 -left-20 w-80 h-80 rounded-full bg-white/[0.05] blur-3xl animate-pulse" />
          <div className="relative space-y-6 max-w-2xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight leading-tight">Let's turn your aspirations into reality</h2>
            <p className="opacity-90 text-base md:text-lg max-w-xl mx-auto leading-relaxed">
              Book a free 30-minute discovery call. Walk away with a clear next step — no obligations.
            </p>
            <Button asChild size="lg" className="bg-white text-primary hover:bg-white/95 hover:scale-[1.02] active:scale-[0.98] transition-smooth rounded-xl font-bold shadow-lg px-8 py-3.5 border-0">
              <Link to="/contact">Book Consultation <ArrowRight className="w-4 h-4 ml-1.5" /></Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Home;
