(function () {
  const phoneInput = document.getElementById('phone-number');
  const messageInput = document.getElementById('message');
  const countrySelectRoot = document.getElementById('country-code');
  const generateBtn = document.getElementById('generate-button');
  const phoneError = document.getElementById('phone-error');
  const form = document.querySelector('.generator-form');
  const generatedLinkInput = document.getElementById('generated-link');
  const shortLinkInput = document.getElementById('short-link');
  const qrImage = document.querySelector('.qr-image');
  const qrFrame = document.querySelector('.qr-frame');
  const outputSection = document.querySelector('.output-section');
  const outputCard = document.getElementById('output-card');
  const toast = document.getElementById('toast');
  const copyLinkButton = document.getElementById('copy-link-button');
  const copyShortButton = document.getElementById('copy-short-button');
  const openWhatsAppButton = document.getElementById('open-whatsapp-button');
  const downloadQrLink = document.getElementById('download-qr-link');
  const shareCopyButton = document.getElementById('share-copy-button');
  const shareWhatsappButton = document.getElementById('share-whatsapp-button');
  const shareQrButton = document.getElementById('share-qr-button');
  const clickCountEl = document.getElementById('click-count');
  const recentNumbersEl = document.getElementById('recent-numbers');
  const recentEmptyEl = document.getElementById('recent-empty');

  const countryFlag = document.getElementById('country-flag');
  const countryCodeDisplay = document.getElementById('country-code-display');
  const countryPanel = countrySelectRoot.querySelector('.country-panel');
  const countryToggle = countrySelectRoot.querySelector('.country-toggle');
  const countrySearch = document.getElementById('country-search');
  const countryListEl = document.getElementById('country-list');

  const RECENTS_KEY = 'waRecentNumbers';
  const SHORTLINKS_KEY = 'waShortLinks';

  let currentWaUrl = generatedLinkInput && generatedLinkInput.value ? generatedLinkInput.value : '';
  let currentShortToken = '';
  let phoneTouched = false;
  let submitAttempted = false;

  // Basic country dataset (flag emoji, name, iso, dial)
  const COUNTRIES = [
    { iso: 'IN', name: 'India', dial: '91', flag: '🇮🇳' },
    { iso: 'US', name: 'United States', dial: '1', flag: '🇺🇸' },
    { iso: 'GB', name: 'United Kingdom', dial: '44', flag: '🇬🇧' },
    { iso: 'AE', name: 'United Arab Emirates', dial: '971', flag: '🇦🇪' },
    { iso: 'CA', name: 'Canada', dial: '1', flag: '🇨🇦' },
    { iso: 'AU', name: 'Australia', dial: '61', flag: '🇦🇺' },
    { iso: 'DE', name: 'Germany', dial: '49', flag: '🇩🇪' },
    { iso: 'FR', name: 'France', dial: '33', flag: '🇫🇷' },
    { iso: 'BR', name: 'Brazil', dial: '55', flag: '🇧🇷' },
    { iso: 'NG', name: 'Nigeria', dial: '234', flag: '🇳🇬' }
  ];

  function readJson(key, fallback) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : fallback;
    } catch (_) {
      return fallback;
    }
  }

  function writeJson(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (_) {
      // Ignore storage failures.
    }
  }

  function cleanNumber(val) {
    return (val || '').replace(/\D/g, '');
  }

  function isValidPhone(numberDigits) {
    return numberDigits.length >= 7 && numberDigits.length <= 15;
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.hidden = false;
    toast.classList.add('show');
    clearTimeout(showToast._timer);
    showToast._timer = setTimeout(() => {
      toast.classList.remove('show');
      toast.hidden = true;
    }, 1800);
  }

  async function copyText(text) {
    if (!text) return;
    try {
      await navigator.clipboard.writeText(text);
    } catch (_) {
      const temp = document.createElement('textarea');
      temp.value = text;
      document.body.appendChild(temp);
      temp.select();
      document.execCommand('copy');
      temp.remove();
    }
  }

  function renderCountryList(filter) {
    countryListEl.innerHTML = '';
    const q = (filter || '').toLowerCase();
    COUNTRIES
      .filter((c) => !q || c.name.toLowerCase().includes(q) || c.dial.includes(q) || c.iso.toLowerCase() === q)
      .forEach((c) => {
        const li = document.createElement('li');
        li.className = 'country-item';
        li.tabIndex = 0;
        li.innerHTML = `<span class="flag">${c.flag}</span><span class="name">${c.name}</span><span class="code">+${c.dial}</span>`;
        li.addEventListener('click', () => selectCountry(c));
        li.addEventListener('keydown', (e) => {
          if (e.key === 'Enter') selectCountry(c);
        });
        countryListEl.appendChild(li);
      });
  }

  function selectCountry(c) {
    countryFlag.textContent = c.flag;
    const nameEl = document.getElementById('country-name-display');
    if (nameEl) nameEl.textContent = c.name;
    countryCodeDisplay.textContent = `+${c.dial}`;
    countryToggle.setAttribute('aria-expanded', 'false');
    countryPanel.hidden = true;
    updateValidation();
  }

  function autoDetectCountry() {
    try {
      const lang = navigator.language || (navigator.languages && navigator.languages[0]) || '';
      const region = (lang && lang.split('-')[1]) || '';
      if (region) {
        const found = COUNTRIES.find((c) => c.iso.toLowerCase() === region.toLowerCase());
        if (found) selectCountry(found);
      }
    } catch (_) {
      // Ignore locale detection failures.
    }
  }

  async function autoDetectCountryFromIp() {
    try {
      const response = await fetch('https://ipapi.co/json/', { cache: 'no-store' });
      if (!response.ok) return;
      const data = await response.json();
      const region = (data && (data.country_code || data.country)) || '';
      if (!region) return;
      const found = COUNTRIES.find((c) => c.iso.toLowerCase() === String(region).toLowerCase());
      if (found) selectCountry(found);
    } catch (_) {
      // Best-effort only; fallback stays on locale-based detection.
    }
  }

  function updateValidation() {
    const countryDigits = countryCodeDisplay.textContent.replace(/\D/g, '');
    const rawValue = (phoneInput.value || '').trim();
    const cleaned = cleanNumber(phoneInput.value);
    const shouldShowError = phoneTouched || submitAttempted;

    if (!countryDigits) {
      phoneError.textContent = 'Select a country code';
      phoneError.hidden = !shouldShowError;
      generateBtn.disabled = true;
      return false;
    }

    if (!rawValue) {
      phoneError.textContent = 'Enter a valid phone number';
      phoneError.hidden = !shouldShowError;
      generateBtn.disabled = true;
      return false;
    }

    if (/[A-Za-z]/.test(rawValue)) {
      phoneError.textContent = 'Enter digits only for phone number';
      phoneError.hidden = !shouldShowError;
      generateBtn.disabled = true;
      return false;
    }

    if (!isValidPhone(cleaned)) {
      phoneError.textContent = 'Enter a valid phone number';
      phoneError.hidden = !shouldShowError;
      generateBtn.disabled = true;
      return false;
    }

    phoneError.hidden = true;
    if (!generateBtn.classList.contains('is-loading')) {
      generateBtn.disabled = false;
    }
    return true;
  }

  function setLoading(isLoading) {
    if (isLoading) {
      generateBtn.classList.add('is-loading');
      generateBtn.disabled = true;
      return;
    }
    generateBtn.classList.remove('is-loading');
    updateValidation();
  }

  function flashSuccess() {
    if (!outputCard) return;
    outputCard.classList.remove('success-flash');
    void outputCard.offsetWidth;
    outputCard.classList.add('success-flash');
  }

  function makeShortToken() {
    return Math.random().toString(36).slice(2, 8);
  }

  function baseShortUrl() {
    return `${location.origin}${location.pathname}`;
  }

  function getShortStore() {
    return readJson(SHORTLINKS_KEY, {});
  }

  function setShortStore(store) {
    writeJson(SHORTLINKS_KEY, store);
  }

  function incrementClicks(token) {
    if (!token) return;
    const store = getShortStore();
    if (!store[token]) return;
    store[token].clicks = (store[token].clicks || 0) + 1;
    setShortStore(store);
    if (clickCountEl && token === currentShortToken) {
      clickCountEl.textContent = `Clicks: ${String(store[token].clicks || 0)}`;
    }
  }

  function createShortLinkFor(waUrl) {
    const store = getShortStore();
    let token = makeShortToken();
    while (store[token]) token = makeShortToken();

    store[token] = {
      url: waUrl,
      clicks: 0,
      createdAt: Date.now()
    };
    setShortStore(store);
    currentShortToken = token;

    const shortUrl = `${baseShortUrl()}?s=${token}`;
    if (shortLinkInput) shortLinkInput.value = shortUrl;
    if (copyShortButton) copyShortButton.disabled = false;
    if (clickCountEl) clickCountEl.textContent = 'Tracking coming soon';
    return shortUrl;
  }

  function resolveShortLinkIfPresent() {
    const token = new URLSearchParams(location.search).get('s');
    if (!token) return;
    const store = getShortStore();
    const entry = store[token];
    if (!entry || !entry.url) return;
    entry.clicks = (entry.clicks || 0) + 1;
    store[token] = entry;
    setShortStore(store);
    window.location.replace(entry.url);
  }

  function getRecentNumbers() {
    return readJson(RECENTS_KEY, []);
  }

  function saveRecentNumber(dial, number) {
    const list = getRecentNumbers();
    const next = [{ dial, number }, ...list.filter((x) => !(x.dial === dial && x.number === number))].slice(0, 8);
    writeJson(RECENTS_KEY, next);
    renderRecentNumbers();
  }

  function renderRecentNumbers() {
    if (!recentNumbersEl) return;
    recentNumbersEl.innerHTML = '';
    const list = getRecentNumbers();
    if (recentEmptyEl) {
      recentEmptyEl.hidden = list.length > 0;
    }
    list.forEach((entry) => {
      const chip = document.createElement('button');
      chip.type = 'button';
      chip.className = 'recent-chip';
      chip.textContent = `+${entry.dial} ${entry.number}`;
      chip.addEventListener('click', () => {
        const country = COUNTRIES.find((c) => c.dial === entry.dial);
        if (country) selectCountry(country);
        phoneInput.value = entry.number;
        updateValidation();
      });
      recentNumbersEl.appendChild(chip);
    });
  }

  function updateOutputActions(waUrl) {
    currentWaUrl = waUrl;
    if (outputSection) {
      outputSection.hidden = false;
    }
    if (outputCard) {
      outputCard.classList.add('has-output');
    }
    if (openWhatsAppButton) {
      openWhatsAppButton.href = waUrl;
      openWhatsAppButton.classList.add('button-primary');
      openWhatsAppButton.classList.remove('button-secondary');
      openWhatsAppButton.classList.remove('is-disabled');
      openWhatsAppButton.removeAttribute('aria-disabled');
      openWhatsAppButton.removeAttribute('tabindex');
    }
    if (shareWhatsappButton) {
      shareWhatsappButton.href = waUrl;
      shareWhatsappButton.classList.remove('is-disabled');
      shareWhatsappButton.removeAttribute('aria-disabled');
      shareWhatsappButton.removeAttribute('tabindex');
    }
    if (downloadQrLink && qrImage) {
      downloadQrLink.href = qrImage.src;
      downloadQrLink.classList.remove('is-disabled');
      downloadQrLink.removeAttribute('aria-disabled');
      downloadQrLink.removeAttribute('tabindex');
    }
    if (shareQrButton) shareQrButton.disabled = false;
    if (copyLinkButton) copyLinkButton.disabled = false;
    if (shareCopyButton) shareCopyButton.disabled = false;
    if (qrImage) qrImage.classList.remove('is-empty');
    if (qrFrame) qrFrame.classList.remove('is-empty');
  }

  // Redirect if short link token is present.
  resolveShortLinkIfPresent();

  // Country selector interactions.
  phoneInput.addEventListener('input', () => {
    phoneTouched = true;
    updateValidation();
  });
  phoneInput.addEventListener('blur', () => {
    phoneTouched = true;
    updateValidation();
  });
  countryToggle.addEventListener('click', () => {
    const open = !countryPanel.hidden;
    countryPanel.hidden = open;
    countryToggle.setAttribute('aria-expanded', String(!open));
    if (!open) countrySearch.focus();
  });
  countrySearch.addEventListener('input', () => renderCountryList(countrySearch.value));
  document.addEventListener('click', (e) => {
    if (!countrySelectRoot.contains(e.target)) {
      countryPanel.hidden = true;
      countryToggle.setAttribute('aria-expanded', 'false');
    }
  });

  // Main generation flow.
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    submitAttempted = true;
    if (!updateValidation()) return;

    setLoading(true);

    const countryDigits = countryCodeDisplay.textContent.replace(/\D/g, '');
    const cleaned = cleanNumber(phoneInput.value);
    const full = countryDigits + cleaned;
    const message = encodeURIComponent(messageInput.value || '');
    const waUrl = `https://wa.me/${full}${message ? `?text=${message}` : ''}`;

    await new Promise((resolve) => setTimeout(resolve, 450));

    if (generatedLinkInput) generatedLinkInput.value = waUrl;
    if (qrImage) {
      const data = encodeURIComponent(waUrl);
      qrImage.src = `https://api.qrserver.com/v1/create-qr-code/?size=240x240&data=${data}`;
      qrImage.classList.remove('is-empty');
      if (qrFrame) qrFrame.classList.remove('is-empty');
    }

    createShortLinkFor(waUrl);
    updateOutputActions(waUrl);
    saveRecentNumber(countryDigits, cleaned);

    flashSuccess();
    showToast('Link generated');
    setLoading(false);
  });

  // Copy and share actions.
  if (copyLinkButton) {
    copyLinkButton.addEventListener('click', async () => {
      if (!generatedLinkInput || !generatedLinkInput.value) return;
      await copyText(generatedLinkInput.value);
      const originalText = copyLinkButton.textContent;
      copyLinkButton.textContent = 'Copied ✅';
      showToast('Copied ✅');
      setTimeout(() => {
        copyLinkButton.textContent = originalText;
      }, 1800);
    });
  }

  if (copyShortButton) {
    copyShortButton.addEventListener('click', async () => {
      if (!shortLinkInput || !shortLinkInput.value) return;
      await copyText(shortLinkInput.value);
      const originalText = copyShortButton.textContent;
      copyShortButton.textContent = 'Copied ✅';
      showToast('Short link copied ✅');
      setTimeout(() => {
        copyShortButton.textContent = originalText;
      }, 1800);
    });
  }

  if (shareCopyButton) {
    shareCopyButton.addEventListener('click', async () => {
      if (!generatedLinkInput || !generatedLinkInput.value) return;
      await copyText(generatedLinkInput.value);
      showToast('Copied ✅');
    });
  }

  if (shareQrButton) {
    shareQrButton.addEventListener('click', async () => {
      if (!qrImage || !qrImage.src) return;
      await copyText(qrImage.src);
      showToast('QR link copied ✅');
    });
  }

  if (openWhatsAppButton) {
    openWhatsAppButton.addEventListener('click', () => incrementClicks(currentShortToken));
  }
  if (shareWhatsappButton) {
    shareWhatsappButton.addEventListener('click', () => incrementClicks(currentShortToken));
  }

  // Initial render.
  renderCountryList();
  selectCountry(COUNTRIES[0]);
  renderRecentNumbers();
  if (copyShortButton) copyShortButton.disabled = !shortLinkInput || !shortLinkInput.value;
  if (shareCopyButton) shareCopyButton.disabled = !generatedLinkInput || !generatedLinkInput.value;
  if (shareWhatsappButton) {
    shareWhatsappButton.classList.add('is-disabled');
    shareWhatsappButton.setAttribute('aria-disabled', 'true');
    shareWhatsappButton.setAttribute('tabindex', '-1');
  }
  if (openWhatsAppButton) {
    openWhatsAppButton.classList.add('is-disabled');
    openWhatsAppButton.setAttribute('aria-disabled', 'true');
    openWhatsAppButton.setAttribute('tabindex', '-1');
  }
  if (downloadQrLink) {
    downloadQrLink.classList.add('is-disabled');
    downloadQrLink.setAttribute('aria-disabled', 'true');
    downloadQrLink.setAttribute('tabindex', '-1');
  }
  if (shareQrButton) shareQrButton.disabled = true;
  if (generatedLinkInput && generatedLinkInput.value) {
    updateOutputActions(generatedLinkInput.value);
  }
  if (qrImage && qrFrame && !currentWaUrl) {
    qrImage.classList.add('is-empty');
    qrFrame.classList.add('is-empty');
  }
  if (outputCard && !currentWaUrl) {
    outputCard.classList.remove('has-output');
  }
  if (clickCountEl && !currentShortToken) {
    clickCountEl.textContent = 'Tracking coming soon';
  }
  updateValidation();
})();
