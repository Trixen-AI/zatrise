import { createBrowserRouter, redirect } from 'react-router';
import Home from '@/pages/Home';
import NotFound from '@/pages/NotFound';
import PageLoader from '@/pages/PageLoader';
import Root from '@/pages/Root';

// Docs and the dashboard load on demand, so the landing page never ships the wallet stack.
const page = (load: () => Promise<{ default: React.ComponentType }>) => async () => ({ Component: (await load()).default });

export const router = createBrowserRouter([
  {
    element: <Root />,
    hydrateFallbackElement: <PageLoader />,
    children: [
      { path: '/', element: <Home /> },
      {
        path: '/docs',
        lazy: page(() => import('@/docs/DocsLayout')),
        children: [
          { index: true, lazy: page(() => import('@/docs/DocPage')) },
          { path: ':slug', lazy: page(() => import('@/docs/DocPage')) },
        ],
      },
      {
        path: '/app',
        lazy: page(() => import('@/app/AppRoot')),
        children: [
          { index: true, lazy: page(() => import('@/app/pages/Overview')) },
          { path: 'launches', lazy: page(() => import('@/app/pages/Launches')) },
          { path: 'launches/:id', lazy: page(() => import('@/app/pages/LaunchDetail')) },
          { path: 'create', lazy: page(() => import('@/app/pages/Create')) },
          { path: 'apply', loader: () => redirect('/app/create') },
          { path: 'stake', lazy: page(() => import('@/app/pages/Stake')) },
          { path: 'rewards', lazy: page(() => import('@/app/pages/Rewards')) },
          { path: 'govern', lazy: page(() => import('@/app/pages/Govern')) },
          { path: 'govern/:id', lazy: page(() => import('@/app/pages/ProposalDetail')) },
          { path: 'wallet', lazy: page(() => import('@/app/pages/Wallet')) },
          { path: 'activity', lazy: page(() => import('@/app/pages/Activity')) },
          { path: '*', lazy: page(() => import('@/app/pages/AppNotFound')) },
        ],
      },
      { path: '*', element: <NotFound /> },
    ],
  },
]);
