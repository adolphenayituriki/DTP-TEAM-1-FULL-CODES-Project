const store = {
      get(key, fallback){ try{ return JSON.parse(localStorage.getItem(key)) ?? fallback }catch{ return fallback } },
      set(key, val){ localStorage.setItem(key, JSON.stringify(val)) }
}
    // Seed data for demo
const seed = () => ({
      workers:[
            {id:crypto.randomUUID(), name:"Mukamana Alice", phone:"0788 111 222", code:"ABJ-045", gender:"Female", village:"Kigarama", cell:"Birama", sector:"Kigarama", notes:"Covers 120 households"},
            {id:crypto.randomUUID(), name:"Ndayishimiye Jean", phone:"0788 333 444", code:"ABJ-081", gender:"Male", village:"Rugerero", cell:"Kirwa", sector:"Nyamirambo", notes:"Nutrition lead"},
            {id:crypto.randomUUID(), name:"Uwase Carine", phone:"0788 555 666", code:"ABJ-099", gender:"Female", village:"Ruhango", cell:"Kazi", sector:"Kacyiru", notes:"Focus on under-5"}
      ],
      items:[
            {id:crypto.randomUUID(), name:"Shisha Kibondo", stock:120, min:20},
            {id:crypto.randomUUID(), name:"Inzitiramibu (ITNs)", stock:80, min:15},
            {id:crypto.randomUUID(), name:"Vitamin A", stock:60, min:10},
            {id:crypto.randomUUID(), name:"Deworming Tablets", stock:50, min:10}
      ],
      distributions:[
            {id:crypto.randomUUID(), date:new Date().toISOString().slice(0,10), workerId:null, child:"Iradukunda Aimee", age:18, item:"Shisha Kibondo", qty:1, village:"Kigarama", notes:""}
      ]
})

const db = {
      load(){
            let data = store.get('healthAidDB')
            if(!data){ data = seed();
          // link first distribution's worker to first worker
            data.distributions[0].workerId = data.workers[0].id;
            store.set('healthAidDB', data);
      }
            return data
      },
      save(data){ store.set('healthAidDB', data) }
}
const state = { data: db.load(), view:'dashboard' }

