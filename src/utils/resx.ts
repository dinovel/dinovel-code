import { ResourceTreeItem, ResourceGroup, ResourceTarget, ResourceMap } from '../models';

export function isResourceGroup(item: ResourceTreeItem): item is ResourceGroup {
  return item.type === 'group';
}

export function isResourceTarget(item: ResourceTreeItem): item is ResourceTarget {
  return item.type === 'target';
}
