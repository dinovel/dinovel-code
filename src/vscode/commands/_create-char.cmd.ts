import * as vscode from 'vscode';
import { VSCodeCommand } from './models';

export const createChar: VSCodeCommand = {
  name: 'createChar',
  callback: () => createNewChar(),
  desc: 'Create new character'
};

function createNewChar() {
  vscode.window.showInformationMessage('Create new char!');
}
