import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

//provider
import { KinematicProvider } from '../../providers/kinematic';
import { QuestProvider } from '../../providers/quest';
import { GameProvider } from '../../providers/game';
import { InventoryProvider } from '../../providers/inventory';
import { PlaceProvider } from '../../providers/place';
import { ChoiceProvider } from '../../providers/choice';

//page
import { KinematicPage } from '../kinematic/kinematic';
import { QuestsPage } from '../quests/quests';
import { InventoryPage } from '../inventory/inventory';
import { MapPage } from '../map/map';
import { ChoicePage } from '../choice/choice';
import { ParametersPage } from '../parameters/parameters';
import { CharacterGuidePage } from '../character-guide/character-guide';
import { TravelPage } from '../travel/travel';

//data
import { Kinematic } from '../../data/kinematic';
import { JsonProvider } from '../../data/json';
import { Quest } from '../../data/quest';
import { Game } from '../../data/game';
import { Inventory } from '../../data/inventory';
import { Place } from '../../data/place';
import { Choice } from '../../data/choice';

@IonicPage()
@Component({
  selector: 'page-game',
  templateUrl: 'game.html',
})
export class GamePage implements OnInit{
  public questsPush = QuestsPage;
  public inventoryPush = InventoryPage;
  public mapPush = MapPage;
  public choicePush = ChoicePage;
  public questsParams: any = {};
  public inventoryParams: any = {};
  public mapParams: any = {};
  public choiceParams: any = {};
  private kinematicId: number = 0;
  private json: JsonProvider = new JsonProvider();
  public isQuestsFinished: boolean = false;
  private quests: Quest[] = [];
  private currentKinematic: Kinematic = null;
  private game: Game = null;
  private place: Place = null;
  private is_playing = true;
  public parametersPush = ParametersPage;
  public characterGuidePush = CharacterGuidePage;
  public travelPush = TravelPage;

  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    private kinematicProvider: KinematicProvider,
    private questProvider: QuestProvider,
    private gameProvider: GameProvider,
    private choiceProvider: ChoiceProvider,
    private inventoryProvider: InventoryProvider,
    private placeProvider: PlaceProvider) {
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    let main_loading = document.getElementById("main_loading");
    main_loading.classList.add("show");
    if (this.navParams.get('status') === 'new') {
      this.json.saveInLocalStorage();
      this.kinematicProvider.refresh();
      this.kinematicProvider.modify(this.kinematicId);
      this.navCtrl.push(KinematicPage, {id:this.kinematicId, parentPage: this, value: "kinematic"});
      this.game = this.gameProvider.get();
      this.game.is_saved = true;
      this.isQuestsFinished = false;
      this.game.datas["current_kinematic"] = this.kinematicId;
      let current_kinematic = this.kinematicProvider.getById(this.kinematicId);
      this.game.datas["quests_list"] = current_kinematic.assign_quests;
      this.game.datas["inventory"] = this.inventoryProvider.get();
      this.game.datas["sound"] = {music: 50, effects: 50};
      this.gameProvider.save(this.game);
      this.place = this.placeProvider.getById(this.kinematicProvider.getFromStorage().place_id);
      let music = document.querySelector("#audioPlayer") as HTMLMediaElement;
      music.loop = true;
      music.play();
      //this.loading = false;
    } else {
      this.place = this.placeProvider.getById(this.kinematicProvider.getFromStorage().place_id);
      this.game = this.gameProvider.get();
      let music = document.querySelector("#audioPlayer") as HTMLMediaElement;
      music.loop = true;
      if (this.game.datas["sound"]["music"] != 0) {
        music.play();
      }
      if (this.game.datas["choice"] != -1) {
        this.checkIfTravel();
      } else {
        let main_loading = document.getElementById("main_loading");
        main_loading.classList.remove("show");
      }
      //this.kinematicProvider.modify(this.kinematicProvider.getFromStorage());
    }
    //this.initButtonQuest();
    this.questsParams = {
      parentPage: this
    };
    this.refresh();
  }

  private checkIfTravel() {
    let choice: Choice = this.choiceProvider.getById(this.game.datas["choice"]);
    this.navCtrl.push(this.travelPush, {id: choice.kinematicId, parentPage: this, value: "kinematic", choice: choice, from: 'game'});
  }

  public initButtonQuest() {
    let arr = this.kinematicProvider.getById(this.kinematicId);
    if (arr != null) {
      let kinematic: Kinematic = arr;
      this.questsParams = {
        ids: kinematic.assign_quests,
        parentPage: this
      };
      this.initQuest(kinematic.assign_quests);
    }
  }

  private initQuest(quests) {
    let is_finished = true;
    let questsIDs = quests;
    let quest: Quest;
    for (let i = 0; i < questsIDs.length; i += 1) {
      quest = this.questProvider.getById(questsIDs[i]);
      if (quest != null) {
        this.quests.push(quest);
      }
    }
    this.Finished();
  }

  finishQuest(id: number) {
    let quest = this.questProvider.getById(id);
    let game = this.gameProvider.get();
    let inventory: Inventory = game.datas.inventory;
    if (quest.validate != true) {
      quest.validate = true;
      game.datas.characters_enabled += quest.send_characters;
      for (let i = 0; i < quest.loot.length; i += 1) {
        if (inventory.stuffs.indexOf(quest.loot[i]) === -1) {
          game.datas.inventory.stuffs.push(quest.loot[i]);
        }
      }
      this.questProvider.modify(quest);
      this.gameProvider.save(game);
      this.Finished();
    }
  }

  Finished() {
    this.refresh();
    for (let i = 0; i < this.quests.length; i += 1) {
      if (this.quests[i].validate === false) {
        return;
      }
    }
    this.isQuestsFinished = true;
  }

  doChoice() {
    let main_loading = document.getElementById("main_loading");
    main_loading.classList.add("show");
    this.playSound();
    let kinematic: Kinematic = this.kinematicProvider.getById(this.kinematicId);
    this.navCtrl.push(ChoicePage, {choices: kinematic.choices, parentPage: this});
    this.navCtrl.push(KinematicPage, {id:this.kinematicId, parentPage: this, value: "before_choice"});
  }

  refresh() {
    this.currentKinematic = this.json.getJson('currentKinematic').kinematic;
    this.place = this.placeProvider.getById(this.kinematicProvider.getFromStorage().place_id);
    let music = document.querySelector("#audioPlayer") as HTMLMediaElement;
    music.src = this.place.music;
    if (this.game.datas["sound"]["music"] != 0) {
      music.play();
    }
    this.loadQuests();
    this.initNextPlace();
  }

  private loadQuests() {
    let questsIDs = this.currentKinematic.assign_quests;
    this.quests = [];
    for (let i = 0; i < questsIDs.length; i += 1) {
      this.quests.push(this.questProvider.getById(questsIDs[i]));
    }
  }

  private initNextPlace() {
    this.isQuestsFinished = false;
    for (let i = 0; i < this.quests.length; i += 1) {
      if (this.quests[i].validate === false) {
        return;
      }
    }
    this.isQuestsFinished = true;
  }

  private stop_play_music() {
    let music = document.querySelector("#audioPlayer") as HTMLMediaElement;
    if (this.is_playing) {
      music.pause();
      this.is_playing = false;
    } else {
      music.play();
      this.is_playing = true;
    }
  }

  public playSound() {
    if (this.game.datas["sound"]["effects"] != 0) {
      let clic = document.querySelector("#audioClick") as HTMLAudioElement;
      clic.play();
    }
  }

}
