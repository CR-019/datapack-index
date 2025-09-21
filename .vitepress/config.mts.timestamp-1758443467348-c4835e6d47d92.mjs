// .vitepress/config.mts
import { defineConfig } from "file:///F:/ywc/datapack_index/node_modules/.pnpm/vitepress@1.6.3_@algolia+cl_19c8fbd1e218e73a186095a69577b89c/node_modules/vitepress/dist/node/index.js";

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
      { text: "\u{1F3E0}\u7EDD\u8D5E\u5F81\u7A3F\u4E2D\uFF01", link: "/feature/_index" },
      { text: "\u{1F31F}2025.09\u671F", link: "/feature/index/202509" },
      {
        text: "",
        items: [
          { text: "2025.08\u671F", link: "/feature/index/202508" },
          { text: "2025.07\u671F", link: "/feature/index/202507" }
        ]
      },
      {
        text: "\u5F80\u671F",
        collapsed: true,
        items: [
          { text: "2025.06\u671F", link: "/feature/index/202506" },
          { text: "2025.05\u671F", link: "/feature/index/202505" },
          { text: "2025.04\u671F", link: "/feature/index/202504" }
        ]
      }
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
          { text: "\u7269\u54C1\u4FEE\u9970\u5668", link: "/index/\u6570\u636E\u53052-\u6570\u636E\u7ED3\u6784/#\u7269\u54C1\u4FEE\u9970\u5668" },
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
import anchor from "file:///F:/ywc/datapack_index/node_modules/.pnpm/markdown-it-footnote@3.0.3/node_modules/markdown-it-footnote/index.js";
import { nodePolyfills } from "file:///F:/ywc/datapack_index/node_modules/.pnpm/vite-plugin-node-polyfills@_975531119126c27981455b72f804164d/node_modules/vite-plugin-node-polyfills/dist/index.js";
import viteImagemin from "file:///F:/ywc/datapack_index/node_modules/.pnpm/vite-plugin-imagemin@0.6.1_vite@5.4.18_@types+node@22.14.1_/node_modules/vite-plugin-imagemin/dist/index.mjs";

// .vitepress/sidebar_feature.ts
var sidebar_feature = [
  {
    text: "\u6708\u520A\u300AFeature\u300B",
    link: "/feature/_index",
    items: [
      { text: "\u7EDD\u8D5E\u5F81\u7A3F\u4E2D\uFF01", link: "/feature/_index" }
    ]
  },
  {
    text: "\u6700\u65B0",
    items: [
      {
        text: "\u{1F31F}2025.9\u6708\u520A",
        link: "/feature/index/202509"
      }
    ]
  },
  {
    text: "",
    items: [
      {
        text: "2025.8\u6708\u520A",
        link: "/feature/index/202508"
      },
      {
        text: "2025.7\u6708\u520A",
        link: "/feature/index/202507"
      }
    ]
  },
  {
    text: "\u5F80\u671F",
    collapsed: true,
    items: [
      {
        text: "2025.6\u6708\u520A",
        link: "/feature/index/202506"
      },
      {
        text: "2025.5\u6708\u520A",
        link: "/feature/index/202505"
      },
      {
        text: "2025.4\u6708\u520A",
        link: "/feature/index/202504"
      }
    ]
  },
  {
    items: [
      { text: "\u6708\u520A\u6761\u6B3E", link: "/feature/_\u6761\u6B3E" },
      { text: "\u683C\u5F0F\u6307\u5BFC", link: "/feature/_\u683C\u5F0F\u6307\u5BFC" },
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
    text: "\u5C01\u9762\u6587\u7AE0 Featured",
    items: [
      { text: "\u539F\u7248\u5BB6\u5177\u7684\u201C\u7EC8\u6781\u7B54\u6848\u201D\uFF1F\u2014\u2014\u65B0\u4E00\u4EE3\u5BB6\u5177\u6846\u67B6\u300A\u677E\u679C\u6838\u300B", link: "/feature/archive/202504/0/content" }
    ]
  },
  {
    text: "\u6D1E\u89C1 Insights",
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
      { text: "\u300AFeature\u300B\u4E3B\u9875", link: "/feature/_index" },
      { text: "\u6708\u520A\u6761\u6B3E", link: "/feature/_\u6761\u6B3E" },
      { text: "\u683C\u5F0F\u6307\u5BFC", link: "/feature/_\u683C\u5F0F\u6307\u5BFC" },
      { text: "\u8FD4\u56DE\u4E3B\u7AD9", link: "/index/\u7EEA\u8BBA" }
    ]
  }
];
var sidebar_202505 = [
  {
    text: "Feature 2025.05",
    items: [
      { text: "\u76EE\u5F55", link: "/feature/index/202505" },
      { text: "\u4E0A\u4E00\u520A", link: "/feature/index/202504" },
      { text: "\u4E0B\u4E00\u520A", link: "/feature/index/202506" }
    ]
  },
  {
    text: "\u5C01\u9762\u6587\u7AE0 Featured",
    items: [
      { text: "\u70DF\u82B1\u6765\u54AF\uFF01", link: "/feature/archive/202505/1/content" }
    ]
  },
  {
    text: "\u9999\u8349\u5FEB\u8BAF \u039Bojang Spotlight",
    items: [
      { text: "\u9999\u8349\u5FEB\u8BAF - 2025\u5E745\u6708", link: "/feature/archive/202505/spotlight/content" }
    ]
  },
  {
    text: "\u6D1E\u89C1 Insights",
    items: [
      { text: "\u5BF9\u5C55\u793A\u5B9E\u4F53\u6E32\u67D3\u53D8\u6362\u7684\u7814\u7A76", link: "/feature/archive/202505/2/content" },
      { text: "Spyglass(\u5927\u61A8\u6279)\u8FDB\u9636\u4F7F\u7528\u8BF4\u660E", link: "/feature/archive/202505/3/content_" },
      { text: "\u6570\u636E\u5305\u548C\u547D\u4EE4\u5165\u95E8\u5B66\u4E60-\u521D\u5B66\u8005\u5982\u4F55\u5FEB\u901F\u9002\u5E94", link: "/feature/archive/202505/4/content" },
      { text: "\u539F\u7248\u8840\u6761\uFF01", link: "/feature/archive/202505/5/content" }
    ]
  },
  {
    text: "\u5DE7\u5320 Masterpieces",
    items: [
      { text: "Digging Underground", link: "/feature/archive/202505/6/content" }
    ]
  },
  {
    items: [
      { text: "\u300AFeature\u300B\u4E3B\u9875", link: "/feature/_index" },
      { text: "\u6708\u520A\u6761\u6B3E", link: "/feature/_\u6761\u6B3E" },
      { text: "\u683C\u5F0F\u6307\u5BFC", link: "/feature/_\u683C\u5F0F\u6307\u5BFC" },
      { text: "\u8FD4\u56DE\u4E3B\u7AD9", link: "/index/\u7EEA\u8BBA" }
    ]
  }
];
var sidebar_202506 = [
  {
    text: "Feature 2025.06",
    items: [
      { text: "\u76EE\u5F55", link: "/feature/index/202506" },
      { text: "\u4E0A\u4E00\u520A", link: "/feature/index/202505" },
      { text: "\u4E0B\u4E00\u520A", link: "/feature/index/202507" }
    ]
  },
  {
    text: "\u7CBE\u9009 Featured",
    items: [
      { text: "\u9002\u7528\u4E8EMinecraft\u7684\u524D\u7AEF\u6846\u67B6\u2014\u2014Floating UI", link: "/feature/archive/202506/0/content" }
    ]
  },
  {
    text: "\u9999\u8349\u5FEB\u8BAF Mojang Spotlight",
    items: [
      { text: "\u9999\u8349\u5FEB\u8BAF - 2025\u5E746\u6708", link: "/feature/archive/202506/spotlight/content" }
    ]
  },
  {
    text: "\u6D1E\u89C1 Insights",
    items: [
      { text: "\u5BF9 Minecraft \u56FE\u6807\u8D44\u4EA7\u5E93\u8D44\u6E90\u5305\u7684\u53EF\u884C\u6027\u5C1D\u8BD5", link: "/feature/archive/202506/1/content" },
      { text: "\u9AD8\u7248\u672C\u5982\u4F55\u66F4\u597D\u7684\u7F16\u8F91\u81EA\u5B9A\u4E49\u7269\u54C1\u4EA4\u4E92\u5C5E\u6027(\u89E6\u53D1\u5668\u8BE6\u89E3)", link: "/feature/archive/202506/2/content" },
      { text: "\u4ECE0\u5F00\u59CB\u5236\u4F5C\u54C8\u57FA\u7C73\u97F3\u4E50\u5531\u7247\u6570\u636E\u5305", link: "/feature/archive/202506/3/content" },
      { text: "\u6570\u636E\u5305\u306E\u7A76\u6781\u5B58\u503C\u539F\u7406\u2014\u2014\u4EC0\u4E48\u662FSNBT", link: "/feature/archive/202506/4/content" },
      { text: "\u62FE\u5C18\uFF08\u516B\uFF09-\u4F7F\u7528\u5BF9\u8BDD\u6846\u5236\u4F5C2D\u5C0F\u6E38\u620F", link: "/feature/archive/202506/5/content" }
    ]
  },
  {
    items: [
      { text: "\u300AFeature\u300B\u4E3B\u9875", link: "/feature/_index" },
      { text: "\u6708\u520A\u6761\u6B3E", link: "/feature/_\u6761\u6B3E" },
      { text: "\u683C\u5F0F\u6307\u5BFC", link: "/feature/_\u683C\u5F0F\u6307\u5BFC" },
      { text: "\u8FD4\u56DE\u4E3B\u7AD9", link: "/index/\u7EEA\u8BBA" }
    ]
  }
];
var sidebar_202507 = [
  {
    text: "Feature 2025.07",
    items: [
      { text: "\u76EE\u5F55", link: "/feature/index/202507" },
      { text: "\u4E0A\u4E00\u520A", link: "/feature/index/202506" },
      { text: "\u4E0B\u4E00\u520A", link: "/feature/index/202508" }
    ]
  },
  {
    text: "\u4E13\u9898 Featured",
    items: [
      { text: "\u4EE5\u9632\u4F60\u4E0D\u77E5\u9053\u6211\u53EF\u4EE5\u5728MC\u91CC\u73A9\u5343\u604B\u4E07\u82B1", link: "/feature/archive/202507/0/content" },
      { text: "\u66F4\u597D\u7684\u5267\u60C5\u5BF9\u8BDD", link: "/feature/archive/202507/1/content" }
    ]
  },
  {
    text: "\u9999\u8349\u5FEB\u8BAF \u039Bojang Spotlight",
    items: [
      { text: "\u9999\u8349\u5FEB\u8BAF - 2025\u5E747\u6708", link: "/feature/archive/202507/spotlight/content" }
    ]
  },
  {
    text: "\u6D1E\u89C1 Insights",
    items: [
      { text: "minecraft\u6307\u4EE4\u70F9\u996A\u6307\u5357\uFF1A\u51C9\u62CC\u5B9E\u4F53\u9009\u62E9\u5668", link: "/feature/archive/202507/2/content" },
      { text: "\u300A\u5927\u522B\u5885\u300B\u4E0E\u5BF9\u8BDD\u6846\u6742\u8C08", link: "/feature/archive/202507/3/content" },
      { text: "\u52A8\u6001\u81EA\u5B9A\u4E49\u7269\u54C1\u4F7F\u7528\u51B7\u5374", link: "/feature/archive/202507/4/content" }
    ]
  },
  {
    text: "\u5DE7\u5320 Masterpieces",
    items: [
      { text: "\u4E00\u79CD\u57FA\u4E8E\u5C55\u793A\u5B9E\u4F53\u7684\u6CD5\u9635", link: "/feature/archive/202507/5/content" },
      { text: "Minecraft\u8D44\u6E90\u5305/\u6570\u636E\u5305\u6784\u5EFA\u5DE5\u5177", link: "/feature/archive/202507/6/content" }
    ]
  },
  {
    items: [
      { text: "\u300AFeature\u300B\u4E3B\u9875", link: "/feature/_index" },
      { text: "\u6708\u520A\u6761\u6B3E", link: "/feature/_\u6761\u6B3E" },
      { text: "\u683C\u5F0F\u6307\u5BFC", link: "/feature/_\u683C\u5F0F\u6307\u5BFC" },
      { text: "\u8FD4\u56DE\u4E3B\u7AD9", link: "/index/\u7EEA\u8BBA" }
    ]
  }
];
var sidebar_202508 = [
  {
    text: "Feature 2025.08",
    items: [
      { text: "\u76EE\u5F55", link: "/feature/index/202508" },
      { text: "\u4E0A\u4E00\u520A", link: "/feature/index/202507" },
      { text: "\u4E0B\u4E00\u520A", link: "/feature/index/202509" }
    ]
  },
  {
    text: "\u5C01\u4E8C",
    link: "/feature/archive/202508/ifc/content"
  },
  {
    text: "\u4E13\u9898 Featured",
    items: [
      { text: "Minecraft \u81EA\u5B9A\u4E49\u7ED3\u6784\u751F\u6210\u6307\u5357", link: "/feature/archive/202508/0/content" },
      { text: "\u7740\u8272\u5668\u57FA\u7840\u6559\u7A0B01\uFF1AMinecraft\u4E2D\u7684\u7740\u8272\u5668", link: "/feature/archive/202508/1/content" },
      { text: "\u57FA\u4E8Ekeybind_down\u548C\u7740\u8272\u5668\u7684\u539F\u7248\u6309\u952E\u663E\u793A", link: "/feature/archive/202508/2/content" }
    ]
  },
  {
    text: "\u9999\u8349\u5FEB\u8BAF \u039Bojang Spotlight",
    items: [
      { text: "\u9999\u8349\u5FEB\u8BAF - 2025\u5E748\u6708", link: "/feature/archive/202508/spotlight/content" }
    ]
  },
  {
    text: "\u6D1E\u89C1 Insights",
    items: [
      { text: "Patrick\u7684\u6570\u636E\u5305\u5F00\u53D1\u65B0\u624B\u5BFC\u822A", link: "/feature/archive/202508/3/content" },
      { text: "\u5B9E\u4F8B\xB7\u65B0\u5FEB\u7167\u628A\u73A9\u4E4B\u6F5C\u5F71\u76D2\u663E\u793A\u4E0E\u7269\u54C1\u5C55\u793A\u4E0E\u590D\u5408\u8F93\u5165", link: "/feature/archive/202508/4/content" },
      { text: "\u57FA\u4E8E\u94C1\u7827\u91CD\u547D\u540D\u7269\u54C1\u7684\u81EA\u5B9A\u4E49\u6307\u4EE4", link: "/feature/archive/202508/5/content" },
      { text: "[1. 14. 4+] TPS\u68C0\u6D4B", link: "/feature/archive/202508/6/content" }
    ]
  },
  {
    text: "\u5DE7\u5320 Masterpieces",
    items: [
      { text: "clang-mc\uFF1A\u9762\u5411 Minecraft \u6570\u636E\u5305\u7684\u865A\u62DF CPU \u548C\u6C47\u7F16\u5F00\u53D1\u6846\u67B6", link: "/feature/archive/202508/7/content" }
    ]
  },
  {
    items: [
      { text: "\u300AFeature\u300B\u4E3B\u9875", link: "/feature/_index" },
      { text: "\u6708\u520A\u6761\u6B3E", link: "/feature/_\u6761\u6B3E" },
      { text: "\u683C\u5F0F\u6307\u5BFC", link: "/feature/_\u683C\u5F0F\u6307\u5BFC" },
      { text: "\u8FD4\u56DE\u4E3B\u7AD9", link: "/index/\u7EEA\u8BBA" }
    ]
  }
];
var sidebar_202509 = [
  {
    text: "Feature 2025.09",
    items: [
      { text: "\u76EE\u5F55", link: "/feature/index/202509" },
      { text: "\u4E0A\u4E00\u520A", link: "/feature/index/202508" }
    ]
  },
  {
    text: "\u5C01\u4E8C",
    link: "/feature/archive/202509/ifc/content"
  },
  {
    text: "\u4E13\u9898 Featured",
    items: [
      { text: "\u7B80\u5355\u3001\u8F7B\u91CF\u3001\u4F18\u96C5\u2014\u2014dc\u88C5\u9970\u6A21\u578B\u652F\u6301\u5E93", link: "/feature/archive/202509/0/content" },
      { text: "\u50CF\u5199\u8BD7\u4E00\u6837\u5236\u4F5C\u53EF\u4EA4\u4E92\u6A21\u578B", link: "/feature/archive/202509/1/content" },
      { text: "\u81EA\u7136\u5DE5\u827A - \u9AD8\u7248\u672C\u81EA\u5B9A\u4E49\u6A21\u578B\u6846\u67B6", link: "/feature/archive/202509/2/content" }
    ]
  },
  {
    text: "\u9999\u8349\u5FEB\u8BAF \u039Bojang Spotlight",
    items: [
      { text: "\u9999\u8349\u5FEB\u8BAF - 2025\u5E749\u6708", link: "/feature/archive/202509/spotlight/content" }
    ]
  },
  {
    text: "\u6D1E\u89C1 Insights",
    items: [
      { text: "\u7740\u8272\u566802 \u6838\u5FC3\u7740\u8272\u5668\u7684\u5DE5\u4F5C\u6D41\u7A0B\uFF08\u4E0A\uFF09", link: "/feature/archive/202509/3/content" },
      { text: "\u865A\u7A7A\u6570\u636E\u6838\u5FC3\u300E\u5BFB\u56DE\u72AC\u300F\u6A21\u5757\u7684\u5F00\u53D1\u5206\u4EAB", link: "/feature/archive/202509/4/content" },
      { text: "\u804A\u5929\u680F\u5377\u8F74\u5F0F\u7528\u6237\u754C\u9762\uFF1A\u5386\u53F2\u80CC\u666F\u4E0E\u4EE3\u7801\u5B9E\u73B0", link: "/feature/archive/202509/5/content" },
      { text: "\u547D\u4EE4\u4E2D\u7684\u5B9E\u4F53\u951A\u70B9\u548C\u6267\u884C\u951A\u70B9", link: "/feature/archive/202509/6/content" },
      { text: "\u6570\u636E\u5305\u5411\u8D44\u6E90\u5305\u7740\u8272\u5668\u4F20\u5165\u53C2\u6570", link: "/feature/archive/202509/7/content" }
    ]
  },
  {
    items: [
      { text: "\u300AFeature\u300B\u4E3B\u9875", link: "/feature/_index" },
      { text: "\u6708\u520A\u6761\u6B3E", link: "/feature/_\u6761\u6B3E" },
      { text: "\u683C\u5F0F\u6307\u5BFC", link: "/feature/_\u683C\u5F0F\u6307\u5BFC" },
      { text: "\u8FD4\u56DE\u4E3B\u7AD9", link: "/index/\u7EEA\u8BBA" }
    ]
  }
];

