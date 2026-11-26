// Asasliza/script.js
document.addEventListener("DOMContentLoaded", async () => {
  if (window.AOS) {
    AOS.init({ duration: 800, once: true });
  }

  // ==========================================
  // 1. BUKA SAMPUL & KONTROL AUDIO (LOOP INTRO)
  // ==========================================
  const coverSection = document.getElementById("cover-section");
  const openBtn = document.getElementById("open-invitation");
  const mainBody = document.getElementById("main-body");
  const bgMusic = document.getElementById("bg-music");
  const audioToggle = document.getElementById("audio-toggle");
  const audioIcon = document.getElementById("audio-icon");
  const INTRO_START_SEC = 0;
  const INTRO_END_SEC = 33.3;
  let isPlaying = false;

  if (openBtn && coverSection && mainBody && bgMusic && audioToggle && audioIcon) {
    bgMusic.addEventListener("error", () => {
      const fallbackSrc = bgMusic.getAttribute("data-fallback-src");
      if (fallbackSrc && bgMusic.src !== fallbackSrc) {
        bgMusic.src = fallbackSrc;
        bgMusic.load();
      }
    });

    bgMusic.addEventListener("timeupdate", () => {
      if (bgMusic.currentTime >= INTRO_END_SEC) {
        bgMusic.currentTime = INTRO_START_SEC;
        if (isPlaying) {
          bgMusic.play().catch(() => {});
        }
      }
    });

    openBtn.addEventListener("click", () => {
      coverSection.classList.add("cover-hidden");
      mainBody.classList.remove("overflow-hidden");
      audioToggle.classList.remove("hidden");

      bgMusic.currentTime = INTRO_START_SEC;
      bgMusic
        .play()
        .then(() => {
          isPlaying = true;
          audioIcon.textContent = "🔊";
          audioToggle.classList.add("audio-spinning");
        })
        .catch((err) => {
          console.warn("Autoplay dicegah browser:", err);
        });
    });

    audioToggle.addEventListener("click", () => {
      if (isPlaying) {
        bgMusic.pause();
        audioIcon.textContent = "🔇";
        audioToggle.classList.remove("audio-spinning");
      } else {
        if (bgMusic.currentTime >= INTRO_END_SEC) {
          bgMusic.currentTime = INTRO_START_SEC;
        }
        bgMusic.play();
        audioIcon.textContent = "🔊";
        audioToggle.classList.add("audio-spinning");
      }
      isPlaying = !isPlaying;
    });
  }

  // ==========================================
  // 2. COUNTDOWN TIMER & GOOGLE CALENDAR
  // ==========================================
  const targetDate = new Date("2026-12-20T18:30:00").getTime();

  const timerInterval = setInterval(() => {
    const now = new Date().getTime();
    const distance = targetDate - now;

    if (distance < 0) {
      clearInterval(timerInterval);
      return;
    }

    const days = Math.floor(distance / (1000 * 60 * 60 * 24));
    const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((distance % (1000 * 60)) / 1000);

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if (daysEl) daysEl.textContent = String(days).padStart(2, "0");
    if (hoursEl) hoursEl.textContent = String(hours).padStart(2, "0");
    if (minutesEl) minutesEl.textContent = String(minutes).padStart(2, "0");
    if (secondsEl) secondsEl.textContent = String(seconds).padStart(2, "0");
  }, 1000);

  const calendarLink = document.getElementById("calendar-link");
  if (calendarLink) {
    const eventTitle = encodeURIComponent("Sweet Seventeen - Liza Aulia Hanafi");
    const eventDetails = encodeURIComponent("Acara perayaan ulang tahun Liza Aulia Hanafi.");
    const eventLocation = encodeURIComponent(
      "Rumah Liza, Kp. Cilalung (https://maps.app.goo.gl/i2Bq2WuccV8qS2fD6?g_st=aw)"
    );
    const eventDates = "20261220T113000Z/20261220T150000Z";
    calendarLink.href =
      `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${eventTitle}&dates=${eventDates}&details=${eventDetails}&location=${eventLocation}`;
  }

  // ==========================================
  // 3. COPY TO CLIPBOARD (AMPLOP DIGITAL)
  // ==========================================
  const copyBtn = document.getElementById("copy-btn");
  const accountNumberEl = document.getElementById("account-number");
  const copyToast = document.getElementById("copy-toast");

  if (copyBtn && accountNumberEl && copyToast) {
    copyBtn.addEventListener("click", () => {
      const accountNumber = accountNumberEl.textContent.trim();
      navigator.clipboard.writeText(accountNumber).then(() => {
        copyToast.classList.remove("hidden");
        setTimeout(() => copyToast.classList.add("hidden"), 3000);
      });
    });
  }

  // ==========================================
  // 4. LINK UNDANGAN, GITHUB, WA ADMIN & RSVP
  // ==========================================
  const INVITATION_BASE_URL = "https://liza-studie.github.io/asasliza/";
  const GITHUB_REPO_URL = "https://github.com/Liza-studie/asasliza";
  const ADMIN_WHATSAPP_NUMBER = "6285894724746";
  const STORAGE_KEY = "liza_sweet17_guestbook";

  function buildGuestInviteUrl(guestName) {
    const cleanName = String(guestName || "").trim();
    if (!cleanName) return INVITATION_BASE_URL;
    return `${INVITATION_BASE_URL}?to=${encodeURIComponent(cleanName)}`;
  }
  window.buildGuestInviteUrl = buildGuestInviteUrl;

  const githubLinkEl = document.getElementById("github-repo-link");
  if (githubLinkEl) {
    githubLinkEl.href = GITHUB_REPO_URL;
  }

  function loadLocalEntries() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const parsed = raw ? JSON.parse(raw) : [];
      return Array.isArray(parsed) ? parsed : [];
    } catch {
      return [];
    }
  }

  function saveLocalEntries(list) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch {
      // Abaikan jika localStorage tidak tersedia
    }
  }

  function buildAdminWhatsAppUrl({ name, status, message }) {
    const cleanPhone = ADMIN_WHATSAPP_NUMBER.replace(/[^0-9]/g, "");
    const text = [
      "🎉 *Konfirmasi Kehadiran Sweet Seventeen* 🎉",
      "Acara: *Liza Aulia Hanafi*",
      "",
      "Halo Admin, ada tamu yang baru saja mengisi konfirmasi undangan:",
      `• *Nama:* ${name}`,
      `• *Status:* ${status}`,
      `• *Ucapan & Doa:* "${message}"`,
      "",
      "Terima kasih banyak atas perhatian dan doanya! 🙏✨",
    ].join("\n");

    return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(text)}`;
  }

  const rsvpForm = document.getElementById("rsvp-form");
  const submitBtn = rsvpForm ? rsvpForm.querySelector('button[type="submit"]') : null;
  const guestbookList = document.getElementById("guestbook-list");
  const guestNameEl = document.getElementById("guest-name");
  const guestIdInput = document.getElementById("rsvp-guest-id");
  const guestNameInput = document.getElementById("rsvp-name");

  let entries = [];

  const urlParams = new URLSearchParams(window.location.search);
  const urlGuestTo = (urlParams.get("to") || "").trim();
  const urlGuestId = (urlParams.get("id") || "").trim();

  if (urlGuestId && guestIdInput) {
    guestIdInput.value = urlGuestId;
  }
  if (urlGuestTo && guestNameEl) {
    guestNameEl.textContent = urlGuestTo;
    if (guestNameInput && !guestNameInput.value) {
      guestNameInput.value = urlGuestTo;
    }
  }

  function escapeHTML(str) {
    return String(str).replace(/[&<>'"]/g, (tag) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      "'": "&#39;",
      '"': "&quot;",
    }[tag]));
  }

  function renderGuestbook(items) {
    if (!guestbookList) return;
    guestbookList.innerHTML = "";

    if (!items || items.length === 0) {
      guestbookList.innerHTML = `<p class="text-center text-xs text-slate-400">Belum ada ucapan. Jadilah yang pertama!</p>`;
      return;
    }

    items.forEach((item) => {
      const badgeColor =
        item.status === "Hadir"
          ? "bg-emerald-100 text-emerald-700"
          : "bg-rose-100 text-rose-700";

      const card = document.createElement("div");
      card.className = "theme-card p-4 rounded-2xl space-y-1";
      card.innerHTML = `
        <div class="flex items-center justify-between gap-2 flex-wrap">
          <span class="font-bold text-sm text-slate-800">${escapeHTML(item.name)}</span>
          <span class="text-[11px] font-semibold px-2.5 py-0.5 rounded-full shrink-0 ${badgeColor}">${escapeHTML(item.status)}</span>
        </div>
        <p class="text-xs text-slate-600 leading-relaxed">${escapeHTML(item.message)}</p>
      `;
      guestbookList.appendChild(card);
    });
  }

  async function loadInitialRsvp() {
    const isGitHubPages = window.location.hostname.endsWith("github.io");
    if (isGitHubPages) {
      entries = loadLocalEntries();
      renderGuestbook(entries);
      return;
    }

    try {
      const queryString = window.location.search || "";
      const res = await fetch(`rsvp.php${queryString}`);
      if (!res.ok) {
        throw new Error(`HTTP ${res.status}`);
      }
      const text = await res.text();
      const data = JSON.parse(text);

      if (data && data.ok) {
        if (data.guest && data.guest.name && guestNameEl) {
          guestNameEl.textContent = data.guest.name;
          if (data.guest.name !== "Tamu Undangan" && guestNameInput && !guestNameInput.value) {
            guestNameInput.value = data.guest.name;
          }
        }
        if (data.guest && data.guest.id && guestIdInput) {
          guestIdInput.value = data.guest.id;
        }
        entries = Array.isArray(data.entries) ? data.entries : [];
      }
    } catch (err) {
      console.warn("Mode fallback tanpa rsvp.php:", err.message);
      entries = loadLocalEntries();
    }
    renderGuestbook(entries);
  }

  if (rsvpForm && submitBtn) {
    rsvpForm.addEventListener("submit", async (e) => {
      e.preventDefault();

      const payload = {
        guest_id: guestIdInput ? guestIdInput.value.trim() || null : null,
        name: guestNameInput ? guestNameInput.value.trim() : "",
        status: document.getElementById("rsvp-status").value,
        message: document.getElementById("rsvp-message").value.trim(),
      };

      submitBtn.disabled = true;
      submitBtn.textContent = "Mengirim...";

      const isGitHubPages = window.location.hostname.endsWith("github.io");

      try {
        let added = false;

        if (!isGitHubPages) {
          try {
            const res = await fetch("rsvp.php", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify(payload),
            });
            const text = await res.text();
            const result = JSON.parse(text);

            if (res.ok && result && result.ok && result.entry) {
              entries.unshift(result.entry);
              added = true;
            }
          } catch {
            // Jika rsvp.php tidak tersedia / bukan JSON, lanjut ke fallback lokal
          }
        }

        if (!added) {
          entries.unshift({
            name: payload.name,
            status: payload.status,
            message: payload.message,
          });
          saveLocalEntries(entries);
        }

        renderGuestbook(entries);
        document.getElementById("rsvp-message").value = "";

        if (payload.status === "Hadir" && ADMIN_WHATSAPP_NUMBER.replace(/[^0-9]/g, "")) {
          const waUrl = buildAdminWhatsAppUrl(payload);
          window.open(waUrl, "_blank", "noopener,noreferrer");
        }
      } catch (err) {
        console.error(err);
        alert(err.message || "Terjadi kendala saat mengirim ucapan.");
      } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = "Kirim Ucapan";
      }
    });
  }

  // ==========================================
  // 5. PREVIEW FOTO SAAT DIPENCET (LIGHTBOX)
  // ==========================================
  const galleryImgs = document.querySelectorAll(".gallery-img");
  const photoModal = document.getElementById("photo-modal");
  const photoModalImg = document.getElementById("photo-modal-img");
  const photoModalCaption = document.getElementById("photo-modal-caption");
  const closePhotoModalBtn = document.getElementById("close-photo-modal");

  function openPhotoModal(imgEl) {
    if (!photoModal || !photoModalImg || !imgEl) return;
    photoModalImg.src = imgEl.currentSrc || imgEl.src;
    photoModalImg.alt = imgEl.alt || "Foto Galeri";
    if (photoModalCaption) {
      photoModalCaption.textContent = imgEl.alt || "";
    }
    photoModal.classList.remove("hidden");
    photoModal.classList.add("flex");
  }

  function closePhotoModal() {
    if (!photoModal || !photoModalImg) return;
    photoModal.classList.add("hidden");
    photoModal.classList.remove("flex");
    photoModalImg.src = "";
  }

  galleryImgs.forEach((img) => {
    img.addEventListener("click", () => openPhotoModal(img));
  });

  if (closePhotoModalBtn) {
    closePhotoModalBtn.addEventListener("click", closePhotoModal);
  }

  if (photoModal) {
    photoModal.addEventListener("click", (e) => {
      if (e.target === photoModal) {
        closePhotoModal();
      }
    });
  }

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && photoModal && !photoModal.classList.contains("hidden")) {
      closePhotoModal();
    }
  });

  await loadInitialRsvp();
});