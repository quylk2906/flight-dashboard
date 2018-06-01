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
  public list: AirlineAgent[]
  public currentItem: AirlineAgent = {
    id: undefined,
    airlineAgentName: undefined,
    airlineAgentCode: undefined,
    description: undefined,
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
        'assets/demo/default/custom/crud/datatables/standard/paginations.js',
        'assets/demo/default/custom/crud/forms/validation/form-controls.js'
      ]);
  }

  onSubmit(form: NgForm) {
    if (form.invalid) {
      return
    }
    const agent = trimObjectAfterSave(form.value)
    if (this.currentItem.id) {
      this.subs = this._service.putAirlineAgent(agent).subscribe(rs => {
        // you have to call api to reload datable without reload page
        window.location.reload()
      })
    } else {
      this.subs = this._service.postAirlineAgent(agent).subscribe(rs => {
        this.list.push(rs as AirlineAgent)
        // you have to call api to reload datable without reload page
        window.location.reload()
      })
    }
  }

  onDelete(id) {
    this.subs = this._service.deleteAirlineAgent(id).subscribe(rs => {
      if (rs['count'] !== 0) {
        // you have to call api to reload datable without reload page
        window.location.reload()
      }
    })
  }

  onEdit(id) {
    this.currentItem = find(this.list, (item) => {
      return item.id == id
    })
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe()
  }
}
