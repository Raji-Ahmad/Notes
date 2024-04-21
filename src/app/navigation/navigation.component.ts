import {Component} from '@angular/core';
import {FormControl} from "@angular/forms";
import {Router} from "@angular/router";

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrl: './navigation.component.css'
})
export class NavigationComponent {
  searchTerm: FormControl = new FormControl()

  constructor(private router: Router) {
  }

  search() {
    let term: string = this.searchTerm.value

    if (term) {
      console.log(term)
      this.router.navigate(['/notes'], {queryParams: {t: term}});
    }

  }

  onFormSubmit(event: Event): void {
    event.preventDefault(); // Prevent default form submission behavior
    // this.search(); // Call the search method
  }
}
