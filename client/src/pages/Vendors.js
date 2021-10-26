import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useState,useEffect } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
import { showToast, showErrorToast } from "src/utils/toasts";
// material
import {
	Card,
	Table,
	Stack,
	Avatar,
	Button,
	Checkbox,
	TableRow,
	TableBody,
	TableCell,
	Container,
	Typography,
	TableContainer,
	TablePagination,
	Breadcrumbs
} from "@material-ui/core";
// components
import Page from "../components/Page";
import Label from "../components/Label";
import Scrollbar from "../components/Scrollbar";
import SearchNotFound from "../components/SearchNotFound";
import {
	UserListHead,
	UserListToolbar,
	UserMoreMenu,
} from "../components/_dashboard/user";
//
import USERLIST from "../_mocks_/user";
import AddEmployee from '../components/AddVendor/AddVendor';
import UpdateEmployee from "src/components/updateVendor/updateVendor";
import AddVendor from '../components/AddVendor/AddVendor';
import UpdateVendor from "../components/updateVendor/updateVendor";
import { getAllEmployees,getAllVendors, deleteVendor } from "../api/index";

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: "id", label : 'ID' },
	{ id: "name", label: "Name Of Vendor", alignRight: false },
	{ id: "address", label: "Address", alignRight: false },
	{ id: "email", label: "Vendor's Email", alignRight: false },
	{ id: "contact", label: "Contact", alignRight: false },
	{ id: "officer_incharge", label: "Officer Incharge", alignRight: false },
	{ id: "" },
	{ id: "" },
];

// ----------------------------------------------------------------------

function descendingComparator(a, b, orderBy) {
	if (b[orderBy] < a[orderBy]) {
		return -1;
	}
	if (b[orderBy] > a[orderBy]) {
		return 1;
	}
	return 0;
}

function getComparator(order, orderBy) {
	return order === "desc"
		? (a, b) => descendingComparator(a, b, orderBy)
		: (a, b) => -descendingComparator(a, b, orderBy);
}

function applySortFilter(array, comparator, query) {
	const stabilizedThis = array.map((el, index) => [el, index]);
	stabilizedThis.sort((a, b) => {
		const order = comparator(a[0], b[0]);
		if (order !== 0) return order;
		return a[1] - b[1];
	});
	if (query) {
		return filter(
			array,
			(_user) =>
				_user.name.toLowerCase().indexOf(query.toLowerCase()) !== -1
		);
	}
	return stabilizedThis.map((el) => el[0]);
}

