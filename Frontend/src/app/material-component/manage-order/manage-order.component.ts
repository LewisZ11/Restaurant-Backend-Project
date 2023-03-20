import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {CategoryService} from '../../services/category.service';
import {ProductService} from '../../services/product.service';
import {SnackbarService} from '../../services/snackbar.service';
import {BillService} from '../../services/bill.service';
import {NgxUiLoaderService} from 'ngx-ui-loader';
import {GlobalConstants} from '../../shared/global-constants';
import {saveAs} from 'file-saver';
import jwtDecode from 'jwt-decode';

@Component({
  selector: 'app-manage-order',
  templateUrl: './manage-order.component.html',
  styleUrls: ['./manage-order.component.scss']
})
export class ManageOrderComponent implements OnInit {

  displayedColumns: string[] = ['name', 'category', 'price', 'quantity', 'total', 'edit'];
  dataSource: any = [];
  manageOrderForm: any = FormGroup;

  categories: any = [];

  products: any = [];
  price: any;
  totalAmount: number = 0;
  responseMessage: any;

  constructor(
      private formBuilder: FormBuilder,
      private categoryService: CategoryService,
      private productService: ProductService,
      private snackbarService: SnackbarService,
      private billService: BillService,
      private ngxService: NgxUiLoaderService,
    ) { }

