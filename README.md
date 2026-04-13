# Repositorio de Packs de Datitos

Este repositorio contiene las listas de packs de datos móviles para la aplicación [Datitos](https://github.com/Ezequiel/datitos). Está diseñado para ser mantenido por la comunidad.

## Estructura

La información está organizada por país y compañía:

```
/datitos-packs
  /{código-país-iso}
    /{compañía}
      - prepago.json
      - abono.json
```

### Ejemplo:
`ar/personal/prepago.json`

## Cómo contribuir

### 🚀 Método recomendado (el más fácil)
La aplicación [Datitos](https://datitos.vercel.app/) permite actualizar los packs de forma visual e interactiva:
1.  Ingresa a [datitos.vercel.app](https://datitos.vercel.app/).
2.  Selecciona el **país** y la **compañía** que deseas actualizar.
3.  Haz clic en el botón **"Actualizar datos comunitarios"** (icono de rayo).
4.  Modifica los precios o agrega nuevos packs en el formulario interactivo.
5.  Al terminar, haz clic en **"Copiar y enviar PR"**. Se copiará el JSON automáticamente y se abrirá GitHub para que pegues el contenido y confirmes la propuesta.
    - *Nota: Necesitas una cuenta de GitHub para realizar este paso.*

### 🛠️ Método manual
Si prefieres hacerlo manualmente o quieres agregar un país/compañía que aún no existe:
1.  Busca el país y la compañía que quieres actualizar.
2.  Si no existe, crea la carpeta siguiendo el estándar ISO 3166-1 alpha-2 para el país (ej. `cl` para Chile).
3.  Modifica o crea el archivo JSON correspondiente asegurándote de que siga el formato de `schema.json`.
4.  Realiza el Pull Request con tus cambios.


## Formato de los Packs

Cada pack en el array `packs` debe tener:
- `mb`: Cantidad de megas.
- `days`: Duración en días.
- `price`: Precio total (con impuestos si aplica).
- `comment` (opcional): Información adicional (ej. "Solo de noche", "Incluye WhatsApp").

---
¡Gracias por ayudar a mantener Datitos actualizado!
