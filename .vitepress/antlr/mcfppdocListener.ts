// Generated from .vitepress\antlr\mcfppdoc.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

import { DocumentationContext } from "./mcfppdocParser";
import { DocumentationContentContext } from "./mcfppdocParser";
import { SkipWhitespaceContext } from "./mcfppdocParser";
import { DescriptionContext } from "./mcfppdocParser";
import { DescriptionLineContext } from "./mcfppdocParser";
import { DescriptionLineStartContext } from "./mcfppdocParser";
import { DescriptionLineNoSpaceNoAtContext } from "./mcfppdocParser";
import { DescriptionLineElementContext } from "./mcfppdocParser";
import { DescriptionLineTextContext } from "./mcfppdocParser";
import { DescriptionNewlineContext } from "./mcfppdocParser";
import { TagSectionContext } from "./mcfppdocParser";
import { BlockTagContext } from "./mcfppdocParser";
import { BlockTagNameContext } from "./mcfppdocParser";
import { BlockTagContentContext } from "./mcfppdocParser";
import { BlockTagTextContext } from "./mcfppdocParser";
import { BlockTagTextElementContext } from "./mcfppdocParser";
import { InlineTagContext } from "./mcfppdocParser";
import { InlineTagNameContext } from "./mcfppdocParser";
import { InlineTagContentContext } from "./mcfppdocParser";
import { BraceExpressionContext } from "./mcfppdocParser";
import { BraceContentContext } from "./mcfppdocParser";
import { BraceTextContext } from "./mcfppdocParser";


/**
 * This interface defines a complete listener for a parse tree produced by
 * `mcfppdocParser`.
 */
export interface mcfppdocListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `mcfppdocParser.documentation`.
	 * @param ctx the parse tree
	 */
	enterDocumentation?: (ctx: DocumentationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.documentation`.
	 * @param ctx the parse tree
	 */
	exitDocumentation?: (ctx: DocumentationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.documentationContent`.
	 * @param ctx the parse tree
	 */
	enterDocumentationContent?: (ctx: DocumentationContentContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.documentationContent`.
	 * @param ctx the parse tree
	 */
	exitDocumentationContent?: (ctx: DocumentationContentContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.skipWhitespace`.
	 * @param ctx the parse tree
	 */
	enterSkipWhitespace?: (ctx: SkipWhitespaceContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.skipWhitespace`.
	 * @param ctx the parse tree
	 */
	exitSkipWhitespace?: (ctx: SkipWhitespaceContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.description`.
	 * @param ctx the parse tree
	 */
	enterDescription?: (ctx: DescriptionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.description`.
	 * @param ctx the parse tree
	 */
	exitDescription?: (ctx: DescriptionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.descriptionLine`.
	 * @param ctx the parse tree
	 */
	enterDescriptionLine?: (ctx: DescriptionLineContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.descriptionLine`.
	 * @param ctx the parse tree
	 */
	exitDescriptionLine?: (ctx: DescriptionLineContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.descriptionLineStart`.
	 * @param ctx the parse tree
	 */
	enterDescriptionLineStart?: (ctx: DescriptionLineStartContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.descriptionLineStart`.
	 * @param ctx the parse tree
	 */
	exitDescriptionLineStart?: (ctx: DescriptionLineStartContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.descriptionLineNoSpaceNoAt`.
	 * @param ctx the parse tree
	 */
	enterDescriptionLineNoSpaceNoAt?: (ctx: DescriptionLineNoSpaceNoAtContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.descriptionLineNoSpaceNoAt`.
	 * @param ctx the parse tree
	 */
	exitDescriptionLineNoSpaceNoAt?: (ctx: DescriptionLineNoSpaceNoAtContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.descriptionLineElement`.
	 * @param ctx the parse tree
	 */
	enterDescriptionLineElement?: (ctx: DescriptionLineElementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.descriptionLineElement`.
	 * @param ctx the parse tree
	 */
	exitDescriptionLineElement?: (ctx: DescriptionLineElementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.descriptionLineText`.
	 * @param ctx the parse tree
	 */
	enterDescriptionLineText?: (ctx: DescriptionLineTextContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.descriptionLineText`.
	 * @param ctx the parse tree
	 */
	exitDescriptionLineText?: (ctx: DescriptionLineTextContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.descriptionNewline`.
	 * @param ctx the parse tree
	 */
	enterDescriptionNewline?: (ctx: DescriptionNewlineContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.descriptionNewline`.
	 * @param ctx the parse tree
	 */
	exitDescriptionNewline?: (ctx: DescriptionNewlineContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.tagSection`.
	 * @param ctx the parse tree
	 */
	enterTagSection?: (ctx: TagSectionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.tagSection`.
	 * @param ctx the parse tree
	 */
	exitTagSection?: (ctx: TagSectionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.blockTag`.
	 * @param ctx the parse tree
	 */
	enterBlockTag?: (ctx: BlockTagContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.blockTag`.
	 * @param ctx the parse tree
	 */
	exitBlockTag?: (ctx: BlockTagContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.blockTagName`.
	 * @param ctx the parse tree
	 */
	enterBlockTagName?: (ctx: BlockTagNameContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.blockTagName`.
	 * @param ctx the parse tree
	 */
	exitBlockTagName?: (ctx: BlockTagNameContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.blockTagContent`.
	 * @param ctx the parse tree
	 */
	enterBlockTagContent?: (ctx: BlockTagContentContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.blockTagContent`.
	 * @param ctx the parse tree
	 */
	exitBlockTagContent?: (ctx: BlockTagContentContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.blockTagText`.
	 * @param ctx the parse tree
	 */
	enterBlockTagText?: (ctx: BlockTagTextContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.blockTagText`.
	 * @param ctx the parse tree
	 */
	exitBlockTagText?: (ctx: BlockTagTextContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.blockTagTextElement`.
	 * @param ctx the parse tree
	 */
	enterBlockTagTextElement?: (ctx: BlockTagTextElementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.blockTagTextElement`.
	 * @param ctx the parse tree
	 */
	exitBlockTagTextElement?: (ctx: BlockTagTextElementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.inlineTag`.
	 * @param ctx the parse tree
	 */
	enterInlineTag?: (ctx: InlineTagContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.inlineTag`.
	 * @param ctx the parse tree
	 */
	exitInlineTag?: (ctx: InlineTagContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.inlineTagName`.
	 * @param ctx the parse tree
	 */
	enterInlineTagName?: (ctx: InlineTagNameContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.inlineTagName`.
	 * @param ctx the parse tree
	 */
	exitInlineTagName?: (ctx: InlineTagNameContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.inlineTagContent`.
	 * @param ctx the parse tree
	 */
	enterInlineTagContent?: (ctx: InlineTagContentContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.inlineTagContent`.
	 * @param ctx the parse tree
	 */
	exitInlineTagContent?: (ctx: InlineTagContentContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.braceExpression`.
	 * @param ctx the parse tree
	 */
	enterBraceExpression?: (ctx: BraceExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.braceExpression`.
	 * @param ctx the parse tree
	 */
	exitBraceExpression?: (ctx: BraceExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.braceContent`.
	 * @param ctx the parse tree
	 */
	enterBraceContent?: (ctx: BraceContentContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.braceContent`.
	 * @param ctx the parse tree
	 */
	exitBraceContent?: (ctx: BraceContentContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppdocParser.braceText`.
	 * @param ctx the parse tree
	 */
	enterBraceText?: (ctx: BraceTextContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppdocParser.braceText`.
	 * @param ctx the parse tree
	 */
	exitBraceText?: (ctx: BraceTextContext) => void;
}

