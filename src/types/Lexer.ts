type TokenType =
  | 'identifier'
  | 'comma'
  | 'fun'
  | 'return'
  | 'leftParen'
  | 'rightParen'
  | 'leftBrace'
  | 'rightBrace'
  | 'operator'
  | 'string'
  | 'number';

export interface Token {
  type: TokenType;
  value?: any;
}

export interface Lexer {
  next(): Token | null;
}
