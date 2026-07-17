export interface Exercise {
  category: 'breathing' | 'movement' | 'mind' | 'creation';
  title: string;
  duration: string;
  description: string;
  icon: string;
}

export interface WeekData {
  weekNumber: number;
  title: string;
  subtitle: string;
  phase: string;
  exercises: Exercise[];
  exposure: string;
  tip?: string;
}

export const WEEKS_DATA: WeekData[] = [
  {
    weekNumber: 1,
    title: 'יצירת יציבות',
    subtitle: 'ללמוד לעצור, לשים לב ולחזור בעדינות להווה',
    phase: 'א׳ — יציבות',
    exercises: [
      { category: 'breathing', title: 'נשיפה ארוכה', duration: '5 דק׳', description: 'שבו או שכבו בנוחות. שאפו בעדינות במשך 4 שניות ונשפו במשך 6 שניות. אין צורך לנשום עמוק או בכוח. חזרו על הקצב בקצב שנעים לכם.', icon: '🌬️' },
      { category: 'movement', title: 'הליכה מודעת', duration: '10 דק׳', description: 'לכו בקצב נוח. שימו לב למגע כפות הרגליים עם הקרקע, לצעדים ולסביבה. אין צורך להגיע לשום מקום או לשנות את מצב הרוח.', icon: '🚶' },
      { category: 'mind', title: 'קרקוע 5-4-3-2-1', duration: '5 דק׳', description: 'שימו לב בהדרגה ל־5 דברים שאתם רואים, 4 דברים שאתם שומעים, 3 דברים שאתם מרגישים במגע, 2 דברים שאתם מריחים ודבר אחד שאתם טועמים.', icon: '🧘' },
      { category: 'creation', title: 'דף פריקה', duration: '5–10 דק׳', description: 'כתבו בחופשיות את מה שנמצא בתוככם עכשיו. אין צורך לסדר, להסביר או לנסח יפה. בסיום אפשר לסגור את הדף בלי לנתח מיד.', icon: '✍️' },
    ],
    exposure: 'לא צריך להתמודד עם חשיפה השבוע. בחרו בכל יום תרגול אחד שמרגיש נגיש, ובצעו אותו בקצב שלכם.',
    tip: 'אין צורך לבצע את כל ארבעת התרגולים בכל יום. בכל יום בחרו את מה שהכי מתאים לכם עכשיו.',
  },
  {
    weekNumber: 2,
    title: 'זיהוי התנהגויות ביטחון',
    subtitle: 'לשים לב למה שאנחנו עושים כדי להרגיש בטוחים, ולבדוק אם אפשר להרפות מעט',
    phase: 'א׳ — יציבות',
    exercises: [
      { category: 'breathing', title: 'קשב לנשימה', duration: '7–10 דק׳', description: 'שבו בנוחות ושימו לב לנשימה כפי שהיא, בלי לנסות לתקן או לשנות אותה. כשהמחשבה נודדת, חזרו בעדינות לתחושת הנשימה.', icon: '🌬️' },
      { category: 'movement', title: 'תנועה נוחה', duration: '15–20 דק׳', description: 'בחרו תנועה שמתאימה לכם עכשיו: הליכה, מתיחות או תנועה חופשית. שימו לב להבדל בין תנועה שמיטיבה עם הגוף לבין מאמץ שמופעל מתוך לחץ.', icon: '🏃' },
      { category: 'mind', title: 'זיהוי התנהגות ביטחון', duration: '5–10 דק׳', description: 'שימו לב לדבר אחד שאתם עושים כדי להרגיש בטוחים יותר, כמו בדיקה, הימנעות או בקשת אישור. אין צורך לשנות אותו עכשיו — רק לזהות אותו בסקרנות.', icon: '🧘' },
      { category: 'creation', title: 'עלתה חרדה — מה עכשיו?', duration: '10 דק׳', description: 'נתבונן בעדינות במה שיש עכשיו.', icon: '✍️' },
    ],
    exposure: 'אם זה מרגיש מתאים ובטוח, בחרו התנהגות ביטחון אחת והפחיתו אותה מעט בלבד. אפשר גם להסתפק השבוע בזיהוי שלה.',
    tip: 'לא צריך להפסיק התנהגות ביטחון בבת אחת. בשלב הזה עצם הזיהוי הוא תרגול.',
  },
  {
    weekNumber: 3,
    title: 'גמישות אוטונומית',
    subtitle: 'נשימה איטית + תנועה Zone 2',
    phase: 'ב׳ — גמישות',
    exercises: [
      { category: 'breathing', title: 'נשימה קצב 10', duration: '10 דק׳', description: 'נשימה בקצב של 10 נשימות בדקה — שאיפה 3 שנ׳, נשיפה 3 שנ׳. מייצב את המערכת האוטונומית.', icon: '🌬️' },
      { category: 'movement', title: 'Zone 2 תנועה', duration: '20–30 דק׳', description: 'פעילות אירובית מתונה — הליכה מהירה, רכיבה, שחייה. קצב שבו אפשר עוד לדבר.', icon: '🏃' },
      { category: 'mind', title: 'מיינדפולנס', duration: '10 דק׳', description: 'מדיטציית מיינדפולנס — תשומת לב לרגע הנוכחי, צפייה במחשבות בלי שיפוט.', icon: '🧘' },
      { category: 'creation', title: 'יצירה חופשית', duration: '10–15 דק׳', description: 'ציור, כתיבה, מוזיקה — כל ביטוי יצירתי שמרגיש נכון.', icon: '✍️' },
    ],
    exposure: 'עליה במדרגות 1 דק׳ → תחושת דופק → נשימה איטית בטוחה.',
  },
  {
    weekNumber: 4,
    title: 'מרחב בין מחשבה לתגובה',
    subtitle: 'דיפוזיה (ACT) ודאגה מתוזמנת',
    phase: 'ב׳ — גמישות',
    exercises: [
      { category: 'breathing', title: 'נשימה', duration: '10–12 דק׳', description: 'תרגול נשימה מעמיקה עם מיקוד בנשיפה ארוכה ויציבה.', icon: '🌬️' },
      { category: 'movement', title: 'תנועה', duration: '25–35 דק׳', description: 'פעילות גופנית מגוונת — שילוב של אירובי ומתיחות.', icon: '🏃' },
      { category: 'mind', title: 'דיפוזיה (ACT)', duration: '10 דק׳', description: 'כתבו משפט דאגה. הוסיפו לפניו: "אני שם/ת לב שיש לי מחשבה ש...". נשימה ארוכה. שאלו: מה חשוב לי לעשות למרות זה?', icon: '🧘' },
      { category: 'creation', title: 'יצירה', duration: '12–15 דק׳', description: 'כתיבה או יצירה עם חיבור לתהליך הפנימי.', icon: '✍️' },
    ],
    exposure: 'דאגה מתוזמנת — רק בחלון מוגדר ביום. פעולה ערכית קטנה מחוצה לו.',
  },
  {
    weekNumber: 5,
    title: 'ביטחון חברתי וחמלה',
    subtitle: 'חמלה עצמית ומפגש חברתי',
    phase: 'ג׳ — חשיפות',
    exercises: [
      { category: 'breathing', title: 'נשימה + הימהום', duration: '10 דק׳', description: 'נשימה עם הימהום בנשיפה — מפעיל את מערכת העצב הפאראסימפתטי ויוצר תחושת רגיעה.', icon: '🌬️' },
      { category: 'movement', title: 'תנועה עם אדם', duration: '×2 בשבוע', description: 'פעילות גופנית עם אדם אחר — הליכה, ריקוד, אימון משותף.', icon: '🏃' },
      { category: 'mind', title: 'חמלה עצמית', duration: '10–15 דק׳', description: 'מדיטציית חמלה — דברו אל עצמכם כמו שהייתם מדברים אל חבר קרוב שסובל.', icon: '🧘' },
      { category: 'creation', title: 'יצירה', duration: '15 דק׳', description: 'ביטוי יצירתי חופשי — ציור, כתיבה, מוזיקה.', icon: '✍️' },
    ],
    exposure: 'מפגש חברתי קטן ללא "ניהול רושם" — לא להסביר על יתר המידה.',
  },
  {
    weekNumber: 6,
    title: 'ערכים → פעולה',
    subtitle: 'Behavioral Activation — פעולה לפני מוכנות',
    phase: 'ג׳ — חשיפות',
    exercises: [
      { category: 'breathing', title: 'נשימה', duration: '8–10 דק׳', description: 'תרגול נשימה מרגיע ומייצב.', icon: '🌬️' },
      { category: 'movement', title: 'תנועה + כוח', duration: '30–45 דק׳', description: 'שילוב אימון כוח עם פעילות אירובית.', icon: '🏃' },
      { category: 'mind', title: 'עבודה עם ערכים (ACT)', duration: '10 דק׳', description: 'זהו מה באמת חשוב לכם. שאלו: מה הייתי עושה אם הפחד לא היה שולט?', icon: '🧘' },
      { category: 'creation', title: 'יצירה ערך-מכוונת', duration: '15 דק׳', description: 'יצירה שמחוברת לערך אישי — כתיבה, ציור, או פעולה משמעותית.', icon: '✍️' },
    ],
    exposure: '"פעולה לפני מוכנות" — לעשות משימה חשובה עם חרדה (20 דק׳).',
  },
  {
    weekNumber: 7,
    title: 'אימון אי-ודאות',
    subtitle: 'Intolerance of Uncertainty — להישאר עם השאלה',
    phase: 'ג׳ — חשיפות',
    exercises: [
      { category: 'breathing', title: 'נשימה', duration: '10–12 דק׳', description: 'תרגול נשימה מעמיקה ומייצבת.', icon: '🌬️' },
      { category: 'movement', title: 'תנועה', duration: '30–45 דק׳', description: 'פעילות גופנית מגוונת — אירובי, כוח, או יוגה.', icon: '🏃' },
      { category: 'mind', title: 'אימון אי-ודאות', duration: '10–15 דק׳', description: 'תרגול ישיבה עם אי-ודאות — לשים לב לדחף לבדוק, לאשר, לשלוט — ולא לפעול.', icon: '🧘' },
      { category: 'creation', title: 'יצירה', duration: '10 דק׳', description: 'ביטוי יצירתי חופשי.', icon: '✍️' },
    ],
    exposure: 'להשאיר שאלה פתוחה 24 שעות — בלי לחפש אישור או לבדוק.',
  },
  {
    weekNumber: 8,
    title: 'אינטגרציה: תנועה–קול–משמעות',
    subtitle: 'שילוב כל הכלים בסשן אחד',
    phase: 'ג׳ — חשיפות',
    exercises: [
      { category: 'breathing', title: 'נשימה', duration: '10 דק׳', description: 'תרגול נשימה מרגיע.', icon: '🌬️' },
      { category: 'movement', title: 'יוגה / ריקוד', duration: '1–2 סשנים', description: 'תנועה אינטגרטיבית — יוגה או ריקוד חופשי שמחבר גוף ונפש.', icon: '🏃' },
      { category: 'mind', title: 'מיינד', duration: '10 דק׳', description: 'מדיטציה אינטגרטיבית — שילוב נשימה, גוף ומשמעות.', icon: '🧘' },
      { category: 'creation', title: 'יצירה', duration: '20 דק׳', description: 'יצירה מעמיקה — פרויקט אישי שמביע את המסע שלכם.', icon: '✍️' },
    ],
    exposure: 'חשיפה ארוכה יותר (30–60 דק׳) במרחב שהיה "מוגבל" + טקס סיום.',
  },
  {
    weekNumber: 9,
    title: 'אוטונומיה — בניית פרוטוקול אישי',
    subtitle: 'יצירת השגרה שלכם — בחירה עצמאית',
    phase: 'ד׳ — אינטגרציה',
    exercises: [
      { category: 'breathing', title: 'נשימה יומית', duration: '5–10 דק׳', description: 'תרגול נשימה יומי לפי הטכניקה שהכי עובדת עבורכם.', icon: '🌬️' },
      { category: 'movement', title: 'תנועה', duration: '150 דק׳/שבוע', description: 'חלוקה עצמאית של 150 דק׳ פעילות לאורך השבוע.', icon: '🏃' },
      { category: 'mind', title: 'מיינד', duration: '10 דק׳', description: 'מדיטציה או תרגול ACT לפי בחירה אישית.', icon: '🧘' },
      { category: 'creation', title: 'יצירה', duration: '10 דק׳', description: 'ביטוי יצירתי לפי בחירה אישית.', icon: '✍️' },
    ],
    exposure: 'לבחור "חשיפת עוגן" שבועית קבועה + חשיפה משתנה אחת.',
  },
  {
    weekNumber: 10,
    title: 'מניעת הישנות ותחזוקה',
    subtitle: 'סימולציית "שבוע קשה" ובניית מפת חזרה',
    phase: 'ד׳ — אינטגרציה',
    exercises: [
      { category: 'breathing', title: 'נשימה — מינון תחזוקה', duration: '5–10 דק׳', description: 'שמרו על תרגול נשימה יומי קצר כהרגל קבוע.', icon: '🌬️' },
      { category: 'movement', title: 'תנועה — תחזוקה + SOS', duration: '150 דק׳/שבוע', description: 'שמרו על 150 דק׳ שבועיות. דעו מה עובד עבורכם ברגעי לחץ.', icon: '🏃' },
      { category: 'mind', title: 'תחזוקה שוטפת + SOS', duration: '10 דק׳', description: 'מדיטציה יומית + תכנית SOS מוכנה לרגעים קשים.', icon: '🧘' },
      { category: 'creation', title: 'יצירת "מפת חזרה"', duration: '15 דק׳', description: 'כתבו את מפת החזרה שלכם — מה לעשות כשהחרדה חוזרת, מי לפנות אליו, מה עוזר.', icon: '✍️' },
    ],
    exposure: 'סימולציית "שבוע קשה" — מינימום תרגול בלי נשירה מלאה.',
  },
];

export const PHASES = [
  { name: 'א׳ — יציבות', weeks: '1–2', color: 'bg-primary/15 text-primary' },
  { name: 'ב׳ — גמישות', weeks: '3–4', color: 'bg-blue-100 text-blue-600' },
  { name: 'ג׳ — חשיפות', weeks: '5–8', color: 'bg-amber-100 text-amber-700' },
  { name: 'ד׳ — אינטגרציה', weeks: '9–10', color: 'bg-green-100 text-green-700' },
];

export const CATEGORY_INFO = {
  breathing: { label: 'נשימה', color: 'bg-sky-50 text-sky-700 border-sky-200', iconBg: 'bg-sky-100' },
  movement: { label: 'תנועה', color: 'bg-emerald-50 text-emerald-700 border-emerald-200', iconBg: 'bg-emerald-100' },
  mind: { label: 'מיינד', color: 'bg-violet-50 text-violet-700 border-violet-200', iconBg: 'bg-violet-100' },
  creation: { label: 'יצירה', color: 'bg-amber-50 text-amber-700 border-amber-200', iconBg: 'bg-amber-100' },
};
