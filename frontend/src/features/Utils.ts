export enum ApiStatus {
  idle = 'idle',
  loading = 'loading',
  success = 'success',
  failed = 'failed'
}

export enum SelectionSessionSettingValue {
  TRUE = 'TRUE',
  FALSE = 'FALSE'
}

export const API_URL_USER = "http://localhost:8000/api/user";
export const API_URL_COURSE = "http://localhost:8000/api/course";