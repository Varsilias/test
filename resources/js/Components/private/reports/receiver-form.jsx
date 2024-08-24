import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { Switch } from "@/Components/ui/switch";
import { useToast } from "@/Components/ui/use-toast";
import { useUser } from "@/contexts/user-context";
import { useWebsite } from "@/contexts/website-context";
import { useForm } from "@inertiajs/react";
import React from "react";

export default function ReceiverForm({
    selectReceiver,
    showForm,
    setShowForm,
}) {
    const { toast } = useToast();
    const { selectedWebsite, allWebsites } = useWebsite();

    const { processing, errors, data, setData, post, patch } = useForm({
        name: selectReceiver?.name,
        email: selectReceiver?.email,
        active: boooleanHelp(selectReceiver?.active),
    });

    const onSubmit = (e) => {
        e.preventDefault();
        const website_id = selectedWebsite?.id;
        const resData = { ...data, website_id };

        post(route("receivers.store", resData), {
            preserveScroll: true,
            onSuccess: (data) => {
                setShowForm(false);
                toast({ description: "Operation Successfull" });
                setData({});
            },
            onError: (error) => {
                toast({ description: Object.values(error) });
            },
        });
    };

    const onUpdate = (e) => {
        e.preventDefault();

        patch(
            route("receivers.update", {
                ...data,
                receiver_id: selectReceiver?.id,
            }),
            {
                preserveScroll: true,
                onSuccess: (data) => {
                    setShowForm(false);
                    toast({ description: "Operation Successfull" });
                    setData({});
                },
                onError: (error) => {
                    toast({ description: Object.values(error) });
                },
            }
        );
    };

    function boooleanHelp(val) {
        if (val == 1 || val == true) {
            return true;
        } else if (val == 0 || val == false) {
            return false;
        }
    }

    return (
        <Dialog open={showForm} onOpenChange={setShowForm}>
            {/* <DialogTrigger className="flex border justify-center items-center px-4 rounded-md hover:bg-accent text-sm">
                <CirclePlus className="mr-2 h-4 w-4" />
                Add Receiver
            </DialogTrigger> */}
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Add receiver</DialogTitle>
                    <DialogDescription>
                        Add or update a cookie scan report receiver for you
                        website
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            placeholder="Pedro Duarte"
                            className="col-span-3"
                            defaultValue={selectReceiver?.name}
                            onChange={(e) => setData("name", e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="email" className="text-right">
                            Email
                        </Label>
                        <Input
                            id="email"
                            placeholder="example@email.com"
                            className="col-span-3"
                            defaultValue={selectReceiver?.email}
                            onChange={(e) => setData("email", e.target.value)}
                        />
                    </div>
                    {/* {authUser.is_admin == 1 && !selectReceiver && (
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Website
                            </Label>
                            <Select
                                onValueChange={(e) => setData("website_id", e)}
                                defaultValue={selectReceiver?.website_id}
                            >
                                <SelectTrigger className="w-[276px]">
                                    <SelectValue placeholder="Select website" />
                                </SelectTrigger>
                                <SelectContent>
                                    {allWebsites.map((website) => (
                                        <SelectItem key={website.id} value={website.id}>
                                            {website.name}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    )} */}
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="status" className="text-right">
                            Status
                        </Label>
                        <Switch
                            checked={boooleanHelp(data?.active)}
                            onCheckedChange={(e) => setData("active", e)}
                        />
                    </div>
                </div>
                <DialogFooter>
                    {!selectReceiver ? (
                        <form onSubmit={onSubmit}>
                            <Button type="submit">Submit</Button>
                        </form>
                    ) : (
                        <form onSubmit={onUpdate}>
                            <Button type="submit">Update</Button>
                        </form>
                    )}
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