export default function User() {
	const [page, setPage] = useState(0);
	const [order, setOrder] = useState("asc");
	const [selected, setSelected] = useState([]);
	const [orderBy, setOrderBy] = useState("name");
	const [filterName, setFilterName] = useState("");
	const [rowsPerPage, setRowsPerPage] = useState(5);
	const [isAddEmployeeOpen, setAddEmployeeOpen] = useState(false);
	const [isUpdateEmployeeOpen, setUpdateEmployeeOpen] = useState(false);
	const [vendors, setVendors] = useState([]);
	const [vendorInfo, setVendorInfo] = useState({});



	// const handleClose

	const handleRequestSort = (event, property) => {
		const isAsc = orderBy === property && order === "asc";
		setOrder(isAsc ? "desc" : "asc");
		setOrderBy(property);
	};

	const handleSelectAllClick = (event) => {
		if (event.target.checked) {
			const newSelecteds = USERLIST.map((n) => n.name);
			setSelected(newSelecteds);
			return;
		}
		setSelected([]);
	};

	const handleClick = (event, name) => {
		const selectedIndex = selected.indexOf(name);
		let newSelected = [];
		if (selectedIndex === -1) {
			newSelected = newSelected.concat(selected, name);
		} else if (selectedIndex === 0) {
			newSelected = newSelected.concat(selected.slice(1));
		} else if (selectedIndex === selected.length - 1) {
			newSelected = newSelected.concat(selected.slice(0, -1));
		} else if (selectedIndex > 0) {
			newSelected = newSelected.concat(
				selected.slice(0, selectedIndex),
				selected.slice(selectedIndex + 1)
			);
		}
		setSelected(newSelected);
	};

	const handleChangePage = (event, newPage) => {
		setPage(newPage);
	};

	const handleChangeRowsPerPage = (event) => {
		setRowsPerPage(parseInt(event.target.value, 10));
		setPage(0);
	};

	const handleFilterByName = (event) => {
		setFilterName(event.target.value);
	};

	const emptyRows =
		page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

	const filteredUsers = applySortFilter(
		USERLIST,
		getComparator(order, orderBy),
		filterName
	);

	const isUserNotFound = filteredUsers.length === 0;
	const openUpdateVendorDrawer = (row)=>{
		setVendorInfo(row);
		setUpdateEmployeeOpen(true);
	}
	const handleDeleteVendor = async (vendor)=>{
		try{
				const data = await deleteVendor(
			vendor?.id,
			);
				console.log(data);
				if(data.status === 204){
					showToast();
					getData();
				}else showErrorToast();
			}catch(error){
				showErrorToast();
			}
	  }

	const getData = async ()=>{
		try{
			const data = await getAllVendors();
			console.log(data);
			if(data.status === 200 ){
				setVendors(data?.data?.results);
			}else{
				showErrorToast();
			}
		}catch(error){
			showErrorToast();
		}
	}

	useEffect(() => {
		getData();
	}, []);


	return (
		<Page title="Vendors">
			<Container>
				<Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					mb={5}
				>
					<Breadcrumbs aria-label="breadcrumb">
						<RouterLink color="inherit" to="/" onClick={handleClick}>
							Dashboard
						</RouterLink>
						<Typography color="textPrimary">Vendors</Typography>
					</Breadcrumbs>
					<Button
						variant="contained"
						onClick={()=>{setAddEmployeeOpen(true)}}
						startIcon={<Icon icon={plusFill} />}
					>
						New Vendor
					</Button>
				</Stack>
				<AddEmployee
							isOpenFilter={isAddEmployeeOpen}
							onOpenFilter= {()=>{setAddEmployeeOpen(true)}}
							onCloseFilter={async ()=>{
								setAddEmployeeOpen(false)
								await getData();
								}
							}
				/>
				<UpdateEmployee
					isOpenFilter={isUpdateEmployeeOpen}
					onOpenFilter= {()=>{setUpdateEmployeeOpen(true)}}
					onCloseFilter={async()=>{
						setUpdateEmployeeOpen(false)
						await getData();
					}
				}
					vendorInfo={vendorInfo}
				/>
				<Card>
					<UserListToolbar
						numSelected={selected.length}
						filterName={filterName}
						onFilterName={handleFilterByName}
					/>

					<Scrollbar>
						<TableContainer sx={{ minWidth: 800 }}>
							<Table>
								<UserListHead
									order={order}
									orderBy={orderBy}
									headLabel={TABLE_HEAD}
									rowCount={USERLIST.length}
									numSelected={selected.length}
									onRequestSort={handleRequestSort}
									onSelectAllClick={handleSelectAllClick}
								/>
								<TableBody>
									{
										vendors.map((row)=>(
											<TableRow>
											<TableCell component="th" scope="row">
												{row.id}
											</TableCell>
											<TableCell >
												{row.name}
											</TableCell>
											<TableCell >
												{row.address}
											</TableCell>
											<TableCell >
												{row.email}
											</TableCell>
											<TableCell >
												{row.contact}
											</TableCell>
											<TableCell >
												{row.officer_incharge}
											</TableCell>

											<TableCell align="right">
												<UserMoreMenu
													handleEdit={()=>{openUpdateVendorDrawer(row)}}
												handleDelete={()=>{handleDeleteVendor(row)}}
												/>
											</TableCell>
											</TableRow>
										))
									}
								</TableBody>
							</Table>
						</TableContainer>
					</Scrollbar>

					<TablePagination
						rowsPerPageOptions={[5, 10, 25]}
						component="div"
						count={USERLIST.length}
						rowsPerPage={rowsPerPage}
						page={page}
						onPageChange={handleChangePage}
						onRowsPerPageChange={handleChangeRowsPerPage}
					/>
				</Card>
			</Container>
		</Page>
	);
}
