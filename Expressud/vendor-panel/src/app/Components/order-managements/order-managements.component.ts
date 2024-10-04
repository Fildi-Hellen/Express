import { Component, OnInit } from '@angular/core';
import { OrderService } from '../../Services/order.service';

@Component({
  selector: 'app-order-managements',
  templateUrl: './order-managements.component.html',
  styleUrls:[ './order-managements.component.css']
})
export class OrderManagementsComponent implements OnInit {

  
  orders!: any[];
  selectedOrder: any;

 constructor(private orderService: OrderService) { }

 ngOnInit(): void {
   this.getOrders();
 }

 getOrders(): void {
   this.orderService.getOrders().subscribe(
     data => this.orders = data,
     error => console.error('There was an error!', error)
   );
 }

 viewOrderDetails(orderId: number): void {
   this.orderService.getOrderDetails(orderId).subscribe(data => {
     this.selectedOrder = data;
   });
 }

 updateOrderStatus(orderId: number, status: string): void {
   this.orderService.updateOrderStatus(orderId, status).subscribe(data => {
     alert('Order status updated successfully');
     this.ngOnInit(); // Refresh the orders list
   });
 }

 printReceipt(id: number): void {
   // Logic to print the receipt for the given orderId
   // You can implement this based on your requirements, such as opening a print dialog or generating a PDF
 }

}
