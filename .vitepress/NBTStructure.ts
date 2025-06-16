export enum NBTType {
    End = 0,
    Byte = 1,
    Short = 2,
    Int = 3,
    Long = 4,
    Float = 5,
    Double = 6,
    ByteArray = 7,
    String = 8,
    List = 9,
    Compound = 10,
    IntArray = 11,
    LongArray = 12,
    Other = 13,
    Boolean = 14,
    Info = 15,
}

export class NBT {
    public namespace = ''
    public name = '';
    public type: (NBTType | string | NBT | null)[] = [];
    public description = '';
    public children: NBT[] = [];
    public templateName = '';
    public extends: string[] = []
    public nullable = false
    public gap = 0; // 用于计算NBT的偏移量
    public segs: string[] = []
    public isTemplate = false
    public isRoot = false;

    public copy(): NBT {
        const copy = new NBT();
        // 基本类型属性
        copy.namespace = this.namespace;
        copy.name = this.name;
        copy.type = [...this.type];
        copy.description = this.description;
        // 嵌套对象需要递归拷贝
        copy.children = this.children.map(child =>
            child instanceof NBT ? child.copy() : child
        );
        copy.templateName = this.templateName;
        copy.extends = [...this.extends];
        copy.nullable = this.nullable;
        copy.gap = this.gap;
        copy.segs = [...this.segs];
        copy.isTemplate = this.isTemplate;
        copy.isRoot = this.isRoot;
        return copy;
    }

    async instantiateExtends(exs: string[]): Promise<NBT[]> {
        const extendsNBT: NBT[] = []
        //是对继承的内容实例化
        for(let ex of exs){
            const qwq = (await NBT.fromName(this.getNamespaceID(ex)))!
            qwq.templateName = qwq.description
            for(let uwu of await this.instantiateExtends(qwq.extends)){
                extendsNBT.push(uwu)
            }
            extendsNBT.push(qwq)
        }
        return extendsNBT
    }

    async instantiateChildren(){
        for (let i = 0; i < this.children.length; i++) {
            const child = this.children[i]
            const childType = child.type
            let isListT = false
            let types: NBTType[] = []
            for (let t of childType){
                if(t == null){
                    isListT = true
                }else if(isListT){
                    let qwq: NBT
                    if(t instanceof NBT){
                        qwq = t
                    }else{
                        qwq = (await NBT.fromName(this.getNamespaceID(t as string)))!
                    }
                    const n = new NBT();
                    n.type = [NBTType.Compound]
                    n.name = "（列表元素）"
                    n.extends = qwq.extends
                    n.children = qwq.children
                    n.templateName = qwq.description
                    n.isTemplate = qwq.isTemplate
                    n.isRoot = qwq.isRoot
                    child.children.push(n)
                }else if(t instanceof NBT){
                    types.push(NBTType.Compound)
                    child.extends = t.extends
                    child.children = t.children
                    child.templateName = t.description
                    child.isTemplate = t.isTemplate
                    child.isRoot = t.isRoot
                }else if(typeof t == 'string'){
                    types.push(NBTType.Compound)
                    const n = (await NBT.fromName(this.getNamespaceID(t)))!
                    child.extends = n.extends
                    child.children = n.children
                    child.templateName = n.description
                    child.isTemplate = n.isTemplate
                    child.isRoot = n.isRoot
                }else{
                    types.push(t)
                }
            }
            child.type = types
        }
    }

    getIcon(): string[] {
        const icon: string[] = [];
        for (const t of this.type) {
            switch (t) {
                case NBTType.Byte:
                    icon.push('/datapack-index/nbt_sprites/byte.svg');
                    break;
                case NBTType.Short:
                    icon.push('/datapack-index/nbt_sprites/short.svg');
                    break;
                case NBTType.Int:
                    icon.push('/datapack-index/nbt_sprites/int.svg');
                    break;
                case NBTType.Long:
                    icon.push('/datapack-index/nbt_sprites/long.svg');
                    break;
                case NBTType.Float:
                    icon.push('/datapack-index/nbt_sprites/float.svg');
                    break;
                case NBTType.Double:
                    icon.push('/datapack-index/nbt_sprites/double.svg');
                    break;
                case NBTType.ByteArray:
                    icon.push('/datapack-index/nbt_sprites/byte_array.svg');
                    break;
                case NBTType.String:
                    icon.push('/datapack-index/nbt_sprites/string.svg');
                    break;
                case NBTType.List:
                    icon.push('/datapack-index/nbt_sprites/homolist.svg');
                    break;
                case NBTType.Compound:
                    icon.push('/datapack-index/nbt_sprites/object.svg');
                    break;
                case NBTType.IntArray:
                    icon.push('/datapack-index/nbt_sprites/int_array.svg');
                    break;
                case NBTType.LongArray:
                    icon.push('/datapack-index/nbt_sprites/long_array.svg');
                    break;
                case NBTType.Boolean:
                    icon.push('/datapack-index/nbt_sprites/bool.svg');
                    break;
                default:
                    icon.push('/datapack-index/nbt_sprites/any.svg');
                    break;
            }
        }
        return icon;
    }

