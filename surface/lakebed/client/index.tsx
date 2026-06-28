import {
  SignInWithGoogle,
  signOut,
  useAuth,
  useMutation,
  useQuery,
} from "lakebed/client";
import { useEffect, useMemo, useState } from "preact/hooks";

import { demoIssueId, type ProjectedIssue } from "../shared/issue";

const activeColumns: Array<{
  label: string;
  statuses: ProjectedIssue["status"][];
}> = [
  { label: "open", statuses: ["open"] },
  { label: "blocked", statuses: ["needs_input", "approval_required"] },
  { label: "ready", statuses: ["ready"] },
  { label: "doing", statuses: ["in_progress"] },
];

const archivedColumns: Array<{
  label: string;
  statuses: ProjectedIssue["status"][];
}> = [{ label: "closed archive", statuses: ["closed"] }];

const statusRank: Record<ProjectedIssue["status"], number> = {
  open: 0,
  needs_input: 1,
  approval_required: 2,
  ready: 3,
  in_progress: 4,
  closed: 5,
};

const statusTone: Record<ProjectedIssue["status"], string> = {
  approval_required: "border-amber-500/60 text-amber-200",
  closed: "border-neutral-700 text-neutral-500",
  in_progress: "border-sky-500/60 text-sky-200",
  needs_input: "border-fuchsia-500/60 text-fuchsia-200",
  open: "border-neutral-700 text-neutral-300",
  ready: "border-emerald-500/70 text-emerald-200",
};

const statusIcon: Record<ProjectedIssue["status"], IconName> = {
  approval_required: "shield",
  closed: "archive",
  in_progress: "rocket",
  needs_input: "question",
  open: "folder",
  ready: "sparkles",
};

type IconName =
  | "archive"
  | "bolt"
  | "broadcast"
  | "folder"
  | "kanban"
  | "list"
  | "question"
  | "rocket"
  | "seed"
  | "shield"
  | "sparkles";

const iconPaths: Record<IconName, string> = {
  archive: "M4 9h16M7 9v8.5A2.5 2.5 0 0 0 9.5 20h5a2.5 2.5 0 0 0 2.5-2.5V9M6 4h12l2 5H4l2-5Zm5 9h2",
  bolt: "M13 2 5 13h6l-1 9 8-12h-6l1-8Z",
  broadcast: "M12 12h.01M8.5 8.5a5 5 0 0 0 0 7M15.5 8.5a5 5 0 0 1 0 7M5.5 5.5a9 9 0 0 0 0 13M18.5 5.5a9 9 0 0 1 0 13",
  folder: "M3 7.5A2.5 2.5 0 0 1 5.5 5H10l2 2h6.5A2.5 2.5 0 0 1 21 9.5v7A2.5 2.5 0 0 1 18.5 19h-13A2.5 2.5 0 0 1 3 16.5v-9Z",
  kanban: "M4 5h16M6 9h3v9H6V9Zm5 0h3v6h-3V9Zm5 0h3v11h-3V9Z",
  list: "M8 6h12M8 12h12M8 18h12M4 6h.01M4 12h.01M4 18h.01",
  question: "M9.5 9a2.5 2.5 0 1 1 4.4 1.6c-1.2 1-1.9 1.5-1.9 3.4M12 18h.01M4 12a8 8 0 1 0 16 0 8 8 0 0 0-16 0Z",
  rocket: "M5 19c2-1 3-2 4-4M9 15l-3-3 5-7c2-2 5-3 8-2 1 3 0 6-2 8l-7 5-1-1Zm5-7 2 2M6 18l-2 2",
  seed: "M12 20V9M12 9c-4 0-6-2-7-5 4 0 6 1.5 7 5Zm0 0c4 0 6-2 7-5-4 0-6 1.5-7 5Z",
  shield: "M12 3 5 6v5c0 4.5 3 7.5 7 10 4-2.5 7-5.5 7-10V6l-7-3Zm-3 9 2 2 4-5",
  sparkles: "M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8L12 3Zm6 11 .8 2.2L21 17l-2.2.8L18 20l-.8-2.2L15 17l2.2-.8L18 14Z",
};

