import { useState, useRef, DragEvent } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import {
  Briefcase,
  MapPin,
  Calendar,
  Search,
  Upload,
  Loader2,
  ArrowRight,
  CheckCircle2,
  GraduationCap,
  Building2,
  ChevronRight,
  FileText,
  X,
  Sparkles,
  Clock,
  Compass,
  ArrowLeft,
  Info,
  Check,
  Target,
  Award
} from "lucide-react";

// List of all open roles at Aspiria
const presetPositions = [
  { title: "Business Development Intern", type: "internship", description: "Support pipeline growth, research leads, and learn business development fundamentals." },
  { title: "Marketing & Content Intern", type: "internship", description: "Help create marketing collateral, blog content and campaign ideas for growing brands." },
  { title: "Digital Marketing Intern", type: "internship", description: "Assist with paid social, email campaigns, and analytics across digital channels." },
  { title: "Social Media Intern", type: "internship", description: "Support social content planning, community engagement, and performance tracking." },
  { title: "SEO Intern", type: "internship", description: "Help improve search visibility through keyword research and on-page optimization." },
  { title: "Content Writing Intern", type: "internship", description: "Write short-form and long-form content for websites, blogs, and marketing assets." },
  { title: "Video Editing Intern", type: "internship", description: "Assist in editing short videos for campaigns, social media, and internal storytelling." },
  { title: "Brand Ambassador Intern", type: "internship", description: "Support brand outreach, customer research, and events with a growth mindset." },
  { title: "Client Success Intern", type: "internship", description: "Help onboard customers and improve client communications across projects." },
  { title: "Sales Intern", type: "internship", description: "Support outbound outreach, pipeline tracking, and qualification for sales opportunities." },
  { title: "Project Management Intern", type: "internship", description: "Help coordinate timelines, tasks, and team communication for client work." },
  { title: "Strategy Consulting Intern", type: "internship", description: "Assist with research, competitive analysis, and preparing strategic recommendations." },
  { title: "Financial Analyst Intern", type: "internship", description: "Support financial modeling, reporting, and metrics tracking for business cases." },
  { title: "Business Analyst Intern", type: "internship", description: "Support business processes, requirements, and insight gathering for client projects." },
  { title: "Data Analyst Intern", type: "internship", description: "Analyze datasets, build reports, and support data-driven marketing and strategy work." },
  { title: "Founder's Office Intern", type: "internship", description: "Support founder-led initiatives, strategy research, and operational priorities." },
  { title: "PR & Public Relations Intern", type: "internship", description: "Assist with press outreach, media relations, and brand communications support." },
  { title: "HR & Training Intern", type: "internship", description: "Support recruitment, onboarding, and development initiatives for the team." },
  { title: "Web Development Intern", type: "internship", description: "Assist with front-end work, prototypes, and small feature updates." },
  { title: "UI/UX Design Intern", type: "internship", description: "Support user experience research, wireframes, and design prototypes for digital products." },
  { title: "Marketing Analyst Intern", type: "internship", description: "Help analyze campaign performance, track metrics, and support data-driven marketing decisions." },
  { title: "Business Development Manager", type: "full-time", description: "Lead client acquisition efforts, partnerships, and pipeline expansion.", experience: "3-5 yrs experience" },
  { title: "Business Development Executive", type: "full-time", description: "Execute outreach programs, sales qualification, and partner relationship building.", experience: "0-2 yrs experience" },
  { title: "Marketing Manager", type: "full-time", description: "Own campaign strategy, messaging, and execution across digital channels.", experience: "3-5 yrs experience" },
  { title: "Digital Marketing Executive", type: "full-time", description: "Manage paid and organic campaigns with a focus on growth and measurement.", experience: "0-2 yrs experience" },
  { title: "Operations Manager", type: "full-time", description: "Drive internal operations, process improvement, and project delivery efficiency.", experience: "3-5 yrs experience" },
  { title: "Project Manager", type: "full-time", description: "Coordinate client projects, schedules, and stakeholder communication end-to-end.", experience: "3-5 yrs experience" },
  { title: "Client Success Manager", type: "full-time", description: "Ensure clients achieve outcomes through strong relationships and proactive support.", experience: "3-5 yrs experience" },
  { title: "Account Manager", type: "full-time", description: "Manage client accounts, retention, and ongoing growth opportunities.", experience: "3-5 yrs experience" },
  { title: "Investor Relations Manager", type: "full-time", description: "Manage communications and relationships with investors, while supporting strategic funding initiatives.", experience: "3-5 yrs experience" },
  { title: "Certification Program Manager", type: "full-time", description: "Own certification program development, training workflows, and partner enablement.", experience: "3-5 yrs experience" },
  { title: "Financial Analyst", type: "full-time", description: "Analyze financial performance and support reporting, budgeting, and forecasting.", experience: "1-2 yrs experience" },
  { title: "Senior Financial Analyst", type: "full-time", description: "Lead financial planning, business case analysis, and cross-functional performance reviews.", experience: "5+ yrs experience" },
  { title: "Founder's Office", type: "full-time", description: "Support executive-level projects, founder priorities, and strategic initiatives.", experience: "3-5 yrs experience" },
  { title: "Business Consultant", type: "full-time", description: "Deliver strategic guidance and practical solutions for business challenges.", experience: "1-3 yrs experience" },
  { title: "Strategy Consultant", type: "full-time", description: "Help define long-term strategy, market positioning, and growth plans.", experience: "1-3 yrs experience" },
  { title: "Startup Consultant", type: "full-time", description: "Support early-stage founders with go-to-market, operations, and scaling advice.", experience: "3-5 yrs experience" },
  { title: "Management Consultant", type: "full-time", description: "Lead operational, organizational, and performance improvement initiatives.", experience: "3-5 yrs experience" },
  { title: "Digital Transformation Consultant", type: "full-time", description: "Help clients modernize digital products, processes, and customer experiences.", experience: "2-5 yrs experience" },
  { title: "Marketing Consultant", type: "full-time", description: "Provide marketing strategy, branding, and campaign execution support.", experience: "3-5 yrs experience" },
  { title: "Social Media Manager", type: "full-time", description: "Own social strategy, content execution, and community engagement.", experience: "2-3 yrs experience" },
  { title: "Web Developer", type: "full-time", description: "Build responsive websites and support front-end development projects.", experience: "0-2 yrs experience" },
  { title: "Software Developer", type: "full-time", description: "Develop web applications, integrations, and technical solutions.", experience: "0-2 yrs experience" },
  { title: "Market Research Analyst", type: "full-time", description: "Collect market insights and help shape recommendations for growth.", experience: "1-3 yrs experience" },
  { title: "Business Analyst", type: "full-time", description: "Translate business needs into requirements and process improvements.", experience: "0-1 yrs experience" },
  { title: "Data Analyst", type: "full-time", description: "Analyze data, build reports, and uncover insights to support decisions.", experience: "1-2 yrs experience" },
  { title: "Research Associate", type: "full-time", description: "Support market research, analysis, and business insight work.", experience: "0-2 yrs experience" },
] as const;

