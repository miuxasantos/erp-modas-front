import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';
import { AuthService } from '@core/services/auth/auth.service';
import { ConfirmDialogComponent } from '@shared/components/confirm-dialog/confirm-dialog.component';
import { LoadingComponent } from '@shared/components/loading/loading.component';
import { ToastModule } from 'primeng/toast';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, ToastModule, ConfirmDialogComponent, LoadingComponent, CommonModule, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.css'
})

export class App {
  authService = inject(AuthService);
}
