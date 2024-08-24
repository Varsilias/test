import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,

} from "@/Components/ui/dialog";
import { ScrollArea } from "@/Components/ui/scroll-area";
import React, { useEffect, useState } from "react";

export default function ReportCookies({ selectReport, showCookies, setShowCookies }) {
    const [parsed, setParsed] = useState();

    useEffect(() => {
        if (selectReport?.cookies) {
            setParsed(JSON.parse(selectReport?.cookies));
        }

    }, [selectReport?.cookies])

    return (
        <Dialog
            open={showCookies}
            onOpenChange={setShowCookies}
        >
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Cookie data</DialogTitle>
                    <DialogDescription>
                        This is the raw cookie data result from scanning <span className="font-bold">{selectReport?.domain_name}</span>

                        <ScrollArea className="h-[30rem] pt-5">
                            <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-word' }}>
                                <code>{JSON.stringify(parsed, null, 2)}</code>
                            </pre>
                        </ScrollArea>
                    </DialogDescription>
                </DialogHeader>
            </DialogContent>
        </Dialog>
    );
}
