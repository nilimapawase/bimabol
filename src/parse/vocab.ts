export type CropId =
  | 'soybean'
  | 'cotton'
  | 'tur'
  | 'jowar'
  | 'bajra'
  | 'maize'
  | 'paddy'
  | 'groundnut'
  | 'gram'
  | 'wheat'
  | 'onion'
  | 'sugarcane'
  | 'banana'
  | 'grape'
  | 'pomegranate'
  | 'orange'
  | 'mango'
  | 'turmeric'

export const CROP_ALIASES: Record<CropId, string[]> = {
  soybean: ['soybean', 'soyabean', 'soya', 'सोयाबीन', 'सोय'],
  cotton: ['cotton', 'kapas', 'कापूस', 'कपास'],
  tur: ['tur', 'arhar', 'तूर', 'तुर'],
  jowar: ['jowar', 'ज्वारी'],
  bajra: ['bajra', 'बाजरी'],
  maize: ['maize', 'maka', 'मका', 'corn'],
  paddy: ['paddy', 'rice', 'भात', 'dhan'],
  groundnut: ['groundnut', 'peanut', 'भुईमूग', 'मूगफळी'],
  gram: ['gram', 'chickpea', 'हरभरा', 'chana'],
  wheat: ['wheat', 'गहू', 'gehu'],
  onion: ['onion', 'कांदा', 'pyaaz'],
  sugarcane: ['sugarcane', 'sugar cane', 'ऊस', 'ganna'],
  banana: ['banana', 'केळी', 'kela'],
  grape: ['grape', 'grapes', 'द्राक्ष'],
  pomegranate: ['pomegranate', 'डाळिंब'],
  orange: ['orange', 'संत्रा', 'santra'],
  mango: ['mango', 'आंबा', 'aam'],
  turmeric: ['turmeric', 'हळद', 'haldi'],
}

export type LossId = 'hail' | 'flood' | 'cloudburst' | 'landslide'

export const LOSS_ALIASES: Record<LossId, string[]> = {
  hail: ['hail', 'hailstorm', 'गारपीट', 'ओला', 'ओलावृष्टि'],
  flood: ['flood', 'inundation', 'पूर', 'पाणी साचले', 'water logging', 'बाढ़', 'बाडी', 'बाढ', 'pani', 'पानी'],
  cloudburst: ['cloudburst', 'ढगफुटी', 'cloud burst', 'वादळ', 'storm'],
  landslide: ['landslide', 'land slide', 'भूस्खलन', 'दरड'],
}

/** 36 Maharashtra districts — Marathi + English keys */
export const DISTRICTS: { id: string; names: string[] }[] = [
  { id: 'Ahmednagar', names: ['ahmednagar', 'ahilyanagar', 'अहमदनगर'] },
  { id: 'Akola', names: ['akola', 'अकोला'] },
  { id: 'Amravati', names: ['amravati', 'अमरावती'] },
  { id: 'Aurangabad', names: ['aurangabad', 'chhatrapati sambhajinagar', 'औरंगाबाद', 'संभाजीनगर'] },
  { id: 'Beed', names: ['beed', 'बीड'] },
  { id: 'Bhandara', names: ['bhandara', 'भंडारा'] },
  { id: 'Buldhana', names: ['buldhana', 'बुलढाणा'] },
  { id: 'Chandrapur', names: ['chandrapur', 'चंद्रपूर'] },
  { id: 'Dhule', names: ['dhule', 'धुळे'] },
  { id: 'Gadchiroli', names: ['gadchiroli', 'गडचिरोली'] },
  { id: 'Gondia', names: ['gondia', 'गोंदिया'] },
  { id: 'Hingoli', names: ['hingoli', 'हिंगोली'] },
  { id: 'Jalgaon', names: ['jalgaon', 'जळगाव'] },
  { id: 'Jalna', names: ['jalna', 'जालना'] },
  { id: 'Kolhapur', names: ['kolhapur', 'कोल्हापूर'] },
  { id: 'Latur', names: ['latur', 'लातूर'] },
  { id: 'Mumbai City', names: ['mumbai city', 'मुंबई'] },
  { id: 'Mumbai Suburban', names: ['mumbai suburban', 'मुंबई उपनगर'] },
  { id: 'Nagpur', names: ['nagpur', 'नागपुर', 'नागपूर'] },
  { id: 'Nanded', names: ['nanded', 'नांदेड'] },
  { id: 'Nandurbar', names: ['nandurbar', 'नंदुरबार'] },
  { id: 'Nashik', names: ['nashik', 'नाशिक'] },
  { id: 'Osmanabad', names: ['osmanabad', 'dharashiv', 'उस्मानाबाद', 'धाराशिव'] },
  { id: 'Palghar', names: ['palghar', 'पालघर'] },
  { id: 'Parbhani', names: ['parbhani', 'परभणी'] },
  { id: 'Pune', names: ['pune', 'पुणे'] },
  { id: 'Raigad', names: ['raigad', 'रायगड'] },
  { id: 'Ratnagiri', names: ['ratnagiri', 'रत्नागिरी'] },
  { id: 'Sangli', names: ['sangli', 'सांगली'] },
  { id: 'Satara', names: ['satara', 'सातारा'] },
  { id: 'Sindhudurg', names: ['sindhudurg', 'सिंधुदुर्ग'] },
  { id: 'Solapur', names: ['solapur', 'सोलापूर'] },
  { id: 'Thane', names: ['thane', 'ठाणे'] },
  { id: 'Wardha', names: ['wardha', 'वर्धा'] },
  { id: 'Washim', names: ['washim', 'वाशिम'] },
  { id: 'Yavatmal', names: ['yavatmal', 'यवतमाळ'] },
]