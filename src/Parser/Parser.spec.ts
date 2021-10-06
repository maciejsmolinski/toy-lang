import { prepare } from '../../config/tests/helpers';

function Identifier(name: string) {
  return { type: 'Identifier', name };
}

function NumericLiteral(value: number) {
  return { type: 'NumericLiteral', value };
}

function BlockStatement(body: any[]) {
  return { type: 'BlockStatement', body };
}

function Program(body: any[]) {
  return { type: 'Program', body };
}

describe('Parser', () => {
  describe('FunctionDeclaration', () => {
    const code = `fun average(a, b) {
      return (a + b) / 2
    }`;
    const ast = Program([
      {
        type: 'FunctionDeclaration',
        name: Identifier('average'),
        params: [Identifier('a'), Identifier('b')],
        body: BlockStatement([]),
      },
    ]);

    const { parser } = prepare(code);

    it('should return proper parse tree', () => {
      expect(parser.parse()).toEqual(ast);
    });
  });

  describe('FunctionCall', () => {
    const code = `average(3.14, 2)`;
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
});
