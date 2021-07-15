import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Form, FormikProvider } from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
import roundClearAll from '@iconify/icons-ic/round-clear-all';
import roundFilterList from '@iconify/icons-ic/round-filter-list';
import {toast} from 'react-toastify';
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
import {
  getAllEmployees, 
  updateBranch,
} from '../../api/index';
// ----------------------------------------------------------------------



// ----------------------------------------------------------------------

UpdateEmployee.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
  regionInfo : PropTypes.object
};

export default function UpdateEmployee({
  isOpenFilter,
  onResetFilter,
  onOpenFilter,
  onCloseFilter,
  branchInfo
}) {
  console.log(branchInfo);
  const [branch, setBranch] = useState(branchInfo);
  const [employees, setEmployees] = useState([]);
  const handleChange = (e)=>{
    setBranch({...branch, [e.target.name] : e.target.value});
    console.log(branch);
  }
  const handleSubmit = async ()=>{
    console.log(branch);
    try{
			const data = await updateRegion(
        region?.id,
        {
          name : region?.name,
          address : region?.address,
          regional_officer : region?.regional_officer?.id
        }
        );
			console.log(data);
			if(data.status === 200){
				toast('Region Updated', {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
			}else{
				toast.error('Something went wrong!', {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			} 
		}catch(error){
			console.log(error);
			toast.error('Something went wrong!', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
  }
  const getUsers = async ()=>{
		try{
			const data = await getAllEmployees();
			console.log(data);
			if(data.status === 200 ){
				setEmployees(data?.data);
			}else{
				toast.error('Something went wrong!', {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			} 
		}catch(error){
			console.log(error);
			toast.error('Something went wrong!', {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	}
  
  useEffect(() => {
		getUsers();
    setRegion(regionInfo);
	}, [regionInfo]);
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
                Update Region
              </Typography>
              <IconButton onClick={onCloseFilter}>
                <Icon icon={closeFill} width={20} height={20} />
              </IconButton>
            </Stack>

            <Divider />
            <Grid container spacing={2} sx={{ px: 5, py: 10 }}>
                <Grid item xs={12} sm={12} lg={6}>
                    <TextField
                        label="Region Name"
                        name="name"
                        onChange={handleChange}
                        fullWidth
                        value={region?.name}
                    >
                    </TextField>
                </Grid>
               
                <Grid item xs={12} sm={12} lg={6}>
                  <FormControl variant="outlined" fullWidth>
                      <InputLabel id="demo-simple-select-outlined-label">Regional Manager</InputLabel>
                      <Select
                        labelId="demo-simple-select-outlined-label"
                        id="demo-simple-select-outlined"
                        name = 'regional_officer'
                        value={region?.regional_officer?.id}
                        onChange={handleChange}
                      >
                        {
                          employees.map((instance)=>(
                            <MenuItem value={instance.id}>{instance.email}</MenuItem>
                          ))
                        }
                      </Select>
                  </FormControl>
                </Grid>
                
                <Grid item xs={12} sm={12} lg={12}>
                    <TextField
                        label="Address"
                        name="address"
                        onChange={handleChange}
                        multiline
                        rows={3}
                        fullWidth
                        value={region?.address}
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={12} align="center">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Update Region</Button>
                </Grid>
            </Grid>
          </Drawer>
    </>
  );
}
