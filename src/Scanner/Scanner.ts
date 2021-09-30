export default class Scanner {
  private pos: number;
  private text: string;

  constructor(text: string) {
    this.pos = -1;
    this.text = text;
  }

  read() {
    if (this.pos + 1 > this.text.length) {
      return '';
    }

    return this.text[++this.pos];
  }

  peek() {
    return this.text[this.pos + 1] || '';
  }

  consume(...chars: string[]) {
    while (this.peek() && chars.includes(this.peek())) {
      this.read();
    }
  }
}
