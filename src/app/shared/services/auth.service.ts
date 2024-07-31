import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userToken$: BehaviorSubject<string | null> = new BehaviorSubject<
    string | null
  >(null);

  constructor() {
    // Carica il token se è presente nel sessionStorage all'avvio
    const token = sessionStorage.getItem('authToken');
    if (token) {
      this.userToken$.next(token);
    }
  }

  // Metodo per il login (per simulare il login e impostare il token)
  public login(userName: string): void {
    const token = `${userName}-token`;
    this.userToken$.next(token);
    // Salva il token nel sessionStorage
    sessionStorage.setItem('authToken', token);
  }

  // Metodo per il logout
  public logout(): void {
    this.userToken$.next(null);
    sessionStorage.removeItem('authToken');
  }

  // Verifica se l'utente è autenticato
  public isAuthenticated(): boolean {
    return !!this.userToken$.value;
  }

  // Ottieni il token corrente
  public getToken(): string | null {
    return this.userToken$.value;
  }
}
