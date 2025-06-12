// Generated from .vitepress\antlr\mcfppdoc.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

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
 * This interface defines a complete generic visitor for a parse tree produced
 * by `mcfppdocParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface mcfppdocVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `mcfppdocParser.documentation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDocumentation?: (ctx: DocumentationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.documentationContent`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDocumentationContent?: (ctx: DocumentationContentContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.skipWhitespace`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSkipWhitespace?: (ctx: SkipWhitespaceContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.description`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDescription?: (ctx: DescriptionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.descriptionLine`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDescriptionLine?: (ctx: DescriptionLineContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.descriptionLineStart`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDescriptionLineStart?: (ctx: DescriptionLineStartContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.descriptionLineNoSpaceNoAt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDescriptionLineNoSpaceNoAt?: (ctx: DescriptionLineNoSpaceNoAtContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.descriptionLineElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDescriptionLineElement?: (ctx: DescriptionLineElementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.descriptionLineText`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDescriptionLineText?: (ctx: DescriptionLineTextContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.descriptionNewline`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDescriptionNewline?: (ctx: DescriptionNewlineContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.tagSection`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTagSection?: (ctx: TagSectionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.blockTag`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlockTag?: (ctx: BlockTagContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.blockTagName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlockTagName?: (ctx: BlockTagNameContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.blockTagContent`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlockTagContent?: (ctx: BlockTagContentContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.blockTagText`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlockTagText?: (ctx: BlockTagTextContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.blockTagTextElement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlockTagTextElement?: (ctx: BlockTagTextElementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.inlineTag`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInlineTag?: (ctx: InlineTagContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.inlineTagName`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInlineTagName?: (ctx: InlineTagNameContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.inlineTagContent`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInlineTagContent?: (ctx: InlineTagContentContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.braceExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBraceExpression?: (ctx: BraceExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.braceContent`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBraceContent?: (ctx: BraceContentContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppdocParser.braceText`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBraceText?: (ctx: BraceTextContext) => Result;
}

