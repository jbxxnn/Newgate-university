"use client";
import { useActionState } from "react";
import { signIn, type LoginState } from "./actions";
const initialState: LoginState = {};
export function LoginForm() { const [state, action, pending] = useActionState(signIn, initialState); return <form action={action} className="mt-7 space-y-4"><label className="block text-sm font-medium">University email<input required name="email" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="email" placeholder="name@newgate.edu.ng" /></label><label className="block text-sm font-medium">Password<input required name="password" className="mt-1 w-full rounded-lg border border-slate-300 px-3 py-2" type="password" /></label>{state.error && <p className="rounded bg-red-50 p-3 text-sm text-red-700">{state.error}</p>}<button className="w-full rounded-lg bg-slate-900 py-2.5 font-semibold text-white disabled:opacity-60" disabled={pending}>{pending ? "Signing in…" : "Sign in"}</button></form>; }
