export type Theme = 'Son' | 'Spirit' | 'Distinction' | 'Monotheism' | 'Triadic'
export interface Passage { id: string; reference: string; summary: string; theme: Theme }
export interface Connection { from: string; to: string; kind: 'Direct quotation' | 'Shared divine title' | 'Thematic parallel' | 'Interpretive parallel' }
// Starter data for the Vue refactor. The prototype's larger dataset will be migrated and audited separately.
export const passages: Passage[] = [
  { id: 'john-1-1', reference: 'John 1:1–3', summary: 'The Word was God', theme: 'Son' },
  { id: 'matt-28-19', reference: 'Matthew 28:19', summary: 'One name, Father, Son, and Spirit', theme: 'Triadic' },
  { id: 'acts-5-3', reference: 'Acts 5:3–4', summary: 'Lying to the Spirit and to God', theme: 'Spirit' },
  { id: 'deut-6-4', reference: 'Deuteronomy 6:4', summary: 'YHWH is one', theme: 'Monotheism' },
  { id: 'ps-110-1', reference: 'Psalm 110:1', summary: 'YHWH and my Lord', theme: 'Distinction' },
  { id: 'heb-1-8', reference: 'Hebrews 1:8–12', summary: 'The Son addressed as God and Creator', theme: 'Son' },
]
export const connections: Connection[] = [{ from: 'john-1-1', to: 'heb-1-8', kind: 'Thematic parallel' }]
