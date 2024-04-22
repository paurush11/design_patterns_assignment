import { RESTAURANT_NAME } from '@/utils/constants';
import React from 'react'

interface FooterProps {

}

export const Footer: React.FC<FooterProps> = ({ }) => {
    return (
        <footer className=" shadow-md py-4" style={{
            backgroundColor: "#10172a"
        }}>
            <div className="max-w-6xl mx-auto px-5 text-center text-white">
                © {RESTAURANT_NAME} 2024. All Rights Reserved.
            </div>
        </footer>
    );
}