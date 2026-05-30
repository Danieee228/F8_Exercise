function slideShow(containerSelector) {
  // Initialize the slideshow
  const container = document.querySelector(containerSelector);
  if (!container) return;
  const track = container.querySelector(".js-track");
  const slides = container.querySelectorAll(".js-slide");
  const prevBtn = container.querySelector(".js-prev-btn");
  const nextBtn = container.querySelector(".js-next-btn");
  const pagination = container.querySelector(".js-pagination");
  let totalSlides = slides.length;
  let currentIndex = 1;
  let oldRealIndex = 0;
  if (totalSlides === 0) return;
  if (totalSlides === 1) {
    prevBtn.style.display = "none";
    nextBtn.style.display = "none";
    return;
  }
  // Clone first and last slide for infinite effect
  track.appendChild(slides[0].cloneNode(true));
  track.insertBefore(slides[totalSlides - 1].cloneNode(true), slides[0]);

  // Create pagination dots
  for (let i = 0; i < totalSlides; i++) {
    const dot = document.createElement("div");
    if (i === 0) dot.classList.add("active");
    dot.classList.add("dot");
    pagination.appendChild(dot);
    dot.dataset.index = i;
  }
  track.style.transform = `translateX(-${currentIndex * 100}%)`;

  let isAnimating = false;
  function updateSlide() {
    track.style.transition = "transform 0.5s ease";
    track.style.transform = `translateX(-${currentIndex * 100}%)`;
    // Update pagination
    const dots = pagination.querySelectorAll(".dot");
    dots.forEach((dot) => dot.classList.remove("active"));
    let activeDotIndex = currentIndex - 1;
    if (currentIndex === 0) activeDotIndex = totalSlides - 1;
    if (currentIndex === totalSlides + 1) activeDotIndex = 0;
    dots[activeDotIndex].classList.add("active");
  }
  // Handle update slide position and pagination
  nextBtn.addEventListener("click", function () {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex++;
    updateSlide();
  });

  // Handle update slide position and pagination
  prevBtn.addEventListener("click", function () {
    if (isAnimating) return;
    isAnimating = true;
    currentIndex--;
    updateSlide();
  });

  // Handle transition end for infinite effect
  pagination.addEventListener("click", function (event) {
    if (isAnimating) return;
    if (event.target.classList.contains("dot")) {
      const targetIndex = parseInt(event.target.dataset.index);
      if (targetIndex + 1 === currentIndex) return;
      isAnimating = true;
      currentIndex = targetIndex + 1;
      updateSlide();
    }
  });

  // Handle transition end for infinite effect
  track.addEventListener("transitionend", function () {
    isAnimating = false;
    function resetTransition() {
      track.style.transition = "none";
      track.style.transform = `translateX(-${currentIndex * 100}%)`;
    }
    if (currentIndex === 0) {
      currentIndex = totalSlides;
      resetTransition();
    }
    if (currentIndex === totalSlides + 1) {
      currentIndex = 1;
      resetTransition();
    }
    const currentRealIndex = currentIndex - 1;
    if (oldRealIndex !== currentRealIndex) {
      const slideChangeEvent = new CustomEvent("slideshow:change", {
        detail: {
          old: slides[oldRealIndex],
          current: slides[currentRealIndex],
        },
      });
      document.dispatchEvent(slideChangeEvent);
      oldRealIndex = currentRealIndex;
    }
  });

  // Handle autoplay
  let autoplayTimer = null;
  function startAutoplay() {
    autoplayTimer = setInterval(() => {
      nextBtn.click();
    }, 3000);
  }

  // Handle stop autoplay
  function stopAutoplay() {
    clearInterval(autoplayTimer);
  }

  // Stop autoplay when mouse enter and start autoplay when mouse leave
  container.addEventListener("mouseenter", stopAutoplay);
  container.addEventListener("mouseleave", startAutoplay);

  startAutoplay();
}

slideShow(".slideshow-container");
document.addEventListener("slideshow:change", function (event) {
  console.log("old:", event.detail.old);
  console.log("current:", event.detail.current);
});
