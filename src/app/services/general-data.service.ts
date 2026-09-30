import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { Observable, of } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class GeneralDataService {
  private cache = new Map<string, any>();
  
  constructor(private http: HttpClient) {}

  getFAQs(event_tag: string): Observable<any> {
    const cacheKey = `faq_${event_tag}`;
    
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    
    return this.http.get(`${environment.API_URL}/faq/`, {
      params: { tag: event_tag },
    }).pipe(
      tap(data => this.cache.set(cacheKey, data))
    );
  }
  getCOMPITIMELINEs(): Observable<any> {
    const cacheKey = 'compi_timeline_all';
    
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    
    return this.http.get(`${environment.API_URL}/compi/timeline/`).pipe(
      tap(data => this.cache.set(cacheKey, data))
    );
  }
  getCOMPIFAQs(): Observable<any> {
    const cacheKey = 'compi_faq_all';
    
    if (this.cache.has(cacheKey)) {
      return of(this.cache.get(cacheKey));
    }
    
    return this.http.get(`${environment.API_URL}/compi/faq/`).pipe(
      tap(data => this.cache.set(cacheKey, data))
    );
  }

  getData(url: string) {
    return this.getEndpointData(url + '/');
  }

  getEndpointData(endpoint: string) {
    return this.http.get(`${environment.API_URL}/${endpoint}`);
  }

  postToEndpoint(endpoint: string, data: any) {
    return this.http.post(`${environment.API_URL}/${endpoint}`, data);
  }
}
