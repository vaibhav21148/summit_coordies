import { Component, Input } from '@angular/core';
import { NavbarComponent } from 'src/app/components/navbar/navbar.component';
import { FooterComponent } from 'src/app/components/footer/footer.component';
import { VantaBgComponent } from "@shared/vanta-bg/vanta-bg.component";
@Component({
  selector: 'app-form',
  standalone: true,
  imports: [NavbarComponent, FooterComponent, VantaBgComponent],
  templateUrl: './form.component.html',
  styleUrl: './form.component.scss',
})
export class FormComponent {
  @Input() showFooter = true;
  @Input() showNavbar = true;
}
