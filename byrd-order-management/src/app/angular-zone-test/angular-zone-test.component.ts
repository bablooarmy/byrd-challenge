import { Component, OnInit, NgZone } from '@angular/core';
import { PersistenceService, StorageType } from 'angular-persistence';
import { LoginService } from '../login.service';

@Component({
  selector: 'app-angular-zone-test',
  templateUrl: './angular-zone-test.component.html',
  styleUrls: ['./angular-zone-test.component.scss']
})
export class AngularZoneTestComponent implements OnInit {

  progress: number = 0;
  label: string;

  constructor(private _ngZone:NgZone) { }

  ngOnInit() {

  }
  // Loop inside the Angular zone
  // so the UI DOES refresh after each setTimeout cycle
  processWithinAngularZone() {
    this.label = 'inside';
    this.progress = 0;
    this._increaseProgress(() => console.log('Inside Done!'));
  }

  // Loop outside of the Angular zone
  // so the UI DOES NOT refresh after each setTimeout cycle
  processOutsideOfAngularZone() {
    this.label = 'outside';
    this.progress = 0;
    this._ngZone.runOutsideAngular(() => {
      this._increaseProgress(() => {
        // reenter the Angular zone and display done
        //this._ngZone.run(() => { console.log('Outside Done!'); });
        console.log('Outside done');
      });
    });
  }

  _increaseProgress(doneCallback: () => void) {
    this.progress += 1;
    console.log(`Current progress: ${this.progress}%`);

    if (this.progress < 100) {
      window.setTimeout(() => this._increaseProgress(doneCallback), 10);
    } else {
      doneCallback();
    }
  }
}
