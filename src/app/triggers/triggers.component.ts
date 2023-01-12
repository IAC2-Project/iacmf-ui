import {Component} from '@angular/core';
import {catchError} from 'rxjs/operators';

import {Subscription} from 'rxjs';
import {ErrorHandler} from '../utils/ErrorHandler';
import {
  CollectionModelEntityModelTriggerEntity,
  EntityModelTriggerEntity,
  TriggerEntity,
  TriggerService
} from 'iacmf-api';

@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.css']
})
export class TriggersComponent {

  triggers: EntityModelTriggerEntity[] | undefined = [];
  subscriptions: Subscription[] = [];

  constructor(private service: TriggerService) {
    console.info("I am here");
    // @ts-ignore
    this.subscriptions.push(this.service.getCollectionResourceTriggerentityGet1("body", false)
      .pipe(
        // @ts-ignore
        catchError(error => ErrorHandler.handleError(error))
      )
      .subscribe((collection: CollectionModelEntityModelTriggerEntity) => {
        console.info(collection);
        this.triggers = collection._embedded?.triggerEntities;
      }));
  }

}
