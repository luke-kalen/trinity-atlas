<script setup lang="ts">
import { computed, onBeforeUnmount, onMounted, ref, watch } from 'vue'
import type { Connection, Passage, Theme } from '../data/scriptures'
import { galaxyNames } from '../data/scriptures'
const props = defineProps<{passages:Passage[];connections:Connection[];selectedId:string|null}>()
const emit = defineEmits<{select:[id:string]}>()
const themes:Theme[]=['Son','Spirit','Distinction','Monotheism','Triadic']
const palette:Record<Theme,string>={Son:'#f4b860',Spirit:'#a58dff',Distinction:'#69cde4',Monotheism:'#f17fa9',Triadic:'#6fdda9'}
const centers:Record<Theme,{x:number;y:number}>={Son:{x:325,y:220},Spirit:{x:930,y:240},Distinction:{x:635,y:550},Monotheism:{x:245,y:765},Triadic:{x:1035,y:795}}
const radius=170
const view={width:1280,height:1020}
const svg=ref<SVGSVGElement|null>(null)
const camera=ref({x:0,y:0,z:.72})
const activeGalaxy=ref<Theme|null>(null)
const showLabels=ref(false)
const motion=ref(true)
const tick=ref(0)
const reduceMotion=ref(false)
let raf=0,previousTime=0
const pointers=new Map<number,{x:number;y:number}>()
let gesture:{x:number;y:number;d:number}|null=null
let moved=false,downPosition:{x:number;y:number}|null=null
const visibleThemes=computed(()=>themes.filter(t=>props.passages.some(p=>p.theme===t)))
const coords=computed(()=>{const m=new Map<string,{x:number;y:number}>();for(const theme of themes){const group=props.passages.filter(p=>p.theme===theme);group.forEach((p,i)=>{const angle=(i/group.length)*Math.PI*2-.6;const ring=group.length<=3?78:95+(i%3)*22;const drift=motion.value&&!reduceMotion.value?Math.sin(tick.value*.35+i*1.9+themes.indexOf(theme)) * 6:0;m.set(p.id,{x:centers[theme].x+Math.cos(angle)*(ring+drift),y:centers[theme].y+Math.sin(angle)*(ring+drift)})})}return m})
const selected=computed(()=>props.passages.find(p=>p.id===props.selectedId))
const highlighted=computed(()=>new Set(props.connections.filter(c=>c.from===props.selectedId||c.to===props.selectedId).flatMap(c=>[c.from,c.to])))
const visibleConnections=computed(()=>props.connections.flatMap(c=>{const a=coords.value.get(c.from),b=coords.value.get(c.to);return a&&b?[{...c,a,b}]:[]}))
function toMap(clientX:number,clientY:number){const r=svg.value!.getBoundingClientRect();return{x:(clientX-r.left)*view.width/r.width,y:(clientY-r.top)*view.height/r.height}}
function zoomAt(z:number,clientX:number,clientY:number){const target=Math.max(.38,Math.min(3.8,z));const p=toMap(clientX,clientY),ratio=target/camera.value.z;camera.value={x:p.x-(p.x-camera.value.x)*ratio,y:p.y-(p.y-camera.value.y)*ratio,z:target}}
function centerOn(x:number,y:number,z:number){const next=Math.max(.38,Math.min(3.8,z));camera.value={x:view.width/2-x*next,y:view.height/2-y*next,z:next}}
function fit(){activeGalaxy.value=null;centerOn(640,510,.72)}
function visit(theme:Theme){activeGalaxy.value=theme;centerOn(centers[theme].x,centers[theme].y,1.65)}
function focusPassage(id:string){emit('select',id);const p=coords.value.get(id);if(p)centerOn(p.x,p.y,2.1)}
function zoomButton(factor:number){const r=svg.value!.getBoundingClientRect();zoomAt(camera.value.z*factor,r.left+r.width/2,r.top+r.height/2)}
function wheel(e:WheelEvent){zoomAt(camera.value.z*Math.exp(-e.deltaY*.0013),e.clientX,e.clientY)}
function point(){const a=[...pointers.values()];return{x:a.reduce((s,p)=>s+p.x,0)/a.length,y:a.reduce((s,p)=>s+p.y,0)/a.length,d:a.length>1?Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y):0}}
function down(e:PointerEvent){svg.value?.setPointerCapture(e.pointerId);pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});gesture=point();downPosition={x:e.clientX,y:e.clientY};moved=false}
function move(e:PointerEvent){if(!pointers.has(e.pointerId))return;pointers.set(e.pointerId,{x:e.clientX,y:e.clientY});const next=point();if(gesture){const r=svg.value!.getBoundingClientRect();camera.value={...camera.value,x:camera.value.x+(next.x-gesture.x)*view.width/r.width,y:camera.value.y+(next.y-gesture.y)*view.height/r.height};if(pointers.size>=2&&gesture.d>0)zoomAt(camera.value.z*next.d/gesture.d,next.x,next.y)}if(downPosition&&Math.hypot(e.clientX-downPosition.x,e.clientY-downPosition.y)>7)moved=true;gesture=next}
function up(e:PointerEvent){pointers.delete(e.pointerId);gesture=pointers.size?point():null}
function selectNode(e:MouseEvent,id:string){if(!moved)focusPassage(id);e.stopPropagation()}
function selectGalaxy(e:MouseEvent,theme:Theme){if(!moved)visit(theme);e.stopPropagation()}
function animate(time:number){if(motion.value&&!reduceMotion.value&&time-previousTime>45){tick.value=time/1000;previousTime=time}raf=requestAnimationFrame(animate)}
watch(()=>props.passages,()=>{if(activeGalaxy.value&&!props.passages.some(p=>p.theme===activeGalaxy.value))fit()})
onMounted(()=>{reduceMotion.value=window.matchMedia('(prefers-reduced-motion: reduce)').matches;fit();raf=requestAnimationFrame(animate)})
onBeforeUnmount(()=>cancelAnimationFrame(raf))
function lineColor(kind:Connection['kind']){return kind==='Direct quotation'?'#f5c979':kind==='Shared divine title'?'#ed92c2':kind==='Interpretive parallel'?'#a4b4ff':'#76c9d6'}
</script>
<template>
<section class="universe" aria-label="Interactive Scripture universe">
  <div class="universe-top"><div><span class="eyebrow">Scripture Universe</span><p>Explore connected galaxies of biblical evidence</p></div><div class="map-controls"><button type="button" @click="zoomButton(1.3)" aria-label="Zoom in">+</button><button type="button" @click="zoomButton(1/1.3)" aria-label="Zoom out">−</button><button type="button" @click="fit">All galaxies</button></div></div>
  <div class="galaxy-tabs"><button v-for="t in visibleThemes" :key="t" type="button" :class="{chosen:activeGalaxy===t}" :style="{'--galaxy-color':palette[t]}" @click="visit(t)"><span class="galaxy-dot"></span>{{galaxyNames[t]}}</button></div>
  <svg ref="svg" viewBox="0 0 1280 1020" role="img" aria-label="Interactive galaxy map. Use buttons to navigate or drag and pinch the map." @wheel.prevent="wheel" @pointerdown="down" @pointermove="move" @pointerup="up" @pointercancel="up" @lostpointercapture="up">
    <defs><radialGradient id="spaceGlow"><stop offset="0%" stop-color="#243c65"/><stop offset="100%" stop-color="#091322"/></radialGradient><filter id="bubbleGlow" x="-100%" y="-100%" width="300%" height="300%"><feGaussianBlur stdDeviation="9"/></filter></defs>
    <rect width="1280" height="1020" fill="url(#spaceGlow)"/>
    <g class="camera" :transform="`translate(${camera.x} ${camera.y}) scale(${camera.z})`">
      <g v-for="t in visibleThemes" :key="'galaxy-'+t" class="galaxy" @click="selectGalaxy($event,t)">
        <circle :cx="centers[t].x" :cy="centers[t].y" :r="radius" :fill="palette[t]" fill-opacity=".075" :stroke="palette[t]" stroke-opacity=".35" stroke-dasharray="5 9"/>
        <circle :cx="centers[t].x" :cy="centers[t].y" r="92" :fill="palette[t]" fill-opacity=".09" filter="url(#bubbleGlow)"/>
        <text :x="centers[t].x" :y="centers[t].y-183" text-anchor="middle" class="galaxy-name" :fill="palette[t]">{{galaxyNames[t]}}</text>
      </g>
      <g v-for="c in visibleConnections" :key="c.from+'-'+c.to" :opacity="selectedId && !(c.from===selectedId||c.to===selectedId)?0.14:0.85">
        <line :x1="c.a.x" :y1="c.a.y" :x2="c.b.x" :y2="c.b.y" :stroke="lineColor(c.kind)" :stroke-width="c.from===selectedId||c.to===selectedId?3.5:1.5" :stroke-dasharray="c.kind==='Interpretive parallel'?'6 5':undefined"/>
      </g>
      <g v-for="p in passages" :key="p.id" class="verse-bubble" :class="{dim:selectedId&&p.id!==selectedId&&!highlighted.has(p.id)}" :transform="`translate(${coords.get(p.id)?.x??0} ${coords.get(p.id)?.y??0})`" @click="selectNode($event,p.id)">
        <circle r="25" :fill="palette[p.theme]" opacity=".13"/>
        <circle r="14" :fill="palette[p.theme]" :stroke="selectedId===p.id?'#fff':'#c9def4'" :stroke-width="selectedId===p.id?3:1.2"/>
        <circle v-if="selectedId===p.id" r="31" fill="none" stroke="#fff" stroke-opacity=".7" stroke-width="2"/>
        <text v-if="showLabels||camera.z>1.1||selectedId===p.id||highlighted.has(p.id)" y="37" text-anchor="middle" class="verse-label">{{p.reference}}</text>
        <title>{{p.reference}} — {{p.summary}}</title>
      </g>
    </g>
  </svg>
  <div class="universe-bottom"><span>{{passages.length}} passages · {{visibleConnections.length}} connections</span><div><label><input v-model="showLabels" type="checkbox"> Labels</label><label><input v-model="motion" type="checkbox"> Motion</label></div></div>
</section>
</template>
