"""Rebuild approved website cuts. Requires ffmpeg/ffprobe; not a build dependency.

Usage: python3 scripts/edit-case-videos.py /path/to/source-directory
Originals stay outside the public directory. No source audio is published.
"""
import argparse
import hashlib
import json
import subprocess
import tempfile
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
PLAN = ROOT / "docs/video-cases-edit-plan.json"
OUTPUT = ROOT / "client/public/videos/cases"
FONT = "/usr/share/fonts/opentype/noto/NotoSansCJK-Bold.ttc"


def run(args):
    subprocess.run(args, check=True)


def timestamp(seconds):
    milliseconds = round(seconds * 1000)
    return f"{milliseconds // 3600000:02}:{milliseconds // 60000 % 60:02}:{milliseconds // 1000 % 60:02}.{milliseconds % 1000:03}"


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("source_directory", type=Path)
    args = parser.parse_args()
    plan = json.loads(PLAN.read_text())
    OUTPUT.mkdir(parents=True, exist_ok=True)
    sources = {p.name: p for p in args.source_directory.rglob("*.mp4")}
    records = []
    with tempfile.TemporaryDirectory(prefix="drainbear-video-", dir="/tmp") as tmp:
        scratch = Path(tmp)
        brand = scratch / "brand.txt"
        brand.write_text("通渠熊 DrainBear · 現場紀錄")
        for clip in plan["clips"]:
            source = sources.get(clip["source"])
            if source is None:
                raise FileNotFoundError(clip["source"])
            parts = []
            cues = []
            elapsed = 0
            for index, segment in enumerate(clip["segments"]):
                duration = segment["end"] - segment["start"]
                if duration <= 0:
                    raise ValueError("Invalid edit interval")
                caption = scratch / f"caption-{index}.txt"
                caption.write_text(segment["caption"])
                part = scratch / f"{clip['slug']}-{index}.mp4"
                # ffmpeg automatically applies the source's -90 degree display matrix.
                # Real-time cuts, without speed changes, preserve the operation shown.
                vf = (
                    "scale=540:960:flags=lanczos,setsar=1,"
                    "drawbox=x=0:y=0:w=iw:h=70:color=0x075a9b@0.86:t=fill,"
                    f"drawtext=fontfile={FONT}:textfile={brand}:fontsize=23:fontcolor=white:x=24:y=22,"
                    "drawbox=x=0:y=ih-112:w=iw:h=112:color=0x08263e@0.88:t=fill,"
                    f"drawtext=fontfile={FONT}:textfile={caption}:fontsize=25:fontcolor=white:x=(w-tw)/2:y=h-73"
                )
                run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y",
                     "-ss", str(segment["start"]), "-i", str(source), "-t", str(duration),
                     "-map", "0:v:0", "-an", "-map_metadata", "-1", "-vf", vf,
                     "-r", "24", "-c:v", "libx264", "-preset", "medium", "-crf", "26",
                     "-pix_fmt", "yuv420p", "-movflags", "+faststart", str(part)])
                parts.append(part)
                cues.append({"start": elapsed, "end": elapsed + duration, "text": segment["caption"]})
                elapsed += duration
            concat = scratch / "parts.txt"
            concat.write_text("\n".join(f"file '{p}'" for p in parts))
            video = OUTPUT / f"{clip['slug']}-v1.mp4"
            run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-f", "concat",
                 "-safe", "0", "-i", str(concat), "-c", "copy", "-an", "-map_metadata", "-1",
                 "-movflags", "+faststart", str(video)])
            poster = OUTPUT / f"{clip['slug']}-v1.webp"
            run(["ffmpeg", "-hide_banner", "-loglevel", "error", "-y", "-ss",
                 str(clip["posterSecond"]), "-i", str(video), "-frames:v", "1",
                 "-c:v", "libwebp", "-quality", "82", str(poster)])
            vtt = OUTPUT / f"{clip['slug']}-v1.vtt"
            vtt.write_text("WEBVTT\n\n" + "\n\n".join(
                f"{timestamp(c['start'])} --> {timestamp(c['end'])}\n{c['text']}" for c in cues) + "\n")
            probe = json.loads(subprocess.check_output([
                "ffprobe", "-v", "quiet", "-show_format", "-show_streams", "-of", "json", str(video)]))
            stream = probe["streams"][0]
            if len(probe["streams"]) != 1 or stream["codec_name"] != "h264":
                raise ValueError("Expected a silent H.264 cut")
            if (stream["width"], stream["height"]) != (540, 960):
                raise ValueError("Unexpected video orientation")
            records.append({**{k: v for k, v in clip.items() if k not in ["source", "segments", "posterSecond"]},
                "publishedAt": plan["publishedAt"],
                "video": {"src": f"/videos/cases/{video.name}", "poster": f"/videos/cases/{poster.name}",
                    "captions": f"/videos/cases/{vtt.name}", "durationSeconds": round(float(probe["format"]["duration"]), 3),
                    "width": 540, "height": 960, "bytes": video.stat().st_size,
                    "sha256": hashlib.sha256(video.read_bytes()).hexdigest(), "chapters": cues}})
    manifest = ROOT / "shared/recordedVideoCases.json"
    manifest.write_text(json.dumps(records, ensure_ascii=False, indent=2) + "\n")
    print(json.dumps({"clips": len(records), "videoBytes": sum(r['video']['bytes'] for r in records)}, indent=2))


if __name__ == "__main__":
    main()
