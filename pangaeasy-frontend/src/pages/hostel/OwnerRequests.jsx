import { useEffect, useState } from "react";
import ownerRequestService from "../../services/ownerRequestService";
import { toast } from "react-toastify";

export default function OwnerRequests()
{
    const [activeStatus, setActiveStatus] = useState("pending");
    const [requests, setRequests] = useState(true);
    const [loading, setLoading] = useState(true);

    const loadRequests = async () => {
        try {
            const response = await ownerRequestService.getAll();
            console.log("OWNER REQUEST RESPONSE:", response.data);
            setRequests(response.data.data.data);
        } catch (error) {
            console.log("Failed to load owner requests:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        loadRequests();
    }, []);

    const filteredRequests = Array.isArray(requests)
        ? requests.filter((request) => request.status === activeStatus)
        : [];

    const handleApprove = async (id) => {
        try {
            await ownerRequestService.approve(id);
            toast.success("Owner request approved successfull.");
            await loadRequests();
        } catch (error) {
            console.log("Approve failed:", error);
            toast.error("Failed to approve owner request");
        }
    }

    const handleReject = async (id) => {
        try {
            await ownerRequestService.reject(id);
            toast.success("Owner request rejected successfull.");
            await loadRequests();
        } catch (error) {
            console.error("Reject failed:", error);
            toast.error("Failed to reject owner request.");
        }
    }

    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold">
                    Requests
                </h1>
                <p className="mt-1 text-gray-100">
                    Review and manage hostel ownership verification requests.
                </p>
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
                <button onClick={() => setActiveStatus("pending")}
                        className={`rounded-lg px-4 py-2 ${activeStatus === "pending" ? "bg-blue-600 text-white" : "bg-white"}`}
                >
                    Pending

                </button>

                <button onClick={() => setActiveStatus("approved")}
                        className={`rounded-lg px-4 py-2 ${activeStatus === "approved" ? "bg-blue-600 text-white" : "bg-white"}`}
                >
                    Approved

                </button>

                <button onClick={() => setActiveStatus("rejected")}
                        className={`rounded-lg px-4 py-2 ${activeStatus === "rejected" ? "bg-blue-600 text-white" : "bg-white"}`}
                >
                    Rejected

                </button>


            </div>

            <div className="overflow-hidden rounded-lg bg-white shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b bg-gray-50">
                            <tr>
                                <th className="px-5 py-4">Name</th>
                                <th className="px-5 py-4">Phone</th>
                                <th className="px-5 py-4">Reason</th>
                                <th className="px-5 py-4">Status</th>
                                <th className="px-5 py-4 text-right">Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-10 text-center text-gray-500">
                                        Loading owner requests.....
                                    </td>
                                </tr>
                            ) : filteredRequests.length === 0 ? (
                                <tr>
                                    <td colSpan="5" className="px-5 py-10 text-center text-gray-500">
                                        No {activeStatus} owner requests found.
                                    </td>
                                </tr>
                            ) : (
                                filteredRequests.map((request) => (
                                    <tr key={request.id} className="border-b">
                                        <td className="px-5 py-4">{request.full_name}</td>
                                        <td className="px-5 py-4">{request.phone}</td>
                                        <td className="px-5 py-4">{request.reason}</td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-gray-100 px-3 py-1 text-sm">{request.status}</span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {request.status === "pending" && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(request.id)}
                                                        className="rounded-lg bg-green-600 px-3 py-2 text-sm text-white hover:bg-green-700"
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        onClick={() => handleReject(request.id)}
                                                        className="rounded-lg bg-red-600 px-3 py-2 text-sm text-white hover:bg-red-700"
                                                    >
                                                        Reject
                                                    </button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}