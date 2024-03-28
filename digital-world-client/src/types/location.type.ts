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
