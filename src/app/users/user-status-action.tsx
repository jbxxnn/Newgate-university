"use client";
import { setAccountStatus } from "../administration/actions";
export function UserStatusAction({ id, status }: { id: string; status: string }) { const next = status === "ACTIVE" ? "SUSPENDED" : "ACTIVE"; return <form action={setAccountStatus.bind(null, id, next)}><button className="text-sm text-teal-700 hover:underline">{next === "ACTIVE" ? "Activate" : "Suspend"}</button></form>; }
