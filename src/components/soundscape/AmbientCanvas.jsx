import { motion, useReducedMotion } from 'framer-motion';

/**
 * Endel-inspired ambient backdrop:
 * three large blurred color blobs drifting on slow, asynchronous loops,
 * a subtle moving gradient, and a fine noise field.
 */

const BLOB_STYLE = { willChange: 'transform', backfaceVisibility: 'hidden' };

export default function AmbientCanvas({ palette, playing }) {
  const [a, b, c] = palette;
  const reduceMotion = useReducedMotion();

  return (
    <div
      className="pointer-events-none absolute inset-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* base radial wash */}
      <div
        className="absolute inset-0 transition-[background] duration-[3000ms] ease-out"
        style={{
          background: `radial-gradient(ellipse at 50% 30%, ${a}55 0%, transparent 65%), radial-gradient(ellipse at 30% 80%, ${b}44 0%, transparent 60%), radial-gradient(ellipse at 80% 65%, ${c}55 0%, transparent 60%)`,
        }}
      />

      {!reduceMotion && (
        <>
          {/* drifting blob 1 */}
          <motion.div
            className="absolute rounded-full"
            style={{
              ...BLOB_STYLE,
              width: '70%',
              aspectRatio: '1 / 1',
              top: '-15%',
              left: '-10%',
              background: `radial-gradient(circle at 45% 45%, ${a}88, ${a}22 55%, transparent 75%)`,
              filter: 'blur(60px)',
              mixBlendMode: 'screen',
            }}
            animate={{
              x: ['0%', '30%', '10%', '0%'],
              y: ['0%', '20%', '40%', '0%'],
              scale: [1, 1.1, 0.95, 1],
            }}
            transition={{
              duration: playing ? 48 : 96,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* drifting blob 2 */}
          <motion.div
            className="absolute rounded-full"
            style={{
              ...BLOB_STYLE,
              width: '65%',
              aspectRatio: '1 / 1',
              top: '30%',
              right: '-20%',
              background: `radial-gradient(circle at 50% 50%, ${b}99, ${b}22 55%, transparent 75%)`,
              filter: 'blur(70px)',
              mixBlendMode: 'screen',
            }}
            animate={{
              x: ['0%', '-25%', '-10%', '0%'],
              y: ['0%', '-15%', '20%', '0%'],
              scale: [1, 0.9, 1.12, 1],
            }}
            transition={{
              duration: playing ? 62 : 120,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />

          {/* drifting blob 3 */}
          <motion.div
            className="absolute rounded-full"
            style={{
              ...BLOB_STYLE,
              width: '55%',
              aspectRatio: '1 / 1',
              bottom: '-20%',
              left: '25%',
              background: `radial-gradient(circle at 50% 50%, ${c}88, ${c}22 55%, transparent 75%)`,
              filter: 'blur(55px)',
              mixBlendMode: 'screen',
            }}
            animate={{
              x: ['0%', '15%', '-20%', '0%'],
              y: ['0%', '-10%', '-25%', '0%'],
              scale: [1, 1.05, 0.92, 1],
            }}
            transition={{
              duration: playing ? 55 : 110,
              repeat: Infinity,
              ease: 'easeInOut',
            }}
          />
        </>
      )}

      {/* darkening vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'radial-gradient(ellipse at 50% 40%, transparent 40%, rgba(10,10,15,0.55) 100%)',
        }}
      />
    </div>
  );
}
