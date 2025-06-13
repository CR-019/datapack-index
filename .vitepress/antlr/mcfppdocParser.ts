// Generated from .vitepress\antlr\mcfppdoc.g4 by ANTLR 4.9.0-SNAPSHOT


import { ATN } from "antlr4ts/atn/ATN";
import { ATNDeserializer } from "antlr4ts/atn/ATNDeserializer";
import { FailedPredicateException } from "antlr4ts/FailedPredicateException";
import { NotNull } from "antlr4ts/Decorators";
import { NoViableAltException } from "antlr4ts/NoViableAltException";
import { Override } from "antlr4ts/Decorators";
import { Parser } from "antlr4ts/Parser";
import { ParserRuleContext } from "antlr4ts/ParserRuleContext";
import { ParserATNSimulator } from "antlr4ts/atn/ParserATNSimulator";
import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";
import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";
import { RecognitionException } from "antlr4ts/RecognitionException";
import { RuleContext } from "antlr4ts/RuleContext";
//import { RuleVersion } from "antlr4ts/RuleVersion";
import { TerminalNode } from "antlr4ts/tree/TerminalNode";
import { Token } from "antlr4ts/Token";
import { TokenStream } from "antlr4ts/TokenStream";
import { Vocabulary } from "antlr4ts/Vocabulary";
import { VocabularyImpl } from "antlr4ts/VocabularyImpl";

import * as Utils from "antlr4ts/misc/Utils";

import { mcfppdocListener } from "./mcfppdocListener";
import { mcfppdocVisitor } from "./mcfppdocVisitor";


export class mcfppdocParser extends Parser {
	public static readonly NAME = 1;
	public static readonly NEWLINE = 2;
	public static readonly SPACE = 3;
	public static readonly TEXT_CONTENT = 4;
	public static readonly AT = 5;
	public static readonly STAR = 6;
	public static readonly SLASH = 7;
	public static readonly MCFPPDOC_START = 8;
	public static readonly MCFPPDOC_END = 9;
	public static readonly INLINE_TAG_START = 10;
	public static readonly BRACE_OPEN = 11;
	public static readonly BRACE_CLOSE = 12;
	public static readonly RULE_documentation = 0;
	public static readonly RULE_documentationContent = 1;
	public static readonly RULE_skipWhitespace = 2;
	public static readonly RULE_description = 3;
	public static readonly RULE_descriptionLine = 4;
	public static readonly RULE_descriptionLineStart = 5;
	public static readonly RULE_descriptionLineNoSpaceNoAt = 6;
	public static readonly RULE_descriptionLineElement = 7;
	public static readonly RULE_descriptionLineText = 8;
	public static readonly RULE_descriptionNewline = 9;
	public static readonly RULE_tagSection = 10;
	public static readonly RULE_blockTag = 11;
	public static readonly RULE_blockTagName = 12;
	public static readonly RULE_blockTagContent = 13;
	public static readonly RULE_blockTagText = 14;
	public static readonly RULE_blockTagTextElement = 15;
	public static readonly RULE_inlineTag = 16;
	public static readonly RULE_inlineTagName = 17;
	public static readonly RULE_inlineTagContent = 18;
	public static readonly RULE_braceExpression = 19;
	public static readonly RULE_braceContent = 20;
	public static readonly RULE_braceText = 21;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"documentation", "documentationContent", "skipWhitespace", "description", 
		"descriptionLine", "descriptionLineStart", "descriptionLineNoSpaceNoAt", 
		"descriptionLineElement", "descriptionLineText", "descriptionNewline", 
		"tagSection", "blockTag", "blockTagName", "blockTagContent", "blockTagText", 
		"blockTagTextElement", "inlineTag", "inlineTagName", "inlineTagContent", 
		"braceExpression", "braceContent", "braceText",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, undefined, undefined, undefined, undefined, "'@'", "'*'", "'/'", 
		undefined, undefined, "'{@'", "'{'", "'}'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "NAME", "NEWLINE", "SPACE", "TEXT_CONTENT", "AT", "STAR", "SLASH", 
		"MCFPPDOC_START", "MCFPPDOC_END", "INLINE_TAG_START", "BRACE_OPEN", "BRACE_CLOSE",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(mcfppdocParser._LITERAL_NAMES, mcfppdocParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return mcfppdocParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "mcfppdoc.g4"; }

