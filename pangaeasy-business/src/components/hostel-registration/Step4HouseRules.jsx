import { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    Clock3,
    FileText,
    Plus,
    Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

export default function Step4HouseRules({
    data,
    setData,
    onNext,
    onBack,
}) {
    const [newRule, setNewRule] = useState("");

    const updateField = (field, value) => {
        setData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const updateAgreement = (field, value) => {
        setData((prev) => ({
            ...prev,
            agreements: {
                ...prev.agreements,
                [field]: value,
            },
        }));
    };

    const addRule = () => {
        const rule = newRule.trim();

        if (!rule) return;

        setData((prev) => ({
            ...prev,
            rules: [...prev.rules, rule],
        }));

        setNewRule("");
    };

    const removeRule = (index) => {
        setData((prev) => ({
            ...prev,
            rules: prev.rules.filter((_, i) => i !== index),
        }));
    };

    const handleAddRuleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addRule();
        }
    };

    const validate = () => {
        const agreements = data.agreements;

        if (!agreements.checkInOut) {
            toast.error(
                "Please confirm the check-in and check-out information."
            );
            return false;
        }

        if (
            data.quietHoursEnabled &&
            !agreements.quietHours
        ) {
            toast.error(
                "Please confirm the quiet hours agreement."
            );
            return false;
        }

        if (!agreements.houseRules) {
            toast.error(
                "Please confirm the house rules agreement."
            );
            return false;
        }

        if (!agreements.cancellation) {
            toast.error(
                "Please confirm the cancellation policy."
            );
            return false;
        }

        if (!data.cancellationPolicy.trim()) {
            toast.error(
                "Please provide a cancellation policy."
            );
            return false;
        }

        if (data.rules.length === 0) {
            toast.error(
                "Please add at least one house rule."
            );
            return false;
        }

        return true;
    };

    const handleContinue = () => {
        if (!validate()) return;

        onNext();
    };

    return (
        <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-8">
                <p className="text-sm font-semibold text-[#d89d00]">
                    Step 4 of 5
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    House Rules & Terms
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Define the rules, check-in information and terms
                    that will apply to guests staying at your hostel.
                </p>
            </div>

            <div className="space-y-6">
                {/* Check In / Check Out */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-7 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF92A]/30">
                            <Clock3 size={21} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Check-in & Check-out
                            </h2>

                            <p className="text-sm text-slate-500">
                                Set the standard arrival and departure
                                times.
                            </p>
                        </div>
                    </div>

                    <div className="grid gap-5 sm:grid-cols-2">
                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Check-in Time
                            </label>

                            <input
                                type="time"
                                value={data.checkIn}
                                onChange={(e) =>
                                    updateField(
                                        "checkIn",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#FDBF2D] focus:ring-2 focus:ring-[#FDBF2D]/20"
                            />
                        </div>

                        <div>
                            <label className="mb-2 block text-sm font-medium text-slate-700">
                                Check-out Time
                            </label>

                            <input
                                type="time"
                                value={data.checkOut}
                                onChange={(e) =>
                                    updateField(
                                        "checkOut",
                                        e.target.value
                                    )
                                }
                                className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#FDBF2D] focus:ring-2 focus:ring-[#FDBF2D]/20"
                            />
                        </div>
                    </div>
                </section>

                {/* Quiet Hours */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-start justify-between gap-4">
                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Quiet Hours
                            </h2>

                            <p className="mt-1 text-sm text-slate-500">
                                Set the hours when guests should keep
                                noise to a minimum.
                            </p>
                        </div>

                        <button
                            type="button"
                            onClick={() =>
                                updateField(
                                    "quietHoursEnabled",
                                    !data.quietHoursEnabled
                                )
                            }
                            className={`
                                relative h-6 w-11 shrink-0 rounded-full
                                transition
                                ${
                                    data.quietHoursEnabled
                                        ? "bg-[#FDBF2D]"
                                        : "bg-slate-300"
                                }
                            `}
                        >
                            <span
                                className={`
                                    absolute top-1 h-4 w-4 rounded-full
                                    bg-white shadow-sm transition
                                    ${
                                        data.quietHoursEnabled
                                            ? "left-6"
                                            : "left-1"
                                    }
                                `}
                            />
                        </button>
                    </div>

                    {data.quietHoursEnabled && (
                        <div className="mt-6 grid gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Quiet Hours Start
                                </label>

                                <input
                                    type="time"
                                    value={data.quietStart}
                                    onChange={(e) =>
                                        updateField(
                                            "quietStart",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#FDBF2D] focus:ring-2 focus:ring-[#FDBF2D]/20"
                                />
                            </div>

                            <div>
                                <label className="mb-2 block text-sm font-medium text-slate-700">
                                    Quiet Hours End
                                </label>

                                <input
                                    type="time"
                                    value={data.quietEnd}
                                    onChange={(e) =>
                                        updateField(
                                            "quietEnd",
                                            e.target.value
                                        )
                                    }
                                    className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#FDBF2D] focus:ring-2 focus:ring-[#FDBF2D]/20"
                                />
                            </div>
                        </div>
                    )}
                </section>

                {/* House Rules */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="mb-6 flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF92A]/30">
                            <FileText size={21} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                House Rules
                            </h2>

                            <p className="text-sm text-slate-500">
                                Add rules guests are expected to follow.
                            </p>
                        </div>
                    </div>

                    {/* Existing Rules */}
                    <div className="space-y-3">
                        {data.rules.map((rule, index) => (
                            <div
                                key={`${rule}-${index}`}
                                className="flex items-center justify-between gap-4 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3"
                            >
                                <div className="flex items-start gap-3">
                                    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#FDBF2D] text-xs font-bold">
                                        {index + 1}
                                    </span>

                                    <p className="text-sm text-slate-700">
                                        {rule}
                                    </p>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeRule(index)
                                    }
                                    className="shrink-0 rounded-lg p-2 text-red-500 hover:bg-red-50"
                                >
                                    <Trash2 size={16} />
                                </button>
                            </div>
                        ))}
                    </div>

                    {/* Add Rule */}
                    <div className="mt-5 flex flex-col gap-3 sm:flex-row">
                        <input
                            type="text"
                            value={newRule}
                            onChange={(e) =>
                                setNewRule(e.target.value)
                            }
                            onKeyDown={handleAddRuleKeyDown}
                            placeholder="Enter a new house rule..."
                            className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#FDBF2D] focus:ring-2 focus:ring-[#FDBF2D]/20"
                        />

                        <button
                            type="button"
                            onClick={addRule}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                        >
                            <Plus size={18} />
                            Add Rule
                        </button>
                    </div>
                </section>

                {/* Cancellation Policy */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Cancellation Policy
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Explain what happens when a guest cancels
                        their booking.
                    </p>

                    <textarea
                        rows={5}
                        value={data.cancellationPolicy}
                        onChange={(e) =>
                            updateField(
                                "cancellationPolicy",
                                e.target.value
                            )
                        }
                        placeholder="Example: Guests can cancel up to 7 days before arrival..."
                        className="mt-5 w-full resize-none rounded-xl border border-slate-200 bg-white px-4 py-3.5 text-sm outline-none focus:border-[#FDBF2D] focus:ring-2 focus:ring-[#FDBF2D]/20"
                    />
                </section>

                {/* Agreements */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <h2 className="text-lg font-semibold text-slate-900">
                        Terms & Agreements
                    </h2>

                    <p className="mt-1 text-sm text-slate-500">
                        Confirm that the information provided above
                        represents your hostel's actual policies.
                    </p>

                    <div className="mt-6 space-y-4">
                        <label className="flex cursor-pointer gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    data.agreements.checkInOut
                                }
                                onChange={(e) =>
                                    updateAgreement(
                                        "checkInOut",
                                        e.target.checked
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-[#FDBF2D]"
                            />

                            <span className="text-sm leading-6 text-slate-600">
                                I confirm that the check-in and
                                check-out times provided are accurate.
                            </span>
                        </label>

                        {data.quietHoursEnabled && (
                            <label className="flex cursor-pointer gap-3">
                                <input
                                    type="checkbox"
                                    checked={
                                        data.agreements.quietHours
                                    }
                                    onChange={(e) =>
                                        updateAgreement(
                                            "quietHours",
                                            e.target.checked
                                        )
                                    }
                                    className="mt-1 h-4 w-4 accent-[#FDBF2D]"
                                />

                                <span className="text-sm leading-6 text-slate-600">
                                    I confirm that guests will be
                                    informed about the stated quiet
                                    hours.
                                </span>
                            </label>
                        )}

                        <label className="flex cursor-pointer gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    data.agreements.houseRules
                                }
                                onChange={(e) =>
                                    updateAgreement(
                                        "houseRules",
                                        e.target.checked
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-[#FDBF2D]"
                            />

                            <span className="text-sm leading-6 text-slate-600">
                                I confirm that the house rules listed
                                above apply to guests staying at this
                                hostel.
                            </span>
                        </label>

                        <label className="flex cursor-pointer gap-3">
                            <input
                                type="checkbox"
                                checked={
                                    data.agreements.cancellation
                                }
                                onChange={(e) =>
                                    updateAgreement(
                                        "cancellation",
                                        e.target.checked
                                    )
                                }
                                className="mt-1 h-4 w-4 accent-[#FDBF2D]"
                            />

                            <span className="text-sm leading-6 text-slate-600">
                                I confirm that the cancellation policy
                                provided above is accurate.
                            </span>
                        </label>
                    </div>
                </section>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <button
                    type="button"
                    onClick={handleContinue}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FDBF2D] px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-[#f2b51f] active:scale-[0.98]"
                >
                    Continue
                    <ArrowRight size={18} />
                </button>
            </div>
        </div>
    );
}