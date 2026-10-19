// Employment history — employers, titles and dates exactly as on the resume.

export interface Job {
  role: string;
  company: string;
  dates: string;
  current?: boolean;
  points: string[];
}

export const experience: Job[] = [
  {
    role: "Senior Software Engineer",
    company: "Vaulsys",
    dates: "Feb 2026 – Present",
    current: true,
    points: [
      "Lead the Agent Portal team for RAW Bank, building the portal's backend and middleware: secure REST APIs and microservices for high-volume transactions and core banking workflows.",
      "Developed a RAAST payment switch for a client that communicates with the State Bank of Pakistan, implementing P2P and P2M flows with ISO 20022 messaging.",
      "Built a configurable ISO 20022 simulator with template-based messages, field validation rules, and configurable message flows for integration testing.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Avanza Solutions",
    dates: "Nov 2025 – Jan 2026",
    points: [
      "Developed and supported enterprise CRM for Meezan Bank, including new features and third-party and banking service integrations.",
      "Worked with cross-functional teams and client stakeholders to turn business requirements into technical solutions.",
      "Conducted code reviews, contributed to architecture discussions, and mentored junior developers.",
    ],
  },
  {
    role: "Senior Software Engineer",
    company: "Paysys Labs Pvt Ltd",
    dates: "Jul 2025 – Oct 2025",
    points: [
      "Worked on RAAST P2M, Pakistan's real-time person-to-merchant payment infrastructure, and played a key role in designing P2P and instant transfer services.",
      "Implemented and optimized push notifications for critical transactions and alerts, and developed digital banking solutions.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Paysys Labs Pvt Ltd",
    dates: "Jun 2023 – Jun 2025",
    points: [
      "Developed core modules of the PAYVAY Digital Wallet (PSO): onboarding, NADRA biometric verification, payments, and bill payments.",
      "Enhanced existing middleware services and built new application services as project needs evolved.",
      "Built REST APIs and microservices with Java, Spring Boot, JPA, and Docker in Agile sprints, focused on performance and scalability.",
    ],
  },
  {
    role: "Software Engineer",
    company: "Irenic Tech | Freelance Java Developer",
    dates: "Feb 2022 – May 2023",
    points: [
      "Built scalable REST APIs with Java, Spring Boot, and JPA for high-traffic fintech applications.",
      "Integrated OneSignal push notifications and deployed microservices with Git, Maven, and Docker.",
    ],
  },
];
