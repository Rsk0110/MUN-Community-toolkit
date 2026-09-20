export type Id = string;

export type Attendance = "present" | "present-and-voting" | "absent";

export type Delegation = {
  id: Id;
  countryName: string;
  flagEmoji?: string;
  attendance: Attendance;
};

export type Session = {
  id: Id;
  committeeName: string;
  agendaTopic: string;
  delegations: Delegation[];
  createdAt: number;
  updatedAt: number;
};
