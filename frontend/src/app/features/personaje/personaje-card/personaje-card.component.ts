import { Component, Input, Output, EventEmitter } from '@angular/core';
import { Personaje } from '../models/personaje.model';

@Component({
  standalone: false,
  selector: 'app-personaje-card',
  templateUrl: './personaje-card.component.html',
  styleUrls: ['./personaje-card.component.css']
})
export class ItemCardComponent {

  @Input() personaje!: Personaje;
  @Output() eliminar = new EventEmitter<number>();

  borrar() {
    if (this.personaje.id == null) return;
    this.eliminar.emit(this.personaje.id);
  }

  mostrarEliminar = false;
  abrirEliminar() {
    this.mostrarEliminar = true;
  }
}

