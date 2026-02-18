/**
 * MTR Lines and Stations Data
 *
 * Parsed from mtr_lines_and_stations.csv
 * Source: DATA.GOV.HK MTR Station Codes
 */

export interface MtrLineInfo {
  code: string;
  nameEn: string;
  nameZh: string;
  color: string;
}

export interface MtrStationEntry {
  code: string;
  id: string;
  nameZh: string;
  nameEn: string;
  sequence: number;
}

export interface MtrDirectionEntry {
  lineCode: string;
  /** Raw CSV direction: "DT", "UT", "LMC-DT", "LMC-UT", "TKS-DT", "TKS-UT" */
  direction: string;
  /** URL-friendly direction used in board route */
  urlDirection: string;
  stations: MtrStationEntry[];
}

export const MTR_LINES: Record<string, MtrLineInfo> = {
  AEL: {
    code: "AEL",
    nameEn: "Airport Express",
    nameZh: "機場快綫",
    color: "#00888A",
  },
  DRL: {
    code: "DRL",
    nameEn: "Disneyland Resort Line",
    nameZh: "迪士尼綫",
    color: "#F173AC",
  },
  EAL: {
    code: "EAL",
    nameEn: "East Rail Line",
    nameZh: "東鐵綫",
    color: "#53B7E8",
  },
  ISL: {
    code: "ISL",
    nameEn: "Island Line",
    nameZh: "港島綫",
    color: "#007DC5",
  },
  KTL: {
    code: "KTL",
    nameEn: "Kwun Tong Line",
    nameZh: "觀塘綫",
    color: "#00AB4E",
  },
  TML: {
    code: "TML",
    nameEn: "Tuen Ma Line",
    nameZh: "屯馬綫",
    color: "#923011",
  },
  TCL: {
    code: "TCL",
    nameEn: "Tung Chung Line",
    nameZh: "東涌綫",
    color: "#F7943E",
  },
  TKL: {
    code: "TKL",
    nameEn: "Tseung Kwan O Line",
    nameZh: "將軍澳綫",
    color: "#7D499D",
  },
  TWL: {
    code: "TWL",
    nameEn: "Tsuen Wan Line",
    nameZh: "荃灣綫",
    color: "#ED1D24",
  },
  SIL: {
    code: "SIL",
    nameEn: "South Island Line",
    nameZh: "南港島綫",
    color: "#BAC429",
  },
};

/** Map CSV direction codes to URL direction strings */
export function csvDirectionToUrl(direction: string): string {
  if (direction === "DT") return "down";
  if (direction === "UT") return "up";
  return direction;
}

