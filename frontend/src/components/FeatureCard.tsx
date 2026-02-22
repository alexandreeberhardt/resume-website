import React from 'react'

interface FeatureCardProps {
  icon: React.ReactNode
  title: string
  description: string
}

export default function FeatureCard({ icon, title, description }: FeatureCardProps) {
  return (
    <div className="group relative overflow-hidden p-6 sm:p-7 rounded-[1.9rem] bg-surface-0/90 border border-primary-200/75 shadow-[0_24px_38px_-28px_rgba(10,21,16,0.4)] transition-all duration-300 hover:-translate-y-0.5">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-accent-100/35 to-transparent" />
      <div className="relative w-11 h-11 bg-brand/10 rounded-2xl flex items-center justify-center mb-4 text-brand border border-brand/20">
        {icon}
      </div>
      <h3 className="relative text-lg font-semibold text-primary-900 mb-2 tracking-tight">{title}</h3>
      <p className="relative text-sm text-primary-600 leading-relaxed">{description}</p>
    </div>
  )
}
