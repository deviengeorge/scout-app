import database from 'pg-promise';

const pgp = database({
    noWarnings: true
});

const db = pgp(process.env.DB_URL as string);
export default db;