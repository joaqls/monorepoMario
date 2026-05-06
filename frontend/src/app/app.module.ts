import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { AppComponent } from './app.component';
import { ItemPageComponent } from './features/personaje/personaje-page/personaje-page.component';
import { ItemCardComponent } from './features/personaje/personaje-card/personaje-card.component';
import { NewItemComponent } from './features/personaje/new-personaje/new-personaje.component';
import { DeleteItemComponent } from './features/personaje/delete-personaje/delete-personaje.component';

@NgModule({
  declarations: [
    AppComponent,
    ItemPageComponent,
    ItemCardComponent,
    NewItemComponent,
    DeleteItemComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
