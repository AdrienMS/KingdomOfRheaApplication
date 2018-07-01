import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//data
import { Choice } from '../data/choice';
import { JsonProvider } from '../data/json';

@Injectable()
export class ChoiceProvider {
    private path = '../data/json/choices.json';
    private choices: Choice[] = [];
    private json: JsonProvider = new JsonProvider();

  constructor() {
        this.refresh();
    }

  public getById(id) {
    this.refresh();
      if (id < this.choices.length) {
          return this.choices[id];
      }
      return null;
  }

  public modify(choice: Choice) {
    this.refresh();
    this.choices[choice.id] = choice;
    this.json.writeJson('choices', {choices: this.choices});
  }

  private refresh() {
    let ret = new JsonProvider();
    // this.characters = ret.read_json(this.path);
    this.choices = ret.getJson('choices');
    if (this.choices != null && this.choices["choices"] != undefined) {
        this.choices = this.choices["choices"];
    } else {
        this.choices = null;
    }
  }
}
