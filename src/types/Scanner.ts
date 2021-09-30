export interface Scanner {
  peek(): string;
  read(): string;
  consume(...args: string[]): void;
}
