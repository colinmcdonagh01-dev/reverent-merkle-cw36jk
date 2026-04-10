import { useState, useMemo, useEffect } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  AreaChart,
  Area,
} from "recharts";

const C = {
  bk: "#000000",
  wh: "#FFFFFF",
  ac: "#CCFF00",
  cb: "#111111",
  g1: "#F5F5F5",
  g2: "#E0E0E0",
  g4: "#888888",
  g6: "#444444",
  g8: "#1A1A1A",
};
const T = { d: '"Bebas Neue", sans-serif', b: '"DM Sans", sans-serif' };

const ds = (d) => d.toISOString().split("T")[0];
const ago = (n) => {
  const d = new Date();
  d.setDate(d.getDate() - n);
  return ds(d);
};
const fwd = (n) => {
  const d = new Date();
  d.setDate(d.getDate() + n);
  return ds(d);
};
const uid = () => Math.random().toString(36).slice(2) + Date.now().toString(36);
const fmt = {
  cur: (n, c = "GBP") =>
    new Intl.NumberFormat("en-GB", {
      style: "currency",
      currency: c === "EUR" ? "EUR" : "GBP",
      maximumFractionDigits: 0,
    }).format(n || 0),
  dt: (s) =>
    s
      ? new Date(s).toLocaleDateString("en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        })
      : "—",
  k: (n) =>
    n >= 1000000
      ? `£${(n / 1000000).toFixed(1)}M`
      : n >= 1000
      ? `£${(n / 1000).toFixed(0)}K`
      : `£${n}`,
};

const AUDIT_TYPES = [
  "Equity Change",
  "Spend",
  "Investment",
  "Deal Update",
  "Contract Signed",
  "Product Release",
  "Market Launch",
  "Compliance Update",
  "Team Change",
  "Decision",
  "Risk Update",
];
const SPEND_CATS = [
  "Product",
  "Licensing",
  "Legal",
  "Compliance",
  "Marketing",
  "Events",
  "Ops",
  "Salaries",
  "Contractors",
  "Travel",
  "Infra",
];
const INSTRUMENTS = ["Equity", "SAFE", "Convertible", "Options", "Advisory"];
const DEAL_STAGES = [
  "Target",
  "Intro",
  "Discovery",
  "Commercial",
  "Proposal",
  "Legal",
  "Signed",
  "Live",
  "Lost",
];
const INV_STAGES = [
  "Intro",
  "First Call",
  "Materials Sent",
  "Diligence",
  "Negotiation",
  "Committed",
  "Closed",
  "Lost",
];
const MKT_STATUSES = ["Research", "Licensing", "Build", "Pre-Launch", "Live"];
const PROD_TYPES = [
  "UI",
  "Backend",
  "Integration",
  "Payment",
  "CRM",
  "Compliance",
  "Bug Fix",
];
const PROD_STATUSES = ["Planned", "In Progress", "Beta", "Live"];
const RISK_SEVS = ["Low", "Medium", "High", "Critical"];
const RISK_STATUSES = ["Open", "Mitigated", "Closed"];
const DEPTS = [
  "Executive",
  "Engineering",
  "Commercial",
  "Operations",
  "Legal",
  "Finance",
  "Marketing",
];
const CHANGE_TYPES = [
  "Founder",
  "Hire",
  "Promotion",
  "Departure",
  "Upcoming Hire",
];
const INV_TYPES = [
  "Tier 1 VC",
  "VC",
  "CVC",
  "Angel",
  "Family Office",
  "Syndicate",
];
const STAKEHOLDER_TYPES = [
  "Founder",
  "VC",
  "Angel",
  "ESOP",
  "Advisor",
  "Strategic",
];

const stagePill = (s) => {
  const m = {
    Live: "#CCFF00",
    Signed: "#CCFF00",
    Closed: "#CCFF00",
    Committed: "#CCFF00",
    Mitigated: "#CCFF00",
    Legal: "#FFA500",
    Negotiation: "#FFA500",
    "Pre-Launch": "#FFA500",
    Open: "#FFA500",
    Commercial: "#FFD700",
    Proposal: "#FFD700",
    Diligence: "#FFD700",
    Build: "#FFD700",
    Beta: "#FFD700",
    "In Progress": "#FFD700",
    Discovery: "#8899AA",
    "First Call": "#8899AA",
    "Materials Sent": "#8899AA",
    Licensing: "#8899AA",
    Intro: "#555",
    Target: "#555",
    Research: "#555",
    Planned: "#555",
    Lost: "#ff4444",
    High: "#ff8800",
    Critical: "#ff4444",
    Medium: "#FFD700",
    Low: "#CCFF00",
  };
  return m[s] || "#555";
};

const INIT = {
  audit: [
    {
      id: uid(),
      type: "Investment",
      title: "Seed Round Closed — £2.4M",
      description:
        "Seed round completed with Moonfire Ventures leading. SAFE notes converted.",
      owner: "Alex Chen",
      date: ago(45),
      country: "UK",
      module: "Equity",
      value: 2400000,
      beforeState: "Pre-Seed",
      afterState: "Seeded",
      attachmentUrl: "https://docs.degenerate.io/seed-round",
      notes: "Completed 2 weeks ahead of schedule.",
    },
    {
      id: uid(),
      type: "Market Launch",
      title: "UK Market — Full Go-Live",
      description:
        "UK operations live with full betting exchange integration via Betfair.",
      owner: "Sarah Mills",
      date: ago(30),
      country: "UK",
      module: "Markets",
      value: 0,
      beforeState: "Pre-Launch",
      afterState: "Live",
      attachmentUrl: "",
      notes: "Monitoring closely for first 30 days.",
    },
    {
      id: uid(),
      type: "Deal Update",
      title: "Betfair Partnership → Legal Stage",
      description:
        "Commercial terms agreed. Moved to legal review and contract drafting.",
      owner: "James Park",
      date: ago(14),
      country: "UK",
      module: "Deals",
      value: 480000,
      beforeState: "Commercial",
      afterState: "Legal",
      attachmentUrl: "",
      notes: "NDA signed. Lawyers engaged.",
    },
    {
      id: uid(),
      type: "Spend",
      title: "AWS Infrastructure Q1 Payment",
      description: "Quarterly cloud infrastructure and CDN costs.",
      owner: "Dev Team",
      date: ago(10),
      country: "UK",
      module: "Spend",
      value: 18500,
      beforeState: "",
      afterState: "",
      attachmentUrl: "",
      notes: "Includes CDN, compute, and storage.",
    },
    {
      id: uid(),
      type: "Compliance Update",
      title: "UKGC Quarterly Compliance Filed",
      description:
        "Q1 compliance report submitted to UK Gambling Commission on time.",
      owner: "Lisa Wang",
      date: ago(7),
      country: "UK",
      module: "Compliance",
      value: 0,
      beforeState: "Draft",
      afterState: "Submitted",
      attachmentUrl: "https://docs.degenerate.io/compliance/q1-2025",
      notes: "No issues raised.",
    },
    {
      id: uid(),
      type: "Product Release",
      title: "Live Markets Engine v2.0",
      description:
        "Major overhaul of pricing engine. 20% latency improvement. Supports 10K concurrent markets.",
      owner: "Dev Team",
      date: ago(5),
      country: "Global",
      module: "Product",
      value: 0,
      beforeState: "Beta",
      afterState: "Live",
      attachmentUrl: "",
      notes: "Performance metrics exceeding targets.",
    },
    {
      id: uid(),
      type: "Decision",
      title: "Germany Expansion Paused",
      description:
        "Decided to pause DE market entry pending comprehensive licence review.",
      owner: "Alex Chen",
      date: ago(3),
      country: "DE",
      module: "Markets",
      value: 0,
      beforeState: "Build",
      afterState: "Paused",
      attachmentUrl: "",
      notes: "Revisit at Q3 board meeting.",
    },
    {
      id: uid(),
      type: "Risk Update",
      title: "Malta Licence — High Risk",
      description:
        "MGA licence timeline extended by 3 months. Risk elevated to High.",
      owner: "Lisa Wang",
      date: ago(1),
      country: "MT",
      module: "Risks",
      value: 0,
      beforeState: "Medium",
      afterState: "High",
      attachmentUrl: "",
      notes: "Local Maltese counsel engaged.",
    },
  ],
  spend: [
    {
      id: uid(),
      title: "AWS Infrastructure Q1",
      amount: 18500,
      currency: "GBP",
      category: "Infra",
      country: "UK",
      team: "Engineering",
      owner: "Dev Team",
      vendor: "Amazon Web Services",
      date: ago(10),
      recurring: "Yes",
      initiative: "Platform Scaling",
      notes: "Includes CDN, compute, RDS.",
    },
    {
      id: uid(),
      title: "Legal — Series A Prep",
      amount: 32000,
      currency: "GBP",
      category: "Legal",
      country: "UK",
      team: "Finance",
      owner: "Alex Chen",
      vendor: "Slaughter & May",
      date: ago(20),
      recurring: "No",
      initiative: "Fundraising",
      notes: "Term sheet review + data room prep.",
    },
    {
      id: uid(),
      title: "Team Salaries — April",
      amount: 95000,
      currency: "GBP",
      category: "Salaries",
      country: "UK",
      team: "All",
      owner: "HR",
      vendor: "Internal",
      date: ago(5),
      recurring: "Yes",
      initiative: "Operations",
      notes: "Headcount of 8 FTE.",
    },
    {
      id: uid(),
      title: "Malta MGA Licence Fee",
      amount: 25000,
      currency: "EUR",
      category: "Licensing",
      country: "MT",
      team: "Compliance",
      owner: "Lisa Wang",
      vendor: "Malta Gaming Authority",
      date: ago(15),
      recurring: "No",
      initiative: "Malta Expansion",
      notes: "Annual application fee.",
    },
    {
      id: uid(),
      title: "Performance Marketing — Google",
      amount: 12000,
      currency: "GBP",
      category: "Marketing",
      country: "UK",
      team: "Marketing",
      owner: "Sarah Mills",
      vendor: "Google Ads",
      date: ago(8),
      recurring: "Yes",
      initiative: "UK User Acquisition",
      notes: "CPA tracking via GA4.",
    },
    {
      id: uid(),
      title: "iOS Dev Contractors",
      amount: 28000,
      currency: "GBP",
      category: "Contractors",
      country: "UK",
      team: "Engineering",
      owner: "James Park",
      vendor: "Toptal",
      date: ago(3),
      recurring: "Yes",
      initiative: "Mobile App",
      notes: "3-month rolling contract. 2 devs.",
    },
    {
      id: uid(),
      title: "SaaS Stack — Notion, Linear, Slack",
      amount: 3200,
      currency: "GBP",
      category: "Ops",
      country: "UK",
      team: "All",
      owner: "Ops",
      vendor: "Various",
      date: ago(1),
      recurring: "Yes",
      initiative: "Operations",
      notes: "Annual renewals consolidated.",
    },
    {
      id: uid(),
      title: "Berlin Betting Summit",
      amount: 8500,
      currency: "EUR",
      category: "Events",
      country: "DE",
      team: "BD",
      owner: "James Park",
      vendor: "Various",
      date: ago(25),
      recurring: "No",
      initiative: "Market Research",
      notes: "Flights, hotel, conference passes.",
    },
  ],
  capTable: [
    {
      id: uid(),
      stakeholder: "Alex Chen",
      type: "Founder",
      round: "Founder",
      date: "2023-01-01",
      amountInvested: 0,
      equity: 38,
      instrument: "Equity",
      notes: "Co-founder & CEO",
      beforeOwnership: 0,
      afterOwnership: 38,
    },
    {
      id: uid(),
      stakeholder: "Sarah Mills",
      type: "Founder",
      round: "Founder",
      date: "2023-01-01",
      amountInvested: 0,
      equity: 32,
      instrument: "Equity",
      notes: "Co-founder & COO",
      beforeOwnership: 0,
      afterOwnership: 32,
    },
    {
      id: uid(),
      stakeholder: "Moonfire Ventures",
      type: "VC",
      round: "Seed",
      date: ago(45),
      amountInvested: 1500000,
      equity: 14,
      instrument: "Equity",
      notes: "Lead seed investor",
      beforeOwnership: 0,
      afterOwnership: 14,
    },
    {
      id: uid(),
      stakeholder: "Backed VC",
      type: "VC",
      round: "Seed",
      date: ago(45),
      amountInvested: 600000,
      equity: 6,
      instrument: "Equity",
      notes: "Seed follow-on",
      beforeOwnership: 0,
      afterOwnership: 6,
    },
    {
      id: uid(),
      stakeholder: "UK Angel Syndicate",
      type: "Angel",
      round: "Seed",
      date: ago(45),
      amountInvested: 300000,
      equity: 3,
      instrument: "SAFE",
      notes: "HNW angel group via Moonfire intro",
      beforeOwnership: 0,
      afterOwnership: 3,
    },
    {
      id: uid(),
      stakeholder: "ESOP Pool",
      type: "ESOP",
      round: "Seed",
      date: ago(45),
      amountInvested: 0,
      equity: 7,
      instrument: "Options",
      notes: "10-year vesting pool for employees",
      beforeOwnership: 0,
      afterOwnership: 7,
    },
  ],
  investors: [
    {
      id: uid(),
      name: "Andreessen Horowitz",
      type: "Tier 1 VC",
      stage: "Diligence",
      ticket: 5000000,
      status: "Active",
      lastContact: ago(3),
      nextStep: "Partner meeting booked for next week",
      owner: "Alex Chen",
      notes: "Very strong interest in prediction market infra.",
    },
    {
      id: uid(),
      name: "Moonfire Ventures",
      type: "VC",
      stage: "Committed",
      ticket: 2000000,
      status: "Active",
      lastContact: ago(1),
      nextStep: "Term sheet negotiation",
      owner: "Alex Chen",
      notes: "Follow-on from seed. High conviction.",
    },
    {
      id: uid(),
      name: "Founders Fund",
      type: "Tier 1 VC",
      stage: "Materials Sent",
      ticket: 3000000,
      status: "Active",
      lastContact: ago(7),
      nextStep: "Await response — follow up in 5 days",
      owner: "Sarah Mills",
      notes: "Warm intro via Moonfire. Deck + data room sent.",
    },
    {
      id: uid(),
      name: "Speedinvest",
      type: "VC",
      stage: "First Call",
      ticket: 1000000,
      status: "Active",
      lastContact: ago(5),
      nextStep: "Send deck + schedule follow-up",
      owner: "Alex Chen",
      notes: "European focus. Regulatory expertise valuable.",
    },
    {
      id: uid(),
      name: "Chris Dixon",
      type: "Angel",
      stage: "Committed",
      ticket: 250000,
      status: "Active",
      lastContact: ago(2),
      nextStep: "Docs signing in progress",
      owner: "Alex Chen",
      notes: "Strategic angel. Crypto/prediction market expertise.",
    },
    {
      id: uid(),
      name: "Balderton Capital",
      type: "VC",
      stage: "Intro",
      ticket: 4000000,
      status: "Active",
      lastContact: ago(10),
      nextStep: "Schedule intro call",
      owner: "Sarah Mills",
      notes: "Warm intro via advisor network.",
    },
    {
      id: uid(),
      name: "Point Nine Capital",
      type: "VC",
      stage: "Lost",
      ticket: 1500000,
      status: "Inactive",
      lastContact: ago(30),
      nextStep: "",
      owner: "Alex Chen",
      notes: "Not a fit for current stage. Too early.",
    },
    {
      id: uid(),
      name: "UK Family Office",
      type: "Family Office",
      stage: "Negotiation",
      ticket: 500000,
      status: "Active",
      lastContact: ago(4),
      nextStep: "Term sheet review meeting",
      owner: "James Park",
      notes: "UK HNW family. Sports & gaming background.",
    },
  ],
  deals: [
    {
      id: uid(),
      company: "Betfair",
      country: "UK",
      stage: "Legal",
      model: "Revenue Share",
      value: 480000,
      probability: 75,
      signDate: fwd(30),
      liveDate: fwd(60),
      owner: "James Park",
      notes: "Largest deal in pipeline. Strong champion internally.",
    },
    {
      id: uid(),
      company: "Sky Bet",
      country: "UK",
      stage: "Commercial",
      model: "API Licence",
      value: 360000,
      probability: 50,
      signDate: fwd(45),
      liveDate: fwd(90),
      owner: "James Park",
      notes: "Need pricing sign-off from their procurement team.",
    },
    {
      id: uid(),
      company: "Bet365",
      country: "UK",
      stage: "Proposal",
      model: "White Label",
      value: 600000,
      probability: 35,
      signDate: fwd(60),
      liveDate: fwd(120),
      owner: "Alex Chen",
      notes: "High value deal. Long internal process.",
    },
    {
      id: uid(),
      company: "Unibet",
      country: "SE",
      stage: "Discovery",
      model: "Revenue Share",
      value: 220000,
      probability: 30,
      signDate: fwd(90),
      liveDate: fwd(150),
      owner: "Sarah Mills",
      notes: "Nordic expansion lead.",
    },
    {
      id: uid(),
      company: "Tipico",
      country: "DE",
      stage: "Intro",
      model: "API Licence",
      value: 280000,
      probability: 20,
      signDate: fwd(120),
      liveDate: fwd(180),
      owner: "James Park",
      notes: "Germany re-entry opportunity.",
    },
    {
      id: uid(),
      company: "Coral",
      country: "UK",
      stage: "Signed",
      model: "Revenue Share",
      value: 180000,
      probability: 100,
      signDate: ago(15),
      liveDate: fwd(30),
      owner: "James Park",
      notes: "Signed. Integration in progress.",
    },
    {
      id: uid(),
      company: "Paddy Power",
      country: "IE",
      stage: "Commercial",
      model: "White Label",
      value: 420000,
      probability: 55,
      signDate: fwd(50),
      liveDate: fwd(100),
      owner: "Alex Chen",
      notes: "Ireland market entry. Key strategic deal.",
    },
    {
      id: uid(),
      company: "Kambi Group",
      country: "MT",
      stage: "Discovery",
      model: "API Licence",
      value: 150000,
      probability: 40,
      signDate: fwd(75),
      liveDate: fwd(135),
      owner: "Sarah Mills",
      notes: "B2B infrastructure play. Malta base.",
    },
  ],
  markets: [
    {
      id: uid(),
      country: "United Kingdom",
      status: "Live",
      targetLaunch: ago(30),
      licenceStatus: "Obtained",
      partnerStatus: "Active",
      readiness: 100,
      blocker: "None",
      owner: "Sarah Mills",
      notes: "Full operations. Monitoring KPIs daily.",
    },
    {
      id: uid(),
      country: "Ireland",
      status: "Pre-Launch",
      targetLaunch: fwd(30),
      licenceStatus: "Obtained",
      partnerStatus: "Negotiating",
      readiness: 75,
      blocker: "Partner integration delays",
      owner: "James Park",
      notes: "Soft launch planned for next month.",
    },
    {
      id: uid(),
      country: "Malta",
      status: "Licensing",
      targetLaunch: fwd(90),
      licenceStatus: "Pending",
      partnerStatus: "Identified",
      readiness: 40,
      blocker: "MGA licence approval",
      owner: "Lisa Wang",
      notes: "Application in review. 3-month delay confirmed.",
    },
    {
      id: uid(),
      country: "Sweden",
      status: "Research",
      targetLaunch: fwd(150),
      licenceStatus: "Not Applied",
      partnerStatus: "None",
      readiness: 15,
      blocker: "Market research incomplete",
      owner: "Sarah Mills",
      notes: "Exploring Spelinspektionen requirements.",
    },
    {
      id: uid(),
      country: "Germany",
      status: "Build",
      targetLaunch: fwd(120),
      licenceStatus: "In Progress",
      partnerStatus: "Identified",
      readiness: 35,
      blocker: "Regulatory complexity",
      owner: "Alex Chen",
      notes: "Paused pending legal review.",
    },
    {
      id: uid(),
      country: "Netherlands",
      status: "Research",
      targetLaunch: fwd(180),
      licenceStatus: "Not Applied",
      partnerStatus: "None",
      readiness: 10,
      blocker: "KSA requirements study",
      owner: "Lisa Wang",
      notes: "Early assessment phase.",
    },
  ],
  products: [
    {
      id: uid(),
      feature: "Live Markets Engine v2.0",
      type: "Backend",
      status: "Live",
      releaseDate: ago(5),
      owner: "Dev Team",
      impact: "High",
      notes: "20% latency improvement. Supports 10K concurrent markets.",
    },
    {
      id: uid(),
      feature: "iOS App — Beta",
      type: "UI",
      status: "Beta",
      releaseDate: fwd(14),
      owner: "James Park",
      impact: "High",
      notes: "TestFlight release for internal testing.",
    },
    {
      id: uid(),
      feature: "Betfair API Integration",
      type: "Integration",
      status: "Live",
      releaseDate: ago(20),
      owner: "Dev Team",
      impact: "High",
      notes: "Full order routing via Betfair Exchange.",
    },
    {
      id: uid(),
      feature: "Stripe Payment Gateway",
      type: "Payment",
      status: "Live",
      releaseDate: ago(35),
      owner: "Dev Team",
      impact: "Medium",
      notes: "GBP and EUR support. 3DS2 compliant.",
    },
    {
      id: uid(),
      feature: "Internal CRM Dashboard",
      type: "CRM",
      status: "In Progress",
      releaseDate: fwd(21),
      owner: "Sarah Mills",
      impact: "Medium",
      notes: "Customer management for ops team.",
    },
    {
      id: uid(),
      feature: "UKGC Responsible Gambling Module",
      type: "Compliance",
      status: "Live",
      releaseDate: ago(45),
      owner: "Lisa Wang",
      impact: "Critical",
      notes: "Deposit limits, self-exclusion, affordability checks.",
    },
    {
      id: uid(),
      feature: "Market Creator UI",
      type: "UI",
      status: "In Progress",
      releaseDate: fwd(7),
      owner: "Dev Team",
      impact: "High",
      notes: "Self-serve market creation for operators.",
    },
    {
      id: uid(),
      feature: "Price Feed Decimal Bug Fix",
      type: "Bug Fix",
      status: "Live",
      releaseDate: ago(2),
      owner: "Dev Team",
      impact: "Medium",
      notes: "Fixed precision rounding on live market prices.",
    },
  ],
  risks: [
    {
      id: uid(),
      title: "UKGC Regulatory Change",
      category: "Regulatory",
      severity: "High",
      likelihood: "Medium",
      owner: "Lisa Wang",
      mitigation:
        "Proactive compliance monitoring. External legal counsel retained.",
      status: "Open",
      reviewDate: fwd(30),
      notes: "White Paper implementation ongoing.",
    },
    {
      id: uid(),
      title: "CTO Single Point of Failure",
      category: "Operational",
      severity: "High",
      likelihood: "Low",
      owner: "Alex Chen",
      mitigation: "Succession plan drafted. Documentation in progress.",
      status: "Open",
      reviewDate: fwd(60),
      notes: "Critical dependency on CTO for architecture decisions.",
    },
    {
      id: uid(),
      title: "Payment Provider Disruption",
      category: "Financial",
      severity: "Medium",
      likelihood: "Low",
      owner: "Dev Team",
      mitigation: "Multi-provider setup planned for Q2. Adyen as backup.",
      status: "Open",
      reviewDate: fwd(45),
      notes: "Currently single Stripe dependency.",
    },
    {
      id: uid(),
      title: "Malta Licence Delay",
      category: "Regulatory",
      severity: "Medium",
      likelihood: "High",
      owner: "Lisa Wang",
      mitigation:
        "Contingency: launch via white label partner while licence pending.",
      status: "Open",
      reviewDate: fwd(14),
      notes: "3-month delay now confirmed by MGA.",
    },
    {
      id: uid(),
      title: "Data Security Breach",
      category: "Technology",
      severity: "Critical",
      likelihood: "Low",
      owner: "Dev Team",
      mitigation:
        "Annual pen test scheduled. ISO 27001 certification in progress.",
      status: "Open",
      reviewDate: fwd(90),
      notes: "Last pen test was 4 months ago. Overdue.",
    },
    {
      id: uid(),
      title: "Series A Funding Delay",
      category: "Financial",
      severity: "High",
      likelihood: "Medium",
      owner: "Alex Chen",
      mitigation:
        "Bridge loan facility available. Extend runway via revenue acceleration.",
      status: "Open",
      reviewDate: fwd(21),
      notes: "Currently 8 months runway at current burn rate.",
    },
  ],
  decisions: [
    {
      id: uid(),
      title: "Pause Germany Market Entry",
      date: ago(3),
      owner: "Alex Chen",
      summary:
        "Decided to pause DE expansion pending comprehensive licence and regulatory review.",
      rationale: "Regulatory complexity too high for current resource level.",
      alternatives: "Proceed via white label partner in DE",
      impact: "Q3 target delayed to Q4 at earliest.",
      notes: "Revisit at Q3 board meeting.",
    },
    {
      id: uid(),
      title: "Hire Chief Revenue Officer",
      date: ago(14),
      owner: "Alex Chen",
      summary: "Board approved hiring a CRO to lead commercial growth.",
      rationale: "Pipeline growth requires dedicated commercial leadership.",
      alternatives: "Expand existing BD team with 2 senior hires.",
      impact: "+£150K annual cost. Expected 3x deal velocity.",
      notes: "Search active via Korn Ferry. 3 shortlisted.",
    },
    {
      id: uid(),
      title: "UK + IE Focus for 2025",
      date: ago(30),
      owner: "Alex Chen",
      summary: "Narrowed geographic focus to UK and Ireland for 2025.",
      rationale:
        "Capital efficiency. Better to win 2 markets deeply than spread thin.",
      alternatives: "Pursue Malta simultaneously.",
      impact: "Malta pushed to Q3. Sweden to 2026.",
      notes: "Supported unanimously by board.",
    },
    {
      id: uid(),
      title: "Decline Acquisition Approach",
      date: ago(45),
      owner: "Alex Chen",
      summary:
        "Declined exploratory acquisition approach from major tier-1 UK operator.",
      rationale: "Too early. Valuation not reflective of trajectory.",
      alternatives: "Explore strategic partnership instead.",
      impact: "None near-term. Door left open for 2026+.",
      notes: "Strategic partnership discussions ongoing.",
    },
    {
      id: uid(),
      title: "Migrate from GCP to AWS",
      date: ago(60),
      owner: "Dev Team",
      summary: "Migrated all infrastructure from Google Cloud to AWS.",
      rationale:
        "Better pricing for workloads. Stronger UK region. Better compliance tooling.",
      alternatives: "Stay on GCP. Explore Azure.",
      impact: "22% infrastructure cost reduction.",
      notes: "Migration completed on schedule.",
    },
  ],
  people: [
    {
      id: uid(),
      name: "Alex Chen",
      role: "CEO",
      department: "Executive",
      changeType: "Founder",
      date: "2023-01-01",
      costImpact: 180000,
      manager: "Board",
      notes: "Co-founder. 38% equity.",
    },
    {
      id: uid(),
      name: "Sarah Mills",
      role: "COO",
      department: "Operations",
      changeType: "Founder",
      date: "2023-01-01",
      costImpact: 160000,
      manager: "Alex Chen",
      notes: "Co-founder. 32% equity.",
    },
    {
      id: uid(),
      name: "James Park",
      role: "Head of BD",
      department: "Commercial",
      changeType: "Hire",
      date: ago(90),
      costImpact: 130000,
      manager: "Alex Chen",
      notes: "Ex-Betfair.",
    },
    {
      id: uid(),
      name: "Lisa Wang",
      role: "Head of Compliance",
      department: "Legal",
      changeType: "Hire",
      date: ago(120),
      costImpact: 120000,
      manager: "Sarah Mills",
      notes: "Former UKGC examiner.",
    },
    {
      id: uid(),
      name: "Engineering Team (x3)",
      role: "Senior Engineers",
      department: "Engineering",
      changeType: "Hire",
      date: ago(180),
      costImpact: 360000,
      manager: "Alex Chen",
      notes: "Three senior fullstack engineers.",
    },
    {
      id: uid(),
      name: "CRO (TBH)",
      role: "Chief Revenue Officer",
      department: "Commercial",
      changeType: "Upcoming Hire",
      date: fwd(30),
      costImpact: 150000,
      manager: "Alex Chen",
      notes: "Search active. 3 candidates shortlisted.",
    },
  ],
};

const Pill = ({ label, color }) => (
  <span
    style={{
      display: "inline-block",
      padding: "2px 9px",
      borderRadius: 2,
      background: `${color || "#555"}28`,
      color: color || "#888",
      fontSize: 10,
      fontWeight: 700,
      letterSpacing: 1.2,
      textTransform: "uppercase",
      fontFamily: T.b,
      border: `1px solid ${color || "#555"}44`,
      whiteSpace: "nowrap",
    }}
  >
    {label}
  </span>
);

const KPI = ({ label, value, sub, accent, sm }) => (
  <div
    style={{
      background: "#0a0a0a",
      border: "1px solid #1e1e1e",
      padding: sm ? "18px 20px" : "24px 28px",
      borderTop: accent ? "2px solid #CCFF00" : "1px solid #1e1e1e",
    }}
  >
    <div
      style={{
        fontSize: 10,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: C.g6,
        fontFamily: T.b,
        marginBottom: 8,
      }}
    >
      {label}
    </div>
    <div
      style={{
        fontSize: sm ? 24 : 32,
        fontFamily: T.d,
        color: C.wh,
        letterSpacing: 1,
        lineHeight: 1,
      }}
    >
      {value}
    </div>
    {sub && (
      <div style={{ fontSize: 11, color: C.g4, fontFamily: T.b, marginTop: 6 }}>
        {sub}
      </div>
    )}
  </div>
);

const Btn = ({
  children,
  onClick,
  variant = "primary",
  size = "md",
  disabled,
  style: s = {},
}) => {
  const styles = {
    primary: { background: "#CCFF00", color: "#000", border: "none" },
    ghost: {
      background: "transparent",
      color: C.g4,
      border: "1px solid #2a2a2a",
    },
    danger: {
      background: "transparent",
      color: "#ff5555",
      border: "1px solid #ff555530",
    },
  };
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      style={{
        cursor: disabled ? "default" : "pointer",
        fontFamily: T.b,
        fontWeight: 700,
        letterSpacing: 1,
        textTransform: "uppercase",
        fontSize: size === "sm" ? 10 : 11,
        padding: size === "sm" ? "5px 10px" : "9px 18px",
        opacity: disabled ? 0.4 : 1,
        ...styles[variant],
        ...s,
      }}
    >
      {children}
    </button>
  );
};