/** All line-direction-station entries, matching the CSV */
export const MTR_LINE_DIRECTIONS: MtrDirectionEntry[] = [
  {
    lineCode: "AEL",
    direction: "DT",
    urlDirection: "down",
    stations: [
      { code: "AWE", id: "56", nameZh: "博覽館", nameEn: "AsiaWorld-Expo", sequence: 1 },
      { code: "AIR", id: "47", nameZh: "機場", nameEn: "Airport", sequence: 2 },
      { code: "TSY", id: "46", nameZh: "青衣", nameEn: "Tsing Yi", sequence: 3 },
      { code: "KOW", id: "45", nameZh: "九龍", nameEn: "Kowloon", sequence: 4 },
      { code: "HOK", id: "44", nameZh: "香港", nameEn: "Hong Kong", sequence: 5 },
    ],
  },
  {
    lineCode: "AEL",
    direction: "UT",
    urlDirection: "up",
    stations: [
      { code: "HOK", id: "44", nameZh: "香港", nameEn: "Hong Kong", sequence: 1 },
      { code: "KOW", id: "45", nameZh: "九龍", nameEn: "Kowloon", sequence: 2 },
      { code: "TSY", id: "46", nameZh: "青衣", nameEn: "Tsing Yi", sequence: 3 },
      { code: "AIR", id: "47", nameZh: "機場", nameEn: "Airport", sequence: 4 },
      { code: "AWE", id: "56", nameZh: "博覽館", nameEn: "AsiaWorld-Expo", sequence: 5 },
    ],
  },
  {
    lineCode: "DRL",
    direction: "DT",
    urlDirection: "down",
    stations: [
      { code: "SUN", id: "54", nameZh: "欣澳", nameEn: "Sunny Bay", sequence: 1 },
      { code: "DIS", id: "55", nameZh: "迪士尼", nameEn: "Disneyland Resort", sequence: 2 },
    ],
  },
  {
    lineCode: "DRL",
    direction: "UT",
    urlDirection: "up",
    stations: [
      { code: "DIS", id: "55", nameZh: "迪士尼", nameEn: "Disneyland Resort", sequence: 1 },
      { code: "SUN", id: "54", nameZh: "欣澳", nameEn: "Sunny Bay", sequence: 2 },
    ],
  },
  {
    lineCode: "EAL",
    direction: "DT",
    urlDirection: "down",
    stations: [
      { code: "LOW", id: "76", nameZh: "羅湖", nameEn: "Lo Wu", sequence: 1 },
      { code: "SHS", id: "75", nameZh: "上水", nameEn: "Sheung Shui", sequence: 2 },
      { code: "FAN", id: "74", nameZh: "粉嶺", nameEn: "Fanling", sequence: 3 },
      { code: "TWO", id: "73", nameZh: "太和", nameEn: "Tai Wo", sequence: 4 },
      { code: "TAP", id: "72", nameZh: "大埔墟", nameEn: "Tai Po Market", sequence: 5 },
      { code: "UNI", id: "71", nameZh: "大學", nameEn: "University", sequence: 6 },
      { code: "FOT", id: "69", nameZh: "火炭", nameEn: "Fo Tan", sequence: 7 },
      { code: "SHT", id: "68", nameZh: "沙田", nameEn: "Sha Tin", sequence: 8 },
      { code: "TAW", id: "67", nameZh: "大圍", nameEn: "Tai Wai", sequence: 9 },
      { code: "KOT", id: "8", nameZh: "九龍塘", nameEn: "Kowloon Tong", sequence: 10 },
      { code: "MKK", id: "65", nameZh: "旺角東", nameEn: "Mong Kok East", sequence: 11 },
      { code: "HUH", id: "64", nameZh: "紅磡", nameEn: "Hung Hom", sequence: 12 },
      { code: "EXC", id: "94", nameZh: "會展", nameEn: "Exhibition Centre", sequence: 13 },
      { code: "ADM", id: "2", nameZh: "金鐘", nameEn: "Admiralty", sequence: 14 },
    ],
  },
  {
    lineCode: "EAL",
    direction: "UT",
    urlDirection: "up",
    stations: [
      { code: "ADM", id: "2", nameZh: "金鐘", nameEn: "Admiralty", sequence: 1 },
      { code: "EXC", id: "94", nameZh: "會展", nameEn: "Exhibition Centre", sequence: 2 },
      { code: "HUH", id: "64", nameZh: "紅磡", nameEn: "Hung Hom", sequence: 3 },
      { code: "MKK", id: "65", nameZh: "旺角東", nameEn: "Mong Kok East", sequence: 4 },
      { code: "KOT", id: "8", nameZh: "九龍塘", nameEn: "Kowloon Tong", sequence: 5 },
      { code: "TAW", id: "67", nameZh: "大圍", nameEn: "Tai Wai", sequence: 6 },
      { code: "SHT", id: "68", nameZh: "沙田", nameEn: "Sha Tin", sequence: 7 },
      { code: "FOT", id: "69", nameZh: "火炭", nameEn: "Fo Tan", sequence: 8 },
      { code: "UNI", id: "71", nameZh: "大學", nameEn: "University", sequence: 9 },
      { code: "TAP", id: "72", nameZh: "大埔墟", nameEn: "Tai Po Market", sequence: 10 },
      { code: "TWO", id: "73", nameZh: "太和", nameEn: "Tai Wo", sequence: 11 },
      { code: "FAN", id: "74", nameZh: "粉嶺", nameEn: "Fanling", sequence: 12 },
      { code: "SHS", id: "75", nameZh: "上水", nameEn: "Sheung Shui", sequence: 13 },
      { code: "LOW", id: "76", nameZh: "羅湖", nameEn: "Lo Wu", sequence: 14 },
    ],
  },
  {
    lineCode: "EAL",
    direction: "LMC-DT",
    urlDirection: "LMC-DT",
    stations: [
      { code: "LMC", id: "78", nameZh: "落馬洲", nameEn: "Lok Ma Chau", sequence: 1 },
      { code: "SHS", id: "75", nameZh: "上水", nameEn: "Sheung Shui", sequence: 2 },
      { code: "FAN", id: "74", nameZh: "粉嶺", nameEn: "Fanling", sequence: 3 },
      { code: "TWO", id: "73", nameZh: "太和", nameEn: "Tai Wo", sequence: 4 },
      { code: "TAP", id: "72", nameZh: "大埔墟", nameEn: "Tai Po Market", sequence: 5 },
      { code: "UNI", id: "71", nameZh: "大學", nameEn: "University", sequence: 6 },
      { code: "FOT", id: "69", nameZh: "火炭", nameEn: "Fo Tan", sequence: 7 },
      { code: "SHT", id: "68", nameZh: "沙田", nameEn: "Sha Tin", sequence: 8 },
      { code: "TAW", id: "67", nameZh: "大圍", nameEn: "Tai Wai", sequence: 9 },
      { code: "KOT", id: "8", nameZh: "九龍塘", nameEn: "Kowloon Tong", sequence: 10 },
      { code: "MKK", id: "65", nameZh: "旺角東", nameEn: "Mong Kok East", sequence: 11 },
      { code: "HUH", id: "64", nameZh: "紅磡", nameEn: "Hung Hom", sequence: 12 },
      { code: "EXC", id: "94", nameZh: "會展", nameEn: "Exhibition Centre", sequence: 13 },
      { code: "ADM", id: "2", nameZh: "金鐘", nameEn: "Admiralty", sequence: 14 },
    ],
  },
  {
    lineCode: "EAL",
    direction: "LMC-UT",
    urlDirection: "LMC-UT",
    stations: [
      { code: "ADM", id: "2", nameZh: "金鐘", nameEn: "Admiralty", sequence: 1 },
      { code: "EXC", id: "94", nameZh: "會展", nameEn: "Exhibition Centre", sequence: 2 },
      { code: "HUH", id: "64", nameZh: "紅磡", nameEn: "Hung Hom", sequence: 3 },
      { code: "MKK", id: "65", nameZh: "旺角東", nameEn: "Mong Kok East", sequence: 4 },
      { code: "KOT", id: "8", nameZh: "九龍塘", nameEn: "Kowloon Tong", sequence: 5 },
      { code: "TAW", id: "67", nameZh: "大圍", nameEn: "Tai Wai", sequence: 6 },
      { code: "SHT", id: "68", nameZh: "沙田", nameEn: "Sha Tin", sequence: 7 },
      { code: "FOT", id: "69", nameZh: "火炭", nameEn: "Fo Tan", sequence: 8 },
      { code: "UNI", id: "71", nameZh: "大學", nameEn: "University", sequence: 9 },
      { code: "TAP", id: "72", nameZh: "大埔墟", nameEn: "Tai Po Market", sequence: 10 },
      { code: "TWO", id: "73", nameZh: "太和", nameEn: "Tai Wo", sequence: 11 },
      { code: "FAN", id: "74", nameZh: "粉嶺", nameEn: "Fanling", sequence: 12 },
      { code: "SHS", id: "75", nameZh: "上水", nameEn: "Sheung Shui", sequence: 13 },
      { code: "LMC", id: "78", nameZh: "落馬洲", nameEn: "Lok Ma Chau", sequence: 14 },
    ],
  },
  {
    lineCode: "ISL",
    direction: "DT",
    urlDirection: "down",
    stations: [
      { code: "CHW", id: "37", nameZh: "柴灣", nameEn: "Chai Wan", sequence: 1 },
      { code: "HFC", id: "36", nameZh: "杏花邨", nameEn: "Heng Fa Chuen", sequence: 2 },
      { code: "SKW", id: "35", nameZh: "筲箕灣", nameEn: "Shau Kei Wan", sequence: 3 },
      { code: "SWH", id: "34", nameZh: "西灣河", nameEn: "Sai Wan Ho", sequence: 4 },
      { code: "TAK", id: "33", nameZh: "太古", nameEn: "Tai Koo", sequence: 5 },
      { code: "QUB", id: "32", nameZh: "鰂魚涌", nameEn: "Quarry Bay", sequence: 6 },
      { code: "NOP", id: "31", nameZh: "北角", nameEn: "North Point", sequence: 7 },
      { code: "FOH", id: "30", nameZh: "炮台山", nameEn: "Fortress Hill", sequence: 8 },
      { code: "TIH", id: "29", nameZh: "天后", nameEn: "Tin Hau", sequence: 9 },
      { code: "CAB", id: "28", nameZh: "銅鑼灣", nameEn: "Causeway Bay", sequence: 10 },
      { code: "WAC", id: "27", nameZh: "灣仔", nameEn: "Wan Chai", sequence: 11 },
      { code: "ADM", id: "2", nameZh: "金鐘", nameEn: "Admiralty", sequence: 12 },
      { code: "CEN", id: "1", nameZh: "中環", nameEn: "Central", sequence: 13 },
      { code: "SHW", id: "26", nameZh: "上環", nameEn: "Sheung Wan", sequence: 14 },
      { code: "SYP", id: "81", nameZh: "西營盤", nameEn: "Sai Ying Pun", sequence: 15 },
      { code: "HKU", id: "82", nameZh: "香港大學", nameEn: "HKU", sequence: 16 },
      { code: "KET", id: "83", nameZh: "堅尼地城", nameEn: "Kennedy Town", sequence: 17 },
    ],
  },
  {
    lineCode: "ISL",
    direction: "UT",
    urlDirection: "up",
    stations: [
      { code: "KET", id: "83", nameZh: "堅尼地城", nameEn: "Kennedy Town", sequence: 1 },
      { code: "HKU", id: "82", nameZh: "香港大學", nameEn: "HKU", sequence: 2 },
      { code: "SYP", id: "81", nameZh: "西營盤", nameEn: "Sai Ying Pun", sequence: 3 },
      { code: "SHW", id: "26", nameZh: "上環", nameEn: "Sheung Wan", sequence: 4 },
      { code: "CEN", id: "1", nameZh: "中環", nameEn: "Central", sequence: 5 },
      { code: "ADM", id: "2", nameZh: "金鐘", nameEn: "Admiralty", sequence: 6 },
      { code: "WAC", id: "27", nameZh: "灣仔", nameEn: "Wan Chai", sequence: 7 },
      { code: "CAB", id: "28", nameZh: "銅鑼灣", nameEn: "Causeway Bay", sequence: 8 },
      { code: "TIH", id: "29", nameZh: "天后", nameEn: "Tin Hau", sequence: 9 },
      { code: "FOH", id: "30", nameZh: "炮台山", nameEn: "Fortress Hill", sequence: 10 },
      { code: "NOP", id: "31", nameZh: "北角", nameEn: "North Point", sequence: 11 },
      { code: "QUB", id: "32", nameZh: "鰂魚涌", nameEn: "Quarry Bay", sequence: 12 },
      { code: "TAK", id: "33", nameZh: "太古", nameEn: "Tai Koo", sequence: 13 },
      { code: "SWH", id: "34", nameZh: "西灣河", nameEn: "Sai Wan Ho", sequence: 14 },
      { code: "SKW", id: "35", nameZh: "筲箕灣", nameEn: "Shau Kei Wan", sequence: 15 },
      { code: "HFC", id: "36", nameZh: "杏花邨", nameEn: "Heng Fa Chuen", sequence: 16 },
      { code: "CHW", id: "37", nameZh: "柴灣", nameEn: "Chai Wan", sequence: 17 },
    ],
  },
  {
    lineCode: "KTL",
    direction: "DT",
    urlDirection: "down",
    stations: [
      { code: "TIK", id: "49", nameZh: "調景嶺", nameEn: "Tiu Keng Leng", sequence: 1 },
      { code: "YAT", id: "48", nameZh: "油塘", nameEn: "Yau Tong", sequence: 2 },
      { code: "LAT", id: "38", nameZh: "藍田", nameEn: "Lam Tin", sequence: 3 },
      { code: "KWT", id: "15", nameZh: "觀塘", nameEn: "Kwun Tong", sequence: 4 },
      { code: "NTK", id: "14", nameZh: "牛頭角", nameEn: "Ngau Tau Kok", sequence: 5 },
      { code: "KOB", id: "13", nameZh: "九龍灣", nameEn: "Kowloon Bay", sequence: 6 },
      { code: "CHH", id: "12", nameZh: "彩虹", nameEn: "Choi Hung", sequence: 7 },
      { code: "DIH", id: "11", nameZh: "鑽石山", nameEn: "Diamond Hill", sequence: 8 },
      { code: "WTS", id: "10", nameZh: "黃大仙", nameEn: "Wong Tai Sin", sequence: 9 },
      { code: "LOF", id: "9", nameZh: "樂富", nameEn: "Lok Fu", sequence: 10 },
      { code: "KOT", id: "8", nameZh: "九龍塘", nameEn: "Kowloon Tong", sequence: 11 },
      { code: "SKM", id: "7", nameZh: "石硤尾", nameEn: "Shek Kip Mei", sequence: 12 },
      { code: "PRE", id: "16", nameZh: "太子", nameEn: "Prince Edward", sequence: 13 },
      { code: "MOK", id: "6", nameZh: "旺角", nameEn: "Mong Kok", sequence: 14 },
      { code: "YMT", id: "5", nameZh: "油麻地", nameEn: "Yau Ma Tei", sequence: 15 },
      { code: "HOM", id: "84", nameZh: "何文田", nameEn: "Ho Man Tin", sequence: 16 },
      { code: "WHA", id: "85", nameZh: "黃埔", nameEn: "Whampoa", sequence: 17 },
    ],
  },
  {
    lineCode: "KTL",
    direction: "UT",
    urlDirection: "up",
    stations: [
      { code: "WHA", id: "85", nameZh: "黃埔", nameEn: "Whampoa", sequence: 1 },
      { code: "HOM", id: "84", nameZh: "何文田", nameEn: "Ho Man Tin", sequence: 2 },
      { code: "YMT", id: "5", nameZh: "油麻地", nameEn: "Yau Ma Tei", sequence: 3 },
      { code: "MOK", id: "6", nameZh: "旺角", nameEn: "Mong Kok", sequence: 4 },
      { code: "PRE", id: "16", nameZh: "太子", nameEn: "Prince Edward", sequence: 5 },
      { code: "SKM", id: "7", nameZh: "石硤尾", nameEn: "Shek Kip Mei", sequence: 6 },
      { code: "KOT", id: "8", nameZh: "九龍塘", nameEn: "Kowloon Tong", sequence: 7 },
      { code: "LOF", id: "9", nameZh: "樂富", nameEn: "Lok Fu", sequence: 8 },
      { code: "WTS", id: "10", nameZh: "黃大仙", nameEn: "Wong Tai Sin", sequence: 9 },
      { code: "DIH", id: "11", nameZh: "鑽石山", nameEn: "Diamond Hill", sequence: 10 },
      { code: "CHH", id: "12", nameZh: "彩虹", nameEn: "Choi Hung", sequence: 11 },
      { code: "KOB", id: "13", nameZh: "九龍灣", nameEn: "Kowloon Bay", sequence: 12 },
      { code: "NTK", id: "14", nameZh: "牛頭角", nameEn: "Ngau Tau Kok", sequence: 13 },
      { code: "KWT", id: "15", nameZh: "觀塘", nameEn: "Kwun Tong", sequence: 14 },
      { code: "LAT", id: "38", nameZh: "藍田", nameEn: "Lam Tin", sequence: 15 },
      { code: "YAT", id: "48", nameZh: "油塘", nameEn: "Yau Tong", sequence: 16 },
      { code: "TIK", id: "49", nameZh: "調景嶺", nameEn: "Tiu Keng Leng", sequence: 17 },
    ],
  },
  {
    lineCode: "TML",
    direction: "UT",
    urlDirection: "up",
    stations: [
      { code: "WKS", id: "103", nameZh: "烏溪沙", nameEn: "Wu Kai Sha", sequence: 1 },
      { code: "MOS", id: "102", nameZh: "馬鞍山", nameEn: "Ma On Shan", sequence: 2 },
      { code: "HEO", id: "101", nameZh: "恆安", nameEn: "Heng On", sequence: 3 },
      { code: "TSH", id: "100", nameZh: "大水坑", nameEn: "Tai Shui Hang", sequence: 4 },
      { code: "SHM", id: "99", nameZh: "石門", nameEn: "Shek Mun", sequence: 5 },
      { code: "CIO", id: "98", nameZh: "第一城", nameEn: "City One", sequence: 6 },
      { code: "STW", id: "97", nameZh: "沙田圍", nameEn: "Sha Tin Wai", sequence: 7 },
      { code: "CKT", id: "96", nameZh: "車公廟", nameEn: "Che Kung Temple", sequence: 8 },
      { code: "TAW", id: "67", nameZh: "大圍", nameEn: "Tai Wai", sequence: 9 },
      { code: "HIK", id: "90", nameZh: "顯徑", nameEn: "Hin Keng", sequence: 10 },
      { code: "DIH", id: "11", nameZh: "鑽石山", nameEn: "Diamond Hill", sequence: 11 },
      { code: "KAT", id: "91", nameZh: "啟德", nameEn: "Kai Tak", sequence: 12 },
      { code: "SUW", id: "92", nameZh: "宋皇臺", nameEn: "Sung Wong Toi", sequence: 13 },
      { code: "TKW", id: "93", nameZh: "土瓜灣", nameEn: "To Kwa Wan", sequence: 14 },
      { code: "HOM", id: "84", nameZh: "何文田", nameEn: "Ho Man Tin", sequence: 15 },
      { code: "HUH", id: "64", nameZh: "紅磡", nameEn: "Hung Hom", sequence: 16 },
      { code: "ETS", id: "80", nameZh: "尖東", nameEn: "East Tsim Sha Tsui", sequence: 17 },
      { code: "AUS", id: "111", nameZh: "柯士甸", nameEn: "Austin", sequence: 18 },
      { code: "NAC", id: "53", nameZh: "南昌", nameEn: "Nam Cheong", sequence: 19 },
      { code: "MEF", id: "20", nameZh: "美孚", nameEn: "Mei Foo", sequence: 20 },
      { code: "TWW", id: "114", nameZh: "荃灣西", nameEn: "Tsuen Wan West", sequence: 21 },
      { code: "KSR", id: "115", nameZh: "錦上路", nameEn: "Kam Sheung Road", sequence: 22 },
      { code: "YUL", id: "116", nameZh: "元朗", nameEn: "Yuen Long", sequence: 23 },
      { code: "LOP", id: "117", nameZh: "朗屏", nameEn: "Long Ping", sequence: 24 },
      { code: "TIS", id: "118", nameZh: "天水圍", nameEn: "Tin Shui Wai", sequence: 25 },
      { code: "SIH", id: "119", nameZh: "兆康", nameEn: "Siu Hong", sequence: 26 },
      { code: "TUM", id: "120", nameZh: "屯門", nameEn: "Tuen Mun", sequence: 27 },
    ],
  },
  {
    lineCode: "TML",
    direction: "DT",
    urlDirection: "down",
    stations: [
      { code: "TUM", id: "120", nameZh: "屯門", nameEn: "Tuen Mun", sequence: 1 },
      { code: "SIH", id: "119", nameZh: "兆康", nameEn: "Siu Hong", sequence: 2 },
      { code: "TIS", id: "118", nameZh: "天水圍", nameEn: "Tin Shui Wai", sequence: 3 },
      { code: "LOP", id: "117", nameZh: "朗屏", nameEn: "Long Ping", sequence: 4 },
      { code: "YUL", id: "116", nameZh: "元朗", nameEn: "Yuen Long", sequence: 5 },
      { code: "KSR", id: "115", nameZh: "錦上路", nameEn: "Kam Sheung Road", sequence: 6 },
      { code: "TWW", id: "114", nameZh: "荃灣西", nameEn: "Tsuen Wan West", sequence: 7 },
      { code: "MEF", id: "20", nameZh: "美孚", nameEn: "Mei Foo", sequence: 8 },
      { code: "NAC", id: "53", nameZh: "南昌", nameEn: "Nam Cheong", sequence: 9 },
      { code: "AUS", id: "111", nameZh: "柯士甸", nameEn: "Austin", sequence: 10 },
      { code: "ETS", id: "80", nameZh: "尖東", nameEn: "East Tsim Sha Tsui", sequence: 11 },
      { code: "HUH", id: "64", nameZh: "紅磡", nameEn: "Hung Hom", sequence: 12 },
      { code: "HOM", id: "84", nameZh: "何文田", nameEn: "Ho Man Tin", sequence: 13 },
      { code: "TKW", id: "93", nameZh: "土瓜灣", nameEn: "To Kwa Wan", sequence: 14 },
      { code: "SUW", id: "92", nameZh: "宋皇臺", nameEn: "Sung Wong Toi", sequence: 15 },
      { code: "KAT", id: "91", nameZh: "啟德", nameEn: "Kai Tak", sequence: 16 },
      { code: "DIH", id: "11", nameZh: "鑽石山", nameEn: "Diamond Hill", sequence: 17 },
      { code: "HIK", id: "90", nameZh: "顯徑", nameEn: "Hin Keng", sequence: 18 },
      { code: "TAW", id: "67", nameZh: "大圍", nameEn: "Tai Wai", sequence: 19 },
      { code: "CKT", id: "96", nameZh: "車公廟", nameEn: "Che Kung Temple", sequence: 20 },
      { code: "STW", id: "97", nameZh: "沙田圍", nameEn: "Sha Tin Wai", sequence: 21 },
      { code: "CIO", id: "98", nameZh: "第一城", nameEn: "City One", sequence: 22 },
      { code: "SHM", id: "99", nameZh: "石門", nameEn: "Shek Mun", sequence: 23 },
      { code: "TSH", id: "100", nameZh: "大水坑", nameEn: "Tai Shui Hang", sequence: 24 },
      { code: "HEO", id: "101", nameZh: "恆安", nameEn: "Heng On", sequence: 25 },
      { code: "MOS", id: "102", nameZh: "馬鞍山", nameEn: "Ma On Shan", sequence: 26 },
      { code: "WKS", id: "103", nameZh: "烏溪沙", nameEn: "Wu Kai Sha", sequence: 27 },
    ],
  },
  {
    lineCode: "TCL",
    direction: "DT",
    urlDirection: "down",
    stations: [
      { code: "TUC", id: "43", nameZh: "東涌", nameEn: "Tung Chung", sequence: 1 },
      { code: "SUN", id: "54", nameZh: "欣澳", nameEn: "Sunny Bay", sequence: 2 },
      { code: "TSY", id: "42", nameZh: "青衣", nameEn: "Tsing Yi", sequence: 3 },
      { code: "LAK", id: "21", nameZh: "茘景", nameEn: "Lai King", sequence: 4 },
      { code: "NAC", id: "53", nameZh: "南昌", nameEn: "Nam Cheong", sequence: 5 },
      { code: "OLY", id: "41", nameZh: "奧運", nameEn: "Olympic", sequence: 6 },
      { code: "KOW", id: "40", nameZh: "九龍", nameEn: "Kowloon", sequence: 7 },
      { code: "HOK", id: "39", nameZh: "香港", nameEn: "Hong Kong", sequence: 8 },
    ],
  },
  {
    lineCode: "TCL",
    direction: "UT",
    urlDirection: "up",
    stations: [
      { code: "HOK", id: "39", nameZh: "香港", nameEn: "Hong Kong", sequence: 1 },
      { code: "KOW", id: "40", nameZh: "九龍", nameEn: "Kowloon", sequence: 2 },
      { code: "OLY", id: "41", nameZh: "奧運", nameEn: "Olympic", sequence: 3 },
      { code: "NAC", id: "53", nameZh: "南昌", nameEn: "Nam Cheong", sequence: 4 },
      { code: "LAK", id: "21", nameZh: "茘景", nameEn: "Lai King", sequence: 5 },
      { code: "TSY", id: "42", nameZh: "青衣", nameEn: "Tsing Yi", sequence: 6 },
      { code: "SUN", id: "54", nameZh: "欣澳", nameEn: "Sunny Bay", sequence: 7 },
      { code: "TUC", id: "43", nameZh: "東涌", nameEn: "Tung Chung", sequence: 8 },
    ],
  },
  {
    lineCode: "TKL",
    direction: "DT",
    urlDirection: "down",
    stations: [
      { code: "POA", id: "52", nameZh: "寶琳", nameEn: "Po Lam", sequence: 1 },
      { code: "HAH", id: "51", nameZh: "坑口", nameEn: "Hang Hau", sequence: 2 },
      { code: "TKO", id: "50", nameZh: "將軍澳", nameEn: "Tseung Kwan O", sequence: 3 },
      { code: "TIK", id: "49", nameZh: "調景嶺", nameEn: "Tiu Keng Leng", sequence: 4 },
      { code: "YAT", id: "48", nameZh: "油塘", nameEn: "Yau Tong", sequence: 5 },
      { code: "QUB", id: "32", nameZh: "鰂魚涌", nameEn: "Quarry Bay", sequence: 6 },
      { code: "NOP", id: "31", nameZh: "北角", nameEn: "North Point", sequence: 7 },
    ],
  },
  {
    lineCode: "TKL",
    direction: "UT",
    urlDirection: "up",
    stations: [
      { code: "NOP", id: "31", nameZh: "北角", nameEn: "North Point", sequence: 1 },
      { code: "QUB", id: "32", nameZh: "鰂魚涌", nameEn: "Quarry Bay", sequence: 2 },
      { code: "YAT", id: "48", nameZh: "油塘", nameEn: "Yau Tong", sequence: 3 },
      { code: "TIK", id: "49", nameZh: "調景嶺", nameEn: "Tiu Keng Leng", sequence: 4 },
      { code: "TKO", id: "50", nameZh: "將軍澳", nameEn: "Tseung Kwan O", sequence: 5 },
      { code: "HAH", id: "51", nameZh: "坑口", nameEn: "Hang Hau", sequence: 6 },
      { code: "POA", id: "52", nameZh: "寶琳", nameEn: "Po Lam", sequence: 7 },
    ],
  },
  {
    lineCode: "TKL",
    direction: "TKS-DT",
    urlDirection: "TKS-DT",
    stations: [
      { code: "LHP", id: "57", nameZh: "康城", nameEn: "LOHAS Park", sequence: 1 },
      { code: "TKO", id: "50", nameZh: "將軍澳", nameEn: "Tseung Kwan O", sequence: 2 },
      { code: "TIK", id: "49", nameZh: "調景嶺", nameEn: "Tiu Keng Leng", sequence: 3 },
    ],
  },
  {
    lineCode: "TKL",
    direction: "TKS-UT",
    urlDirection: "TKS-UT",
    stations: [
      { code: "TIK", id: "49", nameZh: "調景嶺", nameEn: "Tiu Keng Leng", sequence: 1 },
      { code: "TKO", id: "50", nameZh: "將軍澳", nameEn: "Tseung Kwan O", sequence: 2 },
      { code: "LHP", id: "57", nameZh: "康城", nameEn: "LOHAS Park", sequence: 3 },
    ],
  },
  {
    lineCode: "TWL",
    direction: "DT",
    urlDirection: "down",
    stations: [
      { code: "TSW", id: "25", nameZh: "荃灣", nameEn: "Tsuen Wan", sequence: 1 },
      { code: "TWH", id: "24", nameZh: "大窩口", nameEn: "Tai Wo Hau", sequence: 2 },
      { code: "KWH", id: "23", nameZh: "葵興", nameEn: "Kwai Hing", sequence: 3 },
      { code: "KWF", id: "22", nameZh: "葵芳", nameEn: "Kwai Fong", sequence: 4 },
      { code: "LAK", id: "21", nameZh: "茘景", nameEn: "Lai King", sequence: 5 },
      { code: "MEF", id: "20", nameZh: "美孚", nameEn: "Mei Foo", sequence: 6 },
      { code: "LCK", id: "19", nameZh: "茘枝角", nameEn: "Lai Chi Kok", sequence: 7 },
      { code: "CSW", id: "18", nameZh: "長沙灣", nameEn: "Cheung Sha Wan", sequence: 8 },
      { code: "SSP", id: "17", nameZh: "深水埗", nameEn: "Sham Shui Po", sequence: 9 },
      { code: "PRE", id: "16", nameZh: "太子", nameEn: "Prince Edward", sequence: 10 },
      { code: "MOK", id: "6", nameZh: "旺角", nameEn: "Mong Kok", sequence: 11 },
      { code: "YMT", id: "5", nameZh: "油麻地", nameEn: "Yau Ma Tei", sequence: 12 },
      { code: "JOR", id: "4", nameZh: "佐敦", nameEn: "Jordan", sequence: 13 },
      { code: "TST", id: "3", nameZh: "尖沙咀", nameEn: "Tsim Sha Tsui", sequence: 14 },
      { code: "ADM", id: "2", nameZh: "金鐘", nameEn: "Admiralty", sequence: 15 },
      { code: "CEN", id: "1", nameZh: "中環", nameEn: "Central", sequence: 16 },
    ],
  },
  {
    lineCode: "TWL",
    direction: "UT",
    urlDirection: "up",
    stations: [
      { code: "CEN", id: "1", nameZh: "中環", nameEn: "Central", sequence: 1 },
      { code: "ADM", id: "2", nameZh: "金鐘", nameEn: "Admiralty", sequence: 2 },
      { code: "TST", id: "3", nameZh: "尖沙咀", nameEn: "Tsim Sha Tsui", sequence: 3 },
      { code: "JOR", id: "4", nameZh: "佐敦", nameEn: "Jordan", sequence: 4 },
      { code: "YMT", id: "5", nameZh: "油麻地", nameEn: "Yau Ma Tei", sequence: 5 },
      { code: "MOK", id: "6", nameZh: "旺角", nameEn: "Mong Kok", sequence: 6 },
      { code: "PRE", id: "16", nameZh: "太子", nameEn: "Prince Edward", sequence: 7 },
      { code: "SSP", id: "17", nameZh: "深水埗", nameEn: "Sham Shui Po", sequence: 8 },
      { code: "CSW", id: "18", nameZh: "長沙灣", nameEn: "Cheung Sha Wan", sequence: 9 },
      { code: "LCK", id: "19", nameZh: "茘枝角", nameEn: "Lai Chi Kok", sequence: 10 },
      { code: "MEF", id: "20", nameZh: "美孚", nameEn: "Mei Foo", sequence: 11 },
      { code: "LAK", id: "21", nameZh: "茘景", nameEn: "Lai King", sequence: 12 },
      { code: "KWF", id: "22", nameZh: "葵芳", nameEn: "Kwai Fong", sequence: 13 },
      { code: "KWH", id: "23", nameZh: "葵興", nameEn: "Kwai Hing", sequence: 14 },
      { code: "TWH", id: "24", nameZh: "大窩口", nameEn: "Tai Wo Hau", sequence: 15 },
      { code: "TSW", id: "25", nameZh: "荃灣", nameEn: "Tsuen Wan", sequence: 16 },
    ],
  },
  {
    lineCode: "SIL",
    direction: "UT",
    urlDirection: "up",
    stations: [
      { code: "ADM", id: "2", nameZh: "金鐘", nameEn: "Admiralty", sequence: 1 },
      { code: "OCP", id: "86", nameZh: "海洋公園", nameEn: "Ocean Park", sequence: 2 },
      { code: "WCH", id: "87", nameZh: "黃竹坑", nameEn: "Wong Chuk Hang", sequence: 3 },
      { code: "LET", id: "88", nameZh: "利東", nameEn: "Lei Tung", sequence: 4 },
      { code: "SOH", id: "89", nameZh: "海怡半島", nameEn: "South Horizons", sequence: 5 },
    ],
  },
  {
    lineCode: "SIL",
    direction: "DT",
    urlDirection: "down",
    stations: [
      { code: "SOH", id: "89", nameZh: "海怡半島", nameEn: "South Horizons", sequence: 1 },
      { code: "LET", id: "88", nameZh: "利東", nameEn: "Lei Tung", sequence: 2 },
      { code: "WCH", id: "87", nameZh: "黃竹坑", nameEn: "Wong Chuk Hang", sequence: 3 },
      { code: "OCP", id: "86", nameZh: "海洋公園", nameEn: "Ocean Park", sequence: 4 },
      { code: "ADM", id: "2", nameZh: "金鐘", nameEn: "Admiralty", sequence: 5 },
    ],
  },
];

