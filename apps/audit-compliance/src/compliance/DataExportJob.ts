import { db } from '@workspace/database';
import fs from 'fs/promises';

export class DataExportJob {
  /**
   * Worker packaging an entity's complete data records into an archive to satisfy GDPR/compliance requests[cite: 3].
   */
  static async exportUserData(userId: string): Promise<string> {
    const userProfile = await db.user.findUnique({ where: { id: userId } });
    const userLogs = await db.auditLog.findMany({ where: { actorId: userId } });
    
    const exportData = {
      profile: userProfile,
      activity: userLogs,
      exportedAt: new Date().toISOString()
    };

    const filePath = `/tmp/export_${userId}_${Date.now()}.json`;
    await fs.writeFile(filePath, JSON.stringify(exportData, null, 2));

    return filePath;
  }
}