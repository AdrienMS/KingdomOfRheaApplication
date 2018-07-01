import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { ScreenOrientation } from '@ionic-native/screen-orientation';
import { File } from '@ionic-native/file';

import { MyApp } from './app.component';

//pages
import { HomePage } from '../pages/home/home';
import { GamePage } from '../pages/game/game';
import { InventoryPage } from '../pages/inventory/inventory';
import { ItemPage } from '../pages/item/item';
import { KinematicPage } from '../pages/kinematic/kinematic';
import { MapPage } from '../pages/map/map';
import { QuestsPage } from '../pages/quests/quests';
import { QuestPage } from '../pages/quest/quest';
import { ChoicePage } from '../pages/choice/choice';
import { StuffPage } from '../pages/stuff/stuff';
import { ParametersPage } from '../pages/parameters/parameters';
import { CharacterGuidePage } from '../pages/character-guide/character-guide';
import { TravelPage } from '../pages/travel/travel';

//providers
import { KinematicProvider } from '../providers/kinematic';
import { GameProvider } from '../providers/game';
import { CharacterProvider } from '../providers/character';
import { QuestProvider } from '../providers/quest';
import { ChoiceProvider } from '../providers/choice';
import { InventoryProvider } from '../providers/inventory';
import { StuffProvider } from '../providers/stuff';
import { PlaceProvider } from '../providers/place';

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    GamePage,
    InventoryPage,
    ItemPage,
    KinematicPage,
    MapPage,
    QuestsPage,
    QuestPage,
    ChoicePage,
    StuffPage,
    ParametersPage,
    CharacterGuidePage,
    TravelPage
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp)
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    GamePage,
    InventoryPage,
    ItemPage,
    KinematicPage,
    MapPage,
    QuestsPage,
    QuestPage,
    ChoicePage,
    StuffPage,
    ParametersPage,
    CharacterGuidePage,
    TravelPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    ScreenOrientation,
    File,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    KinematicProvider,
    GameProvider,
    CharacterProvider,
    QuestProvider,
    ChoiceProvider,
    InventoryProvider,
    StuffProvider,
    PlaceProvider
  ]
})
export class AppModule {}
