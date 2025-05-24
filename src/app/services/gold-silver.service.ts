import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GoldSilverService {
  private baseUrl = 'https://stg-chatbotapi.goldbox.gold'; // Updated to use the proxy

  constructor(private http: HttpClient) { }

  getPredictedPrices24Carats(startDate: string, endDate: string): Observable<any> {
    return this.http.get<any>(`${this.baseUrl}/get-predicted-prices24`, {
      params: {
        start_date: startDate,
        end_date: endDate
      }
    });
  }

  getPredictedSilverPrice(startDate: string, endDate: string): Observable<any> {
    const params = new HttpParams().set('start_date', startDate).set('end_date', endDate);
    return this.http.get(`${this.baseUrl}/get-predicted-silver-prices25`, { params });
  }
}
