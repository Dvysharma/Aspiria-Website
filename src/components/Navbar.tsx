import { Link, NavLink, useLocation } from "react-router-dom";
import { useEffect, useState } from "react";
import { Menu, X, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useTheme } from "@/hooks/useTheme";
import { cn } from "@/lib/utils";

const links = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/services", label: "Services" },
  { to: "/why-us", label: "Why Us" },
  { to: "/contact", label: "Contact" },
  { to: "/careers", label: "Careers" },
];

export const Navbar = () => {
  const { theme, toggle } = useTheme();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [location.pathname]);

  return (
    <header
      className={cn(
        "fixed top-0 inset-x-0 z-50 transition-smooth",
        scrolled
          ? "bg-background/80 backdrop-blur-xl border-b border-border shadow-card-soft"
          : "bg-transparent"
      )}
    >
      <nav className="container mx-auto flex items-center justify-between h-16 md:h-20 px-4">
        <Link to="/" className="flex items-center gap-2 group">
          <img
            src="/aspiria_profile.png"
            alt="Aspiria Logo"
            className="w-11 h-11 rounded-xl object-cover shadow-glow group-hover:scale-105 transition-smooth"
          />
          <span className="flex flex-col leading-tight">
            <span className="text-lg md:text-xl font-extrabold tracking-tight">Aspiria</span>
            <span className="text-[10px] md:text-[11px] text-muted-foreground -mt-0.5">
              Where Aspirations Take Flight
            </span>
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              end={l.to === "/"}
              className={({ isActive }) =>
                cn(
                  "px-1 py-1 text-sm font-medium transition-smooth link-underline",
                  isActive
                    ? "text-primary font-semibold link-active"
                    : "text-foreground/70 hover:text-foreground"
                )
              }
            >
              {l.label}
            </NavLink>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="hidden md:inline-flex gradient-hero text-white border-0 hover:opacity-95 hover:scale-[1.02] hover:shadow-glow active:scale-[0.98] transition-smooth shadow-elegant font-semibold rounded-xl px-5">
            <Link to="/contact">Book Consultation</Link>
          </Button>
          <Button
            size="icon"
            variant="ghost"
            onClick={toggle}
            aria-label="Toggle theme"
            className="rounded-lg"
          >
            {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Open menu"
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </Button>
        </div>
      </nav>

      {open && (
        <div className="lg:hidden bg-background/95 backdrop-blur-xl border-b border-border animate-fade-in">
          <div className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {links.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                end={l.to === "/"}
                className={({ isActive }) =>
                  cn(
                    "px-4 py-3 rounded-lg text-base font-medium transition-smooth",
                    isActive
                      ? "text-primary bg-accent"
                      : "text-foreground/80 hover:bg-accent/60"
                  )
                }
              >
                {l.label}
              </NavLink>
            ))}
            <Button asChild className="mt-2 gradient-hero text-white border-0">
              <Link to="/contact">Book Consultation</Link>
            </Button>
          </div>
        </div>
      )}
    </header>
  );
};
