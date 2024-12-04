import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  Pagination,
  Stack,
  TextField,
  Button,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

const Alldelers = () => {
  const initialDealers = [
    {
      id: 1,
      name: "John Doe",
      email: "john@example.com",
      image: "https://via.placeholder.com/50",
      state: "California",
      active: true,
    },
    {
      id: 2,
      name: "Jane Smith",
      email: "jane@example.com",
      image: "https://via.placeholder.com/50",
      state: "New York",
      active: false,
    },
    {
      id: 3,
      name: "Sam Wilson",
      email: "sam@example.com",
      image: "https://via.placeholder.com/50",
      state: "Texas",
      active: true,
    },
    {
      id: 4,
      name: "Lisa Brown",
      email: "lisa@example.com",
      image: "https://via.placeholder.com/50",
      state: "Florida",
      active: false,
    },
  ];

  const [dealerData, setDealerData] = useState(initialDealers);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(4);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dealerToToggle, setDealerToToggle] = useState(null);

  // Pagination logic
  const filteredData = dealerData.filter(
    (dealer) =>
      dealer.name.toLowerCase().includes(filter.toLowerCase()) ||
      dealer.email.toLowerCase().includes(filter.toLowerCase()) ||
      dealer.state.toLowerCase().includes(filter.toLowerCase())
  );
  const paginatedData = filteredData.slice(
    (page - 1) * rowsPerPage,
    page * rowsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
  };

  const handleFilterChange = (e) => {
    setFilter(e.target.value);
    setPage(1); // Reset to the first page on filter change
  };

  // Open confirmation dialog
  const confirmActiveChange = (dealer) => {
    setDealerToToggle(dealer);
    setDialogOpen(true);
  };

  // Handle toggling active state after confirmation
  const handleToggleActive = () => {
    if (dealerToToggle) {
      setDealerData((prevData) =>
        prevData.map((dealer) =>
          dealer.id === dealerToToggle.id
            ? { ...dealer, active: !dealer.active }
            : dealer
        )
      );
    }
    setDialogOpen(false);
    setDealerToToggle(null);
  };

  // Handle deletion of inactive dealers
  const handleDeleteDealer = (id) => {
    setDealerData((prevData) => prevData.filter((dealer) => dealer.id !== id));
  };

  return (
    <section>
      <h1 className="text-lg font-medium mb-4">All Dealers</h1>
      <div className="border py-2">
        <div className="flex px-2 gap-3">
          <div className="w-full">
            {/* Filter Input */}
            <TextField
              label="Search by Name, Email"
              variant="outlined"
              fullWidth
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
          <div className="w-full">
            {/* Filter Input */}
            <TextField
              label="Search by State"
              variant="outlined"
              fullWidth
              value={filter}
              onChange={handleFilterChange}
            />
          </div>
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Image</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">State</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {paginatedData.length > 0 ? (
                paginatedData.map((dealer) => (
                  <TableRow key={dealer.id}>
                    <TableCell align="center">
                      <Avatar src={dealer.image} alt={dealer.name} />
                    </TableCell>
                    <TableCell align="left">{dealer.name}</TableCell>
                    <TableCell align="left">{dealer.email}</TableCell>
                    <TableCell align="left">{dealer.state}</TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={dealer.active}
                        onChange={() => confirmActiveChange(dealer)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {dealer.active ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => alert(`Edit ${dealer.name}`)}
                        >
                          Edit
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteDealer(dealer.id)}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={6} align="center">
                    No results found.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>

        {/* Pagination */}
        <div className="w-fit mx-auto py-3">
          <Stack spacing={2}>
            <Pagination
              count={Math.ceil(filteredData.length / rowsPerPage)}
              page={page}
              onChange={handlePageChange}
              siblingCount={1}
              boundaryCount={1}
            />
          </Stack>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {dealerToToggle?.active ? "deactivate" : "activate"} this dealer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="error">
            Cancel
          </Button>
          <Button onClick={handleToggleActive} color="primary" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
    </section>
  );
};

export default Alldelers;
