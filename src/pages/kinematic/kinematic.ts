import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { File } from '@ionic-native/file';

//page
import { GamePage } from '../game/game';

//provider
import { KinematicProvider } from '../../providers/kinematic';
import { CharacterProvider } from '../../providers/character';
import { PlaceProvider } from '../../providers/place';
import { GameProvider } from '../../providers/game';

//data
import { Kinematic } from '../../data/kinematic';
import { Character } from '../../data/character';
import { Place } from '../../data/place';
import { JsonProvider } from '../../data/json';
import { Game } from '../../data/game';

@IonicPage()
@Component({
  selector: 'page-kinematic',
  templateUrl: 'kinematic.html',
})
export class KinematicPage implements OnInit {
  private game: Game = null;
  kinematic: Kinematic;
  character: Character = null;
  next: number = 1;
  current_dialogue: string = "";
  position: string = "left";
  place: Place = null;
  display_add_character = true;
  add_character: Character = null;
  private save: boolean = true;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private kinematicProvider: KinematicProvider,
    private characterProvider: CharacterProvider,
    private placeProvider: PlaceProvider,
    private file: File,
    private gameProvider: GameProvider) {
  }

  ionViewDidLoad() {
  }

  ngOnInit() {
    let arr = this.kinematicProvider.getById(this.navParams.get('id'));
    this.game = this.gameProvider.get();
    if (arr != null) {
      this.kinematic = arr;
      if (this.navParams.get('value') === 'kinematic') {
        if (this.kinematic.actions.music != "") {
          if (this.game.datas["sound"]["music"] != 0) {
            let clic = document.querySelector("#audioClick") as HTMLAudioElement;
            clic.pause;
            clic.src = this.kinematic.actions.music;
            clic.play();
          }
        }
        if (this.kinematic.actions.add_character > 0) {
          this.game.datas["characters_enabled"] += this.kinematic.actions.add_character;
          this.gameProvider.save(this.game);
        }
        this.character = this.characterProvider.getById(this.kinematic.dialogues[0].character);
        this.current_dialogue = this.kinematic.dialogues[0].text;
        this.position = this.kinematic.dialogues[0].position;
      } else {
        this.character = this.characterProvider.getById(this.kinematic.dialogues_before_choice[0].character);
        this.current_dialogue = this.kinematic.dialogues_before_choice[0].text;
        this.position = this.kinematic.dialogues_before_choice[0].position;
      }
    }
    this.place = this.placeProvider.getById(this.kinematicProvider.getFromStorage().place_id);
    let main_loading = document.getElementById("main_loading");
    main_loading.classList.remove("show");
  }

  public change() {
    if (this.navParams.get('value') === 'kinematic') {
      if (this.next <  this.kinematic.dialogues.length) {
        this.current_dialogue = this.kinematic.dialogues[this.next].text;
        this.character = this.characterProvider.getById(this.kinematic.dialogues[this.next].character);
        this.position = this.kinematic.dialogues[this.next].position;
        this.next += 1;
        this.display_add_character = true;
      } else if (this.kinematic.actions.add_character > 0 && this.kinematic.actions.unlock.kinematic != [] && this.display_add_character) {
        this.add_character = this.characterProvider.getById(this.kinematic.actions.characters[0]);
        this.add_character.unlock = true;
        this.characterProvider.modify(this.add_character);
        this.display_add_character = false;
        let addCharacterBlock = document.getElementById("add_character");
        addCharacterBlock.classList.add("show");
        this.save = true;
        console.log("display");
      } else {
        this.saveCurrentKinematic()
        this.navCtrl.pop();
      }
    } else {
      if (this.next <  this.kinematic.dialogues_before_choice.length) {
        this.current_dialogue = this.kinematic.dialogues_before_choice[this.next].text;
        this.character = this.characterProvider.getById(this.kinematic.dialogues_before_choice[this.next].character);
        this.position = this.kinematic.dialogues_before_choice[this.next].position;
        this.next += 1;
      } else if (this.kinematic.actions.add_character > 0 && this.kinematic.actions.unlock.before != [] && this.display_add_character) {
        this.add_character = this.characterProvider.getById(this.kinematic.actions.characters[0]);
        this.add_character.unlock = true;
        this.characterProvider.modify(this.add_character);
        this.display_add_character = false;
        let addCharacterBlock = document.getElementById("add_character");
        addCharacterBlock.classList.add("show");
        this.save = false;
        console.log("display");
      } else {
        this.navCtrl.pop();
      }
    }
  }

  private saveCurrentKinematic() {
    let json = new JsonProvider();
    json.writeJson('currentKinematic', {kinematic: this.kinematic});
  }

  public closeAddCharacter() {
    let addCharacterBlock = document.getElementById("add_character");
    addCharacterBlock.classList.remove("show");
    if (this.save) {
      this.saveCurrentKinematic();
    }
    this.navCtrl.pop();
  }

}
