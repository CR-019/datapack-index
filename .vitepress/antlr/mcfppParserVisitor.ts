// Generated from .vitepress\antlr\mcfppParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeVisitor } from "antlr4ts/tree/ParseTreeVisitor";

import { CompilationUnitContext } from "./mcfppParser";
import { TopStatementContext } from "./mcfppParser";
import { NamespaceDeclarationContext } from "./mcfppParser";
import { ImportDeclarationContext } from "./mcfppParser";
import { ImportTypeContext } from "./mcfppParser";
import { TypealiasDeclarationContext } from "./mcfppParser";
import { TypeDeclarationContext } from "./mcfppParser";
import { DeclarationsContext } from "./mcfppParser";
import { NamespaceFieldDeclarationContext } from "./mcfppParser";
import { NamespaceFieldDeclarationExpressionContext } from "./mcfppParser";
import { ClassDeclarationContext } from "./mcfppParser";
import { ObjectClassDeclarationContext } from "./mcfppParser";
import { CompileTimeClassDeclarationContext } from "./mcfppParser";
import { NativeClassDeclarationContext } from "./mcfppParser";
import { ClassMemberDeclarationContext } from "./mcfppParser";
import { ClassBodyContext } from "./mcfppParser";
import { ClassMemberContext } from "./mcfppParser";
import { ClassFunctionDeclarationContext } from "./mcfppParser";
import { AbstractClassFunctionDeclarationContext } from "./mcfppParser";
import { NativeClassFunctionDeclarationContext } from "./mcfppParser";
import { OperationOverrideDeclarationContext } from "./mcfppParser";
import { NativeOperationOverrideDeclarationContext } from "./mcfppParser";
import { SupportOperatorContext } from "./mcfppParser";
import { ClassFieldDeclarationContext } from "./mcfppParser";
import { AccessorContext } from "./mcfppParser";
import { GetterContext } from "./mcfppParser";
import { SetterContext } from "./mcfppParser";
import { GenericClassImplementContext } from "./mcfppParser";
import { TemplateDeclarationContext } from "./mcfppParser";
import { ObjectTemplateDeclarationContext } from "./mcfppParser";
import { TemplateBodyContext } from "./mcfppParser";
import { TemplateMemberDeclarationContext } from "./mcfppParser";
import { TemplateMemberContext } from "./mcfppParser";
import { TemplateFunctionDeclarationContext } from "./mcfppParser";
import { TemplateFieldDeclarationContext } from "./mcfppParser";
import { TemplateTypeContext } from "./mcfppParser";
import { SingleTemplateFieldTypeContext } from "./mcfppParser";
import { UnionTemplateFieldTypeContext } from "./mcfppParser";
import { InterfaceDeclarationContext } from "./mcfppParser";
import { InterfaceBodyContext } from "./mcfppParser";
import { InterfaceFunctionDeclarationContext } from "./mcfppParser";
import { CompileTimeFuncDeclarationContext } from "./mcfppParser";
import { InlineFunctionDeclarationContext } from "./mcfppParser";
import { FunctionDeclarationContext } from "./mcfppParser";
import { ExtensionFunctionDeclarationContext } from "./mcfppParser";
import { EnumDeclarationContext } from "./mcfppParser";
import { EnumBodyContext } from "./mcfppParser";
import { EnumMemberContext } from "./mcfppParser";
import { NamespaceIDContext } from "./mcfppParser";
import { NativeFuncDeclarationContext } from "./mcfppParser";
import { JavaReferContext } from "./mcfppParser";
import { AccessModifierContext } from "./mcfppParser";
import { ClassConstructorDeclarationContext } from "./mcfppParser";
import { TemplateConstructorDeclarationContext } from "./mcfppParser";
import { FieldDeclarationContext } from "./mcfppParser";
import { FieldDeclarationExpressionContext } from "./mcfppParser";
import { FieldModifierContext } from "./mcfppParser";
import { FunctionParamsContext } from "./mcfppParser";
import { ReadOnlyParamsContext } from "./mcfppParser";
import { NormalParamsContext } from "./mcfppParser";
import { ParameterListContext } from "./mcfppParser";
import { ParameterContext } from "./mcfppParser";
import { ExpressionContext } from "./mcfppParser";
import { StatementExpressionContext } from "./mcfppParser";
import { ConditionalExpressionContext } from "./mcfppParser";
import { CommonBinaryOperatorExpressionContext } from "./mcfppParser";
import { CommonBinaryOperatorContext } from "./mcfppParser";
import { ConditionalOrExpressionContext } from "./mcfppParser";
import { ConditionalAndExpressionContext } from "./mcfppParser";
import { EqualityExpressionContext } from "./mcfppParser";
import { RelationalExpressionContext } from "./mcfppParser";
import { RelationalOpContext } from "./mcfppParser";
import { AdditiveExpressionContext } from "./mcfppParser";
import { MultiplicativeExpressionContext } from "./mcfppParser";
import { UnaryExpressionContext } from "./mcfppParser";
import { RightVarExpressionContext } from "./mcfppParser";
import { CastExpressionContext } from "./mcfppParser";
import { VarWithSelectorContext } from "./mcfppParser";
import { JvmAccessExpressionContext } from "./mcfppParser";
import { PropertyOperatorContext } from "./mcfppParser";
import { PropertyOperatorExpressionContext } from "./mcfppParser";
import { PrimaryContext } from "./mcfppParser";
import { VarContext } from "./mcfppParser";
import { BucketExpressionContext } from "./mcfppParser";
import { VarWithSuffixContext } from "./mcfppParser";
import { FunctionCallContext } from "./mcfppParser";
import { IdentifierSuffixContext } from "./mcfppParser";
import { ObjectInitializerContext } from "./mcfppParser";
import { SelectorContext } from "./mcfppParser";
import { ArgumentsContext } from "./mcfppParser";
import { ReadOnlyArgsContext } from "./mcfppParser";
import { NormalArgsContext } from "./mcfppParser";
import { FunctionBodyContext } from "./mcfppParser";
import { StatementContext } from "./mcfppParser";
import { ExecuteStatementContext } from "./mcfppParser";
import { ExecuteContextContext } from "./mcfppParser";
import { ExecuteExpressionContext } from "./mcfppParser";
import { OrgCommandContext } from "./mcfppParser";
import { OrgCommandContentContext } from "./mcfppParser";
import { OrgCommandExpressionContext } from "./mcfppParser";
import { ControlStatementContext } from "./mcfppParser";
import { IfStatementContext } from "./mcfppParser";
import { ElseIfStatementContext } from "./mcfppParser";
import { ElseStatementContext } from "./mcfppParser";
import { IfBlockContext } from "./mcfppParser";
import { WhileStatementContext } from "./mcfppParser";
import { WhileBlockContext } from "./mcfppParser";
import { DoWhileStatementContext } from "./mcfppParser";
import { DoWhileBlockContext } from "./mcfppParser";
import { SelfAddOrMinusStatementContext } from "./mcfppParser";
import { TryStoreStatementContext } from "./mcfppParser";
import { ReturnStatementContext } from "./mcfppParser";
import { BlockContext } from "./mcfppParser";
import { SelfAddOrMinusExpressionContext } from "./mcfppParser";
import { ExpressionListContext } from "./mcfppParser";
import { TypeContext } from "./mcfppParser";
import { TypeWithoutExclContext } from "./mcfppParser";
import { AnonymousTemplateTypeContext } from "./mcfppParser";
import { UnionTemplateTypeContext } from "./mcfppParser";
import { NormalTypeContext } from "./mcfppParser";
import { FunctionReturnTypeContext } from "./mcfppParser";
import { ValueContext } from "./mcfppParser";
import { CoordinateContext } from "./mcfppParser";
import { CoordinateDimensionContext } from "./mcfppParser";
import { ClassNameContext } from "./mcfppParser";
import { TypeListContext } from "./mcfppParser";
import { ClassWithoutNamespaceContext } from "./mcfppParser";
import { AnnotationContext } from "./mcfppParser";
import { AnnotationArgsContext } from "./mcfppParser";
import { RangeContext } from "./mcfppParser";
import { NbtValueContext } from "./mcfppParser";
import { NbtByteContext } from "./mcfppParser";
import { NbtShortContext } from "./mcfppParser";
import { NbtIntContext } from "./mcfppParser";
import { NbtLongContext } from "./mcfppParser";
import { NbtFloatContext } from "./mcfppParser";
import { NbtDoubleContext } from "./mcfppParser";
import { NbtBoolContext } from "./mcfppParser";
import { NbtByteArrayContext } from "./mcfppParser";
import { NbtIntArrayContext } from "./mcfppParser";
import { NbtLongArrayContext } from "./mcfppParser";
import { NbtListContext } from "./mcfppParser";
import { NbtKeyValuePairContext } from "./mcfppParser";
import { NbtCompoundContext } from "./mcfppParser";
import { MultiLineStringLiteralContext } from "./mcfppParser";
import { MultiLineStringContentContext } from "./mcfppParser";
import { MultiLineStringExpressionContext } from "./mcfppParser";
import { Doc_commentContext } from "./mcfppParser";


