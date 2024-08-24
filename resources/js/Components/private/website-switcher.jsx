import React from "react";
import {
    CaretSortIcon,
    CheckIcon,
    PlusCircledIcon,
} from "@radix-ui/react-icons";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/Components/ui/avatar";
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
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import {
    Command,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
} from "../ui/command";
import { Link, useForm } from "@inertiajs/react";
import { useToast } from "../ui/use-toast";
import { useWebsite } from "@/contexts/website-context";
import { Checkbox } from "../ui/checkbox";
import { Separator } from "../ui/separator";
import { useOnboarding } from "@/contexts/onboarding-context";

export default function WebsiteSwitcher({ className, user }) {
    const [open, setOpen] = React.useState(false);
    const {
        selectedWebsite,
        setSelectedWebsite,
        showNewWebsiteDialog,
        setShowNewWebsiteDialog,
    } = useWebsite();

    const { restart } = useOnboarding();

    React.useEffect(() => {
        // Only set the default website if no website has been selected yet
        if (!selectedWebsite && user.websites && user.websites.length > 0) {
            setSelectedWebsite(user.websites[0]);
        }
    }, [user, selectedWebsite, setSelectedWebsite]);

    const { toast } = useToast();

    const { processing, errors, data, setData, post } = useForm({
        user_id: user.id,
        name: "",
        domain: "",
        company_name: "",
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
            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={open}
                        aria-label="Select a website"
                        className={cn("w-[200px] justify-between", className)}
                    >
                        <Avatar className="mr-2 h-5 w-5">
                            <AvatarImage
                                src={`https://avatar.vercel.sh/acme-inc.png`}
                                alt={
                                    selectedWebsite?.name ??
                                    user.websites[0]?.name
                                }
                                className="grayscale"
                            />
                            <AvatarFallback>CP</AvatarFallback>
                        </Avatar>
                        {selectedWebsite?.name ? selectedWebsite?.name : 'Select domain'}
                        <CaretSortIcon className="ml-auto h-4 w-4 shrink-0 opacityi-50" />
                    </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[200px] p-0">
                    <Command>
                        <CommandList>
                            <CommandInput placeholder="Search website..." />
                            <CommandEmpty>No website found.</CommandEmpty>
                            <CommandGroup heading="Websites">
                                {user.websites.map((website) => (
                                    <CommandItem
                                        key={website.domain_id}
                                        onSelect={() => {
                                            setSelectedWebsite(website);
                                            setOpen(false);
                                        }}
                                        className="text-sm"
                                    >
                                        <Avatar className="mr-2 h-5 w-5">
                                            <AvatarImage
                                                src={`https://avatar.vercel.sh/${website?.logo}.png`}
                                                alt={website?.name}
                                                className="grayscale"
                                            />
                                            <AvatarFallback>SC</AvatarFallback>
                                        </Avatar>
                                        {website?.name}
                                        <CheckIcon
                                            className={cn(
                                                "ml-auto h-4 w-4",
                                                selectedWebsite?.domain_id ===
                                                    website.domain_id
                                                    ? "opacity-100"
                                                    : "opacity-0"
                                            )}
                                        />
                                    </CommandItem>
                                ))}
                            </CommandGroup>
                        </CommandList>
                        <CommandSeparator />
                        <CommandList>
                            <CommandGroup>
                                <CommandItem>
                                    <Link
                                        href={"onboarding"}
                                        onClick={() => {
                                            // localStorage.removeItem(
                                            //     "selectedWebsite"
                                            // );
                                            // setStep(1);
                                            restart()
                                        }}
                                        className="flex w-full"
                                    >
                                        <PlusCircledIcon className="mr-2 h-5 w-5" />
                                        Add domain
                                    </Link>
                                </CommandItem>
                            </CommandGroup>
                        </CommandList>
                    </Command>
                </PopoverContent>
            </Popover>
            {/* <DialogContent>
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
                        <div className="space-y-2">
                            <Label htmlFor="company_name">Company name</Label>
                            <Input
                                id="company_name"
                                placeholder="Company name"
                                onChange={(e) =>
                                    setData("company_name", e.target.value)
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
            </DialogContent> */}
        </Dialog>
    );
}
