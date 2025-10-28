
import { Component, Input } from "@angular/core";
import { MatIconModule } from "@angular/material/icon";

@Component({
  selector: 'app-claims-summary',
  templateUrl: './claims-summary.component.html',
  styleUrls: ['./claims-summary.component.scss'],
  imports: [MatIconModule]
})
export class ClaimsSummaryComponent {
  @Input() summary: any;
}