	// @Override
	public get ruleNames(): string[] { return mcfppdocParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return mcfppdocParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(mcfppdocParser._ATN, this);
	}
	// @RuleVersion(0)
	public documentation(): DocumentationContext {
		let _localctx: DocumentationContext = new DocumentationContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, mcfppdocParser.RULE_documentation);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 44;
			this.match(mcfppdocParser.MCFPPDOC_START);
			this.state = 48;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 0, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 45;
					this.skipWhitespace();
					}
					}
				}
				this.state = 50;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 0, this._ctx);
			}
			this.state = 51;
			this.documentationContent();
			this.state = 52;
			this.match(mcfppdocParser.MCFPPDOC_END);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public documentationContent(): DocumentationContentContext {
		let _localctx: DocumentationContentContext = new DocumentationContentContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, mcfppdocParser.RULE_documentationContent);
		let _la: number;
		try {
			let _alt: number;
			this.state = 82;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 5, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 54;
				this.description();
				this.state = 58;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppdocParser.NEWLINE || _la === mcfppdocParser.SPACE) {
					{
					{
					this.state = 55;
					this.skipWhitespace();
					}
					}
					this.state = 60;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 64;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 61;
						this.skipWhitespace();
						}
						}
					}
					this.state = 66;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 2, this._ctx);
				}
				this.state = 67;
				this.tagSection();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 68;
				this.description();
				this.state = 70;
				this._errHandler.sync(this);
				_alt = 1;
				do {
					switch (_alt) {
					case 1:
						{
						{
						this.state = 69;
						this.match(mcfppdocParser.NEWLINE);
						}
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					this.state = 72;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 3, this._ctx);
				} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
				this.state = 77;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 74;
						this.skipWhitespace();
						}
						}
					}
					this.state = 79;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 4, this._ctx);
				}
				this.state = 80;
				this.tagSection();
				}
				break;
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public skipWhitespace(): SkipWhitespaceContext {
		let _localctx: SkipWhitespaceContext = new SkipWhitespaceContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, mcfppdocParser.RULE_skipWhitespace);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 84;
			_la = this._input.LA(1);
			if (!(_la === mcfppdocParser.NEWLINE || _la === mcfppdocParser.SPACE)) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public description(): DescriptionContext {
		let _localctx: DescriptionContext = new DescriptionContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, mcfppdocParser.RULE_description);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 86;
			this.descriptionLine();
			this.state = 96;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 7, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 88;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
					do {
						{
						{
						this.state = 87;
						this.descriptionNewline();
						}
						}
						this.state = 90;
						this._errHandler.sync(this);
						_la = this._input.LA(1);
					} while (_la === mcfppdocParser.NEWLINE);
					this.state = 92;
					this.descriptionLine();
					}
					}
				}
				this.state = 98;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 7, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public descriptionLine(): DescriptionLineContext {
		let _localctx: DescriptionLineContext = new DescriptionLineContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, mcfppdocParser.RULE_descriptionLine);
		try {
			let _alt: number;
			this.state = 113;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppdocParser.NAME:
			case mcfppdocParser.SPACE:
			case mcfppdocParser.TEXT_CONTENT:
			case mcfppdocParser.STAR:
			case mcfppdocParser.SLASH:
			case mcfppdocParser.BRACE_OPEN:
			case mcfppdocParser.BRACE_CLOSE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 99;
				this.descriptionLineStart();
				this.state = 103;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 100;
						this.descriptionLineElement();
						}
						}
					}
					this.state = 105;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 8, this._ctx);
				}
				}
				break;
			case mcfppdocParser.INLINE_TAG_START:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 106;
				this.inlineTag();
				this.state = 110;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 107;
						this.descriptionLineElement();
						}
						}
					}
					this.state = 112;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 9, this._ctx);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public descriptionLineStart(): DescriptionLineStartContext {
		let _localctx: DescriptionLineStartContext = new DescriptionLineStartContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, mcfppdocParser.RULE_descriptionLineStart);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 116;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppdocParser.SPACE) {
				{
				this.state = 115;
				this.match(mcfppdocParser.SPACE);
				}
			}

			this.state = 119;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 118;
					this.descriptionLineNoSpaceNoAt();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 121;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 12, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			this.state = 128;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 14, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					this.state = 126;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case mcfppdocParser.NAME:
					case mcfppdocParser.TEXT_CONTENT:
					case mcfppdocParser.STAR:
					case mcfppdocParser.SLASH:
					case mcfppdocParser.BRACE_OPEN:
					case mcfppdocParser.BRACE_CLOSE:
						{
						this.state = 123;
						this.descriptionLineNoSpaceNoAt();
						}
						break;
					case mcfppdocParser.SPACE:
						{
						this.state = 124;
						this.match(mcfppdocParser.SPACE);
						}
						break;
					case mcfppdocParser.AT:
						{
						this.state = 125;
						this.match(mcfppdocParser.AT);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
				}
				this.state = 130;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 14, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public descriptionLineNoSpaceNoAt(): DescriptionLineNoSpaceNoAtContext {
		let _localctx: DescriptionLineNoSpaceNoAtContext = new DescriptionLineNoSpaceNoAtContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, mcfppdocParser.RULE_descriptionLineNoSpaceNoAt);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 131;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppdocParser.NAME) | (1 << mcfppdocParser.TEXT_CONTENT) | (1 << mcfppdocParser.STAR) | (1 << mcfppdocParser.SLASH) | (1 << mcfppdocParser.BRACE_OPEN) | (1 << mcfppdocParser.BRACE_CLOSE))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public descriptionLineElement(): DescriptionLineElementContext {
		let _localctx: DescriptionLineElementContext = new DescriptionLineElementContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, mcfppdocParser.RULE_descriptionLineElement);
		try {
			this.state = 135;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppdocParser.INLINE_TAG_START:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 133;
				this.inlineTag();
				}
				break;
			case mcfppdocParser.NAME:
			case mcfppdocParser.SPACE:
			case mcfppdocParser.TEXT_CONTENT:
			case mcfppdocParser.AT:
			case mcfppdocParser.STAR:
			case mcfppdocParser.SLASH:
			case mcfppdocParser.BRACE_OPEN:
			case mcfppdocParser.BRACE_CLOSE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 134;
				this.descriptionLineText();
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public descriptionLineText(): DescriptionLineTextContext {
		let _localctx: DescriptionLineTextContext = new DescriptionLineTextContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, mcfppdocParser.RULE_descriptionLineText);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 140;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					this.state = 140;
					this._errHandler.sync(this);
					switch (this._input.LA(1)) {
					case mcfppdocParser.NAME:
					case mcfppdocParser.TEXT_CONTENT:
					case mcfppdocParser.STAR:
					case mcfppdocParser.SLASH:
					case mcfppdocParser.BRACE_OPEN:
					case mcfppdocParser.BRACE_CLOSE:
						{
						this.state = 137;
						this.descriptionLineNoSpaceNoAt();
						}
						break;
					case mcfppdocParser.SPACE:
						{
						this.state = 138;
						this.match(mcfppdocParser.SPACE);
						}
						break;
					case mcfppdocParser.AT:
						{
						this.state = 139;
						this.match(mcfppdocParser.AT);
						}
						break;
					default:
						throw new NoViableAltException(this);
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 142;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 17, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public descriptionNewline(): DescriptionNewlineContext {
		let _localctx: DescriptionNewlineContext = new DescriptionNewlineContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, mcfppdocParser.RULE_descriptionNewline);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 144;
			this.match(mcfppdocParser.NEWLINE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public tagSection(): TagSectionContext {
		let _localctx: TagSectionContext = new TagSectionContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, mcfppdocParser.RULE_tagSection);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 147;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 146;
				this.blockTag();
				}
				}
				this.state = 149;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === mcfppdocParser.SPACE || _la === mcfppdocParser.AT);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public blockTag(): BlockTagContext {
		let _localctx: BlockTagContext = new BlockTagContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, mcfppdocParser.RULE_blockTag);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 152;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppdocParser.SPACE) {
				{
				this.state = 151;
				this.match(mcfppdocParser.SPACE);
				}
			}

			this.state = 154;
			this.match(mcfppdocParser.AT);
			this.state = 155;
			this.blockTagName();
			this.state = 157;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 20, this._ctx) ) {
			case 1:
				{
				this.state = 156;
				this.match(mcfppdocParser.SPACE);
				}
				break;
			}
			this.state = 162;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 21, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 159;
					this.blockTagContent();
					}
					}
				}
				this.state = 164;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 21, this._ctx);
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public blockTagName(): BlockTagNameContext {
		let _localctx: BlockTagNameContext = new BlockTagNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, mcfppdocParser.RULE_blockTagName);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 165;
			this.match(mcfppdocParser.NAME);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public blockTagContent(): BlockTagContentContext {
		let _localctx: BlockTagContentContext = new BlockTagContentContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, mcfppdocParser.RULE_blockTagContent);
		try {
			this.state = 170;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppdocParser.NAME:
			case mcfppdocParser.SPACE:
			case mcfppdocParser.TEXT_CONTENT:
			case mcfppdocParser.STAR:
			case mcfppdocParser.SLASH:
			case mcfppdocParser.BRACE_OPEN:
			case mcfppdocParser.BRACE_CLOSE:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 167;
				this.blockTagText();
				}
				break;
			case mcfppdocParser.INLINE_TAG_START:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 168;
				this.inlineTag();
				}
				break;
			case mcfppdocParser.NEWLINE:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 169;
				this.match(mcfppdocParser.NEWLINE);
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public blockTagText(): BlockTagTextContext {
		let _localctx: BlockTagTextContext = new BlockTagTextContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, mcfppdocParser.RULE_blockTagText);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 173;
			this._errHandler.sync(this);
			_alt = 1;
			do {
				switch (_alt) {
				case 1:
					{
					{
					this.state = 172;
					this.blockTagTextElement();
					}
					}
					break;
				default:
					throw new NoViableAltException(this);
				}
				this.state = 175;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 23, this._ctx);
			} while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public blockTagTextElement(): BlockTagTextElementContext {
		let _localctx: BlockTagTextElementContext = new BlockTagTextElementContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, mcfppdocParser.RULE_blockTagTextElement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 177;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppdocParser.NAME) | (1 << mcfppdocParser.SPACE) | (1 << mcfppdocParser.TEXT_CONTENT) | (1 << mcfppdocParser.STAR) | (1 << mcfppdocParser.SLASH) | (1 << mcfppdocParser.BRACE_OPEN) | (1 << mcfppdocParser.BRACE_CLOSE))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public inlineTag(): InlineTagContext {
		let _localctx: InlineTagContext = new InlineTagContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, mcfppdocParser.RULE_inlineTag);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 179;
			this.match(mcfppdocParser.INLINE_TAG_START);
			this.state = 180;
			this.inlineTagName();
			this.state = 184;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 24, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 181;
					this.match(mcfppdocParser.SPACE);
					}
					}
				}
				this.state = 186;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 24, this._ctx);
			}
			this.state = 188;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppdocParser.NAME) | (1 << mcfppdocParser.NEWLINE) | (1 << mcfppdocParser.SPACE) | (1 << mcfppdocParser.TEXT_CONTENT) | (1 << mcfppdocParser.STAR) | (1 << mcfppdocParser.SLASH) | (1 << mcfppdocParser.BRACE_OPEN))) !== 0)) {
				{
				this.state = 187;
				this.inlineTagContent();
				}
			}

			this.state = 190;
			this.match(mcfppdocParser.BRACE_CLOSE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public inlineTagName(): InlineTagNameContext {
		let _localctx: InlineTagNameContext = new InlineTagNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, mcfppdocParser.RULE_inlineTagName);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 192;
			this.match(mcfppdocParser.NAME);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public inlineTagContent(): InlineTagContentContext {
		let _localctx: InlineTagContentContext = new InlineTagContentContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, mcfppdocParser.RULE_inlineTagContent);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 195;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 194;
				this.braceContent();
				}
				}
				this.state = 197;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppdocParser.NAME) | (1 << mcfppdocParser.NEWLINE) | (1 << mcfppdocParser.SPACE) | (1 << mcfppdocParser.TEXT_CONTENT) | (1 << mcfppdocParser.STAR) | (1 << mcfppdocParser.SLASH) | (1 << mcfppdocParser.BRACE_OPEN))) !== 0));
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public braceExpression(): BraceExpressionContext {
		let _localctx: BraceExpressionContext = new BraceExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, mcfppdocParser.RULE_braceExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 199;
			this.match(mcfppdocParser.BRACE_OPEN);
			this.state = 203;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppdocParser.NAME) | (1 << mcfppdocParser.NEWLINE) | (1 << mcfppdocParser.SPACE) | (1 << mcfppdocParser.TEXT_CONTENT) | (1 << mcfppdocParser.STAR) | (1 << mcfppdocParser.SLASH) | (1 << mcfppdocParser.BRACE_OPEN))) !== 0)) {
				{
				{
				this.state = 200;
				this.braceContent();
				}
				}
				this.state = 205;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 206;
			this.match(mcfppdocParser.BRACE_CLOSE);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public braceContent(): BraceContentContext {
		let _localctx: BraceContentContext = new BraceContentContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, mcfppdocParser.RULE_braceContent);
		try {
			let _alt: number;
			this.state = 222;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppdocParser.BRACE_OPEN:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 208;
				this.braceExpression();
				}
				break;
			case mcfppdocParser.NAME:
			case mcfppdocParser.NEWLINE:
			case mcfppdocParser.SPACE:
			case mcfppdocParser.TEXT_CONTENT:
			case mcfppdocParser.STAR:
			case mcfppdocParser.SLASH:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 209;
				this.braceText();
				this.state = 219;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 29, this._ctx);
				while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
					if (_alt === 1) {
						{
						{
						this.state = 213;
						this._errHandler.sync(this);
						_alt = this.interpreter.adaptivePredict(this._input, 28, this._ctx);
						while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
							if (_alt === 1) {
								{
								{
								this.state = 210;
								this.match(mcfppdocParser.NEWLINE);
								}
								}
							}
							this.state = 215;
							this._errHandler.sync(this);
							_alt = this.interpreter.adaptivePredict(this._input, 28, this._ctx);
						}
						this.state = 216;
						this.braceText();
						}
						}
					}
					this.state = 221;
					this._errHandler.sync(this);
					_alt = this.interpreter.adaptivePredict(this._input, 29, this._ctx);
				}
				}
				break;
			default:
				throw new NoViableAltException(this);
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}
	// @RuleVersion(0)
	public braceText(): BraceTextContext {
		let _localctx: BraceTextContext = new BraceTextContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, mcfppdocParser.RULE_braceText);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 224;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppdocParser.NAME) | (1 << mcfppdocParser.NEWLINE) | (1 << mcfppdocParser.SPACE) | (1 << mcfppdocParser.TEXT_CONTENT) | (1 << mcfppdocParser.STAR) | (1 << mcfppdocParser.SLASH))) !== 0))) {
			this._errHandler.recoverInline(this);
			} else {
				if (this._input.LA(1) === Token.EOF) {
					this.matchedEOF = true;
				}

				this._errHandler.reportMatch(this);
				this.consume();
			}
			}
		}
		catch (re) {
			if (re instanceof RecognitionException) {
				_localctx.exception = re;
				this._errHandler.reportError(this, re);
				this._errHandler.recover(this, re);
			} else {
				throw re;
			}
		}
		finally {
			this.exitRule();
		}
		return _localctx;
	}

	public static readonly _serializedATN: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\x0E\xE5\x04\x02" +
		"\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04\x07" +
		"\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r\x04" +
		"\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12\x04" +
		"\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17\x03" +
		"\x02\x03\x02\x07\x021\n\x02\f\x02\x0E\x024\v\x02\x03\x02\x03\x02\x03\x02" +
		"\x03\x03\x03\x03\x07\x03;\n\x03\f\x03\x0E\x03>\v\x03\x03\x03\x07\x03A" +
		"\n\x03\f\x03\x0E\x03D\v\x03\x03\x03\x03\x03\x03\x03\x06\x03I\n\x03\r\x03" +
		"\x0E\x03J\x03\x03\x07\x03N\n\x03\f\x03\x0E\x03Q\v\x03\x03\x03\x03\x03" +
		"\x05\x03U\n\x03\x03\x04\x03\x04\x03\x05\x03\x05\x06\x05[\n\x05\r\x05\x0E" +
		"\x05\\\x03\x05\x03\x05\x07\x05a\n\x05\f\x05\x0E\x05d\v\x05\x03\x06\x03" +
		"\x06\x07\x06h\n\x06\f\x06\x0E\x06k\v\x06\x03\x06\x03\x06\x07\x06o\n\x06" +
		"\f\x06\x0E\x06r\v\x06\x05\x06t\n\x06\x03\x07\x05\x07w\n\x07\x03\x07\x06" +
		"\x07z\n\x07\r\x07\x0E\x07{\x03\x07\x03\x07\x03\x07\x07\x07\x81\n\x07\f" +
		"\x07\x0E\x07\x84\v\x07\x03\b\x03\b\x03\t\x03\t\x05\t\x8A\n\t\x03\n\x03" +
		"\n\x03\n\x06\n\x8F\n\n\r\n\x0E\n\x90\x03\v\x03\v\x03\f\x06\f\x96\n\f\r" +
		"\f\x0E\f\x97\x03\r\x05\r\x9B\n\r\x03\r\x03\r\x03\r\x05\r\xA0\n\r\x03\r" +
		"\x07\r\xA3\n\r\f\r\x0E\r\xA6\v\r\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x0F" +
		"\x05\x0F\xAD\n\x0F\x03\x10\x06\x10\xB0\n\x10\r\x10\x0E\x10\xB1\x03\x11" +
		"\x03\x11\x03\x12\x03\x12\x03\x12\x07\x12\xB9\n\x12\f\x12\x0E\x12\xBC\v" +
		"\x12\x03\x12\x05\x12\xBF\n\x12\x03\x12\x03\x12\x03\x13\x03\x13\x03\x14" +
		"\x06\x14\xC6\n\x14\r\x14\x0E\x14\xC7\x03\x15\x03\x15\x07\x15\xCC\n\x15" +
		"\f\x15\x0E\x15\xCF\v\x15\x03\x15\x03\x15\x03\x16\x03\x16\x03\x16\x07\x16" +
		"\xD6\n\x16\f\x16\x0E\x16\xD9\v\x16\x03\x16\x07\x16\xDC\n\x16\f\x16\x0E" +
		"\x16\xDF\v\x16\x05\x16\xE1\n\x16\x03\x17\x03\x17\x03\x17\x02\x02\x02\x18" +
		"\x02\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14" +
		"\x02\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&\x02(\x02" +
		"*\x02,\x02\x02\x06\x03\x02\x04\x05\x06\x02\x03\x03\x06\x06\b\t\r\x0E\x06" +
		"\x02\x03\x03\x05\x06\b\t\r\x0E\x04\x02\x03\x06\b\t\x02\xF1\x02.\x03\x02" +
		"\x02\x02\x04T\x03\x02\x02\x02\x06V\x03\x02\x02\x02\bX\x03\x02\x02\x02" +
		"\ns\x03\x02\x02\x02\fv\x03\x02\x02\x02\x0E\x85\x03\x02\x02\x02\x10\x89" +
		"\x03\x02\x02\x02\x12\x8E\x03\x02\x02\x02\x14\x92\x03\x02\x02\x02\x16\x95" +
		"\x03\x02\x02\x02\x18\x9A\x03\x02\x02\x02\x1A\xA7\x03\x02\x02\x02\x1C\xAC" +
		"\x03\x02\x02\x02\x1E\xAF\x03\x02\x02\x02 \xB3\x03\x02\x02\x02\"\xB5\x03" +
		"\x02\x02\x02$\xC2\x03\x02\x02\x02&\xC5\x03\x02\x02\x02(\xC9\x03\x02\x02" +
		"\x02*\xE0\x03\x02\x02\x02,\xE2\x03\x02\x02\x02.2\x07\n\x02\x02/1\x05\x06" +
		"\x04\x020/\x03\x02\x02\x0214\x03\x02\x02\x0220\x03\x02\x02\x0223\x03\x02" +
		"\x02\x0235\x03\x02\x02\x0242\x03\x02\x02\x0256\x05\x04\x03\x0267\x07\v" +
		"\x02\x027\x03\x03\x02\x02\x028<\x05\b\x05\x029;\x05\x06\x04\x02:9\x03" +
		"\x02\x02\x02;>\x03\x02\x02\x02<:\x03\x02\x02\x02<=\x03\x02\x02\x02=U\x03" +
		"\x02\x02\x02><\x03\x02\x02\x02?A\x05\x06\x04\x02@?\x03\x02\x02\x02AD\x03" +
		"\x02\x02\x02B@\x03\x02\x02\x02BC\x03\x02\x02\x02CE\x03\x02\x02\x02DB\x03" +
		"\x02\x02\x02EU\x05\x16\f\x02FH\x05\b\x05\x02GI\x07\x04\x02\x02HG\x03\x02" +
		"\x02\x02IJ\x03\x02\x02\x02JH\x03\x02\x02\x02JK\x03\x02\x02\x02KO\x03\x02" +
		"\x02\x02LN\x05\x06\x04\x02ML\x03\x02\x02\x02NQ\x03\x02\x02\x02OM\x03\x02" +
		"\x02\x02OP\x03\x02\x02\x02PR\x03\x02\x02\x02QO\x03\x02\x02\x02RS\x05\x16" +
		"\f\x02SU\x03\x02\x02\x02T8\x03\x02\x02\x02TB\x03\x02\x02\x02TF\x03\x02" +
		"\x02\x02U\x05\x03\x02\x02\x02VW\t\x02\x02\x02W\x07\x03\x02\x02\x02Xb\x05" +
		"\n\x06\x02Y[\x05\x14\v\x02ZY\x03\x02\x02\x02[\\\x03\x02\x02\x02\\Z\x03" +
		"\x02\x02\x02\\]\x03\x02\x02\x02]^\x03\x02\x02\x02^_\x05\n\x06\x02_a\x03" +
		"\x02\x02\x02`Z\x03\x02\x02\x02ad\x03\x02\x02\x02b`\x03\x02\x02\x02bc\x03" +
		"\x02\x02\x02c\t\x03\x02\x02\x02db\x03\x02\x02\x02ei\x05\f\x07\x02fh\x05" +
		"\x10\t\x02gf\x03\x02\x02\x02hk\x03\x02\x02\x02ig\x03\x02\x02\x02ij\x03" +
		"\x02\x02\x02jt\x03\x02\x02\x02ki\x03\x02\x02\x02lp\x05\"\x12\x02mo\x05" +
		"\x10\t\x02nm\x03\x02\x02\x02or\x03\x02\x02\x02pn\x03\x02\x02\x02pq\x03" +
		"\x02\x02\x02qt\x03\x02\x02\x02rp\x03\x02\x02\x02se\x03\x02\x02\x02sl\x03" +
		"\x02\x02\x02t\v\x03\x02\x02\x02uw\x07\x05\x02\x02vu\x03\x02\x02\x02vw" +
		"\x03\x02\x02\x02wy\x03\x02\x02\x02xz\x05\x0E\b\x02yx\x03\x02\x02\x02z" +
		"{\x03\x02\x02\x02{y\x03\x02\x02\x02{|\x03\x02\x02\x02|\x82\x03\x02\x02" +
		"\x02}\x81\x05\x0E\b\x02~\x81\x07\x05\x02\x02\x7F\x81\x07\x07\x02\x02\x80" +
		"}\x03\x02\x02\x02\x80~\x03\x02\x02\x02\x80\x7F\x03\x02\x02\x02\x81\x84" +
		"\x03\x02\x02\x02\x82\x80\x03\x02\x02\x02\x82\x83\x03\x02\x02\x02\x83\r" +
		"\x03\x02\x02\x02\x84\x82\x03\x02\x02\x02\x85\x86\t\x03\x02\x02\x86\x0F" +
		"\x03\x02\x02\x02\x87\x8A\x05\"\x12\x02\x88\x8A\x05\x12\n\x02\x89\x87\x03" +
		"\x02\x02\x02\x89\x88\x03\x02\x02\x02\x8A\x11\x03\x02\x02\x02\x8B\x8F\x05" +
		"\x0E\b\x02\x8C\x8F\x07\x05\x02\x02\x8D\x8F\x07\x07\x02\x02\x8E\x8B\x03" +
		"\x02\x02\x02\x8E\x8C\x03\x02\x02\x02\x8E\x8D\x03\x02\x02\x02\x8F\x90\x03" +
		"\x02\x02\x02\x90\x8E\x03\x02\x02\x02\x90\x91\x03\x02\x02\x02\x91\x13\x03" +
		"\x02\x02\x02\x92\x93\x07\x04\x02\x02\x93\x15\x03\x02\x02\x02\x94\x96\x05" +
		"\x18\r\x02\x95\x94\x03\x02\x02\x02\x96\x97\x03\x02\x02\x02\x97\x95\x03" +
		"\x02\x02\x02\x97\x98\x03\x02\x02\x02\x98\x17\x03\x02\x02\x02\x99\x9B\x07" +
		"\x05\x02\x02\x9A\x99\x03\x02\x02\x02\x9A\x9B\x03\x02\x02\x02\x9B\x9C\x03" +
		"\x02\x02\x02\x9C\x9D\x07\x07\x02\x02\x9D\x9F\x05\x1A\x0E\x02\x9E\xA0\x07" +
		"\x05\x02\x02\x9F\x9E\x03\x02\x02\x02\x9F\xA0\x03\x02\x02\x02\xA0\xA4\x03" +
		"\x02\x02\x02\xA1\xA3\x05\x1C\x0F\x02\xA2\xA1\x03\x02\x02\x02\xA3\xA6\x03" +
		"\x02\x02\x02\xA4\xA2\x03\x02\x02\x02\xA4\xA5\x03\x02\x02\x02\xA5\x19\x03" +
		"\x02\x02\x02\xA6\xA4\x03\x02\x02\x02\xA7\xA8\x07\x03\x02\x02\xA8\x1B\x03" +
		"\x02\x02\x02\xA9\xAD\x05\x1E\x10\x02\xAA\xAD\x05\"\x12\x02\xAB\xAD\x07" +
		"\x04\x02\x02\xAC\xA9\x03\x02\x02\x02\xAC\xAA\x03\x02\x02\x02\xAC\xAB\x03" +
		"\x02\x02\x02\xAD\x1D\x03\x02\x02\x02\xAE\xB0\x05 \x11\x02\xAF\xAE\x03" +
		"\x02\x02\x02\xB0\xB1\x03\x02\x02\x02\xB1\xAF\x03\x02\x02\x02\xB1\xB2\x03" +
		"\x02\x02\x02\xB2\x1F\x03\x02\x02\x02\xB3\xB4\t\x04\x02\x02\xB4!\x03\x02" +
		"\x02\x02\xB5\xB6\x07\f\x02\x02\xB6\xBA\x05$\x13\x02\xB7\xB9\x07\x05\x02" +
		"\x02\xB8\xB7\x03\x02\x02\x02\xB9\xBC\x03\x02\x02\x02\xBA\xB8\x03\x02\x02" +
		"\x02\xBA\xBB\x03\x02\x02\x02\xBB\xBE\x03\x02\x02\x02\xBC\xBA\x03\x02\x02" +
		"\x02\xBD\xBF\x05&\x14\x02\xBE\xBD\x03\x02\x02\x02\xBE\xBF\x03\x02\x02" +
		"\x02\xBF\xC0\x03\x02\x02\x02\xC0\xC1\x07\x0E\x02\x02\xC1#\x03\x02\x02" +
		"\x02\xC2\xC3\x07\x03\x02\x02\xC3%\x03\x02\x02\x02\xC4\xC6\x05*\x16\x02" +
		"\xC5\xC4\x03\x02\x02\x02\xC6\xC7\x03\x02\x02\x02\xC7\xC5\x03\x02\x02\x02" +
		"\xC7\xC8\x03\x02\x02\x02\xC8\'\x03\x02\x02\x02\xC9\xCD\x07\r\x02\x02\xCA" +
		"\xCC\x05*\x16\x02\xCB\xCA\x03\x02\x02\x02\xCC\xCF\x03\x02\x02\x02\xCD" +
		"\xCB\x03\x02\x02\x02\xCD\xCE\x03\x02\x02\x02\xCE\xD0\x03\x02\x02\x02\xCF" +
		"\xCD\x03\x02\x02\x02\xD0\xD1\x07\x0E\x02\x02\xD1)\x03\x02\x02\x02\xD2" +
		"\xE1\x05(\x15\x02\xD3\xDD\x05,\x17\x02\xD4\xD6\x07\x04\x02\x02\xD5\xD4" +
		"\x03\x02\x02\x02\xD6\xD9\x03\x02\x02\x02\xD7\xD5\x03\x02\x02\x02\xD7\xD8" +
		"\x03\x02\x02\x02\xD8\xDA\x03\x02\x02\x02\xD9\xD7\x03\x02\x02\x02\xDA\xDC" +
		"\x05,\x17\x02\xDB\xD7\x03\x02\x02\x02\xDC\xDF\x03\x02\x02\x02\xDD\xDB" +
		"\x03\x02\x02\x02\xDD\xDE\x03\x02\x02\x02\xDE\xE1\x03\x02\x02\x02\xDF\xDD" +
		"\x03\x02\x02\x02\xE0\xD2\x03\x02\x02\x02\xE0\xD3\x03\x02\x02\x02\xE1+" +
		"\x03\x02\x02\x02\xE2\xE3\t\x05\x02\x02\xE3-\x03\x02\x02\x02!2<BJOT\\b" +
		"ipsv{\x80\x82\x89\x8E\x90\x97\x9A\x9F\xA4\xAC\xB1\xBA\xBE\xC7\xCD\xD7" +
		"\xDD\xE0";
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!mcfppdocParser.__ATN) {
			mcfppdocParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(mcfppdocParser._serializedATN));
		}

		return mcfppdocParser.__ATN;
	}

}

