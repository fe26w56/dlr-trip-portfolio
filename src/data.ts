export type DemoItem = {
  id: string; dayNumber: number; type: 'attraction'|'restaurant'|'show'|'break';
  titleJa: string; titleEn: string; startTime: string; endTime: string;
  location: string; status: 'planned'|'completed'|'skipped'; notes: string;
  attractionId?: string; isLightningLane?: boolean; waitTimeMinutes: number;
};
export const seed: DemoItem[] = [
  {id:'sky',dayNumber:1,type:'attraction',titleJa:'スカイ・ジャーニー',titleEn:'Sky Journey',startTime:'09:00',endTime:'09:40',location:'空のエリア',status:'planned',notes:'最初に行きたい体験。朝のうちに訪れる。',waitTimeMinutes:20},
  {id:'river',dayNumber:1,type:'attraction',titleJa:'リバー・クルーズ',titleEn:'River Cruise',startTime:'10:00',endTime:'10:30',location:'水辺のエリア',status:'planned',notes:'移動の途中で寄りやすい場所。',waitTimeMinutes:15},
  {id:'cafe',dayNumber:1,type:'restaurant',titleJa:'ハーバー・カフェ',titleEn:'Harbor Cafe',startTime:'11:00',endTime:'11:45',location:'水辺のエリア',status:'planned',notes:'混雑する前に昼食をとる。',waitTimeMinutes:10},
  {id:'show',dayNumber:1,type:'show',titleJa:'光のパレード',titleEn:'Parade of Lights',startTime:'13:00',endTime:'13:30',location:'中央広場',status:'planned',notes:'予定を詰め込みすぎず、休憩の余白を残す。',waitTimeMinutes:0},
  {id:'garden',dayNumber:2,type:'attraction',titleJa:'ガーデン・レール',titleEn:'Garden Rail',startTime:'09:30',endTime:'10:00',location:'緑のエリア',status:'planned',notes:'2日目はゆっくり出発。',waitTimeMinutes:10},
  {id:'terrace',dayNumber:2,type:'break',titleJa:'テラスでひと休み',titleEn:'Terrace Break',startTime:'10:15',endTime:'10:45',location:'緑のエリア',status:'planned',notes:'水分補給と休憩。',waitTimeMinutes:0}
];
