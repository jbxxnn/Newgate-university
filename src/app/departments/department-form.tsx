"use client";
import { useActionState } from "react";
import { createDepartment, type AdminState } from "../administration/actions";
const initial: AdminState = {};
export function DepartmentForm() { const [state, action, pending] = useActionState(createDepartment, initial); return <form action={action} className="mt-7 flex flex-wrap gap-3 rounded-xl border border-slate-200 bg-white p-5"><input className="rounded border p-2" name="name" placeholder="Department name" required /><input className="rounded border p-2" name="code" placeholder="Code e.g. REG" required />{state.error && <p className="self-center text-sm text-red-700">{state.error}</p>}{state.success && <p className="self-center text-sm text-teal-700">{state.success}</p>}<button disabled={pending} className="rounded bg-teal-700 px-4 py-2 font-semibold text-white disabled:opacity-60">Add department</button></form>; }