export class DocumentationContext extends ParserRuleContext {
	public MCFPPDOC_START(): TerminalNode { return this.getToken(mcfppdocParser.MCFPPDOC_START, 0); }
	public documentationContent(): DocumentationContentContext {
		return this.getRuleContext(0, DocumentationContentContext);
	}
	public MCFPPDOC_END(): TerminalNode { return this.getToken(mcfppdocParser.MCFPPDOC_END, 0); }
	public skipWhitespace(): SkipWhitespaceContext[];
	public skipWhitespace(i: number): SkipWhitespaceContext;
	public skipWhitespace(i?: number): SkipWhitespaceContext | SkipWhitespaceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SkipWhitespaceContext);
		} else {
			return this.getRuleContext(i, SkipWhitespaceContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_documentation; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterDocumentation) {
			listener.enterDocumentation(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitDocumentation) {
			listener.exitDocumentation(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitDocumentation) {
			return visitor.visitDocumentation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DocumentationContentContext extends ParserRuleContext {
	public description(): DescriptionContext | undefined {
		return this.tryGetRuleContext(0, DescriptionContext);
	}
	public skipWhitespace(): SkipWhitespaceContext[];
	public skipWhitespace(i: number): SkipWhitespaceContext;
	public skipWhitespace(i?: number): SkipWhitespaceContext | SkipWhitespaceContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SkipWhitespaceContext);
		} else {
			return this.getRuleContext(i, SkipWhitespaceContext);
		}
	}
	public tagSection(): TagSectionContext | undefined {
		return this.tryGetRuleContext(0, TagSectionContext);
	}
	public NEWLINE(): TerminalNode[];
	public NEWLINE(i: number): TerminalNode;
	public NEWLINE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppdocParser.NEWLINE);
		} else {
			return this.getToken(mcfppdocParser.NEWLINE, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_documentationContent; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterDocumentationContent) {
			listener.enterDocumentationContent(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitDocumentationContent) {
			listener.exitDocumentationContent(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitDocumentationContent) {
			return visitor.visitDocumentationContent(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SkipWhitespaceContext extends ParserRuleContext {
	public SPACE(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.SPACE, 0); }
	public NEWLINE(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.NEWLINE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_skipWhitespace; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterSkipWhitespace) {
			listener.enterSkipWhitespace(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitSkipWhitespace) {
			listener.exitSkipWhitespace(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitSkipWhitespace) {
			return visitor.visitSkipWhitespace(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DescriptionContext extends ParserRuleContext {
	public descriptionLine(): DescriptionLineContext[];
	public descriptionLine(i: number): DescriptionLineContext;
	public descriptionLine(i?: number): DescriptionLineContext | DescriptionLineContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DescriptionLineContext);
		} else {
			return this.getRuleContext(i, DescriptionLineContext);
		}
	}
	public descriptionNewline(): DescriptionNewlineContext[];
	public descriptionNewline(i: number): DescriptionNewlineContext;
	public descriptionNewline(i?: number): DescriptionNewlineContext | DescriptionNewlineContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DescriptionNewlineContext);
		} else {
			return this.getRuleContext(i, DescriptionNewlineContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_description; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterDescription) {
			listener.enterDescription(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitDescription) {
			listener.exitDescription(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitDescription) {
			return visitor.visitDescription(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DescriptionLineContext extends ParserRuleContext {
	public descriptionLineStart(): DescriptionLineStartContext | undefined {
		return this.tryGetRuleContext(0, DescriptionLineStartContext);
	}
	public descriptionLineElement(): DescriptionLineElementContext[];
	public descriptionLineElement(i: number): DescriptionLineElementContext;
	public descriptionLineElement(i?: number): DescriptionLineElementContext | DescriptionLineElementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DescriptionLineElementContext);
		} else {
			return this.getRuleContext(i, DescriptionLineElementContext);
		}
	}
	public inlineTag(): InlineTagContext | undefined {
		return this.tryGetRuleContext(0, InlineTagContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_descriptionLine; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterDescriptionLine) {
			listener.enterDescriptionLine(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitDescriptionLine) {
			listener.exitDescriptionLine(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitDescriptionLine) {
			return visitor.visitDescriptionLine(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DescriptionLineStartContext extends ParserRuleContext {
	public SPACE(): TerminalNode[];
	public SPACE(i: number): TerminalNode;
	public SPACE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppdocParser.SPACE);
		} else {
			return this.getToken(mcfppdocParser.SPACE, i);
		}
	}
	public descriptionLineNoSpaceNoAt(): DescriptionLineNoSpaceNoAtContext[];
	public descriptionLineNoSpaceNoAt(i: number): DescriptionLineNoSpaceNoAtContext;
	public descriptionLineNoSpaceNoAt(i?: number): DescriptionLineNoSpaceNoAtContext | DescriptionLineNoSpaceNoAtContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DescriptionLineNoSpaceNoAtContext);
		} else {
			return this.getRuleContext(i, DescriptionLineNoSpaceNoAtContext);
		}
	}
	public AT(): TerminalNode[];
	public AT(i: number): TerminalNode;
	public AT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppdocParser.AT);
		} else {
			return this.getToken(mcfppdocParser.AT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_descriptionLineStart; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterDescriptionLineStart) {
			listener.enterDescriptionLineStart(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitDescriptionLineStart) {
			listener.exitDescriptionLineStart(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitDescriptionLineStart) {
			return visitor.visitDescriptionLineStart(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DescriptionLineNoSpaceNoAtContext extends ParserRuleContext {
	public TEXT_CONTENT(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.TEXT_CONTENT, 0); }
	public NAME(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.NAME, 0); }
	public STAR(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.STAR, 0); }
	public SLASH(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.SLASH, 0); }
	public BRACE_OPEN(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.BRACE_OPEN, 0); }
	public BRACE_CLOSE(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.BRACE_CLOSE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_descriptionLineNoSpaceNoAt; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterDescriptionLineNoSpaceNoAt) {
			listener.enterDescriptionLineNoSpaceNoAt(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitDescriptionLineNoSpaceNoAt) {
			listener.exitDescriptionLineNoSpaceNoAt(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitDescriptionLineNoSpaceNoAt) {
			return visitor.visitDescriptionLineNoSpaceNoAt(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DescriptionLineElementContext extends ParserRuleContext {
	public inlineTag(): InlineTagContext | undefined {
		return this.tryGetRuleContext(0, InlineTagContext);
	}
	public descriptionLineText(): DescriptionLineTextContext | undefined {
		return this.tryGetRuleContext(0, DescriptionLineTextContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_descriptionLineElement; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterDescriptionLineElement) {
			listener.enterDescriptionLineElement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitDescriptionLineElement) {
			listener.exitDescriptionLineElement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitDescriptionLineElement) {
			return visitor.visitDescriptionLineElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DescriptionLineTextContext extends ParserRuleContext {
	public descriptionLineNoSpaceNoAt(): DescriptionLineNoSpaceNoAtContext[];
	public descriptionLineNoSpaceNoAt(i: number): DescriptionLineNoSpaceNoAtContext;
	public descriptionLineNoSpaceNoAt(i?: number): DescriptionLineNoSpaceNoAtContext | DescriptionLineNoSpaceNoAtContext[] {
		if (i === undefined) {
			return this.getRuleContexts(DescriptionLineNoSpaceNoAtContext);
		} else {
			return this.getRuleContext(i, DescriptionLineNoSpaceNoAtContext);
		}
	}
	public SPACE(): TerminalNode[];
	public SPACE(i: number): TerminalNode;
	public SPACE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppdocParser.SPACE);
		} else {
			return this.getToken(mcfppdocParser.SPACE, i);
		}
	}
	public AT(): TerminalNode[];
	public AT(i: number): TerminalNode;
	public AT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppdocParser.AT);
		} else {
			return this.getToken(mcfppdocParser.AT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_descriptionLineText; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterDescriptionLineText) {
			listener.enterDescriptionLineText(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitDescriptionLineText) {
			listener.exitDescriptionLineText(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitDescriptionLineText) {
			return visitor.visitDescriptionLineText(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DescriptionNewlineContext extends ParserRuleContext {
	public NEWLINE(): TerminalNode { return this.getToken(mcfppdocParser.NEWLINE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_descriptionNewline; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterDescriptionNewline) {
			listener.enterDescriptionNewline(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitDescriptionNewline) {
			listener.exitDescriptionNewline(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitDescriptionNewline) {
			return visitor.visitDescriptionNewline(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TagSectionContext extends ParserRuleContext {
	public blockTag(): BlockTagContext[];
	public blockTag(i: number): BlockTagContext;
	public blockTag(i?: number): BlockTagContext | BlockTagContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BlockTagContext);
		} else {
			return this.getRuleContext(i, BlockTagContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_tagSection; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterTagSection) {
			listener.enterTagSection(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitTagSection) {
			listener.exitTagSection(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitTagSection) {
			return visitor.visitTagSection(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockTagContext extends ParserRuleContext {
	public AT(): TerminalNode { return this.getToken(mcfppdocParser.AT, 0); }
	public blockTagName(): BlockTagNameContext {
		return this.getRuleContext(0, BlockTagNameContext);
	}
	public SPACE(): TerminalNode[];
	public SPACE(i: number): TerminalNode;
	public SPACE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppdocParser.SPACE);
		} else {
			return this.getToken(mcfppdocParser.SPACE, i);
		}
	}
	public blockTagContent(): BlockTagContentContext[];
	public blockTagContent(i: number): BlockTagContentContext;
	public blockTagContent(i?: number): BlockTagContentContext | BlockTagContentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BlockTagContentContext);
		} else {
			return this.getRuleContext(i, BlockTagContentContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_blockTag; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterBlockTag) {
			listener.enterBlockTag(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitBlockTag) {
			listener.exitBlockTag(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitBlockTag) {
			return visitor.visitBlockTag(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockTagNameContext extends ParserRuleContext {
	public NAME(): TerminalNode { return this.getToken(mcfppdocParser.NAME, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_blockTagName; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterBlockTagName) {
			listener.enterBlockTagName(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitBlockTagName) {
			listener.exitBlockTagName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitBlockTagName) {
			return visitor.visitBlockTagName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockTagContentContext extends ParserRuleContext {
	public blockTagText(): BlockTagTextContext | undefined {
		return this.tryGetRuleContext(0, BlockTagTextContext);
	}
	public inlineTag(): InlineTagContext | undefined {
		return this.tryGetRuleContext(0, InlineTagContext);
	}
	public NEWLINE(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.NEWLINE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_blockTagContent; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterBlockTagContent) {
			listener.enterBlockTagContent(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitBlockTagContent) {
			listener.exitBlockTagContent(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitBlockTagContent) {
			return visitor.visitBlockTagContent(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockTagTextContext extends ParserRuleContext {
	public blockTagTextElement(): BlockTagTextElementContext[];
	public blockTagTextElement(i: number): BlockTagTextElementContext;
	public blockTagTextElement(i?: number): BlockTagTextElementContext | BlockTagTextElementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BlockTagTextElementContext);
		} else {
			return this.getRuleContext(i, BlockTagTextElementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_blockTagText; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterBlockTagText) {
			listener.enterBlockTagText(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitBlockTagText) {
			listener.exitBlockTagText(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitBlockTagText) {
			return visitor.visitBlockTagText(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockTagTextElementContext extends ParserRuleContext {
	public TEXT_CONTENT(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.TEXT_CONTENT, 0); }
	public NAME(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.NAME, 0); }
	public SPACE(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.SPACE, 0); }
	public STAR(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.STAR, 0); }
	public SLASH(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.SLASH, 0); }
	public BRACE_OPEN(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.BRACE_OPEN, 0); }
	public BRACE_CLOSE(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.BRACE_CLOSE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_blockTagTextElement; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterBlockTagTextElement) {
			listener.enterBlockTagTextElement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitBlockTagTextElement) {
			listener.exitBlockTagTextElement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitBlockTagTextElement) {
			return visitor.visitBlockTagTextElement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InlineTagContext extends ParserRuleContext {
	public INLINE_TAG_START(): TerminalNode { return this.getToken(mcfppdocParser.INLINE_TAG_START, 0); }
	public inlineTagName(): InlineTagNameContext {
		return this.getRuleContext(0, InlineTagNameContext);
	}
	public BRACE_CLOSE(): TerminalNode { return this.getToken(mcfppdocParser.BRACE_CLOSE, 0); }
	public SPACE(): TerminalNode[];
	public SPACE(i: number): TerminalNode;
	public SPACE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppdocParser.SPACE);
		} else {
			return this.getToken(mcfppdocParser.SPACE, i);
		}
	}
	public inlineTagContent(): InlineTagContentContext | undefined {
		return this.tryGetRuleContext(0, InlineTagContentContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_inlineTag; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterInlineTag) {
			listener.enterInlineTag(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitInlineTag) {
			listener.exitInlineTag(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitInlineTag) {
			return visitor.visitInlineTag(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InlineTagNameContext extends ParserRuleContext {
	public NAME(): TerminalNode { return this.getToken(mcfppdocParser.NAME, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_inlineTagName; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterInlineTagName) {
			listener.enterInlineTagName(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitInlineTagName) {
			listener.exitInlineTagName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitInlineTagName) {
			return visitor.visitInlineTagName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InlineTagContentContext extends ParserRuleContext {
	public braceContent(): BraceContentContext[];
	public braceContent(i: number): BraceContentContext;
	public braceContent(i?: number): BraceContentContext | BraceContentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BraceContentContext);
		} else {
			return this.getRuleContext(i, BraceContentContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_inlineTagContent; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterInlineTagContent) {
			listener.enterInlineTagContent(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitInlineTagContent) {
			listener.exitInlineTagContent(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitInlineTagContent) {
			return visitor.visitInlineTagContent(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BraceExpressionContext extends ParserRuleContext {
	public BRACE_OPEN(): TerminalNode { return this.getToken(mcfppdocParser.BRACE_OPEN, 0); }
	public BRACE_CLOSE(): TerminalNode { return this.getToken(mcfppdocParser.BRACE_CLOSE, 0); }
	public braceContent(): BraceContentContext[];
	public braceContent(i: number): BraceContentContext;
	public braceContent(i?: number): BraceContentContext | BraceContentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BraceContentContext);
		} else {
			return this.getRuleContext(i, BraceContentContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_braceExpression; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterBraceExpression) {
			listener.enterBraceExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitBraceExpression) {
			listener.exitBraceExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitBraceExpression) {
			return visitor.visitBraceExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BraceContentContext extends ParserRuleContext {
	public braceExpression(): BraceExpressionContext | undefined {
		return this.tryGetRuleContext(0, BraceExpressionContext);
	}
	public braceText(): BraceTextContext[];
	public braceText(i: number): BraceTextContext;
	public braceText(i?: number): BraceTextContext | BraceTextContext[] {
		if (i === undefined) {
			return this.getRuleContexts(BraceTextContext);
		} else {
			return this.getRuleContext(i, BraceTextContext);
		}
	}
	public NEWLINE(): TerminalNode[];
	public NEWLINE(i: number): TerminalNode;
	public NEWLINE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppdocParser.NEWLINE);
		} else {
			return this.getToken(mcfppdocParser.NEWLINE, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_braceContent; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterBraceContent) {
			listener.enterBraceContent(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitBraceContent) {
			listener.exitBraceContent(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitBraceContent) {
			return visitor.visitBraceContent(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BraceTextContext extends ParserRuleContext {
	public TEXT_CONTENT(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.TEXT_CONTENT, 0); }
	public NAME(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.NAME, 0); }
	public SPACE(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.SPACE, 0); }
	public STAR(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.STAR, 0); }
	public SLASH(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.SLASH, 0); }
	public NEWLINE(): TerminalNode | undefined { return this.tryGetToken(mcfppdocParser.NEWLINE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppdocParser.RULE_braceText; }
	// @Override
	public enterRule(listener: mcfppdocListener): void {
		if (listener.enterBraceText) {
			listener.enterBraceText(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppdocListener): void {
		if (listener.exitBraceText) {
			listener.exitBraceText(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppdocVisitor<Result>): Result {
		if (visitor.visitBraceText) {
			return visitor.visitBraceText(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


