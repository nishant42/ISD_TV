import { useState, useEffect, useRef, useCallback } from "react";

/* ─── DATA ─────────────────────────────────────────────────────────── */
const USERS = [
  { id: 1, name: "User 1", color: "#00C2FF" },
  { id: 2, name: "User 2", color: "#7CFC00" },
];

const PRIMARY_MOODS = [
  { id: "happy",  label: "Happy",  emoji: "😊", color: "#FFD700" },
  { id: "sad",    label: "Sad",    emoji: "😢", color: "#5B9BD5" },
  { id: "angry",  label: "Angry",  emoji: "😠", color: "#E05C5C" },
  { id: "scared", label: "Scared", emoji: "😨", color: "#A78BFA" },
  { id: "unsure", label: "Unsure", emoji: "😐", color: "#F59E0B" },
];

const ALT_MOODS = [
  { id: "annoyed",    label: "Annoyed",    emoji: "😤", color: "#F97316" },
  { id: "romantic",   label: "Romantic",   emoji: "🥰", color: "#EC4899" },
  { id: "relaxed",    label: "Relaxed",    emoji: "😌", color: "#34D399" },
  { id: "tired",      label: "Tired",      emoji: "😴", color: "#93C5FD" },
  { id: "excited",    label: "Excited",    emoji: "🤩", color: "#FBBF24" },
  { id: "thoughtful", label: "Thoughtful", emoji: "🤔", color: "#818CF8" },
  { id: "stressed",   label: "Stressed",   emoji: "😩", color: "#F87171" },
  { id: "bored",      label: "Bored",      emoji: "🥱", color: "#D1D5DB" },
];

