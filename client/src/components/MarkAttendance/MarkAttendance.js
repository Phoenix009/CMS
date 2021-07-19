import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';
import { Icon } from '@iconify/react';
import { Form, FormikProvider } from 'formik';
import closeFill from '@iconify/icons-eva/close-fill';
import {toast} from 'react-toastify';
// material
import {
  Stack,
  Button,
  Drawer,
  Divider,
  IconButton,
  Typography,
  Grid,
  TextField,
} from '@material-ui/core';
MarkAttendance.propTypes = {
  isOpenFilter: PropTypes.bool,
  onResetFilter: PropTypes.func,
  onOpenFilter: PropTypes.func,
  onCloseFilter: PropTypes.func,
};

export default function MarkAttendance({
  isOpenFilter,
  onResetFilter,
  onOpenFilter,
  onCloseFilter,
}) {
  const [otp, setOtp] = useState("");
  const handleChange = (e)=>{
    setOtp(e.target.value);
  }
  useEffect(() => {
	}, []);
  return (
    <>
          <Drawer
            anchor="right"
            open={isOpenFilter}
            onClose={onCloseFilter}
            PaperProps={{
              sx: { width: '300', border: 'none', overflow: 'hidden' }
            }}
          >
            <Stack
              direction="row"
              alignItems="center"
              justifyContent="space-between"
              sx={{ px: 1, py: 2 }}
            >
              <Typography variant="subtitle1" sx={{ ml: 1 }}>
                CheckIn
              </Typography>
              <IconButton onClick={onCloseFilter}>
                <Icon icon={closeFill} width={20} height={20} />
              </IconButton>
            </Stack>

            <Divider />
            <Grid container spacing={2} sx={{ px: 5, py: 10 }}>
                <Grid item xs={12} sm={12} lg={6}>
                    <Typography align="center">
                        Keshav Mishra
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                    <Typography align="center">
                        Phone No. 737848959
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={12} lg={6}>
                    <TextField
                        label="Enter Otp"
                        name="otp"
                        onChange={handleChange}
                        fullWidth
                    >
                    </TextField>
                </Grid>
                
                <Grid item xs={12} sm={12} lg={12} align="center">
                    <Button variant="contained" color="secondary">CheckIn</Button>
                </Grid>
            </Grid>
          </Drawer>
    </>
  );
}
