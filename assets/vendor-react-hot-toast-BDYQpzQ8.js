import{r as e}from"./rolldown-runtime-Dw2cE7zH.js";import{d as t}from"./vendor-@radix-ui-CStlZ6Zt.js";import{i as n,n as r,r as i,t as a}from"./vendor-goober-BZE4XMUp.js";var o=e(t(),1),s=e=>typeof e==`function`,c=(e,t)=>s(e)?e(t):e,l=(()=>{let e=0;return()=>(++e).toString()})(),u=(()=>{let e;return()=>{if(e===void 0&&typeof window<`u`){let t=matchMedia(`(prefers-reduced-motion: reduce)`);e=!t||t.matches}return e}})(),d=20,f=`default`,p=(e,t)=>{let{toastLimit:n}=e.settings;switch(t.type){case 0:return{...e,toasts:[t.toast,...e.toasts].slice(0,n)};case 1:return{...e,toasts:e.toasts.map(e=>e.id===t.toast.id?{...e,...t.toast}:e)};case 2:let{toast:r}=t;return p(e,{type:e.toasts.find(e=>e.id===r.id)?1:0,toast:r});case 3:let{toastId:i}=t;return{...e,toasts:e.toasts.map(e=>e.id===i||i===void 0?{...e,dismissed:!0,visible:!1}:e)};case 4:return t.toastId===void 0?{...e,toasts:[]}:{...e,toasts:e.toasts.filter(e=>e.id!==t.toastId)};case 5:return{...e,pausedAt:t.time};case 6:let a=t.time-(e.pausedAt||0);return{...e,pausedAt:void 0,toasts:e.toasts.map(e=>({...e,pauseDuration:e.pauseDuration+a}))}}},m=[],h={toasts:[],pausedAt:void 0,settings:{toastLimit:d}},g={},_=(e,t=f)=>{g[t]=p(g[t]||h,e),m.forEach(([e,n])=>{e===t&&n(g[t])})},v=e=>Object.keys(g).forEach(t=>_(e,t)),y=e=>Object.keys(g).find(t=>g[t].toasts.some(t=>t.id===e)),b=(e=f)=>t=>{_(t,e)},x={blank:4e3,error:4e3,success:2e3,loading:1/0,custom:4e3},S=(e={},t=f)=>{let[n,r]=(0,o.useState)(g[t]||h),i=(0,o.useRef)(g[t]);(0,o.useEffect)(()=>(i.current!==g[t]&&r(g[t]),m.push([t,r]),()=>{let e=m.findIndex(([e])=>e===t);e>-1&&m.splice(e,1)}),[t]);let a=n.toasts.map(t=>({...e,...e[t.type],...t,removeDelay:t.removeDelay||e[t.type]?.removeDelay||e?.removeDelay,duration:t.duration||e[t.type]?.duration||e?.duration||x[t.type],style:{...e.style,...e[t.type]?.style,...t.style}}));return{...n,toasts:a}},C=(e,t=`blank`,n)=>({createdAt:Date.now(),visible:!0,dismissed:!1,type:t,ariaProps:{role:`status`,"aria-live":`polite`},message:e,pauseDuration:0,...n,id:n?.id||l()}),w=e=>(t,n)=>{let r=C(t,e,n);return b(r.toasterId||y(r.id))({type:2,toast:r}),r.id},T=(e,t)=>w(`blank`)(e,t);T.error=w(`error`),T.success=w(`success`),T.loading=w(`loading`),T.custom=w(`custom`),T.dismiss=(e,t)=>{let n={type:3,toastId:e};t?b(t)(n):v(n)},T.dismissAll=e=>T.dismiss(void 0,e),T.remove=(e,t)=>{let n={type:4,toastId:e};t?b(t)(n):v(n)},T.removeAll=e=>T.remove(void 0,e),T.promise=(e,t,n)=>{let r=T.loading(t.loading,{...n,...n?.loading});return typeof e==`function`&&(e=e()),e.then(e=>{let i=t.success?c(t.success,e):void 0;return i?T.success(i,{id:r,...n,...n?.success}):T.dismiss(r),e}).catch(e=>{let i=t.error?c(t.error,e):void 0;i?T.error(i,{id:r,...n,...n?.error}):T.dismiss(r)}),e};var E=1e3,D=(e,t=`default`)=>{let{toasts:n,pausedAt:r}=S(e,t),i=(0,o.useRef)(new Map).current,a=(0,o.useCallback)((e,t=E)=>{if(i.has(e))return;let n=setTimeout(()=>{i.delete(e),s({type:4,toastId:e})},t);i.set(e,n)},[]);(0,o.useEffect)(()=>{if(r)return;let e=Date.now(),i=n.map(n=>{if(n.duration===1/0)return;let r=(n.duration||0)+n.pauseDuration-(e-n.createdAt);if(r<0){n.visible&&T.dismiss(n.id);return}return setTimeout(()=>T.dismiss(n.id,t),r)});return()=>{i.forEach(e=>e&&clearTimeout(e))}},[n,r,t]);let s=(0,o.useCallback)(b(t),[t]),c=(0,o.useCallback)(()=>{s({type:5,time:Date.now()})},[s]),l=(0,o.useCallback)((e,t)=>{s({type:1,toast:{id:e,height:t}})},[s]),u=(0,o.useCallback)(()=>{r&&s({type:6,time:Date.now()})},[r,s]),d=(0,o.useCallback)((e,t)=>{let{reverseOrder:r=!1,gutter:i=8,defaultPosition:a}=t||{},o=n.filter(t=>(t.position||a)===(e.position||a)&&t.height),s=o.findIndex(t=>t.id===e.id),c=o.filter((e,t)=>t<s&&e.visible).length;return o.filter(e=>e.visible).slice(...r?[c+1]:[0,c]).reduce((e,t)=>e+(t.height||0)+i,0)},[n]);return(0,o.useEffect)(()=>{n.forEach(e=>{if(e.dismissed)a(e.id,e.removeDelay);else{let t=i.get(e.id);t&&(clearTimeout(t),i.delete(e.id))}})},[n,a]),{toasts:n,handlers:{updateHeight:l,startPause:c,endPause:u,calculateOffset:d}}},O=a`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
 transform: scale(1) rotate(45deg);
  opacity: 1;
}`,k=a`
from {
  transform: scale(0);
  opacity: 0;
}
to {
  transform: scale(1);
  opacity: 1;
}`,A=a`
from {
  transform: scale(0) rotate(90deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(90deg);
	opacity: 1;
}`,j=n(`div`)`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||`#ff4b4b`};
  position: relative;
  transform: rotate(45deg);

  animation: ${O} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;

  &:after,
  &:before {
    content: '';
    animation: ${k} 0.15s ease-out forwards;
    animation-delay: 150ms;
    position: absolute;
    border-radius: 3px;
    opacity: 0;
    background: ${e=>e.secondary||`#fff`};
    bottom: 9px;
    left: 4px;
    height: 2px;
    width: 12px;
  }

  &:before {
    animation: ${A} 0.15s ease-out forwards;
    animation-delay: 180ms;
    transform: rotate(90deg);
  }
