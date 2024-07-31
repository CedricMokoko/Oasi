import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { tap, map, filter } from 'rxjs/operators';
import { User } from '../interfaces/user';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  // BehaviorSubject per mantenere la lista degli utenti
  public users$: BehaviorSubject<User[]> = new BehaviorSubject<User[]>([]);

  constructor(private http: HttpClient) {
    // Inizializzazione, se necessaria
    this.fetchUsers$().subscribe(); // Carica gli utenti al bootstrap dell'app
  }

  // Recupera un utente per ID
  public getUser$(id: string): Observable<User | undefined> {
    return this.users$.pipe(
      filter((users: User[]) => users !== null),
      map((users: User[]) => users.find((user) => user._id === id))
    );
  }

  // Aggiunge un nuovo utente
  public addUser$(newUser: User): Observable<User> {
    return this.http.post<User>('https://restapi.fr/api/users', newUser).pipe(
      tap((savedUser: User) => {
        const currentUsers = this.users$.value;
        this.users$.next([...currentUsers, savedUser]);
      })
    );
  }

  // Elimina un utente per ID
  public deleteUser$(userId: string): Observable<void> {
    return this.http
      .delete<void>(`https://restapi.fr/api/users/${userId}`)
      .pipe(
        tap(() => {
          const currentUsers = this.users$.value;
          this.users$.next(currentUsers.filter((user) => user._id !== userId));
        })
      );
  }

  // Modifica un utente
  public editUser$(userId: string, editedUser: User): Observable<User> {
    return this.http
      .patch<User>(`https://restapi.fr/api/users/${userId}`, editedUser)
      .pipe(
        tap((updatedUser: User) => {
          const currentUsers = this.users$.value;
          this.users$.next(
            currentUsers.map((user) =>
              user._id === updatedUser._id ? updatedUser : user
            )
          );
        })
      );
  }

  // Recupera la lista di tutti gli utenti
  public fetchUsers$(): Observable<User[]> {
    return this.http.get<User[]>('https://restapi.fr/api/users').pipe(
      tap((users: User[]) => {
        this.users$.next(users);
      })
    );
  }

  // Pulisce la lista degli utenti
  public clearUserList$(): Observable<void> {
    return this.http.delete<void>('https://restapi.fr/api/users').pipe(
      tap(() => {
        this.users$.next([]);
      })
    );
  }

  // Metodo per il login
  public login$(email: string, password: string): Observable<User | null> {
    return this.users$.pipe(
      map((users: User[]) =>
        users.find((user) => user.email === email && user.password === password)
      )
    );
  }
}
