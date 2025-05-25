/**
 * Các hàm tiện ích
 */

/**
 * Tạo ID ngẫu nhiên
 * @returns ID ngẫu nhiên
 */
export function generateId(): string {
  return Math.random().toString(36).substring(2, 15);
}

/**
 * Trì hoãn thực thi
 * @param ms Thời gian trì hoãn (ms)
 * @returns Promise
 */
export function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Định dạng ngày tháng
 * @param date Ngày tháng
 * @param format Định dạng (DD/MM/YYYY)
 * @returns Chuỗi đã định dạng
 */
export function formatDate(date: Date | string, format: string = 'DD/MM/YYYY'): string {
  const d = typeof date === 'string' ? new Date(date) : date;
  
  const day = d.getDate().toString().padStart(2, '0');
  const month = (d.getMonth() + 1).toString().padStart(2, '0');
  const year = d.getFullYear();
  
  let result = format;
  result = result.replace('DD', day);
  result = result.replace('MM', month);
  result = result.replace('YYYY', year.toString());
  
  return result;
}

/**
 * Xử lý lỗi
 * @param error Đối tượng lỗi
 * @returns Thông báo lỗi
 */
export function handleError(error: unknown): string {
  if (error instanceof Error) {
    return `Lỗi: ${error.message}`;
  }
  return 'Đã xảy ra lỗi không xác định';
}
