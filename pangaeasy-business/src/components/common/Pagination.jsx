export default function Pagination ({
    currentPage,
    lastPage,
    onPageChange,
}) {
    if (!lastPage || lastPage <= 1) {
        return null;
    }

    return (
        <div className="mt-6 flex items-center justify-between">
            <button 
                disabled={currentPage === 1}
                onClick={() => onPageChange(currentPage - 1)}
                className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-50"
            >
                Previous
            </button>

            <span className="text-sm font-medium">
                Page {currentPage} of {lastPage}
            </span>

            <button 
                disabled={currentPage === lastPage}
                onClick={() => onPageChange(currentPage + 1)}
                className="rounded-lg border px-4 py-2 disabled:cursor-not-allowed disabled:opacity-0"
            >
                Next
            </button>
        </div>
    );
}