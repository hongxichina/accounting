// 从 vant 导出常用方法以解决 TypeScript 错误
import { Toast, Dialog } from 'vant';

/**
 * 显示消息提示
 * @param message 提示信息或配置对象
 */
export const showToast = (message: string | { [key: string]: any }) => {
  if (typeof message === 'string') {
    Toast(message);
  } else {
    Toast(message);
  }
};

/**
 * 显示对话框
 * @param options 对话框配置
 */
export const showDialog = (options: { [key: string]: any }) => {
  return Dialog(options);
}; 