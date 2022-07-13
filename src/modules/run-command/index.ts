/* Inject command that starts other commands */
import * as vscode from 'vscode';

import type { ExtensionModule } from '../../models';
import { AppNames, AppLabels } from '../../infra';

const ITEMS = Object.values(AppNames.commands)
  .map(id => ({
    id,
    label: AppLabels[id]
  })).filter(c => c.label);

export const RUN_COMMAND_MODULE: ExtensionModule = {
  init: async (context) => {
    const toDispose = vscode.commands.registerCommand(AppNames.commands.runCommand, onCommand);
    context.subscriptions.push(toDispose);
  }
};

async function onCommand() {
  const selected = await vscode.window.showQuickPick(ITEMS, {
    canPickMany: false,
    title: 'Select a Dinovel action:'
  });

  if (selected) {
    vscode.commands.executeCommand(selected.id);
  }
}
