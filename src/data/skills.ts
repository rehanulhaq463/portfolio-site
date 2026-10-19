// Skills grouped by category, all taken from the resume (plus the three
// requested additions). No proficiency scores by design.

export const skillGroups: { name: string; items: string[] }[] = [
  {
    name: "Programming Languages",
    items: ["Java", "SQL"],
  },
  {
    name: "Backend Development",
    items: ["Spring Boot", "Spring Security", "Spring Cloud Gateway", "JPA", "Hibernate", "REST APIs", "Microservices"],
  },
  {
    name: "Software Architecture & Design Patterns",
    items: [
      "Service Architecture Design",
      "Command Registry Pattern",
      "Service Optimization",
      "Microservices Architecture",
      "Distributed Systems",
      "API Design",
      "Design Patterns",
      "SOLID Principles",
      "Scalability",
      "High Availability",
    ],
  },
  {
    name: "Banking & Payment Systems",
    items: ["RAAST P2P & P2M", "Payment Switches", "Core Banking Integration", "Digital Wallets", "NADRA Biometric Verification"],
  },
  {
    name: "Integration & Messaging Standards",
    items: ["ISO 20022", "ISO 8583", "RabbitMQ", "REST", "XML Digital Signatures (XAdES)", "JWT", "OAuth2"],
  },
  {
    name: "Databases",
    items: ["Oracle", "MySQL", "PostgreSQL", "Redis"],
  },
  {
    name: "Development Tools",
    items: ["Git", "Maven", "Docker", "Jenkins", "GitHub Actions", "JUnit", "Mockito", "Swagger", "Postman", "JIRA"],
  },
];
