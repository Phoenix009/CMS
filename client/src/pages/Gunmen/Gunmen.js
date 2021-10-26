import { Icon } from "@iconify/react";
import { useState, useEffect } from "react";
import plusFill from "@iconify/icons-eva/plus-fill";
import { showToast, showErrorToast } from "src/utils/toasts";
import { Link as RouterLink } from "react-router-dom";
import {
    Card,
    Table,
    Stack,
    Button,
    TableRow,
    TableBody,
    TableCell,
    Container,
    Typography,
    TableContainer,
    TablePagination,
    Breadcrumbs,
} from "@material-ui/core";
// components
import Page from "src/components/Page";
import Scrollbar from "src/components/Scrollbar";
import {
    UserListHead,
    UserMoreMenu,
} from "src/components/_dashboard/user";
//
import AddGunmen from "src/components/AddGunman/AddGunman";
import UpdateGunmen from "src/components/updateGunmen/updateGunmen";
import { deleteGunmen, getAllGunmen } from "src/api";



const TABLE_HEAD = [
    { id: "id", label: "ID" },
    { id: "name", label: "First Name", alignRight: false },
    { id: "custodian_type", label: "Type", alignRight: false },
    { id: "phone_number", label: "Phone No.", alignRight: false },
    { id: "email", label: "Email", alignRight: false },
    { id: "vendor", label: "Vendor", alignRight: false },
    { id: "" },
];



export default function Branch() {
    const [page, setPage] = useState(0);

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    }


    const [gunmen, setGunmen] = useState([]);

    const getGunmen = async () => {
        try {
            const data = await getAllGunmen();
            if (data.status === 200) setGunmen(data?.data?.results);
            else showErrorToast();
        }   catch (error) {
            showErrorToast();
        }
    };

    const [gunmanInfo, setGunmanInfo] = useState({});
    const [isUpdateGunmanOpen, setUpdateGunmanOpen] = useState(false);
    const [isAddGunmenOpen, setAddGunmenOpen] = useState(false);


    const handleEditGunman = (gunman) => {
        setGunmanInfo(gunman);
        setUpdateGunmanOpen(true);
    };

    const handleDeleteGunman = async (gunman) => {
        try {
            const data = await deleteGunmen(gunman?.id);
            if (data.status === 204) {
                showToast("Custodian Deleted");
                getGunmen();
            } else showErrorToast();
        } catch (error) {
            showErrorToast();
        }
    };

    const [path, setPath] = useState([]);

    const handleBreadcrumbPath = (event, name) => {
        const selectedIndex = path.indexOf(name);
        let newPath = [];

        if (selectedIndex === -1) {
            newPath = newPath.concat(path, name);
        } else if (selectedIndex === 0) {
            newPath = newPath.concat(path.slice(1));
        } else if (selectedIndex === path.length - 1) {
            newPath = newPath.concat(path.slice(0, -1));
        } else if (selectedIndex > 0) {
            newPath = newPath.concat(
                path.slice(0, selectedIndex),
                path.slice(selectedIndex + 1)
            );
        }
        setPath(newPath);
    };


    useEffect(() => {
        getGunmen();
    }, []);



    return (
        <Page title="Custodian">
            <Container>
                <Stack
                    direction="row"
                    alignItems="center"
                    justifyContent="space-between"
                    mb={5}
                >
                    <Breadcrumbs aria-label="breadcrumb">
                        <RouterLink
                            color="inherit"
                            to="/"
                            onClick={handleBreadcrumbPath}
                        >
                            Dashboard
                        </RouterLink>
                        <Typography color="textPrimary">Custodian</Typography>
                    </Breadcrumbs>
                    <Button
                        variant="contained"
                        onClick={() => {
                            setAddGunmenOpen(true);
                        }}
                        startIcon={<Icon icon={plusFill} />}
                    >
                        New Custodian
                    </Button>
                </Stack>
                <AddGunmen
                    isOpenFilter={isAddGunmenOpen}
                    onOpenFilter={() => {
                        setAddGunmenOpen(true);
                    }}
                    onCloseFilter={() => {
                        setAddGunmenOpen(false);
                    }}
                />
                <UpdateGunmen
                    isOpenFilter={ isUpdateGunmanOpen }
                    onOpenFilter={ () => { setUpdateGunmanOpen(true) } }
                    onCloseFilter={ () => {
                        setUpdateGunmanOpen(false);
                        getGunmen();
                    } }

                    gunmenInfo={ gunmanInfo }
                />
                <Card>
                    <Scrollbar>
                        <TableContainer sx={{ minWidth: 800 }}>
                            <Table>
                                <UserListHead
                                    headLabel={TABLE_HEAD}
                                    rowCount={gunmen.length}
                                    numSelected={path.length}
                                />
                                <TableBody>{
                                    gunmen.map((gunman) => (
                                        <TableRow>
                                            <TableCell
                                                component="th"
                                                scope="row"
                                            >
                                                { gunman.id }
                                            </TableCell>
                                            <TableCell>
                                                { gunman.first_name  + gunman.last_name}
                                            </TableCell>
                                            <TableCell>
                                                { gunman.custodian_type === 'C' ? "Custodian" : "Gunman"}
                                            </TableCell>
                                            <TableCell>
                                                { gunman.phone_number }
                                            </TableCell>
                                            <TableCell>{ gunman.email }</TableCell>
                                            <TableCell>
                                                {`${gunman.vendor.name}`}
                                            </TableCell>
                                            <TableCell align="right">
                                                <UserMoreMenu
                                                    handleEdit={() => {
                                                        handleEditGunman(gunman);
                                                    }}
                                                    handleDelete={() => {
                                                        handleDeleteGunman(gunman);
                                                    }}
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
                        component="div"
                        count={gunmen.length}
                        rowsPerPageOptions={[]}
                        rowsPerPage={10}
                        page={page}
                        onPageChange={handleChangePage}
                    />
                </Card>
            </Container>
        </Page>
    );

}