/**
 * This interface defines a complete generic visitor for a parse tree produced
 * by `mcfppParser`.
 *
 * @param <Result> The return type of the visit operation. Use `void` for
 * operations with no return type.
 */
export interface mcfppParserVisitor<Result> extends ParseTreeVisitor<Result> {
	/**
	 * Visit a parse tree produced by `mcfppParser.compilationUnit`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompilationUnit?: (ctx: CompilationUnitContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.topStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTopStatement?: (ctx: TopStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.namespaceDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNamespaceDeclaration?: (ctx: NamespaceDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.importDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportDeclaration?: (ctx: ImportDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.importType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitImportType?: (ctx: ImportTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.typealiasDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypealiasDeclaration?: (ctx: TypealiasDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.typeDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeDeclaration?: (ctx: TypeDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.declarations`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDeclarations?: (ctx: DeclarationsContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.namespaceFieldDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNamespaceFieldDeclaration?: (ctx: NamespaceFieldDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.namespaceFieldDeclarationExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNamespaceFieldDeclarationExpression?: (ctx: NamespaceFieldDeclarationExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.classDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassDeclaration?: (ctx: ClassDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.objectClassDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectClassDeclaration?: (ctx: ObjectClassDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.compileTimeClassDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompileTimeClassDeclaration?: (ctx: CompileTimeClassDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nativeClassDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNativeClassDeclaration?: (ctx: NativeClassDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.classMemberDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassMemberDeclaration?: (ctx: ClassMemberDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.classBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassBody?: (ctx: ClassBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.classMember`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassMember?: (ctx: ClassMemberContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.classFunctionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassFunctionDeclaration?: (ctx: ClassFunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.abstractClassFunctionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAbstractClassFunctionDeclaration?: (ctx: AbstractClassFunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nativeClassFunctionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNativeClassFunctionDeclaration?: (ctx: NativeClassFunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.operationOverrideDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOperationOverrideDeclaration?: (ctx: OperationOverrideDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nativeOperationOverrideDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNativeOperationOverrideDeclaration?: (ctx: NativeOperationOverrideDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.supportOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSupportOperator?: (ctx: SupportOperatorContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.classFieldDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassFieldDeclaration?: (ctx: ClassFieldDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.accessor`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAccessor?: (ctx: AccessorContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.getter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGetter?: (ctx: GetterContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.setter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSetter?: (ctx: SetterContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.genericClassImplement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitGenericClassImplement?: (ctx: GenericClassImplementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.templateDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTemplateDeclaration?: (ctx: TemplateDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.objectTemplateDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectTemplateDeclaration?: (ctx: ObjectTemplateDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.templateBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTemplateBody?: (ctx: TemplateBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.templateMemberDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTemplateMemberDeclaration?: (ctx: TemplateMemberDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.templateMember`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTemplateMember?: (ctx: TemplateMemberContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.templateFunctionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTemplateFunctionDeclaration?: (ctx: TemplateFunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.templateFieldDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTemplateFieldDeclaration?: (ctx: TemplateFieldDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.templateType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTemplateType?: (ctx: TemplateTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.singleTemplateFieldType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSingleTemplateFieldType?: (ctx: SingleTemplateFieldTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.unionTemplateFieldType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnionTemplateFieldType?: (ctx: UnionTemplateFieldTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.interfaceDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceDeclaration?: (ctx: InterfaceDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.interfaceBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceBody?: (ctx: InterfaceBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.interfaceFunctionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInterfaceFunctionDeclaration?: (ctx: InterfaceFunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.compileTimeFuncDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCompileTimeFuncDeclaration?: (ctx: CompileTimeFuncDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.inlineFunctionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitInlineFunctionDeclaration?: (ctx: InlineFunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.functionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.extensionFunctionDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExtensionFunctionDeclaration?: (ctx: ExtensionFunctionDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.enumDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumDeclaration?: (ctx: EnumDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.enumBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumBody?: (ctx: EnumBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.enumMember`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEnumMember?: (ctx: EnumMemberContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.namespaceID`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNamespaceID?: (ctx: NamespaceIDContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nativeFuncDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNativeFuncDeclaration?: (ctx: NativeFuncDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.javaRefer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJavaRefer?: (ctx: JavaReferContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.accessModifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAccessModifier?: (ctx: AccessModifierContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.classConstructorDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassConstructorDeclaration?: (ctx: ClassConstructorDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.templateConstructorDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTemplateConstructorDeclaration?: (ctx: TemplateConstructorDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.fieldDeclaration`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFieldDeclaration?: (ctx: FieldDeclarationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.fieldDeclarationExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFieldDeclarationExpression?: (ctx: FieldDeclarationExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.fieldModifier`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFieldModifier?: (ctx: FieldModifierContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.functionParams`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionParams?: (ctx: FunctionParamsContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.readOnlyParams`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReadOnlyParams?: (ctx: ReadOnlyParamsContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.normalParams`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNormalParams?: (ctx: NormalParamsContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.parameterList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameterList?: (ctx: ParameterListContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.parameter`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitParameter?: (ctx: ParameterContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.expression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpression?: (ctx: ExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.statementExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatementExpression?: (ctx: StatementExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.conditionalExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConditionalExpression?: (ctx: ConditionalExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.commonBinaryOperatorExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCommonBinaryOperatorExpression?: (ctx: CommonBinaryOperatorExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.commonBinaryOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCommonBinaryOperator?: (ctx: CommonBinaryOperatorContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.conditionalOrExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConditionalOrExpression?: (ctx: ConditionalOrExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.conditionalAndExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitConditionalAndExpression?: (ctx: ConditionalAndExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.equalityExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitEqualityExpression?: (ctx: EqualityExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.relationalExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRelationalExpression?: (ctx: RelationalExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.relationalOp`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRelationalOp?: (ctx: RelationalOpContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.additiveExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAdditiveExpression?: (ctx: AdditiveExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.unaryExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnaryExpression?: (ctx: UnaryExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.rightVarExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRightVarExpression?: (ctx: RightVarExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.castExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCastExpression?: (ctx: CastExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.varWithSelector`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVarWithSelector?: (ctx: VarWithSelectorContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.jvmAccessExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitJvmAccessExpression?: (ctx: JvmAccessExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.propertyOperator`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertyOperator?: (ctx: PropertyOperatorContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.propertyOperatorExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPropertyOperatorExpression?: (ctx: PropertyOperatorExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.primary`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitPrimary?: (ctx: PrimaryContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.var`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVar?: (ctx: VarContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.bucketExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBucketExpression?: (ctx: BucketExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.varWithSuffix`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitVarWithSuffix?: (ctx: VarWithSuffixContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.functionCall`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionCall?: (ctx: FunctionCallContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.identifierSuffix`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIdentifierSuffix?: (ctx: IdentifierSuffixContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.objectInitializer`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitObjectInitializer?: (ctx: ObjectInitializerContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.selector`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSelector?: (ctx: SelectorContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.arguments`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitArguments?: (ctx: ArgumentsContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.readOnlyArgs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReadOnlyArgs?: (ctx: ReadOnlyArgsContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.normalArgs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNormalArgs?: (ctx: NormalArgsContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.functionBody`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionBody?: (ctx: FunctionBodyContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.statement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitStatement?: (ctx: StatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.executeStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExecuteStatement?: (ctx: ExecuteStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.executeContext`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExecuteContext?: (ctx: ExecuteContextContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.executeExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExecuteExpression?: (ctx: ExecuteExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.orgCommand`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOrgCommand?: (ctx: OrgCommandContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.orgCommandContent`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOrgCommandContent?: (ctx: OrgCommandContentContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.orgCommandExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitOrgCommandExpression?: (ctx: OrgCommandExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.controlStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitControlStatement?: (ctx: ControlStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.ifStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIfStatement?: (ctx: IfStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.elseIfStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElseIfStatement?: (ctx: ElseIfStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.elseStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitElseStatement?: (ctx: ElseStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.ifBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitIfBlock?: (ctx: IfBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.whileStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhileStatement?: (ctx: WhileStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.whileBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitWhileBlock?: (ctx: WhileBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.doWhileStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDoWhileStatement?: (ctx: DoWhileStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.doWhileBlock`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDoWhileBlock?: (ctx: DoWhileBlockContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.selfAddOrMinusStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSelfAddOrMinusStatement?: (ctx: SelfAddOrMinusStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.tryStoreStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTryStoreStatement?: (ctx: TryStoreStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.returnStatement`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitReturnStatement?: (ctx: ReturnStatementContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.block`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitBlock?: (ctx: BlockContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.selfAddOrMinusExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitSelfAddOrMinusExpression?: (ctx: SelfAddOrMinusExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.expressionList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitExpressionList?: (ctx: ExpressionListContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.type`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitType?: (ctx: TypeContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.typeWithoutExcl`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeWithoutExcl?: (ctx: TypeWithoutExclContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.anonymousTemplateType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnonymousTemplateType?: (ctx: AnonymousTemplateTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.unionTemplateType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitUnionTemplateType?: (ctx: UnionTemplateTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.normalType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNormalType?: (ctx: NormalTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.functionReturnType`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitFunctionReturnType?: (ctx: FunctionReturnTypeContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.value`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitValue?: (ctx: ValueContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.coordinate`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCoordinate?: (ctx: CoordinateContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.coordinateDimension`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitCoordinateDimension?: (ctx: CoordinateDimensionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.className`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassName?: (ctx: ClassNameContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.typeList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitTypeList?: (ctx: TypeListContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.classWithoutNamespace`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitClassWithoutNamespace?: (ctx: ClassWithoutNamespaceContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.annotation`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnotation?: (ctx: AnnotationContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.annotationArgs`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitAnnotationArgs?: (ctx: AnnotationArgsContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.range`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitRange?: (ctx: RangeContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtValue`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtValue?: (ctx: NbtValueContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtByte`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtByte?: (ctx: NbtByteContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtShort`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtShort?: (ctx: NbtShortContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtInt`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtInt?: (ctx: NbtIntContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtLong`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtLong?: (ctx: NbtLongContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtFloat`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtFloat?: (ctx: NbtFloatContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtDouble`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtDouble?: (ctx: NbtDoubleContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtBool`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtBool?: (ctx: NbtBoolContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtByteArray`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtByteArray?: (ctx: NbtByteArrayContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtIntArray`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtIntArray?: (ctx: NbtIntArrayContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtLongArray`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtLongArray?: (ctx: NbtLongArrayContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtList`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtList?: (ctx: NbtListContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtKeyValuePair`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtKeyValuePair?: (ctx: NbtKeyValuePairContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.nbtCompound`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitNbtCompound?: (ctx: NbtCompoundContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.multiLineStringLiteral`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiLineStringLiteral?: (ctx: MultiLineStringLiteralContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.multiLineStringContent`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiLineStringContent?: (ctx: MultiLineStringContentContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.multiLineStringExpression`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitMultiLineStringExpression?: (ctx: MultiLineStringExpressionContext) => Result;

	/**
	 * Visit a parse tree produced by `mcfppParser.doc_comment`.
	 * @param ctx the parse tree
	 * @return the visitor result
	 */
	visitDoc_comment?: (ctx: Doc_commentContext) => Result;
}

