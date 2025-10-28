import { Component, inject } from '@angular/core';
import { DialogData } from './submit-dialog.types';
import { MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { ButtonComponent } from '../../../../shared/ui/button/button.component';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'submit-dialog',
  imports: [ MatDialogActions, ButtonComponent, MatIconModule, MatDialogContent ],
  templateUrl: './submit-dialog.component.html',
  styleUrl: './submit-dialog.component.scss'
})
export class SubmitDialogComponent {
  readonly dialogRef = inject(MatDialogRef<SubmitDialogComponent>)
  readonly data = inject<DialogData>(MAT_DIALOG_DATA)
  invoiceId = this.data.invoiceId

  handleClose() {
    this.dialogRef.close()
  }
}
