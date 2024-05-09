import { config } from 'src/constants/config'
import { AutoCompleteAddressList } from 'src/types/location.type'
import { SuccessResponse } from 'src/types/utils.type'
import http from 'src/utils/http'

const URL = 'location'

const mapApi = {
  getAddressAutoComplete(text: string) {
    return http.get<SuccessResponse<AutoCompleteAddressList>>(`${config.baseUrl}${URL}/get-address-autocomplete`, {
      params: {
        search_text: text
      }
    })
  }
}

export default mapApi
