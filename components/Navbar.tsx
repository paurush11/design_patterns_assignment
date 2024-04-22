import { useLoginStore } from '@/store/loginStore';
import Link from 'next/link';
import React, { useEffect, useState } from 'react'
import { Button } from './ui/button';
import { PricingStrategy } from './PricingStrategy';
import { RESTAURANT_NAME } from '@/utils/constants';
import { LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavbarProps {

}

export const Navbar: React.FC<NavbarProps> = ({ }) => {
    const loginStore = useLoginStore()
    const [hasMounted, setHasMounted] = useState(false);

    useEffect(() => {
        // When the component mounts, set hasMounted to true
        setHasMounted(true);
    }, []);
    return (
        <header className={cn("py-0 bg-slate-900 shadow-md", !loginStore.isLoggedIn && 'py-4')} >
            <div className="max-w-6xl mx-auto px-2 flex justify-between items-center">
                <h1 className="text-3xl font-bold text-white">
                    <Link href="/">
                        {RESTAURANT_NAME}
                    </Link>
                </h1>
                {hasMounted && <nav className=' '>
                    {loginStore.isLoggedIn && <Link href="/" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                        <div className="flex space-x-4">

                            <PricingStrategy />
                            <Link href="/Cart" >
                                <Button className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                                    Cart
                                </Button>
                            </Link>
                            <Link href="/Kitchen" >
                                <Button className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                                    Kitchen
                                </Button>
                            </Link>
                            <Button onClick={() => loginStore.logout()} variant={"default"} >
                                <LogOut className='w-4 h-4 text-blue-600 hover:text-blue-700' />
                            </Button>
                        </div>

                    </Link>}


                    {!loginStore.isLoggedIn && <div className="flex">
                        <Link href="/login" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                            Login
                        </Link>
                        <Link href="/CreateAccountPage" className="text-blue-600 hover:text-blue-700 px-3 py-2 rounded-md text-sm font-medium">
                            Create Account
                        </Link>
                    </div>}



                </nav>}
            </div>
        </header>
    );
}