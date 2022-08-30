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

const SERVER_APP_LINK = 
  "http://" + 
  (process.env.NODE_ENV === 'production' ? 
  process.env.REACT_APP_SERVER_APP_LINK_PROD : 
  process.env.REACT_APP_SERVER_APP_LINK_DEV);
export const API_URL_USER = SERVER_APP_LINK + "/api/user";
export const API_URL_COURSE = SERVER_APP_LINK + "/api/course";