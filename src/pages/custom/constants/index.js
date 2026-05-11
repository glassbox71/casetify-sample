export const BRANDS = [
  {
    id: 'apple', label: 'APPLE',
    models: [
      // { id: 'iphone17promax', label: '아이폰 17 Pro Max' },
      { id: 'iphone17pro', label: '아이폰 17 Pro' },
      { id: 'iphone17', label: '아이폰 17' },
      // { id: 'iphone16promax', label: '아이폰 16 Pro Max' },
      { id: 'iphone16pro', label: '아이폰 16 Pro' },      // ✅ 추가
      { id: 'iphone16', label: '아이폰 16' },
      { id: 'iphone15pro', label: '아이폰 15 Pro' },      // ✅ 추가
      { id: 'iphone15', label: '아이폰 15' },
      // { id: 'iphone14plus', label: '아이폰 14 Plus' },
      // { id: 'iphone13promax', label: '아이폰 13 Pro Max' },
      // { id: 'iphoneMini', label: '아이폰 mini' },
    ],
  },
  {
    id: 'samsung', label: 'SAMSUNG',
    models: [
      // { id: 's25ultra', label: 'Galaxy S25 Ultra' },
      { id: 's25plus', label: 'Galaxy S25+' },
      { id: 's25', label: 'Galaxy S25' },                 // ✅ 추가
      // { id: 's24', label: 'Galaxy S24' },
      { id: 's26plus', label: 'Galaxy S26+' },            // ✅ 추가
      { id: 's26', label: 'Galaxy S26' },                 // ✅ 추가
      { id: 'z6fold', label: 'Galaxy Z Fold 6' },
      { id: 'z6flip', label: 'Galaxy Z Flip 6' },
      { id: 'z7fold', label: 'Galaxy Z Fold 7' },         // ✅ 추가
      { id: 'z7flip', label: 'Galaxy Z Flip 7' },         // ✅ 추가
    ],
  },
  {
    id: 'google', label: 'GOOGLE',
    models: [
      { id: 'pixel10pro', label: 'Pixel 10 Pro' },        // ✅ 추가
      { id: 'pixel10', label: 'Pixel 10' },               // ✅ 추가
      { id: 'pixel9pro', label: 'Pixel 9 Pro' },
      { id: 'pixel9', label: 'Pixel 9' },
      // { id: 'pixel8pro', label: 'Pixel 8 Pro' },
    ],
  },
]

export const TABLET_BRANDS = [
  {
    id: 'apple', label: 'APPLE',
    models: [
      { id: 'ipad', label: 'iPad' },
      { id: 'ipadmini', label: 'iPad mini' },
      { id: 'ipadair4', label: 'iPad Air 4세대' },



      { id: 'ipadpro11s3', label: 'iPad Pro 11인치 3세대' },
      { id: 'ipadpro12.9', label: 'iPad Pro 12.9인치' },
      { id: 'ipadpro13', label: 'iPad Pro 13인치' },
    ],
  },
]

export const LAPTOP_BRANDS = [
  {
    id: 'apple', label: 'APPLE',
    models: [
      { id: 'macbook13', label: 'MacBook 13인치' },
      { id: 'macbook15', label: 'MacBook 15인치' },
      { id: 'macbookair13', label: 'MacBook Air 13인치' },
      { id: 'macbookair13s1', label: 'MacBook Air 13인치 (M1)' },
      { id: 'macbookpro14', label: 'MacBook Pro 14인치' },
      { id: 'macbookpro16', label: 'MacBook Pro 16인치' },
    ],
  },
]

export const TABLET_CASE_TYPES = [
  { id: 'impact', label: '임팩트 케이스' },
]

export const LAPTOP_CASE_TYPES = [
  { id: 'impact', label: '임팩트 케이스' },
]

export const CASE_COLORS = [
  { id: 'black', label: '블랙', hex: '#111111' },
  // { id: 'red', label: '레드', hex: '#ffb2b2' },
  { id: 'white', label: '화이트', hex: '#F0F0F0' },
  { id: 'yellow', label: '블루', hex: '#9fddda' },
]

export const CASE_TYPES = [
  { id: 'magsafe-bounce', label: '맥세이프 호환 바운스 케이스', image: '/images/custom/case-magsafe-bounce.png' },
  { id: 'magsafe-compact', label: '맥세이프 호환 임팩트 링 스탠드', image: '/images/custom/case-magsafe-compact.png' },
  { id: 'impact', label: '맥세이프 호환 임팩트 케이스', image: '/images/custom/case-impact.png' },
]

export const PHOTO_FILTERS = [
  { id: 'retro', label: 'Retro Rainbow', preview: '/images/custom/filter-retro.jpg' },
  { id: 'digicam', label: 'Digicam', preview: '/images/custom/filter-digicam.jpg' },
  { id: 'mono', label: 'Classic Mono', preview: '/images/custom/filter-mono.jpg' },
]

export const FONT_COLORS = [
  { id: 'black', label: '블랙', hex: '#111111' },
  { id: 'white', label: '화이트', hex: '#ffffff' },
  // { id: 'blue', label: '파랑', hex: '#1A5ADB' },
  { id: 'purple', label: '보라', hex: '#af6fba' },
]

export const DEVICE_TYPES = [
  { id: 'phone', label: '폰케이스', image: '/images/custom/device-phone.png' },
  { id: 'tablet', label: '태블릿 케이스', image: '/images/custom/device-tablet.png' },
]

export const INITIAL_SELECTIONS = {
  designType: null,
  deviceType: null,
  brand: null,
  model: null,
  color: null,
  caseType: null,
  photoFile: null,
  photoURL: null,
  photoFilter: null,
  filterStrength: 50,
  textValue: '',
  fontColor: null,
}