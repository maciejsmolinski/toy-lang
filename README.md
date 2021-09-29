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

## Running things locally

Clone the repository, check out the directory and install dependencies

```sh
git clone git@github.com:maciejsmolinski/toy-lang.git
cd toy-lang && npm install
```

Run the code and watch for file changes

```sh
npm run watch
```

## Output

The outcome of running the code

```sh
[INPUT]

  321.123

[OUTPUT]

{ type: 'number', value: 321.123 }

...

[INPUT]

return 123

[OUTPUT]

{ type: 'return' }
{ type: 'number', value: 123 }

...

[INPUT]


  fun average(a, b) {
    return (a + b) / 2
  }

  average(3, 2)


[OUTPUT]

{ type: 'string', value: 'fun' }
{ type: 'string', value: 'average' }
```
