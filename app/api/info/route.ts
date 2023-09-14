import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(req: any, res: any) { 
    const data = await req.json()

    const sql = `select count(users.name), users.name as agent from reserved_tickets rt join users on users.id = rt.agent group by users.id`
    const sqlCounts = `select count(rt.department), rt.department as agent from reserved_tickets rt group by rt.department`
    const busCount = `select count(rt.with_bus) as bus_count from reserved_tickets rt where rt.with_bus = true`
    const fullCount = `select count(rt.ticket_id) as ticket_count from reserved_tickets rt`
    
    let tickets = [];
    let departmentsCounts = []
    let busCounts = null
    let fullCounts = null
    console.log(data)
    if (data.user_id === 0) {
        tickets = await db.manyOrNone(sql);
        departmentsCounts = await db.manyOrNone(sqlCounts);
        busCounts = await db.oneOrNone(busCount);
        fullCounts = await db.oneOrNone(fullCount);
    }
    return NextResponse.json({agents: tickets, departments: departmentsCounts, bus: busCounts, full : fullCounts}, { status: 200 })
}