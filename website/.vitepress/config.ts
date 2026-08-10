import tailwindcss from '@tailwindcss/vite';
import { defineConfig } from 'vitepress';
import rootPkg from '../../package.json' with { type: 'json' };

const SITE_ORIGIN = 'https://dsrailab.github.io';
const SITE_BASE = '/dsr-codesign/';
const SITE_URL = `${SITE_ORIGIN}${SITE_BASE}`;
const REPOSITORY_URL = 'https://github.com/DSR-AI-Lab/dsr-codesign';
const ORGANIZATION_URL = 'https://github.com/DSR-AI-Lab';
const RELEASES_URL = `${REPOSITORY_URL}/releases`;
const OG_IMAGE = `${SITE_URL}og.svg`;
const PROJECT_FACTS_URL = `${SITE_URL}project.json`;
const SITE_INDEX_URL = `${SITE_URL}site-index.json`;
const FAQ_DATA_URL = `${SITE_URL}faq.json`;
const SOFTWARE_VERSION = (rootPkg as { version: string }).version;
const LATEST_RELEASE_URL = `${RELEASES_URL}/tag/v${SOFTWARE_VERSION}`;

type PageMeta = {
  name: string;
  description: string;
  schemaType?: 'WebPage' | 'AboutPage' | 'TechArticle' | 'FAQPage';
};

const PAGE_METADATA: Record<string, PageMeta> = {
  '': {
    name: 'DSR CoDesign',
    description:
      'DSR CoDesign is an open-source desktop AI design tool with BYOK model support, local-first storage, and MIT licensing.',
    schemaType: 'AboutPage',
  },
  quickstart: {
    name: 'DSR CoDesign Quickstart',
    description: 'Install DSR CoDesign and render a first AI-generated prototype.',
    schemaType: 'TechArticle',
  },
  architecture: {
    name: 'DSR CoDesign Architecture',
    description: 'Package boundaries and technical architecture for the DSR CoDesign monorepo.',
    schemaType: 'TechArticle',
  },
  roadmap: {
    name: 'DSR CoDesign Roadmap',
    description: 'Planned DSR CoDesign releases from v0.1 through v1.0.',
    schemaType: 'TechArticle',
  },
  faq: {
    name: 'DSR CoDesign FAQ',
    description: 'Frequently asked questions about DSR CoDesign.',
    schemaType: 'FAQPage',
  },
  'claude-design-alternative': {
    name: 'DSR CoDesign vs Claude Design',
    description: 'Comparison of DSR CoDesign and Anthropic Claude Design.',
  },
  'v0-alternative': {
    name: 'DSR CoDesign vs v0 by Vercel',
    description: 'Comparison of DSR CoDesign and v0 by Vercel.',
  },
  'lovable-alternative': {
    name: 'DSR CoDesign vs Lovable',
    description: 'Comparison of DSR CoDesign and Lovable.',
  },
  'bolt-alternative': {
    name: 'DSR CoDesign vs Bolt.new',
    description: 'Comparison of DSR CoDesign and Bolt.new.',
  },
  'figma-ai-alternative': {
    name: 'DSR CoDesign vs Figma AI',
    description: 'Comparison of DSR CoDesign and Figma AI.',
  },
  'zh/': {
    name: 'DSR CoDesign',
    description:
      'DSR CoDesign 是一款开源桌面 AI 设计工具，支持自带模型密钥、本地优先存储和 MIT 协议。',
    schemaType: 'AboutPage',
  },
  'zh/quickstart': {
    name: 'DSR CoDesign 快速开始',
    description: '安装 DSR CoDesign 并生成第一个 AI 设计原型。',
    schemaType: 'TechArticle',
  },
  'zh/faq': {
    name: 'DSR CoDesign 常见问题',
    description: 'DSR CoDesign 的常见问题。',
    schemaType: 'FAQPage',
  },
  'zh/claude-design-alternative': {
    name: 'DSR CoDesign vs Claude Design',
    description: 'DSR CoDesign 与 Anthropic Claude Design 的功能和取舍对比。',
  },
};

