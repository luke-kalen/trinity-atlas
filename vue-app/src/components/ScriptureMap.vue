<script setup lang="ts">
import { computed, ref } from 'vue'
import type { Passage, Connection } from '../data/scriptures'
const props = defineProps<{ passages: Passage[]; connections: Connection[]; selectedId: string | null }>()
const emit = defineEmits<{ select: [id: string] }>()
const scale = ref(1)
const offset = ref({ x: 0, y: 0 })
const pointers = new Map<number, { x: number; y: number }>()
const svg = ref<SVGSVGElement | null>(null)
let previous: { x: number; y: number; distance: number } | null = null
const positions = computed(() => new Map(props.passages.map((p, i) => { const a = i * Math.PI * 2 / Math.max(1, props.passages.length); return [p.id, { x: 400 + Math.cos(a) * 155, y: 230 + Math.sin(a) * 155 }] as const })))
const lines = computed(() => props.connections.flatMap(c => { const a = positions.value.get(c.from), b = positions.value.get(c.to); return a && b ? [{ ...c, a, b }] : [] }))
function local(clientX: number, clientY: number) { const r = svg.value!.getBoundingClientRect(); return { x: (clientX - r.left) * 800 / r.width, y: (clientY - r.top) * 460 / r.height } }
function zoomAt(next: number, x: number, y: number) { const target = Math.max(.5, Math.min(5, next)); const p = local(x, y); const factor = target / scale.value; offset.value = { x: p.x - (p.x - offset.value.x) * factor, y: p.y - (p.y - offset.value.y) * factor }; scale.value = target }
function centerZoom(factor: number) { const r = svg.value!.getBoundingClientRect(); zoomAt(scale.value * factor, r.left + r.width / 2, r.top + r.height / 2) }
function fit() { scale.value = 1; offset.value = { x: 0, y: 0 } }
function wheel(e: WheelEvent) { e.preventDefault(); zoomAt(scale.value * Math.exp(-e.deltaY * .0015), e.clientX, e.clientY) }
function gesture() { const ps = [...pointers.values()]; const x = ps.reduce((sum,p)=>sum+p.x,0)/ps.length; const y = ps.reduce((sum,p)=>sum+p.y,0)/ps.length; const distance = ps.length >= 2 ? Math.hypot(ps[0].x-ps[1].x,ps[0].y-ps[1].y) : 0; return { x, y, distance } }
function down(e: PointerEvent) { svg.value?.setPointerCapture(e.pointerId); pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); previous=gesture() }
function move(e: PointerEvent) { if (!pointers.has(e.pointerId)) return; pointers.set(e.pointerId,{x:e.clientX,y:e.clientY}); const now=gesture(); if(previous){ const r=svg.value!.getBoundingClientRect(); offset.value={x:offset.value.x+(now.x-previous.x)*800/r.width,y:offset.value.y+(now.y-previous.y)*460/r.height}; if(pointers.size>=2&&previous.distance>0)zoomAt(scale.value*now.distance/previous.distance,now.x,now.y) } previous=now }
function up(e: PointerEvent) { pointers.delete(e.pointerId); previous=pointers.size?gesture():null }
</script>
<template>
<section class="map-panel" aria-label="Interactive Scripture map">
  <div class="map-controls"><button @click="centerZoom(1.3)" aria-label="Zoom in">+</button><button @click="centerZoom(1/1.3)" aria-label="Zoom out">−</button><button @click="fit">Fit to screen</button></div>
  <svg ref="svg" viewBox="0 0 800 460" @wheel.prevent="wheel" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up" @lostpointercapture="up">
    <g :transform="`translate(${offset.x} ${offset.y}) scale(${scale})`">
      <line v-for="c in lines" :key="`${c.from}-${c.to}`" :x1="c.a.x" :y1="c.a.y" :x2="c.b.x" :y2="c.b.y" stroke="#7bb7e4" stroke-width="2"/>
      <g v-for="p in passages" :key="p.id" class="node" :transform="`translate(${positions.get(p.id)?.x} ${positions.get(p.id)?.y})`" @click.stop="emit('select',p.id)">
        <circle :r="selectedId===p.id?13:10" :fill="selectedId===p.id?'#ffd16c':'#66a8e4'" stroke="#fff"/><text x="15" y="-12">{{ p.reference }}</text>
      </g>
    </g>
  </svg>
</section>
</template>
