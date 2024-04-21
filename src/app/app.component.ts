import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import {BehaviorSubject} from "rxjs";
import {LoaderService} from "./services/loader.service";

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  isLoading:boolean = false;
  title = 'fe';
  constructor(private loaderService: LoaderService) {

  }

  ngOnInit(): void {
    this.loaderService.isLoading.subscribe((value) => {this.isLoading = value})
    this.loaderService.stopLoader()
  }

}
