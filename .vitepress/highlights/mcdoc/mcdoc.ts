export const mcdoc: any = {
  "name": "mcdoc",
  "displayName": "Syntax Mcdoc",
  "scopeName": "source.mcdoc",
  "uuid": "047d4110-25e4-4713-8036-22635cce4e84",
  "fileTypes": [
    "mcdoc"
  ],
  "patterns": [
    {
      "include": "#root"
    }
  ],
  "repository": {
    "root": {
      "patterns": [
        {
          "name": "keyword.control.mcdoc",
          "match": "\\b(use|type|struct|enum)\\b"
        },
        {
          "name": "storage.modifier.mcdoc",
          "match": "\\b(dispatch|inject|to|extends)\\b"
        },
        {
          "name": "entity.name.type.mcdoc",
          "match": "\\b(any|boolean|string|byte|short|int|long|float|double)\\b"
        },
        {
          "name": "comment.line.mcdoc",
          "begin": "//",
          "end": "\n"
        },
        {
          "name": "constant.numeric.mcdoc",
          "match": "\\b[0-9]+\\b"
        },
        {
          "name": "string.quoted.mcdoc",
          "begin": "\"",
          "end": "\""
        },
        {
          "begin": "(#)\\[",
          "end": "\\]",
          "beginCaptures": {
            "1": {
              "name": "meta.preprocessor.mcdoc"
            }
          },
          "patterns": [
            {
              "name": "entity.name.function.mcdoc",
              "match": "(?<=\\[)[A-Za-z0-9_]+(?=[={(\\]])"
            },
            {
              "name": "entity.name.type.mcdoc",
              "match": "[A-Z][A-Za-z0-9_]*"
            },
            {
              "name": "string.quoted.mcdoc",
              "begin": "\"",
              "end": "\""
            }
          ]
        },
        {
          "begin": "([a-z0-9_.-]+:[a-z0-9_.-]+)\\[",
          "end": "\\]",
          "beginCaptures": {
            "1": {
              "name": "entity.name.function.mcdoc"
            }
          },
          "patterns": [
            {
              "name": "variable.parameter.mcdoc",
              "match": "[a-z0-9_.-]+:[a-z0-9_.-]+"
            }
          ]
        },
        {
          "name": "entity.name.function.mcdoc",
          "match": "\\b[a-z0-9_.-]+:[a-z0-9_.-]+"
        },
        {
          "name": "variable.mcdoc",
          "match": "(?<!type\\s+)\\b[A-Za-z_][A-Za-z0-9_]* *(?=(\\?:|:(?!:)|=) *)"
        },
        {
          "name": "variable.mcdoc",
          "match": "(?<=\\[)[A-Za-z0-9_]+(?=\\[)"
        },
        {
          "name": "entity.name.type.mcdoc",
          "match": "(::)?[A-Za-z_](::|[A-Za-z0-9_])*"
        }
      ]
    }
  }
};