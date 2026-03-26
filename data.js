// ============================================================
// data.js — DesignJobs India
// 38 companies • 6 cities • Real careers page apply links
// ============================================================

const CITY_BOUNDS = {
  all:       { center: [20.5937, 78.9629], zoom: 5 },
  bengaluru: { center: [12.9716, 77.5946], zoom: 12 },
  mumbai:    { center: [19.0760, 72.8777], zoom: 12 },
  hyderabad: { center: [17.3850, 78.4867], zoom: 12 },
  delhi:     { center: [28.6139, 77.2090], zoom: 11 },
  pune:      { center: [18.5204, 73.8567], zoom: 12 },
  chennai:   { center: [13.0827, 80.2707], zoom: 12 },
};

const COMPANIES = [
  // ── BENGALURU ──────────────────────────────────────────────
  {
    id: "swiggy",
    name: "Swiggy",
    logoUrl: "https://logo.clearbit.com/swiggy.com",
    logoInitial: "SW",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "3rd Floor, Radha Complex, Koramangala Industrial Layout, Bengaluru 560034",
    about: "India's leading food delivery & quick commerce platform with 500M+ orders annually.",
    lat: 12.9352, lng: 77.6245,
    jobs: [
      {
        title: "Senior Product Designer",
        type: "Full-time", level: "Senior", mode: "Hybrid",
        experience: "4–7 years", category: "Product Designer",
        tools: ["Figma", "Principle", "Maze", "UserTesting"],
        skills: ["Design Systems", "User Research", "Interaction Design", "Mobile-first"],
        source: "Swiggy Careers",
        applyUrl: "https://careers.swiggy.com/#/careers?title=Designer",
        applyLabel: "Apply on Swiggy Careers"
      },
      {
        title: "UX Researcher",
        type: "Full-time", level: "Mid", mode: "Onsite",
        experience: "2–5 years", category: "UX Researcher",
        tools: ["Dovetail", "Lookback", "Optimal Workshop", "Miro"],
        skills: ["Qualitative Research", "Usability Testing", "Diary Studies", "Survey Design"],
        source: "Swiggy Careers",
        applyUrl: "https://careers.swiggy.com/#/careers?title=Researcher",
        applyLabel: "Apply on Swiggy Careers"
      }
    ]
  },
  {
    id: "razorpay",
    name: "Razorpay",
    logoUrl: "https://logo.clearbit.com/razorpay.com",
    logoInitial: "RP",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "SJR Cyber, Laskar Hosur Road, Adugodi, Bengaluru 560030",
    about: "India's leading payments and business banking platform powering 10M+ businesses.",
    lat: 12.9165, lng: 77.6101,
    jobs: [
      {
        title: "Product Designer — Payments",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "3–5 years", category: "Product Designer",
        tools: ["Figma", "Storybook", "Zeroheight", "Mixpanel"],
        skills: ["Fintech UX", "Design Systems", "Complex Flows", "Cross-functional Collaboration"],
        source: "Razorpay Careers",
        applyUrl: "https://razorpay.com/jobs/#design",
        applyLabel: "Apply on Razorpay Careers"
      },
      {
        title: "Design Lead — Business Banking",
        type: "Full-time", level: "Lead", mode: "Onsite",
        experience: "8–12 years", category: "Design Lead",
        tools: ["Figma", "Notion", "Jira", "Confluence"],
        skills: ["Team Management", "Design Strategy", "Stakeholder Alignment", "Design Ops"],
        source: "Razorpay Careers",
        applyUrl: "https://razorpay.com/jobs/#design",
        applyLabel: "Apply on Razorpay Careers"
      }
    ]
  },
  {
    id: "cred",
    name: "CRED",
    logoUrl: "https://logo.clearbit.com/getcred.app",
    logoInitial: "CR",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "7th Cross, 1st Stage, Indiranagar, Bengaluru 560038",
    about: "Premium fintech brand for creditworthy Indians — rewards, loans & bill payments.",
    lat: 12.9784, lng: 77.6408,
    jobs: [
      {
        title: "Senior UI/UX Designer",
        type: "Full-time", level: "Senior", mode: "Onsite",
        experience: "5–8 years", category: "UI/UX Designer",
        tools: ["Figma", "Protopie", "After Effects", "Rive"],
        skills: ["Premium UX", "Micro-interactions", "Brand Consistency", "Motion Concepts"],
        source: "CRED Careers",
        applyUrl: "https://careers.cred.club/",
        applyLabel: "Apply on CRED Careers"
      },
      {
        title: "Motion Designer",
        type: "Full-time", level: "Mid", mode: "Onsite",
        experience: "3–5 years", category: "Motion Designer",
        tools: ["After Effects", "Rive", "Lottie", "Cinema 4D"],
        skills: ["Keyframe Animation", "Brand Motion", "App Transitions", "Story-driven Design"],
        source: "CRED Careers",
        applyUrl: "https://careers.cred.club/",
        applyLabel: "Apply on CRED Careers"
      }
    ]
  },
  {
    id: "meesho",
    name: "Meesho",
    logoUrl: "https://logo.clearbit.com/meesho.com",
    logoInitial: "ME",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "7th Floor, Prestige Meridian II, MG Road, Bengaluru 560001",
    about: "Social commerce platform empowering 15M+ micro-entrepreneurs across India.",
    lat: 12.9774, lng: 77.6064,
    jobs: [
      {
        title: "UI/UX Designer — Social Commerce",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "3–6 years", category: "UI/UX Designer",
        tools: ["Figma", "Zeplin", "Hotjar", "Mixpanel"],
        skills: ["Mobile Design", "E-commerce UX", "Regional Language UI", "Accessibility"],
        source: "Meesho Careers",
        applyUrl: "https://meesho.io/jobs",
        applyLabel: "Apply on Meesho Careers"
      }
    ]
  },
  {
    id: "phonepe",
    name: "PhonePe",
    logoUrl: "https://logo.clearbit.com/phonepe.com",
    logoInitial: "PP",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "Salarpuria Softzone, Outer Ring Road, Bellandur, Bengaluru 560103",
    about: "India's largest UPI payments app with 500M+ registered users.",
    lat: 12.9281, lng: 77.6933,
    jobs: [
      {
        title: "Senior UX Designer — Fintech",
        type: "Full-time", level: "Senior", mode: "Onsite",
        experience: "5–8 years", category: "UI/UX Designer",
        tools: ["Figma", "Protopie", "Mixpanel", "UserTesting"],
        skills: ["UPI Flows", "A/B Testing", "Inclusive Design", "Data-driven UX"],
        source: "PhonePe Careers",
        applyUrl: "https://www.phonepe.com/careers/",
        applyLabel: "Apply on PhonePe Careers"
      },
      {
        title: "Visual Designer",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "2–4 years", category: "Visual Designer",
        tools: ["Adobe Illustrator", "After Effects", "Figma", "Photoshop"],
        skills: ["Brand Design", "Illustration", "Marketing Creatives", "Motion Concepts"],
        source: "PhonePe Careers",
        applyUrl: "https://www.phonepe.com/careers/",
        applyLabel: "Apply on PhonePe Careers"
      }
    ]
  },
  {
    id: "flipkart",
    name: "Flipkart",
    logoUrl: "https://logo.clearbit.com/flipkart.com",
    logoInitial: "FK",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "Embassy Manyata Tech Park, Rachenahalli, Bengaluru 560045",
    about: "India's largest e-commerce marketplace, part of Walmart Group.",
    lat: 13.0436, lng: 77.6179,
    jobs: [
      {
        title: "Product Designer — Commerce Platform",
        type: "Full-time", level: "Senior", mode: "Hybrid",
        experience: "5–9 years", category: "Product Designer",
        tools: ["Figma", "InVision", "Maze", "Amplitude"],
        skills: ["Information Architecture", "Design Systems", "Cross-platform Design", "Research"],
        source: "Flipkart Careers",
        applyUrl: "https://www.flipkartcareers.com/#!/joblist",
        applyLabel: "Apply on Flipkart Careers"
      },
      {
        title: "Motion Designer",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "2–4 years", category: "Motion Designer",
        tools: ["After Effects", "Lottie", "Blender", "Figma"],
        skills: ["3D Animation", "Brand Motion", "App Micro-animations", "Storytelling"],
        source: "Flipkart Careers",
        applyUrl: "https://www.flipkartcareers.com/#!/joblist",
        applyLabel: "Apply on Flipkart Careers"
      }
    ]
  },
  {
    id: "groww",
    name: "Groww",
    logoUrl: "https://logo.clearbit.com/groww.in",
    logoInitial: "GW",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "RMZ Millenia Business Park, Whitefield, Bengaluru 560048",
    about: "India's largest investment platform with 10M+ active investors.",
    lat: 12.9787, lng: 77.7457,
    jobs: [
      {
        title: "Product Designer — Wealth Tech",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "3–6 years", category: "Product Designer",
        tools: ["Figma", "Amplitude", "Hotjar", "Miro"],
        skills: ["Financial UX", "Complex Data Viz", "Dashboard Design", "Accessibility"],
        source: "Groww Careers",
        applyUrl: "https://groww.in/careers",
        applyLabel: "Apply on Groww Careers"
      }
    ]
  },
  {
    id: "zerodha",
    name: "Zerodha",
    logoUrl: "https://logo.clearbit.com/zerodha.com",
    logoInitial: "ZR",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "153/154, 4th Cross, J.P. Nagar 4th Phase, Bengaluru 560078",
    about: "India's largest stock broker by active clients — zero brokerage pioneer.",
    lat: 12.9026, lng: 77.5920,
    jobs: [
      {
        title: "Product Designer — Trading UX",
        type: "Full-time", level: "Mid", mode: "Onsite",
        experience: "3–5 years", category: "Product Designer",
        tools: ["Figma", "Framer", "Linear", "Notion"],
        skills: ["Data-dense UI", "Accessibility", "Design Systems", "Open Source Design"],
        source: "Zerodha Careers",
        applyUrl: "https://zerodha.com/careers/",
        applyLabel: "Apply on Zerodha Careers"
      },
      {
        title: "UX Researcher — Finance",
        type: "Full-time", level: "Mid", mode: "Onsite",
        experience: "2–5 years", category: "UX Researcher",
        tools: ["Lookback", "Dovetail", "Typeform", "SPSS"],
        skills: ["Behavioral Research", "Financial Literacy Studies", "A/B Testing", "Surveys"],
        source: "Zerodha Careers",
        applyUrl: "https://zerodha.com/careers/",
        applyLabel: "Apply on Zerodha Careers"
      }
    ]
  },
  {
    id: "navi",
    name: "Navi",
    logoUrl: "https://logo.clearbit.com/navi.com",
    logoInitial: "NA",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "L&T South City, Bannerghatta Road, Bengaluru 560076",
    about: "Full-stack fintech by Sachin Bansal offering insurance, loans & mutual funds.",
    lat: 12.8601, lng: 77.6217,
    jobs: [
      {
        title: "Product Designer — Insurance UX",
        type: "Full-time", level: "Mid", mode: "Onsite",
        experience: "3–5 years", category: "Product Designer",
        tools: ["Figma", "Framer", "Hotjar", "Notion"],
        skills: ["Simplifying Complex Flows", "Design Systems", "Mobile UX", "Research"],
        source: "Navi Careers",
        applyUrl: "https://navi.com/careers/",
        applyLabel: "Apply on Navi Careers"
      }
    ]
  },
  {
    id: "myntra",
    name: "Myntra",
    logoUrl: "https://logo.clearbit.com/myntra.com",
    logoInitial: "MY",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "Survey No. 17/9B, Maruthi Chambers, Outer Ring Road, Bengaluru 560037",
    about: "India's leading fashion e-commerce platform with 50M+ shoppers.",
    lat: 12.9490, lng: 77.6950,
    jobs: [
      {
        title: "UX Designer — Fashion Discovery",
        type: "Full-time", level: "Senior", mode: "Hybrid",
        experience: "5–8 years", category: "UI/UX Designer",
        tools: ["Figma", "Maze", "Amplitude", "Adobe XD"],
        skills: ["Visual Merchandising UX", "Personalization", "Design Thinking", "Mobile-first"],
        source: "Myntra Careers",
        applyUrl: "https://careers.myntra.com/",
        applyLabel: "Apply on Myntra Careers"
      }
    ]
  },
  {
    id: "byjus",
    name: "BYJU'S",
    logoUrl: "https://logo.clearbit.com/byjus.com",
    logoInitial: "BJ",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "IBC Knowledge Park, 4/1 Bannerghatta Main Road, Bengaluru 560029",
    about: "World's most valued edtech — K-12, test prep and skill programs for 150M+ students.",
    lat: 12.8998, lng: 77.5975,
    jobs: [
      {
        title: "UX Designer — Learning Experience",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "3–5 years", category: "UI/UX Designer",
        tools: ["Figma", "Principle", "InVision", "Hotjar"],
        skills: ["EdTech UX", "Gamification", "Child-friendly Design", "Accessibility"],
        source: "BYJU'S Careers",
        applyUrl: "https://careers.byjus.com/",
        applyLabel: "Apply on BYJU'S Careers"
      }
    ]
  },
  {
    id: "mpl",
    name: "MPL",
    logoUrl: "https://logo.clearbit.com/mpl.live",
    logoInitial: "MP",
    city: "Bengaluru", cityKey: "bengaluru",
    address: "11th Floor, Tower C, RMZ Ecoworld, Outer Ring Road, Bengaluru 560103",
    about: "India's largest mobile gaming platform with 9 crore+ users.",
    lat: 12.9190, lng: 77.6892,
    jobs: [
      {
        title: "Game UI Designer",
        type: "Full-time", level: "Mid", mode: "Onsite",
        experience: "2–4 years", category: "UI/UX Designer",
        tools: ["Figma", "Unity UI Toolkit", "Photoshop", "After Effects"],
        skills: ["Game UI Patterns", "Visual Design", "Real-time Feedback", "Cross-platform"],
        source: "MPL Careers",
        applyUrl: "https://careers.mpl.live/",
        applyLabel: "Apply on MPL Careers"
      }
    ]
  },

  // ── MUMBAI ────────────────────────────────────────────────
  {
    id: "zepto",
    name: "Zepto",
    logoUrl: "https://logo.clearbit.com/zeptonow.com",
    logoInitial: "ZP",
    city: "Mumbai", cityKey: "mumbai",
    address: "Urmi Estate, 95 Ganpatrao Kadam Marg, Lower Parel, Mumbai 400013",
    about: "10-minute grocery delivery startup, India's fastest-growing quick commerce brand.",
    lat: 18.9987, lng: 72.8296,
    jobs: [
      {
        title: "UI/UX Designer — App",
        type: "Full-time", level: "Mid", mode: "Onsite",
        experience: "3–5 years", category: "UI/UX Designer",
        tools: ["Figma", "Protopie", "Mixpanel", "Hotjar"],
        skills: ["Mobile-first Design", "Quick Commerce UX", "Dark Mode UI", "User Flows"],
        source: "Zepto Careers",
        applyUrl: "https://www.zeptonow.com/careers",
        applyLabel: "Apply on Zepto Careers"
      }
    ]
  },
  {
    id: "tata-digital",
    name: "Tata Digital",
    logoUrl: "https://logo.clearbit.com/tata.com",
    logoInitial: "TD",
    city: "Mumbai", cityKey: "mumbai",
    address: "Bombay House, 24 Homi Mody Street, Fort, Mumbai 400001",
    about: "Tata's super-app initiative — Tata Neu — bringing 20+ Tata brands to one platform.",
    lat: 18.9330, lng: 72.8340,
    jobs: [
      {
        title: "Senior Product Designer — Super App",
        type: "Full-time", level: "Senior", mode: "Hybrid",
        experience: "6–10 years", category: "Product Designer",
        tools: ["Figma", "Maze", "Amplitude", "Confluence"],
        skills: ["Super-app UX", "Omnichannel Design", "Design Systems", "Research"],
        source: "Tata Careers",
        applyUrl: "https://www.tata.com/careers",
        applyLabel: "Apply on Tata Careers"
      },
      {
        title: "Design Lead — Tata Neu",
        type: "Full-time", level: "Lead", mode: "Hybrid",
        experience: "9–14 years", category: "Design Lead",
        tools: ["Figma", "Notion", "Jira", "Miro"],
        skills: ["Cross-brand Design Strategy", "Executive Alignment", "Team Building", "Design Ops"],
        source: "Tata Careers",
        applyUrl: "https://www.tata.com/careers",
        applyLabel: "Apply on Tata Careers"
      }
    ]
  },
  {
    id: "nykaa",
    name: "Nykaa",
    logoUrl: "https://logo.clearbit.com/nykaa.com",
    logoInitial: "NK",
    city: "Mumbai", cityKey: "mumbai",
    address: "104, Vasan Udyog Bhavan, Sun Mill Compound, Lower Parel, Mumbai 400013",
    about: "India's leading beauty & lifestyle platform with 35M+ customers.",
    lat: 19.0004, lng: 72.8280,
    jobs: [
      {
        title: "Product Designer — Beauty Commerce",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "3–6 years", category: "Product Designer",
        tools: ["Figma", "Photoshop", "InVision", "UserZoom"],
        skills: ["D2C UX", "Visual Merchandising", "Beauty-specific Flows", "Mobile Commerce"],
        source: "Nykaa Careers",
        applyUrl: "https://careers.nykaa.com/",
        applyLabel: "Apply on Nykaa Careers"
      }
    ]
  },
  {
    id: "mamaearth",
    name: "Mamaearth",
    logoUrl: "https://logo.clearbit.com/mamaearth.in",
    logoInitial: "MH",
    city: "Mumbai", cityKey: "mumbai",
    address: "Mira Road East, Thane, Mumbai 401104",
    about: "India's fastest-growing FMCG brand — natural personal care for 12M+ consumers.",
    lat: 19.2811, lng: 72.8654,
    jobs: [
      {
        title: "Visual Designer — D2C Brand",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "2–4 years", category: "Visual Designer",
        tools: ["Figma", "Adobe Illustrator", "Photoshop", "Canva Pro"],
        skills: ["Brand Identity", "Packaging Design", "Social Media Creatives", "Art Direction"],
        source: "Mamaearth Careers",
        applyUrl: "https://mamaearth.in/pages/careers",
        applyLabel: "Apply on Mamaearth Careers"
      }
    ]
  },
  {
    id: "ola",
    name: "Ola",
    logoUrl: "https://logo.clearbit.com/olacabs.com",
    logoInitial: "OL",
    city: "Mumbai", cityKey: "mumbai",
    address: "A-406, Kailas Industrial Complex, Park Site, Vikhroli West, Mumbai 400079",
    about: "India's largest ride-hailing & EV ecosystem with operations in 250+ cities.",
    lat: 19.1100, lng: 72.9272,
    jobs: [
      {
        title: "UX Designer — Mobility Platform",
        type: "Full-time", level: "Senior", mode: "Onsite",
        experience: "5–8 years", category: "UI/UX Designer",
        tools: ["Figma", "Protopie", "Amplitude", "Dovetail"],
        skills: ["Geo-spatial UX", "Driver-side Design", "Rider Experience", "A/B Testing"],
        source: "Ola Careers",
        applyUrl: "https://ola.careers/",
        applyLabel: "Apply on Ola Careers"
      }
    ]
  },
  {
    id: "wakefit",
    name: "Wakefit",
    logoUrl: "https://logo.clearbit.com/wakefit.co",
    logoInitial: "WF",
    city: "Mumbai", cityKey: "mumbai",
    address: "Linking Road, Khar West, Mumbai 400052",
    about: "India's top sleep & home solutions brand with an online-first D2C model.",
    lat: 19.0726, lng: 72.8380,
    jobs: [
      {
        title: "UI Designer — E-commerce",
        type: "Full-time", level: "Junior", mode: "Hybrid",
        experience: "1–3 years", category: "UI/UX Designer",
        tools: ["Figma", "Adobe XD", "Zeplin", "Webflow"],
        skills: ["E-commerce UI", "Component Libraries", "Visual Design", "Responsive Design"],
        source: "Wakefit Careers",
        applyUrl: "https://wakefit.co/careers/",
        applyLabel: "Apply on Wakefit Careers"
      }
    ]
  },

  // ── HYDERABAD ─────────────────────────────────────────────
  {
    id: "amazon-in",
    name: "Amazon India",
    logoUrl: "https://logo.clearbit.com/amazon.in",
    logoInitial: "AZ",
    city: "Hyderabad", cityKey: "hyderabad",
    address: "Raheja Mindspace, HITEC City, Hyderabad 500081",
    about: "Amazon's India development center — one of the largest tech operations outside the USA.",
    lat: 17.4474, lng: 78.3762,
    jobs: [
      {
        title: "UX Designer — Alexa India",
        type: "Full-time", level: "Senior", mode: "Hybrid",
        experience: "5–8 years", category: "UI/UX Designer",
        tools: ["Figma", "Sketch", "InVision", "Qualtrics"],
        skills: ["Conversational UI", "Inclusive Design", "Research", "India-specific UX"],
        source: "Amazon Jobs",
        applyUrl: "https://www.amazon.jobs/en/teams/ux-design?country%5B%5D=IN",
        applyLabel: "Apply on Amazon Jobs"
      },
      {
        title: "Design Lead — Customer Experience",
        type: "Full-time", level: "Lead", mode: "Onsite",
        experience: "10–14 years", category: "Design Lead",
        tools: ["Figma", "Airtable", "Confluence", "Jira"],
        skills: ["CX Strategy", "Design Ops", "Stakeholder Management", "Research Ops"],
        source: "Amazon Jobs",
        applyUrl: "https://www.amazon.jobs/en/teams/ux-design?country%5B%5D=IN",
        applyLabel: "Apply on Amazon Jobs"
      }
    ]
  },
  {
    id: "google-india",
    name: "Google India",
    logoUrl: "https://logo.clearbit.com/google.com",
    logoInitial: "GO",
    city: "Hyderabad", cityKey: "hyderabad",
    address: "Salarpuria Sattva Knowledge City, Raidurg, Hyderabad 500081",
    about: "Google's largest engineering office in Asia — home to Search, Maps and Pay teams.",
    lat: 17.4486, lng: 78.3908,
    jobs: [
      {
        title: "UX Designer — Google Pay India",
        type: "Full-time", level: "Senior", mode: "Hybrid",
        experience: "6–10 years", category: "UI/UX Designer",
        tools: ["Figma", "Material Design Kit", "Protopie", "Qualtrics"],
        skills: ["Material Design", "Research", "India-specific UX", "Cross-platform Design"],
        source: "Google Careers",
        applyUrl: "https://careers.google.com/jobs/results/?category=USER_EXPERIENCE&location=Hyderabad%2C+Telangana%2C+India",
        applyLabel: "Apply on Google Careers"
      }
    ]
  },
  {
    id: "microsoft-india",
    name: "Microsoft India",
    logoUrl: "https://logo.clearbit.com/microsoft.com",
    logoInitial: "MS",
    city: "Hyderabad", cityKey: "hyderabad",
    address: "Microsoft India, Gachibowli, Hyderabad 500032",
    about: "Microsoft's largest development centre in Asia — Hyderabad Campus hosts 10,000+ employees.",
    lat: 17.4403, lng: 78.3489,
    jobs: [
      {
        title: "Product Designer — Microsoft Teams India",
        type: "Full-time", level: "Senior", mode: "Hybrid",
        experience: "6–9 years", category: "Product Designer",
        tools: ["Figma", "Fluent Design Kit", "Power BI", "UserTesting"],
        skills: ["Enterprise UX", "Collaboration Tools", "Inclusive Design", "Systems Thinking"],
        source: "Microsoft Careers",
        applyUrl: "https://careers.microsoft.com/v2/global/en/search.html?q=designer&l=Hyderabad",
        applyLabel: "Apply on Microsoft Careers"
      }
    ]
  },
  {
    id: "mastercard",
    name: "Mastercard",
    logoUrl: "https://logo.clearbit.com/mastercard.com",
    logoInitial: "MC",
    city: "Hyderabad", cityKey: "hyderabad",
    address: "Q City, Nanakramguda, Hyderabad 500032",
    about: "Global payments leader — India Tech Hub in Hyderabad drives payments innovation.",
    lat: 17.4348, lng: 78.3783,
    jobs: [
      {
        title: "UX Designer — Payments Innovation",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "3–6 years", category: "UI/UX Designer",
        tools: ["Figma", "Axure", "Hotjar", "InVision"],
        skills: ["Fintech UX", "Security-driven Design", "Cross-cultural UX", "Research"],
        source: "Mastercard Careers",
        applyUrl: "https://careers.mastercard.com/us/en/search-results?keywords=designer&location=Hyderabad",
        applyLabel: "Apply on Mastercard Careers"
      }
    ]
  },

  // ── DELHI / NCR ────────────────────────────────────────────
  {
    id: "zomato",
    name: "Zomato",
    logoUrl: "https://logo.clearbit.com/zomato.com",
    logoInitial: "ZM",
    city: "Gurugram", cityKey: "delhi",
    address: "Ground Floor, 12A, 94 Sector Road, Sector 44, Gurugram 122003",
    about: "Leading food delivery platform with operations in 800+ Indian cities.",
    lat: 28.4503, lng: 77.0750,
    jobs: [
      {
        title: "Senior Product Designer",
        type: "Full-time", level: "Senior", mode: "Hybrid",
        experience: "5–8 years", category: "Product Designer",
        tools: ["Figma", "Framer", "Mixpanel", "Dovetail"],
        skills: ["Hyperlocation UX", "Design Systems", "A/B Testing", "Design Sprints"],
        source: "Zomato Careers",
        applyUrl: "https://www.zomato.com/careers/",
        applyLabel: "Apply on Zomato Careers"
      },
      {
        title: "UX Researcher",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "2–5 years", category: "UX Researcher",
        tools: ["Dovetail", "Optimal Workshop", "Lookback", "Miro"],
        skills: ["Field Research", "Diary Studies", "Quantitative Methods", "Synthesis"],
        source: "Zomato Careers",
        applyUrl: "https://www.zomato.com/careers/",
        applyLabel: "Apply on Zomato Careers"
      }
    ]
  },
  {
    id: "paytm",
    name: "Paytm",
    logoUrl: "https://logo.clearbit.com/paytm.com",
    logoInitial: "PT",
    city: "Noida", cityKey: "delhi",
    address: "B-121, Sector 5, Noida, Uttar Pradesh 201301",
    about: "Pioneer of digital payments in India with diversified financial services.",
    lat: 28.5924, lng: 77.3122,
    jobs: [
      {
        title: "Senior UX Designer — Payments",
        type: "Full-time", level: "Senior", mode: "Onsite",
        experience: "5–9 years", category: "UI/UX Designer",
        tools: ["Figma", "Principle", "Amplitude", "Hotjar"],
        skills: ["Payment Flows", "Design Systems", "Research", "India-specific UX"],
        source: "Paytm Careers",
        applyUrl: "https://paytm.com/about-us/careers/",
        applyLabel: "Apply on Paytm Careers"
      }
    ]
  },
  {
    id: "urban-company",
    name: "Urban Company",
    logoUrl: "https://logo.clearbit.com/urbancompany.com",
    logoInitial: "UC",
    city: "Gurugram", cityKey: "delhi",
    address: "DLF Cyber City, Phase 2, Sector 24, Gurugram 122002",
    about: "India's largest home services marketplace with 40K+ service partners.",
    lat: 28.4948, lng: 77.0893,
    jobs: [
      {
        title: "Product Designer — Marketplace",
        type: "Full-time", level: "Senior", mode: "Hybrid",
        experience: "5–8 years", category: "Product Designer",
        tools: ["Figma", "Maze", "Mixpanel", "Notion"],
        skills: ["Two-sided Marketplace UX", "Design Sprints", "Research", "Design Systems"],
        source: "Urban Company Careers",
        applyUrl: "https://careers.urbancompany.com/",
        applyLabel: "Apply on Urban Company Careers"
      }
    ]
  },
  {
    id: "healthkart",
    name: "HealthKart",
    logoUrl: "https://logo.clearbit.com/healthkart.com",
    logoInitial: "HK",
    city: "Gurugram", cityKey: "delhi",
    address: "Plot No 1, Nelson Mandela Road, Vasant Kunj Phase 2, New Delhi 110070",
    about: "India's largest nutrition & wellness platform — sports supplements, vitamins & more.",
    lat: 28.5245, lng: 77.1590,
    jobs: [
      {
        title: "Visual Designer — D2C",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "2–4 years", category: "Visual Designer",
        tools: ["Figma", "Photoshop", "Illustrator", "Canva Pro"],
        skills: ["Brand Identity", "Packaging Design", "Digital Marketing Assets", "Photography Direction"],
        source: "HealthKart Careers",
        applyUrl: "https://www.healthkart.com/career/",
        applyLabel: "Apply on HealthKart Careers"
      }
    ]
  },
  {
    id: "policybazaar",
    name: "Policybazaar",
    logoUrl: "https://logo.clearbit.com/policybazaar.com",
    logoInitial: "PB",
    city: "Gurugram", cityKey: "delhi",
    address: "Plot No. 119, Sector 44, Gurugram 122001",
    about: "India's largest insurance aggregator — 9M+ policies sold annually.",
    lat: 28.4559, lng: 77.0633,
    jobs: [
      {
        title: "UX Designer — Insurance Platform",
        type: "Full-time", level: "Mid", mode: "Onsite",
        experience: "3–6 years", category: "UI/UX Designer",
        tools: ["Figma", "Adobe XD", "Mixpanel", "HeatMap tools"],
        skills: ["Insurance UX", "Trust-building Design", "Complex Form UX", "Research"],
        source: "Policybazaar Careers",
        applyUrl: "https://www.policybazaar.com/info/careers.aspx",
        applyLabel: "Apply on Policybazaar Careers"
      }
    ]
  },
  {
    id: "info-edge",
    name: "Info Edge (Naukri)",
    logoUrl: "https://logo.clearbit.com/naukri.com",
    logoInitial: "IE",
    city: "Noida", cityKey: "delhi",
    address: "B-8, Sector 132, Noida, Uttar Pradesh 201304",
    about: "India's leading online classifieds company — Naukri.com, 99acres, Jeevansathi & more.",
    lat: 28.5078, lng: 77.4005,
    jobs: [
      {
        title: "Product Designer — Job Platform",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "3–5 years", category: "Product Designer",
        tools: ["Figma", "Amplitude", "Hotjar", "Zeplin"],
        skills: ["Job Platform UX", "Search & Discovery", "Design Systems", "Cross-platform"],
        source: "Info Edge Careers",
        applyUrl: "https://careers.infoedge.in/",
        applyLabel: "Apply on Info Edge Careers"
      }
    ]
  },

  // ── PUNE ─────────────────────────────────────────────────
  {
    id: "persistent",
    name: "Persistent Systems",
    logoUrl: "https://logo.clearbit.com/persistent.com",
    logoInitial: "PS",
    city: "Pune", cityKey: "pune",
    address: "Bhageerath, 402B, Senapati Bapat Road, Pune 411016",
    about: "Global digital engineering company with 22K+ employees and NASDAQ listing.",
    lat: 18.5290, lng: 73.8422,
    jobs: [
      {
        title: "UI/UX Designer — Enterprise SaaS",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "3–6 years", category: "UI/UX Designer",
        tools: ["Figma", "Adobe XD", "Storybook", "Zeplin"],
        skills: ["Enterprise UX", "B2B Design", "Design Systems", "Accessibility (WCAG)"],
        source: "Persistent Careers",
        applyUrl: "https://careers.persistent.com/",
        applyLabel: "Apply on Persistent Careers"
      }
    ]
  },
  {
    id: "thoughtworks",
    name: "Thoughtworks",
    logoUrl: "https://logo.clearbit.com/thoughtworks.com",
    logoInitial: "TW",
    city: "Pune", cityKey: "pune",
    address: "Tower 1, World Trade Center, Kharadi, Pune 411014",
    about: "Global tech consultancy known for XP and agile — public on NASDAQ.",
    lat: 18.5520, lng: 73.9455,
    jobs: [
      {
        title: "Experience Designer — Consulting",
        type: "Full-time", level: "Senior", mode: "Hybrid",
        experience: "5–9 years", category: "Product Designer",
        tools: ["Figma", "Miro", "Notion", "Optimal Workshop"],
        skills: ["Service Design", "Design Thinking", "Client Facilitation", "Systems Thinking"],
        source: "Thoughtworks Careers",
        applyUrl: "https://www.thoughtworks.com/careers/jobs?q=designer&l=India",
        applyLabel: "Apply on Thoughtworks Careers"
      },
      {
        title: "UX Researcher",
        type: "Full-time", level: "Mid", mode: "Remote",
        experience: "3–5 years", category: "UX Researcher",
        tools: ["Dovetail", "Lookback", "Miro", "MAXQDA"],
        skills: ["Strategic Research", "Jobs-to-be-done", "Service Blueprinting", "Synthesis"],
        source: "Thoughtworks Careers",
        applyUrl: "https://www.thoughtworks.com/careers/jobs?q=researcher&l=India",
        applyLabel: "Apply on Thoughtworks Careers"
      }
    ]
  },
  {
    id: "bajaj-finserv",
    name: "Bajaj Finserv",
    logoUrl: "https://logo.clearbit.com/bajajfinserv.in",
    logoInitial: "BF",
    city: "Pune", cityKey: "pune",
    address: "Bajaj Auto Limited Complex, Mumbai–Pune Rd, Akurdi, Pune 411035",
    about: "India's most diversified NBFC — lending, insurance, and asset management.",
    lat: 18.6448, lng: 73.7663,
    jobs: [
      {
        title: "Product Designer — Fintech App",
        type: "Full-time", level: "Senior", mode: "Onsite",
        experience: "5–8 years", category: "Product Designer",
        tools: ["Figma", "Framer", "Amplitude", "Hotjar"],
        skills: ["Fintech UX", "EMI & Loan Flows", "Design Systems", "Research"],
        source: "Bajaj Finserv Careers",
        applyUrl: "https://www.bajajfinserv.in/careers",
        applyLabel: "Apply on Bajaj Finserv Careers"
      }
    ]
  },
  {
    id: "mercedes-benz-india",
    name: "Mercedes-Benz India",
    logoUrl: "https://logo.clearbit.com/mercedes-benz.co.in",
    logoInitial: "MB",
    city: "Pune", cityKey: "pune",
    address: "Old Mumbai Highway, Chakan, Pune 410501",
    about: "Mercedes-Benz India's design & engineering hub — luxury mobility experiences.",
    lat: 18.7560, lng: 73.8613,
    jobs: [
      {
        title: "UX Designer — In-car HMI",
        type: "Full-time", level: "Senior", mode: "Onsite",
        experience: "5–9 years", category: "UI/UX Designer",
        tools: ["Figma", "Blender", "Unity", "Sketch"],
        skills: ["HMI Design", "Automotive UX", "Embedded Systems UI", "Safety Standards"],
        source: "Mercedes-Benz Careers",
        applyUrl: "https://www.mercedes-benz.co.in/passengercars/mercedes-benz-cars/careers.html",
        applyLabel: "Apply on Mercedes-Benz Careers"
      }
    ]
  },

  // ── CHENNAI ──────────────────────────────────────────────
  {
    id: "freshworks",
    name: "Freshworks",
    logoUrl: "https://logo.clearbit.com/freshworks.com",
    logoInitial: "FW",
    city: "Chennai", cityKey: "chennai",
    address: "Kences Towers, Nungambakkam High Road, Chennai 600034",
    about: "Global SaaS leader for CRM, IT helpdesk & customer support — listed on NASDAQ.",
    lat: 13.0569, lng: 80.2425,
    jobs: [
      {
        title: "Product Designer — SaaS Platform",
        type: "Full-time", level: "Mid", mode: "Hybrid",
        experience: "3–6 years", category: "Product Designer",
        tools: ["Figma", "Storybook", "Zeroheight", "Maze"],
        skills: ["B2B UX", "Design Systems", "Accessibility (WCAG 2.1)", "Complex Workflows"],
        source: "Freshworks Careers",
        applyUrl: "https://careers.freshworks.com/jobs#Design",
        applyLabel: "Apply on Freshworks Careers"
      }
    ]
  },
  {
    id: "zoho",
    name: "Zoho",
    logoUrl: "https://logo.clearbit.com/zoho.com",
    logoInitial: "ZH",
    city: "Chennai", cityKey: "chennai",
    address: "Estancia IT Park, Maraimalai Nagar, Chennai 603209",
    about: "India's largest SaaS company — 55+ business apps, 100M+ users globally.",
    lat: 12.7411, lng: 80.1949,
    jobs: [
      {
        title: "UI/UX Designer — SaaS Suite",
        type: "Full-time", level: "Mid", mode: "Onsite",
        experience: "2–5 years", category: "UI/UX Designer",
        tools: ["Figma", "Adobe XD", "Zoho Creator", "UserTesting"],
        skills: ["B2B Product Design", "Design Systems", "Complex Form UX", "Accessibility"],
        source: "Zoho Careers",
        applyUrl: "https://careers.zoho.com/",
        applyLabel: "Apply on Zoho Careers"
      },
      {
        title: "Design Lead — Zoho One",
        type: "Full-time", level: "Lead", mode: "Onsite",
        experience: "8–13 years", category: "Design Lead",
        tools: ["Figma", "Notion", "Jira", "Miro"],
        skills: ["Cross-product Design Strategy", "Design Ops", "Team Mentoring", "Enterprise UX"],
        source: "Zoho Careers",
        applyUrl: "https://careers.zoho.com/",
        applyLabel: "Apply on Zoho Careers"
      }
    ]
  },
  {
    id: "ola-electric",
    name: "Ola Electric",
    logoUrl: "https://logo.clearbit.com/olaelectric.com",
    logoInitial: "OE",
    city: "Chennai", cityKey: "chennai",
    address: "FutureFactory, Hosur Road (near Chennai), Tamil Nadu 635109",
    about: "India's largest EV manufacturer — produces the S1 series of electric scooters.",
    lat: 12.7399, lng: 77.8253,
    jobs: [
      {
        title: "UX Designer — EV App & Dashboard",
        type: "Full-time", level: "Senior", mode: "Onsite",
        experience: "5–8 years", category: "UI/UX Designer",
        tools: ["Figma", "Protopie", "Unity", "After Effects"],
        skills: ["Connected Vehicle UX", "Instrument Cluster Design", "iOS/Android App UX", "Motion Design"],
        source: "Ola Electric Careers",
        applyUrl: "https://careers.olaelectric.com/",
        applyLabel: "Apply on Ola Electric Careers"
      }
    ]
  },
  {
    id: "tvs",
    name: "TVS Motor",
    logoUrl: "https://logo.clearbit.com/tvsmotor.com",
    logoInitial: "TV",
    city: "Chennai", cityKey: "chennai",
    address: "Jayalakshmi Estates, 29, Haddows Road, Nungambakkam, Chennai 600006",
    about: "India's 3rd-largest two-wheeler manufacturer — connected mobility pioneer.",
    lat: 13.0630, lng: 80.2490,
    jobs: [
      {
        title: "UX Designer — Connected Vehicles",
        type: "Full-time", level: "Mid", mode: "Onsite",
        experience: "3–6 years", category: "UI/UX Designer",
        tools: ["Figma", "Sketch", "Unity", "Axure"],
        skills: ["Automotive HMI", "IoT UX", "Instrument Cluster", "Mobile App Companion"],
        source: "TVS Careers",
        applyUrl: "https://www.tvsmotor.com/careers.asp",
        applyLabel: "Apply on TVS Careers"
      }
    ]
  }
];
