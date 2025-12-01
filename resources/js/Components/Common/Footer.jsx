export default function Footer({ className = "" }) {
    const currentYear = new Date().getFullYear();

    return (
        <div
            className={`text-xs text-center text-gray-500 dark:text-gray-400 ${className}`}
        >
            <p>
                &copy; {currentYear} Wasion México. Todos los derechos
                reservados.
            </p>
        </div>
    );
}