function HugeIcon({
  className = "h-4 w-4",
  name,
}: {
  className?: string;
  name: IconName;
}) {
  return (
    <svg
      aria-hidden="true"
      className={className}
      fill="none"
      stroke="currentColor"
      stroke-linecap="round"
      stroke-linejoin="round"
      stroke-width="1.7"
      viewBox="0 0 24 24"
    >
      <path d={iconPaths[name]} />
    </svg>
  );
}

type BridgeStatus = {
  connectedClients?: number;
  lastCheckAt?: string;
  lastCheck?: {
    classification?: {
      preApproved?: Array<{ issueId: string; title: string }>;
    };
    runId?: string;
    stopReason?: string;
  };
  lastError?: string;
  lastEventAt?: string;
  lastGardenerAt?: string;
  lastGardenerReceiptPath?: string;
  lastGardenerRetryEligibleAt?: string;
  lastGardenerStopReason?: string;
  lastReceiptPath?: string;
  ok?: boolean;
  stale?: boolean;
  startedAt?: string;
};

function formatAge(iso?: string): string {
  if (!iso) {
    return "never";
  }

  const seconds = Math.max(
    0,
    Math.round((Date.now() - Date.parse(iso)) / 1000)
  );

  if (seconds < 60) {
    return `${seconds}s ago`;
  }

  return `${Math.round(seconds / 60)}m ago`;
}

function issueBodyPreview(body: string): string {
  const compact = body.replaceAll(/\s+/g, " ").trim();

  if (compact.length <= 150) {
    return compact;
  }

  return compact.slice(0, 147) + "…";
}

function sortedIssues(issues: readonly ProjectedIssue[]): ProjectedIssue[] {
  return [...issues].sort((left, right) => {
    const status = statusRank[left.status] - statusRank[right.status];

    if (status !== 0) {
      return status;
    }

    return left.issueId.localeCompare(right.issueId);
  });
}

function countByStatus(issues: readonly ProjectedIssue[]) {
  return issues.reduce(
    (counts, issue) => ({
      ...counts,
      [issue.status]: (counts[issue.status] ?? 0) + 1,
    }),
    {} as Partial<Record<ProjectedIssue["status"], number>>
  );
}

function useBridgeStatus() {
  const [status, setStatus] = useState<BridgeStatus | undefined>();
  const [lastEvent, setLastEvent] = useState("boot");
  const [updatedAt, setUpdatedAt] = useState<Date | undefined>();
  const [error, setError] = useState<string | undefined>();
  const bridgeBase = useMemo(() => {
    if (typeof window === "undefined") {
      return "http://127.0.0.1:8787";
    }

    return `http://${window.location.hostname}:8787`;
  }, []);

  useEffect(() => {
    let cancelled = false;

    const loadStatus = async () => {
      try {
        const response = await fetch(`${bridgeBase}/status`);
        const nextStatus = (await response.json()) as BridgeStatus;

        if (!cancelled) {
          setStatus(nextStatus);
          setUpdatedAt(new Date());
          setError(undefined);
        }
      } catch (caught) {
        if (!cancelled) {
          setError(caught instanceof Error ? caught.message : String(caught));
        }
      }
    };

    void loadStatus();
    const interval = window.setInterval(() => void loadStatus(), 2_000);
    const events = new EventSource(`${bridgeBase}/events`);

    events.addEventListener("heartbeat", (event) => {
      setLastEvent("heartbeat");
      setStatus(JSON.parse(event.data) as BridgeStatus);
      setUpdatedAt(new Date());
      setError(undefined);
    });
    events.addEventListener("check.completed", () => {
      setLastEvent("check");
      void loadStatus();
    });
    events.addEventListener("ready-work.changed", () => {
      setLastEvent("ready changed");
      void loadStatus();
    });
    events.addEventListener("gardener.stopped", () => {
      setLastEvent("gardener stopped");
      void loadStatus();
    });
    events.addEventListener("worktree.hygiene", () => {
      setLastEvent("worktree hygiene");
      void loadStatus();
    });
    events.onerror = () => {
      setLastEvent("sse error");
    };

    return () => {
      cancelled = true;
      window.clearInterval(interval);
      events.close();
    };
  }, [bridgeBase]);

  return { bridgeBase, error, lastEvent, status, updatedAt };
}

