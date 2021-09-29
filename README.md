# Toy Lang

An adventure with hand crafted parsing in an attempt to create a tiny, Turing incomplete toy language.

## Syntax

Function definitions and function calls

```rust
fun average(a, b) {
  return (a + b) / 2
}

average(3, 2)
```

and that's it for now!

## Local setup

Clone the repository and check out the directory

```sh
git clone git@github.com:maciejsmolinski/toy-lang.git && cd toy-lang
```

Install npm dependencies

```sh
npm install
```

## Running the project locally

To get continuous feedback on file change

```sh
npm run watch
```

Or, to execute once

```sh
npm run run
```
