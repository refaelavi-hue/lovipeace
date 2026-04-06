import React, { forwardRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Home, Calendar, Wrench, BookOpen, Settings } from 'lucide-react';

const tabs = [
  { path: '/dashboard', icon: Home, label: 'בית' },
  { path: '/weeks', icon: Calendar, label: 'שבועות' },
  { path: '/tools', icon: Wrench, label: 'כלים' },
  { path: '/journal', icon: BookOpen, label: 'יומן' },
  { path: '/settings', icon: Settings, label: 'הגדרות' },
];

const BottomNav = forwardRef<HTMLElement>((_, ref) => {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <nav ref={ref} className="fixed bottom-0 left-0 right-0 bg-background/90 backdrop-blur-xl border-t border-border safe-bottom z-50">
      <div className="flex justify-around items-center h-16 max-w-lg mx-auto">
        {tabs.map((tab) => {
          const isActive = location.pathname === tab.path;
          const Icon = tab.icon;
          return (
            <button
              key={tab.path}
              onClick={() => navigate(tab.path)}
              className={`flex flex-col items-center gap-1 py-2 px-3 rounded-xl transition-all duration-300 ${
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground'
              }`}
            >
              <Icon size={22} strokeWidth={isActive ? 2.5 : 1.5} />
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
