import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AngularZoneTestComponent } from './angular-zone-test/angular-zone-test.component';
import { PersistenceService } from 'angular-persistence';
import { HttpClientModule } from '@angular/common/http';
import { SessionManagementDirective } from './session-management.directive';

@NgModule({
  declarations: [
    AppComponent,
    AngularZoneTestComponent,
    SessionManagementDirective
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    AppRoutingModule
  ],
  providers: [PersistenceService],
  bootstrap: [AppComponent]
})
export class AppModule { }
