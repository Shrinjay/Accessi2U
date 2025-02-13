import React from "react";
import { VStack, Heading, Text, Button, Box, Image, Flex } from "@chakra-ui/react";
import logo from "/src/components/logo.svg";

export default function LandingPage() {
  return (
    <Flex
      minH="100vh"
      w="100vw"
      align="center"
      justify="center"
      bg="white"
      p={4} // ✅ Ensures proper spacing on smaller screens
    >
      <VStack spacing={2} textAlign="center" maxW="600px" w="90%">
        {/* 🔼 Bigger Logo */}
        <Image
          src={logo}
          alt="Accessi2U Logo"
          boxSize={{ base: "300px", md: "400px", lg: "440px" }}

        />
        <Text fontSize={{ base: "md", md: "lg" }} color="gray.600">
          HELP YOU FIND YOUR WAY
        </Text>

        {/* Button */}
        <Button
          size="lg"
          colorScheme="brand"
          bg="brand.500"
          _hover={{ bg: "brand.600" }}
          _active={{ bg: "brand.700" }}
          w={{ base: "200px", md: "250px" }}
          fontSize={{ base: "md", md: "lg" }}
          py={6}
        >
          Start Navigating
        </Button>
      </VStack>
    </Flex>
  );
}
