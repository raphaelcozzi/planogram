import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { PlanogramPagePageRoutingModule } from './planogram-page-routing.module';

import { PlanogramPagePage } from './planogram-page.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PlanogramPagePageRoutingModule
  ],
  declarations: [PlanogramPagePage]
})
export class PlanogramPagePageModule {}