`,M=a`
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
`,N=n(`div`)`
  width: 12px;
  height: 12px;
  box-sizing: border-box;
  border: 2px solid;
  border-radius: 100%;
  border-color: ${e=>e.secondary||`#e0e0e0`};
  border-right-color: ${e=>e.primary||`#616161`};
  animation: ${M} 1s linear infinite;
`,P=a`
from {
  transform: scale(0) rotate(45deg);
	opacity: 0;
}
to {
  transform: scale(1) rotate(45deg);
	opacity: 1;
}`,F=a`
0% {
	height: 0;
	width: 0;
	opacity: 0;
}
40% {
  height: 0;
	width: 6px;
	opacity: 1;
}
100% {
  opacity: 1;
  height: 10px;
}`,I=n(`div`)`
  width: 20px;
  opacity: 0;
  height: 20px;
  border-radius: 10px;
  background: ${e=>e.primary||`#61d345`};
  position: relative;
  transform: rotate(45deg);

  animation: ${P} 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
  animation-delay: 100ms;
  &:after {
    content: '';
    box-sizing: border-box;
    animation: ${F} 0.2s ease-out forwards;
    opacity: 0;
    animation-delay: 200ms;
    position: absolute;
    border-right: 2px solid;
    border-bottom: 2px solid;
    border-color: ${e=>e.secondary||`#fff`};
    bottom: 6px;
    left: 6px;
    height: 10px;
    width: 6px;
  }
`,L=n(`div`)`
  position: absolute;
`,R=n(`div`)`
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  min-width: 20px;
  min-height: 20px;
