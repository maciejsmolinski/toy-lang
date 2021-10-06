import { Lexer, Token } from '../types';

export default class GenericParser {
  protected lexer: Lexer;
  protected lookahead: Token | null | undefined;

  constructor(lexer: Lexer) {
    this.lexer = lexer;
    this.lookahead = this.peek();
  }

  protected peek() {
    return this.lexer.peek();
  }

  protected match(type?: string, value?: any) {
    const token = this.lexer.next();
    this.lookahead = this.peek();

    if ((type && token?.type !== type) || (value && token?.value !== value)) {
      const expected = { ...(type && { type }), ...(value && { value }) };

      throw new Error(
        `Unexpected token ${JSON.stringify(token)}, expected ${JSON.stringify(
          expected
        )}`
      );
    }

    return token;
  }
}
