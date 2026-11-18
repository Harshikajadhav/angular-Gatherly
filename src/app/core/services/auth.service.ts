import { Injectable } from '@angular/core';
import { Observable, of, throwError, delay } from 'rxjs';

export interface LoginRequest {
  email: string;
  password: string;
  rememberMe: boolean;
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
  login(request: LoginRequest): Observable<{ success: boolean; message: string }> {
    if (!request.email || !request.password) {
      return throwError(() => new Error('Email and password are required.'));
    }

    return of({
      success: true,
      message: 'Login successful'
    }).pipe(delay(900));
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
