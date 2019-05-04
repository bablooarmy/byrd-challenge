import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoginService {

  constructor(private http: HttpClient) { }

  doLogin():Observable<any>{
    return this.http.get("/assets/mock/login-response.json").pipe(map(res => {
      return res;
    }));
  }
}
