import { Component, Output, EventEmitter } from '@angular/core';
import { ItemService } from 'src/app/core/services/personaje.service';

@Component({
  selector: 'app-new-personaje',
  templateUrl: './new-personaje.component.html',
  styleUrls: ['./new-personaje.component.css']
})
export class NewItemComponent {

  @Output() cerrar = new EventEmitter<void>();

  nombre = '';
  categoria = '';
  nivel = '';
  selectedFile!: File;

  constructor(private itemService: ItemService) {}

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  crearItem() {
    const formData = new FormData();
    formData.append('nombre', this.nombre);
    formData.append('categoria', this.categoria);
    formData.append('nivel', this.nivel);

    if (this.selectedFile) {
      formData.append('imagen', this.selectedFile);
    }

    this.itemService.agregarItem(formData).subscribe(nuevo => {
      // actualizamos la lista manualmente
      this.itemService.cargarItems();
      this.cerrar.emit();
    });
  }

}
