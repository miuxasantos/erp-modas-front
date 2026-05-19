// shared/components/loading/loading.component.ts
import { Component, inject } from '@angular/core';
import { LoadingService } from '@core/services/loading.service';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'app-loading',
  imports: [ProgressSpinnerModule],
  templateUrl: './loading.component.html',
})
export class LoadingComponent {
  readonly loadingService = inject(LoadingService);
}