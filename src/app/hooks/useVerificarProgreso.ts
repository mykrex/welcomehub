import { useEffect } from 'react';

export default function useVerificarProgreso() {
  useEffect(() => {
    fetch('/api/retos/verificarProgreso', { credentials: 'include' })
      .then(res => res.json())
      .then(data => console.log('Verificación de progreso:', data))
      .catch(err => console.error('Error al verificar progreso:', err));
  }, []);
}
