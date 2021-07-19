import { experimentalStyled as styled  } from '@material-ui/core/styles';
import {Paper} from '@material-ui/core';

const RootStyle = styled(Paper)(({ theme }) => ({
    padding : theme.spacing(2)
}));

export default RootStyle;