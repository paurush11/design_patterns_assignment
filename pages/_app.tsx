import type { AppProps } from 'next/app'
import '../app/globals.css'
import { ToastProvider } from '@radix-ui/react-toast';
import { useToast } from '@/components/ui/use-toast';
import { useEffect } from 'react';

export default function App({ Component, pageProps }: AppProps) {



    return (
        <ToastProvider>
            <Component {...pageProps} />
        </ToastProvider>
    );
}