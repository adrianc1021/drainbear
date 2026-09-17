import { useCallback, useEffect, useRef } from "react";

const LIGHT_PHOTO_SRC =
  "https://res.cloudinary.com/dgupuutfn/image/upload/v1780913983/room2_pihyox.png";
const NIGHT_PHOTO_SRC =
  "https://res.cloudinary.com/dgupuutfn/image/upload/v1780913982/room2_night_qc4qeq.png";
const VIDEO_SRC =
  "https://r2.motionsites.dev/motionsites/assets/7ff017e52211.mp4";

export default function DirectModeCard() {
  const cardRef = useRef<HTMLDivElement>(null);
  const artboardRef = useRef<HTMLDivElement>(null);
  const photoRef = useRef<HTMLImageElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const photoLoadCleanupRef = useRef<(() => void) | null>(null);

  const updateScale = useCallback(() => {
    const card = cardRef.current;
    const artboard = artboardRef.current;

    if (
      !card ||
      !artboard ||
      card.clientWidth === 0 ||
      card.clientHeight === 0
    ) {
      return;
    }

    const scale = Math.min(card.clientWidth / 660, card.clientHeight / 836);
    artboard.style.setProperty("--direct-scale", String(scale));
  }, []);

  const syncPhoto = useCallback((isNight: boolean) => {
    const photo = photoRef.current;
    if (!photo) return;

    const nextSource = isNight
      ? photo.dataset.nightSrc || NIGHT_PHOTO_SRC
      : LIGHT_PHOTO_SRC;
    const currentSource = photo.getAttribute("src");

    photoLoadCleanupRef.current?.();
    photoLoadCleanupRef.current = null;

    if (currentSource === nextSource) {
      photo.style.opacity = "1";
      return;
    }

    photo.style.opacity = "0";

    let settled = false;
    const revealPhoto = () => {
      if (settled || photo.getAttribute("src") !== nextSource) return;

      settled = true;
      photo.removeEventListener("load", revealPhoto);
      photoLoadCleanupRef.current = null;

      window.requestAnimationFrame(() => {
        if (photo.getAttribute("src") === nextSource) {
          photo.style.opacity = "1";
        }
      });
    };

    photo.addEventListener("load", revealPhoto);
    photoLoadCleanupRef.current = () => {
      photo.removeEventListener("load", revealPhoto);
      settled = true;
    };

    photo.src = nextSource;

    if (photo.complete && photo.naturalWidth > 0) {
      revealPhoto();
    }
  }, []);

  const syncMode = useCallback(
    (isNight: boolean) => {
      const video = videoRef.current;

      if (video) {
        if (isNight) {
          void video.play().catch(() => undefined);
        } else {
          video.pause();
        }
      }

      syncPhoto(isNight);
    },
    [syncPhoto]
  );

  useEffect(() => {
    const card = cardRef.current;
    if (!card) return;

    updateScale();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(updateScale)
        : null;

    resizeObserver?.observe(card);
    window.addEventListener("resize", updateScale, { passive: true });

    const scaleFrame = window.requestAnimationFrame(updateScale);

    return () => {
      window.cancelAnimationFrame(scaleFrame);
      resizeObserver?.disconnect();
      window.removeEventListener("resize", updateScale);
    };
  }, [updateScale]);

  useEffect(() => {
    const body = document.body;
    const applyMode = () => syncMode(body.classList.contains("is-night"));

    applyMode();

    const observer =
      typeof MutationObserver !== "undefined"
        ? new MutationObserver(applyMode)
        : null;

    observer?.observe(body, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      observer?.disconnect();
      photoLoadCleanupRef.current?.();
      photoLoadCleanupRef.current = null;
      videoRef.current?.pause();
    };
  }, [syncMode]);

  return (
    <div
      ref={cardRef}
      className="direct-card"
      aria-label="Interactive room surface"
    >
      <div
        ref={artboardRef}
        id="directCardTwoArtboard"
        className="direct-card__artboard"
      >
        <img
          ref={photoRef}
          className="direct-card__photo"
          src={LIGHT_PHOTO_SRC}
          data-night-src={NIGHT_PHOTO_SRC}
          alt="Living room interior"
          onLoad={updateScale}
        />
        <video
          ref={videoRef}
          className="direct2-video"
          src={VIDEO_SRC}
          muted
          loop
          playsInline
          preload="auto"
          onLoadedMetadata={updateScale}
          aria-hidden="true"
        />
        <div className="direct2-grade" aria-hidden="true" />

        <div className="direct-footer">
          <div className="direct-footer__head">
            <span
              className="direct-footer__icon"
              style={{
                background: "#3fae6b",
                color: "#fff",
                boxShadow: "0 10px 24px -10px rgba(63,174,107,.6)",
              }}
            >
              <span className="material-icons" aria-hidden="true">
                construction
              </span>
            </span>
            <strong className="direct-footer__title">
              Build the room in real time
            </strong>
          </div>
          <p className="direct-footer__desc">
            Move pieces, explore finishes, and align with your studio on one
            shared canvas.
          </p>
        </div>
      </div>
    </div>
  );
}
