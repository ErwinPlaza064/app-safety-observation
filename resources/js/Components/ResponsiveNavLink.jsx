import { Link } from "@inertiajs/react";

export default function ResponsiveNavLink({
    active = false,
    className = "",
    children,
    onClick,
    ...props
}) {
    return (
        <Link
            {...props}
            onClick={onClick}
            className={`flex w-full items-start border-l-4 py-2 pe-4 ps-3 ${
                active
                    ? "border-[#1e3a8a] dark:border-blue-400 bg-indigo-50 dark:bg-gray-700 text-[#1e3a8a] dark:text-blue-300 focus:border-[#1e3a8a] dark:focus:border-blue-400 focus:bg-indigo-100 dark:focus:bg-gray-600 focus:text-indigo-800 dark:focus:text-blue-200"
                    : "border-transparent text-gray-600 dark:text-gray-400 hover:border-gray-300 dark:hover:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-gray-800 dark:hover:text-gray-300 focus:border-gray-300 dark:focus:border-gray-600 focus:bg-gray-50 dark:focus:bg-gray-700 focus:text-gray-800 dark:focus:text-gray-300"
            } text-base font-medium transition duration-150 ease-in-out focus:outline-none ${className}`}
        >
            {children}
        </Link>
    );
}
