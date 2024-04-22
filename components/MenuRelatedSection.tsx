import React from 'react'
import { Menus } from './Menus';

interface MenuRelatedSectionProps {

}

export const MenuRelatedSection: React.FC<MenuRelatedSectionProps> = ({ }) => {
    return (
        <div className="flex flex-1 flex-col" style={{
            backgroundColor: "#a6b5de"
        }}>
            <Menus></Menus>
        </div>
    );
}