import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * 格式化货币
 * @param amount 金额
 * @param currency 货币符号，默认为¥
 * @returns 格式化后的货币字符串
 */
export function formatCurrency(amount: number, currency: string = '¥'): string {
  if (typeof amount !== 'number' || isNaN(amount)) {
    return `${currency}0.00`;
  }
  
  return `${currency}${amount.toLocaleString('zh-CN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  })}`;
}

/**
 * 格式化日期时间
 * @param date 日期字符串或Date对象
 * @param format 格式类型，默认为'datetime'
 * @returns 格式化后的日期时间字符串
 */
export function formatDateTime(
  date: string | Date,
  format: 'date' | 'time' | 'datetime' | 'relative' = 'datetime'
): string {
  if (!date) return '-';
  
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  if (isNaN(dateObj.getTime())) {
    return '-';
  }
  
  const now = new Date();
  const diffTime = now.getTime() - dateObj.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // 相对时间格式
  if (format === 'relative') {
    if (diffDays === 0) {
      const diffHours = Math.floor(diffTime / (1000 * 60 * 60));
      if (diffHours === 0) {
        const diffMinutes = Math.floor(diffTime / (1000 * 60));
        return diffMinutes <= 0 ? '刚刚' : `${diffMinutes}分钟前`;
      }
      return `${diffHours}小时前`;
    } else if (diffDays === 1) {
      return '昨天';
    } else if (diffDays < 7) {
      return `${diffDays}天前`;
    }
  }
  
  const year = dateObj.getFullYear();
  const month = String(dateObj.getMonth() + 1).padStart(2, '0');
  const day = String(dateObj.getDate()).padStart(2, '0');
  const hours = String(dateObj.getHours()).padStart(2, '0');
  const minutes = String(dateObj.getMinutes()).padStart(2, '0');
  const seconds = String(dateObj.getSeconds()).padStart(2, '0');
  
  switch (format) {
    case 'date':
      return `${year}-${month}-${day}`;
    case 'time':
      return `${hours}:${minutes}:${seconds}`;
    case 'datetime':
    default:
      return `${year}-${month}-${day} ${hours}:${minutes}`;
  }
}

/**
 * 掩码手机号码
 * @param phone 手机号码
 * @param maskChar 掩码字符，默认为*
 * @returns 掩码后的手机号码
 */
export function maskPhone(phone: string, maskChar: string = '*'): string {
  if (!phone || typeof phone !== 'string') {
    return '-';
  }
  
  // 移除所有非数字字符
  const digits = phone.replace(/\D/g, '');
  
  if (digits.length < 7) {
    return phone; // 太短的号码不进行掩码
  }
  
  if (digits.length === 11) {
    // 中国手机号格式：138****1234
    return `${digits.slice(0, 3)}${maskChar.repeat(4)}${digits.slice(-4)}`;
  } else if (digits.length >= 7) {
    // 其他号码格式：前3位 + 掩码 + 后4位（或更少）
    const start = digits.slice(0, 3);
    const end = digits.slice(-Math.min(4, digits.length - 3));
    const maskLength = digits.length - start.length - end.length;
    return `${start}${maskChar.repeat(Math.max(1, maskLength))}${end}`;
  }
  
  return phone;
}

/**
 * 格式化文件大小
 * @param bytes 字节数
 * @returns 格式化后的文件大小字符串
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * 防抖函数
 * @param func 要防抖的函数
 * @param wait 等待时间（毫秒）
 * @returns 防抖后的函数
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * 节流函数
 * @param func 要节流的函数
 * @param limit 时间限制（毫秒）
 * @returns 节流后的函数
 */
export function throttle<T extends (...args: any[]) => any>(
  func: T,
  limit: number
): (...args: Parameters<T>) => void {
  let inThrottle: boolean;
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
