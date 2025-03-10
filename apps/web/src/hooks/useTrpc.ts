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

<<<<<<< HEAD
  const [trpcClient] = useState(() => trpc.createClient({ links: [httpLink({ url: 'http://localhost:4000/trpc' })] }));
=======
  const [trpcClient] = useState(() =>
    trpc.createClient({ links: [httpLink({ url: `${import.meta.env.VITE_API_URL}/trpc` })] }),
  );
>>>>>>> ee65db1831040065e292da83b6a082370fbb083b

  return {
    trpcQueryClient,
    trpcClient,
  };
};
