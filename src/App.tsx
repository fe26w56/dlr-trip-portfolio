import { useEffect, useRef, useState } from 'react';
import { DayTabs } from './features/trip/DayTabs';
import { ProgressBar } from './features/trip/ProgressBar';
import { NowNextCards } from './features/trip/NowNextCards';
import { ScheduleList } from './features/trip/ScheduleList';
import { BottomNavigation } from './features/trip/BottomNavigation';
import { seed, type DemoItem } from './data';

export function App(){
 const [items,setItems]=useState<DemoItem[]>(()=>structuredClone(seed));
 const [day,setDay]=useState(1),[edit,setEdit]=useState(false);
 const [tab,setTab]=useState<'schedule'|'waitTimes'|'map'|'restaurants'>('schedule');
 const [selected,setSelected]=useState<DemoItem|null>(null),[message,setMessage]=useState('');
 const dialog=useRef<HTMLDialogElement>(null);
 const dayItems=items.filter(x=>x.dayNumber===day),pending=dayItems.filter(x=>x.status==='planned');
 const now=pending[0]??null,next=pending[1]??null;
 useEffect(()=>{if(selected)dialog.current?.showModal();else dialog.current?.close();},[selected]);
 function status(id:string,status:DemoItem['status']){setItems(xs=>xs.map(x=>x.id===id?{...x,status}:x));setSelected(null);setMessage(status==='completed'?'完了しました。次の予定を確認できます。':'予定を更新しました。');}
 function move(id:string,direction:'up'|'down'){
  const i=dayItems.findIndex(x=>x.id===id),j=i+(direction==='up'?-1:1);if(j<0||j>=dayItems.length)return;
  const order=[...dayItems];[order[i],order[j]]=[order[j],order[i]];
  // Move the experience while retaining chronological time slots.
  const ordered=order.map((x,k)=>({...x,startTime:dayItems[k].startTime,endTime:dayItems[k].endTime}));
  setItems(xs=>[...xs.filter(x=>x.dayNumber!==day),...ordered]);
 }
 return <main className="app"><aside className="intro"><h1>旅先で迷う時間を、<br/>楽しむ時間に。</h1><p>DLR Trip Plannerの公開デモです。<br/>旅程と当日の情報を、一つの画面で確認できます。</p><h2>まずは、触ってみてください</h2><ol><li>「完了」で次の予定へ進む</li><li>「編集」で順序やメモを変える</li><li>Day 2や下部タブに切り替える</li></ol><p className="desktop-note">NOW / NEXTで今の行動を絞り、旅程全体はその下に残します。計画の編集と当日の利用を切り替えるUIを、既存実装から抽出しました。</p><button className="plain" onClick={()=>{setItems(structuredClone(seed));setDay(1);setTab('schedule');setEdit(false);setSelected(null);setMessage('最初の状態に戻しました。');}}>デモをリセット</button><p className="muted">施設名・日程・待ち時間はすべて架空です。入力はこの画面のメモリ内だけで扱います。外部APIには接続しません。</p></aside>
 <section className="phone" aria-label="旅行計画デモ"><header><h2>週末のパーク旅行</h2><span className="mode">{edit?'Plan / 編集':'Explore / 当日'}</span></header><div className="notice">公開デモ · 2日間の架空の旅程 · 待ち時間は固定サンプル</div><DayTabs totalDays={2} selectedDay={day} onSelectDay={setDay}/><div aria-live="polite" className="sr-only">{message}</div>
 {tab==='schedule'?<><ProgressBar progress={dayItems.length?Math.round(dayItems.filter(x=>x.status==='completed').length/dayItems.length*100):0} editMode={edit} onToggleEdit={()=>setEdit(x=>!x)}/><NowNextCards nowItem={now} nextItem={next} editMode={edit} onOpenMaps={()=>setTab('map')} onCompleteNow={id=>status(id,'completed')}/><div className="content"><h3 className="font-semibold mb-3">Day {day} の旅程</h3>{!dayItems.length?<p className="empty">予定がありません。リセットで戻せます。</p>:<ScheduleList dayItems={dayItems} nowItem={now} editMode={edit} onSelectItem={setSelected} onMoveItem={move} onEditItem={setSelected} onDeleteItem={id=>{setItems(xs=>xs.filter(x=>x.id!==id));setMessage('予定を削除しました。リセットで戻せます。');}}/>}{!pending.length&&dayItems.length>0&&<p className="empty">今日の予定がすべて終わりました。</p>}</div></>:null}
 {tab==='waitTimes'&&<div className="content"><h3 className="font-semibold">待ち時間</h3><p className="muted">リアルタイム情報ではありません。</p>{seed.filter(x=>x.type==='attraction').map(x=><div className="list-row" key={x.id}><span>{x.titleJa}</span><strong>{x.waitTimeMinutes}分</strong></div>)}</div>}
 {tab==='map'&&<div className="content"><h3 className="font-semibold mb-3">旅程のつながり</h3><div className="map"><ol>{dayItems.map(x=><li key={x.id}>{x.location} · {x.titleJa}</li>)}</ol></div><p className="muted mt-3">公開版では実際の地図を省き、訪問順の一覧で代替しています。位置情報や経路検索は使用しません。</p></div>}
 {tab==='restaurants'&&<div className="content"><h3 className="font-semibold">食事の候補</h3>{seed.filter(x=>x.type==='restaurant').map(x=><button key={x.id} className="list-row w-full text-left" onClick={()=>setSelected(x)}><span>{x.titleJa}<small className="block muted">{x.location}</small></span><span>詳細 →</span></button>)}</div>}
 <BottomNavigation activeBottomTab={tab} onSelectTab={setTab}/></section>
 <dialog ref={dialog} className="detail" onCancel={()=>setSelected(null)} onClose={()=>setSelected(null)}>{selected&&<><button className="plain float-right" onClick={()=>setSelected(null)}>閉じる</button><p className="muted">{selected.startTime}–{selected.endTime}</p><h2>{selected.titleJa}</h2>{edit?<form onSubmit={e=>{e.preventDefault();const data=new FormData(e.currentTarget);setItems(xs=>xs.map(x=>x.id===selected.id?{...x,titleJa:String(data.get('title')).trim(),notes:String(data.get('notes'))}:x));setSelected(null);setMessage('編集を保存しました。');}}><label>予定の名前<input name="title" required maxLength={80} defaultValue={selected.titleJa}/></label><label>メモ<textarea name="notes" maxLength={500} defaultValue={selected.notes}/></label><footer><button className="primary" type="submit">保存する</button></footer></form>:<><p>{selected.notes}</p><p className="muted">{selected.location} · 架空の施設</p><footer><button className="primary" onClick={()=>status(selected.id,selected.status==='planned'?'completed':'planned')}>{selected.status==='planned'?'完了にする':'未完了に戻す'}</button>{selected.status==='planned'&&<button className="plain" onClick={()=>status(selected.id,'skipped')}>今回はスキップ</button>}</footer></>}</>}</dialog></main>;
}
