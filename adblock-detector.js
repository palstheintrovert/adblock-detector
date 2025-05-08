/*
 * adblock-detector.js
 * Self-hosted AdBlocker Detector Widget for Blogger
 * Usage:
 *   <script src="https://yourcdn.com/adblock-detector.js" defer></script>
 *   <div class="adblock-detector-widget"></div>
 */
(function () {
    // 1) Inject necessary CSS
    var css = `
.adblock-widget-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(255,255,255,0.98);
  z-index: 9999;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem;
}
.adblock-widget-overlay.visible {
  display: flex;
}
.adblock-widget-overlay p {
  font-size: 1.125rem;
  margin-bottom: 1rem;
}
.adblock-widget-overlay button {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}
.ad-bait {
  width: 1px !important;
  height: 1px !important;
  position: absolute !important;
  top: -10px !important;
  left: -10px !important;
  display: block !important;
  opacity: 0 !important;
  pointer-events: none !important;
}
`;
    var style = document.createElement('style');
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);

    // 2) Main logic
    function createDetection(widget) {
        // Create bait container
        var baitContainer = document.createElement('div');
        baitContainer.style.position = 'absolute';
        baitContainer.style.width = '0';
        baitContainer.style.height = '0';
        baitContainer.style.overflow = 'hidden';
        ['adsbygoogle', 'ad-banner', 'ad-zone', 'adsbox'].forEach(function (name) {
            var bait = document.createElement('div');
            bait.className = 'ad-bait ' + name;
            baitContainer.appendChild(bait);
        });
        document.body.appendChild(baitContainer);

        // Create overlay
        var overlay = document.createElement('div');
        overlay.className = 'adblock-widget-overlay';
        overlay.innerHTML = '<div>' +
            '<p>This site is supported by ads. Please disable your ad blocker to continue.</p>' +
            '<button id="adblock-retry">I\'ve Disabled AdBlock</button>' +
            '</div>';
        document.body.appendChild(overlay);

        // Detection function
        function isBlocked(el) {
            if (!el) return true;
            var st = window.getComputedStyle(el);
            return (
                el.offsetParent === null ||
                el.offsetHeight === 0 ||
                el.offsetWidth === 0 ||
                st.display === 'none' ||
                st.visibility === 'hidden'
            );
        }
        function detect() {
            var baits = baitContainer.querySelectorAll('.ad-bait');
            var blocked = Array.prototype.every.call(baits, isBlocked);
            overlay.classList.toggle('visible', blocked);
            document.body.style.overflow = blocked ? 'hidden' : '';
        }

        // Run detection
        window.addEventListener('load', function () {
            setTimeout(detect, 300);
        });
        document.getElementById('adblock-retry').addEventListener('click', detect);
    }

    // 3) Initialize all widgets
    function init() {
        var widgets = document.querySelectorAll('.adblock-detector-widget');
        widgets.forEach(function (widget) { createDetection(widget); });
    }

    // DOM ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }
})();
