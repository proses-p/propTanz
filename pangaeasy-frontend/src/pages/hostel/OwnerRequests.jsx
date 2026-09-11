import { useEffect, useState } from "react";
import ownerRequestService from "../../services/ownerRequestService";
import { toast } from "react-toastify";
import { Check, X } from "lucide-react";

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
        <div className="mx-auto max-w-[1500px]">
            <div className="mb-9 border-b border-[#eee6c7] pb-8">
                <p className="mb-3 text-xs font-bold uppercase tracking-[0.22em] text-[#b27a00]">Review queue</p>
                <h1 className="text-3xl font-black tracking-[-0.05em] text-slate-950 sm:text-4xl">
                    Requests
                </h1>
                <p className="mt-3 text-base leading-7 text-slate-600">
                    Review and manage hostel ownership verification requests.
                </p>
            </div>

            <div className="mb-8 flex flex-wrap gap-3">
                <button onClick={() => setActiveStatus("pending")}
                        className={`rounded-xl px-4 py-2.5 text-sm font-bold ${activeStatus === "pending" ? "bg-[#FAF92A] text-slate-950" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
                >
                    Pending

                </button>

                <button onClick={() => setActiveStatus("approved")}
                        className={`rounded-xl px-4 py-2.5 text-sm font-bold ${activeStatus === "approved" ? "bg-[#FAF92A] text-slate-950" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
                >
                    Approved

                </button>

                <button onClick={() => setActiveStatus("rejected")}
                        className={`rounded-xl px-4 py-2.5 text-sm font-bold ${activeStatus === "rejected" ? "bg-[#FAF92A] text-slate-950" : "bg-white text-slate-600 ring-1 ring-slate-200"}`}
                >
                    Rejected

                </button>


            </div>

            <div className="overflow-hidden rounded-2xl bg-white shadow-[0_10px_28px_rgba(67,53,0,0.06)] ring-1 ring-[#eee6c7]">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="border-b border-[#f1eddc] bg-[#fff8cf]">
                            <tr>
                                <th className="px-5 py-4 text-xs uppercase tracking-[0.12em] text-slate-600">Name</th>
                                <th className="px-5 py-4 text-xs uppercase tracking-[0.12em] text-slate-600">Phone</th>
                                <th className="px-5 py-4 text-xs uppercase tracking-[0.12em] text-slate-600">Reason</th>
                                <th className="px-5 py-4 text-xs uppercase tracking-[0.12em] text-slate-600">Status</th>
                                <th className="px-5 py-4 text-right text-xs uppercase tracking-[0.12em] text-slate-600">Actions</th>
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
                                    <tr key={request.id} className="border-b border-[#f1eddc]">
                                        <td className="px-5 py-5 font-semibold text-slate-800">{request.full_name}</td>
                                        <td className="px-5 py-5 text-sm text-slate-600">{request.phone}</td>
                                        <td className="px-5 py-5 text-sm text-slate-600">{request.reason}</td>
                                        <td className="px-5 py-4">
                                            <span className="rounded-full bg-[#fff1bd] px-3 py-1.5 text-xs font-bold uppercase tracking-[0.08em] text-[#8b5c00]">{request.status}</span>
                                        </td>
                                        <td className="px-5 py-4 text-right">
                                            {request.status === "pending" && (
                                                <div className="flex justify-end gap-2">
                                                    <button
                                                        onClick={() => handleApprove(request.id)}
                                                        className="rounded-lg bg-[#FDBF2D] p-2.5 text-slate-950 hover:bg-[#FAF92A]"
                                                        title="Approve request"
                                                        aria-label="Approve request"
                                                    >
                                                        <Check size={17} />
                                                    </button>

                                                    <button
                                                        onClick={() => handleReject(request.id)}
                                                        className="rounded-lg bg-[#fff1c7] p-2.5 text-[#8a5b00] hover:bg-[#ffe7a0]"
                                                        title="Reject request"
                                                        aria-label="Reject request"
                                                    >
                                                        <X size={17} />
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