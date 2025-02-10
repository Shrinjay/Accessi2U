import { extendTheme } from "@chakra-ui/react"

import { colors } from "./colors"

export const theme = extendTheme({
   colors,
   breakpoints: {
      lg: "1200px",
      "3xl": "1600px",
   },
   components: {
      Checkbox: {
         sizes: {
            "2xl": {
               control: {
                  width: 20,
                  height: 10,
                  borderRadius: 6,
               },
            },
            xl: {
               control: {
                  width: 12,
                  height: 8,
                  borderRadius: 6,
               },
            },
            "sm": {
               label: {
                  ms: 3,
               },
            },
         },
         defaultProps: {
            colorScheme: "teal",
            size: "lg",
         },
         baseStyle: {
            label: {
               ms: 6,
            },
            control: {
               _checked: {
                  _disabled: {
                     bg: "gray.400",
                     borderColor: "gray.400",
                     color: "gray.500",
                  },
               },
               _disabled: {
                  bg: "gray.400",
                  borderColor: "gray.400",
               },
            },
         },
      },
      Spinner: {
         defaultProps: {
            size: "lg",
            variant: "bold",
         },
         baseStyle: {
            color: "teal",
         },
      },
      Button: {
         baseStyle: {
            outline: "none !important",
            textDecoration: "none !important",
         },
         sizes: {
            xl: {
               height: 12,
               minWidth: 12,
               padding: 8,
            },
         },
         variants: {
            solid: {
               color: "white",
               bg: "teal.500",
               _hover: { bg: "teal.50", color: "white" },
               _active: { bg: "teal.500" },
            },
            link: {
               color: "teal.500",
            },
            outline: {
               borderColor: "teal",
               color: "teal",
               _disabled: {
                  _hover: {
                     bg: "teal",
                     color: "teal",
                  },
               },
               _hover: {
                  bg: "teal",
                  color: "white",
               },
               _active: {
                  bg: "teal",
                  color: "white",
               },
            },
         },
      },
   },
})