import { Component, ContentChildren, QueryList, AfterContentInit, Input } from '@angular/core';
import { AccordionGroupComponent } from './accordion-group.component';

@Component({
  selector: 'app-example',
  template: `<div class="mypanel" role="tab" [id]="'heading'+data.id">
	<h4 class="title">
		<a role="button" data-toggle="collapse" data-parent="#accordion" [href]="'#collapse'+data.id" aria-expanded="true" [attr.aria-controls]="'collapse'+data.id">
			{{data.header}}
		</a>
	</h4>
</div>
<div [id]="'collapse'+data.id" class="panel-collapse collapse" role="tabpanel" [attr.aria-labelledby]="'heading'+data.id">
	<div class="body">
		<p>{{data.content}}</p>
	</div>
</div>`,
  //   template: `
  //     <ng-content></ng-content>
  // `,
  styleUrls: ['./accordion.component.css']
})
export class AccordionComponent
//implements AfterContentInit
{
  @Input("data") data: any;
  // @ContentChildren(AccordionGroupComponent)
  // groups: QueryList<AccordionGroupComponent>;

  // /**
  //  * Invoked when all children (groups) are ready
  //  */
  // ngAfterContentInit() {
  //   // console.log (this.groups);
  //   // Set active to first element
  //   this.groups.toArray()[0].opened = true;
  //   // Loop through all Groups
  //   this.groups.toArray().forEach((t) => {
  //     // when title bar is clicked
  //     // (toggle is an @output event of Group)
  //     t.toggle.subscribe(() => {
  //       // Open the group
  //       this.openGroup(t);
  //     });
  //     /*t.toggle.subscribe((group) => {
  //       // Open the group
  //       this.openGroup(group);
  //     });*/
  //   });
  // }

  // /**
  //  * Open an accordion group
  //  * @param group   Group instance
  //  */
  // openGroup(group: AccordionGroupComponent) {
  //   // close other groups
  //   this.groups.toArray().forEach((t) => t.opened = false);
  //   // open current group
  //   group.opened = true;
  // }
}
