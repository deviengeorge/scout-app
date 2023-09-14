import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(req: any, res: any) { 
    const data = await req.json()

    const sql = `delete from reserved_tickets where ticket_id=$1`
    
    const ticket = await db.oneOrNone(sql, [data.ticket_id]);
    return NextResponse.json(ticket, { status: 200 })
}