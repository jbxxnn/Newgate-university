import Link from "next/link";
import { signOut } from "@/app/dashboard/actions";
import type { Session } from "@/lib/auth";

const items = [
  { href: "/dashboard", label: "Overview", permission: "dashboard.view" },
  { href: "/data-assets", label: "Data Assets", permission: "assets.view" },
  { href: "/access-requests", label: "Access Requests", permission: "access_requests.view" },
  { href: "/risks", label: "Risks", permission: "risks.view" },
  { href: "/compliance", label: "Compliance Controls", permission: "compliance.view" },
  { href: "/corrective-actions", label: "Corrective Actions", permission: "corrective_actions.manage" },
  { href: "/incidents", label: "Incidents", permission: "incidents.manage" },
  { href: "/data-subject-requests", label: "Data Requests", permission: "data_subject_requests.manage" },
  { href: "/users", label: "Users", permission: "users.view" },
  { href: "/roles", label: "Roles & Permissions", permission: "roles.view" },
  { href: "/departments", label: "Departments", permission: "users.manage" },
  { href: "/audit-logs", label: "Audit Logs", permission: "audit_logs.view" },
  { href: "/reports", label: "Reports", permission: "reports.view" },
];

export function AppShell({ session, children }: { session: Session | null; children: React.ReactNode }) {
  if (!session) return <>{children}</>;
  return <div className="flex min-h-screen bg-slate-100 text-slate-900"><aside className="sticky top-0 flex h-screen w-64 shrink-0 flex-col bg-slate-950 p-5 text-slate-200"><div><p className="text-xs font-semibold tracking-[0.18em] text-teal-400">NEWGATE UNIVERSITY</p><h1 className="mt-2 text-lg font-bold text-white">Governance Hub</h1><p className="mt-1 text-xs text-slate-400">Privacy & compliance</p></div><nav className="mt-8 space-y-1 overflow-y-auto">{items.filter((item) => session.permissions.includes(item.permission)).map((item) => <Link className="block rounded-lg px-3 py-2 text-sm transition hover:bg-slate-800 hover:text-white" href={item.href} key={item.href}>{item.label}</Link>)}</nav><div className="mt-auto border-t border-slate-800 pt-4"><p className="text-sm font-medium text-white">{session.name}</p><p className="mt-1 text-xs text-slate-400">Authorised staff session</p><form action={signOut}><button className="mt-3 text-sm text-slate-300 hover:text-white">Sign out</button></form></div></aside><main className="min-w-0 flex-1 p-8 lg:p-10">{children}</main></div>;
}
