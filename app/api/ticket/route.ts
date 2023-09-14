import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: any, res: any) {
    const data = await req.json();
    try {
        const ticket = await db.oneOrNone("select rt.id, rt.ticket_id, rt.attendance_status, rt.attended_at, rt.name, rt.phone, rt.gender, rt.department, rt.with_bus, rt.is_sms_sent, json_build_object('id', users.id, 'name', users.name) as agent from reserved_tickets rt join users on users.id = rt.agent where ticket_id = $1 limit 1", [data.ticket_id]);
        
        return NextResponse.json(ticket, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}
