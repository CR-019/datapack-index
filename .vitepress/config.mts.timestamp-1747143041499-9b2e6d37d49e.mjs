// .vitepress/config.mts
import { defineConfig } from "file:///G:/ywc/datapack_index/node_modules/.pnpm/vitepress@1.6.3_@algolia+client-search@5.23.3_@types+node@22.14.1_markdown-it-mathjax3@4.3.2__4cvhdpd5cxnizamsf7fpjr5vvu/node_modules/vitepress/dist/node/index.js";

// .vitepress/sidebar.ts
var sidebar = [
  {
    text: "\u9999\u8349\u56FE\u4E66\u9986",
    collapsed: false,
    items: [
      { text: "\u524D\u8A00", link: "/index/\u524D\u8A00" },
      { text: "\u7EEA\u8BBA", link: "/index/\u7EEA\u8BBA" },
      { text: "\u6700\u8FD1\u66F4\u65B0", link: "/index/_new" }
    ]
  },
  {
    text: "\u6708\u520A\u300AFeature\u300B",
    collapsed: false,
    items: [
      { text: "\u{1F3E0}\u7EDD\u8D5E\u5F81\u7A3F\u4E2D\uFF01", link: "/feature/_\u89C4\u5219" },
      { text: "\u{1F31F}2025.05\u671F", link: "/feature/index/202505" },
      { text: "2025.04\u671F", link: "/feature/index/202504" }
    ]
  },
  {
    text: "\u6570\u636E\u5305\u4F53\u7CFB\u7ED3\u6784",
    collapsed: false,
    items: [
      {
        text: "\u903B\u8F91\u7ED3\u6784\uFF1A\u547D\u4EE4/\u51FD\u6570",
        collapsed: false,
        items: [
          { text: "\u547D\u4EE4\u64CD\u4F5C", link: "/index/\u547D\u4EE41-\u547D\u4EE4\u64CD\u4F5C" },
          { text: "\u6570\u636E\u64CD\u4F5C", link: "/index/\u547D\u4EE42-\u6570\u636E\u64CD\u4F5C" },
          { text: "\u6587\u672C\u7EC4\u4EF6", link: "/index/\u547D\u4EE43-\u6587\u672C\u7EC4\u4EF6" },
          { text: "\u65B9\u5757/\u7269\u54C1\u64CD\u4F5C", link: "/index/\u547D\u4EE44-\u65B9\u5757\u548C\u7269\u54C1\u64CD\u4F5C" },
          { text: "\u5B9E\u4F53\u64CD\u4F5C", link: "/index/\u547D\u4EE45-\u5B9E\u4F53\u64CD\u4F5C" },
          { text: "\u4E16\u754C/\u670D\u52A1\u5668\u6307\u4EE4", link: "/index/\u547D\u4EE46-\u4E16\u754C\u6307\u4EE4" }
        ]
      },
      {
        text: "\u6570\u636E\u7ED3\u6784\uFF1A\u6570\u636E\u5305\u7EC4\u5206",
        link: "/index/\u6570\u636E\u53052-\u6570\u636E\u7ED3\u6784",
        collapsed: true,
        items: [
          { text: "\u6218\u5229\u54C1\u8868", link: "/index/\u6570\u636E\u53052-\u6570\u636E\u7ED3\u6784/#\u6218\u5229\u54C1\u8868" },
          { text: "\u8C13\u8BCD", link: "/index/\u6570\u636E\u53052-\u6570\u636E\u7ED3\u6784/#\u8C13\u8BCD" },
          { text: "\u7269\u54C1\u4FEE\u9970\u5668", link: "/index/\u6570\u636E\u7ED3\u6784/#\u7269\u54C1\u4FEE\u9970\u5668" },
          { text: "\u8FDB\u5EA6", link: "/index/\u6570\u636E\u53052-\u6570\u636E\u7ED3\u6784/#\u8FDB\u5EA6" },
          { text: "\u9644\u9B54", link: "/index/\u6570\u636E\u53052-\u6570\u636E\u7ED3\u6784/#\u9644\u9B54" },
          { text: "\u6807\u7B7E", link: "/index/\u6570\u636E\u53052-\u6570\u636E\u7ED3\u6784/#\u6807\u7B7E" },
          { text: "\u914D\u65B9", link: "/index/\u6570\u636E\u53052-\u6570\u636E\u7ED3\u6784/#\u914D\u65B9" }
        ]
      },
      {
        text: "\u4E16\u754C\u751F\u6210",
        link: "/index/\u6570\u636E\u53053-\u4E16\u754C\u751F\u6210",
        collapsed: true,
        items: [
          { text: "\u7ED3\u6784", link: "/index/\u6570\u636E\u53053-\u4E16\u754C\u751F\u6210/#\u7ED3\u6784" },
          { text: "\u7EF4\u5EA6\u548C\u7EF4\u5EA6\u7C7B\u578B", link: "/index/\u6570\u636E\u53053-\u4E16\u754C\u751F\u6210/#\u7EF4\u5EA6\u548C\u7EF4\u5EA6\u7C7B\u578B" },
          { text: "\u81EA\u5B9A\u4E49\u4E16\u754C\u751F\u6210", link: "/index/\u6570\u636E\u53053-\u4E16\u754C\u751F\u6210/#\u81EA\u5B9A\u4E49\u4E16\u754C\u751F\u6210" }
        ]
      },
      { text: "\u6570\u636E\u5305\u5E38\u7528\u6280\u672F\u6027\u5B9E\u4F53", link: "/index/\u6570\u636E\u53054-\u6280\u672F\u6027\u5B9E\u4F53" }
    ]
  },
  {
    text: "\u8D44\u6E90\u5305\u4F53\u7CFB\u7ED3\u6784",
    collapsed: true,
    link: "/index/\u8D44\u6E90\u5305\u4F53\u7CFB\u7ED3\u6784",
    items: [
      { text: "\u6A21\u578B", link: "/index/\u8D44\u6E90\u5305\u4F53\u7CFB\u7ED3\u6784/#\u6A21\u578B" },
      { text: "\u7EB9\u7406", link: "/index/\u8D44\u6E90\u5305\u4F53\u7CFB\u7ED3\u6784/#\u7EB9\u7406" },
      { text: "\u58F0\u97F3", link: "/index/\u8D44\u6E90\u5305\u4F53\u7CFB\u7ED3\u6784/#\u58F0\u97F3" },
      { text: "\u5B57\u4F53", link: "/index/\u8D44\u6E90\u5305\u4F53\u7CFB\u7ED3\u6784/#\u5B57\u4F53" },
      { text: "\u7740\u8272\u5668", link: "/index/\u8D44\u6E90\u5305\u4F53\u7CFB\u7ED3\u6784/#\u7740\u8272\u5668" }
    ]
  },
  { text: "\u6280\u672F\u6027\u66F4\u65B0\u65E5\u5FD7\uFF08\u7CBE\u7B80\u7248\uFF09", link: "/index/changelog_breaking" },
  {
    text: "\u539F\u7248\u6A21\u7EC4\u5B9E\u8DF5",
    collapsed: false,
    items: [
      { text: "\u6570\u636E\u5305\u5B9E\u8DF5", link: "/index/\u6570\u636E\u5305\u5B9E\u8DF5" },
      { text: "\u8D44\u6E90\u5305\u5B9E\u8DF5", link: "/index/\u8D44\u6E90\u5305\u5B9E\u8DF5" },
      { text: "\u8C03\u8BD5", link: "/index/\u8C03\u8BD5\u4E0E\u7EFC\u5408\u5B9E\u4F8B" },
      { text: "\u5F00\u53D1\u6742\u8C08", link: "/index/\u5F00\u53D1\u6742\u8C08" }
    ]
  },
  {
    text: "\u53C2\u8003\u4E0E\u53CB\u94FE",
    collapsed: false,
    items: [
      { text: "\u5DE5\u5177", link: "/index/\u5DE5\u5177" },
      { text: "\u53C2\u8003", link: "/index/\u53C2\u8003" },
      { text: "\u53CB\u60C5\u94FE\u63A5", link: "/index/\u53CB\u94FE" }
    ]
  },
  {
    text: "\u9644\u5F55",
    collapsed: true,
    items: [
      { text: "\u9644\u5F551\uFF1A\u5929\u8C79\u661F\u96F2\u6559\u7A0B\u5408\u96C6", link: "/index/\u9644\u5F551" },
      { text: "\u9644\u5F552\uFF1AAlumooper\u7684\u7740\u8272\u5668\u6559\u7A0B\u5408\u96C6\u2014\u2014MCJE\u7740\u8272\u5668\u6559\u7A0B\uFF1A\u4ECE\u5F00\u53D1\u5165\u95E8\u5230\u6E38\u620F\u5D29\u6E83", link: "/index/\u9644\u5F552" },
      { text: "\u9644\u5F553\uFF1A\u5730\u56FE\u539F\u8D34/\u8865\u6863\u5730\u5740", link: "/index/\u9644\u5F553" },
      { text: "\u9644\u5F554\uFF1A\u6742\u9879", link: "/index/\u9644\u5F554" },
      { text: "\u9644\u5F555\uFF1A\u300A\u62FE\u5C18\u300B\u7CFB\u5217\u539F\u7248\u6A21\u7EC4\u56FE\u6587\u6559\u7A0B", link: "/index/\u9644\u5F555" },
      { text: "\u9644\u5F556\uFF1A\u5931\u6548\u7D22\u5F15\u94FE\u63A5\u6574\u7406", link: "/index/\u9644\u5F556" },
      { text: "\u6280\u672F\u6027\u66F4\u65B0\u65E5\u5FD7", link: "/index/changelog" }
    ]
  },
  {
    text: "\u670D\u52A1\u53F0",
    collapsed: false,
    items: [
      { text: "\u6C34\u5427\u{1F375}", link: "/index/\u6C34\u5427" },
      { text: "\u5931\u7269\u62DB\u9886", link: "/index/\u5931\u7269\u62DB\u9886" },
      { text: "\u66F4\u65B0\u65E5\u5FD7", link: "/index/_update" }
    ]
  }
];

