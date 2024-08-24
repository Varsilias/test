import { DomainName } from "@/Components/onboarding/domain-name";
import ReportReceiver from "@/Components/onboarding/report-receiver";
import BannerLayout from "@/Components/private/configurations/banner-layouts";
import Widgets from "@/Components/private/implementations/widgets";
import PreviewPage from "@/Components/private/preview-page";
import { UserNav } from "@/Components/private/user-nav";
import { Button } from "@/Components/ui/button";
import { Progress } from "@/Components/ui/progress";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { useOnboarding } from "@/contexts/onboarding-context";
import { useWebsite } from "@/contexts/website-context";
import { Inertia } from "@inertiajs/inertia";
import { router, usePage } from "@inertiajs/react";
import { CircleArrowLeft, MoveLeft, MoveRight, RotateCcw } from "lucide-react";
import React, { useEffect } from "react";

export default function Onboarding({ auth, domains }) {
    const { title, step, prevStep, nextStep, formData, restart } = useOnboarding();
    const { setSelectedWebsite, selectedWebsite } = useWebsite();
    const savedWebsite = localStorage.getItem("selectedWebsite");

    useEffect(() => {
        if (formData) {
            const newDomain = formData.email
                ? domains.find((domain) => domain?.email === formData.email)
                : undefined;
            if (newDomain) {
                setSelectedWebsite(newDomain);
            } else {
                localStorage.removeItem("formData");
            }
            if (step == 1 && newDomain) {
                nextStep();
            }
        }
    }, [formData]);

    useEffect(() => {
        if (savedWebsite != "undefined") {
            const website = JSON.parse(savedWebsite);
            setSelectedWebsite(
                domains.find((domain) => domain?.id == website?.id)
            );
        }
    }, [domains]);

    return (
        <div className="w-full h-screen flex justify-center">
            <img
                id="background"
                className="absolute w-full h-screen -z-50"
                src="https://res.cloudinary.com/dieyb51bz/image/upload/v1713259123/my-rabbai/Fixed-aspect-ratio-spacer_cwpfgu.png"
            />
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        className="absolute top-10 left-10"
                        onClick={() => window.history.back()}
                    >
                        <CircleArrowLeft className="h-20 w-20" />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Go back</p>
                </TooltipContent>
            </Tooltip>
            <Tooltip>
                <TooltipTrigger asChild>
                    <button
                        className="absolute top-32 left-14"
                        onClick={() => restart()}
                    >
                        <RotateCcw className="h-8 w-8" strokeWidth={3} />
                    </button>
                </TooltipTrigger>
                <TooltipContent>
                    <p>Reset flow</p>
                </TooltipContent>
            </Tooltip>
            <div className="absolute right-8 top-5">
                <UserNav user={auth.user} />
            </div>
            <div className="w-[80%] mt-5">
                <div className="w-full flex flex-col gap-3 mb-2">
                    <div className="flex justify-between">
                        {step == 2 || !selectedWebsite ? (
                            <div></div>
                        ) : (
                            <Button variant="ghost" onClick={() => prevStep()}>
                                <MoveLeft />
                                Back
                            </Button>
                        )}
                        <span className="text-xl font-medium">{title}</span>
                        {formData ? (
                            <Button variant="ghost" onClick={() => nextStep()}>
                                Next <MoveRight />
                            </Button>
                        ) : (
                            <div></div>
                        )}
                    </div>
                    <Progress value={step * 25} className="w-full" />
                </div>
                {step == 1 && (
                    <div className="shadow bg-white border flex h-auto">
                        <div className="p-10 w-full">
                            <DomainName user={auth.user} />
                        </div>
                        <div className="h-auto w-2/5 bg-blue-950"></div>
                    </div>
                )}
                {step == 2 && (
                    <div className="">
                        <div className="shadow bg-white flex space-x-4 w-full p-4">
                            <ScrollArea className="w-1/4 h-[42rem]">
                                <BannerLayout />
                            </ScrollArea>
                            <div className="border w-full rounded-lg shadow h-full">
                                <PreviewPage />
                            </div>
                        </div>
                    </div>
                )}
                {step == 3 && (
                    <div className="shadow rounded-lg bg-white">
                        <Widgets />
                    </div>
                )}
                {step == 4 && (
                    <div className="shadow bg-white p-4 h-80">
                        <ReportReceiver />
                    </div>
                )}
            </div>
        </div>
    );
}
