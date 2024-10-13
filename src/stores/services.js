import { ref, onMounted, inject } from 'vue'
import { defineStore } from 'pinia'
import ServiceAPI from '@/api/ServiceAPI'
import router from '@/router'

export const useServicesStore = defineStore('services', () => {
  const toast = inject('toast')
  const services = ref([])

  onMounted(async () => {
    try {
      await getServices()
    } catch (error) {
      console.log(error)
    }
  })

  async function getServices() {
    const { data } = await ServiceAPI.all()
    services.value = data
  }

  async function saveService(formData) {
    try {
      const { data } = await ServiceAPI.create(formData)
      toast.open({
        message: data.msg,
        type: 'success'
      })
      await getServices()
      router.push({ name: 'view-services' })
    } catch (error) {
      toast.open({
        message: error.response.data.msg,
        type: 'success'
      })
    }
  }

  async function updateService(id, formData) {
    try {
      const { data } = await ServiceAPI.update(id, formData)
      toast.open({
        message: data.msg,
        type: 'success'
      })
      await getServices()
      router.push({ name: 'view-services' })
    } catch (error) {
      toast.open({
        message: error.response.data.msg,
        type: 'error'
      })
    }
  }

  async function deleteService(id) {
    console.log(id);
    
    try {
      const { data } = await ServiceAPI.delete(id)
      console.log(data, id);
      toast.open({
        message: data.msg,
        type: 'success'
      })
      services.value = services.value.filter((service) => service._id !== id)
    } catch (error) {
      toast.open({
        message: 'El Servicio no se ha podido eliminar, intente mas tarde',
        type: 'error'
      })
    }
  }

  return {
    services,
    saveService,
    updateService,
    deleteService
  }
})
