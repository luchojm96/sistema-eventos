# Flujo de prueba — Sistema de Organización de Eventos

Un solo recorrido, de punta a punta, contando una historia real de uso del sistema: Ana quiere organizar su boda, la empresa (Administrador) la gestiona por ella. No es exhaustivo ni cubre casos negativos — para eso está [PLAN_DE_PRUEBAS.md](PLAN_DE_PRUEBAS.md), que revisa los 44 endpoints uno por uno con sus variantes. Este documento sirve para **demostrar el sistema funcionando de corrido**, por ejemplo frente al docente.

## Antes de empezar

```bash
cd sistema-eventos-backend
npm run dev
```

Necesitás una cuenta de Administrador ya creada (rol único interno, sin registro público):
```bash
SEED_ADMIN_EMAIL=admin@sistema.com SEED_ADMIN_PASSWORD=admin123 SEED_ADMIN_NOMBRE="Administrador" npm run seed:admin
```

Vas a ir alternando entre dos sesiones (Administrador y Cliente) — en Bruno, iniciá sesión con la request de login correspondiente antes de cada bloque marcado con 👤/🏢, así la cookie `token` queda con el usuario correcto.

---

## Escena 1 — Ana se registra 👤 Cliente

Ana entra al sistema por primera vez y crea su cuenta.

**`POST /api/auth/registro`**
```json
{
  "nombre": "Ana Torres",
  "email": "ana.torres@mail.com",
  "password": "cliente123"
}
```
✅ Queda logueada automáticamente (cookie `token` con rol `cliente`). Todavía no tiene ningún evento.

---

## Escena 2 — La empresa arma el evento de Ana 🏢 Administrador

Ana llamó a la empresa y pidió organizar su boda. El Administrador entra al sistema.

**`POST /api/auth/login`**
```json
{
  "email": "admin@sistema.com",
  "password": "admin123"
}
```

Busca a Ana entre los clientes registrados para confirmar sus datos:

**`GET /api/clientes`** (sin body) → la encuentra en la lista, anotá su `id`.

Da de alta el tipo de evento (si todavía no existe uno para "Boda"):

**`POST /api/tipos-evento`**
```json
{ "nombre": "Boda" }
```

Y crea el evento, asociado a Ana (`id_cliente` según lo que devolvió `GET /api/clientes`, `id_tipo_evento` según el paso anterior):

**`POST /api/eventos`**
```json
{
  "nombre": "Boda de Ana y Luis",
  "id_tipo_evento": 1,
  "id_cliente": 1,
  "fecha_inicio": "2026-12-20",
  "fecha_fin": "2026-12-20",
  "ubicacion": "Salón Jardín Real",
  "capacidad_estimada": 120,
  "presupuesto_estimado": 8000
}
```
✅ Anotá el `id` del evento — lo vas a usar en el resto del flujo. Queda con `estado: "Planificado"`.

---

## Escena 3 — Ana entra a revisar su evento 👤 Cliente

**`POST /api/auth/login`**
```json
{ "email": "ana.torres@mail.com", "password": "cliente123" }
```

Revisa su propio perfil:

**`GET /api/clientes/me`** (sin body) → confirma sus datos.

Y ve que ya tiene un evento asignado:

**`GET /api/mis-eventos`** (sin body) → aparece "Boda de Ana y Luis".

---

## Escena 4 — Ana carga a sus invitados 👤 Cliente

**`POST /api/eventos/{idEvento}/invitados`**
```json
{
  "nombre": "Marcos",
  "apellido": "Díaz",
  "email": "marcos.diaz@mail.com",
  "acompanantes_permitidos": 2
}
```
✅ Dispara el email de invitación (si no hay SMTP configurado, aparece en la consola del server como `[EMAIL simulado]` con el link — de ahí sacás el `token_confirmacion`).

**`POST /api/eventos/{idEvento}/invitados`**
```json
{
  "nombre": "Sofía",
  "apellido": "Ruiz",
  "email": "sofia.ruiz@mail.com",
  "acompanantes_permitidos": 0
}
```

---

## Escena 5 — Marcos confirma su asistencia 🌐 Público (sin sesión)

Marcos recibe el email y hace clic en el link. No necesita cuenta ni login.

**`GET /api/rsvp/{token}`** (sin body) → ve los datos del evento y del invitado.

**`POST /api/rsvp/{token}`**
```json
{
  "confirma": true,
  "acompanantes": 1
}
```
✅ Su respuesta queda fija — no la puede volver a cambiar.

