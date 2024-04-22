import React from 'react'
import { TableCard } from './TableCard';
import { useTableStore } from '@/store/tableStore';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { tableSchema } from '@/schemas/tableSchems';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from './ui/form';
import { z } from 'zod';
import { useLoginStore } from '@/store/loginStore';
import axios from 'axios';
import { CREATE_TABLE } from '@/utils/Api';
import { TTable } from '@/utils/interfaces';
import { useToast } from './ui/use-toast';
import { useRouter } from 'next/router';

interface TablesProps { }

export const Tables: React.FC<TablesProps> = () => {
    const tableStore = useTableStore();
    const form = useForm<z.infer<typeof tableSchema>>({
        resolver: zodResolver(tableSchema),
        defaultValues: {
            tableNumber: 1,
            capacity: 1,
            currentState: "Available"
        }
    });
    const allTableNumbers = new Set(tableStore.allTables?.map(table => table.tableNumber))
    const loginStore = useLoginStore();
    const { toast } = useToast()
    const router = useRouter()
    const onSubmit = async (values: z.infer<typeof tableSchema>) => {
        console.log(values); // Implement your add table logic here
        if (allTableNumbers.has(values.tableNumber)) {
            form.setError("tableNumber", { message: "Number already used" })
            return;
        }
        const postData = {
            "tableNumber": values.tableNumber,
            "capacity": values.capacity,
            "currentState": values.currentState
        } as any;
        const config = {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${loginStore.token}` // Authorization header
            }
        };
        try {
            const response = await axios.post(CREATE_TABLE, postData, config);
            if (response.status === 200 && response.data) {
                const table = {
                    tableNumber: response.data.data.tableNumber,
                    id: response.data.data.id,
                    capacity: response.data.data.capacity,
                    currentState: response.data.data.currentState

                } as TTable;
                toast({
                    variant: "success",
                    title: "Table Created",
                    description: `Table Number ${values.tableNumber} created with ${values.currentState}`,
                })
                setTimeout(() => {
                    router.reload()
                }, 500)
            }
        } catch (E: any) {
            toast({
                title: "Error ",
                variant: "destructive",
                description: `Table Number ${values.tableNumber} is not created with ${values.currentState} because ${E}`,
            })
        }

        // form.reset(); // Reset form after submission
    };
    const TableNumber = (
        <FormField
            control={form.control}
            name="tableNumber"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-lg font-extrabold text-foreground">
                            Table Number
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="Enter table number"
                            {...field}
                            type="number"
                            onChange={(e) => {
                                if (e.target.value) {
                                    let numValue = parseInt(e.target.value.replace(/^0+/, ''))
                                    field.onChange(numValue);
                                } else {
                                    field.onChange(0);
                                }

                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    const Capacity = (
        <FormField
            control={form.control}
            name="capacity"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-lg font-extrabold text-foreground">
                            Capacity
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="Enter capacity"
                            {...field}
                            type="number"
                            onChange={(e) => {
                                if (e.target.value) {
                                    let numValue = parseInt(e.target.value.replace(/^0+/, ''))
                                    field.onChange(numValue);
                                } else {
                                    field.onChange(0);
                                }
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );
    return (
        <section className="p-6">
            <div className="container mx-auto">
                <div className="flex space-x-6">
                    <h2 className="text-3xl font-bold mb-8">Manage Tables</h2>
                    {/* here add a button use lucid Icon to basically add a table  use shadcn ui dialog to create a form to add tables*/}
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className='ml-auto'>Add Table</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle className=' font-extrabold text-xl'>Add New Table</DialogTitle>
                                <DialogDescription>
                                    Enter the details of the new table.
                                </DialogDescription>
                            </DialogHeader>
                            <Form  {...form} >
                                <form onSubmit={form.handleSubmit(onSubmit)} className='flex flex-col space-y-4'>
                                    {TableNumber}
                                    {Capacity}
                                    {/* <Select {...form.register('currentState')}>
                                        <SelectTrigger className="w-[180px]">
                                            <SelectValue placeholder="Select State" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Available">Available</SelectItem>
                                            <SelectItem value="Occupied">Occupied</SelectItem>
                                        </SelectContent>
                                    </Select> */}
                                    <Button type="submit">Add Table</Button>
                                </form>

                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>

                {tableStore.allTables &&
                    (<div className="grid  grid-cols-3  gap-x-6 gap-y-8 ">
                        {tableStore.allTables.map((table) => (
                            <TableCard
                                key={table.id}
                                id={table.id}
                                currentState={table.currentState}
                                tableNumber={table.tableNumber}
                                capacity={table.capacity}
                            />
                        ))}
                    </div>)
                }
                {!tableStore.allTables && (
                    <div className="flex">
                        Please add Tables
                    </div>
                )

                }
            </div>
        </section>
    );
}
