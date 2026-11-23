import { useState } from 'react'
import type { FormEvent } from 'react'
import { Plus, Save, Trash2 } from 'lucide-react'
import {
  addPortfolioOption,
  deletePortfolioOption,
  PORTFOLIO_OPTION_FIELDS,
  renamePortfolioOption,
} from '../../data/portfolioRepository'
import type { PortfolioOption, PortfolioOptionField } from '../../data/portfolioRepository'

type Props = {
  options: PortfolioOption[]
  onChanged: () => Promise<void>
}

function OptionRow({ option, onChanged }: { option: PortfolioOption; onChanged: Props['onChanged'] }) {
  const [value, setValue] = useState(option.value)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function save(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (!value.trim() || value.trim() === option.value) return
    setBusy(true)
    setError('')
    try {
      await renamePortfolioOption(option.id, value)
      await onChanged()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not update this option.')
    } finally {
      setBusy(false)
    }
  }

  async function remove() {
    if (!window.confirm(`Delete “${option.value}” from ${PORTFOLIO_OPTION_FIELDS[option.field]} options?`)) return
    setBusy(true)
    setError('')
    try {
      await deletePortfolioOption(option.id)
      await onChanged()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not delete this option.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-option-row">
      <form onSubmit={(event) => void save(event)}>
        <input aria-label={`${PORTFOLIO_OPTION_FIELDS[option.field]} option`} required maxLength={100} value={value} onChange={(event) => setValue(event.target.value)} />
        <button className="admin-secondary-button" type="submit" disabled={busy || value.trim() === option.value} aria-label={`Save ${option.value}`}><Save size={14} /> Save</button>
        <button className="admin-danger-button" type="button" disabled={busy} onClick={() => void remove()} aria-label={`Delete ${option.value}`}><Trash2 size={14} /></button>
      </form>
      {error && <p className="admin-error" role="alert">{error}</p>}
    </div>
  )
}

export default function OptionsManager({ options, onChanged }: Props) {
  const [field, setField] = useState<PortfolioOptionField>('sector')
  const [value, setValue] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  async function add(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await addPortfolioOption(field, value)
      setValue('')
      await onChanged()
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : 'Could not add this option.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="admin-options">
      <div className="admin-options-intro">
        <h2>Manage shared options</h2>
        <p>These lists are shared by project and brand editors. Renaming or deleting an option does not rewrite existing records.</p>
      </div>
      <form className="admin-option-add" onSubmit={(event) => void add(event)}>
        <label className="admin-field"><span>Field</span>
          <select value={field} onChange={(event) => setField(event.target.value as PortfolioOptionField)}>
            {Object.entries(PORTFOLIO_OPTION_FIELDS).map(([key, label]) => <option value={key} key={key}>{label}</option>)}
          </select>
        </label>
        <label className="admin-field"><span>New option</span><input required maxLength={100} value={value} onChange={(event) => setValue(event.target.value)} /></label>
        <button className="admin-primary-button" type="submit" disabled={busy}><Plus size={15} /> Add option</button>
      </form>
      {error && <p className="admin-error" role="alert">{error}</p>}
      <div className="admin-option-groups">
        {Object.entries(PORTFOLIO_OPTION_FIELDS).map(([key, label]) => {
          const fieldOptions = options.filter((option) => option.field === key)
          return (
            <section className="admin-option-group" key={key}>
              <h3>{label}<span>{fieldOptions.length}</span></h3>
              {fieldOptions.length
                ? fieldOptions.map((option) => <OptionRow key={option.id} option={option} onChanged={onChanged} />)
                : <p className="admin-empty-note">No options yet.</p>}
            </section>
          )
        })}
      </div>
    </section>
  )
}
