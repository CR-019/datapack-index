export class NBT {
    public name = '';
    public type: NBTType[] = [];
    public description = '';
    /**
     * 仅当 type 为 Compound 或 List 时有效
     */
    public children: NBT[] = [];
    /**
     * 仅当 type 为 Other 时有效
     */
    public templateName = '';  
    public extends: Set<string> = new Set();
    public nullable = false

    public static typeFromString(type: string): NBTType {
        switch (type) {
            case 'byte': return NBTType.Byte;
            case 'short': return NBTType.Short;
            case 'int': return NBTType.Int;
            case 'long': return NBTType.Long;
            case 'float': return NBTType.Float;
            case 'double': return NBTType.Double;
            case 'ByteArray': return NBTType.ByteArray;
            case 'IntArray': return NBTType.IntArray;
            case 'LongArray': return NBTType.LongArray;
            case 'string': return NBTType.String;
            case 'list': return NBTType.List;
            case 'compound': return NBTType.Compound;
            default: return NBTType.Other;
        }
    }

    // 序列化方法
    toJSON() {
        return {
            name: this.name,
            type: this.type,
            description: this.description,
            children: this.children.map(child => child.toJSON()),
            templateName: this.templateName,
            extends: Array.from(this.extends),
            nullable: this.nullable
        };
    }

    // 反序列化静态方法
    static fromJSON(json: string | object): NBT {
        const data = typeof json === 'string' ? JSON.parse(json) : json;
        const nbt = new NBT();
        
        nbt.name = data.name;
        nbt.type = data.type || [];
        nbt.description = data.description || '';
        nbt.children = (data.children || []).map((child: any) => NBT.fromJSON(child));
        nbt.templateName = data.templateName || '';
        nbt.extends = new Set(data.extends || []);
        nbt.nullable = Boolean(data.nullable);
        
        return nbt;
    }
}

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
    Other = 13
}