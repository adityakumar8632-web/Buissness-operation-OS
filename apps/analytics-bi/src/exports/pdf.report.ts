import { apiClient } from '@workspace/api-client';

export class PDFReportGenerator {
  /**
   * Formats executive summaries into professional multi-page PDF briefing reports[cite: 3].
   * In a production environment, this calls a backend microservice running Puppeteer or a PDF library
   * rather than generating complex PDFs directly in the client bundle.
   */
  static async requestExecutiveSummaryPDF(dateRange: { start: string, end: string }): Promise<void> {
    try {
      const response = await apiClient.post('/api/analytics/reports/executive-summary/pdf', dateRange, {
        responseType: 'blob' // Expecting binary stream
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `Executive_Briefing_${dateRange.start}_to_${dateRange.end}.pdf`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Failed to generate PDF report:', error);
      throw new Error('PDF Generation Engine failed. Please try again later.');
    }
  }
}