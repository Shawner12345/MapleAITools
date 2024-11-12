import { 
  Brain, 
  Briefcase, 
  Workflow, 
  Code,
  Lightbulb,
  GraduationCap,
  BarChart,
  TrendingUp,
  Clock,
  Users,
  CheckCircle
} from 'lucide-react';

export type CaseStudy = {
  id: string;
  company: string;
  title: string;
  summary: string;
  image: string;
  heroImage: string;
  industry: {
    name: string;
    icon: typeof Brain;
  };
  challenge: string;
  clientQuote: string;
  clientName: string;
  clientTitle: string;
  solution: string;
  solutionPoints: {
    icon: typeof Brain;
    title: string;
    description: string;
  }[];
  results: string;
  resultMetrics: {
    icon: typeof Brain;
    value: string;
    label: string;
  }[];
  metrics: {
    improvement: string;
    timeframe: string;
    teamSize: string;
    completion: string;
  };
  services: string[];
};

export const caseStudies: CaseStudy[] = [
  {
    id: 'digital-bloom',
    company: 'Digital Bloom Marketing',
    title: 'Transforming Content Creation with AI',
    summary: 'How a 6-person marketing agency 4x their content output using AI tools',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f',
    heroImage: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c',
    industry: {
      name: 'Digital Marketing',
      icon: Briefcase
    },
    challenge: 'Digital Bloom struggled to scale their content creation while maintaining quality. Their small team was overwhelmed with client demands.',
    clientQuote: 'AI has completely transformed how we create content. What used to take days now takes hours, and the quality has actually improved.',
    clientName: 'Sarah Chen',
    clientTitle: 'Founder & Creative Director',
    solution: 'We implemented a comprehensive AI content creation workflow and trained the team on using generative AI tools effectively.',
    solutionPoints: [
      {
        icon: Workflow,
        title: 'AI Content Pipeline',
        description: 'Implemented AI tools for content ideation, writing, and optimization.'
      },
      {
        icon: Lightbulb,
        title: 'Custom Prompts',
        description: 'Developed brand-specific prompts for consistent AI outputs.'
      },
      {
        icon: GraduationCap,
        title: 'Team Training',
        description: 'Hands-on workshops for effective AI tool usage.'
      },
      {
        icon: BarChart,
        title: 'Analytics Integration',
        description: 'Set up performance tracking for AI-generated content.'
      }
    ],
    results: 'Within three months, Digital Bloom transformed their content creation process and significantly improved their output.',
    resultMetrics: [
      {
        icon: TrendingUp,
        value: '4x',
        label: 'Content Output'
      },
      {
        icon: Clock,
        value: '75%',
        label: 'Time Saved'
      },
      {
        icon: Users,
        value: '40%',
        label: 'Client Growth'
      }
    ],
    metrics: {
      improvement: '4x content output',
      timeframe: '3 months',
      teamSize: '6 team members',
      completion: 'Fully implemented'
    },
    services: [
      'AI Tool Training',
      'Workflow Optimization',
      'Content Strategy',
      'Team Coaching'
    ]
  },
  {
    id: 'swift-solutions',
    company: 'Swift Solutions Design',
    title: 'Revolutionizing Web Design with AI',
    summary: 'Small design studio reduces project time by 60% through AI implementation',
    image: 'https://images.unsplash.com/photo-1561070791-2526d30994b5',
    heroImage: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb',
    industry: {
      name: 'Web Design',
      icon: Code
    },
    challenge: 'Swift Solutions was struggling to compete with larger agencies while maintaining their high design standards.',
    clientQuote: 'The AI tools have revolutionized our design process. We\'re now able to take on twice as many projects while delivering even better results.',
    clientName: 'Michael Torres',
    clientTitle: 'Lead Designer',
    solution: 'We integrated AI design tools and created automated workflows for common design tasks.',
    solutionPoints: [
      {
        icon: Workflow,
        title: 'AI Design System',
        description: 'Implemented AI tools for design generation and iteration.'
      },
      {
        icon: Lightbulb,
        title: 'Smart Templates',
        description: 'Created AI-powered template system for rapid prototyping.'
      },
      {
        icon: GraduationCap,
        title: 'Designer Training',
        description: 'Intensive training on AI design tools and workflows.'
      },
      {
        icon: BarChart,
        title: 'Project Analytics',
        description: 'Set up tracking for project timelines and efficiency.'
      }
    ],
    results: 'The implementation led to dramatic improvements in project delivery and client satisfaction.',
    resultMetrics: [
      {
        icon: TrendingUp,
        value: '60%',
        label: 'Faster Delivery'
      },
      {
        icon: Clock,
        value: '100%',
        label: 'More Projects'
      },
      {
        icon: Users,
        value: '50%',
        label: 'Revenue Growth'
      }
    ],
    metrics: {
      improvement: '60% faster delivery',
      timeframe: '2 months',
      teamSize: '4 team members',
      completion: 'Fully implemented'
    },
    services: [
      'AI Tool Integration',
      'Workflow Automation',
      'Team Training',
      'Process Optimization'
    ]
  },
  {
    id: 'content-craft',
    company: 'Content Craft Co',
    title: 'Scaling Content Production with AI',
    summary: 'Freelance content team achieves 3x output using AI assistance',
    image: 'https://images.unsplash.com/photo-1553877522-43269d4ea984',
    heroImage: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0',
    industry: {
      name: 'Content Creation',
      icon: Lightbulb
    },
    challenge: 'Content Craft Co was struggling to scale their business while maintaining content quality.',
    clientQuote: 'AI has transformed our entire workflow. We\'re producing more content than ever, and our clients are thrilled with the results.',
    clientName: 'Rachel Thompson',
    clientTitle: 'Content Director',
    solution: 'We implemented an AI-powered content creation system and trained the team on advanced prompt engineering.',
    solutionPoints: [
      {
        icon: Workflow,
        title: 'AI Writing System',
        description: 'Set up AI tools for research, writing, and editing.'
      },
      {
        icon: Lightbulb,
        title: 'Prompt Library',
        description: 'Created custom prompt templates for different content types.'
      },
      {
        icon: GraduationCap,
        title: 'AI Training',
        description: 'Intensive training on AI writing tools and techniques.'
      },
      {
        icon: BarChart,
        title: 'Quality Metrics',
        description: 'Implemented content quality tracking system.'
      }
    ],
    results: 'The team significantly increased their content output while maintaining high quality standards.',
    resultMetrics: [
      {
        icon: TrendingUp,
        value: '3x',
        label: 'Content Volume'
      },
      {
        icon: Clock,
        value: '65%',
        label: 'Time Saved'
      },
      {
        icon: Users,
        value: '80%',
        label: 'Client Retention'
      }
    ],
    metrics: {
      improvement: '3x content volume',
      timeframe: '6 weeks',
      teamSize: '3 team members',
      completion: 'Fully implemented'
    },
    services: [
      'AI Writing Tools',
      'Process Automation',
      'Content Strategy',
      'Ongoing Support'
    ]
  }
];