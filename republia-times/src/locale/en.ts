// English locale — all player-visible strings extracted from game source
// This is the reference/fallback locale.

// News item type: [blurbText, articleText | null]
export type NewsEntry = [string, string | null];

export interface LocaleStrings {
  // UI Labels
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

  // CenterPopup
  popup_dayOver: string;

  // MorningScene messages
  morning_welcome: string;
  morning_warOver: string;
  morning_publicNotLoyal: string;
  morning_freedomReturned: string;
  morning_jobIncreaseLoyalty: string;
  morning_haveDaysLoyalty: (days: number, target: number) => string;
  morning_newFamily: string;
  morning_familyHostage: string;
  morning_firstTaskComplete: string;
  morning_continuePrint: (target: number) => string;
  morning_increaseReadership: string;
  morning_attainReaders: (count: number, day: number) => string;
  morning_failedInspire: string;
  morning_secondTaskComplete: string;
  morning_withdrawOversight: string;
  morning_continueIncrease: string;
  morning_failedReaders: (target: number) => string;
  morning_goodWork: string;
  morning_keepLoyalty: (target: number) => string;
  morning_goodProgress: string;
  morning_keepWorking: (target: number, day: number) => string;
  morning_loyaltyDropping: string;
  morning_loyaltyNotImproving: string;
  morning_tryHarder: string;
  morning_bringLoyalty: (target: number, day: number) => string;
  morning_maintainReaders: (count: number) => string;
  morning_mustHaveReaders: (count: number, day: number) => string;
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

  // NightScene
  night_printed: string;
  night_loyalty: string;
  night_readership: string;
  night_noChange: string;

  // Readership comments
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
  // ── UI Labels ──
  ui_startWork: 'Start Work',
  ui_endDay: 'End Day',
  ui_goToSleep: 'Go to Sleep',
  ui_sendToPrint: 'Send to Print',
  ui_acceptFate: 'Accept Fate',
  ui_letsGo: "Let's Go!",
  ui_readers: 'Readers',
  ui_loyalty: 'Loyalty',
  ui_results: 'RESULTS',
  ui_day: 'Day',
  ui_credits: 'by\nLucas Pope\n@dukope',
  ui_newsFeed: 'News Feed',
  ui_dragArticles: 'Drag Articles\nto Paper',

  // ── CenterPopup (PlayScene day-over) ──
  popup_dayOver: 'The day is over. There is no more time. We must send to print immediately.',

  // ── MorningScene messages ──
  morning_welcome: 'Welcome to The [GOV] Times. You are the new editor-in-chief.',
  morning_warOver: 'The war with [ENE] is over and the rebellion uprising has been crushed. Order is slowly returning to [GOV].',
  morning_publicNotLoyal: 'The public is not loyal to the government.',
  morning_freedomReturned: 'Freedom has returned to [GOV], but the public is skeptical.',
  morning_jobIncreaseLoyalty: 'It is your job to increase their loyalty by editing The [GOV] Times carefully. Pick only stories that highlight the good things about [GOV] and its government.',
  morning_haveDaysLoyalty: (days: number, target: number) => `You have ${days} days to raise the public's loyalty to ${target}.`,
  morning_newFamily: 'We have found a new wife and child for you. As a precaution against influence, we are keeping them in a safe location.',
  morning_familyHostage: 'As a precaution against influence, we are keeping your wife and child in a safe location.',

  // Goal transitions
  morning_firstTaskComplete: 'You have completed your first task. The Great and Honorable Leader is pleased.',
  morning_continuePrint: (target: number) => `Continue to print positive articles and maintain a loyalty of at least ${target}.`,
  morning_increaseReadership: 'We must now work to increase readership. More minds is more power.',
  morning_attainReaders: (count: number, day: number) => `Attain at least ${count} readers by the end of day ${day}.`,
  morning_failedInspire: 'You have failed to inspire your readers and their loyalty remains weak.',

  morning_secondTaskComplete: 'Congratulations, you have completed your second task. The Great and Honorable Leader is pleased.',
  morning_withdrawOversight: 'From this point we will withdraw our close oversight.',
  morning_continueIncrease: 'Continue to increase readership and maintain the promotion of positive news.',
  morning_failedReaders: (target: number) => `You have failed to acquire enough readers with loyalty ${target}. Without a loyal audience, The [GOV] Times has no influence.`,

