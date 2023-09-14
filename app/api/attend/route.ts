import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: any, res: any) {
    const data = await req.json();
    try {
        const ticket = await db.oneOrNone("update reserved_tickets set attendance_status = true, attended_at = CURRENT_TIMESTAMP where ticket_id = $1 returning *", [data.ticket_id]);
        
        return NextResponse.json(ticket, { status: 200 });
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}
