import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HelpComponent } from './components/help/help.component';
import { UiComponent } from './components/ui/ui.component';
import { UiService } from './services/ui.service';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    // HelpComponent,
    UiComponent
  ],
  exports: [UiComponent, HelpComponent],

  providers: [
    UiService
  ]
})
export class UiModule { }
