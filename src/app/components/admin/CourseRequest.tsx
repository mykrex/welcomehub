'use client';

import { useState } from 'react';
import { CheckCircle, XCircle, MessageCircle } from 'lucide-react';
import { Dialog, DialogHeader, DialogTitle, DialogContent, DialogFooter } from '@/app/components/dialog';
import { Button } from '@/app/components/boton';
import { motion } from 'framer-motion';

interface Request {
  id: string;
  name: string;
  avatar: string;
  course: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface Props {
  requests: Request[];
  onApprove: (id: string) => void;
  onReject: (id: string) => void;
}

export default function CourseRequests({ requests, onApprove, onReject }: Props) {
  const [open, setOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<Request | null>(null);
  const [comment, setComment] = useState('');

  const handleComment = (request: Request) => {
    setSelectedRequest(request);
    setOpen(true);
  };

  return (
    <section className="bg-[#1b1b1b] rounded-2xl p-4 mb-6">
      <h2 className="text-lg text-white font-semibold mb-4 bg-gradient-to-r from-blue-500 to-blue-700 rounded-xl inline-block px-4 py-2">
        Solicitudes de Cursos
      </h2>

      {requests.length === 0 ? (
        <p className="text-gray-300">No hay solicitudes pendientes.</p>
      ) : (
        <div className="space-y-4">
          {requests.map((req) => (
            <motion.div
              key={req.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="flex items-center justify-between bg-[#2a2a2a] rounded-xl p-3"
            >
              <div className="flex items-center gap-4">
                <img
                  src={`/Avatars/${req.avatar}`}
                  alt={`${req.name} avatar`}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <p className="text-white font-medium">{req.name}</p>
                  <p className="text-sm text-gray-400">{req.course}</p>
                </div>
              </div>
              <div className="flex gap-3 text-blue-400">
                <span title="Aprobar solicitud" aria-label="Aprobar solicitud" role="button" tabIndex={0}>
                  <CheckCircle
                    className="w-6 h-6 cursor-pointer hover:text-green-500"
                    onClick={() => onApprove(req.id)}
                  />
                </span>
                <span title="Rechazar solicitud" aria-label="Rechazar solicitud" role="button" tabIndex={0}>
                  <XCircle
                    className="w-6 h-6 cursor-pointer hover:text-red-500"
                    onClick={() => onReject(req.id)}
                  />
                </span>
                <span title="Agregar comentario" aria-label="Agregar comentario" role="button" tabIndex={0}>
                  <MessageCircle
                    className="w-6 h-6 cursor-pointer hover:text-yellow-400"
                    onClick={() => handleComment(req)}
                  />
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Modal para comentarios */}
      <Dialog isOpen={open} onClose={() => setOpen(false)}>
        <DialogContent className="bg-[#1f1f1f] text-white">
          <DialogHeader>
            <DialogTitle>Agregar Comentario</DialogTitle>
          </DialogHeader>
          <textarea
            className="w-full h-24 p-2 rounded-lg bg-[#2a2a2a] text-white resize-none focus:outline-none"
            placeholder="Escribe un comentario..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={() => setOpen(false)}>Cerrar</Button>
            <Button
              className="bg-gray-600 hover:bg-gray-700"
              onClick={() => {
                alert(`Comentario para ${selectedRequest?.name}: ${comment}`);
                setOpen(false);
                setComment('');
              }}
            >
              Guardar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
