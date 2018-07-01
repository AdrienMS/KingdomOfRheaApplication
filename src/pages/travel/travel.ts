import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//provider
import { ChoiceProvider } from '../../providers/choice';
import { KinematicProvider } from '../../providers/kinematic';
import { GameProvider } from '../../providers/game';
import { PlaceProvider } from '../../providers/place';
import { StuffProvider } from '../../providers/stuff';

//data
import { Choice } from '../../data/choice';
import { Game } from '../../data/game';
import { Stuff } from '../../data/stuff';
import { Inventory } from '../../data/inventory';
import { Kinematic } from '../../data/kinematic';

//page
import { GamePage } from '../game/game';
import { KinematicPage } from '../kinematic/kinematic';

@IonicPage()
@Component({
  selector: 'page-travel',
  templateUrl: 'travel.html',
})
export class TravelPage implements OnInit {
  private choice: Choice = null;
  private c_kinematic: Kinematic = null;
  private game: Game = null;
  private timeTravel: number = -1;
  private displayedTime: string = "";
  public kinematicPush = KinematicPage;
  public timeQuest: string = '';
  private timeDefault: number = 50000;
  private travelTime: number;
  private travelElapsed: number;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private choiceProvider: ChoiceProvider,
    private kinematicProvider: KinematicProvider,
    private gameProvider: GameProvider,
    private placeProvider: PlaceProvider,
    private stuffProvider: StuffProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TravelPage');
  }

  ngOnInit() {
    this.game = this.gameProvider.get();
    this.c_kinematic = this.kinematicProvider.getFromStorage();
    if (this.navParams.get('from') === "kinematic") {
      this.choice = this.navParams.get('choice');
      this.choice.is_travel = true;
      let currentDate = new Date();
      this.choice.start = currentDate.getTime();
      this.choiceProvider.modify(this.choice);
      this.game.datas["choice"] = this.choice.id;
      this.gameProvider.save(this.game);
      this.travelTime = this.calcTime() - this.calcBonus();
      this.doTravel();
    } else {
      this.choice = this.choiceProvider.getById(this.game.datas["choice"]);
      this.travelTime = this.calcTime() - this.calcBonus();
      if (this.choice.is_travel) {
        this.doTravel();
      }
    }
    let main_loading = document.getElementById("main_loading");
    main_loading.classList.remove("show");
  }

  private doTravel() {
    let currentDate = new Date();
    this.timeTravel = this.calcTime();
    let bonus = this.calcBonus();
    let time = (this.choice.start + this.timeTravel - bonus) - currentDate.getTime();
    let idInterval = setInterval(frame, 1, this, this.navParams.get('parentPage'), bonus);

    function frame(func: any, parent: any, bonus) {
      let date = new Date();
      time = (func.choice.start + (func.timeTravel - bonus)) - date.getTime();
      func.travelElapsed = date.getTime() - func.choice.start;
      if (time <= 0) {
        clearInterval(idInterval);
        func.endTravel();
        parent.refresh();
      } else {
        func.timeQuest = func.timeFormat(time);
        func.doAnimation(func.travelTime, func.travelElapsed);
      }
    }
  }

  private calcTime() {
    let currentPos = this.placeProvider.getById(this.c_kinematic.place_id).position;
    let posToGo: number = 0;
    let diff: number = 0;
    posToGo = this.placeProvider.getById(this.kinematicProvider.getById(this.choice.kinematicId).place_id).position;
    if (currentPos > posToGo) {
      diff = currentPos - posToGo;
    } else {
      diff = posToGo - currentPos;
    }
    return diff * this.timeDefault;
  }

  private calcBonus() {
    let timeBonus = 0;
    let bonus = 0;
    let c_stuff: Stuff = null;
    let inventory: Inventory = this.game.datas["inventory"];
    for (let i = 0; i < inventory.stuffs.length; i += 1) {
      c_stuff = this.stuffProvider.getById(inventory.stuffs[i]);
      if (c_stuff.equiped && c_stuff.type === "travel") {
        bonus += c_stuff.bonus;
      }
    }
    if (bonus >= 1) {
      bonus = 0.99;
    }
    return (this.timeTravel * bonus);
  }

  private endTravel() {
    let main_loading = document.getElementById("main_loading");
    main_loading.classList.add("show");
    this.choice.is_travel = false;
    this.choice.is_travel_end = true;
    this.choiceProvider.modify(this.choice);
    this.navCtrl.pop();
    this.kinematicProvider.modify(this.choice.kinematicId);
    let gamePage = this.navParams.get('parentPage');
    gamePage.refresh();
    this.game.datas["current_kinematic"] = this.choice.kinematicId;
    let current_kinematic = this.kinematicProvider.getById(this.choice.kinematicId);
    this.game.datas["quests_list"] = current_kinematic.assign_quests;
    this.game.datas["choice"] = -1;
    this.gameProvider.save(this.game);
    this.navCtrl.push(this.kinematicPush, {id: this.choice.kinematicId, parentPage: this.navParams.get('parentPage'), value: "kinematic"});
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

  private doAnimation(total: number, elapsed: number) {
    console.log(total, elapsed);
    let walkImg = document.getElementById("walk") as HTMLImageElement;
    let progressBlock = document.getElementById("progress");
    let marginToApply = ((progressBlock.clientWidth - walkImg.clientWidth) * elapsed) / total;
    walkImg.style.marginLeft = marginToApply.toString() + "px";
  }

}
