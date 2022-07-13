import * as vscode from 'vscode';

export class DynVariable<T> {
  #event: vscode.EventEmitter<T>;
  #value: T;
  #update: () => T;

  constructor(value: T, update: () => T, event: vscode.EventEmitter<T>) {
    this.#value = value;
    this.#update = update;
    this.#event = event;
  }

  get value(): T {
    return this.#value;
  }

  set value(value: T) {
    this.#value = value;
    this.#event.fire(this.#value);
  }

  update(value?: T): T {
    this.value = value ?? this.#update();
    return this.#value;
  }

}
