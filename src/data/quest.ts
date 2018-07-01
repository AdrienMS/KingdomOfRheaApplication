export class Quest {
    id: number;
    title: string;
    description: string;
    loot: number[];
    gold: number;
    time: number;
    start: number;
    do_quest: boolean;
    send_characters: number;
    validate: boolean;

    constructor(id,title, description, loot, gold, time, start, do_quest, send_characters, validate){
        this.id = id;
        this.title = title;
        this.description = description;
        this.loot = loot;
        this.gold = gold;
        this.time = time;
        this.start = start;
        this.do_quest = do_quest;
        this.send_characters = send_characters;
        this.validate = validate;
    }
}