import PropTypes from "prop-types";
import { useEffect, useState } from "react";
import { Icon } from "@iconify/react";
import { Form, FormikProvider } from "formik";
import closeFill from "@iconify/icons-eva/close-fill";
import roundClearAll from "@iconify/icons-ic/round-clear-all";
import roundFilterList from "@iconify/icons-ic/round-filter-list";
import { toast } from "react-toastify";
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
	Select,
} from "@material-ui/core";
import { addEmployee, getAllEmployees,getAllBranch } from "src/api/index";
import { xorBy } from "lodash";
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
	const [branch, setBranch] = useState([])
	const [profile, setProfile] = useState({
		gender:"",
		branch:null,
	})
	const [employee, setEmployee] = useState({
		first_name: "",
		last_name: "",
		username:"",
		profile:profile,
		// is_superuser: true,
		email: "",

	});
	const handleChange = (e) => {
		if (e.target.name=="gender" || e.target.name=="branch"){
			setProfile({...profile,[e.target.name]: e.target.value});
			setEmployee({ ...employee, profile: profile });
			// console.log(profile)
		}
		else{
			setEmployee({ ...employee, [e.target.name]: e.target.value });
		}
	
		
		// 
		console.log("Employee");
		console.log(employee);
	};
	const handleSubmit = async () => {
		try {
			console.log("Please, I hate God");
			// console.log(employee);
			let x = JSON.stringify(employee)
			console.log(x);
			const data = await addEmployee(x);
			console.log(data);
			if (data.status === 201) {
				toast("Employee Added", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
				onCloseFilter();
			} else {
				toast.error("Something went wrong!", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong!", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	};
	
	const getBranches = async () => {
		try {
			const data = await getAllBranch();
			console.log(data);
			if (data.status === 200) {
				setBranch(data?.data?.results);
			} else {
				toast.error("Something went wrong!", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
					progress: undefined,
				});
			}
		} catch (error) {
			console.log(error);
			toast.error("Something went wrong!", {
				position: "top-right",
				autoClose: 5000,
				hideProgressBar: false,
				closeOnClick: true,
				pauseOnHover: true,
				draggable: true,
				progress: undefined,
			});
		}
	};

	useEffect(() => {
		// getUsers();
		getBranches()
	}, []);
	return (
		<>
			<Drawer
				anchor="right"
				open={isOpenFilter}
				onClose={onCloseFilter}
				PaperProps={{
					sx: { width: "300", border: "none", overflow: "hidden" },
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
						></TextField>
					</Grid>
					<Grid item xs={12} sm={12} lg={4}>
						<TextField
							label="Last Name"
							name="last_name"
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>
					<Grid item xs={12} sm={12} lg={4}>
						<TextField
							label="Email"
							name="email"
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>
					<Grid item xs={12} sm={12} lg={4}>
						<TextField
							label="Username"
	
							name="username"
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>
					
						
		{/* // profil:{
		// 	gender: "",
        // is_superuser: "",
        // branch: ""
		// }, */}
	
					<Grid item xs={12} sm={12} lg={4}>
						<FormControl variant="outlined" fullWidth>
							<InputLabel id="demo-simple-select-outlined-label">
								Gender
							</InputLabel>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								name="gender"
								label="Age"
								onChange={handleChange}
							>
								<MenuItem value={"M"}>Male</MenuItem>
								<MenuItem value={"F"}>Female</MenuItem>
								<MenuItem value={"O"}>
								Other
								</MenuItem>
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={12} lg={6}>
						<FormControl variant="outlined" fullWidth>
							<InputLabel id="demo-simple-select-outlined-label">
								Branch
							</InputLabel>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								name="branch"
								onChange={handleChange}
							>
								{branch.map((instance) => (
									<MenuItem value={instance.id}>
										{instance.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={12} lg={12} align="center">
						<Button
							variant="contained"
							color="primary"
							onClick={handleSubmit}
						>
							Add Employee
						</Button>
					</Grid>
				</Grid>
			</Drawer>
		</>
	);
}
