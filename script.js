/* ───────────────────────────────────────────────
   ONYX Landing — Script
   ─────────────────────────────────────────────── */

(function () {
    'use strict';

    // ─── GitHub Release Config ───
    const GITHUB_REPO = 'Onyx-Void-Labs/onyx';
    // Fallback download links (hardcoded for pre-release tags)
    const FALLBACK_TAG = 'v0.0.2-alpha';
    const FALLBACK_VERSION = '0.0.2';
    const FALLBACK_DOWNLOADS = {
        windows: `https://github.com/${GITHUB_REPO}/releases/download/${FALLBACK_TAG}/onyx_${FALLBACK_VERSION}_x64-setup.exe`,
        mac_arm: `https://github.com/${GITHUB_REPO}/releases/download/${FALLBACK_TAG}/onyx_${FALLBACK_VERSION}_aarch64.dmg`,
        mac_intel: `https://github.com/${GITHUB_REPO}/releases/download/${FALLBACK_TAG}/onyx_${FALLBACK_VERSION}_aarch64.dmg`,
        linux_deb: `https://github.com/${GITHUB_REPO}/releases/download/${FALLBACK_TAG}/onyx_${FALLBACK_VERSION}_amd64.deb`,
        linux_appimage: `https://github.com/${GITHUB_REPO}/releases/download/${FALLBACK_TAG}/onyx_${FALLBACK_VERSION}_amd64.AppImage`,
    };

    let downloadLinks = { ...FALLBACK_DOWNLOADS };

    // ─── OS Detection ───
    function detectOS() {
        const ua = navigator.userAgent.toLowerCase();
        const platform = navigator.platform?.toLowerCase() || '';

        if (ua.includes('win')) return 'windows';
        if (ua.includes('mac') || platform.includes('mac')) return 'mac';
        if (ua.includes('linux') || ua.includes('x11')) return 'linux';
        if (ua.includes('android')) return 'android';
        if (ua.includes('iphone') || ua.includes('ipad')) return 'ios';
        return 'windows'; // default
    }

    function setupDownloads() {
        const os = detectOS();
        const btn = document.getElementById('downloadBtn');
        const osName = document.getElementById('osName');
        const macLink = document.getElementById('macLink');
        const linuxLink = document.getElementById('linuxLink');

        const osLabels = {
            windows: 'Windows',
            mac: 'macOS',
            linux: 'Linux',
            android: 'Android',
            ios: 'iOS',
        };

        if (osName) osName.textContent = osLabels[os] || 'Windows';

        // Set primary download link
        if (btn) {
            switch (os) {
                case 'windows':
                    btn.href = downloadLinks.windows;
                    break;
                case 'mac':
                    btn.href = downloadLinks.mac_arm;
                    break;
                case 'linux':
                    btn.href = downloadLinks.linux_appimage;
                    break;
                default:
                    btn.href = `https://github.com/${GITHUB_REPO}/releases`;
            }
        }

        // Set alternate platform links
        if (macLink) {
            if (os === 'mac') {
                macLink.textContent = 'Windows';
                macLink.href = downloadLinks.windows;
            } else {
                macLink.href = downloadLinks.mac_arm;
            }
        }

        if (linuxLink) {
            if (os === 'linux') {
                linuxLink.textContent = 'Windows';
                linuxLink.href = downloadLinks.windows;
            } else {
                linuxLink.href = downloadLinks.linux_appimage;
            }
        }
    }

    // ─── Fetch Latest Release from GitHub ───
    async function fetchLatestRelease() {
        try {
            // Use /releases (not /latest) to include pre-releases
            const res = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
                headers: { 'Accept': 'application/vnd.github.v3+json' }
            });
            if (!res.ok) return;

            const releases = await res.json();
            if (!releases.length) return;

            const latest = releases[0];
            const assets = latest.assets || [];

            for (const asset of assets) {
                const name = asset.name.toLowerCase();
                if (name.endsWith('-setup.exe') || name.endsWith('.msi')) {
                    downloadLinks.windows = asset.browser_download_url;
                } else if (name.endsWith('aarch64.dmg')) {
                    downloadLinks.mac_arm = asset.browser_download_url;
                } else if (name.endsWith('.dmg') && !name.includes('aarch64')) {
                    downloadLinks.mac_intel = asset.browser_download_url;
                } else if (name.endsWith('.appimage')) {
                    downloadLinks.linux_appimage = asset.browser_download_url;
                } else if (name.endsWith('.deb')) {
                    downloadLinks.linux_deb = asset.browser_download_url;
                }
            }

            // Re-apply with fetched links
            setupDownloads();
        } catch (e) {
            // Silently fall back to hardcoded links
        }
    }

    // ─── Scroll Reveal ───
    function setupReveal() {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                        observer.unobserve(entry.target);
                    }
                });
            },
            { threshold: 0.1, rootMargin: '0px 0px -40px 0px' }
        );

        document.querySelectorAll('.reveal').forEach((el) => observer.observe(el));
    }

    // ─── Nav Scroll Effect ───
    function setupNav() {
        const nav = document.getElementById('nav');
        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    nav.classList.toggle('scrolled', window.scrollY > 20);
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ─── Mobile Nav Toggle ───
    function setupMobileNav() {
        const toggle = document.getElementById('navToggle');
        const links = document.getElementById('navLinks');

        if (toggle && links) {
            toggle.addEventListener('click', () => {
                links.classList.toggle('open');
                toggle.classList.toggle('active');
            });

            // Close on link click
            links.querySelectorAll('a').forEach((a) => {
                a.addEventListener('click', () => {
                    links.classList.remove('open');
                    toggle.classList.remove('active');
                });
            });
        }
    }

    // ─── App Preview Tab Switching ───
    function setupPreviewTabs() {
        const tabs = document.querySelectorAll('.pw-tab');
        tabs.forEach((tab) => {
            tab.addEventListener('click', () => {
                tabs.forEach((t) => t.classList.remove('active'));
                tab.classList.add('active');
            });
        });
    }

    // ─── Smooth Anchor Scroll ───
    function setupSmoothScroll() {
        document.querySelectorAll('a[href^="#"]').forEach((a) => {
            a.addEventListener('click', (e) => {
                const target = document.querySelector(a.getAttribute('href'));
                if (target) {
                    e.preventDefault();
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
    }

    // ─── Init ───
    document.addEventListener('DOMContentLoaded', () => {
        setupDownloads();
        fetchLatestRelease();
        setupReveal();
        setupNav();
        setupMobileNav();
        setupPreviewTabs();
        setupSmoothScroll();
    });
})();
