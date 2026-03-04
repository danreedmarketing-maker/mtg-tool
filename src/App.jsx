import React, { useState, useRef, useCallback, useEffect } from "react";

const css = `
  @import url('https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;900&family=Crimson+Pro:ital,wght@0,300;0,400;0,600;1,300&display=swap');
  *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
  :root{
    --bg:#0d0f14;--sur:#13161e;--sur2:#1a1e2a;--bdr:#2a2f3e;
    --gold:#c9943a;--gold2:#e8b84b;--teal:#3ab8b8;--red:#c94040;
    --grn:#3ab87a;--txt:#e2ddd5;--mut:#7a7e8e;
    --fd:'Cinzel',serif;--fb:'Crimson Pro',Georgia,serif;
  }
  body{background:var(--bg);color:var(--txt);font-family:var(--fb)}
  .app{min-height:100vh;background:var(--bg);
    background-image:radial-gradient(ellipse 80% 40% at 50% -10%,rgba(201,148,58,.09) 0%,transparent 60%)}
  .hdr{border-bottom:1px solid var(--bdr);padding:20px 36px 16px;display:flex;align-items:baseline;gap:14px}
  .hdr h1{font-family:var(--fd);font-size:19px;font-weight:900;letter-spacing:.12em;color:var(--gold2);text-transform:uppercase}
  .hdr small{font-size:12px;color:var(--mut)}
  .main{max-width:1480px;margin:0 auto;padding:24px 36px 80px}
  .sg{display:grid;grid-template-columns:repeat(9,1fr);gap:9px;margin-bottom:22px}
  .sc.scenario{border-top:2px solid var(--gold);background:rgba(201,148,58,.04)}
  .sc.scenario-b{border-top:2px solid var(--teal);background:rgba(58,184,184,.04)}
  .sc-grp-lbl{font-family:var(--fd);font-size:7px;letter-spacing:.14em;text-transform:uppercase;
    color:var(--mut);margin-bottom:2px;padding:0 0 4px 0;border-bottom:1px solid var(--bdr)}
  .sc{background:var(--sur);border:1px solid var(--bdr);border-radius:4px;padding:11px 13px}
  .sc .lbl{font-family:var(--fd);font-size:8px;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);margin-bottom:5px}
  .sc .val{font-family:var(--fd);font-size:16px;font-weight:600;color:var(--gold2)}
  .sc .val.grn{color:var(--grn)}.sc .val.red{color:var(--red)}.sc .val.teal{color:var(--teal)}
  .sc.inp{border-color:rgba(201,148,58,.4)}
  .sc input{background:none;border:none;border-bottom:1px solid var(--gold);color:var(--gold2);
    font-family:var(--fd);font-size:16px;font-weight:600;width:100%;outline:none}
  .sc input::placeholder{color:rgba(201,148,58,.3)}
  .ws{display:grid;grid-template-columns:300px 1fr;gap:18px}
  .panel{background:var(--sur);border:1px solid var(--bdr);border-radius:4px;overflow:hidden}
  .ph{background:var(--sur2);border-bottom:1px solid var(--bdr);padding:9px 15px;
    font-family:var(--fd);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold);
    display:flex;align-items:center;justify-content:space-between}
  .pb{padding:15px}
  .dropzone{border:2px dashed var(--bdr);border-radius:4px;padding:24px 16px;text-align:center;
    cursor:pointer;transition:border-color .2s,background .2s;position:relative}
  .dropzone:hover,.dropzone.over{border-color:var(--gold);background:rgba(201,148,58,.04)}
  .dropzone input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
  .dz-icon{font-size:26px;margin-bottom:7px;opacity:.5}
  .dz-txt{font-family:var(--fd);font-size:9px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin-bottom:3px}
  .dz-sub{font-size:11px;color:var(--mut);font-style:italic}
  .file-loaded{background:rgba(58,184,122,.07);border-color:rgba(58,184,122,.35)}
  .file-name{font-family:var(--fd);font-size:10px;color:var(--grn);margin-top:4px;word-break:break-all}
  .seg{display:flex;gap:4px;margin-top:10px}
  .seg button{flex:1;padding:6px 4px;background:var(--sur2);border:1px solid var(--bdr);border-radius:3px;
    color:var(--mut);font-family:var(--fd);font-size:8px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;transition:all .15s}
  .seg button.active{background:rgba(201,148,58,.18);border-color:var(--gold);color:var(--gold2)}
  .srow{display:flex;align-items:center;gap:10px;margin-top:12px}
  .srow label{font-family:var(--fd);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--mut);white-space:nowrap;min-width:64px}
  .srow input[type=range]{flex:1;accent-color:var(--gold);cursor:pointer}
  .sval{font-family:var(--fd);font-size:12px;color:var(--gold2);min-width:42px;text-align:right}
  .fee-row{display:flex;align-items:center;gap:8px;margin-top:8px;padding:9px 11px;
    background:var(--bg);border:1px solid var(--bdr);border-radius:3px}
  .fee-row label{font-family:var(--fd);font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--mut);flex:1}
  .fee-row input[type=number]{background:none;border:none;border-bottom:1px solid var(--bdr);
    color:var(--gold2);font-family:var(--fd);font-size:13px;font-weight:600;width:52px;
    text-align:right;outline:none;-moz-appearance:textfield}
  .fee-row input[type=number]::-webkit-inner-spin-button{-webkit-appearance:none}
  .fee-row input[type=number]:focus{border-bottom-color:var(--gold)}
  .fee-row span{font-family:var(--fd);font-size:11px;color:var(--mut)}
  .fee-combined{padding:5px 11px;font-size:11px;color:var(--mut);font-style:italic}
  .fee-divider{border:none;border-top:1px solid var(--bdr);margin:10px 0}
  .fee-total-row{display:flex;justify-content:space-between;align-items:center;
    padding:6px 11px;background:rgba(201,148,58,.06);border:1px solid rgba(201,148,58,.2);border-radius:3px;margin-top:4px}
  .fee-total-row span:first-child{font-family:var(--fd);font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--mut)}
  .fee-total-row span:last-child{font-family:var(--fd);font-size:12px;color:var(--gold2);font-weight:600}
  .fee-total-row.highlight{border-color:var(--gold);background:rgba(201,148,58,.12)}
  .fee-total-row.highlight span:last-child{color:var(--gold2)}
  .tier-btn{display:block;width:100%;margin-top:5px;padding:5px 8px;background:var(--sur2);
    border:1px solid var(--bdr);border-radius:3px;color:var(--mut);font-family:var(--fd);
    font-size:8px;letter-spacing:.1em;text-transform:uppercase;cursor:pointer;text-align:left;transition:all .15s}
  .tier-btn.active{border-color:var(--gold);color:var(--gold2)}
  .btn{display:block;width:100%;margin-top:12px;padding:10px;
    background:linear-gradient(135deg,#c9943a 0%,#e8b84b 100%);
    border:none;border-radius:3px;color:#0d0f14;font-family:var(--fd);font-size:10px;
    font-weight:600;letter-spacing:.14em;text-transform:uppercase;cursor:pointer;transition:opacity .2s}
  .btn:hover{opacity:.85}.btn:disabled{opacity:.35;cursor:not-allowed}
  .btn.sec{background:var(--sur2);color:var(--gold);border:1px solid var(--bdr);margin-top:8px}
  .btn.sm{margin-top:0;width:auto;padding:7px 14px;font-size:9px}
  .prog{margin-top:10px}
  .prog-bg{background:var(--bdr);border-radius:2px;height:3px;overflow:hidden}
  .prog-fill{height:100%;background:linear-gradient(90deg,var(--gold),var(--teal));transition:width .3s}
  .prog-txt{margin-top:5px;font-size:11px;color:var(--mut);font-style:italic;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  .err{margin-top:10px;padding:9px 12px;background:rgba(201,64,64,.1);border:1px solid rgba(201,64,64,.25);
    border-radius:3px;color:#e07070;font-size:12px;line-height:1.5}
  .note{margin-top:10px;padding:7px 10px;background:rgba(201,148,58,.06);border:1px solid rgba(201,148,58,.2);
    border-radius:3px;font-size:11px;color:var(--mut);line-height:1.5}
  .res-panel{display:flex;flex-direction:column}
  .tbl-wrap{overflow-x:auto;overflow-y:auto;max-height:520px}
  table{width:100%;border-collapse:collapse;font-size:13px}
  thead{position:sticky;top:0;z-index:2}
  thead th{background:var(--sur2);border-bottom:1px solid var(--bdr);padding:8px 10px;text-align:left;
    font-family:var(--fd);font-size:8px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);
    white-space:nowrap;cursor:pointer;user-select:none}
  thead th:hover,thead th.act{color:var(--gold2)}
  .right{text-align:right}.center{text-align:center}
  tbody tr{border-bottom:1px solid rgba(42,47,62,.5);transition:background .1s}
  tbody tr:hover{background:rgba(201,148,58,.04)}
  tbody tr.miss{opacity:.4}
  td{padding:7px 10px;font-family:var(--fb);font-size:13px;vertical-align:middle}
  td.nm{font-weight:600;max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  td.setcol{color:var(--mut);font-size:12px;max-width:120px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
  td.gd{color:var(--gold2);font-family:var(--fd);font-size:11px;font-weight:600}
  td.tl{color:var(--teal);font-family:var(--fd);font-size:11px}
  td.gr{color:var(--grn);font-family:var(--fd);font-size:11px}
  td.rd{color:var(--red);font-family:var(--fd);font-size:11px}
  .bp{display:inline-block;padding:2px 6px;border-radius:2px;font-family:var(--fd);font-size:8px;letter-spacing:.08em;text-transform:uppercase}
  .bnm{background:rgba(58,184,122,.15);color:var(--grn);border:1px solid rgba(58,184,122,.3)}
  .bfoil{background:rgba(58,184,184,.15);color:var(--teal);border:1px solid rgba(58,184,184,.3)}
  .bvar{background:rgba(100,100,180,.15);color:#aab;border:1px solid rgba(100,100,180,.3)}
  .empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:70px 20px;color:var(--mut)}
  .empty .ico{font-size:36px;margin-bottom:12px;opacity:.3}
  .empty p{font-family:var(--fd);font-size:10px;letter-spacing:.14em;text-transform:uppercase}

  .cond-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:4px;margin-top:8px}
  .cond-btn{padding:6px 2px;background:var(--sur2);border:1px solid var(--bdr);border-radius:3px;
    color:var(--mut);font-family:var(--fd);font-size:7px;letter-spacing:.08em;text-transform:uppercase;
    cursor:pointer;transition:all .15s;text-align:center;line-height:1.4}
  .cond-btn:hover{border-color:var(--gold);color:var(--gold2)}
  .cond-btn.active{background:rgba(201,148,58,.18);border-color:var(--gold);color:var(--gold2)}
  .cond-pct{font-size:9px;color:var(--mut);display:block;margin-top:2px}
  .sold-note{font-size:10px;color:var(--mut);font-style:italic;margin-top:6px;line-height:1.5}

  .tt{position:relative;display:inline-flex;align-items:center;gap:4px;cursor:default;width:100%}
  .tt-icon{display:inline-block;width:13px;height:13px;background:var(--sur2);border:1px solid var(--bdr);
    border-radius:50%;font-family:var(--fd);font-size:8px;color:var(--mut);text-align:center;
    line-height:13px;cursor:help;flex-shrink:0;margin-left:auto}
  .tt-icon:hover{border-color:var(--gold);color:var(--gold2)}
  .tt-box{visibility:hidden;opacity:0;position:absolute;bottom:calc(100% + 6px);left:50%;
    transform:translateX(-50%);background:var(--sur2);border:1px solid var(--bdr);border-radius:4px;
    padding:8px 10px;font-family:var(--fb);font-size:11px;color:var(--txt);line-height:1.6;
    white-space:normal;width:220px;z-index:100;pointer-events:none;
    box-shadow:0 4px 16px rgba(0,0,0,.4);transition:opacity .15s}
  .tt-icon:hover + .tt-box,.tt:hover .tt-box{visibility:visible;opacity:1}

  .tabs{display:flex;gap:0;border-bottom:1px solid var(--bdr);margin-bottom:0}
  .tab{padding:9px 20px;font-family:var(--fd);font-size:9px;letter-spacing:.12em;text-transform:uppercase;
    color:var(--mut);cursor:pointer;border-bottom:2px solid transparent;transition:all .15s;background:none;border-top:none;border-left:none;border-right:none}
  .tab:hover{color:var(--gold2)}
  .tab.active{color:var(--gold2);border-bottom-color:var(--gold2)}
  .deal-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:12px}
  .deal-field{display:flex;flex-direction:column;gap:3px}
  .deal-field label{font-family:var(--fd);font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--mut)}
  .deal-field input,.deal-field select{background:var(--bg);border:1px solid var(--bdr);border-radius:3px;
    color:var(--txt);font-family:var(--fb);font-size:13px;padding:5px 8px;outline:none;width:100%}
  .deal-field input:focus,.deal-field select:focus{border-color:var(--gold)}
  .status-badge{display:inline-block;padding:3px 8px;border-radius:2px;font-family:var(--fd);font-size:8px;letter-spacing:.08em;text-transform:uppercase}
  .st-eval{background:rgba(201,148,58,.15);color:var(--gold2);border:1px solid rgba(201,148,58,.3)}
  .st-active{background:rgba(58,184,184,.15);color:var(--teal);border:1px solid rgba(58,184,184,.3)}
  .st-listed{background:rgba(100,100,200,.15);color:#aac;border:1px solid rgba(100,100,200,.3)}
  .st-closed{background:rgba(58,184,122,.15);color:var(--grn);border:1px solid rgba(58,184,122,.3)}
  .snap-btn{display:flex;align-items:center;gap:6px;margin-top:8px;padding:9px 12px;
    background:rgba(201,148,58,.1);border:1px solid rgba(201,148,58,.3);border-radius:3px;
    cursor:pointer;font-family:var(--fd);font-size:9px;letter-spacing:.1em;text-transform:uppercase;color:var(--gold2);transition:all .15s;width:100%}
  .snap-btn:hover{background:rgba(201,148,58,.2)}
  .cmp-drop{border:2px dashed var(--bdr);border-radius:4px;padding:18px 14px;text-align:center;
    cursor:pointer;transition:all .2s;position:relative;margin-bottom:8px}
  .cmp-drop:hover,.cmp-drop.over{border-color:var(--teal);background:rgba(58,184,184,.04)}
  .cmp-drop input[type=file]{position:absolute;inset:0;opacity:0;cursor:pointer;width:100%;height:100%}
  .cmp-drop.loaded{border-color:rgba(58,184,122,.4);background:rgba(58,184,122,.05)}
  .diff-miss{background:rgba(201,64,64,.06)}
  .diff-extra{background:rgba(58,184,184,.06)}
  .diff-qty{background:rgba(201,148,58,.06)}
  .diff-price{background:rgba(100,100,200,.06)}
  .diff-cond{background:rgba(180,100,180,.06)}
  .diff-match{}
  .cmp-summary{display:grid;grid-template-columns:repeat(4,1fr);gap:8px;margin-bottom:14px}
  .cmp-sc{background:var(--sur);border:1px solid var(--bdr);border-radius:4px;padding:10px 12px}
  .cmp-sc .lbl{font-family:var(--fd);font-size:7px;letter-spacing:.12em;text-transform:uppercase;color:var(--mut);margin-bottom:4px}
  .cmp-sc .val{font-family:var(--fd);font-size:14px;font-weight:600;color:var(--gold2)}
  .cmp-sc .val.grn{color:var(--grn)}.cmp-sc .val.red{color:var(--red)}.cmp-sc .val.teal{color:var(--teal)}

  .dash{padding:0}
  .kpi-grid{display:grid;grid-template-columns:repeat(7,1fr);gap:9px;margin-bottom:22px}
  .kpi{background:var(--sur);border:1px solid var(--bdr);border-radius:4px;padding:12px 14px}
  .kpi.gold{border-top:2px solid var(--gold)}
  .kpi.teal{border-top:2px solid var(--teal)}
  .kpi.grn{border-top:2px solid var(--grn)}
  .kpi.red{border-top:2px solid var(--red)}
  .kpi-lbl{font-family:var(--fd);font-size:7px;letter-spacing:.14em;text-transform:uppercase;color:var(--mut);margin-bottom:5px}
  .kpi-val{font-family:var(--fd);font-size:17px;font-weight:600;color:var(--gold2)}
  .kpi-val.teal{color:var(--teal)}.kpi-val.grn{color:var(--grn)}.kpi-val.red{color:var(--red)}.kpi-val.mut{color:var(--mut)}
  .kpi-sub{font-size:10px;color:var(--mut);margin-top:3px;font-style:italic}
  .deal-table-wrap{overflow-x:auto;overflow-y:auto;max-height:480px}
  .deal-row-exp{background:var(--sur2);border-bottom:1px solid var(--bdr)}
  .deal-row-exp td{padding:0}
  .snap-list{padding:10px 14px;display:flex;flex-direction:column;gap:6px}
  .snap-item{display:flex;align-items:center;gap:10px;padding:7px 10px;
    background:var(--bg);border:1px solid var(--bdr);border-radius:3px}
  .snap-item-name{flex:1;font-family:var(--fd);font-size:9px;letter-spacing:.08em;color:var(--gold2)}
  .snap-item-meta{font-size:10px;color:var(--mut)}
  .inline-edit input,.inline-edit select{background:var(--bg);border:1px solid var(--gold);
    border-radius:2px;color:var(--gold2);font-family:var(--fb);font-size:12px;padding:2px 6px;outline:none;width:100%}
  .dash-section{background:var(--sur);border:1px solid var(--bdr);border-radius:4px;overflow:hidden;margin-bottom:16px}
  .dash-ph{background:var(--sur2);border-bottom:1px solid var(--bdr);padding:9px 15px;
    display:flex;align-items:center;justify-content:space-between;
    font-family:var(--fd);font-size:9px;letter-spacing:.14em;text-transform:uppercase;color:var(--gold)}
  .no-deals{display:flex;flex-direction:column;align-items:center;justify-content:center;
    padding:50px 20px;color:var(--mut)}
  .no-deals p{font-family:var(--fd);font-size:10px;letter-spacing:.12em;text-transform:uppercase;margin-top:10px}
  .dash-sync{display:flex;align-items:center;gap:8px;padding:10px 15px;
    border-top:1px solid var(--bdr);font-size:11px;color:var(--mut);font-style:italic}
  .ebar{padding:10px 15px;border-top:1px solid var(--bdr);background:var(--sur2);display:flex;align-items:center;gap:12px}
  .ebar .st{flex:1;font-size:12px;color:var(--mut);font-style:italic}
  .fbar{padding:8px 14px;border-bottom:1px solid var(--bdr);background:var(--sur2);display:flex;align-items:center;gap:10px;flex-wrap:wrap}
  .fbar input[type=text]{background:var(--bg);border:1px solid var(--bdr);border-radius:3px;color:var(--txt);
    font-family:var(--fb);font-size:13px;padding:5px 10px;outline:none;width:180px}
  .fbar input[type=text]:focus{border-color:var(--gold)}
  .fbar label{font-family:var(--fd);font-size:8px;letter-spacing:.1em;text-transform:uppercase;color:var(--mut)}
  .fbar select{background:var(--bg);border:1px solid var(--bdr);border-radius:3px;color:var(--txt);
    font-family:var(--fb);font-size:13px;padding:5px 8px;outline:none;cursor:pointer}
`;

