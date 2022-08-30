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

export const API_URL_USER = process.env.REACT_APP_SERVER_APP_LINK + "/api/user";
export const API_URL_COURSE = process.env.REACT_APP_SERVER_APP_LINK + "/api/course";