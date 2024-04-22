"use client";

import { Button } from '@/components/ui/button';
import { loginSchema } from '@/schemas/loginSchema';
import { z } from 'zod';
import React, { useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input } from '@/components/ui/input';
import { Navbar } from '@/components/Navbar';
import { useLoginStore } from '../store/loginStore';
import axios from 'axios';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { defaultEmail, defaultFingerprint, defaultPassword, defaultUsername } from '@/schemas/accountSchema';
import { LOGIN } from '@/utils/Api';
import { useRouter } from 'next/router';
import { Footer } from '@/components/Footer';

interface loginProps {

}

const login: React.FC<loginProps> = ({ }) => {
    type LoginFormInputs = z.infer<typeof loginSchema>;
    const loginStore = useLoginStore();
    const [loginMethod, setLoginMethod] = useState<'username' | 'email' | 'biometric'>('username');
    const router = useRouter();
    const form = useForm<z.infer<typeof loginSchema>>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            username: "",
            password: "",
            userInput: "username-password",
            email: defaultEmail,
            fingerPrint: defaultFingerprint
        },
    });


    const onSubmit = async (values: z.infer<typeof loginSchema>) => {

        const postData = {
        } as any;
        switch (values.userInput) {
            case "biometric":
                postData["userInput"] = "biometric"
                postData["username"] = values.username
                postData["fingerPrint"] = values.fingerPrint
                break;
            case "email-password":
                postData["userInput"] = "email-password"
                postData["email"] = values.email
                postData["password"] = values.password
                break;
            case "username-password":
                postData["userInput"] = "username-password"
                postData["username"] = values.username
                postData["password"] = values.password
                break;
        }

        const response = await axios.post(LOGIN, postData)
        if (response.status === 200 && response.data) {
            loginStore.loginOrRegister(response.data.token)
            router.push("/")
        }

        // After submission, you would typically do some processing here, like calling an API
    };
    const UserName = (
        <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
                <FormItem className="flex-col items-center justify-center pb-4">
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-lg font-extrabold text-foreground">
                            User Name
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="LuSuarez2"
                            {...field}
                            onChange={(e) => {
                                field.onChange(e.target.value);
                            }}
                        />
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
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-lg font-extrabold text-foreground">
                            Password
                        </FormLabel>
                    </div>
                    <FormControl>
                        {/* <LockClosedIcon className="h-5 w-5 text-gray-500 mr-2" /> */}
                        <Input
                            placeholder="LuSuarez2"
                            {...field}
                            type="password"
                            onChange={(e) => {
                                field.onChange(e.target.value);
                            }}
                        />
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
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-lg font-extrabold text-foreground">
                            Email Address
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="example@domain.com"
                            {...field}
                            type="email"
                            onChange={(e) => {
                                field.onChange(e.target.value);
                            }}
                        />
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
                    <div className="flex flex-col">
                        <FormLabel className="w-72 text-lg font-extrabold text-foreground">
                            Fingerprint Data
                        </FormLabel>
                    </div>
                    <FormControl>
                        <Input
                            placeholder="Enter fingerprint data"
                            {...field}
                            onChange={(e) => {
                                field.onChange(e.target.value);
                            }}
                        />
                    </FormControl>
                    <FormMessage />
                </FormItem>
            )}
        />
    );

    console.log()
    return (
        <div className="flex flex-col min-h-screen">
            <Navbar />
            <div className="flex flex-col justify-center items-center flex-1 bg-slate-600 p-4">

                <div className="w-full max-w-md">
                    <div className="mb-6 text-center">
                        <div className="flex justify-center gap-4 mt-4">
                            <Button onClick={() => {
                                setLoginMethod('username')
                                form.setValue("username", "");
                                form.setValue('password', "");
                                form.setValue('email', defaultEmail);
                                form.setValue("fingerPrint", defaultFingerprint);
                                form.setValue('userInput', "username-password");
                            }} variant={loginMethod === 'username' ? 'default' : 'ghost'}>Username</Button>
                            <Button onClick={() => {
                                setLoginMethod('email')
                                form.setValue('password', "");
                                form.setValue('email', "");
                                form.setValue("username", defaultUsername);
                                form.setValue("fingerPrint", defaultFingerprint);
                                form.setValue('userInput', "email-password");
                            }} variant={loginMethod === 'email' ? 'default' : 'ghost'}>Email</Button>
                            <Button onClick={() => {
                                setLoginMethod('biometric')
                                form.setValue("username", "");
                                form.setValue("fingerPrint", "");
                                form.setValue('password', defaultPassword);
                                form.setValue('email', defaultEmail);
                                form.setValue('userInput', "biometric");

                            }} variant={loginMethod === 'biometric' ? 'default' : 'ghost'}>Biometric</Button>
                        </div>
                    </div>
                    <Form {...form}>
                        <form
                            onSubmit={form.handleSubmit(onSubmit)}
                            onReset={() => form.reset()}
                            className="bg-white shadow-xl rounded px-8 pt-6 pb-8">
                            {loginMethod === 'username' && (
                                <>
                                    {UserName}
                                    {Password}
                                </>
                            )}

                            {loginMethod === 'email' && (
                                <>
                                    {Email}
                                    {Password}                                </>
                            )}

                            {loginMethod === 'biometric' && (
                                <>
                                    {UserName}
                                    {Fingerprint}
                                </>

                            )}

                            <div className="flex items-center justify-between mt-8 gap-5">
                                <Button type="submit" color="primary" className="w-full py-2"  >
                                    Login
                                </Button>
                                <Button type="reset" color="primary" className="w-full py-2"  >
                                    Reset
                                </Button>
                            </div>
                        </form>
                    </Form>


                </div>
            </div >
            <Footer />
        </div >

    );
}

export default login