// .vitepress/config.mts
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
      { text: "\u300AFeature\u300B", link: "/feature/_index" },
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
      "/feature/archive/202506": sidebar_202506,
      "/feature/archive/202507": sidebar_202507,
      "/feature/archive/202508": sidebar_202508,
      "/feature/archive/202509": sidebar_202509,
      "/feature/": sidebar_feature
    },
    socialLinks: [
      { icon: "github", link: "https://github.com/CR-019/datapack-index" },
      { icon: "bilibili", link: "https://space.bilibili.com/85292644" },
      { icon: "afdian", link: "https://afdian.com/a/CR_019" }
    ],
    logo: "/icons/dream_catcher9.png",
    footer: {
      copyright: "Copyright\xA92025 CR_019",
      message: "Powered by Vitepress and Github Pages"
    }
  },
  head: [
    ["link", { rel: "icon", href: "/datapack-index/icons/dream_catcher9.png" }]
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
      nodePolyfills({
        include: ["util"]
      }),
      viteImagemin({
        gifsicle: { optimizationLevel: 3 },
        optipng: { optimizationLevel: 7 },
        mozjpeg: { quality: 80 },
        pngquant: { quality: [0.6, 0.8] },
        svgo: { plugins: [{ name: "removeViewBox" }] }
      })
    ]
  }
});
export {
  config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsiLnZpdGVwcmVzcy9jb25maWcubXRzIiwgIi52aXRlcHJlc3Mvc2lkZWJhci50cyIsICIudml0ZXByZXNzL2hpZ2hsaWdodHMvbWNmdW50aW9uLnRzIiwgIi52aXRlcHJlc3MvaGlnaGxpZ2h0cy9tY2RvYy9tY2RvYy50cyIsICIudml0ZXByZXNzL2hpZ2hsaWdodHMvc25idC50cyIsICIudml0ZXByZXNzL3NpZGViYXJfZmVhdHVyZS50cyJdLAogICJzb3VyY2VzQ29udGVudCI6IFsiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkY6XFxcXHl3Y1xcXFxkYXRhcGFja19pbmRleFxcXFwudml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFx5d2NcXFxcZGF0YXBhY2tfaW5kZXhcXFxcLnZpdGVwcmVzc1xcXFxjb25maWcubXRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi95d2MvZGF0YXBhY2tfaW5kZXgvLnZpdGVwcmVzcy9jb25maWcubXRzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnIH0gZnJvbSBcInZpdGVwcmVzc1wiO1xyXG5pbXBvcnQgeyBzaWRlYmFyIH0gZnJvbSBcIi4vc2lkZWJhclwiO1xyXG5pbXBvcnQgeyBtY2Z1bmN0aW9uIH0gZnJvbSBcIi4vaGlnaGxpZ2h0cy9tY2Z1bnRpb25cIjtcclxuaW1wb3J0IHsgbWNkb2MgfSBmcm9tIFwiLi9oaWdobGlnaHRzL21jZG9jL21jZG9jXCI7XHJcbmltcG9ydCB7IHNuYnQgfSBmcm9tIFwiLi9oaWdobGlnaHRzL3NuYnRcIjtcclxuaW1wb3J0IGFuY2hvciBmcm9tIFwibWFya2Rvd24taXQtZm9vdG5vdGVcIjtcclxuaW1wb3J0IHsgbm9kZVBvbHlmaWxscyB9IGZyb20gXCJ2aXRlLXBsdWdpbi1ub2RlLXBvbHlmaWxsc1wiO1xyXG5pbXBvcnQgdml0ZUltYWdlbWluIGZyb20gJ3ZpdGUtcGx1Z2luLWltYWdlbWluJztcclxuaW1wb3J0IHtcclxuICAgIHNpZGViYXJfZmVhdHVyZSxcclxuICAgIHNpZGViYXJfMjAyNTA0LFxyXG4gICAgc2lkZWJhcl8yMDI1MDUsXHJcbiAgICBzaWRlYmFyXzIwMjUwNixcclxuICAgIHNpZGViYXJfMjAyNTA3LFxyXG4gICAgc2lkZWJhcl8yMDI1MDgsXHJcbiAgICBzaWRlYmFyXzIwMjUwOSxcclxufSBmcm9tIFwiLi9zaWRlYmFyX2ZlYXR1cmVcIjtcclxuXHJcbi8vIGh0dHBzOi8vdml0ZXByZXNzLmRldi9yZWZlcmVuY2Uvc2l0ZS1jb25maWdcclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICAgIHRpdGxlOiBcIlx1OTk5OVx1ODM0OVx1NTZGRVx1NEU2Nlx1OTk4NlwiLFxyXG4gICAgYmFzZTogXCIvZGF0YXBhY2staW5kZXgvXCIsXHJcbiAgICBkZXNjcmlwdGlvbjogXCJQb3dlcmVkIGJ5IFZpdGVQcmVzc1wiLFxyXG4gICAgdGhlbWVDb25maWc6IHtcclxuICAgICAgICAvLyBodHRwczovL3ZpdGVwcmVzcy5kZXYvcmVmZXJlbmNlL2RlZmF1bHQtdGhlbWUtY29uZmlnXHJcbiAgICAgICAgb3V0bGluZVRpdGxlOiBcIlx1Njk4Mlx1ODlDOFwiLFxyXG4gICAgICAgIG91dGxpbmU6IFsyLCA2XSxcclxuICAgICAgICBuYXY6IFtcclxuICAgICAgICAgICAgeyB0ZXh0OiBcIlx1NjU4N1x1Njg2M1wiLCBsaW5rOiBcIi9pbmRleC9cdTdFRUFcdThCQkFcIiB9LFxyXG4gICAgICAgICAgICB7IHRleHQ6IFwiXHUzMDBBRmVhdHVyZVx1MzAwQlwiLCBsaW5rOiBcIi9mZWF0dXJlL19pbmRleFwiIH0sXHJcbiAgICAgICAgICAgIHsgdGV4dDogXCJXaWtpXCIsIGxpbms6IFwiaHR0cHM6Ly96aC5taW5lY3JhZnQud2lraS9cIiB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgc2VhcmNoOiB7XHJcbiAgICAgICAgICAgIHByb3ZpZGVyOiBcImxvY2FsXCIsXHJcbiAgICAgICAgICAgIG9wdGlvbnM6IHtcclxuICAgICAgICAgICAgICAgIHRyYW5zbGF0aW9uczoge1xyXG4gICAgICAgICAgICAgICAgICAgIGJ1dHRvbjoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25UZXh0OiBcIlx1NjQxQ1x1N0QyMlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBidXR0b25BcmlhTGFiZWw6IFwiXHU2NDFDXHU3RDIyXHU2NTg3XHU2ODYzXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgICAgICBtb2RhbDoge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICBub1Jlc3VsdHNUZXh0OiBcIlx1NjVFMFx1NkNENVx1NjI3RVx1NTIzMFx1NzZGOFx1NTE3M1x1N0VEM1x1Njc5Q1wiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICByZXNldEJ1dHRvblRpdGxlOiBcIlx1NkUwNVx1OTY2NFx1NjdFNVx1OEJFMlx1Njc2MVx1NEVGNlwiLFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmb290ZXI6IHtcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdFRleHQ6IFwiXHU5MDA5XHU2MkU5XCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYXZpZ2F0ZVRleHQ6IFwiXHU1MjA3XHU2MzYyXCIsXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc2lkZWJhcjoge1xyXG4gICAgICAgICAgICBcIi9pbmRleC9cIjogc2lkZWJhcixcclxuICAgICAgICAgICAgXCIvcmVzb3VyY2VzL1wiOiBzaWRlYmFyLFxyXG4gICAgICAgICAgICBcIi9mZWF0dXJlL2FyY2hpdmUvMjAyNTA0XCI6IHNpZGViYXJfMjAyNTA0LFxyXG4gICAgICAgICAgICBcIi9mZWF0dXJlL2FyY2hpdmUvMjAyNTA1XCI6IHNpZGViYXJfMjAyNTA1LFxyXG4gICAgICAgICAgICBcIi9mZWF0dXJlL2FyY2hpdmUvMjAyNTA2XCI6IHNpZGViYXJfMjAyNTA2LFxyXG4gICAgICAgICAgICBcIi9mZWF0dXJlL2FyY2hpdmUvMjAyNTA3XCI6IHNpZGViYXJfMjAyNTA3LFxyXG4gICAgICAgICAgICBcIi9mZWF0dXJlL2FyY2hpdmUvMjAyNTA4XCI6IHNpZGViYXJfMjAyNTA4LFxyXG4gICAgICAgICAgICBcIi9mZWF0dXJlL2FyY2hpdmUvMjAyNTA5XCI6IHNpZGViYXJfMjAyNTA5LFxyXG4gICAgICAgICAgICBcIi9mZWF0dXJlL1wiOiBzaWRlYmFyX2ZlYXR1cmUsXHJcbiAgICAgICAgfSxcclxuXHJcbiAgICAgICAgc29jaWFsTGlua3M6IFtcclxuICAgICAgICAgICAgeyBpY29uOiBcImdpdGh1YlwiLCBsaW5rOiBcImh0dHBzOi8vZ2l0aHViLmNvbS9DUi0wMTkvZGF0YXBhY2staW5kZXhcIiB9LFxyXG4gICAgICAgICAgICB7IGljb246IFwiYmlsaWJpbGlcIiwgbGluazogXCJodHRwczovL3NwYWNlLmJpbGliaWxpLmNvbS84NTI5MjY0NFwiIH0sXHJcbiAgICAgICAgICAgIHsgaWNvbjogXCJhZmRpYW5cIiwgbGluazogXCJodHRwczovL2FmZGlhbi5jb20vYS9DUl8wMTlcIiB9LFxyXG4gICAgICAgIF0sXHJcbiAgICAgICAgbG9nbzogXCIvaWNvbnMvZHJlYW1fY2F0Y2hlcjkucG5nXCIsXHJcbiAgICAgICAgZm9vdGVyOiB7XHJcbiAgICAgICAgICAgIGNvcHlyaWdodDogXCJDb3B5cmlnaHRcdTAwQTkyMDI1IENSXzAxOVwiLFxyXG4gICAgICAgICAgICBtZXNzYWdlOlxyXG4gICAgICAgICAgICAgICAgJ1Bvd2VyZWQgYnkgVml0ZXByZXNzIGFuZCBHaXRodWIgUGFnZXMnLFxyXG4gICAgICAgIH0sXHJcbiAgICB9LFxyXG4gICAgaGVhZDogW1xyXG4gICAgICAgIFtcImxpbmtcIiwgeyByZWw6IFwiaWNvblwiLCBocmVmOiBcIi9kYXRhcGFjay1pbmRleC9pY29ucy9kcmVhbV9jYXRjaGVyOS5wbmdcIiB9XSxcclxuICAgIF0sXHJcbiAgICBpZ25vcmVEZWFkTGlua3M6IHRydWUsXHJcbiAgICBsYXN0VXBkYXRlZDogZmFsc2UsXHJcblxyXG4gICAgbWFya2Rvd246IHtcclxuICAgICAgICBsYW5ndWFnZXM6IFttY2Z1bmN0aW9uLCBtY2RvYywgc25idF0sXHJcbiAgICAgICAgbWF0aDogdHJ1ZSxcclxuXHJcbiAgICAgICAgc2hpa2lTZXR1cDogYXN5bmMgKHNoaWtpKSA9PiB7XHJcbiAgICAgICAgICAgIGF3YWl0IHNoaWtpLmxvYWRMYW5ndWFnZShtY2Z1bmN0aW9uKTtcclxuICAgICAgICAgICAgYXdhaXQgc2hpa2kubG9hZExhbmd1YWdlKG1jZG9jKTtcclxuICAgICAgICB9LFxyXG5cclxuICAgICAgICBjb25maWc6IChtZCkgPT4ge1xyXG4gICAgICAgICAgICBtZC51c2UoYW5jaG9yKTtcclxuICAgICAgICB9LFxyXG4gICAgfSxcclxuICAgIHZpdGU6IHtcclxuICAgICAgICBwbHVnaW5zOiBbXHJcbiAgICAgICAgICAgIG5vZGVQb2x5ZmlsbHMoe1xyXG4gICAgICAgICAgICAgICAgaW5jbHVkZTogW1widXRpbFwiXSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgICAgIHZpdGVJbWFnZW1pbih7XHJcbiAgICAgICAgICAgICAgICBnaWZzaWNsZTogeyBvcHRpbWl6YXRpb25MZXZlbDogMyB9LFxyXG4gICAgICAgICAgICAgICAgb3B0aXBuZzogeyBvcHRpbWl6YXRpb25MZXZlbDogNyB9LFxyXG4gICAgICAgICAgICAgICAgbW96anBlZzogeyBxdWFsaXR5OiA4MCB9LFxyXG4gICAgICAgICAgICAgICAgcG5ncXVhbnQ6IHsgcXVhbGl0eTogWzAuNiwgMC44XSB9LFxyXG4gICAgICAgICAgICAgICAgc3ZnbzogeyBwbHVnaW5zOiBbeyBuYW1lOiAncmVtb3ZlVmlld0JveCcgfV0gfSxcclxuICAgICAgICAgICAgfSksXHJcbiAgICAgICAgXVxyXG4gICAgfSxcclxufSkiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkY6XFxcXHl3Y1xcXFxkYXRhcGFja19pbmRleFxcXFwudml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFx5d2NcXFxcZGF0YXBhY2tfaW5kZXhcXFxcLnZpdGVwcmVzc1xcXFxzaWRlYmFyLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi95d2MvZGF0YXBhY2tfaW5kZXgvLnZpdGVwcmVzcy9zaWRlYmFyLnRzXCI7aW1wb3J0IHsgRGVmYXVsdFRoZW1lIH0gZnJvbSBcInZpdGVwcmVzc1wiO1xyXG5leHBvcnQgY29uc3Qgc2lkZWJhcjogRGVmYXVsdFRoZW1lLlNpZGViYXIgPSBbXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1OTk5OVx1ODM0OVx1NTZGRVx1NEU2Nlx1OTk4NicsXHJcbiAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU1MjREXHU4QTAwJywgbGluazogJy9pbmRleC9cdTUyNERcdThBMDAnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1N0VFQVx1OEJCQScsIGxpbms6ICcvaW5kZXgvXHU3RUVBXHU4QkJBJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY3MDBcdThGRDFcdTY2RjRcdTY1QjAnLCBsaW5rOiAnL2luZGV4L19uZXcnIH1cclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTY3MDhcdTUyMEFcdTMwMEFGZWF0dXJlXHUzMDBCJyxcclxuICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdUQ4M0NcdURGRTBcdTdFRERcdThENUVcdTVGODFcdTdBM0ZcdTRFMkRcdUZGMDEnLCBsaW5rOiAnL2ZlYXR1cmUvX2luZGV4JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdUQ4M0NcdURGMUYyMDI1LjA5XHU2NzFGJywgbGluazogJy9mZWF0dXJlL2luZGV4LzIwMjUwOScgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICcnLCAgaXRlbXM6IFtcclxuICAgICAgICAgIHsgdGV4dDogJzIwMjUuMDhcdTY3MUYnLCBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA4JyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnMjAyNS4wN1x1NjcxRicsIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDcnIH0sXHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ1x1NUY4MFx1NjcxRicsIGNvbGxhcHNlZDogdHJ1ZSwgaXRlbXM6IFtcclxuICAgICAgICAgIHsgdGV4dDogJzIwMjUuMDZcdTY3MUYnLCBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA2JyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnMjAyNS4wNVx1NjcxRicsIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDUnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICcyMDI1LjA0XHU2NzFGJywgbGluazogJy9mZWF0dXJlL2luZGV4LzIwMjUwNCcgfSxcclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU2NTcwXHU2MzZFXHU1MzA1XHU0RjUzXHU3Q0ZCXHU3RUQzXHU2Nzg0JyxcclxuICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ1x1OTAzQlx1OEY5MVx1N0VEM1x1Njc4NFx1RkYxQVx1NTQ3RFx1NEVFNC9cdTUxRkRcdTY1NzAnLFxyXG4gICAgICAgIGNvbGxhcHNlZDogZmFsc2UsXHJcbiAgICAgICAgaXRlbXM6IFtcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NTQ3RFx1NEVFNFx1NjRDRFx1NEY1QycsIGxpbms6ICcvaW5kZXgvXHU1NDdEXHU0RUU0MS1cdTU0N0RcdTRFRTRcdTY0Q0RcdTRGNUMnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTY1NzBcdTYzNkVcdTY0Q0RcdTRGNUMnLCBsaW5rOiAnL2luZGV4L1x1NTQ3RFx1NEVFNDItXHU2NTcwXHU2MzZFXHU2NENEXHU0RjVDJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU2NTg3XHU2NzJDXHU3RUM0XHU0RUY2JywgbGluazogJy9pbmRleC9cdTU0N0RcdTRFRTQzLVx1NjU4N1x1NjcyQ1x1N0VDNFx1NEVGNicgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NjVCOVx1NTc1Ny9cdTcyNjlcdTU0QzFcdTY0Q0RcdTRGNUMnLCBsaW5rOiAnL2luZGV4L1x1NTQ3RFx1NEVFNDQtXHU2NUI5XHU1NzU3XHU1NDhDXHU3MjY5XHU1NEMxXHU2NENEXHU0RjVDJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU1QjlFXHU0RjUzXHU2NENEXHU0RjVDJywgbGluazogJy9pbmRleC9cdTU0N0RcdTRFRTQ1LVx1NUI5RVx1NEY1M1x1NjRDRFx1NEY1QycgfSxcclxuICAgICAgICAgIHsgdGV4dDogJ1x1NEUxNlx1NzU0Qy9cdTY3MERcdTUyQTFcdTU2NjhcdTYzMDdcdTRFRTQnLCBsaW5rOiAnL2luZGV4L1x1NTQ3RFx1NEVFNDYtXHU0RTE2XHU3NTRDXHU2MzA3XHU0RUU0JyB9LFxyXG4gICAgICAgIF1cclxuICAgICAgfSxcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICdcdTY1NzBcdTYzNkVcdTdFRDNcdTY3ODRcdUZGMUFcdTY1NzBcdTYzNkVcdTUzMDVcdTdFQzRcdTUyMDYnLFxyXG4gICAgICAgIGxpbms6ICcvaW5kZXgvXHU2NTcwXHU2MzZFXHU1MzA1Mi1cdTY1NzBcdTYzNkVcdTdFRDNcdTY3ODQnLFxyXG4gICAgICAgIGNvbGxhcHNlZDogdHJ1ZSxcclxuICAgICAgICBpdGVtczogW1xyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU2MjE4XHU1MjI5XHU1NEMxXHU4ODY4JywgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUyLVx1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NC8jXHU2MjE4XHU1MjI5XHU1NEMxXHU4ODY4JyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU4QzEzXHU4QkNEJywgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUyLVx1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NC8jXHU4QzEzXHU4QkNEJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU3MjY5XHU1NEMxXHU0RkVFXHU5OTcwXHU1NjY4JywgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUyLVx1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NC8jXHU3MjY5XHU1NEMxXHU0RkVFXHU5OTcwXHU1NjY4JyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU4RkRCXHU1RUE2JywgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUyLVx1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NC8jXHU4RkRCXHU1RUE2JyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU5NjQ0XHU5QjU0JywgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUyLVx1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NC8jXHU5NjQ0XHU5QjU0JyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU2ODA3XHU3QjdFJywgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUyLVx1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NC8jXHU2ODA3XHU3QjdFJyB9LFxyXG4gICAgICAgICAgeyB0ZXh0OiAnXHU5MTREXHU2NUI5JywgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUyLVx1NjU3MFx1NjM2RVx1N0VEM1x1Njc4NC8jXHU5MTREXHU2NUI5JyB9XHJcbiAgICAgICAgXVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ1x1NEUxNlx1NzU0Q1x1NzUxRlx1NjIxMCcsXHJcbiAgICAgICAgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDUzLVx1NEUxNlx1NzU0Q1x1NzUxRlx1NjIxMCcsXHJcbiAgICAgICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgICAgIGl0ZW1zOiBbXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTdFRDNcdTY3ODQnLCBsaW5rOiAnL2luZGV4L1x1NjU3MFx1NjM2RVx1NTMwNTMtXHU0RTE2XHU3NTRDXHU3NTFGXHU2MjEwLyNcdTdFRDNcdTY3ODQnIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTdFRjRcdTVFQTZcdTU0OENcdTdFRjRcdTVFQTZcdTdDN0JcdTU3OEInLCBsaW5rOiAnL2luZGV4L1x1NjU3MFx1NjM2RVx1NTMwNTMtXHU0RTE2XHU3NTRDXHU3NTFGXHU2MjEwLyNcdTdFRjRcdTVFQTZcdTU0OENcdTdFRjRcdTVFQTZcdTdDN0JcdTU3OEInIH0sXHJcbiAgICAgICAgICB7IHRleHQ6ICdcdTgxRUFcdTVCOUFcdTRFNDlcdTRFMTZcdTc1NENcdTc1MUZcdTYyMTAnLCBsaW5rOiAnL2luZGV4L1x1NjU3MFx1NjM2RVx1NTMwNTMtXHU0RTE2XHU3NTRDXHU3NTFGXHU2MjEwLyNcdTgxRUFcdTVCOUFcdTRFNDlcdTRFMTZcdTc1NENcdTc1MUZcdTYyMTAnIH1cclxuICAgICAgICBdXHJcbiAgICAgIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjU3MFx1NjM2RVx1NTMwNVx1NUUzOFx1NzUyOFx1NjI4MFx1NjcyRlx1NjAyN1x1NUI5RVx1NEY1MycsIGxpbms6ICcvaW5kZXgvXHU2NTcwXHU2MzZFXHU1MzA1NC1cdTYyODBcdTY3MkZcdTYwMjdcdTVCOUVcdTRGNTMnIH1cclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdThENDRcdTZFOTBcdTUzMDVcdTRGNTNcdTdDRkJcdTdFRDNcdTY3ODQnLFxyXG4gICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgbGluazogJy9pbmRleC9cdThENDRcdTZFOTBcdTUzMDVcdTRGNTNcdTdDRkJcdTdFRDNcdTY3ODQnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU2QTIxXHU1NzhCJywgbGluazogJy9pbmRleC9cdThENDRcdTZFOTBcdTUzMDVcdTRGNTNcdTdDRkJcdTdFRDNcdTY3ODQvI1x1NkEyMVx1NTc4QicgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU3RUI5XHU3NDA2JywgbGluazogJy9pbmRleC9cdThENDRcdTZFOTBcdTUzMDVcdTRGNTNcdTdDRkJcdTdFRDNcdTY3ODQvI1x1N0VCOVx1NzQwNicgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1OEYwXHU5N0YzJywgbGluazogJy9pbmRleC9cdThENDRcdTZFOTBcdTUzMDVcdTRGNTNcdTdDRkJcdTdFRDNcdTY3ODQvI1x1NThGMFx1OTdGMycgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1QjU3XHU0RjUzJywgbGluazogJy9pbmRleC9cdThENDRcdTZFOTBcdTUzMDVcdTRGNTNcdTdDRkJcdTdFRDNcdTY3ODQvI1x1NUI1N1x1NEY1MycgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU3NzQwXHU4MjcyXHU1NjY4JywgbGluazogJy9pbmRleC9cdThENDRcdTZFOTBcdTUzMDVcdTRGNTNcdTdDRkJcdTdFRDNcdTY3ODQvI1x1Nzc0MFx1ODI3Mlx1NTY2OCcgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAgeyB0ZXh0OiAnXHU2MjgwXHU2NzJGXHU2MDI3XHU2NkY0XHU2NUIwXHU2NUU1XHU1RkQ3XHVGRjA4XHU3Q0JFXHU3QjgwXHU3MjQ4XHVGRjA5JywgbGluazogJy9pbmRleC9jaGFuZ2Vsb2dfYnJlYWtpbmcnIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NTM5Rlx1NzI0OFx1NkEyMVx1N0VDNFx1NUI5RVx1OERGNScsXHJcbiAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU2NTcwXHU2MzZFXHU1MzA1XHU1QjlFXHU4REY1JywgbGluazogJy9pbmRleC9cdTY1NzBcdTYzNkVcdTUzMDVcdTVCOUVcdThERjUnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1OEQ0NFx1NkU5MFx1NTMwNVx1NUI5RVx1OERGNScsIGxpbms6ICcvaW5kZXgvXHU4RDQ0XHU2RTkwXHU1MzA1XHU1QjlFXHU4REY1JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdThDMDNcdThCRDUnLCBsaW5rOiAnL2luZGV4L1x1OEMwM1x1OEJENVx1NEUwRVx1N0VGQ1x1NTQwOFx1NUI5RVx1NEY4QicgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1RjAwXHU1M0QxXHU2NzQyXHU4QzA4JywgbGluazogJy9pbmRleC9cdTVGMDBcdTUzRDFcdTY3NDJcdThDMDgnIH1cclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTUzQzJcdTgwMDNcdTRFMEVcdTUzQ0JcdTk0RkUnLFxyXG4gICAgY29sbGFwc2VkOiBmYWxzZSxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1NURFNVx1NTE3NycsIGxpbms6ICcvaW5kZXgvXHU1REU1XHU1MTc3JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTUzQzJcdTgwMDMnLCBsaW5rOiAnL2luZGV4L1x1NTNDMlx1ODAwMycgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1M0NCXHU2MEM1XHU5NEZFXHU2M0E1JywgbGluazogJy9pbmRleC9cdTUzQ0JcdTk0RkUnIH1cclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTk2NDRcdTVGNTUnLFxyXG4gICAgY29sbGFwc2VkOiB0cnVlLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU5NjQ0XHU1RjU1MVx1RkYxQVx1NTkyOVx1OEM3OVx1NjYxRlx1OTZGMlx1NjU1OVx1N0EwQlx1NTQwOFx1OTZDNicsIGxpbms6ICcvaW5kZXgvXHU5NjQ0XHU1RjU1MScgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU5NjQ0XHU1RjU1Mlx1RkYxQUFsdW1vb3Blclx1NzY4NFx1Nzc0MFx1ODI3Mlx1NTY2OFx1NjU1OVx1N0EwQlx1NTQwOFx1OTZDNlx1MjAxNFx1MjAxNE1DSkVcdTc3NDBcdTgyNzJcdTU2NjhcdTY1NTlcdTdBMEJcdUZGMUFcdTRFQ0VcdTVGMDBcdTUzRDFcdTUxNjVcdTk1RThcdTUyMzBcdTZFMzhcdTYyMEZcdTVEMjlcdTZFODMnLCBsaW5rOiAnL2luZGV4L1x1OTY0NFx1NUY1NTInIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1OTY0NFx1NUY1NTNcdUZGMUFcdTU3MzBcdTU2RkVcdTUzOUZcdThEMzQvXHU4ODY1XHU2ODYzXHU1NzMwXHU1NzQwJywgbGluazogJy9pbmRleC9cdTk2NDRcdTVGNTUzJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTk2NDRcdTVGNTU0XHVGRjFBXHU2NzQyXHU5ODc5JywgbGluazogJy9pbmRleC9cdTk2NDRcdTVGNTU0JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTk2NDRcdTVGNTU1XHVGRjFBXHUzMDBBXHU2MkZFXHU1QzE4XHUzMDBCXHU3Q0ZCXHU1MjE3XHU1MzlGXHU3MjQ4XHU2QTIxXHU3RUM0XHU1NkZFXHU2NTg3XHU2NTU5XHU3QTBCJywgbGluazogJy9pbmRleC9cdTk2NDRcdTVGNTU1JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTk2NDRcdTVGNTU2XHVGRjFBXHU1OTMxXHU2NTQ4XHU3RDIyXHU1RjE1XHU5NEZFXHU2M0E1XHU2NTc0XHU3NDA2JywgbGluazogJy9pbmRleC9cdTk2NDRcdTVGNTU2JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTYyODBcdTY3MkZcdTYwMjdcdTY2RjRcdTY1QjBcdTY1RTVcdTVGRDcnLCBsaW5rOiAnL2luZGV4L2NoYW5nZWxvZycgfVxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NjcwRFx1NTJBMVx1NTNGMCcsXHJcbiAgICBjb2xsYXBzZWQ6IGZhbHNlLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU2QzM0XHU1NDI3XHVEODNDXHVERjc1JywgbGluazogJy9pbmRleC9cdTZDMzRcdTU0MjcnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NTkzMVx1NzI2OVx1NjJEQlx1OTg4NicsIGxpbms6ICcvaW5kZXgvXHU1OTMxXHU3MjY5XHU2MkRCXHU5ODg2JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY2RjRcdTY1QjBcdTY1RTVcdTVGRDcnLCBsaW5rOiAnL2luZGV4L191cGRhdGUnIH1cclxuICAgIF1cclxuICB9XHJcbl07XHJcbiIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRjpcXFxceXdjXFxcXGRhdGFwYWNrX2luZGV4XFxcXC52aXRlcHJlc3NcXFxcaGlnaGxpZ2h0c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxceXdjXFxcXGRhdGFwYWNrX2luZGV4XFxcXC52aXRlcHJlc3NcXFxcaGlnaGxpZ2h0c1xcXFxtY2Z1bnRpb24udHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L3l3Yy9kYXRhcGFja19pbmRleC8udml0ZXByZXNzL2hpZ2hsaWdodHMvbWNmdW50aW9uLnRzXCI7ZXhwb3J0IGNvbnN0IG1jZnVuY3Rpb246IGFueSA9IHtcclxuICBcImRpc3BsYXlOYW1lXCI6IFwiU3ludGF4IE1jZnVuY3Rpb25cIixcclxuICBcIm5hbWVcIjogXCJtY2Z1bmN0aW9uXCIsXHJcbiAgXCJzY29wZU5hbWVcIjogXCJzb3VyY2UubWNmdW5jdGlvblwiLFxyXG4gIFwidXVpZFwiOiBcIjg5MThkYWRkLThlYmUtNDJkOS1iMWU5LTA0ODlhYjIyOGQ5ZFwiLFxyXG4gIFwiZmlsZVR5cGVzXCI6IFtcclxuICAgIFwibWNmdW5jdGlvblwiLFxyXG4gICAgXCJib2x0XCJcclxuICBdLFxyXG4gIFwicGF0dGVybnNcIjogW1xyXG4gICAge1xyXG4gICAgICBcImluY2x1ZGVcIjogXCIjcm9vdFwiXHJcbiAgICB9XHJcbiAgXSxcclxuICBcInJlcG9zaXRvcnlcIjoge1xyXG4gICAgXCJyb290XCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2NvbW1lbnRzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNsaXRlcmFsc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjc2F5XCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNuYW1lc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjY29tbWVudHNfaW5saW5lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNzdWJjb21tYW5kc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjcHJvcGVydHlcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI29wZXJhdG9yc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjc2VsZWN0b3JzXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcImNvbW1lbnRzXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJhcHBseUVuZFBhdHRlcm5MYXN0XCI6IDEsXHJcbiAgICAgICAgICBcImJlZ2luXCI6IFwiXlxcXFxzKigjWz4hI10pKC4rKSRcIixcclxuICAgICAgICAgIFwiYmVnaW5DYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMVwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudC5ibG9jay5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCIyXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJtYXJrdXAuYm9sZC5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnQuYmxvY2subWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcImVuZFwiOiBcIl4oPyEjKVwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5jb21tZW50c1wiLFxyXG4gICAgICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjY29tbWVudHNfYmxvY2tcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb21tZW50LmxpbmUubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXlxcXFxzKiMuKiRcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuY29tbWVudHNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudC5saW5lLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIl5cXFxccypcXFxcLlxcXFwuXFxcXC4uKiRcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuY29tbWVudHNcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwiY29tbWVudHNfaW5saW5lXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudC5saW5lLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIiMuKiRcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuY29tbWVudHNcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwiY29tbWVudHNfYmxvY2tcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImFwcGx5RW5kUGF0dGVybkxhc3RcIjogMSxcclxuICAgICAgICAgIFwiYmVnaW5cIjogXCJeXFxcXHMqI1s+IV1cIixcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnQuYmxvY2subWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcImVuZFwiOiBcIiRcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuY29tbWVudHNfYmxvY2tcIixcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2NvbW1lbnRzX2Jsb2NrX2VtcGhhc2l6ZWRcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImFwcGx5RW5kUGF0dGVybkxhc3RcIjogMSxcclxuICAgICAgICAgIFwiYmVnaW5cIjogXCJeXFxcXHMqI1wiLFxyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudC5ibG9jay5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwiZW5kXCI6IFwiJFwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5jb21tZW50c19ibG9ja1wiLFxyXG4gICAgICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjY29tbWVudHNfYmxvY2tfbm9ybWFsXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgXVxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwiY29tbWVudHNfYmxvY2tfZW1waGFzaXplZFwiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNjb21tZW50c19ibG9ja19zcGVjaWFsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1hcmt1cC5ib2xkLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxTK1wiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5jb21tZW50c19ibG9ja19lbXBoYXNpemVkXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcImNvbW1lbnRzX2Jsb2NrX25vcm1hbFwiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNjb21tZW50c19ibG9ja19zcGVjaWFsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbW1lbnQuYmxvY2subWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXFMrXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmNvbW1lbnRzX2Jsb2NrX25vcm1hbFwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjd2hpdGVzcGFjZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJjb21tZW50c19ibG9ja19zcGVjaWFsXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwibWFya3VwLmhlYWRpbmcubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiQFxcXFxTK1wiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5jb21tZW50c19ibG9ja19zcGVjaWFsXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNyZXNvdXJjZS1uYW1lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInZhcmlhYmxlLm90aGVyLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlsjJSRdW0EtWmEtejAtOV8uIyUkXStcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuY29tbWVudHNfYmxvY2tfc3BlY2lhbFwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJsaXRlcmFsc1wiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbnN0YW50Lm51bWVyaWMuYm9vbGVhbi5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcYih0cnVlfGZhbHNlfFRydWV8RmFsc2UpXFxcXGJcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubGl0ZXJhbHNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmFyaWFibGUudXVpZC5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcYlswLTlhLWZBLUZdKyg/Oi1bMC05YS1mQS1GXSspezR9XFxcXGJcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubmFtZXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29uc3RhbnQubnVtZXJpYy5mbG9hdC5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJbKy1dP1xcXFxkKlxcXFwuP1xcXFxkKyhbZUVdP1srLV0/XFxcXGQrKT9bZGZdP1xcXFxiXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmxpdGVyYWxzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbnN0YW50Lm51bWVyaWMuaW50ZWdlci5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJbKy1dP1xcXFxkKyhifEJ8THxsfHN8Uyk/XFxcXGJcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubGl0ZXJhbHNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmFyaWFibGUub3RoZXIubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXC5cXFxcLlwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5lbGxpcHNlLmxpdGVyYWxzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiYXBwbHlFbmRQYXR0ZXJuTGFzdFwiOiAxLFxyXG4gICAgICAgICAgXCJiZWdpblwiOiBcIlxcXCJcIixcclxuICAgICAgICAgIFwiYmVnaW5DYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwicHVuY3R1YXRpb24uZGVmaW5pdGlvbi5zdHJpbmcuYmVnaW4ubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcImVuZFwiOiBcIlxcXCJcIixcclxuICAgICAgICAgIFwiZW5kQ2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmVuZC5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibmFtZVwiOiBcInN0cmluZy5xdW90ZWQuZG91YmxlLm1jZnVuY3Rpb25cIixcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2xpdGVyYWxzX3N0cmluZy1kb3VibGVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImFwcGx5RW5kUGF0dGVybkxhc3RcIjogMSxcclxuICAgICAgICAgIFwiYmVnaW5cIjogXCInXCIsXHJcbiAgICAgICAgICBcImJlZ2luQ2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmJlZ2luLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJlbmRcIjogXCInXCIsXHJcbiAgICAgICAgICBcImVuZENhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5iZWdpbi5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibmFtZVwiOiBcInN0cmluZy5xdW90ZWQuc2luZ2xlLm1jZnVuY3Rpb25cIixcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2xpdGVyYWxzX3N0cmluZy1zaW5nbGVcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJzdWJjb21tYW5kc1wiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImVudGl0eS5uYW1lLmNsYXNzLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlthLXpfXStcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubGl0ZXJhbHNcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwibGl0ZXJhbHNfc3RyaW5nLWRvdWJsZVwiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbnN0YW50LmNoYXJhY3Rlci5lc2NhcGUubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXFxcXFwuXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLmxpdGVyYWxzX3N0cmluZy1kb3VibGVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiY29uc3RhbnQuY2hhcmFjdGVyLmVzY2FwZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcXFxcXFwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5saXRlcmFsc19zdHJpbmctZG91YmxlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNtYWNyby1uYW1lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInN0cmluZy5xdW90ZWQuZG91YmxlLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlteXFxcXFxcXFxcXFwiXVwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5saXRlcmFsc19zdHJpbmctZG91YmxlXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcImxpdGVyYWxzX3N0cmluZy1zaW5nbGVcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5jaGFyYWN0ZXIuZXNjYXBlLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxcXFxcLlwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5saXRlcmFsc19zdHJpbmctc2luZ2xlXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbnN0YW50LmNoYXJhY3Rlci5lc2NhcGUubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXFxcXFxcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubGl0ZXJhbHNfc3RyaW5nLWRvdWJsZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImluY2x1ZGVcIjogXCIjbWFjcm8tbmFtZVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdHJpbmcucXVvdGVkLnNpbmdsZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJbXlxcXFxcXFxcJ11cIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubGl0ZXJhbHNfc3RyaW5nLXNpbmdsZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJzYXlcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImJlZ2luXCI6IFwiXihcXFxccyopKHNheSlcIixcclxuICAgICAgICAgIFwiYmVnaW5DYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMVwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwid2hpdGVzcGFjZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCIyXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJrZXl3b3JkLmNvbnRyb2wuZmxvdy5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwiZW5kXCI6IFwiXFxcXG5cIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuc2F5Lm1jZnVuY3Rpb25cIixcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5jaGFyYWN0ZXIuZXNjYXBlLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxcXFxcXFxcXHMqXFxcXG5cIixcclxuICAgICAgICAgICAgICBcIm1ldGFcIjogXCJtZXRhLnNheS5iYWNrc2xhc2gubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjbGl0ZXJhbHNfc3RyaW5nLWRvdWJsZVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjbGl0ZXJhbHNfc3RyaW5nLXNpbmdsZVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiYmVnaW5cIjogXCIocnVuKShcXFxccyspKHNheSlcIixcclxuICAgICAgICAgIFwiYmVnaW5DYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMVwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW50aXR5Lm5hbWUubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiMlwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwid2hpdGVzcGFjZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCIzXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJrZXl3b3JkLmNvbnRyb2wuZmxvdy5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwiZW5kXCI6IFwiXFxcXG5cIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEuc2F5Lm1jZnVuY3Rpb25cIixcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5jaGFyYWN0ZXIuZXNjYXBlLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxcXFxcXFxcXHMqXFxcXG5cIixcclxuICAgICAgICAgICAgICBcIm1ldGFcIjogXCJtZXRhLnNheS5iYWNrc2xhc2gubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjbGl0ZXJhbHNfc3RyaW5nLWRvdWJsZVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjbGl0ZXJhbHNfc3RyaW5nLXNpbmdsZVwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcIm5hbWVzXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMVwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwid2hpdGVzcGFjZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCIyXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJrZXl3b3JkLmNvbnRyb2wuZmxvdy5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJeKFxcXFxzKikoW2Etel9dKykoPz1cXFxccylcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubmFtZXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMVwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwid2hpdGVzcGFjZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCIyXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJtYXJrdXAuaXRhbGljLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBcIjNcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIndoaXRlc3BhY2UubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiNFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwia2V5d29yZC5jb250cm9sLmZsb3cubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXihcXFxccyopKFxcXFwkKSggPykoW2Etel9dKilcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubmFtZXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMVwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW50aXR5Lm5hbWUubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIFwiMlwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwid2hpdGVzcGFjZS5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCIzXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJrZXl3b3JkLmNvbnRyb2wuZmxvdy5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCIocnVuKShcXFxccyspKFthLXpfXSspXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLm5hbWVzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNyZXNvdXJjZS1uYW1lXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImVudGl0eS5uYW1lLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIltBLVphLXpdKyg/PVxcXFxXKVwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5uYW1lc1wiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdHJpbmcudW5xdW90ZWQubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiW0EtWmEtel9dW0EtWmEtejAtOV8uIyUkXSpcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubmFtZXNcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI21hY3JvLW5hbWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmFyaWFibGUub3RoZXIubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiKFsjJSRdfCgoPzw9XFxcXHMpXFxcXC4pKVtBLVphLXowLTlfLiMlJFxcXFwtXStcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubmFtZXNcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwibWFjcm8tbmFtZVwiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjFcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24udGVtcGxhdGUtZXhwcmVzc2lvbi5iZWdpbi5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCIyXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2YXJpYWJsZS5vdGhlci5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgXCIzXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnRlbXBsYXRlLWV4cHJlc3Npb24uZW5kLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIihcXFxcJFxcXFwoKShbQS1aYS16MC05X10qKShcXFxcKSlcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEubWFjcm8tbmFtZVwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJvcGVyYXRvcnNcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5udW1lcmljLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlt+Xl1cIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEub3BlcmF0b3JzXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImtleXdvcmQub3BlcmF0b3IubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiW1xcXFwtJT8hKyo8PlxcXFxcXFxcL3wmPS46LDtdXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLm9wZXJhdG9yc1wiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJwcm9wZXJ0eVwiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiYXBwbHlFbmRQYXR0ZXJuTGFzdFwiOiAxLFxyXG4gICAgICAgICAgXCJiZWdpblwiOiBcIlxcXFx7XCIsXHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwdW5jdHVhdGlvbi5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwiZW5kXCI6IFwiXFxcXH1cIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEucHJvcGVydHkuY3VybHlcIixcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI3Jlc291cmNlLW5hbWVcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2xpdGVyYWxzXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNwcm9wZXJ0eV9rZXlcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI29wZXJhdG9yc1wiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjcHJvcGVydHlfdmFsdWVcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiJHNlbGZcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImFwcGx5RW5kUGF0dGVybkxhc3RcIjogMSxcclxuICAgICAgICAgIFwiYmVnaW5cIjogXCJcXFxcW1wiLFxyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmFyaWFibGUub3RoZXIubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcImVuZFwiOiBcIlxcXFxdXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLnByb3BlcnR5LnNxdWFyZVwiLFxyXG4gICAgICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjcmVzb3VyY2UtbmFtZVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjbGl0ZXJhbHNcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI3Byb3BlcnR5X2tleVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjb3BlcmF0b3JzXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNwcm9wZXJ0eV92YWx1ZVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIkc2VsZlwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiYXBwbHlFbmRQYXR0ZXJuTGFzdFwiOiAxLFxyXG4gICAgICAgICAgXCJiZWdpblwiOiBcIlxcXFwoXCIsXHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJwdW5jdHVhdGlvbi5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwiZW5kXCI6IFwiXFxcXClcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEucHJvcGVydHkucGFyZW5cIixcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI3Jlc291cmNlLW5hbWVcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI2xpdGVyYWxzXCJcclxuICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAge1xyXG4gICAgICAgICAgICAgIFwiaW5jbHVkZVwiOiBcIiNwcm9wZXJ0eV9rZXlcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiI29wZXJhdG9yc1wiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcImluY2x1ZGVcIjogXCIjcHJvcGVydHlfdmFsdWVcIlxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJpbmNsdWRlXCI6IFwiJHNlbGZcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJwcm9wZXJ0eV9rZXlcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2YXJpYWJsZS5vdGhlci5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCIjP1thLXpfXVthLXpfXFxcXC5cXFxcLV0qXFxcXDpbYS16MC05X1xcXFwuXFxcXC0vXSsoPz1cXFxccypcXFxcPTopXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLnByb3BlcnR5X2tleVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2YXJpYWJsZS5vdGhlci5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCIjP1thLXpfXVthLXowLTlfXFxcXC5cXFxcLS9dK1wiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5wcm9wZXJ0eV9rZXlcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwidmFyaWFibGUub3RoZXIubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiW0EtWmEtel9dK1tBLVphLXpfXFxcXC1cXFxcK10qXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLnByb3BlcnR5X2tleVwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJwcm9wZXJ0eV92YWx1ZVwiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInN0cmluZy51bnF1b3RlZC5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCIjP1thLXpfXVthLXpfXFxcXC5cXFxcLV0qXFxcXDpbYS16MC05X1xcXFwuXFxcXC0vXStcIixcclxuICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEucHJvcGVydHlfdmFsdWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwic3RyaW5nLnVucXVvdGVkLm1jZnVuY3Rpb25cIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIiM/W2Etel9dW2EtejAtOV9cXFxcLlxcXFwtL10rXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLnByb3BlcnR5X3ZhbHVlXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcInJlc291cmNlLW5hbWVcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImNhcHR1cmVzXCI6IHtcclxuICAgICAgICAgICAgXCIwXCI6IHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlbnRpdHkubmFtZS5mdW5jdGlvbi5tY2Z1bmN0aW9uXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCIjP1thLXpfXVthLXowLTlfLi1dKjpbYS16MC05Xy4vLV0rXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJtZXRhLnJlc291cmNlLW5hbWVcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJjYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMFwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW50aXR5Lm5hbWUuZnVuY3Rpb24ubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiIz9bYS16MC05X1xcXFwuXFxcXC1dK1xcXFwvW2EtejAtOV9cXFxcLlxcXFwtXFxcXC9dK1wiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5yZXNvdXJjZS1uYW1lXCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcInNlbGVjdG9yc1wiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwiY2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjBcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcInN1cHBvcnQuY2xhc3MubWNmdW5jdGlvblwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIH0sXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiQFthLXpdK1wiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwibWV0YS5zZWxlY3RvcnNcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuIiwgImNvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9kaXJuYW1lID0gXCJGOlxcXFx5d2NcXFxcZGF0YXBhY2tfaW5kZXhcXFxcLnZpdGVwcmVzc1xcXFxoaWdobGlnaHRzXFxcXG1jZG9jXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFx5d2NcXFxcZGF0YXBhY2tfaW5kZXhcXFxcLnZpdGVwcmVzc1xcXFxoaWdobGlnaHRzXFxcXG1jZG9jXFxcXG1jZG9jLnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi95d2MvZGF0YXBhY2tfaW5kZXgvLnZpdGVwcmVzcy9oaWdobGlnaHRzL21jZG9jL21jZG9jLnRzXCI7ZXhwb3J0IGNvbnN0IG1jZG9jOiBhbnkgPSB7XHJcbiAgXCJuYW1lXCI6IFwibWNkb2NcIixcclxuICBcImRpc3BsYXlOYW1lXCI6IFwiU3ludGF4IE1jZG9jXCIsXHJcbiAgXCJzY29wZU5hbWVcIjogXCJzb3VyY2UubWNkb2NcIixcclxuICBcInV1aWRcIjogXCIwNDdkNDExMC0yNWU0LTQ3MTMtODAzNi0yMjYzNWNjZTRlODRcIixcclxuICBcImZpbGVUeXBlc1wiOiBbXHJcbiAgICBcIm1jZG9jXCJcclxuICBdLFxyXG4gIFwicGF0dGVybnNcIjogW1xyXG4gICAge1xyXG4gICAgICBcImluY2x1ZGVcIjogXCIjcm9vdFwiXHJcbiAgICB9XHJcbiAgXSxcclxuICBcInJlcG9zaXRvcnlcIjoge1xyXG4gICAgXCJyb290XCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJuYW1lXCI6IFwia2V5d29yZC5jb250cm9sLm1jZG9jXCIsXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXGIodXNlfHR5cGV8c3RydWN0fGVudW0pXFxcXGJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJuYW1lXCI6IFwic3RvcmFnZS5tb2RpZmllci5tY2RvY1wiLFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxiKGRpc3BhdGNofGluamVjdHx0b3xleHRlbmRzKVxcXFxiXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibmFtZVwiOiBcImVudGl0eS5uYW1lLnR5cGUubWNkb2NcIixcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcYihhbnl8Ym9vbGVhbnxzdHJpbmd8Ynl0ZXxzaG9ydHxpbnR8bG9uZ3xmbG9hdHxkb3VibGUpXFxcXGJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJuYW1lXCI6IFwiY29tbWVudC5saW5lLm1jZG9jXCIsXHJcbiAgICAgICAgICBcImJlZ2luXCI6IFwiLy9cIixcclxuICAgICAgICAgIFwiZW5kXCI6IFwiXFxuXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibmFtZVwiOiBcImNvbnN0YW50Lm51bWVyaWMubWNkb2NcIixcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcYlswLTldK1xcXFxiXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibmFtZVwiOiBcInN0cmluZy5xdW90ZWQubWNkb2NcIixcclxuICAgICAgICAgIFwiYmVnaW5cIjogXCJcXFwiXCIsXHJcbiAgICAgICAgICBcImVuZFwiOiBcIlxcXCJcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJiZWdpblwiOiBcIigjKVxcXFxbXCIsXHJcbiAgICAgICAgICBcImVuZFwiOiBcIlxcXFxdXCIsXHJcbiAgICAgICAgICBcImJlZ2luQ2FwdHVyZXNcIjoge1xyXG4gICAgICAgICAgICBcIjFcIjoge1xyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcIm1ldGEucHJlcHJvY2Vzc29yLm1jZG9jXCJcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgICAgfSxcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW50aXR5Lm5hbWUuZnVuY3Rpb24ubWNkb2NcIixcclxuICAgICAgICAgICAgICBcIm1hdGNoXCI6IFwiKD88PVxcXFxbKVtBLVphLXowLTlfXSsoPz1bPXsoXFxcXF1dKVwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJlbnRpdHkubmFtZS50eXBlLm1jZG9jXCIsXHJcbiAgICAgICAgICAgICAgXCJtYXRjaFwiOiBcIltBLVpdW0EtWmEtejAtOV9dKlwiXHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJzdHJpbmcucXVvdGVkLm1jZG9jXCIsXHJcbiAgICAgICAgICAgICAgXCJiZWdpblwiOiBcIlxcXCJcIixcclxuICAgICAgICAgICAgICBcImVuZFwiOiBcIlxcXCJcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICBdXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcImJlZ2luXCI6IFwiKFthLXowLTlfLi1dKzpbYS16MC05Xy4tXSspXFxcXFtcIixcclxuICAgICAgICAgIFwiZW5kXCI6IFwiXFxcXF1cIixcclxuICAgICAgICAgIFwiYmVnaW5DYXB0dXJlc1wiOiB7XHJcbiAgICAgICAgICAgIFwiMVwiOiB7XHJcbiAgICAgICAgICAgICAgXCJuYW1lXCI6IFwiZW50aXR5Lm5hbWUuZnVuY3Rpb24ubWNkb2NcIlxyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgICB9LFxyXG4gICAgICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAgICAgIHtcclxuICAgICAgICAgICAgICBcIm5hbWVcIjogXCJ2YXJpYWJsZS5wYXJhbWV0ZXIubWNkb2NcIixcclxuICAgICAgICAgICAgICBcIm1hdGNoXCI6IFwiW2EtejAtOV8uLV0rOlthLXowLTlfLi1dK1wiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibmFtZVwiOiBcImVudGl0eS5uYW1lLmZ1bmN0aW9uLm1jZG9jXCIsXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXGJbYS16MC05Xy4tXSs6W2EtejAtOV8uLV0rXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibmFtZVwiOiBcInZhcmlhYmxlLm1jZG9jXCIsXHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiKD88IXR5cGVcXFxccyspXFxcXGJbQS1aYS16X11bQS1aYS16MC05X10qICooPz0oXFxcXD86fDooPyE6KXw9KSAqKVwiXHJcbiAgICAgICAgfSxcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJ2YXJpYWJsZS5tY2RvY1wiLFxyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIig/PD1cXFxcWylbQS1aYS16MC05X10rKD89XFxcXFspXCJcclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibmFtZVwiOiBcImVudGl0eS5uYW1lLnR5cGUubWNkb2NcIixcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCIoOjopP1tBLVphLXpfXSg6OnxbQS1aYS16MC05X10pKlwiXHJcbiAgICAgICAgfVxyXG4gICAgICBdXHJcbiAgICB9XHJcbiAgfVxyXG59OyIsICJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRjpcXFxceXdjXFxcXGRhdGFwYWNrX2luZGV4XFxcXC52aXRlcHJlc3NcXFxcaGlnaGxpZ2h0c1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9maWxlbmFtZSA9IFwiRjpcXFxceXdjXFxcXGRhdGFwYWNrX2luZGV4XFxcXC52aXRlcHJlc3NcXFxcaGlnaGxpZ2h0c1xcXFxzbmJ0LnRzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ltcG9ydF9tZXRhX3VybCA9IFwiZmlsZTovLy9GOi95d2MvZGF0YXBhY2tfaW5kZXgvLnZpdGVwcmVzcy9oaWdobGlnaHRzL3NuYnQudHNcIjtleHBvcnQgY29uc3Qgc25idDogYW55ID0ge1xyXG4gIFwiZGlzcGxheU5hbWVcIjogXCJTTkJUXCIsXHJcbiAgXCJuYW1lXCI6IFwic25idFwiLFxyXG4gIFwic2NvcGVOYW1lXCI6IFwic291cmNlLnNuYnRcIixcclxuICBcInV1aWRcIjogXCI1ZDZiYjhkYS1jOTZjLTRjODgtYTNlNy1mMTk5NzUyNDAxMjNcIixcclxuICBcImZpbGVUeXBlc1wiOiBbXHJcbiAgICBcInNuYnRcIixcclxuICAgIFwibmJ0XCJcclxuICBdLFxyXG4gIFwicGF0dGVybnNcIjogW1xyXG4gICAgeyBcImluY2x1ZGVcIjogXCIjcm9vdFwiIH1cclxuICBdLFxyXG4gIFwicmVwb3NpdG9yeVwiOiB7XHJcbiAgICBcInJvb3RcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7IFwiaW5jbHVkZVwiOiBcIiNicmFja2V0c1wiIH0sXHJcbiAgICAgICAgeyBcImluY2x1ZGVcIjogXCIjc3RyaW5nc1wiIH0sXHJcbiAgICAgICAgeyBcImluY2x1ZGVcIjogXCIjbnVtYmVyc1wiIH0sXHJcbiAgICAgICAgeyBcImluY2x1ZGVcIjogXCIjYm9vbGVhbnNcIiB9LFxyXG4gICAgICAgIHsgXCJpbmNsdWRlXCI6IFwiI251bGxzXCIgfSxcclxuICAgICAgICB7IFwiaW5jbHVkZVwiOiBcIiNjb21tYXMtY29sb25zXCIgfSxcclxuICAgICAgICB7IFwiaW5jbHVkZVwiOiBcIiN1dWlkXCIgfSxcclxuICAgICAgICB7IFwiaW5jbHVkZVwiOiBcIiNrZXlzXCIgfVxyXG4gICAgICBdXHJcbiAgICB9LFxyXG4gICAgXCJzdHJpbmdzXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJiZWdpblwiOiBcIlxcXCJcIixcclxuICAgICAgICAgIFwiYmVnaW5DYXB0dXJlc1wiOiB7IFwiMFwiOiB7IFwibmFtZVwiOiBcInB1bmN0dWF0aW9uLmRlZmluaXRpb24uc3RyaW5nLmJlZ2luLnNuYnRcIiB9IH0sXHJcbiAgICAgICAgICBcImVuZFwiOiBcIlxcXCJcIixcclxuICAgICAgICAgIFwiZW5kQ2FwdHVyZXNcIjogeyBcIjBcIjogeyBcIm5hbWVcIjogXCJwdW5jdHVhdGlvbi5kZWZpbml0aW9uLnN0cmluZy5lbmQuc25idFwiIH0gfSxcclxuICAgICAgICAgIFwibmFtZVwiOiBcInN0cmluZy5xdW90ZWQuZG91YmxlLnNuYnRcIixcclxuICAgICAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgICAgICB7XHJcbiAgICAgICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxcXFxcLlwiLFxyXG4gICAgICAgICAgICAgIFwibmFtZVwiOiBcImNvbnN0YW50LmNoYXJhY3Rlci5lc2NhcGUuc25idFwiXHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICAgIF1cclxuICAgICAgICB9LFxyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCInW14nXSonXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJzdHJpbmcucXVvdGVkLnNpbmdsZS5zbmJ0XCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcIm51bWJlcnNcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXGJbKy1dP1xcXFxkKyhcXFxcLlxcXFxkKyk/KFtlRV1bKy1dP1xcXFxkKyk/W2ZGZERdP1xcXFxiXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5udW1lcmljLmZsb2F0LnNuYnRcIlxyXG4gICAgICAgIH0sXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxiWystXT9cXFxcZCtbYkJzU2xMXT9cXFxcYlwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwiY29uc3RhbnQubnVtZXJpYy5pbnRlZ2VyLnNuYnRcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwiYm9vbGVhbnNcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiXFxcXGIodHJ1ZXxmYWxzZSlcXFxcYlwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwiY29uc3RhbnQubGFuZ3VhZ2UuYm9vbGVhbi5zbmJ0XCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcIm51bGxzXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAge1xyXG4gICAgICAgICAgXCJtYXRjaFwiOiBcIlxcXFxiKG51bGx8TmFOfEluZmluaXR5KVxcXFxiXCIsXHJcbiAgICAgICAgICBcIm5hbWVcIjogXCJjb25zdGFudC5sYW5ndWFnZS5udWxsLnNuYnRcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwiY29tbWFzLWNvbG9uc1wiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHsgXCJtYXRjaFwiOiBcIls6LF1cIiwgXCJuYW1lXCI6IFwicHVuY3R1YXRpb24uc2VwYXJhdG9yLnNuYnRcIiB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcImJyYWNrZXRzXCI6IHtcclxuICAgICAgXCJwYXR0ZXJuc1wiOiBbXHJcbiAgICAgICAgeyBcIm1hdGNoXCI6IFwiW1xcXFx7XFxcXH1dXCIsIFwibmFtZVwiOiBcInB1bmN0dWF0aW9uLnNlY3Rpb24uYmxvY2suYnJhY2VzLnNuYnRcIiB9LFxyXG4gICAgICAgIHsgXCJtYXRjaFwiOiBcIltcXFxcW1xcXFxdXVwiLCBcIm5hbWVcIjogXCJwdW5jdHVhdGlvbi5zZWN0aW9uLmJsb2NrLmJyYWNrZXRzLnNuYnRcIiB9XHJcbiAgICAgIF1cclxuICAgIH0sXHJcbiAgICBcImtleXNcIjoge1xyXG4gICAgICBcInBhdHRlcm5zXCI6IFtcclxuICAgICAgICB7XHJcbiAgICAgICAgICBcIm1hdGNoXCI6IFwiKD88PVxcXFx7fCx8XFxcXFspXFxcXHMqW0EtWmEtel9dW0EtWmEtejAtOV9dKlxcXFxzKig/PVxcXFw6KVwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwidmFyaWFibGUub3RoZXIua2V5LnNuYnRcIlxyXG4gICAgICAgIH1cclxuICAgICAgXVxyXG4gICAgfSxcclxuICAgIFwidXVpZFwiOiB7XHJcbiAgICAgIFwicGF0dGVybnNcIjogW1xyXG4gICAgICAgIHtcclxuICAgICAgICAgIFwibWF0Y2hcIjogXCJcXFxcYlswLTlhLWZBLUZdezh9XFxcXC1bMC05YS1mQS1GXXs0fVxcXFwtWzAtOWEtZkEtRl17NH1cXFxcLVswLTlhLWZBLUZdezR9XFxcXC1bMC05YS1mQS1GXXsxMn1cXFxcYlwiLFxyXG4gICAgICAgICAgXCJuYW1lXCI6IFwiY29uc3RhbnQub3RoZXIudXVpZC5zbmJ0XCJcclxuICAgICAgICB9XHJcbiAgICAgIF1cclxuICAgIH1cclxuICB9XHJcbn0iLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkY6XFxcXHl3Y1xcXFxkYXRhcGFja19pbmRleFxcXFwudml0ZXByZXNzXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJGOlxcXFx5d2NcXFxcZGF0YXBhY2tfaW5kZXhcXFxcLnZpdGVwcmVzc1xcXFxzaWRlYmFyX2ZlYXR1cmUudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0Y6L3l3Yy9kYXRhcGFja19pbmRleC8udml0ZXByZXNzL3NpZGViYXJfZmVhdHVyZS50c1wiO2ltcG9ydCB7IERlZmF1bHRUaGVtZSB9IGZyb20gXCJ2aXRlcHJlc3NcIjtcclxuZXhwb3J0IGNvbnN0IHNpZGViYXJfZmVhdHVyZTogRGVmYXVsdFRoZW1lLlNpZGViYXIgPSBbXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NjcwOFx1NTIwQVx1MzAwQUZlYXR1cmVcdTMwMEInLFxyXG4gICAgbGluazogJy9mZWF0dXJlL19pbmRleCcsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTdFRERcdThENUVcdTVGODFcdTdBM0ZcdTRFMkRcdUZGMDEnLCBsaW5rOiAnL2ZlYXR1cmUvX2luZGV4JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NjcwMFx1NjVCMCcsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJ1x1RDgzQ1x1REYxRjIwMjUuOVx1NjcwOFx1NTIwQScsXHJcbiAgICAgICAgbGluazogJy9mZWF0dXJlL2luZGV4LzIwMjUwOSdcclxuICAgICAgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICcnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICcyMDI1LjhcdTY3MDhcdTUyMEEnLFxyXG4gICAgICAgIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDgnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiAnMjAyNS43XHU2NzA4XHU1MjBBJyxcclxuICAgICAgICBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA3J1xyXG4gICAgICB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NUY4MFx1NjcxRicsXHJcbiAgICBjb2xsYXBzZWQ6IHRydWUsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICBcclxuICAgICAge1xyXG4gICAgICAgIHRleHQ6ICcyMDI1LjZcdTY3MDhcdTUyMEEnLFxyXG4gICAgICAgIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDYnXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0ZXh0OiAnMjAyNS41XHU2NzA4XHU1MjBBJyxcclxuICAgICAgICBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA1J1xyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGV4dDogJzIwMjUuNFx1NjcwOFx1NTIwQScsXHJcbiAgICAgICAgbGluazogJy9mZWF0dXJlL2luZGV4LzIwMjUwNCdcclxuICAgICAgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1NjcwOFx1NTIwQVx1Njc2MVx1NkIzRScsIGxpbms6ICcvZmVhdHVyZS9fXHU2NzYxXHU2QjNFJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY4M0NcdTVGMEZcdTYzMDdcdTVCRkMnLCBsaW5rOiAnL2ZlYXR1cmUvX1x1NjgzQ1x1NUYwRlx1NjMwN1x1NUJGQycgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU4RkQ0XHU1NkRFXHU0RTNCXHU3QUQ5JywgbGluazogJy9pbmRleC9cdTdFRUFcdThCQkEnIH1cclxuICAgIF1cclxuICB9LFxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNpZGViYXJfMjAyNTA0OiBEZWZhdWx0VGhlbWUuU2lkZWJhciA9IFtcclxuICB7XHJcbiAgICB0ZXh0OiAnRmVhdHVyZSAyMDI1LjA0JyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1NzZFRVx1NUY1NScsIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NTIxQlx1NTIwQVx1NUJDNFx1OEJFRCcsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNC9wcmVmYWNlJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTRFMEJcdTRFMDBcdTUyMEEnLCBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA1JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NUMwMVx1OTc2Mlx1NjU4N1x1N0FFMCBGZWF0dXJlZCcsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTUzOUZcdTcyNDhcdTVCQjZcdTUxNzdcdTc2ODRcdTIwMUNcdTdFQzhcdTY3ODFcdTdCNTRcdTY4NDhcdTIwMURcdUZGMUZcdTIwMTRcdTIwMTRcdTY1QjBcdTRFMDBcdTRFRTNcdTVCQjZcdTUxNzdcdTY4NDZcdTY3QjZcdTMwMEFcdTY3N0VcdTY3OUNcdTY4MzhcdTMwMEInLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvMC9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NkQxRVx1ODlDMSBJbnNpZ2h0cycsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTY1NzBcdTYzNkVcdTUzMDVcdTVGRUJcdTkwMUZcdTUxNjVcdTk1RTgnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvMS9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTU5ODJcdTRGNTVcdTU0MDhcdTVFNzZcdTU5MUFcdTRFMkFcdTcyNDhcdTY3MkNcdTc2ODRcdTY1NzBcdTYzNkVcdTUzMDVcdUZGMUYnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvMi9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY1NzBcdTYzNkVcdTUzMDVcdTRGMThcdTUzMTZcdTUzOUZcdTUyMTlcdTRFRTVcdTUzQ0FcdTUyMDZcdTY3OTBcdTY1QjlcdTVGMEZcdTdCODBcdThGRjAnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvMy9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdOZUtvQ3VzdG9tU3Bhd24tZGVtbycsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNC80L2NvbnRlbnQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ0phdmFcdTcyNDgxLjIxLjUtU05CVFx1OEJFRFx1NkNENVx1Njk4Mlx1ODlDOCcsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNC81L2NvbnRlbnQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjJGRVx1NUMxOFx1RkYwOFx1NEUwM1x1RkYwOS1cdTRGN0ZcdTc1MjhcdTU5MERcdTU0MDhcdTcyNjlcdTU0QzFcdTZBMjFcdTU3OEJcdTY2MjBcdTVDMDRcdTY2RjRcdTdCODBcdTRGQkZcdTc2ODRcdTUyMzZcdTRGNUNcdTcyQjZcdTYwMDFcdTY4MEYnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvNi9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY4MzlcdTYzNkVcdTczQTlcdTVCQjZcdThCQjBcdTUyMDZcdTY3N0ZcdTUyMDZcdTY1NzBcdThGREJcdTg4NENcdTYzOTJcdTU0MEQnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDQvNy9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHUzMDBBRmVhdHVyZVx1MzAwQlx1NEUzQlx1OTg3NScsIGxpbms6ICcvZmVhdHVyZS9faW5kZXgnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjcwOFx1NTIwQVx1Njc2MVx1NkIzRScsIGxpbms6ICcvZmVhdHVyZS9fXHU2NzYxXHU2QjNFJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY4M0NcdTVGMEZcdTYzMDdcdTVCRkMnLCBsaW5rOiAnL2ZlYXR1cmUvX1x1NjgzQ1x1NUYwRlx1NjMwN1x1NUJGQycgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU4RkQ0XHU1NkRFXHU0RTNCXHU3QUQ5JywgbGluazogJy9pbmRleC9cdTdFRUFcdThCQkEnIH1cclxuICAgIF1cclxuICB9XHJcbl07XHJcblxyXG5cclxuZXhwb3J0IGNvbnN0IHNpZGViYXJfMjAyNTA1OiBEZWZhdWx0VGhlbWUuU2lkZWJhciA9IFtcclxuICB7XHJcbiAgICB0ZXh0OiAnRmVhdHVyZSAyMDI1LjA1JyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1NzZFRVx1NUY1NScsIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDUnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NEUwQVx1NEUwMFx1NTIwQScsIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NEUwQlx1NEUwMFx1NTIwQScsIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDYnIH0sXHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU1QzAxXHU5NzYyXHU2NTg3XHU3QUUwIEZlYXR1cmVkJyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1NzBERlx1ODJCMVx1Njc2NVx1NTRBRlx1RkYwMScsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNS8xL2NvbnRlbnQnIH0sXHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU5OTk5XHU4MzQ5XHU1RkVCXHU4QkFGIFx1MDM5Qm9qYW5nIFNwb3RsaWdodCcsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTk5OTlcdTgzNDlcdTVGRUJcdThCQUYgLSAyMDI1XHU1RTc0NVx1NjcwOCcsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNS9zcG90bGlnaHQvY29udGVudCcgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTZEMUVcdTg5QzEgSW5zaWdodHMnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU1QkY5XHU1QzU1XHU3OTNBXHU1QjlFXHU0RjUzXHU2RTMyXHU2N0QzXHU1M0Q4XHU2MzYyXHU3Njg0XHU3ODE0XHU3QTc2JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA1LzIvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnU3B5Z2xhc3MoXHU1OTI3XHU2MUE4XHU2Mjc5KVx1OEZEQlx1OTYzNlx1NEY3Rlx1NzUyOFx1OEJGNFx1NjYwRScsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNS8zL2NvbnRlbnRfJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY1NzBcdTYzNkVcdTUzMDVcdTU0OENcdTU0N0RcdTRFRTRcdTUxNjVcdTk1RThcdTVCNjZcdTRFNjAtXHU1MjFEXHU1QjY2XHU4MDA1XHU1OTgyXHU0RjU1XHU1RkVCXHU5MDFGXHU5MDAyXHU1RTk0JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA1LzQvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1MzlGXHU3MjQ4XHU4ODQwXHU2NzYxXHVGRjAxJywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA1LzUvY29udGVudCcgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTVERTdcdTUzMjAgTWFzdGVycGllY2VzJyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ0RpZ2dpbmcgVW5kZXJncm91bmQnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDUvNi9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHUzMDBBRmVhdHVyZVx1MzAwQlx1NEUzQlx1OTg3NScsIGxpbms6ICcvZmVhdHVyZS9faW5kZXgnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjcwOFx1NTIwQVx1Njc2MVx1NkIzRScsIGxpbms6ICcvZmVhdHVyZS9fXHU2NzYxXHU2QjNFJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY4M0NcdTVGMEZcdTYzMDdcdTVCRkMnLCBsaW5rOiAnL2ZlYXR1cmUvX1x1NjgzQ1x1NUYwRlx1NjMwN1x1NUJGQycgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU4RkQ0XHU1NkRFXHU0RTNCXHU3QUQ5JywgbGluazogJy9pbmRleC9cdTdFRUFcdThCQkEnIH1cclxuICAgIF1cclxuICB9XHJcbl07XHJcblxyXG5leHBvcnQgY29uc3Qgc2lkZWJhcl8yMDI1MDY6IERlZmF1bHRUaGVtZS5TaWRlYmFyID0gW1xyXG4gIHtcclxuICAgIHRleHQ6ICdGZWF0dXJlIDIwMjUuMDYnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU3NkVFXHU1RjU1JywgbGluazogJy9mZWF0dXJlL2luZGV4LzIwMjUwNicgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU0RTBBXHU0RTAwXHU1MjBBJywgbGluazogJy9mZWF0dXJlL2luZGV4LzIwMjUwNScgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU0RTBCXHU0RTAwXHU1MjBBJywgbGluazogJy9mZWF0dXJlL2luZGV4LzIwMjUwNycgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTdDQkVcdTkwMDkgRmVhdHVyZWQnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU5MDAyXHU3NTI4XHU0RThFTWluZWNyYWZ0XHU3Njg0XHU1MjREXHU3QUVGXHU2ODQ2XHU2N0I2XHUyMDE0XHUyMDE0RmxvYXRpbmcgVUknLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDYvMC9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1OTk5OVx1ODM0OVx1NUZFQlx1OEJBRiBNb2phbmcgU3BvdGxpZ2h0JyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1OTk5OVx1ODM0OVx1NUZFQlx1OEJBRiAtIDIwMjVcdTVFNzQ2XHU2NzA4JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA2L3Nwb3RsaWdodC9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NkQxRVx1ODlDMSBJbnNpZ2h0cycsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTVCRjkgTWluZWNyYWZ0IFx1NTZGRVx1NjgwN1x1OEQ0NFx1NEVBN1x1NUU5M1x1OEQ0NFx1NkU5MFx1NTMwNVx1NzY4NFx1NTNFRlx1ODg0Q1x1NjAyN1x1NUMxRFx1OEJENScsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNi8xL2NvbnRlbnQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1OUFEOFx1NzI0OFx1NjcyQ1x1NTk4Mlx1NEY1NVx1NjZGNFx1NTk3RFx1NzY4NFx1N0YxNlx1OEY5MVx1ODFFQVx1NUI5QVx1NEU0OVx1NzI2OVx1NTRDMVx1NEVBNFx1NEU5Mlx1NUM1RVx1NjAyNyhcdTg5RTZcdTUzRDFcdTU2NjhcdThCRTZcdTg5RTMpJywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA2LzIvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU0RUNFMFx1NUYwMFx1NTlDQlx1NTIzNlx1NEY1Q1x1NTRDOFx1NTdGQVx1N0M3M1x1OTdGM1x1NEU1MFx1NTUzMVx1NzI0N1x1NjU3MFx1NjM2RVx1NTMwNScsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNi8zL2NvbnRlbnQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjU3MFx1NjM2RVx1NTMwNVx1MzA2RVx1N0E3Nlx1Njc4MVx1NUI1OFx1NTAzQ1x1NTM5Rlx1NzQwNlx1MjAxNFx1MjAxNFx1NEVDMFx1NEU0OFx1NjYyRlNOQlQnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDYvNC9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTYyRkVcdTVDMThcdUZGMDhcdTUxNkJcdUZGMDktXHU0RjdGXHU3NTI4XHU1QkY5XHU4QkREXHU2ODQ2XHU1MjM2XHU0RjVDMkRcdTVDMEZcdTZFMzhcdTYyMEYnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDYvNS9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHUzMDBBRmVhdHVyZVx1MzAwQlx1NEUzQlx1OTg3NScsIGxpbms6ICcvZmVhdHVyZS9faW5kZXgnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjcwOFx1NTIwQVx1Njc2MVx1NkIzRScsIGxpbms6ICcvZmVhdHVyZS9fXHU2NzYxXHU2QjNFJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY4M0NcdTVGMEZcdTYzMDdcdTVCRkMnLCBsaW5rOiAnL2ZlYXR1cmUvX1x1NjgzQ1x1NUYwRlx1NjMwN1x1NUJGQycgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU4RkQ0XHU1NkRFXHU0RTNCXHU3QUQ5JywgbGluazogJy9pbmRleC9cdTdFRUFcdThCQkEnIH1cclxuICAgIF1cclxuICB9XHJcbl07XHJcblxyXG5leHBvcnQgY29uc3Qgc2lkZWJhcl8yMDI1MDc6IERlZmF1bHRUaGVtZS5TaWRlYmFyID0gW1xyXG4gIHtcclxuICAgIHRleHQ6ICdGZWF0dXJlIDIwMjUuMDcnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU3NkVFXHU1RjU1JywgbGluazogJy9mZWF0dXJlL2luZGV4LzIwMjUwNycgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU0RTBBXHU0RTAwXHU1MjBBJywgbGluazogJy9mZWF0dXJlL2luZGV4LzIwMjUwNicgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU0RTBCXHU0RTAwXHU1MjBBJywgbGluazogJy9mZWF0dXJlL2luZGV4LzIwMjUwOCcgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTRFMTNcdTk4OTggRmVhdHVyZWQnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHU0RUU1XHU5NjMyXHU0RjYwXHU0RTBEXHU3N0U1XHU5MDUzXHU2MjExXHU1M0VGXHU0RUU1XHU1NzI4TUNcdTkxQ0NcdTczQTlcdTUzNDNcdTYwNEJcdTRFMDdcdTgyQjEnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDcvMC9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY2RjRcdTU5N0RcdTc2ODRcdTUyNjdcdTYwQzVcdTVCRjlcdThCREQnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDcvMS9jb250ZW50JyB9XHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU5OTk5XHU4MzQ5XHU1RkVCXHU4QkFGIFx1MDM5Qm9qYW5nIFNwb3RsaWdodCcsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTk5OTlcdTgzNDlcdTVGRUJcdThCQUYgLSAyMDI1XHU1RTc0N1x1NjcwOCcsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwNy9zcG90bGlnaHQvY29udGVudCcgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTZEMUVcdTg5QzEgSW5zaWdodHMnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnbWluZWNyYWZ0XHU2MzA3XHU0RUU0XHU3MEY5XHU5OTZBXHU2MzA3XHU1MzU3XHVGRjFBXHU1MUM5XHU2MkNDXHU1QjlFXHU0RjUzXHU5MDA5XHU2MkU5XHU1NjY4JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA3LzIvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHUzMDBBXHU1OTI3XHU1MjJCXHU1ODg1XHUzMDBCXHU0RTBFXHU1QkY5XHU4QkREXHU2ODQ2XHU2NzQyXHU4QzA4JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA3LzMvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1MkE4XHU2MDAxXHU4MUVBXHU1QjlBXHU0RTQ5XHU3MjY5XHU1NEMxXHU0RjdGXHU3NTI4XHU1MUI3XHU1Mzc0JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA3LzQvY29udGVudCcgfSxcclxuXHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU1REU3XHU1MzIwIE1hc3RlcnBpZWNlcycsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTRFMDBcdTc5Q0RcdTU3RkFcdTRFOEVcdTVDNTVcdTc5M0FcdTVCOUVcdTRGNTNcdTc2ODRcdTZDRDVcdTk2MzUnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDcvNS9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdNaW5lY3JhZnRcdThENDRcdTZFOTBcdTUzMDUvXHU2NTcwXHU2MzZFXHU1MzA1XHU2Nzg0XHU1RUZBXHU1REU1XHU1MTc3JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA3LzYvY29udGVudCcgfVxyXG5cclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1MzAwQUZlYXR1cmVcdTMwMEJcdTRFM0JcdTk4NzUnLCBsaW5rOiAnL2ZlYXR1cmUvX2luZGV4JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY3MDhcdTUyMEFcdTY3NjFcdTZCM0UnLCBsaW5rOiAnL2ZlYXR1cmUvX1x1Njc2MVx1NkIzRScgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU2ODNDXHU1RjBGXHU2MzA3XHU1QkZDJywgbGluazogJy9mZWF0dXJlL19cdTY4M0NcdTVGMEZcdTYzMDdcdTVCRkMnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1OEZENFx1NTZERVx1NEUzQlx1N0FEOScsIGxpbms6ICcvaW5kZXgvXHU3RUVBXHU4QkJBJyB9XHJcbiAgICBdXHJcbiAgfVxyXG5dO1xyXG5cclxuZXhwb3J0IGNvbnN0IHNpZGViYXJfMjAyNTA4OiBEZWZhdWx0VGhlbWUuU2lkZWJhciA9IFtcclxuICB7XHJcbiAgICB0ZXh0OiAnRmVhdHVyZSAyMDI1LjA4JyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1NzZFRVx1NUY1NScsIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDgnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NEUwQVx1NEUwMFx1NTIwQScsIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDcnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NEUwQlx1NEUwMFx1NTIwQScsIGxpbms6ICcvZmVhdHVyZS9pbmRleC8yMDI1MDknIH0sXHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU1QzAxXHU0RThDJyxcclxuICAgIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwOC9pZmMvY29udGVudCdcclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTRFMTNcdTk4OTggRmVhdHVyZWQnLFxyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnTWluZWNyYWZ0IFx1ODFFQVx1NUI5QVx1NEU0OVx1N0VEM1x1Njc4NFx1NzUxRlx1NjIxMFx1NjMwN1x1NTM1NycsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwOC8wL2NvbnRlbnQnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1Nzc0MFx1ODI3Mlx1NTY2OFx1NTdGQVx1Nzg0MFx1NjU1OVx1N0EwQjAxXHVGRjFBTWluZWNyYWZ0XHU0RTJEXHU3Njg0XHU3NzQwXHU4MjcyXHU1NjY4JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA4LzEvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1N0ZBXHU0RThFa2V5YmluZF9kb3duXHU1NDhDXHU3NzQwXHU4MjcyXHU1NjY4XHU3Njg0XHU1MzlGXHU3MjQ4XHU2MzA5XHU5NTJFXHU2NjNFXHU3OTNBJywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA4LzIvY29udGVudCcgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTk5OTlcdTgzNDlcdTVGRUJcdThCQUYgXHUwMzlCb2phbmcgU3BvdGxpZ2h0JyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1OTk5OVx1ODM0OVx1NUZFQlx1OEJBRiAtIDIwMjVcdTVFNzQ4XHU2NzA4JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA4L3Nwb3RsaWdodC9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NkQxRVx1ODlDMSBJbnNpZ2h0cycsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdQYXRyaWNrXHU3Njg0XHU2NTcwXHU2MzZFXHU1MzA1XHU1RjAwXHU1M0QxXHU2NUIwXHU2MjRCXHU1QkZDXHU4MjJBJywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA4LzMvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1QjlFXHU0RjhCXHUwMEI3XHU2NUIwXHU1RkVCXHU3MTY3XHU2MjhBXHU3M0E5XHU0RTRCXHU2RjVDXHU1RjcxXHU3NkQyXHU2NjNFXHU3OTNBXHU0RTBFXHU3MjY5XHU1NEMxXHU1QzU1XHU3OTNBXHU0RTBFXHU1OTBEXHU1NDA4XHU4RjkzXHU1MTY1JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA4LzQvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1N0ZBXHU0RThFXHU5NEMxXHU3ODI3XHU5MUNEXHU1NDdEXHU1NDBEXHU3MjY5XHU1NEMxXHU3Njg0XHU4MUVBXHU1QjlBXHU0RTQ5XHU2MzA3XHU0RUU0JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA4LzUvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnWzEuIDE0LiA0K10gVFBTXHU2OEMwXHU2RDRCJywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA4LzYvY29udGVudCcgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTVERTdcdTUzMjAgTWFzdGVycGllY2VzJyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ2NsYW5nLW1jXHVGRjFBXHU5NzYyXHU1NDExIE1pbmVjcmFmdCBcdTY1NzBcdTYzNkVcdTUzMDVcdTc2ODRcdTg2NUFcdTYyREYgQ1BVIFx1NTQ4Q1x1NkM0N1x1N0YxNlx1NUYwMFx1NTNEMVx1Njg0Nlx1NjdCNicsIGxpbms6ICcvZmVhdHVyZS9hcmNoaXZlLzIwMjUwOC83L2NvbnRlbnQnIH0sXHJcbiAgICBdXHJcbiAgfSxcclxuICB7XHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTMwMEFGZWF0dXJlXHUzMDBCXHU0RTNCXHU5ODc1JywgbGluazogJy9mZWF0dXJlL19pbmRleCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU2NzA4XHU1MjBBXHU2NzYxXHU2QjNFJywgbGluazogJy9mZWF0dXJlL19cdTY3NjFcdTZCM0UnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjgzQ1x1NUYwRlx1NjMwN1x1NUJGQycsIGxpbms6ICcvZmVhdHVyZS9fXHU2ODNDXHU1RjBGXHU2MzA3XHU1QkZDJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdThGRDRcdTU2REVcdTRFM0JcdTdBRDknLCBsaW5rOiAnL2luZGV4L1x1N0VFQVx1OEJCQScgfVxyXG4gICAgXVxyXG4gIH1cclxuXTtcclxuXHJcbmV4cG9ydCBjb25zdCBzaWRlYmFyXzIwMjUwOTogRGVmYXVsdFRoZW1lLlNpZGViYXIgPSBbXHJcbiAge1xyXG4gICAgdGV4dDogJ0ZlYXR1cmUgMjAyNS4wOScsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTc2RUVcdTVGNTUnLCBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA5JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTRFMEFcdTRFMDBcdTUyMEEnLCBsaW5rOiAnL2ZlYXR1cmUvaW5kZXgvMjAyNTA4JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NUMwMVx1NEU4QycsXHJcbiAgICBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDkvaWZjL2NvbnRlbnQnXHJcbiAgfSxcclxuICB7XHJcbiAgICB0ZXh0OiAnXHU0RTEzXHU5ODk4IEZlYXR1cmVkJyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1N0I4MFx1NTM1NVx1MzAwMVx1OEY3Qlx1OTFDRlx1MzAwMVx1NEYxOFx1OTZDNVx1MjAxNFx1MjAxNGRjXHU4OEM1XHU5OTcwXHU2QTIxXHU1NzhCXHU2NTJGXHU2MzAxXHU1RTkzJywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA5LzAvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU1MENGXHU1MTk5XHU4QkQ3XHU0RTAwXHU2ODM3XHU1MjM2XHU0RjVDXHU1M0VGXHU0RUE0XHU0RTkyXHU2QTIxXHU1NzhCJywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA5LzEvY29udGVudCcgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU4MUVBXHU3MTM2XHU1REU1XHU4MjdBIC0gXHU5QUQ4XHU3MjQ4XHU2NzJDXHU4MUVBXHU1QjlBXHU0RTQ5XHU2QTIxXHU1NzhCXHU2ODQ2XHU2N0I2JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA5LzIvY29udGVudCcgfSxcclxuICAgIF1cclxuICB9LFxyXG4gIHtcclxuICAgIHRleHQ6ICdcdTk5OTlcdTgzNDlcdTVGRUJcdThCQUYgXHUwMzlCb2phbmcgU3BvdGxpZ2h0JyxcclxuICAgIGl0ZW1zOiBbXHJcbiAgICAgIHsgdGV4dDogJ1x1OTk5OVx1ODM0OVx1NUZFQlx1OEJBRiAtIDIwMjVcdTVFNzQ5XHU2NzA4JywgbGluazogJy9mZWF0dXJlL2FyY2hpdmUvMjAyNTA5L3Nwb3RsaWdodC9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgdGV4dDogJ1x1NkQxRVx1ODlDMSBJbnNpZ2h0cycsXHJcbiAgICBpdGVtczogW1xyXG4gICAgICB7IHRleHQ6ICdcdTc3NDBcdTgyNzJcdTU2NjgwMiBcdTY4MzhcdTVGQzNcdTc3NDBcdTgyNzJcdTU2NjhcdTc2ODRcdTVERTVcdTRGNUNcdTZENDFcdTdBMEJcdUZGMDhcdTRFMEFcdUZGMDknLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDkvMy9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTg2NUFcdTdBN0FcdTY1NzBcdTYzNkVcdTY4MzhcdTVGQzNcdTMwMEVcdTVCRkJcdTU2REVcdTcyQUNcdTMwMEZcdTZBMjFcdTU3NTdcdTc2ODRcdTVGMDBcdTUzRDFcdTUyMDZcdTRFQUInLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDkvNC9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTgwNEFcdTU5MjlcdTY4MEZcdTUzNzdcdThGNzRcdTVGMEZcdTc1MjhcdTYyMzdcdTc1NENcdTk3NjJcdUZGMUFcdTUzODZcdTUzRjJcdTgwQ0NcdTY2NkZcdTRFMEVcdTRFRTNcdTc4MDFcdTVCOUVcdTczQjAnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDkvNS9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTU0N0RcdTRFRTRcdTRFMkRcdTc2ODRcdTVCOUVcdTRGNTNcdTk1MUFcdTcwQjlcdTU0OENcdTYyNjdcdTg4NENcdTk1MUFcdTcwQjknLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDkvNi9jb250ZW50JyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY1NzBcdTYzNkVcdTUzMDVcdTU0MTFcdThENDRcdTZFOTBcdTUzMDVcdTc3NDBcdTgyNzJcdTU2NjhcdTRGMjBcdTUxNjVcdTUzQzJcdTY1NzAnLCBsaW5rOiAnL2ZlYXR1cmUvYXJjaGl2ZS8yMDI1MDkvNy9jb250ZW50JyB9LFxyXG4gICAgXVxyXG4gIH0sXHJcbiAge1xyXG4gICAgaXRlbXM6IFtcclxuICAgICAgeyB0ZXh0OiAnXHUzMDBBRmVhdHVyZVx1MzAwQlx1NEUzQlx1OTg3NScsIGxpbms6ICcvZmVhdHVyZS9faW5kZXgnIH0sXHJcbiAgICAgIHsgdGV4dDogJ1x1NjcwOFx1NTIwQVx1Njc2MVx1NkIzRScsIGxpbms6ICcvZmVhdHVyZS9fXHU2NzYxXHU2QjNFJyB9LFxyXG4gICAgICB7IHRleHQ6ICdcdTY4M0NcdTVGMEZcdTYzMDdcdTVCRkMnLCBsaW5rOiAnL2ZlYXR1cmUvX1x1NjgzQ1x1NUYwRlx1NjMwN1x1NUJGQycgfSxcclxuICAgICAgeyB0ZXh0OiAnXHU4RkQ0XHU1NkRFXHU0RTNCXHU3QUQ5JywgbGluazogJy9pbmRleC9cdTdFRUFcdThCQkEnIH1cclxuICAgIF1cclxuICB9XHJcbl07Il0sCiAgIm1hcHBpbmdzIjogIjtBQUFrUixTQUFTLG9CQUFvQjs7O0FDQ3hTLElBQU0sVUFBZ0M7QUFBQSxFQUMzQztBQUFBLElBQ0UsTUFBTTtBQUFBLElBQ04sV0FBVztBQUFBLElBQ1gsT0FBTztBQUFBLE1BQ0wsRUFBRSxNQUFNLGdCQUFNLE1BQU0sc0JBQVk7QUFBQSxNQUNoQyxFQUFFLE1BQU0sZ0JBQU0sTUFBTSxzQkFBWTtBQUFBLE1BQ2hDLEVBQUUsTUFBTSw0QkFBUSxNQUFNLGNBQWM7QUFBQSxJQUN0QztBQUFBLEVBQ0Y7QUFBQSxFQUNBO0FBQUEsSUFDRSxNQUFNO0FBQUEsSUFDTixXQUFXO0FBQUEsSUFDWCxPQUFPO0FBQUEsTUFDTCxFQUFFLE1BQU0saURBQVksTUFBTSxrQkFBa0I7QUFBQSxNQUM1QyxFQUFFLE1BQU0sMEJBQWMsTUFBTSx3QkFBd0I7QUFBQSxNQUNwRDtBQUFBLFFBQ0Us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O0FBQUEsVUFDRjtBQUFBLFFBQ0Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsZUFBZTtBQUFBLE1BQ2IsWUFBWTtBQUFBLFFBQ1Y7QUFBQSxVQUNFLFlBQVk7QUFBQSxZQUNWLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsMEJBQTBCO0FBQUEsTUFDeEIsWUFBWTtBQUFBLFFBQ1Y7QUFBQSxVQUNFLFlBQVk7QUFBQSxZQUNWLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0UsV0FBVztBQUFBLFFBQ2I7QUFBQSxRQUNBO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLDBCQUEwQjtBQUFBLE1BQ3hCLFlBQVk7QUFBQSxRQUNWO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0UsWUFBWTtBQUFBLFlBQ1YsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsVUFDQSxTQUFTO0FBQUEsVUFDVCxRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFdBQVc7QUFBQSxRQUNiO0FBQUEsUUFDQTtBQUFBLFVBQ0UsWUFBWTtBQUFBLFlBQ1YsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsVUFDQSxTQUFTO0FBQUEsVUFDVCxRQUFRO0FBQUEsUUFDVjtBQUFBLE1BQ0Y7QUFBQSxJQUNGO0FBQUEsSUFDQSxPQUFPO0FBQUEsTUFDTCxZQUFZO0FBQUEsUUFDVjtBQUFBLFVBQ0UsU0FBUztBQUFBLFVBQ1QsaUJBQWlCO0FBQUEsWUFDZixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0EsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsVUFDQSxPQUFPO0FBQUEsVUFDUCxRQUFRO0FBQUEsVUFDUixZQUFZO0FBQUEsWUFDVjtBQUFBLGNBQ0UsWUFBWTtBQUFBLGdCQUNWLEtBQUs7QUFBQSxrQkFDSCxRQUFRO0FBQUEsZ0JBQ1Y7QUFBQSxjQUNGO0FBQUEsY0FDQSxTQUFTO0FBQUEsY0FDVCxRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0E7QUFBQSxjQUNFLFdBQVc7QUFBQSxZQUNiO0FBQUEsWUFDQTtBQUFBLGNBQ0UsV0FBVztBQUFBLFlBQ2I7QUFBQSxVQUNGO0FBQUEsUUFDRjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFNBQVM7QUFBQSxVQUNULGlCQUFpQjtBQUFBLFlBQ2YsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQSxLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLE9BQU87QUFBQSxVQUNQLFFBQVE7QUFBQSxVQUNSLFlBQVk7QUFBQSxZQUNWO0FBQUEsY0FDRSxZQUFZO0FBQUEsZ0JBQ1YsS0FBSztBQUFBLGtCQUNILFFBQVE7QUFBQSxnQkFDVjtBQUFBLGNBQ0Y7QUFBQSxjQUNBLFNBQVM7QUFBQSxjQUNULFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQTtBQUFBLGNBQ0UsV0FBVztBQUFBLFlBQ2I7QUFBQSxZQUNBO0FBQUEsY0FDRSxXQUFXO0FBQUEsWUFDYjtBQUFBLFVBQ0Y7QUFBQSxRQUNGO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFNBQVM7QUFBQSxNQUNQLFlBQVk7QUFBQSxRQUNWO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0EsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxVQUNGO0FBQUEsVUFDQSxTQUFTO0FBQUEsVUFDVCxRQUFRO0FBQUEsUUFDVjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFlBQVk7QUFBQSxZQUNWLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsWUFDQSxLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0EsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0EsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxXQUFXO0FBQUEsUUFDYjtBQUFBLFFBQ0E7QUFBQSxVQUNFLFlBQVk7QUFBQSxZQUNWLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsUUFDQTtBQUFBLFVBQ0UsV0FBVztBQUFBLFFBQ2I7QUFBQSxRQUNBO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLGNBQWM7QUFBQSxNQUNaLFlBQVk7QUFBQSxRQUNWO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFlBQ0EsS0FBSztBQUFBLGNBQ0gsUUFBUTtBQUFBLFlBQ1Y7QUFBQSxZQUNBLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxNQUNGO0FBQUEsSUFDRjtBQUFBLElBQ0EsYUFBYTtBQUFBLE1BQ1gsWUFBWTtBQUFBLFFBQ1Y7QUFBQSxVQUNFLFlBQVk7QUFBQSxZQUNWLEtBQUs7QUFBQSxjQUNILFFBQVE7QUFBQSxZQUNWO0FBQUEsVUFDRjtBQUFBLFVBQ0EsU0FBUztBQUFBLFVBQ1QsUUFBUTtBQUFBLFFBQ1Y7QUFBQSxRQUNBO0FBQUEsVUFDRSxZQUFZO0FBQUEsWUFDVixLQUFLO0FBQUEsY0FDSCxRQUFRO0FBQUEsWUFDVjtBQUFBLFVBQ0Y7QUFBQSxVQUNBLFNBQVM7QUFBQSxVQUNULFFBQVE7QUFBQSxRQUNWO0FBQUEsTUFDRjtBQUFBLElBQ0Y7QUFBQSxJQUNBLFlBQVk7QUFBQSxNQUNWLFlBQVk7QUFBQSxRQUNWO0FBQUEsVUFDRSx1QkFBdUI7QUFBQSxVQUN2QixTQUFTO0FBQUEsVUFDVCxZQUFZO0FBQUEs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
