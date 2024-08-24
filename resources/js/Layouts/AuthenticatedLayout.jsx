import { useEffect } from "react";
import { UserNav } from "@/Components/private/user-nav";
import { Sidebar } from "@/Components/private/sidebar";
import WebsiteSwitcher from "@/Components/private/website-switcher";
import { useWebsite } from "@/contexts/website-context";

export default function Authenticated({ user, header, children }) {
    const baseUrl = window.location.origin;

    const { selectedWebsite, setSelectedWebsite, setShowNewWebsiteDialog } = useWebsite();

    useEffect(() => {
        if (!user.websites.length && user.is_admin == 0) {
            setShowNewWebsiteDialog(true);
        }
    }, [user]);

    useEffect(() => {
        if (selectedWebsite) {
            if (user.is_admin == 0) {
                const updatedWebsiteData = user.websites.find(
                    (website) => website.id == selectedWebsite.id
                );
                setSelectedWebsite(updatedWebsiteData)   
            }
        }
    }, [user]);

    return (
        <>
            <div className="hidden flex-col md:flex">
                <div className="border-b fixed w-full top-0 z-50 bg-background">
                    <div className="flex h-16 items-center justify-between px-4">
                        <div className="flex gap-10 items-center">
                            <img
                                src={`${baseUrl}/images/consentprotect-black.png`}
                                className="h-11"
                                alt=""
                            />
                            {user.is_admin == 0 && (
                                <WebsiteSwitcher user={user} />
                            )}
                        </div>
                        <UserNav user={user} />
                    </div>
                </div>
                <div className="flex w-full">
                    <Sidebar
                        user={user}
                        className="hidden lg:block w-60 border-r h-screen fixed top-16"
                    />
                    <div className="w-full py-20 pl-60">{children}</div>
                </div>
            </div>
        </>
    );
}
