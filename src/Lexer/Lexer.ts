import { Scanner, Token } from '../types';

export default class Lexer {
  private scanner: Scanner;

  constructor(scanner: Scanner) {
    this.scanner = scanner;
  }

  private isNumeric(char: string): boolean {
    return /\d/.test(char);
  }

  private isCharacter(char: string): boolean {
    return /\w/.test(char);
  }

  peek(): Token | null {
    const position = this.scanner.getPosition();
    const token = this.next();

    this.scanner.setPosition(position);

    return token;
  }

  next(): Token | null {
    this.scanner.consume('\n', ' ');

    if (this.scanner.peek() === '') {
      return null;
    }

    if (
      ['{', '}', '(', ')', ',', '+', '-', '/', '*'].includes(
        this.scanner.peek()
      )
    ) {
      const val = this.scanner.read();

      switch (val) {
        case '{':
          return { type: 'leftBrace' };
        case '}':
          return { type: 'rightBrace' };
        case '(':
          return { type: 'leftParen' };
        case ')':
          return { type: 'rightParen' };
        case ',':
          return { type: 'comma' };
        case '+':
        case '-':
        case '/':
        case '*':
          return { type: 'operator', value: val };
      }
    }

    if (this.isNumeric(this.scanner.peek())) {
      let number = this.scanner.read();

      while (this.isNumeric(this.scanner.peek())) {
        number += this.scanner.read();
      }

      if (this.scanner.peek() === '.') {
        number += this.scanner.read();
      }

      while (this.isNumeric(this.scanner.peek())) {
        number += this.scanner.read();
      }

      return { type: 'number', value: Number(number) };
    }

    if (this.isCharacter(this.scanner.peek())) {
      let string = '';
      let token: Token;

      while (this.isCharacter(this.scanner.peek())) {
        string += this.scanner.read();

        if (string === 'return') {
          token = { type: 'return' };
          break;
        }
      }

      token ||= { type: 'identifier', value: string };

      return token;
    }

    return null;
  }
}
