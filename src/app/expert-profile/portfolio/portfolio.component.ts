import { Component, OnInit, Input } from '@angular/core';
import { iUser, iPortfolio } from '../../models/user';

@Component({
  selector: 'app-portfolio',
  templateUrl: './portfolio.component.html',
  styleUrls: ['./portfolio.component.scss']
})
export class PortfolioComponent implements OnInit {

  @Input() expertProfile: iUser = new iUser();
  portfolioDetails: iPortfolio = new iPortfolio();

  constructor() { }

  ngOnInit(): void {
  }

  openPortfolioDetails(portfolio: iPortfolio): void {
    this.portfolioDetails = portfolio;
  }

}