type PresetPosition = typeof presetPositions[number];

// Helper to determine department, location, responsibilities and requirements dynamically
const getRoleDetails = (title: string, type: "internship" | "full-time", experience?: string) => {
  const lower = title.toLowerCase();
  
  let department: "Consulting & Strategy" | "Technology & Products" | "Marketing & Growth" | "Operations & Finance" = "Operations & Finance";
  
  if (lower.includes("consult") || lower.includes("strategy") || lower.includes("analyst intern")) {
    department = "Consulting & Strategy";
  } else if (lower.includes("developer") || lower.includes("design") || lower.includes("data") || lower.includes("web") || lower.includes("software")) {
    department = "Technology & Products";
  } else if (lower.includes("marketing") || lower.includes("sales") || lower.includes("social") || lower.includes("seo") || lower.includes("content") || lower.includes("video") || lower.includes("ambassador") || lower.includes("pr") || lower.includes("development") || lower.includes("public relations")) {
    department = "Marketing & Growth";
  } else {
    department = "Operations & Finance";
  }

  // Location mapping
  const location = lower.includes("consultant") || lower.includes("manager") || lower.includes("relations") 
    ? "Hybrid (Mumbai / Bangalore)" 
    : "Remote / Hybrid";

  // Dynamic responsibilities based on department
  let responsibilities: string[] = [];
  if (department === "Consulting & Strategy") {
    responsibilities = [
      "Conduct in-depth market research, industry benchmarking, and competitive analysis to identify growth opportunities.",
      "Collaborate directly with startup founders and SMEs to understand their business models and pain points.",
      "Synthesize large amounts of qualitative and quantitative data into clear, actionable strategic recommendations.",
      "Participate in the design and delivery of client workshops, presentations, and strategic playbooks.",
      "Support the team in building comprehensive financial models and business cases for new initiatives."
    ];
  } else if (department === "Technology & Products") {
    responsibilities = [
      "Design, implement, and maintain high-fidelity user interfaces and web applications using modern stacks.",
      "Collaborate closely with project managers and designers to translate user needs into functional features.",
      "Optimize applications for maximum speed, accessibility, responsiveness, and cross-browser consistency.",
      "Write clean, well-documented, and testable code, participating in peer reviews to maintain high quality.",
      "Analyze platform data and user behavior to troubleshoot issues, optimize databases, and suggest product enhancements."
    ];
  } else if (department === "Marketing & Growth") {
    responsibilities = [
      "Help execute multi-channel digital campaigns across SEO, social media, paid ads, and email outreach.",
      "Create high-converting, written content and multimedia materials tailored to target buyer personas.",
      "Perform keyword research and on-page/off-page SEO updates to boost organic traffic and search visibility.",
      "Track daily, weekly, and monthly campaign metrics to generate insights and optimize marketing ROI.",
      "Collaborate with the sales and client onboarding teams to align outreach strategies and nurture pipelines."
    ];
  } else { // Operations & Finance
    responsibilities = [
      "Coordinate project deliverables, timelines, and communications between internal experts and external clients.",
      "Develop and manage budgets, cash flow models, and financial reports to track business performance.",
      "Streamline operations, operational workflows, and client-facing processes to drive agency efficiency.",
      "Manage onboarding protocols and maintain high retention rates by addressing client success issues promptly.",
      "Assist in building team training modules, culture initiatives, and HR recruitment structures."
    ];
  }

  // Dynamic requirements based on seniority and stage
  let requirements: string[] = [];
  if (type === "internship") {
    requirements = [
      "Currently pursuing or recently graduated with a degree in a relevant discipline (or equivalent self-taught portfolio).",
      "Strong written and verbal communication skills with a keen eye for detail.",
      "Proactive, curious mindset with a hunger to learn fast and receive constructive feedback.",
      "Familiarity with standard software in the domain (e.g. Figma, Notion, Excel, Git, or Social Tools).",
      "Ability to dedicate 20-40 hours per week and collaborate effectively in hybrid or remote setups."
    ];
  } else {
    // Full-time
    const expText = experience || "1-3 yrs experience";
    const isSenior = expText.includes("3-5") || expText.includes("5+");
    
    if (isSenior) {
      requirements = [
        "Bachelor's or Master's degree in Business, Tech, Marketing, Finance or equivalent practical experience.",
        `At least ${expText} of relevant professional experience, preferably in a client-facing consulting or agency setting.`,
        "Proven history of leading projects end-to-end and delivering measurable client or product outcomes.",
        "Advanced proficiency in industry-standard strategic, technical, or analytical frameworks.",
        "Excellent leadership, mentorship, and communication skills to guide junior associates and interface with C-level clients."
      ];
    } else {
      requirements = [
        "Bachelor's degree or equivalent in a relevant field of study.",
        `At least ${expText} of professional experience in a related role.`,
        "Strong understanding of foundational concepts, tools, and best practices in your area of focus.",
        "High level of self-motivation, organization, and ability to manage multiple priorities under deadline pressure.",
        "Analytical thinker with a data-driven approach to solving business problems."
      ];
    }
  }

  return {
    department,
    location,
    responsibilities,
    requirements
  };
};

