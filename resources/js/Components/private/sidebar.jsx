import { cn, stripProtocolAndWWW } from "@/lib/utils";
import { buttonVariants } from "@/Components/ui/button";
import { Link as RouterLink } from "@inertiajs/react";
import {
    ChevronDown,
    CodeXml,
    LayoutDashboard,
    LineChart,
    Link,
    Radio,
    SlidersVertical,
    Users,
} from "lucide-react";
import { useWebsite } from "@/contexts/website-context";

export function Sidebar({ className, user }) {
    const { selectedWebsite } = useWebsite();

    const isAdminView = user.is_admin == 1;
    const isClientView = user.is_admin == 0 && selectedWebsite != null;
    const adminViewDomain = isAdminView && selectedWebsite != null;

    return (
        <div className={cn("pb-12", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <div className="space-y-1">
                        {isAdminView && (
                            <RouterLink
                                href={route("dashboard")}
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    window.location.pathname === "/dashboard"
                                        ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                                        : "hover:bg-secondary/80",
                                    "justify-start w-full"
                                )}
                            >
                                <LayoutDashboard className="h-4 w-4 mr-2" />
                                Dashboard
                            </RouterLink>
                        )}
                        <RouterLink
                            href={route("domains")}
                            className={cn(
                                buttonVariants({ variant: "ghost" }),
                                window.location.pathname === "/domains"
                                    ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                                    : "hover:bg-secondary/80",
                                "justify-between w-full "
                            )}
                        >
                            <div className="flex">
                                <Link className="h-4 w-4 mr-2" />
                                Domains
                            </div>
                            {adminViewDomain && (
                                <ChevronDown className="h-4 w-4" />
                            )}
                        </RouterLink>
                        {adminViewDomain && (
                            <div className="ml-5 pt-0">
                                <span className="text-xs text-blue-400 ml-5">
                                    {stripProtocolAndWWW(
                                        selectedWebsite.domain
                                    )}
                                </span>
                                <RouterLink
                                    href={route("configurations")}
                                    className={cn(
                                        buttonVariants({ variant: "ghost" }),
                                        window.location.pathname ===
                                            "/configurations"
                                            ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                                            : "hover:bg-secondary/80",
                                        "justify-start w-full"
                                    )}
                                >
                                    <SlidersVertical className="h-4 w-4 mr-2" />
                                    Configuration
                                </RouterLink>
                                <RouterLink
                                    href={route("implementations")}
                                    className={cn(
                                        buttonVariants({ variant: "ghost" }),
                                        window.location.pathname ===
                                            "/implementations"
                                            ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                                            : "hover:bg-secondary/80",
                                        "justify-start w-full"
                                    )}
                                >
                                    <CodeXml className="h-4 w-4 mr-2" />
                                    Implementations
                                </RouterLink>
                                <RouterLink
                                    href={route("reports")}
                                    className={cn(
                                        buttonVariants({ variant: "ghost" }),
                                        window.location.pathname === "/reports"
                                            ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                                            : "hover:bg-secondary/80",
                                        "justify-start w-full"
                                    )}
                                >
                                    <Radio className="h-4 w-4 mr-2" />
                                    Cookies & Reports
                                </RouterLink>
                            </div>
                        )}
                        {isClientView && (
                            <RouterLink
                                href={route("configurations")}
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    window.location.pathname ===
                                        "/configurations"
                                        ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                                        : "hover:bg-secondary/80",
                                    "justify-start w-full"
                                )}
                            >
                                <SlidersVertical className="h-4 w-4 mr-2" />
                                Configuration
                            </RouterLink>
                        )}
                        {isClientView && (
                            <RouterLink
                                href={route("implementations")}
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    window.location.pathname ===
                                        "/implementations"
                                        ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                                        : "hover:bg-secondary/80",
                                    "justify-start w-full"
                                )}
                            >
                                <CodeXml className="h-4 w-4 mr-2" />
                                Implementations
                            </RouterLink>
                        )}
                        {isClientView && (
                            <RouterLink
                                href={route("reports")}
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    window.location.pathname === "/reports"
                                        ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                                        : "hover:bg-secondary/80",
                                    "justify-start w-full"
                                )}
                            >
                                <Radio className="h-4 w-4 mr-2" />
                                Cookies & Reports
                            </RouterLink>
                        )}
                        {isAdminView && (
                            <RouterLink
                                href={route("users.list")}
                                className={cn(
                                    buttonVariants({ variant: "ghost" }),
                                    window.location.pathname === "/users"
                                        ? "bg-secondary text-secondary-foreground shadow-sm hover:bg-secondary/80"
                                        : "hover:bg-secondary/80",
                                    "justify-start w-full"
                                )}
                            >
                                <Users className="h-4 w-4 mr-2" />
                                Users
                            </RouterLink>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
