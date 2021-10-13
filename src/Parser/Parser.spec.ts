import { prepare } from '../../config/tests/helpers';

function Identifier(name: string) {
  return { type: 'Identifier', name };
}

function NumericLiteral(value: number) {
  return { type: 'NumericLiteral', value };
}

function BinaryExpression(left: unknown, operator: string, right: unknown) {
  return { type: 'BinaryExpression', left, operator, right };
}

function BlockStatement(body: any[]) {
  return { type: 'BlockStatement', body };
}

function ReturnStatement(expr: any) {
  return { type: 'ReturnStatement', expr };
}

function Program(body: any[]) {
  return { type: 'Program', body };
}

const functionDeclaration = `
fun average(a, b) {
  return (a + b) / 2
}
`;

const functionCall = `
average(3.14, 2)
`;

describe('Parser', () => {
  describe('FunctionDeclaration', () => {
    const code = functionDeclaration;
    const ast = Program([
      {
        type: 'FunctionDeclaration',
        name: Identifier('average'),
        params: [Identifier('a'), Identifier('b')],
        body: BlockStatement([
          ReturnStatement(
            BinaryExpression(
              BinaryExpression(Identifier('a'), '+', Identifier('b')),
              '/',
              NumericLiteral(2)
            )
          ),
        ]),
      },
    ]);

    const { parser } = prepare(code);

    it('should return proper parse tree', () => {
      expect(parser.parse()).toEqual(ast);
    });
  });

  describe('FunctionCall', () => {
    const code = functionCall;
    const ast = Program([
      {
        type: 'FunctionCall',
        name: Identifier('average'),
        args: [NumericLiteral(3.14), NumericLiteral(2)],
      },
    ]);

    const { parser } = prepare(code);

    it('should return proper parse tree', () => {
      expect(parser.parse()).toEqual(ast);
    });
  });

  describe('Statements', () => {
    const code = `
      ${functionDeclaration}
      ${functionCall}
    `;

    const ast = Program([
      {
        type: 'FunctionDeclaration',
        name: Identifier('average'),
        params: [Identifier('a'), Identifier('b')],
        body: BlockStatement([
          ReturnStatement(
            BinaryExpression(
              BinaryExpression(Identifier('a'), '+', Identifier('b')),
              '/',
              NumericLiteral(2)
            )
          ),
        ]),
      },

      {
        type: 'FunctionCall',
        name: Identifier('average'),
        args: [NumericLiteral(3.14), NumericLiteral(2)],
      },
    ]);

    const { parser } = prepare(code);

    it('should return proper parse tree', () => {
      expect(parser.parse()).toEqual(ast);
    });
  });
});
