import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
    const [usuario, setUsuario] = useState(() => {
        const saved = localStorage.getItem("usuario");
        return saved ? JSON.parse(saved) : null;
    });

    useEffect(() => {
        if (usuario) {
            localStorage.setItem("usuario", JSON.stringify(usuario));
        } else {
            localStorage.removeItem("usuario");
        }
    }, [usuario]);

    const login = (userData) => setUsuario(userData);
    const logout = () => setUsuario(null);

    return (
        <AuthContext.Provider value={{ usuario, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
