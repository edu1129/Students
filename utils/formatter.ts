
export const formatDisplayDate = (dateString?: string, options: Intl.DateTimeFormatOptions = { day: '2-digit', month: 'short', year: 'numeric' }): string => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    if (isNaN(date.valueOf())) return dateString; // Return original if invalid
    return date.toLocaleDateString('en-GB', options);
  } catch (e) {
    return dateString; // Return original on error
  }
};

export const formatCurrency = (amount?: number | string): string => {
  const numAmount = parseFloat(String(amount || 0));
  return numAmount.toLocaleString('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  });
};

export const calculateAttendancePercentage = (present?: number, total?: number): string => {
  if (total && total > 0 && present) {
    return ((present / total) * 100).toFixed(1) + '%';
  }
  return '0%';
};

export const sanitizeText = (str?: string): string => {
  const tmp = document.createElement('div');
  tmp.textContent = str || '';
  return tmp.innerHTML;
};

// Helper to convert key to display label (e.g., FatherName -> Father Name)
export const keyToDisplayLabel = (key: string): string => {
  return key.replace(/([A-Z])/g, ' $1').replace(/^./, (str) => str.toUpperCase()).trim();
};
    