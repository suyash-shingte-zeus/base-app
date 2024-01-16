import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MfeLoaderComponent } from './mfe-loader/mfe-loader.component';
import { LoggerModule, NgxLoggerLevel, NGXLogger } from 'ngx-logger';


@NgModule({
  declarations: [
    MfeLoaderComponent
  ],
  imports: [
    CommonModule,
    LoggerModule.forRoot({
      level: NgxLoggerLevel.DEBUG,
    })
  ],
})
export class MfeContentModule { }
