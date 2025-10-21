// src/services/AuthService.js
import axios from "axios";

const API_URL = "http://localhost:8080";

export const AuthService = {

    login: async ({ email, password }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/auth/token`,
                {},
                {
                    auth: { username: email, password: password },
                    withCredentials: true,
                }
            );

            const token = response.data;

            const payload = JSON.parse(atob(token.split('.')[1]));

            const userData = {
                token: token,
                username: payload.sub, 
                role: payload.scope,   
            };

            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify({
                username: userData.username,
                role: userData.role,
            }));

            return userData;

        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error("Usuario o contraseña incorrectos");
            }
            throw new Error(error.response?.data?.message || "Error al iniciar sesión");
        }
    },

    logout: async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                `${API_URL}/api/auth/logout`,
                {},
                {
                    headers: { Authorization: `Bearer ${token}` },
                    withCredentials: true,
                }
            );

            localStorage.removeItem("token");
            localStorage.removeItem("user");
            console.log("✅ Sesión cerrada correctamente");
            return true;
        } catch (error) {
            console.error("❌ Error en logout:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            throw new Error("Error al cerrar sesión");
        }
    },

    register: async ({ username, email, password }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/auth/register`,
                { username, email, password },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || "Error al registrar usuario");
        }
    },

    isAuthenticated: () => {
        try {
            const token = localStorage.getItem("token");
            const user = localStorage.getItem("user");

            if (!token || token === 'undefined' || token === 'null') {
                return false;
            }

            if (!user || user === 'undefined' || user === 'null') {
                return false;
            }

            try {
                const payload = JSON.parse(atob(token.split('.')[1]));
                const now = Date.now() / 1000;

                if (payload.exp && payload.exp < now) {
                    localStorage.removeItem("token");
                    localStorage.removeItem("user");
                    return false;
                }
            } catch (e) {
                return false;
            }

            return true;
        } catch (error) {
            console.error('Error en isAuthenticated:', error);
            return false;
        }
    },

    logout: async () => {
        try {
            // Con JWT stateless, solo necesitamos limpiar el localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            console.log("✅ Sesión cerrada correctamente");
            return true;
        } catch (error) {
            console.error("❌ Error en logout:", error);
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            throw new Error("Error al cerrar sesión");
        }
    },

    getToken: () => localStorage.getItem("token"),

    getCurrentUser: () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user) : null;
    },

    getUserRole: () => {
        const user = localStorage.getItem("user");
        return user ? JSON.parse(user).role : null;
    },
};