// .vitepress/highlights/mcfuntion.ts
var mcfunction = {
  "displayName": "Syntax Mcfunction",
  "name": "mcfunction",
  "scopeName": "source.mcfunction",
  "uuid": "8918dadd-8ebe-42d9-b1e9-0489ab228d9d",
  "fileTypes": [
    "mcfunction",
    "bolt"
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
          "include": "#comments"
        },
        {
          "include": "#literals"
        },
        {
          "include": "#say"
        },
        {
          "include": "#names"
        },
        {
          "include": "#comments_inline"
        },
        {
          "include": "#subcommands"
        },
        {
          "include": "#property"
        },
        {
          "include": "#operators"
        },
        {
          "include": "#selectors"
        }
      ]
    },
    "comments": {
      "patterns": [
        {
          "applyEndPatternLast": 1,
          "begin": "^\\s*(#[>!#])(.+)$",
          "beginCaptures": {
            "1": {
              "name": "comment.block.mcfunction"
            },
            "2": {
              "name": "markup.bold.mcfunction"
            }
          },
          "captures": {
            "0": {
              "name": "comment.block.mcfunction"
            }
          },
          "end": "^(?!#)",
          "name": "meta.comments",
          "patterns": [
            {
              "include": "#comments_block"
            }
          ]
        },
        {
          "captures": {
            "0": {
              "name": "comment.line.mcfunction"
            }
          },
          "match": "^\\s*#.*$",
          "name": "meta.comments"
        },
        {
          "captures": {
            "0": {
              "name": "comment.line.mcfunction"
            }
          },
          "match": "^\\s*\\.\\.\\..*$",
          "name": "meta.comments"
        }
      ]
    },
    "comments_inline": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "comment.line.mcfunction"
            }
          },
          "match": "#.*$",
          "name": "meta.comments"
        }
      ]
    },
    "comments_block": {
      "patterns": [
        {
          "applyEndPatternLast": 1,
          "begin": "^\\s*#[>!]",
          "captures": {
            "0": {
              "name": "comment.block.mcfunction"
            }
          },
          "end": "$",
          "name": "meta.comments_block",
          "patterns": [
            {
              "include": "#comments_block_emphasized"
            }
          ]
        },
        {
          "applyEndPatternLast": 1,
          "begin": "^\\s*#",
          "captures": {
            "0": {
              "name": "comment.block.mcfunction"
            }
          },
          "end": "$",
          "name": "meta.comments_block",
          "patterns": [
            {
              "include": "#comments_block_normal"
            }
          ]
        }
      ]
    },
    "comments_block_emphasized": {
      "patterns": [
        {
          "include": "#comments_block_special"
        },
        {
          "captures": {
            "0": {
              "name": "markup.bold.mcfunction"
            }
          },
          "match": "\\S+",
          "name": "meta.comments_block_emphasized"
        }
      ]
    },
    "comments_block_normal": {
      "patterns": [
        {
          "include": "#comments_block_special"
        },
        {
          "captures": {
            "0": {
              "name": "comment.block.mcfunction"
            }
          },
          "match": "\\S+",
          "name": "meta.comments_block_normal"
        },
        {
          "include": "#whitespace"
        }
      ]
    },
    "comments_block_special": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "markup.heading.mcfunction"
            }
          },
          "match": "@\\S+",
          "name": "meta.comments_block_special"
        },
        {
          "include": "#resource-name"
        },
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "[#%$][A-Za-z0-9_.#%$]+",
          "name": "meta.comments_block_special"
        }
      ]
    },
    "literals": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "constant.numeric.boolean.mcfunction"
            }
          },
          "match": "\\b(true|false|True|False)\\b",
          "name": "meta.literals"
        },
        {
          "captures": {
            "0": {
              "name": "variable.uuid.mcfunction"
            }
          },
          "match": "\\b[0-9a-fA-F]+(?:-[0-9a-fA-F]+){4}\\b",
          "name": "meta.names"
        },
        {
          "captures": {
            "0": {
              "name": "constant.numeric.float.mcfunction"
            }
          },
          "match": "[+-]?\\d*\\.?\\d+([eE]?[+-]?\\d+)?[df]?\\b",
          "name": "meta.literals"
        },
        {
          "captures": {
            "0": {
              "name": "constant.numeric.integer.mcfunction"
            }
          },
          "match": "[+-]?\\d+(b|B|L|l|s|S)?\\b",
          "name": "meta.literals"
        },
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "\\.\\.",
          "name": "meta.ellipse.literals"
        },
        {
          "applyEndPatternLast": 1,
          "begin": '"',
          "beginCaptures": {
            "0": {
              "name": "punctuation.definition.string.begin.mcfunction"
            }
          },
          "end": '"',
          "endCaptures": {
            "0": {
              "name": "punctuation.definition.string.end.mcfunction"
            }
          },
          "name": "string.quoted.double.mcfunction",
          "patterns": [
            {
              "include": "#literals_string-double"
            }
          ]
        },
        {
          "applyEndPatternLast": 1,
          "begin": "'",
          "beginCaptures": {
            "0": {
              "name": "punctuation.definition.string.begin.mcfunction"
            }
          },
          "end": "'",
          "endCaptures": {
            "0": {
              "name": "punctuation.definition.string.begin.mcfunction"
            }
          },
          "name": "string.quoted.single.mcfunction",
          "patterns": [
            {
              "include": "#literals_string-single"
            }
          ]
        }
      ]
    },
    "subcommands": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "entity.name.class.mcfunction"
            }
          },
          "match": "[a-z_]+",
          "name": "meta.literals"
        }
      ]
    },
    "literals_string-double": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "constant.character.escape.mcfunction"
            }
          },
          "match": "\\\\.",
          "name": "meta.literals_string-double"
        },
        {
          "captures": {
            "0": {
              "name": "constant.character.escape.mcfunction"
            }
          },
          "match": "\\\\",
          "name": "meta.literals_string-double"
        },
        {
          "include": "#macro-name"
        },
        {
          "captures": {
            "0": {
              "name": "string.quoted.double.mcfunction"
            }
          },
          "match": '[^\\\\"]',
          "name": "meta.literals_string-double"
        }
      ]
    },
    "literals_string-single": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "constant.character.escape.mcfunction"
            }
          },
          "match": "\\\\.",
          "name": "meta.literals_string-single"
        },
        {
          "captures": {
            "0": {
              "name": "constant.character.escape.mcfunction"
            }
          },
          "match": "\\\\",
          "name": "meta.literals_string-double"
        },
        {
          "include": "#macro-name"
        },
        {
          "captures": {
            "0": {
              "name": "string.quoted.single.mcfunction"
            }
          },
          "match": "[^\\\\']",
          "name": "meta.literals_string-single"
        }
      ]
    },
    "say": {
      "patterns": [
        {
          "begin": "^(\\s*)(say)",
          "beginCaptures": {
            "1": {
              "name": "whitespace.mcfunction"
            },
            "2": {
              "name": "keyword.control.flow.mcfunction"
            }
          },
          "end": "\\n",
          "name": "meta.say.mcfunction",
          "patterns": [
            {
              "captures": {
                "0": {
                  "name": "constant.character.escape.mcfunction"
                }
              },
              "match": "\\\\\\s*\\n",
              "meta": "meta.say.backslash.mcfunction"
            },
            {
              "include": "#literals_string-double"
            },
            {
              "include": "#literals_string-single"
            }
          ]
        },
        {
          "begin": "(run)(\\s+)(say)",
          "beginCaptures": {
            "1": {
              "name": "entity.name.mcfunction"
            },
            "2": {
              "name": "whitespace.mcfunction"
            },
            "3": {
              "name": "keyword.control.flow.mcfunction"
            }
          },
          "end": "\\n",
          "name": "meta.say.mcfunction",
          "patterns": [
            {
              "captures": {
                "0": {
                  "name": "constant.character.escape.mcfunction"
                }
              },
              "match": "\\\\\\s*\\n",
              "meta": "meta.say.backslash.mcfunction"
            },
            {
              "include": "#literals_string-double"
            },
            {
              "include": "#literals_string-single"
            }
          ]
        }
      ]
    },
    "names": {
      "patterns": [
        {
          "captures": {
            "1": {
              "name": "whitespace.mcfunction"
            },
            "2": {
              "name": "keyword.control.flow.mcfunction"
            }
          },
          "match": "^(\\s*)([a-z_]+)(?=\\s)",
          "name": "meta.names"
        },
        {
          "captures": {
            "1": {
              "name": "whitespace.mcfunction"
            },
            "2": {
              "name": "markup.italic.mcfunction"
            },
            "3": {
              "name": "whitespace.mcfunction"
            },
            "4": {
              "name": "keyword.control.flow.mcfunction"
            }
          },
          "match": "^(\\s*)(\\$)( ?)([a-z_]*)",
          "name": "meta.names"
        },
        {
          "captures": {
            "1": {
              "name": "entity.name.mcfunction"
            },
            "2": {
              "name": "whitespace.mcfunction"
            },
            "3": {
              "name": "keyword.control.flow.mcfunction"
            }
          },
          "match": "(run)(\\s+)([a-z_]+)",
          "name": "meta.names"
        },
        {
          "include": "#resource-name"
        },
        {
          "captures": {
            "0": {
              "name": "entity.name.mcfunction"
            }
          },
          "match": "[A-Za-z]+(?=\\W)",
          "name": "meta.names"
        },
        {
          "captures": {
            "0": {
              "name": "string.unquoted.mcfunction"
            }
          },
          "match": "[A-Za-z_][A-Za-z0-9_.#%$]*",
          "name": "meta.names"
        },
        {
          "include": "#macro-name"
        },
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "([#%$]|((?<=\\s)\\.))[A-Za-z0-9_.#%$\\-]+",
          "name": "meta.names"
        }
      ]
    },
    "macro-name": {
      "patterns": [
        {
          "captures": {
            "1": {
              "name": "punctuation.definition.template-expression.begin.mcfunction"
            },
            "2": {
              "name": "variable.other.mcfunction"
            },
            "3": {
              "name": "punctuation.definition.template-expression.end.mcfunction"
            }
          },
          "match": "(\\$\\()([A-Za-z0-9_]*)(\\))",
          "name": "meta.macro-name"
        }
      ]
    },
    "operators": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "constant.numeric.mcfunction"
            }
          },
          "match": "[~^]",
          "name": "meta.operators"
        },
        {
          "captures": {
            "0": {
              "name": "keyword.operator.mcfunction"
            }
          },
          "match": "[\\-%?!+*<>\\\\/|&=.:,;]",
          "name": "meta.operators"
        }
      ]
    },
    "property": {
      "patterns": [
        {
          "applyEndPatternLast": 1,
          "begin": "\\{",
          "captures": {
            "0": {
              "name": "punctuation.mcfunction"
            }
          },
          "end": "\\}",
          "name": "meta.property.curly",
          "patterns": [
            {
              "include": "#resource-name"
            },
            {
              "include": "#literals"
            },
            {
              "include": "#property_key"
            },
            {
              "include": "#operators"
            },
            {
              "include": "#property_value"
            },
            {
              "include": "$self"
            }
          ]
        },
        {
          "applyEndPatternLast": 1,
          "begin": "\\[",
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "end": "\\]",
          "name": "meta.property.square",
          "patterns": [
            {
              "include": "#resource-name"
            },
            {
              "include": "#literals"
            },
            {
              "include": "#property_key"
            },
            {
              "include": "#operators"
            },
            {
              "include": "#property_value"
            },
            {
              "include": "$self"
            }
          ]
        },
        {
          "applyEndPatternLast": 1,
          "begin": "\\(",
          "captures": {
            "0": {
              "name": "punctuation.mcfunction"
            }
          },
          "end": "\\)",
          "name": "meta.property.paren",
          "patterns": [
            {
              "include": "#resource-name"
            },
            {
              "include": "#literals"
            },
            {
              "include": "#property_key"
            },
            {
              "include": "#operators"
            },
            {
              "include": "#property_value"
            },
            {
              "include": "$self"
            }
          ]
        }
      ]
    },
    "property_key": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "#?[a-z_][a-z_\\.\\-]*\\:[a-z0-9_\\.\\-/]+(?=\\s*\\=:)",
          "name": "meta.property_key"
        },
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "#?[a-z_][a-z0-9_\\.\\-/]+",
          "name": "meta.property_key"
        },
        {
          "captures": {
            "0": {
              "name": "variable.other.mcfunction"
            }
          },
          "match": "[A-Za-z_]+[A-Za-z_\\-\\+]*",
          "name": "meta.property_key"
        }
      ]
    },
    "property_value": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "string.unquoted.mcfunction"
            }
          },
          "match": "#?[a-z_][a-z_\\.\\-]*\\:[a-z0-9_\\.\\-/]+",
          "name": "meta.property_value"
        },
        {
          "captures": {
            "0": {
              "name": "string.unquoted.mcfunction"
            }
          },
          "match": "#?[a-z_][a-z0-9_\\.\\-/]+",
          "name": "meta.property_value"
        }
      ]
    },
    "resource-name": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "entity.name.function.mcfunction"
            }
          },
          "match": "#?[a-z_][a-z0-9_.-]*:[a-z0-9_./-]+",
          "name": "meta.resource-name"
        },
        {
          "captures": {
            "0": {
              "name": "entity.name.function.mcfunction"
            }
          },
          "match": "#?[a-z0-9_\\.\\-]+\\/[a-z0-9_\\.\\-\\/]+",
          "name": "meta.resource-name"
        }
      ]
    },
    "selectors": {
      "patterns": [
        {
          "captures": {
            "0": {
              "name": "support.class.mcfunction"
            }
          },
          "match": "@[a-z]+",
          "name": "meta.selectors"
        }
      ]
    }
  }
};

