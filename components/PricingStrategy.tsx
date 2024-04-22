import React from 'react'
import { Menubar, MenubarContent, MenubarItem, MenubarMenu, MenubarSeparator, MenubarShortcut, MenubarTrigger } from './ui/menubar'
import { CandlestickChart } from 'lucide-react';
import { useStrategy } from '@/store/pricingStrategyStore';
import { Tstrategy } from '@/utils/interfaces';
import axios from 'axios';
import { UPDATE_PRICING_STRATEGY } from '@/utils/Api';
import { useLoginStore } from '@/store/loginStore';
import { useRouter } from 'next/router';

interface PricingStrategyProps {

}

export const PricingStrategy: React.FC<PricingStrategyProps> = ({ }) => {
    const pricingStrategy = useStrategy();
    const loginStore = useLoginStore();
    const router = useRouter();
    const setPricingStrategy = async (strategy: Tstrategy) => {
        try {
            const postData = {
                "strategy": strategy
            }
            const config = {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${loginStore.token}` // Authorization header
                }
            };
            const response = await axios.post(UPDATE_PRICING_STRATEGY, postData, config);
            if (response.status === 200) {
                pricingStrategy.setStrategy(strategy);
                router.reload()
            }

        } catch (e) {
            console.log(e)
        }
    }

    return (
        <Menubar className="text-blue-600 hover:text-blue-700  py-2 rounded-md text-sm font-medium w-14  bg-primary border-primary ">
            <MenubarMenu >
                <MenubarTrigger
                    className=' w-10 focus:bg-slate-700  data-[state=open]:bg-slate-700'
                >
                    <CandlestickChart />
                </MenubarTrigger>
                <MenubarContent className=' min-w-20 bg-slate-900 border-slate-700'>
                    <MenubarItem className='  bg-slate-900 focus:bg-slate-700  data-[state=open]:bg-slate-700 text-white focus:text-white ' onClick={() => {
                        setPricingStrategy("regular")
                    }}>
                        Regular
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem className=' bg-slate-900 focus:bg-slate-700  data-[state=open]:bg-slate-700 text-white focus:text-white' onClick={() => {
                        setPricingStrategy("happyhour");
                    }}>
                        Happy hour
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem className='  bg-slate-900 focus:bg-slate-700  data-[state=open]:bg-slate-700 text-white focus:text-white' onClick={() => {
                        setPricingStrategy("peakhour");
                    }}>
                        Peak Hours
                    </MenubarItem>
                </MenubarContent>
            </MenubarMenu>
        </Menubar >
    );
}