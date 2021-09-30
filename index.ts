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

  while ((token = lexer.next())) {
    console.log(token);
  }
}

function parse(text: string) {
  const scanner = new Scanner(text);
  const lexer = new Lexer(scanner);
  const parser = new Parser(lexer);

  console.log(JSON.stringify(parser.parse(), null, 2));
}

function main(text: string) {
  console.log(`\n\n[INPUT]\n\n${text}`);

  console.log('\n\n[TOKENIZE:OUTPUT]\n');
  tokenize(text);

  console.log('\n\n[PARSE:OUTPUT]\n');
  parse(text);
}

main(program);
