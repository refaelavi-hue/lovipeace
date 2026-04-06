// Hebrew gendered text utility
// Usage: g(gender, 'feminine form', 'masculine form')
export type Gender = 'female' | 'male' | '';

export function g(gender: Gender, female: string, male: string): string {
  return gender === 'male' ? male : female;
}

// Common gendered phrases
export function getGenderedTexts(gender: Gender) {
  return {
    welcome: g(gender, 'ברוכה הבאה', 'ברוך הבא'),
    youAre: g(gender, 'את', 'אתה'),
    choose: g(gender, 'בחרי', 'בחר'),
    read: g(gender, 'קראתי', 'קראתי'), // same
    breathe: g(gender, 'נשמי', 'נשום'),
    see: g(gender, 'רואה', 'רואה'), // same
    hear: g(gender, 'שומעת', 'שומע'),
    feel: g(gender, 'מרגישה', 'מרגיש'),
    smell: g(gender, 'מריחה', 'מריח'),
    taste: g(gender, 'טועמת', 'טועם'),
    safe: g(gender, 'בטוחה', 'בטוח'),
    alone: g(gender, 'לבד', 'לבד'),
    strong: g(gender, 'חזקה', 'חזק'),
    doing: g(gender, 'עושה', 'עושה'),
    agree: g(gender, 'מסכימה', 'מסכים'),
    letsStart: g(gender, 'בואי נתחיל', 'בוא נתחיל'),
  };
}
