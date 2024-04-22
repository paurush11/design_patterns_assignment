import { DialogContent, DialogTitle, DialogDescription } from '@radix-ui/react-dialog';
import React from 'react'
import { Form, SubmitHandler, useForm } from 'react-hook-form';
import { Button } from './ui/button';
import { DialogHeader } from './ui/dialog';
import { SendComboDish } from '@/utils/interfaces';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendComboDishSchema } from '@/schemas/dishSchemas';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { Input } from './ui/input';



interface AddComboDishFormProps {

}

export const AddComboDishForm: React.FC<AddComboDishFormProps> = ({ }) => {
    const form = useForm<z.infer<typeof sendComboDishSchema>>({
        resolver: zodResolver(sendComboDishSchema), // or sendComboDishSchema depending on the context
    });

    const onSubmit: SubmitHandler<SendComboDish> = (values: z.infer<typeof sendComboDishSchema>) => {
        // Handle dish submission
    };
    const DishName = (
        <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-lg font-extrabold text-foreground">
                            Dish Name
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="Enter dish name"
                            {...field}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    return (
        <DialogContent>
            <DialogHeader>
                <DialogTitle className='font-extrabold text-xl'>Add New Dish</DialogTitle>
                <DialogDescription>
                    Enter the details of the new dish.
                </DialogDescription>
            </DialogHeader>
            <Form  {...form} >
                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
                    {/* Form fields will go here */}
                    <Button type="submit">Add Dish</Button>
                </form>
            </Form>
        </DialogContent>
    );
}