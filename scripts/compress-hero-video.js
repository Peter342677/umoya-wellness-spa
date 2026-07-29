// Re-encodes public/assets/video/hero.mp4 in place with a much lower
// bitrate - the homepage hero video is muted, ambient background footage
// behind a dark gradient overlay, so visual fidelity can trade off heavily
// against file size. CRF 30 (vs. ffmpeg's "visually lossless" default of
// ~18-23) took the original stock footage from 3.09MB to ~0.92MB with no
// visible quality loss at the size it's actually displayed at.
// Run after replacing hero.mp4 with new footage: node scripts/compress-hero-video.js path/to/new-footage.mp4
const path = require('path');
const { execFileSync } = require('child_process');
const ffmpegPath = require('ffmpeg-static');

const OUTPUT = path.join(__dirname, '..', 'public', 'assets', 'video', 'hero.mp4');
const input = process.argv[2] || OUTPUT;
const tempOutput = OUTPUT + '.tmp.mp4';

execFileSync(ffmpegPath, [
  '-y',
  '-i', input,
  '-c:v', 'libx264',
  '-crf', '30',
  '-preset', 'slow',
  '-profile:v', 'main',
  '-pix_fmt', 'yuv420p',
  '-movflags', '+faststart',
  '-an',
  tempOutput,
]);

require('fs').renameSync(tempOutput, OUTPUT);
console.log('Wrote', OUTPUT);
