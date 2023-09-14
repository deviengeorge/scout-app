import { NextResponse } from 'next/server';
import db from '../../../lib/db';

export async function POST(req: any, res: any) {
    console.log(req.body);
    const data = await req.json();
    try {
        const user = await db.oneOrNone('select * from users where phone = $1 limit 1', [data.phone]);
        if (user.password === data.password) {
            return NextResponse.json(user, { status: 200 });
        } else {
            return NextResponse.json({ message: 'fail' }, { status: 403 });
        }
    } catch (error) {
        return NextResponse.json(error, { status: 500 });
    }
}
