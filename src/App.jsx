import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { MeetingDetailsForm } from './components/editor/MeetingDetailsForm'
import { OptionalRowsForm } from './components/editor/OptionalRowsForm'
import { PreparedSpeechesForm } from './components/editor/PreparedSpeechesForm'
import { RoleCallForm } from './components/editor/RoleCallForm'
import { SidebarForm } from './components/editor/SidebarForm'
import { TableTopicsForm } from './components/editor/TableTopicsForm'
import { PosterPreview } from './components/poster/PosterPreview'
import { clubConfig } from './config/clubConfig'
import { cloneBlankMeeting, cloneDefaultMeeting } from './data/defaultMeeting'
import { generateAgenda } from './services/generateAgenda'
import { exportMeetingMinutes } from './utils/exportMinutes'
import { downloadJson, exportPosterImage, printPoster } from './utils/exportPoster'
import { loadDraft, saveClubDefaults, saveDraft } from './utils/meetingStorage'
import { measurePosterLayout } from './utils/validateLayout'
import { validateImportedMeeting, validateMeeting } from './utils/validateMeeting'
import './styles/app.css'
import './styles/editor.css'
import './styles/poster.css'
import './styles/print.css'

function loadInitialMeeting() {
  const draft = loadDraft()
  return draft && validateImportedMeeting(draft).valid ? draft : cloneBlankMeeting()
}

function hasEnteredMeetingData(specification) {
  const textValues = [
    ...Object.values(specification.meeting),
    ...Object.values(specification.roles),
    ...Object.values(specification.sidebar.word),
    ...Object.values(specification.sidebar.idiom),
    specification.tableTopics.totalDuration,
    specification.tableTopics.introductionDuration,
    specification.tableTopics.conclusionDuration,
    specification.tableTopics.rounds,
  ]
  return textValues.some((value) => String(value ?? '').trim())
    || specification.preparedSpeeches.length > 0
    || specification.tableTopics.customRows.length > 0
    || specification.optionalRows.some((row) => row.enabled)
}

function EditorSection({ title, badge, children, open = false }) {
  return (
    <details className="editor-section" open={open}>
      <summary><span>{title}</span>{badge && <em>{badge}</em>}</summary>
      <div className="editor-section-body">{children}</div>
    </details>
  )
}

