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
import { addVendor, getAllVendors, updateVendor } from "../../api/index";
// ----------------------------------------------------------------------

// ----------------------------------------------------------------------

ShopFilterSidebar.propTypes = {
	isOpenFilter: PropTypes.bool,
	onResetFilter: PropTypes.func,
	onOpenFilter: PropTypes.func,
	onCloseFilter: PropTypes.func,
	vendorInfo: PropTypes.object,
};

export default function ShopFilterSidebar({
	isOpenFilter,
	onResetFilter,
	onOpenFilter,
	onCloseFilter,
	vendorInfo,
}) {
	const [vendor, setVendor] = useState({
		name: "",
		address: "",
		email: "",
		contact: "",
		officer_incharge: "",
	});
	// const [employees, setEmployees] = useState([]);
	const handleChange = (e) => {
		setVendor({ ...vendor, [e.target.name]: e.target.value });
		console.log(vendor);
	};
	const handleSubmit = async () => {
		try {
			const data = await updateVendor(vendor?.id, {
				name: vendor?.name,
				address: vendor?.address,
				contact: vendor?.contact,
				officer_incharge: vendor?.officer_incharge?.id,
			});
			if (data.status === 201) {
				toast("Vendor Added", {
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
	const getUsers = async () => {
		try {
			const data = await getAllVendors();
			console.log(data);
			if (data.status === 200) {
				setVendor(data?.data);
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
		setVendor(vendorInfo);
	}, [vendorInfo]);
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
						Add Vendor
					</Typography>
					<IconButton onClick={onCloseFilter}>
						<Icon icon={closeFill} width={20} height={20} />
					</IconButton>
				</Stack>

				<Divider />
				<Grid container spacing={2} sx={{ px: 5, py: 10 }}>
					<Grid item xs={12} sm={12} lg={6}>
						<TextField
							label="Vendor Name"
							name="name"
							value={vendor?.name}
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>

					<Grid item xs={12} sm={12} lg={6}>
						<TextField
							label="Name of Officer Incharge"
							name="officer_incharge"
							value={vendor?.officer_incharge}
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>

					<Grid item xs={12} sm={12} lg={6}>
						<TextField
							label="Contact"
							name="contact"
							value={vendor?.contact}
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>
					<Grid item xs={12} sm={12} lg={6}>
						<TextField
							label="Email"
							name="email"
							value={vendor?.email}
							onChange={handleChange}
							fullWidth
						></TextField>
					</Grid>

					<Grid item xs={12} sm={12} lg={12}>
						<TextField
							label="Address"
							name="address"
							value={vendor?.address}
							onChange={handleChange}
							multiline
							rows={3}
							fullWidth
						></TextField>
					</Grid>

					<Grid item xs={12} sm={12} lg={12} align="center">
						<Button
							variant="contained"
							color="primary"
							onClick={handleSubmit}
						>
							Update Vendor
						</Button>
					</Grid>
				</Grid>
			</Drawer>
		</>
	);
}
