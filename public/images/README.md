# Imágenes reales por mundo

Carpeta preparada para las fotos reales descargadas de Instagram de cada marca (galería, productos, local).

Convención de nombres esperada por `src/data/*.json` y los componentes de galería:

```
public/images/barberia/gallery-1.jpg ... gallery-N.jpg
public/images/fries/product-<slug>.jpg   -> foto real de cada producto del menú
public/images/arepas/product-<slug>.jpg
public/images/slush/product-<slug>.jpg
public/images/rent/gallery-1.jpg ... gallery-N.jpg
```

Mientras no exista la foto real de un producto/ítem de galería, se usa el placeholder generado en `public/media/<mundo>/hero.png`. Reemplaza el archivo y no hace falta tocar el JSON ni el componente.
