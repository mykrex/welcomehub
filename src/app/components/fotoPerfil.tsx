import { useCallback, useEffect, useRef, useState } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';

export default function FotoPerfil({ userId }: { userId: string }) {
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const ruta = `${userId}/profile.png`;

  const fetchFotoPerfil = useCallback(async () => {
    const { data } = await supabase.storage.from('avatars').download(ruta);
    if (data) {
      const url = URL.createObjectURL(data);
      setImageUrl(url);
    } else {
      setImageUrl(null);
    }
  }, [ruta]);

  useEffect(() => {
    fetchFotoPerfil();
  }, [fetchFotoPerfil]);

  const handleUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setLoading(true);

    await supabase.storage.from('avatars').upload(ruta, file, {
      upsert: true,
    });

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
          className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 text-sm"
          disabled={loading}
        >
          {loading ? 'Subiendo...' : 'Editar'}
        </button>
        <button
          onClick={handleDelete}
          className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 text-sm"
          disabled={loading}
        >
          {loading ? 'Eliminando...' : 'Eliminar'}
        </button>
      </div>
    </div>
  );
}