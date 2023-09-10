import { Metadata } from 'next';
import AppConfig from '../../../layout/AppConfig';
import React from 'react';

interface SimpleLayoutProps {
    children: React.ReactNode;
}
export const metadata: Metadata = {
    title: 'Nour ElAlam Website',
    description: 'Nour ElAlam Scouts Website.',
    robots: { index: false, follow: false },
    viewport: { initialScale: 1, width: 'device-width' },
    openGraph: {
        type: 'website',
        title: 'Nour ElAlam Website',
        url: 'https://nour-elalam-scout.vercel.app/',
        description: 'Nour ElAlam Scouts Website.',
        images: ['https://nour-elalam-scout.vercel.app/scout-logo.png'],
        ttl: 604800
    },
    icons: {
        icon: '/favicon.ico'
    }
};

export default function SimpleLayout({ children }: SimpleLayoutProps) {
    return (
        <React.Fragment>
            {children}
            <AppConfig simple />
        </React.Fragment>
    );
}