const ui = {
      qs:(sel,el=document)=>el.querySelector(sel),
      qsa:(sel,el=document)=>[...el.querySelectorAll(sel)],
      switchView(e){ e?.preventDefault(); ui.qsa('.nav-link').forEach(a=>a.classList.remove('active')); e.currentTarget?.classList.add('active');
            const target = e?.currentTarget?.dataset.target || 'dashboard';
            state.view = target;
            ui.qsa('main > section').forEach(s=> s.id === 'view-'+target ? s.hidden=false : s.hidden=true);
            if(target==='workers'){ ui.renderWorkersFilters(); ui.renderWorkers(); }
            if(target==='distribute'){ ui.refreshDistributionForm(); ui.renderDistributions(); }
            if(target==='inventory'){ ui.renderInventory(); }
            if(target==='reports'){ reports.render(); }
            if(target==='dashboard'){ dashboard.render(); }
      },
openNotifications(){
      const low = inventory.lowStock();
      const count = low.length;
      ui.qs('#notifCount').textContent = count;
      ui.toast(count ? `Low stock: ${low.map(i=>i.name+" ("+i.stock+")").join(', ')}` : 'No new alerts');
},
openQuickDistribution(){
      const d = document.getElementById('quickDist');
      ui.fillWorkerOptions('qdWorker');
      ui.fillItemOptions('qdItem');
      d.showModal();
},
toast(msg){
      const wrap = ui.qs('#toasts');
      const el = document.createElement('div'); el.className = 'toast'; el.role='status'; el.textContent = msg;
      wrap.appendChild(el); setTimeout(()=> el.remove(), 3800)
},
renderWorkersFilters(){
      const sectors = Array.from(new Set(state.data.workers.map(w=>w.sector))).sort();
      const sel = ui.qs('#workerFilterSector');
      sel.innerHTML = '<option value="">All sectors</option>' + sectors.map(s=>`<option>${s}</option>`).join('');
},
renderWorkers(){
      const q = ui.qs('#workerSearch').value?.toLowerCase() || '';
      const sector = ui.qs('#workerFilterSector').value || '';
      const rows = state.data.workers
            .filter(w => (!sector || w.sector===sector))
            .filter(w => JSON.stringify(w).toLowerCase().includes(q))
            .map(w=>`<tr>
                  <td>${w.name}</td>
                  <td><a href="tel:${w.phone}">${w.phone}</a></td>
                  <td><span class="badge-pill">${w.code}</span></td>
                  <td>${w.village}</td>
                  <td>${w.cell}</td>
                  <td>${w.sector}</td>
                  <td>
                  <button class="btn ghost" onclick='handlers.editWorker("${w.id}")'>Edit</button>
                  <button class="btn danger" onclick='handlers.deleteWorker("${w.id}")'>Delete</button>
                  </td>
            </tr>`).join('') || '<tr><td colspan="7">No workers found.</td></tr>';
            ui.qs('#workerBody').innerHTML = rows;
      },
      refreshDistributionForm(){ ui.fillWorkerOptions('dWorker'); ui.fillItemOptions('dItem'); ui.qs('#dDate').value = new Date().toISOString().slice(0,10) },
      fillWorkerOptions(id){
      const sel = ui.qs('#'+id);
      sel.innerHTML = '<option value="" disabled selected hidden>Select…</option>' + state.data.workers.map(w=>`<option value="${w.id}">${w.name} · ${w.village}</option>`).join('');
      },
      fillItemOptions(id){
            const sel = ui.qs('#'+id);
            sel.innerHTML = '<option value="" disabled selected hidden>Select…</option>' + state.data.items.map(i=>`<option value="${i.name}">${i.name} (stock: ${i.stock})</option>`).join('');
            // also for filter dropdown
            if(id==='dItem'){
                  const filter = ui.qs('#distFilterItem');
                  filter.innerHTML = '<option value="">All items</option>' + state.data.items.map(i=>`<option>${i.name}</option>`).join('');
            }
      },
      renderDistributions(){
            const q = ui.qs('#distSearch').value?.toLowerCase() || '';
            const item = ui.qs('#distFilterItem').value || '';
            const rows = state.data.distributions
                  .filter(d => (!item || d.item===item))
                  .filter(d => JSON.stringify(d).toLowerCase().includes(q))
                  .sort((a,b)=> b.date.localeCompare(a.date))
                  .map(d=>{
            const w = state.data.workers.find(x=>x.id===d.workerId);
            return `<tr>
                  <td>${d.date}</td>
                  <td>${w? w.name: '—'}</td>
                  <td>${d.child}</td>
                  <td>${d.item}</td>
                  <td>${d.qty}</td>
                  <td>${d.village}</td>
                  <td>
                        <button class="btn ghost" onclick='handlers.editDistribution("${d.id}")'>Edit</button>
                        <button class="btn danger" onclick='handlers.deleteDistribution("${d.id}")'>Delete</button>
                  </td>
            </tr>`
            }).join('') || '<tr><td colspan="7">No distributions yet.</td></tr>';
      ui.qs('#distBody').innerHTML = rows;
      },
      renderInventory(){
            const rows = state.data.items.map(i=>{
                  const status = i.stock <= i.min ? `<span class="badge-pill" style="color:var(--danger)">LOW</span>` : `<span class="badge-pill" style="color:var(--ok)">OK</span>`;
                  return `<tr>
                        <td>${i.name}</td>
                        <td>${i.stock}</td>
                        <td>${i.min}</td>
                        <td>${status}</td>
                        <td>
                              <button class="btn ghost" onclick='handlers.editItem("${i.id}")'>Edit</button>
                              <button class="btn danger" onclick='handlers.deleteItem("${i.id}")'>Delete</button>
                        </td>
                  </tr>`
            }).join('') || '<tr><td colspan="5">No inventory items.</td></tr>'
            ui.qs('#invBody').innerHTML = rows;
      }
}

