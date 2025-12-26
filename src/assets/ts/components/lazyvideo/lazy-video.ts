// Определяем интерфейс для параметров загрузки видео
interface VideoConfig {
  containerId: string;
  videoUrl: string;
  posterUrl: string;
  preload?: "auto" | "metadata" | "none";
  controls?: boolean;
}

// Функция для отложенной загрузки видео
function lazyLoadVideo(config: VideoConfig): void {
  const container = document.getElementById(config.containerId);
  if (!container) return;

  const video = document.createElement("video");
  video.classList.add("hero-video", "bg--cover");
  video.setAttribute("preload", config.preload ?? "metadata");
  video.setAttribute("poster", config.posterUrl);
  video.loop = true;
  video.muted = true;
  video.playsInline = true;
  video.autoplay = true;
  video.controls = config.controls ?? false;

  const source = document.createElement("source");
  source.src = config.videoUrl;
  source.type = "video/mp4";

  video.appendChild(source);
  container.appendChild(video);

  video.load();
  video.play().catch((err) => {
    console.warn("Автовоспроизведение заблокировано браузером.", err);
  });
}

// Проверяем наличие контейнеров на странице
if (document.getElementById("hero-figure")) {
  lazyLoadVideo({
    containerId: "hero-figure",
    videoUrl: "/assets/video/careers.mp4",
    posterUrl: "/assets/images/hero/main-hero.webp",
    preload: "metadata",
  });
}

if (document.getElementById("hero-figure-contact")) {
  lazyLoadVideo({
    containerId: "hero-figure-contact",
    videoUrl: "/assets/video/contacts/contact.mp4",
    posterUrl: "/assets/images/contacts/bg-contacts.webp",
    preload: "auto",
    controls: true,
  });
}
