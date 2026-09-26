import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { WagmiProvider } from 'wagmi';
import { wagmiConfig } from './config/wallet';
import { DashboardLayout } from './layout/DashboardLayout';
import { ToastProvider } from './ui/toast';

const queryClient = new QueryClient({
  defaultOptions: { queries: { refetchOnWindowFocus: false } },
});

export default function AppRoot() {
  return (
    <WagmiProvider config={wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <DashboardLayout />
        </ToastProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
}
