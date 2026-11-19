import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
}

export interface LoginResponse {
  success: boolean;
  message: string;
  role: 'admin' | 'citizen' | 'user-organizer' | 'organization';
}

export interface CitizenRegistrationRequest {
  first_name: string;
  last_name: string;
  email_id: string;
  phone_number: string;
  password: string;
  address: string;
  profile_pic: File | null;
  role: 'CITIZEN';
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  login(request: LoginRequest): Observable<LoginResponse> {
    if (!request.email || !request.password) {
      return throwError(() => new Error('Email and password are required.'));
    }

    const email = request.email.toLowerCase();
    const role = email.includes('admin')
      ? 'admin' as const
      : email.includes('organizer')
        ? 'user-organizer' as const
      : email.includes('org')
        ? 'organization' as const
        : 'citizen' as const;
    return of({
      success: true,
      message: 'Login successful',
      role
    }).pipe(delay(900));
  }

  logout(): void {
    // Mock session cleanup; replace with token invalidation when the API is connected.
    sessionStorage.removeItem('gatherly-role');
  }

  registerCitizen(request: CitizenRegistrationRequest): Observable<{ success: boolean; message: string }> {
    if (!request.email_id) {
      return throwError(() => new Error('Email address is required.'));
    }

    if (request.email_id.toLowerCase() === 'existing@example.com') {
      return throwError(() => new Error('An account with this email address already exists.'));
    }

    return of({
      success: true,
      message: 'Account created successfully.'
    }).pipe(delay(900));
  }
}
