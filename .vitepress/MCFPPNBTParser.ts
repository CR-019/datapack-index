import {
    AnnotationContext,
    AnonymousTemplateTypeContext,
    CompilationUnitContext,
    mcfppParser,
    SingleTemplateFieldTypeContext,
    TemplateDeclarationContext,
    TemplateFieldDeclarationContext,
    TemplateTypeContext,
    TypeWithoutExclContext,
    UnionTemplateFieldTypeContext
} from './antlr/mcfppParser';
import {mcfppLexer} from './antlr/mcfppLexer'
import {mcfppParserVisitor} from './antlr/mcfppParserVisitor'
import {AbstractParseTreeVisitor} from 'antlr4ts/tree/AbstractParseTreeVisitor';
import {CharStream, CharStreams, CommonTokenStream, ParserRuleContext} from 'antlr4ts'
import {NBT, NBTType} from './NBTStructure';
import {Interval} from 'antlr4ts/misc/Interval';

interface Annotation {
    name: string;
    operation(NBT: NBT): void;
}

class NameAnnotation implements Annotation {
    name: string = "Name";
    value: string
    constructor(value: string) {
        this.value = value;
    }
    operation(nbt: NBT): void { 
        nbt.name = this.value;
    }
}

class DescriptionAnnotation implements Annotation {
    name: string = "Desc";

    value: string
    
    constructor(value: string) {
        this.value =  value;
    }
    
    operation(nbt: NBT): void {
        nbt.description = this.value;
    }
}

class MCFPPNBTParser extends AbstractParseTreeVisitor<any> implements mcfppParserVisitor<any> {

    public namespace: string

    public annotations: Annotation[] = [];

    constructor(namespace: string){
        super()
        this.namespace = namespace
    }

    protected defaultResult() {
        return 0
    }

    visitCompilationUnit(ctx: CompilationUnitContext): any{
        const result: NBT[] = [];
        for(const typeDecl of ctx.typeDeclaration()){
            const templateDecl = typeDecl.declarations().templateDeclaration();
            if (templateDecl) {
                result.push(this.visitTemplateDeclaration(templateDecl))
            }else {
                const anno = typeDecl.declarations().annotation();
                if (anno) {
                    this.visitAnnotation(anno);
                }
            }
        }
        return result
    }

    visitAnnotation(ctx: AnnotationContext): any {
        const name = ctx.Identifier().text;
        const values: string[] = [];
        ctx.annotationArgs()?.value().forEach(value => {
            const val = value.text;
            if(val.startsWith('"') && val.endsWith('"')){
                // 去掉引号
                values.push(val.substring(1, val.length - 1));
            }else if(val.startsWith("'") && val.endsWith("'")){
                // 去掉引号
                values.push(val.substring(1, val.length - 1));
            }else{
                values.push(val)
            }
        });
        let anno : Annotation | null = null;
        switch (name) {
            case "Name":
                if(values.length != 1){
                    error("@Name注解有且只能有一个参数", ctx)
                }
                anno = new NameAnnotation(values[0]);
                break;
            case "Desc":
                if(values.length != 1){
                    error("@Desc注解有且只能有一个参数", ctx)
                }
                anno = new DescriptionAnnotation(values[0]);
                break;
        }
        if(anno){
            this.annotations.push(anno);
        }else {
            console.warn("无效的注解: " + name)
        }
    }

    visitTemplateDeclaration(ctx: TemplateDeclarationContext): any {
        const currNBT = new NBT();
        currNBT.name = ctx.classWithoutNamespace().text;
        for (const className of ctx.className()) {
            let qwq = className.text;
            if(!qwq.includes(":")){
                qwq = this.namespace + ":" + qwq
            }
            if(!currNBT.extends.includes(className.text)){
                currNBT.extends.push(qwq)
            }
        }
        this.annotations.forEach(anno => {
            anno.operation(currNBT);
        })
        this.annotations = []; // 清空注解列表
        for(const member of ctx.templateBody()?.templateMemberDeclaration() || []){
            const qwq = member.templateMember().templateFieldDeclaration();
            if(qwq){
                currNBT.children.push(this.visitTemplateFieldDeclaration(qwq))
            }else {
                const pwp = member.templateMember().annotation();
                if(pwp){
                    this.visitAnnotation(pwp);
                }
            }
        }
        currNBT.type = [NBTType.Compound]
        currNBT.isRoot = true
        currNBT.namespace = this.namespace
        return currNBT
    }

