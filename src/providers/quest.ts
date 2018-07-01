import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//data
import { Quest } from '../data/quest';
import { JsonProvider } from '../data/json';

@Injectable()
export class QuestProvider {
  quest: Quest[] = [];
  quest_json: string = '../data/json/quests.json';
  private json: JsonProvider = new JsonProvider();

  constructor() {
    //this.quest = json.read_json(this.quest_json);
    this.refresh();
  }

  public getById(id) {
    this.refresh();
    if (id < this.quest.length) {
      return this.quest[id];
    }
    return null;
  }

  public modify(quest: Quest) {
    this.refresh();
    this.quest[quest.id] = quest;
    this.json.writeJson('quests', {quests: this.quest});
  }

  public getFromStorage() {
    return this.json.getJson('currentKinematic').kinematic.assign_quests;
  }

  private refresh() {
    this.quest = this.json.getJson('quests');
    if (this.quest != null && this.quest["quests"] != undefined) {
        this.quest = this.quest["quests"];
    } else {
        this.quest = null;
    }
  }
}
