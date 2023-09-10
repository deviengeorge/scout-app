/* eslint-disable @next/next/no-img-element */
'use client';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react';
import { Checkbox } from 'primereact/checkbox';
import { Button } from 'primereact/button';
import { Password } from 'primereact/password';
import { LayoutContext } from '../../../../layout/context/layoutcontext';
import { InputText } from 'primereact/inputtext';
import { classNames } from 'primereact/utils';
import { Controller, useForm } from 'react-hook-form';
import axios from 'axios';

interface Inputs {
    phone: string;
    password: string;
}

const LoginPage = () => {
    const { handleSubmit, control } = useForm<Inputs>();

    const { layoutConfig } = useContext(LayoutContext);

    const router = useRouter();
    const containerClassName = classNames('surface-ground flex align-items-center justify-content-center min-h-screen min-w-screen overflow-hidden', { 'p-input-filled': layoutConfig.inputStyle === 'filled' });

    const onSubmit = (values: Inputs) => {
        axios.post('/api/login', values).then((res) => {
            router.push('/');
            localStorage.setItem('user', JSON.stringify(res.data));
        });
    };

    return (
        <div className={containerClassName}>
            <div className="flex flex-column align-items-center justify-content-center">
                <img src={`/scout-logo.png`} alt="NourElAlam Scout logo" className="mb-5 w-25rem flex-shrink-0" />
                <div
                    style={{
                        borderRadius: '56px',
                        padding: '0.3rem',
                        background: 'linear-gradient(180deg, var(--primary-color) 10%, rgba(33, 150, 243, 0) 30%)'
                    }}
                >
                    <div className="w-full surface-card py-8 px-5 sm:px-8" style={{ borderRadius: '53px' }}>
                        <div className="text-center mb-5">
                            <div className="text-900 text-3xl font-medium mb-3">Welcome, Scout!</div>
                            <span className="text-600 font-medium">Sign in to continue</span>
                        </div>

                        <form onSubmit={handleSubmit(onSubmit)}>
                            <Controller
                                name="phone"
                                control={control}
                                rules={{ required: 'Phone is required.' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor="phone" className="block text-900 text-xl font-medium mb-2">
                                            Phone
                                        </label>
                                        <InputText value={field.value} onChange={(e) => field.onChange(e.target.value)} id="phone" type="text" placeholder="Phone" className="w-full md:w-30rem" style={{ padding: '1rem' }} />
                                        <p className="text-red-500">{fieldState.error?.message}</p>
                                    </>
                                )}
                            />

                            <Controller
                                name="password"
                                control={control}
                                rules={{ required: 'Password is required.' }}
                                render={({ field, fieldState }) => (
                                    <>
                                        <label htmlFor="password1" className="block text-900 font-medium text-xl mb-2">
                                            Password
                                        </label>
                                        <InputText id="password1" value={field.value} onChange={(e) => field.onChange(e.target.value)} placeholder="Password" className="w-full"></InputText>
                                        <p className="text-red-500">{fieldState.error?.message}</p>
                                    </>
                                )}
                            />

                            <Button label="Sign In" className="w-full p-3 text-xl" type="submit"></Button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
