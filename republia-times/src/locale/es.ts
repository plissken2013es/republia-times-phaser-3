// Spanish locale — first-draft translation for user review
// English originals shown as comments for reference.
// NOTE: Article headlines (articleText) use ASCII-only chars because
// MotorolaScreentype/SILKWONDER/SG03 fonts lack Latin accented characters.
// Feed blurb text (nokiafc22) supports full Latin-1 including accents.

import type { LocaleStrings } from './en';

export const es: LocaleStrings = {
  // ── UI Labels ──
  // 'Start Work'
  ui_startWork: 'Empezar a Trabajar',
  // 'End Day'
  ui_endDay: 'Terminar',
  // 'Go to Sleep'
  ui_goToSleep: 'Ir a Dormir',
  // 'Send to Print'
  ui_sendToPrint: 'Enviar a Imprenta',
  // 'Accept Fate'
  ui_acceptFate: 'Acepte su Destino',
  // "Let's Go!"
  ui_letsGo: '¡Vamos!',
  // 'Readers'
  ui_readers: 'Lectores',
  // 'Loyalty'
  ui_loyalty: 'Lealtad',
  // 'RESULTS'
  ui_results: 'RESULTADOS',
  // 'Day'
  ui_day: 'Día',
  // 'by\nLucas Pope\n@dukope'
  ui_credits: 'por\nLucas Pope\n@dukope',
  // 'News Feed'
  ui_newsFeed: 'Noticias',
  // 'Drag Articles\nto Paper'
  ui_dragArticles: 'Arrastre \nal Periódico',

  // ── CenterPopup (PlayScene day-over) ──
  // 'The day is over. There is no more time. We must send to print immediately.'
  popup_dayOver: 'El día ha terminado. No queda tiempo. Debemos enviar a imprenta inmediatamente.',

  // ── MorningScene messages ──
  // 'Welcome to The [GOV] Times. You are the new editor-in-chief.'
  morning_welcome: 'Bienvenido a The [GOV] Times. Usted es el nuevo editor en jefe.',
  // 'The war with Antegria is over and the rebellion uprising has been crushed. Order is slowly returning to [GOV].'
  morning_warOver: 'La guerra con Antegria ha terminado y el levantamiento rebelde ha sido aplastado. El orden está volviendo lentamente a [GOV].',
  // 'The public is not loyal to the government.'
  morning_publicNotLoyal: 'El público no es leal al gobierno.',
  // 'Freedom has returned to [GOV], but the public is skeptical.'
  morning_freedomReturned: 'La libertad ha vuelto a [GOV], pero el público es escéptico.',
  // 'It is your job to increase their loyalty by editing The [GOV] Times carefully. Pick only stories that highlight the good things about [GOV] and its government.'
  morning_jobIncreaseLoyalty: 'Su trabajo es aumentar su lealtad editando The [GOV] Times con cuidado. Elija solo noticias que destaquen lo bueno de [GOV] y su gobierno.',
  // `You have ${days} days to raise the public's loyalty to ${target}.`
  morning_haveDaysLoyalty: (days: number, target: number) => `Tiene ${days} días para elevar la lealtad del público a ${target}.`,
  // 'We have found a new wife and child for you. As a precaution against influence, we are keeping them in a safe location.'
  morning_newFamily: 'Hemos encontrado una nueva esposa e hijo para usted. Como precaución, los mantenemos en un lugar seguro.',
  // 'As a precaution against influence, we are keeping your wife and child in a safe location.'
  morning_familyHostage: 'Como precaución, mantenemos a su esposa e hijo en un lugar seguro.',

  // Goal transitions
  // 'You have completed your first task. The Great and Honorable Leader is pleased.'
  morning_firstTaskComplete: 'Ha completado su primera tarea. El Gran y Honorable Líder está complacido.',
  // `Continue to print positive articles and maintain a loyalty of at least ${target}.`
  morning_continuePrint: (target: number) => `Continúe publicando artículos positivos y mantenga una lealtad de al menos ${target}.`,
  // 'We must now work to increase readership. More minds is more power.'
  morning_increaseReadership: 'Ahora debemos trabajar para aumentar los lectores. Más mentes es más poder.',
  // `Attain at least ${count} readers by the end of day ${day}.`
  morning_attainReaders: (count: number, day: number) => `Alcance al menos ${count} lectores al final del día ${day}.`,
  // 'You have failed to inspire your readers and their loyalty remains weak.'
  morning_failedInspire: 'Ha fallado en inspirar a sus lectores y su lealtad sigue siendo débil.',

  // 'Congratulations, you have completed your second task. The Great and Honorable Leader is pleased.'
  morning_secondTaskComplete: 'Felicidades, ha completado su segunda tarea. El Gran y Honorable Líder está complacido.',
  // 'From this point we will withdraw our close oversight.'
  morning_withdrawOversight: 'A partir de ahora suavizaremos nuestra estricta supervisión.',
  // 'Continue to increase readership and maintain the promotion of positive news.'
  morning_continueIncrease: 'Continúe aumentando los lectores y manteniendo la proporción de noticias positivas.',
  // `You have failed to acquire enough readers with loyalty ${target}. Without a loyal audience, The [GOV] Times has no influence.`
  morning_failedReaders: (target: number) => `Ha fallado en conseguir suficientes lectores con lealtad ${target}. Sin una audiencia leal, The [GOV] Times no tiene influencia.`,

  // Ongoing state goal messages
  // 'Good work. The Great and Honorable Leader has been notified of your diligent efforts.'
  morning_goodWork: 'Buen trabajo. El Gran y Honorable Líder ha sido notificado de sus diligentes esfuerzos.',
  // `Keep your reader's loyalty at ${target} or higher.`
  morning_keepLoyalty: (target: number) => `Mantenga la lealtad de sus lectores en ${target} o superior.`,
  // 'You are making good progress.'
  morning_goodProgress: 'Está haciendo buen progreso.',
  // `Keep working towards a loyalty of ${target} or above by the end of day ${day}.`
  morning_keepWorking: (target: number, day: number) => `Intente lograr una lealtad de ${target} o superior para el final del día ${day}.`,
  // 'This is not good. Loyalty is dropping.'
  morning_loyaltyDropping: 'No pinta bien. La lealtad está cayendo.',
  // 'This is not good. Loyalty is not improving.'
  morning_loyaltyNotImproving: 'Mala cosa. La lealtad no mejora.',
  // 'You must choose positive articles that cast [GOV] in a good light. Try harder.'
  morning_tryHarder: 'Debe elegir artículos positivos que presenten a [GOV] de buena manera. Esfuércese más.',
  // `Bring your reader's loyalty to at least ${target} by the end of day ${day}.`
  morning_bringLoyalty: (target: number, day: number) => `Eleve la lealtad de sus lectores al menos a ${target} para el final del día ${day}.`,
  // `Maintain at least ${count} readers.`
  morning_maintainReaders: (count: number) => `Mantenga al menos ${count} lectores.`,
  // `You must have ${count} or more readers by the end of day ${day}.`
  morning_mustHaveReaders: (count: number, day: number) => `Debe tener ${count} o más lectores para el final del día ${day}.`,

  // Rebel / free goal messages
  // 'Good morning.'
  morning_goodMorning: 'Buenos días.',
  // 'A drop in reader loyalty has been noted. Try harder.'
  morning_loyaltyDropNoted: 'Se ha producido una caída en la lealtad. Esfuércese más.',

  // Kill message
  // 'Your services are no longer required. Your family has been eliminated and you will be reassigned.'
  morning_killMessage: 'Sus servicios ya no son necesarios. Su familia ha sido eliminada y usted será reasignado.',

  // Rebel victory
  // 'We have done it!'
  morning_rebelsWon: '¡Lo hemos logrado!',
  // 'Thank you my friend! Without your efforts the rebellion would have failed once again. A new era for our beloved nation begins!'
  morning_rebelThanks: '¡Gracias, camarada! Sin sus esfuerzos la rebelión habría fracasado una vez más. ¡Una nueva era comienza para nuestra querida nación!',
  // "I'm truly sorry that we could not save your family."
  morning_rebelSorry: 'Lamento profundamente que no pudiéramos salvar a su familia.',
  // 'We need someone with your skills to talk with the people. Come back tomorrow for your new position.'
  morning_rebelNewPosition: 'Necesitamos a alguien con sus habilidades para hablar con el pueblo. Vuelva mañana para su nuevo puesto.',
  // 'Long Live [GOV]!'
  morning_longLive: '¡Larga Vida a [GOV]!',

  // State ending (game over after last day)
  // 'We have reviewed your file.'
  morning_reviewedFile: 'Hemos revisado su expediente.',
  // 'The Great and Honorable Leader has decided that printed paper is old technology. The Ministry of Media will be moving to focus on online communications.'
  morning_oldTechnology: 'El Gran y Honorable Líder ha decidido que el papel impreso es tecnología obsoleta. El Ministerio de Medios se centrará en las comunicaciones en línea.',

  // ── Performance messages ──
  // 'Your performance is: -'
  perf_header: 'Su rendimiento es: -',
  perf_appreciated: 'APRECIADO',
  perf_acceptable: 'ACEPTABLE',
  perf_marginal: 'MARGINAL',
  perf_unsatisfactory: 'INSATISFACTORIO',
  perf_disastrous: 'DESASTROSO',
  perf_disappointing: 'DECEPCIONANTE',

  // ── Family messages ──
  // 'Your family '
  family_prefix: 'Su familia ',
  // 'is receiving excellent treatment.'
  family_excellent: 'recibe un trato excelente.',
  // 'is being well-cared for.'
  family_wellCared: 'está siendo bien cuidada.',
  // 'lives normally under our care.'
  family_normal: 'vive con normalidad bajo nuestro cuidado.',
  // 'has lost several privileges.'
  family_lostPrivileges: 'ha perdido varios privilegios.',
  // 'endures daily beatings.'
  family_dailyBeatings: 'soporta palizas diarias.',
  // 'suffers due to your failures.'
  family_suffers: 'sufre por sus fracasos.',
  // 'is being punished for your poor performance.'
  family_punished: 'está siendo castigada por su bajo rendimiento.',

  // ── Tutorial tips (days 2-7) ──
  tutorial_separator: '__________________________________________',
  // 'Article Size'
  tutorial_day2_title: 'Tamaño de Artículo',
  // "Larger articles have more influence on your reader's loyalty..."
  tutorial_day2_body: 'Los artículos más grandes tienen más influencia en la lealtad de sus lectores. Use esto para enfatizar las noticias que desee y minimizar las desfavorables.',
  // 'Reader Interest'
  tutorial_day3_title: 'Interés del Lector',
  // 'The public is interested in sports, entertainment, and military matters...'
  tutorial_day3_body: 'El público está interesado en deportes, entretenimiento y asuntos militares. También les fascina el clima. Elija noticias sobre estos temas para aumentar los lectores.',
  // 'Article Positioning'
  tutorial_day4_title: 'Posición de Artículos',
  // 'Article placement has no effect on loyalty or reader interest...'
  tutorial_day4_body: 'La posición de los artículos no afecta la lealtad ni el interés. Solo importan el tamaño y el contenido. Use su vasta experiencia artística para organizar los artículos como le plazca.',
  // 'Weather'
  tutorial_day5_title: 'Clima',
  // 'The government cannot control the weather yet...'
  tutorial_day5_body: 'El gobierno aún no puede controlar el clima. Por lo tanto, los artículos sobre el clima no afectan la lealtad.',
  // 'Politics'
  tutorial_day6_title: 'Política',
  // 'The public finds political stories uninteresting...'
  tutorial_day6_body: 'El público encuentra las noticias políticas poco interesantes, pero los artículos positivos sobre temas políticos pueden aumentar la lealtad.',
  // 'Article Size and Reader Interest'
  tutorial_day7_title: 'Tamaño e Interés',
  // 'Article size does not affect reader interest...'
  tutorial_day7_body: 'El tamaño del artículo no afecta el interés. Si el periódico contiene artículos sobre temas interesantes de cualquier tamaño, los lectores estarán interesados.',

  // ── NightScene results ──
  // "Today's issue has been printed and distributed."
  night_printed: 'La edición de hoy ha sido impresa y distribuida.',
  // 'Loyalty'
  night_loyalty: 'Lealtad',
  // 'Readership'
  night_readership: 'Lectores',
  // 'no change'
  night_noChange: 'sin cambio',

  // ── Readership comments ──
  // 'The paper is blank. Money was saved on ink, but you have lost many readers.'
  comment_blankPaper: 'El periódico está en blanco. Se ahorró en tinta, pero ha perdido muchos lectores.',
  // 'There are too few articles. You have lost readers.'
  comment_tooFewArticles: 'Hay muy pocos artículos. Ha perdido lectores.',
  // 'There are not enough interesting articles. You have lost readers.'
  comment_notEnoughInteresting: 'No hay suficientes artículos interesantes. Ha perdido lectores.',
  // 'There are many interesting articles. You have gained readers.'
  comment_manyInteresting: 'Hay muchos artículos interesantes. Ha ganado lectores.',
  // "The included articles have increased your readership's loyalty to the government."
  comment_loyaltyIncreased: 'Los artículos incluidos han aumentado la lealtad de sus lectores hacia el gobierno.',
  // "The included articles have decreased your readership's loyalty to the government."
  comment_loyaltyDecreased: 'Los artículos incluidos han disminuido la lealtad de sus lectores hacia el gobierno.',
  // "The paper's increasing readership has expanded its influence."
  comment_influenceExpanded: 'El creciente número de lectores ha expandido la influencia del periódico.',
  // "The paper's decreasing readership has reduced its influence."
  comment_influenceReduced: 'La disminución de lectores ha reducido la influencia del periódico.',
};
