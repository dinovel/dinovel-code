import * as vscode  from 'vscode';
import { VSCodeCommand } from './models';

import { createChar } from './_create-char.cmd';
import { reloadResx } from './_reload-resx.cmd';

const commands: VSCodeCommand[] = [
  createChar,
  reloadResx
];

export function registerCommands(context: vscode.ExtensionContext) {
  commands.forEach(command => {
    const name = command.name.startsWith('dinovel.') ? command.name : `dinovel.${command.name}`;
    console.log(`Registering command: ${name}`);
    context.subscriptions.push(
      vscode.commands.registerCommand(name, command.callback)
    );
  });

  context.subscriptions.push(
    vscode.commands.registerCommand('dinovel.runCmd', async () => {
      const items: (vscode.QuickPickItem & { id: string })[] = commands.map(e => ({
        label: e.desc,
        id: 'dinovel.'+ e.name
      }));

      const item = await vscode.window.showQuickPick(items, {
        canPickMany: false,
        title: 'Select a Dinovel action:'
      });

      if (item) {
        vscode.commands.executeCommand(item.id);
      }
    })
  );
}