function AuthStatus() {
  const auth = useAuth();
  const authLabel = auth.displayName;
  const authStatus =
    auth.isLoading && auth.isGuest
      ? "checking session"
      : "signed in as " + authLabel;

  return (
    <div className="mb-3 flex items-center justify-between gap-3 border-b border-neutral-800 pb-3">
      <p className="min-w-0 truncate font-mono text-xs text-neutral-500">
        {authStatus}
      </p>
      {!auth.isLoading && auth.isGuest ? (
        <SignInWithGoogle className="shrink-0 border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-white hover:text-white" />
      ) : !auth.isLoading ? (
        <button
          className="shrink-0 text-xs text-neutral-400 hover:text-white"
          type="button"
          onClick={() => signOut()}
        >
          Sign out
        </button>
      ) : null}
    </div>
  );
}

function BridgePanel() {
  const { bridgeBase, error, lastEvent, status, updatedAt } = useBridgeStatus();
  const ready = status?.lastCheck?.classification?.preApproved ?? [];
  const state = error ? "offline" : status?.stale ? "stale" : "live";
  const stateTone =
    state === "live"
      ? "text-emerald-300"
      : state === "stale"
        ? "text-amber-300"
        : "text-red-300";

  return (
    <section className="mb-3 grid gap-2 border border-neutral-900 bg-neutral-950/70 p-3 text-xs lg:grid-cols-[1fr_1fr_1fr]">
      <div>
        <div className="font-mono uppercase tracking-[0.16em] text-neutral-600">
          bridge
        </div>
        <div className={`flex items-center gap-1.5 font-mono ${stateTone}`}>
          <HugeIcon className="h-3.5 w-3.5" name="broadcast" />
          {state}
        </div>
        <div className="truncate font-mono text-neutral-500">{bridgeBase}</div>
      </div>
      <div>
        <div className="font-mono uppercase tracking-[0.16em] text-neutral-600">
          monitor
        </div>
        <div className="flex items-center gap-1.5 font-mono text-neutral-300">
          <HugeIcon className="h-3.5 w-3.5 text-sky-300" name="bolt" />
          event:{lastEvent} · clients:{status?.connectedClients ?? 0}
        </div>
        <div className="font-mono text-neutral-500">
          check:{formatAge(status?.lastCheckAt)} · ui:
          {updatedAt?.toLocaleTimeString() ?? "never"}
        </div>
      </div>
      <div>
        <div className="font-mono uppercase tracking-[0.16em] text-neutral-600">
          ready from bridge
        </div>
        <div className="flex items-center gap-1.5 truncate font-mono text-neutral-300">
          <HugeIcon className="h-3.5 w-3.5 text-emerald-300" name="sparkles" />
          {ready.length > 0
            ? ready.map((issue) => issue.issueId).join(", ")
            : "none"}
        </div>
        <div className="truncate font-mono text-amber-300">
          {status?.lastGardenerStopReason
            ? `gardener:${status.lastGardenerStopReason}`
            : "gardener:ok"}
        </div>
        <div className="truncate font-mono text-neutral-500">
          {status?.lastGardenerReceiptPath ?? "no gardener receipt"}
        </div>
        <div className="truncate font-mono text-red-300">
          {error ?? status?.lastError}
        </div>
      </div>
    </section>
  );
}

