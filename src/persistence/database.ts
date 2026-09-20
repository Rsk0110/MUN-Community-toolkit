import Dexie, { type Table } from "dexie";
import type { Session } from "../lib/types";

class ToolkitDatabase extends Dexie {
  sessions!: Table<Session, string>;

  constructor() {
    super("mun-chair-toolkit");
    this.version(1).stores({ sessions: "id, updatedAt" });
  }
}

export const database = new ToolkitDatabase();
