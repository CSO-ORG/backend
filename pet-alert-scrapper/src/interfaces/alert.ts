import { ILOCATION } from '@cso-org/shared'

export interface Alert {
  publisherId?: string | null
  publisherPhoneNumber?: string | null
  publisherEmail?: string | null
  isFromAppUser?: boolean | null
  name?: string | null
  description?: string | null
  status?: string | null
  alertType?: string | null
  icadIdentifier?: string | null
  petType?: string | null
  specie?: string | null
  age?: number | null
  ageExpressedIn?: string | null
  sex?: string | null
  breed?: string | null
  height?: string | null
  weight?: string | null
  hair?: string | null
  colors?: string[] | null
  imageUrls?: string[] | null
  hasTatoo?: boolean | null
  hasNecklace?: boolean | null
  necklaceMaterial?: string | null
  necklaceColor?: string | null
  hasMicrochip?: boolean | null
  isSterilized?: boolean | null
  location?: ILOCATION | null
  date?: Date | null
}
