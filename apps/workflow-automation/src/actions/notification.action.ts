import { db } from '@workspace/database';

export const notificationActionHandler = {
  type: 'IN_APP_NOTIFICATION',
  execute: async (config: { targetUserId: string, title: string, message: string }, context: any) => {
    try {
      // Dispatches in-app notifications and banner alerts to designated user roles[cite: 3].
      const notification = await db.notification.create({
        data: {
          userId: config.targetUserId,
          title: config.title,
          message: config.message,
          read: false,
          referenceContext: context
        }
      });

      return { success: true, output: { notificationId: notification.id } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};