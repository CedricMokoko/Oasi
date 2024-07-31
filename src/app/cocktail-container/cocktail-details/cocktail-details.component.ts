// import { Component, OnDestroy, OnInit } from '@angular/core';
// import { Cocktail } from '../../shared/interfaces/cocktail.interface';
// import { PanierService } from '../../shared/services/panier.service';
// import { ActivatedRoute } from '@angular/router';
// import { CocktailService } from '../../shared/services/cocktail.service';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-cocktail-details',
//   templateUrl: './cocktail-details.component.html',
//   styleUrls: ['./cocktail-details.component.scss'],
// })
// export class CocktailDetailsComponent implements OnInit, OnDestroy {
//   public cocktailDetailsEnfant: Cocktail;
//   private id: string;
//   private name: string;
//   private subscriptions: Subscription = new Subscription();

//   constructor(
//     private panierService: PanierService,
//     private activatedRoute: ActivatedRoute,
//     private cocktailService: CocktailService
//   ) {}

//   ngOnInit(): void {
//     this.subscriptions.add(
//       this.activatedRoute.paramMap.subscribe((paramMap) => {
//         this.id = paramMap.get('id')!;
//         this.name = paramMap.get('name')!;

//         this.subscriptions.add(
//           this.cocktailService
//             .getCocktail$(this.id, this.name)
//             .subscribe((cocktail: Cocktail) => {
//               this.cocktailDetailsEnfant = cocktail;
//               console.log('Cocktail loaded in ngOnInit:', cocktail);
//             })
//         );
//       })
//     );
//   }

//   public addToCarello(): void {
//     if (this.cocktailDetailsEnfant?.ingredients) {
//       console.log('Adding to cart:', this.cocktailDetailsEnfant.ingredients);
//       this.panierService
//         .addToCarello$(this.cocktailDetailsEnfant.ingredients)
//         .subscribe({
//           next: () => console.log('Ingredients added to cart successfully.'),
//           error: (err) =>
//             console.error('Error adding ingredients to cart:', err),
//         });
//     } else {
//       console.error('No ingredients found to add to cart.');
//     }
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.unsubscribe();
//   }
// }

import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap } from '@angular/router';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { CocktailService } from '../../shared/services/cocktail.service';
import { Cocktail } from '../../shared/interfaces/cocktail.interface';

@Component({
  selector: 'app-cocktail-details',
  templateUrl: './cocktail-details.component.html',
  styleUrls: ['./cocktail-details.component.scss'],
})
export class CocktailDetailsComponent implements OnInit, OnDestroy {
  public cocktailDetailsEnfant: Cocktail;
  private subscription: Subscription = new Subscription();

  constructor(
    private activatedRoute: ActivatedRoute,
    private cocktailService: CocktailService
  ) {}

  ngOnInit(): void {
    this.subscription.add(
      this.activatedRoute.paramMap
        .pipe(
          switchMap((params: ParamMap) => {
            const id = params.get('id');
            const name = params.get('name');
            return this.cocktailService.getCocktail$(id, name);
          })
        )
        .subscribe((cocktail: Cocktail) => {
          this.cocktailDetailsEnfant = cocktail;
        })
    );
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }
}
