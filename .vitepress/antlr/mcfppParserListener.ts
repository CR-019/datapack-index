// Generated from .vitepress\antlr\mcfppParser.g4 by ANTLR 4.9.0-SNAPSHOT


import { ParseTreeListener } from "antlr4ts/tree/ParseTreeListener";

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
 * This interface defines a complete listener for a parse tree produced by
 * `mcfppParser`.
 */
export interface mcfppParserListener extends ParseTreeListener {
	/**
	 * Enter a parse tree produced by `mcfppParser.compilationUnit`.
	 * @param ctx the parse tree
	 */
	enterCompilationUnit?: (ctx: CompilationUnitContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.compilationUnit`.
	 * @param ctx the parse tree
	 */
	exitCompilationUnit?: (ctx: CompilationUnitContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.topStatement`.
	 * @param ctx the parse tree
	 */
	enterTopStatement?: (ctx: TopStatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.topStatement`.
	 * @param ctx the parse tree
	 */
	exitTopStatement?: (ctx: TopStatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.namespaceDeclaration`.
	 * @param ctx the parse tree
	 */
	enterNamespaceDeclaration?: (ctx: NamespaceDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.namespaceDeclaration`.
	 * @param ctx the parse tree
	 */
	exitNamespaceDeclaration?: (ctx: NamespaceDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.importDeclaration`.
	 * @param ctx the parse tree
	 */
	enterImportDeclaration?: (ctx: ImportDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.importDeclaration`.
	 * @param ctx the parse tree
	 */
	exitImportDeclaration?: (ctx: ImportDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.importType`.
	 * @param ctx the parse tree
	 */
	enterImportType?: (ctx: ImportTypeContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.importType`.
	 * @param ctx the parse tree
	 */
	exitImportType?: (ctx: ImportTypeContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.typealiasDeclaration`.
	 * @param ctx the parse tree
	 */
	enterTypealiasDeclaration?: (ctx: TypealiasDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.typealiasDeclaration`.
	 * @param ctx the parse tree
	 */
	exitTypealiasDeclaration?: (ctx: TypealiasDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.typeDeclaration`.
	 * @param ctx the parse tree
	 */
	enterTypeDeclaration?: (ctx: TypeDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.typeDeclaration`.
	 * @param ctx the parse tree
	 */
	exitTypeDeclaration?: (ctx: TypeDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.declarations`.
	 * @param ctx the parse tree
	 */
	enterDeclarations?: (ctx: DeclarationsContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.declarations`.
	 * @param ctx the parse tree
	 */
	exitDeclarations?: (ctx: DeclarationsContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.namespaceFieldDeclaration`.
	 * @param ctx the parse tree
	 */
	enterNamespaceFieldDeclaration?: (ctx: NamespaceFieldDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.namespaceFieldDeclaration`.
	 * @param ctx the parse tree
	 */
	exitNamespaceFieldDeclaration?: (ctx: NamespaceFieldDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.namespaceFieldDeclarationExpression`.
	 * @param ctx the parse tree
	 */
	enterNamespaceFieldDeclarationExpression?: (ctx: NamespaceFieldDeclarationExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.namespaceFieldDeclarationExpression`.
	 * @param ctx the parse tree
	 */
	exitNamespaceFieldDeclarationExpression?: (ctx: NamespaceFieldDeclarationExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.classDeclaration`.
	 * @param ctx the parse tree
	 */
	enterClassDeclaration?: (ctx: ClassDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.classDeclaration`.
	 * @param ctx the parse tree
	 */
	exitClassDeclaration?: (ctx: ClassDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.objectClassDeclaration`.
	 * @param ctx the parse tree
	 */
	enterObjectClassDeclaration?: (ctx: ObjectClassDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.objectClassDeclaration`.
	 * @param ctx the parse tree
	 */
	exitObjectClassDeclaration?: (ctx: ObjectClassDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.compileTimeClassDeclaration`.
	 * @param ctx the parse tree
	 */
	enterCompileTimeClassDeclaration?: (ctx: CompileTimeClassDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.compileTimeClassDeclaration`.
	 * @param ctx the parse tree
	 */
	exitCompileTimeClassDeclaration?: (ctx: CompileTimeClassDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nativeClassDeclaration`.
	 * @param ctx the parse tree
	 */
	enterNativeClassDeclaration?: (ctx: NativeClassDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nativeClassDeclaration`.
	 * @param ctx the parse tree
	 */
	exitNativeClassDeclaration?: (ctx: NativeClassDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.classMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	enterClassMemberDeclaration?: (ctx: ClassMemberDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.classMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	exitClassMemberDeclaration?: (ctx: ClassMemberDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.classBody`.
	 * @param ctx the parse tree
	 */
	enterClassBody?: (ctx: ClassBodyContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.classBody`.
	 * @param ctx the parse tree
	 */
	exitClassBody?: (ctx: ClassBodyContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.classMember`.
	 * @param ctx the parse tree
	 */
	enterClassMember?: (ctx: ClassMemberContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.classMember`.
	 * @param ctx the parse tree
	 */
	exitClassMember?: (ctx: ClassMemberContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.classFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterClassFunctionDeclaration?: (ctx: ClassFunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.classFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitClassFunctionDeclaration?: (ctx: ClassFunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.abstractClassFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterAbstractClassFunctionDeclaration?: (ctx: AbstractClassFunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.abstractClassFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitAbstractClassFunctionDeclaration?: (ctx: AbstractClassFunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nativeClassFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterNativeClassFunctionDeclaration?: (ctx: NativeClassFunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nativeClassFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitNativeClassFunctionDeclaration?: (ctx: NativeClassFunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.operationOverrideDeclaration`.
	 * @param ctx the parse tree
	 */
	enterOperationOverrideDeclaration?: (ctx: OperationOverrideDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.operationOverrideDeclaration`.
	 * @param ctx the parse tree
	 */
	exitOperationOverrideDeclaration?: (ctx: OperationOverrideDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nativeOperationOverrideDeclaration`.
	 * @param ctx the parse tree
	 */
	enterNativeOperationOverrideDeclaration?: (ctx: NativeOperationOverrideDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nativeOperationOverrideDeclaration`.
	 * @param ctx the parse tree
	 */
	exitNativeOperationOverrideDeclaration?: (ctx: NativeOperationOverrideDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.supportOperator`.
	 * @param ctx the parse tree
	 */
	enterSupportOperator?: (ctx: SupportOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.supportOperator`.
	 * @param ctx the parse tree
	 */
	exitSupportOperator?: (ctx: SupportOperatorContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.classFieldDeclaration`.
	 * @param ctx the parse tree
	 */
	enterClassFieldDeclaration?: (ctx: ClassFieldDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.classFieldDeclaration`.
	 * @param ctx the parse tree
	 */
	exitClassFieldDeclaration?: (ctx: ClassFieldDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.accessor`.
	 * @param ctx the parse tree
	 */
	enterAccessor?: (ctx: AccessorContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.accessor`.
	 * @param ctx the parse tree
	 */
	exitAccessor?: (ctx: AccessorContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.getter`.
	 * @param ctx the parse tree
	 */
	enterGetter?: (ctx: GetterContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.getter`.
	 * @param ctx the parse tree
	 */
	exitGetter?: (ctx: GetterContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.setter`.
	 * @param ctx the parse tree
	 */
	enterSetter?: (ctx: SetterContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.setter`.
	 * @param ctx the parse tree
	 */
	exitSetter?: (ctx: SetterContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.genericClassImplement`.
	 * @param ctx the parse tree
	 */
	enterGenericClassImplement?: (ctx: GenericClassImplementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.genericClassImplement`.
	 * @param ctx the parse tree
	 */
	exitGenericClassImplement?: (ctx: GenericClassImplementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.templateDeclaration`.
	 * @param ctx the parse tree
	 */
	enterTemplateDeclaration?: (ctx: TemplateDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.templateDeclaration`.
	 * @param ctx the parse tree
	 */
	exitTemplateDeclaration?: (ctx: TemplateDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.objectTemplateDeclaration`.
	 * @param ctx the parse tree
	 */
	enterObjectTemplateDeclaration?: (ctx: ObjectTemplateDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.objectTemplateDeclaration`.
	 * @param ctx the parse tree
	 */
	exitObjectTemplateDeclaration?: (ctx: ObjectTemplateDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.templateBody`.
	 * @param ctx the parse tree
	 */
	enterTemplateBody?: (ctx: TemplateBodyContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.templateBody`.
	 * @param ctx the parse tree
	 */
	exitTemplateBody?: (ctx: TemplateBodyContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.templateMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	enterTemplateMemberDeclaration?: (ctx: TemplateMemberDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.templateMemberDeclaration`.
	 * @param ctx the parse tree
	 */
	exitTemplateMemberDeclaration?: (ctx: TemplateMemberDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.templateMember`.
	 * @param ctx the parse tree
	 */
	enterTemplateMember?: (ctx: TemplateMemberContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.templateMember`.
	 * @param ctx the parse tree
	 */
	exitTemplateMember?: (ctx: TemplateMemberContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.templateFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterTemplateFunctionDeclaration?: (ctx: TemplateFunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.templateFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitTemplateFunctionDeclaration?: (ctx: TemplateFunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.templateFieldDeclaration`.
	 * @param ctx the parse tree
	 */
	enterTemplateFieldDeclaration?: (ctx: TemplateFieldDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.templateFieldDeclaration`.
	 * @param ctx the parse tree
	 */
	exitTemplateFieldDeclaration?: (ctx: TemplateFieldDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.templateType`.
	 * @param ctx the parse tree
	 */
	enterTemplateType?: (ctx: TemplateTypeContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.templateType`.
	 * @param ctx the parse tree
	 */
	exitTemplateType?: (ctx: TemplateTypeContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.singleTemplateFieldType`.
	 * @param ctx the parse tree
	 */
	enterSingleTemplateFieldType?: (ctx: SingleTemplateFieldTypeContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.singleTemplateFieldType`.
	 * @param ctx the parse tree
	 */
	exitSingleTemplateFieldType?: (ctx: SingleTemplateFieldTypeContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.unionTemplateFieldType`.
	 * @param ctx the parse tree
	 */
	enterUnionTemplateFieldType?: (ctx: UnionTemplateFieldTypeContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.unionTemplateFieldType`.
	 * @param ctx the parse tree
	 */
	exitUnionTemplateFieldType?: (ctx: UnionTemplateFieldTypeContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.interfaceDeclaration`.
	 * @param ctx the parse tree
	 */
	enterInterfaceDeclaration?: (ctx: InterfaceDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.interfaceDeclaration`.
	 * @param ctx the parse tree
	 */
	exitInterfaceDeclaration?: (ctx: InterfaceDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.interfaceBody`.
	 * @param ctx the parse tree
	 */
	enterInterfaceBody?: (ctx: InterfaceBodyContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.interfaceBody`.
	 * @param ctx the parse tree
	 */
	exitInterfaceBody?: (ctx: InterfaceBodyContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.interfaceFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterInterfaceFunctionDeclaration?: (ctx: InterfaceFunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.interfaceFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitInterfaceFunctionDeclaration?: (ctx: InterfaceFunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.compileTimeFuncDeclaration`.
	 * @param ctx the parse tree
	 */
	enterCompileTimeFuncDeclaration?: (ctx: CompileTimeFuncDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.compileTimeFuncDeclaration`.
	 * @param ctx the parse tree
	 */
	exitCompileTimeFuncDeclaration?: (ctx: CompileTimeFuncDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.inlineFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterInlineFunctionDeclaration?: (ctx: InlineFunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.inlineFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitInlineFunctionDeclaration?: (ctx: InlineFunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.functionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.functionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitFunctionDeclaration?: (ctx: FunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.extensionFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	enterExtensionFunctionDeclaration?: (ctx: ExtensionFunctionDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.extensionFunctionDeclaration`.
	 * @param ctx the parse tree
	 */
	exitExtensionFunctionDeclaration?: (ctx: ExtensionFunctionDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.enumDeclaration`.
	 * @param ctx the parse tree
	 */
	enterEnumDeclaration?: (ctx: EnumDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.enumDeclaration`.
	 * @param ctx the parse tree
	 */
	exitEnumDeclaration?: (ctx: EnumDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.enumBody`.
	 * @param ctx the parse tree
	 */
	enterEnumBody?: (ctx: EnumBodyContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.enumBody`.
	 * @param ctx the parse tree
	 */
	exitEnumBody?: (ctx: EnumBodyContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.enumMember`.
	 * @param ctx the parse tree
	 */
	enterEnumMember?: (ctx: EnumMemberContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.enumMember`.
	 * @param ctx the parse tree
	 */
	exitEnumMember?: (ctx: EnumMemberContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.namespaceID`.
	 * @param ctx the parse tree
	 */
	enterNamespaceID?: (ctx: NamespaceIDContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.namespaceID`.
	 * @param ctx the parse tree
	 */
	exitNamespaceID?: (ctx: NamespaceIDContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nativeFuncDeclaration`.
	 * @param ctx the parse tree
	 */
	enterNativeFuncDeclaration?: (ctx: NativeFuncDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nativeFuncDeclaration`.
	 * @param ctx the parse tree
	 */
	exitNativeFuncDeclaration?: (ctx: NativeFuncDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.javaRefer`.
	 * @param ctx the parse tree
	 */
	enterJavaRefer?: (ctx: JavaReferContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.javaRefer`.
	 * @param ctx the parse tree
	 */
	exitJavaRefer?: (ctx: JavaReferContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.accessModifier`.
	 * @param ctx the parse tree
	 */
	enterAccessModifier?: (ctx: AccessModifierContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.accessModifier`.
	 * @param ctx the parse tree
	 */
	exitAccessModifier?: (ctx: AccessModifierContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.classConstructorDeclaration`.
	 * @param ctx the parse tree
	 */
	enterClassConstructorDeclaration?: (ctx: ClassConstructorDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.classConstructorDeclaration`.
	 * @param ctx the parse tree
	 */
	exitClassConstructorDeclaration?: (ctx: ClassConstructorDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.templateConstructorDeclaration`.
	 * @param ctx the parse tree
	 */
	enterTemplateConstructorDeclaration?: (ctx: TemplateConstructorDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.templateConstructorDeclaration`.
	 * @param ctx the parse tree
	 */
	exitTemplateConstructorDeclaration?: (ctx: TemplateConstructorDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.fieldDeclaration`.
	 * @param ctx the parse tree
	 */
	enterFieldDeclaration?: (ctx: FieldDeclarationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.fieldDeclaration`.
	 * @param ctx the parse tree
	 */
	exitFieldDeclaration?: (ctx: FieldDeclarationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.fieldDeclarationExpression`.
	 * @param ctx the parse tree
	 */
	enterFieldDeclarationExpression?: (ctx: FieldDeclarationExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.fieldDeclarationExpression`.
	 * @param ctx the parse tree
	 */
	exitFieldDeclarationExpression?: (ctx: FieldDeclarationExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.fieldModifier`.
	 * @param ctx the parse tree
	 */
	enterFieldModifier?: (ctx: FieldModifierContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.fieldModifier`.
	 * @param ctx the parse tree
	 */
	exitFieldModifier?: (ctx: FieldModifierContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.functionParams`.
	 * @param ctx the parse tree
	 */
	enterFunctionParams?: (ctx: FunctionParamsContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.functionParams`.
	 * @param ctx the parse tree
	 */
	exitFunctionParams?: (ctx: FunctionParamsContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.readOnlyParams`.
	 * @param ctx the parse tree
	 */
	enterReadOnlyParams?: (ctx: ReadOnlyParamsContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.readOnlyParams`.
	 * @param ctx the parse tree
	 */
	exitReadOnlyParams?: (ctx: ReadOnlyParamsContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.normalParams`.
	 * @param ctx the parse tree
	 */
	enterNormalParams?: (ctx: NormalParamsContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.normalParams`.
	 * @param ctx the parse tree
	 */
	exitNormalParams?: (ctx: NormalParamsContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.parameterList`.
	 * @param ctx the parse tree
	 */
	enterParameterList?: (ctx: ParameterListContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.parameterList`.
	 * @param ctx the parse tree
	 */
	exitParameterList?: (ctx: ParameterListContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.parameter`.
	 * @param ctx the parse tree
	 */
	enterParameter?: (ctx: ParameterContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.parameter`.
	 * @param ctx the parse tree
	 */
	exitParameter?: (ctx: ParameterContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.expression`.
	 * @param ctx the parse tree
	 */
	enterExpression?: (ctx: ExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.expression`.
	 * @param ctx the parse tree
	 */
	exitExpression?: (ctx: ExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.statementExpression`.
	 * @param ctx the parse tree
	 */
	enterStatementExpression?: (ctx: StatementExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.statementExpression`.
	 * @param ctx the parse tree
	 */
	exitStatementExpression?: (ctx: StatementExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.conditionalExpression`.
	 * @param ctx the parse tree
	 */
	enterConditionalExpression?: (ctx: ConditionalExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.conditionalExpression`.
	 * @param ctx the parse tree
	 */
	exitConditionalExpression?: (ctx: ConditionalExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.commonBinaryOperatorExpression`.
	 * @param ctx the parse tree
	 */
	enterCommonBinaryOperatorExpression?: (ctx: CommonBinaryOperatorExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.commonBinaryOperatorExpression`.
	 * @param ctx the parse tree
	 */
	exitCommonBinaryOperatorExpression?: (ctx: CommonBinaryOperatorExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.commonBinaryOperator`.
	 * @param ctx the parse tree
	 */
	enterCommonBinaryOperator?: (ctx: CommonBinaryOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.commonBinaryOperator`.
	 * @param ctx the parse tree
	 */
	exitCommonBinaryOperator?: (ctx: CommonBinaryOperatorContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.conditionalOrExpression`.
	 * @param ctx the parse tree
	 */
	enterConditionalOrExpression?: (ctx: ConditionalOrExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.conditionalOrExpression`.
	 * @param ctx the parse tree
	 */
	exitConditionalOrExpression?: (ctx: ConditionalOrExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.conditionalAndExpression`.
	 * @param ctx the parse tree
	 */
	enterConditionalAndExpression?: (ctx: ConditionalAndExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.conditionalAndExpression`.
	 * @param ctx the parse tree
	 */
	exitConditionalAndExpression?: (ctx: ConditionalAndExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.equalityExpression`.
	 * @param ctx the parse tree
	 */
	enterEqualityExpression?: (ctx: EqualityExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.equalityExpression`.
	 * @param ctx the parse tree
	 */
	exitEqualityExpression?: (ctx: EqualityExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.relationalExpression`.
	 * @param ctx the parse tree
	 */
	enterRelationalExpression?: (ctx: RelationalExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.relationalExpression`.
	 * @param ctx the parse tree
	 */
	exitRelationalExpression?: (ctx: RelationalExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.relationalOp`.
	 * @param ctx the parse tree
	 */
	enterRelationalOp?: (ctx: RelationalOpContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.relationalOp`.
	 * @param ctx the parse tree
	 */
	exitRelationalOp?: (ctx: RelationalOpContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.additiveExpression`.
	 * @param ctx the parse tree
	 */
	enterAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.additiveExpression`.
	 * @param ctx the parse tree
	 */
	exitAdditiveExpression?: (ctx: AdditiveExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 */
	enterMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.multiplicativeExpression`.
	 * @param ctx the parse tree
	 */
	exitMultiplicativeExpression?: (ctx: MultiplicativeExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.unaryExpression`.
	 * @param ctx the parse tree
	 */
	enterUnaryExpression?: (ctx: UnaryExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.unaryExpression`.
	 * @param ctx the parse tree
	 */
	exitUnaryExpression?: (ctx: UnaryExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.rightVarExpression`.
	 * @param ctx the parse tree
	 */
	enterRightVarExpression?: (ctx: RightVarExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.rightVarExpression`.
	 * @param ctx the parse tree
	 */
	exitRightVarExpression?: (ctx: RightVarExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.castExpression`.
	 * @param ctx the parse tree
	 */
	enterCastExpression?: (ctx: CastExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.castExpression`.
	 * @param ctx the parse tree
	 */
	exitCastExpression?: (ctx: CastExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.varWithSelector`.
	 * @param ctx the parse tree
	 */
	enterVarWithSelector?: (ctx: VarWithSelectorContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.varWithSelector`.
	 * @param ctx the parse tree
	 */
	exitVarWithSelector?: (ctx: VarWithSelectorContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.jvmAccessExpression`.
	 * @param ctx the parse tree
	 */
	enterJvmAccessExpression?: (ctx: JvmAccessExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.jvmAccessExpression`.
	 * @param ctx the parse tree
	 */
	exitJvmAccessExpression?: (ctx: JvmAccessExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.propertyOperator`.
	 * @param ctx the parse tree
	 */
	enterPropertyOperator?: (ctx: PropertyOperatorContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.propertyOperator`.
	 * @param ctx the parse tree
	 */
	exitPropertyOperator?: (ctx: PropertyOperatorContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.propertyOperatorExpression`.
	 * @param ctx the parse tree
	 */
	enterPropertyOperatorExpression?: (ctx: PropertyOperatorExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.propertyOperatorExpression`.
	 * @param ctx the parse tree
	 */
	exitPropertyOperatorExpression?: (ctx: PropertyOperatorExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.primary`.
	 * @param ctx the parse tree
	 */
	enterPrimary?: (ctx: PrimaryContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.primary`.
	 * @param ctx the parse tree
	 */
	exitPrimary?: (ctx: PrimaryContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.var`.
	 * @param ctx the parse tree
	 */
	enterVar?: (ctx: VarContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.var`.
	 * @param ctx the parse tree
	 */
	exitVar?: (ctx: VarContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.bucketExpression`.
	 * @param ctx the parse tree
	 */
	enterBucketExpression?: (ctx: BucketExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.bucketExpression`.
	 * @param ctx the parse tree
	 */
	exitBucketExpression?: (ctx: BucketExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.varWithSuffix`.
	 * @param ctx the parse tree
	 */
	enterVarWithSuffix?: (ctx: VarWithSuffixContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.varWithSuffix`.
	 * @param ctx the parse tree
	 */
	exitVarWithSuffix?: (ctx: VarWithSuffixContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.functionCall`.
	 * @param ctx the parse tree
	 */
	enterFunctionCall?: (ctx: FunctionCallContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.functionCall`.
	 * @param ctx the parse tree
	 */
	exitFunctionCall?: (ctx: FunctionCallContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.identifierSuffix`.
	 * @param ctx the parse tree
	 */
	enterIdentifierSuffix?: (ctx: IdentifierSuffixContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.identifierSuffix`.
	 * @param ctx the parse tree
	 */
	exitIdentifierSuffix?: (ctx: IdentifierSuffixContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.objectInitializer`.
	 * @param ctx the parse tree
	 */
	enterObjectInitializer?: (ctx: ObjectInitializerContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.objectInitializer`.
	 * @param ctx the parse tree
	 */
	exitObjectInitializer?: (ctx: ObjectInitializerContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.selector`.
	 * @param ctx the parse tree
	 */
	enterSelector?: (ctx: SelectorContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.selector`.
	 * @param ctx the parse tree
	 */
	exitSelector?: (ctx: SelectorContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.arguments`.
	 * @param ctx the parse tree
	 */
	enterArguments?: (ctx: ArgumentsContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.arguments`.
	 * @param ctx the parse tree
	 */
	exitArguments?: (ctx: ArgumentsContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.readOnlyArgs`.
	 * @param ctx the parse tree
	 */
	enterReadOnlyArgs?: (ctx: ReadOnlyArgsContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.readOnlyArgs`.
	 * @param ctx the parse tree
	 */
	exitReadOnlyArgs?: (ctx: ReadOnlyArgsContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.normalArgs`.
	 * @param ctx the parse tree
	 */
	enterNormalArgs?: (ctx: NormalArgsContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.normalArgs`.
	 * @param ctx the parse tree
	 */
	exitNormalArgs?: (ctx: NormalArgsContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.functionBody`.
	 * @param ctx the parse tree
	 */
	enterFunctionBody?: (ctx: FunctionBodyContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.functionBody`.
	 * @param ctx the parse tree
	 */
	exitFunctionBody?: (ctx: FunctionBodyContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.statement`.
	 * @param ctx the parse tree
	 */
	enterStatement?: (ctx: StatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.statement`.
	 * @param ctx the parse tree
	 */
	exitStatement?: (ctx: StatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.executeStatement`.
	 * @param ctx the parse tree
	 */
	enterExecuteStatement?: (ctx: ExecuteStatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.executeStatement`.
	 * @param ctx the parse tree
	 */
	exitExecuteStatement?: (ctx: ExecuteStatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.executeContext`.
	 * @param ctx the parse tree
	 */
	enterExecuteContext?: (ctx: ExecuteContextContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.executeContext`.
	 * @param ctx the parse tree
	 */
	exitExecuteContext?: (ctx: ExecuteContextContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.executeExpression`.
	 * @param ctx the parse tree
	 */
	enterExecuteExpression?: (ctx: ExecuteExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.executeExpression`.
	 * @param ctx the parse tree
	 */
	exitExecuteExpression?: (ctx: ExecuteExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.orgCommand`.
	 * @param ctx the parse tree
	 */
	enterOrgCommand?: (ctx: OrgCommandContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.orgCommand`.
	 * @param ctx the parse tree
	 */
	exitOrgCommand?: (ctx: OrgCommandContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.orgCommandContent`.
	 * @param ctx the parse tree
	 */
	enterOrgCommandContent?: (ctx: OrgCommandContentContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.orgCommandContent`.
	 * @param ctx the parse tree
	 */
	exitOrgCommandContent?: (ctx: OrgCommandContentContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.orgCommandExpression`.
	 * @param ctx the parse tree
	 */
	enterOrgCommandExpression?: (ctx: OrgCommandExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.orgCommandExpression`.
	 * @param ctx the parse tree
	 */
	exitOrgCommandExpression?: (ctx: OrgCommandExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.controlStatement`.
	 * @param ctx the parse tree
	 */
	enterControlStatement?: (ctx: ControlStatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.controlStatement`.
	 * @param ctx the parse tree
	 */
	exitControlStatement?: (ctx: ControlStatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.ifStatement`.
	 * @param ctx the parse tree
	 */
	enterIfStatement?: (ctx: IfStatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.ifStatement`.
	 * @param ctx the parse tree
	 */
	exitIfStatement?: (ctx: IfStatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.elseIfStatement`.
	 * @param ctx the parse tree
	 */
	enterElseIfStatement?: (ctx: ElseIfStatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.elseIfStatement`.
	 * @param ctx the parse tree
	 */
	exitElseIfStatement?: (ctx: ElseIfStatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.elseStatement`.
	 * @param ctx the parse tree
	 */
	enterElseStatement?: (ctx: ElseStatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.elseStatement`.
	 * @param ctx the parse tree
	 */
	exitElseStatement?: (ctx: ElseStatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.ifBlock`.
	 * @param ctx the parse tree
	 */
	enterIfBlock?: (ctx: IfBlockContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.ifBlock`.
	 * @param ctx the parse tree
	 */
	exitIfBlock?: (ctx: IfBlockContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.whileStatement`.
	 * @param ctx the parse tree
	 */
	enterWhileStatement?: (ctx: WhileStatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.whileStatement`.
	 * @param ctx the parse tree
	 */
	exitWhileStatement?: (ctx: WhileStatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.whileBlock`.
	 * @param ctx the parse tree
	 */
	enterWhileBlock?: (ctx: WhileBlockContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.whileBlock`.
	 * @param ctx the parse tree
	 */
	exitWhileBlock?: (ctx: WhileBlockContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.doWhileStatement`.
	 * @param ctx the parse tree
	 */
	enterDoWhileStatement?: (ctx: DoWhileStatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.doWhileStatement`.
	 * @param ctx the parse tree
	 */
	exitDoWhileStatement?: (ctx: DoWhileStatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.doWhileBlock`.
	 * @param ctx the parse tree
	 */
	enterDoWhileBlock?: (ctx: DoWhileBlockContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.doWhileBlock`.
	 * @param ctx the parse tree
	 */
	exitDoWhileBlock?: (ctx: DoWhileBlockContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.selfAddOrMinusStatement`.
	 * @param ctx the parse tree
	 */
	enterSelfAddOrMinusStatement?: (ctx: SelfAddOrMinusStatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.selfAddOrMinusStatement`.
	 * @param ctx the parse tree
	 */
	exitSelfAddOrMinusStatement?: (ctx: SelfAddOrMinusStatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.tryStoreStatement`.
	 * @param ctx the parse tree
	 */
	enterTryStoreStatement?: (ctx: TryStoreStatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.tryStoreStatement`.
	 * @param ctx the parse tree
	 */
	exitTryStoreStatement?: (ctx: TryStoreStatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.returnStatement`.
	 * @param ctx the parse tree
	 */
	enterReturnStatement?: (ctx: ReturnStatementContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.returnStatement`.
	 * @param ctx the parse tree
	 */
	exitReturnStatement?: (ctx: ReturnStatementContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.block`.
	 * @param ctx the parse tree
	 */
	enterBlock?: (ctx: BlockContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.block`.
	 * @param ctx the parse tree
	 */
	exitBlock?: (ctx: BlockContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.selfAddOrMinusExpression`.
	 * @param ctx the parse tree
	 */
	enterSelfAddOrMinusExpression?: (ctx: SelfAddOrMinusExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.selfAddOrMinusExpression`.
	 * @param ctx the parse tree
	 */
	exitSelfAddOrMinusExpression?: (ctx: SelfAddOrMinusExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.expressionList`.
	 * @param ctx the parse tree
	 */
	enterExpressionList?: (ctx: ExpressionListContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.expressionList`.
	 * @param ctx the parse tree
	 */
	exitExpressionList?: (ctx: ExpressionListContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.type`.
	 * @param ctx the parse tree
	 */
	enterType?: (ctx: TypeContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.type`.
	 * @param ctx the parse tree
	 */
	exitType?: (ctx: TypeContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.typeWithoutExcl`.
	 * @param ctx the parse tree
	 */
	enterTypeWithoutExcl?: (ctx: TypeWithoutExclContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.typeWithoutExcl`.
	 * @param ctx the parse tree
	 */
	exitTypeWithoutExcl?: (ctx: TypeWithoutExclContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.anonymousTemplateType`.
	 * @param ctx the parse tree
	 */
	enterAnonymousTemplateType?: (ctx: AnonymousTemplateTypeContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.anonymousTemplateType`.
	 * @param ctx the parse tree
	 */
	exitAnonymousTemplateType?: (ctx: AnonymousTemplateTypeContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.unionTemplateType`.
	 * @param ctx the parse tree
	 */
	enterUnionTemplateType?: (ctx: UnionTemplateTypeContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.unionTemplateType`.
	 * @param ctx the parse tree
	 */
	exitUnionTemplateType?: (ctx: UnionTemplateTypeContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.normalType`.
	 * @param ctx the parse tree
	 */
	enterNormalType?: (ctx: NormalTypeContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.normalType`.
	 * @param ctx the parse tree
	 */
	exitNormalType?: (ctx: NormalTypeContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.functionReturnType`.
	 * @param ctx the parse tree
	 */
	enterFunctionReturnType?: (ctx: FunctionReturnTypeContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.functionReturnType`.
	 * @param ctx the parse tree
	 */
	exitFunctionReturnType?: (ctx: FunctionReturnTypeContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.value`.
	 * @param ctx the parse tree
	 */
	enterValue?: (ctx: ValueContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.value`.
	 * @param ctx the parse tree
	 */
	exitValue?: (ctx: ValueContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.coordinate`.
	 * @param ctx the parse tree
	 */
	enterCoordinate?: (ctx: CoordinateContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.coordinate`.
	 * @param ctx the parse tree
	 */
	exitCoordinate?: (ctx: CoordinateContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.coordinateDimension`.
	 * @param ctx the parse tree
	 */
	enterCoordinateDimension?: (ctx: CoordinateDimensionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.coordinateDimension`.
	 * @param ctx the parse tree
	 */
	exitCoordinateDimension?: (ctx: CoordinateDimensionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.className`.
	 * @param ctx the parse tree
	 */
	enterClassName?: (ctx: ClassNameContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.className`.
	 * @param ctx the parse tree
	 */
	exitClassName?: (ctx: ClassNameContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.typeList`.
	 * @param ctx the parse tree
	 */
	enterTypeList?: (ctx: TypeListContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.typeList`.
	 * @param ctx the parse tree
	 */
	exitTypeList?: (ctx: TypeListContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.classWithoutNamespace`.
	 * @param ctx the parse tree
	 */
	enterClassWithoutNamespace?: (ctx: ClassWithoutNamespaceContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.classWithoutNamespace`.
	 * @param ctx the parse tree
	 */
	exitClassWithoutNamespace?: (ctx: ClassWithoutNamespaceContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.annotation`.
	 * @param ctx the parse tree
	 */
	enterAnnotation?: (ctx: AnnotationContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.annotation`.
	 * @param ctx the parse tree
	 */
	exitAnnotation?: (ctx: AnnotationContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.annotationArgs`.
	 * @param ctx the parse tree
	 */
	enterAnnotationArgs?: (ctx: AnnotationArgsContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.annotationArgs`.
	 * @param ctx the parse tree
	 */
	exitAnnotationArgs?: (ctx: AnnotationArgsContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.range`.
	 * @param ctx the parse tree
	 */
	enterRange?: (ctx: RangeContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.range`.
	 * @param ctx the parse tree
	 */
	exitRange?: (ctx: RangeContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtValue`.
	 * @param ctx the parse tree
	 */
	enterNbtValue?: (ctx: NbtValueContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtValue`.
	 * @param ctx the parse tree
	 */
	exitNbtValue?: (ctx: NbtValueContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtByte`.
	 * @param ctx the parse tree
	 */
	enterNbtByte?: (ctx: NbtByteContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtByte`.
	 * @param ctx the parse tree
	 */
	exitNbtByte?: (ctx: NbtByteContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtShort`.
	 * @param ctx the parse tree
	 */
	enterNbtShort?: (ctx: NbtShortContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtShort`.
	 * @param ctx the parse tree
	 */
	exitNbtShort?: (ctx: NbtShortContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtInt`.
	 * @param ctx the parse tree
	 */
	enterNbtInt?: (ctx: NbtIntContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtInt`.
	 * @param ctx the parse tree
	 */
	exitNbtInt?: (ctx: NbtIntContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtLong`.
	 * @param ctx the parse tree
	 */
	enterNbtLong?: (ctx: NbtLongContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtLong`.
	 * @param ctx the parse tree
	 */
	exitNbtLong?: (ctx: NbtLongContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtFloat`.
	 * @param ctx the parse tree
	 */
	enterNbtFloat?: (ctx: NbtFloatContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtFloat`.
	 * @param ctx the parse tree
	 */
	exitNbtFloat?: (ctx: NbtFloatContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtDouble`.
	 * @param ctx the parse tree
	 */
	enterNbtDouble?: (ctx: NbtDoubleContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtDouble`.
	 * @param ctx the parse tree
	 */
	exitNbtDouble?: (ctx: NbtDoubleContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtBool`.
	 * @param ctx the parse tree
	 */
	enterNbtBool?: (ctx: NbtBoolContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtBool`.
	 * @param ctx the parse tree
	 */
	exitNbtBool?: (ctx: NbtBoolContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtByteArray`.
	 * @param ctx the parse tree
	 */
	enterNbtByteArray?: (ctx: NbtByteArrayContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtByteArray`.
	 * @param ctx the parse tree
	 */
	exitNbtByteArray?: (ctx: NbtByteArrayContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtIntArray`.
	 * @param ctx the parse tree
	 */
	enterNbtIntArray?: (ctx: NbtIntArrayContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtIntArray`.
	 * @param ctx the parse tree
	 */
	exitNbtIntArray?: (ctx: NbtIntArrayContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtLongArray`.
	 * @param ctx the parse tree
	 */
	enterNbtLongArray?: (ctx: NbtLongArrayContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtLongArray`.
	 * @param ctx the parse tree
	 */
	exitNbtLongArray?: (ctx: NbtLongArrayContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtList`.
	 * @param ctx the parse tree
	 */
	enterNbtList?: (ctx: NbtListContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtList`.
	 * @param ctx the parse tree
	 */
	exitNbtList?: (ctx: NbtListContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtKeyValuePair`.
	 * @param ctx the parse tree
	 */
	enterNbtKeyValuePair?: (ctx: NbtKeyValuePairContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtKeyValuePair`.
	 * @param ctx the parse tree
	 */
	exitNbtKeyValuePair?: (ctx: NbtKeyValuePairContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.nbtCompound`.
	 * @param ctx the parse tree
	 */
	enterNbtCompound?: (ctx: NbtCompoundContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.nbtCompound`.
	 * @param ctx the parse tree
	 */
	exitNbtCompound?: (ctx: NbtCompoundContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.multiLineStringLiteral`.
	 * @param ctx the parse tree
	 */
	enterMultiLineStringLiteral?: (ctx: MultiLineStringLiteralContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.multiLineStringLiteral`.
	 * @param ctx the parse tree
	 */
	exitMultiLineStringLiteral?: (ctx: MultiLineStringLiteralContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.multiLineStringContent`.
	 * @param ctx the parse tree
	 */
	enterMultiLineStringContent?: (ctx: MultiLineStringContentContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.multiLineStringContent`.
	 * @param ctx the parse tree
	 */
	exitMultiLineStringContent?: (ctx: MultiLineStringContentContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.multiLineStringExpression`.
	 * @param ctx the parse tree
	 */
	enterMultiLineStringExpression?: (ctx: MultiLineStringExpressionContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.multiLineStringExpression`.
	 * @param ctx the parse tree
	 */
	exitMultiLineStringExpression?: (ctx: MultiLineStringExpressionContext) => void;

	/**
	 * Enter a parse tree produced by `mcfppParser.doc_comment`.
	 * @param ctx the parse tree
	 */
	enterDoc_comment?: (ctx: Doc_commentContext) => void;
	/**
	 * Exit a parse tree produced by `mcfppParser.doc_comment`.
	 * @param ctx the parse tree
	 */
	exitDoc_comment?: (ctx: Doc_commentContext) => void;
}

