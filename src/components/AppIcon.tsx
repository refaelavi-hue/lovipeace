import homeIcon from '@/assets/icons/home.png.asset.json';
import weeksNavIcon from '@/assets/icons/weeks-nav.png.asset.json';
import toolsIcon from '@/assets/icons/tools.png.asset.json';
import journalNavIcon from '@/assets/icons/journal-nav.png.asset.json';
import settingsNavIcon from '@/assets/icons/settings-nav.png.asset.json';
import quickReliefIcon from '@/assets/icons/quick-relief.png.asset.json';
import sosIcon from '@/assets/icons/sos.png.asset.json';
import dailyPracticeIcon from '@/assets/icons/daily-practice.png.asset.json';
import myWeekIcon from '@/assets/icons/my-week.png.asset.json';
import meditationIcon from '@/assets/icons/meditation.png.asset.json';
import breathingIcon from '@/assets/icons/breathing.png.asset.json';
import groundingIcon from '@/assets/icons/grounding.png.asset.json';
import selfCompassionIcon from '@/assets/icons/self-compassion.png.asset.json';
import hotlineIcon from '@/assets/icons/hotline.png.asset.json';
import journalEntryIcon from '@/assets/icons/journal-entry.png.asset.json';
import moodIcon from '@/assets/icons/mood.png.asset.json';
import symptomsIcon from '@/assets/icons/symptoms.png.asset.json';
import profileIcon from '@/assets/icons/profile.png.asset.json';
import resetIcon from '@/assets/icons/reset.png.asset.json';
import notificationsIcon from '@/assets/icons/notifications.png.asset.json';
import privacyIcon from '@/assets/icons/privacy.png.asset.json';
import watchIcon from '@/assets/icons/watch.png.asset.json';
import watchDeviceIcon from '@/assets/icons/watch-device.png.asset.json';
import heartRateIcon from '@/assets/icons/heart-rate.png.asset.json';
import activityIcon from '@/assets/icons/activity.png.asset.json';
import playPauseIcon from '@/assets/icons/play-pause.png.asset.json';
import volumeIcon from '@/assets/icons/volume.png.asset.json';
import micIcon from '@/assets/icons/mic.png.asset.json';

export const ICONS = {
  home: homeIcon.url,
  'weeks-nav': weeksNavIcon.url,
  tools: toolsIcon.url,
  'journal-nav': journalNavIcon.url,
  'settings-nav': settingsNavIcon.url,
  'quick-relief': quickReliefIcon.url,
  sos: sosIcon.url,
  'daily-practice': dailyPracticeIcon.url,
  'my-week': myWeekIcon.url,
  meditation: meditationIcon.url,
  breathing: breathingIcon.url,
  grounding: groundingIcon.url,
  'self-compassion': selfCompassionIcon.url,
  hotline: hotlineIcon.url,
  'journal-entry': journalEntryIcon.url,
  mood: moodIcon.url,
  symptoms: symptomsIcon.url,
  profile: profileIcon.url,
  reset: resetIcon.url,
  notifications: notificationsIcon.url,
  privacy: privacyIcon.url,
  watch: watchIcon.url,
  'watch-device': watchDeviceIcon.url,
  'heart-rate': heartRateIcon.url,
  activity: activityIcon.url,
  'play-pause': playPauseIcon.url,
  volume: volumeIcon.url,
  mic: micIcon.url,
} as const;

export type AppIconName = keyof typeof ICONS;

interface AppIconProps {
  name: AppIconName;
  size?: number;
  className?: string;
  alt?: string;
}

export function AppIcon({ name, size = 40, className = '', alt = '' }: AppIconProps) {
  return (
    <img
      src={ICONS[name]}
      alt={alt}
      width={size}
      height={size}
      className={`object-contain select-none pointer-events-none ${className}`}
      draggable={false}
    />
  );
}
