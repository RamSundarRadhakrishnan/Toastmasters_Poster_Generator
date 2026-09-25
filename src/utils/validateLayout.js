export function measurePosterLayout(posterElement) {
  if (!posterElement) return { posterOverflow: false, sidebarOverflow: false }
  const agenda = posterElement.querySelector('[data-poster-agenda]')
  const sidebar = posterElement.querySelector('[data-poster-sidebar]')
  return {
    posterOverflow: posterElement.scrollHeight > posterElement.clientHeight + 1
      || (agenda && agenda.scrollHeight > agenda.clientHeight + 1),
    sidebarOverflow: Boolean(sidebar && sidebar.scrollHeight > sidebar.clientHeight + 1),
  }
}