// .vitepress/highlights/mcdoc/mcdoc.ts
var mcdoc = {
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
          "begin": '"',
          "end": '"'
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
              "begin": '"',
              "end": '"'
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

// .vitepress/highlights/snbt.ts
var snbt = {
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
          "begin": '"',
          "beginCaptures": { "0": { "name": "punctuation.definition.string.begin.snbt" } },
          "end": '"',
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
};

// .vitepress/config.mts
import anchor from "file:///G:/ywc/datapack_index/node_modules/.pnpm/markdown-it-footnote@3.0.3/node_modules/markdown-it-footnote/index.js";

// .vitepress/sidebar_feature.ts
var sidebar_feature = [
  {
    text: "\u6708\u520A\u300AFeature\u300B",
    items: [
      { text: "\u7EDD\u8D5E\u5F81\u7A3F\u4E2D\uFF01", link: "/feature/_\u89C4\u5219" }
    ]
  },
  {
    text: "\u{1F31F}2025.5\u6708\u520A",
    link: "/feature/index/202505"
  },
  {
    text: "2025.4\u6708\u520A",
    link: "/feature/index/202504"
  },
  {
    items: [
      { text: "\u6708\u520A\u6761\u6B3E", link: "/feature/_\u6761\u6B3E" },
      { text: "\u8FD4\u56DE\u4E3B\u7AD9", link: "/index/\u7EEA\u8BBA" }
    ]
  }
];
var sidebar_202504 = [
  {
    text: "Feature 2025.04",
    items: [
      { text: "\u76EE\u5F55", link: "/feature/index/202504" },
      { text: "\u521B\u520A\u5BC4\u8BED", link: "/feature/archive/202504/preface" },
      { text: "\u4E0B\u4E00\u520A", link: "/feature/index/202505" }
    ]
  },
  {
    text: "\u5C01\u9762\u6587\u7AE0",
    items: [
      { text: "\u539F\u7248\u5BB6\u5177\u7684\u201C\u7EC8\u6781\u7B54\u6848\u201D\uFF1F\u2014\u2014\u65B0\u4E00\u4EE3\u5BB6\u5177\u6846\u67B6\u300A\u677E\u679C\u6838\u300B", link: "/feature/archive/202504/0/content" }
    ]
  },
  {
    text: "\u5185\u5BB9\u7D22\u5F15",
    items: [
      { text: "\u6570\u636E\u5305\u5FEB\u901F\u5165\u95E8", link: "/feature/archive/202504/1/content" },
      { text: "\u5982\u4F55\u5408\u5E76\u591A\u4E2A\u7248\u672C\u7684\u6570\u636E\u5305\uFF1F", link: "/feature/archive/202504/2/content" },
      { text: "\u6570\u636E\u5305\u4F18\u5316\u539F\u5219\u4EE5\u53CA\u5206\u6790\u65B9\u5F0F\u7B80\u8FF0", link: "/feature/archive/202504/3/content" },
      { text: "NeKoCustomSpawn-demo", link: "/feature/archive/202504/4/content" },
      { text: "Java\u72481.21.5-SNBT\u8BED\u6CD5\u6982\u89C8", link: "/feature/archive/202504/5/content" },
      { text: "\u62FE\u5C18\uFF08\u4E03\uFF09-\u4F7F\u7528\u590D\u5408\u7269\u54C1\u6A21\u578B\u6620\u5C04\u66F4\u7B80\u4FBF\u7684\u5236\u4F5C\u72B6\u6001\u680F", link: "/feature/archive/202504/6/content" },
      { text: "\u6839\u636E\u73A9\u5BB6\u8BB0\u5206\u677F\u5206\u6570\u8FDB\u884C\u6392\u540D", link: "/feature/archive/202504/7/content" }
    ]
  },
  {
    items: [
      { text: "\u300AFeatures\u300B\u4E3B\u9875", link: "/feature/_\u89C4\u5219" },
      { text: "\u6708\u520A\u6761\u6B3E", link: "/feature/_\u6761\u6B3E" },
      { text: "\u8FD4\u56DE\u4E3B\u7AD9", link: "/index/\u7EEA\u8BBA" }
    ]
  }
];
var sidebar_202505 = [
  {
    text: "Feature 2025.05",
    items: [
      { text: "\u76EE\u5F55", link: "/feature/index/202505" },
      { text: "\u4E0A\u4E00\u520A", link: "/feature/index/202504" }
    ]
  },
  {
    text: "\u5C01\u9762\u6587\u7AE0",
    items: [
      { text: "\u70DF\u82B1\u6765\u54AF\uFF01", link: "/feature/archive/202505/1/content" }
    ]
  },
  {
    text: "\u039Bojang Spotlight",
    items: [
      { text: "\u9999\u8349\u5FEB\u8BAF - 2025\u5E745\u6708", link: "/feature/archive/202505/spotlight/content" }
    ]
  },
  {
    text: "\u5185\u5BB9\u7D22\u5F15",
    items: [
      { text: "\u5BF9\u5C55\u793A\u5B9E\u4F53\u6E32\u67D3\u53D8\u6362\u7684\u7814\u7A76", link: "/feature/archive/202505/2/content" },
      { text: "Spyglass(\u5927\u61A8\u6279)\u8FDB\u9636\u4F7F\u7528\u8BF4\u660E", link: "/feature/archive/202505/3/content" },
      { text: "\u6570\u636E\u5305\u548C\u547D\u4EE4\u5165\u95E8\u5B66\u4E60-\u521D\u5B66\u8005\u5982\u4F55\u5FEB\u901F\u9002\u5E94", link: "/feature/archive/202505/4/content" },
      { text: "\u539F\u7248\u8840\u6761\uFF01", link: "/feature/archive/202505/5/content" },
      { text: "Digging Underground", link: "/feature/archive/202505/6/content" }
    ]
  },
  {
    items: [
      { text: "\u300AFeatures\u300B\u4E3B\u9875", link: "/feature/_\u89C4\u5219" },
      { text: "\u6708\u520A\u6761\u6B3E", link: "/feature/_\u6761\u6B3E" },
      { text: "\u8FD4\u56DE\u4E3B\u7AD9", link: "/index/\u7EEA\u8BBA" }
    ]
  }
];

// .vitepress/config.mts
import viteImagemin from "file:///G:/ywc/datapack_index/node_modules/.pnpm/vite-plugin-imagemin@0.6.1_vite@5.4.18_@types+node@22.14.1_/node_modules/vite-plugin-imagemin/dist/index.mjs";
var config_default = defineConfig({
  title: "\u9999\u8349\u56FE\u4E66\u9986",
  base: "/datapack-index/",
  description: "Powered by VitePress",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    outlineTitle: "\u6982\u89C8",
    outline: [2, 6],
    nav: [
      { text: "\u6587\u6863", link: "/index/\u7EEA\u8BBA" },
      { text: "\u300AFeature\u300B", link: "/feature/_\u89C4\u5219" },
      { text: "Wiki", link: "https://zh.minecraft.wiki/" }
    ],
    search: {
      provider: "local",
      options: {
        translations: {
          button: {
            buttonText: "\u641C\u7D22",
            buttonAriaLabel: "\u641C\u7D22\u6587\u6863"
          },
          modal: {
            noResultsText: "\u65E0\u6CD5\u627E\u5230\u76F8\u5173\u7ED3\u679C",
            resetButtonTitle: "\u6E05\u9664\u67E5\u8BE2\u6761\u4EF6",
            footer: {
              selectText: "\u9009\u62E9",
              navigateText: "\u5207\u6362"
            }
          }
        }
      }
    },
    sidebar: {
      "/index/": sidebar,
      "/resources/": sidebar,
      "/feature/archive/202504": sidebar_202504,
      "/feature/archive/202505": sidebar_202505,
      "/feature/": sidebar_feature
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/CR-019/datapack-index" },
      { icon: "bilibili", link: "https://space.bilibili.com/85292644" },
      { icon: "afdian", link: "https://afdian.com/a/CR_019" }
    ],
    logo: "/dream_catcher11.png",
    footer: {
      copyright: "Copyright\xA92025 CR_019",
      message: '<a href="https://mcicp.com" title="MCICP\u59072024000012\u53F7" target="_blank">MCICP\u59072024000012\u53F7</a> | Powered by Vitepress and Github Pages'
    }
  },
  head: [
    ["link", { rel: "icon", href: "/datapack-index/dream_catcher11.png" }]
  ],
  ignoreDeadLinks: true,
  lastUpdated: false,
  markdown: {
    languages: [mcfunction, mcdoc, snbt],
    math: true,
    shikiSetup: async (shiki) => {
      await shiki.loadLanguage(mcfunction);
      await shiki.loadLanguage(mcdoc);
    },
    config: (md) => {
      md.use(anchor);
    }
  },
  vite: {
    plugins: [
      viteImagemin({
        gifsicle: { optimizationLevel: 3 },
        mozjpeg: { quality: 75 },
        pngquant: { quality: [0.8, 0.9] },
        svgo: { plugins: [{ removeViewBox: false }] }
      })
    ]
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9jb25maWcubXRzIiwgIi52aXRlcHJlc3Mvc2lkZWJhci50cyIsICIudml0ZXByZXNzL2hpZ2hsaWdodHMvbWNmdW50aW9uLnRzIiwgIi52aXRlcHJlc3MvaGlnaGxpZ2h0cy9tY2RvYy9tY2RvYy50cyIsICIudml0ZXByZXNzL2hpZ2hsaWdodHMvc25idC50cyIsICIudml0ZXByZXNzL3NpZGViYXJfZmVhdHVyZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkc6XFxcXHl3Y1xcXFxkYXRhcGFja19pbmRleFxcXFwudml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJHOlxcXFx5d2NcXFxcZGF0YXBhY2tfaW5kZXhcXFxcLnZpdGVwcmVzc1xcXFxjb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9HOi95d2MvZGF0YXBhY2tfaW5kZXgvLnZpdGVwcmVzcy9jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSAndml0ZXByZXNzJ1xyXG5pbXBvcnQgeyBzaWRlYmFyIH0gZnJvbSAnLi9zaWRlYmFyJ1xyXG5pbXBvcnQgeyBtY2Z1bmN0aW9uIH0gZnJvbSAnLi9oaWdobGlnaHRzL21jZnVudGlvbidcclxuaW1wb3J0IHsgbWNkb2MgfSBmcm9tICcuL2hpZ2hsaWdodHMvbWNkb2MvbWNkb2MnXHJcbmltcG9ydCB7IHNuYnQgfSBmcm9tICcuL2hpZ2hsaWdodHMvc25idCdcclxuaW1wb3J0IGFuY2hvciBmcm9tICdtYXJrZG93bi1pdC1mb290bm90ZSdcclxuaW1wb3J0IHsgc2lkZWJhcl9mZWF0dXJlICwgc2lkZWJhcl8yMDI1MDQsIHNpZGViYXJfMjAyNTA1IH0gZnJvbSAnLi9zaWRlYmFyX2ZlYXR1cmUnXHJcbmltcG9ydCB2aXRlSW1hZ2VtaW4gZnJvbSAndml0ZS1wbHVnaW4taW1hZ2VtaW4nXHJcblxyXG4vLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL3NpdGUtY29uZmlnXHJcbmV4cG9ydCBkZWZhdWx0IGRlZmluZUNvbmZpZyh7XHJcbiAgdGl0bGU6IFwiXHU5OTk5XHU4MzQ5XHU1NkZFXHU0RTY2XHU5OTg2XCIsXHJcbiAgYmFzZTpcIi9kYXRhcGFjay1pbmRleC9cIixcclxuICBkZXNjcmlwdGlvbjogXCJQb3dlcmVkIGJ5IFZpdGVQcmVzc1wiLFxyXG4gIHRoZW1lQ29uZmlnOiB7XHJcbiAgICAvLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL2RlZmF1bHQtdGhlbWUtY29uZmlnXHJcbiAgICBvdXRsaW5lVGl0bGU6XCJcdTY5ODJcdTg5QzhcIixcclxuICAgIG91dGxpbmU6WzIsNl0sXHJcbiAgICBuYXY6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU2NTg3XHU2ODYzJywgbGluazogJy9pbmRleC9cdTdFRUFcdThCQkEnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1MzAwQUZlYXR1cmVcdTMwMEInLCBsaW5rOiAnL2ZlYXR1cmUvX1x1ODlDNFx1NTIxOScgfSxcclxuICAgICAgeyB0ZXh0OiAnV2lraScsIGxpbms6ICdodHRwczovL3poLm1pbmVjcmFmdC53aWtpLycgfVxyXG4gICAgXSxcclxuICAgIHNlYXJjaDoge1xyXG4gICAgICBwcm92aWRlcjogXCJsb2NhbFwiLFxyXG4gICAgICBvcHRpb25zOiB7XHJcbiAgICAgICAgdHJhbnNsYXRpb25zOiB7XHJcbiAgICAgICAgICBidXR0b246IHtcclxuICAgICAgICAgICAgYnV0dG9uVGV4dDogXCJcdTY0MUNcdTdEMjJcIixcclxuICAgICAgICAgICAgYnV0dG9uQXJpYUxhYmVsOiBcIlx1NjQxQ1x1N0QyMlx1NjU4N1x1Njg2M1wiXHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgbW9kYWw6IHtcclxuICAgICAgICAgICAgbm9SZXN1bHRzVGV4dDogXCJcdTY1RTBcdTZDRDVcdTYyN0VcdTUyMzBcdTc2RjhcdTUxNzNcdTdFRDNcdTY3OUNcIixcclxuICAgICAgICAgICAgcmVzZXRCdXR0b25UaXRsZTogXCJcdTZFMDVcdTk2NjRcdTY3RTVcdThCRTJcdTY3NjFcdTRFRjZcIixcclxuICAgICAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgICAgc2VsZWN0VGV4dDogXCJcdTkwMDlcdTYyRTlcIixcclxuICAgICAgICAgICAgICBuYXZpZ2F0ZVRleHQ6IFwiXHU1MjA3XHU2MzYyXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgfVxyXG4gICAgfSxcclxuXHJcbiAgICBzaWRlYmFyOiB7XHJcbiAgICAgICcvaW5kZXgvJzogc2lkZWJhcixcclxuICAgICAgJy9yZXNvdXJjZXMvJyA6IHNpZGViYXIsXHJcbiAgICAgICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNCcgOiBzaWRlYmFyXzIwMjUwNCxcclxuICAgICAgJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA1JyA6IHNpZGViYXJfMjAyNTA1LFxyXG4gICAgICAnL2ZlYXR1cmUvJyA6IHNpZGViYXJfZmVhdHVyZVxyXG4gICAgfSxcclxuXHJcbiAgICBzb2NpYWxMaW5rczogW1xyXG4gICAgICB7IGljb246ICdnaXRodWInLCBsaW5rOiAnaHR0cHM6Ly9naXRodWIuY29tL0NSLTAxOS9kYXRhcGFjay1pbmRleCcgfSxcclxuICAgICAgeyBpY29uOiAnYmlsaWJpbGknLCBsaW5rOiAnaHR0cHM6Ly9zcGFjZS5iaWxpYmlsaS5jb20vODUyOTI2NDQnIH0sXHJcbiAgICAgIHsgaWNvbjonYWZkaWFuJyAsbGluazonaHR0cHM6Ly9hZmRpYW4uY29tL2EvQ1JfMDE5J31cclxuICAgIF0sXHJcbiAgICBsb2dvOicvZHJlYW1fY2F0Y2hlcjExLnBuZycsXHJcbiAgICBmb290ZXI6e1xyXG4gICAgICBjb3B5cmlnaHQ6XCJDb3B5cmlnaHRcdTAwQTkyMDI1IENSXzAxOVwiLFxyXG4gICAgICBtZXNzYWdlOlwiPGEgaHJlZj1cXFwiaHR0cHM6Ly9tY2ljcC5jb21cXFwiIHRpdGxlPVxcXCJNQ0lDUFx1NTkwNzIwMjQwMDAwMTJcdTUzRjdcXFwiIHRhcmdldD1cXFwiX2JsYW5rXFxcIj5NQ0lDUFx1NTkwNzIwMjQwMDAwMTJcdTUzRjc8L2E+IHwgUG93ZXJlZCBieSBWaXRlcHJlc3MgYW5kIEdpdGh1YiBQYWdlc1wiXHJcbiAgICB9XHJcbiAgfSxcclxuICBoZWFkOiBbXHJcbiAgICAgIFsnbGluaycsIHsgcmVsOiAnaWNvbicsIGhyZWY6ICcvZGF0YXBhY2staW5kZXgvZHJlYW1fY2F0Y2hlcjExLnBuZycgfV1cclxuICBdLFxyXG4gIGlnbm9yZURlYWRMaW5rczogdHJ1ZSxcclxuICBsYXN0VXBkYXRlZDogZmFsc2UsXHJcblxyXG5tYXJrZG93bjoge1xyXG4gIGxhbmd1YWdlczogW21jZnVuY3Rpb24sIG1jZG9jLCBzbmJ0XSxcclxuICBtYXRoOiB0cnVlLFxyXG5cclxuICBzaGlraVNldHVwOiBhc3luYyAoc2hpa2kpID0+IHtcclxuICAgIGF3YWl0IHNoaWtpLmxvYWRMYW5ndWFnZShtY2Z1bmN0aW9uKVxyXG4gICAgYXdhaXQgc2hpa2kubG9hZExhbmd1YWdlKG1jZG9jKVxyXG4gIH0sXHJcblxyXG4gIGNvbmZpZzogKG1kKSA9PiB7XHJcbiAgICBtZC51c2UoYW5jaG9yKVxyXG4gIH1cclxufSxcclxuICB2aXRlOiB7XHJcbiAgICBwbHVnaW5zOiBbXHJcbiAgICAgIHZpdGVJbWFnZW1pbih7XHJcbiAgICAgICAgZ2lmc2ljbGU6IHsgb3B0aW1pemF0aW9uTGV2ZWw6IDMgfSxcclxuICAgICAgICBtb3pqcGVnOiB7IHF1YWxpdHk6IDc1IH0sXHJcbiAgICAgICAgcG5ncXVhbnQ6IHsgcXVhbGl0eTogWzAuOCwgMC45XSB9LFxyXG4gICAgICAgIHN2Z286IHsgcGx1Z2luczogW3sgcmVtb3ZlVmlld0JveDogZmFsc2UgfV0gfSxcclxuICAgICAgfSksXHJcbiAgICBdLFxyXG4gIH0sXHJcbn0pXHJcblxyXG5cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFx5d2NcXFxcZGF0YXBhY2tfaW5kZXhcXFxcLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRzpcXFxceXdjXFxcXGRhdGFwYWNrX2luZGV4XFxcXC52aXRlcHJlc3NcXFxcc2lkZWJhci50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRzoveXdjL2RhdGFwYWNrX2luZGV4Ly52aXRlcHJlc3Mvc2lkZWJhci50c1wiO2ltcG9ydCB7IERlZmF1bHRUaGVtZSB9IGZyb20gXCJ2aXRlcHJlc3NcIjtcclxuZXhwb3J0IGNvbnN0IHNpZGViYXI6IERlZmF1bHRUaGVtZS5TaWRlYmFyID0gW1xyXG4gICAge1xyXG4gICAgICB0ZXh0OiAnXHU5OTk5XHU4MzQ5XHU1NkZFXHU0RTY2XHU5OTg2JyxcclxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgaXRlbXM6IFtcclxuICAgICAgICB7IHRleHQ6ICdcdTUyNERcdThBMDAnLCBsaW5rOiAnL2luZGV4L1x1NTI0RFx1OEEwMCcgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTdFRUFcdThCQkEnLCBsaW5rOiAnL2luZGV4L1x1N0VFQVx1OEJCQScgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTY3MDBcdThGRDFcdTY2RjRcdTY1QjAnLCBsaW5rOiAnL2luZGV4L19uZXcnIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgdGV4dDogJ1x1NjcwOFx1NTIwQVx1MzAwQUZlYXR1cmVcdTMwMEInLFxyXG4gICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICBpdGVtczogW1xyXG4gICAgICAgIHsgdGV4dDogJ1x1RDgzQ1x1REZFMFx1N0VERFx1OEQ1RVx1NUY4MVx1N0EzRlx1NEUyRFx1RkYwMScsIGxpbms6ICcvZmVhdHVyZS9fXHU4OUM0XHU1MjE5JyB9LFxyXG4gICAgICAgIHsgdGV4dDogJ1x1RDgzQ1x1REYxRjIwMjUuMDVcdTY3MUYnLCBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA1JyB9LFxyXG4gICAgICAgIHsgdGV4dDogJzIwMjUuMDRcdTY3MUYnLCBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA0JyB9LFxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICB0ZXh0OiAnXHU2NTcwXHU2MzZFXHU1MzA1XHU0RjUzXHU3Q0ZCXHU3RUQzXHU2Nzg0JyxcclxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgaXRlbXM6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICB0ZXh0OiAnXHU5MDNCXHU4RjkxXHU3RUQzXHU2Nzg0XHVGRjFBXHU1NDdEXHU0RUU0L1x1NTFGRFx1NjU3MCcsXHJcbiAgICAgICAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU1NDdEXHU0RUU0XHU2NENEXHU0RjVDJywgbGluazogJy9pbmRleC9cdTU0N0RcdTRFRTQxLVx1NTQ3RFx1NEVFNFx1NjRDRFx1NEY1QycgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU2NTcwXHU2MzZFXHU2NENEXHU0RjVDJywgbGluazogJy9pbmRleC9cdTU0N0RcdTRFRTQyLVx1NjU3MFx1NjM2RVx1NjRDRFx1NEY1QycgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU2NTg3XHU2NzJDXHU3RUM0XHU0RUY2JywgbGluazogJy9pbmRleC9cdTU0N0RcdTRFRTQzLVx1NjU4N1x1NjcyQ1x1N0VDNFx1NEVGNicgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU2NUI5XHU1NzU3L1x1NzI2OVx1NTRDMVx1NjRDRFx1NEY1QycsIGxpbms6ICcvaW5kZXgvXHU1NDdEXHU0RUU0NC1cdTY1QjlcdTU3NTdcdTU0OENcdTcyNjlcdTU0QzFcdTY0Q0RcdTRGNUMnIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1NUI5RVx1NEY1M1x1NjRDRFx1NEY1QycsIGxpbms6ICcvaW5kZXgvXHU1NDdEXHU0RUU0NS1cdTVCOUVcdTRGNTNcdTY0Q0RcdTRGNUMnIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1NEUxNlx1NzU0Qy9cdTY3MERcdTUyQTFcdTU2NjhcdTYzMDdcdTRFRTQnLCBsaW5rOiAnL2luZGV4L1x1NTQ3RFx1NEVFNDYtXHU0RTE2XHU3NTRDXHU2MzA3XHU0RUU0JyB9LFxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgdGV4dDogJ1x1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NFx1RkYxQVx1NjU3MFx1NjM2RVx1NTMwNVx1N0VDNFx1NTIwNicsXHJcbiAgICAgICAgICBsaW5rOiAnL2luZGV4L1x1NjU3MFx1NjM2RVx1NTMwNTItXHU2NTcwXHU2MzZFXHU3RUQzXHU2Nzg0JyxcclxuICAgICAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1NjIxOFx1NTIyOVx1NTRDMVx1ODg2OCcsIGxpbms6ICcvaW5kZXgvXHU2NTcwXHU2MzZFXHU1MzA1Mi1cdTY1NzBcdTYzNkVcdTdFRDNcdTY3ODQvI1x1NjIxOFx1NTIyOVx1NTRDMVx1ODg2OCcgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU4QzEzXHU4QkNEJywgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUyLVx1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NC8jXHU4QzEzXHU4QkNEJyB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTcyNjlcdTU0QzFcdTRGRUVcdTk5NzBcdTU2NjgnLCBsaW5rOiAnL2luZGV4L1x1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NC8jXHU3MjY5XHU1NEMxXHU0RkVFXHU5OTcwXHU1NjY4JyB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdcdThGREJcdTVFQTYnLCBsaW5rOiAnL2luZGV4L1x1NjU3MFx1NjM2RVx1NTMwNTItXHU2NTcwXHU2MzZFXHU3RUQzXHU2Nzg0LyNcdThGREJcdTVFQTYnIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1OTY0NFx1OUI1NCcsIGxpbms6ICcvaW5kZXgvXHU2NTcwXHU2MzZFXHU1MzA1Mi1cdTY1NzBcdTYzNkVcdTdFRDNcdTY3ODQvI1x1OTY0NFx1OUI1NCcgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU2ODA3XHU3QjdFJywgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUyLVx1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NC8jXHU2ODA3XHU3QjdFJyB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTkxNERcdTY1QjknLCBsaW5rOiAnL2luZGV4L1x1NjU3MFx1NjM2RVx1NTMwNTItXHU2NTcwXHU2MzZFXHU3RUQzXHU2Nzg0LyNcdTkxNERcdTY1QjknIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIHRleHQ6ICdcdTRFMTZcdTc1NENcdTc1MUZcdTYyMTAnLFxyXG4gICAgICAgICAgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUzLVx1NEUxNlx1NzU0Q1x1NzUxRlx1NjIxMCcsXHJcbiAgICAgICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgICB7IHRleHQ6ICdcdTdFRDNcdTY3ODQnLCBsaW5rOiAnL2luZGV4L1x1NjU3MFx1NjM2RVx1NTMwNTMtXHU0RTE2XHU3NTRDXHU3NTFGXHU2MjEwLyNcdTdFRDNcdTY3ODQnIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogJ1x1N0VGNFx1NUVBNlx1NTQ4Q1x1N0VGNFx1NUVBNlx1N0M3Qlx1NTc4QicsIGxpbms6ICcvaW5kZXgvXHU2NTcwXHU2MzZFXHU1MzA1My1cdTRFMTZcdTc1NENcdTc1MUZcdTYyMTAvI1x1N0VGNFx1NUVBNlx1NTQ4Q1x1N0VGNFx1NUVBNlx1N0M3Qlx1NTc4QicgfSxcclxuICAgICAgICAgICAgeyB0ZXh0OiAnXHU4MUVBXHU1QjlBXHU0RTQ5XHU0RTE2XHU3NTRDXHU3NTFGXHU2MjEwJywgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUzLVx1NEUxNlx1NzU0Q1x1NzUxRlx1NjIxMC8jXHU4MUVBXHU1QjlBXHU0RTQ5XHU0RTE2XHU3NTRDXHU3NTFGXHU2MjEwJyB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTY1NzBcdTYzNkVcdTUzMDVcdTVFMzhcdTc1MjhcdTYyODBcdTY3MkZcdTYwMjdcdTVCOUVcdTRGNTMnLCBsaW5rOiAnL2luZGV4L1x1NjU3MFx1NjM2RVx1NTMwNTQtXHU2MjgwXHU2NzJGXHU2MDI3XHU1QjlFXHU0RjUzJyB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICB7XHJcbiAgICAgIHRleHQ6ICdcdThENDRcdTZFOTBcdTUzMDVcdTRGNTNcdTdDRkJcdTdFRDNcdTY3ODQnLFxyXG4gICAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICAgIGxpbms6ICcvaW5kZXgvXHU4RDQ0XHU2RTkwXHU1MzA1XHU0RjUzXHU3Q0ZCXHU3RUQzXHU2Nzg0JyxcclxuICAgICAgaXRlbXM6IFtcclxuICAgICAgICB7IHRleHQ6ICdcdTZBMjFcdTU3OEInLCBsaW5rOiAnL2luZGV4L1x1OEQ0NFx1NkU5MFx1NTMwNVx1NEY1M1x1N0NGQlx1N0VEM1x1Njc4NC8jXHU2QTIxXHU1NzhCJyB9LFxyXG4gICAgICAgIHsgdGV4dDogJ1x1N0VCOVx1NzQwNicsIGxpbms6ICcvaW5kZXgvXHU4RDQ0XHU2RTkwXHU1MzA1XHU0RjUzXHU3Q0ZCXHU3RUQzXHU2Nzg0LyNcdTdFQjlcdTc0MDYnIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU1OEYwXHU5N0YzJywgbGluazogJy9pbmRleC9cdThENDRcdTZFOTBcdTUzMDVcdTRGNTNcdTdDRkJcdTdFRDNcdTY3ODQvI1x1NThGMFx1OTdGMycgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTVCNTdcdTRGNTMnLCBsaW5rOiAnL2luZGV4L1x1OEQ0NFx1NkU5MFx1NTMwNVx1NEY1M1x1N0NGQlx1N0VEM1x1Njc4NC8jXHU1QjU3XHU0RjUzJyB9LFxyXG4gICAgICAgIHsgdGV4dDogJ1x1Nzc0MFx1ODI3Mlx1NTY2OCcsIGxpbms6ICcvaW5kZXgvXHU4RDQ0XHU2RTkwXHU1MzA1XHU0RjUzXHU3Q0ZCXHU3RUQzXHU2Nzg0LyNcdTc3NDBcdTgyNzJcdTU2NjgnIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHsgdGV4dDogJ1x1NjI4MFx1NjcyRlx1NjAyN1x1NjZGNFx1NjVCMFx1NjVFNVx1NUZEN1x1RkYwOFx1N0NCRVx1N0I4MFx1NzI0OFx1RkYwOScsIGxpbms6ICcvaW5kZXgvY2hhbmdlbG9nX2JyZWFraW5nJyB9LFxyXG4gICAge1xyXG4gICAgICB0ZXh0OiAnXHU1MzlGXHU3MjQ4XHU2QTIxXHU3RUM0XHU1QjlFXHU4REY1JyxcclxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgaXRlbXM6IFtcclxuICAgICAgICB7IHRleHQ6ICdcdTY1NzBcdTYzNkVcdTUzMDVcdTVCOUVcdThERjUnLCBsaW5rOiAnL2luZGV4L1x1NjU3MFx1NjM2RVx1NTMwNVx1NUI5RVx1OERGNScgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdThENDRcdTZFOTBcdTUzMDVcdTVCOUVcdThERjUnLCBsaW5rOiAnL2luZGV4L1x1OEQ0NFx1NkU5MFx1NTMwNVx1NUI5RVx1OERGNScgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdThDMDNcdThCRDUnLCBsaW5rOiAnL2luZGV4L1x1OEMwM1x1OEJENVx1NEUwRVx1N0VGQ1x1NTQwOFx1NUI5RVx1NEY4QicgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTVGMDBcdTUzRDFcdTY3NDJcdThDMDgnLCBsaW5rOiAnL2luZGV4L1x1NUYwMFx1NTNEMVx1Njc0Mlx1OEMwOCcgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICB0ZXh0OiAnXHU1M0MyXHU4MDAzXHU0RTBFXHU1M0NCXHU5NEZFJyxcclxuICAgICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgICAgaXRlbXM6IFtcclxuICAgICAgICB7IHRleHQ6ICdcdTVERTVcdTUxNzcnLCBsaW5rOiAnL2luZGV4L1x1NURFNVx1NTE3NycgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTUzQzJcdTgwMDMnLCBsaW5rOiAnL2luZGV4L1x1NTNDMlx1ODAwMycgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTUzQ0JcdTYwQzVcdTk0RkVcdTYzQTUnLCBsaW5rOiAnL2luZGV4L1x1NTNDQlx1OTRGRScgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAge1xyXG4gICAgICB0ZXh0OiAnXHU5NjQ0XHU1RjU1JyxcclxuICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgICBpdGVtczogW1xyXG4gICAgICAgIHsgdGV4dDogJ1x1OTY0NFx1NUY1NTFcdUZGMUFcdTU5MjlcdThDNzlcdTY2MUZcdTk2RjJcdTY1NTlcdTdBMEJcdTU0MDhcdTk2QzYnLCBsaW5rOiAnL2luZGV4L1x1OTY0NFx1NUY1NTEnIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU5NjQ0XHU1RjU1Mlx1RkYxQUFsdW1vb3Blclx1NzY4NFx1Nzc0MFx1ODI3Mlx1NTY2OFx1NjU1OVx1N0EwQlx1NTQwOFx1OTZDNlx1MjAxNFx1MjAxNE1DSkVcdTc3NDBcdTgyNzJcdTU2NjhcdTY1NTlcdTdBMEJcdUZGMUFcdTRFQ0VcdTVGMDBcdTUzRDFcdTUxNjVcdTk1RThcdTUyMzBcdTZFMzhcdTYyMEZcdTVEMjlcdTZFODMnLCBsaW5rOiAnL2luZGV4L1x1OTY0NFx1NUY1NTInIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU5NjQ0XHU1RjU1M1x1RkYxQVx1NTczMFx1NTZGRVx1NTM5Rlx1OEQzNC9cdTg4NjVcdTY4NjNcdTU3MzBcdTU3NDAnLCBsaW5rOiAnL2luZGV4L1x1OTY0NFx1NUY1NTMnIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU5NjQ0XHU1RjU1NFx1RkYxQVx1Njc0Mlx1OTg3OScsIGxpbms6ICcvaW5kZXgvXHU5NjQ0XHU1RjU1NCcgfSxcclxuICAgICAgICB7IHRleHQ6ICdcdTk2NDRcdTVGNTU1XHVGRjFBXHUzMDBBXHU2MkZFXHU1QzE4XHUzMDBCXHU3Q0ZCXHU1MjE3XHU1MzlGXHU3MjQ4XHU2QTIxXHU3RUM0XHU1NkZFXHU2NTg3XHU2NTU5XHU3QTBCJywgbGluazogJy9pbmRleC9cdTk2NDRcdTVGNTU1JyB9LFxyXG4gICAgICAgIHsgdGV4dDogJ1x1OTY0NFx1NUY1NTZcdUZGMUFcdTU5MzFcdTY1NDhcdTdEMjJcdTVGMTVcdTk0RkVcdTYzQTVcdTY1NzRcdTc0MDYnLCBsaW5rOiAnL2luZGV4L1x1OTY0NFx1NUY1NTYnIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU2MjgwXHU2NzJGXHU2MDI3XHU2NkY0XHU2NUIwXHU2NUU1XHU1RkQ3JywgbGluazogJy9pbmRleC9jaGFuZ2Vsb2cnIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIHtcclxuICAgICAgdGV4dDogJ1x1NjcwRFx1NTJBMVx1NTNGMCcsXHJcbiAgICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU2QzM0XHU1NDI3XHVEODNDXHVERjc1JywgbGluazogJy9pbmRleC9cdTZDMzRcdTU0MjcnIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU1OTMxXHU3MjY5XHU2MkRCXHU5ODg2JywgbGluazogJy9pbmRleC9cdTU5MzFcdTcyNjlcdTYyREJcdTk4ODYnIH0sXHJcbiAgICAgICAgeyB0ZXh0OiAnXHU2NkY0XHU2NUIwXHU2NUU1XHU1RkQ3JywgbGluazogJy9pbmRleC9fdXBkYXRlJyB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICBdO1xyXG4iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkc6XFxcXHl3Y1xcXFxkYXRhcGFja19pbmRleFxcXFwudml0ZXByZXNzXFxcXGhpZ2hsaWdodHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkc6XFxcXHl3Y1xcXFxkYXRhcGFja19pbmRleFxcXFwudml0ZXByZXNzXFxcXGhpZ2hsaWdodHNcXFxcbWNmdW50aW9uLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9HOi95d2MvZGF0YXBhY2tfaW5kZXgvLnZpdGVwcmVzcy9oaWdobGlnaHRzL21jZnVudGlvbi50c1wiO2V4cG9ydCBjb25zdCBtY2Z1bmN0aW9uOiBhbnkgPSB7XHJcbiAgXCJkaXNwbGF5TmFtZVwiOiBcIlN5bnRheCBNY2Z1bmN0aW9uXCIsXHJcbiAgXCJuYW1lXCI6IFwibWNmdW5jdGlvblwiLFxyXG4gIFwic2NvcGVOYW1lXCI6IFwic291cmNlLm1jZnVuY3Rpb25cIixcclxuICBcInV1aWRcIjogXCI4OTE4ZGFkZC04ZWJlLTQyZDktYjFlOS0wNDg5YWIyMjhkOWRcIixcclxuICBcImZpbGVUeXBlc1wiOiBbXHJcbiAgICBcIm1jZnVuY3Rpb25cIixcclxuICAgIFwiYm9sdFwiXHJcbiAgXSxcclxuICBcInBhdHRlcm5zXCI6IFtcclxuICAgIHtcclxuICAgICAgXCJpbmNsdWRlXCI6IFwiI3Jvb3RcIlxyXG4gICAgfVxyXG4gIF0sXHJcbiAgXCJyZXBvc2l0b3J5XCI6IHtcclxuICAgIFwicm9vdFwiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNjb21tZW50c1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjbGl0ZXJhbHNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI3NheVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjbmFtZXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2NvbW1lbnRzX2lubGluZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjc3ViY29tbWFuZHNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI3Byb3BlcnR5XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNvcGVyYXRvcnNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI3NlbGVjdG9yc1wiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJjb21tZW50c1wiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiYXBwbHlFbmRQYXR0ZXJuTGFzdFwiOiAxLFxyXG4gICAgICAgICAgXCJiZWdpblwiOiBcIl5cXFxccyooI1s+ISNdKSguKykkXCIsXHJcbiAgICAgICAgICBcImJlZ2luQ2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjFcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnQuYmxvY2subWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiMlwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibWFya3VwLmJvbGQubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21tZW50LmJsb2NrLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJlbmRcIjogXCJeKD8hIylcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuY29tbWVudHNcIixcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2NvbW1lbnRzX2Jsb2NrXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudC5saW5lLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIl5cXFxccyojLiokXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmNvbW1lbnRzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnQubGluZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJeXFxcXHMqXFxcXC5cXFxcLlxcXFwuLiokXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmNvbW1lbnRzXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcImNvbW1lbnRzX2lubGluZVwiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnQubGluZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCIjLiokXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmNvbW1lbnRzXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcImNvbW1lbnRzX2Jsb2NrXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJhcHBseUVuZFBhdHRlcm5MYXN0XCI6IDEsXHJcbiAgICAgICAgICBcImJlZ2luXCI6IFwiXlxcXFxzKiNbPiFdXCIsXHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21tZW50LmJsb2NrLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJlbmRcIjogXCIkXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmNvbW1lbnRzX2Jsb2NrXCIsXHJcbiAgICAgICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNjb21tZW50c19ibG9ja19lbXBoYXNpemVkXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJhcHBseUVuZFBhdHRlcm5MYXN0XCI6IDEsXHJcbiAgICAgICAgICBcImJlZ2luXCI6IFwiXlxcXFxzKiNcIixcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnQuYmxvY2subWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcImVuZFwiOiBcIiRcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuY29tbWVudHNfYmxvY2tcIixcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2NvbW1lbnRzX2Jsb2NrX25vcm1hbFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcImNvbW1lbnRzX2Jsb2NrX2VtcGhhc2l6ZWRcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjY29tbWVudHNfYmxvY2tfc3BlY2lhbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJtYXJrdXAuYm9sZC5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcUytcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuY29tbWVudHNfYmxvY2tfZW1waGFzaXplZFwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJjb21tZW50c19ibG9ja19ub3JtYWxcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjY29tbWVudHNfYmxvY2tfc3BlY2lhbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21tZW50LmJsb2NrLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxTK1wiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5jb21tZW50c19ibG9ja19ub3JtYWxcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI3doaXRlc3BhY2VcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwiY29tbWVudHNfYmxvY2tfc3BlY2lhbFwiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1hcmt1cC5oZWFkaW5nLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIkBcXFxcUytcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuY29tbWVudHNfYmxvY2tfc3BlY2lhbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjcmVzb3VyY2UtbmFtZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2YXJpYWJsZS5vdGhlci5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJbIyUkXVtBLVphLXowLTlfLiMlJF0rXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmNvbW1lbnRzX2Jsb2NrX3NwZWNpYWxcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwibGl0ZXJhbHNcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5udW1lcmljLmJvb2xlYW4ubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXGIodHJ1ZXxmYWxzZXxUcnVlfEZhbHNlKVxcXFxiXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmxpdGVyYWxzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInZhcmlhYmxlLnV1aWQubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXGJbMC05YS1mQS1GXSsoPzotWzAtOWEtZkEtRl0rKXs0fVxcXFxiXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLm5hbWVzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbnN0YW50Lm51bWVyaWMuZmxvYXQubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiWystXT9cXFxcZCpcXFxcLj9cXFxcZCsoW2VFXT9bKy1dP1xcXFxkKyk/W2RmXT9cXFxcYlwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5saXRlcmFsc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5udW1lcmljLmludGVnZXIubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiWystXT9cXFxcZCsoYnxCfEx8bHxzfFMpP1xcXFxiXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmxpdGVyYWxzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInZhcmlhYmxlLm90aGVyLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFwuXFxcXC5cIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuZWxsaXBzZS5saXRlcmFsc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImFwcGx5RW5kUGF0dGVybkxhc3RcIjogMSxcclxuICAgICAgICAgIFwiYmVnaW5cIjogXCJcXFwiXCIsXHJcbiAgICAgICAgICBcImJlZ2luQ2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmJlZ2luLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJlbmRcIjogXCJcXFwiXCIsXHJcbiAgICAgICAgICBcImVuZENhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5lbmQubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJzdHJpbmcucXVvdGVkLmRvdWJsZS5tY2Z1bmN0aW9uXCIsXHJcbiAgICAgICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNsaXRlcmFsc19zdHJpbmctZG91YmxlXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJhcHBseUVuZFBhdHRlcm5MYXN0XCI6IDEsXHJcbiAgICAgICAgICBcImJlZ2luXCI6IFwiJ1wiLFxyXG4gICAgICAgICAgXCJiZWdpbkNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5iZWdpbi5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwiZW5kXCI6IFwiJ1wiLFxyXG4gICAgICAgICAgXCJlbmRDYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuYmVnaW4ubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJzdHJpbmcucXVvdGVkLnNpbmdsZS5tY2Z1bmN0aW9uXCIsXHJcbiAgICAgICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNsaXRlcmFsc19zdHJpbmctc2luZ2xlXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwic3ViY29tbWFuZHNcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlbnRpdHkubmFtZS5jbGFzcy5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJbYS16X10rXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmxpdGVyYWxzXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcImxpdGVyYWxzX3N0cmluZy1kb3VibGVcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5jaGFyYWN0ZXIuZXNjYXBlLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxcXFxcLlwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5saXRlcmFsc19zdHJpbmctZG91YmxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbnN0YW50LmNoYXJhY3Rlci5lc2NhcGUubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXFxcXFxcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubGl0ZXJhbHNfc3RyaW5nLWRvdWJsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjbWFjcm8tbmFtZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdHJpbmcucXVvdGVkLmRvdWJsZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJbXlxcXFxcXFxcXFxcIl1cIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubGl0ZXJhbHNfc3RyaW5nLWRvdWJsZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJsaXRlcmFsc19zdHJpbmctc2luZ2xlXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29uc3RhbnQuY2hhcmFjdGVyLmVzY2FwZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcXFxcXC5cIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubGl0ZXJhbHNfc3RyaW5nLXNpbmdsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5jaGFyYWN0ZXIuZXNjYXBlLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxcXFxcXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmxpdGVyYWxzX3N0cmluZy1kb3VibGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI21hY3JvLW5hbWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RyaW5nLnF1b3RlZC5zaW5nbGUubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiW15cXFxcXFxcXCddXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmxpdGVyYWxzX3N0cmluZy1zaW5nbGVcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwic2F5XCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJiZWdpblwiOiBcIl4oXFxcXHMqKShzYXkpXCIsXHJcbiAgICAgICAgICBcImJlZ2luQ2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjFcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIndoaXRlc3BhY2UubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiMlwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwia2V5d29yZC5jb250cm9sLmZsb3cubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcImVuZFwiOiBcIlxcXFxuXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLnNheS5tY2Z1bmN0aW9uXCIsXHJcbiAgICAgICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29uc3RhbnQuY2hhcmFjdGVyLmVzY2FwZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcXFxcXFxcXFxzKlxcXFxuXCIsXHJcbiAgICAgICAgICAgICAgXCJtZXRhXCI6IFwibWV0YS5zYXkuYmFja3NsYXNoLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2xpdGVyYWxzX3N0cmluZy1kb3VibGVcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2xpdGVyYWxzX3N0cmluZy1zaW5nbGVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImJlZ2luXCI6IFwiKHJ1bikoXFxcXHMrKShzYXkpXCIsXHJcbiAgICAgICAgICBcImJlZ2luQ2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjFcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImVudGl0eS5uYW1lLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIjJcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIndoaXRlc3BhY2UubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiM1wiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwia2V5d29yZC5jb250cm9sLmZsb3cubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcImVuZFwiOiBcIlxcXFxuXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLnNheS5tY2Z1bmN0aW9uXCIsXHJcbiAgICAgICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29uc3RhbnQuY2hhcmFjdGVyLmVzY2FwZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcXFxcXFxcXFxzKlxcXFxuXCIsXHJcbiAgICAgICAgICAgICAgXCJtZXRhXCI6IFwibWV0YS5zYXkuYmFja3NsYXNoLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2xpdGVyYWxzX3N0cmluZy1kb3VibGVcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2xpdGVyYWxzX3N0cmluZy1zaW5nbGVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJuYW1lc1wiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjFcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIndoaXRlc3BhY2UubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiMlwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwia2V5d29yZC5jb250cm9sLmZsb3cubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXihcXFxccyopKFthLXpfXSspKD89XFxcXHMpXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLm5hbWVzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjFcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIndoaXRlc3BhY2UubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiMlwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibWFya3VwLml0YWxpYy5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCIzXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ3aGl0ZXNwYWNlLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIjRcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImtleXdvcmQuY29udHJvbC5mbG93Lm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIl4oXFxcXHMqKShcXFxcJCkoID8pKFthLXpfXSopXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLm5hbWVzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjFcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImVudGl0eS5uYW1lLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIjJcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIndoaXRlc3BhY2UubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiM1wiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwia2V5d29yZC5jb250cm9sLmZsb3cubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiKHJ1bikoXFxcXHMrKShbYS16X10rKVwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5uYW1lc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjcmVzb3VyY2UtbmFtZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlbnRpdHkubmFtZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJbQS1aYS16XSsoPz1cXFxcVylcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubmFtZXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RyaW5nLnVucXVvdGVkLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIltBLVphLXpfXVtBLVphLXowLTlfLiMlJF0qXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLm5hbWVzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNtYWNyby1uYW1lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInZhcmlhYmxlLm90aGVyLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIihbIyUkXXwoKD88PVxcXFxzKVxcXFwuKSlbQS1aYS16MC05Xy4jJSRcXFxcLV0rXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLm5hbWVzXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcIm1hY3JvLW5hbWVcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIxXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRlbXBsYXRlLWV4cHJlc3Npb24uYmVnaW4ubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiMlwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmFyaWFibGUub3RoZXIubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiM1wiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi50ZW1wbGF0ZS1leHByZXNzaW9uLmVuZC5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCIoXFxcXCRcXFxcKCkoW0EtWmEtejAtOV9dKikoXFxcXCkpXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLm1hY3JvLW5hbWVcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwib3BlcmF0b3JzXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29uc3RhbnQubnVtZXJpYy5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJbfl5dXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLm9wZXJhdG9yc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJrZXl3b3JkLm9wZXJhdG9yLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIltcXFxcLSU/ISsqPD5cXFxcXFxcXC98Jj0uOiw7XVwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5vcGVyYXRvcnNcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwicHJvcGVydHlcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImFwcGx5RW5kUGF0dGVybkxhc3RcIjogMSxcclxuICAgICAgICAgIFwiYmVnaW5cIjogXCJcXFxce1wiLFxyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicHVuY3R1YXRpb24ubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcImVuZFwiOiBcIlxcXFx9XCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLnByb3BlcnR5LmN1cmx5XCIsXHJcbiAgICAgICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNyZXNvdXJjZS1uYW1lXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNsaXRlcmFsc1wiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjcHJvcGVydHlfa2V5XCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNvcGVyYXRvcnNcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI3Byb3BlcnR5X3ZhbHVlXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiRzZWxmXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJhcHBseUVuZFBhdHRlcm5MYXN0XCI6IDEsXHJcbiAgICAgICAgICBcImJlZ2luXCI6IFwiXFxcXFtcIixcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInZhcmlhYmxlLm90aGVyLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJlbmRcIjogXCJcXFxcXVwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5wcm9wZXJ0eS5zcXVhcmVcIixcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI3Jlc291cmNlLW5hbWVcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2xpdGVyYWxzXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNwcm9wZXJ0eV9rZXlcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI29wZXJhdG9yc1wiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjcHJvcGVydHlfdmFsdWVcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiJHNlbGZcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImFwcGx5RW5kUGF0dGVybkxhc3RcIjogMSxcclxuICAgICAgICAgIFwiYmVnaW5cIjogXCJcXFxcKFwiLFxyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicHVuY3R1YXRpb24ubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcImVuZFwiOiBcIlxcXFwpXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLnByb3BlcnR5LnBhcmVuXCIsXHJcbiAgICAgICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNyZXNvdXJjZS1uYW1lXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNsaXRlcmFsc1wiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjcHJvcGVydHlfa2V5XCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNvcGVyYXRvcnNcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI3Byb3BlcnR5X3ZhbHVlXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiRzZWxmXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwicHJvcGVydHlfa2V5XCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmFyaWFibGUub3RoZXIubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiIz9bYS16X11bYS16X1xcXFwuXFxcXC1dKlxcXFw6W2EtejAtOV9cXFxcLlxcXFwtL10rKD89XFxcXHMqXFxcXD06KVwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5wcm9wZXJ0eV9rZXlcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmFyaWFibGUub3RoZXIubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiIz9bYS16X11bYS16MC05X1xcXFwuXFxcXC0vXStcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEucHJvcGVydHlfa2V5XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInZhcmlhYmxlLm90aGVyLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIltBLVphLXpfXStbQS1aYS16X1xcXFwtXFxcXCtdKlwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5wcm9wZXJ0eV9rZXlcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwicHJvcGVydHlfdmFsdWVcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdHJpbmcudW5xdW90ZWQubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiIz9bYS16X11bYS16X1xcXFwuXFxcXC1dKlxcXFw6W2EtejAtOV9cXFxcLlxcXFwtL10rXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLnByb3BlcnR5X3ZhbHVlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInN0cmluZy51bnF1b3RlZC5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCIjP1thLXpfXVthLXowLTlfXFxcXC5cXFxcLS9dK1wiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5wcm9wZXJ0eV92YWx1ZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJyZXNvdXJjZS1uYW1lXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW50aXR5Lm5hbWUuZnVuY3Rpb24ubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiIz9bYS16X11bYS16MC05Xy4tXSo6W2EtejAtOV8uLy1dK1wiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5yZXNvdXJjZS1uYW1lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImVudGl0eS5uYW1lLmZ1bmN0aW9uLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIiM/W2EtejAtOV9cXFxcLlxcXFwtXStcXFxcL1thLXowLTlfXFxcXC5cXFxcLVxcXFwvXStcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEucmVzb3VyY2UtbmFtZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJzZWxlY3RvcnNcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdXBwb3J0LmNsYXNzLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIkBbYS16XStcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuc2VsZWN0b3JzXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICB9XHJcbn1cclxuXHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRzpcXFxceXdjXFxcXGRhdGFwYWNrX2luZGV4XFxcXC52aXRlcHJlc3NcXFxcaGlnaGxpZ2h0c1xcXFxtY2RvY1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRzpcXFxceXdjXFxcXGRhdGFwYWNrX2luZGV4XFxcXC52aXRlcHJlc3NcXFxcaGlnaGxpZ2h0c1xcXFxtY2RvY1xcXFxtY2RvYy50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRzoveXdjL2RhdGFwYWNrX2luZGV4Ly52aXRlcHJlc3MvaGlnaGxpZ2h0cy9tY2RvYy9tY2RvYy50c1wiO2V4cG9ydCBjb25zdCBtY2RvYzogYW55ID0ge1xyXG4gIFwibmFtZVwiOiBcIm1jZG9jXCIsXHJcbiAgXCJkaXNwbGF5TmFtZVwiOiBcIlN5bnRheCBNY2RvY1wiLFxyXG4gIFwic2NvcGVOYW1lXCI6IFwic291cmNlLm1jZG9jXCIsXHJcbiAgXCJ1dWlkXCI6IFwiMDQ3ZDQxMTAtMjVlNC00NzEzLTgwMzYtMjI2MzVjY2U0ZTg0XCIsXHJcbiAgXCJmaWxlVHlwZXNcIjogW1xyXG4gICAgXCJtY2RvY1wiXHJcbiAgXSxcclxuICBcInBhdHRlcm5zXCI6IFtcclxuICAgIHtcclxuICAgICAgXCJpbmNsdWRlXCI6IFwiI3Jvb3RcIlxyXG4gICAgfVxyXG4gIF0sXHJcbiAgXCJyZXBvc2l0b3J5XCI6IHtcclxuICAgIFwicm9vdFwiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibmFtZVwiOiBcImtleXdvcmQuY29udHJvbC5tY2RvY1wiLFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxiKHVzZXx0eXBlfHN0cnVjdHxlbnVtKVxcXFxiXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibmFtZVwiOiBcInN0b3JhZ2UubW9kaWZpZXIubWNkb2NcIixcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcYihkaXNwYXRjaHxpbmplY3R8dG98ZXh0ZW5kcylcXFxcYlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJlbnRpdHkubmFtZS50eXBlLm1jZG9jXCIsXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXGIoYW55fGJvb2xlYW58c3RyaW5nfGJ5dGV8c2hvcnR8aW50fGxvbmd8ZmxvYXR8ZG91YmxlKVxcXFxiXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnQubGluZS5tY2RvY1wiLFxyXG4gICAgICAgICAgXCJiZWdpblwiOiBcIi8vXCIsXHJcbiAgICAgICAgICBcImVuZFwiOiBcIlxcblwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5udW1lcmljLm1jZG9jXCIsXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXGJbMC05XStcXFxcYlwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJzdHJpbmcucXVvdGVkLm1jZG9jXCIsXHJcbiAgICAgICAgICBcImJlZ2luXCI6IFwiXFxcIlwiLFxyXG4gICAgICAgICAgXCJlbmRcIjogXCJcXFwiXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiYmVnaW5cIjogXCIoIylcXFxcW1wiLFxyXG4gICAgICAgICAgXCJlbmRcIjogXCJcXFxcXVwiLFxyXG4gICAgICAgICAgXCJiZWdpbkNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIxXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLnByZXByb2Nlc3Nvci5tY2RvY1wiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImVudGl0eS5uYW1lLmZ1bmN0aW9uLm1jZG9jXCIsXHJcbiAgICAgICAgICAgICAgXCJtYXRjaFwiOiBcIig/PD1cXFxcWylbQS1aYS16MC05X10rKD89Wz17KFxcXFxdXSlcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW50aXR5Lm5hbWUudHlwZS5tY2RvY1wiLFxyXG4gICAgICAgICAgICAgIFwibWF0Y2hcIjogXCJbQS1aXVtBLVphLXowLTlfXSpcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RyaW5nLnF1b3RlZC5tY2RvY1wiLFxyXG4gICAgICAgICAgICAgIFwiYmVnaW5cIjogXCJcXFwiXCIsXHJcbiAgICAgICAgICAgICAgXCJlbmRcIjogXCJcXFwiXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJiZWdpblwiOiBcIihbYS16MC05Xy4tXSs6W2EtejAtOV8uLV0rKVxcXFxbXCIsXHJcbiAgICAgICAgICBcImVuZFwiOiBcIlxcXFxdXCIsXHJcbiAgICAgICAgICBcImJlZ2luQ2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjFcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImVudGl0eS5uYW1lLmZ1bmN0aW9uLm1jZG9jXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmFyaWFibGUucGFyYW1ldGVyLm1jZG9jXCIsXHJcbiAgICAgICAgICAgICAgXCJtYXRjaFwiOiBcIlthLXowLTlfLi1dKzpbYS16MC05Xy4tXStcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJlbnRpdHkubmFtZS5mdW5jdGlvbi5tY2RvY1wiLFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxiW2EtejAtOV8uLV0rOlthLXowLTlfLi1dK1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJ2YXJpYWJsZS5tY2RvY1wiLFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIig/PCF0eXBlXFxcXHMrKVxcXFxiW0EtWmEtel9dW0EtWmEtejAtOV9dKiAqKD89KFxcXFw/Onw6KD8hOil8PSkgKilcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJuYW1lXCI6IFwidmFyaWFibGUubWNkb2NcIixcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCIoPzw9XFxcXFspW0EtWmEtejAtOV9dKyg/PVxcXFxbKVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJlbnRpdHkubmFtZS50eXBlLm1jZG9jXCIsXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiKDo6KT9bQS1aYS16X10oOjp8W0EtWmEtejAtOV9dKSpcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIH1cclxufTsiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkc6XFxcXHl3Y1xcXFxkYXRhcGFja19pbmRleFxcXFwudml0ZXByZXNzXFxcXGhpZ2hsaWdodHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkc6XFxcXHl3Y1xcXFxkYXRhcGFja19pbmRleFxcXFwudml0ZXByZXNzXFxcXGhpZ2hsaWdodHNcXFxcc25idC50c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRzoveXdjL2RhdGFwYWNrX2luZGV4Ly52aXRlcHJlc3MvaGlnaGxpZ2h0cy9zbmJ0LnRzXCI7ZXhwb3J0IGNvbnN0IHNuYnQ6IGFueSA9IHtcclxuICBcImRpc3BsYXlOYW1lXCI6IFwiU05CVFwiLFxyXG4gIFwibmFtZVwiOiBcInNuYnRcIixcclxuICBcInNjb3BlTmFtZVwiOiBcInNvdXJjZS5zbmJ0XCIsXHJcbiAgXCJ1dWlkXCI6IFwiNWQ2YmI4ZGEtYzk2Yy00Yzg4LWEzZTctZjE5OTc1MjQwMTIzXCIsXHJcbiAgXCJmaWxlVHlwZXNcIjogW1xyXG4gICAgXCJzbmJ0XCIsXHJcbiAgICBcIm5idFwiXHJcbiAgXSxcclxuICBcInBhdHRlcm5zXCI6IFtcclxuICAgIHsgXCJpbmNsdWRlXCI6IFwiI3Jvb3RcIiB9XHJcbiAgXSxcclxuICBcInJlcG9zaXRvcnlcIjoge1xyXG4gICAgXCJyb290XCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAgeyBcImluY2x1ZGVcIjogXCIjYnJhY2tldHNcIiB9LFxyXG4gICAgICAgIHsgXCJpbmNsdWRlXCI6IFwiI3N0cmluZ3NcIiB9LFxyXG4gICAgICAgIHsgXCJpbmNsdWRlXCI6IFwiI251bWJlcnNcIiB9LFxyXG4gICAgICAgIHsgXCJpbmNsdWRlXCI6IFwiI2Jvb2xlYW5zXCIgfSxcclxuICAgICAgICB7IFwiaW5jbHVkZVwiOiBcIiNudWxsc1wiIH0sXHJcbiAgICAgICAgeyBcImluY2x1ZGVcIjogXCIjY29tbWFzLWNvbG9uc1wiIH0sXHJcbiAgICAgICAgeyBcImluY2x1ZGVcIjogXCIjdXVpZFwiIH0sXHJcbiAgICAgICAgeyBcImluY2x1ZGVcIjogXCIja2V5c1wiIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwic3RyaW5nc1wiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiYmVnaW5cIjogXCJcXFwiXCIsXHJcbiAgICAgICAgICBcImJlZ2luQ2FwdHVyZXNcIjogeyBcIjBcIjogeyBcIm5hbWVcIjogXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5iZWdpbi5zbmJ0XCIgfSB9LFxyXG4gICAgICAgICAgXCJlbmRcIjogXCJcXFwiXCIsXHJcbiAgICAgICAgICBcImVuZENhcHR1cmVzXCI6IHsgXCIwXCI6IHsgXCJuYW1lXCI6IFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuZW5kLnNuYnRcIiB9IH0sXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJzdHJpbmcucXVvdGVkLmRvdWJsZS5zbmJ0XCIsXHJcbiAgICAgICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcXFxcXC5cIixcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5jaGFyYWN0ZXIuZXNjYXBlLnNuYnRcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiJ1teJ10qJ1wiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwic3RyaW5nLnF1b3RlZC5zaW5nbGUuc25idFwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJudW1iZXJzXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxiWystXT9cXFxcZCsoXFxcXC5cXFxcZCspPyhbZUVdWystXT9cXFxcZCspP1tmRmREXT9cXFxcYlwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5zbmJ0XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcYlsrLV0/XFxcXGQrW2JCc1NsTF0/XFxcXGJcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5zbmJ0XCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcImJvb2xlYW5zXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxiKHRydWV8ZmFsc2UpXFxcXGJcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcImNvbnN0YW50Lmxhbmd1YWdlLmJvb2xlYW4uc25idFwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJudWxsc1wiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcYihudWxsfE5hTnxJbmZpbml0eSlcXFxcYlwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwiY29uc3RhbnQubGFuZ3VhZ2UubnVsbC5zbmJ0XCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcImNvbW1hcy1jb2xvbnNcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7IFwibWF0Y2hcIjogXCJbOixdXCIsIFwibmFtZVwiOiBcInB1bmN0dWF0aW9uLnNlcGFyYXRvci5zbmJ0XCIgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJicmFja2V0c1wiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHsgXCJtYXRjaFwiOiBcIltcXFxce1xcXFx9XVwiLCBcIm5hbWVcIjogXCJwdW5jdHVhdGlvbi5zZWN0aW9uLmJsb2NrLmJyYWNlcy5zbmJ0XCIgfSxcclxuICAgICAgICB7IFwibWF0Y2hcIjogXCJbXFxcXFtcXFxcXV1cIiwgXCJuYW1lXCI6IFwicHVuY3R1YXRpb24uc2VjdGlvbi5ibG9jay5icmFja2V0cy5zbmJ0XCIgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJrZXlzXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIig/PD1cXFxce3wsfFxcXFxbKVxcXFxzKltBLVphLXpfXVtBLVphLXowLTlfXSpcXFxccyooPz1cXFxcOilcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcInZhcmlhYmxlLm90aGVyLmtleS5zbmJ0XCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcInV1aWRcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXGJbMC05YS1mQS1GXXs4fVxcXFwtWzAtOWEtZkEtRl17NH1cXFxcLVswLTlhLWZBLUZdezR9XFxcXC1bMC05YS1mQS1GXXs0fVxcXFwtWzAtOWEtZkEtRl17MTJ9XFxcXGJcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcImNvbnN0YW50Lm90aGVyLnV1aWQuc25idFwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgfVxyXG59IiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJHOlxcXFx5d2NcXFxcZGF0YXBhY2tfaW5kZXhcXFxcLnZpdGVwcmVzc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRzpcXFxceXdjXFxcXGRhdGFwYWNrX2luZGV4XFxcXC52aXRlcHJlc3NcXFxcc2lkZWJhcl9mZWF0dXJlLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9HOi95d2MvZGF0YXBhY2tfaW5kZXgvLnZpdGVwcmVzcy9zaWRlYmFyX2ZlYXR1cmUudHNcIjtpbXBvcnQgeyBEZWZhdWx0VGhlbWUgfSBmcm9tIFwidml0ZXByZXNzXCI7XHJcbmV4cG9ydCBjb25zdCBzaWRlYmFyX2ZlYXR1cmU6IERlZmF1bHRUaGVtZS5TaWRlYmFyID0gW1xyXG4gIHtcclxuICAgIHRleHQ6ICdcdTY3MDhcdTUyMEFcdTMwMEFGZWF0dXJlXHUzMDBCJyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1N0VERFx1OEQ1RVx1NUY4MVx1N0EzRlx1NEUyRFx1RkYwMScsIGxpbms6ICcvZmVhdHVyZS9fXHU4OUM0XHU1MjE5JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1RDgzQ1x1REYxRjIwMjUuNVx1NjcwOFx1NTIwQScsXHJcbiAgICBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA1J1xyXG4gIH0sXHJcbiAgICB7XHJcbiAgICB0ZXh0OiAnMjAyNS40XHU2NzA4XHU1MjBBJyxcclxuICAgIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDQnXHJcbiAgfSxcclxuICB7XHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTY3MDhcdTUyMEFcdTY3NjFcdTZCM0UnLCBsaW5rOiAnL2ZlYXR1cmUvX1x1Njc2MVx1NkIzRScgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU4RkQ0XHU1NkRFXHU0RTNCXHU3QUQ5JywgbGluazogJy9pbmRleC9cdTdFRUFcdThCQkEnIH1cclxuICAgIF1cclxuICB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNpZGViYXJfMjAyNTA0OiBEZWZhdWx0VGhlbWUuU2lkZWJhciA9IFtcclxuICB7XHJcbiAgICB0ZXh0OiAnRmVhdHVyZSAyMDI1LjA0JyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1NzZFRVx1NUY1NScsIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NTIxQlx1NTIwQVx1NUJDNFx1OEJFRCcsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNC9wcmVmYWNlJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTRFMEJcdTRFMDBcdTUyMEEnLCBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA1JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NUMwMVx1OTc2Mlx1NjU4N1x1N0FFMCcsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTUzOUZcdTcyNDhcdTVCQjZcdTUxNzdcdTc2ODRcdTIwMUNcdTdFQzhcdTY3ODFcdTdCNTRcdTY4NDhcdTIwMURcdUZGMUZcdTIwMTRcdTIwMTRcdTY1QjBcdTRFMDBcdTRFRTNcdTVCQjZcdTUxNzdcdTY4NDZcdTY3QjZcdTMwMEFcdTY3N0VcdTY3OUNcdTY4MzhcdTMwMEInLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvMC9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NTE4NVx1NUJCOVx1N0QyMlx1NUYxNScsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTY1NzBcdTYzNkVcdTUzMDVcdTVGRUJcdTkwMUZcdTUxNjVcdTk1RTgnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvMS9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTU5ODJcdTRGNTVcdTU0MDhcdTVFNzZcdTU5MUFcdTRFMkFcdTcyNDhcdTY3MkNcdTc2ODRcdTY1NzBcdTYzNkVcdTUzMDVcdUZGMUYnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvMi9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY1NzBcdTYzNkVcdTUzMDVcdTRGMThcdTUzMTZcdTUzOUZcdTUyMTlcdTRFRTVcdTUzQ0FcdTUyMDZcdTY3OTBcdTY1QjlcdTVGMEZcdTdCODBcdThGRjAnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvMy9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdOZUtvQ3VzdG9tU3Bhd24tZGVtbycsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNC80L2NvbnRlbnQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ0phdmFcdTcyNDgxLjIxLjUtU05CVFx1OEJFRFx1NkNENVx1Njk4Mlx1ODlDOCcsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNC81L2NvbnRlbnQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjJGRVx1NUMxOFx1RkYwOFx1NEUwM1x1RkYwOS1cdTRGN0ZcdTc1MjhcdTU5MERcdTU0MDhcdTcyNjlcdTU0QzFcdTZBMjFcdTU3OEJcdTY2MjBcdTVDMDRcdTY2RjRcdTdCODBcdTRGQkZcdTc2ODRcdTUyMzZcdTRGNUNcdTcyQjZcdTYwMDFcdTY4MEYnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvNi9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY4MzlcdTYzNkVcdTczQTlcdTVCQjZcdThCQjBcdTUyMDZcdTY3N0ZcdTUyMDZcdTY1NzBcdThGREJcdTg4NENcdTYzOTJcdTU0MEQnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvNy9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHUzMDBBRmVhdHVyZXNcdTMwMEJcdTRFM0JcdTk4NzUnLCBsaW5rOiAnL2ZlYXR1cmUvX1x1ODlDNFx1NTIxOScgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU2NzA4XHU1MjBBXHU2NzYxXHU2QjNFJywgbGluazogJy9mZWF0dXJlL19cdTY3NjFcdTZCM0UnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1OEZENFx1NTZERVx1NEUzQlx1N0FEOScsIGxpbms6ICcvaW5kZXgvXHU3RUVBXHU4QkJBJyB9XHJcbiAgICBdXHJcbiAgfVxyXG5dO1xyXG5cclxuXHJcbmV4cG9ydCBjb25zdCBzaWRlYmFyXzIwMjUwNTogRGVmYXVsdFRoZW1lLlNpZGViYXIgPSBbXHJcbiAge1xyXG4gICAgdGV4dDogJ0ZlYXR1cmUgMjAyNS4wNScsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTc2RUVcdTVGNTUnLCBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA1JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTRFMEFcdTRFMDBcdTUyMEEnLCBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA0JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NUMwMVx1OTc2Mlx1NjU4N1x1N0FFMCcsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTcwREZcdTgyQjFcdTY3NjVcdTU0QUZcdUZGMDEnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDUvMS9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1MDM5Qm9qYW5nIFNwb3RsaWdodCcsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTk5OTlcdTgzNDlcdTVGRUJcdThCQUYgLSAyMDI1XHU1RTc0NVx1NjcwOCcsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNS9zcG90bGlnaHQvY29udGVudCcgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTUxODVcdTVCQjlcdTdEMjJcdTVGMTUnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU1QkY5XHU1QzU1XHU3OTNBXHU1QjlFXHU0RjUzXHU2RTMyXHU2N0QzXHU1M0Q4XHU2MzYyXHU3Njg0XHU3ODE0XHU3QTc2JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA1LzIvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnU3B5Z2xhc3MoXHU1OTI3XHU2MUE4XHU2Mjc5KVx1OEZEQlx1OTYzNlx1NEY3Rlx1NzUyOFx1OEJGNFx1NjYwRScsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNS8zL2NvbnRlbnQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjU3MFx1NjM2RVx1NTMwNVx1NTQ4Q1x1NTQ3RFx1NEVFNFx1NTE2NVx1OTVFOFx1NUI2Nlx1NEU2MC1cdTUyMURcdTVCNjZcdTgwMDVcdTU5ODJcdTRGNTVcdTVGRUJcdTkwMUZcdTkwMDJcdTVFOTQnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDUvNC9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTUzOUZcdTcyNDhcdTg4NDBcdTY3NjFcdUZGMDEnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDUvNS9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdEaWdnaW5nIFVuZGVyZ3JvdW5kJywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA1LzYvY29udGVudCcgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1MzAwQUZlYXR1cmVzXHUzMDBCXHU0RTNCXHU5ODc1JywgbGluazogJy9mZWF0dXJlL19cdTg5QzRcdTUyMTknIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjcwOFx1NTIwQVx1Njc2MVx1NkIzRScsIGxpbms6ICcvZmVhdHVyZS9fXHU2NzYxXHU2QjNFJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdThGRDRcdTU2REVcdTRFM0JcdTdBRDknLCBsaW5rOiAnL2luZGV4L1x1N0VFQVx1OEJCQScgfVxyXG4gICAgXVxyXG4gIH1cclxuXTtcclxuIl0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUixTQUFTLG9CQUFvQjs7O0FDQ3hTLElBQU0sVUFBZ0M7QUFBQSxFQUN6QztBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sV0FBVztBQUFBLElBQ1gsT0FBTztBQUFBLE1BQ0wsRUFBRSxNQUFNLGdCQUFNLE1BQU0sc0JBQVk7QUFB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QUFBLFlBQ2I7QUFBQSxZQUNBO0FBQUEsY0FDRSxXQUFXO0FBQUEsWUFDYjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFlBQVk7QUFBQSxRQUNWO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0EsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsVUFDQSxTQUFTO0FBQUEsVUFDVCxRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFlBQVk7QUFBQSxZQUNWLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQSxLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0EsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0EsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxXQUFXO0FBQUEsUUFDYjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFlBQVk7QUFBQSxZQUNWLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0UsV0FBVztBQUFBLFFBQ2I7QUFBQSxRQUNBO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFlBQVk7QUFBQSxRQUNWO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0EsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsYUFBYTtBQUFBLE1BQ1gsWUFBWTtBQUFBLFFBQ1Y7QUFBQSxVQUNFLFlBQVk7QUFBQSxZQUNWLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFlBQVk7QUFBQSxNQUNWLFlBQVk7QUFBQSxRQUNWO0FBQUEsVUFDRSx1QkFBdUI7QUFBQSxVQUN2QixTQUFTO0FBQUEsVUFDVCxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFB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WUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0UsWUFBWTtBQUFBLFlBQ1YsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsVUFDQSxTQUFTO0FBQUEsVUFDVCxRQUFRO0FBQUEsUUFDVjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxhQUFhO0FBQUEsTUFDWCxZQUFZO0FBQUEsUUFDVjtBQUFBLFVBQ0UsWUFBWTtBQUFBLFlBQ1YsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsVUFDQSxTQUFTO0FBQUEsVUFDVCxRQUFRO0FBQUEsUUFDVjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsRUFDRjtBQUNGOzs7QUM3dUI0VSxJQUFNLFFBQWE7QUFBQSxFQUM3VixRQUFRO0FBQUEsRUFDUixlQUFlO0FBQUEsRUFDZixhQUFhO0FBQUEsRUFDYixRQUFRO0FBQUEsRUFDUixhQUFhO0FBQUEsSUFDWDtBQUFBLEVBQ0Y7QUFBQSxFQUNBLFlBQVk7QUFBQSxJQUNWO0FBQUEsTUFDRSxXQUFXO0FBQUEsSUFDYjtBQUFBLEVBQ0Y7QUFBQSxFQUNBLGNBQWM7QUFBQSxJQUNaLFFBQVE7QUFBQSxNQUNOLFlBQVk7QUFBQSxRQUNWO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixTQUFTO0FBQUEsUUFDWDtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLFNBQVM7QUFBQSxRQUNYO0FBQUEsUUFDQTtBQUFBLFVBQ0UsUUFBUTtBQUFBLFVBQ1IsU0FBUztBQUFBLFFBQ1g7QUFBQSxRQUNBO0FBQUEsVUFDRSxRQUFRO0FBQUEsVUFDUixTQUFTO0FBQUEsVUFDVCxPQUFPO0FBQUEsUUFDVDtBQUFBLFFBQ0E7QUFBQSxVQUNFLFFBQVE7QUFBQSxVQUNSLFNBQVM7QUFBQSxRQUNYO0FBQUEsUUFDQTtBQUFB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
