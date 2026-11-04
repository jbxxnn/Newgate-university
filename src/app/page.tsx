import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";

export default async function Home() {
  if (await getSession()) {
    redirect("/dashboard");
  }

  return <main className="flex flex-1 items-center justify-center bg-slate-950 px-6 text-slate-900"><section className="w-full max-w-xl rounded-2xl bg-white p-10 shadow-2xl"><p className="text-sm font-semibold tracking-[0.18em] text-teal-700">NEWGATE UNIVERSITY</p><h1 className="mt-3 text-3xl font-bold tracking-tight">Governance starts with accountable data.</h1><p className="mt-4 leading-7 text-slate-600">Internal Data Governance & Privacy Compliance Management System. Phase 0 establishes secure identity, permissions, auditability and the application foundation.</p><Link className="mt-8 inline-flex rounded-lg bg-teal-700 px-5 py-3 font-semibold text-white hover:bg-teal-800" href="/login">Go to sign in</Link></section></main>;
}
