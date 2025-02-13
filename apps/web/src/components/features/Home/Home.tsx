import styled from 'styled-components'
import * as Styled from './styled'
import StartScreen from '../../StartScreen'
import PathMap from '../../PathMap'
import SelectLocations from '../../SelectLocations'
import React from 'react'
import { ChakraProvider} from '@chakra-ui/react'
import {theme} from '../../../styles/theme';

export const Home = () => {
   return (
         <HomeContainer>
         {/* <StartScreen /> */}
         {/* <SelectLocations/> */}
         <PathMap/>
            {/* <Styled.Gif
               src="https://media.giphy.com/media/Dh5q0sShxgp13DwrvG/giphy.gif"
               alt="I have no idea what I'm doing"
            /> */}
         </HomeContainer>
   )
}

const HomeContainer = styled.div`
   display: flex;
   flex-direction: column;
   align-items: center;
   justify-content: center;
   min-height: 100vh;
   background: linear-gradient(to right, #434343, #000000);
`
