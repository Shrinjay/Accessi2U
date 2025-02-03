import ReactDOM from 'react-dom/client'

import { App } from './components/core/App'

import { Providers } from './components/shared'
import {theme} from '../src/styles/theme'
import { ChakraProvider, defaultSystem } from '@chakra-ui/react'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
   <ChakraProvider value={defaultSystem}>
      <Providers>
         <App />
      </Providers>
   </ChakraProvider>
)
