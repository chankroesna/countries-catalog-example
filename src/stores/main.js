import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import axios from 'axios'

export const useMainStore = defineStore('main', () => {
  const userName = ref('John Doe')
  const userEmail = ref('doe.doe.doe@example.com')

  const Avatar = computed(
    () =>
      `https://api.dicebear.com/7.x/avataaars/svg?seed=${userEmail.value.replace(
        /[^a-z0-9]+/gi,
        '-'
      )}`
  )

  const isFieldFocusRegistered = ref(false)

  const countries = ref([])
  const clients = ref([])
  const history = ref([])

  function setUser(payload) {
    if (payload.name) {
      userName.value = payload.name
    }
    if (payload.email) {
      userEmail.value = payload.email
    }
  }

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

  function fetchSampleClients() {
    axios
      .get(`https://justboil.github.io/admin-one-vue-tailwind/data-sources/clients.json?v=3`)
      .then((result) => {
        clients.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  function fetchSampleHistory() {
    axios
      .get(`https://justboil.github.io/admin-one-vue-tailwind/data-sources/history.json?v=3`)
      .then((result) => {
        history.value = result?.data?.data
      })
      .catch((error) => {
        alert(error.message)
      })
  }

  return {
    userName,
    userEmail,
    Avatar,
    isFieldFocusRegistered,
    countries,
    clients,
    history,
    setUser,
    fetchCountries,
    fetchSampleClients,
    fetchSampleHistory
  }
})
