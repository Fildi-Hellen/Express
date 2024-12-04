import { Component } from '@angular/core';
import { AdminService } from '../../Services/admin.service';
import { Vendor } from '../../Models/vendor.model'; 

@Component({
  selector: 'app-vendor-management',
  templateUrl: './vendor-management.component.html',
  styleUrls: ['./vendor-management.component.css']
})
export class VendorManagementComponent {

  
  vendors: Vendor[] = []; // Use Vendor type
  verifiedVendors: Vendor[] = []; // Use Vendor type
  message!: string;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadUnverifiedVendors();
  }

  // Load unverified vendors
  loadUnverifiedVendors() {
    this.adminService.getUnverifiedVendors().subscribe(
      (vendors: Vendor[]) => { // Explicitly type the response as Vendor[]
        this.vendors = vendors.map(vendor => ({ ...vendor, status: 'Unverified' }));
      },
      (error) => {
        console.error('Error fetching unverified vendors:', error);
      }
    );
  }

  // Verify vendor
  verifyVendor(vendor: Vendor) { // Explicitly type vendor as Vendor
    this.adminService.verifyVendor(vendor.id).subscribe(
      () => {
        vendor.status = 'Verified';
        this.verifiedVendors.push(vendor);
        this.vendors = this.vendors.filter(v => v.id !== vendor.id);
        this.message = 'Vendor verified successfully.';
      },
      (error) => {
        console.error('Error verifying vendor:', error);
      }
    );
  }

  // Reject vendor
  rejectVendor(vendorId: number) {
    this.adminService.rejectVendor(vendorId).subscribe(
      () => {
        const vendor = this.vendors.find(v => v.id === vendorId);
        if (vendor) {
          vendor.status = 'Rejected';
        }
        this.vendors = this.vendors.filter(v => v.id !== vendorId);
        this.message = 'Vendor rejected successfully.';
      },
      (error) => {
        console.error('Error rejecting vendor:', error);
      }
    );
  }

  // Request more information
  requestMoreInfo(vendorId: number, infoMessage: string) {
    this.adminService.requestMoreInfo(vendorId, infoMessage).subscribe(
      () => {
        const vendor = this.vendors.find(v => v.id === vendorId);
        if (vendor) {
          vendor.status = 'Info Requested';
        }
        this.message = 'Request for more information sent.';
      },
      (error) => {
        console.error('Error requesting more information:', error);
      }
    );
  }

}
