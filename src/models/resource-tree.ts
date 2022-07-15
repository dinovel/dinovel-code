export type ResourceTreeItem =
  ResourceTarget
| ResourceGroup
;

export interface ResourceTarget {
  type: 'target'
  name: string
  target: string
  valid: boolean
  parent: string
}

export interface ResourceGroup {
  type: 'group'
  name: string;
}

export type ResourceMap = Record<string, Record<string, string>>;