const FInput = ({
  label,
  value,
  onChange,
  type = "text",
  opts,
  placeholder,
  required,
  half,
}) => (
  <div
    style={{
      marginBottom: 14,
      width: half ? "calc(50% - 6px)" : "100%",
      display: "inline-block",
      verticalAlign: "top",
      marginRight: half ? "12px" : 0,
    }}
  >
    <label
      style={{
        display: "block",
        fontSize: 9,
        letterSpacing: 2.5,
        textTransform: "uppercase",
        color: C.g4,
        fontFamily: T.b,
        marginBottom: 5,
      }}
    >
      {label}
      {required && <span style={{ color: "#CCFF00" }}> *</span>}
    </label>
    {opts ? (
      <select
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        style={{
          width: "100%",
          background: "#050505",
          border: "1px solid #222",
          color: C.wh,
          padding: "9px 12px",
          fontFamily: T.b,
          fontSize: 12,
          outline: "none",
          appearance: "none",
        }}
      >
        <option value="">— Select —</option>
        {opts.map((o) => (
          <option key={o} value={o}>
            {o}
          </option>
        ))}
      </select>
    ) : (
      <input
        type={type}
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        style={{
          width: "100%",
          background: "#050505",
          border: "1px solid #222",
          color: C.wh,
          padding: "9px 12px",
          fontFamily: T.b,
          fontSize: 12,
          outline: "none",
          boxSizing: "border-box",
        }}
      />
    )}
  </div>
);

