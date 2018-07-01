import { Component, OnInit } from '@angular/core';
import { NavController } from 'ionic-angular';
import { ScreenOrientation } from '@ionic-native/screen-orientation';

//page
import { GamePage } from '../game/game';

//provider
import { GameProvider } from '../../providers/game';

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage implements OnInit {
  public is_saved: boolean = false;
  public status = [
    {status: 'continue'},
    {status: 'new'},
  ];
  public pushGame = GamePage;

  constructor(public navCtrl: NavController, private screenOrientation: ScreenOrientation, private gameProvider: GameProvider) {
  }

  ngOnInit() {
    //this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.LANDSCAPE);
    console.log(this.gameProvider.get());
    if (this.gameProvider.get() != null && this.gameProvider.get().is_saved) {
      this.is_saved = true;
    } else {
      //do something
    }
    let main_loading = document.getElementById("main_loading");
    main_loading.classList.remove("show");
  }

}