const getDeptStyles = (dept: string) => {
  switch (dept) {
    case "Consulting & Strategy":
      return {
        badge: "bg-blue-50 text-blue-700 border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-900/30",
        bg: "from-blue-500/10 to-indigo-500/5",
        text: "text-blue-600 dark:text-blue-400",
        border: "border-blue-100 hover:border-blue-300 dark:border-blue-950 dark:hover:border-blue-900",
        iconBg: "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
      };
    case "Technology & Products":
      return {
        badge: "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-900/30",
        bg: "from-emerald-500/10 to-teal-500/5",
        text: "text-emerald-600 dark:text-emerald-400",
        border: "border-emerald-100 hover:border-emerald-300 dark:border-emerald-950 dark:hover:border-emerald-900",
        iconBg: "bg-emerald-100 dark:bg-emerald-900/40 text-emerald-600 dark:text-emerald-400"
      };
    case "Marketing & Growth":
      return {
        badge: "bg-violet-50 text-violet-700 border-violet-200/50 dark:bg-violet-950/40 dark:text-violet-300 dark:border-violet-900/30",
        bg: "from-violet-500/10 to-purple-500/5",
        text: "text-violet-600 dark:text-violet-400",
        border: "border-violet-100 hover:border-violet-300 dark:border-violet-950 dark:hover:border-violet-900",
        iconBg: "bg-violet-100 dark:bg-violet-900/40 text-violet-600 dark:text-violet-400"
      };
    default:
      return {
        badge: "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-900/30",
        bg: "from-amber-500/10 to-yellow-500/5",
        text: "text-amber-600 dark:text-amber-400",
        border: "border-amber-100 hover:border-amber-300 dark:border-amber-950 dark:hover:border-amber-900",
        iconBg: "bg-amber-100 dark:bg-amber-900/40 text-amber-600 dark:text-amber-400"
      };
  }
};

