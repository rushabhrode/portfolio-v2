/**
 * Single source of truth.
 *
 * Everything on this site reads from this file: the home page, the static
 * project/paper/blog routes, the sitemap, the JSON-LD, and the generated social
 * cards. Those can therefore never disagree with each other.
 *
 * All facts here are taken from the résumé. Where the previous site disagreed
 * with it, the résumé wins.
 */

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

export type LinkKind = "code" | "live" | "paper" | "doc" | "social";

export interface Link {
  label: string;
  href: string;
  kind: LinkKind;
  /** Marks a link we still need a real URL for; UI renders it disabled. */
  pending?: boolean;
}

export interface Metric {
  label: string;
  value: string;
}

/** Which procedural form represents this project in the 3D world. */
export type CoreKind =
  | "eye"
  | "towers"
  | "review"
  | "lattice"
  | "flow"
  | "pipeline"
  | "monolith";

export interface Project {
  slug: string;
  title: string;
  /** One line, no marketing voice. Shown under the title everywhere. */
  tagline: string;
  year: string;
  role: string;
  featured: boolean;
  /** Rendered full-width above the featured grid. At most one. */
  lead?: boolean;
  core: CoreKind;
  /** Shown verbatim when the work was not started from a blank repository. */
  attribution?: string;
  problem: string;
  approach: string;
  result: string;
  metrics: Metric[];
  stack: string[];
  links: Link[];
}

export interface Paper {
  slug: string;
  title: string;
  venue: string;
  date: string;
  /** ISO date for JSON-LD and <time>. */
  iso: string;
  abstract: string;
  contribution: string;
  keywords: string[];
  links: Link[];
  /** Relative prominence, for ordering. */
  weight: number;
}

export interface Role {
  slug: string;
  org: string;
  title: string;
  period: string;
  location: string;
  summary: string;
  highlights: string[];
  stack: string[];
}

export interface Credential {
  name: string;
  issuer: string;
}

export interface LeadershipEntry {
  title: string;
  org: string;
  detail: string;
  /** Relative prominence, for ordering. */
  scale: number;
}

export interface Post {
  slug: string;
  title: string;
  date: string;
  iso: string;
  summary: string;
  tags: string[];
  body: Block[];
}

export type Block =
  | { t: "p"; text: string }
  | { t: "h"; text: string }
  | { t: "ul"; items: string[] }
  | { t: "quote"; text: string };

// ─────────────────────────────────────────────────────────────────────────────
// Identity
// ─────────────────────────────────────────────────────────────────────────────

export const person = {
  name: "Rushabh Rode",
  shortName: "Rushabh",
  initials: "RR",
  role: "Software Engineer & ML Researcher",
  /** The one sentence. Used in hero, OG images, and JSON-LD description. */
  statement:
    "I build LLM-powered applications, retrieval pipelines, and the backends underneath them. My research on detecting autism from gaze patterns is published at IEEE OTCON-2025.",
  location: "Pune, India",
  availability:
    "B.Tech complete, June 2026. Available immediately for full-stack, backend, and AI engineering roles.",
  email: "rushabhrode@gmail.com",
  phone: "+91 99217 18988",
  url: "https://rushabhrode.me",
  github: "https://github.com/rushabhrode",
  linkedin: "https://linkedin.com/in/rushabhrode",
  ieee: "https://ieeexplore.ieee.org/author/572283329861055",
  resume: "/resume.pdf",
} as const;

export const education = {
  degree: "B.Tech., Computer Engineering",
  institution: "Vishwakarma Institute of Technology, Pune",
  short: "VIT Pune",
  cgpa: "8.69",
  period: "2022 — June 2026",
  coursework: [
    "Data Structures & Algorithms",
    "DBMS",
    "Operating Systems",
    "Computer Networks",
    "OOP",
    "Machine Learning",
  ],
} as const;

// ─────────────────────────────────────────────────────────────────────────────
// Projects — the four on the résumé lead; the rest are real but secondary.
// ─────────────────────────────────────────────────────────────────────────────

