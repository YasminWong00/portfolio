export const profile = {
  name: "Yasmin Wong",
  initials: "YW",
  role: "Frontend Developer",
  location: "Selangor, Malaysia",
  email: "yasminwong00@gmail.com",
  linkedin: "https://www.linkedin.com/in/yasmin-wong-274367254/",
  linkedinLabel: "linkedin.com/in/yasmin-wong-274367254",
  resumeFile: "Yasmin-Wong-Resume.pdf",
  tagline: "UI/UX, backend, automation, and learning toward AI",
  welcome:
    "Welcome to my portfolio. I'm a frontend developer, and I follow the work through to the backend when a product needs it. UI and UX shape how I build: hierarchy, interaction, and the details that make a screen feel finished. I like automating the repetitive parts of delivery, and I'm learning forward into AI, and how to use it in support of the craft.",
  summary:
    "Frontend developer with hands-on backend experience in React, TypeScript, and Laravel. Focused on UI/UX, workflow automation, and learning forward into AI.",
  now: "Now at Amial Technology. Previously frontend at Trigon Tech, and digital delivery at Ranhill Worley.",
  educationShort: "Software Engineering, UMPSA, 2024",
} as const;

export const focus = [
  {
    title: "Product interfaces",
    copy: "Responsive UI in React and TypeScript, with Redux when the screen has real state to manage. Layout, interaction, and the details that make a product feel considered.",
  },
  {
    title: "Backend and APIs",
    copy: "Laravel on the other side of the interface: controllers, services, DTOs, and MySQL. Enough backend to ship a feature the whole way through.",
  },
  {
    title: "Automation",
    copy: "Docker, digital workflows, and the unglamorous work of making delivery repeatable so the same steps do not have to be done by hand.",
  },
  {
    title: "Toward AI",
    copy: "Learning forward into AI, and how it can support frontend work, UX decisions, and automation inside real product work.",
  },
] as const;

export const coreSkills = [
  { label: "HTML & CSS", tone: "blue" },
  { label: "TypeScript", tone: "yellow" },
  { label: "React", tone: "pink" },
  { label: "Next.js", tone: "slate" },
  { label: "Laravel", tone: "rose" },
  { label: "UI / UX", tone: "purple" },
  { label: "Automation", tone: "green" },
  { label: "AI", tone: "orange" },
] as const;

export const moreSkills = [
  "Redux",
  "Nuxt.js",
  "JavaScript",
  "PHP",
  "MySQL",
  "PostgreSQL",
  "Docker",
  "Go",
  "Git",
] as const;

export const experience = [
  {
    role: "Developer",
    company: "Amial Technology",
    url: "https://amial.my/",
    location: "Malaysia",
    dates: "Feb 2026 — Present",
    points: [
      "Developing web products with the engineering team, across the interface and the backend.",
    ],
  },
  {
    role: "Frontend Developer",
    company: "Trigon Tech Sdn Bhd",
    url: "https://trigontech.my/",
    location: "Selangor, Malaysia",
    dates: "Oct 2024 — Jan 2026",
    points: [
      "Delivered full-stack features with React, TypeScript, and Laravel.",
      "Built responsive interfaces and managed state with Redux.",
      "Developed backend APIs with Laravel controllers, services, and DTOs.",
      "Managed MySQL databases and migrations, and deployed applications with Docker.",
      "Debugged frontend and backend issues in an Agile / Scrum team.",
    ],
  },
  {
    role: "Digital Delivery Intern",
    company: "Ranhill Worley Sdn Bhd",
    url: "",
    location: "Malaysia",
    dates: "Feb 2024 — Aug 2024",
    points: [
      "Optimized digital workflows and supported project delivery with the digital team.",
    ],
  },
] as const;

export const education = {
  degree: "Bachelor of Computer Science (Software Engineering) with Honors",
  school: "Universiti Malaysia Pahang Al-Sultan Abdullah (UMPSA)",
  dates: "2020 — 2024",
  note: "Graduated October 2024",
} as const;

export const skillGroups = [
  {
    label: "Frontend",
    value:
      "HTML, CSS, JavaScript, TypeScript, React, Next.js, Nuxt.js, Redux, UI/UX",
  },
  {
    label: "Backend",
    value: "Laravel, PHP, MySQL, PostgreSQL, Go",
  },
  {
    label: "Practice",
    value: "Docker, Git, Agile / Scrum, workflow automation, AI (learning)",
  },
  {
    label: "Also familiar",
    value: "Flutter, Python, C#",
  },
] as const;

export const mailto = `mailto:${profile.email}?subject=${encodeURIComponent("Hello Yasmin")}`;
