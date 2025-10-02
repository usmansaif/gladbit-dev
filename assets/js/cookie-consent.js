(function () {
    const CONSENT_KEY = 'gdpr_consent_v1';
    const COOKIE_NAME = 'gdpr_consent_v1';
    const COOKIE_EXPIRES_DAYS = 365;

    const popup = document.getElementById('cookiePopup');
    const acceptBtn = document.getElementById('btnAcceptAll');
    const manageBtn = document.getElementById('btnManage');
    const cookieSettingsBtn = document.getElementById('cookieSettingsOpen');

    const cookieModalEl = document.getElementById('cookieModal');
    const cookieModal = new bootstrap.Modal(cookieModalEl);
    const prefsForm = document.getElementById('prefsForm');
    const prefAnalytics = document.getElementById('prefAnalytics');
    const prefMarketing = document.getElementById('prefMarketing');
    const modalReject = document.getElementById('modalReject');

    function setCookie(name, value, days) {
        const d = new Date();
        d.setTime(d.getTime() + (days * 86400000));
        const expires = "expires=" + d.toUTCString();
        document.cookie = `${name}=${encodeURIComponent(value)}; ${expires}; path=/; SameSite=Lax`;
    }
    function getCookie(name) {
        const cname = name + "=";
        const ca = decodeURIComponent(document.cookie).split(';');
        for (let c of ca) {
            c = c.trim();
            if (c.indexOf(cname) === 0) return c.substring(cname.length);
        }
        return "";
    }
    function saveConsent(consent) {
        localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
        setCookie(COOKIE_NAME, JSON.stringify(consent), COOKIE_EXPIRES_DAYS);
        cookieSettingsBtn.style.display = 'block';
    }
    function readConsent() {
        try {
            return JSON.parse(localStorage.getItem(CONSENT_KEY) || getCookie(COOKIE_NAME) || null);
        } catch {
            return null;
        }
    }
    function hidePopup() { popup.style.display = 'none'; }
    function showPopup() { popup.style.display = 'block'; }

    function applyConsent(consent) {
        console.log("Applying consent:", consent);

        // ---- Load Google Analytics only if Analytics is allowed ----
        if (consent.analytics) {
            if (!window.gaLoaded) {
                // Inject GA script
                const gaScript = document.createElement("script");
                gaScript.async = true;
                gaScript.src = "https://www.googletagmanager.com/gtag/js?id=G-8MSCP6BYJR";
                document.head.appendChild(gaScript);

                gaScript.onload = () => {
                    window.dataLayer = window.dataLayer || [];
                    function gtag(){ dataLayer.push(arguments); }
                    window.gtag = gtag;

                    gtag('js', new Date());
                    gtag('config', 'G-8MSCP6BYJR');
                };

                window.gaLoaded = true; // prevent duplicate loading
            }
        } else {
            // If rejected: optionally remove GA cookies
            // Example: clear _ga cookies if needed
            document.cookie = "_ga=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
            document.cookie = "_ga_8MSCP6BYJR=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
        }

        // ---- Marketing logic (placeholder) ----
        if (consent.marketing) {
            // Load marketing scripts here
        }
    }

    acceptBtn.addEventListener('click', () => {
        const consent = { necessary: true, analytics: true, marketing: true, ts: Date.now() };
        saveConsent(consent); applyConsent(consent); hidePopup();
    });
    manageBtn.addEventListener('click', () => {
        const c = readConsent();
        prefAnalytics.checked = c ? !!c.analytics : false;
        prefMarketing.checked = c ? !!c.marketing : false;
        cookieModal.show();
    });
    cookieSettingsBtn.addEventListener('click', () => {
        const c = readConsent();
        prefAnalytics.checked = c ? !!c.analytics : false;
        prefMarketing.checked = c ? !!c.marketing : false;
        cookieModal.show();
    });
    prefsForm.addEventListener('submit', e => {
        e.preventDefault();
        const consent = {
            necessary: true,
            analytics: !!prefAnalytics.checked,
            marketing: !!prefMarketing.checked,
            ts: Date.now()
        };
        saveConsent(consent); applyConsent(consent);
        cookieModal.hide(); hidePopup();
    });
    modalReject.addEventListener('click', () => {
        const consent = { necessary: true, analytics: false, marketing: false, ts: Date.now() };
        saveConsent(consent); applyConsent(consent);
        cookieModal.hide(); hidePopup();
    });

    (function init() {
        const consent = readConsent();
        if (consent) { applyConsent(consent); hidePopup(); cookieSettingsBtn.style.display = 'block'; }
        else { showPopup(); cookieSettingsBtn.style.display = 'none'; }
    })();

    window.gdprClearConsent = function () {
        localStorage.removeItem(CONSENT_KEY);
        setCookie(COOKIE_NAME, '', -1);
        showPopup();
        cookieSettingsBtn.style.display = 'none';
    };
})();
