export const translations = {
  common: {
    submit: { en: 'Submit', zh: '提交' },
    cancel: { en: 'Cancel', zh: '取消' },
    retry: { en: 'Retry', zh: '重試' },
  },
  home: {
    title: { en: 'Routes ETA', zh: 'Routes ETA' },
    subtitle: { en: 'Hong Kong Transport Arrival Board Display', zh: '香港交通到站顯示' },
    selectBoard: { en: 'Select Board', zh: '選擇顯示板' },
    line: { en: 'Line', zh: '路線' },
    direction: { en: 'Direction', zh: '方向' },
    station: { en: 'Station', zh: '車站' },
    selectLine: { en: 'Select a line...', zh: '選擇路線...' },
    selectDirection: { en: 'Select a direction...', zh: '選擇方向...' },
    selectStation: { en: 'Select a station...', zh: '選擇車站...' },
    viewBoard: { en: 'View Arrival Board', zh: '查看到站顯示' },
    up: { en: 'Up', zh: '上行' },
    down: { en: 'Down', zh: '下行' },
    disclaimer: {
      en: 'This application is provided "as is" for academic and educational purposes only. It is not affiliated with, endorsed by, or connected to any public transportation operator in Hong Kong, including but not limited to MTR Corporation Limited. All data is sourced from <link>data.gov.hk</link> and related third-party providers. No warranty is made regarding accuracy, completeness, or timeliness of information. This application should not be used for travel planning or any official purposes. The developer assumes no liability for any loss or damage arising from the use of this application.',
      zh: '本應用程式僅供學術及教育用途，按「現狀」提供，不作任何保證。本應用程式與香港任何公共交通營運商（包括但不限於港鐵公司）無任何關聯、認可或聯繫。所有數據來自 <link>data.gov.hk</link> 及相關第三方數據提供者。不保證資訊的準確性、完整性或及時性。本應用程式不應用於行程規劃或任何官方用途。開發者不對因使用本應用程式而引致的任何損失或損害承擔責任。'
    },
  },
  board: {
    platform: { en: 'Platform', zh: '月台' },
    destination: { en: 'Destination', zh: '目的地' },
    arrival: { en: 'Arrival', zh: '到達' },
    trainLength: { en: 'Cars', zh: '車卡' },
    crowding: { en: 'Crowding', zh: '擠迫' },
    cars: { en: 'cars', zh: '卡' },
    arriving: { en: 'Arriving', zh: '即將抵達' },
    minutes: { en: 'min', zh: '分鐘' },
    noSchedule: { en: 'No schedule information', zh: '暫無班次資料' },
    lastUpdated: { en: 'Last updated', zh: '最後更新' },
  },
  nav: {
    backToHome: { en: 'Back to Home', zh: '返回主頁' },
  },
  errors: {
    loadFailed: { en: 'Failed to Load', zh: '載入失敗' },
    noData: { en: 'Unable to load data, please try again later', zh: '無法載入資料，請稍後再試' },
    invalidUrl: { en: 'Invalid URL parameters', zh: '無效的網址參數' },
  },
} as const;

export type TranslationKey =
  | 'common.submit'
  | 'common.cancel'
  | 'common.retry'
  | 'home.title'
  | 'home.subtitle'
  | 'home.selectBoard'
  | 'home.line'
  | 'home.direction'
  | 'home.station'
  | 'home.selectLine'
  | 'home.selectDirection'
  | 'home.selectStation'
  | 'home.viewBoard'
  | 'home.up'
  | 'home.down'
  | 'home.disclaimer'
  | 'board.platform'
  | 'board.destination'
  | 'board.arrival'
  | 'board.trainLength'
  | 'board.crowding'
  | 'board.cars'
  | 'board.arriving'
  | 'board.minutes'
  | 'board.noSchedule'
  | 'board.lastUpdated'
  | 'nav.backToHome'
  | 'errors.loadFailed'
  | 'errors.noData'
  | 'errors.invalidUrl';
