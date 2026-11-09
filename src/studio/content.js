// Every word on the site lives here, so copy edits never touch layout code.

export const LINKS = {
  resume:
    "https://docs.google.com/document/d/13A7BovVOnalGjc2_hyUDQ8AKsRLc-YsSogai-aBWTTw/view?usp=sharing",
  github: "https://github.com/shikhasingh07",
  linkedin: "https://www.linkedin.com/in/shikha-singh-b027a7179/",
  email: "mailto:shikha.thakur2295@gmail.com",
  target: "https://india.target.com/",
};

export const STATS = [
  { n: "5+", l: "years shipping", tone: "pink", rot: -7 },
  { n: "7K+", l: "vendors onboarded", tone: "olive", rot: 5 },
  { n: "60%", l: "faster UI load", tone: "wine", rot: -3 },
  { n: "20d", l: "idea to MVP", tone: "sky", rot: 8 },
];

export const EXPERIENCE = [
  {
    id: "target",
    file: "target.exp",
    role: "Software Engineer (SDE-I)",
    company: "Target",
    period: "Jan 2022 to Present",
    bullets: [
      "Reduced 3D package size by 35% and UI load time by 60%",
      "Onboarded 7,000+ vendors and built AI reporting for 1,000+ users",
      "Shipped MentorHub in 20 days and earned a Quarterly Excellence Award",
    ],
  },
  {
    id: "capgemini",
    file: "capgemini.exp",
    role: "Software Engineer (SDE-I)",
    company: "Capgemini Engineering",
    period: "Nov 2020 to Jan 2022",
    bullets: [
      "Built Logistika from scratch with React, Redux and TypeScript",
      "99.9% code reliability via Jest across 6,000+ worker workflows",
    ],
  },
];

export const PROJECTS = [
  {
    id: "01",
    visual: "cube",
    title: "Gargantua",
    subtitle: "GGA Platform",
    tag: "Target · Enterprise",
    desc: "A 3D asset management platform for external vendors, with AI-powered comparisons and Web Workers keeping everything responsive.",
    metrics: [
      { n: "7,000+", l: "vendors" },
      { n: "60%", l: "less load time" },
      { n: "55%", l: "less API latency" },
    ],
    tech: ["React.js", "Three.js", "TypeScript", "Web Workers", "AWS"],
  },
  {
    id: "02",
    visual: "report",
    title: "AI Reporting",
    subtitle: "Internal platform",
    tag: "Target · Internal",
    desc: "Generates project reports instantly for the whole team and eliminated the manual work entirely.",
    metrics: [
      { n: "1,000+", l: "team members" },
      { n: "10–15", l: "reports a week" },
      { n: "0", l: "manual work" },
    ],
    tech: ["React.js", "TypeScript", "Gen AI", "LLM Integration"],
  },
  {
    id: "03",
    visual: "calendar",
    title: "MentorHub",
    subtitle: "Mentorship scheduling",
    tag: "Target · Internal",
    desc: "A full-scale mentorship scheduling platform, delivered fast and deployed across the whole organisation.",
    metrics: [
      { n: "20", l: "days to deliver" },
      { n: "Org", l: "wide rollout" },
      { n: "1", l: "Excellence Award" },
    ],
    tech: ["React.js", "TypeScript", "Redux", "Tailwind CSS"],
  },
  {
    id: "04",
    visual: "memories",
    title: "Memories",
    subtitle: "Social app",
    tag: "Personal Project",
    desc: "A full-stack social media app with JWT auth, Google OAuth and full CRUD, from database to UI.",
    metrics: [
      { n: "MERN", l: "full stack" },
      { n: "OAuth", l: "+ JWT auth" },
    ],
    tech: ["React.js", "Node.js", "MongoDB", "JWT", "OAuth"],
    link: "https://github.com/shikhasingh07/memories",
  },
];

export const STACK = [
  { name: "React.js", used: "Gargantua · AI Reporting · MentorHub" },
  { name: "TypeScript", used: "Gargantua · AI Reporting · MentorHub" },
  { name: "Three.js", used: "Gargantua" },
  { name: "Redux", used: "MentorHub · Logistika" },
  { name: "Tailwind CSS", used: "MentorHub" },
  { name: "Web Workers", used: "Gargantua" },
  { name: "AWS", used: "Gargantua" },
  { name: "Gen AI", used: "AI Reporting" },
  { name: "Flutter", used: "Elevate App" },
];
