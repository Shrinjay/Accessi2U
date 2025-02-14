import { extendTheme } from "@chakra-ui/react";

export const theme = extendTheme({
   colors: {
      brand: {
         50: "#E9DFFF",
         100: "#C5A8FF",
         200: "#A374FF",
         300: "#804FFF",
         400: "#6327FF",
         500: "#57058B", // Primary Purple
         600: "#4A0375",
         700: "#3C0361",
         800: "#2E024D",
         900: "#21003A",
      },
      yellow: {
         500: "#EAAB00", // Custom yellow for buttons
      },
      gray: {
         800: "#343434", // Dark gray for text
         900: "#1E1E1E", // Almost black
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
      Button: {
         baseStyle: {
            outline: "none !important",
            textDecoration: "none !important",
            borderRadius: "6px",
         },
         sizes: {
            xl: {
               height: "48px",
               minWidth: "120px",
               padding: "16px",
            },
            lg: {
               height: "40px",
               minWidth: "100px",
               padding: "14px",
            },
            md: {
               height: "32px",
               minWidth: "80px",
               padding: "12px",
            },
            sm: {
               height: "24px",
               minWidth: "60px",
               padding: "8px",
            },
         },
         variants: {
            solid: {
               color: "white",
               bg: "brand.500",
               _hover: { bg: "brand.400", color: "white" },
               _active: { bg: "brand.600" },
            },
            link: {
               color: "brand.500",
            },
            outline: {
               borderColor: "brand.500",
               color: "brand.500",
               _disabled: {
                  _hover: {
                     bg: "brand.500",
                     color: "white",
                  },
               },
               _hover: {
                  bg: "brand.500",
                  color: "white",
               },
               _active: {
                  bg: "brand.600",
                  color: "white",
               },
            },
         },
      },
   },
});
