import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ListProfilePage } from './list-profile';

@NgModule({
  declarations: [
    ListProfilePage,
  ],
  imports: [
    IonicPageModule.forChild(ListProfilePage),
  ],
})
export class ListProfilePageModule {}
