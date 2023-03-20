// @ts-check
// Note: type annotations allow type checking and IDEs autocompletion

const lightCodeTheme = require('prism-react-renderer/themes/github')
const darkCodeTheme = require('prism-react-renderer/themes/dracula')

const editUrl = 'https://github.com/autonordev/tools/tree/main/website/'

/** @type {import('@docusaurus/types').Config} */
const config = {
  title: 'Tools',
  tagline:
    'A collection of open-source tools for use in the Roblox Development space.',
  favicon: 'favicon.ico',

  // Set the production url of your site here
  url: 'https://tools.autonor.me',
  // Set the /<baseUrl>/ pathname under which your site is served
  baseUrl: '/',

  // GitHub pages deployment config.
  organizationName: 'autonordev',
  projectName: 'tools',
  deploymentBranch: 'gh-pages',

  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  i18n: {
    defaultLocale: 'en',
    locales: ['en']
  },

  presets: [
    [
      'classic',
      // houses our blog and one single empty doc in the "docs" directory
      /** @type {import('@docusaurus/preset-classic').Options} */
      ({
        docs: {
          path: 'fake_docs'
        },
        blog: false,
        theme: {
          customCss: [require.resolve('./src/css/custom.css')]
        }
      })
    ]
  ],

  plugins: [
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'gaffer',
        path: 'docs_gaffer',
        routeBasePath: 'gaffer/docs',
        sidebarPath: require.resolve('./sidebars/gaffer.js'),
        editUrl,
        showLastUpdateTime: true,

        // versioning
        lastVersion: 'current',
        versions: {
          current: {
            label: '0.0',
            path: '0.0'
          }
        }
      }
    ],
    [
      '@docusaurus/plugin-content-docs',
      {
        id: 'axon',
        path: 'docs_axon',
        routeBasePath: 'axon/docs',
        sidebarPath: require.resolve('./sidebars/axon.js'),
        editUrl,
        showLastUpdateTime: true,

        // versioning
        lastVersion: 'current',
        versions: {
          current: {
            label: '0.0',
            path: '0.0'
          }
        }
      }
    ]
  ],

  themeConfig:
    /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
    ({
      image: '/img/logo-og.png',

      navbar: {
        title: 'Tools',
        logo: {
          alt: '',
          src: 'img/logo.png'
        },
        items: [
          { to: '/gaffer', label: 'Gaffer', position: 'left' },
          { to: '/axon', label: 'Axon', position: 'left' },

          {
            href: 'https://github.com/autonordev/tools/issues',
            label: 'Issues',
            position: 'left'
          },

          {
            type: 'docsVersionDropdown',
            position: 'right',
            dropdownItemsAfter: [
              {
                type: 'html',
                value: '<hr class="dropdown-separator">'
              },
              {
                href: 'https://github.com/ametools',
                label: 'View releases'
              }
            ]
          },

          {
            href: 'https://github.com/autonordev/tools',
            label: 'GitHub',
            position: 'right'
          }
        ]
      },

      prism: {
        theme: lightCodeTheme,
        darkTheme: darkCodeTheme,
        additionalLanguages: ['toml', 'lua', 'ignore', 'properties']
      },

      announcementBar: {
        id: 'ann-0', // increment when content changes
        content:
          'Beware: here be dragons! All projects contained within this site are, currently, experimental.',
        isCloseable: true,
        backgroundColor: '#d4351c',
        textColor: '#ffffff'
      },

      footer: {
        links: [],
        copyright: `Copyright © ${new Date().getFullYear()} autonor<br/>Licensed under MIT`
      }
    })
}

module.exports = config
