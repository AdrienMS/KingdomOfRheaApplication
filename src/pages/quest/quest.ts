import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';

//data
import { Quest } from '../../data/quest';
import { JsonProvider } from '../../data/json';
import { Game } from '../../data/game';
import { Stuff } from '../../data/stuff';
import { Inventory } from '../../data/inventory';

//Provider
import { QuestProvider } from '../../providers/quest';
import { GameProvider } from '../../providers/game';
import { StuffProvider } from '../../providers/stuff';

@IonicPage()
@Component({
  selector: 'page-quest',
  templateUrl: 'quest.html',
})
export class QuestPage implements OnInit {
  public quest: Quest;
  public buttons: string[] = [];
  private json: JsonProvider = new JsonProvider();
  public timeQuest: string = '';
  private game: Game = null;
  private loots: Stuff[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private file: File,
    private questProvider: QuestProvider,
    private gameProvider: GameProvider,
    private stuffProvider: StuffProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestPage');
  }

  ngOnInit() {
    this.quest = this.navParams.get('quest');
    let charactersEnable = this.json.getJson('game').datas.characters_enabled;
    for (let i = 1; i <= charactersEnable; i += 1) {
      this.buttons.push('button-'+i.toString());
    }
    if (this.quest.do_quest) {
      let currentDate = new Date();
      this.timer(currentDate);
    }
    for (let i = 0; i < this.quest.loot.length; i += 1) {
      this.loots.push(this.stuffProvider.getById(this.quest.loot[i]));
    }
  }

  public send_characters(nb: number) {
    let date = new Date();
    this.quest.send_characters = nb;
    this.quest.do_quest = true;
    this.quest.start = date.getTime();
    this.questProvider.modify(this.quest);
    let game = this.json.getJson('game');
    game.datas.characters_enabled -= nb;
    this.json.writeJson('game', game);
    this.close_quest();
    // this.game = this.gameProvider.get();
    // this.game.is_saved = true;
    // this.gameProvider.save(this.game);
  }

  public close_quest() {
    this.navParams.get('parentPage').refresh();
    this.navCtrl.pop();
  }

  private timer(currentDate) {
    let time = (this.quest.start + this.quest.time) - currentDate.getTime();
    let bonus = this.calcTimeWithBonus();
    let idInterval = setInterval(frame, 1, this, this.navParams.get('parentPage'), bonus);

    function frame(func: any, parent: any, bonus) {
      if (time <= 0) {
        clearInterval(idInterval);
        func.quest.do_quest = false;
        func.questProvider.modify(func.quest);
        parent.refresh();
      } else {
        func.time_quest = func.timeFormat(time);
        let date = new Date();
        time = (func.quest.start + (func.quest.time - bonus)) - date.getTime();
      }
    }
  }

  private timeFormat(time: number): string {
    let res: string = "";
    let hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    let minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
    let seconds = Math.floor((time % (1000 * 60)) / 1000);
    if (hours != 0) {
        res += hours + "h";
    }
    if (minutes != 0) {
        res += minutes + "m";
    }
    if (seconds != 0) {
        res += seconds + "s";
    }
    return res;
  }

  private end_quest() {

  }

  private calcTimeWithBonus() {
    let timeBonus = 0;
    let bonus = 0;
    let c_stuff: Stuff = null;
    let inventory: Inventory = this.game.datas["inventory"];
    bonus = (this.quest.send_characters - 1) * 0.25;
    for (let i = 0; i < inventory.stuffs.length; i += 1) {
      c_stuff = this.stuffProvider.getById(inventory.stuffs[i]);
      if (c_stuff.equiped && c_stuff.type === "quest") {
        bonus += c_stuff.bonus;
      }
    }
    if (bonus >= 1) {
      bonus = 0.99;
    }
    timeBonus = this.quest.time * bonus;
    console.log(bonus, timeBonus);
    return timeBonus;
  }

}
