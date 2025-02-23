import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
   colors: {
      brand: {
         50: "#E9DFFF",
         100: "#C5A8FF",
         200: "#A374FF",
         300: "#804FFF",
         400: "#6327FF",
         500: "#4D2161", // Primary Purple
         600: "#4A0375",
         700: "#3C0361",
         800: "#2E024D",
         900: "#21003A",
      },
      yellow: {
         500: "#EAAB00", // Yellow button color
      },
      purple: {
         500: "#865DA4", // Small button purple
      },
      blue: {
         500: "#4D2161", // Large button blue
      },
      gray: {
         50: "#F7F7F7",
         100: "#E0E0E0",
         200: "#C4C4C4",
         300: "#A8A8A8",
         400: "#8C8C8C",
         500: "#707070",
         600: "#545454",
         700: "#383838", // Dark Gray Background
         800: "#343434", // Dark Gray for Text
         900: "#1E1E1E", // Almost Black
      },
   },
   fonts: {
      heading: `'DM Sans', sans-serif`,
      body: `'DM Sans', sans-serif`,
   },
   breakpoints: {
      lg: "1200px",
      "3xl": "1600px",
   },
   fontSizes: {
      '3xl': '30px', // Large Heading
      '2xl': '20px', // Subheadings
      'md': '14px', // Small Text
   },
   components: {
      Button: {
         baseStyle: {
            outline: "none !important",
            textDecoration: "none !important",
            borderRadius: "6px",
            fontWeight: "600",
            lineHeight: "1.2",
         },
         sizes: {
            lg: {
               height: "58px",
               width: "335px",
               padding: "0px 24px",
               fontSize: "18px",
            },
            md: {
               height: "32px",
               width: "92px",
               padding: "0px 12px",
               fontSize: "14px",
            },
            sm: {
               height: "24px",
               minWidth: "60px",
               padding: "0px 8px",
               fontSize: "12px",
            },
         },
         variants: {
            solid: {
               color: "white",
               bg: "brand.500",
               _hover: { bg: "brand.400", color: "white" },
               _active: { bg: "brand.600" },
            },
            outline: {
               border: "1px solid",
               borderColor: "brand.500",
               color: "brand.500",
               _hover: { bg: "brand.500", color: "white" },
               _active: { bg: "brand.600", color: "white" },
            },
            yellow: {
               bg: "yellow.500",
               color: "white",
               _hover: { bg: "#D99A00" },
               _active: { bg: "#C78C00" },
            },
            purple: {
               bg: "purple.500",
               color: "white",
               _hover: { bg: "#744F9F" },
               _active: { bg: "#663D8C" },
            },
            blue: {
               bg: "blue.500",
               color: "white",
               _hover: { bg: "#3C1A4F" },
               _active: { bg: "#2E123D" },
            },
         },
         defaultProps: {
            size: "md",
            variant: "solid",
         },
      },
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
            sm: {
               label: {
                  ms: 3,
               },
            },
         },
         defaultProps: {
            colorScheme: "brand",
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
            color: "brand.500",
         },
      },
   },
});
