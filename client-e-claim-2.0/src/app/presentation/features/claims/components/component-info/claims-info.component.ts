
import { Component, Input, OnInit } from "@angular/core";

@Component({
  standalone: true,
  selector: 'app-claims-info',
  templateUrl: './claims-info.component.html',
  styleUrls: ['./claims-info.component.scss']
})
export class ClaimsInfoComponent implements OnInit {
  @Input() generalInfo!: any
  @Input() surveyInfo!: any

  ngOnInit() {
    console.log(this.generalInfo);
  }
}