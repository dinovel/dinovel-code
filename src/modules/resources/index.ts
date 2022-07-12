import path = require('path');
import fs = require('fs');
import * as vscode from 'vscode';

import { selectWorkspaceFolder } from '../utils';
import { importResources, saveResourceMap } from './resource-list';

export async function reloadResources() {
  const root = await selectWorkspaceFolder();
  if (!root) {
    vscode.window.showErrorMessage('No workspace is available.');
    return;
  }

  const importResult = importResources(root);
  saveResourceMap(root, importResult.result);

  vscode.window.showInformationMessage(`Resources reloaded:
          New: ${importResult.added}
    Unchanged: ${importResult.unchanged}
      Deleted: ${importResult.deleted}
  `);
}

