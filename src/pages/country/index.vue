<script setup>
import { computed, ref, reactive, watch } from 'vue'
import _ from 'lodash'
import axios from 'axios'
import { useMainStore } from '@/stores/main'
import { mdiMagnify } from '@mdi/js'
import { useFuse } from '@vueuse/integrations/useFuse'
import SectionMain from '@/components/SectionMain.vue'
import CardBox from '@/components/CardBox.vue'
import LayoutGuest from '@/layouts/LayoutGuest.vue'
import SectionTitleLineWithButton from '@/components/SectionTitleLineWithButton.vue'
import BaseIcon from '@/components/BaseIcon.vue'
import CardBoxComponentEmpty from '@/components/CardBoxComponentEmpty.vue'
import CardBoxModal from '@/components/CardBoxModal.vue'
import BaseLevel from '@/components/BaseLevel.vue'
import BaseButtons from '@/components/BaseButtons.vue'
import BaseButton from '@/components/BaseButton.vue'
import Avatar from '@/components/Avatar.vue'

const mainStore = useMainStore()

const countries = computed(() => mainStore.countries)

const isModalActive = ref(false)

const selectedCountry = ref({})

const searchText = ref('')

const perPage = ref(25)

const currentPage = ref(0)

const sortAsc = ref(false)

const sortDesc = ref(false)

const options = {
  fuseOptions: {
      keys: [{ name: 'name.official' }],
      includeScore: true,
      includeMatches: true,
      // threshold: .5
  },
  matchAllWhenSearchEmpty: true
}
  
const { results } = useFuse(searchText, countries, options)

const data = reactive({value: results.value})

watch(results, (newResults) => {
  data.value = newResults
  resetSort()
})

const itemsPaginated = computed(() =>
  data.value.slice(perPage.value * currentPage.value, perPage.value * (currentPage.value + 1))
)

const numPages = computed(() => Math.ceil(data.value.length / perPage.value))

const currentPageHuman = computed(() => currentPage.value + 1)

const pagesList = computed(() => {
  const pagesList = []

  for (let i = 0; i < numPages.value; i++) {
    pagesList.push(i)
  }

  return pagesList
})

const getIDD = (data) => {
  const newArr = []

  data.suffixes.forEach((item) => {
    newArr.push(`${data.root}${item}`)
  })

  return newArr.join(', ')
}

const getNativeName = (data) => {
  const newArr = []

  for (const [key, value] of Object.entries(data)) {
    newArr.indexOf(value.official) === -1 ? newArr.push(value.official): console.log(`${value.official} is duplicate`);
  }

  return newArr.join(', ')
}

const showCountryDetail = (name) => {
  axios
      .get(`https://restcountries.com/v3.1/name/${name}`)
      .then((result) => {
        selectedCountry.value = result?.data[0]
        isModalActive.value = true
      })
      .catch((error) => {
        alert(error.message)
      })
}

const displayCountryDetail = () => {
  const newArr = []
  if (!isObjectEmpty(selectedCountry.value)) {
    newArr.push('<ul class="list-disc pl-4">')

    for (const [key, value] of Object.entries(selectedCountry.value)) {
      const type = (typeof value)

      if (Array.isArray(value)) {
        const item = `<li>${key}: ${value.join(', ')}</li>`
        newArr.push(item)
      } else if (type === 'object') {
        newArr.push(`<li>`)
        newArr.push(`<b>${key}</b>`)
        newArr.push(destructObject(value, 1))
        newArr.push(`</li>`)
      } else {
        const item = `<li>${key}: ${value}</li>`
        newArr.push(item)
      }
    }

    newArr.push('</ul>')

    return newArr.join(' ')
  } else {
    return null
  }
}

const isObjectEmpty = (objectName) => {
  return Object.keys(objectName).length === 0
}

const destructObject = (data, level) => {
  const newArr = []
  newArr.push(`<ul class="list-disc  pl-4">`)
  for (const [key, value] of Object.entries(data)) {
    const type = (typeof value)
    if (type === 'object') {
        newArr.push(`<p><b>${key}</b></p>`)
        newArr.push(destructObject(value, level+1))
      } else {
        const item = `<p>${key}: ${value}</p>`
        newArr.push(item)
      }
  }
  newArr.push('</ul>')
  return newArr.join('')
}

