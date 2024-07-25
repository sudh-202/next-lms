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
import { Combobox } from "@/components/ui/combobox";

interface CategoryFormProps {
    initialData: Course;
    courseId: string;
    options: { label: string; value: string }[];
};

const formSchema = z.object({
    categoryId: z.string().min(1),
});

export const CategoryForm = ({initialData, courseId, options} : CategoryFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            categoryId: initialData?.categoryId || ""
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
    const selectedOption = options.find((option) => option.value === initialData.categoryId);
    const toggleEdit = () => setIsEditing((prev) => !prev);
    return ( 
        <div className="border bg-slate-100 rounded-md p-4 mt-6">
            <div className="flex items-center justify-between font-medium">
                Course category
                <Button onClick={toggleEdit} variant="ghost">
                    {
                        isEditing ? 
                        <>Cancel</> :
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit category
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
                            name="categoryId"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Combobox options={options} {...field} />
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
                <p className={cn("text-sm mt-2", !initialData.categoryId && "text-slate-500 italic")}>{selectedOption?.label ?? "No category selected"}</p>
            }
        </div>
     );
}