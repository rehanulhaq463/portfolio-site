// Verified project inventory. Every project below is documented in the resume
// (or, for the RAAST switch and ISO 20022 simulator, described by Rehan as recent
// Vaulsys work). No client names beyond those already on the public resume,
// no endpoints, and no source code.

export type Employer = "Vaulsys" | "Avanza Solutions" | "Paysys Labs";

export interface Project {
  title: string;
  employer: Employer;
  period: string;
  category: string;
  description: string;
  tags: string[];
  featured?: boolean; // spans two columns on wide screens
}

export const projects: Project[] = [
  // ---- Vaulsys ----
  {
    title: "RAAST Payment Switch",
    featured: true,
    employer: "Vaulsys",
    period: "2026, client project",
    category: "Payment Systems",
    description:
      "Developed a payment switch for a client institution that communicates with the State Bank of Pakistan's RAAST system and supports P2P and P2M payment flows, including Request-to-Pay. It builds, signs, and processes ISO 20022 messages and tracks each transaction to its final status.",
    tags: ["RAAST", "ISO 20022", "P2P & P2M", "XAdES signatures", "Oracle"],
  },
  {
    title: "RAW Bank Agent Portal & Middleware",
    employer: "Vaulsys",
    period: "Feb 2026 – present",
    category: "Digital Banking",
    description:
      "Lead the team building the backend and middleware for the Agent Portal of RAW Bank's digital banking platform. Secure REST APIs and microservices handle high-volume financial transactions, authentication, authorization, and core banking workflows.",
    tags: ["Java", "Spring Boot", "REST APIs", "Microservices", "Middleware"],
  },

  {
    title: "Configurable ISO 20022 Simulator",
    featured: true,
    employer: "Vaulsys",
    period: "2026",
    category: "ISO 20022",
    description:
      "Built a configurable simulator for ISO 20022 message flows, where message templates, field validation rules, and field mappings are configured rather than hardcoded. It provides reusable simulation workflows for testing financial integrations.",
    tags: ["ISO 20022", "XML", "Field validation", "Configuration-driven design"],
  },
  // ---- Avanza Solutions ----
  {
    title: "Meezan Bank Enterprise CRM",
    employer: "Avanza Solutions",
    period: "Nov 2025 – Jan 2026",
    category: "Banking",
    description:
      "Developed, enhanced, and supported an enterprise-grade CRM for Meezan Bank, one of Avanza's largest clients. Led new features, third-party and banking service integrations, and production fixes, built on scalable Java and Spring Boot services.",
    tags: ["Java", "Spring Boot", "CRM", "Banking integrations"],
  },

  // ---- Paysys Labs ----
  {
    title: "RAAST P2M",
    employer: "Paysys Labs",
    period: "Jul 2025 – Oct 2025",
    category: "Payment Systems",
    description:
      "Worked on RAAST P2M (Person-to-Merchant), Pakistan's real-time payment infrastructure, enabling merchant transactions and improving payment efficiency. Integrated the P2M services into the platform.",
    tags: ["RAAST", "Person-to-Merchant", "Real-time payments", "Service integration"],
  },
  {
    title: "P2P & Instant Transfer Services",
    employer: "Paysys Labs",
    period: "Jul 2025 – Oct 2025",
    category: "Payment Systems",
    description:
      "Played a key role in designing person-to-person (P2P) and instant transfer services. The design applied ISO financial messaging standards.",
    tags: ["P2P transfers", "Instant payments", "ISO messaging", "Service design"],
  },
  {
    title: "Transaction Push Notifications",
    employer: "Paysys Labs",
    period: "Jul 2025 – Oct 2025",
    category: "Customer Communication",
    description:
      "Implemented and optimized a push notification system so customers are told promptly about critical transactions and alerts.",
    tags: ["Push notifications", "Transaction alerts", "Optimization"],
  },
  {
    title: "Digital Banking Services",
    employer: "Paysys Labs",
    period: "Jul 2025 – Oct 2025",
    category: "Digital Banking",
    description:
      "Developed digital banking solutions that improved customer access to banking services, with attention to the user experience.",
    tags: ["Digital banking", "Backend services"],
  },
  {
    title: "PAYVAY Digital Wallet (PSO)",
    employer: "Paysys Labs",
    period: "Jun 2023 – Jun 2025",
    category: "Digital Wallet",
    description:
      "Developed core modules of the PAYVAY digital wallet for PSO: customer onboarding, NADRA biometric verification, payment processing, and bill payments. Built REST APIs with Java, Spring Boot, and JPA and deployed microservices with Docker.",
    tags: ["Java", "Spring Boot", "JPA", "NADRA biometrics", "Docker"],
  },
  {
    title: "Middleware & Application Services",
    employer: "Paysys Labs",
    period: "Jun 2023 – Jun 2025",
    category: "Middleware",
    description:
      "Extended the functionality of existing middleware services and built new application services as project requirements evolved, delivered in Agile sprints.",
    tags: ["Middleware", "Java", "Spring Boot", "Microservices"],
  },
];

export const employers: Employer[] = ["Vaulsys", "Avanza Solutions", "Paysys Labs"];

export const confidentialityNote =
  "Client work is described without client-confidential details, endpoints, or source code.";
