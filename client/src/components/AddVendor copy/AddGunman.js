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
import {
	getAllRegions,
	getAllEmployees,
	addBranch,
	getAllVendors,
	addGunmen,
} from "../../api/index";

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
	// const [employee_info, setEmployee_info] = useState([]);
	const [region_info, setRegion_info] = useState([]);
	const st = {
		first_name: "",
		last_name: "",
		phone_number: "",
		email: "",
		custodian_type: "",
		vendor: "",
	};
	const [branch, setBranch] = useState({
		first_name: "",
		last_name: "",
		phone_number: "",
		email: "",
		custodian_type: "",
		vendor: "",
	});
	const handleChange = (e) => {
		setBranch({ ...branch, [e.target.name]: e.target.value });
		console.log(branch);
	};
	const handleSubmit = async () => {
		try {
			const data = await addGunmen(JSON.stringify(branch));
			console.log(data);
			if (data.status === 201) {
				toast("Custodian Added", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
				setBranch({ ...st });
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
				onCloseFilter();
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
			onCloseFilter();
		}
	};
	const getRegion = async () => {
		try {
			const data = await getAllVendors();
			console.log(data);
			if (data.status === 200) {
				setRegion_info(data?.data?.results);
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
	// const getEmployees = async () => {
	// 	try {
	// 		const data = await getAllEmployees();
	// 		console.log(data);
	// 		if (data.status === 200) {
	// 			setEmployee_info(data?.data?.results);
	// 		} else {
	// 			toast.error("Something went wrong!", {
	// 				position: "top-right",
	// 				autoClose: 5000,
	// 				hideProgressBar: false,
	// 				closeOnClick: true,
	// 				pauseOnHover: true,
	// 				draggable: true,
	// 				progress: undefined,
	// 			});
	// 		}
	// 	} catch (error) {
	// 		console.log(error);
	// 		toast.error("Something went wrong!", {
	// 			position: "top-right",
	// 			autoClose: 5000,
	// 			hideProgressBar: false,
	// 			closeOnClick: true,
	// 			pauseOnHover: true,
	// 			draggable: true,
	// 			progress: undefined,
	// 		});
	// 	}
	// };

	useEffect(() => {
		getRegion();
		// getEmployees();
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
						Add Custodian
					</Typography>
					<IconButton onClick={onCloseFilter}>
						<Icon icon={closeFill} width={20} height={20} />
					</IconButton>
				</Stack>

				<Divider />
				<Grid container spacing={3} sx={{ px: 5, py: 10 }}>
					<Grid item xs={8} sm={12} lg={4}>
						<TextField
							label="First Name"
							name="first_name"
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>
					<Grid item xs={8} sm={12} lg={4}>
						<TextField
							label="Last Name"
							name="last_name"
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>
					<Grid item xs={8} sm={12} lg={4}>
						<TextField
							label="Phone No."
							name="phone_no"
							type="number"
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>
					<Grid item xs={8} sm={12} lg={4}>
						<TextField
							label="Email"
							name="email"
							type="email"
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>
					<Grid item xs={12} sm={12} lg={4}>
						<FormControl variant="outlined" fullWidth>
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
								<MenuItem value={"G"}>Custodian</MenuItem>
								<MenuItem value={"C"}>Gunman</MenuItem>
							</Select>
						</FormControl>
					</Grid>

					<Grid item xs={12} sm={12} lg={4}>
						<FormControl variant="outlined" fullWidth>
							<InputLabel id="demo-simple-select-outlined-label">
								Vendor
							</InputLabel>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								name="vendor"
								onChange={handleChange}
							>
								{region_info.map((instance) => (
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
							Add Custodian
						</Button>
					</Grid>
				</Grid>
			</Drawer>
		</>
	);
}
