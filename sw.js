self.addEventListener('fetch', function(event) {});
<!DOCTYPE html>
<html lang="it">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>AI Study Hub v46 - PWA Mobile</title>
    
    <meta name="theme-color" content="#c8a064"> 
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <link rel="manifest" href="manifest.json">
    <link rel="apple-touch-icon" href="logo.png">

    <style>
        :root { 
            --bg: #101820;          
            --panel: #1a2530;       
            --accent: #c8a064;      
            --text: #e9edef;        
            --border: #2c3e50;      
        }
        * { box-sizing: border-box; }
        
        body { 
            font-family: 'Segoe UI', sans-serif; 
            background: var(--bg); color: var(--text); margin: 0; 
            display: grid; grid-template-columns: 280px 1fr 600px; 
            height: 100vh; width: 100vw; overflow: hidden; 
        }

        /* --- LOGO PERSONALE --- */
        .logo-area {
            display: flex; align-items: center; justify-content: center; flex-direction: column;
            padding: 15px; margin-bottom: 10px;
            background: rgba(200, 160, 100, 0.05); border-radius: 12px;
            border: 1px dashed rgba(200, 160, 100, 0.2);
        }
        .logo-img {
            width: 100px; height: 100px; border-radius: 50%;
            background: url('logo.png') no-repeat center center; 
            background-size: cover;
            margin-bottom: 10px;
            box-shadow: 0 0 15px rgba(200, 160, 100, 0.3);
            border: 2px solid var(--accent);
        }

        .sidebar { background: var(--panel); border-right: 1px solid var(--border); padding: 15px; display: flex; flex-direction: column; gap: 12px; overflow-y: auto; }
        .settings-container { background: rgba(255, 255, 255, 0.03); border-radius: 15px; padding: 12px; border: 1px solid var(--border); text-align: center; }
        .globe-wrapper { width: 80px; height: 80px; margin: 0 auto 10px; perspective: 1000px; }
        .globe { width: 100%; height: 100%; border-radius: 50%; background: url('https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Earth_Western_Hemisphere_transparent_background.png/600px-Earth_Western_Hemisphere_transparent_background.png'); background-size: cover; box-shadow: inset -10px -10px 30px rgba(0,0,0,0.8); animation: rotateGlobe 12s linear infinite; }
        @keyframes rotateGlobe { from { background-position: 0 0; } to { background-position: 160px 0; } }

        .pref-item { display: flex; justify-content: space-between; align-items: center; background: rgba(0, 0, 0, 0.2); padding: 10px; border-radius: 8px; margin-bottom: 5px; font-size: 11px; }
        .translator-vignette { background: #111b21; border: 2px solid var(--accent); border-radius: 12px; padding: 12px; }
        .trans-input { width: 100%; background: rgba(0, 0, 0, 0.2); border: none; padding: 10px; border-radius: 6px; color: white; margin-bottom: 8px; outline: none; font-size: 12px; border: 1px solid transparent; }
        .trans-input:focus { border-color: var(--accent); }
        .trans-btn { width: 100%; background: var(--accent); border: none; color: #101820; padding: 10px; border-radius: 6px; cursor: pointer; font-weight: bold; }

        .main-chat { display: flex; flex-direction: column; background: var(--bg); border-right: 1px solid var(--border); }
        #chat-display { flex: 1; overflow-y: auto; padding: 15px; display: flex; flex-direction: column; gap: 10px; }
        .msg { padding: 12px; border-radius: 10px; font-size: 14px; max-width: 85%; }
        .bot { background: #202c33; align-self: flex-start; border-left: 3px solid var(--accent); }
        .tu { background: var(--accent); align-self: flex-end; color: #101820; font-weight: 500; }
        .input-area { padding: 15px; background: #202c33; display: flex; gap: 8px; }
        input#user-in { flex: 1; padding: 12px; border-radius: 6px; border: none; background: #2a3942; color: white; outline: none; }

        .right-panel { background: #1a1a1a; display: flex; flex-direction: column; }
        .view-selector { display: flex; background: #202c33; padding: 5px; gap: 5px; }
        .view-btn { flex: 1; padding: 10px; border: none; background: #2a3942; color: #8696a0; border-radius: 4px; cursor: pointer; font-size: 11px; }
        .view-btn.active { background: var(--accent); color: #101820; }
        #board-view { background: #ffffff; color: #101820; padding: 20px; overflow-y: auto; height: 100%; }
        #wiki-view { width: 100%; height: 100%; border: none; display: none; }
        .board-item { border-bottom: 1px solid #eee; padding: 12px 0; }
        .entry-main { font-size: 22px; font-weight: bold; display: block; }
        .tag-math { color: var(--border); font-weight: bold; font-size: 10px; }
        .tag-trans { color: var(--accent); font-weight: bold; font-size: 10px; }

        .switch { position: relative; width: 34px; height: 18px; display: inline-block; }
        .switch input { opacity: 0; width: 0; height: 0; }
        .slider { position: absolute; cursor: pointer; top: 0; left: 0; right: 0; bottom: 0; background: #555; transition: .4s; border-radius: 20px; }
        .slider:before { position: absolute; content: ""; height: 12px; width: 12px; left: 3px; bottom: 3px; background: white; transition: .4s; border-radius: 50%; }
        input:checked + .slider { background: var(--accent); }
        input:checked + .slider:before { transform: translateX(16px); }

        @media (max-width: 900px) {
            body { grid-template-columns: 1fr; }
            .sidebar, .right-panel { display: none; } 
        }
    </style>
</head>
<body>

    <div class="sidebar">
        <div class="logo-area">
            <div class="logo-img"></div>
            <div style="font-weight: bold; font-size: 16px; color: var(--accent);">STUDY HUB v46</div>
            <div style="font-size: 10px; color: var(--accent); opacity: 0.8;">AI POWERED EDUCATION</div>
        </div>

        <div class="settings-container">
            <div class="globe-wrapper"><div class="globe"></div></div>
            <div id="t-display" style="font-size: 16px; color: #ffbc00;">25:00</div>
            <button onclick="toggleTimer()" style="background:var(--accent); border:none; color:#101820; width:100%; padding:5px; border-radius:4px; margin-top:5px; cursor:pointer; font-size:10px; font-weight: bold;">TIMER ON/OFF</button>
        </div>

        <div class="settings-container">
            <h4 style="color:var(--accent); font-size:10px; margin-bottom:10px;">PREFERENZE</h4>
            <div class="pref-item"><span>Voce AI</span><label class="switch"><input type="checkbox" id="pref-voice" onchange="savePrefs()"><span class="slider"></span></label></div>
            <div class="pref-item"><span>Wiki Dark</span><label class="switch"><input type="checkbox" id="pref-dark" onchange="savePrefs()"><span class="slider"></span></label></div>
        </div>

        <div class="translator-vignette">
            <input type="text" id="trans-text" class="trans-input" placeholder="Traduci frase...">
            <select id="trans-lang" class="trans-input" style="font-size:11px; color:white;">
                <optgroup label="Lingue">
                    <option value="en">Inglese 🇬🇧</option>
                    <option value="es">Spagnolo 🇪🇸</option>
                    <option value="la">Latino 🏛️</option>
                    <option value="de">Tedesco 🇩🇪</option>
                    <option value="fr">Francese 🇫🇷</option>
                </optgroup>
            </select>
            <button class="trans-btn" onclick="traduciSuLavagna()">INVIA A LAVAGNA</button>
        </div>
        <button onclick="location.reload()" style="background:#ea0038; border:none; color:white; padding:8px; border-radius:5px; cursor:pointer; font-size:11px; margin-top: auto;">RESET HUB</button>
    </div>

    <div class="main-chat">
        <div id="chat-display"></div>
        <div class="input-area">
            <input type="text" id="user-in" placeholder="Scrivi al Bot..." autocomplete="off">
            <button onclick="invia()" style="background: var(--accent); border:none; color:#101820; padding:10px 15px; border-radius:6px; cursor:pointer; font-weight: bold;">OK</button>
        </div>
    </div>

    <div class="right-panel">
        <div class="view-selector">
            <button class="view-btn active" id="btn-board" onclick="showView('board')">📝 LAVAGNA</button>
            <button class="view-btn" id="btn-wiki" onclick="showView('wiki')">🌐 WIKIPEDIA</button>
        </div>
        <div id="board-view"><div id="unified-history"></div></div>
        <iframe id="wiki-view" src="https://it.m.wikipedia.org/wiki/Pagina_principale"></iframe>
    </div>

<script>
    if ('serviceWorker' in navigator) {
        window.addEventListener('load', () => { navigator.serviceWorker.register('sw.js').catch(() => {}); });
    }

    const chat = document.getElementById("chat-display");
    const input = document.getElementById("user-in");
    const history = document.getElementById("unified-history");
    const wiki = document.getElementById("wiki-view");
    let timer;

    function savePrefs() {
        localStorage.setItem('hub_voice', document.getElementById('pref-voice').checked);
        localStorage.setItem('hub_dark', document.getElementById('pref-dark').checked);
        applyPrefs();
    }

    function applyPrefs() {
        const dark = localStorage.getItem('hub_dark') === 'true';
        wiki.style.filter = dark ? "invert(1) hue-rotate(180deg)" : "none";
        document.getElementById('pref-dark').checked = dark;
        document.getElementById('pref-voice').checked = localStorage.getItem('hub_voice') === 'true';
    }

    function showView(type) {
        document.getElementById('board-view').style.display = type === 'board' ? 'block' : 'none';
        document.getElementById('wiki-view').style.display = type === 'wiki' ? 'block' : 'none';
        document.getElementById('btn-board').classList.toggle('active', type === 'board');
        document.getElementById('btn-wiki').classList.toggle('active', type === 'wiki');
    }

    function addToBoard(type, original, result) {
        const div = document.createElement("div");
        div.className = "board-item";
        const tagClass = type === 'math' ? 'tag-math' : 'tag-trans';
        const tagText = type === 'math' ? 'CALCOLO' : 'TRADUZIONE';
        div.innerHTML = `<span class="${tagClass}">${tagText}</span><small style="display:block;color:#666">${original}</small><span class="entry-main">${result}</span>`;
        history.prepend(div);
        showView('board');
    }

    async function traduciSuLavagna() {
        const text = document.getElementById("trans-text").value.trim();
        const lang = document.getElementById("trans-lang").value;
        if(!text) return;
        try {
            const resp = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=it|${lang}`);
            const data = await resp.json();
            addToBoard('traduzione', text, data.responseData.translatedText);
            document.getElementById("trans-text").value = "";
            print("Bot", `Traduzione completata e salvata.`);
        } catch(e) { print("Bot", "Errore traduttore."); }
    }

    function print(who, txt) {
        const d = document.createElement("div");
        d.className = "msg " + (who === "Bot" ? "bot" : "tu");
        d.innerHTML = `<b>${who}:</b> ${txt}`;
        chat.appendChild(d);
        chat.scrollTop = chat.scrollHeight;
        if(who === "Bot" && localStorage.getItem('hub_voice') === 'true') {
            window.speechSynthesis.cancel();
            const m = new SpeechSynthesisUtterance(txt.replace(/<[^>]*>?/gm, ''));
            m.lang = 'it-IT';
            window.speechSynthesis.speak(m);
        }
    }

    function invia() {
        const val = input.value.trim();
        if(!val) return;
        print("Tu", val);
        input.value = "";
        if (/^[0-9+\-*/().\s^%]+$/.test(val)) {
            try {
                let res = eval(val.replace(/(\d+)%/g, "($1/100)").replace("^", "**"));
                addToBoard('math', val, res);
                print("Bot", `Risultato: <b>${res}</b>`);
            } catch(e) { print("Bot", "Errore calcolo."); }
        } else {
            wiki.src = `https://it.m.wikipedia.org/wiki/${encodeURIComponent(val)}`;
            showView('wiki');
            print("Bot", `Cercando <b>${val}</b>...`);
        }
    }

    function toggleTimer() {
        if(timer) { clearInterval(timer); timer = null; return; }
        let s = 1500;
        timer = setInterval(() => {
            let m=Math.floor(s/60), sec=s%60;
            document.getElementById("t-display").innerText = `${m}:${sec<10?'0':''}${sec}`;
            if(s-- <= 0) clearInterval(timer);
        }, 1000);
    }

    window.onload = applyPrefs;
    input.addEventListener("keypress", (e) => { if(e.key==='Enter') invia(); });
</script>
</body>
</html>
self.addEventListener('fetch', function(event) {
    // Service worker base per abilitare la PWA
});