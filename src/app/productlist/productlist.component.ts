import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { DialogComponent } from '../dialog/dialog.component';
import { ApiService } from '../services/api.service';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';

export interface ProductData {
  id: number;
  productName: string;
  category: string;
  freshness: string;
  price: number;
  comment: string;
  date: string;
}

@Component({
  selector: 'app-productlist',
  templateUrl: './productlist.component.html',
  styleUrls: ['./productlist.component.scss'],
})
export class ProductlistComponent implements OnInit {
  displayedColumns: string[] = [
    'id',
    'productName',
    'category',
    'freshness',
    'price',
    'comment',
    'date',
    'actions',
  ];
  dataSource!: MatTableDataSource<ProductData>;

  @ViewChild(MatPaginator) paginator!: MatPaginator;
  @ViewChild(MatSort) sort!: MatSort;

  constructor(private api: ApiService, private dialog: MatDialog) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.api.getProducts().subscribe({
      next: (res) => {
        // console.log(res);
        this.dataSource = new MatTableDataSource(res);
        this.dataSource.paginator = this.paginator;
        this.dataSource.sort = this.sort;
      },
      error: (err) => {
        alert('Error while fetching Products!!!');
      },
    });
  }

  //direct pass
  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  editProduct(row: ProductData) {
    this.dialog
      .open(DialogComponent, {
        width: '30%',
        data: row, //go diaolog component and add import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
        //to get the data without refresh the page
      })
      .afterClosed()
      .subscribe((val) => {
        if (val === 'update') {
          this.getAllProducts();
        }
      });
  }
  deleteProduct(id: number) {
    this.api.deleteProduct(id).subscribe({
      next: (res) => {
        // console.log(res);
        alert('Product deleted successfully');
        this.getAllProducts();
      },
      error: (err) => {
        alert('Error while deleting Product!!!');
      },
    });
  }
}
