/* eslint-disable @next/next/no-img-element */
'use client';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { Button } from 'primereact/button';
import { Column } from 'primereact/column';
import { DataTable } from 'primereact/datatable';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { RadioButton } from 'primereact/radiobutton';
import { Toast } from 'primereact/toast';
import { Toolbar } from 'primereact/toolbar';
import React, { useEffect, useRef, useState } from 'react';
import { Controller, useForm } from 'react-hook-form';

interface Ticket {
    ticket_id: string;
    gender: 'male' | 'female';
    with_bus: string;
    department: 'primary' | 'middle' | 'high' | 'rover_candidates' | 'scout' | 'vip' | 'normal';
    phone: string;
    name: string;
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

const TicketPage = () => {
    let emptyTicket: Ticket = {
        name: '',
        ticket_id: '1',
        phone: '',
        gender: 'male',
        department: 'normal',
        with_bus: 'false'
    };

    const user = localStorage.getItem('user');
    const userJson = JSON.parse(user || '');

    const router = useRouter();

    const { control, reset: resetForm, handleSubmit, watch, setValue, setError, getValues } = useForm<Ticket>({ defaultValues: emptyTicket });

    const onAddTicket = (values: Ticket) => {
        const user = localStorage.getItem('user');
        if (!user) return router.push('/auth/login');

        const userData = JSON.parse(user || '');
        axios
            .post('/api/add-ticket', { ...values, with_bus: values.with_bus === 'false' ? false : true, agent: userData.id })
            .then((res) => {
                fetchTickets();
                toast.current?.show({
                    severity: 'success',
                    summary: 'Successful',
                    detail: 'TIcket Created',
                    life: 3000
                });
                setTicketDialog(false);
                resetForm();
            })
            .catch((err: any) => {
                console.log(err.response.data.ticket_id);
                alert(err.response.data.ticket_id);
                setError('ticket_id', err.response.data.ticket_id);
            });
    };

    const onEditTicket = (values: Ticket) => {
        const user = localStorage.getItem('user');
        if (!user) return router.push('/auth/login');

        const userData = JSON.parse(user || '');
        axios.post('/api/edit-ticket', { ...values, with_bus: values.with_bus === 'false' ? false : true, agent: userData.id }).then((res) => {
            fetchTickets();
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'TIcket Edited',
                life: 3000
            });
            setTicketEditDialog(false);
            resetForm();
        });
    };

    const [ticketDialog, setTicketDialog] = useState(false);
    const [ticketEditDialog, setTicketEditDialog] = useState(false);
    const [tickets, setTickets] = useState([]);
    const [info, setInfo] = useState<any>([]);
    const [globalFilter, setGlobalFilter] = useState('');
    const toast = useRef<Toast>(null);
    const dt = useRef<DataTable<any>>(null);

    const fetchTickets = () => {
        const user = localStorage.getItem('user') || '';
        const userJson = JSON.parse(user);
        axios.post('/api/tickets', { user_id: userJson.role === 'agent' ? userJson.id : 0 }).then((res) => {
            setTickets(res.data);
        });
        axios.post(`/api/info`, { user_id: userJson.role === 'agent' ? userJson.id : 0 }).then((res) => {
            setInfo(res.data);
        });
    };

    useEffect(() => {
        fetchTickets();
    }, []);

    const openNew = () => {
        resetForm();
        setTicketDialog(true);
    };

    const hideDialog = () => {
        setTicketDialog(false);
    };

    const hideEditDialog = () => {
        setTicketEditDialog(false);
    };

    const editTicket = (ticket: any) => {
        resetForm();
        setValue('department', ticket.department);
        setValue('gender', ticket.gender);
        setValue('name', ticket.name);
        setValue('phone', ticket.phone);
        setValue('ticket_id', ticket.ticket_id, { shouldValidate: true, shouldDirty: true, shouldTouch: true });
        setValue('with_bus', String(ticket.with_bus));
        setTicketEditDialog(true);
    };

    const deleteTicket = (id: string) => {
        axios.post(`/api/delete-ticket`, { ticket_id: id }).then((res) => {
            fetchTickets();
            toast.current?.show({
                severity: 'success',
                summary: 'Successful',
                detail: 'Ticket Deleted',
                life: 3000
            });
        });
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="New" icon="pi pi-plus" severity="success" className=" mr-2" onClick={openNew} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData: Ticket) => {
        return (
            <>
                <Button icon="pi pi-pencil" rounded severity="success" className="mr-2" onClick={() => editTicket(rowData)} />
                <Button icon="pi pi-trash" rounded severity="warning" onClick={() => deleteTicket(rowData.ticket_id)} />
            </>
        );
    };

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Manage Tickets</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.currentTarget.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const ticketDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" text onClick={handleSubmit(onAddTicket)} />
        </>
    );

    const ticketEditDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" text onClick={hideEditDialog} />
            <Button label="Edit" icon="pi pi-check" text onClick={handleSubmit(onEditTicket)} />
        </>
    );

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>
                    {userJson.role !== 'agent' && <h2>Agents</h2>}
                    {info?.agents?.map((person: any) => (
                        <div style={{ display: 'inline' }} key={person.agent}>
                            <span>{person.agent}: </span>
                            <span style={{ fontWeight: 'bold' }}>{person.count} Tickets</span>
                            <br />
                        </div>
                    ))}

                    {userJson.role !== 'agent' && <h2>Departments</h2>}
                    {info?.departments?.map((person: any) => (
                        <div style={{ display: 'inline' }} key={person.department}>
                            <span>{person.agent}: </span>
                            <span style={{ fontWeight: 'bold' }}>{person.count} Tickets</span>
                            <br />
                        </div>
                    ))}

                    {userJson.role === 'agent' && <p>Tickets Count: {tickets.length} ticket</p>}

                    {userJson.role !== 'agent' && (
                        <>
                            <p>
                                Full Tickets Count: <span style={{ fontWeight: 'bold' }}>{info?.full?.ticket_count}</span> ticket
                            </p>
                            <p>
                                With Bus Tickets Count: <span style={{ fontWeight: 'bold' }}>{info?.bus?.bus_count}</span> ticket
                            </p>
                        </>
                    )}

                    <br />
                    <br />

                    <DataTable ref={dt} value={tickets} dataKey="id" className="datatable-responsive" globalFilter={globalFilter} emptyMessage="No Tickets found." header={header}>
                        <Column field="ticket_id" header="Ticket ID" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="name" header="Name" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="department" header="Department" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="with_bus" header="With Bus?" headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="is_sms_sent" header="SMS sent?" headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="agent.name" header="Agent" sortable headerStyle={{ minWidth: '10rem' }}></Column>
                        <Column field="gender" header="Gender" headerStyle={{ minWidth: '10rem' }}></Column>
                        {userJson.role !== 'viewer' && <Column body={actionBodyTemplate} headerStyle={{ minWidth: '10rem' }}></Column>}
                    </DataTable>

                    <Dialog visible={ticketDialog} style={{ width: '450px' }} header="Ticket Details" modal className="p-fluid" footer={ticketDialogFooter} onHide={hideDialog}>
                        <form onSubmit={handleSubmit(onAddTicket)}>
                            <div className="field">
                                <Controller
                                    name="ticket_id"
                                    control={control}
                                    rules={{ required: 'Ticket ID is required.' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor="ticket_id">Ticket ID:</label>
                                            <InputText type="text" inputMode="numeric" id="ticket_id" value={String(field.value)} onChange={(e) => field.onChange(e.target.value)} />
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>
                            <div className="field">
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Name is required' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor="name">Name:</label>
                                            <InputText value={field.value} onChange={(e) => field.onChange(e.target.value)} required />
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="field">
                                <Controller
                                    name="department"
                                    control={control}
                                    rules={{ required: 'Department is required' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label className="mb-3">Category</label>
                                            <div className="formgrid grid">
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category1" {...field} value="primary" inputRef={field.ref} checked={field.value === 'primary'} />
                                                    <label htmlFor="category1">أبتدائي</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category2" {...field} value="middle" inputRef={field.ref} checked={field.value === 'middle'} />
                                                    <label htmlFor="category2">اعدادي</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category3" {...field} value="high" inputRef={field.ref} checked={field.value === 'high'} />
                                                    <label htmlFor="category3">ثانوي</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category4" {...field} value="rover_candidates" inputRef={field.ref} checked={field.value === 'rover_candidates'} />
                                                    <label htmlFor="category4">جوالة</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category5" {...field} value="scout" inputRef={field.ref} checked={field.value === 'scout'} />
                                                    <label htmlFor="category5">قادة</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category6" {...field} value="normal" inputRef={field.ref} checked={field.value === 'normal'} />
                                                    <label htmlFor="category6">عامة</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category7" {...field} value="vip" inputRef={field.ref} checked={field.value === 'vip'} />
                                                    <label htmlFor="category7">VIP</label>
                                                </div>
                                            </div>
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="field">
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{ required: 'Phone is required' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor="name">Phone:</label>
                                            <InputText value={field.value} onChange={(e) => field.onChange(e.target.value)} required />
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="field">
                                <Controller
                                    name="gender"
                                    control={control}
                                    rules={{ required: 'Gender is required' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label className="mb-3">Gender:</label>
                                            <div className="formgrid grid">
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category1" {...field} value="male" inputRef={field.ref} checked={field.value === 'male'} />
                                                    <label htmlFor="category1">ذكر</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category2" {...field} value="female" inputRef={field.ref} checked={field.value === 'female'} />
                                                    <label htmlFor="category2">انثي</label>
                                                </div>
                                            </div>
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="field">
                                <Controller
                                    name="with_bus"
                                    control={control}
                                    rules={{ required: 'With Bus is required' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label className="mb-3">With Bus?:</label>
                                            <div className="formgrid grid">
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category1" {...field} value="true" inputRef={field.ref} checked={field.value === 'true'} />
                                                    <label htmlFor="category1">نعم</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category2" {...field} value="false" inputRef={field.ref} checked={field.value === 'false'} />
                                                    <label htmlFor="category2">لا</label>
                                                </div>
                                            </div>
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>
                        </form>
                    </Dialog>

                    <Dialog visible={ticketEditDialog} style={{ width: '450px' }} header="Edit Ticket Details" modal className="p-fluid" footer={ticketEditDialogFooter} onHide={hideEditDialog}>
                        <form onSubmit={handleSubmit(onEditTicket)}>
                            <div className="field">
                                <Controller
                                    name="ticket_id"
                                    control={control}
                                    rules={{ required: 'Ticket ID is required.' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor="ticket_id">Ticket ID:</label>
                                            <InputText disabled type="text" inputMode="numeric" id="ticket_id" value={String(field.value)} onChange={(e) => field.onChange(e.target.value)} />
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>
                            <div className="field">
                                <Controller
                                    name="name"
                                    control={control}
                                    rules={{ required: 'Name is required' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor="name">Name:</label>
                                            <InputText value={field.value} onChange={(e) => field.onChange(e.target.value)} required />
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="field">
                                <Controller
                                    name="department"
                                    control={control}
                                    rules={{ required: 'Department is required' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label className="mb-3">Category</label>
                                            <div className="formgrid grid">
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category1" {...field} value="primary" inputRef={field.ref} checked={field.value === 'primary'} />
                                                    <label htmlFor="category1">أبتدائي</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category2" {...field} value="middle" inputRef={field.ref} checked={field.value === 'middle'} />
                                                    <label htmlFor="category2">اعدادي</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category3" {...field} value="high" inputRef={field.ref} checked={field.value === 'high'} />
                                                    <label htmlFor="category3">ثانوي</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category4" {...field} value="rover_candidates" inputRef={field.ref} checked={field.value === 'rover_candidates'} />
                                                    <label htmlFor="category4">جوالة</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category5" {...field} value="scout" inputRef={field.ref} checked={field.value === 'scout'} />
                                                    <label htmlFor="category5">قادة</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category6" {...field} value="normal" inputRef={field.ref} checked={field.value === 'normal'} />
                                                    <label htmlFor="category6">عامة</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category7" {...field} value="vip" inputRef={field.ref} checked={field.value === 'vip'} />
                                                    <label htmlFor="category7">VIP</label>
                                                </div>
                                            </div>
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="field">
                                <Controller
                                    name="phone"
                                    control={control}
                                    rules={{ required: 'Phone is required' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label htmlFor="name">Phone:</label>
                                            <InputText value={field.value} onChange={(e) => field.onChange(e.target.value)} required />
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="field">
                                <Controller
                                    name="gender"
                                    control={control}
                                    rules={{ required: 'Gender is required' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label className="mb-3">Gender:</label>
                                            <div className="formgrid grid">
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category1" {...field} value="male" inputRef={field.ref} checked={field.value === 'male'} />
                                                    <label htmlFor="category1">ذكر</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category2" {...field} value="female" inputRef={field.ref} checked={field.value === 'female'} />
                                                    <label htmlFor="category2">انثي</label>
                                                </div>
                                            </div>
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>

                            <div className="field">
                                <Controller
                                    name="with_bus"
                                    control={control}
                                    rules={{ required: 'With Bus is required' }}
                                    render={({ field, fieldState }) => (
                                        <>
                                            <label className="mb-3">With Bus?:</label>
                                            <div className="formgrid grid">
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category1" {...field} value="true" inputRef={field.ref} checked={field.value == 'true'} />
                                                    <label htmlFor="category1">نعم</label>
                                                </div>
                                                <div className="field-radiobutton col-6">
                                                    <RadioButton inputId="category2" {...field} value="false" inputRef={field.ref} checked={field.value == 'false'} />
                                                    <label htmlFor="category2">لا</label>
                                                </div>
                                            </div>
                                            <p className="text-red-500">{fieldState.error?.message}</p>
                                        </>
                                    )}
                                />
                            </div>
                        </form>
                    </Dialog>

                    {/* <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && (
                                <span>
                                    Are you sure you want to delete <b>{product.name}</b>?
                                </span>
                            )}
                        </div>
                    </Dialog> */}
                </div>
            </div>
        </div>
    );
};

export default TicketPage;
