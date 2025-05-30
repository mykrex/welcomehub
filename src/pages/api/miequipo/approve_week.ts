// pages/api/miequipo/approve_week.ts
import { NextApiRequest, NextApiResponse } from 'next';

interface ApprovalRequest {
  employeeId: number;
  weekId: number;
}

interface ApprovalResponse {
  success: boolean;
  message: string;
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApprovalResponse | { error: string }>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { employeeId, weekId }: ApprovalRequest = req.body;
    
    if (!employeeId || !weekId) {
      return res.status(400).json({ error: 'Employee ID and Week ID are required' });
    }

    console.log('🔍 API: Aprobando semana:', { employeeId, weekId });
    
    // TODO: Aquí debes conectar con tu base de datos real
    // Por ahora, simulamos la aprobación:
    
    /*
    await db.collection('weeks')
      .doc(String(weekId))
      .update({
        estado: 'aprobado',
        aprobado_el: new Date().toISOString(),
        aprobado_por: 'current-admin-id' // Obtener del contexto de auth
      });
    */

    // Simulación de éxito
    console.log('✅ API: Semana aprobada exitosamente');

    res.status(200).json({
      success: true,
      message: 'Semana aprobada exitosamente'
    });
    
  } catch (error) {
    console.error('❌ API Error:', error);
    res.status(500).json({ error: 'Error al aprobar semana' });
  }
}