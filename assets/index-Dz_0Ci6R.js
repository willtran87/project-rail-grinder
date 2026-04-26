var rh=Object.defineProperty;var oh=(r,t,e)=>t in r?rh(r,t,{enumerable:!0,configurable:!0,writable:!0,value:e}):r[t]=e;var P=(r,t,e)=>oh(r,typeof t!="symbol"?t+"":t,e);(function(){const t=document.createElement("link").relList;if(t&&t.supports&&t.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))n(i);new MutationObserver(i=>{for(const s of i)if(s.type==="childList")for(const o of s.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&n(o)}).observe(document,{childList:!0,subtree:!0});function e(i){const s={};return i.integrity&&(s.integrity=i.integrity),i.referrerPolicy&&(s.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?s.credentials="include":i.crossOrigin==="anonymous"?s.credentials="omit":s.credentials="same-origin",s}function n(i){if(i.ep)return;i.ep=!0;const s=e(i);fetch(i.href,s)}})();/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */const Zo="184",ah=0,Da=1,lh=2,Yi=1,ch=2,Wi=3,Vn=0,Ge=1,tn=2,Tn=0,bi=1,to=2,Na=3,Ua=4,hh=5,Jn=100,dh=101,uh=102,fh=103,ph=104,mh=200,gh=201,xh=202,_h=203,eo=204,no=205,vh=206,Mh=207,Sh=208,yh=209,bh=210,Eh=211,Th=212,wh=213,Ah=214,io=0,so=1,ro=2,Ti=3,oo=4,ao=5,lo=6,co=7,ac=0,Ch=1,Rh=2,fn=0,lc=1,cc=2,hc=3,jo=4,dc=5,uc=6,fc=7,pc=300,ti=301,wi=302,hr=303,dr=304,er=306,An=1e3,En=1001,ho=1002,Ee=1003,Ph=1004,ls=1005,Ne=1006,ur=1007,jn=1008,ze=1009,mc=1010,gc=1011,ji=1012,Qo=1013,pn=1014,nn=1015,Cn=1016,ta=1017,ea=1018,Qi=1020,xc=35902,_c=35899,vc=1021,Mc=1022,Je=1023,Rn=1026,Qn=1027,na=1028,ia=1029,ei=1030,sa=1031,ra=1033,Ws=33776,Xs=33777,qs=33778,Ys=33779,uo=35840,fo=35841,po=35842,mo=35843,go=36196,xo=37492,_o=37496,vo=37488,Mo=37489,Ks=37490,So=37491,yo=37808,bo=37809,Eo=37810,To=37811,wo=37812,Ao=37813,Co=37814,Ro=37815,Po=37816,Lo=37817,Io=37818,Do=37819,No=37820,Uo=37821,Fo=36492,Oo=36494,Bo=36495,ko=36283,zo=36284,Js=36285,Go=36286,Lh=3200,Vo=0,Ih=1,kn="",Ke="srgb",Zs="srgb-linear",js="linear",ae="srgb",ai=7680,Fa=519,Dh=512,Nh=513,Uh=514,oa=515,Fh=516,Oh=517,aa=518,Bh=519,Oa=35044,Ba="300 es",dn=2e3,ts=2001;function kh(r){for(let t=r.length-1;t>=0;--t)if(r[t]>=65535)return!0;return!1}function Qs(r){return document.createElementNS("http://www.w3.org/1999/xhtml",r)}function zh(){const r=Qs("canvas");return r.style.display="block",r}const ka={};function za(...r){const t="THREE."+r.shift();console.log(t,...r)}function Sc(r){const t=r[0];if(typeof t=="string"&&t.startsWith("TSL:")){const e=r[1];e&&e.isStackTrace?r[0]+=" "+e.getLocation():r[1]='Stack trace not available. Enable "THREE.Node.captureStackTrace" to capture stack traces.'}return r}function Bt(...r){r=Sc(r);const t="THREE."+r.shift();{const e=r[0];e&&e.isStackTrace?console.warn(e.getError(t)):console.warn(t,...r)}}function ee(...r){r=Sc(r);const t="THREE."+r.shift();{const e=r[0];e&&e.isStackTrace?console.error(e.getError(t)):console.error(t,...r)}}function Ho(...r){const t=r.join(" ");t in ka||(ka[t]=!0,Bt(...r))}function Gh(r,t,e){return new Promise(function(n,i){function s(){switch(r.clientWaitSync(t,r.SYNC_FLUSH_COMMANDS_BIT,0)){case r.WAIT_FAILED:i();break;case r.TIMEOUT_EXPIRED:setTimeout(s,e);break;default:n()}}setTimeout(s,e)})}const Vh={[io]:so,[ro]:lo,[oo]:co,[Ti]:ao,[so]:io,[lo]:ro,[co]:oo,[ao]:Ti};class ii{addEventListener(t,e){this._listeners===void 0&&(this._listeners={});const n=this._listeners;n[t]===void 0&&(n[t]=[]),n[t].indexOf(e)===-1&&n[t].push(e)}hasEventListener(t,e){const n=this._listeners;return n===void 0?!1:n[t]!==void 0&&n[t].indexOf(e)!==-1}removeEventListener(t,e){const n=this._listeners;if(n===void 0)return;const i=n[t];if(i!==void 0){const s=i.indexOf(e);s!==-1&&i.splice(s,1)}}dispatchEvent(t){const e=this._listeners;if(e===void 0)return;const n=e[t.type];if(n!==void 0){t.target=this;const i=n.slice(0);for(let s=0,o=i.length;s<o;s++)i[s].call(this,t);t.target=null}}}const Ie=["00","01","02","03","04","05","06","07","08","09","0a","0b","0c","0d","0e","0f","10","11","12","13","14","15","16","17","18","19","1a","1b","1c","1d","1e","1f","20","21","22","23","24","25","26","27","28","29","2a","2b","2c","2d","2e","2f","30","31","32","33","34","35","36","37","38","39","3a","3b","3c","3d","3e","3f","40","41","42","43","44","45","46","47","48","49","4a","4b","4c","4d","4e","4f","50","51","52","53","54","55","56","57","58","59","5a","5b","5c","5d","5e","5f","60","61","62","63","64","65","66","67","68","69","6a","6b","6c","6d","6e","6f","70","71","72","73","74","75","76","77","78","79","7a","7b","7c","7d","7e","7f","80","81","82","83","84","85","86","87","88","89","8a","8b","8c","8d","8e","8f","90","91","92","93","94","95","96","97","98","99","9a","9b","9c","9d","9e","9f","a0","a1","a2","a3","a4","a5","a6","a7","a8","a9","aa","ab","ac","ad","ae","af","b0","b1","b2","b3","b4","b5","b6","b7","b8","b9","ba","bb","bc","bd","be","bf","c0","c1","c2","c3","c4","c5","c6","c7","c8","c9","ca","cb","cc","cd","ce","cf","d0","d1","d2","d3","d4","d5","d6","d7","d8","d9","da","db","dc","dd","de","df","e0","e1","e2","e3","e4","e5","e6","e7","e8","e9","ea","eb","ec","ed","ee","ef","f0","f1","f2","f3","f4","f5","f6","f7","f8","f9","fa","fb","fc","fd","fe","ff"],fr=Math.PI/180,Wo=180/Math.PI;function Pi(){const r=Math.random()*4294967295|0,t=Math.random()*4294967295|0,e=Math.random()*4294967295|0,n=Math.random()*4294967295|0;return(Ie[r&255]+Ie[r>>8&255]+Ie[r>>16&255]+Ie[r>>24&255]+"-"+Ie[t&255]+Ie[t>>8&255]+"-"+Ie[t>>16&15|64]+Ie[t>>24&255]+"-"+Ie[e&63|128]+Ie[e>>8&255]+"-"+Ie[e>>16&255]+Ie[e>>24&255]+Ie[n&255]+Ie[n>>8&255]+Ie[n>>16&255]+Ie[n>>24&255]).toLowerCase()}function jt(r,t,e){return Math.max(t,Math.min(e,r))}function Hh(r,t){return(r%t+t)%t}function pr(r,t,e){return(1-e)*r+e*t}function Ui(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return r/4294967295;case Uint16Array:return r/65535;case Uint8Array:return r/255;case Int32Array:return Math.max(r/2147483647,-1);case Int16Array:return Math.max(r/32767,-1);case Int8Array:return Math.max(r/127,-1);default:throw new Error("Invalid component type.")}}function ke(r,t){switch(t.constructor){case Float32Array:return r;case Uint32Array:return Math.round(r*4294967295);case Uint16Array:return Math.round(r*65535);case Uint8Array:return Math.round(r*255);case Int32Array:return Math.round(r*2147483647);case Int16Array:return Math.round(r*32767);case Int8Array:return Math.round(r*127);default:throw new Error("Invalid component type.")}}const Ma=class Ma{constructor(t=0,e=0){this.x=t,this.y=e}get width(){return this.x}set width(t){this.x=t}get height(){return this.y}set height(t){this.y=t}set(t,e){return this.x=t,this.y=e,this}setScalar(t){return this.x=t,this.y=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y)}copy(t){return this.x=t.x,this.y=t.y,this}add(t){return this.x+=t.x,this.y+=t.y,this}addScalar(t){return this.x+=t,this.y+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this}subScalar(t){return this.x-=t,this.y-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this}multiply(t){return this.x*=t.x,this.y*=t.y,this}multiplyScalar(t){return this.x*=t,this.y*=t,this}divide(t){return this.x/=t.x,this.y/=t.y,this}divideScalar(t){return this.multiplyScalar(1/t)}applyMatrix3(t){const e=this.x,n=this.y,i=t.elements;return this.x=i[0]*e+i[3]*n+i[6],this.y=i[1]*e+i[4]*n+i[7],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this}negate(){return this.x=-this.x,this.y=-this.y,this}dot(t){return this.x*t.x+this.y*t.y}cross(t){return this.x*t.y-this.y*t.x}lengthSq(){return this.x*this.x+this.y*this.y}length(){return Math.sqrt(this.x*this.x+this.y*this.y)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)}normalize(){return this.divideScalar(this.length()||1)}angle(){return Math.atan2(-this.y,-this.x)+Math.PI}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y;return e*e+n*n}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this}equals(t){return t.x===this.x&&t.y===this.y}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this}rotateAround(t,e){const n=Math.cos(e),i=Math.sin(e),s=this.x-t.x,o=this.y-t.y;return this.x=s*n-o*i+t.x,this.y=s*i+o*n+t.y,this}random(){return this.x=Math.random(),this.y=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y}};Ma.prototype.isVector2=!0;let ot=Ma;class Be{constructor(t=0,e=0,n=0,i=1){this.isQuaternion=!0,this._x=t,this._y=e,this._z=n,this._w=i}static slerpFlat(t,e,n,i,s,o,a){let l=n[i+0],c=n[i+1],d=n[i+2],u=n[i+3],h=s[o+0],f=s[o+1],g=s[o+2],y=s[o+3];if(u!==y||l!==h||c!==f||d!==g){let p=l*h+c*f+d*g+u*y;p<0&&(h=-h,f=-f,g=-g,y=-y,p=-p);let m=1-a;if(p<.9995){const x=Math.acos(p),M=Math.sin(x);m=Math.sin(m*x)/M,a=Math.sin(a*x)/M,l=l*m+h*a,c=c*m+f*a,d=d*m+g*a,u=u*m+y*a}else{l=l*m+h*a,c=c*m+f*a,d=d*m+g*a,u=u*m+y*a;const x=1/Math.sqrt(l*l+c*c+d*d+u*u);l*=x,c*=x,d*=x,u*=x}}t[e]=l,t[e+1]=c,t[e+2]=d,t[e+3]=u}static multiplyQuaternionsFlat(t,e,n,i,s,o){const a=n[i],l=n[i+1],c=n[i+2],d=n[i+3],u=s[o],h=s[o+1],f=s[o+2],g=s[o+3];return t[e]=a*g+d*u+l*f-c*h,t[e+1]=l*g+d*h+c*u-a*f,t[e+2]=c*g+d*f+a*h-l*u,t[e+3]=d*g-a*u-l*h-c*f,t}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get w(){return this._w}set w(t){this._w=t,this._onChangeCallback()}set(t,e,n,i){return this._x=t,this._y=e,this._z=n,this._w=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._w)}copy(t){return this._x=t.x,this._y=t.y,this._z=t.z,this._w=t.w,this._onChangeCallback(),this}setFromEuler(t,e=!0){const n=t._x,i=t._y,s=t._z,o=t._order,a=Math.cos,l=Math.sin,c=a(n/2),d=a(i/2),u=a(s/2),h=l(n/2),f=l(i/2),g=l(s/2);switch(o){case"XYZ":this._x=h*d*u+c*f*g,this._y=c*f*u-h*d*g,this._z=c*d*g+h*f*u,this._w=c*d*u-h*f*g;break;case"YXZ":this._x=h*d*u+c*f*g,this._y=c*f*u-h*d*g,this._z=c*d*g-h*f*u,this._w=c*d*u+h*f*g;break;case"ZXY":this._x=h*d*u-c*f*g,this._y=c*f*u+h*d*g,this._z=c*d*g+h*f*u,this._w=c*d*u-h*f*g;break;case"ZYX":this._x=h*d*u-c*f*g,this._y=c*f*u+h*d*g,this._z=c*d*g-h*f*u,this._w=c*d*u+h*f*g;break;case"YZX":this._x=h*d*u+c*f*g,this._y=c*f*u+h*d*g,this._z=c*d*g-h*f*u,this._w=c*d*u-h*f*g;break;case"XZY":this._x=h*d*u-c*f*g,this._y=c*f*u-h*d*g,this._z=c*d*g+h*f*u,this._w=c*d*u+h*f*g;break;default:Bt("Quaternion: .setFromEuler() encountered an unknown order: "+o)}return e===!0&&this._onChangeCallback(),this}setFromAxisAngle(t,e){const n=e/2,i=Math.sin(n);return this._x=t.x*i,this._y=t.y*i,this._z=t.z*i,this._w=Math.cos(n),this._onChangeCallback(),this}setFromRotationMatrix(t){const e=t.elements,n=e[0],i=e[4],s=e[8],o=e[1],a=e[5],l=e[9],c=e[2],d=e[6],u=e[10],h=n+a+u;if(h>0){const f=.5/Math.sqrt(h+1);this._w=.25/f,this._x=(d-l)*f,this._y=(s-c)*f,this._z=(o-i)*f}else if(n>a&&n>u){const f=2*Math.sqrt(1+n-a-u);this._w=(d-l)/f,this._x=.25*f,this._y=(i+o)/f,this._z=(s+c)/f}else if(a>u){const f=2*Math.sqrt(1+a-n-u);this._w=(s-c)/f,this._x=(i+o)/f,this._y=.25*f,this._z=(l+d)/f}else{const f=2*Math.sqrt(1+u-n-a);this._w=(o-i)/f,this._x=(s+c)/f,this._y=(l+d)/f,this._z=.25*f}return this._onChangeCallback(),this}setFromUnitVectors(t,e){let n=t.dot(e)+1;return n<1e-8?(n=0,Math.abs(t.x)>Math.abs(t.z)?(this._x=-t.y,this._y=t.x,this._z=0,this._w=n):(this._x=0,this._y=-t.z,this._z=t.y,this._w=n)):(this._x=t.y*e.z-t.z*e.y,this._y=t.z*e.x-t.x*e.z,this._z=t.x*e.y-t.y*e.x,this._w=n),this.normalize()}angleTo(t){return 2*Math.acos(Math.abs(jt(this.dot(t),-1,1)))}rotateTowards(t,e){const n=this.angleTo(t);if(n===0)return this;const i=Math.min(1,e/n);return this.slerp(t,i),this}identity(){return this.set(0,0,0,1)}invert(){return this.conjugate()}conjugate(){return this._x*=-1,this._y*=-1,this._z*=-1,this._onChangeCallback(),this}dot(t){return this._x*t._x+this._y*t._y+this._z*t._z+this._w*t._w}lengthSq(){return this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w}length(){return Math.sqrt(this._x*this._x+this._y*this._y+this._z*this._z+this._w*this._w)}normalize(){let t=this.length();return t===0?(this._x=0,this._y=0,this._z=0,this._w=1):(t=1/t,this._x=this._x*t,this._y=this._y*t,this._z=this._z*t,this._w=this._w*t),this._onChangeCallback(),this}multiply(t){return this.multiplyQuaternions(this,t)}premultiply(t){return this.multiplyQuaternions(t,this)}multiplyQuaternions(t,e){const n=t._x,i=t._y,s=t._z,o=t._w,a=e._x,l=e._y,c=e._z,d=e._w;return this._x=n*d+o*a+i*c-s*l,this._y=i*d+o*l+s*a-n*c,this._z=s*d+o*c+n*l-i*a,this._w=o*d-n*a-i*l-s*c,this._onChangeCallback(),this}slerp(t,e){let n=t._x,i=t._y,s=t._z,o=t._w,a=this.dot(t);a<0&&(n=-n,i=-i,s=-s,o=-o,a=-a);let l=1-e;if(a<.9995){const c=Math.acos(a),d=Math.sin(c);l=Math.sin(l*c)/d,e=Math.sin(e*c)/d,this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+s*e,this._w=this._w*l+o*e,this._onChangeCallback()}else this._x=this._x*l+n*e,this._y=this._y*l+i*e,this._z=this._z*l+s*e,this._w=this._w*l+o*e,this.normalize();return this}slerpQuaternions(t,e,n){return this.copy(t).slerp(e,n)}random(){const t=2*Math.PI*Math.random(),e=2*Math.PI*Math.random(),n=Math.random(),i=Math.sqrt(1-n),s=Math.sqrt(n);return this.set(i*Math.sin(t),i*Math.cos(t),s*Math.sin(e),s*Math.cos(e))}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._w===this._w}fromArray(t,e=0){return this._x=t[e],this._y=t[e+1],this._z=t[e+2],this._w=t[e+3],this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._w,t}fromBufferAttribute(t,e){return this._x=t.getX(e),this._y=t.getY(e),this._z=t.getZ(e),this._w=t.getW(e),this._onChangeCallback(),this}toJSON(){return this.toArray()}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._w}}const Sa=class Sa{constructor(t=0,e=0,n=0){this.x=t,this.y=e,this.z=n}set(t,e,n){return n===void 0&&(n=this.z),this.x=t,this.y=e,this.z=n,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this}multiplyVectors(t,e){return this.x=t.x*e.x,this.y=t.y*e.y,this.z=t.z*e.z,this}applyEuler(t){return this.applyQuaternion(Ga.setFromEuler(t))}applyAxisAngle(t,e){return this.applyQuaternion(Ga.setFromAxisAngle(t,e))}applyMatrix3(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[3]*n+s[6]*i,this.y=s[1]*e+s[4]*n+s[7]*i,this.z=s[2]*e+s[5]*n+s[8]*i,this}applyNormalMatrix(t){return this.applyMatrix3(t).normalize()}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=t.elements,o=1/(s[3]*e+s[7]*n+s[11]*i+s[15]);return this.x=(s[0]*e+s[4]*n+s[8]*i+s[12])*o,this.y=(s[1]*e+s[5]*n+s[9]*i+s[13])*o,this.z=(s[2]*e+s[6]*n+s[10]*i+s[14])*o,this}applyQuaternion(t){const e=this.x,n=this.y,i=this.z,s=t.x,o=t.y,a=t.z,l=t.w,c=2*(o*i-a*n),d=2*(a*e-s*i),u=2*(s*n-o*e);return this.x=e+l*c+o*u-a*d,this.y=n+l*d+a*c-s*u,this.z=i+l*u+s*d-o*c,this}project(t){return this.applyMatrix4(t.matrixWorldInverse).applyMatrix4(t.projectionMatrix)}unproject(t){return this.applyMatrix4(t.projectionMatrixInverse).applyMatrix4(t.matrixWorld)}transformDirection(t){const e=this.x,n=this.y,i=this.z,s=t.elements;return this.x=s[0]*e+s[4]*n+s[8]*i,this.y=s[1]*e+s[5]*n+s[9]*i,this.z=s[2]*e+s[6]*n+s[10]*i,this.normalize()}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this}divideScalar(t){return this.multiplyScalar(1/t)}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this}cross(t){return this.crossVectors(this,t)}crossVectors(t,e){const n=t.x,i=t.y,s=t.z,o=e.x,a=e.y,l=e.z;return this.x=i*l-s*a,this.y=s*o-n*l,this.z=n*a-i*o,this}projectOnVector(t){const e=t.lengthSq();if(e===0)return this.set(0,0,0);const n=t.dot(this)/e;return this.copy(t).multiplyScalar(n)}projectOnPlane(t){return mr.copy(this).projectOnVector(t),this.sub(mr)}reflect(t){return this.sub(mr.copy(t).multiplyScalar(2*this.dot(t)))}angleTo(t){const e=Math.sqrt(this.lengthSq()*t.lengthSq());if(e===0)return Math.PI/2;const n=this.dot(t)/e;return Math.acos(jt(n,-1,1))}distanceTo(t){return Math.sqrt(this.distanceToSquared(t))}distanceToSquared(t){const e=this.x-t.x,n=this.y-t.y,i=this.z-t.z;return e*e+n*n+i*i}manhattanDistanceTo(t){return Math.abs(this.x-t.x)+Math.abs(this.y-t.y)+Math.abs(this.z-t.z)}setFromSpherical(t){return this.setFromSphericalCoords(t.radius,t.phi,t.theta)}setFromSphericalCoords(t,e,n){const i=Math.sin(e)*t;return this.x=i*Math.sin(n),this.y=Math.cos(e)*t,this.z=i*Math.cos(n),this}setFromCylindrical(t){return this.setFromCylindricalCoords(t.radius,t.theta,t.y)}setFromCylindricalCoords(t,e,n){return this.x=t*Math.sin(e),this.y=n,this.z=t*Math.cos(e),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this}setFromMatrixScale(t){const e=this.setFromMatrixColumn(t,0).length(),n=this.setFromMatrixColumn(t,1).length(),i=this.setFromMatrixColumn(t,2).length();return this.x=e,this.y=n,this.z=i,this}setFromMatrixColumn(t,e){return this.fromArray(t.elements,e*4)}setFromMatrix3Column(t,e){return this.fromArray(t.elements,e*3)}setFromEuler(t){return this.x=t._x,this.y=t._y,this.z=t._z,this}setFromColor(t){return this.x=t.r,this.y=t.g,this.z=t.b,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this}randomDirection(){const t=Math.random()*Math.PI*2,e=Math.random()*2-1,n=Math.sqrt(1-e*e);return this.x=n*Math.cos(t),this.y=e,this.z=n*Math.sin(t),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z}};Sa.prototype.isVector3=!0;let E=Sa;const mr=new E,Ga=new Be,ya=class ya{constructor(t,e,n,i,s,o,a,l,c){this.elements=[1,0,0,0,1,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c)}set(t,e,n,i,s,o,a,l,c){const d=this.elements;return d[0]=t,d[1]=i,d[2]=a,d[3]=e,d[4]=s,d[5]=l,d[6]=n,d[7]=o,d[8]=c,this}identity(){return this.set(1,0,0,0,1,0,0,0,1),this}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],this}extractBasis(t,e,n){return t.setFromMatrix3Column(this,0),e.setFromMatrix3Column(this,1),n.setFromMatrix3Column(this,2),this}setFromMatrix4(t){const e=t.elements;return this.set(e[0],e[4],e[8],e[1],e[5],e[9],e[2],e[6],e[10]),this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[3],l=n[6],c=n[1],d=n[4],u=n[7],h=n[2],f=n[5],g=n[8],y=i[0],p=i[3],m=i[6],x=i[1],M=i[4],S=i[7],C=i[2],w=i[5],R=i[8];return s[0]=o*y+a*x+l*C,s[3]=o*p+a*M+l*w,s[6]=o*m+a*S+l*R,s[1]=c*y+d*x+u*C,s[4]=c*p+d*M+u*w,s[7]=c*m+d*S+u*R,s[2]=h*y+f*x+g*C,s[5]=h*p+f*M+g*w,s[8]=h*m+f*S+g*R,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[3]*=t,e[6]*=t,e[1]*=t,e[4]*=t,e[7]*=t,e[2]*=t,e[5]*=t,e[8]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],d=t[8];return e*o*d-e*a*c-n*s*d+n*a*l+i*s*c-i*o*l}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],d=t[8],u=d*o-a*c,h=a*l-d*s,f=c*s-o*l,g=e*u+n*h+i*f;if(g===0)return this.set(0,0,0,0,0,0,0,0,0);const y=1/g;return t[0]=u*y,t[1]=(i*c-d*n)*y,t[2]=(a*n-i*o)*y,t[3]=h*y,t[4]=(d*e-i*l)*y,t[5]=(i*s-a*e)*y,t[6]=f*y,t[7]=(n*l-c*e)*y,t[8]=(o*e-n*s)*y,this}transpose(){let t;const e=this.elements;return t=e[1],e[1]=e[3],e[3]=t,t=e[2],e[2]=e[6],e[6]=t,t=e[5],e[5]=e[7],e[7]=t,this}getNormalMatrix(t){return this.setFromMatrix4(t).invert().transpose()}transposeIntoArray(t){const e=this.elements;return t[0]=e[0],t[1]=e[3],t[2]=e[6],t[3]=e[1],t[4]=e[4],t[5]=e[7],t[6]=e[2],t[7]=e[5],t[8]=e[8],this}setUvTransform(t,e,n,i,s,o,a){const l=Math.cos(s),c=Math.sin(s);return this.set(n*l,n*c,-n*(l*o+c*a)+o+t,-i*c,i*l,-i*(-c*o+l*a)+a+e,0,0,1),this}scale(t,e){return this.premultiply(gr.makeScale(t,e)),this}rotate(t){return this.premultiply(gr.makeRotation(-t)),this}translate(t,e){return this.premultiply(gr.makeTranslation(t,e)),this}makeTranslation(t,e){return t.isVector2?this.set(1,0,t.x,0,1,t.y,0,0,1):this.set(1,0,t,0,1,e,0,0,1),this}makeRotation(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,n,e,0,0,0,1),this}makeScale(t,e){return this.set(t,0,0,0,e,0,0,0,1),this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<9;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<9;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t}clone(){return new this.constructor().fromArray(this.elements)}};ya.prototype.isMatrix3=!0;let Xt=ya;const gr=new Xt,Va=new Xt().set(.4123908,.3575843,.1804808,.212639,.7151687,.0721923,.0193308,.1191948,.9505322),Ha=new Xt().set(3.2409699,-1.5373832,-.4986108,-.9692436,1.8759675,.0415551,.0556301,-.203977,1.0569715);function Wh(){const r={enabled:!0,workingColorSpace:Zs,spaces:{},convert:function(i,s,o){return this.enabled===!1||s===o||!s||!o||(this.spaces[s].transfer===ae&&(i.r=wn(i.r),i.g=wn(i.g),i.b=wn(i.b)),this.spaces[s].primaries!==this.spaces[o].primaries&&(i.applyMatrix3(this.spaces[s].toXYZ),i.applyMatrix3(this.spaces[o].fromXYZ)),this.spaces[o].transfer===ae&&(i.r=Ei(i.r),i.g=Ei(i.g),i.b=Ei(i.b))),i},workingToColorSpace:function(i,s){return this.convert(i,this.workingColorSpace,s)},colorSpaceToWorking:function(i,s){return this.convert(i,s,this.workingColorSpace)},getPrimaries:function(i){return this.spaces[i].primaries},getTransfer:function(i){return i===kn?js:this.spaces[i].transfer},getToneMappingMode:function(i){return this.spaces[i].outputColorSpaceConfig.toneMappingMode||"standard"},getLuminanceCoefficients:function(i,s=this.workingColorSpace){return i.fromArray(this.spaces[s].luminanceCoefficients)},define:function(i){Object.assign(this.spaces,i)},_getMatrix:function(i,s,o){return i.copy(this.spaces[s].toXYZ).multiply(this.spaces[o].fromXYZ)},_getDrawingBufferColorSpace:function(i){return this.spaces[i].outputColorSpaceConfig.drawingBufferColorSpace},_getUnpackColorSpace:function(i=this.workingColorSpace){return this.spaces[i].workingColorSpaceConfig.unpackColorSpace},fromWorkingColorSpace:function(i,s){return Ho("ColorManagement: .fromWorkingColorSpace() has been renamed to .workingToColorSpace()."),r.workingToColorSpace(i,s)},toWorkingColorSpace:function(i,s){return Ho("ColorManagement: .toWorkingColorSpace() has been renamed to .colorSpaceToWorking()."),r.colorSpaceToWorking(i,s)}},t=[.64,.33,.3,.6,.15,.06],e=[.2126,.7152,.0722],n=[.3127,.329];return r.define({[Zs]:{primaries:t,whitePoint:n,transfer:js,toXYZ:Va,fromXYZ:Ha,luminanceCoefficients:e,workingColorSpaceConfig:{unpackColorSpace:Ke},outputColorSpaceConfig:{drawingBufferColorSpace:Ke}},[Ke]:{primaries:t,whitePoint:n,transfer:ae,toXYZ:Va,fromXYZ:Ha,luminanceCoefficients:e,outputColorSpaceConfig:{drawingBufferColorSpace:Ke}}}),r}const te=Wh();function wn(r){return r<.04045?r*.0773993808:Math.pow(r*.9478672986+.0521327014,2.4)}function Ei(r){return r<.0031308?r*12.92:1.055*Math.pow(r,.41666)-.055}let li;class Xh{static getDataURL(t,e="image/png"){if(/^data:/i.test(t.src)||typeof HTMLCanvasElement>"u")return t.src;let n;if(t instanceof HTMLCanvasElement)n=t;else{li===void 0&&(li=Qs("canvas")),li.width=t.width,li.height=t.height;const i=li.getContext("2d");t instanceof ImageData?i.putImageData(t,0,0):i.drawImage(t,0,0,t.width,t.height),n=li}return n.toDataURL(e)}static sRGBToLinear(t){if(typeof HTMLImageElement<"u"&&t instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&t instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&t instanceof ImageBitmap){const e=Qs("canvas");e.width=t.width,e.height=t.height;const n=e.getContext("2d");n.drawImage(t,0,0,t.width,t.height);const i=n.getImageData(0,0,t.width,t.height),s=i.data;for(let o=0;o<s.length;o++)s[o]=wn(s[o]/255)*255;return n.putImageData(i,0,0),e}else if(t.data){const e=t.data.slice(0);for(let n=0;n<e.length;n++)e instanceof Uint8Array||e instanceof Uint8ClampedArray?e[n]=Math.floor(wn(e[n]/255)*255):e[n]=wn(e[n]);return{data:e,width:t.width,height:t.height}}else return Bt("ImageUtils.sRGBToLinear(): Unsupported image type. No color space conversion applied."),t}}let qh=0;class la{constructor(t=null){this.isSource=!0,Object.defineProperty(this,"id",{value:qh++}),this.uuid=Pi(),this.data=t,this.dataReady=!0,this.version=0}getSize(t){const e=this.data;return typeof HTMLVideoElement<"u"&&e instanceof HTMLVideoElement?t.set(e.videoWidth,e.videoHeight,0):typeof VideoFrame<"u"&&e instanceof VideoFrame?t.set(e.displayWidth,e.displayHeight,0):e!==null?t.set(e.width,e.height,e.depth||0):t.set(0,0,0),t}set needsUpdate(t){t===!0&&this.version++}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.images[this.uuid]!==void 0)return t.images[this.uuid];const n={uuid:this.uuid,url:""},i=this.data;if(i!==null){let s;if(Array.isArray(i)){s=[];for(let o=0,a=i.length;o<a;o++)i[o].isDataTexture?s.push(xr(i[o].image)):s.push(xr(i[o]))}else s=xr(i);n.url=s}return e||(t.images[this.uuid]=n),n}}function xr(r){return typeof HTMLImageElement<"u"&&r instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&r instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&r instanceof ImageBitmap?Xh.getDataURL(r):r.data?{data:Array.from(r.data),width:r.width,height:r.height,type:r.data.constructor.name}:(Bt("Texture: Unable to serialize Texture."),{})}let Yh=0;const _r=new E;class Ue extends ii{constructor(t=Ue.DEFAULT_IMAGE,e=Ue.DEFAULT_MAPPING,n=En,i=En,s=Ne,o=jn,a=Je,l=ze,c=Ue.DEFAULT_ANISOTROPY,d=kn){super(),this.isTexture=!0,Object.defineProperty(this,"id",{value:Yh++}),this.uuid=Pi(),this.name="",this.source=new la(t),this.mipmaps=[],this.mapping=e,this.channel=0,this.wrapS=n,this.wrapT=i,this.magFilter=s,this.minFilter=o,this.anisotropy=c,this.format=a,this.internalFormat=null,this.type=l,this.offset=new ot(0,0),this.repeat=new ot(1,1),this.center=new ot(0,0),this.rotation=0,this.matrixAutoUpdate=!0,this.matrix=new Xt,this.generateMipmaps=!0,this.premultiplyAlpha=!1,this.flipY=!0,this.unpackAlignment=4,this.colorSpace=d,this.userData={},this.updateRanges=[],this.version=0,this.onUpdate=null,this.renderTarget=null,this.isRenderTargetTexture=!1,this.isArrayTexture=!!(t&&t.depth&&t.depth>1),this.pmremVersion=0,this.normalized=!1}get width(){return this.source.getSize(_r).x}get height(){return this.source.getSize(_r).y}get depth(){return this.source.getSize(_r).z}get image(){return this.source.data}set image(t){this.source.data=t}updateMatrix(){this.matrix.setUvTransform(this.offset.x,this.offset.y,this.repeat.x,this.repeat.y,this.rotation,this.center.x,this.center.y)}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}clone(){return new this.constructor().copy(this)}copy(t){return this.name=t.name,this.source=t.source,this.mipmaps=t.mipmaps.slice(0),this.mapping=t.mapping,this.channel=t.channel,this.wrapS=t.wrapS,this.wrapT=t.wrapT,this.magFilter=t.magFilter,this.minFilter=t.minFilter,this.anisotropy=t.anisotropy,this.format=t.format,this.internalFormat=t.internalFormat,this.type=t.type,this.normalized=t.normalized,this.offset.copy(t.offset),this.repeat.copy(t.repeat),this.center.copy(t.center),this.rotation=t.rotation,this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrix.copy(t.matrix),this.generateMipmaps=t.generateMipmaps,this.premultiplyAlpha=t.premultiplyAlpha,this.flipY=t.flipY,this.unpackAlignment=t.unpackAlignment,this.colorSpace=t.colorSpace,this.renderTarget=t.renderTarget,this.isRenderTargetTexture=t.isRenderTargetTexture,this.isArrayTexture=t.isArrayTexture,this.userData=JSON.parse(JSON.stringify(t.userData)),this.needsUpdate=!0,this}setValues(t){for(const e in t){const n=t[e];if(n===void 0){Bt(`Texture.setValues(): parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Bt(`Texture.setValues(): property '${e}' does not exist.`);continue}i&&n&&i.isVector2&&n.isVector2||i&&n&&i.isVector3&&n.isVector3||i&&n&&i.isMatrix3&&n.isMatrix3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";if(!e&&t.textures[this.uuid]!==void 0)return t.textures[this.uuid];const n={metadata:{version:4.7,type:"Texture",generator:"Texture.toJSON"},uuid:this.uuid,name:this.name,image:this.source.toJSON(t).uuid,mapping:this.mapping,channel:this.channel,repeat:[this.repeat.x,this.repeat.y],offset:[this.offset.x,this.offset.y],center:[this.center.x,this.center.y],rotation:this.rotation,wrap:[this.wrapS,this.wrapT],format:this.format,internalFormat:this.internalFormat,type:this.type,normalized:this.normalized,colorSpace:this.colorSpace,minFilter:this.minFilter,magFilter:this.magFilter,anisotropy:this.anisotropy,flipY:this.flipY,generateMipmaps:this.generateMipmaps,premultiplyAlpha:this.premultiplyAlpha,unpackAlignment:this.unpackAlignment};return Object.keys(this.userData).length>0&&(n.userData=this.userData),e||(t.textures[this.uuid]=n),n}dispose(){this.dispatchEvent({type:"dispose"})}transformUv(t){if(this.mapping!==pc)return t;if(t.applyMatrix3(this.matrix),t.x<0||t.x>1)switch(this.wrapS){case An:t.x=t.x-Math.floor(t.x);break;case En:t.x=t.x<0?0:1;break;case ho:Math.abs(Math.floor(t.x)%2)===1?t.x=Math.ceil(t.x)-t.x:t.x=t.x-Math.floor(t.x);break}if(t.y<0||t.y>1)switch(this.wrapT){case An:t.y=t.y-Math.floor(t.y);break;case En:t.y=t.y<0?0:1;break;case ho:Math.abs(Math.floor(t.y)%2)===1?t.y=Math.ceil(t.y)-t.y:t.y=t.y-Math.floor(t.y);break}return this.flipY&&(t.y=1-t.y),t}set needsUpdate(t){t===!0&&(this.version++,this.source.needsUpdate=!0)}set needsPMREMUpdate(t){t===!0&&this.pmremVersion++}}Ue.DEFAULT_IMAGE=null;Ue.DEFAULT_MAPPING=pc;Ue.DEFAULT_ANISOTROPY=1;const ba=class ba{constructor(t=0,e=0,n=0,i=1){this.x=t,this.y=e,this.z=n,this.w=i}get width(){return this.z}set width(t){this.z=t}get height(){return this.w}set height(t){this.w=t}set(t,e,n,i){return this.x=t,this.y=e,this.z=n,this.w=i,this}setScalar(t){return this.x=t,this.y=t,this.z=t,this.w=t,this}setX(t){return this.x=t,this}setY(t){return this.y=t,this}setZ(t){return this.z=t,this}setW(t){return this.w=t,this}setComponent(t,e){switch(t){case 0:this.x=e;break;case 1:this.y=e;break;case 2:this.z=e;break;case 3:this.w=e;break;default:throw new Error("index is out of range: "+t)}return this}getComponent(t){switch(t){case 0:return this.x;case 1:return this.y;case 2:return this.z;case 3:return this.w;default:throw new Error("index is out of range: "+t)}}clone(){return new this.constructor(this.x,this.y,this.z,this.w)}copy(t){return this.x=t.x,this.y=t.y,this.z=t.z,this.w=t.w!==void 0?t.w:1,this}add(t){return this.x+=t.x,this.y+=t.y,this.z+=t.z,this.w+=t.w,this}addScalar(t){return this.x+=t,this.y+=t,this.z+=t,this.w+=t,this}addVectors(t,e){return this.x=t.x+e.x,this.y=t.y+e.y,this.z=t.z+e.z,this.w=t.w+e.w,this}addScaledVector(t,e){return this.x+=t.x*e,this.y+=t.y*e,this.z+=t.z*e,this.w+=t.w*e,this}sub(t){return this.x-=t.x,this.y-=t.y,this.z-=t.z,this.w-=t.w,this}subScalar(t){return this.x-=t,this.y-=t,this.z-=t,this.w-=t,this}subVectors(t,e){return this.x=t.x-e.x,this.y=t.y-e.y,this.z=t.z-e.z,this.w=t.w-e.w,this}multiply(t){return this.x*=t.x,this.y*=t.y,this.z*=t.z,this.w*=t.w,this}multiplyScalar(t){return this.x*=t,this.y*=t,this.z*=t,this.w*=t,this}applyMatrix4(t){const e=this.x,n=this.y,i=this.z,s=this.w,o=t.elements;return this.x=o[0]*e+o[4]*n+o[8]*i+o[12]*s,this.y=o[1]*e+o[5]*n+o[9]*i+o[13]*s,this.z=o[2]*e+o[6]*n+o[10]*i+o[14]*s,this.w=o[3]*e+o[7]*n+o[11]*i+o[15]*s,this}divide(t){return this.x/=t.x,this.y/=t.y,this.z/=t.z,this.w/=t.w,this}divideScalar(t){return this.multiplyScalar(1/t)}setAxisAngleFromQuaternion(t){this.w=2*Math.acos(t.w);const e=Math.sqrt(1-t.w*t.w);return e<1e-4?(this.x=1,this.y=0,this.z=0):(this.x=t.x/e,this.y=t.y/e,this.z=t.z/e),this}setAxisAngleFromRotationMatrix(t){let e,n,i,s;const l=t.elements,c=l[0],d=l[4],u=l[8],h=l[1],f=l[5],g=l[9],y=l[2],p=l[6],m=l[10];if(Math.abs(d-h)<.01&&Math.abs(u-y)<.01&&Math.abs(g-p)<.01){if(Math.abs(d+h)<.1&&Math.abs(u+y)<.1&&Math.abs(g+p)<.1&&Math.abs(c+f+m-3)<.1)return this.set(1,0,0,0),this;e=Math.PI;const M=(c+1)/2,S=(f+1)/2,C=(m+1)/2,w=(d+h)/4,R=(u+y)/4,v=(g+p)/4;return M>S&&M>C?M<.01?(n=0,i=.707106781,s=.707106781):(n=Math.sqrt(M),i=w/n,s=R/n):S>C?S<.01?(n=.707106781,i=0,s=.707106781):(i=Math.sqrt(S),n=w/i,s=v/i):C<.01?(n=.707106781,i=.707106781,s=0):(s=Math.sqrt(C),n=R/s,i=v/s),this.set(n,i,s,e),this}let x=Math.sqrt((p-g)*(p-g)+(u-y)*(u-y)+(h-d)*(h-d));return Math.abs(x)<.001&&(x=1),this.x=(p-g)/x,this.y=(u-y)/x,this.z=(h-d)/x,this.w=Math.acos((c+f+m-1)/2),this}setFromMatrixPosition(t){const e=t.elements;return this.x=e[12],this.y=e[13],this.z=e[14],this.w=e[15],this}min(t){return this.x=Math.min(this.x,t.x),this.y=Math.min(this.y,t.y),this.z=Math.min(this.z,t.z),this.w=Math.min(this.w,t.w),this}max(t){return this.x=Math.max(this.x,t.x),this.y=Math.max(this.y,t.y),this.z=Math.max(this.z,t.z),this.w=Math.max(this.w,t.w),this}clamp(t,e){return this.x=jt(this.x,t.x,e.x),this.y=jt(this.y,t.y,e.y),this.z=jt(this.z,t.z,e.z),this.w=jt(this.w,t.w,e.w),this}clampScalar(t,e){return this.x=jt(this.x,t,e),this.y=jt(this.y,t,e),this.z=jt(this.z,t,e),this.w=jt(this.w,t,e),this}clampLength(t,e){const n=this.length();return this.divideScalar(n||1).multiplyScalar(jt(n,t,e))}floor(){return this.x=Math.floor(this.x),this.y=Math.floor(this.y),this.z=Math.floor(this.z),this.w=Math.floor(this.w),this}ceil(){return this.x=Math.ceil(this.x),this.y=Math.ceil(this.y),this.z=Math.ceil(this.z),this.w=Math.ceil(this.w),this}round(){return this.x=Math.round(this.x),this.y=Math.round(this.y),this.z=Math.round(this.z),this.w=Math.round(this.w),this}roundToZero(){return this.x=Math.trunc(this.x),this.y=Math.trunc(this.y),this.z=Math.trunc(this.z),this.w=Math.trunc(this.w),this}negate(){return this.x=-this.x,this.y=-this.y,this.z=-this.z,this.w=-this.w,this}dot(t){return this.x*t.x+this.y*t.y+this.z*t.z+this.w*t.w}lengthSq(){return this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w}length(){return Math.sqrt(this.x*this.x+this.y*this.y+this.z*this.z+this.w*this.w)}manhattanLength(){return Math.abs(this.x)+Math.abs(this.y)+Math.abs(this.z)+Math.abs(this.w)}normalize(){return this.divideScalar(this.length()||1)}setLength(t){return this.normalize().multiplyScalar(t)}lerp(t,e){return this.x+=(t.x-this.x)*e,this.y+=(t.y-this.y)*e,this.z+=(t.z-this.z)*e,this.w+=(t.w-this.w)*e,this}lerpVectors(t,e,n){return this.x=t.x+(e.x-t.x)*n,this.y=t.y+(e.y-t.y)*n,this.z=t.z+(e.z-t.z)*n,this.w=t.w+(e.w-t.w)*n,this}equals(t){return t.x===this.x&&t.y===this.y&&t.z===this.z&&t.w===this.w}fromArray(t,e=0){return this.x=t[e],this.y=t[e+1],this.z=t[e+2],this.w=t[e+3],this}toArray(t=[],e=0){return t[e]=this.x,t[e+1]=this.y,t[e+2]=this.z,t[e+3]=this.w,t}fromBufferAttribute(t,e){return this.x=t.getX(e),this.y=t.getY(e),this.z=t.getZ(e),this.w=t.getW(e),this}random(){return this.x=Math.random(),this.y=Math.random(),this.z=Math.random(),this.w=Math.random(),this}*[Symbol.iterator](){yield this.x,yield this.y,yield this.z,yield this.w}};ba.prototype.isVector4=!0;let xe=ba;class $h extends ii{constructor(t=1,e=1,n={}){super(),n=Object.assign({generateMipmaps:!1,internalFormat:null,minFilter:Ne,depthBuffer:!0,stencilBuffer:!1,resolveDepthBuffer:!0,resolveStencilBuffer:!0,depthTexture:null,samples:0,count:1,depth:1,multiview:!1},n),this.isRenderTarget=!0,this.width=t,this.height=e,this.depth=n.depth,this.scissor=new xe(0,0,t,e),this.scissorTest=!1,this.viewport=new xe(0,0,t,e),this.textures=[];const i={width:t,height:e,depth:n.depth},s=new Ue(i),o=n.count;for(let a=0;a<o;a++)this.textures[a]=s.clone(),this.textures[a].isRenderTargetTexture=!0,this.textures[a].renderTarget=this;this._setTextureOptions(n),this.depthBuffer=n.depthBuffer,this.stencilBuffer=n.stencilBuffer,this.resolveDepthBuffer=n.resolveDepthBuffer,this.resolveStencilBuffer=n.resolveStencilBuffer,this._depthTexture=null,this.depthTexture=n.depthTexture,this.samples=n.samples,this.multiview=n.multiview}_setTextureOptions(t={}){const e={minFilter:Ne,generateMipmaps:!1,flipY:!1,internalFormat:null};t.mapping!==void 0&&(e.mapping=t.mapping),t.wrapS!==void 0&&(e.wrapS=t.wrapS),t.wrapT!==void 0&&(e.wrapT=t.wrapT),t.wrapR!==void 0&&(e.wrapR=t.wrapR),t.magFilter!==void 0&&(e.magFilter=t.magFilter),t.minFilter!==void 0&&(e.minFilter=t.minFilter),t.format!==void 0&&(e.format=t.format),t.type!==void 0&&(e.type=t.type),t.anisotropy!==void 0&&(e.anisotropy=t.anisotropy),t.colorSpace!==void 0&&(e.colorSpace=t.colorSpace),t.flipY!==void 0&&(e.flipY=t.flipY),t.generateMipmaps!==void 0&&(e.generateMipmaps=t.generateMipmaps),t.internalFormat!==void 0&&(e.internalFormat=t.internalFormat);for(let n=0;n<this.textures.length;n++)this.textures[n].setValues(e)}get texture(){return this.textures[0]}set texture(t){this.textures[0]=t}set depthTexture(t){this._depthTexture!==null&&(this._depthTexture.renderTarget=null),t!==null&&(t.renderTarget=this),this._depthTexture=t}get depthTexture(){return this._depthTexture}setSize(t,e,n=1){if(this.width!==t||this.height!==e||this.depth!==n){this.width=t,this.height=e,this.depth=n;for(let i=0,s=this.textures.length;i<s;i++)this.textures[i].image.width=t,this.textures[i].image.height=e,this.textures[i].image.depth=n,this.textures[i].isData3DTexture!==!0&&(this.textures[i].isArrayTexture=this.textures[i].image.depth>1);this.dispose()}this.viewport.set(0,0,t,e),this.scissor.set(0,0,t,e)}clone(){return new this.constructor().copy(this)}copy(t){this.width=t.width,this.height=t.height,this.depth=t.depth,this.scissor.copy(t.scissor),this.scissorTest=t.scissorTest,this.viewport.copy(t.viewport),this.textures.length=0;for(let e=0,n=t.textures.length;e<n;e++){this.textures[e]=t.textures[e].clone(),this.textures[e].isRenderTargetTexture=!0,this.textures[e].renderTarget=this;const i=Object.assign({},t.textures[e].image);this.textures[e].source=new la(i)}return this.depthBuffer=t.depthBuffer,this.stencilBuffer=t.stencilBuffer,this.resolveDepthBuffer=t.resolveDepthBuffer,this.resolveStencilBuffer=t.resolveStencilBuffer,t.depthTexture!==null&&(this.depthTexture=t.depthTexture.clone()),this.samples=t.samples,this.multiview=t.multiview,this}dispose(){this.dispatchEvent({type:"dispose"})}}class sn extends $h{constructor(t=1,e=1,n={}){super(t,e,n),this.isWebGLRenderTarget=!0}}class yc extends Ue{constructor(t=null,e=1,n=1,i=1){super(null),this.isDataArrayTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ee,this.minFilter=Ee,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1,this.layerUpdates=new Set}addLayerUpdate(t){this.layerUpdates.add(t)}clearLayerUpdates(){this.layerUpdates.clear()}}class Kh extends Ue{constructor(t=null,e=1,n=1,i=1){super(null),this.isData3DTexture=!0,this.image={data:t,width:e,height:n,depth:i},this.magFilter=Ee,this.minFilter=Ee,this.wrapR=En,this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}const tr=class tr{constructor(t,e,n,i,s,o,a,l,c,d,u,h,f,g,y,p){this.elements=[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1],t!==void 0&&this.set(t,e,n,i,s,o,a,l,c,d,u,h,f,g,y,p)}set(t,e,n,i,s,o,a,l,c,d,u,h,f,g,y,p){const m=this.elements;return m[0]=t,m[4]=e,m[8]=n,m[12]=i,m[1]=s,m[5]=o,m[9]=a,m[13]=l,m[2]=c,m[6]=d,m[10]=u,m[14]=h,m[3]=f,m[7]=g,m[11]=y,m[15]=p,this}identity(){return this.set(1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1),this}clone(){return new tr().fromArray(this.elements)}copy(t){const e=this.elements,n=t.elements;return e[0]=n[0],e[1]=n[1],e[2]=n[2],e[3]=n[3],e[4]=n[4],e[5]=n[5],e[6]=n[6],e[7]=n[7],e[8]=n[8],e[9]=n[9],e[10]=n[10],e[11]=n[11],e[12]=n[12],e[13]=n[13],e[14]=n[14],e[15]=n[15],this}copyPosition(t){const e=this.elements,n=t.elements;return e[12]=n[12],e[13]=n[13],e[14]=n[14],this}setFromMatrix3(t){const e=t.elements;return this.set(e[0],e[3],e[6],0,e[1],e[4],e[7],0,e[2],e[5],e[8],0,0,0,0,1),this}extractBasis(t,e,n){return this.determinant()===0?(t.set(1,0,0),e.set(0,1,0),n.set(0,0,1),this):(t.setFromMatrixColumn(this,0),e.setFromMatrixColumn(this,1),n.setFromMatrixColumn(this,2),this)}makeBasis(t,e,n){return this.set(t.x,e.x,n.x,0,t.y,e.y,n.y,0,t.z,e.z,n.z,0,0,0,0,1),this}extractRotation(t){if(t.determinant()===0)return this.identity();const e=this.elements,n=t.elements,i=1/ci.setFromMatrixColumn(t,0).length(),s=1/ci.setFromMatrixColumn(t,1).length(),o=1/ci.setFromMatrixColumn(t,2).length();return e[0]=n[0]*i,e[1]=n[1]*i,e[2]=n[2]*i,e[3]=0,e[4]=n[4]*s,e[5]=n[5]*s,e[6]=n[6]*s,e[7]=0,e[8]=n[8]*o,e[9]=n[9]*o,e[10]=n[10]*o,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromEuler(t){const e=this.elements,n=t.x,i=t.y,s=t.z,o=Math.cos(n),a=Math.sin(n),l=Math.cos(i),c=Math.sin(i),d=Math.cos(s),u=Math.sin(s);if(t.order==="XYZ"){const h=o*d,f=o*u,g=a*d,y=a*u;e[0]=l*d,e[4]=-l*u,e[8]=c,e[1]=f+g*c,e[5]=h-y*c,e[9]=-a*l,e[2]=y-h*c,e[6]=g+f*c,e[10]=o*l}else if(t.order==="YXZ"){const h=l*d,f=l*u,g=c*d,y=c*u;e[0]=h+y*a,e[4]=g*a-f,e[8]=o*c,e[1]=o*u,e[5]=o*d,e[9]=-a,e[2]=f*a-g,e[6]=y+h*a,e[10]=o*l}else if(t.order==="ZXY"){const h=l*d,f=l*u,g=c*d,y=c*u;e[0]=h-y*a,e[4]=-o*u,e[8]=g+f*a,e[1]=f+g*a,e[5]=o*d,e[9]=y-h*a,e[2]=-o*c,e[6]=a,e[10]=o*l}else if(t.order==="ZYX"){const h=o*d,f=o*u,g=a*d,y=a*u;e[0]=l*d,e[4]=g*c-f,e[8]=h*c+y,e[1]=l*u,e[5]=y*c+h,e[9]=f*c-g,e[2]=-c,e[6]=a*l,e[10]=o*l}else if(t.order==="YZX"){const h=o*l,f=o*c,g=a*l,y=a*c;e[0]=l*d,e[4]=y-h*u,e[8]=g*u+f,e[1]=u,e[5]=o*d,e[9]=-a*d,e[2]=-c*d,e[6]=f*u+g,e[10]=h-y*u}else if(t.order==="XZY"){const h=o*l,f=o*c,g=a*l,y=a*c;e[0]=l*d,e[4]=-u,e[8]=c*d,e[1]=h*u+y,e[5]=o*d,e[9]=f*u-g,e[2]=g*u-f,e[6]=a*d,e[10]=y*u+h}return e[3]=0,e[7]=0,e[11]=0,e[12]=0,e[13]=0,e[14]=0,e[15]=1,this}makeRotationFromQuaternion(t){return this.compose(Jh,t,Zh)}lookAt(t,e,n){const i=this.elements;return He.subVectors(t,e),He.lengthSq()===0&&(He.z=1),He.normalize(),Dn.crossVectors(n,He),Dn.lengthSq()===0&&(Math.abs(n.z)===1?He.x+=1e-4:He.z+=1e-4,He.normalize(),Dn.crossVectors(n,He)),Dn.normalize(),cs.crossVectors(He,Dn),i[0]=Dn.x,i[4]=cs.x,i[8]=He.x,i[1]=Dn.y,i[5]=cs.y,i[9]=He.y,i[2]=Dn.z,i[6]=cs.z,i[10]=He.z,this}multiply(t){return this.multiplyMatrices(this,t)}premultiply(t){return this.multiplyMatrices(t,this)}multiplyMatrices(t,e){const n=t.elements,i=e.elements,s=this.elements,o=n[0],a=n[4],l=n[8],c=n[12],d=n[1],u=n[5],h=n[9],f=n[13],g=n[2],y=n[6],p=n[10],m=n[14],x=n[3],M=n[7],S=n[11],C=n[15],w=i[0],R=i[4],v=i[8],A=i[12],D=i[1],L=i[5],O=i[9],W=i[13],q=i[2],U=i[6],V=i[10],k=i[14],et=i[3],nt=i[7],pt=i[11],St=i[15];return s[0]=o*w+a*D+l*q+c*et,s[4]=o*R+a*L+l*U+c*nt,s[8]=o*v+a*O+l*V+c*pt,s[12]=o*A+a*W+l*k+c*St,s[1]=d*w+u*D+h*q+f*et,s[5]=d*R+u*L+h*U+f*nt,s[9]=d*v+u*O+h*V+f*pt,s[13]=d*A+u*W+h*k+f*St,s[2]=g*w+y*D+p*q+m*et,s[6]=g*R+y*L+p*U+m*nt,s[10]=g*v+y*O+p*V+m*pt,s[14]=g*A+y*W+p*k+m*St,s[3]=x*w+M*D+S*q+C*et,s[7]=x*R+M*L+S*U+C*nt,s[11]=x*v+M*O+S*V+C*pt,s[15]=x*A+M*W+S*k+C*St,this}multiplyScalar(t){const e=this.elements;return e[0]*=t,e[4]*=t,e[8]*=t,e[12]*=t,e[1]*=t,e[5]*=t,e[9]*=t,e[13]*=t,e[2]*=t,e[6]*=t,e[10]*=t,e[14]*=t,e[3]*=t,e[7]*=t,e[11]*=t,e[15]*=t,this}determinant(){const t=this.elements,e=t[0],n=t[4],i=t[8],s=t[12],o=t[1],a=t[5],l=t[9],c=t[13],d=t[2],u=t[6],h=t[10],f=t[14],g=t[3],y=t[7],p=t[11],m=t[15],x=l*f-c*h,M=a*f-c*u,S=a*h-l*u,C=o*f-c*d,w=o*h-l*d,R=o*u-a*d;return e*(y*x-p*M+m*S)-n*(g*x-p*C+m*w)+i*(g*M-y*C+m*R)-s*(g*S-y*w+p*R)}transpose(){const t=this.elements;let e;return e=t[1],t[1]=t[4],t[4]=e,e=t[2],t[2]=t[8],t[8]=e,e=t[6],t[6]=t[9],t[9]=e,e=t[3],t[3]=t[12],t[12]=e,e=t[7],t[7]=t[13],t[13]=e,e=t[11],t[11]=t[14],t[14]=e,this}setPosition(t,e,n){const i=this.elements;return t.isVector3?(i[12]=t.x,i[13]=t.y,i[14]=t.z):(i[12]=t,i[13]=e,i[14]=n),this}invert(){const t=this.elements,e=t[0],n=t[1],i=t[2],s=t[3],o=t[4],a=t[5],l=t[6],c=t[7],d=t[8],u=t[9],h=t[10],f=t[11],g=t[12],y=t[13],p=t[14],m=t[15],x=e*a-n*o,M=e*l-i*o,S=e*c-s*o,C=n*l-i*a,w=n*c-s*a,R=i*c-s*l,v=d*y-u*g,A=d*p-h*g,D=d*m-f*g,L=u*p-h*y,O=u*m-f*y,W=h*m-f*p,q=x*W-M*O+S*L+C*D-w*A+R*v;if(q===0)return this.set(0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0);const U=1/q;return t[0]=(a*W-l*O+c*L)*U,t[1]=(i*O-n*W-s*L)*U,t[2]=(y*R-p*w+m*C)*U,t[3]=(h*w-u*R-f*C)*U,t[4]=(l*D-o*W-c*A)*U,t[5]=(e*W-i*D+s*A)*U,t[6]=(p*S-g*R-m*M)*U,t[7]=(d*R-h*S+f*M)*U,t[8]=(o*O-a*D+c*v)*U,t[9]=(n*D-e*O-s*v)*U,t[10]=(g*w-y*S+m*x)*U,t[11]=(u*S-d*w-f*x)*U,t[12]=(a*A-o*L-l*v)*U,t[13]=(e*L-n*A+i*v)*U,t[14]=(y*M-g*C-p*x)*U,t[15]=(d*C-u*M+h*x)*U,this}scale(t){const e=this.elements,n=t.x,i=t.y,s=t.z;return e[0]*=n,e[4]*=i,e[8]*=s,e[1]*=n,e[5]*=i,e[9]*=s,e[2]*=n,e[6]*=i,e[10]*=s,e[3]*=n,e[7]*=i,e[11]*=s,this}getMaxScaleOnAxis(){const t=this.elements,e=t[0]*t[0]+t[1]*t[1]+t[2]*t[2],n=t[4]*t[4]+t[5]*t[5]+t[6]*t[6],i=t[8]*t[8]+t[9]*t[9]+t[10]*t[10];return Math.sqrt(Math.max(e,n,i))}makeTranslation(t,e,n){return t.isVector3?this.set(1,0,0,t.x,0,1,0,t.y,0,0,1,t.z,0,0,0,1):this.set(1,0,0,t,0,1,0,e,0,0,1,n,0,0,0,1),this}makeRotationX(t){const e=Math.cos(t),n=Math.sin(t);return this.set(1,0,0,0,0,e,-n,0,0,n,e,0,0,0,0,1),this}makeRotationY(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,0,n,0,0,1,0,0,-n,0,e,0,0,0,0,1),this}makeRotationZ(t){const e=Math.cos(t),n=Math.sin(t);return this.set(e,-n,0,0,n,e,0,0,0,0,1,0,0,0,0,1),this}makeRotationAxis(t,e){const n=Math.cos(e),i=Math.sin(e),s=1-n,o=t.x,a=t.y,l=t.z,c=s*o,d=s*a;return this.set(c*o+n,c*a-i*l,c*l+i*a,0,c*a+i*l,d*a+n,d*l-i*o,0,c*l-i*a,d*l+i*o,s*l*l+n,0,0,0,0,1),this}makeScale(t,e,n){return this.set(t,0,0,0,0,e,0,0,0,0,n,0,0,0,0,1),this}makeShear(t,e,n,i,s,o){return this.set(1,n,s,0,t,1,o,0,e,i,1,0,0,0,0,1),this}compose(t,e,n){const i=this.elements,s=e._x,o=e._y,a=e._z,l=e._w,c=s+s,d=o+o,u=a+a,h=s*c,f=s*d,g=s*u,y=o*d,p=o*u,m=a*u,x=l*c,M=l*d,S=l*u,C=n.x,w=n.y,R=n.z;return i[0]=(1-(y+m))*C,i[1]=(f+S)*C,i[2]=(g-M)*C,i[3]=0,i[4]=(f-S)*w,i[5]=(1-(h+m))*w,i[6]=(p+x)*w,i[7]=0,i[8]=(g+M)*R,i[9]=(p-x)*R,i[10]=(1-(h+y))*R,i[11]=0,i[12]=t.x,i[13]=t.y,i[14]=t.z,i[15]=1,this}decompose(t,e,n){const i=this.elements;t.x=i[12],t.y=i[13],t.z=i[14];const s=this.determinant();if(s===0)return n.set(1,1,1),e.identity(),this;let o=ci.set(i[0],i[1],i[2]).length();const a=ci.set(i[4],i[5],i[6]).length(),l=ci.set(i[8],i[9],i[10]).length();s<0&&(o=-o),Ze.copy(this);const c=1/o,d=1/a,u=1/l;return Ze.elements[0]*=c,Ze.elements[1]*=c,Ze.elements[2]*=c,Ze.elements[4]*=d,Ze.elements[5]*=d,Ze.elements[6]*=d,Ze.elements[8]*=u,Ze.elements[9]*=u,Ze.elements[10]*=u,e.setFromRotationMatrix(Ze),n.x=o,n.y=a,n.z=l,this}makePerspective(t,e,n,i,s,o,a=dn,l=!1){const c=this.elements,d=2*s/(e-t),u=2*s/(n-i),h=(e+t)/(e-t),f=(n+i)/(n-i);let g,y;if(l)g=s/(o-s),y=o*s/(o-s);else if(a===dn)g=-(o+s)/(o-s),y=-2*o*s/(o-s);else if(a===ts)g=-o/(o-s),y=-o*s/(o-s);else throw new Error("THREE.Matrix4.makePerspective(): Invalid coordinate system: "+a);return c[0]=d,c[4]=0,c[8]=h,c[12]=0,c[1]=0,c[5]=u,c[9]=f,c[13]=0,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=-1,c[15]=0,this}makeOrthographic(t,e,n,i,s,o,a=dn,l=!1){const c=this.elements,d=2/(e-t),u=2/(n-i),h=-(e+t)/(e-t),f=-(n+i)/(n-i);let g,y;if(l)g=1/(o-s),y=o/(o-s);else if(a===dn)g=-2/(o-s),y=-(o+s)/(o-s);else if(a===ts)g=-1/(o-s),y=-s/(o-s);else throw new Error("THREE.Matrix4.makeOrthographic(): Invalid coordinate system: "+a);return c[0]=d,c[4]=0,c[8]=0,c[12]=h,c[1]=0,c[5]=u,c[9]=0,c[13]=f,c[2]=0,c[6]=0,c[10]=g,c[14]=y,c[3]=0,c[7]=0,c[11]=0,c[15]=1,this}equals(t){const e=this.elements,n=t.elements;for(let i=0;i<16;i++)if(e[i]!==n[i])return!1;return!0}fromArray(t,e=0){for(let n=0;n<16;n++)this.elements[n]=t[n+e];return this}toArray(t=[],e=0){const n=this.elements;return t[e]=n[0],t[e+1]=n[1],t[e+2]=n[2],t[e+3]=n[3],t[e+4]=n[4],t[e+5]=n[5],t[e+6]=n[6],t[e+7]=n[7],t[e+8]=n[8],t[e+9]=n[9],t[e+10]=n[10],t[e+11]=n[11],t[e+12]=n[12],t[e+13]=n[13],t[e+14]=n[14],t[e+15]=n[15],t}};tr.prototype.isMatrix4=!0;let Qt=tr;const ci=new E,Ze=new Qt,Jh=new E(0,0,0),Zh=new E(1,1,1),Dn=new E,cs=new E,He=new E,Wa=new Qt,Xa=new Be;class rn{constructor(t=0,e=0,n=0,i=rn.DEFAULT_ORDER){this.isEuler=!0,this._x=t,this._y=e,this._z=n,this._order=i}get x(){return this._x}set x(t){this._x=t,this._onChangeCallback()}get y(){return this._y}set y(t){this._y=t,this._onChangeCallback()}get z(){return this._z}set z(t){this._z=t,this._onChangeCallback()}get order(){return this._order}set order(t){this._order=t,this._onChangeCallback()}set(t,e,n,i=this._order){return this._x=t,this._y=e,this._z=n,this._order=i,this._onChangeCallback(),this}clone(){return new this.constructor(this._x,this._y,this._z,this._order)}copy(t){return this._x=t._x,this._y=t._y,this._z=t._z,this._order=t._order,this._onChangeCallback(),this}setFromRotationMatrix(t,e=this._order,n=!0){const i=t.elements,s=i[0],o=i[4],a=i[8],l=i[1],c=i[5],d=i[9],u=i[2],h=i[6],f=i[10];switch(e){case"XYZ":this._y=Math.asin(jt(a,-1,1)),Math.abs(a)<.9999999?(this._x=Math.atan2(-d,f),this._z=Math.atan2(-o,s)):(this._x=Math.atan2(h,c),this._z=0);break;case"YXZ":this._x=Math.asin(-jt(d,-1,1)),Math.abs(d)<.9999999?(this._y=Math.atan2(a,f),this._z=Math.atan2(l,c)):(this._y=Math.atan2(-u,s),this._z=0);break;case"ZXY":this._x=Math.asin(jt(h,-1,1)),Math.abs(h)<.9999999?(this._y=Math.atan2(-u,f),this._z=Math.atan2(-o,c)):(this._y=0,this._z=Math.atan2(l,s));break;case"ZYX":this._y=Math.asin(-jt(u,-1,1)),Math.abs(u)<.9999999?(this._x=Math.atan2(h,f),this._z=Math.atan2(l,s)):(this._x=0,this._z=Math.atan2(-o,c));break;case"YZX":this._z=Math.asin(jt(l,-1,1)),Math.abs(l)<.9999999?(this._x=Math.atan2(-d,c),this._y=Math.atan2(-u,s)):(this._x=0,this._y=Math.atan2(a,f));break;case"XZY":this._z=Math.asin(-jt(o,-1,1)),Math.abs(o)<.9999999?(this._x=Math.atan2(h,c),this._y=Math.atan2(a,s)):(this._x=Math.atan2(-d,f),this._y=0);break;default:Bt("Euler: .setFromRotationMatrix() encountered an unknown order: "+e)}return this._order=e,n===!0&&this._onChangeCallback(),this}setFromQuaternion(t,e,n){return Wa.makeRotationFromQuaternion(t),this.setFromRotationMatrix(Wa,e,n)}setFromVector3(t,e=this._order){return this.set(t.x,t.y,t.z,e)}reorder(t){return Xa.setFromEuler(this),this.setFromQuaternion(Xa,t)}equals(t){return t._x===this._x&&t._y===this._y&&t._z===this._z&&t._order===this._order}fromArray(t){return this._x=t[0],this._y=t[1],this._z=t[2],t[3]!==void 0&&(this._order=t[3]),this._onChangeCallback(),this}toArray(t=[],e=0){return t[e]=this._x,t[e+1]=this._y,t[e+2]=this._z,t[e+3]=this._order,t}_onChange(t){return this._onChangeCallback=t,this}_onChangeCallback(){}*[Symbol.iterator](){yield this._x,yield this._y,yield this._z,yield this._order}}rn.DEFAULT_ORDER="XYZ";class bc{constructor(){this.mask=1}set(t){this.mask=(1<<t|0)>>>0}enable(t){this.mask|=1<<t|0}enableAll(){this.mask=-1}toggle(t){this.mask^=1<<t|0}disable(t){this.mask&=~(1<<t|0)}disableAll(){this.mask=0}test(t){return(this.mask&t.mask)!==0}isEnabled(t){return(this.mask&(1<<t|0))!==0}}let jh=0;const qa=new E,hi=new Be,_n=new Qt,hs=new E,Fi=new E,Qh=new E,td=new Be,Ya=new E(1,0,0),$a=new E(0,1,0),Ka=new E(0,0,1),Ja={type:"added"},ed={type:"removed"},di={type:"childadded",child:null},vr={type:"childremoved",child:null};class Pe extends ii{constructor(){super(),this.isObject3D=!0,Object.defineProperty(this,"id",{value:jh++}),this.uuid=Pi(),this.name="",this.type="Object3D",this.parent=null,this.children=[],this.up=Pe.DEFAULT_UP.clone();const t=new E,e=new rn,n=new Be,i=new E(1,1,1);function s(){n.setFromEuler(e,!1)}function o(){e.setFromQuaternion(n,void 0,!1)}e._onChange(s),n._onChange(o),Object.defineProperties(this,{position:{configurable:!0,enumerable:!0,value:t},rotation:{configurable:!0,enumerable:!0,value:e},quaternion:{configurable:!0,enumerable:!0,value:n},scale:{configurable:!0,enumerable:!0,value:i},modelViewMatrix:{value:new Qt},normalMatrix:{value:new Xt}}),this.matrix=new Qt,this.matrixWorld=new Qt,this.matrixAutoUpdate=Pe.DEFAULT_MATRIX_AUTO_UPDATE,this.matrixWorldAutoUpdate=Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE,this.matrixWorldNeedsUpdate=!1,this.layers=new bc,this.visible=!0,this.castShadow=!1,this.receiveShadow=!1,this.frustumCulled=!0,this.renderOrder=0,this.animations=[],this.customDepthMaterial=void 0,this.customDistanceMaterial=void 0,this.static=!1,this.userData={},this.pivot=null}onBeforeShadow(){}onAfterShadow(){}onBeforeRender(){}onAfterRender(){}applyMatrix4(t){this.matrixAutoUpdate&&this.updateMatrix(),this.matrix.premultiply(t),this.matrix.decompose(this.position,this.quaternion,this.scale)}applyQuaternion(t){return this.quaternion.premultiply(t),this}setRotationFromAxisAngle(t,e){this.quaternion.setFromAxisAngle(t,e)}setRotationFromEuler(t){this.quaternion.setFromEuler(t,!0)}setRotationFromMatrix(t){this.quaternion.setFromRotationMatrix(t)}setRotationFromQuaternion(t){this.quaternion.copy(t)}rotateOnAxis(t,e){return hi.setFromAxisAngle(t,e),this.quaternion.multiply(hi),this}rotateOnWorldAxis(t,e){return hi.setFromAxisAngle(t,e),this.quaternion.premultiply(hi),this}rotateX(t){return this.rotateOnAxis(Ya,t)}rotateY(t){return this.rotateOnAxis($a,t)}rotateZ(t){return this.rotateOnAxis(Ka,t)}translateOnAxis(t,e){return qa.copy(t).applyQuaternion(this.quaternion),this.position.add(qa.multiplyScalar(e)),this}translateX(t){return this.translateOnAxis(Ya,t)}translateY(t){return this.translateOnAxis($a,t)}translateZ(t){return this.translateOnAxis(Ka,t)}localToWorld(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(this.matrixWorld)}worldToLocal(t){return this.updateWorldMatrix(!0,!1),t.applyMatrix4(_n.copy(this.matrixWorld).invert())}lookAt(t,e,n){t.isVector3?hs.copy(t):hs.set(t,e,n);const i=this.parent;this.updateWorldMatrix(!0,!1),Fi.setFromMatrixPosition(this.matrixWorld),this.isCamera||this.isLight?_n.lookAt(Fi,hs,this.up):_n.lookAt(hs,Fi,this.up),this.quaternion.setFromRotationMatrix(_n),i&&(_n.extractRotation(i.matrixWorld),hi.setFromRotationMatrix(_n),this.quaternion.premultiply(hi.invert()))}add(t){if(arguments.length>1){for(let e=0;e<arguments.length;e++)this.add(arguments[e]);return this}return t===this?(ee("Object3D.add: object can't be added as a child of itself.",t),this):(t&&t.isObject3D?(t.removeFromParent(),t.parent=this,this.children.push(t),t.dispatchEvent(Ja),di.child=t,this.dispatchEvent(di),di.child=null):ee("Object3D.add: object not an instance of THREE.Object3D.",t),this)}remove(t){if(arguments.length>1){for(let n=0;n<arguments.length;n++)this.remove(arguments[n]);return this}const e=this.children.indexOf(t);return e!==-1&&(t.parent=null,this.children.splice(e,1),t.dispatchEvent(ed),vr.child=t,this.dispatchEvent(vr),vr.child=null),this}removeFromParent(){const t=this.parent;return t!==null&&t.remove(this),this}clear(){return this.remove(...this.children)}attach(t){return this.updateWorldMatrix(!0,!1),_n.copy(this.matrixWorld).invert(),t.parent!==null&&(t.parent.updateWorldMatrix(!0,!1),_n.multiply(t.parent.matrixWorld)),t.applyMatrix4(_n),t.removeFromParent(),t.parent=this,this.children.push(t),t.updateWorldMatrix(!1,!0),t.dispatchEvent(Ja),di.child=t,this.dispatchEvent(di),di.child=null,this}getObjectById(t){return this.getObjectByProperty("id",t)}getObjectByName(t){return this.getObjectByProperty("name",t)}getObjectByProperty(t,e){if(this[t]===e)return this;for(let n=0,i=this.children.length;n<i;n++){const o=this.children[n].getObjectByProperty(t,e);if(o!==void 0)return o}}getObjectsByProperty(t,e,n=[]){this[t]===e&&n.push(this);const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].getObjectsByProperty(t,e,n);return n}getWorldPosition(t){return this.updateWorldMatrix(!0,!1),t.setFromMatrixPosition(this.matrixWorld)}getWorldQuaternion(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,t,Qh),t}getWorldScale(t){return this.updateWorldMatrix(!0,!1),this.matrixWorld.decompose(Fi,td,t),t}getWorldDirection(t){this.updateWorldMatrix(!0,!1);const e=this.matrixWorld.elements;return t.set(e[8],e[9],e[10]).normalize()}raycast(){}traverse(t){t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverse(t)}traverseVisible(t){if(this.visible===!1)return;t(this);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].traverseVisible(t)}traverseAncestors(t){const e=this.parent;e!==null&&(t(e),e.traverseAncestors(t))}updateMatrix(){this.matrix.compose(this.position,this.quaternion,this.scale);const t=this.pivot;if(t!==null){const e=t.x,n=t.y,i=t.z,s=this.matrix.elements;s[12]+=e-s[0]*e-s[4]*n-s[8]*i,s[13]+=n-s[1]*e-s[5]*n-s[9]*i,s[14]+=i-s[2]*e-s[6]*n-s[10]*i}this.matrixWorldNeedsUpdate=!0}updateMatrixWorld(t){this.matrixAutoUpdate&&this.updateMatrix(),(this.matrixWorldNeedsUpdate||t)&&(this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),this.matrixWorldNeedsUpdate=!1,t=!0);const e=this.children;for(let n=0,i=e.length;n<i;n++)e[n].updateMatrixWorld(t)}updateWorldMatrix(t,e){const n=this.parent;if(t===!0&&n!==null&&n.updateWorldMatrix(!0,!1),this.matrixAutoUpdate&&this.updateMatrix(),this.matrixWorldAutoUpdate===!0&&(this.parent===null?this.matrixWorld.copy(this.matrix):this.matrixWorld.multiplyMatrices(this.parent.matrixWorld,this.matrix)),e===!0){const i=this.children;for(let s=0,o=i.length;s<o;s++)i[s].updateWorldMatrix(!1,!0)}}toJSON(t){const e=t===void 0||typeof t=="string",n={};e&&(t={geometries:{},materials:{},textures:{},images:{},shapes:{},skeletons:{},animations:{},nodes:{}},n.metadata={version:4.7,type:"Object",generator:"Object3D.toJSON"});const i={};i.uuid=this.uuid,i.type=this.type,this.name!==""&&(i.name=this.name),this.castShadow===!0&&(i.castShadow=!0),this.receiveShadow===!0&&(i.receiveShadow=!0),this.visible===!1&&(i.visible=!1),this.frustumCulled===!1&&(i.frustumCulled=!1),this.renderOrder!==0&&(i.renderOrder=this.renderOrder),this.static!==!1&&(i.static=this.static),Object.keys(this.userData).length>0&&(i.userData=this.userData),i.layers=this.layers.mask,i.matrix=this.matrix.toArray(),i.up=this.up.toArray(),this.pivot!==null&&(i.pivot=this.pivot.toArray()),this.matrixAutoUpdate===!1&&(i.matrixAutoUpdate=!1),this.morphTargetDictionary!==void 0&&(i.morphTargetDictionary=Object.assign({},this.morphTargetDictionary)),this.morphTargetInfluences!==void 0&&(i.morphTargetInfluences=this.morphTargetInfluences.slice()),this.isInstancedMesh&&(i.type="InstancedMesh",i.count=this.count,i.instanceMatrix=this.instanceMatrix.toJSON(),this.instanceColor!==null&&(i.instanceColor=this.instanceColor.toJSON())),this.isBatchedMesh&&(i.type="BatchedMesh",i.perObjectFrustumCulled=this.perObjectFrustumCulled,i.sortObjects=this.sortObjects,i.drawRanges=this._drawRanges,i.reservedRanges=this._reservedRanges,i.geometryInfo=this._geometryInfo.map(a=>({...a,boundingBox:a.boundingBox?a.boundingBox.toJSON():void 0,boundingSphere:a.boundingSphere?a.boundingSphere.toJSON():void 0})),i.instanceInfo=this._instanceInfo.map(a=>({...a})),i.availableInstanceIds=this._availableInstanceIds.slice(),i.availableGeometryIds=this._availableGeometryIds.slice(),i.nextIndexStart=this._nextIndexStart,i.nextVertexStart=this._nextVertexStart,i.geometryCount=this._geometryCount,i.maxInstanceCount=this._maxInstanceCount,i.maxVertexCount=this._maxVertexCount,i.maxIndexCount=this._maxIndexCount,i.geometryInitialized=this._geometryInitialized,i.matricesTexture=this._matricesTexture.toJSON(t),i.indirectTexture=this._indirectTexture.toJSON(t),this._colorsTexture!==null&&(i.colorsTexture=this._colorsTexture.toJSON(t)),this.boundingSphere!==null&&(i.boundingSphere=this.boundingSphere.toJSON()),this.boundingBox!==null&&(i.boundingBox=this.boundingBox.toJSON()));function s(a,l){return a[l.uuid]===void 0&&(a[l.uuid]=l.toJSON(t)),l.uuid}if(this.isScene)this.background&&(this.background.isColor?i.background=this.background.toJSON():this.background.isTexture&&(i.background=this.background.toJSON(t).uuid)),this.environment&&this.environment.isTexture&&this.environment.isRenderTargetTexture!==!0&&(i.environment=this.environment.toJSON(t).uuid);else if(this.isMesh||this.isLine||this.isPoints){i.geometry=s(t.geometries,this.geometry);const a=this.geometry.parameters;if(a!==void 0&&a.shapes!==void 0){const l=a.shapes;if(Array.isArray(l))for(let c=0,d=l.length;c<d;c++){const u=l[c];s(t.shapes,u)}else s(t.shapes,l)}}if(this.isSkinnedMesh&&(i.bindMode=this.bindMode,i.bindMatrix=this.bindMatrix.toArray(),this.skeleton!==void 0&&(s(t.skeletons,this.skeleton),i.skeleton=this.skeleton.uuid)),this.material!==void 0)if(Array.isArray(this.material)){const a=[];for(let l=0,c=this.material.length;l<c;l++)a.push(s(t.materials,this.material[l]));i.material=a}else i.material=s(t.materials,this.material);if(this.children.length>0){i.children=[];for(let a=0;a<this.children.length;a++)i.children.push(this.children[a].toJSON(t).object)}if(this.animations.length>0){i.animations=[];for(let a=0;a<this.animations.length;a++){const l=this.animations[a];i.animations.push(s(t.animations,l))}}if(e){const a=o(t.geometries),l=o(t.materials),c=o(t.textures),d=o(t.images),u=o(t.shapes),h=o(t.skeletons),f=o(t.animations),g=o(t.nodes);a.length>0&&(n.geometries=a),l.length>0&&(n.materials=l),c.length>0&&(n.textures=c),d.length>0&&(n.images=d),u.length>0&&(n.shapes=u),h.length>0&&(n.skeletons=h),f.length>0&&(n.animations=f),g.length>0&&(n.nodes=g)}return n.object=i,n;function o(a){const l=[];for(const c in a){const d=a[c];delete d.metadata,l.push(d)}return l}}clone(t){return new this.constructor().copy(this,t)}copy(t,e=!0){if(this.name=t.name,this.up.copy(t.up),this.position.copy(t.position),this.rotation.order=t.rotation.order,this.quaternion.copy(t.quaternion),this.scale.copy(t.scale),this.pivot=t.pivot!==null?t.pivot.clone():null,this.matrix.copy(t.matrix),this.matrixWorld.copy(t.matrixWorld),this.matrixAutoUpdate=t.matrixAutoUpdate,this.matrixWorldAutoUpdate=t.matrixWorldAutoUpdate,this.matrixWorldNeedsUpdate=t.matrixWorldNeedsUpdate,this.layers.mask=t.layers.mask,this.visible=t.visible,this.castShadow=t.castShadow,this.receiveShadow=t.receiveShadow,this.frustumCulled=t.frustumCulled,this.renderOrder=t.renderOrder,this.static=t.static,this.animations=t.animations.slice(),this.userData=JSON.parse(JSON.stringify(t.userData)),e===!0)for(let n=0;n<t.children.length;n++){const i=t.children[n];this.add(i.clone())}return this}}Pe.DEFAULT_UP=new E(0,1,0);Pe.DEFAULT_MATRIX_AUTO_UPDATE=!0;Pe.DEFAULT_MATRIX_WORLD_AUTO_UPDATE=!0;class be extends Pe{constructor(){super(),this.isGroup=!0,this.type="Group"}}const nd={type:"move"};class Mr{constructor(){this._targetRay=null,this._grip=null,this._hand=null}getHandSpace(){return this._hand===null&&(this._hand=new be,this._hand.matrixAutoUpdate=!1,this._hand.visible=!1,this._hand.joints={},this._hand.inputState={pinching:!1}),this._hand}getTargetRaySpace(){return this._targetRay===null&&(this._targetRay=new be,this._targetRay.matrixAutoUpdate=!1,this._targetRay.visible=!1,this._targetRay.hasLinearVelocity=!1,this._targetRay.linearVelocity=new E,this._targetRay.hasAngularVelocity=!1,this._targetRay.angularVelocity=new E),this._targetRay}getGripSpace(){return this._grip===null&&(this._grip=new be,this._grip.matrixAutoUpdate=!1,this._grip.visible=!1,this._grip.hasLinearVelocity=!1,this._grip.linearVelocity=new E,this._grip.hasAngularVelocity=!1,this._grip.angularVelocity=new E,this._grip.eventsEnabled=!1),this._grip}dispatchEvent(t){return this._targetRay!==null&&this._targetRay.dispatchEvent(t),this._grip!==null&&this._grip.dispatchEvent(t),this._hand!==null&&this._hand.dispatchEvent(t),this}connect(t){if(t&&t.hand){const e=this._hand;if(e)for(const n of t.hand.values())this._getHandJoint(e,n)}return this.dispatchEvent({type:"connected",data:t}),this}disconnect(t){return this.dispatchEvent({type:"disconnected",data:t}),this._targetRay!==null&&(this._targetRay.visible=!1),this._grip!==null&&(this._grip.visible=!1),this._hand!==null&&(this._hand.visible=!1),this}update(t,e,n){let i=null,s=null,o=null;const a=this._targetRay,l=this._grip,c=this._hand;if(t&&e.session.visibilityState!=="visible-blurred"){if(c&&t.hand){o=!0;for(const y of t.hand.values()){const p=e.getJointPose(y,n),m=this._getHandJoint(c,y);p!==null&&(m.matrix.fromArray(p.transform.matrix),m.matrix.decompose(m.position,m.rotation,m.scale),m.matrixWorldNeedsUpdate=!0,m.jointRadius=p.radius),m.visible=p!==null}const d=c.joints["index-finger-tip"],u=c.joints["thumb-tip"],h=d.position.distanceTo(u.position),f=.02,g=.005;c.inputState.pinching&&h>f+g?(c.inputState.pinching=!1,this.dispatchEvent({type:"pinchend",handedness:t.handedness,target:this})):!c.inputState.pinching&&h<=f-g&&(c.inputState.pinching=!0,this.dispatchEvent({type:"pinchstart",handedness:t.handedness,target:this}))}else l!==null&&t.gripSpace&&(s=e.getPose(t.gripSpace,n),s!==null&&(l.matrix.fromArray(s.transform.matrix),l.matrix.decompose(l.position,l.rotation,l.scale),l.matrixWorldNeedsUpdate=!0,s.linearVelocity?(l.hasLinearVelocity=!0,l.linearVelocity.copy(s.linearVelocity)):l.hasLinearVelocity=!1,s.angularVelocity?(l.hasAngularVelocity=!0,l.angularVelocity.copy(s.angularVelocity)):l.hasAngularVelocity=!1,l.eventsEnabled&&l.dispatchEvent({type:"gripUpdated",data:t,target:this})));a!==null&&(i=e.getPose(t.targetRaySpace,n),i===null&&s!==null&&(i=s),i!==null&&(a.matrix.fromArray(i.transform.matrix),a.matrix.decompose(a.position,a.rotation,a.scale),a.matrixWorldNeedsUpdate=!0,i.linearVelocity?(a.hasLinearVelocity=!0,a.linearVelocity.copy(i.linearVelocity)):a.hasLinearVelocity=!1,i.angularVelocity?(a.hasAngularVelocity=!0,a.angularVelocity.copy(i.angularVelocity)):a.hasAngularVelocity=!1,this.dispatchEvent(nd)))}return a!==null&&(a.visible=i!==null),l!==null&&(l.visible=s!==null),c!==null&&(c.visible=o!==null),this}_getHandJoint(t,e){if(t.joints[e.jointName]===void 0){const n=new be;n.matrixAutoUpdate=!1,n.visible=!1,t.joints[e.jointName]=n,t.add(n)}return t.joints[e.jointName]}}const Ec={aliceblue:15792383,antiquewhite:16444375,aqua:65535,aquamarine:8388564,azure:15794175,beige:16119260,bisque:16770244,black:0,blanchedalmond:16772045,blue:255,blueviolet:9055202,brown:10824234,burlywood:14596231,cadetblue:6266528,chartreuse:8388352,chocolate:13789470,coral:16744272,cornflowerblue:6591981,cornsilk:16775388,crimson:14423100,cyan:65535,darkblue:139,darkcyan:35723,darkgoldenrod:12092939,darkgray:11119017,darkgreen:25600,darkgrey:11119017,darkkhaki:12433259,darkmagenta:9109643,darkolivegreen:5597999,darkorange:16747520,darkorchid:10040012,darkred:9109504,darksalmon:15308410,darkseagreen:9419919,darkslateblue:4734347,darkslategray:3100495,darkslategrey:3100495,darkturquoise:52945,darkviolet:9699539,deeppink:16716947,deepskyblue:49151,dimgray:6908265,dimgrey:6908265,dodgerblue:2003199,firebrick:11674146,floralwhite:16775920,forestgreen:2263842,fuchsia:16711935,gainsboro:14474460,ghostwhite:16316671,gold:16766720,goldenrod:14329120,gray:8421504,green:32768,greenyellow:11403055,grey:8421504,honeydew:15794160,hotpink:16738740,indianred:13458524,indigo:4915330,ivory:16777200,khaki:15787660,lavender:15132410,lavenderblush:16773365,lawngreen:8190976,lemonchiffon:16775885,lightblue:11393254,lightcoral:15761536,lightcyan:14745599,lightgoldenrodyellow:16448210,lightgray:13882323,lightgreen:9498256,lightgrey:13882323,lightpink:16758465,lightsalmon:16752762,lightseagreen:2142890,lightskyblue:8900346,lightslategray:7833753,lightslategrey:7833753,lightsteelblue:11584734,lightyellow:16777184,lime:65280,limegreen:3329330,linen:16445670,magenta:16711935,maroon:8388608,mediumaquamarine:6737322,mediumblue:205,mediumorchid:12211667,mediumpurple:9662683,mediumseagreen:3978097,mediumslateblue:8087790,mediumspringgreen:64154,mediumturquoise:4772300,mediumvioletred:13047173,midnightblue:1644912,mintcream:16121850,mistyrose:16770273,moccasin:16770229,navajowhite:16768685,navy:128,oldlace:16643558,olive:8421376,olivedrab:7048739,orange:16753920,orangered:16729344,orchid:14315734,palegoldenrod:15657130,palegreen:10025880,paleturquoise:11529966,palevioletred:14381203,papayawhip:16773077,peachpuff:16767673,peru:13468991,pink:16761035,plum:14524637,powderblue:11591910,purple:8388736,rebeccapurple:6697881,red:16711680,rosybrown:12357519,royalblue:4286945,saddlebrown:9127187,salmon:16416882,sandybrown:16032864,seagreen:3050327,seashell:16774638,sienna:10506797,silver:12632256,skyblue:8900331,slateblue:6970061,slategray:7372944,slategrey:7372944,snow:16775930,springgreen:65407,steelblue:4620980,tan:13808780,teal:32896,thistle:14204888,tomato:16737095,turquoise:4251856,violet:15631086,wheat:16113331,white:16777215,whitesmoke:16119285,yellow:16776960,yellowgreen:10145074},Nn={h:0,s:0,l:0},ds={h:0,s:0,l:0};function Sr(r,t,e){return e<0&&(e+=1),e>1&&(e-=1),e<1/6?r+(t-r)*6*e:e<1/2?t:e<2/3?r+(t-r)*6*(2/3-e):r}class yt{constructor(t,e,n){return this.isColor=!0,this.r=1,this.g=1,this.b=1,this.set(t,e,n)}set(t,e,n){if(e===void 0&&n===void 0){const i=t;i&&i.isColor?this.copy(i):typeof i=="number"?this.setHex(i):typeof i=="string"&&this.setStyle(i)}else this.setRGB(t,e,n);return this}setScalar(t){return this.r=t,this.g=t,this.b=t,this}setHex(t,e=Ke){return t=Math.floor(t),this.r=(t>>16&255)/255,this.g=(t>>8&255)/255,this.b=(t&255)/255,te.colorSpaceToWorking(this,e),this}setRGB(t,e,n,i=te.workingColorSpace){return this.r=t,this.g=e,this.b=n,te.colorSpaceToWorking(this,i),this}setHSL(t,e,n,i=te.workingColorSpace){if(t=Hh(t,1),e=jt(e,0,1),n=jt(n,0,1),e===0)this.r=this.g=this.b=n;else{const s=n<=.5?n*(1+e):n+e-n*e,o=2*n-s;this.r=Sr(o,s,t+1/3),this.g=Sr(o,s,t),this.b=Sr(o,s,t-1/3)}return te.colorSpaceToWorking(this,i),this}setStyle(t,e=Ke){function n(s){s!==void 0&&parseFloat(s)<1&&Bt("Color: Alpha component of "+t+" will be ignored.")}let i;if(i=/^(\w+)\(([^\)]*)\)/.exec(t)){let s;const o=i[1],a=i[2];switch(o){case"rgb":case"rgba":if(s=/^\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(255,parseInt(s[1],10))/255,Math.min(255,parseInt(s[2],10))/255,Math.min(255,parseInt(s[3],10))/255,e);if(s=/^\s*(\d+)\%\s*,\s*(\d+)\%\s*,\s*(\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setRGB(Math.min(100,parseInt(s[1],10))/100,Math.min(100,parseInt(s[2],10))/100,Math.min(100,parseInt(s[3],10))/100,e);break;case"hsl":case"hsla":if(s=/^\s*(\d*\.?\d+)\s*,\s*(\d*\.?\d+)\%\s*,\s*(\d*\.?\d+)\%\s*(?:,\s*(\d*\.?\d+)\s*)?$/.exec(a))return n(s[4]),this.setHSL(parseFloat(s[1])/360,parseFloat(s[2])/100,parseFloat(s[3])/100,e);break;default:Bt("Color: Unknown color model "+t)}}else if(i=/^\#([A-Fa-f\d]+)$/.exec(t)){const s=i[1],o=s.length;if(o===3)return this.setRGB(parseInt(s.charAt(0),16)/15,parseInt(s.charAt(1),16)/15,parseInt(s.charAt(2),16)/15,e);if(o===6)return this.setHex(parseInt(s,16),e);Bt("Color: Invalid hex color "+t)}else if(t&&t.length>0)return this.setColorName(t,e);return this}setColorName(t,e=Ke){const n=Ec[t.toLowerCase()];return n!==void 0?this.setHex(n,e):Bt("Color: Unknown color "+t),this}clone(){return new this.constructor(this.r,this.g,this.b)}copy(t){return this.r=t.r,this.g=t.g,this.b=t.b,this}copySRGBToLinear(t){return this.r=wn(t.r),this.g=wn(t.g),this.b=wn(t.b),this}copyLinearToSRGB(t){return this.r=Ei(t.r),this.g=Ei(t.g),this.b=Ei(t.b),this}convertSRGBToLinear(){return this.copySRGBToLinear(this),this}convertLinearToSRGB(){return this.copyLinearToSRGB(this),this}getHex(t=Ke){return te.workingToColorSpace(De.copy(this),t),Math.round(jt(De.r*255,0,255))*65536+Math.round(jt(De.g*255,0,255))*256+Math.round(jt(De.b*255,0,255))}getHexString(t=Ke){return("000000"+this.getHex(t).toString(16)).slice(-6)}getHSL(t,e=te.workingColorSpace){te.workingToColorSpace(De.copy(this),e);const n=De.r,i=De.g,s=De.b,o=Math.max(n,i,s),a=Math.min(n,i,s);let l,c;const d=(a+o)/2;if(a===o)l=0,c=0;else{const u=o-a;switch(c=d<=.5?u/(o+a):u/(2-o-a),o){case n:l=(i-s)/u+(i<s?6:0);break;case i:l=(s-n)/u+2;break;case s:l=(n-i)/u+4;break}l/=6}return t.h=l,t.s=c,t.l=d,t}getRGB(t,e=te.workingColorSpace){return te.workingToColorSpace(De.copy(this),e),t.r=De.r,t.g=De.g,t.b=De.b,t}getStyle(t=Ke){te.workingToColorSpace(De.copy(this),t);const e=De.r,n=De.g,i=De.b;return t!==Ke?`color(${t} ${e.toFixed(3)} ${n.toFixed(3)} ${i.toFixed(3)})`:`rgb(${Math.round(e*255)},${Math.round(n*255)},${Math.round(i*255)})`}offsetHSL(t,e,n){return this.getHSL(Nn),this.setHSL(Nn.h+t,Nn.s+e,Nn.l+n)}add(t){return this.r+=t.r,this.g+=t.g,this.b+=t.b,this}addColors(t,e){return this.r=t.r+e.r,this.g=t.g+e.g,this.b=t.b+e.b,this}addScalar(t){return this.r+=t,this.g+=t,this.b+=t,this}sub(t){return this.r=Math.max(0,this.r-t.r),this.g=Math.max(0,this.g-t.g),this.b=Math.max(0,this.b-t.b),this}multiply(t){return this.r*=t.r,this.g*=t.g,this.b*=t.b,this}multiplyScalar(t){return this.r*=t,this.g*=t,this.b*=t,this}lerp(t,e){return this.r+=(t.r-this.r)*e,this.g+=(t.g-this.g)*e,this.b+=(t.b-this.b)*e,this}lerpColors(t,e,n){return this.r=t.r+(e.r-t.r)*n,this.g=t.g+(e.g-t.g)*n,this.b=t.b+(e.b-t.b)*n,this}lerpHSL(t,e){this.getHSL(Nn),t.getHSL(ds);const n=pr(Nn.h,ds.h,e),i=pr(Nn.s,ds.s,e),s=pr(Nn.l,ds.l,e);return this.setHSL(n,i,s),this}setFromVector3(t){return this.r=t.x,this.g=t.y,this.b=t.z,this}applyMatrix3(t){const e=this.r,n=this.g,i=this.b,s=t.elements;return this.r=s[0]*e+s[3]*n+s[6]*i,this.g=s[1]*e+s[4]*n+s[7]*i,this.b=s[2]*e+s[5]*n+s[8]*i,this}equals(t){return t.r===this.r&&t.g===this.g&&t.b===this.b}fromArray(t,e=0){return this.r=t[e],this.g=t[e+1],this.b=t[e+2],this}toArray(t=[],e=0){return t[e]=this.r,t[e+1]=this.g,t[e+2]=this.b,t}fromBufferAttribute(t,e){return this.r=t.getX(e),this.g=t.getY(e),this.b=t.getZ(e),this}toJSON(){return this.getHex()}*[Symbol.iterator](){yield this.r,yield this.g,yield this.b}}const De=new yt;yt.NAMES=Ec;class ca{constructor(t,e=1,n=1e3){this.isFog=!0,this.name="",this.color=new yt(t),this.near=e,this.far=n}clone(){return new ca(this.color,this.near,this.far)}toJSON(){return{type:"Fog",name:this.name,color:this.color.getHex(),near:this.near,far:this.far}}}class Za extends Pe{constructor(){super(),this.isScene=!0,this.type="Scene",this.background=null,this.environment=null,this.fog=null,this.backgroundBlurriness=0,this.backgroundIntensity=1,this.backgroundRotation=new rn,this.environmentIntensity=1,this.environmentRotation=new rn,this.overrideMaterial=null,typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}copy(t,e){return super.copy(t,e),t.background!==null&&(this.background=t.background.clone()),t.environment!==null&&(this.environment=t.environment.clone()),t.fog!==null&&(this.fog=t.fog.clone()),this.backgroundBlurriness=t.backgroundBlurriness,this.backgroundIntensity=t.backgroundIntensity,this.backgroundRotation.copy(t.backgroundRotation),this.environmentIntensity=t.environmentIntensity,this.environmentRotation.copy(t.environmentRotation),t.overrideMaterial!==null&&(this.overrideMaterial=t.overrideMaterial.clone()),this.matrixAutoUpdate=t.matrixAutoUpdate,this}toJSON(t){const e=super.toJSON(t);return this.fog!==null&&(e.object.fog=this.fog.toJSON()),this.backgroundBlurriness>0&&(e.object.backgroundBlurriness=this.backgroundBlurriness),this.backgroundIntensity!==1&&(e.object.backgroundIntensity=this.backgroundIntensity),e.object.backgroundRotation=this.backgroundRotation.toArray(),this.environmentIntensity!==1&&(e.object.environmentIntensity=this.environmentIntensity),e.object.environmentRotation=this.environmentRotation.toArray(),e}}const je=new E,vn=new E,yr=new E,Mn=new E,ui=new E,fi=new E,ja=new E,br=new E,Er=new E,Tr=new E,wr=new xe,Ar=new xe,Cr=new xe;class en{constructor(t=new E,e=new E,n=new E){this.a=t,this.b=e,this.c=n}static getNormal(t,e,n,i){i.subVectors(n,e),je.subVectors(t,e),i.cross(je);const s=i.lengthSq();return s>0?i.multiplyScalar(1/Math.sqrt(s)):i.set(0,0,0)}static getBarycoord(t,e,n,i,s){je.subVectors(i,e),vn.subVectors(n,e),yr.subVectors(t,e);const o=je.dot(je),a=je.dot(vn),l=je.dot(yr),c=vn.dot(vn),d=vn.dot(yr),u=o*c-a*a;if(u===0)return s.set(0,0,0),null;const h=1/u,f=(c*l-a*d)*h,g=(o*d-a*l)*h;return s.set(1-f-g,g,f)}static containsPoint(t,e,n,i){return this.getBarycoord(t,e,n,i,Mn)===null?!1:Mn.x>=0&&Mn.y>=0&&Mn.x+Mn.y<=1}static getInterpolation(t,e,n,i,s,o,a,l){return this.getBarycoord(t,e,n,i,Mn)===null?(l.x=0,l.y=0,"z"in l&&(l.z=0),"w"in l&&(l.w=0),null):(l.setScalar(0),l.addScaledVector(s,Mn.x),l.addScaledVector(o,Mn.y),l.addScaledVector(a,Mn.z),l)}static getInterpolatedAttribute(t,e,n,i,s,o){return wr.setScalar(0),Ar.setScalar(0),Cr.setScalar(0),wr.fromBufferAttribute(t,e),Ar.fromBufferAttribute(t,n),Cr.fromBufferAttribute(t,i),o.setScalar(0),o.addScaledVector(wr,s.x),o.addScaledVector(Ar,s.y),o.addScaledVector(Cr,s.z),o}static isFrontFacing(t,e,n,i){return je.subVectors(n,e),vn.subVectors(t,e),je.cross(vn).dot(i)<0}set(t,e,n){return this.a.copy(t),this.b.copy(e),this.c.copy(n),this}setFromPointsAndIndices(t,e,n,i){return this.a.copy(t[e]),this.b.copy(t[n]),this.c.copy(t[i]),this}setFromAttributeAndIndices(t,e,n,i){return this.a.fromBufferAttribute(t,e),this.b.fromBufferAttribute(t,n),this.c.fromBufferAttribute(t,i),this}clone(){return new this.constructor().copy(this)}copy(t){return this.a.copy(t.a),this.b.copy(t.b),this.c.copy(t.c),this}getArea(){return je.subVectors(this.c,this.b),vn.subVectors(this.a,this.b),je.cross(vn).length()*.5}getMidpoint(t){return t.addVectors(this.a,this.b).add(this.c).multiplyScalar(1/3)}getNormal(t){return en.getNormal(this.a,this.b,this.c,t)}getPlane(t){return t.setFromCoplanarPoints(this.a,this.b,this.c)}getBarycoord(t,e){return en.getBarycoord(t,this.a,this.b,this.c,e)}getInterpolation(t,e,n,i,s){return en.getInterpolation(t,this.a,this.b,this.c,e,n,i,s)}containsPoint(t){return en.containsPoint(t,this.a,this.b,this.c)}isFrontFacing(t){return en.isFrontFacing(this.a,this.b,this.c,t)}intersectsBox(t){return t.intersectsTriangle(this)}closestPointToPoint(t,e){const n=this.a,i=this.b,s=this.c;let o,a;ui.subVectors(i,n),fi.subVectors(s,n),br.subVectors(t,n);const l=ui.dot(br),c=fi.dot(br);if(l<=0&&c<=0)return e.copy(n);Er.subVectors(t,i);const d=ui.dot(Er),u=fi.dot(Er);if(d>=0&&u<=d)return e.copy(i);const h=l*u-d*c;if(h<=0&&l>=0&&d<=0)return o=l/(l-d),e.copy(n).addScaledVector(ui,o);Tr.subVectors(t,s);const f=ui.dot(Tr),g=fi.dot(Tr);if(g>=0&&f<=g)return e.copy(s);const y=f*c-l*g;if(y<=0&&c>=0&&g<=0)return a=c/(c-g),e.copy(n).addScaledVector(fi,a);const p=d*g-f*u;if(p<=0&&u-d>=0&&f-g>=0)return ja.subVectors(s,i),a=(u-d)/(u-d+(f-g)),e.copy(i).addScaledVector(ja,a);const m=1/(p+y+h);return o=y*m,a=h*m,e.copy(n).addScaledVector(ui,o).addScaledVector(fi,a)}equals(t){return t.a.equals(this.a)&&t.b.equals(this.b)&&t.c.equals(this.c)}}class si{constructor(t=new E(1/0,1/0,1/0),e=new E(-1/0,-1/0,-1/0)){this.isBox3=!0,this.min=t,this.max=e}set(t,e){return this.min.copy(t),this.max.copy(e),this}setFromArray(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e+=3)this.expandByPoint(Qe.fromArray(t,e));return this}setFromBufferAttribute(t){this.makeEmpty();for(let e=0,n=t.count;e<n;e++)this.expandByPoint(Qe.fromBufferAttribute(t,e));return this}setFromPoints(t){this.makeEmpty();for(let e=0,n=t.length;e<n;e++)this.expandByPoint(t[e]);return this}setFromCenterAndSize(t,e){const n=Qe.copy(e).multiplyScalar(.5);return this.min.copy(t).sub(n),this.max.copy(t).add(n),this}setFromObject(t,e=!1){return this.makeEmpty(),this.expandByObject(t,e)}clone(){return new this.constructor().copy(this)}copy(t){return this.min.copy(t.min),this.max.copy(t.max),this}makeEmpty(){return this.min.x=this.min.y=this.min.z=1/0,this.max.x=this.max.y=this.max.z=-1/0,this}isEmpty(){return this.max.x<this.min.x||this.max.y<this.min.y||this.max.z<this.min.z}getCenter(t){return this.isEmpty()?t.set(0,0,0):t.addVectors(this.min,this.max).multiplyScalar(.5)}getSize(t){return this.isEmpty()?t.set(0,0,0):t.subVectors(this.max,this.min)}expandByPoint(t){return this.min.min(t),this.max.max(t),this}expandByVector(t){return this.min.sub(t),this.max.add(t),this}expandByScalar(t){return this.min.addScalar(-t),this.max.addScalar(t),this}expandByObject(t,e=!1){t.updateWorldMatrix(!1,!1);const n=t.geometry;if(n!==void 0){const s=n.getAttribute("position");if(e===!0&&s!==void 0&&t.isInstancedMesh!==!0)for(let o=0,a=s.count;o<a;o++)t.isMesh===!0?t.getVertexPosition(o,Qe):Qe.fromBufferAttribute(s,o),Qe.applyMatrix4(t.matrixWorld),this.expandByPoint(Qe);else t.boundingBox!==void 0?(t.boundingBox===null&&t.computeBoundingBox(),us.copy(t.boundingBox)):(n.boundingBox===null&&n.computeBoundingBox(),us.copy(n.boundingBox)),us.applyMatrix4(t.matrixWorld),this.union(us)}const i=t.children;for(let s=0,o=i.length;s<o;s++)this.expandByObject(i[s],e);return this}containsPoint(t){return t.x>=this.min.x&&t.x<=this.max.x&&t.y>=this.min.y&&t.y<=this.max.y&&t.z>=this.min.z&&t.z<=this.max.z}containsBox(t){return this.min.x<=t.min.x&&t.max.x<=this.max.x&&this.min.y<=t.min.y&&t.max.y<=this.max.y&&this.min.z<=t.min.z&&t.max.z<=this.max.z}getParameter(t,e){return e.set((t.x-this.min.x)/(this.max.x-this.min.x),(t.y-this.min.y)/(this.max.y-this.min.y),(t.z-this.min.z)/(this.max.z-this.min.z))}intersectsBox(t){return t.max.x>=this.min.x&&t.min.x<=this.max.x&&t.max.y>=this.min.y&&t.min.y<=this.max.y&&t.max.z>=this.min.z&&t.min.z<=this.max.z}intersectsSphere(t){return this.clampPoint(t.center,Qe),Qe.distanceToSquared(t.center)<=t.radius*t.radius}intersectsPlane(t){let e,n;return t.normal.x>0?(e=t.normal.x*this.min.x,n=t.normal.x*this.max.x):(e=t.normal.x*this.max.x,n=t.normal.x*this.min.x),t.normal.y>0?(e+=t.normal.y*this.min.y,n+=t.normal.y*this.max.y):(e+=t.normal.y*this.max.y,n+=t.normal.y*this.min.y),t.normal.z>0?(e+=t.normal.z*this.min.z,n+=t.normal.z*this.max.z):(e+=t.normal.z*this.max.z,n+=t.normal.z*this.min.z),e<=-t.constant&&n>=-t.constant}intersectsTriangle(t){if(this.isEmpty())return!1;this.getCenter(Oi),fs.subVectors(this.max,Oi),pi.subVectors(t.a,Oi),mi.subVectors(t.b,Oi),gi.subVectors(t.c,Oi),Un.subVectors(mi,pi),Fn.subVectors(gi,mi),Wn.subVectors(pi,gi);let e=[0,-Un.z,Un.y,0,-Fn.z,Fn.y,0,-Wn.z,Wn.y,Un.z,0,-Un.x,Fn.z,0,-Fn.x,Wn.z,0,-Wn.x,-Un.y,Un.x,0,-Fn.y,Fn.x,0,-Wn.y,Wn.x,0];return!Rr(e,pi,mi,gi,fs)||(e=[1,0,0,0,1,0,0,0,1],!Rr(e,pi,mi,gi,fs))?!1:(ps.crossVectors(Un,Fn),e=[ps.x,ps.y,ps.z],Rr(e,pi,mi,gi,fs))}clampPoint(t,e){return e.copy(t).clamp(this.min,this.max)}distanceToPoint(t){return this.clampPoint(t,Qe).distanceTo(t)}getBoundingSphere(t){return this.isEmpty()?t.makeEmpty():(this.getCenter(t.center),t.radius=this.getSize(Qe).length()*.5),t}intersect(t){return this.min.max(t.min),this.max.min(t.max),this.isEmpty()&&this.makeEmpty(),this}union(t){return this.min.min(t.min),this.max.max(t.max),this}applyMatrix4(t){return this.isEmpty()?this:(Sn[0].set(this.min.x,this.min.y,this.min.z).applyMatrix4(t),Sn[1].set(this.min.x,this.min.y,this.max.z).applyMatrix4(t),Sn[2].set(this.min.x,this.max.y,this.min.z).applyMatrix4(t),Sn[3].set(this.min.x,this.max.y,this.max.z).applyMatrix4(t),Sn[4].set(this.max.x,this.min.y,this.min.z).applyMatrix4(t),Sn[5].set(this.max.x,this.min.y,this.max.z).applyMatrix4(t),Sn[6].set(this.max.x,this.max.y,this.min.z).applyMatrix4(t),Sn[7].set(this.max.x,this.max.y,this.max.z).applyMatrix4(t),this.setFromPoints(Sn),this)}translate(t){return this.min.add(t),this.max.add(t),this}equals(t){return t.min.equals(this.min)&&t.max.equals(this.max)}toJSON(){return{min:this.min.toArray(),max:this.max.toArray()}}fromJSON(t){return this.min.fromArray(t.min),this.max.fromArray(t.max),this}}const Sn=[new E,new E,new E,new E,new E,new E,new E,new E],Qe=new E,us=new si,pi=new E,mi=new E,gi=new E,Un=new E,Fn=new E,Wn=new E,Oi=new E,fs=new E,ps=new E,Xn=new E;function Rr(r,t,e,n,i){for(let s=0,o=r.length-3;s<=o;s+=3){Xn.fromArray(r,s);const a=i.x*Math.abs(Xn.x)+i.y*Math.abs(Xn.y)+i.z*Math.abs(Xn.z),l=t.dot(Xn),c=e.dot(Xn),d=n.dot(Xn);if(Math.max(-Math.max(l,c,d),Math.min(l,c,d))>a)return!1}return!0}const ye=new E,ms=new ot;let id=0;class Fe extends ii{constructor(t,e,n=!1){if(super(),Array.isArray(t))throw new TypeError("THREE.BufferAttribute: array should be a Typed Array.");this.isBufferAttribute=!0,Object.defineProperty(this,"id",{value:id++}),this.name="",this.array=t,this.itemSize=e,this.count=t!==void 0?t.length/e:0,this.normalized=n,this.usage=Oa,this.updateRanges=[],this.gpuType=nn,this.version=0}onUploadCallback(){}set needsUpdate(t){t===!0&&this.version++}setUsage(t){return this.usage=t,this}addUpdateRange(t,e){this.updateRanges.push({start:t,count:e})}clearUpdateRanges(){this.updateRanges.length=0}copy(t){return this.name=t.name,this.array=new t.array.constructor(t.array),this.itemSize=t.itemSize,this.count=t.count,this.normalized=t.normalized,this.usage=t.usage,this.gpuType=t.gpuType,this}copyAt(t,e,n){t*=this.itemSize,n*=e.itemSize;for(let i=0,s=this.itemSize;i<s;i++)this.array[t+i]=e.array[n+i];return this}copyArray(t){return this.array.set(t),this}applyMatrix3(t){if(this.itemSize===2)for(let e=0,n=this.count;e<n;e++)ms.fromBufferAttribute(this,e),ms.applyMatrix3(t),this.setXY(e,ms.x,ms.y);else if(this.itemSize===3)for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix3(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyMatrix4(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyMatrix4(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}applyNormalMatrix(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.applyNormalMatrix(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}transformDirection(t){for(let e=0,n=this.count;e<n;e++)ye.fromBufferAttribute(this,e),ye.transformDirection(t),this.setXYZ(e,ye.x,ye.y,ye.z);return this}set(t,e=0){return this.array.set(t,e),this}getComponent(t,e){let n=this.array[t*this.itemSize+e];return this.normalized&&(n=Ui(n,this.array)),n}setComponent(t,e,n){return this.normalized&&(n=ke(n,this.array)),this.array[t*this.itemSize+e]=n,this}getX(t){let e=this.array[t*this.itemSize];return this.normalized&&(e=Ui(e,this.array)),e}setX(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize]=e,this}getY(t){let e=this.array[t*this.itemSize+1];return this.normalized&&(e=Ui(e,this.array)),e}setY(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+1]=e,this}getZ(t){let e=this.array[t*this.itemSize+2];return this.normalized&&(e=Ui(e,this.array)),e}setZ(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+2]=e,this}getW(t){let e=this.array[t*this.itemSize+3];return this.normalized&&(e=Ui(e,this.array)),e}setW(t,e){return this.normalized&&(e=ke(e,this.array)),this.array[t*this.itemSize+3]=e,this}setXY(t,e,n){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),n=ke(n,this.array)),this.array[t+0]=e,this.array[t+1]=n,this}setXYZ(t,e,n,i){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),n=ke(n,this.array),i=ke(i,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this}setXYZW(t,e,n,i,s){return t*=this.itemSize,this.normalized&&(e=ke(e,this.array),n=ke(n,this.array),i=ke(i,this.array),s=ke(s,this.array)),this.array[t+0]=e,this.array[t+1]=n,this.array[t+2]=i,this.array[t+3]=s,this}onUpload(t){return this.onUploadCallback=t,this}clone(){return new this.constructor(this.array,this.itemSize).copy(this)}toJSON(){const t={itemSize:this.itemSize,type:this.array.constructor.name,array:Array.from(this.array),normalized:this.normalized};return this.name!==""&&(t.name=this.name),this.usage!==Oa&&(t.usage=this.usage),t}dispose(){this.dispatchEvent({type:"dispose"})}}class Tc extends Fe{constructor(t,e,n){super(new Uint16Array(t),e,n)}}class wc extends Fe{constructor(t,e,n){super(new Uint32Array(t),e,n)}}class fe extends Fe{constructor(t,e,n){super(new Float32Array(t),e,n)}}const sd=new si,Bi=new E,Pr=new E;class Li{constructor(t=new E,e=-1){this.isSphere=!0,this.center=t,this.radius=e}set(t,e){return this.center.copy(t),this.radius=e,this}setFromPoints(t,e){const n=this.center;e!==void 0?n.copy(e):sd.setFromPoints(t).getCenter(n);let i=0;for(let s=0,o=t.length;s<o;s++)i=Math.max(i,n.distanceToSquared(t[s]));return this.radius=Math.sqrt(i),this}copy(t){return this.center.copy(t.center),this.radius=t.radius,this}isEmpty(){return this.radius<0}makeEmpty(){return this.center.set(0,0,0),this.radius=-1,this}containsPoint(t){return t.distanceToSquared(this.center)<=this.radius*this.radius}distanceToPoint(t){return t.distanceTo(this.center)-this.radius}intersectsSphere(t){const e=this.radius+t.radius;return t.center.distanceToSquared(this.center)<=e*e}intersectsBox(t){return t.intersectsSphere(this)}intersectsPlane(t){return Math.abs(t.distanceToPoint(this.center))<=this.radius}clampPoint(t,e){const n=this.center.distanceToSquared(t);return e.copy(t),n>this.radius*this.radius&&(e.sub(this.center).normalize(),e.multiplyScalar(this.radius).add(this.center)),e}getBoundingBox(t){return this.isEmpty()?(t.makeEmpty(),t):(t.set(this.center,this.center),t.expandByScalar(this.radius),t)}applyMatrix4(t){return this.center.applyMatrix4(t),this.radius=this.radius*t.getMaxScaleOnAxis(),this}translate(t){return this.center.add(t),this}expandByPoint(t){if(this.isEmpty())return this.center.copy(t),this.radius=0,this;Bi.subVectors(t,this.center);const e=Bi.lengthSq();if(e>this.radius*this.radius){const n=Math.sqrt(e),i=(n-this.radius)*.5;this.center.addScaledVector(Bi,i/n),this.radius+=i}return this}union(t){return t.isEmpty()?this:this.isEmpty()?(this.copy(t),this):(this.center.equals(t.center)===!0?this.radius=Math.max(this.radius,t.radius):(Pr.subVectors(t.center,this.center).setLength(t.radius),this.expandByPoint(Bi.copy(t.center).add(Pr)),this.expandByPoint(Bi.copy(t.center).sub(Pr))),this)}equals(t){return t.center.equals(this.center)&&t.radius===this.radius}clone(){return new this.constructor().copy(this)}toJSON(){return{radius:this.radius,center:this.center.toArray()}}fromJSON(t){return this.radius=t.radius,this.center.fromArray(t.center),this}}let rd=0;const $e=new Qt,Lr=new Pe,xi=new E,We=new si,ki=new si,Ce=new E;class Ae extends ii{constructor(){super(),this.isBufferGeometry=!0,Object.defineProperty(this,"id",{value:rd++}),this.uuid=Pi(),this.name="",this.type="BufferGeometry",this.index=null,this.indirect=null,this.indirectOffset=0,this.attributes={},this.morphAttributes={},this.morphTargetsRelative=!1,this.groups=[],this.boundingBox=null,this.boundingSphere=null,this.drawRange={start:0,count:1/0},this.userData={}}getIndex(){return this.index}setIndex(t){return Array.isArray(t)?this.index=new(kh(t)?wc:Tc)(t,1):this.index=t,this}setIndirect(t,e=0){return this.indirect=t,this.indirectOffset=e,this}getIndirect(){return this.indirect}getAttribute(t){return this.attributes[t]}setAttribute(t,e){return this.attributes[t]=e,this}deleteAttribute(t){return delete this.attributes[t],this}hasAttribute(t){return this.attributes[t]!==void 0}addGroup(t,e,n=0){this.groups.push({start:t,count:e,materialIndex:n})}clearGroups(){this.groups=[]}setDrawRange(t,e){this.drawRange.start=t,this.drawRange.count=e}applyMatrix4(t){const e=this.attributes.position;e!==void 0&&(e.applyMatrix4(t),e.needsUpdate=!0);const n=this.attributes.normal;if(n!==void 0){const s=new Xt().getNormalMatrix(t);n.applyNormalMatrix(s),n.needsUpdate=!0}const i=this.attributes.tangent;return i!==void 0&&(i.transformDirection(t),i.needsUpdate=!0),this.boundingBox!==null&&this.computeBoundingBox(),this.boundingSphere!==null&&this.computeBoundingSphere(),this}applyQuaternion(t){return $e.makeRotationFromQuaternion(t),this.applyMatrix4($e),this}rotateX(t){return $e.makeRotationX(t),this.applyMatrix4($e),this}rotateY(t){return $e.makeRotationY(t),this.applyMatrix4($e),this}rotateZ(t){return $e.makeRotationZ(t),this.applyMatrix4($e),this}translate(t,e,n){return $e.makeTranslation(t,e,n),this.applyMatrix4($e),this}scale(t,e,n){return $e.makeScale(t,e,n),this.applyMatrix4($e),this}lookAt(t){return Lr.lookAt(t),Lr.updateMatrix(),this.applyMatrix4(Lr.matrix),this}center(){return this.computeBoundingBox(),this.boundingBox.getCenter(xi).negate(),this.translate(xi.x,xi.y,xi.z),this}setFromPoints(t){const e=this.getAttribute("position");if(e===void 0){const n=[];for(let i=0,s=t.length;i<s;i++){const o=t[i];n.push(o.x,o.y,o.z||0)}this.setAttribute("position",new fe(n,3))}else{const n=Math.min(t.length,e.count);for(let i=0;i<n;i++){const s=t[i];e.setXYZ(i,s.x,s.y,s.z||0)}t.length>e.count&&Bt("BufferGeometry: Buffer size too small for points data. Use .dispose() and create a new geometry."),e.needsUpdate=!0}return this}computeBoundingBox(){this.boundingBox===null&&(this.boundingBox=new si);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ee("BufferGeometry.computeBoundingBox(): GLBufferAttribute requires a manual bounding box.",this),this.boundingBox.set(new E(-1/0,-1/0,-1/0),new E(1/0,1/0,1/0));return}if(t!==void 0){if(this.boundingBox.setFromBufferAttribute(t),e)for(let n=0,i=e.length;n<i;n++){const s=e[n];We.setFromBufferAttribute(s),this.morphTargetsRelative?(Ce.addVectors(this.boundingBox.min,We.min),this.boundingBox.expandByPoint(Ce),Ce.addVectors(this.boundingBox.max,We.max),this.boundingBox.expandByPoint(Ce)):(this.boundingBox.expandByPoint(We.min),this.boundingBox.expandByPoint(We.max))}}else this.boundingBox.makeEmpty();(isNaN(this.boundingBox.min.x)||isNaN(this.boundingBox.min.y)||isNaN(this.boundingBox.min.z))&&ee('BufferGeometry.computeBoundingBox(): Computed min/max have NaN values. The "position" attribute is likely to have NaN values.',this)}computeBoundingSphere(){this.boundingSphere===null&&(this.boundingSphere=new Li);const t=this.attributes.position,e=this.morphAttributes.position;if(t&&t.isGLBufferAttribute){ee("BufferGeometry.computeBoundingSphere(): GLBufferAttribute requires a manual bounding sphere.",this),this.boundingSphere.set(new E,1/0);return}if(t){const n=this.boundingSphere.center;if(We.setFromBufferAttribute(t),e)for(let s=0,o=e.length;s<o;s++){const a=e[s];ki.setFromBufferAttribute(a),this.morphTargetsRelative?(Ce.addVectors(We.min,ki.min),We.expandByPoint(Ce),Ce.addVectors(We.max,ki.max),We.expandByPoint(Ce)):(We.expandByPoint(ki.min),We.expandByPoint(ki.max))}We.getCenter(n);let i=0;for(let s=0,o=t.count;s<o;s++)Ce.fromBufferAttribute(t,s),i=Math.max(i,n.distanceToSquared(Ce));if(e)for(let s=0,o=e.length;s<o;s++){const a=e[s],l=this.morphTargetsRelative;for(let c=0,d=a.count;c<d;c++)Ce.fromBufferAttribute(a,c),l&&(xi.fromBufferAttribute(t,c),Ce.add(xi)),i=Math.max(i,n.distanceToSquared(Ce))}this.boundingSphere.radius=Math.sqrt(i),isNaN(this.boundingSphere.radius)&&ee('BufferGeometry.computeBoundingSphere(): Computed radius is NaN. The "position" attribute is likely to have NaN values.',this)}}computeTangents(){const t=this.index,e=this.attributes;if(t===null||e.position===void 0||e.normal===void 0||e.uv===void 0){ee("BufferGeometry: .computeTangents() failed. Missing required attributes (index, position, normal or uv)");return}const n=e.position,i=e.normal,s=e.uv;this.hasAttribute("tangent")===!1&&this.setAttribute("tangent",new Fe(new Float32Array(4*n.count),4));const o=this.getAttribute("tangent"),a=[],l=[];for(let v=0;v<n.count;v++)a[v]=new E,l[v]=new E;const c=new E,d=new E,u=new E,h=new ot,f=new ot,g=new ot,y=new E,p=new E;function m(v,A,D){c.fromBufferAttribute(n,v),d.fromBufferAttribute(n,A),u.fromBufferAttribute(n,D),h.fromBufferAttribute(s,v),f.fromBufferAttribute(s,A),g.fromBufferAttribute(s,D),d.sub(c),u.sub(c),f.sub(h),g.sub(h);const L=1/(f.x*g.y-g.x*f.y);isFinite(L)&&(y.copy(d).multiplyScalar(g.y).addScaledVector(u,-f.y).multiplyScalar(L),p.copy(u).multiplyScalar(f.x).addScaledVector(d,-g.x).multiplyScalar(L),a[v].add(y),a[A].add(y),a[D].add(y),l[v].add(p),l[A].add(p),l[D].add(p))}let x=this.groups;x.length===0&&(x=[{start:0,count:t.count}]);for(let v=0,A=x.length;v<A;++v){const D=x[v],L=D.start,O=D.count;for(let W=L,q=L+O;W<q;W+=3)m(t.getX(W+0),t.getX(W+1),t.getX(W+2))}const M=new E,S=new E,C=new E,w=new E;function R(v){C.fromBufferAttribute(i,v),w.copy(C);const A=a[v];M.copy(A),M.sub(C.multiplyScalar(C.dot(A))).normalize(),S.crossVectors(w,A);const L=S.dot(l[v])<0?-1:1;o.setXYZW(v,M.x,M.y,M.z,L)}for(let v=0,A=x.length;v<A;++v){const D=x[v],L=D.start,O=D.count;for(let W=L,q=L+O;W<q;W+=3)R(t.getX(W+0)),R(t.getX(W+1)),R(t.getX(W+2))}}computeVertexNormals(){const t=this.index,e=this.getAttribute("position");if(e!==void 0){let n=this.getAttribute("normal");if(n===void 0)n=new Fe(new Float32Array(e.count*3),3),this.setAttribute("normal",n);else for(let h=0,f=n.count;h<f;h++)n.setXYZ(h,0,0,0);const i=new E,s=new E,o=new E,a=new E,l=new E,c=new E,d=new E,u=new E;if(t)for(let h=0,f=t.count;h<f;h+=3){const g=t.getX(h+0),y=t.getX(h+1),p=t.getX(h+2);i.fromBufferAttribute(e,g),s.fromBufferAttribute(e,y),o.fromBufferAttribute(e,p),d.subVectors(o,s),u.subVectors(i,s),d.cross(u),a.fromBufferAttribute(n,g),l.fromBufferAttribute(n,y),c.fromBufferAttribute(n,p),a.add(d),l.add(d),c.add(d),n.setXYZ(g,a.x,a.y,a.z),n.setXYZ(y,l.x,l.y,l.z),n.setXYZ(p,c.x,c.y,c.z)}else for(let h=0,f=e.count;h<f;h+=3)i.fromBufferAttribute(e,h+0),s.fromBufferAttribute(e,h+1),o.fromBufferAttribute(e,h+2),d.subVectors(o,s),u.subVectors(i,s),d.cross(u),n.setXYZ(h+0,d.x,d.y,d.z),n.setXYZ(h+1,d.x,d.y,d.z),n.setXYZ(h+2,d.x,d.y,d.z);this.normalizeNormals(),n.needsUpdate=!0}}normalizeNormals(){const t=this.attributes.normal;for(let e=0,n=t.count;e<n;e++)Ce.fromBufferAttribute(t,e),Ce.normalize(),t.setXYZ(e,Ce.x,Ce.y,Ce.z)}toNonIndexed(){function t(a,l){const c=a.array,d=a.itemSize,u=a.normalized,h=new c.constructor(l.length*d);let f=0,g=0;for(let y=0,p=l.length;y<p;y++){a.isInterleavedBufferAttribute?f=l[y]*a.data.stride+a.offset:f=l[y]*d;for(let m=0;m<d;m++)h[g++]=c[f++]}return new Fe(h,d,u)}if(this.index===null)return Bt("BufferGeometry.toNonIndexed(): BufferGeometry is already non-indexed."),this;const e=new Ae,n=this.index.array,i=this.attributes;for(const a in i){const l=i[a],c=t(l,n);e.setAttribute(a,c)}const s=this.morphAttributes;for(const a in s){const l=[],c=s[a];for(let d=0,u=c.length;d<u;d++){const h=c[d],f=t(h,n);l.push(f)}e.morphAttributes[a]=l}e.morphTargetsRelative=this.morphTargetsRelative;const o=this.groups;for(let a=0,l=o.length;a<l;a++){const c=o[a];e.addGroup(c.start,c.count,c.materialIndex)}return e}toJSON(){const t={metadata:{version:4.7,type:"BufferGeometry",generator:"BufferGeometry.toJSON"}};if(t.uuid=this.uuid,t.type=this.type,this.name!==""&&(t.name=this.name),Object.keys(this.userData).length>0&&(t.userData=this.userData),this.parameters!==void 0){const l=this.parameters;for(const c in l)l[c]!==void 0&&(t[c]=l[c]);return t}t.data={attributes:{}};const e=this.index;e!==null&&(t.data.index={type:e.array.constructor.name,array:Array.prototype.slice.call(e.array)});const n=this.attributes;for(const l in n){const c=n[l];t.data.attributes[l]=c.toJSON(t.data)}const i={};let s=!1;for(const l in this.morphAttributes){const c=this.morphAttributes[l],d=[];for(let u=0,h=c.length;u<h;u++){const f=c[u];d.push(f.toJSON(t.data))}d.length>0&&(i[l]=d,s=!0)}s&&(t.data.morphAttributes=i,t.data.morphTargetsRelative=this.morphTargetsRelative);const o=this.groups;o.length>0&&(t.data.groups=JSON.parse(JSON.stringify(o)));const a=this.boundingSphere;return a!==null&&(t.data.boundingSphere=a.toJSON()),t}clone(){return new this.constructor().copy(this)}copy(t){this.index=null,this.attributes={},this.morphAttributes={},this.groups=[],this.boundingBox=null,this.boundingSphere=null;const e={};this.name=t.name;const n=t.index;n!==null&&this.setIndex(n.clone());const i=t.attributes;for(const c in i){const d=i[c];this.setAttribute(c,d.clone(e))}const s=t.morphAttributes;for(const c in s){const d=[],u=s[c];for(let h=0,f=u.length;h<f;h++)d.push(u[h].clone(e));this.morphAttributes[c]=d}this.morphTargetsRelative=t.morphTargetsRelative;const o=t.groups;for(let c=0,d=o.length;c<d;c++){const u=o[c];this.addGroup(u.start,u.count,u.materialIndex)}const a=t.boundingBox;a!==null&&(this.boundingBox=a.clone());const l=t.boundingSphere;return l!==null&&(this.boundingSphere=l.clone()),this.drawRange.start=t.drawRange.start,this.drawRange.count=t.drawRange.count,this.userData=t.userData,this}dispose(){this.dispatchEvent({type:"dispose"})}}let od=0;class Ii extends ii{constructor(){super(),this.isMaterial=!0,Object.defineProperty(this,"id",{value:od++}),this.uuid=Pi(),this.name="",this.type="Material",this.blending=bi,this.side=Vn,this.vertexColors=!1,this.opacity=1,this.transparent=!1,this.alphaHash=!1,this.blendSrc=eo,this.blendDst=no,this.blendEquation=Jn,this.blendSrcAlpha=null,this.blendDstAlpha=null,this.blendEquationAlpha=null,this.blendColor=new yt(0,0,0),this.blendAlpha=0,this.depthFunc=Ti,this.depthTest=!0,this.depthWrite=!0,this.stencilWriteMask=255,this.stencilFunc=Fa,this.stencilRef=0,this.stencilFuncMask=255,this.stencilFail=ai,this.stencilZFail=ai,this.stencilZPass=ai,this.stencilWrite=!1,this.clippingPlanes=null,this.clipIntersection=!1,this.clipShadows=!1,this.shadowSide=null,this.colorWrite=!0,this.precision=null,this.polygonOffset=!1,this.polygonOffsetFactor=0,this.polygonOffsetUnits=0,this.dithering=!1,this.alphaToCoverage=!1,this.premultipliedAlpha=!1,this.forceSinglePass=!1,this.allowOverride=!0,this.visible=!0,this.toneMapped=!0,this.userData={},this.version=0,this._alphaTest=0}get alphaTest(){return this._alphaTest}set alphaTest(t){this._alphaTest>0!=t>0&&this.version++,this._alphaTest=t}onBeforeRender(){}onBeforeCompile(){}customProgramCacheKey(){return this.onBeforeCompile.toString()}setValues(t){if(t!==void 0)for(const e in t){const n=t[e];if(n===void 0){Bt(`Material: parameter '${e}' has value of undefined.`);continue}const i=this[e];if(i===void 0){Bt(`Material: '${e}' is not a property of THREE.${this.type}.`);continue}i&&i.isColor?i.set(n):i&&i.isVector3&&n&&n.isVector3?i.copy(n):this[e]=n}}toJSON(t){const e=t===void 0||typeof t=="string";e&&(t={textures:{},images:{}});const n={metadata:{version:4.7,type:"Material",generator:"Material.toJSON"}};n.uuid=this.uuid,n.type=this.type,this.name!==""&&(n.name=this.name),this.color&&this.color.isColor&&(n.color=this.color.getHex()),this.roughness!==void 0&&(n.roughness=this.roughness),this.metalness!==void 0&&(n.metalness=this.metalness),this.sheen!==void 0&&(n.sheen=this.sheen),this.sheenColor&&this.sheenColor.isColor&&(n.sheenColor=this.sheenColor.getHex()),this.sheenRoughness!==void 0&&(n.sheenRoughness=this.sheenRoughness),this.emissive&&this.emissive.isColor&&(n.emissive=this.emissive.getHex()),this.emissiveIntensity!==void 0&&this.emissiveIntensity!==1&&(n.emissiveIntensity=this.emissiveIntensity),this.specular&&this.specular.isColor&&(n.specular=this.specular.getHex()),this.specularIntensity!==void 0&&(n.specularIntensity=this.specularIntensity),this.specularColor&&this.specularColor.isColor&&(n.specularColor=this.specularColor.getHex()),this.shininess!==void 0&&(n.shininess=this.shininess),this.clearcoat!==void 0&&(n.clearcoat=this.clearcoat),this.clearcoatRoughness!==void 0&&(n.clearcoatRoughness=this.clearcoatRoughness),this.clearcoatMap&&this.clearcoatMap.isTexture&&(n.clearcoatMap=this.clearcoatMap.toJSON(t).uuid),this.clearcoatRoughnessMap&&this.clearcoatRoughnessMap.isTexture&&(n.clearcoatRoughnessMap=this.clearcoatRoughnessMap.toJSON(t).uuid),this.clearcoatNormalMap&&this.clearcoatNormalMap.isTexture&&(n.clearcoatNormalMap=this.clearcoatNormalMap.toJSON(t).uuid,n.clearcoatNormalScale=this.clearcoatNormalScale.toArray()),this.sheenColorMap&&this.sheenColorMap.isTexture&&(n.sheenColorMap=this.sheenColorMap.toJSON(t).uuid),this.sheenRoughnessMap&&this.sheenRoughnessMap.isTexture&&(n.sheenRoughnessMap=this.sheenRoughnessMap.toJSON(t).uuid),this.dispersion!==void 0&&(n.dispersion=this.dispersion),this.iridescence!==void 0&&(n.iridescence=this.iridescence),this.iridescenceIOR!==void 0&&(n.iridescenceIOR=this.iridescenceIOR),this.iridescenceThicknessRange!==void 0&&(n.iridescenceThicknessRange=this.iridescenceThicknessRange),this.iridescenceMap&&this.iridescenceMap.isTexture&&(n.iridescenceMap=this.iridescenceMap.toJSON(t).uuid),this.iridescenceThicknessMap&&this.iridescenceThicknessMap.isTexture&&(n.iridescenceThicknessMap=this.iridescenceThicknessMap.toJSON(t).uuid),this.anisotropy!==void 0&&(n.anisotropy=this.anisotropy),this.anisotropyRotation!==void 0&&(n.anisotropyRotation=this.anisotropyRotation),this.anisotropyMap&&this.anisotropyMap.isTexture&&(n.anisotropyMap=this.anisotropyMap.toJSON(t).uuid),this.map&&this.map.isTexture&&(n.map=this.map.toJSON(t).uuid),this.matcap&&this.matcap.isTexture&&(n.matcap=this.matcap.toJSON(t).uuid),this.alphaMap&&this.alphaMap.isTexture&&(n.alphaMap=this.alphaMap.toJSON(t).uuid),this.lightMap&&this.lightMap.isTexture&&(n.lightMap=this.lightMap.toJSON(t).uuid,n.lightMapIntensity=this.lightMapIntensity),this.aoMap&&this.aoMap.isTexture&&(n.aoMap=this.aoMap.toJSON(t).uuid,n.aoMapIntensity=this.aoMapIntensity),this.bumpMap&&this.bumpMap.isTexture&&(n.bumpMap=this.bumpMap.toJSON(t).uuid,n.bumpScale=this.bumpScale),this.normalMap&&this.normalMap.isTexture&&(n.normalMap=this.normalMap.toJSON(t).uuid,n.normalMapType=this.normalMapType,n.normalScale=this.normalScale.toArray()),this.displacementMap&&this.displacementMap.isTexture&&(n.displacementMap=this.displacementMap.toJSON(t).uuid,n.displacementScale=this.displacementScale,n.displacementBias=this.displacementBias),this.roughnessMap&&this.roughnessMap.isTexture&&(n.roughnessMap=this.roughnessMap.toJSON(t).uuid),this.metalnessMap&&this.metalnessMap.isTexture&&(n.metalnessMap=this.metalnessMap.toJSON(t).uuid),this.emissiveMap&&this.emissiveMap.isTexture&&(n.emissiveMap=this.emissiveMap.toJSON(t).uuid),this.specularMap&&this.specularMap.isTexture&&(n.specularMap=this.specularMap.toJSON(t).uuid),this.specularIntensityMap&&this.specularIntensityMap.isTexture&&(n.specularIntensityMap=this.specularIntensityMap.toJSON(t).uuid),this.specularColorMap&&this.specularColorMap.isTexture&&(n.specularColorMap=this.specularColorMap.toJSON(t).uuid),this.envMap&&this.envMap.isTexture&&(n.envMap=this.envMap.toJSON(t).uuid,this.combine!==void 0&&(n.combine=this.combine)),this.envMapRotation!==void 0&&(n.envMapRotation=this.envMapRotation.toArray()),this.envMapIntensity!==void 0&&(n.envMapIntensity=this.envMapIntensity),this.reflectivity!==void 0&&(n.reflectivity=this.reflectivity),this.refractionRatio!==void 0&&(n.refractionRatio=this.refractionRatio),this.gradientMap&&this.gradientMap.isTexture&&(n.gradientMap=this.gradientMap.toJSON(t).uuid),this.transmission!==void 0&&(n.transmission=this.transmission),this.transmissionMap&&this.transmissionMap.isTexture&&(n.transmissionMap=this.transmissionMap.toJSON(t).uuid),this.thickness!==void 0&&(n.thickness=this.thickness),this.thicknessMap&&this.thicknessMap.isTexture&&(n.thicknessMap=this.thicknessMap.toJSON(t).uuid),this.attenuationDistance!==void 0&&this.attenuationDistance!==1/0&&(n.attenuationDistance=this.attenuationDistance),this.attenuationColor!==void 0&&(n.attenuationColor=this.attenuationColor.getHex()),this.size!==void 0&&(n.size=this.size),this.shadowSide!==null&&(n.shadowSide=this.shadowSide),this.sizeAttenuation!==void 0&&(n.sizeAttenuation=this.sizeAttenuation),this.blending!==bi&&(n.blending=this.blending),this.side!==Vn&&(n.side=this.side),this.vertexColors===!0&&(n.vertexColors=!0),this.opacity<1&&(n.opacity=this.opacity),this.transparent===!0&&(n.transparent=!0),this.blendSrc!==eo&&(n.blendSrc=this.blendSrc),this.blendDst!==no&&(n.blendDst=this.blendDst),this.blendEquation!==Jn&&(n.blendEquation=this.blendEquation),this.blendSrcAlpha!==null&&(n.blendSrcAlpha=this.blendSrcAlpha),this.blendDstAlpha!==null&&(n.blendDstAlpha=this.blendDstAlpha),this.blendEquationAlpha!==null&&(n.blendEquationAlpha=this.blendEquationAlpha),this.blendColor&&this.blendColor.isColor&&(n.blendColor=this.blendColor.getHex()),this.blendAlpha!==0&&(n.blendAlpha=this.blendAlpha),this.depthFunc!==Ti&&(n.depthFunc=this.depthFunc),this.depthTest===!1&&(n.depthTest=this.depthTest),this.depthWrite===!1&&(n.depthWrite=this.depthWrite),this.colorWrite===!1&&(n.colorWrite=this.colorWrite),this.stencilWriteMask!==255&&(n.stencilWriteMask=this.stencilWriteMask),this.stencilFunc!==Fa&&(n.stencilFunc=this.stencilFunc),this.stencilRef!==0&&(n.stencilRef=this.stencilRef),this.stencilFuncMask!==255&&(n.stencilFuncMask=this.stencilFuncMask),this.stencilFail!==ai&&(n.stencilFail=this.stencilFail),this.stencilZFail!==ai&&(n.stencilZFail=this.stencilZFail),this.stencilZPass!==ai&&(n.stencilZPass=this.stencilZPass),this.stencilWrite===!0&&(n.stencilWrite=this.stencilWrite),this.rotation!==void 0&&this.rotation!==0&&(n.rotation=this.rotation),this.polygonOffset===!0&&(n.polygonOffset=!0),this.polygonOffsetFactor!==0&&(n.polygonOffsetFactor=this.polygonOffsetFactor),this.polygonOffsetUnits!==0&&(n.polygonOffsetUnits=this.polygonOffsetUnits),this.linewidth!==void 0&&this.linewidth!==1&&(n.linewidth=this.linewidth),this.dashSize!==void 0&&(n.dashSize=this.dashSize),this.gapSize!==void 0&&(n.gapSize=this.gapSize),this.scale!==void 0&&(n.scale=this.scale),this.dithering===!0&&(n.dithering=!0),this.alphaTest>0&&(n.alphaTest=this.alphaTest),this.alphaHash===!0&&(n.alphaHash=!0),this.alphaToCoverage===!0&&(n.alphaToCoverage=!0),this.premultipliedAlpha===!0&&(n.premultipliedAlpha=!0),this.forceSinglePass===!0&&(n.forceSinglePass=!0),this.allowOverride===!1&&(n.allowOverride=!1),this.wireframe===!0&&(n.wireframe=!0),this.wireframeLinewidth>1&&(n.wireframeLinewidth=this.wireframeLinewidth),this.wireframeLinecap!=="round"&&(n.wireframeLinecap=this.wireframeLinecap),this.wireframeLinejoin!=="round"&&(n.wireframeLinejoin=this.wireframeLinejoin),this.flatShading===!0&&(n.flatShading=!0),this.visible===!1&&(n.visible=!1),this.toneMapped===!1&&(n.toneMapped=!1),this.fog===!1&&(n.fog=!1),Object.keys(this.userData).length>0&&(n.userData=this.userData);function i(s){const o=[];for(const a in s){const l=s[a];delete l.metadata,o.push(l)}return o}if(e){const s=i(t.textures),o=i(t.images);s.length>0&&(n.textures=s),o.length>0&&(n.images=o)}return n}clone(){return new this.constructor().copy(this)}copy(t){this.name=t.name,this.blending=t.blending,this.side=t.side,this.vertexColors=t.vertexColors,this.opacity=t.opacity,this.transparent=t.transparent,this.blendSrc=t.blendSrc,this.blendDst=t.blendDst,this.blendEquation=t.blendEquation,this.blendSrcAlpha=t.blendSrcAlpha,this.blendDstAlpha=t.blendDstAlpha,this.blendEquationAlpha=t.blendEquationAlpha,this.blendColor.copy(t.blendColor),this.blendAlpha=t.blendAlpha,this.depthFunc=t.depthFunc,this.depthTest=t.depthTest,this.depthWrite=t.depthWrite,this.stencilWriteMask=t.stencilWriteMask,this.stencilFunc=t.stencilFunc,this.stencilRef=t.stencilRef,this.stencilFuncMask=t.stencilFuncMask,this.stencilFail=t.stencilFail,this.stencilZFail=t.stencilZFail,this.stencilZPass=t.stencilZPass,this.stencilWrite=t.stencilWrite;const e=t.clippingPlanes;let n=null;if(e!==null){const i=e.length;n=new Array(i);for(let s=0;s!==i;++s)n[s]=e[s].clone()}return this.clippingPlanes=n,this.clipIntersection=t.clipIntersection,this.clipShadows=t.clipShadows,this.shadowSide=t.shadowSide,this.colorWrite=t.colorWrite,this.precision=t.precision,this.polygonOffset=t.polygonOffset,this.polygonOffsetFactor=t.polygonOffsetFactor,this.polygonOffsetUnits=t.polygonOffsetUnits,this.dithering=t.dithering,this.alphaTest=t.alphaTest,this.alphaHash=t.alphaHash,this.alphaToCoverage=t.alphaToCoverage,this.premultipliedAlpha=t.premultipliedAlpha,this.forceSinglePass=t.forceSinglePass,this.allowOverride=t.allowOverride,this.visible=t.visible,this.toneMapped=t.toneMapped,this.userData=JSON.parse(JSON.stringify(t.userData)),this}dispose(){this.dispatchEvent({type:"dispose"})}set needsUpdate(t){t===!0&&this.version++}}const yn=new E,Ir=new E,gs=new E,On=new E,Dr=new E,xs=new E,Nr=new E;class Ac{constructor(t=new E,e=new E(0,0,-1)){this.origin=t,this.direction=e}set(t,e){return this.origin.copy(t),this.direction.copy(e),this}copy(t){return this.origin.copy(t.origin),this.direction.copy(t.direction),this}at(t,e){return e.copy(this.origin).addScaledVector(this.direction,t)}lookAt(t){return this.direction.copy(t).sub(this.origin).normalize(),this}recast(t){return this.origin.copy(this.at(t,yn)),this}closestPointToPoint(t,e){e.subVectors(t,this.origin);const n=e.dot(this.direction);return n<0?e.copy(this.origin):e.copy(this.origin).addScaledVector(this.direction,n)}distanceToPoint(t){return Math.sqrt(this.distanceSqToPoint(t))}distanceSqToPoint(t){const e=yn.subVectors(t,this.origin).dot(this.direction);return e<0?this.origin.distanceToSquared(t):(yn.copy(this.origin).addScaledVector(this.direction,e),yn.distanceToSquared(t))}distanceSqToSegment(t,e,n,i){Ir.copy(t).add(e).multiplyScalar(.5),gs.copy(e).sub(t).normalize(),On.copy(this.origin).sub(Ir);const s=t.distanceTo(e)*.5,o=-this.direction.dot(gs),a=On.dot(this.direction),l=-On.dot(gs),c=On.lengthSq(),d=Math.abs(1-o*o);let u,h,f,g;if(d>0)if(u=o*l-a,h=o*a-l,g=s*d,u>=0)if(h>=-g)if(h<=g){const y=1/d;u*=y,h*=y,f=u*(u+o*h+2*a)+h*(o*u+h+2*l)+c}else h=s,u=Math.max(0,-(o*h+a)),f=-u*u+h*(h+2*l)+c;else h=-s,u=Math.max(0,-(o*h+a)),f=-u*u+h*(h+2*l)+c;else h<=-g?(u=Math.max(0,-(-o*s+a)),h=u>0?-s:Math.min(Math.max(-s,-l),s),f=-u*u+h*(h+2*l)+c):h<=g?(u=0,h=Math.min(Math.max(-s,-l),s),f=h*(h+2*l)+c):(u=Math.max(0,-(o*s+a)),h=u>0?s:Math.min(Math.max(-s,-l),s),f=-u*u+h*(h+2*l)+c);else h=o>0?-s:s,u=Math.max(0,-(o*h+a)),f=-u*u+h*(h+2*l)+c;return n&&n.copy(this.origin).addScaledVector(this.direction,u),i&&i.copy(Ir).addScaledVector(gs,h),f}intersectSphere(t,e){yn.subVectors(t.center,this.origin);const n=yn.dot(this.direction),i=yn.dot(yn)-n*n,s=t.radius*t.radius;if(i>s)return null;const o=Math.sqrt(s-i),a=n-o,l=n+o;return l<0?null:a<0?this.at(l,e):this.at(a,e)}intersectsSphere(t){return t.radius<0?!1:this.distanceSqToPoint(t.center)<=t.radius*t.radius}distanceToPlane(t){const e=t.normal.dot(this.direction);if(e===0)return t.distanceToPoint(this.origin)===0?0:null;const n=-(this.origin.dot(t.normal)+t.constant)/e;return n>=0?n:null}intersectPlane(t,e){const n=this.distanceToPlane(t);return n===null?null:this.at(n,e)}intersectsPlane(t){const e=t.distanceToPoint(this.origin);return e===0||t.normal.dot(this.direction)*e<0}intersectBox(t,e){let n,i,s,o,a,l;const c=1/this.direction.x,d=1/this.direction.y,u=1/this.direction.z,h=this.origin;return c>=0?(n=(t.min.x-h.x)*c,i=(t.max.x-h.x)*c):(n=(t.max.x-h.x)*c,i=(t.min.x-h.x)*c),d>=0?(s=(t.min.y-h.y)*d,o=(t.max.y-h.y)*d):(s=(t.max.y-h.y)*d,o=(t.min.y-h.y)*d),n>o||s>i||((s>n||isNaN(n))&&(n=s),(o<i||isNaN(i))&&(i=o),u>=0?(a=(t.min.z-h.z)*u,l=(t.max.z-h.z)*u):(a=(t.max.z-h.z)*u,l=(t.min.z-h.z)*u),n>l||a>i)||((a>n||n!==n)&&(n=a),(l<i||i!==i)&&(i=l),i<0)?null:this.at(n>=0?n:i,e)}intersectsBox(t){return this.intersectBox(t,yn)!==null}intersectTriangle(t,e,n,i,s){Dr.subVectors(e,t),xs.subVectors(n,t),Nr.crossVectors(Dr,xs);let o=this.direction.dot(Nr),a;if(o>0){if(i)return null;a=1}else if(o<0)a=-1,o=-o;else return null;On.subVectors(this.origin,t);const l=a*this.direction.dot(xs.crossVectors(On,xs));if(l<0)return null;const c=a*this.direction.dot(Dr.cross(On));if(c<0||l+c>o)return null;const d=-a*On.dot(Nr);return d<0?null:this.at(d/o,s)}applyMatrix4(t){return this.origin.applyMatrix4(t),this.direction.transformDirection(t),this}equals(t){return t.origin.equals(this.origin)&&t.direction.equals(this.direction)}clone(){return new this.constructor().copy(this)}}class ha extends Ii{constructor(t){super(),this.isMeshBasicMaterial=!0,this.type="MeshBasicMaterial",this.color=new yt(16777215),this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.specularMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new rn,this.combine=ac,this.reflectivity=1,this.refractionRatio=.98,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.specularMap=t.specularMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.combine=t.combine,this.reflectivity=t.reflectivity,this.refractionRatio=t.refractionRatio,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.fog=t.fog,this}}const Qa=new Qt,qn=new Ac,_s=new Li,tl=new E,vs=new E,Ms=new E,Ss=new E,Ur=new E,ys=new E,el=new E,bs=new E;class Ft extends Pe{constructor(t=new Ae,e=new ha){super(),this.isMesh=!0,this.type="Mesh",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.count=1,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),t.morphTargetInfluences!==void 0&&(this.morphTargetInfluences=t.morphTargetInfluences.slice()),t.morphTargetDictionary!==void 0&&(this.morphTargetDictionary=Object.assign({},t.morphTargetDictionary)),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}getVertexPosition(t,e){const n=this.geometry,i=n.attributes.position,s=n.morphAttributes.position,o=n.morphTargetsRelative;e.fromBufferAttribute(i,t);const a=this.morphTargetInfluences;if(s&&a){ys.set(0,0,0);for(let l=0,c=s.length;l<c;l++){const d=a[l],u=s[l];d!==0&&(Ur.fromBufferAttribute(u,t),o?ys.addScaledVector(Ur,d):ys.addScaledVector(Ur.sub(e),d))}e.add(ys)}return e}raycast(t,e){const n=this.geometry,i=this.material,s=this.matrixWorld;i!==void 0&&(n.boundingSphere===null&&n.computeBoundingSphere(),_s.copy(n.boundingSphere),_s.applyMatrix4(s),qn.copy(t.ray).recast(t.near),!(_s.containsPoint(qn.origin)===!1&&(qn.intersectSphere(_s,tl)===null||qn.origin.distanceToSquared(tl)>(t.far-t.near)**2))&&(Qa.copy(s).invert(),qn.copy(t.ray).applyMatrix4(Qa),!(n.boundingBox!==null&&qn.intersectsBox(n.boundingBox)===!1)&&this._computeIntersections(t,e,qn)))}_computeIntersections(t,e,n){let i;const s=this.geometry,o=this.material,a=s.index,l=s.attributes.position,c=s.attributes.uv,d=s.attributes.uv1,u=s.attributes.normal,h=s.groups,f=s.drawRange;if(a!==null)if(Array.isArray(o))for(let g=0,y=h.length;g<y;g++){const p=h[g],m=o[p.materialIndex],x=Math.max(p.start,f.start),M=Math.min(a.count,Math.min(p.start+p.count,f.start+f.count));for(let S=x,C=M;S<C;S+=3){const w=a.getX(S),R=a.getX(S+1),v=a.getX(S+2);i=Es(this,m,t,n,c,d,u,w,R,v),i&&(i.faceIndex=Math.floor(S/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const g=Math.max(0,f.start),y=Math.min(a.count,f.start+f.count);for(let p=g,m=y;p<m;p+=3){const x=a.getX(p),M=a.getX(p+1),S=a.getX(p+2);i=Es(this,o,t,n,c,d,u,x,M,S),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}else if(l!==void 0)if(Array.isArray(o))for(let g=0,y=h.length;g<y;g++){const p=h[g],m=o[p.materialIndex],x=Math.max(p.start,f.start),M=Math.min(l.count,Math.min(p.start+p.count,f.start+f.count));for(let S=x,C=M;S<C;S+=3){const w=S,R=S+1,v=S+2;i=Es(this,m,t,n,c,d,u,w,R,v),i&&(i.faceIndex=Math.floor(S/3),i.face.materialIndex=p.materialIndex,e.push(i))}}else{const g=Math.max(0,f.start),y=Math.min(l.count,f.start+f.count);for(let p=g,m=y;p<m;p+=3){const x=p,M=p+1,S=p+2;i=Es(this,o,t,n,c,d,u,x,M,S),i&&(i.faceIndex=Math.floor(p/3),e.push(i))}}}}function ad(r,t,e,n,i,s,o,a){let l;if(t.side===Ge?l=n.intersectTriangle(o,s,i,!0,a):l=n.intersectTriangle(i,s,o,t.side===Vn,a),l===null)return null;bs.copy(a),bs.applyMatrix4(r.matrixWorld);const c=e.ray.origin.distanceTo(bs);return c<e.near||c>e.far?null:{distance:c,point:bs.clone(),object:r}}function Es(r,t,e,n,i,s,o,a,l,c){r.getVertexPosition(a,vs),r.getVertexPosition(l,Ms),r.getVertexPosition(c,Ss);const d=ad(r,t,e,n,vs,Ms,Ss,el);if(d){const u=new E;en.getBarycoord(el,vs,Ms,Ss,u),i&&(d.uv=en.getInterpolatedAttribute(i,a,l,c,u,new ot)),s&&(d.uv1=en.getInterpolatedAttribute(s,a,l,c,u,new ot)),o&&(d.normal=en.getInterpolatedAttribute(o,a,l,c,u,new E),d.normal.dot(n.direction)>0&&d.normal.multiplyScalar(-1));const h={a,b:l,c,normal:new E,materialIndex:0};en.getNormal(vs,Ms,Ss,h.normal),d.face=h,d.barycoord=u}return d}class Cc extends Ue{constructor(t=null,e=1,n=1,i,s,o,a,l,c=Ee,d=Ee,u,h){super(null,o,a,l,c,d,i,s,u,h),this.isDataTexture=!0,this.image={data:t,width:e,height:n},this.generateMipmaps=!1,this.flipY=!1,this.unpackAlignment=1}}class nl extends Fe{constructor(t,e,n,i=1){super(t,e,n),this.isInstancedBufferAttribute=!0,this.meshPerAttribute=i}copy(t){return super.copy(t),this.meshPerAttribute=t.meshPerAttribute,this}toJSON(){const t=super.toJSON();return t.meshPerAttribute=this.meshPerAttribute,t.isInstancedBufferAttribute=!0,t}}const _i=new Qt,il=new Qt,Ts=[],sl=new si,ld=new Qt,zi=new Ft,Gi=new Li;class bn extends Ft{constructor(t,e,n){super(t,e),this.isInstancedMesh=!0,this.instanceMatrix=new nl(new Float32Array(n*16),16),this.previousInstanceMatrix=null,this.instanceColor=null,this.morphTexture=null,this.count=n,this.boundingBox=null,this.boundingSphere=null;for(let i=0;i<n;i++)this.setMatrixAt(i,ld)}computeBoundingBox(){const t=this.geometry,e=this.count;this.boundingBox===null&&(this.boundingBox=new si),t.boundingBox===null&&t.computeBoundingBox(),this.boundingBox.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,_i),sl.copy(t.boundingBox).applyMatrix4(_i),this.boundingBox.union(sl)}computeBoundingSphere(){const t=this.geometry,e=this.count;this.boundingSphere===null&&(this.boundingSphere=new Li),t.boundingSphere===null&&t.computeBoundingSphere(),this.boundingSphere.makeEmpty();for(let n=0;n<e;n++)this.getMatrixAt(n,_i),Gi.copy(t.boundingSphere).applyMatrix4(_i),this.boundingSphere.union(Gi)}copy(t,e){return super.copy(t,e),this.instanceMatrix.copy(t.instanceMatrix),t.previousInstanceMatrix!==null&&(this.previousInstanceMatrix=t.previousInstanceMatrix.clone()),t.morphTexture!==null&&(this.morphTexture=t.morphTexture.clone()),t.instanceColor!==null&&(this.instanceColor=t.instanceColor.clone()),this.count=t.count,t.boundingBox!==null&&(this.boundingBox=t.boundingBox.clone()),t.boundingSphere!==null&&(this.boundingSphere=t.boundingSphere.clone()),this}getColorAt(t,e){return this.instanceColor===null?e.setRGB(1,1,1):e.fromArray(this.instanceColor.array,t*3)}getMatrixAt(t,e){return e.fromArray(this.instanceMatrix.array,t*16)}getMorphAt(t,e){const n=e.morphTargetInfluences,i=this.morphTexture.source.data.data,s=n.length+1,o=t*s+1;for(let a=0;a<n.length;a++)n[a]=i[o+a]}raycast(t,e){const n=this.matrixWorld,i=this.count;if(zi.geometry=this.geometry,zi.material=this.material,zi.material!==void 0&&(this.boundingSphere===null&&this.computeBoundingSphere(),Gi.copy(this.boundingSphere),Gi.applyMatrix4(n),t.ray.intersectsSphere(Gi)!==!1))for(let s=0;s<i;s++){this.getMatrixAt(s,_i),il.multiplyMatrices(n,_i),zi.matrixWorld=il,zi.raycast(t,Ts);for(let o=0,a=Ts.length;o<a;o++){const l=Ts[o];l.instanceId=s,l.object=this,e.push(l)}Ts.length=0}}setColorAt(t,e){return this.instanceColor===null&&(this.instanceColor=new nl(new Float32Array(this.instanceMatrix.count*3).fill(1),3)),e.toArray(this.instanceColor.array,t*3),this}setMatrixAt(t,e){return e.toArray(this.instanceMatrix.array,t*16),this}setMorphAt(t,e){const n=e.morphTargetInfluences,i=n.length+1;this.morphTexture===null&&(this.morphTexture=new Cc(new Float32Array(i*this.count),i,this.count,na,nn));const s=this.morphTexture.source.data.data;let o=0;for(let c=0;c<n.length;c++)o+=n[c];const a=this.geometry.morphTargetsRelative?1:1-o,l=i*t;return s[l]=a,s.set(n,l+1),this}updateMorphTargets(){}dispose(){this.dispatchEvent({type:"dispose"}),this.morphTexture!==null&&(this.morphTexture.dispose(),this.morphTexture=null)}}const Fr=new E,cd=new E,hd=new Xt;class Kn{constructor(t=new E(1,0,0),e=0){this.isPlane=!0,this.normal=t,this.constant=e}set(t,e){return this.normal.copy(t),this.constant=e,this}setComponents(t,e,n,i){return this.normal.set(t,e,n),this.constant=i,this}setFromNormalAndCoplanarPoint(t,e){return this.normal.copy(t),this.constant=-e.dot(this.normal),this}setFromCoplanarPoints(t,e,n){const i=Fr.subVectors(n,e).cross(cd.subVectors(t,e)).normalize();return this.setFromNormalAndCoplanarPoint(i,t),this}copy(t){return this.normal.copy(t.normal),this.constant=t.constant,this}normalize(){const t=1/this.normal.length();return this.normal.multiplyScalar(t),this.constant*=t,this}negate(){return this.constant*=-1,this.normal.negate(),this}distanceToPoint(t){return this.normal.dot(t)+this.constant}distanceToSphere(t){return this.distanceToPoint(t.center)-t.radius}projectPoint(t,e){return e.copy(t).addScaledVector(this.normal,-this.distanceToPoint(t))}intersectLine(t,e,n=!0){const i=t.delta(Fr),s=this.normal.dot(i);if(s===0)return this.distanceToPoint(t.start)===0?e.copy(t.start):null;const o=-(t.start.dot(this.normal)+this.constant)/s;return n===!0&&(o<0||o>1)?null:e.copy(t.start).addScaledVector(i,o)}intersectsLine(t){const e=this.distanceToPoint(t.start),n=this.distanceToPoint(t.end);return e<0&&n>0||n<0&&e>0}intersectsBox(t){return t.intersectsPlane(this)}intersectsSphere(t){return t.intersectsPlane(this)}coplanarPoint(t){return t.copy(this.normal).multiplyScalar(-this.constant)}applyMatrix4(t,e){const n=e||hd.getNormalMatrix(t),i=this.coplanarPoint(Fr).applyMatrix4(t),s=this.normal.applyMatrix3(n).normalize();return this.constant=-i.dot(s),this}translate(t){return this.constant-=t.dot(this.normal),this}equals(t){return t.normal.equals(this.normal)&&t.constant===this.constant}clone(){return new this.constructor().copy(this)}}const Yn=new Li,dd=new ot(.5,.5),ws=new E;class da{constructor(t=new Kn,e=new Kn,n=new Kn,i=new Kn,s=new Kn,o=new Kn){this.planes=[t,e,n,i,s,o]}set(t,e,n,i,s,o){const a=this.planes;return a[0].copy(t),a[1].copy(e),a[2].copy(n),a[3].copy(i),a[4].copy(s),a[5].copy(o),this}copy(t){const e=this.planes;for(let n=0;n<6;n++)e[n].copy(t.planes[n]);return this}setFromProjectionMatrix(t,e=dn,n=!1){const i=this.planes,s=t.elements,o=s[0],a=s[1],l=s[2],c=s[3],d=s[4],u=s[5],h=s[6],f=s[7],g=s[8],y=s[9],p=s[10],m=s[11],x=s[12],M=s[13],S=s[14],C=s[15];if(i[0].setComponents(c-o,f-d,m-g,C-x).normalize(),i[1].setComponents(c+o,f+d,m+g,C+x).normalize(),i[2].setComponents(c+a,f+u,m+y,C+M).normalize(),i[3].setComponents(c-a,f-u,m-y,C-M).normalize(),n)i[4].setComponents(l,h,p,S).normalize(),i[5].setComponents(c-l,f-h,m-p,C-S).normalize();else if(i[4].setComponents(c-l,f-h,m-p,C-S).normalize(),e===dn)i[5].setComponents(c+l,f+h,m+p,C+S).normalize();else if(e===ts)i[5].setComponents(l,h,p,S).normalize();else throw new Error("THREE.Frustum.setFromProjectionMatrix(): Invalid coordinate system: "+e);return this}intersectsObject(t){if(t.boundingSphere!==void 0)t.boundingSphere===null&&t.computeBoundingSphere(),Yn.copy(t.boundingSphere).applyMatrix4(t.matrixWorld);else{const e=t.geometry;e.boundingSphere===null&&e.computeBoundingSphere(),Yn.copy(e.boundingSphere).applyMatrix4(t.matrixWorld)}return this.intersectsSphere(Yn)}intersectsSprite(t){Yn.center.set(0,0,0);const e=dd.distanceTo(t.center);return Yn.radius=.7071067811865476+e,Yn.applyMatrix4(t.matrixWorld),this.intersectsSphere(Yn)}intersectsSphere(t){const e=this.planes,n=t.center,i=-t.radius;for(let s=0;s<6;s++)if(e[s].distanceToPoint(n)<i)return!1;return!0}intersectsBox(t){const e=this.planes;for(let n=0;n<6;n++){const i=e[n];if(ws.x=i.normal.x>0?t.max.x:t.min.x,ws.y=i.normal.y>0?t.max.y:t.min.y,ws.z=i.normal.z>0?t.max.z:t.min.z,i.distanceToPoint(ws)<0)return!1}return!0}containsPoint(t){const e=this.planes;for(let n=0;n<6;n++)if(e[n].distanceToPoint(t)<0)return!1;return!0}clone(){return new this.constructor().copy(this)}}class nr extends Ii{constructor(t){super(),this.isPointsMaterial=!0,this.type="PointsMaterial",this.color=new yt(16777215),this.map=null,this.alphaMap=null,this.size=1,this.sizeAttenuation=!0,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.color.copy(t.color),this.map=t.map,this.alphaMap=t.alphaMap,this.size=t.size,this.sizeAttenuation=t.sizeAttenuation,this.fog=t.fog,this}}const rl=new Qt,Xo=new Ac,As=new Li,Cs=new E;class ua extends Pe{constructor(t=new Ae,e=new nr){super(),this.isPoints=!0,this.type="Points",this.geometry=t,this.material=e,this.morphTargetDictionary=void 0,this.morphTargetInfluences=void 0,this.updateMorphTargets()}copy(t,e){return super.copy(t,e),this.material=Array.isArray(t.material)?t.material.slice():t.material,this.geometry=t.geometry,this}raycast(t,e){const n=this.geometry,i=this.matrixWorld,s=t.params.Points.threshold,o=n.drawRange;if(n.boundingSphere===null&&n.computeBoundingSphere(),As.copy(n.boundingSphere),As.applyMatrix4(i),As.radius+=s,t.ray.intersectsSphere(As)===!1)return;rl.copy(i).invert(),Xo.copy(t.ray).applyMatrix4(rl);const a=s/((this.scale.x+this.scale.y+this.scale.z)/3),l=a*a,c=n.index,u=n.attributes.position;if(c!==null){const h=Math.max(0,o.start),f=Math.min(c.count,o.start+o.count);for(let g=h,y=f;g<y;g++){const p=c.getX(g);Cs.fromBufferAttribute(u,p),ol(Cs,p,l,i,t,e,this)}}else{const h=Math.max(0,o.start),f=Math.min(u.count,o.start+o.count);for(let g=h,y=f;g<y;g++)Cs.fromBufferAttribute(u,g),ol(Cs,g,l,i,t,e,this)}}updateMorphTargets(){const e=this.geometry.morphAttributes,n=Object.keys(e);if(n.length>0){const i=e[n[0]];if(i!==void 0){this.morphTargetInfluences=[],this.morphTargetDictionary={};for(let s=0,o=i.length;s<o;s++){const a=i[s].name||String(s);this.morphTargetInfluences.push(0),this.morphTargetDictionary[a]=s}}}}}function ol(r,t,e,n,i,s,o){const a=Xo.distanceSqToPoint(r);if(a<e){const l=new E;Xo.closestPointToPoint(r,l),l.applyMatrix4(n);const c=i.ray.origin.distanceTo(l);if(c<i.near||c>i.far)return;s.push({distance:c,distanceToRay:Math.sqrt(a),point:l,index:t,face:null,faceIndex:null,barycoord:null,object:o})}}class Rc extends Ue{constructor(t=[],e=ti,n,i,s,o,a,l,c,d){super(t,e,n,i,s,o,a,l,c,d),this.isCubeTexture=!0,this.flipY=!1}get images(){return this.image}set images(t){this.image=t}}class fa extends Ue{constructor(t,e,n,i,s,o,a,l,c){super(t,e,n,i,s,o,a,l,c),this.isCanvasTexture=!0,this.needsUpdate=!0}}class Ai extends Ue{constructor(t,e,n=pn,i,s,o,a=Ee,l=Ee,c,d=Rn,u=1){if(d!==Rn&&d!==Qn)throw new Error("DepthTexture format must be either THREE.DepthFormat or THREE.DepthStencilFormat");const h={width:t,height:e,depth:u};super(h,i,s,o,a,l,d,n,c),this.isDepthTexture=!0,this.flipY=!1,this.generateMipmaps=!1,this.compareFunction=null}copy(t){return super.copy(t),this.source=new la(Object.assign({},t.image)),this.compareFunction=t.compareFunction,this}toJSON(t){const e=super.toJSON(t);return this.compareFunction!==null&&(e.compareFunction=this.compareFunction),e}}class ud extends Ai{constructor(t,e=pn,n=ti,i,s,o=Ee,a=Ee,l,c=Rn){const d={width:t,height:t,depth:1},u=[d,d,d,d,d,d];super(t,t,e,n,i,s,o,a,l,c),this.image=u,this.isCubeDepthTexture=!0,this.isCubeTexture=!0}get images(){return this.image}set images(t){this.image=t}}class Pc extends Ue{constructor(t=null){super(),this.sourceTexture=t,this.isExternalTexture=!0}copy(t){return super.copy(t),this.sourceTexture=t.sourceTexture,this}}class pe extends Ae{constructor(t=1,e=1,n=1,i=1,s=1,o=1){super(),this.type="BoxGeometry",this.parameters={width:t,height:e,depth:n,widthSegments:i,heightSegments:s,depthSegments:o};const a=this;i=Math.floor(i),s=Math.floor(s),o=Math.floor(o);const l=[],c=[],d=[],u=[];let h=0,f=0;g("z","y","x",-1,-1,n,e,t,o,s,0),g("z","y","x",1,-1,n,e,-t,o,s,1),g("x","z","y",1,1,t,n,e,i,o,2),g("x","z","y",1,-1,t,n,-e,i,o,3),g("x","y","z",1,-1,t,e,n,i,s,4),g("x","y","z",-1,-1,t,e,-n,i,s,5),this.setIndex(l),this.setAttribute("position",new fe(c,3)),this.setAttribute("normal",new fe(d,3)),this.setAttribute("uv",new fe(u,2));function g(y,p,m,x,M,S,C,w,R,v,A){const D=S/R,L=C/v,O=S/2,W=C/2,q=w/2,U=R+1,V=v+1;let k=0,et=0;const nt=new E;for(let pt=0;pt<V;pt++){const St=pt*L-W;for(let At=0;At<U;At++){const $t=At*D-O;nt[y]=$t*x,nt[p]=St*M,nt[m]=q,c.push(nt.x,nt.y,nt.z),nt[y]=0,nt[p]=0,nt[m]=w>0?1:-1,d.push(nt.x,nt.y,nt.z),u.push(At/R),u.push(1-pt/v),k+=1}}for(let pt=0;pt<v;pt++)for(let St=0;St<R;St++){const At=h+St+U*pt,$t=h+St+U*(pt+1),ne=h+(St+1)+U*(pt+1),Vt=h+(St+1)+U*pt;l.push(At,$t,Vt),l.push($t,ne,Vt),et+=6}a.addGroup(f,et,A),f+=et,h+=k}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pe(t.width,t.height,t.depth,t.widthSegments,t.heightSegments,t.depthSegments)}}class ir extends Ae{constructor(t=1,e=32,n=0,i=Math.PI*2){super(),this.type="CircleGeometry",this.parameters={radius:t,segments:e,thetaStart:n,thetaLength:i},e=Math.max(3,e);const s=[],o=[],a=[],l=[],c=new E,d=new ot;o.push(0,0,0),a.push(0,0,1),l.push(.5,.5);for(let u=0,h=3;u<=e;u++,h+=3){const f=n+u/e*i;c.x=t*Math.cos(f),c.y=t*Math.sin(f),o.push(c.x,c.y,c.z),a.push(0,0,1),d.x=(o[h]/t+1)/2,d.y=(o[h+1]/t+1)/2,l.push(d.x,d.y)}for(let u=1;u<=e;u++)s.push(u,u+1,0);this.setIndex(s),this.setAttribute("position",new fe(o,3)),this.setAttribute("normal",new fe(a,3)),this.setAttribute("uv",new fe(l,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new ir(t.radius,t.segments,t.thetaStart,t.thetaLength)}}class un extends Ae{constructor(t=1,e=1,n=1,i=32,s=1,o=!1,a=0,l=Math.PI*2){super(),this.type="CylinderGeometry",this.parameters={radiusTop:t,radiusBottom:e,height:n,radialSegments:i,heightSegments:s,openEnded:o,thetaStart:a,thetaLength:l};const c=this;i=Math.floor(i),s=Math.floor(s);const d=[],u=[],h=[],f=[];let g=0;const y=[],p=n/2;let m=0;x(),o===!1&&(t>0&&M(!0),e>0&&M(!1)),this.setIndex(d),this.setAttribute("position",new fe(u,3)),this.setAttribute("normal",new fe(h,3)),this.setAttribute("uv",new fe(f,2));function x(){const S=new E,C=new E;let w=0;const R=(e-t)/n;for(let v=0;v<=s;v++){const A=[],D=v/s,L=D*(e-t)+t;for(let O=0;O<=i;O++){const W=O/i,q=W*l+a,U=Math.sin(q),V=Math.cos(q);C.x=L*U,C.y=-D*n+p,C.z=L*V,u.push(C.x,C.y,C.z),S.set(U,R,V).normalize(),h.push(S.x,S.y,S.z),f.push(W,1-D),A.push(g++)}y.push(A)}for(let v=0;v<i;v++)for(let A=0;A<s;A++){const D=y[A][v],L=y[A+1][v],O=y[A+1][v+1],W=y[A][v+1];(t>0||A!==0)&&(d.push(D,L,W),w+=3),(e>0||A!==s-1)&&(d.push(L,O,W),w+=3)}c.addGroup(m,w,0),m+=w}function M(S){const C=g,w=new ot,R=new E;let v=0;const A=S===!0?t:e,D=S===!0?1:-1;for(let O=1;O<=i;O++)u.push(0,p*D,0),h.push(0,D,0),f.push(.5,.5),g++;const L=g;for(let O=0;O<=i;O++){const q=O/i*l+a,U=Math.cos(q),V=Math.sin(q);R.x=A*V,R.y=p*D,R.z=A*U,u.push(R.x,R.y,R.z),h.push(0,D,0),w.x=U*.5+.5,w.y=V*.5*D+.5,f.push(w.x,w.y),g++}for(let O=0;O<i;O++){const W=C+O,q=L+O;S===!0?d.push(q,q+1,W):d.push(q+1,q,W),v+=3}c.addGroup(m,v,S===!0?1:2),m+=v}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new un(t.radiusTop,t.radiusBottom,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class $i extends un{constructor(t=1,e=1,n=32,i=1,s=!1,o=0,a=Math.PI*2){super(0,t,e,n,i,s,o,a),this.type="ConeGeometry",this.parameters={radius:t,height:e,radialSegments:n,heightSegments:i,openEnded:s,thetaStart:o,thetaLength:a}}static fromJSON(t){return new $i(t.radius,t.height,t.radialSegments,t.heightSegments,t.openEnded,t.thetaStart,t.thetaLength)}}class pa extends Ae{constructor(t=[],e=[],n=1,i=0){super(),this.type="PolyhedronGeometry",this.parameters={vertices:t,indices:e,radius:n,detail:i};const s=[],o=[];a(i),c(n),d(),this.setAttribute("position",new fe(s,3)),this.setAttribute("normal",new fe(s.slice(),3)),this.setAttribute("uv",new fe(o,2)),i===0?this.computeVertexNormals():this.normalizeNormals();function a(x){const M=new E,S=new E,C=new E;for(let w=0;w<e.length;w+=3)f(e[w+0],M),f(e[w+1],S),f(e[w+2],C),l(M,S,C,x)}function l(x,M,S,C){const w=C+1,R=[];for(let v=0;v<=w;v++){R[v]=[];const A=x.clone().lerp(S,v/w),D=M.clone().lerp(S,v/w),L=w-v;for(let O=0;O<=L;O++)O===0&&v===w?R[v][O]=A:R[v][O]=A.clone().lerp(D,O/L)}for(let v=0;v<w;v++)for(let A=0;A<2*(w-v)-1;A++){const D=Math.floor(A/2);A%2===0?(h(R[v][D+1]),h(R[v+1][D]),h(R[v][D])):(h(R[v][D+1]),h(R[v+1][D+1]),h(R[v+1][D]))}}function c(x){const M=new E;for(let S=0;S<s.length;S+=3)M.x=s[S+0],M.y=s[S+1],M.z=s[S+2],M.normalize().multiplyScalar(x),s[S+0]=M.x,s[S+1]=M.y,s[S+2]=M.z}function d(){const x=new E;for(let M=0;M<s.length;M+=3){x.x=s[M+0],x.y=s[M+1],x.z=s[M+2];const S=p(x)/2/Math.PI+.5,C=m(x)/Math.PI+.5;o.push(S,1-C)}g(),u()}function u(){for(let x=0;x<o.length;x+=6){const M=o[x+0],S=o[x+2],C=o[x+4],w=Math.max(M,S,C),R=Math.min(M,S,C);w>.9&&R<.1&&(M<.2&&(o[x+0]+=1),S<.2&&(o[x+2]+=1),C<.2&&(o[x+4]+=1))}}function h(x){s.push(x.x,x.y,x.z)}function f(x,M){const S=x*3;M.x=t[S+0],M.y=t[S+1],M.z=t[S+2]}function g(){const x=new E,M=new E,S=new E,C=new E,w=new ot,R=new ot,v=new ot;for(let A=0,D=0;A<s.length;A+=9,D+=6){x.set(s[A+0],s[A+1],s[A+2]),M.set(s[A+3],s[A+4],s[A+5]),S.set(s[A+6],s[A+7],s[A+8]),w.set(o[D+0],o[D+1]),R.set(o[D+2],o[D+3]),v.set(o[D+4],o[D+5]),C.copy(x).add(M).add(S).divideScalar(3);const L=p(C);y(w,D+0,x,L),y(R,D+2,M,L),y(v,D+4,S,L)}}function y(x,M,S,C){C<0&&x.x===1&&(o[M]=x.x-1),S.x===0&&S.z===0&&(o[M]=C/2/Math.PI+.5)}function p(x){return Math.atan2(x.z,-x.x)}function m(x){return Math.atan2(-x.y,Math.sqrt(x.x*x.x+x.z*x.z))}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new pa(t.vertices,t.indices,t.radius,t.detail)}}class Ki extends pa{constructor(t=1,e=0){const n=(1+Math.sqrt(5))/2,i=1/n,s=[-1,-1,-1,-1,-1,1,-1,1,-1,-1,1,1,1,-1,-1,1,-1,1,1,1,-1,1,1,1,0,-i,-n,0,-i,n,0,i,-n,0,i,n,-i,-n,0,-i,n,0,i,-n,0,i,n,0,-n,0,-i,n,0,-i,-n,0,i,n,0,i],o=[3,11,7,3,7,15,3,15,13,7,19,17,7,17,6,7,6,15,17,4,8,17,8,10,17,10,6,8,0,16,8,16,2,8,2,10,0,12,1,0,1,18,0,18,16,6,10,2,6,2,13,6,13,15,2,16,18,2,18,3,2,3,13,18,1,9,18,9,11,18,11,3,4,14,12,4,12,0,4,0,8,11,9,5,11,5,19,11,19,7,19,5,14,19,14,4,19,4,17,1,12,14,1,14,5,1,5,9];super(s,o,t,e),this.type="DodecahedronGeometry",this.parameters={radius:t,detail:e}}static fromJSON(t){return new Ki(t.radius,t.detail)}}class gn{constructor(){this.type="Curve",this.arcLengthDivisions=200,this.needsUpdate=!1,this.cacheArcLengths=null}getPoint(){Bt("Curve: .getPoint() not implemented.")}getPointAt(t,e){const n=this.getUtoTmapping(t);return this.getPoint(n,e)}getPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return e}getSpacedPoints(t=5){const e=[];for(let n=0;n<=t;n++)e.push(this.getPointAt(n/t));return e}getLength(){const t=this.getLengths();return t[t.length-1]}getLengths(t=this.arcLengthDivisions){if(this.cacheArcLengths&&this.cacheArcLengths.length===t+1&&!this.needsUpdate)return this.cacheArcLengths;this.needsUpdate=!1;const e=[];let n,i=this.getPoint(0),s=0;e.push(0);for(let o=1;o<=t;o++)n=this.getPoint(o/t),s+=n.distanceTo(i),e.push(s),i=n;return this.cacheArcLengths=e,e}updateArcLengths(){this.needsUpdate=!0,this.getLengths()}getUtoTmapping(t,e=null){const n=this.getLengths();let i=0;const s=n.length;let o;e?o=e:o=t*n[s-1];let a=0,l=s-1,c;for(;a<=l;)if(i=Math.floor(a+(l-a)/2),c=n[i]-o,c<0)a=i+1;else if(c>0)l=i-1;else{l=i;break}if(i=l,n[i]===o)return i/(s-1);const d=n[i],h=n[i+1]-d,f=(o-d)/h;return(i+f)/(s-1)}getTangent(t,e){let i=t-1e-4,s=t+1e-4;i<0&&(i=0),s>1&&(s=1);const o=this.getPoint(i),a=this.getPoint(s),l=e||(o.isVector2?new ot:new E);return l.copy(a).sub(o).normalize(),l}getTangentAt(t,e){const n=this.getUtoTmapping(t);return this.getTangent(n,e)}computeFrenetFrames(t,e=!1){const n=new E,i=[],s=[],o=[],a=new E,l=new Qt;for(let f=0;f<=t;f++){const g=f/t;i[f]=this.getTangentAt(g,new E)}s[0]=new E,o[0]=new E;let c=Number.MAX_VALUE;const d=Math.abs(i[0].x),u=Math.abs(i[0].y),h=Math.abs(i[0].z);d<=c&&(c=d,n.set(1,0,0)),u<=c&&(c=u,n.set(0,1,0)),h<=c&&n.set(0,0,1),a.crossVectors(i[0],n).normalize(),s[0].crossVectors(i[0],a),o[0].crossVectors(i[0],s[0]);for(let f=1;f<=t;f++){if(s[f]=s[f-1].clone(),o[f]=o[f-1].clone(),a.crossVectors(i[f-1],i[f]),a.length()>Number.EPSILON){a.normalize();const g=Math.acos(jt(i[f-1].dot(i[f]),-1,1));s[f].applyMatrix4(l.makeRotationAxis(a,g))}o[f].crossVectors(i[f],s[f])}if(e===!0){let f=Math.acos(jt(s[0].dot(s[t]),-1,1));f/=t,i[0].dot(a.crossVectors(s[0],s[t]))>0&&(f=-f);for(let g=1;g<=t;g++)s[g].applyMatrix4(l.makeRotationAxis(i[g],f*g)),o[g].crossVectors(i[g],s[g])}return{tangents:i,normals:s,binormals:o}}clone(){return new this.constructor().copy(this)}copy(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}toJSON(){const t={metadata:{version:4.7,type:"Curve",generator:"Curve.toJSON"}};return t.arcLengthDivisions=this.arcLengthDivisions,t.type=this.type,t}fromJSON(t){return this.arcLengthDivisions=t.arcLengthDivisions,this}}class ma extends gn{constructor(t=0,e=0,n=1,i=1,s=0,o=Math.PI*2,a=!1,l=0){super(),this.isEllipseCurve=!0,this.type="EllipseCurve",this.aX=t,this.aY=e,this.xRadius=n,this.yRadius=i,this.aStartAngle=s,this.aEndAngle=o,this.aClockwise=a,this.aRotation=l}getPoint(t,e=new ot){const n=e,i=Math.PI*2;let s=this.aEndAngle-this.aStartAngle;const o=Math.abs(s)<Number.EPSILON;for(;s<0;)s+=i;for(;s>i;)s-=i;s<Number.EPSILON&&(o?s=0:s=i),this.aClockwise===!0&&!o&&(s===i?s=-i:s=s-i);const a=this.aStartAngle+t*s;let l=this.aX+this.xRadius*Math.cos(a),c=this.aY+this.yRadius*Math.sin(a);if(this.aRotation!==0){const d=Math.cos(this.aRotation),u=Math.sin(this.aRotation),h=l-this.aX,f=c-this.aY;l=h*d-f*u+this.aX,c=h*u+f*d+this.aY}return n.set(l,c)}copy(t){return super.copy(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}toJSON(){const t=super.toJSON();return t.aX=this.aX,t.aY=this.aY,t.xRadius=this.xRadius,t.yRadius=this.yRadius,t.aStartAngle=this.aStartAngle,t.aEndAngle=this.aEndAngle,t.aClockwise=this.aClockwise,t.aRotation=this.aRotation,t}fromJSON(t){return super.fromJSON(t),this.aX=t.aX,this.aY=t.aY,this.xRadius=t.xRadius,this.yRadius=t.yRadius,this.aStartAngle=t.aStartAngle,this.aEndAngle=t.aEndAngle,this.aClockwise=t.aClockwise,this.aRotation=t.aRotation,this}}class fd extends ma{constructor(t,e,n,i,s,o){super(t,e,n,n,i,s,o),this.isArcCurve=!0,this.type="ArcCurve"}}function ga(){let r=0,t=0,e=0,n=0;function i(s,o,a,l){r=s,t=a,e=-3*s+3*o-2*a-l,n=2*s-2*o+a+l}return{initCatmullRom:function(s,o,a,l,c){i(o,a,c*(a-s),c*(l-o))},initNonuniformCatmullRom:function(s,o,a,l,c,d,u){let h=(o-s)/c-(a-s)/(c+d)+(a-o)/d,f=(a-o)/d-(l-o)/(d+u)+(l-a)/u;h*=d,f*=d,i(o,a,h,f)},calc:function(s){const o=s*s,a=o*s;return r+t*s+e*o+n*a}}}const al=new E,ll=new E,Or=new ga,Br=new ga,kr=new ga;class Lc extends gn{constructor(t=[],e=!1,n="centripetal",i=.5){super(),this.isCatmullRomCurve3=!0,this.type="CatmullRomCurve3",this.points=t,this.closed=e,this.curveType=n,this.tension=i}getPoint(t,e=new E){const n=e,i=this.points,s=i.length,o=(s-(this.closed?0:1))*t;let a=Math.floor(o),l=o-a;this.closed?a+=a>0?0:(Math.floor(Math.abs(a)/s)+1)*s:l===0&&a===s-1&&(a=s-2,l=1);let c,d;this.closed||a>0?c=i[(a-1)%s]:(ll.subVectors(i[0],i[1]).add(i[0]),c=ll);const u=i[a%s],h=i[(a+1)%s];if(this.closed||a+2<s?d=i[(a+2)%s]:(al.subVectors(i[s-1],i[s-2]).add(i[s-1]),d=al),this.curveType==="centripetal"||this.curveType==="chordal"){const f=this.curveType==="chordal"?.5:.25;let g=Math.pow(c.distanceToSquared(u),f),y=Math.pow(u.distanceToSquared(h),f),p=Math.pow(h.distanceToSquared(d),f);y<1e-4&&(y=1),g<1e-4&&(g=y),p<1e-4&&(p=y),Or.initNonuniformCatmullRom(c.x,u.x,h.x,d.x,g,y,p),Br.initNonuniformCatmullRom(c.y,u.y,h.y,d.y,g,y,p),kr.initNonuniformCatmullRom(c.z,u.z,h.z,d.z,g,y,p)}else this.curveType==="catmullrom"&&(Or.initCatmullRom(c.x,u.x,h.x,d.x,this.tension),Br.initCatmullRom(c.y,u.y,h.y,d.y,this.tension),kr.initCatmullRom(c.z,u.z,h.z,d.z,this.tension));return n.set(Or.calc(l),Br.calc(l),kr.calc(l)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t.closed=this.closed,t.curveType=this.curveType,t.tension=this.tension,t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new E().fromArray(i))}return this.closed=t.closed,this.curveType=t.curveType,this.tension=t.tension,this}}function cl(r,t,e,n,i){const s=(n-t)*.5,o=(i-e)*.5,a=r*r,l=r*a;return(2*e-2*n+s+o)*l+(-3*e+3*n-2*s-o)*a+s*r+e}function pd(r,t){const e=1-r;return e*e*t}function md(r,t){return 2*(1-r)*r*t}function gd(r,t){return r*r*t}function Ji(r,t,e,n){return pd(r,t)+md(r,e)+gd(r,n)}function xd(r,t){const e=1-r;return e*e*e*t}function _d(r,t){const e=1-r;return 3*e*e*r*t}function vd(r,t){return 3*(1-r)*r*r*t}function Md(r,t){return r*r*r*t}function Zi(r,t,e,n,i){return xd(r,t)+_d(r,e)+vd(r,n)+Md(r,i)}class Ic extends gn{constructor(t=new ot,e=new ot,n=new ot,i=new ot){super(),this.isCubicBezierCurve=!0,this.type="CubicBezierCurve",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new ot){const n=e,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Zi(t,i.x,s.x,o.x,a.x),Zi(t,i.y,s.y,o.y,a.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Sd extends gn{constructor(t=new E,e=new E,n=new E,i=new E){super(),this.isCubicBezierCurve3=!0,this.type="CubicBezierCurve3",this.v0=t,this.v1=e,this.v2=n,this.v3=i}getPoint(t,e=new E){const n=e,i=this.v0,s=this.v1,o=this.v2,a=this.v3;return n.set(Zi(t,i.x,s.x,o.x,a.x),Zi(t,i.y,s.y,o.y,a.y),Zi(t,i.z,s.z,o.z,a.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this.v3.copy(t.v3),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t.v3=this.v3.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this.v3.fromArray(t.v3),this}}class Dc extends gn{constructor(t=new ot,e=new ot){super(),this.isLineCurve=!0,this.type="LineCurve",this.v1=t,this.v2=e}getPoint(t,e=new ot){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new ot){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class yd extends gn{constructor(t=new E,e=new E){super(),this.isLineCurve3=!0,this.type="LineCurve3",this.v1=t,this.v2=e}getPoint(t,e=new E){const n=e;return t===1?n.copy(this.v2):(n.copy(this.v2).sub(this.v1),n.multiplyScalar(t).add(this.v1)),n}getPointAt(t,e){return this.getPoint(t,e)}getTangent(t,e=new E){return e.subVectors(this.v2,this.v1).normalize()}getTangentAt(t,e){return this.getTangent(t,e)}copy(t){return super.copy(t),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Nc extends gn{constructor(t=new ot,e=new ot,n=new ot){super(),this.isQuadraticBezierCurve=!0,this.type="QuadraticBezierCurve",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new ot){const n=e,i=this.v0,s=this.v1,o=this.v2;return n.set(Ji(t,i.x,s.x,o.x),Ji(t,i.y,s.y,o.y)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class bd extends gn{constructor(t=new E,e=new E,n=new E){super(),this.isQuadraticBezierCurve3=!0,this.type="QuadraticBezierCurve3",this.v0=t,this.v1=e,this.v2=n}getPoint(t,e=new E){const n=e,i=this.v0,s=this.v1,o=this.v2;return n.set(Ji(t,i.x,s.x,o.x),Ji(t,i.y,s.y,o.y),Ji(t,i.z,s.z,o.z)),n}copy(t){return super.copy(t),this.v0.copy(t.v0),this.v1.copy(t.v1),this.v2.copy(t.v2),this}toJSON(){const t=super.toJSON();return t.v0=this.v0.toArray(),t.v1=this.v1.toArray(),t.v2=this.v2.toArray(),t}fromJSON(t){return super.fromJSON(t),this.v0.fromArray(t.v0),this.v1.fromArray(t.v1),this.v2.fromArray(t.v2),this}}class Uc extends gn{constructor(t=[]){super(),this.isSplineCurve=!0,this.type="SplineCurve",this.points=t}getPoint(t,e=new ot){const n=e,i=this.points,s=(i.length-1)*t,o=Math.floor(s),a=s-o,l=i[o===0?o:o-1],c=i[o],d=i[o>i.length-2?i.length-1:o+1],u=i[o>i.length-3?i.length-1:o+2];return n.set(cl(a,l.x,c.x,d.x,u.x),cl(a,l.y,c.y,d.y,u.y)),n}copy(t){super.copy(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.points=[];for(let e=0,n=this.points.length;e<n;e++){const i=this.points[e];t.points.push(i.toArray())}return t}fromJSON(t){super.fromJSON(t),this.points=[];for(let e=0,n=t.points.length;e<n;e++){const i=t.points[e];this.points.push(new ot().fromArray(i))}return this}}var qo=Object.freeze({__proto__:null,ArcCurve:fd,CatmullRomCurve3:Lc,CubicBezierCurve:Ic,CubicBezierCurve3:Sd,EllipseCurve:ma,LineCurve:Dc,LineCurve3:yd,QuadraticBezierCurve:Nc,QuadraticBezierCurve3:bd,SplineCurve:Uc});class Ed extends gn{constructor(){super(),this.type="CurvePath",this.curves=[],this.autoClose=!1}add(t){this.curves.push(t)}closePath(){const t=this.curves[0].getPoint(0),e=this.curves[this.curves.length-1].getPoint(1);if(!t.equals(e)){const n=t.isVector2===!0?"LineCurve":"LineCurve3";this.curves.push(new qo[n](e,t))}return this}getPoint(t,e){const n=t*this.getLength(),i=this.getCurveLengths();let s=0;for(;s<i.length;){if(i[s]>=n){const o=i[s]-n,a=this.curves[s],l=a.getLength(),c=l===0?0:1-o/l;return a.getPointAt(c,e)}s++}return null}getLength(){const t=this.getCurveLengths();return t[t.length-1]}updateArcLengths(){this.needsUpdate=!0,this.cacheLengths=null,this.getCurveLengths()}getCurveLengths(){if(this.cacheLengths&&this.cacheLengths.length===this.curves.length)return this.cacheLengths;const t=[];let e=0;for(let n=0,i=this.curves.length;n<i;n++)e+=this.curves[n].getLength(),t.push(e);return this.cacheLengths=t,t}getSpacedPoints(t=40){const e=[];for(let n=0;n<=t;n++)e.push(this.getPoint(n/t));return this.autoClose&&e.push(e[0]),e}getPoints(t=12){const e=[];let n;for(let i=0,s=this.curves;i<s.length;i++){const o=s[i],a=o.isEllipseCurve?t*2:o.isLineCurve||o.isLineCurve3?1:o.isSplineCurve?t*o.points.length:t,l=o.getPoints(a);for(let c=0;c<l.length;c++){const d=l[c];n&&n.equals(d)||(e.push(d),n=d)}}return this.autoClose&&e.length>1&&!e[e.length-1].equals(e[0])&&e.push(e[0]),e}copy(t){super.copy(t),this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(i.clone())}return this.autoClose=t.autoClose,this}toJSON(){const t=super.toJSON();t.autoClose=this.autoClose,t.curves=[];for(let e=0,n=this.curves.length;e<n;e++){const i=this.curves[e];t.curves.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.autoClose=t.autoClose,this.curves=[];for(let e=0,n=t.curves.length;e<n;e++){const i=t.curves[e];this.curves.push(new qo[i.type]().fromJSON(i))}return this}}class hl extends Ed{constructor(t){super(),this.type="Path",this.currentPoint=new ot,t&&this.setFromPoints(t)}setFromPoints(t){this.moveTo(t[0].x,t[0].y);for(let e=1,n=t.length;e<n;e++)this.lineTo(t[e].x,t[e].y);return this}moveTo(t,e){return this.currentPoint.set(t,e),this}lineTo(t,e){const n=new Dc(this.currentPoint.clone(),new ot(t,e));return this.curves.push(n),this.currentPoint.set(t,e),this}quadraticCurveTo(t,e,n,i){const s=new Nc(this.currentPoint.clone(),new ot(t,e),new ot(n,i));return this.curves.push(s),this.currentPoint.set(n,i),this}bezierCurveTo(t,e,n,i,s,o){const a=new Ic(this.currentPoint.clone(),new ot(t,e),new ot(n,i),new ot(s,o));return this.curves.push(a),this.currentPoint.set(s,o),this}splineThru(t){const e=[this.currentPoint.clone()].concat(t),n=new Uc(e);return this.curves.push(n),this.currentPoint.copy(t[t.length-1]),this}arc(t,e,n,i,s,o){const a=this.currentPoint.x,l=this.currentPoint.y;return this.absarc(t+a,e+l,n,i,s,o),this}absarc(t,e,n,i,s,o){return this.absellipse(t,e,n,n,i,s,o),this}ellipse(t,e,n,i,s,o,a,l){const c=this.currentPoint.x,d=this.currentPoint.y;return this.absellipse(t+c,e+d,n,i,s,o,a,l),this}absellipse(t,e,n,i,s,o,a,l){const c=new ma(t,e,n,i,s,o,a,l);if(this.curves.length>0){const u=c.getPoint(0);u.equals(this.currentPoint)||this.lineTo(u.x,u.y)}this.curves.push(c);const d=c.getPoint(1);return this.currentPoint.copy(d),this}copy(t){return super.copy(t),this.currentPoint.copy(t.currentPoint),this}toJSON(){const t=super.toJSON();return t.currentPoint=this.currentPoint.toArray(),t}fromJSON(t){return super.fromJSON(t),this.currentPoint.fromArray(t.currentPoint),this}}class xa extends hl{constructor(t){super(t),this.uuid=Pi(),this.type="Shape",this.holes=[]}getPointsHoles(t){const e=[];for(let n=0,i=this.holes.length;n<i;n++)e[n]=this.holes[n].getPoints(t);return e}extractPoints(t){return{shape:this.getPoints(t),holes:this.getPointsHoles(t)}}copy(t){super.copy(t),this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(i.clone())}return this}toJSON(){const t=super.toJSON();t.uuid=this.uuid,t.holes=[];for(let e=0,n=this.holes.length;e<n;e++){const i=this.holes[e];t.holes.push(i.toJSON())}return t}fromJSON(t){super.fromJSON(t),this.uuid=t.uuid,this.holes=[];for(let e=0,n=t.holes.length;e<n;e++){const i=t.holes[e];this.holes.push(new hl().fromJSON(i))}return this}}function Td(r,t,e=2){const n=t&&t.length,i=n?t[0]*e:r.length;let s=Fc(r,0,i,e,!0);const o=[];if(!s||s.next===s.prev)return o;let a,l,c;if(n&&(s=Pd(r,t,s,e)),r.length>80*e){a=r[0],l=r[1];let d=a,u=l;for(let h=e;h<i;h+=e){const f=r[h],g=r[h+1];f<a&&(a=f),g<l&&(l=g),f>d&&(d=f),g>u&&(u=g)}c=Math.max(d-a,u-l),c=c!==0?32767/c:0}return es(s,o,e,a,l,c,0),o}function Fc(r,t,e,n,i){let s;if(i===Gd(r,t,e,n)>0)for(let o=t;o<e;o+=n)s=dl(o/n|0,r[o],r[o+1],s);else for(let o=e-n;o>=t;o-=n)s=dl(o/n|0,r[o],r[o+1],s);return s&&Ci(s,s.next)&&(is(s),s=s.next),s}function ni(r,t){if(!r)return r;t||(t=r);let e=r,n;do if(n=!1,!e.steiner&&(Ci(e,e.next)||me(e.prev,e,e.next)===0)){if(is(e),e=t=e.prev,e===e.next)break;n=!0}else e=e.next;while(n||e!==t);return t}function es(r,t,e,n,i,s,o){if(!r)return;!o&&s&&Ud(r,n,i,s);let a=r;for(;r.prev!==r.next;){const l=r.prev,c=r.next;if(s?Ad(r,n,i,s):wd(r)){t.push(l.i,r.i,c.i),is(r),r=c.next,a=c.next;continue}if(r=c,r===a){o?o===1?(r=Cd(ni(r),t),es(r,t,e,n,i,s,2)):o===2&&Rd(r,t,e,n,i,s):es(ni(r),t,e,n,i,s,1);break}}}function wd(r){const t=r.prev,e=r,n=r.next;if(me(t,e,n)>=0)return!1;const i=t.x,s=e.x,o=n.x,a=t.y,l=e.y,c=n.y,d=Math.min(i,s,o),u=Math.min(a,l,c),h=Math.max(i,s,o),f=Math.max(a,l,c);let g=n.next;for(;g!==t;){if(g.x>=d&&g.x<=h&&g.y>=u&&g.y<=f&&Xi(i,a,s,l,o,c,g.x,g.y)&&me(g.prev,g,g.next)>=0)return!1;g=g.next}return!0}function Ad(r,t,e,n){const i=r.prev,s=r,o=r.next;if(me(i,s,o)>=0)return!1;const a=i.x,l=s.x,c=o.x,d=i.y,u=s.y,h=o.y,f=Math.min(a,l,c),g=Math.min(d,u,h),y=Math.max(a,l,c),p=Math.max(d,u,h),m=Yo(f,g,t,e,n),x=Yo(y,p,t,e,n);let M=r.prevZ,S=r.nextZ;for(;M&&M.z>=m&&S&&S.z<=x;){if(M.x>=f&&M.x<=y&&M.y>=g&&M.y<=p&&M!==i&&M!==o&&Xi(a,d,l,u,c,h,M.x,M.y)&&me(M.prev,M,M.next)>=0||(M=M.prevZ,S.x>=f&&S.x<=y&&S.y>=g&&S.y<=p&&S!==i&&S!==o&&Xi(a,d,l,u,c,h,S.x,S.y)&&me(S.prev,S,S.next)>=0))return!1;S=S.nextZ}for(;M&&M.z>=m;){if(M.x>=f&&M.x<=y&&M.y>=g&&M.y<=p&&M!==i&&M!==o&&Xi(a,d,l,u,c,h,M.x,M.y)&&me(M.prev,M,M.next)>=0)return!1;M=M.prevZ}for(;S&&S.z<=x;){if(S.x>=f&&S.x<=y&&S.y>=g&&S.y<=p&&S!==i&&S!==o&&Xi(a,d,l,u,c,h,S.x,S.y)&&me(S.prev,S,S.next)>=0)return!1;S=S.nextZ}return!0}function Cd(r,t){let e=r;do{const n=e.prev,i=e.next.next;!Ci(n,i)&&Bc(n,e,e.next,i)&&ns(n,i)&&ns(i,n)&&(t.push(n.i,e.i,i.i),is(e),is(e.next),e=r=i),e=e.next}while(e!==r);return ni(e)}function Rd(r,t,e,n,i,s){let o=r;do{let a=o.next.next;for(;a!==o.prev;){if(o.i!==a.i&&Bd(o,a)){let l=kc(o,a);o=ni(o,o.next),l=ni(l,l.next),es(o,t,e,n,i,s,0),es(l,t,e,n,i,s,0);return}a=a.next}o=o.next}while(o!==r)}function Pd(r,t,e,n){const i=[];for(let s=0,o=t.length;s<o;s++){const a=t[s]*n,l=s<o-1?t[s+1]*n:r.length,c=Fc(r,a,l,n,!1);c===c.next&&(c.steiner=!0),i.push(Od(c))}i.sort(Ld);for(let s=0;s<i.length;s++)e=Id(i[s],e);return e}function Ld(r,t){let e=r.x-t.x;if(e===0&&(e=r.y-t.y,e===0)){const n=(r.next.y-r.y)/(r.next.x-r.x),i=(t.next.y-t.y)/(t.next.x-t.x);e=n-i}return e}function Id(r,t){const e=Dd(r,t);if(!e)return t;const n=kc(e,r);return ni(n,n.next),ni(e,e.next)}function Dd(r,t){let e=t;const n=r.x,i=r.y;let s=-1/0,o;if(Ci(r,e))return e;do{if(Ci(r,e.next))return e.next;if(i<=e.y&&i>=e.next.y&&e.next.y!==e.y){const u=e.x+(i-e.y)*(e.next.x-e.x)/(e.next.y-e.y);if(u<=n&&u>s&&(s=u,o=e.x<e.next.x?e:e.next,u===n))return o}e=e.next}while(e!==t);if(!o)return null;const a=o,l=o.x,c=o.y;let d=1/0;e=o;do{if(n>=e.x&&e.x>=l&&n!==e.x&&Oc(i<c?n:s,i,l,c,i<c?s:n,i,e.x,e.y)){const u=Math.abs(i-e.y)/(n-e.x);ns(e,r)&&(u<d||u===d&&(e.x>o.x||e.x===o.x&&Nd(o,e)))&&(o=e,d=u)}e=e.next}while(e!==a);return o}function Nd(r,t){return me(r.prev,r,t.prev)<0&&me(t.next,r,r.next)<0}function Ud(r,t,e,n){let i=r;do i.z===0&&(i.z=Yo(i.x,i.y,t,e,n)),i.prevZ=i.prev,i.nextZ=i.next,i=i.next;while(i!==r);i.prevZ.nextZ=null,i.prevZ=null,Fd(i)}function Fd(r){let t,e=1;do{let n=r,i;r=null;let s=null;for(t=0;n;){t++;let o=n,a=0;for(let c=0;c<e&&(a++,o=o.nextZ,!!o);c++);let l=e;for(;a>0||l>0&&o;)a!==0&&(l===0||!o||n.z<=o.z)?(i=n,n=n.nextZ,a--):(i=o,o=o.nextZ,l--),s?s.nextZ=i:r=i,i.prevZ=s,s=i;n=o}s.nextZ=null,e*=2}while(t>1);return r}function Yo(r,t,e,n,i){return r=(r-e)*i|0,t=(t-n)*i|0,r=(r|r<<8)&16711935,r=(r|r<<4)&252645135,r=(r|r<<2)&858993459,r=(r|r<<1)&1431655765,t=(t|t<<8)&16711935,t=(t|t<<4)&252645135,t=(t|t<<2)&858993459,t=(t|t<<1)&1431655765,r|t<<1}function Od(r){let t=r,e=r;do(t.x<e.x||t.x===e.x&&t.y<e.y)&&(e=t),t=t.next;while(t!==r);return e}function Oc(r,t,e,n,i,s,o,a){return(i-o)*(t-a)>=(r-o)*(s-a)&&(r-o)*(n-a)>=(e-o)*(t-a)&&(e-o)*(s-a)>=(i-o)*(n-a)}function Xi(r,t,e,n,i,s,o,a){return!(r===o&&t===a)&&Oc(r,t,e,n,i,s,o,a)}function Bd(r,t){return r.next.i!==t.i&&r.prev.i!==t.i&&!kd(r,t)&&(ns(r,t)&&ns(t,r)&&zd(r,t)&&(me(r.prev,r,t.prev)||me(r,t.prev,t))||Ci(r,t)&&me(r.prev,r,r.next)>0&&me(t.prev,t,t.next)>0)}function me(r,t,e){return(t.y-r.y)*(e.x-t.x)-(t.x-r.x)*(e.y-t.y)}function Ci(r,t){return r.x===t.x&&r.y===t.y}function Bc(r,t,e,n){const i=Ps(me(r,t,e)),s=Ps(me(r,t,n)),o=Ps(me(e,n,r)),a=Ps(me(e,n,t));return!!(i!==s&&o!==a||i===0&&Rs(r,e,t)||s===0&&Rs(r,n,t)||o===0&&Rs(e,r,n)||a===0&&Rs(e,t,n))}function Rs(r,t,e){return t.x<=Math.max(r.x,e.x)&&t.x>=Math.min(r.x,e.x)&&t.y<=Math.max(r.y,e.y)&&t.y>=Math.min(r.y,e.y)}function Ps(r){return r>0?1:r<0?-1:0}function kd(r,t){let e=r;do{if(e.i!==r.i&&e.next.i!==r.i&&e.i!==t.i&&e.next.i!==t.i&&Bc(e,e.next,r,t))return!0;e=e.next}while(e!==r);return!1}function ns(r,t){return me(r.prev,r,r.next)<0?me(r,t,r.next)>=0&&me(r,r.prev,t)>=0:me(r,t,r.prev)<0||me(r,r.next,t)<0}function zd(r,t){let e=r,n=!1;const i=(r.x+t.x)/2,s=(r.y+t.y)/2;do e.y>s!=e.next.y>s&&e.next.y!==e.y&&i<(e.next.x-e.x)*(s-e.y)/(e.next.y-e.y)+e.x&&(n=!n),e=e.next;while(e!==r);return n}function kc(r,t){const e=$o(r.i,r.x,r.y),n=$o(t.i,t.x,t.y),i=r.next,s=t.prev;return r.next=t,t.prev=r,e.next=i,i.prev=e,n.next=e,e.prev=n,s.next=n,n.prev=s,n}function dl(r,t,e,n){const i=$o(r,t,e);return n?(i.next=n.next,i.prev=n,n.next.prev=i,n.next=i):(i.prev=i,i.next=i),i}function is(r){r.next.prev=r.prev,r.prev.next=r.next,r.prevZ&&(r.prevZ.nextZ=r.nextZ),r.nextZ&&(r.nextZ.prevZ=r.prevZ)}function $o(r,t,e){return{i:r,x:t,y:e,prev:null,next:null,z:0,prevZ:null,nextZ:null,steiner:!1}}function Gd(r,t,e,n){let i=0;for(let s=t,o=e-n;s<e;s+=n)i+=(r[o]-r[s])*(r[s+1]+r[o+1]),o=s;return i}class Vd{static triangulate(t,e,n=2){return Td(t,e,n)}}class yi{static area(t){const e=t.length;let n=0;for(let i=e-1,s=0;s<e;i=s++)n+=t[i].x*t[s].y-t[s].x*t[i].y;return n*.5}static isClockWise(t){return yi.area(t)<0}static triangulateShape(t,e){const n=[],i=[],s=[];ul(t),fl(n,t);let o=t.length;e.forEach(ul);for(let l=0;l<e.length;l++)i.push(o),o+=e[l].length,fl(n,e[l]);const a=Vd.triangulate(n,i);for(let l=0;l<a.length;l+=3)s.push(a.slice(l,l+3));return s}}function ul(r){const t=r.length;t>2&&r[t-1].equals(r[0])&&r.pop()}function fl(r,t){for(let e=0;e<t.length;e++)r.push(t[e].x),r.push(t[e].y)}class sr extends Ae{constructor(t=new xa([new ot(.5,.5),new ot(-.5,.5),new ot(-.5,-.5),new ot(.5,-.5)]),e={}){super(),this.type="ExtrudeGeometry",this.parameters={shapes:t,options:e},t=Array.isArray(t)?t:[t];const n=this,i=[],s=[];for(let a=0,l=t.length;a<l;a++){const c=t[a];o(c)}this.setAttribute("position",new fe(i,3)),this.setAttribute("uv",new fe(s,2)),this.computeVertexNormals();function o(a){const l=[],c=e.curveSegments!==void 0?e.curveSegments:12,d=e.steps!==void 0?e.steps:1,u=e.depth!==void 0?e.depth:1;let h=e.bevelEnabled!==void 0?e.bevelEnabled:!0,f=e.bevelThickness!==void 0?e.bevelThickness:.2,g=e.bevelSize!==void 0?e.bevelSize:f-.1,y=e.bevelOffset!==void 0?e.bevelOffset:0,p=e.bevelSegments!==void 0?e.bevelSegments:3;const m=e.extrudePath,x=e.UVGenerator!==void 0?e.UVGenerator:Hd;let M,S=!1,C,w,R,v;if(m){M=m.getSpacedPoints(d),S=!0,h=!1;const Z=m.isCatmullRomCurve3?m.closed:!1;C=m.computeFrenetFrames(d,Z),w=new E,R=new E,v=new E}h||(p=0,f=0,g=0,y=0);const A=a.extractPoints(c);let D=A.shape;const L=A.holes;if(!yi.isClockWise(D)){D=D.reverse();for(let Z=0,it=L.length;Z<it;Z++){const j=L[Z];yi.isClockWise(j)&&(L[Z]=j.reverse())}}function W(Z){const j=10000000000000001e-36;let _t=Z[0];for(let ft=1;ft<=Z.length;ft++){const zt=ft%Z.length,I=Z[zt],Ht=I.x-_t.x,Ct=I.y-_t.y,Gt=Ht*Ht+Ct*Ct,st=Math.max(Math.abs(I.x),Math.abs(I.y),Math.abs(_t.x),Math.abs(_t.y)),oe=j*st*st;if(Gt<=oe){Z.splice(zt,1),ft--;continue}_t=I}}W(D),L.forEach(W);const q=L.length,U=D;for(let Z=0;Z<q;Z++){const it=L[Z];D=D.concat(it)}function V(Z,it,j){return it||ee("ExtrudeGeometry: vec does not exist"),Z.clone().addScaledVector(it,j)}const k=D.length;function et(Z,it,j){let _t,ft,zt;const I=Z.x-it.x,Ht=Z.y-it.y,Ct=j.x-Z.x,Gt=j.y-Z.y,st=I*I+Ht*Ht,oe=I*Gt-Ht*Ct;if(Math.abs(oe)>Number.EPSILON){const T=Math.sqrt(st),_=Math.sqrt(Ct*Ct+Gt*Gt),B=it.x-Ht/T,$=it.y+I/T,Q=j.x-Gt/_,rt=j.y+Ct/_,ht=((Q-B)*Gt-(rt-$)*Ct)/(I*Gt-Ht*Ct);_t=B+I*ht-Z.x,ft=$+Ht*ht-Z.y;const X=_t*_t+ft*ft;if(X<=2)return new ot(_t,ft);zt=Math.sqrt(X/2)}else{let T=!1;I>Number.EPSILON?Ct>Number.EPSILON&&(T=!0):I<-Number.EPSILON?Ct<-Number.EPSILON&&(T=!0):Math.sign(Ht)===Math.sign(Gt)&&(T=!0),T?(_t=-Ht,ft=I,zt=Math.sqrt(st)):(_t=I,ft=Ht,zt=Math.sqrt(st/2))}return new ot(_t/zt,ft/zt)}const nt=[];for(let Z=0,it=U.length,j=it-1,_t=Z+1;Z<it;Z++,j++,_t++)j===it&&(j=0),_t===it&&(_t=0),nt[Z]=et(U[Z],U[j],U[_t]);const pt=[];let St,At=nt.concat();for(let Z=0,it=q;Z<it;Z++){const j=L[Z];St=[];for(let _t=0,ft=j.length,zt=ft-1,I=_t+1;_t<ft;_t++,zt++,I++)zt===ft&&(zt=0),I===ft&&(I=0),St[_t]=et(j[_t],j[zt],j[I]);pt.push(St),At=At.concat(St)}let $t;if(p===0)$t=yi.triangulateShape(U,L);else{const Z=[],it=[];for(let j=0;j<p;j++){const _t=j/p,ft=f*Math.cos(_t*Math.PI/2),zt=g*Math.sin(_t*Math.PI/2)+y;for(let I=0,Ht=U.length;I<Ht;I++){const Ct=V(U[I],nt[I],zt);Pt(Ct.x,Ct.y,-ft),_t===0&&Z.push(Ct)}for(let I=0,Ht=q;I<Ht;I++){const Ct=L[I];St=pt[I];const Gt=[];for(let st=0,oe=Ct.length;st<oe;st++){const T=V(Ct[st],St[st],zt);Pt(T.x,T.y,-ft),_t===0&&Gt.push(T)}_t===0&&it.push(Gt)}}$t=yi.triangulateShape(Z,it)}const ne=$t.length,Vt=g+y;for(let Z=0;Z<k;Z++){const it=h?V(D[Z],At[Z],Vt):D[Z];S?(R.copy(C.normals[0]).multiplyScalar(it.x),w.copy(C.binormals[0]).multiplyScalar(it.y),v.copy(M[0]).add(R).add(w),Pt(v.x,v.y,v.z)):Pt(it.x,it.y,0)}for(let Z=1;Z<=d;Z++)for(let it=0;it<k;it++){const j=h?V(D[it],At[it],Vt):D[it];S?(R.copy(C.normals[Z]).multiplyScalar(j.x),w.copy(C.binormals[Z]).multiplyScalar(j.y),v.copy(M[Z]).add(R).add(w),Pt(v.x,v.y,v.z)):Pt(j.x,j.y,u/d*Z)}for(let Z=p-1;Z>=0;Z--){const it=Z/p,j=f*Math.cos(it*Math.PI/2),_t=g*Math.sin(it*Math.PI/2)+y;for(let ft=0,zt=U.length;ft<zt;ft++){const I=V(U[ft],nt[ft],_t);Pt(I.x,I.y,u+j)}for(let ft=0,zt=L.length;ft<zt;ft++){const I=L[ft];St=pt[ft];for(let Ht=0,Ct=I.length;Ht<Ct;Ht++){const Gt=V(I[Ht],St[Ht],_t);S?Pt(Gt.x,Gt.y+M[d-1].y,M[d-1].x+j):Pt(Gt.x,Gt.y,u+j)}}}J(),gt();function J(){const Z=i.length/3;if(h){let it=0,j=k*it;for(let _t=0;_t<ne;_t++){const ft=$t[_t];Ot(ft[2]+j,ft[1]+j,ft[0]+j)}it=d+p*2,j=k*it;for(let _t=0;_t<ne;_t++){const ft=$t[_t];Ot(ft[0]+j,ft[1]+j,ft[2]+j)}}else{for(let it=0;it<ne;it++){const j=$t[it];Ot(j[2],j[1],j[0])}for(let it=0;it<ne;it++){const j=$t[it];Ot(j[0]+k*d,j[1]+k*d,j[2]+k*d)}}n.addGroup(Z,i.length/3-Z,0)}function gt(){const Z=i.length/3;let it=0;at(U,it),it+=U.length;for(let j=0,_t=L.length;j<_t;j++){const ft=L[j];at(ft,it),it+=ft.length}n.addGroup(Z,i.length/3-Z,1)}function at(Z,it){let j=Z.length;for(;--j>=0;){const _t=j;let ft=j-1;ft<0&&(ft=Z.length-1);for(let zt=0,I=d+p*2;zt<I;zt++){const Ht=k*zt,Ct=k*(zt+1),Gt=it+_t+Ht,st=it+ft+Ht,oe=it+ft+Ct,T=it+_t+Ct;Ut(Gt,st,oe,T)}}}function Pt(Z,it,j){l.push(Z),l.push(it),l.push(j)}function Ot(Z,it,j){ie(Z),ie(it),ie(j);const _t=i.length/3,ft=x.generateTopUV(n,i,_t-3,_t-2,_t-1);kt(ft[0]),kt(ft[1]),kt(ft[2])}function Ut(Z,it,j,_t){ie(Z),ie(it),ie(_t),ie(it),ie(j),ie(_t);const ft=i.length/3,zt=x.generateSideWallUV(n,i,ft-6,ft-3,ft-2,ft-1);kt(zt[0]),kt(zt[1]),kt(zt[3]),kt(zt[1]),kt(zt[2]),kt(zt[3])}function ie(Z){i.push(l[Z*3+0]),i.push(l[Z*3+1]),i.push(l[Z*3+2])}function kt(Z){s.push(Z.x),s.push(Z.y)}}}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}toJSON(){const t=super.toJSON(),e=this.parameters.shapes,n=this.parameters.options;return Wd(e,n,t)}static fromJSON(t,e){const n=[];for(let s=0,o=t.shapes.length;s<o;s++){const a=e[t.shapes[s]];n.push(a)}const i=t.options.extrudePath;return i!==void 0&&(t.options.extrudePath=new qo[i.type]().fromJSON(i)),new sr(n,t.options)}}const Hd={generateTopUV:function(r,t,e,n,i){const s=t[e*3],o=t[e*3+1],a=t[n*3],l=t[n*3+1],c=t[i*3],d=t[i*3+1];return[new ot(s,o),new ot(a,l),new ot(c,d)]},generateSideWallUV:function(r,t,e,n,i,s){const o=t[e*3],a=t[e*3+1],l=t[e*3+2],c=t[n*3],d=t[n*3+1],u=t[n*3+2],h=t[i*3],f=t[i*3+1],g=t[i*3+2],y=t[s*3],p=t[s*3+1],m=t[s*3+2];return Math.abs(a-d)<Math.abs(o-c)?[new ot(o,1-l),new ot(c,1-u),new ot(h,1-g),new ot(y,1-m)]:[new ot(a,1-l),new ot(d,1-u),new ot(f,1-g),new ot(p,1-m)]}};function Wd(r,t,e){if(e.shapes=[],Array.isArray(r))for(let n=0,i=r.length;n<i;n++){const s=r[n];e.shapes.push(s.uuid)}else e.shapes.push(r.uuid);return e.options=Object.assign({},t),t.extrudePath!==void 0&&(e.options.extrudePath=t.extrudePath.toJSON()),e}class _a extends Ae{constructor(t=[new ot(0,-.5),new ot(.5,0),new ot(0,.5)],e=12,n=0,i=Math.PI*2){super(),this.type="LatheGeometry",this.parameters={points:t,segments:e,phiStart:n,phiLength:i},e=Math.floor(e),i=jt(i,0,Math.PI*2);const s=[],o=[],a=[],l=[],c=[],d=1/e,u=new E,h=new ot,f=new E,g=new E,y=new E;let p=0,m=0;for(let x=0;x<=t.length-1;x++)switch(x){case 0:p=t[x+1].x-t[x].x,m=t[x+1].y-t[x].y,f.x=m*1,f.y=-p,f.z=m*0,y.copy(f),f.normalize(),l.push(f.x,f.y,f.z);break;case t.length-1:l.push(y.x,y.y,y.z);break;default:p=t[x+1].x-t[x].x,m=t[x+1].y-t[x].y,f.x=m*1,f.y=-p,f.z=m*0,g.copy(f),f.x+=y.x,f.y+=y.y,f.z+=y.z,f.normalize(),l.push(f.x,f.y,f.z),y.copy(g)}for(let x=0;x<=e;x++){const M=n+x*d*i,S=Math.sin(M),C=Math.cos(M);for(let w=0;w<=t.length-1;w++){u.x=t[w].x*S,u.y=t[w].y,u.z=t[w].x*C,o.push(u.x,u.y,u.z),h.x=x/e,h.y=w/(t.length-1),a.push(h.x,h.y);const R=l[3*w+0]*S,v=l[3*w+1],A=l[3*w+0]*C;c.push(R,v,A)}}for(let x=0;x<e;x++)for(let M=0;M<t.length-1;M++){const S=M+x*t.length,C=S,w=S+t.length,R=S+t.length+1,v=S+1;s.push(C,w,v),s.push(R,v,w)}this.setIndex(s),this.setAttribute("position",new fe(o,3)),this.setAttribute("uv",new fe(a,2)),this.setAttribute("normal",new fe(c,3))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new _a(t.points,t.segments,t.phiStart,t.phiLength)}}class Di extends Ae{constructor(t=1,e=1,n=1,i=1){super(),this.type="PlaneGeometry",this.parameters={width:t,height:e,widthSegments:n,heightSegments:i};const s=t/2,o=e/2,a=Math.floor(n),l=Math.floor(i),c=a+1,d=l+1,u=t/a,h=e/l,f=[],g=[],y=[],p=[];for(let m=0;m<d;m++){const x=m*h-o;for(let M=0;M<c;M++){const S=M*u-s;g.push(S,-x,0),y.push(0,0,1),p.push(M/a),p.push(1-m/l)}}for(let m=0;m<l;m++)for(let x=0;x<a;x++){const M=x+c*m,S=x+c*(m+1),C=x+1+c*(m+1),w=x+1+c*m;f.push(M,S,w),f.push(S,C,w)}this.setIndex(f),this.setAttribute("position",new fe(g,3)),this.setAttribute("normal",new fe(y,3)),this.setAttribute("uv",new fe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new Di(t.width,t.height,t.widthSegments,t.heightSegments)}}class zn extends Ae{constructor(t=1,e=32,n=16,i=0,s=Math.PI*2,o=0,a=Math.PI){super(),this.type="SphereGeometry",this.parameters={radius:t,widthSegments:e,heightSegments:n,phiStart:i,phiLength:s,thetaStart:o,thetaLength:a},e=Math.max(3,Math.floor(e)),n=Math.max(2,Math.floor(n));const l=Math.min(o+a,Math.PI);let c=0;const d=[],u=new E,h=new E,f=[],g=[],y=[],p=[];for(let m=0;m<=n;m++){const x=[],M=m/n;let S=0;m===0&&o===0?S=.5/e:m===n&&l===Math.PI&&(S=-.5/e);for(let C=0;C<=e;C++){const w=C/e;u.x=-t*Math.cos(i+w*s)*Math.sin(o+M*a),u.y=t*Math.cos(o+M*a),u.z=t*Math.sin(i+w*s)*Math.sin(o+M*a),g.push(u.x,u.y,u.z),h.copy(u).normalize(),y.push(h.x,h.y,h.z),p.push(w+S,1-M),x.push(c++)}d.push(x)}for(let m=0;m<n;m++)for(let x=0;x<e;x++){const M=d[m][x+1],S=d[m][x],C=d[m+1][x],w=d[m+1][x+1];(m!==0||o>0)&&f.push(M,S,w),(m!==n-1||l<Math.PI)&&f.push(S,C,w)}this.setIndex(f),this.setAttribute("position",new fe(g,3)),this.setAttribute("normal",new fe(y,3)),this.setAttribute("uv",new fe(p,2))}copy(t){return super.copy(t),this.parameters=Object.assign({},t.parameters),this}static fromJSON(t){return new zn(t.radius,t.widthSegments,t.heightSegments,t.phiStart,t.phiLength,t.thetaStart,t.thetaLength)}}function Ri(r){const t={};for(const e in r){t[e]={};for(const n in r[e]){const i=r[e][n];if(pl(i))i.isRenderTargetTexture?(Bt("UniformsUtils: Textures of render targets cannot be cloned via cloneUniforms() or mergeUniforms()."),t[e][n]=null):t[e][n]=i.clone();else if(Array.isArray(i))if(pl(i[0])){const s=[];for(let o=0,a=i.length;o<a;o++)s[o]=i[o].clone();t[e][n]=s}else t[e][n]=i.slice();else t[e][n]=i}}return t}function Oe(r){const t={};for(let e=0;e<r.length;e++){const n=Ri(r[e]);for(const i in n)t[i]=n[i]}return t}function pl(r){return r&&(r.isColor||r.isMatrix3||r.isMatrix4||r.isVector2||r.isVector3||r.isVector4||r.isTexture||r.isQuaternion)}function Xd(r){const t=[];for(let e=0;e<r.length;e++)t.push(r[e].clone());return t}function zc(r){const t=r.getRenderTarget();return t===null?r.outputColorSpace:t.isXRRenderTarget===!0?t.texture.colorSpace:te.workingColorSpace}const qd={clone:Ri,merge:Oe};var Yd=`void main() {
	gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
}`,$d=`void main() {
	gl_FragColor = vec4( 1.0, 0.0, 0.0, 1.0 );
}`;class mn extends Ii{constructor(t){super(),this.isShaderMaterial=!0,this.type="ShaderMaterial",this.defines={},this.uniforms={},this.uniformsGroups=[],this.vertexShader=Yd,this.fragmentShader=$d,this.linewidth=1,this.wireframe=!1,this.wireframeLinewidth=1,this.fog=!1,this.lights=!1,this.clipping=!1,this.forceSinglePass=!0,this.extensions={clipCullDistance:!1,multiDraw:!1},this.defaultAttributeValues={color:[1,1,1],uv:[0,0],uv1:[0,0]},this.index0AttributeName=void 0,this.uniformsNeedUpdate=!1,this.glslVersion=null,t!==void 0&&this.setValues(t)}copy(t){return super.copy(t),this.fragmentShader=t.fragmentShader,this.vertexShader=t.vertexShader,this.uniforms=Ri(t.uniforms),this.uniformsGroups=Xd(t.uniformsGroups),this.defines=Object.assign({},t.defines),this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.fog=t.fog,this.lights=t.lights,this.clipping=t.clipping,this.extensions=Object.assign({},t.extensions),this.glslVersion=t.glslVersion,this.defaultAttributeValues=Object.assign({},t.defaultAttributeValues),this.index0AttributeName=t.index0AttributeName,this.uniformsNeedUpdate=t.uniformsNeedUpdate,this}toJSON(t){const e=super.toJSON(t);e.glslVersion=this.glslVersion,e.uniforms={};for(const i in this.uniforms){const o=this.uniforms[i].value;o&&o.isTexture?e.uniforms[i]={type:"t",value:o.toJSON(t).uuid}:o&&o.isColor?e.uniforms[i]={type:"c",value:o.getHex()}:o&&o.isVector2?e.uniforms[i]={type:"v2",value:o.toArray()}:o&&o.isVector3?e.uniforms[i]={type:"v3",value:o.toArray()}:o&&o.isVector4?e.uniforms[i]={type:"v4",value:o.toArray()}:o&&o.isMatrix3?e.uniforms[i]={type:"m3",value:o.toArray()}:o&&o.isMatrix4?e.uniforms[i]={type:"m4",value:o.toArray()}:e.uniforms[i]={value:o}}Object.keys(this.defines).length>0&&(e.defines=this.defines),e.vertexShader=this.vertexShader,e.fragmentShader=this.fragmentShader,e.lights=this.lights,e.clipping=this.clipping;const n={};for(const i in this.extensions)this.extensions[i]===!0&&(n[i]=!0);return Object.keys(n).length>0&&(e.extensions=n),e}}class Kd extends mn{constructor(t){super(t),this.isRawShaderMaterial=!0,this.type="RawShaderMaterial"}}class Lt extends Ii{constructor(t){super(),this.isMeshStandardMaterial=!0,this.type="MeshStandardMaterial",this.defines={STANDARD:""},this.color=new yt(16777215),this.roughness=1,this.metalness=0,this.map=null,this.lightMap=null,this.lightMapIntensity=1,this.aoMap=null,this.aoMapIntensity=1,this.emissive=new yt(0),this.emissiveIntensity=1,this.emissiveMap=null,this.bumpMap=null,this.bumpScale=1,this.normalMap=null,this.normalMapType=Vo,this.normalScale=new ot(1,1),this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.roughnessMap=null,this.metalnessMap=null,this.alphaMap=null,this.envMap=null,this.envMapRotation=new rn,this.envMapIntensity=1,this.wireframe=!1,this.wireframeLinewidth=1,this.wireframeLinecap="round",this.wireframeLinejoin="round",this.flatShading=!1,this.fog=!0,this.setValues(t)}copy(t){return super.copy(t),this.defines={STANDARD:""},this.color.copy(t.color),this.roughness=t.roughness,this.metalness=t.metalness,this.map=t.map,this.lightMap=t.lightMap,this.lightMapIntensity=t.lightMapIntensity,this.aoMap=t.aoMap,this.aoMapIntensity=t.aoMapIntensity,this.emissive.copy(t.emissive),this.emissiveMap=t.emissiveMap,this.emissiveIntensity=t.emissiveIntensity,this.bumpMap=t.bumpMap,this.bumpScale=t.bumpScale,this.normalMap=t.normalMap,this.normalMapType=t.normalMapType,this.normalScale.copy(t.normalScale),this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.roughnessMap=t.roughnessMap,this.metalnessMap=t.metalnessMap,this.alphaMap=t.alphaMap,this.envMap=t.envMap,this.envMapRotation.copy(t.envMapRotation),this.envMapIntensity=t.envMapIntensity,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this.wireframeLinecap=t.wireframeLinecap,this.wireframeLinejoin=t.wireframeLinejoin,this.flatShading=t.flatShading,this.fog=t.fog,this}}class Jd extends Ii{constructor(t){super(),this.isMeshDepthMaterial=!0,this.type="MeshDepthMaterial",this.depthPacking=Lh,this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.wireframe=!1,this.wireframeLinewidth=1,this.setValues(t)}copy(t){return super.copy(t),this.depthPacking=t.depthPacking,this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this.wireframe=t.wireframe,this.wireframeLinewidth=t.wireframeLinewidth,this}}class Zd extends Ii{constructor(t){super(),this.isMeshDistanceMaterial=!0,this.type="MeshDistanceMaterial",this.map=null,this.alphaMap=null,this.displacementMap=null,this.displacementScale=1,this.displacementBias=0,this.setValues(t)}copy(t){return super.copy(t),this.map=t.map,this.alphaMap=t.alphaMap,this.displacementMap=t.displacementMap,this.displacementScale=t.displacementScale,this.displacementBias=t.displacementBias,this}}class va extends Pe{constructor(t,e=1){super(),this.isLight=!0,this.type="Light",this.color=new yt(t),this.intensity=e}dispose(){this.dispatchEvent({type:"dispose"})}copy(t,e){return super.copy(t,e),this.color.copy(t.color),this.intensity=t.intensity,this}toJSON(t){const e=super.toJSON(t);return e.object.color=this.color.getHex(),e.object.intensity=this.intensity,e}}class jd extends va{constructor(t,e,n){super(t,n),this.isHemisphereLight=!0,this.type="HemisphereLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.groundColor=new yt(e)}copy(t,e){return super.copy(t,e),this.groundColor.copy(t.groundColor),this}toJSON(t){const e=super.toJSON(t);return e.object.groundColor=this.groundColor.getHex(),e}}const zr=new Qt,ml=new E,gl=new E;class Gc{constructor(t){this.camera=t,this.intensity=1,this.bias=0,this.biasNode=null,this.normalBias=0,this.radius=1,this.blurSamples=8,this.mapSize=new ot(512,512),this.mapType=ze,this.map=null,this.mapPass=null,this.matrix=new Qt,this.autoUpdate=!0,this.needsUpdate=!1,this._frustum=new da,this._frameExtents=new ot(1,1),this._viewportCount=1,this._viewports=[new xe(0,0,1,1)]}getViewportCount(){return this._viewportCount}getFrustum(){return this._frustum}updateMatrices(t){const e=this.camera,n=this.matrix;ml.setFromMatrixPosition(t.matrixWorld),e.position.copy(ml),gl.setFromMatrixPosition(t.target.matrixWorld),e.lookAt(gl),e.updateMatrixWorld(),zr.multiplyMatrices(e.projectionMatrix,e.matrixWorldInverse),this._frustum.setFromProjectionMatrix(zr,e.coordinateSystem,e.reversedDepth),e.coordinateSystem===ts||e.reversedDepth?n.set(.5,0,0,.5,0,.5,0,.5,0,0,1,0,0,0,0,1):n.set(.5,0,0,.5,0,.5,0,.5,0,0,.5,.5,0,0,0,1),n.multiply(zr)}getViewport(t){return this._viewports[t]}getFrameExtents(){return this._frameExtents}dispose(){this.map&&this.map.dispose(),this.mapPass&&this.mapPass.dispose()}copy(t){return this.camera=t.camera.clone(),this.intensity=t.intensity,this.bias=t.bias,this.radius=t.radius,this.autoUpdate=t.autoUpdate,this.needsUpdate=t.needsUpdate,this.normalBias=t.normalBias,this.blurSamples=t.blurSamples,this.mapSize.copy(t.mapSize),this.biasNode=t.biasNode,this}clone(){return new this.constructor().copy(this)}toJSON(){const t={};return this.intensity!==1&&(t.intensity=this.intensity),this.bias!==0&&(t.bias=this.bias),this.normalBias!==0&&(t.normalBias=this.normalBias),this.radius!==1&&(t.radius=this.radius),(this.mapSize.x!==512||this.mapSize.y!==512)&&(t.mapSize=this.mapSize.toArray()),t.camera=this.camera.toJSON(!1).object,delete t.camera.matrix,t}}const Ls=new E,Is=new Be,ln=new E;class Vc extends Pe{constructor(){super(),this.isCamera=!0,this.type="Camera",this.matrixWorldInverse=new Qt,this.projectionMatrix=new Qt,this.projectionMatrixInverse=new Qt,this.coordinateSystem=dn,this._reversedDepth=!1}get reversedDepth(){return this._reversedDepth}copy(t,e){return super.copy(t,e),this.matrixWorldInverse.copy(t.matrixWorldInverse),this.projectionMatrix.copy(t.projectionMatrix),this.projectionMatrixInverse.copy(t.projectionMatrixInverse),this.coordinateSystem=t.coordinateSystem,this}getWorldDirection(t){return super.getWorldDirection(t).negate()}updateMatrixWorld(t){super.updateMatrixWorld(t),this.matrixWorld.decompose(Ls,Is,ln),ln.x===1&&ln.y===1&&ln.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ls,Is,ln.set(1,1,1)).invert()}updateWorldMatrix(t,e){super.updateWorldMatrix(t,e),this.matrixWorld.decompose(Ls,Is,ln),ln.x===1&&ln.y===1&&ln.z===1?this.matrixWorldInverse.copy(this.matrixWorld).invert():this.matrixWorldInverse.compose(Ls,Is,ln.set(1,1,1)).invert()}clone(){return new this.constructor().copy(this)}}const Bn=new E,xl=new ot,_l=new ot;class qe extends Vc{constructor(t=50,e=1,n=.1,i=2e3){super(),this.isPerspectiveCamera=!0,this.type="PerspectiveCamera",this.fov=t,this.zoom=1,this.near=n,this.far=i,this.focus=10,this.aspect=e,this.view=null,this.filmGauge=35,this.filmOffset=0,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.fov=t.fov,this.zoom=t.zoom,this.near=t.near,this.far=t.far,this.focus=t.focus,this.aspect=t.aspect,this.view=t.view===null?null:Object.assign({},t.view),this.filmGauge=t.filmGauge,this.filmOffset=t.filmOffset,this}setFocalLength(t){const e=.5*this.getFilmHeight()/t;this.fov=Wo*2*Math.atan(e),this.updateProjectionMatrix()}getFocalLength(){const t=Math.tan(fr*.5*this.fov);return .5*this.getFilmHeight()/t}getEffectiveFOV(){return Wo*2*Math.atan(Math.tan(fr*.5*this.fov)/this.zoom)}getFilmWidth(){return this.filmGauge*Math.min(this.aspect,1)}getFilmHeight(){return this.filmGauge/Math.max(this.aspect,1)}getViewBounds(t,e,n){Bn.set(-1,-1,.5).applyMatrix4(this.projectionMatrixInverse),e.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z),Bn.set(1,1,.5).applyMatrix4(this.projectionMatrixInverse),n.set(Bn.x,Bn.y).multiplyScalar(-t/Bn.z)}getViewSize(t,e){return this.getViewBounds(t,xl,_l),e.subVectors(_l,xl)}setViewOffset(t,e,n,i,s,o){this.aspect=t/e,this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=this.near;let e=t*Math.tan(fr*.5*this.fov)/this.zoom,n=2*e,i=this.aspect*n,s=-.5*i;const o=this.view;if(this.view!==null&&this.view.enabled){const l=o.fullWidth,c=o.fullHeight;s+=o.offsetX*i/l,e-=o.offsetY*n/c,i*=o.width/l,n*=o.height/c}const a=this.filmOffset;a!==0&&(s+=t*a/this.getFilmWidth()),this.projectionMatrix.makePerspective(s,s+i,e,e-n,t,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.fov=this.fov,e.object.zoom=this.zoom,e.object.near=this.near,e.object.far=this.far,e.object.focus=this.focus,e.object.aspect=this.aspect,this.view!==null&&(e.object.view=Object.assign({},this.view)),e.object.filmGauge=this.filmGauge,e.object.filmOffset=this.filmOffset,e}}class Qd extends Gc{constructor(){super(new qe(90,1,.5,500)),this.isPointLightShadow=!0}}class rs extends va{constructor(t,e,n=0,i=2){super(t,e),this.isPointLight=!0,this.type="PointLight",this.distance=n,this.decay=i,this.shadow=new Qd}get power(){return this.intensity*4*Math.PI}set power(t){this.intensity=t/(4*Math.PI)}dispose(){super.dispose(),this.shadow.dispose()}copy(t,e){return super.copy(t,e),this.distance=t.distance,this.decay=t.decay,this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.distance=this.distance,e.object.decay=this.decay,e.object.shadow=this.shadow.toJSON(),e}}class rr extends Vc{constructor(t=-1,e=1,n=1,i=-1,s=.1,o=2e3){super(),this.isOrthographicCamera=!0,this.type="OrthographicCamera",this.zoom=1,this.view=null,this.left=t,this.right=e,this.top=n,this.bottom=i,this.near=s,this.far=o,this.updateProjectionMatrix()}copy(t,e){return super.copy(t,e),this.left=t.left,this.right=t.right,this.top=t.top,this.bottom=t.bottom,this.near=t.near,this.far=t.far,this.zoom=t.zoom,this.view=t.view===null?null:Object.assign({},t.view),this}setViewOffset(t,e,n,i,s,o){this.view===null&&(this.view={enabled:!0,fullWidth:1,fullHeight:1,offsetX:0,offsetY:0,width:1,height:1}),this.view.enabled=!0,this.view.fullWidth=t,this.view.fullHeight=e,this.view.offsetX=n,this.view.offsetY=i,this.view.width=s,this.view.height=o,this.updateProjectionMatrix()}clearViewOffset(){this.view!==null&&(this.view.enabled=!1),this.updateProjectionMatrix()}updateProjectionMatrix(){const t=(this.right-this.left)/(2*this.zoom),e=(this.top-this.bottom)/(2*this.zoom),n=(this.right+this.left)/2,i=(this.top+this.bottom)/2;let s=n-t,o=n+t,a=i+e,l=i-e;if(this.view!==null&&this.view.enabled){const c=(this.right-this.left)/this.view.fullWidth/this.zoom,d=(this.top-this.bottom)/this.view.fullHeight/this.zoom;s+=c*this.view.offsetX,o=s+c*this.view.width,a-=d*this.view.offsetY,l=a-d*this.view.height}this.projectionMatrix.makeOrthographic(s,o,a,l,this.near,this.far,this.coordinateSystem,this.reversedDepth),this.projectionMatrixInverse.copy(this.projectionMatrix).invert()}toJSON(t){const e=super.toJSON(t);return e.object.zoom=this.zoom,e.object.left=this.left,e.object.right=this.right,e.object.top=this.top,e.object.bottom=this.bottom,e.object.near=this.near,e.object.far=this.far,this.view!==null&&(e.object.view=Object.assign({},this.view)),e}}class tu extends Gc{constructor(){super(new rr(-5,5,5,-5,.5,500)),this.isDirectionalLightShadow=!0}}class eu extends va{constructor(t,e){super(t,e),this.isDirectionalLight=!0,this.type="DirectionalLight",this.position.copy(Pe.DEFAULT_UP),this.updateMatrix(),this.target=new Pe,this.shadow=new tu}dispose(){super.dispose(),this.shadow.dispose()}copy(t){return super.copy(t),this.target=t.target.clone(),this.shadow=t.shadow.clone(),this}toJSON(t){const e=super.toJSON(t);return e.object.shadow=this.shadow.toJSON(),e.object.target=this.target.uuid,e}}const vi=-90,Mi=1;class nu extends Pe{constructor(t,e,n){super(),this.type="CubeCamera",this.renderTarget=n,this.coordinateSystem=null,this.activeMipmapLevel=0;const i=new qe(vi,Mi,t,e);i.layers=this.layers,this.add(i);const s=new qe(vi,Mi,t,e);s.layers=this.layers,this.add(s);const o=new qe(vi,Mi,t,e);o.layers=this.layers,this.add(o);const a=new qe(vi,Mi,t,e);a.layers=this.layers,this.add(a);const l=new qe(vi,Mi,t,e);l.layers=this.layers,this.add(l);const c=new qe(vi,Mi,t,e);c.layers=this.layers,this.add(c)}updateCoordinateSystem(){const t=this.coordinateSystem,e=this.children.concat(),[n,i,s,o,a,l]=e;for(const c of e)this.remove(c);if(t===dn)n.up.set(0,1,0),n.lookAt(1,0,0),i.up.set(0,1,0),i.lookAt(-1,0,0),s.up.set(0,0,-1),s.lookAt(0,1,0),o.up.set(0,0,1),o.lookAt(0,-1,0),a.up.set(0,1,0),a.lookAt(0,0,1),l.up.set(0,1,0),l.lookAt(0,0,-1);else if(t===ts)n.up.set(0,-1,0),n.lookAt(-1,0,0),i.up.set(0,-1,0),i.lookAt(1,0,0),s.up.set(0,0,1),s.lookAt(0,1,0),o.up.set(0,0,-1),o.lookAt(0,-1,0),a.up.set(0,-1,0),a.lookAt(0,0,1),l.up.set(0,-1,0),l.lookAt(0,0,-1);else throw new Error("THREE.CubeCamera.updateCoordinateSystem(): Invalid coordinate system: "+t);for(const c of e)this.add(c),c.updateMatrixWorld()}update(t,e){this.parent===null&&this.updateMatrixWorld();const{renderTarget:n,activeMipmapLevel:i}=this;this.coordinateSystem!==t.coordinateSystem&&(this.coordinateSystem=t.coordinateSystem,this.updateCoordinateSystem());const[s,o,a,l,c,d]=this.children,u=t.getRenderTarget(),h=t.getActiveCubeFace(),f=t.getActiveMipmapLevel(),g=t.xr.enabled;t.xr.enabled=!1;const y=n.texture.generateMipmaps;n.texture.generateMipmaps=!1;let p=!1;t.isWebGLRenderer===!0?p=t.state.buffers.depth.getReversed():p=t.reversedDepthBuffer,t.setRenderTarget(n,0,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,s),t.setRenderTarget(n,1,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,o),t.setRenderTarget(n,2,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,a),t.setRenderTarget(n,3,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,l),t.setRenderTarget(n,4,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,c),n.texture.generateMipmaps=y,t.setRenderTarget(n,5,i),p&&t.autoClear===!1&&t.clearDepth(),t.render(e,d),t.setRenderTarget(u,h,f),t.xr.enabled=g,n.texture.needsPMREMUpdate=!0}}class iu extends qe{constructor(t=[]){super(),this.isArrayCamera=!0,this.isMultiViewCamera=!1,this.cameras=t}}const Ea=class Ea{constructor(t,e,n,i){this.elements=[1,0,0,1],t!==void 0&&this.set(t,e,n,i)}identity(){return this.set(1,0,0,1),this}fromArray(t,e=0){for(let n=0;n<4;n++)this.elements[n]=t[n+e];return this}set(t,e,n,i){const s=this.elements;return s[0]=t,s[2]=e,s[1]=n,s[3]=i,this}};Ea.prototype.isMatrix2=!0;let vl=Ea;function Ml(r,t,e,n){const i=su(n);switch(e){case vc:return r*t;case na:return r*t/i.components*i.byteLength;case ia:return r*t/i.components*i.byteLength;case ei:return r*t*2/i.components*i.byteLength;case sa:return r*t*2/i.components*i.byteLength;case Mc:return r*t*3/i.components*i.byteLength;case Je:return r*t*4/i.components*i.byteLength;case ra:return r*t*4/i.components*i.byteLength;case Ws:case Xs:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case qs:case Ys:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case fo:case mo:return Math.max(r,16)*Math.max(t,8)/4;case uo:case po:return Math.max(r,8)*Math.max(t,8)/2;case go:case xo:case vo:case Mo:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*8;case _o:case Ks:case So:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case yo:return Math.floor((r+3)/4)*Math.floor((t+3)/4)*16;case bo:return Math.floor((r+4)/5)*Math.floor((t+3)/4)*16;case Eo:return Math.floor((r+4)/5)*Math.floor((t+4)/5)*16;case To:return Math.floor((r+5)/6)*Math.floor((t+4)/5)*16;case wo:return Math.floor((r+5)/6)*Math.floor((t+5)/6)*16;case Ao:return Math.floor((r+7)/8)*Math.floor((t+4)/5)*16;case Co:return Math.floor((r+7)/8)*Math.floor((t+5)/6)*16;case Ro:return Math.floor((r+7)/8)*Math.floor((t+7)/8)*16;case Po:return Math.floor((r+9)/10)*Math.floor((t+4)/5)*16;case Lo:return Math.floor((r+9)/10)*Math.floor((t+5)/6)*16;case Io:return Math.floor((r+9)/10)*Math.floor((t+7)/8)*16;case Do:return Math.floor((r+9)/10)*Math.floor((t+9)/10)*16;case No:return Math.floor((r+11)/12)*Math.floor((t+9)/10)*16;case Uo:return Math.floor((r+11)/12)*Math.floor((t+11)/12)*16;case Fo:case Oo:case Bo:return Math.ceil(r/4)*Math.ceil(t/4)*16;case ko:case zo:return Math.ceil(r/4)*Math.ceil(t/4)*8;case Js:case Go:return Math.ceil(r/4)*Math.ceil(t/4)*16}throw new Error(`Unable to determine texture byte length for ${e} format.`)}function su(r){switch(r){case ze:case mc:return{byteLength:1,components:1};case ji:case gc:case Cn:return{byteLength:2,components:1};case ta:case ea:return{byteLength:2,components:4};case pn:case Qo:case nn:return{byteLength:4,components:1};case xc:case _c:return{byteLength:4,components:3}}throw new Error(`Unknown texture type ${r}.`)}typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("register",{detail:{revision:Zo}}));typeof window<"u"&&(window.__THREE__?Bt("WARNING: Multiple instances of Three.js being imported."):window.__THREE__=Zo);/**
 * @license
 * Copyright 2010-2026 Three.js Authors
 * SPDX-License-Identifier: MIT
 */function Hc(){let r=null,t=!1,e=null,n=null;function i(s,o){e(s,o),n=r.requestAnimationFrame(i)}return{start:function(){t!==!0&&e!==null&&r!==null&&(n=r.requestAnimationFrame(i),t=!0)},stop:function(){r!==null&&r.cancelAnimationFrame(n),t=!1},setAnimationLoop:function(s){e=s},setContext:function(s){r=s}}}function ru(r){const t=new WeakMap;function e(a,l){const c=a.array,d=a.usage,u=c.byteLength,h=r.createBuffer();r.bindBuffer(l,h),r.bufferData(l,c,d),a.onUploadCallback();let f;if(c instanceof Float32Array)f=r.FLOAT;else if(typeof Float16Array<"u"&&c instanceof Float16Array)f=r.HALF_FLOAT;else if(c instanceof Uint16Array)a.isFloat16BufferAttribute?f=r.HALF_FLOAT:f=r.UNSIGNED_SHORT;else if(c instanceof Int16Array)f=r.SHORT;else if(c instanceof Uint32Array)f=r.UNSIGNED_INT;else if(c instanceof Int32Array)f=r.INT;else if(c instanceof Int8Array)f=r.BYTE;else if(c instanceof Uint8Array)f=r.UNSIGNED_BYTE;else if(c instanceof Uint8ClampedArray)f=r.UNSIGNED_BYTE;else throw new Error("THREE.WebGLAttributes: Unsupported buffer data format: "+c);return{buffer:h,type:f,bytesPerElement:c.BYTES_PER_ELEMENT,version:a.version,size:u}}function n(a,l,c){const d=l.array,u=l.updateRanges;if(r.bindBuffer(c,a),u.length===0)r.bufferSubData(c,0,d);else{u.sort((f,g)=>f.start-g.start);let h=0;for(let f=1;f<u.length;f++){const g=u[h],y=u[f];y.start<=g.start+g.count+1?g.count=Math.max(g.count,y.start+y.count-g.start):(++h,u[h]=y)}u.length=h+1;for(let f=0,g=u.length;f<g;f++){const y=u[f];r.bufferSubData(c,y.start*d.BYTES_PER_ELEMENT,d,y.start,y.count)}l.clearUpdateRanges()}l.onUploadCallback()}function i(a){return a.isInterleavedBufferAttribute&&(a=a.data),t.get(a)}function s(a){a.isInterleavedBufferAttribute&&(a=a.data);const l=t.get(a);l&&(r.deleteBuffer(l.buffer),t.delete(a))}function o(a,l){if(a.isInterleavedBufferAttribute&&(a=a.data),a.isGLBufferAttribute){const d=t.get(a);(!d||d.version<a.version)&&t.set(a,{buffer:a.buffer,type:a.type,bytesPerElement:a.elementSize,version:a.version});return}const c=t.get(a);if(c===void 0)t.set(a,e(a,l));else if(c.version<a.version){if(c.size!==a.array.byteLength)throw new Error("THREE.WebGLAttributes: The size of the buffer attribute's array buffer does not match the original size. Resizing buffer attributes is not supported.");n(c.buffer,a,l),c.version=a.version}}return{get:i,remove:s,update:o}}var ou=`#ifdef USE_ALPHAHASH
	if ( diffuseColor.a < getAlphaHashThreshold( vPosition ) ) discard;
#endif`,au=`#ifdef USE_ALPHAHASH
	const float ALPHA_HASH_SCALE = 0.05;
	float hash2D( vec2 value ) {
		return fract( 1.0e4 * sin( 17.0 * value.x + 0.1 * value.y ) * ( 0.1 + abs( sin( 13.0 * value.y + value.x ) ) ) );
	}
	float hash3D( vec3 value ) {
		return hash2D( vec2( hash2D( value.xy ), value.z ) );
	}
	float getAlphaHashThreshold( vec3 position ) {
		float maxDeriv = max(
			length( dFdx( position.xyz ) ),
			length( dFdy( position.xyz ) )
		);
		float pixScale = 1.0 / ( ALPHA_HASH_SCALE * maxDeriv );
		vec2 pixScales = vec2(
			exp2( floor( log2( pixScale ) ) ),
			exp2( ceil( log2( pixScale ) ) )
		);
		vec2 alpha = vec2(
			hash3D( floor( pixScales.x * position.xyz ) ),
			hash3D( floor( pixScales.y * position.xyz ) )
		);
		float lerpFactor = fract( log2( pixScale ) );
		float x = ( 1.0 - lerpFactor ) * alpha.x + lerpFactor * alpha.y;
		float a = min( lerpFactor, 1.0 - lerpFactor );
		vec3 cases = vec3(
			x * x / ( 2.0 * a * ( 1.0 - a ) ),
			( x - 0.5 * a ) / ( 1.0 - a ),
			1.0 - ( ( 1.0 - x ) * ( 1.0 - x ) / ( 2.0 * a * ( 1.0 - a ) ) )
		);
		float threshold = ( x < ( 1.0 - a ) )
			? ( ( x < a ) ? cases.x : cases.y )
			: cases.z;
		return clamp( threshold , 1.0e-6, 1.0 );
	}
#endif`,lu=`#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, vAlphaMapUv ).g;
#endif`,cu=`#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,hu=`#ifdef USE_ALPHATEST
	#ifdef ALPHA_TO_COVERAGE
	diffuseColor.a = smoothstep( alphaTest, alphaTest + fwidth( diffuseColor.a ), diffuseColor.a );
	if ( diffuseColor.a == 0.0 ) discard;
	#else
	if ( diffuseColor.a < alphaTest ) discard;
	#endif
#endif`,du=`#ifdef USE_ALPHATEST
	uniform float alphaTest;
#endif`,uu=`#ifdef USE_AOMAP
	float ambientOcclusion = ( texture2D( aoMap, vAoMapUv ).r - 1.0 ) * aoMapIntensity + 1.0;
	reflectedLight.indirectDiffuse *= ambientOcclusion;
	#if defined( USE_CLEARCOAT ) 
		clearcoatSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_SHEEN ) 
		sheenSpecularIndirect *= ambientOcclusion;
	#endif
	#if defined( USE_ENVMAP ) && defined( STANDARD )
		float dotNV = saturate( dot( geometryNormal, geometryViewDir ) );
		reflectedLight.indirectSpecular *= computeSpecularOcclusion( dotNV, ambientOcclusion, material.roughness );
	#endif
#endif`,fu=`#ifdef USE_AOMAP
	uniform sampler2D aoMap;
	uniform float aoMapIntensity;
#endif`,pu=`#ifdef USE_BATCHING
	#if ! defined( GL_ANGLE_multi_draw )
	#define gl_DrawID _gl_DrawID
	uniform int _gl_DrawID;
	#endif
	uniform highp sampler2D batchingTexture;
	uniform highp usampler2D batchingIdTexture;
	mat4 getBatchingMatrix( const in float i ) {
		int size = textureSize( batchingTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( batchingTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( batchingTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( batchingTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( batchingTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
	float getIndirectIndex( const in int i ) {
		int size = textureSize( batchingIdTexture, 0 ).x;
		int x = i % size;
		int y = i / size;
		return float( texelFetch( batchingIdTexture, ivec2( x, y ), 0 ).r );
	}
#endif
#ifdef USE_BATCHING_COLOR
	uniform sampler2D batchingColorTexture;
	vec4 getBatchingColor( const in float i ) {
		int size = textureSize( batchingColorTexture, 0 ).x;
		int j = int( i );
		int x = j % size;
		int y = j / size;
		return texelFetch( batchingColorTexture, ivec2( x, y ), 0 );
	}
#endif`,mu=`#ifdef USE_BATCHING
	mat4 batchingMatrix = getBatchingMatrix( getIndirectIndex( gl_DrawID ) );
#endif`,gu=`vec3 transformed = vec3( position );
#ifdef USE_ALPHAHASH
	vPosition = vec3( position );
#endif`,xu=`vec3 objectNormal = vec3( normal );
#ifdef USE_TANGENT
	vec3 objectTangent = vec3( tangent.xyz );
#endif`,_u=`float G_BlinnPhong_Implicit( ) {
	return 0.25;
}
float D_BlinnPhong( const in float shininess, const in float dotNH ) {
	return RECIPROCAL_PI * ( shininess * 0.5 + 1.0 ) * pow( dotNH, shininess );
}
vec3 BRDF_BlinnPhong( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in vec3 specularColor, const in float shininess ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( specularColor, 1.0, dotVH );
	float G = G_BlinnPhong_Implicit( );
	float D = D_BlinnPhong( shininess, dotNH );
	return F * ( G * D );
} // validated`,vu=`#ifdef USE_IRIDESCENCE
	const mat3 XYZ_TO_REC709 = mat3(
		 3.2404542, -0.9692660,  0.0556434,
		-1.5371385,  1.8760108, -0.2040259,
		-0.4985314,  0.0415560,  1.0572252
	);
	vec3 Fresnel0ToIor( vec3 fresnel0 ) {
		vec3 sqrtF0 = sqrt( fresnel0 );
		return ( vec3( 1.0 ) + sqrtF0 ) / ( vec3( 1.0 ) - sqrtF0 );
	}
	vec3 IorToFresnel0( vec3 transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - vec3( incidentIor ) ) / ( transmittedIor + vec3( incidentIor ) ) );
	}
	float IorToFresnel0( float transmittedIor, float incidentIor ) {
		return pow2( ( transmittedIor - incidentIor ) / ( transmittedIor + incidentIor ));
	}
	vec3 evalSensitivity( float OPD, vec3 shift ) {
		float phase = 2.0 * PI * OPD * 1.0e-9;
		vec3 val = vec3( 5.4856e-13, 4.4201e-13, 5.2481e-13 );
		vec3 pos = vec3( 1.6810e+06, 1.7953e+06, 2.2084e+06 );
		vec3 var = vec3( 4.3278e+09, 9.3046e+09, 6.6121e+09 );
		vec3 xyz = val * sqrt( 2.0 * PI * var ) * cos( pos * phase + shift ) * exp( - pow2( phase ) * var );
		xyz.x += 9.7470e-14 * sqrt( 2.0 * PI * 4.5282e+09 ) * cos( 2.2399e+06 * phase + shift[ 0 ] ) * exp( - 4.5282e+09 * pow2( phase ) );
		xyz /= 1.0685e-7;
		vec3 rgb = XYZ_TO_REC709 * xyz;
		return rgb;
	}
	vec3 evalIridescence( float outsideIOR, float eta2, float cosTheta1, float thinFilmThickness, vec3 baseF0 ) {
		vec3 I;
		float iridescenceIOR = mix( outsideIOR, eta2, smoothstep( 0.0, 0.03, thinFilmThickness ) );
		float sinTheta2Sq = pow2( outsideIOR / iridescenceIOR ) * ( 1.0 - pow2( cosTheta1 ) );
		float cosTheta2Sq = 1.0 - sinTheta2Sq;
		if ( cosTheta2Sq < 0.0 ) {
			return vec3( 1.0 );
		}
		float cosTheta2 = sqrt( cosTheta2Sq );
		float R0 = IorToFresnel0( iridescenceIOR, outsideIOR );
		float R12 = F_Schlick( R0, 1.0, cosTheta1 );
		float T121 = 1.0 - R12;
		float phi12 = 0.0;
		if ( iridescenceIOR < outsideIOR ) phi12 = PI;
		float phi21 = PI - phi12;
		vec3 baseIOR = Fresnel0ToIor( clamp( baseF0, 0.0, 0.9999 ) );		vec3 R1 = IorToFresnel0( baseIOR, iridescenceIOR );
		vec3 R23 = F_Schlick( R1, 1.0, cosTheta2 );
		vec3 phi23 = vec3( 0.0 );
		if ( baseIOR[ 0 ] < iridescenceIOR ) phi23[ 0 ] = PI;
		if ( baseIOR[ 1 ] < iridescenceIOR ) phi23[ 1 ] = PI;
		if ( baseIOR[ 2 ] < iridescenceIOR ) phi23[ 2 ] = PI;
		float OPD = 2.0 * iridescenceIOR * thinFilmThickness * cosTheta2;
		vec3 phi = vec3( phi21 ) + phi23;
		vec3 R123 = clamp( R12 * R23, 1e-5, 0.9999 );
		vec3 r123 = sqrt( R123 );
		vec3 Rs = pow2( T121 ) * R23 / ( vec3( 1.0 ) - R123 );
		vec3 C0 = R12 + Rs;
		I = C0;
		vec3 Cm = Rs - T121;
		for ( int m = 1; m <= 2; ++ m ) {
			Cm *= r123;
			vec3 Sm = 2.0 * evalSensitivity( float( m ) * OPD, float( m ) * phi );
			I += Cm * Sm;
		}
		return max( I, vec3( 0.0 ) );
	}
#endif`,Mu=`#ifdef USE_BUMPMAP
	uniform sampler2D bumpMap;
	uniform float bumpScale;
	vec2 dHdxy_fwd() {
		vec2 dSTdx = dFdx( vBumpMapUv );
		vec2 dSTdy = dFdy( vBumpMapUv );
		float Hll = bumpScale * texture2D( bumpMap, vBumpMapUv ).x;
		float dBx = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdx ).x - Hll;
		float dBy = bumpScale * texture2D( bumpMap, vBumpMapUv + dSTdy ).x - Hll;
		return vec2( dBx, dBy );
	}
	vec3 perturbNormalArb( vec3 surf_pos, vec3 surf_norm, vec2 dHdxy, float faceDirection ) {
		vec3 vSigmaX = normalize( dFdx( surf_pos.xyz ) );
		vec3 vSigmaY = normalize( dFdy( surf_pos.xyz ) );
		vec3 vN = surf_norm;
		vec3 R1 = cross( vSigmaY, vN );
		vec3 R2 = cross( vN, vSigmaX );
		float fDet = dot( vSigmaX, R1 ) * faceDirection;
		vec3 vGrad = sign( fDet ) * ( dHdxy.x * R1 + dHdxy.y * R2 );
		return normalize( abs( fDet ) * surf_norm - vGrad );
	}
#endif`,Su=`#if NUM_CLIPPING_PLANES > 0
	vec4 plane;
	#ifdef ALPHA_TO_COVERAGE
		float distanceToPlane, distanceGradient;
		float clipOpacity = 1.0;
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
			distanceGradient = fwidth( distanceToPlane ) / 2.0;
			clipOpacity *= smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			if ( clipOpacity == 0.0 ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			float unionClipOpacity = 1.0;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				distanceToPlane = - dot( vClipPosition, plane.xyz ) + plane.w;
				distanceGradient = fwidth( distanceToPlane ) / 2.0;
				unionClipOpacity *= 1.0 - smoothstep( - distanceGradient, distanceGradient, distanceToPlane );
			}
			#pragma unroll_loop_end
			clipOpacity *= 1.0 - unionClipOpacity;
		#endif
		diffuseColor.a *= clipOpacity;
		if ( diffuseColor.a == 0.0 ) discard;
	#else
		#pragma unroll_loop_start
		for ( int i = 0; i < UNION_CLIPPING_PLANES; i ++ ) {
			plane = clippingPlanes[ i ];
			if ( dot( vClipPosition, plane.xyz ) > plane.w ) discard;
		}
		#pragma unroll_loop_end
		#if UNION_CLIPPING_PLANES < NUM_CLIPPING_PLANES
			bool clipped = true;
			#pragma unroll_loop_start
			for ( int i = UNION_CLIPPING_PLANES; i < NUM_CLIPPING_PLANES; i ++ ) {
				plane = clippingPlanes[ i ];
				clipped = ( dot( vClipPosition, plane.xyz ) > plane.w ) && clipped;
			}
			#pragma unroll_loop_end
			if ( clipped ) discard;
		#endif
	#endif
#endif`,yu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
	uniform vec4 clippingPlanes[ NUM_CLIPPING_PLANES ];
#endif`,bu=`#if NUM_CLIPPING_PLANES > 0
	varying vec3 vClipPosition;
#endif`,Eu=`#if NUM_CLIPPING_PLANES > 0
	vClipPosition = - mvPosition.xyz;
#endif`,Tu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	diffuseColor *= vColor;
#endif`,wu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA )
	varying vec4 vColor;
#endif`,Au=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	varying vec4 vColor;
#endif`,Cu=`#if defined( USE_COLOR ) || defined( USE_COLOR_ALPHA ) || defined( USE_INSTANCING_COLOR ) || defined( USE_BATCHING_COLOR )
	vColor = vec4( 1.0 );
#endif
#ifdef USE_COLOR_ALPHA
	vColor *= color;
#elif defined( USE_COLOR )
	vColor.rgb *= color;
#endif
#ifdef USE_INSTANCING_COLOR
	vColor.rgb *= instanceColor.rgb;
#endif
#ifdef USE_BATCHING_COLOR
	vColor *= getBatchingColor( getIndirectIndex( gl_DrawID ) );
#endif`,Ru=`#define PI 3.141592653589793
#define PI2 6.283185307179586
#define PI_HALF 1.5707963267948966
#define RECIPROCAL_PI 0.3183098861837907
#define RECIPROCAL_PI2 0.15915494309189535
#define EPSILON 1e-6
#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
#define whiteComplement( a ) ( 1.0 - saturate( a ) )
float pow2( const in float x ) { return x*x; }
vec3 pow2( const in vec3 x ) { return x*x; }
float pow3( const in float x ) { return x*x*x; }
float pow4( const in float x ) { float x2 = x*x; return x2*x2; }
float max3( const in vec3 v ) { return max( max( v.x, v.y ), v.z ); }
float average( const in vec3 v ) { return dot( v, vec3( 0.3333333 ) ); }
highp float rand( const in vec2 uv ) {
	const highp float a = 12.9898, b = 78.233, c = 43758.5453;
	highp float dt = dot( uv.xy, vec2( a,b ) ), sn = mod( dt, PI );
	return fract( sin( sn ) * c );
}
#ifdef HIGH_PRECISION
	float precisionSafeLength( vec3 v ) { return length( v ); }
#else
	float precisionSafeLength( vec3 v ) {
		float maxComponent = max3( abs( v ) );
		return length( v / maxComponent ) * maxComponent;
	}
#endif
struct IncidentLight {
	vec3 color;
	vec3 direction;
	bool visible;
};
struct ReflectedLight {
	vec3 directDiffuse;
	vec3 directSpecular;
	vec3 indirectDiffuse;
	vec3 indirectSpecular;
};
#ifdef USE_ALPHAHASH
	varying vec3 vPosition;
#endif
vec3 transformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );
}
vec3 inverseTransformDirection( in vec3 dir, in mat4 matrix ) {
	return normalize( ( vec4( dir, 0.0 ) * matrix ).xyz );
}
bool isPerspectiveMatrix( mat4 m ) {
	return m[ 2 ][ 3 ] == - 1.0;
}
vec2 equirectUv( in vec3 dir ) {
	float u = atan( dir.z, dir.x ) * RECIPROCAL_PI2 + 0.5;
	float v = asin( clamp( dir.y, - 1.0, 1.0 ) ) * RECIPROCAL_PI + 0.5;
	return vec2( u, v );
}
vec3 BRDF_Lambert( const in vec3 diffuseColor ) {
	return RECIPROCAL_PI * diffuseColor;
}
vec3 F_Schlick( const in vec3 f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
}
float F_Schlick( const in float f0, const in float f90, const in float dotVH ) {
	float fresnel = exp2( ( - 5.55473 * dotVH - 6.98316 ) * dotVH );
	return f0 * ( 1.0 - fresnel ) + ( f90 * fresnel );
} // validated`,Pu=`#ifdef ENVMAP_TYPE_CUBE_UV
	#define cubeUV_minMipLevel 4.0
	#define cubeUV_minTileSize 16.0
	float getFace( vec3 direction ) {
		vec3 absDirection = abs( direction );
		float face = - 1.0;
		if ( absDirection.x > absDirection.z ) {
			if ( absDirection.x > absDirection.y )
				face = direction.x > 0.0 ? 0.0 : 3.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		} else {
			if ( absDirection.z > absDirection.y )
				face = direction.z > 0.0 ? 2.0 : 5.0;
			else
				face = direction.y > 0.0 ? 1.0 : 4.0;
		}
		return face;
	}
	vec2 getUV( vec3 direction, float face ) {
		vec2 uv;
		if ( face == 0.0 ) {
			uv = vec2( direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 1.0 ) {
			uv = vec2( - direction.x, - direction.z ) / abs( direction.y );
		} else if ( face == 2.0 ) {
			uv = vec2( - direction.x, direction.y ) / abs( direction.z );
		} else if ( face == 3.0 ) {
			uv = vec2( - direction.z, direction.y ) / abs( direction.x );
		} else if ( face == 4.0 ) {
			uv = vec2( - direction.x, direction.z ) / abs( direction.y );
		} else {
			uv = vec2( direction.x, direction.y ) / abs( direction.z );
		}
		return 0.5 * ( uv + 1.0 );
	}
	vec3 bilinearCubeUV( sampler2D envMap, vec3 direction, float mipInt ) {
		float face = getFace( direction );
		float filterInt = max( cubeUV_minMipLevel - mipInt, 0.0 );
		mipInt = max( mipInt, cubeUV_minMipLevel );
		float faceSize = exp2( mipInt );
		highp vec2 uv = getUV( direction, face ) * ( faceSize - 2.0 ) + 1.0;
		if ( face > 2.0 ) {
			uv.y += faceSize;
			face -= 3.0;
		}
		uv.x += face * faceSize;
		uv.x += filterInt * 3.0 * cubeUV_minTileSize;
		uv.y += 4.0 * ( exp2( CUBEUV_MAX_MIP ) - faceSize );
		uv.x *= CUBEUV_TEXEL_WIDTH;
		uv.y *= CUBEUV_TEXEL_HEIGHT;
		#ifdef texture2DGradEXT
			return texture2DGradEXT( envMap, uv, vec2( 0.0 ), vec2( 0.0 ) ).rgb;
		#else
			return texture2D( envMap, uv ).rgb;
		#endif
	}
	#define cubeUV_r0 1.0
	#define cubeUV_m0 - 2.0
	#define cubeUV_r1 0.8
	#define cubeUV_m1 - 1.0
	#define cubeUV_r4 0.4
	#define cubeUV_m4 2.0
	#define cubeUV_r5 0.305
	#define cubeUV_m5 3.0
	#define cubeUV_r6 0.21
	#define cubeUV_m6 4.0
	float roughnessToMip( float roughness ) {
		float mip = 0.0;
		if ( roughness >= cubeUV_r1 ) {
			mip = ( cubeUV_r0 - roughness ) * ( cubeUV_m1 - cubeUV_m0 ) / ( cubeUV_r0 - cubeUV_r1 ) + cubeUV_m0;
		} else if ( roughness >= cubeUV_r4 ) {
			mip = ( cubeUV_r1 - roughness ) * ( cubeUV_m4 - cubeUV_m1 ) / ( cubeUV_r1 - cubeUV_r4 ) + cubeUV_m1;
		} else if ( roughness >= cubeUV_r5 ) {
			mip = ( cubeUV_r4 - roughness ) * ( cubeUV_m5 - cubeUV_m4 ) / ( cubeUV_r4 - cubeUV_r5 ) + cubeUV_m4;
		} else if ( roughness >= cubeUV_r6 ) {
			mip = ( cubeUV_r5 - roughness ) * ( cubeUV_m6 - cubeUV_m5 ) / ( cubeUV_r5 - cubeUV_r6 ) + cubeUV_m5;
		} else {
			mip = - 2.0 * log2( 1.16 * roughness );		}
		return mip;
	}
	vec4 textureCubeUV( sampler2D envMap, vec3 sampleDir, float roughness ) {
		float mip = clamp( roughnessToMip( roughness ), cubeUV_m0, CUBEUV_MAX_MIP );
		float mipF = fract( mip );
		float mipInt = floor( mip );
		vec3 color0 = bilinearCubeUV( envMap, sampleDir, mipInt );
		if ( mipF == 0.0 ) {
			return vec4( color0, 1.0 );
		} else {
			vec3 color1 = bilinearCubeUV( envMap, sampleDir, mipInt + 1.0 );
			return vec4( mix( color0, color1, mipF ), 1.0 );
		}
	}
#endif`,Lu=`vec3 transformedNormal = objectNormal;
#ifdef USE_TANGENT
	vec3 transformedTangent = objectTangent;
#endif
#ifdef USE_BATCHING
	mat3 bm = mat3( batchingMatrix );
	transformedNormal /= vec3( dot( bm[ 0 ], bm[ 0 ] ), dot( bm[ 1 ], bm[ 1 ] ), dot( bm[ 2 ], bm[ 2 ] ) );
	transformedNormal = bm * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = bm * transformedTangent;
	#endif
#endif
#ifdef USE_INSTANCING
	mat3 im = mat3( instanceMatrix );
	transformedNormal /= vec3( dot( im[ 0 ], im[ 0 ] ), dot( im[ 1 ], im[ 1 ] ), dot( im[ 2 ], im[ 2 ] ) );
	transformedNormal = im * transformedNormal;
	#ifdef USE_TANGENT
		transformedTangent = im * transformedTangent;
	#endif
#endif
transformedNormal = normalMatrix * transformedNormal;
#ifdef FLIP_SIDED
	transformedNormal = - transformedNormal;
#endif
#ifdef USE_TANGENT
	transformedTangent = ( modelViewMatrix * vec4( transformedTangent, 0.0 ) ).xyz;
	#ifdef FLIP_SIDED
		transformedTangent = - transformedTangent;
	#endif
#endif`,Iu=`#ifdef USE_DISPLACEMENTMAP
	uniform sampler2D displacementMap;
	uniform float displacementScale;
	uniform float displacementBias;
#endif`,Du=`#ifdef USE_DISPLACEMENTMAP
	transformed += normalize( objectNormal ) * ( texture2D( displacementMap, vDisplacementMapUv ).x * displacementScale + displacementBias );
#endif`,Nu=`#ifdef USE_EMISSIVEMAP
	vec4 emissiveColor = texture2D( emissiveMap, vEmissiveMapUv );
	#ifdef DECODE_VIDEO_TEXTURE_EMISSIVE
		emissiveColor = sRGBTransferEOTF( emissiveColor );
	#endif
	totalEmissiveRadiance *= emissiveColor.rgb;
#endif`,Uu=`#ifdef USE_EMISSIVEMAP
	uniform sampler2D emissiveMap;
#endif`,Fu="gl_FragColor = linearToOutputTexel( gl_FragColor );",Ou=`vec4 LinearTransferOETF( in vec4 value ) {
	return value;
}
vec4 sRGBTransferEOTF( in vec4 value ) {
	return vec4( mix( pow( value.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), value.rgb * 0.0773993808, vec3( lessThanEqual( value.rgb, vec3( 0.04045 ) ) ) ), value.a );
}
vec4 sRGBTransferOETF( in vec4 value ) {
	return vec4( mix( pow( value.rgb, vec3( 0.41666 ) ) * 1.055 - vec3( 0.055 ), value.rgb * 12.92, vec3( lessThanEqual( value.rgb, vec3( 0.0031308 ) ) ) ), value.a );
}`,Bu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vec3 cameraToFrag;
		if ( isOrthographic ) {
			cameraToFrag = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToFrag = normalize( vWorldPosition - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vec3 reflectVec = reflect( cameraToFrag, worldNormal );
		#else
			vec3 reflectVec = refract( cameraToFrag, worldNormal, refractionRatio );
		#endif
	#else
		vec3 reflectVec = vReflect;
	#endif
	#ifdef ENVMAP_TYPE_CUBE
		vec4 envColor = textureCube( envMap, envMapRotation * reflectVec );
		#ifdef ENVMAP_BLENDING_MULTIPLY
			outgoingLight = mix( outgoingLight, outgoingLight * envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_MIX )
			outgoingLight = mix( outgoingLight, envColor.xyz, specularStrength * reflectivity );
		#elif defined( ENVMAP_BLENDING_ADD )
			outgoingLight += envColor.xyz * specularStrength * reflectivity;
		#endif
	#endif
#endif`,ku=`#ifdef USE_ENVMAP
	uniform float envMapIntensity;
	uniform mat3 envMapRotation;
	#ifdef ENVMAP_TYPE_CUBE
		uniform samplerCube envMap;
	#else
		uniform sampler2D envMap;
	#endif
#endif`,zu=`#ifdef USE_ENVMAP
	uniform float reflectivity;
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		varying vec3 vWorldPosition;
		uniform float refractionRatio;
	#else
		varying vec3 vReflect;
	#endif
#endif`,Gu=`#ifdef USE_ENVMAP
	#if defined( USE_BUMPMAP ) || defined( USE_NORMALMAP ) || defined( PHONG ) || defined( LAMBERT )
		#define ENV_WORLDPOS
	#endif
	#ifdef ENV_WORLDPOS
		
		varying vec3 vWorldPosition;
	#else
		varying vec3 vReflect;
		uniform float refractionRatio;
	#endif
#endif`,Vu=`#ifdef USE_ENVMAP
	#ifdef ENV_WORLDPOS
		vWorldPosition = worldPosition.xyz;
	#else
		vec3 cameraToVertex;
		if ( isOrthographic ) {
			cameraToVertex = normalize( vec3( - viewMatrix[ 0 ][ 2 ], - viewMatrix[ 1 ][ 2 ], - viewMatrix[ 2 ][ 2 ] ) );
		} else {
			cameraToVertex = normalize( worldPosition.xyz - cameraPosition );
		}
		vec3 worldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
		#ifdef ENVMAP_MODE_REFLECTION
			vReflect = reflect( cameraToVertex, worldNormal );
		#else
			vReflect = refract( cameraToVertex, worldNormal, refractionRatio );
		#endif
	#endif
#endif`,Hu=`#ifdef USE_FOG
	vFogDepth = - mvPosition.z;
#endif`,Wu=`#ifdef USE_FOG
	varying float vFogDepth;
#endif`,Xu=`#ifdef USE_FOG
	#ifdef FOG_EXP2
		float fogFactor = 1.0 - exp( - fogDensity * fogDensity * vFogDepth * vFogDepth );
	#else
		float fogFactor = smoothstep( fogNear, fogFar, vFogDepth );
	#endif
	gl_FragColor.rgb = mix( gl_FragColor.rgb, fogColor, fogFactor );
#endif`,qu=`#ifdef USE_FOG
	uniform vec3 fogColor;
	varying float vFogDepth;
	#ifdef FOG_EXP2
		uniform float fogDensity;
	#else
		uniform float fogNear;
		uniform float fogFar;
	#endif
#endif`,Yu=`#ifdef USE_GRADIENTMAP
	uniform sampler2D gradientMap;
#endif
vec3 getGradientIrradiance( vec3 normal, vec3 lightDirection ) {
	float dotNL = dot( normal, lightDirection );
	vec2 coord = vec2( dotNL * 0.5 + 0.5, 0.0 );
	#ifdef USE_GRADIENTMAP
		return vec3( texture2D( gradientMap, coord ).r );
	#else
		vec2 fw = fwidth( coord ) * 0.5;
		return mix( vec3( 0.7 ), vec3( 1.0 ), smoothstep( 0.7 - fw.x, 0.7 + fw.x, coord.x ) );
	#endif
}`,$u=`#ifdef USE_LIGHTMAP
	uniform sampler2D lightMap;
	uniform float lightMapIntensity;
#endif`,Ku=`LambertMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularStrength = specularStrength;`,Ju=`varying vec3 vViewPosition;
struct LambertMaterial {
	vec3 diffuseColor;
	float specularStrength;
};
void RE_Direct_Lambert( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Lambert( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in LambertMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Lambert
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Lambert`,Zu=`uniform bool receiveShadow;
uniform vec3 ambientLightColor;
#if defined( USE_LIGHT_PROBES )
	uniform vec3 lightProbe[ 9 ];
#endif
vec3 shGetIrradianceAt( in vec3 normal, in vec3 shCoefficients[ 9 ] ) {
	float x = normal.x, y = normal.y, z = normal.z;
	vec3 result = shCoefficients[ 0 ] * 0.886227;
	result += shCoefficients[ 1 ] * 2.0 * 0.511664 * y;
	result += shCoefficients[ 2 ] * 2.0 * 0.511664 * z;
	result += shCoefficients[ 3 ] * 2.0 * 0.511664 * x;
	result += shCoefficients[ 4 ] * 2.0 * 0.429043 * x * y;
	result += shCoefficients[ 5 ] * 2.0 * 0.429043 * y * z;
	result += shCoefficients[ 6 ] * ( 0.743125 * z * z - 0.247708 );
	result += shCoefficients[ 7 ] * 2.0 * 0.429043 * x * z;
	result += shCoefficients[ 8 ] * 0.429043 * ( x * x - y * y );
	return result;
}
vec3 getLightProbeIrradiance( const in vec3 lightProbe[ 9 ], const in vec3 normal ) {
	vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
	vec3 irradiance = shGetIrradianceAt( worldNormal, lightProbe );
	return irradiance;
}
vec3 getAmbientLightIrradiance( const in vec3 ambientLightColor ) {
	vec3 irradiance = ambientLightColor;
	return irradiance;
}
float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {
	float distanceFalloff = 1.0 / max( pow( lightDistance, decayExponent ), 0.01 );
	if ( cutoffDistance > 0.0 ) {
		distanceFalloff *= pow2( saturate( 1.0 - pow4( lightDistance / cutoffDistance ) ) );
	}
	return distanceFalloff;
}
float getSpotAttenuation( const in float coneCosine, const in float penumbraCosine, const in float angleCosine ) {
	return smoothstep( coneCosine, penumbraCosine, angleCosine );
}
#if NUM_DIR_LIGHTS > 0
	struct DirectionalLight {
		vec3 direction;
		vec3 color;
	};
	uniform DirectionalLight directionalLights[ NUM_DIR_LIGHTS ];
	void getDirectionalLightInfo( const in DirectionalLight directionalLight, out IncidentLight light ) {
		light.color = directionalLight.color;
		light.direction = directionalLight.direction;
		light.visible = true;
	}
#endif
#if NUM_POINT_LIGHTS > 0
	struct PointLight {
		vec3 position;
		vec3 color;
		float distance;
		float decay;
	};
	uniform PointLight pointLights[ NUM_POINT_LIGHTS ];
	void getPointLightInfo( const in PointLight pointLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = pointLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float lightDistance = length( lVector );
		light.color = pointLight.color;
		light.color *= getDistanceAttenuation( lightDistance, pointLight.distance, pointLight.decay );
		light.visible = ( light.color != vec3( 0.0 ) );
	}
#endif
#if NUM_SPOT_LIGHTS > 0
	struct SpotLight {
		vec3 position;
		vec3 direction;
		vec3 color;
		float distance;
		float decay;
		float coneCos;
		float penumbraCos;
	};
	uniform SpotLight spotLights[ NUM_SPOT_LIGHTS ];
	void getSpotLightInfo( const in SpotLight spotLight, const in vec3 geometryPosition, out IncidentLight light ) {
		vec3 lVector = spotLight.position - geometryPosition;
		light.direction = normalize( lVector );
		float angleCos = dot( light.direction, spotLight.direction );
		float spotAttenuation = getSpotAttenuation( spotLight.coneCos, spotLight.penumbraCos, angleCos );
		if ( spotAttenuation > 0.0 ) {
			float lightDistance = length( lVector );
			light.color = spotLight.color * spotAttenuation;
			light.color *= getDistanceAttenuation( lightDistance, spotLight.distance, spotLight.decay );
			light.visible = ( light.color != vec3( 0.0 ) );
		} else {
			light.color = vec3( 0.0 );
			light.visible = false;
		}
	}
#endif
#if NUM_RECT_AREA_LIGHTS > 0
	struct RectAreaLight {
		vec3 color;
		vec3 position;
		vec3 halfWidth;
		vec3 halfHeight;
	};
	uniform sampler2D ltc_1;	uniform sampler2D ltc_2;
	uniform RectAreaLight rectAreaLights[ NUM_RECT_AREA_LIGHTS ];
#endif
#if NUM_HEMI_LIGHTS > 0
	struct HemisphereLight {
		vec3 direction;
		vec3 skyColor;
		vec3 groundColor;
	};
	uniform HemisphereLight hemisphereLights[ NUM_HEMI_LIGHTS ];
	vec3 getHemisphereLightIrradiance( const in HemisphereLight hemiLight, const in vec3 normal ) {
		float dotNL = dot( normal, hemiLight.direction );
		float hemiDiffuseWeight = 0.5 * dotNL + 0.5;
		vec3 irradiance = mix( hemiLight.groundColor, hemiLight.skyColor, hemiDiffuseWeight );
		return irradiance;
	}
#endif
#include <lightprobes_pars_fragment>`,ju=`#ifdef USE_ENVMAP
	vec3 getIBLIrradiance( const in vec3 normal ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 worldNormal = inverseTransformDirection( normal, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * worldNormal, 1.0 );
			return PI * envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	vec3 getIBLRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness ) {
		#ifdef ENVMAP_TYPE_CUBE_UV
			vec3 reflectVec = reflect( - viewDir, normal );
			reflectVec = normalize( mix( reflectVec, normal, pow4( roughness ) ) );
			reflectVec = inverseTransformDirection( reflectVec, viewMatrix );
			vec4 envMapColor = textureCubeUV( envMap, envMapRotation * reflectVec, roughness );
			return envMapColor.rgb * envMapIntensity;
		#else
			return vec3( 0.0 );
		#endif
	}
	#ifdef USE_ANISOTROPY
		vec3 getIBLAnisotropyRadiance( const in vec3 viewDir, const in vec3 normal, const in float roughness, const in vec3 bitangent, const in float anisotropy ) {
			#ifdef ENVMAP_TYPE_CUBE_UV
				vec3 bentNormal = cross( bitangent, viewDir );
				bentNormal = normalize( cross( bentNormal, bitangent ) );
				bentNormal = normalize( mix( bentNormal, normal, pow2( pow2( 1.0 - anisotropy * ( 1.0 - roughness ) ) ) ) );
				return getIBLRadiance( viewDir, bentNormal, roughness );
			#else
				return vec3( 0.0 );
			#endif
		}
	#endif
#endif`,Qu=`ToonMaterial material;
material.diffuseColor = diffuseColor.rgb;`,tf=`varying vec3 vViewPosition;
struct ToonMaterial {
	vec3 diffuseColor;
};
void RE_Direct_Toon( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 irradiance = getGradientIrradiance( geometryNormal, directLight.direction ) * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
void RE_IndirectDiffuse_Toon( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in ToonMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_Toon
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Toon`,ef=`BlinnPhongMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.specularColor = specular;
material.specularShininess = shininess;
material.specularStrength = specularStrength;`,nf=`varying vec3 vViewPosition;
struct BlinnPhongMaterial {
	vec3 diffuseColor;
	vec3 specularColor;
	float specularShininess;
	float specularStrength;
};
void RE_Direct_BlinnPhong( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
	reflectedLight.directSpecular += irradiance * BRDF_BlinnPhong( directLight.direction, geometryViewDir, geometryNormal, material.specularColor, material.specularShininess ) * material.specularStrength;
}
void RE_IndirectDiffuse_BlinnPhong( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in BlinnPhongMaterial material, inout ReflectedLight reflectedLight ) {
	reflectedLight.indirectDiffuse += irradiance * BRDF_Lambert( material.diffuseColor );
}
#define RE_Direct				RE_Direct_BlinnPhong
#define RE_IndirectDiffuse		RE_IndirectDiffuse_BlinnPhong`,sf=`PhysicalMaterial material;
material.diffuseColor = diffuseColor.rgb;
material.diffuseContribution = diffuseColor.rgb * ( 1.0 - metalnessFactor );
material.metalness = metalnessFactor;
vec3 dxy = max( abs( dFdx( nonPerturbedNormal ) ), abs( dFdy( nonPerturbedNormal ) ) );
float geometryRoughness = max( max( dxy.x, dxy.y ), dxy.z );
material.roughness = max( roughnessFactor, 0.0525 );material.roughness += geometryRoughness;
material.roughness = min( material.roughness, 1.0 );
#ifdef IOR
	material.ior = ior;
	#ifdef USE_SPECULAR
		float specularIntensityFactor = specularIntensity;
		vec3 specularColorFactor = specularColor;
		#ifdef USE_SPECULAR_COLORMAP
			specularColorFactor *= texture2D( specularColorMap, vSpecularColorMapUv ).rgb;
		#endif
		#ifdef USE_SPECULAR_INTENSITYMAP
			specularIntensityFactor *= texture2D( specularIntensityMap, vSpecularIntensityMapUv ).a;
		#endif
		material.specularF90 = mix( specularIntensityFactor, 1.0, metalnessFactor );
	#else
		float specularIntensityFactor = 1.0;
		vec3 specularColorFactor = vec3( 1.0 );
		material.specularF90 = 1.0;
	#endif
	material.specularColor = min( pow2( ( material.ior - 1.0 ) / ( material.ior + 1.0 ) ) * specularColorFactor, vec3( 1.0 ) ) * specularIntensityFactor;
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
#else
	material.specularColor = vec3( 0.04 );
	material.specularColorBlended = mix( material.specularColor, diffuseColor.rgb, metalnessFactor );
	material.specularF90 = 1.0;
#endif
#ifdef USE_CLEARCOAT
	material.clearcoat = clearcoat;
	material.clearcoatRoughness = clearcoatRoughness;
	material.clearcoatF0 = vec3( 0.04 );
	material.clearcoatF90 = 1.0;
	#ifdef USE_CLEARCOATMAP
		material.clearcoat *= texture2D( clearcoatMap, vClearcoatMapUv ).x;
	#endif
	#ifdef USE_CLEARCOAT_ROUGHNESSMAP
		material.clearcoatRoughness *= texture2D( clearcoatRoughnessMap, vClearcoatRoughnessMapUv ).y;
	#endif
	material.clearcoat = saturate( material.clearcoat );	material.clearcoatRoughness = max( material.clearcoatRoughness, 0.0525 );
	material.clearcoatRoughness += geometryRoughness;
	material.clearcoatRoughness = min( material.clearcoatRoughness, 1.0 );
#endif
#ifdef USE_DISPERSION
	material.dispersion = dispersion;
#endif
#ifdef USE_IRIDESCENCE
	material.iridescence = iridescence;
	material.iridescenceIOR = iridescenceIOR;
	#ifdef USE_IRIDESCENCEMAP
		material.iridescence *= texture2D( iridescenceMap, vIridescenceMapUv ).r;
	#endif
	#ifdef USE_IRIDESCENCE_THICKNESSMAP
		material.iridescenceThickness = (iridescenceThicknessMaximum - iridescenceThicknessMinimum) * texture2D( iridescenceThicknessMap, vIridescenceThicknessMapUv ).g + iridescenceThicknessMinimum;
	#else
		material.iridescenceThickness = iridescenceThicknessMaximum;
	#endif
#endif
#ifdef USE_SHEEN
	material.sheenColor = sheenColor;
	#ifdef USE_SHEEN_COLORMAP
		material.sheenColor *= texture2D( sheenColorMap, vSheenColorMapUv ).rgb;
	#endif
	material.sheenRoughness = clamp( sheenRoughness, 0.0001, 1.0 );
	#ifdef USE_SHEEN_ROUGHNESSMAP
		material.sheenRoughness *= texture2D( sheenRoughnessMap, vSheenRoughnessMapUv ).a;
	#endif
#endif
#ifdef USE_ANISOTROPY
	#ifdef USE_ANISOTROPYMAP
		mat2 anisotropyMat = mat2( anisotropyVector.x, anisotropyVector.y, - anisotropyVector.y, anisotropyVector.x );
		vec3 anisotropyPolar = texture2D( anisotropyMap, vAnisotropyMapUv ).rgb;
		vec2 anisotropyV = anisotropyMat * normalize( 2.0 * anisotropyPolar.rg - vec2( 1.0 ) ) * anisotropyPolar.b;
	#else
		vec2 anisotropyV = anisotropyVector;
	#endif
	material.anisotropy = length( anisotropyV );
	if( material.anisotropy == 0.0 ) {
		anisotropyV = vec2( 1.0, 0.0 );
	} else {
		anisotropyV /= material.anisotropy;
		material.anisotropy = saturate( material.anisotropy );
	}
	material.alphaT = mix( pow2( material.roughness ), 1.0, pow2( material.anisotropy ) );
	material.anisotropyT = tbn[ 0 ] * anisotropyV.x + tbn[ 1 ] * anisotropyV.y;
	material.anisotropyB = tbn[ 1 ] * anisotropyV.x - tbn[ 0 ] * anisotropyV.y;
#endif`,rf=`uniform sampler2D dfgLUT;
struct PhysicalMaterial {
	vec3 diffuseColor;
	vec3 diffuseContribution;
	vec3 specularColor;
	vec3 specularColorBlended;
	float roughness;
	float metalness;
	float specularF90;
	float dispersion;
	#ifdef USE_CLEARCOAT
		float clearcoat;
		float clearcoatRoughness;
		vec3 clearcoatF0;
		float clearcoatF90;
	#endif
	#ifdef USE_IRIDESCENCE
		float iridescence;
		float iridescenceIOR;
		float iridescenceThickness;
		vec3 iridescenceFresnel;
		vec3 iridescenceF0;
		vec3 iridescenceFresnelDielectric;
		vec3 iridescenceFresnelMetallic;
	#endif
	#ifdef USE_SHEEN
		vec3 sheenColor;
		float sheenRoughness;
	#endif
	#ifdef IOR
		float ior;
	#endif
	#ifdef USE_TRANSMISSION
		float transmission;
		float transmissionAlpha;
		float thickness;
		float attenuationDistance;
		vec3 attenuationColor;
	#endif
	#ifdef USE_ANISOTROPY
		float anisotropy;
		float alphaT;
		vec3 anisotropyT;
		vec3 anisotropyB;
	#endif
};
vec3 clearcoatSpecularDirect = vec3( 0.0 );
vec3 clearcoatSpecularIndirect = vec3( 0.0 );
vec3 sheenSpecularDirect = vec3( 0.0 );
vec3 sheenSpecularIndirect = vec3(0.0 );
vec3 Schlick_to_F0( const in vec3 f, const in float f90, const in float dotVH ) {
    float x = clamp( 1.0 - dotVH, 0.0, 1.0 );
    float x2 = x * x;
    float x5 = clamp( x * x2 * x2, 0.0, 0.9999 );
    return ( f - vec3( f90 ) * x5 ) / ( 1.0 - x5 );
}
float V_GGX_SmithCorrelated( const in float alpha, const in float dotNL, const in float dotNV ) {
	float a2 = pow2( alpha );
	float gv = dotNL * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNV ) );
	float gl = dotNV * sqrt( a2 + ( 1.0 - a2 ) * pow2( dotNL ) );
	return 0.5 / max( gv + gl, EPSILON );
}
float D_GGX( const in float alpha, const in float dotNH ) {
	float a2 = pow2( alpha );
	float denom = pow2( dotNH ) * ( a2 - 1.0 ) + 1.0;
	return RECIPROCAL_PI * a2 / pow2( denom );
}
#ifdef USE_ANISOTROPY
	float V_GGX_SmithCorrelated_Anisotropic( const in float alphaT, const in float alphaB, const in float dotTV, const in float dotBV, const in float dotTL, const in float dotBL, const in float dotNV, const in float dotNL ) {
		float gv = dotNL * length( vec3( alphaT * dotTV, alphaB * dotBV, dotNV ) );
		float gl = dotNV * length( vec3( alphaT * dotTL, alphaB * dotBL, dotNL ) );
		return 0.5 / max( gv + gl, EPSILON );
	}
	float D_GGX_Anisotropic( const in float alphaT, const in float alphaB, const in float dotNH, const in float dotTH, const in float dotBH ) {
		float a2 = alphaT * alphaB;
		highp vec3 v = vec3( alphaB * dotTH, alphaT * dotBH, a2 * dotNH );
		highp float v2 = dot( v, v );
		float w2 = a2 / v2;
		return RECIPROCAL_PI * a2 * pow2 ( w2 );
	}
#endif
#ifdef USE_CLEARCOAT
	vec3 BRDF_GGX_Clearcoat( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material) {
		vec3 f0 = material.clearcoatF0;
		float f90 = material.clearcoatF90;
		float roughness = material.clearcoatRoughness;
		float alpha = pow2( roughness );
		vec3 halfDir = normalize( lightDir + viewDir );
		float dotNL = saturate( dot( normal, lightDir ) );
		float dotNV = saturate( dot( normal, viewDir ) );
		float dotNH = saturate( dot( normal, halfDir ) );
		float dotVH = saturate( dot( viewDir, halfDir ) );
		vec3 F = F_Schlick( f0, f90, dotVH );
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
		return F * ( V * D );
	}
#endif
vec3 BRDF_GGX( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 f0 = material.specularColorBlended;
	float f90 = material.specularF90;
	float roughness = material.roughness;
	float alpha = pow2( roughness );
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float dotVH = saturate( dot( viewDir, halfDir ) );
	vec3 F = F_Schlick( f0, f90, dotVH );
	#ifdef USE_IRIDESCENCE
		F = mix( F, material.iridescenceFresnel, material.iridescence );
	#endif
	#ifdef USE_ANISOTROPY
		float dotTL = dot( material.anisotropyT, lightDir );
		float dotTV = dot( material.anisotropyT, viewDir );
		float dotTH = dot( material.anisotropyT, halfDir );
		float dotBL = dot( material.anisotropyB, lightDir );
		float dotBV = dot( material.anisotropyB, viewDir );
		float dotBH = dot( material.anisotropyB, halfDir );
		float V = V_GGX_SmithCorrelated_Anisotropic( material.alphaT, alpha, dotTV, dotBV, dotTL, dotBL, dotNV, dotNL );
		float D = D_GGX_Anisotropic( material.alphaT, alpha, dotNH, dotTH, dotBH );
	#else
		float V = V_GGX_SmithCorrelated( alpha, dotNL, dotNV );
		float D = D_GGX( alpha, dotNH );
	#endif
	return F * ( V * D );
}
vec2 LTC_Uv( const in vec3 N, const in vec3 V, const in float roughness ) {
	const float LUT_SIZE = 64.0;
	const float LUT_SCALE = ( LUT_SIZE - 1.0 ) / LUT_SIZE;
	const float LUT_BIAS = 0.5 / LUT_SIZE;
	float dotNV = saturate( dot( N, V ) );
	vec2 uv = vec2( roughness, sqrt( 1.0 - dotNV ) );
	uv = uv * LUT_SCALE + LUT_BIAS;
	return uv;
}
float LTC_ClippedSphereFormFactor( const in vec3 f ) {
	float l = length( f );
	return max( ( l * l + f.z ) / ( l + 1.0 ), 0.0 );
}
vec3 LTC_EdgeVectorFormFactor( const in vec3 v1, const in vec3 v2 ) {
	float x = dot( v1, v2 );
	float y = abs( x );
	float a = 0.8543985 + ( 0.4965155 + 0.0145206 * y ) * y;
	float b = 3.4175940 + ( 4.1616724 + y ) * y;
	float v = a / b;
	float theta_sintheta = ( x > 0.0 ) ? v : 0.5 * inversesqrt( max( 1.0 - x * x, 1e-7 ) ) - v;
	return cross( v1, v2 ) * theta_sintheta;
}
vec3 LTC_Evaluate( const in vec3 N, const in vec3 V, const in vec3 P, const in mat3 mInv, const in vec3 rectCoords[ 4 ] ) {
	vec3 v1 = rectCoords[ 1 ] - rectCoords[ 0 ];
	vec3 v2 = rectCoords[ 3 ] - rectCoords[ 0 ];
	vec3 lightNormal = cross( v1, v2 );
	if( dot( lightNormal, P - rectCoords[ 0 ] ) < 0.0 ) return vec3( 0.0 );
	vec3 T1, T2;
	T1 = normalize( V - N * dot( V, N ) );
	T2 = - cross( N, T1 );
	mat3 mat = mInv * transpose( mat3( T1, T2, N ) );
	vec3 coords[ 4 ];
	coords[ 0 ] = mat * ( rectCoords[ 0 ] - P );
	coords[ 1 ] = mat * ( rectCoords[ 1 ] - P );
	coords[ 2 ] = mat * ( rectCoords[ 2 ] - P );
	coords[ 3 ] = mat * ( rectCoords[ 3 ] - P );
	coords[ 0 ] = normalize( coords[ 0 ] );
	coords[ 1 ] = normalize( coords[ 1 ] );
	coords[ 2 ] = normalize( coords[ 2 ] );
	coords[ 3 ] = normalize( coords[ 3 ] );
	vec3 vectorFormFactor = vec3( 0.0 );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 0 ], coords[ 1 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 1 ], coords[ 2 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 2 ], coords[ 3 ] );
	vectorFormFactor += LTC_EdgeVectorFormFactor( coords[ 3 ], coords[ 0 ] );
	float result = LTC_ClippedSphereFormFactor( vectorFormFactor );
	return vec3( result );
}
#if defined( USE_SHEEN )
float D_Charlie( float roughness, float dotNH ) {
	float alpha = pow2( roughness );
	float invAlpha = 1.0 / alpha;
	float cos2h = dotNH * dotNH;
	float sin2h = max( 1.0 - cos2h, 0.0078125 );
	return ( 2.0 + invAlpha ) * pow( sin2h, invAlpha * 0.5 ) / ( 2.0 * PI );
}
float V_Neubelt( float dotNV, float dotNL ) {
	return saturate( 1.0 / ( 4.0 * ( dotNL + dotNV - dotNL * dotNV ) ) );
}
vec3 BRDF_Sheen( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, vec3 sheenColor, const in float sheenRoughness ) {
	vec3 halfDir = normalize( lightDir + viewDir );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	float dotNH = saturate( dot( normal, halfDir ) );
	float D = D_Charlie( sheenRoughness, dotNH );
	float V = V_Neubelt( dotNV, dotNL );
	return sheenColor * ( D * V );
}
#endif
float IBLSheenBRDF( const in vec3 normal, const in vec3 viewDir, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	float r2 = roughness * roughness;
	float rInv = 1.0 / ( roughness + 0.1 );
	float a = -1.9362 + 1.0678 * roughness + 0.4573 * r2 - 0.8469 * rInv;
	float b = -0.6014 + 0.5538 * roughness - 0.4670 * r2 - 0.1255 * rInv;
	float DG = exp( a * dotNV + b );
	return saturate( DG );
}
vec3 EnvironmentBRDF( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness ) {
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	return specularColor * fab.x + specularF90 * fab.y;
}
#ifdef USE_IRIDESCENCE
void computeMultiscatteringIridescence( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float iridescence, const in vec3 iridescenceF0, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#else
void computeMultiscattering( const in vec3 normal, const in vec3 viewDir, const in vec3 specularColor, const in float specularF90, const in float roughness, inout vec3 singleScatter, inout vec3 multiScatter ) {
#endif
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 fab = texture2D( dfgLUT, vec2( roughness, dotNV ) ).rg;
	#ifdef USE_IRIDESCENCE
		vec3 Fr = mix( specularColor, iridescenceF0, iridescence );
	#else
		vec3 Fr = specularColor;
	#endif
	vec3 FssEss = Fr * fab.x + specularF90 * fab.y;
	float Ess = fab.x + fab.y;
	float Ems = 1.0 - Ess;
	vec3 Favg = Fr + ( 1.0 - Fr ) * 0.047619;	vec3 Fms = FssEss * Favg / ( 1.0 - Ems * Favg );
	singleScatter += FssEss;
	multiScatter += Fms * Ems;
}
vec3 BRDF_GGX_Multiscatter( const in vec3 lightDir, const in vec3 viewDir, const in vec3 normal, const in PhysicalMaterial material ) {
	vec3 singleScatter = BRDF_GGX( lightDir, viewDir, normal, material );
	float dotNL = saturate( dot( normal, lightDir ) );
	float dotNV = saturate( dot( normal, viewDir ) );
	vec2 dfgV = texture2D( dfgLUT, vec2( material.roughness, dotNV ) ).rg;
	vec2 dfgL = texture2D( dfgLUT, vec2( material.roughness, dotNL ) ).rg;
	vec3 FssEss_V = material.specularColorBlended * dfgV.x + material.specularF90 * dfgV.y;
	vec3 FssEss_L = material.specularColorBlended * dfgL.x + material.specularF90 * dfgL.y;
	float Ess_V = dfgV.x + dfgV.y;
	float Ess_L = dfgL.x + dfgL.y;
	float Ems_V = 1.0 - Ess_V;
	float Ems_L = 1.0 - Ess_L;
	vec3 Favg = material.specularColorBlended + ( 1.0 - material.specularColorBlended ) * 0.047619;
	vec3 Fms = FssEss_V * FssEss_L * Favg / ( 1.0 - Ems_V * Ems_L * Favg + EPSILON );
	float compensationFactor = Ems_V * Ems_L;
	vec3 multiScatter = Fms * compensationFactor;
	return singleScatter + multiScatter;
}
#if NUM_RECT_AREA_LIGHTS > 0
	void RE_Direct_RectArea_Physical( const in RectAreaLight rectAreaLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
		vec3 normal = geometryNormal;
		vec3 viewDir = geometryViewDir;
		vec3 position = geometryPosition;
		vec3 lightPos = rectAreaLight.position;
		vec3 halfWidth = rectAreaLight.halfWidth;
		vec3 halfHeight = rectAreaLight.halfHeight;
		vec3 lightColor = rectAreaLight.color;
		float roughness = material.roughness;
		vec3 rectCoords[ 4 ];
		rectCoords[ 0 ] = lightPos + halfWidth - halfHeight;		rectCoords[ 1 ] = lightPos - halfWidth - halfHeight;
		rectCoords[ 2 ] = lightPos - halfWidth + halfHeight;
		rectCoords[ 3 ] = lightPos + halfWidth + halfHeight;
		vec2 uv = LTC_Uv( normal, viewDir, roughness );
		vec4 t1 = texture2D( ltc_1, uv );
		vec4 t2 = texture2D( ltc_2, uv );
		mat3 mInv = mat3(
			vec3( t1.x, 0, t1.y ),
			vec3(    0, 1,    0 ),
			vec3( t1.z, 0, t1.w )
		);
		vec3 fresnel = ( material.specularColorBlended * t2.x + ( material.specularF90 - material.specularColorBlended ) * t2.y );
		reflectedLight.directSpecular += lightColor * fresnel * LTC_Evaluate( normal, viewDir, position, mInv, rectCoords );
		reflectedLight.directDiffuse += lightColor * material.diffuseContribution * LTC_Evaluate( normal, viewDir, position, mat3( 1.0 ), rectCoords );
		#ifdef USE_CLEARCOAT
			vec3 Ncc = geometryClearcoatNormal;
			vec2 uvClearcoat = LTC_Uv( Ncc, viewDir, material.clearcoatRoughness );
			vec4 t1Clearcoat = texture2D( ltc_1, uvClearcoat );
			vec4 t2Clearcoat = texture2D( ltc_2, uvClearcoat );
			mat3 mInvClearcoat = mat3(
				vec3( t1Clearcoat.x, 0, t1Clearcoat.y ),
				vec3(             0, 1,             0 ),
				vec3( t1Clearcoat.z, 0, t1Clearcoat.w )
			);
			vec3 fresnelClearcoat = material.clearcoatF0 * t2Clearcoat.x + ( material.clearcoatF90 - material.clearcoatF0 ) * t2Clearcoat.y;
			clearcoatSpecularDirect += lightColor * fresnelClearcoat * LTC_Evaluate( Ncc, viewDir, position, mInvClearcoat, rectCoords );
		#endif
	}
#endif
void RE_Direct_Physical( const in IncidentLight directLight, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	float dotNL = saturate( dot( geometryNormal, directLight.direction ) );
	vec3 irradiance = dotNL * directLight.color;
	#ifdef USE_CLEARCOAT
		float dotNLcc = saturate( dot( geometryClearcoatNormal, directLight.direction ) );
		vec3 ccIrradiance = dotNLcc * directLight.color;
		clearcoatSpecularDirect += ccIrradiance * BRDF_GGX_Clearcoat( directLight.direction, geometryViewDir, geometryClearcoatNormal, material );
	#endif
	#ifdef USE_SHEEN
 
 		sheenSpecularDirect += irradiance * BRDF_Sheen( directLight.direction, geometryViewDir, geometryNormal, material.sheenColor, material.sheenRoughness );
 
 		float sheenAlbedoV = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
 		float sheenAlbedoL = IBLSheenBRDF( geometryNormal, directLight.direction, material.sheenRoughness );
 
 		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * max( sheenAlbedoV, sheenAlbedoL );
 
 		irradiance *= sheenEnergyComp;
 
 	#endif
	reflectedLight.directSpecular += irradiance * BRDF_GGX_Multiscatter( directLight.direction, geometryViewDir, geometryNormal, material );
	reflectedLight.directDiffuse += irradiance * BRDF_Lambert( material.diffuseContribution );
}
void RE_IndirectDiffuse_Physical( const in vec3 irradiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight ) {
	vec3 diffuse = irradiance * BRDF_Lambert( material.diffuseContribution );
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		diffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectDiffuse += diffuse;
}
void RE_IndirectSpecular_Physical( const in vec3 radiance, const in vec3 irradiance, const in vec3 clearcoatRadiance, const in vec3 geometryPosition, const in vec3 geometryNormal, const in vec3 geometryViewDir, const in vec3 geometryClearcoatNormal, const in PhysicalMaterial material, inout ReflectedLight reflectedLight) {
	#ifdef USE_CLEARCOAT
		clearcoatSpecularIndirect += clearcoatRadiance * EnvironmentBRDF( geometryClearcoatNormal, geometryViewDir, material.clearcoatF0, material.clearcoatF90, material.clearcoatRoughness );
	#endif
	#ifdef USE_SHEEN
		sheenSpecularIndirect += irradiance * material.sheenColor * IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness ) * RECIPROCAL_PI;
 	#endif
	vec3 singleScatteringDielectric = vec3( 0.0 );
	vec3 multiScatteringDielectric = vec3( 0.0 );
	vec3 singleScatteringMetallic = vec3( 0.0 );
	vec3 multiScatteringMetallic = vec3( 0.0 );
	#ifdef USE_IRIDESCENCE
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.iridescence, material.iridescenceFresnelDielectric, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscatteringIridescence( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.iridescence, material.iridescenceFresnelMetallic, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#else
		computeMultiscattering( geometryNormal, geometryViewDir, material.specularColor, material.specularF90, material.roughness, singleScatteringDielectric, multiScatteringDielectric );
		computeMultiscattering( geometryNormal, geometryViewDir, material.diffuseColor, material.specularF90, material.roughness, singleScatteringMetallic, multiScatteringMetallic );
	#endif
	vec3 singleScattering = mix( singleScatteringDielectric, singleScatteringMetallic, material.metalness );
	vec3 multiScattering = mix( multiScatteringDielectric, multiScatteringMetallic, material.metalness );
	vec3 totalScatteringDielectric = singleScatteringDielectric + multiScatteringDielectric;
	vec3 diffuse = material.diffuseContribution * ( 1.0 - totalScatteringDielectric );
	vec3 cosineWeightedIrradiance = irradiance * RECIPROCAL_PI;
	vec3 indirectSpecular = radiance * singleScattering;
	indirectSpecular += multiScattering * cosineWeightedIrradiance;
	vec3 indirectDiffuse = diffuse * cosineWeightedIrradiance;
	#ifdef USE_SHEEN
		float sheenAlbedo = IBLSheenBRDF( geometryNormal, geometryViewDir, material.sheenRoughness );
		float sheenEnergyComp = 1.0 - max3( material.sheenColor ) * sheenAlbedo;
		indirectSpecular *= sheenEnergyComp;
		indirectDiffuse *= sheenEnergyComp;
	#endif
	reflectedLight.indirectSpecular += indirectSpecular;
	reflectedLight.indirectDiffuse += indirectDiffuse;
}
#define RE_Direct				RE_Direct_Physical
#define RE_Direct_RectArea		RE_Direct_RectArea_Physical
#define RE_IndirectDiffuse		RE_IndirectDiffuse_Physical
#define RE_IndirectSpecular		RE_IndirectSpecular_Physical
float computeSpecularOcclusion( const in float dotNV, const in float ambientOcclusion, const in float roughness ) {
	return saturate( pow( dotNV + ambientOcclusion, exp2( - 16.0 * roughness - 1.0 ) ) - 1.0 + ambientOcclusion );
}`,of=`
vec3 geometryPosition = - vViewPosition;
vec3 geometryNormal = normal;
vec3 geometryViewDir = ( isOrthographic ) ? vec3( 0, 0, 1 ) : normalize( vViewPosition );
vec3 geometryClearcoatNormal = vec3( 0.0 );
#ifdef USE_CLEARCOAT
	geometryClearcoatNormal = clearcoatNormal;
#endif
#ifdef USE_IRIDESCENCE
	float dotNVi = saturate( dot( normal, geometryViewDir ) );
	if ( material.iridescenceThickness == 0.0 ) {
		material.iridescence = 0.0;
	} else {
		material.iridescence = saturate( material.iridescence );
	}
	if ( material.iridescence > 0.0 ) {
		material.iridescenceFresnelDielectric = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.specularColor );
		material.iridescenceFresnelMetallic = evalIridescence( 1.0, material.iridescenceIOR, dotNVi, material.iridescenceThickness, material.diffuseColor );
		material.iridescenceFresnel = mix( material.iridescenceFresnelDielectric, material.iridescenceFresnelMetallic, material.metalness );
		material.iridescenceF0 = Schlick_to_F0( material.iridescenceFresnel, 1.0, dotNVi );
	}
#endif
IncidentLight directLight;
#if ( NUM_POINT_LIGHTS > 0 ) && defined( RE_Direct )
	PointLight pointLight;
	#if defined( USE_SHADOWMAP ) && NUM_POINT_LIGHT_SHADOWS > 0
	PointLightShadow pointLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHTS; i ++ ) {
		pointLight = pointLights[ i ];
		getPointLightInfo( pointLight, geometryPosition, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_POINT_LIGHT_SHADOWS ) && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
		pointLightShadow = pointLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getPointShadow( pointShadowMap[ i ], pointLightShadow.shadowMapSize, pointLightShadow.shadowIntensity, pointLightShadow.shadowBias, pointLightShadow.shadowRadius, vPointShadowCoord[ i ], pointLightShadow.shadowCameraNear, pointLightShadow.shadowCameraFar ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_SPOT_LIGHTS > 0 ) && defined( RE_Direct )
	SpotLight spotLight;
	vec4 spotColor;
	vec3 spotLightCoord;
	bool inSpotLightMap;
	#if defined( USE_SHADOWMAP ) && NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHTS; i ++ ) {
		spotLight = spotLights[ i ];
		getSpotLightInfo( spotLight, geometryPosition, directLight );
		#if ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#define SPOT_LIGHT_MAP_INDEX UNROLLED_LOOP_INDEX
		#elif ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		#define SPOT_LIGHT_MAP_INDEX NUM_SPOT_LIGHT_MAPS
		#else
		#define SPOT_LIGHT_MAP_INDEX ( UNROLLED_LOOP_INDEX - NUM_SPOT_LIGHT_SHADOWS + NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS )
		#endif
		#if ( SPOT_LIGHT_MAP_INDEX < NUM_SPOT_LIGHT_MAPS )
			spotLightCoord = vSpotLightCoord[ i ].xyz / vSpotLightCoord[ i ].w;
			inSpotLightMap = all( lessThan( abs( spotLightCoord * 2. - 1. ), vec3( 1.0 ) ) );
			spotColor = texture2D( spotLightMap[ SPOT_LIGHT_MAP_INDEX ], spotLightCoord.xy );
			directLight.color = inSpotLightMap ? directLight.color * spotColor.rgb : directLight.color;
		#endif
		#undef SPOT_LIGHT_MAP_INDEX
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
		spotLightShadow = spotLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( spotShadowMap[ i ], spotLightShadow.shadowMapSize, spotLightShadow.shadowIntensity, spotLightShadow.shadowBias, spotLightShadow.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_DIR_LIGHTS > 0 ) && defined( RE_Direct )
	DirectionalLight directionalLight;
	#if defined( USE_SHADOWMAP ) && NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLightShadow;
	#endif
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHTS; i ++ ) {
		directionalLight = directionalLights[ i ];
		getDirectionalLightInfo( directionalLight, directLight );
		#if defined( USE_SHADOWMAP ) && ( UNROLLED_LOOP_INDEX < NUM_DIR_LIGHT_SHADOWS )
		directionalLightShadow = directionalLightShadows[ i ];
		directLight.color *= ( directLight.visible && receiveShadow ) ? getShadow( directionalShadowMap[ i ], directionalLightShadow.shadowMapSize, directionalLightShadow.shadowIntensity, directionalLightShadow.shadowBias, directionalLightShadow.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
		#endif
		RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if ( NUM_RECT_AREA_LIGHTS > 0 ) && defined( RE_Direct_RectArea )
	RectAreaLight rectAreaLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_RECT_AREA_LIGHTS; i ++ ) {
		rectAreaLight = rectAreaLights[ i ];
		RE_Direct_RectArea( rectAreaLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
	}
	#pragma unroll_loop_end
#endif
#if defined( RE_IndirectDiffuse )
	vec3 iblIrradiance = vec3( 0.0 );
	vec3 irradiance = getAmbientLightIrradiance( ambientLightColor );
	#if defined( USE_LIGHT_PROBES )
		irradiance += getLightProbeIrradiance( lightProbe, geometryNormal );
	#endif
	#if ( NUM_HEMI_LIGHTS > 0 )
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_HEMI_LIGHTS; i ++ ) {
			irradiance += getHemisphereLightIrradiance( hemisphereLights[ i ], geometryNormal );
		}
		#pragma unroll_loop_end
	#endif
	#ifdef USE_LIGHT_PROBES_GRID
		vec3 probeWorldPos = ( ( vec4( geometryPosition, 1.0 ) - viewMatrix[ 3 ] ) * viewMatrix ).xyz;
		vec3 probeWorldNormal = inverseTransformDirection( geometryNormal, viewMatrix );
		irradiance += getLightProbeGridIrradiance( probeWorldPos, probeWorldNormal );
	#endif
#endif
#if defined( RE_IndirectSpecular )
	vec3 radiance = vec3( 0.0 );
	vec3 clearcoatRadiance = vec3( 0.0 );
#endif`,af=`#if defined( RE_IndirectDiffuse )
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		vec3 lightMapIrradiance = lightMapTexel.rgb * lightMapIntensity;
		irradiance += lightMapIrradiance;
	#endif
	#if defined( USE_ENVMAP ) && defined( ENVMAP_TYPE_CUBE_UV )
		#if defined( STANDARD ) || defined( LAMBERT ) || defined( PHONG )
			iblIrradiance += getIBLIrradiance( geometryNormal );
		#endif
	#endif
#endif
#if defined( USE_ENVMAP ) && defined( RE_IndirectSpecular )
	#ifdef USE_ANISOTROPY
		radiance += getIBLAnisotropyRadiance( geometryViewDir, geometryNormal, material.roughness, material.anisotropyB, material.anisotropy );
	#else
		radiance += getIBLRadiance( geometryViewDir, geometryNormal, material.roughness );
	#endif
	#ifdef USE_CLEARCOAT
		clearcoatRadiance += getIBLRadiance( geometryViewDir, geometryClearcoatNormal, material.clearcoatRoughness );
	#endif
#endif`,lf=`#if defined( RE_IndirectDiffuse )
	#if defined( LAMBERT ) || defined( PHONG )
		irradiance += iblIrradiance;
	#endif
	RE_IndirectDiffuse( irradiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif
#if defined( RE_IndirectSpecular )
	RE_IndirectSpecular( radiance, iblIrradiance, clearcoatRadiance, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );
#endif`,cf=`#ifdef USE_LIGHT_PROBES_GRID
uniform highp sampler3D probesSH;
uniform vec3 probesMin;
uniform vec3 probesMax;
uniform vec3 probesResolution;
vec3 getLightProbeGridIrradiance( vec3 worldPos, vec3 worldNormal ) {
	vec3 res = probesResolution;
	vec3 gridRange = probesMax - probesMin;
	vec3 resMinusOne = res - 1.0;
	vec3 probeSpacing = gridRange / resMinusOne;
	vec3 samplePos = worldPos + worldNormal * probeSpacing * 0.5;
	vec3 uvw = clamp( ( samplePos - probesMin ) / gridRange, 0.0, 1.0 );
	uvw = uvw * resMinusOne / res + 0.5 / res;
	float nz          = res.z;
	float paddedSlices = nz + 2.0;
	float atlasDepth  = 7.0 * paddedSlices;
	float uvZBase     = uvw.z * nz + 1.0;
	vec4 s0 = texture( probesSH, vec3( uvw.xy, ( uvZBase                       ) / atlasDepth ) );
	vec4 s1 = texture( probesSH, vec3( uvw.xy, ( uvZBase +       paddedSlices   ) / atlasDepth ) );
	vec4 s2 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 2.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s3 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 3.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s4 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 4.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s5 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 5.0 * paddedSlices   ) / atlasDepth ) );
	vec4 s6 = texture( probesSH, vec3( uvw.xy, ( uvZBase + 6.0 * paddedSlices   ) / atlasDepth ) );
	vec3 c0 = s0.xyz;
	vec3 c1 = vec3( s0.w, s1.xy );
	vec3 c2 = vec3( s1.zw, s2.x );
	vec3 c3 = s2.yzw;
	vec3 c4 = s3.xyz;
	vec3 c5 = vec3( s3.w, s4.xy );
	vec3 c6 = vec3( s4.zw, s5.x );
	vec3 c7 = s5.yzw;
	vec3 c8 = s6.xyz;
	float x = worldNormal.x, y = worldNormal.y, z = worldNormal.z;
	vec3 result = c0 * 0.886227;
	result += c1 * 2.0 * 0.511664 * y;
	result += c2 * 2.0 * 0.511664 * z;
	result += c3 * 2.0 * 0.511664 * x;
	result += c4 * 2.0 * 0.429043 * x * y;
	result += c5 * 2.0 * 0.429043 * y * z;
	result += c6 * ( 0.743125 * z * z - 0.247708 );
	result += c7 * 2.0 * 0.429043 * x * z;
	result += c8 * 0.429043 * ( x * x - y * y );
	return max( result, vec3( 0.0 ) );
}
#endif`,hf=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	gl_FragDepth = vIsPerspective == 0.0 ? gl_FragCoord.z : log2( vFragDepth ) * logDepthBufFC * 0.5;
#endif`,df=`#if defined( USE_LOGARITHMIC_DEPTH_BUFFER )
	uniform float logDepthBufFC;
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,uf=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	varying float vFragDepth;
	varying float vIsPerspective;
#endif`,ff=`#ifdef USE_LOGARITHMIC_DEPTH_BUFFER
	vFragDepth = 1.0 + gl_Position.w;
	vIsPerspective = float( isPerspectiveMatrix( projectionMatrix ) );
#endif`,pf=`#ifdef USE_MAP
	vec4 sampledDiffuseColor = texture2D( map, vMapUv );
	#ifdef DECODE_VIDEO_TEXTURE
		sampledDiffuseColor = sRGBTransferEOTF( sampledDiffuseColor );
	#endif
	diffuseColor *= sampledDiffuseColor;
#endif`,mf=`#ifdef USE_MAP
	uniform sampler2D map;
#endif`,gf=`#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
	#if defined( USE_POINTS_UV )
		vec2 uv = vUv;
	#else
		vec2 uv = ( uvTransform * vec3( gl_PointCoord.x, 1.0 - gl_PointCoord.y, 1 ) ).xy;
	#endif
#endif
#ifdef USE_MAP
	diffuseColor *= texture2D( map, uv );
#endif
#ifdef USE_ALPHAMAP
	diffuseColor.a *= texture2D( alphaMap, uv ).g;
#endif`,xf=`#if defined( USE_POINTS_UV )
	varying vec2 vUv;
#else
	#if defined( USE_MAP ) || defined( USE_ALPHAMAP )
		uniform mat3 uvTransform;
	#endif
#endif
#ifdef USE_MAP
	uniform sampler2D map;
#endif
#ifdef USE_ALPHAMAP
	uniform sampler2D alphaMap;
#endif`,_f=`float metalnessFactor = metalness;
#ifdef USE_METALNESSMAP
	vec4 texelMetalness = texture2D( metalnessMap, vMetalnessMapUv );
	metalnessFactor *= texelMetalness.b;
#endif`,vf=`#ifdef USE_METALNESSMAP
	uniform sampler2D metalnessMap;
#endif`,Mf=`#ifdef USE_INSTANCING_MORPH
	float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	float morphTargetBaseInfluence = texelFetch( morphTexture, ivec2( 0, gl_InstanceID ), 0 ).r;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		morphTargetInfluences[i] =  texelFetch( morphTexture, ivec2( i + 1, gl_InstanceID ), 0 ).r;
	}
#endif`,Sf=`#if defined( USE_MORPHCOLORS )
	vColor *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		#if defined( USE_COLOR_ALPHA )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ) * morphTargetInfluences[ i ];
		#elif defined( USE_COLOR )
			if ( morphTargetInfluences[ i ] != 0.0 ) vColor += getMorph( gl_VertexID, i, 2 ).rgb * morphTargetInfluences[ i ];
		#endif
	}
#endif`,yf=`#ifdef USE_MORPHNORMALS
	objectNormal *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) objectNormal += getMorph( gl_VertexID, i, 1 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,bf=`#ifdef USE_MORPHTARGETS
	#ifndef USE_INSTANCING_MORPH
		uniform float morphTargetBaseInfluence;
		uniform float morphTargetInfluences[ MORPHTARGETS_COUNT ];
	#endif
	uniform sampler2DArray morphTargetsTexture;
	uniform ivec2 morphTargetsTextureSize;
	vec4 getMorph( const in int vertexIndex, const in int morphTargetIndex, const in int offset ) {
		int texelIndex = vertexIndex * MORPHTARGETS_TEXTURE_STRIDE + offset;
		int y = texelIndex / morphTargetsTextureSize.x;
		int x = texelIndex - y * morphTargetsTextureSize.x;
		ivec3 morphUV = ivec3( x, y, morphTargetIndex );
		return texelFetch( morphTargetsTexture, morphUV, 0 );
	}
#endif`,Ef=`#ifdef USE_MORPHTARGETS
	transformed *= morphTargetBaseInfluence;
	for ( int i = 0; i < MORPHTARGETS_COUNT; i ++ ) {
		if ( morphTargetInfluences[ i ] != 0.0 ) transformed += getMorph( gl_VertexID, i, 0 ).xyz * morphTargetInfluences[ i ];
	}
#endif`,Tf=`float faceDirection = gl_FrontFacing ? 1.0 : - 1.0;
#ifdef FLAT_SHADED
	vec3 fdx = dFdx( vViewPosition );
	vec3 fdy = dFdy( vViewPosition );
	vec3 normal = normalize( cross( fdx, fdy ) );
#else
	vec3 normal = normalize( vNormal );
	#ifdef DOUBLE_SIDED
		normal *= faceDirection;
	#endif
#endif
#if defined( USE_NORMALMAP_TANGENTSPACE ) || defined( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY )
	#ifdef USE_TANGENT
		mat3 tbn = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn = getTangentFrame( - vViewPosition, normal,
		#if defined( USE_NORMALMAP )
			vNormalMapUv
		#elif defined( USE_CLEARCOAT_NORMALMAP )
			vClearcoatNormalMapUv
		#else
			vUv
		#endif
		);
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn[0] *= faceDirection;
		tbn[1] *= faceDirection;
	#endif
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	#ifdef USE_TANGENT
		mat3 tbn2 = mat3( normalize( vTangent ), normalize( vBitangent ), normal );
	#else
		mat3 tbn2 = getTangentFrame( - vViewPosition, normal, vClearcoatNormalMapUv );
	#endif
	#if defined( DOUBLE_SIDED ) && ! defined( FLAT_SHADED )
		tbn2[0] *= faceDirection;
		tbn2[1] *= faceDirection;
	#endif
#endif
vec3 nonPerturbedNormal = normal;`,wf=`#ifdef USE_NORMALMAP_OBJECTSPACE
	normal = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#ifdef FLIP_SIDED
		normal = - normal;
	#endif
	#ifdef DOUBLE_SIDED
		normal = normal * faceDirection;
	#endif
	normal = normalize( normalMatrix * normal );
#elif defined( USE_NORMALMAP_TANGENTSPACE )
	vec3 mapN = texture2D( normalMap, vNormalMapUv ).xyz * 2.0 - 1.0;
	#if defined( USE_PACKED_NORMALMAP )
		mapN = vec3( mapN.xy, sqrt( saturate( 1.0 - dot( mapN.xy, mapN.xy ) ) ) );
	#endif
	mapN.xy *= normalScale;
	normal = normalize( tbn * mapN );
#elif defined( USE_BUMPMAP )
	normal = perturbNormalArb( - vViewPosition, normal, dHdxy_fwd(), faceDirection );
#endif`,Af=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Cf=`#ifndef FLAT_SHADED
	varying vec3 vNormal;
	#ifdef USE_TANGENT
		varying vec3 vTangent;
		varying vec3 vBitangent;
	#endif
#endif`,Rf=`#ifndef FLAT_SHADED
	vNormal = normalize( transformedNormal );
	#ifdef USE_TANGENT
		vTangent = normalize( transformedTangent );
		vBitangent = normalize( cross( vNormal, vTangent ) * tangent.w );
	#endif
#endif`,Pf=`#ifdef USE_NORMALMAP
	uniform sampler2D normalMap;
	uniform vec2 normalScale;
#endif
#ifdef USE_NORMALMAP_OBJECTSPACE
	uniform mat3 normalMatrix;
#endif
#if ! defined ( USE_TANGENT ) && ( defined ( USE_NORMALMAP_TANGENTSPACE ) || defined ( USE_CLEARCOAT_NORMALMAP ) || defined( USE_ANISOTROPY ) )
	mat3 getTangentFrame( vec3 eye_pos, vec3 surf_norm, vec2 uv ) {
		vec3 q0 = dFdx( eye_pos.xyz );
		vec3 q1 = dFdy( eye_pos.xyz );
		vec2 st0 = dFdx( uv.st );
		vec2 st1 = dFdy( uv.st );
		vec3 N = surf_norm;
		vec3 q1perp = cross( q1, N );
		vec3 q0perp = cross( N, q0 );
		vec3 T = q1perp * st0.x + q0perp * st1.x;
		vec3 B = q1perp * st0.y + q0perp * st1.y;
		float det = max( dot( T, T ), dot( B, B ) );
		float scale = ( det == 0.0 ) ? 0.0 : inversesqrt( det );
		return mat3( T * scale, B * scale, N );
	}
#endif`,Lf=`#ifdef USE_CLEARCOAT
	vec3 clearcoatNormal = nonPerturbedNormal;
#endif`,If=`#ifdef USE_CLEARCOAT_NORMALMAP
	vec3 clearcoatMapN = texture2D( clearcoatNormalMap, vClearcoatNormalMapUv ).xyz * 2.0 - 1.0;
	clearcoatMapN.xy *= clearcoatNormalScale;
	clearcoatNormal = normalize( tbn2 * clearcoatMapN );
#endif`,Df=`#ifdef USE_CLEARCOATMAP
	uniform sampler2D clearcoatMap;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform sampler2D clearcoatNormalMap;
	uniform vec2 clearcoatNormalScale;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform sampler2D clearcoatRoughnessMap;
#endif`,Nf=`#ifdef USE_IRIDESCENCEMAP
	uniform sampler2D iridescenceMap;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform sampler2D iridescenceThicknessMap;
#endif`,Uf=`#ifdef OPAQUE
diffuseColor.a = 1.0;
#endif
#ifdef USE_TRANSMISSION
diffuseColor.a *= material.transmissionAlpha;
#endif
gl_FragColor = vec4( outgoingLight, diffuseColor.a );`,Ff=`vec3 packNormalToRGB( const in vec3 normal ) {
	return normalize( normal ) * 0.5 + 0.5;
}
vec3 unpackRGBToNormal( const in vec3 rgb ) {
	return 2.0 * rgb.xyz - 1.0;
}
const float PackUpscale = 256. / 255.;const float UnpackDownscale = 255. / 256.;const float ShiftRight8 = 1. / 256.;
const float Inv255 = 1. / 255.;
const vec4 PackFactors = vec4( 1.0, 256.0, 256.0 * 256.0, 256.0 * 256.0 * 256.0 );
const vec2 UnpackFactors2 = vec2( UnpackDownscale, 1.0 / PackFactors.g );
const vec3 UnpackFactors3 = vec3( UnpackDownscale / PackFactors.rg, 1.0 / PackFactors.b );
const vec4 UnpackFactors4 = vec4( UnpackDownscale / PackFactors.rgb, 1.0 / PackFactors.a );
vec4 packDepthToRGBA( const in float v ) {
	if( v <= 0.0 )
		return vec4( 0., 0., 0., 0. );
	if( v >= 1.0 )
		return vec4( 1., 1., 1., 1. );
	float vuf;
	float af = modf( v * PackFactors.a, vuf );
	float bf = modf( vuf * ShiftRight8, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec4( vuf * Inv255, gf * PackUpscale, bf * PackUpscale, af );
}
vec3 packDepthToRGB( const in float v ) {
	if( v <= 0.0 )
		return vec3( 0., 0., 0. );
	if( v >= 1.0 )
		return vec3( 1., 1., 1. );
	float vuf;
	float bf = modf( v * PackFactors.b, vuf );
	float gf = modf( vuf * ShiftRight8, vuf );
	return vec3( vuf * Inv255, gf * PackUpscale, bf );
}
vec2 packDepthToRG( const in float v ) {
	if( v <= 0.0 )
		return vec2( 0., 0. );
	if( v >= 1.0 )
		return vec2( 1., 1. );
	float vuf;
	float gf = modf( v * 256., vuf );
	return vec2( vuf * Inv255, gf );
}
float unpackRGBAToDepth( const in vec4 v ) {
	return dot( v, UnpackFactors4 );
}
float unpackRGBToDepth( const in vec3 v ) {
	return dot( v, UnpackFactors3 );
}
float unpackRGToDepth( const in vec2 v ) {
	return v.r * UnpackFactors2.r + v.g * UnpackFactors2.g;
}
vec4 pack2HalfToRGBA( const in vec2 v ) {
	vec4 r = vec4( v.x, fract( v.x * 255.0 ), v.y, fract( v.y * 255.0 ) );
	return vec4( r.x - r.y / 255.0, r.y, r.z - r.w / 255.0, r.w );
}
vec2 unpackRGBATo2Half( const in vec4 v ) {
	return vec2( v.x + ( v.y / 255.0 ), v.z + ( v.w / 255.0 ) );
}
float viewZToOrthographicDepth( const in float viewZ, const in float near, const in float far ) {
	return ( viewZ + near ) / ( near - far );
}
float orthographicDepthToViewZ( const in float depth, const in float near, const in float far ) {
	#ifdef USE_REVERSED_DEPTH_BUFFER
	
		return depth * ( far - near ) - far;
	#else
		return depth * ( near - far ) - near;
	#endif
}
float viewZToPerspectiveDepth( const in float viewZ, const in float near, const in float far ) {
	return ( ( near + viewZ ) * far ) / ( ( far - near ) * viewZ );
}
float perspectiveDepthToViewZ( const in float depth, const in float near, const in float far ) {
	
	#ifdef USE_REVERSED_DEPTH_BUFFER
		return ( near * far ) / ( ( near - far ) * depth - near );
	#else
		return ( near * far ) / ( ( far - near ) * depth - far );
	#endif
}`,Of=`#ifdef PREMULTIPLIED_ALPHA
	gl_FragColor.rgb *= gl_FragColor.a;
#endif`,Bf=`vec4 mvPosition = vec4( transformed, 1.0 );
#ifdef USE_BATCHING
	mvPosition = batchingMatrix * mvPosition;
#endif
#ifdef USE_INSTANCING
	mvPosition = instanceMatrix * mvPosition;
#endif
mvPosition = modelViewMatrix * mvPosition;
gl_Position = projectionMatrix * mvPosition;`,kf=`#ifdef DITHERING
	gl_FragColor.rgb = dithering( gl_FragColor.rgb );
#endif`,zf=`#ifdef DITHERING
	vec3 dithering( vec3 color ) {
		float grid_position = rand( gl_FragCoord.xy );
		vec3 dither_shift_RGB = vec3( 0.25 / 255.0, -0.25 / 255.0, 0.25 / 255.0 );
		dither_shift_RGB = mix( 2.0 * dither_shift_RGB, -2.0 * dither_shift_RGB, grid_position );
		return color + dither_shift_RGB;
	}
#endif`,Gf=`float roughnessFactor = roughness;
#ifdef USE_ROUGHNESSMAP
	vec4 texelRoughness = texture2D( roughnessMap, vRoughnessMapUv );
	roughnessFactor *= texelRoughness.g;
#endif`,Vf=`#ifdef USE_ROUGHNESSMAP
	uniform sampler2D roughnessMap;
#endif`,Hf=`#if NUM_SPOT_LIGHT_COORDS > 0
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#if NUM_SPOT_LIGHT_MAPS > 0
	uniform sampler2D spotLightMap[ NUM_SPOT_LIGHT_MAPS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#else
			uniform sampler2D directionalShadowMap[ NUM_DIR_LIGHT_SHADOWS ];
		#endif
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform sampler2DShadow spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#else
			uniform sampler2D spotShadowMap[ NUM_SPOT_LIGHT_SHADOWS ];
		#endif
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#if defined( SHADOWMAP_TYPE_PCF )
			uniform samplerCubeShadow pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#elif defined( SHADOWMAP_TYPE_BASIC )
			uniform samplerCube pointShadowMap[ NUM_POINT_LIGHT_SHADOWS ];
		#endif
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float interleavedGradientNoise( vec2 position ) {
			return fract( 52.9829189 * fract( dot( position, vec2( 0.06711056, 0.00583715 ) ) ) );
		}
		vec2 vogelDiskSample( int sampleIndex, int samplesCount, float phi ) {
			const float goldenAngle = 2.399963229728653;
			float r = sqrt( ( float( sampleIndex ) + 0.5 ) / float( samplesCount ) );
			float theta = float( sampleIndex ) * goldenAngle + phi;
			return vec2( cos( theta ), sin( theta ) ) * r;
		}
	#endif
	#if defined( SHADOWMAP_TYPE_PCF )
		float getShadow( sampler2DShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			shadowCoord.z += shadowBias;
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 texelSize = vec2( 1.0 ) / shadowMapSize;
				float radius = shadowRadius * texelSize.x;
				float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
				shadow = (
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 0, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 1, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 2, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 3, 5, phi ) * radius, shadowCoord.z ) ) +
					texture( shadowMap, vec3( shadowCoord.xy + vogelDiskSample( 4, 5, phi ) * radius, shadowCoord.z ) )
				) * 0.2;
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#elif defined( SHADOWMAP_TYPE_VSM )
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				vec2 distribution = texture2D( shadowMap, shadowCoord.xy ).rg;
				float mean = distribution.x;
				float variance = distribution.y * distribution.y;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					float hard_shadow = step( mean, shadowCoord.z );
				#else
					float hard_shadow = step( shadowCoord.z, mean );
				#endif
				
				if ( hard_shadow == 1.0 ) {
					shadow = 1.0;
				} else {
					variance = max( variance, 0.0000001 );
					float d = shadowCoord.z - mean;
					float p_max = variance / ( variance + d * d );
					p_max = clamp( ( p_max - 0.3 ) / 0.65, 0.0, 1.0 );
					shadow = max( hard_shadow, p_max );
				}
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#else
		float getShadow( sampler2D shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord ) {
			float shadow = 1.0;
			shadowCoord.xyz /= shadowCoord.w;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				shadowCoord.z -= shadowBias;
			#else
				shadowCoord.z += shadowBias;
			#endif
			bool inFrustum = shadowCoord.x >= 0.0 && shadowCoord.x <= 1.0 && shadowCoord.y >= 0.0 && shadowCoord.y <= 1.0;
			bool frustumTest = inFrustum && shadowCoord.z <= 1.0;
			if ( frustumTest ) {
				float depth = texture2D( shadowMap, shadowCoord.xy ).r;
				#ifdef USE_REVERSED_DEPTH_BUFFER
					shadow = step( depth, shadowCoord.z );
				#else
					shadow = step( shadowCoord.z, depth );
				#endif
			}
			return mix( 1.0, shadow, shadowIntensity );
		}
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
	#if defined( SHADOWMAP_TYPE_PCF )
	float getPointShadow( samplerCubeShadow shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 bd3D = normalize( lightToPosition );
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			#ifdef USE_REVERSED_DEPTH_BUFFER
				float dp = ( shadowCameraNear * ( shadowCameraFar - viewSpaceZ ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp -= shadowBias;
			#else
				float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
				dp += shadowBias;
			#endif
			float texelSize = shadowRadius / shadowMapSize.x;
			vec3 absDir = abs( bd3D );
			vec3 tangent = absDir.x > absDir.z ? vec3( 0.0, 1.0, 0.0 ) : vec3( 1.0, 0.0, 0.0 );
			tangent = normalize( cross( bd3D, tangent ) );
			vec3 bitangent = cross( bd3D, tangent );
			float phi = interleavedGradientNoise( gl_FragCoord.xy ) * PI2;
			vec2 sample0 = vogelDiskSample( 0, 5, phi );
			vec2 sample1 = vogelDiskSample( 1, 5, phi );
			vec2 sample2 = vogelDiskSample( 2, 5, phi );
			vec2 sample3 = vogelDiskSample( 3, 5, phi );
			vec2 sample4 = vogelDiskSample( 4, 5, phi );
			shadow = (
				texture( shadowMap, vec4( bd3D + ( tangent * sample0.x + bitangent * sample0.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample1.x + bitangent * sample1.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample2.x + bitangent * sample2.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample3.x + bitangent * sample3.y ) * texelSize, dp ) ) +
				texture( shadowMap, vec4( bd3D + ( tangent * sample4.x + bitangent * sample4.y ) * texelSize, dp ) )
			) * 0.2;
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#elif defined( SHADOWMAP_TYPE_BASIC )
	float getPointShadow( samplerCube shadowMap, vec2 shadowMapSize, float shadowIntensity, float shadowBias, float shadowRadius, vec4 shadowCoord, float shadowCameraNear, float shadowCameraFar ) {
		float shadow = 1.0;
		vec3 lightToPosition = shadowCoord.xyz;
		vec3 absVec = abs( lightToPosition );
		float viewSpaceZ = max( max( absVec.x, absVec.y ), absVec.z );
		if ( viewSpaceZ - shadowCameraFar <= 0.0 && viewSpaceZ - shadowCameraNear >= 0.0 ) {
			float dp = ( shadowCameraFar * ( viewSpaceZ - shadowCameraNear ) ) / ( viewSpaceZ * ( shadowCameraFar - shadowCameraNear ) );
			dp += shadowBias;
			vec3 bd3D = normalize( lightToPosition );
			float depth = textureCube( shadowMap, bd3D ).r;
			#ifdef USE_REVERSED_DEPTH_BUFFER
				depth = 1.0 - depth;
			#endif
			shadow = step( dp, depth );
		}
		return mix( 1.0, shadow, shadowIntensity );
	}
	#endif
	#endif
#endif`,Wf=`#if NUM_SPOT_LIGHT_COORDS > 0
	uniform mat4 spotLightMatrix[ NUM_SPOT_LIGHT_COORDS ];
	varying vec4 vSpotLightCoord[ NUM_SPOT_LIGHT_COORDS ];
#endif
#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
		uniform mat4 directionalShadowMatrix[ NUM_DIR_LIGHT_SHADOWS ];
		varying vec4 vDirectionalShadowCoord[ NUM_DIR_LIGHT_SHADOWS ];
		struct DirectionalLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform DirectionalLightShadow directionalLightShadows[ NUM_DIR_LIGHT_SHADOWS ];
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
		struct SpotLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
		};
		uniform SpotLightShadow spotLightShadows[ NUM_SPOT_LIGHT_SHADOWS ];
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		uniform mat4 pointShadowMatrix[ NUM_POINT_LIGHT_SHADOWS ];
		varying vec4 vPointShadowCoord[ NUM_POINT_LIGHT_SHADOWS ];
		struct PointLightShadow {
			float shadowIntensity;
			float shadowBias;
			float shadowNormalBias;
			float shadowRadius;
			vec2 shadowMapSize;
			float shadowCameraNear;
			float shadowCameraFar;
		};
		uniform PointLightShadow pointLightShadows[ NUM_POINT_LIGHT_SHADOWS ];
	#endif
#endif`,Xf=`#if ( defined( USE_SHADOWMAP ) && ( NUM_DIR_LIGHT_SHADOWS > 0 || NUM_POINT_LIGHT_SHADOWS > 0 ) ) || ( NUM_SPOT_LIGHT_COORDS > 0 )
	#ifdef HAS_NORMAL
		vec3 shadowWorldNormal = inverseTransformDirection( transformedNormal, viewMatrix );
	#else
		vec3 shadowWorldNormal = vec3( 0.0 );
	#endif
	vec4 shadowWorldPosition;
#endif
#if defined( USE_SHADOWMAP )
	#if NUM_DIR_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * directionalLightShadows[ i ].shadowNormalBias, 0 );
			vDirectionalShadowCoord[ i ] = directionalShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0
		#pragma unroll_loop_start
		for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
			shadowWorldPosition = worldPosition + vec4( shadowWorldNormal * pointLightShadows[ i ].shadowNormalBias, 0 );
			vPointShadowCoord[ i ] = pointShadowMatrix[ i ] * shadowWorldPosition;
		}
		#pragma unroll_loop_end
	#endif
#endif
#if NUM_SPOT_LIGHT_COORDS > 0
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_COORDS; i ++ ) {
		shadowWorldPosition = worldPosition;
		#if ( defined( USE_SHADOWMAP ) && UNROLLED_LOOP_INDEX < NUM_SPOT_LIGHT_SHADOWS )
			shadowWorldPosition.xyz += shadowWorldNormal * spotLightShadows[ i ].shadowNormalBias;
		#endif
		vSpotLightCoord[ i ] = spotLightMatrix[ i ] * shadowWorldPosition;
	}
	#pragma unroll_loop_end
#endif`,qf=`float getShadowMask() {
	float shadow = 1.0;
	#ifdef USE_SHADOWMAP
	#if NUM_DIR_LIGHT_SHADOWS > 0
	DirectionalLightShadow directionalLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_DIR_LIGHT_SHADOWS; i ++ ) {
		directionalLight = directionalLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( directionalShadowMap[ i ], directionalLight.shadowMapSize, directionalLight.shadowIntensity, directionalLight.shadowBias, directionalLight.shadowRadius, vDirectionalShadowCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_SPOT_LIGHT_SHADOWS > 0
	SpotLightShadow spotLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_SPOT_LIGHT_SHADOWS; i ++ ) {
		spotLight = spotLightShadows[ i ];
		shadow *= receiveShadow ? getShadow( spotShadowMap[ i ], spotLight.shadowMapSize, spotLight.shadowIntensity, spotLight.shadowBias, spotLight.shadowRadius, vSpotLightCoord[ i ] ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#if NUM_POINT_LIGHT_SHADOWS > 0 && ( defined( SHADOWMAP_TYPE_PCF ) || defined( SHADOWMAP_TYPE_BASIC ) )
	PointLightShadow pointLight;
	#pragma unroll_loop_start
	for ( int i = 0; i < NUM_POINT_LIGHT_SHADOWS; i ++ ) {
		pointLight = pointLightShadows[ i ];
		shadow *= receiveShadow ? getPointShadow( pointShadowMap[ i ], pointLight.shadowMapSize, pointLight.shadowIntensity, pointLight.shadowBias, pointLight.shadowRadius, vPointShadowCoord[ i ], pointLight.shadowCameraNear, pointLight.shadowCameraFar ) : 1.0;
	}
	#pragma unroll_loop_end
	#endif
	#endif
	return shadow;
}`,Yf=`#ifdef USE_SKINNING
	mat4 boneMatX = getBoneMatrix( skinIndex.x );
	mat4 boneMatY = getBoneMatrix( skinIndex.y );
	mat4 boneMatZ = getBoneMatrix( skinIndex.z );
	mat4 boneMatW = getBoneMatrix( skinIndex.w );
#endif`,$f=`#ifdef USE_SKINNING
	uniform mat4 bindMatrix;
	uniform mat4 bindMatrixInverse;
	uniform highp sampler2D boneTexture;
	mat4 getBoneMatrix( const in float i ) {
		int size = textureSize( boneTexture, 0 ).x;
		int j = int( i ) * 4;
		int x = j % size;
		int y = j / size;
		vec4 v1 = texelFetch( boneTexture, ivec2( x, y ), 0 );
		vec4 v2 = texelFetch( boneTexture, ivec2( x + 1, y ), 0 );
		vec4 v3 = texelFetch( boneTexture, ivec2( x + 2, y ), 0 );
		vec4 v4 = texelFetch( boneTexture, ivec2( x + 3, y ), 0 );
		return mat4( v1, v2, v3, v4 );
	}
#endif`,Kf=`#ifdef USE_SKINNING
	vec4 skinVertex = bindMatrix * vec4( transformed, 1.0 );
	vec4 skinned = vec4( 0.0 );
	skinned += boneMatX * skinVertex * skinWeight.x;
	skinned += boneMatY * skinVertex * skinWeight.y;
	skinned += boneMatZ * skinVertex * skinWeight.z;
	skinned += boneMatW * skinVertex * skinWeight.w;
	transformed = ( bindMatrixInverse * skinned ).xyz;
#endif`,Jf=`#ifdef USE_SKINNING
	mat4 skinMatrix = mat4( 0.0 );
	skinMatrix += skinWeight.x * boneMatX;
	skinMatrix += skinWeight.y * boneMatY;
	skinMatrix += skinWeight.z * boneMatZ;
	skinMatrix += skinWeight.w * boneMatW;
	skinMatrix = bindMatrixInverse * skinMatrix * bindMatrix;
	objectNormal = vec4( skinMatrix * vec4( objectNormal, 0.0 ) ).xyz;
	#ifdef USE_TANGENT
		objectTangent = vec4( skinMatrix * vec4( objectTangent, 0.0 ) ).xyz;
	#endif
#endif`,Zf=`float specularStrength;
#ifdef USE_SPECULARMAP
	vec4 texelSpecular = texture2D( specularMap, vSpecularMapUv );
	specularStrength = texelSpecular.r;
#else
	specularStrength = 1.0;
#endif`,jf=`#ifdef USE_SPECULARMAP
	uniform sampler2D specularMap;
#endif`,Qf=`#if defined( TONE_MAPPING )
	gl_FragColor.rgb = toneMapping( gl_FragColor.rgb );
#endif`,tp=`#ifndef saturate
#define saturate( a ) clamp( a, 0.0, 1.0 )
#endif
uniform float toneMappingExposure;
vec3 LinearToneMapping( vec3 color ) {
	return saturate( toneMappingExposure * color );
}
vec3 ReinhardToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	return saturate( color / ( vec3( 1.0 ) + color ) );
}
vec3 CineonToneMapping( vec3 color ) {
	color *= toneMappingExposure;
	color = max( vec3( 0.0 ), color - 0.004 );
	return pow( ( color * ( 6.2 * color + 0.5 ) ) / ( color * ( 6.2 * color + 1.7 ) + 0.06 ), vec3( 2.2 ) );
}
vec3 RRTAndODTFit( vec3 v ) {
	vec3 a = v * ( v + 0.0245786 ) - 0.000090537;
	vec3 b = v * ( 0.983729 * v + 0.4329510 ) + 0.238081;
	return a / b;
}
vec3 ACESFilmicToneMapping( vec3 color ) {
	const mat3 ACESInputMat = mat3(
		vec3( 0.59719, 0.07600, 0.02840 ),		vec3( 0.35458, 0.90834, 0.13383 ),
		vec3( 0.04823, 0.01566, 0.83777 )
	);
	const mat3 ACESOutputMat = mat3(
		vec3(  1.60475, -0.10208, -0.00327 ),		vec3( -0.53108,  1.10813, -0.07276 ),
		vec3( -0.07367, -0.00605,  1.07602 )
	);
	color *= toneMappingExposure / 0.6;
	color = ACESInputMat * color;
	color = RRTAndODTFit( color );
	color = ACESOutputMat * color;
	return saturate( color );
}
const mat3 LINEAR_REC2020_TO_LINEAR_SRGB = mat3(
	vec3( 1.6605, - 0.1246, - 0.0182 ),
	vec3( - 0.5876, 1.1329, - 0.1006 ),
	vec3( - 0.0728, - 0.0083, 1.1187 )
);
const mat3 LINEAR_SRGB_TO_LINEAR_REC2020 = mat3(
	vec3( 0.6274, 0.0691, 0.0164 ),
	vec3( 0.3293, 0.9195, 0.0880 ),
	vec3( 0.0433, 0.0113, 0.8956 )
);
vec3 agxDefaultContrastApprox( vec3 x ) {
	vec3 x2 = x * x;
	vec3 x4 = x2 * x2;
	return + 15.5 * x4 * x2
		- 40.14 * x4 * x
		+ 31.96 * x4
		- 6.868 * x2 * x
		+ 0.4298 * x2
		+ 0.1191 * x
		- 0.00232;
}
vec3 AgXToneMapping( vec3 color ) {
	const mat3 AgXInsetMatrix = mat3(
		vec3( 0.856627153315983, 0.137318972929847, 0.11189821299995 ),
		vec3( 0.0951212405381588, 0.761241990602591, 0.0767994186031903 ),
		vec3( 0.0482516061458583, 0.101439036467562, 0.811302368396859 )
	);
	const mat3 AgXOutsetMatrix = mat3(
		vec3( 1.1271005818144368, - 0.1413297634984383, - 0.14132976349843826 ),
		vec3( - 0.11060664309660323, 1.157823702216272, - 0.11060664309660294 ),
		vec3( - 0.016493938717834573, - 0.016493938717834257, 1.2519364065950405 )
	);
	const float AgxMinEv = - 12.47393;	const float AgxMaxEv = 4.026069;
	color *= toneMappingExposure;
	color = LINEAR_SRGB_TO_LINEAR_REC2020 * color;
	color = AgXInsetMatrix * color;
	color = max( color, 1e-10 );	color = log2( color );
	color = ( color - AgxMinEv ) / ( AgxMaxEv - AgxMinEv );
	color = clamp( color, 0.0, 1.0 );
	color = agxDefaultContrastApprox( color );
	color = AgXOutsetMatrix * color;
	color = pow( max( vec3( 0.0 ), color ), vec3( 2.2 ) );
	color = LINEAR_REC2020_TO_LINEAR_SRGB * color;
	color = clamp( color, 0.0, 1.0 );
	return color;
}
vec3 NeutralToneMapping( vec3 color ) {
	const float StartCompression = 0.8 - 0.04;
	const float Desaturation = 0.15;
	color *= toneMappingExposure;
	float x = min( color.r, min( color.g, color.b ) );
	float offset = x < 0.08 ? x - 6.25 * x * x : 0.04;
	color -= offset;
	float peak = max( color.r, max( color.g, color.b ) );
	if ( peak < StartCompression ) return color;
	float d = 1. - StartCompression;
	float newPeak = 1. - d * d / ( peak + d - StartCompression );
	color *= newPeak / peak;
	float g = 1. - 1. / ( Desaturation * ( peak - newPeak ) + 1. );
	return mix( color, vec3( newPeak ), g );
}
vec3 CustomToneMapping( vec3 color ) { return color; }`,ep=`#ifdef USE_TRANSMISSION
	material.transmission = transmission;
	material.transmissionAlpha = 1.0;
	material.thickness = thickness;
	material.attenuationDistance = attenuationDistance;
	material.attenuationColor = attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		material.transmission *= texture2D( transmissionMap, vTransmissionMapUv ).r;
	#endif
	#ifdef USE_THICKNESSMAP
		material.thickness *= texture2D( thicknessMap, vThicknessMapUv ).g;
	#endif
	vec3 pos = vWorldPosition;
	vec3 v = normalize( cameraPosition - pos );
	vec3 n = inverseTransformDirection( normal, viewMatrix );
	vec4 transmitted = getIBLVolumeRefraction(
		n, v, material.roughness, material.diffuseContribution, material.specularColorBlended, material.specularF90,
		pos, modelMatrix, viewMatrix, projectionMatrix, material.dispersion, material.ior, material.thickness,
		material.attenuationColor, material.attenuationDistance );
	material.transmissionAlpha = mix( material.transmissionAlpha, transmitted.a, material.transmission );
	totalDiffuse = mix( totalDiffuse, transmitted.rgb, material.transmission );
#endif`,np=`#ifdef USE_TRANSMISSION
	uniform float transmission;
	uniform float thickness;
	uniform float attenuationDistance;
	uniform vec3 attenuationColor;
	#ifdef USE_TRANSMISSIONMAP
		uniform sampler2D transmissionMap;
	#endif
	#ifdef USE_THICKNESSMAP
		uniform sampler2D thicknessMap;
	#endif
	uniform vec2 transmissionSamplerSize;
	uniform sampler2D transmissionSamplerMap;
	uniform mat4 modelMatrix;
	uniform mat4 projectionMatrix;
	varying vec3 vWorldPosition;
	float w0( float a ) {
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - a + 3.0 ) - 3.0 ) + 1.0 );
	}
	float w1( float a ) {
		return ( 1.0 / 6.0 ) * ( a *  a * ( 3.0 * a - 6.0 ) + 4.0 );
	}
	float w2( float a ){
		return ( 1.0 / 6.0 ) * ( a * ( a * ( - 3.0 * a + 3.0 ) + 3.0 ) + 1.0 );
	}
	float w3( float a ) {
		return ( 1.0 / 6.0 ) * ( a * a * a );
	}
	float g0( float a ) {
		return w0( a ) + w1( a );
	}
	float g1( float a ) {
		return w2( a ) + w3( a );
	}
	float h0( float a ) {
		return - 1.0 + w1( a ) / ( w0( a ) + w1( a ) );
	}
	float h1( float a ) {
		return 1.0 + w3( a ) / ( w2( a ) + w3( a ) );
	}
	vec4 bicubic( sampler2D tex, vec2 uv, vec4 texelSize, float lod ) {
		uv = uv * texelSize.zw + 0.5;
		vec2 iuv = floor( uv );
		vec2 fuv = fract( uv );
		float g0x = g0( fuv.x );
		float g1x = g1( fuv.x );
		float h0x = h0( fuv.x );
		float h1x = h1( fuv.x );
		float h0y = h0( fuv.y );
		float h1y = h1( fuv.y );
		vec2 p0 = ( vec2( iuv.x + h0x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p1 = ( vec2( iuv.x + h1x, iuv.y + h0y ) - 0.5 ) * texelSize.xy;
		vec2 p2 = ( vec2( iuv.x + h0x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		vec2 p3 = ( vec2( iuv.x + h1x, iuv.y + h1y ) - 0.5 ) * texelSize.xy;
		return g0( fuv.y ) * ( g0x * textureLod( tex, p0, lod ) + g1x * textureLod( tex, p1, lod ) ) +
			g1( fuv.y ) * ( g0x * textureLod( tex, p2, lod ) + g1x * textureLod( tex, p3, lod ) );
	}
	vec4 textureBicubic( sampler2D sampler, vec2 uv, float lod ) {
		vec2 fLodSize = vec2( textureSize( sampler, int( lod ) ) );
		vec2 cLodSize = vec2( textureSize( sampler, int( lod + 1.0 ) ) );
		vec2 fLodSizeInv = 1.0 / fLodSize;
		vec2 cLodSizeInv = 1.0 / cLodSize;
		vec4 fSample = bicubic( sampler, uv, vec4( fLodSizeInv, fLodSize ), floor( lod ) );
		vec4 cSample = bicubic( sampler, uv, vec4( cLodSizeInv, cLodSize ), ceil( lod ) );
		return mix( fSample, cSample, fract( lod ) );
	}
	vec3 getVolumeTransmissionRay( const in vec3 n, const in vec3 v, const in float thickness, const in float ior, const in mat4 modelMatrix ) {
		vec3 refractionVector = refract( - v, normalize( n ), 1.0 / ior );
		vec3 modelScale;
		modelScale.x = length( vec3( modelMatrix[ 0 ].xyz ) );
		modelScale.y = length( vec3( modelMatrix[ 1 ].xyz ) );
		modelScale.z = length( vec3( modelMatrix[ 2 ].xyz ) );
		return normalize( refractionVector ) * thickness * modelScale;
	}
	float applyIorToRoughness( const in float roughness, const in float ior ) {
		return roughness * clamp( ior * 2.0 - 2.0, 0.0, 1.0 );
	}
	vec4 getTransmissionSample( const in vec2 fragCoord, const in float roughness, const in float ior ) {
		float lod = log2( transmissionSamplerSize.x ) * applyIorToRoughness( roughness, ior );
		return textureBicubic( transmissionSamplerMap, fragCoord.xy, lod );
	}
	vec3 volumeAttenuation( const in float transmissionDistance, const in vec3 attenuationColor, const in float attenuationDistance ) {
		if ( isinf( attenuationDistance ) ) {
			return vec3( 1.0 );
		} else {
			vec3 attenuationCoefficient = -log( attenuationColor ) / attenuationDistance;
			vec3 transmittance = exp( - attenuationCoefficient * transmissionDistance );			return transmittance;
		}
	}
	vec4 getIBLVolumeRefraction( const in vec3 n, const in vec3 v, const in float roughness, const in vec3 diffuseColor,
		const in vec3 specularColor, const in float specularF90, const in vec3 position, const in mat4 modelMatrix,
		const in mat4 viewMatrix, const in mat4 projMatrix, const in float dispersion, const in float ior, const in float thickness,
		const in vec3 attenuationColor, const in float attenuationDistance ) {
		vec4 transmittedLight;
		vec3 transmittance;
		#ifdef USE_DISPERSION
			float halfSpread = ( ior - 1.0 ) * 0.025 * dispersion;
			vec3 iors = vec3( ior - halfSpread, ior, ior + halfSpread );
			for ( int i = 0; i < 3; i ++ ) {
				vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, iors[ i ], modelMatrix );
				vec3 refractedRayExit = position + transmissionRay;
				vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
				vec2 refractionCoords = ndcPos.xy / ndcPos.w;
				refractionCoords += 1.0;
				refractionCoords /= 2.0;
				vec4 transmissionSample = getTransmissionSample( refractionCoords, roughness, iors[ i ] );
				transmittedLight[ i ] = transmissionSample[ i ];
				transmittedLight.a += transmissionSample.a;
				transmittance[ i ] = diffuseColor[ i ] * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance )[ i ];
			}
			transmittedLight.a /= 3.0;
		#else
			vec3 transmissionRay = getVolumeTransmissionRay( n, v, thickness, ior, modelMatrix );
			vec3 refractedRayExit = position + transmissionRay;
			vec4 ndcPos = projMatrix * viewMatrix * vec4( refractedRayExit, 1.0 );
			vec2 refractionCoords = ndcPos.xy / ndcPos.w;
			refractionCoords += 1.0;
			refractionCoords /= 2.0;
			transmittedLight = getTransmissionSample( refractionCoords, roughness, ior );
			transmittance = diffuseColor * volumeAttenuation( length( transmissionRay ), attenuationColor, attenuationDistance );
		#endif
		vec3 attenuatedColor = transmittance * transmittedLight.rgb;
		vec3 F = EnvironmentBRDF( n, v, specularColor, specularF90, roughness );
		float transmittanceFactor = ( transmittance.r + transmittance.g + transmittance.b ) / 3.0;
		return vec4( ( 1.0 - F ) * attenuatedColor, 1.0 - ( 1.0 - transmittedLight.a ) * transmittanceFactor );
	}
#endif`,ip=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_SPECULARMAP
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,sp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	varying vec2 vUv;
#endif
#ifdef USE_MAP
	uniform mat3 mapTransform;
	varying vec2 vMapUv;
#endif
#ifdef USE_ALPHAMAP
	uniform mat3 alphaMapTransform;
	varying vec2 vAlphaMapUv;
#endif
#ifdef USE_LIGHTMAP
	uniform mat3 lightMapTransform;
	varying vec2 vLightMapUv;
#endif
#ifdef USE_AOMAP
	uniform mat3 aoMapTransform;
	varying vec2 vAoMapUv;
#endif
#ifdef USE_BUMPMAP
	uniform mat3 bumpMapTransform;
	varying vec2 vBumpMapUv;
#endif
#ifdef USE_NORMALMAP
	uniform mat3 normalMapTransform;
	varying vec2 vNormalMapUv;
#endif
#ifdef USE_DISPLACEMENTMAP
	uniform mat3 displacementMapTransform;
	varying vec2 vDisplacementMapUv;
#endif
#ifdef USE_EMISSIVEMAP
	uniform mat3 emissiveMapTransform;
	varying vec2 vEmissiveMapUv;
#endif
#ifdef USE_METALNESSMAP
	uniform mat3 metalnessMapTransform;
	varying vec2 vMetalnessMapUv;
#endif
#ifdef USE_ROUGHNESSMAP
	uniform mat3 roughnessMapTransform;
	varying vec2 vRoughnessMapUv;
#endif
#ifdef USE_ANISOTROPYMAP
	uniform mat3 anisotropyMapTransform;
	varying vec2 vAnisotropyMapUv;
#endif
#ifdef USE_CLEARCOATMAP
	uniform mat3 clearcoatMapTransform;
	varying vec2 vClearcoatMapUv;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	uniform mat3 clearcoatNormalMapTransform;
	varying vec2 vClearcoatNormalMapUv;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	uniform mat3 clearcoatRoughnessMapTransform;
	varying vec2 vClearcoatRoughnessMapUv;
#endif
#ifdef USE_SHEEN_COLORMAP
	uniform mat3 sheenColorMapTransform;
	varying vec2 vSheenColorMapUv;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	uniform mat3 sheenRoughnessMapTransform;
	varying vec2 vSheenRoughnessMapUv;
#endif
#ifdef USE_IRIDESCENCEMAP
	uniform mat3 iridescenceMapTransform;
	varying vec2 vIridescenceMapUv;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	uniform mat3 iridescenceThicknessMapTransform;
	varying vec2 vIridescenceThicknessMapUv;
#endif
#ifdef USE_SPECULARMAP
	uniform mat3 specularMapTransform;
	varying vec2 vSpecularMapUv;
#endif
#ifdef USE_SPECULAR_COLORMAP
	uniform mat3 specularColorMapTransform;
	varying vec2 vSpecularColorMapUv;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	uniform mat3 specularIntensityMapTransform;
	varying vec2 vSpecularIntensityMapUv;
#endif
#ifdef USE_TRANSMISSIONMAP
	uniform mat3 transmissionMapTransform;
	varying vec2 vTransmissionMapUv;
#endif
#ifdef USE_THICKNESSMAP
	uniform mat3 thicknessMapTransform;
	varying vec2 vThicknessMapUv;
#endif`,rp=`#if defined( USE_UV ) || defined( USE_ANISOTROPY )
	vUv = vec3( uv, 1 ).xy;
#endif
#ifdef USE_MAP
	vMapUv = ( mapTransform * vec3( MAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ALPHAMAP
	vAlphaMapUv = ( alphaMapTransform * vec3( ALPHAMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_LIGHTMAP
	vLightMapUv = ( lightMapTransform * vec3( LIGHTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_AOMAP
	vAoMapUv = ( aoMapTransform * vec3( AOMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_BUMPMAP
	vBumpMapUv = ( bumpMapTransform * vec3( BUMPMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_NORMALMAP
	vNormalMapUv = ( normalMapTransform * vec3( NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_DISPLACEMENTMAP
	vDisplacementMapUv = ( displacementMapTransform * vec3( DISPLACEMENTMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_EMISSIVEMAP
	vEmissiveMapUv = ( emissiveMapTransform * vec3( EMISSIVEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_METALNESSMAP
	vMetalnessMapUv = ( metalnessMapTransform * vec3( METALNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ROUGHNESSMAP
	vRoughnessMapUv = ( roughnessMapTransform * vec3( ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_ANISOTROPYMAP
	vAnisotropyMapUv = ( anisotropyMapTransform * vec3( ANISOTROPYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOATMAP
	vClearcoatMapUv = ( clearcoatMapTransform * vec3( CLEARCOATMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_NORMALMAP
	vClearcoatNormalMapUv = ( clearcoatNormalMapTransform * vec3( CLEARCOAT_NORMALMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_CLEARCOAT_ROUGHNESSMAP
	vClearcoatRoughnessMapUv = ( clearcoatRoughnessMapTransform * vec3( CLEARCOAT_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCEMAP
	vIridescenceMapUv = ( iridescenceMapTransform * vec3( IRIDESCENCEMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_IRIDESCENCE_THICKNESSMAP
	vIridescenceThicknessMapUv = ( iridescenceThicknessMapTransform * vec3( IRIDESCENCE_THICKNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_COLORMAP
	vSheenColorMapUv = ( sheenColorMapTransform * vec3( SHEEN_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SHEEN_ROUGHNESSMAP
	vSheenRoughnessMapUv = ( sheenRoughnessMapTransform * vec3( SHEEN_ROUGHNESSMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULARMAP
	vSpecularMapUv = ( specularMapTransform * vec3( SPECULARMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_COLORMAP
	vSpecularColorMapUv = ( specularColorMapTransform * vec3( SPECULAR_COLORMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_SPECULAR_INTENSITYMAP
	vSpecularIntensityMapUv = ( specularIntensityMapTransform * vec3( SPECULAR_INTENSITYMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_TRANSMISSIONMAP
	vTransmissionMapUv = ( transmissionMapTransform * vec3( TRANSMISSIONMAP_UV, 1 ) ).xy;
#endif
#ifdef USE_THICKNESSMAP
	vThicknessMapUv = ( thicknessMapTransform * vec3( THICKNESSMAP_UV, 1 ) ).xy;
#endif`,op=`#if defined( USE_ENVMAP ) || defined( DISTANCE ) || defined ( USE_SHADOWMAP ) || defined ( USE_TRANSMISSION ) || NUM_SPOT_LIGHT_COORDS > 0
	vec4 worldPosition = vec4( transformed, 1.0 );
	#ifdef USE_BATCHING
		worldPosition = batchingMatrix * worldPosition;
	#endif
	#ifdef USE_INSTANCING
		worldPosition = instanceMatrix * worldPosition;
	#endif
	worldPosition = modelMatrix * worldPosition;
#endif`;const ap=`varying vec2 vUv;
uniform mat3 uvTransform;
void main() {
	vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	gl_Position = vec4( position.xy, 1.0, 1.0 );
}`,lp=`uniform sampler2D t2D;
uniform float backgroundIntensity;
varying vec2 vUv;
void main() {
	vec4 texColor = texture2D( t2D, vUv );
	#ifdef DECODE_VIDEO_TEXTURE
		texColor = vec4( mix( pow( texColor.rgb * 0.9478672986 + vec3( 0.0521327014 ), vec3( 2.4 ) ), texColor.rgb * 0.0773993808, vec3( lessThanEqual( texColor.rgb, vec3( 0.04045 ) ) ) ), texColor.w );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,cp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,hp=`#ifdef ENVMAP_TYPE_CUBE
	uniform samplerCube envMap;
#elif defined( ENVMAP_TYPE_CUBE_UV )
	uniform sampler2D envMap;
#endif
uniform float backgroundBlurriness;
uniform float backgroundIntensity;
uniform mat3 backgroundRotation;
varying vec3 vWorldDirection;
#include <cube_uv_reflection_fragment>
void main() {
	#ifdef ENVMAP_TYPE_CUBE
		vec4 texColor = textureCube( envMap, backgroundRotation * vWorldDirection );
	#elif defined( ENVMAP_TYPE_CUBE_UV )
		vec4 texColor = textureCubeUV( envMap, backgroundRotation * vWorldDirection, backgroundBlurriness );
	#else
		vec4 texColor = vec4( 0.0, 0.0, 0.0, 1.0 );
	#endif
	texColor.rgb *= backgroundIntensity;
	gl_FragColor = texColor;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,dp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
	gl_Position.z = gl_Position.w;
}`,up=`uniform samplerCube tCube;
uniform float tFlip;
uniform float opacity;
varying vec3 vWorldDirection;
void main() {
	vec4 texColor = textureCube( tCube, vec3( tFlip * vWorldDirection.x, vWorldDirection.yz ) );
	gl_FragColor = texColor;
	gl_FragColor.a *= opacity;
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,fp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
varying vec2 vHighPrecisionZW;
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vHighPrecisionZW = gl_Position.zw;
}`,pp=`#if DEPTH_PACKING == 3200
	uniform float opacity;
#endif
#include <common>
#include <packing>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
varying vec2 vHighPrecisionZW;
void main() {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#if DEPTH_PACKING == 3200
		diffuseColor.a = opacity;
	#endif
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <logdepthbuf_fragment>
	#ifdef USE_REVERSED_DEPTH_BUFFER
		float fragCoordZ = vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ];
	#else
		float fragCoordZ = 0.5 * vHighPrecisionZW[ 0 ] / vHighPrecisionZW[ 1 ] + 0.5;
	#endif
	#if DEPTH_PACKING == 3200
		gl_FragColor = vec4( vec3( 1.0 - fragCoordZ ), opacity );
	#elif DEPTH_PACKING == 3201
		gl_FragColor = packDepthToRGBA( fragCoordZ );
	#elif DEPTH_PACKING == 3202
		gl_FragColor = vec4( packDepthToRGB( fragCoordZ ), 1.0 );
	#elif DEPTH_PACKING == 3203
		gl_FragColor = vec4( packDepthToRG( fragCoordZ ), 0.0, 1.0 );
	#endif
}`,mp=`#define DISTANCE
varying vec3 vWorldPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <skinbase_vertex>
	#include <morphinstance_vertex>
	#ifdef USE_DISPLACEMENTMAP
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <worldpos_vertex>
	#include <clipping_planes_vertex>
	vWorldPosition = worldPosition.xyz;
}`,gp=`#define DISTANCE
uniform vec3 referencePosition;
uniform float nearDistance;
uniform float farDistance;
varying vec3 vWorldPosition;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <clipping_planes_pars_fragment>
void main () {
	vec4 diffuseColor = vec4( 1.0 );
	#include <clipping_planes_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	float dist = length( vWorldPosition - referencePosition );
	dist = ( dist - nearDistance ) / ( farDistance - nearDistance );
	dist = saturate( dist );
	gl_FragColor = vec4( dist, 0.0, 0.0, 1.0 );
}`,xp=`varying vec3 vWorldDirection;
#include <common>
void main() {
	vWorldDirection = transformDirection( position, modelMatrix );
	#include <begin_vertex>
	#include <project_vertex>
}`,_p=`uniform sampler2D tEquirect;
varying vec3 vWorldDirection;
#include <common>
void main() {
	vec3 direction = normalize( vWorldDirection );
	vec2 sampleUV = equirectUv( direction );
	gl_FragColor = texture2D( tEquirect, sampleUV );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
}`,vp=`uniform float scale;
attribute float lineDistance;
varying float vLineDistance;
#include <common>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	vLineDistance = scale * lineDistance;
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,Mp=`uniform vec3 diffuse;
uniform float opacity;
uniform float dashSize;
uniform float totalSize;
varying float vLineDistance;
#include <common>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	if ( mod( vLineDistance, totalSize ) > dashSize ) {
		discard;
	}
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Sp=`#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#if defined ( USE_ENVMAP ) || defined ( USE_SKINNING )
		#include <beginnormal_vertex>
		#include <morphnormal_vertex>
		#include <skinbase_vertex>
		#include <skinnormal_vertex>
		#include <defaultnormal_vertex>
	#endif
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <fog_vertex>
}`,yp=`uniform vec3 diffuse;
uniform float opacity;
#ifndef FLAT_SHADED
	varying vec3 vNormal;
#endif
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <fog_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	#ifdef USE_LIGHTMAP
		vec4 lightMapTexel = texture2D( lightMap, vLightMapUv );
		reflectedLight.indirectDiffuse += lightMapTexel.rgb * lightMapIntensity * RECIPROCAL_PI;
	#else
		reflectedLight.indirectDiffuse += vec3( 1.0 );
	#endif
	#include <aomap_fragment>
	reflectedLight.indirectDiffuse *= diffuseColor.rgb;
	vec3 outgoingLight = reflectedLight.indirectDiffuse;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,bp=`#define LAMBERT
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Ep=`#define LAMBERT
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_lambert_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_lambert_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Tp=`#define MATCAP
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <color_pars_vertex>
#include <displacementmap_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
	vViewPosition = - mvPosition.xyz;
}`,wp=`#define MATCAP
uniform vec3 diffuse;
uniform float opacity;
uniform sampler2D matcap;
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	vec3 viewDir = normalize( vViewPosition );
	vec3 x = normalize( vec3( viewDir.z, 0.0, - viewDir.x ) );
	vec3 y = cross( viewDir, x );
	vec2 uv = vec2( dot( x, normal ), dot( y, normal ) ) * 0.495 + 0.5;
	#ifdef USE_MATCAP
		vec4 matcapColor = texture2D( matcap, uv );
	#else
		vec4 matcapColor = vec4( vec3( mix( 0.2, 0.8, uv.y ) ), 1.0 );
	#endif
	vec3 outgoingLight = diffuseColor.rgb * matcapColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Ap=`#define NORMAL
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	vViewPosition = - mvPosition.xyz;
#endif
}`,Cp=`#define NORMAL
uniform float opacity;
#if defined( FLAT_SHADED ) || defined( USE_BUMPMAP ) || defined( USE_NORMALMAP_TANGENTSPACE )
	varying vec3 vViewPosition;
#endif
#include <uv_pars_fragment>
#include <normal_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( 0.0, 0.0, 0.0, opacity );
	#include <clipping_planes_fragment>
	#include <logdepthbuf_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	gl_FragColor = vec4( normalize( normal ) * 0.5 + 0.5, diffuseColor.a );
	#ifdef OPAQUE
		gl_FragColor.a = 1.0;
	#endif
}`,Rp=`#define PHONG
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <envmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <envmap_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Pp=`#define PHONG
uniform vec3 diffuse;
uniform vec3 emissive;
uniform vec3 specular;
uniform float shininess;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_phong_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <specularmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <specularmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_phong_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + reflectedLight.directSpecular + reflectedLight.indirectSpecular + totalEmissiveRadiance;
	#include <envmap_fragment>
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Lp=`#define STANDARD
varying vec3 vViewPosition;
#ifdef USE_TRANSMISSION
	varying vec3 vWorldPosition;
#endif
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
#ifdef USE_TRANSMISSION
	vWorldPosition = worldPosition.xyz;
#endif
}`,Ip=`#define STANDARD
#ifdef PHYSICAL
	#define IOR
	#define USE_SPECULAR
#endif
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float roughness;
uniform float metalness;
uniform float opacity;
#ifdef IOR
	uniform float ior;
#endif
#ifdef USE_SPECULAR
	uniform float specularIntensity;
	uniform vec3 specularColor;
	#ifdef USE_SPECULAR_COLORMAP
		uniform sampler2D specularColorMap;
	#endif
	#ifdef USE_SPECULAR_INTENSITYMAP
		uniform sampler2D specularIntensityMap;
	#endif
#endif
#ifdef USE_CLEARCOAT
	uniform float clearcoat;
	uniform float clearcoatRoughness;
#endif
#ifdef USE_DISPERSION
	uniform float dispersion;
#endif
#ifdef USE_IRIDESCENCE
	uniform float iridescence;
	uniform float iridescenceIOR;
	uniform float iridescenceThicknessMinimum;
	uniform float iridescenceThicknessMaximum;
#endif
#ifdef USE_SHEEN
	uniform vec3 sheenColor;
	uniform float sheenRoughness;
	#ifdef USE_SHEEN_COLORMAP
		uniform sampler2D sheenColorMap;
	#endif
	#ifdef USE_SHEEN_ROUGHNESSMAP
		uniform sampler2D sheenRoughnessMap;
	#endif
#endif
#ifdef USE_ANISOTROPY
	uniform vec2 anisotropyVector;
	#ifdef USE_ANISOTROPYMAP
		uniform sampler2D anisotropyMap;
	#endif
#endif
varying vec3 vViewPosition;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <iridescence_fragment>
#include <cube_uv_reflection_fragment>
#include <envmap_common_pars_fragment>
#include <envmap_physical_pars_fragment>
#include <fog_pars_fragment>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_physical_pars_fragment>
#include <transmission_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <clearcoat_pars_fragment>
#include <iridescence_pars_fragment>
#include <roughnessmap_pars_fragment>
#include <metalnessmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <roughnessmap_fragment>
	#include <metalnessmap_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <clearcoat_normal_fragment_begin>
	#include <clearcoat_normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_physical_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 totalDiffuse = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse;
	vec3 totalSpecular = reflectedLight.directSpecular + reflectedLight.indirectSpecular;
	#include <transmission_fragment>
	vec3 outgoingLight = totalDiffuse + totalSpecular + totalEmissiveRadiance;
	#ifdef USE_SHEEN
 
		outgoingLight = outgoingLight + sheenSpecularDirect + sheenSpecularIndirect;
 
 	#endif
	#ifdef USE_CLEARCOAT
		float dotNVcc = saturate( dot( geometryClearcoatNormal, geometryViewDir ) );
		vec3 Fcc = F_Schlick( material.clearcoatF0, material.clearcoatF90, dotNVcc );
		outgoingLight = outgoingLight * ( 1.0 - material.clearcoat * Fcc ) + ( clearcoatSpecularDirect + clearcoatSpecularIndirect ) * material.clearcoat;
	#endif
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Dp=`#define TOON
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <normal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <displacementmap_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	vViewPosition = - mvPosition.xyz;
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Np=`#define TOON
uniform vec3 diffuse;
uniform vec3 emissive;
uniform float opacity;
#include <common>
#include <dithering_pars_fragment>
#include <color_pars_fragment>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <aomap_pars_fragment>
#include <lightmap_pars_fragment>
#include <emissivemap_pars_fragment>
#include <gradientmap_pars_fragment>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <normal_pars_fragment>
#include <lights_toon_pars_fragment>
#include <shadowmap_pars_fragment>
#include <bumpmap_pars_fragment>
#include <normalmap_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	ReflectedLight reflectedLight = ReflectedLight( vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ), vec3( 0.0 ) );
	vec3 totalEmissiveRadiance = emissive;
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <color_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	#include <normal_fragment_begin>
	#include <normal_fragment_maps>
	#include <emissivemap_fragment>
	#include <lights_toon_fragment>
	#include <lights_fragment_begin>
	#include <lights_fragment_maps>
	#include <lights_fragment_end>
	#include <aomap_fragment>
	vec3 outgoingLight = reflectedLight.directDiffuse + reflectedLight.indirectDiffuse + totalEmissiveRadiance;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
	#include <dithering_fragment>
}`,Up=`uniform float size;
uniform float scale;
#include <common>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
#ifdef USE_POINTS_UV
	varying vec2 vUv;
	uniform mat3 uvTransform;
#endif
void main() {
	#ifdef USE_POINTS_UV
		vUv = ( uvTransform * vec3( uv, 1 ) ).xy;
	#endif
	#include <color_vertex>
	#include <morphinstance_vertex>
	#include <morphcolor_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <project_vertex>
	gl_PointSize = size;
	#ifdef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) gl_PointSize *= ( scale / - mvPosition.z );
	#endif
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <worldpos_vertex>
	#include <fog_vertex>
}`,Fp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <color_pars_fragment>
#include <map_particle_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_particle_fragment>
	#include <color_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,Op=`#include <common>
#include <batching_pars_vertex>
#include <fog_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <shadowmap_pars_vertex>
void main() {
	#include <batching_vertex>
	#include <beginnormal_vertex>
	#include <morphinstance_vertex>
	#include <morphnormal_vertex>
	#include <skinbase_vertex>
	#include <skinnormal_vertex>
	#include <defaultnormal_vertex>
	#include <begin_vertex>
	#include <morphtarget_vertex>
	#include <skinning_vertex>
	#include <project_vertex>
	#include <logdepthbuf_vertex>
	#include <worldpos_vertex>
	#include <shadowmap_vertex>
	#include <fog_vertex>
}`,Bp=`uniform vec3 color;
uniform float opacity;
#include <common>
#include <fog_pars_fragment>
#include <bsdfs>
#include <lights_pars_begin>
#include <logdepthbuf_pars_fragment>
#include <shadowmap_pars_fragment>
#include <shadowmask_pars_fragment>
void main() {
	#include <logdepthbuf_fragment>
	gl_FragColor = vec4( color, opacity * ( 1.0 - getShadowMask() ) );
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
	#include <premultiplied_alpha_fragment>
}`,kp=`uniform float rotation;
uniform vec2 center;
#include <common>
#include <uv_pars_vertex>
#include <fog_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
void main() {
	#include <uv_vertex>
	vec4 mvPosition = modelViewMatrix[ 3 ];
	vec2 scale = vec2( length( modelMatrix[ 0 ].xyz ), length( modelMatrix[ 1 ].xyz ) );
	#ifndef USE_SIZEATTENUATION
		bool isPerspective = isPerspectiveMatrix( projectionMatrix );
		if ( isPerspective ) scale *= - mvPosition.z;
	#endif
	vec2 alignedPosition = ( position.xy - ( center - vec2( 0.5 ) ) ) * scale;
	vec2 rotatedPosition;
	rotatedPosition.x = cos( rotation ) * alignedPosition.x - sin( rotation ) * alignedPosition.y;
	rotatedPosition.y = sin( rotation ) * alignedPosition.x + cos( rotation ) * alignedPosition.y;
	mvPosition.xy += rotatedPosition;
	gl_Position = projectionMatrix * mvPosition;
	#include <logdepthbuf_vertex>
	#include <clipping_planes_vertex>
	#include <fog_vertex>
}`,zp=`uniform vec3 diffuse;
uniform float opacity;
#include <common>
#include <uv_pars_fragment>
#include <map_pars_fragment>
#include <alphamap_pars_fragment>
#include <alphatest_pars_fragment>
#include <alphahash_pars_fragment>
#include <fog_pars_fragment>
#include <logdepthbuf_pars_fragment>
#include <clipping_planes_pars_fragment>
void main() {
	vec4 diffuseColor = vec4( diffuse, opacity );
	#include <clipping_planes_fragment>
	vec3 outgoingLight = vec3( 0.0 );
	#include <logdepthbuf_fragment>
	#include <map_fragment>
	#include <alphamap_fragment>
	#include <alphatest_fragment>
	#include <alphahash_fragment>
	outgoingLight = diffuseColor.rgb;
	#include <opaque_fragment>
	#include <tonemapping_fragment>
	#include <colorspace_fragment>
	#include <fog_fragment>
}`,Jt={alphahash_fragment:ou,alphahash_pars_fragment:au,alphamap_fragment:lu,alphamap_pars_fragment:cu,alphatest_fragment:hu,alphatest_pars_fragment:du,aomap_fragment:uu,aomap_pars_fragment:fu,batching_pars_vertex:pu,batching_vertex:mu,begin_vertex:gu,beginnormal_vertex:xu,bsdfs:_u,iridescence_fragment:vu,bumpmap_pars_fragment:Mu,clipping_planes_fragment:Su,clipping_planes_pars_fragment:yu,clipping_planes_pars_vertex:bu,clipping_planes_vertex:Eu,color_fragment:Tu,color_pars_fragment:wu,color_pars_vertex:Au,color_vertex:Cu,common:Ru,cube_uv_reflection_fragment:Pu,defaultnormal_vertex:Lu,displacementmap_pars_vertex:Iu,displacementmap_vertex:Du,emissivemap_fragment:Nu,emissivemap_pars_fragment:Uu,colorspace_fragment:Fu,colorspace_pars_fragment:Ou,envmap_fragment:Bu,envmap_common_pars_fragment:ku,envmap_pars_fragment:zu,envmap_pars_vertex:Gu,envmap_physical_pars_fragment:ju,envmap_vertex:Vu,fog_vertex:Hu,fog_pars_vertex:Wu,fog_fragment:Xu,fog_pars_fragment:qu,gradientmap_pars_fragment:Yu,lightmap_pars_fragment:$u,lights_lambert_fragment:Ku,lights_lambert_pars_fragment:Ju,lights_pars_begin:Zu,lights_toon_fragment:Qu,lights_toon_pars_fragment:tf,lights_phong_fragment:ef,lights_phong_pars_fragment:nf,lights_physical_fragment:sf,lights_physical_pars_fragment:rf,lights_fragment_begin:of,lights_fragment_maps:af,lights_fragment_end:lf,lightprobes_pars_fragment:cf,logdepthbuf_fragment:hf,logdepthbuf_pars_fragment:df,logdepthbuf_pars_vertex:uf,logdepthbuf_vertex:ff,map_fragment:pf,map_pars_fragment:mf,map_particle_fragment:gf,map_particle_pars_fragment:xf,metalnessmap_fragment:_f,metalnessmap_pars_fragment:vf,morphinstance_vertex:Mf,morphcolor_vertex:Sf,morphnormal_vertex:yf,morphtarget_pars_vertex:bf,morphtarget_vertex:Ef,normal_fragment_begin:Tf,normal_fragment_maps:wf,normal_pars_fragment:Af,normal_pars_vertex:Cf,normal_vertex:Rf,normalmap_pars_fragment:Pf,clearcoat_normal_fragment_begin:Lf,clearcoat_normal_fragment_maps:If,clearcoat_pars_fragment:Df,iridescence_pars_fragment:Nf,opaque_fragment:Uf,packing:Ff,premultiplied_alpha_fragment:Of,project_vertex:Bf,dithering_fragment:kf,dithering_pars_fragment:zf,roughnessmap_fragment:Gf,roughnessmap_pars_fragment:Vf,shadowmap_pars_fragment:Hf,shadowmap_pars_vertex:Wf,shadowmap_vertex:Xf,shadowmask_pars_fragment:qf,skinbase_vertex:Yf,skinning_pars_vertex:$f,skinning_vertex:Kf,skinnormal_vertex:Jf,specularmap_fragment:Zf,specularmap_pars_fragment:jf,tonemapping_fragment:Qf,tonemapping_pars_fragment:tp,transmission_fragment:ep,transmission_pars_fragment:np,uv_pars_fragment:ip,uv_pars_vertex:sp,uv_vertex:rp,worldpos_vertex:op,background_vert:ap,background_frag:lp,backgroundCube_vert:cp,backgroundCube_frag:hp,cube_vert:dp,cube_frag:up,depth_vert:fp,depth_frag:pp,distance_vert:mp,distance_frag:gp,equirect_vert:xp,equirect_frag:_p,linedashed_vert:vp,linedashed_frag:Mp,meshbasic_vert:Sp,meshbasic_frag:yp,meshlambert_vert:bp,meshlambert_frag:Ep,meshmatcap_vert:Tp,meshmatcap_frag:wp,meshnormal_vert:Ap,meshnormal_frag:Cp,meshphong_vert:Rp,meshphong_frag:Pp,meshphysical_vert:Lp,meshphysical_frag:Ip,meshtoon_vert:Dp,meshtoon_frag:Np,points_vert:Up,points_frag:Fp,shadow_vert:Op,shadow_frag:Bp,sprite_vert:kp,sprite_frag:zp},mt={common:{diffuse:{value:new yt(16777215)},opacity:{value:1},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}},specularmap:{specularMap:{value:null},specularMapTransform:{value:new Xt}},envmap:{envMap:{value:null},envMapRotation:{value:new Xt},reflectivity:{value:1},ior:{value:1.5},refractionRatio:{value:.98},dfgLUT:{value:null}},aomap:{aoMap:{value:null},aoMapIntensity:{value:1},aoMapTransform:{value:new Xt}},lightmap:{lightMap:{value:null},lightMapIntensity:{value:1},lightMapTransform:{value:new Xt}},bumpmap:{bumpMap:{value:null},bumpMapTransform:{value:new Xt},bumpScale:{value:1}},normalmap:{normalMap:{value:null},normalMapTransform:{value:new Xt},normalScale:{value:new ot(1,1)}},displacementmap:{displacementMap:{value:null},displacementMapTransform:{value:new Xt},displacementScale:{value:1},displacementBias:{value:0}},emissivemap:{emissiveMap:{value:null},emissiveMapTransform:{value:new Xt}},metalnessmap:{metalnessMap:{value:null},metalnessMapTransform:{value:new Xt}},roughnessmap:{roughnessMap:{value:null},roughnessMapTransform:{value:new Xt}},gradientmap:{gradientMap:{value:null}},fog:{fogDensity:{value:25e-5},fogNear:{value:1},fogFar:{value:2e3},fogColor:{value:new yt(16777215)}},lights:{ambientLightColor:{value:[]},lightProbe:{value:[]},directionalLights:{value:[],properties:{direction:{},color:{}}},directionalLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},directionalShadowMatrix:{value:[]},spotLights:{value:[],properties:{color:{},position:{},direction:{},distance:{},coneCos:{},penumbraCos:{},decay:{}}},spotLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{}}},spotLightMap:{value:[]},spotLightMatrix:{value:[]},pointLights:{value:[],properties:{color:{},position:{},decay:{},distance:{}}},pointLightShadows:{value:[],properties:{shadowIntensity:1,shadowBias:{},shadowNormalBias:{},shadowRadius:{},shadowMapSize:{},shadowCameraNear:{},shadowCameraFar:{}}},pointShadowMatrix:{value:[]},hemisphereLights:{value:[],properties:{direction:{},skyColor:{},groundColor:{}}},rectAreaLights:{value:[],properties:{color:{},position:{},width:{},height:{}}},ltc_1:{value:null},ltc_2:{value:null},probesSH:{value:null},probesMin:{value:new E},probesMax:{value:new E},probesResolution:{value:new E}},points:{diffuse:{value:new yt(16777215)},opacity:{value:1},size:{value:1},scale:{value:1},map:{value:null},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0},uvTransform:{value:new Xt}},sprite:{diffuse:{value:new yt(16777215)},opacity:{value:1},center:{value:new ot(.5,.5)},rotation:{value:0},map:{value:null},mapTransform:{value:new Xt},alphaMap:{value:null},alphaMapTransform:{value:new Xt},alphaTest:{value:0}}},hn={basic:{uniforms:Oe([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.fog]),vertexShader:Jt.meshbasic_vert,fragmentShader:Jt.meshbasic_frag},lambert:{uniforms:Oe([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new yt(0)},envMapIntensity:{value:1}}]),vertexShader:Jt.meshlambert_vert,fragmentShader:Jt.meshlambert_frag},phong:{uniforms:Oe([mt.common,mt.specularmap,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,mt.lights,{emissive:{value:new yt(0)},specular:{value:new yt(1118481)},shininess:{value:30},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphong_vert,fragmentShader:Jt.meshphong_frag},standard:{uniforms:Oe([mt.common,mt.envmap,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.roughnessmap,mt.metalnessmap,mt.fog,mt.lights,{emissive:{value:new yt(0)},roughness:{value:1},metalness:{value:0},envMapIntensity:{value:1}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag},toon:{uniforms:Oe([mt.common,mt.aomap,mt.lightmap,mt.emissivemap,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.gradientmap,mt.fog,mt.lights,{emissive:{value:new yt(0)}}]),vertexShader:Jt.meshtoon_vert,fragmentShader:Jt.meshtoon_frag},matcap:{uniforms:Oe([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,mt.fog,{matcap:{value:null}}]),vertexShader:Jt.meshmatcap_vert,fragmentShader:Jt.meshmatcap_frag},points:{uniforms:Oe([mt.points,mt.fog]),vertexShader:Jt.points_vert,fragmentShader:Jt.points_frag},dashed:{uniforms:Oe([mt.common,mt.fog,{scale:{value:1},dashSize:{value:1},totalSize:{value:2}}]),vertexShader:Jt.linedashed_vert,fragmentShader:Jt.linedashed_frag},depth:{uniforms:Oe([mt.common,mt.displacementmap]),vertexShader:Jt.depth_vert,fragmentShader:Jt.depth_frag},normal:{uniforms:Oe([mt.common,mt.bumpmap,mt.normalmap,mt.displacementmap,{opacity:{value:1}}]),vertexShader:Jt.meshnormal_vert,fragmentShader:Jt.meshnormal_frag},sprite:{uniforms:Oe([mt.sprite,mt.fog]),vertexShader:Jt.sprite_vert,fragmentShader:Jt.sprite_frag},background:{uniforms:{uvTransform:{value:new Xt},t2D:{value:null},backgroundIntensity:{value:1}},vertexShader:Jt.background_vert,fragmentShader:Jt.background_frag},backgroundCube:{uniforms:{envMap:{value:null},backgroundBlurriness:{value:0},backgroundIntensity:{value:1},backgroundRotation:{value:new Xt}},vertexShader:Jt.backgroundCube_vert,fragmentShader:Jt.backgroundCube_frag},cube:{uniforms:{tCube:{value:null},tFlip:{value:-1},opacity:{value:1}},vertexShader:Jt.cube_vert,fragmentShader:Jt.cube_frag},equirect:{uniforms:{tEquirect:{value:null}},vertexShader:Jt.equirect_vert,fragmentShader:Jt.equirect_frag},distance:{uniforms:Oe([mt.common,mt.displacementmap,{referencePosition:{value:new E},nearDistance:{value:1},farDistance:{value:1e3}}]),vertexShader:Jt.distance_vert,fragmentShader:Jt.distance_frag},shadow:{uniforms:Oe([mt.lights,mt.fog,{color:{value:new yt(0)},opacity:{value:1}}]),vertexShader:Jt.shadow_vert,fragmentShader:Jt.shadow_frag}};hn.physical={uniforms:Oe([hn.standard.uniforms,{clearcoat:{value:0},clearcoatMap:{value:null},clearcoatMapTransform:{value:new Xt},clearcoatNormalMap:{value:null},clearcoatNormalMapTransform:{value:new Xt},clearcoatNormalScale:{value:new ot(1,1)},clearcoatRoughness:{value:0},clearcoatRoughnessMap:{value:null},clearcoatRoughnessMapTransform:{value:new Xt},dispersion:{value:0},iridescence:{value:0},iridescenceMap:{value:null},iridescenceMapTransform:{value:new Xt},iridescenceIOR:{value:1.3},iridescenceThicknessMinimum:{value:100},iridescenceThicknessMaximum:{value:400},iridescenceThicknessMap:{value:null},iridescenceThicknessMapTransform:{value:new Xt},sheen:{value:0},sheenColor:{value:new yt(0)},sheenColorMap:{value:null},sheenColorMapTransform:{value:new Xt},sheenRoughness:{value:1},sheenRoughnessMap:{value:null},sheenRoughnessMapTransform:{value:new Xt},transmission:{value:0},transmissionMap:{value:null},transmissionMapTransform:{value:new Xt},transmissionSamplerSize:{value:new ot},transmissionSamplerMap:{value:null},thickness:{value:0},thicknessMap:{value:null},thicknessMapTransform:{value:new Xt},attenuationDistance:{value:0},attenuationColor:{value:new yt(0)},specularColor:{value:new yt(1,1,1)},specularColorMap:{value:null},specularColorMapTransform:{value:new Xt},specularIntensity:{value:1},specularIntensityMap:{value:null},specularIntensityMapTransform:{value:new Xt},anisotropyVector:{value:new ot},anisotropyMap:{value:null},anisotropyMapTransform:{value:new Xt}}]),vertexShader:Jt.meshphysical_vert,fragmentShader:Jt.meshphysical_frag};const Ds={r:0,b:0,g:0},Gp=new Qt,Wc=new Xt;Wc.set(-1,0,0,0,1,0,0,0,1);function Vp(r,t,e,n,i,s){const o=new yt(0);let a=i===!0?0:1,l,c,d=null,u=0,h=null;function f(x){let M=x.isScene===!0?x.background:null;if(M&&M.isTexture){const S=x.backgroundBlurriness>0;M=t.get(M,S)}return M}function g(x){let M=!1;const S=f(x);S===null?p(o,a):S&&S.isColor&&(p(S,1),M=!0);const C=r.xr.getEnvironmentBlendMode();C==="additive"?e.buffers.color.setClear(0,0,0,1,s):C==="alpha-blend"&&e.buffers.color.setClear(0,0,0,0,s),(r.autoClear||M)&&(e.buffers.depth.setTest(!0),e.buffers.depth.setMask(!0),e.buffers.color.setMask(!0),r.clear(r.autoClearColor,r.autoClearDepth,r.autoClearStencil))}function y(x,M){const S=f(M);S&&(S.isCubeTexture||S.mapping===er)?(c===void 0&&(c=new Ft(new pe(1,1,1),new mn({name:"BackgroundCubeMaterial",uniforms:Ri(hn.backgroundCube.uniforms),vertexShader:hn.backgroundCube.vertexShader,fragmentShader:hn.backgroundCube.fragmentShader,side:Ge,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),c.geometry.deleteAttribute("normal"),c.geometry.deleteAttribute("uv"),c.onBeforeRender=function(C,w,R){this.matrixWorld.copyPosition(R.matrixWorld)},Object.defineProperty(c.material,"envMap",{get:function(){return this.uniforms.envMap.value}}),n.update(c)),c.material.uniforms.envMap.value=S,c.material.uniforms.backgroundBlurriness.value=M.backgroundBlurriness,c.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,c.material.uniforms.backgroundRotation.value.setFromMatrix4(Gp.makeRotationFromEuler(M.backgroundRotation)).transpose(),S.isCubeTexture&&S.isRenderTargetTexture===!1&&c.material.uniforms.backgroundRotation.value.premultiply(Wc),c.material.toneMapped=te.getTransfer(S.colorSpace)!==ae,(d!==S||u!==S.version||h!==r.toneMapping)&&(c.material.needsUpdate=!0,d=S,u=S.version,h=r.toneMapping),c.layers.enableAll(),x.unshift(c,c.geometry,c.material,0,0,null)):S&&S.isTexture&&(l===void 0&&(l=new Ft(new Di(2,2),new mn({name:"BackgroundMaterial",uniforms:Ri(hn.background.uniforms),vertexShader:hn.background.vertexShader,fragmentShader:hn.background.fragmentShader,side:Vn,depthTest:!1,depthWrite:!1,fog:!1,allowOverride:!1})),l.geometry.deleteAttribute("normal"),Object.defineProperty(l.material,"map",{get:function(){return this.uniforms.t2D.value}}),n.update(l)),l.material.uniforms.t2D.value=S,l.material.uniforms.backgroundIntensity.value=M.backgroundIntensity,l.material.toneMapped=te.getTransfer(S.colorSpace)!==ae,S.matrixAutoUpdate===!0&&S.updateMatrix(),l.material.uniforms.uvTransform.value.copy(S.matrix),(d!==S||u!==S.version||h!==r.toneMapping)&&(l.material.needsUpdate=!0,d=S,u=S.version,h=r.toneMapping),l.layers.enableAll(),x.unshift(l,l.geometry,l.material,0,0,null))}function p(x,M){x.getRGB(Ds,zc(r)),e.buffers.color.setClear(Ds.r,Ds.g,Ds.b,M,s)}function m(){c!==void 0&&(c.geometry.dispose(),c.material.dispose(),c=void 0),l!==void 0&&(l.geometry.dispose(),l.material.dispose(),l=void 0)}return{getClearColor:function(){return o},setClearColor:function(x,M=1){o.set(x),a=M,p(o,a)},getClearAlpha:function(){return a},setClearAlpha:function(x){a=x,p(o,a)},render:g,addToRenderList:y,dispose:m}}function Hp(r,t){const e=r.getParameter(r.MAX_VERTEX_ATTRIBS),n={},i=h(null);let s=i,o=!1;function a(L,O,W,q,U){let V=!1;const k=u(L,q,W,O);s!==k&&(s=k,c(s.object)),V=f(L,q,W,U),V&&g(L,q,W,U),U!==null&&t.update(U,r.ELEMENT_ARRAY_BUFFER),(V||o)&&(o=!1,S(L,O,W,q),U!==null&&r.bindBuffer(r.ELEMENT_ARRAY_BUFFER,t.get(U).buffer))}function l(){return r.createVertexArray()}function c(L){return r.bindVertexArray(L)}function d(L){return r.deleteVertexArray(L)}function u(L,O,W,q){const U=q.wireframe===!0;let V=n[O.id];V===void 0&&(V={},n[O.id]=V);const k=L.isInstancedMesh===!0?L.id:0;let et=V[k];et===void 0&&(et={},V[k]=et);let nt=et[W.id];nt===void 0&&(nt={},et[W.id]=nt);let pt=nt[U];return pt===void 0&&(pt=h(l()),nt[U]=pt),pt}function h(L){const O=[],W=[],q=[];for(let U=0;U<e;U++)O[U]=0,W[U]=0,q[U]=0;return{geometry:null,program:null,wireframe:!1,newAttributes:O,enabledAttributes:W,attributeDivisors:q,object:L,attributes:{},index:null}}function f(L,O,W,q){const U=s.attributes,V=O.attributes;let k=0;const et=W.getAttributes();for(const nt in et)if(et[nt].location>=0){const St=U[nt];let At=V[nt];if(At===void 0&&(nt==="instanceMatrix"&&L.instanceMatrix&&(At=L.instanceMatrix),nt==="instanceColor"&&L.instanceColor&&(At=L.instanceColor)),St===void 0||St.attribute!==At||At&&St.data!==At.data)return!0;k++}return s.attributesNum!==k||s.index!==q}function g(L,O,W,q){const U={},V=O.attributes;let k=0;const et=W.getAttributes();for(const nt in et)if(et[nt].location>=0){let St=V[nt];St===void 0&&(nt==="instanceMatrix"&&L.instanceMatrix&&(St=L.instanceMatrix),nt==="instanceColor"&&L.instanceColor&&(St=L.instanceColor));const At={};At.attribute=St,St&&St.data&&(At.data=St.data),U[nt]=At,k++}s.attributes=U,s.attributesNum=k,s.index=q}function y(){const L=s.newAttributes;for(let O=0,W=L.length;O<W;O++)L[O]=0}function p(L){m(L,0)}function m(L,O){const W=s.newAttributes,q=s.enabledAttributes,U=s.attributeDivisors;W[L]=1,q[L]===0&&(r.enableVertexAttribArray(L),q[L]=1),U[L]!==O&&(r.vertexAttribDivisor(L,O),U[L]=O)}function x(){const L=s.newAttributes,O=s.enabledAttributes;for(let W=0,q=O.length;W<q;W++)O[W]!==L[W]&&(r.disableVertexAttribArray(W),O[W]=0)}function M(L,O,W,q,U,V,k){k===!0?r.vertexAttribIPointer(L,O,W,U,V):r.vertexAttribPointer(L,O,W,q,U,V)}function S(L,O,W,q){y();const U=q.attributes,V=W.getAttributes(),k=O.defaultAttributeValues;for(const et in V){const nt=V[et];if(nt.location>=0){let pt=U[et];if(pt===void 0&&(et==="instanceMatrix"&&L.instanceMatrix&&(pt=L.instanceMatrix),et==="instanceColor"&&L.instanceColor&&(pt=L.instanceColor)),pt!==void 0){const St=pt.normalized,At=pt.itemSize,$t=t.get(pt);if($t===void 0)continue;const ne=$t.buffer,Vt=$t.type,J=$t.bytesPerElement,gt=Vt===r.INT||Vt===r.UNSIGNED_INT||pt.gpuType===Qo;if(pt.isInterleavedBufferAttribute){const at=pt.data,Pt=at.stride,Ot=pt.offset;if(at.isInstancedInterleavedBuffer){for(let Ut=0;Ut<nt.locationSize;Ut++)m(nt.location+Ut,at.meshPerAttribute);L.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=at.meshPerAttribute*at.count)}else for(let Ut=0;Ut<nt.locationSize;Ut++)p(nt.location+Ut);r.bindBuffer(r.ARRAY_BUFFER,ne);for(let Ut=0;Ut<nt.locationSize;Ut++)M(nt.location+Ut,At/nt.locationSize,Vt,St,Pt*J,(Ot+At/nt.locationSize*Ut)*J,gt)}else{if(pt.isInstancedBufferAttribute){for(let at=0;at<nt.locationSize;at++)m(nt.location+at,pt.meshPerAttribute);L.isInstancedMesh!==!0&&q._maxInstanceCount===void 0&&(q._maxInstanceCount=pt.meshPerAttribute*pt.count)}else for(let at=0;at<nt.locationSize;at++)p(nt.location+at);r.bindBuffer(r.ARRAY_BUFFER,ne);for(let at=0;at<nt.locationSize;at++)M(nt.location+at,At/nt.locationSize,Vt,St,At*J,At/nt.locationSize*at*J,gt)}}else if(k!==void 0){const St=k[et];if(St!==void 0)switch(St.length){case 2:r.vertexAttrib2fv(nt.location,St);break;case 3:r.vertexAttrib3fv(nt.location,St);break;case 4:r.vertexAttrib4fv(nt.location,St);break;default:r.vertexAttrib1fv(nt.location,St)}}}}x()}function C(){A();for(const L in n){const O=n[L];for(const W in O){const q=O[W];for(const U in q){const V=q[U];for(const k in V)d(V[k].object),delete V[k];delete q[U]}}delete n[L]}}function w(L){if(n[L.id]===void 0)return;const O=n[L.id];for(const W in O){const q=O[W];for(const U in q){const V=q[U];for(const k in V)d(V[k].object),delete V[k];delete q[U]}}delete n[L.id]}function R(L){for(const O in n){const W=n[O];for(const q in W){const U=W[q];if(U[L.id]===void 0)continue;const V=U[L.id];for(const k in V)d(V[k].object),delete V[k];delete U[L.id]}}}function v(L){for(const O in n){const W=n[O],q=L.isInstancedMesh===!0?L.id:0,U=W[q];if(U!==void 0){for(const V in U){const k=U[V];for(const et in k)d(k[et].object),delete k[et];delete U[V]}delete W[q],Object.keys(W).length===0&&delete n[O]}}}function A(){D(),o=!0,s!==i&&(s=i,c(s.object))}function D(){i.geometry=null,i.program=null,i.wireframe=!1}return{setup:a,reset:A,resetDefaultState:D,dispose:C,releaseStatesOfGeometry:w,releaseStatesOfObject:v,releaseStatesOfProgram:R,initAttributes:y,enableAttribute:p,disableUnusedAttributes:x}}function Wp(r,t,e){let n;function i(l){n=l}function s(l,c){r.drawArrays(n,l,c),e.update(c,n,1)}function o(l,c,d){d!==0&&(r.drawArraysInstanced(n,l,c,d),e.update(c,n,d))}function a(l,c,d){if(d===0)return;t.get("WEBGL_multi_draw").multiDrawArraysWEBGL(n,l,0,c,0,d);let h=0;for(let f=0;f<d;f++)h+=c[f];e.update(h,n,1)}this.setMode=i,this.render=s,this.renderInstances=o,this.renderMultiDraw=a}function Xp(r,t,e,n){let i;function s(){if(i!==void 0)return i;if(t.has("EXT_texture_filter_anisotropic")===!0){const R=t.get("EXT_texture_filter_anisotropic");i=r.getParameter(R.MAX_TEXTURE_MAX_ANISOTROPY_EXT)}else i=0;return i}function o(R){return!(R!==Je&&n.convert(R)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_FORMAT))}function a(R){const v=R===Cn&&(t.has("EXT_color_buffer_half_float")||t.has("EXT_color_buffer_float"));return!(R!==ze&&n.convert(R)!==r.getParameter(r.IMPLEMENTATION_COLOR_READ_TYPE)&&R!==nn&&!v)}function l(R){if(R==="highp"){if(r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.HIGH_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.HIGH_FLOAT).precision>0)return"highp";R="mediump"}return R==="mediump"&&r.getShaderPrecisionFormat(r.VERTEX_SHADER,r.MEDIUM_FLOAT).precision>0&&r.getShaderPrecisionFormat(r.FRAGMENT_SHADER,r.MEDIUM_FLOAT).precision>0?"mediump":"lowp"}let c=e.precision!==void 0?e.precision:"highp";const d=l(c);d!==c&&(Bt("WebGLRenderer:",c,"not supported, using",d,"instead."),c=d);const u=e.logarithmicDepthBuffer===!0,h=e.reversedDepthBuffer===!0&&t.has("EXT_clip_control");e.reversedDepthBuffer===!0&&h===!1&&Bt("WebGLRenderer: Unable to use reversed depth buffer due to missing EXT_clip_control extension. Fallback to default depth buffer.");const f=r.getParameter(r.MAX_TEXTURE_IMAGE_UNITS),g=r.getParameter(r.MAX_VERTEX_TEXTURE_IMAGE_UNITS),y=r.getParameter(r.MAX_TEXTURE_SIZE),p=r.getParameter(r.MAX_CUBE_MAP_TEXTURE_SIZE),m=r.getParameter(r.MAX_VERTEX_ATTRIBS),x=r.getParameter(r.MAX_VERTEX_UNIFORM_VECTORS),M=r.getParameter(r.MAX_VARYING_VECTORS),S=r.getParameter(r.MAX_FRAGMENT_UNIFORM_VECTORS),C=r.getParameter(r.MAX_SAMPLES),w=r.getParameter(r.SAMPLES);return{isWebGL2:!0,getMaxAnisotropy:s,getMaxPrecision:l,textureFormatReadable:o,textureTypeReadable:a,precision:c,logarithmicDepthBuffer:u,reversedDepthBuffer:h,maxTextures:f,maxVertexTextures:g,maxTextureSize:y,maxCubemapSize:p,maxAttributes:m,maxVertexUniforms:x,maxVaryings:M,maxFragmentUniforms:S,maxSamples:C,samples:w}}function qp(r){const t=this;let e=null,n=0,i=!1,s=!1;const o=new Kn,a=new Xt,l={value:null,needsUpdate:!1};this.uniform=l,this.numPlanes=0,this.numIntersection=0,this.init=function(u,h){const f=u.length!==0||h||n!==0||i;return i=h,n=u.length,f},this.beginShadows=function(){s=!0,d(null)},this.endShadows=function(){s=!1},this.setGlobalState=function(u,h){e=d(u,h,0)},this.setState=function(u,h,f){const g=u.clippingPlanes,y=u.clipIntersection,p=u.clipShadows,m=r.get(u);if(!i||g===null||g.length===0||s&&!p)s?d(null):c();else{const x=s?0:n,M=x*4;let S=m.clippingState||null;l.value=S,S=d(g,h,M,f);for(let C=0;C!==M;++C)S[C]=e[C];m.clippingState=S,this.numIntersection=y?this.numPlanes:0,this.numPlanes+=x}};function c(){l.value!==e&&(l.value=e,l.needsUpdate=n>0),t.numPlanes=n,t.numIntersection=0}function d(u,h,f,g){const y=u!==null?u.length:0;let p=null;if(y!==0){if(p=l.value,g!==!0||p===null){const m=f+y*4,x=h.matrixWorldInverse;a.getNormalMatrix(x),(p===null||p.length<m)&&(p=new Float32Array(m));for(let M=0,S=f;M!==y;++M,S+=4)o.copy(u[M]).applyMatrix4(x,a),o.normal.toArray(p,S),p[S+3]=o.constant}l.value=p,l.needsUpdate=!0}return t.numPlanes=y,t.numIntersection=0,p}}const Gn=4,Sl=[.125,.215,.35,.446,.526,.582],Zn=20,Yp=256,Vi=new rr,yl=new yt;let Gr=null,Vr=0,Hr=0,Wr=!1;const $p=new E;class bl{constructor(t){this._renderer=t,this._pingPongRenderTarget=null,this._lodMax=0,this._cubeSize=0,this._sizeLods=[],this._sigmas=[],this._lodMeshes=[],this._backgroundBox=null,this._cubemapMaterial=null,this._equirectMaterial=null,this._blurMaterial=null,this._ggxMaterial=null}fromScene(t,e=0,n=.1,i=100,s={}){const{size:o=256,position:a=$p}=s;Gr=this._renderer.getRenderTarget(),Vr=this._renderer.getActiveCubeFace(),Hr=this._renderer.getActiveMipmapLevel(),Wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1,this._setSize(o);const l=this._allocateTargets();return l.depthBuffer=!0,this._sceneToCubeUV(t,n,i,l,a),e>0&&this._blur(l,0,0,e),this._applyPMREM(l),this._cleanup(l),l}fromEquirectangular(t,e=null){return this._fromTexture(t,e)}fromCubemap(t,e=null){return this._fromTexture(t,e)}compileCubemapShader(){this._cubemapMaterial===null&&(this._cubemapMaterial=wl(),this._compileMaterial(this._cubemapMaterial))}compileEquirectangularShader(){this._equirectMaterial===null&&(this._equirectMaterial=Tl(),this._compileMaterial(this._equirectMaterial))}dispose(){this._dispose(),this._cubemapMaterial!==null&&this._cubemapMaterial.dispose(),this._equirectMaterial!==null&&this._equirectMaterial.dispose(),this._backgroundBox!==null&&(this._backgroundBox.geometry.dispose(),this._backgroundBox.material.dispose())}_setSize(t){this._lodMax=Math.floor(Math.log2(t)),this._cubeSize=Math.pow(2,this._lodMax)}_dispose(){this._blurMaterial!==null&&this._blurMaterial.dispose(),this._ggxMaterial!==null&&this._ggxMaterial.dispose(),this._pingPongRenderTarget!==null&&this._pingPongRenderTarget.dispose();for(let t=0;t<this._lodMeshes.length;t++)this._lodMeshes[t].geometry.dispose()}_cleanup(t){this._renderer.setRenderTarget(Gr,Vr,Hr),this._renderer.xr.enabled=Wr,t.scissorTest=!1,Si(t,0,0,t.width,t.height)}_fromTexture(t,e){t.mapping===ti||t.mapping===wi?this._setSize(t.image.length===0?16:t.image[0].width||t.image[0].image.width):this._setSize(t.image.width/4),Gr=this._renderer.getRenderTarget(),Vr=this._renderer.getActiveCubeFace(),Hr=this._renderer.getActiveMipmapLevel(),Wr=this._renderer.xr.enabled,this._renderer.xr.enabled=!1;const n=e||this._allocateTargets();return this._textureToCubeUV(t,n),this._applyPMREM(n),this._cleanup(n),n}_allocateTargets(){const t=3*Math.max(this._cubeSize,112),e=4*this._cubeSize,n={magFilter:Ne,minFilter:Ne,generateMipmaps:!1,type:Cn,format:Je,colorSpace:Zs,depthBuffer:!1},i=El(t,e,n);if(this._pingPongRenderTarget===null||this._pingPongRenderTarget.width!==t||this._pingPongRenderTarget.height!==e){this._pingPongRenderTarget!==null&&this._dispose(),this._pingPongRenderTarget=El(t,e,n);const{_lodMax:s}=this;({lodMeshes:this._lodMeshes,sizeLods:this._sizeLods,sigmas:this._sigmas}=Kp(s)),this._blurMaterial=Zp(s,t,e),this._ggxMaterial=Jp(s,t,e)}return i}_compileMaterial(t){const e=new Ft(new Ae,t);this._renderer.compile(e,Vi)}_sceneToCubeUV(t,e,n,i,s){const l=new qe(90,1,e,n),c=[1,-1,1,1,1,1],d=[1,1,1,-1,-1,-1],u=this._renderer,h=u.autoClear,f=u.toneMapping;u.getClearColor(yl),u.toneMapping=fn,u.autoClear=!1,u.state.buffers.depth.getReversed()&&(u.setRenderTarget(i),u.clearDepth(),u.setRenderTarget(null)),this._backgroundBox===null&&(this._backgroundBox=new Ft(new pe,new ha({name:"PMREM.Background",side:Ge,depthWrite:!1,depthTest:!1})));const y=this._backgroundBox,p=y.material;let m=!1;const x=t.background;x?x.isColor&&(p.color.copy(x),t.background=null,m=!0):(p.color.copy(yl),m=!0);for(let M=0;M<6;M++){const S=M%3;S===0?(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x+d[M],s.y,s.z)):S===1?(l.up.set(0,0,c[M]),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y+d[M],s.z)):(l.up.set(0,c[M],0),l.position.set(s.x,s.y,s.z),l.lookAt(s.x,s.y,s.z+d[M]));const C=this._cubeSize;Si(i,S*C,M>2?C:0,C,C),u.setRenderTarget(i),m&&u.render(y,l),u.render(t,l)}u.toneMapping=f,u.autoClear=h,t.background=x}_textureToCubeUV(t,e){const n=this._renderer,i=t.mapping===ti||t.mapping===wi;i?(this._cubemapMaterial===null&&(this._cubemapMaterial=wl()),this._cubemapMaterial.uniforms.flipEnvMap.value=t.isRenderTargetTexture===!1?-1:1):this._equirectMaterial===null&&(this._equirectMaterial=Tl());const s=i?this._cubemapMaterial:this._equirectMaterial,o=this._lodMeshes[0];o.material=s;const a=s.uniforms;a.envMap.value=t;const l=this._cubeSize;Si(e,0,0,3*l,2*l),n.setRenderTarget(e),n.render(o,Vi)}_applyPMREM(t){const e=this._renderer,n=e.autoClear;e.autoClear=!1;const i=this._lodMeshes.length;for(let s=1;s<i;s++)this._applyGGXFilter(t,s-1,s);e.autoClear=n}_applyGGXFilter(t,e,n){const i=this._renderer,s=this._pingPongRenderTarget,o=this._ggxMaterial,a=this._lodMeshes[n];a.material=o;const l=o.uniforms,c=n/(this._lodMeshes.length-1),d=e/(this._lodMeshes.length-1),u=Math.sqrt(c*c-d*d),h=0+c*1.25,f=u*h,{_lodMax:g}=this,y=this._sizeLods[n],p=3*y*(n>g-Gn?n-g+Gn:0),m=4*(this._cubeSize-y);l.envMap.value=t.texture,l.roughness.value=f,l.mipInt.value=g-e,Si(s,p,m,3*y,2*y),i.setRenderTarget(s),i.render(a,Vi),l.envMap.value=s.texture,l.roughness.value=0,l.mipInt.value=g-n,Si(t,p,m,3*y,2*y),i.setRenderTarget(t),i.render(a,Vi)}_blur(t,e,n,i,s){const o=this._pingPongRenderTarget;this._halfBlur(t,o,e,n,i,"latitudinal",s),this._halfBlur(o,t,n,n,i,"longitudinal",s)}_halfBlur(t,e,n,i,s,o,a){const l=this._renderer,c=this._blurMaterial;o!=="latitudinal"&&o!=="longitudinal"&&ee("blur direction must be either latitudinal or longitudinal!");const d=3,u=this._lodMeshes[i];u.material=c;const h=c.uniforms,f=this._sizeLods[n]-1,g=isFinite(s)?Math.PI/(2*f):2*Math.PI/(2*Zn-1),y=s/g,p=isFinite(s)?1+Math.floor(d*y):Zn;p>Zn&&Bt(`sigmaRadians, ${s}, is too large and will clip, as it requested ${p} samples when the maximum is set to ${Zn}`);const m=[];let x=0;for(let R=0;R<Zn;++R){const v=R/y,A=Math.exp(-v*v/2);m.push(A),R===0?x+=A:R<p&&(x+=2*A)}for(let R=0;R<m.length;R++)m[R]=m[R]/x;h.envMap.value=t.texture,h.samples.value=p,h.weights.value=m,h.latitudinal.value=o==="latitudinal",a&&(h.poleAxis.value=a);const{_lodMax:M}=this;h.dTheta.value=g,h.mipInt.value=M-n;const S=this._sizeLods[i],C=3*S*(i>M-Gn?i-M+Gn:0),w=4*(this._cubeSize-S);Si(e,C,w,3*S,2*S),l.setRenderTarget(e),l.render(u,Vi)}}function Kp(r){const t=[],e=[],n=[];let i=r;const s=r-Gn+1+Sl.length;for(let o=0;o<s;o++){const a=Math.pow(2,i);t.push(a);let l=1/a;o>r-Gn?l=Sl[o-r+Gn-1]:o===0&&(l=0),e.push(l);const c=1/(a-2),d=-c,u=1+c,h=[d,d,u,d,u,u,d,d,u,u,d,u],f=6,g=6,y=3,p=2,m=1,x=new Float32Array(y*g*f),M=new Float32Array(p*g*f),S=new Float32Array(m*g*f);for(let w=0;w<f;w++){const R=w%3*2/3-1,v=w>2?0:-1,A=[R,v,0,R+2/3,v,0,R+2/3,v+1,0,R,v,0,R+2/3,v+1,0,R,v+1,0];x.set(A,y*g*w),M.set(h,p*g*w);const D=[w,w,w,w,w,w];S.set(D,m*g*w)}const C=new Ae;C.setAttribute("position",new Fe(x,y)),C.setAttribute("uv",new Fe(M,p)),C.setAttribute("faceIndex",new Fe(S,m)),n.push(new Ft(C,null)),i>Gn&&i--}return{lodMeshes:n,sizeLods:t,sigmas:e}}function El(r,t,e){const n=new sn(r,t,e);return n.texture.mapping=er,n.texture.name="PMREM.cubeUv",n.scissorTest=!0,n}function Si(r,t,e,n,i){r.viewport.set(t,e,n,i),r.scissor.set(t,e,n,i)}function Jp(r,t,e){return new mn({name:"PMREMGGXConvolution",defines:{GGX_SAMPLES:Yp,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},roughness:{value:0},mipInt:{value:0}},vertexShader:or(),fragmentShader:`

			precision highp float;
			precision highp int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform float roughness;
			uniform float mipInt;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			#define PI 3.14159265359

			// Van der Corput radical inverse
			float radicalInverse_VdC(uint bits) {
				bits = (bits << 16u) | (bits >> 16u);
				bits = ((bits & 0x55555555u) << 1u) | ((bits & 0xAAAAAAAAu) >> 1u);
				bits = ((bits & 0x33333333u) << 2u) | ((bits & 0xCCCCCCCCu) >> 2u);
				bits = ((bits & 0x0F0F0F0Fu) << 4u) | ((bits & 0xF0F0F0F0u) >> 4u);
				bits = ((bits & 0x00FF00FFu) << 8u) | ((bits & 0xFF00FF00u) >> 8u);
				return float(bits) * 2.3283064365386963e-10; // / 0x100000000
			}

			// Hammersley sequence
			vec2 hammersley(uint i, uint N) {
				return vec2(float(i) / float(N), radicalInverse_VdC(i));
			}

			// GGX VNDF importance sampling (Eric Heitz 2018)
			// "Sampling the GGX Distribution of Visible Normals"
			// https://jcgt.org/published/0007/04/01/
			vec3 importanceSampleGGX_VNDF(vec2 Xi, vec3 V, float roughness) {
				float alpha = roughness * roughness;

				// Section 4.1: Orthonormal basis
				vec3 T1 = vec3(1.0, 0.0, 0.0);
				vec3 T2 = cross(V, T1);

				// Section 4.2: Parameterization of projected area
				float r = sqrt(Xi.x);
				float phi = 2.0 * PI * Xi.y;
				float t1 = r * cos(phi);
				float t2 = r * sin(phi);
				float s = 0.5 * (1.0 + V.z);
				t2 = (1.0 - s) * sqrt(1.0 - t1 * t1) + s * t2;

				// Section 4.3: Reprojection onto hemisphere
				vec3 Nh = t1 * T1 + t2 * T2 + sqrt(max(0.0, 1.0 - t1 * t1 - t2 * t2)) * V;

				// Section 3.4: Transform back to ellipsoid configuration
				return normalize(vec3(alpha * Nh.x, alpha * Nh.y, max(0.0, Nh.z)));
			}

			void main() {
				vec3 N = normalize(vOutputDirection);
				vec3 V = N; // Assume view direction equals normal for pre-filtering

				vec3 prefilteredColor = vec3(0.0);
				float totalWeight = 0.0;

				// For very low roughness, just sample the environment directly
				if (roughness < 0.001) {
					gl_FragColor = vec4(bilinearCubeUV(envMap, N, mipInt), 1.0);
					return;
				}

				// Tangent space basis for VNDF sampling
				vec3 up = abs(N.z) < 0.999 ? vec3(0.0, 0.0, 1.0) : vec3(1.0, 0.0, 0.0);
				vec3 tangent = normalize(cross(up, N));
				vec3 bitangent = cross(N, tangent);

				for(uint i = 0u; i < uint(GGX_SAMPLES); i++) {
					vec2 Xi = hammersley(i, uint(GGX_SAMPLES));

					// For PMREM, V = N, so in tangent space V is always (0, 0, 1)
					vec3 H_tangent = importanceSampleGGX_VNDF(Xi, vec3(0.0, 0.0, 1.0), roughness);

					// Transform H back to world space
					vec3 H = normalize(tangent * H_tangent.x + bitangent * H_tangent.y + N * H_tangent.z);
					vec3 L = normalize(2.0 * dot(V, H) * H - V);

					float NdotL = max(dot(N, L), 0.0);

					if(NdotL > 0.0) {
						// Sample environment at fixed mip level
						// VNDF importance sampling handles the distribution filtering
						vec3 sampleColor = bilinearCubeUV(envMap, L, mipInt);

						// Weight by NdotL for the split-sum approximation
						// VNDF PDF naturally accounts for the visible microfacet distribution
						prefilteredColor += sampleColor * NdotL;
						totalWeight += NdotL;
					}
				}

				if (totalWeight > 0.0) {
					prefilteredColor = prefilteredColor / totalWeight;
				}

				gl_FragColor = vec4(prefilteredColor, 1.0);
			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function Zp(r,t,e){const n=new Float32Array(Zn),i=new E(0,1,0);return new mn({name:"SphericalGaussianBlur",defines:{n:Zn,CUBEUV_TEXEL_WIDTH:1/t,CUBEUV_TEXEL_HEIGHT:1/e,CUBEUV_MAX_MIP:`${r}.0`},uniforms:{envMap:{value:null},samples:{value:1},weights:{value:n},latitudinal:{value:!1},dTheta:{value:0},mipInt:{value:0},poleAxis:{value:i}},vertexShader:or(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;
			uniform int samples;
			uniform float weights[ n ];
			uniform bool latitudinal;
			uniform float dTheta;
			uniform float mipInt;
			uniform vec3 poleAxis;

			#define ENVMAP_TYPE_CUBE_UV
			#include <cube_uv_reflection_fragment>

			vec3 getSample( float theta, vec3 axis ) {

				float cosTheta = cos( theta );
				// Rodrigues' axis-angle rotation
				vec3 sampleDirection = vOutputDirection * cosTheta
					+ cross( axis, vOutputDirection ) * sin( theta )
					+ axis * dot( axis, vOutputDirection ) * ( 1.0 - cosTheta );

				return bilinearCubeUV( envMap, sampleDirection, mipInt );

			}

			void main() {

				vec3 axis = latitudinal ? poleAxis : cross( poleAxis, vOutputDirection );

				if ( all( equal( axis, vec3( 0.0 ) ) ) ) {

					axis = vec3( vOutputDirection.z, 0.0, - vOutputDirection.x );

				}

				axis = normalize( axis );

				gl_FragColor = vec4( 0.0, 0.0, 0.0, 1.0 );
				gl_FragColor.rgb += weights[ 0 ] * getSample( 0.0, axis );

				for ( int i = 1; i < n; i++ ) {

					if ( i >= samples ) {

						break;

					}

					float theta = dTheta * float( i );
					gl_FragColor.rgb += weights[ i ] * getSample( -1.0 * theta, axis );
					gl_FragColor.rgb += weights[ i ] * getSample( theta, axis );

				}

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function Tl(){return new mn({name:"EquirectangularToCubeUV",uniforms:{envMap:{value:null}},vertexShader:or(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			varying vec3 vOutputDirection;

			uniform sampler2D envMap;

			#include <common>

			void main() {

				vec3 outputDirection = normalize( vOutputDirection );
				vec2 uv = equirectUv( outputDirection );

				gl_FragColor = vec4( texture2D ( envMap, uv ).rgb, 1.0 );

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function wl(){return new mn({name:"CubemapToCubeUV",uniforms:{envMap:{value:null},flipEnvMap:{value:-1}},vertexShader:or(),fragmentShader:`

			precision mediump float;
			precision mediump int;

			uniform float flipEnvMap;

			varying vec3 vOutputDirection;

			uniform samplerCube envMap;

			void main() {

				gl_FragColor = textureCube( envMap, vec3( flipEnvMap * vOutputDirection.x, vOutputDirection.yz ) );

			}
		`,blending:Tn,depthTest:!1,depthWrite:!1})}function or(){return`

		precision mediump float;
		precision mediump int;

		attribute float faceIndex;

		varying vec3 vOutputDirection;

		// RH coordinate system; PMREM face-indexing convention
		vec3 getDirection( vec2 uv, float face ) {

			uv = 2.0 * uv - 1.0;

			vec3 direction = vec3( uv, 1.0 );

			if ( face == 0.0 ) {

				direction = direction.zyx; // ( 1, v, u ) pos x

			} else if ( face == 1.0 ) {

				direction = direction.xzy;
				direction.xz *= -1.0; // ( -u, 1, -v ) pos y

			} else if ( face == 2.0 ) {

				direction.x *= -1.0; // ( -u, v, 1 ) pos z

			} else if ( face == 3.0 ) {

				direction = direction.zyx;
				direction.xz *= -1.0; // ( -1, v, -u ) neg x

			} else if ( face == 4.0 ) {

				direction = direction.xzy;
				direction.xy *= -1.0; // ( -u, -1, v ) neg y

			} else if ( face == 5.0 ) {

				direction.z *= -1.0; // ( u, v, -1 ) neg z

			}

			return direction;

		}

		void main() {

			vOutputDirection = getDirection( uv, faceIndex );
			gl_Position = vec4( position, 1.0 );

		}
	`}class Xc extends sn{constructor(t=1,e={}){super(t,t,e),this.isWebGLCubeRenderTarget=!0;const n={width:t,height:t,depth:1},i=[n,n,n,n,n,n];this.texture=new Rc(i),this._setTextureOptions(e),this.texture.isRenderTargetTexture=!0}fromEquirectangularTexture(t,e){this.texture.type=e.type,this.texture.colorSpace=e.colorSpace,this.texture.generateMipmaps=e.generateMipmaps,this.texture.minFilter=e.minFilter,this.texture.magFilter=e.magFilter;const n={uniforms:{tEquirect:{value:null}},vertexShader:`

				varying vec3 vWorldDirection;

				vec3 transformDirection( in vec3 dir, in mat4 matrix ) {

					return normalize( ( matrix * vec4( dir, 0.0 ) ).xyz );

				}

				void main() {

					vWorldDirection = transformDirection( position, modelMatrix );

					#include <begin_vertex>
					#include <project_vertex>

				}
			`,fragmentShader:`

				uniform sampler2D tEquirect;

				varying vec3 vWorldDirection;

				#include <common>

				void main() {

					vec3 direction = normalize( vWorldDirection );

					vec2 sampleUV = equirectUv( direction );

					gl_FragColor = texture2D( tEquirect, sampleUV );

				}
			`},i=new pe(5,5,5),s=new mn({name:"CubemapFromEquirect",uniforms:Ri(n.uniforms),vertexShader:n.vertexShader,fragmentShader:n.fragmentShader,side:Ge,blending:Tn});s.uniforms.tEquirect.value=e;const o=new Ft(i,s),a=e.minFilter;return e.minFilter===jn&&(e.minFilter=Ne),new nu(1,10,this).update(t,o),e.minFilter=a,o.geometry.dispose(),o.material.dispose(),this}clear(t,e=!0,n=!0,i=!0){const s=t.getRenderTarget();for(let o=0;o<6;o++)t.setRenderTarget(this,o),t.clear(e,n,i);t.setRenderTarget(s)}}function jp(r){let t=new WeakMap,e=new WeakMap,n=null;function i(h,f=!1){return h==null?null:f?o(h):s(h)}function s(h){if(h&&h.isTexture){const f=h.mapping;if(f===hr||f===dr)if(t.has(h)){const g=t.get(h).texture;return a(g,h.mapping)}else{const g=h.image;if(g&&g.height>0){const y=new Xc(g.height);return y.fromEquirectangularTexture(r,h),t.set(h,y),h.addEventListener("dispose",c),a(y.texture,h.mapping)}else return null}}return h}function o(h){if(h&&h.isTexture){const f=h.mapping,g=f===hr||f===dr,y=f===ti||f===wi;if(g||y){let p=e.get(h);const m=p!==void 0?p.texture.pmremVersion:0;if(h.isRenderTargetTexture&&h.pmremVersion!==m)return n===null&&(n=new bl(r)),p=g?n.fromEquirectangular(h,p):n.fromCubemap(h,p),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),p.texture;if(p!==void 0)return p.texture;{const x=h.image;return g&&x&&x.height>0||y&&x&&l(x)?(n===null&&(n=new bl(r)),p=g?n.fromEquirectangular(h):n.fromCubemap(h),p.texture.pmremVersion=h.pmremVersion,e.set(h,p),h.addEventListener("dispose",d),p.texture):null}}}return h}function a(h,f){return f===hr?h.mapping=ti:f===dr&&(h.mapping=wi),h}function l(h){let f=0;const g=6;for(let y=0;y<g;y++)h[y]!==void 0&&f++;return f===g}function c(h){const f=h.target;f.removeEventListener("dispose",c);const g=t.get(f);g!==void 0&&(t.delete(f),g.dispose())}function d(h){const f=h.target;f.removeEventListener("dispose",d);const g=e.get(f);g!==void 0&&(e.delete(f),g.dispose())}function u(){t=new WeakMap,e=new WeakMap,n!==null&&(n.dispose(),n=null)}return{get:i,dispose:u}}function Qp(r){const t={};function e(n){if(t[n]!==void 0)return t[n];const i=r.getExtension(n);return t[n]=i,i}return{has:function(n){return e(n)!==null},init:function(){e("EXT_color_buffer_float"),e("WEBGL_clip_cull_distance"),e("OES_texture_float_linear"),e("EXT_color_buffer_half_float"),e("WEBGL_multisampled_render_to_texture"),e("WEBGL_render_shared_exponent")},get:function(n){const i=e(n);return i===null&&Ho("WebGLRenderer: "+n+" extension not supported."),i}}}function tm(r,t,e,n){const i={},s=new WeakMap;function o(u){const h=u.target;h.index!==null&&t.remove(h.index);for(const g in h.attributes)t.remove(h.attributes[g]);h.removeEventListener("dispose",o),delete i[h.id];const f=s.get(h);f&&(t.remove(f),s.delete(h)),n.releaseStatesOfGeometry(h),h.isInstancedBufferGeometry===!0&&delete h._maxInstanceCount,e.memory.geometries--}function a(u,h){return i[h.id]===!0||(h.addEventListener("dispose",o),i[h.id]=!0,e.memory.geometries++),h}function l(u){const h=u.attributes;for(const f in h)t.update(h[f],r.ARRAY_BUFFER)}function c(u){const h=[],f=u.index,g=u.attributes.position;let y=0;if(g===void 0)return;if(f!==null){const x=f.array;y=f.version;for(let M=0,S=x.length;M<S;M+=3){const C=x[M+0],w=x[M+1],R=x[M+2];h.push(C,w,w,R,R,C)}}else{const x=g.array;y=g.version;for(let M=0,S=x.length/3-1;M<S;M+=3){const C=M+0,w=M+1,R=M+2;h.push(C,w,w,R,R,C)}}const p=new(g.count>=65535?wc:Tc)(h,1);p.version=y;const m=s.get(u);m&&t.remove(m),s.set(u,p)}function d(u){const h=s.get(u);if(h){const f=u.index;f!==null&&h.version<f.version&&c(u)}else c(u);return s.get(u)}return{get:a,update:l,getWireframeAttribute:d}}function em(r,t,e){let n;function i(u){n=u}let s,o;function a(u){s=u.type,o=u.bytesPerElement}function l(u,h){r.drawElements(n,h,s,u*o),e.update(h,n,1)}function c(u,h,f){f!==0&&(r.drawElementsInstanced(n,h,s,u*o,f),e.update(h,n,f))}function d(u,h,f){if(f===0)return;t.get("WEBGL_multi_draw").multiDrawElementsWEBGL(n,h,0,s,u,0,f);let y=0;for(let p=0;p<f;p++)y+=h[p];e.update(y,n,1)}this.setMode=i,this.setIndex=a,this.render=l,this.renderInstances=c,this.renderMultiDraw=d}function nm(r){const t={geometries:0,textures:0},e={frame:0,calls:0,triangles:0,points:0,lines:0};function n(s,o,a){switch(e.calls++,o){case r.TRIANGLES:e.triangles+=a*(s/3);break;case r.LINES:e.lines+=a*(s/2);break;case r.LINE_STRIP:e.lines+=a*(s-1);break;case r.LINE_LOOP:e.lines+=a*s;break;case r.POINTS:e.points+=a*s;break;default:ee("WebGLInfo: Unknown draw mode:",o);break}}function i(){e.calls=0,e.triangles=0,e.points=0,e.lines=0}return{memory:t,render:e,programs:null,autoReset:!0,reset:i,update:n}}function im(r,t,e){const n=new WeakMap,i=new xe;function s(o,a,l){const c=o.morphTargetInfluences,d=a.morphAttributes.position||a.morphAttributes.normal||a.morphAttributes.color,u=d!==void 0?d.length:0;let h=n.get(a);if(h===void 0||h.count!==u){let D=function(){v.dispose(),n.delete(a),a.removeEventListener("dispose",D)};var f=D;h!==void 0&&h.texture.dispose();const g=a.morphAttributes.position!==void 0,y=a.morphAttributes.normal!==void 0,p=a.morphAttributes.color!==void 0,m=a.morphAttributes.position||[],x=a.morphAttributes.normal||[],M=a.morphAttributes.color||[];let S=0;g===!0&&(S=1),y===!0&&(S=2),p===!0&&(S=3);let C=a.attributes.position.count*S,w=1;C>t.maxTextureSize&&(w=Math.ceil(C/t.maxTextureSize),C=t.maxTextureSize);const R=new Float32Array(C*w*4*u),v=new yc(R,C,w,u);v.type=nn,v.needsUpdate=!0;const A=S*4;for(let L=0;L<u;L++){const O=m[L],W=x[L],q=M[L],U=C*w*4*L;for(let V=0;V<O.count;V++){const k=V*A;g===!0&&(i.fromBufferAttribute(O,V),R[U+k+0]=i.x,R[U+k+1]=i.y,R[U+k+2]=i.z,R[U+k+3]=0),y===!0&&(i.fromBufferAttribute(W,V),R[U+k+4]=i.x,R[U+k+5]=i.y,R[U+k+6]=i.z,R[U+k+7]=0),p===!0&&(i.fromBufferAttribute(q,V),R[U+k+8]=i.x,R[U+k+9]=i.y,R[U+k+10]=i.z,R[U+k+11]=q.itemSize===4?i.w:1)}}h={count:u,texture:v,size:new ot(C,w)},n.set(a,h),a.addEventListener("dispose",D)}if(o.isInstancedMesh===!0&&o.morphTexture!==null)l.getUniforms().setValue(r,"morphTexture",o.morphTexture,e);else{let g=0;for(let p=0;p<c.length;p++)g+=c[p];const y=a.morphTargetsRelative?1:1-g;l.getUniforms().setValue(r,"morphTargetBaseInfluence",y),l.getUniforms().setValue(r,"morphTargetInfluences",c)}l.getUniforms().setValue(r,"morphTargetsTexture",h.texture,e),l.getUniforms().setValue(r,"morphTargetsTextureSize",h.size)}return{update:s}}function sm(r,t,e,n,i){let s=new WeakMap;function o(c){const d=i.render.frame,u=c.geometry,h=t.get(c,u);if(s.get(h)!==d&&(t.update(h),s.set(h,d)),c.isInstancedMesh&&(c.hasEventListener("dispose",l)===!1&&c.addEventListener("dispose",l),s.get(c)!==d&&(e.update(c.instanceMatrix,r.ARRAY_BUFFER),c.instanceColor!==null&&e.update(c.instanceColor,r.ARRAY_BUFFER),s.set(c,d))),c.isSkinnedMesh){const f=c.skeleton;s.get(f)!==d&&(f.update(),s.set(f,d))}return h}function a(){s=new WeakMap}function l(c){const d=c.target;d.removeEventListener("dispose",l),n.releaseStatesOfObject(d),e.remove(d.instanceMatrix),d.instanceColor!==null&&e.remove(d.instanceColor)}return{update:o,dispose:a}}const rm={[lc]:"LINEAR_TONE_MAPPING",[cc]:"REINHARD_TONE_MAPPING",[hc]:"CINEON_TONE_MAPPING",[jo]:"ACES_FILMIC_TONE_MAPPING",[uc]:"AGX_TONE_MAPPING",[fc]:"NEUTRAL_TONE_MAPPING",[dc]:"CUSTOM_TONE_MAPPING"};function om(r,t,e,n,i){const s=new sn(t,e,{type:r,depthBuffer:n,stencilBuffer:i,depthTexture:n?new Ai(t,e):void 0}),o=new sn(t,e,{type:Cn,depthBuffer:!1,stencilBuffer:!1}),a=new Ae;a.setAttribute("position",new fe([-1,3,0,-1,-1,0,3,-1,0],3)),a.setAttribute("uv",new fe([0,2,0,0,2,0],2));const l=new Kd({uniforms:{tDiffuse:{value:null}},vertexShader:`
			precision highp float;

			uniform mat4 modelViewMatrix;
			uniform mat4 projectionMatrix;

			attribute vec3 position;
			attribute vec2 uv;

			varying vec2 vUv;

			void main() {
				vUv = uv;
				gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );
			}`,fragmentShader:`
			precision highp float;

			uniform sampler2D tDiffuse;

			varying vec2 vUv;

			#include <tonemapping_pars_fragment>
			#include <colorspace_pars_fragment>

			void main() {
				gl_FragColor = texture2D( tDiffuse, vUv );

				#ifdef LINEAR_TONE_MAPPING
					gl_FragColor.rgb = LinearToneMapping( gl_FragColor.rgb );
				#elif defined( REINHARD_TONE_MAPPING )
					gl_FragColor.rgb = ReinhardToneMapping( gl_FragColor.rgb );
				#elif defined( CINEON_TONE_MAPPING )
					gl_FragColor.rgb = CineonToneMapping( gl_FragColor.rgb );
				#elif defined( ACES_FILMIC_TONE_MAPPING )
					gl_FragColor.rgb = ACESFilmicToneMapping( gl_FragColor.rgb );
				#elif defined( AGX_TONE_MAPPING )
					gl_FragColor.rgb = AgXToneMapping( gl_FragColor.rgb );
				#elif defined( NEUTRAL_TONE_MAPPING )
					gl_FragColor.rgb = NeutralToneMapping( gl_FragColor.rgb );
				#elif defined( CUSTOM_TONE_MAPPING )
					gl_FragColor.rgb = CustomToneMapping( gl_FragColor.rgb );
				#endif

				#ifdef SRGB_TRANSFER
					gl_FragColor = sRGBTransferOETF( gl_FragColor );
				#endif
			}`,depthTest:!1,depthWrite:!1}),c=new Ft(a,l),d=new rr(-1,1,1,-1,0,1);let u=null,h=null,f=!1,g,y=null,p=[],m=!1;this.setSize=function(x,M){s.setSize(x,M),o.setSize(x,M);for(let S=0;S<p.length;S++){const C=p[S];C.setSize&&C.setSize(x,M)}},this.setEffects=function(x){p=x,m=p.length>0&&p[0].isRenderPass===!0;const M=s.width,S=s.height;for(let C=0;C<p.length;C++){const w=p[C];w.setSize&&w.setSize(M,S)}},this.begin=function(x,M){if(f||x.toneMapping===fn&&p.length===0)return!1;if(y=M,M!==null){const S=M.width,C=M.height;(s.width!==S||s.height!==C)&&this.setSize(S,C)}return m===!1&&x.setRenderTarget(s),g=x.toneMapping,x.toneMapping=fn,!0},this.hasRenderPass=function(){return m},this.end=function(x,M){x.toneMapping=g,f=!0;let S=s,C=o;for(let w=0;w<p.length;w++){const R=p[w];if(R.enabled!==!1&&(R.render(x,C,S,M),R.needsSwap!==!1)){const v=S;S=C,C=v}}if(u!==x.outputColorSpace||h!==x.toneMapping){u=x.outputColorSpace,h=x.toneMapping,l.defines={},te.getTransfer(u)===ae&&(l.defines.SRGB_TRANSFER="");const w=rm[h];w&&(l.defines[w]=""),l.needsUpdate=!0}l.uniforms.tDiffuse.value=S.texture,x.setRenderTarget(y),x.render(c,d),y=null,f=!1},this.isCompositing=function(){return f},this.dispose=function(){s.depthTexture&&s.depthTexture.dispose(),s.dispose(),o.dispose(),a.dispose(),l.dispose()}}const qc=new Ue,Ko=new Ai(1,1),Yc=new yc,$c=new Kh,Kc=new Rc,Al=[],Cl=[],Rl=new Float32Array(16),Pl=new Float32Array(9),Ll=new Float32Array(4);function Ni(r,t,e){const n=r[0];if(n<=0||n>0)return r;const i=t*e;let s=Al[i];if(s===void 0&&(s=new Float32Array(i),Al[i]=s),t!==0){n.toArray(s,0);for(let o=1,a=0;o!==t;++o)a+=e,r[o].toArray(s,a)}return s}function Te(r,t){if(r.length!==t.length)return!1;for(let e=0,n=r.length;e<n;e++)if(r[e]!==t[e])return!1;return!0}function we(r,t){for(let e=0,n=t.length;e<n;e++)r[e]=t[e]}function ar(r,t){let e=Cl[t];e===void 0&&(e=new Int32Array(t),Cl[t]=e);for(let n=0;n!==t;++n)e[n]=r.allocateTextureUnit();return e}function am(r,t){const e=this.cache;e[0]!==t&&(r.uniform1f(this.addr,t),e[0]=t)}function lm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2f(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;r.uniform2fv(this.addr,t),we(e,t)}}function cm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3f(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else if(t.r!==void 0)(e[0]!==t.r||e[1]!==t.g||e[2]!==t.b)&&(r.uniform3f(this.addr,t.r,t.g,t.b),e[0]=t.r,e[1]=t.g,e[2]=t.b);else{if(Te(e,t))return;r.uniform3fv(this.addr,t),we(e,t)}}function hm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4f(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;r.uniform4fv(this.addr,t),we(e,t)}}function dm(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;r.uniformMatrix2fv(this.addr,!1,t),we(e,t)}else{if(Te(e,n))return;Ll.set(n),r.uniformMatrix2fv(this.addr,!1,Ll),we(e,n)}}function um(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;r.uniformMatrix3fv(this.addr,!1,t),we(e,t)}else{if(Te(e,n))return;Pl.set(n),r.uniformMatrix3fv(this.addr,!1,Pl),we(e,n)}}function fm(r,t){const e=this.cache,n=t.elements;if(n===void 0){if(Te(e,t))return;r.uniformMatrix4fv(this.addr,!1,t),we(e,t)}else{if(Te(e,n))return;Rl.set(n),r.uniformMatrix4fv(this.addr,!1,Rl),we(e,n)}}function pm(r,t){const e=this.cache;e[0]!==t&&(r.uniform1i(this.addr,t),e[0]=t)}function mm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2i(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;r.uniform2iv(this.addr,t),we(e,t)}}function gm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3i(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;r.uniform3iv(this.addr,t),we(e,t)}}function xm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4i(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;r.uniform4iv(this.addr,t),we(e,t)}}function _m(r,t){const e=this.cache;e[0]!==t&&(r.uniform1ui(this.addr,t),e[0]=t)}function vm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y)&&(r.uniform2ui(this.addr,t.x,t.y),e[0]=t.x,e[1]=t.y);else{if(Te(e,t))return;r.uniform2uiv(this.addr,t),we(e,t)}}function Mm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z)&&(r.uniform3ui(this.addr,t.x,t.y,t.z),e[0]=t.x,e[1]=t.y,e[2]=t.z);else{if(Te(e,t))return;r.uniform3uiv(this.addr,t),we(e,t)}}function Sm(r,t){const e=this.cache;if(t.x!==void 0)(e[0]!==t.x||e[1]!==t.y||e[2]!==t.z||e[3]!==t.w)&&(r.uniform4ui(this.addr,t.x,t.y,t.z,t.w),e[0]=t.x,e[1]=t.y,e[2]=t.z,e[3]=t.w);else{if(Te(e,t))return;r.uniform4uiv(this.addr,t),we(e,t)}}function ym(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i);let s;this.type===r.SAMPLER_2D_SHADOW?(Ko.compareFunction=e.isReversedDepthBuffer()?aa:oa,s=Ko):s=qc,e.setTexture2D(t||s,i)}function bm(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture3D(t||$c,i)}function Em(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTextureCube(t||Kc,i)}function Tm(r,t,e){const n=this.cache,i=e.allocateTextureUnit();n[0]!==i&&(r.uniform1i(this.addr,i),n[0]=i),e.setTexture2DArray(t||Yc,i)}function wm(r){switch(r){case 5126:return am;case 35664:return lm;case 35665:return cm;case 35666:return hm;case 35674:return dm;case 35675:return um;case 35676:return fm;case 5124:case 35670:return pm;case 35667:case 35671:return mm;case 35668:case 35672:return gm;case 35669:case 35673:return xm;case 5125:return _m;case 36294:return vm;case 36295:return Mm;case 36296:return Sm;case 35678:case 36198:case 36298:case 36306:case 35682:return ym;case 35679:case 36299:case 36307:return bm;case 35680:case 36300:case 36308:case 36293:return Em;case 36289:case 36303:case 36311:case 36292:return Tm}}function Am(r,t){r.uniform1fv(this.addr,t)}function Cm(r,t){const e=Ni(t,this.size,2);r.uniform2fv(this.addr,e)}function Rm(r,t){const e=Ni(t,this.size,3);r.uniform3fv(this.addr,e)}function Pm(r,t){const e=Ni(t,this.size,4);r.uniform4fv(this.addr,e)}function Lm(r,t){const e=Ni(t,this.size,4);r.uniformMatrix2fv(this.addr,!1,e)}function Im(r,t){const e=Ni(t,this.size,9);r.uniformMatrix3fv(this.addr,!1,e)}function Dm(r,t){const e=Ni(t,this.size,16);r.uniformMatrix4fv(this.addr,!1,e)}function Nm(r,t){r.uniform1iv(this.addr,t)}function Um(r,t){r.uniform2iv(this.addr,t)}function Fm(r,t){r.uniform3iv(this.addr,t)}function Om(r,t){r.uniform4iv(this.addr,t)}function Bm(r,t){r.uniform1uiv(this.addr,t)}function km(r,t){r.uniform2uiv(this.addr,t)}function zm(r,t){r.uniform3uiv(this.addr,t)}function Gm(r,t){r.uniform4uiv(this.addr,t)}function Vm(r,t,e){const n=this.cache,i=t.length,s=ar(e,i);Te(n,s)||(r.uniform1iv(this.addr,s),we(n,s));let o;this.type===r.SAMPLER_2D_SHADOW?o=Ko:o=qc;for(let a=0;a!==i;++a)e.setTexture2D(t[a]||o,s[a])}function Hm(r,t,e){const n=this.cache,i=t.length,s=ar(e,i);Te(n,s)||(r.uniform1iv(this.addr,s),we(n,s));for(let o=0;o!==i;++o)e.setTexture3D(t[o]||$c,s[o])}function Wm(r,t,e){const n=this.cache,i=t.length,s=ar(e,i);Te(n,s)||(r.uniform1iv(this.addr,s),we(n,s));for(let o=0;o!==i;++o)e.setTextureCube(t[o]||Kc,s[o])}function Xm(r,t,e){const n=this.cache,i=t.length,s=ar(e,i);Te(n,s)||(r.uniform1iv(this.addr,s),we(n,s));for(let o=0;o!==i;++o)e.setTexture2DArray(t[o]||Yc,s[o])}function qm(r){switch(r){case 5126:return Am;case 35664:return Cm;case 35665:return Rm;case 35666:return Pm;case 35674:return Lm;case 35675:return Im;case 35676:return Dm;case 5124:case 35670:return Nm;case 35667:case 35671:return Um;case 35668:case 35672:return Fm;case 35669:case 35673:return Om;case 5125:return Bm;case 36294:return km;case 36295:return zm;case 36296:return Gm;case 35678:case 36198:case 36298:case 36306:case 35682:return Vm;case 35679:case 36299:case 36307:return Hm;case 35680:case 36300:case 36308:case 36293:return Wm;case 36289:case 36303:case 36311:case 36292:return Xm}}class Ym{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.setValue=wm(e.type)}}class $m{constructor(t,e,n){this.id=t,this.addr=n,this.cache=[],this.type=e.type,this.size=e.size,this.setValue=qm(e.type)}}class Km{constructor(t){this.id=t,this.seq=[],this.map={}}setValue(t,e,n){const i=this.seq;for(let s=0,o=i.length;s!==o;++s){const a=i[s];a.setValue(t,e[a.id],n)}}}const Xr=/(\w+)(\])?(\[|\.)?/g;function Il(r,t){r.seq.push(t),r.map[t.id]=t}function Jm(r,t,e){const n=r.name,i=n.length;for(Xr.lastIndex=0;;){const s=Xr.exec(n),o=Xr.lastIndex;let a=s[1];const l=s[2]==="]",c=s[3];if(l&&(a=a|0),c===void 0||c==="["&&o+2===i){Il(e,c===void 0?new Ym(a,r,t):new $m(a,r,t));break}else{let u=e.map[a];u===void 0&&(u=new Km(a),Il(e,u)),e=u}}}class $s{constructor(t,e){this.seq=[],this.map={};const n=t.getProgramParameter(e,t.ACTIVE_UNIFORMS);for(let o=0;o<n;++o){const a=t.getActiveUniform(e,o),l=t.getUniformLocation(e,a.name);Jm(a,l,this)}const i=[],s=[];for(const o of this.seq)o.type===t.SAMPLER_2D_SHADOW||o.type===t.SAMPLER_CUBE_SHADOW||o.type===t.SAMPLER_2D_ARRAY_SHADOW?i.push(o):s.push(o);i.length>0&&(this.seq=i.concat(s))}setValue(t,e,n,i){const s=this.map[e];s!==void 0&&s.setValue(t,n,i)}setOptional(t,e,n){const i=e[n];i!==void 0&&this.setValue(t,n,i)}static upload(t,e,n,i){for(let s=0,o=e.length;s!==o;++s){const a=e[s],l=n[a.id];l.needsUpdate!==!1&&a.setValue(t,l.value,i)}}static seqWithValue(t,e){const n=[];for(let i=0,s=t.length;i!==s;++i){const o=t[i];o.id in e&&n.push(o)}return n}}function Dl(r,t,e){const n=r.createShader(t);return r.shaderSource(n,e),r.compileShader(n),n}const Zm=37297;let jm=0;function Qm(r,t){const e=r.split(`
`),n=[],i=Math.max(t-6,0),s=Math.min(t+6,e.length);for(let o=i;o<s;o++){const a=o+1;n.push(`${a===t?">":" "} ${a}: ${e[o]}`)}return n.join(`
`)}const Nl=new Xt;function t0(r){te._getMatrix(Nl,te.workingColorSpace,r);const t=`mat3( ${Nl.elements.map(e=>e.toFixed(4))} )`;switch(te.getTransfer(r)){case js:return[t,"LinearTransferOETF"];case ae:return[t,"sRGBTransferOETF"];default:return Bt("WebGLProgram: Unsupported color space: ",r),[t,"LinearTransferOETF"]}}function Ul(r,t,e){const n=r.getShaderParameter(t,r.COMPILE_STATUS),s=(r.getShaderInfoLog(t)||"").trim();if(n&&s==="")return"";const o=/ERROR: 0:(\d+)/.exec(s);if(o){const a=parseInt(o[1]);return e.toUpperCase()+`

`+s+`

`+Qm(r.getShaderSource(t),a)}else return s}function e0(r,t){const e=t0(t);return[`vec4 ${r}( vec4 value ) {`,`	return ${e[1]}( vec4( value.rgb * ${e[0]}, value.a ) );`,"}"].join(`
`)}const n0={[lc]:"Linear",[cc]:"Reinhard",[hc]:"Cineon",[jo]:"ACESFilmic",[uc]:"AgX",[fc]:"Neutral",[dc]:"Custom"};function i0(r,t){const e=n0[t];return e===void 0?(Bt("WebGLProgram: Unsupported toneMapping:",t),"vec3 "+r+"( vec3 color ) { return LinearToneMapping( color ); }"):"vec3 "+r+"( vec3 color ) { return "+e+"ToneMapping( color ); }"}const Ns=new E;function s0(){te.getLuminanceCoefficients(Ns);const r=Ns.x.toFixed(4),t=Ns.y.toFixed(4),e=Ns.z.toFixed(4);return["float luminance( const in vec3 rgb ) {",`	const vec3 weights = vec3( ${r}, ${t}, ${e} );`,"	return dot( weights, rgb );","}"].join(`
`)}function r0(r){return[r.extensionClipCullDistance?"#extension GL_ANGLE_clip_cull_distance : require":"",r.extensionMultiDraw?"#extension GL_ANGLE_multi_draw : require":""].filter(qi).join(`
`)}function o0(r){const t=[];for(const e in r){const n=r[e];n!==!1&&t.push("#define "+e+" "+n)}return t.join(`
`)}function a0(r,t){const e={},n=r.getProgramParameter(t,r.ACTIVE_ATTRIBUTES);for(let i=0;i<n;i++){const s=r.getActiveAttrib(t,i),o=s.name;let a=1;s.type===r.FLOAT_MAT2&&(a=2),s.type===r.FLOAT_MAT3&&(a=3),s.type===r.FLOAT_MAT4&&(a=4),e[o]={type:s.type,location:r.getAttribLocation(t,o),locationSize:a}}return e}function qi(r){return r!==""}function Fl(r,t){const e=t.numSpotLightShadows+t.numSpotLightMaps-t.numSpotLightShadowsWithMaps;return r.replace(/NUM_DIR_LIGHTS/g,t.numDirLights).replace(/NUM_SPOT_LIGHTS/g,t.numSpotLights).replace(/NUM_SPOT_LIGHT_MAPS/g,t.numSpotLightMaps).replace(/NUM_SPOT_LIGHT_COORDS/g,e).replace(/NUM_RECT_AREA_LIGHTS/g,t.numRectAreaLights).replace(/NUM_POINT_LIGHTS/g,t.numPointLights).replace(/NUM_HEMI_LIGHTS/g,t.numHemiLights).replace(/NUM_DIR_LIGHT_SHADOWS/g,t.numDirLightShadows).replace(/NUM_SPOT_LIGHT_SHADOWS_WITH_MAPS/g,t.numSpotLightShadowsWithMaps).replace(/NUM_SPOT_LIGHT_SHADOWS/g,t.numSpotLightShadows).replace(/NUM_POINT_LIGHT_SHADOWS/g,t.numPointLightShadows)}function Ol(r,t){return r.replace(/NUM_CLIPPING_PLANES/g,t.numClippingPlanes).replace(/UNION_CLIPPING_PLANES/g,t.numClippingPlanes-t.numClipIntersection)}const l0=/^[ \t]*#include +<([\w\d./]+)>/gm;function Jo(r){return r.replace(l0,h0)}const c0=new Map;function h0(r,t){let e=Jt[t];if(e===void 0){const n=c0.get(t);if(n!==void 0)e=Jt[n],Bt('WebGLRenderer: Shader chunk "%s" has been deprecated. Use "%s" instead.',t,n);else throw new Error("Can not resolve #include <"+t+">")}return Jo(e)}const d0=/#pragma unroll_loop_start\s+for\s*\(\s*int\s+i\s*=\s*(\d+)\s*;\s*i\s*<\s*(\d+)\s*;\s*i\s*\+\+\s*\)\s*{([\s\S]+?)}\s+#pragma unroll_loop_end/g;function Bl(r){return r.replace(d0,u0)}function u0(r,t,e,n){let i="";for(let s=parseInt(t);s<parseInt(e);s++)i+=n.replace(/\[\s*i\s*\]/g,"[ "+s+" ]").replace(/UNROLLED_LOOP_INDEX/g,s);return i}function kl(r){let t=`precision ${r.precision} float;
	precision ${r.precision} int;
	precision ${r.precision} sampler2D;
	precision ${r.precision} samplerCube;
	precision ${r.precision} sampler3D;
	precision ${r.precision} sampler2DArray;
	precision ${r.precision} sampler2DShadow;
	precision ${r.precision} samplerCubeShadow;
	precision ${r.precision} sampler2DArrayShadow;
	precision ${r.precision} isampler2D;
	precision ${r.precision} isampler3D;
	precision ${r.precision} isamplerCube;
	precision ${r.precision} isampler2DArray;
	precision ${r.precision} usampler2D;
	precision ${r.precision} usampler3D;
	precision ${r.precision} usamplerCube;
	precision ${r.precision} usampler2DArray;
	`;return r.precision==="highp"?t+=`
#define HIGH_PRECISION`:r.precision==="mediump"?t+=`
#define MEDIUM_PRECISION`:r.precision==="lowp"&&(t+=`
#define LOW_PRECISION`),t}const f0={[Yi]:"SHADOWMAP_TYPE_PCF",[Wi]:"SHADOWMAP_TYPE_VSM"};function p0(r){return f0[r.shadowMapType]||"SHADOWMAP_TYPE_BASIC"}const m0={[ti]:"ENVMAP_TYPE_CUBE",[wi]:"ENVMAP_TYPE_CUBE",[er]:"ENVMAP_TYPE_CUBE_UV"};function g0(r){return r.envMap===!1?"ENVMAP_TYPE_CUBE":m0[r.envMapMode]||"ENVMAP_TYPE_CUBE"}const x0={[wi]:"ENVMAP_MODE_REFRACTION"};function _0(r){return r.envMap===!1?"ENVMAP_MODE_REFLECTION":x0[r.envMapMode]||"ENVMAP_MODE_REFLECTION"}const v0={[ac]:"ENVMAP_BLENDING_MULTIPLY",[Ch]:"ENVMAP_BLENDING_MIX",[Rh]:"ENVMAP_BLENDING_ADD"};function M0(r){return r.envMap===!1?"ENVMAP_BLENDING_NONE":v0[r.combine]||"ENVMAP_BLENDING_NONE"}function S0(r){const t=r.envMapCubeUVHeight;if(t===null)return null;const e=Math.log2(t)-2,n=1/t;return{texelWidth:1/(3*Math.max(Math.pow(2,e),7*16)),texelHeight:n,maxMip:e}}function y0(r,t,e,n){const i=r.getContext(),s=e.defines;let o=e.vertexShader,a=e.fragmentShader;const l=p0(e),c=g0(e),d=_0(e),u=M0(e),h=S0(e),f=r0(e),g=o0(s),y=i.createProgram();let p,m,x=e.glslVersion?"#version "+e.glslVersion+`
`:"";e.isRawShaderMaterial?(p=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(qi).join(`
`),p.length>0&&(p+=`
`),m=["#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g].filter(qi).join(`
`),m.length>0&&(m+=`
`)):(p=[kl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.extensionClipCullDistance?"#define USE_CLIP_DISTANCE":"",e.batching?"#define USE_BATCHING":"",e.batchingColor?"#define USE_BATCHING_COLOR":"",e.instancing?"#define USE_INSTANCING":"",e.instancingColor?"#define USE_INSTANCING_COLOR":"",e.instancingMorph?"#define USE_INSTANCING_MORPH":"",e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.map?"#define USE_MAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+d:"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.displacementMap?"#define USE_DISPLACEMENTMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.mapUv?"#define MAP_UV "+e.mapUv:"",e.alphaMapUv?"#define ALPHAMAP_UV "+e.alphaMapUv:"",e.lightMapUv?"#define LIGHTMAP_UV "+e.lightMapUv:"",e.aoMapUv?"#define AOMAP_UV "+e.aoMapUv:"",e.emissiveMapUv?"#define EMISSIVEMAP_UV "+e.emissiveMapUv:"",e.bumpMapUv?"#define BUMPMAP_UV "+e.bumpMapUv:"",e.normalMapUv?"#define NORMALMAP_UV "+e.normalMapUv:"",e.displacementMapUv?"#define DISPLACEMENTMAP_UV "+e.displacementMapUv:"",e.metalnessMapUv?"#define METALNESSMAP_UV "+e.metalnessMapUv:"",e.roughnessMapUv?"#define ROUGHNESSMAP_UV "+e.roughnessMapUv:"",e.anisotropyMapUv?"#define ANISOTROPYMAP_UV "+e.anisotropyMapUv:"",e.clearcoatMapUv?"#define CLEARCOATMAP_UV "+e.clearcoatMapUv:"",e.clearcoatNormalMapUv?"#define CLEARCOAT_NORMALMAP_UV "+e.clearcoatNormalMapUv:"",e.clearcoatRoughnessMapUv?"#define CLEARCOAT_ROUGHNESSMAP_UV "+e.clearcoatRoughnessMapUv:"",e.iridescenceMapUv?"#define IRIDESCENCEMAP_UV "+e.iridescenceMapUv:"",e.iridescenceThicknessMapUv?"#define IRIDESCENCE_THICKNESSMAP_UV "+e.iridescenceThicknessMapUv:"",e.sheenColorMapUv?"#define SHEEN_COLORMAP_UV "+e.sheenColorMapUv:"",e.sheenRoughnessMapUv?"#define SHEEN_ROUGHNESSMAP_UV "+e.sheenRoughnessMapUv:"",e.specularMapUv?"#define SPECULARMAP_UV "+e.specularMapUv:"",e.specularColorMapUv?"#define SPECULAR_COLORMAP_UV "+e.specularColorMapUv:"",e.specularIntensityMapUv?"#define SPECULAR_INTENSITYMAP_UV "+e.specularIntensityMapUv:"",e.transmissionMapUv?"#define TRANSMISSIONMAP_UV "+e.transmissionMapUv:"",e.thicknessMapUv?"#define THICKNESSMAP_UV "+e.thicknessMapUv:"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexNormals?"#define HAS_NORMAL":"",e.vertexColors?"#define USE_COLOR":"",e.vertexAlphas?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.flatShading?"#define FLAT_SHADED":"",e.skinning?"#define USE_SKINNING":"",e.morphTargets?"#define USE_MORPHTARGETS":"",e.morphNormals&&e.flatShading===!1?"#define USE_MORPHNORMALS":"",e.morphColors?"#define USE_MORPHCOLORS":"",e.morphTargetsCount>0?"#define MORPHTARGETS_TEXTURE_STRIDE "+e.morphTextureStride:"",e.morphTargetsCount>0?"#define MORPHTARGETS_COUNT "+e.morphTargetsCount:"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.sizeAttenuation?"#define USE_SIZEATTENUATION":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 modelMatrix;","uniform mat4 modelViewMatrix;","uniform mat4 projectionMatrix;","uniform mat4 viewMatrix;","uniform mat3 normalMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;","#ifdef USE_INSTANCING","	attribute mat4 instanceMatrix;","#endif","#ifdef USE_INSTANCING_COLOR","	attribute vec3 instanceColor;","#endif","#ifdef USE_INSTANCING_MORPH","	uniform sampler2D morphTexture;","#endif","attribute vec3 position;","attribute vec3 normal;","attribute vec2 uv;","#ifdef USE_UV1","	attribute vec2 uv1;","#endif","#ifdef USE_UV2","	attribute vec2 uv2;","#endif","#ifdef USE_UV3","	attribute vec2 uv3;","#endif","#ifdef USE_TANGENT","	attribute vec4 tangent;","#endif","#if defined( USE_COLOR_ALPHA )","	attribute vec4 color;","#elif defined( USE_COLOR )","	attribute vec3 color;","#endif","#ifdef USE_SKINNING","	attribute vec4 skinIndex;","	attribute vec4 skinWeight;","#endif",`
`].filter(qi).join(`
`),m=[kl(e),"#define SHADER_TYPE "+e.shaderType,"#define SHADER_NAME "+e.shaderName,g,e.useFog&&e.fog?"#define USE_FOG":"",e.useFog&&e.fogExp2?"#define FOG_EXP2":"",e.alphaToCoverage?"#define ALPHA_TO_COVERAGE":"",e.map?"#define USE_MAP":"",e.matcap?"#define USE_MATCAP":"",e.envMap?"#define USE_ENVMAP":"",e.envMap?"#define "+c:"",e.envMap?"#define "+d:"",e.envMap?"#define "+u:"",h?"#define CUBEUV_TEXEL_WIDTH "+h.texelWidth:"",h?"#define CUBEUV_TEXEL_HEIGHT "+h.texelHeight:"",h?"#define CUBEUV_MAX_MIP "+h.maxMip+".0":"",e.lightMap?"#define USE_LIGHTMAP":"",e.aoMap?"#define USE_AOMAP":"",e.bumpMap?"#define USE_BUMPMAP":"",e.normalMap?"#define USE_NORMALMAP":"",e.normalMapObjectSpace?"#define USE_NORMALMAP_OBJECTSPACE":"",e.normalMapTangentSpace?"#define USE_NORMALMAP_TANGENTSPACE":"",e.packedNormalMap?"#define USE_PACKED_NORMALMAP":"",e.emissiveMap?"#define USE_EMISSIVEMAP":"",e.anisotropy?"#define USE_ANISOTROPY":"",e.anisotropyMap?"#define USE_ANISOTROPYMAP":"",e.clearcoat?"#define USE_CLEARCOAT":"",e.clearcoatMap?"#define USE_CLEARCOATMAP":"",e.clearcoatRoughnessMap?"#define USE_CLEARCOAT_ROUGHNESSMAP":"",e.clearcoatNormalMap?"#define USE_CLEARCOAT_NORMALMAP":"",e.dispersion?"#define USE_DISPERSION":"",e.iridescence?"#define USE_IRIDESCENCE":"",e.iridescenceMap?"#define USE_IRIDESCENCEMAP":"",e.iridescenceThicknessMap?"#define USE_IRIDESCENCE_THICKNESSMAP":"",e.specularMap?"#define USE_SPECULARMAP":"",e.specularColorMap?"#define USE_SPECULAR_COLORMAP":"",e.specularIntensityMap?"#define USE_SPECULAR_INTENSITYMAP":"",e.roughnessMap?"#define USE_ROUGHNESSMAP":"",e.metalnessMap?"#define USE_METALNESSMAP":"",e.alphaMap?"#define USE_ALPHAMAP":"",e.alphaTest?"#define USE_ALPHATEST":"",e.alphaHash?"#define USE_ALPHAHASH":"",e.sheen?"#define USE_SHEEN":"",e.sheenColorMap?"#define USE_SHEEN_COLORMAP":"",e.sheenRoughnessMap?"#define USE_SHEEN_ROUGHNESSMAP":"",e.transmission?"#define USE_TRANSMISSION":"",e.transmissionMap?"#define USE_TRANSMISSIONMAP":"",e.thicknessMap?"#define USE_THICKNESSMAP":"",e.vertexTangents&&e.flatShading===!1?"#define USE_TANGENT":"",e.vertexColors||e.instancingColor?"#define USE_COLOR":"",e.vertexAlphas||e.batchingColor?"#define USE_COLOR_ALPHA":"",e.vertexUv1s?"#define USE_UV1":"",e.vertexUv2s?"#define USE_UV2":"",e.vertexUv3s?"#define USE_UV3":"",e.pointsUvs?"#define USE_POINTS_UV":"",e.gradientMap?"#define USE_GRADIENTMAP":"",e.flatShading?"#define FLAT_SHADED":"",e.doubleSided?"#define DOUBLE_SIDED":"",e.flipSided?"#define FLIP_SIDED":"",e.shadowMapEnabled?"#define USE_SHADOWMAP":"",e.shadowMapEnabled?"#define "+l:"",e.premultipliedAlpha?"#define PREMULTIPLIED_ALPHA":"",e.numLightProbes>0?"#define USE_LIGHT_PROBES":"",e.numLightProbeGrids>0?"#define USE_LIGHT_PROBES_GRID":"",e.decodeVideoTexture?"#define DECODE_VIDEO_TEXTURE":"",e.decodeVideoTextureEmissive?"#define DECODE_VIDEO_TEXTURE_EMISSIVE":"",e.logarithmicDepthBuffer?"#define USE_LOGARITHMIC_DEPTH_BUFFER":"",e.reversedDepthBuffer?"#define USE_REVERSED_DEPTH_BUFFER":"","uniform mat4 viewMatrix;","uniform vec3 cameraPosition;","uniform bool isOrthographic;",e.toneMapping!==fn?"#define TONE_MAPPING":"",e.toneMapping!==fn?Jt.tonemapping_pars_fragment:"",e.toneMapping!==fn?i0("toneMapping",e.toneMapping):"",e.dithering?"#define DITHERING":"",e.opaque?"#define OPAQUE":"",Jt.colorspace_pars_fragment,e0("linearToOutputTexel",e.outputColorSpace),s0(),e.useDepthPacking?"#define DEPTH_PACKING "+e.depthPacking:"",`
`].filter(qi).join(`
`)),o=Jo(o),o=Fl(o,e),o=Ol(o,e),a=Jo(a),a=Fl(a,e),a=Ol(a,e),o=Bl(o),a=Bl(a),e.isRawShaderMaterial!==!0&&(x=`#version 300 es
`,p=[f,"#define attribute in","#define varying out","#define texture2D texture"].join(`
`)+`
`+p,m=["#define varying in",e.glslVersion===Ba?"":"layout(location = 0) out highp vec4 pc_fragColor;",e.glslVersion===Ba?"":"#define gl_FragColor pc_fragColor","#define gl_FragDepthEXT gl_FragDepth","#define texture2D texture","#define textureCube texture","#define texture2DProj textureProj","#define texture2DLodEXT textureLod","#define texture2DProjLodEXT textureProjLod","#define textureCubeLodEXT textureLod","#define texture2DGradEXT textureGrad","#define texture2DProjGradEXT textureProjGrad","#define textureCubeGradEXT textureGrad"].join(`
`)+`
`+m);const M=x+p+o,S=x+m+a,C=Dl(i,i.VERTEX_SHADER,M),w=Dl(i,i.FRAGMENT_SHADER,S);i.attachShader(y,C),i.attachShader(y,w),e.index0AttributeName!==void 0?i.bindAttribLocation(y,0,e.index0AttributeName):e.morphTargets===!0&&i.bindAttribLocation(y,0,"position"),i.linkProgram(y);function R(L){if(r.debug.checkShaderErrors){const O=i.getProgramInfoLog(y)||"",W=i.getShaderInfoLog(C)||"",q=i.getShaderInfoLog(w)||"",U=O.trim(),V=W.trim(),k=q.trim();let et=!0,nt=!0;if(i.getProgramParameter(y,i.LINK_STATUS)===!1)if(et=!1,typeof r.debug.onShaderError=="function")r.debug.onShaderError(i,y,C,w);else{const pt=Ul(i,C,"vertex"),St=Ul(i,w,"fragment");ee("THREE.WebGLProgram: Shader Error "+i.getError()+" - VALIDATE_STATUS "+i.getProgramParameter(y,i.VALIDATE_STATUS)+`

Material Name: `+L.name+`
Material Type: `+L.type+`

Program Info Log: `+U+`
`+pt+`
`+St)}else U!==""?Bt("WebGLProgram: Program Info Log:",U):(V===""||k==="")&&(nt=!1);nt&&(L.diagnostics={runnable:et,programLog:U,vertexShader:{log:V,prefix:p},fragmentShader:{log:k,prefix:m}})}i.deleteShader(C),i.deleteShader(w),v=new $s(i,y),A=a0(i,y)}let v;this.getUniforms=function(){return v===void 0&&R(this),v};let A;this.getAttributes=function(){return A===void 0&&R(this),A};let D=e.rendererExtensionParallelShaderCompile===!1;return this.isReady=function(){return D===!1&&(D=i.getProgramParameter(y,Zm)),D},this.destroy=function(){n.releaseStatesOfProgram(this),i.deleteProgram(y),this.program=void 0},this.type=e.shaderType,this.name=e.shaderName,this.id=jm++,this.cacheKey=t,this.usedTimes=1,this.program=y,this.vertexShader=C,this.fragmentShader=w,this}let b0=0;class E0{constructor(){this.shaderCache=new Map,this.materialCache=new Map}update(t){const e=t.vertexShader,n=t.fragmentShader,i=this._getShaderStage(e),s=this._getShaderStage(n),o=this._getShaderCacheForMaterial(t);return o.has(i)===!1&&(o.add(i),i.usedTimes++),o.has(s)===!1&&(o.add(s),s.usedTimes++),this}remove(t){const e=this.materialCache.get(t);for(const n of e)n.usedTimes--,n.usedTimes===0&&this.shaderCache.delete(n.code);return this.materialCache.delete(t),this}getVertexShaderID(t){return this._getShaderStage(t.vertexShader).id}getFragmentShaderID(t){return this._getShaderStage(t.fragmentShader).id}dispose(){this.shaderCache.clear(),this.materialCache.clear()}_getShaderCacheForMaterial(t){const e=this.materialCache;let n=e.get(t);return n===void 0&&(n=new Set,e.set(t,n)),n}_getShaderStage(t){const e=this.shaderCache;let n=e.get(t);return n===void 0&&(n=new T0(t),e.set(t,n)),n}}class T0{constructor(t){this.id=b0++,this.code=t,this.usedTimes=0}}function w0(r){return r===ei||r===Ks||r===Js}function A0(r,t,e,n,i,s){const o=new bc,a=new E0,l=new Set,c=[],d=new Map,u=n.logarithmicDepthBuffer;let h=n.precision;const f={MeshDepthMaterial:"depth",MeshDistanceMaterial:"distance",MeshNormalMaterial:"normal",MeshBasicMaterial:"basic",MeshLambertMaterial:"lambert",MeshPhongMaterial:"phong",MeshToonMaterial:"toon",MeshStandardMaterial:"physical",MeshPhysicalMaterial:"physical",MeshMatcapMaterial:"matcap",LineBasicMaterial:"basic",LineDashedMaterial:"dashed",PointsMaterial:"points",ShadowMaterial:"shadow",SpriteMaterial:"sprite"};function g(v){return l.add(v),v===0?"uv":`uv${v}`}function y(v,A,D,L,O,W){const q=L.fog,U=O.geometry,V=v.isMeshStandardMaterial||v.isMeshLambertMaterial||v.isMeshPhongMaterial?L.environment:null,k=v.isMeshStandardMaterial||v.isMeshLambertMaterial&&!v.envMap||v.isMeshPhongMaterial&&!v.envMap,et=t.get(v.envMap||V,k),nt=et&&et.mapping===er?et.image.height:null,pt=f[v.type];v.precision!==null&&(h=n.getMaxPrecision(v.precision),h!==v.precision&&Bt("WebGLProgram.getParameters:",v.precision,"not supported, using",h,"instead."));const St=U.morphAttributes.position||U.morphAttributes.normal||U.morphAttributes.color,At=St!==void 0?St.length:0;let $t=0;U.morphAttributes.position!==void 0&&($t=1),U.morphAttributes.normal!==void 0&&($t=2),U.morphAttributes.color!==void 0&&($t=3);let ne,Vt,J,gt;if(pt){const qt=hn[pt];ne=qt.vertexShader,Vt=qt.fragmentShader}else ne=v.vertexShader,Vt=v.fragmentShader,a.update(v),J=a.getVertexShaderID(v),gt=a.getFragmentShaderID(v);const at=r.getRenderTarget(),Pt=r.state.buffers.depth.getReversed(),Ot=O.isInstancedMesh===!0,Ut=O.isBatchedMesh===!0,ie=!!v.map,kt=!!v.matcap,Z=!!et,it=!!v.aoMap,j=!!v.lightMap,_t=!!v.bumpMap,ft=!!v.normalMap,zt=!!v.displacementMap,I=!!v.emissiveMap,Ht=!!v.metalnessMap,Ct=!!v.roughnessMap,Gt=v.anisotropy>0,st=v.clearcoat>0,oe=v.dispersion>0,T=v.iridescence>0,_=v.sheen>0,B=v.transmission>0,$=Gt&&!!v.anisotropyMap,Q=st&&!!v.clearcoatMap,rt=st&&!!v.clearcoatNormalMap,ht=st&&!!v.clearcoatRoughnessMap,X=T&&!!v.iridescenceMap,K=T&&!!v.iridescenceThicknessMap,Mt=_&&!!v.sheenColorMap,Tt=_&&!!v.sheenRoughnessMap,dt=!!v.specularMap,lt=!!v.specularColorMap,Wt=!!v.specularIntensityMap,Kt=B&&!!v.transmissionMap,re=B&&!!v.thicknessMap,N=!!v.gradientMap,ct=!!v.alphaMap,Y=v.alphaTest>0,bt=!!v.alphaHash,ut=!!v.extensions;let tt=fn;v.toneMapped&&(at===null||at.isXRRenderTarget===!0)&&(tt=r.toneMapping);const It={shaderID:pt,shaderType:v.type,shaderName:v.name,vertexShader:ne,fragmentShader:Vt,defines:v.defines,customVertexShaderID:J,customFragmentShaderID:gt,isRawShaderMaterial:v.isRawShaderMaterial===!0,glslVersion:v.glslVersion,precision:h,batching:Ut,batchingColor:Ut&&O._colorsTexture!==null,instancing:Ot,instancingColor:Ot&&O.instanceColor!==null,instancingMorph:Ot&&O.morphTexture!==null,outputColorSpace:at===null?r.outputColorSpace:at.isXRRenderTarget===!0?at.texture.colorSpace:te.workingColorSpace,alphaToCoverage:!!v.alphaToCoverage,map:ie,matcap:kt,envMap:Z,envMapMode:Z&&et.mapping,envMapCubeUVHeight:nt,aoMap:it,lightMap:j,bumpMap:_t,normalMap:ft,displacementMap:zt,emissiveMap:I,normalMapObjectSpace:ft&&v.normalMapType===Ih,normalMapTangentSpace:ft&&v.normalMapType===Vo,packedNormalMap:ft&&v.normalMapType===Vo&&w0(v.normalMap.format),metalnessMap:Ht,roughnessMap:Ct,anisotropy:Gt,anisotropyMap:$,clearcoat:st,clearcoatMap:Q,clearcoatNormalMap:rt,clearcoatRoughnessMap:ht,dispersion:oe,iridescence:T,iridescenceMap:X,iridescenceThicknessMap:K,sheen:_,sheenColorMap:Mt,sheenRoughnessMap:Tt,specularMap:dt,specularColorMap:lt,specularIntensityMap:Wt,transmission:B,transmissionMap:Kt,thicknessMap:re,gradientMap:N,opaque:v.transparent===!1&&v.blending===bi&&v.alphaToCoverage===!1,alphaMap:ct,alphaTest:Y,alphaHash:bt,combine:v.combine,mapUv:ie&&g(v.map.channel),aoMapUv:it&&g(v.aoMap.channel),lightMapUv:j&&g(v.lightMap.channel),bumpMapUv:_t&&g(v.bumpMap.channel),normalMapUv:ft&&g(v.normalMap.channel),displacementMapUv:zt&&g(v.displacementMap.channel),emissiveMapUv:I&&g(v.emissiveMap.channel),metalnessMapUv:Ht&&g(v.metalnessMap.channel),roughnessMapUv:Ct&&g(v.roughnessMap.channel),anisotropyMapUv:$&&g(v.anisotropyMap.channel),clearcoatMapUv:Q&&g(v.clearcoatMap.channel),clearcoatNormalMapUv:rt&&g(v.clearcoatNormalMap.channel),clearcoatRoughnessMapUv:ht&&g(v.clearcoatRoughnessMap.channel),iridescenceMapUv:X&&g(v.iridescenceMap.channel),iridescenceThicknessMapUv:K&&g(v.iridescenceThicknessMap.channel),sheenColorMapUv:Mt&&g(v.sheenColorMap.channel),sheenRoughnessMapUv:Tt&&g(v.sheenRoughnessMap.channel),specularMapUv:dt&&g(v.specularMap.channel),specularColorMapUv:lt&&g(v.specularColorMap.channel),specularIntensityMapUv:Wt&&g(v.specularIntensityMap.channel),transmissionMapUv:Kt&&g(v.transmissionMap.channel),thicknessMapUv:re&&g(v.thicknessMap.channel),alphaMapUv:ct&&g(v.alphaMap.channel),vertexTangents:!!U.attributes.tangent&&(ft||Gt),vertexNormals:!!U.attributes.normal,vertexColors:v.vertexColors,vertexAlphas:v.vertexColors===!0&&!!U.attributes.color&&U.attributes.color.itemSize===4,pointsUvs:O.isPoints===!0&&!!U.attributes.uv&&(ie||ct),fog:!!q,useFog:v.fog===!0,fogExp2:!!q&&q.isFogExp2,flatShading:v.wireframe===!1&&(v.flatShading===!0||U.attributes.normal===void 0&&ft===!1&&(v.isMeshLambertMaterial||v.isMeshPhongMaterial||v.isMeshStandardMaterial||v.isMeshPhysicalMaterial)),sizeAttenuation:v.sizeAttenuation===!0,logarithmicDepthBuffer:u,reversedDepthBuffer:Pt,skinning:O.isSkinnedMesh===!0,morphTargets:U.morphAttributes.position!==void 0,morphNormals:U.morphAttributes.normal!==void 0,morphColors:U.morphAttributes.color!==void 0,morphTargetsCount:At,morphTextureStride:$t,numDirLights:A.directional.length,numPointLights:A.point.length,numSpotLights:A.spot.length,numSpotLightMaps:A.spotLightMap.length,numRectAreaLights:A.rectArea.length,numHemiLights:A.hemi.length,numDirLightShadows:A.directionalShadowMap.length,numPointLightShadows:A.pointShadowMap.length,numSpotLightShadows:A.spotShadowMap.length,numSpotLightShadowsWithMaps:A.numSpotLightShadowsWithMaps,numLightProbes:A.numLightProbes,numLightProbeGrids:W.length,numClippingPlanes:s.numPlanes,numClipIntersection:s.numIntersection,dithering:v.dithering,shadowMapEnabled:r.shadowMap.enabled&&D.length>0,shadowMapType:r.shadowMap.type,toneMapping:tt,decodeVideoTexture:ie&&v.map.isVideoTexture===!0&&te.getTransfer(v.map.colorSpace)===ae,decodeVideoTextureEmissive:I&&v.emissiveMap.isVideoTexture===!0&&te.getTransfer(v.emissiveMap.colorSpace)===ae,premultipliedAlpha:v.premultipliedAlpha,doubleSided:v.side===tn,flipSided:v.side===Ge,useDepthPacking:v.depthPacking>=0,depthPacking:v.depthPacking||0,index0AttributeName:v.index0AttributeName,extensionClipCullDistance:ut&&v.extensions.clipCullDistance===!0&&e.has("WEBGL_clip_cull_distance"),extensionMultiDraw:(ut&&v.extensions.multiDraw===!0||Ut)&&e.has("WEBGL_multi_draw"),rendererExtensionParallelShaderCompile:e.has("KHR_parallel_shader_compile"),customProgramCacheKey:v.customProgramCacheKey()};return It.vertexUv1s=l.has(1),It.vertexUv2s=l.has(2),It.vertexUv3s=l.has(3),l.clear(),It}function p(v){const A=[];if(v.shaderID?A.push(v.shaderID):(A.push(v.customVertexShaderID),A.push(v.customFragmentShaderID)),v.defines!==void 0)for(const D in v.defines)A.push(D),A.push(v.defines[D]);return v.isRawShaderMaterial===!1&&(m(A,v),x(A,v),A.push(r.outputColorSpace)),A.push(v.customProgramCacheKey),A.join()}function m(v,A){v.push(A.precision),v.push(A.outputColorSpace),v.push(A.envMapMode),v.push(A.envMapCubeUVHeight),v.push(A.mapUv),v.push(A.alphaMapUv),v.push(A.lightMapUv),v.push(A.aoMapUv),v.push(A.bumpMapUv),v.push(A.normalMapUv),v.push(A.displacementMapUv),v.push(A.emissiveMapUv),v.push(A.metalnessMapUv),v.push(A.roughnessMapUv),v.push(A.anisotropyMapUv),v.push(A.clearcoatMapUv),v.push(A.clearcoatNormalMapUv),v.push(A.clearcoatRoughnessMapUv),v.push(A.iridescenceMapUv),v.push(A.iridescenceThicknessMapUv),v.push(A.sheenColorMapUv),v.push(A.sheenRoughnessMapUv),v.push(A.specularMapUv),v.push(A.specularColorMapUv),v.push(A.specularIntensityMapUv),v.push(A.transmissionMapUv),v.push(A.thicknessMapUv),v.push(A.combine),v.push(A.fogExp2),v.push(A.sizeAttenuation),v.push(A.morphTargetsCount),v.push(A.morphAttributeCount),v.push(A.numDirLights),v.push(A.numPointLights),v.push(A.numSpotLights),v.push(A.numSpotLightMaps),v.push(A.numHemiLights),v.push(A.numRectAreaLights),v.push(A.numDirLightShadows),v.push(A.numPointLightShadows),v.push(A.numSpotLightShadows),v.push(A.numSpotLightShadowsWithMaps),v.push(A.numLightProbes),v.push(A.shadowMapType),v.push(A.toneMapping),v.push(A.numClippingPlanes),v.push(A.numClipIntersection),v.push(A.depthPacking)}function x(v,A){o.disableAll(),A.instancing&&o.enable(0),A.instancingColor&&o.enable(1),A.instancingMorph&&o.enable(2),A.matcap&&o.enable(3),A.envMap&&o.enable(4),A.normalMapObjectSpace&&o.enable(5),A.normalMapTangentSpace&&o.enable(6),A.clearcoat&&o.enable(7),A.iridescence&&o.enable(8),A.alphaTest&&o.enable(9),A.vertexColors&&o.enable(10),A.vertexAlphas&&o.enable(11),A.vertexUv1s&&o.enable(12),A.vertexUv2s&&o.enable(13),A.vertexUv3s&&o.enable(14),A.vertexTangents&&o.enable(15),A.anisotropy&&o.enable(16),A.alphaHash&&o.enable(17),A.batching&&o.enable(18),A.dispersion&&o.enable(19),A.batchingColor&&o.enable(20),A.gradientMap&&o.enable(21),A.packedNormalMap&&o.enable(22),A.vertexNormals&&o.enable(23),v.push(o.mask),o.disableAll(),A.fog&&o.enable(0),A.useFog&&o.enable(1),A.flatShading&&o.enable(2),A.logarithmicDepthBuffer&&o.enable(3),A.reversedDepthBuffer&&o.enable(4),A.skinning&&o.enable(5),A.morphTargets&&o.enable(6),A.morphNormals&&o.enable(7),A.morphColors&&o.enable(8),A.premultipliedAlpha&&o.enable(9),A.shadowMapEnabled&&o.enable(10),A.doubleSided&&o.enable(11),A.flipSided&&o.enable(12),A.useDepthPacking&&o.enable(13),A.dithering&&o.enable(14),A.transmission&&o.enable(15),A.sheen&&o.enable(16),A.opaque&&o.enable(17),A.pointsUvs&&o.enable(18),A.decodeVideoTexture&&o.enable(19),A.decodeVideoTextureEmissive&&o.enable(20),A.alphaToCoverage&&o.enable(21),A.numLightProbeGrids>0&&o.enable(22),v.push(o.mask)}function M(v){const A=f[v.type];let D;if(A){const L=hn[A];D=qd.clone(L.uniforms)}else D=v.uniforms;return D}function S(v,A){let D=d.get(A);return D!==void 0?++D.usedTimes:(D=new y0(r,A,v,i),c.push(D),d.set(A,D)),D}function C(v){if(--v.usedTimes===0){const A=c.indexOf(v);c[A]=c[c.length-1],c.pop(),d.delete(v.cacheKey),v.destroy()}}function w(v){a.remove(v)}function R(){a.dispose()}return{getParameters:y,getProgramCacheKey:p,getUniforms:M,acquireProgram:S,releaseProgram:C,releaseShaderCache:w,programs:c,dispose:R}}function C0(){let r=new WeakMap;function t(o){return r.has(o)}function e(o){let a=r.get(o);return a===void 0&&(a={},r.set(o,a)),a}function n(o){r.delete(o)}function i(o,a,l){r.get(o)[a]=l}function s(){r=new WeakMap}return{has:t,get:e,remove:n,update:i,dispose:s}}function R0(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.material.id!==t.material.id?r.material.id-t.material.id:r.materialVariant!==t.materialVariant?r.materialVariant-t.materialVariant:r.z!==t.z?r.z-t.z:r.id-t.id}function zl(r,t){return r.groupOrder!==t.groupOrder?r.groupOrder-t.groupOrder:r.renderOrder!==t.renderOrder?r.renderOrder-t.renderOrder:r.z!==t.z?t.z-r.z:r.id-t.id}function Gl(){const r=[];let t=0;const e=[],n=[],i=[];function s(){t=0,e.length=0,n.length=0,i.length=0}function o(h){let f=0;return h.isInstancedMesh&&(f+=2),h.isSkinnedMesh&&(f+=1),f}function a(h,f,g,y,p,m){let x=r[t];return x===void 0?(x={id:h.id,object:h,geometry:f,material:g,materialVariant:o(h),groupOrder:y,renderOrder:h.renderOrder,z:p,group:m},r[t]=x):(x.id=h.id,x.object=h,x.geometry=f,x.material=g,x.materialVariant=o(h),x.groupOrder=y,x.renderOrder=h.renderOrder,x.z=p,x.group=m),t++,x}function l(h,f,g,y,p,m){const x=a(h,f,g,y,p,m);g.transmission>0?n.push(x):g.transparent===!0?i.push(x):e.push(x)}function c(h,f,g,y,p,m){const x=a(h,f,g,y,p,m);g.transmission>0?n.unshift(x):g.transparent===!0?i.unshift(x):e.unshift(x)}function d(h,f){e.length>1&&e.sort(h||R0),n.length>1&&n.sort(f||zl),i.length>1&&i.sort(f||zl)}function u(){for(let h=t,f=r.length;h<f;h++){const g=r[h];if(g.id===null)break;g.id=null,g.object=null,g.geometry=null,g.material=null,g.group=null}}return{opaque:e,transmissive:n,transparent:i,init:s,push:l,unshift:c,finish:u,sort:d}}function P0(){let r=new WeakMap;function t(n,i){const s=r.get(n);let o;return s===void 0?(o=new Gl,r.set(n,[o])):i>=s.length?(o=new Gl,s.push(o)):o=s[i],o}function e(){r=new WeakMap}return{get:t,dispose:e}}function L0(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={direction:new E,color:new yt};break;case"SpotLight":e={position:new E,direction:new E,color:new yt,distance:0,coneCos:0,penumbraCos:0,decay:0};break;case"PointLight":e={position:new E,color:new yt,distance:0,decay:0};break;case"HemisphereLight":e={direction:new E,skyColor:new yt,groundColor:new yt};break;case"RectAreaLight":e={color:new yt,position:new E,halfWidth:new E,halfHeight:new E};break}return r[t.id]=e,e}}}function I0(){const r={};return{get:function(t){if(r[t.id]!==void 0)return r[t.id];let e;switch(t.type){case"DirectionalLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"SpotLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot};break;case"PointLight":e={shadowIntensity:1,shadowBias:0,shadowNormalBias:0,shadowRadius:1,shadowMapSize:new ot,shadowCameraNear:1,shadowCameraFar:1e3};break}return r[t.id]=e,e}}}let D0=0;function N0(r,t){return(t.castShadow?2:0)-(r.castShadow?2:0)+(t.map?1:0)-(r.map?1:0)}function U0(r){const t=new L0,e=I0(),n={version:0,hash:{directionalLength:-1,pointLength:-1,spotLength:-1,rectAreaLength:-1,hemiLength:-1,numDirectionalShadows:-1,numPointShadows:-1,numSpotShadows:-1,numSpotMaps:-1,numLightProbes:-1},ambient:[0,0,0],probe:[],directional:[],directionalShadow:[],directionalShadowMap:[],directionalShadowMatrix:[],spot:[],spotLightMap:[],spotShadow:[],spotShadowMap:[],spotLightMatrix:[],rectArea:[],rectAreaLTC1:null,rectAreaLTC2:null,point:[],pointShadow:[],pointShadowMap:[],pointShadowMatrix:[],hemi:[],numSpotLightShadowsWithMaps:0,numLightProbes:0};for(let c=0;c<9;c++)n.probe.push(new E);const i=new E,s=new Qt,o=new Qt;function a(c){let d=0,u=0,h=0;for(let A=0;A<9;A++)n.probe[A].set(0,0,0);let f=0,g=0,y=0,p=0,m=0,x=0,M=0,S=0,C=0,w=0,R=0;c.sort(N0);for(let A=0,D=c.length;A<D;A++){const L=c[A],O=L.color,W=L.intensity,q=L.distance;let U=null;if(L.shadow&&L.shadow.map&&(L.shadow.map.texture.format===ei?U=L.shadow.map.texture:U=L.shadow.map.depthTexture||L.shadow.map.texture),L.isAmbientLight)d+=O.r*W,u+=O.g*W,h+=O.b*W;else if(L.isLightProbe){for(let V=0;V<9;V++)n.probe[V].addScaledVector(L.sh.coefficients[V],W);R++}else if(L.isDirectionalLight){const V=t.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),L.castShadow){const k=L.shadow,et=e.get(L);et.shadowIntensity=k.intensity,et.shadowBias=k.bias,et.shadowNormalBias=k.normalBias,et.shadowRadius=k.radius,et.shadowMapSize=k.mapSize,n.directionalShadow[f]=et,n.directionalShadowMap[f]=U,n.directionalShadowMatrix[f]=L.shadow.matrix,x++}n.directional[f]=V,f++}else if(L.isSpotLight){const V=t.get(L);V.position.setFromMatrixPosition(L.matrixWorld),V.color.copy(O).multiplyScalar(W),V.distance=q,V.coneCos=Math.cos(L.angle),V.penumbraCos=Math.cos(L.angle*(1-L.penumbra)),V.decay=L.decay,n.spot[y]=V;const k=L.shadow;if(L.map&&(n.spotLightMap[C]=L.map,C++,k.updateMatrices(L),L.castShadow&&w++),n.spotLightMatrix[y]=k.matrix,L.castShadow){const et=e.get(L);et.shadowIntensity=k.intensity,et.shadowBias=k.bias,et.shadowNormalBias=k.normalBias,et.shadowRadius=k.radius,et.shadowMapSize=k.mapSize,n.spotShadow[y]=et,n.spotShadowMap[y]=U,S++}y++}else if(L.isRectAreaLight){const V=t.get(L);V.color.copy(O).multiplyScalar(W),V.halfWidth.set(L.width*.5,0,0),V.halfHeight.set(0,L.height*.5,0),n.rectArea[p]=V,p++}else if(L.isPointLight){const V=t.get(L);if(V.color.copy(L.color).multiplyScalar(L.intensity),V.distance=L.distance,V.decay=L.decay,L.castShadow){const k=L.shadow,et=e.get(L);et.shadowIntensity=k.intensity,et.shadowBias=k.bias,et.shadowNormalBias=k.normalBias,et.shadowRadius=k.radius,et.shadowMapSize=k.mapSize,et.shadowCameraNear=k.camera.near,et.shadowCameraFar=k.camera.far,n.pointShadow[g]=et,n.pointShadowMap[g]=U,n.pointShadowMatrix[g]=L.shadow.matrix,M++}n.point[g]=V,g++}else if(L.isHemisphereLight){const V=t.get(L);V.skyColor.copy(L.color).multiplyScalar(W),V.groundColor.copy(L.groundColor).multiplyScalar(W),n.hemi[m]=V,m++}}p>0&&(r.has("OES_texture_float_linear")===!0?(n.rectAreaLTC1=mt.LTC_FLOAT_1,n.rectAreaLTC2=mt.LTC_FLOAT_2):(n.rectAreaLTC1=mt.LTC_HALF_1,n.rectAreaLTC2=mt.LTC_HALF_2)),n.ambient[0]=d,n.ambient[1]=u,n.ambient[2]=h;const v=n.hash;(v.directionalLength!==f||v.pointLength!==g||v.spotLength!==y||v.rectAreaLength!==p||v.hemiLength!==m||v.numDirectionalShadows!==x||v.numPointShadows!==M||v.numSpotShadows!==S||v.numSpotMaps!==C||v.numLightProbes!==R)&&(n.directional.length=f,n.spot.length=y,n.rectArea.length=p,n.point.length=g,n.hemi.length=m,n.directionalShadow.length=x,n.directionalShadowMap.length=x,n.pointShadow.length=M,n.pointShadowMap.length=M,n.spotShadow.length=S,n.spotShadowMap.length=S,n.directionalShadowMatrix.length=x,n.pointShadowMatrix.length=M,n.spotLightMatrix.length=S+C-w,n.spotLightMap.length=C,n.numSpotLightShadowsWithMaps=w,n.numLightProbes=R,v.directionalLength=f,v.pointLength=g,v.spotLength=y,v.rectAreaLength=p,v.hemiLength=m,v.numDirectionalShadows=x,v.numPointShadows=M,v.numSpotShadows=S,v.numSpotMaps=C,v.numLightProbes=R,n.version=D0++)}function l(c,d){let u=0,h=0,f=0,g=0,y=0;const p=d.matrixWorldInverse;for(let m=0,x=c.length;m<x;m++){const M=c[m];if(M.isDirectionalLight){const S=n.directional[u];S.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(i),S.direction.transformDirection(p),u++}else if(M.isSpotLight){const S=n.spot[f];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(p),S.direction.setFromMatrixPosition(M.matrixWorld),i.setFromMatrixPosition(M.target.matrixWorld),S.direction.sub(i),S.direction.transformDirection(p),f++}else if(M.isRectAreaLight){const S=n.rectArea[g];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(p),o.identity(),s.copy(M.matrixWorld),s.premultiply(p),o.extractRotation(s),S.halfWidth.set(M.width*.5,0,0),S.halfHeight.set(0,M.height*.5,0),S.halfWidth.applyMatrix4(o),S.halfHeight.applyMatrix4(o),g++}else if(M.isPointLight){const S=n.point[h];S.position.setFromMatrixPosition(M.matrixWorld),S.position.applyMatrix4(p),h++}else if(M.isHemisphereLight){const S=n.hemi[y];S.direction.setFromMatrixPosition(M.matrixWorld),S.direction.transformDirection(p),y++}}}return{setup:a,setupView:l,state:n}}function Vl(r){const t=new U0(r),e=[],n=[],i=[];function s(h){u.camera=h,e.length=0,n.length=0,i.length=0}function o(h){e.push(h)}function a(h){n.push(h)}function l(h){i.push(h)}function c(){t.setup(e)}function d(h){t.setupView(e,h)}const u={lightsArray:e,shadowsArray:n,lightProbeGridArray:i,camera:null,lights:t,transmissionRenderTarget:{},textureUnits:0};return{init:s,state:u,setupLights:c,setupLightsView:d,pushLight:o,pushShadow:a,pushLightProbeGrid:l}}function F0(r){let t=new WeakMap;function e(i,s=0){const o=t.get(i);let a;return o===void 0?(a=new Vl(r),t.set(i,[a])):s>=o.length?(a=new Vl(r),o.push(a)):a=o[s],a}function n(){t=new WeakMap}return{get:e,dispose:n}}const O0=`void main() {
	gl_Position = vec4( position, 1.0 );
}`,B0=`uniform sampler2D shadow_pass;
uniform vec2 resolution;
uniform float radius;
void main() {
	const float samples = float( VSM_SAMPLES );
	float mean = 0.0;
	float squared_mean = 0.0;
	float uvStride = samples <= 1.0 ? 0.0 : 2.0 / ( samples - 1.0 );
	float uvStart = samples <= 1.0 ? 0.0 : - 1.0;
	for ( float i = 0.0; i < samples; i ++ ) {
		float uvOffset = uvStart + i * uvStride;
		#ifdef HORIZONTAL_PASS
			vec2 distribution = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( uvOffset, 0.0 ) * radius ) / resolution ).rg;
			mean += distribution.x;
			squared_mean += distribution.y * distribution.y + distribution.x * distribution.x;
		#else
			float depth = texture2D( shadow_pass, ( gl_FragCoord.xy + vec2( 0.0, uvOffset ) * radius ) / resolution ).r;
			mean += depth;
			squared_mean += depth * depth;
		#endif
	}
	mean = mean / samples;
	squared_mean = squared_mean / samples;
	float std_dev = sqrt( max( 0.0, squared_mean - mean * mean ) );
	gl_FragColor = vec4( mean, std_dev, 0.0, 1.0 );
}`,k0=[new E(1,0,0),new E(-1,0,0),new E(0,1,0),new E(0,-1,0),new E(0,0,1),new E(0,0,-1)],z0=[new E(0,-1,0),new E(0,-1,0),new E(0,0,1),new E(0,0,-1),new E(0,-1,0),new E(0,-1,0)],Hl=new Qt,Hi=new E,qr=new E;function G0(r,t,e){let n=new da;const i=new ot,s=new ot,o=new xe,a=new Jd,l=new Zd,c={},d=e.maxTextureSize,u={[Vn]:Ge,[Ge]:Vn,[tn]:tn},h=new mn({defines:{VSM_SAMPLES:8},uniforms:{shadow_pass:{value:null},resolution:{value:new ot},radius:{value:4}},vertexShader:O0,fragmentShader:B0}),f=h.clone();f.defines.HORIZONTAL_PASS=1;const g=new Ae;g.setAttribute("position",new Fe(new Float32Array([-1,-1,.5,3,-1,.5,-1,3,.5]),3));const y=new Ft(g,h),p=this;this.enabled=!1,this.autoUpdate=!0,this.needsUpdate=!1,this.type=Yi;let m=this.type;this.render=function(w,R,v){if(p.enabled===!1||p.autoUpdate===!1&&p.needsUpdate===!1||w.length===0)return;this.type===ch&&(Bt("WebGLShadowMap: PCFSoftShadowMap has been deprecated. Using PCFShadowMap instead."),this.type=Yi);const A=r.getRenderTarget(),D=r.getActiveCubeFace(),L=r.getActiveMipmapLevel(),O=r.state;O.setBlending(Tn),O.buffers.depth.getReversed()===!0?O.buffers.color.setClear(0,0,0,0):O.buffers.color.setClear(1,1,1,1),O.buffers.depth.setTest(!0),O.setScissorTest(!1);const W=m!==this.type;W&&R.traverse(function(q){q.material&&(Array.isArray(q.material)?q.material.forEach(U=>U.needsUpdate=!0):q.material.needsUpdate=!0)});for(let q=0,U=w.length;q<U;q++){const V=w[q],k=V.shadow;if(k===void 0){Bt("WebGLShadowMap:",V,"has no shadow.");continue}if(k.autoUpdate===!1&&k.needsUpdate===!1)continue;i.copy(k.mapSize);const et=k.getFrameExtents();i.multiply(et),s.copy(k.mapSize),(i.x>d||i.y>d)&&(i.x>d&&(s.x=Math.floor(d/et.x),i.x=s.x*et.x,k.mapSize.x=s.x),i.y>d&&(s.y=Math.floor(d/et.y),i.y=s.y*et.y,k.mapSize.y=s.y));const nt=r.state.buffers.depth.getReversed();if(k.camera._reversedDepth=nt,k.map===null||W===!0){if(k.map!==null&&(k.map.depthTexture!==null&&(k.map.depthTexture.dispose(),k.map.depthTexture=null),k.map.dispose()),this.type===Wi){if(V.isPointLight){Bt("WebGLShadowMap: VSM shadow maps are not supported for PointLights. Use PCF or BasicShadowMap instead.");continue}k.map=new sn(i.x,i.y,{format:ei,type:Cn,minFilter:Ne,magFilter:Ne,generateMipmaps:!1}),k.map.texture.name=V.name+".shadowMap",k.map.depthTexture=new Ai(i.x,i.y,nn),k.map.depthTexture.name=V.name+".shadowMapDepth",k.map.depthTexture.format=Rn,k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Ee,k.map.depthTexture.magFilter=Ee}else V.isPointLight?(k.map=new Xc(i.x),k.map.depthTexture=new ud(i.x,pn)):(k.map=new sn(i.x,i.y),k.map.depthTexture=new Ai(i.x,i.y,pn)),k.map.depthTexture.name=V.name+".shadowMap",k.map.depthTexture.format=Rn,this.type===Yi?(k.map.depthTexture.compareFunction=nt?aa:oa,k.map.depthTexture.minFilter=Ne,k.map.depthTexture.magFilter=Ne):(k.map.depthTexture.compareFunction=null,k.map.depthTexture.minFilter=Ee,k.map.depthTexture.magFilter=Ee);k.camera.updateProjectionMatrix()}const pt=k.map.isWebGLCubeRenderTarget?6:1;for(let St=0;St<pt;St++){if(k.map.isWebGLCubeRenderTarget)r.setRenderTarget(k.map,St),r.clear();else{St===0&&(r.setRenderTarget(k.map),r.clear());const At=k.getViewport(St);o.set(s.x*At.x,s.y*At.y,s.x*At.z,s.y*At.w),O.viewport(o)}if(V.isPointLight){const At=k.camera,$t=k.matrix,ne=V.distance||At.far;ne!==At.far&&(At.far=ne,At.updateProjectionMatrix()),Hi.setFromMatrixPosition(V.matrixWorld),At.position.copy(Hi),qr.copy(At.position),qr.add(k0[St]),At.up.copy(z0[St]),At.lookAt(qr),At.updateMatrixWorld(),$t.makeTranslation(-Hi.x,-Hi.y,-Hi.z),Hl.multiplyMatrices(At.projectionMatrix,At.matrixWorldInverse),k._frustum.setFromProjectionMatrix(Hl,At.coordinateSystem,At.reversedDepth)}else k.updateMatrices(V);n=k.getFrustum(),S(R,v,k.camera,V,this.type)}k.isPointLightShadow!==!0&&this.type===Wi&&x(k,v),k.needsUpdate=!1}m=this.type,p.needsUpdate=!1,r.setRenderTarget(A,D,L)};function x(w,R){const v=t.update(y);h.defines.VSM_SAMPLES!==w.blurSamples&&(h.defines.VSM_SAMPLES=w.blurSamples,f.defines.VSM_SAMPLES=w.blurSamples,h.needsUpdate=!0,f.needsUpdate=!0),w.mapPass===null&&(w.mapPass=new sn(i.x,i.y,{format:ei,type:Cn})),h.uniforms.shadow_pass.value=w.map.depthTexture,h.uniforms.resolution.value=w.mapSize,h.uniforms.radius.value=w.radius,r.setRenderTarget(w.mapPass),r.clear(),r.renderBufferDirect(R,null,v,h,y,null),f.uniforms.shadow_pass.value=w.mapPass.texture,f.uniforms.resolution.value=w.mapSize,f.uniforms.radius.value=w.radius,r.setRenderTarget(w.map),r.clear(),r.renderBufferDirect(R,null,v,f,y,null)}function M(w,R,v,A){let D=null;const L=v.isPointLight===!0?w.customDistanceMaterial:w.customDepthMaterial;if(L!==void 0)D=L;else if(D=v.isPointLight===!0?l:a,r.localClippingEnabled&&R.clipShadows===!0&&Array.isArray(R.clippingPlanes)&&R.clippingPlanes.length!==0||R.displacementMap&&R.displacementScale!==0||R.alphaMap&&R.alphaTest>0||R.map&&R.alphaTest>0||R.alphaToCoverage===!0){const O=D.uuid,W=R.uuid;let q=c[O];q===void 0&&(q={},c[O]=q);let U=q[W];U===void 0&&(U=D.clone(),q[W]=U,R.addEventListener("dispose",C)),D=U}if(D.visible=R.visible,D.wireframe=R.wireframe,A===Wi?D.side=R.shadowSide!==null?R.shadowSide:R.side:D.side=R.shadowSide!==null?R.shadowSide:u[R.side],D.alphaMap=R.alphaMap,D.alphaTest=R.alphaToCoverage===!0?.5:R.alphaTest,D.map=R.map,D.clipShadows=R.clipShadows,D.clippingPlanes=R.clippingPlanes,D.clipIntersection=R.clipIntersection,D.displacementMap=R.displacementMap,D.displacementScale=R.displacementScale,D.displacementBias=R.displacementBias,D.wireframeLinewidth=R.wireframeLinewidth,D.linewidth=R.linewidth,v.isPointLight===!0&&D.isMeshDistanceMaterial===!0){const O=r.properties.get(D);O.light=v}return D}function S(w,R,v,A,D){if(w.visible===!1)return;if(w.layers.test(R.layers)&&(w.isMesh||w.isLine||w.isPoints)&&(w.castShadow||w.receiveShadow&&D===Wi)&&(!w.frustumCulled||n.intersectsObject(w))){w.modelViewMatrix.multiplyMatrices(v.matrixWorldInverse,w.matrixWorld);const W=t.update(w),q=w.material;if(Array.isArray(q)){const U=W.groups;for(let V=0,k=U.length;V<k;V++){const et=U[V],nt=q[et.materialIndex];if(nt&&nt.visible){const pt=M(w,nt,A,D);w.onBeforeShadow(r,w,R,v,W,pt,et),r.renderBufferDirect(v,null,W,pt,w,et),w.onAfterShadow(r,w,R,v,W,pt,et)}}}else if(q.visible){const U=M(w,q,A,D);w.onBeforeShadow(r,w,R,v,W,U,null),r.renderBufferDirect(v,null,W,U,w,null),w.onAfterShadow(r,w,R,v,W,U,null)}}const O=w.children;for(let W=0,q=O.length;W<q;W++)S(O[W],R,v,A,D)}function C(w){w.target.removeEventListener("dispose",C);for(const v in c){const A=c[v],D=w.target.uuid;D in A&&(A[D].dispose(),delete A[D])}}}function V0(r,t){function e(){let N=!1;const ct=new xe;let Y=null;const bt=new xe(0,0,0,0);return{setMask:function(ut){Y!==ut&&!N&&(r.colorMask(ut,ut,ut,ut),Y=ut)},setLocked:function(ut){N=ut},setClear:function(ut,tt,It,qt,_e){_e===!0&&(ut*=qt,tt*=qt,It*=qt),ct.set(ut,tt,It,qt),bt.equals(ct)===!1&&(r.clearColor(ut,tt,It,qt),bt.copy(ct))},reset:function(){N=!1,Y=null,bt.set(-1,0,0,0)}}}function n(){let N=!1,ct=!1,Y=null,bt=null,ut=null;return{setReversed:function(tt){if(ct!==tt){const It=t.get("EXT_clip_control");tt?It.clipControlEXT(It.LOWER_LEFT_EXT,It.ZERO_TO_ONE_EXT):It.clipControlEXT(It.LOWER_LEFT_EXT,It.NEGATIVE_ONE_TO_ONE_EXT),ct=tt;const qt=ut;ut=null,this.setClear(qt)}},getReversed:function(){return ct},setTest:function(tt){tt?at(r.DEPTH_TEST):Pt(r.DEPTH_TEST)},setMask:function(tt){Y!==tt&&!N&&(r.depthMask(tt),Y=tt)},setFunc:function(tt){if(ct&&(tt=Vh[tt]),bt!==tt){switch(tt){case io:r.depthFunc(r.NEVER);break;case so:r.depthFunc(r.ALWAYS);break;case ro:r.depthFunc(r.LESS);break;case Ti:r.depthFunc(r.LEQUAL);break;case oo:r.depthFunc(r.EQUAL);break;case ao:r.depthFunc(r.GEQUAL);break;case lo:r.depthFunc(r.GREATER);break;case co:r.depthFunc(r.NOTEQUAL);break;default:r.depthFunc(r.LEQUAL)}bt=tt}},setLocked:function(tt){N=tt},setClear:function(tt){ut!==tt&&(ut=tt,ct&&(tt=1-tt),r.clearDepth(tt))},reset:function(){N=!1,Y=null,bt=null,ut=null,ct=!1}}}function i(){let N=!1,ct=null,Y=null,bt=null,ut=null,tt=null,It=null,qt=null,_e=null;return{setTest:function(le){N||(le?at(r.STENCIL_TEST):Pt(r.STENCIL_TEST))},setMask:function(le){ct!==le&&!N&&(r.stencilMask(le),ct=le)},setFunc:function(le,xn,on){(Y!==le||bt!==xn||ut!==on)&&(r.stencilFunc(le,xn,on),Y=le,bt=xn,ut=on)},setOp:function(le,xn,on){(tt!==le||It!==xn||qt!==on)&&(r.stencilOp(le,xn,on),tt=le,It=xn,qt=on)},setLocked:function(le){N=le},setClear:function(le){_e!==le&&(r.clearStencil(le),_e=le)},reset:function(){N=!1,ct=null,Y=null,bt=null,ut=null,tt=null,It=null,qt=null,_e=null}}}const s=new e,o=new n,a=new i,l=new WeakMap,c=new WeakMap;let d={},u={},h={},f=new WeakMap,g=[],y=null,p=!1,m=null,x=null,M=null,S=null,C=null,w=null,R=null,v=new yt(0,0,0),A=0,D=!1,L=null,O=null,W=null,q=null,U=null;const V=r.getParameter(r.MAX_COMBINED_TEXTURE_IMAGE_UNITS);let k=!1,et=0;const nt=r.getParameter(r.VERSION);nt.indexOf("WebGL")!==-1?(et=parseFloat(/^WebGL (\d)/.exec(nt)[1]),k=et>=1):nt.indexOf("OpenGL ES")!==-1&&(et=parseFloat(/^OpenGL ES (\d)/.exec(nt)[1]),k=et>=2);let pt=null,St={};const At=r.getParameter(r.SCISSOR_BOX),$t=r.getParameter(r.VIEWPORT),ne=new xe().fromArray(At),Vt=new xe().fromArray($t);function J(N,ct,Y,bt){const ut=new Uint8Array(4),tt=r.createTexture();r.bindTexture(N,tt),r.texParameteri(N,r.TEXTURE_MIN_FILTER,r.NEAREST),r.texParameteri(N,r.TEXTURE_MAG_FILTER,r.NEAREST);for(let It=0;It<Y;It++)N===r.TEXTURE_3D||N===r.TEXTURE_2D_ARRAY?r.texImage3D(ct,0,r.RGBA,1,1,bt,0,r.RGBA,r.UNSIGNED_BYTE,ut):r.texImage2D(ct+It,0,r.RGBA,1,1,0,r.RGBA,r.UNSIGNED_BYTE,ut);return tt}const gt={};gt[r.TEXTURE_2D]=J(r.TEXTURE_2D,r.TEXTURE_2D,1),gt[r.TEXTURE_CUBE_MAP]=J(r.TEXTURE_CUBE_MAP,r.TEXTURE_CUBE_MAP_POSITIVE_X,6),gt[r.TEXTURE_2D_ARRAY]=J(r.TEXTURE_2D_ARRAY,r.TEXTURE_2D_ARRAY,1,1),gt[r.TEXTURE_3D]=J(r.TEXTURE_3D,r.TEXTURE_3D,1,1),s.setClear(0,0,0,1),o.setClear(1),a.setClear(0),at(r.DEPTH_TEST),o.setFunc(Ti),_t(!1),ft(Da),at(r.CULL_FACE),it(Tn);function at(N){d[N]!==!0&&(r.enable(N),d[N]=!0)}function Pt(N){d[N]!==!1&&(r.disable(N),d[N]=!1)}function Ot(N,ct){return h[N]!==ct?(r.bindFramebuffer(N,ct),h[N]=ct,N===r.DRAW_FRAMEBUFFER&&(h[r.FRAMEBUFFER]=ct),N===r.FRAMEBUFFER&&(h[r.DRAW_FRAMEBUFFER]=ct),!0):!1}function Ut(N,ct){let Y=g,bt=!1;if(N){Y=f.get(ct),Y===void 0&&(Y=[],f.set(ct,Y));const ut=N.textures;if(Y.length!==ut.length||Y[0]!==r.COLOR_ATTACHMENT0){for(let tt=0,It=ut.length;tt<It;tt++)Y[tt]=r.COLOR_ATTACHMENT0+tt;Y.length=ut.length,bt=!0}}else Y[0]!==r.BACK&&(Y[0]=r.BACK,bt=!0);bt&&r.drawBuffers(Y)}function ie(N){return y!==N?(r.useProgram(N),y=N,!0):!1}const kt={[Jn]:r.FUNC_ADD,[dh]:r.FUNC_SUBTRACT,[uh]:r.FUNC_REVERSE_SUBTRACT};kt[fh]=r.MIN,kt[ph]=r.MAX;const Z={[mh]:r.ZERO,[gh]:r.ONE,[xh]:r.SRC_COLOR,[eo]:r.SRC_ALPHA,[bh]:r.SRC_ALPHA_SATURATE,[Sh]:r.DST_COLOR,[vh]:r.DST_ALPHA,[_h]:r.ONE_MINUS_SRC_COLOR,[no]:r.ONE_MINUS_SRC_ALPHA,[yh]:r.ONE_MINUS_DST_COLOR,[Mh]:r.ONE_MINUS_DST_ALPHA,[Eh]:r.CONSTANT_COLOR,[Th]:r.ONE_MINUS_CONSTANT_COLOR,[wh]:r.CONSTANT_ALPHA,[Ah]:r.ONE_MINUS_CONSTANT_ALPHA};function it(N,ct,Y,bt,ut,tt,It,qt,_e,le){if(N===Tn){p===!0&&(Pt(r.BLEND),p=!1);return}if(p===!1&&(at(r.BLEND),p=!0),N!==hh){if(N!==m||le!==D){if((x!==Jn||C!==Jn)&&(r.blendEquation(r.FUNC_ADD),x=Jn,C=Jn),le)switch(N){case bi:r.blendFuncSeparate(r.ONE,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case to:r.blendFunc(r.ONE,r.ONE);break;case Na:r.blendFuncSeparate(r.ZERO,r.ONE_MINUS_SRC_COLOR,r.ZERO,r.ONE);break;case Ua:r.blendFuncSeparate(r.DST_COLOR,r.ONE_MINUS_SRC_ALPHA,r.ZERO,r.ONE);break;default:ee("WebGLState: Invalid blending: ",N);break}else switch(N){case bi:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE_MINUS_SRC_ALPHA,r.ONE,r.ONE_MINUS_SRC_ALPHA);break;case to:r.blendFuncSeparate(r.SRC_ALPHA,r.ONE,r.ONE,r.ONE);break;case Na:ee("WebGLState: SubtractiveBlending requires material.premultipliedAlpha = true");break;case Ua:ee("WebGLState: MultiplyBlending requires material.premultipliedAlpha = true");break;default:ee("WebGLState: Invalid blending: ",N);break}M=null,S=null,w=null,R=null,v.set(0,0,0),A=0,m=N,D=le}return}ut=ut||ct,tt=tt||Y,It=It||bt,(ct!==x||ut!==C)&&(r.blendEquationSeparate(kt[ct],kt[ut]),x=ct,C=ut),(Y!==M||bt!==S||tt!==w||It!==R)&&(r.blendFuncSeparate(Z[Y],Z[bt],Z[tt],Z[It]),M=Y,S=bt,w=tt,R=It),(qt.equals(v)===!1||_e!==A)&&(r.blendColor(qt.r,qt.g,qt.b,_e),v.copy(qt),A=_e),m=N,D=!1}function j(N,ct){N.side===tn?Pt(r.CULL_FACE):at(r.CULL_FACE);let Y=N.side===Ge;ct&&(Y=!Y),_t(Y),N.blending===bi&&N.transparent===!1?it(Tn):it(N.blending,N.blendEquation,N.blendSrc,N.blendDst,N.blendEquationAlpha,N.blendSrcAlpha,N.blendDstAlpha,N.blendColor,N.blendAlpha,N.premultipliedAlpha),o.setFunc(N.depthFunc),o.setTest(N.depthTest),o.setMask(N.depthWrite),s.setMask(N.colorWrite);const bt=N.stencilWrite;a.setTest(bt),bt&&(a.setMask(N.stencilWriteMask),a.setFunc(N.stencilFunc,N.stencilRef,N.stencilFuncMask),a.setOp(N.stencilFail,N.stencilZFail,N.stencilZPass)),I(N.polygonOffset,N.polygonOffsetFactor,N.polygonOffsetUnits),N.alphaToCoverage===!0?at(r.SAMPLE_ALPHA_TO_COVERAGE):Pt(r.SAMPLE_ALPHA_TO_COVERAGE)}function _t(N){L!==N&&(N?r.frontFace(r.CW):r.frontFace(r.CCW),L=N)}function ft(N){N!==ah?(at(r.CULL_FACE),N!==O&&(N===Da?r.cullFace(r.BACK):N===lh?r.cullFace(r.FRONT):r.cullFace(r.FRONT_AND_BACK))):Pt(r.CULL_FACE),O=N}function zt(N){N!==W&&(k&&r.lineWidth(N),W=N)}function I(N,ct,Y){N?(at(r.POLYGON_OFFSET_FILL),(q!==ct||U!==Y)&&(q=ct,U=Y,o.getReversed()&&(ct=-ct),r.polygonOffset(ct,Y))):Pt(r.POLYGON_OFFSET_FILL)}function Ht(N){N?at(r.SCISSOR_TEST):Pt(r.SCISSOR_TEST)}function Ct(N){N===void 0&&(N=r.TEXTURE0+V-1),pt!==N&&(r.activeTexture(N),pt=N)}function Gt(N,ct,Y){Y===void 0&&(pt===null?Y=r.TEXTURE0+V-1:Y=pt);let bt=St[Y];bt===void 0&&(bt={type:void 0,texture:void 0},St[Y]=bt),(bt.type!==N||bt.texture!==ct)&&(pt!==Y&&(r.activeTexture(Y),pt=Y),r.bindTexture(N,ct||gt[N]),bt.type=N,bt.texture=ct)}function st(){const N=St[pt];N!==void 0&&N.type!==void 0&&(r.bindTexture(N.type,null),N.type=void 0,N.texture=void 0)}function oe(){try{r.compressedTexImage2D(...arguments)}catch(N){ee("WebGLState:",N)}}function T(){try{r.compressedTexImage3D(...arguments)}catch(N){ee("WebGLState:",N)}}function _(){try{r.texSubImage2D(...arguments)}catch(N){ee("WebGLState:",N)}}function B(){try{r.texSubImage3D(...arguments)}catch(N){ee("WebGLState:",N)}}function $(){try{r.compressedTexSubImage2D(...arguments)}catch(N){ee("WebGLState:",N)}}function Q(){try{r.compressedTexSubImage3D(...arguments)}catch(N){ee("WebGLState:",N)}}function rt(){try{r.texStorage2D(...arguments)}catch(N){ee("WebGLState:",N)}}function ht(){try{r.texStorage3D(...arguments)}catch(N){ee("WebGLState:",N)}}function X(){try{r.texImage2D(...arguments)}catch(N){ee("WebGLState:",N)}}function K(){try{r.texImage3D(...arguments)}catch(N){ee("WebGLState:",N)}}function Mt(N){return u[N]!==void 0?u[N]:r.getParameter(N)}function Tt(N,ct){u[N]!==ct&&(r.pixelStorei(N,ct),u[N]=ct)}function dt(N){ne.equals(N)===!1&&(r.scissor(N.x,N.y,N.z,N.w),ne.copy(N))}function lt(N){Vt.equals(N)===!1&&(r.viewport(N.x,N.y,N.z,N.w),Vt.copy(N))}function Wt(N,ct){let Y=c.get(ct);Y===void 0&&(Y=new WeakMap,c.set(ct,Y));let bt=Y.get(N);bt===void 0&&(bt=r.getUniformBlockIndex(ct,N.name),Y.set(N,bt))}function Kt(N,ct){const bt=c.get(ct).get(N);l.get(ct)!==bt&&(r.uniformBlockBinding(ct,bt,N.__bindingPointIndex),l.set(ct,bt))}function re(){r.disable(r.BLEND),r.disable(r.CULL_FACE),r.disable(r.DEPTH_TEST),r.disable(r.POLYGON_OFFSET_FILL),r.disable(r.SCISSOR_TEST),r.disable(r.STENCIL_TEST),r.disable(r.SAMPLE_ALPHA_TO_COVERAGE),r.blendEquation(r.FUNC_ADD),r.blendFunc(r.ONE,r.ZERO),r.blendFuncSeparate(r.ONE,r.ZERO,r.ONE,r.ZERO),r.blendColor(0,0,0,0),r.colorMask(!0,!0,!0,!0),r.clearColor(0,0,0,0),r.depthMask(!0),r.depthFunc(r.LESS),o.setReversed(!1),r.clearDepth(1),r.stencilMask(4294967295),r.stencilFunc(r.ALWAYS,0,4294967295),r.stencilOp(r.KEEP,r.KEEP,r.KEEP),r.clearStencil(0),r.cullFace(r.BACK),r.frontFace(r.CCW),r.polygonOffset(0,0),r.activeTexture(r.TEXTURE0),r.bindFramebuffer(r.FRAMEBUFFER,null),r.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),r.bindFramebuffer(r.READ_FRAMEBUFFER,null),r.useProgram(null),r.lineWidth(1),r.scissor(0,0,r.canvas.width,r.canvas.height),r.viewport(0,0,r.canvas.width,r.canvas.height),r.pixelStorei(r.PACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_ALIGNMENT,4),r.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,!1),r.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,!1),r.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,r.BROWSER_DEFAULT_WEBGL),r.pixelStorei(r.PACK_ROW_LENGTH,0),r.pixelStorei(r.PACK_SKIP_PIXELS,0),r.pixelStorei(r.PACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_ROW_LENGTH,0),r.pixelStorei(r.UNPACK_IMAGE_HEIGHT,0),r.pixelStorei(r.UNPACK_SKIP_PIXELS,0),r.pixelStorei(r.UNPACK_SKIP_ROWS,0),r.pixelStorei(r.UNPACK_SKIP_IMAGES,0),d={},u={},pt=null,St={},h={},f=new WeakMap,g=[],y=null,p=!1,m=null,x=null,M=null,S=null,C=null,w=null,R=null,v=new yt(0,0,0),A=0,D=!1,L=null,O=null,W=null,q=null,U=null,ne.set(0,0,r.canvas.width,r.canvas.height),Vt.set(0,0,r.canvas.width,r.canvas.height),s.reset(),o.reset(),a.reset()}return{buffers:{color:s,depth:o,stencil:a},enable:at,disable:Pt,bindFramebuffer:Ot,drawBuffers:Ut,useProgram:ie,setBlending:it,setMaterial:j,setFlipSided:_t,setCullFace:ft,setLineWidth:zt,setPolygonOffset:I,setScissorTest:Ht,activeTexture:Ct,bindTexture:Gt,unbindTexture:st,compressedTexImage2D:oe,compressedTexImage3D:T,texImage2D:X,texImage3D:K,pixelStorei:Tt,getParameter:Mt,updateUBOMapping:Wt,uniformBlockBinding:Kt,texStorage2D:rt,texStorage3D:ht,texSubImage2D:_,texSubImage3D:B,compressedTexSubImage2D:$,compressedTexSubImage3D:Q,scissor:dt,viewport:lt,reset:re}}function H0(r,t,e,n,i,s,o){const a=t.has("WEBGL_multisampled_render_to_texture")?t.get("WEBGL_multisampled_render_to_texture"):null,l=typeof navigator>"u"?!1:/OculusBrowser/g.test(navigator.userAgent),c=new ot,d=new WeakMap,u=new Set;let h;const f=new WeakMap;let g=!1;try{g=typeof OffscreenCanvas<"u"&&new OffscreenCanvas(1,1).getContext("2d")!==null}catch{}function y(T,_){return g?new OffscreenCanvas(T,_):Qs("canvas")}function p(T,_,B){let $=1;const Q=oe(T);if((Q.width>B||Q.height>B)&&($=B/Math.max(Q.width,Q.height)),$<1)if(typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement||typeof HTMLCanvasElement<"u"&&T instanceof HTMLCanvasElement||typeof ImageBitmap<"u"&&T instanceof ImageBitmap||typeof VideoFrame<"u"&&T instanceof VideoFrame){const rt=Math.floor($*Q.width),ht=Math.floor($*Q.height);h===void 0&&(h=y(rt,ht));const X=_?y(rt,ht):h;return X.width=rt,X.height=ht,X.getContext("2d").drawImage(T,0,0,rt,ht),Bt("WebGLRenderer: Texture has been resized from ("+Q.width+"x"+Q.height+") to ("+rt+"x"+ht+")."),X}else return"data"in T&&Bt("WebGLRenderer: Image in DataTexture is too big ("+Q.width+"x"+Q.height+")."),T;return T}function m(T){return T.generateMipmaps}function x(T){r.generateMipmap(T)}function M(T){return T.isWebGLCubeRenderTarget?r.TEXTURE_CUBE_MAP:T.isWebGL3DRenderTarget?r.TEXTURE_3D:T.isWebGLArrayRenderTarget||T.isCompressedArrayTexture?r.TEXTURE_2D_ARRAY:r.TEXTURE_2D}function S(T,_,B,$,Q,rt=!1){if(T!==null){if(r[T]!==void 0)return r[T];Bt("WebGLRenderer: Attempt to use non-existing WebGL internal format '"+T+"'")}let ht;$&&(ht=t.get("EXT_texture_norm16"),ht||Bt("WebGLRenderer: Unable to use normalized textures without EXT_texture_norm16 extension"));let X=_;if(_===r.RED&&(B===r.FLOAT&&(X=r.R32F),B===r.HALF_FLOAT&&(X=r.R16F),B===r.UNSIGNED_BYTE&&(X=r.R8),B===r.UNSIGNED_SHORT&&ht&&(X=ht.R16_EXT),B===r.SHORT&&ht&&(X=ht.R16_SNORM_EXT)),_===r.RED_INTEGER&&(B===r.UNSIGNED_BYTE&&(X=r.R8UI),B===r.UNSIGNED_SHORT&&(X=r.R16UI),B===r.UNSIGNED_INT&&(X=r.R32UI),B===r.BYTE&&(X=r.R8I),B===r.SHORT&&(X=r.R16I),B===r.INT&&(X=r.R32I)),_===r.RG&&(B===r.FLOAT&&(X=r.RG32F),B===r.HALF_FLOAT&&(X=r.RG16F),B===r.UNSIGNED_BYTE&&(X=r.RG8),B===r.UNSIGNED_SHORT&&ht&&(X=ht.RG16_EXT),B===r.SHORT&&ht&&(X=ht.RG16_SNORM_EXT)),_===r.RG_INTEGER&&(B===r.UNSIGNED_BYTE&&(X=r.RG8UI),B===r.UNSIGNED_SHORT&&(X=r.RG16UI),B===r.UNSIGNED_INT&&(X=r.RG32UI),B===r.BYTE&&(X=r.RG8I),B===r.SHORT&&(X=r.RG16I),B===r.INT&&(X=r.RG32I)),_===r.RGB_INTEGER&&(B===r.UNSIGNED_BYTE&&(X=r.RGB8UI),B===r.UNSIGNED_SHORT&&(X=r.RGB16UI),B===r.UNSIGNED_INT&&(X=r.RGB32UI),B===r.BYTE&&(X=r.RGB8I),B===r.SHORT&&(X=r.RGB16I),B===r.INT&&(X=r.RGB32I)),_===r.RGBA_INTEGER&&(B===r.UNSIGNED_BYTE&&(X=r.RGBA8UI),B===r.UNSIGNED_SHORT&&(X=r.RGBA16UI),B===r.UNSIGNED_INT&&(X=r.RGBA32UI),B===r.BYTE&&(X=r.RGBA8I),B===r.SHORT&&(X=r.RGBA16I),B===r.INT&&(X=r.RGBA32I)),_===r.RGB&&(B===r.UNSIGNED_SHORT&&ht&&(X=ht.RGB16_EXT),B===r.SHORT&&ht&&(X=ht.RGB16_SNORM_EXT),B===r.UNSIGNED_INT_5_9_9_9_REV&&(X=r.RGB9_E5),B===r.UNSIGNED_INT_10F_11F_11F_REV&&(X=r.R11F_G11F_B10F)),_===r.RGBA){const K=rt?js:te.getTransfer(Q);B===r.FLOAT&&(X=r.RGBA32F),B===r.HALF_FLOAT&&(X=r.RGBA16F),B===r.UNSIGNED_BYTE&&(X=K===ae?r.SRGB8_ALPHA8:r.RGBA8),B===r.UNSIGNED_SHORT&&ht&&(X=ht.RGBA16_EXT),B===r.SHORT&&ht&&(X=ht.RGBA16_SNORM_EXT),B===r.UNSIGNED_SHORT_4_4_4_4&&(X=r.RGBA4),B===r.UNSIGNED_SHORT_5_5_5_1&&(X=r.RGB5_A1)}return(X===r.R16F||X===r.R32F||X===r.RG16F||X===r.RG32F||X===r.RGBA16F||X===r.RGBA32F)&&t.get("EXT_color_buffer_float"),X}function C(T,_){let B;return T?_===null||_===pn||_===Qi?B=r.DEPTH24_STENCIL8:_===nn?B=r.DEPTH32F_STENCIL8:_===ji&&(B=r.DEPTH24_STENCIL8,Bt("DepthTexture: 16 bit depth attachment is not supported with stencil. Using 24-bit attachment.")):_===null||_===pn||_===Qi?B=r.DEPTH_COMPONENT24:_===nn?B=r.DEPTH_COMPONENT32F:_===ji&&(B=r.DEPTH_COMPONENT16),B}function w(T,_){return m(T)===!0||T.isFramebufferTexture&&T.minFilter!==Ee&&T.minFilter!==Ne?Math.log2(Math.max(_.width,_.height))+1:T.mipmaps!==void 0&&T.mipmaps.length>0?T.mipmaps.length:T.isCompressedTexture&&Array.isArray(T.image)?_.mipmaps.length:1}function R(T){const _=T.target;_.removeEventListener("dispose",R),A(_),_.isVideoTexture&&d.delete(_),_.isHTMLTexture&&u.delete(_)}function v(T){const _=T.target;_.removeEventListener("dispose",v),L(_)}function A(T){const _=n.get(T);if(_.__webglInit===void 0)return;const B=T.source,$=f.get(B);if($){const Q=$[_.__cacheKey];Q.usedTimes--,Q.usedTimes===0&&D(T),Object.keys($).length===0&&f.delete(B)}n.remove(T)}function D(T){const _=n.get(T);r.deleteTexture(_.__webglTexture);const B=T.source,$=f.get(B);delete $[_.__cacheKey],o.memory.textures--}function L(T){const _=n.get(T);if(T.depthTexture&&(T.depthTexture.dispose(),n.remove(T.depthTexture)),T.isWebGLCubeRenderTarget)for(let $=0;$<6;$++){if(Array.isArray(_.__webglFramebuffer[$]))for(let Q=0;Q<_.__webglFramebuffer[$].length;Q++)r.deleteFramebuffer(_.__webglFramebuffer[$][Q]);else r.deleteFramebuffer(_.__webglFramebuffer[$]);_.__webglDepthbuffer&&r.deleteRenderbuffer(_.__webglDepthbuffer[$])}else{if(Array.isArray(_.__webglFramebuffer))for(let $=0;$<_.__webglFramebuffer.length;$++)r.deleteFramebuffer(_.__webglFramebuffer[$]);else r.deleteFramebuffer(_.__webglFramebuffer);if(_.__webglDepthbuffer&&r.deleteRenderbuffer(_.__webglDepthbuffer),_.__webglMultisampledFramebuffer&&r.deleteFramebuffer(_.__webglMultisampledFramebuffer),_.__webglColorRenderbuffer)for(let $=0;$<_.__webglColorRenderbuffer.length;$++)_.__webglColorRenderbuffer[$]&&r.deleteRenderbuffer(_.__webglColorRenderbuffer[$]);_.__webglDepthRenderbuffer&&r.deleteRenderbuffer(_.__webglDepthRenderbuffer)}const B=T.textures;for(let $=0,Q=B.length;$<Q;$++){const rt=n.get(B[$]);rt.__webglTexture&&(r.deleteTexture(rt.__webglTexture),o.memory.textures--),n.remove(B[$])}n.remove(T)}let O=0;function W(){O=0}function q(){return O}function U(T){O=T}function V(){const T=O;return T>=i.maxTextures&&Bt("WebGLTextures: Trying to use "+T+" texture units while this GPU supports only "+i.maxTextures),O+=1,T}function k(T){const _=[];return _.push(T.wrapS),_.push(T.wrapT),_.push(T.wrapR||0),_.push(T.magFilter),_.push(T.minFilter),_.push(T.anisotropy),_.push(T.internalFormat),_.push(T.format),_.push(T.type),_.push(T.generateMipmaps),_.push(T.premultiplyAlpha),_.push(T.flipY),_.push(T.unpackAlignment),_.push(T.colorSpace),_.join()}function et(T,_){const B=n.get(T);if(T.isVideoTexture&&Gt(T),T.isRenderTargetTexture===!1&&T.isExternalTexture!==!0&&T.version>0&&B.__version!==T.version){const $=T.image;if($===null)Bt("WebGLRenderer: Texture marked for update but no image data found.");else if($.complete===!1)Bt("WebGLRenderer: Texture marked for update but image is incomplete");else{Pt(B,T,_);return}}else T.isExternalTexture&&(B.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(r.TEXTURE_2D,B.__webglTexture,r.TEXTURE0+_)}function nt(T,_){const B=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){Pt(B,T,_);return}else T.isExternalTexture&&(B.__webglTexture=T.sourceTexture?T.sourceTexture:null);e.bindTexture(r.TEXTURE_2D_ARRAY,B.__webglTexture,r.TEXTURE0+_)}function pt(T,_){const B=n.get(T);if(T.isRenderTargetTexture===!1&&T.version>0&&B.__version!==T.version){Pt(B,T,_);return}e.bindTexture(r.TEXTURE_3D,B.__webglTexture,r.TEXTURE0+_)}function St(T,_){const B=n.get(T);if(T.isCubeDepthTexture!==!0&&T.version>0&&B.__version!==T.version){Ot(B,T,_);return}e.bindTexture(r.TEXTURE_CUBE_MAP,B.__webglTexture,r.TEXTURE0+_)}const At={[An]:r.REPEAT,[En]:r.CLAMP_TO_EDGE,[ho]:r.MIRRORED_REPEAT},$t={[Ee]:r.NEAREST,[Ph]:r.NEAREST_MIPMAP_NEAREST,[ls]:r.NEAREST_MIPMAP_LINEAR,[Ne]:r.LINEAR,[ur]:r.LINEAR_MIPMAP_NEAREST,[jn]:r.LINEAR_MIPMAP_LINEAR},ne={[Dh]:r.NEVER,[Bh]:r.ALWAYS,[Nh]:r.LESS,[oa]:r.LEQUAL,[Uh]:r.EQUAL,[aa]:r.GEQUAL,[Fh]:r.GREATER,[Oh]:r.NOTEQUAL};function Vt(T,_){if(_.type===nn&&t.has("OES_texture_float_linear")===!1&&(_.magFilter===Ne||_.magFilter===ur||_.magFilter===ls||_.magFilter===jn||_.minFilter===Ne||_.minFilter===ur||_.minFilter===ls||_.minFilter===jn)&&Bt("WebGLRenderer: Unable to use linear filtering with floating point textures. OES_texture_float_linear not supported on this device."),r.texParameteri(T,r.TEXTURE_WRAP_S,At[_.wrapS]),r.texParameteri(T,r.TEXTURE_WRAP_T,At[_.wrapT]),(T===r.TEXTURE_3D||T===r.TEXTURE_2D_ARRAY)&&r.texParameteri(T,r.TEXTURE_WRAP_R,At[_.wrapR]),r.texParameteri(T,r.TEXTURE_MAG_FILTER,$t[_.magFilter]),r.texParameteri(T,r.TEXTURE_MIN_FILTER,$t[_.minFilter]),_.compareFunction&&(r.texParameteri(T,r.TEXTURE_COMPARE_MODE,r.COMPARE_REF_TO_TEXTURE),r.texParameteri(T,r.TEXTURE_COMPARE_FUNC,ne[_.compareFunction])),t.has("EXT_texture_filter_anisotropic")===!0){if(_.magFilter===Ee||_.minFilter!==ls&&_.minFilter!==jn||_.type===nn&&t.has("OES_texture_float_linear")===!1)return;if(_.anisotropy>1||n.get(_).__currentAnisotropy){const B=t.get("EXT_texture_filter_anisotropic");r.texParameterf(T,B.TEXTURE_MAX_ANISOTROPY_EXT,Math.min(_.anisotropy,i.getMaxAnisotropy())),n.get(_).__currentAnisotropy=_.anisotropy}}}function J(T,_){let B=!1;T.__webglInit===void 0&&(T.__webglInit=!0,_.addEventListener("dispose",R));const $=_.source;let Q=f.get($);Q===void 0&&(Q={},f.set($,Q));const rt=k(_);if(rt!==T.__cacheKey){Q[rt]===void 0&&(Q[rt]={texture:r.createTexture(),usedTimes:0},o.memory.textures++,B=!0),Q[rt].usedTimes++;const ht=Q[T.__cacheKey];ht!==void 0&&(Q[T.__cacheKey].usedTimes--,ht.usedTimes===0&&D(_)),T.__cacheKey=rt,T.__webglTexture=Q[rt].texture}return B}function gt(T,_,B){return Math.floor(Math.floor(T/B)/_)}function at(T,_,B,$){const rt=T.updateRanges;if(rt.length===0)e.texSubImage2D(r.TEXTURE_2D,0,0,0,_.width,_.height,B,$,_.data);else{rt.sort((Tt,dt)=>Tt.start-dt.start);let ht=0;for(let Tt=1;Tt<rt.length;Tt++){const dt=rt[ht],lt=rt[Tt],Wt=dt.start+dt.count,Kt=gt(lt.start,_.width,4),re=gt(dt.start,_.width,4);lt.start<=Wt+1&&Kt===re&&gt(lt.start+lt.count-1,_.width,4)===Kt?dt.count=Math.max(dt.count,lt.start+lt.count-dt.start):(++ht,rt[ht]=lt)}rt.length=ht+1;const X=e.getParameter(r.UNPACK_ROW_LENGTH),K=e.getParameter(r.UNPACK_SKIP_PIXELS),Mt=e.getParameter(r.UNPACK_SKIP_ROWS);e.pixelStorei(r.UNPACK_ROW_LENGTH,_.width);for(let Tt=0,dt=rt.length;Tt<dt;Tt++){const lt=rt[Tt],Wt=Math.floor(lt.start/4),Kt=Math.ceil(lt.count/4),re=Wt%_.width,N=Math.floor(Wt/_.width),ct=Kt,Y=1;e.pixelStorei(r.UNPACK_SKIP_PIXELS,re),e.pixelStorei(r.UNPACK_SKIP_ROWS,N),e.texSubImage2D(r.TEXTURE_2D,0,re,N,ct,Y,B,$,_.data)}T.clearUpdateRanges(),e.pixelStorei(r.UNPACK_ROW_LENGTH,X),e.pixelStorei(r.UNPACK_SKIP_PIXELS,K),e.pixelStorei(r.UNPACK_SKIP_ROWS,Mt)}}function Pt(T,_,B){let $=r.TEXTURE_2D;(_.isDataArrayTexture||_.isCompressedArrayTexture)&&($=r.TEXTURE_2D_ARRAY),_.isData3DTexture&&($=r.TEXTURE_3D);const Q=J(T,_),rt=_.source;e.bindTexture($,T.__webglTexture,r.TEXTURE0+B);const ht=n.get(rt);if(rt.version!==ht.__version||Q===!0){if(e.activeTexture(r.TEXTURE0+B),(typeof ImageBitmap<"u"&&_.image instanceof ImageBitmap)===!1){const Y=te.getPrimaries(te.workingColorSpace),bt=_.colorSpace===kn?null:te.getPrimaries(_.colorSpace),ut=_.colorSpace===kn||Y===bt?r.NONE:r.BROWSER_DEFAULT_WEBGL;e.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,ut)}e.pixelStorei(r.UNPACK_ALIGNMENT,_.unpackAlignment);let K=p(_.image,!1,i.maxTextureSize);K=st(_,K);const Mt=s.convert(_.format,_.colorSpace),Tt=s.convert(_.type);let dt=S(_.internalFormat,Mt,Tt,_.normalized,_.colorSpace,_.isVideoTexture);Vt($,_);let lt;const Wt=_.mipmaps,Kt=_.isVideoTexture!==!0,re=ht.__version===void 0||Q===!0,N=rt.dataReady,ct=w(_,K);if(_.isDepthTexture)dt=C(_.format===Qn,_.type),re&&(Kt?e.texStorage2D(r.TEXTURE_2D,1,dt,K.width,K.height):e.texImage2D(r.TEXTURE_2D,0,dt,K.width,K.height,0,Mt,Tt,null));else if(_.isDataTexture)if(Wt.length>0){Kt&&re&&e.texStorage2D(r.TEXTURE_2D,ct,dt,Wt[0].width,Wt[0].height);for(let Y=0,bt=Wt.length;Y<bt;Y++)lt=Wt[Y],Kt?N&&e.texSubImage2D(r.TEXTURE_2D,Y,0,0,lt.width,lt.height,Mt,Tt,lt.data):e.texImage2D(r.TEXTURE_2D,Y,dt,lt.width,lt.height,0,Mt,Tt,lt.data);_.generateMipmaps=!1}else Kt?(re&&e.texStorage2D(r.TEXTURE_2D,ct,dt,K.width,K.height),N&&at(_,K,Mt,Tt)):e.texImage2D(r.TEXTURE_2D,0,dt,K.width,K.height,0,Mt,Tt,K.data);else if(_.isCompressedTexture)if(_.isCompressedArrayTexture){Kt&&re&&e.texStorage3D(r.TEXTURE_2D_ARRAY,ct,dt,Wt[0].width,Wt[0].height,K.depth);for(let Y=0,bt=Wt.length;Y<bt;Y++)if(lt=Wt[Y],_.format!==Je)if(Mt!==null)if(Kt){if(N)if(_.layerUpdates.size>0){const ut=Ml(lt.width,lt.height,_.format,_.type);for(const tt of _.layerUpdates){const It=lt.data.subarray(tt*ut/lt.data.BYTES_PER_ELEMENT,(tt+1)*ut/lt.data.BYTES_PER_ELEMENT);e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Y,0,0,tt,lt.width,lt.height,1,Mt,It)}_.clearLayerUpdates()}else e.compressedTexSubImage3D(r.TEXTURE_2D_ARRAY,Y,0,0,0,lt.width,lt.height,K.depth,Mt,lt.data)}else e.compressedTexImage3D(r.TEXTURE_2D_ARRAY,Y,dt,lt.width,lt.height,K.depth,0,lt.data,0,0);else Bt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()");else Kt?N&&e.texSubImage3D(r.TEXTURE_2D_ARRAY,Y,0,0,0,lt.width,lt.height,K.depth,Mt,Tt,lt.data):e.texImage3D(r.TEXTURE_2D_ARRAY,Y,dt,lt.width,lt.height,K.depth,0,Mt,Tt,lt.data)}else{Kt&&re&&e.texStorage2D(r.TEXTURE_2D,ct,dt,Wt[0].width,Wt[0].height);for(let Y=0,bt=Wt.length;Y<bt;Y++)lt=Wt[Y],_.format!==Je?Mt!==null?Kt?N&&e.compressedTexSubImage2D(r.TEXTURE_2D,Y,0,0,lt.width,lt.height,Mt,lt.data):e.compressedTexImage2D(r.TEXTURE_2D,Y,dt,lt.width,lt.height,0,lt.data):Bt("WebGLRenderer: Attempt to load unsupported compressed texture format in .uploadTexture()"):Kt?N&&e.texSubImage2D(r.TEXTURE_2D,Y,0,0,lt.width,lt.height,Mt,Tt,lt.data):e.texImage2D(r.TEXTURE_2D,Y,dt,lt.width,lt.height,0,Mt,Tt,lt.data)}else if(_.isDataArrayTexture)if(Kt){if(re&&e.texStorage3D(r.TEXTURE_2D_ARRAY,ct,dt,K.width,K.height,K.depth),N)if(_.layerUpdates.size>0){const Y=Ml(K.width,K.height,_.format,_.type);for(const bt of _.layerUpdates){const ut=K.data.subarray(bt*Y/K.data.BYTES_PER_ELEMENT,(bt+1)*Y/K.data.BYTES_PER_ELEMENT);e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,bt,K.width,K.height,1,Mt,Tt,ut)}_.clearLayerUpdates()}else e.texSubImage3D(r.TEXTURE_2D_ARRAY,0,0,0,0,K.width,K.height,K.depth,Mt,Tt,K.data)}else e.texImage3D(r.TEXTURE_2D_ARRAY,0,dt,K.width,K.height,K.depth,0,Mt,Tt,K.data);else if(_.isData3DTexture)Kt?(re&&e.texStorage3D(r.TEXTURE_3D,ct,dt,K.width,K.height,K.depth),N&&e.texSubImage3D(r.TEXTURE_3D,0,0,0,0,K.width,K.height,K.depth,Mt,Tt,K.data)):e.texImage3D(r.TEXTURE_3D,0,dt,K.width,K.height,K.depth,0,Mt,Tt,K.data);else if(_.isFramebufferTexture){if(re)if(Kt)e.texStorage2D(r.TEXTURE_2D,ct,dt,K.width,K.height);else{let Y=K.width,bt=K.height;for(let ut=0;ut<ct;ut++)e.texImage2D(r.TEXTURE_2D,ut,dt,Y,bt,0,Mt,Tt,null),Y>>=1,bt>>=1}}else if(_.isHTMLTexture){if("texElementImage2D"in r){const Y=r.canvas;if(Y.hasAttribute("layoutsubtree")||Y.setAttribute("layoutsubtree","true"),K.parentNode!==Y){Y.appendChild(K),u.add(_),Y.onpaint=qt=>{const _e=qt.changedElements;for(const le of u)_e.includes(le.image)&&(le.needsUpdate=!0)},Y.requestPaint();return}const bt=0,ut=r.RGBA,tt=r.RGBA,It=r.UNSIGNED_BYTE;r.texElementImage2D(r.TEXTURE_2D,bt,ut,tt,It,K),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_MIN_FILTER,r.LINEAR),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_S,r.CLAMP_TO_EDGE),r.texParameteri(r.TEXTURE_2D,r.TEXTURE_WRAP_T,r.CLAMP_TO_EDGE)}}else if(Wt.length>0){if(Kt&&re){const Y=oe(Wt[0]);e.texStorage2D(r.TEXTURE_2D,ct,dt,Y.width,Y.height)}for(let Y=0,bt=Wt.length;Y<bt;Y++)lt=Wt[Y],Kt?N&&e.texSubImage2D(r.TEXTURE_2D,Y,0,0,Mt,Tt,lt):e.texImage2D(r.TEXTURE_2D,Y,dt,Mt,Tt,lt);_.generateMipmaps=!1}else if(Kt){if(re){const Y=oe(K);e.texStorage2D(r.TEXTURE_2D,ct,dt,Y.width,Y.height)}N&&e.texSubImage2D(r.TEXTURE_2D,0,0,0,Mt,Tt,K)}else e.texImage2D(r.TEXTURE_2D,0,dt,Mt,Tt,K);m(_)&&x($),ht.__version=rt.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Ot(T,_,B){if(_.image.length!==6)return;const $=J(T,_),Q=_.source;e.bindTexture(r.TEXTURE_CUBE_MAP,T.__webglTexture,r.TEXTURE0+B);const rt=n.get(Q);if(Q.version!==rt.__version||$===!0){e.activeTexture(r.TEXTURE0+B);const ht=te.getPrimaries(te.workingColorSpace),X=_.colorSpace===kn?null:te.getPrimaries(_.colorSpace),K=_.colorSpace===kn||ht===X?r.NONE:r.BROWSER_DEFAULT_WEBGL;e.pixelStorei(r.UNPACK_FLIP_Y_WEBGL,_.flipY),e.pixelStorei(r.UNPACK_PREMULTIPLY_ALPHA_WEBGL,_.premultiplyAlpha),e.pixelStorei(r.UNPACK_ALIGNMENT,_.unpackAlignment),e.pixelStorei(r.UNPACK_COLORSPACE_CONVERSION_WEBGL,K);const Mt=_.isCompressedTexture||_.image[0].isCompressedTexture,Tt=_.image[0]&&_.image[0].isDataTexture,dt=[];for(let tt=0;tt<6;tt++)!Mt&&!Tt?dt[tt]=p(_.image[tt],!0,i.maxCubemapSize):dt[tt]=Tt?_.image[tt].image:_.image[tt],dt[tt]=st(_,dt[tt]);const lt=dt[0],Wt=s.convert(_.format,_.colorSpace),Kt=s.convert(_.type),re=S(_.internalFormat,Wt,Kt,_.normalized,_.colorSpace),N=_.isVideoTexture!==!0,ct=rt.__version===void 0||$===!0,Y=Q.dataReady;let bt=w(_,lt);Vt(r.TEXTURE_CUBE_MAP,_);let ut;if(Mt){N&&ct&&e.texStorage2D(r.TEXTURE_CUBE_MAP,bt,re,lt.width,lt.height);for(let tt=0;tt<6;tt++){ut=dt[tt].mipmaps;for(let It=0;It<ut.length;It++){const qt=ut[It];_.format!==Je?Wt!==null?N?Y&&e.compressedTexSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It,0,0,qt.width,qt.height,Wt,qt.data):e.compressedTexImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It,re,qt.width,qt.height,0,qt.data):Bt("WebGLRenderer: Attempt to load unsupported compressed texture format in .setTextureCube()"):N?Y&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It,0,0,qt.width,qt.height,Wt,Kt,qt.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It,re,qt.width,qt.height,0,Wt,Kt,qt.data)}}}else{if(ut=_.mipmaps,N&&ct){ut.length>0&&bt++;const tt=oe(dt[0]);e.texStorage2D(r.TEXTURE_CUBE_MAP,bt,re,tt.width,tt.height)}for(let tt=0;tt<6;tt++)if(Tt){N?Y&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,dt[tt].width,dt[tt].height,Wt,Kt,dt[tt].data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,re,dt[tt].width,dt[tt].height,0,Wt,Kt,dt[tt].data);for(let It=0;It<ut.length;It++){const _e=ut[It].image[tt].image;N?Y&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It+1,0,0,_e.width,_e.height,Wt,Kt,_e.data):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It+1,re,_e.width,_e.height,0,Wt,Kt,_e.data)}}else{N?Y&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,0,0,Wt,Kt,dt[tt]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,0,re,Wt,Kt,dt[tt]);for(let It=0;It<ut.length;It++){const qt=ut[It];N?Y&&e.texSubImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It+1,0,0,Wt,Kt,qt.image[tt]):e.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+tt,It+1,re,Wt,Kt,qt.image[tt])}}}m(_)&&x(r.TEXTURE_CUBE_MAP),rt.__version=Q.version,_.onUpdate&&_.onUpdate(_)}T.__version=_.version}function Ut(T,_,B,$,Q,rt){const ht=s.convert(B.format,B.colorSpace),X=s.convert(B.type),K=S(B.internalFormat,ht,X,B.normalized,B.colorSpace),Mt=n.get(_),Tt=n.get(B);if(Tt.__renderTarget=_,!Mt.__hasExternalTextures){const dt=Math.max(1,_.width>>rt),lt=Math.max(1,_.height>>rt);Q===r.TEXTURE_3D||Q===r.TEXTURE_2D_ARRAY?e.texImage3D(Q,rt,K,dt,lt,_.depth,0,ht,X,null):e.texImage2D(Q,rt,K,dt,lt,0,ht,X,null)}e.bindFramebuffer(r.FRAMEBUFFER,T),Ct(_)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,$,Q,Tt.__webglTexture,0,Ht(_)):(Q===r.TEXTURE_2D||Q>=r.TEXTURE_CUBE_MAP_POSITIVE_X&&Q<=r.TEXTURE_CUBE_MAP_NEGATIVE_Z)&&r.framebufferTexture2D(r.FRAMEBUFFER,$,Q,Tt.__webglTexture,rt),e.bindFramebuffer(r.FRAMEBUFFER,null)}function ie(T,_,B){if(r.bindRenderbuffer(r.RENDERBUFFER,T),_.depthBuffer){const $=_.depthTexture,Q=$&&$.isDepthTexture?$.type:null,rt=C(_.stencilBuffer,Q),ht=_.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;Ct(_)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ht(_),rt,_.width,_.height):B?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ht(_),rt,_.width,_.height):r.renderbufferStorage(r.RENDERBUFFER,rt,_.width,_.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,ht,r.RENDERBUFFER,T)}else{const $=_.textures;for(let Q=0;Q<$.length;Q++){const rt=$[Q],ht=s.convert(rt.format,rt.colorSpace),X=s.convert(rt.type),K=S(rt.internalFormat,ht,X,rt.normalized,rt.colorSpace);Ct(_)?a.renderbufferStorageMultisampleEXT(r.RENDERBUFFER,Ht(_),K,_.width,_.height):B?r.renderbufferStorageMultisample(r.RENDERBUFFER,Ht(_),K,_.width,_.height):r.renderbufferStorage(r.RENDERBUFFER,K,_.width,_.height)}}r.bindRenderbuffer(r.RENDERBUFFER,null)}function kt(T,_,B){const $=_.isWebGLCubeRenderTarget===!0;if(e.bindFramebuffer(r.FRAMEBUFFER,T),!(_.depthTexture&&_.depthTexture.isDepthTexture))throw new Error("renderTarget.depthTexture must be an instance of THREE.DepthTexture");const Q=n.get(_.depthTexture);if(Q.__renderTarget=_,(!Q.__webglTexture||_.depthTexture.image.width!==_.width||_.depthTexture.image.height!==_.height)&&(_.depthTexture.image.width=_.width,_.depthTexture.image.height=_.height,_.depthTexture.needsUpdate=!0),$){if(Q.__webglInit===void 0&&(Q.__webglInit=!0,_.depthTexture.addEventListener("dispose",R)),Q.__webglTexture===void 0){Q.__webglTexture=r.createTexture(),e.bindTexture(r.TEXTURE_CUBE_MAP,Q.__webglTexture),Vt(r.TEXTURE_CUBE_MAP,_.depthTexture);const Mt=s.convert(_.depthTexture.format),Tt=s.convert(_.depthTexture.type);let dt;_.depthTexture.format===Rn?dt=r.DEPTH_COMPONENT24:_.depthTexture.format===Qn&&(dt=r.DEPTH24_STENCIL8);for(let lt=0;lt<6;lt++)r.texImage2D(r.TEXTURE_CUBE_MAP_POSITIVE_X+lt,0,dt,_.width,_.height,0,Mt,Tt,null)}}else et(_.depthTexture,0);const rt=Q.__webglTexture,ht=Ht(_),X=$?r.TEXTURE_CUBE_MAP_POSITIVE_X+B:r.TEXTURE_2D,K=_.depthTexture.format===Qn?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;if(_.depthTexture.format===Rn)Ct(_)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,K,X,rt,0,ht):r.framebufferTexture2D(r.FRAMEBUFFER,K,X,rt,0);else if(_.depthTexture.format===Qn)Ct(_)?a.framebufferTexture2DMultisampleEXT(r.FRAMEBUFFER,K,X,rt,0,ht):r.framebufferTexture2D(r.FRAMEBUFFER,K,X,rt,0);else throw new Error("Unknown depthTexture format")}function Z(T){const _=n.get(T),B=T.isWebGLCubeRenderTarget===!0;if(_.__boundDepthTexture!==T.depthTexture){const $=T.depthTexture;if(_.__depthDisposeCallback&&_.__depthDisposeCallback(),$){const Q=()=>{delete _.__boundDepthTexture,delete _.__depthDisposeCallback,$.removeEventListener("dispose",Q)};$.addEventListener("dispose",Q),_.__depthDisposeCallback=Q}_.__boundDepthTexture=$}if(T.depthTexture&&!_.__autoAllocateDepthBuffer)if(B)for(let $=0;$<6;$++)kt(_.__webglFramebuffer[$],T,$);else{const $=T.texture.mipmaps;$&&$.length>0?kt(_.__webglFramebuffer[0],T,0):kt(_.__webglFramebuffer,T,0)}else if(B){_.__webglDepthbuffer=[];for(let $=0;$<6;$++)if(e.bindFramebuffer(r.FRAMEBUFFER,_.__webglFramebuffer[$]),_.__webglDepthbuffer[$]===void 0)_.__webglDepthbuffer[$]=r.createRenderbuffer(),ie(_.__webglDepthbuffer[$],T,!1);else{const Q=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,rt=_.__webglDepthbuffer[$];r.bindRenderbuffer(r.RENDERBUFFER,rt),r.framebufferRenderbuffer(r.FRAMEBUFFER,Q,r.RENDERBUFFER,rt)}}else{const $=T.texture.mipmaps;if($&&$.length>0?e.bindFramebuffer(r.FRAMEBUFFER,_.__webglFramebuffer[0]):e.bindFramebuffer(r.FRAMEBUFFER,_.__webglFramebuffer),_.__webglDepthbuffer===void 0)_.__webglDepthbuffer=r.createRenderbuffer(),ie(_.__webglDepthbuffer,T,!1);else{const Q=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,rt=_.__webglDepthbuffer;r.bindRenderbuffer(r.RENDERBUFFER,rt),r.framebufferRenderbuffer(r.FRAMEBUFFER,Q,r.RENDERBUFFER,rt)}}e.bindFramebuffer(r.FRAMEBUFFER,null)}function it(T,_,B){const $=n.get(T);_!==void 0&&Ut($.__webglFramebuffer,T,T.texture,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,0),B!==void 0&&Z(T)}function j(T){const _=T.texture,B=n.get(T),$=n.get(_);T.addEventListener("dispose",v);const Q=T.textures,rt=T.isWebGLCubeRenderTarget===!0,ht=Q.length>1;if(ht||($.__webglTexture===void 0&&($.__webglTexture=r.createTexture()),$.__version=_.version,o.memory.textures++),rt){B.__webglFramebuffer=[];for(let X=0;X<6;X++)if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer[X]=[];for(let K=0;K<_.mipmaps.length;K++)B.__webglFramebuffer[X][K]=r.createFramebuffer()}else B.__webglFramebuffer[X]=r.createFramebuffer()}else{if(_.mipmaps&&_.mipmaps.length>0){B.__webglFramebuffer=[];for(let X=0;X<_.mipmaps.length;X++)B.__webglFramebuffer[X]=r.createFramebuffer()}else B.__webglFramebuffer=r.createFramebuffer();if(ht)for(let X=0,K=Q.length;X<K;X++){const Mt=n.get(Q[X]);Mt.__webglTexture===void 0&&(Mt.__webglTexture=r.createTexture(),o.memory.textures++)}if(T.samples>0&&Ct(T)===!1){B.__webglMultisampledFramebuffer=r.createFramebuffer(),B.__webglColorRenderbuffer=[],e.bindFramebuffer(r.FRAMEBUFFER,B.__webglMultisampledFramebuffer);for(let X=0;X<Q.length;X++){const K=Q[X];B.__webglColorRenderbuffer[X]=r.createRenderbuffer(),r.bindRenderbuffer(r.RENDERBUFFER,B.__webglColorRenderbuffer[X]);const Mt=s.convert(K.format,K.colorSpace),Tt=s.convert(K.type),dt=S(K.internalFormat,Mt,Tt,K.normalized,K.colorSpace,T.isXRRenderTarget===!0),lt=Ht(T);r.renderbufferStorageMultisample(r.RENDERBUFFER,lt,dt,T.width,T.height),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+X,r.RENDERBUFFER,B.__webglColorRenderbuffer[X])}r.bindRenderbuffer(r.RENDERBUFFER,null),T.depthBuffer&&(B.__webglDepthRenderbuffer=r.createRenderbuffer(),ie(B.__webglDepthRenderbuffer,T,!0)),e.bindFramebuffer(r.FRAMEBUFFER,null)}}if(rt){e.bindTexture(r.TEXTURE_CUBE_MAP,$.__webglTexture),Vt(r.TEXTURE_CUBE_MAP,_);for(let X=0;X<6;X++)if(_.mipmaps&&_.mipmaps.length>0)for(let K=0;K<_.mipmaps.length;K++)Ut(B.__webglFramebuffer[X][K],T,_,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+X,K);else Ut(B.__webglFramebuffer[X],T,_,r.COLOR_ATTACHMENT0,r.TEXTURE_CUBE_MAP_POSITIVE_X+X,0);m(_)&&x(r.TEXTURE_CUBE_MAP),e.unbindTexture()}else if(ht){for(let X=0,K=Q.length;X<K;X++){const Mt=Q[X],Tt=n.get(Mt);let dt=r.TEXTURE_2D;(T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(dt=T.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(dt,Tt.__webglTexture),Vt(dt,Mt),Ut(B.__webglFramebuffer,T,Mt,r.COLOR_ATTACHMENT0+X,dt,0),m(Mt)&&x(dt)}e.unbindTexture()}else{let X=r.TEXTURE_2D;if((T.isWebGL3DRenderTarget||T.isWebGLArrayRenderTarget)&&(X=T.isWebGL3DRenderTarget?r.TEXTURE_3D:r.TEXTURE_2D_ARRAY),e.bindTexture(X,$.__webglTexture),Vt(X,_),_.mipmaps&&_.mipmaps.length>0)for(let K=0;K<_.mipmaps.length;K++)Ut(B.__webglFramebuffer[K],T,_,r.COLOR_ATTACHMENT0,X,K);else Ut(B.__webglFramebuffer,T,_,r.COLOR_ATTACHMENT0,X,0);m(_)&&x(X),e.unbindTexture()}T.depthBuffer&&Z(T)}function _t(T){const _=T.textures;for(let B=0,$=_.length;B<$;B++){const Q=_[B];if(m(Q)){const rt=M(T),ht=n.get(Q).__webglTexture;e.bindTexture(rt,ht),x(rt),e.unbindTexture()}}}const ft=[],zt=[];function I(T){if(T.samples>0){if(Ct(T)===!1){const _=T.textures,B=T.width,$=T.height;let Q=r.COLOR_BUFFER_BIT;const rt=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT,ht=n.get(T),X=_.length>1;if(X)for(let Mt=0;Mt<_.length;Mt++)e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.RENDERBUFFER,null),e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.TEXTURE_2D,null,0);e.bindFramebuffer(r.READ_FRAMEBUFFER,ht.__webglMultisampledFramebuffer);const K=T.texture.mipmaps;K&&K.length>0?e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ht.__webglFramebuffer[0]):e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ht.__webglFramebuffer);for(let Mt=0;Mt<_.length;Mt++){if(T.resolveDepthBuffer&&(T.depthBuffer&&(Q|=r.DEPTH_BUFFER_BIT),T.stencilBuffer&&T.resolveStencilBuffer&&(Q|=r.STENCIL_BUFFER_BIT)),X){r.framebufferRenderbuffer(r.READ_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.RENDERBUFFER,ht.__webglColorRenderbuffer[Mt]);const Tt=n.get(_[Mt]).__webglTexture;r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0,r.TEXTURE_2D,Tt,0)}r.blitFramebuffer(0,0,B,$,0,0,B,$,Q,r.NEAREST),l===!0&&(ft.length=0,zt.length=0,ft.push(r.COLOR_ATTACHMENT0+Mt),T.depthBuffer&&T.resolveDepthBuffer===!1&&(ft.push(rt),zt.push(rt),r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,zt)),r.invalidateFramebuffer(r.READ_FRAMEBUFFER,ft))}if(e.bindFramebuffer(r.READ_FRAMEBUFFER,null),e.bindFramebuffer(r.DRAW_FRAMEBUFFER,null),X)for(let Mt=0;Mt<_.length;Mt++){e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglMultisampledFramebuffer),r.framebufferRenderbuffer(r.FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.RENDERBUFFER,ht.__webglColorRenderbuffer[Mt]);const Tt=n.get(_[Mt]).__webglTexture;e.bindFramebuffer(r.FRAMEBUFFER,ht.__webglFramebuffer),r.framebufferTexture2D(r.DRAW_FRAMEBUFFER,r.COLOR_ATTACHMENT0+Mt,r.TEXTURE_2D,Tt,0)}e.bindFramebuffer(r.DRAW_FRAMEBUFFER,ht.__webglMultisampledFramebuffer)}else if(T.depthBuffer&&T.resolveDepthBuffer===!1&&l){const _=T.stencilBuffer?r.DEPTH_STENCIL_ATTACHMENT:r.DEPTH_ATTACHMENT;r.invalidateFramebuffer(r.DRAW_FRAMEBUFFER,[_])}}}function Ht(T){return Math.min(i.maxSamples,T.samples)}function Ct(T){const _=n.get(T);return T.samples>0&&t.has("WEBGL_multisampled_render_to_texture")===!0&&_.__useRenderToTexture!==!1}function Gt(T){const _=o.render.frame;d.get(T)!==_&&(d.set(T,_),T.update())}function st(T,_){const B=T.colorSpace,$=T.format,Q=T.type;return T.isCompressedTexture===!0||T.isVideoTexture===!0||B!==Zs&&B!==kn&&(te.getTransfer(B)===ae?($!==Je||Q!==ze)&&Bt("WebGLTextures: sRGB encoded textures have to use RGBAFormat and UnsignedByteType."):ee("WebGLTextures: Unsupported texture color space:",B)),_}function oe(T){return typeof HTMLImageElement<"u"&&T instanceof HTMLImageElement?(c.width=T.naturalWidth||T.width,c.height=T.naturalHeight||T.height):typeof VideoFrame<"u"&&T instanceof VideoFrame?(c.width=T.displayWidth,c.height=T.displayHeight):(c.width=T.width,c.height=T.height),c}this.allocateTextureUnit=V,this.resetTextureUnits=W,this.getTextureUnits=q,this.setTextureUnits=U,this.setTexture2D=et,this.setTexture2DArray=nt,this.setTexture3D=pt,this.setTextureCube=St,this.rebindTextures=it,this.setupRenderTarget=j,this.updateRenderTargetMipmap=_t,this.updateMultisampleRenderTarget=I,this.setupDepthRenderbuffer=Z,this.setupFrameBufferTexture=Ut,this.useMultisampledRTT=Ct,this.isReversedDepthBuffer=function(){return e.buffers.depth.getReversed()}}function W0(r,t){function e(n,i=kn){let s;const o=te.getTransfer(i);if(n===ze)return r.UNSIGNED_BYTE;if(n===ta)return r.UNSIGNED_SHORT_4_4_4_4;if(n===ea)return r.UNSIGNED_SHORT_5_5_5_1;if(n===xc)return r.UNSIGNED_INT_5_9_9_9_REV;if(n===_c)return r.UNSIGNED_INT_10F_11F_11F_REV;if(n===mc)return r.BYTE;if(n===gc)return r.SHORT;if(n===ji)return r.UNSIGNED_SHORT;if(n===Qo)return r.INT;if(n===pn)return r.UNSIGNED_INT;if(n===nn)return r.FLOAT;if(n===Cn)return r.HALF_FLOAT;if(n===vc)return r.ALPHA;if(n===Mc)return r.RGB;if(n===Je)return r.RGBA;if(n===Rn)return r.DEPTH_COMPONENT;if(n===Qn)return r.DEPTH_STENCIL;if(n===na)return r.RED;if(n===ia)return r.RED_INTEGER;if(n===ei)return r.RG;if(n===sa)return r.RG_INTEGER;if(n===ra)return r.RGBA_INTEGER;if(n===Ws||n===Xs||n===qs||n===Ys)if(o===ae)if(s=t.get("WEBGL_compressed_texture_s3tc_srgb"),s!==null){if(n===Ws)return s.COMPRESSED_SRGB_S3TC_DXT1_EXT;if(n===Xs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT1_EXT;if(n===qs)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT3_EXT;if(n===Ys)return s.COMPRESSED_SRGB_ALPHA_S3TC_DXT5_EXT}else return null;else if(s=t.get("WEBGL_compressed_texture_s3tc"),s!==null){if(n===Ws)return s.COMPRESSED_RGB_S3TC_DXT1_EXT;if(n===Xs)return s.COMPRESSED_RGBA_S3TC_DXT1_EXT;if(n===qs)return s.COMPRESSED_RGBA_S3TC_DXT3_EXT;if(n===Ys)return s.COMPRESSED_RGBA_S3TC_DXT5_EXT}else return null;if(n===uo||n===fo||n===po||n===mo)if(s=t.get("WEBGL_compressed_texture_pvrtc"),s!==null){if(n===uo)return s.COMPRESSED_RGB_PVRTC_4BPPV1_IMG;if(n===fo)return s.COMPRESSED_RGB_PVRTC_2BPPV1_IMG;if(n===po)return s.COMPRESSED_RGBA_PVRTC_4BPPV1_IMG;if(n===mo)return s.COMPRESSED_RGBA_PVRTC_2BPPV1_IMG}else return null;if(n===go||n===xo||n===_o||n===vo||n===Mo||n===Ks||n===So)if(s=t.get("WEBGL_compressed_texture_etc"),s!==null){if(n===go||n===xo)return o===ae?s.COMPRESSED_SRGB8_ETC2:s.COMPRESSED_RGB8_ETC2;if(n===_o)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ETC2_EAC:s.COMPRESSED_RGBA8_ETC2_EAC;if(n===vo)return s.COMPRESSED_R11_EAC;if(n===Mo)return s.COMPRESSED_SIGNED_R11_EAC;if(n===Ks)return s.COMPRESSED_RG11_EAC;if(n===So)return s.COMPRESSED_SIGNED_RG11_EAC}else return null;if(n===yo||n===bo||n===Eo||n===To||n===wo||n===Ao||n===Co||n===Ro||n===Po||n===Lo||n===Io||n===Do||n===No||n===Uo)if(s=t.get("WEBGL_compressed_texture_astc"),s!==null){if(n===yo)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_4x4_KHR:s.COMPRESSED_RGBA_ASTC_4x4_KHR;if(n===bo)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x4_KHR:s.COMPRESSED_RGBA_ASTC_5x4_KHR;if(n===Eo)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_5x5_KHR:s.COMPRESSED_RGBA_ASTC_5x5_KHR;if(n===To)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x5_KHR:s.COMPRESSED_RGBA_ASTC_6x5_KHR;if(n===wo)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_6x6_KHR:s.COMPRESSED_RGBA_ASTC_6x6_KHR;if(n===Ao)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x5_KHR:s.COMPRESSED_RGBA_ASTC_8x5_KHR;if(n===Co)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x6_KHR:s.COMPRESSED_RGBA_ASTC_8x6_KHR;if(n===Ro)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_8x8_KHR:s.COMPRESSED_RGBA_ASTC_8x8_KHR;if(n===Po)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x5_KHR:s.COMPRESSED_RGBA_ASTC_10x5_KHR;if(n===Lo)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x6_KHR:s.COMPRESSED_RGBA_ASTC_10x6_KHR;if(n===Io)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x8_KHR:s.COMPRESSED_RGBA_ASTC_10x8_KHR;if(n===Do)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_10x10_KHR:s.COMPRESSED_RGBA_ASTC_10x10_KHR;if(n===No)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x10_KHR:s.COMPRESSED_RGBA_ASTC_12x10_KHR;if(n===Uo)return o===ae?s.COMPRESSED_SRGB8_ALPHA8_ASTC_12x12_KHR:s.COMPRESSED_RGBA_ASTC_12x12_KHR}else return null;if(n===Fo||n===Oo||n===Bo)if(s=t.get("EXT_texture_compression_bptc"),s!==null){if(n===Fo)return o===ae?s.COMPRESSED_SRGB_ALPHA_BPTC_UNORM_EXT:s.COMPRESSED_RGBA_BPTC_UNORM_EXT;if(n===Oo)return s.COMPRESSED_RGB_BPTC_SIGNED_FLOAT_EXT;if(n===Bo)return s.COMPRESSED_RGB_BPTC_UNSIGNED_FLOAT_EXT}else return null;if(n===ko||n===zo||n===Js||n===Go)if(s=t.get("EXT_texture_compression_rgtc"),s!==null){if(n===ko)return s.COMPRESSED_RED_RGTC1_EXT;if(n===zo)return s.COMPRESSED_SIGNED_RED_RGTC1_EXT;if(n===Js)return s.COMPRESSED_RED_GREEN_RGTC2_EXT;if(n===Go)return s.COMPRESSED_SIGNED_RED_GREEN_RGTC2_EXT}else return null;return n===Qi?r.UNSIGNED_INT_24_8:r[n]!==void 0?r[n]:null}return{convert:e}}const X0=`
void main() {

	gl_Position = vec4( position, 1.0 );

}`,q0=`
uniform sampler2DArray depthColor;
uniform float depthWidth;
uniform float depthHeight;

void main() {

	vec2 coord = vec2( gl_FragCoord.x / depthWidth, gl_FragCoord.y / depthHeight );

	if ( coord.x >= 1.0 ) {

		gl_FragDepth = texture( depthColor, vec3( coord.x - 1.0, coord.y, 1 ) ).r;

	} else {

		gl_FragDepth = texture( depthColor, vec3( coord.x, coord.y, 0 ) ).r;

	}

}`;class Y0{constructor(){this.texture=null,this.mesh=null,this.depthNear=0,this.depthFar=0}init(t,e){if(this.texture===null){const n=new Pc(t.texture);(t.depthNear!==e.depthNear||t.depthFar!==e.depthFar)&&(this.depthNear=t.depthNear,this.depthFar=t.depthFar),this.texture=n}}getMesh(t){if(this.texture!==null&&this.mesh===null){const e=t.cameras[0].viewport,n=new mn({vertexShader:X0,fragmentShader:q0,uniforms:{depthColor:{value:this.texture},depthWidth:{value:e.z},depthHeight:{value:e.w}}});this.mesh=new Ft(new Di(20,20),n)}return this.mesh}reset(){this.texture=null,this.mesh=null}getDepthTexture(){return this.texture}}class $0 extends ii{constructor(t,e){super();const n=this;let i=null,s=1,o=null,a="local-floor",l=1,c=null,d=null,u=null,h=null,f=null,g=null;const y=typeof XRWebGLBinding<"u",p=new Y0,m={},x=e.getContextAttributes();let M=null,S=null;const C=[],w=[],R=new ot;let v=null;const A=new qe;A.viewport=new xe;const D=new qe;D.viewport=new xe;const L=[A,D],O=new iu;let W=null,q=null;this.cameraAutoUpdate=!0,this.enabled=!1,this.isPresenting=!1,this.getController=function(J){let gt=C[J];return gt===void 0&&(gt=new Mr,C[J]=gt),gt.getTargetRaySpace()},this.getControllerGrip=function(J){let gt=C[J];return gt===void 0&&(gt=new Mr,C[J]=gt),gt.getGripSpace()},this.getHand=function(J){let gt=C[J];return gt===void 0&&(gt=new Mr,C[J]=gt),gt.getHandSpace()};function U(J){const gt=w.indexOf(J.inputSource);if(gt===-1)return;const at=C[gt];at!==void 0&&(at.update(J.inputSource,J.frame,c||o),at.dispatchEvent({type:J.type,data:J.inputSource}))}function V(){i.removeEventListener("select",U),i.removeEventListener("selectstart",U),i.removeEventListener("selectend",U),i.removeEventListener("squeeze",U),i.removeEventListener("squeezestart",U),i.removeEventListener("squeezeend",U),i.removeEventListener("end",V),i.removeEventListener("inputsourceschange",k);for(let J=0;J<C.length;J++){const gt=w[J];gt!==null&&(w[J]=null,C[J].disconnect(gt))}W=null,q=null,p.reset();for(const J in m)delete m[J];t.setRenderTarget(M),f=null,h=null,u=null,i=null,S=null,Vt.stop(),n.isPresenting=!1,t.setPixelRatio(v),t.setSize(R.width,R.height,!1),n.dispatchEvent({type:"sessionend"})}this.setFramebufferScaleFactor=function(J){s=J,n.isPresenting===!0&&Bt("WebXRManager: Cannot change framebuffer scale while presenting.")},this.setReferenceSpaceType=function(J){a=J,n.isPresenting===!0&&Bt("WebXRManager: Cannot change reference space type while presenting.")},this.getReferenceSpace=function(){return c||o},this.setReferenceSpace=function(J){c=J},this.getBaseLayer=function(){return h!==null?h:f},this.getBinding=function(){return u===null&&y&&(u=new XRWebGLBinding(i,e)),u},this.getFrame=function(){return g},this.getSession=function(){return i},this.setSession=async function(J){if(i=J,i!==null){if(M=t.getRenderTarget(),i.addEventListener("select",U),i.addEventListener("selectstart",U),i.addEventListener("selectend",U),i.addEventListener("squeeze",U),i.addEventListener("squeezestart",U),i.addEventListener("squeezeend",U),i.addEventListener("end",V),i.addEventListener("inputsourceschange",k),x.xrCompatible!==!0&&await e.makeXRCompatible(),v=t.getPixelRatio(),t.getSize(R),y&&"createProjectionLayer"in XRWebGLBinding.prototype){let at=null,Pt=null,Ot=null;x.depth&&(Ot=x.stencil?e.DEPTH24_STENCIL8:e.DEPTH_COMPONENT24,at=x.stencil?Qn:Rn,Pt=x.stencil?Qi:pn);const Ut={colorFormat:e.RGBA8,depthFormat:Ot,scaleFactor:s};u=this.getBinding(),h=u.createProjectionLayer(Ut),i.updateRenderState({layers:[h]}),t.setPixelRatio(1),t.setSize(h.textureWidth,h.textureHeight,!1),S=new sn(h.textureWidth,h.textureHeight,{format:Je,type:ze,depthTexture:new Ai(h.textureWidth,h.textureHeight,Pt,void 0,void 0,void 0,void 0,void 0,void 0,at),stencilBuffer:x.stencil,colorSpace:t.outputColorSpace,samples:x.antialias?4:0,resolveDepthBuffer:h.ignoreDepthValues===!1,resolveStencilBuffer:h.ignoreDepthValues===!1})}else{const at={antialias:x.antialias,alpha:!0,depth:x.depth,stencil:x.stencil,framebufferScaleFactor:s};f=new XRWebGLLayer(i,e,at),i.updateRenderState({baseLayer:f}),t.setPixelRatio(1),t.setSize(f.framebufferWidth,f.framebufferHeight,!1),S=new sn(f.framebufferWidth,f.framebufferHeight,{format:Je,type:ze,colorSpace:t.outputColorSpace,stencilBuffer:x.stencil,resolveDepthBuffer:f.ignoreDepthValues===!1,resolveStencilBuffer:f.ignoreDepthValues===!1})}S.isXRRenderTarget=!0,this.setFoveation(l),c=null,o=await i.requestReferenceSpace(a),Vt.setContext(i),Vt.start(),n.isPresenting=!0,n.dispatchEvent({type:"sessionstart"})}},this.getEnvironmentBlendMode=function(){if(i!==null)return i.environmentBlendMode},this.getDepthTexture=function(){return p.getDepthTexture()};function k(J){for(let gt=0;gt<J.removed.length;gt++){const at=J.removed[gt],Pt=w.indexOf(at);Pt>=0&&(w[Pt]=null,C[Pt].disconnect(at))}for(let gt=0;gt<J.added.length;gt++){const at=J.added[gt];let Pt=w.indexOf(at);if(Pt===-1){for(let Ut=0;Ut<C.length;Ut++)if(Ut>=w.length){w.push(at),Pt=Ut;break}else if(w[Ut]===null){w[Ut]=at,Pt=Ut;break}if(Pt===-1)break}const Ot=C[Pt];Ot&&Ot.connect(at)}}const et=new E,nt=new E;function pt(J,gt,at){et.setFromMatrixPosition(gt.matrixWorld),nt.setFromMatrixPosition(at.matrixWorld);const Pt=et.distanceTo(nt),Ot=gt.projectionMatrix.elements,Ut=at.projectionMatrix.elements,ie=Ot[14]/(Ot[10]-1),kt=Ot[14]/(Ot[10]+1),Z=(Ot[9]+1)/Ot[5],it=(Ot[9]-1)/Ot[5],j=(Ot[8]-1)/Ot[0],_t=(Ut[8]+1)/Ut[0],ft=ie*j,zt=ie*_t,I=Pt/(-j+_t),Ht=I*-j;if(gt.matrixWorld.decompose(J.position,J.quaternion,J.scale),J.translateX(Ht),J.translateZ(I),J.matrixWorld.compose(J.position,J.quaternion,J.scale),J.matrixWorldInverse.copy(J.matrixWorld).invert(),Ot[10]===-1)J.projectionMatrix.copy(gt.projectionMatrix),J.projectionMatrixInverse.copy(gt.projectionMatrixInverse);else{const Ct=ie+I,Gt=kt+I,st=ft-Ht,oe=zt+(Pt-Ht),T=Z*kt/Gt*Ct,_=it*kt/Gt*Ct;J.projectionMatrix.makePerspective(st,oe,T,_,Ct,Gt),J.projectionMatrixInverse.copy(J.projectionMatrix).invert()}}function St(J,gt){gt===null?J.matrixWorld.copy(J.matrix):J.matrixWorld.multiplyMatrices(gt.matrixWorld,J.matrix),J.matrixWorldInverse.copy(J.matrixWorld).invert()}this.updateCamera=function(J){if(i===null)return;let gt=J.near,at=J.far;p.texture!==null&&(p.depthNear>0&&(gt=p.depthNear),p.depthFar>0&&(at=p.depthFar)),O.near=D.near=A.near=gt,O.far=D.far=A.far=at,(W!==O.near||q!==O.far)&&(i.updateRenderState({depthNear:O.near,depthFar:O.far}),W=O.near,q=O.far),O.layers.mask=J.layers.mask|6,A.layers.mask=O.layers.mask&-5,D.layers.mask=O.layers.mask&-3;const Pt=J.parent,Ot=O.cameras;St(O,Pt);for(let Ut=0;Ut<Ot.length;Ut++)St(Ot[Ut],Pt);Ot.length===2?pt(O,A,D):O.projectionMatrix.copy(A.projectionMatrix),At(J,O,Pt)};function At(J,gt,at){at===null?J.matrix.copy(gt.matrixWorld):(J.matrix.copy(at.matrixWorld),J.matrix.invert(),J.matrix.multiply(gt.matrixWorld)),J.matrix.decompose(J.position,J.quaternion,J.scale),J.updateMatrixWorld(!0),J.projectionMatrix.copy(gt.projectionMatrix),J.projectionMatrixInverse.copy(gt.projectionMatrixInverse),J.isPerspectiveCamera&&(J.fov=Wo*2*Math.atan(1/J.projectionMatrix.elements[5]),J.zoom=1)}this.getCamera=function(){return O},this.getFoveation=function(){if(!(h===null&&f===null))return l},this.setFoveation=function(J){l=J,h!==null&&(h.fixedFoveation=J),f!==null&&f.fixedFoveation!==void 0&&(f.fixedFoveation=J)},this.hasDepthSensing=function(){return p.texture!==null},this.getDepthSensingMesh=function(){return p.getMesh(O)},this.getCameraTexture=function(J){return m[J]};let $t=null;function ne(J,gt){if(d=gt.getViewerPose(c||o),g=gt,d!==null){const at=d.views;f!==null&&(t.setRenderTargetFramebuffer(S,f.framebuffer),t.setRenderTarget(S));let Pt=!1;at.length!==O.cameras.length&&(O.cameras.length=0,Pt=!0);for(let kt=0;kt<at.length;kt++){const Z=at[kt];let it=null;if(f!==null)it=f.getViewport(Z);else{const _t=u.getViewSubImage(h,Z);it=_t.viewport,kt===0&&(t.setRenderTargetTextures(S,_t.colorTexture,_t.depthStencilTexture),t.setRenderTarget(S))}let j=L[kt];j===void 0&&(j=new qe,j.layers.enable(kt),j.viewport=new xe,L[kt]=j),j.matrix.fromArray(Z.transform.matrix),j.matrix.decompose(j.position,j.quaternion,j.scale),j.projectionMatrix.fromArray(Z.projectionMatrix),j.projectionMatrixInverse.copy(j.projectionMatrix).invert(),j.viewport.set(it.x,it.y,it.width,it.height),kt===0&&(O.matrix.copy(j.matrix),O.matrix.decompose(O.position,O.quaternion,O.scale)),Pt===!0&&O.cameras.push(j)}const Ot=i.enabledFeatures;if(Ot&&Ot.includes("depth-sensing")&&i.depthUsage=="gpu-optimized"&&y){u=n.getBinding();const kt=u.getDepthInformation(at[0]);kt&&kt.isValid&&kt.texture&&p.init(kt,i.renderState)}if(Ot&&Ot.includes("camera-access")&&y){t.state.unbindTexture(),u=n.getBinding();for(let kt=0;kt<at.length;kt++){const Z=at[kt].camera;if(Z){let it=m[Z];it||(it=new Pc,m[Z]=it);const j=u.getCameraImage(Z);it.sourceTexture=j}}}}for(let at=0;at<C.length;at++){const Pt=w[at],Ot=C[at];Pt!==null&&Ot!==void 0&&Ot.update(Pt,gt,c||o)}$t&&$t(J,gt),gt.detectedPlanes&&n.dispatchEvent({type:"planesdetected",data:gt}),g=null}const Vt=new Hc;Vt.setAnimationLoop(ne),this.setAnimationLoop=function(J){$t=J},this.dispose=function(){}}}const K0=new Qt,Jc=new Xt;Jc.set(-1,0,0,0,1,0,0,0,1);function J0(r,t){function e(p,m){p.matrixAutoUpdate===!0&&p.updateMatrix(),m.value.copy(p.matrix)}function n(p,m){m.color.getRGB(p.fogColor.value,zc(r)),m.isFog?(p.fogNear.value=m.near,p.fogFar.value=m.far):m.isFogExp2&&(p.fogDensity.value=m.density)}function i(p,m,x,M,S){m.isNodeMaterial?m.uniformsNeedUpdate=!1:m.isMeshBasicMaterial?s(p,m):m.isMeshLambertMaterial?(s(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshToonMaterial?(s(p,m),u(p,m)):m.isMeshPhongMaterial?(s(p,m),d(p,m),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)):m.isMeshStandardMaterial?(s(p,m),h(p,m),m.isMeshPhysicalMaterial&&f(p,m,S)):m.isMeshMatcapMaterial?(s(p,m),g(p,m)):m.isMeshDepthMaterial?s(p,m):m.isMeshDistanceMaterial?(s(p,m),y(p,m)):m.isMeshNormalMaterial?s(p,m):m.isLineBasicMaterial?(o(p,m),m.isLineDashedMaterial&&a(p,m)):m.isPointsMaterial?l(p,m,x,M):m.isSpriteMaterial?c(p,m):m.isShadowMaterial?(p.color.value.copy(m.color),p.opacity.value=m.opacity):m.isShaderMaterial&&(m.uniformsNeedUpdate=!1)}function s(p,m){p.opacity.value=m.opacity,m.color&&p.diffuse.value.copy(m.color),m.emissive&&p.emissive.value.copy(m.emissive).multiplyScalar(m.emissiveIntensity),m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.bumpMap&&(p.bumpMap.value=m.bumpMap,e(m.bumpMap,p.bumpMapTransform),p.bumpScale.value=m.bumpScale,m.side===Ge&&(p.bumpScale.value*=-1)),m.normalMap&&(p.normalMap.value=m.normalMap,e(m.normalMap,p.normalMapTransform),p.normalScale.value.copy(m.normalScale),m.side===Ge&&p.normalScale.value.negate()),m.displacementMap&&(p.displacementMap.value=m.displacementMap,e(m.displacementMap,p.displacementMapTransform),p.displacementScale.value=m.displacementScale,p.displacementBias.value=m.displacementBias),m.emissiveMap&&(p.emissiveMap.value=m.emissiveMap,e(m.emissiveMap,p.emissiveMapTransform)),m.specularMap&&(p.specularMap.value=m.specularMap,e(m.specularMap,p.specularMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest);const x=t.get(m),M=x.envMap,S=x.envMapRotation;M&&(p.envMap.value=M,p.envMapRotation.value.setFromMatrix4(K0.makeRotationFromEuler(S)).transpose(),M.isCubeTexture&&M.isRenderTargetTexture===!1&&p.envMapRotation.value.premultiply(Jc),p.reflectivity.value=m.reflectivity,p.ior.value=m.ior,p.refractionRatio.value=m.refractionRatio),m.lightMap&&(p.lightMap.value=m.lightMap,p.lightMapIntensity.value=m.lightMapIntensity,e(m.lightMap,p.lightMapTransform)),m.aoMap&&(p.aoMap.value=m.aoMap,p.aoMapIntensity.value=m.aoMapIntensity,e(m.aoMap,p.aoMapTransform))}function o(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform))}function a(p,m){p.dashSize.value=m.dashSize,p.totalSize.value=m.dashSize+m.gapSize,p.scale.value=m.scale}function l(p,m,x,M){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.size.value=m.size*x,p.scale.value=M*.5,m.map&&(p.map.value=m.map,e(m.map,p.uvTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function c(p,m){p.diffuse.value.copy(m.color),p.opacity.value=m.opacity,p.rotation.value=m.rotation,m.map&&(p.map.value=m.map,e(m.map,p.mapTransform)),m.alphaMap&&(p.alphaMap.value=m.alphaMap,e(m.alphaMap,p.alphaMapTransform)),m.alphaTest>0&&(p.alphaTest.value=m.alphaTest)}function d(p,m){p.specular.value.copy(m.specular),p.shininess.value=Math.max(m.shininess,1e-4)}function u(p,m){m.gradientMap&&(p.gradientMap.value=m.gradientMap)}function h(p,m){p.metalness.value=m.metalness,m.metalnessMap&&(p.metalnessMap.value=m.metalnessMap,e(m.metalnessMap,p.metalnessMapTransform)),p.roughness.value=m.roughness,m.roughnessMap&&(p.roughnessMap.value=m.roughnessMap,e(m.roughnessMap,p.roughnessMapTransform)),m.envMap&&(p.envMapIntensity.value=m.envMapIntensity)}function f(p,m,x){p.ior.value=m.ior,m.sheen>0&&(p.sheenColor.value.copy(m.sheenColor).multiplyScalar(m.sheen),p.sheenRoughness.value=m.sheenRoughness,m.sheenColorMap&&(p.sheenColorMap.value=m.sheenColorMap,e(m.sheenColorMap,p.sheenColorMapTransform)),m.sheenRoughnessMap&&(p.sheenRoughnessMap.value=m.sheenRoughnessMap,e(m.sheenRoughnessMap,p.sheenRoughnessMapTransform))),m.clearcoat>0&&(p.clearcoat.value=m.clearcoat,p.clearcoatRoughness.value=m.clearcoatRoughness,m.clearcoatMap&&(p.clearcoatMap.value=m.clearcoatMap,e(m.clearcoatMap,p.clearcoatMapTransform)),m.clearcoatRoughnessMap&&(p.clearcoatRoughnessMap.value=m.clearcoatRoughnessMap,e(m.clearcoatRoughnessMap,p.clearcoatRoughnessMapTransform)),m.clearcoatNormalMap&&(p.clearcoatNormalMap.value=m.clearcoatNormalMap,e(m.clearcoatNormalMap,p.clearcoatNormalMapTransform),p.clearcoatNormalScale.value.copy(m.clearcoatNormalScale),m.side===Ge&&p.clearcoatNormalScale.value.negate())),m.dispersion>0&&(p.dispersion.value=m.dispersion),m.iridescence>0&&(p.iridescence.value=m.iridescence,p.iridescenceIOR.value=m.iridescenceIOR,p.iridescenceThicknessMinimum.value=m.iridescenceThicknessRange[0],p.iridescenceThicknessMaximum.value=m.iridescenceThicknessRange[1],m.iridescenceMap&&(p.iridescenceMap.value=m.iridescenceMap,e(m.iridescenceMap,p.iridescenceMapTransform)),m.iridescenceThicknessMap&&(p.iridescenceThicknessMap.value=m.iridescenceThicknessMap,e(m.iridescenceThicknessMap,p.iridescenceThicknessMapTransform))),m.transmission>0&&(p.transmission.value=m.transmission,p.transmissionSamplerMap.value=x.texture,p.transmissionSamplerSize.value.set(x.width,x.height),m.transmissionMap&&(p.transmissionMap.value=m.transmissionMap,e(m.transmissionMap,p.transmissionMapTransform)),p.thickness.value=m.thickness,m.thicknessMap&&(p.thicknessMap.value=m.thicknessMap,e(m.thicknessMap,p.thicknessMapTransform)),p.attenuationDistance.value=m.attenuationDistance,p.attenuationColor.value.copy(m.attenuationColor)),m.anisotropy>0&&(p.anisotropyVector.value.set(m.anisotropy*Math.cos(m.anisotropyRotation),m.anisotropy*Math.sin(m.anisotropyRotation)),m.anisotropyMap&&(p.anisotropyMap.value=m.anisotropyMap,e(m.anisotropyMap,p.anisotropyMapTransform))),p.specularIntensity.value=m.specularIntensity,p.specularColor.value.copy(m.specularColor),m.specularColorMap&&(p.specularColorMap.value=m.specularColorMap,e(m.specularColorMap,p.specularColorMapTransform)),m.specularIntensityMap&&(p.specularIntensityMap.value=m.specularIntensityMap,e(m.specularIntensityMap,p.specularIntensityMapTransform))}function g(p,m){m.matcap&&(p.matcap.value=m.matcap)}function y(p,m){const x=t.get(m).light;p.referencePosition.value.setFromMatrixPosition(x.matrixWorld),p.nearDistance.value=x.shadow.camera.near,p.farDistance.value=x.shadow.camera.far}return{refreshFogUniforms:n,refreshMaterialUniforms:i}}function Z0(r,t,e,n){let i={},s={},o=[];const a=r.getParameter(r.MAX_UNIFORM_BUFFER_BINDINGS);function l(x,M){const S=M.program;n.uniformBlockBinding(x,S)}function c(x,M){let S=i[x.id];S===void 0&&(g(x),S=d(x),i[x.id]=S,x.addEventListener("dispose",p));const C=M.program;n.updateUBOMapping(x,C);const w=t.render.frame;s[x.id]!==w&&(h(x),s[x.id]=w)}function d(x){const M=u();x.__bindingPointIndex=M;const S=r.createBuffer(),C=x.__size,w=x.usage;return r.bindBuffer(r.UNIFORM_BUFFER,S),r.bufferData(r.UNIFORM_BUFFER,C,w),r.bindBuffer(r.UNIFORM_BUFFER,null),r.bindBufferBase(r.UNIFORM_BUFFER,M,S),S}function u(){for(let x=0;x<a;x++)if(o.indexOf(x)===-1)return o.push(x),x;return ee("WebGLRenderer: Maximum number of simultaneously usable uniforms groups reached."),0}function h(x){const M=i[x.id],S=x.uniforms,C=x.__cache;r.bindBuffer(r.UNIFORM_BUFFER,M);for(let w=0,R=S.length;w<R;w++){const v=Array.isArray(S[w])?S[w]:[S[w]];for(let A=0,D=v.length;A<D;A++){const L=v[A];if(f(L,w,A,C)===!0){const O=L.__offset,W=Array.isArray(L.value)?L.value:[L.value];let q=0;for(let U=0;U<W.length;U++){const V=W[U],k=y(V);typeof V=="number"||typeof V=="boolean"?(L.__data[0]=V,r.bufferSubData(r.UNIFORM_BUFFER,O+q,L.__data)):V.isMatrix3?(L.__data[0]=V.elements[0],L.__data[1]=V.elements[1],L.__data[2]=V.elements[2],L.__data[3]=0,L.__data[4]=V.elements[3],L.__data[5]=V.elements[4],L.__data[6]=V.elements[5],L.__data[7]=0,L.__data[8]=V.elements[6],L.__data[9]=V.elements[7],L.__data[10]=V.elements[8],L.__data[11]=0):ArrayBuffer.isView(V)?L.__data.set(new V.constructor(V.buffer,V.byteOffset,L.__data.length)):(V.toArray(L.__data,q),q+=k.storage/Float32Array.BYTES_PER_ELEMENT)}r.bufferSubData(r.UNIFORM_BUFFER,O,L.__data)}}}r.bindBuffer(r.UNIFORM_BUFFER,null)}function f(x,M,S,C){const w=x.value,R=M+"_"+S;if(C[R]===void 0)return typeof w=="number"||typeof w=="boolean"?C[R]=w:ArrayBuffer.isView(w)?C[R]=w.slice():C[R]=w.clone(),!0;{const v=C[R];if(typeof w=="number"||typeof w=="boolean"){if(v!==w)return C[R]=w,!0}else{if(ArrayBuffer.isView(w))return!0;if(v.equals(w)===!1)return v.copy(w),!0}}return!1}function g(x){const M=x.uniforms;let S=0;const C=16;for(let R=0,v=M.length;R<v;R++){const A=Array.isArray(M[R])?M[R]:[M[R]];for(let D=0,L=A.length;D<L;D++){const O=A[D],W=Array.isArray(O.value)?O.value:[O.value];for(let q=0,U=W.length;q<U;q++){const V=W[q],k=y(V),et=S%C,nt=et%k.boundary,pt=et+nt;S+=nt,pt!==0&&C-pt<k.storage&&(S+=C-pt),O.__data=new Float32Array(k.storage/Float32Array.BYTES_PER_ELEMENT),O.__offset=S,S+=k.storage}}}const w=S%C;return w>0&&(S+=C-w),x.__size=S,x.__cache={},this}function y(x){const M={boundary:0,storage:0};return typeof x=="number"||typeof x=="boolean"?(M.boundary=4,M.storage=4):x.isVector2?(M.boundary=8,M.storage=8):x.isVector3||x.isColor?(M.boundary=16,M.storage=12):x.isVector4?(M.boundary=16,M.storage=16):x.isMatrix3?(M.boundary=48,M.storage=48):x.isMatrix4?(M.boundary=64,M.storage=64):x.isTexture?Bt("WebGLRenderer: Texture samplers can not be part of an uniforms group."):ArrayBuffer.isView(x)?(M.boundary=16,M.storage=x.byteLength):Bt("WebGLRenderer: Unsupported uniform value type.",x),M}function p(x){const M=x.target;M.removeEventListener("dispose",p);const S=o.indexOf(M.__bindingPointIndex);o.splice(S,1),r.deleteBuffer(i[M.id]),delete i[M.id],delete s[M.id]}function m(){for(const x in i)r.deleteBuffer(i[x]);o=[],i={},s={}}return{bind:l,update:c,dispose:m}}const j0=new Uint16Array([12469,15057,12620,14925,13266,14620,13807,14376,14323,13990,14545,13625,14713,13328,14840,12882,14931,12528,14996,12233,15039,11829,15066,11525,15080,11295,15085,10976,15082,10705,15073,10495,13880,14564,13898,14542,13977,14430,14158,14124,14393,13732,14556,13410,14702,12996,14814,12596,14891,12291,14937,11834,14957,11489,14958,11194,14943,10803,14921,10506,14893,10278,14858,9960,14484,14039,14487,14025,14499,13941,14524,13740,14574,13468,14654,13106,14743,12678,14818,12344,14867,11893,14889,11509,14893,11180,14881,10751,14852,10428,14812,10128,14765,9754,14712,9466,14764,13480,14764,13475,14766,13440,14766,13347,14769,13070,14786,12713,14816,12387,14844,11957,14860,11549,14868,11215,14855,10751,14825,10403,14782,10044,14729,9651,14666,9352,14599,9029,14967,12835,14966,12831,14963,12804,14954,12723,14936,12564,14917,12347,14900,11958,14886,11569,14878,11247,14859,10765,14828,10401,14784,10011,14727,9600,14660,9289,14586,8893,14508,8533,15111,12234,15110,12234,15104,12216,15092,12156,15067,12010,15028,11776,14981,11500,14942,11205,14902,10752,14861,10393,14812,9991,14752,9570,14682,9252,14603,8808,14519,8445,14431,8145,15209,11449,15208,11451,15202,11451,15190,11438,15163,11384,15117,11274,15055,10979,14994,10648,14932,10343,14871,9936,14803,9532,14729,9218,14645,8742,14556,8381,14461,8020,14365,7603,15273,10603,15272,10607,15267,10619,15256,10631,15231,10614,15182,10535,15118,10389,15042,10167,14963,9787,14883,9447,14800,9115,14710,8665,14615,8318,14514,7911,14411,7507,14279,7198,15314,9675,15313,9683,15309,9712,15298,9759,15277,9797,15229,9773,15166,9668,15084,9487,14995,9274,14898,8910,14800,8539,14697,8234,14590,7790,14479,7409,14367,7067,14178,6621,15337,8619,15337,8631,15333,8677,15325,8769,15305,8871,15264,8940,15202,8909,15119,8775,15022,8565,14916,8328,14804,8009,14688,7614,14569,7287,14448,6888,14321,6483,14088,6171,15350,7402,15350,7419,15347,7480,15340,7613,15322,7804,15287,7973,15229,8057,15148,8012,15046,7846,14933,7611,14810,7357,14682,7069,14552,6656,14421,6316,14251,5948,14007,5528,15356,5942,15356,5977,15353,6119,15348,6294,15332,6551,15302,6824,15249,7044,15171,7122,15070,7050,14949,6861,14818,6611,14679,6349,14538,6067,14398,5651,14189,5311,13935,4958,15359,4123,15359,4153,15356,4296,15353,4646,15338,5160,15311,5508,15263,5829,15188,6042,15088,6094,14966,6001,14826,5796,14678,5543,14527,5287,14377,4985,14133,4586,13869,4257,15360,1563,15360,1642,15358,2076,15354,2636,15341,3350,15317,4019,15273,4429,15203,4732,15105,4911,14981,4932,14836,4818,14679,4621,14517,4386,14359,4156,14083,3795,13808,3437,15360,122,15360,137,15358,285,15355,636,15344,1274,15322,2177,15281,2765,15215,3223,15120,3451,14995,3569,14846,3567,14681,3466,14511,3305,14344,3121,14037,2800,13753,2467,15360,0,15360,1,15359,21,15355,89,15346,253,15325,479,15287,796,15225,1148,15133,1492,15008,1749,14856,1882,14685,1886,14506,1783,14324,1608,13996,1398,13702,1183]);let cn=null;function Q0(){return cn===null&&(cn=new Cc(j0,16,16,ei,Cn),cn.name="DFG_LUT",cn.minFilter=Ne,cn.magFilter=Ne,cn.wrapS=En,cn.wrapT=En,cn.generateMipmaps=!1,cn.needsUpdate=!0),cn}class tg{constructor(t={}){const{canvas:e=zh(),context:n=null,depth:i=!0,stencil:s=!1,alpha:o=!1,antialias:a=!1,premultipliedAlpha:l=!0,preserveDrawingBuffer:c=!1,powerPreference:d="default",failIfMajorPerformanceCaveat:u=!1,reversedDepthBuffer:h=!1,outputBufferType:f=ze}=t;this.isWebGLRenderer=!0;let g;if(n!==null){if(typeof WebGLRenderingContext<"u"&&n instanceof WebGLRenderingContext)throw new Error("THREE.WebGLRenderer: WebGL 1 is not supported since r163.");g=n.getContextAttributes().alpha}else g=o;const y=f,p=new Set([ra,sa,ia]),m=new Set([ze,pn,ji,Qi,ta,ea]),x=new Uint32Array(4),M=new Int32Array(4),S=new E;let C=null,w=null;const R=[],v=[];let A=null;this.domElement=e,this.debug={checkShaderErrors:!0,onShaderError:null},this.autoClear=!0,this.autoClearColor=!0,this.autoClearDepth=!0,this.autoClearStencil=!0,this.sortObjects=!0,this.clippingPlanes=[],this.localClippingEnabled=!1,this.toneMapping=fn,this.toneMappingExposure=1,this.transmissionResolutionScale=1;const D=this;let L=!1,O=null;this._outputColorSpace=Ke;let W=0,q=0,U=null,V=-1,k=null;const et=new xe,nt=new xe;let pt=null;const St=new yt(0);let At=0,$t=e.width,ne=e.height,Vt=1,J=null,gt=null;const at=new xe(0,0,$t,ne),Pt=new xe(0,0,$t,ne);let Ot=!1;const Ut=new da;let ie=!1,kt=!1;const Z=new Qt,it=new E,j=new xe,_t={background:null,fog:null,environment:null,overrideMaterial:null,isScene:!0};let ft=!1;function zt(){return U===null?Vt:1}let I=n;function Ht(b,F){return e.getContext(b,F)}try{const b={alpha:!0,depth:i,stencil:s,antialias:a,premultipliedAlpha:l,preserveDrawingBuffer:c,powerPreference:d,failIfMajorPerformanceCaveat:u};if("setAttribute"in e&&e.setAttribute("data-engine",`three.js r${Zo}`),e.addEventListener("webglcontextlost",tt,!1),e.addEventListener("webglcontextrestored",It,!1),e.addEventListener("webglcontextcreationerror",qt,!1),I===null){const F="webgl2";if(I=Ht(F,b),I===null)throw Ht(F)?new Error("Error creating WebGL context with your selected attributes."):new Error("Error creating WebGL context.")}}catch(b){throw ee("WebGLRenderer: "+b.message),b}let Ct,Gt,st,oe,T,_,B,$,Q,rt,ht,X,K,Mt,Tt,dt,lt,Wt,Kt,re,N,ct,Y;function bt(){Ct=new Qp(I),Ct.init(),N=new W0(I,Ct),Gt=new Xp(I,Ct,t,N),st=new V0(I,Ct),Gt.reversedDepthBuffer&&h&&st.buffers.depth.setReversed(!0),oe=new nm(I),T=new C0,_=new H0(I,Ct,st,T,Gt,N,oe),B=new jp(D),$=new ru(I),ct=new Hp(I,$),Q=new tm(I,$,oe,ct),rt=new sm(I,Q,$,ct,oe),Wt=new im(I,Gt,_),Tt=new qp(T),ht=new A0(D,B,Ct,Gt,ct,Tt),X=new J0(D,T),K=new P0,Mt=new F0(Ct),lt=new Vp(D,B,st,rt,g,l),dt=new G0(D,rt,Gt),Y=new Z0(I,oe,Gt,st),Kt=new Wp(I,Ct,oe),re=new em(I,Ct,oe),oe.programs=ht.programs,D.capabilities=Gt,D.extensions=Ct,D.properties=T,D.renderLists=K,D.shadowMap=dt,D.state=st,D.info=oe}bt(),y!==ze&&(A=new om(y,e.width,e.height,i,s));const ut=new $0(D,I);this.xr=ut,this.getContext=function(){return I},this.getContextAttributes=function(){return I.getContextAttributes()},this.forceContextLoss=function(){const b=Ct.get("WEBGL_lose_context");b&&b.loseContext()},this.forceContextRestore=function(){const b=Ct.get("WEBGL_lose_context");b&&b.restoreContext()},this.getPixelRatio=function(){return Vt},this.setPixelRatio=function(b){b!==void 0&&(Vt=b,this.setSize($t,ne,!1))},this.getSize=function(b){return b.set($t,ne)},this.setSize=function(b,F,H=!0){if(ut.isPresenting){Bt("WebGLRenderer: Can't change size while VR device is presenting.");return}$t=b,ne=F,e.width=Math.floor(b*Vt),e.height=Math.floor(F*Vt),H===!0&&(e.style.width=b+"px",e.style.height=F+"px"),A!==null&&A.setSize(e.width,e.height),this.setViewport(0,0,b,F)},this.getDrawingBufferSize=function(b){return b.set($t*Vt,ne*Vt).floor()},this.setDrawingBufferSize=function(b,F,H){$t=b,ne=F,Vt=H,e.width=Math.floor(b*H),e.height=Math.floor(F*H),this.setViewport(0,0,b,F)},this.setEffects=function(b){if(y===ze){ee("THREE.WebGLRenderer: setEffects() requires outputBufferType set to HalfFloatType or FloatType.");return}if(b){for(let F=0;F<b.length;F++)if(b[F].isOutputPass===!0){Bt("THREE.WebGLRenderer: OutputPass is not needed in setEffects(). Tone mapping and color space conversion are applied automatically.");break}}A.setEffects(b||[])},this.getCurrentViewport=function(b){return b.copy(et)},this.getViewport=function(b){return b.copy(at)},this.setViewport=function(b,F,H,z){b.isVector4?at.set(b.x,b.y,b.z,b.w):at.set(b,F,H,z),st.viewport(et.copy(at).multiplyScalar(Vt).round())},this.getScissor=function(b){return b.copy(Pt)},this.setScissor=function(b,F,H,z){b.isVector4?Pt.set(b.x,b.y,b.z,b.w):Pt.set(b,F,H,z),st.scissor(nt.copy(Pt).multiplyScalar(Vt).round())},this.getScissorTest=function(){return Ot},this.setScissorTest=function(b){st.setScissorTest(Ot=b)},this.setOpaqueSort=function(b){J=b},this.setTransparentSort=function(b){gt=b},this.getClearColor=function(b){return b.copy(lt.getClearColor())},this.setClearColor=function(){lt.setClearColor(...arguments)},this.getClearAlpha=function(){return lt.getClearAlpha()},this.setClearAlpha=function(){lt.setClearAlpha(...arguments)},this.clear=function(b=!0,F=!0,H=!0){let z=0;if(b){let G=!1;if(U!==null){const vt=U.texture.format;G=p.has(vt)}if(G){const vt=U.texture.type,wt=m.has(vt),xt=lt.getClearColor(),Rt=lt.getClearAlpha(),Dt=xt.r,Yt=xt.g,Zt=xt.b;wt?(x[0]=Dt,x[1]=Yt,x[2]=Zt,x[3]=Rt,I.clearBufferuiv(I.COLOR,0,x)):(M[0]=Dt,M[1]=Yt,M[2]=Zt,M[3]=Rt,I.clearBufferiv(I.COLOR,0,M))}else z|=I.COLOR_BUFFER_BIT}F&&(z|=I.DEPTH_BUFFER_BIT,this.state.buffers.depth.setMask(!0)),H&&(z|=I.STENCIL_BUFFER_BIT,this.state.buffers.stencil.setMask(4294967295)),z!==0&&I.clear(z)},this.clearColor=function(){this.clear(!0,!1,!1)},this.clearDepth=function(){this.clear(!1,!0,!1)},this.clearStencil=function(){this.clear(!1,!1,!0)},this.setNodesHandler=function(b){b.setRenderer(this),O=b},this.dispose=function(){e.removeEventListener("webglcontextlost",tt,!1),e.removeEventListener("webglcontextrestored",It,!1),e.removeEventListener("webglcontextcreationerror",qt,!1),lt.dispose(),K.dispose(),Mt.dispose(),T.dispose(),B.dispose(),rt.dispose(),ct.dispose(),Y.dispose(),ht.dispose(),ut.dispose(),ut.removeEventListener("sessionstart",Ta),ut.removeEventListener("sessionend",wa),Hn.stop()};function tt(b){b.preventDefault(),za("WebGLRenderer: Context Lost."),L=!0}function It(){za("WebGLRenderer: Context Restored."),L=!1;const b=oe.autoReset,F=dt.enabled,H=dt.autoUpdate,z=dt.needsUpdate,G=dt.type;bt(),oe.autoReset=b,dt.enabled=F,dt.autoUpdate=H,dt.needsUpdate=z,dt.type=G}function qt(b){ee("WebGLRenderer: A WebGL context could not be created. Reason: ",b.statusMessage)}function _e(b){const F=b.target;F.removeEventListener("dispose",_e),le(F)}function le(b){xn(b),T.remove(b)}function xn(b){const F=T.get(b).programs;F!==void 0&&(F.forEach(function(H){ht.releaseProgram(H)}),b.isShaderMaterial&&ht.releaseShaderCache(b))}this.renderBufferDirect=function(b,F,H,z,G,vt){F===null&&(F=_t);const wt=G.isMesh&&G.matrixWorld.determinant()<0,xt=Qc(b,F,H,z,G);st.setMaterial(z,wt);let Rt=H.index,Dt=1;if(z.wireframe===!0){if(Rt=Q.getWireframeAttribute(H),Rt===void 0)return;Dt=2}const Yt=H.drawRange,Zt=H.attributes.position;let Nt=Yt.start*Dt,ce=(Yt.start+Yt.count)*Dt;vt!==null&&(Nt=Math.max(Nt,vt.start*Dt),ce=Math.min(ce,(vt.start+vt.count)*Dt)),Rt!==null?(Nt=Math.max(Nt,0),ce=Math.min(ce,Rt.count)):Zt!=null&&(Nt=Math.max(Nt,0),ce=Math.min(ce,Zt.count));const ve=ce-Nt;if(ve<0||ve===1/0)return;ct.setup(G,z,xt,H,Rt);let ge,he=Kt;if(Rt!==null&&(ge=$.get(Rt),he=re,he.setIndex(ge)),G.isMesh)z.wireframe===!0?(st.setLineWidth(z.wireframeLinewidth*zt()),he.setMode(I.LINES)):he.setMode(I.TRIANGLES);else if(G.isLine){let Le=z.linewidth;Le===void 0&&(Le=1),st.setLineWidth(Le*zt()),G.isLineSegments?he.setMode(I.LINES):G.isLineLoop?he.setMode(I.LINE_LOOP):he.setMode(I.LINE_STRIP)}else G.isPoints?he.setMode(I.POINTS):G.isSprite&&he.setMode(I.TRIANGLES);if(G.isBatchedMesh)if(Ct.get("WEBGL_multi_draw"))he.renderMultiDraw(G._multiDrawStarts,G._multiDrawCounts,G._multiDrawCount);else{const Le=G._multiDrawStarts,Et=G._multiDrawCounts,Ve=G._multiDrawCount,se=Rt?$.get(Rt).bytesPerElement:1,Ye=T.get(z).currentProgram.getUniforms();for(let an=0;an<Ve;an++)Ye.setValue(I,"_gl_DrawID",an),he.render(Le[an]/se,Et[an])}else if(G.isInstancedMesh)he.renderInstances(Nt,ve,G.count);else if(H.isInstancedBufferGeometry){const Le=H._maxInstanceCount!==void 0?H._maxInstanceCount:1/0,Et=Math.min(H.instanceCount,Le);he.renderInstances(Nt,ve,Et)}else he.render(Nt,ve)};function on(b,F,H){b.transparent===!0&&b.side===tn&&b.forceSinglePass===!1?(b.side=Ge,b.needsUpdate=!0,as(b,F,H),b.side=Vn,b.needsUpdate=!0,as(b,F,H),b.side=tn):as(b,F,H)}this.compile=function(b,F,H=null){H===null&&(H=b),w=Mt.get(H),w.init(F),v.push(w),H.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(w.pushLight(G),G.castShadow&&w.pushShadow(G))}),b!==H&&b.traverseVisible(function(G){G.isLight&&G.layers.test(F.layers)&&(w.pushLight(G),G.castShadow&&w.pushShadow(G))}),w.setupLights();const z=new Set;return b.traverse(function(G){if(!(G.isMesh||G.isPoints||G.isLine||G.isSprite))return;const vt=G.material;if(vt)if(Array.isArray(vt))for(let wt=0;wt<vt.length;wt++){const xt=vt[wt];on(xt,H,G),z.add(xt)}else on(vt,H,G),z.add(vt)}),w=v.pop(),z},this.compileAsync=function(b,F,H=null){const z=this.compile(b,F,H);return new Promise(G=>{function vt(){if(z.forEach(function(wt){T.get(wt).currentProgram.isReady()&&z.delete(wt)}),z.size===0){G(b);return}setTimeout(vt,10)}Ct.get("KHR_parallel_shader_compile")!==null?vt():setTimeout(vt,10)})};let lr=null;function Zc(b){lr&&lr(b)}function Ta(){Hn.stop()}function wa(){Hn.start()}const Hn=new Hc;Hn.setAnimationLoop(Zc),typeof self<"u"&&Hn.setContext(self),this.setAnimationLoop=function(b){lr=b,ut.setAnimationLoop(b),b===null?Hn.stop():Hn.start()},ut.addEventListener("sessionstart",Ta),ut.addEventListener("sessionend",wa),this.render=function(b,F){if(F!==void 0&&F.isCamera!==!0){ee("WebGLRenderer.render: camera is not an instance of THREE.Camera.");return}if(L===!0)return;O!==null&&O.renderStart(b,F);const H=ut.enabled===!0&&ut.isPresenting===!0,z=A!==null&&(U===null||H)&&A.begin(D,U);if(b.matrixWorldAutoUpdate===!0&&b.updateMatrixWorld(),F.parent===null&&F.matrixWorldAutoUpdate===!0&&F.updateMatrixWorld(),ut.enabled===!0&&ut.isPresenting===!0&&(A===null||A.isCompositing()===!1)&&(ut.cameraAutoUpdate===!0&&ut.updateCamera(F),F=ut.getCamera()),b.isScene===!0&&b.onBeforeRender(D,b,F,U),w=Mt.get(b,v.length),w.init(F),w.state.textureUnits=_.getTextureUnits(),v.push(w),Z.multiplyMatrices(F.projectionMatrix,F.matrixWorldInverse),Ut.setFromProjectionMatrix(Z,dn,F.reversedDepth),kt=this.localClippingEnabled,ie=Tt.init(this.clippingPlanes,kt),C=K.get(b,R.length),C.init(),R.push(C),ut.enabled===!0&&ut.isPresenting===!0){const wt=D.xr.getDepthSensingMesh();wt!==null&&cr(wt,F,-1/0,D.sortObjects)}cr(b,F,0,D.sortObjects),C.finish(),D.sortObjects===!0&&C.sort(J,gt),ft=ut.enabled===!1||ut.isPresenting===!1||ut.hasDepthSensing()===!1,ft&&lt.addToRenderList(C,b),this.info.render.frame++,ie===!0&&Tt.beginShadows();const G=w.state.shadowsArray;if(dt.render(G,b,F),ie===!0&&Tt.endShadows(),this.info.autoReset===!0&&this.info.reset(),(z&&A.hasRenderPass())===!1){const wt=C.opaque,xt=C.transmissive;if(w.setupLights(),F.isArrayCamera){const Rt=F.cameras;if(xt.length>0)for(let Dt=0,Yt=Rt.length;Dt<Yt;Dt++){const Zt=Rt[Dt];Ca(wt,xt,b,Zt)}ft&&lt.render(b);for(let Dt=0,Yt=Rt.length;Dt<Yt;Dt++){const Zt=Rt[Dt];Aa(C,b,Zt,Zt.viewport)}}else xt.length>0&&Ca(wt,xt,b,F),ft&&lt.render(b),Aa(C,b,F)}U!==null&&q===0&&(_.updateMultisampleRenderTarget(U),_.updateRenderTargetMipmap(U)),z&&A.end(D),b.isScene===!0&&b.onAfterRender(D,b,F),ct.resetDefaultState(),V=-1,k=null,v.pop(),v.length>0?(w=v[v.length-1],_.setTextureUnits(w.state.textureUnits),ie===!0&&Tt.setGlobalState(D.clippingPlanes,w.state.camera)):w=null,R.pop(),R.length>0?C=R[R.length-1]:C=null,O!==null&&O.renderEnd()};function cr(b,F,H,z){if(b.visible===!1)return;if(b.layers.test(F.layers)){if(b.isGroup)H=b.renderOrder;else if(b.isLOD)b.autoUpdate===!0&&b.update(F);else if(b.isLightProbeGrid)w.pushLightProbeGrid(b);else if(b.isLight)w.pushLight(b),b.castShadow&&w.pushShadow(b);else if(b.isSprite){if(!b.frustumCulled||Ut.intersectsSprite(b)){z&&j.setFromMatrixPosition(b.matrixWorld).applyMatrix4(Z);const wt=rt.update(b),xt=b.material;xt.visible&&C.push(b,wt,xt,H,j.z,null)}}else if((b.isMesh||b.isLine||b.isPoints)&&(!b.frustumCulled||Ut.intersectsObject(b))){const wt=rt.update(b),xt=b.material;if(z&&(b.boundingSphere!==void 0?(b.boundingSphere===null&&b.computeBoundingSphere(),j.copy(b.boundingSphere.center)):(wt.boundingSphere===null&&wt.computeBoundingSphere(),j.copy(wt.boundingSphere.center)),j.applyMatrix4(b.matrixWorld).applyMatrix4(Z)),Array.isArray(xt)){const Rt=wt.groups;for(let Dt=0,Yt=Rt.length;Dt<Yt;Dt++){const Zt=Rt[Dt],Nt=xt[Zt.materialIndex];Nt&&Nt.visible&&C.push(b,wt,Nt,H,j.z,Zt)}}else xt.visible&&C.push(b,wt,xt,H,j.z,null)}}const vt=b.children;for(let wt=0,xt=vt.length;wt<xt;wt++)cr(vt[wt],F,H,z)}function Aa(b,F,H,z){const{opaque:G,transmissive:vt,transparent:wt}=b;w.setupLightsView(H),ie===!0&&Tt.setGlobalState(D.clippingPlanes,H),z&&st.viewport(et.copy(z)),G.length>0&&os(G,F,H),vt.length>0&&os(vt,F,H),wt.length>0&&os(wt,F,H),st.buffers.depth.setTest(!0),st.buffers.depth.setMask(!0),st.buffers.color.setMask(!0),st.setPolygonOffset(!1)}function Ca(b,F,H,z){if((H.isScene===!0?H.overrideMaterial:null)!==null)return;if(w.state.transmissionRenderTarget[z.id]===void 0){const Nt=Ct.has("EXT_color_buffer_half_float")||Ct.has("EXT_color_buffer_float");w.state.transmissionRenderTarget[z.id]=new sn(1,1,{generateMipmaps:!0,type:Nt?Cn:ze,minFilter:jn,samples:Math.max(4,Gt.samples),stencilBuffer:s,resolveDepthBuffer:!1,resolveStencilBuffer:!1,colorSpace:te.workingColorSpace})}const vt=w.state.transmissionRenderTarget[z.id],wt=z.viewport||et;vt.setSize(wt.z*D.transmissionResolutionScale,wt.w*D.transmissionResolutionScale);const xt=D.getRenderTarget(),Rt=D.getActiveCubeFace(),Dt=D.getActiveMipmapLevel();D.setRenderTarget(vt),D.getClearColor(St),At=D.getClearAlpha(),At<1&&D.setClearColor(16777215,.5),D.clear(),ft&&lt.render(H);const Yt=D.toneMapping;D.toneMapping=fn;const Zt=z.viewport;if(z.viewport!==void 0&&(z.viewport=void 0),w.setupLightsView(z),ie===!0&&Tt.setGlobalState(D.clippingPlanes,z),os(b,H,z),_.updateMultisampleRenderTarget(vt),_.updateRenderTargetMipmap(vt),Ct.has("WEBGL_multisampled_render_to_texture")===!1){let Nt=!1;for(let ce=0,ve=F.length;ce<ve;ce++){const ge=F[ce],{object:he,geometry:Le,material:Et,group:Ve}=ge;if(Et.side===tn&&he.layers.test(z.layers)){const se=Et.side;Et.side=Ge,Et.needsUpdate=!0,Ra(he,H,z,Le,Et,Ve),Et.side=se,Et.needsUpdate=!0,Nt=!0}}Nt===!0&&(_.updateMultisampleRenderTarget(vt),_.updateRenderTargetMipmap(vt))}D.setRenderTarget(xt,Rt,Dt),D.setClearColor(St,At),Zt!==void 0&&(z.viewport=Zt),D.toneMapping=Yt}function os(b,F,H){const z=F.isScene===!0?F.overrideMaterial:null;for(let G=0,vt=b.length;G<vt;G++){const wt=b[G],{object:xt,geometry:Rt,group:Dt}=wt;let Yt=wt.material;Yt.allowOverride===!0&&z!==null&&(Yt=z),xt.layers.test(H.layers)&&Ra(xt,F,H,Rt,Yt,Dt)}}function Ra(b,F,H,z,G,vt){b.onBeforeRender(D,F,H,z,G,vt),b.modelViewMatrix.multiplyMatrices(H.matrixWorldInverse,b.matrixWorld),b.normalMatrix.getNormalMatrix(b.modelViewMatrix),G.onBeforeRender(D,F,H,z,b,vt),G.transparent===!0&&G.side===tn&&G.forceSinglePass===!1?(G.side=Ge,G.needsUpdate=!0,D.renderBufferDirect(H,F,z,G,b,vt),G.side=Vn,G.needsUpdate=!0,D.renderBufferDirect(H,F,z,G,b,vt),G.side=tn):D.renderBufferDirect(H,F,z,G,b,vt),b.onAfterRender(D,F,H,z,G,vt)}function as(b,F,H){F.isScene!==!0&&(F=_t);const z=T.get(b),G=w.state.lights,vt=w.state.shadowsArray,wt=G.state.version,xt=ht.getParameters(b,G.state,vt,F,H,w.state.lightProbeGridArray),Rt=ht.getProgramCacheKey(xt);let Dt=z.programs;z.environment=b.isMeshStandardMaterial||b.isMeshLambertMaterial||b.isMeshPhongMaterial?F.environment:null,z.fog=F.fog;const Yt=b.isMeshStandardMaterial||b.isMeshLambertMaterial&&!b.envMap||b.isMeshPhongMaterial&&!b.envMap;z.envMap=B.get(b.envMap||z.environment,Yt),z.envMapRotation=z.environment!==null&&b.envMap===null?F.environmentRotation:b.envMapRotation,Dt===void 0&&(b.addEventListener("dispose",_e),Dt=new Map,z.programs=Dt);let Zt=Dt.get(Rt);if(Zt!==void 0){if(z.currentProgram===Zt&&z.lightsStateVersion===wt)return La(b,xt),Zt}else xt.uniforms=ht.getUniforms(b),O!==null&&b.isNodeMaterial&&O.build(b,H,xt),b.onBeforeCompile(xt,D),Zt=ht.acquireProgram(xt,Rt),Dt.set(Rt,Zt),z.uniforms=xt.uniforms;const Nt=z.uniforms;return(!b.isShaderMaterial&&!b.isRawShaderMaterial||b.clipping===!0)&&(Nt.clippingPlanes=Tt.uniform),La(b,xt),z.needsLights=eh(b),z.lightsStateVersion=wt,z.needsLights&&(Nt.ambientLightColor.value=G.state.ambient,Nt.lightProbe.value=G.state.probe,Nt.directionalLights.value=G.state.directional,Nt.directionalLightShadows.value=G.state.directionalShadow,Nt.spotLights.value=G.state.spot,Nt.spotLightShadows.value=G.state.spotShadow,Nt.rectAreaLights.value=G.state.rectArea,Nt.ltc_1.value=G.state.rectAreaLTC1,Nt.ltc_2.value=G.state.rectAreaLTC2,Nt.pointLights.value=G.state.point,Nt.pointLightShadows.value=G.state.pointShadow,Nt.hemisphereLights.value=G.state.hemi,Nt.directionalShadowMatrix.value=G.state.directionalShadowMatrix,Nt.spotLightMatrix.value=G.state.spotLightMatrix,Nt.spotLightMap.value=G.state.spotLightMap,Nt.pointShadowMatrix.value=G.state.pointShadowMatrix),z.lightProbeGrid=w.state.lightProbeGridArray.length>0,z.currentProgram=Zt,z.uniformsList=null,Zt}function Pa(b){if(b.uniformsList===null){const F=b.currentProgram.getUniforms();b.uniformsList=$s.seqWithValue(F.seq,b.uniforms)}return b.uniformsList}function La(b,F){const H=T.get(b);H.outputColorSpace=F.outputColorSpace,H.batching=F.batching,H.batchingColor=F.batchingColor,H.instancing=F.instancing,H.instancingColor=F.instancingColor,H.instancingMorph=F.instancingMorph,H.skinning=F.skinning,H.morphTargets=F.morphTargets,H.morphNormals=F.morphNormals,H.morphColors=F.morphColors,H.morphTargetsCount=F.morphTargetsCount,H.numClippingPlanes=F.numClippingPlanes,H.numIntersection=F.numClipIntersection,H.vertexAlphas=F.vertexAlphas,H.vertexTangents=F.vertexTangents,H.toneMapping=F.toneMapping}function jc(b,F){if(b.length===0)return null;if(b.length===1)return b[0].texture!==null?b[0]:null;S.setFromMatrixPosition(F.matrixWorld);for(let H=0,z=b.length;H<z;H++){const G=b[H];if(G.texture!==null&&G.boundingBox.containsPoint(S))return G}return null}function Qc(b,F,H,z,G){F.isScene!==!0&&(F=_t),_.resetTextureUnits();const vt=F.fog,wt=z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial?F.environment:null,xt=U===null?D.outputColorSpace:U.isXRRenderTarget===!0?U.texture.colorSpace:te.workingColorSpace,Rt=z.isMeshStandardMaterial||z.isMeshLambertMaterial&&!z.envMap||z.isMeshPhongMaterial&&!z.envMap,Dt=B.get(z.envMap||wt,Rt),Yt=z.vertexColors===!0&&!!H.attributes.color&&H.attributes.color.itemSize===4,Zt=!!H.attributes.tangent&&(!!z.normalMap||z.anisotropy>0),Nt=!!H.morphAttributes.position,ce=!!H.morphAttributes.normal,ve=!!H.morphAttributes.color;let ge=fn;z.toneMapped&&(U===null||U.isXRRenderTarget===!0)&&(ge=D.toneMapping);const he=H.morphAttributes.position||H.morphAttributes.normal||H.morphAttributes.color,Le=he!==void 0?he.length:0,Et=T.get(z),Ve=w.state.lights;if(ie===!0&&(kt===!0||b!==k)){const ue=b===k&&z.id===V;Tt.setState(z,b,ue)}let se=!1;z.version===Et.__version?(Et.needsLights&&Et.lightsStateVersion!==Ve.state.version||Et.outputColorSpace!==xt||G.isBatchedMesh&&Et.batching===!1||!G.isBatchedMesh&&Et.batching===!0||G.isBatchedMesh&&Et.batchingColor===!0&&G.colorTexture===null||G.isBatchedMesh&&Et.batchingColor===!1&&G.colorTexture!==null||G.isInstancedMesh&&Et.instancing===!1||!G.isInstancedMesh&&Et.instancing===!0||G.isSkinnedMesh&&Et.skinning===!1||!G.isSkinnedMesh&&Et.skinning===!0||G.isInstancedMesh&&Et.instancingColor===!0&&G.instanceColor===null||G.isInstancedMesh&&Et.instancingColor===!1&&G.instanceColor!==null||G.isInstancedMesh&&Et.instancingMorph===!0&&G.morphTexture===null||G.isInstancedMesh&&Et.instancingMorph===!1&&G.morphTexture!==null||Et.envMap!==Dt||z.fog===!0&&Et.fog!==vt||Et.numClippingPlanes!==void 0&&(Et.numClippingPlanes!==Tt.numPlanes||Et.numIntersection!==Tt.numIntersection)||Et.vertexAlphas!==Yt||Et.vertexTangents!==Zt||Et.morphTargets!==Nt||Et.morphNormals!==ce||Et.morphColors!==ve||Et.toneMapping!==ge||Et.morphTargetsCount!==Le||!!Et.lightProbeGrid!=w.state.lightProbeGridArray.length>0)&&(se=!0):(se=!0,Et.__version=z.version);let Ye=Et.currentProgram;se===!0&&(Ye=as(z,F,G),O&&z.isNodeMaterial&&O.onUpdateProgram(z,Ye,Et));let an=!1,Pn=!1,ri=!1;const de=Ye.getUniforms(),Me=Et.uniforms;if(st.useProgram(Ye.program)&&(an=!0,Pn=!0,ri=!0),z.id!==V&&(V=z.id,Pn=!0),Et.needsLights){const ue=jc(w.state.lightProbeGridArray,G);Et.lightProbeGrid!==ue&&(Et.lightProbeGrid=ue,Pn=!0)}if(an||k!==b){st.buffers.depth.getReversed()&&b.reversedDepth!==!0&&(b._reversedDepth=!0,b.updateProjectionMatrix()),de.setValue(I,"projectionMatrix",b.projectionMatrix),de.setValue(I,"viewMatrix",b.matrixWorldInverse);const In=de.map.cameraPosition;In!==void 0&&In.setValue(I,it.setFromMatrixPosition(b.matrixWorld)),Gt.logarithmicDepthBuffer&&de.setValue(I,"logDepthBufFC",2/(Math.log(b.far+1)/Math.LN2)),(z.isMeshPhongMaterial||z.isMeshToonMaterial||z.isMeshLambertMaterial||z.isMeshBasicMaterial||z.isMeshStandardMaterial||z.isShaderMaterial)&&de.setValue(I,"isOrthographic",b.isOrthographicCamera===!0),k!==b&&(k=b,Pn=!0,ri=!0)}if(Et.needsLights&&(Ve.state.directionalShadowMap.length>0&&de.setValue(I,"directionalShadowMap",Ve.state.directionalShadowMap,_),Ve.state.spotShadowMap.length>0&&de.setValue(I,"spotShadowMap",Ve.state.spotShadowMap,_),Ve.state.pointShadowMap.length>0&&de.setValue(I,"pointShadowMap",Ve.state.pointShadowMap,_)),G.isSkinnedMesh){de.setOptional(I,G,"bindMatrix"),de.setOptional(I,G,"bindMatrixInverse");const ue=G.skeleton;ue&&(ue.boneTexture===null&&ue.computeBoneTexture(),de.setValue(I,"boneTexture",ue.boneTexture,_))}G.isBatchedMesh&&(de.setOptional(I,G,"batchingTexture"),de.setValue(I,"batchingTexture",G._matricesTexture,_),de.setOptional(I,G,"batchingIdTexture"),de.setValue(I,"batchingIdTexture",G._indirectTexture,_),de.setOptional(I,G,"batchingColorTexture"),G._colorsTexture!==null&&de.setValue(I,"batchingColorTexture",G._colorsTexture,_));const Ln=H.morphAttributes;if((Ln.position!==void 0||Ln.normal!==void 0||Ln.color!==void 0)&&Wt.update(G,H,Ye),(Pn||Et.receiveShadow!==G.receiveShadow)&&(Et.receiveShadow=G.receiveShadow,de.setValue(I,"receiveShadow",G.receiveShadow)),(z.isMeshStandardMaterial||z.isMeshLambertMaterial||z.isMeshPhongMaterial)&&z.envMap===null&&F.environment!==null&&(Me.envMapIntensity.value=F.environmentIntensity),Me.dfgLUT!==void 0&&(Me.dfgLUT.value=Q0()),Pn){if(de.setValue(I,"toneMappingExposure",D.toneMappingExposure),Et.needsLights&&th(Me,ri),vt&&z.fog===!0&&X.refreshFogUniforms(Me,vt),X.refreshMaterialUniforms(Me,z,Vt,ne,w.state.transmissionRenderTarget[b.id]),Et.needsLights&&Et.lightProbeGrid){const ue=Et.lightProbeGrid;Me.probesSH.value=ue.texture,Me.probesMin.value.copy(ue.boundingBox.min),Me.probesMax.value.copy(ue.boundingBox.max),Me.probesResolution.value.copy(ue.resolution)}$s.upload(I,Pa(Et),Me,_)}if(z.isShaderMaterial&&z.uniformsNeedUpdate===!0&&($s.upload(I,Pa(Et),Me,_),z.uniformsNeedUpdate=!1),z.isSpriteMaterial&&de.setValue(I,"center",G.center),de.setValue(I,"modelViewMatrix",G.modelViewMatrix),de.setValue(I,"normalMatrix",G.normalMatrix),de.setValue(I,"modelMatrix",G.matrixWorld),z.uniformsGroups!==void 0){const ue=z.uniformsGroups;for(let In=0,oi=ue.length;In<oi;In++){const Ia=ue[In];Y.update(Ia,Ye),Y.bind(Ia,Ye)}}return Ye}function th(b,F){b.ambientLightColor.needsUpdate=F,b.lightProbe.needsUpdate=F,b.directionalLights.needsUpdate=F,b.directionalLightShadows.needsUpdate=F,b.pointLights.needsUpdate=F,b.pointLightShadows.needsUpdate=F,b.spotLights.needsUpdate=F,b.spotLightShadows.needsUpdate=F,b.rectAreaLights.needsUpdate=F,b.hemisphereLights.needsUpdate=F}function eh(b){return b.isMeshLambertMaterial||b.isMeshToonMaterial||b.isMeshPhongMaterial||b.isMeshStandardMaterial||b.isShadowMaterial||b.isShaderMaterial&&b.lights===!0}this.getActiveCubeFace=function(){return W},this.getActiveMipmapLevel=function(){return q},this.getRenderTarget=function(){return U},this.setRenderTargetTextures=function(b,F,H){const z=T.get(b);z.__autoAllocateDepthBuffer=b.resolveDepthBuffer===!1,z.__autoAllocateDepthBuffer===!1&&(z.__useRenderToTexture=!1),T.get(b.texture).__webglTexture=F,T.get(b.depthTexture).__webglTexture=z.__autoAllocateDepthBuffer?void 0:H,z.__hasExternalTextures=!0},this.setRenderTargetFramebuffer=function(b,F){const H=T.get(b);H.__webglFramebuffer=F,H.__useDefaultFramebuffer=F===void 0};const nh=I.createFramebuffer();this.setRenderTarget=function(b,F=0,H=0){U=b,W=F,q=H;let z=null,G=!1,vt=!1;if(b){const xt=T.get(b);if(xt.__useDefaultFramebuffer!==void 0){st.bindFramebuffer(I.FRAMEBUFFER,xt.__webglFramebuffer),et.copy(b.viewport),nt.copy(b.scissor),pt=b.scissorTest,st.viewport(et),st.scissor(nt),st.setScissorTest(pt),V=-1;return}else if(xt.__webglFramebuffer===void 0)_.setupRenderTarget(b);else if(xt.__hasExternalTextures)_.rebindTextures(b,T.get(b.texture).__webglTexture,T.get(b.depthTexture).__webglTexture);else if(b.depthBuffer){const Yt=b.depthTexture;if(xt.__boundDepthTexture!==Yt){if(Yt!==null&&T.has(Yt)&&(b.width!==Yt.image.width||b.height!==Yt.image.height))throw new Error("WebGLRenderTarget: Attached DepthTexture is initialized to the incorrect size.");_.setupDepthRenderbuffer(b)}}const Rt=b.texture;(Rt.isData3DTexture||Rt.isDataArrayTexture||Rt.isCompressedArrayTexture)&&(vt=!0);const Dt=T.get(b).__webglFramebuffer;b.isWebGLCubeRenderTarget?(Array.isArray(Dt[F])?z=Dt[F][H]:z=Dt[F],G=!0):b.samples>0&&_.useMultisampledRTT(b)===!1?z=T.get(b).__webglMultisampledFramebuffer:Array.isArray(Dt)?z=Dt[H]:z=Dt,et.copy(b.viewport),nt.copy(b.scissor),pt=b.scissorTest}else et.copy(at).multiplyScalar(Vt).floor(),nt.copy(Pt).multiplyScalar(Vt).floor(),pt=Ot;if(H!==0&&(z=nh),st.bindFramebuffer(I.FRAMEBUFFER,z)&&st.drawBuffers(b,z),st.viewport(et),st.scissor(nt),st.setScissorTest(pt),G){const xt=T.get(b.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_CUBE_MAP_POSITIVE_X+F,xt.__webglTexture,H)}else if(vt){const xt=F;for(let Rt=0;Rt<b.textures.length;Rt++){const Dt=T.get(b.textures[Rt]);I.framebufferTextureLayer(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0+Rt,Dt.__webglTexture,H,xt)}}else if(b!==null&&H!==0){const xt=T.get(b.texture);I.framebufferTexture2D(I.FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,xt.__webglTexture,H)}V=-1},this.readRenderTargetPixels=function(b,F,H,z,G,vt,wt,xt=0){if(!(b&&b.isWebGLRenderTarget)){ee("WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");return}let Rt=T.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&wt!==void 0&&(Rt=Rt[wt]),Rt){st.bindFramebuffer(I.FRAMEBUFFER,Rt);try{const Dt=b.textures[xt],Yt=Dt.format,Zt=Dt.type;if(b.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+xt),!Gt.textureFormatReadable(Yt)){ee("WebGLRenderer.readRenderTargetPixels: renderTarget is not in RGBA or implementation defined format.");return}if(!Gt.textureTypeReadable(Zt)){ee("WebGLRenderer.readRenderTargetPixels: renderTarget is not in UnsignedByteType or implementation defined type.");return}F>=0&&F<=b.width-z&&H>=0&&H<=b.height-G&&I.readPixels(F,H,z,G,N.convert(Yt),N.convert(Zt),vt)}finally{const Dt=U!==null?T.get(U).__webglFramebuffer:null;st.bindFramebuffer(I.FRAMEBUFFER,Dt)}}},this.readRenderTargetPixelsAsync=async function(b,F,H,z,G,vt,wt,xt=0){if(!(b&&b.isWebGLRenderTarget))throw new Error("THREE.WebGLRenderer.readRenderTargetPixels: renderTarget is not THREE.WebGLRenderTarget.");let Rt=T.get(b).__webglFramebuffer;if(b.isWebGLCubeRenderTarget&&wt!==void 0&&(Rt=Rt[wt]),Rt)if(F>=0&&F<=b.width-z&&H>=0&&H<=b.height-G){st.bindFramebuffer(I.FRAMEBUFFER,Rt);const Dt=b.textures[xt],Yt=Dt.format,Zt=Dt.type;if(b.textures.length>1&&I.readBuffer(I.COLOR_ATTACHMENT0+xt),!Gt.textureFormatReadable(Yt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in RGBA or implementation defined format.");if(!Gt.textureTypeReadable(Zt))throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: renderTarget is not in UnsignedByteType or implementation defined type.");const Nt=I.createBuffer();I.bindBuffer(I.PIXEL_PACK_BUFFER,Nt),I.bufferData(I.PIXEL_PACK_BUFFER,vt.byteLength,I.STREAM_READ),I.readPixels(F,H,z,G,N.convert(Yt),N.convert(Zt),0);const ce=U!==null?T.get(U).__webglFramebuffer:null;st.bindFramebuffer(I.FRAMEBUFFER,ce);const ve=I.fenceSync(I.SYNC_GPU_COMMANDS_COMPLETE,0);return I.flush(),await Gh(I,ve,4),I.bindBuffer(I.PIXEL_PACK_BUFFER,Nt),I.getBufferSubData(I.PIXEL_PACK_BUFFER,0,vt),I.deleteBuffer(Nt),I.deleteSync(ve),vt}else throw new Error("THREE.WebGLRenderer.readRenderTargetPixelsAsync: requested read bounds are out of range.")},this.copyFramebufferToTexture=function(b,F=null,H=0){const z=Math.pow(2,-H),G=Math.floor(b.image.width*z),vt=Math.floor(b.image.height*z),wt=F!==null?F.x:0,xt=F!==null?F.y:0;_.setTexture2D(b,0),I.copyTexSubImage2D(I.TEXTURE_2D,H,0,0,wt,xt,G,vt),st.unbindTexture()};const ih=I.createFramebuffer(),sh=I.createFramebuffer();this.copyTextureToTexture=function(b,F,H=null,z=null,G=0,vt=0){let wt,xt,Rt,Dt,Yt,Zt,Nt,ce,ve;const ge=b.isCompressedTexture?b.mipmaps[vt]:b.image;if(H!==null)wt=H.max.x-H.min.x,xt=H.max.y-H.min.y,Rt=H.isBox3?H.max.z-H.min.z:1,Dt=H.min.x,Yt=H.min.y,Zt=H.isBox3?H.min.z:0;else{const Me=Math.pow(2,-G);wt=Math.floor(ge.width*Me),xt=Math.floor(ge.height*Me),b.isDataArrayTexture?Rt=ge.depth:b.isData3DTexture?Rt=Math.floor(ge.depth*Me):Rt=1,Dt=0,Yt=0,Zt=0}z!==null?(Nt=z.x,ce=z.y,ve=z.z):(Nt=0,ce=0,ve=0);const he=N.convert(F.format),Le=N.convert(F.type);let Et;F.isData3DTexture?(_.setTexture3D(F,0),Et=I.TEXTURE_3D):F.isDataArrayTexture||F.isCompressedArrayTexture?(_.setTexture2DArray(F,0),Et=I.TEXTURE_2D_ARRAY):(_.setTexture2D(F,0),Et=I.TEXTURE_2D),st.activeTexture(I.TEXTURE0),st.pixelStorei(I.UNPACK_FLIP_Y_WEBGL,F.flipY),st.pixelStorei(I.UNPACK_PREMULTIPLY_ALPHA_WEBGL,F.premultiplyAlpha),st.pixelStorei(I.UNPACK_ALIGNMENT,F.unpackAlignment);const Ve=st.getParameter(I.UNPACK_ROW_LENGTH),se=st.getParameter(I.UNPACK_IMAGE_HEIGHT),Ye=st.getParameter(I.UNPACK_SKIP_PIXELS),an=st.getParameter(I.UNPACK_SKIP_ROWS),Pn=st.getParameter(I.UNPACK_SKIP_IMAGES);st.pixelStorei(I.UNPACK_ROW_LENGTH,ge.width),st.pixelStorei(I.UNPACK_IMAGE_HEIGHT,ge.height),st.pixelStorei(I.UNPACK_SKIP_PIXELS,Dt),st.pixelStorei(I.UNPACK_SKIP_ROWS,Yt),st.pixelStorei(I.UNPACK_SKIP_IMAGES,Zt);const ri=b.isDataArrayTexture||b.isData3DTexture,de=F.isDataArrayTexture||F.isData3DTexture;if(b.isDepthTexture){const Me=T.get(b),Ln=T.get(F),ue=T.get(Me.__renderTarget),In=T.get(Ln.__renderTarget);st.bindFramebuffer(I.READ_FRAMEBUFFER,ue.__webglFramebuffer),st.bindFramebuffer(I.DRAW_FRAMEBUFFER,In.__webglFramebuffer);for(let oi=0;oi<Rt;oi++)ri&&(I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,T.get(b).__webglTexture,G,Zt+oi),I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,T.get(F).__webglTexture,vt,ve+oi)),I.blitFramebuffer(Dt,Yt,wt,xt,Nt,ce,wt,xt,I.DEPTH_BUFFER_BIT,I.NEAREST);st.bindFramebuffer(I.READ_FRAMEBUFFER,null),st.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else if(G!==0||b.isRenderTargetTexture||T.has(b)){const Me=T.get(b),Ln=T.get(F);st.bindFramebuffer(I.READ_FRAMEBUFFER,ih),st.bindFramebuffer(I.DRAW_FRAMEBUFFER,sh);for(let ue=0;ue<Rt;ue++)ri?I.framebufferTextureLayer(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Me.__webglTexture,G,Zt+ue):I.framebufferTexture2D(I.READ_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Me.__webglTexture,G),de?I.framebufferTextureLayer(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,Ln.__webglTexture,vt,ve+ue):I.framebufferTexture2D(I.DRAW_FRAMEBUFFER,I.COLOR_ATTACHMENT0,I.TEXTURE_2D,Ln.__webglTexture,vt),G!==0?I.blitFramebuffer(Dt,Yt,wt,xt,Nt,ce,wt,xt,I.COLOR_BUFFER_BIT,I.NEAREST):de?I.copyTexSubImage3D(Et,vt,Nt,ce,ve+ue,Dt,Yt,wt,xt):I.copyTexSubImage2D(Et,vt,Nt,ce,Dt,Yt,wt,xt);st.bindFramebuffer(I.READ_FRAMEBUFFER,null),st.bindFramebuffer(I.DRAW_FRAMEBUFFER,null)}else de?b.isDataTexture||b.isData3DTexture?I.texSubImage3D(Et,vt,Nt,ce,ve,wt,xt,Rt,he,Le,ge.data):F.isCompressedArrayTexture?I.compressedTexSubImage3D(Et,vt,Nt,ce,ve,wt,xt,Rt,he,ge.data):I.texSubImage3D(Et,vt,Nt,ce,ve,wt,xt,Rt,he,Le,ge):b.isDataTexture?I.texSubImage2D(I.TEXTURE_2D,vt,Nt,ce,wt,xt,he,Le,ge.data):b.isCompressedTexture?I.compressedTexSubImage2D(I.TEXTURE_2D,vt,Nt,ce,ge.width,ge.height,he,ge.data):I.texSubImage2D(I.TEXTURE_2D,vt,Nt,ce,wt,xt,he,Le,ge);st.pixelStorei(I.UNPACK_ROW_LENGTH,Ve),st.pixelStorei(I.UNPACK_IMAGE_HEIGHT,se),st.pixelStorei(I.UNPACK_SKIP_PIXELS,Ye),st.pixelStorei(I.UNPACK_SKIP_ROWS,an),st.pixelStorei(I.UNPACK_SKIP_IMAGES,Pn),vt===0&&F.generateMipmaps&&I.generateMipmap(Et),st.unbindTexture()},this.initRenderTarget=function(b){T.get(b).__webglFramebuffer===void 0&&_.setupRenderTarget(b)},this.initTexture=function(b){b.isCubeTexture?_.setTextureCube(b,0):b.isData3DTexture?_.setTexture3D(b,0):b.isDataArrayTexture||b.isCompressedArrayTexture?_.setTexture2DArray(b,0):_.setTexture2D(b,0),st.unbindTexture()},this.resetState=function(){W=0,q=0,U=null,st.reset(),ct.reset()},typeof __THREE_DEVTOOLS__<"u"&&__THREE_DEVTOOLS__.dispatchEvent(new CustomEvent("observe",{detail:this}))}get coordinateSystem(){return dn}get outputColorSpace(){return this._outputColorSpace}set outputColorSpace(t){this._outputColorSpace=t;const e=this.getContext();e.drawingBufferColorSpace=te._getDrawingBufferColorSpace(t),e.unpackColorSpace=te._getUnpackColorSpace()}}const Us=2;class eg{constructor(t){P(this,"renderer");P(this,"scene");P(this,"camera");P(this,"clock");P(this,"directionalLight");P(this,"ambientLight");P(this,"renderTarget");P(this,"pixelQuadScene");P(this,"pixelQuadCamera");P(this,"updateCallbacks",[]);P(this,"resizeHandler");this.renderer=new tg({canvas:t,antialias:!1,logarithmicDepthBuffer:!0}),this.renderer.setPixelRatio(1),this.renderer.setSize(window.innerWidth,window.innerHeight),this.renderer.shadowMap.enabled=!0,this.renderer.shadowMap.type=Yi,this.renderer.toneMapping=jo,this.renderer.toneMappingExposure=1.2,this.renderer.autoClear=!1,this.scene=new Za,this.scene.background=new yt(1710638),this.scene.fog=new ca(1710638,50,200),this.camera=new qe(60,window.innerWidth/window.innerHeight,.5,800),this.camera.position.set(0,5,10),this.camera.lookAt(0,0,0);let e=performance.now();this.clock={getDelta:()=>{const l=performance.now(),c=(l-e)/1e3;return e=l,Math.min(c,.1)}};const n=Math.floor(window.innerWidth/Us),i=Math.floor(window.innerHeight/Us);this.renderTarget=new sn(n,i,{minFilter:Ee,magFilter:Ee,format:Je,type:ze,depthBuffer:!0,stencilBuffer:!1}),this.pixelQuadCamera=new rr(-1,1,1,-1,0,1),this.pixelQuadScene=new Za;const s=new Di(2,2),o=new ha({map:this.renderTarget.texture}),a=new Ft(s,o);this.pixelQuadScene.add(a),this.ambientLight=new jd(4482730,4469538,.5),this.scene.add(this.ambientLight),this.directionalLight=new eu(16777215,1),this.directionalLight.position.set(10,20,10),this.directionalLight.castShadow=!0,this.directionalLight.shadow.mapSize.set(2048,2048),this.directionalLight.shadow.camera.near=1,this.directionalLight.shadow.camera.far=200,this.directionalLight.shadow.camera.left=-60,this.directionalLight.shadow.camera.right=60,this.directionalLight.shadow.camera.top=60,this.directionalLight.shadow.camera.bottom=-60,this.directionalLight.shadow.bias=-.002,this.directionalLight.shadow.normalBias=.02,this.scene.add(this.directionalLight),this.resizeHandler=this.onResize.bind(this),window.addEventListener("resize",this.resizeHandler),this.renderer.setAnimationLoop(this.animate.bind(this))}onUpdate(t){this.updateCallbacks.push(t)}offUpdate(t){const e=this.updateCallbacks.indexOf(t);e!==-1&&this.updateCallbacks.splice(e,1)}animate(){const t=this.clock.getDelta();for(const e of this.updateCallbacks)e(t);this.renderer.setRenderTarget(this.renderTarget),this.renderer.clear(),this.renderer.render(this.scene,this.camera),this.renderer.setRenderTarget(null),this.renderer.clear(),this.renderer.render(this.pixelQuadScene,this.pixelQuadCamera)}onResize(){const t=window.innerWidth,e=window.innerHeight;this.camera.aspect=t/e,this.camera.updateProjectionMatrix(),this.renderer.setSize(t,e);const n=Math.floor(t/Us),i=Math.floor(e/Us);this.renderTarget.setSize(n,i)}dispose(){this.renderer.setAnimationLoop(null),this.renderer.dispose(),this.renderTarget.dispose(),window.removeEventListener("resize",this.resizeHandler)}}class ng{constructor(){P(this,"keysDown",new Set);P(this,"keysPressed",new Set);P(this,"mouse",new ot);P(this,"mouseDown",!1);P(this,"mouseClicked",!1);P(this,"mouseDeltaX",0);P(this,"mouseDeltaY",0);P(this,"scrollDelta",0);P(this,"boundHandlers");this.boundHandlers={keydown:t=>{const e=t.key.toLowerCase();e==="tab"&&t.preventDefault(),this.keysDown.has(e)||this.keysPressed.add(e),this.keysDown.add(e)},keyup:t=>{this.keysDown.delete(t.key.toLowerCase())},mousemove:t=>{this.mouse.x=t.clientX/window.innerWidth*2-1,this.mouse.y=-(t.clientY/window.innerHeight)*2+1,this.mouseDeltaX+=t.movementX,this.mouseDeltaY+=t.movementY},mousedown:t=>{t.button===0&&(this.mouseDown=!0,this.mouseClicked=!0)},mouseup:t=>{t.button===0&&(this.mouseDown=!1)},wheel:t=>{this.scrollDelta+=t.deltaY},contextmenu:t=>{t.preventDefault()}},window.addEventListener("keydown",this.boundHandlers.keydown),window.addEventListener("keyup",this.boundHandlers.keyup),window.addEventListener("mousemove",this.boundHandlers.mousemove),window.addEventListener("mousedown",this.boundHandlers.mousedown),window.addEventListener("mouseup",this.boundHandlers.mouseup),window.addEventListener("wheel",this.boundHandlers.wheel),window.addEventListener("contextmenu",this.boundHandlers.contextmenu)}isKeyDown(t){return this.keysDown.has(t.toLowerCase())}wasKeyPressed(t){return this.keysPressed.has(t.toLowerCase())}endFrame(){this.keysPressed.clear(),this.mouseClicked=!1,this.mouseDeltaX=0,this.mouseDeltaY=0,this.scrollDelta=0}dispose(){window.removeEventListener("keydown",this.boundHandlers.keydown),window.removeEventListener("keyup",this.boundHandlers.keyup),window.removeEventListener("mousemove",this.boundHandlers.mousemove),window.removeEventListener("mousedown",this.boundHandlers.mousedown),window.removeEventListener("mouseup",this.boundHandlers.mouseup),window.removeEventListener("wheel",this.boundHandlers.wheel),window.removeEventListener("contextmenu",this.boundHandlers.contextmenu)}}const ig=.5,sg=-37,rg=37;class ss{constructor(t){P(this,"points");P(this,"surfaceFinish");P(this,"metalRemoved");P(this,"temperature");this.points=t??ss.createAREMA136RE(),this.surfaceFinish=0,this.metalRemoved=0,this.temperature=20}static createAREMA136RE(){const t=[];for(let a=sg;a<=rg;a+=ig){let l;if(a<-20){const c=a- -20,d=254-Math.sqrt(254*254- -20*-20),u=38-Math.sqrt(Math.max(0,38*38-c*c));l=d+u}else if(a>22){const c=a-22,d=254-Math.sqrt(254*254-22*22),u=13-Math.sqrt(Math.max(0,13*13-c*c));l=d+u}else l=254-Math.sqrt(254*254-a*a);t.push({x:a,y:l})}return t}clone(){const t=new ss(this.points.map(e=>({x:e.x,y:e.y})));return t.surfaceFinish=this.surfaceFinish,t.metalRemoved=this.metalRemoved,t.temperature=this.temperature,t}removeMetalAt(t,e,n){const i=e/2;for(const s of this.points){const o=Math.abs(s.x-t);if(o<i){const a=o/i,l=1-a*a,c=n*l;s.y+=c,this.metalRemoved+=c}}this.updateSurfaceFinish()}compare(t){const e=[];let n=0,i=0,s=0;for(let a=0;a<this.points.length&&a<t.points.length;a++){const l=t.points[a].y-this.points[a].y;e.push(l);const c=Math.abs(l);n+=c,c>i&&(i=c),c<=t.tolerance&&s++}const o=e.length||1;return{averageDeviation:n/o,maxDeviation:i,pointDeviations:e,withinTolerance:s/o}}findWorstZones(t,e=3){const n=this.compare(t),i=[];for(let s=2;s<n.pointDeviations.length-2;s++){const o=n.pointDeviations[s],a=Math.abs(o);if(a<t.tolerance*1.5)continue;const l=[Math.abs(n.pointDeviations[s-2]),Math.abs(n.pointDeviations[s-1]),Math.abs(n.pointDeviations[s+1]),Math.abs(n.pointDeviations[s+2])];a>=Math.max(...l)&&i.push({centerX:this.points[s].x,severity:o})}return i.sort((s,o)=>Math.abs(o.severity)-Math.abs(s.severity)),i.slice(0,e)}getDeviationAtX(t,e){const n=Math.round((t-this.points[0].x)/.5);return n<0||n>=this.points.length||n>=e.points.length?0:e.points[n].y-this.points[n].y}countOverground(t){let e=0;for(let n=0;n<this.points.length&&n<t.points.length;n++)t.points[n].y-this.points[n].y<-t.tolerance&&e++;return e}getYAtX(t){for(let e=0;e<this.points.length-1;e++){const n=this.points[e],i=this.points[e+1];if(t>=n.x&&t<=i.x){const s=(t-n.x)/(i.x-n.x);return n.y+s*(i.y-n.y)}}return t<=this.points[0].x?this.points[0].y:this.points[this.points.length-1].y}getBounds(){let t=1/0,e=-1/0;for(const n of this.points)n.y<t&&(t=n.y),n.y>e&&(e=n.y);return{minX:this.points[0].x,maxX:this.points[this.points.length-1].x,minY:t,maxY:e}}updateSurfaceFinish(){if(this.points.length<3)return;let t=0;for(let e=1;e<this.points.length-1;e++){const n=this.points[e-1].y-2*this.points[e].y+this.points[e+1].y;t+=Math.abs(n)}this.surfaceFinish=Math.min(1,t/this.points.length*10)}}const og=5,ag=.002,Wl=.3,Fs=.04,Xl=new yt(3814704),Yr=new yt(3346688),ql=new yt(8943462),lg=new yt(13158608),cg=new yt(657936),Yl=new yt(2232576),hg=new yt(16777215);class dg{constructor(t,e=0){P(this,"mesh");P(this,"profile");P(this,"material");P(this,"length");P(this,"positionZ");P(this,"_grindProgress",0);P(this,"_defectSeverity",0);P(this,"flashTimer",0);this.profile=t,this.length=og,this.positionZ=e,this.material=new Lt({color:Xl.clone(),emissive:Yr.clone(),emissiveIntensity:0,metalness:.4,roughness:.75,side:tn}),this.mesh=new Ft(this.buildGeometry(),this.material),this.mesh.castShadow=!0,this.mesh.receiveShadow=!0,this.mesh.position.z=e}get grindProgress(){return this._grindProgress}setDefectSeverity(t){this._defectSeverity=Math.max(0,Math.min(1,t)),this._grindProgress<.1&&(this.material.emissive.copy(Yr),this.material.emissiveIntensity=this._defectSeverity*.4)}setGrindProgress(t){this._grindProgress=Math.max(0,Math.min(1,t));const e=this._grindProgress;if(!(this.flashTimer>0)){if(e<.5){const n=e/.5;this.material.color.copy(Xl).lerp(ql,n),this.material.emissive.copy(Yr).lerp(Yl,n),this.material.emissiveIntensity=this._defectSeverity*.4*(1-n),this.material.metalness=.4+n*.2,this.material.roughness=.75-n*.15}else{const n=(e-.5)/.5;this.material.color.copy(ql).lerp(lg,n),this.material.emissive.copy(Yl).lerp(cg,n),this.material.emissiveIntensity=n*.15,this.material.metalness=.6+n*.3,this.material.roughness=.6-n*.2}this.material.needsUpdate=!0}}flashComplete(){this.flashTimer=.4,this.material.emissive.copy(hg),this.material.emissiveIntensity=1.5}update(t){this.flashTimer>0&&(this.flashTimer-=t,this.flashTimer<=0?(this.flashTimer=0,this.setGrindProgress(this._grindProgress)):this.material.emissiveIntensity=this.flashTimer/.4*1.5)}rebuildMesh(){const t=this.mesh.geometry;this.mesh.geometry=this.buildGeometry(),t.dispose()}setProfile(t){this.profile=t,this.rebuildMesh()}buildGeometry(){return new sr(this.createRailShape(),{steps:1,depth:this.length,bevelEnabled:!1})}createRailShape(){const t=new xa,e=this.profile.points,n=ag,i=-Wl/2,s=Wl/2,o=-.24000000000000002,a=-.2;t.moveTo(i,o),t.lineTo(s,o),t.lineTo(s,a),t.lineTo(Fs/2,a),t.lineTo(Fs/2,0);const l=e[e.length-1];t.lineTo(l.x*n,-l.y*n);for(let c=e.length-2;c>=0;c--)t.lineTo(e[c].x*n,-e[c].y*n);return t.lineTo(-Fs/2,0),t.lineTo(-Fs/2,a),t.lineTo(i,a),t.lineTo(i,o),t}dispose(){this.mesh.geometry.dispose(),this.material.dispose()}}const $r=1.6,Os=5,Kr=20,$l=.6;class Kl{constructor(t,e,n){P(this,"group");P(this,"leftSegments",[]);P(this,"rightSegments",[]);P(this,"leftProfiles",[]);P(this,"rightProfiles",[]);P(this,"_tpWorldUp",new E(0,1,0));P(this,"_tpRight",new E);P(this,"_tpBaseUp",new E);P(this,"_tpBankQuat",new Be);P(this,"path");P(this,"totalLength");P(this,"segmentCount");P(this,"sectionCount");P(this,"bankAngles");this.group=new be,this.path=new Lc(t,!1,"catmullrom",.3),this.path.arcLengthDivisions=1e3,this.totalLength=this.path.getLength(),this.segmentCount=Math.max(1,Math.floor(this.totalLength/Os));const i=Math.max(1,Math.floor(this.totalLength/Kr));this.sectionCount=n?Math.min(i,n):i,this.bankAngles=e??this.computeBankAngles(t.length),this.buildRails(),this.buildTies(),this.buildBallast()}getTrackPoint(t){const e=Math.max(0,Math.min(1,t/this.totalLength)),n=this.path.getPointAt(e),i=this.path.getTangentAt(e).normalize(),s=this._tpRight.crossVectors(this._tpWorldUp,i).normalize(),o=this._tpBaseUp.crossVectors(i,s).normalize(),a=this.getBankAtT(e);this._tpBankQuat.setFromAxisAngle(i,a);const l=o.applyQuaternion(this._tpBankQuat),c=s.applyQuaternion(this._tpBankQuat);return{position:n,forward:i,up:l,right:c,bank:a,t:e}}getSegmentIndex(t){return Math.max(0,Math.min(this.segmentCount-1,Math.floor(t/Os)))}getSectionIndex(t){return Math.max(0,Math.min(this.sectionCount-1,Math.floor(t/Kr)))}getSegmentsForSection(t){const e=Math.round(Kr/Os),n=t*e,i=[];for(let s=n;s<n+e&&s<this.segmentCount;s++)i.push(s);return i}getProfile(t=0,e="left"){const n=e==="left"?this.leftProfiles:this.rightProfiles;return n[Math.max(0,Math.min(t,n.length-1))]}rebuildSegment(t=0,e="left"){const n=e==="left"?this.leftSegments:this.rightSegments,i=e==="left"?this.leftProfiles:this.rightProfiles,s=Math.max(0,Math.min(t,n.length-1));n[s].setProfile(i[s])}computeBankAngles(t){const e=[];for(let i=0;i<t;i++){const s=i/(t-1),o=Math.max(0,s-.001),a=Math.min(1,s+.001),l=this.path.getTangentAt(o),c=this.path.getTangentAt(a),u=new E().crossVectors(l,c).y/(2*.001),h=.12,f=Math.max(-h,Math.min(h,u*2));e.push(f)}return e}getBankAtT(t){if(this.bankAngles.length<2)return 0;const e=t*(this.bankAngles.length-1),n=Math.floor(e),i=e-n,s=this.bankAngles[Math.min(n,this.bankAngles.length-1)],o=this.bankAngles[Math.min(n+1,this.bankAngles.length-1)];return s+(o-s)*i}buildRails(){for(let t=0;t<this.segmentCount;t++){const e=t*Os,n=this.getTrackPoint(e);for(const i of["left","right"]){const s=new ss,o=new dg(s,0),a=i==="left"?-1:1,l=n.right.clone().multiplyScalar(a*$r/2);o.mesh.position.copy(n.position).add(l);const c=new Be,d=new Qt().makeBasis(n.right,n.up,n.forward);c.setFromRotationMatrix(d),o.mesh.quaternion.copy(c),i==="left"?(this.leftSegments.push(o),this.leftProfiles.push(s)):(this.rightSegments.push(o),this.rightProfiles.push(s)),this.group.add(o.mesh)}}}buildTies(){const t=new pe($r+1,.12,.18),e=new Lt({color:5915696,roughness:.9,metalness:0}),n=Math.floor(this.totalLength/$l);for(let i=0;i<n;i++){const s=i*$l,o=this.getTrackPoint(s),a=new Ft(t,e);a.position.copy(o.position),a.position.y-=.3;const l=new Be,c=new Qt().makeBasis(o.right,o.up,o.forward);l.setFromRotationMatrix(c),a.quaternion.copy(l),a.receiveShadow=!0,this.group.add(a)}}buildBallast(){const t=new Lt({color:7829367,roughness:1,metalness:0}),e=5,n=Math.floor(this.totalLength/e),i=new pe($r+2,.25,e);for(let s=0;s<n;s++){const o=s*e+e/2,a=this.getTrackPoint(o),l=new Ft(i,t);l.position.copy(a.position),l.position.y-=.45;const c=new Be,d=new Qt().makeBasis(a.right,a.up,a.forward);c.setFromRotationMatrix(d),l.quaternion.copy(c),l.receiveShadow=!0,this.group.add(l)}}dispose(){for(const t of[...this.leftSegments,...this.rightSegments])t.dispose()}}const Xe=30,Bs="#888",ug="rgba(255, 255, 255, 0.08)",Jr="#ff4444",Jl="#44ff44",Zl="#44ff44",jl="#ffaa00",Ql="#ff0066",ks="#ff8800";class tc{constructor(t){P(this,"canvas");P(this,"ctx");P(this,"stoneX",0);P(this,"stoneWidth",20);P(this,"stoneVisible",!1);P(this,"stoneGrinding",!1);P(this,"stonePressure",50);P(this,"worstZones",[]);P(this,"damageCount",0);P(this,"passCount",0);P(this,"pulsePhase",0);P(this,"borderFlash",!1);P(this,"previewProfile",null);P(this,"ghostProfile",null);P(this,"ghostAlpha",0);P(this,"mirrored",!1);this.canvas=document.getElementById(t),this.ctx=this.canvas.getContext("2d")}setWorstZones(t){this.worstZones=t}setSegmentInfo(t,e){this.damageCount=t,this.passCount=e}setPreview(t){this.previewProfile=t}showBeforeAfter(t){this.ghostProfile=t,this.ghostAlpha=.6}flashBorder(){this.borderFlash=!0,setTimeout(()=>{this.borderFlash=!1},400)}setStoneContact(t,e,n,i,s){this.stoneX=t,this.stoneWidth=e,this.stonePressure=n,this.stoneVisible=i,this.stoneGrinding=s??!1}draw(t,e){const{width:n,height:i}=this.canvas,s=this.ctx;s.clearRect(0,0,n,i);const o=t.getBounds(),a=o.maxX-o.minX;let l=o.minY,c=o.maxY;if(e)for(const p of e.points)p.y<l&&(l=p.y),p.y>c&&(c=p.y);const d=Math.max(.5,(c-l)*.2);l-=d,c+=d;const u=c-l,h=n-Xe*2,f=i-Xe*2,g=this.mirrored?p=>Xe+h-(p-o.minX)/a*h:p=>Xe+(p-o.minX)/a*h,y=p=>Xe+(p-l)/u*f;if(this.drawGrid(s,o.minX,o.maxX,l,c,g,y),this.stoneVisible&&this.drawStoneContact(s,g,y,l,c),e){s.strokeStyle=Jl,s.lineWidth=1.5,s.setLineDash([6,4]),s.beginPath();for(let p=0;p<e.points.length;p++){const m=g(e.points[p].x),x=y(e.points[p].y);p===0?s.moveTo(m,x):s.lineTo(m,x)}s.stroke(),s.setLineDash([])}if(this.ghostProfile&&this.ghostAlpha>.01){s.strokeStyle=`rgba(150, 150, 150, ${this.ghostAlpha})`,s.lineWidth=1.5,s.setLineDash([2,3]),s.beginPath();for(let p=0;p<this.ghostProfile.points.length;p++){const m=g(this.ghostProfile.points[p].x),x=y(this.ghostProfile.points[p].y);p===0?s.moveTo(m,x):s.lineTo(m,x)}s.stroke(),s.setLineDash([]),this.ghostAlpha-=.008,this.ghostAlpha<=.01&&(this.ghostProfile=null)}if(this.previewProfile&&e){s.fillStyle="rgba(255, 170, 0, 0.15)",s.beginPath();for(let x=0;x<t.points.length&&x<this.previewProfile.points.length;x++){const M=g(t.points[x].x),S=y(t.points[x].y);x===0?s.moveTo(M,S):s.lineTo(M,S)}for(let x=this.previewProfile.points.length-1;x>=0;x--)s.lineTo(g(this.previewProfile.points[x].x),y(this.previewProfile.points[x].y));s.closePath(),s.fill(),s.strokeStyle="rgba(255, 170, 0, 0.6)",s.lineWidth=1.5,s.setLineDash([4,3]),s.beginPath();for(let x=0;x<this.previewProfile.points.length;x++){const M=g(this.previewProfile.points[x].x),S=y(this.previewProfile.points[x].y);x===0?s.moveTo(M,S):s.lineTo(M,S)}s.stroke(),s.setLineDash([]);const p=this.previewProfile.compare(e);let m=!1;for(const x of p.pointDeviations)if(x<-e.tolerance){m=!0;break}m&&(s.fillStyle="rgba(255, 0, 60, 0.15)",s.font="bold 11px sans-serif",s.textAlign="center",s.fillText("WARNING: WILL OVER-GRIND",n/2,i-8))}if(e)this.drawColorCodedProfile(s,t,e,g,y);else{s.strokeStyle=Jr,s.lineWidth=2,s.beginPath();for(let p=0;p<t.points.length;p++){const m=g(t.points[p].x),x=y(t.points[p].y);p===0?s.moveTo(m,x):s.lineTo(m,x)}s.stroke()}this.pulsePhase+=.08;for(const p of this.worstZones){const m=g(p.centerX),x=.3+Math.sin(this.pulsePhase*3)*.2,M=p.severity<0;s.fillStyle=M?`rgba(255, 0, 100, ${x})`:`rgba(255, 80, 0, ${x})`,s.beginPath(),s.arc(m,y(0),6,0,Math.PI*2),s.fill(),s.fillStyle=M?"#ff0066":"#ff5500",s.font="8px sans-serif",s.textAlign="center",s.fillText(M?"OVER!":"GRIND",m,y(l)+14)}this.borderFlash&&(s.strokeStyle="#ff0044",s.lineWidth=4,s.strokeRect(2,2,n-4,i-4)),this.drawLabels(s,n,t,e)}drawStoneContact(t,e,n,i,s){const o=e(this.stoneX-this.stoneWidth/2),a=e(this.stoneX+this.stoneWidth/2),l=n(i),c=n(s),d=e(this.stoneX);if(this.stoneGrinding){const u=.1+this.stonePressure/100*.15;t.fillStyle=`rgba(255, 136, 0, ${u})`,t.fillRect(o,l,a-o,c-l),t.strokeStyle=ks,t.lineWidth=2,t.setLineDash([]),t.beginPath(),t.moveTo(d,l),t.lineTo(d,c),t.stroke(),t.fillStyle=ks,t.font="bold 9px sans-serif",t.textAlign="center",t.fillText("GRINDING",d,l-8);const h=n(0),f=3+this.stonePressure/100*5;t.fillStyle=ks,t.beginPath(),t.moveTo(d,h),t.lineTo(d-f,h-f*1.5),t.lineTo(d+f,h-f*1.5),t.closePath(),t.fill()}else{t.fillStyle="rgba(255, 200, 100, 0.04)",t.fillRect(o,l,a-o,c-l),t.strokeStyle="rgba(255, 180, 80, 0.3)",t.lineWidth=1,t.setLineDash([4,4]),t.beginPath(),t.moveTo(d,l),t.lineTo(d,c),t.stroke(),t.setLineDash([]),t.fillStyle="rgba(255, 180, 80, 0.4)",t.font="8px sans-serif",t.textAlign="center",t.fillText("AIM",d,l-6);const u=n(0);t.strokeStyle="rgba(255, 180, 80, 0.4)",t.lineWidth=1,t.beginPath(),t.moveTo(d,u),t.lineTo(d-4,u-6),t.lineTo(d+4,u-6),t.closePath(),t.stroke()}}drawGrid(t,e,n,i,s,o,a){t.strokeStyle=ug,t.lineWidth=.5,t.font="9px monospace",t.fillStyle=Bs;for(let u=Math.ceil(e/10)*10;u<=n;u+=10){const h=o(u);t.beginPath(),t.moveTo(h,Xe),t.lineTo(h,this.canvas.height-Xe),t.stroke(),t.textAlign="center",t.fillText(`${u}`,h,this.canvas.height-Xe+12)}const l=s-i>5?1:.5;for(let u=Math.ceil(i/l)*l;u<=s;u+=l){const h=a(u);t.beginPath(),t.moveTo(Xe,h),t.lineTo(this.canvas.width-Xe,h),t.stroke(),t.textAlign="left",t.fillText(`${u.toFixed(1)}`,2,h+3)}t.fillStyle="#555",t.font="8px monospace",t.textAlign="center";const c=this.mirrored?"FIELD":"GAUGE",d=this.mirrored?"GAUGE":"FIELD";t.fillText(c,o(e+5),this.canvas.height-4),t.fillText(d,o(n-5),this.canvas.height-4)}drawColorCodedProfile(t,e,n,i,s){const o=e.compare(n);for(let a=0;a<e.points.length-1;a++){const l=Math.abs(o.pointDeviations[a]);let c;l<=n.tolerance?c=Zl:l<=n.tolerance*3?c=jl:o.pointDeviations[a]<0?c=Ql:c=Jr,t.strokeStyle=c,t.lineWidth=2.5,t.beginPath(),t.moveTo(i(e.points[a].x),s(e.points[a].y)),t.lineTo(i(e.points[a+1].x),s(e.points[a+1].y)),t.stroke()}}drawLabels(t,e,n,i){t.font="8px sans-serif",t.textAlign="left";let s=15;const o=this.mirrored,a=o?e-10:e-55;t.textAlign=o?"right":"left";const l=(c,d)=>{o?(t.fillStyle=Bs,t.fillText(d,a-9,s),t.fillStyle=c,t.fillRect(a-6,s-6,6,6)):(t.fillStyle=c,t.fillRect(a,s-6,6,6),t.fillStyle=Bs,t.textAlign="left",t.fillText(d,a+9,s)),s+=11};i&&(l(Jl,"Target"),l(Zl,"Good"),l(jl,"Close"),l(Jr,"Grind"),l(Ql,"Over!"),this.stoneVisible&&l(ks,this.stoneGrinding?"Active":"Aim")),t.fillStyle=Bs,t.font="9px monospace",t.fillText(`Metal: ${n.metalRemoved.toFixed(2)}mm`,Xe,13),this.passCount>0&&t.fillText(`Pass: ${this.passCount}`,Xe+110,13),this.damageCount>0&&(t.fillStyle="#ff0066",t.fillText(`DMG: ${this.damageCount}`,Xe+170,13))}}class ec{constructor(t){P(this,"group");P(this,"track",null);this.group=new be,this.track=t??null,this.addTerrain(),this.addTracksideGroundCover(),this.addInstancedTrees(),this.addInstancedBushes(),this.addInstancedRocks(),this.addInstancedGrass(),this.addTelegraphPoles(),this.addTrackSideDetails(),this.addDistantMountains(),this.addStars()}trackCenterX(t){return t<80?0:t<215?(t-80)/135*55:t<340?55-(t-215)/125*20:35}isOnTrack(t,e){if(!this.track)return Math.abs(t-this.trackCenterX(e))<8;const n=this.track.totalLength;for(let i=0;i<=100;i++){const s=this.track.getTrackPoint(i/100*n),o=t-s.position.x,a=e-s.position.z;if(o*o+a*a<25)return!0;const l=s.position.x+s.right.x*5,c=s.position.z+s.right.z*5,d=t-l,u=e-c;if(d*d+u*u<16)return!0}return!1}getTrackSidePoint(t,e){if(!this.track)return{x:this.trackCenterX(t)+e,y:-.6,z:t,angle:0};const n=this.track.getTrackPoint(Math.max(0,Math.min(this.track.totalLength-1,t)));return{x:n.position.x+n.right.x*e,y:n.position.y-.15,z:n.position.z+n.right.z*e,angle:Math.atan2(n.forward.x,n.forward.z)}}rand(t,e){return t+Math.random()*(e-t)}addTerrain(){const t=new Lt({color:7035456,roughness:1});for(let n=0;n<60;n++){const i=this.rand(-10,360),s=this.trackCenterX(i),o=Math.random()>.5?1:-1,a=s+o*this.rand(6,15);if(this.isOnTrack(a,i))continue;const l=new Ft(new ir(this.rand(1,3),6),t);l.rotation.x=-Math.PI/2,l.position.set(a,-.58,i),this.group.add(l)}const e=new Lt({color:3828272,roughness:.9});for(let n=0;n<30;n++){const i=this.rand(-10,360),s=this.trackCenterX(i),o=Math.random()>.5?1:-1,a=this.rand(3,6),l=s+o*this.rand(25+a,60);if(this.isOnTrack(l,i)||this.isOnTrack(l+a,i)||this.isOnTrack(l-a,i)||this.isOnTrack(l,i+a)||this.isOnTrack(l,i-a))continue;const c=this.rand(.5,1.8),d=new Ft(new zn(a,6,4,0,Math.PI*2,0,Math.PI/2),e);d.scale.y=c/a,d.position.set(l,-.6,i),this.group.add(d)}}addTracksideGroundCover(){const t=this.track?this.track.totalLength:360,e=new Lt({color:8947840,roughness:1}),n=new pe(1.5,.04,2.3),i=Math.floor(t/2.5)*2,s=new bn(n,e,i),o=new Qt;let a=0;for(let l=0;l<t-2;l+=2.5)for(const c of[-1,1]){const d=this.getTrackSidePoint(l,c*2.8);o.makeRotationY(d.angle),o.setPosition(d.x,d.y+.02,d.z),s.setMatrixAt(a++,o)}s.count=a,s.instanceMatrix.needsUpdate=!0,s.receiveShadow=!0,this.group.add(s)}addInstancedTrees(){const t=new $i(1,2,7),e=new Lt({color:1987872,flatShading:!0}),n=new un(.08,.14,1.5,6),i=new Lt({color:4861984,roughness:.9}),s=[];for(let m=0;m<400;m++){const x=this.rand(-20,370),M=this.trackCenterX(x),S=Math.random()>.5?1:-1,C=M+S*this.rand(5,50);this.isOnTrack(C,x)||s.push({x:C,z:x,scale:.5+Math.random()*.8,rot:Math.random()*Math.PI*2})}const o=new bn(t,e,s.length),a=new bn(n,i,s.length),l=new Qt,c=new Be,d=new E,u=new E;for(let m=0;m<s.length;m++){const x=s[m];u.set(x.x,-.6+x.scale*.75,x.z),c.setFromEuler(new rn(0,x.rot,0)),d.set(x.scale,x.scale,x.scale),l.compose(u,c,d),a.setMatrixAt(m,l),u.set(x.x,-.6+x.scale*2.2,x.z),d.set(x.scale*.9,x.scale*1.3,x.scale*.9),l.compose(u,c,d),o.setMatrixAt(m,l)}o.instanceMatrix.needsUpdate=!0,a.instanceMatrix.needsUpdate=!0,o.castShadow=!0,this.group.add(o),this.group.add(a);const h=new Ki(1,1),f=new Lt({color:3832362,flatShading:!0}),g=[];for(let m=0;m<100;m++){const x=this.rand(-10,360),M=this.trackCenterX(x),S=Math.random()>.5?1:-1,C=M+S*this.rand(6,45);this.isOnTrack(C,x)||g.push({x:C,z:x,scale:.8+Math.random()*.7,rot:Math.random()*Math.PI*2})}const y=new bn(h,f,g.length),p=new bn(n,i,g.length);for(let m=0;m<g.length;m++){const x=g[m];u.set(x.x,-.6+x.scale*.75,x.z),c.setFromEuler(new rn(0,x.rot,0)),d.set(x.scale,x.scale*1.2,x.scale),l.compose(u,c,d),p.setMatrixAt(m,l),u.set(x.x,-.6+x.scale*2.5,x.z),d.set(x.scale*1.2,x.scale*.9,x.scale*1.2),l.compose(u,c,d),y.setMatrixAt(m,l)}y.instanceMatrix.needsUpdate=!0,p.instanceMatrix.needsUpdate=!0,y.castShadow=!0,this.group.add(y),this.group.add(p)}addInstancedBushes(){const t=new Ki(.5,0),e=new Lt({color:3828264,flatShading:!0}),n=[],i=new Qt;for(let o=0;o<300;o++){const a=this.rand(-10,360),l=this.trackCenterX(a),c=Math.random()>.5?1:-1,d=l+c*this.rand(4,25);if(this.isOnTrack(d,a))continue;const u=.5+Math.random()*.8;i.makeScale(u,u*.6,u),i.setPosition(d,-.6+u*.15,a),n.push(i.clone())}const s=new bn(t,e,n.length);n.forEach((o,a)=>s.setMatrixAt(a,o)),s.instanceMatrix.needsUpdate=!0,s.castShadow=!0,this.group.add(s)}addInstancedRocks(){const t=new Ki(.5,0),e=new Lt({color:5921365,roughness:.95,flatShading:!0}),n=[],i=new Qt,s=new Be;for(let a=0;a<150;a++){const l=this.rand(-10,360),c=this.trackCenterX(l),d=Math.random()>.5?1:-1,u=c+d*this.rand(4,30);if(this.isOnTrack(u,l))continue;const h=.3+Math.random()*.8;s.setFromEuler(new rn(Math.random(),Math.random(),Math.random())),i.compose(new E(u,-.6+h*.15,l),s,new E(h,h*.5,h)),n.push(i.clone())}const o=new bn(t,e,n.length);n.forEach((a,l)=>o.setMatrixAt(l,a)),o.instanceMatrix.needsUpdate=!0,this.group.add(o)}addInstancedGrass(){const t=new $i(.06,.3,3),e=new Lt({color:4880949}),n=[],i=new Qt;for(let a=0;a<1e3;a++){const l=this.rand(-10,360),d=this.trackCenterX(l)+(Math.random()-.5)*50;if(this.isOnTrack(d,l))continue;const u=.5+Math.random()*2;i.makeScale(.5+Math.random(),u,.5+Math.random()),i.setPosition(d,-.45,l),n.push(i.clone())}const s=new bn(t,e,n.length);n.forEach((a,l)=>s.setMatrixAt(l,a)),s.instanceMatrix.needsUpdate=!0,this.group.add(s);const o=[14540100,14518340,11158698,4491485,14500932];for(const a of o){const l=new zn(.05,4,3),c=new Lt({color:a,emissive:a,emissiveIntensity:.15}),d=[];for(let u=0;u<30;u++){const h=this.rand(0,350),g=this.trackCenterX(h)+(Math.random()-.5)*40;this.isOnTrack(g,h)||(i.makeTranslation(g,-.5+Math.random()*.1,h),d.push(i.clone()))}if(d.length>0){const u=new bn(l,c,d.length);d.forEach((h,f)=>u.setMatrixAt(f,h)),u.instanceMatrix.needsUpdate=!0,this.group.add(u)}}}addTelegraphPoles(){const t=new Lt({color:4863264,roughness:.85}),e=new Lt({color:13421772});for(let n=0;n<350;n+=20){const i=this.trackCenterX(n),s=new be;s.add(new Ft(new un(.05,.09,7,6),t)).position.y=3.5,s.add(new Ft(new pe(2,.05,.05),t)).position.y=6.5;for(const o of[-.7,-.3,0,.3,.7])s.add(new Ft(new un(.03,.03,.1,4),e)).position.set(o,6.6,0);s.position.set(i+8,-.6,n),this.group.add(s)}}addTrackSideDetails(){const t=new Lt({color:5592405,metalness:.5}),e=new Lt({color:13421568});for(let n=50;n<350;n+=50){const i=this.trackCenterX(n),s=new be;s.add(new Ft(new pe(.05,1,.05),t)).position.y=.5,s.add(new Ft(new pe(.25,.18,.03),e)).position.y=.9,s.position.set(i+3.5,-.6,n),this.group.add(s)}for(const n of[5,180]){const i=this.trackCenterX(n),s=new be;s.add(new Ft(new un(.05,.05,5,6),t)).position.y=2.5,s.add(new Ft(new pe(.35,.7,.18),t)).position.y=5.2;const o=new Lt({color:16711680,emissive:16711680,emissiveIntensity:.5}),a=new Lt({color:65280,emissive:65280,emissiveIntensity:.5});s.add(new Ft(new zn(.07,6,4),o)).position.set(0,5.4,.1),s.add(new Ft(new zn(.07,6,4),a)).position.set(0,5,.1),s.position.set(i+4,-.6,n),this.group.add(s)}}addDistantMountains(){const t=[{color:1716248,dist:80,height:20,count:6},{color:3823672,dist:130,height:30,count:5},{color:5793896,dist:180,height:38,count:6},{color:7899296,dist:240,height:45,count:5},{color:10004664,dist:310,height:55,count:4}];for(const e of t){const n=new Lt({color:e.color,fog:!0});for(let i=0;i<e.count;i++){const s=i%2===0?-1:1,o=this.rand(35,70),a=e.height*(.5+Math.random()*.5),l=new Ft(new $i(o,a,5+Math.floor(Math.random()*3)),n);l.position.set(s*e.dist+this.rand(-20,50),a/2-8,i/e.count*420-30),l.rotation.y=Math.random()*Math.PI,this.group.add(l)}}}addStars(){const e=new Float32Array(1200),n=new Float32Array(400*3);for(let s=0;s<400;s++){const o=Math.random()*Math.PI*2,a=Math.random()*Math.PI*.45,l=180+Math.random()*60;e[s*3]=l*Math.sin(a)*Math.cos(o),e[s*3+1]=l*Math.cos(a)+15,e[s*3+2]=l*Math.sin(a)*Math.sin(o);const c=.4+Math.random()*.6;n[s*3]=c,n[s*3+1]=c,n[s*3+2]=c+Math.random()*.1}const i=new Ae;i.setAttribute("position",new Fe(e,3)),i.setAttribute("color",new Fe(n,3)),this.group.add(new ua(i,new nr({size:1.5,sizeAttenuation:!1,vertexColors:!0})))}}function fg(r,t=512,e=256,n={}){const i=document.createElement("canvas");i.width=t,i.height=e;const s=i.getContext("2d");if(s.fillStyle=r,s.fillRect(0,0,t,e),n.weathering!==!1){const a=s.createLinearGradient(0,0,0,e);a.addColorStop(0,"rgba(255,255,255,0.05)"),a.addColorStop(.4,"rgba(0,0,0,0)"),a.addColorStop(.85,"rgba(0,0,0,0.12)"),a.addColorStop(1,"rgba(0,0,0,0.25)"),s.fillStyle=a,s.fillRect(0,0,t,e);for(let l=0;l<20;l++){const c=Math.random()*t,d=e*.75+Math.random()*e*.25,u=5+Math.random()*15;s.fillStyle=`rgba(40,30,20,${.05+Math.random()*.1})`,s.beginPath(),s.ellipse(c,d,u,u*2,0,0,Math.PI*2),s.fill()}}if(n.panels!==!1){s.strokeStyle="rgba(0,0,0,0.15)",s.lineWidth=1;const a=t/(4+Math.floor(Math.random()*3));for(let l=a;l<t;l+=a)s.beginPath(),s.moveTo(l,e*.05),s.lineTo(l,e*.95),s.stroke();s.beginPath(),s.moveTo(0,e*.35),s.lineTo(t,e*.35),s.stroke(),s.fillStyle="rgba(0,0,0,0.08)";for(let l=a;l<t;l+=a)for(let c=e*.1;c<e*.9;c+=12)s.beginPath(),s.arc(l,c,1.5,0,Math.PI*2),s.fill()}n.label&&(s.font="bold 24px sans-serif",s.fillStyle="rgba(0,0,0,0.3)",s.textAlign="left",s.fillText(n.label,20,e*.6));const o=new fa(i);return o.wrapS=An,o.wrapT=An,o}function pg(r=256,t=256){const e=document.createElement("canvas");e.width=r,e.height=t;const n=e.getContext("2d");n.fillStyle="#888",n.fillRect(0,0,r,t);const i=n.createLinearGradient(0,0,0,t);i.addColorStop(0,"#777"),i.addColorStop(.7,"#888"),i.addColorStop(1,"#bbb"),n.fillStyle=i,n.fillRect(0,0,r,t);for(let o=0;o<2e3;o++){const a=Math.random()*r,l=Math.random()*t,c=119+Math.floor(Math.random()*68);n.fillStyle=`rgb(${c},${c},${c})`,n.fillRect(a,l,2,2)}const s=new fa(e);return s.wrapS=An,s.wrapT=An,s}function mg(r=512,t=512){const e=document.createElement("canvas");e.width=r,e.height=t;const n=e.getContext("2d");n.fillStyle="#3a5a2a",n.fillRect(0,0,r,t);for(let s=0;s<5e3;s++){const o=Math.random()*r,a=Math.random()*t,l=48+Math.floor(Math.random()*64);n.fillStyle=`rgb(${32+Math.floor(Math.random()*32)},${l},${21+Math.floor(Math.random()*21)})`,n.fillRect(o,a,2+Math.random()*4,2+Math.random()*4)}for(let s=0;s<15;s++){const o=Math.random()*r,a=Math.random()*t,l=20+Math.random()*40;n.fillStyle=`rgba(90,70,50,${.2+Math.random()*.3})`,n.beginPath(),n.ellipse(o,a,l,l*.7,Math.random()*Math.PI,0,Math.PI*2),n.fill()}const i=new fa(e);return i.wrapS=An,i.wrapT=An,i.repeat.set(20,20),i}const nc=.72;class gg{constructor(){P(this,"cars",[]);P(this,"group");P(this,"beacons",[]);P(this,"beaconPhase",0);P(this,"grindModules",[]);P(this,"grindModuleRestY",[]);P(this,"_grinding",!1);P(this,"m");this.group=new be;const t=fg("#eed202",512,256,{}),e=pg();this.m={body:new Lt({color:15651330,metalness:.15,roughness:.55,map:t,roughnessMap:e}),bodyDk:new Lt({color:13415682,metalness:.12,roughness:.6}),frame:new Lt({color:1973790,metalness:.5,roughness:.7}),fmid:new Lt({color:3815994,metalness:.35,roughness:.65}),pipe:new Lt({color:10132122,metalness:.7,roughness:.3}),win:new Lt({color:8042717,emissive:1717060,metalness:.9,roughness:.1}),skirt:new Lt({color:1184274,roughness:.95}),rail:new Lt({color:14535680,metalness:.2,roughness:.45}),hl:new Lt({color:16777198,emissive:16777096,emissiveIntensity:3}),beacon:new Lt({color:16755200,emissive:16755200,emissiveIntensity:1,transparent:!0,opacity:.9}),red:new Lt({color:13373713}),white:new Lt({color:15263976}),blue:new Lt({color:1717094,metalness:.2,roughness:.5}),green:new Lt({color:2263091,metalness:.4,roughness:.5}),redPipe:new Lt({color:12263970,metalness:.4,roughness:.5}),orange:new Lt({color:14509568,metalness:.15,roughness:.5}),rust:new Lt({color:7031344,metalness:.3,roughness:.85,transparent:!0,opacity:.5}),soot:new Lt({color:2236962,metalness:.15,roughness:.9}),inst:new Lt({color:1127202,emissive:1122833,emissiveIntensity:.3,metalness:.5,roughness:.3}),led:new Lt({color:65348,emissive:65348,emissiveIntensity:.4}),exit:new Lt({color:43588,emissive:43588,emissiveIntensity:.2}),nb:new Lt({color:16777164,emissive:11184725,emissiveIntensity:.3}),redLt:new Lt({color:16711680,emissive:16711680,emissiveIntensity:.5})},this.buildCab(-42),this.buildWater(-26),this.buildGrind(-12),this.buildGrind(0),this.buildGrind(12),this.buildGrind(24),this.buildWater(38),this.buildGen(52),this.buildCrew(67)}setGrinding(t){this._grinding=t}update(t){this.beaconPhase+=t*5;const e=.3+Math.abs(Math.sin(this.beaconPhase))*.7;for(const i of this.beacons)i.material.emissiveIntensity=e*2.5;const n=this._grinding?.25:0;for(let i=0;i<this.grindModules.length;i++)this.grindModules[i].position.y+=(this.grindModuleRestY[i]-n-this.grindModules[i].position.y)*6*t}B(t,e,n,i,s,o,a,l){const c=new Ft(new pe(e,n,i),s);return c.position.set(o,a,l),c.castShadow=!0,t.add(c),c}C(t,e,n,i,s,o,a,l,c,d=0,u=0){const h=new Ft(new un(e,n,i,s),o);return h.position.set(a,l,c),h.rotation.x=d,h.rotation.z=u,h.castShadow=!0,t.add(h),h}S(t,e,n,i,s,o,a){const l=new Ft(new zn(e,n,n),i);return l.position.set(s,o,a),t.add(l),l}trucks(t,e){const n=new un(.45,.45,.15,20),i=new Lt({color:2763306,metalness:.85,roughness:.3});for(const s of[-e*.35,e*.35]){this.B(t,2.5,.12,1.6,this.m.frame,0,.28,s),this.B(t,2.8,.08,.3,this.m.fmid,0,.42,s);for(const o of[-.55,.55]){for(const a of[-1,1]){const l=new Ft(n,i);l.rotation.x=Math.PI/2,l.position.set(a*nc,.45,s+o),t.add(l),this.C(t,.18,.18,.03,12,this.m.pipe,a*nc,.45,s+o,Math.PI/2,0)}this.C(t,.05,.05,1.5,8,this.m.frame,0,.45,s+o,0,Math.PI/2)}for(const o of[-.7,-.3,.3,.7])this.C(t,.06,.06,.14,8,this.m.pipe,o,.38,s);this.B(t,1.8,.04,.05,this.m.frame,0,.34,s+.3),this.B(t,1.8,.04,.05,this.m.frame,0,.34,s-.3),this.C(t,.06,.06,.25,8,this.m.fmid,.8,.35,s,0,Math.PI/2),this.C(t,.06,.06,.25,8,this.m.fmid,-.8,.35,s,0,Math.PI/2)}this.C(t,.1,.1,2.5,12,this.m.fmid,.9,.55,0,0,Math.PI/2),this.C(t,.08,.08,1.5,10,this.m.fmid,-.9,.55,0,0,Math.PI/2),this.C(t,.025,.025,e*.85,6,this.m.green,.6,.58,0,Math.PI/2,0),this.C(t,.02,.02,e*.85,6,this.m.redPipe,-.6,.58,0,Math.PI/2,0),this.C(t,.02,.02,e*.8,4,this.m.pipe,1.25,.6,0,Math.PI/2,0),this.C(t,.02,.02,e*.8,4,this.m.pipe,-1.25,.6,0,Math.PI/2,0)}coupler(t,e,n){this.B(t,.5,.3,.5,this.m.frame,0,.65,e),this.B(t,.25,.2,.4,this.m.fmid,0,.65,e+n*.2),this.B(t,.35,.25,.2,this.m.fmid,0,.65,e+n*.5),this.C(t,.025,.025,.3,4,this.m.fmid,-.2,.45,e+n*.4,.3,0),this.C(t,.025,.025,.3,4,this.m.fmid,.2,.45,e+n*.4,.3,0),this.C(t,.03,.02,.2,6,this.m.frame,-.3,.55,e+n*.6,.5,0),this.C(t,.03,.02,.2,6,this.m.frame,.3,.55,e+n*.6,.5,0)}ladder(t,e,n){for(const i of[-.12,.12])this.C(t,.015,.015,2,4,this.m.rail,e+i,1.5,n);for(let i=.8;i<=2.2;i+=.28)this.C(t,.012,.012,.24,4,this.m.rail,e,i,n,0,Math.PI/2)}handrails(t,e,n){for(const i of[-1,1]){this.C(t,.018,.018,e,6,this.m.rail,i*1.62,n,0,Math.PI/2,0);const s=Math.floor(e/1.8);for(let o=0;o<=s;o++)this.B(t,.02,.5,.02,this.m.rail,i*1.62,n-.25,-e/2+e/s*o)}}endStripes(t,e){for(let n=0;n<6;n++)this.B(t,.22,1.6,.025,n%2===0?this.m.red:this.m.white,-1.2+n*.5,1.8,e)}beacon(t,e,n,i){this.C(t,.07,.09,.05,12,this.m.frame,e,n-.03,i);const s=this.S(t,.1,12,this.m.beacon,e,n+.05,i);this.beacons.push(s)}steps(t,e){for(const n of[-e/2,e/2])for(const i of[-1,1])this.B(t,.45,.03,.25,this.m.fmid,i*1.4,.7,n),this.B(t,.45,.03,.25,this.m.fmid,i*1.4,.45,n)}warnStripes(t,e){for(let n=-e/2+.3;n<e/2;n+=.45)for(const i of[-1,1]){const s=this.B(t,.02,.13,.18,this.m.frame,i*1.65,.88,n);s.rotation.z=i*.7}}rivets(t,e,n,i,s){for(let o=n;o<=i;o+=.3)this.S(t,.015,4,this.m.pipe,e,o,s)}sidePanelLines(t,e,n,i,s){const o=e/s;for(let l=1;l<s;l++){const c=-e/2+o*l;for(const d of[-1,1])this.B(t,.015,i-n-.2,.01,this.m.fmid,d*1.65,(n+i)/2,c),this.rivets(t,d*1.65,n+.2,i-.2,c)}const a=(n+i)*.45;for(const l of[-1,1])this.B(t,.01,.01,e-.5,this.m.fmid,l*1.65,a,0)}addCarLighting(t,e){for(const n of[-e/2+1,e/2-1])this.B(t,.12,.08,.08,this.m.frame,0,2.6,n),this.B(t,.08,.05,.02,this.m.hl,0,2.6,n>0?n+.05:n-.05);for(const n of[-1,1])this.B(t,.08,.06,.06,this.m.frame,n*1.65,1.8,0),this.B(t,.05,.04,.02,this.m.hl,n*1.65,1.8,n*.04)}reg(t,e,n){this.cars.push({group:t,offset:e,halfLength:n}),this.group.add(t)}exhaust(t,e,n,i,s){const o=[new ot(.16,0),new ot(.12,s*.2),new ot(.11,s*.6),new ot(.13,s*.85),new ot(.18,s)],a=new _a(o,14),l=new Ft(a,this.m.fmid);l.position.set(e,n,i),l.castShadow=!0,t.add(l),this.C(t,.22,.22,.03,12,this.m.frame,e,n+s+.02,i),this.B(t,.5,.01,.8,this.m.soot,e,n-.01,i)}buildCab(t){const e=new be,n=8,i=16;this.B(e,3.1,.2,i,this.m.frame,0,.55,0);for(const s of[-1,1])this.B(e,.35,.03,i,this.m.fmid,s*1.55,.82,0);this.B(e,3,2.1,10,this.m.body,0,1.85,-1),this.B(e,3.1,.7,4.3,this.m.body,0,3.25,-3.3),this.B(e,2.6,1.6,2.4,this.m.bodyDk,0,1.6,5.5),this.sidePanelLines(e,10,.9,2.8,6);for(const s of[-.5,.5]){const o=this.B(e,.9,.85,.05,this.m.win,s,2.9,-5.48);o.rotation.x=-.2}this.B(e,.05,.9,.06,this.m.frame,0,2.9,-5.5);for(const s of[-.5,.5])this.B(e,.4,.015,.015,this.m.frame,s,2.55,-5.45);for(const s of[-1,1]){this.B(e,.05,.65,1.2,this.m.win,s*1.65,2.8,-4.5),this.B(e,.05,.6,.8,this.m.win,s*1.65,2.8,-3);for(const o of[0,2,4])this.B(e,.04,.3,.3,this.m.win,s*1.65,2.2,o)}for(const s of[-.65,.65])this.B(e,.35,.28,.12,this.m.frame,s,2.4,6.78),this.B(e,.28,.2,.04,this.m.hl,s,2.4,6.85);for(const s of[-1.05,1.05])this.B(e,.25,.2,.08,this.m.frame,s,1.2,6.78),this.B(e,.18,.14,.04,this.m.hl,s,1.2,6.85);for(const s of[-.3,.3])this.C(e,.04,.06,.4,14,this.m.pipe,s,3.7,-4.5),this.C(e,.08,.08,.06,12,this.m.pipe,s,3.92,-4.5);this.C(e,.06,.08,.1,12,this.m.pipe,.4,3.68,-3.5),this.C(e,.03,.03,.08,6,this.m.frame,.4,3.58,-3.5),this.exhaust(e,0,3.2,-.5,.8),this.B(e,.7,.2,1.2,this.m.fmid,.8,3.2,1),this.B(e,.5,.15,.8,this.m.fmid,-.6,3.2,.5),this.C(e,.01,.01,1.2,4,this.m.frame,.6,4.2,-2),this.C(e,.01,.01,.8,4,this.m.frame,-.5,4,-1),this.beacon(e,0,3.85,-3);for(const s of[-1,1])this.B(e,.04,.2,.5,this.m.nb,s*1.65,3.4,-4);this.B(e,1.6,.3,.3,this.m.inst,0,2.3,-5);for(const s of[-1,1])this.B(e,.03,.25,1.5,this.m.blue,s*1.65,2.3,1);this.B(e,.5,.5,.04,this.m.orange,0,2,6.76);for(const s of[-1,1])for(const o of[1,2.5,4])this.B(e,.03,.35,.5,this.m.fmid,s*1.65,1.5,o);for(const s of[-1,1])this.C(e,.02,.02,8,6,this.m.pipe,s*1.65,2.5,-1,Math.PI/2,0);this.B(e,.15,.12,.08,this.m.frame,-.5,1,-8.02),this.B(e,.15,.12,.08,this.m.frame,.5,1,-8.02),this.C(e,.05,.05,.03,8,this.m.pipe,1.3,.87,2),this.C(e,.05,.05,.03,8,this.m.pipe,1.3,.87,-2),this.C(e,.06,.06,.03,8,this.m.fmid,1.65,1.3,1);for(const s of[-1,1])for(const o of[5,-7,2,-4])this.C(e,.012,.012,.25,4,this.m.rail,s*1.65,1.8,o);for(const s of[-1.4,1.4])this.C(e,.04,.04,.03,8,this.m.redLt,s,2.8,6.86);this.handrails(e,i,1.9),this.steps(e,i),this.warnStripes(e,i),this.endStripes(e,6.86);for(const s of[n,-n])this.ladder(e,1.55,s),this.ladder(e,-1.55,s);this.coupler(e,-8.2,-1),this.trucks(e,i),this.addCarLighting(e,i),this.reg(e,t,n)}buildGrind(t){const e=new be,n=6,i=12;this.B(e,3.1,.2,i,this.m.frame,0,.55,0);for(const h of[-1,1])this.B(e,.35,.03,i,this.m.fmid,h*1.55,.82,0);const s=2,o=1.5,a=1.1,l=.75,c=new xa;c.moveTo(-o,0),c.lineTo(-o,s*l),c.lineTo(-a,s),c.lineTo(a,s),c.lineTo(o,s*l),c.lineTo(o,0),c.lineTo(-o,0);const d=new sr(c,{depth:i-.5,bevelEnabled:!1}),u=new Ft(d,this.m.body);u.position.set(0,.8,-11.5/2),u.castShadow=!0,e.add(u),this.sidePanelLines(e,i,.9,2.2,7);for(const h of[-1,1])this.B(e,.03,.1,i-1,this.m.red,h*1.55,2,0);for(let h=0;h<8;h++){const f=-4.5+h*1.3,g=this.B(e,2,.3,.9,this.m.fmid,0,1.2,f);this.grindModules.push(g),this.grindModuleRestY.push(1.2),this.C(e,.12,.12,.7,12,this.m.pipe,0,.95,f,0,Math.PI/2)}for(const h of[-1,1]){for(let f=-4.5;f<=4.5;f+=2)this.B(e,.04,1.2,.04,this.m.frame,h*1.58,1.1,f),this.B(e,.12,.03,.04,this.m.frame,h*1.58,1.7,f);this.C(e,.02,.02,i-1.5,4,this.m.frame,h*1.58,1.72,0,Math.PI/2,0);for(let f=-5;f<=5;f+=.6)this.B(e,.04,1.3,.5,this.m.skirt,h*1.62,.9,f)}for(const h of[-1,1])for(let f=-4;f<=4;f+=2.6)this.B(e,.025,.9,1.8,this.m.bodyDk,h*1.55,1.5,f),this.C(e,.015,.015,.06,6,this.m.fmid,h*1.56,2,f-.7),this.C(e,.015,.015,.06,6,this.m.fmid,h*1.56,1.2,f-.7),this.B(e,.02,.1,.02,this.m.pipe,h*1.56,1.5,f+.6);for(const h of[-1,1])for(const f of[-2.5,0,2.5])this.B(e,.04,.2,.3,this.m.win,h*1.55,2.1,f);for(const h of[-1,1])this.C(e,.03,.03,i*.8,8,this.m.pipe,h*1,.7,0,Math.PI/2,0);for(let h=-4.5;h<=4.5;h+=1)for(const f of[-1,1])this.C(e,.02,.03,.15,6,this.m.pipe,f*1,.55,h),this.C(e,.035,.035,.02,6,this.m.fmid,f*1,.47,h);for(const h of[-3,0,3])this.C(e,.02,.02,2,6,this.m.pipe,0,.7,h,0,Math.PI/2);for(const h of[-1,1])this.B(e,.2,.3,2.5,this.m.fmid,h*1.55,.95,-2),this.B(e,.2,.3,2.5,this.m.fmid,h*1.55,.95,2),this.C(e,.06,.04,.3,6,this.m.pipe,h*1.55,.75,-2),this.C(e,.06,.04,.3,6,this.m.pipe,h*1.55,.75,2);for(const h of[-1,1]){this.C(e,.04,.04,i*.75,8,this.m.frame,h*1.55,1.3,0,Math.PI/2,0),this.C(e,.025,.025,i*.7,6,this.m.fmid,h*1.55,1.15,0,Math.PI/2,0);for(let f=-4;f<=4;f+=2)this.B(e,.06,.06,.03,this.m.frame,h*1.56,1.22,f)}for(let h=0;h<8;h++){const f=-4.5+h*1.3;for(const g of[-1,1])this.C(e,.02,.015,.35,6,this.m.pipe,g*.85,.9,f,.3,0),this.B(e,.04,.04,.03,this.m.fmid,g*.85,1.1,f)}for(const h of[-1,1])this.B(e,.03,.12,.25,this.m.orange,h*1.55,2.15,-4.5),this.B(e,.03,.12,.25,this.m.orange,h*1.55,2.15,4.5);for(const h of[-1,1])this.B(e,.03,.08,.2,this.m.rail,h*1.55,2.25,-1),this.B(e,.03,.08,.2,this.m.rail,h*1.55,2.25,1);this.B(e,.6,.15,1.2,this.m.fmid,0,2.88,-3),this.B(e,.4,.1,.8,this.m.frame,0,2.88,-3);for(const h of[-n+.5,n-.5])this.B(e,.12,.15,.08,this.m.fmid,1.55,1.7,h),this.C(e,.008,.008,.15,4,this.m.frame,1.55,1.85,h);for(let h=0;h<8;h++)this.C(e,.02,.02,.02,6,this.m.led,1.55,1.6,-4.5+h*1.3);for(const h of[-1,1])for(const f of[-4,-1,2,5])this.B(e,.06,.05,.05,this.m.frame,h*1.55,1.9,f),this.B(e,.04,.03,.02,this.m.hl,h*1.55,1.9,f+.035);for(const h of[-1,1])for(const f of[-4,3.5])this.C(e,.035,.035,.28,8,this.m.red,h*1.55,1.4,f),this.B(e,.06,.04,.04,this.m.fmid,h*1.55,1.58,f);for(const h of[-n+.8,n-.8])this.B(e,.04,.1,.1,this.m.rail,1.55,1.7,h),this.C(e,.025,.025,.02,8,this.m.red,1.56,1.7,h);for(const h of[-n+.3,n-.3])this.C(e,.15,.15,.03,14,this.m.fmid,0,1.6,h,0,Math.PI/2),this.C(e,.04,.04,.04,8,this.m.pipe,0,1.6,h,0,Math.PI/2),this.C(e,.02,.02,.2,6,this.m.pipe,0,1.6,h,0,0),this.C(e,.01,.01,.5,4,this.m.frame,.08,1.35,h);for(const h of[-1,1]){this.B(e,.2,.12,.3,this.m.frame,h*.5,.65,-n+1.5);const f=new Lt({color:4500070,emissive:2271812,emissiveIntensity:.3});this.B(e,.08,.04,.02,f,h*.5,.59,-n+1.35),this.B(e,.1,.08,.12,this.m.fmid,h*.5,.65,-n+2)}this.C(e,.015,.015,1.5,4,this.m.pipe,0,.65,-n+1.7,Math.PI/2,0),this.C(e,.06,.06,.02,12,this.m.fmid,.4,.58,n-1),this.B(e,.06,.06,.06,this.m.frame,.4,.64,n-1),this.C(e,.015,.015,.25,4,this.m.pipe,.4,.72,n-1),this.B(e,.04,.5,1.5,this.m.frame,-1.55,1.7,0),this.B(e,.04,.04,1.5,this.m.frame,-1.55,1.95,0),this.B(e,.04,.04,1.5,this.m.frame,-1.55,1.45,0);for(let h=-.5;h<=.5;h+=.35)this.C(e,.08,.08,.12,10,this.m.pipe,-1.56,1.7,h,0,Math.PI/2);this.B(e,.15,.25,.5,this.m.fmid,1.55,1,n-1.5),this.B(e,.02,.06,.02,this.m.pipe,1.56,1,n-1.3),this.B(e,1,.02,2,this.m.frame,0,.66,-2),this.B(e,1,.02,2,this.m.frame,0,.66,2);for(let h=0;h<4;h++){const f=-3.5+h*2.5;this.C(e,.015,.015,.4,4,this.m.blue,.6,.75,f,.4,0),this.C(e,.015,.015,.4,4,this.m.blue,-.6,.75,f,.4,0)}for(const h of[-n-.15,n+.15]){this.B(e,1.8,.04,.6,this.m.fmid,0,.84,h);for(const f of[-1,1])this.C(e,.008,.008,.6,4,this.m.frame,f*.85,1.1,h),this.C(e,.015,.015,.3,4,this.m.frame,f*.85,1,h-.25*(h>0?1:-1)),this.C(e,.015,.015,.3,4,this.m.frame,f*.85,1,h+.25*(h>0?1:-1))}for(let h=-n+1;h<n;h+=2)for(const f of[-1,1])this.B(e,.32,.015,.8,this.m.fmid,f*1.55,.84,h);for(const h of[-n+.2,n-.2])this.B(e,.15,.12,.12,this.m.orange,-.6,.85,h),this.C(e,.03,.03,.15,6,this.m.frame,-.6,.85,h+(h>0?.12:-.12),.5,0);this.beacon(e,0,2.95,0),this.handrails(e,i,1.9),this.steps(e,i),this.warnStripes(e,i);for(const h of[n,-n])this.ladder(e,1.55,h),this.ladder(e,-1.55,h);this.coupler(e,-n-.3,-1),this.coupler(e,n+.3,1),this.trucks(e,i),this.reg(e,t,n)}buildWater(t){const e=new be,n=7,i=14;this.B(e,3.1,.2,i,this.m.frame,0,.55,0),this.B(e,2.8,2.3,i-2,this.m.body,0,1.95,0),this.sidePanelLines(e,i-2,.9,3,7);for(const s of[-4,0,4])this.C(e,.18,.18,.06,14,this.m.fmid,0,3.15,s),this.C(e,.1,.1,.03,10,this.m.pipe,0,3.2,s);this.B(e,.6,.3,2,this.m.pipe,-.8,3.3,-3),this.B(e,.6,.3,2,this.m.pipe,.7,3.3,3.5);for(const s of[-1,1])this.B(e,.4,.03,i,this.m.fmid,s*1.6,.82,0);for(const s of[-1,1])for(const o of[3,-3])this.C(e,.2,.2,.1,16,this.m.red,s*1.65,1.5,o,0,Math.PI/2),this.C(e,.06,.06,.12,8,this.m.fmid,s*1.65,1.5,o,0,Math.PI/2);for(const s of[-1,0,2])this.C(e,.08,.08,.02,10,this.m.pipe,-1.65,1.8,s,0,Math.PI/2);this.C(e,.04,.04,4,10,this.m.pipe,1.65,1.2,0,Math.PI/2,0);for(let s=-1.5;s<=1.5;s+=1)this.C(e,.025,.025,.3,6,this.m.pipe,1.65,1.05,s),this.C(e,.04,.04,.02,6,this.m.redPipe,1.65,.88,s);for(const s of[-3,0,3])this.C(e,.03,.03,.15,8,this.m.pipe,0,.7,s),this.C(e,.05,.05,.02,8,this.m.fmid,0,.62,s);for(const s of[-1,1])this.B(e,.03,.8,1.2,this.m.bodyDk,s*1.65,2.2,0);this.B(e,.08,1.5,.04,this.m.frame,-1.65,2,2),this.C(e,.015,.015,1.3,6,this.m.win,-1.63,2,2.04);for(let s=1.4;s<=2.6;s+=.3)for(const o of[-1,1])this.B(e,.02,.008,.3,this.m.pipe,o*1.65,s,-5);this.B(e,.5,.03,i-3,this.m.fmid,0,3.12,0),this.B(e,.03,.2,1.2,this.m.blue,1.65,2.5,0),this.B(e,.03,.12,.8,this.m.blue,1.65,2.2,-4),this.C(e,.04,.04,.3,10,this.m.red,1.65,1.2,5);for(const s of[-4,4])this.B(e,.03,.4,.03,this.m.rust,.3,2.7,s);this.handrails(e,i,2),this.steps(e,i),this.warnStripes(e,i);for(const s of[6.8,-6.8])this.ladder(e,1.55,s),this.ladder(e,-1.55,s);this.coupler(e,-n-.3,-1),this.coupler(e,n+.3,1),this.trucks(e,i),this.addCarLighting(e,i),this.reg(e,t,n)}buildGen(t){const e=new be,n=7,i=14;this.B(e,3.1,.2,i,this.m.frame,0,.55,0);for(const s of[-1,1])this.B(e,.35,.03,i,this.m.fmid,s*1.55,.82,0);this.B(e,3,2.4,i-1,this.m.body,0,2,0),this.sidePanelLines(e,i,.9,3.1,8);for(const s of[-1,1])for(let o=-5;o<=5;o+=2.5)this.B(e,.04,1.4,2.2,this.m.bodyDk,s*1.7,2,o);for(const s of[{s:1,z:-3},{s:-1,z:2}])this.B(e,.04,1.4,2.5,this.m.bodyDk,s.s*1.7,1.8,s.z),this.B(e,.02,.2,.02,this.m.pipe,s.s*1.72,1.8,s.z+.8),this.C(e,.015,.015,.08,6,this.m.fmid,s.s*1.72,2.2,s.z-1.1),this.C(e,.015,.015,.08,6,this.m.fmid,s.s*1.72,1.4,s.z-1.1);this.exhaust(e,-.35,3.4,2,1),this.exhaust(e,.35,3.4,2,1);for(const s of[-3,0]){this.C(e,.55,.55,.06,20,this.m.fmid,0,3.45,s),this.C(e,.1,.1,.08,10,this.m.frame,0,3.5,s);for(const o of[0,Math.PI/2]){const a=this.B(e,.9,.02,.08,this.m.frame,0,3.48,s);a.rotation.y=o}}for(const s of[-5.5,5.5])this.B(e,.03,.6,.8,this.m.fmid,1.7,2.5,s);this.B(e,1.8,.4,3,this.m.frame,0,.5,2),this.C(e,.02,.02,i*.6,6,this.m.pipe,.8,3.25,0,Math.PI/2,0),this.C(e,.03,.03,i*.6,6,this.m.frame,-1.7,2.8,0,Math.PI/2,0),this.B(e,.03,.2,1.2,this.m.blue,-1.7,2.5,0);for(const s of[-4,2])this.B(e,.04,.3,.4,this.m.orange,-1.7,1.5,s);this.C(e,.015,.015,.5,4,this.m.green,.5,.5,-n+.5),this.handrails(e,i,1.9),this.steps(e,i),this.warnStripes(e,i);for(const s of[n,-n])this.ladder(e,1.55,s),this.ladder(e,-1.55,s);this.coupler(e,-n-.3,-1),this.coupler(e,n+.3,1),this.trucks(e,i),this.addCarLighting(e,i),this.reg(e,t,n)}buildCrew(t){const e=new be,n=8,i=16;this.B(e,3.1,.2,i,this.m.frame,0,.55,0);for(const a of[-1,1])this.B(e,.35,.03,i,this.m.fmid,a*1.55,.82,0);this.B(e,3,3.1,i-1,this.m.body,0,2.35,0),this.sidePanelLines(e,i,.9,3.8,9);for(const a of[-1,1])for(let l=-6.5;l<=6.5;l+=1.6)this.B(e,.05,.45,.6,this.m.win,a*1.65,1.9,l),this.B(e,.05,.45,.6,this.m.win,a*1.65,3.2,l),this.B(e,.04,.02,.65,this.m.fmid,a*1.65,1.64,l),this.B(e,.04,.02,.65,this.m.fmid,a*1.65,2.94,l);const s=this.B(e,1.4,.7,.05,this.m.win,0,2.8,-7.52);s.rotation.x=.15;for(const a of[-.65,.65])this.B(e,.3,.22,.08,this.m.frame,a,1.7,-7.55),this.B(e,.22,.16,.04,this.m.hl,a,1.7,-7.52);this.endStripes(e,-7.56),this.beacon(e,0,4.25,0);for(const a of[{x:.8,z:-2},{x:-.6,z:3}])this.B(e,.7,.25,1,this.m.fmid,a.x,4.1,a.z),this.C(e,.2,.2,.04,12,this.m.frame,a.x,4.25,a.z);this.C(e,.01,.01,.8,4,this.m.frame,0,4.8,-1),this.C(e,.01,.01,.6,4,this.m.frame,.4,4.6,1);const o=new rs(16772812,.5,8);o.position.set(0,2.5,0),e.add(o);for(const a of[-1,1]){this.B(e,2.8,.03,.7,this.m.fmid,0,.82,a*7.8);for(const l of[-1.2,-.4,.4,1.2])this.C(e,.015,.015,.6,6,this.m.rail,l,1.1,a*8.15);this.B(e,2.5,.02,.02,this.m.rail,0,1.4,a*8.15),this.B(e,2.5,.02,.02,this.m.rail,0,1.1,a*8.15),this.B(e,.6,1.5,.04,this.m.bodyDk,0,1.6,a*7.52),this.B(e,.02,.15,.03,this.m.pipe,.2,1.6,a*7.55)}this.C(e,.02,.02,i*.5,6,this.m.pipe,1,3.95,0,Math.PI/2,0),this.B(e,.03,.2,1,this.m.blue,1.65,2.8,2);for(const a of[-4,4])this.B(e,.03,.1,.2,this.m.exit,1.65,3.5,a);this.C(e,.04,.04,.3,10,this.m.red,-1.65,1.3,-2),this.C(e,.04,.04,.3,10,this.m.red,1.65,1.3,5);for(const a of[-1,1])this.B(e,.3,.4,.25,this.m.fmid,1,1,a*7.6);this.handrails(e,i,2.1),this.steps(e,i),this.warnStripes(e,i);for(const a of[n,-n])this.ladder(e,1.55,a),this.ladder(e,-1.55,a);this.coupler(e,n+.3,1),this.trucks(e,i),this.addCarLighting(e,i),this.reg(e,t,n)}}const Zr={dawn:{name:"DAWN",skyColor:new yt(4877962),fogColor:new yt(14207136),fogNear:40,fogFar:200,sunColor:new yt(16755302),sunIntensity:.9,sunPosition:new E(-30,6,20),ambientSkyColor:new yt(9221320),ambientGroundColor:new yt(7034160),ambientIntensity:.6,exposure:1.1,groundColor:new yt(13148240),foliageColor:new yt(8955976)},day:{name:"DAY",skyColor:new yt(5814504),fogColor:new yt(11066864),fogNear:80,fogFar:350,sunColor:new yt(16775408),sunIntensity:1.4,sunPosition:new E(15,30,10),ambientSkyColor:new yt(8956637),ambientGroundColor:new yt(6715221),ambientIntensity:.7,exposure:1.2,groundColor:new yt(4880954),foliageColor:new yt(4761656)},dusk:{name:"DUSK",skyColor:new yt(8849204),fogColor:new yt(15245408),fogNear:30,fogFar:180,sunColor:new yt(15690298),sunIntensity:.8,sunPosition:new E(40,5,-15),ambientSkyColor:new yt(6834545),ambientGroundColor:new yt(4860951),ambientIntensity:.5,exposure:1,groundColor:new yt(9133628),foliageColor:new yt(7048258)},night:{name:"NIGHT",skyColor:new yt(855359),fogColor:new yt(657950),fogNear:20,fogFar:120,sunColor:new yt(6719692),sunIntensity:.3,sunPosition:new E(-15,20,10),ambientSkyColor:new yt(1712704),ambientGroundColor:new yt(659477),ambientIntensity:.25,exposure:.9,groundColor:new yt(1980970),foliageColor:new yt(3828572)}},zs=["dawn","day","dusk","night"];class xg{constructor(t,e,n,i){P(this,"scene");P(this,"sun");P(this,"ambient");P(this,"renderer");P(this,"groundMesh",null);P(this,"currentIndex",1);P(this,"targetPreset");P(this,"currentPreset");P(this,"transitionProgress",1);P(this,"currentName","DAY");this.scene=t,this.sun=e,this.ambient=n,this.renderer=i,this.targetPreset=Zr[zs[this.currentIndex]],this.currentPreset={...this.targetPreset},this.applyPreset(this.targetPreset)}setGroundMesh(t){this.groundMesh=t}setTime(t){const e=zs.indexOf(t);e>=0&&(this.currentIndex=e,this.targetPreset=Zr[t],this.currentName=this.targetPreset.name,this.transitionProgress=0)}cycleTime(){this.currentIndex=(this.currentIndex+1)%zs.length,this.targetPreset=Zr[zs[this.currentIndex]],this.currentName=this.targetPreset.name,this.transitionProgress=0}get isNight(){return this.currentIndex===3}get isDusk(){return this.currentIndex===2}update(t){if(this.transitionProgress>=1)return;this.transitionProgress=Math.min(1,this.transitionProgress+t*.4);const e=this.smoothstep(this.transitionProgress),n=this.targetPreset;this.scene.background.lerp(n.skyColor,e);const i=this.scene.fog;i.color.lerp(n.fogColor,e),i.near+=(n.fogNear-i.near)*e,i.far+=(n.fogFar-i.far)*e,this.sun.color.lerp(n.sunColor,e),this.sun.intensity+=(n.sunIntensity-this.sun.intensity)*e,this.sun.position.lerp(n.sunPosition,e),this.ambient.color.lerp(n.ambientSkyColor,e),this.ambient.groundColor.lerp(n.ambientGroundColor,e),this.ambient.intensity+=(n.ambientIntensity-this.ambient.intensity)*e,this.renderer.toneMappingExposure+=(n.exposure-this.renderer.toneMappingExposure)*e,this.groundMesh&&this.groundMesh.material.color.lerp(n.groundColor,e)}applyPreset(t){this.scene.background.copy(t.skyColor);const e=this.scene.fog;e.color.copy(t.fogColor),e.near=t.fogNear,e.far=t.fogFar,this.sun.color.copy(t.sunColor),this.sun.intensity=t.sunIntensity,this.sun.position.copy(t.sunPosition),this.ambient.color.copy(t.ambientSkyColor),this.ambient.groundColor.copy(t.ambientGroundColor),this.ambient.intensity=t.ambientIntensity,this.renderer.toneMappingExposure=t.exposure}smoothstep(t){return t*t*(3-2*t)}}const Gs=2e3;class _g{constructor(){P(this,"rainGroup");P(this,"positions");P(this,"velocities");P(this,"raining",!1);P(this,"rainIntensity",0);this.positions=new Float32Array(Gs*3),this.velocities=new Float32Array(Gs);for(let n=0;n<Gs;n++)this.positions[n*3]=(Math.random()-.5)*80,this.positions[n*3+1]=Math.random()*30,this.positions[n*3+2]=(Math.random()-.5)*80,this.velocities[n]=15+Math.random()*10;const t=new Ae;t.setAttribute("position",new Fe(this.positions,3));const e=new nr({color:11189196,size:.08,transparent:!0,opacity:0,sizeAttenuation:!0,depthWrite:!1});this.rainGroup=new ua(t,e),this.rainGroup.frustumCulled=!1}get isRaining(){return this.raining}toggle(){this.raining=!this.raining}update(t,e){const n=this.raining?1:0;this.rainIntensity+=(n-this.rainIntensity)*2*t;const i=this.rainGroup.material;if(i.opacity=this.rainIntensity*.4,this.rainIntensity<.01)return;const s=this.rainGroup.geometry.getAttribute("position");for(let o=0;o<Gs;o++)this.positions[o*3+1]-=this.velocities[o]*t,this.positions[o*3]+=2*t,this.positions[o*3+2]+=1*t,this.positions[o*3+1]<-1&&(this.positions[o*3]=e.x+(Math.random()-.5)*60,this.positions[o*3+1]=15+Math.random()*15,this.positions[o*3+2]=e.z+(Math.random()-.5)*60,this.velocities[o]=15+Math.random()*10);s.needsUpdate=!0}}const Vs=800,vg=-9.8,ic=1.2;class Mg{constructor(){P(this,"points");P(this,"sparks",[]);P(this,"positions");P(this,"colors");P(this,"geometry");P(this,"sparkLight");P(this,"emitPoints",[]);P(this,"emitting",!1);P(this,"intensity",1);this.positions=new Float32Array(Vs*3),this.colors=new Float32Array(Vs*3);for(let e=0;e<Vs;e++)this.sparks.push({position:new E,velocity:new E,age:0,maxAge:ic,alive:!1}),this.positions[e*3+1]=-100;this.geometry=new Ae,this.geometry.setAttribute("position",new Fe(this.positions,3)),this.geometry.setAttribute("color",new Fe(this.colors,3));const t=new nr({size:3,sizeAttenuation:!1,vertexColors:!0,blending:to,transparent:!0,opacity:.95,depthWrite:!1});this.points=new ua(this.geometry,t),this.points.frustumCulled=!1,this.sparkLight=new rs(16746547,0,15)}setEmitPoints(t,e){this.emitPoints=t,this.intensity=e,this.emitting=!0}stopEmitting(){this.emitting=!1,this.emitPoints=[]}update(t){if(this.emitting&&this.emitPoints.length>0){const e=Math.max(1,Math.floor(this.intensity*6/this.emitPoints.length));for(const n of this.emitPoints)for(let i=0;i<e;i++)this.emitSpark(n)}for(let e=0;e<Vs;e++){const n=this.sparks[e];if(!n.alive){this.positions[e*3+1]=-100;continue}if(n.age+=t,n.age>=n.maxAge){n.alive=!1;continue}n.velocity.y+=vg*t,n.position.addScaledVector(n.velocity,t),n.position.y<-.5&&(n.position.y=-.5,n.velocity.y*=-.3,n.velocity.x*=.7,n.velocity.z*=.7,n.maxAge-=.2);const i=n.age/n.maxAge;let s,o,a;if(i<.1)s=1,o=.95,a=.7;else if(i<.3)s=1,o=.7,a=.2;else if(i<.6){const l=(i-.3)/.3;s=1,o=.7-l*.5,a=.2-l*.15}else{const l=(i-.6)/.4;s=1-l*.6,o=.2-l*.2,a=.05}this.colors[e*3]=s,this.colors[e*3+1]=o,this.colors[e*3+2]=a,this.positions[e*3]=n.position.x,this.positions[e*3+1]=n.position.y,this.positions[e*3+2]=n.position.z}if(this.geometry.attributes.position.needsUpdate=!0,this.geometry.attributes.color.needsUpdate=!0,this.emitting&&this.emitPoints.length>0){const e=this.emitPoints[Math.floor(this.emitPoints.length/2)];this.sparkLight.position.copy(e.position),this.sparkLight.position.y+=.5,this.sparkLight.intensity=this.intensity*(2.5+Math.random()*2)}else this.sparkLight.intensity*=.9}emitSpark(t){let e=null;for(const l of this.sparks)if(!l.alive){e=l;break}if(!e)return;e.alive=!0,e.age=0,e.maxAge=ic*(.4+Math.random()*.6),e.position.copy(t.position),e.position.x+=(Math.random()-.5)*.3,e.position.z+=(Math.random()-.5)*.3;const n=3+Math.random()*6,i=Math.random()>.5?1:-1,s=n*(.4+Math.random()*.6),o=n*(Math.random()-.3)*.4,a=n*(.1+Math.random()*.4);e.velocity.set(0,0,0),e.velocity.addScaledVector(t.right,i*s),e.velocity.addScaledVector(t.forward,o),e.velocity.y=a}dispose(){this.geometry.dispose(),this.points.material.dispose()}}class Sg{constructor(){P(this,"group");P(this,"contactGlow");P(this,"contactLight");P(this,"contactMaterial");P(this,"trailMarkers",[]);P(this,"trailMaterial");P(this,"lastTrailZ",-1/0);P(this,"active",!1);P(this,"pulsePhase",0);this.group=new be,this.contactMaterial=new Lt({color:16746496,emissive:16737792,emissiveIntensity:3,transparent:!0,opacity:0,flatShading:!0,side:tn}),this.contactGlow=new Ft(new ir(.3,8),this.contactMaterial),this.contactGlow.rotation.x=-Math.PI/2,this.group.add(this.contactGlow),this.contactLight=new rs(16746547,0,8),this.contactLight.position.y=.2,this.group.add(this.contactLight),this.trailMaterial=new Lt({color:14540270,emissive:4473941,emissiveIntensity:.5,metalness:.9,roughness:.3,flatShading:!0,transparent:!0,opacity:.8})}setActive(t,e){this.active=!0,this.contactGlow.position.copy(t),this.contactGlow.position.y+=.02,this.contactLight.position.copy(t),this.contactLight.position.y+=.3;const n=e/100;this.contactMaterial.opacity=.6+n*.4,this.contactMaterial.emissiveIntensity=2+n*4,this.contactLight.intensity=n*5+Math.random()*2,this.pulsePhase+=.3;const i=.25+Math.sin(this.pulsePhase)*.08;this.contactGlow.scale.setScalar(i+n*.15),(Math.abs(t.z-this.lastTrailZ)>2||this.lastTrailZ===-1/0)&&(this.addTrailMarker(t),this.lastTrailZ=t.z)}setInactive(){this.active&&(this.active=!1,this.contactMaterial.opacity=0,this.contactLight.intensity*=.5)}addTrailMarker(t){const e=new Ft(new pe(1.8,.02,1.5),this.trailMaterial);if(e.position.copy(t),e.position.y+=.01,this.group.add(e),this.trailMarkers.push(e),this.trailMarkers.length>100){const n=this.trailMarkers.shift();this.group.remove(n),n.geometry.dispose()}}update(t){this.active||(this.contactLight.intensity*=.85,this.contactMaterial.opacity*=.85);for(const e of this.trailMarkers){const n=e.material;n.emissiveIntensity=Math.max(0,n.emissiveIntensity-.02*t)}}dispose(){for(const t of this.trailMarkers)t.geometry.dispose();this.contactGlow.geometry.dispose(),this.contactMaterial.dispose(),this.trailMaterial.dispose()}}class yg{constructor(){P(this,"ctx",null);P(this,"masterGain",null);P(this,"grindNode",null);P(this,"grindGain",null);P(this,"grindNoiseGain",null);P(this,"noiseSource",null);P(this,"dieselNode",null);P(this,"dieselGain",null);P(this,"windGain",null);P(this,"windSource",null);P(this,"initialized",!1);P(this,"_muted",!1);P(this,"clickTimer",0);P(this,"clickInterval",1)}init(){if(!this.initialized)try{this.ctx=new AudioContext,this.masterGain=this.ctx.createGain(),this.masterGain.gain.value=.3,this.masterGain.connect(this.ctx.destination),this.setupDiesel(),this.setupWind(),this.initialized=!0}catch{}}get muted(){return this._muted}set muted(t){this._muted=t,this.masterGain&&(this.masterGain.gain.value=t?0:.3)}startGrinding(t){if(!this.ctx||!this.masterGain)return;if(!this.grindNode){this.grindNode=this.ctx.createOscillator(),this.grindNode.type="sawtooth",this.grindNode.frequency.value=180,this.grindGain=this.ctx.createGain(),this.grindGain.gain.value=0;const n=this.ctx.createBiquadFilter();n.type="bandpass",n.frequency.value=2e3,n.Q.value=2,this.grindNode.connect(n),n.connect(this.grindGain),this.grindGain.connect(this.masterGain),this.grindNode.start(),this.grindNoiseGain=this.ctx.createGain(),this.grindNoiseGain.gain.value=0;const i=this.ctx.createBiquadFilter();i.type="highpass",i.frequency.value=3e3;const s=this.createNoiseBuffer(2);this.noiseSource=this.ctx.createBufferSource(),this.noiseSource.buffer=s,this.noiseSource.loop=!0,this.noiseSource.connect(i),i.connect(this.grindNoiseGain),this.grindNoiseGain.connect(this.masterGain),this.noiseSource.start()}const e=this.ctx.currentTime;this.grindGain.gain.linearRampToValueAtTime(t*.15,e+.05),this.grindNoiseGain.gain.linearRampToValueAtTime(t*.08,e+.05),this.grindNode.frequency.linearRampToValueAtTime(120+t*100,e+.1)}stopGrinding(){if(!this.ctx||!this.grindGain)return;const t=this.ctx.currentTime;this.grindGain.gain.linearRampToValueAtTime(0,t+.15),this.grindNoiseGain&&this.grindNoiseGain.gain.linearRampToValueAtTime(0,t+.15)}playDing(){if(!this.ctx||!this.masterGain)return;const t=this.ctx.currentTime;for(const e of[880,1320]){const n=this.ctx.createOscillator();n.type="sine",n.frequency.value=e;const i=this.ctx.createGain();i.gain.setValueAtTime(.2,t),i.gain.exponentialRampToValueAtTime(.001,t+.8),n.connect(i),i.connect(this.masterGain),n.start(t),n.stop(t+.8)}}playSegmentComplete(){if(!this.ctx||!this.masterGain)return;const t=this.ctx.currentTime;[523,659,784].forEach((n,i)=>{const s=this.ctx.createOscillator();s.type="sine",s.frequency.value=n;const o=this.ctx.createGain(),a=t+i*.08;o.gain.setValueAtTime(0,a),o.gain.linearRampToValueAtTime(.15,a+.02),o.gain.exponentialRampToValueAtTime(.001,a+.4),s.connect(o),o.connect(this.masterGain),s.start(a),s.stop(a+.4)})}playOvergrindAlarm(){if(!this.ctx||!this.masterGain)return;const t=this.ctx.currentTime;for(let e=0;e<2;e++){const n=t+e*.15,i=this.ctx.createOscillator();i.type="square",i.frequency.value=220;const s=this.ctx.createGain();s.gain.setValueAtTime(0,n),s.gain.linearRampToValueAtTime(.12,n+.01),s.gain.linearRampToValueAtTime(0,n+.1),i.connect(s),s.connect(this.masterGain),i.start(n),i.stop(n+.12)}}updateWheelSound(t,e,n=0){!this.ctx||Math.abs(t)<.3||(this.clickInterval=Math.max(.15,1.5/Math.abs(t)),this.clickTimer+=e,this.clickTimer>=this.clickInterval&&(this.clickTimer-=this.clickInterval,this.playClickWithCondition(n)))}playClickWithCondition(t){if(!this.ctx||!this.masterGain)return;const e=this.ctx.currentTime,n=this.ctx.createOscillator();n.type=t>.7?"sine":"triangle",n.frequency.value=60+t*60+Math.random()*(30-t*20);const i=this.ctx.createGain(),s=.08-t*.05,o=.1-t*.05;i.gain.setValueAtTime(s,e),i.gain.exponentialRampToValueAtTime(.001,e+.05+o);const a=this.ctx.createBiquadFilter();a.type="lowpass",a.frequency.value=150+t*200,n.connect(a),a.connect(i),i.connect(this.masterGain),n.start(e),n.stop(e+.12)}setDieselSpeed(t){if(!this.dieselNode||!this.dieselGain||!this.ctx)return;const e=this.ctx.currentTime;this.dieselNode.frequency.linearRampToValueAtTime(25+Math.abs(t)*5,e+.1),this.dieselGain.gain.linearRampToValueAtTime(.03+Math.abs(t)*.01,e+.1)}setupDiesel(){if(!this.ctx||!this.masterGain)return;this.dieselNode=this.ctx.createOscillator(),this.dieselNode.type="sawtooth",this.dieselNode.frequency.value=28;const t=this.ctx.createBiquadFilter();t.type="lowpass",t.frequency.value=80,this.dieselGain=this.ctx.createGain(),this.dieselGain.gain.value=.02,this.dieselNode.connect(t),t.connect(this.dieselGain),this.dieselGain.connect(this.masterGain),this.dieselNode.start()}setupWind(){if(!this.ctx||!this.masterGain)return;const t=this.createNoiseBuffer(4);this.windSource=this.ctx.createBufferSource(),this.windSource.buffer=t,this.windSource.loop=!0;const e=this.ctx.createBiquadFilter();e.type="bandpass",e.frequency.value=400,e.Q.value=.5,this.windGain=this.ctx.createGain(),this.windGain.gain.value=.02,this.windSource.connect(e),e.connect(this.windGain),this.windGain.connect(this.masterGain),this.windSource.start()}createNoiseBuffer(t){const e=this.ctx.sampleRate,n=e*t,i=this.ctx.createBuffer(1,n,e),s=i.getChannelData(0);for(let o=0;o<n;o++)s[o]=Math.random()*2-1;return i}dispose(){var t,e,n,i,s;(t=this.grindNode)==null||t.stop(),(e=this.dieselNode)==null||e.stop(),(n=this.noiseSource)==null||n.stop(),(i=this.windSource)==null||i.stop(),(s=this.ctx)==null||s.close()}}const jr=5,sc=.8;class rc{constructor(){P(this,"group");P(this,"adjacentTrack");P(this,"active",!1);P(this,"position",-100);P(this,"speed",25);P(this,"timer",0);P(this,"nextEventIn",30+Math.random()*30);P(this,"hornPlayed",!1);P(this,"audioCtx",null);P(this,"track",null);P(this,"totalLength",300);P(this,"cars",[]);this.group=new be,this.group.visible=!1,this.adjacentTrack=new be;const t=new Lt({color:4473992,metalness:.2,roughness:.5}),e=new Lt({color:2236962,metalness:.4,roughness:.7}),n=new un(.45,.45,.15,16),i=new Lt({color:2763306,metalness:.85,roughness:.3}),s=new Lt({color:3355562,metalness:.2,roughness:.5}),o=new Lt({color:16777164,emissive:16777096,emissiveIntensity:2}),a=(m,x)=>{const M=x*.35;for(const S of[-M,M]){for(const w of[-1,1]){const R=new Ft(n,i);R.rotation.x=Math.PI/2,R.position.set(w*sc,.45,S),m.add(R)}const C=new Ft(new pe(2.4,.12,1.4),e);C.position.set(0,.32,S),m.add(C)}},l=(m,x,M)=>{this.cars.push({group:m,offset:x,halfLen:M}),this.group.add(m)},c=new be,d=new Ft(new pe(3,3,18),t);d.position.y=2.2,d.castShadow=!0,c.add(d);const u=new Ft(new pe(3.1,1.2,4.5),s);u.position.set(0,4.1,-5),c.add(u);const h=new Ft(new zn(.2,8,6),o);h.position.set(0,3,9.1),c.add(h);const f=new rs(16777215,4,35);f.position.set(0,3,10),c.add(f);const g=new Lt({color:16763904,metalness:.15,roughness:.5}),y=new Ft(new pe(3.05,.15,18.05),g);y.position.y=1.5,c.add(y),c.add(new Ft(new pe(2.6,.15,18),e)).position.y=.6,a(c,18),l(c,0,9);const p=[11154227,3385907,8947763,8930338,3368584,4491332,8939076,4478344];for(let m=0;m<8;m++){const x=new be,M=new Lt({color:p[m],metalness:.15,roughness:.55}),S=new Ft(new pe(2.8,2.8,10),M);S.position.y=2.1,S.castShadow=!0,x.add(S),x.add(new Ft(new pe(2.6,.12,10),e)).position.y=.6,a(x,10),l(x,-(14+m*12),5)}}setTrack(t){this.track=t,this.totalLength=t.totalLength,this.buildAdjacentTrack()}setAudioContext(t){this.audioCtx=t}update(t,e){if(!this.active){this.timer+=t,this.timer>=this.nextEventIn&&this.startPass(e);return}if(this.position+=this.speed*t,this.track){this.group.position.set(0,0,0),this.group.quaternion.identity();const n=s=>Math.max(.1,Math.min(this.totalLength-.1,s)),i=new E(0,1,0);for(const s of this.cars){const o=this.position+s.offset,a=n(o+s.halfLen),l=n(o-s.halfLen),c=this.track.getTrackPoint(a),d=this.track.getTrackPoint(l),u=new E().lerpVectors(d.position,c.position,.5),h=new E().lerpVectors(d.right,c.right,.5).normalize();s.group.position.copy(u).addScaledVector(h,jr);const f=new E().subVectors(c.position,d.position).normalize(),g=new E().crossVectors(i,f).normalize(),y=new E().crossVectors(f,g).normalize(),p=new Qt().makeBasis(g,y,f);s.group.quaternion.setFromRotationMatrix(p)}}!this.hornPlayed&&this.position>e-20&&(this.playHorn(),this.hornPlayed=!0),this.position>e+200&&(this.active=!1,this.group.visible=!1,this.timer=0,this.nextEventIn=60+Math.random()*60)}startPass(t){this.active=!0,this.group.visible=!0,this.position=t-150,this.speed=20+Math.random()*15,this.hornPlayed=!1}playHorn(){if(!this.audioCtx)return;const t=this.audioCtx,e=t.currentTime;for(const n of[220,294]){const i=t.createOscillator();i.type="sawtooth",i.frequency.value=n;const s=t.createBiquadFilter();s.type="lowpass",s.frequency.value=600;const o=t.createGain();o.gain.setValueAtTime(0,e),o.gain.linearRampToValueAtTime(.08,e+.1),o.gain.setValueAtTime(.08,e+1),o.gain.linearRampToValueAtTime(0,e+1.5),i.connect(s),s.connect(o),o.connect(t.destination),i.start(e),i.stop(e+1.5)}}buildAdjacentTrack(){if(!this.track)return;const t=new Lt({color:8026760,metalness:.7,roughness:.4}),e=new Lt({color:4864040,roughness:.9}),n=new Lt({color:7368816,roughness:1}),i=new Lt({color:6842472,roughness:1}),s=new pe(3.2,.25,5),o=new pe(1,.15,5),a=new pe(.07,.2,5),l=new pe(2.6,.12,.18);for(let c=0;c<this.totalLength;c+=5){const d=this.track.getTrackPoint(c),u=new E().crossVectors(new E(0,1,0),d.forward).normalize(),h=new E(0,1,0),f=new Qt().makeBasis(u,h,d.forward),g=new Be().setFromRotationMatrix(f),y=d.position.clone().addScaledVector(d.right,jr),p=new Ft(s,n);p.position.copy(y),p.position.y=-.45,p.quaternion.copy(g),p.receiveShadow=!0,this.adjacentTrack.add(p);for(const m of[-1,1]){const x=new Ft(o,i);x.position.copy(y),x.position.addScaledVector(u,m*2),x.position.y=-.5,x.quaternion.copy(g),x.receiveShadow=!0,this.adjacentTrack.add(x)}for(const m of[-1,1]){const x=new Ft(a,t);x.position.copy(y),x.position.addScaledVector(u,m*sc),x.position.y=-.22,x.quaternion.copy(g),x.castShadow=!0,this.adjacentTrack.add(x)}}for(let c=0;c<this.totalLength;c+=.6){const d=this.track.getTrackPoint(c),u=new E().crossVectors(new E(0,1,0),d.forward).normalize(),h=new Qt().makeBasis(u,new E(0,1,0),d.forward),f=new Be().setFromRotationMatrix(h),g=new Ft(l,e);g.position.copy(d.position).addScaledVector(d.right,jr),g.position.y=-.3,g.quaternion.copy(f),g.receiveShadow=!0,this.adjacentTrack.add(g)}}}const bg=[{title:"WELCOME, OPERATOR",text:"Welcome to Staying on Track! You operate a rail grinder — a specialized train that restores worn railroad tracks to their correct shape.",hint:"Click NEXT to begin training",position:"center"},{title:"YOUR MACHINE",text:"You are sitting in a multi-car rail grinder consist. Behind you is the cab. In the middle are the grinding modules with spinning grindstones. Up front is the water car for fire suppression.",hint:"Press 1, 2, 3, 4 to try different camera views",position:"top-left"},{title:"HOW TO DRIVE",text:"Your grinder rides on the rails like a train. Hold W to move forward along the track. Hold S to reverse. You can only go forward and backward — the rails guide you.",hint:"W = forward, S = reverse",position:"top-left"},{title:"THE RAIL PROFILE",text:"The panel in the bottom-right shows the rail CROSS-SECTION — imagine slicing the rail like a loaf of bread. The GREEN dashed line is the TARGET shape (perfect rail). The colored line is the CURRENT shape. RED areas need grinding. GREEN areas are already correct.",hint:"Look at the profile panel >>>",position:"top-left"},{title:"WHY GRIND?",text:"Trains wear down the rail surface over time, creating flat spots, cracks, and uneven wear. Your job is to grind the rail back to the target profile. The closer you match it, the higher your ACCURACY score.",hint:"Check the ACCURACY % in the HUD",position:"top-left"},{title:"HOW TO GRIND",text:"Hold SPACE to lower the grindstones onto the rail. The stones spin and remove tiny amounts of metal. Move forward while grinding to grind the whole track section. Watch the profile update in real-time!",hint:"Hold W + SPACE together to grind while moving",position:"top-left",waitForAction:"grind-contact"},{title:"GRINDING!",text:"Great — sparks! Watch the profile panel update. Now use Q/E to adjust the STONE ANGLE — this controls WHERE on the rail head you grind. Try angling the stones to grind the worn areas shown in RED on the profile.",hint:"Q = angle left (gauge side), E = angle right (field side)",position:"top-left"},{title:"PRESSURE CONTROL",text:"Use A/D to adjust PRESSURE. Higher pressure removes more metal but is less precise — great for heavy defects. Lower pressure gives a finer finish. Watch the bottom panel for your current settings.",hint:"A = less pressure, D = more pressure",position:"top-left"},{title:"TRACK MAP",text:"The strip at the top shows the full track. RED segments have severe defects, YELLOW have moderate. As you grind, they turn GREEN when complete. Your goal: turn them all green!",hint:"Each completed segment earns you money. Streaks give bonuses!",position:"top-left"},{title:"NIGHT GRINDING",text:"Press N to change the time of day. At NIGHT, the sparks become the main light source — just like real rail grinding operations!",hint:"Press N now to try night mode!",position:"center"},{title:"YOU ARE READY!",text:"Grind the entire track to restore it to full speed. Match the target profile (green dashed line) as closely as possible for the best rating. Complete all segments to finish the job. Good luck, operator!",hint:"Follow the objectives panel for guidance",position:"center"}];class oc{constructor(t){P(this,"overlay");P(this,"currentStep",-1);P(this,"steps");P(this,"waitingForEvent",null);P(this,"onComplete");P(this,"eventListenerCleanups",[]);this.overlay=document.getElementById("tutorial-overlay"),this.steps=bg,this.onComplete=t}start(){this.currentStep=-1,this.nextStep()}skip(){var t;this.overlay.innerHTML="",this.currentStep=this.steps.length,this.cleanupListeners(),(t=this.onComplete)==null||t.call(this)}notifyEvent(t){this.waitingForEvent===t&&(this.waitingForEvent=null,this.nextStep())}isActive(){return this.currentStep>=0&&this.currentStep<this.steps.length}nextStep(){var e;if(this.currentStep++,this.currentStep>=this.steps.length){this.overlay.innerHTML="",this.cleanupListeners(),(e=this.onComplete)==null||e.call(this);return}const t=this.steps[this.currentStep];this.showStep(t)}showStep(t){const e=this.currentStep===this.steps.length-1,n=!!t.waitForAction,i={center:"top: 50%; left: 50%; transform: translate(-50%, -50%);","top-left":"top: 80px; left: 20px;","top-right":"top: 80px; right: 20px;","bottom-left":"bottom: 80px; left: 20px;","bottom-right":"bottom: 80px; right: 20px;"};let s="";n?this.waitingForEvent=t.waitForAction:e?s=`
        <button class="tutorial-btn" id="tutorial-finish">GOT IT!</button>
      `:s=`
        <button class="tutorial-btn" id="tutorial-next">NEXT</button>
        <button class="tutorial-btn" id="tutorial-skip" style="background: transparent; color: #666; border: 1px solid #444; margin-left: 8px;">SKIP</button>
      `,this.overlay.innerHTML=`
      <div class="tutorial-box" style="${i[t.position]}">
        <span class="tutorial-title">${t.title}</span>
        <span class="tutorial-text">${t.text}</span>
        ${t.hint?`<span class="tutorial-hint">${t.hint}</span>`:""}
        <div style="margin-top: 12px;">
          ${s}
        </div>
      </div>
    `;const o=document.getElementById("tutorial-next"),a=document.getElementById("tutorial-skip"),l=document.getElementById("tutorial-finish");if(o){const c=()=>this.nextStep();o.addEventListener("click",c),this.eventListenerCleanups.push(()=>o.removeEventListener("click",c))}if(a){const c=()=>this.skip();a.addEventListener("click",c),this.eventListenerCleanups.push(()=>a.removeEventListener("click",c))}if(l){const c=()=>this.skip();l.addEventListener("click",c),this.eventListenerCleanups.push(()=>l.removeEventListener("click",c))}t.autoAdvanceMs&&t.autoAdvanceMs>0&&setTimeout(()=>{this.currentStep<this.steps.length&&this.nextStep()},t.autoAdvanceMs)}cleanupListeners(){for(const t of this.eventListenerCleanups)t();this.eventListenerCleanups=[]}}class Eg{constructor(){P(this,"overlay");P(this,"promptEl");P(this,"phase","wait_start");P(this,"phaseTimer",0);P(this,"firstJob",!0);P(this,"active",!0);this.overlay=document.createElement("div"),this.overlay.style.cssText=`
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      pointer-events: none; z-index: 12;
    `,document.body.appendChild(this.overlay),this.promptEl=document.createElement("div"),this.promptEl.style.cssText=`
      position: absolute; bottom: 260px; left: 50%; transform: translateX(-50%);
      background: rgba(10, 12, 18, 0.9); border: 1px solid rgba(232, 160, 32, 0.4);
      border-radius: 8px; padding: 12px 24px;
      font-family: 'Inter', sans-serif; font-size: 14px; color: #fff;
      text-align: center; line-height: 1.8;
      opacity: 0; transition: opacity 0.4s;
      pointer-events: none;
    `,this.overlay.appendChild(this.promptEl)}setReplay(){this.firstJob=!1,this.active=!1,this.phase="free_play",this.hidePrompt()}isFirstJob(){return this.firstJob}showPrompt(t){this.promptEl.innerHTML=t,this.promptEl.style.opacity="1"}hidePrompt(){this.promptEl.style.opacity="0"}update(t,e){if(!this.active)return{};switch(this.phaseTimer+=t,this.phase){case"wait_start":return this.phaseTimer>1&&(this.showPrompt(`
            Hold <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">SPACE</kbd> to lower the grindstones
          `),this.phase="prompt_grind",this.phaseTimer=0),{autoMove:!0};case"prompt_grind":return e.isGrinding&&(this.showPrompt(`
            <span style="color:var(--ui-green);">Grinding!</span> Watch the sparks and the rail profile below
          `),this.phase="grinding",this.phaseTimer=0),{autoMove:!0};case"grinding":return e.sectionsCompleted>=1&&(this.hidePrompt(),this.phase="first_complete",this.phaseTimer=0),{};case"first_complete":return this.phaseTimer>2&&(this.showPrompt(`
            Use <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">Q</kbd> and <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">E</kbd> to aim at the <span style="color:#ff5500;">orange</span> zones on the profile
          `),this.phase="prompt_angle",this.phaseTimer=0),{};case"prompt_angle":return e.angleChanged&&(this.showPrompt(`
            <span style="color:var(--ui-green);">Good!</span> Now try <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">A</kbd> / <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">D</kbd> to adjust grinding pressure
          `),this.phase="prompt_pressure",this.phaseTimer=0),this.phaseTimer>15&&(this.phase="prompt_pressure",this.phaseTimer=0),{};case"prompt_pressure":return(e.pressureChanged||this.phaseTimer>10)&&(this.showPrompt(`
            Press <kbd style="background:rgba(255,255,255,0.1);padding:2px 8px;border-radius:4px;font-family:var(--ui-mono);color:var(--ui-accent);">TAB</kbd> to switch between left and right rail
          `),this.phase="prompt_tab",this.phaseTimer=0),{};case"prompt_tab":return(e.tabPressed||this.phaseTimer>12)&&(this.showPrompt(`
            <span style="color:var(--ui-green);">You're ready!</span> Grind all sections to lift the slow orders.
            <div style="font-size:11px;color:var(--ui-dim);margin-top:4px;">SHIFT+W = fast travel &nbsp; 1-5 = cameras &nbsp; N = time &nbsp; P = rain</div>
          `),this.phase="free_play",this.phaseTimer=0,setTimeout(()=>this.hidePrompt(),5e3),this.active=!1),{};case"free_play":return{}}return{}}dispose(){this.overlay.remove()}}class Tg{constructor(){P(this,"canvas");P(this,"ctx");P(this,"segments",[]);P(this,"grinderT",0);P(this,"nextTarget",-1);P(this,"revenueTrainT",-1);this.canvas=document.createElement("canvas"),this.canvas.id="track-map",this.canvas.width=600,this.canvas.height=50,this.canvas.style.cssText=`
      position: absolute;
      top: 12px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(0, 0, 0, 0.85);
      border: 2px solid #555;
      pointer-events: none;
      image-rendering: pixelated;
    `,document.body.appendChild(this.canvas),this.ctx=this.canvas.getContext("2d")}init(t){this.segments=[];for(let e=0;e<t;e++)this.segments.push({defectSeverity:0,grindProgress:0,accuracy:0,completed:!1})}updateSegment(t,e){t<0||t>=this.segments.length||Object.assign(this.segments[t],e)}setGrinderPosition(t){this.grinderT=Math.max(0,Math.min(1,t))}setNextTarget(t){this.nextTarget=t}setRevenueTrainPosition(t){this.revenueTrainT=t}draw(){const{width:t,height:e}=this.canvas,n=this.ctx,i=this.segments.length;if(i===0)return;n.clearRect(0,0,t,e);const s=20,o=t-s*2,a=o/i,l=e/2,c=16;n.strokeStyle="#444",n.lineWidth=2,n.beginPath(),n.moveTo(s,l-3),n.lineTo(s+o,l-3),n.moveTo(s,l+3),n.lineTo(s+o,l+3),n.stroke();for(let u=0;u<i;u++){const h=this.segments[u],f=s+u*a;let g;if(h.completed)g="#22aa44";else if(h.grindProgress>.01){const y=h.accuracy;y>.8?g="#88cc44":y>.5?g="#ccaa22":g="#cc6622"}else{const y=h.defectSeverity;y>.7?g="#cc2222":y>.4?g="#cc6622":y>.1?g="#ccaa22":g="#446644"}n.fillStyle=g,n.fillRect(f+1,l-c/2,a-2,c),h.grindProgress>0&&!h.completed&&(n.fillStyle="rgba(100, 200, 100, 0.3)",n.fillRect(f+1,l-c/2,(a-2)*h.grindProgress,c)),n.strokeStyle="#333",n.lineWidth=1,n.strokeRect(f+1,l-c/2,a-2,c),n.font="7px sans-serif",n.textAlign="center",h.completed?(n.fillStyle="#fff",n.fillText("OK",f+a/2,l+3)):h.slowOrder&&(n.fillStyle="#ffcc00",n.fillText("SLOW",f+a/2,l+3)),n.fillStyle="#666",n.font="6px monospace",n.textAlign="center",n.fillText(`${u+1}`,f+a/2,l+c/2+8)}const d=s+this.grinderT*o;if(n.fillStyle="#ffaa00",n.beginPath(),n.moveTo(d,l-c/2-2),n.lineTo(d-5,l-c/2-9),n.lineTo(d+5,l-c/2-9),n.closePath(),n.fill(),n.fillStyle="#ffaa00",n.font='7px "Press Start 2P", monospace',n.textAlign="center",n.fillText("GRINDER",d,l-c/2-11),this.nextTarget>=0&&this.nextTarget<i&&Math.sin(Date.now()*.006)>0){const h=s+(this.nextTarget+.5)*a;n.fillStyle="#ff8800",n.beginPath(),n.moveTo(h,l+c/2+4),n.lineTo(h-4,l+c/2+10),n.lineTo(h+4,l+c/2+10),n.closePath(),n.fill(),n.font="6px sans-serif",n.textAlign="center",n.fillText("NEXT",h,l+c/2+17)}if(this.revenueTrainT>=0&&this.revenueTrainT<=1){const u=s+this.revenueTrainT*o;n.fillStyle="rgba(255, 30, 30, 0.06)",n.fillRect(u,l-c/2-1,s+o-u,c+2);const h=.4+Math.sin(Date.now()*.008)*.2;n.fillStyle=`rgba(255, 30, 30, ${h*.15})`,n.beginPath(),n.arc(u,l,14,0,Math.PI*2),n.fill(),n.fillStyle=`rgba(255, 40, 40, ${h+.3})`,n.beginPath(),n.moveTo(u-6,l),n.lineTo(u+4,l-6),n.lineTo(u+4,l+6),n.closePath(),n.fill(),n.fillStyle="#ff4444",n.font="6px sans-serif",n.textAlign="center",n.fillText("TRAIN",u,l-c/2-12)}}dispose(){this.canvas.remove()}}class wg{constructor(){P(this,"container");this.container=document.createElement("div"),this.container.id="floating-scores",this.container.style.cssText=`
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: 15;
      overflow: hidden;
    `,document.body.appendChild(this.container)}show(t,e="#ffaa00",n,i){const s=document.createElement("div"),o=n??window.innerWidth/2,a=i??window.innerHeight/2-50;s.textContent=t,s.style.cssText=`
      position: absolute;
      left: ${o}px;
      top: ${a}px;
      font-family: 'Press Start 2P', monospace;
      font-size: 16px;
      color: ${e};
      text-shadow: 0 0 8px ${e}, 2px 2px 0 rgba(0,0,0,0.8);
      transform: translate(-50%, 0) scale(1.3);
      transition: all 1.2s ease-out;
      opacity: 1;
      z-index: 16;
      pointer-events: none;
    `,this.container.appendChild(s),requestAnimationFrame(()=>{s.style.top=`${a-80}px`,s.style.opacity="0",s.style.transform="translate(-50%, 0) scale(0.8)"}),setTimeout(()=>s.remove(),1300)}showSegmentComplete(t,e,n){this.show(`+${n} FT RESTORED`,"#44ff44"),setTimeout(()=>{const i="★".repeat(e)+"☆".repeat(3-e);this.show(i,e===3?"#ffdd00":"#aaaaaa",window.innerWidth/2,window.innerHeight/2-20)},200),setTimeout(()=>{this.show(`SEGMENT ${t} COMPLETE`,"#ffffff",window.innerWidth/2,window.innerHeight/2+10)},100)}showStreak(t){t<2||this.show(`${t}x STREAK!`,t>=5?"#ff44ff":t>=3?"#ffaa00":"#aaddff",window.innerWidth/2,window.innerHeight/2-90)}dispose(){this.container.remove()}}const $n=[{from:"DISPATCH",text:"Grinder 42, you are clear to proceed on Main Track."},{from:"DISPATCH",text:"Be advised, slow order in effect ahead. Reduce speed."},{from:"DISPATCH",text:"Weather report: clear skies, low humidity. Watch for fire risk."},{from:"DISPATCH",text:"Grinder 42, confirm your position, over."},{from:"DISPATCH",text:"Good work out there. Keep those rails smooth."},{from:"DISPATCH",text:"Next inspection crew coming through in 45 minutes."},{from:"TRAIN 118",text:"Eastbound freight passing on Track 2, heads up."},{from:"TRAIN 204",text:"Westbound manifest, 118 cars, passing your location."},{from:"YARD",text:"Grinder 42, water car status? How are your levels?"},{from:"DISPATCH",text:"Quality check on Section 4 came back good. Nice work."},{from:"DISPATCH",text:"Reminder: document any unusual rail conditions."},{from:"TRAIN 507",text:"Horn test... all clear."},{from:"DISPATCH",text:"Speed restriction lifted on Section 7. Good grinding."},{from:"SAFETY",text:"Fire watch crew reports all clear behind you."},{from:"DISPATCH",text:"Keep it up, Grinder 42. Halfway through the shift."}];class Ag{constructor(){P(this,"container");P(this,"messageEl");P(this,"timer",8);P(this,"nextIn",10+Math.random()*15);P(this,"messageIndex",0);P(this,"visible",!1);this.container=document.createElement("div"),this.container.style.cssText=`
      position: absolute;
      top: 70px;
      right: 16px;
      width: 260px;
      background: rgba(0, 20, 0, 0.85);
      border: 2px solid #338833;
      padding: 8px 10px;
      font-family: 'Press Start 2P', monospace;
      font-size: 7px;
      color: #44dd44;
      line-height: 2;
      pointer-events: none;
      opacity: 0;
      transition: opacity 0.5s;
      z-index: 5;
    `;const t=document.createElement("div");t.style.cssText="color: #338833; font-size: 6px; letter-spacing: 2px; margin-bottom: 4px;",t.textContent="RADIO",this.container.appendChild(t),this.messageEl=document.createElement("div"),this.container.appendChild(this.messageEl),document.body.appendChild(this.container),this.shuffleMessages()}update(t){this.timer+=t,!this.visible&&this.timer>=this.nextIn&&this.showNext(),this.visible&&this.timer>6&&(this.container.style.opacity="0",this.visible=!1,this.nextIn=15+Math.random()*25,this.timer=0)}showNext(){const t=$n[this.messageIndex%$n.length];this.messageIndex++,this.messageEl.innerHTML=`
      <span style="color: #88ff88;">[${t.from}]</span><br>
      "${t.text}"
    `,this.container.style.opacity="1",this.visible=!0,this.timer=0}shuffleMessages(){for(let t=$n.length-1;t>0;t--){const e=Math.floor(Math.random()*(t+1));[$n[t],$n[e]]=[$n[e],$n[t]]}}dispose(){this.container.remove()}}const Cg=["Gauge Corner Wear","Running Surface Fatigue","Corrugation","Field Side Wear"];class Rg{constructor(){P(this,"overlay");this.overlay=document.createElement("div"),this.overlay.id="report-overlay",this.overlay.style.cssText=`
      position: absolute;
      top: 0; left: 0; width: 100%; height: 100%;
      background: rgba(0, 5, 0, 0.95);
      display: none;
      justify-content: center;
      align-items: flex-start;
      overflow-y: auto;
      z-index: 40;
      font-family: 'Press Start 2P', monospace;
      color: #ccc;
    `,document.body.appendChild(this.overlay)}computeJobReport(t,e){const n=[];let i=0,s=0,o=0,a=0;for(let l=0;l<t.sectionCount;l++){const c=t.getSegmentsForSection(l);if(c.length===0)continue;let d=0,u=0,h=0,f=null;for(const v of c){for(const A of["left","right"]){const L=t.getProfile(v,A).compare(e);A==="left"?d+=L.averageDeviation:u+=L.averageDeviation,(!f||L.averageDeviation>f.averageDeviation)&&(f=L)}h++}const g=h>0?d/h:0,y=h>0?u/h:0,p=Math.max(g,y),m=Math.max(0,Math.min(100,100-g*500)),x=Math.max(0,Math.min(100,100-y*500)),M=Math.min(m,x),S=l%4,C=Cg[S],w=p;let R;p>.15?(R="CRITICAL",s++):p>.08?(R="MODERATE",o++):p>.02?(R="LIGHT",a++):R="GOOD",i+=M,n.push({index:l,defectType:C,severity:R,severityValue:w,deviation:f,rqi:M,rqiLeft:m,rqiRight:x})}return{sections:n,overallRQI:i/Math.max(1,n.length),totalSections:t.sectionCount,criticalCount:s,moderateCount:o,lightCount:a,trackLengthFt:Math.round(t.totalLength*3.281)}}showPreJobReport(t){return new Promise(e=>{const n=t.overallRQI>70?"#44ff44":t.overallRQI>40?"#ffaa00":"#ff4444";let i="";for(const s of t.sections){const o=s.severity==="CRITICAL"?"#ff4444":s.severity==="MODERATE"?"#ffaa00":s.severity==="LIGHT"?"#aaaa44":"#44ff44",a=s.rqiLeft>70?"#44ff44":s.rqiLeft>40?"#ffaa00":"#ff4444",l=s.rqiRight>70?"#44ff44":s.rqiRight>40?"#ffaa00":"#ff4444";i+=`
          <tr>
            <td style="color: #888;">${s.index+1}</td>
            <td>${s.defectType}</td>
            <td style="color: ${o};">${s.severity}</td>
            <td style="color: ${a};">${s.rqiLeft.toFixed(0)}</td>
            <td style="color: ${l};">${s.rqiRight.toFixed(0)}</td>
            <td>${s.deviation.averageDeviation.toFixed(3)}mm</td>
          </tr>
        `}this.overlay.innerHTML=`
        <div style="max-width: 750px; padding: 30px 40px; margin: 20px auto;">
          <div style="text-align: center; margin-bottom: 24px;">
            <div style="color: #44ff44; font-size: 8px; letter-spacing: 3px; margin-bottom: 8px;">VISTA INSPECTION SYSTEM</div>
            <div style="color: #ffaa00; font-size: 16px; margin-bottom: 4px;">PRE-GRIND REPORT</div>
            <div style="color: #666; font-size: 7px;">TRACK SECTION ANALYSIS</div>
          </div>

          <div style="display: flex; gap: 20px; margin-bottom: 20px; justify-content: center;">
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 12px 18px; border: 1px solid #333;">
              <div style="font-size: 7px; color: #888; letter-spacing: 2px;">RAIL QUALITY INDEX</div>
              <div style="font-size: 24px; color: ${n}; margin-top: 4px;">${t.overallRQI.toFixed(0)}</div>
              <div style="font-size: 7px; color: #666;">/ 100</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 12px 18px; border: 1px solid #333;">
              <div style="font-size: 7px; color: #888; letter-spacing: 2px;">TRACK LENGTH</div>
              <div style="font-size: 18px; color: #fff; margin-top: 4px;">${t.trackLengthFt}</div>
              <div style="font-size: 7px; color: #666;">FEET</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 12px 18px; border: 1px solid #333;">
              <div style="font-size: 7px; color: #888; letter-spacing: 2px;">SECTIONS</div>
              <div style="font-size: 18px; color: #fff; margin-top: 4px;">${t.totalSections}</div>
              <div style="font-size: 7px; color: #666;">TOTAL</div>
            </div>
          </div>

          <div style="display: flex; gap: 12px; margin-bottom: 20px; justify-content: center;">
            <div style="font-size: 8px;">
              <span style="color: #ff4444;">&#9632;</span> CRITICAL: <span style="color: #ff4444;">${t.criticalCount}</span>
            </div>
            <div style="font-size: 8px;">
              <span style="color: #ffaa00;">&#9632;</span> MODERATE: <span style="color: #ffaa00;">${t.moderateCount}</span>
            </div>
            <div style="font-size: 8px;">
              <span style="color: #aaaa44;">&#9632;</span> LIGHT: <span style="color: #aaaa44;">${t.lightCount}</span>
            </div>
          </div>

          <div style="font-size: 7px; color: #44ff44; letter-spacing: 2px; margin-bottom: 8px;">SECTION BREAKDOWN</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 7px; line-height: 2.5;">
            <thead>
              <tr style="color: #666; border-bottom: 1px solid #333;">
                <th style="text-align: left; padding: 4px;">SEC</th>
                <th style="text-align: left;">DEFECT TYPE</th>
                <th style="text-align: left;">SEVERITY</th>
                <th style="text-align: left;">RQI L</th>
                <th style="text-align: left;">RQI R</th>
                <th style="text-align: left;">DEVIATION</th>
              </tr>
            </thead>
            <tbody>
              ${i}
            </tbody>
          </table>

          <div style="text-align: center; margin-top: 24px;">
            <div style="color: #888; font-size: 7px; margin-bottom: 8px;">
              OBJECTIVE: Grind all sections to RQI > 80
            </div>
            <button id="report-start-btn" style="
              background: #ffaa00; color: #000; border: none;
              font-family: 'Press Start 2P', monospace; font-size: 10px;
              padding: 12px 32px; cursor: pointer; margin-top: 8px;
            ">BEGIN GRINDING</button>
          </div>
        </div>
      `,this.overlay.style.display="flex",document.getElementById("report-start-btn").addEventListener("click",()=>{this.overlay.style.display="none",e()},{once:!0})})}showCompletionReport(t){return new Promise(e=>{const n=Math.floor(t.elapsedTime/60),i=Math.floor(t.elapsedTime%60),s=t.rqiBefore>70?"#44ff44":t.rqiBefore>40?"#ffaa00":"#ff4444",o=t.rqiAfter>70?"#44ff44":t.rqiAfter>40?"#ffaa00":"#ff4444",a=t.rqiAfter-t.rqiBefore,l=a>0?"#44ff44":"#ff4444",c="★".repeat(t.stars)+"☆".repeat(5-t.stars),d=t.rqiAfter>=95?"A+":t.rqiAfter>=90?"A":t.rqiAfter>=80?"B":t.rqiAfter>=70?"C":t.rqiAfter>=60?"D":"F",u=d.startsWith("A")?"#44ff44":d==="B"?"#88cc44":d==="C"?"#ffaa00":"#ff4444";let h="";for(const f of t.sections){const g=f.rqiLeft>80?"#44ff44":f.rqiLeft>60?"#ffaa00":"#ff4444",y=f.rqiRight>80?"#44ff44":f.rqiRight>60?"#ffaa00":"#ff4444";h+=`
          <tr>
            <td style="color: #888;">${f.index+1}</td>
            <td>${f.defectType}</td>
            <td style="color: ${g};">${f.rqiLeft.toFixed(0)}</td>
            <td style="color: ${y};">${f.rqiRight.toFixed(0)}</td>
            <td>${f.deviation.averageDeviation.toFixed(3)}mm</td>
          </tr>
        `}this.overlay.innerHTML=`
        <div style="max-width: 750px; padding: 30px 40px; margin: 20px auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="color: #44ff44; font-size: 8px; letter-spacing: 3px; margin-bottom: 8px;">GRINDING OPERATION COMPLETE</div>
            <div style="color: #ffaa00; font-size: 16px; margin-bottom: 4px;">POST-GRIND REPORT</div>
            <div style="font-size: 28px; color: #ffdd00; margin: 12px 0;">${c}</div>
            <div style="font-size: 32px; color: ${u}; margin-bottom: 4px;">GRADE: ${d}</div>
          </div>

          <div style="display: flex; gap: 14px; margin-bottom: 20px; justify-content: center; flex-wrap: wrap;">
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">RQI BEFORE</div>
              <div style="font-size: 20px; color: ${s}; margin-top: 2px;">${t.rqiBefore.toFixed(0)}</div>
            </div>
            <div style="text-align: center; padding: 10px 4px; font-size: 20px; color: #888; align-self: center;">&rarr;</div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">RQI AFTER</div>
              <div style="font-size: 20px; color: ${o}; margin-top: 2px;">${t.rqiAfter.toFixed(0)}</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">IMPROVEMENT</div>
              <div style="font-size: 20px; color: ${l}; margin-top: 2px;">+${a.toFixed(0)}</div>
            </div>
          </div>

          <div style="display: flex; gap: 14px; margin-bottom: 20px; justify-content: center; flex-wrap: wrap;">
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">SECTIONS</div>
              <div style="font-size: 14px; color: #fff; margin-top: 2px;">${t.sectionsCompleted} / ${t.totalSections}</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">TRACK RESTORED</div>
              <div style="font-size: 14px; color: #44ff44; margin-top: 2px;">${t.trackRestoredFt} FT</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">TIME</div>
              <div style="font-size: 14px; color: #fff; margin-top: 2px;">${n}:${i.toString().padStart(2,"0")}</div>
            </div>
            <div style="text-align: center; background: rgba(255,255,255,0.03); padding: 10px 16px; border: 1px solid #333;">
              <div style="font-size: 6px; color: #888; letter-spacing: 2px;">METAL REMOVED</div>
              <div style="font-size: 14px; color: #fff; margin-top: 2px;">${t.metalRemoved.toFixed(2)}mm</div>
            </div>
          </div>

          <div style="font-size: 7px; color: #44ff44; letter-spacing: 2px; margin-bottom: 8px;">FINAL SECTION BREAKDOWN</div>
          <table style="width: 100%; border-collapse: collapse; font-size: 7px; line-height: 2.5;">
            <thead>
              <tr style="color: #666; border-bottom: 1px solid #333;">
                <th style="text-align: left; padding: 4px;">SEC</th>
                <th style="text-align: left;">DEFECT TYPE</th>
                <th style="text-align: left;">RQI L</th>
                <th style="text-align: left;">RQI R</th>
                <th style="text-align: left;">DEVIATION</th>
              </tr>
            </thead>
            <tbody>
              ${h}
            </tbody>
          </table>

          <div style="text-align: center; margin-top: 24px;">
            <button id="report-done-btn" style="
              background: #ffaa00; color: #000; border: none;
              font-family: 'Press Start 2P', monospace; font-size: 10px;
              padding: 12px 32px; cursor: pointer;
            ">CONTINUE</button>
            <div style="color: #555; font-size: 7px; margin-top: 8px;">Press R to restart</div>
          </div>
        </div>
      `,this.overlay.style.display="flex",document.getElementById("report-done-btn").addEventListener("click",()=>{this.overlay.style.display="none",e()},{once:!0})})}hide(){this.overlay.style.display="none"}dispose(){this.overlay.remove()}}const Qr=[{id:"transcon",name:"BNSF Transcon — Emporia Sub",location:"Kansas",description:"The Southern Transcon is one of America's busiest freight corridors. Long straights across the Great Plains with 100M+ gross tons annually. Head checking and corrugation from high-speed intermodal traffic at 60-70 mph.",difficulty:"Easy",difficultyColor:"#44cc44",trackLength:"280m",sections:14,defectMultiplier:1,defectSeverity:.4,timeOfDay:1,trackPoints:[new E(0,0,-10),new E(0,0,40),new E(0,0,90),new E(1,0,130),new E(3,0,170),new E(4,0,210),new E(3,0,245),new E(1,0,275),new E(0,0,300),new E(0,0,340),new E(0,0,400),new E(0,0,460),new E(0,0,520)]},{id:"marias",name:"BNSF Hi-Line — Marias Pass",location:"Montana",description:"Crossing the Continental Divide at 5,213 ft — the lowest rail crossing of the Rockies. Sharp 4-8 degree curves on the western descent with heavy coal and grain unit trains. Severe gauge face wear and cold-weather fracture risk.",difficulty:"Medium",difficultyColor:"#ccaa22",trackLength:"380m",sections:18,defectMultiplier:1.5,defectSeverity:.7,timeOfDay:2,trackPoints:[new E(0,0,-10),new E(0,0,20),new E(0,0,50),new E(0,0,80),new E(3,0,105),new E(8,0,125),new E(16,0,142),new E(26,0,157),new E(36,0,170),new E(44,0,185),new E(50,0,202),new E(52,0,222),new E(50,0,242),new E(45,0,260),new E(38,0,278),new E(32,0,298),new E(30,0,318),new E(30,0,340),new E(32,0,360),new E(32,0,400),new E(32,0,460),new E(32,0,520),new E(32,0,580)]},{id:"clearing",name:"BRC Clearing Yard Approach",location:"Chicago, IL",description:"Belt Railway of Chicago — where 25% of US rail freight converges. Tight urban curves around Clearing Yard. Constant stop-and-go traffic causes severe rail crush, corrugation, and switch wear. Night shift on the busiest rail junction in America.",difficulty:"Hard",difficultyColor:"#dd6622",trackLength:"300m",sections:15,defectMultiplier:2,defectSeverity:.9,timeOfDay:3,trackPoints:[new E(0,0,-10),new E(0,0,20),new E(3,0,45),new E(10,0,68),new E(20,0,88),new E(28,0,110),new E(30,0,135),new E(25,0,158),new E(18,0,180),new E(15,0,205),new E(18,0,230),new E(24,0,255),new E(26,0,280),new E(24,0,300),new E(24,0,340),new E(24,0,400),new E(24,0,460),new E(24,0,520)]},{id:"coast",name:"UP Coast Sub — Surf to SLO",location:"California",description:"Union Pacific's Coast Subdivision between Surf and San Luis Obispo. Tracks run directly along the Pacific Ocean. Salt spray corrosion, base pitting, and mixed-traffic fatigue from Amtrak Coast Starlight and UP freight. Dawn start for golden hour over the ocean.",difficulty:"Expert",difficultyColor:"#dd2244",trackLength:"420m",sections:21,defectMultiplier:2.5,defectSeverity:1,timeOfDay:0,trackPoints:[new E(0,0,-10),new E(0,0,20),new E(2,0,50),new E(8,0,78),new E(18,0,102),new E(30,0,125),new E(40,0,148),new E(46,0,172),new E(48,0,198),new E(44,0,222),new E(36,0,245),new E(28,0,265),new E(24,0,288),new E(26,0,310),new E(32,0,335),new E(38,0,358),new E(40,0,382),new E(38,0,405),new E(35,0,425),new E(35,0,465),new E(35,0,525),new E(35,0,585),new E(35,0,645)]}],Pg=[[-67,45],[-67,44.3],[-68,44.4],[-69,43.9],[-70,43.6],[-70.7,42.7],[-71,41.7],[-72,41],[-73.7,40.7],[-74,40.5],[-74.2,39.7],[-75.5,39.4],[-76,38.4],[-75.5,37.5],[-76,36.9],[-75.5,35.8],[-76.5,35],[-77,34.7],[-78.5,33.9],[-79.9,32.8],[-81,31.5],[-81.5,30.7],[-81.2,29.8],[-80.6,28.8],[-80.2,27.5],[-80.1,26.3],[-80.1,25.3],[-81,25.1],[-81.8,25.7],[-82,26.5],[-82.5,27.5],[-82.7,28.3],[-83.5,29],[-84,29.9],[-84.5,30],[-85.5,30],[-86.5,30.4],[-87.5,30.3],[-88.5,30.2],[-89.4,30.2],[-89.5,29.3],[-89.8,29],[-90.3,29.1],[-91,29.3],[-91.8,29.5],[-92.5,29.5],[-93.5,29.8],[-94.5,29.4],[-95,29],[-96,28.6],[-97,27.8],[-97.2,26.5],[-97.5,26],[-98.5,26.2],[-99.5,27],[-100.5,28.2],[-101.5,29.8],[-103,29],[-104,29.3],[-104.7,29.6],[-104.7,31],[-106.6,32],[-108.2,31.8],[-111.1,31.3],[-114.7,32.7],[-117.1,32.5],[-117.3,33.1],[-118.4,34],[-119.5,34.4],[-120.5,34.8],[-120.7,35.6],[-121.8,36.8],[-122.4,37.8],[-122.5,38],[-123,38.5],[-123.7,39],[-124.2,40.5],[-124.4,42],[-124.5,43],[-124.2,44.5],[-124,46],[-124,46.3],[-123.5,47],[-124.6,47.9],[-124.7,48.4],[-123,48.3],[-122.8,49],[-117,49],[-111,49],[-104,49],[-97,49],[-95.2,49],[-95,49.4],[-94.5,48.7],[-93.5,48.6],[-92,48.6],[-90.5,48.1],[-89.5,48],[-88,48.2],[-87.5,47.4],[-86.5,46.6],[-85,46.8],[-84.5,46.5],[-84,46.5],[-83.5,46.1],[-84.2,45.6],[-82.5,45],[-82.5,43],[-82.5,42.3],[-83,41.7],[-81,41.7],[-79.8,42.5],[-79,43.3],[-76.8,43.6],[-76,44],[-75,44.8],[-74.5,45],[-73.3,45],[-71.5,45],[-70.8,45.4],[-69.2,47.2],[-68,47.3],[-67.8,47.1],[-67.8,45.7],[-67,45]],Lg=[[[-86.8,46],[-87,45.3],[-87.5,44.8],[-87.6,44],[-87.8,43],[-87.7,42.5],[-87,42],[-86.5,41.7],[-86.2,42.5],[-86,43.5],[-85.5,44.5],[-85.5,45.2],[-85.8,45.8],[-86.8,46]],[[-89.5,48],[-89,47.5],[-88,47],[-87,46.8],[-86,46.7],[-85,46.8],[-84.8,47],[-85,47.5],[-86,47.6],[-87,47.4],[-88.5,47.8],[-89.5,48]],[[-83.5,41.7],[-82.5,41.4],[-81.5,41.5],[-80.5,42],[-79.8,42.5],[-80.5,42.7],[-81.5,42.4],[-82.5,42.1],[-83.5,41.7]],[[-79.5,43.3],[-78.5,43.3],[-77.5,43.3],[-76.5,43.7],[-76.3,44],[-77,44.1],[-78,43.9],[-79,43.8],[-79.5,43.3]],[[-84.5,46],[-83.5,45.5],[-82.5,44.5],[-82,43.5],[-82,43],[-82.5,43.5],[-83,44],[-83.5,44.8],[-84,45.5],[-84.5,46]]],Ig={transcon:{lon:-96.5,lat:38.5,routeAngle:0},marias:{lon:-113.3,lat:48.3,routeAngle:-.3},clearing:{lon:-87.8,lat:41.8,routeAngle:.5},coast:{lon:-120.5,lat:35.2,routeAngle:-1.2}};class Dg{constructor(){P(this,"overlay");this.overlay=document.createElement("div"),this.overlay.id="job-select",this.overlay.style.cssText=`
      position: absolute; top: 0; left: 0; width: 100%; height: 100%;
      background: linear-gradient(180deg, #0a0c14 0%, #141828 50%, #0a0c14 100%);
      display: none; justify-content: center; align-items: center;
      z-index: 45; font-family: 'Inter', sans-serif; color: #fff;
      overflow-y: auto;
    `,document.body.appendChild(this.overlay)}show(){return new Promise(t=>{let e=`
        <div style="max-width: 900px; padding: 30px 20px; margin: 20px auto;">
          <div style="text-align: center; margin-bottom: 20px;">
            <div style="font-size: 11px; color: rgba(255,170,0,0.6); letter-spacing: 6px; margin-bottom: 6px;">SELECT CONTRACT</div>
            <div style="font-size: 28px; font-weight: 700; letter-spacing: 2px;">AVAILABLE JOBS</div>
          </div>
          <div style="display: flex; justify-content: center; margin-bottom: 20px;">
            <canvas id="us-map-canvas" width="600" height="320" style="
              background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06);
              border-radius: 8px;
            "></canvas>
          </div>
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      `;for(const i of Qr)e+=`
          <div class="job-card" data-job="${i.id}" style="
            background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
            border-radius: 8px; padding: 20px; cursor: pointer;
            transition: all 0.2s;
          " onmouseover="this.style.borderColor='rgba(232,160,32,0.5)';this.style.background='rgba(255,255,255,0.06)'"
             onmouseout="this.style.borderColor='rgba(255,255,255,0.08)';this.style.background='rgba(255,255,255,0.03)'">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 10px;">
              <div>
                <div style="font-size: 16px; font-weight: 600;">${i.name}</div>
                <div style="font-size: 11px; color: #666; margin-top: 2px;">${i.location}</div>
              </div>
              <div style="
                font-size: 10px; font-weight: 600; color: ${i.difficultyColor};
                background: ${i.difficultyColor}18; border: 1px solid ${i.difficultyColor}40;
                border-radius: 12px; padding: 3px 10px;
              ">${i.difficulty}</div>
            </div>
            <div style="font-size: 12px; color: #888; line-height: 1.6; margin-bottom: 12px;">
              ${i.description}
            </div>
            <div style="display: flex; gap: 16px; font-size: 11px; color: #666;">
              <div><span style="color: #aaa;">${i.trackLength}</span> track</div>
              <div><span style="color: #aaa;">${i.sections}</span> sections</div>
              <div><span style="color: #44cc44;">${i.difficulty}</span></div>
            </div>
          </div>
        `;e+="</div></div>",this.overlay.innerHTML=e,this.overlay.style.display="flex",this.overlay.querySelectorAll(".job-card").forEach(i=>{i.addEventListener("click",()=>{const s=i.getAttribute("data-job"),o=Qr.find(a=>a.id===s);this.overlay.style.display="none",t(o)})}),this.drawUSMap()})}drawUSMap(){const t=document.getElementById("us-map-canvas");if(!t)return;const e=t.getContext("2d"),n=t.width,i=t.height,s=25;e.clearRect(0,0,n,i);const o=-126,a=-65,l=24,c=50,d=n-s*2,u=i-s*2,h=p=>s+(p-o)/(a-o)*d,f=p=>s+(c-p)/(c-l)*u,g=(p,m,x,M)=>{e.strokeStyle=m,e.fillStyle=x,e.lineWidth=M,e.beginPath();for(let S=0;S<p.length;S++){const C=h(p[S][0]),w=f(p[S][1]);S===0?e.moveTo(C,w):e.lineTo(C,w)}e.closePath(),x!=="none"&&e.fill(),e.stroke()};g(Pg,"rgba(255,255,255,0.2)","rgba(255,255,255,0.04)",1.5);for(const p of Lg)g(p,"rgba(100,150,200,0.2)","rgba(20,40,80,0.4)",1);const y={transcon:"#44cc44",marias:"#ccaa22",clearing:"#dd6622",coast:"#dd2244"};for(const p of Qr){const m=Ig[p.id];if(!m)continue;const x=h(m.lon),M=f(m.lat),S=y[p.id]||"#fff",C=30;e.strokeStyle=S,e.lineWidth=2.5,e.globalAlpha=.4,e.beginPath(),e.moveTo(x-Math.cos(m.routeAngle)*C,M-Math.sin(m.routeAngle)*C),e.lineTo(x+Math.cos(m.routeAngle)*C,M+Math.sin(m.routeAngle)*C),e.stroke(),e.globalAlpha=1,e.strokeStyle=S,e.lineWidth=1.5,e.globalAlpha=.3,e.beginPath(),e.arc(x,M,12,0,Math.PI*2),e.stroke(),e.globalAlpha=1,e.fillStyle=S,e.beginPath(),e.arc(x,M,5,0,Math.PI*2),e.fill(),e.fillStyle="#fff",e.beginPath(),e.arc(x,M,2,0,Math.PI*2),e.fill();const w=x<n/2;e.fillStyle=S,e.font="600 10px Inter, sans-serif",e.textAlign=w?"left":"right";const R=w?x+16:x-16;e.fillText(p.name.split("—")[0].trim(),R,M-6),e.font="9px Inter, sans-serif",e.fillStyle="rgba(255,255,255,0.5)",e.fillText(p.location+" · "+p.difficulty,R,M+6)}e.fillStyle="rgba(255,255,255,0.25)",e.font="9px Inter, sans-serif",e.textAlign="center",e.fillText("UNITED STATES — RAIL GRINDING CORRIDORS",n/2,14)}hide(){this.overlay.style.display="none"}}class Ng{constructor(){P(this,"listeners",new Map)}on(t,e){return this.listeners.has(t)||this.listeners.set(t,new Set),this.listeners.get(t).add(e),()=>{var n;(n=this.listeners.get(t))==null||n.delete(e)}}emit(t,...e){const n=this.listeners.get(t);if(n)for(const i of n)i(...e)}clear(t){t?this.listeners.delete(t):this.listeners.clear()}}const Ug=new Ng;let Se=15,Re=300;class Fg{constructor(){P(this,"engine");P(this,"input");P(this,"track");P(this,"profileRenderer");P(this,"environment");P(this,"dayNight");P(this,"sparkSystem");P(this,"audio");P(this,"tutorial");P(this,"trackMap");P(this,"floatingScore");P(this,"passingTrain");P(this,"grindContact");P(this,"radioDispatch");P(this,"weather");P(this,"inspectionReport");P(this,"jobSelect");P(this,"guidedTutorial");P(this,"currentJob",null);P(this,"preJobRQI",0);P(this,"gameStarted",!1);P(this,"isFirstJob",!0);P(this,"targetProfile");P(this,"grinderPosition",10);P(this,"grinderSpeed",0);P(this,"isGrinding",!1);P(this,"selectedRail","left");P(this,"stoneAngle",{left:0,right:0});P(this,"stonePressure",{left:50,right:50});P(this,"stoneHeat",0);P(this,"overheatWarning",!1);P(this,"profileRendererRight");P(this,"angleValue");P(this,"pressureValue");P(this,"speedValue");P(this,"heatValue");P(this,"heatFill");P(this,"grindDotEl");P(this,"grindStatusEl");P(this,"leftRailLabel");P(this,"rightRailLabel");P(this,"segmentsEl");P(this,"accuracyEl");P(this,"deadlineBar");P(this,"deadlineTime");P(this,"angleValueR");P(this,"pressureValueR");P(this,"jobComplete",!1);P(this,"startTime",Date.now());P(this,"grinder");P(this,"grindLights",[]);P(this,"cameraAngle","chase");P(this,"smoothCamPos",new E(-3,5,-10));P(this,"smoothCamTarget",new E(0,1,12));P(this,"screenShake",0);P(this,"segmentGrindTime",new Float64Array(50));P(this,"segmentCompleted",[]);P(this,"segmentPasses",[]);P(this,"segmentDamage",[]);P(this,"segmentSlowOrder",[]);P(this,"lastSectionIndex",-1);P(this,"consecutiveCompleted",0);P(this,"trackRestoredFt",0);P(this,"overgrindCooldown",0);P(this,"deadlineTimer",0);P(this,"deadlineActive",!1);P(this,"deadlineTotal",0);P(this,"deadlineWarned",!1);P(this,"sectionsAtDeadlineStart",0);P(this,"revenueTrainProgress",0);P(this,"inspectionPass",!1);P(this,"inspectionTimer",0);P(this,"_tmpVec",new E);P(this,"_tmpVec2",new E);P(this,"_tmpVec3",new E);P(this,"_tmpQuat",new Be);P(this,"_tmpMat",new Qt);P(this,"_worldUp",new E(0,1,0));P(this,"totalMetalRemoved",0);P(this,"grindCount",0);P(this,"audioReady",!1);P(this,"ground");const t=document.getElementById("game-canvas");this.engine=new eg(t),this.input=new ng,this.profileRenderer=new tc("profile-left"),this.profileRendererRight=new tc("profile-right"),this.profileRendererRight.mirrored=!0,this.angleValue=document.getElementById("angle-value"),this.pressureValue=document.getElementById("pressure-value"),this.speedValue=document.getElementById("speed-display"),this.heatValue=document.getElementById("heat-value"),this.heatFill=document.getElementById("heat-fill"),this.grindDotEl=document.getElementById("grind-dot"),this.grindStatusEl=document.getElementById("grind-status"),this.leftRailLabel=document.getElementById("left-rail-label"),this.rightRailLabel=document.getElementById("right-rail-label"),this.segmentsEl=document.getElementById("segments-display"),this.accuracyEl=document.getElementById("accuracy-display"),this.deadlineBar=document.getElementById("deadline-bar"),this.deadlineTime=document.getElementById("deadline-time"),this.angleValueR=document.getElementById("angle-value-r"),this.pressureValueR=document.getElementById("pressure-value-r"),this.targetProfile={name:"AREMA 136RE Standard",points:ss.createAREMA136RE(),tolerance:.05};const e=[new E(0,0,-10),new E(0,0,20),new E(0,0,50),new E(0,0,80),new E(1,0,100),new E(3,0,115),new E(7,0,130),new E(12,0,145),new E(18,0,158),new E(25,0,170),new E(32,0,180),new E(40,0,190),new E(47,0,200),new E(52,0,212),new E(55,0,225),new E(55,0,240),new E(55,0,255),new E(53,0,270),new E(50,0,282),new E(46,0,295),new E(42,0,308),new E(38,0,320),new E(35,0,335),new E(34,0,350),new E(34,0,400),new E(34,0,450),new E(34,0,500),new E(34,0,550)];this.track=new Kl(e),Se=this.track.sectionCount,Re=this.track.totalLength,this.engine.scene.add(this.track.group),this.segmentCompleted=new Array(Se).fill(!1),this.segmentPasses=new Array(Se).fill(0),this.segmentDamage=new Array(Se).fill(0),this.segmentSlowOrder=new Array(Se).fill(!0),this.applyInitialDefects(),this.setSegmentDefectGlow(),this.assignSlowOrders(),this.environment=new ec(this.track),this.engine.scene.add(this.environment.group),this.createGround(),this.grinder=new gg,this.engine.scene.add(this.grinder.group);for(let i=0;i<4;i++){const s=new rs(16746547,0,8);this.engine.scene.add(s),this.grindLights.push(s)}this.dayNight=new xg(this.engine.scene,this.engine.directionalLight,this.engine.ambientLight,this.engine.renderer),this.dayNight.setGroundMesh(this.ground),this.sparkSystem=new Mg,this.engine.scene.add(this.sparkSystem.points),this.engine.scene.add(this.sparkSystem.sparkLight),this.audio=new yg,this.trackMap=new Tg,this.trackMap.init(Se),this.floatingScore=new wg,this.grindContact=new Sg,this.engine.scene.add(this.grindContact.group),this.passingTrain=new rc,this.passingTrain.setTrack(this.track),this.engine.scene.add(this.passingTrain.group),this.engine.scene.add(this.passingTrain.adjacentTrack),this.radioDispatch=new Ag,this.weather=new _g,this.engine.scene.add(this.weather.rainGroup),this.inspectionReport=new Rg,this.jobSelect=new Dg,this.guidedTutorial=new Eg,this.updateTrackMapDefects(),this.tutorial=new oc,this.startJobSelect(),this.engine.onUpdate(this.update.bind(this));const n=()=>{this.audioReady||(this.audio.init(),this.audioReady=!0,window.removeEventListener("keydown",n),window.removeEventListener("click",n))};window.addEventListener("keydown",n),window.addEventListener("click",n),this.profileRenderer.draw(this.track.getProfile(0),this.targetProfile),this.updateHUD()}applyInitialDefects(){const t=this.track.segmentCount,e=[{name:"gauge_corner",cx:-25,sigma:6,base:.18},{name:"gauge_shoulder",cx:-15,sigma:5,base:.12},{name:"crown_flat",cx:0,sigma:10,base:.08},{name:"crown_bump",cx:5,sigma:4,base:.1},{name:"field_transition",cx:15,sigma:5,base:.1},{name:"field_lip",cx:25,sigma:6,base:.14}];let n=42;const i=()=>(n=n*1103515245+12345&2147483647,n/2147483647);for(let s=0;s<t;s++){const o=Math.floor(s/Math.max(1,Math.round(t/Se))),a=this.currentJob?this.currentJob.defectSeverity:.6,l=this.isFirstJob&&o<2?.15:1,c=(.3+o/Se*.7)*a*l;for(const d of["left","right"]){const u=2+Math.floor(i()*3),f=[...e].sort(()=>i()-.5).slice(0,u);for(let y=0;y<f.length;y++){const p=f[y];d==="left"&&p.cx<0?f[y]={...p,base:p.base*(1+i()*.5)}:d==="right"&&p.cx>0&&(f[y]={...p,base:p.base*(1+i()*.5)})}const g=this.track.getProfile(s,d);for(const y of g.points)for(const p of f){const m=y.x-p.cx,x=p.base*c*Math.exp(-(m*m)/(2*p.sigma*p.sigma)),M=.7+i()*.6;y.y-=x*M}this.track.rebuildSegment(s,d)}}}setSegmentDefectGlow(){for(let t=0;t<this.track.segmentCount;t++)for(const e of["left","right"]){const i=this.track.getProfile(t,e).compare(this.targetProfile),s=Math.min(1,i.averageDeviation*8),o=e==="left"?this.track.leftSegments:this.track.rightSegments;t<o.length&&o[t].setDefectSeverity(s)}}assignSlowOrders(){const t=[];for(let n=0;n<Se;n++){const i=this.track.getSegmentsForSection(n);if(i.length===0)continue;const s=i[0],o=this.track.getProfile(s,"left").compare(this.targetProfile).averageDeviation,a=this.track.getProfile(s,"right").compare(this.targetProfile).averageDeviation;t.push({sec:n,sev:Math.max(o,a)})}t.sort((n,i)=>i.sev-n.sev);const e=Math.ceil(t.length*.45);this.segmentSlowOrder=new Array(Se).fill(!1);for(let n=0;n<e;n++)this.segmentSlowOrder[t[n].sec]=!0}updateTrackMapDefects(){for(let t=0;t<Se;t++){const e=this.track.getSegmentsForSection(t);if(e.length>0){const n=e[0],i=this.track.getProfile(n,"left").compare(this.targetProfile),s=this.track.getProfile(n,"right").compare(this.targetProfile),o=Math.max(i.averageDeviation,s.averageDeviation),a=Math.min(i.withinTolerance,s.withinTolerance);this.trackMap.updateSegment(t,{defectSeverity:Math.min(1,o*10),accuracy:a,slowOrder:this.segmentSlowOrder[t]})}}}createGround(){const t=new Di(800,800),e=new Lt({color:4876858,roughness:.95,metalness:0,map:mg()});this.ground=new Ft(t,e),this.ground.rotation.x=-Math.PI/2,this.ground.position.set(30,-.6,170),this.ground.receiveShadow=!0,this.engine.scene.add(this.ground)}update(t){if(this.input.wasKeyPressed("r")&&window.location.reload(),this.inspectionPass){this.handleInspectionPass(t),this.dayNight.update(t),this.grinder.update(t),this.input.endFrame();return}if(!this.gameStarted||this.jobComplete){this.input.endFrame();return}this.guidedTutorial.update(t,{isGrinding:this.isGrinding,speed:this.grinderSpeed,angleChanged:this.input.isKeyDown("q")||this.input.isKeyDown("e"),pressureChanged:this.input.isKeyDown("a")||this.input.isKeyDown("d"),tabPressed:this.input.wasKeyPressed("tab"),sectionsCompleted:this.segmentCompleted.filter(a=>a).length}).autoMove&&!this.isGrinding&&this.grinderSpeed<1.5&&(this.grinderSpeed=1.5),this.handleGrinderMovement(t),this.handleGrinding(t),this.handleCamera(t),this.dayNight.update(t),this.sparkSystem.update(t),this.grindContact.update(t),this.grinder.update(t);for(let a=0;a<this.track.segmentCount;a++)a<this.track.leftSegments.length&&(this.track.leftSegments[a].update(t),this.track.rightSegments[a].update(t));if(!this.isGrinding){const a=this.track.getSegmentIndex(this.grinderPosition),l=this.track.getSectionIndex(this.grinderPosition),c=this.segmentDamage[l]||0,d=this.segmentPasses[l]||0;for(const u of["left","right"]){const h=this.track.getProfile(a,u),f=u==="left"?this.profileRenderer:this.profileRendererRight;f.setWorstZones(h.findWorstZones(this.targetProfile,3)),f.setSegmentInfo(c,d),f.draw(h,this.targetProfile)}}if(this.audioReady){this.audio.setDieselSpeed(this.grinderSpeed);const a=this.track.getSectionIndex(this.grinderPosition),l=a>=0&&a<this.segmentCompleted.length&&this.segmentCompleted[a]?1:0;this.audio.updateWheelSound(this.grinderSpeed,t,l)}this.passingTrain.update(t,this.grinderPosition),this.radioDispatch.update(t),this.trackMap.setGrinderPosition(this.grinderPosition/Re);const n=this.track.getSectionIndex(this.grinderPosition);let i=-1,s=1/0;for(let a=0;a<Se;a++)if(!this.segmentCompleted[a]){const l=Math.abs(a-n);l<s&&(s=l,i=a)}this.trackMap.setNextTarget(i),this.trackMap.draw(),(this.dayNight.isNight||this.dayNight.isDusk)&&this.isGrinding&&(this.engine.renderer.toneMappingExposure+=(1.6-this.engine.renderer.toneMappingExposure)*3*t),this.handleDeadline(t);const o=this.track.getTrackPoint(this.grinderPosition);this.weather.update(t,o.position),this.input.wasKeyPressed("n")&&this.dayNight.cycleTime(),this.input.wasKeyPressed("p")&&this.weather.toggle(),this.input.wasKeyPressed("m")&&(this.audio.muted=!this.audio.muted),this.checkJobComplete(),this.updateHUD(),this.input.endFrame()}handleGrinderMovement(t){const e=this.track.getSectionIndex(this.grinderPosition),i=e>=0&&e<this.segmentSlowOrder.length&&this.segmentSlowOrder[e]?2:999;if(!this.isGrinding){const h=this.input.isKeyDown("shift")?3:1,f=Math.min(10*h,i*h),g=5*h,y=3;this.input.isKeyDown("w")||this.input.isKeyDown("arrowup")?this.grinderSpeed=Math.min(f,this.grinderSpeed+g*t):this.input.isKeyDown("s")||this.input.isKeyDown("arrowdown")?this.grinderSpeed=Math.max(-f/2,this.grinderSpeed-g*t):this.grinderSpeed>0?this.grinderSpeed=Math.max(0,this.grinderSpeed-y*t):this.grinderSpeed<0&&(this.grinderSpeed=Math.min(0,this.grinderSpeed+y*t))}this.grinderPosition+=this.grinderSpeed*t;const s=Re-75,o=0;this.grinderPosition=Math.max(o,Math.min(s,this.grinderPosition));const a=Math.min(this.grinderPosition-o,s-this.grinderPosition);if(a<20){const u=a/20;this.grinderSpeed*=u}this.grinder.group.position.set(0,0,0),this.grinder.group.quaternion.identity();const l=u=>Math.max(.1,Math.min(Re-.1,u));for(const u of this.grinder.cars){const h=this.grinderPosition+u.offset,f=this.track.getTrackPoint(l(h+u.halfLength)),g=this.track.getTrackPoint(l(h-u.halfLength));u.group.position.lerpVectors(g.position,f.position,.5);const y=this._tmpVec.subVectors(f.position,g.position).normalize(),p=this._tmpVec2.crossVectors(this._worldUp,y).normalize(),m=this._tmpVec3.crossVectors(y,p).normalize(),x=(f.bank+g.bank)*.5;Math.abs(x)>.001&&(this._tmpQuat.setFromAxisAngle(y,x),p.applyQuaternion(this._tmpQuat),m.applyQuaternion(this._tmpQuat)),u.group.quaternion.setFromRotationMatrix(this._tmpMat.makeBasis(p,m,y))}this.input.wasKeyPressed("tab")&&(this.selectedRail=this.selectedRail==="left"?"right":"left");const c=this.selectedRail,d=c==="right"?-1:1;this.input.isKeyDown("q")&&(this.stoneAngle[c]=Math.max(-40,this.stoneAngle[c]-60*d*t)),this.input.isKeyDown("e")&&(this.stoneAngle[c]=Math.min(40,this.stoneAngle[c]+60*d*t)),this.input.isKeyDown("a")&&(this.stonePressure[c]=Math.max(0,this.stonePressure[c]-80*t)),this.input.isKeyDown("d")&&(this.stonePressure[c]=Math.min(100,this.stonePressure[c]+80*t)),this.updateStonePanel(),this.input.wasKeyPressed("1")&&(this.cameraAngle="chase"),this.input.wasKeyPressed("2")&&(this.cameraAngle="side"),this.input.wasKeyPressed("3")&&(this.cameraAngle="cab"),this.input.wasKeyPressed("4")&&(this.cameraAngle="overview"),this.input.wasKeyPressed("5")&&(this.cameraAngle="grind")}handleGrinding(t){const e=this.track.getSectionIndex(this.grinderPosition),n=this.track.getSegmentIndex(this.grinderPosition);this.stoneHeat=Math.max(0,this.stoneHeat-10*t),this.overheatWarning=this.stoneHeat>80,this.isGrinding=this.input.isKeyDown(" ");for(const M of["left","right"]){const S=M==="left"?this.profileRenderer:this.profileRendererRight;S.setStoneContact(this.stoneAngle[M]*.7,10+(100-this.stonePressure[M])*.08,this.stonePressure[M],!0,this.isGrinding),S.setPreview(null)}if(!this.isGrinding){this.grinder.setGrinding(!1),this.sparkSystem.stopEmitting(),this.grindContact.setInactive();const M=[-42,-6,18,67];for(let S=0;S<this.grindLights.length;S++){const C=Math.max(.1,Math.min(Re-.1,this.grinderPosition+M[S])),w=this.track.getTrackPoint(C);this.grindLights[S].position.copy(w.position),this.grindLights[S].position.y+=2.5,this.grindLights[S].intensity=S===0?4:1.5}this.audio.stopGrinding();return}const i=2;this.grinderSpeed=i;const s=(this.stonePressure.left+this.stonePressure.right)/2;this.stoneHeat=Math.min(100,this.stoneHeat+s*.12*t);const o=this.stoneHeat>80?.5:this.stoneHeat>60?.8:1;for(const M of["left","right"]){const S=this.stoneAngle[M],C=this.stonePressure[M],w=S*.7,R=10+(100-C)*.08,v=(.005+C*2e-4)*o*t,A=this.track.getProfile(n,M);A.removeMetalAt(w,R,v),this.track.rebuildSegment(n,M),this.totalMetalRemoved+=v,A.getDeviationAtX(w,this.targetProfile)<-this.targetProfile.tolerance&&(this.overgrindCooldown=Math.max(0,this.overgrindCooldown-t),this.overgrindCooldown<=0&&(this.overgrindCooldown=1,this.segmentDamage[e]=Math.max(this.segmentDamage[e]||0,A.countOverground(this.targetProfile)),(M==="left"?this.profileRenderer:this.profileRendererRight).flashBorder(),this.screenShake=.06,this.audioReady&&this.audio.playOvergrindAlarm()))}this.grindCount++,this.segmentGrindTime[e]+=t,e!==this.lastSectionIndex&&(this.lastSectionIndex>=0&&this.segmentPasses[this.lastSectionIndex]++,this.lastSectionIndex=e);const a=Math.min(1,this.segmentGrindTime[e]/5),l=this.track.getSegmentsForSection(e);for(const M of l)M<this.track.leftSegments.length&&(this.track.leftSegments[M].setGrindProgress(a),this.track.rightSegments[M].setGrindProgress(a));const c=this.segmentDamage[e]||0,d=this.segmentPasses[e]||0;for(const M of["left","right"]){const S=this.track.getProfile(n,M),C=M==="left"?this.profileRenderer:this.profileRendererRight;C.setWorstZones(S.findWorstZones(this.targetProfile,3)),C.setSegmentInfo(c,d),C.draw(S,this.targetProfile)}const u=this.track.getProfile(n,"left"),h=this.track.getProfile(n,"right"),f=Math.min(u.compare(this.targetProfile).withinTolerance,h.compare(this.targetProfile).withinTolerance);this.trackMap.updateSegment(e,{grindProgress:a,accuracy:f,slowOrder:this.segmentSlowOrder[e]}),f>.8&&!this.segmentCompleted[e]&&this.completeSegment(e,f);const g=[-12,0,12,24],y=[];for(const M of g)for(let S=0;S<8;S++){const C=-4.5+S*1.3,w=Math.max(.1,Math.min(Re-.1,this.grinderPosition+M+C)),R=this.track.getTrackPoint(w);y.push({position:R.position.clone(),forward:R.forward.clone(),right:R.right.clone()})}const p=[-42,-6,18,67];for(let M=0;M<this.grindLights.length;M++){const S=Math.max(.1,Math.min(Re-.1,this.grinderPosition+p[M])),C=this.track.getTrackPoint(S);this.grindLights[M].position.copy(C.position),this.grindLights[M].position.y+=2.5,this.grindLights[M].intensity=M===0?4:s/50*(1.5+Math.random())}this.sparkSystem.setEmitPoints(y,s/50),this.grinder.setGrinding(!0);const m=Math.max(.1,Math.min(Re-.1,this.grinderPosition+6)),x=this.track.getTrackPoint(m);this.grindContact.setActive(x.position,s),this.screenShake=.01+s/100*.02,this.audioReady&&this.audio.startGrinding(s/80),Ug.emit("grind-contact",{sectionIndex:e}),this.tutorial.notifyEvent("grind-contact")}handleDeadline(t){if(this.guidedTutorial.active)return;if(!this.deadlineActive){this.deadlineTimer+=t,this.trackMap.setRevenueTrainPosition(-1),this.deadlineTimer>30&&(this.deadlineActive=!0,this.deadlineTotal=120+Math.random()*120,this.deadlineTimer=this.deadlineTotal,this.deadlineWarned=!1,this.revenueTrainProgress=0,this.sectionsAtDeadlineStart=this.segmentCompleted.filter(a=>a).length,this.deadlineBar.style.display="flex",this.audioReady&&this.audio.playDing());return}this.deadlineTimer-=t;const e=Math.max(0,this.deadlineTimer),n=Math.floor(e/60),i=Math.floor(e%60);this.deadlineTime.textContent=`${n}:${i.toString().padStart(2,"0")}`,this.revenueTrainProgress=1-e/this.deadlineTotal;const s=this.grinderPosition/Re,o=1-this.revenueTrainProgress*(1-s);if(this.trackMap.setRevenueTrainPosition(o),e<30?(this.deadlineTime.style.color="var(--ui-red)",this.deadlineBar.style.borderColor="rgba(255,50,50,0.5)"):e<60?(this.deadlineTime.style.color="var(--ui-accent)",this.deadlineBar.style.borderColor="rgba(255,100,0,0.3)"):(this.deadlineTime.style.color="var(--ui-accent)",this.deadlineBar.style.borderColor="rgba(255,100,0,0.2)"),e<30&&!this.deadlineWarned&&(this.deadlineWarned=!0,this.audioReady&&this.audio.playOvergrindAlarm()),e<=0){this.deadlineActive=!1,this.deadlineTimer=0,this.deadlineBar.style.display="none",this.trackMap.setRevenueTrainPosition(-1);const a=this.segmentCompleted.filter(l=>l).length-this.sectionsAtDeadlineStart;a>0?this.floatingScore.show(`${a} sections cleared!`,"#44ff44"):this.floatingScore.show("TRAIN PASSED — NO SECTIONS CLEARED","#ff4444"),this.audioReady&&this.audio.playSegmentComplete()}}completeSegment(t,e){const n=this.segmentSlowOrder[t];this.segmentCompleted[t]=!0,this.segmentSlowOrder[t]=!1,this.consecutiveCompleted++;const i=this.segmentPasses[t]||1,s=this.segmentDamage[t]||0,o=e/(1+i*.12+s*.05),a=o>.8?3:o>.6?2:1,l=Math.round(Re/Se*3.281);this.trackRestoredFt+=l;const c=this.track.getSegmentsForSection(t);for(const d of c)d<this.track.leftSegments.length&&(this.track.leftSegments[d].flashComplete(),this.track.rightSegments[d].flashComplete());this.floatingScore.showSegmentComplete(t+1,a,l),this.consecutiveCompleted>1&&setTimeout(()=>this.floatingScore.showStreak(this.consecutiveCompleted),400),n&&setTimeout(()=>{this.floatingScore.show("SLOW ORDER LIFTED","#44ff44",window.innerWidth/2,window.innerHeight/2-60),setTimeout(()=>{this.floatingScore.show("TRACK SPEED 60 MPH","#ffffff",window.innerWidth/2,window.innerHeight/2-30)},300)},600),this.trackMap.updateSegment(t,{completed:!0,slowOrder:!1}),this.audioReady&&this.audio.playSegmentComplete(),this.screenShake=.05}handleCamera(t){const e=this.engine.camera,n=4*t,i=this.track.getTrackPoint(this.grinderPosition),s=this.track.getTrackPoint(Math.min(this.grinderPosition+15,Re-1));let o,a;switch(this.cameraAngle){case"chase":o=i.position.clone().add(i.forward.clone().multiplyScalar(-12)).add(i.right.clone().multiplyScalar(-3)).add(new E(0,5,0)),a=s.position.clone().add(new E(0,1,0));break;case"side":o=i.position.clone().add(i.right.clone().multiplyScalar(10)).add(new E(0,3,0)),a=i.position.clone().add(new E(0,1,0));break;case"cab":o=i.position.clone().add(i.forward.clone().multiplyScalar(-7)).add(new E(0,3,0)),a=s.position.clone().add(new E(0,.5,0));break;case"overview":o=i.position.clone().add(i.forward.clone().multiplyScalar(-15)).add(i.right.clone().multiplyScalar(-8)).add(new E(0,25,0)),a=s.position.clone();break;case"grind":{const l=this.track.getTrackPoint(Math.max(.1,Math.min(Re-.1,this.grinderPosition+2)));o=l.position.clone().add(l.right.clone().multiplyScalar(2.5)).add(new E(0,.8,0)),a=l.position.clone().add(l.forward.clone().multiplyScalar(1)).add(new E(0,0,0));break}}this.smoothCamPos.lerp(o,n),this.smoothCamTarget.lerp(a,n),e.position.copy(this.smoothCamPos),this.screenShake>.001&&(e.position.x+=(Math.random()-.5)*this.screenShake,e.position.y+=(Math.random()-.5)*this.screenShake,this.screenShake*=.9),e.lookAt(this.smoothCamTarget)}updateHUD(){const t=this.track.getSegmentIndex(this.grinderPosition),e=this.track.getProfile(t,"left"),n=this.track.getProfile(t,"right"),i=e.compare(this.targetProfile).withinTolerance,s=n.compare(this.targetProfile).withinTolerance,o=(Math.min(i,s)*100).toFixed(0),a=this.segmentCompleted.filter(l=>l).length;this.segmentsEl.textContent=`${a}/${Se}`,this.accuracyEl.textContent=`${o}%`,this.accuracyEl.style.color=Number(o)>80?"var(--ui-green)":Number(o)>50?"var(--ui-accent)":"var(--ui-red)"}updateStonePanel(){const t=this.selectedRail,e=this.stoneAngle[t],n=this.stonePressure[t];this.angleValue.innerHTML=`${e.toFixed(0)}&deg;`,this.pressureValue.textContent=`${n.toFixed(0)}%`,t==="left"?(this.angleValueR.innerHTML=`${this.stoneAngle.right.toFixed(0)}&deg;`,this.pressureValueR.textContent=`${this.stonePressure.right.toFixed(0)}%`):(this.angleValue.innerHTML=`${this.stoneAngle.left.toFixed(0)}&deg;`,this.pressureValue.textContent=`${this.stonePressure.left.toFixed(0)}%`,this.angleValueR.innerHTML=`${e.toFixed(0)}&deg;`,this.pressureValueR.textContent=`${n.toFixed(0)}%`);const i=Math.abs(this.grinderSpeed*2.237);this.speedValue.textContent=i.toFixed(1),this.heatValue.textContent=`${this.stoneHeat.toFixed(0)}%`,this.heatFill.style.height=`${this.stoneHeat}%`,this.heatFill.style.background=this.stoneHeat>80?"var(--ui-red)":this.stoneHeat>60?"var(--ui-accent)":"var(--ui-green)",this.isGrinding?(this.grindDotEl.className=this.overheatWarning?"dot red":"dot orange",this.grindStatusEl.textContent=this.overheatWarning?"OVERHEAT":"GRINDING"):(this.grindDotEl.className="dot green",this.grindStatusEl.textContent="DRIVING"),this.leftRailLabel.style.color=t==="left"?"var(--ui-accent)":"var(--ui-dim)",this.rightRailLabel.style.color=t==="right"?"var(--ui-accent)":"var(--ui-dim)",this.leftRailLabel.style.fontWeight=t==="left"?"700":"400",this.rightRailLabel.style.fontWeight=t==="right"?"700":"400"}checkJobComplete(){if(this.jobComplete)return;this.segmentCompleted.filter(e=>e).length>=Se&&(this.jobComplete=!0,this.startInspectionPass())}startInspectionPass(){this.inspectionPass=!0,this.inspectionTimer=0,this.grinderSpeed=0,this.grinderPosition=10,this.floatingScore.show("INSPECTION PASS","#44ff44"),this.audioReady&&this.audio.playSegmentComplete(),this.deadlineBar.style.display="none",this.deadlineActive=!1}handleInspectionPass(t){if(!this.inspectionPass)return;this.inspectionTimer+=t,this.grinderSpeed=6,this.grinderPosition+=this.grinderSpeed*t,this.grinderPosition=Math.min(Re-75,this.grinderPosition);const e=this.engine.camera,n=this.track.getTrackPoint(this.grinderPosition),i=this.track.getTrackPoint(Math.min(this.grinderPosition+10,Re-1)),s=this.inspectionTimer*.3,o=6,a=n.position.x+Math.sin(s)*o+n.right.x*Math.cos(s)*o,l=n.position.z+Math.cos(s)*o+n.right.z*Math.cos(s)*o;e.position.set(a,1.5+Math.sin(this.inspectionTimer*.5)*.5,l),e.lookAt(i.position.x,.2,i.position.z);const c=d=>Math.max(.1,Math.min(Re-.1,d));for(const d of this.grinder.cars){const u=this.track.getTrackPoint(c(this.grinderPosition+d.offset+d.halfLength)),h=this.track.getTrackPoint(c(this.grinderPosition+d.offset-d.halfLength));d.group.position.lerpVectors(h.position,u.position,.5);const f=this._tmpVec.subVectors(u.position,h.position).normalize(),g=this._tmpVec2.crossVectors(this._worldUp,f).normalize(),y=this._tmpVec3.crossVectors(f,g).normalize();d.group.quaternion.setFromRotationMatrix(this._tmpMat.makeBasis(g,y,f))}this.grinderPosition>Re-80&&(this.inspectionPass=!1,setTimeout(()=>this.showCompletionReport(),1e3))}showCompletionReport(){const t=this.inspectionReport.computeJobReport(this.track,this.targetProfile),e=(Date.now()-this.startTime)/1e3,n=this.segmentCompleted.filter(o=>o).length,i=t.overallRQI,s=i>=95?5:i>=85?4:i>=75?3:i>=60?2:1;this.inspectionReport.showCompletionReport({...t,sectionsCompleted:n,trackRestoredFt:this.trackRestoredFt,elapsedTime:e,metalRemoved:this.totalMetalRemoved,stars:s,rqiBefore:this.preJobRQI,rqiAfter:i}).then(()=>{this.startJobSelect()})}startJobSelect(){this.gameStarted=!1,this.jobComplete=!1,this.guidedTutorial.setReplay(),this.isFirstJob=!1,this.jobSelect.show().then(t=>{this.currentJob=t,this.rebuildForJob(t)})}rebuildForJob(t){this.track&&(this.engine.scene.remove(this.track.group),this.track.dispose()),this.environment&&this.engine.scene.remove(this.environment.group),this.passingTrain&&(this.engine.scene.remove(this.passingTrain.group),this.engine.scene.remove(this.passingTrain.adjacentTrack)),this.track=new Kl(t.trackPoints,void 0,t.sections),Se=this.track.sectionCount,Re=this.track.totalLength,this.engine.scene.add(this.track.group),this.segmentCompleted=new Array(Se).fill(!1),this.segmentPasses=new Array(Se).fill(0),this.segmentDamage=new Array(Se).fill(0),this.segmentSlowOrder=new Array(Se).fill(!0),this.segmentGrindTime=new Float64Array(50),this.totalMetalRemoved=0,this.trackRestoredFt=0,this.grindCount=0,this.grinderPosition=10,this.grinderSpeed=0,this.lastSectionIndex=-1,this.consecutiveCompleted=0,this.stoneAngle={left:0,right:0},this.stonePressure={left:50,right:50},this.stoneHeat=0,this.applyInitialDefects(),this.setSegmentDefectGlow(),this.environment=new ec(this.track),this.engine.scene.add(this.environment.group),this.passingTrain=new rc,this.passingTrain.setTrack(this.track),this.engine.scene.add(this.passingTrain.group),this.engine.scene.add(this.passingTrain.adjacentTrack);const e=["dawn","day","dusk","night"];this.dayNight.setTime(e[t.timeOfDay]||"day"),this.ground.position.set(30,-.6,Re/2),this.trackMap.init(Se),this.updateTrackMapDefects();const n=this.inspectionReport.computeJobReport(this.track,this.targetProfile);this.preJobRQI=n.overallRQI;const i=()=>{this.gameStarted=!0,this.jobComplete=!1,this.startTime=Date.now(),this.deadlineTimer=0,this.deadlineActive=!1,this.tutorial=new oc};this.guidedTutorial.isFirstJob()?i():this.inspectionReport.showPreJobReport(n).then(i)}}const Hs=document.getElementById("title-screen");Hs.addEventListener("click",()=>{Hs.style.transition="opacity 0.5s",Hs.style.opacity="0",setTimeout(()=>{Hs.style.display="none";try{console.log("[STAYING ON TRACK] Starting game...");const r=new Fg;console.log("[STAYING ON TRACK] Game running. Track length:",r),window.game=r}catch(r){console.error("[STAYING ON TRACK] Failed to start:",r),document.body.innerHTML=`
        <div style="color: #ff4444; font-family: monospace; padding: 40px;">
          <h2>Error starting game</h2>
          <pre>${r instanceof Error?r.stack:r}</pre>
        </div>
      `}},500)},{once:!0});
