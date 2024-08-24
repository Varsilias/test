import React from "react";
import "./style.css";
import "react-step-progress-bar/styles.css";
import { ProgressBar, Step } from "react-step-progress-bar";

const MultiStepProgressBar = (props) => {
    var stepPercentage = 0;

    if (props.currentStep === 1) {
        stepPercentage = 0;
    } else if (props.currentStep === 2) {
        stepPercentage = 20;
    } else if (props.currentStep === 3) {
        stepPercentage = 40;
    } else if (props.currentStep === 4) {
        stepPercentage = 60;
    } else if (props.currentStep === 5) {
        stepPercentage = 80;
    } else if (props.currentStep === 6) {
        stepPercentage = 100;
    } else {
        stepPercentage = 0;
    }

    return (
        <ProgressBar percent={stepPercentage}>
            <Step>
                {({ accomplished, index }) => (
                    <div
                        className={`indexedStep ${
                            accomplished ? "accomplished" : null
                        }`}
                    >
                        {index + 1}
                    </div>
                )}
            </Step>
            <Step>
                {({ accomplished, index }) => (
                    <div
                        className={`indexedStep ${
                            accomplished ? "accomplished" : null
                        }`}
                    >
                        {index + 1}
                    </div>
                )}
            </Step>
            <Step>
                {({ accomplished, index }) => (
                    <div
                        className={`indexedStep ${
                            accomplished ? "accomplished" : null
                        }`}
                    >
                        {index + 1}
                    </div>
                )}
            </Step>
            <Step>
                {({ accomplished, index }) => (
                    <div
                        className={`indexedStep ${
                            accomplished ? "accomplished" : null
                        }`}
                    >
                        {index + 1}
                    </div>
                )}
            </Step>
            <Step>
                {({ accomplished, index }) => (
                    <div
                        className={`indexedStep ${
                            accomplished ? "accomplished" : null
                        }`}
                    >
                        {index + 1}
                    </div>
                )}
            </Step>
            <Step>
                {({ accomplished, index }) => (
                    <div
                        className={`indexedStep ${
                            accomplished ? "accomplished" : null
                        }`}
                    >
                        {index + 1}
                    </div>
                )}
            </Step>
        </ProgressBar>
    );
};

export default MultiStepProgressBar;
