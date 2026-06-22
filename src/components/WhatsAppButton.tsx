import { MessageCircle } from "lucide-react";

export const WhatsAppButton = () => {
  const message = encodeURIComponent("Hi Aspiria! I'd like to know more about your services.");
  return (
    <a
      href={`https://wa.me/917984573238?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 left-6 z-40 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-elegant transition-smooth hover:scale-110"
      style={{ background: "linear-gradient(135deg, #25D366 0%, #128C7E 100%)" }}
    >
      <MessageCircle className="w-7 h-7" fill="currentColor" />
      <span className="absolute inline-flex h-full w-full rounded-full opacity-30 animate-ping bg-green-400" />
    </a>
  );
};
