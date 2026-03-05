import React, { useState, useRef, useCallback, useEffect, useMemo } from "react";

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
  .deal-field input,.deal-field select,.deal-field textarea{background:var(--bg);border:1px solid var(--bdr);border-radius:3px;
    color:var(--txt);font-family:var(--fb);font-size:13px;padding:5px 8px;outline:none;width:100%}
  .deal-field input:focus,.deal-field select:focus,.deal-field textarea:focus{border-color:var(--gold)}
  .deal-field textarea{resize:vertical;min-height:52px}
  .status-badge{display:inline-block;padding:3px 8px;border-radius:2px;font-family:var(--fd);font-size:8px;letter-spacing:.08em;text-transform:uppercase}
  .warn{padding:7px 11px;background:rgba(201,64,64,.08);border:1px solid rgba(201,64,64,.2);border-radius:3px;font-size:11px;color:#e07070;line-height:1.6}
  .bearly{background:rgba(201,148,58,.2);color:var(--gold2);border:1px solid rgba(201,148,58,.4)}
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

// Detect and parse foil/variant tags from a card name string
function extractNameMeta(rawName) {
  let name = rawName.trim();
  let isFoil = false, variant = "";
  // Foil: "Card Name - [Foil]" or "Card Name (Foil)"
  if(/- \[foil\]/i.test(name)) {
    isFoil = true;
    name = name.replace(/\s*-\s*\[foil\]/gi, "").trim();
  }
  if(/\(foil\)/i.test(name)) {
    isFoil = true;
    name = name.replace(/\s*\(foil\)/gi, "").trim();
  }
  // Variant: trailing (Borderless), (Extended Art), (Showcase), (Retro), etc.
  // but NOT (Foil) which we already handled
  const vm = name.match(/\(([^)]+)\)\s*$/);
  if(vm && !/foil/i.test(vm[1])) {
    variant = vm[1];
    name = name.replace(/\s*\([^)]+\)\s*$/, "").trim();
  }
  return { name, isFoil, variant };
}

// Map TCGplayer condition strings to our internal keys
function mapCondition(raw) {
  if(!raw) return "NM";
  const r = raw.toLowerCase().trim();
  if(r.includes("near mint") || r === "nm") return "NM";
  if(r.includes("lightly") || r === "lp")   return "LP";
  if(r.includes("moderately") || r === "mp") return "MP";
  if(r.includes("heavily") || r === "hp")   return "HP";
  if(r.includes("damaged") || r === "dmg")  return "DMG";
  return "NM";
}

