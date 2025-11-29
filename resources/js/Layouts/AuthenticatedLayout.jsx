import ApplicationLogo from "@/Components/ApplicationLogo";
import Dropdown from "@/Components/Dropdown";
import NavLink from "@/Components/NavLink";
import ResponsiveNavLink from "@/Components/ResponsiveNavLink";
import { Link, usePage, router } from "@inertiajs/react";
import { useState, useEffect, useRef } from "react";
import { BiBell } from "react-icons/bi";

export default function AuthenticatedLayout({
    header,
    children,
    notificationCount = 0,
    notifications = [],
}) {
    const user = usePage().props.auth.user;

    const [showingNavigationDropdown, setShowingNavigationDropdown] =
        useState(false);
    const [isLoggingOut, setIsLoggingOut] = useState(false);

    const [badgeCount, setBadgeCount] = useState(0);

    const prevCountRef = useRef(notificationCount);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            prevCountRef.current = notificationCount;
            return;
        }

        if (user.is_ehs_manager) {
            const diff = notificationCount - prevCountRef.current;

            if (diff > 0) {
                setBadgeCount((prev) => prev + diff);

                const audio = new Audio("/sounds/notification.mp3");
                audio.play().catch((error) => {
                    console.log("Reproducción de audio bloqueada:", error);
                });

                if (navigator.vibrate) navigator.vibrate(200);
            }
        }

        prevCountRef.current = notificationCount;
    }, [notificationCount, user.is_ehs_manager]);

    const handleLogout = (e) => {
        e.preventDefault();
        setIsLoggingOut(true);

        setTimeout(() => {
            router.post(route("logout"));
        }, 1500);
    };

    const clearNotifications = () => {
        setBadgeCount(0);
    };

    const timeAgo = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    return (
        <div className="min-h-screen bg-gray-100">
            <nav className="bg-white border-b border-gray-100">
                <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16">
                        <div className="flex">
                            <div className="flex items-center shrink-0">
                                <Link href="/">
                                    <ApplicationLogo className="block w-auto h-6 text-gray-800 fill-current" />
                                </Link>
                            </div>
                        </div>
                        <div className="justify-center hidden space-x-8 sm:-my-px sm:ms-10 sm:flex">
                            <NavLink
                                href={route("dashboard")}
                                active={route().current("dashboard")}
                            >
                                Dashboard
                            </NavLink>
                        </div>

                        <div className="hidden sm:ms-6 sm:flex sm:items-center">
                            <div className="relative ms-3">
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <span className="inline-flex rounded-md">
                                            <button
                                                type="button"
                                                className="inline-flex items-center px-3 py-2 text-sm font-medium leading-4 text-gray-500 transition duration-150 ease-in-out bg-white border border-transparent rounded-md hover:text-gray-700 focus:outline-none"
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
                            {user.is_ehs_manager && (
                                <div className="relative mr-0">
                                    <Dropdown>
                                        <Dropdown.Trigger>
                                            <button
                                                onClick={clearNotifications}
                                                className="relative p-1 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                            >
                                                <BiBell className="w-6 h-6" />

                                                {badgeCount > 0 && (
                                                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse border-2 border-white">
                                                        {badgeCount}
                                                    </span>
                                                )}
                                            </button>
                                        </Dropdown.Trigger>

                                        <Dropdown.Content width="96">
                                            <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase border-b bg-gray-50">
                                                Recientes
                                            </div>

                                            <div className="overflow-y-auto max-h-64">
                                                {notifications.length > 0 ? (
                                                    notifications
                                                        .slice(0, 5)
                                                        .map((notif) => (
                                                            <Dropdown.Link
                                                                key={notif.id}
                                                                href={route(
                                                                    "observations.show",
                                                                    notif.id
                                                                )}
                                                                className="transition-colors border-b border-gray-50 hover:bg-blue-50"
                                                            >
                                                                <div className="flex flex-col gap-1 py-1">
                                                                    <div className="flex items-center justify-between">
                                                                        <span
                                                                            className={`font-bold text-xs uppercase ${
                                                                                notif.observation_type ===
                                                                                "acto_inseguro"
                                                                                    ? "text-orange-600"
                                                                                    : notif.observation_type ===
                                                                                      "condicion_insegura"
                                                                                    ? "text-red-600"
                                                                                    : "text-green-600"
                                                                            }`}
                                                                        >
                                                                            {notif.observation_type?.replace(
                                                                                /_/g,
                                                                                " "
                                                                            )}
                                                                        </span>
                                                                        <span className="text-[10px] text-gray-400">
                                                                            {timeAgo(
                                                                                notif.created_at
                                                                            )}
                                                                        </span>
                                                                    </div>

                                                                    <span className="text-sm font-medium text-gray-600 truncate">
                                                                        {
                                                                            notif.description
                                                                        }
                                                                    </span>

                                                                    <span className="text-xs text-blue-500">
                                                                        {notif
                                                                            .area
                                                                            ?.name ||
                                                                            "Sin área"}
                                                                    </span>
                                                                </div>
                                                            </Dropdown.Link>
                                                        ))
                                                ) : (
                                                    <div className="px-4 py-6 text-sm text-center text-gray-500">
                                                        No hay notificaciones
                                                        recientes
                                                    </div>
                                                )}
                                            </div>
                                        </Dropdown.Content>
                                    </Dropdown>
                                </div>
                            )}
                        </div>

                        <div className="flex items-center -me-2 sm:hidden">
                            {user.is_ehs_manager && (
                                <Dropdown>
                                    <Dropdown.Trigger>
                                        <button
                                            onClick={clearNotifications}
                                            className="relative p-1 text-gray-400 transition-colors rounded-full hover:text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                        >
                                            <BiBell className="w-6 h-6" />

                                            {badgeCount > 0 && (
                                                <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse border-2 border-white">
                                                    {badgeCount}
                                                </span>
                                            )}
                                        </button>
                                    </Dropdown.Trigger>

                                    <Dropdown.Content width="80">
                                        <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase border-b bg-gray-50">
                                            Recientes
                                        </div>

                                        <div className="overflow-y-auto max-h-64">
                                            {notifications.length > 0 ? (
                                                notifications
                                                    .slice(0, 5)
                                                    .map((notif) => (
                                                        <Dropdown.Link
                                                            key={notif.id}
                                                            href={route(
                                                                "observations.show",
                                                                notif.id
                                                            )}
                                                            className="transition-colors border-b border-gray-50 hover:bg-blue-50"
                                                        >
                                                            <div className="flex flex-col gap-1 py-1">
                                                                <div className="flex items-center justify-between">
                                                                    <span
                                                                        className={`font-bold text-xs uppercase ${
                                                                            notif.observation_type ===
                                                                            "acto_inseguro"
                                                                                ? "text-orange-600"
                                                                                : notif.observation_type ===
                                                                                  "condicion_insegura"
                                                                                ? "text-red-600"
                                                                                : "text-green-600"
                                                                        }`}
                                                                    >
                                                                        {notif.observation_type?.replace(
                                                                            /_/g,
                                                                            " "
                                                                        )}
                                                                    </span>
                                                                    <span className="text-[10px] text-gray-400">
                                                                        {timeAgo(
                                                                            notif.created_at
                                                                        )}
                                                                    </span>
                                                                </div>

                                                                <span className="text-sm font-medium text-gray-600 truncate">
                                                                    {
                                                                        notif.description
                                                                    }
                                                                </span>

                                                                <span className="text-xs text-blue-500">
                                                                    {notif.area
                                                                        ?.name ||
                                                                        "Sin área"}
                                                                </span>
                                                            </div>
                                                        </Dropdown.Link>
                                                    ))
                                            ) : (
                                                <div className="px-4 py-6 text-sm text-center text-gray-500">
                                                    No hay notificaciones
                                                    recientes
                                                </div>
                                            )}
                                        </div>
                                    </Dropdown.Content>
                                </Dropdown>
                            )}

                            <button
                                onClick={() =>
                                    setShowingNavigationDropdown(
                                        (previousState) => !previousState
                                    )
                                }
                                className="inline-flex items-center justify-center p-2 text-gray-400 transition duration-150 ease-in-out rounded-md hover:bg-gray-100 hover:text-gray-500 focus:bg-gray-100 focus:text-gray-500 focus:outline-none"
                            >
                                <svg
                                    className="w-6 h-6"
                                    stroke="currentColor"
                                    fill="none"
                                    viewBox="0 0 24 24"
                                >
                                    <path
                                        className={
                                            !showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M4 6h16M4 12h16M4 18h16"
                                    />
                                    <path
                                        className={
                                            showingNavigationDropdown
                                                ? "inline-flex"
                                                : "hidden"
                                        }
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        strokeWidth="2"
                                        d="M6 18L18 6M6 6l12 12"
                                    />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className={
                        (showingNavigationDropdown ? "block" : "hidden") +
                        " sm:hidden"
                    }
                >
                    <div className="pt-2 pb-3 space-y-1">
                        <ResponsiveNavLink
                            href={route("dashboard")}
                            active={route().current("dashboard")}
                        >
                            Dashboard
                        </ResponsiveNavLink>
                    </div>

                    <div className="pt-4 pb-1 border-t border-gray-200">
                        <div className="space-y-1 ">
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
            </nav>

            {header && (
                <header className="bg-white shadow">
                    <div className="px-4 py-6 mx-auto max-w-7xl sm:px-6 lg:px-8">
                        {header}
                    </div>
                </header>
            )}

            <main>{children}</main>
        </div>
    );
}