function App() {
  const [meeting, setMeeting] = useState(loadInitialMeeting)
  const [isExporting, setIsExporting] = useState(false)
  const [isExportingMinutes, setIsExportingMinutes] = useState(false)
  const [layoutStatus, setLayoutStatus] = useState({ posterOverflow: false, sidebarOverflow: false })
  const posterRef = useRef(null)
  const importRef = useRef(null)

  const generation = useMemo(() => {
    try {
      return { posterData: generateAgenda(meeting), error: '' }
    } catch (error) {
      return { posterData: null, error: error.message }
    }
  }, [meeting])
  const validation = useMemo(() => validateMeeting(meeting, generation.posterData), [meeting, generation.posterData])
  const hasMeetingInput = hasEnteredMeetingData(meeting)
  const layoutErrors = [
    layoutStatus.posterOverflow ? 'The agenda exceeds the densest supported poster layout.' : '',
    layoutStatus.sidebarOverflow ? 'The sidebar content exceeds its available space.' : '',
  ].filter(Boolean)
  const exportBlocked = validation.errors.length > 0 || layoutErrors.length > 0 || !generation.posterData

  useEffect(() => {
    saveDraft(meeting)
    saveClubDefaults(clubConfig)
  }, [meeting])

  useLayoutEffect(() => {
    if (!generation.posterData) return undefined
    const frame = requestAnimationFrame(() => setLayoutStatus(measurePosterLayout(posterRef.current)))
    return () => cancelAnimationFrame(frame)
  }, [generation.posterData])

  const updateMeetingDetails = (field, value) => setMeeting((current) => ({ ...current, meeting: { ...current.meeting, [field]: value } }))
  const updateRole = (field, value) => setMeeting((current) => ({ ...current, roles: { ...current.roles, [field]: value } }))
  const updateSidebar = (entry, field, value) => setMeeting((current) => ({
    ...current,
    sidebar: { ...current.sidebar, [entry]: { ...current.sidebar[entry], [field]: value } },
  }))

  const resetMeeting = () => {
    setMeeting(cloneBlankMeeting())
  }

  const loadSampleMeeting = () => setMeeting(cloneDefaultMeeting())

  const duplicateMeeting = () => {
    setMeeting((current) => {
      const copy = structuredClone(current)
      const [year, month, day] = copy.meeting.date.split('-').map(Number)
      copy.meeting.number = Number(copy.meeting.number) + 1
      copy.meeting.date = new Date(Date.UTC(year, month - 1, day + 7)).toISOString().slice(0, 10)
      return copy
    })
  }

  const importMeeting = async (event) => {
    const [file] = event.target.files
    event.target.value = ''
    if (!file) return
    try {
      const value = JSON.parse(await file.text())
      const result = validateImportedMeeting(value)
      if (!result.valid) throw new Error(result.message)
      setMeeting(value)
    } catch (error) {
      window.alert(`Import failed: ${error.message}`)
    }
  }

  const runImageExport = async (format) => {
    if (exportBlocked) return
    setIsExporting(true)
    try {
      const extension = format === 'jpeg' ? 'jpg' : 'png'
      await exportPosterImage(posterRef.current, `meeting-${meeting.meeting.number}-agenda.${extension}`, format)
    } catch (error) {
      window.alert(`Export failed: ${error.message}`)
    } finally {
      setIsExporting(false)
    }
  }

  const runPrint = () => {
    if (!exportBlocked) printPoster()
  }

  const runMinutesExport = async () => {
    if (validation.errors.length > 0 || !generation.posterData) return
    setIsExportingMinutes(true)
    try {
      await exportMeetingMinutes(meeting, generation.posterData, `meeting-${meeting.meeting.number}-minutes.docx`)
    } catch (error) {
      window.alert(`Minutes export failed: ${error.message}`)
    } finally {
      setIsExportingMinutes(false)
    }
  }

  return (
    <div className="app-shell">
      <header className="app-header">
        <div className="app-brand">
          <div className="app-logo-frame"><img src={clubConfig.logoUrl} alt="Toastmasters International" /></div>
          <div>
            <h1>Toastmasters Poster Generator</h1>
          </div>
        </div>
      </header>

      <div className="workspace">
        <aside className="editor-panel">
          <div className="editor-toolbar">
            <button type="button" className="secondary-button" disabled={!meeting.meeting.number || !meeting.meeting.date} onClick={duplicateMeeting}>Duplicate previous</button>
            <button type="button" className="secondary-button" onClick={resetMeeting}>Clear form</button>
            <button type="button" className="secondary-button" onClick={loadSampleMeeting}>Load sample</button>
            <button type="button" className="secondary-button" onClick={() => importRef.current.click()}>Import JSON</button>
            <input ref={importRef} className="visually-hidden" type="file" accept="application/json,.json" onChange={importMeeting} />
          </div>

          {hasMeetingInput && (validation.errors.length > 0 || validation.warnings.length > 0 || layoutErrors.length > 0) && (
            <div className="validation-stack" aria-live="polite">
              {[...validation.errors, ...layoutErrors].map((message) => <div className="validation-message error" key={message}>{message}</div>)}
              {validation.warnings.map((message) => <div className="validation-message warning" key={message}>{message}</div>)}
            </div>
          )}

          <EditorSection title="Meeting details" open><MeetingDetailsForm value={meeting.meeting} onChange={updateMeetingDetails} /></EditorSection>
          <EditorSection title="Role call" badge="9 required" open><RoleCallForm value={meeting.roles} onChange={updateRole} /></EditorSection>
          <EditorSection title="Prepared speeches" badge={`${meeting.preparedSpeeches.length} speeches`} open>
            <PreparedSpeechesForm value={meeting.preparedSpeeches} onChange={(preparedSpeeches) => setMeeting((current) => ({ ...current, preparedSpeeches }))} />
          </EditorSection>
          <EditorSection title="Table Topics" badge={meeting.tableTopics.totalDuration ? `${meeting.tableTopics.totalDuration} min` : ''} open>
            <TableTopicsForm value={meeting.tableTopics} onChange={(tableTopics) => setMeeting((current) => ({ ...current, tableTopics }))} />
          </EditorSection>
          <EditorSection title="Sidebar language"><SidebarForm value={meeting.sidebar} onChange={updateSidebar} /></EditorSection>
          <EditorSection title="Optional rows" badge={`${meeting.optionalRows.filter((row) => row.enabled).length} enabled`}>
            <OptionalRowsForm value={meeting.optionalRows} onChange={(optionalRows) => setMeeting((current) => ({ ...current, optionalRows }))} />
          </EditorSection>

          {generation.posterData && <details className="json-inspector"><summary>Inspect generated agenda JSON</summary><pre>{JSON.stringify(generation.posterData, null, 2)}</pre></details>}
        </aside>

        <section className="preview-panel">
          <div className="preview-toolbar">
            <strong>Preview</strong>
            <div className="export-actions">
              <button type="button" className="secondary-button" onClick={() => downloadJson(meeting, `meeting-${meeting.meeting.number}-data.json`)}>Data JSON</button>
              <button type="button" className="secondary-button" disabled={isExportingMinutes || validation.errors.length > 0 || !generation.posterData} onClick={runMinutesExport}>Minutes DOCX</button>
              <button type="button" className="secondary-button" disabled={isExporting || exportBlocked} onClick={() => runImageExport('png')}>PNG master</button>
              <button type="button" className="secondary-button" disabled={isExporting || exportBlocked} onClick={() => runImageExport('jpeg')}>JPEG</button>
              <button type="button" className="primary-button" disabled={exportBlocked} onClick={runPrint}>Print / PDF</button>
            </div>
          </div>
          {generation.posterData
            ? <PosterPreview posterData={generation.posterData} posterRef={posterRef} />
            : <div className="preview-empty"><strong>Preview unavailable</strong><span>{hasMeetingInput ? generation.error : 'Enter meeting details to generate a preview.'}</span></div>}
        </section>
      </div>
    </div>
  )
}

export default App