const Modal = ({ title, onClose, onSave, children, wide }) => {
  if (!title) return null;
  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        background: "rgba(0,0,0,0.88)",
        zIndex: 1000,
        display: "flex",
        alignItems: "flex-start",
        justifyContent: "flex-end",
      }}
      onClick={onClose}
    >
      <div
        style={{
          width: wide ? 640 : 480,
          height: "100vh",
          background: "#080808",
          borderLeft: "1px solid #1e1e1e",
          display: "flex",
          flexDirection: "column",
          overflowY: "auto",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          style={{
            padding: "22px 28px",
            borderBottom: "1px solid #1a1a1a",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            position: "sticky",
            top: 0,
            background: "#080808",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: T.d,
              fontSize: 22,
              color: C.wh,
              letterSpacing: 1,
            }}
          >
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              background: "none",
              border: "none",
              color: C.g4,
              fontSize: 18,
              cursor: "pointer",
            }}
          >
            ✕
          </button>
        </div>
        <div style={{ flex: 1, padding: "24px 28px", overflowY: "auto" }}>
          {children}
        </div>
        <div
          style={{
            padding: "16px 28px",
            borderTop: "1px solid #1a1a1a",
            display: "flex",
            gap: 10,
            position: "sticky",
            bottom: 0,
            background: "#080808",
          }}
        >
          <Btn onClick={onSave}>Save Entry</Btn>
          <Btn variant="ghost" onClick={onClose}>
            Cancel
          </Btn>
        </div>
      </div>
    </div>
  );
};

const TRow = ({ cols, row, onEdit, onDelete }) => {
  const [hover, setHover] = useState(false);
  return (
    <tr
      style={{
        borderBottom: "1px solid #0f0f0f",
        background: hover ? "#0a0a0a" : "transparent",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      {cols.map((c) => (
        <td
          key={c.key}
          style={{
            padding: "11px 16px",
            fontSize: 12,
            color: c.muted ? C.g4 : C.wh,
            fontFamily: T.b,
            whiteSpace: c.wrap ? "normal" : "nowrap",
            maxWidth: c.wrap ? 260 : undefined,
          }}
        >
          {c.render ? c.render(row) : row[c.key] ?? "—"}
        </td>
      ))}
      <td
        style={{
          padding: "11px 16px",
          whiteSpace: "nowrap",
          opacity: hover ? 1 : 0,
          transition: "opacity 0.15s",
        }}
      >
        <Btn
          size="sm"
          variant="ghost"
          onClick={() => onEdit(row)}
          style={{ marginRight: 6 }}
        >
          Edit
        </Btn>
        <Btn size="sm" variant="danger" onClick={() => onDelete(row.id)}>
          Del
        </Btn>
      </td>
    </tr>
  );
};

const DataTable = ({ cols, rows, onEdit, onDelete }) => (
  <div style={{ overflowX: "auto" }}>
    <table
      style={{ width: "100%", borderCollapse: "collapse", fontFamily: T.b }}
    >
      <thead>
        <tr>
          {cols.map((c) => (
            <th
              key={c.key}
              style={{
                padding: "10px 16px",
                textAlign: "left",
                fontSize: 9,
                letterSpacing: 2.5,
                textTransform: "uppercase",
                color: C.g6,
                borderBottom: "1px solid #1a1a1a",
                fontWeight: 700,
                whiteSpace: "nowrap",
                fontFamily: T.b,
              }}
            >
              {c.label}
            </th>
          ))}
          <th
            style={{
              padding: "10px 16px",
              borderBottom: "1px solid #1a1a1a",
              width: 120,
            }}
          />
        </tr>
      </thead>
      <tbody>
        {rows.length === 0 ? (
          <tr>
            <td
              colSpan={cols.length + 1}
              style={{
                padding: 48,
                textAlign: "center",
                color: C.g6,
                fontSize: 13,
                fontFamily: T.b,
              }}
            >
              No entries yet.
            </td>
          </tr>
        ) : (
          rows.map((r) => (
            <TRow
              key={r.id}
              cols={cols}
              row={r}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))
        )}
      </tbody>
    </table>
  </div>
);

const TopBar = ({ title, onAdd, addLabel, search, onSearch, children }) => (
  <div
    style={{
      height: 58,
      background: C.bk,
      borderBottom: "1px solid #1a1a1a",
      display: "flex",
      alignItems: "center",
      gap: 12,
      padding: "0 32px",
      position: "sticky",
      top: 0,
      zIndex: 50,
    }}
  >
    <div
      style={{
        fontFamily: T.d,
        fontSize: 18,
        color: C.wh,
        letterSpacing: 1,
        flex: 1,
      }}
    >
      {title}
    </div>
    {children}
    {onSearch && (
      <input
        value={search}
        onChange={(e) => onSearch(e.target.value)}
        placeholder="Search…"
        style={{
          background: "#0a0a0a",
          border: "1px solid #1a1a1a",
          color: C.wh,
          padding: "7px 13px",
          fontFamily: T.b,
          fontSize: 11,
          width: 180,
          outline: "none",
        }}
      />
    )}
    {onAdd && <Btn onClick={onAdd}>+ {addLabel || "Add Entry"}</Btn>}
  </div>
);

const ChartBox = ({ title, children, h = 200 }) => (
  <div
    style={{ background: "#0a0a0a", border: "1px solid #1e1e1e", padding: 24 }}
  >
    <div
      style={{
        fontSize: 9,
        letterSpacing: 3,
        textTransform: "uppercase",
        color: C.g6,
        fontFamily: T.b,
        marginBottom: 16,
      }}
    >
      {title}
    </div>
    <div style={{ height: h }}>{children}</div>
  </div>
);

const TT = {
  contentStyle: {
    background: "#0f0f0f",
    border: "1px solid #222",
    color: "#fff",
    fontFamily: T.b,
    fontSize: 11,
  },
  labelStyle: { color: "#888" },
};
const AX = { fill: "#444", fontSize: 9, fontFamily: T.b };

const NAVITEMS = [
  { id: "overview", icon: "◈", label: "Overview" },
  { id: "audit", icon: "⏺", label: "Audit Trail" },
  { id: "spend", icon: "₤", label: "Spend Tracker" },
  { id: "equity", icon: "◉", label: "Cap Table" },
  { id: "investors", icon: "◆", label: "Investors" },
  { id: "deals", icon: "⬡", label: "Deals" },
  { id: "markets", icon: "⊕", label: "Markets" },
  { id: "product", icon: "▲", label: "Product Log" },
  { id: "risks", icon: "⚠", label: "Risk Register" },
  { id: "decisions", icon: "◇", label: "Decisions" },
  { id: "people", icon: "◯", label: "People" },
  { id: "reporting", icon: "≡", label: "Reporting" },
];

const Sidebar = ({ active, onNav, notifications }) => (
  <div
    style={{
      width: 220,
      background: C.bk,
      borderRight: "1px solid #131313",
      display: "flex",
      flexDirection: "column",
      height: "100vh",
      position: "fixed",
      left: 0,
      top: 0,
      zIndex: 100,
    }}
  >
    <div
      style={{ padding: "22px 22px 18px", borderBottom: "1px solid #131313" }}
    >
      <div style={{ display: "flex", alignItems: "baseline" }}>
        <span
          style={{
            fontFamily: T.d,
            fontSize: 26,
            color: C.wh,
            letterSpacing: 0.5,
            lineHeight: 1,
          }}
        >
          Degenerate
        </span>
        <span
          style={{
            display: "inline-block",
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "#CCFF00",
            marginLeft: 2,
            position: "relative",
            bottom: 8,
          }}
        />
      </div>
      <div
        style={{
          fontSize: 9,
          letterSpacing: 3,
          textTransform: "uppercase",
          color: C.g6,
          fontFamily: T.b,
          marginTop: 5,
        }}
      >
        Operating System
      </div>
    </div>
    <nav style={{ flex: 1, padding: "10px 0", overflowY: "auto" }}>
      {NAVITEMS.map((m) => (
        <button
          key={m.id}
          onClick={() => onNav(m.id)}
          style={{
            display: "flex",
            alignItems: "center",
            gap: 11,
            width: "100%",
            padding: "10px 22px",
            background: active === m.id ? "#0d0d0d" : "transparent",
            color: active === m.id ? "#CCFF00" : C.g4,
            border: "none",
            borderLeft:
              active === m.id ? "2px solid #CCFF00" : "2px solid transparent",
            cursor: "pointer",
            fontFamily: T.b,
            fontSize: 12,
            fontWeight: active === m.id ? 600 : 400,
            textAlign: "left",
          }}
        >
          <span style={{ fontSize: 13, width: 16, textAlign: "center" }}>
            {m.icon}
          </span>
          {m.label}
          {m.id === "risks" && notifications > 0 && (
            <span
              style={{
                marginLeft: "auto",
                background: "#ff5555",
                color: "#fff",
                fontSize: 9,
                fontWeight: 700,
                padding: "1px 5px",
                borderRadius: 10,
              }}
            >
              {notifications}
            </span>
          )}
        </button>
      ))}
    </nav>
    <div style={{ padding: "14px 22px", borderTop: "1px solid #131313" }}>
      <div
        style={{
          fontSize: 9,
          letterSpacing: 2,
          textTransform: "uppercase",
          color: "#222",
          fontFamily: T.b,
        }}
      >
        Every moment has a price.
      </div>
    </div>
  </div>
);

const Overview = ({ data }) => {
  const { spend, investors, deals, markets, products, risks, audit, capTable } =
    data;
  const totalSpend = spend.reduce((s, x) => s + x.amount, 0);
  const monthlyBurn = spend
    .filter((x) => x.recurring === "Yes")
    .reduce((s, x) => s + x.amount, 0);
  const totalRaised = capTable.reduce((s, x) => s + (x.amountInvested || 0), 0);
  const runway = monthlyBurn > 0 ? Math.round(totalRaised / monthlyBurn) : "∞";
  const weightedPipeline = deals.reduce(
    (s, d) => s + (Number(d.value) * Number(d.probability)) / 100,
    0
  );
  const spendByCat = SPEND_CATS.map((cat) => ({
    name: cat,
    v: spend
      .filter((s) => s.category === cat)
      .reduce((t, s) => t + s.amount, 0),
  }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v)
    .slice(0, 7);
  const dealsByStage = DEAL_STAGES.map((s) => ({
    name: s.slice(0, 4),
    v: deals.filter((d) => d.stage === s).reduce((t, d) => t + d.value, 0),
  })).filter((x) => x.v > 0);
  return (
    <div style={{ padding: 32 }}>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <KPI label="Total Spend" value={fmt.k(totalSpend)} accent />
        <KPI label="Monthly Burn" value={fmt.k(monthlyBurn)} sub="Recurring" />
        <KPI label="Total Raised" value={fmt.k(totalRaised)} sub="Seed round" />
        <KPI label="Runway" value={`${runway}mo`} accent />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(4,1fr)",
          gap: 2,
          marginBottom: 32,
        }}
      >
        <KPI
          label="Active Markets"
          value={markets.filter((m) => m.status === "Live").length}
        />
        <KPI
          label="Deals in Pipeline"
          value={deals.filter((d) => d.stage !== "Lost").length}
        />
        <KPI label="Weighted Pipeline" value={fmt.k(weightedPipeline)} accent />
        <KPI
          label="Open Risks"
          value={risks.filter((r) => r.status === "Open").length}
        />
      </div>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gap: 2,
          marginBottom: 2,
        }}
      >
        <ChartBox title="Spend by Category">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={spendByCat} margin={{ left: -20 }}>
              <XAxis dataKey="name" tick={AX} />
              <YAxis tick={AX} />
              <Tooltip {...TT} formatter={(v) => fmt.k(v)} />
              <Bar dataKey="v" fill="#CCFF00" name="Spend" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
        <ChartBox title="Deal Pipeline by Stage">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dealsByStage} margin={{ left: -20 }}>
              <XAxis dataKey="name" tick={AX} />
              <YAxis tick={AX} />
              <Tooltip {...TT} formatter={(v) => fmt.k(v)} />
              <Bar dataKey="v" fill="#FFA500" name="Value" />
            </BarChart>
          </ResponsiveContainer>
        </ChartBox>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2 }}>
        <div
          style={{
            background: "#0a0a0a",
            border: "1px solid #1e1e1e",
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: C.g6,
              fontFamily: T.b,
              marginBottom: 18,
            }}
          >
            Recent Activity
          </div>
          {[...audit]
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .slice(0, 6)
            .map((a) => (
              <div
                key={a.id}
                style={{
                  display: "flex",
                  gap: 14,
                  marginBottom: 16,
                  alignItems: "flex-start",
                }}
              >
                <div
                  style={{
                    width: 6,
                    height: 6,
                    borderRadius: "50%",
                    background: "#CCFF00",
                    marginTop: 5,
                    flexShrink: 0,
                  }}
                />
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontSize: 12,
                      color: C.wh,
                      fontFamily: T.b,
                      fontWeight: 500,
                    }}
                  >
                    {a.title}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: C.g6,
                      fontFamily: T.b,
                      marginTop: 2,
                    }}
                  >
                    {a.owner} · {fmt.dt(a.date)}
                  </div>
                </div>
                <Pill label={a.type} color="#CCFF00" />
              </div>
            ))}
        </div>
        <div
          style={{
            background: "#0a0a0a",
            border: "1px solid #1e1e1e",
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: C.g6,
              fontFamily: T.b,
              marginBottom: 16,
            }}
          >
            Top Open Risks
          </div>
          {risks
            .filter((r) => r.status === "Open")
            .slice(0, 4)
            .map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  gap: 10,
                  marginBottom: 14,
                  justifyContent: "space-between",
                }}
              >
                <div>
                  <div style={{ fontSize: 12, color: C.wh, fontFamily: T.b }}>
                    {r.title}
                  </div>
                  <div style={{ fontSize: 10, color: C.g6, fontFamily: T.b }}>
                    {r.owner} · Review {fmt.dt(r.reviewDate)}
                  </div>
                </div>
                <Pill label={r.severity} color={stagePill(r.severity)} />
              </div>
            ))}
          <div
            style={{
              marginTop: 20,
              borderTop: "1px solid #1a1a1a",
              paddingTop: 16,
            }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: C.g6,
                fontFamily: T.b,
                marginBottom: 10,
              }}
            >
              Markets
            </div>
            {markets.map((m) => (
              <div
                key={m.id}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 12, color: C.wh, fontFamily: T.b }}>
                  {m.country}
                </span>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <div
                    style={{
                      width: 60,
                      height: 3,
                      background: "#1a1a1a",
                      borderRadius: 2,
                    }}
                  >
                    <div
                      style={{
                        width: `${m.readiness}%`,
                        height: "100%",
                        background: stagePill(m.status),
                        borderRadius: 2,
                      }}
                    />
                  </div>
                  <Pill label={m.status} color={stagePill(m.status)} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

const AuditTrail = ({ entries, setEntries }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = {
    type: "",
    title: "",
    description: "",
    owner: "",
    date: ds(new Date()),
    country: "",
    module: "",
    value: "",
    beforeState: "",
    afterState: "",
    attachmentUrl: "",
    notes: "",
  };
  const [form, setForm] = useState(blank);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const filtered = [...entries]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter(
      (e) =>
        (!filter || e.type === filter) &&
        (!search ||
          JSON.stringify(e).toLowerCase().includes(search.toLowerCase()))
    );
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModal(true);
  };
  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ ...row });
    setModal(true);
  };
  const save = () => {
    editing
      ? setEntries((p) =>
          p.map((e) => (e.id === editing ? { ...form, id: editing } : e))
        )
      : setEntries((p) => [{ ...form, id: uid() }, ...p]);
    setModal(false);
  };
  const del = (id) => setEntries((p) => p.filter((e) => e.id !== id));
  return (
    <div>
      <TopBar
        title="Audit Trail"
        onAdd={openAdd}
        addLabel="Log Entry"
        search={search}
        onSearch={setSearch}
      />
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 24,
            flexWrap: "wrap",
          }}
        >
          {["All", ...AUDIT_TYPES].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t === "All" ? "" : t)}
              style={{
                padding: "5px 12px",
                fontFamily: T.b,
                fontSize: 9,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                background: (t === "All" ? !filter : filter === t)
                  ? "#CCFF00"
                  : "transparent",
                color: (t === "All" ? !filter : filter === t) ? "#000" : C.g4,
                border: "1px solid #1e1e1e",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {filtered.map((e, i) => (
          <div
            key={e.id}
            style={{ display: "flex", gap: 18, marginBottom: 20 }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                paddingTop: 4,
              }}
            >
              <div
                style={{
                  width: 8,
                  height: 8,
                  borderRadius: "50%",
                  background: "#CCFF00",
                  flexShrink: 0,
                }}
              />
              {i < filtered.length - 1 && (
                <div
                  style={{
                    width: 1,
                    flex: 1,
                    background: "#1a1a1a",
                    marginTop: 6,
                  }}
                />
              )}
            </div>
            <div
              style={{
                flex: 1,
                background: "#0a0a0a",
                border: "1px solid #1a1a1a",
                padding: "18px 22px",
                marginBottom: 4,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  gap: 12,
                }}
              >
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      fontFamily: T.b,
                      fontSize: 13,
                      color: C.wh,
                      fontWeight: 600,
                      marginBottom: 4,
                    }}
                  >
                    {e.title}
                  </div>
                  <div style={{ fontFamily: T.b, fontSize: 10, color: C.g6 }}>
                    {e.owner} · {e.country} · {fmt.dt(e.date)}
                  </div>
                  {e.description && (
                    <div
                      style={{
                        fontFamily: T.b,
                        fontSize: 12,
                        color: C.g4,
                        marginTop: 8,
                      }}
                    >
                      {e.description}
                    </div>
                  )}
                  {(e.beforeState || e.afterState) && (
                    <div style={{ display: "flex", gap: 16, marginTop: 8 }}>
                      {e.beforeState && (
                        <span
                          style={{ fontSize: 11, color: C.g6, fontFamily: T.b }}
                        >
                          Before: {e.beforeState}
                        </span>
                      )}
                      {e.afterState && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#CCFF00",
                            fontFamily: T.b,
                          }}
                        >
                          → {e.afterState}
                        </span>
                      )}
                      {e.value > 0 && (
                        <span
                          style={{
                            fontSize: 11,
                            color: "#CCFF00",
                            fontFamily: T.b,
                            fontWeight: 600,
                          }}
                        >
                          {fmt.k(Number(e.value))}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div
                  style={{
                    display: "flex",
                    gap: 8,
                    alignItems: "center",
                    flexShrink: 0,
                  }}
                >
                  <Pill label={e.type} color="#CCFF00" />
                  <Btn size="sm" variant="ghost" onClick={() => openEdit(e)}>
                    Edit
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => del(e.id)}>
                    Del
                  </Btn>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {modal && (
        <Modal
          title={editing ? "Edit Entry" : "New Audit Entry"}
          onClose={() => setModal(false)}
          onSave={save}
        >
          <FInput
            label="Entry Type"
            value={form.type}
            onChange={f("type")}
            opts={AUDIT_TYPES}
            required
          />
          <FInput
            label="Title"
            value={form.title}
            onChange={f("title")}
            required
          />
          <FInput
            label="Description"
            value={form.description}
            onChange={f("description")}
          />
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Owner"
              value={form.owner}
              onChange={f("owner")}
              half
            />
            <FInput
              label="Date"
              value={form.date}
              onChange={f("date")}
              type="date"
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Country"
              value={form.country}
              onChange={f("country")}
              half
            />
            <FInput
              label="Module"
              value={form.module}
              onChange={f("module")}
              half
            />
          </div>
          <FInput
            label="Financial Value (£)"
            value={form.value}
            onChange={f("value")}
            type="number"
          />
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Before State"
              value={form.beforeState}
              onChange={f("beforeState")}
              half
            />
            <FInput
              label="After State"
              value={form.afterState}
              onChange={f("afterState")}
              half
            />
          </div>
          <FInput
            label="Attachment URL"
            value={form.attachmentUrl}
            onChange={f("attachmentUrl")}
          />
          <FInput label="Notes" value={form.notes} onChange={f("notes")} />
        </Modal>
      )}
    </div>
  );
};

