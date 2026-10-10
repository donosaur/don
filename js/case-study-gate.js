/**
 * Case Study Password Gate — Don Polistico Portfolio
 * Locks in-progress case studies behind a minimal password screen.
 * Once unlocked, access persists across visits via localStorage.
 */

(function () {
  'use strict';

  var STORAGE_KEY = 'don_case_study_unlocked';

  // SHA-256 hash for 'opensesame123!'
  var ALLOWED_HASHES = [
    '2ed5b08437faf79841debfaf0df881e70936684268f81598ee8b27b1dcd74758'
  ];

  // Plaintext password
  var ALLOWED_PLAINTEXT = ['opensesame123!'];

  // SHA-256 helper using browser Web Crypto API
  async function computeSha256(text) {
    if (!window.crypto || !window.crypto.subtle) {
      return null;
    }
    try {
      var buffer = new TextEncoder().encode(text);
      var hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
      var hashArray = Array.from(new Uint8Array(hashBuffer));
      return hashArray.map(function (b) {
        return b.toString(16).padStart(2, '0');
      }).join('');
    } catch (e) {
      return null;
    }
  }

  // Developer utility exposed to console for generating new password hashes
  window.generatePasswordHash = async function (rawPassword) {
    var hash = await computeSha256((rawPassword || '').trim());
    console.log('SHA-256 hash for "' + rawPassword + '":\n' + hash);
    return hash;
  };

  function isUnlocked() {
    try {
      // Support ?lock query param to easily re-lock for testing
      var params = new URLSearchParams(window.location.search);
      if (params.has('lock')) {
        localStorage.removeItem(STORAGE_KEY);
        return false;
      }
      return localStorage.getItem(STORAGE_KEY) === 'true';
    } catch (e) {
      return false;
    }
  }

  function setUnlocked() {
    try {
      localStorage.setItem(STORAGE_KEY, 'true');
    } catch (e) {}

    var gate = document.getElementById('cs-gate');
    if (gate) {
      gate.classList.add('cs-gate-unlocking');
      setTimeout(function () {
        document.documentElement.classList.remove('cs-locked');
        gate.style.display = 'none';
        gate.classList.remove('cs-gate-unlocking');

        // Play any videos that were paused while locked
        var videos = document.querySelectorAll('video');
        videos.forEach(function (v) {
          if (v.hasAttribute('autoplay') || v.closest('.screen-thumb')) {
            v.play().catch(function () {});
          }
        });
      }, 250);
    } else {
      document.documentElement.classList.remove('cs-locked');
    }
  }

  function lock() {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (e) {}
    document.documentElement.classList.add('cs-locked');
    var gate = document.getElementById('cs-gate');
    if (gate) {
      gate.style.display = 'flex';
      var input = document.getElementById('cs-gate-input');
      if (input) {
        input.value = '';
        input.focus();
      }
    }
  }
  window.lockCaseStudies = lock;

  async function verifyPassword(input) {
    var clean = (input || '').trim();
    if (!clean) return false;

    // Direct plaintext comparison
    if (ALLOWED_PLAINTEXT.indexOf(clean) !== -1 || ALLOWED_PLAINTEXT.indexOf(clean.toLowerCase()) !== -1) {
      return true;
    }

    // Hash comparison
    var hash = await computeSha256(clean);
    if (hash && ALLOWED_HASHES.indexOf(hash) !== -1) {
      return true;
    }

    var lowerHash = await computeSha256(clean.toLowerCase());
    if (lowerHash && ALLOWED_HASHES.indexOf(lowerHash) !== -1) {
      return true;
    }

    return false;
  }

  function initGate() {
    var form = document.getElementById('cs-gate-form');
    var input = document.getElementById('cs-gate-input');
    var errorEl = document.getElementById('cs-gate-error');
    var card = document.querySelector('.cs-gate-card');

    if (isUnlocked()) {
      document.documentElement.classList.remove('cs-locked');
      var gate = document.getElementById('cs-gate');
      if (gate) gate.style.display = 'none';
      return;
    }

    // Ensure locked state
    document.documentElement.classList.add('cs-locked');

    if (!form || !input) return;

    // Focus input on load
    setTimeout(function () {
      if (input && document.documentElement.classList.contains('cs-locked')) {
        input.focus();
      }
    }, 120);

    form.addEventListener('submit', async function (e) {
      e.preventDefault();
      var val = input.value;

      if (errorEl) {
        errorEl.textContent = '';
        errorEl.classList.remove('is-visible');
      }
      input.classList.remove('is-error');

      var valid = await verifyPassword(val);
      if (valid) {
        setUnlocked();
      } else {
        if (errorEl) {
          errorEl.textContent = 'Incorrect password.';
          errorEl.classList.add('is-visible');
        }
        input.classList.add('is-error');
        if (card) {
          card.classList.remove('cs-gate-shake');
          void card.offsetWidth; // Trigger reflow
          card.classList.add('cs-gate-shake');
        }
        input.select();
      }
    });

    input.addEventListener('input', function () {
      if (input.classList.contains('is-error')) {
        input.classList.remove('is-error');
        if (errorEl) {
          errorEl.classList.remove('is-visible');
        }
      }
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initGate);
  } else {
    initGate();
  }
})();
