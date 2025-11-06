import { ref } from 'vue'
import axios from 'axios'

export interface Donation {
    donation_id: number
    user_id: number
    clothing_name: string
    donation_status: string
    donation_size: string | null
    donation_quality: string | null
    donation_gender: string | null
}

export function useDonations() {
    const donations = ref<Donation[]>([])
    const error = ref<string | null>(null)
    const loading = ref(false)

    const fetchDonations = async () => {
        try {
            loading.value = true
            error.value = null
            const res = await axios.get('/api/donations')
            donations.value = Array.isArray(res.data) ? res.data : []
        } catch (err: any) {
            error.value = err?.message ?? String(err)
        } finally {
            loading.value = false
        }
    }

    const addDonation = async (newDonation: Partial<Donation>) => {
        try {
                    const res = await axios.post('/api/donations', newDonation)
                    donations.value.push(res.data)
                    return res.data
        } catch (err: any) {
                    error.value = err?.message ?? String(err)
            throw err
        }
    }

    const deleteDonation = async (donation_id: number) => {
        try {
            await axios.delete(`/api/donations/${donation_id}`)
            donations.value = donations.value.filter(d => d.donation_id !== donation_id)
        } catch (err: any) {
            error.value = err?.message ?? String(err)
            throw err
        }
    }

    return {
        donations,
        error,
        loading,
        fetchDonations,
        addDonation,
        deleteDonation
    }
}
