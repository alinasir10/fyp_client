import axios, { AxiosError } from 'axios';

interface ErrorResponse {
  message: string;
}

const axiosInstance = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ErrorResponse>) => {
    const errorMessage =
      error.response?.data?.message ?? 'An unexpected error occurred. Please try again.';

    console.error('Axios Error:', errorMessage);

    return Promise.reject(new Error(errorMessage));
  }
);

export default axiosInstance;
