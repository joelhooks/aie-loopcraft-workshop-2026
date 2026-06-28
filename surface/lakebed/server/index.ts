import { capsule, endpoint, json, mutation, query, string, table, text } from "lakebed/server"
import {
  cleanIssueText,
  demoIssueId,
  makeIssueEventPayloadJson,
  projectIssueEvents,
  type IssueEventType,
  type StoredIssueEvent,
} from "../shared/issue"

const demoIssueTitle = "Approve the first Lakebed issue"

function eventId(issueId: string, type: IssueEventType): string {
  return `${issueId}-${type}-${Date.now()}`
}

function coreEventFromStoredEvent(event: StoredIssueEvent) {
  const payload = JSON.parse(event.payloadJson) as Record<string, unknown>

  if (event.type === "issue.created") {
    return {
      ...payload,
      createdAt: payload.createdAt ?? event.createdAt,
      issueId: event.issueId,
      labels: payload.labels ?? ["lakebed"],
      source: payload.source ?? "lakebed",
      type: event.type,
    }
  }

  if (event.type === "issue.updated") {
    return {
      ...payload,
      issueId: event.issueId,
      type: event.type,
      updatedAt: payload.updatedAt ?? event.createdAt,
    }
  }

  return {
    ...payload,
    issueId: event.issueId,
    type: event.type,
  }
}

function isIssueEventInput(value: unknown): value is {
  issueId: string
  type: IssueEventType
} {
  if (!value || typeof value !== "object") {
    return false
  }

  const event = value as Record<string, unknown>

  return typeof event.issueId === "string" && typeof event.type === "string"
}

export default capsule({
  name: "Lakebed Issue Loop Surface",

  schema: {
    issueEvents: table({
      eventId: string(),
      issueId: string(),
      ownerId: string(),
      payloadJson: string(),
      type: string(),
    }),
  },

  queries: {
    issueEvents: query((ctx) =>
      ctx.db.issueEvents
        .where("ownerId", ctx.auth.userId)
        .orderBy("createdAt", "asc")
        .all()
    ),

    issues: query((ctx) =>
      projectIssueEvents(
        ctx.db.issueEvents
          .where("ownerId", ctx.auth.userId)
          .orderBy("createdAt", "asc")
          .all() as StoredIssueEvent[]
      )
    ),
  },

  mutations: {
    seedApprovalRequiredIssue: mutation((ctx) => {
      const existing = ctx.db.issueEvents
        .where("ownerId", ctx.auth.userId)
        .where("issueId", demoIssueId)
        .all()

      if (existing.length > 0) {
        return
      }

      ctx.db.issueEvents.insert({
        eventId: eventId(demoIssueId, "issue.created"),
        issueId: demoIssueId,
        ownerId: ctx.auth.userId,
        payloadJson: makeIssueEventPayloadJson({
          approval: "approval-required",
          body: "Seed issue for proving that Lakebed can record operator approval as an append-only issue event.",
          issueId: demoIssueId,
          status: "approval_required",
          title: demoIssueTitle,
        }),
        type: "issue.created",
      })
    }),

    approveIssue: mutation((ctx, issueId: string) => {
      const cleanIssueId = cleanIssueText(issueId)

      if (!cleanIssueId) {
        return
      }

      ctx.db.issueEvents.insert({
        eventId: eventId(cleanIssueId, "issue.updated"),
        issueId: cleanIssueId,
        ownerId: ctx.auth.userId,
        payloadJson: makeIssueEventPayloadJson({
          approval: "pre-approved",
          issueId: cleanIssueId,
          status: "ready",
        }),
        type: "issue.updated",
      })
    }),
  },

  endpoints: {
    issueEvents: endpoint(
      { method: "GET", path: "/api/issue-events" },
      (ctx) => {
        const events = ctx.db.issueEvents
          .where("ownerId", ctx.auth.userId)
          .orderBy("createdAt", "asc")
          .all() as StoredIssueEvent[]

        return json(events.map(coreEventFromStoredEvent))
      }
    ),

    appendIssueEvents: endpoint(
      { method: "POST", path: "/api/issue-events" },
      async (ctx, request) => {
        const payload = await request.json<unknown>()
        const inputs = Array.isArray(payload) ? payload : [payload]
        let appended = 0

        for (const input of inputs) {
          if (!isIssueEventInput(input)) {
            continue
          }

          ctx.db.issueEvents.insert({
            eventId: eventId(input.issueId, input.type),
            issueId: input.issueId,
            ownerId: ctx.auth.userId,
            payloadJson: JSON.stringify(input),
            type: input.type,
          })
          appended += 1
        }

        return json({ appended, ok: true })
      }
    ),

    status: endpoint({ method: "GET", path: "/api/status" }, () => text("ok")),
  },
})