    private getNamespaceID(name: string): string{
        //搜索json文件进行反序列化
        let qwq = name;
        if(!qwq.includes(":")){
            qwq = this.namespace + ":" + qwq
        }
        return qwq;
    }

    public static addCache(name: string, nbt: NBT){
        NBT.cache.set(name, nbt)
    }

    private static cache = new Map<string, NBT>()
    static async fromName(name: string): Promise<NBT|null>{
        if(NBT.cache.has(name)){
            return NBT.cache.get(name)!.copy()!
        }
        const namespaceID = name.split(":", 2)
        const path = namespaceID[0].replace(".", "/")
        const file = namespaceID[1]
        let url: string | null = null
        try{
            // @ts-ignore
            if(typeof globalThis.window !== undefined){
                // @ts-ignore
                url = new URL(`/datapack-index/nbt-json/${path}/${file}.json`, globalThis.window.location.href).href;
            }else{
                url = `../public/nbt-json/${path}/${file}.json`
            }
            const response = await fetch(url);
            const jsonData = await response.json();
            const n = await NBT.fromJSON(jsonData as string | object);
            n.isRoot = true;
            this.cache.set(name, n)
            return n.copy()
        }catch(err){
            console.error(err)
            NBT.error(
                "无效的类型: " + name +
                // @ts-ignore
                "\n请求的地址: " + url +
                "\n错误: " + (err as Error).message
            );
        }
        return null;
    }

    // 序列化方法
    toJSON(): any {
        return {
            name: this.name,
            type: this.type,
            description: this.description,
            children: this.children.map(child => child instanceof NBT ? child.toJSON() : child),
            templateName: this.templateName,
            extends: this.extends,
            nullable: this.nullable
        };
    }

    static error(msg: string){
        throw new Error(
            "MCFPP编译错误\n" + msg
        )
    }

    public static baseType: {[key: string]: NBTType[]} = {
        'byte': [NBTType.Byte],
        'short': [NBTType.Short],
        'int': [NBTType.Int],
        'long': [NBTType.Long],
        'float': [NBTType.Float],
        'double': [NBTType.Double],
        'ByteArray': [NBTType.ByteArray],
        'IntArray': [NBTType.IntArray],
        'LongArray': [NBTType.LongArray],
        'string': [NBTType.String],
        'list': [NBTType.List],
        'compound': [NBTType.Compound],
        'bool': [NBTType.Boolean],
        'text': [NBTType.String, NBTType.Compound, NBTType.List],
        'UUID': [NBTType.IntArray],
        'any': [NBTType.Other]
    }

    public static typeFromString(type: string): (NBTType| string)[] {
        if(type.includes("<")){
            type = type.substring(0, type.indexOf("<"))
        }
        if(NBT.baseType.hasOwnProperty(type)){
            return NBT.baseType[type]
        }else{
            return [NBTType.Other]
        }
    }

    // 反序列化静态方法
    static async fromJSON(json: string | object): Promise<NBT> {
        const data = typeof json === 'string' ? JSON.parse(json) : json;
        const nbt = new NBT();
        nbt.name = data.name;
        nbt.type = [];
        for (let t of data.type || []){
            if(t instanceof Object){
                nbt.type.push(await NBT.fromJSON(t))
            }else {
                nbt.type.push(t)
            }
        }
        nbt.description = data.description || '';
        nbt.children = []
        for (let c of data.children || []){
            nbt.children.push(await NBT.fromJSON(c))
        }
        nbt.templateName = data.templateName || '';
        nbt.extends = data.extends || [];
        nbt.nullable = Boolean(data.nullable);
        
        nbt.isTemplate = true

        await nbt.instantiateExtends(nbt.extends)
        await nbt.instantiateChildren()

        return nbt;
    }
}