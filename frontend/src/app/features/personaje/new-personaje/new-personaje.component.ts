import { Component, Output, EventEmitter } from '@angular/core';
import { ItemService } from 'src/app/core/services/personaje.service';

@Component({
  standalone: false,
  selector: 'app-new-personaje',
  templateUrl: './new-personaje.component.html',
  styleUrls: ['./new-personaje.component.css']
})
export class NewItemComponent {

  @Output() cerrar = new EventEmitter<void>();

  nombre = '';
  tipo = '';
  poder = '';
  mundo = '';

  constructor(private itemService: ItemService) {}

  crearItem() {
    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('tipo', this.tipo);
    formData.append('poder', this.poder);
    formData.append('mundo', this.mundo);

    this.itemService.agregarItem(formData).subscribe(nuevo => {
      // actualizamos la lista manualmente
      this.itemService.cargarItems();
      this.cerrar.emit();
    });
  }

}
