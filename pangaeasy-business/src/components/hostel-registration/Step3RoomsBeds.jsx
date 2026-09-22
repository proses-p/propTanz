import { useState } from "react";
import {
    ArrowLeft,
    ArrowRight,
    BedDouble,
    Plus,
    Trash2,
} from "lucide-react";
import { toast } from "react-toastify";

const emptyRoom = {
    room_type: "",
    number_of_rooms: "",
    beds_per_room: "",
    price_per_bed: "",
};

export default function Step3RoomsBeds({
    rooms,
    setRooms,
    onNext,
    onBack,
}) {
    const [errors, setErrors] = useState({});

    const addRoom = () => {
        setRooms((prev) => [
            ...prev,
            {
                ...emptyRoom,
                id: Date.now(),
            },
        ]);
    };

    const removeRoom = (id) => {
        setRooms((prev) =>
            prev.filter((room) => room.id !== id)
        );
    };

    const handleChange = (id, field, value) => {
        setRooms((prev) =>
            prev.map((room) =>
                room.id === id
                    ? {
                          ...room,
                          [field]: value,
                      }
                    : room
            )
        );

        setErrors((prev) => ({
            ...prev,
            [`${id}_${field}`]: "",
        }));
    };

    const validate = () => {
        const newErrors = {};

        if (rooms.length === 0) {
            toast.error("Please add at least one room type.");
            return false;
        }

        rooms.forEach((room) => {
            if (!room.room_type.trim()) {
                newErrors[`${room.id}_room_type`] =
                    "Room type is required.";
            }

            if (!room.number_of_rooms) {
                newErrors[`${room.id}_number_of_rooms`] =
                    "Number of rooms is required.";
            }

            if (!room.beds_per_room) {
                newErrors[`${room.id}_beds_per_room`] =
                    "Beds per room is required.";
            }

            if (!room.price_per_bed) {
                newErrors[`${room.id}_price_per_bed`] =
                    "Price per bed is required.";
            }
        });

        setErrors(newErrors);

        if (Object.keys(newErrors).length > 0) {
            toast.error("Please complete all room information.");
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
                    Step 3 of 5
                </p>

                <h1 className="mt-2 text-3xl font-bold text-slate-900">
                    Rooms & Beds
                </h1>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
                    Add the different room types available in your
                    hostel and specify their capacity and pricing.
                </p>
            </div>

            {/* Main Card */}
            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                {/* Section Header */}
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="flex items-center gap-3">
                        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-[#FAF92A]/30 text-slate-900">
                            <BedDouble size={21} />
                        </div>

                        <div>
                            <h2 className="text-lg font-semibold text-slate-900">
                                Room Types
                            </h2>

                            <p className="text-sm text-slate-500">
                                Add each room category separately.
                            </p>
                        </div>
                    </div>

                    <button
                        type="button"
                        onClick={addRoom}
                        className="inline-flex items-center justify-center gap-2 rounded-xl bg-[#FDBF2D] px-4 py-3 text-sm font-semibold text-slate-900 transition hover:bg-[#f2b51f]"
                    >
                        <Plus size={18} />
                        Add Room Type
                    </button>
                </div>

                {/* Empty State */}
                {rooms.length === 0 && (
                    <div className="mt-8 rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-6 py-14 text-center">
                        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white shadow-sm">
                            <BedDouble
                                size={25}
                                className="text-slate-400"
                            />
                        </div>

                        <h3 className="mt-4 text-sm font-semibold text-slate-800">
                            No room types added
                        </h3>

                        <p className="mx-auto mt-1 max-w-sm text-xs leading-5 text-slate-500">
                            Add your first room type to continue with
                            the hostel registration.
                        </p>

                        <button
                            type="button"
                            onClick={addRoom}
                            className="mt-5 inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100"
                        >
                            <Plus size={17} />
                            Add First Room
                        </button>
                    </div>
                )}

                {/* Rooms */}
                <div className="mt-8 space-y-5">
                    {rooms.map((room, index) => (
                        <div
                            key={room.id}
                            className="rounded-2xl border border-slate-200 bg-slate-50/60 p-5"
                        >
                            {/* Room Header */}
                            <div className="mb-5 flex items-center justify-between">
                                <div>
                                    <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">
                                        Room Type {index + 1}
                                    </p>

                                    <h3 className="mt-1 text-base font-semibold text-slate-900">
                                        Room Information
                                    </h3>
                                </div>

                                <button
                                    type="button"
                                    onClick={() =>
                                        removeRoom(room.id)
                                    }
                                    className="rounded-lg p-2 text-red-500 transition hover:bg-red-50"
                                    title="Remove room"
                                >
                                    <Trash2 size={18} />
                                </button>
                            </div>

                            <div className="grid gap-5 md:grid-cols-2">
                                {/* Room Type */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Room Type
                                    </label>

                                    <select
                                        value={room.room_type}
                                        onChange={(e) =>
                                            handleChange(
                                                room.id,
                                                "room_type",
                                                e.target.value
                                            )
                                        }
                                        className={`
                                            w-full rounded-xl border
                                            bg-white px-4 py-3.5
                                            text-sm text-slate-900
                                            outline-none focus:ring-2
                                            ${
                                                errors[
                                                    `${room.id}_room_type`
                                                ]
                                                    ? "border-red-400 focus:ring-red-100"
                                                    : "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"
                                            }
                                        `}
                                    >
                                        <option value="">
                                            Select room type
                                        </option>

                                        <option value="Single">
                                            Single
                                        </option>

                                        <option value="Double">
                                            Double
                                        </option>

                                        <option value="Triple">
                                            Triple
                                        </option>

                                        <option value="Four Bed">
                                            Four Bed
                                        </option>

                                        <option value="Shared">
                                            Shared
                                        </option>
                                    </select>

                                    {errors[
                                        `${room.id}_room_type`
                                    ] && (
                                        <p className="mt-2 text-xs text-red-500">
                                            {
                                                errors[
                                                    `${room.id}_room_type`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Number of Rooms */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Number of Rooms
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={room.number_of_rooms}
                                        onChange={(e) =>
                                            handleChange(
                                                room.id,
                                                "number_of_rooms",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. 10"
                                        className={`
                                            w-full rounded-xl border
                                            bg-white px-4 py-3.5
                                            text-sm text-slate-900
                                            outline-none focus:ring-2
                                            ${
                                                errors[
                                                    `${room.id}_number_of_rooms`
                                                ]
                                                    ? "border-red-400 focus:ring-red-100"
                                                    : "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"
                                            }
                                        `}
                                    />

                                    {errors[
                                        `${room.id}_number_of_rooms`
                                    ] && (
                                        <p className="mt-2 text-xs text-red-500">
                                            {
                                                errors[
                                                    `${room.id}_number_of_rooms`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Beds per Room */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Beds per Room
                                    </label>

                                    <input
                                        type="number"
                                        min="1"
                                        value={room.beds_per_room}
                                        onChange={(e) =>
                                            handleChange(
                                                room.id,
                                                "beds_per_room",
                                                e.target.value
                                            )
                                        }
                                        placeholder="e.g. 4"
                                        className={`
                                            w-full rounded-xl border
                                            bg-white px-4 py-3.5
                                            text-sm text-slate-900
                                            outline-none focus:ring-2
                                            ${
                                                errors[
                                                    `${room.id}_beds_per_room`
                                                ]
                                                    ? "border-red-400 focus:ring-red-100"
                                                    : "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"
                                            }
                                        `}
                                    />

                                    {errors[
                                        `${room.id}_beds_per_room`
                                    ] && (
                                        <p className="mt-2 text-xs text-red-500">
                                            {
                                                errors[
                                                    `${room.id}_beds_per_room`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>

                                {/* Price */}
                                <div>
                                    <label className="mb-2 block text-sm font-medium text-slate-700">
                                        Price per Bed
                                    </label>

                                    <div className="relative">
                                        <span className="absolute left-4 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400">
                                            TZS
                                        </span>

                                        <input
                                            type="number"
                                            min="0"
                                            value={room.price_per_bed}
                                            onChange={(e) =>
                                                handleChange(
                                                    room.id,
                                                    "price_per_bed",
                                                    e.target.value
                                                )
                                            }
                                            placeholder="e.g. 150000"
                                            className={`
                                                w-full rounded-xl border
                                                bg-white py-3.5 pl-14 pr-4
                                                text-sm text-slate-900
                                                outline-none focus:ring-2
                                                ${
                                                    errors[
                                                        `${room.id}_price_per_bed`
                                                    ]
                                                        ? "border-red-400 focus:ring-red-100"
                                                        : "border-slate-200 focus:border-[#FDBF2D] focus:ring-[#FDBF2D]/20"
                                                }
                                            `}
                                        />
                                    </div>

                                    {errors[
                                        `${room.id}_price_per_bed`
                                    ] && (
                                        <p className="mt-2 text-xs text-red-500">
                                            {
                                                errors[
                                                    `${room.id}_price_per_bed`
                                                ]
                                            }
                                        </p>
                                    )}
                                </div>
                            </div>

                            {/* Capacity Summary */}
                            {room.number_of_rooms &&
                                room.beds_per_room && (
                                    <div className="mt-5 rounded-xl bg-white px-4 py-3">
                                        <p className="text-xs text-slate-500">
                                            Total bed capacity
                                        </p>

                                        <p className="mt-1 text-lg font-bold text-slate-900">
                                            {Number(
                                                room.number_of_rooms
                                            ) *
                                                Number(
                                                    room.beds_per_room
                                                )}{" "}
                                            beds
                                        </p>
                                    </div>
                                )}
                        </div>
                    ))}
                </div>

                {/* Navigation */}
                <div className="mt-8 flex items-center justify-between border-t border-slate-100 pt-6">
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
        </div>
    );
}