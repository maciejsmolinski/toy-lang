import { Lexer, Token } from '../types';

export default class Parser {
  private lexer: Lexer;
  private lookahead: Token | null | undefined;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
  }

  parse() {
    this.match();
    return this.Program();
  }

  private match(type?: string, value?: any) {
    this.lookahead = this.lexer.next();

    if (type && this.lookahead?.type !== type) {
      throw new Error(`Unexpected token ${JSON.stringify(this.lookahead)}`);
    }

    if (value && this.lookahead?.value !== value) {
      throw new Error(`Unexpected token ${JSON.stringify(this.lookahead)}`);
    }

    return this.lookahead;
  }

  private Program() {
    return { type: 'Program', body: this.Statements() };
  }

  private Statements() {
    const statements = [];

    while (this.lookahead) {
      const statement = this.Statement();
      statement && statements.push(statement);
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
    } else {
      this.match();
      // throw new Error(
      //   `Error parsing. Unexpected token ${JSON.stringify(this.lookahead)}`
      // );
      return;
    }
  }

  private BlockStatement() {
    this.match('{');
    const statements = this.Statements();
    this.match('}');

    return { type: 'BlockStatement', body: statements };
  }

  private FunctionDeclaration() {
    const name = this.match('identifier')?.value;
    this.match('leftParen');

    return { type: 'FunctionDeclaration', name, params: [], body: [] };
  }

  private FunctionCall() {
    const name = this.lookahead?.value;
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
