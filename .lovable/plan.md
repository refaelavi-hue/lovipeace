

# תוכנית בנייה — שלב 1: בסיס האפליקציה בהשראת Balance

## קונספט עיצובי מעודכן: "Dark Calm"

שילוב בין הקו הנקי של Balance לבין התוכן הטיפולי המובנה של התוכנית שלך.

```text
פלטת צבעים מעודכנת:

██████  #0F1419   רקע ראשי (כהה עמוק)
██████  #1A2332   רקע משני (כרטיסים כהים)
██████  #FFFFFF   כרטיסים בהירים
██████  #84A98C   Sage Green (אקסנט ראשי, התקדמות)
██████  #C4856A   Terracotta (SOS, אקסנט חם)
██████  #E8E4DF   טקסט משני
██████  #F5F1EB   טקסט ראשי על רקע כהה
```

## מה ייבנה

### 1. מערכת עיצוב (Design System)
- עדכון `index.css` עם פלטת צהים כהה בהשראת Balance
- RTL מלא, פונט Inter, פינות מעוגלות 16-24px
- אנימציות fade-in רכות

### 2. Onboarding (3 מסכים)
- מסך ברוכים הבאים עם מסר מרגיע
- שאלה אחת למסך (שם, מה מביא אותך, העדפת קול) — בסגנון Balance
- אנימציית מעבר רכה בין מסכים

### 3. Dashboard ראשי
- כרטיס שבוע נוכחי (נושא + תיאור קצר)
- כפתור תרגול יומי בולט
- כפתור SOS — תמיד נגיש, צבע Terracotta
- ברכה אישית ("היי [שם], מה בא לך לחקור?")

### 4. מסך SOS
- 3 אפשרויות מהירות: נשימה מונחית, הארקה (grounding), ומשפטי הרגעה
- תרגיל נשימה אנימטיבי (עיגול שמתרחב ומתכווץ)
- עיצוב רגוע במיוחד

### 5. ניווט תחתון (Bottom Navigation)
- 5 טאבים: בית, שבועות, כלים, יומן, הגדרות
- אייקונים מינימליים, בסגנון Balance

## מבנה קבצים

```text
src/
├── pages/
│   ├── Index.tsx          (ניתוב ראשי → onboarding או dashboard)
│   ├── Onboarding.tsx     (3 שלבי onboarding)
│   ├── Dashboard.tsx      (מסך הבית)
│   └── SOS.tsx            (מודול SOS)
├── components/
│   ├── BottomNav.tsx      (ניווט תחתון)
│   ├── WeekCard.tsx       (כרטיס שבוע)
│   ├── BreathingExercise.tsx (אנימציית נשימה)
│   └── OnboardingStep.tsx (שלב בודד ב-onboarding)
└── hooks/
    └── useOnboarding.ts   (ניהול מצב onboarding)
```

## פרטים טכניים
- State management: React useState + localStorage לשמירת התקדמות Onboarding
- ניווט: React Router עם routes ל-onboarding, dashboard, SOS
- אנימציות: CSS transitions + keyframes (ללא ספרייה חיצונית)
- RTL: `dir="rtl"` על `html` + Tailwind RTL utilities
- ללא Supabase בשלב זה — הכל מקומי

