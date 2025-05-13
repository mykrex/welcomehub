import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function FotoPerfil({ userId }: { userId: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const ruta = `${userId}/profile.png`;

  const fetchFotoPerfil = useCallback(async () => {
    // descarga directa (requiere sesión)
    const { data } = await supabase
      .storage
      .from('avatars')
      .download(ruta);

    if (data) {
      setImageUrl(URL.createObjectURL(data));
      return;
    }

    // signed URL para producción
    const { data: signedData } = await supabase
      .storage
      .from('avatars')
      .createSignedUrl(ruta, 60);

    if (signedData?.signedUrl) {
      setImageUrl(`${signedData.signedUrl}?v=${Date.now()}`); // bust cache
    }
  }, [ruta]);

  useEffect(() => {
    fetchFotoPerfil();
  }, [fetchFotoPerfil]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setLoading(true);

    // Borrar versión anterior
    await supabase.storage.from('avatars').remove([ruta]);

    // Subir forzando el cacheControl=0
    const { error: uploadError } = await supabase
      .storage
      .from('avatars')
      .upload(ruta, file, {
        upsert: true,
        contentType: file.type,
        cacheControl: '0',       // evita cualquier cacheo en el CDN
      });

    if (uploadError) {
      console.error('Error al subir:', uploadError.message);
      alert('No pude subir tu foto. Revisa permisos.');
      setLoading(false);
      return;
    }

    // Recargar ahora la imagen en pantalla
    await fetchFotoPerfil();
    setLoading(false);
  };

  const handleDelete = async () => {
    setLoading(true);
    await supabase.storage.from('avatars').remove([ruta]);
    setImageUrl(null);
    setLoading(false);
  };

  return (
    <div className="flex flex-col items-center space-y-2">
      <Image
        key={imageUrl}
        unoptimized
        src={imageUrl || '/placeholder_profile.png'}
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
          disabled={loading}
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
        >
          {loading ? 'Subiendo...' : 'Editar'}
        </button>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  );
}