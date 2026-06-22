import { Link } from "react-router-dom";
import { Mail, Phone, Facebook, Linkedin, Instagram, Twitter, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { z } from "zod";

const emailSchema = z.string().trim().email("Enter a valid email").max(255);

export const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const subscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    const parsed = emailSchema.safeParse(email);
    if (!parsed.success) {
      toast.error(parsed.error.issues[0].message);
      return;
    }
    setLoading(true);
    const { error } = await supabase.from("newsletter_subscribers").insert({ email: parsed.data });
    setLoading(false);
    if (error) {
      if (error.code === "23505") toast.success("You're already subscribed!");
      else toast.error("Could not subscribe. Try again.");
      return;
    }
    toast.success("Subscribed! Thanks for joining.");
    setEmail("");
  };

  return (
    <footer className="border-t border-border bg-slate-50/50 dark:bg-[#070b13] mt-24">
      <div className="container mx-auto px-4 py-16 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2 group">
            <img
              src="/aspiria_profile.png"
              alt="Aspiria Logo"
              className="w-9 h-9 rounded-xl object-cover shadow-glow group-hover:scale-105 transition-smooth"
            />
            <span className="text-xl font-extrabold tracking-tight">Aspiria</span>
          </Link>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Empowering SMEs and startups with strategy, marketing, technology, and training to turn aspirations into reality.
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-5 tracking-tight">Quick Links</h4>
          <ul className="space-y-3 text-sm text-muted-foreground">
            <li><Link to="/about" className="hover:text-primary transition-smooth hover:translate-x-1 inline-block">About Us</Link></li>
            <li><Link to="/services" className="hover:text-primary transition-smooth hover:translate-x-1 inline-block">Services</Link></li>
            <li><Link to="/why-us" className="hover:text-primary transition-smooth hover:translate-x-1 inline-block">Why Choose Us</Link></li>
            <li><Link to="/contact" className="hover:text-primary transition-smooth hover:translate-x-1 inline-block">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-primary transition-smooth hover:translate-x-1 inline-block">Privacy Policy</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-5 tracking-tight">Get in Touch</h4>
          <ul className="space-y-3.5 text-sm text-muted-foreground">
            <li className="flex items-center gap-2.5">
              <Phone className="w-4 h-4 text-primary" />
              <a href="tel:+917984573238" className="hover:text-primary transition-smooth">+91 79845 73238</a>
            </li>
            <li className="flex items-center gap-2.5">
              <Mail className="w-4 h-4 text-primary" />
              <a href="mailto:hello@aspiria.com" className="hover:text-primary transition-smooth">hello@aspiria.com</a>
            </li>
          </ul>
          <div className="flex gap-2.5 mt-5">
            {[
              { Icon: Linkedin, href: "#" },
              { Icon: Instagram, href: "#" },
              { Icon: Twitter, href: "#" },
              { Icon: Facebook, href: "#" },
            ].map(({ Icon, href }, i) => (
              <a
                key={i}
                href={href}
                aria-label="social"
                className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center hover:bg-primary hover:text-white hover:border-primary hover:scale-110 active:scale-95 transition-smooth shadow-sm"
              >
                <Icon className="w-4 h-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h4 className="font-semibold text-foreground mb-5 tracking-tight">Newsletter</h4>
          <p className="text-sm text-muted-foreground mb-4">Get insights for SMEs & startups, monthly.</p>
          <form onSubmit={subscribe} className="flex gap-2">
            <Input
              type="email"
              placeholder="you@company.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="rounded-xl border border-border bg-background focus-visible:ring-primary focus-visible:border-primary"
            />
            <Button type="submit" disabled={loading} className="gradient-hero text-white border-0 shrink-0 rounded-xl px-4 hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] transition-smooth font-medium">
              {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Join"}
            </Button>
          </form>
        </div>
      </div>

      <div className="border-t border-border">
        <div className="container mx-auto px-4 py-6 flex flex-col md:flex-row items-center justify-between gap-2 text-xs text-muted-foreground">
          <p>© {new Date().getFullYear()} Aspiria Consulting. All rights reserved.</p>
          <p>Where Aspirations Take Flight ✈</p>
        </div>
      </div>
    </footer>
  );
};
