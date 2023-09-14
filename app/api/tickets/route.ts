import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(req: any, res: any) { 
    const data = await req.json()

    const sql = `select rt.id, rt.ticket_id, rt.name, rt.phone, rt.gender, rt.department, rt.with_bus, rt.is_sms_sent, json_build_object('id', users.id, 'name', users.name) as agent from reserved_tickets rt join users on users.id = rt.agent`
    
    let tickets = [];
    console.log(data)
    if (data.user_id === 0) {
        tickets = await db.manyOrNone(sql);
    } else {
        tickets = await db.manyOrNone(`select rt.id, rt.ticket_id, rt.name, rt.phone, rt.gender, rt.department, rt.with_bus, rt.is_sms_sent, json_build_object('id', users.id, 'name', users.name) as agent from reserved_tickets rt join users on users.id = rt.agent where agent = $1`, [data.user_id]);
    }
    return NextResponse.json(tickets, { status: 200 })
}