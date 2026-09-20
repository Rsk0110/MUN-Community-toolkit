import type { Attendance, Delegation } from "./types";

export type RollCallSummary = {
  totalDelegations: number;
  present: number;
  presentAndVoting: number;
  absent: number;
  quorum: number;
  simpleMajority: number;
  twoThirds: number;
};

export function countByAttendance(
  delegations: Delegation[],
  attendance: Attendance,
): number {
  return delegations.filter((delegation) => delegation.attendance === attendance)
    .length;
}

export function calculateRollCallSummary(
  delegations: Delegation[],
): RollCallSummary {
  const present = delegations.filter(
    (delegation) => delegation.attendance !== "absent",
  ).length;
  const presentAndVoting = countByAttendance(delegations, "present-and-voting");
  const absent = countByAttendance(delegations, "absent");

  return {
    totalDelegations: delegations.length,
    present,
    presentAndVoting,
    absent,
    // Quorum is a simple majority of all delegations present.
    quorum: Math.floor(present / 2) + 1,
    simpleMajority: Math.floor(presentAndVoting / 2) + 1,
    twoThirds: Math.ceil((presentAndVoting * 2) / 3),
  };
}
