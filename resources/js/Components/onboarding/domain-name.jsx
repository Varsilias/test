import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { router } from "@inertiajs/react";
import { Button } from "@/Components/ui/button";
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/Components/ui/form";
import { Input } from "@/Components/ui/input";
import { toast } from "@/Components/ui/use-toast";
import { Inertia } from "@inertiajs/inertia";
import { useOnboarding } from "@/contexts/onboarding-context";

const FormSchema = z.object({
    domain: z
        .string()
        .min(2, {
            message: "Domain must be at least 2 characters.",
        })
        .url({
            message: "Domain must be a valid URL.",
        }),
    email: z.string().email({
        message: "Email must be a valid email address.",
    }),
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
});

export function DomainName({ user }) {
    const { setFormData } = useOnboarding();

    const form = useForm({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            domain: "",
            email: "",
            name: "",
        },
    });

    function onSubmit(data) {
        // toast({
        //     title: "You submitted the following values:",
        //     description: (
        //         <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
        //             <code className="text-white">
        //                 {JSON.stringify(data, null, 2)}
        //             </code>
        //         </pre>
        //     ),
        // });

        router.post(
            "websites/onboarding",
            { ...data, user_id: user.id },
            {
                preserveScroll: true,
                onSuccess: (resp) => {
                    toast({
                        description: "Operation successful",
                    });
                    setFormData(data);
                },
                onError: (errors) => {
                    console.error(errors);
                    toast({
                        description: errors.error,
                    });
                },
            }
        );
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="w-full space-y-6"
            >
                <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                                <Input placeholder="ACME Corp" {...field} />
                            </FormControl>
                            <FormDescription>
                                This is your website name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="domain"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Domain</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="https://domain.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This is your public domain name.
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel>Customer email</FormLabel>
                            <FormControl>
                                <Input
                                    placeholder="example@email.com"
                                    {...field}
                                />
                            </FormControl>
                            <FormDescription>
                                This will be used for Cookie Scanning Reports
                                and also to email instructions on implementation
                                ( if chosen at a later step)
                            </FormDescription>
                            <FormMessage />
                        </FormItem>
                    )}
                />
                <Button type="submit">Submit</Button>
            </form>
        </Form>
    );
}
