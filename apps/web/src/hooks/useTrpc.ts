import { QueryClient } from '@tanstack/react-query';
import { httpLink } from '@trpc/client/links/httpLink';
import { useState } from 'react';

import { trpc } from '../trpc';

export const useTrpc = () => {
  const [trpcQueryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: Infinity,
            refetchOnWindowFocus: false,
          },
        },
      }),
  );

  const [trpcClient] = useState(() =>
    trpc.createClient({ links: [httpLink({ url: `${import.meta.env.VITE_API_URL}/trpc` })] }),
  );

  return {
    trpcQueryClient,
    trpcClient,
  };
};
