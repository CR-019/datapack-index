/*
 [The "BSD licence"]
 Copyright (c) 2016 Pascal Gruen
 All rights reserved.

 Redistribution and use in source and binary forms, with or without
 modification, are permitted provided that the following conditions
 are met:
 1. Redistributions of source code must retain the above copyright
    notice, this list of conditions and the following disclaimer.
 2. Redistributions in binary form must reproduce the above copyright
    notice, this list of conditions and the following disclaimer in the
    documentation and/or other materials provided with the distribution.
 3. The name of the author may not be used to endorse or promote products
    derived from this software without specific prior written permission.

 THIS SOFTWARE IS PROVIDED BY THE AUTHOR ``AS IS'' AND ANY EXPRESS OR
 IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
 OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
 IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY DIRECT, INDIRECT,
 INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT
 NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE,
 DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY
 THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT
 (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF
 THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
*/

parser grammar mcfppParser;

options {
    tokenVocab = mcfppLexer;
}


//一个mcfpp文件
compilationUnit
    :   namespaceDeclaration?
        importDeclaration*
        typealiasDeclaration*
        //TODO topStatement
        typeDeclaration*
        EOF
    ;

topStatement
    : statement*
    ;

//命名空间声明
namespaceDeclaration
    :   doc_comment? NAMESPACE Identifier (DOT Identifier)* ';'
    ;

importDeclaration
    :   IMPORT importType (AS Identifier)? (FROM Identifier)? ';'
    ;

importType
    :   Identifier (DOT Identifier)* ':' (Identifier|'*')
    ;

typealiasDeclaration
    :   TYPEALIAS Identifier AS type ';'
    ;

//类或函数声明
typeDeclaration
    :   doc_comment? declarations
    ;

//类或函数声明
declarations
    :   classDeclaration
    |   genericClassImplement
    |   objectClassDeclaration
    |   functionDeclaration
    |   inlineFunctionDeclaration
    |   nativeFuncDeclaration
    |   compileTimeFuncDeclaration
    |   compileTimeClassDeclaration
    |   nativeClassDeclaration
    |   templateDeclaration
    |   objectTemplateDeclaration
    |   extensionFunctionDeclaration
    |   interfaceDeclaration
    |   namespaceFieldDeclaration
    |   enumDeclaration
    |   annotation
    ;

//命名空间变量声明
namespaceFieldDeclaration
    :   fieldModifier? type namespaceFieldDeclarationExpression (',' namespaceFieldDeclarationExpression)*
    |   fieldModifier? VAR Identifier '=' value
    ;

namespaceFieldDeclarationExpression
    :   Identifier ( '=' value)?
    ;

//类声明
classDeclaration
    :   STATIC? FINAL? ABSTRACT? CLASS classWithoutNamespace readOnlyParams? (COLON className (',' className)*)? (classBody | ';')
    ;

objectClassDeclaration
    :   FINAL? OBJECT CLASS classWithoutNamespace readOnlyParams? (COLON className (',' className)*)? (classBody | ';')
    ;

compileTimeClassDeclaration
    :   CONST CLASS classWithoutNamespace (COLON className (',' className)*)? classBody
    ;

nativeClassDeclaration
    :   CLASS classWithoutNamespace '=' javaRefer ';'
    ;

classMemberDeclaration
    :   accessModifier? classMember
    ;

classBody
    :   '{' (doc_comment? classMemberDeclaration)* '}'
    ;

//类成员
classMember
    :   classFunctionDeclaration
    |   classFieldDeclaration
    |   classConstructorDeclaration
    |   nativeClassFunctionDeclaration
    |   abstractClassFunctionDeclaration
    |   annotation
    |   operationOverrideDeclaration
    |   nativeOperationOverrideDeclaration
    ;

classFunctionDeclaration
    :   OVERRIDE? FUNCTION Identifier functionParams (ARROW functionReturnType)? '{' functionBody '}'
    ;

abstractClassFunctionDeclaration
    :   OVERRIDE? FUNCTION Identifier functionParams (ARROW functionReturnType)? ';'
    ;

nativeClassFunctionDeclaration
    :   OVERRIDE? FUNCTION Identifier functionParams (ARROW functionReturnType)? '=' javaRefer ';'
    ;

operationOverrideDeclaration
    :   OPERATOR supportOperator functionParams (ARROW functionReturnType)? '{' functionBody '}'
    ;

nativeOperationOverrideDeclaration
    :   OPERATOR supportOperator functionParams (ARROW functionReturnType)? '=' javaRefer ';'
    ;