const COND_MULT = { NM:1.0, LP:0.85, MP:0.70, HP:0.50, DMG:0.30 };
const COND_LABELS = [
  { key:"NM",  label:"Near Mint",       mult:1.00 },
  { key:"LP",  label:"Lightly Played",  mult:0.85 },
  { key:"MP",  label:"Mod. Played",     mult:0.70 },
  { key:"HP",  label:"Heavily Played",  mult:0.50 },
  { key:"DMG", label:"Damaged",         mult:0.30 },
];

const parseDollar = s => {
  if(!s) return null;
  const n = parseFloat(String(s).replace(/[$,]/g,""));
  return isNaN(n) ? null : n;
};

const fmt = n => {
  if(n == null || isNaN(n)) return "--";
  return "$" + Number(n).toFixed(2);
};

const fmtL = n => {
  if(n == null || isNaN(n)) return "--";
  return "$" + Number(n).toLocaleString("en-US", {minimumFractionDigits:2, maximumFractionDigits:2});
};

const pct = n => Number(n).toFixed(2) + "%";

const sleep = ms => new Promise(r => setTimeout(r, ms));

function parseCSVLine(line) {
  const result = [];
  let cur = "", inQ = false;
  for(let i = 0; i < line.length; i++) {
    const ch = line[i];
    if(ch === '"') { inQ = !inQ; }
    else if(ch === ',' && !inQ) { result.push(cur.trim()); cur = ""; }
    else { cur += ch; }
  }
  result.push(cur.trim());
  return result;
}

function parseTCGPlayerCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if(!lines.length) return [];
  const firstFields = parseCSVLine(lines[0]).map(f => f.toLowerCase().trim());
  let dataLines = lines;
  if(["have","qty","quantity"].includes(firstFields[0])) dataLines = lines.slice(1);
  const numCols = parseCSVLine(dataLines[0] || "").length;
  const cards = [];
  for(const line of dataLines) {
    if(!line.trim()) continue;
    const f = parseCSVLine(line);
    let qty, name, set, low, mid, high;
    if(numCols >= 7) {
      qty=parseInt(f[0])||1; name=f[1]||""; set=f[3]||"";
      low=parseDollar(f[4]); mid=parseDollar(f[5]); high=parseDollar(f[6]);
    } else if(numCols === 6) {
      qty=parseInt(f[0])||1; name=f[1]||""; set=f[2]||"";
      low=parseDollar(f[3]); mid=parseDollar(f[4]); high=parseDollar(f[5]);
    } else if(numCols === 5) {
      qty=parseInt(f[0])||1; name=f[1]||""; set=f[2]||"";
      low=parseDollar(f[3]); mid=parseDollar(f[4]); high=null;
    } else {
      qty=parseInt(f[0])||1; name=f[1]||""; set=f[2]||"";
      low=mid=high=null;
    }
    let isFoil = false, variant = "";
    if(/- \[foil\]/i.test(name)) {
      isFoil = true;
      name = name.replace(/\s*-\s*\[foil\]/gi, "").trim();
    }
    const vm = name.match(/\(([^)]+)\)\s*$/);
    if(vm) { variant = vm[1]; name = name.replace(/\s*\([^)]+\)\s*$/, "").trim(); }
    if(name) cards.push({qty, name, set, low, mid, high, isFoil, variant, condition:"NM", buyCost:null, source:"csv"});
  }
  return cards;
}

const sfCache = {};
async function fetchScryfall(name, set, isFoil) {
  const key = name.toLowerCase() + "|" + set + "|" + isFoil;
  if(sfCache[key] !== undefined) return sfCache[key];
  let url = "https://api.scryfall.com/cards/named?fuzzy=" + encodeURIComponent(name);
  if(set) url += "&set=" + encodeURIComponent(set.toLowerCase());
  try {
    let res = await fetch(url);
    if(!res.ok && set) res = await fetch("https://api.scryfall.com/cards/named?fuzzy=" + encodeURIComponent(name));
    if(!res.ok) { sfCache[key] = null; return null; }
    const data = await res.json();
    const price = isFoil
      ? (data.prices?.usd_foil ? parseFloat(data.prices.usd_foil) : data.prices?.usd ? parseFloat(data.prices.usd) : null)
      : (data.prices?.usd ? parseFloat(data.prices.usd) : null);
    const result = { price, scryfallUri: data.scryfall_uri };
    sfCache[key] = result;
    return result;
  } catch(e) { sfCache[key] = null; return null; }
}

function calcFees(salePrice, tcgFeePct, procFeePct) {
  if(salePrice == null) return { tcgFee:null, procFee:null, totalFee:null, netRevenue:null };
  const tcgFee  = salePrice * (tcgFeePct  / 100);
  const procFee = salePrice * (procFeePct / 100);
  const totalFee = tcgFee + procFee;
  const netRevenue = salePrice - totalFee;
  return { tcgFee, procFee, totalFee, netRevenue };
}

const TIERS = [
  { label:"Unverified", val:15 },
  { label:"Verified",   val:12.5 },
  { label:"Direct",     val:10.25 },
  { label:"Pro",        val:8.5 },
];

