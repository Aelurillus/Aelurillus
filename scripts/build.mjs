import fs from 'node:fs';
import {createRequire} from 'node:module';
import * as fontkit from 'fontkit';
const require=createRequire(import.meta.url);
fs.mkdirSync('docs/vendor',{recursive:true});fs.mkdirSync('assets',{recursive:true});
for(const f of ['index.html','style.css','main.js'])fs.copyFileSync('src/'+f,'docs/'+f);
for(const f of ['gsap.min.js','ScrollTrigger.min.js'])fs.copyFileSync('node_modules/gsap/dist/'+f,'docs/vendor/'+f);
for(const [pkg,name,weight] of [['barlow-condensed','display',800],['manrope','body',400]]){
fs.copyFileSync(`node_modules/@fontsource/${pkg}/files/${pkg}-latin-${weight}-normal.woff2`,`docs/vendor/${name}.woff2`);
fs.copyFileSync(`node_modules/@fontsource/${pkg}/LICENSE`,`docs/vendor/${pkg}-LICENSE.txt`);
}
fs.writeFileSync('docs/vendor/gsap-LICENSE.txt','GSAP 3.15.0 - Standard License: https://gsap.com/standard-license/ - Copyright GreenSock. Original license headers preserved in vendor scripts.');
fs.writeFileSync('docs/CNAME','imqian.cc\n');fs.writeFileSync('docs/.nojekyll','');
const bold=fontkit.openSync('node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-800-normal.woff');
const body=fontkit.openSync('node_modules/@fontsource/manrope/files/manrope-latin-400-normal.woff');
function text(s,x,y,size,color,font=body){const run=font.layout(s);let pos=0;let p='';for(let i=0;i<run.glyphs.length;i++){const g=run.glyphs[i],q=run.positions[i];p+=`<path d="${g.path.toSVG()}" transform="translate(${x+(pos+q.xOffset)*size/font.unitsPerEm} ${y-q.yOffset*size/font.unitsPerEm}) scale(${size/font.unitsPerEm} ${-size/font.unitsPerEm})" fill="${color}"/>`;pos+=q.xAdvance;}return p;}
let svg=`<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1020" viewBox="0 0 1200 1020" role="img" aria-labelledby="title desc"><title id="title">ItzMing — personal space</title><desc id="desc">nothing wanna do. GitHub Aelurillus, Telegram Mingawa, Bilibili 5401610, Steam, Discord. Visit imqian.cc.</desc><rect width="1200" height="1020" rx="40" fill="#101110"/><path d="M32 80H1168M32 370H1168" stroke="#454643"/>`;
svg+=text('PERSONAL SPACE',38,55,18,'#fff')+text('IMQIAN.CC  /  01',970,55,16,'#aeb1a8')+text('ITZMING',30,315,290,'#f5f4ec',bold)+text('nothing wanna do',40,352,20,'#bec0b8');
svg+='<rect x="24" y="398" width="1152" height="550" rx="32" fill="#f5f4ec"/>';
const cards=[['01','GitHub','Aelurillus','#2459f5','#fff'],['02','Telegram','@Mingawa','#a9befb','#101110'],['03','Bilibili','5401610','#fff0d7','#101110'],['04','Steam','Find me in game','#a9befb','#101110'],['05','Discord','Join the conversation','#171817','#fff'],['06','Explore','imqian.cc','#2459f5','#fff']];
for(let i=0;i<6;i++){let [n,title,sub,bg,fg]=cards[i],x=40+(i%3)*378,y=414+Math.floor(i/3)*259;svg+=`<rect x="${x}" y="${y}" width="364" height="245" rx="24" fill="${bg}"/><path d="M${x+22} ${y+57}H${x+342}" stroke="${fg}" opacity=".28"/><path d="M${x+315} ${y+25}h21v21m0-21-24 24" stroke="${fg}" fill="none" stroke-width="2"/>`+text(n,x+22,y+39,16,fg)+text(title,x+22,y+143,58,fg,bold)+text(sub,x+22,y+207,18,fg);}
svg+=text('A FEW PLACES TO FIND ME.',40,987,15,'#b6b8b0')+text('OPEN THE FULL EXPERIENCE  ↗',880,987,15,'#f5f4ec')+'</svg>';
fs.writeFileSync('assets/profile-card.svg',svg);
fs.writeFileSync('README.md','[![ItzMing — personal space](assets/profile-card.svg)](https://imqian.cc)\n\n[Website](https://imqian.cc) · [GitHub](https://github.com/Aelurillus) · [Telegram](https://t.me/Mingawa) · [Bilibili](https://space.bilibili.com/5401610) · [Steam](https://steamcommunity.com/profiles/76561199634129272/) · [Discord](https://discord.gg/nqVav26j)\n');
console.log('Built docs/ and self-contained profile SVG.');

