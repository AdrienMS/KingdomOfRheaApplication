import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams, Checkbox } from 'ionic-angular';

//provider
import { StuffProvider } from '../../providers/stuff';
import { GameProvider } from '../../providers/game';

//data
import { Stuff } from '../../data/stuff';
import { Game } from '../../data/game';
import { Inventory } from '../../data/inventory';


@IonicPage()
@Component({
  selector: 'page-stuff',
  templateUrl: 'stuff.html',
})
export class StuffPage implements OnInit {
  private game: Game = null;
  public stuff: Stuff = null;
  private stuffs: Stuff[] = [];
  public inventory: Inventory;
  public limit: boolean = false;
  public limitStuff: number;

  constructor(public navCtrl: NavController,
  public navParams: NavParams,
  private stuffProvider: StuffProvider,
  private gameProvider: GameProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad StuffPage');
  }

  ngOnInit() {
    this.game = this.gameProvider.get();
    this.stuff = this.stuffProvider.getById(this.navParams.get('id'));
    this.inventory = this.game["datas"]["inventory"];
    this.getStuffs();
    this.limitStuff = this.game.datas["characters_enabled"] * 2;
  }

  public change() {
    //let checkboxBlock = document.getElementById("checkbox");
    if (this.stuff.equiped) {
      this.stuff.equiped = false;
    } else if (this.stuffs.length < this.limitStuff) {
      this.stuff.equiped = true;
    } else {
      this.limit = true;
      console.log("limit");
      //let child = checkboxBlock.children.item(0);
      //console.log(child.classList);
      //child.classList.remove("checkbox-checked");
    }
    this.getStuffs();
    this.stuffProvider.modify(this.stuff);
    this.navParams.get("parentPage").refresh();
  }

  private getStuffs() {
    this.stuffs = [];
    let c_stuff: Stuff = null;
    for (let i = 0; i < this.inventory.stuffs.length; i += 1) {
      c_stuff = this.stuffProvider.getById(this.inventory.stuffs[i]);
      if (c_stuff.equiped) {
        this.stuffs.push(c_stuff);
      }
    }
  }

  public closeLimit() {
    this.limit = false;
  }

}
