export const sampleData = {
  personal: {
    name: "Alex Carter",
    title: "Senior Full Stack Engineer",
    email: "alex.carter@email.com",
    phone: "+1 (555) 019-2834",
    location: "San Francisco, CA",
    linkedin: "linkedin.com/in/alexcarter",
    website: "alexcarter.dev"
  },
  summary: "Results-oriented Senior Full Stack Engineer with over 6 years of experience building secure, high-throughput cloud architectures. Specialized in React, Node.js, and AWS deployments, with a track record of driving system performance gains and optimizing data flows.",
  workHistory: [
    {
      company: "CloudScale Systems",
      role: "Lead Software Architect",
      dates: "Jan 2023 - Present",
      location: "San Francisco, CA",
      bullets: [
        "Led a team of 5 engineers to migrate legacy monolith service to a distributed NestJS microservice system.",
        "Optimized AWS DynamoDB index query times, reducing application endpoint latencies by 35% on average.",
        "Implemented automated CI/CD pipeline structures with GitHub Actions, reducing deployment errors by 40%."
      ]
    },
    {
      company: "DataSync Technologies",
      role: "Senior Software Engineer",
      dates: "Mar 2020 - Dec 2022",
      location: "Austin, TX",
      bullets: [
        "Developed custom real-time messaging pipeline utilizing WebSockets, supporting 15,000+ concurrent connections.",
        "Engineered dashboard interfaces using React and TailwindCSS, improving page speed scores by 20%.",
        "Automated database archival scripts in Python, saving the company $12,000 in monthly database storage costs."
      ]
    }
  ],
  education: [
    {
      school: "University of California, Berkeley",
      degree: "B.S. in Computer Science & Engineering",
      dates: "2016 - 2020",
      details: "Graduated Magna Cum Laude, GPA 3.82/4.00"
    }
  ],
  projects: [
    {
      title: "QueryFlow - Live DB Analyzer",
      tech: "React, Express, PostgreSQL",
      bullets: [
        "Designed visual query performance analyzer mapping SQL query bottlenecks, receiving 1,500+ stars on GitHub.",
        "Created custom AST-based parser that validates SQL syntax queries locally, avoiding slow remote calls."
      ]
    }
  ],
  skills: [
    "React", "Node.js", "TypeScript", "JavaScript", "Python", "GraphQL", 
    "AWS", "Docker", "Kubernetes", "PostgreSQL", "MongoDB", "Git", "CI/CD"
  ]
};
