export interface VietNamProvince {
  province_id: number
  province_name: string
  province_type: string
}

export interface VietNamProvinceList {
  results: VietNamProvince[]
}

export interface VietNamDistrict {
  district_id: number
  district_name: string
}

export interface VietNamDistricList {
  results: VietNamDistrict[]
}

export interface VietNamWard {
  district_id: number
  ward_id: string
  ward_name: string
  ward_type: string
}

export interface VietNamWardList {
  results: VietNamWard[]
}

export interface AutoCompleteAddress {
  country: string
  country_code: string
  city: string
  lon: number
  lat: number
  population: number
  result_type: string
  formatted: string
  address_line1: string
  address_line2: string
  category: string
  timezone: {
    name: string
    offset_STD: string
    offset_STD_seconds: number
    offset_DST: string
    offset_DST_seconds: number
  }
  plus_code: string
  rank: {
    confidence: number
    confidence_city_level: number
    match_type: string
  }
  place_id: string
  bbox: {
    lon1: number
    lat1: number
    lon2: number
    lat2: number
  }
}

export interface AutoCompleteAddressList {
  results: AutoCompleteAddress[]
}
