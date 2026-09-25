const DRAFT_KEY = 'toastmasters-poster-draft-v2'
const CLUB_DEFAULTS_KEY = 'toastmasters-club-defaults-v1'

export function saveDraft(meeting) {
  localStorage.setItem(DRAFT_KEY, JSON.stringify(meeting))
}

export function loadDraft() {
  try {
    const value = localStorage.getItem(DRAFT_KEY)
    return value ? JSON.parse(value) : null
  } catch {
    return null
  }
}

export function clearDraft() {
  localStorage.removeItem(DRAFT_KEY)
}

export function saveClubDefaults(config) {
  if (!localStorage.getItem(CLUB_DEFAULTS_KEY)) {
    localStorage.setItem(CLUB_DEFAULTS_KEY, JSON.stringify(config))
  }
}
