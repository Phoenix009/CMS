import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useState,useEffect } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
import {toast} from 'react-toastify';
import moment from "moment";
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
    Grid,
    Box,
    TextField
} from "@material-ui/core";
// components
import Page from "../../components/Page";
import Label from "../../components/Label";
import Scrollbar from "../../components/Scrollbar";
import SearchNotFound from "../../components/SearchNotFound";
import {
	AppOrderTimeline,
} from "../../components/_dashboard/app";
import {
	UserListHead,
} from "../../components/_dashboard/user";
//
import USERLIST from "../../_mocks_/user";

// ----------------------------------------------------------------------


const TABLE_HEAD = [
	{ id: "name", label: "Full Name", },
	{ id: "email", label: "Email" },
	{ id: "branch", label: "Branch"},
	{ id: "checkedIn", label: "Check In Time"},
	{ id: "checkedOut", label: "CheckOut In Time"},
	{ id: "" },
];





export default function User() {
	



	return (
		<Page title="Attendance Record">
			<Container sx={{ py : 10}}>
                <Typography variant="h5" sx={{ py : 2}} align="center">
                    Gunmen's Monthly Attendance Record for Jan 2021
                </Typography>
				
				<Card sx={{my:2}}>
					<Scrollbar >
						<TableContainer sx={{ minWidth: 800 }}>
							<Table>
								<UserListHead
									headLabel={TABLE_HEAD}
									rowCount={USERLIST.length}
								/>
								<TableBody>
									
								</TableBody>
								
							</Table>
						</TableContainer>
					</Scrollbar>
				</Card>
                <Grid container spacing={4} sx={{ py : 2}}>
                     <Grid item xs={12} md={12} lg={12}>
						<AppOrderTimeline />
					</Grid>
                    <Grid item xs={12} md={12} lg={12}>
                        <Card sx={{ py : 3, px : 3}}>
                            <Grid container spacing={4} sx={{ py : 2}}>
                                <Grid item xs={12} md={12} lg={12}>
                                    <Typography variant="h5">
                                        Request Changes/Comment
                                    </Typography>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12}> 
                                    <TextField
                                        label = "Message"
                                        fullWidth
                                        multiline
                                        rows={5}
                                    >
                                    </TextField>
                                </Grid>
                                <Grid item xs={12} md={12} lg={12} align="center"> 
                                    <Button
                                        sx={{width:300}} 
                                        variant="contained" 
                                        color="primary"
                                    >
                                        Send
                                    </Button>
                                </Grid>
                            </Grid>
                        </Card>
					</Grid>
                </Grid>
			</Container>
		</Page>
	);
}	