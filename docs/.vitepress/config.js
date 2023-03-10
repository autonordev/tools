const REPO = 'https://github.com/autonordev/gaffer'

const nav = [
  {
    text: 'Examples',
    link: '/extras/examples'
  },
  {
    text: 'Version',
    items: [
      { text: 'v0.0', link: '/0.0/guide/introduction' },
    ]
  }
]

const sidebar = {
  'extras': [
    {
      text: 'Extras',
      items: [
        { text: 'Examples', link: '/extras/examples' },
      ]
    }
  ],

  '/0.0/': [
    {
      text: 'Guide',
      items: [
        { text: 'Introduction', link: '/0.0/guide/introduction' },
        { text: 'Installation', link: '/0.0/guide/installation' },
        { text: 'Concepts', link: '/0.0/guide/concepts' },
        { text: 'Practices', link: '/0.0/guide/practices' },
      ]
    },
    {
      text: 'Tutorial',
      items: [
        { text: 'Getting Started', link: '/0.0/tutorial/getting-started' },
        { text: 'Our first project', link: '/0.0/tutorial/our-first-project' },
        { text: 'Our first package', link: '/0.0/tutorial/our-first-package' },
        { text: 'Using with Luau LSP', link: '/0.0/tutorial/luau-lsp' },
        { text: 'Using with Wally', link: '/0.0/tutorial/wally' },
        { text: 'Advanced packages', link: '/0.0/tutorial/advanced-packages' },
      ]
    },
    {
      text: 'Reference',
      items: [
        { text: 'Workspaces', link: '/0.0/reference/workspaces' },
        { text: 'Projects', link: '/0.0/reference/projects' },
        { text: 'Packages', link: '/0.0/reference/packages' },
        { text: 'Trees', link: '/0.0/reference/trees' },
        { text: 'Commands', link: '/0.0/reference/commands' },

        // always at bottom
        { text: 'Errors', link: '/0.0/reference/errors' },
      ]
    }
  ]
}

const base = process.env.NODE_ENV === 'development' ? undefined : '/gaffer/'

export default {
  title: 'Gaffer',
  description: 'A monorepo orchestrator for Roblox developers.',
  lang: 'en',
  base,
  head: [
    ['link', { rel: 'icon', href: `${base || '/'}favicon.ico` }]
  ],

  themeConfig: {
    logo: { light: '/logo-black.png', dark: '/logo-white.png' },
    socialLinks: [
      { icon: 'github', link: REPO }
    ],
    editLink: {
      pattern: `${REPO}/blob/main/docs/:path`,
      text: 'View source'
    },

    lastUpdated: true,

    sidebar,
    nav,
  },
}
