import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { HomePage } from './home.page';
import { ListingComponent } from '../listing/listing.component';
import { UserPopoverComponent } from '../user-popover/user-popover.component';
import { VoterDetailsComponent } from '../voter-details/voter-details.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild([
      {
        path: '',
        component: HomePage
      }
    ])
  ],
  declarations: [HomePage, ListingComponent, UserPopoverComponent, VoterDetailsComponent],
  entryComponents: [UserPopoverComponent, VoterDetailsComponent]
})
export class HomePageModule {}
