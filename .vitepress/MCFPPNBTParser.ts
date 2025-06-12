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
import * as fs from 'fs'

interface Annotation {
    name: string;
    values: Map<string, string>;
    operation(NBT: NBT): void;
}

class NameAnnotation implements Annotation {
    name: string = "Name";
    values: Map<string, string> = new Map();
    constructor(value: string) {
        this.values.set("name", value);
    }
    operation(nbt: NBT): void {
        nbt.name = this.values.get("name")!!;
    }
}

class DescriptionAnnotation implements Annotation {
    name: string = "Desc";

    values: Map<string, string> = new Map();
    
    constructor(value: string) {
        this.values.set("description", value);
    }
    
    operation(nbt: NBT): void {
        nbt.description = this.values.get("description")!!;
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

    async visitCompilationUnit(ctx: CompilationUnitContext): Promise<any>{
        const result: NBT[] = [];
        for(const typeDecl of ctx.typeDeclaration()){
            const templateDecl = typeDecl.declarations().templateDeclaration();
            if (templateDecl) {
                result.push(await this.visitTemplateDeclaration(templateDecl))
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
        var anno : Annotation | null = null;
        switch (name) {
            case "Name":
                anno = new NameAnnotation(values[0]);
            case "Desc":
                anno = new DescriptionAnnotation(values[0]);
        }
        if(anno){
            this.annotations.push(anno);
        }
    }

    async visitTemplateDeclaration(ctx: TemplateDeclarationContext): Promise<any> {
        var currNBT = new NBT();
        currNBT.name = ctx.classWithoutNamespace().text;
        ctx.className().forEach(className => {
            const qwq = className.text;
            if(!currNBT.extends.has(className.text)){
                currNBT.extends.add(qwq)
            }
        })
        this.annotations.forEach(anno => {
            anno.operation(currNBT);
        })
        this.annotations = []; // 清空注解列表
        for(const member of ctx.templateBody()?.templateMemberDeclaration() || []){
            var qwq = member.templateMember().templateFieldDeclaration()
            if(qwq){
                currNBT.children.push(await this.visitTemplateFieldDeclaration(qwq))
            }else {
                var pwp = member.templateMember().annotation()
                if(pwp){
                    this.visitAnnotation(pwp);
                }
            }
        }
        currNBT.type = [NBTType.Compound]
        currNBT.isRoot = true
        return currNBT
    }

    async visitTemplateFieldDeclaration(ctx: TemplateFieldDeclarationContext): Promise<any> {
        const qwq = new NBT();
        qwq.name = ctx.Identifier().text;
        if(!ctx.templateType()){
            error("NBT type is not set", ctx)
            return;
        }
        const pwp = await this.visitTemplateType(ctx.templateType()!);
        const type: NBTType[] = []
        var anonymousTemplate: NBT | null = null
        for(const element of pwp[0]){
            if(element instanceof NBT){
                type.push(NBTType.Compound)
                anonymousTemplate = element
            }else {
                type.push(element)
            }
        }
        if(anonymousTemplate){
            qwq.extends = anonymousTemplate.extends;
            qwq.children = anonymousTemplate.children;
            qwq.templateName = anonymousTemplate.description
            qwq.isTemplate = anonymousTemplate.isTemplate;
            qwq.isRoot = anonymousTemplate.isRoot;
        }
        qwq.type = pwp[0]
        qwq.nullable = pwp[1]
        this.annotations.forEach(anno => {
            anno.operation(qwq);
        })
        this.annotations = []
        return qwq
    }

    async visitTemplateType(ctx: TemplateTypeContext): Promise<any> {
        if(ctx.singleTemplateFieldType()){
            return await this.visitSingleTemplateFieldType(ctx.singleTemplateFieldType()!)
        }else {
            return await this.visitUnionTemplateFieldType(ctx.unionTemplateFieldType()!)
        }
    }

    async visitSingleTemplateFieldType(ctx: SingleTemplateFieldTypeContext): Promise<any> {
        return [[await this.visitTypeWithoutExcl(ctx.type().typeWithoutExcl())], ctx.QUEST() != null]
    }

    async visitUnionTemplateFieldType(ctx: UnionTemplateFieldTypeContext): Promise<any> {
        const types: any[]= [];
        for(const type of ctx.type()){
            types.push(await this.visitTypeWithoutExcl(type.typeWithoutExcl()))
        }
        return [types, ctx.QUEST() != null]
    }

    async visitTypeWithoutExcl(ctx: TypeWithoutExclContext): Promise<any> {
        const qwq = ctx.anonymousTemplateType()
        if(qwq){
            return await this.visitAnonymousTemplateType(qwq)
        }else{
            if(ctx.LIST()){
                //TODO
                return NBT.typeFromString(ctx.text)
            }else if(NBT.baseType.includes(ctx.text)){
                return NBT.typeFromString(ctx.text)
            }else {
                //搜索json文件进行反序列化
                const namespaceID = ctx.text.split(":", 2)
                const path = namespaceID[0].replace(".", "/")
                const file = namespaceID[1]
                const response = await fetch(`./resources/nbt-json/${path}/${file}.json`)
                const jsonData = await response.json()
                let n = NBT.fromJSON(jsonData)
                n.isRoot = true
                return n
            }
        }
    }

    async visitAnonymousTemplateType(ctx: AnonymousTemplateTypeContext): Promise<any>{
        var currNBT = new NBT();
        ctx.className().forEach(className => {
            const qwq = className.text;
            if(!currNBT.extends.has(className.text)){
                currNBT.extends.add(qwq)
            }
        })
        var annos = this.annotations
        this.annotations = []
        for(const member of ctx.templateBody()?.templateMemberDeclaration() || []){
            var qwq = member.templateMember().templateFieldDeclaration()
            if(qwq){
                currNBT.children.push(await this.visitTemplateFieldDeclaration(qwq))
            }else {
                var pwp = member.templateMember().annotation()
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
        console.error(
            "Error while compiling: " + msg
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
 * @param path 相对于resources\nbt的路径
 */
async function compile(code: string, namespace: string): Promise<NBT[]> {
    //编译
    const tokens = new CommonTokenStream(new mcfppLexer(CharStreams.fromString(code)));
    const parser = new mcfppParser(tokens);
    const nbts: NBT[] = await new MCFPPNBTParser(namespace).visitCompilationUnit(parser.compilationUnit());
    return nbts;
}

async function sha256(str: string): Promise<string> {
    const encoder = new TextEncoder();
    const data = encoder.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
    return hashHex;
}

async function checkCache(code: string): Promise<NBT | null> {
    const hashValue = await sha256(code);
    const cacheFilePath = `resources/nbt-json/cache/${hashValue}.json`;
    if (fs.existsSync(cacheFilePath)) {
        const jsonString = fs.readFileSync(cacheFilePath, 'utf-8');
        const nbt = NBT.fromJSON(JSON.parse(jsonString));
        nbt.namespace = "";
        return nbt;
    }
    return null;
}

export function compileFiles(){
    //读取resources\nbt下的所有mcfpp代码文件
    const files = fs.readdirSync('resources/nbt');
    files.forEach(file => {
        if(file.endsWith(".mcfpp")){
            console.log("Compiling " + file);
            const code = fs.readFileSync('resources/nbt/' + file, 'utf-8');
            //获取命名空间
            const index = file.lastIndexOf("/");
            const namespace = file.substring(0, index).replace("/", ".");
            compile(code, namespace).then(result => result.forEach((nbt) => {
                const jsonString = JSON.stringify(nbt.toJSON())
                fs.writeFileSync('resources/nbt-json/' + nbt.namespace.replace(".", "/") + "/" + nbt.name + '.json', jsonString)
            }));
        }
    })
}

export async function compileString(code: string): Promise<NBT>{
    //检查缓存
    //const cachedNBT = await checkCache(code);
    //if(cachedNBT != null){
    //    return cachedNBT;
    //}
    var nbts = await compile(code, "")
    if(nbts.length != 1){
            throw new Error("Expected exactly one NBT, but got " + nbts.length);
    }
    //将编译结果写入缓存
    //const hashValue = await sha256(code);
    //const cacheFilePath = `resources/nbt-json/cache/${hashValue}.json`;
    //fs.writeFileSync(cacheFilePath, JSON.stringify(nbt[0].toJSON()));
    return nbts[0];
}