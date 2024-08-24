import React from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";

export default function Analytics({ auth }) {
    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Analytics
                </h2>
            }
        >
            <Head title="Analytics" />
            <div>Analytics</div>
        </AuthenticatedLayout>
    );
}
