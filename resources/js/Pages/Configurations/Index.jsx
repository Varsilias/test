import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import BannerLayout from "@/Components/private/configurations/banner-layouts";
import Breadkrumz from "@/Components/private/bread-crums";
import PreviewPage from "@/Components/private/preview-page";
import { ScrollArea } from "@/Components/ui/scroll-area";
import { useWebsite } from "@/contexts/website-context";
import { stripProtocolAndWWW } from "@/lib/utils";

export default function Configurations({ auth, domains }) {
    const { selectedWebsite, setSelectedWebsite } = useWebsite();

    useEffect(() => {
        const savedWebsite = localStorage.getItem('selectedWebsite');
        if (savedWebsite != 'undefined') {
            const website = JSON.parse(savedWebsite);
            setSelectedWebsite(domains.find((domain) => domain?.id == website?.id));
        }

    }, [domains]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Configurations
                </h2>
            }
        >
            <Head title="Configurations" />
            <main className="px-4">
                <div className="pb-8">
                    <Breadkrumz title={stripProtocolAndWWW(selectedWebsite?.domain)} />
                </div>
                <div className="flex space-x-4">
                    <ScrollArea className="w-1/4 h-[42rem]">
                        <BannerLayout />
                    </ScrollArea>
                    <div className="border w-full rounded-lg shadow h-full">
                        <PreviewPage />
                    </div>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
