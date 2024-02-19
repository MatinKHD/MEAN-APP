import { Component, Inject, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';

@Component({
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <h2 mat-dialog-title>Error</h2>
    <mat-dialog-content>{{ data.message }}.</mat-dialog-content>
    <mat-dialog-actions>
      <button mat-button mat-dialog-close>Close</button>
    </mat-dialog-actions>
  `,
})
export class ErrorComponent {
  dialog: MatDialog = inject(MatDialog);
  constructor(@Inject(MAT_DIALOG_DATA) public data: { message: string }) {}
}