const handlers = {
      addWorker(e){ e.preventDefault(); const f = new FormData(e.target);
            const w = Object.fromEntries(f.entries());
            if(handlers._editingWorker){ // update
                  const idx = state.data.workers.findIndex(x=>x.id===handlers._editingWorker);
                  state.data.workers[idx] = {...state.data.workers[idx], ...w};
                  handlers._editingWorker = null;
                  ui.toast('Abajyanama updated');
            }else{
                  state.data.workers.push({id:crypto.randomUUID(), ...w});
                  ui.toast('Abajyanama saved');
      }
            db.save(state.data); e.target.reset(); ui.renderWorkers(); ui.refreshDistributionForm(); dashboard.render();
      },
      editWorker(id){ const w = state.data.workers.find(x=>x.id===id); if(!w) return;
            handlers._editingWorker = id;
            ['wName','wPhone','wCode','wGender','wVillage','wCell','wSector','wNotes'].forEach(k=>{
                  const key = k.replace('w','').toLowerCase();
                  ui.qs('#'+k).value = w[key] || ''
            });
            ui.toast('Editing… make changes and click Save');
      },
      deleteWorker(id){ if(!confirm('Delete this Abajyanama?')) return;
            state.data.workers = state.data.workers.filter(x=>x.id!==id);
        // unlink distributions for this worker
            state.data.distributions = state.data.distributions.filter(d=>d.workerId!==id);
            db.save(state.data); ui.renderWorkers(); ui.renderDistributions(); dashboard.render(); ui.toast('Deleted');
      },
      addDistribution(e, fromQuick){ e.preventDefault(); const f = new FormData(e.target);
            const d = Object.fromEntries(f.entries()); d.id = crypto.randomUUID();
            if(!d.date) d.date = new Date().toISOString().slice(0,10);
            d.qty = +d.qty || 1; d.age = +d.age || null;
            // update stock
            const item = state.data.items.find(i=>i.name===d.item);
            if(!item){ ui.toast('Item not found in inventory'); return; }
            if(item.stock - d.qty < 0){ if(!confirm('Stock would go negative. Continue?')) return; }
            item.stock = Math.max(0, item.stock - d.qty);
            state.data.distributions.push(d);
            db.save(state.data);
            ui.renderDistributions(); ui.renderInventory(); dashboard.render();
            if(fromQuick){ document.getElementById('quickDist').close() }
            e.target.reset(); ui.toast('Distribution recorded');
            const low = inventory.lowStock(); ui.qs('#notifCount').textContent = low.length;
      },
      editDistribution(id){ const d = state.data.distributions.find(x=>x.id===id); if(!d) return;
        // populate main form for editing (simple approach)
            ui.switchView({preventDefault:()=>{}, currentTarget:{dataset:{target:'distribute'}, classList:{add(){}, remove(){}}}});
            ['dWorker','dDate','dChild','dAge','dItem','dQty','dVillage','dNotes'].forEach(k=>{
                  const key = k.replace('d','').toLowerCase();
                  ui.qs('#'+k).value = d[key] ?? ''
            });
            handlers._editingDist = id;
            ui.toast('Editing… change values then click Record Distribution to save');
      },
      deleteDistribution(id){ if(!confirm('Delete this record?')) return;
            const d = state.data.distributions.find(x=>x.id===id); if(d){
          // return stock
            const item = state.data.items.find(i=>i.name===d.item); if(item) item.stock += (+d.qty||0);
      }
            state.data.distributions = state.data.distributions.filter(x=>x.id!==id);
            db.save(state.data); ui.renderDistributions(); ui.renderInventory(); dashboard.render(); ui.toast('Deleted');
      },

      addOrUpdateItem(e){ e.preventDefault(); const f = new FormData(e.target); const it = Object.fromEntries(f.entries());
            it.stock = +it.stock || 0; it.min = +it.min || 0;
            if(handlers._editingItem){ const idx = state.data.items.findIndex(x=>x.id===handlers._editingItem); state.data.items[idx] = {...state.data.items[idx], ...it}; handlers._editingItem = null; ui.toast('Item updated'); }
            else { state.data.items.push({id:crypto.randomUUID(), ...it}); ui.toast('Item added') }
            db.save(state.data); ui.renderInventory(); ui.fillItemOptions('dItem'); ui.fillItemOptions('qdItem'); e.target.reset();
      },
      editItem(id){ const it = state.data.items.find(x=>x.id===id); if(!it) return; handlers._editingItem = id;
            ui.qs('#iName').value = it.name; ui.qs('#iStock').value = it.stock; ui.qs('#iMin').value = it.min; ui.toast('Editing item…');
      },
      deleteItem(id){ if(!confirm('Delete this item?')) return; state.data.items = state.data.items.filter(x=>x.id!==id); db.save(state.data); ui.renderInventory(); dashboard.render(); ui.toast('Item deleted') },
      resetItemForm(){ handlers._editingItem=null; ['iName','iStock','iMin'].forEach(id=> ui.qs('#'+id).value='') }
}
      const inventory = {
            lowStock(){ return state.data.items.filter(i=> i.stock <= i.min) }
}

      const dashboard = {
            render(){
                  const thisMonth = new Date().toISOString().slice(0,7);
                  const distsMonth = state.data.distributions.filter(d=> (d.date||'').startsWith(thisMonth));
                  const uniqueChildren = new Set(distsMonth.map(d=>`${d.child}|${d.village}`));
                  ui.qs('#statWorkers').textContent = state.data.workers.length;
                  ui.qs('#statItems').textContent = distsMonth.reduce((a,b)=>a+(+b.qty||0),0);
                  ui.qs('#statChildren').textContent = uniqueChildren.size;
                  const low = inventory.lowStock();
                  ui.qs('#statLow').textContent = low.length;
                  ui.qs('#kpiWorkers').textContent = state.data.workers.length;
                  ui.qs('#kpiDistributed').textContent = distsMonth.reduce((a,b)=>a+(+b.qty||0),0);
                  ui.qs('#kpiChildren').textContent = uniqueChildren.size;
                  ui.qs('#kpiLow').textContent = low.length;
                  ui.qs('#monthLabel').textContent = thisMonth;
           // recent table (last 6)
      const rows = state.data.distributions
            .slice(-6)
            .sort((a,b)=> b.date.localeCompare(a.date))
            .map(d=>{
                  const w = state.data.workers.find(x=>x.id===d.workerId);
                  return `<tr><td>${d.date}</td><td>${w? w.name: '—'}</td><td>${d.child}</td><td>${d.item}</td><td>${d.qty}</td><td>${d.village}</td></tr>`
            }).join('') || '<tr><td colspan="6">No recent distributions</td></tr>'
            ui.qs('#recentBody').innerHTML = rows;
      }
}
      const reports = {
            render(){
                  const thisMonth = new Date().toISOString().slice(0,7);
                  const dists = state.data.distributions.filter(d=> (d.date||'').startsWith(thisMonth));
                  const byWorker = new Map();
                  const byItem = new Map();
                  dists.forEach(d=>{ byWorker.set(d.workerId, (byWorker.get(d.workerId)||0) + (+d.qty||0)); byItem.set(d.item, (byItem.get(d.item)||0) + (+d.qty||0)) })
                  const topW = [...byWorker.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5)
                  .map(([id,total])=>{ const w = state.data.workers.find(x=>x.id===id); return `<li>${w? w.name:'—'} – <strong>${total}</strong></li>`}).join('') || '<li>No data</li>'
                  const topI = [...byItem.entries()].sort((a,b)=>b[1]-a[1]).slice(0,5)
                        .map(([name,total])=> `<li>${name} – <strong>${total}</strong></li>`).join('') || '<li>No data</li>'
                        ui.qs('#topWorkers').innerHTML = topW;
                        ui.qs('#topItems').innerHTML = topI;
      }
}

