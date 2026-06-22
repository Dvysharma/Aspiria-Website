import { Layout } from "@/components/Layout";
import { useSEO } from "@/hooks/useSEO";
import { useReveal } from "@/hooks/useReveal";
import { useCountUp } from "@/hooks/useCountUp";
import { Award, Clock, Globe2, HeartHandshake, ShieldCheck, Sparkles, TrendingUp, Users } from "lucide-react";

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

const Counter = ({ target, suffix = "", label }: { target: number; suffix?: string; label: string }) => {
  const { value, ref } = useCountUp(target);
  return (
    <div className="text-center p-6 rounded-2xl bg-card border border-border/80 shadow-sm hover-lift duration-300">
      <div className="text-4xl md:text-5xl font-extrabold gradient-text tracking-tight mb-1.5">
        <span ref={ref}>{value}</span>
        {suffix}
      </div>
      <div className="text-xs uppercase tracking-wider font-semibold text-muted-foreground">{label}</div>
    </div>
  );
};

const WhyUs = () => {
  useSEO({
    title: "Why Choose Aspiria | Personalized, Proven, Measurable",
    description: "Discover why SMEs and startups choose Aspiria — personalized strategies, senior expertise, measurable results, and a trusted partner network.",
    canonical: "https://aspiria.com/why-us",
  });

  const reasons = [
    { icon: Sparkles, title: "Personalized approach", text: "No copy-paste playbooks. Every engagement is shaped around your goals and reality." },
    { icon: Award, title: "Senior expertise", text: "Veteran consultants — not interns — drive your strategy and execution." },
    { icon: TrendingUp, title: "Measurable results", text: "Clear KPIs, transparent reporting, and outcomes you can take to your board." },
    { icon: Users, title: "Trusted network", text: "Investors, partners, and specialists ready to plug in when you need them." },
    { icon: ShieldCheck, title: "Quality assured", text: "Every deliverable passes our internal quality bar before it reaches you." },
    { icon: HeartHandshake, title: "Long-term partnership", text: "We're with you beyond the project — for the journey." },
  ];

  const process = [
    { step: "01", title: "Discover", text: "We listen, audit, and align on what success looks like for you." },
    { step: "02", title: "Design", text: "We craft a tailored strategy with clear milestones and metrics." },
    { step: "03", title: "Deliver", text: "Senior consultants execute, hands-on, with your team." },
    { step: "04", title: "Drive", text: "We measure, iterate, and compound results month after month." },
  ];

  return (
    <Layout>
      <section className="gradient-soft py-20 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-fade-in">Why Aspiria</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
            The consulting partner <span className="gradient-text">founders trust</span>
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            We're not just consultants. We're the team your team turns to when ambition meets reality.
          </p>
        </div>
      </section>

      {/* Counters */}
      <section className="container mx-auto px-4 py-24">
        <Reveal>
          <div className="text-center mb-16 space-y-2">
            <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight">Numbers that speak</h2>
            <p className="text-muted-foreground text-base">Our impact, in measurable terms.</p>
          </div>
        </Reveal>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
          <Counter target={100} suffix="+" label="Businesses Supported" />
          <Counter target={50} suffix="+" label="Certifications Issued" />
          <Counter target={25} suffix="+" label="Investor Connections" />
          <Counter target={95} suffix="%" label="Client Retention" />
        </div>
      </section>

      {/* Reasons */}
      <section className="bg-slate-50/50 dark:bg-secondary/10 border-y border-border/50 py-24">
        <div className="container mx-auto px-4">
          <Reveal>
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <p className="text-xs font-semibold text-primary uppercase tracking-widest">What sets us apart</p>
              <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Six reasons clients stay with Aspiria</h2>
            </div>
          </Reveal>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {reasons.map(({ icon: Icon, title, text }, i) => (
              <Reveal key={title} delay={(i % 3) * 80}>
                <div className="h-full p-7 rounded-2xl bg-card border border-border/80 shadow-sm hover-lift group">
                  <div className="w-12 h-12 rounded-xl bg-primary/[0.06] dark:bg-primary/[0.03] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary transition-smooth">
                    <Icon className="w-5.5 h-5.5 text-primary group-hover:text-white transition-smooth" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground tracking-tight">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Process */}
      <section className="container mx-auto px-4 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">Our process</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">A clear path from idea to impact</h2>
          </div>
        </Reveal>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
          <div className="hidden lg:block absolute top-[76px] left-[10%] right-[10%] h-0.5 border-t-2 border-dashed border-border -z-10" />
          {process.map((p, i) => (
            <Reveal key={p.step} delay={i * 100}>
              <div className="relative p-8 rounded-2xl border border-border/80 bg-card hover-lift shadow-sm h-full flex flex-col justify-between">
                <div>
                  <div className="text-5xl md:text-6xl font-extrabold gradient-text tracking-tight mb-5">{p.step}</div>
                  <h3 className="font-bold text-lg mb-2 text-foreground tracking-tight">{p.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{p.text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Quick stats strip */}
      <section className="container mx-auto px-4 pb-24">
        <div className="rounded-3xl gradient-hero text-white p-8 md:p-12 grid sm:grid-cols-3 gap-8 text-center shadow-elegant relative overflow-hidden">
          <div className="absolute inset-0 bg-white/[0.02] -z-10" />
          {[
            { Icon: Clock, label: "Avg. response", value: "Under 4 hrs" },
            { Icon: Globe2, label: "Markets served", value: "India + global" },
            { Icon: Award, label: "Founder-led", value: "Every engagement" },
          ].map(({ Icon, label, value }) => (
            <div key={label} className="flex flex-col items-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center mb-1">
                <Icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-2xl font-bold tracking-tight">{value}</div>
              <div className="text-xs font-medium uppercase tracking-wider opacity-80">{label}</div>
            </div>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default WhyUs;
