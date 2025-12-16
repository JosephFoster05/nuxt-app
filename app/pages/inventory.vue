<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import { useRouter } from 'vue-router'

type InventoryRow = {
	Inventory_ID: number
	Item_ID: number
	availablilty: string
	Location: string
}

const rows = ref<InventoryRow[] | null>(null)
const loading = ref(false)
const error = ref<string | null>(null)
const router = useRouter()

// distribution centers map same as catalog: name -> address
const distribution_centers: Record<string, string> = {
	North: '123 North St',
	South: '456 South St',
	East: '789 East St',
	West: '101 West St',
}
const addressToName = Object.fromEntries(Object.entries(distribution_centers).map(([k,v]) => [v,k])) as Record<string,string>

const grouped = computed(() => {
	const out = new Map<string, InventoryRow[]>()
	if (!rows.value) return out
	for (const r of rows.value) {
		const key = r.Location || 'Unknown'
		if (!out.has(key)) out.set(key, [])
		out.get(key)!.push(r)
	}
	return out
})

async function fetchInventory() {
	loading.value = true
	error.value = null
	try {
		const res = await fetch('/api/inventory')
		if (!res.ok) throw new Error(await res.text())
		rows.value = await res.json()
	} catch (err: any) {
		error.value = String(err?.message || err)
	} finally {
		loading.value = false
	}
}

onMounted(() => {
	fetchInventory()
})

function goToCatalog(itemId: number) {
	router.push({ path: '/catalog', query: { highlight: String(itemId) } })
}
</script>

<template>
	<h1>Inventory</h1>

	<section id="inventory-list">
		<div v-if="loading">Loading inventory…</div>
		<div v-else-if="error">Error: {{ error }}</div>
		<div v-else-if="rows && rows.length === 0">No inventory items.</div>

		<div v-else>
			<div v-for="(items, addr) in Object.fromEntries(grouped)" :key="addr" class="center-group">
				<h2 class="center-header">{{ addressToName[addr] ?? addr }}</h2>
				<div class="catalog-grid">
					<div
						v-for="r in items"
						:key="r.Inventory_ID"
						class="catalog-card clickable"
						@click="goToCatalog(r.Item_ID)"
					>
						<h3>Inventory #{{ r.Inventory_ID }}</h3>
						<p>Item ID: {{ r.Item_ID }}</p>
						<p>Availability: {{ r.availablilty }}</p>
						<p>Location: {{ r.Location }}</p>
					</div>
				</div>
			</div>
		</div>
	</section>
</template>

<style scoped>
.catalog-grid {
	display: grid;
	grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
	gap: 1rem;
}
.catalog-card {
	border: 1px solid #e1e1e1;
	padding: 0.75rem;
	border-radius: 6px;
	background: #fff;
}
.clickable { cursor: pointer; }
.center-header { margin: 1rem 0 0.5rem; font-size: 1.1rem; }
.center-group { margin-bottom: 1.25rem; }
</style>
