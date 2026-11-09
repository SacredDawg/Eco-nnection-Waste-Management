import { FormEvent, useEffect, useMemo, useState } from "react";
import {
  ArrowRight,
  Bot,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CircleAlert,
  Clock3,
  Globe2,
  Leaf,
  Mail,
  MapPin,
  Menu,
  MessageCircle,
  Phone,
  Plus,
  Recycle,
  Search,
  Send,
  Sparkles,
  Trash2,
  TrendingDown,
  Users,
  X,
} from "lucide-react";

type Report = {
  id: number;
  author: string;
  initials: string;
  category: string;
  location: string;
  date: string;
  title: string;
  description: string;
  status: "Needs attention" | "In progress" | "Resolved";
  image?: string;
};

const seedReports: Report[] = [
  {
    id: 1,
    author: "Maria Santos",
    initials: "MS",
    category: "Plastic Waste",
    location: "Purok 3, Riverside",
    date: "Today, 8:42 AM",
    title: "Plastic buildup near the creek",
    description:
      "Several sacks of mixed plastic were spotted beside the footbridge. This may block drainage when the rain comes.",
    status: "Needs attention",
    image:
      "https://images.unsplash.com/photo-1588827054907-d478fcd961e6?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 2,
    author: "Juan dela Cruz",
    initials: "JD",
    category: "Community Cleanup",
    location: "Halang Covered Court",
    date: "Yesterday, 4:15 PM",
    title: "Sunday cleanup collected 18 sacks",
    description:
      "Thank you to the 26 neighbors who joined. Recyclables were separated and brought to our partner junk shop.",
    status: "Resolved",
    image:
      "https://images.unsplash.com/photo-1583259883677-edc4ee5ffba9?auto=format&fit=crop&w=900&q=80",
  },
  {
    id: 3,
    author: "Eco-Warrior Youth",
    initials: "EY",
    category: "Collection Issue",
    location: "Purok 5, Mabini St.",
    date: "May 24, 10:20 AM",
    title: "Missed collection on Mabini Street",
    description:
      "Biodegradable waste has not been collected since Tuesday. The concern was forwarded to the barangay team.",
    status: "In progress",
  },
];

const faqs = [
  {
    q: "What kind of waste concern can I report?",
    a: "You can log uncollected trash, illegal dumping, clogged drainage, plastic buildup, e-waste, and completed cleanup or recycling activities within Barangay Halang.",
  },
  {
    q: "Who can submit an activity?",
    a: "Any Barangay Halang resident, youth group, homeowner association, volunteer, or local organization may contribute a report.",
  },
  {
    q: "What happens after I submit?",
    a: "Your report appears in the community feed. In a fully connected version, barangay staff can verify it and update its status from Needs attention to In progress or Resolved.",
  },
  {
    q: "When is regular waste collection?",
    a: "Biodegradable waste is collected Monday, Wednesday, and Friday. Non-biodegradable and recyclable waste is collected Tuesday and Saturday. Place waste outside before 7:00 AM.",
  },
];

const categoryColors: Record<string, string> = {
  "Plastic Waste": "bg-amber-50 text-amber-800",
  "Community Cleanup": "bg-emerald-50 text-emerald-800",
  "Collection Issue": "bg-rose-50 text-rose-800",
  "Illegal Dumping": "bg-orange-50 text-orange-800",
  "E-waste": "bg-sky-50 text-sky-800",
};

const statusStyles: Record<Report["status"], string> = {
  "Needs attention": "bg-rose-50 text-rose-700 border-rose-100",
  "In progress": "bg-amber-50 text-amber-700 border-amber-100",
  Resolved: "bg-emerald-50 text-emerald-700 border-emerald-100",
};

