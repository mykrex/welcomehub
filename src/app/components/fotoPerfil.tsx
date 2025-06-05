import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";

export default function FotoPerfil({ userId }: { userId: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Get the signed URL from /api/avatar/bajarAvatar
  const fetchFotoPerfil = useCallback(async () => {
    try {
      const resp = await fetch("/api/avatar/bajarAvatar");
      if (!resp.ok) {
        setImageUrl(null);
        return;
      }
      const { url } = await resp.json();
      const separator = url.includes("?") ? "&" : "?";
      setImageUrl(`${url}${separator}v=${Date.now()}`); // bust cache
    } catch {
      setImageUrl(null);
    }
  }, []);

  useEffect(() => {
    fetchFotoPerfil();
  }, [fetchFotoPerfil]);

  // Upload using the endpoint /api/avatar/subirAvatar
  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploading(true);

    try {
      const form = new FormData();
      form.append("userId", userId);
      form.append("file", file);

      const resp = await fetch("/api/avatar/subirAvatar", {
        method: "POST",
        body: form,
      });

      if (!resp.ok) {
        const { error } = await resp.json();
        throw new Error(error || "Error subiendo la imagen");
      }

      await fetchFotoPerfil();
      await fetch("/api/retos/verificarCambioFoto", {
        method: "POST",
        credentials: "include",
      });
      
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Error inesperado";
      console.error("Error en handleUpload:", err);
      alert(`No se pudo subir tu foto: ${msg}`);
    } finally {
      setUploading(false);
    }
  };

  // Delete using the endpoint api/avatar/borrarAvatar
  const handleDelete = async () => {
    setDeleting(true);
    try {
      const resp = await fetch("/api/avatar/borrarAvatar", { method: "POST" });
      if (!resp.ok) {
        const { error } = await resp.json();
        throw new Error(error || "Error al borrar foto");
      }
      setImageUrl(null);
    } catch (err) {
      const msg =
        err instanceof Error ? err.message : "No se pudo borrar tu foto.";
      alert(msg);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Image
        key={imageUrl}
        unoptimized
        src={imageUrl || "/placeholder_profile.png"}
        alt="Foto de perfil"
        width={180}
        height={180}
        className="w-full h-full object-cover rounded-full border border-gray-400"
      />

      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleUpload}
      />

      <div className="flex gap-2">
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-cyan-700 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          {uploading ? "Subiendo..." : "Editar"}
        </button>
        <button
          onClick={handleDelete}
          disabled={deleting}
          className="bg-red-800 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          {deleting ? "Eliminando..." : "Eliminar"}
        </button>
      </div>
    </div>
  );
}
