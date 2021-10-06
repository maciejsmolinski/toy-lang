import { Scanner, Lexer, Parser } from '../../src/types';
import {
  Scanner as ScannerImpl,
  Lexer as LexerImpl,
  Parser as ParserImpl,
} from '../../src';

export const prepare = (
  code: string
): {
  scanner: Scanner;
  lexer: Lexer;
  parser: Parser;
} => {
  const scanner = new ScannerImpl(code);
  const lexer = new LexerImpl(scanner);
  const parser = new ParserImpl(lexer);

  return { scanner, lexer, parser };
};