function parseTCGPlayerCSV(text) {
  const lines = text.trim().split(/\r?\n/).filter(l => l.trim());
  if(!lines.length) return { cards:[], error:null };
  const headerFields = parseCSVLine(lines[0]).map(f => f.replace(/"/g,"").toLowerCase().trim());

  // ─── ITEM 4: Validate expected headers before parsing ─────────────────────
  const isFormatA = headerFields.includes("tcgplayer id") || headerFields.includes("product name");
  const isFormatB = ["have","qty","quantity"].includes(headerFields[0]);
  if(!isFormatA && !isFormatB) {
    const needed = ["product name","set name","condition"];
    const missing = needed.filter(h => !headerFields.includes(h));
    if(missing.length) return { cards:[], error:`Missing required columns: ${missing.join(", ")}. Expected a TCGplayer inventory or collection CSV.` };
  }

  const cards = [];

  // -- Format A: TCGplayer Inventory Export ---------------------------------
  // Headers: TCGplayer Id, Product Line, Set Name, Product Name, Title,
  //          Number, Rarity, Condition, TCG Market Price, TCG Direct Low,
  //          TCG Low Price With Shipping, TCG Low Price, Total Quantity, ...
  if(headerFields.includes("tcgplayer id") || headerFields.includes("product name")) {
    const idx = {
      name:        headerFields.indexOf("product name"),
      set:         headerFields.indexOf("set name"),
      qty:         headerFields.indexOf("total quantity"),
      condition:   headerFields.indexOf("condition"),
      market:      headerFields.indexOf("tcg market price"),
      low:         headerFields.indexOf("tcg low price"),
      direct:      headerFields.indexOf("tcg direct low"),
      tcgId:       headerFields.indexOf("tcgplayer id"),
      number:      headerFields.indexOf("number"),       // collector number
      printing:    headerFields.indexOf("printing"),     // Normal / Foil / Etched
      rarity:      headerFields.indexOf("rarity"),
    };
    for(let i = 1; i < lines.length; i++) {
      const f = parseCSVLine(lines[i]).map(v => v.replace(/"/g,"").trim());
      if(!f[idx.name]) continue;
      const rawName = f[idx.name] || "";
      const { name, isFoil: nameFoil, variant } = extractNameMeta(rawName);
      const set         = idx.set >= 0       ? f[idx.set]  : "";
      const qty         = idx.qty >= 0       ? parseInt(f[idx.qty])||1  : 1;
      const condition   = idx.condition >= 0 ? mapCondition(f[idx.condition]) : "NM";
      const market      = idx.market >= 0    ? parseDollar(f[idx.market]) : null;
      const lowRaw      = idx.low >= 0       ? parseDollar(f[idx.low])    : null;
      const tcgplayerId = idx.tcgId >= 0     ? f[idx.tcgId]  : "";
      const collectorNumber = idx.number >= 0 ? f[idx.number] : "";
      // Finish type: prefer explicit "Printing" column, else fall back to name detection
      const printingField = idx.printing >= 0 ? f[idx.printing].toLowerCase() : "";
      const finishType  = printingField.includes("etched") ? "etched"
                        : printingField.includes("foil")   ? "foil"
                        : nameFoil                         ? "foil"
                        : "normal";
      const isFoil      = finishType !== "normal";
      // Derive Low/Mid/High from market price
      const mid  = market;
      const low  = lowRaw ?? (market != null ? Math.round(market * 0.80 * 100)/100 : null);
      const high = market != null ? Math.round(market * 1.20 * 100)/100 : null;
      if(name) cards.push({qty, name, set, low, mid, high, isFoil, finishType,
        variant, condition, tcgplayerId, collectorNumber,
        buyCost:null, source:"csv"});
    }
    return { cards, error:null };
  }

  // -- Format B: TCGplayer Collection Export (original format) --------------
  // Headers: Have, Name, Game, Set, Low, Mid, High
  let dataLines = lines;
  if(["have","qty","quantity"].includes(headerFields[0])) dataLines = lines.slice(1);
  const numCols = parseCSVLine(dataLines[0] || "").length;

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
    const { name: cleanName, isFoil: nameFoil, variant } = extractNameMeta(name);
    const finishType = nameFoil ? "foil" : "normal";
    if(cleanName) cards.push({qty, name:cleanName, set, low, mid, high,
      isFoil: nameFoil, finishType, variant,
      condition:"NM", tcgplayerId:"", collectorNumber:"",
      buyCost:null, source:"csv"});
  }
  return { cards, error:null };
}

const sfCache = {};
// Build a stable printing key from available identifiers.
// Priority: scryfallId (most precise) → tcgplayerId → name+set+collectorNumber+finish
function buildPrintingKey(card, sfData) {
  if(sfData?.scryfallId) return "sf:" + sfData.scryfallId;
  if(card.tcgplayerId)   return "tcg:" + card.tcgplayerId;
  const cn  = card.collectorNumber || sfData?.collectorNumber || "";
  const fin = card.finishType || (card.isFoil ? "foil" : "normal");
  return [card.name, card.set||"", cn, fin].join("|").toLowerCase();
}

async function fetchScryfall(name, set, isFoil, collectorNumber) {
  // Include collectorNumber in cache key so different printings of the same
  // card in the same set (showcase, borderless, etc.) are cached separately
  const key = name.toLowerCase() + "|" + (set||"") + "|" + isFoil + "|" + (collectorNumber||"");
  if(sfCache[key] !== undefined) return sfCache[key];

  // If we have a collector number, use the set+number endpoint for exact printing
  let url;
  if(set && collectorNumber) {
    url = "https://api.scryfall.com/cards/" + encodeURIComponent(set.toLowerCase()) +
          "/" + encodeURIComponent(collectorNumber);
  } else {
    url = "https://api.scryfall.com/cards/named?fuzzy=" + encodeURIComponent(name);
    if(set) url += "&set=" + encodeURIComponent(set.toLowerCase());
  }

  try {
    let res = await fetch(url);
    // Fallback chain: set+number → named+set → named only
    if(!res.ok && set && collectorNumber) {
      res = await fetch("https://api.scryfall.com/cards/named?fuzzy=" +
        encodeURIComponent(name) + "&set=" + encodeURIComponent(set.toLowerCase()));
    }
    if(!res.ok && set) {
      res = await fetch("https://api.scryfall.com/cards/named?fuzzy=" + encodeURIComponent(name));
    }
    if(!res.ok) { sfCache[key] = null; return null; }
    const data = await res.json();

    // Finish-aware pricing
    const fin = isFoil ? "foil" : "normal";
    const price = fin === "foil"
      ? (parseFloat(data.prices?.usd_foil) || parseFloat(data.prices?.usd) || null)
      : (parseFloat(data.prices?.usd) || null);

    // All available finishes for this printing
    const availableFinishes = data.finishes || (data.foil ? ["foil"] : []);
    if(!availableFinishes.includes("nonfoil") && data.nonfoil) availableFinishes.unshift("nonfoil");

    const result = {
      price,
      scryfallUri:      data.scryfall_uri,
      scryfallId:       data.id,
      tcgplayerId:      data.tcgplayer_id ? String(data.tcgplayer_id) : "",
      collectorNumber:  data.collector_number || collectorNumber || "",
      setCode:          data.set,
      setName:          data.set_name,
      rarity:           data.rarity,
      finishType:       fin,
      availableFinishes,
      legalities:       data.legalities,
      edhrecRank:       data.edhrec_rank ?? null,
      reserved:         data.reserved || false,
      imageUri:         data.image_uris?.normal || data.card_faces?.[0]?.image_uris?.normal,
      keywords:         data.keywords || [],
      oracleText:       data.oracle_text || (data.card_faces?.[0]?.oracle_text) || "",
      colors:           data.colors || [],
      colorIdentity:    data.color_identity || [],
      typeLine:         data.type_line || "",
      cmc:              data.cmc ?? null,
      prices:           data.prices || {},
      // All prices for this printing (useful for showing foil vs non-foil)
      priceNormal:      parseFloat(data.prices?.usd)        || null,
      priceFoil:        parseFloat(data.prices?.usd_foil)   || null,
      priceEtched:      parseFloat(data.prices?.usd_etched) || null,
    };
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

// ─── MULTI-TCG SCAFFOLD ───────────────────────────────────────────────────────
// MTG is the only fully-implemented TCG. Others are infrastructure placeholders
// for future development: Pokemon, Flesh & Blood, One Piece, Lorcana.
const SUPPORTED_TCGS = {
  MTG:           { label:"Magic: The Gathering",  pricingSource:"Scryfall + TCGplayer", enabled:true  },
  Pokemon:       { label:"Pokémon TCG",           pricingSource:"TCGplayer (future)",   enabled:false },
  FleshAndBlood: { label:"Flesh and Blood",       pricingSource:"TCGplayer (future)",   enabled:false },
  OnePiece:      { label:"One Piece Card Game",   pricingSource:"TCGplayer (future)",   enabled:false },
  Lorcana:       { label:"Disney Lorcana",        pricingSource:"TCGplayer (future)",   enabled:false },
};

// ─── FOREIGN LANGUAGE PRICING ────────────────────────────────────────────────
const FOREIGN_LANGUAGES = ["English","Japanese","Chinese Simplified","Chinese Traditional",
  "German","French","Italian","Spanish","Portuguese","Russian","Korean"];

// Set-specific foreign premiums. Italian Legends and German Renaissance
// carry collector premiums; modern non-English cards trade at a discount.
const FOREIGN_SET_PREMIUMS = {
  leg: { Italian:1.20 },   // Italian Legends ~20% premium on key cards
  ren: { German:1.15  },   // German Renaissance ~15% premium
  "4bb": { "*":1.10   },   // Black Border 4th Edition
  fbb:  { "*":1.12    },   // Foreign Black Border
  chk:  { Japanese:1.10 }, // Kamigawa block JP art premium
  bok:  { Japanese:1.10 },
  sok:  { Japanese:1.10 },
};
const FOREIGN_DEFAULT_MOD = 0.85; // 15% discount for modern non-English

function getForeignModifier(setCode, language) {
  if(!language || language === "English") return 1.0;
  const sc = (setCode||"").toLowerCase();
  const entry = FOREIGN_SET_PREMIUMS[sc];
  if(entry) {
    if(entry[language] != null) return entry[language];
    if(entry["*"]     != null) return entry["*"];
  }
  return FOREIGN_DEFAULT_MOD;
}

// ─── EARLY MAGIC DETECTION ────────────────────────────────────────────────────
const EARLY_SET_CODES  = new Set(["lea","leb","2ed","3ed","4ed","arn","atq","leg","drk","fem","ice","all","mir","vis","wth"]);
const ALPHA_BETA_CODES = new Set(["lea","leb"]);
const FOREIGN_PREMIUM_CODES = new Set(["leg","ren","4bb","fbb"]);

// ─── SELL LIKELIHOOD GRADE ────────────────────────────────────────────────────
// Grades A–F based on EDHREC rank, format legality, rarity, price point,
// reserved list status, and condition. Used to prioritize listing effort.
function calcSellGrade(card, sfData) {
  if(!sfData || !sfData.price) return { grade:"--", score:0 };
  let s = 0;
  const p = sfData.price || 0;
  // Price point (20%)
  s += (p>50?70:p>20?85:p>5?90:p>1?70:38)*0.20;
  // EDHREC rank — lower = more Commander demand (20%)
  if(sfData.edhrecRank != null) {
    const r = sfData.edhrecRank;
    s += (r<100?95:r<500?82:r<2000?65:r<5000?42:20)*0.20;
  } else { s += 52*0.20; }
  // Format legality (15%)
  const lc = sfData.legalities ? Object.values(sfData.legalities).filter(v=>v==="legal").length : 0;
  s += (lc>=4?88:lc>=2?70:lc>=1?52:22)*0.15;
  // Rarity (15%)
  s += ({mythic:88,rare:72,uncommon:52,common:30}[sfData.rarity]||52)*0.15;
  // Market velocity proxy (15%) — reserved list always has demand
  s += (sfData.reserved?82:p>10?75:p>2?65:38)*0.15;
  // Condition (10%)
  s += ({NM:100,LP:85,MP:65,HP:45,DMG:22}[card.condition||"NM"]||100)*0.10;
  // Reserved list (5%)
  s += (sfData.reserved?85:52)*0.05;
  const sc = Math.round(s);
  return { grade:sc>=80?"A":sc>=65?"B":sc>=50?"C":sc>=35?"D":"F", score:sc };
}

// ─── DAMAGE TYPE MODIFIERS ────────────────────────────────────────────────────
const DAMAGE_CATS = {
  surface:   ["Light Scratches","Heavy Scratches","Ink Marks","Print Defects"],
  structure: ["Light Crease","Heavy Crease","Bend","Water Damage","Tear"],
  foil:      ["Foil Curl","Foil Scratches","Peeling"],
  environ:   ["Smoke Damage","Sun Fading","Humidity Warping"],
  borders:   ["Worn Corners","Chipped Borders","Scuffs"],
};
const DAMAGE_MODS = {
  "Light Scratches":-0.05,"Heavy Scratches":-0.20,"Ink Marks":-0.25,"Print Defects":-0.10,
  "Light Crease":-0.10,"Heavy Crease":-0.35,"Bend":-0.15,"Water Damage":-0.40,"Tear":-0.50,
  "Foil Curl":-0.15,"Foil Scratches":-0.20,"Peeling":-0.30,
  "Smoke Damage":-0.20,"Sun Fading":-0.15,"Humidity Warping":-0.25,
  "Worn Corners":-0.08,"Chipped Borders":-0.12,"Scuffs":-0.05,
};
const COMPOUND_MODS = [
  { types:["Heavy Crease","Water Damage"], extra:-0.10 },
  { types:["Tear","Water Damage"],         extra:-0.15 },
  { types:["Heavy Crease","Bend"],         extra:-0.08 },
];
function calcDamageModifier(types=[], isFoil=false) {
  const active = isFoil ? types : types.filter(d => !DAMAGE_CATS.foil.includes(d));
  let mod = active.reduce((s,d) => s + (DAMAGE_MODS[d]||0), 0);
  COMPOUND_MODS.forEach(cm => { if(cm.types.every(t => active.includes(t))) mod += cm.extra; });
  return Math.max(mod, -0.80);
}

// ─── DEAL SCORE ───────────────────────────────────────────────────────────────
// Locked weights (spec items 12+19). Advisory only — does not block actions.
const DEAL_SCORE_WEIGHTS = {
  projectedROI:0.25, avgGrade:0.20, bulkQuality:0.15, priceTrend:0.15,
  abRatio:0.10, travelCost:0.05, concentrationRisk:0.05, processingCost:0.05,
};
function calcDealScore({ roi, avgGradeScore, bulkPct, abRatio, travelCostPct, concentrationPct }) {
  const s = {
    projectedROI:   Math.min(100, Math.max(0, (roi||0)*2.5)),
    avgGrade:       avgGradeScore || 50,
    bulkQuality:    Math.max(0, 100-(bulkPct||50)),
    priceTrend:     62, // neutral without live MTGJSON trend data
    abRatio:        Math.min(100, (abRatio||0.5)*100),
    travelCost:     Math.max(0, 100-(travelCostPct||0)*5),
    concentrationRisk: (concentrationPct||50)<40?100:(concentrationPct||50)<60?50:0,
    processingCost: 90,
  };
  let total = 0;
  Object.entries(DEAL_SCORE_WEIGHTS).forEach(([k,w]) => { total += (s[k]||50)*w; });
  const t = Math.round(total);
  return { score:t, letter:t>=80?"A":t>=65?"B":t>=50?"C":t>=35?"D":"F", breakdown:s };
}

// ─── MECHANIC TAXONOMY ────────────────────────────────────────────────────────
// Categories and their oracle text / keyword patterns.
// Extraction combines Scryfall keywords[] array + regex on oracle_text.
const MECHANIC_CATS = {
  draw:        { label:"Draw / Card Advantage",    color:"#3ab8b8", patterns:[/draws? (a |\d+ )?card/i,/card advantage/i,/scry/i,/surveil/i,/connive/i,/cycling/i,/investigate/i,/clue/i] },
  counters:    { label:"Counter Strategies",       color:"#9b7fe8", patterns:[/[+\-]1\/[+\-]1 counter/i,/\+1\/\+1/i,/charge counter/i,/proliferate/i,/age counter/i,/oil counter/i,/experience counter/i] },
  tokens:      { label:"Token Generation",         color:"#e8a73f", patterns:[/create.*token/i,/token creature/i,/treasure token/i,/food token/i,/clue token/i,/map token/i] },
  ramp:        { label:"Ramp / Mana Acceleration", color:"#3ab87a", patterns:[/search.*land/i,/land.*hand/i,/add.*mana/i,/additional.*land/i,/mana dork/i,/cost.*less/i] },
  removal:     { label:"Removal / Interaction",    color:"#e05050", patterns:[/destroy target/i,/exile target/i,/return.*to.*hand/i,/counter target spell/i,/deals? \d+ damage/i] },
  protection:  { label:"Protection",               color:"#5096e8", patterns:[/hexproof/i,/indestructible/i,/shroud/i,/ward/i,/protection from/i,/can't be countered/i] },
  keywords:    { label:"Keyword Abilities",        color:"#c9943a", patterns:[/^flying$/i,/^trample$/i,/^haste$/i,/^lifelink$/i,/^deathtouch$/i,/^first strike$/i,/^double strike$/i,/^vigilance$/i,/^menace$/i,/^reach$/i] },
  sacrifice:   { label:"Sacrifice / Recursion",    color:"#c96030", patterns:[/sacrifice/i,/return.*graveyard/i,/from.*graveyard/i,/flashback/i,/unearth/i,/encore/i,/escape/i,/disturb/i] },
  combo:       { label:"Combo / Infinite Enablers",color:"#e050c8", patterns:[/untap/i,/extra.*turn/i,/infinite/i,/copy/i,/storm/i,/cascade/i,/dredge/i,/tutor/i,/search.*library/i] },
  graveyard:   { label:"Graveyard Synergy",        color:"#a06840", patterns:[/graveyard/i,/mill/i,/self-mill/i,/reanimation/i,/delve/i,/threshold/i,/undergrowth/i,/delirium/i] },
};

// Official Scryfall keyword abilities that map to our categories
const KEYWORD_CAT_MAP = {
  flying:"keywords",trample:"keywords",haste:"keywords",lifelink:"keywords",
  deathtouch:"keywords",vigilance:"keywords","first strike":"keywords",
  "double strike":"keywords",menace:"keywords",reach:"keywords",
  hexproof:"protection",indestructible:"protection",shroud:"protection",ward:"protection",
  flashback:"sacrifice",unearth:"sacrifice",encore:"sacrifice",escape:"sacrifice",
  cycling:"draw",investigate:"draw",connive:"draw",scry:"draw",surveil:"draw",
  proliferate:"counters",
  cascade:"combo",storm:"combo",dredge:"graveyard",
};

// Extract mechanics from a Scryfall card object
function extractMechanics(sfData) {
  if(!sfData) return [];
  const found = new Set();

  // 1. Official keywords array
  (sfData.keywords||[]).forEach(kw => {
    const cat = KEYWORD_CAT_MAP[kw.toLowerCase()];
    if(cat) found.add(cat);
  });

  // 2. Oracle text pattern matching
  const text = sfData.oracleText || "";
  Object.entries(MECHANIC_CATS).forEach(([cat, def]) => {
    if(!found.has(cat)) {
      const isKwCat = cat === "keywords";
      // For keyword category, check oracle text for the keywords
      const patterns = def.patterns;
      if(patterns.some(p => {
        // Keyword patterns are exact-match against the keywords array for keywords cat
        if(isKwCat) return (sfData.keywords||[]).some(kw => p.test(kw));
        return p.test(text);
      })) found.add(cat);
    }
  });

  return [...found];
}

// ─── DEMAND SCORE WEIGHTS (paper-first) ─────────────────────────────────────
// Velocity and sell grade outweigh EDHREC because EDHREC skews toward online /
// digital Commander players who don't buy paper. Our snapshot sell-through data
// and future eBay velocity are far higher signal for paper resale margins.
// eBay velocity will slot into the velocity bucket (35%) when integrated.
const DEMAND_WEIGHTS = {
  velocity:  0.35,  // price delta across snapshots + future eBay — highest signal
  sellGrade: 0.30,  // avg A/B sell grade from real collection performance
  scarcity:  0.20,  // inverse reprint count (MTGJSON) — paper-specific price ceiling
  edhrec:    0.15,  // EDHREC rank proxy — demoted, online bias, treated as weak prior
};
// NEUTRAL_SCORES used when a factor has no data yet
const DEMAND_NEUTRAL = { velocity:50, sellGrade:50, scarcity:50, edhrec:40 };

// Normalize EDHREC rank to 0–100. Rank 1 = 95, Rank 20000 = 5, null = 40 (online-biased neutral)
function edhrecDemand(rank) {
  if(rank == null) return DEMAND_NEUTRAL.edhrec;
  return Math.max(5, Math.min(95, 95 - (rank / 222)));
}

// Compute per-mechanic aggregate stats across a results array + sfDataCache + snapshots
function computeMechanicStats(results, sfDataCache, snapshotHistory) {
  const stats = {};

  results.forEach(r => {
    const sf = sfDataCache[r.cardKey || (r.name+"|"+(r.set||""))];
    const mechs = extractMechanics(sf);
    const gradeScore = {A:100,B:80,C:60,D:40,F:20}[r.grade||""] || 0;
    const demand = edhrecDemand(sf?.edhrecRank);

    mechs.forEach(m => {
      if(!stats[m]) stats[m] = {
        cat:m, cards:[], totalQty:0, gradeScores:[], demands:[], velocities:[],
        totalMarket:0,
      };
      stats[m].cards.push(r.name);
      stats[m].totalQty += r.qty;
      if(gradeScore) stats[m].gradeScores.push(gradeScore);
      stats[m].demands.push(demand);
      if(r.marketPrice) stats[m].totalMarket += r.marketPrice * r.qty;
    });
  });

  // Incorporate price velocity from snapshot history (price delta over time)
  // snapshotHistory: [{name, set, price, date}] across all saved snapshots
  if(snapshotHistory && snapshotHistory.length > 1) {
    const byCard = {};
    snapshotHistory.forEach(s => {
      const k = s.tcgplayerId ? "tcg:"+s.tcgplayerId
              : s.collectorNumber ? [s.name,s.set||"",s.collectorNumber,s.finishType||"normal"].join("|").toLowerCase()
              : s.name+"|"+(s.set||"");
      if(!byCard[k]) byCard[k] = {
        key:k, name:s.name, set:s.set||"",
        tcgplayerId:s.tcgplayerId||"", collectorNumber:s.collectorNumber||"",
        finishType:s.finishType||"normal", points:[]
      };
      byCard[k].points.push({ price:s.price, date:new Date(s.date) });
    });

    Object.values(byCard).forEach(card => {
      const points = card.points;
      if(points.length < 2) return;
      points.sort((a,b) => a.date-b.date);
      const oldest = points[0].price, newest = points[points.length-1].price;
      if(!oldest || !newest) return;
      const pctChange = ((newest - oldest) / oldest) * 100;
      // Look up sf data using printing key, tcgplayerId, or legacy name|set
      const sf = sfDataCache["tcg:"+card.tcgplayerId] ||
                 sfDataCache[card.key] ||
                 sfDataCache[card.name+"|"+(card.set||"")];
      const mechs = extractMechanics(sf);
      mechs.forEach(m => {
        if(stats[m]) stats[m].velocities.push(pctChange);
      });
    });
  }

  // Score each mechanic using paper-first weights
  const avg = arr => arr.length ? arr.reduce((s,v)=>s+v,0)/arr.length : null;

  return Object.entries(stats).map(([cat, s]) => {
    // Sell grade score (0–100 from A/B/C/D/F distribution)
    const avgGrade    = avg(s.gradeScores) || DEMAND_NEUTRAL.sellGrade;

    // EDHREC demand (weak prior — online-biased)
    const avgEdhrec   = avg(s.demands) || DEMAND_NEUTRAL.edhrec;

    // Velocity score: map price % change to 0–100 scale
    // +20% price change → 70/100, -20% → 30/100, 0% → 50/100
    // Capped at 0–100. No history = neutral (50).
    const hasVelocity = s.velocities.length > 0;
    const rawVel      = hasVelocity ? avg(s.velocities) : null;
    const velScore    = rawVel != null
      ? Math.min(100, Math.max(0, 50 + rawVel * 1.25))
      : DEMAND_NEUTRAL.velocity;

    // Scarcity score: placeholder 50 until MTGJSON reprint data is integrated.
    // Will be: Math.min(100, 100 - reprintCount * 8) — more reprints = lower scarcity.
    const scarcityScore = DEMAND_NEUTRAL.scarcity;
    const hasScarcity   = false; // flip to true when MTGJSON is wired in

    // Weighted demand score — paper-first
    const score = Math.round(
      velScore     * DEMAND_WEIGHTS.velocity  +
      avgGrade     * DEMAND_WEIGHTS.sellGrade +
      scarcityScore* DEMAND_WEIGHTS.scarcity  +
      avgEdhrec    * DEMAND_WEIGHTS.edhrec
    );

    const letter = score>=80?"A":score>=65?"B":score>=50?"C":score>=35?"D":"F";

    // Trend arrow: compare most recent velocity to the average
    const trendUp   = hasVelocity && rawVel > 5;
    const trendDown = hasVelocity && rawVel < -5;

    return {
      cat, label: MECHANIC_CATS[cat]?.label || cat,
      color: MECHANIC_CATS[cat]?.color || "var(--mut)",
      cardCount: s.cards.length, totalQty: s.totalQty,
      totalMarket: s.totalMarket,
      // Factor scores for display
      velScore, avgGrade, avgEdhrec, scarcityScore,
      hasVelocity, hasScarcity,
      rawVel,    // raw % price change for display
      trendUp, trendDown,
      score, letter,
      topCards: [...new Set(s.cards)].slice(0, 5),
    };
  }).sort((a,b) => b.score - a.score);
}


// ─── MARKET DASHBOARD HELPERS ────────────────────────────────────────────────

// Color display config — WUBRG + colorless + multi
const COLOR_CONFIG = {
  W: { label:"White",     hex:"#f9faf4", border:"#c8c090", text:"#555" },
  U: { label:"Blue",      hex:"#1a6eb5", border:"#1456a0", text:"#fff" },
  B: { label:"Black",     hex:"#2a2a2a", border:"#555",    text:"#ccc" },
  R: { label:"Red",       hex:"#d4251a", border:"#a01810", text:"#fff" },
  G: { label:"Green",     hex:"#1a7a3a", border:"#155e2c", text:"#fff" },
  C: { label:"Colorless", hex:"#888",    border:"#666",    text:"#fff" },
  M: { label:"Multi",     hex:"#c9943a", border:"#a07828", text:"#fff" },
};

// Format priority order (your ranking)
const FORMAT_PRIORITY = ["commander","vintage","legacy","standard","modern","pioneer","pauper","brawl"];
const FORMAT_LABELS   = {
  commander:"Commander",vintage:"Vintage",legacy:"Legacy",
  standard:"Standard",modern:"Modern",pioneer:"Pioneer",
  pauper:"Pauper",brawl:"Brawl",
};

// Compute market intelligence from snapHistory + sfDataCache + results
function computeMarketData(snapHistory, sfDataCache, results, windowDays) {
  const now   = new Date();
  const cutoff = new Date(now - windowDays * 86400000);

  // ── Velocity leaderboard ──────────────────────────────────────────────────
  // Group history points by card key, filter to window, compute price delta
  const byCard = {};
  snapHistory.forEach(p => {
    // Use most precise available key: tcgplayerId > name|set|collectorNumber|finish > name|set
    const k = p.tcgplayerId
      ? "tcg:" + p.tcgplayerId
      : p.collectorNumber
        ? [p.name, p.set||"", p.collectorNumber, p.finishType||"normal"].join("|").toLowerCase()
        : p.name + "|" + (p.set || "");
    if(!byCard[k]) byCard[k] = { key:k, name:p.name, set:p.set||"",
      collectorNumber:p.collectorNumber||"", finishType:p.finishType||"normal", points:[] };
    byCard[k].points.push({ price: p.price, date: new Date(p.date) });
  });

  const velocityCards = [];
  Object.entries(byCard).forEach(([k, points]) => {
    const inWindow = points.filter(p => p.date >= cutoff);
    if(inWindow.length < 2) return;
    inWindow.sort((a,b) => a.date - b.date);
    const oldest = inWindow[0].price, newest = inWindow[inWindow.length-1].price;
    if(!oldest || !newest) return;
    const pctChange = ((newest - oldest) / oldest) * 100;
    const sf = sfDataCache[k];
    const [name, set] = k.split("|");
    velocityCards.push({
      key: k, name, set, pctChange,
      currentPrice: newest,
      pricePoints:  inWindow.length,
      colors:       sf?.colors || sf?.colorIdentity || [],
      mechanics:    extractMechanics(sf),
      legalities:   sf?.legalities || {},
      rarity:       sf?.rarity || "",
      edhrecRank:   sf?.edhrecRank,
    });
  });
  velocityCards.sort((a,b) => b.pctChange - a.pctChange);
  const gainers   = velocityCards.filter(c => c.pctChange > 0).slice(0, 10);
  const softeners = velocityCards.filter(c => c.pctChange < 0).slice(0, 10);

  // ── Color pie analysis ────────────────────────────────────────────────────
  // Compare color distribution of A/B-graded cards vs. full inventory
  const colorAll = { W:0, U:0, B:0, R:0, G:0, C:0, M:0 };
  const colorAB  = { W:0, U:0, B:0, R:0, G:0, C:0, M:0 };

  results.forEach(r => {
    const sf     = sfDataCache[r.cardKey || (r.name+"|"+(r.set||""))];
    const colors = sf?.colors || [];
    const bucket = colors.length === 0 ? "C" : colors.length > 1 ? "M" : colors[0];
    colorAll[bucket] = (colorAll[bucket]||0) + r.qty;
    if(r.grade === "A" || r.grade === "B") {
      colorAB[bucket] = (colorAB[bucket]||0) + r.qty;
    }
  });

  const totalAll = Object.values(colorAll).reduce((s,v)=>s+v,0) || 1;
  const totalAB  = Object.values(colorAB).reduce((s,v)=>s+v,0)  || 1;
  const colorStats = Object.entries(COLOR_CONFIG).map(([code, cfg]) => ({
    code, ...cfg,
    allPct: Math.round((colorAll[code]||0) / totalAll * 100),
    abPct:  Math.round((colorAB[code]||0)  / totalAB  * 100),
    allQty: colorAll[code]||0,
    abQty:  colorAB[code]||0,
    gap:    Math.round(((colorAB[code]||0)/totalAB - (colorAll[code]||0)/totalAll)*100),
  })).filter(c => c.allQty > 0 || c.abQty > 0);

  // ── Format staple density ─────────────────────────────────────────────────
  const formatStats = FORMAT_PRIORITY.map(fmt => {
    const legal = results.filter(r => {
      const sf = sfDataCache[r.cardKey||(r.name+"|"+(r.set||""))];
      return sf?.legalities?.[fmt] === "legal";
    });
    const abLegal = legal.filter(r => r.grade === "A" || r.grade === "B");
    return {
      fmt, label: FORMAT_LABELS[fmt],
      total:   results.length,
      legal:   legal.length,
      abLegal: abLegal.length,
      legalPct: results.length ? Math.round(legal.length/results.length*100) : 0,
      abLegalPct: legal.length ? Math.round(abLegal.length/legal.length*100) : 0,
      topCards: abLegal.slice(0,5).map(r=>r.name),
    };
  }).filter(f => f.legal > 0);

  // ── Mechanic velocity (rolling window) ───────────────────────────────────
  // For each mechanic, average velocity of cards with that mechanic in window
  const mechVel = {};
  velocityCards.forEach(c => {
    c.mechanics.forEach(m => {
      if(!mechVel[m]) mechVel[m] = [];
      mechVel[m].push(c.pctChange);
    });
  });
  const avg = arr => arr.length ? arr.reduce((s,v)=>s+v,0)/arr.length : 0;
  const mechTrends = Object.entries(mechVel).map(([m, vals]) => ({
    cat: m, label: MECHANIC_CATS[m]?.label || m,
    color: MECHANIC_CATS[m]?.color || "var(--mut)",
    avgVel: avg(vals), cardCount: vals.length,
    trend: avg(vals) > 5 ? "up" : avg(vals) < -5 ? "down" : "flat",
  })).sort((a,b) => b.avgVel - a.avgVel);

  // ── Want list ─────────────────────────────────────────────────────────────
  // High-velocity mechanics with low A/B count = under-stocked in demand areas
  const totalABCards = results.filter(r=>r.grade==="A"||r.grade==="B").length || 1;
  const wantList = mechTrends
    .filter(m => m.avgVel > 3)
    .map(m => {
      const abForMech = results.filter(r => {
        const sf = sfDataCache[r.cardKey||(r.name+"|"+(r.set||""))];
        return (r.grade==="A"||r.grade==="B") && extractMechanics(sf).includes(m.cat);
      }).length;
      const coverage = abForMech / totalABCards;
      return { ...m, abCount: abForMech, coverage, underStocked: coverage < 0.15 };
    })
    .filter(m => m.underStocked)
    .slice(0, 6);

  return { velocityCards, gainers, softeners, colorStats, formatStats, mechTrends, wantList,
    hasData: snapHistory.length >= 2, dataPoints: snapHistory.length };
}

export default function App() {
  const [cards,      setCards]      = useState([]);
  const [fileName,   setFileName]   = useState("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [collCost,   setCollCost]   = useState("");
  const [discount,   setDiscount]   = useState(90);
  const [condQuality, setCondQuality] = useState("NM");
  const [priceFloor,  setPriceFloor]  = useState(0.50); // min card price to count as sellable
  const [customFloor, setCustomFloor] = useState("");    // custom floor text input
  const [bulkRate,    setBulkRate]    = useState(4.00);  // $ per 1000 bulk cards
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

  // ─── Batch 1: New Feature State ───────────────────────────────────────────
  const [activeTcg,    setActiveTcg]    = useState("MTG");
  const [dealSource,   setDealSource]   = useState("");
  const [travelCost,   setTravelCost]   = useState("");
  const [sfDataCache,  setSfDataCache]  = useState({});      // Enriched Scryfall data per card
  const [cardDamage,   setCardDamage]   = useState({});      // {cardKey: [damage type strings]}
  const [cardLanguage, setCardLanguage] = useState({});      // {cardKey: language string}
  const [earlyFlags,   setEarlyFlags]   = useState([]);      // Early Magic detection results
  const [showGuide,    setShowGuide]    = useState(false);
  const [showBuyCalc,  setShowBuyCalc]  = useState(false);
  const [buyTargetROI, setBuyTargetROI] = useState(30);
  const [buySellDisc,  setBuySellDisc]  = useState(10);
  const [showDealScore,setShowDealScore]= useState(false);
  const [dmgCard,      setDmgCard]      = useState(null);    // CardKey of open damage panel
  const [langCard,     setLangCard]     = useState(null);    // CardKey of open language panel
  const [mechStats,    setMechStats]    = useState([]);      // Per-mechanic aggregate stats
  const [showMechanics,setShowMechanics]= useState(false);   // Mechanic panel expanded
  const [snapHistory,  setSnapHistory]  = useState([]);      // Flat price history: [{name,set,price,date}]
  const [mechFilter,   setMechFilter]   = useState(null);    // Active mechanic filter for table
  // Market Dashboard state
  const [mktWindow,    setMktWindow]    = useState("14d");   // "14d" | "30d"
  const [mktPanel,     setMktPanel]     = useState("velocity"); // active sub-panel
  const [velocityIndex,setVelocityIndex]= useState([]);      // from Sheets Velocity Index tab
  const [watchlist,    setWatchlist]    = useState([]);      // from Sheets Watchlist tab
  const [watchAlerts,  setWatchAlerts]  = useState([]);      // cards currently at/above threshold
  const [mktLoading,   setMktLoading]   = useState(false);   // loading price cache from Sheets
  const [mktLastSync,  setMktLastSync]  = useState(null);    // ET timestamp of last cache read
  const [showWlAdd,    setShowWlAdd]    = useState(false);   // watchlist add form visible
  const [wlName,       setWlName]       = useState("");
  const [wlSet,        setWlSet]        = useState("");
  const [wlTarget,     setWlTarget]     = useState("");
  const [wlAlert,      setWlAlert]      = useState("");
  const [wlNotes,      setWlNotes]      = useState("");
  // Cloud Function integration
  const [cfUrl,        setCfUrl]        = useState("");       // Cloud Function base URL
  const [cfRunning,    setCfRunning]    = useState(false);    // CF run in progress
  const [cfLastResult, setCfLastResult] = useState(null);    // last CF run response
  const [trackedSets,  setTrackedSets]  = useState([]);      // from CF Config tab
  const [cfConfigOpen, setCfConfigOpen] = useState(false);   // CF config panel open

  const buildResults = useCallback((rawCards, mode, tFee, pFee, costPaid, discPct, cond) => {
    // Total market value of all found cards (used to allocate COGS proportionally)
    const totalMktVal = rawCards.reduce((sum, c) => {
      const p = c[mode] ?? c.mid ?? c.low ?? c.high ?? null;
      return sum + (p != null ? p * c.qty : 0);
    }, 0);
    return rawCards.map(c => {
      const price       = c[mode] ?? c.mid ?? c.low ?? c.high ?? null;
      const condMult    = COND_MULT[cond] ?? COND_MULT[c.condition] ?? 1.0;
      // Item 17: apply damage modifier if present
      // Printing-aware card key: sf:uuid preferred, fallback to name|set|cn|finish
      const sfLookup    = (sfDataCache||{})[c.name+"|"+(c.set||"")] || null;
      const cardKey     = buildPrintingKey(c, sfLookup);
      // Also support legacy name|set key for damage/language lookups
      const legacyKey   = c.name + "|" + (c.set||"");
      const dmgTypes    = (cardDamage||{})[cardKey] || (cardDamage||{})[legacyKey] || [];
      const dmgMod      = calcDamageModifier(dmgTypes, c.isFoil);
      const lang        = (cardLanguage||{})[cardKey] || (cardLanguage||{})[legacyKey] || "English";
      const foreignMod  = getForeignModifier(c.setCode || c.set, lang);
      const marketPrice = price != null ? price * foreignMod : null;
      const adjPrice    = marketPrice != null ? marketPrice * condMult * (1 + dmgMod) : null;
      const offerPrice  = adjPrice != null ? adjPrice * (discPct / 100) : null;
      const fees = calcFees(offerPrice, tFee, pFee);
      const cogs = (costPaid > 0 && totalMktVal > 0 && price != null)
        ? (costPaid / (discPct / 100)) / totalMktVal * price
        : null;
      // Printing fields from card object or Scryfall data
      const sfData        = (sfDataCache||{})[cardKey] || sfLookup;
      const collectorNumber = c.collectorNumber || sfData?.collectorNumber || "";
      const tcgplayerId   = c.tcgplayerId     || sfData?.tcgplayerId     || "";
      const finishType    = c.finishType      || sfData?.finishType      || (c.isFoil?"foil":"normal");
      const priceNormal   = sfData?.priceNormal || null;
      const priceFoil     = sfData?.priceFoil   || null;
      const priceEtched   = sfData?.priceEtched  || null;
      const gradeResult   = calcSellGrade(c, sfData);
      return { ...c, cardKey, marketPrice, adjPrice, offerPrice,
        collectorNumber, tcgplayerId, finishType,
        priceNormal, priceFoil, priceEtched,
        tcgFee: fees.tcgFee, procFee: fees.procFee, totalFee: fees.totalFee,
        netRevenue: fees.netRevenue, cogs, found: price != null,
        grade: gradeResult.grade, gradeScore: gradeResult.score,
        dmgTypes, language: lang, foreignMod,
      };
    });
  }, [cardDamage, sfDataCache, cardLanguage]);

  const loadFile = useCallback((file) => {
    if(!file) return;
    setErr("");
    const reader = new FileReader();
    reader.onload = e => {
      try {
        const { cards: parsed, error } = parseTCGPlayerCSV(e.target.result);
        if(error) throw new Error(error);
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
    const newSfCache = {};
    const newEarlyFlags = [];
    const needsSF  = cards.filter(c => c.low == null && c.mid == null && c.high == null);
    const enriched = [...cards];

    if(needsSF.length > 0) {
      for(let i = 0; i < needsSF.length; i++) {
        if(abortRef.current) break;
        const c = needsSF[i];
        setProgMsg("Scryfall " + (i+1) + "/" + needsSF.length + ": " + c.name);
        setProg(Math.round((i / needsSF.length) * 100));
        const sf = await fetchScryfall(c.name, c.set, c.isFoil, c.collectorNumber||"");
        const idx = enriched.findIndex(r => r === c);
        if(idx > -1 && sf?.price) {
          enriched[idx] = { ...enriched[idx], mid:sf.price, low:sf.price*0.8, high:sf.price*1.3,
            scryfallUri:sf.scryfallUri, setCode:sf.setCode,
            collectorNumber: sf.collectorNumber || c.collectorNumber || "",
            tcgplayerId: sf.tcgplayerId || c.tcgplayerId || "",
            finishType: sf.finishType || c.finishType || (c.isFoil?"foil":"normal"),
            source:"scryfall" };
          // Cache under both printing key and legacy key
          const printKey  = buildPrintingKey(c, sf);
          const legacyKey = c.name + "|" + (c.set||"");
          newSfCache[printKey]  = sf;
          newSfCache[legacyKey] = sf;
          // Item 8: detect early Magic sets
          if(sf.setCode && EARLY_SET_CODES.has(sf.setCode.toLowerCase())) {
            newEarlyFlags.push({
              name:c.name, setName:sf.setName, setCode:sf.setCode.toLowerCase(),
              price:sf.price,
              isAlphaBeta: ALPHA_BETA_CODES.has(sf.setCode.toLowerCase()),
              isForeignPremium: FOREIGN_PREMIUM_CODES.has(sf.setCode.toLowerCase()),
              authRequired: sf.price >= 25,
            });
          }
        }
        if(i < needsSF.length - 1) await sleep(80);
      }
    }
    // Also seed cache for CSV-priced cards so grades compute
    cards.forEach(c => {
      const legacyKey = c.name+"|"+(c.set||"");
      if(!newSfCache[legacyKey] && (c.mid||c.low)) {
        const stub = {
          price:c.mid||c.low, rarity:"rare", legalities:{}, edhrecRank:null, reserved:false,
          collectorNumber: c.collectorNumber||"",
          tcgplayerId:     c.tcgplayerId||"",
          finishType:      c.finishType||(c.isFoil?"foil":"normal"),
          priceNormal:     c.isFoil ? null  : (c.mid||c.low),
          priceFoil:       c.isFoil ? (c.mid||c.low) : null,
          priceEtched:     null,
        };
        newSfCache[legacyKey] = stub;
        // Also store under printing key if we have enough to build one
        const printKey = buildPrintingKey(c, stub);
        if(printKey !== legacyKey) newSfCache[printKey] = stub;
      }
    });
    setSfDataCache(newSfCache);
    setEarlyFlags(newEarlyFlags);
    const final = buildResults(enriched, priceMode, tcgFee, procFee, costNum, discount, condQuality);
    // Compute mechanic stats after results are built
    const ms = computeMechanicStats(final, newSfCache, snapHistory);
    setMechStats(ms);
    setProg(100); setResults(final); setStatus("done");
  }, [cards, priceMode, tcgFee, procFee, buildResults, costNum, discount, condQuality, sfDataCache]);

  const applyCollCost = v => { setCollCost(v); if(status==="done") setResults(prev => buildResults(prev, priceMode, tcgFee, procFee, parseFloat(v.replace(/[^0-9.]/g,""))||0, discount, condQuality)); };
  const applyDiscount = v => { setDiscount(v);     if(status==="done") setResults(prev => buildResults(prev, priceMode, tcgFee, procFee, costNum, v, condQuality)); };
  const applyCond     = v => { setCondQuality(v); if(status==="done") setResults(prev => buildResults(prev, priceMode, tcgFee, procFee, costNum, discount, v)); };
  // -- Snapshot export ------------------------------------------------------
  const exportSnapshot = () => {
    if(!results.length) return;
    const meta = [
      ["Deal Name:", dealName], ["Seller:", dealSeller], ["Date:", dealDate],
      ["Source:", dealSource], ["Stage:", dealStage], ["Status:", dealStatus],
      ["Offer %:", discount + "%"], ["Condition:", condQuality], ["TCG Fee %:", tcgFee + "%"],
      ["Proc Fee %:", procFee + "%"], ["Price Floor:", "$" + priceFloor], ["Bulk Rate:", "$" + bulkRate + "/1000"],
      ["Collection Cost:", collCost], ["Travel Cost:", travelCost], ["Notes:", dealNotes],
      [], // blank row separator
    ];
    const headers = ["Name","Set","Collector #","TCGplayer ID","Finish",
      "Foil","Variant","Qty","Cond","Low","Mid","High",
      "Offer Price","Mkt Total","TCG Fee","Proc Fee","Net Revenue","COGS/Card",
      "Grade","Source","Language","Damage Types"];
    const rows = results.map(r => [
      r.name, r.set, r.collectorNumber||"", r.tcgplayerId||"", r.finishType||"normal",
      r.isFoil?"Yes":"", r.variant||"", r.qty, r.condition||condQuality,
      r.low?.toFixed(2)||"", r.mid?.toFixed(2)||"", r.high?.toFixed(2)||"",
      r.offerPrice?.toFixed(2)||"", r.marketPrice!=null?(r.marketPrice*r.qty).toFixed(2):"",
      r.tcgFee?.toFixed(2)||"", r.procFee?.toFixed(2)||"",
      r.netRevenue?.toFixed(2)||"", r.cogs?.toFixed(2)||"",
      r.grade||"", r.source||"csv", r.language||"English", (r.dmgTypes||[]).join("; ")
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
  // Extract flat price history from snapshot rows for velocity calculation
  const extractSnapPrices = (rows, snapDate) => {
    let dataStart = 0;
    for(let i=0;i<rows.length;i++){
      if(rows[i][0]?.toLowerCase()==="name"){dataStart=i;break;}
    }
    const headers=(rows[dataStart]||[]).map(h=>h.toLowerCase().trim());
    const ni  = headers.indexOf("name");
    const si  = headers.indexOf("set");
    const mi  = headers.indexOf("mid");
    const cni = headers.indexOf("collector #");   // printing-level
    const tgi = headers.indexOf("tcgplayer id");  // printing-level
    const fi  = headers.indexOf("finish");
    if(ni<0||mi<0) return [];
    return rows.slice(dataStart+1).filter(r=>r[ni]).map(r=>({
      name:            r[ni],
      set:             r[si]||"",
      price:           parseFloat(r[mi])||null,
      date:            snapDate,
      collectorNumber: cni>=0 ? r[cni]||"" : "",
      tcgplayerId:     tgi>=0 ? r[tgi]||"" : "",
      finishType:      fi>=0  ? r[fi]||"normal" : "normal",
    })).filter(r=>r.price);
  };

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
      // Tab format: "YYYY-MM-DD - SafeDealName - Stage"
      // Date FIRST so extractSnapPrices date regex always finds it, and tabs sort chronologically in Sheets
      const tabName = dealDate + " - " + safeDeal + " - " + dealStage;

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
        ["Proc Fee %", procFee + "%"], ["Price Floor", "$" + priceFloor], ["Bulk Rate", "$" + bulkRate + "/1000"],
        ["Collection Cost", collCost], ["Travel Cost", travelCost],
        ["Deal Source", dealSource], ["Notes", dealNotes],
        ["Saved At", new Date().toISOString()], [],
        ["Name","Set","Foil","Variant","Qty","Cond","Low","Mid","High",
         "Offer Price","Mkt Total","TCG Fee","Proc Fee","Net Revenue","COGS/Card",
         "Grade","Mechanics","Language","Damage Types","Source"],
        ...results.map(r => {
          const sf = sfDataCache[r.cardKey||(r.name+"|"+( r.set||""))];
          const mechs = extractMechanics(sf).join("; ");
          return [
            r.name, r.set, r.isFoil?"Yes":"", r.variant||"", r.qty, r.condition||condQuality,
            r.low?.toFixed(2)||"", r.mid?.toFixed(2)||"", r.high?.toFixed(2)||"",
            r.offerPrice?.toFixed(2)||"",
            r.marketPrice!=null?(r.marketPrice*r.qty).toFixed(2):"",
            r.tcgFee?.toFixed(2)||"", r.procFee?.toFixed(2)||"",
            r.netRevenue?.toFixed(2)||"", r.cogs?.toFixed(2)||"",
            r.grade||"", mechs, r.language||"English",
            (r.dmgTypes||[]).join("; "), r.source||"csv"
          ];
        })
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
  // ── Read Velocity Index + Watchlist from Sheets ──────────────────────────
  const gsReadPriceCache = async () => {
    if(!gsToken || !gsSheetId) return;
    setMktLoading(true);
    try {
      // Read Velocity Index tab
      const viResp = await gsRequest("GET",
        "https://sheets.googleapis.com/v4/spreadsheets/" + gsSheetId +
        "/values/Velocity%20Index!A1:L5000"
      );
      const viRows = viResp.values || [];
      if(viRows.length > 1) {
        const vh = viRows[0].map(h => h.toLowerCase().trim());
        const viNameI    = vh.indexOf("name");
        const viSetI     = vh.indexOf("set");
        const viPriceI   = vh.indexOf("current price");
        const viPct14I   = vh.indexOf("pct change 14d");
        const viPct30I   = vh.indexOf("pct change 30d");
        const viDirI     = vh.indexOf("direction 14d");
        const viColI     = vh.indexOf("colors");
        const viRarI     = vh.indexOf("rarity");
        const viEdhI     = vh.indexOf("edhrec rank");
        const viCmdI     = vh.indexOf("commander legal");
        const viResI     = vh.indexOf("reserved");
        const viComputedI= vh.indexOf("computed at");

        // Additional columns from CF-written Velocity Index
        const viTcgI    = vh.indexOf("tcgplayer id");
        const viCnI     = vh.indexOf("collector #");
        const viSfIdI   = vh.indexOf("scryfall id");
        const viFinI    = vh.indexOf("finish");
        const parsed = viRows.slice(1).filter(r=>r[viNameI]).map(r => ({
          name:         r[viNameI]  || "",
          set:          r[viSetI]   || "",
          currentPrice: parseFloat(r[viPriceI])  || 0,
          pct14:        r[viPct14I] !== "" ? parseFloat(r[viPct14I]) : null,
          pct30:        r[viPct30I] !== "" ? parseFloat(r[viPct30I]) : null,
          dir14:        r[viDirI]   || "flat",
          colors:       r[viColI]   ? r[viColI].split("") : [],
          rarity:       r[viRarI]   || "",
          edhrecRank:   r[viEdhI]   ? parseInt(r[viEdhI]) : null,
          commanderLegal: r[viCmdI] === "Y",
          reserved:     r[viResI]   === "Y",
          computedAt:   r[viComputedI] || "",
          // Printing-level fields from CF-written data
          tcgplayerId:  viTcgI  >= 0 ? (r[viTcgI]  || "") : "",
          collectorNumber: viCnI >= 0 ? (r[viCnI]   || "") : "",
          scryfallId:   viSfIdI >= 0 ? (r[viSfIdI]  || "") : "",
          finishType:   viFinI  >= 0 ? (r[viFinI]   || "normal") : "normal",
        }));
        setVelocityIndex(parsed);
        if(parsed[0]?.computedAt) setMktLastSync(parsed[0].computedAt);
      }

      // Read Watchlist tab
      const wlResp = await gsRequest("GET",
        "https://sheets.googleapis.com/v4/spreadsheets/" + gsSheetId +
        "/values/Watchlist!A1:I500"
      );
      const wlRows = wlResp.values || [];
      if(wlRows.length > 1) {
        const wh = wlRows[0].map(h => h.toLowerCase().trim());
        const wlNameI   = wh.indexOf("name");
        const wlSetI    = wh.indexOf("set");
        const wlTargI   = wh.indexOf("buy target");
        const wlAlertI  = wh.indexOf("alert pct");
        const wlNotesI  = wh.indexOf("notes");
        const wlDateI   = wh.indexOf("date added");
        const wlLPrI    = wh.indexOf("last price");
        const wlLAlI    = wh.indexOf("last alert");
        const wlActI    = wh.indexOf("active");

        const wlParsed = wlRows.slice(1).filter(r=>r[wlNameI]).map((r,i) => ({
          _rowIdx:    i + 2,
          name:       r[wlNameI]  || "",
          set:        r[wlSetI]   || "",
          buyTarget:  parseFloat(r[wlTargI])  || null,
          alertPct:   parseFloat(r[wlAlertI]) || null,
          notes:      r[wlNotesI] || "",
          dateAdded:  r[wlDateI]  || "",
          lastPrice:  parseFloat(r[wlLPrI])   || null,
          lastAlert:  r[wlLAlI]   || "",
          active:     r[wlActI] !== "N",
        }));
        setWatchlist(wlParsed);

        // Compute alerts: cards at or above threshold
        const alerts = wlParsed.filter(w => w.active && w.lastAlert &&
          w.lastAlert.includes(new Date().toISOString().slice(0,10)));
        setWatchAlerts(alerts);
      }
    } catch(e) {
      console.warn("Price cache read error:", e.message);
    }
    setMktLoading(false);
  };

  // Add a card to the Watchlist tab in Sheets
  const gsAddWatchlistCard = async (name, set, buyTarget, alertPct, notes) => {
    if(!gsToken || !gsSheetId || !name.trim()) return;
    const sheetId = await gsEnsureSheet();
    // Ensure Watchlist tab exists
    const wlCols = ["Name","Set","Buy Target","Alert Pct","Notes",
                    "Date Added","Last Price","Last Alert","Active"];
    try {
      await gsRequest("GET",
        "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId +
        "/values/Watchlist!A1:A1"
      );
    } catch(e) {
      // Tab doesn't exist — create it
      await gsRequest("POST",
        "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId + ":batchUpdate",
        { requests:[{ addSheet:{ properties:{ title:"Watchlist" } } }] }
      );
      await gsRequest("PUT",
        "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId +
        "/values/Watchlist!A1?valueInputOption=USER_ENTERED",
        { values:[wlCols] }
      );
    }
    // Get current last row
    const existing = await gsRequest("GET",
      "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId +
      "/values/Watchlist!A:A"
    );
    const nextRow = (existing.values || []).length + 1;
    const today = new Date().toLocaleDateString("en-US",{timeZone:"America/New_York"});
    await gsRequest("PUT",
      "https://sheets.googleapis.com/v4/spreadsheets/" + sheetId +
      "/values/Watchlist!A" + nextRow + "?valueInputOption=USER_ENTERED",
      { values:[[name.trim(), set.trim(), buyTarget||"", alertPct||"", notes.trim(), today, "", "", "Y"]] }
    );
    await gsReadPriceCache(); // refresh watchlist display
  };

  // Remove a watchlist card (set Active = N)
  const gsRemoveWatchlistCard = async (rowIdx) => {
    if(!gsToken || !gsSheetId) return;
    await gsRequest("PUT",
      "https://sheets.googleapis.com/v4/spreadsheets/" + gsSheetId +
      "/values/Watchlist!I" + rowIdx + "?valueInputOption=USER_ENTERED",
      { values:[["N"]] }
    );
    await gsReadPriceCache();
  };

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

  // Recompute mechanic stats when snap history grows (new velocity data available)
  useEffect(() => {
    if(results.length > 0 && snapHistory.length > 0) {
      const ms = computeMechanicStats(results, sfDataCache, snapHistory);
      setMechStats(ms);
    }
  }, [snapHistory]);

  // Auto-load dashboard when tab is opened and connected
  useEffect(() => {
    if(activeTab === "dashboard" && gsToken && gsSheetId && !dealLog.length) {
      gsLoadDashboard();
    }
  }, [activeTab, gsToken, gsSheetId]);

  // ── Cloud Function trigger helpers ──────────────────────────────────────
  const triggerCF = async (path, label) => {
    if(!cfUrl) return;
    setCfRunning(true);
    setCfLastResult(null);
    try {
      const res = await fetch(cfUrl.replace(/\/$/, "") + path, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ source: "mtg-tool-app" }),
      });
      const data = await res.json().catch(() => ({ status: res.status }));
      setCfLastResult({ ok: res.ok, status: res.status, label, data });
      if(res.ok) setTimeout(() => gsReadPriceCache(), 3000);
    } catch(e) {
      setCfLastResult({ ok: false, status: 0, label, error: e.message });
    } finally {
      setCfRunning(false);
    }
  };

  const triggerCFHealth = async () => {
    if(!cfUrl) return;
    setCfRunning(true);
    try {
      const res  = await fetch(cfUrl.replace(/\/$/, "") + "/health");
      const data = await res.json().catch(() => ({}));
      setCfLastResult({ ok: res.ok, status: res.status, label: "Health Check", data });
    } catch(e) {
      setCfLastResult({ ok: false, status: 0, label: "Health Check", error: e.message });
    } finally {
      setCfRunning(false);
    }
  };

  // Load CF URL + tracked sets from Sheets CF Config tab
  const loadCfConfig = async () => {
    if(!gsToken || !gsSheetId) return;
    try {
      const resp = await gsRequest("GET",
        "https://sheets.googleapis.com/v4/spreadsheets/" + gsSheetId +
        "/values/CF%20Config!A1:B50"
      );
      const rows = (resp.values || []).slice(1);
      for(const row of rows) {
        const key = String(row[0]||"").trim().toLowerCase()
          .replace(/_([a-z])/g, (_, c) => c.toUpperCase());
        const val = String(row[1]||"").trim();
        if(key === "functionUrl" && val) setCfUrl(val);
        if(key === "trackedSets" && val)
          setTrackedSets(val.split(",").flatMap(s => s.trim().split(" ")).filter(Boolean).map(s => s.toUpperCase()));
      }
    } catch(e) { /* CF Config tab may not exist yet */ }
  };

  // Auto-load price cache when Market tab opens
  useEffect(() => {
    if(activeTab === "market" && gsToken && gsSheetId && !velocityIndex.length && !mktLoading) {
      gsReadPriceCache();
      loadCfConfig();
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
  // Load price history across all snapshots for velocity calculation
  const gsLoadSnapHistory = async (dealName, tabNames) => {
    if(!gsToken || !gsSheetId || !tabNames?.length) return;
    const allPoints = [];
    for(const tab of tabNames.slice(0, 20)) {  // cap at 20 snapshots for perf
      try {
        const data = await gsRequest("GET",
          "https://sheets.googleapis.com/v4/spreadsheets/" + gsSheetId +
          "/values/" + encodeURIComponent(tab) + "!A1:R500"
        );
        const rows = data.values || [];
        // Extract date from tab name pattern "DealName - YYYY-MM-DD - Stage"
        const dateMatch = tab.match(/\d{4}-\d{2}-\d{2}/);
        const snapDate = dateMatch ? dateMatch[0] : new Date().toISOString().slice(0,10);
        const points = extractSnapPrices(rows, snapDate);
        allPoints.push(...points);
      } catch(e) { /* skip failed snap */ }
    }
    setSnapHistory(prev => {
      // Merge, deduplicate by name+set+date
      const seen = new Set(prev.map(p=>p.name+"|"+p.set+"|"+p.date));
      const fresh = allPoints.filter(p=>!seen.has(p.name+"|"+p.set+"|"+p.date));
      return [...prev, ...fresh];
    });
  };

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
      // Load price history for velocity (async, non-blocking)
      const dealNameKey = meta["deal name"] || "";
      if(dealNameKey && snapshots[dealNameKey]?.length > 1) {
        gsLoadSnapHistory(dealNameKey, snapshots[dealNameKey]).catch(()=>{});
      }
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

  const applyMode  = m  => { setPriceMode(m);  if(status==="done") setResults(prev => buildResults(prev, m, tcgFee, procFee, costNum, discount, condQuality)); };
  const applyTcg   = v  => { setTcgFee(v);     if(status==="done") setResults(prev => buildResults(prev, priceMode, v, procFee, costNum, discount, condQuality)); };
  const applyProc  = v  => { setProcFee(v);    if(status==="done") setResults(prev => buildResults(prev, priceMode, tcgFee, v, costNum, discount, condQuality)); };

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

  // Price floor scenario -- only cards >= priceFloor are individually listed
  const sellable        = results.filter(r => r.marketPrice != null && r.marketPrice >= priceFloor);
  const bulkCards       = results.filter(r => r.marketPrice == null || r.marketPrice < priceFloor);
  const sellableQty     = sellable.reduce((s, r) => s + r.qty, 0);
  const bulkQty         = bulkCards.reduce((s, r) => s + r.qty, 0);
  const sellableMktVal  = sellable.reduce((s, r) => s + (r.marketPrice * r.qty), 0);
  const sellableNetRev  = sellable.reduce((s, r) => s + ((r.netRevenue||0) * r.qty), 0);
  const sellableFees    = sellable.reduce((s, r) => s + ((r.totalFee||0) * r.qty), 0);
  const bulkRevenue     = bulkQty > 0 ? Math.round((bulkQty / 1000) * bulkRate * 100) / 100 : 0;
  const floorNetRev     = sellableNetRev + bulkRevenue;
  const sellPct         = totals.market > 0 ? (sellableMktVal / totals.market) * 100 : 0;
  // P&L scenarios
  const plFloorSunk     = floorNetRev - costNum;
  const roiFloorSunk    = costNum > 0 ? (plFloorSunk / costNum) * 100 : null;
  const propCost        = costNum * (sellPct / 100);
  const plFloorProp     = floorNetRev - propCost;
  const roiFloorProp    = propCost > 0 ? (plFloorProp / propCost) * 100 : null;
  // Sell cycle estimate: 10%/wk of sellable qty
  const weeksToSell     = sellableQty > 0 ? Math.ceil(10) : null; // 100% / 10%/wk = 10 weeks

  // Full liquidation P&L
  const grossProfit     = totals.netRev - costNum;
  const roi             = costNum > 0 ? (grossProfit / costNum) * 100 : null;

  const filtered = results.filter(r => {
    if(filter && !((r.name||"").toLowerCase().includes(filter.toLowerCase()) || (r.set||"").toLowerCase().includes(filter.toLowerCase()))) return false;
    if(foilFilter === "foil"    && !r.isFoil) return false;
    if(foilFilter === "nonfoil" &&  r.isFoil) return false;
    // Mechanic filter
    if(mechFilter) {
      const sf = sfDataCache[r.cardKey||(r.name+"|"+(r.set||""))];
      const mechs = extractMechanics(sf);
      if(!mechs.includes(mechFilter)) return false;
    }
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
      grade:    {A:5,B:4,C:3,D:2,F:1}[r.grade||""] ?? 0,
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
          <div style={{display:"flex",alignItems:"baseline",gap:10}}>
            <h1>MTG Collection Valuation</h1>
            <small>TCGplayer CSV + Scryfall prices + deal intelligence</small>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:6}}>
            <span style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)",letterSpacing:".08em",textTransform:"uppercase"}}>TCG:</span>
            {Object.entries(SUPPORTED_TCGS).map(([key,tcg])=>(
              <button key={key} onClick={()=>tcg.enabled&&setActiveTcg(key)}
                title={tcg.enabled ? tcg.label : tcg.label+" — coming soon"}
                style={{padding:"3px 7px",background:activeTcg===key?"rgba(201,148,58,.2)":"var(--sur2)",
                  border:`1px solid ${activeTcg===key?"var(--gold)":"var(--bdr)"}`,borderRadius:3,
                  color:activeTcg===key?"var(--gold2)":tcg.enabled?"var(--mut)":"rgba(100,100,100,.45)",
                  fontFamily:"var(--fd)",fontSize:8,letterSpacing:".05em",
                  cursor:tcg.enabled?"pointer":"default",textTransform:"uppercase"}}>
                {key==="FleshAndBlood"?"F&B":key==="OnePiece"?"1P":key}
              </button>
            ))}
            <button onClick={()=>setShowGuide(g=>!g)}
              style={{marginLeft:6,padding:"4px 11px",
                background:showGuide?"rgba(58,184,184,.15)":"var(--sur2)",
                border:`1px solid ${showGuide?"var(--teal)":"var(--bdr)"}`,borderRadius:3,
                color:showGuide?"var(--teal)":"var(--mut)",fontFamily:"var(--fd)",fontSize:8,
                letterSpacing:".1em",cursor:"pointer",textTransform:"uppercase"}}>
              ? Guide
            </button>
          </div>
        </header>

        <main className="main">

          {/* ── User Guide ─────────────────────────────────────────────────── */}
          {showGuide && (
            <div style={{background:"var(--sur)",border:"1px solid var(--teal)",borderRadius:4,marginBottom:14,overflow:"hidden"}}>
              <div style={{background:"rgba(58,184,184,.07)",borderBottom:"1px solid var(--teal)",padding:"8px 16px",display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                <span style={{fontFamily:"var(--fd)",fontSize:10,letterSpacing:".12em",textTransform:"uppercase",color:"var(--teal)"}}>Quick Reference Guide</span>
                <button onClick={()=>setShowGuide(false)} style={{background:"none",border:"none",color:"var(--mut)",cursor:"pointer",fontSize:18,lineHeight:1}}>×</button>
              </div>
              <div style={{padding:"14px 18px",display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(240px,1fr))",gap:14}}>
                {[
                  {icon:"📄",title:"1. Get Your CSV",steps:["Go to TCGplayer Seller Portal → Inventory","Export as CSV (top-right menu)","Drop the file onto the upload area","The tool auto-detects TCGplayer format and parses all columns"]},
                  {icon:"⚙",title:"2. Set Pricing",steps:["Offer % = your buy price as % of market value (e.g. 40% = 40¢/dollar)","Price Floor = minimum price to list individually; below this goes to bulk","Bulk Rate = $ per 1,000 bulk cards","Condition multiplier adjusts all prices: NM=100%, LP=85%, DMG=30%"]},
                  {icon:"💸",title:"3. Set Fees",steps:["Pick your TCGplayer seller tier for the correct platform fee","Processing fee covers your time, supplies, and packaging","Net Revenue = what you keep after ALL fees","Combined fee % shown in the status bar at bottom of table"]},
                  {icon:"▶",title:"4. Run Valuation",steps:["Click Run Valuation in the Results panel header","Cards with no CSV price are looked up via Scryfall API (~80ms each)","Progress bar shows live Scryfall fetch status","Stop button cancels mid-run without losing already-fetched prices"]},
                  {icon:"📊",title:"5. Read the Results",steps:["Grade A–F = sell likelihood (A=moves fast, F=slow/hard to sell)","BULK badge = below price floor — counted in bulk total, not individual list","EARLY badge = pre-8th Edition card — click for authentication notes","DMG badge = damage types logged; click to expand damage type selector"]},
                  {icon:"🌐",title:"6. Foreign Cards",steps:["Click FX button on any row to set that card's language","Italian Legends + German Renaissance carry ~15–20% premiums","Modern non-English cards default to ~15% discount to English price","Foreign modifier shown as ▲ (premium) or ▼ (discount) in price cell"]},
                  {icon:"🧮",title:"7. Buy Calculator",steps:["Expand Buy Price Calculator in the left sidebar","Set your target ROI% and expected sell discount","Max Offer = highest bid that still hits your ROI target","Open Offer = Max × 90% — your opening number with room to negotiate"]},
                  {icon:"⭐",title:"8. Deal Score",steps:["Expand Deal Score for an A–F composite grade on the whole deal","Factors: ROI 25%, Sell Grade 20%, Bulk Quality 15%, Price Trend 15%","A/B card ratio 10%, Travel Cost 5%, Concentration 5%, Processing 5%","Score is advisory and does not block saving or any other actions"]},
                  {icon:"💾",title:"9. Save Snapshots",steps:["Fill in Deal Name in the Deal Tracker panel","Connect Google Sheets via the Sheets button","Each save creates a dated snapshot tab in your workbook","Export CSV saves a local backup without requiring Sheets connection"]},
                  {icon:"🔍",title:"10. Compare & Dashboard",steps:["Compare tab: diff any two snapshots side-by-side (file upload or Sheets)","Dashboard tab: view all saved deals, load any snapshot, edit deal fields","Editing a field in Dashboard auto-saves back to your Sheet","All deal data — source, notes, travel cost — flows into the Deal Log sheet"]},
                  {icon:"⚡",title:"11. Mechanic Intelligence",steps:["After Run Valuation, the sidebar shows a Mechanic Intelligence panel","Each mechanic gets a demand score: EDHREC 40%, Sell Grade 30%, Velocity 20%, Scarcity 10%","Click any mechanic letter grade to filter the results table to just those cards","Velocity requires 2+ snapshots of the same deal — load from Dashboard to activate","Scarcity scoring via MTGJSON reprint data is coming in a future build"]},
                ].map((s,i)=>(
                  <div key={i}>
                    <div style={{fontFamily:"var(--fd)",fontSize:9,letterSpacing:".1em",textTransform:"uppercase",color:"var(--gold2)",marginBottom:5}}>{s.icon} {s.title}</div>
                    {s.steps.map((step,j)=>(
                      <div key={j} style={{fontSize:11,color:"var(--mut)",marginBottom:3,paddingLeft:10,position:"relative",lineHeight:1.5}}>
                        <span style={{position:"absolute",left:0,color:"var(--bdr)"}}>·</span>{step}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tab bar */}
          <div className="tabs">
            {[["dashboard","Dashboard"], ["valuation","Valuation"], ["compare","Compare"], ["market","Market"]].map(([id,lbl]) => (
              <button key={id} className={"tab" + (activeTab===id?" active":"")} onClick={() => setActiveTab(id)}
                style={{position:"relative"}}>
                {lbl}
                {id==="market" && watchAlerts.length > 0 && (
                  <span style={{position:"absolute",top:4,right:4,minWidth:14,height:14,
                    borderRadius:7,background:"#e05050",color:"#fff",
                    fontFamily:"var(--fd)",fontSize:8,display:"flex",
                    alignItems:"center",justifyContent:"center",padding:"0 3px"}}>
                    {watchAlerts.length}
                  </span>
                )}
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
              <div className="sc-grp-lbl">{"Floor: $" + priceFloor + " -- " + sellableQty + " sellable"}</div>
              <div className="lbl"><span className="tt">Sellable Net Rev<span className="tt-icon">?</span><span className="tt-box">Net revenue from cards at or above the price floor, after fees. Cards below floor are counted as bulk. Includes bulk bin revenue.</span></span></div>
              <div className="val teal">{status==="done" ? fmtL(floorNetRev) : "--"}</div>
            </div>
            <div className="sc scenario">
              <div className="sc-grp-lbl">{"Bulk: " + bulkQty + " cards @ $" + bulkRate + "/1000"}</div>
              <div className="lbl"><span className="tt">Bulk Bin Value<span className="tt-icon">?</span><span className="tt-box">Revenue from selling cards below the price floor as bulk at your set rate per 1000 cards.</span></span></div>
              <div className="val">{status==="done" ? fmtL(bulkRevenue) : "--"}</div>
            </div>
            <div className="sc scenario">
              <div className="sc-grp-lbl">{"Sunk cost P&L w/ floor"}</div>
              <div className="lbl"><span className="tt">Sunk Cost P&L<span className="tt-icon">?</span><span className="tt-box">P&L treating full collection cost as sunk. Worst-case view: you paid for everything, only sellable cards and bulk generate revenue.</span></span></div>
              <div className={"val " + (plFloorSunk >= 0 ? "grn" : "red")}>
                {status==="done" && costNum > 0 ? (
                  <>
                    {fmtL(plFloorSunk)}
                    {roiFloorSunk != null && <div style={{fontSize:10,marginTop:2,color:roiFloorSunk>=0?"var(--grn)":"var(--red)"}}>{(roiFloorSunk>=0?"+":"") + roiFloorSunk.toFixed(1) + "% ROI"}</div>}
                  </>
                ) : "--"}
              </div>
            </div>
            <div className="sc scenario-b">
              <div className="sc-grp-lbl">{"Prop. P&L w/ floor"}</div>
              <div className="lbl"><span className="tt">Proportional P&L<span className="tt-icon">?</span><span className="tt-box">P&L allocating only the sellable cards' share of cost. Shows per-unit profitability on the cards that will actually move.</span></span></div>
              <div className={"val " + (plFloorProp >= 0 ? "grn" : "red")}>
                {status==="done" && costNum > 0 ? (
                  <>
                    {fmtL(plFloorProp)}
                    {roiFloorProp != null && <div style={{fontSize:10,marginTop:2,color:roiFloorProp>=0?"var(--grn)":"var(--red)"}}>{(roiFloorProp>=0?"+":"") + roiFloorProp.toFixed(1) + "% ROI"}</div>}
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

                  <div style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".12em",textTransform:"uppercase",color:"var(--mut)",marginTop:14,marginBottom:6}}>
                    Price Floor
                  </div>
                  <div style={{display:"flex",gap:5,flexWrap:"wrap",marginBottom:6}}>
                    {[0.10, 0.25, 0.50, 1.00, 2.00, 5.00].map(v => (
                      <button key={v} className={"tier-btn" + (priceFloor===v && !customFloor ? " active" : "")}
                        style={{padding:"3px 8px"}}
                        onClick={() => { setPriceFloor(v); setCustomFloor(""); }}>
                        {"$" + v.toFixed(2)}
                      </button>
                    ))}
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6,marginBottom:6}}>
                    <label style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".08em",color:"var(--mut)",whiteSpace:"nowrap"}}>Custom $</label>
                    <input type="number" min={0} step={0.05}
                      style={{background:"var(--bg)",border:"1px solid var(--bdr)",borderRadius:3,
                        color:"var(--gold2)",fontFamily:"var(--fb)",fontSize:13,padding:"3px 7px",
                        outline:"none",width:80}}
                      placeholder="0.00"
                      value={customFloor}
                      onChange={e => {
                        setCustomFloor(e.target.value);
                        const v = parseFloat(e.target.value);
                        if(!isNaN(v) && v >= 0) setPriceFloor(v);
                      }} />
                  </div>
                  <div className="sold-note">
                    {status==="done" && results.length > 0
                      ? sellableQty + " cards >= $" + priceFloor + " (sellable) -- " + bulkQty + " cards below floor (bulk) -- ~" + (sellableQty > 0 ? Math.ceil(100/10) : 0) + " wks to clear at 10%/wk"
                      : "Cards below the floor are counted as bulk, not individual listings."}
                  </div>
                  <div style={{fontFamily:"var(--fd)",fontSize:"8px",letterSpacing:".12em",textTransform:"uppercase",color:"var(--mut)",marginTop:12,marginBottom:6}}>
                    Bulk Rate
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:6}}>
                    <label style={{fontFamily:"var(--fd)",fontSize:"8px",color:"var(--mut)",whiteSpace:"nowrap"}}>$ / 1000 cards</label>
                    <input type="number" min={0} step={0.50}
                      style={{background:"var(--bg)",border:"1px solid var(--bdr)",borderRadius:3,
                        color:"var(--gold2)",fontFamily:"var(--fb)",fontSize:13,padding:"3px 7px",
                        outline:"none",width:80}}
                      value={bulkRate}
                      onChange={e => setBulkRate(parseFloat(e.target.value)||0)} />
                    <span style={{fontSize:11,color:"var(--mut)"}}>{"= " + fmtL((bulkQty/1000)*bulkRate) + " bulk rev"}</span>
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

              {/* Buy Price Calculator */}
              {results.length > 0 && (
                <div className="panel" style={{marginBottom:8}}>
                  <div className="ph" style={{cursor:"pointer",userSelect:"none"}} onClick={()=>setShowBuyCalc(v=>!v)}>
                    <span>Buy Price Calculator</span>
                    <span style={{fontSize:11,color:"var(--mut)"}}>{showBuyCalc?"▲":"▼"}</span>
                  </div>
                  {showBuyCalc && (
                    <div className="pb">
                      <p style={{fontSize:11,color:"var(--mut)",marginBottom:10,lineHeight:1.6}}>Max offer to hit target ROI. Open Offer = Max × 90% — your opening number with negotiating room.</p>
                      <div className="srow">
                        <label style={{minWidth:76}}>Target ROI</label>
                        <input type="range" min={5} max={100} step={5} value={buyTargetROI} onChange={e=>setBuyTargetROI(+e.target.value)} style={{flex:1,accentColor:"var(--gold)"}} />
                        <span className="sval">{buyTargetROI}%</span>
                      </div>
                      <div className="srow">
                        <label style={{minWidth:76}}>Sell Discount</label>
                        <input type="range" min={0} max={25} step={1} value={buySellDisc} onChange={e=>setBuySellDisc(+e.target.value)} style={{flex:1,accentColor:"var(--gold)"}} />
                        <span className="sval">{buySellDisc}%</span>
                      </div>
                      {(()=>{
                        const mkt = totals.market;
                        if(!mkt) return null;
                        const expSell = mkt*(1-buySellDisc/100);
                        const netRev = expSell*(1-(tcgFee+procFee)/100);
                        const maxOffer = netRev/(1+buyTargetROI/100);
                        return (
                          <>
                            <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:6,marginTop:10}}>
                              <div style={{padding:"7px 10px",background:"rgba(201,148,58,.08)",border:"1px solid rgba(201,148,58,.25)",borderRadius:3}}>
                                <div style={{fontFamily:"var(--fd)",fontSize:7,letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)",marginBottom:3}}>Max Offer</div>
                                <div style={{fontFamily:"var(--fd)",fontSize:18,color:"var(--gold2)"}}>{fmtL(maxOffer)}</div>
                              </div>
                              <div style={{padding:"7px 10px",background:"rgba(58,184,122,.06)",border:"1px solid rgba(58,184,122,.2)",borderRadius:3}}>
                                <div style={{fontFamily:"var(--fd)",fontSize:7,letterSpacing:".1em",textTransform:"uppercase",color:"var(--mut)",marginBottom:3}}>Open Offer</div>
                                <div style={{fontFamily:"var(--fd)",fontSize:18,color:"var(--grn)"}}>{fmtL(maxOffer*0.9)}</div>
                              </div>
                            </div>
                            <div style={{marginTop:7,fontSize:10,color:"var(--mut)",lineHeight:1.7}}>
                              Mkt {fmtL(mkt)} → Sell ({buySellDisc}% disc) {fmtL(expSell)} → After fees {fmtL(netRev)}
                            </div>
                          </>
                        );
                      })()}
                    </div>
                  )}
                </div>
              )}

              {/* Deal Score */}
              {results.length > 0 && (
                <div className="panel" style={{marginBottom:8}}>
                  {(()=>{
                    const tNum = parseFloat(String(travelCost||"").replace(/[^0-9.]/g,""))||0;
                    const graded = results.filter(r=>r.grade&&r.grade!=="--");
                    const avgGS = graded.length ? graded.reduce((s,r)=>s+({A:100,B:80,C:60,D:40,F:20}[r.grade]||50),0)/graded.length : 50;
                    const abCount = graded.filter(r=>r.grade==="A"||r.grade==="B").length;
                    const totalQty = results.reduce((s,r)=>s+r.qty,0);
                    const bulkPct = totalQty ? results.filter(r=>!r.found||r.marketPrice==null||r.marketPrice<priceFloor).reduce((s,r)=>s+r.qty,0)/totalQty*100 : 50;
                    const ds = calcDealScore({ roi:roi||0, avgGradeScore:avgGS,
                      bulkPct, abRatio:graded.length?abCount/graded.length:0.5,
                      travelCostPct:tNum>0&&totals.market>0?(tNum/totals.market)*100:0,
                      concentrationPct:50 });
                    const lc = {A:"#3ab87a",B:"#3ab8b8",C:"#c9943a",D:"#e07040",F:"#c94040"}[ds.letter]||"var(--mut)";
                    const labels = {projectedROI:"Projected ROI",avgGrade:"Avg Sell Grade",bulkQuality:"Bulk Quality",priceTrend:"Price Trend",abRatio:"A/B Card Ratio",travelCost:"Travel Cost",concentrationRisk:"Concentration Risk",processingCost:"Processing Cost"};
                    return (
                      <>
                        <div className="ph" style={{cursor:"pointer",userSelect:"none"}} onClick={()=>setShowDealScore(v=>!v)}>
                          <span>Deal Score</span>
                          <div style={{display:"flex",alignItems:"center",gap:8}}>
                            <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:20,color:lc}}>{ds.letter}</span>
                            <span style={{fontFamily:"var(--fd)",fontSize:10,color:"var(--mut)"}}>{ds.score}/100</span>
                          </div>
                          <span style={{fontSize:11,color:"var(--mut)"}}>{showDealScore?"▲":"▼"}</span>
                        </div>
                        {showDealScore && (
                          <div className="pb">
                            <p style={{fontSize:11,color:"var(--mut)",marginBottom:8,lineHeight:1.5}}>Advisory score — does not block any actions. Weights: ROI 25%, Grade 20%, Bulk 15%, Trend 15%, A/B Ratio 10%, Travel 5%, Concentration 5%, Processing 5%.</p>
                            {Object.entries(ds.breakdown).map(([k,v])=>(
                              <div key={k} style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:5}}>
                                <span style={{fontSize:11,color:"var(--mut)",flex:1}}>{labels[k]||k}</span>
                                <div style={{display:"flex",alignItems:"center",gap:6}}>
                                  <div style={{width:52,height:4,background:"var(--bdr)",borderRadius:2,overflow:"hidden"}}>
                                    <div style={{width:v+"%",height:"100%",background:v>70?"#3ab87a":v>40?"#c9943a":"#c94040",borderRadius:2}}/>
                                  </div>
                                  <span style={{fontFamily:"var(--fd)",fontSize:10,color:v>70?"#3ab87a":v>40?"#c9943a":"#c94040",minWidth:22,textAlign:"right"}}>{Math.round(v)}</span>
                                </div>
                              </div>
                            ))}
                          </div>
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Mechanic Intelligence Panel */}
              {mechStats.length > 0 && (
                <div className="panel" style={{marginBottom:8}}>
                  <div className="ph" style={{cursor:"pointer",userSelect:"none"}} onClick={()=>setShowMechanics(v=>!v)}>
                    <span>Mechanic Intelligence</span>
                    <div style={{display:"flex",alignItems:"center",gap:6}}>
                      <span style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)",letterSpacing:".06em"}}>
                        {mechStats.length} mechanic{mechStats.length!==1?"s":""} detected
                      </span>
                      <span style={{fontSize:11,color:"var(--mut)"}}>{showMechanics?"▲":"▼"}</span>
                    </div>
                  </div>
                  {showMechanics && (
                    <div className="pb">
                      <p style={{fontSize:11,color:"var(--mut)",marginBottom:10,lineHeight:1.7}}>
                        Paper-first demand score: <span style={{color:"var(--grn)"}}>Velocity 35%</span> · Sell Grade 30% · Scarcity 20% · <span style={{color:"rgba(100,100,100,.6)"}}>EDHREC 15%</span>.
                        EDHREC is deprioritized — it skews toward online players who don't buy paper.
                        eBay velocity will join the velocity bucket when integrated.
                        {!snapHistory.length && <span style={{color:"var(--gold2)"}}> Velocity inactive — needs 2+ snapshots of same deal (load from Dashboard).</span>}
                        {snapHistory.length > 0 && <span style={{color:"var(--grn)"}}> Velocity active: {snapHistory.length} price point{snapHistory.length!==1?"s":""} across snapshots.</span>}
                      </p>
                      {/* Top mechanic summary bar */}
                      <div style={{display:"flex",flexWrap:"wrap",gap:5,marginBottom:12}}>
                        {mechStats.slice(0,5).map(ms=>(
                          <div key={ms.cat} onClick={()=>setMechFilter(f=>f===ms.cat?null:ms.cat)}
                            title={`${ms.label} — Click to filter table — ${ms.cardCount} unique card types · ${ms.totalQty} total qty`}
                            style={{padding:"5px 9px",background:mechFilter===ms.cat?ms.color+"33":"var(--sur2)",
                              border:`1px solid ${mechFilter===ms.cat?ms.color:"var(--bdr)"}`,
                              borderRadius:3,cursor:"pointer",minWidth:54,textAlign:"center"}}>
                            <div style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:16,
                              color:{A:"#3ab87a",B:"#3ab8b8",C:"#c9943a",D:"#e07040",F:"#c94040"}[ms.letter]||"var(--mut)"}}>
                              {ms.letter}
                            </div>
                            <div style={{fontFamily:"var(--fd)",fontSize:7,color:ms.color,letterSpacing:".06em",
                              textTransform:"uppercase",marginTop:1}}>
                              {ms.cat}
                            </div>
                          </div>
                        ))}
                      </div>
                      {/* Full mechanic table */}
                      {mechStats.map(ms=>(
                        <div key={ms.cat} style={{marginBottom:8,padding:"7px 9px",
                          background:mechFilter===ms.cat?"rgba(255,255,255,.03)":"transparent",
                          border:`1px solid ${mechFilter===ms.cat?ms.color:"var(--bdr)"}`,
                          borderRadius:3,cursor:"pointer"}}
                          onClick={()=>setMechFilter(f=>f===ms.cat?null:ms.cat)}>
                          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                            <div style={{display:"flex",alignItems:"center",gap:7}}>
                              <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:15,
                                color:{A:"#3ab87a",B:"#3ab8b8",C:"#c9943a",D:"#e07040",F:"#c94040"}[ms.letter]||"var(--mut)"}}>
                                {ms.letter}
                              </span>
                              <div>
                                <div style={{fontSize:11,color:"var(--txt)",fontWeight:500}}>{ms.label}</div>
                                <div style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)",letterSpacing:".04em"}}>
                                  {ms.cardCount} card type{ms.cardCount!==1?"s":""} · {ms.totalQty} qty · {fmtL(ms.totalMarket)} mkt
                                </div>
                              </div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontFamily:"var(--fd)",fontSize:10,color:"var(--mut)"}}>{ms.score}/100</div>
                            </div>
                          </div>
                          {/* Score bar breakdown — paper-first weights */}
                          <div style={{display:"flex",gap:3,height:5,borderRadius:2,overflow:"hidden",marginBottom:4}}>
                            <div title={"Velocity (35%): "+(ms.hasVelocity?((ms.rawVel>0?"+":"")+ms.rawVel?.toFixed(1)+"%"):"no history yet")}
                              style={{flex:.35,background:ms.hasVelocity?(ms.velScore>60?"#3ab87a":ms.velScore>40?"#c9943a":"#c94040"):"rgba(100,100,100,.22)",borderRadius:"2px 0 0 2px"}}/>
                            <div title={"Sell Grade (30%): "+Math.round(ms.avgGrade)+"/100"}
                              style={{flex:.30,background:ms.avgGrade>65?"#3ab8b8":ms.avgGrade>40?"#c9943a":"#c94040"}}/>
                            <div title={"Scarcity (20%): MTGJSON reprint data coming"}
                              style={{flex:.20,background:"rgba(100,100,100,.22)"}}/>
                            <div title={"EDHREC (15%): "+Math.round(ms.avgEdhrec)+"/100 — paper-discounted"}
                              style={{flex:.15,background:ms.avgEdhrec>60?"rgba(58,184,184,.5)":"rgba(100,100,100,.22)",borderRadius:"0 2px 2px 0"}}/>
                          </div>
                          {/* Factor labels with weights */}
                          <div style={{display:"flex",gap:3,fontSize:7,fontFamily:"var(--fd)",letterSpacing:".03em"}}>
                            <span style={{flex:.35,color:ms.hasVelocity?"var(--grn)":"rgba(100,100,100,.5)"}}>
                              Vel 35%{ms.hasVelocity&&ms.rawVel!=null?" "+(ms.rawVel>0?"▲":"▼"):""}{ms.trendUp?" ↑":ms.trendDown?" ↓":""}
                            </span>
                            <span style={{flex:.30,color:"var(--mut)"}}>Grade 30%</span>
                            <span style={{flex:.20,color:"rgba(100,100,100,.45)"}}>Scarcity 20%</span>
                            <span style={{flex:.15,color:"rgba(100,100,100,.45)"}}>EDH 15%</span>
                          </div>
                          {/* Top cards */}
                          {ms.topCards.length > 0 && (
                            <div style={{marginTop:5,fontSize:10,color:"var(--mut)"}}>
                              Top cards: {ms.topCards.slice(0,3).join(", ")}
                              {ms.topCards.length > 3 && <span style={{color:"var(--bdr)"}}> +{ms.topCards.length-3} more</span>}
                            </div>
                          )}
                        </div>
                      ))}
                      <p style={{fontSize:10,color:"var(--mut)",marginTop:8,lineHeight:1.5}}>
                        Scarcity factor (reprint count) coming in a future build via MTGJSON bulk data.
                        Velocity requires 2+ saved snapshots of the same deal — load any deal from the Dashboard to begin accumulating history.
                      </p>
                    </div>
                  )}
                </div>
              )}

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
                    <div className="deal-field">
                      <label>Source Channel</label>
                      <select value={dealSource} onChange={e=>setDealSource(e.target.value)}>
                        <option value="">Select...</option>
                        {["Facebook Marketplace","Card Show","Estate Sale","Referral","Direct Outreach","LGS","eBay","Craigslist","Other"].map(s=><option key={s}>{s}</option>)}
                      </select>
                    </div>
                    <div className="deal-field">
                      <label>Travel Cost ($)</label>
                      <input value={travelCost} onChange={e=>setTravelCost(e.target.value)} placeholder="0.00" />
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
                  {mechFilter && (
                    <span style={{display:"flex",alignItems:"center",gap:4,padding:"2px 8px",
                      background:(MECHANIC_CATS[mechFilter]?.color||"var(--mut)")+"22",
                      border:`1px solid ${MECHANIC_CATS[mechFilter]?.color||"var(--bdr)"}`,
                      borderRadius:3,fontSize:9,color:MECHANIC_CATS[mechFilter]?.color||"var(--txt)",
                      fontFamily:"var(--fd)",cursor:"pointer"}}
                      onClick={()=>setMechFilter(null)} title="Clear mechanic filter">
                      {MECHANIC_CATS[mechFilter]?.label||mechFilter} ×
                    </span>
                  )}
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
                        {th("grade", "Grade", "center")}
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
                        const belowFloor = r.found && r.marketPrice != null && r.marketPrice < priceFloor;
                        return (
                          <React.Fragment key={i}>
                          <tr className={!r.found ? "miss" : ""}
                            style={belowFloor ? {background:"rgba(201,148,58,.05)"} : undefined}>
                            <td className="nm" title={r.name}>
                              {r.scryfallUri
                                ? <a href={r.scryfallUri} target="_blank" rel="noreferrer" style={{color:"inherit",textDecoration:"none"}}>{r.name}</a>
                                : r.name}
                              {belowFloor && <span className="bp" style={{marginLeft:5,background:"rgba(201,148,58,.12)",color:"var(--gold)",border:"1px solid rgba(201,148,58,.3)",fontSize:7,letterSpacing:".06em"}}>BULK</span>}
                            </td>
                            <td className="setcol" title={[r.set,r.collectorNumber,r.finishType].filter(Boolean).join(" · ")}>
                              {r.set || "--"}
                              {r.collectorNumber && (
                                <span style={{marginLeft:3,fontSize:8,color:"rgba(255,255,255,.3)",fontFamily:"var(--fd)"}}>{r.collectorNumber}</span>
                              )}
                              {r.finishType && r.finishType !== "normal" && (
                                <span style={{marginLeft:3,padding:"0 3px",
                                  background:r.finishType==="etched"?"rgba(155,127,232,.15)":"rgba(201,148,58,.15)",
                                  border:`1px solid ${r.finishType==="etched"?"rgba(155,127,232,.5)":"rgba(201,148,58,.5)"}`,
                                  borderRadius:2,fontSize:7,fontFamily:"var(--fd)",letterSpacing:".05em",
                                  color:r.finishType==="etched"?"#9b7fe8":"var(--gold2)"}}>
                                  {r.finishType.toUpperCase()}
                                </span>
                              )}
                              {earlyFlags.some(f=>f.name===r.name) && (
                                <span title="Early Magic — review individually, auth required $25+" style={{marginLeft:4,padding:"1px 4px",background:"rgba(201,148,58,.15)",border:"1px solid rgba(201,148,58,.4)",borderRadius:2,fontSize:7,color:"var(--gold2)",fontFamily:"var(--fd)",letterSpacing:".05em"}}>EARLY</span>
                              )}
                            </td>
                            <td style={{whiteSpace:"nowrap"}}>
                              {badge(r)}
                              {/* Mechanic tags — top 2, derived from sfDataCache */}
                              {(()=>{
                                const sf = sfDataCache[r.cardKey||(r.name+"|"+(r.set||""))];
                                const mechs = extractMechanics(sf).slice(0,2);
                                return mechs.map(m=>(
                                  <span key={m} onClick={()=>setMechFilter(mf=>mf===m?null:m)}
                                    title={MECHANIC_CATS[m]?.label+" — Click to filter table to this mechanic"}
                                    style={{marginLeft:3,padding:"1px 5px",
                                      background:mechFilter===m?(MECHANIC_CATS[m]?.color||"var(--mut)")+"33":"var(--sur2)",
                                      border:`1px solid ${mechFilter===m?(MECHANIC_CATS[m]?.color||"var(--bdr)"):"var(--bdr)"}`,
                                      borderRadius:2,fontSize:7,
                                      color:mechFilter===m?(MECHANIC_CATS[m]?.color||"var(--txt)"):"var(--mut)",
                                      fontFamily:"var(--fd)",cursor:"pointer",letterSpacing:".04em",
                                      textTransform:"uppercase"}}>
                                    {m}
                                  </span>
                                ));
                              })()}
                              {/* DMG badge — opens damage type selector */}
                              {(r.dmgTypes||[]).length > 0 && (
                                <span title={"Damage recorded: "+(r.dmgTypes||[]).join(", ")} onClick={()=>setDmgCard(k=>k===r.cardKey?null:r.cardKey)}
                                  style={{marginLeft:3,padding:"1px 4px",background:"rgba(201,64,64,.12)",border:"1px solid rgba(201,64,64,.3)",borderRadius:2,fontSize:7,color:"var(--red)",fontFamily:"var(--fd)",cursor:"pointer",letterSpacing:".05em"}}>DMG</span>
                              )}
                              {/* FX button — opens language selector */}
                              <span title="Set card language to apply foreign price modifier" onClick={()=>setLangCard(k=>k===r.cardKey?null:r.cardKey)}
                                style={{marginLeft:3,padding:"1px 5px",
                                  background:langCard===r.cardKey?"rgba(58,184,184,.18)":"var(--sur2)",
                                  border:`1px solid ${langCard===r.cardKey?"var(--teal)":"var(--bdr)"}`,
                                  borderRadius:2,fontSize:7,
                                  color:(r.language&&r.language!=="English")?"var(--teal)":langCard===r.cardKey?"var(--teal)":"var(--mut)",
                                  fontFamily:"var(--fd)",cursor:"pointer",letterSpacing:".05em"}}>
                                {r.language && r.language!=="English" ? r.language.slice(0,3).toUpperCase() : "FX"}
                              </span>
                            </td>
                            <td className="right">{r.qty}</td>
                            <td className="gd right">{r.found ? fmt(r.marketPrice) : <span style={{color:"var(--mut)",fontSize:11}}>--</span>}</td>
                            <td className="gd right">{r.found ? fmt(total) : "--"}</td>
                            <td className="rd right">{r.found ? fmt(fees) : "--"}</td>
                            <td className="gr right">{r.found ? fmt(net) : "--"}</td>
                            <td className="center" style={{minWidth:36}}>
                              {r.grade && r.grade!=="--" ? (
                                <span title={"Sell grade: "+r.grade+" ("+r.gradeScore+"/100). A=high demand/moves fast, F=slow/niche. Factors: EDHREC rank, format legality, rarity, price point, condition, reserved list."}
                                  style={{fontFamily:"var(--fd)",fontWeight:600,fontSize:14,
                                    color:{A:"#3ab87a",B:"#3ab8b8",C:"#c9943a",D:"#e07040",F:"#c94040"}[r.grade]||"var(--mut)"}}>
                                  {r.grade}
                                </span>
                              ) : <span style={{color:"var(--mut)",fontSize:10}}>--</span>}
                            </td>
                            <td className="right" style={{color:"var(--mut)"}}>{r.found && r.cogs != null && costNum > 0 ? fmt(r.cogs) : "--"}</td>
                            <td className="tl right">{r.found ? fmt(offer) : "--"}</td>
                          </tr>
                          {/* Language selector panel */}
                          {langCard===r.cardKey && (
                            <tr style={{background:"rgba(58,184,184,.04)"}}>
                              <td colSpan={12} style={{padding:"8px 14px 10px"}}>
                                <div style={{fontFamily:"var(--fd)",fontSize:8,letterSpacing:".1em",textTransform:"uppercase",color:"var(--teal)",marginBottom:6}}>
                                  Card Language
                                  {r.foreignMod && r.foreignMod!==1.0 && (
                                    <span style={{marginLeft:8,color:r.foreignMod>1?"#3ab87a":"var(--mut)",fontFamily:"var(--fb)",textTransform:"none",fontSize:10}}>
                                      Current modifier: {r.foreignMod>1?"+":""}{Math.round((r.foreignMod-1)*100)}% {r.foreignMod>1?"(premium)":"(discount)"}
                                    </span>
                                  )}
                                </div>
                                <div style={{display:"flex",flexWrap:"wrap",gap:4}}>
                                  {FOREIGN_LANGUAGES.map(lang=>{
                                    const cur = (cardLanguage[r.cardKey]||"English");
                                    const sel = cur===lang;
                                    return (
                                      <button key={lang} onClick={()=>{
                                        const nl={...cardLanguage,[r.cardKey]:lang};
                                        setCardLanguage(nl);
                                        if(status==="done") setResults(prev=>buildResults(prev,priceMode,tcgFee,procFee,costNum,discount,condQuality));
                                      }} style={{padding:"3px 9px",background:sel?"rgba(58,184,184,.2)":"var(--sur2)",
                                        border:`1px solid ${sel?"var(--teal)":"var(--bdr)"}`,borderRadius:2,
                                        color:sel?"var(--teal)":"var(--mut)",fontFamily:"var(--fd)",fontSize:8,
                                        letterSpacing:".05em",cursor:"pointer",fontWeight:sel?"600":"400"}}>
                                        {lang}
                                      </button>
                                    );
                                  })}
                                </div>
                              </td>
                            </tr>
                          )}
                          {/* Damage type selector panel */}
                          {dmgCard===r.cardKey && (
                            <tr style={{background:"rgba(201,64,64,.03)"}}>
                              <td colSpan={12} style={{padding:"8px 14px 10px"}}>
                                <div style={{fontFamily:"var(--fd)",fontSize:8,letterSpacing:".1em",textTransform:"uppercase",color:"var(--red)",marginBottom:6}}>
                                  Damage Types
                                  {(r.dmgTypes||[]).length > 0 && (
                                    <span style={{marginLeft:8,fontFamily:"var(--fb)",textTransform:"none",fontSize:10,color:"var(--red)"}}>
                                      Combined modifier: {Math.round(calcDamageModifier(r.dmgTypes||[],r.isFoil)*100)}%
                                    </span>
                                  )}
                                </div>
                                {Object.entries(DAMAGE_CATS).map(([cat,types])=>{
                                  if(cat==="foil" && !r.isFoil) return null;
                                  return (
                                    <div key={cat} style={{marginBottom:6}}>
                                      <div style={{fontSize:9,color:"var(--mut)",fontStyle:"italic",textTransform:"capitalize",marginBottom:3}}>{cat}</div>
                                      <div style={{display:"flex",flexWrap:"wrap",gap:3}}>
                                        {types.map(t=>{
                                          const sel = (cardDamage[r.cardKey]||[]).includes(t);
                                          return (
                                            <button key={t} onClick={()=>{
                                              const cur=cardDamage[r.cardKey]||[];
                                              const next=sel?cur.filter(x=>x!==t):[...cur,t];
                                              const nd={...cardDamage,[r.cardKey]:next};
                                              setCardDamage(nd);
                                              if(status==="done") setResults(prev=>buildResults(prev,priceMode,tcgFee,procFee,costNum,discount,condQuality));
                                            }} style={{padding:"3px 8px",background:sel?"rgba(201,64,64,.2)":"var(--sur2)",
                                              border:`1px solid ${sel?"#c94040":"var(--bdr)"}`,borderRadius:2,
                                              color:sel?"#c94040":"var(--mut)",fontFamily:"var(--fd)",fontSize:7,
                                              letterSpacing:".05em",cursor:"pointer",fontWeight:sel?"600":"400",textTransform:"uppercase"}}>
                                              {t}
                                            </button>
                                          );
                                        })}
                                      </div>
                                    </div>
                                  );
                                })}
                              </td>
                            </tr>
                          )}
                          </React.Fragment>
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
                  {/* Top mechanic chips in status bar */}
                  {mechStats.slice(0,3).map(ms=>(
                    <span key={ms.cat} onClick={()=>setMechFilter(f=>f===ms.cat?null:ms.cat)}
                      title={ms.label+" — Demand score "+ms.score+"/100 — Click to filter table"}
                      style={{padding:"2px 7px",background:mechFilter===ms.cat?ms.color+"33":"transparent",
                        border:`1px solid ${mechFilter===ms.cat?ms.color:"var(--bdr)"}`,
                        borderRadius:3,fontFamily:"var(--fd)",fontSize:8,
                        color:mechFilter===ms.cat?ms.color:"var(--mut)",cursor:"pointer",
                        letterSpacing:".05em",textTransform:"uppercase",whiteSpace:"nowrap"}}>
                      {ms.cat} {ms.letter}
                    </span>
                  ))}
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

                    {/* ── Mechanic Trends panel ─────────────────────────────── */}
                    {snapHistory.length > 0 && mechStats.length > 0 && (
                      <div style={{marginBottom:18,padding:"12px 16px",background:"var(--sur)",
                        border:"1px solid var(--bdr)",borderRadius:4}}>
                        <div style={{fontFamily:"var(--fd)",fontSize:10,letterSpacing:".12em",
                          textTransform:"uppercase",color:"var(--gold2)",marginBottom:10}}>
                          ⚡ Mechanic Trends
                          <span style={{marginLeft:8,fontSize:8,color:"var(--mut)",textTransform:"none",letterSpacing:0}}>
                            based on {snapHistory.length} price point{snapHistory.length!==1?"s":""} across saved snapshots
                          </span>
                        </div>
                        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(160px,1fr))",gap:8}}>
                          {mechStats.filter(ms=>ms.hasVelocity).map(ms=>(
                            <div key={ms.cat} style={{padding:"8px 10px",background:"var(--bg)",
                              border:`1px solid ${ms.color}44`,borderRadius:3}}>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:4}}>
                                <span style={{fontSize:10,color:"var(--txt)",fontWeight:500}}>{ms.label}</span>
                                <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:14,
                                  color:{A:"#3ab87a",B:"#3ab8b8",C:"#c9943a",D:"#e07040",F:"#c94040"}[ms.letter]||"var(--mut)"}}>
                                  {ms.letter}
                                </span>
                              </div>
                              <div style={{display:"flex",justifyContent:"space-between",alignItems:"center"}}>
                                <span style={{fontFamily:"var(--fd)",fontSize:9,
                                  color:ms.rawVel>5?"#3ab87a":ms.rawVel<-5?"#c94040":"var(--mut)"}}>
                                  {ms.rawVel!=null?(ms.rawVel>0?"+":"")+ms.rawVel.toFixed(1)+"%":"--"} price δ
                                </span>
                                <span style={{fontSize:9,color:"var(--mut)"}}>
                                  {ms.trendUp?"↑ rising":ms.trendDown?"↓ softening":"→ stable"}
                                </span>
                              </div>
                              <div style={{marginTop:5,height:3,background:"var(--bdr)",borderRadius:2,overflow:"hidden"}}>
                                <div style={{width:ms.score+"%",height:"100%",
                                  background:ms.score>70?"#3ab87a":ms.score>45?"#c9943a":"#c94040",
                                  borderRadius:2,transition:"width .4s"}}/>
                              </div>
                              <div style={{display:"flex",justifyContent:"space-between",marginTop:3,
                                fontSize:8,fontFamily:"var(--fd)",color:"var(--mut)"}}>
                                <span>{ms.score}/100</span>
                                <span>{ms.cardCount} card type{ms.cardCount!==1?"s":""}</span>
                              </div>
                            </div>
                          ))}
                        </div>
                        {mechStats.filter(ms=>!ms.hasVelocity).length > 0 && (
                          <p style={{marginTop:8,fontSize:10,color:"rgba(100,100,100,.5)"}}>
                            {mechStats.filter(ms=>!ms.hasVelocity).map(ms=>ms.label).join(", ")} —
                            no velocity data yet. Will populate as more snapshots are saved.
                          </p>
                        )}
                      </div>
                    )}
                    {snapHistory.length === 0 && (
                      <div style={{marginBottom:14,padding:"9px 14px",background:"var(--sur)",
                        border:"1px solid var(--bdr)",borderRadius:4,fontSize:11,color:"var(--mut)"}}>
                        <span style={{fontFamily:"var(--fd)",fontSize:8,letterSpacing:".1em",
                          textTransform:"uppercase",color:"var(--gold2)",marginRight:8}}>⚡ Mechanic Trends</span>
                        Will appear here once you have 2+ saved snapshots for any deal.
                        Each save captures card prices — trends emerge as data accumulates.
                      </div>
                    )}

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


          {/* ── Market Dashboard ──────────────────────────────────────── */}
          {activeTab === "market" && (() => {
            const mktData = computeMarketData(snapHistory, sfDataCache, results, mktWindow === "14d" ? 14 : 30);

            return (
              <div style={{padding:"0 0 40px 0"}}>

                {/* Header row */}
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                  marginBottom:16,paddingBottom:12,borderBottom:"1px solid var(--bdr)"}}>
                  <div>
                    <div style={{fontFamily:"var(--fd)",fontSize:11,letterSpacing:".14em",
                      textTransform:"uppercase",color:"var(--gold2)"}}>Market Intelligence</div>
                    <div style={{fontSize:12,color:"var(--mut)",marginTop:3}}>
                      Paper card demand signals — velocity, color trends, format density, restock targets
                    </div>
                  </div>
                  <div style={{display:"flex",alignItems:"center",gap:8}}>
                    {/* Window toggle */}
                    {["14d","30d"].map(w => (
                      <button key={w} onClick={()=>setMktWindow(w)}
                        style={{padding:"4px 12px",fontFamily:"var(--fd)",fontSize:9,
                          letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer",
                          background:mktWindow===w?"var(--gold2)":"transparent",
                          color:mktWindow===w?"var(--bg)":"var(--mut)",
                          border:"1px solid "+(mktWindow===w?"var(--gold2)":"var(--bdr)"),
                          borderRadius:3}}>
                        {w==="14d"?"2 Weeks":"30 Days"}
                      </button>
                    ))}
                  </div>
                </div>

                {/* No data state */}
                {!mktData.hasData && (
                  <div style={{padding:"40px 0",textAlign:"center",color:"var(--mut)"}}>
                    <div style={{fontSize:32,opacity:.2,marginBottom:12}}>◎</div>
                    <div style={{fontSize:13,marginBottom:8}}>Market data builds as snapshots accumulate</div>
                    <div style={{fontSize:11,lineHeight:1.8,maxWidth:420,margin:"0 auto"}}>
                      Save 2+ snapshots for any deal from the Valuation tab to begin tracking velocity.
                      After ~2 weeks of saves, this dashboard will surface pricing trends, mechanic signals,
                      and restock targets automatically.
                    </div>
                    {snapHistory.length === 1 && (
                      <div style={{marginTop:12,padding:"8px 16px",display:"inline-block",
                        background:"var(--sur)",border:"1px solid var(--gold2)",borderRadius:3,
                        fontFamily:"var(--fd)",fontSize:9,color:"var(--gold2)",letterSpacing:".1em"}}>
                        1 SNAPSHOT SAVED — NEED 1 MORE TO UNLOCK VELOCITY
                      </div>
                    )}
                  </div>
                )}

                {mktData.hasData && (<>

                  {/* Sync status bar */}
                  <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",
                    marginBottom:10,padding:"6px 10px",background:"var(--sur)",
                    border:"1px solid var(--bdr)",borderRadius:3}}>
                    <div style={{fontFamily:"var(--fd)",fontSize:8,letterSpacing:".08em",color:"var(--mut)"}}>
                      {mktLoading && <span style={{color:"var(--gold2)"}}>Loading price cache…</span>}
                      {!mktLoading && velocityIndex.length > 0 && (
                        <span>
                          <span style={{color:"#3ab87a"}}>●</span>
                          {" "}{velocityIndex.length.toLocaleString()} cards tracked
                          {mktLastSync && " · Updated " + mktLastSync}
                        </span>
                      )}
                      {!mktLoading && !velocityIndex.length && gsToken && (
                        <span style={{color:"var(--gold2)"}}>
                          No price cache yet — run the Apps Script setup to begin daily tracking
                        </span>
                      )}
                      {!gsToken && (
                        <span style={{color:"var(--mut)"}}>Connect Google Sheets to enable price cache and watchlist</span>
                      )}
                    </div>
                    <div style={{display:"flex",gap:6,alignItems:"center"}}>
                      {watchAlerts.length > 0 && (
                        <span style={{padding:"2px 8px",background:"#e0505022",
                          border:"1px solid #e05050",borderRadius:3,
                          fontFamily:"var(--fd)",fontSize:8,color:"#e05050",
                          letterSpacing:".08em",cursor:"pointer"}}
                          onClick={()=>setMktPanel("watchlist")}>
                          {watchAlerts.length} ALERT{watchAlerts.length!==1?"S":""}
                        </span>
                      )}
                      {gsToken && (<>
                        <button onClick={gsReadPriceCache} disabled={mktLoading||cfRunning}
                          style={{padding:"3px 10px",fontFamily:"var(--fd)",fontSize:8,
                            letterSpacing:".08em",cursor:"pointer",
                            background:"transparent",color:"var(--mut)",
                            border:"1px solid var(--bdr)",borderRadius:3,
                            opacity:(mktLoading||cfRunning)?.5:1}}>
                          {mktLoading?"…":"↻ Refresh"}
                        </button>
                        {cfUrl && (<>
                          <button onClick={()=>triggerCF("/run/oracle","Oracle Diff")}
                            disabled={cfRunning}
                            title="Run Tier 1: oracle price diff + velocity index (~30s)"
                            style={{padding:"3px 10px",fontFamily:"var(--fd)",fontSize:8,
                              letterSpacing:".08em",cursor:"pointer",
                              background:cfRunning?"rgba(58,184,184,.1)":"rgba(58,184,184,.08)",
                              color:"var(--teal)",border:"1px solid rgba(58,184,184,.3)",
                              borderRadius:3,opacity:cfRunning?.5:1}}>
                            {cfRunning?"Running…":"⚡ Sync Prices"}
                          </button>
                          <button onClick={()=>triggerCF("/run","Full Sync")}
                            disabled={cfRunning}
                            title="Full nightly run: oracle diff + enrich movers + velocity"
                            style={{padding:"3px 10px",fontFamily:"var(--fd)",fontSize:8,
                              letterSpacing:".08em",cursor:"pointer",
                              background:"rgba(201,148,58,.08)",
                              color:"var(--gold)",border:"1px solid rgba(201,148,58,.3)",
                              borderRadius:3,opacity:cfRunning?.5:1}}>
                            Full Sync
                          </button>
                          <button onClick={()=>setCfConfigOpen(o=>!o)}
                            style={{padding:"3px 10px",fontFamily:"var(--fd)",fontSize:8,
                              letterSpacing:".08em",cursor:"pointer",
                              background:cfConfigOpen?"var(--sur2)":"transparent",
                              color:"var(--mut)",border:"1px solid var(--bdr)",borderRadius:3}}>
                            ⚙ CF Config
                          </button>
                        </>)}
                        {!cfUrl && gsToken && (
                          <span style={{fontSize:8,color:"var(--mut)",fontFamily:"var(--fd)"}}>
                            Add function_url to CF Config tab to enable cloud sync
                          </span>
                        )}
                      </>)}
                    </div>
                  </div>

                  {/* CF Config panel */}
                  {cfConfigOpen && (
                    <div style={{background:"var(--sur2)",border:"1px solid var(--bdr)",
                      borderRadius:4,padding:"12px 16px",marginBottom:12}}>
                      <div style={{fontFamily:"var(--fd)",fontSize:8,letterSpacing:".1em",
                        textTransform:"uppercase",color:"var(--teal)",marginBottom:10}}>
                        Cloud Function Configuration
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"center",marginBottom:10}}>
                        <div style={{flex:"1 1 280px"}}>
                          <div style={{fontFamily:"var(--fd)",fontSize:7,color:"var(--mut)",
                            letterSpacing:".06em",marginBottom:3}}>FUNCTION URL</div>
                          <input value={cfUrl} onChange={e=>setCfUrl(e.target.value)}
                            placeholder="https://us-east1-PROJECT.cloudfunctions.net/mtg-price-sync"
                            style={{width:"100%",padding:"4px 8px",background:"var(--bg)",
                              border:"1px solid var(--bdr)",borderRadius:3,
                              color:"var(--txt)",fontFamily:"var(--fb)",fontSize:10}} />
                        </div>
                        <button onClick={triggerCFHealth} disabled={!cfUrl||cfRunning}
                          style={{padding:"5px 12px",fontFamily:"var(--fd)",fontSize:8,
                            letterSpacing:".08em",cursor:"pointer",
                            background:"transparent",color:"var(--mut)",
                            border:"1px solid var(--bdr)",borderRadius:3,
                            marginTop:16}}>
                          Health Check
                        </button>
                      </div>
                      <div style={{display:"flex",flexWrap:"wrap",gap:8,alignItems:"flex-start"}}>
                        <div style={{flex:"1 1 200px"}}>
                          <div style={{fontFamily:"var(--fd)",fontSize:7,color:"var(--mut)",
                            letterSpacing:".06em",marginBottom:3}}>
                            TRACKED SETS (comma-separated)
                          </div>
                          <input value={trackedSets.join(",")}
                            onChange={e=>setTrackedSets(e.target.value.split(",").flatMap(s=>s.trim().split(" ")).filter(Boolean).map(s=>s.toUpperCase()))}
                            placeholder="MH3,M3C,FDN,DSK,OTJ"
                            style={{width:"100%",padding:"4px 8px",background:"var(--bg)",
                              border:"1px solid var(--bdr)",borderRadius:3,
                              color:"var(--txt)",fontFamily:"var(--fb)",fontSize:10}} />
                          <div style={{fontFamily:"var(--fd)",fontSize:7,color:"var(--mut)",marginTop:3}}>
                            These sets are fetched in full on the weekly Sunday sweep for pack EV analysis
                          </div>
                        </div>
                        <div style={{display:"flex",flexDirection:"column",gap:4,marginTop:16}}>
                          <button onClick={()=>triggerCF("/run/sets","Set Sweep")} disabled={!cfUrl||cfRunning}
                            style={{padding:"4px 10px",fontFamily:"var(--fd)",fontSize:8,
                              letterSpacing:".08em",cursor:"pointer",
                              background:"rgba(201,148,58,.08)",color:"var(--gold)",
                              border:"1px solid rgba(201,148,58,.3)",borderRadius:3}}>
                            Sweep Tracked Sets Now
                          </button>
                          <button onClick={()=>triggerCF("/run/enrich","Enrich Movers")} disabled={!cfUrl||cfRunning}
                            style={{padding:"4px 10px",fontFamily:"var(--fd)",fontSize:8,
                              letterSpacing:".08em",cursor:"pointer",
                              background:"transparent",color:"var(--mut)",
                              border:"1px solid var(--bdr)",borderRadius:3}}>
                            Enrich Movers Only
                          </button>
                          <button onClick={()=>triggerCF("/run/watchlist","Watchlist Check")} disabled={!cfUrl||cfRunning}
                            style={{padding:"4px 10px",fontFamily:"var(--fd)",fontSize:8,
                              letterSpacing:".08em",cursor:"pointer",
                              background:"transparent",color:"var(--mut)",
                              border:"1px solid var(--bdr)",borderRadius:3}}>
                            Check Watchlist Alerts
                          </button>
                        </div>
                      </div>
                      {/* Last CF result */}
                      {cfLastResult && (
                        <div style={{marginTop:10,padding:"6px 10px",borderRadius:3,
                          background:cfLastResult.ok?"rgba(58,184,58,.08)":"rgba(201,64,64,.08)",
                          border:cfLastResult.ok?"1px solid rgba(58,184,58,.2)":"1px solid rgba(201,64,64,.2)"}}>
                          <span style={{fontFamily:"var(--fd)",fontSize:8,
                            color:cfLastResult.ok?"#3ab87a":"#c94040",letterSpacing:".06em"}}>
                            {cfLastResult.ok?"✓":"✗"} {cfLastResult.label}
                            {cfLastResult.status ? " — HTTP " + cfLastResult.status : ""}
                            {cfLastResult.error  ? " — " + cfLastResult.error : ""}
                          </span>
                          {cfLastResult.data?.config && (
                            <div style={{fontFamily:"var(--fb)",fontSize:9,color:"var(--mut)",marginTop:3}}>
                              Threshold: {cfLastResult.data.config.moverThresholdPct}% |
                              Sets: {(cfLastResult.data.config.trackedSets||[]).join(", ")||"none"} |
                              Cache: {cfLastResult.data.config.cacheDays}d
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}

                  {/* Sub-nav */}
                  <div style={{display:"flex",gap:4,marginBottom:16,flexWrap:"wrap"}}>
                    {[
                      ["velocity","⚡ Velocity"],
                      ["trending","◎ Trending"],
                      ["mechanics","◈ Mechanics"],
                      ["colors","◉ Colors"],
                      ["formats","▦ Formats"],
                      ["wantlist","★ Want List"],
                      ["watchlist","◆ Watchlist" + (watchAlerts.length?" ("+watchAlerts.length+")":"")],
                    ].map(([id,lbl])=>(
                      <button key={id} onClick={()=>setMktPanel(id)}
                        style={{padding:"5px 13px",fontFamily:"var(--fd)",fontSize:8,
                          letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer",
                          background:mktPanel===id?"var(--sur2)":"transparent",
                          color:mktPanel===id?"var(--txt)":(id==="watchlist"&&watchAlerts.length?"#e05050":"var(--mut)"),
                          border:"1px solid "+(mktPanel===id?"var(--bdr)":"transparent"),
                          borderRadius:3}}>
                        {lbl}
                      </button>
                    ))}
                    <span style={{marginLeft:"auto",fontFamily:"var(--fd)",fontSize:8,
                      color:"var(--mut)",alignSelf:"center",letterSpacing:".06em"}}>
                      {mktData.dataPoints} snapshot point{mktData.dataPoints!==1?"s":""} · {mktWindow==="14d"?"14-day":"30-day"} window
                    </span>
                  </div>

                  {/* ── VELOCITY PANEL ──────────────────────────── */}
                  {mktPanel === "velocity" && (
                    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                      {/* Gainers */}
                      <div>
                        <div style={{fontFamily:"var(--fd)",fontSize:9,letterSpacing:".12em",
                          textTransform:"uppercase",color:"#3ab87a",marginBottom:10}}>
                          ↑ Gaining — Top {mktData.gainers.length}
                        </div>
                        {mktData.gainers.length === 0 && (
                          <div style={{fontSize:11,color:"var(--mut)",padding:"12px 0"}}>No gaining cards in this window yet.</div>
                        )}
                        {mktData.gainers.map((c,i) => (
                          <div key={c.key} style={{display:"flex",alignItems:"center",gap:10,
                            padding:"7px 10px",marginBottom:5,
                            background:"var(--sur)",border:"1px solid var(--bdr)",borderRadius:3}}>
                            <span style={{fontFamily:"var(--fd)",fontSize:10,color:"var(--mut)",
                              minWidth:16,textAlign:"right"}}>{i+1}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:11,color:"var(--txt)",
                                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                                fontWeight:500}}>{c.name}</div>
                              <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>
                                {c.set && <span style={{fontFamily:"var(--fd)",fontSize:7,
                                  color:"var(--mut)",textTransform:"uppercase"}}>{c.set}</span>}
                                {(c.colors.length===0?["C"]:c.colors.length>1?["M"]:c.colors).map(col=>(
                                  <span key={col} style={{fontFamily:"var(--fd)",fontSize:7,
                                    padding:"0 4px",borderRadius:2,
                                    background:(COLOR_CONFIG[col]?.hex||"var(--mut)")+"33",
                                    color:COLOR_CONFIG[col]?.hex||"var(--mut)",
                                    border:`1px solid ${(COLOR_CONFIG[col]?.hex||"var(--mut)")}55`}}>
                                    {COLOR_CONFIG[col]?.label||col}
                                  </span>
                                ))}
                                {c.mechanics.slice(0,2).map(m=>(
                                  <span key={m} style={{fontFamily:"var(--fd)",fontSize:7,
                                    padding:"0 4px",borderRadius:2,
                                    background:(MECHANIC_CATS[m]?.color||"var(--mut)")+"22",
                                    color:MECHANIC_CATS[m]?.color||"var(--mut)",
                                    border:`1px solid ${(MECHANIC_CATS[m]?.color||"var(--mut)")}44`}}>
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontFamily:"var(--fd)",fontSize:12,
                                color:"#3ab87a",fontWeight:700}}>
                                +{c.pctChange.toFixed(1)}%
                              </div>
                              <div style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)"}}>
                                ${c.currentPrice?.toFixed(2)||"--"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Softeners */}
                      <div>
                        <div style={{fontFamily:"var(--fd)",fontSize:9,letterSpacing:".12em",
                          textTransform:"uppercase",color:"#c94040",marginBottom:10}}>
                          ↓ Softening — Top {mktData.softeners.length}
                        </div>
                        {mktData.softeners.length === 0 && (
                          <div style={{fontSize:11,color:"var(--mut)",padding:"12px 0"}}>No softening cards in this window yet.</div>
                        )}
                        {mktData.softeners.map((c,i) => (
                          <div key={c.key} style={{display:"flex",alignItems:"center",gap:10,
                            padding:"7px 10px",marginBottom:5,
                            background:"var(--sur)",border:"1px solid var(--bdr)",borderRadius:3}}>
                            <span style={{fontFamily:"var(--fd)",fontSize:10,color:"var(--mut)",
                              minWidth:16,textAlign:"right"}}>{i+1}</span>
                            <div style={{flex:1,minWidth:0}}>
                              <div style={{fontSize:11,color:"var(--txt)",
                                whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",
                                fontWeight:500}}>{c.name}</div>
                              <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>
                                {c.set && <span style={{fontFamily:"var(--fd)",fontSize:7,
                                  color:"var(--mut)",textTransform:"uppercase"}}>{c.set}</span>}
                                {(c.colors.length===0?["C"]:c.colors.length>1?["M"]:c.colors).map(col=>(
                                  <span key={col} style={{fontFamily:"var(--fd)",fontSize:7,
                                    padding:"0 4px",borderRadius:2,
                                    background:(COLOR_CONFIG[col]?.hex||"var(--mut)")+"33",
                                    color:COLOR_CONFIG[col]?.hex||"var(--mut)",
                                    border:`1px solid ${(COLOR_CONFIG[col]?.hex||"var(--mut)")}55`}}>
                                    {COLOR_CONFIG[col]?.label||col}
                                  </span>
                                ))}
                                {c.mechanics.slice(0,2).map(m=>(
                                  <span key={m} style={{fontFamily:"var(--fd)",fontSize:7,
                                    padding:"0 4px",borderRadius:2,
                                    background:(MECHANIC_CATS[m]?.color||"var(--mut)")+"22",
                                    color:MECHANIC_CATS[m]?.color||"var(--mut)",
                                    border:`1px solid ${(MECHANIC_CATS[m]?.color||"var(--mut)")}44`}}>
                                    {m}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div style={{textAlign:"right",flexShrink:0}}>
                              <div style={{fontFamily:"var(--fd)",fontSize:12,
                                color:"#c94040",fontWeight:700}}>
                                {c.pctChange.toFixed(1)}%
                              </div>
                              <div style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)"}}>
                                ${c.currentPrice?.toFixed(2)||"--"}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── TRENDING PANEL (Velocity Index from Sheets) ── */}
                  {mktPanel === "trending" && (() => {
                    const inventoryKeys = new Set(
                      results.map(r => (r.name||"").toLowerCase())
                    );
                    const gainers = velocityIndex
                      .filter(c => c.pct14 !== null && c.pct14 > 0)
                      .slice(0, 20);
                    const softeners = velocityIndex
                      .filter(c => c.pct14 !== null && c.pct14 < 0)
                      .slice(0, 10);
                    const notOwned = velocityIndex
                      .filter(c => c.pct14 !== null && c.pct14 > 5 &&
                        !inventoryKeys.has(c.name.toLowerCase()))
                      .slice(0, 15);

                    const CardRow = ({c, showOwned}) => (
                      <div style={{display:"flex",alignItems:"center",gap:10,
                        padding:"7px 10px",marginBottom:5,
                        background:"var(--sur)",border:"1px solid var(--bdr)",borderRadius:3,
                        opacity:showOwned&&inventoryKeys.has(c.name.toLowerCase())?.6:1}}>
                        <div style={{flex:1,minWidth:0}}>
                          <div style={{display:"flex",alignItems:"center",gap:6}}>
                            <span style={{fontSize:11,color:"var(--txt)",fontWeight:500,
                              whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>
                              {c.name}
                            </span>
                            {showOwned && inventoryKeys.has(c.name.toLowerCase()) && (
                              <span style={{fontFamily:"var(--fd)",fontSize:7,padding:"0 4px",
                                background:"var(--sur2)",border:"1px solid var(--bdr)",
                                borderRadius:2,color:"var(--mut)",whiteSpace:"nowrap"}}>owned</span>
                            )}
                          </div>
                          <div style={{display:"flex",gap:4,marginTop:3,flexWrap:"wrap"}}>
                            {c.set && <span style={{fontFamily:"var(--fd)",fontSize:7,
                              color:"var(--mut)",textTransform:"uppercase"}}>{c.set}</span>}
                            {c.rarity && <span style={{fontFamily:"var(--fd)",fontSize:7,
                              color:"var(--mut)",textTransform:"capitalize"}}>{c.rarity}</span>}
                            {c.commanderLegal && <span style={{fontFamily:"var(--fd)",fontSize:7,
                              padding:"0 4px",borderRadius:2,
                              background:"#c9943a22",color:"#c9943a",
                              border:"1px solid #c9943a44"}}>EDH</span>}
                            {c.reserved && <span style={{fontFamily:"var(--fd)",fontSize:7,
                              padding:"0 4px",borderRadius:2,
                              background:"#9b7fe822",color:"#9b7fe8",
                              border:"1px solid #9b7fe844"}}>RL</span>}
                            {(c.colors.length===0?["C"]:c.colors.length>1?["M"]:c.colors).map(col=>(
                              <span key={col} style={{fontFamily:"var(--fd)",fontSize:7,
                                padding:"0 4px",borderRadius:2,
                                background:(COLOR_CONFIG[col]?.hex||"var(--mut)")+"33",
                                color:COLOR_CONFIG[col]?.hex||"var(--mut)",
                                border:`1px solid ${(COLOR_CONFIG[col]?.hex||"var(--mut)")}55`}}>
                                {COLOR_CONFIG[col]?.label||col}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div style={{textAlign:"right",flexShrink:0}}>
                          <div style={{fontFamily:"var(--fd)",fontSize:13,fontWeight:700,
                            color:c.pct14>0?"#3ab87a":"#c94040"}}>
                            {c.pct14>0?"+":""}{c.pct14?.toFixed(1)}%
                          </div>
                          {c.pct30 !== null && (
                            <div style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)"}}>
                              30d: {c.pct30>0?"+":""}{c.pct30.toFixed(1)}%
                            </div>
                          )}
                          <div style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)"}}>
                            ${c.currentPrice.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );

                    return (
                      <div>
                        {!velocityIndex.length && (
                          <div style={{padding:"30px 0",textAlign:"center",color:"var(--mut)",fontSize:11}}>
                            {gsToken
                              ? "Price cache not yet populated. Paste MTGPriceCache.gs into your Sheet's Apps Script editor and run manualRun() to begin."
                              : "Connect Google Sheets to enable market-wide trending data."}
                          </div>
                        )}
                        {velocityIndex.length > 0 && (
                          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:16}}>
                            {/* Left: top gainers */}
                            <div>
                              <div style={{fontFamily:"var(--fd)",fontSize:9,letterSpacing:".12em",
                                textTransform:"uppercase",color:"#3ab87a",marginBottom:10}}>
                                ↑ Market Gainers — 14d
                              </div>
                              {gainers.map(c=><CardRow key={c.name+c.set} c={c} showOwned={true}/>)}
                            </div>
                            {/* Right: not-owned gainers */}
                            <div>
                              <div style={{fontFamily:"var(--fd)",fontSize:9,letterSpacing:".12em",
                                textTransform:"uppercase",color:"var(--gold2)",marginBottom:10}}>
                                ★ Gaining — Not In Inventory
                              </div>
                              {notOwned.length === 0 && (
                                <div style={{fontSize:11,color:"var(--mut)",padding:"12px 0"}}>
                                  {results.length === 0
                                    ? "Run a valuation first to compare against your inventory."
                                    : "All top gainers are already in your current deal."}
                                </div>
                              )}
                              {notOwned.map(c=><CardRow key={c.name+c.set} c={c} showOwned={false}/>)}
                            </div>
                          </div>
                        )}
                        {velocityIndex.length > 0 && softeners.length > 0 && (
                          <div style={{marginTop:24}}>
                            <div style={{fontFamily:"var(--fd)",fontSize:9,letterSpacing:".12em",
                              textTransform:"uppercase",color:"#c94040",marginBottom:10}}>
                              ↓ Softening — 14d
                            </div>
                            <div style={{display:"grid",
                              gridTemplateColumns:"repeat(auto-fill,minmax(280px,1fr))",gap:8}}>
                              {softeners.map(c=><CardRow key={c.name+c.set} c={c} showOwned={true}/>)}
                            </div>
                          </div>
                        )}
                      </div>
                    );
                  })()}

                  {/* ── MECHANIC TRENDS PANEL ───────────────────── */}
                  {mktPanel === "mechanics" && (
                    <div>
                      <div style={{fontFamily:"var(--fd)",fontSize:9,letterSpacing:".12em",
                        textTransform:"uppercase",color:"var(--mut)",marginBottom:12}}>
                        Avg price velocity by mechanic — {mktWindow==="14d"?"14-day":"30-day"} window
                      </div>
                      {mktData.mechTrends.length === 0 && (
                        <div style={{fontSize:11,color:"var(--mut)"}}>No mechanic velocity data yet.</div>
                      )}
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
                        {mktData.mechTrends.map(m => (
                          <div key={m.cat} style={{padding:"10px 12px",
                            background:"var(--sur)",
                            border:`1px solid ${m.trend==="up"?m.color+"55":m.trend==="down"?"#c9404055":"var(--bdr)"}`,
                            borderRadius:3}}>
                            <div style={{display:"flex",justifyContent:"space-between",
                              alignItems:"flex-start",marginBottom:8}}>
                              <div>
                                <div style={{fontSize:11,color:"var(--txt)",fontWeight:500,marginBottom:2}}>
                                  {m.label}
                                </div>
                                <div style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)",
                                  letterSpacing:".04em"}}>
                                  {m.cardCount} card type{m.cardCount!==1?"s":""} in window
                                </div>
                              </div>
                              <span style={{fontFamily:"var(--fd)",fontSize:18,fontWeight:700,
                                color:m.trend==="up"?"#3ab87a":m.trend==="down"?"#c94040":"var(--mut)"}}>
                                {m.trend==="up"?"↑":m.trend==="down"?"↓":"→"}
                              </span>
                            </div>
                            {/* Velocity bar — zero-centered */}
                            <div style={{position:"relative",height:6,background:"var(--bdr)",
                              borderRadius:3,overflow:"hidden",marginBottom:5}}>
                              {m.avgVel >= 0 ? (
                                <div style={{position:"absolute",left:"50%",top:0,
                                  width:Math.min(50,Math.abs(m.avgVel)*1.5)+"%",
                                  height:"100%",background:"#3ab87a",borderRadius:"0 3px 3px 0"}}/>
                              ) : (
                                <div style={{position:"absolute",right:"50%",top:0,
                                  width:Math.min(50,Math.abs(m.avgVel)*1.5)+"%",
                                  height:"100%",background:"#c94040",borderRadius:"3px 0 0 3px"}}/>
                              )}
                              <div style={{position:"absolute",left:"50%",top:0,
                                width:1,height:"100%",background:"var(--sur)"}}/>
                            </div>
                            <div style={{fontFamily:"var(--fd)",fontSize:10,
                              color:m.trend==="up"?"#3ab87a":m.trend==="down"?"#c94040":"var(--mut)",
                              fontWeight:700}}>
                              {m.avgVel>0?"+":""}{m.avgVel.toFixed(1)}% avg
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* ── COLOR TRENDS PANEL ──────────────────────── */}
                  {mktPanel === "colors" && (
                    <div>
                      <div style={{fontFamily:"var(--fd)",fontSize:9,letterSpacing:".12em",
                        textTransform:"uppercase",color:"var(--mut)",marginBottom:4}}>
                        Color distribution — all inventory vs. A/B quality cards
                      </div>
                      <div style={{fontSize:11,color:"var(--mut)",marginBottom:16,lineHeight:1.6}}>
                        Gap shows where quality cards over- or under-represent a color in your inventory.
                        Positive gap = that color punches above its weight in A/B cards.
                      </div>
                      {mktData.colorStats.map(cs => (
                        <div key={cs.code} style={{marginBottom:12}}>
                          <div style={{display:"flex",justifyContent:"space-between",
                            alignItems:"center",marginBottom:4}}>
                            <div style={{display:"flex",alignItems:"center",gap:8}}>
                              <span style={{display:"inline-block",width:14,height:14,borderRadius:2,
                                background:cs.hex,border:`1px solid ${cs.border}`}}/>
                              <span style={{fontSize:11,color:"var(--txt)",fontWeight:500}}>
                                {cs.label}
                              </span>
                              <span style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)"}}>
                                {cs.allQty} cards total · {cs.abQty} A/B
                              </span>
                            </div>
                            <span style={{fontFamily:"var(--fd)",fontSize:10,fontWeight:700,
                              color:cs.gap>3?"#3ab87a":cs.gap<-3?"#c94040":"var(--mut)"}}>
                              {cs.gap>0?"+":""}{cs.gap}% gap
                            </span>
                          </div>
                          {/* Stacked bar: all inventory (muted) + A/B overlay */}
                          <div style={{height:8,background:"var(--bdr)",borderRadius:3,
                            overflow:"hidden",position:"relative"}}>
                            <div style={{position:"absolute",left:0,top:0,height:"100%",
                              width:cs.allPct+"%",background:cs.hex+"55",transition:"width .4s"}}/>
                            <div style={{position:"absolute",left:0,top:0,height:"100%",
                              width:cs.abPct+"%",background:cs.hex,opacity:.85,transition:"width .4s"}}/>
                          </div>
                          <div style={{display:"flex",gap:16,marginTop:3,
                            fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)"}}>
                            <span>All: {cs.allPct}%</span>
                            <span style={{color:cs.hex}}>A/B: {cs.abPct}%</span>
                          </div>
                        </div>
                      ))}
                      {mktData.colorStats.length === 0 && (
                        <div style={{fontSize:11,color:"var(--mut)"}}>
                          Run a valuation first to populate color data.
                        </div>
                      )}
                    </div>
                  )}

                  {/* ── FORMAT STAPLE DENSITY PANEL ─────────────── */}
                  {mktPanel === "formats" && (
                    <div>
                      <div style={{fontFamily:"var(--fd)",fontSize:9,letterSpacing:".12em",
                        textTransform:"uppercase",color:"var(--mut)",marginBottom:4}}>
                        Format staple density — current inventory
                      </div>
                      <div style={{fontSize:11,color:"var(--mut)",marginBottom:16,lineHeight:1.6}}>
                        % of inventory legal in each format, and what fraction of those are A/B quality.
                        Formats ranked by your priority: Commander first.
                      </div>
                      {mktData.formatStats.length === 0 && (
                        <div style={{fontSize:11,color:"var(--mut)"}}>
                          Run a valuation with Scryfall prices to populate format data.
                        </div>
                      )}
                      {mktData.formatStats.map((f,i) => (
                        <div key={f.fmt} style={{marginBottom:14,padding:"10px 14px",
                          background:"var(--sur)",border:"1px solid var(--bdr)",borderRadius:3}}>
                          <div style={{display:"flex",justifyContent:"space-between",
                            alignItems:"center",marginBottom:8}}>
                            <div style={{display:"flex",alignItems:"center",gap:10}}>
                              <span style={{fontFamily:"var(--fd)",fontWeight:700,fontSize:12,
                                color:"var(--gold2)",minWidth:18}}>{i+1}</span>
                              <div>
                                <div style={{fontSize:12,fontWeight:500,color:"var(--txt)"}}>
                                  {f.label}
                                </div>
                                <div style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)",
                                  marginTop:2,letterSpacing:".04em"}}>
                                  {f.legal}/{f.total} cards legal · {f.abLegal} A/B
                                </div>
                              </div>
                            </div>
                            <div style={{textAlign:"right"}}>
                              <div style={{fontFamily:"var(--fd)",fontSize:14,fontWeight:700,
                                color:f.legalPct>50?"#3ab87a":f.legalPct>20?"#c9943a":"var(--mut)"}}>
                                {f.legalPct}%
                              </div>
                              <div style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)"}}>
                                legal
                              </div>
                            </div>
                          </div>
                          {/* Two-layer bar: legal pct (muted) + A/B legal */}
                          <div style={{height:6,background:"var(--bdr)",borderRadius:3,
                            overflow:"hidden",position:"relative",marginBottom:5}}>
                            <div style={{position:"absolute",left:0,top:0,height:"100%",
                              width:f.legalPct+"%",background:"var(--gold2)",opacity:.25,
                              transition:"width .4s"}}/>
                            <div style={{position:"absolute",left:0,top:0,height:"100%",
                              width:(f.legalPct * f.abLegalPct / 100)+"%",
                              background:"var(--gold2)",transition:"width .4s"}}/>
                          </div>
                          <div style={{display:"flex",gap:16,fontFamily:"var(--fd)",
                            fontSize:8,color:"var(--mut)"}}>
                            <span>Legal: {f.legalPct}%</span>
                            <span style={{color:"var(--gold2)"}}>A/B of legal: {f.abLegalPct}%</span>
                          </div>
                          {f.topCards.length > 0 && (
                            <div style={{marginTop:6,fontSize:10,color:"var(--mut)"}}>
                              Top A/B: {f.topCards.slice(0,4).join(", ")}
                              {f.topCards.length > 4 && <span style={{color:"var(--bdr)"}}> +{f.topCards.length-4} more</span>}
                            </div>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {/* ── WANT LIST PANEL ─────────────────────────── */}
                  {mktPanel === "wantlist" && (
                    <div>
                      <div style={{fontFamily:"var(--fd)",fontSize:9,letterSpacing:".12em",
                        textTransform:"uppercase",color:"var(--gold2)",marginBottom:4}}>
                        ★ Restock Targets
                      </div>
                      <div style={{fontSize:11,color:"var(--mut)",marginBottom:16,lineHeight:1.7}}>
                        Mechanics with positive price velocity but low A/B card coverage in your current inventory.
                        These are categories where demand is outpacing your supply.
                        eBay velocity signals will strengthen these recommendations when integrated.
                      </div>
                      {mktData.wantList.length === 0 && (
                        <div style={{padding:"20px 0",textAlign:"center"}}>
                          <div style={{fontSize:11,color:"var(--mut)",lineHeight:1.8}}>
                            No clear restock gaps detected yet.
                            {snapHistory.length < 5
                              ? " Accumulate more snapshots for reliable signals."
                              : " Your A/B coverage is well-distributed across active mechanics."}
                          </div>
                        </div>
                      )}
                      <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fill,minmax(220px,1fr))",gap:10}}>
                        {mktData.wantList.map(m => (
                          <div key={m.cat} style={{padding:"12px 14px",
                            background:"var(--sur)",
                            border:"1px solid var(--gold2)44",borderRadius:3}}>
                            <div style={{display:"flex",justifyContent:"space-between",
                              alignItems:"center",marginBottom:6}}>
                              <span style={{fontSize:11,color:"var(--txt)",fontWeight:500}}>
                                {m.label}
                              </span>
                              <span style={{fontFamily:"var(--fd)",fontSize:10,
                                color:"#3ab87a",fontWeight:700}}>
                                +{m.avgVel.toFixed(1)}%
                              </span>
                            </div>
                            <div style={{fontFamily:"var(--fd)",fontSize:8,color:"var(--mut)",
                              marginBottom:8,lineHeight:1.7}}>
                              {m.abCount} A/B card{m.abCount!==1?"s":""} in inventory · {Math.round(m.coverage*100)}% coverage
                            </div>
                            {/* Coverage bar */}
                            <div style={{height:4,background:"var(--bdr)",borderRadius:2,
                              overflow:"hidden",marginBottom:4}}>
                              <div style={{width:Math.round(m.coverage*100)+"%",height:"100%",
                                background:"var(--gold2)",borderRadius:2}}/>
                            </div>
                            <div style={{fontSize:10,color:"var(--mut)",lineHeight:1.6}}>
                              Source more <span style={{color:m.color,fontWeight:500}}>{m.label.toLowerCase()}</span> cards
                              to capture this demand segment.
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Batch 3 note */}
                      <div style={{marginTop:24,padding:"10px 14px",
                        background:"var(--sur)",border:"1px solid var(--bdr)",borderRadius:3,
                        fontSize:10,color:"var(--mut)",lineHeight:1.7}}>
                        <span style={{fontFamily:"var(--fd)",fontSize:8,letterSpacing:".1em",
                          textTransform:"uppercase",color:"var(--bdr)",marginRight:8}}>Batch 3</span>
                        The Trending tab above uses live Scryfall bulk data (via Apps Script) to surface
                        specific cards gaining value that you don't stock. eBay sold velocity will
                        further sharpen targeting when integrated.
                      </div>
                    </div>
                  )}

                  {/* ── WATCHLIST PANEL ─────────────────────────── */}
                  {mktPanel === "watchlist" && (
                    <div>
                      <div style={{display:"flex",justifyContent:"space-between",
                        alignItems:"center",marginBottom:12}}>
                        <div>
                          <div style={{fontFamily:"var(--fd)",fontSize:9,letterSpacing:".12em",
                            textTransform:"uppercase",color:"var(--gold2)"}}>◆ Speculation Watchlist</div>
                          <div style={{fontSize:11,color:"var(--mut)",marginTop:3}}>
                            Cards you are tracking for price movement or sourcing opportunities.
                            Set a buy target or % alert — the Apps Script checks nightly.
                          </div>
                        </div>
                        {gsToken && (
                          <button onClick={()=>setShowWlAdd(v=>!v)}
                            style={{padding:"5px 12px",fontFamily:"var(--fd)",fontSize:8,
                              letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer",
                              background:showWlAdd?"var(--sur2)":"var(--gold2)",
                              color:showWlAdd?"var(--mut)":"var(--bg)",
                              border:"1px solid "+(showWlAdd?"var(--bdr)":"var(--gold2)"),
                              borderRadius:3,flexShrink:0}}>
                            {showWlAdd?"Cancel":"+ Add Card"}
                          </button>
                        )}
                      </div>

                      {/* Add form */}
                      {showWlAdd && gsToken && (
                        <div style={{marginBottom:16,padding:"12px 14px",
                          background:"var(--sur)",border:"1px solid var(--gold2)44",borderRadius:3}}>
                          <div style={{display:"grid",gridTemplateColumns:"1fr 100px 100px 100px",
                            gap:8,marginBottom:8}}>
                            <div>
                              <label style={{fontFamily:"var(--fd)",fontSize:8,
                                letterSpacing:".08em",textTransform:"uppercase",
                                color:"var(--mut)",display:"block",marginBottom:3}}>
                                Card Name *
                              </label>
                              <input value={wlName} onChange={e=>setWlName(e.target.value)}
                                placeholder="e.g. Tarmogoyf"
                                style={{width:"100%",padding:"5px 8px",background:"var(--bg)",
                                  border:"1px solid var(--bdr)",borderRadius:3,
                                  color:"var(--txt)",fontSize:11}}/>
                            </div>
                            <div>
                              <label style={{fontFamily:"var(--fd)",fontSize:8,
                                letterSpacing:".08em",textTransform:"uppercase",
                                color:"var(--mut)",display:"block",marginBottom:3}}>
                                Set (opt.)
                              </label>
                              <input value={wlSet} onChange={e=>setWlSet(e.target.value)}
                                placeholder="e.g. MMA"
                                style={{width:"100%",padding:"5px 8px",background:"var(--bg)",
                                  border:"1px solid var(--bdr)",borderRadius:3,
                                  color:"var(--txt)",fontSize:11}}/>
                            </div>
                            <div>
                              <label style={{fontFamily:"var(--fd)",fontSize:8,
                                letterSpacing:".08em",textTransform:"uppercase",
                                color:"var(--mut)",display:"block",marginBottom:3}}>
                                Buy Target $
                              </label>
                              <input value={wlTarget} onChange={e=>setWlTarget(e.target.value)}
                                placeholder="e.g. 15.00" type="number" step="0.01"
                                style={{width:"100%",padding:"5px 8px",background:"var(--bg)",
                                  border:"1px solid var(--bdr)",borderRadius:3,
                                  color:"var(--txt)",fontSize:11}}/>
                            </div>
                            <div>
                              <label style={{fontFamily:"var(--fd)",fontSize:8,
                                letterSpacing:".08em",textTransform:"uppercase",
                                color:"var(--mut)",display:"block",marginBottom:3}}>
                                Alert at % Gain
                              </label>
                              <input value={wlAlert} onChange={e=>setWlAlert(e.target.value)}
                                placeholder="e.g. 15" type="number" step="1"
                                style={{width:"100%",padding:"5px 8px",background:"var(--bg)",
                                  border:"1px solid var(--bdr)",borderRadius:3,
                                  color:"var(--txt)",fontSize:11}}/>
                            </div>
                          </div>
                          <div style={{marginBottom:8}}>
                            <label style={{fontFamily:"var(--fd)",fontSize:8,
                              letterSpacing:".08em",textTransform:"uppercase",
                              color:"var(--mut)",display:"block",marginBottom:3}}>
                              Notes
                            </label>
                            <input value={wlNotes} onChange={e=>setWlNotes(e.target.value)}
                              placeholder="e.g. Commander staple, watching for reprint announcement"
                              style={{width:"100%",padding:"5px 8px",background:"var(--bg)",
                                border:"1px solid var(--bdr)",borderRadius:3,
                                color:"var(--txt)",fontSize:11}}/>
                          </div>
                          <button onClick={async()=>{
                            if(!wlName.trim()) return;
                            await gsAddWatchlistCard(wlName,wlSet,wlTarget,wlAlert,wlNotes);
                            setWlName(""); setWlSet(""); setWlTarget("");
                            setWlAlert(""); setWlNotes(""); setShowWlAdd(false);
                          }} style={{padding:"5px 16px",fontFamily:"var(--fd)",fontSize:8,
                            letterSpacing:".1em",textTransform:"uppercase",cursor:"pointer",
                            background:"var(--gold2)",color:"var(--bg)",
                            border:"none",borderRadius:3}}>
                            Save to Watchlist
                          </button>
                        </div>
                      )}

                      {!gsToken && (
                        <div style={{padding:"20px 0",textAlign:"center",fontSize:11,color:"var(--mut)"}}>
                          Connect Google Sheets to enable the watchlist.
                        </div>
                      )}

                      {/* Active watchlist cards */}
                      {watchlist.filter(w=>w.active).length === 0 && gsToken && !showWlAdd && (
                        <div style={{padding:"20px 0",textAlign:"center",fontSize:11,color:"var(--mut)"}}>
                          No cards on your watchlist yet. Add cards above to start tracking.
                        </div>
                      )}

                      {watchlist.filter(w=>w.active).map(w => {
                        const velCard = velocityIndex.find(
                          v => v.name.toLowerCase() === w.name.toLowerCase());
                        const hasAlert = watchAlerts.some(a=>a._rowIdx===w._rowIdx);
                        const currentPrice = velCard?.currentPrice ?? w.lastPrice;
                        const pct14 = velCard?.pct14 ?? null;
                        const atTarget = w.buyTarget && currentPrice &&
                          currentPrice >= w.buyTarget;

                        return (
                          <div key={w._rowIdx} style={{marginBottom:8,padding:"10px 14px",
                            background:"var(--sur)",
                            border:`1px solid ${hasAlert?"#e05050":atTarget?"#3ab87a":"var(--bdr)"}`,
                            borderRadius:3}}>
                            <div style={{display:"flex",justifyContent:"space-between",
                              alignItems:"flex-start"}}>
                              <div style={{flex:1,minWidth:0}}>
                                <div style={{display:"flex",alignItems:"center",gap:8,
                                  marginBottom:4}}>
                                  <span style={{fontSize:12,color:"var(--txt)",fontWeight:500}}>
                                    {w.name}
                                  </span>
                                  {w.set && <span style={{fontFamily:"var(--fd)",fontSize:8,
                                    color:"var(--mut)",textTransform:"uppercase"}}>{w.set}</span>}
                                  {hasAlert && (
                                    <span style={{fontFamily:"var(--fd)",fontSize:7,
                                      padding:"1px 6px",borderRadius:2,
                                      background:"#e0505022",color:"#e05050",
                                      border:"1px solid #e0505055",letterSpacing:".08em"}}>
                                      ALERT
                                    </span>
                                  )}
                                  {atTarget && !hasAlert && (
                                    <span style={{fontFamily:"var(--fd)",fontSize:7,
                                      padding:"1px 6px",borderRadius:2,
                                      background:"#3ab87a22",color:"#3ab87a",
                                      border:"1px solid #3ab87a55",letterSpacing:".08em"}}>
                                      AT TARGET
                                    </span>
                                  )}
                                </div>
                                <div style={{display:"flex",gap:12,fontSize:10,color:"var(--mut)",
                                  flexWrap:"wrap"}}>
                                  {w.buyTarget && (
                                    <span>Target: <span style={{color:"var(--gold2)"}}>
                                      ${w.buyTarget.toFixed(2)}</span></span>
                                  )}
                                  {w.alertPct && (
                                    <span>Alert: <span style={{color:"var(--txt)"}}>
                                      +{w.alertPct}%</span></span>
                                  )}
                                  {w.dateAdded && <span>Added: {w.dateAdded}</span>}
                                  {w.notes && <span style={{color:"var(--mut)",fontStyle:"italic"}}>
                                    {w.notes}</span>}
                                </div>
                                {w.lastAlert && (
                                  <div style={{marginTop:4,fontSize:9,color:"#e05050"}}>
                                    Last alert: {w.lastAlert}
                                  </div>
                                )}
                              </div>
                              <div style={{textAlign:"right",flexShrink:0,marginLeft:12}}>
                                {currentPrice ? (
                                  <>
                                    <div style={{fontFamily:"var(--fd)",fontSize:14,
                                      fontWeight:700,color:"var(--txt)"}}>
                                      ${currentPrice.toFixed(2)}
                                    </div>
                                    {pct14 !== null && (
                                      <div style={{fontFamily:"var(--fd)",fontSize:10,
                                        color:pct14>0?"#3ab87a":pct14<0?"#c94040":"var(--mut)"}}>
                                        {pct14>0?"+":""}{pct14.toFixed(1)}% 14d
                                      </div>
                                    )}
                                  </>
                                ) : (
                                  <div style={{fontFamily:"var(--fd)",fontSize:10,
                                    color:"var(--mut)"}}>
                                    No price data yet
                                  </div>
                                )}
                                <button onClick={()=>gsRemoveWatchlistCard(w._rowIdx)}
                                  style={{marginTop:6,padding:"2px 8px",
                                    fontFamily:"var(--fd)",fontSize:7,cursor:"pointer",
                                    background:"transparent",color:"var(--mut)",
                                    border:"1px solid var(--bdr)",borderRadius:2,
                                    letterSpacing:".06em"}}>
                                  Remove
                                </button>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                </>)}
              </div>
            );
          })()}

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
