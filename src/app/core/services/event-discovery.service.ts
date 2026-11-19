import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, catchError, delay, map } from 'rxjs';
import { GatherlyEvent } from '../models/event.model';

@Injectable({ providedIn: 'root' })
export class EventDiscoveryService {
  private readonly http = inject(HttpClient);

  getEvents(): Observable<GatherlyEvent[]> {
    return this.http.get<GatherlyEvent[]>('/api/events').pipe(
      catchError(() => this.http.get<GatherlyEvent[]>('/assets/data/events.json')),
      delay(250)
    );
  }

  getEvent(id: number): Observable<GatherlyEvent | undefined> {
    return this.getEvents().pipe(
      map((events) => events.find((event) => event.id === id))
    );
  }
}
