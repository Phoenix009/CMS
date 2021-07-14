import { useEffect } from "react";
import { Link as RouterLink,useNavigate } from "react-router-dom";
// material
import { experimentalStyled as styled } from "@material-ui/core/styles";
import { Card, Stack, Link, Container, Typography } from "@material-ui/core";
// layouts
import AuthLayout from "../layouts/AuthLayout";
// components
import Page from "../components/Page";
import { MHidden } from "../components/@material-extend";
import { LoginForm } from "../components/authentication/login";
import AuthSocial from "../components/authentication/AuthSocial";

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
	[theme.breakpoints.up("md")]: {
		display: "flex",
	},
}));

const SectionStyle = styled(Card)(({ theme }) => ({
	width: "100%",
	maxWidth: 464,
	display: "flex",
	flexDirection: "column",
	justifyContent: "center",
	margin: theme.spacing(2, 0, 2, 2),
}));

const ContentStyle = styled("div")(({ theme }) => ({
	maxWidth: 480,
	margin: "auto",
	display: "flex",
	minHeight: "100vh",
	flexDirection: "column",
	justifyContent: "center",
	padding: theme.spacing(12, 0),
}));

// ----------------------------------------------------------------------

export default function Login() {
	const navigate = useNavigate();
	useEffect(() => {
		const access_token = localStorage.getItem('access_token');
		const refresh_token = localStorage.getItem('refresh_token');
		if(access_token && refresh_token){
		  navigate('/dashboard/app');
		}
	},[]);
	return (
		<RootStyle title="Login">
			<AuthLayout />

			<MHidden width="mdDown">
				<SectionStyle>
					<Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
						Welcome Back
					</Typography>
					<img
						src="/static/assets/images/cmslogo.jpg"
						alt="login"
					/>
				</SectionStyle>
			</MHidden>

			<Container maxWidth="sm">
				<ContentStyle>
					<Stack sx={{ mb: 5 }}>
						<Typography variant="h4" gutterBottom>
							Sign in to CMS.
						</Typography>
						<Typography sx={{ color: "text.secondary" }}>
							Enter your details below.
						</Typography>
					</Stack>

					<LoginForm />

					<MHidden width="smUp">
						<Typography
							variant="body2"
							align="center"
							sx={{ mt: 3 }}
						>
							Don’t have an account?&nbsp;
							<Link
								variant="subtitle2"
								component={RouterLink}
								to="register"
							>
								Get started
							</Link>
						</Typography>
					</MHidden>
				</ContentStyle>
			</Container>
		</RootStyle>
	);
}
