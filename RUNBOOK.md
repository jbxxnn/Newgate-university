# Local Deployment and Recovery Runbook

## Start locally

1. Start Docker Desktop.
2. Start the database: `docker start newgate-governance-postgres`.
3. Confirm `.env.local` has the local PostgreSQL URL and a non-production session secret.
4. Apply schema and seed: `npm run db:migrate` followed by `npx prisma db seed` (export `DATABASE_URL` first if Prisma cannot read `.env.local`).
5. Run: `npm run dev`.

## Backup and recovery

Create a backup before migrations or evaluation changes:

`pg_dump postgresql://newgate:newgate_local_dev_password@localhost:5434/newgate_governance > newgate-backup.sql`

Restore only to the intended local development database:

`psql postgresql://newgate:newgate_local_dev_password@localhost:5434/newgate_governance < newgate-backup.sql`

For deployment, use a managed PostgreSQL database, separate production secrets, TLS, restricted database credentials, and controlled evidence storage. Do not use synthetic/demo passwords or a local connection string in production.
