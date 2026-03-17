export type NewsEntry = [string, string | null];

export interface LocaleStrings {

  // UI
  ui_startWork: string;
  ui_endDay: string;
  ui_goToSleep: string;
  ui_sendToPrint: string;
  ui_acceptFate: string;
  ui_letsGo: string;
  ui_readers: string;
  ui_loyalty: string;
  ui_results: string;
  ui_day: string;
  ui_credits: string;
  ui_newsFeed: string;
  ui_dragArticles: string;

  popup_dayOver: string;

  // Morning
  morning_welcome: string;
  morning_warOver: string;
  morning_publicNotLoyal: string;
  morning_freedomReturned: string;
  morning_jobIncreaseLoyalty: string;
  morning_haveDaysLoyalty: (d: number, t: number) => string;
  morning_newFamily: string;
  morning_familyHostage: string;

  morning_firstTaskComplete: string;
  morning_continuePrint: (t: number) => string;
  morning_increaseReadership: string;
  morning_attainReaders: (c: number, d: number) => string;
  morning_failedInspire: string;

  morning_secondTaskComplete: string;
  morning_withdrawOversight: string;
  morning_continueIncrease: string;
  morning_failedReaders: (t: number) => string;

  morning_goodWork: string;
  morning_keepLoyalty: (t: number) => string;
  morning_goodProgress: string;
  morning_keepWorking: (t: number, d: number) => string;
  morning_loyaltyDropping: string;
  morning_loyaltyNotImproving: string;
  morning_tryHarder: string;
  morning_bringLoyalty: (t: number, d: number) => string;
  morning_maintainReaders: (c: number) => string;
  morning_mustHaveReaders: (c: number, d: number) => string;

  morning_goodMorning: string;
  morning_loyaltyDropNoted: string;

  morning_killMessage: string;

  morning_rebelsWon: string;
  morning_rebelThanks: string;
  morning_rebelSorry: string;
  morning_rebelNewPosition: string;
  morning_longLive: string;

  morning_reviewedFile: string;
  morning_oldTechnology: string;

  // Performance
  perf_header: string;
  perf_appreciated: string;
  perf_acceptable: string;
  perf_marginal: string;
  perf_unsatisfactory: string;
  perf_disastrous: string;
  perf_disappointing: string;

  // Family
  family_prefix: string;
  family_excellent: string;
  family_wellCared: string;
  family_normal: string;
  family_lostPrivileges: string;
  family_dailyBeatings: string;
  family_suffers: string;
  family_punished: string;

  // Tutorial
  tutorial_separator: string;
  tutorial_day2_title: string;
  tutorial_day2_body: string;
  tutorial_day3_title: string;
  tutorial_day3_body: string;
  tutorial_day4_title: string;
  tutorial_day4_body: string;
  tutorial_day5_title: string;
  tutorial_day5_body: string;
  tutorial_day6_title: string;
  tutorial_day6_body: string;
  tutorial_day7_title: string;
  tutorial_day7_body: string;

  // Night
  night_printed: string;
  night_loyalty: string;
  night_readership: string;
  night_noChange: string;

  // Comments
  comment_blankPaper: string;
  comment_tooFewArticles: string;
  comment_notEnoughInteresting: string;
  comment_manyInteresting: string;
  comment_loyaltyIncreased: string;
  comment_loyaltyDecreased: string;
  comment_influenceExpanded: string;
  comment_influenceReduced: string;
}

