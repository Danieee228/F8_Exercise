// Data
const players = [
  {
    id: 1,
    name: "Hà Linh",
    age: 21,
    bio: "Giao diện trưởng thành nhưng hệ điều hành trẻ trâu. Đam mê mãnh liệt với việc lùng sục các quán cơm thố ngon trong thành phố.",
    image: "https://picsum.photos/id/1011/400/600",
  },
  {
    id: 2,
    name: "Bảo Ngọc",
    age: 25,
    bio: "Nhân viên văn phòng part-time, full-time đi ăn vặt. Yếu bóng vía, cực kỳ sợ ma nên xin đừng rủ đi xem phim kinh dị ở buổi hẹn đầu tiên.",
    image: "https://picsum.photos/id/1012/400/600",
  },
  {
    id: 3,
    name: "Minh Tuấn",
    age: 24,
    bio: "Fan MU chân chính. Trái tim dạo này hơi tổn thương vì bóng đá nên cần người an ủi. Hay thức khuya xem giải nhưng hứa sẽ reply tin nhắn nhanh.",
    image: "https://picsum.photos/id/1025/400/600",
  },
  {
    id: 4,
    name: "Hoàng Phong",
    age: 27,
    bio: "Kỹ sư phần mềm. Tính tình hơi khô khan nhưng bù lại được cái gõ phím 10 ngón cực nhanh. Cuối tuần thường xách giày ra sân đá bóng.",
    image: "https://picsum.photos/id/1062/400/600",
  },
  {
    id: 5,
    name: "Phương Trinh",
    age: 22,
    bio: "Sinh viên năm cuối. Hướng nội part-time, gu là những bộ phim có kịch bản tâm lý giật gân, bí ẩn lật kèo mỏi cổ.",
    image: "https://picsum.photos/id/1027/400/600",
  },
];

const liked = [];
const disliked = [];

const SWIPE_THRESHOLD = 50;
const FLY_DISTANCE = 1000;
const ROTATE_MULTIPLIER = 0.05;

const cardContainer = document.querySelector("#card-container");
const btnNope = document.querySelector(".nope");
const btnLike = document.querySelector(".like");

function initCards() {
  if (players.length === 0) {
    return (cardContainer.textContent = "Hết");
  }
  const playersReverse = players.slice().reverse();
  const cardReverse = playersReverse
    .map((playerReverse) => {
      return `
      <div class = "tender-card" data-id = ${playerReverse.id}>
        <img src="${playerReverse.image}" alt="${playerReverse.name}" class="card-image" draggable="false">
        <div class="card-overlay"></div>
        <div class="card-gradient"></div>
        <div class="card-info">
          <div class="card-name">${playerReverse.name} <span class="card-age">${playerReverse.age}</span></div>
          <div class="card-bio">${playerReverse.bio}</div>
        </div>
      </div>`;
    })
    .join("");
  cardContainer.innerHTML = cardReverse;

  const cards = document.querySelectorAll(".tender-card");

  cards.forEach((card) => {
    let isDragging = false;
    let startX = 0;
    let currentX = 0;
    let deltaX = 0;
    const getClientX = (event) => {
      return event.type.includes("mouse")
        ? event.clientX
        : event.touches[0].clientX;
    };
    const overlay = card.querySelector(".card-overlay");

    const startDrag = (event) => {
      if (event.type.includes("mouse")) {
        event.preventDefault();
      }
      isDragging = true;
      startX = getClientX(event);
      card.style.transition = "";
      document.addEventListener("mousemove", onMouseMove);
      document.addEventListener("touchmove", onMouseMove);
      document.addEventListener("mouseup", onMouseUp);
      document.addEventListener("touchend", onMouseUp);
    };
    card.addEventListener("mousedown", startDrag);
    card.addEventListener("touchstart", startDrag);

    const onMouseMove = (event) => {
      if (!isDragging) return;
      currentX = getClientX(event);
      deltaX = currentX - startX;
      const rotate = deltaX * ROTATE_MULTIPLIER;
      card.style.transform = `translate(calc(-50% + ${deltaX}px), -50%) rotate(${rotate}deg)`;

      const opacity = Math.min(Math.abs(deltaX) / 100, 0.5);
      if (deltaX > 0) {
        overlay.style.backgroundColor = "#1ce38f";
      } else {
        overlay.style.backgroundColor = "#fd5068";
      }
      overlay.style.opacity = opacity;
    };

    const onMouseUp = (event) => {
      if (!isDragging) return;
      isDragging = false;
      const cardIndex = parseInt(card.dataset.id);
      const currentCard = players.find((player) => player.id === cardIndex);
      if (deltaX >= SWIPE_THRESHOLD) {
        card.style.transform = `translate(calc(-50% + ${FLY_DISTANCE}px), -50%) rotate(30deg)`;
        card.style.transition = "transform 0.3s ease";
        liked.push(currentCard);
        card.addEventListener("transitionend", () => {
          card.remove();
          checkEmpty();
        });
      } else if (deltaX <= -SWIPE_THRESHOLD) {
        card.style.transition = "transform 0.3s ease";
        card.style.transform = `translate(calc(-50% - ${FLY_DISTANCE}px), -50%) rotate(-30deg)`;
        disliked.push(currentCard);
        card.addEventListener("transitionend", () => {
          card.remove();
          checkEmpty();
        });
      } else {
        card.style.transform = "";
        overlay.style.transition = "opacity 0.3s ease";
        overlay.style.opacity = 0;
      }
      document.removeEventListener("mousemove", onMouseMove);
      document.removeEventListener("mouseup", onMouseUp);
      document.removeEventListener("touchmove", onMouseMove);
      document.removeEventListener("touchend", onMouseUp);
    };
  });
}

function checkEmpty() {
  const remainingCards = cardContainer.querySelectorAll(".tender-card");

  if (remainingCards.length === 0) {
    cardContainer.innerHTML = `
        <div class="empty-state">
          <p class="empty-text">Hết người để quẹt rồi!</p>
          <button class="btn-reset">Quẹt lại từ đầu</button>
        </div>
      `;
    const btnReset = cardContainer.querySelector(".btn-reset");
    if (btnReset) {
      btnReset.addEventListener("click", () => {
        liked.length = 0;
        disliked.length = 0;
        initCards();
      });
    }
  }
}

function handleButtonClick(isLike) {
  const topCard = cardContainer.lastElementChild;
  if (!topCard || !topCard.classList.contains("tender-card")) return;
  const cardIndex = parseInt(topCard.dataset.id);
  const currentCard = players.find((player) => player.id === cardIndex);
  const overlay = topCard.querySelector(".card-overlay");
  topCard.style.transition = "transform 0.6s ease";
  overlay.style.transition = "";
  if (isLike) {
    topCard.style.transform = `translate(calc(-50% + ${FLY_DISTANCE}px), -50%) rotate(30deg)`;
    overlay.style.backgroundColor = "#1ce38f";
    overlay.style.opacity = 0.5;
    liked.push(currentCard);
  } else {
    topCard.style.transform = `translate(calc(-50% - ${FLY_DISTANCE}px), -50%) rotate(-30deg)`;
    overlay.style.backgroundColor = "#fd5068";
    overlay.style.opacity = 0.5;
    disliked.push(currentCard);
  }
  topCard.addEventListener("transitionend", () => {
    topCard.remove();
    checkEmpty();
  });
}
if (btnNope) btnNope.addEventListener("click", () => handleButtonClick(false));
if (btnLike) btnLike.addEventListener("click", () => handleButtonClick(true));

initCards();
