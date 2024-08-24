import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Breadkrumz from "@/Components/private/bread-crums";
import { useWebsite } from "@/contexts/website-context";
import { stripProtocolAndWWW } from "@/lib/utils";
import Widgets from "@/Components/private/implementations/widgets";

const appUrl = import.meta.env.VITE_APP_URL;

export default function Implementations({ auth }) {
    const { selectedWebsite } = useWebsite();

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Implementations
                </h2>
            }
        >
            <Head title="Implementations" />
            <main className="px-4">
                <div className="pb-8">
                    <Breadkrumz
                        title={stripProtocolAndWWW(selectedWebsite?.domain)}
                    />
                </div>
                <Widgets />
            </main>
        </AuthenticatedLayout>
    );
}
