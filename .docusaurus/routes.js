import React from 'react';
import ComponentCreator from '@docusaurus/ComponentCreator';

export default [
  {
    path: '/__docusaurus/debug',
    component: ComponentCreator('/__docusaurus/debug', '5ff'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/config',
    component: ComponentCreator('/__docusaurus/debug/config', '5ba'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/content',
    component: ComponentCreator('/__docusaurus/debug/content', 'a2b'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/globalData',
    component: ComponentCreator('/__docusaurus/debug/globalData', 'c3c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/metadata',
    component: ComponentCreator('/__docusaurus/debug/metadata', '156'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/registry',
    component: ComponentCreator('/__docusaurus/debug/registry', '88c'),
    exact: true
  },
  {
    path: '/__docusaurus/debug/routes',
    component: ComponentCreator('/__docusaurus/debug/routes', '000'),
    exact: true
  },
  {
    path: '/markdown-page',
    component: ComponentCreator('/markdown-page', '3d7'),
    exact: true
  },
  {
    path: '/docs',
    component: ComponentCreator('/docs', '8b9'),
    routes: [
      {
        path: '/docs',
        component: ComponentCreator('/docs', '1c7'),
        routes: [
          {
            path: '/docs',
            component: ComponentCreator('/docs', '71b'),
            routes: [
              {
                path: '/docs/articles/',
                component: ComponentCreator('/docs/articles/', 'b52'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-blog',
                component: ComponentCreator('/docs/articles/articles-memo-blog', 'ebf'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-book',
                component: ComponentCreator('/docs/articles/articles-memo-book', '768'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-css',
                component: ComponentCreator('/docs/articles/articles-memo-css', 'f10'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-deep-engine',
                component: ComponentCreator('/docs/articles/articles-memo-deep-engine', 'b14'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-deep-study',
                component: ComponentCreator('/docs/articles/articles-memo-deep-study', '310'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-javascript',
                component: ComponentCreator('/docs/articles/articles-memo-javascript', '07b'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-library',
                component: ComponentCreator('/docs/articles/articles-memo-library', '0ca'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-math',
                component: ComponentCreator('/docs/articles/articles-memo-math', 'e7f'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-nextjs',
                component: ComponentCreator('/docs/articles/articles-memo-nextjs', '766'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-react',
                component: ComponentCreator('/docs/articles/articles-memo-react', '0c2'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-recollections',
                component: ComponentCreator('/docs/articles/articles-memo-recollections', 'a7f'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-tech',
                component: ComponentCreator('/docs/articles/articles-memo-tech', 'd7d'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-typescript',
                component: ComponentCreator('/docs/articles/articles-memo-typescript', '6e8'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/articles-memo-web-fundamentals',
                component: ComponentCreator('/docs/articles/articles-memo-web-fundamentals', '72e'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/feconf',
                component: ComponentCreator('/docs/articles/feconf', '196'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/articles/jest-test-lecture',
                component: ComponentCreator('/docs/articles/jest-test-lecture', 'b63'),
                exact: true,
                sidebar: "articleSidebar"
              },
              {
                path: '/docs/books/',
                component: ComponentCreator('/docs/books/', '411'),
                exact: true,
                sidebar: "bookSidebar"
              },
              {
                path: '/docs/books/effective-javascript',
                component: ComponentCreator('/docs/books/effective-javascript', '70b'),
                exact: true,
                sidebar: "bookSidebar"
              },
              {
                path: '/docs/books/speaking-javascript',
                component: ComponentCreator('/docs/books/speaking-javascript', 'b44'),
                exact: true,
                sidebar: "bookSidebar"
              },
              {
                path: '/docs/TIL/20250407 java',
                component: ComponentCreator('/docs/TIL/20250407 java', '2bf'),
                exact: true,
                sidebar: "TILSidebar"
              },
              {
                path: '/docs/TIL/java lecture basic',
                component: ComponentCreator('/docs/TIL/java lecture basic', '5ab'),
                exact: true,
                sidebar: "TILSidebar"
              },
              {
                path: '/docs/TIL/java lecture intermediate',
                component: ComponentCreator('/docs/TIL/java lecture intermediate', '23b'),
                exact: true,
                sidebar: "TILSidebar"
              },
              {
                path: '/docs/TIL/nest-docs',
                component: ComponentCreator('/docs/TIL/nest-docs', '535'),
                exact: true,
                sidebar: "TILSidebar"
              },
              {
                path: '/docs/TIL/next-docs',
                component: ComponentCreator('/docs/TIL/next-docs', '9c3'),
                exact: true,
                sidebar: "TILSidebar"
              },
              {
                path: '/docs/TIL/react-docs-brief',
                component: ComponentCreator('/docs/TIL/react-docs-brief', '1f3'),
                exact: true,
                sidebar: "TILSidebar"
              },
              {
                path: '/docs/TIL/tailwind docs',
                component: ComponentCreator('/docs/TIL/tailwind docs', '0c0'),
                exact: true,
                sidebar: "TILSidebar"
              },
              {
                path: '/docs/TIL/TIL 20240921',
                component: ComponentCreator('/docs/TIL/TIL 20240921', '8f3'),
                exact: true,
                sidebar: "TILSidebar"
              }
            ]
          }
        ]
      }
    ]
  },
  {
    path: '/',
    component: ComponentCreator('/', 'e5f'),
    exact: true
  },
  {
    path: '*',
    component: ComponentCreator('*'),
  },
];
