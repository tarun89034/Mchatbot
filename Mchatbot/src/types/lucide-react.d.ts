declare module 'lucide-react' {
  import { ComponentType, SVGProps } from 'react';
  
  export interface LucideProps extends SVGProps<SVGSVGElement> {
    size?: number | string;
    absoluteStrokeWidth?: boolean;
  }
  
  export const Send: ComponentType<LucideProps>;
  export const Bot: ComponentType<LucideProps>;
  export const User: ComponentType<LucideProps>;
  export const AlertTriangle: ComponentType<LucideProps>;
  export const Heart: ComponentType<LucideProps>;
  export const Wifi: ComponentType<LucideProps>;
  export const WifiOff: ComponentType<LucideProps>;
  export const Calendar: ComponentType<LucideProps>;
  export const Smile: ComponentType<LucideProps>;
  export const Frown: ComponentType<LucideProps>;
  export const Meh: ComponentType<LucideProps>;
  export const Plus: ComponentType<LucideProps>;
  export const TrendingUp: ComponentType<LucideProps>;
  export const TrendingDown: ComponentType<LucideProps>;
} 