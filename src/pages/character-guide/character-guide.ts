import { Component, OnInit } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

import { CharacterProvider } from '../../providers/character';
import { Character } from '../../data/character';

export class CharacterGuide {
  public id: number;
  public name: string;
  public desc: string;
  public sprites: string[];
  public unlock: boolean;

  constructor(id, name, desc, sprites, unlock) {
    this.id = id;
    this.name = name;
    this.desc = desc;
    this.sprites = sprites;
    this.unlock = unlock;
  }
}

@IonicPage()
@Component({
  selector: 'page-character-guide',
  templateUrl: 'character-guide.html',
})
export class CharacterGuidePage implements OnInit {
  private characters: Character[] = [];
  private displayCharacters: CharacterGuide[] = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    private characterProvider: CharacterProvider) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CharacterGuidePage');
  }

  ngOnInit() {
    this.characters = this.characterProvider.get();
    console.log(this.characters);
    for (let i = 0; i < this.characters.length; i += 1) {
      if (this.characters[i].link === -1) {
        this.displayCharacters.push(new CharacterGuide(this.characters[i].id, this.characters[i].name, this.characters[i].desc, [this.characters[i].sprite], this.characters[i].unlock));
      } else {
        for (let j = 0; j < this.displayCharacters.length; j += 1) {
          if (this.displayCharacters[j].id === this.characters[i].link) {
            this.displayCharacters[j].sprites.push(this.characters[i].sprite);
          }
        }
      }
    }
    console.log(this.displayCharacters);
  }

}
