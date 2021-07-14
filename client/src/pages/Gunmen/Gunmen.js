import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useState,useEffect } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
import {toast} from 'react-toastify';
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
	FormHelperText
} from "@material-ui/core";
// components
import Page from "../../components/Page";
import Label from "../../components/Label";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import {
	UserListHead,
	UserListToolbar,
	UserMoreMenu,
} from "../../components/_dashboard/user";
//
import USERLIST from "../../_mocks_/user";
import {viewAllAttendance} from '../../api/index';

// ----------------------------------------------------------------------

const TABLE_HEAD = [
	{ id: "name", label: "Name" },
	{ id: "email", label: "Email"},
	{ id: "vendor", label: "Vendor"},
	{ id: "branch", label: "Branch" },
	{ id: "checkin", label: "Check-in"},
	{ id: "checkout", label: "Check-Out"},
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
	const [gunmen, setGunmen] = useState({
		first_name : '',
		last_name : '',
		email : '',
		value : ''
	  });
	
	  const handleChange = (e)=>{
		setGunmen({...gunmen, [e.target.name] : e.target.value});
		console.log(gunmen);
	  }
	  const handleSubmit = ()=>{
		console.log(gunmen);
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
	const getData = async ()=>{
		try{
			const data = await viewAllAttendance();
			console.log(data);
			if(data.status === 200 ){
				setAttendance(data?.data);
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

				{/* <Stack
					direction="row"
					alignItems="center"
					justifyContent="space-between"
					mb={5}
				>
					<Typography variant="h4" gutterBottom>
						User
					</Typography>
					<Button
						variant="contained"
						component={RouterLink}
						to="/forms/gunmen"
						startIcon={<Icon icon={plusFill} />}
					>
						New Gunman
					</Button>
				</Stack> */}
				
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
									onChange={handleChange}
									>
								<MenuItem value="">
									<em>None</em>
								</MenuItem>
								<MenuItem value={10}>Ten</MenuItem>
								<MenuItem value={20}>Twenty</MenuItem>
								<MenuItem value={30}>Thirty</MenuItem>
								</Select>
							</FormControl>
						</Grid>
						<Grid item xs={12} sm={12} lg={12} align="center">
                    <Button variant="contained" color="primary" onClick={handleSubmit}>Add Gunman </Button>
                </Grid>
					</Grid>
				</Card>
				

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
									{attendance.map((row)=>(
										<TableRow key={row.name}>
											<TableCell component="th" scope="row">
												{row.id}
											</TableCell>
											<TableCell >
												{`${row.gunmen.first_name} ${row.gunmen.last_name}`}
											</TableCell>
											<TableCell >
												{row.gunmen.email}
											</TableCell>
											<TableCell >
												{row.gunmen.vendor.name}
											</TableCell>
											<TableCell >
												{row.branch.name}
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
			</Container>
		</Page>
		</>
	);
}
