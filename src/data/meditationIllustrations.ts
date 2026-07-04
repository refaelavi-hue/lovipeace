import breathingBasic from '@/assets/meditations/breathing-basic.jpg.asset.json';
import grounding from '@/assets/meditations/grounding-54321.jpg.asset.json';
import compassion from '@/assets/meditations/compassion.jpg.asset.json';
import mindfulness from '@/assets/meditations/mindfulness-basic.jpg.asset.json';
import pmr from '@/assets/meditations/pmr.jpg.asset.json';
import freewriting from '@/assets/meditations/freewriting.jpg.asset.json';
import boxBreathing from '@/assets/meditations/box-breathing.jpg.asset.json';
import bodyScan from '@/assets/meditations/body-scan.jpg.asset.json';
import guidedImagery from '@/assets/meditations/guided-imagery.jpg.asset.json';
import silent16 from '@/assets/meditations/silent-16.jpg.asset.json';

export const MEDITATION_ILLUSTRATIONS: Record<string, string> = {
  'breathing-basic': breathingBasic.url,
  'grounding-54321': grounding.url,
  'compassion': compassion.url,
  'mindfulness-basic': mindfulness.url,
  'pmr': pmr.url,
  'freewriting': freewriting.url,
  'box-breathing': boxBreathing.url,
  'body-scan': bodyScan.url,
  'guided-imagery': guidedImagery.url,
  'silent-16': silent16.url,
};

export function getIllustration(id: string): string | undefined {
  return MEDITATION_ILLUSTRATIONS[id];
}
