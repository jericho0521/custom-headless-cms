export interface ContentItem {
  id: string;
  title: string;
  slug: string;
  excerpt: string;
  body: string;
  coverImage: string;
  status: 'draft' | 'published' | 'scheduled' | 'archived';
  type: 'post' | 'story';
  author: string;
  authorEmail: string;
  categories: string[];
  tags: string[];
  updatedAt: string;
  publishedAt?: string;
  seoTitle: string;
  seoDescription: string;
}

export interface MediaAsset {
  id: string;
  filename: string;
  url: string;
  altText: string;
  dimensions: string;
  fileSize: string;
  uploadedAt: string;
  provider: 'Local' | 'AWS S3' | 'Cloudflare R2';
  mimeType: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  status: 'Active' | 'Pending' | 'Disabled';
  avatar?: string;
}

export interface ApiToken {
  id: string;
  name: string;
  token: string;
  role: 'Admin' | 'Editor' | 'Viewer';
  createdAt: string;
  lastUsed: string;
}

export interface Webhook {
  id: string;
  url: string;
  events: string[];
  status: 'active' | 'inactive';
  secret: string;
}

export interface StorageProvider {
  id: string;
  name: string;
  provider: 'local' | 's3' | 'r2';
  status: 'active' | 'inactive' | 'error';
  isDefault: boolean;
  config: {
    bucketName?: string;
    region?: string;
    endpoint?: string;
    accessKeyId?: string;
    secretAccessKey?: string;
    localPath?: string;
  };
}

