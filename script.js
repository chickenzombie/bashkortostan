const filterButtons = document.querySelectorAll(".filter-tab");
const placeCards = document.querySelectorAll(".place-card");
const lightbox = document.querySelector("#imageLightbox");
const lightboxImage = lightbox.querySelector("img");
const lightboxCaption = lightbox.querySelector("figcaption");
const lightboxClose = lightbox.querySelector(".lightbox-close");
let lastFocusedImage = null;

filterButtons.forEach((button) => {
  button.addEventListener("click", () => {
    const filter = button.dataset.filter;

    filterButtons.forEach((item) => {
      const isCurrent = item === button;
      item.classList.toggle("is-active", isCurrent);
      item.setAttribute("aria-pressed", String(isCurrent));
    });

    placeCards.forEach((card) => {
      const tags = card.dataset.tags.split(" ");
      const shouldShow = filter === "all" || tags.includes(filter);
      card.classList.toggle("is-hidden", !shouldShow);
    });
  });
});

document.querySelectorAll(".place-image img").forEach((image) => {
  image.tabIndex = 0;
  image.setAttribute("role", "button");
  image.setAttribute("aria-label", `Открыть фотографию: ${image.alt}`);

  image.addEventListener("click", () => openLightbox(image));

  image.addEventListener("keydown", (event) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      openLightbox(image);
    }
  });

  image.addEventListener("error", () => {
    image.closest(".place-image").classList.add("has-image-error");
    image.alt = "Фотография временно недоступна";
  });
});

function getLargeImageUrl(src) {
  return src.includes("width=") ? src.replace(/([?&])width=\d+/, "$1width=2200") : src;
}

function openLightbox(image) {
  const placeTitle = image.closest(".place-card")?.querySelector("h3")?.textContent || image.alt;

  lastFocusedImage = image;
  lightboxImage.src = getLargeImageUrl(image.src);
  lightboxImage.alt = image.alt;
  lightboxCaption.textContent = placeTitle;
  lightbox.hidden = false;
  document.body.style.overflow = "hidden";
  lightboxClose.focus();
}

function closeLightbox() {
  lightbox.hidden = true;
  lightboxImage.src = "";
  document.body.style.overflow = "";
  lastFocusedImage?.focus();
}

lightboxClose.addEventListener("click", closeLightbox);

lightbox.addEventListener("click", (event) => {
  if (event.target === lightbox) {
    closeLightbox();
  }
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape" && !lightbox.hidden) {
    closeLightbox();
  }
});
