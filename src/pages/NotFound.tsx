import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
// No icons needed from lucide-react

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center gradient-soft px-4">
      <div className="text-center max-w-md">
        <Link to="/" className="inline-block group">
          <img
            src="/aspiria_profile.png"
            alt="Aspiria Logo"
            className="w-16 h-16 rounded-2xl object-cover shadow-glow mb-6 mx-auto group-hover:scale-105 transition-smooth"
          />
        </Link>
        <h1 className="text-7xl font-extrabold gradient-text mb-3">404</h1>
        <p className="text-xl mb-2 font-semibold">This flight didn't reach its destination</p>
        <p className="text-muted-foreground mb-8">The page you're looking for doesn't exist or has moved.</p>
        <Button asChild size="lg" className="gradient-hero text-white border-0">
          <Link to="/">Return home</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
