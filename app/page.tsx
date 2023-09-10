/* eslint-disable @next/next/no-img-element */
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

const MainPage = () => {
    const router = useRouter();
    useEffect(() => {
        setTimeout(() => {
            router.push('/auth/login');
        }, 2000);
    });
    return (
        <div style={{ height: '100vh', width: '100vw', overflow: 'hidden', backgroundColor: 'white', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
            <img src="/scout-logo.png" alt="" />
        </div>
    );
};

export default MainPage;