function App() {
  const [reports, setReports] = useState<Report[]>(seedReports);
  const [filter, setFilter] = useState("All activity");
  const [search, setSearch] = useState("");
  const [reportOpen, setReportOpen] = useState(false);
  const [botOpen, setBotOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  const [botInput, setBotInput] = useState("");
  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Mabuhay! I’m Lunti, your eco-assistant. Ask me about waste sorting, collection schedules, or reporting a concern.",
    },
  ]);

  useEffect(() => {
    const saved = localStorage.getItem("econnection-reports");
    if (saved) {
      try {
        setReports(JSON.parse(saved));
      } catch {
        localStorage.removeItem("econnection-reports");
      }
    }
  }, []);

  const visibleReports = useMemo(() => {
    return reports.filter((report) => {
      const filterMatch =
        filter === "All activity" ||
        (filter === "Open concerns" && report.status !== "Resolved") ||
        (filter === "Resolved" && report.status === "Resolved");
      const searchMatch = `${report.title} ${report.description} ${report.location}`
        .toLowerCase()
        .includes(search.toLowerCase());
      return filterMatch && searchMatch;
    });
  }, [reports, filter, search]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
    setMenuOpen(false);
  };

  const addReport = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const author = String(data.get("author"));
    const newReport: Report = {
      id: Date.now(),
      author,
      initials: author
        .split(" ")
        .map((word) => word[0])
        .join("")
        .slice(0, 2)
        .toUpperCase(),
      category: String(data.get("category")),
      location: String(data.get("location")),
      date: "Just now",
      title: String(data.get("title")),
      description: String(data.get("description")),
      status: "Needs attention",
    };
    const updated = [newReport, ...reports];
    setReports(updated);
    localStorage.setItem("econnection-reports", JSON.stringify(updated));
    setReportOpen(false);
    setFilter("All activity");
    setTimeout(() => scrollTo("feed"), 100);
  };

  const sendBotMessage = (suggestion?: string) => {
    const text = suggestion || botInput.trim();
    if (!text) return;
    const lower = text.toLowerCase();
    let response =
      "I can help with waste sorting, collection schedules, and how to report concerns. For urgent concerns, contact the barangay office at (049) 502-1846.";
    if (lower.includes("collect") || lower.includes("schedule")) {
      response =
        "Biodegradable waste: Monday, Wednesday, Friday. Recyclables and residual waste: Tuesday and Saturday. Please bring bins out before 7:00 AM.";
    } else if (lower.includes("sort") || lower.includes("segreg")) {
      response =
        "Use separate containers: green for biodegradable, blue for recyclables, black for residual waste, and a labeled dry box for e-waste or hazardous items.";
    } else if (lower.includes("report") || lower.includes("dump")) {
      response =
        "Tap “Log an activity,” add the exact location and a clear description, then submit. Avoid confronting anyone involved in illegal dumping.";
    }
    setMessages((current) => [...current, { from: "user", text }, { from: "bot", text: response }]);
    setBotInput("");
  };

  return (
    <div className="min-h-screen bg-[#f8f7f1] text-[#17352a]">
      <header className="fixed inset-x-0 top-0 z-40 border-b border-[#17352a]/10 bg-[#f8f7f1]/90 backdrop-blur-xl">
        <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 lg:px-8">
          <button className="flex items-center gap-3" onClick={() => scrollTo("home")}>
            <span className="grid h-10 w-10 place-items-center rounded-full bg-[#1f6b4b] text-white">
              <Leaf size={21} strokeWidth={2.4} />
            </span>
            <span className="text-left text-xl font-bold tracking-[-0.04em]">
              eco-<span className="text-[#2f8b62]">nnection</span>
              <span className="block text-[9px] font-semibold uppercase tracking-[0.2em] text-[#6f8077]">
                Barangay Halang
              </span>
            </span>
          </button>
          <nav className="hidden items-center gap-8 text-sm font-semibold lg:flex">
            <button onClick={() => scrollTo("home")}>Home</button>
            <button onClick={() => scrollTo("impact")}>Our impact</button>
            <button onClick={() => scrollTo("feed")}>Community feed</button>
            <button onClick={() => scrollTo("faqs")}>FAQs</button>
          </nav>
          <button
            onClick={() => setReportOpen(true)}
            className="hidden items-center gap-2 rounded-full bg-[#173f32] px-5 py-3 text-sm font-bold text-white shadow-sm transition hover:-translate-y-0.5 hover:bg-[#0f3025] md:flex"
          >
            <Plus size={17} /> Log an activity
          </button>
          <button
            className="rounded-full border border-[#17352a]/15 p-2.5 lg:hidden"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label="Toggle menu"
          >
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
        {menuOpen && (
          <div className="border-t border-[#17352a]/10 bg-[#f8f7f1] px-5 py-5 lg:hidden">
            <div className="flex flex-col items-start gap-4 font-semibold">
              {[
                ["Home", "home"],
                ["Our impact", "impact"],
                ["Community feed", "feed"],
                ["FAQs", "faqs"],
              ].map(([label, id]) => (
                <button key={id} onClick={() => scrollTo(id)}>
                  {label}
                </button>
              ))}
              <button
                onClick={() => {
                  setReportOpen(true);
                  setMenuOpen(false);
                }}
                className="mt-2 w-full rounded-full bg-[#173f32] px-5 py-3 text-white"
              >
                Log an activity
              </button>
            </div>
          </div>
        )}
      </header>

      <main>
        <section id="home" className="relative overflow-hidden pb-20 pt-32 lg:pb-28 lg:pt-40">
          <div className="eco-grid absolute inset-0 opacity-40" />
          <div className="relative mx-auto grid max-w-7xl items-center gap-14 px-5 lg:grid-cols-[1.05fr_.95fr] lg:px-8">
            <div>
              <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#2f8b62]/20 bg-[#e7f2e7] px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-[#296a4d]">
                <Sparkles size={14} /> A cleaner Halang starts with us
              </div>
              <h1 className="max-w-3xl text-[3.35rem] font-bold leading-[.96] tracking-[-0.06em] sm:text-7xl lg:text-[5.6rem]">
                See it. Sort it.
                <span className="block font-serif font-normal italic text-[#2f8b62]">
                  Solve it together.
                </span>
              </h1>
              <p className="mt-7 max-w-xl text-lg leading-8 text-[#53665d]">
                A shared space for Barangay Halang to report waste concerns, celebrate cleanup
                efforts, and turn local data into collective action.
              </p>
              <div className="mt-9 flex flex-col gap-3 sm:flex-row">
                <button
                  onClick={() => setReportOpen(true)}
                  className="group flex items-center justify-center gap-3 rounded-full bg-[#f4c95d] px-7 py-4 font-bold text-[#17352a] shadow-[0_8px_30px_rgba(138,108,30,.16)] transition hover:-translate-y-1"
                >
                  Log waste activity
                  <ArrowRight size={18} className="transition group-hover:translate-x-1" />
                </button>
                <button
                  onClick={() => scrollTo("feed")}
                  className="rounded-full border border-[#17352a]/20 bg-white/60 px-7 py-4 font-bold transition hover:bg-white"
                >
                  View community feed
                </button>
              </div>
              <div className="mt-10 flex items-center gap-4 text-sm text-[#53665d]">
                <div className="flex -space-x-2">
                  {["MS", "JD", "AR", "+"].map((item, i) => (
                    <span
                      key={item}
                      className={`grid h-9 w-9 place-items-center rounded-full border-2 border-[#f8f7f1] text-[10px] font-bold ${i === 3 ? "bg-[#173f32] text-white" : "bg-[#dceadb] text-[#245b44]"}`}
                    >
                      {item}
                    </span>
                  ))}
                </div>
                <p>
                  <strong className="text-[#17352a]">286 residents</strong> keeping watch together
                </p>
              </div>
            </div>
            <div className="relative mx-auto w-full max-w-xl">
              <div className="absolute -left-10 -top-8 h-40 w-40 rounded-full bg-[#f4c95d]/35 blur-3xl" />
              <div className="relative overflow-hidden rounded-[2rem] bg-[#1d5a42] p-3 shadow-[0_28px_80px_rgba(29,74,56,.22)] sm:rounded-[2.7rem] sm:p-4">
                <img
                  className="aspect-[4/4.6] w-full rounded-[1.5rem] object-cover sm:rounded-[2.1rem]"
                  src="https://images.unsplash.com/photo-1588827054907-d478fcd961e6?auto=format&fit=crop&w=1200&q=85"
                  alt="Community members outdoors in the Philippines"
                />
                <div className="absolute inset-x-8 bottom-8 rounded-2xl border border-white/25 bg-[#102b22]/75 p-5 text-white backdrop-blur-md sm:inset-x-10 sm:bottom-10">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs font-bold uppercase tracking-[.15em] text-[#c6e8cf]">
                        This month
                      </p>
                      <p className="mt-1 text-2xl font-bold">48 concerns resolved</p>
                    </div>
                    <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-[#f4c95d] text-[#17352a]">
                      <CheckCircle2 />
                    </span>
                  </div>
                </div>
              </div>
              <div className="absolute -right-3 top-12 rounded-2xl bg-white p-4 shadow-xl sm:-right-12">
                <p className="text-xs font-semibold text-[#708077]">Waste diverted</p>
                <p className="mt-1 text-xl font-bold">1,280 kg</p>
              </div>
            </div>
          </div>
        </section>

        <section id="impact" className="bg-[#173f32] py-20 text-white">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-5 md:flex-row md:items-end">
              <div>
                <p className="section-label text-[#a9d2b6]">Halang at a glance</p>
                <h2 className="mt-3 max-w-xl text-4xl font-bold tracking-[-0.04em] sm:text-5xl">
                  Small reports. Measurable change.
                </h2>
              </div>
              <p className="max-w-md leading-7 text-[#c7d7cf]">
                Community reporting helps us find recurring problems, direct cleanup teams, and make
                every collection route count.
              </p>
            </div>
            <div className="mt-12 grid gap-px overflow-hidden rounded-3xl bg-white/10 sm:grid-cols-2 lg:grid-cols-4">
              {[
                [Recycle, "1,280 kg", "Waste diverted", "+18% this month"],
                [CheckCircle2, "148", "Issues resolved", "82% resolution rate"],
                [Users, "286", "Active residents", "Across 7 puroks"],
                [TrendingDown, "31%", "Less street waste", "Since January"],
              ].map(([Icon, value, label, note]) => {
                const StatIcon = Icon as typeof Recycle;
                return (
                  <div key={String(label)} className="bg-[#173f32] p-7 sm:p-8">
                    <StatIcon className="mb-10 text-[#f4c95d]" size={28} />
                    <p className="text-4xl font-bold tracking-[-.04em]">{String(value)}</p>
                    <p className="mt-2 font-semibold">{String(label)}</p>
                    <p className="mt-1 text-sm text-[#9db8aa]">{String(note)}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        <section id="feed" className="py-24">
          <div className="mx-auto max-w-7xl px-5 lg:px-8">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="section-label">Live community feed</p>
                <h2 className="mt-3 text-4xl font-bold tracking-[-.04em] sm:text-5xl">
                  What’s happening in Halang
                </h2>
              </div>
              <button
                onClick={() => setReportOpen(true)}
                className="flex w-fit items-center gap-2 rounded-full bg-[#173f32] px-6 py-3.5 font-bold text-white"
              >
                <Plus size={18} /> Add report
              </button>
            </div>
            <div className="mt-10 flex flex-col gap-4 rounded-2xl border border-[#17352a]/10 bg-white p-3 md:flex-row md:items-center md:justify-between">
              <div className="flex gap-1 overflow-x-auto">
                {["All activity", "Open concerns", "Resolved"].map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    className={`whitespace-nowrap rounded-xl px-4 py-2.5 text-sm font-bold transition ${
                      filter === item
                        ? "bg-[#dcebdc] text-[#1c6548]"
                        : "text-[#66756e] hover:bg-[#f4f5ef]"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
              <label className="flex items-center gap-2 rounded-xl bg-[#f3f3ed] px-4 py-2.5 text-[#6a7871]">
                <Search size={17} />
                <input
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  className="w-full bg-transparent text-sm outline-none md:w-56"
                  placeholder="Search location or issue"
                />
              </label>
            </div>
            <div className="mt-6 grid gap-5 lg:grid-cols-3">
              {visibleReports.map((report) => (
                <article
                  key={report.id}
                  className="group overflow-hidden rounded-3xl border border-[#17352a]/10 bg-white shadow-[0_8px_30px_rgba(37,66,52,.05)] transition hover:-translate-y-1 hover:shadow-[0_16px_40px_rgba(37,66,52,.10)]"
                >
                  {report.image ? (
                    <img className="h-52 w-full object-cover" src={report.image} alt="" />
                  ) : (
                    <div className="grid h-28 place-items-center bg-[#e7efe4] text-[#2f7656]">
                      <Trash2 size={36} strokeWidth={1.5} />
                    </div>
                  )}
                  <div className="p-6">
                    <div className="flex items-start justify-between gap-3">
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${categoryColors[report.category] || "bg-slate-50 text-slate-700"}`}
                      >
                        {report.category}
                      </span>
                      <span
                        className={`rounded-full border px-3 py-1 text-xs font-bold ${statusStyles[report.status]}`}
                      >
                        {report.status}
                      </span>
                    </div>
                    <h3 className="mt-5 text-xl font-bold tracking-[-.02em]">{report.title}</h3>
                    <p className="mt-2 line-clamp-3 text-sm leading-6 text-[#68776f]">
                      {report.description}
                    </p>
                    <div className="mt-5 flex items-center gap-2 text-xs font-semibold text-[#68776f]">
                      <MapPin size={14} className="text-[#2f8b62]" /> {report.location}
                    </div>
                    <div className="mt-5 flex items-center justify-between border-t border-[#17352a]/10 pt-4">
                      <div className="flex items-center gap-2">
                        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#dcebdc] text-[10px] font-bold">
                          {report.initials}
                        </span>
                        <span className="text-xs font-bold">{report.author}</span>
                      </div>
                      <span className="text-[11px] text-[#7c8982]">{report.date}</span>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            {!visibleReports.length && (
              <div className="mt-6 rounded-3xl border border-dashed border-[#17352a]/20 p-12 text-center">
                <Search className="mx-auto text-[#6d8076]" />
                <p className="mt-4 font-bold">No reports match your search.</p>
              </div>
            )}
          </div>
        </section>

        <section className="px-5 pb-24 lg:px-8">
          <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#e2ecdd] lg:grid-cols-2">
            <div className="p-8 sm:p-12 lg:p-16">
              <p className="section-label">Know your schedule</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-.04em]">
                Sort right. Set it out on time.
              </h2>
              <p className="mt-5 max-w-lg leading-7 text-[#5f7168]">
                Segregated waste keeps collectors safe and prevents recyclable materials from ending
                up in landfills.
              </p>
              <div className="mt-8 space-y-3">
                {[
                  ["Mon · Wed · Fri", "Biodegradable waste", "Kitchen scraps, leaves, food waste"],
                  ["Tue · Sat", "Recyclables & residuals", "Clean plastic, paper, cans, dry waste"],
                ].map(([days, title, detail]) => (
                  <div key={days} className="flex gap-4 rounded-2xl bg-white/70 p-4">
                    <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl bg-[#1f6b4b] text-white">
                      <CalendarDays size={20} />
                    </span>
                    <div>
                      <p className="text-xs font-bold uppercase tracking-wider text-[#2f8b62]">
                        {days}
                      </p>
                      <p className="font-bold">{title}</p>
                      <p className="text-sm text-[#6a7871]">{detail}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="relative min-h-[420px]">
              <img
                src="https://images.unsplash.com/photo-1641648543588-566d33856b3e?auto=format&fit=crop&w=1000&q=80"
                alt="Waste collection vehicle in the Philippines"
                className="absolute inset-0 h-full w-full object-cover"
              />
              <div className="absolute bottom-6 left-6 right-6 flex items-center gap-3 rounded-2xl bg-white/90 p-4 backdrop-blur">
                <Clock3 className="text-[#2f8b62]" />
                <p className="text-sm">
                  <strong>Collection starts at 7:00 AM.</strong>
                  <br />
                  Set bins out early, not overnight.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section id="faqs" className="bg-white py-24">
          <div className="mx-auto grid max-w-7xl gap-12 px-5 lg:grid-cols-[.75fr_1.25fr] lg:px-8">
            <div>
              <p className="section-label">Good to know</p>
              <h2 className="mt-3 text-4xl font-bold tracking-[-.04em] sm:text-5xl">
                Frequently asked questions
              </h2>
              <p className="mt-5 max-w-sm leading-7 text-[#64746c]">
                Can’t find what you need? Chat with Lunti or contact the Barangay Halang Environment
                Desk.
              </p>
              <button
                onClick={() => setBotOpen(true)}
                className="mt-7 flex items-center gap-2 font-bold text-[#24704f]"
              >
                Ask Lunti <ArrowRight size={18} />
              </button>
            </div>
            <div className="divide-y divide-[#17352a]/10 border-y border-[#17352a]/10">
              {faqs.map((faq, index) => (
                <div key={faq.q}>
                  <button
                    onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                    className="flex w-full items-center justify-between gap-6 py-6 text-left text-lg font-bold"
                  >
                    {faq.q}
                    <ChevronDown
                      className={`shrink-0 transition ${openFaq === index ? "rotate-180" : ""}`}
                    />
                  </button>
                  {openFaq === index && (
                    <p className="max-w-2xl pb-6 leading-7 text-[#64746c]">{faq.a}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      <footer className="bg-[#102c23] px-5 pb-8 pt-16 text-white lg:px-8">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-12 pb-14 md:grid-cols-2 lg:grid-cols-[1.4fr_.7fr_1fr]">
            <div>
              <div className="flex items-center gap-3 text-xl font-bold">
                <span className="grid h-10 w-10 place-items-center rounded-full bg-[#f4c95d] text-[#17352a]">
                  <Leaf size={20} />
                </span>
                eco-nnection
              </div>
              <p className="mt-5 max-w-md leading-7 text-[#a9bbb3]">
                Connecting every neighbor to a cleaner, safer, and more sustainable Barangay Halang.
              </p>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8eaaa0]">Explore</p>
              <div className="mt-5 flex flex-col items-start gap-3 text-sm font-semibold">
                <button onClick={() => scrollTo("impact")}>Our impact</button>
                <button onClick={() => scrollTo("feed")}>Community feed</button>
                <button onClick={() => scrollTo("faqs")}>FAQs</button>
              </div>
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-[.18em] text-[#8eaaa0]">
                Barangay contact
              </p>
              <div className="mt-5 space-y-4 text-sm text-[#c4d0cb]">
                <p className="flex gap-3">
                  <MapPin size={18} className="shrink-0 text-[#f4c95d]" /> Barangay Hall, Halang,
                  Calamba, Laguna
                </p>
                <a className="flex gap-3" href="tel:+63495021846">
                  <Phone size={18} className="text-[#f4c95d]" /> (049) 502-1846
                </a>
                <a className="flex gap-3" href="mailto:ecodesk@brgyhalang.ph">
                  <Mail size={18} className="text-[#f4c95d]" /> ecodesk@brgyhalang.ph
                </a>
              </div>
            </div>
          </div>
          <div className="flex flex-col justify-between gap-4 border-t border-white/10 pt-7 text-xs text-[#82978e] sm:flex-row">
            <p>© 2025 eco-nnection · Barangay Halang Community Initiative</p>
            <div className="flex gap-4">
              <a href="#" aria-label="Barangay website">
                <Globe2 size={17} />
              </a>
              <a href="mailto:ecodesk@brgyhalang.ph" aria-label="Email">
                <Mail size={17} />
              </a>
            </div>
          </div>
        </div>
      </footer>

      <button
        onClick={() => setBotOpen(!botOpen)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-3 rounded-full bg-[#f4c95d] p-4 font-bold text-[#17352a] shadow-[0_12px_40px_rgba(19,53,42,.28)] transition hover:-translate-y-1 sm:px-5"
        aria-label="Open eco-assistant"
      >
        {botOpen ? <X size={21} /> : <MessageCircle size={21} />}
        <span className="hidden sm:inline">{botOpen ? "Close" : "Ask Lunti"}</span>
      </button>

      {botOpen && (
        <div className="fixed bottom-24 right-4 z-40 flex h-[min(560px,calc(100vh-130px))] w-[calc(100vw-2rem)] max-w-sm flex-col overflow-hidden rounded-3xl border border-[#17352a]/10 bg-white shadow-2xl">
          <div className="flex items-center gap-3 bg-[#173f32] p-5 text-white">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-[#f4c95d] text-[#17352a]">
              <Bot />
            </span>
            <div>
              <p className="font-bold">Lunti</p>
              <p className="text-xs text-[#b8d1c5]">Halang eco-assistant · Online</p>
            </div>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto bg-[#f7f7f2] p-4">
            {messages.map((message, index) => (
              <div
                key={index}
                className={`flex ${message.from === "user" ? "justify-end" : "justify-start"}`}
              >
                <p
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-sm leading-6 ${
                    message.from === "user"
                      ? "rounded-br-md bg-[#1f6b4b] text-white"
                      : "rounded-bl-md bg-white shadow-sm"
                  }`}
                >
                  {message.text}
                </p>
              </div>
            ))}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {["Collection schedule", "How do I sort waste?", "Report illegal dumping"].map(
                  (item) => (
                    <button
                      key={item}
                      onClick={() => sendBotMessage(item)}
                      className="rounded-full border border-[#2f8b62]/20 bg-white px-3 py-2 text-xs font-bold text-[#236146]"
                    >
                      {item}
                    </button>
                  ),
                )}
              </div>
            )}
          </div>
          <form
            onSubmit={(event) => {
              event.preventDefault();
              sendBotMessage();
            }}
            className="flex gap-2 border-t border-[#17352a]/10 p-3"
          >
            <input
              value={botInput}
              onChange={(e) => setBotInput(e.target.value)}
              className="min-w-0 flex-1 rounded-full bg-[#f2f3ed] px-4 text-sm outline-none"
              placeholder="Ask about waste..."
            />
            <button
              className="grid h-11 w-11 place-items-center rounded-full bg-[#173f32] text-white"
              aria-label="Send message"
            >
              <Send size={17} />
            </button>
          </form>
        </div>
      )}

      {reportOpen && (
        <div className="fixed inset-0 z-50 grid place-items-center overflow-y-auto bg-[#102c23]/65 p-4 backdrop-blur-sm">
          <div className="my-6 w-full max-w-xl rounded-3xl bg-[#fbfaf5] p-6 shadow-2xl sm:p-8">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="section-label">Community report</p>
                <h2 className="mt-2 text-3xl font-bold tracking-[-.04em]">Log waste activity</h2>
                <p className="mt-2 text-sm text-[#64746c]">
                  Give clear, factual details to help the community respond.
                </p>
              </div>
              <button
                onClick={() => setReportOpen(false)}
                className="rounded-full bg-[#edf0e9] p-2"
                aria-label="Close"
              >
                <X size={20} />
              </button>
            </div>
            <form onSubmit={addReport} className="mt-7 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="form-label">
                  Your name
                  <input name="author" required placeholder="Juan dela Cruz" />
                </label>
                <label className="form-label">
                  Category
                  <select name="category" required defaultValue="Plastic Waste">
                    {[
                      "Plastic Waste",
                      "Collection Issue",
                      "Illegal Dumping",
                      "Community Cleanup",
                      "E-waste",
                    ].map((item) => (
                      <option key={item}>{item}</option>
                    ))}
                  </select>
                </label>
              </div>
              <label className="form-label">
                Activity or concern title
                <input name="title" required placeholder="e.g. Uncollected waste near the creek" />
              </label>
              <label className="form-label">
                Exact location
                <input name="location" required placeholder="Purok, street, or landmark" />
              </label>
              <label className="form-label">
                What happened?
                <textarea
                  name="description"
                  required
                  rows={4}
                  placeholder="Describe what you saw or what your group accomplished..."
                />
              </label>
              <div className="flex gap-3 rounded-2xl bg-[#e9f1e5] p-4 text-sm text-[#426353]">
                <CircleAlert size={19} className="mt-0.5 shrink-0" />
                <p>
                  For hazardous waste or immediate danger, call the barangay office instead of
                  handling it yourself.
                </p>
              </div>
              <button className="flex w-full items-center justify-center gap-2 rounded-full bg-[#173f32] px-6 py-4 font-bold text-white">
                Submit to community feed <ArrowRight size={18} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
