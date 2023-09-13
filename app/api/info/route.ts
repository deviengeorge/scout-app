import { NextResponse } from "next/server";
import db from "../../../lib/db";

export async function POST(req: any, res: any) { 
    const data = await req.json()

    const sql = `select count(users.name), users.name as agent from reserved_tickets rt join users on users.id = rt.agent group by users.id`
    const sqlCounts = `select count(rt.department), rt.department as agent from reserved_tickets rt group by rt.department`
    
    let tickets = [];
    let departmentsCounts = []
    console.log(data)
    if (data.user_id === 0) {
        tickets = await db.manyOrNone(sql);
        departmentsCounts = await db.manyOrNone(sqlCounts);
    }
    return NextResponse.json({agents: tickets, departments: departmentsCounts}, { status: 200 })
}