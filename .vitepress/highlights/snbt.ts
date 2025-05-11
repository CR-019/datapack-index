export const snbt: any = {
  "displayName": "SNBT",
  "name": "snbt",
  "scopeName": "source.snbt",
  "uuid": "5d6bb8da-c96c-4c88-a3e7-f19975240123",
  "fileTypes": [
    "snbt",
    "nbt"
  ],
  "patterns": [
    { "include": "#root" }
  ],
  "repository": {
    "root": {
      "patterns": [
        { "include": "#brackets" },
        { "include": "#strings" },
        { "include": "#numbers" },
        { "include": "#booleans" },
        { "include": "#nulls" },
        { "include": "#commas-colons" },
        { "include": "#uuid" },
        { "include": "#keys" }
      ]
    },
    "strings": {
      "patterns": [
        {
          "begin": "\"",
          "beginCaptures": { "0": { "name": "punctuation.definition.string.begin.snbt" } },
          "end": "\"",
          "endCaptures": { "0": { "name": "punctuation.definition.string.end.snbt" } },
          "name": "string.quoted.double.snbt",
          "patterns": [
            {
              "match": "\\\\.",
              "name": "constant.character.escape.snbt"
            }
          ]
        },
        {
          "match": "'[^']*'",
          "name": "string.quoted.single.snbt"
        }
      ]
    },
    "numbers": {
      "patterns": [
        {
          "match": "\\b[+-]?\\d+(\\.\\d+)?([eE][+-]?\\d+)?[fFdD]?\\b",
          "name": "constant.numeric.float.snbt"
        },
        {
          "match": "\\b[+-]?\\d+[bBsSlL]?\\b",
          "name": "constant.numeric.integer.snbt"
        }
      ]
    },
    "booleans": {
      "patterns": [
        {
          "match": "\\b(true|false)\\b",
          "name": "constant.language.boolean.snbt"
        }
      ]
    },
    "nulls": {
      "patterns": [
        {
          "match": "\\b(null|NaN|Infinity)\\b",
          "name": "constant.language.null.snbt"
        }
      ]
    },
    "commas-colons": {
      "patterns": [
        { "match": "[:,]", "name": "punctuation.separator.snbt" }
      ]
    },
    "brackets": {
      "patterns": [
        { "match": "[\\{\\}]", "name": "punctuation.section.block.braces.snbt" },
        { "match": "[\\[\\]]", "name": "punctuation.section.block.brackets.snbt" }
      ]
    },
    "keys": {
      "patterns": [
        {
          "match": "(?<=\\{|,|\\[)\\s*[A-Za-z_][A-Za-z0-9_]*\\s*(?=\\:)",
          "name": "variable.other.key.snbt"
        }
      ]
    },
    "uuid": {
      "patterns": [
        {
          "match": "\\b[0-9a-fA-F]{8}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{4}\\-[0-9a-fA-F]{12}\\b",
          "name": "constant.other.uuid.snbt"
        }
      ]
    }
  }
}