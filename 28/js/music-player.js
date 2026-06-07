const songs = [
  {
    id: 1,
    title: "Shawty",
    artist: "VSOUL, Obito",
    audio: "../asset/audio/SHAWTY-VSOUL-OBITO-REMIX.m4a",
    thumb: "../asset/image/thumbs/shawty.jpg",
  },
  {
    id: 2,
    title: "Ok Nah Nah",
    artist: "$ativa, Buford ",
    audio: "../asset/audio/OK-NAH-NAH-ft-BUFORD.m4a",
    thumb: "../asset/image/thumbs/ok-nah-nah.jpg",
  },
  {
    id: 3,
    title: "Roi Mot Ngay",
    artist: "Dewie",
    audio: "../asset/audio/Roi-Mot-Ngay-Dewie.m4a",
    thumb: "../asset/image/thumbs/roi-mot-ngay.jpg",
  },
  {
    id: 4,
    title: "Chẳng tin vào tình yêu",
    artist: "RHYDER, Coolkid",
    audio: "../asset/audio/CHANG-TIN-VAO-TINH-YEU-RHYDER-ft-COOLKID.m4a",
    thumb: "../asset/image/thumbs/chang-tin-vao-tinh-yeu.jpg",
  },
];

const cdThumb = document.querySelector(".js-cd-thumb");
const titleElement = document.querySelector(".js-title");
const artistElement = document.querySelector(".js-artist");
const playListElement = document.querySelector(".js-playlist");
const togglePlayBtn = document.querySelector(".js-play-btn");
const audioElement = document.querySelector("#audio");
const nextBtn = document.querySelector(".js-next-btn");
const prevBtn = document.querySelector(".js-prev-btn");
const progress = document.querySelector(".js-progress");
const currentTimeElement = document.querySelector(".js-current-time");
const durationElement = document.querySelector(".js-duration");
const shuffleBtn = document.querySelector(".js-shuffle-btn");
const repeatBtn = document.querySelector(".js-repeat-btn");
const volumeBar = document.querySelector(".js-volume");
const volumeIcon = document.querySelector(".js-volume-icon");

let currentIndex = 0;
let isPlaying = false;
let isRandom = false;
let isRepeat = false;

function renderPlaylist() {
  if (songs.length === 0) return;

  const html = songs
    .map((song, index) => {
      return `
  <div class="track ${index === currentIndex ? "track--active" : ""} js-track-item" data-index="${index}">
    <div class="track__thumb">
    <img
      src="${song.thumb}"
      alt="Track"
    />
    </div>
    <div class="track__body">
      <h3 class="track__title">${song.title}</h3>
      <p class="track__artist">${song.artist}</p>
    </div>
    <div class="track__option">
      <i class="fas fa-ellipsis-h"></i>
    </div>
  </div>`;
    })
    .join("");
  playListElement.innerHTML = html;
}

function loadCurrentSong() {
  if (songs.length === 0) return;

  const currentSong = songs[currentIndex];
  titleElement.textContent = currentSong.title;
  artistElement.textContent = currentSong.artist;
  cdThumb.src = currentSong.thumb;
  audioElement.src = currentSong.audio;
}

togglePlayBtn.addEventListener("click", (event) => {
  if (isPlaying) {
    audioElement.pause();
    isPlaying = false;
    togglePlayBtn.classList.remove("player__btn--playing");
  } else {
    audioElement.play();
    isPlaying = true;
    togglePlayBtn.classList.add("player__btn--playing");
  }
});

document.addEventListener("keydown", (event) => {
  if (event.code === "Space") {
    event.preventDefault();
    togglePlayBtn.click();
  }
});

nextBtn.addEventListener("click", (event) => {
  if (isRandom) {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * songs.length);
    } while (newIndex === currentIndex);
    currentIndex = newIndex;
  } else {
    currentIndex = (currentIndex + 1) % songs.length;
  }
  loadCurrentSong();
  updateActiveTrack();
  if (isPlaying) {
    audioElement.play();
  }
});

prevBtn.addEventListener("click", (event) => {
  if (audioElement.currentTime > 3) {
    audioElement.currentTime = 0;
  } else {
    currentIndex = (currentIndex - 1 + songs.length) % songs.length;
    loadCurrentSong();
    updateActiveTrack();
  }
  if (isPlaying) {
    audioElement.play();
  }
});

audioElement.addEventListener("timeupdate", (event) => {
  if (audioElement.duration) {
    const progressPercent = Math.floor(
      (audioElement.currentTime / audioElement.duration) * 100,
    );
    progress.value = progressPercent;
    progress.style.setProperty("--progress-percent", `${progressPercent}%`);
    currentTimeElement.textContent = formatTime(audioElement.currentTime);
  }
});

function formatTime(totalSeconds) {
  const minutes = Math.floor(totalSeconds / 60);
  const seconds = Math.floor(totalSeconds % 60);
  return `${minutes}:${String(seconds).padStart(2, "0")} `;
}

audioElement.addEventListener("loadedmetadata", (event) => {
  durationElement.textContent = formatTime(audioElement.duration);
});

progress.addEventListener("input", (event) => {
  if (audioElement.duration) {
    const seekPercent = progress.value;
    const seekTime = (seekPercent / 100) * audioElement.duration;
    audioElement.currentTime = seekTime;
  }
});

shuffleBtn.addEventListener("click", (event) => {
  isRandom = !isRandom;
  shuffleBtn.classList.toggle("player__btn--active", isRandom);
});

repeatBtn.addEventListener("click", (event) => {
  isRepeat = !isRepeat;
  repeatBtn.classList.toggle("player__btn--active", isRepeat);
});

audioElement.addEventListener("ended", (event) => {
  if (isRepeat) {
    audioElement.currentTime = 0;
    audioElement.play();
  } else {
    nextBtn.click();
  }
});

volumeBar.addEventListener("input", () => {
  const volumeValue = volumeBar.value;
  audioElement.volume = volumeValue / 100;
  volumeBar.style.setProperty("--volume-percent", `${volumeValue}%`);
  if (volumeValue == 0) {
    volumeIcon.className =
      "fas fa-volume-mute player__volume-icon js-volume-icon";
  } else if (volumeValue < 50) {
    volumeIcon.className =
      "fas fa-volume-down player__volume-icon js-volume-icon";
  } else {
    volumeIcon.className =
      "fas fa-volume-up player__volume-icon js-volume-icon";
  }
});

playListElement.addEventListener("click", (event) => {
  const trackNode = event.target.closest(".track:not(.track--active)");
  const isOptionNode = event.target.closest(".track__option");
  if (trackNode && !isOptionNode) {
    currentIndex = Number(trackNode.dataset.index);
    loadCurrentSong();
    updateActiveTrack();
    audioElement.play();
    isPlaying = true;
    togglePlayBtn.classList.add("player__btn--playing");
  }
});

function updateActiveTrack() {
  const currentActive = document.querySelector(".track.track--active");
  if (currentActive) {
    currentActive.classList.remove("track--active");
  }
  const newActive = document.querySelector(
    `.track[data-index="${currentIndex}"]`,
  );
  if (newActive) {
    newActive.classList.add("track--active");
  }
}
function start() {
  loadCurrentSong();
  renderPlaylist();
}

start();
