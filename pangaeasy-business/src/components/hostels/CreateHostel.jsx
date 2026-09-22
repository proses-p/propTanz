import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";

import RegistrationSidebar from "../hostel-registration/RegistrationSidebar";
import Step1PersionalInformation from "../hostel-registration/Step1PersonalInformation";
import Step2BasicInformation from "../hostel-registration/Step2BasicInformation";
import Step3RoomsBeds from "../hostel-registration/Step3RoomsBeds";
import Step4HouseRules from "../hostel-registration/Step4HouseRules";
import Step5PreviewSignature from "../hostel-registration/Step5PreviewSignature";

import hostelService from "../../services/hostelService";

export default function CreateHostel() {
    const navigate = useNavigate();
    const [currentStep, setCurrentStep] = useState(1);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [completedSteps, setCompletedSteps] = useState([]);
    const [personalInfo, setPersonalInfo] = useState({
        full_name: "",
        email: "",
        phone: "",
        nationality: "",
        physical_address: "",
        tin: "",
    });

    const [basicInfo, setBasicInfo] = useState({
        hostel_name: "",
        description: "",
        region: "",
        district: "",
        ward: "",
        street: "",
        landmark: "",
        hostel_type: "",
    });

    const [rooms, setRooms] = useState([]);

    const [houseRules, setHouseRules] = useState({
        checkIn: "",
        checkOut: "",
        quiteHoursEnabled: true,
        quiteStart: "",
        quiteEnd: "",
        cancellationPolicy: "",
        rules: [
            "No smoking inside the hostel",
            "Guests must keep shared areas clean",
        ],

        agreements: {
            checkInOut: false,
            quiteHours: false,
            houseRules: false,
            cancellation: false,
        },
    });

    const [images, setImages] = useState([]);

    const [signature, setSignature] = useState(null);

    const [submitting, setSubmitting] = useState(false);

    const completeStep = (step) => {
        setCompletedSteps((prev) => prev.includes(step) ? prev : [...prev, step]);
    };

    const goToNextStep = () => {
        completeStep(currentStep);
        setCurrentStep((prev) => Math.min(prev + 1, 5));
        setMobileMenuOpen(false);
    };

    const goToPreviousStep = () => {
        setCurrentStep((prev) => Math.max(prev - 1, 1));
    };

    const goToStep = (step) => {
        if (
            step === 1 || 
            step < currentStep || 
            completedSteps.includes(step - 1)
        ) {
            setCurrentStep(step);
            setMobileMenuOpen(false);
        }
    };

    const handleFinalSubmit = async () =>  {
        if (!signature) {
            toast.error("please write your digital signature.");
            return;
        }

        if (images.length === 0) {
            toast.error("Please upload images here!");
            return;
        }

        try {
            setSubmitting(true);
            const data = new FormData();
            data.append("hostel_name", basicInfo.hostel_name);
            data.append("description", basicInfo.description);
            data.append("region", basicInfo.region);
            data.append("district", basicInfo.district);
            data.append("ward", basicInfo.ward);
            data.append("street", basicInfo.street);
            data.append("landmark", basicInfo.landmark);
            data.append("hostel_type", basicInfo.hostel_type);

            images.forEach((image) => {
                data.append("images[]", image);
            });

            await hostelService.create(data);

            toast.success("Hostel registered successfull!");

            navigate("/hostel-registration");
        } catch(error) {
            console.error(error);
            const response = error.response?.data;

            if (response?.errors) {
                const firstError = Object.values(response.errors)[0]?.[0];
                toast.error(firstError || "Please check your information");
            } else {
                toast.error(response?.message || "Failed to register hostel.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 1: 
                return (
                    <Step1PersionalInformation
                        data={personalInfo}
                        setData={setPersonalInfo}
                        onNext={goToNextStep}
                    />
                );

            case 2:
                return (
                    <Step2BasicInformation
                        data={basicInfo}
                        setData={setBasicInfo}
                        images={images}
                        setImages={setImages}
                        onNext={goToNextStep}
                        onBack={goToPreviousStep}
                    />
                );

            case 3:
                return (
                    <Step3RoomsBeds
                        rooms={rooms}
                        setRooms={setRooms}
                        onNext={goToNextStep}
                        onBack={goToPreviousStep}
                    />
                );

            case 4: 
                return (
                    <Step4HouseRules
                        data={houseRules}
                        setData={setHouseRules}
                        onNext={goToNextStep}
                        onBack={goToPreviousStep}
                    />
                );

            case 5:
                return (
                    <Step5PreviewSignature
                        personalInfo={personalInfo}
                        basicInfo={basicInfo}
                        rooms={rooms}
                        houseRules={houseRules}
                        images={images}
                        signature={signature}
                        setSignature={setSignature}
                        onBack={goToPreviousStep}
                        onSubmit={handleFinalSubmit}
                        submitting={submitting}
                    />
                );

            default:
                return null;
        }
    };


    return (
        <div className="min-h-screen bg-[#faf9f3]">
            {/* mobile menu button */}
            
            <button
                type="button"
                onClick={() => setMobileMenuOpen(true)}
                className="fixed left-4 top-4 z-40 rounded-lg bg-white p-3 shadow-md lg:hidden"
            >
                ☰
            </button>


            {/* side bar */}

            <RegistrationSidebar
                currentStep={currentStep}
                completedSteps={completedSteps}
                onStepClick={goToStep}
                mobileMenuOpen={mobileMenuOpen}
                onClose={() => setMobileMenuOpen(false)}
            />


            {/* main content */}

            <main className="min-h-screen lg:ml-80">
                <div className="mx-auto max-w-6xl px-5 py-8 sm:px-8 lg:px-10">
                    {renderCurrentStep()}
                </div>
            </main>
        </div>
    );
}