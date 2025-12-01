import { useTheme } from "@/Contexts/ThemeContext";
import { FiSun, FiMoon } from "react-icons/fi";

export default function ThemeToggle() {
    const { theme, toggleTheme } = useTheme();

    return (
        <button
            onClick={toggleTheme}
            className="relative inline-flex items-center justify-center p-2 text-gray-500 transition duration-150 ease-in-out rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-wasion-500"
            aria-label={`Cambiar a modo ${
                theme === "light" ? "oscuro" : "claro"
            }`}
            title={`Cambiar a modo ${theme === "light" ? "oscuro" : "claro"}`}
        >
            {theme === "light" ? (
                <FiMoon className="w-5 h-5" />
            ) : (
                <FiSun className="w-5 h-5" />
            )}
        </button>
    );
}
