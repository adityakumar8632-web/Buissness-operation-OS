import { apiClient } from '@workspace/api-client';

export const emailActionHandler = {
  type: 'SEND_EMAIL',
  execute: async (config: { to: string, templateId: string, variables: Record<string, string> }, context: any) => {
    try {
      // In production, this interfaces with SendGrid, SES, etc.
      // We resolve template variables from the DAG context using bracket notation {{var}}
      const resolvedVariables = Object.keys(config.variables).reduce((acc, key) => {
        const path = config.variables[key].replace(/[{}]/g, '');
        acc[key] = path.split('.').reduce((obj, p) => (obj ? obj[p] : ''), context) || config.variables[key];
        return acc;
      }, {} as Record<string, string>);

      await apiClient.post('/integrations/email/send', {
        to: config.to,
        templateId: config.templateId,
        data: resolvedVariables
      });

      return { success: true, output: { sentAt: new Date().toISOString() } };
    } catch (error: any) {
      return { success: false, error: error.message };
    }
  }
};