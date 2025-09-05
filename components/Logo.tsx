interface LogoProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function Logo({ className = '', size = 'md' }: LogoProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-10 h-10', 
    lg: 'w-12 h-12'
  }

  return (
    <div className={`${sizeClasses[size]} ${className}`}>
      <svg
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full"
      >
        {/* Stethoscope forming heart shape - refined design */}
        {/* Left ear tube */}
        <path
          d="M100 100 Q100 140, 120 180 Q140 220, 160 260"
          stroke="#14b8a6"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Right ear tube */}
        <path
          d="M300 100 Q300 140, 280 180 Q260 220, 240 260"
          stroke="#14b8a6"
          strokeWidth="10"
          fill="none"
          strokeLinecap="round"
        />
        
        {/* Ear pieces */}
        <circle cx="100" cy="100" r="10" fill="#14b8a6"/>
        <circle cx="300" cy="100" r="10" fill="#14b8a6"/>
        
        {/* Heart shape formed by stethoscope - more refined curves */}
        <path
          d="M160 260 Q200 200, 240 260 Q280 320, 200 360 Q120 320, 160 260 Z"
          fill="none"
          stroke="#14b8a6"
          strokeWidth="10"
          strokeLinecap="round"
        />
        
        {/* Seychelles flag inside heart - better proportions */}
        <g>
          {/* Blue band (bottom left) */}
          <path
            d="M160 260 Q180 280, 200 300 Q180 320, 160 340 Q140 320, 120 300 Q140 280, 160 260 Z"
            fill="#003893"
          />
          
          {/* Yellow band */}
          <path
            d="M180 280 Q200 300, 220 320 Q200 340, 180 360 Q160 340, 140 320 Q160 300, 180 280 Z"
            fill="#FCD116"
          />
          
          {/* Red band */}
          <path
            d="M200 300 Q220 320, 240 340 Q220 360, 200 380 Q180 360, 160 340 Q180 320, 200 300 Z"
            fill="#D62D20"
          />
          
          {/* Black band */}
          <path
            d="M220 320 Q240 340, 260 360 Q240 380, 220 400 Q200 380, 180 360 Q200 340, 220 320 Z"
            fill="#000000"
          />
          
          {/* Green band (top right) */}
          <path
            d="M240 340 Q260 360, 280 380 Q260 400, 240 420 Q220 400, 200 380 Q220 360, 240 340 Z"
            fill="#007A3D"
          />
        </g>
        
        {/* Stethoscope diaphragm - positioned at heart bottom */}
        <circle cx="200" cy="360" r="15" fill="#14b8a6"/>
        <circle cx="200" cy="360" r="10" fill="#ffffff"/>
        <circle cx="200" cy="360" r="5" fill="#14b8a6"/>
      </svg>
    </div>
  )
}