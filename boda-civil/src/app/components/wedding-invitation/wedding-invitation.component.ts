import { Component, OnInit, AfterViewInit, ElementRef, ViewChild, signal, CUSTOM_ELEMENTS_SCHEMA,inject  } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { gsap } from 'gsap';

interface MapModalData {
  title: string;
  embedUrl: SafeResourceUrl;
  gpsUrl: string;
}

@Component({
  selector: 'app-wedding-invitation',
  standalone: true,
  imports: [CommonModule],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  templateUrl: './wedding-invitation.component.html',
  styleUrls: ['./wedding-invitation.component.css']
})
export class WeddingInvitationComponent implements OnInit, AfterViewInit {

  private sanitizer = inject(DomSanitizer);

  @ViewChild('envelopeWrapper') envelopeWrapper!: ElementRef;
  @ViewChild('flapPolygon') flapPolygon!: ElementRef;
  @ViewChild('waxSeal') waxSeal!: ElementRef;
  @ViewChild('mainCard') mainCard!: ElementRef;
  @ViewChild('cardFolder') cardFolder!: ElementRef;
  @ViewChild('fullContent') fullContent!: ElementRef;
  @ViewChild('bgMusic') bgMusic!: ElementRef<HTMLAudioElement>;

  @ViewChild('modalOverlay') modalOverlay!: ElementRef;
  @ViewChild('modalCard') modalCard!: ElementRef;

  isMapModalOpen = false;  
  activeModalData!: MapModalData;