const onSort = () => {
  let order = 'asc'
  if (!sortAsc.value && !sortDesc.value) {
    sortAsc.value = true
  } else if (!sortAsc.value) {
    sortAsc.value = true
    sortDesc.value = false
  } else {
    sortAsc.value = false
    sortDesc.value = true
    order = 'desc'
  }

  const tmp = _.orderBy(results.value, ['item.name.official'], order)
  data.value = tmp
}

const resetSort = () => {
  sortAsc.value = sortDesc.value =  false
}

</script>

<template>
  <LayoutGuest>
      <SectionMain>
      <SectionTitleLineWithButton title="Countries Catalog" main />

      <CardBox>
        <div class="relative">
            <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
              <BaseIcon
                :path="mdiMagnify"
                :size="32"
              />
            </div>
            <input type="search" v-model="searchText" class="block p-4 pl-10 w-full rounded-sm border border-gray-300 focus:ring-blue-700 focus:border-blue-700" placeholder="Country Name">
            <div class="text-red-400 mt-2.5 absolute">
            </div>
        </div>
      </CardBox>

      <CardBox class="mb-6" has-table>
        <CardBoxModal v-model="isModalActive" title="" buttonLabel="Close" button="danger">
          <img
            :src="selectedCountry.flags?.png"
            :alt="selectedCountry.flags?.alt"
            class="block h-auto w-full max-w-full bg-gray-100 shadow-2xl"
          />
          <p><b>{{ selectedCountry.name?.official }}</b></p>
          <div v-html="displayCountryDetail()" class="max-h-64 overflow-y-auto"> </div>
        </CardBoxModal>
      </CardBox>

  <template v-if="results.length > 0 && itemsPaginated.length > 0">
    <CardBox>
      <table>
        <thead>
          <tr>
            <th />
            <th>
              <div class="flex items-center gap-4">
                <a
                  href="#"
                  class="no-underline hover:underline"
                  @click="onSort"
                  >Name</a
                >
                <div class="flex flex-col">
                  <svg
                    class="inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15px"
                    height="15px"
                    viewBox="0 0 15 15"
                    fill="none"
                  >
                    <path d="M7.5 3L15 11H0L7.5 3Z" :fill="sortAsc? 'black':'lightgray'" />
                  </svg>
                  <svg
                    class="inline-block"
                    xmlns="http://www.w3.org/2000/svg"
                    width="15px"
                    height="15px"
                    viewBox="0 0 15 15"
                    fill="none"
                  >
                    <path
                      d="M7.49988 12L-0.00012207 4L14.9999 4L7.49988 12Z"
                      :fill="sortDesc? 'black':'lightgray'"
                    />
                  </svg>
                </div>
              </div>
            </th>
            <th>CCA2</th>
            <th>CCA3</th>
            <th>Native Country Name</th>
            <th>Alternative Country Name</th>
            <th>Country Calling Codes</th>
            <th />
          </tr>
        </thead>
        <tbody>
          <tr v-for="client in itemsPaginated" :key="client.item.name.official">
            <td class="border-b-0 lg:w-6 before:hidden">
              <Avatar :alt="client.item.flags.alt" :url="client.item.flags.png" class="w-full h-auto mx-auto lg:w-12 lg:h-auto" />
            </td>
            <td data-label="Name">
              <a href="#" @click="showCountryDetail(client.item.name.official)" class="hover:text-blue-700">{{ client.item.name.official }}</a>
            </td>
            <td data-label="CCA2">
              {{ client.item.cca2 }}
            </td>
            <td data-label="CCA3">
              {{ client.item.cca3 }}
            </td>
            <td data-label="Native Country Name">
              {{ getNativeName(client.item.name.nativeName) }}
            </td>
            <td data-label="Alternative Country Name">
              {{ client.item.altSpellings.join(', ') }}
            </td>
            <td data-label="Country Calling Codes">
              {{ getIDD(client.item.idd) }}
            </td>
          </tr>
        </tbody>
      </table>

      <div class="p-3 lg:px-6 border-t border-gray-100 dark:border-slate-800">
        <BaseLevel>
          <BaseButtons>
            <BaseButton
              v-for="page in pagesList"
              :key="page"
              :active="page === currentPage"
              :label="page + 1"
              :color="page === currentPage ? 'lightDark' : 'whiteDark'"
              small
              @click="currentPage = page"
            />
          </BaseButtons>
          <small>Page {{ currentPageHuman }} of {{ numPages }}</small>
        </BaseLevel>
      </div>
      </CardBox>
  </template>

    <CardBox v-else>
      <CardBoxComponentEmpty />
    </CardBox>
  </SectionMain>
  </LayoutGuest>
</template>
