<script setup lang="ts">
import { computed, ref } from 'vue'
import ScriptureMap from './components/ScriptureMap.vue'
import { passages, connections, galaxyNames } from './data/scriptures'
const search=ref('')
const theme=ref('')
const selectedId=ref<string|null>(null)
const themes=[...new Set(passages.map(p=>p.theme))].sort()
const filtered=computed(()=>passages.filter(p=>(!theme.value||p.theme===theme.value)&&(!search.value||(p.reference+' '+p.summary).toLowerCase().includes(search.value.toLowerCase()))))
const selected=computed(()=>passages.find(p=>p.id===selectedId.value))
const filteredConnections=computed(()=>connections.filter(c=>filtered.value.some(p=>p.id===c.from)&&filtered.value.some(p=>p.id===c.to)))
const related=computed(()=>connections.filter(c=>c.from===selectedId.value||c.to===selectedId.value).map(c=>({kind:c.kind,passage:passages.find(p=>p.id===(c.from===selectedId.value?c.to:c.from))})))
</script>
<template>
<header><div class="container"><p class="eyebrow">Vue 3 · Experimental</p><h1>Trinity Atlas <span class="title-accent">Universe</span></h1><p>Follow the connections. Explore the evidence.</p></div></header>
<main class="container">
  <div class="filters"><input v-model="search" type="search" aria-label="Search passages" placeholder="Find a Scripture or topic…"><select v-model="theme" aria-label="Filter by galaxy"><option value="">All galaxies</option><option v-for="t in themes" :key="t" :value="t">{{galaxyNames[t]}}</option></select><button type="button" @click="search='';theme='';selectedId=null">Clear</button></div>
  <div class="layout"><ScriptureMap :passages="filtered" :connections="filteredConnections" :selected-id="selectedId" @select="selectedId=$event"/>
  <aside class="panel detail-panel"><span class="eyebrow">Passage Explorer</span><template v-if="selected"><h2>{{selected.reference}}</h2><p>{{selected.summary}}</p><p class="eyebrow">{{galaxyNames[selected.theme]}}</p><a :href="`https://www.biblegateway.com/passage/?search=${encodeURIComponent(selected.reference)}`" target="_blank" rel="noopener noreferrer">Read Scripture ↗</a><h3>Connections</h3><button v-for="r in related" :key="r.passage?.id" class="related" @click="selectedId=r.passage?.id??null"><strong>{{r.passage?.reference}}</strong><small>{{r.kind}}</small></button><p v-if="!related.length" class="note">No mapped connections yet.</p></template><template v-else><h2>Choose a bubble</h2><p>Tap a passage to illuminate its connections across the universe.</p><p class="note">Tap a galaxy name to fly into that subject. Pinch to zoom and drag to travel.</p></template></aside></div>
  <section class="panel"><h2>Passage Index</h2><p class="note">{{filtered.length}} passages</p><div class="index"><button v-for="p in filtered" :key="p.id" @click="selectedId=p.id"><strong>{{p.reference}}</strong><span>{{p.summary}}</span></button></div></section>
  <p class="note">Experimental visual prototype with a curated starter dataset. Cross-reference types distinguish quotations from interpretive parallels. The production application remains unchanged.</p>
</main>
</template>
