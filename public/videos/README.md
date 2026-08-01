# Videos por mundo

Carpeta preparada para los videos reales descargados de Instagram (Reels/posts) de cada marca.

Cuando tengas los videos reales, colócalos aquí con estos nombres exactos — los componentes ya apuntan a estas rutas, así que no hace falta tocar código, solo reemplazar el archivo:

```
public/videos/barberia/hero.mp4       -> video principal del hero
public/videos/barberia/gallery-1.mp4  -> videos cortos para la galería (opcional)
public/videos/fries/hero.mp4
public/videos/slush/hero.mp4
public/videos/arepas/hero.mp4
public/videos/rent/hero.mp4
public/videos/rent/gallery-1.mp4
public/videos/rent/gallery-2.mp4
```

No se usan enlaces externos (CDN de Instagram, YouTube, etc.) — todo video se sirve local desde `public/`, así que la app nunca depende de que Instagram/terceros estén disponibles en producción.

Mientras no exista el archivo real, los componentes muestran la imagen de `public/media/<mundo>/hero.png` (o `public/images/<mundo>/`) como poster/fallback.
