import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LineChartComponent } from './line-chart/line-chart.component';
import { CustomDumbbellComponent } from './custom-dumbbell/custom-dumbbell.component';

@NgModule({
  declarations: [
    AppComponent,
    LineChartComponent,
    CustomDumbbellComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
