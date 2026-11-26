import "server-only";
import type { RateLimitStore } from "@/lib/platform/rate-limit";
import type { WebhookLedger } from "@/lib/platform/webhooks";
import { db, type Db } from "./client";

/** The shared rate-limit store: one atomic upsert in Postgres per hit. */
export function postgresRateLimitStore(client: Db = db()): RateLimitStore {
  return {
    async hit(key, windowStart, windowSeconds) {
      const { data, error } = await client.rpc("rate_limit_hit", {
        p_key: key,
        p_window_start: windowStart.toISOString(),
        p_window_seconds: windowSeconds,
      });
      if (error) throw new Error(`rate_limit_hit failed: ${error.message}`);
      return data;
    },
  };
}

/** The webhook ledger on `integration_events`. */
export function postgresWebhookLedger(client: Db = db()): WebhookLedger {
  return {
    async claim(provider, externalEventId, type) {
      const { data, error } = await client.rpc("webhook_claim", { p_provider: provider, p_external_event_id: externalEventId, p_type: type }).single();
      if (error || !data) throw new Error(`webhook_claim failed: ${error?.message}`);
      return { status: data.status as "received" | "processed" | "failed", attempts: data.attempts, isNew: data.is_new };
    },
    async markProcessed(provider, externalEventId) {
      const { error } = await client
        .from("integration_events")
        .update({ status: "processed", processed_at: new Date().toISOString(), error: null })
        .eq("provider", provider)
        .eq("external_event_id", externalEventId);
      if (error) throw new Error(`ledger update failed: ${error.message}`);
    },
    async markFailed(provider, externalEventId, message) {
      const { error } = await client
        .from("integration_events")
        .update({ status: "failed", error: message.slice(0, 1000) })
        .eq("provider", provider)
        .eq("external_event_id", externalEventId);
      if (error) throw new Error(`ledger update failed: ${error.message}`);
    },
  };
}
