import GenericParser from './GenericParser';

export default class Parser extends GenericParser {
  parse() {
    return this.Program();
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
    if (this.lookahead?.type === 'identifier') {
      return this.Identifier();
    } else if (this.lookahead?.type === 'return') {
      return this.ReturnStatement();
    } else {
      // Consume next token, return nothing
      this.match();
      return;
    }
  }

  private Identifier() {
    switch (this.lookahead?.value) {
      case 'fun':
        return this.FunctionDeclaration();
      default:
        const name = this.match()?.value;

        if (this.lookahead?.type === 'leftParen') {
          return this.FunctionCall(name);
        }

        return { type: 'Identifier', name: this.match()?.value };
    }
  }

  private Expression() {
    // @TODO
  }

  private BinaryExpression() {
    // @TODO
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

      if (next?.type === 'identifier') {
        params.push({ type: 'Identifier', name: next?.value });
      }
    }

    const body = this.BlockStatement();

    return { type: 'FunctionDeclaration', name, params, body };
  }

  private FunctionCall(name: string) {
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

      if (next?.type === 'number') {
        args.push({ type: 'NumericLiteral', value: next?.value });
      }

      if (next?.type === 'identifier') {
        args.push({ type: 'Identifier', name: next?.value });
      }
    }

    return { type: 'FunctionCall', name, args };
  }
}
