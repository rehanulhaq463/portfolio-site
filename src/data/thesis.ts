// MS thesis — derived from the final thesis report. Website only; not on the resume.

export const thesis = {
  title: "Automated Code Review Using LLMs (with Human-in-the-loop)",
  meta: "MS Software Engineering, FAST-NUCES, 2025",
  supervisor: "Syeda Rubab Jaffar",
  description:
    "A hybrid code review framework for GitHub pull requests: a rule-based engine flags predictable issues such as debug statements, missing tests, and oversized changes, and an LLM (llama-3.1-8b-instant via the Groq API) adds contextual, natural-language review comments. Human reviewers accept, reject, or edit each suggestion, and their decisions are stored as a dataset for future fine-tuning.",
  topics: ["Large language models", "Static analysis", "Human-in-the-loop", "Prompt engineering", "Groq API"],
};