  ngOnInit(): void {
    this.ngxService.start();
    this.getCategories();
    if (this.getAuthority() === 'admin') {
      this.manageOrderForm = this.formBuilder.group({
        name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
        email: [null, [Validators.required, Validators.pattern(GlobalConstants.emailRegex)]],
        contactNumber: ['', [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
        paymentMethod: [null, [Validators.required]],
        product: [null, [Validators.required]],
        category: [null, [Validators.required]],
        quantity: [null, [Validators.required]],
        price: [null, [Validators.required]],
        total: [0, [Validators.required]]
      });
    } else {
      let pattern: string = '^' + this.getUserName() + '$';
      console.log('pattern is', pattern, typeof pattern);
      this.manageOrderForm = this.formBuilder.group({
        name: [null, [Validators.required, Validators.pattern(GlobalConstants.nameRegex)]],
        email: [null, [Validators.required, Validators.pattern(pattern)]],
        contactNumber: ['', [Validators.required, Validators.pattern(GlobalConstants.contactNumberRegex)]],
        paymentMethod: [null, [Validators.required]],
        product: [null, [Validators.required]],
        category: [null, [Validators.required]],
        quantity: [null, [Validators.required]],
        price: [null, [Validators.required]],
        total: [0, [Validators.required]]
      });
    }
    

  }

  getAuthority(): string {
    let token = localStorage.getItem('token');
    if (!token) {
      return 'user';
    } else {
      let userRole = jwtDecode(token);
      console.log('userRole is', userRole, typeof userRole);
      let userRoleObj = Object(userRole);
      console.log('userRole role is', userRoleObj.role, typeof userRoleObj.role);
      if (userRoleObj.role === 'user') {
        return 'user';
      } else {
        return 'admin';
      }
    }

  }

  getUserName(): string {
    let token = localStorage.getItem('token');
    if (!token) {
      return 'user';
    } else {
      let userRole = jwtDecode(token);
      console.log('userRole is', userRole, typeof userRole);
      let userRoleObj = Object(userRole);
      console.log('userRole role is', userRoleObj.role, typeof userRoleObj.role);
      if (userRoleObj.role === 'user') {
        return userRoleObj.sub as string;
      } else {
        return 'admin';
      }
    }
  }

  getCategories(): void {
    // this.ca
    this.categoryService.getFilteredCategorys().subscribe((response: any) => {
      this.ngxService.stop();
      this.categories = response;
    }, (error) => {
      this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  getProductsByCategory(value: any) {
    this.productService.getProductsByCategory(value.id).subscribe((response: any) => {
      this.products = response;
      this.manageOrderForm.controls['price'].setValue('');
      this.manageOrderForm.controls['quantity'].setValue('');
      this.manageOrderForm.controls['total'].setValue(0);
    }, (error: any) => {
      // this.ngxService.stop();
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  getProductDetails(value: any) {
    this.productService.getById(value.id).subscribe((response:any) => {
      this.price = response.price;
      console.log('in get Product details response is', response, 'this.price is', this.price);
      console.log(this.manageOrderForm.controls['price']);
      // console.log(this.manageOrderForm.controls['price'] === this.manageOrderForm.controls.price);
      this.manageOrderForm.controls['price'].setValue(this.price);
      // this.manageOrderForm.get('price').setValue(100);
      console.log(this.manageOrderForm.controls);
      this.manageOrderForm.controls['quantity'].setValue('1');
      console.log(this.manageOrderForm.controls.quantity.value);
      this.manageOrderForm.controls['total'].setValue(this.price * 1);
    }, (error: any) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
    });
  }

  setQuantity(value: any) {
    var temp = this.manageOrderForm.controls['quantity'].value;
    console.log('in set Quantity', temp);
    if (temp > 0) {
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls.quantity.value * this.manageOrderForm.controls['price'].value);
    } else if (temp != '') {
      this.manageOrderForm.controls['total'].setValue('1');
      this.manageOrderForm.controls['total'].setValue(this.manageOrderForm.controls['quantity'].value * this.manageOrderForm.controls['price'].value);
    }
  }

  validateProductAdd(): boolean {
    if (this.manageOrderForm.controls['total'].value === 0
      || this.manageOrderForm.controls['total'].value === null
      || this.manageOrderForm.controls['quantity'].value <= 0) {
      return true;
    } else {
      return false;
    }
  }

  // not regualr function
  validateSubmit(): boolean {
    if (this.totalAmount === 0
      || this.manageOrderForm.controls['name'].value === null
      || this.manageOrderForm.controls['contactNumber'] === null
      || this.manageOrderForm.controls['paymentMethod'] === null) {
      return true;
    } else {
      return false;
    }
  }

  add(): void {
    var formData = this.manageOrderForm.value;
    var productName = this.dataSource.find((e: {id: number}) => e.id === formData.product.id);
    if (productName === undefined) {
      this.totalAmount = this.totalAmount + formData.total;
      this.dataSource.push(
        {id: formData.product.id,
          name: formData.product.name,
          category: formData.category.name,
          quantity: formData.quantity,
          price: formData.price,
          total: formData.total});
      this.dataSource = [...this.dataSource];
      this.snackbarService.openSnackBar(GlobalConstants.productAdded, 'success');
    } else {
      this.snackbarService.openSnackBar(GlobalConstants.productExistError, GlobalConstants.error);
    }
  }

  handleDeleteAction(value: any, element: any): void {
    this.totalAmount = this.totalAmount - element.total;
    this.dataSource.splice(value, 1);
    this.dataSource = [...this.dataSource];
  }

  submitAction(): void {
    var formData = this.manageOrderForm.value;
    var data = {
      name: formData.name,
      email: formData.email,
      contactNumber: formData.contactNumber,
      paymentMethod: formData.paymentMethod,
      totalAmount: this.totalAmount.toString(),
      productDetails: JSON.stringify(this.dataSource)
    };

    this.ngxService.start();
    this.billService.generateReport(data).subscribe((response:any) => {
      console.log(response);
      //this.downloadFile(response?.uuid);
      this.manageOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;
      this.ngxService.stop();
    }, (error: any) => {
      console.log(error);
      if (error.error?.message) {
        this.responseMessage = error.error?.message;
      } else {
        this.responseMessage = GlobalConstants.genericError;
      }
      this.manageOrderForm.reset();
      this.dataSource = [];
      this.totalAmount = 0;
      this.snackbarService.openSnackBar(this.responseMessage, GlobalConstants.error);
      this.ngxService.stop();
    });
  }

  // downloadFile(fileName: string) {
  //   var data = {
  //     uuid: fileName
  //   };

  //   this.billService.getPdf(data).subscribe((response: any) => {
  //     console.log('response in bill service get Pdf', response);
  //     saveAs(response,fileName + '.pdf');
  //     this.ngxService.stop();
  //   }, (error:any) => {
  //     // console.log(error);
  //     console.log('error in downFile');
  //     this.ngxService.stop();
  //   });

  // }

}
