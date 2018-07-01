export class Character {
    id: number;
    name: string;
    sprite: string;
    position: string;
    desc: string;
    unlock: boolean;
    link: number;

    constructor(id, name, sprite, position, desc, unlock, link){
        this.id = id;
        this.name = name;
        this.sprite = sprite;
        this.position = position;
        this.desc = desc;
        this.unlock = unlock;
        this.link = link;
    }
}