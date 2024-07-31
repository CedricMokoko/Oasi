import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { CocktailContainerComponent } from './cocktail-container/cocktail-container.component';
import { WelcomepageComponent } from './welcomepage/welcomepage.component';
import { PanierContainerComponent } from './panier-container/panier-container.component';
import { CocktailDetailsComponent } from './cocktail-container/cocktail-details/cocktail-details.component';
import { CocktailFormComponent } from './cocktail-container/cocktail-form/cocktail-form.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { LoginComponent } from './welcomepage/login/login.component';
import { RegisterComponent } from './welcomepage/register/register.component';

const routes: Routes = [
  {
    path: '',
    component: WelcomepageComponent,
    children: [
      { path: 'login', component: LoginComponent },
      { path: 'register', component: RegisterComponent },
      // Altre rotte possono essere aggiunte qui
      { path: '', redirectTo: '/login', pathMatch: 'full' }, // Reindirizza alla pagina di login di default
    ],
  },
  {
    path: 'cocktails-list',
    component: CocktailContainerComponent,
    children: [
      { path: 'new', component: CocktailFormComponent },
      { path: ':id/:name/edit', component: CocktailFormComponent },
      { path: ':id/:name', component: CocktailDetailsComponent },
    ],
  },
  { path: 'carello', component: PanierContainerComponent },
  { path: '**', component: NotFoundComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