const FAQ_MAIN_ENTITY = [
  {
    '@type': 'Question',
    name: 'What is DSR CoDesign?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'DSR CoDesign is an open-source desktop AI design tool that turns natural-language prompts into HTML prototypes, JSX/React components, slide decks, PDFs, and marketing assets. It is an open-source alternative to Claude Design, v0, Bolt.new, Lovable, and Figma AI.',
    },
  },
  {
    '@type': 'Question',
    name: 'Is DSR CoDesign free?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'Yes. DSR CoDesign is MIT licensed and free to download, use, modify, and redistribute. Users bring their own model provider key or subscription and pay the provider directly.',
    },
  },
  {
    '@type': 'Question',
    name: 'Which AI models can I use with DSR CoDesign?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'DSR CoDesign supports Anthropic Claude, OpenAI GPT, Google Gemini, DeepSeek, OpenRouter, SiliconFlow, local Ollama, and OpenAI-compatible endpoints. It also supports keyless IP-allowlisted proxies and ChatGPT Plus / Codex subscription login.',
    },
  },
  {
    '@type': 'Question',
    name: 'Does DSR CoDesign send my data to the cloud?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'No. Designs, prompts, settings, and generated files stay on the user machine. The only outbound network traffic is to the model provider the user configures.',
    },
  },
  {
    '@type': 'Question',
    name: 'Which platforms are supported?',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'DSR CoDesign supports macOS on Apple Silicon and Intel, Windows on x64 and arm64, and Linux via AppImage, deb, and rpm packages.',
    },
  },
];

const ZH_FAQ_MAIN_ENTITY = [
  {
    '@type': 'Question',
    name: 'DSR CoDesign 是什么？',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'DSR CoDesign 是一款开源桌面 AI 设计工具，可以把自然语言提示词转换成 HTML 原型、React 组件、幻灯片、PDF 和营销素材。',
    },
  },
  {
    '@type': 'Question',
    name: 'DSR CoDesign 免费吗？',
    acceptedAnswer: {
      '@type': 'Answer',
      text: '免费。DSR CoDesign 使用 MIT 协议，用户只需要为自己选择的模型提供商付费。',
    },
  },
  {
    '@type': 'Question',
    name: 'DSR CoDesign 支持哪些模型？',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'DSR CoDesign 支持 Anthropic Claude、OpenAI GPT、Google Gemini、DeepSeek、OpenRouter、SiliconFlow、本地 Ollama、OpenAI 兼容端点、keyless 代理，以及 ChatGPT Plus / Codex 订阅登录。',
    },
  },
  {
    '@type': 'Question',
    name: 'DSR CoDesign 会把数据发到云端吗？',
    acceptedAnswer: {
      '@type': 'Answer',
      text: '不会。设计、提示词、设置和生成文件默认保存在本机。唯一对外网络流量是用户自己配置的模型提供商请求。',
    },
  },
  {
    '@type': 'Question',
    name: 'DSR CoDesign 支持哪些平台？',
    acceptedAnswer: {
      '@type': 'Answer',
      text: 'DSR CoDesign 支持 macOS Apple Silicon、macOS Intel、Windows x64、Windows ARM64，以及 Linux AppImage、deb、rpm 安装包。',
    },
  },
];

