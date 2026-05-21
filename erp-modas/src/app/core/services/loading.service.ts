import { Injectable, signal } from "@angular/core";

@Injectable({ providedIn: 'root' })
export class LoadingService {
    private requests = 0;
    isLoading = signal(false);

    show() {
        this.requests++;
        this.isLoading.set(true);
    }

    hide() {
        this.requests = Math.max(0, this.requests - 1);
        if (this.requests === 0) {
            this.isLoading.set(false);
        }
    }
}