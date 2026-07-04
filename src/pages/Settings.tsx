import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BottomNav from '@/components/BottomNav';
import { useOnboarding } from '@/hooks/useOnboarding';
import { useProgress } from '@/hooks/useProgress';
import { useReminders } from '@/hooks/useReminders';
import { useAdmin } from '@/hooks/useAdmin';
import { AppIcon } from '@/components/AppIcon';
import { toast } from 'sonner';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { profile, updateProfile, resetOnboarding } = useOnboarding();
  const { resetProgress } = useProgress();
  const { settings: reminder, updateSettings: updateReminder, requestPermission, sendTestNotification } = useReminders();
  const { isAdmin, login, logout } = useAdmin();

  const [name, setName] = useState(profile.name);
  const [showReset, setShowReset] = useState(false);
  const [adminPassword, setAdminPassword] = useState('');
  const [adminError, setAdminError] = useState('');

  const handleSaveName = () => {
    updateProfile({ name });
    toast.success('השם עודכן בהצלחה');
  };

  const handleReset = () => {
    resetProgress();
    resetOnboarding();
    toast.success('כל הנתונים אופסו');
    navigate('/');
  };

  const handleToggleReminder = async () => {
    if (!reminder.enabled) {
      const granted = await requestPermission();
      if (granted) {
        updateReminder({ enabled: true });
        toast.success('התראות הופעלו');
      } else {
        toast.error('לא התקבלה הרשאה להתראות');
      }
    } else {
      updateReminder({ enabled: false });
      toast('התראות כובו');
    }
  };

  const handleAdminLogin = () => {
    if (login(adminPassword)) {
      setAdminPassword('');
      setAdminError('');
      toast.success('מצב מנהל הופעל');
    } else {
      setAdminError('סיסמה שגויה');
    }
  };

  return (
    <div className="min-h-screen bg-background pb-24 overflow-x-hidden" dir="rtl">
      {/* Header */}
      <div className="px-6 pt-12 pb-6">
        <h1 className="text-2xl font-semibold text-foreground animate-fade-up">הגדרות</h1>
        <p className="text-muted-foreground mt-1 animate-fade-up-delay-1">התאמה אישית</p>
      </div>

      {/* Profile */}
      <div className="px-6 mb-4 animate-fade-up-delay-1">
        <div className="bg-card rounded-3xl p-5 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <User className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-semibold text-base">פרופיל</h3>
          </div>
          <div className="space-y-3">
            <div>
              <label className="text-sm text-muted-foreground mb-1 block">שם</label>
              <div className="flex gap-2 min-w-0">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="flex-1 min-w-0 bg-background border border-border rounded-xl px-4 py-3 text-foreground text-base focus:outline-none focus:ring-2 focus:ring-primary/30"
                />
                <button
                  onClick={handleSaveName}
                  disabled={name === profile.name}
                  className="bg-primary text-primary-foreground px-5 py-3 rounded-xl text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 shrink-0"
                >
                  שמור
                </button>
              </div>
            </div>
            <div className="flex items-center justify-between py-2 gap-2">
              <span className="text-sm text-muted-foreground truncate">{profile.reason || '—'}</span>
              <span className="text-sm text-foreground shrink-0">מה מביא אותך</span>
            </div>
          </div>
        </div>
      </div>

      {/* Smartwatch */}
      <div className="px-6 mb-4 animate-fade-up-delay-2">
        <button
          onClick={() => navigate('/smartwatch')}
          className="w-full bg-card rounded-3xl p-5 border border-border/50 flex items-center gap-3 hover:border-primary/20 transition-colors text-right"
          aria-label="חיבור שעון חכם"
        >
          <Watch className="w-5 h-5 text-primary shrink-0" />
          <div className="flex-1">
            <h3 className="text-foreground font-semibold text-base">שעון חכם</h3>
            <p className="text-muted-foreground text-xs mt-0.5">מעקב מדדי גוף והזנה ידנית</p>
          </div>
          <span className="text-muted-foreground/40 text-lg">‹</span>
        </button>
      </div>

      {/* Reminders */}
      <div className="px-6 mb-4 animate-fade-up-delay-2">
        <div className="bg-card rounded-3xl p-5 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            <Bell className="w-5 h-5 text-primary" />
            <h3 className="text-foreground font-semibold text-base">תזכורות</h3>
          </div>

          {/* Toggle */}
          <div className="flex items-center justify-between mb-4">
            <span className="text-foreground text-sm">תזכורת יומית לתרגול</span>
            <button
              onClick={handleToggleReminder}
              className={`w-12 h-7 rounded-full transition-all duration-300 relative shrink-0 ${
                reminder.enabled ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <div
                className={`w-5 h-5 bg-white rounded-full absolute top-1 transition-all duration-300 shadow-sm ${
                  reminder.enabled ? 'right-1' : 'left-1'
                }`}
              />
            </button>
          </div>

          {reminder.enabled && (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <label className="text-sm text-muted-foreground">שעה:</label>
                <select
                  value={reminder.hour}
                  onChange={(e) => updateReminder({ hour: Number(e.target.value) })}
                  className="bg-background border border-border rounded-xl px-3 py-2 text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                >
                  {Array.from({ length: 24 }, (_, i) => (
                    <option key={i} value={i}>{String(i).padStart(2, '0')}:00</option>
                  ))}
                </select>
              </div>
              <button
                onClick={sendTestNotification}
                className="text-primary text-sm font-medium hover:opacity-80 transition-opacity"
              >
                שלח התראת ניסיון
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Admin */}
      <div className="px-6 mb-4 animate-fade-up-delay-3">
        <div className="bg-card rounded-3xl p-5 border border-border/50">
          <div className="flex items-center gap-3 mb-4">
            {isAdmin ? <ShieldOff className="w-5 h-5 text-primary" /> : <Shield className="w-5 h-5 text-muted-foreground" />}
            <h3 className="text-foreground font-semibold text-base">מנהל</h3>
          </div>

          {isAdmin ? (
            <div className="flex items-center justify-between">
              <span className="text-sm text-primary font-medium">מצב מנהל פעיל</span>
              <button
                onClick={() => { logout(); toast('מצב מנהל כובה'); }}
                className="text-destructive text-sm font-medium hover:opacity-80"
              >
                התנתק
              </button>
            </div>
          ) : (
            <div className="flex gap-2 min-w-0">
              <input
                type="password"
                value={adminPassword}
                onChange={(e) => { setAdminPassword(e.target.value); setAdminError(''); }}
                onKeyDown={(e) => e.key === 'Enter' && handleAdminLogin()}
                placeholder="סיסמה"
                className="flex-1 min-w-0 bg-background border border-border rounded-xl px-3 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/30"
              />
              <button
                onClick={handleAdminLogin}
                className="bg-primary text-primary-foreground px-4 py-2.5 rounded-xl text-sm font-medium hover:opacity-90"
              >
                כניסה
              </button>
            </div>
          )}
          {adminError && <p className="text-destructive text-xs mt-2">{adminError}</p>}
        </div>
      </div>

      {/* Reset */}
      <div className="px-6 mb-6">
        <div className="bg-card rounded-3xl p-5 border border-destructive/20">
          <div className="flex items-center gap-3 mb-3">
            <RotateCcw className="w-5 h-5 text-destructive" />
            <h3 className="text-foreground font-semibold text-base">איפוס</h3>
          </div>

          {!showReset ? (
            <button
              onClick={() => setShowReset(true)}
              className="text-destructive text-sm font-medium hover:opacity-80 transition-opacity"
            >
              איפוס כל הנתונים
            </button>
          ) : (
            <div>
              <p className="text-sm text-muted-foreground mb-3">
                פעולה זו תמחק את כל ההתקדמות, רשומות היומן וההגדרות. בטוחים?
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handleReset}
                  className="bg-destructive text-destructive-foreground px-5 py-2.5 rounded-xl text-sm font-semibold hover:opacity-90"
                >
                  כן, אפסו הכל
                </button>
                <button
                  onClick={() => setShowReset(false)}
                  className="bg-muted text-foreground px-5 py-2.5 rounded-xl text-sm font-medium hover:opacity-90"
                >
                  ביטול
                </button>
              </div>
            </div>
          )}
        </div>

      </div>

      {/* Emergency Support */}
      <div className="px-6 mb-6">
        <div className="bg-accent/5 rounded-3xl p-5 border border-accent/15">
          <h3 className="text-foreground font-semibold text-base mb-2">עזרה במצוקה</h3>
          <p className="text-muted-foreground text-sm leading-relaxed mb-3">
            האפליקציה היא כלי עזר ואינה מחליפה טיפול מקצועי.
            אם את/ה חש/ה מצוקה חריפה, אנא פנה/י לגורם מקצועי.
          </p>
          <div className="space-y-2">
            <a
              href="tel:1201"
              className="flex items-center justify-between rounded-2xl bg-destructive/10 border border-destructive/15 px-4 py-3 hover:bg-destructive/15 transition-colors"
            >
              <span className="text-foreground text-sm font-medium">קו ער״ן — זמין 24/7</span>
              <span className="text-destructive font-bold" dir="ltr">1201</span>
            </a>
            <a
              href="tel:*2784"
              className="flex items-center justify-between rounded-2xl bg-card border border-border px-4 py-3 hover:bg-muted transition-colors"
            >
              <span className="text-foreground text-sm font-medium">נט״ל — קו סיוע נפשי</span>
              <span className="text-muted-foreground font-bold" dir="ltr">*2784</span>
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="px-6 py-6 flex justify-center gap-4 text-xs text-muted-foreground">
        <button onClick={() => navigate('/terms')} className="hover:text-foreground transition-colors underline underline-offset-2">
          תנאי שימוש והבהרות
        </button>
      </div>

      <BottomNav />
    </div>
  );
};

export default Settings;
