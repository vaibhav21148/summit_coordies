type MetaInfo = {
  title: string;
  description: string;
  shortDescription?: string;
  image?: string;
  keywords?: string;
};

const DEFAULT_LOGO = 'https://2k21.s3.amazonaws.com/s3uploadapi/21summit_og.png';
const DEFAULT_FAVICON = 'https://www.ecell.in/esummit/images/favicon/logo.png';

export const PageMetaInfo: Record<string, MetaInfo> = {
  default: {
    title: "E-Summit 2026 | E-Cell IIT Bombay",
    description:
      "The 22nd edition of Asia's largest business conclave, hosted by E-Cell, IIT Bombay, is set to make history on December 11-12, 2025, by redefining purposeful leadership and setting bold new standards for the future of business in a dynamic entrepreneurial landscape.",
    shortDescription:
      "Asia's largest entrepreneurship summit - Join 5000+ innovators, startups, and leaders at IIT Bombay",
    image: DEFAULT_LOGO,
    keywords:
      'E-Cell IIT Bombay, E-Summit, Entrepreneurship, Startup, Innovation, Technology, Business, Leadership, Networking, Education, Mentorship, Events, Pitching, IIT Bombay, December 2025',
  },
  ttmm: {
    title: 'The Ten Minute Million',
    description:
      'The Ten Minute Million, where a 10-minute pitch can win financial backing of up to INR 3.5 million. Join Asia\'s premier startup pitching competition at E-Summit 2025.',
    shortDescription:
      'Win up to INR 3.5 million in 10 minutes - Asia\'s premier startup pitch competition',
    image: DEFAULT_LOGO,
    keywords:
      'ttmm, business pitch, funding event, startup funding, investor pitch, ten minute million, pitch competition',
  },
  expo: {
    title: 'Startup Expo',
    description:
      'Showcase your innovative products and connect with customers, investors, and thought leaders at the Startup Expo. A must-visit platform for E-Summit attendees to explore groundbreaking startups and entrepreneurial strategies.',
    shortDescription:
      'Showcase innovative products and connect with investors at Asia\'s largest startup expo',
    image: DEFAULT_LOGO,
    keywords: 'startup showcase, product demo, investor connections, startup expo, innovation showcase',
  },
  mun: {
    title: 'Entre-MUN',
    description:
      "Entre MUN 2025 at IIT Bombay's E-Summit brings together global minds to debate real-world issues at the intersection of business, innovation, and sustainability.",
    shortDescription:
      'Global minds debate business, innovation, and sustainability at Entre-MUN 2025',
    image: DEFAULT_LOGO,
    keywords:
      'model united nations, mun, global issues, policy debate, sustainability, entre-mun',
  },
  na: {
    title: 'Networking Arena',
    description:
      'The Networking Arena at E-Summit IIT Bombay is a 2-day event connecting startups, investors, mentors, and professionals from across India to foster growth, insights, and meaningful collaborations.',
    shortDescription:
      '2-day networking event connecting startups, investors, and mentors across India',
    image: DEFAULT_LOGO,
    keywords:
      'networking event, mentorship, professional connections, collaborations, na, networking arena',
  },
  compi: {
    title: 'Competitions',
    description:
      'Test your entrepreneurial skills in competitions covering business, strategy, marketing, and finance at E-Summit IIT Bombay. Compete with the best to foster your entrepreneurial spirit and sharpen your abilities.',
    shortDescription:
      'Test entrepreneurial skills in business, strategy, marketing, and finance competitions',
    image: DEFAULT_LOGO,
    keywords: 'competitions, marketing strategy, finance challenges, business competitions, entrepreneurship',
  },
  workshops: {
    title: 'Workshops',
    description:
      'Join E-Summit 2025 workshops led by world-class trainers across finance, technology, and more. Gain certifications, expand your skills, and unlock valuable insights for career growth.',
    shortDescription:
      'World-class workshops with certifications in finance, technology, and career growth',
    image: DEFAULT_LOGO,
    keywords: 'workshops, certifications, skill development, career growth, professional training',
  },
  seedstars: {
    title: 'Seedstars',
    description:
      'Seed Stars at E-Summit IIT Bombay is the ultimate platform for startups to connect with investors, expand networks, and secure funding to scale their ventures.',
    shortDescription:
      'Ultimate platform for startups to connect with investors and secure funding',
    image: DEFAULT_LOGO,
    keywords:
      'seedstars, startup funding, investor connections, venture scaling, seed funding',
  },
  ihack: {
    title: 'i-Hack',
    description:
      "i-Hack is a series of hackathons held during IIT Bombay's E-Summit by E-Cell, bringing together aspiring product managers, strategists, developers, designers, and entrepreneurs from across India to solve real-world challenges.",
    shortDescription:
      'Hackathon series bringing together developers, designers, and entrepreneurs',
    image: DEFAULT_LOGO,
    keywords:
      'i-Hack, ihack, hackathon, innovation challenge, product development, coding competition',
  },
  isummit: {
    title: 'Incubator Summit',
    description:
      "Fast-track your startup's growth at the Incubator Summit, where incubation happens instantly. Skip the wait, connect with top incubators, and turn your vision into reality at E-Summit IIT Bombay.",
    shortDescription:
      'Fast-track startup growth with instant incubation and top incubator connections',
    image: DEFAULT_LOGO,
    keywords: 'startup incubation, fast-track growth, funding opportunities, incubator summit',
  },
  ijf: {
    title: 'Internship & Job Fair',
    description:
      "The Internship & Job Fair at E-Summit IIT Bombay connects top students with startups and companies for internships and full-time roles. A one-stop platform to hire premium talent from across India's leading colleges.",
    shortDescription:
      'Connect top students with startups and companies for internships and jobs',
    image: DEFAULT_LOGO,
    keywords: 'internship fair, job fair, talent hiring, recruitment, career opportunities',
  },
  cl: {
    title: 'Contingent Leader',
    description:
      "Lead your college contingent at E-Summit IIT Bombay, Asia's largest student-run business conclave. Showcase your leadership skills, represent your institution, and be part of an unforgettable entrepreneurial journey.",
    shortDescription:
      'Lead your college contingent at Asia\'s largest student-run business conclave',
    image: DEFAULT_LOGO,
    keywords: 'contingent leader, college contingent, student leadership, college representation',
  },
};
