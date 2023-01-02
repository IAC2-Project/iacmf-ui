import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {ComplianceJobEntity, KVEntity, ProductionSystemEntity, ProductionSystemService} from "iacmf-api";
import {ProductionSystemsComponent} from "../production-systems.component";

@Component({
  selector: 'app-select-production-sytem',
  templateUrl: './select-production-sytem.component.html',
  styleUrls: ['./select-production-sytem.component.css']
})
export class SelectProductionSytemComponent implements OnInit {

  productionSystemEntities: ProductionSystemEntity[] = [];

  selected = -1;

  @Output("selectedProductionSystem")
  selectedProductionSystem = new EventEmitter();

  constructor(public productionSystemService: ProductionSystemService) {
  }

  ngOnInit(): void {
    this.productionSystemService.getCollectionResourceProductionsystementityGet1().subscribe(resp => resp._embedded?.productionSystemEntities?.forEach(data => this.productionSystemEntities.push(ProductionSystemsComponent.toProductionSystemEntity(data))))
  }

  _filter(id: number | undefined) {
    return this.productionSystemEntities.filter(ps => ps.id == id);
  }

  emitProductionSystem() {
    this.selectedProductionSystem.emit(this.selected);
  }
}
