export default function ConfirmModal({
    isOpen,
    title,
    message,
    confirmText = "Confirm",
    cancelText = "Cancel",
    onConfirm,
    onCancel,
}) {
    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60
        backdrop-blur-sm">
            <div className="w-full max-w-md rounded-2xl bg-white shadow-2xl p-6">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
                        <span className="text-3xl">Delete</span>
                        
                    </div>

                    <h2 className="text-xl font-bold text-gray-800">
                        {title}
                    </h2>

                    <p className="mt-3 text-gray-800">
                        {message}
                    </p>
                </div>

                <div className="flex justify-end gap-3 border-t p-5">
                    <button type="button" onClick={onCancel}
                        className="rounded-lg border px-4 py-2" 
                    >
                        {cancelText}
                    </button>

                    <button type="button" onClick={onConfirm}
                        className="rounded-lg bg-red-600 px-4 py-2 text-white hover:bg-red-700"
                    >
                        {confirmText}
                    </button>
                </div>

            </div>

            
        </div>
    );
}