const optionalRowDefaults = [
  { id: 'optional-area-director', enabled: false, agendaItem: 'Area Director address', duration: 4, speaker: '' },
  { id: 'optional-educational', enabled: false, agendaItem: 'Educational session', duration: 8, speaker: '' },
  { id: 'optional-announcement', enabled: false, agendaItem: 'Special announcement', duration: 3, speaker: '' },
  { id: 'optional-polls', enabled: false, agendaItem: 'Polls and certificates', duration: 3, speaker: 'Presiding Officer' },
  { id: 'optional-guest-feedback', enabled: false, agendaItem: 'Guest feedback', duration: 4, speaker: 'Guests' },
]

export const blankMeeting = {
  meeting: {
    number: '',
    date: '',
    startTime: '',
    endTime: '',
    theme: '',
  },
  sidebar: {
    word: { word: '', meaning: '', example: '' },
    idiom: { idiom: '', meaning: '', example: '' },
  },
  roles: {
    presidingOfficer: '',
    sergeantAtArms: '',
    toastmaster: '',
    generalEvaluator: '',
    timer: '',
    ahCounter: '',
    grammarian: '',
    listeningMaster: '',
    tableTopicsMaster: '',
  },
  preparedSpeeches: [],
  tableTopics: {
    totalDuration: '',
    introductionDuration: '',
    conclusionDuration: '',
    rounds: '',
    customRows: [],
  },
  optionalRows: optionalRowDefaults,
}

export const defaultMeeting = {
  meeting: {
    number: 335,
    date: '2026-09-27',
    startTime: '14:30',
    endTime: '16:15',
    theme: 'Beyond the Horizon',
  },
  sidebar: {
    word: {
      word: 'Resilience',
      meaning: 'The ability to recover, adapt, and continue after difficulty.',
      example: 'Her resilience turned a difficult beginning into a confident finish.',
    },
    idiom: {
      idiom: 'Raise the bar',
      meaning: 'To set a higher standard or expectation.',
      example: 'The team raised the bar with a thoughtful and energetic meeting.',
    },
  },
  roles: {
    presidingOfficer: 'TM Janaki',
    sergeantAtArms: 'TM Savitha',
    toastmaster: 'TM Anand',
    generalEvaluator: 'TM Felix',
    timer: 'TM Manjumatha',
    ahCounter: 'TM Savitha',
    grammarian: 'TM Arnaud',
    listeningMaster: 'TM Avanthika',
    tableTopicsMaster: 'TM Bindu',
  },
  preparedSpeeches: [
    {
      id: 'speech-1',
      speaker: 'TM Arjun',
      title: 'Lessons from Failure',
      type: 'Standard Speech',
      duration: 7,
      evaluator: 'TM Priya',
    },
    {
      id: 'speech-2',
      speaker: 'TM Maya',
      title: 'A Map of Small Courage',
      type: 'Ice Breaker',
      duration: 6,
      evaluator: 'TM Felix',
    },
  ],
  tableTopics: {
    totalDuration: 40,
    introductionDuration: 2,
    conclusionDuration: 2,
    rounds: 'Open floor',
    customRows: [],
  },
  optionalRows: optionalRowDefaults.map((row) => ({
    ...row,
    enabled: row.id === 'optional-polls' || row.id === 'optional-guest-feedback',
  })),
}

export function cloneBlankMeeting() {
  return structuredClone(blankMeeting)
}

export function cloneDefaultMeeting() {
  return structuredClone(defaultMeeting)
}
