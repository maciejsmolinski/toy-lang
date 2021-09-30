const program = `
  fun average(a, b) {
    return (a + b) / 2
  }

  average(3.14, 2)
`;

type TokenType =
  | 'identifier'
  | 'comma'
  | 'fun'
  | 'return'
  | 'leftParen'
  | 'rightParen'
  | 'leftBrace'
  | 'rightBrace'
  | 'operator'
  | 'string'
  | 'number';

interface Token {
  type: TokenType;
  value?: any;
}

class Scanner {
  private pos: number;
  private text: string;

  constructor(text: string) {
    this.pos = -1;
    this.text = text;
  }

  read() {
    if (this.pos + 1 > this.text.length) {
      return '';
    }

    return this.text[++this.pos];
  }

  peek() {
    return this.text[this.pos + 1] || '';
  }

  consume(...chars: string[]) {
    while (this.peek() && chars.includes(this.peek())) {
      this.read();
    }
  }
}

class Lexer {
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

class Parser {
  private lexer: Lexer;
  private lookahead: Token | null | undefined;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
  }

  private match(type?: string, value?: any) {
    this.lookahead = this.lexer.next();

    if (type && this.lookahead?.type !== type) {
      throw new Error(`Unexpected token ${this.lookahead}`);
    }

    if (value && this.lookahead?.value !== value) {
      throw new Error(`Unexpected token ${this.lookahead}`);
    }

    return this.lookahead;
  }

  parse() {
    this.match();
    return this.program();
  }

  private program() {
    return { type: 'Program', body: this.stmts() };
  }

  private stmts() {
    if (
      this.lookahead?.type === 'identifier' &&
      this.lookahead?.value === 'fun'
    ) {
      return this.fun();
    }

    return null;
  }

  private fun() {
    const name = this.match('identifier')?.value;
    this.match('leftParen');

    return { type: 'FunctionDeclaration', name };
  }
}

function tokenize(text: string) {
  const scanner = new Scanner(text);
  const lexer = new Lexer(scanner);
  let token;

  console.log(`\n\n[INPUT]\n\n${text}\n`);

  console.log('[OUTPUT]\n');

  while ((token = lexer.next())) {
    console.log(token);
  }
}

function parse(text: string) {
  const scanner = new Scanner(text);
  const lexer = new Lexer(scanner);
  const parser = new Parser(lexer);

  console.log(JSON.stringify(parser.parse(), null, 2));
}

tokenize(program);
// parse(program);
