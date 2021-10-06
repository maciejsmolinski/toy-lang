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

  private Identifier(previous?: any) {
    switch (this.lookahead?.value) {
      case 'fun':
        return this.FunctionDeclaration();
      default:
        const identifier = { type: 'Identifier', name: this.match()?.value };

        if (previous?.value !== 'fun' && this.lookahead?.type === 'leftParen') {
          return this.FunctionCall(
            identifier as { type: 'Identifier'; name: string }
          );
        }

        return identifier;
    }
  }

  private Literal() {
    switch (this.lookahead?.type) {
      default:
        return this.NumericLiteral();
    }
  }

  private NumericLiteral() {
    return { type: 'NumericLiteral', value: this.match('number')?.value };
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
    const previous = this.match('identifier', 'fun');
    const name = this.Identifier(previous) as {
      type: 'Identifier';
      name: string;
    };

    this.match('leftParen');

    const params = this.ParametersList() as {
      type: 'Identifier';
      name: string;
    }[];

    this.match('rightParen');

    const body = this.BlockStatement();

    return { type: 'FunctionDeclaration', name, params, body };
  }

  private ParametersList() {
    const params = [];

    do {
      params.push(this.Identifier());
    } while (this.lookahead?.type === 'comma' && this.match('comma'));

    return params;
  }

  private FunctionCall(name: { type: 'Identifier'; name: string }) {
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