const app = {
      init(){
        // footer year
            document.getElementById('year').textContent = new Date().getFullYear();
        // dashboard on load
            dashboard.render();
        // notif badge
            document.getElementById('notifCount').textContent = inventory.lowStock().length;
        // populate forms
            ui.renderWorkersFilters();
            ui.refreshDistributionForm();
        // global search handler shortcut
      this.searchAll = (q)=>{
            ui.qs('#workerSearch').value = q; ui.renderWorkers();
            ui.qs('#distSearch').value = q; ui.renderDistributions();
            ui.toast('Search applied');
      }
        // export
      this.exportCSV = ()=>{
            const {workers, items, distributions} = state.data;
            const csv = [
            '# Workers',
            'name,phone,code,gender,village,cell,sector,notes',
            ...workers.map(w=>[w.name,w.phone,w.code,w.gender,w.village,w.cell,w.sector,(w.notes||'').replaceAll(',', ';')].join(',')),
            '', '# Inventory', 'name,stock,min',
            ...items.map(i=>[i.name,i.stock,i.min].join(',')),
            '', '# Distributions', 'date,worker,child,age,item,qty,village,notes',
            ...distributions.map(d=>[d.date, (workers.find(w=>w.id===d.workerId)||{}).name || '', d.child, d.age||'', d.item, d.qty, d.village, (d.notes||'').replaceAll(',', ';')].join(','))
      ].join('\n');
            const blob = new Blob([csv], {type:'text/csv'});
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a'); a.href=url; a.download='health-aid-export.csv'; a.click(); URL.revokeObjectURL(url);
      }
            this.clearAll = ()=>{ if(confirm('Clear all demo data?')){ localStorage.removeItem('healthAidDB'); location.reload() } }
      }
}

