export default function EmptyState({ message, submessage }) {
    return (
        <div className="overflow-hidden bg-white shadow-sm sm:rounded-lg">
            <div className="p-6 text-center text-gray-600">
                <p className="text-lg">{message}</p>
                <p className="mt-2 text-sm">{submessage}</p>
            </div>
        </div>
    );
}
