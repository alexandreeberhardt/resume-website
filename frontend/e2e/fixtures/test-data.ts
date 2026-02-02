/**
 * Données de test pour les tests E2E
 */

export const TEST_USER = {
  email: 'test-e2e@sivee.pro',
  password: 'TestPassword123!',
};

export const TEST_USER_REGISTER = {
  email: `test-e2e-${Date.now()}@sivee.pro`,
  password: 'TestPassword123!',
};

export const MOCK_PERSONAL_INFO = {
  name: 'Jean Dupont',
  title: 'Développeur Full Stack',
  location: 'Paris, France',
  email: 'jean.dupont@email.com',
  phone: '+33 6 12 34 56 78',
};

export const MOCK_EXPERIENCE = {
  title: 'Lead Developer',
  company: 'Tech Company',
  startDate: '2020-01',
  endDate: '2024-01',
  highlights: [
    'Développement d\'applications web modernes avec React et TypeScript',
    'Mise en place de CI/CD avec GitHub Actions',
    'Mentorat de 3 développeurs juniors',
  ],
};

export const MOCK_EDUCATION = {
  school: 'École Polytechnique',
  degree: 'Master en Informatique',
  startDate: '2015-09',
  endDate: '2020-06',
  description: 'Spécialisation en Intelligence Artificielle et Machine Learning',
};

export const MOCK_PROJECT = {
  name: 'Plateforme E-commerce',
  year: '2023',
  highlights: [
    'Architecture microservices avec Node.js',
    '100K+ utilisateurs actifs',
    'Intégration Stripe et PayPal',
  ],
};

export const MOCK_SKILLS = {
  languages: 'JavaScript, TypeScript, Python, Go',
  tools: 'React, Node.js, PostgreSQL, Docker, Kubernetes, AWS',
};

export const MOCK_LINKS = [
  { platform: 'linkedin', username: 'jeandupont', url: 'https://linkedin.com/in/jeandupont' },
  { platform: 'github', username: 'jdupont', url: 'https://github.com/jdupont' },
  { platform: 'portfolio', username: '', url: 'https://jeandupont.dev' },
];

export const AVAILABLE_TEMPLATES = [
  'harvard',
  'double',
  'michel',
  'stephane',
  'aurianne',
  'europass',
  'mckinsey',
];

export const TEMPLATE_SIZES = ['compact', 'normal', 'large'] as const;

export const SECTION_TYPES = [
  'summary',
  'education',
  'experiences',
  'projects',
  'skills',
  'leadership',
  'languages',
  'custom',
] as const;

/**
 * Génère un CV complet pour les tests
 */
export function generateCompleteCV() {
  return {
    personal: {
      ...MOCK_PERSONAL_INFO,
      links: MOCK_LINKS,
    },
    sections: [
      {
        type: 'summary',
        title: 'Résumé',
        isVisible: true,
        items: 'Développeur passionné avec 8 ans d\'expérience dans le développement web full stack.',
      },
      {
        type: 'experiences',
        title: 'Expérience',
        isVisible: true,
        items: [MOCK_EXPERIENCE],
      },
      {
        type: 'education',
        title: 'Formation',
        isVisible: true,
        items: [MOCK_EDUCATION],
      },
      {
        type: 'projects',
        title: 'Projets',
        isVisible: true,
        items: [MOCK_PROJECT],
      },
      {
        type: 'skills',
        title: 'Compétences',
        isVisible: true,
        items: MOCK_SKILLS,
      },
    ],
    template_id: 'harvard',
  };
}

/**
 * Délais pour les tests (en ms)
 */
export const TIMEOUTS = {
  SHORT: 1000,
  MEDIUM: 3000,
  LONG: 5000,
  PDF_GENERATION: 30000,
  PDF_IMPORT: 60000,
};
