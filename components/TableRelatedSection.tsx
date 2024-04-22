import React from 'react'
import { Tables } from './Tables';
import { Toaster } from './ui/toaster';

interface TableRelatedSectionProps {

}

export const TableRelatedSection: React.FC<TableRelatedSectionProps> = ({ }) => {
    return (
        <div className="flex flex-1 min-h-96 flex-col bg-slate-600 text-white">
            <Toaster />
            <Tables></Tables>
        </div>
    );
}