const SpendTracker = ({ entries, setEntries, addAudit }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = {
    title: "",
    amount: "",
    currency: "GBP",
    category: "",
    country: "",
    team: "",
    owner: "",
    vendor: "",
    date: ds(new Date()),
    recurring: "No",
    initiative: "",
    notes: "",
  };
  const [form, setForm] = useState(blank);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const filtered = entries.filter(
    (e) =>
      (!filter || e.category === filter) &&
      (!search ||
        JSON.stringify(e).toLowerCase().includes(search.toLowerCase()))
  );
  const monthly = entries
    .filter((x) => x.recurring === "Yes")
    .reduce((s, x) => s + Number(x.amount), 0);
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModal(true);
  };
  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ ...row });
    setModal(true);
  };
  const save = () => {
    const entry = {
      ...form,
      amount: Number(form.amount),
      id: editing || uid(),
    };
    if (editing)
      setEntries((p) => p.map((e) => (e.id === editing ? entry : e)));
    else {
      setEntries((p) => [entry, ...p]);
      addAudit({
        type: "Spend",
        title: form.title,
        owner: form.owner,
        value: Number(form.amount),
        country: form.country,
        module: "Spend",
      });
    }
    setModal(false);
  };
  const del = (id) => setEntries((p) => p.filter((e) => e.id !== id));
  const spendByCat = SPEND_CATS.map((cat) => ({
    name: cat,
    v: entries
      .filter((s) => s.category === cat)
      .reduce((t, s) => t + Number(s.amount), 0),
  }))
    .filter((x) => x.v > 0)
    .sort((a, b) => b.v - a.v);
  return (
    <div>
      <TopBar
        title="Spend Tracker"
        onAdd={openAdd}
        addLabel="Log Spend"
        search={search}
        onSearch={setSearch}
      />
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 2,
            marginBottom: 24,
          }}
        >
          <KPI
            label="Total Spend"
            value={fmt.k(entries.reduce((s, x) => s + Number(x.amount), 0))}
            accent
          />
          <KPI
            label="Filtered View"
            value={fmt.k(filtered.reduce((s, x) => s + Number(x.amount), 0))}
            sub={filter || "All"}
          />
          <KPI label="Monthly Recurring" value={fmt.k(monthly)} />
          <KPI label="Entries" value={entries.length} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 2,
            marginBottom: 24,
          }}
        >
          <ChartBox title="Spend by Category">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={spendByCat} margin={{ left: -20 }}>
                <XAxis dataKey="name" tick={AX} />
                <YAxis tick={AX} />
                <Tooltip {...TT} formatter={(v) => fmt.k(v)} />
                <Bar dataKey="v" fill="#CCFF00" name="Spend" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid #1e1e1e",
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: C.g6,
                fontFamily: T.b,
                marginBottom: 16,
              }}
            >
              Largest Expenses
            </div>
            {[...entries]
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 4)
              .map((l) => (
                <div key={l.id} style={{ marginBottom: 14 }}>
                  <div style={{ fontSize: 12, color: C.wh, fontFamily: T.b }}>
                    {l.title}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginTop: 4,
                    }}
                  >
                    <span
                      style={{ fontSize: 10, color: C.g6, fontFamily: T.b }}
                    >
                      {l.category}
                    </span>
                    <span
                      style={{
                        fontSize: 13,
                        color: "#CCFF00",
                        fontFamily: T.b,
                        fontWeight: 700,
                      }}
                    >
                      {fmt.k(l.amount)}
                    </span>
                  </div>
                </div>
              ))}
          </div>
        </div>
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {["All", ...SPEND_CATS].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t === "All" ? "" : t)}
              style={{
                padding: "5px 12px",
                fontFamily: T.b,
                fontSize: 9,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                background: (t === "All" ? !filter : filter === t)
                  ? "#CCFF00"
                  : "transparent",
                color: (t === "All" ? !filter : filter === t) ? "#000" : C.g4,
                border: "1px solid #1e1e1e",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e" }}>
          <DataTable
            cols={[
              {
                key: "date",
                label: "Date",
                render: (r) => fmt.dt(r.date),
                muted: true,
              },
              { key: "title", label: "Title" },
              {
                key: "amount",
                label: "Amount",
                render: (r) => (
                  <span style={{ color: "#CCFF00", fontWeight: 700 }}>
                    {fmt.cur(r.amount, r.currency)}
                  </span>
                ),
              },
              {
                key: "category",
                label: "Category",
                render: (r) => <Pill label={r.category} color={C.g4} />,
              },
              { key: "vendor", label: "Vendor", muted: true },
              { key: "owner", label: "Owner", muted: true },
              {
                key: "recurring",
                label: "Rec.",
                render: (r) => (
                  <Pill
                    label={r.recurring}
                    color={r.recurring === "Yes" ? "#CCFF00" : C.g6}
                  />
                ),
              },
            ]}
            rows={filtered}
            onEdit={openEdit}
            onDelete={del}
          />
        </div>
      </div>
      {modal && (
        <Modal
          title={editing ? "Edit Spend" : "Log Spend"}
          onClose={() => setModal(false)}
          onSave={save}
        >
          <FInput
            label="Title"
            value={form.title}
            onChange={f("title")}
            required
          />
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Amount"
              value={form.amount}
              onChange={f("amount")}
              type="number"
              half
              required
            />
            <FInput
              label="Currency"
              value={form.currency}
              onChange={f("currency")}
              opts={["GBP", "EUR", "USD"]}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Category"
              value={form.category}
              onChange={f("category")}
              opts={SPEND_CATS}
              half
            />
            <FInput
              label="Country"
              value={form.country}
              onChange={f("country")}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput label="Team" value={form.team} onChange={f("team")} half />
            <FInput
              label="Owner"
              value={form.owner}
              onChange={f("owner")}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Vendor"
              value={form.vendor}
              onChange={f("vendor")}
              half
            />
            <FInput
              label="Date"
              value={form.date}
              onChange={f("date")}
              type="date"
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Recurring"
              value={form.recurring}
              onChange={f("recurring")}
              opts={["Yes", "No"]}
              half
            />
            <FInput
              label="Initiative"
              value={form.initiative}
              onChange={f("initiative")}
              half
            />
          </div>
          <FInput label="Notes" value={form.notes} onChange={f("notes")} />
        </Modal>
      )}
    </div>
  );
};

