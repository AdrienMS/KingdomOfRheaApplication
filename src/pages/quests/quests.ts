import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//page
import { QuestPage } from '../quest/quest';

//provider
import { QuestProvider } from '../../providers/quest';
import { GameProvider } from '../../providers/game';
import { StuffProvider } from '../../providers/stuff';

//data
import { Quest } from '../../data/quest';
import { Game } from '../../data/game';
import { Stuff } from '../../data/stuff';
import { Inventory } from '../../data/inventory';

@IonicPage()
@Component({
  selector: 'page-quests',
  templateUrl: 'quests.html',
})
export class QuestsPage implements OnInit {
  public quests: Quest[] = [];
  public questPush = QuestPage;
  public questParams: any[] = [];
  public questTime: string[] = [];
  private game: Game = null;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private questProvider: QuestProvider,
    private gameProvider: GameProvider,
    private stuffProvider: StuffProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestsPage');
  }

  ngOnInit() {
    this.game = this.gameProvider.get();
    this.initTime();
  }

  private initTime() {
    //let questsIDs = this.navParams.get('ids');
    //let questsIDs = this.questProvider.getFromStorage();
    let questBlock = null as HTMLElement;
    this.quests = [];
    let questsIDs = this.game.datas["quests_list"];
    let quest: Quest;
    for (let i = 0; i < questsIDs.length; i += 1) {
      quest = this.questProvider.getById(questsIDs[i]);
      if (quest != null) {
        this.quests.push(quest);
        this.questParams.push({'quest': quest, 'parentPage': this});
      }
    }
    for (let i = 0; i < this.quests.length; i += 1) {
      if (this.quests[i].validate) {
        this.questTime[i] = '';
      } else if (this.quests[i].do_quest) {
        this.timer(this.quests[i], i);
      } else {
        this.questTime[i] = this.timeFormat(this.quests[i].time);
      }
    }
  }

  private timer(quest: Quest, i: number) {
    let currentDate = new Date();
    let time = (quest.start + quest.time) - currentDate.getTime();
    let bonus = this.calcTimeWithBonus(quest);
    let idInterval = setInterval(frame, 1, this, this.navParams.get('parentPage'), bonus, i);

    function frame(func: any, parent: any, bonus, i) {
      if (time <= 0) {
        clearInterval(idInterval);
        quest.do_quest = false;
        func.questProvider.modify(quest);
        parent.finishQuest(quest.id);
        func.validateQuest(i);
      } else {
        func.questTime[i] = func.timeFormat(time);
        let date = new Date();
        time = (quest.start + (quest.time - bonus)) - date.getTime();
      }
    }
  }

  private validateQuest(index: number) {
    this.quests[index].validate = true;
  }

  public timeFormat(time: number): string {
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

  public quests_close() {
    this.navCtrl.pop();
  }

  public refresh() {
    this.initTime();
    for (let i = 0; i < this.quests.length; i += 1) {
      if (this.quests[i].validate === false) {
        return;
      }
    }
    this.questsFinished();
  }

  public questsFinished() {
    this.navParams.get('parentPage').Finished();
  }

  private calcTimeWithBonus(quest) {
    let timeBonus = 0;
    let bonus = 0;
    let c_stuff: Stuff = null;
    let inventory: Inventory = this.game.datas["inventory"];
    bonus = (quest.send_characters - 1) * 0.25;
    for (let i = 0; i < inventory.stuffs.length; i += 1) {
      c_stuff = this.stuffProvider.getById(inventory.stuffs[i]);
      if (c_stuff.equiped && c_stuff.type === "quest") {
        bonus += c_stuff.bonus;
      }
    }
    if (bonus >= 1) {
      bonus = 0.99;
    }
    timeBonus = quest.time * bonus;
    return timeBonus;
  }

}
