export default function Checkbox({ className = "", ...props }) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                "rounded border-gray-300 dark:border-gray-600 dark:bg-gray-700 text-blue-700 dark:text-blue-500 shadow-sm focus:ring-blue-700 dark:focus:ring-blue-500 dark:focus:ring-offset-gray-800 " +
                className
            }
        />
    );
}
