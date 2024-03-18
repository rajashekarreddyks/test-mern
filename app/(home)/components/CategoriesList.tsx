import { Checkbox } from "@/components/ui/checkbox"
import { CategoriesProps } from "./Categories"
import { useFieldArray, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import * as z from "zod"
import { Button } from "@/components/ui/button";
import axios from "axios";
import { BASE_URL } from "@/lib/BASE_URL";
import { useState } from "react";
import { Loader2 } from "lucide-react";
import toast from "react-hot-toast";

export interface CategoriesListProps extends CategoriesProps {
    page: number
    setPage: (page: number) => void
}

const CategoriesList = ({
    categories,
    page
}: CategoriesListProps) => {
    
    const [loading, setLoading] = useState(false);
    const FormSchema = z.object({
        categories: z.array(z.number()).refine((value) => value.some((item) => item), {
            message: "You have to select at least one item.",
        }),
    })

    const defaultCategories = categories.filter(item => item.checked === true).map((item) => item.id) ;

    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
        defaultValues: {
            categories: [...defaultCategories] || [],
        },
    })


    const onSubmit = async (data: { categories: number[] }) => {
        try {
            setLoading(true);
            const { data: res } = await axios.patch(`${BASE_URL}/api/categories/set-categories`, {
                categoryIds: data.categories
            });
            toast.success('Categories added');
        }
        catch (e) {
            toast.error('Something went error');
            console.log(`Error in onSubmit ${e}`);
        }
        finally {
            setLoading(false);
        }

    }


    return (
        <>
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                    <FormField
                        control={form.control}
                        name="categories"
                        render={() => (
                            <FormItem>
                                {
                                    categories.slice(page * 6, (page * 6) + 6).map((item) => (
                                        <FormField
                                            key={item.id}
                                            control={form.control}
                                            name="categories"
                                            render={({ field }) => {
                                                // console.log(field);
                                                return (
                                                    <FormItem
                                                        key={item.id}
                                                        className="flex flex-row items-start space-x-3 space-y-0"
                                                    >
                                                        <FormControl>
                                                            <Checkbox
                                                                //field.value = ['id1','id2','id3']
                                                                checked={field.value?.includes(item.id)}
                                                                onCheckedChange={(checked) => {
                                                                    return checked
                                                                        ? field.onChange([...field.value, item.id])
                                                                        : field.onChange(
                                                                            field.value?.filter(
                                                                                (value) => value !== item.id
                                                                            )
                                                                        )
                                                                }}
                                                            />
                                                        </FormControl>
                                                        <FormLabel className="text-sm font-normal">
                                                            {item.name}
                                                        </FormLabel>
                                                    </FormItem>
                                                )
                                            }}
                                        />
                                    ))}
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button
                        className="flex items-center gap-5"
                        disabled={loading}
                        type="submit">
                        {
                            loading &&
                            <Loader2 className="animate-spin" />
                        }
                        Submit
                    </Button>
                </form>
            </Form>


        </>
    )
}

export default CategoriesList