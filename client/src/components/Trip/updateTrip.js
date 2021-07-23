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
import { getGunmens, getAllVehicles, updateTrip } from "../../api/index";
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

UpdateEmployee.propTypes = {
	isOpenFilter: PropTypes.bool,
	onResetFilter: PropTypes.func,
	onOpenFilter: PropTypes.func,
	onCloseFilter: PropTypes.func,
	tripInfo: PropTypes.object,
};

export default function UpdateEmployee({
	isOpenFilter,
	onResetFilter,
	onOpenFilter,
	onCloseFilter,
	tripInfo,
}) {
	const [trip, setTrip] = useState(tripInfo);
	const [gunmen, setGunmen] = useState([]);
	const [vehicle, setVehicle] = useState([]);
	const handleChange = (e) => {
		setTrip({ ...trip, [e.target.name]: e.target.value });
		console.log(trip);
	};

	const getAllGunmen = async () => {
		try {
			const data = await getGunmens();
			console.log(data);
			if (data.status === 200) {
				setGunmen(data?.data?.results);
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
	const getVehicles = async () => {
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
	const handleSubmit = async () => {
		console.log(trip);
		try {
			const data = await updateTrip(trip?.id, {
				start_location: trip.start_location,
				end_location: trip.end_location,
				custodian_1: trip.custodian_1,
				custodian_2: trip.custodian_2,
				custodian_3: trip.custodian_3,
				vehicle: trip.vehicle,
			});
			console.log(data);
			if (data.status === 200) {
				toast("Trip Updated", {
					position: "top-right",
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					draggable: true,
				});
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
		getAllGunmen();
		getVehicles();

		setTrip(tripInfo);
	}, [tripInfo]);
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
						Update Trip
					</Typography>
					<IconButton onClick={onCloseFilter}>
						<Icon icon={closeFill} width={20} height={20} />
					</IconButton>
				</Stack>

				<Divider />
				<Grid container spacing={2} sx={{ px: 5, py: 10 }}>
					<Grid item xs={12} sm={12} lg={6}>
						<TextField
							label="From"
							name="start_location"
							onChange={handleChange}
							fullWidth
							value={trip?.start_location}
						></TextField>
					</Grid>
					<Grid item xs={12} sm={12} lg={6}>
						<TextField
							label="To"
							name="end_location"
							onChange={handleChange}
							fullWidth
							value={trip?.end_location}
						></TextField>
					</Grid>
					<Grid item xs={12} sm={12} lg={6}>
						<FormControl variant="outlined" fullWidth>
							<InputLabel id="demo-simple-select-outlined-label">
								Vehicle
							</InputLabel>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								name="vehicle"
								onChange={handleChange}
								value={trip?.vehicle}
							>
								<MenuItem value={null}>None</MenuItem>
								{vehicle.map((instance) => (
									<MenuItem value={instance.id}>
										{instance.number_plate}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={12} lg={6}>
						<FormControl variant="outlined" fullWidth>
							<InputLabel id="demo-simple-select-outlined-label">
								Custodian 1
							</InputLabel>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								name="custodian_1"
								onChange={handleChange}
								value={trip?.custodian_1}
							>
								<MenuItem value={null}>None</MenuItem>
								{gunmen.map((instance) => (
									<MenuItem value={instance.id}>
										{instance.first_name}{" "}
										{instance.last_name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={12} lg={6}>
						<FormControl variant="outlined" fullWidth>
							<InputLabel id="demo-simple-select-outlined-label">
								Custodian 2
							</InputLabel>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								name="custodian_2"
								onChange={handleChange}
								value={trip?.custodian_2}
							>
								<MenuItem value={null}>None</MenuItem>
								{gunmen.map((instance) => (
									<MenuItem value={instance.id}>
										{instance.first_name}{" "}
										{instance.last_name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					<Grid item xs={12} sm={12} lg={6}>
						<FormControl variant="outlined" fullWidth>
							<InputLabel id="demo-simple-select-outlined-label">
								Custodian 3
							</InputLabel>
							<Select
								labelId="demo-simple-select-outlined-label"
								id="demo-simple-select-outlined"
								name="custodian_3"
								onChange={handleChange}
								value={trip?.custodian_3}
							>
								<MenuItem value={null}>None</MenuItem>
								{gunmen.map((instance) => (
									<MenuItem value={instance.id}>
										{instance.first_name}{" "}
										{instance.last_name}
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
							Update Trip
						</Button>
					</Grid>
				</Grid>
			</Drawer>
		</>
	);
}
