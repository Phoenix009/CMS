import PropTypes from 'prop-types';
import { useState } from 'react';
import { Icon } from '@iconify/react';
import { Form, FormikProvider } from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
import roundClearAll from '@iconify/icons-ic/round-clear-all';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
// material
import {
  Box,
  Radio,
  Stack,
  Button,
  Drawer,
  Rating,
  Divider,
  Checkbox,
  FormGroup,
  IconButton,
  Typography,
  RadioGroup,
  FormControlLabel,
  Grid,
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select
} from '@material-ui/core';
//

// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};

export default function ShopFilterSidebar({
  isOpenFilter,
  onResetFilter,
  onOpenFilter,
  onCloseFilter,
}) {
  const [employee, setEmployee] = useState({
    first_name : '',
    last_name : '',
    email : '',
    employee_id : '',
    age : '',
    role : ''
  });
  const handleChange = (e)=>{
    setEmployee({...employee, [e.target.name] : e.target.value});
    console.log(employee);
  }
  const handleSubmit = ()=>{
    console.log(employee);
  }
  return (
    <>
          <Drawer
            anchor="right"
            open={isOpenFilter}
            onClose={onCloseFilter}
            PaperProps={{
              sx: { width: '300', border: 'none', overflow: 'hidden' }
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 1, py: 2 }}
            >
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                Add Employee
              </Typography>
              <IconButton onClick={onCloseFilter}>
                <Icon icon={closeFill} width={20} height={20} />
              </IconButton>
            </Stack>

            <Divider />
            <Grid container spacing={3} sx={{ px: 5, py: 10 }}>
                <Grid item xs={12} sm={12} lg={4}>
                    <TextField
                        label="First Name"
                        name="first_name"
                        onChange={handleChange}
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <TextField
                        label="Last Name"
                        name="last_name"
                        onChange={handleChange}
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <TextField
                        label="Email"
                        name="email"
                        onChange={handleChange}
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <TextField
                        label="Employee Id"
                        name="employee_id"
                        onChange={handleChange}
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                    <TextField
                        label="Age"
                        name="age"
                        onChange={handleChange}
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="demo-simple-select-outlined-label">Role</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="Age"
                      onChange={handleChange}
                    >
                    <MenuItem value={'admin'}>Admin</MenuItem>
                    <MenuItem value={'employee'}>Employee</MenuItem>
                    <MenuItem value={'superadmin'}>SuperAdmin</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} lg={12} align="center">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Add Employee</Button>
                </Grid>
            </Grid>
          </Drawer>
    </>
  );
}
