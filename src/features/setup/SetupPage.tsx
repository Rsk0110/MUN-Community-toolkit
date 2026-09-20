import { useEffect, useMemo, useState, type FormEvent } from "react";
import { calculateRollCallSummary } from "../../lib/rules";
import type { Attendance } from "../../lib/types";
import { useSetupStore } from "./setupStore";

const attendanceOptions: { value: Attendance; label: string }[] = [
  { value: "present", label: "Present" },
  { value: "present-and-voting", label: "Present & Voting" },
  { value: "absent", label: "Absent" },
];

export function SetupPage() {
  const session = useSetupStore((state) => state.session);
  const updateSession = useSetupStore((state) => state.updateSession);
  const addDelegation = useSetupStore((state) => state.addDelegation);
  const addDelegationsFromText = useSetupStore((state) => state.addDelegationsFromText);
  const removeDelegation = useSetupStore((state) => state.removeDelegation);
  const setAttendance = useSetupStore((state) => state.setAttendance);
  const [countryName, setCountryName] = useState("");
  const [flagEmoji, setFlagEmoji] = useState("");
  const [bulkText, setBulkText] = useState("");
  const [savedMessage, setSavedMessage] = useState(false);
  const summary = useMemo(
    () => calculateRollCallSummary(session.delegations),
    [session.delegations],
  );

  useEffect(() => {
    setSavedMessage(true);
    const timeout = window.setTimeout(() => setSavedMessage(false), 1400);
    return () => window.clearTimeout(timeout);
  }, [session.updatedAt]);

  function handleSingleAdd(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    addDelegation(countryName, flagEmoji);
    setCountryName("");
    setFlagEmoji("");
  }

  function handleBulkAdd() {
    addDelegationsFromText(bulkText);
    setBulkText("");
  }

  return (
    <main className="min-h-screen bg-[#f2f6f8] pb-16">
      <header className="border-b border-[#d8e2e8] bg-[#102a43] text-white">
        <div className="mx-auto flex max-w-7xl items-end justify-between gap-6 px-5 py-8 lg:px-10">
          <div>
            <p className="mb-2 text-xs font-bold uppercase tracking-[0.24em] text-[#8ed1c7]">MUN Chair Toolkit</p>
            <h1 className="font-display text-4xl leading-tight md:text-5xl">Set the room.</h1>
            <p className="mt-3 max-w-xl text-sm leading-6 text-[#c6d7e2]">Build the committee roster, call the room, and keep every threshold visible at a glance.</p>
          </div>
          <div className="hidden text-right text-sm text-[#c6d7e2] md:block">
            <p>Session workspace</p>
            <p className="mt-1 font-semibold text-white">Committee setup</p>
          </div>
        </div>
      </header>

      <div className="mx-auto grid max-w-7xl gap-6 px-5 py-7 lg:grid-cols-[1fr_340px] lg:px-10">
        <section className="space-y-6">
          <div className="rounded-2xl border border-[#d8e2e8] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#638096]">01 / Context</p>
                <h2 className="mt-1 text-2xl font-bold text-[#17324d]">Committee details</h2>
              </div>
              {savedMessage && <span className="text-xs font-semibold text-[#218879]">Saved locally</span>}
            </div>
            <div className="grid gap-4 md:grid-cols-2">
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#36556d]">Committee name</span>
                <input className="field" value={session.committeeName} onChange={(event) => updateSession({ committeeName: event.target.value })} placeholder="e.g. Security Council" />
              </label>
              <label className="block">
                <span className="mb-2 block text-sm font-semibold text-[#36556d]">Agenda topic</span>
                <input className="field" value={session.agendaTopic} onChange={(event) => updateSession({ agendaTopic: event.target.value })} placeholder="e.g. Maritime security" />
              </label>
            </div>
          </div>

          <div className="rounded-2xl border border-[#d8e2e8] bg-white p-6 shadow-sm">
            <div className="mb-5">
              <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#638096]">02 / Roster</p>
              <h2 className="mt-1 text-2xl font-bold text-[#17324d]">Delegations</h2>
              <p className="mt-2 text-sm text-[#638096]">Add a delegation one at a time or paste a full list. Attendance starts as Absent until roll call.</p>
            </div>
            <form className="grid gap-3 md:grid-cols-[1fr_100px_auto]" onSubmit={handleSingleAdd}>
              <input className="field" value={countryName} onChange={(event) => setCountryName(event.target.value)} placeholder="Country name" aria-label="Country name" />
              <input className="field" value={flagEmoji} onChange={(event) => setFlagEmoji(event.target.value)} placeholder="Flag" aria-label="Optional flag emoji" maxLength={4} />
              <button className="primary-button" type="submit">Add country</button>
            </form>
            <div className="my-5 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-[#8ba0af]"><span className="h-px flex-1 bg-[#e4ebef]" />or bulk paste<span className="h-px flex-1 bg-[#e4ebef]" /></div>
            <div className="grid gap-3 md:grid-cols-[1fr_auto]">
              <textarea className="field min-h-24 resize-y" value={bulkText} onChange={(event) => setBulkText(event.target.value)} placeholder={"Canada\nJapan\nKenya\nPeru"} aria-label="Delegations, one per line" />
              <button className="secondary-button self-end" type="button" onClick={handleBulkAdd}>Add list</button>
            </div>
          </div>

          <div className="rounded-2xl border border-[#d8e2e8] bg-white p-6 shadow-sm">
            <div className="mb-5 flex items-end justify-between gap-4">
              <div><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#638096]">03 / Roll call</p><h2 className="mt-1 text-2xl font-bold text-[#17324d]">Who is in the room?</h2></div>
              <span className="text-sm font-semibold text-[#638096]">{session.delegations.length} total</span>
            </div>
            {session.delegations.length === 0 ? <p className="rounded-xl bg-[#f2f6f8] p-5 text-sm text-[#638096]">Your roster is empty. Add countries above to begin roll call.</p> : <div className="divide-y divide-[#e7eef2]">{session.delegations.map((delegation) => <div className="flex flex-wrap items-center justify-between gap-3 py-3 first:pt-0 last:pb-0" key={delegation.id}><div className="flex min-w-0 items-center gap-3"><span className="text-xl" aria-hidden="true">{delegation.flagEmoji || "•"}</span><span className="font-semibold text-[#274861]">{delegation.countryName}</span></div><div className="flex items-center gap-2"><select className="select-field" value={delegation.attendance} onChange={(event) => setAttendance(delegation.id, event.target.value as Attendance)} aria-label={`Attendance for ${delegation.countryName}`}>{attendanceOptions.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}</select><button className="icon-button" type="button" onClick={() => removeDelegation(delegation.id)} aria-label={`Remove ${delegation.countryName}`}>×</button></div></div>)}</div>}
          </div>
        </section>

        <aside className="space-y-6 lg:sticky lg:top-6 lg:self-start">
          <div className="rounded-2xl bg-[#dff2ed] p-6 text-[#17324d] shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#287a6f]">Roll call snapshot</p><h2 className="mt-2 font-display text-3xl">The room, counted.</h2><div className="mt-6 grid grid-cols-2 gap-3"><Stat label="Present" value={summary.present} /><Stat label="Voting" value={summary.presentAndVoting} /><Stat label="Absent" value={summary.absent} /><Stat label="Quorum" value={summary.quorum} /></div></div>
          <div className="rounded-2xl border border-[#d8e2e8] bg-white p-6 shadow-sm"><p className="text-xs font-bold uppercase tracking-[0.18em] text-[#638096]">Voting thresholds</p><div className="mt-5 space-y-4"><Threshold label="Simple majority" value={summary.simpleMajority} /><Threshold label="Two-thirds" value={summary.twoThirds} /></div><p className="mt-5 border-t border-[#e7eef2] pt-4 text-xs leading-5 text-[#638096]">Thresholds use delegations marked Present and Voting. Quorum uses all delegations marked Present or Present and Voting.</p></div>
        </aside>
      </div>
    </main>
  );
}

function Stat({ label, value }: { label: string; value: number }) { return <div className="rounded-xl bg-white/70 p-3"><p className="text-xs font-semibold text-[#638096]">{label}</p><p className="mt-1 text-3xl font-bold text-[#17324d]">{value}</p></div>; }
function Threshold({ label, value }: { label: string; value: number }) { return <div className="flex items-center justify-between"><span className="text-sm font-semibold text-[#36556d]">{label}</span><span className="rounded-full bg-[#e7f4f1] px-3 py-1 text-lg font-bold text-[#20786d]">{value} yes</span></div>; }
