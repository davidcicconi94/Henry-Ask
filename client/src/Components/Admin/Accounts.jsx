import { Button, Flex, Grid, Text } from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import Sidebar from "./Sidebar";
import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableContainer,
} from "@chakra-ui/react";
import { useSelector, useDispatch } from "react-redux";
import SearchbarAdmin from "./SearchbarAdmin";
import { useAuth } from "../AuthComponents/AuthContext";
import axios from "axios";

const Accounts = () => {
  const dispatch = useDispatch();
  const { user } = useAuth();
  let token = user.accessToken;
  const accounts = useSelector((state) => state.user);

  const [users, setUsers] = useState([]);

  useEffect(() => {
    const getUsers = async () => {
      const { data } = await axios.get(
        `http://localhost:3001/auth/users?page=${accounts.currentPage}`,
        { headers: { Authorization: "Bearer " + token } }
      );
      setUsers(data.foundUsers);
      return users;
    };
    getUsers();
  }, []);

  console.log("estos usuarios", users);

  return (
    <Flex>
      <Sidebar />
      <div style={{ margin: "20px auto" }}>
        <SearchbarAdmin name="Rol" op1="Estudiante" op2="Administrador" />
        <Text
          mb="20px"
          align="center"
          fontWeight="bold"
          textTransform="uppercase"
        >
          Lista de cuentas
        </Text>
        <TableContainer
          border="1px solid gray"
          borderRadius="10px"
          boxShadow="0 4px 12px 0 rgba(0, 0, 0, 0.5)"
        >
          <Table variant="striped" colorScheme="blackAlpha" size="lg">
            <Thead backgroundColor="#ffff01" textAlign="center">
              <Tr>
                <Th textAlign="center">Usuario</Th>
                <Th textAlign="center">Email</Th>
                <Th textAlign="center">Rol</Th>
              </Tr>
            </Thead>
            <Tbody>
              {users.map((user) => (
                <Tr textAlign="center">
                  <Td textAlign="center"> {user.userSlack} </Td>
                  <Td textAlign="center"> {user.mail} </Td>
                  <Td textAlign="center"> {user.rol} </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </TableContainer>
      </div>
    </Flex>
  );
};

export default Accounts;
