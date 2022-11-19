import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';

import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';

import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';

import { FileOpener } from '@ionic-native/file-opener/ngx';

import { FileTransfer, FileUploadOptions, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { File } from '@ionic-native/file/ngx';

import { SQLitePorter } from '@ionic-native/sqlite-porter/ngx';
import { SQLite, SQLiteObject } from '@ionic-native/sqlite/ngx';

import { HTTP } from '@ionic-native/http/ngx';

import { UniqueDeviceID } from '@ionic-native/unique-device-id/ngx';

import { NativeStorage } from '@ionic-native/native-storage/ngx';


/**Importações de dependencias extrernas devem vir estar nesse arquivo, para que o interpretador consiga encontra-lás 
 * posteriormente, e elas devem estar listadas, dentro dos providers abaixo.
 */

@NgModule({
  declarations: [AppComponent],
  entryComponents: [],
  imports: [
    BrowserModule,
    IonicModule.forRoot(),
    AppRoutingModule
  ],
  providers: [
    StatusBar,
    SplashScreen,
    FileOpener,
    FileTransfer,
    File,
    SQLitePorter,
    SQLite,
    HTTP,
    UniqueDeviceID,
    NativeStorage,
    { provide: RouteReuseStrategy, useClass: IonicRouteStrategy }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
