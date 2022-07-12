import * as path from 'path';
import * as fs from 'fs';
import { randomUUID } from 'crypto';

import { listAllFiles } from '../utils';
import { Resource, DEFAULT_EXTENSIONS, RESOURCE_PREFIX, ResourceType, ResourceCategory, ResourcesMap } from '../../dinovel/resources';

const START = 'export const GAME_RESOURCES: ResourcesMap =';
const END = ';';

export interface ResourceImportResult {
  result: ResourcesMap;
  added: number;
  deleted: number;
  unchanged: number;
}

export function saveResourceMap(root: string, map: ResourcesMap): void {
  const resMapPath = getResMapPath(root);
  const content = `
import { ResourcesMap } from 'dinovel/modules/resources.ts';

${START} ${JSON.stringify(map, null, 2)}${END}
`;
  fs.writeFileSync(resMapPath, content, {
    encoding: 'utf8',
  });
}

export function importResources(root: string): ResourceImportResult {
  const resMapPath = getResMapPath(root);

  const imp: ResourceImportResult = {
    result: {},
    added: 0,
    deleted: 0,
    unchanged: 0
  };

  const resMap = Object.values(readCurrentResourceList(resMapPath));
  const res = readAssets(root);

  for (const r of res) {
    const old = resMap.find(r2 => r2.path === r.path);
    if (old) {
      imp.unchanged++;
      imp.result[old.id] = old;
      continue;
    }

    imp.added++;
    imp.result[r.id] = r;
  }

  imp.deleted = resMap.filter(r => !imp.result[r.id]).length;

  return imp;
}

function getResMapPath(root: string) {
  const resPath = ensureResourcesFolder(root);
  return path.join(resPath, 'resx.map.ts');
}


function readCurrentResourceList(path: string): ResourcesMap {
  if (!fs.existsSync(path)) { return {}; }
  const textContent = fs.readFileSync(path, 'utf8');

  let start = textContent.indexOf(START) + START.length;
  let end = textContent.lastIndexOf(END);

  if (start < 0 || end < 0) { return {}; }

  const content = textContent.substring(start, end);
  return JSON.parse(content);
}

function readAssets(root: string): Resource[] {
  const assetFolder = path.join(root, 'assets');
  const files = listAllFiles(assetFolder);
  const res: Resource[] = [];

  for (const f of files) {
    const [category, tags] = findTags(f.name);
    res.push({
      id: randomUUID(),
      path: f.path.replace(assetFolder, RESOURCE_PREFIX).replace(/\\/g, '/'),
      type: findType(f.extension),
      category,
      tags
    });
  }

  return res;
}

function findType(ext: string): ResourceType {
  for (const [k, v] of Object.entries(DEFAULT_EXTENSIONS)) {
    if (v.includes(ext)) {
      return k as ResourceType;
    }
  }
  return 'unknown';
}

function findTags(name: string): [ResourceCategory, string[]] {
  const parts = name.split('_');
  const [cat, ...tags] = parts;

  if (isCategory(cat)) {
    return [cat, tags];
  }

  return ['asset', parts];
}

function ensureResourcesFolder(rootPath: string): string {
  const fullPath = path.join(rootPath, 'src', 'resx');
  if (!fs.existsSync(fullPath)) {
    fs.mkdirSync(fullPath, { recursive: true });
  }
  return fullPath;
}

function isCategory(name: string): name is ResourceCategory {
  switch (name as ResourceCategory) {
    case 'animation':
    case 'asset':
    case 'background':
    case 'logo':
    case 'music':
    case 'portrait':
    case 'sfx':
    case 'sprite':
    case 'ui':
    case 'video':
      return true;
    default:
      return false;
  }
}