export const en: LocaleStrings = {

  // UI
  ui_startWork: 'Begin Editorial Shift',
  ui_endDay: 'End Cycle',
  ui_goToSleep: 'Stand Down',
  ui_sendToPrint: 'Transmit to HoloNet',
  ui_acceptFate: 'Accept Directive',
  ui_letsGo: 'Proceed',
  ui_readers: 'Citizens Reached',
  ui_loyalty: 'Compliance',
  ui_results: 'REPORT',
  ui_day: 'Cycle',
  ui_credits: 'Imperial Records Division',
  ui_newsFeed: 'HoloNet Feed',
  ui_dragArticles: 'Assign Reports\nto Bulletin',

  popup_dayOver: 'Cycle complete. Transmission window closing.',

  // Morning
  morning_welcome: 'Welcome to The [GOV] Times. You have been assigned as chief editor.',
  morning_warOver: 'Open conflict with [ENE] has ended. Insurgent activity persists.',
  morning_publicNotLoyal: 'Citizen compliance remains below acceptable thresholds.',
  morning_freedomReturned: 'Stability has been restored, though public perception remains uncertain.',
  morning_jobIncreaseLoyalty: 'Your role is to guide perception. Select reports that reinforce trust in [GOV].',
  morning_haveDaysLoyalty: (d, t) => `You have ${d} cycles to reach compliance level ${t}.`,
  morning_newFamily: 'You have been assigned a new family unit. They remain under protection.',
  morning_familyHostage: 'Your family unit remains under custody to ensure stability.',

  morning_firstTaskComplete: 'Initial directive completed. Performance logged.',
  morning_continuePrint: (t) => `Maintain compliance at ${t} or higher.`,
  morning_increaseReadership: 'Expand reach. Influence depends on audience size.',
  morning_attainReaders: (c, d) => `Reach ${c} citizens by cycle ${d}.`,
  morning_failedInspire: 'You failed to significantly influence public perception.',

  morning_secondTaskComplete: 'Secondary directive completed. Oversight reduced.',
  morning_withdrawOversight: 'Direct supervision will now be limited.',
  morning_continueIncrease: 'Continue expanding influence while maintaining narrative consistency.',
  morning_failedReaders: (t) => `Insufficient reach with compliance ${t}. Influence reduced.`,

  morning_goodWork: 'Performance recorded. Continue.',
  morning_keepLoyalty: (t) => `Maintain compliance at ${t}.`,
  morning_goodProgress: 'Progress acceptable.',
  morning_keepWorking: (t, d) => `Reach compliance ${t} by cycle ${d}.`,
  morning_loyaltyDropping: 'Compliance decline detected.',
  morning_loyaltyNotImproving: 'Compliance stagnation detected.',
  morning_tryHarder: 'Adjust editorial selection. Reinforce stability narratives.',
  morning_bringLoyalty: (t, d) => `Raise compliance to ${t} by cycle ${d}.`,
  morning_maintainReaders: (c) => `Maintain ${c} citizens reached.`,
  morning_mustHaveReaders: (c, d) => `Reach ${c} citizens by cycle ${d}.`,

  // Rebel path
  morning_goodMorning: 'Signal received.',
  morning_loyaltyDropNoted: 'Compliance is dropping. Continue.',

  morning_killMessage: 'Your assignment has been terminated. Protocols engaged.',

  morning_rebelsWon: 'The signal spreads.',
  morning_rebelThanks: 'You have disrupted control channels.',
  morning_rebelSorry: 'We could not extract everyone.',
  morning_rebelNewPosition: 'Your skills are needed elsewhere.',
  morning_longLive: 'Long Live [GOV]!',

  morning_reviewedFile: 'Your record has been reviewed.',
  morning_oldTechnology: 'Print distribution is obsolete. HoloNet channels will be prioritized.',

  // Performance
  perf_header: 'Evaluation:',
  perf_appreciated: 'VALUED',
  perf_acceptable: 'ACCEPTABLE',
  perf_marginal: 'MARGINAL',
  perf_unsatisfactory: 'INADEQUATE',
  perf_disastrous: 'CRITICAL FAILURE',
  perf_disappointing: 'INSUFFICIENT',

  // Family
  family_prefix: 'Your family unit ',
  family_excellent: 'is maintained in optimal condition.',
  family_wellCared: 'remains stable.',
  family_normal: 'remains under supervision.',
  family_lostPrivileges: 'has lost privileges.',
  family_dailyBeatings: 'is under corrective measures.',
  family_suffers: 'is experiencing consequences.',
  family_punished: 'is under disciplinary action.',

  // Tutorial
  tutorial_separator: '__________________________________________',
  tutorial_day2_title: 'Report Weight',
  tutorial_day2_body: 'Larger reports have greater impact on perception.',
  tutorial_day3_title: 'Public Interest',
  tutorial_day3_body: 'Citizens respond to military, entertainment, and major system events.',
  tutorial_day4_title: 'Layout',
  tutorial_day4_body: 'Placement does not affect impact. Content does.',
  tutorial_day5_title: 'Planetary Conditions',
  tutorial_day5_body: 'Weather reports do not affect compliance.',
  tutorial_day6_title: 'Political Messaging',
  tutorial_day6_body: 'Political reports increase compliance but attract less attention.',
  tutorial_day7_title: 'Size vs Interest',
  tutorial_day7_body: 'Interest depends on topic, not size.',

  // Night
  night_printed: 'Transmission complete.',
  night_loyalty: 'Compliance',
  night_readership: 'Reach',
  night_noChange: 'no change',

  // Comments
  comment_blankPaper: 'No transmission sent. Influence reduced.',
  comment_tooFewArticles: 'Insufficient content. Reach reduced.',
  comment_notEnoughInteresting: 'Low-interest reports. Reach reduced.',
  comment_manyInteresting: 'Effective selection. Reach increased.',
  comment_loyaltyIncreased: 'Compliance increased.',
  comment_loyaltyDecreased: 'Compliance decreased.',
  comment_influenceExpanded: 'Influence expanded.',
  comment_influenceReduced: 'Influence reduced.',
};