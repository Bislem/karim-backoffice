import { NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { CoreService } from 'src/app/services/core.service';

@Component({
  selector: 'app-branding',
  standalone: true,
  imports: [NgIf],
  template: `
    <div class="branding">
      <a href="/" *ngIf="options.theme === 'light'">
      <h2 class="font-extrabold text-2xl text-center uppercase">tv<span class="text-blue-500">pro</span>smart</h2>
        <!-- <img
          src="./assets/images/logo.png"
          class="align-middle m-2"
          alt="logo"
        /> -->
      </a>
      <a href="/" *ngIf="options.theme === 'dark'">
        <img
          src="./assets/images/logos/light-logo.svg"
          class="align-middle m-2"
          alt="logo"
        />
      </a>
    </div>
  `,
})
export class BrandingComponent {
  options = this.settings.getOptions();

  constructor(private settings: CoreService) {}
}
