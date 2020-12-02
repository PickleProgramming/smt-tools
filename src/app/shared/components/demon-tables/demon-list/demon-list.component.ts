//Modeled after compendium/components/SMT-DEMON-LIST from aqiu384's repo
import { Component, ChangeDetectionStrategy, Input } from '@angular/core';
import { PositionEdgesService } from 'src/app/shared/services/position-edges.service';
import { Demon } from 'src/app/shared/models/compendiumModels';
import { _DemonListComponent } 
	from 'src/app/shared/components/partials/_demon-list.component';

@Component({
	selector: 'tr.app-demon-list-row',
	changeDetection: ChangeDetectionStrategy.OnPush,
	templateUrl: './tr.app-demon-list-row.html'
})
export class DemonListRowComponent {
	@Input() isEnemy = false;
	@Input() hasInherits = false;
	@Input() hasAffinity = false;
	@Input() data?: Demon;
}

@Component({
	selector: 'app-demon-list',
	changeDetection: ChangeDetectionStrategy.OnPush,
	providers: [PositionEdgesService],
	template: `
    <table appPositionSticky>
      <tfoot #stickyHeader appColumnWidths
        class="app-demon-list-header sticky-header"
        [isPersona]="isPersona"
        [isEnemy]="isEnemy"
        [hasInherits]="inheritOrder"
        [statHeaders]="statHeaders"
        [resistHeaders]="resistHeaders"
        [affinityHeaders]="affinityHeaders"
        [sortFunIndex]="sortFunIndex"
        (sortFunIndexChanged)="sortFunIndex = $event">
      </tfoot>
    </table>
    <table>
      <tfoot #hiddenHeader appColumnWidths
        class="app-demon-list-header"
        [isPersona]="isPersona"
        [isEnemy]="isEnemy"
        [hasInherits]="inheritOrder"
        [statHeaders]="statHeaders"
        [resistHeaders]="resistHeaders"
        [affinityHeaders]="affinityHeaders"
        [style.visibility]="'collapse'">
      </tfoot>
      <tbody>
        <tr *ngFor="let data of rowData"
          class="app-demon-list-row"
          [isEnemy]="isEnemy"
          [hasInherits]="inheritOrder"
          [hasAffinity]="affinityHeaders"
          [ngClass]="{
            special: data.fusion === 'special',
            exception: data.fusion !== 'special' && data.fusion !== 'normal'
          }"
          [data]="data">
        </tr>
      </tbody>
    </table>
  `
})
export class DemonListComponent extends _DemonListComponent<Demon> {
	@Input() isPersona = false;
	@Input() isEnemy = false;
}