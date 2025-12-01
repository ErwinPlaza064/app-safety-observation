import { createContext, useContext, useEffect, useState } from "react";

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    const [theme, setTheme] = useState(() => {
        // Obtener tema guardado del localStorage o usar el predeterminado
        if (typeof window !== "undefined") {
            const savedTheme = localStorage.getItem("theme");
            return savedTheme || "light";
        }
        return "light";
    });

    useEffect(() => {
        const root = window.document.documentElement;

        // Remover ambas clases primero
        root.classList.remove("light", "dark");

        // Agregar la clase del tema actual
        root.classList.add(theme);

        // Guardar en localStorage
        localStorage.setItem("theme", theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export function useTheme() {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("useTheme debe ser usado dentro de un ThemeProvider");
    }
    return context;
}
