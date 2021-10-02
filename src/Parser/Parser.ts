import { Lexer, Token } from '../types';

export default class Parser {
  private lexer: Lexer;
  private lookahead: Token | null | undefined;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.lookahead = this.peek();
  }

  parse() {
    return this.Program();
  }

  private peek() {
    return this.lexer.peek();
  }

  private match(type?: string, value?: any) {
    const token = this.lexer.next();
    this.lookahead = this.peek();

    if (type && token?.type !== type) {
      throw new Error(`Unexpected token ${JSON.stringify(this.lookahead)}`);
    }

    if (value && token?.value !== value) {
      throw new Error(`Unexpected token ${JSON.stringify(this.lookahead)}`);
    }

    return token;
  }

  private Program() {
    return { type: 'Program', body: this.Statements() };
  }

  private Statements() {
    const statements = [];
    let next;

    while ((next = this.Statement())) {
      statements.push(next);
    }

    return statements;
  }

  private Statement() {
    if (
      this.lookahead?.type === 'identifier' &&
      this.lookahead?.value === 'fun'
    ) {
      return this.FunctionDeclaration();
    } else if (
      this.lookahead?.type === 'identifier' &&
      this.lookahead?.value === 'average' // hack
    ) {
      return this.FunctionCall();
    } else if (this.lookahead?.type === 'return') {
      return this.ReturnStatement();
    } else {
      this.match();
      // throw new Error(
      //   `Error parsing. Unexpected token ${JSON.stringify(this.lookahead)}`
      // );
      return;
    }
  }

  private Expr() {
    // @TODO
  }

  private BinaryExpression() {
    const left = this.match();
    const op = this.match('operator')?.value;
    const right = this.match();

    return { type: 'BinaryExpression', left, op, right };
  }

  private ReturnStatement() {
    this.match('return');
    const expr = this.match();
    return { type: 'ReturnStatement', expr };
  }

  private BlockStatement() {
    this.match('leftBrace');

    let next = this.match();

    while (next?.type !== 'rightBrace') {
      next = this.match();
    }

    return { type: 'BlockStatement', body: [] };
  }

  private FunctionDeclaration() {
    this.match('identifier', 'fun');
    const name = this.match('identifier')?.value;
    this.match('leftParen');

    const params = [];
    let next;

    while ((next = this.match())) {
      if (next?.type === 'rightParen') {
        break;
      }
      if (next?.type === 'comma') {
        continue;
      }

      params.push(next?.value);
    }

    const body = this.BlockStatement();

    return { type: 'FunctionDeclaration', name, params, body };
  }

  private FunctionCall() {
    const name = this.match('identifier')?.value;
    const args = [];

    this.match('leftParen');

    let next;

    while ((next = this.match())) {
      if (next?.type === 'rightParen') {
        break;
      }
      if (next?.type === 'comma') {
        continue;
      }

      args.push(next?.value);
    }

    return { type: 'FunctionCall', name, args };
  }
}
