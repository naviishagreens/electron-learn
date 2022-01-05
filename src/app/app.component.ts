import { Component } from '@angular/core';
import { IpcRenderer } from 'electron';
import { Action } from 'rxjs/internal/scheduler/Action';

declare global {
  interface Window {
      api:any;
  }
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'electron-learn';
  fileContent = '';

  private ipc!: IpcRenderer;

  delay(action: Function) {
    setTimeout(action, 5000);
  }

  // do not use ipc renderer directly in code
  // constructor(){
  //   this.delay(() => {
  //     if ((<any>window).require) {
  //       try {
  //         this.ipc = (<any>window).require('electron').ipcRenderer;
  //       } catch (e) {
  //         throw e;
  //       }
  //     } else {
  //       console.warn('App not running inside Electron!');
  //     }
  //   });
  // }

  // do not use ipc directly in code
  // openModal(){
  //   console.log("Open a modal");
  //   this.ipc.send("openModal");
  // }

  constructor() {
    if(!window.api) {
      console.log('window.api does not exist in electron.');
    } else {
      console.log('window api exists:', window.api);
      this.receiveFromMain();
    }
  }

  private receiveFromMain() {
    window.api.receive("fromMain", (data: any) => {
      this.fileContent = data;
      //console.log(`Received ${data} from main process`);
  });
  }

  sendOpenToMain() {
    window.api.send("toMain", "some data");
  }
}
