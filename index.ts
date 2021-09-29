const program = `
  fun average(a, b) {
    return (a + b) / 2
  }

  average(3, 2)
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
  pos: number;
  text: string;

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
  scanner: Scanner;

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

      token ||= { type: 'string', value: string };

      return token;
    }

    return null;
  }
}

function tokenize(text: string) {
  const lexer = new Scanner(text);
  const tokens = new Lexer(lexer);
  let token;

  console.log(`\n\n[INPUT]\n\n${text}\n`);

  console.log('[OUTPUT]\n');

  while ((token = tokens.next())) {
    console.log(token);
  }
}

tokenize('  123');
tokenize('  321.123');
tokenize('  321....');
tokenize('return 123');
tokenize(program);

// const tokens: Token[] = [
//   { type: 'fun' },
//   { type: 'identifier', value: 'average' },
//   { type: 'leftParen' },
//   { type: 'identifier', value: 'a' },
//   { type: 'comma' },
//   { type: 'identifier', value: 'b' },
//   { type: 'rightParen' },
//   { type: 'leftBrace' },
//   { type: 'return' },
//   { type: 'leftParen' },
//   { type: 'identifier', value: 'a' },
//   { type: 'operator', value: '+' },
//   { type: 'identifier', value: 'b' },
//   { type: 'rightParen' },
//   { type: 'operator', value: '/' },
//   { type: 'number', value: '2' },
//   { type: 'rightBrace' },
//   { type: 'identifier', value: 'average' },
//   { type: 'leftParen' },
//   { type: 'number', value: 3 },
//   { type: 'number', value: 2 },
//   { type: 'rightParen' },
// ];
