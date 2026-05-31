import { useState, useEffect, useRef, useCallback } from "react";

const css = `
  :root {
    --obsidian: #080A0E;
    --void: #0C0F14;
    --carbon: #111419;
    --slate: #181C23;
    --fog: #252C38;
    --ash: #3D4555;
    --smoke: #5A6478;
    --silver: #8A94A8;
    --pearl: #B8C0D0;
    --ivory: #E8EAF0;
    --aurum: #C9A84C;
    --aurum-bright: #E8C96A;
    --aurum-dim: #8A6A28;
    --aurum-glow: rgba(201,168,76,0.15);
    --aurum-border: rgba(201,168,76,0.25);
    --emerald: #1DB87A;
    --emerald-dim: rgba(29,184,122,0.12);
    --ruby: #E8455A;
    --ruby-dim: rgba(232,69,90,0.12);
    --sapphire: #4A9EF5;
    --amethyst: #9B72F5;
  }
  * { box-sizing: border-box; margin: 0; padding: 0; }
  body, #root { background: var(--obsidian); color: var(--ivory); font-family: 'DM Mono', monospace; }
  @keyframes pulse-aurum { 0%,100%{opacity:1} 50%{opacity:0.4} }
  @keyframes slide-up { from{transform:translateY(20px);opacity:0} to{transform:translateY(0);opacity:1} }
  @keyframes fade-in { from{opacity:0} to{opacity:1} }
  @keyframes ticker { 0%{transform:translateX(0)} 100%{transform:translateX(-50%)} }
  @keyframes glow-pulse { 0%,100%{box-shadow:0 0 20px var(--aurum-glow)} 50%{box-shadow:0 0 40px rgba(201,168,76,0.3)} }
  .aurum-platform { min-height:100vh; background:var(--obsidian); position:relative; overflow-x:hidden; }
  .noise-overlay { position:fixed; inset:0; opacity:0.03; pointer-events:none; z-index:1000; background-image:url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)'/%3E%3C/svg%3E"); }
  .ticker-bar { background:var(--void); border-bottom:1px solid var(--aurum-border); overflow:hidden; height:32px; display:flex; align-items:center; }
  .ticker-label { background:var(--aurum); color:var(--obsidian); font-size:9px; font-weight:500; letter-spacing:0.12em; padding:0 12px; height:100%; display:flex; align-items:center; flex-shrink:0; }
  .ticker-track { display:flex; animation:ticker 35s linear infinite; white-space:nowrap; }
  .ticker-item { display:flex; align-items:center; gap:6px; padding:0 20px; font-size:10px; letter-spacing:0.05em; border-right:1px solid var(--fog); }
  .ticker-sym { color:var(--pearl); font-weight:500; }
  .ticker-price { color:var(--ivory); }
  .tick-up { color:var(--emerald); }
  .tick-dn { color:var(--ruby); }
  .nav { display:flex; align-items:center; justify-content:space-between; padding:0 32px; height:60px; background:rgba(8,10,14,0.97); backdrop-filter:blur(20px); border-bottom:1px solid var(--fog); position:sticky; top:0; z-index:100; }
  .brand { display:flex; align-items:center; gap:12px; cursor:pointer; }
  .brand-name { font-family:'Playfair Display',serif; font-size:20px; font-weight:500; letter-spacing:0.08em; color:var(--ivory); }
  .brand-name span { color:var(--aurum); }
  .brand-tag { font-size:8px; letter-spacing:0.2em; color:var(--smoke); text-transform:uppercase; margin-top:-4px; }
  .nav-tabs { display:flex; gap:2px; }
  .nav-tab { padding:6px 16px; font-size:10px; letter-spacing:0.12em; text-transform:uppercase; color:var(--smoke); cursor:pointer; border-radius:3px; transition:all 0.2s; border:1px solid transparent; }
  .nav-tab:hover { color:var(--pearl); }
  .nav-tab.active { color:var(--aurum); border-color:var(--aurum-border); background:var(--aurum-glow); }
  .nav-right { display:flex; align-items:center; gap:16px; }
  .status-dot { width:7px; height:7px; border-radius:50%; background:var(--emerald); animation:pulse-aurum 2s ease-in-out infinite; box-shadow:0 0 8px var(--emerald); }
  .status-text { font-size:9px; color:var(--smoke); letter-spacing:0.1em; }
  .connect-btn { padding:7px 18px; background:var(--aurum); color:var(--obsidian); border:none; font-family:'DM Mono',monospace; font-size:9px; font-weight:500; letter-spacing:0.15em; text-transform:uppercase; cursor:pointer; border-radius:2px; transition:all 0.2s; }
  .connect-btn:hover { background:var(--aurum-bright); transform:translateY(-1px); }
  .main-grid { display:grid; grid-template-columns:240px 1fr 300px; min-height:calc(100vh - 92px); }
  .sidebar { background:var(--void); border-right:1px solid var(--fog); display:flex; flex-direction:column; padding:24px 0; overflow-y:auto; }
  .sidebar-section { margin-bottom:28px; }
  .sidebar-label { font-size:8px; letter-spacing:0.2em; color:var(--ash); text-transform:uppercase; padding:0 20px; margin-bottom:8px; }
  .sidebar-item { display:flex; align-items:center; gap:10px; padding:9px 20px; cursor:pointer; transition:all 0.15s; border-left:2px solid transparent; font-size:11px; color:var(--smoke); letter-spacing:0.04em; }
  .sidebar-item:hover { color:var(--pearl); background:var(--carbon); }
  .sidebar-item.active { color:var(--aurum); border-left-color:var(--aurum); background:var(--aurum-glow); }
  .sidebar-icon { font-size:12px; width:16px; text-align:center; }
  .sidebar-badge { margin-left:auto; background:var(--ruby); color:white; font-size:8px; padding:1px 5px; border-radius:10px; }
  .sidebar-badge.gold { background:var(--aurum-dim); color:var(--aurum); border:1px solid var(--aurum-border); }
  .center { overflow-y:auto; background:var(--obsidian); }
  .hero-command { padding:28px 28px 0; animation:slide-up 0.5s ease both; }
  .hero-row { display:flex; align-items:flex-end; justify-content:space-between; margin-bottom:4px; }
  .hero-greeting { font-family:'Cormorant Garamond',serif; font-size:28px; font-weight:300; color:var(--ivory); letter-spacing:0.02em; }
  .hero-greeting em { font-style:italic; color:var(--aurum); }
  .hero-date { font-size:9px; letter-spacing:0.15em; color:var(--smoke); text-transform:uppercase; }
  .regime-bar { display:flex; align-items:center; gap:16px; padding:10px 16px; background:var(--carbon); border:1px solid var(--fog); border-radius:4px; margin-top:16px; flex-wrap:wrap; }
  .regime-label { font-size:8px; letter-spacing:0.2em; color:var(--smoke); text-transform:uppercase; }
  .regime-value { font-size:10px; letter-spacing:0.1em; color:var(--aurum); text-transform:uppercase; }
  .regime-sep { color:var(--fog); }
  .regime-indicator { display:flex; align-items:center; gap:5px; font-size:9px; }
  .reg-dot { width:6px; height:6px; border-radius:50%; }
  .section-header { display:flex; align-items:center; justify-content:space-between; padding:20px 28px 12px; }
  .section-title { font-family:'Playfair Display',serif; font-size:13px; font-weight:400; letter-spacing:0.08em; color:var(--pearl); display:flex; align-items:center; gap:8px; }
  .section-title::before { content:''; width:3px; height:14px; background:var(--aurum); border-radius:2px; flex-shrink:0; }
  .section-action { font-size:9px; letter-spacing:0.12em; color:var(--aurum); cursor:pointer; text-transform:uppercase; opacity:0.7; }
  .section-action:hover { opacity:1; }
  .opportunity-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:12px; padding:0 28px 20px; }
  .opp-card { background:var(--carbon); border:1px solid var(--fog); border-radius:6px; padding:16px; cursor:pointer; transition:all 0.25s; position:relative; overflow:hidden; animation:slide-up 0.4s ease both; }
  .opp-card:hover { border-color:var(--aurum-border); background:var(--slate); transform:translateY(-2px); }
  .opp-card::before { content:''; position:absolute; top:0; left:0; right:0; height:2px; }
  .opp-card.bull::before { background:linear-gradient(90deg,var(--emerald),transparent); }
  .opp-card.bear::before { background:linear-gradient(90deg,var(--ruby),transparent); }
  .opp-card.neutral::before { background:linear-gradient(90deg,var(--aurum),transparent); }
  .opp-header { display:flex; align-items:flex-start; justify-content:space-between; margin-bottom:12px; }
  .opp-sym { font-family:'Playfair Display',serif; font-size:18px; font-weight:500; color:var(--ivory); letter-spacing:0.04em; }
  .opp-name { font-size:9px; color:var(--smoke); letter-spacing:0.06em; margin-top:1px; }
  .opp-action { font-size:9px; letter-spacing:0.15em; text-transform:uppercase; padding:3px 8px; border-radius:2px; }
  .opp-action.buy { background:var(--emerald-dim); color:var(--emerald); border:1px solid rgba(29,184,122,0.3); }
  .opp-action.sell { background:var(--ruby-dim); color:var(--ruby); border:1px solid rgba(232,69,90,0.3); }
  .opp-action.watch { background:var(--aurum-glow); color:var(--aurum); border:1px solid var(--aurum-border); }
  .opp-price-row { display:flex; align-items:baseline; gap:8px; margin-bottom:8px; }
  .opp-price { font-size:20px; font-weight:300; color:var(--ivory); letter-spacing:-0.02em; }
  .conviction-bar { margin-top:12px; }
  .conviction-label { display:flex; justify-content:space-between; font-size:8px; color:var(--smoke); letter-spacing:0.1em; text-transform:uppercase; margin-bottom:5px; }
  .conviction-track { height:3px; background:var(--fog); border-radius:2px; overflow:hidden; }
  .conviction-fill { height:100%; border-radius:2px; transition:width 1s ease; }
  .conviction-fill.high { background:linear-gradient(90deg,var(--emerald),var(--aurum)); }
  .conviction-fill.mid { background:linear-gradient(90deg,var(--aurum),var(--aurum-dim)); }
  .conviction-fill.low { background:var(--ruby); }
  .opp-targets { display:grid; grid-template-columns:1fr 1fr; gap:6px; margin-top:10px; }
  .target-box { background:var(--void); border-radius:3px; padding:6px 8px; }
  .target-label { font-size:7px; color:var(--ash); letter-spacing:0.15em; text-transform:uppercase; margin-bottom:2px; }
  .target-val { font-size:11px; color:var(--pearl); }
  .click-hint { font-size:8px; color:var(--ash); margin-top:8px; letter-spacing:0.08em; }
  .ai-orb { width:28px; height:28px; border-radius:50%; background:radial-gradient(circle at 35% 35%,var(--aurum-bright),var(--aurum-dim)); flex-shrink:0; animation:glow-pulse 3s ease-in-out infinite; }
  .ph-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:10px; margin-bottom:12px; }
  .ph-card { background:var(--carbon); border:1px solid var(--fog); border-radius:5px; padding:14px 14px 12px; transition:border-color 0.2s; }
  .ph-card:hover { border-color:var(--aurum-border); }
  .ph-label { font-size:7px; letter-spacing:0.18em; text-transform:uppercase; color:var(--ash); margin-bottom:6px; }
  .ph-value { font-size:22px; font-weight:300; letter-spacing:-0.02em; margin-bottom:2px; }
  .ph-value.gold { color:var(--aurum); }
  .ph-value.green { color:var(--emerald); }
  .ph-value.red { color:var(--ruby); }
  .ph-value.blue { color:var(--sapphire); }
  .ph-sub { font-size:9px; color:var(--smoke); }
  .alloc-card { background:var(--carbon); border:1px solid var(--fog); border-radius:6px; padding:18px 20px; }
  .alloc-row { display:flex; align-items:center; gap:10px; margin-bottom:10px; }
  .alloc-name { font-size:10px; color:var(--pearl); width:80px; flex-shrink:0; }
  .alloc-track { flex:1; height:4px; background:var(--fog); border-radius:2px; overflow:hidden; }
  .alloc-fill { height:100%; border-radius:2px; }
  .alloc-pct { font-size:10px; color:var(--silver); width:38px; text-align:right; flex-shrink:0; }
  .alloc-chg { font-size:9px; width:42px; text-align:right; flex-shrink:0; }
  .trade-plan { background:var(--carbon); border:1px solid var(--aurum-border); border-radius:6px; padding:16px 20px; margin:0 28px 24px; animation:glow-pulse 4s ease-in-out infinite; }
  .tp-header { display:flex; align-items:center; justify-content:space-between; margin-bottom:14px; }
  .tp-title { font-family:'Playfair Display',serif; font-size:13px; color:var(--aurum); letter-spacing:0.06em; }
  .tp-badge { font-size:8px; letter-spacing:0.15em; text-transform:uppercase; color:var(--emerald); border:1px solid rgba(29,184,122,0.3); padding:3px 8px; border-radius:2px; }
  .tp-grid { display:grid; grid-template-columns:repeat(5,1fr); gap:8px; margin-bottom:14px; }
  .tp-cell { background:var(--void); border-radius:3px; padding:8px 10px; }
  .tp-cell-label { font-size:7px; letter-spacing:0.15em; text-transform:uppercase; color:var(--ash); margin-bottom:3px; }
  .tp-cell-val { font-size:13px; color:var(--ivory); }
  .tp-cell-val.green { color:var(--emerald); }
  .tp-cell-val.red { color:var(--ruby); }
  .tp-cell-val.gold { color:var(--aurum); }
  .tp-reasoning { font-size:10px; color:var(--smoke); line-height:1.6; border-top:1px solid var(--fog); padding-top:12px; }
  .tp-reasoning strong { color:var(--pearl); font-weight:400; }
  .wgps-card { background:linear-gradient(135deg,var(--carbon) 0%,rgba(201,168,76,0.05) 100%); border:1px solid var(--aurum-border); border-radius:6px; padding:18px 20px; margin:0 28px 24px; }
  .wgps-header { display:flex; align-items:center; gap:10px; margin-bottom:16px; }
  .wgps-icon { width:32px; height:32px; background:var(--aurum-glow); border:1px solid var(--aurum-border); border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:14px; }
  .wgps-title { font-family:'Playfair Display',serif; font-size:13px; color:var(--aurum); letter-spacing:0.06em; }
  .wgps-sub { font-size:8px; color:var(--smoke); letter-spacing:0.1em; margin-top:1px; }
  .wgps-milestones { display:flex; flex-direction:column; gap:10px; }
  .wgps-mile { display:flex; align-items:center; gap:12px; }
  .wgps-mile-info { flex:1; }
  .wgps-mile-name { font-size:10px; color:var(--pearl); margin-bottom:4px; }
  .wgps-mile-track { height:3px; background:var(--fog); border-radius:2px; overflow:hidden; }
  .wgps-mile-fill { height:100%; border-radius:2px; }
  .wgps-mile-pct { font-size:10px; color:var(--aurum); width:35px; text-align:right; flex-shrink:0; }
  .heatmap-grid { display:grid; grid-template-columns:repeat(8,1fr); gap:4px; }
  .hm-cell { border-radius:3px; padding:8px 6px; text-align:center; cursor:pointer; transition:transform 0.2s; }
  .hm-cell:hover { transform:scale(1.05); z-index:2; }
  .hm-sym { font-size:9px; color:rgba(255,255,255,0.9); font-weight:500; margin-bottom:2px; }
  .right-panel { background:var(--void); border-left:1px solid var(--fog); overflow-y:auto; padding:20px 0; display:flex; flex-direction:column; }
  .rp-title { font-size:8px; letter-spacing:0.2em; text-transform:uppercase; color:var(--ash); margin-bottom:14px; }
  .macro-item { display:flex; justify-content:space-between; align-items:center; padding:8px 0; border-bottom:1px solid var(--fog); font-size:10px; }
  .macro-item:last-child { border-bottom:none; }
  .macro-key { color:var(--silver); }
  .flow-item { display:flex; align-items:center; gap:8px; padding:8px 0; border-bottom:1px solid var(--fog); cursor:pointer; }
  .flow-item:last-child { border-bottom:none; }
  .flow-dir { width:20px; height:20px; border-radius:3px; display:flex; align-items:center; justify-content:center; font-size:10px; flex-shrink:0; }
  .flow-dir.in { background:var(--emerald-dim); color:var(--emerald); }
  .flow-dir.out { background:var(--ruby-dim); color:var(--ruby); }
  .flow-info { flex:1; }
  .flow-name { font-size:10px; color:var(--pearl); }
  .flow-detail { font-size:8px; color:var(--smoke); margin-top:1px; }
  .alert-item { display:flex; gap:10px; padding:10px 0; border-bottom:1px solid var(--fog); }
  .alert-item:last-child { border-bottom:none; }
  .alert-dot { width:6px; height:6px; border-radius:50%; margin-top:4px; flex-shrink:0; animation:pulse-aurum 2s ease-in-out infinite; }
  .alert-text { font-size:10px; color:var(--silver); line-height:1.5; }
  .alert-time { font-size:8px; color:var(--ash); margin-top:3px; }
  .panel-tabs { display:flex; border-bottom:1px solid var(--fog); margin:0 0 16px; }
  .panel-tab { padding:8px 14px; font-size:9px; letter-spacing:0.1em; text-transform:uppercase; color:var(--smoke); cursor:pointer; border-bottom:2px solid transparent; transition:all 0.2s; }
  .panel-tab:hover { color:var(--pearl); }
  .panel-tab.active { color:var(--aurum); border-bottom-color:var(--aurum); }
  .rp-phase { flex:1; padding:8px 4px; border-radius:3px; text-align:center; font-size:7px; letter-spacing:0.1em; text-transform:uppercase; border:1px solid var(--fog); color:var(--smoke); }
  .feat-tag { padding:5px 12px; background:var(--carbon); border:1px solid var(--fog); border-radius:20px; font-size:9px; color:var(--silver); letter-spacing:0.06em; cursor:pointer; transition:all 0.2s; }
  .feat-tag:hover,.feat-tag.active { border-color:var(--aurum-border); color:var(--aurum); background:var(--aurum-glow); }
  .detail-panel { position:fixed; inset:0; z-index:200; display:flex; align-items:center; justify-content:center; background:rgba(8,10,14,0.85); backdrop-filter:blur(8px); animation:fade-in 0.2s ease; }
  .detail-card { background:var(--carbon); border:1px solid var(--aurum-border); border-radius:8px; width:600px; max-width:95vw; max-height:85vh; overflow-y:auto; animation:slide-up 0.3s ease; }
  .detail-header { display:flex; align-items:center; justify-content:space-between; padding:20px 24px; border-bottom:1px solid var(--fog); position:sticky; top:0; background:var(--carbon); z-index:2; }
  .detail-close { width:28px; height:28px; border-radius:50%; border:1px solid var(--fog); background:transparent; color:var(--silver); cursor:pointer; font-size:14px; display:flex; align-items:center; justify-content:center; transition:all 0.2s; }
  .detail-close:hover { border-color:var(--ruby); color:var(--ruby); }
  .detail-body { padding:24px; }
  ::-webkit-scrollbar { width:4px; height:4px; }
  ::-webkit-scrollbar-track { background:var(--void); }
  ::-webkit-scrollbar-thumb { background:var(--fog); border-radius:2px; }
  @media (max-width:1100px) {
    .main-grid { grid-template-columns:200px 1fr 260px; }
    .opportunity-grid { grid-template-columns:repeat(2,1fr); }
    .tp-grid { grid-template-columns:repeat(3,1fr); }
    .heatmap-grid { grid-template-columns:repeat(5,1fr); }
    .ph-grid { grid-template-columns:repeat(2,1fr); }
  }
  @media (max-width:800px) {
    .main-grid { grid-template-columns:1fr; }
    .sidebar,.right-panel { display:none; }
    .opportunity-grid { grid-template-columns:1fr; }
    .nav-tabs { display:none; }
  }
`;

