# Technical Evaluation Results

Evaluation date: 5 October 2026. Environment: local Docker PostgreSQL and production webpack build.

| Test | Result | Evidence / observation |
| --- | --- | --- |
| Build and type safety | Pass | `npm run lint` and `npx next build --webpack` completed successfully. |
| Seeded asset registration | Pass | `AST-0001`, Examination Results, is Active. |
| Risk calculation | Pass | `RISK-0001` stores likelihood 4, impact 5, score 20, level Critical. |
| Control → finding → action trace | Pass after seed refresh | `CTL-0001` links to `FND-0001`, which links to `ACT-0001`. |
| Corrective-action workflow | Pending manual browser execution | Needs sign-in as ICT Officer followed by independent Privacy Officer verification. |
| Login/restriction/self-approval | Pending manual browser execution | Server-side guards are implemented; capture browser evidence during the test pass. |
| Audit event content | Pending manual browser execution | The untouched seed database has no user-action events; create/approve/review actions must be executed to generate evidence. |
| Audit record protection | Conditional pass | Application exposes no update/delete audit action or route. The local PostgreSQL account is database owner and therefore can directly modify tables via SQL; production must use a restricted application role and migrations/admin-only database credentials. |
| Dashboard accuracy | Pending data setup | Create the specified eight-control data set before checking the expected 75% calculation. |

## Required human/tester evidence

- Screenshot each tested browser flow with the logged-in role visible.
- Record observed result and Pass/Fail in `TEST_PLAN.md`.
- Obtain usability feedback and lecturer sign-off separately; those cannot be inferred from technical checks.

## Manual acceptance-test completion

On 5 October 2026, the evaluator manually passed T-001 through T-010 in the local browser environment. The manual pass confirmed authentication, role restrictions, self-approval prevention, asset registration, risk calculation, finding generation, audit visibility, dashboard accuracy, independent corrective-action verification, and audit-route protection. Screenshots should be retained with the dissertation evidence pack.
