import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-list-order',
  templateUrl: './list-order.component.html',
  styleUrls: ['./list-order.component.css']
})
export class ListOrderComponent implements OnInit {
  orders: any[] = [];
  filteredOrders: any[] = [];
  paginatedOrders: any[] = [];
  searchTerm: string = '';
  currentPage: number = 1;
  itemsPerPage: number = 8;
  totalPages: number = 0;
  sortDirection: string = 'asc';
  sortColumn: string = 'email';
  isUserId: boolean = false;
  userId: number | null = null;
  constructor(private route: ActivatedRoute, private router: Router, private orderService: OrderService) { }

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.isUserId = true;
        this.userId = parseInt(id, 10);
        this.orderService.getUserOrder(this.userId).subscribe(order => {
          this.orders = order;
          this.applySearchAndSort();
        });
      } else {
        this.orderService.getAllOrder().subscribe(
          (data) => {
            this.orders = data;
            this.applySearchAndSort();
          },
          (error) => {
            console.error('Error fetching orders:', error);
          }
        );
      }
    });
  }

  applySearchAndSort() {
    this.filteredOrders = this.orders.filter(order =>
      Object.keys(order).some(key =>
        order[key]?.toString().toLowerCase().includes(this.searchTerm.toLowerCase())
      )
    );

    this.filteredOrders.sort((a, b) => {
      const compareA = a[this.sortColumn]?.toString().toLowerCase();
      const compareB = b[this.sortColumn]?.toString().toLowerCase();

      if (this.sortDirection === 'asc') {
        return compareA > compareB ? 1 : compareA < compareB ? -1 : 0;
      } else {
        return compareA < compareB ? 1 : compareA > compareB ? -1 : 0;
      }
    });


    this.calculateTotalPages();
    this.updatePaginatedOrders();
  }

  calculateTotalPages() {
    this.totalPages = Math.ceil(this.filteredOrders.length / this.itemsPerPage);
  }

  updatePaginatedOrders() {
    const startIndex = (this.currentPage - 1) * this.itemsPerPage;
    const endIndex = startIndex + this.itemsPerPage;
    this.paginatedOrders = this.filteredOrders.slice(startIndex, endIndex);
  }

  goToPage(page: number) {
    this.currentPage = page;
    this.updatePaginatedOrders();
  }

  nextPage() {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.updatePaginatedOrders();
    }
  }

  previousPage() {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.updatePaginatedOrders();
    }
  }

  viewOrderDetails(id: number) {
    this.router.navigate([`/admin/dashboard/ticket/${id}`]);
  }

  onSearchTermChange() {
    this.currentPage = 1;
    this.applySearchAndSort();
  }

  toggleSortDirection(column: string) {
    if (this.sortColumn === column) {
      this.sortDirection = this.sortDirection === 'asc' ? 'desc' : 'asc';
    } else {
      this.sortColumn = column;
      this.sortDirection = 'asc';
    }
    this.applySearchAndSort();
  }
}