`,z=a`
from {
  transform: scale(0.6);
  opacity: 0.4;
}
to {
  transform: scale(1);
  opacity: 1;
}`,B=n(`div`)`
  position: relative;
  transform: scale(0.6);
  opacity: 0.4;
  min-width: 20px;
  animation: ${z} 0.3s 0.12s cubic-bezier(0.175, 0.885, 0.32, 1.275)
    forwards;
`,V=({toast:e})=>{let{icon:t,type:n,iconTheme:r}=e;return t===void 0?n===`blank`?null:o.createElement(R,null,o.createElement(N,{...r}),n!==`loading`&&o.createElement(L,null,n===`error`?o.createElement(j,{...r}):o.createElement(I,{...r}))):typeof t==`string`?o.createElement(B,null,t):t},H=e=>`
0% {transform: translate3d(0,${e*-200}%,0) scale(.6); opacity:.5;}
100% {transform: translate3d(0,0,0) scale(1); opacity:1;}
`,U=e=>`
0% {transform: translate3d(0,0,-1px) scale(1); opacity:1;}
100% {transform: translate3d(0,${e*-150}%,-1px) scale(.6); opacity:0;}
`,W=`0%{opacity:0;} 100%{opacity:1;}`,G=`0%{opacity:1;} 100%{opacity:0;}`,K=n(`div`)`
  display: flex;
  align-items: center;
  background: #fff;
  color: #363636;
  line-height: 1.3;
  will-change: transform;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.1), 0 3px 3px rgba(0, 0, 0, 0.05);
  max-width: 350px;
  pointer-events: auto;
  padding: 8px 10px;
  border-radius: 8px;
`,q=n(`div`)`
  display: flex;
  justify-content: center;
  margin: 4px 10px;
  color: inherit;
  flex: 1 1 auto;
  white-space: pre-line;
`,J=(e,t)=>{let n=e.includes(`top`)?1:-1,[r,i]=u()?[W,G]:[H(n),U(n)];return{animation:t?`${a(r)} 0.35s cubic-bezier(.21,1.02,.73,1) forwards`:`${a(i)} 0.4s forwards cubic-bezier(.06,.71,.55,1)`}},Y=o.memo(({toast:e,position:t,style:n,children:r})=>{let i=e.height?J(e.position||t||`top-center`,e.visible):{opacity:0},a=o.createElement(V,{toast:e}),s=o.createElement(q,{...e.ariaProps},c(e.message,e));return o.createElement(K,{className:e.className,style:{...i,...n,...e.style}},typeof r==`function`?r({icon:a,message:s}):o.createElement(o.Fragment,null,a,s))});r(o.createElement);var X=({id:e,className:t,style:n,onHeightUpdate:r,children:i})=>{let a=o.useCallback(t=>{if(t){let n=()=>{let n=t.getBoundingClientRect().height;r(e,n)};n(),new MutationObserver(n).observe(t,{subtree:!0,childList:!0,characterData:!0})}},[e,r]);return o.createElement(`div`,{ref:a,className:t,style:n},i)},Z=(e,t)=>{let n=e.includes(`top`),r=n?{top:0}:{bottom:0},i=e.includes(`center`)?{justifyContent:`center`}:e.includes(`right`)?{justifyContent:`flex-end`}:{};return{left:0,right:0,display:`flex`,position:`absolute`,transition:u()?void 0:`all 230ms cubic-bezier(.21,1.02,.73,1)`,transform:`translateY(${t*(n?1:-1)}px)`,...r,...i}},Q=i`
  z-index: 9999;
  > * {
    pointer-events: auto;
  }
`,$=16,ee=({reverseOrder:e,position:t=`top-center`,toastOptions:n,gutter:r,children:i,toasterId:a,containerStyle:s,containerClassName:l})=>{let{toasts:u,handlers:d}=D(n,a);return o.createElement(`div`,{"data-rht-toaster":a||``,style:{position:`fixed`,zIndex:9999,top:$,left:$,right:$,bottom:$,pointerEvents:`none`,...s},className:l,onMouseEnter:d.startPause,onMouseLeave:d.endPause},u.map(n=>{let a=n.position||t,s=Z(a,d.calculateOffset(n,{reverseOrder:e,gutter:r,defaultPosition:t}));return o.createElement(X,{id:n.id,key:n.id,onHeightUpdate:d.updateHeight,className:n.visible?Q:``,style:s},n.type===`custom`?c(n.message,n):i?i(n):o.createElement(Y,{toast:n,position:a}))}))},te=T;export{te as n,ee as t};