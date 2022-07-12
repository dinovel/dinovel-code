import * as vscode from 'vscode';

export interface Settings {
  enabled: boolean;
  status: boolean;
}

export function loadSettings(): Settings {
  const config = vscode.workspace.getConfiguration('dinovel');

  return {
    enabled: config.get('enabled', false),
    status: config.get('status', true),
  };
}
