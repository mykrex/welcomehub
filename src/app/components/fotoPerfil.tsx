'use client';

import { useEffect, useState, useRef } from 'react';
import { supabase } from '@/lib/supabase';
import Image from 'next/image';
import { Pencil, Trash2, Upload } from 'lucide-react';

export default function FotoPerfil({ userId }: { userId: string }) {
  const [fotoUrl, setFotoUrl] = useState<string | null>(null);
  const [cargando, setCargando] = useState(false);
  const [mostrarOpciones, setMostrarOpciones] = useState(false);
  const bucket = 'avatars';
  const ruta = `${userId}/profile.jpg`;
  const inputRef = useRef<HTMLInputElement | null>(null);

  const fetchFotoPerfil = async () => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(ruta, 3600);

      if (error || !data?.signedUrl) {
        console.warn('❌ Error al obtener signed URL:', error?.message || 'Sin mensaje');
        setFotoUrl('/placeholder_profile.png');
      } else {
        setFotoUrl(data.signedUrl);
      }
    } catch (e) {
      console.error('🚨 Error inesperado al obtener la imagen:', e);
      setFotoUrl('/placeholder_profile.png');
    }
  };

  useEffect(() => {
    if (userId) fetchFotoPerfil();
  }, [userId]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!userId) return;

    const file = e.target.files?.[0];
    if (!file) return;

    setCargando(true);

    try {
      const { error } = await supabase.storage
        .from(bucket)
        .upload(ruta, file, {
          upsert: true,
          contentType: file.type,
        });

      if (error) {
        alert('No se pudo subir la imagen. Intenta de nuevo.');
        console.error('❌ Error al subir imagen:', error.message);
      } else {
        await fetchFotoPerfil();
      }
    } catch (e) {
      alert('Ocurrió un error inesperado.');
      console.error('🚨 Error inesperado al subir la imagen:', e);
    }finally {
      setCargando(false);
      setMostrarOpciones(false);
    }
  };

  const handleDelete = async () => {
    if (!userId) return;

    setCargando(true);
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([ruta]);

      if (error) {
        alert('No se pudo eliminar la imagen.');
        console.error('❌ Error al eliminar imagen:', error.message);
      } else {
        await fetchFotoPerfil();
      }
    } catch (e) {
      alert('Error inesperado al borrar la imagen.');
      console.error('🚨 Error al borrar:', e);
    } finally {
      setCargando(false);
      setMostrarOpciones(false);
    }
  };

  return (
    <div className="relative w-44 h-44">
      <Image
        src={fotoUrl || '/placeholder_profile.png'}
        alt="Foto de perfil"
        fill
        sizes="180px"
        className="rounded-full object-cover border-4 border-gray-500"
      />

<div className="absolute bottom-2 right-2">
        <button
          className="bg-white rounded-full p-1 shadow"
          onClick={() => setMostrarOpciones(!mostrarOpciones)}
        >
          <Pencil size={18} className="text-black" />
        </button>

        {mostrarOpciones && (
          <div className="absolute bottom-10 right-0 bg-white text-black rounded-lg shadow-lg z-10 w-40">
            <button
              onClick={() => inputRef.current?.click()}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-gray-100 text-sm"
            >
              <Upload size={16} />
            </button>
            <button
              onClick={handleDelete}
              className="flex items-center gap-2 w-full px-3 py-2 hover:bg-red-100 text-sm text-red-600"
            >
              <Trash2 size={16} />
            </button>
          </div>
        )}
      </div>

      <input
        ref={inputRef}
        id="upload"
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleUpload}
        disabled={cargando}
      />
    </div>
  );
}