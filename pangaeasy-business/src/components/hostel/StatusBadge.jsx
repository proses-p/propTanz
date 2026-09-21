export default function StatusBadge({ status }) {
    const styles = {
        Pending: "bg-yellow-100 text-yellow-800",
        Approved: "bg-green-100 text-green-800",
        Rejected: "bg-red-100 text-red-800",
    };

    return (
        <span 
            className={`inline-flex rounded-full px-3 py-3 text-sm font-medium ${styles[status] || "bg-gray-100 text-gray-700"}`}
        >{status}</span>
    );
}