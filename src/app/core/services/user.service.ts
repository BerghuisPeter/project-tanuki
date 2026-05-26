import { computed, Injectable, signal } from '@angular/core';
import { v4 as uuidv4 } from 'uuid';
import { User } from '../../shared/models/user.model';
import { UserResponse } from "../../../openApi/auth";
import { UserProfile } from "../../../openApi/profile";

export enum AuthState {
  Authenticated = 'Authenticated',
  Unauthenticated = 'Unauthenticated',
  Unknown = 'Unknown'
}

@Injectable({
  providedIn: 'root',
})
export class UserService {
  private readonly USER_KEY = 'tanuki_user';
  private readonly userSignal = signal<User>(this.loadOrCreateGuestUser());
  readonly isLoggedIn = computed(() => this.authState() === AuthState.Authenticated);
  readonly isReady = computed(() => this.authState() !== AuthState.Unknown);

  readonly user = this.userSignal.asReadonly();
  private readonly authStateSignal = signal<AuthState>(AuthState.Unknown);
  readonly authState = this.authStateSignal.asReadonly();

  setLoggedInUser(userResponse: UserResponse): void {
    const user: User = {
      ...userResponse,
      isGuest: false,
    };
    this.userSignal.set(user);
    this.saveUser(user);
    this.authStateSignal.set(AuthState.Authenticated);
  }

  setUserProfile(userProfile?: UserProfile): void {
    const currentUser = this.userSignal();
    if (!currentUser.isGuest) {
      const updatedUser = { ...currentUser, profile: userProfile };
      this.userSignal.set(updatedUser);
      this.saveUser(updatedUser);
    }
  }

  setUnauthenticated(): void {
    this.authStateSignal.set(AuthState.Unauthenticated);
  }

  logout(): void {
    const newUser: User = {
      id: uuidv4(),
      isGuest: true,
    };
    this.userSignal.set(newUser);
    this.saveUser(newUser);
    this.authStateSignal.set(AuthState.Unauthenticated);
  }

  private loadOrCreateGuestUser(): User {
    const savedUser = localStorage.getItem(this.USER_KEY);
    if (savedUser) {
      try {
        return JSON.parse(savedUser);
      } catch (e) {
        console.error('Failed to parse saved user', e);
      }
    }

    const newUser: User = {
      id: uuidv4(),
      isGuest: true,
    };
    this.saveUser(newUser);
    return newUser;
  }

  private saveUser(user: User): void {
    localStorage.setItem(this.USER_KEY, JSON.stringify(user));
  }
}
