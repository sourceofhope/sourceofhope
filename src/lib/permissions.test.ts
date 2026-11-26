import { describe, expect, it } from "vitest";
import { checkPermission, hasPermission, PERMISSION_KEYS, SECOND_FACTOR_KEYS, type StaffMember } from "./permissions";

const staff = (over: Partial<StaffMember> = {}): StaffMember => ({ id: "s1", active: true, isAdmin: false, permissions: [], ...over });

describe("permissions", () => {
  // 02 §7: every permission has at least one denial test (wrong toggle → 403).
  describe.each(PERMISSION_KEYS)("%s", (key) => {
    const other = PERMISSION_KEYS.find((k) => k !== key)!;
    const aal = SECOND_FACTOR_KEYS.includes(key) ? "aal2" : "aal1";

    it("is denied with a different toggle", () => {
      expect(checkPermission(staff({ permissions: [other] }), "aal2", key)).toEqual({
        ok: false,
        denial: { status: 403, reason: "missing_permission", requirement: key },
      });
    });

    it("is allowed with its own toggle", () => {
      expect(checkPermission(staff({ permissions: [key] }), aal, key)).toEqual({ ok: true });
    });

    it("is denied when signed out or deactivated", () => {
      expect(checkPermission(null, null, key)).toMatchObject({ ok: false, denial: { status: 401 } });
      expect(checkPermission(staff({ active: false, permissions: [key], isAdmin: true }), "aal2", key)).toMatchObject({
        ok: false,
        denial: { status: 403, reason: "inactive" },
      });
    });
  });

  it("people.manage and integrations.manage need a second factor", () => {
    for (const key of ["people.manage", "integrations.manage"] as const) {
      expect(checkPermission(staff({ permissions: [key] }), "aal1", key)).toMatchObject({
        ok: false,
        denial: { reason: "second_factor_required" },
      });
    }
  });

  it("admin grants every permission, current and future, but always needs a second factor", () => {
    const admin = staff({ isAdmin: true });
    for (const key of PERMISSION_KEYS) expect(hasPermission(admin, key)).toBe(true);
    expect(hasPermission(admin, "admin")).toBe(true);
    expect(checkPermission(admin, "aal1", "events.manage")).toMatchObject({ ok: false, denial: { reason: "second_factor_required" } });
    expect(checkPermission(admin, "aal2", "events.manage")).toEqual({ ok: true });
  });

  it("no toggle grants admin", () => {
    expect(hasPermission(staff({ permissions: [...PERMISSION_KEYS] }), "admin")).toBe(false);
  });

  it("new staff start with nothing", () => {
    for (const key of PERMISSION_KEYS) expect(hasPermission(staff(), key)).toBe(false);
  });
});
