import React, { useEffect, useState } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head, router } from "@inertiajs/react";
import Breadkrumz from "@/Components/private/bread-crums";
import { DomainsTable } from "@/Components/private/domains/domain-list";
import { useOnboarding } from "@/contexts/onboarding-context";

export default function Domainz({ auth, domains }) {
    const [filtered, setFiltered] = useState([]);
    const { setStep, restart } = useOnboarding();

    useEffect(() => {
        const filtered = auth.user.is_admin != 1 ? auth.user.websites : domains;
        setFiltered(filtered);
    }, [auth, domains]);

    useEffect(() => {
        if (!auth.user.websites.length && auth.user.is_admin != 1) {
            restart();
            router.visit("onboarding", { method: "get" });
        }
    }, []);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Domains
                </h2>
            }
        >
            <Head title="Domains" />
            <main className="px-4">
                <div className="pb-8">
                    <Breadkrumz />
                </div>
                <div className="">
                    <div className="bg-slate-100 p-6 mb-9 rounded-lg ring-1">
                        <p className="text-3xl mb-3">Domains</p>
                        <p className="text-sm">
                            Add the domain names of the websites where you want
                            to enable cookie consent. We will scan each domain
                            for tracker cookies.
                        </p>
                    </div>
                    <DomainsTable websites={filtered} user={auth.user} />
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
