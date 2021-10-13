# Toy Lang

An adventure with hand crafted parsing in an attempt to create a tiny, Turing incomplete toy language.

## Syntax

Function definitions and function calls

```rust
fun average(a, b) {
  return (a + b) / 2
}

average(3.14, 2)
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


  fun average(a, b) {
    return (a + b) / 2
  }

  average(3.14, 2)



[TOKENIZE:OUTPUT]

{ type: 'identifier', value: 'fun' }
{ type: 'identifier', value: 'average' }
{ type: 'leftParen' }
{ type: 'identifier', value: 'a' }
{ type: 'comma' }
{ type: 'identifier', value: 'b' }
{ type: 'rightParen' }
{ type: 'leftBrace' }
{ type: 'return' }
{ type: 'leftParen' }
{ type: 'identifier', value: 'a' }
{ type: 'operator', value: '+' }
{ type: 'identifier', value: 'b' }
{ type: 'rightParen' }
{ type: 'operator', value: '/' }
{ type: 'number', value: 2 }
{ type: 'rightBrace' }
{ type: 'identifier', value: 'average' }
{ type: 'leftParen' }
{ type: 'number', value: 3.14 }
{ type: 'comma' }
{ type: 'number', value: 2 }
{ type: 'rightParen' }


[PARSE:OUTPUT]

{
  "type": "Program",
  "body": [
    {
      "type": "FunctionDeclaration",
      "name": {
        "type": "Identifier",
        "name": "average"
      },
      "params": [
        {
          "type": "Identifier",
          "name": "a"
        },
        {
          "type": "Identifier",
          "name": "b"
        }
      ],
      "body": {
        "type": "BlockStatement",
        "body": [
          {
            "type": "ReturnStatement",
            "expr": {
              "type": "BinaryExpression",
              "left": {
                "type": "BinaryExpression",
                "left": {
                  "type": "Identifier",
                  "name": "a"
                },
                "operator": "+",
                "right": {
                  "type": "Identifier",
                  "name": "b"
                }
              },
              "operator": "/",
              "right": {
                "type": "NumericLiteral",
                "value": 2
              }
            }
          }
        ]
      }
    },
    {
      "type": "FunctionCall",
      "name": {
        "type": "Identifier",
        "name": "average"
      },
      "args": [
        {
          "type": "NumericLiteral",
          "value": 3.14
        },
        {
          "type": "NumericLiteral",
          "value": 2
        }
      ]
    }
  ]
}
```
