// shared/components/confirm-dialog/confirm-dialog.component.ts
import { Component } from '@angular/core';
import { ConfirmDialogModule } from 'primeng/confirmdialog';

@Component({
  selector: 'app-confirm-dialog',
  imports: [ConfirmDialogModule],
  templateUrl: './confirm-dialog.component.html',
})

export class ConfirmDialogComponent {}