    visitTemplateFieldDeclaration(ctx: TemplateFieldDeclarationContext): any {
        const qwq = new NBT();
        qwq.name = ctx.Identifier().text;
        if(!ctx.templateType()){
            error("NBT type is not set", ctx)
            return;
        }
        const re = this.visitTemplateType(ctx.templateType()!)
        qwq.type = re[0]
        qwq.nullable = re[1]
        this.annotations.forEach(anno => {
            anno.operation(qwq);
        })
        this.annotations = []
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
        const t = this.visitTypeWithoutExcl(ctx.type().typeWithoutExcl())
        return [t, ctx.QUEST() != null]
    }

    visitUnionTemplateFieldType(ctx: UnionTemplateFieldTypeContext): any {
        let types: any[] = [];
        for(const type of ctx.type()){
            types = types.concat(this.visitTypeWithoutExcl(type.typeWithoutExcl()))
        }
        return [types, ctx.QUEST() != null]
    }

    visitTypeWithoutExcl(ctx: TypeWithoutExclContext): any {
        const qwq = ctx.anonymousTemplateType()
        if(qwq){
            return [this.visitAnonymousTemplateType(qwq)]
        }else{
            if(ctx.LIST()){
                const t = this.visitTypeWithoutExcl(ctx.type()!.typeWithoutExcl())
                if(t.length === 1 && (typeof t[0] == 'string' || t[0] instanceof NBT)){
                    return [NBTType.List, null, t[0]]
                }
                return [NBTType.List]
            }else if(NBT.baseType.hasOwnProperty(ctx.text)){
                return NBT.typeFromString(ctx.text)
            }else {
                //搜索json文件进行反序列化
                if(!ctx.text.includes(":")){
                    return [this.namespace + ":" + ctx.text]
                }else {
                    return [ctx.text]
                }
            }
        }
    }

    visitAnonymousTemplateType(ctx: AnonymousTemplateTypeContext): any{
        const currNBT = new NBT();
        for (const className of ctx.className()) {
            const qwq = className.text;
            if(!currNBT.extends.includes(className.text)){
                currNBT.extends.push(qwq)
            }
        }
        const annos = this.annotations;
        this.annotations = []
        for(const member of ctx.templateBody()?.templateMemberDeclaration() || []){
            const qwq = member.templateMember().templateFieldDeclaration();
            if(qwq){
                currNBT.children.push(this.visitTemplateFieldDeclaration(qwq))
            }else {
                const pwp = member.templateMember().annotation();
                if(pwp){
                    this.visitAnnotation(pwp);
                }
            }
        }
        this.annotations = annos
        currNBT.type = [NBTType.Compound]
        return currNBT
    }


}

function error(msg: string, ctx: ParserRuleContext){
        throw new Error(
            "MCFPP编译错误\n" + msg
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

/**
 * 编译一个mcfpp字符串
 * @param code
 * @param namespace
 */
export async function compile(code: string, namespace: string): Promise<NBT[]> {
    //编译
    const tokens = new CommonTokenStream(new mcfppLexer(CharStreams.fromString(code)));
    const parser = new mcfppParser(tokens);
    return new MCFPPNBTParser(namespace).visitCompilationUnit(parser.compilationUnit());
}

export const config = {
    namespace: ""
}

export async function compileString(code: string): Promise<NBT>{
    //检查缓存
    //const cachedNBT = await checkCache(code);
    //if(cachedNBT != null){
    //    return cachedNBT;
    //}
    const nbts= await compile(code, config.namespace);
    if(nbts.length != 1){
        throw new Error("只接受一个NBT模板作为输入, 但是定义了" + nbts.length + "个");
    }
    //将编译结果写入缓存
    //const hashValue = await sha256(code);
    //const cacheFilePath = `/nbt-json/cache/${hashValue}.json`;
    //fs.writeFileSync(cacheFilePath, JSON.stringify(nbt[0].toJSON()));
    if(nbts[0]){
        return nbts[0]
    }else {
        throw new Error("编译NBT失败：" + code)
    }
}

export async function compileToCache(id: string, code: string): Promise<NBT>{
    let nbt = await compileString(code);
    nbt.isTemplate = true
    NBT.addCache(id, nbt)
    return nbt
}