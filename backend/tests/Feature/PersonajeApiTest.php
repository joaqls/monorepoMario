<?php

namespace Tests\Feature;

use App\Models\Personaje;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;

class PersonajeApiTest extends TestCase
{
    use RefreshDatabase;

    // ---------------------------------------------------------------
    // GET /api/personajes
    // ---------------------------------------------------------------

    public function test_get_personajes_devuelve_codigo_200(): void
    {
        $response = $this->getJson('/api/personajes');

        $response->assertStatus(200);
    }

    public function test_get_personajes_devuelve_estructura_json_correcta(): void
    {
        Personaje::factory()->count(2)->create();

        $response = $this->getJson('/api/personajes');

        $response->assertStatus(200);
        $response->assertJsonStructure([
            '*' => ['id', 'nombre', 'tipo', 'poder', 'mundo', 'created_at', 'updated_at'],
        ]);
    }

    public function test_get_personajes_devuelve_todos_los_personajes(): void
    {
        Personaje::factory()->count(4)->create();

        $response = $this->getJson('/api/personajes');

        $response->assertStatus(200);
        $response->assertJsonCount(4);
    }

    // ---------------------------------------------------------------
    // Flujo CRUD completo
    // ---------------------------------------------------------------

    public function test_flujo_completo_crear_obtener_actualizar_eliminar(): void
    {
        // CREAR
        $datos = [
            'nombre' => 'Yoshi',
            'tipo'   => 'aliado',
            'poder'  => 70,
            'mundo'  => 'Isla Yoshi',
        ];

        $crearResponse = $this->postJson('/api/personajes', $datos);
        $crearResponse->assertStatus(201);
        $id = $crearResponse->json('id');
        $this->assertNotNull($id);

        // OBTENER POR ID
        $obtenerResponse = $this->getJson("/api/personajes/{$id}");
        $obtenerResponse->assertStatus(200);
        $obtenerResponse->assertJsonFragment(['nombre' => 'Yoshi']);

        // ACTUALIZAR
        $actualizarResponse = $this->putJson("/api/personajes/{$id}", ['nombre' => 'Super Yoshi']);
        $actualizarResponse->assertStatus(200);
        $actualizarResponse->assertJsonFragment(['nombre' => 'Super Yoshi']);

        // VERIFICAR EN LISTA
        $listaResponse = $this->getJson('/api/personajes');
        $listaResponse->assertStatus(200);
        $listaResponse->assertJsonFragment(['nombre' => 'Super Yoshi']);

        // ELIMINAR
        $eliminarResponse = $this->deleteJson("/api/personajes/{$id}");
        $eliminarResponse->assertStatus(200);
        $eliminarResponse->assertJson(['mensaje' => 'Eliminado']);

        // VERIFICAR ELIMINACIÓN
        $this->getJson("/api/personajes/{$id}")->assertStatus(404);
        $this->assertDatabaseMissing('personajes', ['id' => $id]);
    }

    public function test_post_personaje_almacena_en_base_de_datos(): void
    {
        $datos = [
            'nombre' => 'Toad',
            'tipo'   => 'aliado',
            'poder'  => 40,
            'mundo'  => 'Reino Champiñón',
        ];

        $this->postJson('/api/personajes', $datos)->assertStatus(201);

        $this->assertDatabaseHas('personajes', $datos);
    }

    public function test_put_personaje_persiste_cambios_en_base_de_datos(): void
    {
        $personaje = Personaje::factory()->create(['nombre' => 'Wario', 'poder' => 85]);

        $this->putJson("/api/personajes/{$personaje->id}", ['nombre' => 'Waluigi', 'poder' => 80]);

        $this->assertDatabaseHas('personajes', [
            'id'     => $personaje->id,
            'nombre' => 'Waluigi',
            'poder'  => 80,
        ]);
    }

    public function test_delete_personaje_elimina_registro_de_base_de_datos(): void
    {
        $personaje = Personaje::factory()->create();

        $this->deleteJson("/api/personajes/{$personaje->id}")->assertStatus(200);

        $this->assertDatabaseMissing('personajes', ['id' => $personaje->id]);
    }

    public function test_get_personaje_por_id_devuelve_datos_correctos(): void
    {
        $personaje = Personaje::factory()->create([
            'nombre' => 'Donkey Kong',
            'tipo'   => 'aliado',
            'poder'  => 88,
            'mundo'  => 'Jungla DK',
        ]);

        $response = $this->getJson("/api/personajes/{$personaje->id}");

        $response->assertStatus(200);
        $response->assertJsonFragment([
            'nombre' => 'Donkey Kong',
            'tipo'   => 'aliado',
            'poder'  => 88,
            'mundo'  => 'Jungla DK',
        ]);
    }

    public function test_la_base_de_datos_se_limpia_entre_tests(): void
    {
        // Este test verifica que RefreshDatabase aísla cada test
        $this->assertDatabaseCount('personajes', 0);
    }
}
