export interface Scanner {
  peek(): string;
  read(): string;
  consume(...args: string[]): void;
  getPosition(): number;
  setPosition(position: number): void;
}
