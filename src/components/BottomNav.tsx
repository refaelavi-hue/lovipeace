import React, { forwardRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { AppIcon, type AppIconName } from '@/components/AppIcon';

const tabs: { path: string; icon: AppIconName; label: string }[] = [
  { path: '/dashboard', icon: 'home', label: 'בית' },
  { path: '/weeks', icon: 'weeks-nav', label: 'שבועות' },
  { path: '/tools', icon: 'tools', label: 'כלים' },
  { path: '/journal', icon: 'journal-nav', label: 'יומן' },
  { path: '/settings', icon: 'settings-nav', label: 'הגדרות' },
];


const BottomNav = forwardRef<HTMLElement>((_, ref) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav ref={ref} className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border safe-bottom z-50" role="navigation" aria-label="ניווט ראשי">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              aria-label={tab.label}
              aria-current={isActive ? 'page' : undefined}
              className={`flex flex-col items-center gap-0.5 py-1 px-3 rounded-xl transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-background ${
                isActive ? 'text-primary scale-110' : 'text-muted-foreground hover:text-foreground opacity-70'
              }`}
            >
              <AppIcon name={tab.icon} size={32} alt={tab.label} />
              <span className="text-[10px] font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
});

BottomNav.displayName = 'BottomNav';

export default BottomNav;
