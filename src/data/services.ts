import {
  Target, Rocket, Megaphone, Code2, Palette, BarChart3, GraduationCap,
  LineChart, BadgeCheck, Handshake,
} from "lucide-react";

export const services = [
  {
    icon: Target,
    title: "Strategic Planning",
    description: "Actionable, insight-driven business strategies that align your team and accelerate growth.",
    points: ["Vision & roadmap", "OKRs & KPIs", "Competitive positioning"],
  },
  {
    icon: Rocket,
    title: "Consulting for Startups",
    description: "Business planning, funding strategies, and operational guidance — from idea to scale.",
    points: ["Business model design", "Fundraising support", "GTM playbooks"],
  },
  {
    icon: Megaphone,
    title: "Digital Marketing",
    description: "SEO, PPC, social, and content marketing that compounds into predictable revenue.",
    points: ["Search & paid ads", "Content engine", "Conversion optimization"],
  },
  {
    icon: Code2,
    title: "Web Development",
    description: "Responsive, fast, user-friendly websites and web apps engineered for conversion.",
    points: ["Marketing sites", "Web apps", "E-commerce"],
  },
  {
    icon: Palette,
    title: "Branding",
    description: "Logo design, brand identity, and positioning that earn trust at first glance.",
    points: ["Visual identity", "Brand voice", "Guidelines & assets"],
  },
  {
    icon: BarChart3,
    title: "Market Research",
    description: "Deep insights into trends, competition, and consumer behavior for confident decisions.",
    points: ["Market sizing", "Customer interviews", "Competitor mapping"],
  },
  {
    icon: GraduationCap,
    title: "Training & Workshops",
    description: "Leadership, client handling, and team development sessions tailored to your goals.",
    points: ["Leadership academy", "Sales enablement", "Soft skills"],
  },
  {
    icon: LineChart,
    title: "Data Analytics",
    description: "Turn business data into informed decisions with dashboards, models, and clarity.",
    points: ["KPI dashboards", "Forecasting", "Customer analytics"],
  },
  {
    icon: BadgeCheck,
    title: "Aspiria Certification",
    description: "A trusted certification for businesses that meet our quality and excellence standards.",
    points: ["Quality audit", "Best-practice review", "Branded badge"],
  },
  {
    icon: Handshake,
    title: "Investor Connections",
    description: "Linking ambitious startups to a curated network of angels, VCs, and strategic partners.",
    points: ["Pitch refinement", "Investor outreach", "Deal room support"],
  },
];

export type Service = (typeof services)[number];
