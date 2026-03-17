import type { LocaleStrings } from './en';

export const es: LocaleStrings = {

  // UI
  ui_startWork: 'Iniciar Turno Editorial',
  ui_endDay: 'Finalizar Ciclo',
  ui_goToSleep: 'Retirarse',
  ui_sendToPrint: 'Transmitir al HoloNet',
  ui_acceptFate: 'Aceptar Directiva',
  ui_letsGo: 'Proceder',
  ui_readers: 'Ciudadanos Alcanzados',
  ui_loyalty: 'Conformidad',
  ui_results: 'INFORME',
  ui_day: 'Ciclo',
  ui_credits: 'División de Registros Imperiales',
  ui_newsFeed: 'Canal HoloNet',
  ui_dragArticles: 'Asignar Informes\nal Boletín',

  popup_dayOver: 'Ciclo completado. La ventana de transmisión se cierra.',

  // Morning
  morning_welcome: 'Bienvenido a The [GOV] Times. Ha sido asignado como editor jefe.',
  morning_warOver: 'El conflicto abierto con [ENE] ha terminado. Persisten focos insurgentes.',
  morning_publicNotLoyal: 'La conformidad ciudadana está por debajo de los niveles aceptables.',
  morning_freedomReturned: 'La estabilidad ha sido restaurada, aunque la percepción pública sigue siendo incierta.',
  morning_jobIncreaseLoyalty: 'Debe guiar la percepción pública. Seleccione informes que refuercen la confianza en [GOV].',
  morning_haveDaysLoyalty: (d, t) => `Tiene ${d} ciclos para alcanzar una conformidad de ${t}.`,
  morning_newFamily: 'Se le ha asignado una nueva unidad familiar. Permanecerá bajo protección.',
  morning_familyHostage: 'Su unidad familiar permanece bajo custodia para garantizar estabilidad.',

  morning_firstTaskComplete: 'Directiva inicial completada. Su rendimiento ha sido registrado.',
  morning_continuePrint: (t) => `Mantenga la conformidad en ${t} o superior.`,
  morning_increaseReadership: 'Amplíe su alcance. La influencia depende del número de ciudadanos alcanzados.',
  morning_attainReaders: (c, d) => `Alcance ${c} ciudadanos antes del ciclo ${d}.`,
  morning_failedInspire: 'No ha logrado influir significativamente en la percepción pública.',

  morning_secondTaskComplete: 'Directiva secundaria completada. La supervisión se reducirá.',
  morning_withdrawOversight: 'La supervisión directa será limitada a partir de ahora.',
  morning_continueIncrease: 'Continúe ampliando su influencia manteniendo coherencia narrativa.',
  morning_failedReaders: (t) => `Alcance insuficiente con conformidad ${t}. La influencia disminuye.`,

  morning_goodWork: 'Rendimiento registrado. Continúe.',
  morning_keepLoyalty: (t) => `Mantenga la conformidad en ${t}.`,
  morning_goodProgress: 'Progreso aceptable.',
  morning_keepWorking: (t, d) => `Alcance una conformidad de ${t} antes del ciclo ${d}.`,
  morning_loyaltyDropping: 'Se detecta una caída en la conformidad.',
  morning_loyaltyNotImproving: 'La conformidad no muestra mejoras.',
  morning_tryHarder: 'Ajuste la selección de informes. Refuerce la narrativa de estabilidad.',
  morning_bringLoyalty: (t, d) => `Eleve la conformidad a ${t} antes del ciclo ${d}.`,
  morning_maintainReaders: (c) => `Mantenga ${c} ciudadanos alcanzados.`,
  morning_mustHaveReaders: (c, d) => `Debe alcanzar ${c} ciudadanos antes del ciclo ${d}.`,

  // Rebel path
  morning_goodMorning: 'Señal recibida.',
  morning_loyaltyDropNoted: 'La conformidad desciende. Continúe.',

  morning_killMessage: 'Su asignación ha sido terminada. Se aplicarán protocolos correspondientes.',

  morning_rebelsWon: 'La señal se propaga.',
  morning_rebelThanks: 'Ha contribuido a debilitar los canales de control.',
  morning_rebelSorry: 'No ha sido posible extraer a todos.',
  morning_rebelNewPosition: 'Sus habilidades son necesarias en otro lugar.',
  morning_longLive: '¡Larga vida a [GOV]!',

  morning_reviewedFile: 'Su expediente ha sido revisado.',
  morning_oldTechnology: 'La distribución impresa es obsoleta. Se priorizarán canales HoloNet.',

  // Performance
  perf_header: 'Evaluación:',
  perf_appreciated: 'VALORADO',
  perf_acceptable: 'ACEPTABLE',
  perf_marginal: 'MARGINAL',
  perf_unsatisfactory: 'DEFICIENTE',
  perf_disastrous: 'FALLO CRÍTICO',
  perf_disappointing: 'INSUFICIENTE',

  // Family
  family_prefix: 'Su unidad familiar ',
  family_excellent: 'se encuentra en condiciones óptimas.',
  family_wellCared: 'permanece estable.',
  family_normal: 'continúa bajo supervisión.',
  family_lostPrivileges: 'ha perdido privilegios.',
  family_dailyBeatings: 'está bajo medidas correctivas.',
  family_suffers: 'experimenta consecuencias.',
  family_punished: 'está siendo disciplinada.',

  // Tutorial
  tutorial_separator: '__________________________________________',
  tutorial_day2_title: 'Peso del Informe',
  tutorial_day2_body: 'Los informes de mayor tamaño tienen mayor impacto en la percepción.',
  tutorial_day3_title: 'Interés Público',
  tutorial_day3_body: 'Los ciudadanos responden a temas militares, entretenimiento y eventos relevantes.',
  tutorial_day4_title: 'Distribución',
  tutorial_day4_body: 'La posición no afecta el impacto. El contenido es lo importante.',
  tutorial_day5_title: 'Condiciones Planetarias',
  tutorial_day5_body: 'Los informes meteorológicos no afectan la conformidad.',
  tutorial_day6_title: 'Mensajes Políticos',
  tutorial_day6_body: 'Los informes políticos aumentan la conformidad pero generan menos interés.',
  tutorial_day7_title: 'Tamaño vs Interés',
  tutorial_day7_body: 'El interés depende del tema, no del tamaño.',

  // Night
  night_printed: 'Transmisión completada.',
  night_loyalty: 'Conformidad',
  night_readership: 'Alcance',
  night_noChange: 'sin cambios',

  // Comments
  comment_blankPaper: 'No se ha realizado transmisión. La influencia disminuye.',
  comment_tooFewArticles: 'Contenido insuficiente. Alcance reducido.',
  comment_notEnoughInteresting: 'Informes poco atractivos. Alcance reducido.',
  comment_manyInteresting: 'Selección efectiva. Alcance ampliado.',
  comment_loyaltyIncreased: 'La conformidad aumenta.',
  comment_loyaltyDecreased: 'La conformidad disminuye.',
  comment_influenceExpanded: 'La influencia se expande.',
  comment_influenceReduced: 'La influencia se reduce.',
};