export default function App() {
  const [cards,      setCards]      = useState([]);
  const [fileName,   setFileName]   = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [collCost,   setCollCost]   = useState("");
  const [discount,   setDiscount]   = useState(90);
  const [condQuality, setCondQuality] = useState("NM");
  const [soldPct,     setSoldPct]     = useState(100);
  const [priceMode,  setPriceMode]  = useState("mid");
  const [tcgFee,     setTcgFee]     = useState(10.75);
  const [procFee,    setProcFee]    = useState(2.5);
  const [status,     setStatus]     = useState("idle");
  const [prog,       setProg]       = useState(0);
  const [progMsg,    setProgMsg]    = useState("");
  const [results,    setResults]    = useState([]);
  const [err,        setErr]        = useState("");
  const [sortCol,    setSortCol]    = useState("netTotal");
  const [sortDir,    setSortDir]    = useState("desc");
  const [filter,     setFilter]     = useState("");
  const [foilFilter, setFoilFilter] = useState("all");
  const abortRef = useRef(false);
  // Google Sheets integration
  const [gsToken,     setGsToken]     = useState(null);
  const [gsSheetId,   setGsSheetId]   = useState(null);
  const [gsSheetName, setGsSheetName] = useState(null);
  const [gsStatus,    setGsStatus]    = useState("disconnected"); // disconnected | connecting | connected | error
  const [gsMsg,       setGsMsg]       = useState("");
  const tokenClientRef = useRef(null);

  // Deal tracker
  const [activeTab,   setActiveTab]   = useState("valuation"); // valuation | compare | dashboard
  const [dealLog,     setDealLog]     = useState([]);   // rows from Sheets Deal Log
  const [snapshots,   setSnapshots]   = useState({});   // { dealName: [tabName, ...] }
  const [dashLoading, setDashLoading] = useState(false);
  const [dashMsg,     setDashMsg]     = useState("");
  const [expandedDeal,setExpandedDeal]= useState(null);
  const [editingDeal, setEditingDeal] = useState(null); // { rowIdx, field, value }
  const [allSheetTabs,setAllSheetTabs]= useState([]);
  const [dealName,    setDealName]    = useState("");
  const [dealSeller,  setDealSeller]  = useState("");
  const [dealDate,    setDealDate]    = useState(new Date().toISOString().slice(0,10));
  const [dealStatus,  setDealStatus]  = useState("Evaluating");
  const [dealStage,   setDealStage]   = useState("Intake");
  const [dealNotes,   setDealNotes]   = useState("");
  // Compare mode
  const [cmpFileA,    setCmpFileA]    = useState("");
  const [cmpDataA,    setCmpDataA]    = useState(null);
  const [cmpFileB,    setCmpFileB]    = useState("");
  const [cmpDataB,    setCmpDataB]    = useState(null);
  const [cmpDragA,    setCmpDragA]    = useState(false);
  const [cmpDragB,    setCmpDragB]    = useState(false);
  const [cmpDeal,     setCmpDeal]     = useState("");   // selected deal name for compare
  const [cmpSheetA,   setCmpSheetA]   = useState("");  // selected snapshot tab for slot A
  const [cmpSheetB,   setCmpSheetB]   = useState("");  // selected snapshot tab for slot B
  const [cmpLoadingA, setCmpLoadingA] = useState(false);
  const [cmpLoadingB, setCmpLoadingB] = useState(false);
  const [cmpDiff,     setCmpDiff]     = useState(null);
  const [cmpFilter,   setCmpFilter]   = useState("all");

  const buildResults = useCallback((rawCards, mode, tFee, pFee, costPaid, discPct, cond, sPct) => {
    // Total market value of all found cards (used to allocate COGS proportionally)
    const totalMktVal = rawCards.reduce((sum, c) => {
      const p = c[mode] ?? c.mid ?? c.low ?? c.high ?? null;
      return sum + (p != null ? p * c.qty : 0);
    }, 0);
    // Implied total market value from offer: costPaid = totalMktVal * (discPct/100)
    // so allocatedCOGS per card = (costPaid / (discPct/100)) / totalMktVal * cardMktPrice
    // simplified: cogs per unit = costPaid * cardMktPrice / (totalMktVal * discPct/100)
    return rawCards.map(c => {
      const price       = c[mode] ?? c.mid ?? c.low ?? c.high ?? null;
      const condMult    = COND_MULT[cond] ?? COND_MULT[c.condition] ?? 1.0;
      const marketPrice = price;
      const adjPrice    = price != null ? price * condMult : null;
      const offerPrice  = adjPrice != null ? adjPrice * (discPct / 100) : null;
      const fees = calcFees(offerPrice, tFee, pFee);
      // COGS: proportional share of cost paid, based on card's share of total market value
      const cogs = (costPaid > 0 && totalMktVal > 0 && price != null)
        ? (costPaid / (discPct / 100)) / totalMktVal * price
        : null;
      return { ...c, marketPrice, adjPrice, offerPrice,
        tcgFee: fees.tcgFee, procFee: fees.procFee, totalFee: fees.totalFee,
        netRevenue: fees.netRevenue, cogs, found: price != null };
    });
  }, []);

  const loadFile = useCallback((file) => {
    if(!file) return;
    setErr("");
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const parsed = parseTCGPlayerCSV(e.target.result);
        if(!parsed.length) throw new Error("No cards found in file.");
        setCards(parsed); setFileName(file.name); setResults([]); setStatus("ready");
      } catch(ex) { setErr(ex.message); }
    };
    reader.readAsText(file);
  }, []);

  const onFileChange = e => loadFile(e.target.files[0]);
  const onDrop = e => { e.preventDefault(); setIsDragOver(false); loadFile(e.dataTransfer.files[0]); };

  const run = useCallback(async () => {
    setErr(""); setStatus("fetching"); setProg(0); setResults([]);
    abortRef.current = false;
    const needsSF  = cards.filter(c => c.low == null && c.mid == null && c.high == null);
    const enriched = [...cards];
    if(needsSF.length > 0) {
      for(let i = 0; i < needsSF.length; i++) {
        if(abortRef.current) break;
        const c = needsSF[i];
        setProgMsg("Scryfall " + (i+1) + "/" + needsSF.length + ": " + c.name);
        setProg(Math.round((i / needsSF.length) * 100));
        const sf = await fetchScryfall(c.name, c.set, c.isFoil);
        const idx = enriched.findIndex(r => r === c);
        if(idx > -1 && sf?.price) {
          enriched[idx] = { ...enriched[idx], mid:sf.price, low:sf.price*0.8, high:sf.price*1.3, scryfallUri:sf.scryfallUri, source:"scryfall" };
        }
        if(i < needsSF.length - 1) await sleep(80);
      }
    }
    const final = buildResults(enriched, priceMode, tcgFee, procFee, costNum, discount, condQuality, soldPct);
    setProg(100); setResults(final); setStatus("done");
  }, [cards, priceMode, tcgFee, procFee, buildResults]);

  const applyCollCost = v => { setCollCost(v); if(status==="done") setResults(prev => buildResults(prev, priceMode, tcgFee, procFee, parseFloat(v.replace(/[^0-9.]/g,""))||0, discount, condQuality, soldPct)); };
  const applyDiscount = v => { setDiscount(v);     if(status==="done") setResults(prev => buildResults(prev, priceMode, tcgFee, procFee, costNum, v, condQuality, soldPct)); };
  const applyCond     = v => { setCondQuality(v); if(status==="done") setResults(prev => buildResults(prev, priceMode, tcgFee, procFee, costNum, discount, v, soldPct)); };
  const applySold     = v => { setSoldPct(v);     if(status==="done") setResults(prev => buildResults(prev, priceMode, tcgFee, procFee, costNum, discount, condQuality, v)); };
  // -- Snapshot export ------------------------------------------------------
  const exportSnapshot = () => {
    if(!results.length) return;
    const meta = [
      ["Deal Name:", dealName], ["Seller:", dealSeller], ["Date:", dealDate],
      ["Stage:", dealStage], ["Status:", dealStatus], ["Offer %:", discount + "%"],
      ["Condition:", condQuality], ["TCG Fee %:", tcgFee + "%"],
      ["Proc Fee %:", procFee + "%"], ["Sold %:", soldPct + "%"],
      ["Collection Cost:", collCost], ["Notes:", dealNotes],
      [], // blank row separator
    ];
    const headers = ["Name","Set","Foil","Variant","Qty","Cond","Low","Mid","High",
      "Offer Price","Mkt Total","TCG Fee","Proc Fee","Net Revenue","COGS/Card","Source"];
    const rows = results.map(r => [
      r.name, r.set, r.isFoil?"Yes":"", r.variant||"", r.qty, r.condition||condQuality,
      r.low?.toFixed(2)||"", r.mid?.toFixed(2)||"", r.high?.toFixed(2)||"",
      r.offerPrice?.toFixed(2)||"", r.marketPrice!=null?(r.marketPrice*r.qty).toFixed(2):"",
      r.tcgFee?.toFixed(2)||"", r.procFee?.toFixed(2)||"",
      r.netRevenue?.toFixed(2)||"", r.cogs?.toFixed(2)||"", r.source||"csv"
    ]);
    const allRows = [
      ...meta.map(m => m.map(v => '"'+String(v)+'"').join(",")),
      headers.map(h => '"'+h+'"').join(","),
      ...rows.map(r => r.map(v => '"'+String(v)+'"').join(","))
    ].join("\n");
    const safeName = (dealName||"snapshot").replace(/[^a-z0-9]/gi,"-");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([allRows], {type:"text/csv"}));
    a.download = safeName + "--" + dealStage + "--" + dealDate + ".csv";
    a.click();
  };

  // -- Parse snapshot from Sheets rows (2D array) ---------------------------
  const parseSnapshotRows = (rows) => {
    const meta = {};
    let dataStart = 0;
    for(let i = 0; i < rows.length; i++) {
      const r = rows[i];
      if(r[0]?.toLowerCase() === "name") { dataStart = i; break; }
      if(r[0] && r[1]) meta[r[0].replace(":","").trim().toLowerCase()] = r[1];
    }
    const headers = (rows[dataStart]||[]).map(h => h.toLowerCase().trim());
    const cards = rows.slice(dataStart + 1).filter(r => r[0]).map(r => {
      const obj = {}; headers.forEach((h,i) => obj[h] = r[i]||"");
      return {
        name: obj["name"], set: obj["set"], isFoil: obj["foil"]==="Yes",
        variant: obj["variant"]||"", qty: parseInt(obj["qty"])||1,
        condition: obj["cond"]||"NM",
        low: parseDollar(obj["low"]), mid: parseDollar(obj["mid"]), high: parseDollar(obj["high"]),
        offerPrice: parseDollar(obj["offer price"]),
        mktTotal: parseDollar(obj["mkt total"]),
        tcgFee: parseDollar(obj["tcg fee"]), procFee: parseDollar(obj["proc fee"]),
        netRevenue: parseDollar(obj["net revenue"]),
        cogs: parseDollar(obj["cogs/card"]),
        source: obj["source"]||"csv",
      };
    });
    return { meta, cards };
  };

  // -- Parse snapshot CSV (includes metadata header rows) -------------------
  const parseSnapshot = (text) => {
    const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
    const meta = {};
    let dataStart = 0;
    // Scan for header row
    for(let i = 0; i < lines.length; i++) {
      const fields = parseCSVLine(lines[i]);
      if(fields[0] && fields[0].replace(/"/g,"").toLowerCase() === "name") {
        dataStart = i;
        break;
      }
      // Collect metadata
      if(fields.length >= 2) {
        const k = fields[0].replace(/"/g,"").replace(":","").trim();
        const v = fields[1].replace(/"/g,"").trim();
        if(k) meta[k] = v;
      }
    }
    const headers = parseCSVLine(lines[dataStart]).map(h => h.replace(/"/g,"").toLowerCase().trim());
    const cards = [];
    for(let i = dataStart + 1; i < lines.length; i++) {
      const f = parseCSVLine(lines[i]).map(v => v.replace(/"/g,"").trim());
      if(!f[0]) continue;
      const row = {};
      headers.forEach((h, idx) => row[h] = f[idx]||"");
      cards.push({
        name:        row["name"]||"",
        set:         row["set"]||"",
        isFoil:      row["foil"]==="Yes",
        variant:     row["variant"]||"",
        qty:         parseInt(row["qty"])||1,
        condition:   row["cond"]||"NM",
        low:         parseDollar(row["low"]),
        mid:         parseDollar(row["mid"]),
        high:        parseDollar(row["high"]),
        offerPrice:  parseDollar(row["offer price"]),
        mktTotal:    parseDollar(row["mkt total"]),
        tcgFee:      parseDollar(row["tcg fee"]),
        procFee:     parseDollar(row["proc fee"]),
        netRevenue:  parseDollar(row["net revenue"]),
        cogs:        parseDollar(row["cogs/card"]),
        source:      row["source"]||"csv",
      });
    }
    return { meta, cards };
  };

  // -- Compare two snapshots -------------------------------------------------
  const runCompare = (a, b) => {
    if(!a || !b) return;
    const aMap = {};
    a.cards.forEach(c => { const k = c.name + "|" + c.set; aMap[k] = c; });
    const bMap = {};
    b.cards.forEach(c => { const k = c.name + "|" + c.set; bMap[k] = c; });
    const allKeys = new Set([...Object.keys(aMap), ...Object.keys(bMap)]);
    const diff = [];
    allKeys.forEach(k => {
      const ca = aMap[k], cb = bMap[k];
      if(!ca) { diff.push({...cb, status:"EXTRA", qtyDelta:cb.qty, priceDelta:null, condChange:false}); return; }
      if(!cb) { diff.push({...ca, status:"MISSING", qtyDelta:-ca.qty, priceDelta:null, condChange:false}); return; }
      const midA = ca.mid, midB = cb.mid;
      const priceDelta = (midA != null && midB != null) ? midB - midA : null;
      const qtyDelta = cb.qty - ca.qty;
      const condChange = ca.condition !== cb.condition;
      let status = "MATCH";
      if(qtyDelta !== 0) status = "QTY_CHANGE";
      else if(condChange) status = "COND_CHANGE";
      else if(priceDelta != null && Math.abs(priceDelta) > 0.05) status = "PRICE_MOVE";
      diff.push({
        name: ca.name, set: ca.set, isFoil: ca.isFoil, variant: ca.variant,
        qtyA: ca.qty, qtyB: cb.qty, qtyDelta,
        condA: ca.condition, condB: cb.condition, condChange,
        midA, midB, priceDelta,
        netRevA: ca.netRevenue, netRevB: cb.netRevenue,
        cogsA: ca.cogs, cogsB: cb.cogs,
        status
      });
    });
    diff.sort((a,b) => {
      const order = {MISSING:0,EXTRA:1,QTY_CHANGE:2,COND_CHANGE:3,PRICE_MOVE:4,MATCH:5};
      return (order[a.status]||5) - (order[b.status]||5);
    });
    setCmpDiff(diff);
  };

  const loadCmpFile = (file, slot) => {
    if(!file) return;
    const reader = new FileReader();
    reader.onload = e => {
      const parsed = parseSnapshot(e.target.result);
      if(slot === "A") { setCmpFileA(file.name); setCmpDataA(parsed); }
      else             { setCmpFileB(file.name); setCmpDataB(parsed); }
    };
    reader.readAsText(file);
  };

  // -- Google Sheets helpers -------------------------------------------------
  const SCOPES = "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/drive.file";
  const CLIENT_ID = "782897364612-ah45i5g9r39hige7tdlf9tnc91ohjaqq.apps.googleusercontent.com";

  const initTokenClient = () => {
    if(!window.google?.accounts?.oauth2) return false;
    tokenClientRef.current = window.google.accounts.oauth2.initTokenClient({
      client_id: CLIENT_ID,
      scope: SCOPES,
      callback: (resp) => {
        if(resp.error) { setGsStatus("error"); setGsMsg(resp.error); return; }
        setGsToken(resp.access_token);
        setGsStatus("connected");
        setGsMsg("");
      },
    });
    return true;
  };

  useEffect(() => {
    // If already loaded (e.g. page refresh), init immediately
    if(window.google?.accounts?.oauth2) { initTokenClient(); return; }
    // Otherwise inject the script
    if(!document.querySelector('script[src*="accounts.google.com/gsi"]')) {
      const script = document.createElement("script");
      script.src = "https://accounts.google.com/gsi/client";
      script.async = true;
      script.defer = true;
      document.head.appendChild(script);
    }
    // Poll until loaded (handles both script inject and already-in-page cases)
    let attempts = 0;
    const poll = setInterval(() => {
      attempts++;
      if(window.google?.accounts?.oauth2) {
        clearInterval(poll);
        initTokenClient();
      } else if(attempts > 40) {
        clearInterval(poll);
        setGsMsg("Could not load Google sign-in. Check network or try refreshing.");
      }
    }, 250);
    return () => clearInterval(poll);
  }, []);

  const gsConnect = () => {
    if(!tokenClientRef.current) {
      // Try to init one more time in case script just finished loading
      if(!initTokenClient()) {
        setGsMsg("Google sign-in not ready. Wait a moment and try again.");
        return;
      }
    }
    setGsStatus("connecting");
    setGsMsg("");
    tokenClientRef.current.requestAccessToken();
  };

  const gsDisconnect = () => {
    if(gsToken) window.google?.accounts.oauth2.revoke(gsToken);
    setGsToken(null); setGsSheetId(null); setGsSheetName(null);
    setGsStatus("disconnected"); setGsMsg("");
  };

  const gsRequest = async (method, url, body) => {
    const res = await fetch(url, {
      method,
      headers: { "Authorization": "Bearer " + gsToken, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
    });
    if(!res.ok) {
      const err = await res.json().catch(() => ({}));
      throw new Error(err?.error?.message || "Sheets API error " + res.status);
    }
    return res.json();
  };

  // Create the master sheet if not yet created
  const gsEnsureSheet = async () => {
    if(gsSheetId) return gsSheetId;
    setGsMsg("Creating MTG Deal Tracker sheet...");
    // Create spreadsheet
    const data = await gsRequest("POST", "https://sheets.googleapis.com/v4/spreadsheets", {
      properties: { title: "MTG Deal Tracker" },
      sheets: [
        { properties: { title: "Deal Log", index: 0 } },
        { properties: { title: "Dashboard", index: 1 } },
      ],
    });
    const sheetId = data.spreadsheetId;
    // Write Deal Log headers
    const logHeaders = [["Deal Name","Seller","Date","Stage","Offered ($)","Cards",
      "Status","Intake MktVal","Intake NetRev","Total Fees","Actual NetRev","P&L","ROI","Notes","Snapshot Tab"]];
    await gsRequest("PUT",
      "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + "/values/Deal%20Log!A1?valueInputOption=USER_ENTERED",
      { values: logHeaders }
    );
    // Format header row bold
    const fmtSheetId = data.sheets[0].properties.sheetId;
    await gsRequest("POST",
      "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + ":batchUpdate",
      { requests: [{
        repeatCell: {
          range: { sheetId: fmtSheetId, startRowIndex: 0, endRowIndex: 1 },
          cell: { userEnteredFormat: { textFormat: { bold: true }, backgroundColor: { red:.1, green:.09, blue:.12 } } },
          fields: "userEnteredFormat(textFormat,backgroundColor)"
        }
      }]}
    );
    setGsSheetId(sheetId);
    setGsSheetName("MTG Deal Tracker");
    setGsMsg("Sheet created.");
    return sheetId;
  };

  // Save snapshot to a new tab in the sheet
  const gsSaveSnapshot = async () => {
    if(!results.length || !gsToken) return;
    try {
      setGsMsg("Saving to Google Sheets...");
      const sheetId = await gsEnsureSheet();
      const safeDeal = (dealName || "Deal").replace(/[^a-zA-Z0-9 ]/g, "").slice(0, 25);
      const tabName = safeDeal + " - " + dealStage + " - " + dealDate;

      // Add new sheet tab
      const addRes = await gsRequest("POST",
        "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + ":batchUpdate",
        { requests: [{ addSheet: { properties: { title: tabName } } }] }
      );
      const newSheetId = addRes.replies[0].addSheet.properties.sheetId;

      // Build data: metadata block + headers + rows
      const meta = [
        ["Deal Name", dealName], ["Seller", dealSeller], ["Date", dealDate],
        ["Stage", dealStage], ["Status", dealStatus], ["Offer %", discount + "%"],
        ["Condition", condQuality], ["TCG Fee %", tcgFee + "%"],
        ["Proc Fee %", procFee + "%"], ["Sold %", soldPct + "%"],
        ["Collection Cost", collCost], ["Notes", dealNotes], [],
        ["Name","Set","Foil","Variant","Qty","Cond","Low","Mid","High",
         "Offer Price","Mkt Total","TCG Fee","Proc Fee","Net Revenue","COGS/Card","Source"],
        ...results.map(r => [
          r.name, r.set, r.isFoil?"Yes":"", r.variant||"", r.qty, r.condition||condQuality,
          r.low?.toFixed(2)||"", r.mid?.toFixed(2)||"", r.high?.toFixed(2)||"",
          r.offerPrice?.toFixed(2)||"",
          r.marketPrice!=null?(r.marketPrice*r.qty).toFixed(2):"",
          r.tcgFee?.toFixed(2)||"", r.procFee?.toFixed(2)||"",
          r.netRevenue?.toFixed(2)||"", r.cogs?.toFixed(2)||"", r.source||"csv"
        ])
      ];

      await gsRequest("PUT",
        "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + "/values/" + encodeURIComponent(tabName) + "!A1?valueInputOption=USER_ENTERED",
        { values: meta }
      );

      // Bold the header row (row 14 = index 13)
      await gsRequest("POST",
        "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + ":batchUpdate",
        { requests: [{
          repeatCell: {
            range: { sheetId: newSheetId, startRowIndex: 13, endRowIndex: 14 },
            cell: { userEnteredFormat: { textFormat: { bold: true } } },
            fields: "userEnteredFormat.textFormat"
          }
        }]}
      );

      // Upsert Deal Log row
      const logRange = await gsRequest("GET",
        "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + "/values/Deal%20Log!A:A"
      );
      const logRows = logRange.values || [[]];
      const existingRow = logRows.findIndex((r,i) => i > 0 && r[0] === dealName);
      const logRow = [dealName, dealSeller, dealDate, dealStage, collCost,
        results.reduce((s,r) => s+r.qty, 0), dealStatus,
        dealStage === "Intake" ? fmtL(totals.market) : "",
        dealStage === "Intake" ? fmtL(totals.netRev) : "",
        fmtL(totals.totalFees),
        dealStage !== "Intake" ? fmtL(totals.netRev) : "",
        costNum > 0 ? fmtL(grossProfit) : "",
        roi != null ? roi.toFixed(1) + "%" : "",
        dealNotes, tabName
      ];

      if(existingRow > 0) {
        await gsRequest("PUT",
          "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + "/values/Deal%20Log!A" + (existingRow+1) + "?valueInputOption=USER_ENTERED",
          { values: [logRow] }
        );
      } else {
        const nextRow = logRows.length + 1;
        await gsRequest("PUT",
          "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + "/values/Deal%20Log!A" + nextRow + "?valueInputOption=USER_ENTERED",
          { values: [logRow] }
        );
      }

      // Always also save local CSV backup
      exportSnapshot();
      setGsMsg("Saved to Sheets + CSV downloaded as backup.");
      // Refresh dashboard deal list
      if(dealLog.length || gsSheetId) gsLoadDashboard();
    } catch(e) {
      setGsStatus("error");
      setGsMsg("Error: " + e.message);
    }
  };

  // -- Dashboard: load deal log from Sheets ----------------------------------
  const gsLoadDashboard = async () => {
    if(!gsToken || !gsSheetId) return;
    setDashLoading(true); setDashMsg("Loading...");
    try {
      // Get all sheet tab names
      const meta = await gsRequest("GET",
        "https://sheets.googleapis.com/v4/spreadsheets/" + gsSheetId + "?fields=sheets.properties"
      );
      const tabs = (meta.sheets||[]).map(s => s.properties.title);
      setAllSheetTabs(tabs);

      // Load Deal Log
      const logData = await gsRequest("GET",
        "https://sheets.googleapis.com/v4/spreadsheets/" + gsSheetId +
        "/values/Deal%20Log!A1:O200"
      );
      const rows = logData.values || [];
      if(rows.length < 2) { setDealLog([]); setDashLoading(false); setDashMsg(""); return; }
      const headers = rows[0].map(h => h.toLowerCase().trim());
      const deals = rows.slice(1).filter(r => r[0]).map((r, idx) => {
        const d = { _rowIdx: idx + 2 };
        headers.forEach((h, i) => d[h] = r[i] || "");
        return d;
      });
      setDealLog(deals);

      // Build snapshot map: group tabs by deal name
      const snapMap = {};
      deals.forEach(d => { snapMap[d["deal name"]] = []; });
      tabs.forEach(tab => {
        if(tab === "Deal Log" || tab === "Dashboard") return;
        // Match tab to deal: tab format is "DealName - Stage - Date"
        deals.forEach(d => {
          const safeName = (d["deal name"]||"").replace(/[^a-zA-Z0-9 ]/g,"").slice(0,25).trim();
          if(tab.startsWith(safeName + " -") || tab.startsWith(d["deal name"] + " -")) {
            if(!snapMap[d["deal name"]]) snapMap[d["deal name"]] = [];
            snapMap[d["deal name"]].push(tab);
          }
        });
      });
      setSnapshots(snapMap);
      setDashMsg("Last synced: " + new Date().toLocaleTimeString());
    } catch(e) {
      setDashMsg("Error loading: " + e.message);
    }
    setDashLoading(false);
  };

  // Auto-load dashboard when tab is opened and connected
  useEffect(() => {
    if(activeTab === "dashboard" && gsToken && gsSheetId && !dealLog.length) {
      gsLoadDashboard();
    }
  }, [activeTab, gsToken, gsSheetId]);

  // -- Dashboard: delete a deal -----------------------------------------------
  const gsDeleteDeal = async (deal) => {
    if(!window.confirm("Delete deal: " + deal["deal name"] + "? This removes it from the Deal Log but does not delete snapshot tabs.")) return;
    try {
      // Clear the row by writing empty values
      await gsRequest("PUT",
        "https://sheets.googleapis.com/v4/spreadsheets/" + gsSheetId +
        "/values/Deal%20Log!A" + deal._rowIdx + ":O" + deal._rowIdx + "?valueInputOption=USER_ENTERED",
        { values: [Array(15).fill("")] }
      );
      setDealLog(prev => prev.filter(d => d._rowIdx !== deal._rowIdx));
    } catch(e) { setDashMsg("Delete error: " + e.message); }
  };

  // -- Dashboard: save inline edit --------------------------------------------
  const gsSaveEdit = async (deal, field, value) => {
    const fieldColMap = {
      "deal name": "A", "seller": "B", "date": "C", "stage": "D",
      "offered ($)": "E", "status": "G", "notes": "N"
    };
    const col = fieldColMap[field.toLowerCase()];
    if(!col) return;
    try {
      await gsRequest("PUT",
        "https://sheets.googleapis.com/v4/spreadsheets/" + gsSheetId +
        "/values/Deal%20Log!" + col + deal._rowIdx + "?valueInputOption=USER_ENTERED",
        { values: [[value]] }
      );
      setDealLog(prev => prev.map(d => d._rowIdx === deal._rowIdx ? {...d, [field]: value} : d));
    } catch(e) { setDashMsg("Save error: " + e.message); }
    setEditingDeal(null);
  };

  // -- Dashboard: load snapshot into valuation tab ----------------------------
  const gsLoadSnapshot = async (tabName) => {
    if(!gsToken || !gsSheetId) return;
    setDashMsg("Loading snapshot...");
    try {
      const data = await gsRequest("GET",
        "https://sheets.googleapis.com/v4/spreadsheets/" + gsSheetId +
        "/values/" + encodeURIComponent(tabName) + "!A1:R2000"
      );
      const rows = data.values || [];
      const { meta, cards: parsed } = parseSnapshotRows(rows);
      if(!parsed.length) { setDashMsg("Could not find card data in snapshot."); return; }
      // Restore settings
      if(meta["deal name"]) setDealName(meta["deal name"]);
      if(meta["seller"])    setDealSeller(meta["seller"]);
      if(meta["date"])      setDealDate(meta["date"]);
      if(meta["stage"])     setDealStage(meta["stage"]);
      if(meta["status"])    setDealStatus(meta["status"]);
      if(meta["notes"])      setDealNotes(meta["notes"]);
      if(meta["offer %"])    setDiscount(parseFloat(meta["offer %"])||90);
      if(meta["condition"])  setCondQuality(meta["condition"]||"NM");
      if(meta["tcg fee %"])  setTcgFee(parseFloat(meta["tcg fee %"])||10.75);
      if(meta["proc fee %"]) setProcFee(parseFloat(meta["proc fee %"])||2.5);
      if(meta["collection cost"]) setCollCost(meta["collection cost"]);
      setCards(parsed);
      setFileName(tabName + " (from Sheets)");
      setStatus("ready");
      setActiveTab("valuation");
      setDashMsg("");
    } catch(e) { setDashMsg("Load error: " + e.message); }
  };

  // -- Dashboard KPI calculations ---------------------------------------------
  const dashKPIs = React.useMemo(() => {
    if(!dealLog.length) return null;
    const closed = dealLog.filter(d => d["status"]==="Closed");
    const active = dealLog.filter(d => ["Active","Evaluating","Listed"].includes(d["status"]));
    const totalInvested = dealLog.reduce((s,d) => s + (parseFloat(d["offered ($)"])||0), 0);
    const totalNetRev   = closed.reduce((s,d)  => s + (parseDollar(d["actual netrev"])||parseDollar(d["intake netrev"])||0), 0);
    const totalFees     = dealLog.reduce((s,d)  => s + (parseDollar(d["total fees"])||0), 0);
    const totalPL       = closed.reduce((s,d)   => s + (parseDollar(d["p&l"])||0), 0);
    const rois          = closed.map(d => parseFloat(d["roi"])).filter(n => !isNaN(n));
    const avgROI        = rois.length ? rois.reduce((a,b)=>a+b,0)/rois.length : null;
    const totalCards    = dealLog.reduce((s,d) => s + (parseInt(d["cards"])||0), 0);
    const best          = closed.sort((a,b) => (parseDollar(b["p&l"])||0)-(parseDollar(a["p&l"])||0))[0];
    return { total: dealLog.length, active: active.length, totalInvested, totalNetRev,
      totalFees, totalPL, avgROI, totalCards, best };
  }, [dealLog]);

  // -- Load a Sheets snapshot into compare slot -----------------------------
  const gsLoadSnapshotIntoCompare = async (tabName, slot) => {
    if(!gsToken || !gsSheetId || !tabName) return;
    if(slot === "A") setCmpLoadingA(true); else setCmpLoadingB(true);
    try {
      const data = await gsRequest("GET",
        "https://sheets.googleapis.com/v4/spreadsheets/" + gsSheetId +
        "/values/" + encodeURIComponent(tabName) + "!A1:R2000"
      );
      const rows = data.values || [];
      const parsed = parseSnapshotRows(rows);
      if(slot === "A") { setCmpFileA(tabName); setCmpDataA(parsed); }
      else             { setCmpFileB(tabName); setCmpDataB(parsed); }
    } catch(e) {
      if(slot === "A") setCmpFileA("Error: " + e.message);
      else             setCmpFileB("Error: " + e.message);
    }
    if(slot === "A") setCmpLoadingA(false); else setCmpLoadingB(false);
  };

  const applyMode  = m  => { setPriceMode(m);  if(status==="done") setResults(prev => buildResults(prev, m, tcgFee, procFee, costNum, discount, condQuality, soldPct)); };
  const applyTcg   = v  => { setTcgFee(v);     if(status==="done") setResults(prev => buildResults(prev, priceMode, v, procFee, costNum, discount, condQuality, soldPct)); };
  const applyProc  = v  => { setProcFee(v);    if(status==="done") setResults(prev => buildResults(prev, priceMode, tcgFee, v, costNum, discount, condQuality, soldPct)); };

  const df       = discount / 100;
  const costNum  = parseFloat(collCost.replace(/[^0-9.]/g,"")) || 0;
  const combined = tcgFee + procFee;

  // Full liquidation totals (100% sold)
  const totals = results.reduce((a, r) => ({
    market:    a.market    + (r.marketPrice != null ? r.marketPrice * r.qty : 0),
    offer:     a.offer     + (r.offerPrice  != null ? r.offerPrice  * r.qty : 0),
    tcgFees:   a.tcgFees   + (r.tcgFee     != null ? r.tcgFee      * r.qty : 0),
    procFees:  a.procFees  + (r.procFee    != null ? r.procFee     * r.qty : 0),
    totalFees: a.totalFees + (r.totalFee   != null ? r.totalFee    * r.qty : 0),
    netRev:    a.netRev    + (r.netRevenue != null ? r.netRevenue  * r.qty : 0),
    totalCogs: a.totalCogs + (r.cogs       != null ? r.cogs        * r.qty : 0),
    found:     a.found     + (r.found ? 1 : 0),
    qty:       a.qty       + r.qty,
  }), { market:0, offer:0, tcgFees:0, procFees:0, totalFees:0, netRev:0, totalCogs:0, found:0, qty:0 });

  // Partial sold scenario -- soldPct% of total quantity sells
  const sf = soldPct / 100;
  // Revenue and fees only on sold portion
  const partialNetRev   = totals.netRev    * sf;
  const partialFees     = totals.totalFees * sf;
  const partialTcgFees  = totals.tcgFees   * sf;
  const partialProcFees = totals.procFees  * sf;

  // Scenario A: sunk cost -- full collection cost regardless of how much sells
  const plSunkCost      = partialNetRev - costNum;
  const roiSunkCost     = costNum > 0 ? (plSunkCost / costNum) * 100 : null;

  // Scenario B: proportional -- only allocate cost to cards that sell
  const propCost        = costNum * sf;
  const plPropCost      = partialNetRev - propCost;
  const roiPropCost     = propCost > 0 ? (plPropCost / propCost) * 100 : null;

  // Full liquidation P&L
  const grossProfit     = totals.netRev - costNum;
  const roi             = costNum > 0 ? (grossProfit / costNum) * 100 : null;

  // Time estimate at 10% weekly sell-through
  const weeksToSell     = soldPct < 100 ? Math.ceil(soldPct / 10) : null;

  const filtered = results.filter(r => {
    if(filter && !((r.name||"").toLowerCase().includes(filter.toLowerCase()) || (r.set||"").toLowerCase().includes(filter.toLowerCase()))) return false;
    if(foilFilter === "foil"    && !r.isFoil) return false;
    if(foilFilter === "nonfoil" &&  r.isFoil) return false;
    return true;
  });

  const sorted = [...filtered].sort((a, b) => {
    const g = r => ({
      name:     (r.name||"").toLowerCase(),
      set:      (r.set||"").toLowerCase(),
      qty:      r.qty,
      price:    r.marketPrice ?? -1,
      total:    (r.marketPrice ?? 0) * r.qty,
      netTotal: (r.netRevenue  ?? 0) * r.qty,
      fee:      (r.totalFee    ?? 0) * r.qty,
      cogs:     (r.cogs         ?? 0) * r.qty,
    })[sortCol] ?? 0;
    const av = g(a), bv = g(b);
    if(typeof av === "string") return sortDir === "asc" ? av.localeCompare(bv) : bv.localeCompare(av);
    return sortDir === "asc" ? av - bv : bv - av;
  });

  // Compare stats
  const cmpStats = cmpDiff ? {
    missing:    cmpDiff.filter(r => r.status==="MISSING").length,
    extra:      cmpDiff.filter(r => r.status==="EXTRA").length,
    qtyChange:  cmpDiff.filter(r => r.status==="QTY_CHANGE").length,
    priceMove:  cmpDiff.filter(r => r.status==="PRICE_MOVE").length,
    mktValA:    (cmpDataA?.cards||[]).reduce((s,c) => s+(c.mktTotal||0),0),
    mktValB:    (cmpDataB?.cards||[]).reduce((s,c) => s+(c.mktTotal||0),0),
    netRevA:    (cmpDataA?.cards||[]).reduce((s,c) => s+((c.netRevenue||0)*c.qty),0),
    netRevB:    (cmpDataB?.cards||[]).reduce((s,c) => s+((c.netRevenue||0)*c.qty),0),
  } : null;

  const cmpFiltered = (cmpDiff||[]).filter(r => cmpFilter==="all" || r.status===cmpFilter);

  // Export compare diff
  const exportDiff = () => {
    if(!cmpDiff) return;
    const headers = ["Name","Set","Foil","Intake Qty","Actual Qty","Qty Delta",
      "Intake Cond","Actual Cond","Intake Mid","Actual Mid","Price Delta",
      "Intake NetRev","Actual NetRev","Intake COGS","Actual COGS","Status"];
    const rows = cmpDiff.map(r => [
      r.name, r.set, r.isFoil?"Yes":"",
      r.qtyA||"", r.qtyB||"", r.qtyDelta||"",
      r.condA||"", r.condB||"",
      r.midA?.toFixed(2)||"", r.midB?.toFixed(2)||"",
      r.priceDelta?.toFixed(2)||"",
      r.netRevA?.toFixed(2)||"", r.netRevB?.toFixed(2)||"",
      r.cogsA?.toFixed(2)||"", r.cogsB?.toFixed(2)||"",
      r.status
    ]);
    const csv = [headers, ...rows].map(r => r.map(v => '"'+v+'"').join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], {type:"text/csv"}));
    a.download = "compare-diff.csv"; a.click();
  };

  const ts = col => { if(sortCol === col) setSortDir(d => d==="asc"?"desc":"asc"); else { setSortCol(col); setSortDir("desc"); } };
  const th = (col, label, ex) => (
    <th key={col} className={(ex||"") + " " + (sortCol===col?"act":"")} onClick={() => ts(col)}>
      {label}{sortCol===col ? (sortDir==="asc" ? " ^" : " v") : ""}
    </th>
  );

  const badge = r => {
    if(r.isFoil)  return <span className="bp bfoil">Foil</span>;
    if(r.variant) return <span className="bp bvar">{r.variant}</span>;
    return <span className="bp bnm">NM</span>;
  };

  const exportCSV = () => {
    const rows = [
      ["Name","Set","Foil","Variant","Qty","Low","Mid","High","Price Used","Adj Price","Mkt Total","TCG Fee","Proc Fee","Total Fees","Net Revenue","COGS Per Card","Your Offer","Source"],
      ...sorted.map(r => {
        const mt  = r.marketPrice != null ? (r.marketPrice * r.qty).toFixed(2) : "";
        const tf  = r.tcgFee      != null ? (r.tcgFee      * r.qty).toFixed(2) : "";
        const pf  = r.procFee     != null ? (r.procFee     * r.qty).toFixed(2) : "";
        const totf= r.totalFee    != null ? (r.totalFee    * r.qty).toFixed(2) : "";
        const net = r.netRevenue  != null ? (r.netRevenue  * r.qty).toFixed(2) : "";
        const off  = r.offerPrice != null ? (r.offerPrice * r.qty).toFixed(2) : "";
        const cogs = r.cogs != null ? r.cogs.toFixed(2) : "";
        return [r.name, r.set, r.isFoil?"Yes":"", r.variant||"", r.qty,
          r.low?.toFixed(2)||"", r.mid?.toFixed(2)||"", r.high?.toFixed(2)||"",
          r.marketPrice?.toFixed(2)||"", r.adjPrice?.toFixed(2)||"",
          mt, tf, pf, totf, net, cogs, off, r.source||"csv"];
      })
    ].map(r => r.map(v => '"' + v + '"').join(",")).join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([rows], {type:"text/csv"}));
    a.download = "mtg_valuation.csv"; a.click();
  };

  const isFetching  = status === "fetching";
  const notFound    = results.filter(r => !r.found).length;
  const needsSFCount = cards.filter(c => c.low==null && c.mid==null && c.high==null).length;

  return (
    <>
      <style>{css}</style>
      <div className="app">
        <header className="hdr">
          <h1>MTG Collection Valuation</h1>
          <small>TCGplayer CSV + fees + daily prices</small>
        </header>

        <main className="main">

          {/* Tab bar */}
          <div className="tabs">
            {[["dashboard","Dashboard"], ["valuation","Valuation"], ["compare","Compare"]].map(([id,lbl]) => (
              <button key={id} className={"tab" + (activeTab===id?" active":"")} onClick={() => setActiveTab(id)}>
                {lbl}
              </button>
            ))}
            {activeTab==="valuation" && dealName && (
              <span style={{marginLeft:"auto",fontFamily:"var(--fd)",fontSize:9,color:"var(--mut)",
                letterSpacing:".1em",textTransform:"uppercase",padding:"9px 0"}}>
                {dealName + " -- " + dealStage + " -- " + dealStatus}
              </span>
            )}
          </div>

          {activeTab === "valuation" && <>

          {/* Summary bar */}
          <div className="sg">
            <div className="sc inp">
              <div className="lbl"><span className="tt">Collection Cost ($)<span className="tt-icon">?</span><span className="tt-box">The total amount you paid or plan to pay for this collection. Used as the cost basis for all P&L calculations.</span></span></div>
              <input value={collCost} onChange={e => applyCollCost(e.target.value)} placeholder="0.00" />
            </div>
            <div className="sc">
              <div className="lbl"><span className="tt">{"Market Value (" + priceMode + ")"}<span className="tt-icon">?</span><span className="tt-box">Total TCGplayer market value of all cards at the selected price column (Low / Mid / High) and condition multiplier.</span></span></div>
              <div className="val">{status==="done" ? fmtL(totals.market) : "--"}</div>
            </div>
            <div className="sc">
              <div className="lbl"><span className="tt">{"Offer Total @ " + discount + "%"}<span className="tt-icon">?</span><span className="tt-box">Your buy offer to the seller. Calculated as Market Value x Condition x Offer %. This is what you pay.</span></span></div>
              <div className="val teal">{status==="done" ? fmtL(totals.offer) : "--"}</div>
            </div>
            <div className="sc">
              <div className="lbl"><span className="tt">Fees @ 100% sold<span className="tt-icon">?</span><span className="tt-box">Total TCGplayer marketplace and payment processing fees if you sell every card. Fees apply only to cards that sell.</span></span></div>
              <div className="val red">{status==="done" ? fmtL(totals.totalFees) : "--"}</div>
              {status==="done" && (
                <div style={{fontSize:10,color:"var(--mut)",marginTop:3}}>
                  {"TCG " + fmtL(totals.tcgFees) + " + Proc " + fmtL(totals.procFees)}
                </div>
              )}
            </div>
            <div className="sc">
              <div className="lbl"><span className="tt">Net Rev @ 100% sold<span className="tt-icon">?</span><span className="tt-box">What you keep after fees if every card sells. Formula: Offer Total x Sold% minus Total Fees.</span></span></div>
              <div className="val">{status==="done" ? fmtL(totals.netRev) : "--"}</div>
            </div>
            <div className="sc">
              <div className="lbl"><span className="tt">Full Liq. P&L<span className="tt-icon">?</span><span className="tt-box">Profit or loss if 100% of cards sell. Net Revenue minus your Collection Cost. ROI = P&L / Collection Cost.</span></span></div>
              <div className={"val " + (grossProfit >= 0 ? "grn" : "red")}>
                {status==="done" && costNum > 0 ? (
                  <>
                    {fmtL(grossProfit)}
                    {roi != null && <div style={{fontSize:10,marginTop:2,color:roi>=0?"var(--grn)":"var(--red)"}}>{(roi>=0?"+":"") + roi.toFixed(1) + "% ROI"}</div>}
                  </>
                ) : "--"}
              </div>
            </div>
            <div className="sc scenario">
              <div className="sc-grp-lbl">{soldPct + "% sold" + (weeksToSell ? " (~" + weeksToSell + "wk)" : "")}</div>
              <div className="lbl"><span className="tt">Sunk Cost P&L<span className="tt-icon">?</span><span className="tt-box">P&L at your sold% setting, treating the full collection cost as already spent. Worst-case view: you paid for everything whether it sells or not.</span></span></div>
              <div className={"val " + (plSunkCost >= 0 ? "grn" : "red")}>
                {status==="done" && costNum > 0 ? (
                  <>
                    {fmtL(plSunkCost)}
                    {roiSunkCost != null && <div style={{fontSize:10,marginTop:2,color:roiSunkCost>=0?"var(--grn)":"var(--red)"}}>{(roiSunkCost>=0?"+":"") + roiSunkCost.toFixed(1) + "% ROI"}</div>}
                  </>
                ) : "--"}
              </div>
            </div>
            <div className="sc scenario">
              <div className="sc-grp-lbl">{"Net Rev @ " + soldPct + "%"}</div>
              <div className="lbl"><span className="tt">{"Net Rev @ " + soldPct + "%"}<span className="tt-icon">?</span><span className="tt-box">Net revenue collected on the portion of inventory that sells, after fees. Based on sold% of total quantity.</span></span></div>
              <div className="val">{status==="done" ? fmtL(partialNetRev) : "--"}</div>
            </div>
            <div className="sc scenario-b">
              <div className="sc-grp-lbl">{soldPct + "% sold (prop. cost)"}</div>
              <div className="lbl"><span className="tt">Proportional P&L<span className="tt-icon">?</span><span className="tt-box">P&L on sold cards only, allocating only their share of the collection cost. Shows per-unit profitability independent of unsold inventory.</span></span></div>
              <div className={"val " + (plPropCost >= 0 ? "grn" : "red")}>
                {status==="done" && costNum > 0 ? (
                  <>
                    {fmtL(plPropCost)}
                    {roiPropCost != null && <div style={{fontSize:10,marginTop:2,color:roiPropCost>=0?"var(--grn)":"var(--red)"}}>{(roiPropCost>=0?"+":"") + roiPropCost.toFixed(1) + "% ROI"}</div>}
                  </>
                ) : "--"}
              </div>
            </div>
          </div>

          <div className="ws">

            {/* Left column */}
            <div style={{display:"flex",flexDirection:"column",gap:12}}>

              {/* Upload */}
              <div className="panel">
                <div className="ph">Import Collection</div>
                <div className="pb">
                  <div
                    className={"dropzone" + (isDragOver?" over":"") + (fileName?" file-loaded":"")}
                    onDragOver={e => { e.preventDefault(); setIsDragOver(true); }}
                    onDragLeave={() => setIsDragOver(false)}
                    onDrop={onDrop}
                  >
                    <input type="file" accept=".csv" onChange={onFileChange} />
                    <div className="dz-icon">{fileName ? "OK" : "^"}</div>
                    <div className="dz-txt">{fileName ? "File loaded" : "Drop CSV or click to browse"}</div>
                    {fileName
                      ? <div className="file-name">{fileName + " - " + cards.length + " cards"}</div>
                      : <div className="dz-sub">TCGplayer collection export (.csv)</div>}
                  </div>
                  {err && <p className="err">{err}</p>}
                </div>
              </div>

              {/* Price + Offer */}
              <div className="panel">
                <div className="ph">Price &amp; Offer</div>
                <div className="pb">
                  <div style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".12em",textTransform:"uppercase",color:"var(--mut)",marginBottom:6}}>
                    Price Column
                  </div>
                  <div className="seg">
                    {["low","mid","high"].map(m => (
                      <button key={m} className={priceMode===m?"active":""} onClick={() => applyMode(m)}>
                        {m.charAt(0).toUpperCase() + m.slice(1)}
                      </button>
                    ))}
                  </div>

                  <div style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".12em",textTransform:"uppercase",color:"var(--mut)",marginTop:14,marginBottom:4}}>
                    Collection Condition
                  </div>
                  <div className="cond-grid">
                    {COND_LABELS.map(c => (
                      <button key={c.key} className={"cond-btn" + (condQuality===c.key?" active":"")} onClick={() => applyCond(c.key)}>
                        {c.key}
                        <span className="cond-pct">{(c.mult*100).toFixed(0) + "%"}</span>
                      </button>
                    ))}
                  </div>
                  <div style={{fontSize:10,color:"var(--mut)",fontStyle:"italic",marginTop:5}}>
                    {COND_LABELS.find(c => c.key===condQuality)?.label + " -- " + (COND_MULT[condQuality]*100).toFixed(0) + "% of market price"}
                  </div>

                  <div className="srow" style={{marginTop:14}}>
                    <label>Offer %</label>
                    <input type="range" min={40} max={100} value={discount} onChange={e => applyDiscount(+e.target.value)} />
                    <span className="sval">{discount + "%"}</span>
                  </div>

                  <div style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".12em",textTransform:"uppercase",color:"var(--mut)",marginTop:14,marginBottom:2}}>
                    % of Collection Sold
                  </div>
                  <div className="srow" style={{marginTop:4}}>
                    <label>Sold %</label>
                    <input type="range" min={10} max={100} step={5} value={soldPct} onChange={e => applySold(+e.target.value)} />
                    <span className="sval">{soldPct + "%"}</span>
                  </div>
                  <div className="sold-note">
                    {soldPct < 100
                      ? soldPct + "% of qty sold = ~" + Math.ceil(soldPct/10) + " weeks at 10%/wk sell-through"
                      : "100% sold -- full liquidation scenario"}
                  </div>
                </div>
              </div>

              {/* Fees */}
              <div className="panel">
                <div className="ph">Fees</div>
                <div className="pb">
                  <div className="fee-row">
                    <label>TCGplayer Marketplace</label>
                    <input type="number" step="0.25" min={0} max={25} value={tcgFee}
                      onChange={e => applyTcg(parseFloat(e.target.value) || 0)} />
                    <span>%</span>
                  </div>
                  <div className="fee-row">
                    <label>Payment Processing</label>
                    <input type="number" step="0.1" min={0} max={10} value={procFee}
                      onChange={e => applyProc(parseFloat(e.target.value) || 0)} />
                    <span>%</span>
                  </div>
                  <div className="fee-combined">{"Combined: " + pct(combined) + " total"}</div>

                  <hr className="fee-divider" />

                  <div style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)",marginBottom:4}}>
                    Seller Tiers
                  </div>
                  {TIERS.map(t => (
                    <button key={t.val} className={"tier-btn" + (tcgFee===t.val?" active":"")} onClick={() => applyTcg(t.val)}>
                      {t.label + " -- " + t.val + "%"}
                    </button>
                  ))}

                  {status === "done" && (
                    <div style={{marginTop:12}}>
                      <div className="fee-total-row">
                        <span>TCG Fees</span><span>{fmtL(totals.tcgFees)}</span>
                      </div>
                      <div className="fee-total-row">
                        <span>Processing Fees</span><span>{fmtL(totals.procFees)}</span>
                      </div>
                      <div className="fee-total-row highlight">
                        <span>Total Fees</span><span>{fmtL(totals.totalFees)}</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Deal Tracker */}
              <div className="panel">
                <div className="ph">
                  Deal Tracker
                  <span className={"bp " + (gsStatus==="connected"?"bnm":gsStatus==="connecting"?"blp":gsStatus==="error"?"bfoil":"bvar")}
                    style={{fontSize:7}}>
                    {gsStatus==="connected" ? "Sheets Connected" : gsStatus==="connecting" ? "Connecting..." : gsStatus==="error" ? "Error" : "Not Connected"}
                  </span>
                </div>
                <div className="pb">

                  {/* Google Sheets connect/disconnect */}
                  {gsStatus !== "connected" ? (
                    <button className="snap-btn" style={{marginBottom:10,background:"rgba(58,184,122,.1)",borderColor:"rgba(58,184,122,.3)"}}
                      onClick={gsConnect}>
                      <span style={{color:"var(--grn)"}}>Connect Google Sheets</span>
                      <span style={{marginLeft:"auto",fontSize:9,color:"var(--mut)"}}>Sign in with Google</span>
                    </button>
                  ) : (
                    <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:10,padding:"7px 10px",
                      background:"rgba(58,184,122,.07)",border:"1px solid rgba(58,184,122,.25)",borderRadius:3}}>
                      <span style={{fontFamily:"var(--fd)",fontSize:9,color:"var(--grn)",flex:1}}>
                        {gsSheetName || "MTG Deal Tracker"}
                      </span>
                      {gsSheetId && (
                        <a href={"https://docs.google.com/spreadsheets/d/" + gsSheetId} target="_blank" rel="noreferrer"
                          style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--teal)",textDecoration:"none",letterSpacing:".08em"}}>
                          Open Sheet
                        </a>
                      )}
                      <button onClick={gsDisconnect}
                        style={{background:"none",border:"none",color:"var(--mut)",fontSize:10,cursor:"pointer",padding:"0 2px"}}>
                        x
                      </button>
                    </div>
                  )}

                  {gsMsg && (
                    <div style={{fontSize:10,color:gsStatus==="error"?"var(--red)":"var(--grn)",fontStyle:"italic",marginBottom:8,padding:"5px 8px",
                      background:gsStatus==="error"?"rgba(201,64,64,.08)":"rgba(58,184,122,.07)",borderRadius:3}}>
                      {gsMsg}
                    </div>
                  )}

                  <div className="deal-grid">
                    <div className="deal-field" style={{gridColumn:"1/-1"}}>
                      <label>Deal Name</label>
                      <input value={dealName} onChange={e=>setDealName(e.target.value)} placeholder="e.g. Smith Collection" />
                    </div>
                    <div className="deal-field">
                      <label>Seller</label>
                      <input value={dealSeller} onChange={e=>setDealSeller(e.target.value)} placeholder="Seller name" />
                    </div>
                    <div className="deal-field">
                      <label>Date</label>
                      <input type="date" value={dealDate} onChange={e=>setDealDate(e.target.value)} />
                    </div>
                    <div className="deal-field">
                      <label>Stage</label>
                      <select value={dealStage} onChange={e=>setDealStage(e.target.value)}>
                        <option>Intake</option>
                        <option>Actual Scan</option>
                        <option>Listed</option>
                        <option>Final</option>
                      </select>
                    </div>
                    <div className="deal-field">
                      <label>Status</label>
                      <select value={dealStatus} onChange={e=>setDealStatus(e.target.value)}>
                        <option>Evaluating</option>
                        <option>Active</option>
                        <option>Listed</option>
                        <option>Closed</option>
                      </select>
                    </div>
                    <div className="deal-field" style={{gridColumn:"1/-1"}}>
                      <label>Notes</label>
                      <input value={dealNotes} onChange={e=>setDealNotes(e.target.value)} placeholder="Optional notes" />
                    </div>
                  </div>

                  {/* Save buttons */}
                  {gsStatus === "connected" ? (
                    <button className="snap-btn" onClick={gsSaveSnapshot} disabled={!results.length || !dealName}>
                      <span>Save to Google Sheets</span>
                      <span style={{marginLeft:"auto",fontSize:9,color:"var(--mut)"}}>
                        {dealName ? dealName + " - " + dealStage : "Fill in deal name first"}
                      </span>
                    </button>
                  ) : (
                    <button className="snap-btn" onClick={exportSnapshot} disabled={!results.length}>
                      <span>Save Snapshot CSV</span>
                      <span style={{marginLeft:"auto",fontSize:9,color:"var(--mut)"}}>
                        {dealName ? dealName + " - " + dealStage : "Fill in deal name first"}
                      </span>
                    </button>
                  )}
                  <div style={{fontSize:10,color:"var(--mut)",fontStyle:"italic",marginTop:6,lineHeight:1.5}}>
                    {gsStatus === "connected"
                      ? "Saves snapshot as a new tab + updates Deal Log in your Google Sheet."
                      : "Connect Google Sheets above to save directly, or export CSV to save manually."}
                  </div>
                </div>
              </div>

              {/* Process */}
              <div className="panel">
                <div className="ph">Process</div>
                <div className="pb">
                  <button className="btn" onClick={run} disabled={isFetching || status==="idle"}>
                    {isFetching ? "Processing..." : status==="done" ? "Refresh" : "Calculate Values"}
                  </button>
                  {isFetching && (
                    <button className="btn sec" onClick={() => { abortRef.current = true; }}>Stop</button>
                  )}
                  {isFetching && (
                    <div className="prog">
                      <div className="prog-bg"><div className="prog-fill" style={{width: prog + "%"}} /></div>
                      <p className="prog-txt">{progMsg || "Processing..."}</p>
                    </div>
                  )}
                  {status==="ready" && needsSFCount > 0 && (
                    <p className="note">{needsSFCount + " cards missing prices -- will fetch from Scryfall."}</p>
                  )}
                  {status==="ready" && needsSFCount === 0 && (
                    <p className="note">All prices found in CSV -- no API calls needed.</p>
                  )}
                </div>
              </div>
            </div>

            {/* Results */}
            <div className="panel res-panel">
              <div className="ph">
                Results
                {status==="done" && notFound > 0 && (
                  <span style={{color:"var(--red)",fontSize:"9px"}}>{notFound + " missing price"}</span>
                )}
              </div>

              {status==="done" && (
                <div className="fbar">
                  <label>Filter:</label>
                  <input type="text" placeholder="Card name or set..." value={filter} onChange={e => setFilter(e.target.value)} />
                  <label>Type:</label>
                  <select value={foilFilter} onChange={e => setFoilFilter(e.target.value)}>
                    <option value="all">All</option>
                    <option value="foil">Foil only</option>
                    <option value="nonfoil">Non-foil only</option>
                  </select>
                  <span style={{marginLeft:"auto",fontSize:12,color:"var(--mut)",fontStyle:"italic"}}>
                    {sorted.length + " of " + results.length + " cards"}
                  </span>
                </div>
              )}

              <div className="tbl-wrap">
                {status !== "done" ? (
                  <div className="empty">
                    <div className="ico">[ ]</div>
                    <p>{status==="ready" ? "Click Calculate Values to begin" : "Upload a TCGplayer CSV to begin"}</p>
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        {th("name", "Card Name")}
                        {th("set", "Set")}
                        <th>Type</th>
                        {th("qty", "Qty", "right")}
                        {th("price", priceMode.charAt(0).toUpperCase() + priceMode.slice(1) + " Price", "right")}
                        {th("total", "Mkt Total", "right")}
                        {th("fee", "Fees (" + pct(combined) + ")", "right")}
                        {th("netTotal", "Net Revenue", "right")}
                        {th("cogs", "COGS / Card", "right")}
                        <th className="right">{"Your Offer @ " + discount + "%"}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {sorted.map((r, i) => {
                        const total = r.marketPrice != null ? r.marketPrice * r.qty : null;
                        const fees  = r.totalFee    != null ? r.totalFee    * r.qty : null;
                        const net   = r.netRevenue  != null ? r.netRevenue  * r.qty : null;
                        const offer = r.offerPrice  != null ? r.offerPrice  * r.qty : null;
                        return (
                          <tr key={i} className={!r.found ? "miss" : ""}>
                            <td className="nm" title={r.name}>
                              {r.scryfallUri
                                ? <a href={r.scryfallUri} target="_blank" rel="noreferrer" style={{color:"inherit",textDecoration:"none"}}>{r.name}</a>
                                : r.name}
                            </td>
                            <td className="setcol" title={r.set}>{r.set || "--"}</td>
                            <td>{badge(r)}</td>
                            <td className="right">{r.qty}</td>
                            <td className="gd right">{r.found ? fmt(r.marketPrice) : <span style={{color:"var(--mut)",fontSize:11}}>--</span>}</td>
                            <td className="gd right">{r.found ? fmt(total) : "--"}</td>
                            <td className="rd right">{r.found ? fmt(fees) : "--"}</td>
                            <td className="gr right">{r.found ? fmt(net) : "--"}</td>
                            <td className="right" style={{color:"var(--mut)"}}>{r.found && r.cogs != null && costNum > 0 ? fmt(r.cogs) : "--"}</td>
                            <td className="tl right">{r.found ? fmt(offer) : "--"}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>

              {status === "done" && (
                <div className="ebar">
                  <span className="st">
                    {results.length + " unique cards / " + totals.qty + " total qty / " + pct(combined) + " combined fees"}
                    {results.some(r => r.source==="scryfall") ? " / some prices via Scryfall" : " / prices from TCGplayer CSV"}
                  </span>
                  <button className="btn sm" onClick={exportCSV}>Export CSV</button>
                </div>
              )}
            </div>
          </div>

          </> }

          {/* Dashboard tab */}
          {activeTab === "dashboard" && (
            <div className="dash">
              {!gsToken ? (
                <div className="no-deals">
                  <div style={{fontSize:32,opacity:.3}}>[ ]</div>
                  <p>Connect Google Sheets to load dashboard</p>
                </div>
              ) : (
                <>
                  {/* KPI row */}
                  <div className="kpi-grid" style={{marginTop:16}}>
                    <div className="kpi gold">
                      <div className="kpi-lbl">Total Deals</div>
                      <div className="kpi-val">{dashKPIs?.total ?? "--"}</div>
                      <div className="kpi-sub">{dashKPIs ? dashKPIs.active + " active" : ""}</div>
                    </div>
                    <div className="kpi gold">
                      <div className="kpi-lbl">Total Invested</div>
                      <div className="kpi-val">{dashKPIs ? fmtL(dashKPIs.totalInvested) : "--"}</div>
                      <div className="kpi-sub">across all deals</div>
                    </div>
                    <div className="kpi teal">
                      <div className="kpi-lbl">Total Net Revenue</div>
                      <div className="kpi-val teal">{dashKPIs ? fmtL(dashKPIs.totalNetRev) : "--"}</div>
                      <div className="kpi-sub">closed deals only</div>
                    </div>
                    <div className="kpi red">
                      <div className="kpi-lbl">Total Fees Paid</div>
                      <div className="kpi-val red">{dashKPIs ? fmtL(dashKPIs.totalFees) : "--"}</div>
                      <div className="kpi-sub">TCG + processing</div>
                    </div>
                    <div className="kpi grn">
                      <div className="kpi-lbl">Gross P&L</div>
                      <div className={"kpi-val " + (dashKPIs?.totalPL >= 0 ? "grn" : "red")}>
                        {dashKPIs ? fmtL(dashKPIs.totalPL) : "--"}
                      </div>
                      <div className="kpi-sub">closed deals only</div>
                    </div>
                    <div className="kpi teal">
                      <div className="kpi-lbl">Avg ROI</div>
                      <div className={"kpi-val " + (dashKPIs?.avgROI >= 0 ? "teal" : "red")}>
                        {dashKPIs?.avgROI != null ? (dashKPIs.avgROI >= 0 ? "+" : "") + dashKPIs.avgROI.toFixed(1) + "%" : "--"}
                      </div>
                      <div className="kpi-sub">closed deals only</div>
                    </div>
                    <div className="kpi gold">
                      <div className="kpi-lbl">Total Cards</div>
                      <div className="kpi-val mut">{dashKPIs ? dashKPIs.totalCards.toLocaleString() : "--"}</div>
                      {dashKPIs?.best && <div className="kpi-sub">Best: {dashKPIs.best["deal name"]}</div>}
                    </div>
                  </div>

                  {/* Deal list */}
                  <div className="dash-section">
                    <div className="dash-ph">
                      All Deals
                      <button className="btn sm" style={{margin:0}} onClick={gsLoadDashboard} disabled={dashLoading}>
                        {dashLoading ? "Syncing..." : "Sync"}
                      </button>
                    </div>

                    {!dealLog.length ? (
                      <div className="no-deals">
                        <div style={{fontSize:28,opacity:.3}}>[ ]</div>
                        <p>{dashLoading ? "Loading..." : "No deals yet. Save a snapshot to add a deal."}</p>
                      </div>
                    ) : (
                      <div className="deal-table-wrap">
                        <table>
                          <thead>
                            <tr>
                              <th></th>
                              <th>Deal Name</th>
                              <th>Seller</th>
                              <th>Date</th>
                              <th>Stage</th>
                              <th>Status</th>
                              <th className="right">Invested</th>
                              <th className="right">Cards</th>
                              <th className="right">Net Rev</th>
                              <th className="right">Fees</th>
                              <th className="right">P&L</th>
                              <th className="right">ROI</th>
                              <th>Notes</th>
                              <th></th>
                            </tr>
                          </thead>
                          <tbody>
                            {dealLog.map((deal, i) => {
                              const isExpanded = expandedDeal === deal._rowIdx;
                              const snaps = snapshots[deal["deal name"]] || [];
                              const plVal = parseDollar(deal["p&l"]);
                              const statusColors = {
                                Evaluating:"var(--gold2)", Active:"var(--teal)",
                                Listed:"#aac", Closed:"var(--grn)"
                              };
                              return (
                                <React.Fragment key={deal._rowIdx}>
                                  <tr style={{background: i%2===0 ? "var(--dark)" : "var(--bg)"}}>
                                    <td style={{width:28,textAlign:"center"}}>
                                      <button onClick={() => setExpandedDeal(isExpanded ? null : deal._rowIdx)}
                                        style={{background:"none",border:"none",color:"var(--gold)",cursor:"pointer",fontSize:14,padding:"0 4px"}}>
                                        {isExpanded ? "v" : ">"}
                                      </button>
                                    </td>
                                    <td className="nm">
                                      {editingDeal?.rowIdx===deal._rowIdx && editingDeal?.field==="deal name" ? (
                                        <div className="inline-edit">
                                          <input autoFocus defaultValue={deal["deal name"]}
                                            onBlur={e => gsSaveEdit(deal,"deal name",e.target.value)}
                                            onKeyDown={e => { if(e.key==="Enter") gsSaveEdit(deal,"deal name",e.target.value); if(e.key==="Escape") setEditingDeal(null); }} />
                                        </div>
                                      ) : (
                                        <span style={{cursor:"pointer"}} onDoubleClick={() => setEditingDeal({rowIdx:deal._rowIdx,field:"deal name"})}>
                                          {deal["deal name"] || "--"}
                                        </span>
                                      )}
                                    </td>
                                    <td style={{color:"var(--mut)",fontSize:12}}>
                                      {editingDeal?.rowIdx===deal._rowIdx && editingDeal?.field==="seller" ? (
                                        <div className="inline-edit">
                                          <input autoFocus defaultValue={deal["seller"]}
                                            onBlur={e => gsSaveEdit(deal,"seller",e.target.value)}
                                            onKeyDown={e => { if(e.key==="Enter") gsSaveEdit(deal,"seller",e.target.value); if(e.key==="Escape") setEditingDeal(null); }} />
                                        </div>
                                      ) : (
                                        <span style={{cursor:"pointer"}} onDoubleClick={() => setEditingDeal({rowIdx:deal._rowIdx,field:"seller"})}>
                                          {deal["seller"] || "--"}
                                        </span>
                                      )}
                                    </td>
                                    <td style={{color:"var(--mut)",fontSize:12}}>{deal["date"]||"--"}</td>
                                    <td style={{fontSize:12}}>{deal["stage"]||"--"}</td>
                                    <td>
                                      {editingDeal?.rowIdx===deal._rowIdx && editingDeal?.field==="status" ? (
                                        <div className="inline-edit">
                                          <select autoFocus defaultValue={deal["status"]}
                                            onChange={e => gsSaveEdit(deal,"status",e.target.value)}
                                            onBlur={() => setEditingDeal(null)}>
                                            {["Evaluating","Active","Listed","Closed"].map(s => <option key={s}>{s}</option>)}
                                          </select>
                                        </div>
                                      ) : (
                                        <span className="bp" style={{cursor:"pointer",
                                          color:statusColors[deal["status"]]||"var(--mut)",
                                          background:"rgba(255,255,255,.04)",border:"1px solid var(--bdr)",
                                          fontFamily:"var(--fd)",fontSize:8,padding:"2px 6px",borderRadius:2}}
                                          onDoubleClick={() => setEditingDeal({rowIdx:deal._rowIdx,field:"status"})}>
                                          {deal["status"]||"--"}
                                        </span>
                                      )}
                                    </td>
                                    <td className="gd right">{deal["offered ($)"] ? fmtL(parseDollar(deal["offered ($)"])) : "--"}</td>
                                    <td className="right" style={{color:"var(--mut)"}}>{deal["cards"]||"--"}</td>
                                    <td className="gr right">{deal["actual netrev"] || deal["intake netrev"] ? fmtL(parseDollar(deal["actual netrev"]||deal["intake netrev"])) : "--"}</td>
                                    <td className="rd right">{deal["total fees"] ? fmtL(parseDollar(deal["total fees"])) : "--"}</td>
                                    <td className={"right " + (plVal >= 0 ? "gr" : plVal < 0 ? "rd" : "")}>
                                      {deal["p&l"] ? fmtL(plVal) : "--"}
                                    </td>
                                    <td className={"right " + (parseFloat(deal["roi"]) >= 0 ? "tl" : "rd")} style={{fontSize:11}}>
                                      {deal["roi"] || "--"}
                                    </td>
                                    <td style={{color:"var(--mut)",fontSize:11,maxWidth:120,overflow:"hidden",textOverflow:"ellipsis",whiteSpace:"nowrap"}} title={deal["notes"]}>
                                      {editingDeal?.rowIdx===deal._rowIdx && editingDeal?.field==="notes" ? (
                                        <div className="inline-edit">
                                          <input autoFocus defaultValue={deal["notes"]}
                                            onBlur={e => gsSaveEdit(deal,"notes",e.target.value)}
                                            onKeyDown={e => { if(e.key==="Enter") gsSaveEdit(deal,"notes",e.target.value); if(e.key==="Escape") setEditingDeal(null); }} />
                                        </div>
                                      ) : (
                                        <span style={{cursor:"pointer"}} onDoubleClick={() => setEditingDeal({rowIdx:deal._rowIdx,field:"notes"})}>
                                          {deal["notes"]||"--"}
                                        </span>
                                      )}
                                    </td>
                                    <td style={{textAlign:"center"}}>
                                      <button onClick={() => gsDeleteDeal(deal)}
                                        style={{background:"none",border:"none",color:"var(--red)",cursor:"pointer",fontSize:13,padding:"0 4px",opacity:.6}}
                                        title="Delete deal">x</button>
                                    </td>
                                  </tr>
                                  {isExpanded && (
                                    <tr className="deal-row-exp">
                                      <td colSpan={14}>
                                        <div className="snap-list">
                                          <div style={{fontFamily:"var(--fd)",fontSize:8,letterSpacing:".12em",textTransform:"uppercase",color:"var(--mut)",marginBottom:4}}>
                                            Snapshots ({snaps.length})
                                          </div>
                                          {snaps.length === 0 && (
                                            <div style={{fontSize:11,color:"var(--mut)",fontStyle:"italic"}}>No snapshots saved yet for this deal.</div>
                                          )}
                                          {snaps.map(tab => (
                                            <div key={tab} className="snap-item">
                                              <span className="snap-item-name">{tab}</span>
                                              <button className="btn sm" style={{margin:0,padding:"4px 10px",fontSize:8}}
                                                onClick={() => gsLoadSnapshot(tab)}>
                                                Load into Valuation
                                              </button>
                                            </div>
                                          ))}
                                        </div>
                                      </td>
                                    </tr>
                                  )}
                                </React.Fragment>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    )}
                    <div className="dash-sync">
                      <span>{dashMsg || (gsSheetId ? "Connected to Google Sheets" : "Not connected")}</span>
                      {gsSheetId && (
                        <a href={"https://docs.google.com/spreadsheets/d/" + gsSheetId} target="_blank" rel="noreferrer"
                          style={{marginLeft:"auto",fontFamily:"var(--fd)",fontSize:8,color:"var(--teal)",
                            letterSpacing:".08em",textDecoration:"none",textTransform:"uppercase"}}>
                          Open Sheet
                        </a>
                      )}
                    </div>
                  </div>
                </>
              )}
            </div>
          )}


          {/* Compare mode */}
          {activeTab === "compare" && (
            <div style={{display:"flex",gap:18,alignItems:"flex-start"}}>

              {/* Compare left panel */}
              <div style={{width:300,flexShrink:0,display:"flex",flexDirection:"column",gap:12}}>
                <div className="panel">
                  <div className="ph">Compare Snapshots</div>
                  <div className="pb">

                    {gsToken && Object.keys(snapshots).length > 0 ? (<>

                      {/* Step 1: pick deal */}
                      <div style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)",marginBottom:6}}>
                        Step 1 -- Select Collection
                      </div>
                      <div className="deal-field" style={{marginBottom:12}}>
                        <select value={cmpDeal} onChange={e => {
                          setCmpDeal(e.target.value);
                          setCmpSheetA(""); setCmpSheetB("");
                          setCmpFileA(""); setCmpFileB("");
                          setCmpDataA(null); setCmpDataB(null);
                          setCmpDiff(null);
                        }}>
                          <option value="">-- Choose a collection --</option>
                          {Object.keys(snapshots).map(name => (
                            <option key={name} value={name}>{name} ({(snapshots[name]||[]).length} snapshots)</option>
                          ))}
                        </select>
                      </div>

                      {/* Step 2: pick snapshots for this deal */}
                      {cmpDeal && snapshots[cmpDeal]?.length > 0 && (<>
                        <div style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)",marginBottom:6}}>
                          Step 2 -- Snapshot A (e.g. Intake)
                        </div>
                        <div className="deal-field" style={{marginBottom:4}}>
                          <select value={cmpSheetA} onChange={e => {
                            setCmpSheetA(e.target.value);
                            if(e.target.value) gsLoadSnapshotIntoCompare(e.target.value, "A");
                          }}>
                            <option value="">-- Select snapshot --</option>
                            {(snapshots[cmpDeal]||[]).map(tab => (
                              <option key={tab} value={tab}>{tab}</option>
                            ))}
                          </select>
                        </div>
                        {cmpLoadingA && <div style={{fontSize:10,color:"var(--teal)",fontStyle:"italic",marginBottom:4}}>Loading...</div>}
                        {cmpFileA && !cmpLoadingA && (
                          <div style={{fontSize:10,color:"var(--grn)",marginBottom:8,padding:"4px 8px",
                            background:"rgba(58,184,122,.07)",border:"1px solid rgba(58,184,122,.2)",borderRadius:3}}>
                            {(cmpDataA?.cards?.length||0) + " cards loaded"}
                          </div>
                        )}

                        <div style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)",marginBottom:6,marginTop:8}}>
                          Step 3 -- Snapshot B (e.g. Actual Scan)
                        </div>
                        <div className="deal-field" style={{marginBottom:4}}>
                          <select value={cmpSheetB} onChange={e => {
                            setCmpSheetB(e.target.value);
                            if(e.target.value) gsLoadSnapshotIntoCompare(e.target.value, "B");
                          }}>
                            <option value="">-- Select snapshot --</option>
                            {(snapshots[cmpDeal]||[]).map(tab => (
                              <option key={tab} value={tab}>{tab}</option>
                            ))}
                          </select>
                        </div>
                        {cmpLoadingB && <div style={{fontSize:10,color:"var(--teal)",fontStyle:"italic",marginBottom:4}}>Loading...</div>}
                        {cmpFileB && !cmpLoadingB && (
                          <div style={{fontSize:10,color:"var(--grn)",marginBottom:8,padding:"4px 8px",
                            background:"rgba(58,184,122,.07)",border:"1px solid rgba(58,184,122,.2)",borderRadius:3}}>
                            {(cmpDataB?.cards?.length||0) + " cards loaded"}
                          </div>
                        )}
                      </>)}

                      {cmpDeal && (!snapshots[cmpDeal] || snapshots[cmpDeal].length < 2) && (
                        <div style={{fontSize:10,color:"var(--mut)",fontStyle:"italic",marginTop:4,lineHeight:1.5}}>
                          {!snapshots[cmpDeal] || snapshots[cmpDeal].length === 0
                            ? "No snapshots saved for this collection yet."
                            : "Only 1 snapshot saved. Save an Actual Scan snapshot to enable comparison."}
                        </div>
                      )}

                    </>) : (
                      /* Not connected or no snapshots yet -- CSV fallback */
                      <div>
                        {!gsToken && (
                          <div style={{fontSize:10,color:"var(--mut)",fontStyle:"italic",marginBottom:10,lineHeight:1.6,padding:"7px 9px",
                            background:"rgba(201,148,58,.06)",border:"1px solid rgba(201,148,58,.15)",borderRadius:3}}>
                            Connect Google Sheets in the Valuation tab to compare by collection name. Or upload CSV backups below.
                          </div>
                        )}
                        {gsToken && Object.keys(snapshots).length === 0 && (
                          <div style={{fontSize:10,color:"var(--mut)",fontStyle:"italic",marginBottom:10,lineHeight:1.6}}>
                            No snapshots found in your sheet yet. Save a snapshot from the Valuation tab first, or upload CSV backups below.
                          </div>
                        )}
                        <div style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)",marginBottom:6}}>
                          Snapshot A -- CSV Backup
                        </div>
                        <div className={"cmp-drop" + (cmpDragA?" over":"") + (cmpFileA?" loaded":"")}
                          onDragOver={e=>{e.preventDefault();setCmpDragA(true)}}
                          onDragLeave={()=>setCmpDragA(false)}
                          onDrop={e=>{e.preventDefault();setCmpDragA(false);loadCmpFile(e.dataTransfer.files[0],"A")}}>
                          <input type="file" accept=".csv" onChange={e=>loadCmpFile(e.target.files[0],"A")} />
                          <div style={{fontSize:16,opacity:.4}}>{cmpFileA ? "OK" : "^"}</div>
                          <div style={{fontFamily:"var(--fd)",fontSize:9,color:"var(--mut)"}}>
                            {cmpFileA || "Drop snapshot CSV"}
                          </div>
                        </div>
                        <div style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)",marginBottom:6,marginTop:12}}>
                          Snapshot B -- CSV Backup
                        </div>
                        <div className={"cmp-drop" + (cmpDragB?" over":"") + (cmpFileB?" loaded":"")}
                          onDragOver={e=>{e.preventDefault();setCmpDragB(true)}}
                          onDragLeave={()=>setCmpDragB(false)}
                          onDrop={e=>{e.preventDefault();setCmpDragB(false);loadCmpFile(e.dataTransfer.files[0],"B")}}>
                          <input type="file" accept=".csv" onChange={e=>loadCmpFile(e.target.files[0],"B")} />
                          <div style={{fontSize:16,opacity:.4}}>{cmpFileB ? "OK" : "^"}</div>
                          <div style={{fontFamily:"var(--fd)",fontSize:9,color:"var(--mut)"}}>
                            {cmpFileB || "Drop snapshot CSV"}
                          </div>
                        </div>
                      </div>
                    )}

                    <button className="btn" style={{marginTop:14}}
                      disabled={!cmpDataA || !cmpDataB || cmpLoadingA || cmpLoadingB}
                      onClick={() => runCompare(cmpDataA, cmpDataB)}>
                      Run Comparison
                    </button>

                  </div>
                </div>

                {cmpDiff && (
                  <div className="panel">
                    <div className="ph">Filter</div>
                    <div className="pb">
                      {[["all","All"],["MISSING","Missing"],["EXTRA","Extra"],
                        ["QTY_CHANGE","Qty Change"],["COND_CHANGE","Cond Change"],["PRICE_MOVE","Price Move"]
                      ].map(([val,lbl]) => (
                        <button key={val} className={"tier-btn" + (cmpFilter===val?" active":"")}
                          style={{marginTop:4}} onClick={() => setCmpFilter(val)}>
                          {lbl + (val!=="all" ? " (" + (cmpDiff.filter(r=>r.status===val).length) + ")" : " (" + cmpDiff.length + ")")}
                        </button>
                      ))}
                      <button className="btn sec" style={{marginTop:12}} onClick={exportDiff}>Export Diff CSV</button>
                    </div>
                  </div>
                )}
              </div>

              {/* Compare right panel */}
              <div className="panel" style={{flex:1,display:"flex",flexDirection:"column"}}>
                <div className="ph">
                  Comparison Results
                  {cmpDiff && <span style={{color:"var(--mut)",fontSize:9}}>{cmpFiltered.length + " rows"}</span>}
                </div>

                {cmpDiff && cmpStats && (
                  <div style={{padding:"12px 14px",borderBottom:"1px solid var(--bdr)"}}>
                    <div className="cmp-summary">
                      <div className="cmp-sc">
                        <div className="lbl">Mkt Val A</div>
                        <div className="val">{fmtL(cmpStats.mktValA)}</div>
                      </div>
                      <div className="cmp-sc">
                        <div className="lbl">Mkt Val B</div>
                        <div className="val">{fmtL(cmpStats.mktValB)}</div>
                      </div>
                      <div className="cmp-sc">
                        <div className="lbl">Val Delta</div>
                        <div className={"val " + (cmpStats.mktValB-cmpStats.mktValA>=0?"grn":"red")}>
                          {fmtL(cmpStats.mktValB - cmpStats.mktValA)}
                        </div>
                      </div>
                      <div className="cmp-sc">
                        <div className="lbl">Net Rev Delta</div>
                        <div className={"val " + (cmpStats.netRevB-cmpStats.netRevA>=0?"grn":"red")}>
                          {fmtL(cmpStats.netRevB - cmpStats.netRevA)}
                        </div>
                      </div>
                      <div className="cmp-sc">
                        <div className="lbl">Missing Cards</div>
                        <div className="val red">{cmpStats.missing}</div>
                      </div>
                      <div className="cmp-sc">
                        <div className="lbl">Extra Cards</div>
                        <div className="val teal">{cmpStats.extra}</div>
                      </div>
                      <div className="cmp-sc">
                        <div className="lbl">Qty Changes</div>
                        <div className="val">{cmpStats.qtyChange}</div>
                      </div>
                      <div className="cmp-sc">
                        <div className="lbl">Price Moves</div>
                        <div className="val">{cmpStats.priceMove}</div>
                      </div>
                    </div>
                    <div style={{fontSize:10,color:"var(--mut)",fontStyle:"italic"}}>
                      {"A: " + (cmpDataA?.meta?.["Deal Name"]||cmpFileA) + "  vs  B: " + (cmpDataB?.meta?.["Deal Name"]||cmpFileB)}
                    </div>
                  </div>
                )}

                <div className="tbl-wrap" style={{maxHeight:560}}>
                  {!cmpDiff ? (
                    <div className="empty">
                      <div className="ico">[ ]</div>
                      <p>Load two snapshots and click Run Comparison</p>
                    </div>
                  ) : (
                    <table>
                      <thead><tr>
                        <th>Card Name</th><th>Set</th>
                        <th className="right">Qty A</th><th className="right">Qty B</th><th className="right">Delta</th>
                        <th>Cond A</th><th>Cond B</th>
                        <th className="right">Mid A</th><th className="right">Mid B</th><th className="right">Price Chg</th>
                        <th className="right">NetRev A</th><th className="right">NetRev B</th>
                        <th>Status</th>
                      </tr></thead>
                      <tbody>
                        {cmpFiltered.map((r,i) => {
                          const rowCls = {MISSING:"diff-miss",EXTRA:"diff-extra",QTY_CHANGE:"diff-qty",
                            PRICE_MOVE:"diff-price",COND_CHANGE:"diff-cond",MATCH:"diff-match"}[r.status]||"";
                          const statusColors = {MISSING:"var(--red)",EXTRA:"var(--teal)",QTY_CHANGE:"var(--gold2)",
                            PRICE_MOVE:"#aac",COND_CHANGE:"#c8a",MATCH:"var(--mut)"};
                          return (
                            <tr key={i} className={rowCls}>
                              <td className="nm" title={r.name}>{r.name}</td>
                              <td className="setcol">{r.set||"--"}</td>
                              <td className="right">{r.qtyA||"--"}</td>
                              <td className="right">{r.qtyB||"--"}</td>
                              <td className={"right " + (r.qtyDelta>0?"gr":r.qtyDelta<0?"rd":"")}>
                                {r.qtyDelta!=null?(r.qtyDelta>0?"+":"")+r.qtyDelta:"--"}
                              </td>
                              <td>{r.condA||"--"}</td>
                              <td style={{color:r.condChange?"var(--red)":"inherit"}}>{r.condB||"--"}</td>
                              <td className="gd right">{r.midA!=null?fmt(r.midA):"--"}</td>
                              <td className="gd right">{r.midB!=null?fmt(r.midB):"--"}</td>
                              <td className={"right " + (r.priceDelta>0?"gr":r.priceDelta<0?"rd":"")}>
                                {r.priceDelta!=null?(r.priceDelta>0?"+":"")+fmt(r.priceDelta):"--"}
                              </td>
                              <td className="right">{r.netRevA!=null?fmt(r.netRevA):"--"}</td>
                              <td className={"right " + (r.netRevB>r.netRevA?"gr":r.netRevB<r.netRevA?"rd":"")}>
                                {r.netRevB!=null?fmt(r.netRevB):"--"}
                              </td>
                              <td><span style={{fontFamily:"var(--fd)",fontSize:8,color:statusColors[r.status]||"var(--mut)"}}>{r.status}</span></td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </>
  );
}
