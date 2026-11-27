/**
 * Staying on Track - Rail Grinding Simulator
 * Entry point. Shows title screen, then starts game on click.
 *
 * The game is set up WHILE the title fades out (not after): the fade is an
 * opacity transition, which the browser animates on its own compositor
 * thread, so it stays smooth even while the main thread is busy building the
 * game. The job menu sits just under the title and is ready when it clears.
 */

import { Game } from './Game';

const titleScreen = document.getElementById('title-screen')!;
const FADE_MS = 500;

titleScreen.addEventListener('click', () => {
  const clickedAt = performance.now();
  titleScreen.style.willChange = 'opacity'; // own layer: fades on the compositor
  titleScreen.style.transition = `opacity ${FADE_MS / 1000}s`;
  titleScreen.style.opacity = '0';
  titleScreen.style.pointerEvents = 'none'; // clicks go to the job menu underneath

  // Two frames later the fade is running; then build the game underneath it
  requestAnimationFrame(() => requestAnimationFrame(() => {
    try {
      console.log('[STAYING ON TRACK] Starting game...');
      const game = new Game();
      (window as unknown as Record<string, unknown>).game = game;
    } catch (e) {
      console.error('[STAYING ON TRACK] Failed to start:', e);
      document.body.innerHTML = `
        <div style="color: #ff4444; font-family: monospace; padding: 40px;">
          <h2>Error starting game</h2>
          <pre>${e instanceof Error ? e.stack : e}</pre>
        </div>
      `;
      return;
    }
    // Remove the title once the fade has finished (this also stops its animation)
    const left = Math.max(0, FADE_MS - (performance.now() - clickedAt));
    setTimeout(() => { titleScreen.style.display = 'none'; }, left);
  }));
}, { once: true });
