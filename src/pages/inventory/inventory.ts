import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//provider
import { StuffProvider } from '../../providers/stuff';
import { InventoryProvider } from '../../providers/inventory';
import { GameProvider } from '../../providers/game';

//data
import { Stuff } from '../../data/stuff';
import { Inventory } from '../../data/inventory';
import { Game } from '../../data/game';

//page
import { StuffPage } from '../stuff/stuff';

@IonicPage()
@Component({
  selector: 'page-inventory',
  templateUrl: 'inventory.html',
})
export class InventoryPage implements OnInit {
  private game: Game = null;
  public stuffs: Stuff[] = [];
  public inventory: Inventory;
  public equipedStuffs: Stuff[] = [];
  public stuffPush = StuffPage;
  public stuffParams: any[] = []
  public stuffParamsEquiped: any[] = []

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private inventoryProvider: InventoryProvider,
    private gameProvider: GameProvider,
    private stuffProvider: StuffProvider) {
  }

  ngOnInit() {
    this.game = this.gameProvider.get();
    this.refresh();
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad InventoryPage');
  }

  refresh() {
    this.inventory = this.game["datas"]["inventory"];
    let c_stuff: Stuff = null;
    this.equipedStuffs = [];
    this.stuffs = [];
    this.stuffParamsEquiped = [];
    this.stuffParams = [];
    for (let i = 0; i < this.inventory.stuffs.length; i += 1) {
      c_stuff = this.stuffProvider.getById(this.inventory.stuffs[i]);
      if (c_stuff.equiped) {
        this.stuffParamsEquiped.push({id: this.inventory.stuffs[i], parentPage: this});
        this.equipedStuffs.push(c_stuff);
      } else {
        this.stuffParams.push({id: this.inventory.stuffs[i], parentPage: this});
        this.stuffs.push(c_stuff);
      }
    }
  }

  public close() {
    this.playSound();
    this.navCtrl.pop();
  }

  public playSound() {
    if (this.game.datas["sound"]["effects"] != 0) {
      let clic = document.querySelector("#audioClick") as HTMLAudioElement;
      clic.play();
    }
  }

}
