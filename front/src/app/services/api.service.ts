import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ApiService {

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  getHelloFromBackend() {
    return this.http.get(`${this.apiUrl}/auth/hello`);
  }

  getUserHomeData () {
    const accessToken = localStorage.getItem('accessToken');
    const headers = { Authorization: `Bearer ${accessToken}` };

    return this.http.get(`${this.apiUrl}/user/me` ,{ headers });
  }

}
