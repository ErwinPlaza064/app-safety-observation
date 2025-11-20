export default function PrimaryButton({
    className = "",
    disabled,
    children,
    ...props
}) {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center justify-center rounded-md border border-transparent bg-wasion px-4 py-3 text-sm font-semibold text-white transition duration-150 ease-in-out hover:bg-wasion-800 focus:bg-wasion-800 focus:outline-none focus:ring-2 focus:ring-wasion-500 focus:ring-offset-2 active:bg-wasion-900 ${
                    disabled && "opacity-25"
                } ` + className
            }
            disabled={disabled}
        >
            {children}
        </button>
    );
}
