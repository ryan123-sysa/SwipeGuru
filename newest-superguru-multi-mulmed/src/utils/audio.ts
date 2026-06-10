/**
 * Audio Synthesis Service for CourseGuru
 * Generates pleasant beeps/dings for correct/incorrect responses using the Web Audio API.
 * This runs entirely client-side with zero external assets.
 */

let audioCtx: AudioContext | null = null;

// Safely lazy-initialize the AudioContext inside a user-gesture handler
function getAudioContext(): AudioContext {
  if (!audioCtx) {
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
  }
  
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
  
  return audioCtx;
}

/**
 * Plays a bright, cheerful double-beep (ding-ding) for a correct answer.
 */
export function playCorrectSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Layer 1: Fundamental Sine Wave (pure, bright arpeggio)
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sine';
    
    // Bright Major arpeggio C5 (523.25) -> E5 (659.25) -> G5 (783.99)
    osc1.frequency.setValueAtTime(523.25, now);
    osc1.frequency.setValueAtTime(659.25, now + 0.06);
    osc1.frequency.setValueAtTime(783.99, now + 0.12);

    // High Peak Gain (1.80) for powerful dings
    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(1.80, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.50);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Layer 2: High Octave Harmonic Sine (sparkle tone)
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'sine';
    osc2.frequency.setValueAtTime(1046.50, now); // Double octave C6
    osc2.frequency.setValueAtTime(1318.51, now + 0.06);
    osc2.frequency.setValueAtTime(1567.98, now + 0.12);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(0.90, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.50);
    osc2.start(now);
    osc2.stop(now + 0.45);
  } catch (error) {
    console.warn('Could not play correct sound:', error);
  }
}

/**
 * Plays a mellow, corrective sliding tone (buzz-boop) for an incorrect answer.
 */
export function playIncorrectSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Layer 1: Low-frequency Sawtooth for deep buzzy physical response
    const osc1 = ctx.createOscillator();
    const gain1 = ctx.createGain();
    osc1.type = 'sawtooth';
    osc1.frequency.setValueAtTime(140.00, now);
    osc1.frequency.linearRampToValueAtTime(90.00, now + 0.28);

    gain1.gain.setValueAtTime(0, now);
    gain1.gain.linearRampToValueAtTime(0.60, now + 0.02);
    gain1.gain.exponentialRampToValueAtTime(0.0001, now + 0.40);

    osc1.connect(gain1);
    gain1.connect(ctx.destination);

    // Layer 2: Loud corrective Triangle sliding tone
    const osc2 = ctx.createOscillator();
    const gain2 = ctx.createGain();
    osc2.type = 'triangle';
    osc2.frequency.setValueAtTime(180.00, now);
    osc2.frequency.linearRampToValueAtTime(115.00, now + 0.28);

    gain2.gain.setValueAtTime(0, now);
    gain2.gain.linearRampToValueAtTime(1.80, now + 0.02);
    gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    osc2.connect(gain2);
    gain2.connect(ctx.destination);

    osc1.start(now);
    osc1.stop(now + 0.40);
    osc2.start(now);
    osc2.stop(now + 0.45);
  } catch (error) {
    console.warn('Could not play incorrect sound:', error);
  }
}

/**
 * Plays a magical, celebratory rising arpeggio (success/purchase chimes).
 */
export function playSuccessSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // We play 4 successive pleasant notes (C5 -> E5 -> G5 -> C6) with short staggered delays
    const notes = [523.25, 659.25, 783.99, 1046.50];
    notes.forEach((freq, idx) => {
      const time = now + idx * 0.08;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, time);
      
      // Triangle harmonic for warm, solid chime tone
      const oscHarmonic = ctx.createOscillator();
      oscHarmonic.type = 'triangle';
      oscHarmonic.frequency.setValueAtTime(freq * 2, time); // high octave
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(1.5, time + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.45);
      
      osc.connect(gain);
      oscHarmonic.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.45);
      oscHarmonic.start(time);
      oscHarmonic.stop(time + 0.45);
    });
  } catch (error) {
    console.warn('Could not play success sound:', error);
  }
}

/**
 * Plays a grand celebratory 5-note arpeggio chord for matching successfully with a teacher.
 */
export function playMatchSound() {
  try {
    const ctx = getAudioContext();
    const now = ctx.currentTime;

    // Beautiful soaring arpeggio in F major / A minor pentatonic: A4 -> C5 -> E5 -> G5 -> A6
    const freqs = [440.00, 523.25, 659.25, 783.99, 880.00, 1046.50];
    
    freqs.forEach((freq, i) => {
      const time = now + i * 0.075;
      
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      
      // Warm sine mixed with subtle harmonics
      osc.type = i % 2 === 0 ? 'sine' : 'triangle';
      osc.frequency.setValueAtTime(freq, time);
      
      gain.gain.setValueAtTime(0, time);
      gain.gain.linearRampToValueAtTime(1.6, time + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, time + 0.6);
      
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start(time);
      osc.stop(time + 0.6);
    });
  } catch (error) {
    console.warn('Could not play match sound:', error);
  }
}


