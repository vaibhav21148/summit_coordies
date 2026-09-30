import { Component, inject } from '@angular/core';
// import { LoadingService } from './loading.service';
import { LoadingService } from '@services/loading.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
})
export class LoadingComponent {
  loadingService = inject(LoadingService);
  isLoading = this.loadingService.loading$;
}
