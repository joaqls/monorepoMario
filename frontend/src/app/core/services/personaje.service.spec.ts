import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ItemService } from './personaje.service';
import { Personaje } from 'src/app/features/personaje/models/personaje.model';

describe('ItemService', () => {
  let service: ItemService;
  let httpMock: HttpTestingController;

  const API_URL = 'http://localhost:4000/api/personajes';

  const mockPersonajes: Personaje[] = [
    { _id: '1', nombre: 'Mario', categoria: 'Protagonista', nivel: '10' },
    { _id: '2', nombre: 'Luigi', categoria: 'Secundario', nivel: '8' }
  ];

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ItemService]
    });
    service = TestBed.inject(ItemService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  // --- Pruebas unitarias ---

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should expose personajes$ as an Observable that emits an empty array initially', () => {
    let emittedData: Personaje[] | undefined;
    service.personajes$.subscribe(data => {
      emittedData = data;
    });
    expect(emittedData).toEqual([]);
  });

  it('BehaviorSubject should update when new data is loaded', () => {
    service.cargarItems();

    const req = httpMock.expectOne(API_URL);
    req.flush(mockPersonajes);

    service.personajes$.subscribe(data => {
      expect(data).toEqual(mockPersonajes);
    });
  });

  it('refrescarItems should call cargarItems', () => {
    spyOn(service, 'cargarItems');
    service.refrescarItems();
    expect(service.cargarItems).toHaveBeenCalled();
  });

  // --- cargarItems ---

  it('cargarItems should send an HTTP GET request to the API', () => {
    service.cargarItems();

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(mockPersonajes);
  });

  it('cargarItems should update personajes$ with the received data', () => {
    service.cargarItems();

    const req = httpMock.expectOne(API_URL);
    req.flush(mockPersonajes);

    service.personajes$.subscribe(data => {
      expect(data.length).toBe(2);
      expect(data[0].nombre).toBe('Mario');
      expect(data[1].nombre).toBe('Luigi');
    });
  });

  it('cargarItems should handle an empty array response', () => {
    service.cargarItems();

    const req = httpMock.expectOne(API_URL);
    req.flush([]);

    service.personajes$.subscribe(data => {
      expect(data).toEqual([]);
      expect(data.length).toBe(0);
    });
  });

  // --- agregarItem ---

  it('agregarItem should send an HTTP POST request to the API', () => {
    const formData = new FormData();
    formData.append('nombre', 'Bowser');
    formData.append('categoria', 'Villano');

    service.agregarItem(formData).subscribe();

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('POST');
    req.flush({ _id: '3', nombre: 'Bowser', categoria: 'Villano' });
  });

  it('agregarItem should return the created personaje', () => {
    const formData = new FormData();
    formData.append('nombre', 'Bowser');
    formData.append('categoria', 'Villano');
    const nuevoPersonaje: Personaje = { _id: '3', nombre: 'Bowser', categoria: 'Villano' };

    service.agregarItem(formData).subscribe(result => {
      expect(result).toEqual(nuevoPersonaje);
    });

    const req = httpMock.expectOne(API_URL);
    req.flush(nuevoPersonaje);
  });

  // --- eliminarItem ---

  it('eliminarItem should send an HTTP DELETE request to the correct URL', () => {
    const id = '1';
    service.eliminarItem(id).subscribe();

    const req = httpMock.expectOne(`${API_URL}/${id}`);
    expect(req.request.method).toBe('DELETE');
    req.flush({});
  });

  it('eliminarItem should include the id in the URL', () => {
    const id = 'abc123';
    service.eliminarItem(id).subscribe();

    const req = httpMock.expectOne(`${API_URL}/abc123`);
    expect(req.request.url).toContain('abc123');
    req.flush({});
  });

  // --- Prueba de integración: HttpTestingController simulando respuesta del backend ---

  it('(integration) cargarItems should correctly update the component state with backend data', () => {
    const personajesEsperados: Personaje[] = [
      { _id: '10', nombre: 'Peach', categoria: 'Princesa', nivel: '5' }
    ];

    service.cargarItems();

    const req = httpMock.expectOne(API_URL);
    expect(req.request.method).toBe('GET');
    req.flush(personajesEsperados);

    service.personajes$.subscribe(data => {
      expect(data).toEqual(personajesEsperados);
      expect(data[0].nombre).toBe('Peach');
    });
  });
});
