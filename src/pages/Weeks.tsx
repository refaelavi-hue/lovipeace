import React from 'react';
import BottomNav from '@/components/BottomNav';
import WeekCard from '@/components/WeekCard';

const WEEKS_DATA = [
  { weekNumber: 1, title: 'מיפוי חרדה + שגרה בטוחה', description: 'נשימה קלה (נשיפה ארוכה 5–8 דק׳), הליכה 10–20 דק׳, קרקוע 5 דק׳, דף פריקה 10 דק׳. חשיפה: לבחור אי-ודאות קטנה אחת.', phase: 'א׳ — יציבות' },
  { weekNumber: 2, title: 'זיהוי התנהגויות ביטחון', description: 'PMR קצר 8–10 דק׳, קשב לנשימה 7–10 דק׳, כתיבה 10–12 דק׳, תנועה 15–25 דק׳. חשיפה: להפחית התנהגות ביטחון ב-10%.', phase: 'א׳ — יציבות' },
  { weekNumber: 3, title: 'גמישות אוטונומית', description: 'נשימה קצב 10 למשך 10 דק׳, Zone 2 תנועה 20–30 דק׳, מיינדפולנס 10 דק׳. חשיפה: עליה במדרגות → תחושת דופק → נשימה איטית.', phase: 'ב׳ — גמישות' },
  { weekNumber: 4, title: 'מרחב בין מחשבה לתגובה', description: 'דיפוזיה (ACT) 10 דק׳, נשימה 10–12 דק׳, תנועה 25–35 דק׳, יצירה 12–15 דק׳. חשיפה: דאגה מתוזמנת + פעולה ערכית קטנה.', phase: 'ב׳ — גמישות' },
  { weekNumber: 5, title: 'ביטחון חברתי וחמלה', description: 'חמלה עצמית 10–15 דק׳, נשימה + הימהום 10 דק׳, תנועה עם אדם ×2 בשבוע, יצירה 15 דק׳. חשיפה: מפגש חברתי ללא ניהול רושם.', phase: 'ג׳ — חשיפות' },
  { weekNumber: 6, title: 'ערכים → פעולה', description: 'עבודה עם ערכים (ACT) 10 דק׳, נשימה 8–10 דק׳, תנועה + כוח 30–45 דק׳, יצירה ערך-מכוונת 15 דק׳. חשיפה: לעשות משימה חשובה עם חרדה (20 דק׳).', phase: 'ג׳ — חשיפות' },
  { weekNumber: 7, title: 'חשיפה מתקדמת', description: 'חשיפות מובנות עם עיבוד רגשי, שילוב נשימה ותנועה מתקדמת, כתיבה רפלקטיבית.', phase: 'ג׳ — חשיפות' },
  { weekNumber: 8, title: 'אינטגרציה', description: 'שילוב כל הכלים שנלמדו, בניית פרוטוקול אישי, חשיפות מורכבות יותר, ביטחון חברתי ויצירה.', phase: 'ג׳ — חשיפות' },
  { weekNumber: 9, title: 'מניעת הישנות', description: 'בניית פרוטוקול אישי, זיהוי טריגרים, עבודה עם ערכים ומשמעות, תכנית תחזוקה לטווח ארוך.', phase: 'ד׳ — אינטגרציה' },
  { weekNumber: 10, title: 'סיום ועצמאות', description: 'חגיגת הדרך, גיבוש תכנית תחזוקה, מניעת הישנות, ביטחון חברתי ויצירה.', phase: 'ד׳ — אינטגרציה' },
];

const PHASES = [
  { name: 'א׳ — יציבות', weeks: '1–2', color: 'bg-primary/15 text-primary' },
  { name: 'ב׳ — גמישות', weeks: '3–4', color: 'bg-blue-100 text-blue-600' },
  { name: 'ג׳ — חשיפות', weeks: '5–8', color: 'bg-amber-100 text-amber-700' },
  { name: 'ד׳ — אינטגרציה', weeks: '9–10', color: 'bg-green-100 text-green-700' },
];

const currentWeek = 1; // Will be dynamic later

const Weeks: React.FC = () => {
  return (
    <div className="min-h-screen bg-background pb-24">
      {/* Header */}
      <div className="px-6 pt-12 pb-4">
        <h1 className="text-2xl font-semibold text-foreground animate-fade-up">תוכנית 10 שבועות</h1>
        <p className="text-muted-foreground mt-1 animate-fade-up-delay-1">מסע של שינוי מדורג</p>
      </div>

      {/* Phase Overview */}
      <div className="px-6 mb-6 animate-fade-up-delay-1">
        <div className="flex gap-2 overflow-x-auto pb-2">
          {PHASES.map((phase) => (
            <div
              key={phase.name}
              className={`shrink-0 rounded-2xl px-4 py-2.5 text-sm font-medium ${phase.color}`}
            >
              <span>שלב {phase.name}</span>
              <span className="text-xs opacity-70 mr-1">({phase.weeks})</span>
            </div>
          ))}
        </div>
      </div>

      {/* Week List */}
      <div className="px-6 space-y-3 animate-fade-up-delay-2">
        {WEEKS_DATA.map((week) => {
          const isActive = week.weekNumber === currentWeek;
          const isLocked = week.weekNumber > currentWeek;

          return (
            <div key={week.weekNumber} className={isLocked ? 'opacity-40' : ''}>
              <div
                className={`rounded-3xl p-5 transition-all duration-300 ${
                  isActive
                    ? 'bg-card border-2 border-primary/30 shadow-lg shadow-primary/5'
                    : 'bg-card border-2 border-transparent'
                }`}
              >
                <div className="flex items-start gap-4">
                  <div
                    className={`w-11 h-11 rounded-full flex items-center justify-center text-sm font-semibold shrink-0 mt-0.5 ${
                      isActive
                        ? 'bg-primary text-primary-foreground'
                        : week.weekNumber < currentWeek
                        ? 'bg-primary/20 text-primary'
                        : 'bg-muted text-muted-foreground'
                    }`}
                  >
                    {week.weekNumber < currentWeek ? '✓' : week.weekNumber}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <h3 className="text-foreground font-semibold text-base">{week.title}</h3>
                    </div>
                    <p className="text-muted-foreground text-sm leading-relaxed">{week.description}</p>
                    {isActive && (
                      <button className="mt-3 bg-primary/10 text-primary text-sm font-medium px-4 py-2 rounded-xl hover:bg-primary/20 transition-colors">
                        להתחיל את השבוע →
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <BottomNav />
    </div>
  );
};

export default Weeks;
