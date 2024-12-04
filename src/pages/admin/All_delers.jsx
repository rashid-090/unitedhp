import React, { useEffect, useState } from "react";
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
import api from "../../utils/api";
import { useSearchParams } from "react-router-dom";

const Alldelers = () => {
  const [dealerData, setDealerData] = useState([]);
  const [filter, setFilter] = useState("");
  const [page, setPage] = useState(1);
  const [rowsPerPage] = useState(10);
  const [avalableDealersCount, setAvalableDealersCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dealerToToggle, setDealerToToggle] = useState(null);

  // Filteration

  const [search, setSearch] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();

  const handleFilter = (type, value) => {
    const params = new URLSearchParams(window.location.search);
    if (value === "") {
      if (type === "page") {
        setPage(1);
      }
      params.delete(type);
    } else {
      if (type === "page" && value === 1) {
        params.delete(type);
        setPage(1);
      } else {
        params.set(type, value);
        if (type === "page") {
          setPage(value);
        }
      }
    }
    setSearchParams(params.toString() ? "?" + params.toString() : "");
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get("super-admin/admins");
        console.log(res);
        setDealerData(res?.data?.admins);
        setAvalableDealersCount(res?.data?.totalAvailableAdmins);
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

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
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="w-full">
            {/* Filter Input */}
            <TextField label="Search by State" variant="outlined" fullWidth />
          </div>
          <div className="w-full">
            {/* Filter Input */}
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => handleFilter("search", search)}
            >
              Search
            </Button>
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
              count={Math.ceil(avalableDealersCount / rowsPerPage)}
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
