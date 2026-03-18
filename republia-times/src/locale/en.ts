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
  govName: string;
  enemyName: string;
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
  ui_startWork: 'Begin your Mission',
  ui_endDay: 'End Cycle',
  ui_goToSleep: 'Stand Down',
  ui_sendToPrint: 'Transmit to HoloNet',
  ui_acceptFate: 'Accept Directive',
  ui_letsGo: 'Proceed',
  ui_readers: 'Systems Reached',
  ui_loyalty: 'Loyalty',
  ui_results: 'CENSORSHIP REPORT',
  ui_day: 'Cycle',
  ui_credits: 'Imperial Security Bureau (ISB)',
  ui_newsFeed: 'HoloNet Feed',
  govName: 'Galactic Empire',
  enemyName: 'Rebel Alliance',
  ui_dragArticles: 'Assign Reports\nto Bulletin',

  popup_dayOver: 'Cycle complete. HoloNet transmission window closing.',

  // Morning
  morning_welcome: 'Welcome to The [GOV] Gazette. You have been assigned as Chief Propaganda Editor.',
  morning_warOver: 'Open conflict with the [ENE] has transitioned to occupation. Insurgent activity persists.',
  morning_publicNotLoyal: 'Citizen compliance remains below acceptable security thresholds.',
  morning_freedomReturned: 'Order and Stability have been restored, though public perception remains uncertain.',
  morning_jobIncreaseLoyalty: 'Your duty is to purge sedition. Select reports that reinforce absolute trust in the [GOV].',
  morning_haveDaysLoyalty: (d, t) => `You have ${d} cycles to reach compliance level ${t}.`,
  morning_newFamily: 'You have been assigned a new family unit. They remain under Imperial "protection".',
  morning_familyHostage: 'Your family unit remains under preventive custody to ensure your efficiency.',

  morning_firstTaskComplete: 'Initial indoctrination directive completed. Performance logged.',
  morning_continuePrint: (t) => `Maintain Imperial compliance at ${t} or higher.`,
  morning_increaseReadership: 'Expand signal reach. Total control depends on audience size across sectors.',
  morning_attainReaders: (c, d) => `Reach ${c} systems by cycle ${d}.`,
  morning_failedInspire: 'You failed to influence public perception according to COMPNOR standards.',

  morning_secondTaskComplete: 'Secondary directive completed. Direct ISB oversight reduced.',
  morning_withdrawOversight: 'Direct supervision of your terminal will now be limited. Do not fail.',
  morning_continueIncrease: 'Continue expanding the official doctrine while maintaining narrative consistency.',
  morning_failedReaders: (t) => `Insufficient reach with compliance level ${t}. Influence in the sector reduced.`,

  morning_goodWork: 'Performance recorded. The Empire is watching your progress.',
  morning_keepLoyalty: (t) => `Maintain compliance at ${t}.`,
  morning_goodProgress: 'Progress acceptable for High Command.',
  morning_keepWorking: (t, d) => `Reach compliance ${t} by cycle ${d}.`,
  morning_loyaltyDropping: 'Dangerous decline in compliance detected. Do not tolerate dissent.',
  morning_loyaltyNotImproving: 'Compliance stagnation detected. Current propaganda is ineffective.',
  morning_tryHarder: 'Adjust editorial selection. Prioritize stability and order narratives.',
  morning_bringLoyalty: (t, d) => `Raise compliance to ${t} by cycle ${d} or face processing.`,
  morning_maintainReaders: (c) => `Maintain ${c} systems reached.`,
  morning_mustHaveReaders: (c, d) => `Reach ${c} systems by cycle ${d}.`,

  // Rebel path
  morning_goodMorning: 'Fulcrum signal received.',
  morning_loyaltyDropNoted: 'Compliance is dropping. The spark of rebellion grows. Continue.',

  morning_killMessage: 'Your assignment has been terminated. Elimination protocols engaged.',

  morning_rebelsWon: 'The signal of freedom spreads through the galaxy.',
  morning_rebelThanks: 'You have successfully disrupted Imperial control channels.',
  morning_rebelSorry: 'We could not extract your entire family unit in time.',
  morning_rebelNewPosition: 'Your skills are needed by the Alliance in other sectors.',
  morning_longLive: 'Long Live the [GOV]!',

  morning_reviewedFile: 'Your record has been audited by the Security Bureau.',
  morning_oldTechnology: 'Physical print distribution is arcaic. HoloNet digital channels must be prioritized.',

  // Performance
  perf_header: 'Loyalty Evaluation:',
  perf_appreciated: 'LOYAL / OPTIMAL',
  perf_acceptable: 'ACCEPTABLE',
  perf_marginal: 'UNDER WATCH',
  perf_unsatisfactory: 'INADEQUATE',
  perf_disastrous: 'TREASON / CRITICAL FAILURE',
  perf_disappointing: 'INSUFFICIENT',

  // Family
  family_prefix: 'Your family unit ',
  family_excellent: 'enjoys privileges in the upper levels of Coruscant.',
  family_wellCared: 'remains in stable living conditions.',
  family_normal: 'remains under standard supervision.',
  family_lostPrivileges: 'has lost rations and transit privileges.',
  family_dailyBeatings: 'is undergoing corrective interrogation.',
  family_suffers: 'is experiencing the consequences of your negligence.',
  family_punished: 'has been sent to re-education centers.',

  // Tutorial
  tutorial_separator: '__________________________________________',
  tutorial_day2_title: 'Report Weight',
  tutorial_day2_body: 'Larger reports dominate HoloNet attention and have greater impact on perception.',
  tutorial_day3_title: 'Sector Interest',
  tutorial_day3_body: 'Citizens respond to military, entertainment, and major Core World events.',
  tutorial_day4_title: 'Layout',
  tutorial_day4_body: 'Placement does not affect impact; only the censored content matters.',
  tutorial_day5_title: 'Planetary Conditions',
  tutorial_day5_body: 'Weather reports are neutral and do not affect Imperial compliance.',
  tutorial_day6_title: 'Political Indoctrination',
  tutorial_day6_body: 'Political reports increase compliance but attract less attention than entertainment.',
  tutorial_day7_title: 'Volume vs Relevance',
  tutorial_day7_body: 'Public interest depends on the topic, not the size of the report.',

  // Night
  night_printed: 'HoloNet transmission complete.',
  night_loyalty: 'Compliance',
  night_readership: 'Reach',
  night_noChange: 'no change',

  // Comments
  comment_blankPaper: 'No transmission sent. Information vacuum weakens our control.',
  comment_tooFewArticles: 'Insufficient content. Reach reduced as citizens seek other feeds.',
  comment_notEnoughInteresting: 'Low-interest reports. Signal reach reduced.',
  comment_manyInteresting: 'Effective selection. Influence expanded across the sector.',
  comment_loyaltyIncreased: 'Imperial compliance increased.',
  comment_loyaltyDecreased: 'Dissent detected; compliance decreased.',
  comment_influenceExpanded: 'Influence expanded to new systems.',
  comment_influenceReduced: 'Influence in the sector reduced.',
};