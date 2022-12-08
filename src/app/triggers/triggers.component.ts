import { Component } from '@angular/core';
import { catchError, map } from 'rxjs/operators';

import { Subscription } from 'rxjs';
import { ErrorHandler } from '../utils/ErrorHandler';
import { TriggerEntityEntityControllerService, CollectionModelEntityModelTriggerEntity,  EntityModelTriggerEntity} from 'iacmf-api';

@Component({
  selector: 'app-triggers',
  templateUrl: './triggers.component.html',
  styleUrls: ['./triggers.component.css']
})
export class TriggersComponent {

  triggers: any[] | undefined = [];
  subscriptions: Subscription[] = [];

  constructor(private service: TriggerEntityEntityControllerService) {
    console.info("I am here");
    this.subscriptions.push(this.service.getCollectionResourceTriggerentityGet1("body", false)
      .pipe(
        catchError(error => ErrorHandler.handleError(error))
      )
      .subscribe((collection: CollectionModelEntityModelTriggerEntity) => {
        console.info(collection);
        this.triggers = collection._embedded?.triggerEntities;
        console.info(this.triggers?.length);
        this.triggers?.forEach(t => console.info(t));
      }));
  }

}
