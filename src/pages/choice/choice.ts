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
import { Kinematic } from '../../data/kinematic';
import { Stuff } from '../../data/stuff';
import { Inventory } from '../../data/inventory';

//page
import { KinematicPage } from '../kinematic/kinematic';
import { GamePage } from '../game/game';
import { TravelPage } from '../travel/travel';

@IonicPage()
@Component({
  selector: 'page-choice',
  templateUrl: 'choice.html',
})
export class ChoicePage implements OnInit {
  public choices: Choice[] = [];
  public kinematicPush = KinematicPage;
  public kinematicParam: any[] = [];
  public travelPush = TravelPage;
  private game: Game = null;
  private c_kinematic: Kinematic = null;
  private timeChoice: number[] = [];
  private timeDefault: number = 50000;
  private timeBonus: number[] = [];
  private displayTimeChoice: string[] = [];
  private displayTimeBonus: string[] = [];

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
    console.log('ionViewDidLoad ChoicePage');
  }

  ngOnInit() {
    let choicesID: number[] = this.navParams.get('choices');
    this.c_kinematic = this.kinematicProvider.getFromStorage();
    this.game = this.gameProvider.get();
    for (let i = 0; i < choicesID.length; i += 1) {
      this.choices.push(this.choiceProvider.getById(choicesID[i]));
    }
    this.calcTime();
    this.calcBonus();
    this.doFormat();
    let main_loading = document.getElementById("main_loading");
    main_loading.classList.remove("show");
  }

  public clickChoice(index: number) {
    this.navCtrl.pop();
    // this.kinematicProvider.modify(this.choices[index].kinematicId);
    // let gamePage = this.navParams.get('parentPage');
    // gamePage.refresh();
    // this.game.datas["current_kinematic"] = this.choices[index].kinematicId;
    // let current_kinematic = this.kinematicProvider.getById(this.choices[index].kinematicId);
    // this.game.datas["quests_list"] = current_kinematic.assign_quests;
    // this.gameProvider.save(this.game);
    this.navCtrl.push(this.travelPush, {id: this.choices[index].kinematicId, parentPage: this.navParams.get('parentPage'), value: "kinematic", choice: this.choices[index], from: 'kinematic'});
    //this.navCtrl.push(this.kinematicPush, {id: this.choices[index].kinematicId, parentPage: this.navParams.get('parentPage'), value: "kinematic"});
  }

  private calcTime() {
    let currentPos = this.placeProvider.getById(this.c_kinematic.place_id).position;
    let posToGo: number = 0;
    let diff: number = 0;
    for (let i = 0; i < this.choices.length; i += 1) {
      posToGo = this.placeProvider.getById(this.kinematicProvider.getById(this.choices[i].kinematicId).place_id).position;
      if (currentPos > posToGo) {
        diff = currentPos - posToGo;
      } else {
        diff = posToGo - currentPos;
      }
      this.timeChoice.push((diff * this.timeDefault));
    }
  }

  private calcBonus() {
    let timeBonus = 0;
    let bonus = 0;
    let c_stuff: Stuff = null;
    let inventory: Inventory = this.game.datas["inventory"];
    console.log(inventory.stuffs);
    for (let i = 0; i < inventory.stuffs.length; i += 1) {
      c_stuff = this.stuffProvider.getById(inventory.stuffs[i]);
      console.log(c_stuff);
      if (c_stuff.equiped && c_stuff.type === "travel") {
        bonus += c_stuff.bonus;
      }
    }
    if (bonus >= 1) {
      bonus = 0.99;
    }
    for (let i = 0; i < this.timeChoice.length; i += 1) {
      this.timeBonus.push(this.timeChoice[i] * bonus);
    }
  }

  private doFormat() {
    for (let i = 0; i < this.timeChoice.length; i += 1) {
      this.displayTimeChoice.push(this.timeFormat(this.timeChoice[i]));
    }
    for (let i = 0; i < this.timeBonus.length; i += 1) {
      this.displayTimeBonus.push(this.timeFormat(this.timeBonus[i]));
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

}
