import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage, router } from "@inertiajs/react";
import { useState } from "react";
import NotificationBell from "@/Components/Dashboard/NotificationBell";
import ThemeToggle from "@/Components/ThemeToggle";
import { Transition } from "@headlessui/react";
import {
    HiOutlineUserGroup,
    HiOutlineShieldCheck,
    HiOutlineShieldExclamation,
} from "react-icons/hi";

export default function AuthenticatedLayout({
    header,
    observation,
    children,
    notificationCount = 0,
    notifications = [],
}) {
    const getInitials = (name) => {
        if (!name) return "";
        const parts = name.trim().split(" ");
        if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
        return (
            parts[0].charAt(0) + parts[parts.length - 1].charAt(0)
        ).toUpperCase();
    };
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const handleLogout = (e) => {
        e.preventDefault();
        setIsLoggingOut(true);

        setTimeout(() => {
            router.post(route("logout"));
        }, 1500);
    };

    return (
        <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
            <nav className="bg-white border-b border-gray-100 dark:bg-gray-800 dark:border-gray-700">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex items-center shrink-0">
                                <Link href="/">
                                    <ApplicationLogo className="block w-auto h-6 text-gray-800 fill-current dark:text-gray-200" />
                                </Link>
                            </div>
                        </div>
                        <div className="justify-center hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                            <NavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                            >
                                <div className="flex items-center gap-2">
                                    {user.is_super_admin ? (
                                        <>
                                            <HiOutlineShieldExclamation className="w-5 h-5 text-red-500" />
                                            <span>Dashboard Super Admin</span>
                                        </>
                                    ) : user.is_ehs_manager ? (
                                        <>
                                            <HiOutlineShieldCheck className="w-5 h-5 text-blue-500" />
                                            <span>Dashboard EHS</span>
                                        </>
                                    ) : (
                                        <>
                                            <HiOutlineUserGroup className="w-5 h-5 text-green-500" />
                                            <span>Dashboard Empleado</span>
                                        </>
                                    )}
                                </div>
                            </NavLink>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md dark:text-gray-400 dark:bg-gray-800 hover:text-gray-700 dark:hover:text-gray-300 focus:outline-none"
                                            >
                                                {user.name}

                                                <svg
                                                    className="-me-0.5 ms-2 h-4 w-4"
                                                    xmlns="http://www.w3.org/2000/svg"
                                                    viewBox="0 0 20 20"
                                                    fill="currentColor"
                                                >
                                                    <path
                                                        fillRule="evenodd"
                                                        d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                        clipRule="evenodd"
                                                    />
                                                </svg>
                                            </button>
                                        </span>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content>
                                        <div className="block w-full px-4 py-2 text-sm leading-5 text-start">
                                            <div className="flex items-center justify-between">
                                                <span className="text-gray-700 dark:text-gray-300">
                                                    Tema
                                                </span>
                                                <ThemeToggle />
                                            </div>
                                        </div>
                                        <div className="border-t border-gray-100 dark:border-gray-600"></div>
                                        <Dropdown.Link
                                            href={route("profile.edit")}
                                        >
                                            Perfil
                                        </Dropdown.Link>
                                        <Dropdown.Link
                                            href={route("logout")}
                                            method="post"
                                            as="button"
                                            onClick={handleLogout}
                                        >
                                            {isLoggingOut ? (
                                                <div className="flex items-center">
                                                    <svg
                                                        className="w-4 h-4 mr-2 animate-spin"
                                                        xmlns="http://www.w3.org/2000/svg"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                    >
                                                        <circle
                                                            className="opacity-25"
                                                            cx="12"
                                                            cy="12"
                                                            r="10"
                                                            stroke="currentColor"
                                                            strokeWidth="4"
                                                        ></circle>
                                                        <path
                                                            className="opacity-75"
                                                            fill="currentColor"
                                                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                        ></path>
                                                    </svg>
                                                    <span>
                                                        Cerrando sesión...
                                                    </span>
                                                </div>
                                            ) : (
                                                "Cerrar Sesión"
                                            )}
                                        </Dropdown.Link>
                                    </Dropdown.Content>
                                </Dropdown>
                            </div>
                        {!user.is_super_admin && (
                            <div>
                                <NotificationBell
                                    user={user}
                                    count={notificationCount}
                                    list={notifications}
                                />
                            </div>
                        )}
                    </div>

                    <div className="flex items-center -me-2 sm:hidden">
                        {!user.is_super_admin && (
                            <div>
                                <NotificationBell
                                    user={user}
                                    count={notificationCount}
                                    list={notifications}
                                />
                            </div>
                        )}

                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md dark:text-gray-500 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-500 dark:hover:text-gray-400 focus:bg-gray-100 dark:focus:bg-gray-700 focus:text-gray-500 focus:outline-none"
                            >
                                <div className="h-10 w-10 rounded-full bg-[#1e3a8a] flex items-center justify-center text-white font-bold text-lg shadow-md">
                                    {getInitials(user?.name)}
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <Transition
                    show={showingNavigationDropdown}
                    enter="transition ease-out duration-200"
                    enterFrom="opacity-0 -translate-y-4"
                    enterTo="opacity-100 translate-y-0"
                    leave="transition ease-in duration-150"
                    leaveFrom="opacity-100 translate-y-0"
                    leaveTo="opacity-0 -translate-y-4"
                    className="sm:hidden"
                >
                    <div className="sm:hidden">
                        <div className="pt-2 pb-3 space-y-1">
                            <ResponsiveNavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                            >
                                <div className="flex items-center gap-2">
                                    {user.is_super_admin ? (
                                        <>
                                            <HiOutlineShieldExclamation className="w-5 h-5 text-red-500" />
                                            <span>Dashboard Admin</span>
                                        </>
                                    ) : user.is_ehs_manager ? (
                                        <>
                                            <HiOutlineShieldCheck className="w-5 h-5 text-blue-500" />
                                            <span>Dashboard EHS</span>
                                        </>
                                    ) : (
                                        <>
                                            <HiOutlineUserGroup className="w-5 h-5 text-green-500" />
                                            <span>Dashboard Empleado</span>
                                        </>
                                    )}
                                </div>
                            </ResponsiveNavLink>
                        </div>

                        <div className="pt-4 pb-1 border-t border-gray-200 dark:border-gray-700">
                            <div className="space-y-1">
                                <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
                                    <div className="flex items-center justify-between">
                                        <span className="text-gray-700 dark:text-gray-300">
                                            Tema
                                        </span>
                                        <ThemeToggle />
                                    </div>
                                </div>
                                <ResponsiveNavLink href={route("profile.edit")}>
                                    Perfil
                                </ResponsiveNavLink>
                                <ResponsiveNavLink
                                    method="post"
                                    href={route("logout")}
                                    as="button"
                                    onClick={handleLogout}
                                >
                                    {isLoggingOut ? (
                                        <div className="flex items-center">
                                            <svg
                                                className="w-4 h-4 mr-2 animate-spin"
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                            >
                                                <circle
                                                    className="opacity-25"
                                                    cx="12"
                                                    cy="12"
                                                    r="10"
                                                    stroke="currentColor"
                                                    strokeWidth="4"
                                                ></circle>
                                                <path
                                                    className="opacity-75"
                                                    fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                                ></path>
                                            </svg>
                                            <span>Cerrando sesión...</span>
                                        </div>
                                    ) : (
                                        "Cerrar Sesión"
                                    )}
                                </ResponsiveNavLink>
                            </div>
                        </div>
                    </div>
                </Transition>
            </nav>

            {header && (
                <header className="bg-white shadow dark:bg-gray-800 dark:shadow-gray-900">
                    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
