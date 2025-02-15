import { Component, AfterViewInit, ViewChild, ElementRef } from '@angular/core';
import { Chart, ChartConfiguration, LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend, LineElement, LineController, BarController } from 'chart.js';
import { OrderService } from '../services/order.service';
import { Router } from '@angular/router';
import { UserService } from '../services/user.service';

Chart.register(LinearScale, CategoryScale, BarElement, Title, Tooltip, Legend, LineElement, LineController, BarController);

interface Order {
  id: number;
  totalAmount: number;
  discount: number;
}
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements AfterViewInit {

  @ViewChild('overviewChart') overviewChartRef!: ElementRef<HTMLCanvasElement>;
  @ViewChild('detailsChart') detailsChartRef!: ElementRef<HTMLCanvasElement>;

  quantityUser : number = 0; 
  quantityOrder : number = 0; 
  totalAmount : number = 0;
  constructor(private chartDataService: OrderService,private router: Router, private userService: UserService, private orderService : OrderService ) {}

  ngAfterViewInit(): void {
    this.loadOverviewData();
    this.loadDetailsData();
    this.loadQuantityUser();
    this.loadQuantityOrder();
  }


  loadQuantityUser() {
    this.userService.getCustomers().subscribe(
      (data) => {
        this.quantityUser = data.length;
      },
      (error) => {
        console.error('Error fetching Customer', error);
      }
    );
    this.userService.getManagers().subscribe(
      (data) => {
        this.quantityUser += data.length;
      },
      (error) => {
        console.error('Error fetching Customer', error);
      }
    );
  }
  loadQuantityOrder() {
    this.orderService.getAllOrder().subscribe(
      (data: Order[]) => {
        this.quantityOrder = data.length;
  
        this.totalAmount = data.reduce((sum, order) => sum + (order.totalAmount - order.discount), 0);
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
  }
  private loadOverviewData(): void {
    this.chartDataService.getOverviewData().subscribe(data => {
      const labels = data.map(item => item.label);
      const values = data.map(item => item.value);

      this.createOverviewChart(labels, values);
    });
  }

  private loadDetailsData(): void {
    this.chartDataService.getDetailsData().subscribe(data => {
      const labels = data.map(item => item.label);
      const values = data.map(item => item.value);

      this.createDetailsChart(labels, values);
    });
  }

  private createOverviewChart(labels: string[], values: number[]): void {
    const overviewCtx = this.overviewChartRef.nativeElement.getContext('2d');
    if (overviewCtx) {
      const overviewConfig: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Revenue ($)',
            data: values,
            backgroundColor: 'rgba(54, 162, 235, 0.6)',
            borderColor: 'rgba(54, 162, 235, 1)',
            borderWidth: 1
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };

      new Chart(overviewCtx, overviewConfig);
    }
  }

  private createDetailsChart(labels: string[], values: number[]): void {
    const detailsCtx = this.detailsChartRef.nativeElement.getContext('2d');
    if (detailsCtx) {
      const detailsConfig: ChartConfiguration<'bar'> = {
        type: 'bar',
        data: {
          labels: labels,
          datasets: [{
            label: 'Sales Quantity (Ticket)',
            data: values,
            backgroundColor: 'rgba(255, 99, 132, 0.6)',
            borderColor: 'rgba(255, 99, 132, 1)',
            borderWidth: 2,
          }]
        },
        options: {
          responsive: true,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      };

      new Chart(detailsCtx, detailsConfig);
    }
  }
}
