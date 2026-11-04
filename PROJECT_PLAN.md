# Newgate Data Governance & Privacy Compliance Management System

## Build plan

### 1. Product boundary

Build an internal, role-based governance and privacy-compliance application for Newgate University. It supports the existing Student Information Management System (SIMS); it does **not** replace SIMS or implement student self-service, registration, payments, or results viewing.

The product must make this lifecycle traceable:

`Data asset → responsible officer → requirement → control → review → finding/risk → corrective action → verification → closure`

Use fictional staff and synthetic/anonymised student references only.

### 2. Requirement boundary

The following are source requirements and will be treated as acceptance requirements: authentication; server-side role-based access; least privilege; segregation of duties; data assets/classification; owners and stewards; access requests; risks; compliance requirements, controls, reviews and evidence; findings/corrective actions; incidents; data-subject requests; retention/disposal monitoring; data-quality issues; audit logs; dashboards; authorised reports; and evaluation evidence.

The initial stack and exact labels below are delivery choices, not claims about the dissertation or legislation: Next.js, PostgreSQL, Prisma, Tailwind, shadcn/ui, Zod, the six initial roles, classification labels, score thresholds, and status names. Keep these in one configurable domain layer where practical.

### 3. Technical baseline and architecture

**Chosen baseline**

- Next.js (App Router) + TypeScript
- PostgreSQL + Prisma migrations and seed data
- Tailwind CSS + shadcn/ui
- Zod for server-side input validation
- Auth.js or a credentials session implementation with secure, hashed passwords
- Object/local controlled evidence storage behind authenticated download routes
- Recharts for dashboard visualisation

**Application layers**

1. Route/page layer: layout, tables, forms and detail views.
2. Server action/API layer: validates input, authorises the actor, applies workflow rules, writes within transactions, and records audit events.
3. Domain layer: permissions, status transitions, calculations, IDs, notifications and audit helpers.
4. Persistence layer: Prisma models, migrations, seed data and repositories/query helpers.

No protected action may rely only on a hidden UI control. All protected reads, exports, uploads and writes must check the current user and permission on the server.

### 4. Core role and security policy

Initial roles: `SUPER_ADMIN`, `PRIVACY_OFFICER`, `DATA_OWNER`, `DATA_STEWARD`, `ICT_OFFICER`, `MANAGEMENT_VIEWER`.

Create granular permissions such as `assets.create`, `assets.update`, `access_requests.approve`, `compliance.review`, `risks.manage`, `corrective_actions.verify`, `audit_logs.view`, and `reports.view`. Permissions are assigned to roles; users may have multiple roles.

Non-negotiable enforcement rules:

- A requester cannot approve their own access request.
- The actor completing a corrective action cannot verify it when independent verification is required.
- Ordinary users cannot update or delete audit-log records.
- Management Viewer is read-only.
- A user can approve an asset access request only when authorised and assigned as the relevant asset owner/delegate.
- Evidence downloads and exports are permission checked and auditable.
- Passwords are hashed; session and secret configuration are environment-only.

### 5. Data-model delivery order

Build relationships before dashboards or visual polish.

1. **Identity:** `users`, `roles`, `permissions`, `user_roles`, `role_permissions`, `departments`, `audit_logs`.
2. **Governance core:** `data_classifications`, `data_assets`, owner/steward assignments, `processing_activities`, `retention_rules`, `attachments`.
3. **Access:** `access_requests`, decisions/application details, `access_reviews`, review items.
4. **Risk and compliance:** `risks`, treatments, `compliance_requirements`, `controls`, control-to-asset links, `control_reviews`, evidence, `findings`.
5. **Operations:** `corrective_actions`, `incidents`, `data_subject_requests`, `data_quality_issues`, disposal records.
6. **Extended governance:** `third_parties`, asset links, processor reviews, `training_events`, attendees, notifications.

Use database foreign keys, unique business IDs, explicit enums, timestamps, actor IDs, soft archive/status transitions where records must remain traceable, and transactions for multi-record workflow changes.

### 6. Delivery roadmap

Each phase ends with a demo, automated checks for its rules, and a small set of synthetic records. Do not start a dependent phase until the previous phase is usable.

