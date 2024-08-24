import React, { createContext, useState, useEffect, useContext } from "react";

export const OnboardingContext = createContext();

export const OnboardingProvider = ({ children }) => {
    const [step, setStep] = useState(3);
    const [title, setTitle] = useState('');
    const [formData, setFormData] = useState(() => {
        const savedFormData = localStorage.getItem('formData');

        return savedFormData != "undefined" ? JSON.parse(savedFormData) : null;
    });

    useEffect(() => {
        const savedFormData = JSON.parse(localStorage.getItem("formData"));
        const savedStep = JSON.parse(localStorage.getItem("step"));
        if (savedFormData) setFormData(savedFormData);
        if (savedStep) setStep(savedStep);
    }, []);

    useEffect(() => {
        localStorage.setItem("formData", JSON.stringify(formData));
        localStorage.setItem("step", JSON.stringify(step));
        handleTitle()
    }, [formData, step]);

    const nextStep = () => step >= 4 ? setStep(4) : setStep(step + 1);
    const prevStep = () => step <= 1 ? setStep(1) : setStep(step - 1);
    const restart = () => {
        setFormData(null);
        setStep(1);
        localStorage.removeItem("formData");
        localStorage.removeItem("step");
        localStorage.removeItem("selectedWebsite");
    };

    function handleTitle() {
        if (step == 1) {
            setTitle('Register domain');
        } else if (step == 2) {
            setTitle('Customise the Widget appearance');
        } else if (step == 3) {
            setTitle('Generated Widget codes');
        } else if (step == 4) {
            setTitle('Scan reports');
        }
    }
    return (
        <OnboardingContext.Provider
            value={{ title, step, formData, setFormData, nextStep, prevStep, restart, setStep }}
        >
            {children}
        </OnboardingContext.Provider>
    );
};

export const useOnboarding = () => useContext(OnboardingContext);
