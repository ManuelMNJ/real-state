import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-root',
  // standalone: true permite declarar el componente sin necesidad de un NgModule
  // facilita arquitecturas modulares con componentes independientes
  standalone: true,
  imports: [RouterModule],
  template: `
    <main>
      <header class="brand-name">
      </header>
      <section class="content">
        <router-outlet></router-outlet>
      </section>
    </main>
  `,
  styleUrls: ['./app.css'],
})
export class AppComponent {
  title = 'Real Estate';
}