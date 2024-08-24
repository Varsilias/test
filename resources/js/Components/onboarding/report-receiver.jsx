import React, { useEffect } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { ChevronDownIcon } from "@radix-ui/react-icons";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button, buttonVariants } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/Components/ui/radio-group";
import { toast } from "@/Components/ui/use-toast";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { Radar } from "lucide-react";
import { useWebsite } from "@/contexts/website-context";
import { router, usePage } from "@inertiajs/react";
import { useOnboarding } from "@/contexts/onboarding-context";

const appearanceFormSchema = z.object({
    theme: z.enum(["light", "dark"], {
        required_error: "Please select a theme.",
    }),
    font: z.enum(["inter", "manrope", "system"], {
        invalid_type_error: "Select a font",
        required_error: "Please select a font.",
    }),
});

// This can come from your database or API.
const defaultValues = {
    theme: "light",
};

export default function ReportReceiver() {
    const { selectedWebsite } = useWebsite();
    const { restart } = useOnboarding();
    const { props } = usePage();

    const form = useForm({
        resolver: zodResolver(appearanceFormSchema),
        defaultValues,
    });

    useEffect(() => {
        if (props.errors.message) {
          toast({ description: props.errors.message });
        }
      }, [props]);

    const handleSendToEmail = () => {
        router.post(
            "/websites/report-to-email",
            {
                domainId: selectedWebsite.domain_id,
                report_to_email: true,
            },
            {
                preserveScroll: true,
                onSuccess: (resp) => {
                    toast({
                        description: "Operation successful",
                    });
                    router.visit("domains", { method: "get" });
                    restart();
                },
                onError: (errors) => {
                    console.error(errors);
                    toast({
                        description: errors.error,
                    });
                },
            }
        );
    };

    const handleStartScan = () => {
        router.post(
            `/websites/trigger-scan/${selectedWebsite.domain_id}`,
            {},
            {
                preserveScroll: true,
                onSuccess: (resp) => {
                    toast({
                        description: "Operation successful",
                    });
                    router.visit("domains", { method: "get" });
                    restart();
                },
                onError: (errors) => {
                    console.error(errors);
                    toast({
                        description: errors.error,
                    });
                },
            }
        );
    };

    function onSubmit(data) {
        toast({
            title: "You submitted the following values:",
            description: (
                <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
                    <code className="text-white">
                        {JSON.stringify(data, null, 2)}
                    </code>
                </pre>
            ),
        });
    }

    return (
        <div className="flex justify-center">
            <Form {...form}>
                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className="space-y-8"
                >
                    <FormField
                        control={form.control}
                        name="theme"
                        render={({ field }) => (
                            <FormItem className="space-y-1 text-center">
                                <FormLabel className="text-2xl">
                                    Do you want to receive scan reports?
                                </FormLabel>
                                <FormMessage />
                                <RadioGroup
                                    onValueChange={field.onChange}
                                    defaultValue={field.value}
                                    className="grid max-w-md grid-cols-2 gap-8 pt-2"
                                >
                                    <FormItem>
                                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value="light"
                                                    className="sr-only"
                                                />
                                            </FormControl>
                                            <div className="items-center rounded-md border-2 border-muted p-1 hover:border-accent">
                                                <div className="space-y-2 rounded-sm bg-[#ecedef]flex justify-center">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full"
                                                            >
                                                                Yes
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-66 mt-3">
                                                            <div className="grid gap-4">
                                                                <div className="space-y-2">
                                                                    <h4 className="font-medium leading-none">
                                                                        Scan
                                                                        reports
                                                                    </h4>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Cookie
                                                                        scan
                                                                        reports
                                                                        will be
                                                                        sent to{" "}
                                                                        {
                                                                            selectedWebsite?.email
                                                                        }
                                                                    </p>
                                                                    <Button
                                                                        onClick={
                                                                            handleSendToEmail
                                                                        }
                                                                        className="w-full flex gap-2 bg-blue-500 hover:bg-blue-600"
                                                                    >
                                                                        Confirm
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                        </FormLabel>
                                    </FormItem>
                                    <FormItem>
                                        <FormLabel className="[&:has([data-state=checked])>div]:border-primary">
                                            <FormControl>
                                                <RadioGroupItem
                                                    value="dark"
                                                    className="sr-only"
                                                />
                                            </FormControl>
                                            <div className="items-center rounded-md border-2 border-muted bg-popover p-1 hover:bg-accent hover:text-accent-foreground">
                                                <div className="space-y-2 rounded-sm bg-[#ecedef]">
                                                    <Popover>
                                                        <PopoverTrigger asChild>
                                                            <Button
                                                                variant="outline"
                                                                className="w-full"
                                                            >
                                                                No
                                                            </Button>
                                                        </PopoverTrigger>
                                                        <PopoverContent className="w-66 mt-5">
                                                            <div className="grid gap-4">
                                                                <div className="space-y-2">
                                                                    <h4 className="font-medium leading-none">
                                                                        Cookie
                                                                        scan
                                                                    </h4>
                                                                    <p className="text-sm text-muted-foreground">
                                                                        Click to
                                                                        start
                                                                        full
                                                                        website
                                                                        scan now
                                                                    </p>
                                                                    <Button
                                                                        onClick={
                                                                            handleStartScan
                                                                        }
                                                                        className="w-full flex gap-2 bg-green-500 hover:bg-green-600"
                                                                    >
                                                                        {" "}
                                                                        <Radar />{" "}
                                                                        Scan
                                                                    </Button>
                                                                </div>
                                                            </div>
                                                        </PopoverContent>
                                                    </Popover>
                                                </div>
                                            </div>
                                        </FormLabel>
                                    </FormItem>
                                </RadioGroup>
                            </FormItem>
                        )}
                    />

                    {/* <Button type="submit">Update preferences</Button> */}
                </form>
            </Form>
        </div>
    );
}