const Careers = () => {
  useSEO({
    title: "Careers at Aspiria | Join Us in Driving Real Growth",
    description: "Explore internship and full-time career opportunities at Aspiria. Help us build strategies and digital products that empower SMEs and startups.",
    canonical: "https://aspiria.com/careers",
  });

  // State for form fields
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);

  // States for search and categories
  const [roleType, setRoleType] = useState<"full-time" | "internship">("internship");
  const [activeDept, setActiveDept] = useState<"all" | "consulting" | "tech" | "marketing" | "operations">("all");
  const [searchQuery, setSearchQuery] = useState("");
  
  // Drawer & Selection state
  const [selectedRole, setSelectedRole] = useState<PresetPosition | null>(null);
  
  // Drag & drop file states
  const [dragActive, setDragActive] = useState(false);
  const [formHighlighted, setFormHighlighted] = useState(false);

  const formRef = useRef<HTMLDivElement>(null);

  const details = selectedRole 
    ? getRoleDetails(selectedRole.title, selectedRole.type, (selectedRole as any).experience)
    : null;
  const styles = details ? getDeptStyles(details.department) : null;

  const handleFile = (f?: FileList | null) => {
    if (!f || f.length === 0) return setResumeFile(null);
    const file = f[0];
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    const maxBytes = 4 * 1024 * 1024;
    if (!allowed.includes(file.type)) {
      toast({ title: "Invalid file", description: "Please upload a PDF or Word document." });
      return setResumeFile(null);
    }
    if (file.size > maxBytes) {
      toast({ title: "File too large", description: "Resume must be under 4 MB." });
      return setResumeFile(null);
    }
    setResumeFile(file);
    toast({ title: "File accepted", description: `${file.name} uploaded successfully.` });
  };

  const handleDrag = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files);
    }
  };

  const uploadResume = async (file: File) => {
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9.\-_]/g, "_");
    const path = `resumes/${timestamp}_${safeName}`;

    const { data, error } = await supabase.storage.from("resumes").upload(path, file, { cacheControl: "3600", upsert: false });
    if (error) throw error;
    const { data: urlData } = supabase.storage.from("resumes").getPublicUrl(path);
    return urlData.publicUrl;
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !position) {
      toast({ title: "Missing fields", description: "Please fill name, email and position." });
      return;
    }
    if (!resumeFile) {
      toast({ title: "Resume required", description: "Please upload your resume to apply." });
      return;
    }
    setLoading(true);
    try {
      let resume_link: string | null = null;
      if (resumeFile) {
        resume_link = await uploadResume(resumeFile);
      }
      const payload: any = {
        name,
        email,
        position,
        ...(message ? { message } : {}),
        ...(resume_link ? { resume_link, resume_url: resume_link } : {}),
      };
      const { error } = await supabase.from("career_applications").insert([payload]);
      if (error) throw error;
      toast({ title: "Application submitted!", description: `We received your application for the ${position} role.` });
      setName(""); 
      setEmail(""); 
      setPosition(""); 
      setMessage(""); 
      setResumeFile(null);
    } catch (err: any) {
      console.error("career submit", err);
      toast({ title: "Submission failed", description: err?.message || String(err) });
    } finally {
      setLoading(false);
    }
  };

  // Pre-fill position and scroll to form
  const applyForRole = (roleTitle: string) => {
    setPosition(roleTitle);
    setSelectedRole(null); // Close the drawer
    
    // Scroll to form smoothly
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      
      // Trigger a visual highlight border animation on the form
      setFormHighlighted(true);
      setTimeout(() => {
        setFormHighlighted(false);
      }, 2000);
    }, 150);
  };

  // Filter listings
  const filteredPositions = presetPositions.filter((role) => role.type === roleType);
  const visiblePositions = filteredPositions.filter((role) => {
    const details = getRoleDetails(role.title, role.type, (role as any).experience);
    const matchesSearch = role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         role.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    let matchesDept = true;
    if (activeDept !== "all") {
      const deptName = activeDept === "consulting" ? "Consulting & Strategy"
                     : activeDept === "tech" ? "Technology & Products"
                     : activeDept === "marketing" ? "Marketing & Growth"
                     : "Operations & Finance";
      matchesDept = details.department === deptName;
    }
    
    return matchesSearch && matchesDept;
  });

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden gradient-soft py-24 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-primary/10 via-transparent to-transparent opacity-70 pointer-events-none" />
        <div className="container mx-auto px-4 max-w-5xl text-center relative z-10">
          <Badge className="bg-primary/10 text-primary border-primary/20 mb-4 px-3 py-1 text-xs uppercase tracking-wider animate-fade-in">
            Careers at Aspiria
          </Badge>
          <h1 className="text-4xl md:text-7xl font-extrabold mb-6 tracking-tight leading-none animate-fade-in-up">
            Shape your path. <br />
            <span className="gradient-text">Drive real impact.</span>
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            We're building practical strategies and digital products that help SMEs and startups scale. Explore our opportunities, find your path, and grow with us.
          </p>
        </div>
      </section>

      {/* Career Pathways Selector (Bain & PwC Style) */}
      <section className="container mx-auto px-4 py-8 max-w-5xl -mt-16 relative z-20">
        <div className="grid md:grid-cols-2 gap-6">
          {/* Students & Graduates Pathway */}
          <div 
            onClick={() => {
              setRoleType("internship");
              setActiveDept("all");
            }}
            className={`cursor-pointer rounded-2xl border p-8 transition-all duration-300 relative group overflow-hidden ${
              roleType === "internship" 
                ? "bg-card border-primary ring-1 ring-primary shadow-elegant" 
                : "bg-card/75 border-border/80 hover:border-muted-foreground/30 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3.5 rounded-xl transition-all duration-300 ${
                roleType === "internship" ? "bg-primary text-white scale-110" : "bg-muted text-muted-foreground"
              }`}>
                <GraduationCap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground block">Pathway 01</span>
                <h3 className="text-xl font-bold tracking-tight">Students & Graduates</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Kickstart your career with hands-on projects, client exposures, and dedicated mentoring. Ideal for undergraduate/postgraduate candidates seeking internship opportunities.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              Browse Internships 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>

          {/* Experienced Professionals Pathway */}
          <div 
            onClick={() => {
              setRoleType("full-time");
              setActiveDept("all");
            }}
            className={`cursor-pointer rounded-2xl border p-8 transition-all duration-300 relative group overflow-hidden ${
              roleType === "full-time" 
                ? "bg-card border-primary ring-1 ring-primary shadow-elegant" 
                : "bg-card/75 border-border/80 hover:border-muted-foreground/30 shadow-sm hover:shadow-md"
            }`}
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full blur-3xl group-hover:bg-primary/10 transition-colors" />
            <div className="flex items-center gap-4 mb-6">
              <div className={`p-3.5 rounded-xl transition-all duration-300 ${
                roleType === "full-time" ? "bg-primary text-white scale-110" : "bg-muted text-muted-foreground"
              }`}>
                <Building2 className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs uppercase tracking-wider font-bold text-muted-foreground block">Pathway 02</span>
                <h3 className="text-xl font-bold tracking-tight">Experienced Professionals</h3>
              </div>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-6">
              Take absolute ownership of key strategic functions. Build, guide, and consult ambitious businesses while accelerating your leadership trajectory.
            </p>
            <div className="flex items-center gap-2 text-sm font-semibold text-primary">
              Browse Full-time Roles 
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </div>
          </div>
        </div>
      </section>

      {/* Main Browse Opportunities Panel */}
      <section className="container mx-auto px-4 py-12 max-w-6xl">
        <div className="space-y-8">
          
          {/* Header & Search */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-border/80 pb-6">
            <div>
              <div className="flex items-center gap-2 text-primary font-bold text-sm uppercase tracking-wider mb-1">
                <Compass className="w-4 h-4" /> 
                {roleType === "internship" ? "Students & Graduates Listings" : "Professional Openings"}
              </div>
              <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight">
                Currently Open Roles ({visiblePositions.length})
              </h2>
            </div>
            
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3.5 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search job titles or keywords..."
                className="pl-10 pr-4 py-6 rounded-xl border-border bg-card shadow-sm text-sm"
              />
            </div>
          </div>

          {/* Department Filter Chips (Bain Style Tab list) */}
          <div className="flex overflow-x-auto pb-3 -mx-4 px-4 scrollbar-none gap-2">
            {(["all", "consulting", "tech", "marketing", "operations"] as const).map((dept) => {
              const label = dept === "all" ? "All Divisions"
                          : dept === "consulting" ? "Consulting & Strategy"
                          : dept === "tech" ? "Technology & Products"
                          : dept === "marketing" ? "Marketing & Growth"
                          : "Operations & Finance";
              
              const isActive = activeDept === dept;
              return (
                <button
                  key={dept}
                  type="button"
                  onClick={() => setActiveDept(dept)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold whitespace-nowrap transition-smooth border shrink-0 ${
                    isActive
                      ? "bg-foreground text-background border-foreground shadow-sm"
                      : "bg-card border-border text-muted-foreground hover:text-foreground hover:bg-accent/40"
                  }`}
                >
                  {label}
                </button>
              );
            })}
          </div>

          {/* Listings Grid */}
          {visiblePositions.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {visiblePositions.map((role) => {
                const details = getRoleDetails(role.title, role.type, (role as any).experience);
                const styles = getDeptStyles(details.department);
                
                return (
                  <div
                    key={role.title}
                    className="flex flex-col justify-between bg-card rounded-2xl border border-border/80 p-6 shadow-sm hover:shadow-elegant hover-lift transition-all duration-300 group"
                  >
                    <div>
                      <div className="flex items-center justify-between gap-3 mb-4">
                        <Badge className={`border font-semibold text-[10px] tracking-wide rounded-full px-2.5 py-0.5 ${styles.badge}`}>
                          {details.department}
                        </Badge>
                        <span className="text-xs text-muted-foreground flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-muted-foreground" /> {details.location.split(" ")[0]}
                        </span>
                      </div>
                      
                      <h4 className="text-lg font-bold tracking-tight text-foreground mb-2 group-hover:text-primary transition-colors line-clamp-2">
                        {role.title}
                      </h4>
                      
                      <div className="flex items-center gap-4 text-xs text-muted-foreground mb-4">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> 
                          {role.type === "internship" ? "Internship" : "Full-Time"}
                        </span>
                        {role.type === "full-time" && (role as any).experience && (
                          <span className="flex items-center gap-1">
                            <Briefcase className="w-3.5 h-3.5" /> {(role as any).experience}
                          </span>
                        )}
                      </div>

                      <p className="text-sm text-muted-foreground line-clamp-3 mb-6 leading-relaxed">
                        {role.description}
                      </p>
                    </div>

                    <Button
                      variant="outline"
                      onClick={() => setSelectedRole(role)}
                      className="w-full justify-between items-center group-hover:bg-primary group-hover:text-primary-foreground group-hover:border-primary rounded-xl font-semibold border-border bg-background transition-smooth"
                    >
                      <span>Learn More & Apply</span>
                      <ChevronRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="rounded-2xl border border-dashed border-border bg-card p-12 text-center max-w-xl mx-auto shadow-sm">
              <Info className="w-8 h-8 text-muted-foreground mx-auto mb-3" />
              <h4 className="text-base font-bold text-foreground mb-1">No vacancies found</h4>
              <p className="text-sm text-muted-foreground">
                We couldn't find any roles matching "{searchQuery}" in this division. Try selecting another division or clearing your search.
              </p>
              <Button
                variant="link"
                onClick={() => {
                  setSearchQuery("");
                  setActiveDept("all");
                }}
                className="mt-2 text-primary font-semibold"
              >
                Clear Filters
              </Button>
            </div>
          )}
        </div>
      </section>

      {/* Sliding Job Details Drawer (Sheet Component) */}
      <Sheet open={!!selectedRole} onOpenChange={(open) => !open && setSelectedRole(null)}>
        {selectedRole && details && styles && (
          <SheetContent className="w-full sm:max-w-xl md:max-w-2xl overflow-y-auto p-0 border-l border-border bg-background shadow-elegant">
            {/* Gradient Banner at Top */}
            <div className={`h-24 bg-gradient-to-r ${styles.bg} border-b border-border/40 relative flex items-center px-8`}>
              <Badge className={`border font-semibold text-xs rounded-full px-3 py-1 ${styles.badge}`}>
                {details.department}
              </Badge>
            </div>

            {/* Body Content */}
            <div className="p-8 space-y-8">
              {/* Title and metadata */}
              <div className="space-y-4">
                <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
                  {selectedRole.title}
                </h2>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-border bg-card font-medium text-muted-foreground flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5" /> {details.location}
                  </Badge>
                  <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-border bg-card font-medium text-muted-foreground flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {selectedRole.type === "internship" ? "Internship" : "Full-Time"}
                  </Badge>
                  {selectedRole.type === "full-time" && (selectedRole as any).experience && (
                    <Badge variant="outline" className="rounded-full px-3 py-1 text-xs border-border bg-card font-medium text-muted-foreground flex items-center gap-1.5">
                      <Briefcase className="w-3.5 h-3.5" /> {(selectedRole as any).experience}
                    </Badge>
                  )}
                </div>
              </div>

              {/* Role Overview */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Sparkles className="w-4 h-4 text-primary" /> Role Overview
                </h4>
                <p className="text-sm md:text-base text-muted-foreground leading-relaxed">
                  {selectedRole.description} At Aspiria, we believe in giving our teams the responsibility and scope to build excellence. In this role, you will collaborate with seasoned experts and make a direct difference in how we service our clients.
                </p>
              </div>

              {/* Key Responsibilities */}
              <div className="space-y-4 border-t border-border/50 pt-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Target className="w-4 h-4 text-primary" /> Key Responsibilities
                </h4>
                <ul className="space-y-3">
                  {details.responsibilities.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                      <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* What We Look For */}
              <div className="space-y-4 border-t border-border/50 pt-6">
                <h4 className="text-sm font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                  <Award className="w-4 h-4 text-primary" /> What We Look For
                </h4>
                <ul className="space-y-3">
                  {details.requirements.map((item, index) => (
                    <li key={index} className="flex items-start gap-3 text-sm text-muted-foreground leading-relaxed">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Why Join Card */}
              <div className="bg-slate-50 dark:bg-secondary/40 rounded-xl border border-border/80 p-5 space-y-3.5">
                <h5 className="font-bold text-sm tracking-tight">Why Aspiria?</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Mentorship & Growth
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Direct Founder Access
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> End-to-end Ownership
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-primary" /> Flexible Hybrid Work
                  </div>
                </div>
              </div>

              {/* CTA Action Panel */}
              <div className="pt-4 flex gap-3 border-t border-border/60">
                <Button
                  onClick={() => applyForRole(selectedRole.title)}
                  className="flex-1 rounded-xl py-6 font-semibold text-white gradient-hero hover:shadow-glow shadow-elegant transition-smooth"
                >
                  Apply for this Role
                </Button>
                <Button
                  variant="outline"
                  onClick={() => setSelectedRole(null)}
                  className="rounded-xl px-5 border-border text-muted-foreground hover:text-foreground"
                >
                  Close
                </Button>
              </div>
            </div>
          </SheetContent>
        )}
      </Sheet>

      {/* Application Form Section */}
      <section ref={formRef} className="container mx-auto px-4 py-16 max-w-3xl">
        <div className={`rounded-2xl border transition-all duration-500 p-8 md:p-10 bg-card shadow-card-soft space-y-8 ${
          formHighlighted ? "border-primary ring-2 ring-primary/20 scale-[1.01]" : "border-border"
        }`}>
          
          {/* Header */}
          <div className="border-b border-border/80 pb-6 text-center sm:text-left">
            <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-foreground">
              Submit Your Application
            </h2>
            <p className="text-sm text-muted-foreground mt-2">
              Fill out the form below. Our recruitment team typically reviews resumes and responds within 5 business days.
            </p>
          </div>

          <form onSubmit={submit} className="space-y-6">
            
            {/* Position Display/Selection banner */}
            {position ? (
              <div className="bg-primary/5 dark:bg-primary/10 rounded-xl border border-primary/20 p-4 flex items-center justify-between gap-4 animate-fade-in">
                <div className="flex items-center gap-3">
                  <Briefcase className="w-5 h-5 text-primary shrink-0" />
                  <div>
                    <span className="text-[10px] uppercase font-bold text-primary block">Applying For Role</span>
                    <span className="text-sm font-bold text-foreground">{position}</span>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setPosition("")}
                  className="p-1 rounded-full hover:bg-primary/10 text-muted-foreground hover:text-primary transition-colors"
                  title="Clear selection"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="bg-amber-50 dark:bg-amber-950/20 rounded-xl border border-amber-200/40 p-4 flex items-start gap-3">
                <Info className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                <p className="text-xs text-amber-800 dark:text-amber-300 leading-relaxed">
                  You haven't selected a specific role yet. You can apply for any position by typing its name in the field below, or browse open roles above.
                </p>
              </div>
            )}

            {/* Form Fields */}
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="fullname" className="text-sm font-semibold">Full Name *</Label>
                <Input
                  id="fullname"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Jane Doe"
                  required
                  className="rounded-xl border-border py-5 bg-card shadow-sm text-sm"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email" className="text-sm font-semibold">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="jane.doe@example.com"
                  required
                  className="rounded-xl border-border py-5 bg-card shadow-sm text-sm"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="position" className="text-sm font-semibold">Position Interested In *</Label>
              <Input
                id="position"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                placeholder="e.g. Strategy Consulting Intern, Web Developer"
                required
                className="rounded-xl border-border py-5 bg-card shadow-sm text-sm"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-sm font-semibold">Cover Note / Message (Optional)</Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                placeholder="Briefly tell us why you are a great fit for this role and Aspiria..."
                className="rounded-xl border-border bg-card shadow-sm text-sm resize-none"
              />
            </div>

            {/* Resume Upload Drag & Drop Zone */}
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Resume Upload (PDF, DOC, DOCX) *</Label>
              
              <div
                onDragEnter={handleDrag}
                onDragOver={handleDrag}
                onDragLeave={handleDrag}
                onDrop={handleDrop}
                className={`relative flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-8 transition-all duration-300 ${
                  dragActive 
                    ? "border-primary bg-primary/5 scale-[0.99]" 
                    : resumeFile 
                    ? "border-emerald-200 dark:border-emerald-900 bg-emerald-500/5 animate-fade-in" 
                    : "border-border hover:border-muted-foreground/30 bg-card/50"
                }`}
              >
                <input
                  type="file"
                  id="resume-file"
                  accept=".pdf,.doc,.docx"
                  onChange={(e) => handleFile(e.target.files)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                />

                {resumeFile ? (
                  <div className="text-center space-y-3 z-20">
                    <div className="p-3 bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-full inline-block">
                      <FileText className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground max-w-[280px] truncate mx-auto">
                        {resumeFile.name}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {(resumeFile.size / (1024 * 1024)).toFixed(2)} MB
                      </p>
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setResumeFile(null);
                      }}
                      className="text-xs text-destructive hover:text-destructive hover:bg-destructive/10 rounded-lg px-3 py-1 font-semibold"
                    >
                      Remove File
                    </Button>
                  </div>
                ) : (
                  <div className="text-center space-y-3 pointer-events-none">
                    <div className="p-3 bg-muted rounded-full inline-block text-muted-foreground">
                      <Upload className="w-6 h-6" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-foreground">
                        Drag and drop your resume file here
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        or click to browse documents (PDF, DOC, DOCX up to 4MB)
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Actions Panel */}
            <div className="pt-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <Button
                type="submit"
                disabled={loading}
                className="w-full sm:w-auto rounded-xl py-6 px-8 font-semibold text-white gradient-hero shadow-elegant hover:shadow-glow hover:scale-[1.02] active:scale-[0.98] border-0 transition-smooth"
              >
                {loading ? (
                  <span className="flex items-center justify-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin" /> Submitting Application...
                  </span>
                ) : (
                  <span className="flex items-center justify-center gap-2">
                    Submit Application <ArrowRight className="w-4 h-4" />
                  </span>
                )}
              </Button>
              <p className="text-xs text-muted-foreground text-center sm:text-right">
                By submitting this form, you agree to our career privacy policy.
              </p>
            </div>
          </form>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
