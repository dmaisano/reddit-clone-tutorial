import { useApolloClient } from "@apollo/client";
import { Box, Button, Flex, Heading, Link } from "@chakra-ui/react";
import React from "react";
import { RouterLink } from ".";
import { useLogoutMutation, useMeQuery } from "../generated/graphql";
import { isServer } from "../utils/isServer";
import { RouterChakraLink } from "./RouterChakraLink";

interface NavbarProps {}

const Navbar: React.FC<NavbarProps> = ({}) => {
  const [logout, { loading: logoutLoading }] = useLogoutMutation();
  const apolloClient = useApolloClient();
  const { data, loading } = useMeQuery({
    skip: isServer(),
  });
  let body: JSX.Element | null = null;

  // data is loading
  if (loading) {
  }
  // user not logged in
  else if (!data?.me) {
    body = (
      <>
        <RouterLink to="/login">
          <Link mr={2}>login</Link>
        </RouterLink>
        <RouterLink to="/register">
          <Link>register</Link>
        </RouterLink>
      </>
    );
  }
  // user is logged in
  else {
    body = (
      <Flex align="center">
        <Button as={RouterChakraLink} mr={4} to="/create-post">
          <b>create post</b>
        </Button>
        <Box mr={2}>{data.me.username}</Box>
        <Button
          onClick={async () => {
            await logout();
            await apolloClient.resetStore();
          }}
          isLoading={logoutLoading}
          variant="link"
        >
          logout
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      zIndex={1}
      position="sticky"
      top={0}
      bg="tan"
      p={4}
      ml="auto"
      align="center"
    >
      <Flex flex={1} maxW={800} mx="auto" align="center">
        <RouterChakraLink
          to="/"
          sx={{
            ":hover": {
              textDecoration: `none`,
            },
          }}
        >
          <Heading>📝</Heading>
        </RouterChakraLink>
        <Box ml="auto">{body}</Box>
      </Flex>
    </Flex>
  );
};

export default Navbar;
