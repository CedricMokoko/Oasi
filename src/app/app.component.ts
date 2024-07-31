// import { Component, OnInit } from '@angular/core';
// import { CocktailService } from './shared/services/cocktail.service';
// import { PanierService } from './shared/services/panier.service';
// import { Cocktail } from './shared/interfaces/cocktail.interface';
// import { ActivatedRoute, Router } from '@angular/router';
// import { Subscription } from 'rxjs';

// @Component({
//   selector: 'app-root',
//   templateUrl: './app.component.html',
//   styleUrl: './app.component.scss',
// })
// export class AppComponent implements OnInit {
//   public cocktails: Cocktail[];
//   private subscriptions: Subscription = new Subscription();

//   constructor(
//     private cocktailService: CocktailService,
//     private panierService: PanierService,
//     private router: Router
//   ) {}

//   ngOnInit(): void {
//     this.cocktailService.fetchCocktails$().subscribe();
//     this.panierService.fetchCarello$().subscribe();

//     // Fetch initial data
//     this.subscriptions.add(
//       this.cocktailService
//         .fetchCocktails$()
//         .subscribe((cocktails: Cocktail[]) => {
//           this.cocktails = cocktails;
//           if (this.cocktails && this.cocktails.length > 0) {
//             const firstCocktailId = this.cocktails[0]._id;
//             const firstCocktailName = this.cocktails[0].name;
//             this.router.navigate([
//               'cocktails-list',
//               firstCocktailId,
//               firstCocktailName,
//             ]);
//           }
//         })
//     );
//     this.subscriptions.add(this.panierService.fetchCarello$().subscribe());
//   }

//   ngOnDestroy(): void {
//     this.subscriptions.unsubscribe();
//   }
// }

import { Component, OnInit, OnDestroy } from '@angular/core';
import { CocktailService } from './shared/services/cocktail.service';
import { PanierService } from './shared/services/panier.service';
import { Cocktail } from './shared/interfaces/cocktail.interface';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { CocktailDataService } from './shared/services/data-cocktail.service';
import { AuthService } from './shared/services/auth.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  constructor(
    private authService: AuthService,
    private cocktailService: CocktailService,
    private panierService: PanierService,
    private router: Router,
    private cocktailDataService: CocktailDataService // Injecter le service
  ) {}

  ngOnInit(): void {
    this.checkAuthentication();
    // Fetch initial data
    this.subscriptions.add(
      this.cocktailService
        .fetchCocktails$()
        .subscribe((cocktails: Cocktail[]) => {
          if (cocktails && cocktails.length > 0) {
            const firstCocktail = cocktails[0];
            this.cocktailDataService.setCocktail(firstCocktail); // Mettre à jour le service
            // this.router.navigate([
            // '/cocktails-list',
            // firstCocktail._id,
            // firstCocktail.name,
            // ]);
          }
        })
    );
    this.subscriptions.add(this.panierService.fetchCarello$().subscribe());
  }

  private checkAuthentication(): void {
    if (this.authService.isAuthenticated()) {
      console.log('User is authenticated');
      // Logica aggiuntiva se necessario
    } else {
      console.log('User is not authenticated');
      // Logica aggiuntiva se necessario
    }
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }
}
