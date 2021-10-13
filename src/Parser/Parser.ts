import GenericParser from './GenericParser';

type Identifier = { type: 'Identifier'; name: string };

type NumericLiteral = { type: 'NumericLiteral'; value: number };

type ReturnStatement = { type: 'ReturnStatement'; expr: Statement };

type Statement =
  | Identifier
  | NumericLiteral
  | ReturnStatement
  | FunctionDeclaration
  | FunctionCall;

type BlockStatement = { type: 'BlockStatement'; body: Statement[] };

type FunctionDeclaration = {
  type: 'FunctionDeclaration';
  name: Identifier;
  params: Identifier[];
  body: BlockStatement;
};

type FunctionCall = {
  type: 'FunctionCall';
  name: Identifier;
  args: Statement[];
};

type Program = { type: 'Program'; body: Statement[] };

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
      switch (this.lookahead?.value) {
        case 'fun':
          return this.FunctionDeclaration();
        default: {
          const identifier = this.Identifier();

          if ((this.lookahead as any)?.type === 'leftParen') {
            return this.FunctionCall(identifier);
          }

          return identifier;
        }
      }
    } else if (this.lookahead?.type === 'return') {
      return this.ReturnStatement();
    } else {
      // Consume next token, return nothing
      this.match();
      return;
    }
  }

  private Identifier(): { type: 'Identifier'; name: string } {
    const identifier = this.match('identifier');

    return { type: 'Identifier', name: identifier?.value };
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
    this.match('identifier', 'fun');

    const name = this.Identifier();

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
