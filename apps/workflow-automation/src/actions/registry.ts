import { emailActionHandler } from './email.action';
import { webhookActionHandler } from './webhook.action';
import { notificationActionHandler } from './notification.action';

export class ActionRegistry {
  private static handlers = new Map<string, any>([
    [emailActionHandler.type, emailActionHandler],
    [webhookActionHandler.type, webhookActionHandler],
    [notificationActionHandler.type, notificationActionHandler],
  ]);

  static getHandler(type: string) {
    return this.handlers.get(type);
  }

  static getAvailableNodes() {
    return Array.from(this.handlers.keys());
  }
}