function openAbajyanama(){
      document.getElementById("view-workers").style.display = "block";
      document.getElementById("view-inventory").style.display = "none";
      document.getElementById("view-reports").style.display = "none";
      document.getElementById("quickDist").style.display = "none";
      document.getElementById('view-dashboard').style.display = "none";
      document.getElementById("chart1").style.display = "none";
      document.getElementById("chart2").style.display = "none";
      document.getElementById("progressBar").style.display = "none";
}
function openInventory(){
      document.getElementById("view-inventory").style.display = "block";
      document.getElementById("view-workers").style.display = "none";
      document.getElementById("view-reports").style.display = "none";
      document.getElementById("quickDist").style.display = "none";
      document.getElementById('view-dashboard').style.display = "none";
      document.getElementById("chart1").style.display = "none";
      document.getElementById("chart2").style.display = "none";
      document.getElementById("progressBar").style.display = "none";
}
function openDistribution(){
      document.getElementById("view-inventory").style.display = "none";
      document.getElementById("view-workers").style.display = "none";
      document.getElementById("view-reports").style.display = "none";
      document.getElementById("quickDist").style.display = "block";
      document.getElementById('view-dashboard').style.display = "none";
      document.getElementById("chart1").style.display = "none";
      document.getElementById("chart2").style.display = "none";
      document.getElementById("progressBar").style.display = "none";
}
function openReport(){
      document.getElementById("view-inventory").style.display = "none";
      document.getElementById("view-workers").style.display = "none";
      document.getElementById("view-reports").style.display = "block";
      document.getElementById("quickDist").style.display = "none";
      document.getElementById('view-dashboard').style.display = "none";
      document.getElementById("chart1").style.display = "none";
      document.getElementById("chart2").style.display = "none";
      document.getElementById("progressBar").style.display = "none";
}
function ViewDashboard(){
      document.getElementById('view-dashboard').style.display = "block"
      document.getElementById("view-inventory").style.display = "none";
      document.getElementById("view-workers").style.display = "none";
      document.getElementById("view-reports").style.display = "none";
      document.getElementById("quickDist").style.display = "none";
      document.getElementById("chart1").style.display = "block";
      document.getElementById("chart2").style.display = "block";
      document.getElementById("progressBar").style.display = "block";
}