const CapTable = ({ entries, setEntries }) => {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [scenario, setScenario] = useState({ raise: "", val: "" });
  const blank = {
    stakeholder: "",
    type: "",
    round: "Seed",
    date: ds(new Date()),
    amountInvested: "",
    equity: "",
    instrument: "Equity",
    notes: "",
    beforeOwnership: "",
    afterOwnership: "",
  };
  const [form, setForm] = useState(blank);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const totalPct = entries.reduce((s, e) => s + Number(e.equity), 0);
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModal(true);
  };
  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ ...row });
    setModal(true);
  };
  const save = () => {
    editing
      ? setEntries((p) =>
          p.map((e) => (e.id === editing ? { ...form, id: editing } : e))
        )
      : setEntries((p) => [...p, { ...form, id: uid() }]);
    setModal(false);
  };
  const del = (id) => setEntries((p) => p.filter((e) => e.id !== id));
  const newPct =
    scenario.raise && scenario.val
      ? ((Number(scenario.raise) / Number(scenario.val)) * 100).toFixed(1)
      : null;
  const PIE_COLORS = [
    "#CCFF00",
    "#FFA500",
    "#FFD700",
    "#88AACC",
    "#888",
    "#555",
  ];
  return (
    <div>
      <TopBar
        title="Cap Table & Equity"
        onAdd={openAdd}
        addLabel="Add Stakeholder"
      />
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 2,
            marginBottom: 24,
          }}
        >
          <KPI
            label="Equity Allocated"
            value={`${totalPct.toFixed(1)}%`}
            accent
          />
          <KPI label="Unallocated" value={`${(100 - totalPct).toFixed(1)}%`} />
          <KPI
            label="Total Invested"
            value={fmt.k(
              entries.reduce((s, x) => s + Number(x.amountInvested || 0), 0)
            )}
          />
          <KPI label="Stakeholders" value={entries.length} />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 2,
            marginBottom: 24,
          }}
        >
          <ChartBox title="Ownership Breakdown">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={entries.map((e) => ({
                    name: e.stakeholder,
                    value: Number(e.equity),
                  }))}
                  cx="50%"
                  cy="50%"
                  innerRadius={50}
                  outerRadius={90}
                  dataKey="value"
                  label={({ name, value }) => `${name.split(" ")[0]} ${value}%`}
                  labelLine={false}
                >
                  {entries.map((e, i) => (
                    <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip {...TT} formatter={(v) => `${v}%`} />
              </PieChart>
            </ResponsiveContainer>
          </ChartBox>
          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid #1e1e1e",
              padding: 24,
            }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: C.g6,
                fontFamily: T.b,
                marginBottom: 16,
              }}
            >
              Scenario Modeller
            </div>
            <FInput
              label="Raise Amount (£)"
              value={scenario.raise}
              onChange={(v) => setScenario((p) => ({ ...p, raise: v }))}
              type="number"
              placeholder="e.g. 5000000"
            />
            <FInput
              label="Post-Money Valuation (£)"
              value={scenario.val}
              onChange={(v) => setScenario((p) => ({ ...p, val: v }))}
              type="number"
              placeholder="e.g. 20000000"
            />
            {newPct && (
              <div
                style={{
                  marginTop: 16,
                  padding: 16,
                  background: "#111",
                  border: "1px solid #CCFF0033",
                }}
              >
                <div
                  style={{
                    fontSize: 10,
                    color: C.g4,
                    fontFamily: T.b,
                    marginBottom: 8,
                    letterSpacing: 2,
                    textTransform: "uppercase",
                  }}
                >
                  New Round Impact
                </div>
                <div
                  style={{
                    fontSize: 28,
                    fontFamily: T.d,
                    color: "#CCFF00",
                    letterSpacing: 1,
                  }}
                >
                  {newPct}% new shares
                </div>
                {entries
                  .filter((e) => e.type === "Founder")
                  .map((e) => (
                    <div
                      key={e.id}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        marginTop: 10,
                      }}
                    >
                      <span
                        style={{ fontSize: 11, color: C.g4, fontFamily: T.b }}
                      >
                        {e.stakeholder}
                      </span>
                      <span
                        style={{ fontSize: 11, color: C.wh, fontFamily: T.b }}
                      >
                        {(Number(e.equity) * (1 - newPct / 100)).toFixed(1)}%{" "}
                        <span style={{ color: "#ff5555" }}>
                          (-{((Number(e.equity) * newPct) / 100).toFixed(1)}%)
                        </span>
                      </span>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
        <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e" }}>
          <DataTable
            cols={[
              { key: "stakeholder", label: "Stakeholder" },
              {
                key: "type",
                label: "Type",
                render: (r) => (
                  <Pill
                    label={r.type}
                    color={r.type === "Founder" ? "#CCFF00" : C.g4}
                  />
                ),
              },
              { key: "round", label: "Round" },
              {
                key: "instrument",
                label: "Instrument",
                render: (r) => <Pill label={r.instrument} color={C.g6} />,
              },
              {
                key: "amountInvested",
                label: "Invested",
                render: (r) =>
                  r.amountInvested > 0 ? (
                    <span style={{ color: "#CCFF00" }}>
                      {fmt.k(r.amountInvested)}
                    </span>
                  ) : (
                    "—"
                  ),
              },
              {
                key: "equity",
                label: "Equity %",
                render: (r) => (
                  <span style={{ color: "#CCFF00", fontWeight: 700 }}>
                    {r.equity}%
                  </span>
                ),
              },
              {
                key: "date",
                label: "Date",
                render: (r) => fmt.dt(r.date),
                muted: true,
              },
            ]}
            rows={entries}
            onEdit={openEdit}
            onDelete={del}
          />
        </div>
      </div>
      {modal && (
        <Modal
          title={editing ? "Edit Stakeholder" : "Add Stakeholder"}
          onClose={() => setModal(false)}
          onSave={save}
        >
          <FInput
            label="Name"
            value={form.stakeholder}
            onChange={f("stakeholder")}
            required
          />
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Type"
              value={form.type}
              onChange={f("type")}
              opts={STAKEHOLDER_TYPES}
              half
            />
            <FInput
              label="Round"
              value={form.round}
              onChange={f("round")}
              opts={["Founder", "Pre-Seed", "Seed", "Series A", "Series B"]}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Equity %"
              value={form.equity}
              onChange={f("equity")}
              type="number"
              half
              required
            />
            <FInput
              label="Invested (£)"
              value={form.amountInvested}
              onChange={f("amountInvested")}
              type="number"
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Instrument"
              value={form.instrument}
              onChange={f("instrument")}
              opts={INSTRUMENTS}
              half
            />
            <FInput
              label="Date"
              value={form.date}
              onChange={f("date")}
              type="date"
              half
            />
          </div>
          <FInput label="Notes" value={form.notes} onChange={f("notes")} />
        </Modal>
      )}
    </div>
  );
};

const InvestorPipeline = ({ entries, setEntries, addAudit }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = {
    name: "",
    type: "",
    stage: "Intro",
    ticket: "",
    status: "Active",
    lastContact: ds(new Date()),
    nextStep: "",
    owner: "",
    notes: "",
  };
  const [form, setForm] = useState(blank);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const active = entries.filter(
    (e) => e.status === "Active" && e.stage !== "Lost"
  );
  const filtered = entries.filter(
    (e) =>
      (!filter || e.stage === filter) &&
      (!search ||
        JSON.stringify(e).toLowerCase().includes(search.toLowerCase()))
  );
  const weightedRaise = active.reduce((s, i) => {
    const w = {
      Committed: 0.9,
      Negotiation: 0.7,
      Diligence: 0.5,
      "Materials Sent": 0.3,
      "First Call": 0.2,
      Intro: 0.1,
    };
    return s + Number(i.ticket) * (w[i.stage] || 0.1);
  }, 0);
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModal(true);
  };
  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ ...row });
    setModal(true);
  };
  const save = () => {
    const entry = {
      ...form,
      ticket: Number(form.ticket),
      id: editing || uid(),
    };
    if (editing)
      setEntries((p) => p.map((e) => (e.id === editing ? entry : e)));
    else {
      setEntries((p) => [entry, ...p]);
      addAudit({
        type: "Investment",
        title: `Investor: ${form.name}`,
        owner: form.owner,
        value: Number(form.ticket),
        module: "Investors",
      });
    }
    setModal(false);
  };
  const del = (id) => setEntries((p) => p.filter((e) => e.id !== id));
  return (
    <div>
      <TopBar
        title="Investor Pipeline"
        onAdd={openAdd}
        addLabel="Add Investor"
        search={search}
        onSearch={setSearch}
      />
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 2,
            marginBottom: 24,
          }}
        >
          <KPI label="Active Investors" value={active.length} accent />
          <KPI
            label="Total Pipeline"
            value={fmt.k(active.reduce((s, i) => s + i.ticket, 0))}
          />
          <KPI label="Weighted Raise" value={fmt.k(weightedRaise)} accent />
          <KPI
            label="Committed"
            value={entries.filter((i) => i.stage === "Committed").length}
          />
        </div>
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {["All", ...INV_STAGES].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t === "All" ? "" : t)}
              style={{
                padding: "5px 12px",
                fontFamily: T.b,
                fontSize: 9,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                background: (t === "All" ? !filter : filter === t)
                  ? "#CCFF00"
                  : "transparent",
                color: (t === "All" ? !filter : filter === t) ? "#000" : C.g4,
                border: "1px solid #1e1e1e",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div
          style={{
            background: "#0a0a0a",
            border: "1px solid #1e1e1e",
            marginBottom: 24,
          }}
        >
          <DataTable
            cols={[
              { key: "name", label: "Investor" },
              {
                key: "type",
                label: "Type",
                render: (r) => <Pill label={r.type} color={C.g4} />,
              },
              {
                key: "stage",
                label: "Stage",
                render: (r) => (
                  <Pill label={r.stage} color={stagePill(r.stage)} />
                ),
              },
              {
                key: "ticket",
                label: "Ticket",
                render: (r) => (
                  <span style={{ color: "#CCFF00", fontWeight: 700 }}>
                    {fmt.k(r.ticket)}
                  </span>
                ),
              },
              {
                key: "lastContact",
                label: "Last Contact",
                render: (r) => fmt.dt(r.lastContact),
                muted: true,
              },
              { key: "nextStep", label: "Next Step", wrap: true, muted: true },
              { key: "owner", label: "Owner", muted: true },
            ]}
            rows={filtered}
            onEdit={openEdit}
            onDelete={del}
          />
        </div>
        <div
          style={{
            background: "#0a0a0a",
            border: "1px solid #1e1e1e",
            padding: 24,
          }}
        >
          <div
            style={{
              fontSize: 9,
              letterSpacing: 3,
              textTransform: "uppercase",
              color: C.g6,
              fontFamily: T.b,
              marginBottom: 14,
            }}
          >
            Next Actions Required
          </div>
          {entries
            .filter(
              (i) => i.nextStep && i.status === "Active" && i.stage !== "Lost"
            )
            .map((i) => (
              <div
                key={i.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "10px 0",
                  borderBottom: "1px solid #111",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 12,
                      color: C.wh,
                      fontFamily: T.b,
                      fontWeight: 500,
                    }}
                  >
                    {i.name}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: C.g4,
                      fontFamily: T.b,
                      marginLeft: 12,
                    }}
                  >
                    {i.nextStep}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
                  <Pill label={i.stage} color={stagePill(i.stage)} />
                  <span style={{ fontSize: 11, color: C.g6, fontFamily: T.b }}>
                    {i.owner}
                  </span>
                </div>
              </div>
            ))}
        </div>
      </div>
      {modal && (
        <Modal
          title={editing ? "Edit Investor" : "Add Investor"}
          onClose={() => setModal(false)}
          onSave={save}
        >
          <FInput
            label="Name"
            value={form.name}
            onChange={f("name")}
            required
          />
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Type"
              value={form.type}
              onChange={f("type")}
              opts={INV_TYPES}
              half
            />
            <FInput
              label="Stage"
              value={form.stage}
              onChange={f("stage")}
              opts={INV_STAGES}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Ticket (£)"
              value={form.ticket}
              onChange={f("ticket")}
              type="number"
              half
            />
            <FInput
              label="Status"
              value={form.status}
              onChange={f("status")}
              opts={["Active", "Inactive", "On Hold"]}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Last Contact"
              value={form.lastContact}
              onChange={f("lastContact")}
              type="date"
              half
            />
            <FInput
              label="Owner"
              value={form.owner}
              onChange={f("owner")}
              half
            />
          </div>
          <FInput
            label="Next Step"
            value={form.nextStep}
            onChange={f("nextStep")}
          />
          <FInput label="Notes" value={form.notes} onChange={f("notes")} />
        </Modal>
      )}
    </div>
  );
};

