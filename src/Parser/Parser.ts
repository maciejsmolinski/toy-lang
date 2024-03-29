import GenericParser from './GenericParser';

type Identifier = { type: 'Identifier'; name: string };

type NumericLiteral = { type: 'NumericLiteral'; value: number };

type ReturnStatement = { type: 'ReturnStatement'; expr: Statement };

type BinaryExpression = {
  type: 'BinaryExpression';
  left: Statement;
  operator: string;
  right: Statement;
};

type Statement =
  | Identifier
  | NumericLiteral
  | ReturnStatement
  | BinaryExpression
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

  private Program(): Program {
    return { type: 'Program', body: this.Statements() };
  }

  private Statements(): Statement[] {
    const statements = [];

    while (this.lookahead?.type) {
      statements.push(this.Statement());
    }

    return statements;
  }

  // @TODO: Statement -> Expression
  private Statement(): Statement {
    const statement = this._Statement();

    if (this.lookahead?.type === 'operator') {
      return this.BinaryExpression(statement);
    }

    return statement;
  }

  private _Statement(): Statement {
    if (this.lookahead?.type === 'leftParen') {
      return this.ParenthesizedStatement();
    } else if (this.lookahead?.type === 'identifier') {
      switch (this.lookahead?.value) {
        case 'fun':
          return this.FunctionDeclaration();
        default: {
          const identifier = this.Identifier();

          if ((this.lookahead as any)?.type === 'leftParen') {
            return this.FunctionCall(identifier);
          }

          if ((this.lookahead as any)?.type === 'operator') {
            return this.BinaryExpression(identifier);
          }

          return identifier;
        }
      }
    } else if (this.lookahead?.type === 'return') {
      return this.ReturnStatement();
    } else if (this.lookahead?.type === 'number') {
      const numericLiteral = this.NumericLiteral();

      if ((this.lookahead as any)?.type === 'operator') {
        return this.BinaryExpression(numericLiteral);
      }

      return numericLiteral;
    } else {
      throw new Error(`Could not parse ${JSON.stringify(this.lookahead)}`);
    }
  }

  private Identifier(): Identifier {
    const identifier = this.match('identifier');

    return { type: 'Identifier', name: identifier?.value };
  }

  private NumericLiteral(): NumericLiteral {
    return { type: 'NumericLiteral', value: this.match('number')?.value };
  }

  private ReturnStatement(): ReturnStatement {
    this.match('return');

    return { type: 'ReturnStatement', expr: this.Statement() };
  }

  private ParenthesizedStatement(): Statement {
    this.match('leftParen');

    const statement = this.Statement();

    this.match('rightParen');

    return statement;
  }

  private BinaryExpression(left: Statement): BinaryExpression {
    const operator = this.match('operator')?.value;
    const right = this.Statement();

    return { type: 'BinaryExpression', left, operator, right };
  }

  private BlockStatement(): BlockStatement {
    this.match('leftBrace');

    const body = [];

    while (this.lookahead?.type !== 'rightBrace') {
      body.push(this.Statement());
    }

    this.match('rightBrace');

    return { type: 'BlockStatement', body };
  }

  private FunctionDeclaration(): FunctionDeclaration {
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

  private ParametersList(): Identifier[] {
    const params = [];

    do {
      params.push(this.Identifier());
    } while (this.lookahead?.type === 'comma' && this.match('comma'));

    return params;
  }

  private FunctionCall(name: Identifier): FunctionCall {
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
        args.push({
          type: 'NumericLiteral',
          value: next?.value,
        } as NumericLiteral);
      }

      if (next?.type === 'identifier') {
        args.push({ type: 'Identifier', name: next?.value } as Identifier);
      }
    }

    return { type: 'FunctionCall', name, args };
  }
}
