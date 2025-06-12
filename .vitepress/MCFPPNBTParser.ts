import {
    CompilationUnitContext,
    mcfppParser,
    SingleTemplateFieldTypeContext,
    TemplateDeclarationContext,
    TemplateFieldDeclarationContext,
    TemplateTypeContext,
    UnionTemplateFieldTypeContext
} from './antlr/mcfppParser';
import {mcfppLexer} from './antlr/mcfppLexer'
import {mcfppParserVisitor} from './antlr/mcfppParserVisitor'
import {AbstractParseTreeVisitor} from 'antlr4ts/tree/AbstractParseTreeVisitor';
import {CharStream, CharStreams, CommonTokenStream, ParserRuleContext} from 'antlr4ts'
import {NBT, NBTType} from './NBTStructure';
import {Interval} from 'antlr4ts/misc/Interval';
import * as fs from 'fs'

//读取resources\nbt下的所有mcfpp代码文件
const files = fs.readdirSync('resources/nbt');
files.forEach(file => {
    if(file.endsWith(".mcfpp")){
        compile(file)
    }
})

/**
 * 编译一个mcfpp代码文件
 * @param path 相对于resources\nbt的路径
 */
function compile(path: string){
    const code = fs.readFileSync('resources/nbt/' + path, 'utf-8');
    //获取命名空间
    const index = path.lastIndexOf("/");
    const namespace = path.substring(0, index).replace("/", ".");
    //编译
    const tokens = new CommonTokenStream(new mcfppLexer(CharStreams.fromString(code)));
    const parser = new mcfppParser(tokens);
    const nbts = new MCFPPNBTParser(namespace).visit(parser.compilationUnit());
    //生成json文本
    nbts.array.forEach((nbt: NBT) => {
        const jsonString = JSON.stringify(nbt.toJSON())
        fs.writeFileSync('resources/nbt/' + path, jsonString)
    });
}

class MCFPPNBTParser extends AbstractParseTreeVisitor<any> implements mcfppParserVisitor<any> {

    public static path: string = ""

    public namespace: string

    constructor(namespace: string){
        super()
        this.namespace = namespace
    }

    protected defaultResult() {
        return 0
    }

    visitCompilationUnit(ctx: CompilationUnitContext): any{
        const result: NBT[] = [];
        ctx.typeDeclaration().forEach(typeDecl => {
            const templateDecl = typeDecl.declarations().templateDeclaration();
            if (templateDecl) {
                result.push(this.visitTemplateDeclaration(templateDecl))
            }
        })
        return result
    }

    private currNBT: NBT;
    visitTemplateDeclaration(ctx: TemplateDeclarationContext): any {
        this.currNBT = new NBT();
        this.currNBT.name = ctx.classWithoutNamespace().text;
        ctx.className().forEach(className => {
            const qwq = className.text;
            if(!this.currNBT.extends.has(className.text)){
                this.currNBT.extends.add(qwq)
            }
        })
        ctx.templateBody()?.templateMemberDeclaration().forEach(member => {
            if(member instanceof TemplateFieldDeclarationContext){
                this.currNBT.children.push(this.visitTemplateFieldDeclaration(member))
            }
        })
        return this.currNBT
    }

    visitTemplateFieldDeclaration(ctx: TemplateFieldDeclarationContext): any {
        if (!this.currNBT) {
            throw new Error('Current NBT is not set');
        }
        const qwq = new NBT();
        qwq.name = ctx.Identifier().text;
        if(!ctx.templateType()){
            error("NBT type is not set", ctx)
            return;
        }
        const pwp = this.visitTemplateType(ctx.templateType()!);
        qwq.type = pwp[0]
        qwq.nullable = pwp[1]
        return qwq
    }

    visitTemplateType(ctx: TemplateTypeContext): any {
        if(ctx.singleTemplateFieldType()){
            return this.visitSingleTemplateFieldType(ctx.singleTemplateFieldType()!)
        }else {
            return this.visitUnionTemplateFieldType(ctx.unionTemplateFieldType()!)
        }
    }

    visitSingleTemplateFieldType(ctx: SingleTemplateFieldTypeContext): any {
        return [[NBT.typeFromString(ctx.type().text)], ctx.QUEST() != null]
    }

    visitUnionTemplateFieldType(ctx: UnionTemplateFieldTypeContext): any {
        const types: NBTType[] = [];
        ctx.type().forEach(type => {
            types.push(NBT.typeFromString(type.text))
        })
        return [types, ctx.QUEST() != null]
    }

}

function error(msg: string, ctx: ParserRuleContext){
        console.error(
            "Error while compiling " +
                    MCFPPNBTParser.path + ">>\n" + msg
                    +  "\n" + getLineInfo(ctx)
        )
}


function getLineInfo(ctx: ParserRuleContext): string {
    let lineText: string;
    let lineNumber: number;
    const startToken = ctx.start;
    const stopToken = ctx.stop;
    if(startToken.tokenSource != null){
        const tokenStream = startToken.tokenSource.inputStream;
        lineNumber = startToken.line;
        const startColumn = startToken.charPositionInLine;
        const stopColumn = stopToken!.charPositionInLine + (stopToken!.text?.length ?? 0);
        // 获取该行的所有文本
        const lineStartIndex = lastIndexOf(tokenStream!, "\n", startToken.startIndex) + 1;
        const lineStopIndex = indexOf(tokenStream!, "\n", startToken.startIndex);
        lineText = tokenStream!.getText(Interval.of(lineStartIndex, lineStopIndex));
        // 构建上下文位置指示
        const indicator = " ".repeat(max(0, startColumn)) + "^" + "~".repeat(max(stopColumn - startColumn - 1, 0));
        if(lineText.endsWith("\n")){
            return  `${lineNumber} | ${lineText}${" ".repeat(lineNumber.toString().length)} | ${indicator}`
        }else{
            return  `${lineNumber} | ${lineText}\n${" ".repeat(lineNumber.toString().length)} | ${indicator}`
        }
    }else{
        lineNumber = startToken.line;
        // 获取该行的所有文本
        lineText = ctx.text;
        // 构建上下文位置指示
        if(lineText.endsWith("\n")){
            return `${lineNumber} | ${lineText}${" ".repeat(lineNumber.toString().length)}`
        }else{
            return `${lineNumber} | ${lineText}\n${" ".repeat(lineNumber.toString().length)}`
        }
    }
}


// 扩展方法：查找字符串在输入流中的索引
function indexOf(stream:  CharStream, char: String, fromIndex: number): number {
    for(let i = fromIndex; i < stream.size; i ++){
        if (stream.getText(Interval.of(i, i)) == char) {
            return i
        }
    }
    return stream.size // 如果找不到，则返回流的末尾
}

function lastIndexOf(stream:  CharStream, char: String, fromIndex: number): number {
    for (let i = fromIndex; i >= 0; i--) {
        if (stream.getText(Interval.of(i, i)) == char) {
            return i
        }
    }
    return -1 // 如果找不到，则返回-1
}

function max(a: number, b: number): number {
    return a > b? a: b;
}


