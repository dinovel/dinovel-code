export type ResourceType = 'image' | 'audio' | 'video' | 'unknown';
export type ResourceCategory = 'background' | 'sprite' | 'ui' | 'portrait' | 'music' | 'sfx' | 'video' | 'animation' | 'logo' | 'asset';

export const RESOURCE_PREFIX = '__ASSETS__';

export const DEFAULT_EXTENSIONS: ResourceExtMap = {
  image: ['.png', '.jpg', '.jpeg', '.gif', '.webp', '.svg'],
  audio: ['.mp3', '.ogg', '.flac'],
  video: ['.mp4', '.webm'],
  unknown: []
};

export type Resource = {
  type: ResourceType;
  category: ResourceCategory;
  tags: string[];
  id: string;
  path: string;
};

export type ResourcesMap = Record<string, Resource>;

export type ResourceExtMap = {
  [key in ResourceType]: string[];
};

export type ResourceNameMap = Record<string, string>;

export class ResourceHandler {
  #resources: ResourcesMap;

  public constructor(resources: ResourcesMap) {
    this.#resources = resources;
  }

  public get(id: string): Resource {
    return this.#resources[id];
  }

  public validate(map: ResourceNameMap): string[] {
    const missing: string[] = [];

    for (const [id, name] of Object.entries(map)) {
      if (!this.#resources[id]) {
        missing.push(name);
      }
    }

    return missing;
  }
}
