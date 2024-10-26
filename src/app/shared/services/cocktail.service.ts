import { Injectable } from '@angular/core';
import { BehaviorSubject, filter, map, Observable, tap } from 'rxjs';
import { Cocktail } from '../interfaces/cocktail.interface';
import { HttpClient } from '@angular/common/http';

/** "providedIn: 'root'"" veut dire que notre service va etre provide directement
 * via le module root, donc le app module. On va avoir une seule instance de notre
 * service qu'on va ensuite utiliser partout dans notre application, on va pouvoir
 * l'injecter dans tous les constructeurs des éléments de notre application Angular.
 *
 * Donc dans ce service on va avoir deux éléments qui vont nous intéresser:
 *
 * -> La liste des cocktails et cette fois on veut que tout soit réactif,
 * c'est à dire qu'on va utiliser RxJs et on va notament utiliser le dernier
 * type d'observable qu'on a abordé dans le chapter precedent, cioè les
 * 'Behaviors Subject'
 *
 * -> Le selected cocktail: on va utiliser un second "BehaviorSubject"
 */
@Injectable({
  providedIn: 'root',
})
export class CocktailService {
  /**Propriété de type 'BehaviorSubject' qui va detenir la liste des
   * cocktails, ce qui va nous permettre par la suite quand les composants
   * vont écouter ce cocktails, de pouvoir s'enregistrer, subscribe au coktails
   * et avoir toutes les modifications qui vont etre apporté à "cocktails".
   *
   * Donc pour l'instant il n'y en a pas, mais on peut immaginé que quand par ex
   * on mettre en place un formulaire d'édition du cocktail et benh ça va modifier
   * le model "Cocktail" et il va falloir que cette modification se repercute sur le
   * reste de l'application. C'est là l'intéret d'utiliser justement un "BehaviorSubject".
   *
   * Dans notre BehaviroSubject on spécifie le type d'information qui va y transiter:
   * BehaviorSubject<Cocktail[]>, ici un tableau de Cocktail puis on va directement l'instancié
   * et l'initialiser avec un tableau de cocktails.
   */
  public cocktails$: BehaviorSubject<Cocktail[]> = new BehaviorSubject([]);

  /** l'operateur 'first()' permet de couper le flux des qu'on obtient le premier resultat
   * avec une subscription
   */
  public getCocktail$(id: string, name: string): Observable<Cocktail> {
    return this.cocktails$.pipe(
      filter((cocktails: Cocktail[]) => cocktails !== null),
      map((cocktails: Cocktail[]) => {
        return cocktails.find(
          (cocktail) => cocktail._id === id && cocktail.name === name
        );
      })
    );
  }

  public addCocktails$(newCocktail: Cocktail): Observable<Cocktail> {
    return this.http
      .post<Cocktail>('https://restapi.fr/api/oasi', newCocktail)
      .pipe(
        tap((savedCocktail: Cocktail) => {
          const value = this.cocktails$.value;
          this.cocktails$.next([...value, savedCocktail]);
        })
      );
  }

  public deleteCocktail$(editCocktailId: string): Observable<void> {
    return this.http
      .delete<void>(`https://restapi.fr/api/oasi/${editCocktailId}`)
      .pipe(
        tap(() => {
          const value = this.cocktails$.value;
          this.cocktails$.next(
            value.filter((cocktail) => cocktail._id !== editCocktailId)
          );
        })
      );
  }

  public editCocktails$(
    editCocktailId: string,
    editedCocktail: Cocktail
  ): Observable<Cocktail> {
    return this.http
      .patch<Cocktail>(
        `https://restapi.fr/api/oasi/${editCocktailId}`,
        editedCocktail
      )
      .pipe(
        tap((savedCocktail: Cocktail) => {
          const value = this.cocktails$.value;
          this.cocktails$.next(
            value.map((cocktail: Cocktail) => {
              if (cocktail.name === savedCocktail.name) {
                return savedCocktail;
              } else {
                return cocktail;
              }
            })
          );
        })
      );
  }

  constructor(private http: HttpClient) {
    // this.seed(); //metodo da chiamare solo una volta al lancio per popolare l'api
  }

  public fetchCocktails$(): Observable<Cocktail[]> {
    return this.http.get('https://restapi.fr/api/oasi').pipe(
      tap((cocktails: Cocktail[]) => {
        this.cocktails$.next(cocktails);
      })
    );
  }

  public clearCocktailList$(): Observable<void> {
    // Invia una richiesta DELETE per svuotare il carrello
    return this.http.delete<void>('https://restapi.fr/api/oasi').pipe(
      tap(() => {
        // Aggiorna lo stato locale dopo aver svuotato il carrello sul server
        this.cocktails$.next([]);
      })
    );
  }

