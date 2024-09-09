import { Component, ElementRef, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { NotificationsService } from './notifications.service';
import { Subscription } from 'rxjs';

interface NotificationList {
  type: 'info' | 'error' | 'check';
  title: string;
  message: string;
}

@Component({
  selector: 'notifications',
  standalone: true,
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.scss'],
  imports:[]
})
export class NotificationsComponent implements OnInit, OnDestroy{
  public isEnabled: boolean = false;
  public type: 'error' | 'info' | 'check' = 'error';
  public message: string = 'Esta es una notificación';
  public title: string = 'Título de la notificación';
  private subscription: Subscription;

  constructor(private notificationsService: NotificationsService,
    private elementRef: ElementRef,
    private renderer: Renderer2
  ) {
    this.subscription = new Subscription();
  }

  ngOnInit() {
    // Suscribirse al servicio para recibir notificaciones
    this.subscription.add(
      this.notificationsService.notification.subscribe((notification: NotificationList) => {
        this.type = notification.type;
        this.message = notification.message;
        this.title = notification.title;
        this.notificar(); // Aplicar los estilos primero
        this.isEnabled = true; // Mostrar la notificación después
      })
    );
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }


  public notificar() {
    setTimeout(() => {
    const element = this.elementRef.nativeElement.querySelector('.notification');

    interface NotificationStyles {
      backgroundColor: string;
      borderColor: string;
      color: string;
      closeButtonBg: string;
      closeButtonHv: string;
    }

    const errorStyle: NotificationStyles = {
      backgroundColor: '#FFAEA2B3',
      borderColor: '#d9534f',
      color: '#402929B5',
      closeButtonBg: '#f2f2fff',
      closeButtonHv: '#fff',
    };

    const checkStyle: NotificationStyles = {
      backgroundColor: '#B5F0E6B3',
      borderColor: '#5bc0de',
      color: '#354543B5',
      closeButtonBg: '#f2f2f2b3',
      closeButtonHv: '#00000b3',
    };

    const neutralStyle: NotificationStyles = {
      backgroundColor: '#FCF6F6B3',
      borderColor: '#5bc0de',
      color: '#2B2E31B5',
      closeButtonBg: '#f2f2f2b3',
      closeButtonHv: '#00000b3',
    };

    let selectedStyle: NotificationStyles;

    switch (this.type) {
      case 'error':
        selectedStyle = errorStyle;
        break;
      case 'check':
        selectedStyle = checkStyle;
        break;
      default:
        selectedStyle = neutralStyle;
    }
    if (element) {
      this.renderer.setStyle(element, 'background-color', selectedStyle.backgroundColor);
      this.renderer.setStyle(element, 'border-color', selectedStyle.borderColor);
      this.renderer.setStyle(element, 'color', selectedStyle.color);

      const closeButton = element.querySelector('.close-button');
      if (closeButton) {
        this.renderer.setStyle(closeButton, 'background-color', selectedStyle.closeButtonBg);
      }

      // Aplicar estilos directamente
      element.style.setProperty('--notification-background', selectedStyle.backgroundColor);
      element.style.setProperty('--notification-border-color', selectedStyle.borderColor);
      element.style.setProperty('--notification-color', selectedStyle.color);
      element.style.setProperty('--notification-close-bg', selectedStyle.closeButtonBg);
      element.style.setProperty('--notification-hover-bg', selectedStyle.closeButtonHv);
    } else {
      console.error('Notification element not found');
    }},1);
  }


  public close() {
    this.isEnabled = false;
    console.log('Notification closed:', this.isEnabled);
  }
}
