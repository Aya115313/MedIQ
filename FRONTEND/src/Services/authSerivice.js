import axios from 'axios';
import { serialize } from 'cookie';


export const baseUrl = "http://localhost:8000";

/**
 * Clears both access and refresh tokens from cookies
 * This should be called during logout or when tokens are invalid
 *
 */


export const clearAuthTokens = () => {
  const cookieOptions = {
    httpOnly: false,
    path: '/',
    expires: new Date(0) 
  };  

  document.cookie = serialize('accessToken', '', cookieOptions);
  document.cookie = serialize('refreshToken', '', cookieOptions);
  
  delete instance.defaults.headers.common['Authorization'];
};

const instance = axios.create({
  baseURL: baseUrl,
  withCredentials: true, 
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
});

instance.interceptors.request.use(
  (request) => {
    const accessToken = document.cookie
      .split('; ')
      .find((cookie) => cookie.startsWith('accessToken='))
      ?.split('=')[1];
      
    if (accessToken) {
      request.headers['Authorization'] = `Bearer ${accessToken}`;
      console.log("✅ Attached token:", accessToken); 
    }
    return request;
  },
  (error) => Promise.reject(error)
);

instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        const refreshToken = document.cookie
          .split('; ')
          .find((cookie) => cookie.startsWith('refreshToken='))
          ?.split('=')[1];

        if (!refreshToken) {
          clearAuthTokens();
          document.location.href = "/login";
          return Promise.reject(error);
        }

        const response = await axios.post(`${baseUrl}/api/token/refresh/`, { refresh: refreshToken });
        const { access: newAccessToken, refresh: newRefreshToken } = response.data;

        if (!newAccessToken) {
          clearAuthTokens();
          document.location.href = "/login";
          return Promise.reject(error);
        }

        document.cookie = serialize('accessToken', newAccessToken, {
          httpOnly: false,
          path: '/',
          expires: new Date(Date.now() + 24 * 60 * 60 * 1000), // 1 day
        });

        if (newRefreshToken) {
          document.cookie = serialize('refreshToken', newRefreshToken, {
            httpOnly: false,
            path: '/',
            expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
          });
        }
        
        instance.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        clearAuthTokens();
        document.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }

);

export const getUserInfo = async () => {
    try {
        const response = await instance.get('/api/user/info/');
        return response.data;
    } catch (error) {
        console.error('Error fetching user info:', error);
        throw error;
    }
};

export default instance;