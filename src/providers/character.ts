import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//data
import { Character } from '../data/character';
import { JsonProvider } from '../data/json';

@Injectable()
export class CharacterProvider {
    private path = '../data/json/characters.json';
    private characters: Character[] = [];
    private json: JsonProvider = new JsonProvider();

    constructor() {
        this.refresh();
    }

    public get() {
        this.refresh();
        return this.characters;
    }

    public getById(id) {
        this.refresh();
        if (id < this.characters.length) {
            return this.characters[id];
        }
        return null;
    }

    public modify(character: Character) {
        this.refresh();
        for (let i = 0; i < this.characters.length; i += 1) {
            if (this.characters[i].id === character.id) {
                this.characters[i] = character;
            }
        }
        this.json.writeJson('characters', {characters: this.characters});
    }

    private refresh() {
        let ret = new JsonProvider();
        // this.characters = ret.read_json(this.path);
        this.characters = ret.getJson('characters');
        if (this.characters["characters"] != undefined) {
            this.characters = this.characters["characters"];
        } else {
            this.characters = null;
        }
    }
}
