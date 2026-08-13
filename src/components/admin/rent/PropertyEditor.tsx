"use client";

import { useState } from "react";
import { adminFetch } from "@/lib/admin-auth-client";
import type { Property, PropertySeason, PropertyImage, PropertyVideo } from "@/lib/db/properties";

const inputCls = "bg-black border border-white/15 rounded-lg px-3 py-2 text-sm text-white w-full";
const labelCls = "text-white/50 text-xs uppercase tracking-wide block mb-1.5";

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 6);
}

export default function PropertyEditor({ property, onSaved }: { property: Property; onSaved: (p: Property) => void }) {
  const [name, setName] = useState(property.name);
  const [description, setDescription] = useState(property.description);
  const [status, setStatus] = useState(property.status);
  const [maxGuests, setMaxGuests] = useState(property.capacity.maxGuests);
  const [maxAdults, setMaxAdults] = useState(property.capacity.maxAdults);
  const [maxChildren, setMaxChildren] = useState(property.capacity.maxChildren);
  const [bedrooms, setBedrooms] = useState(property.rooms.bedrooms);
  const [beds, setBeds] = useState(property.rooms.beds);
  const [bathrooms, setBathrooms] = useState(property.rooms.bathrooms);
  const [amenitiesText, setAmenitiesText] = useState(property.amenities.join(", "));
  const [basePrice, setBasePrice] = useState(property.pricing.basePrice);
  const [seasons, setSeasons] = useState<PropertySeason[]>(property.pricing.seasons);
  const [address, setAddress] = useState(property.location.address);
  const [mapsUrl, setMapsUrl] = useState(property.location.mapsUrl ?? "");
  const [lat, setLat] = useState(property.location.lat?.toString() ?? "");
  const [lng, setLng] = useState(property.location.lng?.toString() ?? "");
  const [images, setImages] = useState<PropertyImage[]>(property.media.images);
  const [videos, setVideos] = useState<PropertyVideo[]>(property.media.videos);

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [saved, setSaved] = useState(false);

  function addSeason() {
    setSeasons((s) => [...s, { id: genId(), label: "Temporada alta", from: "", to: "", price: basePrice }]);
  }
  function updateSeason(id: string, patch: Partial<PropertySeason>) {
    setSeasons((s) => s.map((season) => (season.id === id ? { ...season, ...patch } : season)));
  }
  function removeSeason(id: string) {
    setSeasons((s) => s.filter((season) => season.id !== id));
  }

  function addImage() {
    setImages((imgs) => [...imgs, { url: "", alt: name }]);
  }
  function updateImage(i: number, patch: Partial<PropertyImage>) {
    setImages((imgs) => imgs.map((img, idx) => (idx === i ? { ...img, ...patch } : img)));
  }
  function removeImage(i: number) {
    setImages((imgs) => imgs.filter((_, idx) => idx !== i));
  }
  function moveImageToFront(i: number) {
    setImages((imgs) => {
      const copy = [...imgs];
      const [item] = copy.splice(i, 1);
      return [item, ...copy];
    });
  }

  function addVideo() {
    setVideos((v) => [...v, { url: "", label: "" }]);
  }
  function updateVideo(i: number, patch: Partial<PropertyVideo>) {
    setVideos((v) => v.map((video, idx) => (idx === i ? { ...video, ...patch } : video)));
  }
  function removeVideo(i: number) {
    setVideos((v) => v.filter((_, idx) => idx !== i));
  }

  async function guardarCambios() {
    setSaving(true);
    setError("");
    setSaved(false);
    try {
      const res = await adminFetch(`/api/admin/rent/properties/${property.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          description,
          status,
          capacity: { maxGuests: Number(maxGuests), maxAdults: Number(maxAdults), maxChildren: Number(maxChildren) },
          rooms: { bedrooms: Number(bedrooms), beds: Number(beds), bathrooms: Number(bathrooms) },
          amenities: amenitiesText.split(",").map((a) => a.trim()).filter(Boolean),
          pricing: { basePrice: Number(basePrice), seasons },
          media: { images: images.filter((i) => i.url), videos: videos.filter((v) => v.url) },
          location: {
            address,
            mapsUrl: mapsUrl || undefined,
            lat: lat ? Number(lat) : undefined,
            lng: lng ? Number(lng) : undefined,
          },
        }),
      });
      const data = await res.json();
      if (!res.ok || data.error) {
        setError(data.error || "No se pudo guardar.");
        return;
      }
      setSaved(true);
      onSaved(data.property);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("No se pudo conectar con el servidor.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-8">
      <div className="grid sm:grid-cols-2 gap-4">
        <label>
          <span className={labelCls}>Nombre</span>
          <input value={name} onChange={(e) => setName(e.target.value)} className={inputCls} />
        </label>
        <label>
          <span className={labelCls}>Estado</span>
          <select value={status} onChange={(e) => setStatus(e.target.value as "activa" | "inactiva")} className={inputCls}>
            <option value="activa">Activa (visible al público)</option>
            <option value="inactiva">Inactiva (oculta)</option>
          </select>
        </label>
      </div>

      <label className="block">
        <span className={labelCls}>Descripción</span>
        <textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={3} className={inputCls} />
      </label>

      <div>
        <h3 className="text-white font-medium mb-3">Capacidad y habitaciones</h3>
        <div className="grid grid-cols-2 sm:grid-cols-6 gap-4">
          <label><span className={labelCls}>Huéspedes máx.</span><input type="number" min={1} value={maxGuests} onChange={(e) => setMaxGuests(Number(e.target.value))} className={inputCls} /></label>
          <label><span className={labelCls}>Adultos</span><input type="number" min={1} value={maxAdults} onChange={(e) => setMaxAdults(Number(e.target.value))} className={inputCls} /></label>
          <label><span className={labelCls}>Niños</span><input type="number" min={0} value={maxChildren} onChange={(e) => setMaxChildren(Number(e.target.value))} className={inputCls} /></label>
          <label><span className={labelCls}>Habitaciones</span><input type="number" min={0} value={bedrooms} onChange={(e) => setBedrooms(Number(e.target.value))} className={inputCls} /></label>
          <label><span className={labelCls}>Camas</span><input type="number" min={0} value={beds} onChange={(e) => setBeds(Number(e.target.value))} className={inputCls} /></label>
          <label><span className={labelCls}>Baños</span><input type="number" min={0} value={bathrooms} onChange={(e) => setBathrooms(Number(e.target.value))} className={inputCls} /></label>
        </div>
      </div>

      <label className="block">
        <span className={labelCls}>Amenities (separados por coma)</span>
        <input value={amenitiesText} onChange={(e) => setAmenitiesText(e.target.value)} className={inputCls} />
      </label>

      <div>
        <h3 className="text-white font-medium mb-3">Precio</h3>
        <label className="block max-w-xs mb-4">
          <span className={labelCls}>Precio normal / noche (COP)</span>
          <input type="number" min={0} value={basePrice} onChange={(e) => setBasePrice(Number(e.target.value))} className={inputCls} />
        </label>

        <div className="flex items-center justify-between mb-2">
          <span className="text-white/50 text-xs uppercase tracking-wide">Precios por temporada</span>
          <button onClick={addSeason} className="text-xs text-white/60 hover:text-white underline">+ Agregar temporada</button>
        </div>
        {seasons.length === 0 && <p className="text-white/30 text-xs">Sin temporadas especiales configuradas.</p>}
        <div className="space-y-2">
          {seasons.map((s) => (
            <div key={s.id} className="grid grid-cols-2 sm:grid-cols-5 gap-2 items-end bg-white/[0.03] rounded-lg p-3">
              <label><span className={labelCls}>Nombre</span><input value={s.label} onChange={(e) => updateSeason(s.id, { label: e.target.value })} className={inputCls} /></label>
              <label><span className={labelCls}>Desde</span><input type="date" value={s.from} onChange={(e) => updateSeason(s.id, { from: e.target.value })} className={inputCls} /></label>
              <label><span className={labelCls}>Hasta</span><input type="date" value={s.to} onChange={(e) => updateSeason(s.id, { to: e.target.value })} className={inputCls} /></label>
              <label><span className={labelCls}>Precio/noche</span><input type="number" value={s.price} onChange={(e) => updateSeason(s.id, { price: Number(e.target.value) })} className={inputCls} /></label>
              <button onClick={() => removeSeason(s.id)} className="text-red-400 text-xs h-9">Quitar</button>
            </div>
          ))}
        </div>
      </div>

      <div>
        <h3 className="text-white font-medium mb-3">Ubicación</h3>
        <div className="grid sm:grid-cols-2 gap-4 mb-3">
          <label><span className={labelCls}>Dirección</span><input value={address} onChange={(e) => setAddress(e.target.value)} className={inputCls} /></label>
          <label><span className={labelCls}>Link de Google Maps (opcional)</span><input value={mapsUrl} onChange={(e) => setMapsUrl(e.target.value)} className={inputCls} /></label>
          <label><span className={labelCls}>Latitud (opcional)</span><input value={lat} onChange={(e) => setLat(e.target.value)} className={inputCls} /></label>
          <label><span className={labelCls}>Longitud (opcional)</span><input value={lng} onChange={(e) => setLng(e.target.value)} className={inputCls} /></label>
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium">Fotos</h3>
          <button onClick={addImage} className="text-xs text-white/60 hover:text-white underline">+ Agregar foto (URL)</button>
        </div>
        <p className="text-white/30 text-xs mb-3">La primera foto es la portada. No hay subida de archivos todavía — pega la URL de la imagen.</p>
        <div className="space-y-2">
          {images.map((img, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto_auto] gap-2 items-center bg-white/[0.03] rounded-lg p-3">
              <input value={img.url} onChange={(e) => updateImage(i, { url: e.target.value })} placeholder="https://…" className={inputCls} />
              <input value={img.alt} onChange={(e) => updateImage(i, { alt: e.target.value })} placeholder="Descripción" className={inputCls} />
              {i !== 0 && (
                <button onClick={() => moveImageToFront(i)} className="text-xs text-white/60 hover:text-white whitespace-nowrap">Hacer portada</button>
              )}
              {i === 0 && <span className="text-xs text-white/30 whitespace-nowrap">Portada</span>}
              <button onClick={() => removeImage(i)} className="text-red-400 text-xs">Quitar</button>
            </div>
          ))}
          {images.length === 0 && <p className="text-white/30 text-xs">Sin fotos.</p>}
        </div>
      </div>

      <div>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-white font-medium">Videos</h3>
          <button onClick={addVideo} className="text-xs text-white/60 hover:text-white underline">+ Agregar video (URL)</button>
        </div>
        <div className="space-y-2">
          {videos.map((v, i) => (
            <div key={i} className="grid grid-cols-[1fr_1fr_auto] gap-2 items-center bg-white/[0.03] rounded-lg p-3">
              <input value={v.url} onChange={(e) => updateVideo(i, { url: e.target.value })} placeholder="https://…mp4" className={inputCls} />
              <input value={v.label ?? ""} onChange={(e) => updateVideo(i, { label: e.target.value })} placeholder="Etiqueta (opcional)" className={inputCls} />
              <button onClick={() => removeVideo(i)} className="text-red-400 text-xs">Quitar</button>
            </div>
          ))}
          {videos.length === 0 && <p className="text-white/30 text-xs">Sin videos.</p>}
        </div>
      </div>

      {error && <p className="text-red-400 text-sm">{error}</p>}
      {saved && <p className="text-emerald-400 text-sm">✅ Cambios guardados. La página pública ya los refleja.</p>}
      <button
        onClick={guardarCambios}
        disabled={saving}
        className="rounded-full bg-white text-black px-8 py-3 font-medium disabled:opacity-60"
      >
        {saving ? "Guardando…" : "Guardar cambios"}
      </button>
    </div>
  );
}
