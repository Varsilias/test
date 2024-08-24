import ApplicationLogo from "@/Components/ApplicationLogo";
import { Link } from "@inertiajs/react";
import { cn } from "@/lib/utils";
import { buttonVariants } from "@/Components/ui/button";
import { Cookie } from "lucide-react";

export default function Guest({ children }) {
    const baseUrl = window.location.origin;

    return (
        <>
            <div className="container relative hidden h-screen flex-col items-center justify-center md:grid lg:max-w-none lg:grid-cols-2 lg:px-0">
                <Link
                    href={route("register")}
                    className={cn(
                        buttonVariants({ variant: "ghost" }),
                        "absolute right-4 top-4 md:right-8 md:top-8"
                    )}
                >
                    Register
                </Link>
                <div className="relative hidden h-full flex-col bg-muted p-10 text-white lg:flex dark:border-r">
                    <div className="absolute inset-0 bg-foreground" />
                    <div className="relative z-20 flex items-center text-lg font-medium">
                        <Link href="/">
                            <img src={`${baseUrl}/images/consentprotect-white.png`} className="h-20" alt="" />
                        </Link>
                    </div>
                    <div className="relative z-20 mt-auto">
                        <blockquote className="space-y-2">
                            <p className="text-lg">
                                Push cookie management platform
                            </p>
                        </blockquote>
                    </div>
                </div>
                <div className="lg:p-8">
                    <div className="mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
                        {children}
                    </div>
                </div>
            </div>
        </>
    );
}