export const projects: Project[] = [
  {
    slug: "teams-data-platform",
    title: "Teams Data Platform",
    tagline:
      "A medallion pipeline that answers seven business questions — and refuses to answer where the data can't support one.",
    year: "2026",
    role: "Citi coding workshop — solution engineering",
    // The brief and the repository scaffold came from the workshop organiser.
    // Saying so costs nothing and makes the rest of the claim credible — an
    // interviewer who opens the repo sees both authors immediately, and it is
    // much better that he said it first.
    attribution:
      "Built for Citi's coding workshop, against a provided brief and repository scaffold. The pipeline, serving layer, API and interface are my work — 43 commits.",
    featured: true,
    lead: true,
    core: "pipeline",
    problem:
      "The brief's scenario company, ACME Inc., had team data spread across seven feeds and six systems, and nobody could answer basic questions about how the organisation was actually structured: who is on each team, where teams sit, which leaders are not co-located, which teams run above a 20% non-direct-staff ratio. The naive answers are easy to produce and quietly wrong — 28,595 email addresses map to more than one person, so a plain join inflates 244k memberships to roughly 650k rows while every downstream figure still looks plausible.",
    approach:
      "A Bronze/Silver/Gold pipeline in PySpark. Bronze is a faithful string-typed copy that records the source of every row; Silver types, deduplicates and identity-resolves, asserting that Silver plus quarantine equals Bronze per entity and halting the run when it doesn't; Gold produces 15 business marts mirrored into Aurora PostgreSQL with indexes for serving. An identity bridge collapses each ambiguous email to one party before any fact join, and every row carries its resolution status so a deterministic pick can never be mistaken for a fact. A Lambda-backed read-only API serves the Gold layer to a React interface, and a Jupyter notebook runs the same queries against live cloud data.",
    result:
      "The finding that matters is a negative one. Co-location looked like '20,240 teams are not co-located' until two problems surfaced: one location code maps to two different cities, and 95% of teams contain an ambiguous identity. Only 200 of 25,000 teams can honestly be decided, so the platform publishes both readings — the observed number for continuity, the confirmed one for decisions — instead of picking whichever looked better. Verified by 390 tests with five coverage gates, reconciliation invariants that raise rather than log, and an independent recomputation of every headline figure in pandas by a different route.",
    metrics: [
      { label: "Source rows", value: "703,448 · 7 feeds" },
      { label: "Tests", value: "390 · 5 gates" },
      { label: "Scale", value: "10× rows → 1.9× time" },
    ],
    stack: [
      "PySpark",
      "Aurora PostgreSQL",
      "S3 Parquet",
      "AWS EKS",
      "AWS Lambda",
      "Terraform",
      "React",
      "Jupyter",
    ],
    links: [
      {
        label: "Code",
        href: "https://github.com/rushabhrode/teams-data-platform",
        kind: "code",
      },
    ],
  },
  {
    slug: "autism-eye-tracking",
    title: "Autism Detection via Eye Tracking",
    tagline:
      "A non-invasive screening pipeline that reads gaze behaviour instead of administering a questionnaire.",
    year: "2025",
    role: "Research lead — pipeline, model, evaluation",
    featured: true,
    core: "eye",
    problem:
      "Autism screening depends on structured clinical observation, which is slow, unevenly available, and hard to scale. Gaze carries a well-documented behavioural signal — children on the spectrum distribute attention differently across faces and scenes — but reading that signal normally requires a specialist.",
    approach:
      "A two-stage pipeline. ResNet18 handles deep feature extraction from eye-tracking frames, learning representations of gaze patterns and fixation duration as behavioural biomarkers. A Random Forest then classifies on those features. Splitting the work this way keeps the classifier small and inspectable — the deep network does perception, and a model you can actually interrogate does the decision.",
    result:
      "95% classification accuracy across all test cases, validated on precision, recall, and F1 rather than accuracy alone, because a screening tool's false-negative cost is not symmetric with its false-positive cost. Published at IEEE OTCON-2025 as a reproducible, non-invasive screening approach.",
    metrics: [
      { label: "Accuracy", value: "95%" },
      { label: "Published", value: "IEEE OTCON-2025" },
      { label: "Pipeline", value: "ResNet18 → Random Forest" },
    ],
    stack: ["Python", "TensorFlow", "ResNet18", "Random Forest", "scikit-learn"],
    links: [
      { label: "IEEE author profile", href: person.ieee, kind: "paper" },
    ],
  },
  {
    slug: "code-review-assistant",
    title: "Code Review Assistant",
    tagline:
      "An LLM agent that reviews pull requests and returns structured, actionable feedback.",
    year: "2025",
    role: "Solo — prompt design, backend, deployment",
    featured: true,
    core: "review",
    problem:
      "Review bots get muted within a week. The hard constraint is not finding issues — a language model will find you an unlimited supply — it is returning few enough, and specific enough, that people keep reading them.",
    approach:
      "The agent analyses pull requests and code snippets through the Google Gemini API, with prompts constrained to emit structured JSON rather than prose, so every finding carries a location and a category that the client can filter on. The backend is Node.js, Express, and TypeScript, built along clean REST and service-layer lines, with request rate-limiting at the edge and Supabase for persistence.",
    result:
      "A live, publicly usable tool that I own end to end — prompt design, API integration, backend architecture, and deployment. Structured output is what makes it useful: findings can be ranked and suppressed rather than dumped into a thread.",
    metrics: [
      { label: "Output", value: "Structured JSON" },
      { label: "Status", value: "Deployed live" },
      { label: "Model", value: "Google Gemini" },
    ],
    stack: [
      "TypeScript",
      "Node.js",
      "Express",
      "Google Gemini API",
      "Supabase",
      "REST",
    ],
    links: [
      {
        label: "Code",
        href: "https://github.com/rushabhrode/code-review-assistant",
        kind: "code",
      },
    ],
  },
  {
    slug: "two-tower-rag",
    title: "Two-Tower RAG Pipeline",
    tagline:
      "Neural retrieval that encodes queries and documents independently, so search cost stops scaling with the corpus.",
    year: "2025",
    role: "Solo — retrieval architecture, RAG pipeline",
    featured: true,
    core: "towers",
    problem:
      "A cross-encoder scores a query against a document by pushing both through one model together. It is accurate and completely impractical at scale: every query re-encodes the entire corpus, so cost grows with the number of documents you own.",
    approach:
      "A two-tower architecture encodes queries and documents through separate towers into a shared embedding space. Document embeddings are computed once, offline, and indexed; at query time only the query is encoded, and retrieval becomes a vector similarity search. Around that sits the full RAG pipeline — embedding generation, similarity search, and context injection — so retrieved passages ground the language model's response instead of it inventing one.",
    result:
      "Retrieval latency decouples from corpus size, and the index can be rebuilt without touching the serving path. The pipeline is the working set of primitives behind most production LLM applications: embeddings, a vector store, and retrieval orchestration.",
    metrics: [
      { label: "Architecture", value: "Two-tower" },
      { label: "Query cost", value: "One encode" },
      { label: "Grounding", value: "Retrieved context" },
    ],
    stack: ["Python", "Embeddings", "Vector search", "RAG", "PyTorch"],
    links: [
      {
        label: "Code",
        href: "https://github.com/rushabhrode/twotowerRAG",
        kind: "code",
      },
    ],
  },
  {
    slug: "library-system",
    title: "Library Management System",
    tagline:
      "Ten-plus REST APIs modelled on real lending workflows, with authorisation enforced where it belongs.",
    year: "2024",
    role: "Full-stack — API design, auth, containerisation",
    featured: true,
    core: "lattice",
    problem:
      "Most library projects are a CRUD form over a table. The interesting part is never the CRUD — it is the things that make a system safe to run: who is allowed to do what, how that is proven on every request, and whether the whole stack comes up the same way twice.",
    approach:
      "Designed and documented 10+ REST APIs in Spring Boot over MongoDB, modelled around actual business workflows — book search, availability check, borrow, return, and overdue alerts — rather than around database tables. Security is JWT-based authentication with role-based access control enforced at the API layer, not hidden in the client. The entire stack is containerised with Docker so local and production deployments are structurally identical.",
    result:
      "An authorisation model that is explicit and testable, and an environment a new contributor gets from one command instead of a setup document.",
    metrics: [
      { label: "APIs", value: "10+ REST endpoints" },
      { label: "Auth", value: "JWT + RBAC" },
      { label: "Deploy", value: "Dockerised" },
    ],
    stack: ["Java", "Spring Boot", "React", "MongoDB", "Docker", "JWT"],
    links: [
      {
        label: "Code",
        href: "https://github.com/rushabhrode/library-system",
        kind: "code",
      },
    ],
  },
  {
    slug: "traffic-monitoring",
    title: "Traffic Monitoring Dashboard",
    tagline: "Real-time congestion detection rendered on a live map.",
    year: "2025",
    role: "Full-stack — ingestion, detection, dashboard",
    featured: false,
    core: "flow",
    problem:
      "Traffic data is usually reviewed after the fact, which is the least useful moment to have it. The operational question is which junction is degrading right now, and whether it is spreading.",
    approach:
      "A Node.js service ingests vehicle telemetry and normalises it into per-junction flow measurements. Congestion is detected against a rolling baseline rather than a fixed threshold, so a quiet side street and an arterial are each judged on their own traffic. The dashboard renders live state on a map layer, colouring junctions as they degrade.",
    result:
      "Operators watch congestion form rather than reading about it later, and the rolling baseline avoids the constant false alarms a fixed threshold produces on low-volume roads.",
    metrics: [
      { label: "Latency", value: "Real-time" },
      { label: "Detection", value: "Rolling baseline" },
    ],
    stack: ["Node.js", "JavaScript", "Map rendering", "WebSockets"],
    links: [
      {
        label: "Code",
        href: "https://github.com/rushabhrode/traffic-monitoring-dashboard",
        kind: "code",
      },
    ],
  },
  {
    slug: "cold-email-generator",
    title: "Cold Email & Cover Letter Generator",
    tagline: "Job post in, grounded outreach out — without the generic voice.",
    year: "2025",
    role: "Solo",
    featured: false,
    core: "monolith",
    problem:
      "Generated cover letters read like generated cover letters, and the failure is structural. Without grounding in the specific posting and the specific candidate, a model defaults to the mean of everything it has read.",
    approach:
      "The tool extracts concrete requirements from a posting, matches them against structured candidate history, and constrains generation to reference only matched evidence — so every claim in the output traces back to something real.",
    result:
      "Output that names specific requirements and the specific work that meets them, instead of asserting enthusiasm.",
    metrics: [{ label: "Grounding", value: "Evidence-constrained" }],
    stack: ["TypeScript", "Next.js", "LLM API"],
    links: [
      {
        label: "Code",
        href: "https://github.com/rushabhrode/cold-email-cover-letter-generator",
        kind: "code",
      },
    ],
  },
];

