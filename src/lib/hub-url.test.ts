import { describe, expect, it } from "vitest";
import { eventSide, firstIncompleteStep, hubQuery, hubSearch, parseHub, type HubState } from "./hub-url";

describe("parseHub", () => {
  it("is null when no Hub params are present", () => {
    expect(parseHub("")).toBeNull();
    expect(parseHub("?utm_source=print&show=volunteer")).toBeNull();
  });

  it("opens each door", () => {
    expect(parseHub("action=help")).toEqual({ action: "help" });
    expect(parseHub("action=volunteer")).toEqual({ action: "volunteer" });
    expect(parseHub("action=give")).toEqual({ action: "give" });
  });

  it("reads an event alone as event details, with an optional side", () => {
    expect(parseHub("event=serving-hope-dec")).toEqual({ action: "event", event: "serving-hope-dec" });
    expect(parseHub("event=serving-hope-dec&view=guest")).toEqual({ action: "event", event: "serving-hope-dec", view: "guest" });
    expect(parseHub("event=serving-hope-dec&view=side")).toEqual({ action: "event", event: "serving-hope-dec" });
  });

  it("drops an unknown action, falling back to event details or closed", () => {
    expect(parseHub("action=donate")).toBeNull();
    expect(parseHub("action=donate&event=meal")).toEqual({ action: "event", event: "meal" });
  });

  describe("help", () => {
    it("keeps need, service and event", () => {
      expect(parseHub("action=help&need=food")).toEqual({ action: "help", need: "food" });
      expect(parseHub("action=help&need=health&service=wellness-clinic")).toEqual({ action: "help", need: "health", service: "wellness-clinic" });
      expect(parseHub("action=help&event=meal")).toEqual({ action: "help", event: "meal" });
    });
    it("drops invalid values and params of other doors", () => {
      expect(parseHub("action=help&need=housing&type=once&step=amount&view=guest")).toEqual({ action: "help" });
      expect(parseHub("action=help&service=Not A Slug")).toEqual({ action: "help" });
    });
  });

  describe("volunteer", () => {
    it("keeps the event and a known step", () => {
      expect(parseHub("action=volunteer&event=meal&step=shift")).toEqual({ action: "volunteer", event: "meal", step: "shift" });
    });
    it("drops steps that belong to other flows", () => {
      expect(parseHub("action=volunteer&step=amount")).toEqual({ action: "volunteer" });
    });
  });

  describe("give", () => {
    it("keeps type, designation and the type's steps", () => {
      expect(parseHub("action=give&type=once&designation=servingHope&step=details")).toEqual({
        action: "give",
        type: "once",
        designation: "servingHope",
        step: "details",
      });
      expect(parseHub("action=give&type=planned&step=inquiry")).toEqual({ action: "give", type: "planned", step: "inquiry" });
      expect(parseHub("action=give&type=business&step=tiers")).toEqual({ action: "give", type: "business", step: "tiers" });
    });
    it("drops a step without a type, or from another type", () => {
      expect(parseHub("action=give&step=details")).toEqual({ action: "give" });
      expect(parseHub("action=give&type=planned&step=amount")).toEqual({ action: "give", type: "planned" });
    });
    it("drops an unknown type", () => {
      expect(parseHub("action=give&type=yearly")).toEqual({ action: "give" });
    });
    it("keeps ref only on done, and only when well-formed", () => {
      const ref = "pr_4mF8kQ2xT9vLz0aB";
      expect(parseHub(`action=give&type=once&step=done&ref=${ref}`)).toEqual({ action: "give", type: "once", step: "done", ref });
      expect(parseHub(`action=give&type=once&step=payment&ref=${ref}`)).toEqual({ action: "give", type: "once", step: "payment" });
      expect(parseHub("action=give&type=once&step=done&ref=short")).toEqual({ action: "give", type: "once", step: "done" });
      expect(parseHub("action=give&type=once&step=done&ref=a@b.com-xxxxxxxxxxxx")).toEqual({ action: "give", type: "once", step: "done" });
    });
    it("drops a designation that isn't a program key", () => {
      expect(parseHub("action=give&designation=<script>")).toEqual({ action: "give" });
    });
  });

  it("accepts URLSearchParams and Next's searchParams object", () => {
    expect(parseHub(new URLSearchParams("action=give&type=monthly"))).toEqual({ action: "give", type: "monthly" });
    expect(parseHub({ action: "help", need: ["food", "health"] })).toEqual({ action: "help", need: "food" });
  });
});

describe("hubSearch", () => {
  it("serializes in a stable order with action first", () => {
    expect(hubSearch({ action: "give", step: "details", type: "once", designation: "servingHope" })).toBe("?action=give&type=once&designation=servingHope&step=details");
    expect(hubSearch({ action: "event", event: "meal", view: "guest" })).toBe("?event=meal&view=guest");
  });

  it("keeps UTMs and other params, replacing old Hub params", () => {
    expect(hubSearch({ action: "give", type: "once" }, "?utm_source=print&action=help&need=food&show=volunteer")).toBe(
      "?action=give&type=once&utm_source=print&show=volunteer",
    );
  });

  it("closing removes only Hub params", () => {
    expect(hubSearch(null, "?action=give&type=once&step=done&ref=pr_4mF8kQ2xT9vLz0aB&utm_campaign=gt_2026_12&gclid=abc")).toBe(
      "?utm_campaign=gt_2026_12&gclid=abc",
    );
    expect(hubSearch(null, "?action=help")).toBe("");
  });

  it("round-trips through parseHub", () => {
    const states: HubState[] = [
      { action: "help", need: "outdoors" },
      { action: "volunteer", event: "meal", step: "people" },
      { action: "give", type: "business", step: "inquiry" },
      { action: "event", event: "meal", view: "volunteer" },
    ];
    for (const state of states) expect(parseHub(hubSearch(state))).toEqual(state);
  });

  it("hubQuery matches for links", () => {
    expect(hubQuery({ action: "give", type: "monthly" })).toEqual({ action: "give", type: "monthly" });
  });
});

describe("firstIncompleteStep", () => {
  const steps = ["amount", "details", "payment", "done"] as const;
  it("opens the requested step when everything before it is complete", () => {
    expect(firstIncompleteStep(steps, "payment", () => true)).toBe("payment");
  });
  it("opens the first incomplete step before the requested one", () => {
    expect(firstIncompleteStep(steps, "payment", (s) => s === "amount")).toBe("details");
    expect(firstIncompleteStep(steps, "done", () => false)).toBe("amount");
  });
  it("defaults to the first step", () => {
    expect(firstIncompleteStep(steps, undefined, () => false)).toBe("amount");
  });
});

describe("eventSide", () => {
  it("shows the only side an event has", () => {
    expect(eventSide({ view: "volunteer", hasGuest: true, hasVolunteer: false })).toBe("guest");
    expect(eventSide({ view: "guest", hasGuest: false, hasVolunteer: true })).toBe("volunteer");
  });
  it("prefers view, then the door it came from, then volunteer", () => {
    expect(eventSide({ view: "guest", from: "volunteer", hasGuest: true, hasVolunteer: true })).toBe("guest");
    expect(eventSide({ from: "help", hasGuest: true, hasVolunteer: true })).toBe("guest");
    expect(eventSide({ hasGuest: true, hasVolunteer: true })).toBe("volunteer");
  });
});
