"use server";
import { clearSession } from "@/lib/auth";
import { redirect } from "next/navigation";
export async function signOut() { await clearSession(); redirect("/login"); }
