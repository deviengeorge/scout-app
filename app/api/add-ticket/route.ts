import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(req: any, res: any) { 
    const data = await req.json()

    const sql = `insert into reserved_tickets (ticket_id, name, phone, gender, with_bus, department, agent) values ($1, $2, $3, $4, $5, $6, $7) returning *`
    
    const ticket = await db.oneOrNone(sql, [data.ticket_id, data.name, data.phone, data.gender, data.with_bus, data.department, data.agent]);
    return NextResponse.json(ticket, { status: 201 })
}