import React from 'react';
import { useNavigate } from 'react-router-dom';

interface WeekCardProps {
  weekNumber: number;
  title: string;
  description: string;
  isActive: boolean;
}

const WeekCard: React.FC<WeekCardProps> = ({ weekNumber, title, description, isActive }) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => isActive && navigate(`/weeks/${weekNumber}`)}
      disabled={!isActive}
      className={`w-full text-right rounded-3xl p-6 transition-all duration-300 ${
        isActive
          ? 'bg-card border-2 border-primary/30 shadow-lg shadow-primary/5 hover:border-primary/50 active:scale-[0.98] cursor-pointer'
          : 'bg-card/50 border-2 border-transparent opacity-60 cursor-not-allowed'
      }`}
    >
      <div className="flex items-center gap-3 mb-3">
        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold ${
          isActive ? 'bg-primary text-primary-foreground' : 'bg-muted text-muted-foreground'
        }`}>
          {weekNumber}
        </div>
        <div>
          <h3 className="text-foreground font-semibold text-lg">{title}</h3>
        </div>
      </div>
      <p className="text-muted-foreground text-sm leading-relaxed">{description}</p>
    </button>
  );
};

export default WeekCard;
