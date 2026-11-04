# Phase 7 Evaluation Test Plan

All evidence must use the synthetic database and test accounts only.

| ID | Requirement | Test and expected result | Evidence |
| --- | --- | --- | --- |
| T-001 | FR-01 | Valid login succeeds; invalid credentials are rejected. **Observed 5 Oct 2026: Passed (manual browser test).** | Login screenshots |
| T-002 | FR-03 | Data Steward cannot access Users route or administration action. **Observed 5 Oct 2026: Passed (manual browser test).** | Denied-route capture |
| T-003 | FR-05 | Requester cannot approve their own access request. **Observed 5 Oct 2026: Passed (manual browser test).** | Denied action + audit event |
| T-004 | FR-02/04 | Authorised user registers classified asset with owner, steward and retention rule. **Observed 5 Oct 2026: Passed (manual browser test).** | Asset detail capture |
| T-005 | FR-06 | Likelihood 4 × impact 5 stores score 20 / Critical. **Observed 5 Oct 2026: Passed (manual browser test).** | Risk record capture |
| T-006 | FR-08/07 | Partially/non-compliant control review creates finding. **Observed 5 Oct 2026: Passed (manual browser test).** | Control + finding capture |
| T-007 | Auditability | Approval/change contains actor, time, action, result and record. **Observed 5 Oct 2026: Passed (manual browser test).** | Audit Log capture |
| T-008 | Dashboard | 5 compliant, 2 partial, 1 non-compliant controls calculate to 75%. **Observed 5 Oct 2026: Passed (manual browser test).** | Source data + dashboard capture |
| T-009 | Segregation | Action assignee cannot verify their own submitted completion. **Observed 5 Oct 2026: Passed (manual browser test).** | Denied workflow capture |
| T-010 | Audit protection | Ordinary users have no audit edit/delete action or endpoint. **Observed 5 Oct 2026: Passed (manual browser test).** | Role/route capture |

## Lecturer scenario

1. Sign in as Privacy Officer and open `Examination Results`.
2. Show `CTL-0001`, the Partially Compliant review, `FND-0001`, and `ACT-0001`.
3. Sign in as ICT Officer; submit evidence for `ACT-0001`.
4. Sign back in as Privacy Officer; verify/close the action, re-review the control as Compliant, then show Audit Logs and updated dashboard values.