const DealPipeline = ({ entries, setEntries, addAudit }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = {
    company: "",
    country: "",
    stage: "Target",
    model: "Revenue Share",
    value: "",
    probability: 30,
    signDate: "",
    liveDate: "",
    owner: "",
    notes: "",
  };
  const [form, setForm] = useState(blank);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const active = entries.filter((d) => d.stage !== "Lost");
  const weighted = active.reduce(
    (s, d) => s + (Number(d.value) * Number(d.probability)) / 100,
    0
  );
  const filtered = entries.filter(
    (e) =>
      (!filter || e.stage === filter) &&
      (!search ||
        JSON.stringify(e).toLowerCase().includes(search.toLowerCase()))
  );
  const closingSoon = entries.filter(
    (d) =>
      d.stage !== "Lost" &&
      d.signDate &&
      new Date(d.signDate) <= new Date(fwd(45))
  );
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModal(true);
  };
  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ ...row });
    setModal(true);
  };
  const save = () => {
    const entry = {
      ...form,
      value: Number(form.value),
      probability: Number(form.probability),
      id: editing || uid(),
    };
    if (editing)
      setEntries((p) => p.map((e) => (e.id === editing ? entry : e)));
    else {
      setEntries((p) => [entry, ...p]);
      addAudit({
        type: "Deal Update",
        title: `New Deal: ${form.company}`,
        owner: form.owner,
        value: Number(form.value),
        country: form.country,
        module: "Deals",
      });
    }
    setModal(false);
  };
  const del = (id) => setEntries((p) => p.filter((e) => e.id !== id));
  return (
    <div>
      <TopBar
        title="Deal Pipeline"
        onAdd={openAdd}
        addLabel="Add Deal"
        search={search}
        onSearch={setSearch}
      />
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 2,
            marginBottom: 24,
          }}
        >
          <KPI
            label="Total Pipeline"
            value={fmt.k(active.reduce((s, d) => s + d.value, 0))}
            accent
          />
          <KPI label="Weighted Value" value={fmt.k(weighted)} />
          <KPI label="Active Deals" value={active.length} />
          <KPI label="Closing ≤45 Days" value={closingSoon.length} accent />
        </div>
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {["All", ...DEAL_STAGES].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t === "All" ? "" : t)}
              style={{
                padding: "5px 12px",
                fontFamily: T.b,
                fontSize: 9,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                background: (t === "All" ? !filter : filter === t)
                  ? "#CCFF00"
                  : "transparent",
                color: (t === "All" ? !filter : filter === t) ? "#000" : C.g4,
                border: "1px solid #1e1e1e",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div
          style={{
            background: "#0a0a0a",
            border: "1px solid #1e1e1e",
            marginBottom: 16,
          }}
        >
          <DataTable
            cols={[
              { key: "company", label: "Company" },
              { key: "country", label: "Country", muted: true },
              {
                key: "stage",
                label: "Stage",
                render: (r) => (
                  <Pill label={r.stage} color={stagePill(r.stage)} />
                ),
              },
              {
                key: "model",
                label: "Model",
                render: (r) => <Pill label={r.model} color={C.g6} />,
              },
              {
                key: "value",
                label: "Value",
                render: (r) => (
                  <span style={{ color: "#CCFF00", fontWeight: 700 }}>
                    {fmt.k(r.value)}
                  </span>
                ),
              },
              {
                key: "probability",
                label: "Prob.",
                render: (r) => (
                  <span
                    style={{
                      color:
                        r.probability >= 75
                          ? "#CCFF00"
                          : r.probability >= 50
                          ? "#FFA500"
                          : C.g4,
                    }}
                  >
                    {r.probability}%
                  </span>
                ),
              },
              {
                key: "signDate",
                label: "Sign Date",
                render: (r) => fmt.dt(r.signDate),
                muted: true,
              },
              { key: "owner", label: "Owner", muted: true },
            ]}
            rows={filtered}
            onEdit={openEdit}
            onDelete={del}
          />
        </div>
        {closingSoon.length > 0 && (
          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid #CCFF0033",
              padding: 20,
            }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#CCFF00",
                fontFamily: T.b,
                marginBottom: 12,
              }}
            >
              ⚡ Closing in Next 45 Days
            </div>
            {closingSoon.map((d) => (
              <div
                key={d.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  padding: "8px 0",
                  borderBottom: "1px solid #111",
                }}
              >
                <div>
                  <span
                    style={{
                      fontSize: 13,
                      color: C.wh,
                      fontFamily: T.b,
                      fontWeight: 600,
                    }}
                  >
                    {d.company}
                  </span>
                  <span
                    style={{
                      fontSize: 11,
                      color: C.g4,
                      fontFamily: T.b,
                      marginLeft: 12,
                    }}
                  >
                    Sign: {fmt.dt(d.signDate)}
                  </span>
                </div>
                <div style={{ display: "flex", gap: 10 }}>
                  <Pill label={d.stage} color={stagePill(d.stage)} />
                  <span
                    style={{
                      fontSize: 13,
                      color: "#CCFF00",
                      fontFamily: T.b,
                      fontWeight: 700,
                    }}
                  >
                    {fmt.k(d.value)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      {modal && (
        <Modal
          title={editing ? "Edit Deal" : "Add Deal"}
          onClose={() => setModal(false)}
          onSave={save}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Company"
              value={form.company}
              onChange={f("company")}
              half
              required
            />
            <FInput
              label="Country"
              value={form.country}
              onChange={f("country")}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Stage"
              value={form.stage}
              onChange={f("stage")}
              opts={DEAL_STAGES}
              half
            />
            <FInput
              label="Model"
              value={form.model}
              onChange={f("model")}
              opts={[
                "Revenue Share",
                "API Licence",
                "White Label",
                "SaaS",
                "One-Time",
              ]}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Value (£)"
              value={form.value}
              onChange={f("value")}
              type="number"
              half
              required
            />
            <FInput
              label="Probability %"
              value={form.probability}
              onChange={f("probability")}
              type="number"
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Sign Date"
              value={form.signDate}
              onChange={f("signDate")}
              type="date"
              half
            />
            <FInput
              label="Go-Live Date"
              value={form.liveDate}
              onChange={f("liveDate")}
              type="date"
              half
            />
          </div>
          <FInput label="Owner" value={form.owner} onChange={f("owner")} />
          <FInput label="Notes" value={form.notes} onChange={f("notes")} />
        </Modal>
      )}
    </div>
  );
};

const MarketExpansion = ({ entries, setEntries, addAudit }) => {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = {
    country: "",
    status: "Research",
    targetLaunch: "",
    licenceStatus: "Not Applied",
    partnerStatus: "None",
    readiness: 0,
    blocker: "",
    owner: "",
    notes: "",
  };
  const [form, setForm] = useState(blank);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModal(true);
  };
  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ ...row });
    setModal(true);
  };
  const save = () => {
    const entry = {
      ...form,
      readiness: Number(form.readiness),
      id: editing || uid(),
    };
    if (editing)
      setEntries((p) => p.map((e) => (e.id === editing ? entry : e)));
    else {
      setEntries((p) => [...p, entry]);
      addAudit({
        type: "Market Launch",
        title: `Market: ${form.country}`,
        owner: form.owner,
        module: "Markets",
      });
    }
    setModal(false);
  };
  const del = (id) => setEntries((p) => p.filter((e) => e.id !== id));
  return (
    <div>
      <TopBar title="Market Expansion" onAdd={openAdd} addLabel="Add Market" />
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: 2,
            marginBottom: 24,
          }}
        >
          {MKT_STATUSES.map((s) => (
            <KPI
              key={s}
              label={s}
              value={entries.filter((m) => m.status === s).length}
              sub="markets"
              accent={s === "Live"}
            />
          ))}
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(2,1fr)",
            gap: 2,
          }}
        >
          {entries.map((m) => (
            <div
              key={m.id}
              style={{
                background: "#0a0a0a",
                border: "1px solid #1e1e1e",
                padding: 22,
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "flex-start",
                  marginBottom: 14,
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 16,
                      fontFamily: T.d,
                      color: C.wh,
                      letterSpacing: 0.5,
                    }}
                  >
                    {m.country}
                  </div>
                  <div
                    style={{
                      fontSize: 10,
                      color: C.g6,
                      fontFamily: T.b,
                      marginTop: 2,
                    }}
                  >
                    {m.owner}
                  </div>
                </div>
                <div style={{ display: "flex", gap: 6 }}>
                  <Pill label={m.status} color={stagePill(m.status)} />
                  <Btn size="sm" variant="ghost" onClick={() => openEdit(m)}>
                    Edit
                  </Btn>
                  <Btn size="sm" variant="danger" onClick={() => del(m.id)}>
                    Del
                  </Btn>
                </div>
              </div>
              <div style={{ marginBottom: 12 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    marginBottom: 6,
                  }}
                >
                  <span
                    style={{
                      fontSize: 9,
                      color: C.g6,
                      fontFamily: T.b,
                      letterSpacing: 1.5,
                      textTransform: "uppercase",
                    }}
                  >
                    Readiness
                  </span>
                  <span
                    style={{
                      fontSize: 12,
                      color: "#CCFF00",
                      fontFamily: T.b,
                      fontWeight: 700,
                    }}
                  >
                    {m.readiness}%
                  </span>
                </div>
                <div
                  style={{ height: 3, background: "#1a1a1a", borderRadius: 2 }}
                >
                  <div
                    style={{
                      width: `${m.readiness}%`,
                      height: "100%",
                      background: stagePill(m.status),
                      borderRadius: 2,
                    }}
                  />
                </div>
              </div>
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: 8,
                }}
              >
                {[
                  ["Licence", m.licenceStatus],
                  ["Partner", m.partnerStatus],
                  ["Launch", fmt.dt(m.targetLaunch)],
                  ["Blocker", m.blocker || "None"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div
                      style={{
                        fontSize: 9,
                        color: C.g6,
                        fontFamily: T.b,
                        letterSpacing: 1.5,
                        textTransform: "uppercase",
                      }}
                    >
                      {l}
                    </div>
                    <div
                      style={{
                        fontSize: 11,
                        color:
                          l === "Blocker" && v !== "None" ? "#FFA500" : C.wh,
                        fontFamily: T.b,
                        marginTop: 3,
                      }}
                    >
                      {v}
                    </div>
                  </div>
                ))}
              </div>
              {m.notes && (
                <div
                  style={{
                    marginTop: 10,
                    fontSize: 11,
                    color: C.g4,
                    fontFamily: T.b,
                    fontStyle: "italic",
                  }}
                >
                  {m.notes}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
      {modal && (
        <Modal
          title={editing ? "Edit Market" : "Add Market"}
          onClose={() => setModal(false)}
          onSave={save}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Country"
              value={form.country}
              onChange={f("country")}
              half
              required
            />
            <FInput
              label="Status"
              value={form.status}
              onChange={f("status")}
              opts={MKT_STATUSES}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Target Launch"
              value={form.targetLaunch}
              onChange={f("targetLaunch")}
              type="date"
              half
            />
            <FInput
              label="Readiness %"
              value={form.readiness}
              onChange={f("readiness")}
              type="number"
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Licence Status"
              value={form.licenceStatus}
              onChange={f("licenceStatus")}
              opts={[
                "Not Applied",
                "In Progress",
                "Pending",
                "Obtained",
                "Rejected",
              ]}
              half
            />
            <FInput
              label="Partner Status"
              value={form.partnerStatus}
              onChange={f("partnerStatus")}
              opts={["None", "Identified", "Negotiating", "Active"]}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Blocker"
              value={form.blocker}
              onChange={f("blocker")}
              half
            />
            <FInput
              label="Owner"
              value={form.owner}
              onChange={f("owner")}
              half
            />
          </div>
          <FInput label="Notes" value={form.notes} onChange={f("notes")} />
        </Modal>
      )}
    </div>
  );
};

const ProductLog = ({ entries, setEntries, addAudit }) => {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = {
    feature: "",
    type: "",
    status: "Planned",
    releaseDate: "",
    owner: "",
    impact: "Medium",
    notes: "",
  };
  const [form, setForm] = useState(blank);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const filtered = [...entries]
    .sort((a, b) => new Date(b.releaseDate || 0) - new Date(a.releaseDate || 0))
    .filter(
      (e) =>
        (!filter || e.status === filter) &&
        (!search ||
          JSON.stringify(e).toLowerCase().includes(search.toLowerCase()))
    );
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModal(true);
  };
  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ ...row });
    setModal(true);
  };
  const save = () => {
    const entry = { ...form, id: editing || uid() };
    if (editing)
      setEntries((p) => p.map((e) => (e.id === editing ? entry : e)));
    else {
      setEntries((p) => [entry, ...p]);
      if (form.status === "Live")
        addAudit({
          type: "Product Release",
          title: `Released: ${form.feature}`,
          owner: form.owner,
          module: "Product",
        });
    }
    setModal(false);
  };
  const del = (id) => setEntries((p) => p.filter((e) => e.id !== id));
  return (
    <div>
      <TopBar
        title="Product Log"
        onAdd={openAdd}
        addLabel="Log Feature"
        search={search}
        onSearch={setSearch}
      />
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 2,
            marginBottom: 24,
          }}
        >
          {PROD_STATUSES.map((s) => (
            <KPI
              key={s}
              label={s}
              value={entries.filter((e) => e.status === s).length}
              sub="features"
              accent={s === "Live"}
            />
          ))}
        </div>
        <div
          style={{
            display: "flex",
            gap: 2,
            marginBottom: 20,
            flexWrap: "wrap",
          }}
        >
          {["All", ...PROD_STATUSES].map((t) => (
            <button
              key={t}
              onClick={() => setFilter(t === "All" ? "" : t)}
              style={{
                padding: "5px 12px",
                fontFamily: T.b,
                fontSize: 9,
                letterSpacing: 1.5,
                textTransform: "uppercase",
                background: (t === "All" ? !filter : filter === t)
                  ? "#CCFF00"
                  : "transparent",
                color: (t === "All" ? !filter : filter === t) ? "#000" : C.g4,
                border: "1px solid #1e1e1e",
                cursor: "pointer",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e" }}>
          <DataTable
            cols={[
              {
                key: "releaseDate",
                label: "Date",
                render: (r) => fmt.dt(r.releaseDate),
                muted: true,
              },
              { key: "feature", label: "Feature" },
              {
                key: "type",
                label: "Type",
                render: (r) => <Pill label={r.type} color={C.g4} />,
              },
              {
                key: "status",
                label: "Status",
                render: (r) => (
                  <Pill label={r.status} color={stagePill(r.status)} />
                ),
              },
              {
                key: "impact",
                label: "Impact",
                render: (r) => (
                  <Pill
                    label={r.impact}
                    color={
                      r.impact === "Critical"
                        ? "#ff4444"
                        : r.impact === "High"
                        ? "#CCFF00"
                        : "#FFA500"
                    }
                  />
                ),
              },
              { key: "owner", label: "Owner", muted: true },
              { key: "notes", label: "Notes", wrap: true, muted: true },
            ]}
            rows={filtered}
            onEdit={openEdit}
            onDelete={del}
          />
        </div>
      </div>
      {modal && (
        <Modal
          title={editing ? "Edit Feature" : "Log Feature"}
          onClose={() => setModal(false)}
          onSave={save}
        >
          <FInput
            label="Feature Name"
            value={form.feature}
            onChange={f("feature")}
            required
          />
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Type"
              value={form.type}
              onChange={f("type")}
              opts={PROD_TYPES}
              half
            />
            <FInput
              label="Status"
              value={form.status}
              onChange={f("status")}
              opts={PROD_STATUSES}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Release Date"
              value={form.releaseDate}
              onChange={f("releaseDate")}
              type="date"
              half
            />
            <FInput
              label="Impact"
              value={form.impact}
              onChange={f("impact")}
              opts={["Low", "Medium", "High", "Critical"]}
              half
            />
          </div>
          <FInput label="Owner" value={form.owner} onChange={f("owner")} />
          <FInput label="Notes" value={form.notes} onChange={f("notes")} />
        </Modal>
      )}
    </div>
  );
};

const RiskRegister = ({ entries, setEntries, addAudit }) => {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = {
    title: "",
    category: "Regulatory",
    severity: "Medium",
    likelihood: "Medium",
    owner: "",
    mitigation: "",
    status: "Open",
    reviewDate: "",
    notes: "",
  };
  const [form, setForm] = useState(blank);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const overdue = entries.filter(
    (r) =>
      r.reviewDate && new Date(r.reviewDate) < new Date() && r.status === "Open"
  );
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModal(true);
  };
  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ ...row });
    setModal(true);
  };
  const save = () => {
    const entry = { ...form, id: editing || uid() };
    if (editing)
      setEntries((p) => p.map((e) => (e.id === editing ? entry : e)));
    else {
      setEntries((p) => [entry, ...p]);
      addAudit({
        type: "Risk Update",
        title: `New Risk: ${form.title}`,
        owner: form.owner,
        module: "Risks",
      });
    }
    setModal(false);
  };
  const del = (id) => setEntries((p) => p.filter((e) => e.id !== id));
  return (
    <div>
      <TopBar title="Risk Register" onAdd={openAdd} addLabel="Log Risk" />
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 2,
            marginBottom: 24,
          }}
        >
          <KPI
            label="Open Risks"
            value={entries.filter((r) => r.status === "Open").length}
            accent
          />
          <KPI
            label="High / Critical"
            value={
              entries.filter(
                (r) =>
                  ["High", "Critical"].includes(r.severity) &&
                  r.status === "Open"
              ).length
            }
          />
          <KPI label="Overdue Reviews" value={overdue.length} accent />
          <KPI
            label="Mitigated"
            value={entries.filter((r) => r.status === "Mitigated").length}
          />
        </div>
        {overdue.length > 0 && (
          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid #ff444433",
              padding: 18,
              marginBottom: 20,
            }}
          >
            <div
              style={{
                fontSize: 9,
                letterSpacing: 3,
                textTransform: "uppercase",
                color: "#ff5555",
                fontFamily: T.b,
                marginBottom: 10,
              }}
            >
              ⚠ Overdue Reviews
            </div>
            {overdue.map((r) => (
              <div
                key={r.id}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 8,
                }}
              >
                <span style={{ fontSize: 12, color: C.wh, fontFamily: T.b }}>
                  {r.title}
                </span>
                <div style={{ display: "flex", gap: 8 }}>
                  <Pill label={r.severity} color={stagePill(r.severity)} />
                  <span
                    style={{ fontSize: 11, color: "#ff5555", fontFamily: T.b }}
                  >
                    Due {fmt.dt(r.reviewDate)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
        <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e" }}>
          <DataTable
            cols={[
              { key: "title", label: "Risk Title" },
              {
                key: "category",
                label: "Category",
                render: (r) => <Pill label={r.category} color={C.g4} />,
              },
              {
                key: "severity",
                label: "Severity",
                render: (r) => (
                  <Pill label={r.severity} color={stagePill(r.severity)} />
                ),
              },
              {
                key: "likelihood",
                label: "Likelihood",
                render: (r) => (
                  <Pill label={r.likelihood} color={stagePill(r.likelihood)} />
                ),
              },
              {
                key: "status",
                label: "Status",
                render: (r) => (
                  <Pill label={r.status} color={stagePill(r.status)} />
                ),
              },
              { key: "owner", label: "Owner", muted: true },
              {
                key: "reviewDate",
                label: "Review Date",
                render: (r) => (
                  <span
                    style={{
                      color:
                        r.reviewDate && new Date(r.reviewDate) < new Date()
                          ? "#ff5555"
                          : C.g4,
                    }}
                  >
                    {fmt.dt(r.reviewDate)}
                  </span>
                ),
              },
              {
                key: "mitigation",
                label: "Mitigation",
                wrap: true,
                muted: true,
              },
            ]}
            rows={entries}
            onEdit={openEdit}
            onDelete={del}
          />
        </div>
      </div>
      {modal && (
        <Modal
          title={editing ? "Edit Risk" : "Log Risk"}
          onClose={() => setModal(false)}
          onSave={save}
        >
          <FInput
            label="Risk Title"
            value={form.title}
            onChange={f("title")}
            required
          />
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Category"
              value={form.category}
              onChange={f("category")}
              opts={[
                "Regulatory",
                "Operational",
                "Financial",
                "Technology",
                "Legal",
                "Reputational",
              ]}
              half
            />
            <FInput
              label="Status"
              value={form.status}
              onChange={f("status")}
              opts={RISK_STATUSES}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Severity"
              value={form.severity}
              onChange={f("severity")}
              opts={RISK_SEVS}
              half
            />
            <FInput
              label="Likelihood"
              value={form.likelihood}
              onChange={f("likelihood")}
              opts={["Low", "Medium", "High"]}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Owner"
              value={form.owner}
              onChange={f("owner")}
              half
            />
            <FInput
              label="Review Date"
              value={form.reviewDate}
              onChange={f("reviewDate")}
              type="date"
              half
            />
          </div>
          <FInput
            label="Mitigation Plan"
            value={form.mitigation}
            onChange={f("mitigation")}
          />
          <FInput label="Notes" value={form.notes} onChange={f("notes")} />
        </Modal>
      )}
    </div>
  );
};