export default defineConfig({
  title: 'DSR CoDesign',
  titleTemplate: ':title — DSR CoDesign',
  description:
    'Open-source desktop AI design tool — the self-hosted alternative to Claude Design. Multi-model BYOK (Anthropic, OpenAI, Gemini, DeepSeek, Ollama), local-first, MIT.',
  lang: 'en-US',

  base: SITE_BASE,
  cleanUrls: true,
  lastUpdated: true,

  vite: {
    plugins: [tailwindcss()],
  },

  head: [
    ['link', { rel: 'icon', type: 'image/x-icon', href: `${SITE_BASE}favicon.ico` }],
    [
      'link',
      { rel: 'icon', type: 'image/png', sizes: '32x32', href: `${SITE_BASE}favicon-32x32.png` },
    ],
    [
      'link',
      { rel: 'icon', type: 'image/png', sizes: '16x16', href: `${SITE_BASE}favicon-16x16.png` },
    ],
    [
      'link',
      { rel: 'apple-touch-icon', sizes: '180x180', href: `${SITE_BASE}apple-touch-icon.png` },
    ],
    ['meta', { name: 'theme-color', content: '#c96442' }],
    ['meta', { name: 'google-site-verification', content: 'c3cbbeaec5437546' }],
    // Open Graph
    ['meta', { property: 'og:type', content: 'website' }],
    ['meta', { property: 'og:site_name', content: 'DSR CoDesign' }],
    ['meta', { property: 'og:title', content: 'DSR CoDesign — Open-Source AI Design Tool' }],
    [
      'meta',
      {
        property: 'og:description',
        content:
          'Open-source desktop AI design tool. A self-hosted alternative to Claude Design. Prompt to prototype, slide deck, or marketing asset. Multi-model BYOK, local-first, MIT.',
      },
    ],
    ['meta', { property: 'og:image', content: OG_IMAGE }],
    ['meta', { property: 'og:image:width', content: '1200' }],
    ['meta', { property: 'og:image:height', content: '630' }],
    ['meta', { property: 'og:url', content: SITE_URL }],
    // Twitter / X
    ['meta', { name: 'twitter:card', content: 'summary_large_image' }],
    ['meta', { name: 'twitter:site', content: '@DSR-AI-Lab' }],
    ['meta', { name: 'twitter:title', content: 'DSR CoDesign — Open-Source AI Design Tool' }],
    [
      'meta',
      {
        name: 'twitter:description',
        content: 'Open-source desktop AI design tool. BYOK, local-first, MIT. Runs on your laptop.',
      },
    ],
    ['meta', { name: 'twitter:image', content: OG_IMAGE }],
    // SEO keywords — natural density, not stuffed
    [
      'meta',
      {
        name: 'keywords',
        content:
          'open source AI design tool, Claude Design alternative, BYOK design app, local-first design generator, AI prototype generator, prompt to HTML, prompt to React component, dsr-codesign, multi-model design, Electron design app',
      },
    ],
    ['meta', { name: 'robots', content: 'index,follow,max-image-preview:large' }],
    ['meta', { name: 'author', content: 'DSR-AI-Lab' }],
    ['link', { rel: 'license', href: `${REPOSITORY_URL}/blob/main/LICENSE` }],
    ['link', { rel: 'sitemap', type: 'application/xml', href: `${SITE_URL}sitemap.xml` }],
    [
      'link',
      { rel: 'alternate', type: 'text/markdown', title: 'llms.txt', href: `${SITE_URL}llms.txt` },
    ],
    [
      'link',
      {
        rel: 'alternate',
        type: 'text/markdown',
        title: 'llms-full.txt',
        href: `${SITE_URL}llms-full.txt`,
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/json',
        title: 'DSR CoDesign project facts',
        href: PROJECT_FACTS_URL,
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/json',
        title: 'DSR CoDesign site index',
        href: SITE_INDEX_URL,
      },
    ],
    [
      'link',
      {
        rel: 'alternate',
        type: 'application/json',
        title: 'DSR CoDesign FAQ data',
        href: FAQ_DATA_URL,
      },
    ],
    ['link', { rel: 'alternate', hreflang: 'en', href: SITE_URL }],
    ['link', { rel: 'alternate', hreflang: 'zh-CN', href: `${SITE_URL}zh/` }],
    ['link', { rel: 'alternate', hreflang: 'x-default', href: SITE_URL }],
    // JSON-LD — WebSite
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebSite',
        '@id': `${SITE_URL}#website`,
        name: 'DSR CoDesign',
        url: SITE_URL,
        description:
          'Open-source desktop AI design tool with BYOK model support, local-first storage, and MIT licensing.',
        inLanguage: ['en-US', 'zh-CN'],
        publisher: { '@id': `${SITE_URL}#organization` },
        about: { '@id': `${SITE_URL}#software` },
        sameAs: [REPOSITORY_URL, ORGANIZATION_URL, 'https://twitter.com/DSR-AI-Lab'],
        hasPart: [
          `${SITE_URL}quickstart`,
          `${SITE_URL}architecture`,
          `${SITE_URL}roadmap`,
          `${SITE_URL}faq`,
          `${SITE_URL}claude-design-alternative`,
          PROJECT_FACTS_URL,
          SITE_INDEX_URL,
          FAQ_DATA_URL,
          `${SITE_URL}llms.txt`,
          `${SITE_URL}llms-full.txt`,
        ],
      }),
    ],
    // JSON-LD — SoftwareApplication
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'SoftwareApplication',
        '@id': `${SITE_URL}#software`,
        name: 'DSR CoDesign',
        alternateName: 'dsr-codesign',
        description:
          'Open-source desktop AI design tool. The open-source alternative to Anthropic Claude Design. Prompt to interactive prototype, slide deck, and marketing assets. Multi-model BYOK, local-first.',
        url: SITE_URL,
        mainEntityOfPage: { '@id': `${SITE_URL}#website` },
        applicationCategory: 'DesignApplication',
        operatingSystem: 'macOS, Windows, Linux',
        softwareVersion: SOFTWARE_VERSION,
        releaseNotes: LATEST_RELEASE_URL,
        downloadUrl: RELEASES_URL,
        screenshot: [
          `${SITE_ORIGIN}/dsr-codesign/screenshots/product-hero.png`,
          `${SITE_ORIGIN}/dsr-codesign/screenshots/comment-mode.png`,
        ],
        applicationSubCategory: 'AI Design Tool',
        isAccessibleForFree: true,
        featureList: [
          'Prompt-to-HTML prototype generation',
          'Bring your own model key, local endpoint, enterprise proxy, or subscription login',
          'Local-first storage for prompts, designs, settings, and generated files',
          'Export to PDF, PPTX, ZIP, Markdown',
          'Multi-model switching without re-login',
          'One-click import of Claude Code / Codex API keys',
          'AI image generation for design assets',
          'Design history with snapshots and rollback',
        ],
        offers: {
          '@type': 'Offer',
          price: '0',
          priceCurrency: 'USD',
          description: 'Free and open source. Bring your own API key (token cost only).',
        },
        license: `${REPOSITORY_URL}/blob/main/LICENSE`,
        codeRepository: REPOSITORY_URL,
        author: {
          '@type': 'Organization',
          '@id': `${SITE_URL}#organization`,
          name: 'DSR-AI-Lab',
          url: ORGANIZATION_URL,
        },
        subjectOf: [
          {
            '@type': 'CreativeWork',
            name: 'DSR CoDesign llms.txt',
            url: `${SITE_URL}llms.txt`,
            encodingFormat: 'text/markdown',
          },
          {
            '@type': 'CreativeWork',
            name: 'DSR CoDesign full AI-readable context',
            url: `${SITE_URL}llms-full.txt`,
            encodingFormat: 'text/markdown',
          },
          {
            '@type': 'Dataset',
            name: 'DSR CoDesign project facts',
            url: PROJECT_FACTS_URL,
            encodingFormat: 'application/json',
          },
          {
            '@type': 'Dataset',
            name: 'DSR CoDesign site index',
            url: SITE_INDEX_URL,
            encodingFormat: 'application/json',
          },
          {
            '@type': 'Dataset',
            name: 'DSR CoDesign FAQ data',
            url: FAQ_DATA_URL,
            encodingFormat: 'application/json',
          },
        ],
        keywords:
          'Claude Design alternative, open source AI design, BYOK, local-first, Anthropic, Electron desktop app, prompt to prototype, React component generator, AI design tool',
      }),
    ],
    // JSON-LD — Organization
    [
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'Organization',
        '@id': `${SITE_URL}#organization`,
        name: 'DSR-AI-Lab',
        url: ORGANIZATION_URL,
        logo: `${SITE_URL}logo.png`,
        sameAs: [ORGANIZATION_URL, 'https://twitter.com/DSR-AI-Lab'],
      }),
    ],
  ],

  sitemap: { hostname: SITE_URL },

  transformPageData(pageData) {
    const path = pageData.relativePath.replace(/index\.md$/, '').replace(/\.md$/, '');
    const canonical = `${SITE_URL}${path}`;
    const pageMeta = PAGE_METADATA[path] ?? {
      name: pageData.title ? `${pageData.title} - DSR CoDesign` : 'DSR CoDesign',
      description: pageData.description ?? 'DSR CoDesign project page.',
      schemaType: 'WebPage',
    };
    const inLanguage = path.startsWith('zh/') ? 'zh-CN' : 'en-US';
    pageData.frontmatter.head ??= [];
    pageData.frontmatter.head.push(['link', { rel: 'canonical', href: canonical }]);
    pageData.frontmatter.head.push([
      'script',
      { type: 'application/ld+json' },
      JSON.stringify({
        '@context': 'https://schema.org',
        '@type': pageMeta.schemaType === 'FAQPage' ? 'WebPage' : (pageMeta.schemaType ?? 'WebPage'),
        '@id': `${canonical}#webpage`,
        url: canonical,
        name: pageMeta.name,
        description: pageMeta.description,
        inLanguage,
        isPartOf: { '@id': `${SITE_URL}#website` },
        about: { '@id': `${SITE_URL}#software` },
        publisher: { '@id': `${SITE_URL}#organization` },
        primaryImageOfPage: {
          '@type': 'ImageObject',
          url: OG_IMAGE,
          width: 1200,
          height: 630,
        },
      }),
    ]);
    if (path === 'faq' || path === 'zh/faq') {
      pageData.frontmatter.head.push([
        'script',
        { type: 'application/ld+json' },
        JSON.stringify({
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          '@id': `${canonical}#faq`,
          url: canonical,
          inLanguage,
          isPartOf: { '@id': `${SITE_URL}#website` },
          mainEntity: path === 'zh/faq' ? ZH_FAQ_MAIN_ENTITY : FAQ_MAIN_ENTITY,
        }),
      ]);
    }
  },

  themeConfig: {
    logo: { src: '/logo.png', alt: 'dsr-codesign' },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Features', link: '/#features' },
      { text: 'Quickstart', link: '/quickstart' },
      {
        text: 'Compare',
        items: [
          { text: 'vs Claude Design', link: '/claude-design-alternative' },
          { text: 'vs v0 by Vercel', link: '/v0-alternative' },
          { text: 'vs Lovable', link: '/lovable-alternative' },
          { text: 'vs Bolt.new', link: '/bolt-alternative' },
          { text: 'vs Figma AI', link: '/figma-ai-alternative' },
        ],
      },
      { text: 'Architecture', link: '/architecture' },
      { text: 'Roadmap', link: '/roadmap' },
      { text: 'FAQ', link: '/faq' },
      {
        text: 'Changelog',
        link: 'https://github.com/DSR-AI-Lab/dsr-codesign/blob/main/CHANGELOG.md',
      },
    ],

    sidebar: [
      {
        text: 'Get started',
        items: [
          { text: 'Overview', link: '/' },
          { text: 'Quickstart', link: '/quickstart' },
        ],
      },
      {
        text: 'Compare',
        items: [
          { text: 'vs Claude Design', link: '/claude-design-alternative' },
          { text: 'vs v0 by Vercel', link: '/v0-alternative' },
          { text: 'vs Lovable', link: '/lovable-alternative' },
          { text: 'vs Bolt.new', link: '/bolt-alternative' },
          { text: 'vs Figma AI', link: '/figma-ai-alternative' },
        ],
      },
      {
        text: 'Project',
        items: [
          { text: 'Architecture', link: '/architecture' },
          { text: 'Roadmap', link: '/roadmap' },
          {
            text: 'Changelog',
            link: 'https://github.com/DSR-AI-Lab/dsr-codesign/blob/main/CHANGELOG.md',
          },
        ],
      },
    ],

    socialLinks: [{ icon: 'github', link: 'https://github.com/DSR-AI-Lab/dsr-codesign' }],

    footer: {
      message:
        'Released under the <a href="https://opensource.org/licenses/MIT">MIT License</a>. · <a href="https://github.com/DSR-AI-Lab/dsr-codesign/blob/main/CONTRIBUTING.md">Contribute</a> · <a href="https://github.com/DSR-AI-Lab/dsr-codesign/issues">Issues</a>',
      copyright: '© 2026-present DSR-AI-Lab',
    },
  },

  locales: {
    root: {
      label: 'English',
      lang: 'en',
    },
    zh: {
      label: '中文',
      lang: 'zh-CN',
      title: 'DSR CoDesign',
      description:
        '开源桌面 AI 设计工具——Claude Design 的自托管替代方案。自带 API Key（Anthropic、OpenAI、Gemini、DeepSeek、Ollama），100% 本地运行，MIT。',
      themeConfig: {
        nav: [
          { text: '首页', link: '/zh/' },
          { text: '快速开始', link: '/zh/quickstart' },
          { text: '对比 Claude Design', link: '/zh/claude-design-alternative' },
          { text: '常见问题', link: '/zh/faq' },
          { text: 'GitHub', link: 'https://github.com/DSR-AI-Lab/dsr-codesign' },
        ],
        sidebar: [
          {
            text: '入门',
            items: [
              { text: '简介', link: '/zh/' },
              { text: '快速开始', link: '/zh/quickstart' },
              { text: '对比 Claude Design', link: '/zh/claude-design-alternative' },
              { text: '常见问题', link: '/zh/faq' },
            ],
          },
        ],
        footer: {
          message: '基于 MIT 协议开源。',
          copyright: '© 2026-present DSR-AI-Lab',
        },
      },
    },
  },
});
