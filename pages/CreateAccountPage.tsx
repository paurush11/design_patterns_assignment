// Adjust the imports as necessary
import { Navbar } from '@/components/Navbar';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

import { accountSchema } from '@/schemas/accountSchema';
import { REGISTER } from '@/utils/Api';
import { zodResolver } from '@hookform/resolvers/zod';
import axios from 'axios';

import React from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { z } from 'zod';
import { useRouter } from 'next/router';
import { useLoginStore } from '@/store/loginStore';
import { Footer } from '@/components/Footer';

type AccountFormInputs = z.infer<typeof accountSchema>;

interface CreateAccountPageProps { }

const CreateAccountPage: React.FC<CreateAccountPageProps> = () => {
    const loginStore = useLoginStore();
    const form = useForm<z.infer<typeof accountSchema>>({
        resolver: zodResolver(accountSchema),
        defaultValues: {
            username: "ExampleUser",
            password: "P@ssw0rd!",
            email: "example.user@example.com",
            fingerPrint: "123456789012345678901234567890",
            phone: "1234567890",
            role: "USER"
        }
    });

    const router = useRouter()

    const onSubmit: SubmitHandler<AccountFormInputs> = async (values: z.infer<typeof accountSchema>) => {

        try {
            const postData = {
                "username": values.username,
                "password": values.password,
                "email": values.email,
                "fingerPrint": values.fingerPrint,
                "phone": values.phone,
                "role": values.role
            } as any;

            const response = await axios.post(REGISTER, postData);

            if (response.status === 200 && response.data) {
                loginStore.loginOrRegister(response.data.token)
                setTimeout(() => {
                    router.replace("/")
                }, 200)
            }

        } catch (E) {
            console.log(E)
        }
        // Submit data to server here
    };

    const Username = (
        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <FormLabel className="w-72 text-lg font-extrabold text-foreground">Username</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Enter your username" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const Password = (
        <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <FormLabel className="w-72 text-lg font-extrabold text-foreground">Password</FormLabel>
                    <FormControl>
                        <Input {...field} type="password" placeholder="Enter your password" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const Email = (
        <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <FormLabel className="w-72 text-lg font-extrabold text-foreground">Email</FormLabel>
                    <FormControl>
                        <Input {...field} type="email" placeholder="Enter your email" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const Fingerprint = (
        <FormField
            control={form.control}
            name="fingerPrint"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <FormLabel className="w-72 text-lg font-extrabold text-foreground">Fingerprint</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Enter fingerprint data" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    const Phone = (
        <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <FormLabel className="w-72 text-lg font-extrabold text-foreground">Phone Number</FormLabel>
                    <FormControl>
                        <Input {...field} placeholder="Enter your phone number" />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex justify-center items-center h-screen bg-slate-600 p-4">
                <div className="w-full max-w-md">
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}
                            onReset={() => form.reset()} className="bg-white shadow-xl rounded px-8 pt-6 pb-8 mb-4">
                            <div className="mb-4 text-center">
                                <h2 className="text-2xl font-bold mt-4">Create Your Account</h2>
                            </div>
                            {Username}
                            {Password}
                            {Email}
                            {Fingerprint}
                            {Phone}
                            <input {...form.register("role")} type="hidden" value="USER" />
                            <div className="flex items-center justify-between mt-8 gap-4">
                                <Button type="submit" variant='default' color="primary" className="w-full py-2">
                                    Sign Up
                                </Button>
                                <Button type="reset" variant="ghost" color="primary" className="w-full py-2" >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </Form>
                    <p className="text-center text-gray-500 text-xs">
                        &copy;2024 My Restaurant. All rights reserved.
                    </p>
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default CreateAccountPage;
