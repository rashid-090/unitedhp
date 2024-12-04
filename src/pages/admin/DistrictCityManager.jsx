import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
  TextField,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
} from "@mui/material";
import api from "../../utils/api";
import { toast } from "react-toastify";

const DistrictCityManager = () => {
  const [districts, setDistricts] = useState([{ id: "", name: "" }]);
  const [cities, setCities] = useState([{}]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogType, setDialogType] = useState(""); // 'district' or 'city'
  const [newDistrict, setNewDistrict] = useState("");
  const [newCity, setNewCity] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState({
    id: "",
    name: "",
  });
  const [flag, setFlag] = useState(false);

  // Handle dialog opening
  const openDialog = (type) => {
    setDialogType(type);
    setDialogOpen(true);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const resDistricts = await api.get("super-admin/districts");
        console.log(resDistricts);
        setDistricts(resDistricts?.data?.districts);

        const resCities = await api.get("super-admin/cities");
        console.log(resCities);
        setCities(resCities?.data?.cities);
      } catch (err) {
        console.log(err);
      } finally {
      }
    };

    fetchData();
  }, [flag]);

  // Handle adding district
  const handleAddDistrict = async () => {
    try {
      setNewDistrict("");
      setDialogOpen(false);

      const res = await api.post("super-admin/district", {
        name: newDistrict,
      });
      console.log(res);
      if (res?.status) {
        toast.success("District added");
        setFlag((prev) => !prev);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error while adding district");
    } finally {
    }
    if (newDistrict.trim() === "") return;
  };

  // Handle adding city
  const handleAddCity = async () => {
    if (newCity.trim() === "" || selectedDistrict === "") return;
    try {
      const res = await api.post("super-admin/city", {
        name: newCity,
        district: selectedDistrict.id,
      });
      console.log(res);
      if (res?.status) {
        toast.success("City added");
        setFlag((prev) => !prev);
      }
    } catch (err) {
      console.log(err);
      toast.error("Error while adding district");
    } finally {
    }

    console.log("selected district", selectedDistrict);

    setNewCity("");
    setSelectedDistrict("");
    setDialogOpen(false);
  };

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-2xl font-bold mb-6 text-center">
        District and City Manager
      </h1>

      {/* District Table */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Districts</h2>
          <Button
            variant="contained"
            color="primary"
            onClick={() => openDialog("district")}
          >
            Add District
          </Button>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">
                District Name
              </th>
            </tr>
          </thead>
          <tbody>
            {districts.length > 0 ? (
              districts.map((district, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {district.name}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="2"
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  No districts added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* City Table */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Cities</h2>
          <Button
            variant="contained"
            color="secondary"
            onClick={() => openDialog("city")}
            disabled={districts.length === 0}
          >
            Add City
          </Button>
        </div>
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead>
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">#</th>
              <th className="border border-gray-300 px-4 py-2">City Name</th>
              <th className="border border-gray-300 px-4 py-2">District</th>
            </tr>
          </thead>
          <tbody>
            {cities.length > 0 ? (
              cities.map((city, index) => (
                <tr key={index} className="text-gray-700">
                  <td className="border border-gray-300 px-4 py-2 text-center">
                    {index + 1}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {city.name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2">
                    {city.district?.name}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="3"
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  No cities added yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>
          {dialogType === "district" ? "Add District" : "Add City"}
        </DialogTitle>
        <DialogContent>
          {dialogType === "district" ? (
            <>
              <DialogContentText>
                Enter the name of the new district.
              </DialogContentText>
              <TextField
                autoFocus
                margin="dense"
                label="District Name"
                type="text"
                fullWidth
                value={newDistrict}
                onChange={(e) => setNewDistrict(e.target.value)}
              />
            </>
          ) : (
            <>
              <DialogContentText>
                Enter the name of the new city and select its district.
              </DialogContentText>
              <FormControl fullWidth margin="dense">
                <InputLabel id="district-select-label">District</InputLabel>
                <Select
                  labelId="district-select-label"
                  value={selectedDistrict._id}
                  onChange={(e) => {
                    setSelectedDistrict({
                      name: e.target.value.name,
                      id: e.target.value._id,
                    });
                    console.log(e.target.value);
                  }}
                >
                  {districts.map((district, index) => (
                    <MenuItem key={index} value={district}>
                      {district.name}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <TextField
                margin="dense"
                label="City Name"
                type="text"
                fullWidth
                value={newCity}
                onChange={(e) => setNewCity(e.target.value)}
              />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="error">
            Cancel
          </Button>
          <Button
            onClick={
              dialogType === "district" ? handleAddDistrict : handleAddCity
            }
            color="primary"
          >
            Add
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};

export default DistrictCityManager;
