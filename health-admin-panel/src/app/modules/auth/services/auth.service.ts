import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly TOKEN_KEY = 'auth_token';
  private readonly USER_KEY = 'current_user';
  
  // Default credentials
  private readonly DEFAULT_USERNAME = 'admin';
  private readonly DEFAULT_PASSWORD = 'admin123';

  constructor() { }

  login(username: string, password: string): Observable<boolean> {
    // Check if credentials match the default ones
    const isValid = username === this.DEFAULT_USERNAME && password === this.DEFAULT_PASSWORD;
    
    // Simulate API call with a delay
    return of(isValid).pipe(
      delay(800),
      tap(success => {
        if (success) {
          // Store authentication data in localStorage
          localStorage.setItem(this.TOKEN_KEY, this.generateToken());
          localStorage.setItem(this.USER_KEY, JSON.stringify({
            username: username,
            role: 'admin'
          }));
        }
      })
    );
  }

  logout(): void {
    // Remove authentication data from localStorage
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.USER_KEY);
  }

  isLoggedIn(): boolean {
    return !!localStorage.getItem(this.TOKEN_KEY);
  }

  getCurrentUser(): any {
    const userStr = localStorage.getItem(this.USER_KEY);
    return userStr ? JSON.parse(userStr) : null;
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY);
  }

  // Generate a simple token (in a real app, this would come from the backend)
  private generateToken(): string {
    return 'admin-token-' + Math.random().toString(36).substring(2);
  }
}
