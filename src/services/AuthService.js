import axios from "axios";

const API_URL = "http://localhost:8080";

export const AuthService = {
    login: async ({ email, password }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/auth/token`,
                {}, // cuerpo vacío porque Spring Security lo toma de Basic Auth
                {
                    auth: { username: email, password: password }, // basic auth
                    withCredentials: true,
                }
            );

            const data = response.data;

            // Guardar token
            if (data.token) {
                localStorage.setItem("token", data.token);
            }

            // Guardar usuario y rol
            const userData = {
                username: data.username,
                role: data.role,
            };
            localStorage.setItem("user", JSON.stringify(userData));

            return {
                token: data.token,
                username: data.username,
                role: data.role,
            };
        } catch (error) {
            if (error.response?.status === 401) {
                throw new Error("Usuario o contraseña incorrectos");
            }
            throw new Error(error.response?.data?.message || error.message);
        }
    },

    logout: async () => {
        try {
            const token = localStorage.getItem("token");

            await axios.post(
                `${API_URL}/auth/logout`,
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
            throw error;
        }
    },

    register: async ({ username, email, password }) => {
        try {
            const response = await axios.post(
                `${API_URL}/api/register`,
                { username, email, password },
                { withCredentials: true }
            );
            return response.data;
        } catch (error) {
            throw new Error(error.response?.data?.message || error.message);
        }
    },

    isAuthenticated: () => !!localStorage.getItem("token"),

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
