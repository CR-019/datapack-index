// Generated from .vitepress\antlr\mcfppParser.g4 by ANTLR 4.9.0-SNAPSHOT


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

import { mcfppParserListener } from "./mcfppParserListener";
import { mcfppParserVisitor } from "./mcfppParserVisitor";


export class mcfppParser extends Parser {
	public static readonly RESERVED = 1;
	public static readonly DOT = 2;
	public static readonly COMMA = 3;
	public static readonly LPAREN = 4;
	public static readonly RPAREN = 5;
	public static readonly LSQUARE = 6;
	public static readonly RSQUARE = 7;
	public static readonly LCURL = 8;
	public static readonly RCURL = 9;
	public static readonly MULT = 10;
	public static readonly MOD = 11;
	public static readonly DIV = 12;
	public static readonly ADD = 13;
	public static readonly SUB = 14;
	public static readonly INCR = 15;
	public static readonly DECR = 16;
	public static readonly CONJ = 17;
	public static readonly DISJ = 18;
	public static readonly EXCL = 19;
	public static readonly COLON = 20;
	public static readonly SEMICOLON = 21;
	public static readonly ASSIGNMENT = 22;
	public static readonly ADD_ASSIGNMENT = 23;
	public static readonly SUB_ASSIGNMENT = 24;
	public static readonly MULT_ASSIGNMENT = 25;
	public static readonly DIV_ASSIGNMENT = 26;
	public static readonly MOD_ASSIGNMENT = 27;
	public static readonly ARROW = 28;
	public static readonly DOUBLE_ARROW = 29;
	public static readonly RANGE = 30;
	public static readonly COLONCOLON = 31;
	public static readonly HASH = 32;
	public static readonly AT = 33;
	public static readonly QUEST = 34;
	public static readonly LANGLE = 35;
	public static readonly RANGLE = 36;
	public static readonly LE = 37;
	public static readonly GE = 38;
	public static readonly EXCL_EQ = 39;
	public static readonly EQEQ = 40;
	public static readonly WVEQ = 41;
	public static readonly SINGLE_QUOTE = 42;
	public static readonly UNION = 43;
	public static readonly PIPE = 44;
	public static readonly TRIPLE_QUOTE_OPEN = 45;
	public static readonly THIS = 46;
	public static readonly SUPER = 47;
	public static readonly IF = 48;
	public static readonly ELSE = 49;
	public static readonly WHILE = 50;
	public static readonly FOR = 51;
	public static readonly DO = 52;
	public static readonly TRY = 53;
	public static readonly STORE = 54;
	public static readonly AS = 55;
	public static readonly FROM = 56;
	public static readonly EXECUTE = 57;
	public static readonly BREAK = 58;
	public static readonly CONTINUE = 59;
	public static readonly RETURN = 60;
	public static readonly STATIC = 61;
	public static readonly EXTENDS = 62;
	public static readonly NATIVE = 63;
	public static readonly CONCRETE = 64;
	public static readonly FINAL = 65;
	public static readonly PUBLIC = 66;
	public static readonly PROTECTED = 67;
	public static readonly PRIVATE = 68;
	public static readonly OVERRIDE = 69;
	public static readonly ABSTRACT = 70;
	public static readonly IMPL = 71;
	public static readonly CONST = 72;
	public static readonly DYNAMIC = 73;
	public static readonly IMPORT = 74;
	public static readonly INLINE = 75;
	public static readonly CLASS = 76;
	public static readonly OBJECT = 77;
	public static readonly INTERFACE = 78;
	public static readonly DATA = 79;
	public static readonly FUNCTION = 80;
	public static readonly ENUM = 81;
	public static readonly OPERATOR = 82;
	public static readonly TYPEALIAS = 83;
	public static readonly CONSTRUCTOR = 84;
	public static readonly GLOBAL = 85;
	public static readonly VAR = 86;
	public static readonly GET = 87;
	public static readonly SET = 88;
	public static readonly NAMESPACE = 89;
	public static readonly VEC = 90;
	public static readonly INT = 91;
	public static readonly ENTITY = 92;
	public static readonly BOOL = 93;
	public static readonly BYTE = 94;
	public static readonly SHORT = 95;
	public static readonly LONG = 96;
	public static readonly FLOAT = 97;
	public static readonly DOUBLE = 98;
	public static readonly SELECTOR = 99;
	public static readonly STRING = 100;
	public static readonly JTEXT = 101;
	public static readonly NBT = 102;
	public static readonly ANY = 103;
	public static readonly VOID = 104;
	public static readonly LIST = 105;
	public static readonly MAP = 106;
	public static readonly DICT = 107;
	public static readonly TYPE = 108;
	public static readonly BYTEARRAY = 109;
	public static readonly INTARRAY = 110;
	public static readonly LONGARRAY = 111;
	public static readonly TRUE = 112;
	public static readonly FALSE = 113;
	public static readonly NULL = 114;
	public static readonly VecType = 115;
	public static readonly TargetSelector = 116;
	public static readonly Identifier = 117;
	public static readonly Letter = 118;
	public static readonly NBT_BYTE_ARRAY_BEGIN = 119;
	public static readonly NBT_INT_ARRAY_BEGIN = 120;
	public static readonly NBT_LONG_ARRAY_BEGIN = 121;
	public static readonly NBTByte = 122;
	public static readonly NBTShort = 123;
	public static readonly NBTInt = 124;
	public static readonly NBTLong = 125;
	public static readonly NBTFloat = 126;
	public static readonly NBTDouble = 127;
	public static readonly NBTBool = 128;
	public static readonly FloatConstant = 129;
	public static readonly RelativeValue = 130;
	public static readonly BooleanConstant = 131;
	public static readonly LineString = 132;
	public static readonly WS = 133;
	public static readonly DOC_COMMENT = 134;
	public static readonly BLOCK_COMMENT = 135;
	public static readonly LINE_COMMENT = 136;
	public static readonly UNICODE_CLASS_CC = 137;
	public static readonly UNICODE_CLASS_CF = 138;
	public static readonly UNICODE_CLASS_CO = 139;
	public static readonly UNICODE_CLASS_CS = 140;
	public static readonly UNICODE_CLASS_LL = 141;
	public static readonly UNICODE_CLASS_LM = 142;
	public static readonly UNICODE_CLASS_LO = 143;
	public static readonly UNICODE_CLASS_LT = 144;
	public static readonly UNICODE_CLASS_LU = 145;
	public static readonly UNICODE_CLASS_MC = 146;
	public static readonly UNICODE_CLASS_ME = 147;
	public static readonly UNICODE_CLASS_MN = 148;
	public static readonly UNICODE_CLASS_ND = 149;
	public static readonly UNICODE_CLASS_NL = 150;
	public static readonly UNICODE_CLASS_NO = 151;
	public static readonly UNICODE_CLASS_PC = 152;
	public static readonly UNICODE_CLASS_PD = 153;
	public static readonly UNICODE_CLASS_PE = 154;
	public static readonly UNICODE_CLASS_PF = 155;
	public static readonly UNICODE_CLASS_PI = 156;
	public static readonly UNICODE_CLASS_PO = 157;
	public static readonly UNICODE_CLASS_PS = 158;
	public static readonly UNICODE_CLASS_SC = 159;
	public static readonly UNICODE_CLASS_SK = 160;
	public static readonly UNICODE_CLASS_SM = 161;
	public static readonly UNICODE_CLASS_SO = 162;
	public static readonly UNICODE_CLASS_ZL = 163;
	public static readonly UNICODE_CLASS_ZP = 164;
	public static readonly UNICODE_CLASS_ZS = 165;
	public static readonly OrgCommandText = 166;
	public static readonly OrgCommandExprStart = 167;
	public static readonly OrgCommandEnd = 168;
	public static readonly TRIPLE_QUOTE_CLOSE = 169;
	public static readonly MultiLineStringQuote = 170;
	public static readonly MultiLineStrExprStart = 171;
	public static readonly MultiLineStrText = 172;
	public static readonly RULE_compilationUnit = 0;
	public static readonly RULE_topStatement = 1;
	public static readonly RULE_namespaceDeclaration = 2;
	public static readonly RULE_importDeclaration = 3;
	public static readonly RULE_importType = 4;
	public static readonly RULE_typealiasDeclaration = 5;
	public static readonly RULE_typeDeclaration = 6;
	public static readonly RULE_declarations = 7;
	public static readonly RULE_namespaceFieldDeclaration = 8;
	public static readonly RULE_namespaceFieldDeclarationExpression = 9;
	public static readonly RULE_classDeclaration = 10;
	public static readonly RULE_objectClassDeclaration = 11;
	public static readonly RULE_compileTimeClassDeclaration = 12;
	public static readonly RULE_nativeClassDeclaration = 13;
	public static readonly RULE_classMemberDeclaration = 14;
	public static readonly RULE_classBody = 15;
	public static readonly RULE_classMember = 16;
	public static readonly RULE_classFunctionDeclaration = 17;
	public static readonly RULE_abstractClassFunctionDeclaration = 18;
	public static readonly RULE_nativeClassFunctionDeclaration = 19;
	public static readonly RULE_operationOverrideDeclaration = 20;
	public static readonly RULE_nativeOperationOverrideDeclaration = 21;
	public static readonly RULE_supportOperator = 22;
	public static readonly RULE_classFieldDeclaration = 23;
	public static readonly RULE_accessor = 24;
	public static readonly RULE_getter = 25;
	public static readonly RULE_setter = 26;
	public static readonly RULE_genericClassImplement = 27;
	public static readonly RULE_templateDeclaration = 28;
	public static readonly RULE_objectTemplateDeclaration = 29;
	public static readonly RULE_templateBody = 30;
	public static readonly RULE_templateMemberDeclaration = 31;
	public static readonly RULE_templateMember = 32;
	public static readonly RULE_templateFunctionDeclaration = 33;
	public static readonly RULE_templateFieldDeclaration = 34;
	public static readonly RULE_templateType = 35;
	public static readonly RULE_singleTemplateFieldType = 36;
	public static readonly RULE_unionTemplateFieldType = 37;
	public static readonly RULE_interfaceDeclaration = 38;
	public static readonly RULE_interfaceBody = 39;
	public static readonly RULE_interfaceFunctionDeclaration = 40;
	public static readonly RULE_compileTimeFuncDeclaration = 41;
	public static readonly RULE_inlineFunctionDeclaration = 42;
	public static readonly RULE_functionDeclaration = 43;
	public static readonly RULE_extensionFunctionDeclaration = 44;
	public static readonly RULE_enumDeclaration = 45;
	public static readonly RULE_enumBody = 46;
	public static readonly RULE_enumMember = 47;
	public static readonly RULE_namespaceID = 48;
	public static readonly RULE_nativeFuncDeclaration = 49;
	public static readonly RULE_javaRefer = 50;
	public static readonly RULE_accessModifier = 51;
	public static readonly RULE_classConstructorDeclaration = 52;
	public static readonly RULE_templateConstructorDeclaration = 53;
	public static readonly RULE_fieldDeclaration = 54;
	public static readonly RULE_fieldDeclarationExpression = 55;
	public static readonly RULE_fieldModifier = 56;
	public static readonly RULE_functionParams = 57;
	public static readonly RULE_readOnlyParams = 58;
	public static readonly RULE_normalParams = 59;
	public static readonly RULE_parameterList = 60;
	public static readonly RULE_parameter = 61;
	public static readonly RULE_expression = 62;
	public static readonly RULE_statementExpression = 63;
	public static readonly RULE_conditionalExpression = 64;
	public static readonly RULE_commonBinaryOperatorExpression = 65;
	public static readonly RULE_commonBinaryOperator = 66;
	public static readonly RULE_conditionalOrExpression = 67;
	public static readonly RULE_conditionalAndExpression = 68;
	public static readonly RULE_equalityExpression = 69;
	public static readonly RULE_relationalExpression = 70;
	public static readonly RULE_relationalOp = 71;
	public static readonly RULE_additiveExpression = 72;
	public static readonly RULE_multiplicativeExpression = 73;
	public static readonly RULE_unaryExpression = 74;
	public static readonly RULE_rightVarExpression = 75;
	public static readonly RULE_castExpression = 76;
	public static readonly RULE_varWithSelector = 77;
	public static readonly RULE_jvmAccessExpression = 78;
	public static readonly RULE_propertyOperator = 79;
	public static readonly RULE_propertyOperatorExpression = 80;
	public static readonly RULE_primary = 81;
	public static readonly RULE_var = 82;
	public static readonly RULE_bucketExpression = 83;
	public static readonly RULE_varWithSuffix = 84;
	public static readonly RULE_functionCall = 85;
	public static readonly RULE_identifierSuffix = 86;
	public static readonly RULE_objectInitializer = 87;
	public static readonly RULE_selector = 88;
	public static readonly RULE_arguments = 89;
	public static readonly RULE_readOnlyArgs = 90;
	public static readonly RULE_normalArgs = 91;
	public static readonly RULE_functionBody = 92;
	public static readonly RULE_statement = 93;
	public static readonly RULE_executeStatement = 94;
	public static readonly RULE_executeContext = 95;
	public static readonly RULE_executeExpression = 96;
	public static readonly RULE_orgCommand = 97;
	public static readonly RULE_orgCommandContent = 98;
	public static readonly RULE_orgCommandExpression = 99;
	public static readonly RULE_controlStatement = 100;
	public static readonly RULE_ifStatement = 101;
	public static readonly RULE_elseIfStatement = 102;
	public static readonly RULE_elseStatement = 103;
	public static readonly RULE_ifBlock = 104;
	public static readonly RULE_whileStatement = 105;
	public static readonly RULE_whileBlock = 106;
	public static readonly RULE_doWhileStatement = 107;
	public static readonly RULE_doWhileBlock = 108;
	public static readonly RULE_selfAddOrMinusStatement = 109;
	public static readonly RULE_tryStoreStatement = 110;
	public static readonly RULE_returnStatement = 111;
	public static readonly RULE_block = 112;
	public static readonly RULE_selfAddOrMinusExpression = 113;
	public static readonly RULE_expressionList = 114;
	public static readonly RULE_type = 115;
	public static readonly RULE_typeWithoutExcl = 116;
	public static readonly RULE_anonymousTemplateType = 117;
	public static readonly RULE_unionTemplateType = 118;
	public static readonly RULE_normalType = 119;
	public static readonly RULE_functionReturnType = 120;
	public static readonly RULE_value = 121;
	public static readonly RULE_coordinate = 122;
	public static readonly RULE_coordinateDimension = 123;
	public static readonly RULE_className = 124;
	public static readonly RULE_typeList = 125;
	public static readonly RULE_classWithoutNamespace = 126;
	public static readonly RULE_annotation = 127;
	public static readonly RULE_annotationArgs = 128;
	public static readonly RULE_range = 129;
	public static readonly RULE_nbtValue = 130;
	public static readonly RULE_nbtByte = 131;
	public static readonly RULE_nbtShort = 132;
	public static readonly RULE_nbtInt = 133;
	public static readonly RULE_nbtLong = 134;
	public static readonly RULE_nbtFloat = 135;
	public static readonly RULE_nbtDouble = 136;
	public static readonly RULE_nbtBool = 137;
	public static readonly RULE_nbtByteArray = 138;
	public static readonly RULE_nbtIntArray = 139;
	public static readonly RULE_nbtLongArray = 140;
	public static readonly RULE_nbtList = 141;
	public static readonly RULE_nbtKeyValuePair = 142;
	public static readonly RULE_nbtCompound = 143;
	public static readonly RULE_multiLineStringLiteral = 144;
	public static readonly RULE_multiLineStringContent = 145;
	public static readonly RULE_multiLineStringExpression = 146;
	public static readonly RULE_doc_comment = 147;
	// tslint:disable:no-trailing-whitespace
	public static readonly ruleNames: string[] = [
		"compilationUnit", "topStatement", "namespaceDeclaration", "importDeclaration", 
		"importType", "typealiasDeclaration", "typeDeclaration", "declarations", 
		"namespaceFieldDeclaration", "namespaceFieldDeclarationExpression", "classDeclaration", 
		"objectClassDeclaration", "compileTimeClassDeclaration", "nativeClassDeclaration", 
		"classMemberDeclaration", "classBody", "classMember", "classFunctionDeclaration", 
		"abstractClassFunctionDeclaration", "nativeClassFunctionDeclaration", 
		"operationOverrideDeclaration", "nativeOperationOverrideDeclaration", 
		"supportOperator", "classFieldDeclaration", "accessor", "getter", "setter", 
		"genericClassImplement", "templateDeclaration", "objectTemplateDeclaration", 
		"templateBody", "templateMemberDeclaration", "templateMember", "templateFunctionDeclaration", 
		"templateFieldDeclaration", "templateType", "singleTemplateFieldType", 
		"unionTemplateFieldType", "interfaceDeclaration", "interfaceBody", "interfaceFunctionDeclaration", 
		"compileTimeFuncDeclaration", "inlineFunctionDeclaration", "functionDeclaration", 
		"extensionFunctionDeclaration", "enumDeclaration", "enumBody", "enumMember", 
		"namespaceID", "nativeFuncDeclaration", "javaRefer", "accessModifier", 
		"classConstructorDeclaration", "templateConstructorDeclaration", "fieldDeclaration", 
		"fieldDeclarationExpression", "fieldModifier", "functionParams", "readOnlyParams", 
		"normalParams", "parameterList", "parameter", "expression", "statementExpression", 
		"conditionalExpression", "commonBinaryOperatorExpression", "commonBinaryOperator", 
		"conditionalOrExpression", "conditionalAndExpression", "equalityExpression", 
		"relationalExpression", "relationalOp", "additiveExpression", "multiplicativeExpression", 
		"unaryExpression", "rightVarExpression", "castExpression", "varWithSelector", 
		"jvmAccessExpression", "propertyOperator", "propertyOperatorExpression", 
		"primary", "var", "bucketExpression", "varWithSuffix", "functionCall", 
		"identifierSuffix", "objectInitializer", "selector", "arguments", "readOnlyArgs", 
		"normalArgs", "functionBody", "statement", "executeStatement", "executeContext", 
		"executeExpression", "orgCommand", "orgCommandContent", "orgCommandExpression", 
		"controlStatement", "ifStatement", "elseIfStatement", "elseStatement", 
		"ifBlock", "whileStatement", "whileBlock", "doWhileStatement", "doWhileBlock", 
		"selfAddOrMinusStatement", "tryStoreStatement", "returnStatement", "block", 
		"selfAddOrMinusExpression", "expressionList", "type", "typeWithoutExcl", 
		"anonymousTemplateType", "unionTemplateType", "normalType", "functionReturnType", 
		"value", "coordinate", "coordinateDimension", "className", "typeList", 
		"classWithoutNamespace", "annotation", "annotationArgs", "range", "nbtValue", 
		"nbtByte", "nbtShort", "nbtInt", "nbtLong", "nbtFloat", "nbtDouble", "nbtBool", 
		"nbtByteArray", "nbtIntArray", "nbtLongArray", "nbtList", "nbtKeyValuePair", 
		"nbtCompound", "multiLineStringLiteral", "multiLineStringContent", "multiLineStringExpression", 
		"doc_comment",
	];

	private static readonly _LITERAL_NAMES: Array<string | undefined> = [
		undefined, "'...'", "'.'", "','", "'('", "')'", "'['", "']'", "'{'", "'}'", 
		"'*'", "'%'", "'/'", "'+'", "'-'", "'++'", "'--'", "'&&'", "'||'", "'!'", 
		"':'", "';'", "'='", "'+='", "'-='", "'*='", "'/='", "'%='", "'->'", "'=>'", 
		"'..'", "'::'", "'#'", "'@'", "'?'", "'<'", "'>'", "'<='", "'>='", "'!='", 
		"'=='", "'~='", "'''", "'&'", "'|'", "'\"\"\"'", "'this'", "'super'", 
		"'if'", "'else'", "'while'", "'for'", "'do'", "'try'", "'store'", "'as'", 
		"'from'", "'execute'", "'break'", "'continue'", "'return'", "'static'", 
		"'extends'", "'native'", "'concrete'", "'final'", "'public'", "'protected'", 
		"'private'", "'override'", "'abstract'", "'impl'", "'const'", "'dynamic'", 
		"'import'", "'inline'", "'class'", "'object'", "'interface'", "'data'", 
		"'func'", "'enum'", "'operator'", "'typealias'", "'constructor'", "'global'", 
		"'var'", "'get'", "'set'", "'namespace'", "'vec'", "'int'", "'entity'", 
		"'bool'", "'byte'", "'short'", "'long'", "'float'", "'double'", "'selector'", 
		"'string'", "'text'", "'nbt'", "'any'", "'void'", "'list'", "'map'", "'dict'", 
		"'Type'", "'ByteArray'", "'IntArray'", "'LongArray'", "'true'", "'false'", 
		"'null'", undefined, undefined, undefined, undefined, "'[B;'", "'[I;'", 
		"'[L;'", undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		undefined, undefined, undefined, undefined, undefined, undefined, undefined, 
		"'\u2028'", "'\u2029'",
	];
	private static readonly _SYMBOLIC_NAMES: Array<string | undefined> = [
		undefined, "RESERVED", "DOT", "COMMA", "LPAREN", "RPAREN", "LSQUARE", 
		"RSQUARE", "LCURL", "RCURL", "MULT", "MOD", "DIV", "ADD", "SUB", "INCR", 
		"DECR", "CONJ", "DISJ", "EXCL", "COLON", "SEMICOLON", "ASSIGNMENT", "ADD_ASSIGNMENT", 
		"SUB_ASSIGNMENT", "MULT_ASSIGNMENT", "DIV_ASSIGNMENT", "MOD_ASSIGNMENT", 
		"ARROW", "DOUBLE_ARROW", "RANGE", "COLONCOLON", "HASH", "AT", "QUEST", 
		"LANGLE", "RANGLE", "LE", "GE", "EXCL_EQ", "EQEQ", "WVEQ", "SINGLE_QUOTE", 
		"UNION", "PIPE", "TRIPLE_QUOTE_OPEN", "THIS", "SUPER", "IF", "ELSE", "WHILE", 
		"FOR", "DO", "TRY", "STORE", "AS", "FROM", "EXECUTE", "BREAK", "CONTINUE", 
		"RETURN", "STATIC", "EXTENDS", "NATIVE", "CONCRETE", "FINAL", "PUBLIC", 
		"PROTECTED", "PRIVATE", "OVERRIDE", "ABSTRACT", "IMPL", "CONST", "DYNAMIC", 
		"IMPORT", "INLINE", "CLASS", "OBJECT", "INTERFACE", "DATA", "FUNCTION", 
		"ENUM", "OPERATOR", "TYPEALIAS", "CONSTRUCTOR", "GLOBAL", "VAR", "GET", 
		"SET", "NAMESPACE", "VEC", "INT", "ENTITY", "BOOL", "BYTE", "SHORT", "LONG", 
		"FLOAT", "DOUBLE", "SELECTOR", "STRING", "JTEXT", "NBT", "ANY", "VOID", 
		"LIST", "MAP", "DICT", "TYPE", "BYTEARRAY", "INTARRAY", "LONGARRAY", "TRUE", 
		"FALSE", "NULL", "VecType", "TargetSelector", "Identifier", "Letter", 
		"NBT_BYTE_ARRAY_BEGIN", "NBT_INT_ARRAY_BEGIN", "NBT_LONG_ARRAY_BEGIN", 
		"NBTByte", "NBTShort", "NBTInt", "NBTLong", "NBTFloat", "NBTDouble", "NBTBool", 
		"FloatConstant", "RelativeValue", "BooleanConstant", "LineString", "WS", 
		"DOC_COMMENT", "BLOCK_COMMENT", "LINE_COMMENT", "UNICODE_CLASS_CC", "UNICODE_CLASS_CF", 
		"UNICODE_CLASS_CO", "UNICODE_CLASS_CS", "UNICODE_CLASS_LL", "UNICODE_CLASS_LM", 
		"UNICODE_CLASS_LO", "UNICODE_CLASS_LT", "UNICODE_CLASS_LU", "UNICODE_CLASS_MC", 
		"UNICODE_CLASS_ME", "UNICODE_CLASS_MN", "UNICODE_CLASS_ND", "UNICODE_CLASS_NL", 
		"UNICODE_CLASS_NO", "UNICODE_CLASS_PC", "UNICODE_CLASS_PD", "UNICODE_CLASS_PE", 
		"UNICODE_CLASS_PF", "UNICODE_CLASS_PI", "UNICODE_CLASS_PO", "UNICODE_CLASS_PS", 
		"UNICODE_CLASS_SC", "UNICODE_CLASS_SK", "UNICODE_CLASS_SM", "UNICODE_CLASS_SO", 
		"UNICODE_CLASS_ZL", "UNICODE_CLASS_ZP", "UNICODE_CLASS_ZS", "OrgCommandText", 
		"OrgCommandExprStart", "OrgCommandEnd", "TRIPLE_QUOTE_CLOSE", "MultiLineStringQuote", 
		"MultiLineStrExprStart", "MultiLineStrText",
	];
	public static readonly VOCABULARY: Vocabulary = new VocabularyImpl(mcfppParser._LITERAL_NAMES, mcfppParser._SYMBOLIC_NAMES, []);

	// @Override
	// @NotNull
	public get vocabulary(): Vocabulary {
		return mcfppParser.VOCABULARY;
	}
	// tslint:enable:no-trailing-whitespace

	// @Override
	public get grammarFileName(): string { return "mcfppParser.g4"; }

	// @Override
	public get ruleNames(): string[] { return mcfppParser.ruleNames; }

	// @Override
	public get serializedATN(): string { return mcfppParser._serializedATN; }

	protected createFailedPredicateException(predicate?: string, message?: string): FailedPredicateException {
		return new FailedPredicateException(this, predicate, message);
	}

	constructor(input: TokenStream) {
		super(input);
		this._interp = new ParserATNSimulator(mcfppParser._ATN, this);
	}
	// @RuleVersion(0)
	public compilationUnit(): CompilationUnitContext {
		let _localctx: CompilationUnitContext = new CompilationUnitContext(this._ctx, this.state);
		this.enterRule(_localctx, 0, mcfppParser.RULE_compilationUnit);
		let _la: number;
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 297;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 0, this._ctx) ) {
			case 1:
				{
				this.state = 296;
				this.namespaceDeclaration();
				}
				break;
			}
			this.state = 302;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 1, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 299;
					this.importDeclaration();
					}
					}
				}
				this.state = 304;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 1, this._ctx);
			}
			this.state = 308;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.TYPEALIAS) {
				{
				{
				this.state = 305;
				this.typealiasDeclaration();
				}
				}
				this.state = 310;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 314;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.LPAREN || _la === mcfppParser.AT || ((((_la - 61)) & ~0x1F) === 0 && ((1 << (_la - 61)) & ((1 << (mcfppParser.STATIC - 61)) | (1 << (mcfppParser.FINAL - 61)) | (1 << (mcfppParser.ABSTRACT - 61)) | (1 << (mcfppParser.IMPL - 61)) | (1 << (mcfppParser.CONST - 61)) | (1 << (mcfppParser.DYNAMIC - 61)) | (1 << (mcfppParser.IMPORT - 61)) | (1 << (mcfppParser.INLINE - 61)) | (1 << (mcfppParser.CLASS - 61)) | (1 << (mcfppParser.OBJECT - 61)) | (1 << (mcfppParser.INTERFACE - 61)) | (1 << (mcfppParser.DATA - 61)) | (1 << (mcfppParser.FUNCTION - 61)) | (1 << (mcfppParser.ENUM - 61)) | (1 << (mcfppParser.VAR - 61)) | (1 << (mcfppParser.INT - 61)) | (1 << (mcfppParser.ENTITY - 61)))) !== 0) || ((((_la - 93)) & ~0x1F) === 0 && ((1 << (_la - 93)) & ((1 << (mcfppParser.BOOL - 93)) | (1 << (mcfppParser.BYTE - 93)) | (1 << (mcfppParser.SHORT - 93)) | (1 << (mcfppParser.LONG - 93)) | (1 << (mcfppParser.FLOAT - 93)) | (1 << (mcfppParser.DOUBLE - 93)) | (1 << (mcfppParser.SELECTOR - 93)) | (1 << (mcfppParser.STRING - 93)) | (1 << (mcfppParser.JTEXT - 93)) | (1 << (mcfppParser.NBT - 93)) | (1 << (mcfppParser.ANY - 93)) | (1 << (mcfppParser.LIST - 93)) | (1 << (mcfppParser.MAP - 93)) | (1 << (mcfppParser.DICT - 93)) | (1 << (mcfppParser.TYPE - 93)) | (1 << (mcfppParser.BYTEARRAY - 93)) | (1 << (mcfppParser.INTARRAY - 93)) | (1 << (mcfppParser.LONGARRAY - 93)) | (1 << (mcfppParser.VecType - 93)) | (1 << (mcfppParser.Identifier - 93)))) !== 0) || _la === mcfppParser.DOC_COMMENT) {
				{
				{
				this.state = 311;
				this.typeDeclaration();
				}
				}
				this.state = 316;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 317;
			this.match(mcfppParser.EOF);
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
	public topStatement(): TopStatementContext {
		let _localctx: TopStatementContext = new TopStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 2, mcfppParser.RULE_topStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 322;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppParser.LPAREN) | (1 << mcfppParser.LSQUARE) | (1 << mcfppParser.LCURL) | (1 << mcfppParser.DIV) | (1 << mcfppParser.EXCL) | (1 << mcfppParser.SEMICOLON) | (1 << mcfppParser.RANGE))) !== 0) || ((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (mcfppParser.TRIPLE_QUOTE_OPEN - 45)) | (1 << (mcfppParser.THIS - 45)) | (1 << (mcfppParser.SUPER - 45)) | (1 << (mcfppParser.IF - 45)) | (1 << (mcfppParser.WHILE - 45)) | (1 << (mcfppParser.DO - 45)) | (1 << (mcfppParser.TRY - 45)) | (1 << (mcfppParser.EXECUTE - 45)) | (1 << (mcfppParser.BREAK - 45)) | (1 << (mcfppParser.CONTINUE - 45)) | (1 << (mcfppParser.RETURN - 45)) | (1 << (mcfppParser.CONST - 45)) | (1 << (mcfppParser.DYNAMIC - 45)) | (1 << (mcfppParser.IMPORT - 45)))) !== 0) || ((((_la - 79)) & ~0x1F) === 0 && ((1 << (_la - 79)) & ((1 << (mcfppParser.DATA - 79)) | (1 << (mcfppParser.VAR - 79)) | (1 << (mcfppParser.INT - 79)) | (1 << (mcfppParser.ENTITY - 79)) | (1 << (mcfppParser.BOOL - 79)) | (1 << (mcfppParser.BYTE - 79)) | (1 << (mcfppParser.SHORT - 79)) | (1 << (mcfppParser.LONG - 79)) | (1 << (mcfppParser.FLOAT - 79)) | (1 << (mcfppParser.DOUBLE - 79)) | (1 << (mcfppParser.SELECTOR - 79)) | (1 << (mcfppParser.STRING - 79)) | (1 << (mcfppParser.JTEXT - 79)) | (1 << (mcfppParser.NBT - 79)) | (1 << (mcfppParser.ANY - 79)) | (1 << (mcfppParser.LIST - 79)) | (1 << (mcfppParser.MAP - 79)) | (1 << (mcfppParser.DICT - 79)) | (1 << (mcfppParser.TYPE - 79)) | (1 << (mcfppParser.BYTEARRAY - 79)) | (1 << (mcfppParser.INTARRAY - 79)))) !== 0) || ((((_la - 111)) & ~0x1F) === 0 && ((1 << (_la - 111)) & ((1 << (mcfppParser.LONGARRAY - 111)) | (1 << (mcfppParser.TRUE - 111)) | (1 << (mcfppParser.FALSE - 111)) | (1 << (mcfppParser.NULL - 111)) | (1 << (mcfppParser.VecType - 111)) | (1 << (mcfppParser.TargetSelector - 111)) | (1 << (mcfppParser.Identifier - 111)) | (1 << (mcfppParser.NBT_BYTE_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_INT_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_LONG_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBTByte - 111)) | (1 << (mcfppParser.NBTShort - 111)) | (1 << (mcfppParser.NBTInt - 111)) | (1 << (mcfppParser.NBTLong - 111)) | (1 << (mcfppParser.NBTFloat - 111)) | (1 << (mcfppParser.NBTDouble - 111)) | (1 << (mcfppParser.RelativeValue - 111)) | (1 << (mcfppParser.LineString - 111)))) !== 0)) {
				{
				{
				this.state = 319;
				this.statement();
				}
				}
				this.state = 324;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public namespaceDeclaration(): NamespaceDeclarationContext {
		let _localctx: NamespaceDeclarationContext = new NamespaceDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 4, mcfppParser.RULE_namespaceDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 326;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.DOC_COMMENT) {
				{
				this.state = 325;
				this.doc_comment();
				}
			}

			this.state = 328;
			this.match(mcfppParser.NAMESPACE);
			this.state = 329;
			this.match(mcfppParser.Identifier);
			this.state = 334;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.DOT) {
				{
				{
				this.state = 330;
				this.match(mcfppParser.DOT);
				this.state = 331;
				this.match(mcfppParser.Identifier);
				}
				}
				this.state = 336;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 337;
			this.match(mcfppParser.SEMICOLON);
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
	public importDeclaration(): ImportDeclarationContext {
		let _localctx: ImportDeclarationContext = new ImportDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 6, mcfppParser.RULE_importDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 339;
			this.match(mcfppParser.IMPORT);
			this.state = 340;
			this.importType();
			this.state = 343;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.AS) {
				{
				this.state = 341;
				this.match(mcfppParser.AS);
				this.state = 342;
				this.match(mcfppParser.Identifier);
				}
			}

			this.state = 347;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.FROM) {
				{
				this.state = 345;
				this.match(mcfppParser.FROM);
				this.state = 346;
				this.match(mcfppParser.Identifier);
				}
			}

			this.state = 349;
			this.match(mcfppParser.SEMICOLON);
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
	public importType(): ImportTypeContext {
		let _localctx: ImportTypeContext = new ImportTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 8, mcfppParser.RULE_importType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 351;
			this.match(mcfppParser.Identifier);
			this.state = 356;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.DOT) {
				{
				{
				this.state = 352;
				this.match(mcfppParser.DOT);
				this.state = 353;
				this.match(mcfppParser.Identifier);
				}
				}
				this.state = 358;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 359;
			this.match(mcfppParser.COLON);
			this.state = 360;
			_la = this._input.LA(1);
			if (!(_la === mcfppParser.MULT || _la === mcfppParser.Identifier)) {
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
	public typealiasDeclaration(): TypealiasDeclarationContext {
		let _localctx: TypealiasDeclarationContext = new TypealiasDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 10, mcfppParser.RULE_typealiasDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 362;
			this.match(mcfppParser.TYPEALIAS);
			this.state = 363;
			this.match(mcfppParser.Identifier);
			this.state = 364;
			this.match(mcfppParser.AS);
			this.state = 365;
			this.type();
			this.state = 366;
			this.match(mcfppParser.SEMICOLON);
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
	public typeDeclaration(): TypeDeclarationContext {
		let _localctx: TypeDeclarationContext = new TypeDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 12, mcfppParser.RULE_typeDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 369;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.DOC_COMMENT) {
				{
				this.state = 368;
				this.doc_comment();
				}
			}

			this.state = 371;
			this.declarations();
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
	public declarations(): DeclarationsContext {
		let _localctx: DeclarationsContext = new DeclarationsContext(this._ctx, this.state);
		this.enterRule(_localctx, 14, mcfppParser.RULE_declarations);
		try {
			this.state = 389;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 11, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 373;
				this.classDeclaration();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 374;
				this.genericClassImplement();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 375;
				this.objectClassDeclaration();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 376;
				this.functionDeclaration();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 377;
				this.inlineFunctionDeclaration();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 378;
				this.nativeFuncDeclaration();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 379;
				this.compileTimeFuncDeclaration();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 380;
				this.compileTimeClassDeclaration();
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 381;
				this.nativeClassDeclaration();
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 382;
				this.templateDeclaration();
				}
				break;

			case 11:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 383;
				this.objectTemplateDeclaration();
				}
				break;

			case 12:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 384;
				this.extensionFunctionDeclaration();
				}
				break;

			case 13:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 385;
				this.interfaceDeclaration();
				}
				break;

			case 14:
				this.enterOuterAlt(_localctx, 14);
				{
				this.state = 386;
				this.namespaceFieldDeclaration();
				}
				break;

			case 15:
				this.enterOuterAlt(_localctx, 15);
				{
				this.state = 387;
				this.enumDeclaration();
				}
				break;

			case 16:
				this.enterOuterAlt(_localctx, 16);
				{
				this.state = 388;
				this.annotation();
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
	public namespaceFieldDeclaration(): NamespaceFieldDeclarationContext {
		let _localctx: NamespaceFieldDeclarationContext = new NamespaceFieldDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 16, mcfppParser.RULE_namespaceFieldDeclaration);
		let _la: number;
		try {
			this.state = 410;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 15, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 392;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 72)) & ~0x1F) === 0 && ((1 << (_la - 72)) & ((1 << (mcfppParser.CONST - 72)) | (1 << (mcfppParser.DYNAMIC - 72)) | (1 << (mcfppParser.IMPORT - 72)))) !== 0)) {
					{
					this.state = 391;
					this.fieldModifier();
					}
				}

				this.state = 394;
				this.type();
				this.state = 395;
				this.namespaceFieldDeclarationExpression();
				this.state = 400;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 396;
					this.match(mcfppParser.COMMA);
					this.state = 397;
					this.namespaceFieldDeclarationExpression();
					}
					}
					this.state = 402;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 404;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (((((_la - 72)) & ~0x1F) === 0 && ((1 << (_la - 72)) & ((1 << (mcfppParser.CONST - 72)) | (1 << (mcfppParser.DYNAMIC - 72)) | (1 << (mcfppParser.IMPORT - 72)))) !== 0)) {
					{
					this.state = 403;
					this.fieldModifier();
					}
				}

				this.state = 406;
				this.match(mcfppParser.VAR);
				this.state = 407;
				this.match(mcfppParser.Identifier);
				this.state = 408;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 409;
				this.value();
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
	public namespaceFieldDeclarationExpression(): NamespaceFieldDeclarationExpressionContext {
		let _localctx: NamespaceFieldDeclarationExpressionContext = new NamespaceFieldDeclarationExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 18, mcfppParser.RULE_namespaceFieldDeclarationExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 412;
			this.match(mcfppParser.Identifier);
			this.state = 415;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ASSIGNMENT) {
				{
				this.state = 413;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 414;
				this.value();
				}
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
	public classDeclaration(): ClassDeclarationContext {
		let _localctx: ClassDeclarationContext = new ClassDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 20, mcfppParser.RULE_classDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 418;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.STATIC) {
				{
				this.state = 417;
				this.match(mcfppParser.STATIC);
				}
			}

			this.state = 421;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.FINAL) {
				{
				this.state = 420;
				this.match(mcfppParser.FINAL);
				}
			}

			this.state = 424;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ABSTRACT) {
				{
				this.state = 423;
				this.match(mcfppParser.ABSTRACT);
				}
			}

			this.state = 426;
			this.match(mcfppParser.CLASS);
			this.state = 427;
			this.classWithoutNamespace();
			this.state = 429;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LANGLE) {
				{
				this.state = 428;
				this.readOnlyParams();
				}
			}

			this.state = 440;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.COLON) {
				{
				this.state = 431;
				this.match(mcfppParser.COLON);
				this.state = 432;
				this.className();
				this.state = 437;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 433;
					this.match(mcfppParser.COMMA);
					this.state = 434;
					this.className();
					}
					}
					this.state = 439;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 444;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.LCURL:
				{
				this.state = 442;
				this.classBody();
				}
				break;
			case mcfppParser.SEMICOLON:
				{
				this.state = 443;
				this.match(mcfppParser.SEMICOLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public objectClassDeclaration(): ObjectClassDeclarationContext {
		let _localctx: ObjectClassDeclarationContext = new ObjectClassDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 22, mcfppParser.RULE_objectClassDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 447;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.FINAL) {
				{
				this.state = 446;
				this.match(mcfppParser.FINAL);
				}
			}

			this.state = 449;
			this.match(mcfppParser.OBJECT);
			this.state = 450;
			this.match(mcfppParser.CLASS);
			this.state = 451;
			this.classWithoutNamespace();
			this.state = 453;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LANGLE) {
				{
				this.state = 452;
				this.readOnlyParams();
				}
			}

			this.state = 464;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.COLON) {
				{
				this.state = 455;
				this.match(mcfppParser.COLON);
				this.state = 456;
				this.className();
				this.state = 461;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 457;
					this.match(mcfppParser.COMMA);
					this.state = 458;
					this.className();
					}
					}
					this.state = 463;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 468;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.LCURL:
				{
				this.state = 466;
				this.classBody();
				}
				break;
			case mcfppParser.SEMICOLON:
				{
				this.state = 467;
				this.match(mcfppParser.SEMICOLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public compileTimeClassDeclaration(): CompileTimeClassDeclarationContext {
		let _localctx: CompileTimeClassDeclarationContext = new CompileTimeClassDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 24, mcfppParser.RULE_compileTimeClassDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 470;
			this.match(mcfppParser.CONST);
			this.state = 471;
			this.match(mcfppParser.CLASS);
			this.state = 472;
			this.classWithoutNamespace();
			this.state = 482;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.COLON) {
				{
				this.state = 473;
				this.match(mcfppParser.COLON);
				this.state = 474;
				this.className();
				this.state = 479;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 475;
					this.match(mcfppParser.COMMA);
					this.state = 476;
					this.className();
					}
					}
					this.state = 481;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 484;
			this.classBody();
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
	public nativeClassDeclaration(): NativeClassDeclarationContext {
		let _localctx: NativeClassDeclarationContext = new NativeClassDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 26, mcfppParser.RULE_nativeClassDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 486;
			this.match(mcfppParser.CLASS);
			this.state = 487;
			this.classWithoutNamespace();
			this.state = 488;
			this.match(mcfppParser.ASSIGNMENT);
			this.state = 489;
			this.javaRefer();
			this.state = 490;
			this.match(mcfppParser.SEMICOLON);
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
	public classMemberDeclaration(): ClassMemberDeclarationContext {
		let _localctx: ClassMemberDeclarationContext = new ClassMemberDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 28, mcfppParser.RULE_classMemberDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 493;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 31, this._ctx) ) {
			case 1:
				{
				this.state = 492;
				this.accessModifier();
				}
				break;
			}
			this.state = 495;
			this.classMember();
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
	public classBody(): ClassBodyContext {
		let _localctx: ClassBodyContext = new ClassBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 30, mcfppParser.RULE_classBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 497;
			this.match(mcfppParser.LCURL);
			this.state = 504;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.AT || ((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (mcfppParser.PUBLIC - 66)) | (1 << (mcfppParser.PROTECTED - 66)) | (1 << (mcfppParser.PRIVATE - 66)) | (1 << (mcfppParser.OVERRIDE - 66)) | (1 << (mcfppParser.FUNCTION - 66)) | (1 << (mcfppParser.OPERATOR - 66)) | (1 << (mcfppParser.CONSTRUCTOR - 66)))) !== 0) || _la === mcfppParser.Identifier || _la === mcfppParser.DOC_COMMENT) {
				{
				{
				this.state = 499;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === mcfppParser.DOC_COMMENT) {
					{
					this.state = 498;
					this.doc_comment();
					}
				}

				this.state = 501;
				this.classMemberDeclaration();
				}
				}
				this.state = 506;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 507;
			this.match(mcfppParser.RCURL);
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
	public classMember(): ClassMemberContext {
		let _localctx: ClassMemberContext = new ClassMemberContext(this._ctx, this.state);
		this.enterRule(_localctx, 32, mcfppParser.RULE_classMember);
		try {
			this.state = 517;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 34, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 509;
				this.classFunctionDeclaration();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 510;
				this.classFieldDeclaration();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 511;
				this.classConstructorDeclaration();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 512;
				this.nativeClassFunctionDeclaration();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 513;
				this.abstractClassFunctionDeclaration();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 514;
				this.annotation();
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 515;
				this.operationOverrideDeclaration();
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 516;
				this.nativeOperationOverrideDeclaration();
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
	public classFunctionDeclaration(): ClassFunctionDeclarationContext {
		let _localctx: ClassFunctionDeclarationContext = new ClassFunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 34, mcfppParser.RULE_classFunctionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 520;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.OVERRIDE) {
				{
				this.state = 519;
				this.match(mcfppParser.OVERRIDE);
				}
			}

			this.state = 522;
			this.match(mcfppParser.FUNCTION);
			this.state = 523;
			this.match(mcfppParser.Identifier);
			this.state = 524;
			this.functionParams();
			this.state = 527;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 525;
				this.match(mcfppParser.ARROW);
				this.state = 526;
				this.functionReturnType();
				}
			}

			this.state = 529;
			this.match(mcfppParser.LCURL);
			this.state = 530;
			this.functionBody();
			this.state = 531;
			this.match(mcfppParser.RCURL);
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
	public abstractClassFunctionDeclaration(): AbstractClassFunctionDeclarationContext {
		let _localctx: AbstractClassFunctionDeclarationContext = new AbstractClassFunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 36, mcfppParser.RULE_abstractClassFunctionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 534;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.OVERRIDE) {
				{
				this.state = 533;
				this.match(mcfppParser.OVERRIDE);
				}
			}

			this.state = 536;
			this.match(mcfppParser.FUNCTION);
			this.state = 537;
			this.match(mcfppParser.Identifier);
			this.state = 538;
			this.functionParams();
			this.state = 541;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 539;
				this.match(mcfppParser.ARROW);
				this.state = 540;
				this.functionReturnType();
				}
			}

			this.state = 543;
			this.match(mcfppParser.SEMICOLON);
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
	public nativeClassFunctionDeclaration(): NativeClassFunctionDeclarationContext {
		let _localctx: NativeClassFunctionDeclarationContext = new NativeClassFunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 38, mcfppParser.RULE_nativeClassFunctionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 546;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.OVERRIDE) {
				{
				this.state = 545;
				this.match(mcfppParser.OVERRIDE);
				}
			}

			this.state = 548;
			this.match(mcfppParser.FUNCTION);
			this.state = 549;
			this.match(mcfppParser.Identifier);
			this.state = 550;
			this.functionParams();
			this.state = 553;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 551;
				this.match(mcfppParser.ARROW);
				this.state = 552;
				this.functionReturnType();
				}
			}

			this.state = 555;
			this.match(mcfppParser.ASSIGNMENT);
			this.state = 556;
			this.javaRefer();
			this.state = 557;
			this.match(mcfppParser.SEMICOLON);
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
	public operationOverrideDeclaration(): OperationOverrideDeclarationContext {
		let _localctx: OperationOverrideDeclarationContext = new OperationOverrideDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 40, mcfppParser.RULE_operationOverrideDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 559;
			this.match(mcfppParser.OPERATOR);
			this.state = 560;
			this.supportOperator();
			this.state = 561;
			this.functionParams();
			this.state = 564;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 562;
				this.match(mcfppParser.ARROW);
				this.state = 563;
				this.functionReturnType();
				}
			}

			this.state = 566;
			this.match(mcfppParser.LCURL);
			this.state = 567;
			this.functionBody();
			this.state = 568;
			this.match(mcfppParser.RCURL);
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
	public nativeOperationOverrideDeclaration(): NativeOperationOverrideDeclarationContext {
		let _localctx: NativeOperationOverrideDeclarationContext = new NativeOperationOverrideDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 42, mcfppParser.RULE_nativeOperationOverrideDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 570;
			this.match(mcfppParser.OPERATOR);
			this.state = 571;
			this.supportOperator();
			this.state = 572;
			this.functionParams();
			this.state = 575;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 573;
				this.match(mcfppParser.ARROW);
				this.state = 574;
				this.functionReturnType();
				}
			}

			this.state = 577;
			this.match(mcfppParser.ASSIGNMENT);
			this.state = 578;
			this.javaRefer();
			this.state = 579;
			this.match(mcfppParser.SEMICOLON);
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
	public supportOperator(): SupportOperatorContext {
		let _localctx: SupportOperatorContext = new SupportOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 44, mcfppParser.RULE_supportOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 581;
			_la = this._input.LA(1);
			if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppParser.MULT) | (1 << mcfppParser.MOD) | (1 << mcfppParser.DIV) | (1 << mcfppParser.ADD) | (1 << mcfppParser.SUB) | (1 << mcfppParser.CONJ) | (1 << mcfppParser.DISJ))) !== 0) || ((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & ((1 << (mcfppParser.LANGLE - 35)) | (1 << (mcfppParser.RANGLE - 35)) | (1 << (mcfppParser.LE - 35)) | (1 << (mcfppParser.GE - 35)) | (1 << (mcfppParser.EXCL_EQ - 35)) | (1 << (mcfppParser.EQEQ - 35)) | (1 << (mcfppParser.WVEQ - 35)) | (1 << (mcfppParser.PIPE - 35)))) !== 0) || _la === mcfppParser.Identifier)) {
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
	public classFieldDeclaration(): ClassFieldDeclarationContext {
		let _localctx: ClassFieldDeclarationContext = new ClassFieldDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 46, mcfppParser.RULE_classFieldDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 584;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (mcfppParser.PUBLIC - 66)) | (1 << (mcfppParser.PROTECTED - 66)) | (1 << (mcfppParser.PRIVATE - 66)))) !== 0)) {
				{
				this.state = 583;
				this.accessModifier();
				}
			}

			this.state = 586;
			this.match(mcfppParser.Identifier);
			this.state = 589;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.AS) {
				{
				this.state = 587;
				this.match(mcfppParser.AS);
				this.state = 588;
				this.type();
				}
			}

			this.state = 593;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ASSIGNMENT) {
				{
				this.state = 591;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 592;
				this.expression();
				}
			}

			this.state = 596;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LCURL) {
				{
				this.state = 595;
				this.accessor();
				}
			}

			this.state = 598;
			this.match(mcfppParser.SEMICOLON);
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
	public accessor(): AccessorContext {
		let _localctx: AccessorContext = new AccessorContext(this._ctx, this.state);
		this.enterRule(_localctx, 48, mcfppParser.RULE_accessor);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 600;
			this.match(mcfppParser.LCURL);
			this.state = 602;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.GET) {
				{
				this.state = 601;
				this.getter();
				}
			}

			this.state = 605;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.SET) {
				{
				this.state = 604;
				this.setter();
				}
			}

			this.state = 607;
			this.match(mcfppParser.RCURL);
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
	public getter(): GetterContext {
		let _localctx: GetterContext = new GetterContext(this._ctx, this.state);
		this.enterRule(_localctx, 50, mcfppParser.RULE_getter);
		try {
			this.state = 626;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 49, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 609;
				this.match(mcfppParser.GET);
				this.state = 610;
				this.match(mcfppParser.LCURL);
				this.state = 611;
				this.functionBody();
				this.state = 612;
				this.match(mcfppParser.RCURL);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 614;
				this.match(mcfppParser.GET);
				this.state = 615;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 616;
				this.javaRefer();
				this.state = 617;
				this.match(mcfppParser.SEMICOLON);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 619;
				this.match(mcfppParser.GET);
				this.state = 620;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 621;
				this.expression();
				this.state = 622;
				this.match(mcfppParser.SEMICOLON);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 624;
				this.match(mcfppParser.GET);
				this.state = 625;
				this.match(mcfppParser.SEMICOLON);
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
	public setter(): SetterContext {
		let _localctx: SetterContext = new SetterContext(this._ctx, this.state);
		this.enterRule(_localctx, 52, mcfppParser.RULE_setter);
		try {
			this.state = 645;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 50, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 628;
				this.match(mcfppParser.SET);
				this.state = 629;
				this.match(mcfppParser.LCURL);
				this.state = 630;
				this.functionBody();
				this.state = 631;
				this.match(mcfppParser.RCURL);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 633;
				this.match(mcfppParser.SET);
				this.state = 634;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 635;
				this.javaRefer();
				this.state = 636;
				this.match(mcfppParser.SEMICOLON);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 638;
				this.match(mcfppParser.SET);
				this.state = 639;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 640;
				this.expression();
				this.state = 641;
				this.match(mcfppParser.SEMICOLON);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 643;
				this.match(mcfppParser.SET);
				this.state = 644;
				this.match(mcfppParser.SEMICOLON);
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
	public genericClassImplement(): GenericClassImplementContext {
		let _localctx: GenericClassImplementContext = new GenericClassImplementContext(this._ctx, this.state);
		this.enterRule(_localctx, 54, mcfppParser.RULE_genericClassImplement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 647;
			this.match(mcfppParser.IMPL);
			this.state = 649;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.STATIC) {
				{
				this.state = 648;
				this.match(mcfppParser.STATIC);
				}
			}

			this.state = 652;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.FINAL) {
				{
				this.state = 651;
				this.match(mcfppParser.FINAL);
				}
			}

			this.state = 655;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ABSTRACT) {
				{
				this.state = 654;
				this.match(mcfppParser.ABSTRACT);
				}
			}

			this.state = 657;
			this.match(mcfppParser.CLASS);
			this.state = 658;
			this.classWithoutNamespace();
			this.state = 659;
			this.readOnlyArgs();
			this.state = 669;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.COLON) {
				{
				this.state = 660;
				this.match(mcfppParser.COLON);
				this.state = 661;
				this.className();
				this.state = 666;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 662;
					this.match(mcfppParser.COMMA);
					this.state = 663;
					this.className();
					}
					}
					this.state = 668;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 673;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.LCURL:
				{
				this.state = 671;
				this.classBody();
				}
				break;
			case mcfppParser.SEMICOLON:
				{
				this.state = 672;
				this.match(mcfppParser.SEMICOLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public templateDeclaration(): TemplateDeclarationContext {
		let _localctx: TemplateDeclarationContext = new TemplateDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 56, mcfppParser.RULE_templateDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 676;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.FINAL) {
				{
				this.state = 675;
				this.match(mcfppParser.FINAL);
				}
			}

			this.state = 678;
			this.match(mcfppParser.DATA);
			this.state = 679;
			this.classWithoutNamespace();
			this.state = 681;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LANGLE) {
				{
				this.state = 680;
				this.readOnlyParams();
				}
			}

			this.state = 694;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.COLON:
				{
				{
				this.state = 683;
				this.match(mcfppParser.COLON);
				this.state = 684;
				this.className();
				this.state = 689;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 685;
					this.match(mcfppParser.COMMA);
					this.state = 686;
					this.className();
					}
					}
					this.state = 691;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				}
				break;
			case mcfppParser.AS:
				{
				this.state = 692;
				this.match(mcfppParser.AS);
				this.state = 693;
				this.type();
				}
				break;
			case mcfppParser.LCURL:
			case mcfppParser.SEMICOLON:
				break;
			default:
				break;
			}
			this.state = 698;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.LCURL:
				{
				this.state = 696;
				this.templateBody();
				}
				break;
			case mcfppParser.SEMICOLON:
				{
				this.state = 697;
				this.match(mcfppParser.SEMICOLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public objectTemplateDeclaration(): ObjectTemplateDeclarationContext {
		let _localctx: ObjectTemplateDeclarationContext = new ObjectTemplateDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 58, mcfppParser.RULE_objectTemplateDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 701;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.FINAL) {
				{
				this.state = 700;
				this.match(mcfppParser.FINAL);
				}
			}

			this.state = 703;
			this.match(mcfppParser.OBJECT);
			this.state = 704;
			this.match(mcfppParser.DATA);
			this.state = 705;
			this.classWithoutNamespace();
			this.state = 707;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LANGLE) {
				{
				this.state = 706;
				this.readOnlyParams();
				}
			}

			this.state = 718;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 65, this._ctx) ) {
			case 1 + 1:
				{
				this.state = 709;
				this.match(mcfppParser.COLON);
				this.state = 710;
				this.className();
				this.state = 715;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 711;
					this.match(mcfppParser.COMMA);
					this.state = 712;
					this.className();
					}
					}
					this.state = 717;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				break;
			}
			this.state = 722;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.LCURL:
				{
				this.state = 720;
				this.templateBody();
				}
				break;
			case mcfppParser.SEMICOLON:
				{
				this.state = 721;
				this.match(mcfppParser.SEMICOLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public templateBody(): TemplateBodyContext {
		let _localctx: TemplateBodyContext = new TemplateBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 60, mcfppParser.RULE_templateBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 724;
			this.match(mcfppParser.LCURL);
			this.state = 731;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.AT || ((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (mcfppParser.PUBLIC - 66)) | (1 << (mcfppParser.PROTECTED - 66)) | (1 << (mcfppParser.PRIVATE - 66)) | (1 << (mcfppParser.OVERRIDE - 66)) | (1 << (mcfppParser.CONST - 66)) | (1 << (mcfppParser.FUNCTION - 66)) | (1 << (mcfppParser.OPERATOR - 66)) | (1 << (mcfppParser.CONSTRUCTOR - 66)))) !== 0) || _la === mcfppParser.Identifier || _la === mcfppParser.DOC_COMMENT) {
				{
				{
				this.state = 726;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === mcfppParser.DOC_COMMENT) {
					{
					this.state = 725;
					this.doc_comment();
					}
				}

				this.state = 728;
				this.templateMemberDeclaration();
				}
				}
				this.state = 733;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 734;
			this.match(mcfppParser.RCURL);
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
	public templateMemberDeclaration(): TemplateMemberDeclarationContext {
		let _localctx: TemplateMemberDeclarationContext = new TemplateMemberDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 62, mcfppParser.RULE_templateMemberDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 737;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 69, this._ctx) ) {
			case 1:
				{
				this.state = 736;
				this.accessModifier();
				}
				break;
			}
			this.state = 739;
			this.templateMember();
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
	public templateMember(): TemplateMemberContext {
		let _localctx: TemplateMemberContext = new TemplateMemberContext(this._ctx, this.state);
		this.enterRule(_localctx, 64, mcfppParser.RULE_templateMember);
		try {
			this.state = 747;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 70, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 741;
				this.templateFunctionDeclaration();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 742;
				this.templateFieldDeclaration();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 743;
				this.templateConstructorDeclaration();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 744;
				this.operationOverrideDeclaration();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 745;
				this.nativeOperationOverrideDeclaration();
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 746;
				this.annotation();
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
	public templateFunctionDeclaration(): TemplateFunctionDeclarationContext {
		let _localctx: TemplateFunctionDeclarationContext = new TemplateFunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 66, mcfppParser.RULE_templateFunctionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 750;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.OVERRIDE) {
				{
				this.state = 749;
				this.match(mcfppParser.OVERRIDE);
				}
			}

			this.state = 752;
			this.match(mcfppParser.FUNCTION);
			this.state = 753;
			this.match(mcfppParser.Identifier);
			this.state = 754;
			this.functionParams();
			this.state = 757;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 755;
				this.match(mcfppParser.ARROW);
				this.state = 756;
				this.functionReturnType();
				}
			}

			this.state = 759;
			this.match(mcfppParser.LCURL);
			this.state = 760;
			this.functionBody();
			this.state = 761;
			this.match(mcfppParser.RCURL);
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
	public templateFieldDeclaration(): TemplateFieldDeclarationContext {
		let _localctx: TemplateFieldDeclarationContext = new TemplateFieldDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 68, mcfppParser.RULE_templateFieldDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 764;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (mcfppParser.PUBLIC - 66)) | (1 << (mcfppParser.PROTECTED - 66)) | (1 << (mcfppParser.PRIVATE - 66)))) !== 0)) {
				{
				this.state = 763;
				this.accessModifier();
				}
			}

			this.state = 767;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.CONST) {
				{
				this.state = 766;
				this.match(mcfppParser.CONST);
				}
			}

			this.state = 769;
			this.match(mcfppParser.Identifier);
			this.state = 772;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.AS) {
				{
				this.state = 770;
				this.match(mcfppParser.AS);
				this.state = 771;
				this.templateType();
				}
			}

			this.state = 776;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ASSIGNMENT) {
				{
				this.state = 774;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 775;
				this.expression();
				}
			}

			this.state = 779;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LCURL) {
				{
				this.state = 778;
				this.accessor();
				}
			}

			this.state = 781;
			this.match(mcfppParser.SEMICOLON);
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
	public templateType(): TemplateTypeContext {
		let _localctx: TemplateTypeContext = new TemplateTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 70, mcfppParser.RULE_templateType);
		try {
			this.state = 785;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 78, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 783;
				this.singleTemplateFieldType();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 784;
				this.unionTemplateFieldType();
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
	public singleTemplateFieldType(): SingleTemplateFieldTypeContext {
		let _localctx: SingleTemplateFieldTypeContext = new SingleTemplateFieldTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 72, mcfppParser.RULE_singleTemplateFieldType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 787;
			this.type();
			this.state = 789;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.QUEST) {
				{
				this.state = 788;
				this.match(mcfppParser.QUEST);
				}
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
	public unionTemplateFieldType(): UnionTemplateFieldTypeContext {
		let _localctx: UnionTemplateFieldTypeContext = new UnionTemplateFieldTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 74, mcfppParser.RULE_unionTemplateFieldType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 791;
			this.match(mcfppParser.LPAREN);
			this.state = 792;
			this.type();
			this.state = 797;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.PIPE) {
				{
				{
				this.state = 793;
				this.match(mcfppParser.PIPE);
				this.state = 794;
				this.type();
				}
				}
				this.state = 799;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 800;
			this.match(mcfppParser.RPAREN);
			this.state = 802;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.QUEST) {
				{
				this.state = 801;
				this.match(mcfppParser.QUEST);
				}
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
	public interfaceDeclaration(): InterfaceDeclarationContext {
		let _localctx: InterfaceDeclarationContext = new InterfaceDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 76, mcfppParser.RULE_interfaceDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 804;
			this.match(mcfppParser.INTERFACE);
			this.state = 805;
			this.classWithoutNamespace();
			this.state = 815;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 806;
				this.match(mcfppParser.ARROW);
				this.state = 807;
				this.className();
				this.state = 812;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 808;
					this.match(mcfppParser.COMMA);
					this.state = 809;
					this.className();
					}
					}
					this.state = 814;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 819;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.LCURL:
				{
				this.state = 817;
				this.interfaceBody();
				}
				break;
			case mcfppParser.SEMICOLON:
				{
				this.state = 818;
				this.match(mcfppParser.SEMICOLON);
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public interfaceBody(): InterfaceBodyContext {
		let _localctx: InterfaceBodyContext = new InterfaceBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 78, mcfppParser.RULE_interfaceBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 821;
			this.match(mcfppParser.LCURL);
			this.state = 831;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.AT || _la === mcfppParser.FUNCTION || _la === mcfppParser.DOC_COMMENT) {
				{
				{
				this.state = 823;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === mcfppParser.DOC_COMMENT) {
					{
					this.state = 822;
					this.doc_comment();
					}
				}

				this.state = 826;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				if (_la === mcfppParser.AT) {
					{
					this.state = 825;
					this.annotation();
					}
				}

				this.state = 828;
				this.interfaceFunctionDeclaration();
				}
				}
				this.state = 833;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 834;
			this.match(mcfppParser.RCURL);
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
	public interfaceFunctionDeclaration(): InterfaceFunctionDeclarationContext {
		let _localctx: InterfaceFunctionDeclarationContext = new InterfaceFunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 80, mcfppParser.RULE_interfaceFunctionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 836;
			this.match(mcfppParser.FUNCTION);
			this.state = 837;
			this.match(mcfppParser.Identifier);
			this.state = 838;
			this.functionParams();
			this.state = 841;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 839;
				this.match(mcfppParser.ARROW);
				this.state = 840;
				this.functionReturnType();
				}
			}

			this.state = 843;
			this.match(mcfppParser.SEMICOLON);
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
	public compileTimeFuncDeclaration(): CompileTimeFuncDeclarationContext {
		let _localctx: CompileTimeFuncDeclarationContext = new CompileTimeFuncDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 82, mcfppParser.RULE_compileTimeFuncDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 845;
			this.match(mcfppParser.CONST);
			this.state = 846;
			this.match(mcfppParser.FUNCTION);
			this.state = 847;
			this.match(mcfppParser.Identifier);
			this.state = 848;
			this.functionParams();
			this.state = 851;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 849;
				this.match(mcfppParser.ARROW);
				this.state = 850;
				this.functionReturnType();
				}
			}

			this.state = 853;
			this.match(mcfppParser.LCURL);
			this.state = 854;
			this.functionBody();
			this.state = 855;
			this.match(mcfppParser.RCURL);
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
	public inlineFunctionDeclaration(): InlineFunctionDeclarationContext {
		let _localctx: InlineFunctionDeclarationContext = new InlineFunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 84, mcfppParser.RULE_inlineFunctionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 857;
			this.match(mcfppParser.INLINE);
			this.state = 858;
			this.match(mcfppParser.FUNCTION);
			this.state = 859;
			this.match(mcfppParser.Identifier);
			this.state = 860;
			this.functionParams();
			this.state = 863;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 861;
				this.match(mcfppParser.ARROW);
				this.state = 862;
				this.functionReturnType();
				}
			}

			this.state = 865;
			this.match(mcfppParser.LCURL);
			this.state = 866;
			this.functionBody();
			this.state = 867;
			this.match(mcfppParser.RCURL);
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
	public functionDeclaration(): FunctionDeclarationContext {
		let _localctx: FunctionDeclarationContext = new FunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 86, mcfppParser.RULE_functionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 869;
			this.match(mcfppParser.FUNCTION);
			this.state = 870;
			this.match(mcfppParser.Identifier);
			this.state = 872;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LPAREN || _la === mcfppParser.LANGLE) {
				{
				this.state = 871;
				this.functionParams();
				}
			}

			this.state = 876;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 874;
				this.match(mcfppParser.ARROW);
				this.state = 875;
				this.functionReturnType();
				}
			}

			this.state = 878;
			this.match(mcfppParser.LCURL);
			this.state = 879;
			this.functionBody();
			this.state = 880;
			this.match(mcfppParser.RCURL);
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
	public extensionFunctionDeclaration(): ExtensionFunctionDeclarationContext {
		let _localctx: ExtensionFunctionDeclarationContext = new ExtensionFunctionDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 88, mcfppParser.RULE_extensionFunctionDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 882;
			this.match(mcfppParser.FUNCTION);
			this.state = 886;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 93, this._ctx) ) {
			case 1:
				{
				this.state = 883;
				this.type();
				this.state = 884;
				this.match(mcfppParser.DOT);
				}
				break;
			}
			this.state = 888;
			this.match(mcfppParser.Identifier);
			this.state = 889;
			this.functionParams();
			this.state = 892;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 890;
				this.match(mcfppParser.ARROW);
				this.state = 891;
				this.functionReturnType();
				}
			}

			this.state = 894;
			this.match(mcfppParser.LCURL);
			this.state = 895;
			this.functionBody();
			this.state = 896;
			this.match(mcfppParser.RCURL);
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
	public enumDeclaration(): EnumDeclarationContext {
		let _localctx: EnumDeclarationContext = new EnumDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 90, mcfppParser.RULE_enumDeclaration);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 898;
			this.match(mcfppParser.ENUM);
			this.state = 899;
			this.match(mcfppParser.Identifier);
			this.state = 900;
			this.match(mcfppParser.LCURL);
			this.state = 901;
			this.enumBody();
			this.state = 902;
			this.match(mcfppParser.RCURL);
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
	public enumBody(): EnumBodyContext {
		let _localctx: EnumBodyContext = new EnumBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 92, mcfppParser.RULE_enumBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 904;
			this.enumMember();
			this.state = 909;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.COMMA) {
				{
				{
				this.state = 905;
				this.match(mcfppParser.COMMA);
				this.state = 906;
				this.enumMember();
				}
				}
				this.state = 911;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public enumMember(): EnumMemberContext {
		let _localctx: EnumMemberContext = new EnumMemberContext(this._ctx, this.state);
		this.enterRule(_localctx, 94, mcfppParser.RULE_enumMember);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 912;
			this.match(mcfppParser.Identifier);
			this.state = 915;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ASSIGNMENT) {
				{
				this.state = 913;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 914;
				this.nbtValue();
				}
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
	public namespaceID(): NamespaceIDContext {
		let _localctx: NamespaceIDContext = new NamespaceIDContext(this._ctx, this.state);
		this.enterRule(_localctx, 96, mcfppParser.RULE_namespaceID);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 926;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 98, this._ctx) ) {
			case 1:
				{
				this.state = 917;
				this.match(mcfppParser.Identifier);
				this.state = 922;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.DOT) {
					{
					{
					this.state = 918;
					this.match(mcfppParser.DOT);
					this.state = 919;
					this.match(mcfppParser.Identifier);
					}
					}
					this.state = 924;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 925;
				this.match(mcfppParser.COLON);
				}
				break;
			}
			this.state = 928;
			this.match(mcfppParser.Identifier);
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
	public nativeFuncDeclaration(): NativeFuncDeclarationContext {
		let _localctx: NativeFuncDeclarationContext = new NativeFuncDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 98, mcfppParser.RULE_nativeFuncDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 930;
			this.match(mcfppParser.FUNCTION);
			this.state = 931;
			this.match(mcfppParser.Identifier);
			this.state = 932;
			this.functionParams();
			this.state = 935;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ARROW) {
				{
				this.state = 933;
				this.match(mcfppParser.ARROW);
				this.state = 934;
				this.functionReturnType();
				}
			}

			this.state = 937;
			this.match(mcfppParser.ASSIGNMENT);
			this.state = 938;
			this.javaRefer();
			this.state = 939;
			this.match(mcfppParser.SEMICOLON);
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
	public javaRefer(): JavaReferContext {
		let _localctx: JavaReferContext = new JavaReferContext(this._ctx, this.state);
		this.enterRule(_localctx, 100, mcfppParser.RULE_javaRefer);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 941;
			this.match(mcfppParser.Identifier);
			this.state = 946;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.DOT) {
				{
				{
				this.state = 942;
				this.match(mcfppParser.DOT);
				this.state = 943;
				this.match(mcfppParser.Identifier);
				}
				}
				this.state = 948;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public accessModifier(): AccessModifierContext {
		let _localctx: AccessModifierContext = new AccessModifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 102, mcfppParser.RULE_accessModifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 949;
			_la = this._input.LA(1);
			if (!(((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (mcfppParser.PUBLIC - 66)) | (1 << (mcfppParser.PROTECTED - 66)) | (1 << (mcfppParser.PRIVATE - 66)))) !== 0))) {
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
	public classConstructorDeclaration(): ClassConstructorDeclarationContext {
		let _localctx: ClassConstructorDeclarationContext = new ClassConstructorDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 104, mcfppParser.RULE_classConstructorDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 952;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (mcfppParser.PUBLIC - 66)) | (1 << (mcfppParser.PROTECTED - 66)) | (1 << (mcfppParser.PRIVATE - 66)))) !== 0)) {
				{
				this.state = 951;
				this.accessModifier();
				}
			}

			this.state = 954;
			this.match(mcfppParser.CONSTRUCTOR);
			this.state = 955;
			this.normalParams();
			this.state = 956;
			this.match(mcfppParser.LCURL);
			this.state = 957;
			this.functionBody();
			this.state = 958;
			this.match(mcfppParser.RCURL);
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
	public templateConstructorDeclaration(): TemplateConstructorDeclarationContext {
		let _localctx: TemplateConstructorDeclarationContext = new TemplateConstructorDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 106, mcfppParser.RULE_templateConstructorDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 961;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 66)) & ~0x1F) === 0 && ((1 << (_la - 66)) & ((1 << (mcfppParser.PUBLIC - 66)) | (1 << (mcfppParser.PROTECTED - 66)) | (1 << (mcfppParser.PRIVATE - 66)))) !== 0)) {
				{
				this.state = 960;
				this.accessModifier();
				}
			}

			this.state = 963;
			this.match(mcfppParser.CONSTRUCTOR);
			this.state = 964;
			this.normalParams();
			this.state = 965;
			this.match(mcfppParser.LCURL);
			this.state = 966;
			this.functionBody();
			this.state = 967;
			this.match(mcfppParser.RCURL);
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
	public fieldDeclaration(): FieldDeclarationContext {
		let _localctx: FieldDeclarationContext = new FieldDeclarationContext(this._ctx, this.state);
		this.enterRule(_localctx, 108, mcfppParser.RULE_fieldDeclaration);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 970;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 72)) & ~0x1F) === 0 && ((1 << (_la - 72)) & ((1 << (mcfppParser.CONST - 72)) | (1 << (mcfppParser.DYNAMIC - 72)) | (1 << (mcfppParser.IMPORT - 72)))) !== 0)) {
				{
				this.state = 969;
				this.fieldModifier();
				}
			}

			this.state = 972;
			this.match(mcfppParser.VAR);
			this.state = 973;
			this.match(mcfppParser.Identifier);
			this.state = 976;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.AS) {
				{
				this.state = 974;
				this.match(mcfppParser.AS);
				this.state = 975;
				this.type();
				}
			}

			this.state = 980;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ASSIGNMENT) {
				{
				this.state = 978;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 979;
				this.expression();
				}
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
	public fieldDeclarationExpression(): FieldDeclarationExpressionContext {
		let _localctx: FieldDeclarationExpressionContext = new FieldDeclarationExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 110, mcfppParser.RULE_fieldDeclarationExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 982;
			this.match(mcfppParser.Identifier);
			this.state = 985;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ASSIGNMENT) {
				{
				this.state = 983;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 984;
				this.expression();
				}
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
	public fieldModifier(): FieldModifierContext {
		let _localctx: FieldModifierContext = new FieldModifierContext(this._ctx, this.state);
		this.enterRule(_localctx, 112, mcfppParser.RULE_fieldModifier);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 987;
			_la = this._input.LA(1);
			if (!(((((_la - 72)) & ~0x1F) === 0 && ((1 << (_la - 72)) & ((1 << (mcfppParser.CONST - 72)) | (1 << (mcfppParser.DYNAMIC - 72)) | (1 << (mcfppParser.IMPORT - 72)))) !== 0))) {
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
	public functionParams(): FunctionParamsContext {
		let _localctx: FunctionParamsContext = new FunctionParamsContext(this._ctx, this.state);
		this.enterRule(_localctx, 114, mcfppParser.RULE_functionParams);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 990;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LANGLE) {
				{
				this.state = 989;
				this.readOnlyParams();
				}
			}

			this.state = 992;
			this.normalParams();
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
	public readOnlyParams(): ReadOnlyParamsContext {
		let _localctx: ReadOnlyParamsContext = new ReadOnlyParamsContext(this._ctx, this.state);
		this.enterRule(_localctx, 116, mcfppParser.RULE_readOnlyParams);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 994;
			this.match(mcfppParser.LANGLE);
			this.state = 996;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LPAREN || ((((_la - 61)) & ~0x1F) === 0 && ((1 << (_la - 61)) & ((1 << (mcfppParser.STATIC - 61)) | (1 << (mcfppParser.DATA - 61)) | (1 << (mcfppParser.INT - 61)) | (1 << (mcfppParser.ENTITY - 61)))) !== 0) || ((((_la - 93)) & ~0x1F) === 0 && ((1 << (_la - 93)) & ((1 << (mcfppParser.BOOL - 93)) | (1 << (mcfppParser.BYTE - 93)) | (1 << (mcfppParser.SHORT - 93)) | (1 << (mcfppParser.LONG - 93)) | (1 << (mcfppParser.FLOAT - 93)) | (1 << (mcfppParser.DOUBLE - 93)) | (1 << (mcfppParser.SELECTOR - 93)) | (1 << (mcfppParser.STRING - 93)) | (1 << (mcfppParser.JTEXT - 93)) | (1 << (mcfppParser.NBT - 93)) | (1 << (mcfppParser.ANY - 93)) | (1 << (mcfppParser.LIST - 93)) | (1 << (mcfppParser.MAP - 93)) | (1 << (mcfppParser.DICT - 93)) | (1 << (mcfppParser.TYPE - 93)) | (1 << (mcfppParser.BYTEARRAY - 93)) | (1 << (mcfppParser.INTARRAY - 93)) | (1 << (mcfppParser.LONGARRAY - 93)) | (1 << (mcfppParser.VecType - 93)) | (1 << (mcfppParser.Identifier - 93)))) !== 0)) {
				{
				this.state = 995;
				this.parameterList();
				}
			}

			this.state = 998;
			this.match(mcfppParser.RANGLE);
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
	public normalParams(): NormalParamsContext {
		let _localctx: NormalParamsContext = new NormalParamsContext(this._ctx, this.state);
		this.enterRule(_localctx, 118, mcfppParser.RULE_normalParams);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1000;
			this.match(mcfppParser.LPAREN);
			this.state = 1002;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LPAREN || ((((_la - 61)) & ~0x1F) === 0 && ((1 << (_la - 61)) & ((1 << (mcfppParser.STATIC - 61)) | (1 << (mcfppParser.DATA - 61)) | (1 << (mcfppParser.INT - 61)) | (1 << (mcfppParser.ENTITY - 61)))) !== 0) || ((((_la - 93)) & ~0x1F) === 0 && ((1 << (_la - 93)) & ((1 << (mcfppParser.BOOL - 93)) | (1 << (mcfppParser.BYTE - 93)) | (1 << (mcfppParser.SHORT - 93)) | (1 << (mcfppParser.LONG - 93)) | (1 << (mcfppParser.FLOAT - 93)) | (1 << (mcfppParser.DOUBLE - 93)) | (1 << (mcfppParser.SELECTOR - 93)) | (1 << (mcfppParser.STRING - 93)) | (1 << (mcfppParser.JTEXT - 93)) | (1 << (mcfppParser.NBT - 93)) | (1 << (mcfppParser.ANY - 93)) | (1 << (mcfppParser.LIST - 93)) | (1 << (mcfppParser.MAP - 93)) | (1 << (mcfppParser.DICT - 93)) | (1 << (mcfppParser.TYPE - 93)) | (1 << (mcfppParser.BYTEARRAY - 93)) | (1 << (mcfppParser.INTARRAY - 93)) | (1 << (mcfppParser.LONGARRAY - 93)) | (1 << (mcfppParser.VecType - 93)) | (1 << (mcfppParser.Identifier - 93)))) !== 0)) {
				{
				this.state = 1001;
				this.parameterList();
				}
			}

			this.state = 1004;
			this.match(mcfppParser.RPAREN);
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
	public parameterList(): ParameterListContext {
		let _localctx: ParameterListContext = new ParameterListContext(this._ctx, this.state);
		this.enterRule(_localctx, 120, mcfppParser.RULE_parameterList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1006;
			this.parameter();
			this.state = 1011;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.COMMA) {
				{
				{
				this.state = 1007;
				this.match(mcfppParser.COMMA);
				this.state = 1008;
				this.parameter();
				}
				}
				this.state = 1013;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public parameter(): ParameterContext {
		let _localctx: ParameterContext = new ParameterContext(this._ctx, this.state);
		this.enterRule(_localctx, 122, mcfppParser.RULE_parameter);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1015;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.STATIC) {
				{
				this.state = 1014;
				this.match(mcfppParser.STATIC);
				}
			}

			this.state = 1019;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 112, this._ctx) ) {
			case 1:
				{
				this.state = 1017;
				this.match(mcfppParser.Identifier);
				this.state = 1018;
				this.match(mcfppParser.AS);
				}
				break;
			}
			this.state = 1021;
			this.type();
			this.state = 1024;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.ASSIGNMENT) {
				{
				this.state = 1022;
				this.match(mcfppParser.ASSIGNMENT);
				this.state = 1023;
				this.value();
				}
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
	public expression(): ExpressionContext {
		let _localctx: ExpressionContext = new ExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 124, mcfppParser.RULE_expression);
		try {
			this.state = 1028;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 114, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1026;
				this.primary();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1027;
				this.commonBinaryOperatorExpression();
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
	public statementExpression(): StatementExpressionContext {
		let _localctx: StatementExpressionContext = new StatementExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 126, mcfppParser.RULE_statementExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1033;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 115, this._ctx) ) {
			case 1:
				{
				this.state = 1030;
				this.varWithSelector();
				this.state = 1031;
				this.match(mcfppParser.ASSIGNMENT);
				}
				break;
			}
			this.state = 1035;
			this.expression();
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
	public conditionalExpression(): ConditionalExpressionContext {
		let _localctx: ConditionalExpressionContext = new ConditionalExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 128, mcfppParser.RULE_conditionalExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1037;
			this.commonBinaryOperatorExpression();
			this.state = 1043;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.QUEST) {
				{
				this.state = 1038;
				this.match(mcfppParser.QUEST);
				this.state = 1039;
				this.expression();
				this.state = 1040;
				this.match(mcfppParser.COLON);
				this.state = 1041;
				this.expression();
				}
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
	public commonBinaryOperatorExpression(): CommonBinaryOperatorExpressionContext {
		let _localctx: CommonBinaryOperatorExpressionContext = new CommonBinaryOperatorExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 130, mcfppParser.RULE_commonBinaryOperatorExpression);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1045;
			this.conditionalOrExpression();
			this.state = 1051;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 117, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1046;
					this.commonBinaryOperator();
					this.state = 1047;
					this.conditionalOrExpression();
					}
					}
				}
				this.state = 1053;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 117, this._ctx);
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
	public commonBinaryOperator(): CommonBinaryOperatorContext {
		let _localctx: CommonBinaryOperatorContext = new CommonBinaryOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 132, mcfppParser.RULE_commonBinaryOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1054;
			_la = this._input.LA(1);
			if (!(_la === mcfppParser.PIPE || _la === mcfppParser.Identifier)) {
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
	public conditionalOrExpression(): ConditionalOrExpressionContext {
		let _localctx: ConditionalOrExpressionContext = new ConditionalOrExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 134, mcfppParser.RULE_conditionalOrExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1056;
			this.conditionalAndExpression();
			this.state = 1061;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.DISJ) {
				{
				{
				this.state = 1057;
				this.match(mcfppParser.DISJ);
				this.state = 1058;
				this.conditionalAndExpression();
				}
				}
				this.state = 1063;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public conditionalAndExpression(): ConditionalAndExpressionContext {
		let _localctx: ConditionalAndExpressionContext = new ConditionalAndExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 136, mcfppParser.RULE_conditionalAndExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1064;
			this.equalityExpression();
			this.state = 1069;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.CONJ) {
				{
				{
				this.state = 1065;
				this.match(mcfppParser.CONJ);
				this.state = 1066;
				this.equalityExpression();
				}
				}
				this.state = 1071;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public equalityExpression(): EqualityExpressionContext {
		let _localctx: EqualityExpressionContext = new EqualityExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 138, mcfppParser.RULE_equalityExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1072;
			this.relationalExpression();
			this.state = 1075;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (((((_la - 39)) & ~0x1F) === 0 && ((1 << (_la - 39)) & ((1 << (mcfppParser.EXCL_EQ - 39)) | (1 << (mcfppParser.EQEQ - 39)) | (1 << (mcfppParser.WVEQ - 39)))) !== 0)) {
				{
				this.state = 1073;
				_localctx._op = this._input.LT(1);
				_la = this._input.LA(1);
				if (!(((((_la - 39)) & ~0x1F) === 0 && ((1 << (_la - 39)) & ((1 << (mcfppParser.EXCL_EQ - 39)) | (1 << (mcfppParser.EQEQ - 39)) | (1 << (mcfppParser.WVEQ - 39)))) !== 0))) {
					_localctx._op = this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 1074;
				this.relationalExpression();
				}
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
	public relationalExpression(): RelationalExpressionContext {
		let _localctx: RelationalExpressionContext = new RelationalExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 140, mcfppParser.RULE_relationalExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1077;
			this.additiveExpression();
			this.state = 1081;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 121, this._ctx) ) {
			case 1:
				{
				this.state = 1078;
				this.relationalOp();
				this.state = 1079;
				this.additiveExpression();
				}
				break;
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
	public relationalOp(): RelationalOpContext {
		let _localctx: RelationalOpContext = new RelationalOpContext(this._ctx, this.state);
		this.enterRule(_localctx, 142, mcfppParser.RULE_relationalOp);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1083;
			_la = this._input.LA(1);
			if (!(((((_la - 35)) & ~0x1F) === 0 && ((1 << (_la - 35)) & ((1 << (mcfppParser.LANGLE - 35)) | (1 << (mcfppParser.RANGLE - 35)) | (1 << (mcfppParser.LE - 35)) | (1 << (mcfppParser.GE - 35)))) !== 0))) {
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
	public additiveExpression(): AdditiveExpressionContext {
		let _localctx: AdditiveExpressionContext = new AdditiveExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 144, mcfppParser.RULE_additiveExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1085;
			this.multiplicativeExpression();
			this.state = 1090;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.ADD || _la === mcfppParser.SUB) {
				{
				{
				this.state = 1086;
				_localctx._op = this._input.LT(1);
				_la = this._input.LA(1);
				if (!(_la === mcfppParser.ADD || _la === mcfppParser.SUB)) {
					_localctx._op = this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 1087;
				this.multiplicativeExpression();
				}
				}
				this.state = 1092;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public multiplicativeExpression(): MultiplicativeExpressionContext {
		let _localctx: MultiplicativeExpressionContext = new MultiplicativeExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 146, mcfppParser.RULE_multiplicativeExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1093;
			this.unaryExpression();
			this.state = 1098;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppParser.MULT) | (1 << mcfppParser.MOD) | (1 << mcfppParser.DIV))) !== 0)) {
				{
				{
				this.state = 1094;
				_localctx._op = this._input.LT(1);
				_la = this._input.LA(1);
				if (!((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppParser.MULT) | (1 << mcfppParser.MOD) | (1 << mcfppParser.DIV))) !== 0))) {
					_localctx._op = this._errHandler.recoverInline(this);
				} else {
					if (this._input.LA(1) === Token.EOF) {
						this.matchedEOF = true;
					}

					this._errHandler.reportMatch(this);
					this.consume();
				}
				this.state = 1095;
				this.unaryExpression();
				}
				}
				this.state = 1100;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public unaryExpression(): UnaryExpressionContext {
		let _localctx: UnaryExpressionContext = new UnaryExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 148, mcfppParser.RULE_unaryExpression);
		try {
			this.state = 1105;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 124, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1101;
				this.match(mcfppParser.EXCL);
				this.state = 1102;
				this.unaryExpression();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1103;
				this.castExpression();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1104;
				this.rightVarExpression();
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
	public rightVarExpression(): RightVarExpressionContext {
		let _localctx: RightVarExpressionContext = new RightVarExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 150, mcfppParser.RULE_rightVarExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1107;
			this.varWithSelector();
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
	public castExpression(): CastExpressionContext {
		let _localctx: CastExpressionContext = new CastExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 152, mcfppParser.RULE_castExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1109;
			this.rightVarExpression();
			this.state = 1110;
			this.match(mcfppParser.AS);
			this.state = 1111;
			this.type();
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
	public varWithSelector(): VarWithSelectorContext {
		let _localctx: VarWithSelectorContext = new VarWithSelectorContext(this._ctx, this.state);
		this.enterRule(_localctx, 154, mcfppParser.RULE_varWithSelector);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1113;
			this.jvmAccessExpression();
			this.state = 1117;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.DOT) {
				{
				{
				this.state = 1114;
				this.selector();
				}
				}
				this.state = 1119;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public jvmAccessExpression(): JvmAccessExpressionContext {
		let _localctx: JvmAccessExpressionContext = new JvmAccessExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 156, mcfppParser.RULE_jvmAccessExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1120;
			this.propertyOperator();
			this.state = 1123;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.COLONCOLON) {
				{
				this.state = 1121;
				this.match(mcfppParser.COLONCOLON);
				this.state = 1122;
				this.match(mcfppParser.Identifier);
				}
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
	public propertyOperator(): PropertyOperatorContext {
		let _localctx: PropertyOperatorContext = new PropertyOperatorContext(this._ctx, this.state);
		this.enterRule(_localctx, 158, mcfppParser.RULE_propertyOperator);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1125;
			this.primary();
			this.state = 1137;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 128, this._ctx) ) {
			case 1:
				{
				this.state = 1126;
				this.match(mcfppParser.LSQUARE);
				this.state = 1127;
				this.propertyOperatorExpression();
				this.state = 1132;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 1128;
					this.match(mcfppParser.COMMA);
					this.state = 1129;
					this.propertyOperatorExpression();
					}
					}
					this.state = 1134;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1135;
				this.match(mcfppParser.RSQUARE);
				}
				break;
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
	public propertyOperatorExpression(): PropertyOperatorExpressionContext {
		let _localctx: PropertyOperatorExpressionContext = new PropertyOperatorExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 160, mcfppParser.RULE_propertyOperatorExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1139;
			this.match(mcfppParser.Identifier);
			this.state = 1140;
			this.match(mcfppParser.ASSIGNMENT);
			this.state = 1141;
			this.expression();
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
	public primary(): PrimaryContext {
		let _localctx: PrimaryContext = new PrimaryContext(this._ctx, this.state);
		this.enterRule(_localctx, 162, mcfppParser.RULE_primary);
		try {
			this.state = 1149;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 129, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1143;
				this.range();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1144;
				this.value();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1145;
				this.var();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1146;
				this.match(mcfppParser.THIS);
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 1147;
				this.match(mcfppParser.SUPER);
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 1148;
				this.type();
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
	public var(): VarContext {
		let _localctx: VarContext = new VarContext(this._ctx, this.state);
		this.enterRule(_localctx, 164, mcfppParser.RULE_var);
		try {
			this.state = 1154;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 130, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1151;
				this.bucketExpression();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1152;
				this.varWithSuffix();
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1153;
				this.functionCall();
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
	public bucketExpression(): BucketExpressionContext {
		let _localctx: BucketExpressionContext = new BucketExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 166, mcfppParser.RULE_bucketExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1156;
			this.match(mcfppParser.LPAREN);
			this.state = 1157;
			this.expression();
			this.state = 1158;
			this.match(mcfppParser.RPAREN);
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
	public varWithSuffix(): VarWithSuffixContext {
		let _localctx: VarWithSuffixContext = new VarWithSuffixContext(this._ctx, this.state);
		this.enterRule(_localctx, 168, mcfppParser.RULE_varWithSuffix);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1160;
			this.match(mcfppParser.Identifier);
			this.state = 1164;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 131, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1161;
					this.identifierSuffix();
					}
					}
				}
				this.state = 1166;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 131, this._ctx);
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
	public functionCall(): FunctionCallContext {
		let _localctx: FunctionCallContext = new FunctionCallContext(this._ctx, this.state);
		this.enterRule(_localctx, 170, mcfppParser.RULE_functionCall);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1167;
			this.namespaceID();
			this.state = 1168;
			this.arguments();
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
	public identifierSuffix(): IdentifierSuffixContext {
		let _localctx: IdentifierSuffixContext = new IdentifierSuffixContext(this._ctx, this.state);
		this.enterRule(_localctx, 172, mcfppParser.RULE_identifierSuffix);
		let _la: number;
		try {
			this.state = 1187;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 133, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1170;
				this.match(mcfppParser.LSQUARE);
				this.state = 1171;
				this.conditionalExpression();
				this.state = 1172;
				this.match(mcfppParser.RSQUARE);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1174;
				this.match(mcfppParser.LSQUARE);
				this.state = 1175;
				this.objectInitializer();
				this.state = 1180;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 1176;
					this.match(mcfppParser.COMMA);
					this.state = 1177;
					this.objectInitializer();
					}
					}
					this.state = 1182;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1183;
				this.match(mcfppParser.RSQUARE);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1185;
				this.match(mcfppParser.LSQUARE);
				this.state = 1186;
				this.match(mcfppParser.RSQUARE);
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
	public objectInitializer(): ObjectInitializerContext {
		let _localctx: ObjectInitializerContext = new ObjectInitializerContext(this._ctx, this.state);
		this.enterRule(_localctx, 174, mcfppParser.RULE_objectInitializer);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1189;
			this.match(mcfppParser.Identifier);
			this.state = 1190;
			this.match(mcfppParser.ASSIGNMENT);
			this.state = 1191;
			this.expression();
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
	public selector(): SelectorContext {
		let _localctx: SelectorContext = new SelectorContext(this._ctx, this.state);
		this.enterRule(_localctx, 176, mcfppParser.RULE_selector);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1193;
			this.match(mcfppParser.DOT);
			this.state = 1194;
			this.var();
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
	public arguments(): ArgumentsContext {
		let _localctx: ArgumentsContext = new ArgumentsContext(this._ctx, this.state);
		this.enterRule(_localctx, 178, mcfppParser.RULE_arguments);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1197;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LANGLE) {
				{
				this.state = 1196;
				this.readOnlyArgs();
				}
			}

			this.state = 1199;
			this.normalArgs();
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
	public readOnlyArgs(): ReadOnlyArgsContext {
		let _localctx: ReadOnlyArgsContext = new ReadOnlyArgsContext(this._ctx, this.state);
		this.enterRule(_localctx, 180, mcfppParser.RULE_readOnlyArgs);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1201;
			this.match(mcfppParser.LANGLE);
			this.state = 1203;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppParser.LPAREN) | (1 << mcfppParser.LSQUARE) | (1 << mcfppParser.LCURL) | (1 << mcfppParser.EXCL) | (1 << mcfppParser.RANGE))) !== 0) || ((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (mcfppParser.TRIPLE_QUOTE_OPEN - 45)) | (1 << (mcfppParser.THIS - 45)) | (1 << (mcfppParser.SUPER - 45)))) !== 0) || ((((_la - 79)) & ~0x1F) === 0 && ((1 << (_la - 79)) & ((1 << (mcfppParser.DATA - 79)) | (1 << (mcfppParser.INT - 79)) | (1 << (mcfppParser.ENTITY - 79)) | (1 << (mcfppParser.BOOL - 79)) | (1 << (mcfppParser.BYTE - 79)) | (1 << (mcfppParser.SHORT - 79)) | (1 << (mcfppParser.LONG - 79)) | (1 << (mcfppParser.FLOAT - 79)) | (1 << (mcfppParser.DOUBLE - 79)) | (1 << (mcfppParser.SELECTOR - 79)) | (1 << (mcfppParser.STRING - 79)) | (1 << (mcfppParser.JTEXT - 79)) | (1 << (mcfppParser.NBT - 79)) | (1 << (mcfppParser.ANY - 79)) | (1 << (mcfppParser.LIST - 79)) | (1 << (mcfppParser.MAP - 79)) | (1 << (mcfppParser.DICT - 79)) | (1 << (mcfppParser.TYPE - 79)) | (1 << (mcfppParser.BYTEARRAY - 79)) | (1 << (mcfppParser.INTARRAY - 79)))) !== 0) || ((((_la - 111)) & ~0x1F) === 0 && ((1 << (_la - 111)) & ((1 << (mcfppParser.LONGARRAY - 111)) | (1 << (mcfppParser.TRUE - 111)) | (1 << (mcfppParser.FALSE - 111)) | (1 << (mcfppParser.NULL - 111)) | (1 << (mcfppParser.VecType - 111)) | (1 << (mcfppParser.TargetSelector - 111)) | (1 << (mcfppParser.Identifier - 111)) | (1 << (mcfppParser.NBT_BYTE_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_INT_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_LONG_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBTByte - 111)) | (1 << (mcfppParser.NBTShort - 111)) | (1 << (mcfppParser.NBTInt - 111)) | (1 << (mcfppParser.NBTLong - 111)) | (1 << (mcfppParser.NBTFloat - 111)) | (1 << (mcfppParser.NBTDouble - 111)) | (1 << (mcfppParser.RelativeValue - 111)) | (1 << (mcfppParser.LineString - 111)))) !== 0)) {
				{
				this.state = 1202;
				this.expressionList();
				}
			}

			this.state = 1205;
			this.match(mcfppParser.RANGLE);
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
	public normalArgs(): NormalArgsContext {
		let _localctx: NormalArgsContext = new NormalArgsContext(this._ctx, this.state);
		this.enterRule(_localctx, 182, mcfppParser.RULE_normalArgs);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1207;
			this.match(mcfppParser.LPAREN);
			this.state = 1209;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppParser.LPAREN) | (1 << mcfppParser.LSQUARE) | (1 << mcfppParser.LCURL) | (1 << mcfppParser.EXCL) | (1 << mcfppParser.RANGE))) !== 0) || ((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (mcfppParser.TRIPLE_QUOTE_OPEN - 45)) | (1 << (mcfppParser.THIS - 45)) | (1 << (mcfppParser.SUPER - 45)))) !== 0) || ((((_la - 79)) & ~0x1F) === 0 && ((1 << (_la - 79)) & ((1 << (mcfppParser.DATA - 79)) | (1 << (mcfppParser.INT - 79)) | (1 << (mcfppParser.ENTITY - 79)) | (1 << (mcfppParser.BOOL - 79)) | (1 << (mcfppParser.BYTE - 79)) | (1 << (mcfppParser.SHORT - 79)) | (1 << (mcfppParser.LONG - 79)) | (1 << (mcfppParser.FLOAT - 79)) | (1 << (mcfppParser.DOUBLE - 79)) | (1 << (mcfppParser.SELECTOR - 79)) | (1 << (mcfppParser.STRING - 79)) | (1 << (mcfppParser.JTEXT - 79)) | (1 << (mcfppParser.NBT - 79)) | (1 << (mcfppParser.ANY - 79)) | (1 << (mcfppParser.LIST - 79)) | (1 << (mcfppParser.MAP - 79)) | (1 << (mcfppParser.DICT - 79)) | (1 << (mcfppParser.TYPE - 79)) | (1 << (mcfppParser.BYTEARRAY - 79)) | (1 << (mcfppParser.INTARRAY - 79)))) !== 0) || ((((_la - 111)) & ~0x1F) === 0 && ((1 << (_la - 111)) & ((1 << (mcfppParser.LONGARRAY - 111)) | (1 << (mcfppParser.TRUE - 111)) | (1 << (mcfppParser.FALSE - 111)) | (1 << (mcfppParser.NULL - 111)) | (1 << (mcfppParser.VecType - 111)) | (1 << (mcfppParser.TargetSelector - 111)) | (1 << (mcfppParser.Identifier - 111)) | (1 << (mcfppParser.NBT_BYTE_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_INT_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_LONG_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBTByte - 111)) | (1 << (mcfppParser.NBTShort - 111)) | (1 << (mcfppParser.NBTInt - 111)) | (1 << (mcfppParser.NBTLong - 111)) | (1 << (mcfppParser.NBTFloat - 111)) | (1 << (mcfppParser.NBTDouble - 111)) | (1 << (mcfppParser.RelativeValue - 111)) | (1 << (mcfppParser.LineString - 111)))) !== 0)) {
				{
				this.state = 1208;
				this.expressionList();
				}
			}

			this.state = 1211;
			this.match(mcfppParser.RPAREN);
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
	public functionBody(): FunctionBodyContext {
		let _localctx: FunctionBodyContext = new FunctionBodyContext(this._ctx, this.state);
		this.enterRule(_localctx, 184, mcfppParser.RULE_functionBody);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1216;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppParser.LPAREN) | (1 << mcfppParser.LSQUARE) | (1 << mcfppParser.LCURL) | (1 << mcfppParser.DIV) | (1 << mcfppParser.EXCL) | (1 << mcfppParser.SEMICOLON) | (1 << mcfppParser.RANGE))) !== 0) || ((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (mcfppParser.TRIPLE_QUOTE_OPEN - 45)) | (1 << (mcfppParser.THIS - 45)) | (1 << (mcfppParser.SUPER - 45)) | (1 << (mcfppParser.IF - 45)) | (1 << (mcfppParser.WHILE - 45)) | (1 << (mcfppParser.DO - 45)) | (1 << (mcfppParser.TRY - 45)) | (1 << (mcfppParser.EXECUTE - 45)) | (1 << (mcfppParser.BREAK - 45)) | (1 << (mcfppParser.CONTINUE - 45)) | (1 << (mcfppParser.RETURN - 45)) | (1 << (mcfppParser.CONST - 45)) | (1 << (mcfppParser.DYNAMIC - 45)) | (1 << (mcfppParser.IMPORT - 45)))) !== 0) || ((((_la - 79)) & ~0x1F) === 0 && ((1 << (_la - 79)) & ((1 << (mcfppParser.DATA - 79)) | (1 << (mcfppParser.VAR - 79)) | (1 << (mcfppParser.INT - 79)) | (1 << (mcfppParser.ENTITY - 79)) | (1 << (mcfppParser.BOOL - 79)) | (1 << (mcfppParser.BYTE - 79)) | (1 << (mcfppParser.SHORT - 79)) | (1 << (mcfppParser.LONG - 79)) | (1 << (mcfppParser.FLOAT - 79)) | (1 << (mcfppParser.DOUBLE - 79)) | (1 << (mcfppParser.SELECTOR - 79)) | (1 << (mcfppParser.STRING - 79)) | (1 << (mcfppParser.JTEXT - 79)) | (1 << (mcfppParser.NBT - 79)) | (1 << (mcfppParser.ANY - 79)) | (1 << (mcfppParser.LIST - 79)) | (1 << (mcfppParser.MAP - 79)) | (1 << (mcfppParser.DICT - 79)) | (1 << (mcfppParser.TYPE - 79)) | (1 << (mcfppParser.BYTEARRAY - 79)) | (1 << (mcfppParser.INTARRAY - 79)))) !== 0) || ((((_la - 111)) & ~0x1F) === 0 && ((1 << (_la - 111)) & ((1 << (mcfppParser.LONGARRAY - 111)) | (1 << (mcfppParser.TRUE - 111)) | (1 << (mcfppParser.FALSE - 111)) | (1 << (mcfppParser.NULL - 111)) | (1 << (mcfppParser.VecType - 111)) | (1 << (mcfppParser.TargetSelector - 111)) | (1 << (mcfppParser.Identifier - 111)) | (1 << (mcfppParser.NBT_BYTE_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_INT_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_LONG_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBTByte - 111)) | (1 << (mcfppParser.NBTShort - 111)) | (1 << (mcfppParser.NBTInt - 111)) | (1 << (mcfppParser.NBTLong - 111)) | (1 << (mcfppParser.NBTFloat - 111)) | (1 << (mcfppParser.NBTDouble - 111)) | (1 << (mcfppParser.RelativeValue - 111)) | (1 << (mcfppParser.LineString - 111)))) !== 0)) {
				{
				{
				this.state = 1213;
				this.statement();
				}
				}
				this.state = 1218;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public statement(): StatementContext {
		let _localctx: StatementContext = new StatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 186, mcfppParser.RULE_statement);
		try {
			this.state = 1243;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 138, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1219;
				this.fieldDeclaration();
				this.state = 1220;
				this.match(mcfppParser.SEMICOLON);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1222;
				this.statementExpression();
				this.state = 1223;
				this.match(mcfppParser.SEMICOLON);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1225;
				this.ifStatement();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1226;
				this.whileStatement();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 1227;
				this.doWhileStatement();
				this.state = 1228;
				this.match(mcfppParser.SEMICOLON);
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 1230;
				this.match(mcfppParser.SEMICOLON);
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 1231;
				this.selfAddOrMinusStatement();
				this.state = 1232;
				this.match(mcfppParser.SEMICOLON);
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 1234;
				this.tryStoreStatement();
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 1235;
				this.controlStatement();
				this.state = 1236;
				this.match(mcfppParser.SEMICOLON);
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 1238;
				this.orgCommand();
				}
				break;

			case 11:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 1239;
				this.returnStatement();
				this.state = 1240;
				this.match(mcfppParser.SEMICOLON);
				}
				break;

			case 12:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 1242;
				this.executeStatement();
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
	public executeStatement(): ExecuteStatementContext {
		let _localctx: ExecuteStatementContext = new ExecuteStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 188, mcfppParser.RULE_executeStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1245;
			this.match(mcfppParser.EXECUTE);
			this.state = 1246;
			this.match(mcfppParser.LPAREN);
			this.state = 1247;
			this.executeContext();
			this.state = 1252;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.COMMA) {
				{
				{
				this.state = 1248;
				this.match(mcfppParser.COMMA);
				this.state = 1249;
				this.executeContext();
				}
				}
				this.state = 1254;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1255;
			this.match(mcfppParser.RPAREN);
			this.state = 1256;
			this.block();
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
	public executeContext(): ExecuteContextContext {
		let _localctx: ExecuteContextContext = new ExecuteContextContext(this._ctx, this.state);
		this.enterRule(_localctx, 190, mcfppParser.RULE_executeContext);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1258;
			this.executeExpression();
			this.state = 1259;
			this.match(mcfppParser.ASSIGNMENT);
			this.state = 1260;
			this.expression();
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
	public executeExpression(): ExecuteExpressionContext {
		let _localctx: ExecuteExpressionContext = new ExecuteExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 192, mcfppParser.RULE_executeExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1262;
			this.var();
			this.state = 1267;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.DOT) {
				{
				{
				this.state = 1263;
				this.match(mcfppParser.DOT);
				this.state = 1264;
				this.var();
				}
				}
				this.state = 1269;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public orgCommand(): OrgCommandContext {
		let _localctx: OrgCommandContext = new OrgCommandContext(this._ctx, this.state);
		this.enterRule(_localctx, 194, mcfppParser.RULE_orgCommand);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1270;
			this.match(mcfppParser.DIV);
			this.state = 1272;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			do {
				{
				{
				this.state = 1271;
				this.orgCommandContent();
				}
				}
				this.state = 1274;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			} while (_la === mcfppParser.OrgCommandText || _la === mcfppParser.OrgCommandExprStart);
			this.state = 1276;
			this.match(mcfppParser.OrgCommandEnd);
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
	public orgCommandContent(): OrgCommandContentContext {
		let _localctx: OrgCommandContentContext = new OrgCommandContentContext(this._ctx, this.state);
		this.enterRule(_localctx, 196, mcfppParser.RULE_orgCommandContent);
		try {
			this.state = 1280;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.OrgCommandExprStart:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1278;
				this.orgCommandExpression();
				}
				break;
			case mcfppParser.OrgCommandText:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1279;
				this.match(mcfppParser.OrgCommandText);
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
	public orgCommandExpression(): OrgCommandExpressionContext {
		let _localctx: OrgCommandExpressionContext = new OrgCommandExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 198, mcfppParser.RULE_orgCommandExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1282;
			this.match(mcfppParser.OrgCommandExprStart);
			this.state = 1283;
			this.expression();
			this.state = 1284;
			this.match(mcfppParser.RCURL);
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
	public controlStatement(): ControlStatementContext {
		let _localctx: ControlStatementContext = new ControlStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 200, mcfppParser.RULE_controlStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1286;
			_la = this._input.LA(1);
			if (!(_la === mcfppParser.BREAK || _la === mcfppParser.CONTINUE)) {
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
	public ifStatement(): IfStatementContext {
		let _localctx: IfStatementContext = new IfStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 202, mcfppParser.RULE_ifStatement);
		try {
			let _alt: number;
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1288;
			this.match(mcfppParser.IF);
			this.state = 1289;
			this.match(mcfppParser.LPAREN);
			this.state = 1290;
			this.expression();
			this.state = 1291;
			this.match(mcfppParser.RPAREN);
			this.state = 1292;
			this.ifBlock();
			this.state = 1296;
			this._errHandler.sync(this);
			_alt = this.interpreter.adaptivePredict(this._input, 143, this._ctx);
			while (_alt !== 2 && _alt !== ATN.INVALID_ALT_NUMBER) {
				if (_alt === 1) {
					{
					{
					this.state = 1293;
					this.elseIfStatement();
					}
					}
				}
				this.state = 1298;
				this._errHandler.sync(this);
				_alt = this.interpreter.adaptivePredict(this._input, 143, this._ctx);
			}
			this.state = 1300;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 144, this._ctx) ) {
			case 1:
				{
				this.state = 1299;
				this.elseStatement();
				}
				break;
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
	public elseIfStatement(): ElseIfStatementContext {
		let _localctx: ElseIfStatementContext = new ElseIfStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 204, mcfppParser.RULE_elseIfStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1302;
			this.match(mcfppParser.ELSE);
			this.state = 1303;
			this.match(mcfppParser.IF);
			this.state = 1304;
			this.match(mcfppParser.LPAREN);
			this.state = 1305;
			this.expression();
			this.state = 1306;
			this.match(mcfppParser.RPAREN);
			this.state = 1307;
			this.block();
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
	public elseStatement(): ElseStatementContext {
		let _localctx: ElseStatementContext = new ElseStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 206, mcfppParser.RULE_elseStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1309;
			this.match(mcfppParser.ELSE);
			this.state = 1310;
			this.block();
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
	public ifBlock(): IfBlockContext {
		let _localctx: IfBlockContext = new IfBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 208, mcfppParser.RULE_ifBlock);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1312;
			this.block();
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
	public whileStatement(): WhileStatementContext {
		let _localctx: WhileStatementContext = new WhileStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 210, mcfppParser.RULE_whileStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1314;
			this.match(mcfppParser.WHILE);
			this.state = 1315;
			this.match(mcfppParser.LPAREN);
			this.state = 1316;
			this.expression();
			this.state = 1317;
			this.match(mcfppParser.RPAREN);
			this.state = 1318;
			this.whileBlock();
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
	public whileBlock(): WhileBlockContext {
		let _localctx: WhileBlockContext = new WhileBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 212, mcfppParser.RULE_whileBlock);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1320;
			this.block();
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
	public doWhileStatement(): DoWhileStatementContext {
		let _localctx: DoWhileStatementContext = new DoWhileStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 214, mcfppParser.RULE_doWhileStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1322;
			this.match(mcfppParser.DO);
			this.state = 1323;
			this.doWhileBlock();
			this.state = 1324;
			this.match(mcfppParser.WHILE);
			this.state = 1325;
			this.match(mcfppParser.LPAREN);
			this.state = 1326;
			this.expression();
			this.state = 1327;
			this.match(mcfppParser.RPAREN);
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
	public doWhileBlock(): DoWhileBlockContext {
		let _localctx: DoWhileBlockContext = new DoWhileBlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 216, mcfppParser.RULE_doWhileBlock);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1329;
			this.block();
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
	public selfAddOrMinusStatement(): SelfAddOrMinusStatementContext {
		let _localctx: SelfAddOrMinusStatementContext = new SelfAddOrMinusStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 218, mcfppParser.RULE_selfAddOrMinusStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1331;
			this.selfAddOrMinusExpression();
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
	public tryStoreStatement(): TryStoreStatementContext {
		let _localctx: TryStoreStatementContext = new TryStoreStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 220, mcfppParser.RULE_tryStoreStatement);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1333;
			this.match(mcfppParser.TRY);
			this.state = 1334;
			this.block();
			this.state = 1335;
			this.match(mcfppParser.STORE);
			this.state = 1336;
			this.match(mcfppParser.LPAREN);
			this.state = 1337;
			this.match(mcfppParser.Identifier);
			this.state = 1338;
			this.match(mcfppParser.RPAREN);
			this.state = 1339;
			this.match(mcfppParser.SEMICOLON);
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
	public returnStatement(): ReturnStatementContext {
		let _localctx: ReturnStatementContext = new ReturnStatementContext(this._ctx, this.state);
		this.enterRule(_localctx, 222, mcfppParser.RULE_returnStatement);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1341;
			this.match(mcfppParser.RETURN);
			this.state = 1343;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppParser.LPAREN) | (1 << mcfppParser.LSQUARE) | (1 << mcfppParser.LCURL) | (1 << mcfppParser.EXCL) | (1 << mcfppParser.RANGE))) !== 0) || ((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (mcfppParser.TRIPLE_QUOTE_OPEN - 45)) | (1 << (mcfppParser.THIS - 45)) | (1 << (mcfppParser.SUPER - 45)))) !== 0) || ((((_la - 79)) & ~0x1F) === 0 && ((1 << (_la - 79)) & ((1 << (mcfppParser.DATA - 79)) | (1 << (mcfppParser.INT - 79)) | (1 << (mcfppParser.ENTITY - 79)) | (1 << (mcfppParser.BOOL - 79)) | (1 << (mcfppParser.BYTE - 79)) | (1 << (mcfppParser.SHORT - 79)) | (1 << (mcfppParser.LONG - 79)) | (1 << (mcfppParser.FLOAT - 79)) | (1 << (mcfppParser.DOUBLE - 79)) | (1 << (mcfppParser.SELECTOR - 79)) | (1 << (mcfppParser.STRING - 79)) | (1 << (mcfppParser.JTEXT - 79)) | (1 << (mcfppParser.NBT - 79)) | (1 << (mcfppParser.ANY - 79)) | (1 << (mcfppParser.LIST - 79)) | (1 << (mcfppParser.MAP - 79)) | (1 << (mcfppParser.DICT - 79)) | (1 << (mcfppParser.TYPE - 79)) | (1 << (mcfppParser.BYTEARRAY - 79)) | (1 << (mcfppParser.INTARRAY - 79)))) !== 0) || ((((_la - 111)) & ~0x1F) === 0 && ((1 << (_la - 111)) & ((1 << (mcfppParser.LONGARRAY - 111)) | (1 << (mcfppParser.TRUE - 111)) | (1 << (mcfppParser.FALSE - 111)) | (1 << (mcfppParser.NULL - 111)) | (1 << (mcfppParser.VecType - 111)) | (1 << (mcfppParser.TargetSelector - 111)) | (1 << (mcfppParser.Identifier - 111)) | (1 << (mcfppParser.NBT_BYTE_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_INT_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_LONG_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBTByte - 111)) | (1 << (mcfppParser.NBTShort - 111)) | (1 << (mcfppParser.NBTInt - 111)) | (1 << (mcfppParser.NBTLong - 111)) | (1 << (mcfppParser.NBTFloat - 111)) | (1 << (mcfppParser.NBTDouble - 111)) | (1 << (mcfppParser.RelativeValue - 111)) | (1 << (mcfppParser.LineString - 111)))) !== 0)) {
				{
				this.state = 1342;
				this.expression();
				}
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
	public block(): BlockContext {
		let _localctx: BlockContext = new BlockContext(this._ctx, this.state);
		this.enterRule(_localctx, 224, mcfppParser.RULE_block);
		let _la: number;
		try {
			this.state = 1354;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 147, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1345;
				this.match(mcfppParser.LCURL);
				this.state = 1349;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppParser.LPAREN) | (1 << mcfppParser.LSQUARE) | (1 << mcfppParser.LCURL) | (1 << mcfppParser.DIV) | (1 << mcfppParser.EXCL) | (1 << mcfppParser.SEMICOLON) | (1 << mcfppParser.RANGE))) !== 0) || ((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (mcfppParser.TRIPLE_QUOTE_OPEN - 45)) | (1 << (mcfppParser.THIS - 45)) | (1 << (mcfppParser.SUPER - 45)) | (1 << (mcfppParser.IF - 45)) | (1 << (mcfppParser.WHILE - 45)) | (1 << (mcfppParser.DO - 45)) | (1 << (mcfppParser.TRY - 45)) | (1 << (mcfppParser.EXECUTE - 45)) | (1 << (mcfppParser.BREAK - 45)) | (1 << (mcfppParser.CONTINUE - 45)) | (1 << (mcfppParser.RETURN - 45)) | (1 << (mcfppParser.CONST - 45)) | (1 << (mcfppParser.DYNAMIC - 45)) | (1 << (mcfppParser.IMPORT - 45)))) !== 0) || ((((_la - 79)) & ~0x1F) === 0 && ((1 << (_la - 79)) & ((1 << (mcfppParser.DATA - 79)) | (1 << (mcfppParser.VAR - 79)) | (1 << (mcfppParser.INT - 79)) | (1 << (mcfppParser.ENTITY - 79)) | (1 << (mcfppParser.BOOL - 79)) | (1 << (mcfppParser.BYTE - 79)) | (1 << (mcfppParser.SHORT - 79)) | (1 << (mcfppParser.LONG - 79)) | (1 << (mcfppParser.FLOAT - 79)) | (1 << (mcfppParser.DOUBLE - 79)) | (1 << (mcfppParser.SELECTOR - 79)) | (1 << (mcfppParser.STRING - 79)) | (1 << (mcfppParser.JTEXT - 79)) | (1 << (mcfppParser.NBT - 79)) | (1 << (mcfppParser.ANY - 79)) | (1 << (mcfppParser.LIST - 79)) | (1 << (mcfppParser.MAP - 79)) | (1 << (mcfppParser.DICT - 79)) | (1 << (mcfppParser.TYPE - 79)) | (1 << (mcfppParser.BYTEARRAY - 79)) | (1 << (mcfppParser.INTARRAY - 79)))) !== 0) || ((((_la - 111)) & ~0x1F) === 0 && ((1 << (_la - 111)) & ((1 << (mcfppParser.LONGARRAY - 111)) | (1 << (mcfppParser.TRUE - 111)) | (1 << (mcfppParser.FALSE - 111)) | (1 << (mcfppParser.NULL - 111)) | (1 << (mcfppParser.VecType - 111)) | (1 << (mcfppParser.TargetSelector - 111)) | (1 << (mcfppParser.Identifier - 111)) | (1 << (mcfppParser.NBT_BYTE_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_INT_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_LONG_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBTByte - 111)) | (1 << (mcfppParser.NBTShort - 111)) | (1 << (mcfppParser.NBTInt - 111)) | (1 << (mcfppParser.NBTLong - 111)) | (1 << (mcfppParser.NBTFloat - 111)) | (1 << (mcfppParser.NBTDouble - 111)) | (1 << (mcfppParser.RelativeValue - 111)) | (1 << (mcfppParser.LineString - 111)))) !== 0)) {
					{
					{
					this.state = 1346;
					this.statement();
					}
					}
					this.state = 1351;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1352;
				this.match(mcfppParser.RCURL);
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1353;
				this.statement();
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
	public selfAddOrMinusExpression(): SelfAddOrMinusExpressionContext {
		let _localctx: SelfAddOrMinusExpressionContext = new SelfAddOrMinusExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 226, mcfppParser.RULE_selfAddOrMinusExpression);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1356;
			this.rightVarExpression();
			this.state = 1357;
			_localctx._op = this._input.LT(1);
			_la = this._input.LA(1);
			if (!(_la === mcfppParser.INCR || _la === mcfppParser.DECR)) {
				_localctx._op = this._errHandler.recoverInline(this);
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
	public expressionList(): ExpressionListContext {
		let _localctx: ExpressionListContext = new ExpressionListContext(this._ctx, this.state);
		this.enterRule(_localctx, 228, mcfppParser.RULE_expressionList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1359;
			this.expression();
			this.state = 1364;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.COMMA) {
				{
				{
				this.state = 1360;
				this.match(mcfppParser.COMMA);
				this.state = 1361;
				this.expression();
				}
				}
				this.state = 1366;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
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
	public type(): TypeContext {
		let _localctx: TypeContext = new TypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 230, mcfppParser.RULE_type);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1367;
			this.typeWithoutExcl();
			this.state = 1369;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 149, this._ctx) ) {
			case 1:
				{
				this.state = 1368;
				this.match(mcfppParser.EXCL);
				}
				break;
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
	public typeWithoutExcl(): TypeWithoutExclContext {
		let _localctx: TypeWithoutExclContext = new TypeWithoutExclContext(this._ctx, this.state);
		this.enterRule(_localctx, 232, mcfppParser.RULE_typeWithoutExcl);
		let _la: number;
		try {
			this.state = 1425;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 153, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1371;
				this.normalType();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1372;
				this.match(mcfppParser.VecType);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1373;
				this.match(mcfppParser.LIST);
				this.state = 1374;
				this.match(mcfppParser.LANGLE);
				this.state = 1375;
				this.type();
				this.state = 1376;
				this.match(mcfppParser.RANGLE);
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1378;
				this.match(mcfppParser.MAP);
				this.state = 1379;
				this.match(mcfppParser.LANGLE);
				this.state = 1380;
				this.type();
				this.state = 1381;
				this.match(mcfppParser.RANGLE);
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 1383;
				this.match(mcfppParser.DICT);
				this.state = 1384;
				this.match(mcfppParser.LANGLE);
				this.state = 1385;
				this.type();
				this.state = 1386;
				this.match(mcfppParser.RANGLE);
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 1388;
				this.match(mcfppParser.ENTITY);
				this.state = 1389;
				this.match(mcfppParser.LANGLE);
				this.state = 1390;
				this.nbtInt();
				this.state = 1391;
				this.match(mcfppParser.RANGLE);
				}
				break;

			case 7:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 1393;
				this.match(mcfppParser.ENTITY);
				this.state = 1394;
				this.match(mcfppParser.LANGLE);
				this.state = 1395;
				this.match(mcfppParser.LineString);
				this.state = 1400;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 1396;
					this.match(mcfppParser.COMMA);
					this.state = 1397;
					this.match(mcfppParser.LineString);
					}
					}
					this.state = 1402;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1403;
				this.match(mcfppParser.RANGLE);
				}
				break;

			case 8:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 1404;
				this.match(mcfppParser.ENTITY);
				this.state = 1405;
				this.match(mcfppParser.LANGLE);
				this.state = 1406;
				this.nbtInt();
				this.state = 1407;
				this.match(mcfppParser.COMMA);
				this.state = 1408;
				this.match(mcfppParser.LineString);
				this.state = 1413;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 1409;
					this.match(mcfppParser.COMMA);
					this.state = 1410;
					this.match(mcfppParser.LineString);
					}
					}
					this.state = 1415;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1416;
				this.match(mcfppParser.RANGLE);
				}
				break;

			case 9:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 1418;
				this.className();
				this.state = 1420;
				this._errHandler.sync(this);
				switch ( this.interpreter.adaptivePredict(this._input, 152, this._ctx) ) {
				case 1:
					{
					this.state = 1419;
					this.readOnlyArgs();
					}
					break;
				}
				}
				break;

			case 10:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 1422;
				this.match(mcfppParser.Identifier);
				}
				break;

			case 11:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 1423;
				this.unionTemplateType();
				}
				break;

			case 12:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 1424;
				this.anonymousTemplateType();
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
	public anonymousTemplateType(): AnonymousTemplateTypeContext {
		let _localctx: AnonymousTemplateTypeContext = new AnonymousTemplateTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 234, mcfppParser.RULE_anonymousTemplateType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1427;
			this.match(mcfppParser.DATA);
			this.state = 1437;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.COLON) {
				{
				this.state = 1428;
				this.match(mcfppParser.COLON);
				this.state = 1429;
				this.className();
				this.state = 1434;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 1430;
					this.match(mcfppParser.COMMA);
					this.state = 1431;
					this.className();
					}
					}
					this.state = 1436;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 1439;
			this.templateBody();
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
	public unionTemplateType(): UnionTemplateTypeContext {
		let _localctx: UnionTemplateTypeContext = new UnionTemplateTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 236, mcfppParser.RULE_unionTemplateType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1441;
			this.match(mcfppParser.LPAREN);
			this.state = 1442;
			this.type();
			this.state = 1447;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.UNION) {
				{
				{
				this.state = 1443;
				this.match(mcfppParser.UNION);
				this.state = 1444;
				this.type();
				}
				}
				this.state = 1449;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1450;
			this.match(mcfppParser.RPAREN);
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
	public normalType(): NormalTypeContext {
		let _localctx: NormalTypeContext = new NormalTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 238, mcfppParser.RULE_normalType);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1452;
			_la = this._input.LA(1);
			if (!(((((_la - 91)) & ~0x1F) === 0 && ((1 << (_la - 91)) & ((1 << (mcfppParser.INT - 91)) | (1 << (mcfppParser.ENTITY - 91)) | (1 << (mcfppParser.BOOL - 91)) | (1 << (mcfppParser.BYTE - 91)) | (1 << (mcfppParser.SHORT - 91)) | (1 << (mcfppParser.LONG - 91)) | (1 << (mcfppParser.FLOAT - 91)) | (1 << (mcfppParser.DOUBLE - 91)) | (1 << (mcfppParser.SELECTOR - 91)) | (1 << (mcfppParser.STRING - 91)) | (1 << (mcfppParser.JTEXT - 91)) | (1 << (mcfppParser.NBT - 91)) | (1 << (mcfppParser.ANY - 91)) | (1 << (mcfppParser.TYPE - 91)) | (1 << (mcfppParser.BYTEARRAY - 91)) | (1 << (mcfppParser.INTARRAY - 91)) | (1 << (mcfppParser.LONGARRAY - 91)))) !== 0))) {
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
	public functionReturnType(): FunctionReturnTypeContext {
		let _localctx: FunctionReturnTypeContext = new FunctionReturnTypeContext(this._ctx, this.state);
		this.enterRule(_localctx, 240, mcfppParser.RULE_functionReturnType);
		try {
			this.state = 1456;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.LPAREN:
			case mcfppParser.DATA:
			case mcfppParser.INT:
			case mcfppParser.ENTITY:
			case mcfppParser.BOOL:
			case mcfppParser.BYTE:
			case mcfppParser.SHORT:
			case mcfppParser.LONG:
			case mcfppParser.FLOAT:
			case mcfppParser.DOUBLE:
			case mcfppParser.SELECTOR:
			case mcfppParser.STRING:
			case mcfppParser.JTEXT:
			case mcfppParser.NBT:
			case mcfppParser.ANY:
			case mcfppParser.LIST:
			case mcfppParser.MAP:
			case mcfppParser.DICT:
			case mcfppParser.TYPE:
			case mcfppParser.BYTEARRAY:
			case mcfppParser.INTARRAY:
			case mcfppParser.LONGARRAY:
			case mcfppParser.VecType:
			case mcfppParser.Identifier:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1454;
				this.type();
				}
				break;
			case mcfppParser.VOID:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1455;
				this.match(mcfppParser.VOID);
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
	public value(): ValueContext {
		let _localctx: ValueContext = new ValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 242, mcfppParser.RULE_value);
		try {
			this.state = 1464;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 158, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1458;
				this.coordinate();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1459;
				this.match(mcfppParser.LineString);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1460;
				this.multiLineStringLiteral();
				}
				break;

			case 4:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1461;
				this.nbtValue();
				}
				break;

			case 5:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 1462;
				this.match(mcfppParser.TargetSelector);
				}
				break;

			case 6:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 1463;
				this.match(mcfppParser.NULL);
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
	public coordinate(): CoordinateContext {
		let _localctx: CoordinateContext = new CoordinateContext(this._ctx, this.state);
		this.enterRule(_localctx, 244, mcfppParser.RULE_coordinate);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1466;
			this.coordinateDimension();
			this.state = 1467;
			this.coordinateDimension();
			this.state = 1469;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 159, this._ctx) ) {
			case 1:
				{
				this.state = 1468;
				this.coordinateDimension();
				}
				break;
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
	public coordinateDimension(): CoordinateDimensionContext {
		let _localctx: CoordinateDimensionContext = new CoordinateDimensionContext(this._ctx, this.state);
		this.enterRule(_localctx, 246, mcfppParser.RULE_coordinateDimension);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1475;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.RelativeValue:
				{
				this.state = 1471;
				this.match(mcfppParser.RelativeValue);
				}
				break;
			case mcfppParser.NBTInt:
				{
				this.state = 1472;
				this.nbtInt();
				}
				break;
			case mcfppParser.NBTFloat:
				{
				this.state = 1473;
				this.nbtFloat();
				}
				break;
			case mcfppParser.NBTDouble:
				{
				this.state = 1474;
				this.nbtDouble();
				}
				break;
			default:
				throw new NoViableAltException(this);
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
	public className(): ClassNameContext {
		let _localctx: ClassNameContext = new ClassNameContext(this._ctx, this.state);
		this.enterRule(_localctx, 248, mcfppParser.RULE_className);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1486;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 162, this._ctx) ) {
			case 1:
				{
				this.state = 1477;
				this.match(mcfppParser.Identifier);
				this.state = 1482;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.DOT) {
					{
					{
					this.state = 1478;
					this.match(mcfppParser.DOT);
					this.state = 1479;
					this.match(mcfppParser.Identifier);
					}
					}
					this.state = 1484;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				this.state = 1485;
				this.match(mcfppParser.COLON);
				}
				break;
			}
			this.state = 1488;
			this.classWithoutNamespace();
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
	public typeList(): TypeListContext {
		let _localctx: TypeListContext = new TypeListContext(this._ctx, this.state);
		this.enterRule(_localctx, 250, mcfppParser.RULE_typeList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1490;
			this.match(mcfppParser.LANGLE);
			this.state = 1492;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LANGLE) {
				{
				this.state = 1491;
				this.typeList();
				}
			}

			this.state = 1494;
			this.match(mcfppParser.RANGLE);
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
	public classWithoutNamespace(): ClassWithoutNamespaceContext {
		let _localctx: ClassWithoutNamespaceContext = new ClassWithoutNamespaceContext(this._ctx, this.state);
		this.enterRule(_localctx, 252, mcfppParser.RULE_classWithoutNamespace);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1496;
			this.match(mcfppParser.Identifier);
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
	public annotation(): AnnotationContext {
		let _localctx: AnnotationContext = new AnnotationContext(this._ctx, this.state);
		this.enterRule(_localctx, 254, mcfppParser.RULE_annotation);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1498;
			this.match(mcfppParser.AT);
			this.state = 1499;
			_localctx._id = this.match(mcfppParser.Identifier);
			this.state = 1501;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LANGLE) {
				{
				this.state = 1500;
				this.annotationArgs();
				}
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
	public annotationArgs(): AnnotationArgsContext {
		let _localctx: AnnotationArgsContext = new AnnotationArgsContext(this._ctx, this.state);
		this.enterRule(_localctx, 256, mcfppParser.RULE_annotationArgs);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1503;
			this.match(mcfppParser.LANGLE);
			this.state = 1512;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			if (_la === mcfppParser.LSQUARE || _la === mcfppParser.LCURL || _la === mcfppParser.TRIPLE_QUOTE_OPEN || ((((_la - 112)) & ~0x1F) === 0 && ((1 << (_la - 112)) & ((1 << (mcfppParser.TRUE - 112)) | (1 << (mcfppParser.FALSE - 112)) | (1 << (mcfppParser.NULL - 112)) | (1 << (mcfppParser.TargetSelector - 112)) | (1 << (mcfppParser.NBT_BYTE_ARRAY_BEGIN - 112)) | (1 << (mcfppParser.NBT_INT_ARRAY_BEGIN - 112)) | (1 << (mcfppParser.NBT_LONG_ARRAY_BEGIN - 112)) | (1 << (mcfppParser.NBTByte - 112)) | (1 << (mcfppParser.NBTShort - 112)) | (1 << (mcfppParser.NBTInt - 112)) | (1 << (mcfppParser.NBTLong - 112)) | (1 << (mcfppParser.NBTFloat - 112)) | (1 << (mcfppParser.NBTDouble - 112)) | (1 << (mcfppParser.RelativeValue - 112)) | (1 << (mcfppParser.LineString - 112)))) !== 0)) {
				{
				this.state = 1504;
				this.value();
				this.state = 1509;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 1505;
					this.match(mcfppParser.COMMA);
					this.state = 1506;
					this.value();
					}
					}
					this.state = 1511;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
			}

			this.state = 1514;
			this.match(mcfppParser.RANGLE);
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
	public range(): RangeContext {
		let _localctx: RangeContext = new RangeContext(this._ctx, this.state);
		this.enterRule(_localctx, 258, mcfppParser.RULE_range);
		try {
			this.state = 1525;
			this._errHandler.sync(this);
			switch ( this.interpreter.adaptivePredict(this._input, 167, this._ctx) ) {
			case 1:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1516;
				_localctx._num1 = this.var();
				this.state = 1517;
				this.match(mcfppParser.RANGE);
				this.state = 1518;
				_localctx._num2 = this.var();
				}
				break;

			case 2:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1520;
				_localctx._num1 = this.var();
				this.state = 1521;
				this.match(mcfppParser.RANGE);
				}
				break;

			case 3:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1523;
				this.match(mcfppParser.RANGE);
				this.state = 1524;
				_localctx._num2 = this.var();
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
	public nbtValue(): NbtValueContext {
		let _localctx: NbtValueContext = new NbtValueContext(this._ctx, this.state);
		this.enterRule(_localctx, 260, mcfppParser.RULE_nbtValue);
		try {
			this.state = 1540;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.LineString:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1527;
				this.match(mcfppParser.LineString);
				}
				break;
			case mcfppParser.TRUE:
			case mcfppParser.FALSE:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1528;
				this.nbtBool();
				}
				break;
			case mcfppParser.NBTByte:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1529;
				this.nbtByte();
				}
				break;
			case mcfppParser.NBTShort:
				this.enterOuterAlt(_localctx, 4);
				{
				this.state = 1530;
				this.nbtShort();
				}
				break;
			case mcfppParser.NBTInt:
				this.enterOuterAlt(_localctx, 5);
				{
				this.state = 1531;
				this.nbtInt();
				}
				break;
			case mcfppParser.NBTLong:
				this.enterOuterAlt(_localctx, 6);
				{
				this.state = 1532;
				this.nbtLong();
				}
				break;
			case mcfppParser.NBTFloat:
				this.enterOuterAlt(_localctx, 7);
				{
				this.state = 1533;
				this.nbtFloat();
				}
				break;
			case mcfppParser.NBTDouble:
				this.enterOuterAlt(_localctx, 8);
				{
				this.state = 1534;
				this.nbtDouble();
				}
				break;
			case mcfppParser.LCURL:
				this.enterOuterAlt(_localctx, 9);
				{
				this.state = 1535;
				this.nbtCompound();
				}
				break;
			case mcfppParser.LSQUARE:
				this.enterOuterAlt(_localctx, 10);
				{
				this.state = 1536;
				this.nbtList();
				}
				break;
			case mcfppParser.NBT_BYTE_ARRAY_BEGIN:
				this.enterOuterAlt(_localctx, 11);
				{
				this.state = 1537;
				this.nbtByteArray();
				}
				break;
			case mcfppParser.NBT_INT_ARRAY_BEGIN:
				this.enterOuterAlt(_localctx, 12);
				{
				this.state = 1538;
				this.nbtIntArray();
				}
				break;
			case mcfppParser.NBT_LONG_ARRAY_BEGIN:
				this.enterOuterAlt(_localctx, 13);
				{
				this.state = 1539;
				this.nbtLongArray();
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
	public nbtByte(): NbtByteContext {
		let _localctx: NbtByteContext = new NbtByteContext(this._ctx, this.state);
		this.enterRule(_localctx, 262, mcfppParser.RULE_nbtByte);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1542;
			this.match(mcfppParser.NBTByte);
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
	public nbtShort(): NbtShortContext {
		let _localctx: NbtShortContext = new NbtShortContext(this._ctx, this.state);
		this.enterRule(_localctx, 264, mcfppParser.RULE_nbtShort);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1544;
			this.match(mcfppParser.NBTShort);
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
	public nbtInt(): NbtIntContext {
		let _localctx: NbtIntContext = new NbtIntContext(this._ctx, this.state);
		this.enterRule(_localctx, 266, mcfppParser.RULE_nbtInt);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1546;
			this.match(mcfppParser.NBTInt);
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
	public nbtLong(): NbtLongContext {
		let _localctx: NbtLongContext = new NbtLongContext(this._ctx, this.state);
		this.enterRule(_localctx, 268, mcfppParser.RULE_nbtLong);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1548;
			this.match(mcfppParser.NBTLong);
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
	public nbtFloat(): NbtFloatContext {
		let _localctx: NbtFloatContext = new NbtFloatContext(this._ctx, this.state);
		this.enterRule(_localctx, 270, mcfppParser.RULE_nbtFloat);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1550;
			this.match(mcfppParser.NBTFloat);
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
	public nbtDouble(): NbtDoubleContext {
		let _localctx: NbtDoubleContext = new NbtDoubleContext(this._ctx, this.state);
		this.enterRule(_localctx, 272, mcfppParser.RULE_nbtDouble);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1552;
			this.match(mcfppParser.NBTDouble);
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
	public nbtBool(): NbtBoolContext {
		let _localctx: NbtBoolContext = new NbtBoolContext(this._ctx, this.state);
		this.enterRule(_localctx, 274, mcfppParser.RULE_nbtBool);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1554;
			_la = this._input.LA(1);
			if (!(_la === mcfppParser.TRUE || _la === mcfppParser.FALSE)) {
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
	public nbtByteArray(): NbtByteArrayContext {
		let _localctx: NbtByteArrayContext = new NbtByteArrayContext(this._ctx, this.state);
		this.enterRule(_localctx, 276, mcfppParser.RULE_nbtByteArray);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1556;
			this.match(mcfppParser.NBT_BYTE_ARRAY_BEGIN);
			this.state = 1557;
			this.nbtByte();
			this.state = 1562;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.COMMA) {
				{
				{
				this.state = 1558;
				this.match(mcfppParser.COMMA);
				this.state = 1559;
				this.nbtByte();
				}
				}
				this.state = 1564;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1565;
			this.match(mcfppParser.RSQUARE);
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
	public nbtIntArray(): NbtIntArrayContext {
		let _localctx: NbtIntArrayContext = new NbtIntArrayContext(this._ctx, this.state);
		this.enterRule(_localctx, 278, mcfppParser.RULE_nbtIntArray);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1567;
			this.match(mcfppParser.NBT_INT_ARRAY_BEGIN);
			this.state = 1568;
			this.nbtInt();
			this.state = 1573;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.COMMA) {
				{
				{
				this.state = 1569;
				this.match(mcfppParser.COMMA);
				this.state = 1570;
				this.nbtInt();
				}
				}
				this.state = 1575;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1576;
			this.match(mcfppParser.RSQUARE);
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
	public nbtLongArray(): NbtLongArrayContext {
		let _localctx: NbtLongArrayContext = new NbtLongArrayContext(this._ctx, this.state);
		this.enterRule(_localctx, 280, mcfppParser.RULE_nbtLongArray);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1578;
			this.match(mcfppParser.NBT_LONG_ARRAY_BEGIN);
			this.state = 1579;
			this.nbtLong();
			this.state = 1584;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.COMMA) {
				{
				{
				this.state = 1580;
				this.match(mcfppParser.COMMA);
				this.state = 1581;
				this.nbtLong();
				}
				}
				this.state = 1586;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1587;
			this.match(mcfppParser.RSQUARE);
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
	public nbtList(): NbtListContext {
		let _localctx: NbtListContext = new NbtListContext(this._ctx, this.state);
		this.enterRule(_localctx, 282, mcfppParser.RULE_nbtList);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1589;
			this.match(mcfppParser.LSQUARE);
			this.state = 1600;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while ((((_la) & ~0x1F) === 0 && ((1 << _la) & ((1 << mcfppParser.LPAREN) | (1 << mcfppParser.LSQUARE) | (1 << mcfppParser.LCURL) | (1 << mcfppParser.EXCL) | (1 << mcfppParser.RANGE))) !== 0) || ((((_la - 45)) & ~0x1F) === 0 && ((1 << (_la - 45)) & ((1 << (mcfppParser.TRIPLE_QUOTE_OPEN - 45)) | (1 << (mcfppParser.THIS - 45)) | (1 << (mcfppParser.SUPER - 45)))) !== 0) || ((((_la - 79)) & ~0x1F) === 0 && ((1 << (_la - 79)) & ((1 << (mcfppParser.DATA - 79)) | (1 << (mcfppParser.INT - 79)) | (1 << (mcfppParser.ENTITY - 79)) | (1 << (mcfppParser.BOOL - 79)) | (1 << (mcfppParser.BYTE - 79)) | (1 << (mcfppParser.SHORT - 79)) | (1 << (mcfppParser.LONG - 79)) | (1 << (mcfppParser.FLOAT - 79)) | (1 << (mcfppParser.DOUBLE - 79)) | (1 << (mcfppParser.SELECTOR - 79)) | (1 << (mcfppParser.STRING - 79)) | (1 << (mcfppParser.JTEXT - 79)) | (1 << (mcfppParser.NBT - 79)) | (1 << (mcfppParser.ANY - 79)) | (1 << (mcfppParser.LIST - 79)) | (1 << (mcfppParser.MAP - 79)) | (1 << (mcfppParser.DICT - 79)) | (1 << (mcfppParser.TYPE - 79)) | (1 << (mcfppParser.BYTEARRAY - 79)) | (1 << (mcfppParser.INTARRAY - 79)))) !== 0) || ((((_la - 111)) & ~0x1F) === 0 && ((1 << (_la - 111)) & ((1 << (mcfppParser.LONGARRAY - 111)) | (1 << (mcfppParser.TRUE - 111)) | (1 << (mcfppParser.FALSE - 111)) | (1 << (mcfppParser.NULL - 111)) | (1 << (mcfppParser.VecType - 111)) | (1 << (mcfppParser.TargetSelector - 111)) | (1 << (mcfppParser.Identifier - 111)) | (1 << (mcfppParser.NBT_BYTE_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_INT_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBT_LONG_ARRAY_BEGIN - 111)) | (1 << (mcfppParser.NBTByte - 111)) | (1 << (mcfppParser.NBTShort - 111)) | (1 << (mcfppParser.NBTInt - 111)) | (1 << (mcfppParser.NBTLong - 111)) | (1 << (mcfppParser.NBTFloat - 111)) | (1 << (mcfppParser.NBTDouble - 111)) | (1 << (mcfppParser.RelativeValue - 111)) | (1 << (mcfppParser.LineString - 111)))) !== 0)) {
				{
				{
				this.state = 1590;
				this.expression();
				this.state = 1595;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 1591;
					this.match(mcfppParser.COMMA);
					this.state = 1592;
					this.expression();
					}
					}
					this.state = 1597;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				}
				this.state = 1602;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1603;
			this.match(mcfppParser.RSQUARE);
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
	public nbtKeyValuePair(): NbtKeyValuePairContext {
		let _localctx: NbtKeyValuePairContext = new NbtKeyValuePairContext(this._ctx, this.state);
		this.enterRule(_localctx, 284, mcfppParser.RULE_nbtKeyValuePair);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1605;
			_localctx._key = this.match(mcfppParser.Identifier);
			this.state = 1606;
			this.match(mcfppParser.COLON);
			this.state = 1607;
			this.expression();
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
	public nbtCompound(): NbtCompoundContext {
		let _localctx: NbtCompoundContext = new NbtCompoundContext(this._ctx, this.state);
		this.enterRule(_localctx, 286, mcfppParser.RULE_nbtCompound);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1609;
			this.match(mcfppParser.LCURL);
			this.state = 1620;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (_la === mcfppParser.Identifier) {
				{
				{
				this.state = 1610;
				this.nbtKeyValuePair();
				this.state = 1615;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
				while (_la === mcfppParser.COMMA) {
					{
					{
					this.state = 1611;
					this.match(mcfppParser.COMMA);
					this.state = 1612;
					this.nbtKeyValuePair();
					}
					}
					this.state = 1617;
					this._errHandler.sync(this);
					_la = this._input.LA(1);
				}
				}
				}
				this.state = 1622;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1623;
			this.match(mcfppParser.RCURL);
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
	public multiLineStringLiteral(): MultiLineStringLiteralContext {
		let _localctx: MultiLineStringLiteralContext = new MultiLineStringLiteralContext(this._ctx, this.state);
		this.enterRule(_localctx, 288, mcfppParser.RULE_multiLineStringLiteral);
		let _la: number;
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1625;
			this.match(mcfppParser.TRIPLE_QUOTE_OPEN);
			this.state = 1629;
			this._errHandler.sync(this);
			_la = this._input.LA(1);
			while (((((_la - 170)) & ~0x1F) === 0 && ((1 << (_la - 170)) & ((1 << (mcfppParser.MultiLineStringQuote - 170)) | (1 << (mcfppParser.MultiLineStrExprStart - 170)) | (1 << (mcfppParser.MultiLineStrText - 170)))) !== 0)) {
				{
				{
				this.state = 1626;
				this.multiLineStringContent();
				}
				}
				this.state = 1631;
				this._errHandler.sync(this);
				_la = this._input.LA(1);
			}
			this.state = 1632;
			this.match(mcfppParser.TRIPLE_QUOTE_CLOSE);
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
	public multiLineStringContent(): MultiLineStringContentContext {
		let _localctx: MultiLineStringContentContext = new MultiLineStringContentContext(this._ctx, this.state);
		this.enterRule(_localctx, 290, mcfppParser.RULE_multiLineStringContent);
		try {
			this.state = 1637;
			this._errHandler.sync(this);
			switch (this._input.LA(1)) {
			case mcfppParser.MultiLineStrExprStart:
				this.enterOuterAlt(_localctx, 1);
				{
				this.state = 1634;
				this.multiLineStringExpression();
				}
				break;
			case mcfppParser.MultiLineStrText:
				this.enterOuterAlt(_localctx, 2);
				{
				this.state = 1635;
				this.match(mcfppParser.MultiLineStrText);
				}
				break;
			case mcfppParser.MultiLineStringQuote:
				this.enterOuterAlt(_localctx, 3);
				{
				this.state = 1636;
				this.match(mcfppParser.MultiLineStringQuote);
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
	public multiLineStringExpression(): MultiLineStringExpressionContext {
		let _localctx: MultiLineStringExpressionContext = new MultiLineStringExpressionContext(this._ctx, this.state);
		this.enterRule(_localctx, 292, mcfppParser.RULE_multiLineStringExpression);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1639;
			this.match(mcfppParser.MultiLineStrExprStart);
			this.state = 1640;
			this.expression();
			this.state = 1641;
			this.match(mcfppParser.RCURL);
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
	public doc_comment(): Doc_commentContext {
		let _localctx: Doc_commentContext = new Doc_commentContext(this._ctx, this.state);
		this.enterRule(_localctx, 294, mcfppParser.RULE_doc_comment);
		try {
			this.enterOuterAlt(_localctx, 1);
			{
			this.state = 1643;
			this.match(mcfppParser.DOC_COMMENT);
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

	private static readonly _serializedATNSegments: number = 3;
	private static readonly _serializedATNSegment0: string =
		"\x03\uC91D\uCABA\u058D\uAFBA\u4F53\u0607\uEA8B\uC241\x03\xAE\u0670\x04" +
		"\x02\t\x02\x04\x03\t\x03\x04\x04\t\x04\x04\x05\t\x05\x04\x06\t\x06\x04" +
		"\x07\t\x07\x04\b\t\b\x04\t\t\t\x04\n\t\n\x04\v\t\v\x04\f\t\f\x04\r\t\r" +
		"\x04\x0E\t\x0E\x04\x0F\t\x0F\x04\x10\t\x10\x04\x11\t\x11\x04\x12\t\x12" +
		"\x04\x13\t\x13\x04\x14\t\x14\x04\x15\t\x15\x04\x16\t\x16\x04\x17\t\x17" +
		"\x04\x18\t\x18\x04\x19\t\x19\x04\x1A\t\x1A\x04\x1B\t\x1B\x04\x1C\t\x1C" +
		"\x04\x1D\t\x1D\x04\x1E\t\x1E\x04\x1F\t\x1F\x04 \t \x04!\t!\x04\"\t\"\x04" +
		"#\t#\x04$\t$\x04%\t%\x04&\t&\x04\'\t\'\x04(\t(\x04)\t)\x04*\t*\x04+\t" +
		"+\x04,\t,\x04-\t-\x04.\t.\x04/\t/\x040\t0\x041\t1\x042\t2\x043\t3\x04" +
		"4\t4\x045\t5\x046\t6\x047\t7\x048\t8\x049\t9\x04:\t:\x04;\t;\x04<\t<\x04" +
		"=\t=\x04>\t>\x04?\t?\x04@\t@\x04A\tA\x04B\tB\x04C\tC\x04D\tD\x04E\tE\x04" +
		"F\tF\x04G\tG\x04H\tH\x04I\tI\x04J\tJ\x04K\tK\x04L\tL\x04M\tM\x04N\tN\x04" +
		"O\tO\x04P\tP\x04Q\tQ\x04R\tR\x04S\tS\x04T\tT\x04U\tU\x04V\tV\x04W\tW\x04" +
		"X\tX\x04Y\tY\x04Z\tZ\x04[\t[\x04\\\t\\\x04]\t]\x04^\t^\x04_\t_\x04`\t" +
		"`\x04a\ta\x04b\tb\x04c\tc\x04d\td\x04e\te\x04f\tf\x04g\tg\x04h\th\x04" +
		"i\ti\x04j\tj\x04k\tk\x04l\tl\x04m\tm\x04n\tn\x04o\to\x04p\tp\x04q\tq\x04" +
		"r\tr\x04s\ts\x04t\tt\x04u\tu\x04v\tv\x04w\tw\x04x\tx\x04y\ty\x04z\tz\x04" +
		"{\t{\x04|\t|\x04}\t}\x04~\t~\x04\x7F\t\x7F\x04\x80\t\x80\x04\x81\t\x81" +
		"\x04\x82\t\x82\x04\x83\t\x83\x04\x84\t\x84\x04\x85\t\x85\x04\x86\t\x86" +
		"\x04\x87\t\x87\x04\x88\t\x88\x04\x89\t\x89\x04\x8A\t\x8A\x04\x8B\t\x8B" +
		"\x04\x8C\t\x8C\x04\x8D\t\x8D\x04\x8E\t\x8E\x04\x8F\t\x8F\x04\x90\t\x90" +
		"\x04\x91\t\x91\x04\x92\t\x92\x04\x93\t\x93\x04\x94\t\x94\x04\x95\t\x95" +
		"\x03\x02\x05\x02\u012C\n\x02\x03\x02\x07\x02\u012F\n\x02\f\x02\x0E\x02" +
		"\u0132\v\x02\x03\x02\x07\x02\u0135\n\x02\f\x02\x0E\x02\u0138\v\x02\x03" +
		"\x02\x07\x02\u013B\n\x02\f\x02\x0E\x02\u013E\v\x02\x03\x02\x03\x02\x03" +
		"\x03\x07\x03\u0143\n\x03\f\x03\x0E\x03\u0146\v\x03\x03\x04\x05\x04\u0149" +
		"\n\x04\x03\x04\x03\x04\x03\x04\x03\x04\x07\x04\u014F\n\x04\f\x04\x0E\x04" +
		"\u0152\v\x04\x03\x04\x03\x04\x03\x05\x03\x05\x03\x05\x03\x05\x05\x05\u015A" +
		"\n\x05\x03\x05\x03\x05\x05\x05\u015E\n\x05\x03\x05\x03\x05\x03\x06\x03" +
		"\x06\x03\x06\x07\x06\u0165\n\x06\f\x06\x0E\x06\u0168\v\x06\x03\x06\x03" +
		"\x06\x03\x06\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\x07\x03\b\x05" +
		"\b\u0174\n\b\x03\b\x03\b\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03" +
		"\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x03\t\x05\t\u0188\n\t\x03" +
		"\n\x05\n\u018B\n\n\x03\n\x03\n\x03\n\x03\n\x07\n\u0191\n\n\f\n\x0E\n\u0194" +
		"\v\n\x03\n\x05\n\u0197\n\n\x03\n\x03\n\x03\n\x03\n\x05\n\u019D\n\n\x03" +
		"\v\x03\v\x03\v\x05\v\u01A2\n\v\x03\f\x05\f\u01A5\n\f\x03\f\x05\f\u01A8" +
		"\n\f\x03\f\x05\f\u01AB\n\f\x03\f\x03\f\x03\f\x05\f\u01B0\n\f\x03\f\x03" +
		"\f\x03\f\x03\f\x07\f\u01B6\n\f\f\f\x0E\f\u01B9\v\f\x05\f\u01BB\n\f\x03" +
		"\f\x03\f\x05\f\u01BF\n\f\x03\r\x05\r\u01C2\n\r\x03\r\x03\r\x03\r\x03\r" +
		"\x05\r\u01C8\n\r\x03\r\x03\r\x03\r\x03\r\x07\r\u01CE\n\r\f\r\x0E\r\u01D1" +
		"\v\r\x05\r\u01D3\n\r\x03\r\x03\r\x05\r\u01D7\n\r\x03\x0E\x03\x0E\x03\x0E" +
		"\x03\x0E\x03\x0E\x03\x0E\x03\x0E\x07\x0E\u01E0\n\x0E\f\x0E\x0E\x0E\u01E3" +
		"\v\x0E\x05\x0E\u01E5\n\x0E\x03\x0E\x03\x0E\x03\x0F\x03\x0F\x03\x0F\x03" +
		"\x0F\x03\x0F\x03\x0F\x03\x10\x05\x10\u01F0\n\x10\x03\x10\x03\x10\x03\x11" +
		"\x03\x11\x05\x11\u01F6\n\x11\x03\x11\x07\x11\u01F9\n\x11\f\x11\x0E\x11" +
		"\u01FC\v\x11\x03\x11\x03\x11\x03\x12\x03\x12\x03\x12\x03\x12\x03\x12\x03" +
		"\x12\x03\x12\x03\x12\x05\x12\u0208\n\x12\x03\x13\x05\x13\u020B\n\x13\x03" +
		"\x13\x03\x13\x03\x13\x03\x13\x03\x13\x05\x13\u0212\n\x13\x03\x13\x03\x13" +
		"\x03\x13\x03\x13\x03\x14\x05\x14\u0219\n\x14\x03\x14\x03\x14\x03\x14\x03" +
		"\x14\x03\x14\x05\x14\u0220\n\x14\x03\x14\x03\x14\x03\x15\x05\x15\u0225" +
		"\n\x15\x03\x15\x03\x15\x03\x15\x03\x15\x03\x15\x05\x15\u022C\n\x15\x03" +
		"\x15\x03\x15\x03\x15\x03\x15\x03\x16\x03\x16\x03\x16\x03\x16\x03\x16\x05" +
		"\x16\u0237\n\x16\x03\x16\x03\x16\x03\x16\x03\x16\x03\x17\x03\x17\x03\x17" +
		"\x03\x17\x03\x17\x05\x17\u0242\n\x17\x03\x17\x03\x17\x03\x17\x03\x17\x03" +
		"\x18\x03\x18\x03\x19\x05\x19\u024B\n\x19\x03\x19\x03\x19\x03\x19\x05\x19" +
		"\u0250\n\x19\x03\x19\x03\x19\x05\x19\u0254\n\x19\x03\x19\x05\x19\u0257" +
		"\n\x19\x03\x19\x03\x19\x03\x1A\x03\x1A\x05\x1A\u025D\n\x1A\x03\x1A\x05" +
		"\x1A\u0260\n\x1A\x03\x1A\x03\x1A\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B" +
		"\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B\x03\x1B" +
		"\x03\x1B\x03\x1B\x03\x1B\x05\x1B\u0275\n\x1B\x03\x1C\x03\x1C\x03\x1C\x03" +
		"\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x03" +
		"\x1C\x03\x1C\x03\x1C\x03\x1C\x03\x1C\x05\x1C\u0288\n\x1C\x03\x1D\x03\x1D" +
		"\x05\x1D\u028C\n\x1D\x03\x1D\x05\x1D\u028F\n\x1D\x03\x1D\x05\x1D\u0292" +
		"\n\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x03\x1D\x07\x1D" +
		"\u029B\n\x1D\f\x1D\x0E\x1D\u029E\v\x1D\x05\x1D\u02A0\n\x1D\x03\x1D\x03" +
		"\x1D\x05\x1D\u02A4\n\x1D\x03\x1E\x05\x1E\u02A7\n\x1E\x03\x1E\x03\x1E\x03" +
		"\x1E\x05\x1E\u02AC\n\x1E\x03\x1E\x03\x1E\x03\x1E\x03\x1E\x07\x1E\u02B2" +
		"\n\x1E\f\x1E\x0E\x1E\u02B5\v\x1E\x03\x1E\x03\x1E\x05\x1E\u02B9\n\x1E\x03" +
		"\x1E\x03\x1E\x05\x1E\u02BD\n\x1E\x03\x1F\x05\x1F\u02C0\n\x1F\x03\x1F\x03" +
		"\x1F\x03\x1F\x03\x1F\x05\x1F\u02C6\n\x1F\x03\x1F\x03\x1F\x03\x1F\x03\x1F" +
		"\x07\x1F\u02CC\n\x1F\f\x1F\x0E\x1F\u02CF\v\x1F\x05\x1F\u02D1\n\x1F\x03" +
		"\x1F\x03\x1F\x05\x1F\u02D5\n\x1F\x03 \x03 \x05 \u02D9\n \x03 \x07 \u02DC" +
		"\n \f \x0E \u02DF\v \x03 \x03 \x03!\x05!\u02E4\n!\x03!\x03!\x03\"\x03" +
		"\"\x03\"\x03\"\x03\"\x03\"\x05\"\u02EE\n\"\x03#\x05#\u02F1\n#\x03#\x03" +
		"#\x03#\x03#\x03#\x05#\u02F8\n#\x03#\x03#\x03#\x03#\x03$\x05$\u02FF\n$" +
		"\x03$\x05$\u0302\n$\x03$\x03$\x03$\x05$\u0307\n$\x03$\x03$\x05$\u030B" +
		"\n$\x03$\x05$\u030E\n$\x03$\x03$\x03%\x03%\x05%\u0314\n%\x03&\x03&\x05" +
		"&\u0318\n&\x03\'\x03\'\x03\'\x03\'\x07\'\u031E\n\'\f\'\x0E\'\u0321\v\'" +
		"\x03\'\x03\'\x05\'\u0325\n\'\x03(\x03(\x03(\x03(\x03(\x03(\x07(\u032D" +
		"\n(\f(\x0E(\u0330\v(\x05(\u0332\n(\x03(\x03(\x05(\u0336\n(\x03)\x03)\x05" +
		")\u033A\n)\x03)\x05)\u033D\n)\x03)\x07)\u0340\n)\f)\x0E)\u0343\v)\x03" +
		")\x03)\x03*\x03*\x03*\x03*\x03*\x05*\u034C\n*\x03*\x03*\x03+\x03+\x03" +
		"+\x03+\x03+\x03+\x05+\u0356\n+\x03+\x03+\x03+\x03+\x03,\x03,\x03,\x03" +
		",\x03,\x03,\x05,\u0362\n,\x03,\x03,\x03,\x03,\x03-\x03-\x03-\x05-\u036B" +
		"\n-\x03-\x03-\x05-\u036F\n-\x03-\x03-\x03-\x03-\x03.\x03.\x03.\x03.\x05" +
		".\u0379\n.\x03.\x03.\x03.\x03.\x05.\u037F\n.\x03.\x03.\x03.\x03.\x03/" +
		"\x03/\x03/\x03/\x03/\x03/\x030\x030\x030\x070\u038E\n0\f0\x0E0\u0391\v" +
		"0\x031\x031\x031\x051\u0396\n1\x032\x032\x032\x072\u039B\n2\f2\x0E2\u039E" +
		"\v2\x032\x052\u03A1\n2\x032\x032\x033\x033\x033\x033\x033\x053\u03AA\n" +
		"3\x033\x033\x033\x033\x034\x034\x034\x074\u03B3\n4\f4\x0E4\u03B6\v4\x03" +
		"5\x035\x036\x056\u03BB\n6\x036\x036\x036\x036\x036\x036\x037\x057\u03C4" +
		"\n7\x037\x037\x037\x037\x037\x037\x038\x058\u03CD\n8\x038\x038\x038\x03" +
		"8\x058\u03D3\n8\x038\x038\x058\u03D7\n8\x039\x039\x039\x059\u03DC\n9\x03" +
		":\x03:\x03;\x05;\u03E1\n;\x03;\x03;\x03<\x03<\x05<\u03E7\n<\x03<\x03<" +
		"\x03=\x03=\x05=\u03ED\n=\x03=\x03=\x03>\x03>\x03>\x07>\u03F4\n>\f>\x0E" +
		">\u03F7\v>\x03?\x05?\u03FA\n?\x03?\x03?\x05?\u03FE\n?\x03?\x03?\x03?\x05" +
		"?\u0403\n?\x03@\x03@\x05@\u0407\n@\x03A\x03A\x03A\x05A\u040C\nA\x03A\x03" +
		"A\x03B\x03B\x03B\x03B\x03B\x03B\x05B\u0416\nB\x03C\x03C\x03C\x03C\x07" +
		"C\u041C\nC\fC\x0EC\u041F\vC\x03D\x03D\x03E\x03E\x03E\x07E\u0426\nE\fE" +
		"\x0EE\u0429\vE\x03F\x03F\x03F\x07F\u042E\nF\fF\x0EF\u0431\vF\x03G\x03" +
		"G\x03G\x05G\u0436\nG\x03H\x03H\x03H\x03H\x05H\u043C\nH\x03I\x03I\x03J" +
		"\x03J\x03J\x07J\u0443\nJ\fJ\x0EJ\u0446\vJ\x03K\x03K\x03K\x07K\u044B\n" +
		"K\fK\x0EK\u044E\vK\x03L\x03L\x03L\x03L\x05L\u0454\nL\x03M\x03M\x03N\x03" +
		"N\x03N\x03N\x03O\x03O\x07O\u045E\nO\fO\x0EO\u0461\vO\x03P\x03P\x03P\x05" +
		"P\u0466\nP\x03Q\x03Q\x03Q\x03Q\x03Q\x07Q\u046D\nQ\fQ\x0EQ\u0470\vQ\x03" +
		"Q\x03Q\x05Q\u0474\nQ\x03R\x03R\x03R\x03R\x03S\x03S\x03S\x03S\x03S\x03" +
		"S\x05S\u0480\nS\x03T\x03T\x03T\x05T\u0485\nT\x03U\x03U\x03U\x03U\x03V" +
		"\x03V\x07V\u048D\nV\fV\x0EV\u0490\vV\x03W\x03W\x03W\x03X\x03X\x03X\x03" +
		"X\x03X\x03X\x03X\x03X\x07X\u049D\nX\fX\x0EX\u04A0\vX\x03X\x03X\x03X\x03" +
		"X\x05X\u04A6\nX\x03Y\x03Y\x03Y\x03Y\x03Z\x03Z\x03Z\x03[\x05[\u04B0\n[" +
		"\x03[\x03[\x03\\\x03\\\x05\\\u04B6\n\\\x03\\\x03\\\x03]\x03]\x05]\u04BC" +
		"\n]\x03]\x03]\x03^\x07^\u04C1\n^\f^\x0E^\u04C4\v^\x03_\x03_\x03_\x03_" +
		"\x03_\x03_\x03_\x03_\x03_\x03_\x03_\x03_\x03_\x03_\x03_\x03_\x03_\x03" +
		"_\x03_\x03_\x03_\x03_\x03_\x03_\x05_\u04DE\n_\x03`\x03`\x03`\x03`\x03" +
		"`\x07`\u04E5\n`\f`\x0E`\u04E8\v`\x03`\x03`\x03`\x03a\x03a\x03a\x03a\x03" +
		"b\x03b\x03b\x07b\u04F4\nb\fb\x0Eb\u04F7\vb\x03c\x03c\x06c\u04FB\nc\rc" +
		"\x0Ec\u04FC\x03c\x03c\x03d\x03d\x05d\u0503\nd\x03e\x03e\x03e\x03e\x03" +
		"f\x03f\x03g\x03g\x03g\x03g\x03g\x03g\x07g\u0511\ng\fg\x0Eg\u0514\vg\x03" +
		"g\x05g\u0517\ng\x03h\x03h\x03h\x03h\x03h\x03h\x03h\x03i\x03i\x03i\x03" +
		"j\x03j\x03k\x03k\x03k\x03k\x03k\x03k\x03l\x03l\x03m\x03m\x03m\x03m\x03" +
		"m\x03m\x03m\x03n\x03n\x03o\x03o\x03p\x03p\x03p\x03p\x03p\x03p\x03p\x03" +
		"p\x03q\x03q\x05q\u0542\nq\x03r\x03r\x07r\u0546\nr\fr\x0Er\u0549\vr\x03" +
		"r\x03r\x05r\u054D\nr\x03s\x03s\x03s\x03t\x03t\x03t\x07t\u0555\nt\ft\x0E" +
		"t\u0558\vt\x03u\x03u\x05u\u055C\nu\x03v\x03v\x03v\x03v\x03v\x03v\x03v" +
		"\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03v\x03" +
		"v\x03v\x03v\x03v\x03v\x03v\x03v\x07v\u0579\nv\fv\x0Ev\u057C\vv\x03v\x03" +
		"v\x03v\x03v\x03v\x03v\x03v\x03v\x07v\u0586\nv\fv\x0Ev\u0589\vv\x03v\x03" +
		"v\x03v\x03v\x05v\u058F\nv\x03v\x03v\x03v\x05v\u0594\nv\x03w\x03w\x03w" +
		"\x03w\x03w\x07w\u059B\nw\fw\x0Ew\u059E\vw\x05w\u05A0\nw\x03w\x03w\x03" +
		"x\x03x\x03x\x03x\x07x\u05A8\nx\fx\x0Ex\u05AB\vx\x03x\x03x\x03y\x03y\x03" +
		"z\x03z\x05z\u05B3\nz\x03{\x03{\x03{\x03{\x03{\x03{\x05{\u05BB\n{\x03|" +
		"\x03|\x03|\x05|\u05C0\n|\x03}\x03}\x03}\x03}\x05}\u05C6\n}\x03~\x03~\x03" +
		"~\x07~\u05CB\n~\f~\x0E~\u05CE\v~\x03~\x05~\u05D1\n~\x03~\x03~\x03\x7F" +
		"\x03\x7F\x05\x7F\u05D7\n\x7F\x03\x7F\x03\x7F\x03\x80\x03\x80\x03\x81\x03" +
		"\x81\x03\x81\x05\x81\u05E0\n\x81\x03\x82\x03\x82\x03\x82\x03\x82\x07\x82" +
		"\u05E6\n\x82\f\x82\x0E\x82\u05E9\v\x82\x05\x82\u05EB\n\x82\x03\x82\x03" +
		"\x82\x03\x83\x03\x83\x03\x83\x03\x83\x03\x83\x03\x83\x03\x83\x03\x83\x03" +
		"\x83\x05\x83\u05F8\n\x83\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84" +
		"\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x03\x84\x05\x84\u0607" +
		"\n\x84\x03\x85\x03\x85\x03\x86\x03\x86\x03\x87\x03\x87\x03\x88\x03\x88" +
		"\x03\x89\x03\x89\x03\x8A\x03\x8A\x03\x8B\x03\x8B\x03\x8C\x03\x8C\x03\x8C" +
		"\x03\x8C\x07\x8C\u061B\n\x8C\f\x8C\x0E\x8C\u061E\v\x8C\x03\x8C\x03\x8C" +
		"\x03\x8D\x03\x8D\x03\x8D\x03\x8D\x07\x8D\u0626\n\x8D\f\x8D\x0E\x8D\u0629" +
		"\v\x8D\x03\x8D\x03\x8D\x03\x8E\x03\x8E\x03\x8E\x03\x8E\x07\x8E\u0631\n" +
		"\x8E\f\x8E\x0E\x8E\u0634\v\x8E\x03\x8E\x03\x8E\x03\x8F\x03\x8F\x03\x8F" +
		"\x03\x8F\x07\x8F\u063C\n\x8F\f\x8F\x0E\x8F\u063F\v\x8F\x07\x8F\u0641\n" +
		"\x8F\f\x8F\x0E\x8F\u0644\v\x8F\x03\x8F\x03\x8F\x03\x90\x03\x90\x03\x90" +
		"\x03\x90\x03\x91\x03\x91\x03\x91\x03\x91\x07\x91\u0650\n\x91\f\x91\x0E" +
		"\x91\u0653\v\x91\x07\x91\u0655\n\x91\f\x91\x0E\x91\u0658\v\x91\x03\x91" +
		"\x03\x91\x03\x92\x03\x92\x07\x92\u065E\n\x92\f\x92\x0E\x92\u0661\v\x92" +
		"\x03\x92\x03\x92\x03\x93\x03\x93\x03\x93\x05\x93\u0668\n\x93\x03\x94\x03" +
		"\x94\x03\x94\x03\x94\x03\x95\x03\x95\x03\x95\x03\u02D0\x02\x02\x96\x02" +
		"\x02\x04\x02\x06\x02\b\x02\n\x02\f\x02\x0E\x02\x10\x02\x12\x02\x14\x02" +
		"\x16\x02\x18\x02\x1A\x02\x1C\x02\x1E\x02 \x02\"\x02$\x02&\x02(\x02*\x02" +
		",\x02.\x020\x022\x024\x026\x028\x02:\x02<\x02>\x02@\x02B\x02D\x02F\x02" +
		"H\x02J\x02L\x02N\x02P\x02R\x02T\x02V\x02X\x02Z\x02\\\x02^\x02`\x02b\x02" +
		"d\x02f\x02h\x02j\x02l\x02n\x02p\x02r\x02t\x02v\x02x\x02z\x02|\x02~\x02" +
		"\x80\x02\x82\x02\x84\x02\x86\x02\x88\x02\x8A\x02\x8C\x02\x8E\x02\x90\x02" +
		"\x92\x02\x94\x02\x96\x02\x98\x02\x9A\x02\x9C\x02\x9E\x02\xA0\x02\xA2\x02" +
		"\xA4\x02\xA6\x02\xA8\x02\xAA\x02\xAC\x02\xAE\x02\xB0\x02\xB2\x02\xB4\x02" +
		"\xB6\x02\xB8\x02\xBA\x02\xBC\x02\xBE\x02\xC0\x02\xC2\x02\xC4\x02\xC6\x02" +
		"\xC8\x02\xCA\x02\xCC\x02\xCE\x02\xD0\x02\xD2\x02\xD4\x02\xD6\x02\xD8\x02" +
		"\xDA\x02\xDC\x02\xDE\x02\xE0\x02\xE2\x02\xE4\x02\xE6\x02\xE8\x02\xEA\x02" +
		"\xEC\x02\xEE\x02\xF0\x02\xF2\x02\xF4\x02\xF6\x02\xF8\x02\xFA\x02\xFC\x02" +
		"\xFE\x02\u0100\x02\u0102\x02\u0104\x02\u0106\x02\u0108\x02\u010A\x02\u010C" +
		"\x02\u010E\x02\u0110\x02\u0112\x02\u0114\x02\u0116\x02\u0118\x02\u011A" +
		"\x02\u011C\x02\u011E\x02\u0120\x02\u0122\x02\u0124\x02\u0126\x02\u0128" +
		"\x02\x02\x0F\x04\x02\f\fww\x07\x02\f\x10\x13\x14%+..ww\x03\x02DF\x03\x02" +
		"JL\x04\x02..ww\x03\x02)+\x03\x02%(\x03\x02\x0F\x10\x03\x02\f\x0E\x03\x02" +
		"<=\x03\x02\x11\x12\x04\x02]inq\x03\x02rs\x02\u06D8\x02\u012B\x03\x02\x02" +
		"\x02\x04\u0144\x03\x02\x02\x02\x06\u0148\x03\x02\x02\x02\b\u0155\x03\x02" +
		"\x02\x02\n\u0161\x03\x02\x02\x02\f\u016C\x03\x02\x02\x02\x0E\u0173\x03" +
		"\x02\x02\x02\x10\u0187\x03\x02\x02\x02\x12\u019C\x03\x02\x02\x02\x14\u019E" +
		"\x03\x02\x02\x02\x16\u01A4\x03\x02\x02\x02\x18\u01C1\x03\x02\x02\x02\x1A" +
		"\u01D8\x03\x02\x02\x02\x1C\u01E8\x03\x02\x02\x02\x1E\u01EF\x03\x02\x02" +
		"\x02 \u01F3\x03\x02\x02\x02\"\u0207\x03\x02\x02\x02$\u020A\x03\x02\x02" +
		"\x02&\u0218\x03\x02\x02\x02(\u0224\x03\x02\x02\x02*\u0231\x03\x02\x02" +
		"\x02,\u023C\x03\x02\x02\x02.\u0247\x03\x02\x02\x020\u024A\x03\x02\x02" +
		"\x022\u025A\x03\x02\x02\x024\u0274\x03\x02\x02\x026\u0287\x03\x02\x02" +
		"\x028\u0289\x03\x02\x02\x02:\u02A6\x03\x02\x02\x02<\u02BF\x03\x02\x02" +
		"\x02>\u02D6\x03\x02\x02\x02@\u02E3\x03\x02\x02\x02B\u02ED\x03\x02\x02" +
		"\x02D\u02F0\x03\x02\x02\x02F\u02FE\x03\x02\x02\x02H\u0313\x03\x02\x02" +
		"\x02J\u0315\x03\x02\x02\x02L\u0319\x03\x02\x02\x02N\u0326\x03\x02\x02" +
		"\x02P\u0337\x03\x02\x02\x02R\u0346\x03\x02\x02\x02T\u034F\x03\x02\x02" +
		"\x02V\u035B\x03\x02\x02\x02X\u0367\x03\x02\x02\x02Z\u0374\x03\x02\x02" +
		"\x02\\\u0384\x03\x02\x02\x02^\u038A\x03\x02\x02\x02`\u0392\x03\x02\x02" +
		"\x02b\u03A0\x03\x02\x02\x02d\u03A4\x03\x02\x02\x02f\u03AF\x03\x02\x02" +
		"\x02h\u03B7\x03\x02\x02\x02j\u03BA\x03\x02\x02\x02l\u03C3\x03\x02\x02" +
		"\x02n\u03CC\x03\x02\x02\x02p\u03D8\x03\x02\x02\x02r\u03DD\x03\x02\x02" +
		"\x02t\u03E0\x03\x02\x02\x02v\u03E4\x03\x02\x02\x02x\u03EA\x03\x02\x02" +
		"\x02z\u03F0\x03\x02\x02\x02|\u03F9\x03\x02\x02\x02~\u0406\x03\x02\x02" +
		"\x02\x80\u040B\x03\x02\x02\x02\x82\u040F\x03\x02\x02\x02\x84\u0417\x03" +
		"\x02\x02\x02\x86\u0420\x03\x02\x02\x02\x88\u0422\x03\x02\x02\x02\x8A\u042A" +
		"\x03\x02\x02\x02\x8C\u0432\x03\x02\x02\x02\x8E\u0437\x03\x02\x02\x02\x90" +
		"\u043D\x03\x02\x02\x02\x92\u043F\x03\x02\x02\x02\x94\u0447\x03\x02\x02" +
		"\x02\x96\u0453\x03\x02\x02\x02\x98\u0455\x03\x02\x02\x02\x9A\u0457\x03" +
		"\x02\x02\x02\x9C\u045B\x03\x02\x02\x02\x9E\u0462\x03\x02\x02\x02\xA0\u0467" +
		"\x03\x02\x02\x02\xA2\u0475\x03\x02\x02\x02\xA4\u047F\x03\x02\x02\x02\xA6" +
		"\u0484\x03\x02\x02\x02\xA8\u0486\x03\x02\x02\x02\xAA\u048A\x03\x02\x02" +
		"\x02\xAC\u0491\x03\x02\x02\x02\xAE\u04A5\x03\x02\x02\x02\xB0\u04A7\x03" +
		"\x02\x02\x02\xB2\u04AB\x03\x02\x02\x02\xB4\u04AF\x03\x02\x02\x02\xB6\u04B3" +
		"\x03\x02\x02\x02\xB8\u04B9\x03\x02\x02\x02\xBA\u04C2\x03\x02\x02\x02\xBC" +
		"\u04DD\x03\x02\x02\x02\xBE\u04DF\x03\x02\x02\x02\xC0\u04EC\x03\x02\x02" +
		"\x02\xC2\u04F0\x03\x02\x02\x02\xC4\u04F8\x03\x02\x02\x02\xC6\u0502\x03" +
		"\x02\x02\x02\xC8\u0504\x03\x02\x02\x02\xCA\u0508\x03\x02\x02\x02\xCC\u050A" +
		"\x03\x02\x02\x02\xCE\u0518\x03\x02\x02\x02\xD0\u051F\x03\x02\x02\x02\xD2" +
		"\u0522\x03\x02\x02\x02\xD4\u0524\x03\x02\x02\x02\xD6\u052A\x03\x02\x02" +
		"\x02\xD8\u052C\x03\x02\x02\x02\xDA\u0533\x03\x02\x02\x02\xDC\u0535\x03" +
		"\x02\x02\x02\xDE\u0537\x03\x02\x02\x02\xE0\u053F\x03\x02\x02\x02\xE2\u054C" +
		"\x03\x02\x02\x02\xE4\u054E\x03\x02\x02\x02\xE6\u0551\x03\x02\x02\x02\xE8" +
		"\u0559\x03\x02\x02\x02\xEA\u0593\x03\x02\x02\x02\xEC\u0595\x03\x02\x02" +
		"\x02\xEE\u05A3\x03\x02\x02\x02\xF0\u05AE\x03\x02\x02\x02\xF2\u05B2\x03" +
		"\x02\x02\x02\xF4\u05BA\x03\x02\x02\x02\xF6\u05BC\x03\x02\x02\x02\xF8\u05C5" +
		"\x03\x02\x02\x02\xFA\u05D0\x03\x02\x02\x02\xFC\u05D4\x03\x02\x02\x02\xFE" +
		"\u05DA\x03\x02\x02\x02\u0100\u05DC\x03\x02\x02\x02\u0102\u05E1\x03\x02" +
		"\x02\x02\u0104\u05F7\x03\x02\x02\x02\u0106\u0606\x03\x02\x02\x02\u0108" +
		"\u0608\x03\x02\x02\x02\u010A\u060A\x03\x02\x02\x02\u010C\u060C\x03\x02" +
		"\x02\x02\u010E\u060E\x03\x02\x02\x02\u0110\u0610\x03\x02\x02\x02\u0112" +
		"\u0612\x03\x02\x02\x02\u0114\u0614\x03\x02\x02\x02\u0116\u0616\x03\x02" +
		"\x02\x02\u0118\u0621\x03\x02\x02\x02\u011A\u062C\x03\x02\x02\x02\u011C" +
		"\u0637\x03\x02\x02\x02\u011E\u0647\x03\x02\x02\x02\u0120\u064B\x03\x02" +
		"\x02\x02\u0122\u065B\x03\x02\x02\x02\u0124\u0667\x03\x02\x02\x02\u0126" +
		"\u0669\x03\x02\x02\x02\u0128\u066D\x03\x02\x02\x02\u012A\u012C\x05\x06" +
		"\x04\x02\u012B\u012A\x03\x02\x02\x02\u012B\u012C\x03\x02\x02\x02\u012C" +
		"\u0130\x03\x02\x02\x02\u012D\u012F\x05\b\x05\x02\u012E\u012D\x03\x02\x02" +
		"\x02\u012F\u0132\x03\x02\x02\x02\u0130\u012E\x03\x02\x02\x02\u0130\u0131" +
		"\x03\x02\x02\x02\u0131\u0136\x03\x02\x02\x02\u0132\u0130\x03\x02\x02\x02" +
		"\u0133\u0135\x05\f\x07\x02\u0134\u0133\x03\x02\x02\x02\u0135\u0138\x03" +
		"\x02\x02\x02\u0136\u0134\x03\x02\x02\x02\u0136\u0137\x03\x02\x02\x02\u0137" +
		"\u013C\x03\x02\x02\x02\u0138\u0136\x03\x02\x02\x02\u0139\u013B\x05\x0E" +
		"\b\x02\u013A\u0139\x03\x02\x02\x02\u013B\u013E\x03\x02\x02\x02\u013C\u013A" +
		"\x03\x02\x02\x02\u013C\u013D\x03\x02\x02\x02\u013D\u013F\x03\x02\x02\x02" +
		"\u013E\u013C\x03\x02\x02\x02\u013F\u0140\x07\x02\x02\x03\u0140\x03\x03" +
		"\x02\x02\x02\u0141\u0143\x05\xBC_\x02\u0142\u0141\x03\x02\x02\x02\u0143" +
		"\u0146\x03\x02\x02\x02\u0144\u0142\x03\x02\x02\x02\u0144\u0145\x03\x02" +
		"\x02\x02\u0145\x05\x03\x02\x02\x02\u0146\u0144\x03\x02\x02\x02\u0147\u0149" +
		"\x05";
	private static readonly _serializedATNSegment1: string =
		"\u0128\x95\x02\u0148\u0147\x03\x02\x02\x02\u0148\u0149\x03\x02\x02\x02" +
		"\u0149\u014A\x03\x02\x02\x02\u014A\u014B\x07[\x02\x02\u014B\u0150\x07" +
		"w\x02\x02\u014C\u014D\x07\x04\x02\x02\u014D\u014F\x07w\x02\x02\u014E\u014C" +
		"\x03\x02\x02\x02\u014F\u0152\x03\x02\x02\x02\u0150\u014E\x03\x02\x02\x02" +
		"\u0150\u0151\x03\x02\x02\x02\u0151\u0153\x03\x02\x02\x02\u0152\u0150\x03" +
		"\x02\x02\x02\u0153\u0154\x07\x17\x02\x02\u0154\x07\x03\x02\x02\x02\u0155" +
		"\u0156\x07L\x02\x02\u0156\u0159\x05\n\x06\x02\u0157\u0158\x079\x02\x02" +
		"\u0158\u015A\x07w\x02\x02\u0159\u0157\x03\x02\x02\x02\u0159\u015A\x03" +
		"\x02\x02\x02\u015A\u015D\x03\x02\x02\x02\u015B\u015C\x07:\x02\x02\u015C" +
		"\u015E\x07w\x02\x02\u015D\u015B\x03\x02\x02\x02\u015D\u015E\x03\x02\x02" +
		"\x02\u015E\u015F\x03\x02\x02\x02\u015F\u0160\x07\x17\x02\x02\u0160\t\x03" +
		"\x02\x02\x02\u0161\u0166\x07w\x02\x02\u0162\u0163\x07\x04\x02\x02\u0163" +
		"\u0165\x07w\x02\x02\u0164\u0162\x03\x02\x02\x02\u0165\u0168\x03\x02\x02" +
		"\x02\u0166\u0164\x03\x02\x02\x02\u0166\u0167\x03\x02\x02\x02\u0167\u0169" +
		"\x03\x02\x02\x02\u0168\u0166\x03\x02\x02\x02\u0169\u016A\x07\x16\x02\x02" +
		"\u016A\u016B\t\x02\x02\x02\u016B\v\x03\x02\x02\x02\u016C\u016D\x07U\x02" +
		"\x02\u016D\u016E\x07w\x02\x02\u016E\u016F\x079\x02\x02\u016F\u0170\x05" +
		"\xE8u\x02\u0170\u0171\x07\x17\x02\x02\u0171\r\x03\x02\x02\x02\u0172\u0174" +
		"\x05\u0128\x95\x02\u0173\u0172\x03\x02\x02\x02\u0173\u0174\x03\x02\x02" +
		"\x02\u0174\u0175\x03\x02\x02\x02\u0175\u0176\x05\x10\t\x02\u0176\x0F\x03" +
		"\x02\x02\x02\u0177\u0188\x05\x16\f\x02\u0178\u0188\x058\x1D\x02\u0179" +
		"\u0188\x05\x18\r\x02\u017A\u0188\x05X-\x02\u017B\u0188\x05V,\x02\u017C" +
		"\u0188\x05d3\x02\u017D\u0188\x05T+\x02\u017E\u0188\x05\x1A\x0E\x02\u017F" +
		"\u0188\x05\x1C\x0F\x02\u0180\u0188\x05:\x1E\x02\u0181\u0188\x05<\x1F\x02" +
		"\u0182\u0188\x05Z.\x02\u0183\u0188\x05N(\x02\u0184\u0188\x05\x12\n\x02" +
		"\u0185\u0188\x05\\/\x02\u0186\u0188\x05\u0100\x81\x02\u0187\u0177\x03" +
		"\x02\x02\x02\u0187\u0178\x03\x02\x02\x02\u0187\u0179\x03\x02\x02\x02\u0187" +
		"\u017A\x03\x02\x02\x02\u0187\u017B\x03\x02\x02\x02\u0187\u017C\x03\x02" +
		"\x02\x02\u0187\u017D\x03\x02\x02\x02\u0187\u017E\x03\x02\x02\x02\u0187" +
		"\u017F\x03\x02\x02\x02\u0187\u0180\x03\x02\x02\x02\u0187\u0181\x03\x02" +
		"\x02\x02\u0187\u0182\x03\x02\x02\x02\u0187\u0183\x03\x02\x02\x02\u0187" +
		"\u0184\x03\x02\x02\x02\u0187\u0185\x03\x02\x02\x02\u0187\u0186\x03\x02" +
		"\x02\x02\u0188\x11\x03\x02\x02\x02\u0189\u018B\x05r:\x02\u018A\u0189\x03" +
		"\x02\x02\x02\u018A\u018B\x03\x02\x02\x02\u018B\u018C\x03\x02\x02\x02\u018C" +
		"\u018D\x05\xE8u\x02\u018D\u0192\x05\x14\v\x02\u018E\u018F\x07\x05\x02" +
		"\x02\u018F\u0191\x05\x14\v\x02\u0190\u018E\x03\x02\x02\x02\u0191\u0194" +
		"\x03\x02\x02\x02\u0192\u0190\x03\x02\x02\x02\u0192\u0193\x03\x02\x02\x02" +
		"\u0193\u019D\x03\x02\x02\x02\u0194\u0192\x03\x02\x02\x02\u0195\u0197\x05" +
		"r:\x02\u0196\u0195\x03\x02\x02\x02\u0196\u0197\x03\x02\x02\x02\u0197\u0198" +
		"\x03\x02\x02\x02\u0198\u0199\x07X\x02\x02\u0199\u019A\x07w\x02\x02\u019A" +
		"\u019B\x07\x18\x02\x02\u019B\u019D\x05\xF4{\x02\u019C\u018A\x03\x02\x02" +
		"\x02\u019C\u0196\x03\x02\x02\x02\u019D\x13\x03\x02\x02\x02\u019E\u01A1" +
		"\x07w\x02\x02\u019F\u01A0\x07\x18\x02\x02\u01A0\u01A2\x05\xF4{\x02\u01A1" +
		"\u019F\x03\x02\x02\x02\u01A1\u01A2\x03\x02\x02\x02\u01A2\x15\x03\x02\x02" +
		"\x02\u01A3\u01A5\x07?\x02\x02\u01A4\u01A3\x03\x02\x02\x02\u01A4\u01A5" +
		"\x03\x02\x02\x02\u01A5\u01A7\x03\x02\x02\x02\u01A6\u01A8\x07C\x02\x02" +
		"\u01A7\u01A6\x03\x02\x02\x02\u01A7\u01A8\x03\x02\x02\x02\u01A8\u01AA\x03" +
		"\x02\x02\x02\u01A9\u01AB\x07H\x02\x02\u01AA\u01A9\x03\x02\x02\x02\u01AA" +
		"\u01AB\x03\x02\x02\x02\u01AB\u01AC\x03\x02\x02\x02\u01AC\u01AD\x07N\x02" +
		"\x02\u01AD\u01AF\x05\xFE\x80\x02\u01AE\u01B0\x05v<\x02\u01AF\u01AE\x03" +
		"\x02\x02\x02\u01AF\u01B0\x03\x02\x02\x02\u01B0\u01BA\x03\x02\x02\x02\u01B1" +
		"\u01B2\x07\x16\x02\x02\u01B2\u01B7\x05\xFA~\x02\u01B3\u01B4\x07\x05\x02" +
		"\x02\u01B4\u01B6\x05\xFA~\x02\u01B5\u01B3\x03\x02\x02\x02\u01B6\u01B9" +
		"\x03\x02\x02\x02\u01B7\u01B5\x03\x02\x02\x02\u01B7\u01B8\x03\x02\x02\x02" +
		"\u01B8\u01BB\x03\x02\x02\x02\u01B9\u01B7\x03\x02\x02\x02\u01BA\u01B1\x03" +
		"\x02\x02\x02\u01BA\u01BB\x03\x02\x02\x02\u01BB\u01BE\x03\x02\x02\x02\u01BC" +
		"\u01BF\x05 \x11\x02\u01BD\u01BF\x07\x17\x02\x02\u01BE\u01BC\x03\x02\x02" +
		"\x02\u01BE\u01BD\x03\x02\x02\x02\u01BF\x17\x03\x02\x02\x02\u01C0\u01C2" +
		"\x07C\x02\x02\u01C1\u01C0\x03\x02\x02\x02\u01C1\u01C2\x03\x02\x02\x02" +
		"\u01C2\u01C3\x03\x02\x02\x02\u01C3\u01C4\x07O\x02\x02\u01C4\u01C5\x07" +
		"N\x02\x02\u01C5\u01C7\x05\xFE\x80\x02\u01C6\u01C8\x05v<\x02\u01C7\u01C6" +
		"\x03\x02\x02\x02\u01C7\u01C8\x03\x02\x02\x02\u01C8\u01D2\x03\x02\x02\x02" +
		"\u01C9\u01CA\x07\x16\x02\x02\u01CA\u01CF\x05\xFA~\x02\u01CB\u01CC\x07" +
		"\x05\x02\x02\u01CC\u01CE\x05\xFA~\x02\u01CD\u01CB\x03\x02\x02\x02\u01CE" +
		"\u01D1\x03\x02\x02\x02\u01CF\u01CD\x03\x02\x02\x02\u01CF\u01D0\x03\x02" +
		"\x02\x02\u01D0\u01D3\x03\x02\x02\x02\u01D1\u01CF\x03\x02\x02\x02\u01D2" +
		"\u01C9\x03\x02\x02\x02\u01D2\u01D3\x03\x02\x02\x02\u01D3\u01D6\x03\x02" +
		"\x02\x02\u01D4\u01D7\x05 \x11\x02\u01D5\u01D7\x07\x17\x02\x02\u01D6\u01D4" +
		"\x03\x02\x02\x02\u01D6\u01D5\x03\x02\x02\x02\u01D7\x19\x03\x02\x02\x02" +
		"\u01D8\u01D9\x07J\x02\x02\u01D9\u01DA\x07N\x02\x02\u01DA\u01E4\x05\xFE" +
		"\x80\x02\u01DB\u01DC\x07\x16\x02\x02\u01DC\u01E1\x05\xFA~\x02\u01DD\u01DE" +
		"\x07\x05\x02\x02\u01DE\u01E0\x05\xFA~\x02\u01DF\u01DD\x03\x02\x02\x02" +
		"\u01E0\u01E3\x03\x02\x02\x02\u01E1\u01DF\x03\x02\x02\x02\u01E1\u01E2\x03" +
		"\x02\x02\x02\u01E2\u01E5\x03\x02\x02\x02\u01E3\u01E1\x03\x02\x02\x02\u01E4" +
		"\u01DB\x03\x02\x02\x02\u01E4\u01E5\x03\x02\x02\x02\u01E5\u01E6\x03\x02" +
		"\x02\x02\u01E6\u01E7\x05 \x11\x02\u01E7\x1B\x03\x02\x02\x02\u01E8\u01E9" +
		"\x07N\x02\x02\u01E9\u01EA\x05\xFE\x80\x02\u01EA\u01EB\x07\x18\x02\x02" +
		"\u01EB\u01EC\x05f4\x02\u01EC\u01ED\x07\x17\x02\x02\u01ED\x1D\x03\x02\x02" +
		"\x02\u01EE\u01F0\x05h5\x02\u01EF\u01EE\x03\x02\x02\x02\u01EF\u01F0\x03" +
		"\x02\x02\x02\u01F0\u01F1\x03\x02\x02\x02\u01F1\u01F2\x05\"\x12\x02\u01F2" +
		"\x1F\x03\x02\x02\x02\u01F3\u01FA\x07\n\x02\x02\u01F4\u01F6\x05\u0128\x95" +
		"\x02\u01F5\u01F4\x03\x02\x02\x02\u01F5\u01F6\x03\x02\x02\x02\u01F6\u01F7" +
		"\x03\x02\x02\x02\u01F7\u01F9\x05\x1E\x10\x02\u01F8\u01F5\x03\x02\x02\x02" +
		"\u01F9\u01FC\x03\x02\x02\x02\u01FA\u01F8\x03\x02\x02\x02\u01FA\u01FB\x03" +
		"\x02\x02\x02\u01FB\u01FD\x03\x02\x02\x02\u01FC\u01FA\x03\x02\x02\x02\u01FD" +
		"\u01FE\x07\v\x02\x02\u01FE!\x03\x02\x02\x02\u01FF\u0208\x05$\x13\x02\u0200" +
		"\u0208\x050\x19\x02\u0201\u0208\x05j6\x02\u0202\u0208\x05(\x15\x02\u0203" +
		"\u0208\x05&\x14\x02\u0204\u0208\x05\u0100\x81\x02\u0205\u0208\x05*\x16" +
		"\x02\u0206\u0208\x05,\x17\x02\u0207\u01FF\x03\x02\x02\x02\u0207\u0200" +
		"\x03\x02\x02\x02\u0207\u0201\x03\x02\x02\x02\u0207\u0202\x03\x02\x02\x02" +
		"\u0207\u0203\x03\x02\x02\x02\u0207\u0204\x03\x02\x02\x02\u0207\u0205\x03" +
		"\x02\x02\x02\u0207\u0206\x03\x02\x02\x02\u0208#\x03\x02\x02\x02\u0209" +
		"\u020B\x07G\x02\x02\u020A\u0209\x03\x02\x02\x02\u020A\u020B\x03\x02\x02" +
		"\x02\u020B\u020C\x03\x02\x02\x02\u020C\u020D\x07R\x02\x02\u020D\u020E" +
		"\x07w\x02\x02\u020E\u0211\x05t;\x02\u020F\u0210\x07\x1E\x02\x02\u0210" +
		"\u0212\x05\xF2z\x02\u0211\u020F\x03\x02\x02\x02\u0211\u0212\x03\x02\x02" +
		"\x02\u0212\u0213\x03\x02\x02\x02\u0213\u0214\x07\n\x02\x02\u0214\u0215" +
		"\x05\xBA^\x02\u0215\u0216\x07\v\x02\x02\u0216%\x03\x02\x02\x02\u0217\u0219" +
		"\x07G\x02\x02\u0218\u0217\x03\x02\x02\x02\u0218\u0219\x03\x02\x02\x02" +
		"\u0219\u021A\x03\x02\x02\x02\u021A\u021B\x07R\x02\x02\u021B\u021C\x07" +
		"w\x02\x02\u021C\u021F\x05t;\x02\u021D\u021E\x07\x1E\x02\x02\u021E\u0220" +
		"\x05\xF2z\x02\u021F\u021D\x03\x02\x02\x02\u021F\u0220\x03\x02\x02\x02" +
		"\u0220\u0221\x03\x02\x02\x02\u0221\u0222\x07\x17\x02\x02\u0222\'\x03\x02" +
		"\x02\x02\u0223\u0225\x07G\x02\x02\u0224\u0223\x03\x02\x02\x02\u0224\u0225" +
		"\x03\x02\x02\x02\u0225\u0226\x03\x02\x02\x02\u0226\u0227\x07R\x02\x02" +
		"\u0227\u0228\x07w\x02\x02\u0228\u022B\x05t;\x02\u0229\u022A\x07\x1E\x02" +
		"\x02\u022A\u022C\x05\xF2z\x02\u022B\u0229\x03\x02\x02\x02\u022B\u022C" +
		"\x03\x02\x02\x02\u022C\u022D\x03\x02\x02\x02\u022D\u022E\x07\x18\x02\x02" +
		"\u022E\u022F\x05f4\x02\u022F\u0230\x07\x17\x02\x02\u0230)\x03\x02\x02" +
		"\x02\u0231\u0232\x07T\x02\x02\u0232\u0233\x05.\x18\x02\u0233\u0236\x05" +
		"t;\x02\u0234\u0235\x07\x1E\x02\x02\u0235\u0237\x05\xF2z\x02\u0236\u0234" +
		"\x03\x02\x02\x02\u0236\u0237\x03\x02\x02\x02\u0237\u0238\x03\x02\x02\x02" +
		"\u0238\u0239\x07\n\x02\x02\u0239\u023A\x05\xBA^\x02\u023A\u023B\x07\v" +
		"\x02\x02\u023B+\x03\x02\x02\x02\u023C\u023D\x07T\x02\x02\u023D\u023E\x05" +
		".\x18\x02\u023E\u0241\x05t;\x02\u023F\u0240\x07\x1E\x02\x02\u0240\u0242" +
		"\x05\xF2z\x02\u0241\u023F\x03\x02\x02\x02\u0241\u0242\x03\x02\x02\x02" +
		"\u0242\u0243\x03\x02\x02\x02\u0243\u0244\x07\x18\x02\x02\u0244\u0245\x05" +
		"f4\x02\u0245\u0246\x07\x17\x02\x02\u0246-\x03\x02\x02\x02\u0247\u0248" +
		"\t\x03\x02\x02\u0248/\x03\x02\x02\x02\u0249\u024B\x05h5\x02\u024A\u0249" +
		"\x03\x02\x02\x02\u024A\u024B\x03\x02\x02\x02\u024B\u024C\x03\x02\x02\x02" +
		"\u024C\u024F\x07w\x02\x02\u024D\u024E\x079\x02\x02\u024E\u0250\x05\xE8" +
		"u\x02\u024F\u024D\x03\x02\x02\x02\u024F\u0250\x03\x02\x02\x02\u0250\u0253" +
		"\x03\x02\x02\x02\u0251\u0252\x07\x18\x02\x02\u0252\u0254\x05~@\x02\u0253" +
		"\u0251\x03\x02\x02\x02\u0253\u0254\x03\x02\x02\x02\u0254\u0256\x03\x02" +
		"\x02\x02\u0255\u0257\x052\x1A\x02\u0256\u0255\x03\x02\x02\x02\u0256\u0257" +
		"\x03\x02\x02\x02\u0257\u0258\x03\x02\x02\x02\u0258\u0259\x07\x17\x02\x02" +
		"\u02591\x03\x02\x02\x02\u025A\u025C\x07\n\x02\x02\u025B\u025D\x054\x1B" +
		"\x02\u025C\u025B\x03\x02\x02\x02\u025C\u025D\x03\x02\x02\x02\u025D\u025F" +
		"\x03\x02\x02\x02\u025E\u0260\x056\x1C\x02\u025F\u025E\x03\x02\x02\x02" +
		"\u025F\u0260\x03\x02\x02\x02\u0260\u0261\x03\x02\x02\x02\u0261\u0262\x07" +
		"\v\x02\x02\u02623\x03\x02\x02\x02\u0263\u0264\x07Y\x02\x02\u0264\u0265" +
		"\x07\n\x02\x02\u0265\u0266\x05\xBA^\x02\u0266\u0267\x07\v\x02\x02\u0267" +
		"\u0275\x03\x02\x02\x02\u0268\u0269\x07Y\x02\x02\u0269\u026A\x07\x18\x02" +
		"\x02\u026A\u026B\x05f4\x02\u026B\u026C\x07\x17\x02\x02\u026C\u0275\x03" +
		"\x02\x02\x02\u026D\u026E\x07Y\x02\x02\u026E\u026F\x07\x18\x02\x02\u026F" +
		"\u0270\x05~@\x02\u0270\u0271\x07\x17\x02\x02\u0271\u0275\x03\x02\x02\x02" +
		"\u0272\u0273\x07Y\x02\x02\u0273\u0275\x07\x17\x02\x02\u0274\u0263\x03" +
		"\x02\x02\x02\u0274\u0268\x03\x02\x02\x02\u0274\u026D\x03\x02\x02\x02\u0274" +
		"\u0272\x03\x02\x02\x02\u02755\x03\x02\x02\x02\u0276\u0277\x07Z\x02\x02" +
		"\u0277\u0278\x07\n\x02\x02\u0278\u0279\x05\xBA^\x02\u0279\u027A\x07\v" +
		"\x02\x02\u027A\u0288\x03\x02\x02\x02\u027B\u027C\x07Z\x02\x02\u027C\u027D" +
		"\x07\x18\x02\x02\u027D\u027E\x05f4\x02\u027E\u027F\x07\x17\x02\x02\u027F" +
		"\u0288\x03\x02\x02\x02\u0280\u0281\x07Z\x02\x02\u0281\u0282\x07\x18\x02" +
		"\x02\u0282\u0283\x05~@\x02\u0283\u0284\x07\x17\x02\x02\u0284\u0288\x03" +
		"\x02\x02\x02\u0285\u0286\x07Z\x02\x02\u0286\u0288\x07\x17\x02\x02\u0287" +
		"\u0276\x03\x02\x02\x02\u0287\u027B\x03\x02\x02\x02\u0287\u0280\x03\x02" +
		"\x02\x02\u0287\u0285\x03\x02\x02\x02\u02887\x03\x02\x02\x02\u0289\u028B" +
		"\x07I\x02\x02\u028A\u028C\x07?\x02\x02\u028B\u028A\x03\x02\x02\x02\u028B" +
		"\u028C\x03\x02\x02\x02\u028C\u028E\x03\x02\x02\x02\u028D\u028F\x07C\x02" +
		"\x02\u028E\u028D\x03\x02\x02\x02\u028E\u028F\x03\x02\x02\x02\u028F\u0291" +
		"\x03\x02\x02\x02\u0290\u0292\x07H\x02\x02\u0291\u0290\x03\x02\x02\x02" +
		"\u0291\u0292\x03\x02\x02\x02\u0292\u0293\x03\x02\x02\x02\u0293\u0294\x07" +
		"N\x02\x02\u0294\u0295\x05\xFE\x80\x02\u0295\u029F\x05\xB6\\\x02\u0296" +
		"\u0297\x07\x16\x02\x02\u0297\u029C\x05\xFA~\x02\u0298\u0299\x07\x05\x02" +
		"\x02\u0299\u029B\x05\xFA~\x02\u029A\u0298\x03\x02\x02\x02\u029B\u029E" +
		"\x03\x02\x02\x02\u029C\u029A\x03\x02\x02\x02\u029C\u029D\x03\x02\x02\x02" +
		"\u029D\u02A0\x03\x02\x02\x02\u029E\u029C\x03\x02\x02\x02\u029F\u0296\x03" +
		"\x02\x02\x02\u029F\u02A0\x03\x02\x02\x02\u02A0\u02A3\x03\x02\x02\x02\u02A1" +
		"\u02A4\x05 \x11\x02\u02A2\u02A4\x07\x17\x02\x02\u02A3\u02A1\x03\x02\x02" +
		"\x02\u02A3\u02A2\x03\x02\x02\x02\u02A49\x03\x02\x02\x02\u02A5\u02A7\x07" +
		"C\x02\x02\u02A6\u02A5\x03\x02\x02\x02\u02A6\u02A7\x03\x02\x02\x02\u02A7" +
		"\u02A8\x03\x02\x02\x02\u02A8\u02A9\x07Q\x02\x02\u02A9\u02AB\x05\xFE\x80" +
		"\x02\u02AA\u02AC\x05v<\x02\u02AB\u02AA\x03\x02\x02\x02\u02AB\u02AC\x03" +
		"\x02\x02\x02\u02AC\u02B8\x03\x02\x02\x02\u02AD\u02AE\x07\x16\x02\x02\u02AE" +
		"\u02B3\x05\xFA~\x02\u02AF\u02B0\x07\x05\x02\x02\u02B0\u02B2\x05\xFA~\x02" +
		"\u02B1\u02AF\x03\x02\x02\x02\u02B2\u02B5\x03\x02\x02\x02\u02B3\u02B1\x03" +
		"\x02\x02\x02\u02B3\u02B4\x03\x02\x02\x02\u02B4\u02B9\x03\x02\x02\x02\u02B5" +
		"\u02B3\x03\x02\x02\x02\u02B6\u02B7\x079\x02\x02\u02B7\u02B9\x05\xE8u\x02" +
		"\u02B8\u02AD\x03\x02\x02\x02\u02B8\u02B6\x03\x02\x02\x02\u02B8\u02B9\x03" +
		"\x02\x02\x02\u02B9\u02BC\x03\x02\x02\x02\u02BA\u02BD\x05> \x02\u02BB\u02BD" +
		"\x07\x17\x02\x02\u02BC\u02BA\x03\x02\x02\x02\u02BC\u02BB\x03\x02\x02\x02" +
		"\u02BD;\x03\x02\x02\x02\u02BE\u02C0\x07C\x02\x02\u02BF\u02BE\x03\x02\x02" +
		"\x02\u02BF\u02C0\x03\x02\x02\x02\u02C0\u02C1\x03\x02\x02\x02\u02C1\u02C2" +
		"\x07O\x02\x02\u02C2\u02C3\x07Q\x02\x02\u02C3\u02C5\x05\xFE\x80\x02\u02C4" +
		"\u02C6\x05v<\x02\u02C5\u02C4\x03\x02\x02\x02\u02C5\u02C6\x03\x02\x02\x02" +
		"\u02C6\u02D0\x03\x02\x02\x02\u02C7\u02C8\x07\x16\x02\x02\u02C8\u02CD\x05" +
		"\xFA~\x02\u02C9\u02CA\x07\x05\x02\x02\u02CA\u02CC\x05\xFA~\x02\u02CB\u02C9" +
		"\x03\x02\x02\x02\u02CC\u02CF\x03\x02\x02\x02\u02CD\u02CB\x03\x02\x02\x02" +
		"\u02CD\u02CE\x03\x02\x02\x02\u02CE\u02D1\x03\x02\x02\x02\u02CF\u02CD\x03" +
		"\x02\x02\x02\u02D0\u02D1\x03\x02\x02\x02\u02D0\u02C7\x03\x02\x02\x02\u02D1" +
		"\u02D4\x03\x02\x02\x02\u02D2\u02D5\x05> \x02\u02D3\u02D5\x07\x17\x02\x02" +
		"\u02D4\u02D2\x03\x02\x02\x02\u02D4\u02D3\x03\x02\x02\x02\u02D5=\x03\x02" +
		"\x02\x02\u02D6\u02DD\x07\n\x02\x02\u02D7\u02D9\x05\u0128\x95\x02\u02D8" +
		"\u02D7\x03\x02\x02\x02\u02D8\u02D9\x03\x02\x02\x02\u02D9\u02DA\x03\x02" +
		"\x02\x02\u02DA\u02DC\x05@!\x02\u02DB\u02D8\x03\x02\x02\x02\u02DC\u02DF" +
		"\x03\x02\x02\x02\u02DD\u02DB\x03\x02\x02\x02\u02DD\u02DE\x03\x02\x02\x02" +
		"\u02DE\u02E0\x03\x02\x02\x02\u02DF\u02DD\x03\x02\x02\x02\u02E0\u02E1\x07" +
		"\v\x02\x02\u02E1?\x03\x02\x02\x02\u02E2\u02E4\x05h5\x02\u02E3\u02E2\x03" +
		"\x02\x02\x02\u02E3\u02E4\x03\x02\x02\x02\u02E4\u02E5\x03\x02\x02\x02\u02E5" +
		"\u02E6\x05B\"\x02\u02E6A\x03\x02\x02\x02\u02E7\u02EE\x05D#\x02\u02E8\u02EE" +
		"\x05F$\x02\u02E9\u02EE\x05l7\x02\u02EA\u02EE\x05*\x16\x02\u02EB\u02EE" +
		"\x05,\x17\x02\u02EC\u02EE\x05\u0100\x81\x02\u02ED\u02E7\x03\x02\x02\x02" +
		"\u02ED\u02E8\x03\x02\x02\x02\u02ED\u02E9\x03\x02\x02\x02\u02ED\u02EA\x03" +
		"\x02\x02\x02\u02ED\u02EB\x03\x02\x02\x02\u02ED\u02EC\x03\x02\x02\x02\u02EE" +
		"C\x03\x02\x02\x02\u02EF\u02F1\x07G\x02\x02\u02F0\u02EF\x03\x02\x02\x02" +
		"\u02F0\u02F1\x03\x02\x02\x02\u02F1\u02F2\x03\x02\x02\x02\u02F2\u02F3\x07" +
		"R\x02\x02\u02F3\u02F4\x07w\x02\x02\u02F4\u02F7\x05t;\x02\u02F5\u02F6\x07" +
		"\x1E\x02\x02\u02F6\u02F8\x05\xF2z\x02\u02F7\u02F5\x03\x02\x02\x02\u02F7" +
		"\u02F8\x03\x02\x02\x02\u02F8\u02F9\x03\x02\x02\x02\u02F9\u02FA\x07\n\x02" +
		"\x02\u02FA\u02FB\x05\xBA^\x02\u02FB\u02FC\x07\v\x02\x02\u02FCE\x03\x02" +
		"\x02\x02\u02FD\u02FF\x05h5\x02\u02FE\u02FD\x03\x02\x02\x02\u02FE\u02FF" +
		"\x03\x02\x02\x02\u02FF\u0301\x03\x02\x02\x02\u0300\u0302\x07J\x02\x02" +
		"\u0301\u0300\x03\x02\x02\x02\u0301\u0302\x03\x02\x02\x02\u0302\u0303\x03" +
		"\x02\x02\x02\u0303\u0306\x07w\x02\x02\u0304\u0305\x079\x02\x02\u0305\u0307" +
		"\x05H%\x02\u0306\u0304\x03\x02\x02\x02\u0306\u0307\x03\x02\x02\x02\u0307" +
		"\u030A\x03\x02\x02\x02\u0308\u0309\x07\x18\x02\x02\u0309\u030B\x05~@\x02" +
		"\u030A\u0308\x03\x02\x02\x02\u030A\u030B\x03\x02\x02\x02\u030B\u030D\x03" +
		"\x02\x02\x02\u030C\u030E\x052\x1A\x02\u030D\u030C\x03\x02\x02\x02\u030D" +
		"\u030E\x03\x02\x02\x02\u030E\u030F\x03\x02\x02\x02\u030F\u0310\x07\x17" +
		"\x02\x02\u0310G\x03\x02\x02\x02\u0311\u0314\x05J&\x02\u0312\u0314\x05" +
		"L\'\x02\u0313\u0311\x03\x02\x02\x02\u0313\u0312\x03\x02\x02\x02\u0314" +
		"I\x03\x02\x02\x02\u0315\u0317\x05\xE8u\x02\u0316\u0318\x07$\x02\x02\u0317" +
		"\u0316\x03\x02\x02\x02\u0317\u0318\x03\x02\x02\x02\u0318K\x03\x02\x02" +
		"\x02\u0319\u031A\x07\x06\x02\x02\u031A\u031F\x05\xE8u\x02\u031B\u031C" +
		"\x07.\x02\x02\u031C\u031E\x05\xE8u\x02\u031D\u031B\x03\x02\x02\x02\u031E" +
		"\u0321\x03\x02\x02\x02\u031F\u031D\x03\x02\x02\x02\u031F\u0320\x03\x02" +
		"\x02\x02\u0320\u0322\x03\x02\x02\x02\u0321\u031F\x03\x02\x02\x02\u0322" +
		"\u0324\x07\x07\x02\x02\u0323\u0325\x07$\x02\x02\u0324\u0323\x03\x02\x02" +
		"\x02\u0324\u0325\x03\x02\x02\x02\u0325M\x03\x02\x02\x02\u0326\u0327\x07" +
		"P\x02\x02\u0327\u0331\x05\xFE\x80\x02\u0328\u0329\x07\x1E\x02\x02\u0329" +
		"\u032E\x05\xFA~\x02\u032A\u032B\x07\x05\x02\x02\u032B\u032D\x05\xFA~\x02" +
		"\u032C\u032A\x03\x02\x02\x02\u032D\u0330\x03\x02\x02\x02\u032E\u032C\x03" +
		"\x02\x02\x02\u032E\u032F\x03\x02\x02\x02\u032F\u0332\x03\x02\x02\x02\u0330" +
		"\u032E\x03\x02\x02\x02\u0331\u0328\x03\x02\x02\x02\u0331\u0332\x03\x02" +
		"\x02\x02\u0332\u0335\x03\x02\x02\x02\u0333\u0336\x05P)\x02\u0334\u0336" +
		"\x07\x17\x02\x02\u0335\u0333\x03\x02\x02\x02\u0335\u0334\x03\x02\x02\x02" +
		"\u0336O\x03\x02\x02\x02\u0337\u0341\x07\n\x02\x02\u0338\u033A\x05\u0128" +
		"\x95\x02\u0339\u0338\x03\x02\x02\x02\u0339\u033A\x03\x02\x02\x02\u033A" +
		"\u033C\x03\x02\x02\x02\u033B\u033D\x05\u0100\x81\x02\u033C\u033B\x03\x02" +
		"\x02\x02\u033C\u033D\x03\x02\x02\x02\u033D\u033E\x03\x02\x02\x02\u033E" +
		"\u0340\x05R*\x02\u033F\u0339\x03\x02\x02\x02\u0340\u0343\x03\x02\x02\x02" +
		"\u0341\u033F\x03\x02\x02\x02\u0341\u0342\x03\x02\x02\x02\u0342\u0344\x03" +
		"\x02\x02\x02\u0343\u0341\x03\x02\x02\x02\u0344\u0345\x07\v\x02\x02\u0345" +
		"Q\x03\x02\x02\x02\u0346\u0347\x07R\x02\x02\u0347\u0348\x07w\x02\x02\u0348" +
		"\u034B\x05t;\x02\u0349\u034A\x07\x1E\x02\x02\u034A\u034C\x05\xF2z\x02" +
		"\u034B\u0349\x03\x02\x02\x02\u034B\u034C\x03\x02\x02\x02\u034C\u034D\x03" +
		"\x02\x02\x02\u034D\u034E\x07\x17\x02\x02\u034ES\x03\x02\x02\x02\u034F" +
		"\u0350\x07J\x02\x02\u0350\u0351\x07R\x02\x02\u0351\u0352\x07w\x02\x02" +
		"\u0352\u0355\x05t;\x02\u0353\u0354\x07\x1E\x02\x02\u0354\u0356\x05\xF2" +
		"z\x02\u0355\u0353\x03\x02\x02\x02\u0355\u0356\x03\x02\x02\x02\u0356\u0357" +
		"\x03\x02\x02\x02\u0357\u0358\x07\n\x02\x02\u0358\u0359\x05\xBA^\x02\u0359" +
		"\u035A\x07\v\x02\x02\u035AU\x03\x02\x02\x02\u035B\u035C\x07M\x02\x02\u035C" +
		"\u035D\x07R\x02\x02\u035D\u035E\x07w\x02\x02\u035E\u0361\x05t;\x02\u035F" +
		"\u0360\x07\x1E\x02\x02\u0360\u0362\x05\xF2z\x02\u0361\u035F\x03\x02\x02" +
		"\x02\u0361\u0362\x03\x02\x02\x02\u0362\u0363\x03\x02\x02\x02\u0363\u0364" +
		"\x07\n\x02\x02\u0364\u0365\x05\xBA^\x02\u0365\u0366\x07\v\x02\x02\u0366" +
		"W\x03\x02\x02\x02\u0367\u0368\x07R\x02\x02\u0368\u036A\x07w\x02\x02\u0369" +
		"\u036B\x05t;\x02\u036A\u0369\x03\x02\x02\x02\u036A\u036B\x03\x02\x02\x02" +
		"\u036B\u036E\x03\x02\x02\x02\u036C\u036D\x07\x1E\x02\x02\u036D\u036F\x05" +
		"\xF2z\x02\u036E\u036C\x03\x02\x02\x02\u036E\u036F\x03\x02\x02\x02\u036F" +
		"\u0370\x03\x02\x02\x02\u0370\u0371\x07\n\x02\x02\u0371\u0372\x05\xBA^" +
		"\x02\u0372\u0373\x07\v\x02\x02\u0373Y\x03\x02\x02\x02\u0374\u0378\x07" +
		"R\x02\x02\u0375\u0376\x05\xE8u\x02\u0376\u0377\x07\x04\x02\x02\u0377\u0379" +
		"\x03\x02\x02\x02\u0378\u0375\x03\x02\x02\x02\u0378\u0379\x03\x02\x02\x02" +
		"\u0379\u037A\x03\x02\x02\x02\u037A\u037B\x07w\x02\x02\u037B\u037E\x05" +
		"t;\x02\u037C\u037D\x07\x1E\x02\x02\u037D\u037F\x05\xF2z\x02\u037E\u037C" +
		"\x03\x02\x02\x02\u037E\u037F\x03\x02\x02\x02\u037F\u0380\x03\x02\x02\x02" +
		"\u0380\u0381\x07\n\x02\x02\u0381\u0382\x05\xBA^\x02\u0382\u0383\x07\v" +
		"\x02\x02\u0383[\x03\x02\x02\x02\u0384\u0385\x07S\x02\x02\u0385\u0386\x07" +
		"w\x02\x02\u0386\u0387\x07\n\x02\x02\u0387\u0388\x05^0\x02\u0388\u0389" +
		"\x07\v\x02\x02\u0389]\x03\x02\x02\x02\u038A\u038F\x05`1\x02\u038B\u038C" +
		"\x07\x05\x02\x02\u038C\u038E\x05`1\x02\u038D\u038B\x03\x02\x02\x02\u038E" +
		"\u0391\x03\x02\x02\x02\u038F\u038D\x03\x02\x02\x02\u038F\u0390\x03\x02" +
		"\x02\x02\u0390_\x03\x02\x02\x02\u0391\u038F\x03\x02\x02\x02\u0392\u0395" +
		"\x07w\x02\x02\u0393\u0394\x07\x18\x02\x02\u0394\u0396\x05\u0106\x84\x02" +
		"\u0395\u0393\x03\x02\x02\x02\u0395\u0396\x03\x02\x02\x02\u0396a\x03\x02" +
		"\x02\x02\u0397\u039C\x07w\x02\x02\u0398\u0399\x07\x04\x02\x02\u0399\u039B" +
		"\x07w\x02\x02\u039A\u0398\x03\x02\x02\x02\u039B\u039E\x03\x02\x02\x02" +
		"\u039C\u039A\x03\x02\x02\x02\u039C\u039D\x03\x02\x02\x02\u039D\u039F\x03" +
		"\x02\x02\x02\u039E\u039C\x03\x02\x02\x02\u039F\u03A1\x07\x16\x02\x02\u03A0" +
		"\u0397\x03\x02\x02\x02\u03A0\u03A1\x03\x02\x02\x02\u03A1\u03A2\x03\x02" +
		"\x02\x02\u03A2\u03A3\x07w\x02\x02\u03A3c\x03\x02\x02\x02\u03A4\u03A5\x07" +
		"R\x02\x02\u03A5\u03A6\x07w\x02\x02\u03A6\u03A9\x05t;\x02\u03A7\u03A8\x07" +
		"\x1E\x02\x02\u03A8\u03AA\x05\xF2z\x02\u03A9\u03A7\x03\x02\x02\x02\u03A9" +
		"\u03AA\x03\x02\x02\x02\u03AA\u03AB\x03\x02\x02\x02\u03AB\u03AC\x07\x18" +
		"\x02\x02\u03AC\u03AD\x05f4\x02\u03AD\u03AE\x07\x17\x02\x02\u03AEe\x03" +
		"\x02\x02\x02\u03AF\u03B4\x07w\x02\x02\u03B0\u03B1\x07\x04\x02\x02\u03B1" +
		"\u03B3\x07w\x02\x02\u03B2\u03B0\x03\x02\x02\x02\u03B3\u03B6\x03\x02\x02" +
		"\x02\u03B4\u03B2\x03\x02\x02\x02\u03B4\u03B5\x03\x02\x02\x02\u03B5g\x03" +
		"\x02\x02\x02\u03B6\u03B4\x03\x02\x02\x02\u03B7\u03B8\t\x04\x02\x02\u03B8" +
		"i\x03\x02\x02\x02\u03B9\u03BB\x05h5\x02\u03BA\u03B9\x03\x02\x02\x02\u03BA" +
		"\u03BB\x03\x02\x02\x02\u03BB\u03BC\x03\x02\x02\x02\u03BC\u03BD\x07V\x02" +
		"\x02\u03BD\u03BE\x05x=\x02\u03BE\u03BF\x07\n\x02\x02\u03BF\u03C0\x05\xBA" +
		"^\x02\u03C0\u03C1\x07\v\x02\x02\u03C1k\x03\x02\x02\x02\u03C2\u03C4\x05" +
		"h5\x02\u03C3\u03C2\x03\x02\x02\x02\u03C3\u03C4\x03\x02\x02\x02\u03C4\u03C5" +
		"\x03\x02\x02\x02\u03C5\u03C6\x07V\x02\x02\u03C6\u03C7\x05x=\x02\u03C7" +
		"\u03C8\x07\n\x02\x02\u03C8\u03C9\x05\xBA^\x02\u03C9\u03CA\x07\v\x02\x02" +
		"\u03CAm\x03\x02\x02\x02\u03CB\u03CD\x05r:\x02\u03CC\u03CB\x03\x02\x02" +
		"\x02\u03CC\u03CD\x03\x02\x02\x02\u03CD\u03CE\x03\x02\x02\x02\u03CE\u03CF" +
		"\x07X\x02\x02\u03CF\u03D2\x07w\x02\x02\u03D0\u03D1\x079\x02\x02\u03D1" +
		"\u03D3\x05\xE8u\x02\u03D2\u03D0\x03\x02\x02\x02\u03D2\u03D3\x03\x02\x02" +
		"\x02\u03D3\u03D6\x03\x02\x02\x02\u03D4\u03D5\x07\x18\x02\x02\u03D5\u03D7" +
		"\x05~@\x02\u03D6\u03D4\x03\x02\x02\x02\u03D6\u03D7\x03\x02\x02\x02\u03D7" +
		"o\x03\x02\x02\x02\u03D8\u03DB\x07w\x02\x02\u03D9\u03DA\x07\x18\x02\x02" +
		"\u03DA\u03DC\x05~@\x02\u03DB\u03D9\x03\x02\x02\x02\u03DB\u03DC\x03\x02" +
		"\x02\x02\u03DCq\x03\x02\x02\x02\u03DD\u03DE\t\x05\x02\x02\u03DEs\x03\x02" +
		"\x02\x02\u03DF\u03E1\x05v<\x02\u03E0\u03DF\x03\x02\x02\x02\u03E0\u03E1" +
		"\x03\x02\x02\x02\u03E1\u03E2\x03\x02\x02\x02\u03E2\u03E3\x05x=\x02\u03E3" +
		"u\x03\x02\x02\x02\u03E4\u03E6\x07%\x02\x02\u03E5\u03E7\x05z>\x02\u03E6" +
		"\u03E5\x03\x02\x02\x02\u03E6\u03E7\x03\x02\x02\x02\u03E7\u03E8\x03\x02" +
		"\x02\x02\u03E8\u03E9\x07&\x02\x02\u03E9w\x03\x02\x02\x02\u03EA\u03EC\x07" +
		"\x06\x02\x02\u03EB\u03ED\x05z>\x02\u03EC\u03EB\x03\x02\x02\x02\u03EC\u03ED" +
		"\x03\x02\x02\x02\u03ED\u03EE\x03\x02\x02\x02\u03EE\u03EF\x07\x07\x02\x02" +
		"\u03EFy\x03\x02\x02\x02\u03F0\u03F5\x05|?\x02\u03F1\u03F2\x07\x05\x02" +
		"\x02\u03F2\u03F4\x05|?\x02\u03F3\u03F1\x03\x02\x02\x02\u03F4\u03F7\x03" +
		"\x02\x02\x02\u03F5\u03F3\x03\x02\x02\x02\u03F5\u03F6\x03\x02\x02\x02\u03F6" +
		"{\x03\x02\x02\x02\u03F7\u03F5\x03\x02\x02\x02\u03F8\u03FA\x07?\x02\x02" +
		"\u03F9\u03F8\x03\x02\x02\x02\u03F9\u03FA\x03\x02\x02\x02\u03FA\u03FD\x03" +
		"\x02\x02\x02\u03FB\u03FC\x07w\x02\x02\u03FC\u03FE\x079\x02\x02\u03FD\u03FB" +
		"\x03\x02\x02\x02\u03FD\u03FE\x03\x02\x02\x02\u03FE\u03FF\x03\x02\x02\x02" +
		"\u03FF\u0402\x05\xE8u";
	private static readonly _serializedATNSegment2: string =
		"\x02\u0400\u0401\x07\x18\x02\x02\u0401\u0403\x05\xF4{\x02\u0402\u0400" +
		"\x03\x02\x02\x02\u0402\u0403\x03\x02\x02\x02\u0403}\x03\x02\x02\x02\u0404" +
		"\u0407\x05\xA4S\x02\u0405\u0407\x05\x84C\x02\u0406\u0404\x03\x02\x02\x02" +
		"\u0406\u0405\x03\x02\x02\x02\u0407\x7F\x03\x02\x02\x02\u0408\u0409\x05" +
		"\x9CO\x02\u0409\u040A\x07\x18\x02\x02\u040A\u040C\x03\x02\x02\x02\u040B" +
		"\u0408\x03\x02\x02\x02\u040B\u040C\x03\x02\x02\x02\u040C\u040D\x03\x02" +
		"\x02\x02\u040D\u040E\x05~@\x02\u040E\x81\x03\x02\x02\x02\u040F\u0415\x05" +
		"\x84C\x02\u0410\u0411\x07$\x02\x02\u0411\u0412\x05~@\x02\u0412\u0413\x07" +
		"\x16\x02\x02\u0413\u0414\x05~@\x02\u0414\u0416\x03\x02\x02\x02\u0415\u0410" +
		"\x03\x02\x02\x02\u0415\u0416\x03\x02\x02\x02\u0416\x83\x03\x02\x02\x02" +
		"\u0417\u041D\x05\x88E\x02\u0418\u0419\x05\x86D\x02\u0419\u041A\x05\x88" +
		"E\x02\u041A\u041C\x03\x02\x02\x02\u041B\u0418\x03\x02\x02\x02\u041C\u041F" +
		"\x03\x02\x02\x02\u041D\u041B\x03\x02\x02\x02\u041D\u041E\x03\x02\x02\x02" +
		"\u041E\x85\x03\x02\x02\x02\u041F\u041D\x03\x02\x02\x02\u0420\u0421\t\x06" +
		"\x02\x02\u0421\x87\x03\x02\x02\x02\u0422\u0427\x05\x8AF\x02\u0423\u0424" +
		"\x07\x14\x02\x02\u0424\u0426\x05\x8AF\x02\u0425\u0423\x03\x02\x02\x02" +
		"\u0426\u0429\x03\x02\x02\x02\u0427\u0425\x03\x02\x02\x02\u0427\u0428\x03" +
		"\x02\x02\x02\u0428\x89\x03\x02\x02\x02\u0429\u0427\x03\x02\x02\x02\u042A" +
		"\u042F\x05\x8CG\x02\u042B\u042C\x07\x13\x02\x02\u042C\u042E\x05\x8CG\x02" +
		"\u042D\u042B\x03\x02\x02\x02\u042E\u0431\x03\x02\x02\x02\u042F\u042D\x03" +
		"\x02\x02\x02\u042F\u0430\x03\x02\x02\x02\u0430\x8B\x03\x02\x02\x02\u0431" +
		"\u042F\x03\x02\x02\x02\u0432\u0435\x05\x8EH\x02\u0433\u0434\t\x07\x02" +
		"\x02\u0434\u0436\x05\x8EH\x02\u0435\u0433\x03\x02\x02\x02\u0435\u0436" +
		"\x03\x02\x02\x02\u0436\x8D\x03\x02\x02\x02\u0437\u043B\x05\x92J\x02\u0438" +
		"\u0439\x05\x90I\x02\u0439\u043A\x05\x92J\x02\u043A\u043C\x03\x02\x02\x02" +
		"\u043B\u0438\x03\x02\x02\x02\u043B\u043C\x03\x02\x02\x02\u043C\x8F\x03" +
		"\x02\x02\x02\u043D\u043E\t\b\x02\x02\u043E\x91\x03\x02\x02\x02\u043F\u0444" +
		"\x05\x94K\x02\u0440\u0441\t\t\x02\x02\u0441\u0443\x05\x94K\x02\u0442\u0440" +
		"\x03\x02\x02\x02\u0443\u0446\x03\x02\x02\x02\u0444\u0442\x03\x02\x02\x02" +
		"\u0444\u0445\x03\x02\x02\x02\u0445\x93\x03\x02\x02\x02\u0446\u0444\x03" +
		"\x02\x02\x02\u0447\u044C\x05\x96L\x02\u0448\u0449\t\n\x02\x02\u0449\u044B" +
		"\x05\x96L\x02\u044A\u0448\x03\x02\x02\x02\u044B\u044E\x03\x02\x02\x02" +
		"\u044C\u044A\x03\x02\x02\x02\u044C\u044D\x03\x02\x02\x02\u044D\x95\x03" +
		"\x02\x02\x02\u044E\u044C\x03\x02\x02\x02\u044F\u0450\x07\x15\x02\x02\u0450" +
		"\u0454\x05\x96L\x02\u0451\u0454\x05\x9AN\x02\u0452\u0454\x05\x98M\x02" +
		"\u0453\u044F\x03\x02\x02\x02\u0453\u0451\x03\x02\x02\x02\u0453\u0452\x03" +
		"\x02\x02\x02\u0454\x97\x03\x02\x02\x02\u0455\u0456\x05\x9CO\x02\u0456" +
		"\x99\x03\x02\x02\x02\u0457\u0458\x05\x98M\x02\u0458\u0459\x079\x02\x02" +
		"\u0459\u045A\x05\xE8u\x02\u045A\x9B\x03\x02\x02\x02\u045B\u045F\x05\x9E" +
		"P\x02\u045C\u045E\x05\xB2Z\x02\u045D\u045C\x03\x02\x02\x02\u045E\u0461" +
		"\x03\x02\x02\x02\u045F\u045D\x03\x02\x02\x02\u045F\u0460\x03\x02\x02\x02" +
		"\u0460\x9D\x03\x02\x02\x02\u0461\u045F\x03\x02\x02\x02\u0462\u0465\x05" +
		"\xA0Q\x02\u0463\u0464\x07!\x02\x02\u0464\u0466\x07w\x02\x02\u0465\u0463" +
		"\x03\x02\x02\x02\u0465\u0466\x03\x02\x02\x02\u0466\x9F\x03\x02\x02\x02" +
		"\u0467\u0473\x05\xA4S\x02\u0468\u0469\x07\b\x02\x02\u0469\u046E\x05\xA2" +
		"R\x02\u046A\u046B\x07\x05\x02\x02\u046B\u046D\x05\xA2R\x02\u046C\u046A" +
		"\x03\x02\x02\x02\u046D\u0470\x03\x02\x02\x02\u046E\u046C\x03\x02\x02\x02" +
		"\u046E\u046F\x03\x02\x02\x02\u046F\u0471\x03\x02\x02\x02\u0470\u046E\x03" +
		"\x02\x02\x02\u0471\u0472\x07\t\x02\x02\u0472\u0474\x03\x02\x02\x02\u0473" +
		"\u0468\x03\x02\x02\x02\u0473\u0474\x03\x02\x02\x02\u0474\xA1\x03\x02\x02" +
		"\x02\u0475\u0476\x07w\x02\x02\u0476\u0477\x07\x18\x02\x02\u0477\u0478" +
		"\x05~@\x02\u0478\xA3\x03\x02\x02\x02\u0479\u0480\x05\u0104\x83\x02\u047A" +
		"\u0480\x05\xF4{\x02\u047B\u0480\x05\xA6T\x02\u047C\u0480\x070\x02\x02" +
		"\u047D\u0480\x071\x02\x02\u047E\u0480\x05\xE8u\x02\u047F\u0479\x03\x02" +
		"\x02\x02\u047F\u047A\x03\x02\x02\x02\u047F\u047B\x03\x02\x02\x02\u047F" +
		"\u047C\x03\x02\x02\x02\u047F\u047D\x03\x02\x02\x02\u047F\u047E\x03\x02" +
		"\x02\x02\u0480\xA5\x03\x02\x02\x02\u0481\u0485\x05\xA8U\x02\u0482\u0485" +
		"\x05\xAAV\x02\u0483\u0485\x05\xACW\x02\u0484\u0481\x03\x02\x02\x02\u0484" +
		"\u0482\x03\x02\x02\x02\u0484\u0483\x03\x02\x02\x02\u0485\xA7\x03\x02\x02" +
		"\x02\u0486\u0487\x07\x06\x02\x02\u0487\u0488\x05~@\x02\u0488\u0489\x07" +
		"\x07\x02\x02\u0489\xA9\x03\x02\x02\x02\u048A\u048E\x07w\x02\x02\u048B" +
		"\u048D\x05\xAEX\x02\u048C\u048B\x03\x02\x02\x02\u048D\u0490\x03\x02\x02" +
		"\x02\u048E\u048C\x03\x02\x02\x02\u048E\u048F\x03\x02\x02\x02\u048F\xAB" +
		"\x03\x02\x02\x02\u0490\u048E\x03\x02\x02\x02\u0491\u0492\x05b2\x02\u0492" +
		"\u0493\x05\xB4[\x02\u0493\xAD\x03\x02\x02\x02\u0494\u0495\x07\b\x02\x02" +
		"\u0495\u0496\x05\x82B\x02\u0496\u0497\x07\t\x02\x02\u0497\u04A6\x03\x02" +
		"\x02\x02\u0498\u0499\x07\b\x02\x02\u0499\u049E\x05\xB0Y\x02\u049A\u049B" +
		"\x07\x05\x02\x02\u049B\u049D\x05\xB0Y\x02\u049C\u049A\x03\x02\x02\x02" +
		"\u049D\u04A0\x03\x02\x02\x02\u049E\u049C\x03\x02\x02\x02\u049E\u049F\x03" +
		"\x02\x02\x02\u049F\u04A1\x03\x02\x02\x02\u04A0\u049E\x03\x02\x02\x02\u04A1" +
		"\u04A2\x07\t\x02\x02\u04A2\u04A6\x03\x02\x02\x02\u04A3\u04A4\x07\b\x02" +
		"\x02\u04A4\u04A6\x07\t\x02\x02\u04A5\u0494\x03\x02\x02\x02\u04A5\u0498" +
		"\x03\x02\x02\x02\u04A5\u04A3\x03\x02\x02\x02\u04A6\xAF\x03\x02\x02\x02" +
		"\u04A7\u04A8\x07w\x02\x02\u04A8\u04A9\x07\x18\x02\x02\u04A9\u04AA\x05" +
		"~@\x02\u04AA\xB1\x03\x02\x02\x02\u04AB\u04AC\x07\x04\x02\x02\u04AC\u04AD" +
		"\x05\xA6T\x02\u04AD\xB3\x03\x02\x02\x02\u04AE\u04B0\x05\xB6\\\x02\u04AF" +
		"\u04AE\x03\x02\x02\x02\u04AF\u04B0\x03\x02\x02\x02\u04B0\u04B1\x03\x02" +
		"\x02\x02\u04B1\u04B2\x05\xB8]\x02\u04B2\xB5\x03\x02\x02\x02\u04B3\u04B5" +
		"\x07%\x02\x02\u04B4\u04B6\x05\xE6t\x02\u04B5\u04B4\x03\x02\x02\x02\u04B5" +
		"\u04B6\x03\x02\x02\x02\u04B6\u04B7\x03\x02\x02\x02\u04B7\u04B8\x07&\x02" +
		"\x02\u04B8\xB7\x03\x02\x02\x02\u04B9\u04BB\x07\x06\x02\x02\u04BA\u04BC" +
		"\x05\xE6t\x02\u04BB\u04BA\x03\x02\x02\x02\u04BB\u04BC\x03\x02\x02\x02" +
		"\u04BC\u04BD\x03\x02\x02\x02\u04BD\u04BE\x07\x07\x02\x02\u04BE\xB9\x03" +
		"\x02\x02\x02\u04BF\u04C1\x05\xBC_\x02\u04C0\u04BF\x03\x02\x02\x02\u04C1" +
		"\u04C4\x03\x02\x02\x02\u04C2\u04C0\x03\x02\x02\x02\u04C2\u04C3\x03\x02" +
		"\x02\x02\u04C3\xBB\x03\x02\x02\x02\u04C4\u04C2\x03\x02\x02\x02\u04C5\u04C6" +
		"\x05n8\x02\u04C6\u04C7\x07\x17\x02\x02\u04C7\u04DE\x03\x02\x02\x02\u04C8" +
		"\u04C9\x05\x80A\x02\u04C9\u04CA\x07\x17\x02\x02\u04CA\u04DE\x03\x02\x02" +
		"\x02\u04CB\u04DE\x05\xCCg\x02\u04CC\u04DE\x05\xD4k\x02\u04CD\u04CE\x05" +
		"\xD8m\x02\u04CE\u04CF\x07\x17\x02\x02\u04CF\u04DE\x03\x02\x02\x02\u04D0" +
		"\u04DE\x07\x17\x02\x02\u04D1\u04D2\x05\xDCo\x02\u04D2\u04D3\x07\x17\x02" +
		"\x02\u04D3\u04DE\x03\x02\x02\x02\u04D4\u04DE\x05\xDEp\x02\u04D5\u04D6" +
		"\x05\xCAf\x02\u04D6\u04D7\x07\x17\x02\x02\u04D7\u04DE\x03\x02\x02\x02" +
		"\u04D8\u04DE\x05\xC4c\x02\u04D9\u04DA\x05\xE0q\x02\u04DA\u04DB\x07\x17" +
		"\x02\x02\u04DB\u04DE\x03\x02\x02\x02\u04DC\u04DE\x05\xBE`\x02\u04DD\u04C5" +
		"\x03\x02\x02\x02\u04DD\u04C8\x03\x02\x02\x02\u04DD\u04CB\x03\x02\x02\x02" +
		"\u04DD\u04CC\x03\x02\x02\x02\u04DD\u04CD\x03\x02\x02\x02\u04DD\u04D0\x03" +
		"\x02\x02\x02\u04DD\u04D1\x03\x02\x02\x02\u04DD\u04D4\x03\x02\x02\x02\u04DD" +
		"\u04D5\x03\x02\x02\x02\u04DD\u04D8\x03\x02\x02\x02\u04DD\u04D9\x03\x02" +
		"\x02\x02\u04DD\u04DC\x03\x02\x02\x02\u04DE\xBD\x03\x02\x02\x02\u04DF\u04E0" +
		"\x07;\x02\x02\u04E0\u04E1\x07\x06\x02\x02\u04E1\u04E6\x05\xC0a\x02\u04E2" +
		"\u04E3\x07\x05\x02\x02\u04E3\u04E5\x05\xC0a\x02\u04E4\u04E2\x03\x02\x02" +
		"\x02\u04E5\u04E8\x03\x02\x02\x02\u04E6\u04E4\x03\x02\x02\x02\u04E6\u04E7" +
		"\x03\x02\x02\x02\u04E7\u04E9\x03\x02\x02\x02\u04E8\u04E6\x03\x02\x02\x02" +
		"\u04E9\u04EA\x07\x07\x02\x02\u04EA\u04EB\x05\xE2r\x02\u04EB\xBF\x03\x02" +
		"\x02\x02\u04EC\u04ED\x05\xC2b\x02\u04ED\u04EE\x07\x18\x02\x02\u04EE\u04EF" +
		"\x05~@\x02\u04EF\xC1\x03\x02\x02\x02\u04F0\u04F5\x05\xA6T\x02\u04F1\u04F2" +
		"\x07\x04\x02\x02\u04F2\u04F4\x05\xA6T\x02\u04F3\u04F1\x03\x02\x02\x02" +
		"\u04F4\u04F7\x03\x02\x02\x02\u04F5\u04F3\x03\x02\x02\x02\u04F5\u04F6\x03" +
		"\x02\x02\x02\u04F6\xC3\x03\x02\x02\x02\u04F7\u04F5\x03\x02\x02\x02\u04F8" +
		"\u04FA\x07\x0E\x02\x02\u04F9\u04FB\x05\xC6d\x02\u04FA\u04F9\x03\x02\x02" +
		"\x02\u04FB\u04FC\x03\x02\x02\x02\u04FC\u04FA\x03\x02\x02\x02\u04FC\u04FD" +
		"\x03\x02\x02\x02\u04FD\u04FE\x03\x02\x02\x02\u04FE\u04FF\x07\xAA\x02\x02" +
		"\u04FF\xC5\x03\x02\x02\x02\u0500\u0503\x05\xC8e\x02\u0501\u0503\x07\xA8" +
		"\x02\x02\u0502\u0500\x03\x02\x02\x02\u0502\u0501\x03\x02\x02\x02\u0503" +
		"\xC7\x03\x02\x02\x02\u0504\u0505\x07\xA9\x02\x02\u0505\u0506\x05~@\x02" +
		"\u0506\u0507\x07\v\x02\x02\u0507\xC9\x03\x02\x02\x02\u0508\u0509\t\v\x02" +
		"\x02\u0509\xCB\x03\x02\x02\x02\u050A\u050B\x072\x02\x02\u050B\u050C\x07" +
		"\x06\x02\x02\u050C\u050D\x05~@\x02\u050D\u050E\x07\x07\x02\x02\u050E\u0512" +
		"\x05\xD2j\x02\u050F\u0511\x05\xCEh\x02\u0510\u050F\x03\x02\x02\x02\u0511" +
		"\u0514\x03\x02\x02\x02\u0512\u0510\x03\x02\x02\x02\u0512\u0513\x03\x02" +
		"\x02\x02\u0513\u0516\x03\x02\x02\x02\u0514\u0512\x03\x02\x02\x02\u0515" +
		"\u0517\x05\xD0i\x02\u0516\u0515\x03\x02\x02\x02\u0516\u0517\x03\x02\x02" +
		"\x02\u0517\xCD\x03\x02\x02\x02\u0518\u0519\x073\x02\x02\u0519\u051A\x07" +
		"2\x02\x02\u051A\u051B\x07\x06\x02\x02\u051B\u051C\x05~@\x02\u051C\u051D" +
		"\x07\x07\x02\x02\u051D\u051E\x05\xE2r\x02\u051E\xCF\x03\x02\x02\x02\u051F" +
		"\u0520\x073\x02\x02\u0520\u0521\x05\xE2r\x02\u0521\xD1\x03\x02\x02\x02" +
		"\u0522\u0523\x05\xE2r\x02\u0523\xD3\x03\x02\x02\x02\u0524\u0525\x074\x02" +
		"\x02\u0525\u0526\x07\x06\x02\x02\u0526\u0527\x05~@\x02\u0527\u0528\x07" +
		"\x07\x02\x02\u0528\u0529\x05\xD6l\x02\u0529\xD5\x03\x02\x02\x02\u052A" +
		"\u052B\x05\xE2r\x02\u052B\xD7\x03\x02\x02\x02\u052C\u052D\x076\x02\x02" +
		"\u052D\u052E\x05\xDAn\x02\u052E\u052F\x074\x02\x02\u052F\u0530\x07\x06" +
		"\x02\x02\u0530\u0531\x05~@\x02\u0531\u0532\x07\x07\x02\x02\u0532\xD9\x03" +
		"\x02\x02\x02\u0533\u0534\x05\xE2r\x02\u0534\xDB\x03\x02\x02\x02\u0535" +
		"\u0536\x05\xE4s\x02\u0536\xDD\x03\x02\x02\x02\u0537\u0538\x077\x02\x02" +
		"\u0538\u0539\x05\xE2r\x02\u0539\u053A\x078\x02\x02\u053A\u053B\x07\x06" +
		"\x02\x02\u053B\u053C\x07w\x02\x02\u053C\u053D\x07\x07\x02\x02\u053D\u053E" +
		"\x07\x17\x02\x02\u053E\xDF\x03\x02\x02\x02\u053F\u0541\x07>\x02\x02\u0540" +
		"\u0542\x05~@\x02\u0541\u0540\x03\x02\x02\x02\u0541\u0542\x03\x02\x02\x02" +
		"\u0542\xE1\x03\x02\x02\x02\u0543\u0547\x07\n\x02\x02\u0544\u0546\x05\xBC" +
		"_\x02\u0545\u0544\x03\x02\x02\x02\u0546\u0549\x03\x02\x02\x02\u0547\u0545" +
		"\x03\x02\x02\x02\u0547\u0548\x03\x02\x02\x02\u0548\u054A\x03\x02\x02\x02" +
		"\u0549\u0547\x03\x02\x02\x02\u054A\u054D\x07\v\x02\x02\u054B\u054D\x05" +
		"\xBC_\x02\u054C\u0543\x03\x02\x02\x02\u054C\u054B\x03\x02\x02\x02\u054D" +
		"\xE3\x03\x02\x02\x02\u054E\u054F\x05\x98M\x02\u054F\u0550\t\f\x02\x02" +
		"\u0550\xE5\x03\x02\x02\x02\u0551\u0556\x05~@\x02\u0552\u0553\x07\x05\x02" +
		"\x02\u0553\u0555\x05~@\x02\u0554\u0552\x03\x02\x02\x02\u0555\u0558\x03" +
		"\x02\x02\x02\u0556\u0554\x03\x02\x02\x02\u0556\u0557\x03\x02\x02\x02\u0557" +
		"\xE7\x03\x02\x02\x02\u0558\u0556\x03\x02\x02\x02\u0559\u055B\x05\xEAv" +
		"\x02\u055A\u055C\x07\x15\x02\x02\u055B\u055A\x03\x02\x02\x02\u055B\u055C" +
		"\x03\x02\x02\x02\u055C\xE9\x03\x02\x02\x02\u055D\u0594\x05\xF0y\x02\u055E" +
		"\u0594\x07u\x02\x02\u055F\u0560\x07k\x02\x02\u0560\u0561\x07%\x02\x02" +
		"\u0561\u0562\x05\xE8u\x02\u0562\u0563\x07&\x02\x02\u0563\u0594\x03\x02" +
		"\x02\x02\u0564\u0565\x07l\x02\x02\u0565\u0566\x07%\x02\x02\u0566\u0567" +
		"\x05\xE8u\x02\u0567\u0568\x07&\x02\x02\u0568\u0594\x03\x02\x02\x02\u0569" +
		"\u056A\x07m\x02\x02\u056A\u056B\x07%\x02\x02\u056B\u056C\x05\xE8u\x02" +
		"\u056C\u056D\x07&\x02\x02\u056D\u0594\x03\x02\x02\x02\u056E\u056F\x07" +
		"^\x02\x02\u056F\u0570\x07%\x02\x02\u0570\u0571\x05\u010C\x87\x02\u0571" +
		"\u0572\x07&\x02\x02\u0572\u0594\x03\x02\x02\x02\u0573\u0574\x07^\x02\x02" +
		"\u0574\u0575\x07%\x02\x02\u0575\u057A\x07\x86\x02\x02\u0576\u0577\x07" +
		"\x05\x02\x02\u0577\u0579\x07\x86\x02\x02\u0578\u0576\x03\x02\x02\x02\u0579" +
		"\u057C\x03\x02\x02\x02\u057A\u0578\x03\x02\x02\x02\u057A\u057B\x03\x02" +
		"\x02\x02\u057B\u057D\x03\x02\x02\x02\u057C\u057A\x03\x02\x02\x02\u057D" +
		"\u0594\x07&\x02\x02\u057E\u057F\x07^\x02\x02\u057F\u0580\x07%\x02\x02" +
		"\u0580\u0581\x05\u010C\x87\x02\u0581\u0582\x07\x05\x02\x02\u0582\u0587" +
		"\x07\x86\x02\x02\u0583\u0584\x07\x05\x02\x02\u0584\u0586\x07\x86\x02\x02" +
		"\u0585\u0583\x03\x02\x02\x02\u0586\u0589\x03\x02\x02\x02\u0587\u0585\x03" +
		"\x02\x02\x02\u0587\u0588\x03\x02\x02\x02\u0588\u058A\x03\x02\x02\x02\u0589" +
		"\u0587\x03\x02\x02\x02\u058A\u058B\x07&\x02\x02\u058B\u0594\x03\x02\x02" +
		"\x02\u058C\u058E\x05\xFA~\x02\u058D\u058F\x05\xB6\\\x02\u058E\u058D\x03" +
		"\x02\x02\x02\u058E\u058F\x03\x02\x02\x02\u058F\u0594\x03\x02\x02\x02\u0590" +
		"\u0594\x07w\x02\x02\u0591\u0594\x05\xEEx\x02\u0592\u0594\x05\xECw\x02" +
		"\u0593\u055D\x03\x02\x02\x02\u0593\u055E\x03\x02\x02\x02\u0593\u055F\x03" +
		"\x02\x02\x02\u0593\u0564\x03\x02\x02\x02\u0593\u0569\x03\x02\x02\x02\u0593" +
		"\u056E\x03\x02\x02\x02\u0593\u0573\x03\x02\x02\x02\u0593\u057E\x03\x02" +
		"\x02\x02\u0593\u058C\x03\x02\x02\x02\u0593\u0590\x03\x02\x02\x02\u0593" +
		"\u0591\x03\x02\x02\x02\u0593\u0592\x03\x02\x02\x02\u0594\xEB\x03\x02\x02" +
		"\x02\u0595\u059F\x07Q\x02\x02\u0596\u0597\x07\x16\x02\x02\u0597\u059C" +
		"\x05\xFA~\x02\u0598\u0599\x07\x05\x02\x02\u0599\u059B\x05\xFA~\x02\u059A" +
		"\u0598\x03\x02\x02\x02\u059B\u059E\x03\x02\x02\x02\u059C\u059A\x03\x02" +
		"\x02\x02\u059C\u059D\x03\x02\x02\x02\u059D\u05A0\x03\x02\x02\x02\u059E" +
		"\u059C\x03\x02\x02\x02\u059F\u0596\x03\x02\x02\x02\u059F\u05A0\x03\x02" +
		"\x02\x02\u05A0\u05A1\x03\x02\x02\x02\u05A1\u05A2\x05> \x02\u05A2\xED\x03" +
		"\x02\x02\x02\u05A3\u05A4\x07\x06\x02\x02\u05A4\u05A9\x05\xE8u\x02\u05A5" +
		"\u05A6\x07-\x02\x02\u05A6\u05A8\x05\xE8u\x02\u05A7\u05A5\x03\x02\x02\x02" +
		"\u05A8\u05AB\x03\x02\x02\x02\u05A9\u05A7\x03\x02\x02\x02\u05A9\u05AA\x03" +
		"\x02\x02\x02\u05AA\u05AC\x03\x02\x02\x02\u05AB\u05A9\x03\x02\x02\x02\u05AC" +
		"\u05AD\x07\x07\x02\x02\u05AD\xEF\x03\x02\x02\x02\u05AE\u05AF\t\r\x02\x02" +
		"\u05AF\xF1\x03\x02\x02\x02\u05B0\u05B3\x05\xE8u\x02\u05B1\u05B3\x07j\x02" +
		"\x02\u05B2\u05B0\x03\x02\x02\x02\u05B2\u05B1\x03\x02\x02\x02\u05B3\xF3" +
		"\x03\x02\x02\x02\u05B4\u05BB\x05\xF6|\x02\u05B5\u05BB\x07\x86\x02\x02" +
		"\u05B6\u05BB\x05\u0122\x92\x02\u05B7\u05BB\x05\u0106\x84\x02\u05B8\u05BB" +
		"\x07v\x02\x02\u05B9\u05BB\x07t\x02\x02\u05BA\u05B4\x03\x02\x02\x02\u05BA" +
		"\u05B5\x03\x02\x02\x02\u05BA\u05B6\x03\x02\x02\x02\u05BA\u05B7\x03\x02" +
		"\x02\x02\u05BA\u05B8\x03\x02\x02\x02\u05BA\u05B9\x03\x02\x02\x02\u05BB" +
		"\xF5\x03\x02\x02\x02\u05BC\u05BD\x05\xF8}\x02\u05BD\u05BF\x05\xF8}\x02" +
		"\u05BE\u05C0\x05\xF8}\x02\u05BF\u05BE\x03\x02\x02\x02\u05BF\u05C0\x03" +
		"\x02\x02\x02\u05C0\xF7\x03\x02\x02\x02\u05C1\u05C6\x07\x84\x02\x02\u05C2" +
		"\u05C6\x05\u010C\x87\x02\u05C3\u05C6\x05\u0110\x89\x02\u05C4\u05C6\x05" +
		"\u0112\x8A\x02\u05C5\u05C1\x03\x02\x02\x02\u05C5\u05C2\x03\x02\x02\x02" +
		"\u05C5\u05C3\x03\x02\x02\x02\u05C5\u05C4\x03\x02\x02\x02\u05C6\xF9\x03" +
		"\x02\x02\x02\u05C7\u05CC\x07w\x02\x02\u05C8\u05C9\x07\x04\x02\x02\u05C9" +
		"\u05CB\x07w\x02\x02\u05CA\u05C8\x03\x02\x02\x02\u05CB\u05CE\x03\x02\x02" +
		"\x02\u05CC\u05CA\x03\x02\x02\x02\u05CC\u05CD\x03\x02\x02\x02\u05CD\u05CF" +
		"\x03\x02\x02\x02\u05CE\u05CC\x03\x02\x02\x02\u05CF\u05D1\x07\x16\x02\x02" +
		"\u05D0\u05C7\x03\x02\x02\x02\u05D0\u05D1\x03\x02\x02\x02\u05D1\u05D2\x03" +
		"\x02\x02\x02\u05D2\u05D3\x05\xFE\x80\x02\u05D3\xFB\x03\x02\x02\x02\u05D4" +
		"\u05D6\x07%\x02\x02\u05D5\u05D7\x05\xFC\x7F\x02\u05D6\u05D5\x03\x02\x02" +
		"\x02\u05D6\u05D7\x03\x02\x02\x02\u05D7\u05D8\x03\x02\x02\x02\u05D8\u05D9" +
		"\x07&\x02\x02\u05D9\xFD\x03\x02\x02\x02\u05DA\u05DB\x07w\x02\x02\u05DB" +
		"\xFF\x03\x02\x02\x02\u05DC\u05DD\x07#\x02\x02\u05DD\u05DF\x07w\x02\x02" +
		"\u05DE\u05E0\x05\u0102\x82\x02\u05DF\u05DE\x03\x02\x02\x02\u05DF\u05E0" +
		"\x03\x02\x02\x02\u05E0\u0101\x03\x02\x02\x02\u05E1\u05EA\x07%\x02\x02" +
		"\u05E2\u05E7\x05\xF4{\x02\u05E3\u05E4\x07\x05\x02\x02\u05E4\u05E6\x05" +
		"\xF4{\x02\u05E5\u05E3\x03\x02\x02\x02\u05E6\u05E9\x03\x02\x02\x02\u05E7" +
		"\u05E5\x03\x02\x02\x02\u05E7\u05E8\x03\x02\x02\x02\u05E8\u05EB\x03\x02" +
		"\x02\x02\u05E9\u05E7\x03\x02\x02\x02\u05EA\u05E2\x03\x02\x02\x02\u05EA" +
		"\u05EB\x03\x02\x02\x02\u05EB\u05EC\x03\x02\x02\x02\u05EC\u05ED\x07&\x02" +
		"\x02\u05ED\u0103\x03\x02\x02\x02\u05EE\u05EF\x05\xA6T\x02\u05EF\u05F0" +
		"\x07 \x02\x02\u05F0\u05F1\x05\xA6T\x02\u05F1\u05F8\x03\x02\x02\x02\u05F2" +
		"\u05F3\x05\xA6T\x02\u05F3\u05F4\x07 \x02\x02\u05F4\u05F8\x03\x02\x02\x02" +
		"\u05F5\u05F6\x07 \x02\x02\u05F6\u05F8\x05\xA6T\x02\u05F7\u05EE\x03\x02" +
		"\x02\x02\u05F7\u05F2\x03\x02\x02\x02\u05F7\u05F5\x03\x02\x02\x02\u05F8" +
		"\u0105\x03\x02\x02\x02\u05F9\u0607\x07\x86\x02\x02\u05FA\u0607\x05\u0114" +
		"\x8B\x02\u05FB\u0607\x05\u0108\x85\x02\u05FC\u0607\x05\u010A\x86\x02\u05FD" +
		"\u0607\x05\u010C\x87\x02\u05FE\u0607\x05\u010E\x88\x02\u05FF\u0607\x05" +
		"\u0110\x89\x02\u0600\u0607\x05\u0112\x8A\x02\u0601\u0607\x05\u0120\x91" +
		"\x02\u0602\u0607\x05\u011C\x8F\x02\u0603\u0607\x05\u0116\x8C\x02\u0604" +
		"\u0607\x05\u0118\x8D\x02\u0605\u0607\x05\u011A\x8E\x02\u0606\u05F9\x03" +
		"\x02\x02\x02\u0606\u05FA\x03\x02\x02\x02\u0606\u05FB\x03\x02\x02\x02\u0606" +
		"\u05FC\x03\x02\x02\x02\u0606\u05FD\x03\x02\x02\x02\u0606\u05FE\x03\x02" +
		"\x02\x02\u0606\u05FF\x03\x02\x02\x02\u0606\u0600\x03\x02\x02\x02\u0606" +
		"\u0601\x03\x02\x02\x02\u0606\u0602\x03\x02\x02\x02\u0606\u0603\x03\x02" +
		"\x02\x02\u0606\u0604\x03\x02\x02\x02\u0606\u0605\x03\x02\x02\x02\u0607" +
		"\u0107\x03\x02\x02\x02\u0608\u0609\x07|\x02\x02\u0609\u0109\x03\x02\x02" +
		"\x02\u060A\u060B\x07}\x02\x02\u060B\u010B\x03\x02\x02\x02\u060C\u060D" +
		"\x07~\x02\x02\u060D\u010D\x03\x02\x02\x02\u060E\u060F\x07\x7F\x02\x02" +
		"\u060F\u010F\x03\x02\x02\x02\u0610\u0611\x07\x80\x02\x02\u0611\u0111\x03" +
		"\x02\x02\x02\u0612\u0613\x07\x81\x02\x02\u0613\u0113\x03\x02\x02\x02\u0614" +
		"\u0615\t\x0E\x02\x02\u0615\u0115\x03\x02\x02\x02\u0616\u0617\x07y\x02" +
		"\x02\u0617\u061C\x05\u0108\x85\x02\u0618\u0619\x07\x05\x02\x02\u0619\u061B" +
		"\x05\u0108\x85\x02\u061A\u0618\x03\x02\x02\x02\u061B\u061E\x03\x02\x02" +
		"\x02\u061C\u061A\x03\x02\x02\x02\u061C\u061D\x03\x02\x02\x02\u061D\u061F" +
		"\x03\x02\x02\x02\u061E\u061C\x03\x02\x02\x02\u061F\u0620\x07\t\x02\x02" +
		"\u0620\u0117\x03\x02\x02\x02\u0621\u0622\x07z\x02\x02\u0622\u0627\x05" +
		"\u010C\x87\x02\u0623\u0624\x07\x05\x02\x02\u0624\u0626\x05\u010C\x87\x02" +
		"\u0625\u0623\x03\x02\x02\x02\u0626\u0629\x03\x02\x02\x02\u0627\u0625\x03" +
		"\x02\x02\x02\u0627\u0628\x03\x02\x02\x02\u0628\u062A\x03\x02\x02\x02\u0629" +
		"\u0627\x03\x02\x02\x02\u062A\u062B\x07\t\x02\x02\u062B\u0119\x03\x02\x02" +
		"\x02\u062C\u062D\x07{\x02\x02\u062D\u0632\x05\u010E\x88\x02\u062E\u062F" +
		"\x07\x05\x02\x02\u062F\u0631\x05\u010E\x88\x02\u0630\u062E\x03\x02\x02" +
		"\x02\u0631\u0634\x03\x02\x02\x02\u0632\u0630\x03\x02\x02\x02\u0632\u0633" +
		"\x03\x02\x02\x02\u0633\u0635\x03\x02\x02\x02\u0634\u0632\x03\x02\x02\x02" +
		"\u0635\u0636\x07\t\x02\x02\u0636\u011B\x03\x02\x02\x02\u0637\u0642\x07" +
		"\b\x02\x02\u0638\u063D\x05~@\x02\u0639\u063A\x07\x05\x02\x02\u063A\u063C" +
		"\x05~@\x02\u063B\u0639\x03\x02\x02\x02\u063C\u063F\x03\x02\x02\x02\u063D" +
		"\u063B\x03\x02\x02\x02\u063D\u063E\x03\x02\x02\x02\u063E\u0641\x03\x02" +
		"\x02\x02\u063F\u063D\x03\x02\x02\x02\u0640\u0638\x03\x02\x02\x02\u0641" +
		"\u0644\x03\x02\x02\x02\u0642\u0640\x03\x02\x02\x02\u0642\u0643\x03\x02" +
		"\x02\x02\u0643\u0645\x03\x02\x02\x02\u0644\u0642\x03\x02\x02\x02\u0645" +
		"\u0646\x07\t\x02\x02\u0646\u011D\x03\x02\x02\x02\u0647\u0648\x07w\x02" +
		"\x02\u0648\u0649\x07\x16\x02\x02\u0649\u064A\x05~@\x02\u064A\u011F\x03" +
		"\x02\x02\x02\u064B\u0656\x07\n\x02\x02\u064C\u0651\x05\u011E\x90\x02\u064D" +
		"\u064E\x07\x05\x02\x02\u064E\u0650\x05\u011E\x90\x02\u064F\u064D\x03\x02" +
		"\x02\x02\u0650\u0653\x03\x02\x02\x02\u0651\u064F\x03\x02\x02\x02\u0651" +
		"\u0652\x03\x02\x02\x02\u0652\u0655\x03\x02\x02\x02\u0653\u0651\x03\x02" +
		"\x02\x02\u0654\u064C\x03\x02\x02\x02\u0655\u0658\x03\x02\x02\x02\u0656" +
		"\u0654\x03\x02\x02\x02\u0656\u0657\x03\x02\x02\x02\u0657\u0659\x03\x02" +
		"\x02\x02\u0658\u0656\x03\x02\x02\x02\u0659\u065A\x07\v\x02\x02\u065A\u0121" +
		"\x03\x02\x02\x02\u065B\u065F\x07/\x02\x02\u065C\u065E\x05\u0124\x93\x02" +
		"\u065D\u065C\x03\x02\x02\x02\u065E\u0661\x03\x02\x02\x02\u065F\u065D\x03" +
		"\x02\x02\x02\u065F\u0660\x03\x02\x02\x02\u0660\u0662\x03\x02\x02\x02\u0661" +
		"\u065F\x03\x02\x02\x02\u0662\u0663\x07\xAB\x02\x02\u0663\u0123\x03\x02" +
		"\x02\x02\u0664\u0668\x05\u0126\x94\x02\u0665\u0668\x07\xAE\x02\x02\u0666" +
		"\u0668\x07\xAC\x02\x02\u0667\u0664\x03\x02\x02\x02\u0667\u0665\x03\x02" +
		"\x02\x02\u0667\u0666\x03\x02\x02\x02\u0668\u0125\x03\x02\x02\x02\u0669" +
		"\u066A\x07\xAD\x02\x02\u066A\u066B\x05~@\x02\u066B\u066C\x07\v\x02\x02" +
		"\u066C\u0127\x03\x02\x02\x02\u066D\u066E\x07\x88\x02\x02\u066E\u0129\x03" +
		"\x02\x02\x02\xB4\u012B\u0130\u0136\u013C\u0144\u0148\u0150\u0159\u015D" +
		"\u0166\u0173\u0187\u018A\u0192\u0196\u019C\u01A1\u01A4\u01A7\u01AA\u01AF" +
		"\u01B7\u01BA\u01BE\u01C1\u01C7\u01CF\u01D2\u01D6\u01E1\u01E4\u01EF\u01F5" +
		"\u01FA\u0207\u020A\u0211\u0218\u021F\u0224\u022B\u0236\u0241\u024A\u024F" +
		"\u0253\u0256\u025C\u025F\u0274\u0287\u028B\u028E\u0291\u029C\u029F\u02A3" +
		"\u02A6\u02AB\u02B3\u02B8\u02BC\u02BF\u02C5\u02CD\u02D0\u02D4\u02D8\u02DD" +
		"\u02E3\u02ED\u02F0\u02F7\u02FE\u0301\u0306\u030A\u030D\u0313\u0317\u031F" +
		"\u0324\u032E\u0331\u0335\u0339\u033C\u0341\u034B\u0355\u0361\u036A\u036E" +
		"\u0378\u037E\u038F\u0395\u039C\u03A0\u03A9\u03B4\u03BA\u03C3\u03CC\u03D2" +
		"\u03D6\u03DB\u03E0\u03E6\u03EC\u03F5\u03F9\u03FD\u0402\u0406\u040B\u0415" +
		"\u041D\u0427\u042F\u0435\u043B\u0444\u044C\u0453\u045F\u0465\u046E\u0473" +
		"\u047F\u0484\u048E\u049E\u04A5\u04AF\u04B5\u04BB\u04C2\u04DD\u04E6\u04F5" +
		"\u04FC\u0502\u0512\u0516\u0541\u0547\u054C\u0556\u055B\u057A\u0587\u058E" +
		"\u0593\u059C\u059F\u05A9\u05B2\u05BA\u05BF\u05C5\u05CC\u05D0\u05D6\u05DF" +
		"\u05E7\u05EA\u05F7\u0606\u061C\u0627\u0632\u063D\u0642\u0651\u0656\u065F" +
		"\u0667";
	public static readonly _serializedATN: string = Utils.join(
		[
			mcfppParser._serializedATNSegment0,
			mcfppParser._serializedATNSegment1,
			mcfppParser._serializedATNSegment2,
		],
		"",
	);
	public static __ATN: ATN;
	public static get _ATN(): ATN {
		if (!mcfppParser.__ATN) {
			mcfppParser.__ATN = new ATNDeserializer().deserialize(Utils.toCharArray(mcfppParser._serializedATN));
		}

		return mcfppParser.__ATN;
	}

}

export class CompilationUnitContext extends ParserRuleContext {
	public EOF(): TerminalNode { return this.getToken(mcfppParser.EOF, 0); }
	public namespaceDeclaration(): NamespaceDeclarationContext | undefined {
		return this.tryGetRuleContext(0, NamespaceDeclarationContext);
	}
	public importDeclaration(): ImportDeclarationContext[];
	public importDeclaration(i: number): ImportDeclarationContext;
	public importDeclaration(i?: number): ImportDeclarationContext | ImportDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ImportDeclarationContext);
		} else {
			return this.getRuleContext(i, ImportDeclarationContext);
		}
	}
	public typealiasDeclaration(): TypealiasDeclarationContext[];
	public typealiasDeclaration(i: number): TypealiasDeclarationContext;
	public typealiasDeclaration(i?: number): TypealiasDeclarationContext | TypealiasDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypealiasDeclarationContext);
		} else {
			return this.getRuleContext(i, TypealiasDeclarationContext);
		}
	}
	public typeDeclaration(): TypeDeclarationContext[];
	public typeDeclaration(i: number): TypeDeclarationContext;
	public typeDeclaration(i?: number): TypeDeclarationContext | TypeDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeDeclarationContext);
		} else {
			return this.getRuleContext(i, TypeDeclarationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_compilationUnit; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterCompilationUnit) {
			listener.enterCompilationUnit(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitCompilationUnit) {
			listener.exitCompilationUnit(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitCompilationUnit) {
			return visitor.visitCompilationUnit(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TopStatementContext extends ParserRuleContext {
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_topStatement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTopStatement) {
			listener.enterTopStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTopStatement) {
			listener.exitTopStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTopStatement) {
			return visitor.visitTopStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NamespaceDeclarationContext extends ParserRuleContext {
	public NAMESPACE(): TerminalNode { return this.getToken(mcfppParser.NAMESPACE, 0); }
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.Identifier);
		} else {
			return this.getToken(mcfppParser.Identifier, i);
		}
	}
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	public doc_comment(): Doc_commentContext | undefined {
		return this.tryGetRuleContext(0, Doc_commentContext);
	}
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.DOT);
		} else {
			return this.getToken(mcfppParser.DOT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_namespaceDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNamespaceDeclaration) {
			listener.enterNamespaceDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNamespaceDeclaration) {
			listener.exitNamespaceDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNamespaceDeclaration) {
			return visitor.visitNamespaceDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportDeclarationContext extends ParserRuleContext {
	public IMPORT(): TerminalNode { return this.getToken(mcfppParser.IMPORT, 0); }
	public importType(): ImportTypeContext {
		return this.getRuleContext(0, ImportTypeContext);
	}
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	public AS(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.AS, 0); }
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.Identifier);
		} else {
			return this.getToken(mcfppParser.Identifier, i);
		}
	}
	public FROM(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.FROM, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_importDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterImportDeclaration) {
			listener.enterImportDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitImportDeclaration) {
			listener.exitImportDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitImportDeclaration) {
			return visitor.visitImportDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ImportTypeContext extends ParserRuleContext {
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.Identifier);
		} else {
			return this.getToken(mcfppParser.Identifier, i);
		}
	}
	public COLON(): TerminalNode { return this.getToken(mcfppParser.COLON, 0); }
	public MULT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.MULT, 0); }
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.DOT);
		} else {
			return this.getToken(mcfppParser.DOT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_importType; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterImportType) {
			listener.enterImportType(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitImportType) {
			listener.exitImportType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitImportType) {
			return visitor.visitImportType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypealiasDeclarationContext extends ParserRuleContext {
	public TYPEALIAS(): TerminalNode { return this.getToken(mcfppParser.TYPEALIAS, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public AS(): TerminalNode { return this.getToken(mcfppParser.AS, 0); }
	public type(): TypeContext {
		return this.getRuleContext(0, TypeContext);
	}
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_typealiasDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTypealiasDeclaration) {
			listener.enterTypealiasDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTypealiasDeclaration) {
			listener.exitTypealiasDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTypealiasDeclaration) {
			return visitor.visitTypealiasDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeDeclarationContext extends ParserRuleContext {
	public declarations(): DeclarationsContext {
		return this.getRuleContext(0, DeclarationsContext);
	}
	public doc_comment(): Doc_commentContext | undefined {
		return this.tryGetRuleContext(0, Doc_commentContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_typeDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTypeDeclaration) {
			listener.enterTypeDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTypeDeclaration) {
			listener.exitTypeDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTypeDeclaration) {
			return visitor.visitTypeDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DeclarationsContext extends ParserRuleContext {
	public classDeclaration(): ClassDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ClassDeclarationContext);
	}
	public genericClassImplement(): GenericClassImplementContext | undefined {
		return this.tryGetRuleContext(0, GenericClassImplementContext);
	}
	public objectClassDeclaration(): ObjectClassDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ObjectClassDeclarationContext);
	}
	public functionDeclaration(): FunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, FunctionDeclarationContext);
	}
	public inlineFunctionDeclaration(): InlineFunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, InlineFunctionDeclarationContext);
	}
	public nativeFuncDeclaration(): NativeFuncDeclarationContext | undefined {
		return this.tryGetRuleContext(0, NativeFuncDeclarationContext);
	}
	public compileTimeFuncDeclaration(): CompileTimeFuncDeclarationContext | undefined {
		return this.tryGetRuleContext(0, CompileTimeFuncDeclarationContext);
	}
	public compileTimeClassDeclaration(): CompileTimeClassDeclarationContext | undefined {
		return this.tryGetRuleContext(0, CompileTimeClassDeclarationContext);
	}
	public nativeClassDeclaration(): NativeClassDeclarationContext | undefined {
		return this.tryGetRuleContext(0, NativeClassDeclarationContext);
	}
	public templateDeclaration(): TemplateDeclarationContext | undefined {
		return this.tryGetRuleContext(0, TemplateDeclarationContext);
	}
	public objectTemplateDeclaration(): ObjectTemplateDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ObjectTemplateDeclarationContext);
	}
	public extensionFunctionDeclaration(): ExtensionFunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ExtensionFunctionDeclarationContext);
	}
	public interfaceDeclaration(): InterfaceDeclarationContext | undefined {
		return this.tryGetRuleContext(0, InterfaceDeclarationContext);
	}
	public namespaceFieldDeclaration(): NamespaceFieldDeclarationContext | undefined {
		return this.tryGetRuleContext(0, NamespaceFieldDeclarationContext);
	}
	public enumDeclaration(): EnumDeclarationContext | undefined {
		return this.tryGetRuleContext(0, EnumDeclarationContext);
	}
	public annotation(): AnnotationContext | undefined {
		return this.tryGetRuleContext(0, AnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_declarations; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterDeclarations) {
			listener.enterDeclarations(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitDeclarations) {
			listener.exitDeclarations(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitDeclarations) {
			return visitor.visitDeclarations(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NamespaceFieldDeclarationContext extends ParserRuleContext {
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	public namespaceFieldDeclarationExpression(): NamespaceFieldDeclarationExpressionContext[];
	public namespaceFieldDeclarationExpression(i: number): NamespaceFieldDeclarationExpressionContext;
	public namespaceFieldDeclarationExpression(i?: number): NamespaceFieldDeclarationExpressionContext | NamespaceFieldDeclarationExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NamespaceFieldDeclarationExpressionContext);
		} else {
			return this.getRuleContext(i, NamespaceFieldDeclarationExpressionContext);
		}
	}
	public fieldModifier(): FieldModifierContext | undefined {
		return this.tryGetRuleContext(0, FieldModifierContext);
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	public VAR(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.VAR, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.Identifier, 0); }
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ASSIGNMENT, 0); }
	public value(): ValueContext | undefined {
		return this.tryGetRuleContext(0, ValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_namespaceFieldDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNamespaceFieldDeclaration) {
			listener.enterNamespaceFieldDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNamespaceFieldDeclaration) {
			listener.exitNamespaceFieldDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNamespaceFieldDeclaration) {
			return visitor.visitNamespaceFieldDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NamespaceFieldDeclarationExpressionContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ASSIGNMENT, 0); }
	public value(): ValueContext | undefined {
		return this.tryGetRuleContext(0, ValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_namespaceFieldDeclarationExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNamespaceFieldDeclarationExpression) {
			listener.enterNamespaceFieldDeclarationExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNamespaceFieldDeclarationExpression) {
			listener.exitNamespaceFieldDeclarationExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNamespaceFieldDeclarationExpression) {
			return visitor.visitNamespaceFieldDeclarationExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassDeclarationContext extends ParserRuleContext {
	public CLASS(): TerminalNode { return this.getToken(mcfppParser.CLASS, 0); }
	public classWithoutNamespace(): ClassWithoutNamespaceContext {
		return this.getRuleContext(0, ClassWithoutNamespaceContext);
	}
	public classBody(): ClassBodyContext | undefined {
		return this.tryGetRuleContext(0, ClassBodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SEMICOLON, 0); }
	public STATIC(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.STATIC, 0); }
	public FINAL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.FINAL, 0); }
	public ABSTRACT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ABSTRACT, 0); }
	public readOnlyParams(): ReadOnlyParamsContext | undefined {
		return this.tryGetRuleContext(0, ReadOnlyParamsContext);
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.COLON, 0); }
	public className(): ClassNameContext[];
	public className(i: number): ClassNameContext;
	public className(i?: number): ClassNameContext | ClassNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassNameContext);
		} else {
			return this.getRuleContext(i, ClassNameContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_classDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterClassDeclaration) {
			listener.enterClassDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitClassDeclaration) {
			listener.exitClassDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitClassDeclaration) {
			return visitor.visitClassDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectClassDeclarationContext extends ParserRuleContext {
	public OBJECT(): TerminalNode { return this.getToken(mcfppParser.OBJECT, 0); }
	public CLASS(): TerminalNode { return this.getToken(mcfppParser.CLASS, 0); }
	public classWithoutNamespace(): ClassWithoutNamespaceContext {
		return this.getRuleContext(0, ClassWithoutNamespaceContext);
	}
	public classBody(): ClassBodyContext | undefined {
		return this.tryGetRuleContext(0, ClassBodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SEMICOLON, 0); }
	public FINAL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.FINAL, 0); }
	public readOnlyParams(): ReadOnlyParamsContext | undefined {
		return this.tryGetRuleContext(0, ReadOnlyParamsContext);
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.COLON, 0); }
	public className(): ClassNameContext[];
	public className(i: number): ClassNameContext;
	public className(i?: number): ClassNameContext | ClassNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassNameContext);
		} else {
			return this.getRuleContext(i, ClassNameContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_objectClassDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterObjectClassDeclaration) {
			listener.enterObjectClassDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitObjectClassDeclaration) {
			listener.exitObjectClassDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitObjectClassDeclaration) {
			return visitor.visitObjectClassDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CompileTimeClassDeclarationContext extends ParserRuleContext {
	public CONST(): TerminalNode { return this.getToken(mcfppParser.CONST, 0); }
	public CLASS(): TerminalNode { return this.getToken(mcfppParser.CLASS, 0); }
	public classWithoutNamespace(): ClassWithoutNamespaceContext {
		return this.getRuleContext(0, ClassWithoutNamespaceContext);
	}
	public classBody(): ClassBodyContext {
		return this.getRuleContext(0, ClassBodyContext);
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.COLON, 0); }
	public className(): ClassNameContext[];
	public className(i: number): ClassNameContext;
	public className(i?: number): ClassNameContext | ClassNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassNameContext);
		} else {
			return this.getRuleContext(i, ClassNameContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_compileTimeClassDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterCompileTimeClassDeclaration) {
			listener.enterCompileTimeClassDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitCompileTimeClassDeclaration) {
			listener.exitCompileTimeClassDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitCompileTimeClassDeclaration) {
			return visitor.visitCompileTimeClassDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NativeClassDeclarationContext extends ParserRuleContext {
	public CLASS(): TerminalNode { return this.getToken(mcfppParser.CLASS, 0); }
	public classWithoutNamespace(): ClassWithoutNamespaceContext {
		return this.getRuleContext(0, ClassWithoutNamespaceContext);
	}
	public ASSIGNMENT(): TerminalNode { return this.getToken(mcfppParser.ASSIGNMENT, 0); }
	public javaRefer(): JavaReferContext {
		return this.getRuleContext(0, JavaReferContext);
	}
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nativeClassDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNativeClassDeclaration) {
			listener.enterNativeClassDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNativeClassDeclaration) {
			listener.exitNativeClassDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNativeClassDeclaration) {
			return visitor.visitNativeClassDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassMemberDeclarationContext extends ParserRuleContext {
	public classMember(): ClassMemberContext {
		return this.getRuleContext(0, ClassMemberContext);
	}
	public accessModifier(): AccessModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessModifierContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_classMemberDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterClassMemberDeclaration) {
			listener.enterClassMemberDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitClassMemberDeclaration) {
			listener.exitClassMemberDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitClassMemberDeclaration) {
			return visitor.visitClassMemberDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassBodyContext extends ParserRuleContext {
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public classMemberDeclaration(): ClassMemberDeclarationContext[];
	public classMemberDeclaration(i: number): ClassMemberDeclarationContext;
	public classMemberDeclaration(i?: number): ClassMemberDeclarationContext | ClassMemberDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassMemberDeclarationContext);
		} else {
			return this.getRuleContext(i, ClassMemberDeclarationContext);
		}
	}
	public doc_comment(): Doc_commentContext[];
	public doc_comment(i: number): Doc_commentContext;
	public doc_comment(i?: number): Doc_commentContext | Doc_commentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Doc_commentContext);
		} else {
			return this.getRuleContext(i, Doc_commentContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_classBody; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterClassBody) {
			listener.enterClassBody(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitClassBody) {
			listener.exitClassBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitClassBody) {
			return visitor.visitClassBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassMemberContext extends ParserRuleContext {
	public classFunctionDeclaration(): ClassFunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ClassFunctionDeclarationContext);
	}
	public classFieldDeclaration(): ClassFieldDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ClassFieldDeclarationContext);
	}
	public classConstructorDeclaration(): ClassConstructorDeclarationContext | undefined {
		return this.tryGetRuleContext(0, ClassConstructorDeclarationContext);
	}
	public nativeClassFunctionDeclaration(): NativeClassFunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, NativeClassFunctionDeclarationContext);
	}
	public abstractClassFunctionDeclaration(): AbstractClassFunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, AbstractClassFunctionDeclarationContext);
	}
	public annotation(): AnnotationContext | undefined {
		return this.tryGetRuleContext(0, AnnotationContext);
	}
	public operationOverrideDeclaration(): OperationOverrideDeclarationContext | undefined {
		return this.tryGetRuleContext(0, OperationOverrideDeclarationContext);
	}
	public nativeOperationOverrideDeclaration(): NativeOperationOverrideDeclarationContext | undefined {
		return this.tryGetRuleContext(0, NativeOperationOverrideDeclarationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_classMember; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterClassMember) {
			listener.enterClassMember(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitClassMember) {
			listener.exitClassMember(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitClassMember) {
			return visitor.visitClassMember(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassFunctionDeclarationContext extends ParserRuleContext {
	public FUNCTION(): TerminalNode { return this.getToken(mcfppParser.FUNCTION, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public functionParams(): FunctionParamsContext {
		return this.getRuleContext(0, FunctionParamsContext);
	}
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public OVERRIDE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.OVERRIDE, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_classFunctionDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterClassFunctionDeclaration) {
			listener.enterClassFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitClassFunctionDeclaration) {
			listener.exitClassFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitClassFunctionDeclaration) {
			return visitor.visitClassFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AbstractClassFunctionDeclarationContext extends ParserRuleContext {
	public FUNCTION(): TerminalNode { return this.getToken(mcfppParser.FUNCTION, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public functionParams(): FunctionParamsContext {
		return this.getRuleContext(0, FunctionParamsContext);
	}
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	public OVERRIDE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.OVERRIDE, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_abstractClassFunctionDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterAbstractClassFunctionDeclaration) {
			listener.enterAbstractClassFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitAbstractClassFunctionDeclaration) {
			listener.exitAbstractClassFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitAbstractClassFunctionDeclaration) {
			return visitor.visitAbstractClassFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NativeClassFunctionDeclarationContext extends ParserRuleContext {
	public FUNCTION(): TerminalNode { return this.getToken(mcfppParser.FUNCTION, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public functionParams(): FunctionParamsContext {
		return this.getRuleContext(0, FunctionParamsContext);
	}
	public ASSIGNMENT(): TerminalNode { return this.getToken(mcfppParser.ASSIGNMENT, 0); }
	public javaRefer(): JavaReferContext {
		return this.getRuleContext(0, JavaReferContext);
	}
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	public OVERRIDE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.OVERRIDE, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nativeClassFunctionDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNativeClassFunctionDeclaration) {
			listener.enterNativeClassFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNativeClassFunctionDeclaration) {
			listener.exitNativeClassFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNativeClassFunctionDeclaration) {
			return visitor.visitNativeClassFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OperationOverrideDeclarationContext extends ParserRuleContext {
	public OPERATOR(): TerminalNode { return this.getToken(mcfppParser.OPERATOR, 0); }
	public supportOperator(): SupportOperatorContext {
		return this.getRuleContext(0, SupportOperatorContext);
	}
	public functionParams(): FunctionParamsContext {
		return this.getRuleContext(0, FunctionParamsContext);
	}
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_operationOverrideDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterOperationOverrideDeclaration) {
			listener.enterOperationOverrideDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitOperationOverrideDeclaration) {
			listener.exitOperationOverrideDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitOperationOverrideDeclaration) {
			return visitor.visitOperationOverrideDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NativeOperationOverrideDeclarationContext extends ParserRuleContext {
	public OPERATOR(): TerminalNode { return this.getToken(mcfppParser.OPERATOR, 0); }
	public supportOperator(): SupportOperatorContext {
		return this.getRuleContext(0, SupportOperatorContext);
	}
	public functionParams(): FunctionParamsContext {
		return this.getRuleContext(0, FunctionParamsContext);
	}
	public ASSIGNMENT(): TerminalNode { return this.getToken(mcfppParser.ASSIGNMENT, 0); }
	public javaRefer(): JavaReferContext {
		return this.getRuleContext(0, JavaReferContext);
	}
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nativeOperationOverrideDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNativeOperationOverrideDeclaration) {
			listener.enterNativeOperationOverrideDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNativeOperationOverrideDeclaration) {
			listener.exitNativeOperationOverrideDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNativeOperationOverrideDeclaration) {
			return visitor.visitNativeOperationOverrideDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SupportOperatorContext extends ParserRuleContext {
	public ADD(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ADD, 0); }
	public SUB(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SUB, 0); }
	public MULT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.MULT, 0); }
	public DIV(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.DIV, 0); }
	public MOD(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.MOD, 0); }
	public RANGLE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.RANGLE, 0); }
	public LANGLE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LANGLE, 0); }
	public GE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.GE, 0); }
	public LE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LE, 0); }
	public EQEQ(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.EQEQ, 0); }
	public EXCL_EQ(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.EXCL_EQ, 0); }
	public WVEQ(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.WVEQ, 0); }
	public DISJ(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.DISJ, 0); }
	public CONJ(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.CONJ, 0); }
	public PIPE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.PIPE, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_supportOperator; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterSupportOperator) {
			listener.enterSupportOperator(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitSupportOperator) {
			listener.exitSupportOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitSupportOperator) {
			return visitor.visitSupportOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassFieldDeclarationContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	public accessModifier(): AccessModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessModifierContext);
	}
	public AS(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.AS, 0); }
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ASSIGNMENT, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public accessor(): AccessorContext | undefined {
		return this.tryGetRuleContext(0, AccessorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_classFieldDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterClassFieldDeclaration) {
			listener.enterClassFieldDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitClassFieldDeclaration) {
			listener.exitClassFieldDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitClassFieldDeclaration) {
			return visitor.visitClassFieldDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AccessorContext extends ParserRuleContext {
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public getter(): GetterContext | undefined {
		return this.tryGetRuleContext(0, GetterContext);
	}
	public setter(): SetterContext | undefined {
		return this.tryGetRuleContext(0, SetterContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_accessor; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterAccessor) {
			listener.enterAccessor(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitAccessor) {
			listener.exitAccessor(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitAccessor) {
			return visitor.visitAccessor(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GetterContext extends ParserRuleContext {
	public GET(): TerminalNode { return this.getToken(mcfppParser.GET, 0); }
	public LCURL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LCURL, 0); }
	public functionBody(): FunctionBodyContext | undefined {
		return this.tryGetRuleContext(0, FunctionBodyContext);
	}
	public RCURL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.RCURL, 0); }
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ASSIGNMENT, 0); }
	public javaRefer(): JavaReferContext | undefined {
		return this.tryGetRuleContext(0, JavaReferContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SEMICOLON, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_getter; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterGetter) {
			listener.enterGetter(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitGetter) {
			listener.exitGetter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitGetter) {
			return visitor.visitGetter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SetterContext extends ParserRuleContext {
	public SET(): TerminalNode { return this.getToken(mcfppParser.SET, 0); }
	public LCURL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LCURL, 0); }
	public functionBody(): FunctionBodyContext | undefined {
		return this.tryGetRuleContext(0, FunctionBodyContext);
	}
	public RCURL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.RCURL, 0); }
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ASSIGNMENT, 0); }
	public javaRefer(): JavaReferContext | undefined {
		return this.tryGetRuleContext(0, JavaReferContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SEMICOLON, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_setter; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterSetter) {
			listener.enterSetter(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitSetter) {
			listener.exitSetter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitSetter) {
			return visitor.visitSetter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class GenericClassImplementContext extends ParserRuleContext {
	public IMPL(): TerminalNode { return this.getToken(mcfppParser.IMPL, 0); }
	public CLASS(): TerminalNode { return this.getToken(mcfppParser.CLASS, 0); }
	public classWithoutNamespace(): ClassWithoutNamespaceContext {
		return this.getRuleContext(0, ClassWithoutNamespaceContext);
	}
	public readOnlyArgs(): ReadOnlyArgsContext {
		return this.getRuleContext(0, ReadOnlyArgsContext);
	}
	public classBody(): ClassBodyContext | undefined {
		return this.tryGetRuleContext(0, ClassBodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SEMICOLON, 0); }
	public STATIC(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.STATIC, 0); }
	public FINAL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.FINAL, 0); }
	public ABSTRACT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ABSTRACT, 0); }
	public COLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.COLON, 0); }
	public className(): ClassNameContext[];
	public className(i: number): ClassNameContext;
	public className(i?: number): ClassNameContext | ClassNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassNameContext);
		} else {
			return this.getRuleContext(i, ClassNameContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_genericClassImplement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterGenericClassImplement) {
			listener.enterGenericClassImplement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitGenericClassImplement) {
			listener.exitGenericClassImplement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitGenericClassImplement) {
			return visitor.visitGenericClassImplement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TemplateDeclarationContext extends ParserRuleContext {
	public DATA(): TerminalNode { return this.getToken(mcfppParser.DATA, 0); }
	public classWithoutNamespace(): ClassWithoutNamespaceContext {
		return this.getRuleContext(0, ClassWithoutNamespaceContext);
	}
	public templateBody(): TemplateBodyContext | undefined {
		return this.tryGetRuleContext(0, TemplateBodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SEMICOLON, 0); }
	public FINAL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.FINAL, 0); }
	public readOnlyParams(): ReadOnlyParamsContext | undefined {
		return this.tryGetRuleContext(0, ReadOnlyParamsContext);
	}
	public AS(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.AS, 0); }
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.COLON, 0); }
	public className(): ClassNameContext[];
	public className(i: number): ClassNameContext;
	public className(i?: number): ClassNameContext | ClassNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassNameContext);
		} else {
			return this.getRuleContext(i, ClassNameContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_templateDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTemplateDeclaration) {
			listener.enterTemplateDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTemplateDeclaration) {
			listener.exitTemplateDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTemplateDeclaration) {
			return visitor.visitTemplateDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectTemplateDeclarationContext extends ParserRuleContext {
	public OBJECT(): TerminalNode { return this.getToken(mcfppParser.OBJECT, 0); }
	public DATA(): TerminalNode { return this.getToken(mcfppParser.DATA, 0); }
	public classWithoutNamespace(): ClassWithoutNamespaceContext {
		return this.getRuleContext(0, ClassWithoutNamespaceContext);
	}
	public templateBody(): TemplateBodyContext | undefined {
		return this.tryGetRuleContext(0, TemplateBodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SEMICOLON, 0); }
	public FINAL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.FINAL, 0); }
	public readOnlyParams(): ReadOnlyParamsContext | undefined {
		return this.tryGetRuleContext(0, ReadOnlyParamsContext);
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.COLON, 0); }
	public className(): ClassNameContext[];
	public className(i: number): ClassNameContext;
	public className(i?: number): ClassNameContext | ClassNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassNameContext);
		} else {
			return this.getRuleContext(i, ClassNameContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_objectTemplateDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterObjectTemplateDeclaration) {
			listener.enterObjectTemplateDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitObjectTemplateDeclaration) {
			listener.exitObjectTemplateDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitObjectTemplateDeclaration) {
			return visitor.visitObjectTemplateDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TemplateBodyContext extends ParserRuleContext {
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public templateMemberDeclaration(): TemplateMemberDeclarationContext[];
	public templateMemberDeclaration(i: number): TemplateMemberDeclarationContext;
	public templateMemberDeclaration(i?: number): TemplateMemberDeclarationContext | TemplateMemberDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TemplateMemberDeclarationContext);
		} else {
			return this.getRuleContext(i, TemplateMemberDeclarationContext);
		}
	}
	public doc_comment(): Doc_commentContext[];
	public doc_comment(i: number): Doc_commentContext;
	public doc_comment(i?: number): Doc_commentContext | Doc_commentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Doc_commentContext);
		} else {
			return this.getRuleContext(i, Doc_commentContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_templateBody; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTemplateBody) {
			listener.enterTemplateBody(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTemplateBody) {
			listener.exitTemplateBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTemplateBody) {
			return visitor.visitTemplateBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TemplateMemberDeclarationContext extends ParserRuleContext {
	public templateMember(): TemplateMemberContext {
		return this.getRuleContext(0, TemplateMemberContext);
	}
	public accessModifier(): AccessModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessModifierContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_templateMemberDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTemplateMemberDeclaration) {
			listener.enterTemplateMemberDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTemplateMemberDeclaration) {
			listener.exitTemplateMemberDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTemplateMemberDeclaration) {
			return visitor.visitTemplateMemberDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TemplateMemberContext extends ParserRuleContext {
	public templateFunctionDeclaration(): TemplateFunctionDeclarationContext | undefined {
		return this.tryGetRuleContext(0, TemplateFunctionDeclarationContext);
	}
	public templateFieldDeclaration(): TemplateFieldDeclarationContext | undefined {
		return this.tryGetRuleContext(0, TemplateFieldDeclarationContext);
	}
	public templateConstructorDeclaration(): TemplateConstructorDeclarationContext | undefined {
		return this.tryGetRuleContext(0, TemplateConstructorDeclarationContext);
	}
	public operationOverrideDeclaration(): OperationOverrideDeclarationContext | undefined {
		return this.tryGetRuleContext(0, OperationOverrideDeclarationContext);
	}
	public nativeOperationOverrideDeclaration(): NativeOperationOverrideDeclarationContext | undefined {
		return this.tryGetRuleContext(0, NativeOperationOverrideDeclarationContext);
	}
	public annotation(): AnnotationContext | undefined {
		return this.tryGetRuleContext(0, AnnotationContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_templateMember; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTemplateMember) {
			listener.enterTemplateMember(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTemplateMember) {
			listener.exitTemplateMember(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTemplateMember) {
			return visitor.visitTemplateMember(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TemplateFunctionDeclarationContext extends ParserRuleContext {
	public FUNCTION(): TerminalNode { return this.getToken(mcfppParser.FUNCTION, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public functionParams(): FunctionParamsContext {
		return this.getRuleContext(0, FunctionParamsContext);
	}
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public OVERRIDE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.OVERRIDE, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_templateFunctionDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTemplateFunctionDeclaration) {
			listener.enterTemplateFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTemplateFunctionDeclaration) {
			listener.exitTemplateFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTemplateFunctionDeclaration) {
			return visitor.visitTemplateFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TemplateFieldDeclarationContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	public accessModifier(): AccessModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessModifierContext);
	}
	public CONST(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.CONST, 0); }
	public AS(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.AS, 0); }
	public templateType(): TemplateTypeContext | undefined {
		return this.tryGetRuleContext(0, TemplateTypeContext);
	}
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ASSIGNMENT, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	public accessor(): AccessorContext | undefined {
		return this.tryGetRuleContext(0, AccessorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_templateFieldDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTemplateFieldDeclaration) {
			listener.enterTemplateFieldDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTemplateFieldDeclaration) {
			listener.exitTemplateFieldDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTemplateFieldDeclaration) {
			return visitor.visitTemplateFieldDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TemplateTypeContext extends ParserRuleContext {
	public singleTemplateFieldType(): SingleTemplateFieldTypeContext | undefined {
		return this.tryGetRuleContext(0, SingleTemplateFieldTypeContext);
	}
	public unionTemplateFieldType(): UnionTemplateFieldTypeContext | undefined {
		return this.tryGetRuleContext(0, UnionTemplateFieldTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_templateType; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTemplateType) {
			listener.enterTemplateType(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTemplateType) {
			listener.exitTemplateType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTemplateType) {
			return visitor.visitTemplateType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SingleTemplateFieldTypeContext extends ParserRuleContext {
	public type(): TypeContext {
		return this.getRuleContext(0, TypeContext);
	}
	public QUEST(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.QUEST, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_singleTemplateFieldType; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterSingleTemplateFieldType) {
			listener.enterSingleTemplateFieldType(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitSingleTemplateFieldType) {
			listener.exitSingleTemplateFieldType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitSingleTemplateFieldType) {
			return visitor.visitSingleTemplateFieldType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnionTemplateFieldTypeContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(mcfppParser.LPAREN, 0); }
	public type(): TypeContext[];
	public type(i: number): TypeContext;
	public type(i?: number): TypeContext | TypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeContext);
		} else {
			return this.getRuleContext(i, TypeContext);
		}
	}
	public RPAREN(): TerminalNode { return this.getToken(mcfppParser.RPAREN, 0); }
	public PIPE(): TerminalNode[];
	public PIPE(i: number): TerminalNode;
	public PIPE(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.PIPE);
		} else {
			return this.getToken(mcfppParser.PIPE, i);
		}
	}
	public QUEST(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.QUEST, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_unionTemplateFieldType; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterUnionTemplateFieldType) {
			listener.enterUnionTemplateFieldType(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitUnionTemplateFieldType) {
			listener.exitUnionTemplateFieldType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitUnionTemplateFieldType) {
			return visitor.visitUnionTemplateFieldType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceDeclarationContext extends ParserRuleContext {
	public INTERFACE(): TerminalNode { return this.getToken(mcfppParser.INTERFACE, 0); }
	public classWithoutNamespace(): ClassWithoutNamespaceContext {
		return this.getRuleContext(0, ClassWithoutNamespaceContext);
	}
	public interfaceBody(): InterfaceBodyContext | undefined {
		return this.tryGetRuleContext(0, InterfaceBodyContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SEMICOLON, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public className(): ClassNameContext[];
	public className(i: number): ClassNameContext;
	public className(i?: number): ClassNameContext | ClassNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassNameContext);
		} else {
			return this.getRuleContext(i, ClassNameContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_interfaceDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterInterfaceDeclaration) {
			listener.enterInterfaceDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitInterfaceDeclaration) {
			listener.exitInterfaceDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitInterfaceDeclaration) {
			return visitor.visitInterfaceDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceBodyContext extends ParserRuleContext {
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public interfaceFunctionDeclaration(): InterfaceFunctionDeclarationContext[];
	public interfaceFunctionDeclaration(i: number): InterfaceFunctionDeclarationContext;
	public interfaceFunctionDeclaration(i?: number): InterfaceFunctionDeclarationContext | InterfaceFunctionDeclarationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(InterfaceFunctionDeclarationContext);
		} else {
			return this.getRuleContext(i, InterfaceFunctionDeclarationContext);
		}
	}
	public doc_comment(): Doc_commentContext[];
	public doc_comment(i: number): Doc_commentContext;
	public doc_comment(i?: number): Doc_commentContext | Doc_commentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(Doc_commentContext);
		} else {
			return this.getRuleContext(i, Doc_commentContext);
		}
	}
	public annotation(): AnnotationContext[];
	public annotation(i: number): AnnotationContext;
	public annotation(i?: number): AnnotationContext | AnnotationContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AnnotationContext);
		} else {
			return this.getRuleContext(i, AnnotationContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_interfaceBody; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterInterfaceBody) {
			listener.enterInterfaceBody(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitInterfaceBody) {
			listener.exitInterfaceBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitInterfaceBody) {
			return visitor.visitInterfaceBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InterfaceFunctionDeclarationContext extends ParserRuleContext {
	public FUNCTION(): TerminalNode { return this.getToken(mcfppParser.FUNCTION, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public functionParams(): FunctionParamsContext {
		return this.getRuleContext(0, FunctionParamsContext);
	}
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_interfaceFunctionDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterInterfaceFunctionDeclaration) {
			listener.enterInterfaceFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitInterfaceFunctionDeclaration) {
			listener.exitInterfaceFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitInterfaceFunctionDeclaration) {
			return visitor.visitInterfaceFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CompileTimeFuncDeclarationContext extends ParserRuleContext {
	public CONST(): TerminalNode { return this.getToken(mcfppParser.CONST, 0); }
	public FUNCTION(): TerminalNode { return this.getToken(mcfppParser.FUNCTION, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public functionParams(): FunctionParamsContext {
		return this.getRuleContext(0, FunctionParamsContext);
	}
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_compileTimeFuncDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterCompileTimeFuncDeclaration) {
			listener.enterCompileTimeFuncDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitCompileTimeFuncDeclaration) {
			listener.exitCompileTimeFuncDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitCompileTimeFuncDeclaration) {
			return visitor.visitCompileTimeFuncDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class InlineFunctionDeclarationContext extends ParserRuleContext {
	public INLINE(): TerminalNode { return this.getToken(mcfppParser.INLINE, 0); }
	public FUNCTION(): TerminalNode { return this.getToken(mcfppParser.FUNCTION, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public functionParams(): FunctionParamsContext {
		return this.getRuleContext(0, FunctionParamsContext);
	}
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_inlineFunctionDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterInlineFunctionDeclaration) {
			listener.enterInlineFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitInlineFunctionDeclaration) {
			listener.exitInlineFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitInlineFunctionDeclaration) {
			return visitor.visitInlineFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionDeclarationContext extends ParserRuleContext {
	public FUNCTION(): TerminalNode { return this.getToken(mcfppParser.FUNCTION, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public functionParams(): FunctionParamsContext | undefined {
		return this.tryGetRuleContext(0, FunctionParamsContext);
	}
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_functionDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterFunctionDeclaration) {
			listener.enterFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitFunctionDeclaration) {
			listener.exitFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitFunctionDeclaration) {
			return visitor.visitFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExtensionFunctionDeclarationContext extends ParserRuleContext {
	public FUNCTION(): TerminalNode { return this.getToken(mcfppParser.FUNCTION, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public functionParams(): FunctionParamsContext {
		return this.getRuleContext(0, FunctionParamsContext);
	}
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	public DOT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.DOT, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_extensionFunctionDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterExtensionFunctionDeclaration) {
			listener.enterExtensionFunctionDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitExtensionFunctionDeclaration) {
			listener.exitExtensionFunctionDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitExtensionFunctionDeclaration) {
			return visitor.visitExtensionFunctionDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumDeclarationContext extends ParserRuleContext {
	public ENUM(): TerminalNode { return this.getToken(mcfppParser.ENUM, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public enumBody(): EnumBodyContext {
		return this.getRuleContext(0, EnumBodyContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_enumDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterEnumDeclaration) {
			listener.enterEnumDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitEnumDeclaration) {
			listener.exitEnumDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitEnumDeclaration) {
			return visitor.visitEnumDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumBodyContext extends ParserRuleContext {
	public enumMember(): EnumMemberContext[];
	public enumMember(i: number): EnumMemberContext;
	public enumMember(i?: number): EnumMemberContext | EnumMemberContext[] {
		if (i === undefined) {
			return this.getRuleContexts(EnumMemberContext);
		} else {
			return this.getRuleContext(i, EnumMemberContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_enumBody; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterEnumBody) {
			listener.enterEnumBody(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitEnumBody) {
			listener.exitEnumBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitEnumBody) {
			return visitor.visitEnumBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EnumMemberContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ASSIGNMENT, 0); }
	public nbtValue(): NbtValueContext | undefined {
		return this.tryGetRuleContext(0, NbtValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_enumMember; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterEnumMember) {
			listener.enterEnumMember(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitEnumMember) {
			listener.exitEnumMember(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitEnumMember) {
			return visitor.visitEnumMember(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NamespaceIDContext extends ParserRuleContext {
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.Identifier);
		} else {
			return this.getToken(mcfppParser.Identifier, i);
		}
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.COLON, 0); }
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.DOT);
		} else {
			return this.getToken(mcfppParser.DOT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_namespaceID; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNamespaceID) {
			listener.enterNamespaceID(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNamespaceID) {
			listener.exitNamespaceID(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNamespaceID) {
			return visitor.visitNamespaceID(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NativeFuncDeclarationContext extends ParserRuleContext {
	public FUNCTION(): TerminalNode { return this.getToken(mcfppParser.FUNCTION, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public functionParams(): FunctionParamsContext {
		return this.getRuleContext(0, FunctionParamsContext);
	}
	public ASSIGNMENT(): TerminalNode { return this.getToken(mcfppParser.ASSIGNMENT, 0); }
	public javaRefer(): JavaReferContext {
		return this.getRuleContext(0, JavaReferContext);
	}
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	public ARROW(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ARROW, 0); }
	public functionReturnType(): FunctionReturnTypeContext | undefined {
		return this.tryGetRuleContext(0, FunctionReturnTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nativeFuncDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNativeFuncDeclaration) {
			listener.enterNativeFuncDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNativeFuncDeclaration) {
			listener.exitNativeFuncDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNativeFuncDeclaration) {
			return visitor.visitNativeFuncDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JavaReferContext extends ParserRuleContext {
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.Identifier);
		} else {
			return this.getToken(mcfppParser.Identifier, i);
		}
	}
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.DOT);
		} else {
			return this.getToken(mcfppParser.DOT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_javaRefer; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterJavaRefer) {
			listener.enterJavaRefer(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitJavaRefer) {
			listener.exitJavaRefer(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitJavaRefer) {
			return visitor.visitJavaRefer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AccessModifierContext extends ParserRuleContext {
	public PRIVATE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.PRIVATE, 0); }
	public PROTECTED(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.PROTECTED, 0); }
	public PUBLIC(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.PUBLIC, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_accessModifier; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterAccessModifier) {
			listener.enterAccessModifier(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitAccessModifier) {
			listener.exitAccessModifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitAccessModifier) {
			return visitor.visitAccessModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassConstructorDeclarationContext extends ParserRuleContext {
	public CONSTRUCTOR(): TerminalNode { return this.getToken(mcfppParser.CONSTRUCTOR, 0); }
	public normalParams(): NormalParamsContext {
		return this.getRuleContext(0, NormalParamsContext);
	}
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public accessModifier(): AccessModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessModifierContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_classConstructorDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterClassConstructorDeclaration) {
			listener.enterClassConstructorDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitClassConstructorDeclaration) {
			listener.exitClassConstructorDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitClassConstructorDeclaration) {
			return visitor.visitClassConstructorDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TemplateConstructorDeclarationContext extends ParserRuleContext {
	public CONSTRUCTOR(): TerminalNode { return this.getToken(mcfppParser.CONSTRUCTOR, 0); }
	public normalParams(): NormalParamsContext {
		return this.getRuleContext(0, NormalParamsContext);
	}
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public functionBody(): FunctionBodyContext {
		return this.getRuleContext(0, FunctionBodyContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public accessModifier(): AccessModifierContext | undefined {
		return this.tryGetRuleContext(0, AccessModifierContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_templateConstructorDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTemplateConstructorDeclaration) {
			listener.enterTemplateConstructorDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTemplateConstructorDeclaration) {
			listener.exitTemplateConstructorDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTemplateConstructorDeclaration) {
			return visitor.visitTemplateConstructorDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FieldDeclarationContext extends ParserRuleContext {
	public VAR(): TerminalNode { return this.getToken(mcfppParser.VAR, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public fieldModifier(): FieldModifierContext | undefined {
		return this.tryGetRuleContext(0, FieldModifierContext);
	}
	public AS(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.AS, 0); }
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ASSIGNMENT, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_fieldDeclaration; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterFieldDeclaration) {
			listener.enterFieldDeclaration(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitFieldDeclaration) {
			listener.exitFieldDeclaration(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitFieldDeclaration) {
			return visitor.visitFieldDeclaration(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FieldDeclarationExpressionContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ASSIGNMENT, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_fieldDeclarationExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterFieldDeclarationExpression) {
			listener.enterFieldDeclarationExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitFieldDeclarationExpression) {
			listener.exitFieldDeclarationExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitFieldDeclarationExpression) {
			return visitor.visitFieldDeclarationExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FieldModifierContext extends ParserRuleContext {
	public CONST(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.CONST, 0); }
	public DYNAMIC(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.DYNAMIC, 0); }
	public IMPORT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.IMPORT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_fieldModifier; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterFieldModifier) {
			listener.enterFieldModifier(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitFieldModifier) {
			listener.exitFieldModifier(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitFieldModifier) {
			return visitor.visitFieldModifier(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionParamsContext extends ParserRuleContext {
	public normalParams(): NormalParamsContext {
		return this.getRuleContext(0, NormalParamsContext);
	}
	public readOnlyParams(): ReadOnlyParamsContext | undefined {
		return this.tryGetRuleContext(0, ReadOnlyParamsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_functionParams; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterFunctionParams) {
			listener.enterFunctionParams(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitFunctionParams) {
			listener.exitFunctionParams(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitFunctionParams) {
			return visitor.visitFunctionParams(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReadOnlyParamsContext extends ParserRuleContext {
	public LANGLE(): TerminalNode { return this.getToken(mcfppParser.LANGLE, 0); }
	public RANGLE(): TerminalNode { return this.getToken(mcfppParser.RANGLE, 0); }
	public parameterList(): ParameterListContext | undefined {
		return this.tryGetRuleContext(0, ParameterListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_readOnlyParams; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterReadOnlyParams) {
			listener.enterReadOnlyParams(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitReadOnlyParams) {
			listener.exitReadOnlyParams(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitReadOnlyParams) {
			return visitor.visitReadOnlyParams(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NormalParamsContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(mcfppParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(mcfppParser.RPAREN, 0); }
	public parameterList(): ParameterListContext | undefined {
		return this.tryGetRuleContext(0, ParameterListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_normalParams; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNormalParams) {
			listener.enterNormalParams(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNormalParams) {
			listener.exitNormalParams(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNormalParams) {
			return visitor.visitNormalParams(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterListContext extends ParserRuleContext {
	public parameter(): ParameterContext[];
	public parameter(i: number): ParameterContext;
	public parameter(i?: number): ParameterContext | ParameterContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ParameterContext);
		} else {
			return this.getRuleContext(i, ParameterContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_parameterList; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterParameterList) {
			listener.enterParameterList(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitParameterList) {
			listener.exitParameterList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitParameterList) {
			return visitor.visitParameterList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ParameterContext extends ParserRuleContext {
	public type(): TypeContext {
		return this.getRuleContext(0, TypeContext);
	}
	public STATIC(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.STATIC, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.Identifier, 0); }
	public AS(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.AS, 0); }
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ASSIGNMENT, 0); }
	public value(): ValueContext | undefined {
		return this.tryGetRuleContext(0, ValueContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_parameter; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterParameter) {
			listener.enterParameter(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitParameter) {
			listener.exitParameter(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitParameter) {
			return visitor.visitParameter(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionContext extends ParserRuleContext {
	public primary(): PrimaryContext | undefined {
		return this.tryGetRuleContext(0, PrimaryContext);
	}
	public commonBinaryOperatorExpression(): CommonBinaryOperatorExpressionContext | undefined {
		return this.tryGetRuleContext(0, CommonBinaryOperatorExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_expression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterExpression) {
			listener.enterExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitExpression) {
			listener.exitExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitExpression) {
			return visitor.visitExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementExpressionContext extends ParserRuleContext {
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public varWithSelector(): VarWithSelectorContext | undefined {
		return this.tryGetRuleContext(0, VarWithSelectorContext);
	}
	public ASSIGNMENT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ASSIGNMENT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_statementExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterStatementExpression) {
			listener.enterStatementExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitStatementExpression) {
			listener.exitStatementExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitStatementExpression) {
			return visitor.visitStatementExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConditionalExpressionContext extends ParserRuleContext {
	public commonBinaryOperatorExpression(): CommonBinaryOperatorExpressionContext {
		return this.getRuleContext(0, CommonBinaryOperatorExpressionContext);
	}
	public QUEST(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.QUEST, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.COLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_conditionalExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterConditionalExpression) {
			listener.enterConditionalExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitConditionalExpression) {
			listener.exitConditionalExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitConditionalExpression) {
			return visitor.visitConditionalExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CommonBinaryOperatorExpressionContext extends ParserRuleContext {
	public conditionalOrExpression(): ConditionalOrExpressionContext[];
	public conditionalOrExpression(i: number): ConditionalOrExpressionContext;
	public conditionalOrExpression(i?: number): ConditionalOrExpressionContext | ConditionalOrExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ConditionalOrExpressionContext);
		} else {
			return this.getRuleContext(i, ConditionalOrExpressionContext);
		}
	}
	public commonBinaryOperator(): CommonBinaryOperatorContext[];
	public commonBinaryOperator(i: number): CommonBinaryOperatorContext;
	public commonBinaryOperator(i?: number): CommonBinaryOperatorContext | CommonBinaryOperatorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(CommonBinaryOperatorContext);
		} else {
			return this.getRuleContext(i, CommonBinaryOperatorContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_commonBinaryOperatorExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterCommonBinaryOperatorExpression) {
			listener.enterCommonBinaryOperatorExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitCommonBinaryOperatorExpression) {
			listener.exitCommonBinaryOperatorExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitCommonBinaryOperatorExpression) {
			return visitor.visitCommonBinaryOperatorExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CommonBinaryOperatorContext extends ParserRuleContext {
	public PIPE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.PIPE, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_commonBinaryOperator; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterCommonBinaryOperator) {
			listener.enterCommonBinaryOperator(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitCommonBinaryOperator) {
			listener.exitCommonBinaryOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitCommonBinaryOperator) {
			return visitor.visitCommonBinaryOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConditionalOrExpressionContext extends ParserRuleContext {
	public conditionalAndExpression(): ConditionalAndExpressionContext[];
	public conditionalAndExpression(i: number): ConditionalAndExpressionContext;
	public conditionalAndExpression(i?: number): ConditionalAndExpressionContext | ConditionalAndExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ConditionalAndExpressionContext);
		} else {
			return this.getRuleContext(i, ConditionalAndExpressionContext);
		}
	}
	public DISJ(): TerminalNode[];
	public DISJ(i: number): TerminalNode;
	public DISJ(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.DISJ);
		} else {
			return this.getToken(mcfppParser.DISJ, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_conditionalOrExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterConditionalOrExpression) {
			listener.enterConditionalOrExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitConditionalOrExpression) {
			listener.exitConditionalOrExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitConditionalOrExpression) {
			return visitor.visitConditionalOrExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ConditionalAndExpressionContext extends ParserRuleContext {
	public equalityExpression(): EqualityExpressionContext[];
	public equalityExpression(i: number): EqualityExpressionContext;
	public equalityExpression(i?: number): EqualityExpressionContext | EqualityExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(EqualityExpressionContext);
		} else {
			return this.getRuleContext(i, EqualityExpressionContext);
		}
	}
	public CONJ(): TerminalNode[];
	public CONJ(i: number): TerminalNode;
	public CONJ(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.CONJ);
		} else {
			return this.getToken(mcfppParser.CONJ, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_conditionalAndExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterConditionalAndExpression) {
			listener.enterConditionalAndExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitConditionalAndExpression) {
			listener.exitConditionalAndExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitConditionalAndExpression) {
			return visitor.visitConditionalAndExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class EqualityExpressionContext extends ParserRuleContext {
	public _op!: Token;
	public relationalExpression(): RelationalExpressionContext[];
	public relationalExpression(i: number): RelationalExpressionContext;
	public relationalExpression(i?: number): RelationalExpressionContext | RelationalExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(RelationalExpressionContext);
		} else {
			return this.getRuleContext(i, RelationalExpressionContext);
		}
	}
	public EQEQ(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.EQEQ, 0); }
	public EXCL_EQ(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.EXCL_EQ, 0); }
	public WVEQ(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.WVEQ, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_equalityExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterEqualityExpression) {
			listener.enterEqualityExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitEqualityExpression) {
			listener.exitEqualityExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitEqualityExpression) {
			return visitor.visitEqualityExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RelationalExpressionContext extends ParserRuleContext {
	public additiveExpression(): AdditiveExpressionContext[];
	public additiveExpression(i: number): AdditiveExpressionContext;
	public additiveExpression(i?: number): AdditiveExpressionContext | AdditiveExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(AdditiveExpressionContext);
		} else {
			return this.getRuleContext(i, AdditiveExpressionContext);
		}
	}
	public relationalOp(): RelationalOpContext | undefined {
		return this.tryGetRuleContext(0, RelationalOpContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_relationalExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterRelationalExpression) {
			listener.enterRelationalExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitRelationalExpression) {
			listener.exitRelationalExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitRelationalExpression) {
			return visitor.visitRelationalExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RelationalOpContext extends ParserRuleContext {
	public LE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LE, 0); }
	public GE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.GE, 0); }
	public LANGLE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LANGLE, 0); }
	public RANGLE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.RANGLE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_relationalOp; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterRelationalOp) {
			listener.enterRelationalOp(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitRelationalOp) {
			listener.exitRelationalOp(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitRelationalOp) {
			return visitor.visitRelationalOp(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AdditiveExpressionContext extends ParserRuleContext {
	public _op!: Token;
	public multiplicativeExpression(): MultiplicativeExpressionContext[];
	public multiplicativeExpression(i: number): MultiplicativeExpressionContext;
	public multiplicativeExpression(i?: number): MultiplicativeExpressionContext | MultiplicativeExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(MultiplicativeExpressionContext);
		} else {
			return this.getRuleContext(i, MultiplicativeExpressionContext);
		}
	}
	public ADD(): TerminalNode[];
	public ADD(i: number): TerminalNode;
	public ADD(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.ADD);
		} else {
			return this.getToken(mcfppParser.ADD, i);
		}
	}
	public SUB(): TerminalNode[];
	public SUB(i: number): TerminalNode;
	public SUB(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.SUB);
		} else {
			return this.getToken(mcfppParser.SUB, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_additiveExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterAdditiveExpression) {
			listener.enterAdditiveExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitAdditiveExpression) {
			listener.exitAdditiveExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitAdditiveExpression) {
			return visitor.visitAdditiveExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiplicativeExpressionContext extends ParserRuleContext {
	public _op!: Token;
	public unaryExpression(): UnaryExpressionContext[];
	public unaryExpression(i: number): UnaryExpressionContext;
	public unaryExpression(i?: number): UnaryExpressionContext | UnaryExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(UnaryExpressionContext);
		} else {
			return this.getRuleContext(i, UnaryExpressionContext);
		}
	}
	public MULT(): TerminalNode[];
	public MULT(i: number): TerminalNode;
	public MULT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.MULT);
		} else {
			return this.getToken(mcfppParser.MULT, i);
		}
	}
	public DIV(): TerminalNode[];
	public DIV(i: number): TerminalNode;
	public DIV(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.DIV);
		} else {
			return this.getToken(mcfppParser.DIV, i);
		}
	}
	public MOD(): TerminalNode[];
	public MOD(i: number): TerminalNode;
	public MOD(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.MOD);
		} else {
			return this.getToken(mcfppParser.MOD, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_multiplicativeExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterMultiplicativeExpression) {
			listener.enterMultiplicativeExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitMultiplicativeExpression) {
			listener.exitMultiplicativeExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitMultiplicativeExpression) {
			return visitor.visitMultiplicativeExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnaryExpressionContext extends ParserRuleContext {
	public EXCL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.EXCL, 0); }
	public unaryExpression(): UnaryExpressionContext | undefined {
		return this.tryGetRuleContext(0, UnaryExpressionContext);
	}
	public castExpression(): CastExpressionContext | undefined {
		return this.tryGetRuleContext(0, CastExpressionContext);
	}
	public rightVarExpression(): RightVarExpressionContext | undefined {
		return this.tryGetRuleContext(0, RightVarExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_unaryExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterUnaryExpression) {
			listener.enterUnaryExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitUnaryExpression) {
			listener.exitUnaryExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitUnaryExpression) {
			return visitor.visitUnaryExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RightVarExpressionContext extends ParserRuleContext {
	public varWithSelector(): VarWithSelectorContext {
		return this.getRuleContext(0, VarWithSelectorContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_rightVarExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterRightVarExpression) {
			listener.enterRightVarExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitRightVarExpression) {
			listener.exitRightVarExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitRightVarExpression) {
			return visitor.visitRightVarExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CastExpressionContext extends ParserRuleContext {
	public rightVarExpression(): RightVarExpressionContext {
		return this.getRuleContext(0, RightVarExpressionContext);
	}
	public AS(): TerminalNode { return this.getToken(mcfppParser.AS, 0); }
	public type(): TypeContext {
		return this.getRuleContext(0, TypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_castExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterCastExpression) {
			listener.enterCastExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitCastExpression) {
			listener.exitCastExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitCastExpression) {
			return visitor.visitCastExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VarWithSelectorContext extends ParserRuleContext {
	public jvmAccessExpression(): JvmAccessExpressionContext {
		return this.getRuleContext(0, JvmAccessExpressionContext);
	}
	public selector(): SelectorContext[];
	public selector(i: number): SelectorContext;
	public selector(i?: number): SelectorContext | SelectorContext[] {
		if (i === undefined) {
			return this.getRuleContexts(SelectorContext);
		} else {
			return this.getRuleContext(i, SelectorContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_varWithSelector; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterVarWithSelector) {
			listener.enterVarWithSelector(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitVarWithSelector) {
			listener.exitVarWithSelector(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitVarWithSelector) {
			return visitor.visitVarWithSelector(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class JvmAccessExpressionContext extends ParserRuleContext {
	public propertyOperator(): PropertyOperatorContext {
		return this.getRuleContext(0, PropertyOperatorContext);
	}
	public COLONCOLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.COLONCOLON, 0); }
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_jvmAccessExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterJvmAccessExpression) {
			listener.enterJvmAccessExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitJvmAccessExpression) {
			listener.exitJvmAccessExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitJvmAccessExpression) {
			return visitor.visitJvmAccessExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PropertyOperatorContext extends ParserRuleContext {
	public primary(): PrimaryContext {
		return this.getRuleContext(0, PrimaryContext);
	}
	public LSQUARE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LSQUARE, 0); }
	public propertyOperatorExpression(): PropertyOperatorExpressionContext[];
	public propertyOperatorExpression(i: number): PropertyOperatorExpressionContext;
	public propertyOperatorExpression(i?: number): PropertyOperatorExpressionContext | PropertyOperatorExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(PropertyOperatorExpressionContext);
		} else {
			return this.getRuleContext(i, PropertyOperatorExpressionContext);
		}
	}
	public RSQUARE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.RSQUARE, 0); }
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_propertyOperator; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterPropertyOperator) {
			listener.enterPropertyOperator(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitPropertyOperator) {
			listener.exitPropertyOperator(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitPropertyOperator) {
			return visitor.visitPropertyOperator(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PropertyOperatorExpressionContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public ASSIGNMENT(): TerminalNode { return this.getToken(mcfppParser.ASSIGNMENT, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_propertyOperatorExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterPropertyOperatorExpression) {
			listener.enterPropertyOperatorExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitPropertyOperatorExpression) {
			listener.exitPropertyOperatorExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitPropertyOperatorExpression) {
			return visitor.visitPropertyOperatorExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class PrimaryContext extends ParserRuleContext {
	public range(): RangeContext | undefined {
		return this.tryGetRuleContext(0, RangeContext);
	}
	public value(): ValueContext | undefined {
		return this.tryGetRuleContext(0, ValueContext);
	}
	public var(): VarContext | undefined {
		return this.tryGetRuleContext(0, VarContext);
	}
	public THIS(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.THIS, 0); }
	public SUPER(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SUPER, 0); }
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_primary; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterPrimary) {
			listener.enterPrimary(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitPrimary) {
			listener.exitPrimary(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitPrimary) {
			return visitor.visitPrimary(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VarContext extends ParserRuleContext {
	public bucketExpression(): BucketExpressionContext | undefined {
		return this.tryGetRuleContext(0, BucketExpressionContext);
	}
	public varWithSuffix(): VarWithSuffixContext | undefined {
		return this.tryGetRuleContext(0, VarWithSuffixContext);
	}
	public functionCall(): FunctionCallContext | undefined {
		return this.tryGetRuleContext(0, FunctionCallContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_var; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterVar) {
			listener.enterVar(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitVar) {
			listener.exitVar(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitVar) {
			return visitor.visitVar(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BucketExpressionContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(mcfppParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(mcfppParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_bucketExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterBucketExpression) {
			listener.enterBucketExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitBucketExpression) {
			listener.exitBucketExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitBucketExpression) {
			return visitor.visitBucketExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class VarWithSuffixContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public identifierSuffix(): IdentifierSuffixContext[];
	public identifierSuffix(i: number): IdentifierSuffixContext;
	public identifierSuffix(i?: number): IdentifierSuffixContext | IdentifierSuffixContext[] {
		if (i === undefined) {
			return this.getRuleContexts(IdentifierSuffixContext);
		} else {
			return this.getRuleContext(i, IdentifierSuffixContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_varWithSuffix; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterVarWithSuffix) {
			listener.enterVarWithSuffix(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitVarWithSuffix) {
			listener.exitVarWithSuffix(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitVarWithSuffix) {
			return visitor.visitVarWithSuffix(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionCallContext extends ParserRuleContext {
	public namespaceID(): NamespaceIDContext {
		return this.getRuleContext(0, NamespaceIDContext);
	}
	public arguments(): ArgumentsContext {
		return this.getRuleContext(0, ArgumentsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_functionCall; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterFunctionCall) {
			listener.enterFunctionCall(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitFunctionCall) {
			listener.exitFunctionCall(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitFunctionCall) {
			return visitor.visitFunctionCall(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IdentifierSuffixContext extends ParserRuleContext {
	public LSQUARE(): TerminalNode { return this.getToken(mcfppParser.LSQUARE, 0); }
	public conditionalExpression(): ConditionalExpressionContext | undefined {
		return this.tryGetRuleContext(0, ConditionalExpressionContext);
	}
	public RSQUARE(): TerminalNode { return this.getToken(mcfppParser.RSQUARE, 0); }
	public objectInitializer(): ObjectInitializerContext[];
	public objectInitializer(i: number): ObjectInitializerContext;
	public objectInitializer(i?: number): ObjectInitializerContext | ObjectInitializerContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ObjectInitializerContext);
		} else {
			return this.getRuleContext(i, ObjectInitializerContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_identifierSuffix; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterIdentifierSuffix) {
			listener.enterIdentifierSuffix(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitIdentifierSuffix) {
			listener.exitIdentifierSuffix(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitIdentifierSuffix) {
			return visitor.visitIdentifierSuffix(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ObjectInitializerContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public ASSIGNMENT(): TerminalNode { return this.getToken(mcfppParser.ASSIGNMENT, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_objectInitializer; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterObjectInitializer) {
			listener.enterObjectInitializer(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitObjectInitializer) {
			listener.exitObjectInitializer(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitObjectInitializer) {
			return visitor.visitObjectInitializer(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SelectorContext extends ParserRuleContext {
	public DOT(): TerminalNode { return this.getToken(mcfppParser.DOT, 0); }
	public var(): VarContext {
		return this.getRuleContext(0, VarContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_selector; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterSelector) {
			listener.enterSelector(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitSelector) {
			listener.exitSelector(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitSelector) {
			return visitor.visitSelector(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ArgumentsContext extends ParserRuleContext {
	public normalArgs(): NormalArgsContext {
		return this.getRuleContext(0, NormalArgsContext);
	}
	public readOnlyArgs(): ReadOnlyArgsContext | undefined {
		return this.tryGetRuleContext(0, ReadOnlyArgsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_arguments; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterArguments) {
			listener.enterArguments(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitArguments) {
			listener.exitArguments(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitArguments) {
			return visitor.visitArguments(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReadOnlyArgsContext extends ParserRuleContext {
	public LANGLE(): TerminalNode { return this.getToken(mcfppParser.LANGLE, 0); }
	public RANGLE(): TerminalNode { return this.getToken(mcfppParser.RANGLE, 0); }
	public expressionList(): ExpressionListContext | undefined {
		return this.tryGetRuleContext(0, ExpressionListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_readOnlyArgs; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterReadOnlyArgs) {
			listener.enterReadOnlyArgs(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitReadOnlyArgs) {
			listener.exitReadOnlyArgs(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitReadOnlyArgs) {
			return visitor.visitReadOnlyArgs(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NormalArgsContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(mcfppParser.LPAREN, 0); }
	public RPAREN(): TerminalNode { return this.getToken(mcfppParser.RPAREN, 0); }
	public expressionList(): ExpressionListContext | undefined {
		return this.tryGetRuleContext(0, ExpressionListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_normalArgs; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNormalArgs) {
			listener.enterNormalArgs(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNormalArgs) {
			listener.exitNormalArgs(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNormalArgs) {
			return visitor.visitNormalArgs(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionBodyContext extends ParserRuleContext {
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_functionBody; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterFunctionBody) {
			listener.enterFunctionBody(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitFunctionBody) {
			listener.exitFunctionBody(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitFunctionBody) {
			return visitor.visitFunctionBody(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class StatementContext extends ParserRuleContext {
	public fieldDeclaration(): FieldDeclarationContext | undefined {
		return this.tryGetRuleContext(0, FieldDeclarationContext);
	}
	public SEMICOLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SEMICOLON, 0); }
	public statementExpression(): StatementExpressionContext | undefined {
		return this.tryGetRuleContext(0, StatementExpressionContext);
	}
	public ifStatement(): IfStatementContext | undefined {
		return this.tryGetRuleContext(0, IfStatementContext);
	}
	public whileStatement(): WhileStatementContext | undefined {
		return this.tryGetRuleContext(0, WhileStatementContext);
	}
	public doWhileStatement(): DoWhileStatementContext | undefined {
		return this.tryGetRuleContext(0, DoWhileStatementContext);
	}
	public selfAddOrMinusStatement(): SelfAddOrMinusStatementContext | undefined {
		return this.tryGetRuleContext(0, SelfAddOrMinusStatementContext);
	}
	public tryStoreStatement(): TryStoreStatementContext | undefined {
		return this.tryGetRuleContext(0, TryStoreStatementContext);
	}
	public controlStatement(): ControlStatementContext | undefined {
		return this.tryGetRuleContext(0, ControlStatementContext);
	}
	public orgCommand(): OrgCommandContext | undefined {
		return this.tryGetRuleContext(0, OrgCommandContext);
	}
	public returnStatement(): ReturnStatementContext | undefined {
		return this.tryGetRuleContext(0, ReturnStatementContext);
	}
	public executeStatement(): ExecuteStatementContext | undefined {
		return this.tryGetRuleContext(0, ExecuteStatementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_statement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterStatement) {
			listener.enterStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitStatement) {
			listener.exitStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitStatement) {
			return visitor.visitStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExecuteStatementContext extends ParserRuleContext {
	public EXECUTE(): TerminalNode { return this.getToken(mcfppParser.EXECUTE, 0); }
	public LPAREN(): TerminalNode { return this.getToken(mcfppParser.LPAREN, 0); }
	public executeContext(): ExecuteContextContext[];
	public executeContext(i: number): ExecuteContextContext;
	public executeContext(i?: number): ExecuteContextContext | ExecuteContextContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExecuteContextContext);
		} else {
			return this.getRuleContext(i, ExecuteContextContext);
		}
	}
	public RPAREN(): TerminalNode { return this.getToken(mcfppParser.RPAREN, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_executeStatement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterExecuteStatement) {
			listener.enterExecuteStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitExecuteStatement) {
			listener.exitExecuteStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitExecuteStatement) {
			return visitor.visitExecuteStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExecuteContextContext extends ParserRuleContext {
	public executeExpression(): ExecuteExpressionContext {
		return this.getRuleContext(0, ExecuteExpressionContext);
	}
	public ASSIGNMENT(): TerminalNode { return this.getToken(mcfppParser.ASSIGNMENT, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_executeContext; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterExecuteContext) {
			listener.enterExecuteContext(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitExecuteContext) {
			listener.exitExecuteContext(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitExecuteContext) {
			return visitor.visitExecuteContext(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExecuteExpressionContext extends ParserRuleContext {
	public var(): VarContext[];
	public var(i: number): VarContext;
	public var(i?: number): VarContext | VarContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VarContext);
		} else {
			return this.getRuleContext(i, VarContext);
		}
	}
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.DOT);
		} else {
			return this.getToken(mcfppParser.DOT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_executeExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterExecuteExpression) {
			listener.enterExecuteExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitExecuteExpression) {
			listener.exitExecuteExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitExecuteExpression) {
			return visitor.visitExecuteExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OrgCommandContext extends ParserRuleContext {
	public DIV(): TerminalNode { return this.getToken(mcfppParser.DIV, 0); }
	public OrgCommandEnd(): TerminalNode { return this.getToken(mcfppParser.OrgCommandEnd, 0); }
	public orgCommandContent(): OrgCommandContentContext[];
	public orgCommandContent(i: number): OrgCommandContentContext;
	public orgCommandContent(i?: number): OrgCommandContentContext | OrgCommandContentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(OrgCommandContentContext);
		} else {
			return this.getRuleContext(i, OrgCommandContentContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_orgCommand; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterOrgCommand) {
			listener.enterOrgCommand(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitOrgCommand) {
			listener.exitOrgCommand(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitOrgCommand) {
			return visitor.visitOrgCommand(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OrgCommandContentContext extends ParserRuleContext {
	public orgCommandExpression(): OrgCommandExpressionContext | undefined {
		return this.tryGetRuleContext(0, OrgCommandExpressionContext);
	}
	public OrgCommandText(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.OrgCommandText, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_orgCommandContent; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterOrgCommandContent) {
			listener.enterOrgCommandContent(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitOrgCommandContent) {
			listener.exitOrgCommandContent(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitOrgCommandContent) {
			return visitor.visitOrgCommandContent(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class OrgCommandExpressionContext extends ParserRuleContext {
	public OrgCommandExprStart(): TerminalNode { return this.getToken(mcfppParser.OrgCommandExprStart, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_orgCommandExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterOrgCommandExpression) {
			listener.enterOrgCommandExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitOrgCommandExpression) {
			listener.exitOrgCommandExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitOrgCommandExpression) {
			return visitor.visitOrgCommandExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ControlStatementContext extends ParserRuleContext {
	public BREAK(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.BREAK, 0); }
	public CONTINUE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.CONTINUE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_controlStatement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterControlStatement) {
			listener.enterControlStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitControlStatement) {
			listener.exitControlStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitControlStatement) {
			return visitor.visitControlStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IfStatementContext extends ParserRuleContext {
	public IF(): TerminalNode { return this.getToken(mcfppParser.IF, 0); }
	public LPAREN(): TerminalNode { return this.getToken(mcfppParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(mcfppParser.RPAREN, 0); }
	public ifBlock(): IfBlockContext {
		return this.getRuleContext(0, IfBlockContext);
	}
	public elseIfStatement(): ElseIfStatementContext[];
	public elseIfStatement(i: number): ElseIfStatementContext;
	public elseIfStatement(i?: number): ElseIfStatementContext | ElseIfStatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ElseIfStatementContext);
		} else {
			return this.getRuleContext(i, ElseIfStatementContext);
		}
	}
	public elseStatement(): ElseStatementContext | undefined {
		return this.tryGetRuleContext(0, ElseStatementContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_ifStatement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterIfStatement) {
			listener.enterIfStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitIfStatement) {
			listener.exitIfStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitIfStatement) {
			return visitor.visitIfStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElseIfStatementContext extends ParserRuleContext {
	public ELSE(): TerminalNode { return this.getToken(mcfppParser.ELSE, 0); }
	public IF(): TerminalNode { return this.getToken(mcfppParser.IF, 0); }
	public LPAREN(): TerminalNode { return this.getToken(mcfppParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(mcfppParser.RPAREN, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_elseIfStatement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterElseIfStatement) {
			listener.enterElseIfStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitElseIfStatement) {
			listener.exitElseIfStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitElseIfStatement) {
			return visitor.visitElseIfStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ElseStatementContext extends ParserRuleContext {
	public ELSE(): TerminalNode { return this.getToken(mcfppParser.ELSE, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_elseStatement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterElseStatement) {
			listener.enterElseStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitElseStatement) {
			listener.exitElseStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitElseStatement) {
			return visitor.visitElseStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class IfBlockContext extends ParserRuleContext {
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_ifBlock; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterIfBlock) {
			listener.enterIfBlock(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitIfBlock) {
			listener.exitIfBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitIfBlock) {
			return visitor.visitIfBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class WhileStatementContext extends ParserRuleContext {
	public WHILE(): TerminalNode { return this.getToken(mcfppParser.WHILE, 0); }
	public LPAREN(): TerminalNode { return this.getToken(mcfppParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(mcfppParser.RPAREN, 0); }
	public whileBlock(): WhileBlockContext {
		return this.getRuleContext(0, WhileBlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_whileStatement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterWhileStatement) {
			listener.enterWhileStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitWhileStatement) {
			listener.exitWhileStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitWhileStatement) {
			return visitor.visitWhileStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class WhileBlockContext extends ParserRuleContext {
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_whileBlock; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterWhileBlock) {
			listener.enterWhileBlock(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitWhileBlock) {
			listener.exitWhileBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitWhileBlock) {
			return visitor.visitWhileBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DoWhileStatementContext extends ParserRuleContext {
	public DO(): TerminalNode { return this.getToken(mcfppParser.DO, 0); }
	public doWhileBlock(): DoWhileBlockContext {
		return this.getRuleContext(0, DoWhileBlockContext);
	}
	public WHILE(): TerminalNode { return this.getToken(mcfppParser.WHILE, 0); }
	public LPAREN(): TerminalNode { return this.getToken(mcfppParser.LPAREN, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RPAREN(): TerminalNode { return this.getToken(mcfppParser.RPAREN, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_doWhileStatement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterDoWhileStatement) {
			listener.enterDoWhileStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitDoWhileStatement) {
			listener.exitDoWhileStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitDoWhileStatement) {
			return visitor.visitDoWhileStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class DoWhileBlockContext extends ParserRuleContext {
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_doWhileBlock; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterDoWhileBlock) {
			listener.enterDoWhileBlock(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitDoWhileBlock) {
			listener.exitDoWhileBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitDoWhileBlock) {
			return visitor.visitDoWhileBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SelfAddOrMinusStatementContext extends ParserRuleContext {
	public selfAddOrMinusExpression(): SelfAddOrMinusExpressionContext {
		return this.getRuleContext(0, SelfAddOrMinusExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_selfAddOrMinusStatement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterSelfAddOrMinusStatement) {
			listener.enterSelfAddOrMinusStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitSelfAddOrMinusStatement) {
			listener.exitSelfAddOrMinusStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitSelfAddOrMinusStatement) {
			return visitor.visitSelfAddOrMinusStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TryStoreStatementContext extends ParserRuleContext {
	public TRY(): TerminalNode { return this.getToken(mcfppParser.TRY, 0); }
	public block(): BlockContext {
		return this.getRuleContext(0, BlockContext);
	}
	public STORE(): TerminalNode { return this.getToken(mcfppParser.STORE, 0); }
	public LPAREN(): TerminalNode { return this.getToken(mcfppParser.LPAREN, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public RPAREN(): TerminalNode { return this.getToken(mcfppParser.RPAREN, 0); }
	public SEMICOLON(): TerminalNode { return this.getToken(mcfppParser.SEMICOLON, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_tryStoreStatement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTryStoreStatement) {
			listener.enterTryStoreStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTryStoreStatement) {
			listener.exitTryStoreStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTryStoreStatement) {
			return visitor.visitTryStoreStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ReturnStatementContext extends ParserRuleContext {
	public RETURN(): TerminalNode { return this.getToken(mcfppParser.RETURN, 0); }
	public expression(): ExpressionContext | undefined {
		return this.tryGetRuleContext(0, ExpressionContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_returnStatement; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterReturnStatement) {
			listener.enterReturnStatement(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitReturnStatement) {
			listener.exitReturnStatement(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitReturnStatement) {
			return visitor.visitReturnStatement(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class BlockContext extends ParserRuleContext {
	public LCURL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LCURL, 0); }
	public RCURL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.RCURL, 0); }
	public statement(): StatementContext[];
	public statement(i: number): StatementContext;
	public statement(i?: number): StatementContext | StatementContext[] {
		if (i === undefined) {
			return this.getRuleContexts(StatementContext);
		} else {
			return this.getRuleContext(i, StatementContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_block; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterBlock) {
			listener.enterBlock(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitBlock) {
			listener.exitBlock(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitBlock) {
			return visitor.visitBlock(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class SelfAddOrMinusExpressionContext extends ParserRuleContext {
	public _op!: Token;
	public rightVarExpression(): RightVarExpressionContext {
		return this.getRuleContext(0, RightVarExpressionContext);
	}
	public INCR(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.INCR, 0); }
	public DECR(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.DECR, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_selfAddOrMinusExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterSelfAddOrMinusExpression) {
			listener.enterSelfAddOrMinusExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitSelfAddOrMinusExpression) {
			listener.exitSelfAddOrMinusExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitSelfAddOrMinusExpression) {
			return visitor.visitSelfAddOrMinusExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ExpressionListContext extends ParserRuleContext {
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_expressionList; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterExpressionList) {
			listener.enterExpressionList(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitExpressionList) {
			listener.exitExpressionList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitExpressionList) {
			return visitor.visitExpressionList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeContext extends ParserRuleContext {
	public typeWithoutExcl(): TypeWithoutExclContext {
		return this.getRuleContext(0, TypeWithoutExclContext);
	}
	public EXCL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.EXCL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_type; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterType) {
			listener.enterType(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitType) {
			listener.exitType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitType) {
			return visitor.visitType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeWithoutExclContext extends ParserRuleContext {
	public normalType(): NormalTypeContext | undefined {
		return this.tryGetRuleContext(0, NormalTypeContext);
	}
	public VecType(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.VecType, 0); }
	public LIST(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LIST, 0); }
	public LANGLE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LANGLE, 0); }
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	public RANGLE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.RANGLE, 0); }
	public MAP(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.MAP, 0); }
	public DICT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.DICT, 0); }
	public ENTITY(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ENTITY, 0); }
	public nbtInt(): NbtIntContext | undefined {
		return this.tryGetRuleContext(0, NbtIntContext);
	}
	public LineString(): TerminalNode[];
	public LineString(i: number): TerminalNode;
	public LineString(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.LineString);
		} else {
			return this.getToken(mcfppParser.LineString, i);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	public className(): ClassNameContext | undefined {
		return this.tryGetRuleContext(0, ClassNameContext);
	}
	public readOnlyArgs(): ReadOnlyArgsContext | undefined {
		return this.tryGetRuleContext(0, ReadOnlyArgsContext);
	}
	public Identifier(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.Identifier, 0); }
	public unionTemplateType(): UnionTemplateTypeContext | undefined {
		return this.tryGetRuleContext(0, UnionTemplateTypeContext);
	}
	public anonymousTemplateType(): AnonymousTemplateTypeContext | undefined {
		return this.tryGetRuleContext(0, AnonymousTemplateTypeContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_typeWithoutExcl; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTypeWithoutExcl) {
			listener.enterTypeWithoutExcl(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTypeWithoutExcl) {
			listener.exitTypeWithoutExcl(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTypeWithoutExcl) {
			return visitor.visitTypeWithoutExcl(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnonymousTemplateTypeContext extends ParserRuleContext {
	public DATA(): TerminalNode { return this.getToken(mcfppParser.DATA, 0); }
	public templateBody(): TemplateBodyContext {
		return this.getRuleContext(0, TemplateBodyContext);
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.COLON, 0); }
	public className(): ClassNameContext[];
	public className(i: number): ClassNameContext;
	public className(i?: number): ClassNameContext | ClassNameContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ClassNameContext);
		} else {
			return this.getRuleContext(i, ClassNameContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_anonymousTemplateType; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterAnonymousTemplateType) {
			listener.enterAnonymousTemplateType(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitAnonymousTemplateType) {
			listener.exitAnonymousTemplateType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitAnonymousTemplateType) {
			return visitor.visitAnonymousTemplateType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class UnionTemplateTypeContext extends ParserRuleContext {
	public LPAREN(): TerminalNode { return this.getToken(mcfppParser.LPAREN, 0); }
	public type(): TypeContext[];
	public type(i: number): TypeContext;
	public type(i?: number): TypeContext | TypeContext[] {
		if (i === undefined) {
			return this.getRuleContexts(TypeContext);
		} else {
			return this.getRuleContext(i, TypeContext);
		}
	}
	public RPAREN(): TerminalNode { return this.getToken(mcfppParser.RPAREN, 0); }
	public UNION(): TerminalNode[];
	public UNION(i: number): TerminalNode;
	public UNION(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.UNION);
		} else {
			return this.getToken(mcfppParser.UNION, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_unionTemplateType; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterUnionTemplateType) {
			listener.enterUnionTemplateType(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitUnionTemplateType) {
			listener.exitUnionTemplateType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitUnionTemplateType) {
			return visitor.visitUnionTemplateType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NormalTypeContext extends ParserRuleContext {
	public INT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.INT, 0); }
	public ENTITY(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ENTITY, 0); }
	public BOOL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.BOOL, 0); }
	public BYTE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.BYTE, 0); }
	public SHORT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SHORT, 0); }
	public LONG(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LONG, 0); }
	public FLOAT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.FLOAT, 0); }
	public DOUBLE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.DOUBLE, 0); }
	public SELECTOR(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.SELECTOR, 0); }
	public STRING(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.STRING, 0); }
	public JTEXT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.JTEXT, 0); }
	public NBT(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.NBT, 0); }
	public TYPE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.TYPE, 0); }
	public ANY(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.ANY, 0); }
	public BYTEARRAY(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.BYTEARRAY, 0); }
	public INTARRAY(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.INTARRAY, 0); }
	public LONGARRAY(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LONGARRAY, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_normalType; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNormalType) {
			listener.enterNormalType(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNormalType) {
			listener.exitNormalType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNormalType) {
			return visitor.visitNormalType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class FunctionReturnTypeContext extends ParserRuleContext {
	public type(): TypeContext | undefined {
		return this.tryGetRuleContext(0, TypeContext);
	}
	public VOID(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.VOID, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_functionReturnType; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterFunctionReturnType) {
			listener.enterFunctionReturnType(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitFunctionReturnType) {
			listener.exitFunctionReturnType(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitFunctionReturnType) {
			return visitor.visitFunctionReturnType(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ValueContext extends ParserRuleContext {
	public coordinate(): CoordinateContext | undefined {
		return this.tryGetRuleContext(0, CoordinateContext);
	}
	public LineString(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LineString, 0); }
	public multiLineStringLiteral(): MultiLineStringLiteralContext | undefined {
		return this.tryGetRuleContext(0, MultiLineStringLiteralContext);
	}
	public nbtValue(): NbtValueContext | undefined {
		return this.tryGetRuleContext(0, NbtValueContext);
	}
	public TargetSelector(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.TargetSelector, 0); }
	public NULL(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.NULL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_value; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterValue) {
			listener.enterValue(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitValue) {
			listener.exitValue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitValue) {
			return visitor.visitValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CoordinateContext extends ParserRuleContext {
	public coordinateDimension(): CoordinateDimensionContext[];
	public coordinateDimension(i: number): CoordinateDimensionContext;
	public coordinateDimension(i?: number): CoordinateDimensionContext | CoordinateDimensionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(CoordinateDimensionContext);
		} else {
			return this.getRuleContext(i, CoordinateDimensionContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_coordinate; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterCoordinate) {
			listener.enterCoordinate(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitCoordinate) {
			listener.exitCoordinate(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitCoordinate) {
			return visitor.visitCoordinate(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class CoordinateDimensionContext extends ParserRuleContext {
	public RelativeValue(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.RelativeValue, 0); }
	public nbtInt(): NbtIntContext | undefined {
		return this.tryGetRuleContext(0, NbtIntContext);
	}
	public nbtFloat(): NbtFloatContext | undefined {
		return this.tryGetRuleContext(0, NbtFloatContext);
	}
	public nbtDouble(): NbtDoubleContext | undefined {
		return this.tryGetRuleContext(0, NbtDoubleContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_coordinateDimension; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterCoordinateDimension) {
			listener.enterCoordinateDimension(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitCoordinateDimension) {
			listener.exitCoordinateDimension(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitCoordinateDimension) {
			return visitor.visitCoordinateDimension(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassNameContext extends ParserRuleContext {
	public classWithoutNamespace(): ClassWithoutNamespaceContext {
		return this.getRuleContext(0, ClassWithoutNamespaceContext);
	}
	public Identifier(): TerminalNode[];
	public Identifier(i: number): TerminalNode;
	public Identifier(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.Identifier);
		} else {
			return this.getToken(mcfppParser.Identifier, i);
		}
	}
	public COLON(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.COLON, 0); }
	public DOT(): TerminalNode[];
	public DOT(i: number): TerminalNode;
	public DOT(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.DOT);
		} else {
			return this.getToken(mcfppParser.DOT, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_className; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterClassName) {
			listener.enterClassName(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitClassName) {
			listener.exitClassName(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitClassName) {
			return visitor.visitClassName(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class TypeListContext extends ParserRuleContext {
	public LANGLE(): TerminalNode { return this.getToken(mcfppParser.LANGLE, 0); }
	public RANGLE(): TerminalNode { return this.getToken(mcfppParser.RANGLE, 0); }
	public typeList(): TypeListContext | undefined {
		return this.tryGetRuleContext(0, TypeListContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_typeList; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterTypeList) {
			listener.enterTypeList(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitTypeList) {
			listener.exitTypeList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitTypeList) {
			return visitor.visitTypeList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class ClassWithoutNamespaceContext extends ParserRuleContext {
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_classWithoutNamespace; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterClassWithoutNamespace) {
			listener.enterClassWithoutNamespace(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitClassWithoutNamespace) {
			listener.exitClassWithoutNamespace(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitClassWithoutNamespace) {
			return visitor.visitClassWithoutNamespace(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationContext extends ParserRuleContext {
	public _id!: Token;
	public AT(): TerminalNode { return this.getToken(mcfppParser.AT, 0); }
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	public annotationArgs(): AnnotationArgsContext | undefined {
		return this.tryGetRuleContext(0, AnnotationArgsContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_annotation; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterAnnotation) {
			listener.enterAnnotation(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitAnnotation) {
			listener.exitAnnotation(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitAnnotation) {
			return visitor.visitAnnotation(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class AnnotationArgsContext extends ParserRuleContext {
	public LANGLE(): TerminalNode { return this.getToken(mcfppParser.LANGLE, 0); }
	public RANGLE(): TerminalNode { return this.getToken(mcfppParser.RANGLE, 0); }
	public value(): ValueContext[];
	public value(i: number): ValueContext;
	public value(i?: number): ValueContext | ValueContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ValueContext);
		} else {
			return this.getRuleContext(i, ValueContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_annotationArgs; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterAnnotationArgs) {
			listener.enterAnnotationArgs(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitAnnotationArgs) {
			listener.exitAnnotationArgs(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitAnnotationArgs) {
			return visitor.visitAnnotationArgs(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class RangeContext extends ParserRuleContext {
	public _num1!: VarContext;
	public _num2!: VarContext;
	public RANGE(): TerminalNode { return this.getToken(mcfppParser.RANGE, 0); }
	public var(): VarContext[];
	public var(i: number): VarContext;
	public var(i?: number): VarContext | VarContext[] {
		if (i === undefined) {
			return this.getRuleContexts(VarContext);
		} else {
			return this.getRuleContext(i, VarContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_range; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterRange) {
			listener.enterRange(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitRange) {
			listener.exitRange(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitRange) {
			return visitor.visitRange(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtValueContext extends ParserRuleContext {
	public LineString(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.LineString, 0); }
	public nbtBool(): NbtBoolContext | undefined {
		return this.tryGetRuleContext(0, NbtBoolContext);
	}
	public nbtByte(): NbtByteContext | undefined {
		return this.tryGetRuleContext(0, NbtByteContext);
	}
	public nbtShort(): NbtShortContext | undefined {
		return this.tryGetRuleContext(0, NbtShortContext);
	}
	public nbtInt(): NbtIntContext | undefined {
		return this.tryGetRuleContext(0, NbtIntContext);
	}
	public nbtLong(): NbtLongContext | undefined {
		return this.tryGetRuleContext(0, NbtLongContext);
	}
	public nbtFloat(): NbtFloatContext | undefined {
		return this.tryGetRuleContext(0, NbtFloatContext);
	}
	public nbtDouble(): NbtDoubleContext | undefined {
		return this.tryGetRuleContext(0, NbtDoubleContext);
	}
	public nbtCompound(): NbtCompoundContext | undefined {
		return this.tryGetRuleContext(0, NbtCompoundContext);
	}
	public nbtList(): NbtListContext | undefined {
		return this.tryGetRuleContext(0, NbtListContext);
	}
	public nbtByteArray(): NbtByteArrayContext | undefined {
		return this.tryGetRuleContext(0, NbtByteArrayContext);
	}
	public nbtIntArray(): NbtIntArrayContext | undefined {
		return this.tryGetRuleContext(0, NbtIntArrayContext);
	}
	public nbtLongArray(): NbtLongArrayContext | undefined {
		return this.tryGetRuleContext(0, NbtLongArrayContext);
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtValue; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtValue) {
			listener.enterNbtValue(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtValue) {
			listener.exitNbtValue(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtValue) {
			return visitor.visitNbtValue(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtByteContext extends ParserRuleContext {
	public NBTByte(): TerminalNode { return this.getToken(mcfppParser.NBTByte, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtByte; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtByte) {
			listener.enterNbtByte(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtByte) {
			listener.exitNbtByte(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtByte) {
			return visitor.visitNbtByte(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtShortContext extends ParserRuleContext {
	public NBTShort(): TerminalNode { return this.getToken(mcfppParser.NBTShort, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtShort; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtShort) {
			listener.enterNbtShort(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtShort) {
			listener.exitNbtShort(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtShort) {
			return visitor.visitNbtShort(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtIntContext extends ParserRuleContext {
	public NBTInt(): TerminalNode { return this.getToken(mcfppParser.NBTInt, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtInt; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtInt) {
			listener.enterNbtInt(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtInt) {
			listener.exitNbtInt(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtInt) {
			return visitor.visitNbtInt(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtLongContext extends ParserRuleContext {
	public NBTLong(): TerminalNode { return this.getToken(mcfppParser.NBTLong, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtLong; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtLong) {
			listener.enterNbtLong(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtLong) {
			listener.exitNbtLong(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtLong) {
			return visitor.visitNbtLong(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtFloatContext extends ParserRuleContext {
	public NBTFloat(): TerminalNode { return this.getToken(mcfppParser.NBTFloat, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtFloat; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtFloat) {
			listener.enterNbtFloat(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtFloat) {
			listener.exitNbtFloat(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtFloat) {
			return visitor.visitNbtFloat(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtDoubleContext extends ParserRuleContext {
	public NBTDouble(): TerminalNode { return this.getToken(mcfppParser.NBTDouble, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtDouble; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtDouble) {
			listener.enterNbtDouble(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtDouble) {
			listener.exitNbtDouble(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtDouble) {
			return visitor.visitNbtDouble(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtBoolContext extends ParserRuleContext {
	public TRUE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.TRUE, 0); }
	public FALSE(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.FALSE, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtBool; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtBool) {
			listener.enterNbtBool(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtBool) {
			listener.exitNbtBool(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtBool) {
			return visitor.visitNbtBool(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtByteArrayContext extends ParserRuleContext {
	public NBT_BYTE_ARRAY_BEGIN(): TerminalNode { return this.getToken(mcfppParser.NBT_BYTE_ARRAY_BEGIN, 0); }
	public nbtByte(): NbtByteContext[];
	public nbtByte(i: number): NbtByteContext;
	public nbtByte(i?: number): NbtByteContext | NbtByteContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NbtByteContext);
		} else {
			return this.getRuleContext(i, NbtByteContext);
		}
	}
	public RSQUARE(): TerminalNode { return this.getToken(mcfppParser.RSQUARE, 0); }
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtByteArray; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtByteArray) {
			listener.enterNbtByteArray(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtByteArray) {
			listener.exitNbtByteArray(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtByteArray) {
			return visitor.visitNbtByteArray(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtIntArrayContext extends ParserRuleContext {
	public NBT_INT_ARRAY_BEGIN(): TerminalNode { return this.getToken(mcfppParser.NBT_INT_ARRAY_BEGIN, 0); }
	public nbtInt(): NbtIntContext[];
	public nbtInt(i: number): NbtIntContext;
	public nbtInt(i?: number): NbtIntContext | NbtIntContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NbtIntContext);
		} else {
			return this.getRuleContext(i, NbtIntContext);
		}
	}
	public RSQUARE(): TerminalNode { return this.getToken(mcfppParser.RSQUARE, 0); }
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtIntArray; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtIntArray) {
			listener.enterNbtIntArray(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtIntArray) {
			listener.exitNbtIntArray(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtIntArray) {
			return visitor.visitNbtIntArray(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtLongArrayContext extends ParserRuleContext {
	public NBT_LONG_ARRAY_BEGIN(): TerminalNode { return this.getToken(mcfppParser.NBT_LONG_ARRAY_BEGIN, 0); }
	public nbtLong(): NbtLongContext[];
	public nbtLong(i: number): NbtLongContext;
	public nbtLong(i?: number): NbtLongContext | NbtLongContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NbtLongContext);
		} else {
			return this.getRuleContext(i, NbtLongContext);
		}
	}
	public RSQUARE(): TerminalNode { return this.getToken(mcfppParser.RSQUARE, 0); }
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtLongArray; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtLongArray) {
			listener.enterNbtLongArray(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtLongArray) {
			listener.exitNbtLongArray(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtLongArray) {
			return visitor.visitNbtLongArray(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtListContext extends ParserRuleContext {
	public LSQUARE(): TerminalNode { return this.getToken(mcfppParser.LSQUARE, 0); }
	public RSQUARE(): TerminalNode { return this.getToken(mcfppParser.RSQUARE, 0); }
	public expression(): ExpressionContext[];
	public expression(i: number): ExpressionContext;
	public expression(i?: number): ExpressionContext | ExpressionContext[] {
		if (i === undefined) {
			return this.getRuleContexts(ExpressionContext);
		} else {
			return this.getRuleContext(i, ExpressionContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtList; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtList) {
			listener.enterNbtList(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtList) {
			listener.exitNbtList(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtList) {
			return visitor.visitNbtList(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtKeyValuePairContext extends ParserRuleContext {
	public _key!: Token;
	public COLON(): TerminalNode { return this.getToken(mcfppParser.COLON, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public Identifier(): TerminalNode { return this.getToken(mcfppParser.Identifier, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtKeyValuePair; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtKeyValuePair) {
			listener.enterNbtKeyValuePair(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtKeyValuePair) {
			listener.exitNbtKeyValuePair(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtKeyValuePair) {
			return visitor.visitNbtKeyValuePair(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class NbtCompoundContext extends ParserRuleContext {
	public LCURL(): TerminalNode { return this.getToken(mcfppParser.LCURL, 0); }
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	public nbtKeyValuePair(): NbtKeyValuePairContext[];
	public nbtKeyValuePair(i: number): NbtKeyValuePairContext;
	public nbtKeyValuePair(i?: number): NbtKeyValuePairContext | NbtKeyValuePairContext[] {
		if (i === undefined) {
			return this.getRuleContexts(NbtKeyValuePairContext);
		} else {
			return this.getRuleContext(i, NbtKeyValuePairContext);
		}
	}
	public COMMA(): TerminalNode[];
	public COMMA(i: number): TerminalNode;
	public COMMA(i?: number): TerminalNode | TerminalNode[] {
		if (i === undefined) {
			return this.getTokens(mcfppParser.COMMA);
		} else {
			return this.getToken(mcfppParser.COMMA, i);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_nbtCompound; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterNbtCompound) {
			listener.enterNbtCompound(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitNbtCompound) {
			listener.exitNbtCompound(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitNbtCompound) {
			return visitor.visitNbtCompound(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiLineStringLiteralContext extends ParserRuleContext {
	public TRIPLE_QUOTE_OPEN(): TerminalNode { return this.getToken(mcfppParser.TRIPLE_QUOTE_OPEN, 0); }
	public TRIPLE_QUOTE_CLOSE(): TerminalNode { return this.getToken(mcfppParser.TRIPLE_QUOTE_CLOSE, 0); }
	public multiLineStringContent(): MultiLineStringContentContext[];
	public multiLineStringContent(i: number): MultiLineStringContentContext;
	public multiLineStringContent(i?: number): MultiLineStringContentContext | MultiLineStringContentContext[] {
		if (i === undefined) {
			return this.getRuleContexts(MultiLineStringContentContext);
		} else {
			return this.getRuleContext(i, MultiLineStringContentContext);
		}
	}
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_multiLineStringLiteral; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterMultiLineStringLiteral) {
			listener.enterMultiLineStringLiteral(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitMultiLineStringLiteral) {
			listener.exitMultiLineStringLiteral(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitMultiLineStringLiteral) {
			return visitor.visitMultiLineStringLiteral(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiLineStringContentContext extends ParserRuleContext {
	public multiLineStringExpression(): MultiLineStringExpressionContext | undefined {
		return this.tryGetRuleContext(0, MultiLineStringExpressionContext);
	}
	public MultiLineStrText(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.MultiLineStrText, 0); }
	public MultiLineStringQuote(): TerminalNode | undefined { return this.tryGetToken(mcfppParser.MultiLineStringQuote, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_multiLineStringContent; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterMultiLineStringContent) {
			listener.enterMultiLineStringContent(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitMultiLineStringContent) {
			listener.exitMultiLineStringContent(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitMultiLineStringContent) {
			return visitor.visitMultiLineStringContent(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class MultiLineStringExpressionContext extends ParserRuleContext {
	public MultiLineStrExprStart(): TerminalNode { return this.getToken(mcfppParser.MultiLineStrExprStart, 0); }
	public expression(): ExpressionContext {
		return this.getRuleContext(0, ExpressionContext);
	}
	public RCURL(): TerminalNode { return this.getToken(mcfppParser.RCURL, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_multiLineStringExpression; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterMultiLineStringExpression) {
			listener.enterMultiLineStringExpression(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitMultiLineStringExpression) {
			listener.exitMultiLineStringExpression(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitMultiLineStringExpression) {
			return visitor.visitMultiLineStringExpression(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


export class Doc_commentContext extends ParserRuleContext {
	public DOC_COMMENT(): TerminalNode { return this.getToken(mcfppParser.DOC_COMMENT, 0); }
	constructor(parent: ParserRuleContext | undefined, invokingState: number) {
		super(parent, invokingState);
	}
	// @Override
	public get ruleIndex(): number { return mcfppParser.RULE_doc_comment; }
	// @Override
	public enterRule(listener: mcfppParserListener): void {
		if (listener.enterDoc_comment) {
			listener.enterDoc_comment(this);
		}
	}
	// @Override
	public exitRule(listener: mcfppParserListener): void {
		if (listener.exitDoc_comment) {
			listener.exitDoc_comment(this);
		}
	}
	// @Override
	public accept<Result>(visitor: mcfppParserVisitor<Result>): Result {
		if (visitor.visitDoc_comment) {
			return visitor.visitDoc_comment(this);
		} else {
			return visitor.visitChildren(this);
		}
	}
}


