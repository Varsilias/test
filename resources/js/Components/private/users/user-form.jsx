import { Button } from "@/Components/ui/button";
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
} from "@/Components/ui/sheet";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";
import { useToast } from "@/Components/ui/use-toast";
import { useUser } from "@/contexts/user-context";

export function UserForm({ user }) {
    const { showUserFormDialog, setShowUserFormDialog } = useUser();

    const { processing, errors, data, setData, post, patch } = useForm({});

    useEffect(() => {
        if (!user) {
            setData({
                name: "",
                email: "",
                password: "",
                is_admin: false,
            })
        } else {
            setData({...user});
        }
    }, [user]);

    const { toast } = useToast();


    const onSubmit = (e) => {
        e.preventDefault();

        post(route("users.store", data), {
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
        patch(route("users.update", {...data}), {
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
                open={showUserFormDialog}
                onOpenChange={setShowUserFormDialog}
            >
                <SheetContent side="right">
                    <SheetHeader>
                        <SheetTitle>Add New User</SheetTitle>
                        <SheetDescription>
                            Add new tracker user here. Click submit when
                            you're done.
                        </SheetDescription>
                    </SheetHeader>
                    <div className="grid gap-4 py-4">
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="name" className="text-right">
                                Full name
                            </Label>
                            <Input
                                id="name"
                                placeholder="Full name"
                                className="col-span-3"
                                // value={data.name}
                                defaultValue={user?.name}
                                onChange={(e) =>
                                    setData("name", e.target.value)
                                }
                            />
                        </div>
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="email" className="text-right">
                                Email
                            </Label>
                            <Input
                                id="email"
                                placeholder="email@example.com"
                                type="email"
                                className="col-span-3"
                                // value={data.provider}
                                defaultValue={user?.email}
                                onChange={(e) =>
                                    setData("email", e.target.value)
                                }
                            />
                        </div>
                        {!user.name && <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="password" className="text-right">
                                Password
                            </Label>
                            <Input
                                id="password"
                                placeholder="Sample value"
                                className="col-span-3"
                                // value={data.value}
                                defaultValue={user?.password}
                                onChange={(e) =>
                                    setData("password", e.target.value)
                                }
                            />
                        </div>}
                        <div className="grid grid-cols-4 items-center gap-4">
                            <Label htmlFor="role" className="text-right">
                                Role
                            </Label>
                            <Select
                                onValueChange={(e) => setData("is_admin", e)}
                                // value={data.category}
                                defaultValue={user?.is_admin?.toString()}
                            >
                                <SelectTrigger className="w-[245px]">
                                    <SelectValue placeholder="Select a category" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectGroup>
                                        <SelectLabel>Roles</SelectLabel>
                                        <SelectItem value="1">
                                            Admin
                                        </SelectItem>
                                        <SelectItem value="0">
                                            Client
                                        </SelectItem>
                                    </SelectGroup>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <Separator className="mb-4" />
                    <SheetFooter>
                        <SheetClose asChild>
                            {!user.name ? (
                                <form onSubmit={onSubmit}>
                                    <Button type="submit">Submit</Button>
                                </form>
                            ) : (
                                <form onSubmit={onUpdate}>
                                    <Button type="submit">Update</Button>
                                </form>
                            )}
                        </SheetClose>
                    </SheetFooter>
                </SheetContent>
            </Sheet>
        </div>
    );
}
