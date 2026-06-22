import { Layout } from "@/components/Layout";
import { useSEO } from "@/hooks/useSEO";
import { useReveal } from "@/hooks/useReveal";
import { Eye, Heart, Lightbulb, Rocket, Target, Users } from "lucide-react";

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

const About = () => {
  useSEO({
    title: "About Aspiria | Empowering Aspirations Through Innovation",
    description: "Learn how Aspiria empowers SMEs and startups with forward-thinking strategies, innovation, and growth-focused consulting.",
    canonical: "https://aspiria.com/about",
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="gradient-soft py-20 md:py-28">
        <div className="container mx-auto px-4 max-w-4xl text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-fade-in">About Aspiria</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
            Empowering ambitious businesses to <span className="gradient-text">soar higher</span>
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            Aspiria was born from a single belief: every business has aspirations, and with the right strategy and partners, those aspirations take flight.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="container mx-auto px-4 py-20 max-w-3xl">
        <Reveal>
          <h2 className="text-3xl md:text-4xl font-extrabold mb-6">Our story</h2>
          <div className="space-y-4 text-muted-foreground leading-relaxed text-lg">
            <p>
              We started Aspiria to bridge a gap we saw every day — small and medium enterprises and ambitious startups full of potential, but without consistent access to the kind of strategic, creative, and operational expertise larger companies enjoy.
            </p>
            <p>
              Today, Aspiria is a one-stop consulting partner: strategy, marketing, technology, training, certification, and investor connections — under one roof, tuned to the realities of growing businesses.
            </p>
            <p>
              We measure success by your milestones: a launched product, a closed round, a hire that levels up the team, a quarter that finally hits plan.
            </p>
          </div>
        </Reveal>
      </section>

      {/* Mission / Vision / Values */}
      <section className="bg-slate-50/50 dark:bg-secondary/10 border-y border-border/50 py-24">
        <div className="container mx-auto px-4 grid md:grid-cols-3 gap-6">
          {[
            { icon: Target, title: "Mission", text: "Empower SMEs and startups with the strategy, tools, and network they need to thrive." },
            { icon: Eye, title: "Vision", text: "A world where every great idea has access to great execution." },
            { icon: Heart, title: "Values", text: "Integrity, excellence, partnership, and a relentless focus on outcomes." },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 100}>
              <div className="p-8 rounded-2xl bg-card border border-border/80 shadow-sm hover-lift h-full group">
                <div className="w-12 h-12 rounded-xl bg-primary/[0.06] dark:bg-primary/[0.03] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary transition-smooth">
                  <Icon className="w-5.5 h-5.5 text-primary group-hover:text-white transition-smooth" />
                </div>
                <h3 className="text-xl font-bold tracking-tight mb-2 text-foreground">{title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Pillars */}
      <section className="container mx-auto px-4 py-24">
        <Reveal>
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest">What guides us</p>
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">Built on innovation, growth, and forward-thinking strategy</h2>
          </div>
        </Reveal>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { icon: Lightbulb, title: "Innovation first", text: "We blend proven frameworks with creative, modern thinking." },
            { icon: Rocket, title: "Growth obsessed", text: "Every recommendation is tied to measurable outcomes." },
            { icon: Users, title: "True partnership", text: "We're an extension of your team, not just a vendor." },
          ].map(({ icon: Icon, title, text }, i) => (
            <Reveal key={title} delay={i * 100}>
              <div className="p-7 rounded-2xl border border-border bg-card shadow-sm hover-lift h-full group flex flex-col justify-between">
                <div>
                  <div className="w-12 h-12 rounded-xl bg-primary/[0.06] dark:bg-primary/[0.03] flex items-center justify-center mb-5 group-hover:scale-110 group-hover:bg-primary transition-smooth">
                    <Icon className="w-5.5 h-5.5 text-primary group-hover:text-white transition-smooth" />
                  </div>
                  <h3 className="font-bold text-lg mb-2 text-foreground tracking-tight">{title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{text}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </Layout>
  );
};

export default About;
