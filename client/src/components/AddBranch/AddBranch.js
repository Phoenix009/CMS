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
import {
  getAllRegions, 
  getAllEmployees,
  addBranch,
} from '../../api/index';

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
  const [employee_info, setEmployee_info] = useState([]);
  const [region_info,setRegion_info]=useState([]);
  const [branch, setBranch] = useState({
   'name' :'' ,
    'address' :'',
    'branch_manager' :'',
    'region':''
  });
  const handleChange = (e)=>{
    setBranch({...branch, [e.target.name] : e.target.value});
    console.log(branch);
  }
    const handleSubmit = async ()=>{
    try{
			const data = await addBranch(branch);
			console.log(data);
			if(data.status === 201){
				toast('Branch Added', {
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
  const getRegion = async ()=>{
		try{
			const data = await getAllRegions();
			console.log(data);
			if(data.status === 200 ){
				setRegion_info(data?.data?.results);
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
  const getEmployees = async ()=>{
		try{
			const data = await getAllEmployees();
			console.log(data);
			if(data.status === 200 ){
				setEmployee_info(data?.data?.results);
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
		getRegion();
    getEmployees();
	}, []);
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
                Add Branch
              </Typography>
              <IconButton onClick={onCloseFilter}>
                <Icon icon={closeFill} width={20} height={20} />
              </IconButton>
            </Stack>

            <Divider />
            <Grid container spacing={3} sx={{ px: 5, py: 10 }}>
                <Grid item xs={12} sm={12} lg={4}>
                  
                    <TextField
                        label="Branch Name"
                        name="name"
                        onChange={handleChange}
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={8}>
                    <TextField
                        label="Address"
                        name="address"
                        onChange={handleChange}
                        fullWidth
                    >
                    </TextField>
                </Grid>
                <Grid item xs={12} sm={12} lg={4}>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="demo-simple-select-outlined-label">Branch Manager Email</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="Age"
                      onChange={handleChange}
                    >
                        {
                          employee_info.map((instance)=>(
                            <MenuItem value={instance.id}>{instance.email}</MenuItem>
                          ))
                        }
                    </Select>
                </FormControl>
                </Grid>
                
                
                <Grid item xs={12} sm={12} lg={4}>
                <FormControl variant="outlined" fullWidth>
                    <InputLabel id="demo-simple-select-outlined-label">Region</InputLabel>
                    <Select
                      labelId="demo-simple-select-outlined-label"
                      id="demo-simple-select-outlined"
                      label="Age"
                      onChange={handleChange}
                    >
                    {
                          region_info.map((instance)=>(
                            <MenuItem value={instance.id}>{instance.name}</MenuItem>
                          ))
                      }
                    </Select>
                </FormControl>
                </Grid>
                <Grid item xs={12} sm={12} lg={12} align="center">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Add Branch</Button>
                </Grid>
            </Grid>
          </Drawer>
    </>
  );
}
