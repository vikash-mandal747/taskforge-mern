import { createContext, useContext, useEffect, useState } from "react";
import jwtDecode from "jwt-decode";
import api from "../api/axios";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Restore session on refresh
    useEffect(() => {
        const token = localStorage.getItem("accessToken");
        if (token) {
            const decoded = jwtDecode(token);
            setUser({ id: decoded.userId, role: decoded.role });
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        const res = await api.post("/login", { email, password });

        const { accessToken } = res.data;
        localStorage.setItem("accessToken", accessToken);

        const decoded = jwtDecode(accessToken);
        setUser({ id: decoded.userId, role: decoded.role });

        return decoded.role;
    };

    const logout = () => {
        localStorage.removeItem("accessToken");
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};


export const useAuth = () => useContext(AuthContext);
