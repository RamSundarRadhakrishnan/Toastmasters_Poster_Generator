export const agendaTemplate = {
  defaultEvaluationDuration: 3,
  significantlyEarlyThreshold: 10,
  preMeeting: {
    id: 'networking',
    agendaItem: 'Pre-meeting networking',
    duration: 15,
    speakerRole: 'presidingOfficer',
    enabled: true,
  },
  sections: {
    opening: {
      id: 'opening',
      title: '',
      rows: [
        { id: 'opening-saa', duration: 2, agendaItem: 'SAA calls the meeting to order', speakerRole: 'sergeantAtArms' },
        { id: 'opening-presiding', duration: 4, agendaItem: 'Presiding Officer address', speakerRole: 'presidingOfficer' },
        { id: 'opening-tmod', duration: 1, agendaItem: 'Toastmaster of the Day introduction', speakerRole: 'toastmaster' },
        { id: 'opening-theme', duration: 4, agendaItem: 'Theme introduction', speakerRole: 'toastmaster' },
        { id: 'opening-ge-intro', duration: 1, agendaItem: 'Toastmaster introduces General Evaluator', speakerRole: 'toastmaster' },
      ],
    },
    rolePlayers: {
      id: 'role-players',
      title: 'Role Players Introduction',
      rows: [
        { id: 'role-ge', duration: 3, agendaItem: 'General Evaluator address', speakerRole: 'generalEvaluator' },
        { id: 'role-timer', duration: 1, agendaItem: 'Timer introduction', speakerRole: 'timer' },
        { id: 'role-ah', duration: 1, agendaItem: 'Ah-Counter introduction', speakerRole: 'ahCounter' },
        { id: 'role-grammarian', duration: 2, agendaItem: 'Grammarian / Idiom Master introduction', speakerRole: 'grammarian' },
        { id: 'role-listening', duration: 1, agendaItem: 'Listening Master introduction', speakerRole: 'listeningMaster' },
      ],
    },
    evaluations: {
      id: 'evaluations',
      title: 'Evaluation Segment',
      beforeSpeechEvaluations: [
        { id: 'eval-call-reports', duration: 1, agendaItem: 'General Evaluator calls for reports', speakerRole: 'generalEvaluator' },
        { id: 'eval-listening', duration: 3, agendaItem: 'Listening Master quiz', speakerRole: 'listeningMaster' },
        { id: 'eval-timer', duration: 2, agendaItem: 'Timer report', speakerRole: 'timer' },
        { id: 'eval-ah', duration: 2, agendaItem: 'Ah-Counter report', speakerRole: 'ahCounter' },
        { id: 'eval-grammarian', duration: 2, agendaItem: 'Grammarian / Idiom Master report', speakerRole: 'grammarian' },
      ],
      afterSpeechEvaluations: [
        { id: 'eval-ge-report', duration: 5, agendaItem: 'General Evaluator report', speakerRole: 'generalEvaluator' },
        { id: 'eval-theme-close', duration: 3, agendaItem: 'Theme conclusion', speakerRole: 'toastmaster' },
      ],
      close: { id: 'meeting-close', duration: 1, agendaItem: 'Meeting close', speakerRole: 'presidingOfficer' },
    },
  },
}
