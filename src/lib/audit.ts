import "server-only";
import { db, type Db } from "@/lib/db/client";
import type { Json } from "@/lib/db/types";

/**
 * The audit log (02 §7): permission changes, publishing, roster prints and
 * exports, exceptions, intake merges, financial corrections and integration
 * changes. Append-only in the database; there is no update or delete.
 */
export type AuditEntry = {
  /** The staff member who acted, or null for the system (jobs, webhooks). */
  actorStaffId: string | null;
  /** Dotted verb: "staff.permission.grant", "event.publish", "registration.exception". */
  action: string;
  targetType: string;
  targetId?: string | null;
  before?: Json | null;
  after?: Json | null;
};

export async function audit(entry: AuditEntry, client: Db = db()): Promise<void> {
  const { error } = await client.from("audit_log").insert({
    actor_staff_id: entry.actorStaffId,
    actor_kind: entry.actorStaffId ? "staff" : "system",
    action: entry.action,
    target_type: entry.targetType,
    target_id: entry.targetId ?? null,
    before: entry.before ?? null,
    after: entry.after ?? null,
  });
  // An action that must be audited fails if its audit row can't be written.
  if (error) throw new Error(`audit write failed: ${error.message}`);
}
