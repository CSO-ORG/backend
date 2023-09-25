export interface WorkerData {
  pageToFetchs: number[]
  workerName: string
  name: string
  code: string
  animal: 'chien' | 'chat'
  date?: string
}

export interface PetAlertJSON {
  results: Results
}

export interface Results {
  itemsReceived: number
  curPage: number
  nextPage: number | null
  prevPage: number | null
  offset: number
  itemsTotal: number
  pageTotal: number
  items: PetAlertData[]
}

export interface PetAlertData {
  id: number
  isCompleted: null
  whatMissing: null
  Alert_type: number
  department_id: string
  boFixed: null
  isPaid: number
  isSharedOnFb: number
  isFound: null
  archive: null
  isDeleted: null
  date: number
  datePublished: number
  dateCreated: number
  message: null | string
  postOnFb: string
  boostDate: null
  boostId: number | null
  boost_status: null
  payment_date: number | null
  payment_id: null
  country: Country
  coords_lat: number
  coords_lng: number
  contact_email: string
  contact_facebook: null | string
  contact_phone: string
  archiveDate: null
  foundBy: null
  foundDate: null
  foundMessage: null
  shareBy: null | string
  shareDate: number | null
  takenBy: null | string
  takenDate: number | null
  deletedBy: null
  deletedDate: null
  source: number
  fromEmail: null
  messageFb: null
  plannedDate: number | null
  publifb_description: null
  state: null
  offerId: number
  animal_id: string
  animal_name: string
  animal_photo: string
  animal_birthday: null
  animal_isAlive: null
  animal_isCrossed: number
  animal_isMine: null
  animal_isIdentified: null
  animal_surgery: number
  animal_puce: AnimalPuce
  animal_tatouage: number
  animal_hasCollar: number
  animal_collarColor: number | null
  animal_collarType: number | null
  animal_collarKind: number | null
  county: string
  tab_option: number
  department_text: null
  address_formatted_address: string
  address_city: string
  address_city_nom: string
  address_city_code: string
  address_city_CP: string
  address_city_codeDepartment: string
  address_street: string
  address_precision: null
  isBoosted: number | null
  address_state: null
  address_country: null
  _id: string
  userId: string | null
  department: Department
  payment_status: AnimalCollarcolor[]
  animal_sex: AnimalCollarcolor
  animal_race: AnimalRace[]
  animal_espece: AnimalEspece[]
  animal_hair: Animal
  animal_size: Animal
  animal_silhouette: Animal
  animal_color1: AnimalColor[]
  animal_color2: AnimalColor[]
  animal_color3: AnimalColor[]
  animal_collarcolor?: AnimalCollarcolor
  animal_collarkind?: AnimalCollarcolor
  animal_collartype?: AnimalCollarcolor
}

export interface AnimalCollarcolor {
  id: number
  name: string
  value: number
  En: string
  Fr: string
  Es: string
  De: string
  created_at: number
}

export interface AnimalColor {
  id: number
  value: number
  En: string
  Fr: string
  Es: string
  De: string
  created_at: number
  is_for_cat: boolean
  is_for_dog: boolean
  is_for_autre: boolean
}

export interface AnimalEspece {
  code: number
  fr: FrEnumCat | FrEnumDog
  en: EnEnumCat | EnEnumDog
  es: EsEnumCat | EsEnumDog
  de: DeEnumCat | DeEnumDog
}

export enum DeEnumCat {
  Kat = 'Kat',
}

export enum EnEnumCat {
  Cat = 'Cat',
}

export enum EsEnumCat {
  Gato = 'Gato',
}

export enum FrEnumCat {
  Chat = 'Chat',
}

export enum DeEnumDog {
  Hond = 'Hond',
}

export enum EnEnumDog {
  Dog = 'Dog',
}

export enum EsEnumDog {
  Perra = 'Perra',
}

export enum FrEnumDog {
  Chien = 'Chien',
}

export interface Animal {
  id: number
  name: string
  value: number
  En: AnimalHairEn
  Fr: string
  fr_feminine: string
  Es: string
  es_feminine: string
  De: string
  de_feminine: DeFeminine
  created_at: number
  order_es?: number
  Order_value?: number
}

export enum AnimalHairEn {
  Long = 'Long',
  Medium = 'Medium',
  Normal = 'Normal',
  Plump = 'Plump',
  Short = 'Short',
  Small = 'Small',
  Thin = 'Thin',
}

export enum DeFeminine {
  Empty = '',
  Halflang = 'Halflang',
  Klein = 'Klein',
  Kort = 'Kort',
  Lang = 'Lang',
  Medium = 'Medium',
}

export enum AnimalPuce {
  NON = 'Non',
  OUI = 'Oui',
}

export interface AnimalRace {
  id: number
  especeId: number
  _id: ID
  name: NameEnum
  Fr: NameEnum
  En: AnimalRaceEn
  Es: EsEnum
  De: DeEnum
  Fur: boolean
  Order: string
  Specie: FrEnumCat | FrEnumDog
  Creation_date: number
}

export enum DeEnum {
  Europese = 'Europese',
  GeenIdee = 'Geen Idee',
  Siamees = 'Siamees',
}

export enum AnimalRaceEn {
  European = 'European',
  IDonTKnow = "I don't know",
  Siamese = 'Siamese',
}

export enum EsEnum {
  Europeo = 'Europeo',
  NoSé = 'No sé',
  Siamés = 'Siamés',
}

export enum NameEnum {
  Européen = 'Européen',
  JeNeSaisPas = 'Je ne sais pas',
  Siamois = 'Siamois',
}

export enum ID {
  Empty = '',
  The5Ae199B042E0Fb002Df9C86C = '5ae199b042e0fb002df9c86c',
  The5Ae199B09322C0001580C835 = '5ae199b09322c0001580c835',
}

export enum Country {
  Fra = 'FRA',
}

export interface Department {
  id: number
  CP: string
  SEO: SEO
  Slug: Slug
}

export enum SEO {
  CharenteMaritime17 = 'Charente-Maritime (17)',
}

export enum Slug {
  PetAlert17CharenteMaritime = 'pet-alert-17-charente-maritime',
}
