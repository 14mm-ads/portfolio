import { useEffect, useState } from 'react'
import { fetchChangeLog } from '../../data/portfolioRepository'
import type { ChangeLogEntry } from '../../data/portfolioRepository'
import type { Json } from '../../lib/database.types'

function asRecord(value: Json | null): Record<string, Json | undefined> {
  return value !== null && typeof value === 'object' && !Array.isArray(value)
    ? value as Record<string, Json | undefined>
    : {}
}

function recordFields(value: Json | null) {
  const record = asRecord(value)
  return record.data !== null && typeof record.data === 'object' && !Array.isArray(record.data)
    ? asRecord(record.data)
    : record
}

function formatValue(value: Json | undefined) {
  if (value === undefined) return '—'
  const text = typeof value === 'string' ? value : JSON.stringify(value)
  return text.length > 70 ? `${text.slice(0, 67)}…` : text
}

function changedFields(entry: ChangeLogEntry) {
  const before = recordFields(entry.before_record)
  const after = recordFields(entry.after_record)
  const keys = [...new Set([...Object.keys(before), ...Object.keys(after)])]
    .filter((key) => !['created_at', 'updated_at'].includes(key))
    .filter((key) => JSON.stringify(before[key]) !== JSON.stringify(after[key]))
  if (entry.action === 'insert') return 'Record created'
  if (entry.action === 'delete') return 'Record deleted'
  if (keys.length === 0) return 'Record updated'
  const details = keys.slice(0, 5).map((key) => {
    const label = key.replace(/([A-Z])/g, ' $1').replace(/^./, (letter) => letter.toUpperCase())
    return `${label}: ${formatValue(before[key])} → ${formatValue(after[key])}`
  })
  return `${details.join(' · ')}${keys.length > details.length ? ` · +${keys.length - details.length} more` : ''}`
}

export default function ChangeLog() {
  const [entries, setEntries] = useState<ChangeLogEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    void fetchChangeLog().then((result) => {
      if (active) setEntries(result)
    }).catch((cause: unknown) => {
      if (active) setError(cause instanceof Error ? cause.message : 'Could not load the change log.')
    }).finally(() => {
      if (active) setLoading(false)
    })
    return () => { active = false }
  }, [])

  if (loading) return <p className="admin-loading">Loading the last 30 days of changes…</p>
  if (error) return <p className="admin-error" role="alert">{error}</p>
  if (!entries.length) return <p className="admin-empty-note">No changes have been recorded in the last 30 days.</p>

  return (
    <div className="admin-changelog">
      <p className="admin-changelog-note">Project, brand, and option changes recorded in the last 30 days.</p>
      {entries.map((entry) => (
        <article className="admin-change-row" key={entry.id}>
          <div className="admin-change-main">
            <span className={`admin-change-action action-${entry.action}`}>{entry.action}</span>
            <div><strong>{entry.entity_label}</strong><small>{entry.entity_type}</small></div>
          </div>
          <p>{changedFields(entry)}</p>
          <div className="admin-change-meta">
            <time dateTime={entry.created_at}>{new Date(entry.created_at).toLocaleString()}</time>
            <span>{entry.actor_name || entry.actor_email || 'Unknown user'}{entry.actor_name && entry.actor_email ? ` · ${entry.actor_email}` : ''}</span>
          </div>
        </article>
      ))}
    </div>
  )
}
