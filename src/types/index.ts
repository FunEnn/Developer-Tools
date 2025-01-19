import { ComponentType } from 'react';
import { LucideIcon } from 'lucide-react';

export interface Tool {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  component: ComponentType;
  description?: string;
}

export interface Category {
  category: string;
  items: {
    id: string;
    label: string;
    icon: LucideIcon;
    component: React.ComponentType;
    description?: string;
  }[];
} 