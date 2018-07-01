import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CharacterGuidePage } from './character-guide';

@NgModule({
  declarations: [
    CharacterGuidePage,
  ],
  imports: [
    IonicPageModule.forChild(CharacterGuidePage),
  ],
})
export class CharacterGuidePageModule {}
