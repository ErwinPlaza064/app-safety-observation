import { useState, useEffect, useRef } from "react";
import { Link } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import { BiBell } from "react-icons/bi";

export default function NotificationBell({ user, count = 0, list = [] }) {
    if (!user.is_ehs_manager) return null;

    const [badgeCount, setBadgeCount] = useState(0);
    const prevCountRef = useRef(count);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            prevCountRef.current = count;
            return;
        }

        const diff = count - prevCountRef.current;

        if (diff > 0) {
            setBadgeCount((prev) => prev + diff);

            const audio = new Audio("/sounds/notification.mp3");
            audio.play().catch((e) => console.log("Audio bloqueado", e));

            if (navigator.vibrate) navigator.vibrate(200);
        }

        prevCountRef.current = count;
    }, [count]);

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
        <div className="relative">
            <Dropdown>
                <Dropdown.Trigger>
                    <button className="relative p-1 text-gray-400 transition-colors rounded-full dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
                        <BiBell className="w-7 h-7 lg:w-6 lg:h-6" />

                        {badgeCount > 0 && (
                            <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 rounded-full animate-pulse border-2 border-white dark:border-gray-800">
                                {badgeCount}
                            </span>
                        )}
                    </button>
                </Dropdown.Trigger>

                <Dropdown.Content width="80">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase border-b border-gray-200 dark:text-gray-500 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                        Recientes
                    </div>

                    <div className="overflow-y-auto max-h-64">
                        {list.length > 0 ? (
                            list.slice(0, 5).map((notif) => (
                                <Dropdown.Link
                                    key={notif.id}
                                    href={route("observations.show", notif.id)}
                                    className="transition-colors border-b border-gray-50 dark:border-gray-700 hover:bg-blue-50 dark:hover:bg-blue-900/20"
                                >
                                    <div className="flex flex-col gap-1 py-1">
                                        <div className="flex items-center justify-between">
                                            <span
                                                className={`font-bold text-xs uppercase ${
                                                    notif.observation_type ===
                                                    "acto_inseguro"
                                                        ? "text-orange-600 dark:text-orange-400"
                                                        : notif.observation_type ===
                                                          "condicion_insegura"
                                                        ? "text-red-600 dark:text-red-400"
                                                        : "text-green-600 dark:text-green-400"
                                                }`}
                                            >
                                                {notif.observation_type?.replace(
                                                    /_/g,
                                                    " "
                                                )}
                                            </span>
                                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                                {timeAgo(notif.created_at)}
                                            </span>
                                        </div>

                                        <span className="text-sm font-medium text-gray-600 truncate dark:text-gray-300">
                                            {notif.description}
                                        </span>

                                        <span className="text-xs text-blue-500 dark:text-blue-400">
                                            {notif.area?.name || "Sin área"}
                                        </span>
                                    </div>
                                </Dropdown.Link>
                            ))
                        ) : (
                            <div className="px-4 py-6 text-sm text-center text-gray-500 dark:text-gray-400">
                                No hay notificaciones recientes
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-600 bg-gray-50 dark:bg-gray-800">
                        {badgeCount > 0 && (
                            <button
                                onClick={clearNotifications}
                                className="block w-full px-4 py-2 text-xs font-bold text-center text-gray-500 uppercase transition-colors border-b border-gray-200 dark:text-gray-400 dark:border-gray-600 hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-300"
                            >
                                Marcar como leídas
                            </button>
                        )}

                        <Link
                            href={route("dashboard")}
                            className="block w-full px-4 py-2 text-xs font-bold text-center text-blue-600 uppercase transition-colors dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30"
                        >
                            Ver Todo el Tablero
                        </Link>
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}
