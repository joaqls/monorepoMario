import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { of } from 'rxjs';

import { NewItemComponent } from './new-personaje.component';
import { ItemService } from 'src/app/core/services/personaje.service';
import { Personaje } from '../models/personaje.model';

describe('NewItemComponent', () => {
  let component: NewItemComponent;
  let fixture: ComponentFixture<NewItemComponent>;
  let mockItemService: jasmine.SpyObj<ItemService>;

  const mockNuevoPersonaje: Personaje = { _id: '3', nombre: 'Bowser', categoria: 'Villano', nivel: '15' };

  beforeEach(() => {
    mockItemService = jasmine.createSpyObj('ItemService', ['agregarItem', 'cargarItems']);
    mockItemService.agregarItem.and.returnValue(of(mockNuevoPersonaje));

    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [NewItemComponent],
      providers: [
        { provide: ItemService, useValue: mockItemService }
      ]
    });

    fixture = TestBed.createComponent(NewItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // --- Creación del componente ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty nombre, categoria and nivel', () => {
    expect(component.nombre).toBe('');
    expect(component.categoria).toBe('');
    expect(component.nivel).toBe('');
  });

  // --- onFileSelected ---

  it('onFileSelected should set selectedFile from the event', () => {
    const mockFile = new File(['contenido'], 'mario.png', { type: 'image/png' });
    const mockEvent = { target: { files: [mockFile] } };

    component.onFileSelected(mockEvent);

    expect(component.selectedFile).toEqual(mockFile);
  });

  it('onFileSelected should update selectedFile when called again', () => {
    const firstFile = new File(['a'], 'first.png', { type: 'image/png' });
    const secondFile = new File(['b'], 'second.png', { type: 'image/png' });

    component.onFileSelected({ target: { files: [firstFile] } });
    component.onFileSelected({ target: { files: [secondFile] } });

    expect(component.selectedFile).toEqual(secondFile);
  });

  // --- crearItem / FormData ---

  it('crearItem should call agregarItem on the service', () => {
    component.nombre = 'Bowser';
    component.categoria = 'Villano';
    component.nivel = '15';

    component.crearItem();

    expect(mockItemService.agregarItem).toHaveBeenCalled();
  });

  it('crearItem should pass FormData with nombre, categoria and nivel', () => {
    component.nombre = 'Bowser';
    component.categoria = 'Villano';
    component.nivel = '15';

    component.crearItem();

    const formData = mockItemService.agregarItem.calls.mostRecent().args[0] as FormData;
    expect(formData.get('nombre')).toBe('Bowser');
    expect(formData.get('categoria')).toBe('Villano');
    expect(formData.get('nivel')).toBe('15');
  });

  it('crearItem should append imagen to FormData when a file is selected', () => {
    const mockFile = new File(['content'], 'mario.png', { type: 'image/png' });
    component.nombre = 'Mario';
    component.categoria = 'Protagonista';
    component.selectedFile = mockFile;

    component.crearItem();

    const formData = mockItemService.agregarItem.calls.mostRecent().args[0] as FormData;
    expect(formData.get('imagen')).toEqual(mockFile);
  });

  it('crearItem should not append imagen to FormData when no file is selected', () => {
    component.nombre = 'Mario';
    component.categoria = 'Protagonista';
    // selectedFile not set

    component.crearItem();

    const formData = mockItemService.agregarItem.calls.mostRecent().args[0] as FormData;
    expect(formData.get('imagen')).toBeNull();
  });

  it('crearItem should call cargarItems after the item is created', () => {
    component.nombre = 'Bowser';
    component.categoria = 'Villano';

    component.crearItem();

    expect(mockItemService.cargarItems).toHaveBeenCalled();
  });

  // --- Emisión del evento cerrar ---

  it('crearItem should emit the cerrar event after creating the item', () => {
    spyOn(component.cerrar, 'emit');
    component.nombre = 'Bowser';
    component.categoria = 'Villano';

    component.crearItem();

    expect(component.cerrar.emit).toHaveBeenCalled();
  });

  it('cerrar EventEmitter should be defined', () => {
    expect(component.cerrar).toBeDefined();
  });

  // --- Comportamiento con datos vacíos ---

  it('crearItem with empty nombre sends empty string in FormData', () => {
    component.nombre = '';
    component.categoria = 'Villano';

    component.crearItem();

    const formData = mockItemService.agregarItem.calls.mostRecent().args[0] as FormData;
    expect(formData.get('nombre')).toBe('');
  });

  it('crearItem with empty categoria sends empty string in FormData', () => {
    component.nombre = 'Mario';
    component.categoria = '';

    component.crearItem();

    const formData = mockItemService.agregarItem.calls.mostRecent().args[0] as FormData;
    expect(formData.get('categoria')).toBe('');
  });

  it('crearItem with all fields empty still calls agregarItem', () => {
    component.nombre = '';
    component.categoria = '';
    component.nivel = '';

    component.crearItem();

    expect(mockItemService.agregarItem).toHaveBeenCalled();
  });

  // --- Prueba de integración: comunicación entre componente y servicio ---

  it('(integration) crearItem should trigger the full flow: agregarItem → cargarItems → cerrar', () => {
    spyOn(component.cerrar, 'emit');
    component.nombre = 'Yoshi';
    component.categoria = 'Aliado';
    component.nivel = '7';

    component.crearItem();

    expect(mockItemService.agregarItem).toHaveBeenCalled();
    expect(mockItemService.cargarItems).toHaveBeenCalled();
    expect(component.cerrar.emit).toHaveBeenCalled();
  });
});
