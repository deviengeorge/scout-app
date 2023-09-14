/* eslint-disable @next/next/no-img-element */
'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';
import { Toast } from 'primereact/toast';
import React, { useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface TicketSearchForm {
    ticket_id: string;
}

const departments = {
    primary: 'ابتدائي',
    middle: 'اعدادي',
    high: 'ثانوي',
    rover_candidates: 'جوالة',
    scout: 'قادة',
    normal: 'عامة',
    vip: 'VIP'
};

interface Ticket {
    ticket_id: string;
    gender: 'male' | 'female';
    with_bus: string;
    department: 'primary' | 'middle' | 'high' | 'rover_candidates' | 'scout' | 'vip' | 'normal';
    phone: string;
    name: string;
    agent: { id: number; name: string };
    attendance_status: boolean;
    attended_at: Date;
}

const TicketPage = () => {
    const router = useRouter();

    const { control, reset: resetForm, handleSubmit, watch, setValue, setError, getValues } = useForm<TicketSearchForm>({ defaultValues: { ticket_id: '1' } });

    const [ticket, setTicket] = useState<Ticket | null>(null);

    const toast = useRef<Toast>(null);

    const onSubmit = (values: TicketSearchForm) => {
        const user = localStorage.getItem('user') || '';
        const userJson = JSON.parse(user);
        axios.post('/api/ticket', { user_id: userJson.role === 'agent' ? userJson.id : 0, ...values }).then((res) => {
            if (res.data !== null) {
                setTicket(res.data);
            } else {
                toast.current?.show({
                    severity: 'error',
                    summary: 'Fail',
                    detail: 'Not Found',
                    life: 3000
                });
            }
        });
    };

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />

                    <div>
                        <form onSubmit={handleSubmit(onSubmit)}>
                            <div className="field">
                                <Controller
                                    name="ticket_id"
                                    control={control}
                                    rules={{ required: 'Ticket ID is required.' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor="ticket_id">Ticket ID:</label>
                                            <br />
                                            <InputText style={{ width: '100%' }} type="text" inputMode="numeric" id="ticket_id" value={String(field.value)} onChange={(e) => field.onChange(e.target.value)} />
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>
                            <Button label="Search" type="submit" />
                        </form>
                    </div>

                    <br />

                    {/* Ticket Info */}
                    {ticket !== null ? (
                        <>
                            <h2 style={{ fontWeight: 'bold' }}>Ticket Info</h2>
                            <div style={{ border: '1px solid black', borderRadius: '15px', padding: '20px' }}>
                                <h3 style={{ fontSize: '14px', fontStyle: 'italic', margin: 0 }}>#{ticket.ticket_id}</h3>
                                <h2 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0 }}>{ticket.name}</h2>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ fontSize: '16px', margin: 0 }}>{departments[ticket.department]}</p>
                                    <p style={{ fontSize: '14px', fontWeight: 'bold' }}>{ticket.gender === 'male' ? 'ذكر' : 'أنثي'}</p>
                                </div>

                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <p style={{ fontSize: '18px', margin: 0 }}>By {ticket.agent.name}</p>
                                </div>

                                <p style={{ fontSize: '18px', margin: 0 }}>Attendance Status: {ticket.attendance_status ? 'Attended' : 'Not Yet'}</p>

                                <br />

                                {!ticket.attendance_status ? (
                                    <Button
                                        label="Attend"
                                        type="button"
                                        onClick={() => {
                                            axios.post(`/api/attend`, { ticket_id: ticket?.ticket_id }).then((res) => {
                                                toast.current?.show({
                                                    severity: 'success',
                                                    summary: 'Successful',
                                                    detail: 'Attended',
                                                    life: 3000
                                                });
                                                resetForm();
                                                setTicket(null);
                                            });
                                        }}
                                    />
                                ) : (
                                    <Button
                                        label="De-Attend"
                                        severity="danger"
                                        type="button"
                                        onClick={() => {
                                            axios.post(`/api/de-attend`, { ticket_id: ticket?.ticket_id }).then((res) => {
                                                toast.current?.show({
                                                    severity: 'success',
                                                    summary: 'Successful',
                                                    detail: 'De-Attended',
                                                    life: 3000
                                                });
                                                resetForm();
                                                setTicket(null);
                                            });
                                        }}
                                    />
                                )}
                            </div>
                        </>
                    ) : null}
                </div>
            </div>
        </div>
    );
};

export default TicketPage;
