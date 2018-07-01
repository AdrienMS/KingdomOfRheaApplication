import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { GameProvider } from '../../providers/game';
import { Game } from '../../data/game';

@IonicPage()
@Component({
  selector: 'page-parameters',
  templateUrl: 'parameters.html',
})
export class ParametersPage implements OnInit {
  private muteMusic: boolean = false;
  private music: number = 100;
  private muteEffect: boolean = false;
  private effect: number = 100;
  private game: Game;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private gameProvider: GameProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ParametersPage');
  }

  ngOnInit() {
    this.game = this.gameProvider.get();
    this.music = this.game.datas["sound"]["music"];
    this.effect = this.game.datas["sound"]["effects"];
    if (this.music === 0) {
      this.muteMusic = true;
    }
    if (this.effect === 0) {
      this.muteEffect = true;
    }
  }

  private changeSoundVolume(type: string, value: number) {
    let sound = null as HTMLMediaElement;
    if (type === "music") {
      sound = document.querySelector("#audioPlayer");
      if (sound.paused && value != 0) {
        sound.play();
      }
      this.muteMusic = false;
      if (value === 0) {
        sound.pause();
        this.muteMusic = true;
      }
      sound.volume = (value / 100);
      this.game.datas["sound"]["music"] = value;
    } else {
      sound = document.querySelector("#audioClick");
      this.muteEffect = false;
      if (value === 0) {
        this.muteEffect = true;
      }
      sound.volume = (value / 100);
      this.game.datas["sound"]["effects"] = value;
    }
    this.gameProvider.save(this.game);
  }

  private changeSoundVolumeWithButton(type: string, param: boolean) {
    let sound = null as HTMLMediaElement;
    if (type === "music") {
      sound = document.querySelector("#audioPlayer");
      if (param) {
        this.muteMusic = false;
        sound.volume = 1;
        sound.play();
        this.music = 100;
      } else {
        this.muteMusic = true;
        sound.volume = 0;
        sound.pause();
        this.music = 0;
      }
      this.game.datas["sound"]["music"] = this.music;
    } else {
      sound = document.querySelector("#audioClick");
      if (param) {
        this.muteEffect = false;
        sound.volume = 1;
        this.effect = 100;
      } else {
        this.muteEffect = true;
        sound.volume = 0;
        this.effect = 0;
      }
      this.game.datas["sound"]["effects"] = this.effect;
    }
    this.gameProvider.save(this.game);
  }

}
