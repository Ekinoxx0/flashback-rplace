// ==UserScript==
// @name         FlashBack Template
// @namespace    https://github.com/Ekinoxx0/flashback-rplace
// @version     1
// @description  FlashBack Template
// @author       Cpt.Dinosaur
// @match        https://hot-potato.reddit.com/embed*
// @match        https://www.reddit.com/r/place/*
// @match        https://new.reddit.com/r/place/*
// @match        https://localhost/
// @icon         https://www.google.com/s2/favicons?sz=64&domain=reddit.com
// @require         https://cdn.jsdelivr.net/npm/toastify-js
// @resource     TOASTIFY_CSS https://cdn.jsdelivr.net/npm/toastify-js/src/toastify.min.css
// @grant        GM_getResourceText
// @grant        GM_addStyle
// ==/UserScript==

// credit to the osu! logo script


//TODO: When changing the version, please do change the version in the userscript information as well as the version in version.json
const VERSION = "1";

const updateURL = "https://raw.githubusercontent.com/Ekinoxx0/flashback-rplace/main/flashback.user.js";
const overlayLink = "https://raw.githubusercontent.com/Ekinoxx0/flashback-rplace/main/flashback.png";
const versionLink = "https://raw.githubusercontent.com/Ekinoxx0/flashback-rplace/main/version.json";

var NOTIFIED = false;
var START_NOTIFIED = false;

var SECOND = 1000;
var MINUTE = 60 * SECOND;


(async function () {

    GM_addStyle(GM_getResourceText('TOASTIFY_CSS'));

    if (window.top !== window.self) {    
        window.addEventListener('load', () => {
            // Load the image
                const image = document.createElement("img");
                image.src = overlayLink;
                image.onload = () => { //251&cy=1890 // 290&cy=1925
                    image.style = `position: absolute; left: 251px; top: 1890px; width: 40px; height: 36px; image-rendering: pixelated; z-index: 1; opacity: 60%;`;
                };
        
                // Add the image as overlay
                const camera = document.querySelector("mona-lisa-embed").shadowRoot.querySelector("mona-lisa-camera");
                const canvas = camera.querySelector("mona-lisa-canvas");
                canvas.shadowRoot.querySelector('.container').appendChild(image);

                const waitForPreview = setInterval(() => {
                const preview = camera.querySelector("mona-lisa-pixel-preview");
                    if (preview) {
                        clearInterval(waitForPreview);
                        const style = document.createElement('style')
                        style.innerHTML = '.pixel { clip-path: polygon(-20% -20%, -20% 120%, 37% 120%, 37% 37%, 62% 37%, 62% 62%, 37% 62%, 37% 120%, 120% 120%, 120% -20%); }'
                        preview.shadowRoot.appendChild(style);
                    }
                }, 100);
        }, false);
    }

   startNotify();

   setInterval(checkForUpdates, SECOND * 10);
})();

// Checks for an update every 1 minute
function checkForUpdates(){
    LOG("Checking for updates...");

    var cacheHeaders = new Headers();
    cacheHeaders.append('pragma', 'no-cache');
    cacheHeaders.append('cache-control', 'no-cache');

    var initRequest = {
        method: 'GET',
        headers: cacheHeaders,
      };
      

    fetch(versionLink, initRequest).then(async (response) => {
        const data = await response.json();
        LOG("Latest verion is : " + data.version);

        if(!response.ok){
            return console.error("Failed to fetch version.json: " + response.statusText);
        } else {
            if(data.version > VERSION){
                LOG("Update available! Sending a notification");
                requiresUpdate();
            }
        }
    }).catch((e) => console.warn('Error!', e));
}

function LOG(log){
    console.log("HOTS/WOW OVERLAY " + VERSION + " | " + log);
}

function requiresUpdate(){
    var toastUpdate = Toastify({
        text: "Mise à jour dispo ! Mettez vous à jour SVP !",
        duration: -1,
        position: "center",
        onClick: () => {
            window.location = updateURL;
        }
    })
    
    toastUpdate.showToast();

}

function startNotify(){
    if(!START_NOTIFIED){
        Toastify({
            text: `FLASHBACK ACTIF`,
            duration: SECOND * 3,
            onClick: () => {
                window.location = "https://discord.gg/flashback";
            }
        }).showToast();

        START_NOTIFIED = true;
    }
}
