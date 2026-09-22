import { ArrowRight, Mail, Phone, User } from "lucide-react";
import { useState } from "react";
import { toast } from "react-toastify";

export default function Step1PersionalInformation({
    data,
    setData,
    onNext,
}) {
    const [errors, setErrors] = useState({});

    const handleChange = (e) => {
        const { name, value } = e.target;

        setData((prev) => ({
            ...prev,
            [name]: value,
        }));

        setErrors((prev) => ({
            ...prev,
            [name]: "",
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (!data.full_name.trim()) {
            newErrors.full_name = "Full name is required";
        }

        if (!data.email.trim()) {
            newErrors.email = "Email address is required";
        } else if (
            !/^[0-9+\s()-]{9,15}$/.test(data.phone)
        ) {
            newErrors.phone = "Please enter a valid phone number.";
        }

        setErrors(newErrors);

        return Object.keys(newErrors).length === 0;
    };


    const handleContinue = () => {
        if (!validate()) {
            toast.errors("Please complete your personal information");
            return;
        }

        onNext();
    };


    return (
        <div className="mx-auto max-w-4xl">
            <div className="mb-8">
                <p className="text-sm font-semibold text=[#d89d00]">
                    Step 1 of 5
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">Persioanl Information</h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Tell us about your self this information will be associated with your hostel registration.
                </p>
            </div>


            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                <div className="mb-7">
                    <h2 className="text-lg font-semibold text-slate-900">Your details</h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Please provide accurate information
                    </p>
                </div>


                <div className="space-y-6">
                    <div>
                        <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-slate-700">Full Name</label>

                        <div className="relative">
                            <User
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="full_name"
                                name="full_name"
                                type="text"
                                value={data.full_name}
                                onChange={handleChange}
                                placeholder="Enter your full name"
                                className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 transition placeholder:text-slate-400
                                focus:ring-2 ${errors.full_name ? "border-red-400 focus:border-red-400 focus:ring-red-100" :
                                 "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"}`}
                            />
                        </div>

                        {errors.full_name && (
                            <p className="mt-2 text-xs text-red-500">{errors.full_name}</p>
                        )}
                    </div>


                    <div>
                        <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-slate-700">Email Address</label>

                        <div className="relative">
                            <Mail
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="email"
                                name="email"
                                type="email"
                                value={data.email}
                                onChange={handleChange}
                                placeholder="example@gmail.com"
                                className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 outline-none transition placeholder:text-slate-400
                                focus:ring-2 ${errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-100" :
                                 "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"}`}
                            />
                        </div>

                        {errors.email && (
                            <p className="mt-2 text-xs text-red-500">{errors.email}</p>
                        )}
                    </div>




                    <div>
                        <label htmlFor="full_name" className="mb-2 block text-sm font-medium text-slate-700">Phone</label>

                        <div className="relative">
                            <Phone
                                size={19}
                                className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400"
                            />

                            <input
                                id="phone"
                                name="phone"
                                type="tel"
                                value={data.phone}
                                onChange={handleChange}
                                placeholder="eg 0712334556"
                                className={`w-full rounded-xl border bg-white py-3.5 pl-11 pr-4 text-sm text-slate-900 transition placeholder:text-slate-400
                                focus:ring-2 ${errors.phone ? "border-red-400 focus:border-red-400 focus:ring-red-100" :
                                 "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"}`}
                            />
                        </div>

                        {errors.phone && (
                            <p className="mt-2 text-xs text-red-500">{errors.phone}</p>
                        )}
                    </div>


                </div>




                <div className="mt-8 flex justify-end border-t border-slate-100 pt-6">
                    <button
                        type="button"
                        onClick={handleContinue}
                        className="inline-flex items-center gap-2 rounded-xl bg-[#FDBF2D] px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-[#f2b51f]
                        active:scale-[0.98]"
                    >
                        Continue
                        <ArrowRight size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}