import { VSCodeCommand } from './models';
import { reloadResources } from '../../modules/resources';

export const reloadResx: VSCodeCommand = {
  name: 'reloadResx',
  desc: 'Reload project resources',
  callback: () => reloadResources()
};
