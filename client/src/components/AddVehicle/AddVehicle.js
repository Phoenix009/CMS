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
//
import { getAllVehicles, AddVehicle, getAllVendors } from "../../api/index";
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
	const [vehicle, setVehicle] = useState({
		model_name: "",
		number_plate: "",
		vendor: "",
	});
	const [vendors, setVendor] = useState([]);
	const handleChange = (e) => {
		setVehicle({ ...vehicle, [e.target.name]: e.target.value });
		console.log(vehicle);
	};
	const handleSubmit = async () => {
		try {
			const data = await AddVehicle(vehicle);
			console.log(data);
			if (data.status === 201) {
				toast("Vehicle Added", {
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
		}
	};
	const getUsers = async () => {
		try {
			const data = await getAllVehicles();
			console.log(data);
			if (data.status === 200) {
				setVehicle(data?.data?.results);
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

	const getVendor = async () => {
		try {
			const data = await getAllVendors();
			console.log(data);
			if (data.status === 200) {
				setVendor(data?.data?.results);
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
		getUsers();
		getVendor();
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
						Add Vehicle
					</Typography>
					<IconButton onClick={onCloseFilter}>
						<Icon icon={closeFill} width={20} height={20} />
					</IconButton>
				</Stack>

				<Divider />
				<Grid container spacing={2} sx={{ px: 5, py: 10 }}>
					<Grid item xs={12} sm={12} lg={6}>
						<TextField
							label="Vehicle Name"
							name="model_name"
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>

					<Grid container spacing={2} sx={{ px: 5, py: 10 }}>
						<Grid item xs={12} sm={12} lg={6}>
							<TextField
								label="Vehicle Number"
								name="number_plate"
								onChange={handleChange}
								fullWidth
							></TextField>
						</Grid>

						<Grid item xs={12} sm={12} lg={6}>
							<FormControl variant="outlined" fullWidth>
								<InputLabel id="demo-simple-select-outlined-label">
									{" "}
									Vendor{" "}
								</InputLabel>
								<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									name="vendor"
									onChange={handleChange}
								>
									{vendors.map((instance) => (
										<MenuItem value={instance.id}>
											{instance.email}
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
								Add Vehicle
							</Button>
						</Grid>
					</Grid>
				</Grid>
			</Drawer>
		</>
	);
}
