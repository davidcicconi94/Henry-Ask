import { Flex } from "@chakra-ui/react";
import React from "react";
import Sidebar from "./Sidebar";

const HomeAdmin = () => {
  return (
    <Flex>
      <Sidebar />
      <h2>Este es el home de admin</h2>
    </Flex>
  );
};

export default HomeAdmin;