  // public seed() {
  //   this.http
  //     .post('https://restapi.fr/api/oasi', {
  //       name: 'Old Fashioned',
  //       img: 'https://cdn.shopify.com/s/files/1/0247/4681/9693/files/Old_Fashioned_Popular_Classic_Cocktail_large.jpg?v=1591992479',
  //       description:
  //         "Con la sua classe e raffinatezza, il cocktail Old Fashioned è un classico che rimane popolare oggi come oltre 200 anni fa. Mescolando Bourbon Whisky, bitter, zucchero e un goccio d'acqua questo cocktail diventa delizioso.Le origini di questo cocktail classico sono un po' nebbiose, poichè tante persone rivendicano la sua creazione! La storia più comune è che sia stata inventato alla fine del 1800. Fu allora che nuovi liquori divennero disponibili per i baristi, dando vita a cocktail di whisky nuovi e migliorati. Ma molti frequentatori di bar volevano semplicemente ordinare un cocktail alla vecchia maniera. Ancora oggi l'Old Fashioned è il cocktail più venduto in molti bar. Non si può battere un classico!",
  //       ingredients: [
  //         {
  //           name: 'Perrier',
  //           quantity: 1,
  //         },
  //         {
  //           name: 'Limone',
  //           quantity: 3,
  //         },
  //       ],
  //     })
  //     .subscribe();
  //   this.http.post('https://restapi.fr/api/oasi', {
  //     name: 'Espresso Martini',
  //     img: 'https://www.allrecipes.com/thmb/XgmkthyaJksY3erwXwyAwlhKXXU=/750x0/filters:no_upscale():max_bytes(150000):strip_icc():format(webp)/222881-espresso-martini-cocktail-3x4-121-copy-ccad39f0f9774b4bba8149acf0465ec0.jpg',
  //     description:
  //       "Un vodka martini è un cocktail di vodka a base di caffè espresso e liquore al caffè. La bevanda è nata negli anni '80 e ha registrato un'impennata di popolarità negli anni '20. L'atto di scuotere l'espresso con ghiaccio, liquore e liquori crea una copertura cremosa e schiumosa. ",
  //     ingredients: [
  //       {
  //         name: 'Mango',
  //         quantity: 1,
  //       },
  //       {
  //         name: 'Pesca',
  //         quantity: 3,
  //       },
  //     ],
  //   }).subscribe;
  //   this.http.post('https://restapi.fr/api/oasi', {
  //     name: 'Mojito',
  //     img: 'https://www.spiritacademy.it/img/cms/landing/2022/Mojito/mojito.jpg',
  //     description:
  //       'Un cocktail conosciuto in tutto il mondo che prende il nome da Sir Francis Drake, esploratore inglese che visitò Cuba e l’Avana nel 1586. Nella prima metà del ‘900 appare ufficialmente con il nome di Mojito in un manuale. Gli ingredienti principali sono originari di Cuba: rum, lime, menta e zucchero. La menta assicura una dose extra di refrigerio, molto gradita da Ernest Hemingway che consumava regolarmente mojito a La Bodeguita del Medio, un bar dell’Avana.',
  //     ingredients: [
  //       {
  //         name: 'Perrier',
  //         quantity: 2,
  //       },
  //     ],
  //   }).subscribe;
  //   this.http.post('https://restapi.fr/api/oasi', {
  //     name: 'Negroni',
  //     img: 'https://www.iconmagazine.it/wp-content/uploads/2019/01/Cocktail-pi%C3%B9-bevuti-al-mondo-Negroni.jpg',
  //     description:
  //       'Per la prima volta dopo tanti anni il Negroni sorpassa l’Old Fashioned e si aggiudica la prima posizione tra i cocktail classici più amati al mondo. Tutto ha inizio a Firenze tra il 1919 e il 1920 quando il conte Camillo Negroni richiede un Americano più “forte” al suo barista di fiducia, che lo accontenta con una dose generosa di gin in sostituzione del seltz, in onore agli ultimi viaggi che il conte aveva fatto a Londra. Il resto è storia. Il Negroni, composto da gin, vermouth rosso e Campari in parti uguali, oggi è il cocktail italiano più bevuto al mondo.',
  //     ingredients: [
  //       {
  //         name: 'Perrier',
  //         quantity: 2,
  //       },
  //     ],
  //   }).subscribe;
  //   this.http
  //     .post('https://restapi.fr/api/oasi', {
  //       name: 'Margarita',
  //       img: 'https://www.iconmagazine.it/wp-content/uploads/2019/01/Cocktail-pi%C3%B9-bevuti-al-mondo-Daiquiri.jpg',
  //       description:
  //         'Il Margarita mantiene il suo posto nella top ten di Drinks International e conquista la quarta posizione, complice il crescente successo dei distillati d’agave. Portabandiera del Messico, l’ingrediente principale è il tequila, che ne collega le sue origini all’attrice Marjorie King, intollerante agli alcolici, ma particolarmente propensa a bere il nettare d’agave. Siamo nei primi anni del ‘900 ma la ricetta è rimasta la stessa: tequila, appunto, triple sec e succo di lime.',
  //       ingredients: [
  //         {
  //           name: 'Mela',
  //           quantity: 3,
  //         },
  //         {
  //           name: 'Mango',
  //           quantity: 1,
  //         },
  //       ],
  //     })
  //     .subscribe();
  // }
}
