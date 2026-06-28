export type IssueApproval =
  | "pre-approved"
  | "approval-required"
  | "input-required"

export type ProjectedIssueStatus =
  | "open"
  | "needs_input"
  | "approval_required"
  | "ready"
  | "in_progress"
  | "closed"

export type IssueEventType =
  | "issue.created"
  | "issue.updated"
  | "issue.reviewed"
  | "issue.closed"

export type StoredIssueEvent = {
  id: string
  eventId: string
  issueId: string
  ownerId: string
  payloadJson: string
  type: IssueEventType
  createdAt: string
  updatedAt: string
}

export type ProjectedIssue = {
  approval: IssueApproval
  body: string
  eventCount: number
  issueId: string
  lastEventType: IssueEventType
  status: ProjectedIssueStatus
  title: string
}

type IssueEventPayload = {
  approval?: IssueApproval
  body?: string
  issueId: string
  status?: ProjectedIssueStatus
  title?: string
}

export const demoIssueId = "ISS-LB-001"

export function cleanIssueText(value: string): string {
  return value.trim().slice(0, 400)
}

export function makeIssueEventPayloadJson(payload: IssueEventPayload): string {
  return JSON.stringify(payload)
}

export function projectIssueEvents(
  events: readonly StoredIssueEvent[]
): ProjectedIssue[] {
  const issues = new Map<string, ProjectedIssue>()

  for (const event of events) {
    const payload = JSON.parse(event.payloadJson) as IssueEventPayload
    const existing = issues.get(event.issueId)

    if (event.type === "issue.created") {
      issues.set(event.issueId, {
        approval: payload.approval ?? "input-required",
        body: payload.body ?? "",
        eventCount: 1,
        issueId: event.issueId,
        lastEventType: event.type,
        status: payload.status ?? "open",
        title: payload.title ?? event.issueId,
      })
      continue
    }

    if (!existing) {
      continue
    }

    if (event.type === "issue.closed") {
      issues.set(event.issueId, {
        ...existing,
        eventCount: existing.eventCount + 1,
        lastEventType: event.type,
        status: "closed",
      })
      continue
    }

    issues.set(event.issueId, {
      ...existing,
      approval: payload.approval ?? existing.approval,
      body: payload.body ?? existing.body,
      eventCount: existing.eventCount + 1,
      lastEventType: event.type,
      status: payload.status ?? existing.status,
      title: payload.title ?? existing.title,
    })
  }

  return [...issues.values()].sort((left, right) =>
    left.issueId.localeCompare(right.issueId)
  )
}
