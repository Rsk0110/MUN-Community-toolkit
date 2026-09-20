import { describe, expect, it } from "vitest";
import { calculateRollCallSummary } from "./rules";
import type { Delegation } from "./types";

const delegations: Delegation[] = [
  { id: "1", countryName: "Canada", attendance: "present-and-voting" },
  { id: "2", countryName: "Japan", attendance: "present" },
  { id: "3", countryName: "Kenya", attendance: "present-and-voting" },
  { id: "4", countryName: "Peru", attendance: "absent" },
];

describe("calculateRollCallSummary", () => {
  it("counts attendance and calculates voting thresholds", () => {
    expect(calculateRollCallSummary(delegations)).toEqual({
      totalDelegations: 4,
      present: 3,
      presentAndVoting: 2,
      absent: 1,
      quorum: 2,
      simpleMajority: 2,
      twoThirds: 2,
    });
  });

  it("returns a usable quorum for an empty roll call", () => {
    expect(calculateRollCallSummary([]).quorum).toBe(1);
  });
});
