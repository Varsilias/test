import { Button } from "@/Components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
    SelectValue,
} from "@/Components/ui/select";
import { useToast } from "@/Components/ui/use-toast";
import { useWebsite } from "@/contexts/website-context";
import { useForm } from "@inertiajs/react";

export function EditDomain({ website }) {
    const {
        showEditWebsiteDialog,
        setShowEditWebsiteDialog,
    } = useWebsite();

    const { processing, errors, data, setData, put } = useForm({
        website_id: website.id,
        name: website.name,
        domain: website.domain,
        scan_frequency: website.scan_frequency,
    });

    const { toast } = useToast();

    const onSubmit = (e) => {
        e.preventDefault();

        put(route("websites.update", data), {
            onSuccess: (data) => {
                setShowEditWebsiteDialog(false)

                // console.log('SUCCESS_DATA', data);
                toast({ description: "Operation Successfull" });
                if (data.scan_my_website == true) {
                    toast({ description: "Website scan initiated" });
                }
            },
            onError: (error) => {
                // console.error('ERROR_DATA', Object.values(error));
                toast({ description: Object.values(error) });
            },
        });
    };

    return (
        <Dialog
            open={showEditWebsiteDialog}
            onOpenChange={setShowEditWebsiteDialog}
        >
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit domains</DialogTitle>
                    <DialogDescription>
                        Make changes to your domain here. Click save when you're
                        done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            defaultValue={website.name}
                            className="col-span-3"
                            onChange={(e) => setData("name", e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="domain" className="text-right">
                            Domain
                        </Label>
                        <Input
                            id="domain"
                            defaultValue={website.domain}
                            className="col-span-3"
                            onChange={(e) => setData("domain", e.target.value)}
                        />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="domain" className="text-right">
                            Scan frequency
                        </Label>
                        <Select defaultValue={website.scan_frequency} onValueChange={(e) => setData("scan_frequency", e)}>
                            <SelectTrigger className="w-[275px]">
                                <SelectValue placeholder="Select frequency" />
                            </SelectTrigger>
                            <SelectContent >
                                <SelectGroup>
                                    <SelectLabel>Scan frequency</SelectLabel>
                                    <SelectItem value="weekly">
                                        Weekly
                                    </SelectItem>
                                    <SelectItem value="monthly">
                                        Monthly
                                    </SelectItem>
                                    <SelectItem value="yearly">
                                        Yearly
                                    </SelectItem>
                                </SelectGroup>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
                <DialogFooter>
                <form onSubmit={onSubmit}>
                    <Button type="submit">Save changes</Button>
                </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