function IssueCard({
  expanded,
  issue,
  onToggle,
}: {
  expanded: boolean;
  issue: ProjectedIssue;
  onToggle: () => void;
}) {
  const approveIssue = useMutation<[issueId: string], void>("approveIssue");
  const canApprove =
    issue.approval === "approval-required" ||
    issue.status === "approval_required";

  return (
    <article className="rounded border border-neutral-900 bg-black/80 text-sm hover:border-neutral-700">
      <button
        className="block w-full px-3 py-2 text-left"
        type="button"
        onClick={onToggle}
      >
        <div className="mb-1 flex items-start justify-between gap-2">
          <div className="min-w-0">
            <div className="flex items-center gap-1.5 font-mono text-[0.68rem] text-neutral-500">
              <HugeIcon className="h-3.5 w-3.5" name={statusIcon[issue.status]} />
              {issue.issueId} · e{issue.eventCount}
            </div>
            <div className="truncate font-medium text-neutral-100">
              {issue.title}
            </div>
          </div>
          <span
            className={`inline-flex shrink-0 items-center gap-1 rounded-full border px-2 py-0.5 font-mono text-[0.65rem] ${statusTone[issue.status]}`}
          >
            <HugeIcon className="h-3 w-3" name={statusIcon[issue.status]} />
            {issue.status}
          </span>
        </div>
        <div className="text-xs leading-5 text-neutral-500">
          {expanded ? issue.body : issueBodyPreview(issue.body)}
        </div>
      </button>
      {expanded ? (
        <div className="border-t border-neutral-900 px-3 py-2">
          <dl className="grid grid-cols-2 gap-2 font-mono text-[0.68rem] text-neutral-500">
            <div>
              <dt>approval</dt>
              <dd className="text-neutral-300">{issue.approval}</dd>
            </div>
            <div>
              <dt>last event</dt>
              <dd className="text-neutral-300">{issue.lastEventType}</dd>
            </div>
          </dl>
          {canApprove ? (
            <button
              className="mt-2 inline-flex items-center gap-1.5 border border-emerald-400 px-2 py-1 text-[0.7rem] font-medium text-emerald-200 hover:bg-emerald-400 hover:text-black"
              type="button"
              onClick={() => void approveIssue(issue.issueId)}
            >
              <HugeIcon className="h-3.5 w-3.5" name="shield" />
              approve
            </button>
          ) : null}
        </div>
      ) : null}
    </article>
  );
}

function KanbanColumn({
  expandedIds,
  issues,
  label,
  onToggle,
}: {
  expandedIds: ReadonlySet<string>;
  issues: readonly ProjectedIssue[];
  label: string;
  onToggle: (issueId: string) => void;
}) {
  return (
    <section className="min-h-40 rounded border border-neutral-900 bg-neutral-950/50">
      <div className="sticky top-0 z-10 flex items-center justify-between border-b border-neutral-900 bg-neutral-950 px-3 py-2">
        <h2 className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.16em] text-neutral-400">
          <HugeIcon className="h-4 w-4" name={label.includes("archive") ? "archive" : "kanban"} />
          {label}
        </h2>
        <span className="rounded-full bg-neutral-900 px-2 py-0.5 font-mono text-xs text-neutral-400">
          {issues.length}
        </span>
      </div>
      <div className="space-y-2 p-2">
        {issues.length > 0 ? (
          issues.map((issue) => (
            <IssueCard
              expanded={expandedIds.has(issue.issueId)}
              issue={issue}
              key={issue.issueId}
              onToggle={() => onToggle(issue.issueId)}
            />
          ))
        ) : (
          <div className="rounded border border-dashed border-neutral-900 p-3 text-xs text-neutral-700">
            empty
          </div>
        )}
      </div>
    </section>
  );
}

function ListView({
  expandedIds,
  issues,
  onToggle,
}: {
  expandedIds: ReadonlySet<string>;
  issues: readonly ProjectedIssue[];
  onToggle: (issueId: string) => void;
}) {
  return (
    <div className="space-y-2 rounded border border-neutral-900 bg-neutral-950/40 p-2">
      {issues.map((issue) => (
        <IssueCard
          expanded={expandedIds.has(issue.issueId)}
          issue={issue}
          key={issue.issueId}
          onToggle={() => onToggle(issue.issueId)}
        />
      ))}
    </div>
  );
}

function StatusPill({
  count,
  icon,
  label,
}: {
  count: number;
  icon: IconName;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-neutral-800 bg-neutral-950 px-2 py-1 font-mono text-xs text-neutral-300">
      <HugeIcon className="h-3.5 w-3.5" name={icon} />
      {label}:{count}
    </span>
  );
}

