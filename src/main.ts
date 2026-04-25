/**
 * Staying on Track - Rail Grinding Simulator
 * Entry point. Shows title screen, then starts game on click.
 */

import { Game } from './Game';

const titleScreen = document.getElementById('title-screen')!;

titleScreen.addEventListener('click', () => {
  titleScreen.style.transition = 'opacity 0.5s';
  titleScreen.style.opacity = '0';
  setTimeout(() => {
    titleScreen.style.display = 'none';

    try {
      console.log('[STAYING ON TRACK] Starting game...');
      const game = new Game();
      console.log('[STAYING ON TRACK] Game running. Track length:', game);
      (window as unknown as Record<string, unknown>).game = game;
    } catch (e) {
      console.error('[STAYING ON TRACK] Failed to start:', e);
      document.body.innerHTML = `
        <div style="color: #ff4444; font-family: monospace; padding: 40px;">
          <h2>Error starting game</h2>
          <pre>${e instanceof Error ? e.stack : e}</pre>
        </div>
      `;
    }
  }, 500);
}, { once: true });
