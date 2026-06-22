import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Layout } from "@/components/Layout";
import { useSEO } from "@/hooks/useSEO";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Briefcase, MapPin, Calendar, Search, Upload, Loader2, ArrowRight, CheckCircle2 } from "lucide-react";

const Careers = () => {
  useSEO({
    title: "Careers at Aspiria | Join Us in Driving Real Growth",
    description: "Explore internship and full-time career opportunities at Aspiria. Help us build strategies and digital products that empower SMEs and startups.",
    canonical: "https://aspiria.com/careers",
  });

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [position, setPosition] = useState("");
  const [message, setMessage] = useState("");
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [roleType, setRoleType] = useState<"full-time" | "internship">("full-time");
  const [searchQuery, setSearchQuery] = useState("");
  const [expandedRole, setExpandedRole] = useState<string | null>(null);

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
      toast({ title: "Application sent", description: "We received your application." });
      setName(""); setEmail(""); setPosition(""); setMessage(""); setResumeFile(null);
    } catch (err: any) {
      console.error("career submit", err);
      toast({ title: "Submission failed", description: err?.message || String(err) });
    } finally {
      setLoading(false);
    }
  };

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

  const filteredPositions = presetPositions.filter((role) => role.type === roleType);
  const visiblePositions = filteredPositions.filter((role) =>
    role.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    role.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handlePositionChange = (val: string) => setPosition(val);

  return (
    <Layout>
      <section className="gradient-soft py-20 md:py-24">
        <div className="container mx-auto px-4 max-w-3xl text-center">
          <p className="text-sm font-semibold text-primary uppercase tracking-wider mb-3 animate-fade-in">Careers</p>
          <h1 className="text-4xl md:text-6xl font-extrabold mb-6 animate-fade-in-up">
            Build the future <span className="gradient-text">with us</span>
          </h1>
          <p className="text-lg text-muted-foreground animate-fade-in-up" style={{ animationDelay: "150ms" }}>
            We're building practical strategies and digital products that help SMEs and startups thrive. If you care about impact and craftsmanship, we'd love to hear from you.
          </p>
        </div>
      </section>

      <section className="container mx-auto px-4 py-16 max-w-6xl">
        <div className="grid lg:grid-cols-3 gap-10">
          <div className="lg:col-span-1 space-y-6">
            <div className="rounded-2xl border border-border p-6 bg-card shadow-card-soft space-y-4">
              <h3 className="text-xl font-bold tracking-tight">Why join Aspiria?</h3>
              <ul className="text-sm space-y-3.5 text-muted-foreground">
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Work directly with founders and growth-stage teams.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Complete autonomy to own projects end-to-end.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Mentorship and growth-focused career development.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Real impact on digital products for ambitious businesses.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <CheckCircle2 className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                  <span>Shape strategy from concept to launch with clients.</span>
                </li>
              </ul>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-secondary/40 border border-border/80 text-center">
                <MapPin className="w-5 h-5 text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Location</h4>
                <div className="text-xs text-muted-foreground mt-1">Remote / Hybrid</div>
              </div>
              <div className="p-5 rounded-2xl bg-slate-50 dark:bg-secondary/40 border border-border/80 text-center">
                <Calendar className="w-5 h-5 text-primary mx-auto mb-2" />
                <h4 className="font-semibold text-sm">Employment</h4>
                <div className="text-xs text-muted-foreground mt-1">Full-time / Contract</div>
              </div>
            </div>
          </div>

          <div className="lg:col-span-2 space-y-10">
            <div className="p-6 rounded-2xl border border-border bg-slate-50/50 dark:bg-secondary/20">
              <p className="text-xs uppercase tracking-[0.18em] font-semibold text-primary">Build the future of business with us</p>
              <p className="mt-2 text-sm text-muted-foreground">Select your target job type below, then browse open positions.</p>
            </div>

            <div className="flex gap-2">
              {(["internship", "full-time"] as const).map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => {
                    const nextPositions = presetPositions.filter((role) => role.type === type);
                    setRoleType(type);
                    if (!nextPositions.some((role) => role.title === position)) {
                      setPosition("");
                    }
                  }}
                  className={
                    "rounded-full px-5 py-2.5 text-sm font-semibold transition-smooth shadow-sm " +
                    (roleType === type
                      ? "gradient-hero text-white"
                      : "border border-border bg-background text-foreground hover:bg-accent/40")
                  }
                >
                  {type === "full-time" ? "Full-time" : "Internship"}
                </button>
              ))}
            </div>

            <div className="space-y-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <h2 className="text-xl font-bold tracking-tight">Currently open roles</h2>
                  <div className="text-sm text-muted-foreground mt-0.5">
                    Showing {visiblePositions.length} {roleType === "full-time" ? "full-time" : "internship"} {visiblePositions.length === 1 ? "role" : "roles"}
                  </div>
                </div>
                <div className="relative w-full sm:w-80">
                  <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search roles..."
                    className="pl-9 rounded-xl"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {visiblePositions.length > 0 ? visiblePositions.map((role) => {
                  const isExpanded = expandedRole === role.title;
                  const isSelected = position === role.title;
                  return (
                    <button
                      key={role.title}
                      type="button"
                      onClick={() => {
                        const nextExpanded = isExpanded ? null : role.title;
                        setExpandedRole(nextExpanded);
                        setPosition(role.title);
                      }}
                      className={
                        "w-full text-left rounded-2xl transition-all duration-300 border p-5 hover-lift " +
                        (isSelected || isExpanded
                          ? 'border-primary bg-primary/[0.03] dark:bg-primary/[0.01] shadow-elegant'
                          : 'border-border bg-card shadow-sm hover:shadow')
                      }
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <div className="font-semibold text-base text-foreground tracking-tight">{role.title}</div>
                          {role.type === "full-time" && role.experience ? (
                            <div className="text-xs text-muted-foreground mt-1.5 flex items-center gap-1.5">
                              <Briefcase className="w-3.5 h-3.5" /> {role.experience}
                            </div>
                          ) : null}
                        </div>
                        <div className="text-xs font-semibold text-primary shrink-0 uppercase tracking-wider mt-0.5">
                          {isExpanded ? 'Hide' : 'Details'}
                        </div>
                      </div>
                      {isExpanded ? (
                        <p className="mt-3.5 text-sm text-muted-foreground leading-relaxed border-t border-border/50 pt-3 animate-fade-in">
                          {role.description}
                        </p>
                      ) : null}
                    </button>
                  );
                }) : (
                  <div className="col-span-2 rounded-2xl border border-dashed border-border bg-background/50 p-8 text-center text-sm text-muted-foreground">
                    No roles match your search query. Try another keyword.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-2xl border border-border p-8 bg-card shadow-card-soft space-y-6">
              <div className="border-b border-border/80 pb-4">
                <h2 className="text-2xl font-bold tracking-tight">Apply for a position</h2>
                <p className="text-sm text-muted-foreground mt-1">Please fill out all the details below. We typically respond in 5 business days.</p>
              </div>

              <form id="careers-form" onSubmit={submit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <Label htmlFor="fullname">Full name *</Label>
                    <Input
                      id="fullname"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Jane Doe"
                      required
                      className="rounded-xl"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@company.com"
                      required
                      className="rounded-xl"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="position">Position *</Label>
                  <Input
                    id="position"
                    value={position}
                    onChange={(e) => handlePositionChange(e.target.value)}
                    placeholder="e.g. Senior Consultant"
                    required
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-1.5">
                  <Label htmlFor="message">Message (optional)</Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    rows={4}
                    placeholder="Tell us why you'd be a great fit for Aspiria."
                    className="rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Resume (PDF, DOC, DOCX) *</Label>
                  <div className="flex flex-col sm:flex-row sm:items-center gap-3">
                    <label className="inline-flex items-center gap-2 cursor-pointer rounded-xl border border-border px-4 py-2.5 bg-background hover:bg-accent/40 active:scale-[0.98] transition-smooth text-sm font-medium shadow-sm">
                      <Upload className="w-4 h-4 text-muted-foreground" />
                      <span>Choose file</span>
                      <input
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={(e) => handleFile(e.target.files)}
                        className="hidden"
                      />
                    </label>
                    <div className="text-sm text-muted-foreground truncate max-w-[280px]">
                      {resumeFile ? resumeFile.name : "No file chosen"}
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button
                    type="submit"
                    disabled={loading}
                    className={"w-full sm:w-auto rounded-xl px-6 py-2.5 font-semibold text-white transition-smooth shadow-elegant hover:scale-[1.02] active:scale-[0.98] hover:shadow-glow border-0 " + (loading ? "opacity-70 bg-foreground/60" : "gradient-hero")}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2 className="w-4 h-4 animate-spin" /> Sending...
                      </span>
                    ) : (
                      <span className="flex items-center gap-1.5">
                        Apply <ArrowRight className="w-4 h-4" />
                      </span>
                    )}
                  </Button>
                  <div className="text-xs text-muted-foreground">
                    By submitting, you agree to our privacy policy.
                  </div>
                </div>
              </form>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Careers;