supportOperator
    :   '+'
    |   '-'
    |   '*'
    |   '/'
    |   '%'
    |   '>'
    |   '<'
    |   '>='
    |   '<='
    |   '=='
    |   '!='
    |   WVEQ
    |   '||'
    |   '&&'
    |   '|'
    |   Identifier
    ;

classFieldDeclaration
    :   accessModifier? Identifier (AS type)? ('=' expression)? accessor? ';'
    ;

accessor
    :   '{' getter? setter? '}'
    ;

getter
    :   GET '{' functionBody '}'
    |   GET '=' javaRefer ';'
    |   GET '=' expression ';'
    |   GET ';'
    ;

setter
    :   SET '{' functionBody '}'
    |   SET '=' javaRefer ';'
    |   SET '=' expression ';'
    |   SET ';'
    ;

genericClassImplement
    :   IMPL STATIC? FINAL? ABSTRACT? CLASS classWithoutNamespace readOnlyArgs (COLON className (',' className)*)? (classBody | ';')
    ;

//数据模板
templateDeclaration
    :   FINAL? DATA classWithoutNamespace readOnlyParams? ((COLON className (',' className)*) | AS type)? (templateBody | ';')
    ;

//数据模板
objectTemplateDeclaration
    :   FINAL? OBJECT DATA classWithoutNamespace readOnlyParams? (COLON className (',' className)*)? ? (templateBody | ';')
    ;

templateBody
    :   '{' (doc_comment? templateMemberDeclaration)* '}'
    ;

templateMemberDeclaration
    :   accessModifier? templateMember
    ;

templateMember
    :   templateFunctionDeclaration
    |   templateFieldDeclaration
    |   templateConstructorDeclaration
    |   operationOverrideDeclaration
    |   nativeOperationOverrideDeclaration
    |   annotation
    ;

templateFunctionDeclaration
    :  OVERRIDE? FUNCTION Identifier functionParams (ARROW functionReturnType)? '{' functionBody '}'
    ;

templateFieldDeclaration
    :   accessModifier? CONST? Identifier (AS templateType)? ('=' expression)? accessor? ';'
    ;

templateType
    :   singleTemplateFieldType | unionTemplateFieldType
    ;

singleTemplateFieldType
    :   type QUEST?
    ;

unionTemplateFieldType
    :   '(' type (PIPE type)* ')' QUEST?
    ;

//接口声明
interfaceDeclaration
    :   INTERFACE classWithoutNamespace (ARROW className (',' className)*)? (interfaceBody | ';')
    ;

interfaceBody
    :   '{'( doc_comment? annotation? interfaceFunctionDeclaration )* '}'
    ;

interfaceFunctionDeclaration
    :   FUNCTION Identifier functionParams (ARROW functionReturnType)? ';'
    ;

compileTimeFuncDeclaration
    :   CONST FUNCTION Identifier functionParams (ARROW functionReturnType)? '{' functionBody '}'
    ;

inlineFunctionDeclaration
    :   INLINE FUNCTION Identifier functionParams (ARROW functionReturnType)? '{' functionBody '}'
    ;

//函数声明
functionDeclaration
    :   FUNCTION Identifier functionParams? (ARROW functionReturnType)? '{' functionBody '}'
    ;

extensionFunctionDeclaration
    :   FUNCTION (type '.')? Identifier functionParams (ARROW functionReturnType)? '{' functionBody '}'
    ;

//枚举
enumDeclaration
    :   ENUM Identifier '{' enumBody '}'
    ;

enumBody
    :   enumMember (',' enumMember)*
    ;

enumMember
    :   Identifier ('=' nbtValue)?
    ;


namespaceID
    : (Identifier ( '.' Identifier)* ':')? Identifier
    ;

nativeFuncDeclaration
    :   FUNCTION Identifier functionParams (ARROW functionReturnType)? '=' javaRefer ';'
    ;

javaRefer
    :   Identifier ('.' Identifier)*
    ;

accessModifier
    :   PRIVATE
    |   PROTECTED
    |   PUBLIC
    ;

//构造函数声明
classConstructorDeclaration
    :   accessModifier? CONSTRUCTOR normalParams '{' functionBody '}'
    ;

//构造函数声明
templateConstructorDeclaration
    :   accessModifier? CONSTRUCTOR normalParams '{' functionBody '}'
    ;

//变量声明
fieldDeclaration
    :   fieldModifier? VAR Identifier (AS type)? ('=' expression)?
    ;