/** Get all directions available for a given line */
export function getMtrLineDirections(lineCode: string): MtrDirectionEntry[] {
  return MTR_LINE_DIRECTIONS.filter((d) => d.lineCode === lineCode);
}

/** Get a specific direction entry */
export function getMtrDirectionEntry(
  lineCode: string,
  urlDirection: string
): MtrDirectionEntry | undefined {
  return MTR_LINE_DIRECTIONS.find(
    (d) => d.lineCode === lineCode && d.urlDirection === urlDirection
  );
}

/** Look up a station's name by code within a specific line+direction */
export function getMtrStationInfo(
  lineCode: string,
  stationCode: string
): MtrStationEntry | undefined {
  for (const entry of MTR_LINE_DIRECTIONS) {
    if (entry.lineCode !== lineCode) continue;
    const station = entry.stations.find((s) => s.code === stationCode);
    if (station) return station;
  }
  return undefined;
}

/** Get a human-readable label for a direction entry */
export function getDirectionLabel(entry: MtrDirectionEntry): string {
  const first = entry.stations[0];
  const last = entry.stations[entry.stations.length - 1];
  if (!first || !last) return entry.direction;
  return `${first.nameEn} → ${last.nameEn}`;
}

/** Get a Chinese label for a direction entry */
export function getDirectionLabelZh(entry: MtrDirectionEntry): string {
  const first = entry.stations[0];
  const last = entry.stations[entry.stations.length - 1];
  if (!first || !last) return entry.direction;
  return `${first.nameZh} → ${last.nameZh}`;
}
