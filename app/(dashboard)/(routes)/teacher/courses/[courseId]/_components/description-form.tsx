"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormMessage, FormItem } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { cn } from "@/lib/utils";
import { Course } from "@prisma/client";

interface DescriptionFormProps {
    initialData: Course;
    courseId: string;
};

const formSchema = z.object({
    description: z.string().min(1, {
        message: "Description is required"
    })
});

export const DescriptionForm = ({initialData, courseId} : DescriptionFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            description: initialData?.description || ""
        }
    });
    const { isSubmitting, isValid } = form.formState;
    const router = useRouter();
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}`, values);
            toast.success("Course updated!");
            toggleEdit();
            router.refresh();
        } catch (error) {
            console.log("[DESCRIPTION FORM]", error);
            toast.error("Something went wrong!");
        }
    }
    const toggleEdit = () => setIsEditing((prev) => !prev);
    return ( 
        <div className="border bg-slate-100 rounded-md p-4 mt-6">
            <div className="flex items-center justify-between font-medium">
                Course description
                <Button onClick={toggleEdit} variant="ghost">
                    {
                        isEditing ? 
                        <>Cancel</> :
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit description
                        </>
                    }
                </Button>
            </div>
            {
                isEditing ?
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 mt-4">
                        <FormField
                            control={form.control}
                            name="description"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Textarea
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'This course is about...'"
                                            {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex items-center gap-x-2">
                            <Button type="submit" disabled={isSubmitting || !isValid}>Save</Button>
                        </div>
                    </form>
                </Form> :
                <p className={cn("text-sm mt-2", !initialData.description && "text-slate-500 italic")}>{initialData.description ?? "No description provided"}</p>
            }
        </div>
     );
}