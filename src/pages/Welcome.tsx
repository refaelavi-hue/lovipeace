import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import heroBreath from '@/assets/meditations/hero-breath.png.asset.json';

const Welcome = () => {
  const navigate = useNavigate();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Check if already onboarded
    const stored = localStorage.getItem('user-profile');
    if (stored) {
      const profile = JSON.parse(stored);
      if (profile.onboardingComplete) {
        navigate('/dashboard', { replace: true });
        return;
      }
    }
    setVisible(true);
  }, [navigate]);

  if (!visible) return null;

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-6 py-12 relative overflow-hidden">
      {/* Decorative background circles */}
      <div className="absolute top-[-120px] right-[-80px] w-[300px] h-[300px] rounded-full bg-primary/5 blur-3xl" />
      <div className="absolute bottom-[-100px] left-[-60px] w-[250px] h-[250px] rounded-full bg-accent/5 blur-3xl" />

      {/* Hero illustration */}
      <div className="animate-fade-up mb-6">
        <img
          src={heroBreath.url}
          alt=""
          width={240}
          height={240}
          className="w-56 h-56 object-contain"
        />
      </div>

      {/* Title */}
      <h1 className="text-4xl font-bold text-foreground text-center mb-3 animate-fade-up" style={{ animationDelay: '0.1s' }}>
        Wellbeing
      </h1>

      {/* Subtitle */}
      <p className="text-xl text-muted-foreground text-center mb-2 animate-fade-up" style={{ animationDelay: '0.2s' }}>
        תוכנית 10 שבועות
      </p>
      <p className="text-base text-muted-foreground/80 text-center max-w-xs mb-12 leading-relaxed animate-fade-up" style={{ animationDelay: '0.3s' }}>
        להפחתת חרדה ובניית גמישות נפשית
      </p>

      {/* Features */}
      <div className="w-full max-w-xs space-y-3 mb-12 animate-fade-up" style={{ animationDelay: '0.4s' }}>
        {[
          'תרגולי נשימה ומדיטציה מודרכים',
          'כלים להרגעה מיידית',
          'יומן אישי למעקב התקדמות',
        ].map((feature, i) => (
          <div key={i} className="flex items-center gap-3 text-foreground/80">
            <div className="w-1.5 h-1.5 rounded-full bg-primary flex-shrink-0" />
            <span className="text-sm">{feature}</span>
          </div>
        ))}
      </div>

      {/* CTA Button */}
      <div className="w-full max-w-xs animate-fade-up" style={{ animationDelay: '0.5s' }}>
        <Button
          onClick={() => navigate('/onboarding')}
          className="w-full h-14 text-lg rounded-2xl bg-primary hover:bg-primary/90 text-primary-foreground font-medium shadow-lg"
        >
          <ArrowLeft className="w-5 h-5 ml-2" />
          בואו נתחיל
        </Button>
      </div>

      {/* Version */}
      <p className="text-xs text-muted-foreground/40 mt-8 animate-fade-up" style={{ animationDelay: '0.6s' }}>
        גרסה 1.0
      </p>
    </div>
  );
};

export default Welcome;
