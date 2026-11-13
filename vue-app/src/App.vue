<script setup lang="ts">
import { computed, ref } from 'vue'
import ScriptureMap from './components/ScriptureMap.vue'
import { passages, connections } from './data/scriptures'
const search = ref('')
const theme = ref('')
const selectedId = ref<string | null>(passages[0]?.id ?? null)
const themes = [...new Set(passages.map(p => p.theme))].sort()
const filtered = computed(() => passages.filter(p => (!theme.value || p.theme === theme.value) && (!search.value || (p.reference + ' ' + p.summary).toLowerCase().includes(search.value.toLowerCase()))))
const selected = computed(() => passages.find(p => p.id === selectedId.value))
const filteredConnections = computed(() => connections.filter(c => filtered.value.some(p=>p.id===c.from) && filtered.value.some(p=>p.id===c.to)))
</script>
<template>
<header><div class="container"><p class="eyebrow">Vue 3 development branch</p><h1>Trinity Atlas</h1><p>Research and explore biblical cross-references.</p></div></header>
<main class="container"><div class="filters"><input v-model="search" type="search" aria-label="Search passages" placeholder="Search references and topics"><select v-model="theme" aria-label="Filter by theme"><option value="">All themes</option><option v-for="t in themes" :key="t">{{ t }}</option></select></div>
<div class="layout"><ScriptureMap :passages="filtered" :connections="filteredConnections" :selected-id="selectedId" @select="selectedId=$event"/><aside class="panel"><h2>{{ selected?.reference ?? 'Select a passage' }}</h2><p>{{ selected?.summary }}</p><p class="eyebrow">{{ selected?.theme }}</p><a v-if="selected" :href="`https://www.biblegateway.com/passage/?search=${encodeURIComponent(selected.reference)}`" target="_blank" rel="noopener noreferrer">Read passage</a></aside></div>
<section class="panel"><h2>Passage index</h2><p>{{ filtered.length }} passages</p><div class="index"><button v-for="p in filtered" :key="p.id" @click="selectedId=p.id"><strong>{{ p.reference }}</strong><span>{{ p.summary }}</span></button></div></section>
<p class="note">This is an isolated frontend refactor with sample research data. The existing live prototype remains on main.</p></main>
</template>
