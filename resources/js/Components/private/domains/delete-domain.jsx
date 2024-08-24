import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { useWebsite } from "@/contexts/website-context";
import { useForm } from "@inertiajs/react";
import { Inertia } from "@inertiajs/inertia";
import React from "react";
import { useToast } from "@/Components/ui/use-toast";

export default function DeleteDomain({ resource, type }) {
    const { showDeleteWebsiteDialog, setShowDeleteWebsiteDialog } =
        useWebsite();
    const { toast } = useToast();

    const { delete: destroy } = useForm();
    const handleDelete = (id) => {
        if (type == "website") {
            destroy(route("websites.destroy", id), {
                preserveScroll: true,
                onSuccess: (data) => {
                    // setShowNewWebsiteDialog(false)
                    toast({ description: "Operation Successfull" });
                },
                onError: (error) => {
                    toast({ description: Object.values(error) });
                },
            });
        } else if (type == "cookie") {
            destroy(route("cookies.destroy", id), {
                preserveScroll: true,
                onSuccess: (data) => {
                    // setShowNewWebsiteDialog(false)
                    toast({ description: "Operation Successfull" });
                },
                onError: (error) => {
                    toast({ description: Object.values(error) });
                },
            });
        } else if (type == "user") {
            destroy(route("users.destroy", id), {
                preserveScroll: true,
                onSuccess: (data) => {
                    // setShowNewWebsiteDialog(false)
                    toast({ description: "Operation Successfull" });
                },
                onError: (error) => {
                    toast({ description: Object.values(error) });
                },
            });
        } else if (type == "report_receiver") {
            destroy(route("receivers.destroy", id), {
                preserveScroll: true,
                onSuccess: (data) => {
                    // setShowNewWebsiteDialog(false)
                    toast({ description: "Operation Successfull" });
                },
                onError: (error) => {
                    toast({ description: Object.values(error) });
                },
            });
        }
        setShowDeleteWebsiteDialog(false);
        toast({ description: "Operation Successfull" });
    };

    return (
        <div>
            <Dialog
                className="w-24"
                open={showDeleteWebsiteDialog}
                onOpenChange={setShowDeleteWebsiteDialog}
            >
                {/* <DialogTrigger>Open</DialogTrigger> */}
                <DialogContent className="w-80">
                    <DialogHeader>
                        <DialogTitle>Are you absolutely sure?</DialogTitle>
                        <DialogDescription className="flex justify-between pt-10">
                            <Button
                                className="bg-green-500 px-10"
                                onClick={() => handleDelete(resource.id)}
                            >
                                Yes
                            </Button>
                            <Button
                                className="bg-red-500 px-10"
                                onClick={() =>
                                    setShowDeleteWebsiteDialog(false)
                                }
                            >
                                No
                            </Button>
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    );
}
