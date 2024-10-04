import React, { useCallback, useState } from 'react';
import {
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  TableContainer,
  Box,
  Button,
  Checkbox,
  Text,
  Flex,
  Spinner,
  Alert,
  useToast,
} from '@chakra-ui/react';
import { Link } from 'react-router-dom'; 
import { useMutationDeleteCategory } from '../../features/category/useMutationDeleteCategory'; 
import { useCategories } from '../../features/category'; 

export default function Category() {
  const [limit] = useState(10);
  const [page, setPage] = useState(1); 
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const toast = useToast();

  const { data, isLoading, error } = useCategories(limit, page, refreshTrigger);
  const { mutate, pending } = useMutationDeleteCategory();

  const handleNextPage = () => {
    if (page < (data?.totalPages || 1)) {
      setPage((prevPage) => prevPage + 1);
    }
  };

  const handlePrevPage = () => {
    if (page > 1) {
      setPage((prevPage) => prevPage - 1);
    }
  };

  const refreshCategories = useCallback(() => {
    setRefreshTrigger(prev => prev + 1);
  }, []);

  const handleDelete = async (category) => {
    if (window.confirm(`Are you sure you want to delete the category: ${category.name}?`)) {
      try {
        await mutate(category);
        toast({
          title: "Category deleted",
          description: `${category.name} has been successfully deleted.`,
          status: "success",
          duration: 5000,
          isClosable: true,
        });
        refreshCategories();
      } catch (error) {
        toast({
          title: "Delete failed",
          description: error.message || "An error occurred while deleting the category.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    }
  };

  if (isLoading) {
    return (
      <Flex w={"100%"} h={"100vh"} justifyContent={"center"} alignItems={"center"}>
        <Spinner size="xl" />
      </Flex>
    );
  }

  if (error) {
    return (
      <Flex w={"100%"} h={"100vh"} justifyContent={"center"} alignItems={"center"}>
        <Alert status="error">{error.message || 'Unknown error'}</Alert>
      </Flex>
    );
  }

  return (
    <Box p={5} bg="#f5f5f5" border="8px solid black">
      <TableContainer border="4px solid black">
        <Table variant="unstyled">
          <Thead bg="black">
            <Tr>
              <Th border="4px solid black" color="white" fontWeight="extrabold" fontSize="lg" textTransform="uppercase">
                <Checkbox colorScheme="black" />
              </Th>
              <Th border="4px solid black" color="white" fontWeight="extrabold" fontSize="lg" textTransform="uppercase">Name</Th>
              <Th border="4px solid black" color="white" fontWeight="extrabold" fontSize="lg" textTransform="uppercase">Description</Th>
              <Th border="4px solid black" color="white" fontWeight="extrabold" fontSize="lg" textTransform="uppercase">Action</Th>
            </Tr>
          </Thead>
          <Tbody>
            {data?.data.categories.map((category) => (
              <Tr key={category.id} bg="white" border="4px solid black">
                <Td border="4px solid black">
                  <Checkbox />
                </Td>
                <Td border="4px solid black">{category.name}</Td>
                <Td border="4px solid black">{category.description}</Td>
                <Td border="4px solid black">
                  <Link to={`/dashboard/category/detail/${category.id}`}>
                    <Button
                      colorScheme="blue"
                      variant="outline"
                      border="4px solid black"
                      mr={2}
                    >
                      Detail
                    </Button>
                  </Link>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    border="4px solid black"
                    onClick={() => handleDelete(category)}
                    isLoading={pending}
                  >
                    Delete
                  </Button>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>

      <Box mt={4} display="flex" justifyContent="space-between">
        <Button onClick={handlePrevPage} disabled={page === 1}>
          Previous
        </Button>
        <Text>Page {page} of {data?.totalPages}</Text>
        <Button onClick={handleNextPage} disabled={page === (data?.totalPages || 1)}>
          Next
        </Button>
      </Box>
    </Box>
  );
}
