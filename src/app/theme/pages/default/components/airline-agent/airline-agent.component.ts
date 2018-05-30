import { Component, OnInit, AfterViewInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import { ScriptLoaderService } from '../../../../../_services/script-loader.service';
import { NgForm } from '@angular/forms';
import { AirlineAgentService } from '../../../../../_services/airline-agent.service';
import { Subscription } from 'rxjs/Subscription';
import { AirlineAgent } from '../../../../../_models/airline-agent.model';
import { trimObjectAfterSave } from '../../../../../_utils/trimObject';
import { find } from 'lodash';

@Component({
  selector: 'app-airline-agent',
  templateUrl: './airline-agent.component.html',
  encapsulation: ViewEncapsulation.None
})


export class AirlineAgentComponent implements OnInit, OnDestroy, AfterViewInit {
  private subs: Subscription
  private list: AirlineAgent[]
  private currentItem: AirlineAgent = {
    id: '',
    airlineAgentName: '',
    airlineAgentCode: '',
    description: '',
  }
  
  constructor(private _script: ScriptLoaderService, private _service: AirlineAgentService) {
  }

  ngOnInit() {
    this.subs = this._service.getAirlineAgent().subscribe(rs => {
      this.list = rs as AirlineAgent[]
      console.log(this.list);
    })
  }

  ngAfterViewInit() {
    this._script.loadScripts('app-airline-agent',
      [
        'assets/vendors/custom/datatables/datatables.bundle.js',
        'assets/demo/default/custom/crud/datatables/basic/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
  }

  onSubmit(from: NgForm) {
    const agent = trimObjectAfterSave(from.value)
    this.subs = this._service.postAirlineAgent(agent).subscribe(rs => {
      this.list.push(rs as AirlineAgent)
    })
  }

  onEdit(id) {
    this.currentItem = find(this.list, (item) => {
      return item.id == id
    })
    console.log(this.currentItem);
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
