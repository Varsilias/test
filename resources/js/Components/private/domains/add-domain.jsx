import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
import { CommandItem } from "@/Components/ui/command";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/Components/ui/dialog";
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { Separator } from "@/Components/ui/separator";
import { PlusCircledIcon } from "@radix-ui/react-icons";
import { useForm } from "@inertiajs/react";
import { useToast } from "@/Components/ui/use-toast";
import { useUser } from "@/contexts/user-context";
import { useWebsite } from "@/contexts/website-context";

export function AddDomain({user}) {
    const { toast } = useToast();
    const {
        showNewWebsiteDialog,
        setShowNewWebsiteDialog,
    } = useWebsite();

    const { processing, errors, data, setData, post } = useForm({
        user_id: user.id,
        name: "",
        domain: "",
        scan_my_website: "",
    });

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("websites.store", data), {
            preserveScroll: true,
            onSuccess: (data) => {
                // console.log('SUCCESS_DATA', data);
                setShowNewWebsiteDialog(false);
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
            open={showNewWebsiteDialog}
            onOpenChange={setShowNewWebsiteDialog}
        >
            <DialogTrigger asChild>
                <Button
                    onSelect={() => {
                        setOpen(false);
                        setShowNewWebsiteDialog(true);
                    }}
                >
                    <PlusCircledIcon className="mr-2 h-5 w-5" />
                    Add website
                </Button>
            </DialogTrigger>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Add website</DialogTitle>
                    <DialogDescription>
                        Add a new website to manage products and customers.
                    </DialogDescription>
                </DialogHeader>
                <div>
                    <div className="space-y-4 py-2 pb-4">
                        <div className="space-y-2">
                            <Label htmlFor="name">Website name</Label>
                            <Input
                                id="name"
                                placeholder="Push cycles."
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="name">Website url</Label>
                            <Input
                                id="url"
                                placeholder="https://www.pushcycles.com"
                                onChange={(e) =>
                                    setData("domain", e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <Separator />
                    <div className="items-top flex space-x-2 pt-4">
                        <Checkbox
                            id="scan_website"
                            name="scan_my_website"
                            // checked={true}
                            onCheckedChange={(e) =>
                                setData("scan_my_website", e)
                            }
                        />
                        <div className="grid gap-1.5 leading-none">
                            <label
                                htmlFor="terms1"
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                                Scan your website for cookies?
                            </label>
                            <p className="text-xs text-muted-foreground">
                                Once the scan is done you will be notified and
                                results will be at{" "}
                                <span className="font-semibold">
                                    Cookie and Reports
                                </span>{" "}
                                page
                            </p>
                        </div>
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setShowNewWebsiteDialog(false)}
                    >
                        Cancel
                    </Button>
                    <form onSubmit={onSubmit}>
                        <Button disabled={processing} type="submit">
                            Continue
                        </Button>
                    </form>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
