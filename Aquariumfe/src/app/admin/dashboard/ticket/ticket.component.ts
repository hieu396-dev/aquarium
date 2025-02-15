import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrderService } from '../services/order.service';

export enum TiiketStatus {                
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  USED = 'USED',
  EXPIRED = 'EXPIRED',
  ON_HOLD = 'ON_HOLD',     
}
@Component({
  selector: 'app-ticket',
  templateUrl: './ticket.component.html',
  styleUrl: './ticket.component.css'
})
export class TicketComponent implements OnInit {
  orderDetails: any[] = [];
  orderId: number | null = null;
  ticketStatusValues = Object.values(TiiketStatus);
  constructor(private route: ActivatedRoute, private orderService: OrderService) { }
ngOnInit(): void {
  this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if(id){
      this.orderId = parseInt(id,10)
      this.orderService.getOrderDetails(this.orderId).subscribe(order =>{
        this.orderDetails = order;
      });
    }
  });
}
  isPopupVisible = false;
  selectedTicket: any;  

  openPopup(ticket: any) {
    this.selectedTicket = ticket;
    this.isPopupVisible = true;
  }

  closePopup() {
    this.isPopupVisible = false;
  }
  updateTicket() {
    if (this.selectedTicket) {
      this.orderService.updateTicketStatus(this.selectedTicket.orderDetailsId, this.selectedTicket.status)
        .subscribe(
          response => {
            this.closePopup();
          },
          error => {
            console.error('Error occurred:', error);
            alert('Failed to update ticket status.');
          }
        );
    }
  }
  
}
