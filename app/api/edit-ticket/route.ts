import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(req: any, res: any) { 
    const data = await req.json()

    const sql = `update reserved_tickets set name=$2, phone=$3, gender=$4, with_bus=$5, department=$6, agent=$7 where ticket_id=$1 returning *`
    
    const ticket = await db.oneOrNone(sql, [data.ticket_id, data.name, data.phone, data.gender, data.with_bus, data.department, data.agent]);
    return NextResponse.json(ticket, { status: 201 })
}