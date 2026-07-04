import breathingBasic from '@/assets/meditations/breathing-basic.png.asset.json';
import grounding from '@/assets/meditations/grounding-54321.png.asset.json';
import compassion from '@/assets/meditations/compassion.png.asset.json';
import mindfulness from '@/assets/meditations/mindfulness-basic.png.asset.json';
import pmr from '@/assets/meditations/pmr.png.asset.json';
import freewriting from '@/assets/meditations/freewriting.png.asset.json';
import boxBreathing from '@/assets/meditations/box-breathing.png.asset.json';
import bodyScan from '@/assets/meditations/body-scan.png.asset.json';
import guidedImagery from '@/assets/meditations/guided-imagery.png.asset.json';
import silent16 from '@/assets/meditations/silent-16.png.asset.json';

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
