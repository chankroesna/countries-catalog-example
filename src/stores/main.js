import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useMainStore = defineStore('main', () => {

  const countries = ref([])

  function fetchCountries() {
    axios
      .get(`https://restcountries.com/v3.1/all?fields=name,flags,cca2,cca3,altSpellings,idd`)
      .then((result) => {
        countries.value = result?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return {
    countries,
    fetchCountries,
  }
})
