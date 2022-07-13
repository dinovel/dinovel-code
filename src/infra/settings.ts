import * as vscode from 'vscode';
import type { Settings } from '../models';

export function loadSettings(): Settings {
  const config = vscode.workspace.getConfiguration('dinovel');

  return {
    enabled: config.get('enabled', false),
    status: config.get('status', true),
  };
}
