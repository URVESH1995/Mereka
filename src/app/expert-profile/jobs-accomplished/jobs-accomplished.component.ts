import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-jobs-accomplished',
  templateUrl: './jobs-accomplished.component.html',
  styleUrls: ['./jobs-accomplished.component.scss']
})
export class JobsAccomplishedComponent implements OnInit {

  dummyItems: number[] = [1, 2];

  constructor() { }

  ngOnInit(): void {
  }

}
