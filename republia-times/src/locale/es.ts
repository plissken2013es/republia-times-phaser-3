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
  ui_endDay: 'Terminar el Dia',
  // 'Go to Sleep'
  ui_goToSleep: 'Ir a Dormir',
  // 'Send to Print'
  ui_sendToPrint: 'Enviar a Imprenta',
  // 'Accept Fate'
  ui_acceptFate: 'Aceptar el Destino',
  // "Let's Go!"
  ui_letsGo: 'Adelante!',
  // 'Readers'
  ui_readers: 'Lectores',
  // 'Loyalty'
  ui_loyalty: 'Lealtad',
  // 'RESULTS'
  ui_results: 'RESULTADOS',
  // 'Day'
  ui_day: 'Dia',
  // 'by\nLucas Pope\n@dukope'
  ui_credits: 'por\nLucas Pope\n@dukope',

  // ── CenterPopup (PlayScene day-over) ──
  // 'The day is over. There is no more time. We must send to print immediately.'
  popup_dayOver: 'El dia ha terminado. No queda tiempo. Debemos enviar a imprenta inmediatamente.',

  // ── MorningScene messages ──
  // 'Welcome to The [GOV] Times. You are the new editor-in-chief.'
  morning_welcome: 'Bienvenido a The [GOV] Times. Usted es el nuevo editor en jefe.',
  // 'The war with Antegria is over and the rebellion uprising has been crushed. Order is slowly returning to [GOV].'
  morning_warOver: 'La guerra con Antegria ha terminado y el levantamiento rebelde ha sido aplastado. El orden esta volviendo lentamente a [GOV].',
  // 'The public is not loyal to the government.'
  morning_publicNotLoyal: 'El publico no es leal al gobierno.',
  // 'Freedom has returned to [GOV], but the public is skeptical.'
  morning_freedomReturned: 'La libertad ha vuelto a [GOV], pero el publico es esceptico.',
  // 'It is your job to increase their loyalty by editing The [GOV] Times carefully. Pick only stories that highlight the good things about [GOV] and its government.'
  morning_jobIncreaseLoyalty: 'Su trabajo es aumentar su lealtad editando The [GOV] Times con cuidado. Elija solo noticias que destaquen lo bueno de [GOV] y su gobierno.',
  // `You have ${days} days to raise the public's loyalty to ${target}.`
  morning_haveDaysLoyalty: (days: number, target: number) => `Tiene ${days} dias para elevar la lealtad del publico a ${target}.`,
  // 'We have found a new wife and child for you. As a precaution against influence, we are keeping them in a safe location.'
  morning_newFamily: 'Hemos encontrado una nueva esposa e hijo para usted. Como precaucion contra influencias, los mantenemos en un lugar seguro.',
  // 'As a precaution against influence, we are keeping your wife and child in a safe location.'
  morning_familyHostage: 'Como precaucion contra influencias, mantenemos a su esposa e hijo en un lugar seguro.',

  // Goal transitions
  // 'You have completed your first task. The Great and Honorable Leader is pleased.'
  morning_firstTaskComplete: 'Ha completado su primera tarea. El Gran y Honorable Lider esta complacido.',
  // `Continue to print positive articles and maintain a loyalty of at least ${target}.`
  morning_continuePrint: (target: number) => `Continue imprimiendo articulos positivos y mantenga una lealtad de al menos ${target}.`,
  // 'We must now work to increase readership. More minds is more power.'
  morning_increaseReadership: 'Ahora debemos trabajar para aumentar los lectores. Mas mentes es mas poder.',
  // `Attain at least ${count} readers by the end of day ${day}.`
  morning_attainReaders: (count: number, day: number) => `Alcance al menos ${count} lectores para el final del dia ${day}.`,
  // 'You have failed to inspire your readers and their loyalty remains weak.'
  morning_failedInspire: 'Ha fallado en inspirar a sus lectores y su lealtad sigue siendo debil.',

  // 'Congratulations, you have completed your second task. The Great and Honorable Leader is pleased.'
  morning_secondTaskComplete: 'Felicidades, ha completado su segunda tarea. El Gran y Honorable Lider esta complacido.',
  // 'From this point we will withdraw our close oversight.'
  morning_withdrawOversight: 'A partir de ahora retiraremos nuestra estrecha supervision.',
  // 'Continue to increase readership and maintain the promotion of positive news.'
  morning_continueIncrease: 'Continue aumentando los lectores y manteniendo la promocion de noticias positivas.',
  // `You have failed to acquire enough readers with loyalty ${target}. Without a loyal audience, The [GOV] Times has no influence.`
  morning_failedReaders: (target: number) => `Ha fallado en conseguir suficientes lectores con lealtad ${target}. Sin una audiencia leal, The [GOV] Times no tiene influencia.`,

  // Ongoing state goal messages
  // 'Good work. The Great and Honorable Leader has been notified of your diligent efforts.'
  morning_goodWork: 'Buen trabajo. El Gran y Honorable Lider ha sido notificado de sus diligentes esfuerzos.',
  // `Keep your reader's loyalty at ${target} or higher.`
  morning_keepLoyalty: (target: number) => `Mantenga la lealtad de sus lectores en ${target} o superior.`,
  // 'You are making good progress.'
  morning_goodProgress: 'Esta haciendo buen progreso.',
  // `Keep working towards a loyalty of ${target} or above by the end of day ${day}.`
  morning_keepWorking: (target: number, day: number) => `Siga trabajando hacia una lealtad de ${target} o superior para el final del dia ${day}.`,
  // 'This is not good. Loyalty is dropping.'
  morning_loyaltyDropping: 'Esto no es bueno. La lealtad esta cayendo.',
  // 'This is not good. Loyalty is not improving.'
  morning_loyaltyNotImproving: 'Esto no es bueno. La lealtad no mejora.',
  // 'You must choose positive articles that cast [GOV] in a good light. Try harder.'
  morning_tryHarder: 'Debe elegir articulos positivos que presenten a [GOV] de buena manera. Esfuercese mas.',
  // `Bring your reader's loyalty to at least ${target} by the end of day ${day}.`
  morning_bringLoyalty: (target: number, day: number) => `Eleve la lealtad de sus lectores a al menos ${target} para el final del dia ${day}.`,
  // `Maintain at least ${count} readers.`
  morning_maintainReaders: (count: number) => `Mantenga al menos ${count} lectores.`,
  // `You must have ${count} or more readers by the end of day ${day}.`
  morning_mustHaveReaders: (count: number, day: number) => `Debe tener ${count} o mas lectores para el final del dia ${day}.`,

  // Rebel / free goal messages
  // 'Good morning.'
  morning_goodMorning: 'Buenos dias.',
  // 'A drop in reader loyalty has been noted. Try harder.'
  morning_loyaltyDropNoted: 'Se ha notado una caida en la lealtad. Esfuercese mas.',

  // Kill message
  // 'Your services are no longer required. Your family has been eliminated and you will be reassigned.'
  morning_killMessage: 'Sus servicios ya no son necesarios. Su familia ha sido eliminada y sera reasignado.',

  // Rebel victory
  // 'We have done it!'
  morning_rebelsWon: 'Lo hemos logrado!',
  // 'Thank you my friend! Without your efforts the rebellion would have failed once again. A new era for our beloved nation begins!'
  morning_rebelThanks: 'Gracias amigo! Sin sus esfuerzos la rebelion habria fracasado una vez mas. Una nueva era para nuestra querida nacion comienza!',
  // "I'm truly sorry that we could not save your family."
  morning_rebelSorry: 'Lamento profundamente que no pudimos salvar a su familia.',
  // 'We need someone with your skills to talk with the people. Come back tomorrow for your new position.'
  morning_rebelNewPosition: 'Necesitamos a alguien con sus habilidades para hablar con el pueblo. Vuelva manana para su nuevo puesto.',
  // 'Long Live [GOV]!'
  morning_longLive: 'Larga Vida a [GOV]!',

  // State ending (game over after last day)
  // 'We have reviewed your file.'
  morning_reviewedFile: 'Hemos revisado su expediente.',
  // 'The Great and Honorable Leader has decided that printed paper is old technology. The Ministry of Media will be moving to focus on online communications.'
  morning_oldTechnology: 'El Gran y Honorable Lider ha decidido que el papel impreso es tecnologia obsoleta. El Ministerio de Medios se centrara en las comunicaciones en linea.',

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
  family_wellCared: 'esta siendo bien cuidada.',
  // 'lives normally under our care.'
  family_normal: 'vive con normalidad bajo nuestro cuidado.',
  // 'has lost several privileges.'
  family_lostPrivileges: 'ha perdido varios privilegios.',
  // 'endures daily beatings.'
  family_dailyBeatings: 'soporta palizas diarias.',
  // 'suffers due to your failures.'
  family_suffers: 'sufre por sus fracasos.',
  // 'is being punished for your poor performance.'
  family_punished: 'esta siendo castigada por su bajo rendimiento.',

  // ── Tutorial tips (days 2-7) ──
  tutorial_separator: '__________________________________________',
  // 'Article Size'
  tutorial_day2_title: 'Tamano de Articulo',
  // "Larger articles have more influence on your reader's loyalty..."
  tutorial_day2_body: 'Los articulos mas grandes tienen mas influencia en la lealtad de sus lectores. Use esto para enfatizar las noticias que desee y minimizar las desfavorables.',
  // 'Reader Interest'
  tutorial_day3_title: 'Interes del Lector',
  // 'The public is interested in sports, entertainment, and military matters...'
  tutorial_day3_body: 'El publico esta interesado en deportes, entretenimiento y asuntos militares. Tambien les fascina el clima. Elija noticias sobre estos temas para aumentar los lectores.',
  // 'Article Positioning'
  tutorial_day4_title: 'Posicion de Articulos',
  // 'Article placement has no effect on loyalty or reader interest...'
  tutorial_day4_body: 'La posicion de los articulos no afecta la lealtad ni el interes. Solo importan el tamano y el contenido. Use su vasta experiencia artistica para organizar los articulos como le plazca.',
  // 'Weather'
  tutorial_day5_title: 'Clima',
  // 'The government cannot control the weather yet...'
  tutorial_day5_body: 'El gobierno aun no puede controlar el clima. Por lo tanto, los articulos sobre el clima no afectan la lealtad.',
  // 'Politics'
  tutorial_day6_title: 'Politica',
  // 'The public finds political stories uninteresting...'
  tutorial_day6_body: 'El publico encuentra las noticias politicas poco interesantes, pero los articulos positivos sobre temas politicos pueden aumentar la lealtad.',
  // 'Article Size and Reader Interest'
  tutorial_day7_title: 'Tamano e Interes',
  // 'Article size does not affect reader interest...'
  tutorial_day7_body: 'El tamano del articulo no afecta el interes. Si el periodico contiene articulos sobre temas interesantes de cualquier tamano, los lectores estaran interesados.',

  // ── NightScene results ──
  // "Today's issue has been printed and distributed."
  night_printed: 'La edicion de hoy ha sido impresa y distribuida.',
  // 'Loyalty'
  night_loyalty: 'Lealtad',
  // 'Readership'
  night_readership: 'Lectores',
  // 'no change'
  night_noChange: 'sin cambio',

  // ── Readership comments ──
  // 'The paper is blank. Money was saved on ink, but you have lost many readers.'
  comment_blankPaper: 'El periodico esta en blanco. Se ahorro en tinta, pero ha perdido muchos lectores.',
  // 'There are too few articles. You have lost readers.'
  comment_tooFewArticles: 'Hay muy pocos articulos. Ha perdido lectores.',
  // 'There are not enough interesting articles. You have lost readers.'
  comment_notEnoughInteresting: 'No hay suficientes articulos interesantes. Ha perdido lectores.',
  // 'There are many interesting articles. You have gained readers.'
  comment_manyInteresting: 'Hay muchos articulos interesantes. Ha ganado lectores.',
  // "The included articles have increased your readership's loyalty to the government."
  comment_loyaltyIncreased: 'Los articulos incluidos han aumentado la lealtad de sus lectores hacia el gobierno.',
  // "The included articles have decreased your readership's loyalty to the government."
  comment_loyaltyDecreased: 'Los articulos incluidos han disminuido la lealtad de sus lectores hacia el gobierno.',
  // "The paper's increasing readership has expanded its influence."
  comment_influenceExpanded: 'El creciente numero de lectores ha expandido la influencia del periodico.',
  // "The paper's decreasing readership has reduced its influence."
  comment_influenceReduced: 'La disminucion de lectores ha reducido la influencia del periodico.',

  // ── News items: [blurbText, articleText] ──
  // NOTE: articleText uses ASCII-only (no accents) due to font limitations.
  // blurbText can use full Spanish characters (nokiafc22 has Latin-1 support).

  // Plot items
  // EN: 'The rebellion has been crushed. Peace returns to all sectors'
  // EN: 'Rebellion Crushed, Peace Restored!'
  news_0: ['La rebelion ha sido aplastada. La paz vuelve a todos los sectores', 'Rebelion Aplastada, Paz Restaurada!'],
  // EN: '*** ####....##...####..## ***'
  news_1: ['*** ####....##...####..## ***', null],
  // EN: '*** Est#blishing secure chan#el. Aw#it further# comm###ication ***'
  news_2: ['*** Est#bleciendo canal# seguro. Esp#re mas# comunicac###ion ***', null],
  // EN: '*** #Please hear me. I am Kurstov, leader of#the rebellion. We need your help. ***'
  news_3: ['*** #Escucheme por favor. Soy Kurstov, lider de#la rebelion. Necesitamos su ayuda. ***', null],
  // EN: '*** We can rescue your family. Sow disloyalty to strengthen the rebels. You have 4 days. ***'
  news_4: ['*** Podemos rescatar a su familia. Siembre deslealtad para fortalecer a los rebeldes. Tiene 4 dias. ***', null],
  // EN: 3 variants separated by |
  news_5: [
    '*** Por favor ayudenos. La tirania del gobierno debe terminar! Publique articulos negativos! ***|*** Su familia pronto estara a salvo! Baje la lealtad a -30 y consiga 1000 lectores en 3 dias! ***|*** Esta funcionando! Sus esfuerzos nos han fortalecido inimaginablemente! ***',
    null,
  ],
  news_6: [
    '*** El gobierno no puede ganar! Selle su destino! Publique articulos negativos! ***|*** La seguridad de su familia esta asegurada! Convenza a 1000 lectores de ser desleales en 2 dias! ***|*** Si! Nuestras operaciones estan en orden. Pronto derrocaremos! ***',
    null,
  ],
  news_7: [
    '*** No tenemos tiempo! El pueblo debe ser libre! Difunda noticias negativas! ***|*** Nuestro momento ha llegado! Rapido! Consiga 1000 lectores con -30 de lealtad para el final de hoy! ***|*** Oh glorioso dia! Atacamos al anochecer. Preparese! ***',
    null,
  ],

  // Plot (day-ranged military)
  // EN: 'Terrorist rebel hideout near Central Chem destroyed' / 'Rebels Routed At Factory!'
  news_8: ['Escondite terrorista rebelde cerca de Central Chem destruido', 'Rebeldes Derrotados En Fabrica!'],
  // EN: 'Rebels at Central Chem sabotage important machinary' / 'Factory Sabotaged!'
  news_9: ['Rebeldes en Central Chem sabotean maquinaria importante', 'Fabrica Saboteada!'],
  // EN: 'Terrorist 2nd-in-command captured. Renounces fight against [GOV]' / 'Terrorist Leader Buckles!'
  news_10: ['Segundo al mando terrorista capturado. Renuncia a luchar contra [GOV]', 'Lider Terrorista Cede!'],
  // EN: 'Rebels regroup in western towns. Growing in strength and number.' / 'Rebels Gaining Support!'
  news_11: ['Los rebeldes se reagrupan en pueblos del oeste. Crecen en fuerza y numero.', 'Rebeldes Ganan Apoyo!'],

  // War (always interesting)
  // EN: "[GOV] forces have destroyed Antegria's illegal satellites" / '[GOV] Downs Enemy Satellite!'
  news_12: ['Las fuerzas de [GOV] han destruido los satelites ilegales de Antegria', '[GOV] Derriba Satelite Enemigo!'],
  // EN: '[GOV] borders have been reinforced with 200,000 additional troops' / 'Borders Reinforced!'
  news_13: ['Las fronteras de [GOV] han sido reforzadas con 200.000 tropas adicionales', 'Fronteras Reforzadas!'],
  // EN: 'State-of-the-art military spy satellites now used to reduce crime' / 'Keeping An Eye On Crime!'
  news_14: ['Satelites espia militares de ultima generacion ahora usados contra el crimen', 'Vigilando El Crimen!'],
  // EN: '[GOV] Navy commissions an additional 500 destroyers to patrol coast' / 'Safeguarding The Coasts!'
  news_15: ['La Armada de [GOV] comisiona 500 destructores adicionales para patrullar la costa', 'Protegiendo Las Costas!'],
  // EN: '[GOV] Air Force tactical fighter sets new speed record' / 'Faster Fighter Flown!'
  news_16: ['Caza tactico de la Fuerza Aerea de [GOV] establece nuevo record de velocidad', 'Caza Mas Rapido En Vuelo!'],
  // EN: 'Multiple terrorist cells in central district foiled in operation' / 'Central Terrorists Terminated!'
  news_17: ['Multiples celulas terroristas en el distrito central desarticuladas', 'Terroristas Eliminados!'],
  // EN: '[GOV] Army 5th Divison shuts down bomb factory in northern mountains' / 'Bomb Factory Found, Destroyed!'
  news_18: ['La 5ta Division del Ejercito de [GOV] cierra fabrica de bombas en montanas del norte', 'Fabrica De Bombas Destruida!'],
  // EN: '[GOV] soldiers strongest in the world according to latest tests' / 'Our Boys Are the Best!'
  news_19: ['Soldados de [GOV] los mas fuertes del mundo segun ultimas pruebas', 'Nuestros Soldados, Los Mejores!'],
  // EN: 'Peace enforcement squad rounds up 200 terrorist rebels' / 'Peace Restored, Rebels Captured!'
  news_20: ['Escuadron de paz captura a 200 rebeldes terroristas', 'Paz Restaurada, Rebeldes Capturados!'],
  // EN: '40,000 gallons of military gasoline stolen from western bases' / 'Military Gas Gone!'
  news_21: ['40.000 galones de gasolina militar robados de bases del oeste', 'Gasolina Militar Robada!'],
  // EN: 'Critical oil fields in the north have been sabotaged' / 'Pipelines Crippled!'
  news_22: ['Campos petroleros criticos del norte han sido saboteados', 'Oleoductos Danados!'],
  // EN: 'Terrorist bomb explodes on northern bay ferry. 600 people missing' / 'Explosion Rocks The Seas!'
  news_23: ['Bomba terrorista explota en ferry de la bahia norte. 600 desaparecidos', 'Explosion Sacude Los Mares!'],
  // EN: '[GOV] Air Force tactical fighter test flight ends in crash. Crew lost' / 'Futuristic Fight Crashes, Burns!'
  news_24: ['Vuelo de prueba del caza tactico de [GOV] termina en accidente. Tripulacion perdida', 'Caza Moderno Se Estrella!'],
  // EN: '[GOV] Navy identifies critical fault in all operational submarines' / 'Our Subs Are Faulty!'
  news_25: ['La Armada de [GOV] identifica falla critica en todos los submarinos operativos', 'Nuestros Submarinos Fallan!'],
  // EN: 'The top general in charge of southern forces has died suddenly' / 'General Dies Overnight!'
  news_26: ['El general al mando de las fuerzas del sur ha muerto repentinamente', 'General Muere De Repente!'],
  // EN: 'Antegria secret code remains unbreakable. Top [GOV] minds are flumoxed' / "The Enemy's Unbreakable Code!"
  news_27: ['El codigo secreto de Antegria sigue siendo indescifrable. Las mejores mentes de [GOV] estan confundidas', 'Codigo Enemigo Indescifrable!'],
  // EN: 'Tank production falls behind schedule. Poor factory conditions blamed' / 'Tanking Tanks!'
  news_28: ['La produccion de tanques se retrasa. Culpan a las malas condiciones de fabrica', 'Tanques En Problemas!'],
  // EN: 'Worldwide survey finds [GOV] soldiers worst trained, with worst aim' / "Our Boys Can't Fire Straight!"
  news_29: ['Encuesta mundial revela que los soldados de [GOV] son los peor entrenados', 'Soldados Sin Punteria!'],
  // EN: 'Antegria Navy sinks [GOV] battleship off eastern coast' / '[GOV] Battleship Bested!'
  news_30: ['La Armada de Antegria hunde acorazado de [GOV] frente a la costa este', 'Acorazado De [GOV] Hundido!'],

  // Politics (never interesting)
  // EN: 'The Honorable and Great Leader awarded Lifetime Glory medal' / 'A Lifetime of Glory!'
  news_31: ['El Honorable y Gran Lider recibe la medalla de Gloria Vitalicia', 'Una Vida De Gloria!'],
  // EN: 'Agricultural output from the farming sector doubles for 10th straight month' / 'More Corn Than Air!'
  news_32: ['La produccion agricola se duplica por decimo mes consecutivo', 'Mas Maiz Que Aire!'],
  // EN: 'Income reallocation scheme contributes 400 million to schools. Proves system works' / 'Education Spending Up!'
  news_33: ['Plan de redistribucion de ingresos contribuye 400 millones a escuelas. Prueba que el sistema funciona', 'Gasto Educativo Sube!'],
  // EN: 'Latest polls show broad satisfaction with government leaders' / 'Politics Polls Positive!'
  news_34: ['Ultimas encuestas muestran amplia satisfaccion con los lideres del gobierno', 'Encuestas Politicas Positivas!'],
  // EN: "Newest regional administrator fights for worker's rights" / 'Power To The People!'
  news_35: ['El nuevo administrador regional lucha por los derechos de los trabajadores', 'Poder Para El Pueblo!'],
  // EN: 'Party officials have voted to adjust ration quotas for all orphans' / 'Less Food For Orphans'
  news_36: ['Funcionarios del partido han votado ajustar las cuotas de raciones para todos los huerfanos', 'Menos Comida Para Huerfanos'],
  // EN: "The Honorable and Great Leader photographed in women's clothes" / 'Great Leader, In A Dress!'
  news_37: ['El Honorable y Gran Lider fotografiado con ropa de mujer', 'Gran Lider, En Vestido!'],
  // EN: '30,000 teachers and academics reassigned to more useful labor tasks' / 'Educators Punished For Being Smart!'
  news_38: ['30.000 profesores y academicos reasignados a tareas laborales mas utiles', 'Educadores Castigados Por Listos!'],
  // EN: 'Local citizen council votes will be eliminated in favor of suggestive comments' / 'Local Councils Lose Vote!'
  news_39: ['Los votos de los consejos ciudadanos locales seran eliminados a favor de comentarios sugerentes', 'Consejos Locales Pierden Voto!'],
  // EN: 'Yearly donations to the state must increase to support growing government oversight' / 'Taxes Rise For 8th Year!'
  news_40: ['Las donaciones anuales al estado deben aumentar para sostener la creciente supervision gubernamental', 'Impuestos Suben 8vo Ano!'],

  // Weather (no loyalty, always interesting)
  // EN: 'Weather: Skies and temperatures will remain calm today' / 'Another Sunny Day!'
  news_41: ['Clima: Cielos despejados y temperaturas estables hoy', 'Otro Dia Soleado!'],
  // EN: 'Weather: Storms predicted to wash western coast out to sea' / 'Western Storms Threaten Coast!'
  news_42: ['Clima: Se predicen tormentas que arrasaran la costa oeste', 'Tormentas Amenazan Costa Oeste!'],
  // EN: 'Weather: Forecast expects heavy rains in the north and east' / 'Showers Rain Down!'
  news_43: ['Clima: Se esperan fuertes lluvias en el norte y el este', 'Lluvia Intensa!'],
  // EN: 'Weather: Expect unseasonal snow in the south' / 'Blizzard Incoming?'
  news_44: ['Clima: Se espera nieve fuera de temporada en el sur', 'Tormenta De Nieve?'],
  // EN: 'Weather: Sunny morning and cloudy evening for the day' / 'Warm To Cloudy!'
  news_45: ['Clima: Manana soleada y tarde nublada para hoy', 'De Sol A Nubes!'],
  // EN: 'Weather: Light showers throughout the day' / 'Warm To Cloudy This Week!'
  news_46: ['Clima: Lluvias ligeras durante todo el dia', 'Lluvias Ligeras Esta Semana!'],
  // EN: 'Weather: Hurricane-level winds spotted off eastern coast' / 'Eastern Hurricanes Return!'
  news_47: ['Clima: Vientos de nivel huracan avistados en la costa este', 'Huracanes Del Este Vuelven!'],
  // EN: 'Weather: Clear skies and no sign of rain' / 'Another Dry Day!'
  news_48: ['Clima: Cielos despejados y sin senal de lluvia', 'Otro Dia Seco!'],
  // EN: 'Weather: Freezing sleet and snow expected in northern mountains' / 'Buckle Down For Ice!'
  news_49: ['Clima: Se espera aguanieve y nieve en montanas del norte', 'Preparense Para El Hielo!'],
  // EN: 'Weather: Tropical breezes blow across southeastern coast' / 'Sea Breeze Incoming!'
  news_50: ['Clima: Brisas tropicales soplan por la costa sureste', 'Brisa Marina En Camino!'],

  // Sports (always interesting)
  // EN: '[GOV] National Team has won the global football tournament' / '[GOV] Wins Football Crown!'
  news_51: ['El equipo nacional de [GOV] ha ganado el torneo mundial de futbol', '[GOV] Gana La Corona Del Futbol!'],
  // EN: 'Antegria ski team soundly defeated by [GOV] crew' / '[GOV] Defeats Antegria Skiers!'
  news_52: ['Equipo de esqui de Antegria derrotado por equipo de [GOV]', '[GOV] Derrota Esquiadores!'],
  // EN: 'Tennis star Restojiu powers through semifinal brackets' / 'Tennis Star Advances!'
  news_53: ['La estrella del tenis Restojiu avanza por las semifinales', 'Estrella Del Tenis Avanza!'],
  // EN: 'Young [GOV] atheletes dominate track and field. May win Olympic gold' / 'Our Young Heroes!'
  news_54: ['Jovenes atletas de [GOV] dominan el atletismo. Podrian ganar oro olimpico', 'Nuestros Jovenes Heroes!'],
  // EN: 'Skilled [GOV] baseball team finishes record season. Thanks Leader for support' / 'Baseball Success Sealed!'
  news_55: ['El talentoso equipo de beisbol de [GOV] termina temporada record. Agradecen al Lider', 'Exito En El Beisbol!'],
  // EN: 'Championship weight lifter Lekshou retires due to crippling injury' / 'Muscleman Retires!'
  news_56: ['El campeon de halterofilia Lekshou se retira por lesion grave', 'Se Retira El Musculoso!'],
  // EN: '[GOV] National Football Team has lost the regional finals to Antegria' / '[GOV] Football Stumbles!'
  news_57: ['El equipo nacional de futbol de [GOV] ha perdido la final regional contra Antegria', 'Futbol De [GOV] Tropieza!'],
  // EN: 'Entire [GOV] National Hockey team killed in plane crash' / 'Tragedy Strikes Hockey!'
  news_58: ['Todo el equipo nacional de hockey de [GOV] muere en accidente aereo', 'Tragedia En El Hockey!'],
  // EN: 'Athletic training in [GOV] is years behind the competition' / 'Our Athletes: Behind The Curve?'
  news_59: ['El entrenamiento atletico en [GOV] esta anos detras de la competencia', 'Atletas: Muy Rezagados?'],
  // EN: 'National kayaking team has defected to Antegria' / 'Kayaking For The Enemy!'
  news_60: ['El equipo nacional de kayak ha desertado a Antegria', 'Kayak Para El Enemigo!'],

  // Entertainment (always interesting)
  // EN: "Cherrywood's newest stars attended recent gala ball to honor verterans" / 'Stars Dance For Vets!'
  news_61: ['Las nuevas estrellas de Cherrywood asistieron a la gala en honor a veteranos', 'Estrellas Bailan Por Veteranos!'],
  // EN: "New fall TV programming will focus on [GOV]'s rebuilding" / 'Fall TV Revealaed!'
  news_62: ['La nueva programacion de otono se enfocara en la reconstruccion de [GOV]', 'TV De Otono Revelada!'],
  // EN: 'Beloved children\'s book "Mumpit Mush" finally coming to the big screen' / 'Mumpit Mush Is Coming!'
  news_63: ['El querido libro infantil "Mumpit Mush" llega por fin a la gran pantalla', 'Llega Mumpit Mush!'],
  // EN: 'Superstars Chad and Jenlyn preparing for Cherrywood wedding tomorrow' / 'C&J To Tie the Knot!'
  news_64: ['Las superestrellas Chad y Jenlyn preparan su boda en Cherrywood para manana', 'C&J Se Casan Manana!'],
  // EN: 'Superstars Chad and Jenlyn marry in extravagant festival' / 'C&J Finally Hitched!'
  news_65: ['Las superestrellas Chad y Jenlyn se casan en extravagante festival', 'C&J Por Fin Casados!'],
  // EN: '"My butt is not too fat, just right" claims TV star Aprelica' / 'Butt Within Spec!'
  news_66: ['"Mi trasero no es gordo, es perfecto" dice la estrella de TV Aprelica', 'Trasero Dentro De Lo Normal!'],
  // EN: 'Reality star Mestonda found dead from apparent overdose' / 'Reality Star Overdoses!'
  news_67: ['La estrella de reality Mestonda hallada muerta por aparente sobredosis', 'Estrella De Reality Muere!'],
  // EN: 'Fashion designer CrevyCrevy has defected to Antegria' / 'Fashion Icon Defects!'
  news_68: ['El disenador de moda CrevyCrevy ha desertado a Antegria', 'Icono De Moda Deserta!'],
  // EN: 'Mega-group HugginBoyz admits to not singing on any albums, can barely dance' / 'HugginBoyz: Talentless After All!'
  news_69: ['El mega-grupo HugginBoyz admite no cantar en ningun album y apenas bailar', 'HugginBoyz: Sin Talento!'],
  // EN: 'Superstars Chad and Jenlyn file for divorce. Both claim infidelity' / 'C&J Fairytale Ends!'
  news_70: ['Las superestrellas Chad y Jenlyn solicitan el divorcio. Ambos alegan infidelidad', 'C&J El Cuento Termina!'],
};
