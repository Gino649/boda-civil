import { Component } from '@angular/core';
import { register as registerSwiper } from 'swiper/element/bundle';
import { WeddingInvitationComponent } from './components/wedding-invitation/wedding-invitation.component';

registerSwiper();

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [WeddingInvitationComponent],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {  
  title = 'G&C Nuestra Boda Civil';
}