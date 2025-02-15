import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { TicketService } from '../services/ticket.service';
import { AuthService } from '../../service/auth.service';
import { PaymentMethod } from '../../../models/payment-method.model';
import { AlertService } from '../../../shared/custom-alert/alert.service';

interface BuyTicket{
  userId: number;
  totalAmount: number;
  status: String;
  discount: number;
  paymentMethod: PaymentMethod;
  loyaltyPointsToUse: number;
  orderDetailsRequests: orderDetailsRequests[];
} 
interface orderDetailsRequests{
  price: number;
  ticketRequest: Ticket[];
}
interface Ticket{
  purchaseDate: String;
  expirationDate: String;
  status: String;
  typeId: number;
}
interface TypeQuantity {
  typeId: number;   
  quantity: number; 
  price : number;
  totalPrice: number;
}

@Component({
  selector: 'app-ticket-booking',
  templateUrl: './buy-ticket.component.html',
  styleUrls: ['./buy-ticket.component.css']
})

export class BuyTicketComponent implements OnInit {
  minDate: string = "";
  currentStep: number = 1;
  typeQuantity: TypeQuantity[] = [];
  discount = 0;
  totalPrice = 0;
  priceToPay = 0;
  formattedDateTime: string ='';
  formattedNextDateTime: string ='';
  
  constructor(private router: Router, private ticketService: TicketService, private authService: AuthService, private alertService: AlertService) {
      const today = new Date();
      this.minDate = today.toISOString().split('T')[0];
  }
  
  ngOnInit(): void {
    this.fetchTypes();
    this.authService.fetchUserInfo().subscribe((info) => {
      this.userInfo = info;
    });
  }
  confirmStepFour() {
    const orderDetailsRequests = this.typeQuantity
      .filter(item => item.quantity > 0) 
      .map(item => {
        const tickets = Array(item.quantity).fill(0).map(() => ({
          purchaseDate: `${this.selectedDate}T${this.selectedTime}`,
          expirationDate: `${this.nextDayDate}T${this.selectedTime}`,
          status: "PENDING",
          typeId: item.typeId
        }));
        
        return {
          price: item.price,
          ticketRequest: tickets
        };
      });
  
    
    const buyTicket: BuyTicket = {
      userId: this.userInfo?.id || 1, 
      totalAmount: this.priceToPay,
      status: "pending",
      discount: this.discount,
      paymentMethod: PaymentMethod.CASH, 
      loyaltyPointsToUse: this.score,
      orderDetailsRequests: orderDetailsRequests.length > 0 ? orderDetailsRequests : [] 
    };
  
    this.ticketService.createTicket(buyTicket).subscribe(
      response => {
        if (this.userInfo) {
          this.userInfo.loyaltyPoints -= this.score;
        }
        this.alertService.showAlert('Booking successful','success');
        this.router.navigate(['customer']);
      },
      error => {
        console.error("Purchase failed:", error);
        this.alertService.showAlert("Failed to complete the purchase. Please try again.");
      }
    );
  }
  

  userInfo: any;
  score: number = 0;

  
  getTypeById(id: number): any {
    return this.types.find(type => type.id === id) || null;
  }
  updateQuantity() {
    this.types.forEach(item => {
      const existingType = this.typeQuantity.find(type => type.typeId === item.id);
      if (existingType) {
        existingType.totalPrice = existingType.quantity * existingType.price;
      }
    });
  }
  
  removeTypeQuantity(typeId: number) {
    const index = this.typeQuantity.findIndex(item => item.typeId === typeId);
    if (index !== -1) {
        this.typeQuantity.splice(index, 1);
    }
  }

  confirmStepThree() {
    const hasQuantityGreaterThanZero = this.typeQuantity.some(item => item.quantity > 0);
    if(!hasQuantityGreaterThanZero){
      this.alertService.showAlert("Please select ticket");
    }
    else{
      if (this.score !== null) {
        if (this.score > this.userInfo.loyaltyPoints) {
          this.alertService.showAlert("Your loyalty points are not enough to buy the tickets.");
        }
        else {
          this.updateQuantity();
          this.discount = Math.round(this.score * this.userInfo.loyaltyPointValue);
          this.totalPrice = this.typeQuantity.reduce((total, item) => total + item.totalPrice, 0);
          this.priceToPay = this.totalPrice - this.discount;
          this.nextStep();
        }
      }
    }
    
  }
  //step 2
  changeNum(num: number, id: number) {
    const typeIndex = this.typeQuantity.findIndex(item => item.typeId === id);
    if (typeIndex !== -1) {
        if ((this.typeQuantity[typeIndex].quantity > 0 && num === -1) || 
            (this.typeQuantity[typeIndex].quantity < 15 && num === 1)) {
            this.typeQuantity[typeIndex].quantity += num;
        }
      }
  }
  getQuantity(typeId: number): number {
    if (!this.typeQuantity) return 0; 
    const type = this.typeQuantity.find(item => item.typeId === typeId);
    return type ? type.quantity : 0;
  }


  confirmStepTwo() {
    const allQuantitiesZero = this.typeQuantity.every(item => item.quantity === 0);
    if (allQuantitiesZero) {
      this.alertService.showAlert("Please select at least one type and quantity.");
    }else{
      this.nextStep();
    }
  }
  //step 1
  selectedDate: string = "";
  selectedTime: string = "";
  nextDayDate: string = "";
  updateDate(date: string) {
    this.selectedDate = date;
  }
  onDateChange() {
    if (this.selectedDate) {
      const date = new Date(this.selectedDate);
      date.setDate(date.getDate() + 1);
      this.nextDayDate = date.toISOString().split('T')[0];
    }
  }
  confirmStepOne() {
    if (this.selectedDate && this.selectedTime) {
      this.formattedDateTime = `${this.selectedDate}T${this.selectedTime}`;
      this.formattedNextDateTime = `${this.nextDayDate}T${this.selectedTime}`;
      this.nextStep();
    } else {
      this.alertService.showAlert("Please select both date and time.");
    }
  }

    // next page
  nextStep() {
    if (this.currentStep < 4) {
      this.currentStep++;
    }
  }

  prevStep() {
    this.fetchTypes();
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

//  getType
  types: any[]=[];
  fetchTypes() {
    if (this.typeQuantity.length === 0) { 
      this.ticketService.getAllTypeOnActive().subscribe(
        (data: any) => {
          this.types = data; 
          this.types.forEach(item => {
            this.typeQuantity.push({ 
              typeId: item.id, 
              quantity: 0, 
              price: item.price,
              totalPrice: 0
            });
          });
        },
        error => {
          console.error('Error fetching events:', error); 
        }
      );
    }
  }
}