const DecisionLog = ({ entries, setEntries, addAudit }) => {
  const [search, setSearch] = useState("");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const blank = {
    title: "",
    date: ds(new Date()),
    owner: "",
    summary: "",
    rationale: "",
    alternatives: "",
    impact: "",
    notes: "",
  };
  const [form, setForm] = useState(blank);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const filtered = [...entries]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .filter(
      (e) =>
        !search ||
        JSON.stringify(e).toLowerCase().includes(search.toLowerCase())
    );
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModal(true);
  };
  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ ...row });
    setModal(true);
  };
  const save = () => {
    editing
      ? setEntries((p) =>
          p.map((e) => (e.id === editing ? { ...form, id: editing } : e))
        )
      : setEntries((p) => [{ ...form, id: uid() }, ...p]);
    addAudit({
      type: "Decision",
      title: form.title,
      owner: form.owner,
      module: "Decisions",
    });
    setModal(false);
  };
  const del = (id) => setEntries((p) => p.filter((e) => e.id !== id));
  return (
    <div>
      <TopBar
        title="Decision Log"
        onAdd={openAdd}
        addLabel="Log Decision"
        search={search}
        onSearch={setSearch}
      />
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3,1fr)",
            gap: 2,
            marginBottom: 24,
          }}
        >
          <KPI label="Total Decisions" value={entries.length} accent />
          <KPI
            label="This Quarter"
            value={
              entries.filter((e) => new Date(e.date) >= new Date(ago(90)))
                .length
            }
          />
          <KPI
            label="Decision Makers"
            value={[...new Set(entries.map((e) => e.owner))].length}
          />
        </div>
        {filtered.map((d) => (
          <div
            key={d.id}
            style={{
              background: "#0a0a0a",
              border: "1px solid #1e1e1e",
              marginBottom: 2,
            }}
          >
            <div
              style={{
                padding: "18px 22px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "flex-start",
                cursor: "pointer",
              }}
              onClick={() => setExpanded(expanded === d.id ? null : d.id)}
            >
              <div style={{ flex: 1 }}>
                <div
                  style={{
                    fontSize: 14,
                    color: C.wh,
                    fontFamily: T.b,
                    fontWeight: 600,
                  }}
                >
                  {d.title}
                </div>
                <div
                  style={{
                    fontSize: 10,
                    color: C.g6,
                    fontFamily: T.b,
                    marginTop: 4,
                  }}
                >
                  {d.owner} · {fmt.dt(d.date)}
                </div>
                {expanded !== d.id && (
                  <div
                    style={{
                      fontSize: 12,
                      color: C.g4,
                      fontFamily: T.b,
                      marginTop: 6,
                    }}
                  >
                    {d.summary}
                  </div>
                )}
              </div>
              <div style={{ display: "flex", gap: 8, marginLeft: 16 }}>
                <Btn
                  size="sm"
                  variant="ghost"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEdit(d);
                  }}
                >
                  Edit
                </Btn>
                <Btn
                  size="sm"
                  variant="danger"
                  onClick={(e) => {
                    e.stopPropagation();
                    del(d.id);
                  }}
                >
                  Del
                </Btn>
                <span style={{ color: C.g6, fontSize: 12 }}>
                  {expanded === d.id ? "▲" : "▼"}
                </span>
              </div>
            </div>
            {expanded === d.id && (
              <div
                style={{
                  padding: "0 22px 22px",
                  borderTop: "1px solid #1a1a1a",
                }}
              >
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "1fr 1fr",
                    gap: 20,
                    marginTop: 16,
                  }}
                >
                  {[
                    ["Summary", d.summary, C.wh],
                    ["Rationale", d.rationale, C.g4],
                    ["Alternatives", d.alternatives, C.g4],
                    ["Impact", d.impact, "#CCFF00"],
                  ].map(([l, v, col]) => (
                    <div key={l}>
                      <div
                        style={{
                          fontSize: 9,
                          color: C.g6,
                          fontFamily: T.b,
                          letterSpacing: 2,
                          textTransform: "uppercase",
                          marginBottom: 6,
                        }}
                      >
                        {l}
                      </div>
                      <div
                        style={{
                          fontSize: 12,
                          color: col,
                          fontFamily: T.b,
                          lineHeight: 1.6,
                        }}
                      >
                        {v}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      {modal && (
        <Modal
          title={editing ? "Edit Decision" : "Log Decision"}
          onClose={() => setModal(false)}
          onSave={save}
          wide
        >
          <FInput
            label="Title"
            value={form.title}
            onChange={f("title")}
            required
          />
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Date"
              value={form.date}
              onChange={f("date")}
              type="date"
              half
            />
            <FInput
              label="Owner"
              value={form.owner}
              onChange={f("owner")}
              half
            />
          </div>
          <FInput
            label="Summary"
            value={form.summary}
            onChange={f("summary")}
            placeholder="What was decided?"
          />
          <FInput
            label="Rationale"
            value={form.rationale}
            onChange={f("rationale")}
            placeholder="Why?"
          />
          <FInput
            label="Alternatives Considered"
            value={form.alternatives}
            onChange={f("alternatives")}
          />
          <FInput
            label="Impact"
            value={form.impact}
            onChange={f("impact")}
            placeholder="Expected outcome"
          />
          <FInput label="Notes" value={form.notes} onChange={f("notes")} />
        </Modal>
      )}
    </div>
  );
};

const People = ({ entries, setEntries, addAudit }) => {
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const blank = {
    name: "",
    role: "",
    department: "",
    changeType: "Hire",
    date: ds(new Date()),
    costImpact: "",
    manager: "",
    notes: "",
  };
  const [form, setForm] = useState(blank);
  const f = (k) => (v) => setForm((p) => ({ ...p, [k]: v }));
  const openAdd = () => {
    setEditing(null);
    setForm(blank);
    setModal(true);
  };
  const openEdit = (row) => {
    setEditing(row.id);
    setForm({ ...row });
    setModal(true);
  };
  const save = () => {
    const entry = {
      ...form,
      costImpact: Number(form.costImpact),
      id: editing || uid(),
    };
    if (editing)
      setEntries((p) => p.map((e) => (e.id === editing ? entry : e)));
    else {
      setEntries((p) => [entry, ...p]);
      addAudit({
        type: "Team Change",
        title: `${form.changeType}: ${form.name}`,
        owner: form.manager,
        module: "People",
      });
    }
    setModal(false);
  };
  const del = (id) => setEntries((p) => p.filter((e) => e.id !== id));
  const byDept = DEPTS.map((d) => ({
    name: d.slice(0, 6),
    v: entries.filter((e) => e.department === d).length,
  })).filter((x) => x.v > 0);
  return (
    <div>
      <TopBar title="People & Org" onAdd={openAdd} addLabel="Add Person" />
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(4,1fr)",
            gap: 2,
            marginBottom: 24,
          }}
        >
          <KPI label="Headcount" value={entries.length} accent />
          <KPI
            label="Annual People Cost"
            value={fmt.k(entries.reduce((s, e) => s + Number(e.costImpact), 0))}
          />
          <KPI
            label="Upcoming Hires"
            value={
              entries.filter((e) => e.changeType === "Upcoming Hire").length
            }
          />
          <KPI
            label="Departments"
            value={[...new Set(entries.map((e) => e.department))].length}
          />
        </div>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "2fr 1fr",
            gap: 2,
            marginBottom: 24,
          }}
        >
          <div style={{ background: "#0a0a0a", border: "1px solid #1e1e1e" }}>
            <DataTable
              cols={[
                { key: "name", label: "Name" },
                { key: "role", label: "Role" },
                {
                  key: "department",
                  label: "Dept",
                  render: (r) => <Pill label={r.department} color={C.g4} />,
                },
                {
                  key: "changeType",
                  label: "Status",
                  render: (r) => (
                    <Pill
                      label={r.changeType}
                      color={
                        r.changeType === "Founder"
                          ? "#CCFF00"
                          : r.changeType === "Upcoming Hire"
                          ? "#FFA500"
                          : r.changeType === "Departure"
                          ? "#ff5555"
                          : C.g4
                      }
                    />
                  ),
                },
                {
                  key: "costImpact",
                  label: "Annual Cost",
                  render: (r) => (
                    <span style={{ color: "#CCFF00" }}>
                      {fmt.k(r.costImpact)}
                    </span>
                  ),
                },
                { key: "manager", label: "Manager", muted: true },
              ]}
              rows={entries}
              onEdit={openEdit}
              onDelete={del}
            />
          </div>
          <ChartBox title="By Department">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={byDept}
                layout="vertical"
                margin={{ left: 0, right: 20 }}
              >
                <XAxis type="number" tick={AX} allowDecimals={false} />
                <YAxis type="category" dataKey="name" tick={AX} width={50} />
                <Tooltip {...TT} />
                <Bar dataKey="v" fill="#CCFF00" name="People" />
              </BarChart>
            </ResponsiveContainer>
          </ChartBox>
        </div>
      </div>
      {modal && (
        <Modal
          title={editing ? "Edit Person" : "Add Person"}
          onClose={() => setModal(false)}
          onSave={save}
        >
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Full Name"
              value={form.name}
              onChange={f("name")}
              half
              required
            />
            <FInput
              label="Role / Title"
              value={form.role}
              onChange={f("role")}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Department"
              value={form.department}
              onChange={f("department")}
              opts={DEPTS}
              half
            />
            <FInput
              label="Status"
              value={form.changeType}
              onChange={f("changeType")}
              opts={CHANGE_TYPES}
              half
            />
          </div>
          <div style={{ display: "flex", gap: 12 }}>
            <FInput
              label="Date"
              value={form.date}
              onChange={f("date")}
              type="date"
              half
            />
            <FInput
              label="Annual Cost (£)"
              value={form.costImpact}
              onChange={f("costImpact")}
              type="number"
              half
            />
          </div>
          <FInput
            label="Reports To"
            value={form.manager}
            onChange={f("manager")}
          />
          <FInput label="Notes" value={form.notes} onChange={f("notes")} />
        </Modal>
      )}
    </div>
  );
};