const styleEl = document.createElement("style");
styleEl.textContent = css;
if (!document.getElementById("aurum-styles")) {
  styleEl.id = "aurum-styles";
  document.head.appendChild(styleEl);
}

const TICKER_DATA = [
  { sym: "SPX", price: "5,847.22", chg: "+1.23%", up: true },
  { sym: "NDX", price: "21,042.55", chg: "+1.87%", up: true },
  { sym: "BTC", price: "108,244", chg: "+3.41%", up: true },
  { sym: "ETH", price: "3,891.22", chg: "+2.15%", up: true },
  { sym: "GLD", price: "3,284.50", chg: "-0.32%", up: false },
  { sym: "DXY", price: "101.24", chg: "-0.44%", up: false },
  { sym: "WTI", price: "78.82", chg: "+1.12%", up: true },
  { sym: "AAPL", price: "212.45", chg: "+2.31%", up: true },
  { sym: "NVDA", price: "1,128.30", chg: "+4.62%", up: true },
  { sym: "MSFT", price: "448.90", chg: "+1.45%", up: true },
  { sym: "TSLA", price: "342.18", chg: "-1.22%", up: false },
  { sym: "VIX", price: "14.22", chg: "-0.88%", up: false },
];

const OPPORTUNITIES = [
  { sym:"NVDA", name:"NVIDIA Corporation", action:"buy", type:"bull", price:"1,128.30", chg:"+4.62%", up:true, conviction:92, convLabel:"VERY HIGH", entry:"1,090–1,140", target:"1,380", stop:"1,020", size:"4.5%", delay:"0.1s" },
  { sym:"BTC", name:"Bitcoin", action:"buy", type:"bull", price:"108,244", chg:"+3.41%", up:true, conviction:84, convLabel:"HIGH", entry:"104,000–110,000", target:"135,000", stop:"96,000", size:"3.0%", delay:"0.2s" },
  { sym:"GLD", name:"SPDR Gold Trust", action:"watch", type:"neutral", price:"3,284.50", chg:"-0.32%", up:false, conviction:68, convLabel:"MODERATE", entry:"3,220–3,260", target:"3,580", stop:"3,120", size:"5.0%", delay:"0.3s" },
  { sym:"MSFT", name:"Microsoft Corp", action:"buy", type:"bull", price:"448.90", chg:"+1.45%", up:true, conviction:88, convLabel:"HIGH", entry:"440–455", target:"510", stop:"418", size:"4.0%", delay:"0.4s" },
  { sym:"TSLA", name:"Tesla Inc", action:"sell", type:"bear", price:"342.18", chg:"-1.22%", up:false, conviction:72, convLabel:"MODERATE", entry:"350–365", target:"275", stop:"380", size:"2.0%", delay:"0.5s" },
  { sym:"SPY", name:"S&P 500 ETF", action:"buy", type:"bull", price:"584.72", chg:"+1.18%", up:true, conviction:79, convLabel:"HIGH", entry:"578–588", target:"620", stop:"558", size:"6.0%", delay:"0.6s" },
];

