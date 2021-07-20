import axios from "axios";

const baseURL = "http://localhost:8000/api/";

const axiosInstance = axios.create({
	baseURL: baseURL,
	timeout: 5000,
	headers: {
		Authorization: localStorage.getItem("access_token")
			? `Bearer ${JSON.parse(localStorage.getItem("access_token"))}`
			: null,
		"Content-Type": "application/json",
		accept: "application/json",
	},
});


axiosInstance.interceptors.response.use(
	(response) => {
		return response;
	},
	async function (error) {
		const originalRequest = error.config;

		if (typeof error.response === "undefined") {
			alert(
				"A server/network error occurred. " +
					"Looks like CORS might be the problem. " +
					"Sorry about this - we will get it fixed shortly."
			);
			return Promise.reject(error);
		}

		if (
			error.response.status === 401 &&
			originalRequest.url === baseURL + "token/refresh/"
		) {
			window.location.href = "/login/";
			return Promise.reject(error);
		}

		if (
			error.response.data.code === "token_not_valid" &&
			error.response.status === 401 &&
			error.response.statusText === "Unauthorized"
		) {
			const refreshToken = localStorage.getItem("refresh_token");

			if (refreshToken) {
				const tokenParts = JSON.parse(atob(refreshToken.split(".")[1]));

				// exp date in token is expressed in seconds, while now() returns milliseconds:
				const now = Math.ceil(Date.now() / 1000);
				console.log(tokenParts.exp);

				if (tokenParts.exp > now) {
					return axiosInstance
						.post("token/refresh/", {
							refresh: refreshToken,
						})
						.then((response) => {
							localStorage.setItem(
								"access_token",
								response.data.access
							);
							localStorage.setItem(
								"refresh_token",
								response.data.refresh
							);

							axiosInstance.defaults.headers["Authorization"] =
								"JWT " + response.data.access;
							originalRequest.headers["Authorization"] =
								"JWT " + response.data.access;

							return axiosInstance(originalRequest);
						})
						.catch((err) => {
							console.log(err);
						});
				} else {
					console.log(
						"Refresh token is expired",
						tokenParts.exp,
						now
					);
					window.location.href = "/login/";
				}
			} else {
				console.log("Refresh token not available.");
				window.location.href = "/login/";
			}
		}

		// specific error handling done elsewhere
		return Promise.reject(error);
	}
);

// auth 
export const signIn = (formData) => axiosInstance.post('token/', formData);

// employees (users)
export const getAllEmployees = () => axiosInstance.get('users/user');
export const addEmployee = (formData)=> axiosInstance.post('users/user/',formData);

// gunmen's attendance 
export const viewAllAttendance = () => axiosInstance.get('attendance/attendance');

// gunmen
export const addGunmen = (formData)=> axiosInstance.post('vendor/gunmen/',formData);
export const updateGunmen = (formData)=> axiosInstance.put('vendor/gunmen/',formData);
export const deleteGunmen = ()=> axiosInstance.delete('vendor/gunmen/');
export const getGunmens = ()=> axiosInstance.get('vendor/gunmen');

// regions 
export const getAllRegions = () => axiosInstance.get('users/region');
export const addRegion = (formData) => axiosInstance.post('users/region/', formData);
export const updateRegion = (id,formData) =>{
	return axiosInstance.put(`users/region/${id}/`, formData);
}
export const deleteRegion = (id) =>{
	return axiosInstance.delete(`users/region/${id}/`);
}

// vendors 
export const getAllVendors = ()=> axiosInstance.get('vendor/vendor');
export const addVendor = (formData) => axiosInstance.post('vendor/vendor/', formData);
export const updateVendor = (id,formData) =>{
	return axiosInstance.put (`vendor/vendor/${id}/`, formData);
}
export const deleteVendor = (row) =>{ console.log(row);
	return axiosInstance.delete(`users/vendor/${row}/`);
}

// Vehicle 
export const getAllVehicles = () => axiosInstance.get('users/vehicle');
export const AddVehicle = (formData) => axiosInstance.post('users/vehicle/', formData);
export const updateVehicle = (id,formData) =>{
	return axiosInstance.put(`users/vehicle/${id}/`, formData);
}
export const deleteVehicle = (id) =>{
	return axiosInstance.delete(`users/vehicle/${id}/`);
}

// branch 
export const getAllBranch = ()=> axiosInstance.get('users/branch');
export const addBranch = (formData)=> axiosInstance.post('users/branch/', formData);
export const updateBranch = (id,formData) =>{
	return axiosInstance.put(`users/branch/${id}/`, formData);
}
export const deleteBranch = (id) =>{
	return axiosInstance.delete(`users/branch/${id}/`);
}
// Issues 



