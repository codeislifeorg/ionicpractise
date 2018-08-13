import { Storage } from '@ionic/storage';
import { FormsModule } from '@angular/forms';
import { EmiPage } from './../pages/emi/emi';
import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';

import { HomePage } from '../pages/home/home';
import { HistoryPage } from './../pages/history/history';
import { LoanComparePage } from './../pages/loan-compare/loan-compare';
import { ListProfilePage } from './../pages/list-profile/list-profile';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { IonicStorageModule } from '@ionic/storage';

@NgModule({
  declarations: [
    MyApp,    
    HomePage,
    EmiPage,
    HistoryPage,
    ListProfilePage,
    LoanComparePage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    IonicModule.forRoot(MyApp, {
      backButtonText: '',
      backButtonIcon: 'ios-arrow-back',
      iconMode: 'md'
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    EmiPage,
    HistoryPage,
    ListProfilePage,
    LoanComparePage,
  ],
  providers: [
    StatusBar,
    SplashScreen,
    {provide: ErrorHandler, useClass: IonicErrorHandler}    
  ]
})
export class AppModule {} 