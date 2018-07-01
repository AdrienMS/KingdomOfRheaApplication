import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//data
import { Place } from '../data/place';
import { JsonProvider } from '../data/json';

@Injectable()
export class PlaceProvider {
  place: Place[] = [];
  place_json: string = '../data/json/place.json';
  private json: JsonProvider = new JsonProvider();

  constructor() {
    //this.quest = json.read_json(this.quest_json);
    this.refresh();
  }

  public getById(id) {
    this.refresh();
    if (id < this.place.length) {
      return this.place[id];
    }
    return null;
  }

  private refresh() {
    this.place = this.json.getJson('places');
    console.log(this.place);
    if (this.place != null && this.place["places"] != undefined) {
        this.place = this.place["places"];
    } else {
        this.place = null;
    }
  }
}