export const featuredProjects = projects.filter((p) => p.featured);

// ─────────────────────────────────────────────────────────────────────────────
// Publications
// ─────────────────────────────────────────────────────────────────────────────

export const papers: Paper[] = [
  {
    slug: "autism-detection-otcon-2025",
    title: "Autism Detection via Eye Tracking",
    venue: "IEEE OTCON-2025",
    date: "2025",
    iso: "2025-01-01",
    abstract:
      "A non-invasive machine-learning approach to autism spectrum screening that classifies subjects from eye-tracking data, using gaze patterns and fixation duration as behavioural biomarkers rather than clinician-administered instruments.",
    contribution:
      "Built the two-stage pipeline — ResNet18 for deep feature extraction from eye-tracking frames, followed by Random Forest classification — and ran the evaluation across precision, recall, and F1 to establish clinical reliability rather than reporting accuracy alone.",
    keywords: [
      "Eye tracking",
      "Autism screening",
      "ResNet18",
      "Random Forest",
      "Behavioural biomarkers",
    ],
    links: [{ label: "IEEE author profile", href: person.ieee, kind: "paper" }],
    weight: 1,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Experience
// ─────────────────────────────────────────────────────────────────────────────

export const roles: Role[] = [
  {
    slug: "prime-global-workforce",
    org: "Prime Global Workforce",
    title: "Software Development Intern",
    period: "Aug — Nov 2025",
    location: "Gurgaon, India",
    summary:
      "Architected and shipped the company's public-facing website end to end, from component architecture through to production performance.",
    highlights: [
      "Architected and deployed the public site in React.js and Next.js, reaching 500+ monthly visitors within weeks of launch.",
      "Cut front-end development time by 30% by building a library of 15+ reusable, responsive UI components instead of per-page markup.",
      "Implemented Next.js SSR and dynamic routing for sub-2-second page loads, directly improving search indexability and retention.",
      "Worked with stakeholders to translate product goals into scalable web architecture, delivering every milestone on schedule.",
    ],
    stack: ["React.js", "Next.js", "SSR", "TypeScript"],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Credentials & leadership
// ─────────────────────────────────────────────────────────────────────────────

export const credentials: Credential[] = [
  { name: "AWS Certified Solutions Architect", issuer: "Amazon Web Services" },
  { name: "Full Stack Developer Master Program", issuer: "IBM" },
  { name: "Microsoft Power BI", issuer: "LinkedIn Learning" },
  { name: "Database Management Systems", issuer: "NPTEL" },
];

export const leadership: LeadershipEntry[] = [
  {
    title: "Secretary",
    org: "SWDC, VIT Pune",
    detail:
      "Led 200+ volunteers and 30+ coordinators across flagship social campaigns and campus events.",
    scale: 1,
  },
  {
    title: "Corporal",
    org: "National Cadet Corps",
    detail:
      "Completed national-level endurance camps, demonstrating leadership and discipline under pressure.",
    scale: 0.7,
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Skills
// ─────────────────────────────────────────────────────────────────────────────

export const skills: { group: string; items: string[] }[] = [
  {
    group: "AI / LLM",
    items: [
      "RAG pipelines",
      "Two-tower retrieval",
      "Prompt engineering",
      "LLM orchestration",
      "Google Gemini API",
      "Embeddings",
      "Vector search",
      "TensorFlow",
      "PyTorch",
      "scikit-learn",
    ],
  },
  {
    group: "Languages",
    items: ["Python", "Java", "TypeScript", "JavaScript", "SQL", "C", "C++"],
  },
  {
    group: "Backend",
    items: [
      "REST APIs",
      "Node.js",
      "Express.js",
      "Spring Boot",
      "Django",
      "Microservices",
      "JWT auth",
    ],
  },
  {
    group: "Databases",
    items: ["MongoDB", "MySQL", "PostgreSQL", "Supabase", "Vector databases"],
  },
  { group: "Cloud & DevOps", items: ["AWS EC2", "AWS S3", "Docker", "Git"] },
  { group: "Frontend", items: ["React", "Next.js", "Tailwind CSS"] },
];

// ─────────────────────────────────────────────────────────────────────────────
// Writing
// ─────────────────────────────────────────────────────────────────────────────

export const posts: Post[] = [
  {
    slug: "building-production-web-apps",
    title: "How I Approach Building Production Web Apps",
    date: "Jun 25, 2026",
    iso: "2026-06-25",
    summary:
      "A practical workflow for moving from idea to shipped product: requirements, data flow, UI structure, testing, and deployment.",
    tags: ["Web Development", "Next.js", "Production"],
    body: [
      {
        t: "p",
        text: "Most projects do not fail at the code. They fail earlier, at the point where nobody wrote down what the thing is supposed to do, and later, at the point where nobody could deploy it twice the same way.",
      },
      { t: "h", text: "Start from the data, not the screen" },
      {
        t: "p",
        text: "The first artefact I write is not a component. It is the shape of the data — what entities exist, what owns what, and which direction information flows. Screens are a projection of that. If you design the screen first you end up with a data model shaped by layout accidents, and every new feature fights it.",
      },
      { t: "h", text: "Decide what is allowed to be slow" },
      {
        t: "p",
        text: "Not everything needs to be fast. Some things need to be fast, and everything else needs to be correct. Naming which is which early stops you from optimising a nightly job while a hot path does three round trips.",
      },
      { t: "h", text: "Make deployment boring before you need it" },
      {
        t: "ul",
        items: [
          "One command should bring the whole stack up locally.",
          "The production path should differ from local in configuration only, never in structure.",
          "If a deploy requires a human to remember a step, that step is a future outage.",
        ],
      },
      {
        t: "quote",
        text: "A system you cannot rebuild from scratch is a system you do not fully understand yet.",
      },
    ],
  },
  {
    slug: "building-reliable-full-stack-systems",
    title: "Building Reliable Full-Stack Systems",
    date: "Jun 20, 2026",
    iso: "2026-06-20",
    summary:
      "Notes on designing web products that stay maintainable as features, users, and deployment complexity grow.",
    tags: ["Full Stack", "Architecture", "Next.js"],
    body: [
      {
        t: "p",
        text: "Reliability is usually discussed as an operations problem. In practice most of it is decided at design time, in choices that look like style preferences and are not.",
      },
      { t: "h", text: "Put the boundary where the trust changes" },
      {
        t: "p",
        text: "Authorisation belongs at the layer that owns the data, not at the layer that renders it. A UI that hides a button is a courtesy. An API that rejects the request is a boundary. Confusing the two is how a student project becomes an incident.",
      },
      { t: "h", text: "Prefer explicit state over inferred state" },
      {
        t: "p",
        text: "Deriving state is elegant until two derivations disagree. When something matters — an order status, a session, a job's progress — store it, name it, and make its transitions explicit.",
      },
      { t: "h", text: "Design for the second engineer" },
      {
        t: "ul",
        items: [
          "Code is read far more often than it is written, and usually by someone with less context than you have right now.",
          "A boring, obvious implementation beats a clever one that needs a paragraph of explanation.",
          "If a decision was non-obvious, the reason belongs in the repository, not in your memory.",
        ],
      },
    ],
  },
  {
    slug: "lessons-from-applied-ml-projects",
    title: "Lessons from Applied ML Projects",
    date: "May 28, 2026",
    iso: "2026-05-28",
    summary:
      "A practical look at turning model experiments into usable pipelines with clear metrics and failure cases.",
    tags: ["Machine Learning", "Research", "Python"],
    body: [
      {
        t: "p",
        text: "The distance between a notebook reporting 95% and a system somebody can use is mostly unglamorous work, and it is where the actual engineering lives.",
      },
      { t: "h", text: "The metric is a claim, so say what it is a claim about" },
      {
        t: "p",
        text: "An accuracy number without a described evaluation set is decoration. What was held out, how was it split, and does the split leak? On eye-tracking data, splitting by frame rather than by participant will quietly inflate every number you report, because the model learns the person instead of the condition.",
      },
      { t: "h", text: "Split perception from decision" },
      {
        t: "p",
        text: "In the autism-screening work, ResNet18 does the perception and a Random Forest makes the call. A single end-to-end network might have matched the accuracy, but nobody could have looked at its output and said why. Keeping the decision stage small buys you an explanation, and in a clinical context the explanation is the point.",
      },
      { t: "h", text: "Know your failure cases by name" },
      {
        t: "ul",
        items: [
          "Which inputs does this get confidently wrong?",
          "What happens when a recording is short, noisy, or truncated?",
          "What is the cost asymmetry — is a false negative worse than a false positive here?",
        ],
      },
      {
        t: "quote",
        text: "A model whose failures you cannot describe is not finished, regardless of its accuracy.",
      },
    ],
  },
  {
    slug: "good-developer-portfolio",
    title: "What Makes a Good Developer Portfolio",
    date: "May 10, 2026",
    iso: "2026-05-10",
    summary:
      "How to present projects, engineering decisions, and proof of work without overloading the page.",
    tags: ["Portfolio", "Career", "Design"],
    body: [
      {
        t: "p",
        text: "A portfolio has roughly ninety seconds of a reader's attention, and it is competing with a tab full of other candidates. Everything else follows from that constraint.",
      },
      { t: "h", text: "Show the decision, not the feature list" },
      {
        t: "p",
        text: "A list of technologies tells a reader what you have touched. A paragraph explaining why you split a model into a feature extractor and a separate classifier tells them how you think. Only one of those is hard to fake.",
      },
      { t: "h", text: "Proof beats assertion" },
      {
        t: "ul",
        items: [
          "A link to running code is worth more than any adjective.",
          "A number is worth more than a claim, provided you say what it measures.",
          "Published or reviewed work is worth more than either, because someone else checked it.",
        ],
      },
      { t: "h", text: "Be findable" },
      {
        t: "p",
        text: "Whatever else your site does, a reader must be able to reach your résumé, your code, and your contact details in one click each. Any design that makes those harder to find has made the site worse, however it looks.",
      },
    ],
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Navigation helpers
// ─────────────────────────────────────────────────────────────────────────────

export const socials: Link[] = [
  { label: "GitHub", href: person.github, kind: "social" },
  { label: "LinkedIn", href: person.linkedin, kind: "social" },
  { label: "IEEE", href: person.ieee, kind: "social" },
  { label: "Résumé", href: person.resume, kind: "doc" },
];

export const getProject = (slug: string) => projects.find((p) => p.slug === slug);
export const getPaper = (slug: string) => papers.find((p) => p.slug === slug);
export const getPost = (slug: string) => posts.find((p) => p.slug === slug);

/** The one project rendered full-width above the grid, if any. */
export const leadProject = projects.find((p) => p.lead);
/** Featured projects excluding the lead, so the grid stays even. */
export const gridProjects = projects.filter((p) => p.featured && !p.lead);
