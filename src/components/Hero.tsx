import { motion } from 'framer-motion'
import Button from './ui/Button'
import heroInvite from '../assets/hero-invite.png'
import hero512 from '../assets/hero-512.png'
import hero768 from '../assets/hero-768.png'
import hero1024 from '../assets/hero-1024.png'
import hero1920 from '../assets/hero-1920.png'
import hero768Webp from '../assets/hero-768.webp'
import hero1024Webp from '../assets/hero-1024.webp'
import hero1920Webp from '../assets/hero-1920.webp'

export default function Hero() {
  return (
    <div className="relative w-full h-[600px] md:h-[824px] overflow-hidden">
      <picture className="absolute inset-0 w-full h-full">
        <source type="image/webp" media="(min-width: 1025px)" srcSet={hero1920Webp} />
        <source type="image/webp" media="(min-width: 769px)" srcSet={hero1024Webp} />
        <source type="image/webp" media="(min-width: 513px)" srcSet={hero768Webp} />
        <source media="(min-width: 1025px)" srcSet={hero1920} />
        <source media="(min-width: 769px)" srcSet={hero1024} />
        <source media="(min-width: 513px)" srcSet={hero768} />
        <img src={hero512} alt="" className="w-full h-full object-cover" />
      </picture>

      <div className="absolute inset-0 bg-linear-to-r from-black/60 to-transparent" />

      <div className="absolute inset-0 flex items-center px-6 md:px-16">
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
          className="glass-strong rounded-2xl p-6 md:p-12 max-w-md"
        >
          <img
            src={heroInvite}
            alt="Let's create together!"
            className="w-full max-w-[224px] md:max-w-[288px] mb-6"
          />
          <Button to="/commissions" variant="primary" className="w-full h-14 text-xl">
            Request now
          </Button>
        </motion.div>
      </div>
    </div>
  )
}
