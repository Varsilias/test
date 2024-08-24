import { useToast } from "@/Components/ui/use-toast";
import { useWebsite } from "@/contexts/website-context";
import React, { useCallback, useMemo } from "react";
import copy from "copy-text-to-clipboard";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/Components/ui/tooltip";
import { Button } from "@/Components/ui/button";
import { CopyIcon } from "lucide-react";

export default function Widgets() {
    const { selectedWebsite } = useWebsite();
    const { toast } = useToast();
    const baseUrl = window.location.origin;

    const bannerScript = useMemo(
        () =>
            `<script id="CookieBanner" src="${baseUrl}/banner/${selectedWebsite?.domain_id}" type="text/javascript"></script>`,
        [selectedWebsite]
    );

    const declarationScript = useMemo(
        () =>
            `<iframe src="${baseUrl}/declaration/${selectedWebsite?.domain_id}" width="100%" height="100%" title="cookie decalration"></iframe>`,
        [selectedWebsite]
    );

    const copyScriptToClipboard = useCallback(
        (script) => {
            const copied = copy(script);
            if (copied) {
                toast({ description: "Copied to clipboard!" });
            }
        },
        [toast]
    );

    return (
        <div className="flex flex-col space-y-10 border rounded-lg p-8">
            <div className="flex justify-between space-x-4">
                <div className="w-1/3">
                    <span className="text-4xl font-semibold">
                        Embed Cookie Banner script
                    </span>
                    <p className="text-sm max-w-96 pt-8">
                        Copy this script tag and insert it as the very first
                        script within the HEAD-tag of your website. The script
                        tag will show the cookie banner and the privacy trigger
                        on your website.
                    </p>
                </div>
                <div className="w-2/3">
                    <div className="bg-slate-100 p-8 shadow">
                        <span className="text-sm text-muted-foreground">
                            Script tag:
                        </span>

                        <div className="flex flex-col items-end space-y-2 pt-4">
                            <div className="grid flex-1 gap-2 border bg-white p-4 rounded">
                                <div className="">
                                    <code>{bannerScript}</code>
                                </div>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() =>
                                            copyScriptToClipboard(bannerScript)
                                        }
                                        size="sm"
                                        className="px-3"
                                    >
                                        <span className="sr-only">Copy</span>
                                        <CopyIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Copy</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
            <hr />
            <div className="flex justify-between space-x-4">
                <div className="w-1/3">
                    <span className="text-4xl font-semibold">
                        Embed declaration script
                    </span>
                    <p className="text-sm max-w-96 pt-8">
                        Copy this script and insert it in HTML on the specific
                        page and at the exact position where you would like the
                        Cookie declaration to appear.
                    </p>
                </div>
                <div className="w-2/3">
                    <div className="bg-slate-100 p-8 shadow">
                        <span className="text-sm text-muted-foreground">
                            Script tag:
                        </span>

                        <div className="flex flex-col items-end space-y-2 pt-4">
                            <div className="grid flex-1 gap-2 border bg-white p-4 rounded">
                                <div className="">
                                    <code>{declarationScript}</code>
                                </div>
                            </div>
                            <Tooltip>
                                <TooltipTrigger asChild>
                                    <Button
                                        onClick={() =>
                                            copyScriptToClipboard(
                                                declarationScript
                                            )
                                        }
                                        size="sm"
                                        className="px-3"
                                    >
                                        <span className="sr-only">Copy</span>
                                        <CopyIcon className="h-4 w-4" />
                                    </Button>
                                </TooltipTrigger>
                                <TooltipContent>
                                    <p>Copy</p>
                                </TooltipContent>
                            </Tooltip>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
