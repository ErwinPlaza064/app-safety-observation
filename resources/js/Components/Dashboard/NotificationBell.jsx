import { useState, useEffect, useRef } from "react";
import { Link, router } from "@inertiajs/react";
import Dropdown from "@/Components/Dropdown";
import { BiBell } from "react-icons/bi";

export default function NotificationBell({ user, count = 0, list = [] }) {
    const [badgeCount, setBadgeCount] = useState(0);
    const [viewedNotifications, setViewedNotifications] = useState(new Set());
    const [newNotifications, setNewNotifications] = useState(new Set());
    const [dismissedKeys, setDismissedKeys] = useState(() => {
        const saved = localStorage.getItem(`dismissed_keys_${user.id}`);
        return saved ? new Set(JSON.parse(saved)) : new Set();
    });
    
    const prevCountRef = useRef(count);
    const isFirstRender = useRef(true);

    // Clave compuesta: id-status para permitir que la campana suene si el estado cambia (ej. de en_progreso a cerrada)
    const filteredList = list.filter(n => !dismissedKeys.has(`${n.id}-${n.status}`));

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            const initialCount = list.filter(n => !dismissedKeys.has(`${n.id}-${n.status}`)).length;
            if (initialCount > 0) {
                setBadgeCount(initialCount);
            }
            prevCountRef.current = count;
            return;
        }

        const diff = count - prevCountRef.current;

        if (diff > 0) {
            setBadgeCount((prev) => prev + diff);

            const recentKeys = list.slice(0, diff).map((n) => `${n.id}-${n.status}`);
            setNewNotifications((prev) => {
                const updated = new Set(prev);
                recentKeys.forEach((key) => updated.add(key));
                return updated;
            });

            const audio = new Audio("/sounds/notification.mp3");
            audio.play().catch((e) => console.log("Audio bloqueado", e));

            if (navigator.vibrate) navigator.vibrate(200);
        }

        prevCountRef.current = count;
    }, [count, list, dismissedKeys]);

    const handleDropdownOpen = () => {
        const newViewedSet = new Set(viewedNotifications);
        filteredList.forEach((notif) => newViewedSet.add(`${notif.id}-${notif.status}`));
        setViewedNotifications(newViewedSet);

        setNewNotifications(new Set());
        setBadgeCount(0);
    };

    const handleNotificationClick = (notif, href) => {
        const key = `${notif.id}-${notif.status}`;
        const updatedDismissed = new Set(dismissedKeys);
        updatedDismissed.add(key);
        setDismissedKeys(updatedDismissed);
        localStorage.setItem(`dismissed_keys_${user.id}`, JSON.stringify(Array.from(updatedDismissed)));
        
        router.get(href);
    };

    const clearNotifications = () => {
        const updatedDismissed = new Set(dismissedKeys);
        list.forEach(n => updatedDismissed.add(`${n.id}-${n.status}`));
        setDismissedKeys(updatedDismissed);
        localStorage.setItem(`dismissed_keys_${user.id}`, JSON.stringify(Array.from(updatedDismissed)));
        setBadgeCount(0);
    };

    const timeAgo = (dateString, status) => {
        const date = new Date(dateString);
        return date.toLocaleDateString("es-MX", {
            hour: "2-digit",
            minute: "2-digit",
        });
    };

    const renderNotificationItem = (notif) => {
        const key = `${notif.id}-${notif.status}`;
        const isNew = newNotifications.has(key);
        const isClosed = notif.status === 'cerrada';
        const href = route("observations.show", notif.id);

        return (
            <button
                key={key}
                onClick={() => handleNotificationClick(notif, href)}
                className={`w-full text-left px-4 py-3 relative transition-all border-b border-gray-50 dark:border-gray-700 block ${
                    isNew
                        ? "bg-blue-50 dark:bg-blue-900/30 border-l-4 border-l-blue-500 dark:border-l-blue-400 shadow-sm hover:bg-blue-100 dark:hover:bg-blue-900/40"
                        : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                }`}
            >
                <div className="flex flex-col gap-1">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                            {isNew && (
                                <span className="w-2 h-2 bg-blue-500 rounded-full animate-pulse"></span>
                            )}
                            <span
                                className={`font-bold text-[10px] uppercase tracking-wider ${
                                    isClosed 
                                    ? "text-green-600 dark:text-green-400" 
                                    : notif.observation_type === "acto_inseguro"
                                        ? "text-orange-600 dark:text-orange-400"
                                        : "text-red-600 dark:text-red-400"
                                }`}
                            >
                                {isClosed ? "Reporte Cerrado" : notif.observation_type?.replace(/_/g, " ")}
                            </span>
                        </div>
                        <div className="flex items-center gap-1">
                            {isNew && (
                                <span className={`px-1.5 py-0.5 text-[9px] font-bold text-white rounded-full uppercase ${isClosed ? 'bg-green-500' : 'bg-blue-500'}`}>
                                    {isClosed ? 'Listo' : 'Nueva'}
                                </span>
                            )}
                            <span className="text-[10px] text-gray-400 dark:text-gray-500">
                                {timeAgo(isClosed ? notif.closed_at : notif.created_at)}
                            </span>
                        </div>
                    </div>

                    <span
                        className={`text-[11px] leading-tight ${
                            isNew
                                ? "text-gray-900 dark:text-white font-semibold"
                                : "text-gray-600 dark:text-gray-300"
                        }`}
                    >
                        {isClosed ? (
                            <span>
                                <span className="font-bold text-blue-500 dark:text-blue-400">Resolución:</span> {notif.closure_notes}
                            </span>
                        ) : (
                            <div className="flex flex-col gap-0.5 mt-0.5">
                                <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-gray-400 dark:text-gray-500 uppercase text-[9px]">Observador:</span>
                                    <span className="truncate">{notif.user?.name || "N/A"}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                    <span className="font-bold text-gray-400 dark:text-gray-500 uppercase text-[9px]">Sujeto:</span>
                                    <span className="truncate">{notif.observed_person || "N/A"}</span>
                                </div>
                                <p className="mt-1 text-sm line-clamp-1 italic text-gray-500 dark:text-gray-400">"{notif.description}"</p>
                            </div>
                        )}
                    </span>

                    <div className="flex items-center justify-between mt-1">
                        <span className="text-[11px] font-medium text-blue-500 dark:text-blue-400">
                            {notif.area?.name || "Sin área"}
                        </span>
                        <span className="text-[10px] text-gray-400 dark:text-gray-500 italic">
                            #{notif.folio}
                        </span>
                    </div>
                </div>
            </button>
        );
    };

    return (
        <div className="relative">
            <Dropdown onOpen={handleDropdownOpen}>
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
                    <div className="px-4 py-3 text-xs font-bold text-gray-500 uppercase border-b border-gray-200 dark:text-gray-400 bg-gray-50 dark:bg-gray-800 dark:border-gray-700">
                        Notificaciones Recientes
                    </div>

                    <div className="overflow-y-auto max-h-80">
                        {filteredList.length > 0 ? (
                            filteredList
                                .slice(0, 10)
                                .map((notif) => renderNotificationItem(notif))
                        ) : (
                            <div className="px-6 py-10 text-sm text-center text-gray-500 dark:text-gray-400">
                                <div className="flex flex-col items-center gap-2">
                                    <svg className="w-8 h-8 text-gray-300 dark:text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
                                    </svg>
                                    <span>No hay notificaciones pendientes</span>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="border-t border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 p-2">
                        {filteredList.length > 0 && (
                            <button
                                onClick={clearNotifications}
                                className="block w-full px-4 py-2 text-xs font-bold text-center text-gray-500 uppercase transition-colors rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 hover:text-gray-700 dark:hover:text-gray-200"
                            >
                                Marcar todas como leídas
                            </button>
                        )}
                    </div>
                </Dropdown.Content>
            </Dropdown>
        </div>
    );
}
