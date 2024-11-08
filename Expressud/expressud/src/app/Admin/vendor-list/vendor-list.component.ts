import { Component } from '@angular/core';
import { VendorService } from 'src/app/Services/vendor.service';

@Component({
  selector: 'app-vendor-list',
  templateUrl: './vendor-list.component.html',
  styleUrl: './vendor-list.component.css'
})
export class VendorListComponent {

  vendors: any[] = [];

  constructor(private vendorService: VendorService) { }

  ngOnInit(): void {
    this.loadVendors();
  }

  loadVendors(): void {
    // this.vendorService.getPendingVendors().subscribe(data => {
    //   this.vendors = data;
    // });
  }

  // approveVendor(id: number): void {
  //   this.vendorService.approveVendor(id).subscribe(() => {
  //     alert('Vendor approved successfully.');
  //     this.loadVendors();
  //   });
  // }
}
