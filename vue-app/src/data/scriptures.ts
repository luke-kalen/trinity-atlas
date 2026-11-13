export type Theme = 'Son' | 'Spirit' | 'Distinction' | 'Monotheism' | 'Triadic'
export interface Passage { id: string; reference: string; summary: string; theme: Theme }
export interface Connection { from: string; to: string; kind: 'Direct quotation' | 'Shared divine title' | 'Thematic parallel' | 'Interpretive parallel' }
export const galaxyNames: Record<Theme,string> = { Son:'Deity of Christ', Spirit:'The Holy Spirit', Distinction:'Distinct Persons', Monotheism:'One God', Triadic:'Threefold Witness' }
export const passages: Passage[] = [
  {id:'john-1-1',reference:'John 1:1–3',summary:'The Word was God and all things were made through him',theme:'Son'},
  {id:'heb-1-8',reference:'Hebrews 1:8–12',summary:'The Son is addressed as God and Creator',theme:'Son'},
  {id:'phil-2-10',reference:'Philippians 2:9–11',summary:'Every knee bows at the name of Jesus',theme:'Son'},
  {id:'john-12-41',reference:'John 12:37–41',summary:'Isaiah saw his glory',theme:'Son'},
  {id:'rev-1-17',reference:'Revelation 1:17–18',summary:'Jesus is the First and the Last',theme:'Son'},
  {id:'rom-10-13',reference:'Romans 10:9–13',summary:'Joel’s call on YHWH applied to Jesus',theme:'Son'},
  {id:'acts-5-3',reference:'Acts 5:3–4',summary:'Lying to the Spirit and to God',theme:'Spirit'},
  {id:'gen-1-2',reference:'Genesis 1:2',summary:'The Spirit of God over the waters',theme:'Spirit'},
  {id:'acts-13-2',reference:'Acts 13:2',summary:'The Holy Spirit speaks and commissions',theme:'Spirit'},
  {id:'heb-3-7',reference:'Hebrews 3:7–11',summary:'The Holy Spirit speaks the words of Psalm 95',theme:'Spirit'},
  {id:'ps-95-7',reference:'Psalm 95:7–11',summary:'The voice of YHWH in the wilderness',theme:'Spirit'},
  {id:'ps-110-1',reference:'Psalm 110:1',summary:'YHWH says to my Lord',theme:'Distinction'},
  {id:'john-17-5',reference:'John 17:5',summary:'The Son speaks of glory with the Father before creation',theme:'Distinction'},
  {id:'dan-7-13',reference:'Daniel 7:13–14',summary:'The Son of Man approaches the Ancient of Days',theme:'Distinction'},
  {id:'gen-19-24',reference:'Genesis 19:24',summary:'YHWH rains sulfur from YHWH out of heaven',theme:'Distinction'},
  {id:'deut-6-4',reference:'Deuteronomy 6:4',summary:'YHWH our God is one',theme:'Monotheism'},
  {id:'isa-44-6',reference:'Isaiah 44:6',summary:'YHWH is the First and the Last',theme:'Monotheism'},
  {id:'isa-45-23',reference:'Isaiah 45:23',summary:'To YHWH every knee will bow',theme:'Monotheism'},
  {id:'joel-2-32',reference:'Joel 2:32',summary:'Everyone who calls on YHWH will be saved',theme:'Monotheism'},
  {id:'ps-102-25',reference:'Psalm 102:25–27',summary:'YHWH is the enduring Creator',theme:'Monotheism'},
  {id:'matt-28-19',reference:'Matthew 28:19',summary:'Baptism in the name of Father, Son, and Holy Spirit',theme:'Triadic'},
  {id:'matt-3-16',reference:'Matthew 3:16–17',summary:'Son baptized, Spirit descends, Father speaks',theme:'Triadic'},
  {id:'2cor-13-14',reference:'2 Corinthians 13:14',summary:'Grace of Jesus, love of God, fellowship of the Spirit',theme:'Triadic'}
]
export const connections: Connection[] = [
  {from:'ps-102-25',to:'heb-1-8',kind:'Direct quotation'},
  {from:'isa-45-23',to:'phil-2-10',kind:'Direct quotation'},
  {from:'joel-2-32',to:'rom-10-13',kind:'Direct quotation'},
  {from:'ps-95-7',to:'heb-3-7',kind:'Direct quotation'},
  {from:'isa-44-6',to:'rev-1-17',kind:'Shared divine title'},
  {from:'john-1-1',to:'heb-1-8',kind:'Thematic parallel'},
  {from:'john-1-1',to:'gen-1-2',kind:'Thematic parallel'},
  {from:'john-17-5',to:'john-1-1',kind:'Thematic parallel'},
  {from:'john-17-5',to:'ps-110-1',kind:'Interpretive parallel'},
  {from:'dan-7-13',to:'ps-110-1',kind:'Interpretive parallel'},
  {from:'matt-3-16',to:'matt-28-19',kind:'Thematic parallel'},
  {from:'matt-28-19',to:'2cor-13-14',kind:'Thematic parallel'},
  {from:'acts-5-3',to:'acts-13-2',kind:'Thematic parallel'},
  {from:'matt-3-16',to:'john-17-5',kind:'Thematic parallel'},
  {from:'matt-3-16',to:'gen-1-2',kind:'Thematic parallel'},
  {from:'matt-28-19',to:'acts-5-3',kind:'Interpretive parallel'},
  {from:'john-12-41',to:'isa-44-6',kind:'Interpretive parallel'},
  {from:'deut-6-4',to:'matt-28-19',kind:'Interpretive parallel'}
]