const MOVIES = {
  happy:     [{ id:1,  title:"The Grand Adventure",  genre:"Comedy / Adventure",    rating:4, length:"1h 58m", age:"PG",  cast:"Ryan Reynolds, Emma Stone",          provider:"Netflix", img:"https://images.unsplash.com/photo-1682687221038-404cb8830901?w=800&q=80" },
              { id:2,  title:"Sunshine Boulevard",    genre:"Comedy / Romance",      rating:5, length:"1h 42m", age:"12A", cast:"Zendaya, Tom Holland",               provider:"Netflix", img:"https://images.unsplash.com/photo-1601814933824-fd0b574dd592?w=800&q=80" },
              { id:3,  title:"Life is Beautiful",     genre:"Feel-Good / Drama",     rating:5, length:"2h 2m",  age:"PG",  cast:"Roberto Benigni, Nicoletta Braschi", provider:"Netflix", img:"https://images.unsplash.com/photo-1520483601560-389dff434fdf?w=800&q=80" }],
  sad:       [{ id:4,  title:"When Stars Align",      genre:"Drama / Romance",       rating:4, length:"2h 10m", age:"15",  cast:"Cate Blanchett, Brad Pitt",          provider:"Netflix", img:"https://images.unsplash.com/photo-1534796636912-3b95b3ab5986?w=800&q=80" },
              { id:5,  title:"The Last Letter",        genre:"Drama",                 rating:3, length:"1h 55m", age:"12A", cast:"Saoirse Ronan, Timothée Chalamet",   provider:"Netflix", img:"https://images.unsplash.com/photo-1519681393784-d120267933ba?w=800&q=80" },
              { id:6,  title:"Rainy Days in Tokyo",   genre:"Drama / Foreign",       rating:4, length:"2h 5m",  age:"PG",  cast:"Ken Watanabe, Rinko Kikuchi",        provider:"Netflix", img:"https://images.unsplash.com/photo-1503803548695-c2a7b4a5b875?w=800&q=80" }],
  angry:     [{ id:7,  title:"Fury Road: Reloaded",  genre:"Action / Thriller",     rating:5, length:"2h 20m", age:"18",  cast:"Tom Hardy, Charlize Theron",         provider:"Netflix", img:"https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80" },
              { id:8,  title:"Iron Fist",             genre:"Action / Martial Arts", rating:4, length:"1h 58m", age:"15",  cast:"Idris Elba, Michelle Yeoh",          provider:"Netflix", img:"https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=80" },
              { id:9,  title:"Blaze of Glory",        genre:"Action / Crime",        rating:4, length:"2h 15m", age:"18",  cast:"Denzel Washington, Ryan Gosling",    provider:"Netflix", img:"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80" }],
  scared:    [{ id:10, title:"Shadows at Midnight",  genre:"Horror / Thriller",     rating:4, length:"1h 50m", age:"18",  cast:"Florence Pugh, Oscar Isaac",         provider:"Netflix", img:"https://images.unsplash.com/photo-1604076913837-52ab5629fde9?w=800&q=80" },
              { id:11, title:"The Haunting",          genre:"Psychological Horror",  rating:5, length:"2h 8m",  age:"18",  cast:"Tilda Swinton, Gary Oldman",         provider:"Netflix", img:"https://images.unsplash.com/photo-1509347528160-9a9e33742cdb?w=800&q=80" },
              { id:12, title:"Dark Waters",           genre:"Horror / Mystery",      rating:3, length:"1h 45m", age:"15",  cast:"Mark Ruffalo, Anne Hathaway",        provider:"Netflix", img:"https://images.unsplash.com/photo-1478760329108-5c3ed9d495a0?w=800&q=80" }],
  unsure:    [{ id:13, title:"Interstellar Dreams",  genre:"Sci-Fi / Drama",        rating:5, length:"2h 49m", age:"PG",  cast:"Matthew McConaughey, Anne Hathaway", provider:"Netflix", img:"https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?w=800&q=80" },
              { id:14, title:"The Crown's Gambit",   genre:"Drama / History",       rating:5, length:"1h 58m", age:"12A", cast:"Olivia Colman, Judi Dench",          provider:"Netflix", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" },
              { id:15, title:"Pacific Blue",          genre:"Adventure / Drama",     rating:4, length:"2h 05m", age:"PG",  cast:"Nicole Kidman, Chris Hemsworth",     provider:"Netflix", img:"https://images.unsplash.com/photo-1505118380757-91f5f5632de0?w=800&q=80" }],
  annoyed:   [{ id:16, title:"The Comeback",         genre:"Comedy / Drama",        rating:4, length:"1h 50m", age:"15",  cast:"Steve Carell, Julia Roberts",        provider:"Netflix", img:"https://images.unsplash.com/photo-1594909122845-11baa439b7bf?w=800&q=80" },
              { id:17, title:"Payback",               genre:"Action / Thriller",     rating:4, length:"1h 55m", age:"18",  cast:"Liam Neeson, Cate Blanchett",        provider:"Netflix", img:"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80" }],
  romantic:  [{ id:18, title:"A Paris Affair",       genre:"Romance / Drama",       rating:5, length:"1h 58m", age:"12A", cast:"Eva Green, Adrien Brody",            provider:"Netflix", img:"https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80" },
              { id:19, title:"Eternal Embrace",       genre:"Romance",               rating:4, length:"1h 42m", age:"PG",  cast:"Penélope Cruz, Javier Bardem",       provider:"Netflix", img:"https://images.unsplash.com/photo-1516589091380-5d8e87df6999?w=800&q=80" },
              { id:32, title:"Midnight in Venice",    genre:"Romance / Mystery",     rating:5, length:"2h 5m",  age:"12A", cast:"Timothée Chalamet, Zendaya",         provider:"Netflix", img:"https://images.unsplash.com/photo-1534430480872-3498386e7856?w=800&q=80" }],
  relaxed:   [{ id:20, title:"Island of Calm",       genre:"Documentary / Nature",  rating:5, length:"1h 30m", age:"U",   cast:"David Attenborough (narrator)",      provider:"Netflix", img:"https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80" },
              { id:21, title:"Tuscany Skies",         genre:"Travel / Drama",        rating:4, length:"1h 48m", age:"PG",  cast:"Helena Bonham Carter, Colin Firth",  provider:"Netflix", img:"https://images.unsplash.com/photo-1476514525535-07fb3b4ae5f1?w=800&q=80" }],
  tired:     [{ id:22, title:"Short Stories",        genre:"Anthology / Comedy",    rating:4, length:"0h 55m", age:"PG",  cast:"Various",                            provider:"Netflix", img:"https://images.unsplash.com/photo-1524712245354-2c4e5e7121c0?w=800&q=80" },
              { id:23, title:"Cozy Corner",           genre:"Comfort Drama",         rating:5, length:"1h 20m", age:"U",   cast:"Meryl Streep, Tom Hanks",            provider:"Netflix", img:"https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800&q=80" }],
  excited:   [{ id:24, title:"Velocity",             genre:"Action / Sci-Fi",       rating:5, length:"2h 30m", age:"12A", cast:"John Boyega, Karen Gillan",          provider:"Netflix", img:"https://images.unsplash.com/photo-1518770660439-4636190af475?w=800&q=80" },
              { id:25, title:"Race to the Top",      genre:"Sports / Drama",        rating:4, length:"2h 05m", age:"PG",  cast:"Will Smith, Jamie Foxx",             provider:"Netflix", img:"https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&q=80" },
              { id:33, title:"Sky Breakers",          genre:"Adventure / Sci-Fi",   rating:5, length:"2h 15m", age:"12A", cast:"Brie Larson, Anthony Mackie",        provider:"Netflix", img:"https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&q=80" }],
  thoughtful:[{ id:26, title:"Echoes of Time",       genre:"Sci-Fi / Philosophy",   rating:5, length:"2h 20m", age:"12A", cast:"Joaquin Phoenix, Amy Adams",         provider:"Netflix", img:"https://images.unsplash.com/photo-1462331940025-496dfbfc7564?w=800&q=80" },
              { id:27, title:"The Mirror Theory",    genre:"Drama / Mystery",       rating:4, length:"1h 55m", age:"15",  cast:"Natalie Portman, Ethan Hawke",       provider:"Netflix", img:"https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&q=80" }],
  stressed:  [{ id:28, title:"Easy Breeze",          genre:"Comedy / Family",       rating:4, length:"1h 45m", age:"U",   cast:"Jim Carrey, Sandra Bullock",         provider:"Netflix", img:"https://images.unsplash.com/photo-1520483601560-389dff434fdf?w=800&q=80" },
              { id:29, title:"Finding Balance",      genre:"Documentary / Wellness", rating:5, length:"1h 25m", age:"U",  cast:"Narrated by Morgan Freeman",         provider:"Netflix", img:"https://images.unsplash.com/photo-1470252649378-9c29740c9fa8?w=800&q=80" }],
  bored:     [{ id:30, title:"The Wildcard",         genre:"Thriller / Mystery",    rating:4, length:"2h 10m", age:"15",  cast:"Daniel Craig, Rosamund Pike",        provider:"Netflix", img:"https://images.unsplash.com/photo-1485846234645-a62644f84728?w=800&q=80" },
              { id:31, title:"Chaos Theory",         genre:"Action / Comedy",       rating:4, length:"1h 58m", age:"12A", cast:"Margot Robbie, Ryan Gosling",        provider:"Netflix", img:"https://images.unsplash.com/photo-1536440136628-849c177e76a1?w=800&q=80" },
              { id:34, title:"The Big Heist",        genre:"Crime / Comedy",        rating:5, length:"2h 5m",  age:"15",  cast:"Brad Pitt, George Clooney",          provider:"Netflix", img:"https://images.unsplash.com/photo-1542204165-65bf26472b9b?w=800&q=80" }],
};

/* ─── KEY MAP ───────────────────────────────────────────────────────── */
const KEY_TO_REMOTE = {
  " ": "play", "Enter": "ok", "Escape": "back", "Tab": "menu",
  "ArrowUp": "up", "ArrowDown": "down", "ArrowLeft": "left", "ArrowRight": "right",
  "p": "power", "m": "mute", "h": "home", "s": "stop", "i": "info",
  "]": "chup", "[": "chdown",
  "1":"n1","2":"n2","3":"n3","4":"n4","5":"n5","6":"n6","7":"n7","8":"n8","9":"n9","0":"n0",
};

const REMOTE_BTN_COLORS = {
  power:"#E53935", mute:"#F59E0B", home:"#34D399", back:"#A78BFA",
  menu:"#60A5FA", info:"#60A5FA", ok:"#E53935", play:"#34D399", stop:"#E53935",
  volup:"#34D399", voldown:"#F87171", chup:"#60A5FA", chdown:"#60A5FA",
  up:"#e8e0d0", down:"#e8e0d0", left:"#e8e0d0", right:"#e8e0d0",
  rew:"#e8e0d0", fwd:"#e8e0d0",
};

/* ─── HELPERS ───────────────────────────────────────────────────────── */
const Stars = ({ rating }) => (
  <div style={{ display:"flex", gap:2 }}>
    {[1,2,3,4,5].map(i => (
      <span key={i} style={{ fontSize:15, color: i<=rating?"#FFD700":"#2a2a3a", filter: i<=rating?"drop-shadow(0 0 4px #FFD700aa)":"none" }}>★</span>
    ))}
  </div>
);

const fmt = (s) => `${Math.floor(s/60)}:${String(s%60).padStart(2,"0")}`;

/* ─── REMOTE ────────────────────────────────────────────────────────── */
function RemoteBtn({ id, label, litKey, onAction, style={} }) {
  const isLit = litKey === id;
  const color = REMOTE_BTN_COLORS[id] || "#e8e0d0";
  // return (
  //   <div
  //     onClick={() => onAction && onAction(id)}
  //     style={{
  //       borderRadius: 8, padding:"6px 2px", textAlign:"center",
  //       fontSize: style.fontSize||13, fontWeight: style.fontWeight||600,
  //       letterSpacing:"0.02em", cursor:"pointer", userSelect:"none",
  //       background: isLit ? `radial-gradient(circle at center, ${color}55 0%, ${color}18 100%)` : "rgba(255,255,255,0.045)",
  //       border: isLit ? `1px solid ${color}dd` : "1px solid rgba(255,255,255,0.1)",
  //       color: isLit ? color : "rgba(160,144,128,0.85)",
  //       boxShadow: isLit ? `0 0 18px ${color}cc, 0 0 40px ${color}55, inset 0 0 12px ${color}28` : "inset 0 1px 0 rgba(255,255,255,0.07)",
  //       transform: isLit ? "scale(0.91)" : "scale(1)",
  //       transition: "all 0.12s ease",
  //       minHeight: 30, display:"flex", alignItems:"center", justifyContent:"center",
  //       ...style,
  //     }}
  //     onMouseEnter={e => { if(!isLit){ e.currentTarget.style.background="rgba(255,255,255,0.09)"; e.currentTarget.style.color=color; e.currentTarget.style.borderColor=`${color}55`; }}}
  //     onMouseLeave={e => { if(!isLit){ e.currentTarget.style.background="rgba(255,255,255,0.045)"; e.currentTarget.style.color="rgba(160,144,128,0.85)"; e.currentTarget.style.borderColor="rgba(255,255,255,0.1)"; }}}
  //   >{label}</div>
  // );

  return (
    <div
      onClick={() => onAction && onAction(id)}
      style={{
        borderRadius: 8,
        padding: "6px 2px",
        textAlign: "center",
        cursor: "pointer",
        userSelect: "none",
        background: isLit
          ? `radial-gradient(circle at center, ${color}55 0%, ${color}18 100%)`
          : "rgba(255,255,255,0.045)",
        border: isLit
          ? `1px solid ${color}dd`
          : "1px solid rgba(255,255,255,0.1)",
        color: isLit ? color : "rgba(160,144,128,0.85)",
        boxShadow: isLit
          ? `0 0 18px ${color}cc, 0 0 40px ${color}55, inset 0 0 12px ${color}28`
          : "inset 0 1px 0 rgba(255,255,255,0.07)",
        transform: isLit ? "scale(0.91)" : "scale(1)",
        transition: "all 0.12s ease",
        minHeight: 55,
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        gap: "4px",
        ...style,
      }}
      onMouseEnter={e => {
        if (!isLit) {
          e.currentTarget.style.background = "rgba(255,255,255,0.09)";
          e.currentTarget.style.color = color;
          e.currentTarget.style.borderColor = `${color}55`;
        }
      }}
      onMouseLeave={e => {
        if (!isLit) {
          e.currentTarget.style.background = "rgba(255,255,255,0.045)";
          e.currentTarget.style.color = "rgba(160,144,128,0.85)";
          e.currentTarget.style.borderColor = "rgba(255,255,255,0.1)";
        }
      }}
    >
      {/* Icon */}
      {/* <div style={{ fontSize: style.fontSize || 13 }}> */}
      <div style={{ fontSize: (style.fontSize || 13) + 4 }}>
        {label}
      </div>
  
      {/* Label */}
      <div style={{ fontSize: 10, opacity: 0.6 }}>
        {{
          home: "Home",
          back: "Back",
          menu: "Menu",
          power: "Power",
          mute: "Mute",
          ok: "OK",
          play: "Play",
          stop: "Stop",
          up: "Up",
          down: "Down",
          left: "Left",
          right: "Right",
          volup: "Vol+",
          voldown: "Vol−",
          chup: "CH+",
          chdown: "CH−",
          rew: "Rew",
          fwd: "Fwd",
          info: "Info",
        }[id] || ""}
      </div>
    </div>
  );
}

function Remote({ litKey, onAction }) {
  const R = (id, lbl, st={}) => <RemoteBtn key={id} id={id} label={lbl} litKey={litKey} onAction={onAction} style={st} />;
  const row = (children, gap=5) => <div style={{ display:"flex", gap, alignItems:"stretch" }}>{children}</div>;
  const col = (children, gap=5) => <div style={{ display:"flex", flexDirection:"column", gap, flex:1 }}>{children}</div>;

  return (
    <div style={{
      background:"linear-gradient(170deg,#1c1c30 0%,#111120 50%,#0c0c1a 100%)",
      borderRadius:"24px 24px 36px 36px",
      border:"1px solid rgba(255,255,255,0.07)",
      boxShadow:"0 24px 60px rgba(0,0,0,0.9), inset 0 1px 0 rgba(255,255,255,0.05), inset 0 -1px 0 rgba(0,0,0,0.5)",
      padding:"16px 12px 22px",
      display:"flex", flexDirection:"column", gap:8,
      width:"100%", maxWidth:220, margin:"0 auto",
    }}>
      {/* IR LED */}
      <div style={{ textAlign:"center", marginBottom:2 }}>
        <div style={{
          width:7, height:7, borderRadius:"50%", margin:"0 auto 5px",
          background: litKey ? "#E53935" : "#1e0808",
          boxShadow: litKey ? "0 0 10px #E53935, 0 0 22px #E5393566" : "none",
          transition:"all 0.15s",
        }}/>
        <div style={{ fontSize:8, color:"#3a3a55", letterSpacing:"0.18em", fontWeight:700 }}>MOODFLIX</div>
      </div>

      {/* Power + Mute */}
      {row([
        <div style={{flex:1}}>{R("power","⏻",{fontSize:16})}</div>,
        <div style={{flex:1}}>{R("mute","🔇",{fontSize:13})}</div>,
      ])}

      {/* Nav: Home / Back / Menu */}
      {row([
        <div style={{flex:1}}>{R("home","⌂",{fontSize:15})}</div>,
        <div style={{flex:1}}>{R("back","↩",{fontSize:14})}</div>,
        <div style={{flex:1}}>{R("menu","☰",{fontSize:13})}</div>,
      ])}

      {/* D-Pad */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:5 }}>
        <div/>
        {R("up","▲",{fontSize:13})}
        <div/>
        {R("left","◀",{fontSize:13})}
        {R("ok","OK",{fontSize:11,fontWeight:800})}
        {R("right","▶",{fontSize:13})}
        <div/>
        {R("down","▼",{fontSize:13})}
        <div/>
      </div>

      {/* Vol + CH columns */}
      {row([
        col([R("volup","Vol+",{fontSize:9}), R("voldown","Vol−",{fontSize:9})]),
        col([R("chup","CH+",{fontSize:9}),   R("chdown","CH−",{fontSize:9})]),
      ])}

      {/* Media controls */}
      {row([
        <div style={{flex:1}}>{R("rew","⏮",{fontSize:14})}</div>,
        <div style={{flex:1}}>{R("play","⏵",{fontSize:14})}</div>,
        <div style={{flex:1}}>{R("stop","⏹",{fontSize:14})}</div>,
        <div style={{flex:1}}>{R("fwd","⏭",{fontSize:14})}</div>,
      ])}

      {/* Info */}
      <div>{R("info","ℹ INFO",{fontSize:9,width:"100%"})}</div>

      {/* Divider */}
      <div style={{ height:1, background:"rgba(255,255,255,0.05)", margin:"1px 0" }}/>

      {/* Number pad */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr 1fr", gap:5 }}>
        {["n1","n2","n3","n4","n5","n6","n7","n8","n9"].map((id,i) => R(id,String(i+1),{fontSize:12}))}
        <div/>{R("n0","0",{fontSize:12})}<div/>
      </div>

      <div style={{ textAlign:"center", fontSize:7, color:"#2a2a40", letterSpacing:"0.1em", marginTop:2 }}>KEYBOARD ENABLED</div>
    </div>
  );
}

/* ─── TV FRAME ──────────────────────────────────────────────────────── */
function TVFrame({ children, showRemote, setShowRemote, litKey, toast, onAction }) {
  return (
    <div style={{
      minHeight:"100vh",
      background:"radial-gradient(ellipse at center, #2a1f0e 0%, #1a1208 40%, #0e0c08 100%)",
      display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
      padding:"30px 20px 10px", fontFamily:"'Georgia','Times New Roman',serif",
    }}>
      <style>{`
        @keyframes toastIn { from{opacity:0;transform:translateX(-50%) translateY(-8px)} to{opacity:1;transform:translateX(-50%) translateY(0)} }
        @keyframes pulse   { 0%,100%{opacity:1} 50%{opacity:0.5} }
        @keyframes scanline{ 0%{transform:translateY(-100%)} 100%{transform:translateY(100vh)} }
        .tv-screen-content::-webkit-scrollbar { width:4px }
        .tv-screen-content::-webkit-scrollbar-track { background:transparent }
        .tv-screen-content::-webkit-scrollbar-thumb { background:rgba(255,255,255,0.1); border-radius:2px }
      `}</style>

      {/* Toast */}
      {toast && (
        <div style={{position:"fixed",top:22,left:"50%",transform:"translateX(-50%)",background:"rgba(18,18,30,0.97)",border:"1px solid rgba(255,255,255,0.1)",borderRadius:10,padding:"9px 20px",zIndex:9999,fontSize:13,color:"#e8e0d0",boxShadow:"0 8px 32px rgba(0,0,0,0.7)",whiteSpace:"nowrap",animation:"toastIn 0.18s ease"}}>
          {toast}
        </div>
      )}

      {/* ── TV BODY ── */}
      <div style={{
        width:"100%", maxWidth:1160,
        background:"linear-gradient(160deg,#2e2e2e 0%,#1e1e1e 40%,#181818 100%)",
        borderRadius:"22px 22px 12px 12px",
        border:"1px solid #3a3a3a",
        boxShadow:"0 0 0 1px #111, 0 40px 100px rgba(0,0,0,0.95), inset 0 1px 0 rgba(255,255,255,0.06), inset 0 -2px 0 rgba(0,0,0,0.6)",
        padding:"14px 14px 0 14px",
        position:"relative",
      }}>

        {/* Corner screws */}
        {["8px 8px","8px auto 8px 8px","auto 8px 8px auto","auto auto 8px 8px"].map((m,i)=>(
          <div key={i} style={{position:"absolute",top:i<2?10:"auto",bottom:i>=2?10:"auto",left:i%2===0?10:"auto",right:i%2===1?10:"auto",width:7,height:7,borderRadius:"50%",background:"radial-gradient(circle at 35% 35%,#555,#222)",border:"1px solid #111",boxShadow:"inset 0 1px 0 rgba(255,255,255,0.1)"}}/>
        ))}

        {/* Screen bezel inner glow */}
        <div style={{
          borderRadius:"10px 10px 4px 4px",
          border:"3px solid #0a0a0a",
          boxShadow:"0 0 0 1px #333, inset 0 0 40px rgba(0,0,0,0.9)",
          overflow:"hidden",
          background:"#000",
          position:"relative",
        }}>
          {/* Scanline effect */}
          <div style={{position:"absolute",inset:0,pointerEvents:"none",zIndex:20,
            background:"repeating-linear-gradient(0deg,transparent,transparent 3px,rgba(0,0,0,0.04) 3px,rgba(0,0,0,0.04) 4px)"}}/>
          {/* Screen glare */}
          <div style={{position:"absolute",top:0,left:0,right:0,height:"40%",pointerEvents:"none",zIndex:21,
            background:"linear-gradient(160deg,rgba(255,255,255,0.03) 0%,transparent 60%)",borderRadius:"8px 8px 0 0"}}/>

          {/* ── CONTENT SPLIT ── */}
          <div style={{display:"flex",minHeight:"72vh",maxHeight:"72vh"}}>

            {/* Screen content */}
            <div className="tv-screen-content" style={{
              // flex: showRemote ? "0 0 80%" : "1",
              flex: "1",
              marginRight: showRemote ? "10px" : "0",
              transition:"flex 0.45s cubic-bezier(0.4,0,0.2,1)",
              overflowY:"auto",
              background:"linear-gradient(135deg,#0a0a0f 0%,#0d0d1a 45%,#0a0f1a 100%)",
              position:"relative",
              display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center",
              padding:20,
            }}>
              <div style={{position:"absolute",top:0,left:0,right:0,bottom:0,pointerEvents:"none",zIndex:0,
                background:"radial-gradient(ellipse 80% 50% at 50% -10%,rgba(229,57,53,0.1) 0%,transparent 70%),radial-gradient(ellipse 60% 40% at 80% 80%,rgba(0,150,255,0.06) 0%,transparent 60%)"}}/>
              <div style={{width:"100%",zIndex:1}}>{children}</div>
            </div>

            {/* Remote panel */}
            {showRemote && (
              <div style={{
                // flex:"0 0 20%",
                flex: "0 0 240px",
                maxWidth: "240px",
                minWidth: "200px",
                borderLeft:"1px solid #0a0a0a",
                background:"linear-gradient(180deg,#09090f 0%,#0a0a18 100%)",
                display:"flex", flexDirection:"column", alignItems:"center",
                padding:"20px 8px 20px", overflowY:"auto",
                transition:"all 0.45s cubic-bezier(0.4,0,0.2,1)",
              }}>
                <div style={{fontSize:9,color:"#333",letterSpacing:"0.18em",marginBottom:12,fontWeight:600}}>REMOTE CONTROL</div>
                {/* Keyboard hints */}
                {/* <div style={{width:"100%",maxWidth:148,marginBottom:12,padding:"7px 9px",background:"rgba(255,255,255,0.018)",borderRadius:8,border:"1px solid rgba(255,255,255,0.05)"}}>
                  {[["Space","Play/Pause"],["↑↓","Volume"],["[]","Channel"],["←→","Seek"],["M","Mute"],["Esc","Back"],["H","Home"],["P","Power"]].map(([k,v])=>(
                    <div key={k} style={{display:"flex",justifyContent:"space-between",fontSize:9,marginBottom:3}}>
                      <span style={{fontFamily:"monospace",background:"rgba(255,255,255,0.05)",padding:"1px 5px",borderRadius:3,color:"#6a6a8a"}}>{k}</span>
                      <span style={{color:"#444"}}>{v}</span>
                    </div>
                  ))}
                </div> */}
                <Remote litKey={litKey} onAction={onAction}/>
              </div>
            )}
          </div>
        </div>

        {/* ── TV BOTTOM BEZEL ── */}
        <div style={{
          padding:"10px 20px 12px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          background:"linear-gradient(180deg,#1e1e1e,#181818)",
        }}>
          {/* Brand */}
          <div style={{fontSize:10,color:"#444",letterSpacing:"0.25em",fontWeight:700,fontFamily:"monospace"}}>MOODFLIX TV</div>

          {/* Center cluster: power LED + status */}
          <div style={{display:"flex",alignItems:"center",gap:12}}>
            <div style={{width:6,height:6,borderRadius:"50%",background:"#E53935",boxShadow:"0 0 8px #E53935, 0 0 16px #E5393566",animation:"pulse 3s infinite"}}/>
            <div style={{fontSize:9,color:"#333",letterSpacing:"0.12em"}}>STANDBY</div>
          </div>

          {/* Remote toggle button - ALWAYS VISIBLE */}
          <button
            onClick={()=>setShowRemote(r=>!r)}
            style={{
              background: showRemote ? "rgba(229,57,53,0.2)" : "rgba(255,255,255,0.06)",
              border: showRemote ? "1px solid rgba(229,57,53,0.5)" : "1px solid rgba(255,255,255,0.12)",
              borderRadius:8, color: showRemote ? "#E53935" : "#888",
              padding:"6px 14px", cursor:"pointer", fontSize:11,
              letterSpacing:"0.06em", fontFamily:"monospace",
              transition:"all 0.25s", display:"flex", alignItems:"center", gap:6,
              boxShadow: showRemote ? "0 0 12px rgba(229,57,53,0.3)" : "none",
            }}
            onMouseEnter={e=>{e.currentTarget.style.background="rgba(229,57,53,0.2)";e.currentTarget.style.color="#E53935";}}
            onMouseLeave={e=>{e.currentTarget.style.background=showRemote?"rgba(229,57,53,0.2)":"rgba(255,255,255,0.06)";e.currentTarget.style.color=showRemote?"#E53935":"#888";}}
          >
            <span>📺</span> {showRemote ? "HIDE REMOTE" : "REMOTE"}
          </button>
        </div>
      </div>

      {/* ── TV STAND ── */}
      <div style={{display:"flex",flexDirection:"column",alignItems:"center"}}>
        <div style={{width:160,height:10,background:"linear-gradient(90deg,#141414,#2a2a2a,#141414)",borderRadius:"0 0 6px 6px",boxShadow:"0 4px 12px rgba(0,0,0,0.8)"}}/>
        <div style={{width:100,height:24,background:"linear-gradient(180deg,#222,#1a1a1a)",borderRadius:"0 0 10px 10px",boxShadow:"0 6px 20px rgba(0,0,0,0.7)",position:"relative"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:1,background:"rgba(255,255,255,0.05)"}}/>
        </div>
        <div style={{width:180,height:8,background:"linear-gradient(90deg,transparent,#1e1e1e,#252525,#1e1e1e,transparent)",borderRadius:4,boxShadow:"0 4px 16px rgba(0,0,0,0.6)"}}/>
      </div>
    </div>
  );
}

/* ─── SHARED STYLES ─────────────────────────────────────────────────── */
const S = {
  app: { minHeight:"100vh", background:"linear-gradient(135deg,#0a0a0f 0%,#0d0d1a 45%,#0a0f1a 100%)",
    fontFamily:"'Georgia','Times New Roman',serif", color:"#e8e0d0",
    display:"flex", flexDirection:"column", alignItems:"center", justifyContent:"center", padding:20, position:"relative", overflow:"hidden" },
  bg:  { position:"fixed", top:0, left:0, right:0, bottom:0, pointerEvents:"none", zIndex:0,
    background:"radial-gradient(ellipse 80% 50% at 50% -10%,rgba(229,57,53,0.12) 0%,transparent 70%),radial-gradient(ellipse 60% 40% at 80% 80%,rgba(0,150,255,0.07) 0%,transparent 60%)" },
  card: (a) => ({ background:"rgba(13,13,24,0.97)", border:"1px solid rgba(255,255,255,0.07)", borderRadius:20,
    padding:"34px 42px", maxWidth:700, width:"100%", zIndex:1, position:"relative",
    boxShadow:"0 24px 80px rgba(0,0,0,0.8)",
    opacity: a?0:1, transform: a?"translateY(10px)":"translateY(0)", transition:"opacity 0.2s,transform 0.2s" }),
  logo: { fontSize:22, fontWeight:700, letterSpacing:"0.04em", background:"linear-gradient(90deg,#E53935,#FF7043)", WebkitBackgroundClip:"text", WebkitTextFillColor:"transparent" },
  logoBar: { display:"flex", alignItems:"center", justifyContent:"space-between", marginBottom:28 },
  title: { fontSize:19, fontWeight:400, letterSpacing:"0.08em", color:"#c0b8a8", marginBottom:26, textAlign:"center", textTransform:"uppercase" },
  tag: { padding:"3px 9px", borderRadius:6, background:"rgba(255,255,255,0.055)", fontSize:11, color:"#a09080", letterSpacing:"0.06em" },
  backBtn: { padding:"7px 13px", background:"transparent", border:"1px solid rgba(255,255,255,0.1)", borderRadius:8, color:"#777", cursor:"pointer", fontSize:12 },
  badge: { padding:"3px 10px", background:"#E53935", borderRadius:6, fontSize:11, fontWeight:700, letterSpacing:"0.1em", color:"#fff" },
  watchBtn: { flex:1, padding:"13px 0", background:"linear-gradient(90deg,#E53935,#FF7043)", border:"none", borderRadius:10, color:"#fff", fontSize:14, fontWeight:700, letterSpacing:"0.06em", cursor:"pointer", display:"flex", alignItems:"center", justifyContent:"center", gap:8 },
  dislikeBtn: { padding:"13px 16px", background:"rgba(255,255,255,0.04)", border:"1px solid rgba(255,255,255,0.1)", borderRadius:10, color:"#aaa", fontSize:13, cursor:"pointer" },
  showMoreBtn: { padding:"13px 16px", background:"rgba(229,57,53,0.09)", border:"1px solid rgba(229,57,53,0.28)", borderRadius:10, color:"#E53935", fontSize:13, cursor:"pointer" },
};

const SCREENS = { USERS:"USERS", PRIMARY_MOOD:"PRIMARY_MOOD", ALT_MOOD:"ALT_MOOD", RECOMMENDATION:"RECOMMENDATION", PLAYER:"PLAYER" };

/* ─── APP ───────────────────────────────────────────────────────────── */
export default function MoodFlix() {
  const [screen, setScreen]       = useState(SCREENS.USERS);
  const [selectedUser, setUser]   = useState(null);
  const [selectedMood, setMood]   = useState(null);
  const [movieIndex, setMovieIdx] = useState(0);
  const [animate, setAnim]        = useState(false);
  const [showRemote, setShowRemote] = useState(false);
  const [litKey, setLitKey]       = useState(null);
  const [isPlaying, setPlaying]   = useState(false);
  const [volume, setVolume]       = useState(60);
  const [isMuted, setMuted]       = useState(false);
  const [progress, setProgress]   = useState(0);
  const [toast, setToast]         = useState(null);
  const litTimer = useRef(null);
  const progTimer = useRef(null);
  const [showMoreCount, setShowMoreCount] = useState(0);
  const [showMoodPopup, setShowMoodPopup] = useState(false);
  const [showRatingPopup, setShowRatingPopup] = useState(false);
  const [navZone, setNavZone] = useState(1);
  const [btnIndex, setBtnIndex] = useState(0);

  const movies = selectedMood ? (MOVIES[selectedMood] || MOVIES.unsure) : [];
  const movie  = movies[movieIndex % Math.max(movies.length,1)];
  const allMoods = [...PRIMARY_MOODS, ...ALT_MOODS];
  const moodInfo = allMoods.find(m => m.id === selectedMood) || {};

  const go = (s) => { setAnim(true); setTimeout(() => { setScreen(s); setAnim(false); }, 200); };
  const showT = (msg) => { setToast(msg); setTimeout(() => setToast(null), 1800); };

  const flash = useCallback((id) => {
    if (litTimer.current) clearTimeout(litTimer.current);
    setLitKey(id);
    litTimer.current = setTimeout(() => setLitKey(null), 350);
  }, []);


  useEffect(() => {
    if (isPlaying) {
      progTimer.current = setInterval(() => {
        setProgress(p => {
          if (p >= 100) {
            clearInterval(progTimer.current);
            setPlaying(false);
            setShowRatingPopup(true); 
            return 100;
          }
          return p + 0.25;
        });
      }, 400);
    } else {
      clearInterval(progTimer.current);
    }
  
    return () => clearInterval(progTimer.current);
  }, [isPlaying]);

  const [cursor, setCursor] = useState(0); // tracks highlighted item index per screen


  useEffect(() => {
    setCursor(0);
    setNavZone(1);
    setBtnIndex(0);
  }, [screen]);

  const allMoodsList = [...PRIMARY_MOODS, ...ALT_MOODS];
  const usersList    = [...USERS, { id:"new", name:"New User", color:"#666" }];

  /* ── Shared remote action handler (keyboard + click) ── */
  const handleRemoteAction = useCallback((rid) => {
    flash(rid);

    /* ── USERS screen ── */
    if (screen === SCREENS.USERS) {
      if (rid==="right"||rid==="down")  { setCursor(c => Math.min(c+1, usersList.length-1)); showT("→ Navigate"); }
      else if (rid==="left"||rid==="up"){ setCursor(c => Math.max(c-1, 0)); showT("← Navigate"); }
      else if (rid==="ok"||rid==="play") {
        const u = usersList[cursor];
        if (u && u.id !== "new") { setUser(u); go(SCREENS.PRIMARY_MOOD); showT(`✓ ${u.name} selected`); }
      }
      else if (rid==="n1") { setUser(USERS[0]); go(SCREENS.PRIMARY_MOOD); showT("✓ User 1"); }
      else if (rid==="n2") { setUser(USERS[1]); go(SCREENS.PRIMARY_MOOD); showT("✓ User 2"); }
      else if (rid==="info") { showT("ℹ Select a profile to continue"); }
    }

    /* ── PRIMARY MOOD screen ── */
    else if (screen === SCREENS.PRIMARY_MOOD) {
      const moodCount = PRIMARY_MOODS.length;

      if (rid === "down") {
        setNavZone(z => Math.min(z + 1, 2));
      }
      else if (rid === "up") {
        setNavZone(z => Math.max(z - 1, 0));
      }

      // moods
      else if (rid === "right" && navZone === 1) {
        setCursor(c => Math.min(c + 1, moodCount - 1));
      }
      else if (rid === "left" && navZone === 1) {
        setCursor(c => Math.max(c - 1, 0));
      }

      // 🔥 top buttons navigation
      else if (navZone === 0 && rid === "right") {
        setBtnIndex(i => Math.min(i + 1, 1));
      }
      else if (navZone === 0 && rid === "left") {
        setBtnIndex(i => Math.max(i - 1, 0));
      }

      // OK
      else if (rid === "ok" || rid === "play") {
        if (navZone === 0) {
          if (btnIndex === 0) {
            go(SCREENS.USERS);
          } else {
            setMood("unsure");
            setMovieIdx(0);
            go(SCREENS.RECOMMENDATION);
          }
        }
        else if (navZone === 1) {
          const m = PRIMARY_MOODS[cursor];
          if (m) {
            setMood(m.id);
            setMovieIdx(0);
            go(SCREENS.RECOMMENDATION);
          }
        }
        else if (navZone === 2) {
          go(SCREENS.ALT_MOOD);
        }
      }

      else if (rid==="back")  { go(SCREENS.USERS); }
      else if (rid==="menu")  { go(SCREENS.ALT_MOOD); }
      else if (rid==="chup")  { setMood("unsure"); setMovieIdx(0); go(SCREENS.RECOMMENDATION); }
    }

    /* ── ALT MOOD screen ── */
    else if (screen === SCREENS.ALT_MOOD) {
      const altCount = ALT_MOODS.length;
      if (rid==="right"||rid==="down")   { setCursor(c => Math.min(c+1, altCount-1)); showT("→ Navigate"); }
      else if (rid==="left"||rid==="up") { setCursor(c => Math.max(c-1, 0)); showT("← Navigate"); }
      else if (rid==="ok"||rid==="play") {
        const m = ALT_MOODS[cursor];
        if (m) { setMood(m.id); setMovieIdx(0); go(SCREENS.RECOMMENDATION); showT(`✓ ${m.label}`); }
      }
      else if (rid==="back")  { go(SCREENS.PRIMARY_MOOD); showT("↩ Back"); }
      else if (rid==="home")  { setUser(null); setMood(null); go(SCREENS.USERS); showT("🏠 Home"); }
      else if (rid==="power") { setUser(null); setMood(null); go(SCREENS.USERS); showT("⏻ Powering off…"); }
      else if (rid==="info")  { showT("ℹ Use ◀▶ to browse, OK to pick"); }
    }

    /* ── RECOMMENDATION screen ── */
    else if (screen === SCREENS.RECOMMENDATION) {

      if (rid === "down") {
        setNavZone(z => Math.min(z + 1, 2));
      }
      else if (rid === "up") {
        setNavZone(z => Math.max(z - 1, 0));
      }

      // movie browse
      else if ((rid==="right"||rid==="chup"||rid==="fwd") && navZone === 1) {
        setShowMoreCount(c => {
          const newCount = c + 1;
          if (newCount >= 5) {
            setShowMoodPopup(true);
            return 0;
          }
          return newCount;
        });
        setMovieIdx(i => (i + 1) % Math.max(movies.length, 1));
      }

      else if ((rid==="left"||rid==="chdown"||rid==="rew") && navZone === 1) {
        setMovieIdx(i => (i - 1 + Math.max(movies.length,1)) % Math.max(movies.length,1));
      }

      // 🔥 bottom buttons navigation
      else if (navZone === 2 && rid === "right") {
        setBtnIndex(i => Math.min(i + 1, 2));
      }
      else if (navZone === 2 && rid === "left") {
        setBtnIndex(i => Math.max(i - 1, 0));
      }

      // OK
      else if (rid==="ok"||rid==="play") {
        if (navZone === 0) {
          go(SCREENS.PRIMARY_MOOD);
        }
        else if (navZone === 1) {
          setProgress(0);
          setPlaying(false);
          go(SCREENS.PLAYER);
        }
        else if (navZone === 2) {
          if (btnIndex === 0) {
            setMovieIdx(i=>i+1);
          }
          else if (btnIndex === 1) {
            setProgress(0);
            setPlaying(false);
            go(SCREENS.PLAYER);
          }
          else if (btnIndex === 2) {
            setShowMoreCount(c => {
              const newCount = c + 1;
              if (newCount >= 5) {
                setShowMoodPopup(true);
                return 0;
              }
              return newCount;
            });
            setMovieIdx(i => i + 1);
          }
        }
      }

      else if (rid==="back") { go(SCREENS.PRIMARY_MOOD); }
    }

    /* ── PLAYER screen ── */
    else if (screen === SCREENS.PLAYER) {
      if (rid==="play"||rid==="ok") { setPlaying(p => { showT(!p?"▶ Playing":"⏸ Paused"); return !p; }); }
      else if (rid==="stop")    { setPlaying(false); setProgress(0); showT("⏹ Stopped"); }
      else if (rid==="mute")    { setMuted(m => { showT(!m?"🔇 Muted":"🔊 Unmuted"); return !m; }); }
      else if (rid==="volup")   { setVolume(v => { const n=Math.min(v+10,100); showT(`🔊 Volume ${n}`); return n; }); }
      else if (rid==="voldown") { setVolume(v => { const n=Math.max(v-10,0); showT(`🔉 Volume ${n}`); return n; }); }
      else if (rid==="chup")    { setMovieIdx(i=>(i+1)%Math.max(movies.length,1)); setProgress(0); setPlaying(false); showT("CH+ Next Title"); }
      else if (rid==="chdown")  { setMovieIdx(i=>(i-1+Math.max(movies.length,1))%Math.max(movies.length,1)); setProgress(0); setPlaying(false); showT("CH− Prev Title"); }
      else if (rid==="rew")     { setProgress(p=>Math.max(p-10,0)); showT("⏮ Rewind"); }
      else if (rid==="fwd")     { setProgress(p=>Math.min(p+10,100)); showT("⏭ Fast Forward"); }
      else if (rid==="back")    { go(SCREENS.RECOMMENDATION); showT("↩ Back"); }
      else if (rid==="info")    { showT(movie ? `ℹ ${movie.title} · ${movie.genre}` : ""); }
      else if (rid==="menu")    { showT("☰ Menu"); }
      else if (rid==="home")    { setUser(null); setMood(null); setMovieIdx(0); setPlaying(false); setProgress(0); go(SCREENS.USERS); showT("🏠 Home"); }
      else if (rid==="power")   { setPlaying(false); setProgress(0); showT("⏻ Powering off…"); setTimeout(()=>{ go(SCREENS.USERS); },700); }
      else if (rid.startsWith("n")) { showT(`⌨ ${rid.replace("n","")}`); }
    }

  }, [screen, cursor, isPlaying, movies.length, movie, flash, usersList]);

  /* Keyboard → Remote */
  useEffect(() => {
    const onKey = (e) => {
      const rid = KEY_TO_REMOTE[e.key] ?? KEY_TO_REMOTE[e.key?.toLowerCase()];
      if (!rid) return;
      if (["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," ","Tab"].includes(e.key)) e.preventDefault();
      handleRemoteAction(rid);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [handleRemoteAction]);

  /* ── SCREEN: USERS ── */
  if (screen === SCREENS.USERS) return (
    <TVFrame showRemote={showRemote} setShowRemote={setShowRemote} litKey={litKey} toast={toast} onAction={handleRemoteAction}>
      <div style={S.card(animate)}>
        <div style={S.logoBar}><div style={S.logo}>MoodFlix</div><div style={{fontSize:10,color:"#444",letterSpacing:"0.14em"}}>MOOD-BASED STREAMING</div></div>
        <div style={S.title}>Who's Watching?</div>
        <div style={{fontSize:10,color:"#555",textAlign:"center",marginBottom:12,letterSpacing:"0.08em"}}>◀▶ navigate · OK to select</div>
        <div style={{display:"flex",gap:16,justifyContent:"center",flexWrap:"wrap"}}>
          {USERS.map((u,i)=>{
            const isActive = cursor===i;
            return (
              <div key={u.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"18px 24px",border:`1px solid ${isActive?u.color:u.color+"40"}`,borderRadius:16,background:isActive?`${u.color}22`:`${u.color}0e`,cursor:"pointer",transition:"all 0.2s",minWidth:100,boxShadow:isActive?`0 0 24px ${u.color}55, 0 0 0 2px ${u.color}88`:""}}
                onClick={()=>{setUser(u);go(SCREENS.PRIMARY_MOOD);}}
                onMouseEnter={e=>{setCursor(i);}}
              >
                <div style={{width:58,height:58,borderRadius:"50%",background:`radial-gradient(circle at 35% 35%,${u.color}dd,${u.color}55)`,boxShadow:`0 0 ${isActive?40:20}px ${u.color}${isActive?"88":"44"}`,display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,transition:"all 0.2s"}}>👤</div>
                <span style={{fontSize:13,color: isActive ? u.color : "#c0b8a8",fontWeight:isActive?700:400}}>{u.name}</span>
                {isActive && <div style={{width:20,height:2,background:u.color,borderRadius:1,boxShadow:`0 0 6px ${u.color}`}}/>}
              </div>
            );
          })}
          <div style={{display:"flex",flexDirection:"column",alignItems:"center",gap:10,padding:"18px 24px",border: cursor===USERS.length?"1px solid rgba(255,255,255,0.3)":"1px dashed rgba(255,255,255,0.12)",borderRadius:16,background: cursor===USERS.length?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.02)",cursor:"pointer",minWidth:100,transition:"all 0.2s",boxShadow:cursor===USERS.length?"0 0 20px rgba(255,255,255,0.1)":""}}
            onClick={()=>{}} onMouseEnter={()=>setCursor(USERS.length)}>
            <div style={{width:58,height:58,borderRadius:"50%",border:"2px dashed rgba(255,255,255,0.2)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:22,color:"#666"}}>＋</div>
            <span style={{fontSize:13,color: cursor===USERS.length?"#aaa":"#444"}}>New User</span>
          </div>
        </div>
      </div>
    </TVFrame>
  );

  /* ── SCREEN: PRIMARY MOOD ── */
  if (screen === SCREENS.PRIMARY_MOOD) return (
    <TVFrame showRemote={showRemote} setShowRemote={setShowRemote} litKey={litKey} toast={toast} onAction={handleRemoteAction}>
      <div style={S.card(animate)}>

        <div style={S.logoBar}>
          <div style={S.logo}>MoodFlix</div>

          <div style={{display:"flex",gap:8}}>

            {/* Back */}
            <button
              style={{
                ...S.backBtn,
                border: navZone === 0 && btnIndex === 0 ? "2px solid #E53935" : S.backBtn.border,
                boxShadow: navZone === 0 && btnIndex === 0 ? "0 0 12px #E53935" : "none"
              }}
              onClick={()=>go(SCREENS.USERS)}
            >
              ← Back
            </button>

            {/* Skip */}
            <button
              style={{
                ...S.backBtn,
                border: navZone === 0 && btnIndex === 1 ? "2px solid #E53935" : S.backBtn.border,
                boxShadow: navZone === 0 && btnIndex === 1 ? "0 0 12px #E53935" : "none"
              }}
              onClick={()=>{
                setMood("unsure");
                setMovieIdx(0);
                go(SCREENS.RECOMMENDATION);
              }}
            >
              Skip Mood
            </button>

          </div>
        </div>

        <div style={S.title}>
          How are you feeling, {selectedUser?.name}?
        </div>

        <div style={{fontSize:10,color:"#555",textAlign:"center",marginBottom:12,letterSpacing:"0.08em"}}>
          ◀▶ navigate · OK to select · Menu for more moods
        </div>

        {/* ✅ ORIGINAL MOOD GRID (UNCHANGED) */}
        <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
          {PRIMARY_MOODS.map((m,i)=>{
            const isActive = cursor===i;
            return (
              <div
                key={m.id}
                style={{
                  display:"flex",
                  flexDirection:"column",
                  alignItems:"center",
                  gap:8,
                  padding:"14px 18px",
                  border:`1px solid ${isActive?m.color:m.color+"40"}`,
                  borderRadius:14,
                  background:isActive?`${m.color}28`:`${m.color}08`,
                  cursor:"pointer",
                  transition:"all 0.2s",
                  minWidth:76,
                  boxShadow:isActive?`0 0 22px ${m.color}66, 0 0 0 2px ${m.color}66`:"",
                  transform:isActive?"translateY(-4px) scale(1.08)":"scale(1)"
                }}
                onClick={()=>{setMood(m.id);setMovieIdx(0);go(SCREENS.RECOMMENDATION);}}
                onMouseEnter={()=>setCursor(i)}
              >
                <span style={{fontSize:isActive?40:34,transition:"font-size 0.2s"}}>
                  {m.emoji}
                </span>

                <span style={{
                  fontSize:11,
                  color:isActive?m.color:"#c0b8a8",
                  letterSpacing:"0.06em",
                  fontWeight:isActive?700:400
                }}>
                  {m.label}
                </span>

                {isActive && (
                  <div style={{
                    width:16,
                    height:2,
                    background:m.color,
                    borderRadius:1,
                    boxShadow:`0 0 6px ${m.color}`
                  }}/>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom button */}
        <div
          style={{
            textAlign:"center",
            marginTop:20,
            color:"#E53935",
            cursor:"pointer",
            fontSize:13,
            letterSpacing:"0.06em",
            textDecoration:"underline",
            border: navZone === 2 ? "2px solid #E53935" : "none",
            boxShadow: navZone === 2 ? "0 0 12px #E53935" : "none",
            padding:"6px",
            borderRadius:"8px"
          }}
          onClick={()=>go(SCREENS.ALT_MOOD)}
        >
          + Choose alternative mood
        </div>

      </div>
    </TVFrame>
  );

  /* ── SCREEN: ALT MOOD ── */
  if (screen === SCREENS.ALT_MOOD) return (
    <TVFrame showRemote={showRemote} setShowRemote={setShowRemote} litKey={litKey} toast={toast} onAction={handleRemoteAction}>
      <div style={S.card(animate)}>
        <div style={S.logoBar}><div style={S.logo}>MoodFlix</div><button style={S.backBtn} onClick={()=>go(SCREENS.PRIMARY_MOOD)}>← Back</button></div>
        <div style={S.title}>More Moods</div>
        <div style={{fontSize:10,color:"#555",textAlign:"center",marginBottom:12,letterSpacing:"0.08em"}}>◀▶ navigate · OK to select</div>
        <div style={{display:"flex",gap:12,flexWrap:"wrap",justifyContent:"center"}}>
          {ALT_MOODS.map((m,i)=>{
            const isActive = cursor===i;
            return (
              <div key={m.id} style={{display:"flex",flexDirection:"column",alignItems:"center",gap:8,padding:"14px 18px",border:`1px solid ${isActive?m.color:m.color+"40"}`,borderRadius:14,background:isActive?`${m.color}28`:`${m.color}08`,cursor:"pointer",transition:"all 0.2s",minWidth:76,boxShadow:isActive?`0 0 22px ${m.color}66, 0 0 0 2px ${m.color}66`:"",transform:isActive?"translateY(-4px) scale(1.08)":"scale(1)"}}
                onClick={()=>{setMood(m.id);setMovieIdx(0);go(SCREENS.RECOMMENDATION);}}
                onMouseEnter={()=>setCursor(i)}>
                <span style={{fontSize:isActive?36:30,transition:"font-size 0.2s"}}>{m.emoji}</span>
                <span style={{fontSize:11,color:isActive?m.color:"#c0b8a8",letterSpacing:"0.06em",fontWeight:isActive?700:400}}>{m.label}</span>
                {isActive && <div style={{width:16,height:2,background:m.color,borderRadius:1,boxShadow:`0 0 6px ${m.color}`}}/>}
              </div>
            );
          })}
        </div>
      </div>
    </TVFrame>
  );

  /* ── SCREEN: RECOMMENDATION ── */
  if (screen === SCREENS.RECOMMENDATION && movie) return (
    <TVFrame showRemote={showRemote} setShowRemote={setShowRemote} litKey={litKey} toast={toast} onAction={handleRemoteAction}>
      <div style={S.card(animate)}>

        <div style={S.logoBar}>
          <div style={S.logo}>MoodFlix</div>

          <div style={{display:"flex",alignItems:"center",gap:8}}>
            {moodInfo.emoji && (
              <div style={{
                display:"inline-flex",
                alignItems:"center",
                gap:5,
                padding:"3px 10px",
                borderRadius:20,
                background:`${moodInfo.color}16`,
                border:`1px solid ${moodInfo.color}44`,
                fontSize:12,
                color:moodInfo.color
              }}>
                {moodInfo.emoji} {moodInfo.label}
              </div>
            )}

            {/* Change Mood */}
            <button
              style={{
                ...S.backBtn,
                border: navZone === 0 ? "2px solid #E53935" : S.backBtn.border,
                boxShadow: navZone === 0 ? "0 0 12px #E53935" : "none"
              }}
              onClick={()=>go(SCREENS.PRIMARY_MOOD)}
            >
              Change Mood
            </button>
          </div>
        </div>

        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:14}}>
          <div style={{fontSize:11,color:"#444",letterSpacing:"0.12em"}}>
            RECOMMENDED FOR YOU
          </div>
          <div style={S.badge}>{movie.provider}</div>
        </div>

        <div style={{borderRadius:16,overflow:"hidden",border:"1px solid rgba(255,255,255,0.07)"}}>
          <div style={{position:"relative"}}>
            <img src={movie.img} alt={movie.title} style={{width:"100%",height:210,objectFit:"cover"}}/>
            <div style={{position:"absolute",inset:0,background:"linear-gradient(to top,rgba(10,10,20,0.93) 0%,transparent 55%)"}}/>

            <div style={{position:"absolute",bottom:14,left:18}}>
              <div style={{fontSize:20,fontWeight:700,marginBottom:3}}>{movie.title}</div>
              <div style={{fontSize:12,color:"#a09080",marginBottom:8}}>{movie.genre}</div>
              <Stars rating={movie.rating}/>
            </div>
          </div>

          <div style={{padding:"14px 18px",background:"rgba(255,255,255,0.02)"}}>
            <div style={{display:"flex",gap:8,flexWrap:"wrap"}}>
              <span style={S.tag}>⏱ {movie.length}</span>
              <span style={S.tag}>{movie.age}</span>
              <span style={S.tag}>🎭 {movie.cast}</span>
            </div>
          </div>
        </div>

        {/* Bottom buttons */}
        <div style={{display:"flex",gap:10,marginTop:18}}>

          <button
            style={{
              ...S.dislikeBtn,
              border: navZone === 2 && btnIndex === 0 ? "2px solid #E53935" : S.dislikeBtn.border,
              boxShadow: navZone === 2 && btnIndex === 0 ? "0 0 12px #E53935" : "none"
            }}
            onClick={()=>setMovieIdx(i=>i+1)}
          >
            👎 Dislike
          </button>

          <button
            style={{
              ...S.watchBtn,
              border: navZone === 2 && btnIndex === 1 ? "2px solid #E53935" : S.watchBtn.border,
              boxShadow: navZone === 2 && btnIndex === 1 ? "0 0 12px #E53935" : "none"
            }}
            onClick={()=>{setProgress(0);setPlaying(false);go(SCREENS.PLAYER);}}
          >
            ▶ Watch Now
          </button>

          <button
            style={{
              ...S.showMoreBtn,
              border: navZone === 2 && btnIndex === 2 ? "2px solid #E53935" : S.showMoreBtn.border,
              boxShadow: navZone === 2 && btnIndex === 2 ? "0 0 12px #E53935" : "none"
            }}
            onClick={() => {
              setShowMoreCount(c => {
                const newCount = c + 1;
                if (newCount >= 5) {
                  setShowMoodPopup(true);
                  return 0;
                }
                return newCount;
              });
              setMovieIdx(i => i + 1);
            }}
          >
            ➜ Show More
          </button>

        </div>

        <div style={{textAlign:"center",marginTop:12,fontSize:11,color:"#2e2e3e"}}>
          {movieIndex+1} of {movies.length} recommendations
        </div>

      </div>

      {/* Popup unchanged */}
      {showMoodPopup && (
    <div style={{
      position: "fixed",
      top: 0, left: 0, right: 0, bottom: 0,
      background: "rgba(0,0,0,0.7)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      zIndex: 9999
    }}>
      <div style={{
        background: "#111",
        padding: "30px",
        borderRadius: "12px",
        textAlign: "center",
        border: "1px solid rgba(255,255,255,0.1)",
        maxWidth: "400px"
      }}>
        <h3 style={{ marginBottom: "15px" }}>
          Not finding anything interesting?
        </h3>

        <p style={{ marginBottom: "20px", color: "#aaa" }}>
          Try changing your mood for better recommendations
        </p>

        <div style={{ display: "flex", gap: "10px", justifyContent: "center" }}>
          
          <button
            onClick={() => {
              setShowMoodPopup(false);
              go(SCREENS.PRIMARY_MOOD);
            }}
            style={{
              padding: "10px 16px",
              background: "#E53935",
              border: "none",
              borderRadius: "8px",
              color: "#fff",
              cursor: "pointer"
            }}
          >
            Change Mood
          </button>

          <button
            onClick={() => setShowMoodPopup(false)}
            style={{
              padding: "10px 16px",
              background: "transparent",
              border: "1px solid #555",
              borderRadius: "8px",
              color: "#aaa",
              cursor: "pointer"
            }}
          >
            Keep Browsing
          </button>

        </div>
      </div>
    </div>
  )}

    </TVFrame>
  );

  /* ── SCREEN: PLAYER ── */
  if (screen === SCREENS.PLAYER && movie) {
    const totalSec = (parseInt(movie.length)||2)*3600;
    const elapsedSec = Math.round((progress/100)*totalSec);

    return (
      <TVFrame showRemote={showRemote} setShowRemote={setShowRemote} litKey={litKey} toast={toast} onAction={handleRemoteAction}>
        {/* Header */}
        <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
          <div style={S.logo}>MoodFlix</div>
          <div style={{display:"flex",gap:10}}>
            <button style={S.backBtn} onClick={()=>{go(SCREENS.RECOMMENDATION);}}>← Back</button>
            <button style={{...S.backBtn,color:"#E53935",borderColor:"rgba(229,57,53,0.35)"}} onClick={()=>{setUser(null);setMood(null);setMovieIdx(0);setPlaying(false);setProgress(0);go(SCREENS.USERS);}}>🏠 Home</button>
          </div>
        </div>

        {/* Movie header */}
        <div style={{marginBottom:14}}>
          <div style={{fontSize:20,fontWeight:700,marginBottom:7}}>{movie.title}</div>
          <div style={{display:"flex",gap:10,alignItems:"center",flexWrap:"wrap"}}>
            <div style={S.badge}>{movie.provider}</div>
            <Stars rating={movie.rating}/>
            <span style={S.tag}>{movie.age}</span>
            <span style={S.tag}>{movie.length}</span>
            {isMuted&&<span style={{...S.tag,color:"#F59E0B",background:"rgba(245,158,11,0.08)"}}>🔇 MUTED</span>}
            {isPlaying&&<span style={{...S.tag,color:"#34D399",background:"rgba(52,211,153,0.08)",animation:"pulse 2s infinite"}}>● LIVE</span>}
          </div>
        </div>

        {/* Player */}
        <div style={{borderRadius:14,overflow:"hidden",background:"#000",position:"relative",aspectRatio:"16/9",flexShrink:0}}>
          <img src={movie.img} alt={movie.title} style={{position:"absolute",inset:0,width:"100%",height:"100%",objectFit:"cover",opacity:isPlaying?0.55:0.3,transition:"opacity 0.5s"}}/>
          <div style={{position:"absolute",inset:0,background:isPlaying?"rgba(0,0,0,0.25)":"rgba(0,0,0,0.5)",transition:"background 0.5s"}}/>
          {/* Volume HUD */}
          <div style={{position:"absolute",top:12,right:14,display:"flex",alignItems:"center",gap:6,background:"rgba(0,0,0,0.55)",padding:"5px 10px",borderRadius:20}}>
            <span style={{fontSize:12}}>{isMuted?"🔇":"🔊"}</span>
            <div style={{width:52,height:3,background:"rgba(255,255,255,0.2)",borderRadius:2,overflow:"hidden"}}>
              <div style={{width:`${isMuted?0:volume}%`,height:"100%",background:"#34D399",transition:"width 0.2s"}}/>
            </div>
            <span style={{fontSize:10,color:"#888",minWidth:16}}>{isMuted?0:volume}</span>
          </div>
          {/* Center controls */}
          <div style={{position:"absolute",inset:0,display:"flex",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:10}}>
            <div style={{display:"flex",gap:18,alignItems:"center"}}>
              <div onClick={()=>{setProgress(p=>Math.max(p-10,0));showT("⏮ Rewind");}} style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer",border:"1px solid rgba(255,255,255,0.15)"}}>⏮</div>
              <div onClick={()=>setPlaying(p=>{showT(!p?"▶ Playing":"⏸ Paused");return !p;})} style={{width:64,height:64,borderRadius:"50%",background:isPlaying?"rgba(52,211,153,0.9)":"rgba(229,57,53,0.9)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:24,cursor:"pointer",boxShadow:isPlaying?"0 0 36px rgba(52,211,153,0.6)":"0 0 36px rgba(229,57,53,0.5)",transition:"all 0.25s"}}>{isPlaying?"⏸":"▶"}</div>
              <div onClick={()=>{setProgress(p=>Math.min(p+10,100));showT("⏭ Fast Forward");}} style={{width:40,height:40,borderRadius:"50%",background:"rgba(255,255,255,0.1)",display:"flex",alignItems:"center",justifyContent:"center",fontSize:16,cursor:"pointer",border:"1px solid rgba(255,255,255,0.15)"}}>⏭</div>
            </div>
            {!isPlaying&&<div style={{fontSize:11,color:"rgba(255,255,255,0.45)",letterSpacing:"0.08em"}}>Press Space or click ▶ to play</div>}
          </div>
          {/* Progress bar */}
          <div style={{position:"absolute",bottom:0,left:0,right:0,padding:"8px 16px 12px",background:"linear-gradient(to top,rgba(0,0,0,0.85),transparent)"}}>
            <div style={{height:4,background:"rgba(255,255,255,0.15)",borderRadius:2,overflow:"hidden",cursor:"pointer"}}
              onClick={e=>{const r=e.currentTarget.getBoundingClientRect();setProgress(((e.clientX-r.left)/r.width)*100);}}>
              <div style={{width:`${progress}%`,height:"100%",background:"linear-gradient(90deg,#E53935,#FF7043)",transition:"width 0.4s linear",position:"relative"}}>
                <div style={{position:"absolute",right:-4,top:"50%",transform:"translateY(-50%)",width:10,height:10,borderRadius:"50%",background:"#FF7043",boxShadow:"0 0 8px #FF7043"}}/>
              </div>
            </div>
            <div style={{display:"flex",justifyContent:"space-between",marginTop:5,fontSize:11,color:"rgba(255,255,255,0.45)"}}>
              <span>{fmt(elapsedSec)}</span><span>{movie.length}</span>
            </div>
          </div>
        </div>

        {/* Cast */}
        <div style={{marginTop:14,padding:"12px 16px",background:"rgba(255,255,255,0.025)",borderRadius:10,border:"1px solid rgba(255,255,255,0.05)"}}>
          <div style={{fontSize:10,color:"#444",letterSpacing:"0.12em",marginBottom:6}}>CAST & CREW</div>
          <div style={{fontSize:13,color:"#c0b8a8"}}>🎭 {movie.cast}</div>
          <div style={{fontSize:12,color:"#666",marginTop:3}}>Genre: {movie.genre}</div>
        </div>
        {showRatingPopup && (
      <div style={{
        position: "fixed",
        top: 0, left: 0, right: 0, bottom: 0,
        background: "rgba(0,0,0,0.7)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 9999
      }}>
        <div style={{
          background: "#111",
          padding: "30px",
          borderRadius: "12px",
          textAlign: "center",
          border: "1px solid rgba(255,255,255,0.1)",
          maxWidth: "400px"
        }}>
          <h3 style={{ marginBottom: "15px" }}>
            👍 Did you like this movie?
          </h3>

          <div style={{ display: "flex", gap: "20px", justifyContent: "center" }}>
            
          <button
            onClick={() => {
              setShowRatingPopup(false);
              showT("👍 Thanks for your feedback!");
            }}
            style={{
              padding: "14px 18px",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              fontSize: "20px",
              cursor: "pointer",
              color: "#fff"
            }}
          >
            👍
          </button>

          <button
            onClick={() => {
              setShowRatingPopup(false);
              showT("👎 Got it, we’ll improve recommendations");
            }}
            style={{
              padding: "14px 18px",
              background: "#111",
              border: "1px solid rgba(255,255,255,0.2)",
              borderRadius: "10px",
              fontSize: "20px",
              cursor: "pointer",
              color: "#fff"
            }}
          >
            👎
          </button>

          </div>
        </div>
      </div>
)}
      </TVFrame>
    );
  }

  return null;
}
