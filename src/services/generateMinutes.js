import { roleDefinitions } from '../config/clubConfig.js'

const REPORT_ROLES = [
  ['timer', 'Timer'],
  ['ahCounter', 'Ah-Counter'],
  ['grammarian', 'Grammarian / Idiom Master'],
  ['listeningMaster', 'Listening Master'],
  ['generalEvaluator', 'General Evaluator'],
]

function longDate(value) {
  const [year, month, day] = String(value || '').split('-').map(Number)
  if (!year || !month || !day) return ''
  return new Intl.DateTimeFormat('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  }).format(new Date(Date.UTC(year, month - 1, day)))
}

function uniqueNames(meeting) {
  return [...new Set([
    ...Object.values(meeting.roles),
    ...meeting.preparedSpeeches.flatMap((speech) => [speech.speaker, speech.evaluator]),
  ].map((name) => name?.trim()).filter(Boolean))]
}

function prompt(text) {
  return { promptText: `[${text}]` }
}

export function buildMinutesModel(meeting, posterData, club) {
  const meetingDate = longDate(meeting.meeting.date)
  const participants = uniqueNames(meeting)
  const speechBullets = meeting.preparedSpeeches.length
    ? meeting.preparedSpeeches.map((speech) => ({
        lead: `${speech.speaker}: `,
        text: `"${speech.title}" - ${speech.type}.`,
      }))
    : [prompt('No prepared speeches were listed in the agenda')]
  const evaluationBullets = meeting.preparedSpeeches.length
    ? meeting.preparedSpeeches.map((speech) => ({
        lead: `${speech.evaluator}: `,
        text: `evaluation of ${speech.speaker}'s speech, "${speech.title}."`,
      }))
    : [prompt('No individual speech evaluations were listed in the agenda')]

  const topicBullets = [
    { lead: 'Table Topics Master: ', text: `${meeting.roles.tableTopicsMaster}.` },
    {
      lead: 'Planned session: ',
      text: `${meeting.tableTopics.rounds || 'Open floor'} (${Number(meeting.tableTopics.totalDuration)} minutes).`,
    },
    ...(meeting.tableTopics.customRows || []).map((row) => ({
      lead: 'Additional item: ',
      text: `${row.agendaItem} (${Number(row.duration)} minutes), led by ${row.speaker || meeting.roles.tableTopicsMaster}.`,
    })),
    prompt('Add participant names, questions, and notable responses'),
  ]

  return {
    title: `Minutes of ${club.name} Regular Meeting`,
    date: meetingDate,
    meetingNumber: String(meeting.meeting.number),
    introduction: [
      `The club membership convened on ${meetingDate} at ${posterData.posterMetadata.timeLabel.split(' to ')[0]}, with ${meeting.roles.presidingOfficer} presiding. The meeting theme was "${meeting.meeting.theme}."`,
      `The following people held meeting roles, delivered prepared speeches, or were named as evaluators in the agenda: ${participants.join(', ')}.`,
    ],
    completionNote: 'Pre-filled from the meeting agenda. Complete bracketed notes after the meeting.',
    sections: [
      {
        id: 'previous-minutes',
        title: 'Minutes of the previous regular meeting were reviewed',
        bullets: [prompt('Add the approval outcome and any corrections')],
      },
      {
        id: 'meeting-roles',
        title: 'Members with meeting roles were introduced',
        bullets: roleDefinitions.map((role) => ({ lead: `${role.label}: `, text: `${meeting.roles[role.key]}.` })),
      },
      {
        id: 'prepared-speeches',
        title: 'Prepared speeches were presented',
        bullets: speechBullets,
      },
      {
        id: 'table-topics',
        title: 'Table Topics were presented',
        bullets: topicBullets,
      },
      {
        id: 'evaluations',
        title: 'Evaluations were presented',
        bullets: evaluationBullets,
      },
      {
        id: 'role-reports',
        title: 'Reports from members with meeting roles were provided',
        bullets: REPORT_ROLES.map(([key, label]) => ({
          lead: `${label} - ${meeting.roles[key]}: `,
          promptText: '[Add key comments]',
        })),
      },
      {
        id: 'awards',
        title: 'Club awards were presented',
        bullets: [
          prompt('Add Best Evaluator'),
          prompt('Add Best Table Topics Speaker'),
          prompt('Add Best Speaker'),
          prompt('Add other club awards'),
        ],
      },
      {
        id: 'officer-reports',
        title: 'Reports from club officers and committees were provided',
        bullets: [
          prompt('Add officer reports'),
          prompt('Add standing committee reports'),
          prompt('Add special committee reports'),
        ],
      },
    ],
    close: `Generated agenda close: ${posterData.calculatedEndTime}. Record the actual adjournment time if different.`,
    footer: `${club.name} | Club No. ${club.clubNumber} | ${club.url}`,
  }
}
