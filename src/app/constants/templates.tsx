export const templates = [
  {
    id: "blank",
    name: "Blank Document",
    image: "/blank-document.svg",
    initialContent: "<div><p></p></div>",
  },
  {
    id: "Business Letter",
    name: "Business Letter",
    image: "/business-letter.svg",
    initialContent:
      `<div><p>[Your Company Name]</p><p>[Street Address]</p><p>[City, State ZIP]</p><p>[Date]</p><br/><p>[Recipient Name]</p><p>[Company Name]</p><p>[Street Address]</p><p>[City, State ZIP]</p><br/><p>Dear [Recipient Name],</p><br/><p>Subject: [Business Letter Subject]</p><br/><p>[Your content here]</p><br/><p>Sincerely,</p><p>[Your Name]</p><p>[Your Title]</p></div>`,
  },
  {
    id: "Cover Letter",
    name: "Cover Letter",
    image: "/cover-letter.svg",
    initialContent:
      "<div><p>[Your Name]</p><p>[Your Address]</p><p>[City, State ZIP]</p><p>[Date]</p><br/><p>[Hiring Manager's Name]</p><p>[Company Name]</p><p>[Company Address]</p><p>[City, State ZIP]</p><br/><p>Dear [Hiring Manager's Name],</p><br/><p>I am writing to express my interest in the [Position] role at [Company Name].</p><br/><p>[Your content here]</p><br/><p>Sincerely,</p><p>[Your Name]</p></div>",
  },
  {
    id: "Letter",
    name: "Letter",
    image: "/letter.svg",
    initialContent:
      "<div><p>[Your Name]</p><p>[Your Address]</p><p>[City, State ZIP]</p><p>[Date]</p><br/><p>[Recipient Name]</p><p>[Recipient Address]</p><p>[City, State ZIP]</p><br/><p>Dear [Recipient Name],</p><br/><p>[Your content here]</p><br/><p>Best regards,</p><p>[Your Name]</p></div>",
  },
  {
    id: "Project Proposal",
    name: "Project Proposal",
    image: "/project-proposal.svg",
    initialContent:
      "<div><h1>Project Proposal</h1><br/><h2>Executive Summary</h2><p>[Brief overview of the project]</p><br/><h2>Project Objectives</h2><p>[List main objectives]</p><br/><h2>Scope of Work</h2><p>[Detail project scope]</p><br/><h2>Timeline</h2><p>[Project timeline]</p><br/><h2>Budget</h2><p>[Budget details]</p><br/><h2>Team</h2><p>[Team members and roles]</p></div>",
  },
  {
    id: "Resume",
    name: "Resume",
    image: "/resume.svg",
    initialContent:
      "<div><h1>[Your Name]</h1><p>[Phone] | [Email] | [Location]</p><br/><h2>Professional Summary</h2><p>[Your professional summary]</p><br/><h2>Experience</h2><p>[Company Name] - [Job Title]</p><p>[Date Range]</p><ul><li>[Achievement 1]</li><li>[Achievement 2]</li></ul><br/><h2>Education</h2><p>[Degree] - [Institution]</p><br/><h2>Skills</h2><ul><li>[Skill 1]</li><li>[Skill 2]</li></ul></div>",
  },
  {
    id: "Software Project Proposal",
    name: "Software Project Proposal",
    image: "/software-proposal.svg",
    initialContent:
      "<div><h1>Software Project Proposal</h1><br/><h2>Project Overview</h2><p>[Brief description of the software project]</p><br/><h2>Technical Requirements</h2><ul><li>[Requirement 1]</li><li>[Requirement 2]</li></ul><br/><h2>Technology Stack</h2><p>[List of technologies]</p><br/><h2>Development Phases</h2><p>[Phase breakdown]</p><br/><h2>Timeline & Milestones</h2><p>[Project timeline]</p><br/><h2>Budget</h2><p>[Cost breakdown]</p><br/><h2>Team & Resources</h2><p>[Team composition]</p></div>",
  },
];
