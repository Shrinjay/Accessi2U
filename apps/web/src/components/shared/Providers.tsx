import { QueryClientProvider } from "@tanstack/react-query";
import { ChakraProvider } from "@chakra-ui/react";
import { theme } from "../../styles/theme";

import { trpc } from "../../trpc"; // Ensure this is correctly defined
import "../../styles/index.scss";
import { useTrpc } from "../../hooks";

export const Providers = ({ children }: { children: React.ReactNode }) => {
   const { trpcQueryClient, trpcClient } = useTrpc();

   return (
      <trpc.Provider client={trpcClient} queryClient={trpcQueryClient}>
         <QueryClientProvider client={trpcQueryClient}>
            <ChakraProvider theme={theme}> {/* ✅ Use `theme={theme}` instead of `system={theme}` */}
               {children}
            </ChakraProvider>
         </QueryClientProvider>
      </trpc.Provider>
   );
};
