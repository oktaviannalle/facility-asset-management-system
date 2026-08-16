/**
 * Formats ISO date or YYYY-MM-DD date string to readable Indonesian date
 * Example: '2022-11-12T00:00:00.000000Z' -> '12 Nov 2022'
 */
export const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const cleanDate = dateString.split('T')[0];
    const [year, month, day] = cleanDate.split('-');
    if (!year || !month || !day) return dateString;

    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];

    const monthIndex = parseInt(month, 10) - 1;
    const monthName = months[monthIndex] || month;

    return `${parseInt(day, 10)} ${monthName} ${year}`;
  } catch (err) {
    return dateString;
  }
};

/**
 * Formats number to Rupiah currency string without raw decimal strings
 * Example: 7736816.55 -> 'Rp 7.736.816'
 */
export const formatRupiah = (amount) => {
  if (amount === null || amount === undefined || isNaN(amount)) return '-';
  const num = Math.round(Number(amount));
  return `Rp ${num.toLocaleString('id-ID')}`;
};
