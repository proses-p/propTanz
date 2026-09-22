import { useRef } from "react";
import {
    ArrowLeft,
    CheckCircle2,
    FileSignature,
    RotateCcw,
    Send,
} from "lucide-react";
import SignatureCanvas from "react-signature-canvas";

export default function Step5PreviewSignature({
    personalInfo,
    basicInfo,
    rooms,
    houseRules,
    images,
    signature,
    setSignature,
    onBack,
    onSubmit,
    submitting,
}) {
    const signatureRef = useRef(null);

    const saveSignature = () => {
        if (!signatureRef.current || signatureRef.current.isEmpty()) {
            setSignature(null);
            return;
        }

        const signatureData =
            signatureRef.current.toDataURL("image/png");

        setSignature(signatureData);
    };

    const clearSignature = () => {
        signatureRef.current?.clear();
        setSignature(null);
    };

    const handleSignatureEnd = () => {
        saveSignature();
    };

    const totalBeds = rooms.reduce((total, room) => {
        return (
            total +
            Number(room.number_of_rooms || 0) *
                Number(room.beds_per_room || 0)
        );
    }, 0);

    return (
        <div className="mx-auto max-w-6xl">
            {/* Header */}
            <div className="mb-8">
                <p className="text-sm font-semibold text-[#d89d00]">
                    Step 5 of 5
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Preview & Signature
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Review all the information before submitting your
                    hostel registration.
                </p>
            </div>

            <div className="space-y-6">
                {/* Personal Information */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <SectionHeader
                        title="Personal Information"
                        subtitle="Owner information"
                    />

                    <div className="mt-6 grid gap-5 sm:grid-cols-3">
                        <PreviewItem
                            label="Full Name"
                            value={personalInfo.full_name}
                        />

                        <PreviewItem
                            label="Email"
                            value={personalInfo.email}
                        />

                        <PreviewItem
                            label="Phone"
                            value={personalInfo.phone}
                        />
                    </div>
                </section>

                {/* Basic Information */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <SectionHeader
                        title="Basic Information"
                        subtitle="Hostel details"
                    />

                    <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
                        <PreviewItem
                            label="Hostel Name"
                            value={basicInfo.hostel_name}
                        />

                        <PreviewItem
                            label="Hostel Type"
                            value={basicInfo.hostel_type}
                        />

                        <PreviewItem
                            label="Region"
                            value={basicInfo.region}
                        />

                        <PreviewItem
                            label="District"
                            value={basicInfo.district}
                        />

                        <PreviewItem
                            label="Ward"
                            value={basicInfo.ward}
                        />

                        <PreviewItem
                            label="Street"
                            value={basicInfo.street}
                        />

                        <PreviewItem
                            label="Landmark"
                            value={basicInfo.landmark || "Not provided"}
                        />
                    </div>

                    <div className="mt-5">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Description
                        </p>

                        <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                            {basicInfo.description}
                        </p>
                    </div>
                </section>

                {/* Rooms */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <SectionHeader
                        title="Rooms & Beds"
                        subtitle={`${rooms.length} room type${
                            rooms.length !== 1 ? "s" : ""
                        } · ${totalBeds} total beds`}
                    />

                    <div className="mt-6 overflow-x-auto">
                        <table className="w-full min-w-[650px] text-left">
                            <thead>
                                <tr className="border-b border-slate-200">
                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Room Type
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Rooms
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Beds / Room
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Total Beds
                                    </th>

                                    <th className="px-4 py-3 text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Price / Bed
                                    </th>
                                </tr>
                            </thead>

                            <tbody>
                                {rooms.map((room) => (
                                    <tr
                                        key={room.id}
                                        className="border-b border-slate-100 last:border-0"
                                    >
                                        <td className="px-4 py-4 text-sm font-medium text-slate-800">
                                            {room.room_type}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {room.number_of_rooms}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            {room.beds_per_room}
                                        </td>

                                        <td className="px-4 py-4 text-sm font-semibold text-slate-800">
                                            {Number(
                                                room.number_of_rooms
                                            ) *
                                                Number(
                                                    room.beds_per_room
                                                )}
                                        </td>

                                        <td className="px-4 py-4 text-sm text-slate-600">
                                            TZS{" "}
                                            {Number(
                                                room.price_per_bed || 0
                                            ).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </section>

                {/* House Rules */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <SectionHeader
                        title="House Rules & Terms"
                        subtitle="Hostel policies"
                    />

                    <div className="mt-6 grid gap-5 sm:grid-cols-2">
                        <PreviewItem
                            label="Check-in"
                            value={houseRules.checkIn}
                        />

                        <PreviewItem
                            label="Check-out"
                            value={houseRules.checkOut}
                        />

                        {houseRules.quietHoursEnabled && (
                            <>
                                <PreviewItem
                                    label="Quiet Hours Start"
                                    value={houseRules.quietStart}
                                />

                                <PreviewItem
                                    label="Quiet Hours End"
                                    value={houseRules.quietEnd}
                                />
                            </>
                        )}
                    </div>

                    <div className="mt-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            House Rules
                        </p>

                        <div className="mt-3 space-y-2">
                            {houseRules.rules.map(
                                (rule, index) => (
                                    <div
                                        key={`${rule}-${index}`}
                                        className="flex items-start gap-3 rounded-xl bg-slate-50 px-4 py-3"
                                    >
                                        <CheckCircle2
                                            size={18}
                                            className="mt-0.5 shrink-0 text-[#d89d00]"
                                        />

                                        <p className="text-sm text-slate-600">
                                            {rule}
                                        </p>
                                    </div>
                                )
                            )}
                        </div>
                    </div>

                    <div className="mt-6">
                        <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                            Cancellation Policy
                        </p>

                        <p className="mt-2 rounded-xl bg-slate-50 p-4 text-sm leading-6 text-slate-600">
                            {houseRules.cancellationPolicy}
                        </p>
                    </div>
                </section>

                {/* Images */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <SectionHeader
                        title="Hostel Images"
                        subtitle={`${images.length} image${
                            images.length !== 1 ? "s" : ""
                        } uploaded`}
                    />

                    <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                        {images.map((image, index) => (
                            <div
                                key={`${image.name}-${index}`}
                                className="overflow-hidden rounded-xl border border-slate-200"
                            >
                                <img
                                    src={URL.createObjectURL(image)}
                                    alt={`Hostel ${index + 1}`}
                                    className="h-36 w-full object-cover"
                                />
                            </div>
                        ))}
                    </div>
                </section>

                {/* Digital Signature */}
                <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF92A]/30">
                            <FileSignature size={21} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Digital Signature
                            </h2>

                            <p className="text-sm text-slate-500">
                                Sign below to confirm that the information
                                provided is accurate.
                            </p>
                        </div>
                    </div>

                    <div className="mt-6 overflow-hidden rounded-2xl border border-slate-200 bg-white">
                        <SignatureCanvas
                            ref={signatureRef}
                            penColor="#111827"
                            canvasProps={{
                                className:
                                    "w-full h-56 touch-none",
                            }}
                            onEnd={handleSignatureEnd}
                        />
                    </div>

                    <div className="mt-4 flex items-center justify-between">
                        <p className="text-xs text-slate-400">
                            Sign using your mouse, trackpad or touchscreen.
                        </p>

                        <button
                            type="button"
                            onClick={clearSignature}
                            className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100"
                        >
                            <RotateCcw size={15} />
                            Clear
                        </button>
                    </div>

                    {signature && (
                        <div className="mt-4 flex items-center gap-2 rounded-xl bg-green-50 px-4 py-3 text-sm font-medium text-green-700">
                            <CheckCircle2 size={18} />
                            Signature captured successfully.
                        </div>
                    )}
                </section>

                {/* Final Notice */}
                <div className="rounded-2xl border border-[#FDBF2D]/40 bg-[#FAF92A]/10 p-5">
                    <p className="text-sm leading-6 text-slate-700">
                        By submitting this registration, you confirm
                        that the information provided is accurate and
                        that you agree to the terms and policies
                        associated with your hostel listing.
                    </p>
                </div>
            </div>

            {/* Navigation */}
            <div className="mt-8 flex items-center justify-between border-t border-slate-200 pt-6">
                <button
                    type="button"
                    onClick={onBack}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-5 py-3.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                >
                    <ArrowLeft size={18} />
                    Back
                </button>

                <button
                    type="button"
                    onClick={onSubmit}
                    disabled={submitting}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#FDBF2D] px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:bg-[#f2b51f] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
                >
                    <Send size={18} />

                    {submitting
                        ? "Submitting..."
                        : "Submit Registration"}
                </button>
            </div>
        </div>
    );
}

function SectionHeader({ title, subtitle }) {
    return (
        <div>
            <h2 className="text-lg font-semibold text-slate-900">
                {title}
            </h2>

            <p className="mt-1 text-sm text-slate-500">
                {subtitle}
            </p>
        </div>
    );
}

function PreviewItem({ label, value }) {
    return (
        <div>
            <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                {label}
            </p>

            <p className="mt-1 text-sm font-medium text-slate-800">
                {value || "Not provided"}
            </p>
        </div>
    );
}