export const drawerLabels = {
  new: 'New',
  open: 'Open',
  save: 'Save',
  saveAs: 'Save\u00A0As',
  export: 'Export',
  theme: 'Theme',
  settings: 'Settings',
  feedback: 'Feedback',
  help: 'Help',
  about: 'About',
}

export const snackbarMessages = {
  genericError: 'Something went wrong, try again later...',
  feedbackReceived: 'Feedback received!',
  largeGrid: 'For large grid, consider using devices with wider viewport.',
  fetching: 'Requesting from sever...',
  fetchSuccess: 'Request succeeded, applying changes....',
  fetchTimeout: 'Timeout! Please try again at another time!',
  alreadySolved: 'Grid is already solved',
  cellConflicts: 'Please check conflicts within grid!',
}

export const errorMessages = {
  noActiveSudoku: 'No active sudoku!',
}

export const tooltips = {
  toggleThemeType: 'Toggle light/dark theme',
  fetching: 'Waiting for request...',
  solve: 'Request solution',
  generate: 'Fill in empty cells',
  togglePencil: 'Toggle pencil',
  press: 'Press',
  clearCells: 'Clear cell(s)',
}


export const dialogLabels = {
  newTab: 'New Sudoku Tab',
  sudokuName: {
    label: 'Name',
    placeholder: 'Sudoku Name'
  },
  name: 'Name',
  cancel: 'Cancel',
  create: 'Create',
  format: 'Format',
  size: 'Size',
  export: drawerLabels.export,
  saveAs: drawerLabels.saveAs,
  save: drawerLabels.save,
  choose: 'Choose',
  open: drawerLabels.open,
  preview: 'Preview',
  apply: 'Apply',
  settings: drawerLabels.settings,
  default: 'Default',
  about: drawerLabels.about,
  source: 'Source',
  close: 'Close',
  feedback: drawerLabels.feedback,
  general: 'General',
  bugReport: 'Bug Report',
  featureRequest: 'Feature Request',
  title: 'Title',
  details: 'Details',
  send: 'Send',
  feedbackAboutHint: 'Select a tag',
  feedbackGeneralHint: 'Tell us more...',
  feedbackBugReportHint: 'Include steps to reproduce, expected vs actual results, ...',
  sudokus: {
    sizeHint: 'Grid size',
    valueMapping: 'Value Mapping',
    valueMappingHint: 'Insert any UTF-16 character',
  },
  saveYourWork: 'Save Your Work!',
  saveAsOnTabClosePrompt: 'Closed tabs are not retrievable. Save your work to local disk?',
  doNotShowAgain: 'Don\'t show again!',
  settingsDefaultConfirmation: `Settings in this panel will be set temporarily to default! Click 'Apply' when ready to commit.`,
  proceed: 'Proceed',
  appearance: 'Appearance',
  applyAllAndClose: 'Apply All & Close',
  currentSudoku: 'Current Sudoku',
  help: drawerLabels.help,
  alreadyOpenMessage: 'Another pqSudoku application has already been open. You can utilize pqSudoku\'s multi-tab functionality for better experience.',
  alreadyOpen: 'Already Open?',
  back: 'Back',
  next: 'Next',
  skip: 'Skip',
  getStarted: 'Get Started',
  tour: 'Tour',
  solve: 'Solve',
  generate: 'Generate',
}

export const pqSudoku = 'pqSudoku';

//TODO: refactor & organize