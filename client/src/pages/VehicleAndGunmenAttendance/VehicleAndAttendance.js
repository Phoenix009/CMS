import { filter } from "lodash";
import { Icon } from "@iconify/react";
import { sentenceCase } from "change-case";
import { useState,useEffect } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { Link as RouterLink } from "react-router-dom";
import {toast} from 'react-toastify';
import moment from "moment";
import { MapContainer, TileLayer, Marker, Popup,useMapEvents } from 'react-leaflet'
// material
import {
	Card,
	Table,
	Button,
	TableRow,
	TableBody,
	TableCell,
	Container,
	Typography,
	TableContainer,
    Grid,
    TextField
} from "@material-ui/core";
// components
import Page from "../../components/Page";
import Scrollbar from "../../components/Scrollbar";
import {
	UserListHead,
} from "../../components/_dashboard/user";
//
import USERLIST from "../../_mocks_/user";
import MarkAttendance from "../../components/MarkAttendance/MarkAttendance";

// ----------------------------------------------------------------------


const TABLE_HEAD = [
	{ id: "name", label: "Full Name", },
	{ id: "" },
];

// ----------------------------------------------------------------------


function LocationMarker() {
	const [position, setPosition] = useState(null)
	const map = useMapEvents({
	  click() {
		map.locate()
	  },
	  locationfound(e) {
		setPosition(e.latlng)
		map.flyTo(e.latlng, map.getZoom())
	  },
	})
  
	return position === null ? null : (
	  <Marker position={position}>
		<Popup>You are here</Popup>
	  </Marker>
	)
}

export default function VehicleAndGunMenAttendance() {
	const [checkIn, setCheckIn] = useState(false);
	const [geoPosition,setGeoPosition] = useState({});
	const [tripId, setTripId] = useState("");
	const handleCheckIn = ()=>{
		setCheckIn(true);
	}
	const startTrip = ()=>{
		console.log(geoPosition);
		console.log(tripId);
		
	}
	const getLocation = async ()=>{
		try{
			await navigator.geolocation.getCurrentPosition(position=>{
				 setGeoPosition({
					 latitide : position?.coords?.latitude, 
					 longitude : position?.coords?.longitude,
					 accuracy : position?.coords?.accuracy
				});
			 })
		}catch(error){
			console.log(error);
		}
	}
	useEffect(()=>{
		getLocation();
	},[]);
	return (
		<Page title="Attendance Record">
			<Container sx={{ py : 10}}>
				<MarkAttendance
					isOpenFilter={checkIn}
					onOpenFilter= {()=>{setCheckIn(true)}}
					onCloseFilter={()=>{setCheckIn(false)}}
					regionInfo = {{}}
				/>
                <Typography variant="h5" sx={{ py : 2}} align="center">
                    Attendance Details For Trip
                </Typography>
					<div style={{height:'100%'}}>
					<MapContainer
					center={{ lat: 51.505, lng: -0.09 }}
					zoom={13}
					scrollWheelZoom={false}>
					<TileLayer
					attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
					url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
					/>
						<LocationMarker />
					</MapContainer>,
					</div>
				<Card sx={{my:2, p:3}}>
					<Grid container spacing={3}>
						<Grid item xs={12} sm={12} lg={6}>
							<TextField
								label="Trip Id"
								name="trip_id"
								fullWidth
								onChange={(event)=>{
									setTripId(event.target.value);
								}}
							>
							</TextField>
						</Grid>
						<Grid item xs={12} sm={12} lg={6}>
							<Button
								sx={{py:2}}
								variant="contained"
								fullWidth
								color="secondary"
								onClick={startTrip}
							>
								Start Trip
							</Button>
						</Grid>
					</Grid>
				</Card>
				<Card sx={{my:2}}>
					<Scrollbar >
						<TableContainer>
							<Table>
								<UserListHead
									headLabel={TABLE_HEAD}
									rowCount={USERLIST.length}
								/>
								<TableBody>
									<TableRow>
										<TableCell>
											Keshav Mishra
										</TableCell>
										<TableCell>
											<Button
												variant="contained"
												color="secondary"
												fullWidth
												onClick={handleCheckIn}
											>
												CheckIn
											</Button>
										</TableCell>
									</TableRow>
								</TableBody>
							</Table>
						</TableContainer>
					</Scrollbar>
				</Card>
                
			</Container>
		</Page>
	);
}	