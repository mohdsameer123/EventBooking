import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  // loadConfig(): Observable<any> {
  //   return this.http.get('/assets/config.json');
  // }
  loadConfig(): Observable<any> {
    if (this.config) {
      // Return the cached config if it exists
      return of(this.config);
    } else {
      // Fetch the config from the JSON file
      return this.http.get('/assets/config.json').pipe(
        tap(config => this.config = config),
        catchError(error => {
          console.error('Error loading config:', error);
          return of(null);
        })
      );
    }

      }

  getConfig(): any {
    return this.config;
  }
  setConfig(config: any): void {
    this.config = config;
  }

}
