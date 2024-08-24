import React, { useEffect } from 'react'
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from '@inertiajs/react';
import Breadkrumz from '@/Components/private/bread-crums';
import { UsersTable } from '@/Components/private/users/users-list';
import { useWebsite } from '@/contexts/website-context';

export default function Users({ auth, users }) {
    const { setSelectedWebsite } = useWebsite();

    useEffect(() => {
        if (auth.user.is_admin == 1) {
            setSelectedWebsite(null);
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
                <p className="text-3xl mb-3">Users</p>
                <p className="text-sm">
                Add new and manage existing users and their roles.
                </p>
            </div>
            <UsersTable users={users} />
        </div>
    </main>
</AuthenticatedLayout>
  )
}