const Reporting = ({ data }) => {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [type, setType] = useState(null);
  const {
    spend,
    investors,
    deals,
    markets,
    products,
    risks,
    audit,
    capTable,
    decisions,
    people,
  } = data;
  const generate = async (rt) => {
    setLoading(true);
    setType(rt);
    setReport(null);
    await new Promise((r) => setTimeout(r, 900));
    const totalSpend = spend.reduce((s, x) => s + Number(x.amount), 0);
    const monthlyBurn = spend
      .filter((x) => x.recurring === "Yes")
      .reduce((s, x) => s + Number(x.amount), 0);
    const totalRaised = capTable.reduce(
      (s, x) => s + Number(x.amountInvested || 0),
      0
    );
    const weighted = deals.reduce(
      (s, d) => s + (Number(d.value) * Number(d.probability)) / 100,
      0
    );
    const activeInv = investors.filter(
      (i) => i.status === "Active" && i.stage !== "Lost"
    );
    const reports = {
      "Weekly Summary": {
        title: "Weekly Operating Summary",
        date: fmt.dt(ds(new Date())),
        sections: [
          {
            heading: "Key Activity This Week",
            items: [...audit]
              .sort((a, b) => new Date(b.date) - new Date(a.date))
              .slice(0, 5)
              .map((a) => `• [${a.type}] ${a.title} — ${a.owner}`),
          },
          {
            heading: "Deals in Motion",
            items: deals
              .filter((d) => !["Lost", "Target"].includes(d.stage))
              .map(
                (d) =>
                  `• ${d.company} (${d.stage}) — ${fmt.k(d.value)} @ ${
                    d.probability
                  }%`
              ),
          },
          {
            heading: "Product Updates",
            items: products
              .filter((p) => ["In Progress", "Beta"].includes(p.status))
              .map((p) => `• ${p.feature} [${p.status}]`),
          },
          {
            heading: "Open Risks",
            items: risks
              .filter(
                (r) =>
                  r.status === "Open" &&
                  ["High", "Critical"].includes(r.severity)
              )
              .map((r) => `• [${r.severity}] ${r.title}`),
          },
        ],
      },
      "Monthly Investor Update": {
        title: "Monthly Investor Update",
        date: fmt.dt(ds(new Date())),
        sections: [
          {
            heading: "Financial Summary",
            items: [
              `• Total Raised: ${fmt.k(totalRaised)}`,
              `• Monthly Burn: ${fmt.k(monthlyBurn)}`,
              `• Runway: ~${Math.round(
                totalRaised / (monthlyBurn || 1)
              )} months`,
              `• Total Spend: ${fmt.k(totalSpend)}`,
            ],
          },
          {
            heading: "Commercial Progress",
            items: [
              `• Pipeline: ${fmt.k(deals.reduce((s, d) => s + d.value, 0))}`,
              `• Weighted: ${fmt.k(weighted)}`,
              ...deals
                .filter((d) =>
                  ["Signed", "Legal", "Commercial"].includes(d.stage)
                )
                .map((d) => `• ${d.company}: ${d.stage} — ${fmt.k(d.value)}`),
            ],
          },
          {
            heading: "Market Expansion",
            items: markets.map(
              (m) =>
                `• ${m.country}: ${m.status} (${m.readiness}% ready)${
                  m.blocker !== "None" ? " — Blocker: " + m.blocker : ""
                }`
            ),
          },
          {
            heading: "Product Milestones",
            items: products
              .filter((p) => p.status === "Live")
              .map((p) => `• [LIVE] ${p.feature} — ${p.impact} impact`),
          },
        ],
      },
      "Board Snapshot": {
        title: "Board Snapshot",
        date: fmt.dt(ds(new Date())),
        sections: [
          {
            heading: "Company Status",
            items: [
              `• Capital Raised: ${fmt.k(totalRaised)}`,
              `• Monthly Burn: ${fmt.k(monthlyBurn)}`,
              `• Headcount: ${people.length}`,
              `• Active Markets: ${
                markets.filter((m) => m.status === "Live").length
              }`,
            ],
          },
          {
            heading: "Cap Table",
            items: capTable.map(
              (c) =>
                `• ${c.stakeholder} (${c.type}): ${c.equity}% — ${c.instrument}`
            ),
          },
          {
            heading: "Fundraising",
            items: [
              `• Active: ${activeInv.length} investors`,
              `• Pipeline: ${fmt.k(
                activeInv.reduce((s, i) => s + i.ticket, 0)
              )}`,
              ...investors
                .filter((i) => ["Committed", "Negotiation"].includes(i.stage))
                .map((i) => `• ${i.name}: ${i.stage} — ${fmt.k(i.ticket)}`),
            ],
          },
          {
            heading: "Top Risks",
            items: risks
              .filter((r) => r.status === "Open")
              .map((r) => `• [${r.severity}] ${r.title}`),
          },
          {
            heading: "Recent Decisions",
            items: decisions
              .slice(0, 3)
              .map((d) => `• ${d.title} — ${d.owner}`),
          },
        ],
      },
      "Pipeline Report": {
        title: "Pipeline Report",
        date: fmt.dt(ds(new Date())),
        sections: [
          {
            heading: "Deal Pipeline",
            items: [
              `• Total: ${fmt.k(deals.reduce((s, d) => s + d.value, 0))}`,
              `• Weighted: ${fmt.k(weighted)}`,
              `• Active Deals: ${
                deals.filter((d) => d.stage !== "Lost").length
              }`,
            ],
          },
          {
            heading: "By Stage",
            items: DEAL_STAGES.map((s) => {
              const stagDeals = deals.filter((d) => d.stage === s);
              return stagDeals.length
                ? `• ${s}: ${stagDeals.length} deal${
                    stagDeals.length > 1 ? "s" : ""
                  } — ${fmt.k(stagDeals.reduce((t, d) => t + d.value, 0))}`
                : null;
            }).filter(Boolean),
          },
          {
            heading: "Investor Pipeline",
            items: [
              `• Committed: ${
                investors.filter((i) => i.stage === "Committed").length
              } — ${fmt.k(
                investors
                  .filter((i) => i.stage === "Committed")
                  .reduce((s, i) => s + i.ticket, 0)
              )}`,
              `• In Diligence: ${
                investors.filter((i) => i.stage === "Diligence").length
              }`,
            ],
          },
          {
            heading: "Action Required",
            items: deals
              .filter((d) =>
                ["Legal", "Commercial", "Proposal"].includes(d.stage)
              )
              .map((d) => `• ${d.company} [${d.stage}] — Owner: ${d.owner}`),
          },
        ],
      },
      "Spend Summary": {
        title: "Spend Summary Report",
        date: fmt.dt(ds(new Date())),
        sections: [
          {
            heading: "Overview",
            items: [
              `• Total Spend: ${fmt.k(totalSpend)}`,
              `• Monthly Recurring: ${fmt.k(monthlyBurn)}`,
              `• One-Off: ${fmt.k(
                spend
                  .filter((s) => s.recurring === "No")
                  .reduce((t, s) => t + s.amount, 0)
              )}`,
              `• Entries: ${spend.length}`,
            ],
          },
          {
            heading: "By Category",
            items: SPEND_CATS.map((cat) => {
              const v = spend
                .filter((s) => s.category === cat)
                .reduce((t, s) => t + s.amount, 0);
              return v ? `• ${cat}: ${fmt.k(v)}` : null;
            }).filter(Boolean),
          },
          {
            heading: "Top 5 Expenses",
            items: [...spend]
              .sort((a, b) => b.amount - a.amount)
              .slice(0, 5)
              .map(
                (s) =>
                  `• ${s.title} — ${fmt.cur(s.amount, s.currency)} — ${
                    s.vendor
                  }`
              ),
          },
          {
            heading: "By Country",
            items: [...new Set(spend.map((s) => s.country))].map(
              (c) =>
                `• ${c}: ${fmt.k(
                  spend
                    .filter((s) => s.country === c)
                    .reduce((t, s) => t + s.amount, 0)
                )}`
            ),
          },
        ],
      },
    };
    setReport(reports[rt]);
    setLoading(false);
  };
  const REPORT_TYPES = [
    "Weekly Summary",
    "Monthly Investor Update",
    "Board Snapshot",
    "Pipeline Report",
    "Spend Summary",
  ];
  return (
    <div>
      <TopBar title="Reporting Engine" />
      <div style={{ padding: 32 }}>
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(5,1fr)",
            gap: 2,
            marginBottom: 32,
          }}
        >
          {REPORT_TYPES.map((rt) => (
            <button
              key={rt}
              onClick={() => generate(rt)}
              disabled={loading}
              style={{
                background: type === rt ? "#CCFF00" : "#0a0a0a",
                color: type === rt ? "#000" : C.wh,
                border: "1px solid #1e1e1e",
                padding: "20px 16px",
                cursor: "pointer",
                fontFamily: T.b,
                textAlign: "left",
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  marginBottom: 8,
                  fontFamily: T.d,
                  letterSpacing: 0.5,
                }}
              >
                {rt}
              </div>
              <div
                style={{
                  fontSize: 10,
                  color: type === rt ? "#000" : C.g6,
                  letterSpacing: 1.5,
                  textTransform: "uppercase",
                }}
              >
                Generate →
              </div>
            </button>
          ))}
        </div>
        {loading && (
          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid #1e1e1e",
              padding: 60,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: T.d,
                fontSize: 24,
                color: "#CCFF00",
                letterSpacing: 2,
              }}
            >
              Compiling {type}…
            </div>
          </div>
        )}
        {report && !loading && (
          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid #1e1e1e",
              padding: 40,
            }}
          >
            <div style={{ marginBottom: 32 }}>
              <div
                style={{
                  fontSize: 9,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  color: "#CCFF00",
                  fontFamily: T.b,
                  marginBottom: 8,
                }}
              >
                Degenerate. Internal Report
              </div>
              <div
                style={{
                  fontFamily: T.d,
                  fontSize: 36,
                  color: C.wh,
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {report.title}
              </div>
              <div style={{ fontSize: 11, color: C.g6, fontFamily: T.b }}>
                Generated: {report.date} · Confidential
              </div>
            </div>
            {report.sections.map((s, i) => (
              <div key={i} style={{ marginBottom: 28 }}>
                <div
                  style={{
                    fontSize: 10,
                    letterSpacing: 3,
                    textTransform: "uppercase",
                    color: C.g6,
                    fontFamily: T.b,
                    marginBottom: 12,
                    paddingBottom: 8,
                    borderBottom: "1px solid #1a1a1a",
                  }}
                >
                  {s.heading}
                </div>
                {s.items.map((item, j) => (
                  <div
                    key={j}
                    style={{
                      fontSize: 13,
                      color: C.wh,
                      fontFamily: T.b,
                      lineHeight: 1.8,
                    }}
                  >
                    {item}
                  </div>
                ))}
              </div>
            ))}
          </div>
        )}
        {!report && !loading && (
          <div
            style={{
              background: "#0a0a0a",
              border: "1px solid #1e1e1e",
              padding: 80,
              textAlign: "center",
            }}
          >
            <div
              style={{
                fontFamily: T.d,
                fontSize: 28,
                color: C.g6,
                letterSpacing: 1,
              }}
            >
              Select a report type above
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default function App() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;700&display=swap";
    document.head.appendChild(link);
  }, []);

  const [active, setActive] = useState("overview");
  const [audit, setAudit] = useState(INIT.audit);
  const [spend, setSpend] = useState(INIT.spend);
  const [capTable, setCapTable] = useState(INIT.capTable);
  const [investors, setInvestors] = useState(INIT.investors);
  const [deals, setDeals] = useState(INIT.deals);
  const [markets, setMarkets] = useState(INIT.markets);
  const [products, setProducts] = useState(INIT.products);
  const [risks, setRisks] = useState(INIT.risks);
  const [decisions, setDecisions] = useState(INIT.decisions);
  const [people, setPeople] = useState(INIT.people);

  const addAudit = (entry) =>
    setAudit((p) => [
      {
        ...entry,
        id: uid(),
        date: ds(new Date()),
        description: entry.description || "",
        country: entry.country || "",
        module: entry.module || "",
        value: entry.value || 0,
        beforeState: "",
        afterState: "",
        attachmentUrl: "",
        notes: "",
      },
      ...p,
    ]);
  const data = {
    audit,
    spend,
    capTable,
    investors,
    deals,
    markets,
    products,
    risks,
    decisions,
    people,
  };

  const moduleProps = {
    overview: <Overview data={data} />,
    audit: <AuditTrail entries={audit} setEntries={setAudit} />,
    spend: (
      <SpendTracker entries={spend} setEntries={setSpend} addAudit={addAudit} />
    ),
    equity: <CapTable entries={capTable} setEntries={setCapTable} />,
    investors: (
      <InvestorPipeline
        entries={investors}
        setEntries={setInvestors}
        addAudit={addAudit}
      />
    ),
    deals: (
      <DealPipeline entries={deals} setEntries={setDeals} addAudit={addAudit} />
    ),
    markets: (
      <MarketExpansion
        entries={markets}
        setEntries={setMarkets}
        addAudit={addAudit}
      />
    ),
    product: (
      <ProductLog
        entries={products}
        setEntries={setProducts}
        addAudit={addAudit}
      />
    ),
    risks: (
      <RiskRegister entries={risks} setEntries={setRisks} addAudit={addAudit} />
    ),
    decisions: (
      <DecisionLog
        entries={decisions}
        setEntries={setDecisions}
        addAudit={addAudit}
      />
    ),
    people: (
      <People entries={people} setEntries={setPeople} addAudit={addAudit} />
    ),
    reporting: <Reporting data={data} />,
  };

  return (
    <div style={{ display: "flex", background: "#000", minHeight: "100vh" }}>
      <style>{`* { box-sizing: border-box; margin: 0; padding: 0; } ::-webkit-scrollbar { width: 4px; height: 4px; } ::-webkit-scrollbar-track { background: #0a0a0a; } ::-webkit-scrollbar-thumb { background: #2a2a2a; border-radius: 2px; } input, select, button { outline: none; }`}</style>
      <Sidebar
        active={active}
        onNav={setActive}
        notifications={risks.filter((r) => r.status === "Open").length}
      />
      <div
        style={{
          marginLeft: 220,
          flex: 1,
          minHeight: "100vh",
          overflowY: "auto",
          background: "#060606",
        }}
      >
        {moduleProps[active]}
      </div>
    </div>
  );
}
