import type { LanguageRegistration } from 'shiki'

export const mcfpp = {
  name: 'mcfpp',
  displayName: 'MCFPP',
  scopeName: 'source.mcfpp',
  fileTypes: ['mcfpp'],
  patterns: [
    { include: '#version-directive' },
    { include: '#command' },
    { include: '#expression' },
  ],
  repository: {
    'version-directive': {
      name: 'meta.preprocessor.mcfpp',
      begin: String.raw`^\s*(#(?:if|elif|else|endif)\b)`,
      beginCaptures: { 1: { name: 'keyword.control.directive.mcfpp' } },
      end: '$',
      patterns: [
        { include: '#comments' },
        { match: String.raw`\bMC\b`, name: 'constant.language.mcfpp' },
        { match: String.raw`\b\d+(?:\.\d+)+\b`, name: 'constant.numeric.version.mcfpp' },
        { include: '#operators' },
      ],
    },
    comments: {
      patterns: [
        { match: '///.*$', name: 'comment.line.documentation.mcfpp' },
        { match: '//.*$', name: 'comment.line.double-slash.mcfpp' },
        // Older MCFPP examples use hash comments.
        { begin: String.raw`#\{`, end: String.raw`\}#`, name: 'comment.block.mcfpp' },
        { match: '#.*$', name: 'comment.line.number-sign.mcfpp' },
      ],
    },
    expression: {
      patterns: [
        { include: '#comments' },
        { include: '#strings' },
        { include: '#numbers' },
        { include: '#selectors' },
        {
          match: String.raw`\b(func)[ \t]+([A-Za-z_]\w*)(?=[ \t]*(?:[<({]|$))`,
          captures: {
            1: { name: 'storage.type.function.mcfpp' },
            2: { name: 'entity.name.function.mcfpp' },
          },
        },
        {
          match: String.raw`\b(data|class|interface|enum|typealias)[ \t]+([A-Za-z_]\w*)`,
          captures: {
            1: { name: 'storage.type.mcfpp' },
            2: { name: 'entity.name.type.mcfpp' },
          },
        },
        {
          match: String.raw`\b(var|const|external)[ \t]+([A-Za-z_]\w*)(?=[ \t]*(?:[:=;}#]|\bas\b|//|$))`,
          captures: {
            1: { name: 'storage.modifier.mcfpp' },
            2: { name: 'variable.other.definition.mcfpp' },
          },
        },
        { match: String.raw`\b(?:if|else|while|do|for|break|continue|return)\b`, name: 'keyword.control.mcfpp' },
        { match: String.raw`\b(?:namespace|import|as|is|in|out)\b`, name: 'keyword.other.mcfpp' },
        { match: String.raw`\b(?:func|data|class|interface|enum|typealias|new|constructor)\b`, name: 'storage.type.mcfpp' },
        { match: String.raw`\b(?:var|const|external|dynamic|abstract|override|inline|static|public|protected|private|native)\b`, name: 'storage.modifier.mcfpp' },
        { match: String.raw`\b(?:int|float|bool|string|text|nbt|list|dict|map|entity|selector|any|void|type|ScoreRef|NBTRef)\b`, name: 'support.type.mcfpp' },
        { match: String.raw`\b(?:true|false|null)\b`, name: 'constant.language.mcfpp' },
        { match: String.raw`\b(?:this|super)\b`, name: 'variable.language.mcfpp' },
        { match: String.raw`@[A-Za-z_]\w*`, name: 'entity.name.function.annotation.mcfpp' },
        { match: String.raw`\b[A-Za-z_]\w*(?=[ \t]*\()`, name: 'entity.name.function.call.mcfpp' },
        { include: '#operators' },
      ],
    },
    strings: {
      patterns: [
        { begin: '"', end: '"|$', name: 'string.quoted.double.mcfpp', patterns: [{ include: '#escape' }] },
        { begin: "'", end: "'|$", name: 'string.quoted.single.mcfpp', patterns: [{ include: '#escape' }] },
      ],
    },
    escape: { match: String.raw`\\.`, name: 'constant.character.escape.mcfpp' },
    numbers: {
      patterns: [
        {
          match: String.raw`(?:\b\d+\.(?!\.)\d*|(?<![\w.])\.\d+)(?:[eE][+-]?\d+)?[fFdD]?(?!\w)|\b\d+(?:[eE][+-]?\d+[fFdD]?|[fFdD])\b`,
          name: 'constant.numeric.float.mcfpp',
        },
        { match: String.raw`\b(?:0[xX][\da-fA-F]+|0[bB][01]+|\d+)[bBsSlL]?\b`, name: 'constant.numeric.integer.mcfpp' },
      ],
    },
    selectors: { match: String.raw`@[aenprs]\b`, name: 'variable.language.selector.mcfpp' },
    operators: { match: String.raw`->|\.\.|&&|\|\||[+*/%!<>=-]=?|\?`, name: 'keyword.operator.mcfpp' },
    command: {
      name: 'meta.embedded.line.mcfunction',
      begin: String.raw`^[ \t]*(/)(?![/*])([a-z_][a-z0-9_.-]*(?::[a-z_][a-z0-9_]*)?)?`,
      beginCaptures: {
        1: { name: 'punctuation.definition.command.mcfpp' },
        2: { name: 'keyword.control.flow.mcfunction' },
      },
      end: '$',
      patterns: [
        { include: '#interpolation' },
        {
          begin: String.raw`(["'])`,
          end: String.raw`\1|$`,
          name: 'string.quoted.mcfunction',
          patterns: [{ include: '#escape' }, { include: '#interpolation' }],
        },
        { include: '#selectors' },
        { match: String.raw`#?\b[a-z0-9_.-]+:[a-z0-9_./-]+`, name: 'constant.other.resource-location.mcfunction' },
        { match: String.raw`[~^]`, name: 'keyword.operator.coordinate.mcfunction' },
        { include: '#numbers' },
      ],
    },
    interpolation: {
      name: 'meta.interpolation.mcfpp',
      begin: String.raw`\$\{`,
      beginCaptures: { 0: { name: 'punctuation.section.interpolation.begin.mcfpp' } },
      end: String.raw`(\})|$`,
      endCaptures: { 1: { name: 'punctuation.section.interpolation.end.mcfpp' } },
      patterns: [{ include: '#braces' }, { include: '#expression' }],
    },
    braces: {
      begin: String.raw`\{`,
      end: String.raw`\}|$`,
      patterns: [{ include: '#braces' }, { include: '#expression' }],
    },
  },
} satisfies LanguageRegistration
