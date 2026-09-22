import {
    User,
    Building2,
    BedDouble,
    ClipboardCheck,
    FileSignature,
    Check,
    X,
} from "lucide-react";

const steps = [
    {
        id: 1,
        title: "Personal Information",
        description: "Your personal details",
        icon: User,
    },
    {
        id: 2,
        title: "Basic Information",
        description: "Hostel details",
        icon: Building2,
    },
    {
        id: 3,
        title: "Rooms & Beds",
        description: "Room and bed details",
        icon: BedDouble,
    },
    {
        id: 4,
        title: "House Rules & Terms",
        description: "Rules and agreements",
        icon: ClipboardCheck,
    },
    {
        id: 5,
        title: "Preview & Signature",
        description: "Review and submit",
        icon: FileSignature,
    },
];

export default function RegistrationSidebar({
    currentStep,
    completedSteps,
    onStepClick,
    mobileMenuOpen,
    onClose,
}) {
    return (
        <>
            {/* Mobile Overlay */}
            {mobileMenuOpen && (
                <div
                    onClick={onClose}
                    className="fixed inset-0 z-40 bg-black/40 lg:hidden"
                />
            )}

            <aside
                className={`
                    fixed left-0 top-0 z-50 flex h-screen w-80
                    flex-col bg-white border-r border-slate-200
                    transition-transform duration-300
                    ${mobileMenuOpen
                        ? "translate-x-0"
                        : "-translate-x-full lg:translate-x-0"
                    }
                `}
            >
                {/* Header */}
                <div className="border-b border-slate-100 px-7 py-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xs font-semibold uppercase tracking-wider text-slate-400">
                                PangaEasy Business
                            </p>

                            <h2 className="mt-1 text-xl font-bold text-slate-900">
                                Register Hostel
                            </h2>
                        </div>

                        <button
                            type="button"
                            onClick={onClose}
                            className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 lg:hidden"
                        >
                            <X size={20} />
                        </button>
                    </div>
                </div>

                {/* Progress */}
                <div className="px-7 py-7">
                    <div className="mb-7">
                        <div className="flex items-center justify-between">
                            <span className="text-sm font-semibold text-slate-700">
                                Registration Progress
                            </span>

                            <span className="text-sm font-bold text-slate-900">
                                {currentStep}/5
                            </span>
                        </div>

                        <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                            <div
                                className="h-full rounded-full bg-[#FDBF2D] transition-all duration-500"
                                style={{
                                    width: `${(currentStep / 5) * 100}%`,
                                }}
                            />
                        </div>
                    </div>

                    {/* Steps */}
                    <div className="space-y-2">
                        {steps.map((step) => {
                            const Icon = step.icon;

                            const isCurrent =
                                currentStep === step.id;

                            const isCompleted =
                                completedSteps.includes(step.id);

                            const canClick =
                                step.id === 1 ||
                                step.id < currentStep ||
                                completedSteps.includes(step.id - 1);

                            return (
                                <button
                                    key={step.id}
                                    type="button"
                                    disabled={!canClick}
                                    onClick={() =>
                                        onStepClick(step.id)
                                    }
                                    className={`
                                        relative flex w-full items-center
                                        gap-4 rounded-xl p-3 text-left
                                        transition-all duration-200

                                        ${
                                            isCurrent
                                                ? "bg-[#FAF92A]/20"
                                                : canClick
                                                ? "hover:bg-slate-50"
                                                : "cursor-not-allowed opacity-50"
                                        }
                                    `}
                                >
                                    {/* Connector */}
                                    {step.id < steps.length && (
                                        <div
                                            className={`
                                                absolute left-[27px] top-[52px]
                                                h-7 w-px
                                                ${
                                                    isCompleted
                                                        ? "bg-[#FDBF2D]"
                                                        : "bg-slate-200"
                                                }
                                            `}
                                        />
                                    )}

                                    {/* Icon */}
                                    <div
                                        className={`
                                            relative z-10 flex h-11 w-11
                                            shrink-0 items-center justify-center
                                            rounded-full border-2 transition-all

                                            ${
                                                isCompleted
                                                    ? "border-[#FDBF2D] bg-[#FDBF2D] text-slate-900"
                                                    : isCurrent
                                                    ? "border-[#FDBF2D] bg-white text-slate-900"
                                                    : "border-slate-200 bg-white text-slate-400"
                                            }
                                        `}
                                    >
                                        {isCompleted ? (
                                            <Check size={19} strokeWidth={3} />
                                        ) : (
                                            <Icon size={19} />
                                        )}
                                    </div>

                                    {/* Text */}
                                    <div className="min-w-0">
                                        <p
                                            className={`
                                                text-sm font-semibold
                                                ${
                                                    isCurrent ||
                                                    isCompleted
                                                        ? "text-slate-900"
                                                        : "text-slate-500"
                                                }
                                            `}
                                        >
                                            {step.title}
                                        </p>

                                        <p className="mt-0.5 text-xs text-slate-400">
                                            {step.description}
                                        </p>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>

                {/* Bottom Info */}
                <div className="mt-auto border-t border-slate-100 p-7">
                    <div className="rounded-xl bg-slate-50 p-4">
                        <p className="text-xs font-semibold text-slate-700">
                            Registration Tips
                        </p>

                        <p className="mt-1 text-xs leading-5 text-slate-500">
                            Complete each step carefully. You can go back
                            and review completed sections before submitting.
                        </p>
                    </div>
                </div>
            </aside>
        </>
    );
}