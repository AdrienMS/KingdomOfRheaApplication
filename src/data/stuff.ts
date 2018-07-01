export class Stuff {
    name: string;
    sprite: string;
    type: string;
    bonus: number;
    equiped: boolean;
    desc: string;
    id: number

    constructor(name, sprite, type, bonus, equiped, desc, id) {
        this.name = name;
        this.sprite = sprite;
        this.type = type;
        this.bonus = bonus;
        this.equiped = equiped;
        this.desc = desc;
        this.id = id;
    }
}