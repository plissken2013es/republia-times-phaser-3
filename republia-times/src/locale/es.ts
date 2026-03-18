import type { LocaleStrings } from './en';

export const es: LocaleStrings = {

  // UI
  ui_startWork: 'Cumpla su misión',
  ui_endDay: 'Fin Ciclo',
  ui_goToSleep: 'Descansar',
  ui_sendToPrint: 'Transmitir al HoloNet',
  ui_acceptFate: 'Aceptar Directiva',
  ui_letsGo: 'Proceder',
  ui_readers: 'Sistemas',
  ui_loyalty: 'Lealtad',
  ui_results: 'INFORME DE CENSURA',
  ui_day: 'Ciclo',
  ui_credits: 'Oficina de Seguridad Imperial (ISB)',
  ui_newsFeed: 'Feed del HoloNet',
  govName: 'Imperio Galáctico',
  enemyName: 'Alianza Rebelde',
  ui_dragArticles: 'Asignar\nInformes',

  popup_dayOver: 'Ciclo completado. Ventana de transmisión del HoloNet cerrada.',

  // Morning
  morning_welcome: 'Bienvenido a la Gaceta Oficial del [GOV]. Ha sido asignado como editor jefe de propaganda.',
  morning_warOver: 'El conflicto abierto con la [ENE] ha pasado a una fase de ocupación. La insurgencia persiste.',
  morning_publicNotLoyal: 'La lealtad ciudadana está por debajo de los niveles de seguridad aceptables.',
  morning_freedomReturned: 'El Orden y la Paz han sido restaurados, aunque la percepción pública es inestable.',
  morning_jobIncreaseLoyalty: 'Su deber es purgar el pensamiento rebelde. Publique informes que refuercen la lealtad al [GOV].',
  morning_haveDaysLoyalty: (d, t) => `Tiene ${d} ciclos para elevar la lealtad al nivel ${t}.`,
  morning_newFamily: 'Se le ha asignado una nueva unidad familiar. Permanecerán bajo "protección" imperial.',
  morning_familyHostage: 'Su unidad familiar continúa bajo custodia preventiva para asegurar su eficiencia.',

  morning_firstTaskComplete: 'Directiva de adoctrinamiento inicial completada. Rendimiento registrado.',
  morning_continuePrint: (t) => `Mantenga la lealtad imperial en ${t} o niveles superiores.`,
  morning_increaseReadership: 'Amplíe el alcance de la señal. El control depende de cuántos sistemas nos escuchen.',
  morning_attainReaders: (c, d) => `Alcance ${c} sistemas antes del ciclo ${d}.`,
  morning_failedInspire: 'No ha logrado influir en la percepción pública según los estándares del COMPNOR.',

  morning_secondTaskComplete: 'Directiva secundaria completada. La supervisión directa de la ISB se reducirá.',
  morning_withdrawOversight: 'La vigilancia sobre su despacho será limitada a partir de ahora. No falle.',
  morning_continueIncrease: 'Continúe expandiendo la doctrina oficial manteniendo una narrativa coherente.',
  morning_failedReaders: (t) => `Alcance insuficiente con una lealtad de ${t}. Su influencia en el sector se desvanece.`,

  morning_goodWork: 'Rendimiento aceptable. El Imperio observa su progreso.',
  morning_keepLoyalty: (t) => `Mantenga la lealtad en niveles de ${t}.`,
  morning_goodProgress: 'Progreso satisfactorio para el Alto Mando.',
  morning_keepWorking: (t, d) => `Eleve la lealtad a ${t} antes del ciclo ${d}.`,
  morning_loyaltyDropping: 'Se detecta un peligroso descenso en la lealtad. No tolere la disidencia.',
  morning_loyaltyNotImproving: 'La lealtad está estancada. La propaganda actual es ineficaz.',
  morning_tryHarder: 'Ajuste la línea editorial. Priorice la estabilidad y el orden sobre el interés común.',
  morning_bringLoyalty: (t, d) => `Eleve la lealtad a ${t} antes del ciclo ${d} o será procesado.`,
  morning_maintainReaders: (c) => `Mantenga el alcance en ${c} sistemas.`,
  morning_mustHaveReaders: (c, d) => `Debe alcanzar ${c} sistemas antes del ciclo ${d}.`,

  // Rebel path
  morning_goodMorning: 'Señal de Fulcrum recibida.',
  morning_loyaltyDropNoted: 'La lealtad está cayendo. La semilla de la rebelión germina. No ceda.',

  morning_killMessage: 'Su asignación ha sido terminada. Se han activado los protocolos de eliminación.',

  morning_rebelsWon: 'La señal de libertad se propaga por la galaxia.',
  morning_rebelThanks: 'Ha logrado sabotear los canales de control imperial.',
  morning_rebelSorry: 'Sentimos no haber podido rescatar a su familia.',
  morning_rebelNewPosition: 'Su talento será útil para la Alianza en el Borde Exterior.',
  morning_longLive: '¡Larga vida a la [ENE]!',

  morning_reviewedFile: 'Su expediente ha sido auditado por la Oficina de Seguridad.',
  morning_oldTechnology: 'La distribución física es arcaica. Priorice los canales digitales del HoloNet.',

  // Performance
  perf_header: 'Evaluación de Lealtad: ',
  perf_appreciated: 'LEAL / ÓPTIMO',
  perf_acceptable: 'ACEPTABLE',
  perf_marginal: 'BAJO VIGILANCIA',
  perf_unsatisfactory: 'DEFICIENTE',
  perf_disastrous: 'TRAICIÓN / FALLO CRÍTICO',
  perf_disappointing: 'INSUFICIENTE',

  // Family
  family_prefix: 'Su unidad familiar ',
  family_excellent: 'disfruta de privilegios en los niveles superiores de Coruscant.',
  family_wellCared: 'permanece en condiciones de vida estables.',
  family_normal: 'continúa bajo supervisión estándar.',
  family_lostPrivileges: 'ha perdido sus raciones y privilegios de tránsito.',
  family_dailyBeatings: 'está siendo sometida a interrogatorios correctivos.',
  family_suffers: 'está experimentando las consecuencias de su negligencia.',
  family_punished: 'ha sido enviada a centros de reeducación.',

  // Tutorial
  tutorial_separator: '__________________________________________',
  tutorial_day2_title: 'Impacto del Informe',
  tutorial_day2_body: 'Los informes de gran tamaño dominan la atención del HoloNet y afectan más a la percepción.',
  tutorial_day3_title: 'Interés Sectorial',
  tutorial_day3_body: 'Los ciudadanos responden a temas militares, entretenimiento y eventos de los Mundos del Núcleo.',
  tutorial_day4_title: 'Maquetación',
  tutorial_day4_body: 'La posición en el boletín no afecta al impacto; solo importa el contenido censurado.',
  tutorial_day5_title: 'Condiciones Planetarias',
  tutorial_day5_body: 'Los informes meteorológicos son neutrales y no afectan a la lealtad imperial.',
  tutorial_day6_title: 'Adoctrinamiento Político',
  tutorial_day6_body: 'Los informes políticos elevan la lealtad pero atraen menos audiencia que el entretenimiento.',
  tutorial_day7_title: 'Volumen vs Relevancia',
  tutorial_day7_body: 'El interés público depende exclusivamente del tema, independientemente del tamaño.',

  // Night
  night_printed: 'Transmisión al HoloNet finalizada.',
  night_loyalty: 'Lealtad',
  night_readership: 'Alcance',
  night_noChange: 'sin variaciones',

  // Comments
  comment_blankPaper: 'No se ha enviado transmisión. El vacío informativo debilita nuestro control.',
  comment_tooFewArticles: 'Contenido insuficiente. La audiencia busca otros canales.',
  comment_notEnoughInteresting: 'Falta de contenido relevante. El alcance de la señal disminuye.',
  comment_manyInteresting: 'Selección editorial efectiva. El alcance se expande por el sector.',
  comment_loyaltyIncreased: 'La lealtad Imperial ha aumentado.',
  comment_loyaltyDecreased: 'Se detectan focos de disidencia; la lealtad al Imperio cae.',
  comment_influenceExpanded: 'Nuestra influencia se expande a nuevos sistemas.',
  comment_influenceReduced: 'Nuestra influencia en el sector se ha reducido.',
};