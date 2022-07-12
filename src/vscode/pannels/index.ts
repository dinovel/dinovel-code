import type { Settings } from '../settings';
import { activateStatusItem } from './status-bar';

export function activatePannels(config: Settings) {
  activateStatusItem(config);
}
