import { Lexer, Token } from '../types';

export default class Parser {
  private lexer: Lexer;
  private lookahead: Token | null | undefined;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
  }

  parse() {
    this.match();
    return this.program();
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

    throw new Error(
      `Error parsing. Unexpected token ${JSON.stringify(this.lookahead)}`
    );
  }

  private fun() {
    const name = this.match('identifier')?.value;
    this.match('leftParen');

    return { type: 'FunctionDeclaration', name };
  }
}
