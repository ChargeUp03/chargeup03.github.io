// Replace this with your real Super Mario Maker 2 Maker ID
const MAKER_ID = "XXX-XXX-XXX";

/* ---------- Toast + Maker ID copy ---------- */

const toast = document.createElement("div");
toast.className = "toast";
toast.setAttribute("role", "status");
toast.setAttribute("aria-live", "polite");
document.body.appendChild(toast);

let toastTimer;
function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove("show"), 2200);
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for browsers or contexts where the Clipboard API isn't available
    const area = document.createElement("textarea");
    area.value = text;
    area.style.position = "fixed";
    area.style.opacity = "0";
    document.body.appendChild(area);
    area.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { ok = false; }
    area.remove();
    return ok;
  }
}

document.querySelectorAll("[data-copy-maker-id]").forEach((el) => {
  el.addEventListener("click", async (event) => {
    event.preventDefault();
    const ok = await copyText(MAKER_ID);
    showToast(ok ? "Maker ID copied" : "Couldn't copy. Your Maker ID is " + MAKER_ID);
  });
});

/* ---------- Image lightbox (in-site fullscreen preview) ---------- */

const lightbox = document.createElement("div");
lightbox.className = "lightbox";
lightbox.hidden = true;
lightbox.setAttribute("role", "dialog");
lightbox.setAttribute("aria-modal", "true");
lightbox.setAttribute("aria-label", "Image preview");
lightbox.innerHTML =
  '<button class="lightbox-close" type="button" aria-label="Close preview">' +
  '<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>' +
  '</button><img alt="">';
document.body.appendChild(lightbox);

const lightboxImg = lightbox.querySelector("img");
const closeBtn = lightbox.querySelector(".lightbox-close");
let opener = null;

function openLightbox(img, trigger) {
  lightboxImg.src = img.currentSrc || img.src;
  lightboxImg.alt = img.alt;
  opener = trigger;
  lightbox.hidden = false;
  document.body.classList.add("lb-open");
  closeBtn.focus();
}

function closeLightbox() {
  if (lightbox.hidden) return;
  lightbox.hidden = true;
  lightboxImg.removeAttribute("src");
  document.body.classList.remove("lb-open");
  if (opener) opener.focus();
}

document.querySelectorAll(".media").forEach((media) => {
  const img = media.querySelector("img");
  if (!img) return;
  media.tabIndex = 0;
  media.setAttribute("role", "button");
  media.setAttribute("aria-label", "View larger: " + (img.alt || "image"));
  media.addEventListener("click", (event) => {
    event.preventDefault();
    openLightbox(img, media);
  });
  media.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(img, media);
    }
  });
});

closeBtn.addEventListener("click", closeLightbox);
lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) closeLightbox();
});
document.addEventListener("keydown", (event) => {
  if (lightbox.hidden) return;
  if (event.key === "Escape") closeLightbox();
  if (event.key === "Tab") {
    event.preventDefault();
    closeBtn.focus();
  }
});
