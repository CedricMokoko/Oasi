import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Cocktail } from '../interfaces/cocktail.interface';

@Injectable({
  providedIn: 'root',
})
export class CocktailDataService {
  private cocktailSource = new BehaviorSubject<Cocktail | null>(null);
  cocktail$ = this.cocktailSource.asObservable();

  setCocktail(cocktail: Cocktail): void {
    this.cocktailSource.next(cocktail);
  }
}
