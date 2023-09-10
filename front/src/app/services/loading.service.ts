import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LoadingService {
  public isLoading = false;

  showLoading() {
    setTimeout(() => {
        this.isLoading = true;
      },);
  }

  hideLoading() {
    setTimeout(() => {
        this.isLoading = false;
    }, 900);
  }
}