import { formatVideoDuration, type CaseStudyView } from "@/lib/caseRepository";
import { useState } from "react";

export default function CaseVideoPlayer({ study }: { study: CaseStudyView }) {
  const [failed, setFailed] = useState(false);
  const video = study.video;
  if (!video) return null;
  return (
    <figure className="case-video-player" id="施工影片">
      <video
        controls
        playsInline
        preload="none"
        poster={video.poster}
        width={video.width}
        height={video.height}
        aria-label={`${study.title}，施工短片`}
        aria-describedby="case-video-description"
        onError={() => setFailed(true)}
      >
        <source src={video.src} type="video/mp4" />
        <track
          kind="captions"
          src={video.captions}
          srcLang="zh-Hant"
          label="繁體中文畫面說明"
        />
        <p>您的瀏覽器未能播放影片，請使用下方的下載連結或閱讀文字紀錄。</p>
      </video>
      <figcaption id="case-video-description">
        <span>
          現場剪輯 · {formatVideoDuration(video.durationSeconds)} ·
          無聲影片，附畫面說明
        </span>
        <a href={video.src} download>
          下載影片
        </a>
      </figcaption>
      {failed ? (
        <p role="status">影片暫時未能播放，可下載影片或閱讀下方文字紀錄。</p>
      ) : null}
    </figure>
  );
}
