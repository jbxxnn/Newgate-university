import { db } from "@/lib/db";
import { requirePermission, requireSession } from "@/lib/auth";
import { RequestForm } from "./request-form";
import { RequestActions } from "./request-actions";

export default async function AccessRequestsPage() {
  const session = await requireSession();
  const canCreate = session.permissions.includes("access_requests.create");
  const canApprove = session.permissions.includes("access_requests.approve");
  const canApply = session.permissions.includes("access_requests.apply");
  if (!canCreate && !canApprove && !canApply) await requirePermission("access_requests.view");
  const requests = await db.accessRequest.findMany({ where: canApprove || canApply ? {} : { requestedById: session.userId }, include: { requestedBy: true }, orderBy: { createdAt: "desc" } });
  return <><p className="text-sm font-semibold tracking-widest text-teal-700">ACCESS GOVERNANCE</p><h2 className="mt-2 text-3xl font-bold">Access Requests</h2><p className="mt-2 text-slate-600">Requests require independent approval before authorised ICT personnel can apply them.</p>{canCreate && <RequestForm />}{requests.length === 0 ? <p className="mt-8 rounded-xl border border-dashed border-slate-300 bg-white p-6 text-slate-500">No requests to display.</p> : <div className="mt-8 overflow-hidden rounded-xl border border-slate-200 bg-white"><table className="w-full text-left text-sm"><thead className="bg-slate-50 text-slate-500"><tr><th className="p-3">Request</th><th className="p-3">Resource</th><th className="p-3">Requested by</th><th className="p-3">Status</th><th className="p-3">Action</th></tr></thead><tbody>{requests.map((request) => <tr className="border-t border-slate-100" key={request.id}><td className="p-3 font-medium">{request.requestNumber}<div className="mt-1 text-xs font-normal text-slate-500">{request.requestedPermission}</div></td><td className="p-3">{request.resourceName}</td><td className="p-3">{request.requestedBy.fullName}</td><td className="p-3"><span className="rounded-full bg-slate-100 px-2 py-1 text-xs font-semibold">{request.status.replaceAll("_", " ")}</span></td><td className="p-3"><RequestActions id={request.id} status={request.status} canApprove={canApprove} canApply={canApply} /></td></tr>)}</tbody></table></div>}</>;
}
