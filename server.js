const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');
const DATA_FILE = path.join(DATA_DIR, 'state.json');
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

const initial = {
  people: [
    { id:'P001', name:'Alex Morgan', age:28, group:'Adult', heartRate:72, breathingRate:16, confidence:94, risk:'LOW', pose:'Standing', room:'Room A', status:'Active' },
    { id:'P002', name:'Maya Chen', age:9, group:'Child', heartRate:88, breathingRate:20, confidence:89, risk:'LOW', pose:'Sitting', room:'Room B', status:'Active' },
    { id:'P003', name:'Robert Hayes', age:68, group:'Older adult', heartRate:68, breathingRate:17, confidence:86, risk:'MEDIUM', pose:'Lying', room:'Room C', status:'Active' },
    { id:'P004', name:'Sam Taylor', age:42, group:'Adult', heartRate:78, breathingRate:18, confidence:91, risk:'LOW', pose:'Walking', room:'Room D', status:'Active' }
  ],
  alerts: [
    { id:'AL-1042', time:new Date(Date.now()-1000*60*12).toISOString(), personId:'P003', personName:'Robert Hayes', level:'MEDIUM', title:'Unusual inactivity pattern', detail:'Simulated scenario: extended inactivity detected.', status:'Acknowledged' },
    { id:'AL-1041', time:new Date(Date.now()-1000*60*44).toISOString(), personId:'P004', personName:'Sam Taylor', level:'LOW', title:'Confidence reduced', detail:'Sample confidence dipped below the preferred threshold.', status:'Resolved' }
  ],
  history: []
};
function load() {
  try { return JSON.parse(fs.readFileSync(DATA_FILE, 'utf8')); }
  catch { fs.mkdirSync(DATA_DIR, {recursive:true}); fs.writeFileSync(DATA_FILE, JSON.stringify(initial,null,2)); return structuredClone(initial); }
}
let state = load();
function save(){ fs.writeFileSync(DATA_FILE, JSON.stringify(state,null,2)); }
const risks = ['LOW','MEDIUM','HIGH','CRITICAL'];
const scenarios = {
  normal: { title:'Normal monitoring', risk:'LOW', hr:[65,85], br:[12,19], confidence:[88,98], pose:'Standing', detail:'Stable simulated pattern.' },
  inactivity: { title:'Extended inactivity', risk:'MEDIUM', hr:[58,78], br:[12,20], confidence:[78,92], pose:'Lying', detail:'Simulated prolonged inactivity pattern.' },
  irregular: { title:'Irregular pattern', risk:'HIGH', hr:[98,126], br:[22,30], confidence:[68,84], pose:'Sitting', detail:'Simulated irregular movement/vital pattern; not a diagnosis.' },
  fall: { title:'Fall-like event', risk:'CRITICAL', hr:[90,118], br:[22,32], confidence:[72,89], pose:'Fallen', detail:'Simulated fall-like event for demonstration only.' }
};
function between(a,b){ return Math.floor(Math.random()*(b-a+1))+a; }
app.get('/api/health', (req,res)=>res.json({ok:true, app:'AirPulse+', mode:'SIMULATED_DEMO'}));
app.get('/api/people', (req,res)=>res.json(state.people));
app.get('/api/people/:id', (req,res)=>{ const p=state.people.find(x=>x.id===req.params.id); p?res.json(p):res.status(404).json({error:'Person not found'}); });
app.get('/api/alerts', (req,res)=>res.json(state.alerts.slice().sort((a,b)=>new Date(b.time)-new Date(a.time))));
app.get('/api/history', (req,res)=>res.json(state.history.slice(-80)));
app.post('/api/simulate', (req,res)=>{
  const { personId, scenario='normal', pose } = req.body || {};
  const person=state.people.find(p=>p.id===personId);
  if(!person) return res.status(404).json({error:'Person not found'});
  const cfg=scenarios[scenario] || scenarios.normal;
  person.heartRate=between(...cfg.hr); person.breathingRate=between(...cfg.br);
  person.confidence=between(...cfg.confidence); person.risk=cfg.risk;
  person.pose=pose || cfg.pose; person.status='Active';
  const record={time:new Date().toISOString(), personId:person.id, personName:person.name, heartRate:person.heartRate, breathingRate:person.breathingRate, confidence:person.confidence, risk:person.risk, pose:person.pose, scenario};
  state.history.push(record); if(state.history.length>300) state.history=state.history.slice(-300);
  if(['HIGH','CRITICAL','MEDIUM'].includes(person.risk)){
    const alert={id:'AL-'+Date.now().toString().slice(-6),time:record.time,personId:person.id,personName:person.name,level:person.risk,title:cfg.title,detail:cfg.detail+' Readings are simulated.',status:'New'};
    state.alerts.unshift(alert); state.alerts=state.alerts.slice(0,100);
  }
  save(); res.json({person, record, alerts:state.alerts.slice(0,20)});
});
app.post('/api/alerts/:id/acknowledge',(req,res)=>{
  const alert=state.alerts.find(a=>a.id===req.params.id);
  if(!alert) return res.status(404).json({error:'Alert not found'});
  alert.status='Acknowledged'; save(); res.json(alert);
});
app.post('/api/reset',(req,res)=>{ state=structuredClone(initial); save(); res.json({ok:true, message:'Demo data reset.'}); });
app.get('*',(req,res)=>res.sendFile(path.join(__dirname,'public','index.html')));
app.listen(PORT,()=>console.log(`AirPulse+ running at http://localhost:${PORT}`));
