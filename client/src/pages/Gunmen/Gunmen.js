import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useState,useEffect } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
import {toast} from 'react-toastify';
import moment from 'moment';
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
	Breadcrumbs,
	Link,
	TextField,
	Paper,
	Grid,
	FormLabel,
	InputLabel,
	Select,
	FormControl,
	MenuItem,
	FormHelperText,
	Box
} from "@material-ui/core";
// components
import Page from "../../components/Page";
import Label from "../../components/Label";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import {
	addGunmen,
	getAllVendors
} from '../../api/index';

import {
	UserListHead,
	UserListToolbar,
	UserMoreMenu,
} from "../../components/_dashboard/user";
//
import USERLIST from "../../_mocks_/user";
import {viewAllAttendance,getGunmens} from '../../api/index';


// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: "id", label: "ID" },
	{ id: "name", label: "Name" },
	{ id: "email", label: "Email"},
	{ id: "vendor", label: "Vendor"},
	{ id: "" },
];

const ADD_ATTENDANCE_TABLE_HEAD = [
	{ id: "id", label: "ID" },
	{ id: "name", label: "Name" },
	{ id: "email", label: "Email"},
	{ id: "vendor", label: "Vendor"},
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
	const [attendance, setAttendance] = useState([]);
	const [gunmensAttendance, setGunmensAttendance] = useState([]);

	const [vendor, setVendor] = useState([]);
	const [gunmens, setGunmens] = useState([]);
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
	const addAttendance = (row)=>{
		const isAlreadyPresent = attendance.filter((value)=>{return value.id===row.id});
		if(isAlreadyPresent.length > 0) return;
		setAttendance([...attendance, row])
	}
	const removeAttendance = (row)=>{
		const newAttendance = attendance.filter((value)=>{return value.id!==row.id});
		setAttendance(newAttendance);
	}
	const [gunmen, setGunmen] = useState({
		first_name : '',
		last_name : '',
		email : '',
		vendor : ''
	});
	
	const handleChange = (e)=>{
		setGunmen({...gunmen, [e.target.name] : e.target.value});
		console.log(gunmen);
	}
	const handleSubmit = async ()=>{
		try{
				const data = await addGunmen(gunmen);
				console.log(data);
				if(data.status === 201){
					await getData();
					toast('Gunman Added', {
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
	const getVendors = async ()=>{
		try{
			const data = await getAllVendors();
			console.log(data);
			if(data.status === 200 ){
				setVendor(data?.data);
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
	const getData = async ()=>{
		try{
			const data = await getGunmens();
			console.log(data);
			if(data.status === 200 ){
				setGunmens(data?.data);
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
	const getAttendanceData = async ()=>{
		try{
			const data = await viewAllAttendance();
			console.log(data);
			if(data.status === 200 ){
				setGunmensAttendance(data?.data);
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
		getData();
		getAttendanceData();
		getVendors();
	}, []);

	return (
		<>
		
		<Page title="Gunmen">
			
			<Container >
			
			<Container style={{padding:'20px', margin:'20px'}}><Breadcrumbs aria-label="breadcrumb">
				<RouterLink color="inherit" to="/" onClick={handleClick}>
					Dashbord
				</RouterLink>
				<Typography color="textPrimary">Gunmen's Attendance</Typography>
			</Breadcrumbs></Container>
				
				<Card style={{padding:'20px', marginBottom : '10px'}}>
					<Grid container spacing={3} direction={{ xs: 'column', sm: 'row' }}>
						<Grid item xs={12} sm={12} lg={3}>
							<TextField
								fullWidth
								name="first_name"
								label="First name"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={12} lg={3}>
							<TextField
								fullWidth
								name="last_name"
								label="Last name"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={12} lg={3}>
							<TextField
								fullWidth
								name="email"
								label="Email"
								onChange={handleChange}
							/>
						</Grid>
						<Grid item xs={12} sm={12} lg={3}>
							<FormControl variant="outlined" fullWidth >
								<InputLabel id="demo-simple-select-outlined-label">Vendor</InputLabel>
									<Select
									labelId="demo-simple-select-outlined-label"
									id="demo-simple-select-outlined"
									label="Age"
									name="vendor"
									onChange={handleChange}
									>
								{
                          			vendor.map((instance)=>(
                            		<MenuItem value={instance.id}>{instance.name}</MenuItem>
                         			 ))
                        		}
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={12} lg={12} align="center">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Add Gunman </Button>
                </Grid>
					</Grid>
				</Card>
				

				<Card >
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
									{gunmens.map((row)=>(
										<TableRow key={row.name}>
											<TableCell component="th" scope="row">
												{row.id}
											</TableCell>
											<TableCell >
												{`${row?.first_name} ${row?.last_name}`}
											</TableCell>
											<TableCell >
												{row?.email}
											</TableCell>
											<TableCell>
												{row?.vendor.name}
											</TableCell>
											<TableCell>
												<Button 
													color="secondary" 
													variant="contained"
													onClick={()=>{addAttendance(row)}}
												>
													Add Attendance
												</Button>
											</TableCell>

									  </TableRow>
									))}
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
				<Box sx={{my:5}}>
					<Card >
					
						<Typography variant="h5" align="center"sx={{py:2}}>
							Add Attendance
						</Typography>

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
										{attendance.map((row)=>(
											<TableRow key={row.name}>
												<TableCell component="th" scope="row">
													{row.id}
												</TableCell>
												<TableCell >
													{`${row?.first_name} ${row?.last_name}`}
												</TableCell>
												<TableCell >
													{row?.email}
												</TableCell>
												<TableCell>
													{row?.vendor.name}
												</TableCell>
												<TableCell>
												<Button 
													color="secondary" 
													variant="contained"
													sx = {{backgroundColor : "red"}}
													onClick={()=>{removeAttendance(row)}}
												>
													Remove
												</Button>
											</TableCell>

										</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Scrollbar>
					</Card>
				</Box>
				<Box sx={{my:5}}>
					<Card >
					
						<Typography variant="h5" align="center"sx={{py:2}}>
							Todays Attendance
						</Typography>

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
										{gunmensAttendance.map((row)=>(
											<TableRow key={row.name}>
												<TableCell component="th" scope="row">
													{row.id}
												</TableCell>
												<TableCell >
													{`${row?.gunmen?.first_name} ${row?.gunmen?.last_name}`}
												</TableCell>
												<TableCell >
													{row?.gunmen?.email}
												</TableCell>
												<TableCell>
													{moment(row?.entry_time).format('hh:mm on DD-MM-YYYY')}
												</TableCell>
												<TableCell>
													{
														row?.exit_time || 
														<Button 
															color="secondary" 
															variant="contained"
															
														>
															CheckOut
														</Button>
													}
												</TableCell>
												<TableCell>
													{row?.branch?.name}
												</TableCell>
												<TableCell>
													{row?.vendor?.name}
												</TableCell>
												<TableCell>
													{row?.added_by?.email}
												</TableCell>
												<TableCell>
													{row?.branch?.name}
												</TableCell>
												<TableCell>
											</TableCell>

										</TableRow>
										))}
									</TableBody>
								</Table>
							</TableContainer>
						</Scrollbar>
					</Card>
				</Box>
			</Container>
		</Page>
		</>
	);
}
