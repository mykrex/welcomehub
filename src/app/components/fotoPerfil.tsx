'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { supabase } from '@/lib/supabase';
import { Pencil } from 'lucide-react';

interface FotoPerfilProps {
  userId: string;
}

const FotoPerfil = ({ userId }: FotoPerfilProps) => {
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [cargando, setCargando] = useState<boolean>(false);

  const BUCKET = 'perfil';
  const RUTA_IMAGEN = `perfil/${userId}.jpg`;

  const fetchFotoPerfil = async () => {
    const { data, error } = await supabase.storage
      .from(BUCKET)
      .createSignedUrl(RUTA_IMAGEN, 60 * 60); // 1 hora

    if (data?.signedUrl) setFotoUrl(data.signedUrl);
    else setFotoUrl('/placeholder_profile.png'); // fallback si no hay foto
  };

  useEffect(() => {
    fetchFotoPerfil();
  }, [userId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setCargando(true);
    const { error } = await supabase.storage
      .from(BUCKET)
      .upload(RUTA_IMAGEN, file, {
        upsert: true,
        contentType: 'image/jpeg',
      });

    if (!error) {
      await fetchFotoPerfil();
    }

    setCargando(false);
  };

  return (
    <div className="relative w-44 h-44">
      <Image
        src={fotoUrl || '/placeholder_profile.png'}
        alt="Foto de perfil"
        fill
        className="rounded-full object-cover border-4 border-gray-500"
      />
      <label htmlFor="upload" className="absolute bottom-2 right-2 cursor-pointer bg-white rounded-full p-1 shadow">
        <Pencil size={18} className="text-black" />
        <input
          id="upload"
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleUpload}
          disabled={cargando}
        />
      </label>
    </div>
  );
};

export default FotoPerfil;