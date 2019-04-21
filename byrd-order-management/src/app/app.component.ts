import { Component, OnDestroy } from '@angular/core';
import { IPersistenceComponent } from './interfaces/persistence-component';
import { Router, NavigationStart } from '@angular/router';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnDestroy {
  title = 'Byrd order details';
  private persistenceComponent:IPersistenceComponent;
  private browserRefresh:boolean = false;
  private routerEventSubscription:Subscription;

  constructor(private router: Router) {
    this.routerEventSubscription = router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.browserRefresh = !router.navigated;
      }
    });
  }

  public setRoutedComponent(componentRef:IPersistenceComponent){
    this.persistenceComponent = componentRef;
    if(this.browserRefresh){
      this.persistenceComponent.persistDataAfterRefresh();
    }
  }

  public doPersistenceOfComponentState(e:Event){
    if(this.persistenceComponent){
      this.persistenceComponent.persistDataBeforeRefresh();
    }
  }

  ngOnDestroy(){
    if(this.routerEventSubscription){
      this.routerEventSubscription.unsubscribe();
    }
  }
}
