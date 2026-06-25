/**
 * Saud Al-Naam Real Estate Services Premium Logo Component
 * High-fidelity 3D metallic silver replica on royal navy blue background
 */
import React from 'react';

interface LogoProps {
  className?: string;
  showText?: boolean;
  textSize?: 'sm' | 'md' | 'lg';
  iconOnly?: boolean;
  darkBg?: boolean;
  imgClassName?: string;
  imgStyle?: React.CSSProperties;
  style?: React.CSSProperties;
}

export function SaudAlNaamLogo({
  className = "w-full max-w-[280px]",
  showText = true,
  textSize = "md",
  iconOnly = false,
  darkBg = true,
  imgClassName = "",
  imgStyle = {},
  style = {},
}: LogoProps) {
  
  // Custom font size mappings
  const primaryTextSize = 
    textSize === 'sm' ? 'text-lg sm:text-xl' :
    textSize === 'md' ? 'text-2xl sm:text-3xl' : 'text-3.5xl sm:text-4xl lg:text-5xl';

  const secondaryTextSize = 
    textSize === 'sm' ? 'text-[10px]' :
    textSize === 'md' ? 'text-xs' : 'text-sm sm:text-base';

  // Secure URL of the high-fidelity 3D metallic logo from the uploaded picture
  const logoImgUrl = "https://i.postimg.cc/fk4rvXLj/Gemini-Generated-Image-8v4fx18v4fx18v4f.png";

  return (
    <div 
      className={`flex flex-col items-center justify-center text-center ${className}`} 
      id="saud-alnaam-logo"
      style={style}
    >
      {/* High-Fidelity 3D Metallic Logo Image */}
      <img
        src={logoImgUrl}
        alt="سعود النعام للخدمات العقارية"
        className={`w-full h-auto object-contain select-none transition-all duration-300 hover:scale-[1.02] ${imgClassName}`}
        style={{ 
          imageRendering: 'auto', 
          WebkitFontSmoothing: 'antialiased',
          backfaceVisibility: 'hidden',
          ...imgStyle
        }}
        referrerPolicy="no-referrer"
        loading="eager"
      />

      {/* HTML Styled Text below or side for maximum UI clarity and accessibility */}
      {showText && !iconOnly && (
        <div className="mt-4 flex flex-col items-center gap-1.5 selection:bg-blue-600/30">
          <h2 className={`${primaryTextSize} font-extrabold tracking-tight text-[#0A1931] dark:text-transparent dark:bg-clip-text dark:bg-gradient-to-l dark:from-white dark:via-slate-150 dark:to-slate-350 font-sans`}>
            سعود النعام للخدمات العقارية
          </h2>
          <div className="flex items-center gap-1.5 justify-center font-bold">
            <span className={`${secondaryTextSize} text-[#1E40AF] dark:text-[#CBD5E1]/90 tracking-wide font-sans`}>
              الرؤية العقارية المبتكرة للأملاك السياحية
            </span>
            <span className="text-amber-500 text-xs animate-pulse">✦</span>
          </div>
        </div>
      )}
    </div>
  );
}
