export class Dialogue {
    text: string;
    character: number;
    position: string;

    constructor(text, character, position){
        this.text = text;
        this.character = character;
        this.position = position;
    }
}

export class Unlock {
    kinematic: number[];
    before: number[];

    constructor(kinematic, before) {
        this.kinematic = kinematic;
        this.before = before;
    }
}

export class Actions {
    music: string;
    add_character: number;
    characters: number[];
    unlock: Unlock;

    constructor(music, add_character, characters, unlock) {
        this.music = music;
        this.add_character = add_character;
        this.characters = characters;
        this.unlock = unlock;
    }
}

export class Kinematic {
    dialogues: Dialogue[];
    characters_to_display: number[];
    assign_quests: number[];
    place_id: number;
    dialogues_before_choice: Dialogue[];
    display: boolean;
    choices: number[];
    actions: Actions;

    constructor(json, characters_to_display, assign_quests, place_id, dialogues_before_choice, display, choices, actions){
        this.dialogues = json;
        this.characters_to_display = characters_to_display;
        this.assign_quests = assign_quests;
        this.place_id = place_id;
        this.dialogues_before_choice = dialogues_before_choice;
        this.display = display;
        this.choices = choices;
        this.actions = actions;
    }
}