---

## Escena 6 — Ana revisa quién confirmó 👤 Cliente

**`GET /api/eventos/{idEvento}/invitados`** (sin body) → Marcos aparece `Confirmado`, Sofía sigue `Pendiente`.

---

## Escena 7 — La empresa contrata el catering 🏢 Administrador

Volvé a loguearte como Administrador (Escena 2). El Administrador da de alta el catálogo de proveedores:

**`POST /api/categorias-proveedor`**
```json
{ "nombre": "Catering" }
```

**`POST /api/proveedores`**
```json
{
  "nombre_empresa": "Catering Deluxe",
  "id_categoria": 1,
  "contacto_nombre": "Pedro Gómez",
  "telefono": "099111222"
}
```

Y lo contrata específicamente para la boda de Ana:

**`POST /api/eventos/{idEvento}/proveedores`**
```json
{
  "id_proveedor": 1,
  "descripcion_servicio": "Menú para 120 personas",
  "costo_acordado": 2000,
  "fecha_servicio": "2026-12-20",
  "hora_inicio": "19:00",
  "hora_fin": "23:30"
}
```
✅ Queda `estado_contrato: "Cotizado"`. Anotá el `id` de esta contratación (`id_evento_proveedor`).

---

## Escena 8 — Se arma el plan de pagos 🏢 Administrador

**`POST /api/eventos/{idEvento}/plan-pagos`**
```json
{
  "cuotas": [
    { "numero_cuota": 1, "monto": 1500, "fecha_limite": "2026-11-01" },
    { "numero_cuota": 2, "monto": 1500, "fecha_limite": "2026-12-01" }
  ]
}
```

---

## Escena 9 — Ana paga la primera cuota 👤 Cliente

Volvé a loguearte como Ana. Es `multipart/form-data` (el comprobante es opcional) — en Bruno, body tipo **Multipart Form**:

**`POST /api/eventos/{idEvento}/pagos`**
```json
{
  "id_cuota": 1,
  "monto": 1500,
  "fecha_pago": "2026-10-15",
  "metodo_pago": "Transferencia"
}
```
✅ Como lo registra el Cliente, queda `estado: "Reportado"` (todavía no está validado).

---

## Escena 10 — La empresa valida el pago y le paga al proveedor 🏢 Administrador

**`PUT /api/pagos/{idPago}/validar`**
```json
{ "decision": "Validado" }
```

**`GET /api/eventos/{idEvento}/plan-pagos`** (sin body) → la cuota 1 ahora tiene `pagada: true`.

Con la plata cobrada, la empresa le paga al proveedor el costo completo:

**`POST /api/eventos/{idEvento}/egresos`**
```json
{
  "id_evento_proveedor": 1,
  "monto": 2000,
  "fecha_pago": "2026-10-20",
  "metodo_pago": "Transferencia"
}
```
✅ Como el egreso completa el `costo_acordado`, `estado_contrato` de la contratación pasa solo a `"Pagado"` — confirmalo con `GET /api/eventos/{idEvento}/proveedores`.

---

## Escena 11 — Se corrige un dato de contacto 🏢 Administrador

Ana le avisó a la empresa por teléfono que cambió de número.

**`PUT /api/clientes/{idAna}`**
```json
{ "telefono": "099555666" }
```

---

## Escena 12 — Fotografía final: los reportes

Con todo cargado (invitados, pagos, egresos), los reportes ya muestran algo real.

**Como Administrador — `GET /api/reportes/asistencia/{idEvento}`** (sin body) → 1 confirmado (Marcos, +1 acompañante), 1 pendiente (Sofía).

**Como Administrador — `GET /api/reportes/financiero/{idEvento}`** (sin body) → `ingresos` (la cuota validada) **y** `egresos` (el pago al proveedor), con la rentabilidad.

**Como Ana (👤 Cliente) — el mismo `GET /api/reportes/financiero/{idEvento}`** (sin body) → mismo endpoint, pero la respuesta **no** trae el bloque `egresos` (ese detalle es solo para la empresa).

**Como Administrador — `GET /api/reportes/proveedores`** (sin body) → "Catering Deluxe" aparece con `vecesContratado: 1`.

---

Fin del recorrido: una cuenta de Cliente creada, un evento armado por el Administrador, invitados cargados y uno confirmado vía RSVP público, un proveedor contratado y pagado, un plan de cuotas con un pago validado, y los tres reportes reflejando todo el camino recorrido.
