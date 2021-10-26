import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import closeFill from "@iconify/icons-eva/close-fill";
import { showToast, showErrorToast } from "src/utils/toasts";

import {
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
} from "@material-ui/core";

import { getAllVendors, addGunmen } from "../../api/index";

// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

AddGunmen.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};

export default function AddGunmen({
  isOpenFilter,
  onResetFilter,
  onOpenFilter,
  onCloseFilter,
}) {
  const [gunman, setGunman] = useState({
    first_name: "",
    last_name: "",
    email: "",
    vendor: "",
  });
  const handleChange = (e) => {
    setGunman({ ...gunman, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
        console.log(gunman);
      const data = await addGunmen(gunman);
      if (data.status === 201) {
        showToast("Gunman Added");
        isOpenFilter();
      } else {
        showErrorToast();
      }
    } catch (error) {
      showErrorToast();
    }
  };

  const [vendor, setVendorInfo] = useState([]);
  const getVendors = async () => {
    try {
      const data = await getAllVendors();
      if (data.status === 200) {
        setVendorInfo(data?.data?.results);
      } else {
        showErrorToast();
      }
    } catch (error) {
      showErrorToast();
    }
  };

  useEffect(() => {
    getVendors();
  }, []);
  return (
    <>
      <Drawer anchor="right" open={isOpenFilter} onClose={onCloseFilter}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ px: 1, py: 2 }}
        >
          <Typography variant="subtitle1" sx={{ ml: 1 }}>
            Add Custodian
          </Typography>
          <IconButton onClick={onCloseFilter}>
            <Icon icon={closeFill} width={20} height={20} />
          </IconButton>
        </Stack>

        <Divider />

        <Grid container spacing={2} sx={{ px: 4, pt: 10 }}>
          <Grid item xs={12} sm={12} lg={6}>
            <TextField
              required
              label="First Name"
              name="first_name"
              onChange={handleChange}
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={12} sm={12} lg={6}>
            <TextField
              required
              label="Last  Name"
              name="last_name"
              onChange={handleChange}
              fullWidth
            ></TextField>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ px: 4, pt: 2 }}>
          <Grid item xs={12} sm={12} lg={6}>
            <TextField
              required
              label="Email"
              name="email"
              onChange={handleChange}
              fullWidth
            ></TextField>
          </Grid>
          <Grid item xs={12} sm={12} lg={6}>
            <TextField
              required
              label="Phone"
              name="phone_number"
              onChange={handleChange}
              fullWidth
            ></TextField>
          </Grid>
        </Grid>

        <Grid container spacing={2} sx={{ px: 4, pt: 2 }}>
          <Grid item xs={12} sm={12} lg={6}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel id="demo-simple-select-outlined-label">
                Custodian Type
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name="custodian_type"
                label="Custodian Type"
                onChange={handleChange}
              >
                <MenuItem value="C">Custodian</MenuItem>
                <MenuItem value="G">Gunman</MenuItem>
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} lg={6}>
            <FormControl variant="outlined" fullWidth required>
              <InputLabel id="demo-simple-select-outlined-label">
                Vendor
              </InputLabel>
              <Select
                labelId="demo-simple-select-outlined-label"
                id="demo-simple-select-outlined"
                name="vendor"
                label="Age"
                onChange={handleChange}
              >
                {vendor.map((instance) => (
                  <MenuItem value={instance.id}>{instance.name}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>

          <Grid item xs={12} sm={12} lg={12}>
            <TextField
              required
              label="Address"
              name="address"
              onChange={handleChange}
              fullWidth
            ></TextField>
          </Grid>

          <Grid item xs={12} sm={12} lg={12} align="center">
            <Button variant="contained" color="primary" onClick={handleSubmit}>
              Add Custodian
            </Button>
          </Grid>
        </Grid>
      </Drawer>
    </>
  );
}
