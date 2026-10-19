// Personal details. Edit here — every section reads from this file.
// Everything below is taken from the resume; do not add unverified links.

export const profile = {
  name: "Muhammad Rehan Ul Haq",
  title: "Senior Software Engineer | Fintech & Payment Systems",
  location: "Karachi, Pakistan",
  email: "rehanulhaq463@gmail.com",
  linkedin: "https://www.linkedin.com/in/rehan-ul-haq",
  linkedinLabel: "linkedin.com/in/rehan-ul-haq",
  resumePdf: "/resume/Muhammad_Rehan_Ul_Haq_Resume.pdf",

  photo: {
    webp: { small: "/images/rehan-portrait-480.webp", large: "/images/rehan-portrait-800.webp" },
    jpg: { small: "/images/rehan-portrait-480.jpg", large: "/images/rehan-portrait-800.jpg" },
    width: 480,
    height: 600,
    alt: "Portrait of Muhammad Rehan Ul Haq in a dark suit and light grey tie",
  },

  seoDescription:
    "Muhammad Rehan Ul Haq, Senior Software Engineer in Karachi specializing in the design and development of fintech products: an SBP-connected RAAST payment switch, ISO 20022 messaging, and digital banking platforms in Java and Spring Boot.",

  // Hero: two or three sentences.
  intro:
    "I specialize in designing and developing fintech products, from payment systems and banking integrations to the backend services behind them. Throughout my career in fintech I've built RAAST instant payments, ISO 20022 messaging, digital wallets, and digital banking platforms in Java and Spring Boot, with a focus on clear, maintainable service architecture.",

  // About: two short paragraphs, no repetition of the hero.
  about: [
    "My path into payments ran through the PAYVAY digital wallet and RAAST P2M at Paysys Labs, then enterprise CRM for Meezan Bank at Avanza Solutions. At Vaulsys I lead the Agent Portal team for RAW Bank's digital banking platform, and I built an SBP-connected RAAST payment switch and a configurable ISO 20022 simulator.",
    "I design services around clear boundaries, configuration instead of hardcoding, and validation at the edges, and I put time into service optimization and code another engineer can change safely.",
  ],
} as const;

export const facts = [
  { label: "Based in", value: "Karachi, Pakistan" },
  { label: "Specialization", value: "Fintech product design & development" },
  { label: "Current role", value: "Senior Software Engineer, Vaulsys" },
  { label: "Education", value: "MS Software Engineering, FAST-NUCES" },
  { label: "Open to", value: "Remote backend & fintech roles" },
] as const;

export const nav = [
  { href: "#top", label: "Home" },
  { href: "#about", label: "About" },
  { href: "#experience", label: "Experience" },
  { href: "#projects", label: "Projects" },
  { href: "#skills", label: "Skills" },
  { href: "#thesis", label: "Thesis" },
  { href: "#contact", label: "Contact" },
] as const;
