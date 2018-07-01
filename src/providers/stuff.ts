import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//data
import { Stuff } from '../data/stuff';
import { JsonProvider } from '../data/json';

@Injectable()
export class StuffProvider {
  stuff: Stuff[] = [];
  quest_json: string = '../data/json/stuffs.json';
  private json: JsonProvider = new JsonProvider();

  constructor() {
    //this.quest = json.read_json(this.quest_json);
    this.refresh();
  }

  public getById(id) {
    this.refresh();
    return this.stuff[id];
  }

  public modify(stuff: Stuff) {
    this.refresh();
    this.stuff[stuff.id] = stuff;
    this.json.writeJson("stuffs", {stuffs:this.stuff});
  }

  private refresh() {
    this.stuff = this.json.getJson('stuffs');
    if (this.stuff["stuffs"] != undefined) {
        this.stuff = this.stuff["stuffs"];
    } else {
        this.stuff = null;
    }
  }
}
