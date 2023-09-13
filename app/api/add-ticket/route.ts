import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(req: any, res: any) { 
    const data = await req.json()

    const sql = `insert into reserved_tickets (ticket_id, name, phone, gender, with_bus, department, agent) values ($1, $2, $3, $4, $5, $6, $7) returning *`
    
    try {
        const ticket = await db.oneOrNone(sql, [data.ticket_id, data.name, data.phone, data.gender, data.with_bus, data.department, data.agent]);
        return NextResponse.json(ticket, { status: 201 })
    } catch (err: any) {
        if (err.code === '23505' && err.constraint === 'reserved_tickets_ticket_id_key') {
            const ticketWithAgent = await db.oneOrNone(`select rt.id, rt.ticket_id, rt.name, rt.phone, rt.gender, rt.department, rt.with_bus, rt.is_sms_sent, json_build_object('id', users.id, 'name', users.name) as agent from reserved_tickets rt join users on users.id = rt.agent limit 1`)
            return NextResponse.json({ ticket_id: `Ticket ID Is already reserved by ${ticketWithAgent.agent.name}` }, { status: 500 });
        } else {
            return NextResponse.json({message: "error", err}, { status: 500 })
        }
    }
}