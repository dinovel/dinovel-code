import * as vscode from 'vscode';

export class DynVariable<T> {
  #event: vscode.EventEmitter<T | undefined>;
  #value: T;
  #update: () => T;

  constructor(value: T, update: () => T, event: vscode.EventEmitter<T | undefined>) {
    this.#value = value;
    this.#update = update;
    this.#event = event;
  }

  get value(): T {
    return this.#value;
  }

  set value(value: T) {
    this.#value = value;
    this.#event.fire(undefined);
  }

  update(value?: T): T {
    this.value = value ?? this.#update();
    return this.#value;
  }

}
