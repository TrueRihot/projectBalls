import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ThreejsSceneComponent } from './components/threejs-scene/threejs-scene.component';
import { HelpComponent } from './components/ui/help/help.component';
import { UiComponent } from './components/ui/ui/ui.component';

@NgModule({
  declarations: [
    AppComponent,
    ThreejsSceneComponent,
    HelpComponent,
    UiComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
