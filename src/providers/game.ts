import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/map';

//data
import { Game } from '../data/game';
import { JsonProvider } from '../data/json';

@Injectable()
export class GameProvider {
    private path = '../data/json/game.json';
    private json: JsonProvider = new JsonProvider();

  constructor() {}

  public get() {
    let test = new JsonProvider();
    //return(test.read_json(this.path));
     return test.getJson('game');
  }

  public save(game: Game) {
    this.json.writeJson('game', game);
  }
}
