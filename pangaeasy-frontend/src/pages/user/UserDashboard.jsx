import { useEffect, useState } from "react";
import { FiArrowRight, FiHome, FiPlus, FiSearch, FiX } from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import ownerRequestService from "../../services/ownerRequestService";

export default function UserDashboard() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (!isModalOpen) return undefined;

        const closeOnEscape = (event) => {
            if (event.key === "Escape") setIsModalOpen(false);
        };

        document.addEventListener("keydown", closeOnEscape);
        return () => document.removeEventListener("keydown", closeOnEscape);
    }, [isModalOpen]);

    const handleRegisterHostel = async () => {
        console.log("HANDLE REGISTER STARTED");
        try {
            console.log("BEFORE API CALL");
            const response = await ownerRequestService.getStatus();
            console.log("AFTER API CALL");
            console.log("API RESPONSE:", response.data);
            const ownerRequest = response.data?.data;
            console.log("OWNER REQUEST:", ownerRequest);
            console.log("STATUS:", ownerRequest?.status);
            if (ownerRequest?.status === "approved") {
                navigate("/hostel-registration");
                return;
            }
            navigate("/owner-verification");
        } catch (error) {
            console.error(error);
            navigate("/owner-verification");
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 text-slate-900">
            <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:py-12">
                <header className="mb-10 max-w-2xl">
                    <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-600">
                        User dashboard
                    </p>
                    <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
                        What would you like to do today?
                    </h1>
                    <p className="mt-3 text-base leading-7 text-slate-500">
                        Choose a property option to get started with your next step.
                    </p>
                </header>

                <div className="grid gap-5 md:grid-cols-2">
                    <button
                        type="button"
                        onClick={() => setIsModalOpen(true)}
                        className="group flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-blue-100 sm:p-7"
                    >
                        <span className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-blue-50 text-blue-600">
                            <FiHome size={28} aria-hidden="true" />
                        </span>
                        <span className="flex items-center justify-between gap-4">
                            <span>
                                <span className="block text-xl font-bold">Hostels</span>
                                <span className="mt-2 block text-sm leading-6 text-slate-500">
                                    List a property or find your next place to stay.
                                </span>
                            </span>
                            <FiArrowRight className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-blue-600" size={22} aria-hidden="true" />
                        </span>
                    </button>

                    <button
                        type="button"
                        onClick={() => navigate("/apartments")}
                        className="group flex w-full flex-col rounded-2xl border border-slate-200 bg-white p-6 text-left shadow-sm transition duration-200 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-100 sm:p-7"
                    >
                        <span className="mb-8 flex h-14 w-14 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600">
                            <FiHome size={28} aria-hidden="true" />
                        </span>
                        <span className="flex items-center justify-between gap-4">
                            <span>
                                <span className="block text-xl font-bold">Apartments</span>
                                <span className="mt-2 block text-sm leading-6 text-slate-500">
                                    Manage your apartment listings and details.
                                </span>
                            </span>
                            <FiArrowRight className="shrink-0 text-slate-400 transition group-hover:translate-x-1 group-hover:text-emerald-600" size={22} aria-hidden="true" />
                        </span>
                    </button>
                </div>
            </div>

            {isModalOpen && (
                <div
                    className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-5 backdrop-blur-sm"
                    role="presentation"
                    onMouseDown={(event) => {
                        if (event.target === event.currentTarget) setIsModalOpen(false);
                    }}
                >
                    <div
                        className="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl sm:p-8"
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="hostel-choice-title"
                    >
                        <div className="mb-7 flex items-start justify-between gap-4">
                            <div>
                                <p className="mb-2 text-sm font-semibold text-blue-600">Hostels</p>
                                <h2 id="hostel-choice-title" className="text-2xl font-bold tracking-tight">
                                    How can we help?
                                </h2>
                                <p className="mt-2 text-sm leading-6 text-slate-500">
                                    Select an option to continue.
                                </p>
                            </div>
                            <button
                                type="button"
                                onClick={() => setIsModalOpen(false)}
                                className="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                aria-label="Close hostel options"
                            >
                                <FiX size={21} aria-hidden="true" />
                            </button>
                        </div>

                        <div className="space-y-3">
                            <button
                                type="button"
                                onClick={() => {
                                    console.log("REGISTER HOSTEL BUTTON CLIKED");
                                    handleRegisterHostel();
                                }}
                                //onClick={() => setIsModalOpen(false)}
                                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-blue-300 hover:bg-blue-50 focus:outline-none focus:ring-4 focus:ring-blue-100"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-blue-100 text-blue-700">
                                    <FiPlus size={21} aria-hidden="true" />
                                </span>
                                <span>
                                    <span className="block font-semibold text-slate-900">I want to register/list my hostel</span>
                                    <span className="mt-1 block text-sm text-slate-500">Hostel registration will be available soon.</span>
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => navigate("/hostels/tenant")}
                                //onClick={() => setIsModalOpen(false)}
                                className="flex w-full items-center gap-4 rounded-xl border border-slate-200 p-4 text-left transition hover:border-emerald-300 hover:bg-emerald-50 focus:outline-none focus:ring-4 focus:ring-emerald-100"
                            >
                                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-emerald-100 text-emerald-700">
                                    <FiSearch size={21} aria-hidden="true" />
                                </span>
                                <span>
                                    <span className="block font-semibold text-slate-900">I am looking for a hostel (Tenant)</span>
                                    <span className="mt-1 block text-sm text-slate-500">Hostel search will be available soon.</span>
                                </span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
