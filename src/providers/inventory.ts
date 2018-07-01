import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//data
import { Inventory } from '../data/inventory';
import { JsonProvider } from '../data/json';

@Injectable()
export class InventoryProvider {
  inventory: Inventory;
  quest_json: string = '../data/json/quests.json';
  private json: JsonProvider = new JsonProvider();

  constructor() {
    //this.quest = json.read_json(this.quest_json);
    this.refresh();
  }

  public get() {
    this.refresh();
    return this.inventory;
  }

  private refresh() {
    this.inventory = this.json.getJson('inventory');
    if (this.inventory != null && this.inventory["inventory"] != undefined) {
        this.inventory = this.inventory["inventory"];
    } else {
        this.inventory = null;
    }
  }
}