// Global Mock Database
export const mockPosts: ContentItem[] = [
  {
    id: 'post-1',
    title: 'Designing with Density: The Modern Editorial Workplace',
    slug: 'designing-with-density-editorial-workplace',
    excerpt: 'How we structured a high-information-density UI for writers, editors, and digital curators who manage high-traffic publishing pipelines.',
    body: `<p>In modern web applications, the trend has heavily favored generous whitespace, massive cards, and minimal content density. While this works well for marketing landing pages and simplified consumer feeds, it fails authors and content curators who live inside editing consoles for hours every day.</p>
<p>An editorial workspace is a tool of production, not consumption. It should be treated like an IDE: dense, keyboard-accessible, fast to scan, and focused on layout hierarchy rather than visual fluff. In this piece, we explore the design systems that fuel high-velocity publishing interfaces.</p>
<h2>Visual Restraint and Tone</h2>
<p>To reduce eye strain over long editing sessions, the dashboard should employ a restrained grayscale palette. Accent colors should be reserved exclusively for actionable alerts and status badges.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    type: 'post',
    author: 'Elena Rostova',
    authorEmail: 'elena@presscms.io',
    categories: ['Design', 'Productivity'],
    tags: ['UI', 'UX', 'Typography', 'Density'],
    updatedAt: '2026-06-20',
    publishedAt: '2026-06-20',
    seoTitle: 'Designing High Density Editorial Workspaces | PressCMS',
    seoDescription: 'Explore the details of crafting UI systems that work for professional writers and digital publishers.'
  },
  {
    id: 'post-2',
    title: 'Headless CMS Architecture in 2026',
    slug: 'headless-cms-architecture-2026',
    excerpt: 'An overview of multi-provider storage adapters, edge-side ISR rendering, and webhook routing triggers.',
    body: `<p>Selecting a headless CMS starter template should not lock developers into a single database or storage tier. As serverless architectures mature, the trend shifts toward modular adapter patterns.</p>
<p>In this architecture review, we cover how local development storage directories can swap seamlessly into Cloudflare R2 or AWS S3 at deployment, using a clean TypeScript interface pattern.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    status: 'scheduled',
    type: 'post',
    author: 'Marcus Chen',
    authorEmail: 'marcus@presscms.io',
    categories: ['Engineering', 'Architecture'],
    tags: ['Nextjs', 'TypeScript', 'S3', 'Edge'],
    updatedAt: '2026-06-19',
    publishedAt: '2026-06-25',
    seoTitle: 'Future-Proof Headless CMS Architectures (2026) | PressCMS',
    seoDescription: 'Technical breakdown of writing modular media and data layers for Next.js.'
  },
  {
    id: 'post-3',
    title: 'The Shift to Local-First Content Staging',
    slug: 'shift-to-local-first-content-staging',
    excerpt: 'Why development teams are moving away from centralized QA sandboxes back to local git-branched content structures.',
    body: `<p>Centralized CMS sandboxes present constant sync problems for front-end engineers. By utilizing a local file-based database for development, developers can write content, branch the schema, and commit changes with standard git versioning before migrating to production Postgres or MySQL databases.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
    status: 'draft',
    type: 'post',
    author: 'Elena Rostova',
    authorEmail: 'elena@presscms.io',
    categories: ['Engineering'],
    tags: ['Git', 'LocalFirst', 'Staging'],
    updatedAt: '2026-06-18',
    seoTitle: 'Local-First Content Staging Workflows',
    seoDescription: 'Why code-adjacent content storage is winning the staging battle.'
  },
  {
    id: 'post-4',
    title: 'Press Release: PressCMS Seed Round funding',
    slug: 'press-release-seed-funding-round',
    excerpt: 'Announcing our $4.2M seed round to build developer-centric open-source editorial software.',
    body: `<p>Today we are thrilled to announce a $4.2 million seed funding round led by Matrix Partners. This capital will help us scale our core open-source framework and deliver the next generation of modular headless publishing infrastructure.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    status: 'archived',
    type: 'post',
    author: 'Elena Rostova',
    authorEmail: 'elena@presscms.io',
    categories: ['News'],
    tags: ['Company', 'Funding', 'Seed'],
    updatedAt: '2026-05-12',
    publishedAt: '2026-05-12',
    seoTitle: 'PressCMS Seed Funding Announcement',
    seoDescription: 'Matrix Partners leads a $4.2M seed round for developer-friendly CMS systems.'
  },
  {
    id: 'story-1',
    title: 'About Our Editorial Standards',
    slug: 'about-editorial-standards',
    excerpt: 'Our commitment to journalistic integrity, peer reviews, fact-checking pipelines, and structural corrections.',
    body: `<p>We believe in publishing accurate, thoroughly researched technical content. Each story undergoes a triple-blind peer review before publication, and we maintain an audit trail of corrections.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    type: 'story',
    author: 'Marcus Chen',
    authorEmail: 'marcus@presscms.io',
    categories: ['Policies'],
    tags: ['Compliance', 'Editorial', 'Standards'],
    updatedAt: '2026-06-01',
    publishedAt: '2026-06-05',
    seoTitle: 'Editorial Integrity and Standards Policy | PressCMS',
    seoDescription: 'Our internal guidelines for technical writing, source auditing, and review processes.'
  },
  {
    id: 'story-2',
    title: 'Privacy Policy',
    slug: 'privacy-policy',
    excerpt: 'Detailed disclosures regarding visitor data processing, cookie logs, and third-party script integrations.',
    body: `<p>This privacy policy describes how we handle user data. We do not sell tracking profiles to brokers, and we scrub server logs of IP identifiers every 14 days.</p>`,
    coverImage: 'https://images.unsplash.com/photo-1508962914676-134849a727f0?q=80&w=800&auto=format&fit=crop',
    status: 'published',
    type: 'story',
    author: 'Marcus Chen',
    authorEmail: 'marcus@presscms.io',
    categories: ['Legal'],
    tags: ['GDPR', 'Compliance', 'Privacy'],
    updatedAt: '2026-01-10',
    publishedAt: '2026-01-15',
    seoTitle: 'Privacy & Data Protection Policies',
    seoDescription: 'Detailed breakdown of customer cookies and data retention logs.'
  }
];

export const mockMedia: MediaAsset[] = [
  {
    id: 'media-1',
    filename: 'editorial-desk.jpg',
    url: 'https://images.unsplash.com/photo-1499750310107-5fef28a66643?q=80&w=800&auto=format&fit=crop',
    altText: 'A close up of a clean wooden desk with a notebook, pen, and open laptop.',
    dimensions: '1920 x 1280',
    fileSize: '432 KB',
    uploadedAt: '2026-06-20',
    provider: 'Cloudflare R2',
    mimeType: 'image/jpeg'
  },
  {
    id: 'media-2',
    filename: 'source-code.jpg',
    url: 'https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop',
    altText: 'Lines of colored typescript code displayed on a dark developer monitor.',
    dimensions: '2048 x 1365',
    fileSize: '685 KB',
    uploadedAt: '2026-06-19',
    provider: 'Cloudflare R2',
    mimeType: 'image/jpeg'
  },
  {
    id: 'media-3',
    filename: 'terminal-window.jpg',
    url: 'https://images.unsplash.com/photo-1542831371-29b0f74f9713?q=80&w=800&auto=format&fit=crop',
    altText: 'A command line terminal open on a Linux operating system.',
    dimensions: '1440 x 900',
    fileSize: '298 KB',
    uploadedAt: '2026-06-18',
    provider: 'AWS S3',
    mimeType: 'image/jpeg'
  },
  {
    id: 'media-4',
    filename: 'headquarters-building.jpg',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?q=80&w=800&auto=format&fit=crop',
    altText: 'Tall glass corporate office tower reflecting blue sky and clouds.',
    dimensions: '3840 x 2560',
    fileSize: '1.4 MB',
    uploadedAt: '2026-05-12',
    provider: 'AWS S3',
    mimeType: 'image/jpeg'
  },
  {
    id: 'media-5',
    filename: 'library-archives.jpg',
    url: 'https://images.unsplash.com/photo-1457369804613-52c61a468e7d?q=80&w=800&auto=format&fit=crop',
    altText: 'Stack of vintage hardcover books in an archive.',
    dimensions: '1920 x 1280',
    fileSize: '512 KB',
    uploadedAt: '2026-06-01',
    provider: 'Local',
    mimeType: 'image/jpeg'
  }
];

export const mockUsers: User[] = [
  {
    id: 'user-1',
    name: 'Elena Rostova',
    email: 'elena@presscms.io',
    role: 'Admin',
    status: 'Active',
    avatar: 'ER'
  },
  {
    id: 'user-2',
    name: 'Marcus Chen',
    email: 'marcus@presscms.io',
    role: 'Editor',
    status: 'Active',
    avatar: 'MC'
  },
  {
    id: 'user-3',
    name: 'Sarah Jenkins',
    email: 'sarah.j@presscms.io',
    role: 'Viewer',
    status: 'Pending',
    avatar: 'SJ'
  },
  {
    id: 'user-4',
    name: 'David Kross',
    email: 'david.k@presscms.io',
    role: 'Editor',
    status: 'Disabled',
    avatar: 'DK'
  }
];

export const mockApiTokens: ApiToken[] = [
  {
    id: 'token-1',
    name: 'Production Next.js Frontend',
    token: 'cms_live_7a3d9bc4ef819283f048d01128',
    role: 'Viewer',
    createdAt: '2026-05-15',
    lastUsed: '2026-06-20 15:12'
  },
  {
    id: 'token-2',
    name: 'Local Dev Environment',
    token: 'cms_test_0bb8e3185764bb18bf72068cb2',
    role: 'Admin',
    createdAt: '2026-06-18',
    lastUsed: '2026-06-20 14:48'
  }
];

export const mockWebhooks: Webhook[] = [
  {
    id: 'webhook-1',
    url: 'https://api.vercel.app/v1/webhooks/deploy-trigger',
    events: ['post.published', 'post.archived'],
    status: 'active',
    secret: 'whsec_a8b92d04fef8e72'
  },
  {
    id: 'webhook-2',
    url: 'https://analytics.presscms.io/collect',
    events: ['post.published', 'media.uploaded'],
    status: 'inactive',
    secret: 'whsec_f8934b12c890def'
  }
];

export const mockStorageProviders: StorageProvider[] = [
  {
    id: 'provider-1',
    name: 'Local Dev Directory',
    provider: 'local',
    status: 'active',
    isDefault: true,
    config: {
      localPath: './public/uploads'
    }
  },
  {
    id: 'provider-2',
    name: 'Production Cloudflare R2',
    provider: 'r2',
    status: 'active',
    isDefault: false,
    config: {
      bucketName: 'presscms-media',
      endpoint: 'https://xxxx.r2.cloudflarestorage.com',
      accessKeyId: 'LTAI5tH...'
    }
  },
  {
    id: 'provider-3',
    name: 'AWS S3 Asset Store',
    provider: 's3',
    status: 'error',
    isDefault: false,
    config: {
      bucketName: 's3-press-prod',
      region: 'us-east-1'
    }
  }
];
