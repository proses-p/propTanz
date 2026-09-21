export default function HostelModal({ isOpen, onClose, children, title }) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="w-full max-w-2xl rounded-xl bg-white shadow-xl">
                <div className="flex items-center justify-between border-b p-5">
                    <h2 className="text-xl font-semibold">{title}</h2>
                    <button onClick={onClose} className="text-2xl text-gray-500 hover:text-red-500">x</button>
                </div>

                <div className="p-6">{children}</div>
            </div>
        </div>
    );
}