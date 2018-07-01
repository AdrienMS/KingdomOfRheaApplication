export class Place {
    id: number;
    name: string;
    sprite: string;
    position: number;
    music: string;

    constructor(id,name, sprite, position, music){
        this.id = id;
        this.name = name;
        this.sprite = sprite;
        this.position = position;
        this.music = music;
    }
}