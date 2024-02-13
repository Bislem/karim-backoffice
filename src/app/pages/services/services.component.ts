import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DatePipe } from '@angular/common';
import { AppService } from 'src/app/services/app.service';
import { ServicesService } from './services.service';
import { Attachments } from 'src/app/services/models/Attachments';
import { ServicessDialogComponent } from './services-dialog/services-dialog.component';
import { Service } from 'src/app/services/models/Service';

@Component({
  templateUrl: './services.component.html',
})
export class ServicesComponent implements OnInit {
  searchText: any;
  loading: boolean = true;

  services: Service[];
  servicesSource: Service[];
  constructor(
    public dialog: MatDialog,
    public datePipe: DatePipe,
    private serviceService: ServicesService,
    private appService: AppService
  ) { }

  ngOnInit(): void {
    this.serviceService.getAllServices().then(res => {
      console.log(res);
      res.map(p => ({
        ...p,
      }) as Service) as Service[];
      const ps = res;
      this.services = ps;
      this.servicesSource = ps;
    });
    this.serviceService.services.subscribe(res => {
      const ps = res.map(p => ({
        ...p,
      }) as Service) as Service[];
      this.services = ps;
      this.servicesSource = ps;
    });

  }

  applyFilter(filterValue: string): void {
    const ps = this.servicesSource.filter(p => (p.name.toLowerCase().trim().includes(filterValue.toLowerCase().trim())));
    this.services = ps;
  }

  async openDialog(action: 'create' | 'update', service: Service | null) {
    const dialogRef = this.dialog.open(ServicessDialogComponent, {
      data: {
        service: service,
        mode: action,
        title: action === 'create' ? 'Nouveau Produit' : 'Modifier Produit'
      },
      maxWidth: '700px'
    });
    dialogRef.afterClosed().subscribe((result) => {
    });
  }

  getPoster(images: any) {
    return images[0].url;
  }

}

