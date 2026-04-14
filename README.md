# Repositorio de Packs de Datitos

Este repositorio contiene las listas de packs de datos móviles para la aplicación [Datitos](https://github.com/CrysoK/datitos). Está diseñado para ser mantenido por la comunidad.

## Estructura

La información está organizada por país y compañía:

```txt
/datitos-packs
  - manifest.json       # Índice de todos los packs (autogenerado)
  - schema.json         # Esquema de validación actual
  - /schemas            # Histórico de esquemas (v1.json, etc.)
  - /{código-país-iso}
    /{compañía}
      - prepago.json
      - abono.json
```

### Ejemplo

`ar/personal/prepago.json`

## Cómo contribuir

### 🚀 Método recomendado (el más fácil)

La aplicación [Datitos](https://datitos.vercel.app/) permite actualizar los packs de forma visual e interactiva:

1. Ingresa a [datitos.vercel.app](https://datitos.vercel.app/).
2. Selecciona el **país** y la **compañía** que deseas actualizar.
3. Haz clic en el botón **"Actualizar datos comunitarios"** (icono de rayo).
4. Modifica los precios o agrega nuevos packs en el formulario interactivo.
5. Al terminar, haz clic en **"Enviar a GitHub"**. Se abrirá un formulario en GitHub con los datos ya cargados.
6. Haz clic en **"Submit new issue"** y listo. Un bot procesará tu actualización y creará un Pull Request automáticamente.
    - *Nota: Necesitas una cuenta de GitHub para realizar este paso.*

### Estandarización de nombres

Si usas el **Método recomendado**, el bot se encarga de esto automáticamente. 

Si contribuyes manualmente, usa este formato para el título de tu propuesta (PR) y el commit:

`[ISO] Empresa: Qué hiciste`

**Ejemplos:**

- `[AR] Personal: Actualizar precios`
- `[AR] Tuenti: Agregado pack de 50GB`
- `[CL] Entel: Corregir error en duración`

Si prefieres hacerlo manualmente o quieres agregar un país/compañía que aún no existe:

1. Crea la estructura de carpetas siguiendo el estándar ISO 3166-1 alpha-2 para el país (ej. `cl` para Chile).
2. Crea el archivo JSON correspondiente (ej: `prepago.json`) siguiendo el formato de `schema.json`.
3. **Actualiza el manifiesto**:
   - Si es un país nuevo, agrégalo al objeto `COUNTRY_NAMES` en `scripts/generate-manifest.js`.
   - Ejecuta `npm run build-manifest`.
4. Realiza el Pull Request con tus cambios.

> [!NOTE]
> No es estrictamente necesario ejecutar el paso 3 para enviar un PR, ya que un bot lo hará automáticamente al procesar tu contribución, pero ayuda a validar tus cambios localmente.

## Formato de los packs

Cada archivo JSON debe incluir:

- `schema_version`: Versión del esquema (ej: `1`).
- `updated_at`: Fecha de última actualización.
- `currency`: Moneda (ej: `ARS`).
- `packs`: Array de objetos con:
  - `mb`: Cantidad de megas.
  - `days`: Duración en días. **Usa `0` para packs que duran "hasta la renovación del plan"**.
  - `price`: Precio total.
  - `comment` (opcional): Información adicional.

---
¡Gracias por ayudar a mantener Datitos actualizado!