const MACRO_DATA = [
  { key:"Fed Funds Rate", val:"5.25%", delta:"–", color:"var(--ruby)" },
  { key:"US CPI (YoY)", val:"3.2%", delta:"▼", color:"var(--emerald)" },
  { key:"GDP Growth", val:"2.8%", delta:"▲", color:"var(--emerald)" },
  { key:"Unemployment", val:"3.9%", delta:"▲", color:"var(--ruby)" },
  { key:"M2 Supply (YoY)", val:"+4.1%", delta:"▲", color:"var(--emerald)" },
  { key:"Credit Spreads", val:"120bps", delta:"▼", color:"var(--emerald)" },
];

const FLOW_DATA = [
  { dir:"in", name:"NVDA Options Flow", detail:"Unusual call buying — $2.4B notional", amount:"+$2.4B" },
  { dir:"in", name:"BTC Whale Accumulation", detail:"6 wallets +1,000 BTC each", amount:"+6,200 BTC" },
  { dir:"out", name:"TSLA Insider Selling", detail:"3 C-suite executives", amount:"-$84M" },
  { dir:"in", name:"Gold ETF Inflows", detail:"12 consecutive days", amount:"+$1.1B" },
  { dir:"out", name:"Bond Outflows", detail:"TLT selling pressure", amount:"-$620M" },
  { dir:"in", name:"MSFT AI Thesis", detail:"Pension funds adding exposure", amount:"+$890M" },
];

const ALERTS = [
  { color:"var(--aurum)", text:"NVDA breaks above $1,120 resistance with volume confirmation.", time:"2m ago" },
  { color:"var(--emerald)", text:"BTC reclaims $108K. Onchain metrics show accumulation phase.", time:"8m ago" },
  { color:"var(--ruby)", text:"Macro risk: Fed minutes reveal hawkish dissent. Duration risk elevated.", time:"15m ago" },
  { color:"var(--sapphire)", text:"Regime shift detected: Risk-on environment confirmed.", time:"1h ago" },
  { color:"var(--amethyst)", text:"Portfolio Health Index: 94/100 — Optimal diversification maintained.", time:"2h ago" },
];

const ALLOC_DATA = [
  { name:"US Equities", pct:42, chg:"+2.1%", fill:"var(--sapphire)" },
  { name:"Crypto", pct:18, chg:"+1.4%", fill:"var(--amethyst)" },
  { name:"Intl Equities", pct:14, chg:"-0.3%", fill:"var(--aurum)" },
  { name:"Gold & Metals", pct:12, chg:"+0.8%", fill:"var(--emerald)" },
  { name:"Bonds", pct:8, chg:"-0.6%", fill:"var(--smoke
