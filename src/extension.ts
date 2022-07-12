import * as vscode from 'vscode';
import { registerCommands } from './vscode/commands';
import { loadSettings } from './vscode/settings';
import { activatePannels } from './vscode/pannels';

export function activate(context: vscode.ExtensionContext) {
  // Commands are always registered in the extension context.
  registerCommands(context);

  // Settings are loaded on activation.
  const settings = loadSettings();

  if (!settings.enabled) {
    console.warn('Dinovel is disabled for this workspace.');
    return;
  }

  // Pannels are activated per configuration.
  activatePannels(settings);
}

export function deactivate() {}
