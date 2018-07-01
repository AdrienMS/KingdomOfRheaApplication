import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { StuffPage } from './stuff';

@NgModule({
  declarations: [
    StuffPage,
  ],
  imports: [
    IonicPageModule.forChild(StuffPage),
  ],
})
export class StuffPageModule {}
