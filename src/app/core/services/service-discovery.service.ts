import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, map, of } from 'rxjs';
import { GatherlyService } from '../models/service.model';

@Injectable({ providedIn: 'root' })
export class ServiceDiscoveryService {
  private readonly http = inject(HttpClient);

  getServices(): Observable<GatherlyService[]> {
    return this.http.get<GatherlyService[]>('/api/services').pipe(
      catchError(() => this.http.get<GatherlyService[]>('/assets/data/services.json')),
      delay(350)
    );
  }

  getService(id: number): Observable<GatherlyService | undefined> {
    return this.http.get<GatherlyService>(`/api/services/${id}`).pipe(
      catchError(() => this.http.get<GatherlyService[]>('/assets/data/services.json').pipe(
        map((services) => services.find((service) => service.id === id))
      )),
      delay(300)
    );
  }
}
