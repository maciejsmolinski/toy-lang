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

## Run the project directly in your browser

<img src="/assets/preview.png" width="450" />

Open and run the project via gitpod.io:

https://gitpod.io/#https://github.com/maciejsmolinski/toy-lang/blob/main/index.ts

## Run the project locally

Clone the repository, check out the directory and install dependencies

```sh
git clone git@github.com:maciejsmolinski/toy-lang.git
cd toy-lang && npm install
```

Run the code and watch for file changes

```sh
npm run watch
```

The output printed on the screen

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
