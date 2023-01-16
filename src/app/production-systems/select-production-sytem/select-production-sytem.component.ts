import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {
  ComplianceJobEntity,
  EntityModelProductionSystemEntity,
  KVEntity,
  ProductionSystemEntity,
  ProductionSystemService
} from "iacmf-client";
import {ProductionSystemsComponent} from "../production-systems.component";
import {Utils} from "../../utils/utils";


@Component({
  selector: 'app-select-production-sytem',
  templateUrl: './select-production-sytem.component.html',
  styleUrls: ['./select-production-sytem.component.css']
})
export class SelectProductionSytemComponent implements OnInit {

  productionSystemEntities: EntityModelProductionSystemEntity[] = [];

  selected = -1;

  @Output("selectedProductionSystem")
  selectedProductionSystem = new EventEmitter();

  constructor(public productionSystemService: ProductionSystemService, public utils: Utils) {
  }

  ngOnInit(): void {
    this.productionSystemService.getCollectionResourceProductionsystementityGet1().subscribe(resp => resp._embedded?.productionSystemEntities?.forEach(data => this.productionSystemEntities.push(data)))
  }

  _filter(id: number | undefined) {
    return this.productionSystemEntities.filter(ps => Number(this.utils.getId(ps)) == id);
  }

  emitProductionSystem() {
    this.selectedProductionSystem.emit(this.selected);
  }
}
