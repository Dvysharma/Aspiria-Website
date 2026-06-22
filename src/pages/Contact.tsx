import { Layout } from "@/components/Layout";
import { useSEO } from "@/hooks/useSEO";
import { useReveal } from "@/hooks/useReveal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Mail, MapPin, MessageCircle, Phone, Send, Loader2 } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const schema = z.object({
  name: z.string().trim().min(1, "Name required").max(100),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().max(30).optional().or(z.literal("")),
  service: z.string().trim().max(100).optional().or(z.literal("")),
  message: z.string().trim().min(10, "Tell us a bit more (10+ chars)").max(2000),
});

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

const Contact = () => {
  useSEO({
    title: "Contact Aspiria | Let's Turn Your Aspirations Into Reality",
    description: "Get in touch with Aspiria. Call +91 79845 73238, email hello@aspiria.com, or send us a message — we respond within 4 hours.",
    canonical: "https://aspiria.com/contact",
  });

  const [form, setForm] = useState({ name: "", email: "", phone: "", service: "", message: "" });
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    try {
      const res = await supabase.from("contact_submissions").insert({
        name: parsed.data.name,
        email: parsed.data.email,
        phone: parsed.data.phone || null,
        service: parsed.data.service || null,
        message: parsed.data.message,
      });
      setLoading(false);
      console.log("Supabase insert response:", res);
      if (res.error) {
        console.error("Supabase insert error:", res.error);
        toast.error(`Could not send: ${res.error.message ?? "unknown error"}`);
        return;
      }
      toast.success("Message sent! We'll be in touch within 4 hours.");
      setForm({ name: "", email: "", phone: "", service: "", message: "" });
    } catch (e) {
      setLoading(false);
      console.error("Supabase insert exception:", e);
      toast.error("Could not send. Please try again or use WhatsApp.");
    }
  };

  return (
    <Layout>
      <section className="gradient-soft py-20 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-fade-in">Contact</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
            Let's turn your aspirations <br />
            <span className="gradient-text">into reality</span>
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            Tell us about your goals — we'll respond within 4 business hours.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-24">
        <div className="grid lg:grid-cols-3 gap-8">
          <Reveal>
            <div className="space-y-4">
              {[
                { Icon: Phone, title: "Call us", value: "+91 79845 73238", href: "tel:+917984573238" },
                { Icon: Mail, title: "Email", value: "hello@aspiria.com", href: "mailto:hello@aspiria.com" },
                {
                  Icon: MessageCircle,
                  title: "WhatsApp",
                  value: "Quick chat",
                  href: "https://wa.me/917984573238",
                },
                { Icon: MapPin, title: "Office", value: "India — serving worldwide", href: "#map" },
              ].map(({ Icon, title, value, href }) => (
                <a
                  key={title}
                  href={href}
                  className="flex items-start gap-4.5 p-5 rounded-2xl bg-card border border-border/80 shadow-sm hover-lift group"
                >
                  <div className="w-11 h-11 rounded-xl bg-primary/[0.06] dark:bg-primary/[0.03] flex items-center justify-center shrink-0 group-hover:scale-110 group-hover:bg-primary transition-smooth">
                    <Icon className="w-5 h-5 text-primary group-hover:text-white transition-smooth" />
                  </div>
                  <div>
                    <div className="text-xs uppercase tracking-wider text-muted-foreground font-semibold">{title}</div>
                    <div className="font-semibold text-foreground mt-0.5">{value}</div>
                  </div>
                </a>
              ))}
            </div>
          </Reveal>

          <Reveal delay={100}>
            <div className="lg:col-span-2 p-8 rounded-2xl bg-card border border-border/80 shadow-card-soft space-y-6">
              <div>
                <h2 className="text-2xl font-bold tracking-tight mb-1 text-foreground">Send us a message</h2>
                <p className="text-sm text-muted-foreground">All fields marked * are required.</p>
              </div>
              <form onSubmit={submit} className="grid sm:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <Label htmlFor="name">Name *</Label>
                  <Input id="name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="email">Email *</Label>
                  <Input id="email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} className="rounded-xl" required />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phone">Phone</Label>
                  <Input id="phone" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} className="rounded-xl" />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="service">Service of interest</Label>
                  <Input id="service" placeholder="e.g. Branding" value={form.service} onChange={(e) => setForm({ ...form, service: e.target.value })} className="rounded-xl" />
                </div>
                <div className="sm:col-span-2 space-y-1.5">
                  <Label htmlFor="message">How can we help? *</Label>
                  <Textarea id="message" rows={5} value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} className="rounded-xl" required />
                </div>
                <div className="sm:col-span-2 pt-2">
                  <Button type="submit" size="lg" disabled={loading} className="gradient-hero text-white border-0 w-full sm:w-auto rounded-xl hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] transition-smooth font-semibold shadow-elegant">
                    {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <><Send className="w-4 h-4 mr-1.5" /> Send message</>}
                  </Button>
                </div>
              </form>
            </div>
          </Reveal>
        </div>
      </section>

      <section id="map" className="container mx-auto px-4 pb-20">
        <Reveal>
          <div className="rounded-2xl overflow-hidden border border-border shadow-card-soft">
            <iframe
              title="Aspiria location"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d29377.87273925089!2d72.83106!3d21.17024!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x0%3A0x0!2sSurat%2C%20India!5e0!3m2!1sen!2sin!4v1700000000000"
              width="100%"
              height="380"
              style={{ border: 0 }}
              allowFullScreen
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
        </Reveal>
      </section>
    </Layout>
  );
};

export default Contact;
