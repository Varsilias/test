import React, { useEffect } from "react";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import { Head } from "@inertiajs/react";
import Breadkrumz from "@/Components/private/bread-crums";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs";
import ReceiverTab from "@/Components/private/reports/receivers-tab";
import ReceiversTab from "@/Components/private/reports/receivers-tab";
import ReportsTab from "@/Components/private/reports/reports-tab";
import CookiesTab from "@/Components/private/reports/cookies-tab";
import { Separator } from "@/Components/ui/separator";
import { useCookies } from "@/contexts/cookie-context";
import { useWebsite } from "@/contexts/website-context";
import { useUser } from "@/contexts/user-context";
import { stripProtocolAndWWW } from "@/lib/utils";

export default function Reports({
    auth,
    cookies,
    reports,
    report_receivers,
    websites,
}) {
    const { setCookies } = useCookies();
    const { selectedWebsite, setAllWebsites } = useWebsite();
    const { setAuthUser } = useUser();

    const finalCookies =
        auth.user.is_admin != 1
            ? auth.user.websites.find(
                  (website) => website?.id == selectedWebsite?.id
              )?.cookies
            : cookies.filter((cookie) => cookie.website_id == selectedWebsite?.id);
    const finalReport =
        auth.user.is_admin != 1
            ? auth.user.websites.find(
                  (website) => website?.id == selectedWebsite?.id
              ).reports
            : reports.filter((report) => report.website_id == selectedWebsite.id);
    const finalReportReceivers =
        auth.user.is_admin != 1
            ? auth.user.websites.find(
                  (website) => website?.id == selectedWebsite?.id
              ).report_receivers
            : report_receivers.filter((receiver) => receiver.website_id == selectedWebsite.id);

    useEffect(() => {
        setAuthUser(auth.user);
        setAllWebsites(websites);
    }, []);

    useEffect(() => {
        setCookies(finalCookies);
    }, [selectedWebsite]);

    return (
        <AuthenticatedLayout
            user={auth.user}
            header={
                <h2 className="font-semibold text-xl text-gray-800 leading-tight">
                    Reports
                </h2>
            }
        >
            <Head title="Reports" />
            <main className="px-4">
                <div className="pb-8">
                    <Breadkrumz
                        title={stripProtocolAndWWW(selectedWebsite?.domain)}
                    />
                </div>

                <div className="w-full">
                    <Tabs defaultValue="cookies" className="w-full">
                        <TabsList className="text-left">
                            <TabsTrigger value="cookies">
                                Tracker cookies
                            </TabsTrigger>
                            <TabsTrigger value="reports">Reports</TabsTrigger>
                            <TabsTrigger value="receivers">
                                Scan report receivers
                            </TabsTrigger>
                        </TabsList>
                        <Separator className="mt-2" />
                        <TabsContent value="cookies">
                            <CookiesTab cookies={finalCookies} />
                        </TabsContent>
                        <TabsContent value="reports">
                            <ReportsTab reports={finalReport} />
                        </TabsContent>
                        <TabsContent value="receivers">
                            <ReceiversTab
                                report_receivers={finalReportReceivers}
                            />
                        </TabsContent>
                    </Tabs>
                </div>
            </main>
        </AuthenticatedLayout>
    );
}
