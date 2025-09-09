/**
 * Data Export Utilities
 * 
 * Export admin data to Excel/CSV formats for analysis and reporting
 */

import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';

interface ExportData {
  [key: string]: any;
}

/**
 * Export data to Excel file
 */
export function exportToExcel(data: ExportData[], filename: string, sheetName: string = 'Sheet1') {
  try {
    // Create workbook and worksheet
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.json_to_sheet(data);

    // Auto-size columns
    const colWidths = Object.keys(data[0] || {}).map(key => ({
      wch: Math.max(
        key.length,
        ...data.map(row => String(row[key] || '').length)
      )
    }));
    ws['!cols'] = colWidths;

    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(wb, ws, sheetName);

    // Generate Excel file and download
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return { success: true, message: 'Excel file downloaded successfully' };
  } catch (error) {
    console.error('Excel export error:', error);
    return { success: false, error: 'Failed to export Excel file' };
  }
}

/**
 * Export data to CSV file
 */
export function exportToCSV(data: ExportData[], filename: string) {
  try {
    // Convert to CSV
    const ws = XLSX.utils.json_to_sheet(data);
    const csv = XLSX.utils.sheet_to_csv(ws);
    
    // Create and download CSV file
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.csv`);
    
    return { success: true, message: 'CSV file downloaded successfully' };
  } catch (error) {
    console.error('CSV export error:', error);
    return { success: false, error: 'Failed to export CSV file' };
  }
}

/**
 * Export multiple sheets to one Excel file
 */
export function exportMultiSheetExcel(sheets: { name: string; data: ExportData[] }[], filename: string) {
  try {
    const wb = XLSX.utils.book_new();

    sheets.forEach(sheet => {
      if (sheet.data.length > 0) {
        const ws = XLSX.utils.json_to_sheet(sheet.data);
        
        // Auto-size columns
        const colWidths = Object.keys(sheet.data[0]).map(key => ({
          wch: Math.max(
            key.length,
            ...sheet.data.map(row => String(row[key] || '').length)
          )
        }));
        ws['!cols'] = colWidths;
        
        XLSX.utils.book_append_sheet(wb, ws, sheet.name);
      }
    });

    // Generate and download
    const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
    const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    
    saveAs(blob, `${filename}_${new Date().toISOString().split('T')[0]}.xlsx`);
    
    return { success: true, message: 'Multi-sheet Excel file downloaded successfully' };
  } catch (error) {
    console.error('Multi-sheet Excel export error:', error);
    return { success: false, error: 'Failed to export Excel file' };
  }
}

/**
 * Format provider data for export
 */
export function formatProvidersForExport(providers: any[]) {
  return providers.map(provider => ({
    'Provider Name': provider.profile?.name || 'N/A',
    'Email': provider.profile?.email || 'N/A',
    'Phone': provider.profile?.phone || 'N/A',
    'Status': provider.status || provider.profile?.role || 'N/A',
    'Clinic': provider.clinic?.name || 'N/A',
    'Island': provider.clinic?.island || 'N/A',
    'Specialties': Array.isArray(provider.specialties) 
      ? provider.specialties.join(', ') 
      : provider.specialties || 'N/A',
    'Bio': provider.bio || 'N/A',
    'Application Date': provider.createdAt ? new Date(provider.createdAt).toLocaleDateString() : 'N/A'
  }));
}

/**
 * Format clinic data for export
 */
export function formatClinicsForExport(clinics: any[]) {
  return clinics.map(clinic => ({
    'Clinic Name': clinic.name || 'N/A',
    'Slug': clinic.slug || 'N/A',
    'Address': clinic.address || 'N/A',
    'Phone': clinic.phone || 'N/A',
    'Island': clinic.island || 'N/A',
    'Total Providers': clinic._count?.providers || 0,
    'Total Services': clinic._count?.services || 0,
    'Created Date': clinic.createdAt ? new Date(clinic.createdAt).toLocaleDateString() : 'N/A'
  }));
}

/**
 * Format service data for export
 */
export function formatServicesForExport(services: any[]) {
  return services.map(service => ({
    'Service Name': service.name || 'N/A',
    'Description': service.description || 'N/A',
    'Duration (min)': service.durationMin || 0,
    'Price (€)': service.price || 0,
    'Status': service.isActive ? 'Active' : 'Inactive',
    'Provider': service.provider?.profile?.name || 'N/A',
    'Clinic': service.clinic?.name || 'N/A',
    'Total Bookings': service.bookingCount || service._count?.bookings || 0,
    'Created Date': service.createdAt ? new Date(service.createdAt).toLocaleDateString() : 'N/A'
  }));
}

/**
 * Format pharmacy data for export
 */
export function formatPharmacyForExport(products: any[]) {
  return products.map(product => ({
    'Product Name': product.name || 'N/A',
    'SKU': product.sku || 'N/A',
    'Category': product.category || 'N/A',
    'Description': product.description || 'N/A',
    'Price (€)': product.price || 0,
    'Stock Quantity': product.stock || 0,
    'Status': product.isActive ? 'Active' : 'Inactive',
    'Clinic': product.clinic?.name || 'Available at all clinics',
    'Created Date': product.createdAt ? new Date(product.createdAt).toLocaleDateString() : 'N/A'
  }));
}

/**
 * Format booking data for export (anonymized)
 */
export function formatBookingsForExport(bookings: any[]) {
  return bookings.map(booking => ({
    'Booking ID': booking.id || 'N/A',
    'Patient': booking.clientName ? booking.clientName.charAt(0) + '***' : 'Anonymous',
    'Service': booking.service?.name || 'N/A',
    'Provider': booking.provider?.profile?.name || 'N/A',
    'Clinic': booking.provider?.clinic?.name || 'N/A',
    'Date': booking.start ? new Date(booking.start).toLocaleDateString() : 'N/A',
    'Time': booking.start ? new Date(booking.start).toLocaleTimeString() : 'N/A',
    'Status': booking.status || 'N/A',
    'Created Date': booking.createdAt ? new Date(booking.createdAt).toLocaleDateString() : 'N/A'
  }));
}
