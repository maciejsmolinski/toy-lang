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

class Lexer {
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

    return this.text[++this.pos]; // || '';
  }

  peek() {
    if (this.pos + 1 === this.text.length) {
      return '';
    }

    return this.text[this.pos + 1]; // || '';
  }

  consume(...chars: string[]) {
    while (this.peek() && chars.includes(this.peek())) {
      this.read();
    }
  }
}

class TokenStream {
  lexer: Lexer;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
  }

  private isNumeric(char: string): boolean {
    return /\d/.test(char);
  }

  private isCharacter(char: string): boolean {
    return /\w/.test(char);
  }

  next(): Token | null {
    this.lexer.consume('\n', ' ');

    if (this.lexer.peek() === '') {
      return null;
    }

    if (this.isNumeric(this.lexer.peek())) {
      let number = this.lexer.read();

      while (this.isNumeric(this.lexer.peek())) {
        number += this.lexer.read();
      }

      if (this.lexer.peek() === '.') {
        number += this.lexer.read();
      }

      while (this.isNumeric(this.lexer.peek())) {
        number += this.lexer.read();
      }

      return { type: 'number', value: Number(number) };
    }

    if (this.isCharacter(this.lexer.peek())) {
      let string = '';
      let token: Token;

      while (this.isCharacter(this.lexer.peek())) {
        string += this.lexer.read();

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
  const lexer = new Lexer(text);
  const tokens = new TokenStream(lexer);
  let token;

  console.log(`[SCAN] ${text}`);

  while ((token = tokens.next())) {
    console.log(token);
  }
}

tokenize('  123');
tokenize('  321.123');
tokenize('  321....');
tokenize('return 123');
tokenize(program);