  // Ongoing state goal messages
  morning_goodWork: 'Good work. The Great and Honorable Leader has been notified of your diligent efforts.',
  morning_keepLoyalty: (target: number) => `Keep your reader's loyalty at ${target} or higher.`,
  morning_goodProgress: 'You are making good progress.',
  morning_keepWorking: (target: number, day: number) => `Keep working towards a loyalty of ${target} or above by the end of day ${day}.`,
  morning_loyaltyDropping: 'This is not good. Loyalty is dropping.',
  morning_loyaltyNotImproving: 'This is not good. Loyalty is not improving.',
  morning_tryHarder: 'You must choose positive articles that cast [GOV] in a good light. Try harder.',
  morning_bringLoyalty: (target: number, day: number) => `Bring your reader's loyalty to at least ${target} by the end of day ${day}.`,
  morning_maintainReaders: (count: number) => `Maintain at least ${count} readers.`,
  morning_mustHaveReaders: (count: number, day: number) => `You must have ${count} or more readers by the end of day ${day}.`,

  // Rebel / free goal messages
  morning_goodMorning: 'Good morning.',
  morning_loyaltyDropNoted: 'A drop in reader loyalty has been noted. Try harder.',

  // Kill message
  morning_killMessage: 'Your services are no longer required. Your family has been eliminated and you will be reassigned.',

  // Rebel victory
  morning_rebelsWon: 'We have done it!',
  morning_rebelThanks: 'Thank you my friend! Without your efforts the rebellion would have failed once again. A new era for our beloved nation begins!',
  morning_rebelSorry: "I'm truly sorry that we could not save your family.",
  morning_rebelNewPosition: 'We need someone with your skills to talk with the people. Come back tomorrow for your new position.',
  morning_longLive: 'Long Live [GOV]!',

  // State ending (game over after last day)
  morning_reviewedFile: 'We have reviewed your file.',
  morning_oldTechnology: 'The Great and Honorable Leader has decided that printed paper is old technology. The Ministry of Media will be moving to focus on online communications.',

  // ── Performance messages ──
  perf_header: 'Your performance is: -',
  perf_appreciated: 'APPRECIATED',
  perf_acceptable: 'ACCEPTABLE',
  perf_marginal: 'MARGINAL',
  perf_unsatisfactory: 'UNSATISFACTORY',
  perf_disastrous: 'DISASTROUS',
  perf_disappointing: 'DISAPPOINTING',

  // ── Family messages ──
  family_prefix: 'Your family ',
  family_excellent: 'is receiving excellent treatment.',
  family_wellCared: 'is being well-cared for.',
  family_normal: 'lives normally under our care.',
  family_lostPrivileges: 'has lost several privileges.',
  family_dailyBeatings: 'endures daily beatings.',
  family_suffers: 'suffers due to your failures.',
  family_punished: 'is being punished for your poor performance.',

  // ── Tutorial tips (days 2-7) ──
  tutorial_separator: '__________________________________________',
  tutorial_day2_title: 'Article Size',
  tutorial_day2_body: "Larger articles have more influence on your reader's loyalty. Use this to emphasize the stories you want and to downplay unflattering ones.",
  tutorial_day3_title: 'Reader Interest',
  tutorial_day3_body: 'The public is interested in sports, entertainment, and military matters. They are also fascinated by the weather. Choose stories on these topics to increase readership.',
  tutorial_day4_title: 'Article Positioning',
  tutorial_day4_body: 'Article placement has no effect on loyalty or reader interest. Only the size and content of stories matter. Use your vast artistic and design experience to arrange articles in a way that pleases you.',
  tutorial_day5_title: 'Weather',
  tutorial_day5_body: 'The government cannot control the weather yet. As a result, articles about the weather do not affect loyalty.',
  tutorial_day6_title: 'Politics',
  tutorial_day6_body: 'The public finds political stories uninteresting, but positive articles on political subjects can increase loyalty.',
  tutorial_day7_title: 'Article Size and Reader Interest',
  tutorial_day7_body: 'Article size does not affect reader interest. If a paper contains articles on interesting topics of any size, readers will be interested.',

  // ── NightScene results ──
  night_printed: "Today's issue has been printed and distributed.",
  night_loyalty: 'Loyalty',
  night_readership: 'Readership',
  night_noChange: 'no change',

  // ── Readership comments ──
  comment_blankPaper: 'The paper is blank. Money was saved on ink, but you have lost many readers.',
  comment_tooFewArticles: 'There are too few articles. You have lost readers.',
  comment_notEnoughInteresting: 'There are not enough interesting articles. You have lost readers.',
  comment_manyInteresting: 'There are many interesting articles. You have gained readers.',
  comment_loyaltyIncreased: "The included articles have increased your readership's loyalty to the government.",
  comment_loyaltyDecreased: "The included articles have decreased your readership's loyalty to the government.",
  comment_influenceExpanded: "The paper's increasing readership has expanded its influence.",
  comment_influenceReduced: "The paper's decreasing readership has reduced its influence.",
};
