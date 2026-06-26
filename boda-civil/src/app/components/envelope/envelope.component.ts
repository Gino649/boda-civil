import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { gsap } from 'gsap';

@Component({
  selector: 'app-envelope',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './envelope.component.html',
  styleUrls: ['./envelope.component.css']
})
export class EnvelopeComponent implements OnInit {
  @ViewChild('bgMusic') audioPlayer!: ElementRef<HTMLAudioElement>;

  isOpen: boolean = false;
  isInvitationFullyRevealed: boolean = false;
  isMuted: boolean = true;

  fechaBoda: Date = new Date('2026-08-28T17:00:00');
  countdown = { dias: 0, horas: 0, minutos: 0, segundos: 0 };

  ngOnInit() {
    this.initCountdown();
    this.initAisolationStates();
  }

  initAisolationStates() {
    // Al cargar, forzamos que el sobre abierto y la tarjeta con sus textos sean 100% invisibles
    gsap.set(['.back-layer', '.wedding-card-container', '.card-inner-content'], {
      opacity: 0,
      visibility: 'hidden'
    });

    // Ocultamos la tarjeta por debajo de la ranura del sobre usando clip-path inicial
    gsap.set('.wedding-card-container', {
      clipPath: 'polygon(0% 40%, 100% 40%, 100% 100%, 0% 100%)' 
    });

    // Flotación sutil inicial para el sobre cerrado
    gsap.to('.main-invitation-stage', {
      y: -6,
      duration: 2.2,
      repeat: -1,
      yoyo: true,
      ease: 'power1.inOut'
    });
  }

  startOpeningSequence() {
    if (this.isOpen) return;
    this.isOpen = true;

    gsap.killTweensOf('.main-invitation-stage');

    const audio = this.audioPlayer.nativeElement;
    audio.play().then(() => this.isMuted = false).catch(() => console.log("Audio bloqueado"));

    const tl = gsap.timeline();

    tl.to('.tap-instruction', { opacity: 0, duration: 0.1 })
      
      // Micro-presión de impacto en el sello (Efecto romper lacre)
      .to('.main-invitation-stage', { scale: 0.97, duration: 0.1, yoyo: true, repeat: 1 })

      // Intercambio veloz: Se esfuma el cerrado, se enciende la solapa abierta de SobreAbierto.png
      .set('.back-layer', { visibility: 'visible', opacity: 1 })
      .to('.front-closed-layer', { opacity: 0, duration: 0.25, ease: 'power1.inOut' })
      
      // Emerge la tarjeta: abrimos la máscara hacia arriba y la deslizamos verticalmente
      .set('.wedding-card-container', { visibility: 'visible', opacity: 1 })
      .to('.wedding-card-container', {
        clipPath: 'polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)', // Abre el recorte por arriba
        y: '-32%', // Eleva la tarjeta al centro exacto de la pantalla
        duration: 1.8,
        ease: 'power2.out'
      })

      // El sobre de papel de fondo se desvanece de forma individual sin tocar a la tarjeta
      .to('.back-layer', {
        opacity: 0,
        duration: 0.8,
        ease: 'power1.in'
      }, '+=0.1')
      
      // Se graban de forma nítida las letras de Angular en el centro del marco dorado
      .set('.card-inner-content', { visibility: 'visible' })
      .to('.card-inner-content', {
        opacity: 1,
        duration: 0.5,
        onComplete: () => {
          this.isInvitationFullyRevealed = true;
        }
      }, '-=0.1');
  }

  initCountdown() {
    setInterval(() => {
      const ahora = new Date().getTime();
      const diferencia = this.fechaBoda.getTime() - ahora;
      if (diferencia <= 0) return;

      this.countdown.dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
      this.countdown.horas = Math.floor((diferencia % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      this.countdown.minutos = Math.floor((diferencia % (1000 * 60 * 60)) / (1000 * 60));
      this.countdown.segundos = Math.floor((diferencia % (1000 * 60)) / 1000);
    }, 1000);
  }

  toggleMusic() {
    const audio = this.audioPlayer.nativeElement;
    if (this.isMuted) {
      audio.play().then(() => this.isMuted = false);
    } else {
      audio.pause();
      this.isMuted = true;
    }
  }

  openGoogleMaps(event: Event) {
    event.stopPropagation();
    window.open('https://google.com', '_blank');
  }

  confirmarWhatsApp(event: Event) {
    event.stopPropagation();
    const celular = '51999999999';
    const msg = encodeURIComponent('¡Hola Gino y Claudia! Confirmamos nuestra asistencia a su boda civil. 🥂');
    window.open(`https://wa.me{celular}?text=${msg}`, '_blank');
  }
}