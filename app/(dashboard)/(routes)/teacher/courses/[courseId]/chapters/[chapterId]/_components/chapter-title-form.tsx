"use client";

import * as z from "zod";
import axios from "axios";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormMessage, FormItem } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import toast from "react-hot-toast";
import { Pencil } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

interface ChapterTitleFormProps {
    initialData: {
        title: string;
    }
    courseId: string;
    chapterId: string;
};

const formSchema = z.object({
    title: z.string().min(1)
});

export const ChapterTitleForm = ({initialData, courseId, chapterId} : ChapterTitleFormProps) => {
    const [isEditing, setIsEditing] = useState(false);
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: initialData
    });
    const { isSubmitting, isValid } = form.formState;
    const router = useRouter();
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            await axios.patch(`/api/courses/${courseId}/chapters/${chapterId}`, values);
            toast.success("Chapter updated!");
            toggleEdit();
            router.refresh();
        } catch (error) {
            console.log("[TITLE FORM]", error);
            toast.error("Something went wrong!");
        }
    }
    const toggleEdit = () => setIsEditing((prev) => !prev);
    return ( 
        <div className="border bg-slate-100 rounded-md p-4 mt-6">
            <div className="flex items-center justify-between font-medium">
                Chapter title
                <Button onClick={toggleEdit} variant="ghost">
                    {
                        isEditing ? 
                        <>Cancel</> :
                        <>
                            <Pencil className="w-4 h-4 mr-2" />
                            Edit title
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
                            name="title"
                            render={({ field }) => (
                                <FormItem>
                                    <FormControl>
                                        <Input
                                            disabled={isSubmitting}
                                            placeholder="e.g. 'Introduction to the course'"
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
                <p className="text-sm mt-2">{initialData.title}</p>
            }
        </div>
     );
}