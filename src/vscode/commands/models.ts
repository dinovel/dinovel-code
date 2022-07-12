export interface VSCodeCommand {
  name: string;
  desc: string;
  callback: (...args: any[]) => any;
}
