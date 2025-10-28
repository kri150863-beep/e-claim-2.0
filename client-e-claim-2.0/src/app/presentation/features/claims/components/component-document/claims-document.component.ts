import { CommonModule } from "@angular/common";
import { Component, Input } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatIconModule } from "@angular/material/icon";


@Component({
    standalone: true,
    imports: [CommonModule, MatIconModule, FormsModule],
    selector: 'app-claims-document',
    templateUrl: './claims-document.component.html',
    styleUrls: ['./claims-document.component.scss']
})
export class ClaimsDocumentComponent {
    @Input() documents!: any
}