import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { BehaviorSubject, of } from 'rxjs';

import { ItemPageComponent } from './personaje-page.component';
import { ItemService } from 'src/app/core/services/personaje.service';
import { Personaje } from '../models/personaje.model';

describe('ItemPageComponent', () => {
  let component: ItemPageComponent;
  let fixture: ComponentFixture<ItemPageComponent>;
  let mockItemService: jasmine.SpyObj<ItemService>;
  let personajesSubject: BehaviorSubject<Personaje[]>;

  const mockPersonajes: Personaje[] = [
    { _id: '1', nombre: 'Mario', categoria: 'Protagonista', nivel: '10' },
    { _id: '2', nombre: 'Luigi', categoria: 'Secundario', nivel: '8' }
  ];

  beforeEach(() => {
    personajesSubject = new BehaviorSubject<Personaje[]>(mockPersonajes);

    mockItemService = jasmine.createSpyObj('ItemService', ['cargarItems', 'eliminarItem'], {
      personajes$: personajesSubject.asObservable()
    });
    mockItemService.eliminarItem.and.returnValue(of({}));

    TestBed.configureTestingModule({
      imports: [CommonModule],
      declarations: [ItemPageComponent],
      providers: [
        { provide: ItemService, useValue: mockItemService }
      ],
      schemas: [NO_ERRORS_SCHEMA]
    });

    fixture = TestBed.createComponent(ItemPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // --- Creación del componente ---

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // --- ngOnInit ---

  it('ngOnInit should subscribe to personajes$ and populate personajes', () => {
    expect(component.personajes).toEqual(mockPersonajes);
  });

  it('ngOnInit should call cargarItems on the service', () => {
    expect(mockItemService.cargarItems).toHaveBeenCalled();
  });

  it('should update personajes when the observable emits new data', () => {
    const nuevosPersonajes: Personaje[] = [
      { _id: '3', nombre: 'Peach', categoria: 'Princesa', nivel: '5' }
    ];
    personajesSubject.next(nuevosPersonajes);
    expect(component.personajes).toEqual(nuevosPersonajes);
  });

  // --- abrirFormulario / cerrarFormulario ---

  it('abrirFormulario should set mostrarFormulario to true', () => {
    component.mostrarFormulario = false;
    component.abrirFormulario();
    expect(component.mostrarFormulario).toBeTrue();
  });

  it('cerrarFormulario should set mostrarFormulario to false', () => {
    component.mostrarFormulario = true;
    component.cerrarFormulario();
    expect(component.mostrarFormulario).toBeFalse();
  });

  it('mostrarFormulario should be false by default', () => {
    expect(component.mostrarFormulario).toBeFalse();
  });

  // --- eliminarItem ---

  it('eliminarItem should call itemService.eliminarItem with the correct id', () => {
    component.eliminarItem('1');
    expect(mockItemService.eliminarItem).toHaveBeenCalledWith('1');
  });

  it('eliminarItem should call cargarItems after successful deletion', () => {
    component.eliminarItem('1');
    expect(mockItemService.cargarItems).toHaveBeenCalled();
  });

  it('eliminarItem should call the service with any given id', () => {
    component.eliminarItem('abc-999');
    expect(mockItemService.eliminarItem).toHaveBeenCalledWith('abc-999');
  });

  // --- Observable / personajes$ ---

  it('should expose personajes$ observable from service', () => {
    expect(component.personajes$).toBeDefined();
  });

  it('personajes$ should emit the current list of personajes', (done) => {
    component.personajes$.subscribe(data => {
      expect(data).toEqual(mockPersonajes);
      done();
    });
  });

  // --- Prueba de integración: componente reacciona a datos del servicio ---

  it('(integration) should re-render when service emits new personajes', () => {
    const actualizados: Personaje[] = [
      { _id: '5', nombre: 'Toad', categoria: 'Ayudante', nivel: '3' }
    ];
    personajesSubject.next(actualizados);
    fixture.detectChanges();

    expect(component.personajes).toEqual(actualizados);
    expect(component.personajes.length).toBe(1);
  });
});
