import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  TextField,
  Button,
  Switch,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import api from "../../utils/api";
import { useNavigate, useSearchParams } from "react-router-dom";
import axios from "axios";
import { URL } from "../../Common/api";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { debounce } from "lodash";
import ClearButton from "../../components/ClearButton";

const AllDealers = () => {
  const [dealerData, setDealerData] = useState([]);
  const [page, setPage] = useState(1);
  const [avalableDealersCount, setAvalableDealersCount] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [flag, setFlag] = useState(false);

  const [dealerToDelete, setDealerToDelete] = useState();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [dealerToToggle, setDealerToToggle] = useState(null);

  const [districts, setDistricts] = useState([]);
  const [cities, setCities] = useState([]);
  const [relatedCities, setRelatedCities] = useState([]);

  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [search, setSearch] = useState(searchParams.get("search") || "");

  // Debounced search function to prevent too many API calls
  const debouncedSearch = debounce((value) => {
    const params = new URLSearchParams(window.location.search);

    if (value === "") {
      params.delete("search");
    } else {
      params.set("search", value);
    }

    params.delete("page");
    setPage(1);
    setSearchParams(params.toString() ? "?" + params.toString() : "");
  }, 500);

  // Handle search input change
  const handleSearchChange = (e) => {
    const { name, value } = e.target;

    if (name === "search") {
      setSearch(value);
      debouncedSearch(value);
    } else if (name === "district") {
      // Find the district name corresponding to the selected district ID

      const filteredCities = cities.filter(
        (city) => city.district._id == value
      );
      setRelatedCities(filteredCities);
      const selectedDistrict = districts.find(
        (district) => district._id === value
      );

      if (selectedDistrict) {
        const params = new URLSearchParams(window.location.search);
        params.set("district", selectedDistrict._id);
        params.delete("page");
        params.delete("city");

        setPage(1);
        setSearchParams(params.toString() ? "?" + params.toString() : "");
      }
    } else if (name === "city") {
      if (value) {
        const params = new URLSearchParams(window.location.search);
        params.set("city", value);
        params.delete("page");
        setPage(1);
        setSearchParams(params.toString() ? "?" + params.toString() : "");
      }
    }
  };

  // Remove the separate handleFilter function and its usage

  const handleRemoveFilter = () => {
    // Reset local states
    setSearch("");
    setRelatedCities([]);

    // Get current params
    const params = new URLSearchParams(window.location.search);

    // Remove specific filters while keeping page
    params.delete("search");
    params.delete("district");
    params.delete("city");

    // Update URL with remaining params (including page)
    setSearchParams(params.toString() ? "?" + params.toString() : "");
  };

  const handleFilter = (type, value) => {
    setDealerData([]);
    const params = new URLSearchParams(window.location.search);

    if (value === "") {
      if (type === "page") {
        setPage(1);
      }
      params.delete(type);
    } else {
      // Always reset to page 1 when changing filter
      if (type !== "page") {
        params.delete("page");
        setPage(1);
      }

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

  // Filters setting initially
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const pageNumber = params.get("page");
    setPage(parseInt(pageNumber || 1));
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const res = await api.get(
          `super-admin/admins/${searchParams && `?${searchParams}`}`
        );
        console.log(res);

        setDealerData(res?.data?.admins);
        setAvalableDealersCount(res?.data?.totalAvailableAdmins);

        const params = new URLSearchParams(window.location.search);
        const pageNumber = params.get("page");
        setPage(parseInt(pageNumber || 1));
      } catch (err) {
        console.log(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [searchParams, flag]);

  // Fetch districts and cities on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDistricts = await axios.get(`${URL}/super-admin/districts`);
        setDistricts(resDistricts?.data?.districts);

        const resCities = await axios.get(`${URL}/user/cities`);
        setCities(resCities?.data?.cities);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching districts and cities");
      }
    };

    fetchData();
  }, []);

  // Open confirmation dialog
  const confirmActiveChange = (dealer) => {
    setDealerToToggle(dealer);
    setDialogOpen(true);
  };

  // Handle toggling active state after confirmation
  const handleToggleActive = async () => {
    if (dealerToToggle) {
      try {
        const res = await axios.patch(
          `${URL}/super-admin/block-or-unblock/${dealerToToggle._id}`,
          {
            isActive: !dealerToToggle.isActive,
          }
        );

        if (res.status) {
          setFlag((prev) => !prev);
        }
      } catch (err) {
        console.log(err);
      } finally {
        setDialogOpen(false);
        setDealerToToggle(null);
      }
    }
  };

  // Handle deletion of inactive dealers
  const handleDeleteDealer = (id) => {
    setDeleteDialogOpen(true);
    setDealerToDelete(id);
  };

  const handleConfirmDelete = async () => {
    try {
      const res = await axios.delete(
        `${URL}/super-admin/admin/${dealerToDelete}`
      );

      if (res.status) {
        setFlag((prev) => !prev);
        toast.success("Dealer deleted successfully.");
      }
    } catch (err) {
      console.log(err);
    } finally {
      setDeleteDialogOpen(false);
    }
  };

  return (
    <section>
      <h1 className="text-lg font-medium mb-4">All Dealers</h1>
      <div className="border py-2">
        <div className="flex px-2 gap-3 mb-4">
          <div className="w-full flex items-center gap-4 p-1">
            {/* Search Input */}
            <TextField
              label="Search by Name, Email"
              variant="outlined"
              fullWidth
              value={search}
              name="search"
              onChange={handleSearchChange}
            />

            <FormControl className="w-52" margin="dense">
              <InputLabel id="district-select-label " className="">
                District
              </InputLabel>
              <Select
                className="rounded-xl"
                labelId="district-select-label"
                name="district"
                onChange={handleSearchChange}
                value={searchParams.get("district") || ""}
              >
                {districts.map((district) => (
                  <MenuItem key={district._id} value={district._id}>
                    {district.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl className="w-52" margin="dense">
              <InputLabel id="city-select-label" className=" ">
                City
              </InputLabel>
              <Select
                className="rounded-xl"
                labelId="city-select-label"
                name="city"
                onChange={handleSearchChange}
                value={searchParams.get("city") || ""}
              >
                {relatedCities?.map((city) => (
                  <MenuItem key={city._id} value={city._id}>
                    {city.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <ClearButton onClick={handleRemoveFilter} />
          </div>
        </div>

        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell align="left">Image</TableCell>
                <TableCell align="left">Name</TableCell>
                <TableCell align="left">Email</TableCell>
                <TableCell align="left">District</TableCell>
                <TableCell align="left">City</TableCell>
                <TableCell align="center">Active</TableCell>
                <TableCell align="center">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {isLoading ? (
                // Show skeletons during loading
                Array.from({ length: 10 }).map((_, index) => (
                  <TableRow key={index}>
                    <TableCell align="center" colSpan={6}>
                      <Skeleton variant="rectangular" height={40} />
                    </TableCell>
                  </TableRow>
                ))
              ) : dealerData.length > 0 ? (
                // Show data if available
                dealerData.map((dealer) => (
                  <TableRow key={dealer._id}>
                    <TableCell align="center">
                      <Avatar src={dealer.image} alt={dealer.name} />
                    </TableCell>
                    <TableCell align="left">{dealer.name}</TableCell>
                    <TableCell align="left">{dealer.email}</TableCell>
                    <TableCell align="left">{dealer.district?.name}</TableCell>
                    <TableCell align="left">{dealer.city?.name}</TableCell>
                    <TableCell align="center">
                      <Switch
                        checked={dealer.isActive}
                        onChange={() => confirmActiveChange(dealer)}
                        color="primary"
                      />
                    </TableCell>
                    <TableCell align="center">
                      {dealer.isActive ? (
                        <Button
                          variant="contained"
                          color="primary"
                          size="small"
                          onClick={() => navigate(`/edit-store/${dealer._id}`)}
                        >
                          Edit
                        </Button>
                      ) : (
                        <Button
                          variant="contained"
                          color="error"
                          size="small"
                          onClick={() => handleDeleteDealer(dealer._id)}
                        >
                          Delete
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                // Show no data message
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
          <Pagination
            handleClick={handleFilter}
            page={page}
            number={10}
            totalNumber={avalableDealersCount}
          />
        </div>
      </div>

      {/* Confirmation Dialogs */}
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
      >
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to delete this dealer?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button onClick={handleConfirmDelete} color="error" autoFocus>
            Confirm
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>Confirm Action</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure you want to{" "}
            {dealerToToggle?.isActive ? "deactivate" : "activate"} this dealer?
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

export default AllDealers;
