// src/app/user-session.service.ts
import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class UserSessionService {
  private username: string | null = null;

  setUser(username: string) {
    this.username = username;
  }

  getUser(): string | null {
    return this.username;
  }
}