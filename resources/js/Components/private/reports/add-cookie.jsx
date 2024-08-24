import { Button } from "@/Components/ui/button";
import { Checkbox } from "@/Components/ui/checkbox";
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
import { Separator } from "@/Components/ui/separator";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/Components/ui/sheet";
import { Plus } from "lucide-react";
import { useForm } from "@inertiajs/react";
import { useWebsite } from "@/contexts/website-context";
import { useEffect } from "react";
import { useToast } from "@/Components/ui/use-toast";
import { useCookies } from "@/contexts/cookie-context";

export function AddCookie({ cookie }) {
    const { selectedWebsite } = useWebsite();
    const { showEditCookieDialog, setShowEditCookieDialog } = useCookies();

    const { processing, errors, data, setData, post, patch } = useForm({});

    useEffect(() => {
        if (!cookie) {
            setData({
                domain_id: selectedWebsite?.domain_id,
                name: "",
                provider: "",
                value: "",
                category: "",
                expiry: "",
                path: "",
            })
        } else {
            setData({...cookie, domain_id: selectedWebsite?.domain_id});
        }
    }, [cookie]);

    const { toast } = useToast();

    useEffect(() => {
        setData("domain_id", selectedWebsite?.domain_id);
    }, [selectedWebsite]);

    const onSubmit = (e) => {
        e.preventDefault();

        post(route("cookies.store", data), {
            preserveScroll: true,
            onSuccess: (data) => {
                // setShowNewWebsiteDialog(false)
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

        console.log(data);
        patch(route("cookies.update", {...data, cookie_id: cookie?.id}), {
            preserveScroll: true,
            onSuccess: (data) => {
                // setShowNewWebsiteDialog(false)
                toast({ description: "Operation Successfull" });
                setData({});
            },
            onError: (error) => {
                toast({ description: Object.values(error) });
            },
        });
    };

    return (
        <div className="grid grid-cols-2 gap-2">
            <Sheet
                open={showEditCookieDialog}
                onOpenChange={setShowEditCookieDialog}
            >
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Add New Cookie</SheetTitle>
                        <SheetDescription>
                            Add new tracker cookie here. Click submit when
                            you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Name
                            </Label>
                            <Input
                                id="name"
                                placeholder="Google Analytics"
                                className="col-span-3"
                                // value={data.name}
                                defaultValue={cookie?.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="provider" className="text-right">
                                Provider
                            </Label>
                            <Input
                                id="provider"
                                placeholder="Google"
                                className="col-span-3"
                                // value={data.provider}
                                defaultValue={cookie?.provider}
                                onChange={(e) =>
                                    setData("provider", e.target.value)
                                }
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="value" className="text-right">
                                Value
                            </Label>
                            <Input
                                id="value"
                                placeholder="Sample value"
                                className="col-span-3"
                                // value={data.value}
                                defaultValue={cookie?.value}
                                onChange={(e) =>
                                    setData("value", e.target.value)
                                }
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="category" className="text-right">
                                Category
                            </Label>
                            <Select
                                onValueChange={(e) => setData("category", e)}
                                // value={data.category}
                                defaultValue={cookie?.category}
                            >
                                <SelectTrigger className="w-[245px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Categories</SelectLabel>
                                        <SelectItem value="necessary">
                                            Nescessary
                                        </SelectItem>
                                        <SelectItem value="marketing">
                                            Marketing
                                        </SelectItem>
                                        <SelectItem value="preferences">
                                            Preferences
                                        </SelectItem>
                                        <SelectItem value="analytics">
                                            Analytics
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="expiry" className="text-right">
                                Expiry (in days)
                            </Label>
                            <Input
                                id="expiry"
                                name="expiry"
                                placeholder="365"
                                className="col-span-3"
                                // value={data.expiry}
                                defaultValue={cookie?.expiry}
                                onChange={(e) =>
                                    setData("expiry", e.target.value)
                                }
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="path" className="text-right">
                                Domain paths
                            </Label>
                            <Input
                                id="path"
                                name="path"
                                placeholder="'/', '/products', '/cart'"
                                className="col-span-3"
                                // value={data.path}
                                defaultValue={cookie?.path}
                                onChange={(e) =>
                                    setData("path", e.target.value)
                                }
                            />
                        </div>
                    </div>
                    <Separator className="mb-4" />
                    <SheetFooter>
                        <SheetClose asChild>
                                <form onSubmit={onUpdate}>
                                    <Button type="submit">Update</Button>
                                </form>
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}