  public isOpened = signal<boolean>(false);
  public isMuted = signal<boolean>(false);  
  public countdown = signal({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  private targetDate = new Date('2026-08-28T12:00:00').getTime();
  public showGalleryModal = signal<boolean>(false); // Control para el Álbum
  // Variable de control para el estado del Popup
  public isRsvpModalOpen: boolean = false;  

  private readonly MAPS_DATABASE = {
    ceremonia: {
      title: 'Ubicación de la Ceremonia',
      // ⚠️ CORREGIDO: Cambiado 'https://google.com' por la URL real del mapa de la Municipalidad de Surco
      embed: 'https://google.com' + 
             '&iwloc=near' + 
             '&style=feature:poi.business|element:all|visibility:off' + 
             '&style=feature:poi.medical|element:all|visibility:off' +  
             '&style=feature:transit|element:all|visibility:off',       
      
      gps: 'geo:-12.1387123,-76.9871869?q=-12.1387123,-76.9871869(Municipalidad+Santiago+de+Surco)'
    },
    recepcion: {
      title: 'Ubicación de la Recepción',
      // ⚠️ CORREGIDO: Cambiado 'https://google.com' por la URL real del mapa del Condominio Espacio Ferré
      embed: 'https://google.com' +
             '&iwloc=near' + 
             '&style=feature:poi.business|element:all|visibility:off' + 
             '&style=feature:poi.attraction|element:all|visibility:off' + 
             '&style=feature:road|element:labels.text.fill|color:#746855', 
      
      gps: 'geo:-12.1430218,-77.0119539?q=-12.1430218,-77.0119539(Condominio+Espacio+Ferre)'
    }
  };

  ngOnInit(): void { this.initCountdown(); }
  ngAfterViewInit(): void { this.initBackgroundParticles(); }

  private initCountdown(): void {
    setInterval(() => {
      const now = new Date().getTime();
      const distance = this.targetDate - now;
      if (distance > 0) {
        this.countdown.set({
          days: Math.floor(distance / (1000 * 60 * 60 * 24)),
          hours: Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((distance % (1000 * 60)) / 1000)
        });
      }
    }, 1000);
  }

  private initBackgroundParticles(): void {
    // ✦ 1. Destellos dorados incandescentes repartidos por la pantalla
    gsap.to('.gold-sparkle', {
      y: '-105vh',
      left: 'random(5, 95, 1)%', 
      scale: 'random(0.5, 1.4)', // Aumentado rango para dar mayor presencia física
      opacity: 'random(0.4, 0.9)', 
      duration: 'random(5, 10)', // Más rápidos para simular destellos vivos
      repeat: -1,
      ease: 'power1.inOut',
      stagger: 0.2,
      force3D: true
    });
  
    // 🌹 2. Lluvia constante de pétalos de rosa
    gsap.fromTo('.celebration-petal', 
      { y: '-15vh', opacity: 0, left: 'random(5, 95, 1)%', rotation: 'random(0, 360)', scale: 'random(0.6, 1.3)' }, 
      { y: '115vh', x: 'random(-50, 50)', rotation: 'random(360, 720)', opacity: 'random(0.6, 0.95)', duration: 'random(6, 10)', repeat: -1, ease: 'none', stagger: 0.15, force3D: true }
    );
  
    // 🌿 3. NUEVO: Caída libre y balanceo de las hojas de Olivo Silvestre
    gsap.fromTo('.olive-leaf-particle', 
      { 
        y: '-15vh', 
        opacity: 0, 
        left: 'random(5, 95, 1)%', 
        rotation: 'random(0, 180)', 
        scale: 'random(0.5, 1.1)' 
      }, 
      { 
        y: '115vh', 
        x: 'random(-70, 70)',            /* Balanceo lateral único estilo hoja */
        rotation: 'random(540, 900)',    /* Giros en espiral elegantes */
        opacity: 'random(0.5, 0.85)', 
        duration: 'random(7, 11)',       /* Caen más lento que los pétalos por aerodinámica */
        repeat: -1, 
        ease: 'none', 
        stagger: 0.25, 
        force3D: true 
      }
    );
  }

  public toggleGalleryModal(open: boolean): void {
    this.showGalleryModal.set(open);
  }

  public openEnvelope(): void {
    if (this.isOpened()) return;
    this.isOpened.set(true);
    this.playAudio();
  
    this.waxSeal.nativeElement.classList.remove('premium-shake');
  
    const tl = gsap.timeline();
  
    // 1. Ruptura del sello de cera
    tl.to(this.waxSeal.nativeElement, { scale: 1.3, opacity: 0, duration: 0.4, ease: 'power2.out' });
  
    // 2. La solapa se encoge hacia arriba de forma líquida
    tl.to(this.flapPolygon.nativeElement, { 
      attr: { points: "0,0 300,0 150,0" }, 
      opacity: 0.3,
      duration: 0.6, 
      ease: 'power3.inOut' 
    }, '-=0.2');
  
    // 3. La tarjeta pequeña asoma del sobre deslizándose hacia arriba de forma fluida
    tl.to(this.mainCard.nativeElement, { 
      y: '-260px', 
      scale: 1.02,
      duration: 0.95, 
      ease: 'power2.out' 
    }, '-=0.15');
  
    // 4. El sobre completo baja y se desvanece de forma líquida hacia abajo
    tl.to(this.envelopeWrapper.nativeElement, { 
      y: '40vh',              
      opacity: 0,             
      scale: 0.95,
      duration: 1.4,          
      ease: 'power3.inOut'    
    }, '+=0.05');
  
    // 5. REVELADO CONTINUO SÍNCRONO: La invitación final aparece en el mismo hilo de tiempo
    tl.set(this.fullContent.nativeElement, { display: 'block' }, '-=1.4');
    
    tl.fromTo(this.fullContent.nativeElement, 
      { y: '80px', opacity: 0, scale: 0.97 },
      { 
        y: '0px', 
        opacity: 1, 
        scale: 1,
        duration: 1.4, 
        ease: 'power3.out'    
      }, 
      '-=1.35'                
    );
  
    // 6. DESPLIEGUE ELEGANTE EN 3D DE LA INVITACIÓN
    tl.fromTo(this.cardFolder.nativeElement, 
      { rotateX: 6, transformOrigin: 'center bottom' },
      { 
        rotateX: 0, 
        duration: 1.2, 
        ease: 'power2.out'
      }, 
      '-=1.2'
    );
  
    // 7. Coreografía UX: Aparición escalonada de las secciones de texto internas
    tl.fromTo(['.card-header', '.countdown-section', '.details-section', '.location-section', '.dress-code-section'],
      { y: 20, opacity: 0 },
      { 
        y: 0, 
        opacity: 1, 
        duration: 0.8, 
        stagger: 0.15,        
        ease: 'power2.out',
        onComplete: () => {
          // Remover el sobre del DOM al terminar todo el flujo
          gsap.set(this.envelopeWrapper.nativeElement, { display: 'none' });
          document.body.style.overflow = 'auto';
          document.documentElement.style.overflow = 'auto';
        }
      },
      '-=0.5'
    );
    
    // 💡 NOTA: La lluvia de pétalos ya no se detiene ni se reinicia aquí; sigue cayendo encima fluidamente
  }

  private playAudio(): void {
    if (this.bgMusic && this.bgMusic.nativeElement) {
      this.bgMusic.nativeElement.volume = 0.5;
      this.bgMusic.nativeElement.play().catch(() => {});
    }
  }

  public toggleMute(): void {
    if (this.bgMusic && this.bgMusic.nativeElement) {
      this.bgMusic.nativeElement.muted = !this.bgMusic.nativeElement.muted;
      this.isMuted.set(this.bgMusic.nativeElement.muted);
    }
  }

  // Función para abrir o cerrar el modal rsvp
  public toggleRsvpModal(state: boolean): void {
    this.isRsvpModalOpen = state;
  }

  public sendWhatsAppRSVP(name: string, tickets: string): void {
    if (!name.trim()) {
      alert("Por favor, ingresa tu nombre completo antes de confirmar.");
      return;
    }
    
    // 📱 Número de WhatsApp real (Gino y Claudia)
    const phoneNumber = "51959087092"; 
    
    // 🎨 Mensaje formal codificado de manera segura
    const message = encodeURIComponent(
      `¡Hola Gino y Claudia! ✨\n\nConfirmo con mucha alegría mi asistencia a su boda civil el próximo 18 de Setiembre del 2027.\n\n👤 Nombre: ${name}\n🎟️ Pases reservados: ${tickets}\n\n¡Gracias por hacernos parte de este hermoso día! 🥂`
    );
    
    // 🧠 DETECTOR INTELIGENTE DE DISPOSITIVOS MÓVILES (iOS / Android / BlackBerry / Windows Phone)
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
      navigator.userAgent
    );

    let finalUrl: string;

    if (isMobile) {
      // 🚀 PROTOCOLO NATIVO PARA MÓVILES: Levanta la App de WhatsApp directamente sin pasar por el navegador
      finalUrl = `whatsapp://send?phone=${phoneNumber}&text=${message}`;
    } else {
      // 💻 API WEB PARA COMPUTADORAS: Abre una pestaña limpia de WhatsApp Web de forma oficial
      finalUrl = `https://whatsapp.com{phoneNumber}&text=${message}`;
    }
    
    // Cerramos el popup modal de confirmación antes de la redirección
    this.toggleRsvpModal(false); 
    
    // Ejecutamos la apertura en una pestaña limpia garantizando compatibilidad total
    window.open(finalUrl, '_blank');
  }

  // ✉️ REGRESAR AL SOBRE (REVERTIR ANIMACIÓN Y CERRAR INVITACIÓN)
  public closeInvitation(): void {
    // 1. Apagamos el Signal de apertura de Angular de inmediato
    this.isOpened.set(false);   
    window.location.reload();
  }

  openMapModal(type: 'ceremonia' | 'recepcion') {
    const selectedMap = this.MAPS_DATABASE[type];
    
    this.activeModalData = {
      title: selectedMap.title,
      // El secreto maestro: Saneamos el string para que el iframe lo pinte sin quedarse en blanco
      embedUrl: this.sanitizer.bypassSecurityTrustResourceUrl(selectedMap.embed),
      gpsUrl: selectedMap.gps
    };

    this.isMapModalOpen = true;
    
    setTimeout(() => {
      gsap.fromTo(this.modalOverlay.nativeElement, { opacity: 0 }, { opacity: 1, duration: 0.4 });
      gsap.fromTo(this.modalCard.nativeElement, { scale: 0.85, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.4, ease: 'back.out(1.4)' });
    }, 15);
  }

  closeMapModal() {
    gsap.to(this.modalCard.nativeElement, { scale: 0.9, opacity: 0, duration: 0.3 });
    gsap.to(this.modalOverlay.nativeElement, {
      opacity: 0, duration: 0.3,
      onComplete: () => { this.isMapModalOpen = false; }
    });
  }
}