| Phase | Scope and concrete deliverables | Exit criteria |
| --- | --- | --- |
| 0 — Foundation | Create repository/app, environment template, PostgreSQL/Prisma, migrations, seed runner, authentication, app shell, permission engine, department/user/role administration, append-only audit utility, test accounts, placeholder dashboard. | All six roles sign in; unauthorised route and server action are denied; role/account changes are audited; seed/reset works from scratch. |
| 1 — Access governance | Users, roles/permissions, access-request list/detail/create flow, owner decision, ICT application, expiry/revocation, access reviews. | Requester cannot self-approve; approved request is only applied by authorised ICT user; every decision/application is auditable. |
| 2 — Data governance core | Data Assets CRUD, classification, department, owner/steward/delegate, purpose, lawful basis, related records tabs, retention rules, asset search/filter/detail. | An authorised steward can register `Examination Results` with classification, owner, steward, purpose and retention rule; permissions constrain edits. |
| 3 — Risk and compliance | Risk register and auto score/level; requirements, controls, control-to-asset links, reviews, evidence attachments, findings. | A failed review can produce a finding; score `4 × 5` is `20 / Critical`; a control’s status/history is traceable. |
| 4 — Corrective and privacy operations | Corrective-action workflow including verification/reopen, incidents, data-subject requests. | Evidence can be submitted; only authorised verifier closes an action; incident/request records follow valid status transitions. |
| 5 — Dashboard, audit and reports | Role-aware dashboard queries, compliance/risk/action/review metrics, activity feed, audit-log viewer, filtered reports and CSV export. | Metrics are calculated from stored records; management sees summaries only; exports respect permissions. |
| 6 — Extended governance | Data quality, retention/disposal review workflow, third-party processors/reviews, training and attendance, alerts/notifications where useful. | Upcoming/overdue retention and processor reviews are surfaced; related actions/evidence are traceable. |
| 7 — Evaluation and release | Complete scenario seed data, accessibility/usability pass, test-case evidence, security review, deployment, backup/storage runbook, demo rehearsal and screenshots. | All core tests pass; system demonstrates the full lecturer scenario end-to-end using synthetic data. |

### 7. Vertical-slice implementation order within each phase

For every module, deliver in this order:

1. Prisma schema/migration and deterministic seed fixtures.
2. Types, validation schema, permission checks and workflow transition rules.
3. Authorised list/search/filter and detail read views.
4. Create/edit action with transaction and audit event.
5. Related-record links, status history and evidence where needed.
6. Empty/error/loading states and responsive UI.
7. Unit/integration tests plus one role-based browser flow.

This keeps the project usable at each increment and avoids building unconnected CRUD pages.

### 8. Shared implementation conventions

- Generate human-readable IDs by entity type (for example `AST-0001`, `RISK-0001`) and retain immutable database IDs.
- Centralise enums, labels, status badge colours, allowed transitions and scoring thresholds.
- Use reusable `DataTable`, filter bar, status badge, evidence list/uploader, timeline, assignment control, confirm dialog and audit-event helper components.
- Use full pages for reviews and detail workflows; use modals/drawers only for small records or edits.
- Paginate server-side and calculate dashboard metrics through aggregate queries, never hard-coded values.
- Audit significant writes with actor, module, record type/ID, event/result, timestamp and safe before/after metadata. Do not expose sensitive values unnecessarily in an audit snapshot.
- Validate attachment content type and size, store generated names, and authorise file access on retrieval.
- Seed only clearly fictional data and label the environment as demo data.

### 9. Essential workflow acceptance tests

The test suite and manual evidence pack will cover at least:

| ID | Test | Expected outcome |
| --- | --- | --- |
| T-001 | Valid/invalid login | Valid user enters authorised area; invalid credentials fail safely. |
| T-002 | Role restriction | Data Steward cannot administer users/roles through URL or server action. |
| T-003 | Self-approval | Requester is blocked from approving their own access request. |
| T-004 | Asset registration | Authorised actor creates a classified asset with owner and steward. |
| T-005 | Risk score | Likelihood 4 and impact 5 produce score 20 and Critical level. |
| T-006 | Failed control | Non-compliant review can create a finding and corrective action. |
| T-007 | Auditability | Approval/change records actor, action, time and affected entity. |
| T-008 | Dashboard calculation | 5 compliant, 2 partial and 1 non-compliant applicable controls result in 75%. |
| T-009 | Action verification | Completion cannot close an independently verified action without authorised verification. |
| T-010 | Audit protection | Normal user cannot alter or delete audit records. |

### 10. Primary demonstration path

1. Sign in as Privacy Officer and show dashboard.
2. Open the synthetic `Examination Results` asset and its owner, steward, classification, purpose, retention rule and linked access control.
3. Record an access review that finds excessive access; set its control to Partially Compliant.
4. Create a finding and assign a corrective action to ICT Officer.
5. Sign in as ICT Officer, demonstrate restricted compliance permissions, remediate and upload evidence.
6. Sign back in as Privacy Officer, verify the action, re-review the control as Compliant, and show the audit trail and recalculated dashboard.

### 11. Release checklist

- Environment variables and production database configured; no secrets committed.
- Migrations and synthetic seeds work in a clean environment.
- Role/permission matrix reviewed against every protected route/action/export/file download.
- Workflow rules and audit events tested.
- Core metrics reconcile with their source records.
- Evidence upload/storage/retrieval restrictions documented and tested.
- Backup/recovery and deployment instructions documented.
- Test accounts, test evidence, screenshots and lecturer demo script prepared.
- No real student personal data included.

### 12. First implementation boundary

Begin with Phase 0 only. Its concrete first task is to agree the Phase 0 Prisma schema and folder structure, then implement the authenticated foundation without adding fake dashboard metrics or later workflow UI. After its exit criteria pass, proceed to Phase 1 in a separate build task.



data.owner@newgate.edu.ng
NewgateDemo!2026