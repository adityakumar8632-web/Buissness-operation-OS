export class CSVExporter {
  /**
   * Streaming exporter converting analytical data sets into downloadable CSV files[cite: 3].
   */
  static exportDataset<T extends Record<string, any>>(data: T[], filename: string): void {
    if (!data || !data.length) return;

    const headers = Object.keys(data[0]);
    const csvRows = [];

    csvRows.push(headers.join(','));

    for (const row of data) {
      const values = headers.map(header => {
        const val = row[header];
        const stringVal = val === null || val === undefined ? '' : String(val);
        // Escape quotes and wrap in quotes if there's a comma
        const escapedVal = stringVal.replace(/"/g, '""');
        return stringVal.includes(',') ? `"${escapedVal}"` : escapedVal;
      });
      csvRows.push(values.join(','));
    }

    const blob = new Blob([csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob);
      link.setAttribute('href', url);
      link.setAttribute('download', `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  }
}