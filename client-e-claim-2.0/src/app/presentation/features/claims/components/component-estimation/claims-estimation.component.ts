
import { CommonModule } from "@angular/common";
import { Component, Input, OnInit } from "@angular/core";

enum Views {
  PART = "PART",
  LABOUR = "LABOUR"
}

@Component({
  standalone: true,
  imports: [CommonModule],
  selector: 'app-claims-estimation',
  templateUrl: './claims-estimation.component.html',
  styleUrls: ['./claims-estimation.component.scss']
})
export class ClaimsEstimationComponent {
  @Input() partDetails!: any;
  @Input() labourDetails!: any;
  @Input() grandTotals!: any;

  ViewType = Views;
  activeView: string = Views.PART;

  onToggle(view: string) {
    this.activeView = view
  }
}