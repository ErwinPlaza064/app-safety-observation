import defaultTheme from "tailwindcss/defaultTheme";
import forms from "@tailwindcss/forms";

/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php",
        "./storage/framework/views/*.php",
        "./resources/views/**/*.blade.php",
        "./resources/js/**/*.jsx",
    ],

    theme: {
        extend: {
            fontFamily: {
                sans: ["Figtree", ...defaultTheme.fontFamily.sans],
            },
            colors: {
                wasion: {
                    DEFAULT: "#22408e",
                    50: "#eff3ff",
                    100: "#dbe5fe",
                    200: "#bfd2fe",
                    300: "#93b4fc",
                    400: "#608df8",
                    500: "#3a67f2",
                    600: "#2447e7",
                    700: "#1c35d4",
                    800: "#1d2eab",
                    900: "#22408e",
                    950: "#171f50",
                },
            },
        },
    },

    plugins: [forms],
};