export function App() {
  const issues = useQuery<ProjectedIssue[]>("issues");
  const seedApprovalRequiredIssue = useMutation<[], void>(
    "seedApprovalRequiredIssue"
  );
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set()
  );
  const [viewMode, setViewMode] = useState<"kanban" | "list">("kanban");
  const [showClosedArchive, setShowClosedArchive] = useState(false);
  const visibleIssues = showClosedArchive
    ? issues
    : issues.filter((issue) => issue.status !== "closed");
  const sorted = sortedIssues(visibleIssues);
  const counts = countByStatus(issues);
  const totalEvents = issues.reduce((sum, issue) => sum + issue.eventCount, 0);

  const toggleIssue = (issueId: string) => {
    setExpandedIds((current) => {
      const next = new Set(current);

      if (next.has(issueId)) {
        next.delete(issueId);
      } else {
        next.add(issueId);
      }

      return next;
    });
  };

  return (
    <main className="min-h-screen bg-black px-4 py-4 text-white">
      <section className="mx-auto max-w-[96rem]">
        <AuthStatus />

        <header className="mb-3 grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
          <div>
            <p className="mb-1 font-mono text-xs uppercase tracking-[0.18em] text-neutral-500">
              Lakebed operator surface · live kanban · {visibleIssues.length} shown / {issues.length} total
            </p>
            <h1 className="text-3xl font-bold tracking-tight">
              Issue progress board
            </h1>
          </div>
          <div className="flex flex-wrap gap-2 lg:justify-end">
            <StatusPill count={counts.ready ?? 0} icon="sparkles" label="ready" />
            <StatusPill count={counts.in_progress ?? 0} icon="rocket" label="doing" />
            <StatusPill count={counts.needs_input ?? 0} icon="question" label="input" />
            <StatusPill count={counts.approval_required ?? 0} icon="shield" label="approve" />
            <StatusPill count={counts.closed ?? 0} icon="archive" label="archived" />
          </div>
        </header>

        <BridgePanel />

        <div className="mb-3 flex flex-wrap items-center justify-between gap-3 border border-neutral-900 bg-neutral-950/60 px-3 py-2">
          <div className="min-w-0 font-mono text-xs text-neutral-500">
            host: <span className="text-neutral-300">192.168.215.3:3000</span>
            <span className="px-2 text-neutral-700">|</span>
            events: <span className="text-neutral-300">{totalEvents}</span>
          </div>
          <div className="flex gap-2">
            <button
              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium ${
                showClosedArchive
                  ? "border-white text-white"
                  : "border-neutral-700 text-neutral-300 hover:border-white hover:text-white"
              }`}
              type="button"
              onClick={() => setShowClosedArchive((value) => !value)}
            >
              <HugeIcon className="h-3.5 w-3.5" name="archive" />
              {showClosedArchive ? "hide archive" : `show archive (${counts.closed ?? 0})`}
            </button>
            <button
              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium ${
                viewMode === "kanban"
                  ? "border-white text-white"
                  : "border-neutral-700 text-neutral-300 hover:border-white hover:text-white"
              }`}
              type="button"
              onClick={() => setViewMode("kanban")}
            >
              <HugeIcon className="h-3.5 w-3.5" name="kanban" />
              kanban
            </button>
            <button
              className={`inline-flex items-center gap-1.5 border px-3 py-1.5 text-xs font-medium ${
                viewMode === "list"
                  ? "border-white text-white"
                  : "border-neutral-700 text-neutral-300 hover:border-white hover:text-white"
              }`}
              type="button"
              onClick={() => setViewMode("list")}
            >
              <HugeIcon className="h-3.5 w-3.5" name="list" />
              list
            </button>
            <button
              className="inline-flex items-center gap-1.5 border border-neutral-700 px-3 py-1.5 text-xs font-medium text-neutral-200 hover:border-white hover:text-white"
              type="button"
              onClick={() => void seedApprovalRequiredIssue()}
            >
              <HugeIcon className="h-3.5 w-3.5" name="seed" />
              seed demo {demoIssueId}
            </button>
          </div>
        </div>

        {viewMode === "kanban" ? (
          <div className="grid gap-3 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2">
            {[
              ...activeColumns,
              ...(showClosedArchive ? archivedColumns : []),
            ].map((column) => (
              <KanbanColumn
                expandedIds={expandedIds}
                issues={sorted.filter((issue) =>
                  column.statuses.includes(issue.status)
                )}
                key={column.label}
                label={column.label}
                onToggle={toggleIssue}
              />
            ))}
          </div>
        ) : (
          <ListView
            expandedIds={expandedIds}
            issues={sorted}
            onToggle={toggleIssue}
          />
        )}
      </section>
    </main>
  );
}
