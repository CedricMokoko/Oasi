import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';
import { Ingredients } from '../interfaces/ingredients.interface';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class PanierService {
  public ingredienti$: BehaviorSubject<Ingredients[]> = new BehaviorSubject<
    Ingredients[]
  >([]);

  private apiUrl = 'https://restapi.fr/api/carello';

  constructor(private http: HttpClient) {}

  public addToCarello$(ingredienti: Ingredients[]): Observable<Ingredients[]> {
    // Assicurati che ingredienti sia sempre un array, anche se vuoto
    const sanitizedIngredienti = ingredienti || [];

    return this.http
      .post<Ingredients[]>(this.apiUrl, sanitizedIngredienti)
      .pipe(
        tap((savedIngredienti: any) => {
          // Forza la conversione di savedIngredienti in un array se non lo è
          const savedArray = Array.isArray(savedIngredienti)
            ? savedIngredienti
            : [savedIngredienti];

          // Combina l'array degli ingredienti salvati con quello corrente
          const currentValue = [...this.ingredienti$.value, ...savedArray];

          // Riduzione per combinare e sommare le quantità degli ingredienti
          const obj = currentValue.reduce(
            (acc: { [key: string]: number }, value: Ingredients) => {
              if (value && value.name) {
                acc[value.name] =
                  (acc[value.name] || 0) + (value.quantity || 0);
              }
              return acc;
            },
            {}
          );

          // Trasforma l'oggetto in un array di ingredienti
          const result = Object.keys(obj).map((key) => ({
            name: key,
            quantity: obj[key],
          }));

          // Aggiorna il BehaviorSubject con i nuovi valori
          this.ingredienti$.next(result);
        })
      );
  }

  public fetchCarello$(): Observable<Ingredients[]> {
    return this.http.get('https://restapi.fr/api/carello').pipe(
      tap((ingredienti: Ingredients[]) => {
        this.ingredienti$.next(ingredienti);
      })
    );
  }

  public clearCarello$(): Observable<void> {
    // Invia una richiesta DELETE per svuotare il carrello
    return this.http.delete<void>(this.apiUrl).pipe(
      tap(() => {
        // Aggiorna lo stato locale dopo aver svuotato il carrello sul server
        this.ingredienti$.next([]);
      })
    );
  }

  public getCarello$(name: string, quantity: number): Observable<Ingredients> {
    return this.ingredienti$.pipe(
      filter((ingredienti: Ingredients[]) => ingredienti.length > 0),
      map((ingredienti: Ingredients[]) => {
        return ingredienti.find(
          (ingrediente) =>
            ingrediente.name === name && ingrediente.quantity === quantity
        );
      })
    );
  }
}