fieldDeclarationExpression
    :   Identifier ( '=' expression)?
    ;

fieldModifier : CONST|DYNAMIC|IMPORT;

functionParams
    :   readOnlyParams? normalParams
    ;

readOnlyParams
    :   '<' parameterList? '>'
    ;

normalParams
    :   '(' parameterList? ')'
    ;

//参数列表
parameterList
    :   parameter (',' parameter)*
    ;

//参数
parameter
    :   STATIC? (Identifier AS)? type ('=' value)?
    ;

//表达式
expression
    :   primary
    |   commonBinaryOperatorExpression
    ;

//能作为语句的表达式
statementExpression
    :   (varWithSelector '=' )? expression
    ;

//条件表达式
conditionalExpression
    :   commonBinaryOperatorExpression ( '?' expression ':' expression )?
    ;

//其他运算符
commonBinaryOperatorExpression
    :   conditionalOrExpression (commonBinaryOperator conditionalOrExpression)*
    ;

commonBinaryOperator: '|' | Identifier;

//或
conditionalOrExpression
    :   conditionalAndExpression ( '||' conditionalAndExpression )*
    ;

//与
conditionalAndExpression
    :   equalityExpression ( '&&' equalityExpression )*
    ;

//等同
equalityExpression
    :   relationalExpression ( op=('==' | '!=' | WVEQ) relationalExpression )?
    ;

//比较关系
relationalExpression
    :   additiveExpression ( relationalOp additiveExpression )?
    ;

//比较关系运算符
relationalOp
    :   '<='
    |   '>='
    |   '<'
    |   '>'
    ;

//加减
additiveExpression
    :   multiplicativeExpression ( op=('+' | '-') multiplicativeExpression )*
    ;

//乘除
multiplicativeExpression
    :   unaryExpression ( op=( '*' | '/' | '%' ) unaryExpression )*
    ;

//一元表达式
unaryExpression
    :   '!' unaryExpression
    |   castExpression
    |   rightVarExpression
    ;

//右侧计算式取出的变量
rightVarExpression
    :   varWithSelector
    ;

//强制类型转换表达式
castExpression
    :  rightVarExpression AS type
    ;

varWithSelector
    : jvmAccessExpression selector*
    ;

jvmAccessExpression
    :   propertyOperator (COLONCOLON Identifier)?
    ;

//字段操作器
propertyOperator
    :   primary ('[' propertyOperatorExpression (',' propertyOperatorExpression)* ']')?
    ;

propertyOperatorExpression
    :   Identifier '=' expression
    ;

//初级表达式
primary
    :   range
    |   value
    |   var
    |   THIS
    |   SUPER
    |   type
    ;

var
    :   bucketExpression
    |   varWithSuffix
    |   functionCall
    ;

bucketExpression
    :   '(' expression ')'
    ;

varWithSuffix
    :   Identifier identifierSuffix*
    ;

functionCall
    :   namespaceID arguments
    ;

identifierSuffix
    :   '[' conditionalExpression ']'
    |   '[' objectInitializer  (',' objectInitializer)* ']'
    |   '[' ']' //empty bucket
    ;

objectInitializer
    :   Identifier '=' expression
    ;

selector
    :   '.' var
    ;

arguments
    :   readOnlyArgs? normalArgs
    ;

readOnlyArgs
    :   '<' expressionList? '>'
    ;

normalArgs
    :   '(' expressionList? ')'
    ;

functionBody
    :   statement*
    ;

statement
    :   fieldDeclaration ';'
    |   statementExpression ';'
    |   ifStatement
    |   whileStatement
    |   doWhileStatement ';'
    |   ';'
    |   selfAddOrMinusStatement ';'
    |   tryStoreStatement
    |   controlStatement ';'
    |   orgCommand
    |   returnStatement ';'
    |   executeStatement
    ;

executeStatement
    :   EXECUTE '(' executeContext (',' executeContext)* ')' block
    ;

executeContext
    :   executeExpression '=' expression
    ;

executeExpression
    :   var ('.' var)*
    ;

orgCommand
    :   DIV orgCommandContent+ OrgCommandEnd
    ;

orgCommandContent
    :   orgCommandExpression
    |   OrgCommandText
    ;

orgCommandExpression
    :   OrgCommandExprStart expression '}'
    ;

controlStatement
    :   BREAK
    |   CONTINUE
    ;

ifStatement
    :   IF'('expression')' ifBlock elseIfStatement* elseStatement?
    ;

