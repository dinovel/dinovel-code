import type { ExtensionContext } from 'vscode';
import type { Settings } from "./settings";

export interface InitConfig {
  settings: Settings;
  workspace: string;
}

export interface ExtensionModule {
  init(context: ExtensionContext, config: InitConfig): void | Promise<void>;
}
