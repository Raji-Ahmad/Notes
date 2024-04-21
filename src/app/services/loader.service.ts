import { Injectable } from '@angular/core';
import {BehaviorSubject} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class LoaderService {
  isLoading: BehaviorSubject<boolean> = new BehaviorSubject(false)
  constructor() { }

  startLoader(){
    this.isLoading.next(true)
  }

  stopLoader(){
    this.isLoading.next(false)
  }
}