elseIfStatement
    :   ELSE IF '('expression')' block
    ;

elseStatement
    :   ELSE block
    ;

ifBlock
    :   block
    ;

whileStatement
    :   WHILE '(' expression ')' whileBlock
    ;

whileBlock
    :   block
    ;

doWhileStatement
    :   DO doWhileBlock WHILE '(' expression ')'
    ;

doWhileBlock
    :   block
    ;

selfAddOrMinusStatement
    :   selfAddOrMinusExpression
    ;

tryStoreStatement
    :   TRY block  STORE '(' Identifier ')' ';'
    ;

returnStatement
    : RETURN expression?
    ;

block
    :   '{' statement* '}'
    |   statement
    ;

selfAddOrMinusExpression
    :   rightVarExpression op = ('++'|'--')
    ;

expressionList
    :   expression (',' expression)*
    ;

type
    :   typeWithoutExcl EXCL?
    ;

typeWithoutExcl
    :   normalType
    |   VecType
    |   LIST '<' type '>'
    |   MAP '<' type '>'
    |   DICT '<' type '>'
    |   ENTITY '<' nbtInt '>'
    |   ENTITY '<' LineString (',' LineString)* '>'
    |   ENTITY '<' nbtInt ',' LineString (',' LineString)* '>'
    |   className readOnlyArgs?
    |   Identifier
    |   unionTemplateType
    |   anonymousTemplateType
    ;

anonymousTemplateType
    :   DATA (COLON className (',' className)*)? templateBody
    ;

unionTemplateType
    :   '(' type (UNION type)* ')'
    ;

normalType
    :   INT
    |   ENTITY
    |   BOOL
    |   BYTE
    |   SHORT
    |   LONG
    |   FLOAT
    |   DOUBLE
    |   SELECTOR
    |   STRING
    |   JTEXT
    |   NBT
    |   TYPE
    |   ANY
    |   BYTEARRAY
    |   INTARRAY
    |   LONGARRAY
    ;

functionReturnType
    :   type
    |   VOID
    ;

value
    :   coordinate
    |   LineString
    |   multiLineStringLiteral
    |   nbtValue
    |   TargetSelector
    |   NULL
    ;

coordinate
    :   coordinateDimension coordinateDimension coordinateDimension?
    ;

coordinateDimension
    :   (RelativeValue | nbtInt | nbtFloat | nbtDouble)
    ;

className
    :   (Identifier ('.' Identifier)* ':')? classWithoutNamespace
    ;

typeList
    :   '<' typeList? '>'
    ;

classWithoutNamespace
    :   Identifier
    ;

annotation
    :   '@' id=Identifier annotationArgs?
    ;

annotationArgs
    :   '<' (value (',' value)*)? '>'
    ;

range
    :   num1=var '..' num2=var
    |   num1=var '..'
    |   '..' num2=var
    ;

nbtValue
    :   LineString
    |   nbtBool
    |   nbtByte
    |   nbtShort
    |   nbtInt
    |   nbtLong
    |   nbtFloat
    |   nbtDouble
    |   nbtCompound
    |   nbtList
    |   nbtByteArray
    |   nbtIntArray
    |   nbtLongArray
    ;

nbtByte: NBTByte;
nbtShort:  NBTShort;
nbtInt:  NBTInt;
nbtLong: NBTLong;
nbtFloat: NBTFloat;
nbtDouble: NBTDouble;
nbtBool: TRUE | FALSE;

nbtByteArray: NBT_BYTE_ARRAY_BEGIN nbtByte (',' nbtByte)* ']';
nbtIntArray: NBT_INT_ARRAY_BEGIN nbtInt (',' nbtInt)* ']';
nbtLongArray: NBT_LONG_ARRAY_BEGIN nbtLong (',' nbtLong)* ']';

nbtList: '[' (expression (',' expression)* )* ']';
nbtKeyValuePair: key=Identifier ':' expression;
nbtCompound: '{'( nbtKeyValuePair (',' nbtKeyValuePair)* )*'}';

multiLineStringLiteral
    : TRIPLE_QUOTE_OPEN multiLineStringContent * TRIPLE_QUOTE_CLOSE
    ;

multiLineStringContent
    : multiLineStringExpression
    | MultiLineStrText
    | MultiLineStringQuote
    ;

multiLineStringExpression
    : MultiLineStrExprStart  expression '}'
    ;
//
// Whitespace and comments
//

doc_comment
    :   DOC_COMMENT
    ;