import React from 'react';
import { ArrowRight, Phone, ExternalLink } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const EMERGENCY_CONTACTS = [
  { name: 'ער"ן — עזרה ראשונה נפשית', phone: '1201', available: '24/7' },
  { name: 'נט"ל — קו סיוע לחרדה ומצוקה', phone: '*2784', available: '24/7' },
  { name: 'סהר — תמיכה רגשית', phone: '*6050', available: 'א׳–ה׳ 8:00–23:00' },
  { name: 'בטלפון — שיחה עם מתנדבים', phone: '*2727', available: 'א׳–ה׳ 20:00–00:00' },
];

const Terms: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background pb-24" dir="rtl">
      <div className="px-5 pt-12 pb-4">
        <button
          onClick={() => navigate(-1)}
          className="flex items-center gap-1 text-primary text-sm font-medium hover:opacity-80 transition-opacity"
        >
          <ArrowRight className="w-4 h-4" />
          חזרה
        </button>
      </div>

      <div className="px-6 space-y-8">
        {/* Emergency Contacts */}
        <section>
          <h1 className="text-2xl font-bold text-foreground mb-2">📞 קווים לסיוע נפשי</h1>
          <p className="text-muted-foreground text-sm mb-4">
            אם את/ה במצוקה חריפה או חושב/ת על פגיעה עצמית — אנא פנה/י מיד:
          </p>
          <div className="space-y-3">
            {EMERGENCY_CONTACTS.map((contact) => (
              <a
                key={contact.phone}
                href={`tel:${contact.phone}`}
                className="flex items-center gap-4 bg-card rounded-2xl p-4 border border-border hover:border-primary/30 transition-colors active:scale-[0.98]"
              >
                <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-5 h-5 text-destructive" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-foreground text-base">{contact.name}</p>
                  <p className="text-sm text-muted-foreground">{contact.available}</p>
                </div>
                <span className="text-lg font-bold text-primary" dir="ltr">{contact.phone}</span>
              </a>
            ))}
          </div>
        </section>

        {/* Disclaimer */}
        <section className="bg-accent/10 rounded-2xl p-5 border border-accent/20">
          <h2 className="text-lg font-bold text-foreground mb-3">⚠️ הבהרה חשובה</h2>
          <p className="text-foreground/80 text-sm leading-relaxed">
            אפליקציה זו <strong>אינה מחליפה</strong> ייעוץ, אבחון או טיפול מקצועי בבריאות הנפש.
            התכנים המוצעים הם כלי עזר ותרגולים כלליים בלבד, ואינם מותאמים אישית למצבך.
          </p>
          <p className="text-foreground/80 text-sm leading-relaxed mt-3">
            אם את/ה חווה מצוקה נפשית, חרדה משמעותית, או מחשבות על פגיעה עצמית — 
            <strong> פנה/י לאיש מקצוע</strong> (פסיכולוג/ית, פסיכיאטר/ית, עובד/ת סוציאלי/ת)
            או התקשר/י לאחד מהקווים למעלה.
          </p>
        </section>

        {/* Terms of Use */}
        <section>
          <h2 className="text-lg font-bold text-foreground mb-3">📄 תנאי שימוש</h2>
          <div className="space-y-4 text-sm text-foreground/70 leading-relaxed">
            <div>
              <h3 className="font-semibold text-foreground/90 mb-1">1. מהות השירות</h3>
              <p>
                האפליקציה מספקת תכנים חינוכיים ותרגולים לניהול חרדה ולקידום רווחה נפשית.
                התכנים מבוססים על גישות מוכרות (CBT, מיינדפולנס, DBT) אך אינם מהווים טיפול.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90 mb-1">2. אחריות</h3>
              <p>
                השימוש באפליקציה הוא על אחריות המשתמש/ת בלבד.
                אין אנו אחראים לכל נזק ישיר או עקיף הנובע מהשימוש בתכנים.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90 mb-1">3. פרטיות</h3>
              <p>
                כל המידע שלך (יומן, התקדמות, הגדרות) נשמר מקומית על המכשיר שלך בלבד.
                איננו אוספים, שולחים או שומרים מידע אישי בשרתים חיצוניים.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90 mb-1">4. גיל מינימלי</h3>
              <p>
                האפליקציה מיועדת למשתמשים מעל גיל 13. שימוש של קטינים דורש הסכמת הורה/אפוטרופוס.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground/90 mb-1">5. שינויים</h3>
              <p>
                אנו שומרים את הזכות לעדכן תנאים אלה מעת לעת. המשך שימוש מהווה הסכמה לתנאים המעודכנים.
              </p>
            </div>
          </div>
        </section>

        <p className="text-center text-xs text-muted-foreground pb-4">
          עודכן לאחרונה: אפריל 2026
        </p>
      </div>
    </div>
  );
};

export default Terms;
