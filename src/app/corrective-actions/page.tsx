import { db } from "@/lib/db";
import { requirePermission, requireSession } from "@/lib/auth";
import { createCorrectiveAction, submitActionCompletion, verifyAction } from "../privacy-operations/actions";

const statusStyle: Record<string, string> = { OPEN: "bg-slate-100 text-slate-700", IN_PROGRESS: "bg-blue-50 text-blue-700", AWAITING_VERIFICATION: "bg-amber-50 text-amber-800", REOPENED: "bg-rose-50 text-rose-700", CLOSED: "bg-emerald-50 text-emerald-700" };

export default async function CorrectiveActionsPage() {
  await requirePermission("corrective_actions.manage");
  const session = await requireSession();
  const [actions, findings, users] = await Promise.all([
    db.correctiveAction.findMany({ include: { assignedOfficer: true, finding: true }, orderBy: { dueDate: "asc" } }),
    db.finding.findMany({ where: { correctiveActions: { none: {} } } }),
    db.user.findMany({ where: { status: "ACTIVE" }, orderBy: { fullName: "asc" } }),
  ]);
  const attention = actions.filter((action) => action.status !== "CLOSED").length;
  return <>
    <div className="flex flex-wrap items-end justify-between gap-4">
      <div><p className="text-sm font-semibold tracking-[0.16em] text-teal-700">PRIVACY OPERATIONS</p><h2 className="mt-2 text-3xl font-bold tracking-tight">Corrective Actions</h2><p className="mt-2 max-w-2xl text-slate-600">Assign, evidence, independently verify and close remediation work arising from governance findings.</p></div>
      <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-900"><span className="font-bold text-lg">{attention}</span> actions require attention</div>
    </div>
    <details className="mt-8 rounded-xl border border-slate-200 bg-white shadow-sm" open={findings.length > 0}>
      <summary className="cursor-pointer px-5 py-4 font-semibold text-slate-900">Create corrective action <span className="ml-2 text-sm font-normal text-slate-500">from an open finding</span></summary>
      <form action={createCorrectiveAction} className="grid gap-4 border-t border-slate-100 p-5 md:grid-cols-2 xl:grid-cols-3">
        <label className="text-sm font-medium text-slate-700">Finding<select className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-teal-600" name="findingId" required><option value="">Select a finding</option>{findings.map((finding) => <option value={finding.id} key={finding.id}>{finding.findingNumber} — {finding.severity}</option>)}</select></label>
        <label className="text-sm font-medium text-slate-700">Assigned officer<select className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-teal-600" name="assignedOfficerId" required><option value="">Select an officer</option>{users.map((user) => <option value={user.id} key={user.id}>{user.fullName}</option>)}</select></label>
        <label className="text-sm font-medium text-slate-700">Priority<select className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2.5 outline-none focus:border-teal-600" name="priority" required><option value="">Select priority</option><option>Low</option><option>Medium</option><option>High</option><option>Critical</option></select></label>
        <label className="text-sm font-medium text-slate-700 md:col-span-2">Action title<input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-teal-600" name="title" placeholder="e.g. Remove excessive results access" required /></label>
        <label className="text-sm font-medium text-slate-700">Due date<input className="mt-1.5 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-teal-600" name="dueDate" type="date" required /></label>
        <label className="text-sm font-medium text-slate-700 xl:col-span-2">Required action<textarea className="mt-1.5 min-h-24 w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-teal-600" name="requiredAction" placeholder="Describe the required remediation and evidence." required /></label>
        <div className="flex items-end"><button className="w-full rounded-lg bg-teal-700 px-4 py-2.5 font-semibold text-white transition hover:bg-teal-800">Create action</button></div>
      </form>
    </details>
    <section className="mt-8 space-y-4">{actions.map((action) => <article className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm" key={action.id}>
      <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold tracking-wide text-teal-700">{action.actionNumber} · {action.finding.findingNumber}</p><h3 className="mt-1 text-lg font-semibold text-slate-900">{action.title}</h3><p className="mt-2 text-sm text-slate-600">Assigned to <span className="font-medium text-slate-800">{action.assignedOfficer.fullName}</span> · Due {action.dueDate.toLocaleDateString()}</p></div><span className={`rounded-full px-3 py-1.5 text-xs font-bold ${statusStyle[action.status] ?? "bg-slate-100 text-slate-700"}`}>{action.status.replaceAll("_", " ")}</span></div>
      <p className="mt-4 rounded-lg bg-slate-50 p-3 text-sm text-slate-700">{action.requiredAction}</p>
      {action.assignedOfficerId === session.userId && ["OPEN", "IN_PROGRESS", "REOPENED"].includes(action.status) && <form action={submitActionCompletion.bind(null, action.id)} className="mt-4 grid gap-3 rounded-lg border border-teal-100 bg-teal-50/50 p-4 md:grid-cols-2"><label className="text-sm font-medium text-slate-700">Completion notes<input className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2" name="notes" required /></label><label className="text-sm font-medium text-slate-700">Evidence reference<input className="mt-1.5 w-full rounded-lg border border-slate-300 bg-white px-3 py-2" name="evidence" required /></label><button className="justify-self-start rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">Submit for verification</button></form>}
      {action.status === "AWAITING_VERIFICATION" && action.assignedOfficerId !== session.userId && <div className="mt-4 flex flex-wrap gap-3 border-t border-slate-100 pt-4"><form action={verifyAction.bind(null, action.id, true)}><button className="rounded-lg bg-teal-700 px-4 py-2 font-semibold text-white">Verify & close</button></form><form action={verifyAction.bind(null, action.id, false)}><button className="rounded-lg border border-rose-300 px-4 py-2 font-semibold text-rose-700 hover:bg-rose-50">Reopen</button></form></div>}
    </article>)}{actions.length === 0 && <div className="rounded-xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-500">No corrective actions have been created yet.</div>}</section>
  </>;
}
