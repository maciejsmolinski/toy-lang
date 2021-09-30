import { Lexer, Parser, Scanner } from './src';

const program = `
  fun average(a, b) {
    return (a + b) / 2
  }

  average(3.14, 2)
`;

function tokenize(text: string) {
  const scanner = new Scanner(text);
  const lexer = new Lexer(scanner);
  let token;

  console.log(`\n\n[INPUT]\n\n${text}\n`);

  console.log('[OUTPUT]\n');

  while ((token = lexer.next())) {
    console.log(token);
  }
}

function parse(text: string) {
  const scanner = new Scanner(text);
  const lexer = new Lexer(scanner);
  const parser = new Parser(lexer);

  console.log(`\n\n[INPUT]\n\n${text}\n`);

  console.log('[OUTPUT]\n');

  console.log(JSON.stringify(parser.parse(), null, 2));
}

tokenize(program);
// parse(program);