// ================== DASHBOARD DATA ==================
const dashboardData = {
    abajyanamaCount: 45,
    itemsDistributed: 320,
    childrenReached: 210,
    lowStockItems: 4,
    distributionTrend: [50, 60, 55, 70, 80, 95, 110],
    stockLevels: {
        labels: ["Shisha Kibondo", "Inzitiramibu", "Soap", "Iron Supplements"],
        values: [120, 40, 85, 25]
    },
    topAbajyanama: [
        { name: "Mukamana Alice", qty: 48 },
        { name: "Niragire Bosco", qty: 43 },
        { name: "Uwimana Claire", qty: 39 }
    ],
    topItems: [
        { name: "Shisha Kibondo", qty: 150 },
        { name: "Soap", qty: 90 },
        { name: "Inzitiramibu", qty: 50 }
    ]
};

// ================== UPDATE KPIs ==================
document.getElementById("kpiWorkers").textContent = dashboardData.abajyanamaCount;
document.getElementById("kpiDistributed").textContent = dashboardData.itemsDistributed;
document.getElementById("kpiChildren").textContent = dashboardData.childrenReached;
document.getElementById("kpiLow").textContent = dashboardData.lowStockItems;

// ================== CHARTS ==================
const ctx1 = document.getElementById('distributionTrendChart').getContext('2d');
const ctx2 = document.getElementById('stockLevelChart').getContext('2d');

// Line Chart
new Chart(ctx1, {
    type: 'line',
    data: {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        datasets: [{
            label: 'Items Distributed',
            data: dashboardData.distributionTrend,
            borderColor: '#4CAF50',
            backgroundColor: 'rgba(76,175,80,0.1)',
            fill: true,
            tension: 0.3
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } }
    }
});

// Bar Chart
new Chart(ctx2, {
    type: 'bar',
    data: {
        labels: dashboardData.stockLevels.labels,
        datasets: [{
            label: 'Stock Count',
            data: dashboardData.stockLevels.values,
            backgroundColor: ['#2196F3','#FF9800','#4CAF50','#E91E63']
        }]
    },
    options: {
        responsive: true,
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } }
    }
});

// ================== TOP LISTS ==================
const topWorkersList = document.getElementById("topWorkers");
dashboardData.topAbajyanama.forEach(worker => {
    const li = document.createElement("li");
    li.textContent = `${worker.name} – ${worker.qty} distributions`;
    topWorkersList.appendChild(li);
});

const topItemsList = document.getElementById("topItems");
dashboardData.topItems.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} – ${item.qty} items`;
    topItemsList.appendChild(li);
});

// ================== FOOTER YEAR ==================
document.getElementById("year").textContent = new Date().getFullYear();



// ================== DYNAMIC DATA ==================
const statData = {
    workers: 45,
    distributed: 320,
    children: 210,
    lowStock: 4,
    targets: {
        workers: 60,
        distributed: 500,
        children: 300,
        lowStock: 10
    }
};

// ================== UPDATE NUMBERS ==================
document.getElementById("statWorkers").textContent = statData.workers;
document.getElementById("statItems").textContent = statData.distributed;
document.getElementById("statChildren").textContent = statData.children;
document.getElementById("statLow").textContent = statData.lowStock;

// ================== CALCULATE PROGRESS (%) ==================
const workersPercent = Math.min((statData.workers / statData.targets.workers) * 100, 100);
const distributedPercent = Math.min((statData.distributed / statData.targets.distributed) * 100, 100);
const childrenPercent = Math.min((statData.children / statData.targets.children) * 100, 100);
const lowStockPercent = Math.max(0, 100 - ((statData.lowStock / statData.targets.lowStock) * 100));

// ================== ANIMATE PROGRESS BARS ==================
function animateBar(id, percent) {
    const bar = document.getElementById(id);
    setTimeout(() => {
        bar.style.width = percent + "%";
        bar.textContent = Math.round(percent) + "%";
    }, 400);
}

animateBar("progressWorkers", workersPercent);
animateBar("progressDistributed", distributedPercent);
animateBar("progressChildren", childrenPercent);
animateBar("progressLow", lowStockPercent);
    // initialize
app.init();