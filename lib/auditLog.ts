import { db } from './firebaseAdmin';

export interface AuditEvent {
  userId: string;
  action: string;
  resourceType: string;
  resourceId: string;
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, any>;
}

export async function logAuditEvent(event: AuditEvent): Promise<void> {
  try {
    await db.collection('auditLog').add({
      ...event,
      timestamp: new Date(),
      environment: process.env.NODE_ENV || 'development',
    });
  } catch (error) {
    // Don't fail the request if audit logging fails
    console.error('Failed to log audit event:', error);
  }
}

// Helper functions for common actions
export async function logCreate(
  userId: string,
  resourceType: string,
  resourceId: string,
  request?: { ip?: string; userAgent?: string }
) {
  await logAuditEvent({
    userId,
    action: 'CREATE',
    resourceType,
    resourceId,
    ip: request?.ip,
    userAgent: request?.userAgent,
  });
}

export async function logUpdate(
  userId: string,
  resourceType: string,
  resourceId: string,
  request?: { ip?: string; userAgent?: string }
) {
  await logAuditEvent({
    userId,
    action: 'UPDATE',
    resourceType,
    resourceId,
    ip: request?.ip,
    userAgent: request?.userAgent,
  });
}

export async function logDelete(
  userId: string,
  resourceType: string,
  resourceId: string,
  request?: { ip?: string; userAgent?: string }
) {
  await logAuditEvent({
    userId,
    action: 'DELETE',
    resourceType,
    resourceId,
    ip: request?.ip,
    userAgent: request?.userAgent,
  });
}

export async function logLogin(
  userId: string,
  request?: { ip?: string; userAgent?: string }
) {
  await logAuditEvent({
    userId,
    action: 'LOGIN',
    resourceType: 'auth',
    resourceId: userId,
    ip: request?.ip,
    userAgent: request?.userAgent,
  });
}

export async function logLogout(
  userId: string,
  request?: { ip?: string; userAgent?: string }
) {
  await logAuditEvent({
    userId,
    action: 'LOGOUT',
    resourceType: 'auth',
    resourceId: userId,
    ip: request?.ip,
    userAgent: request?.userAgent,
  });
}
