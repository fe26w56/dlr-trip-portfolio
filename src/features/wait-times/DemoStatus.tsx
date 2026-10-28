type Props = {attractionName?:string;attractionId?:string|null;restaurantId?:string|null;showId?:string|null;className?:string};
import { seed } from '../../data';
export function DemoWait({attractionName,attractionId,className=''}:Props) {
 const item=seed.find(x=>x.id===attractionId||x.titleEn===attractionName);
 return <span className={`text-xs rounded-full px-2 py-0.5 bg-blue-50 text-blue-700 ${className}`}>{item?.waitTimeMinutes??15}分・サンプル</span>;
}
export function DemoRestaurant({className=''}:Props) {return <span className={`text-xs ${className}`}>営業中・サンプル</span>;}
export function DemoShow({className=''}:Props) {return <span className={`text-xs ${className}`}>13:00・サンプル</span>;}
