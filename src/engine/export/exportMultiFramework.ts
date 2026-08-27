import type { ChigmaNode } from '../../models/node';
import { generateCssForNode } from './exportCode';

export type ExportFramework = 'html' | 'react_tailwind' | 'react_css_modules' | 'nextjs';

/**
 * Generates idiomatic React + TypeScript component using Tailwind CSS utility classes.
 */
export function generateReactTailwindCode(node: ChigmaNode): string {
  const compName = (node.name || 'Component')
    .replace(/[^a-zA-Z0-9]/g, ' ')
    .split(' ')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join('');

  if (node.type === 'button') {
    const btn = node as any;
    const variantClass =
      btn.variant === 'secondary'
        ? 'bg-zinc-100 text-zinc-900 hover:bg-zinc-200'
        : btn.variant === 'outline'
        ? 'border border-zinc-300 bg-transparent text-zinc-900 hover:bg-zinc-50'
        : btn.variant === 'danger'
        ? 'bg-red-600 text-white hover:bg-red-700'
        : 'bg-black text-white hover:bg-zinc-800';

    return `import React from 'react';

interface ${compName}Props {
  label?: string;
  onClick?: () => void;
  className?: string;
}

export const ${compName}: React.FC<${compName}Props> = ({
  label = '${btn.label || 'Button'}',
  onClick,
  className = ''
}) => {
  return (
    <button
      onClick={onClick}
      className={\`inline-flex items-center justify-center font-medium text-sm rounded-lg px-4 py-2 transition-colors ${variantClass} \${className}\`}
    >
      {label}
    </button>
  );
};
`;
  }

  if (node.type === 'card') {
    const card = node as any;
    return `import React from 'react';

interface ${compName}Props {
  title?: string;
  subtitle?: string;
  content?: string;
  footerAction?: string;
  onAction?: () => void;
}

export const ${compName}: React.FC<${compName}Props> = ({
  title = '${card.title || 'Card Title'}',
  subtitle = '${card.subtitle || 'Subtitle text'}',
  content = '${card.content || 'Content description goes here.'}',
  footerAction = '${card.footerText || 'Learn more →'}',
  onAction
}) => {
  return (
    <div className="w-[${Math.round(card.width)}px] bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-5 shadow-sm space-y-3">
      <div>
        <h3 className="text-base font-semibold text-zinc-900 dark:text-zinc-100">{title}</h3>
        {subtitle && <p className="text-xs text-zinc-500 mt-0.5">{subtitle}</p>}
      </div>
      <p className="text-sm text-zinc-600 dark:text-zinc-300 leading-relaxed">{content}</p>
      {footerAction && (
        <div className="pt-2 border-t border-zinc-100 dark:border-zinc-800">
          <button
            onClick={onAction}
            className="text-xs font-semibold text-blue-600 dark:text-blue-400 hover:underline"
          >
            {footerAction}
          </button>
        </div>
      )}
    </div>
  );
};
`;
  }

  if (node.type === 'navbar') {
    const nav = node as any;
    const links = nav.links || ['Home', 'Features', 'Pricing'];
    return `import React from 'react';

interface ${compName}Props {
  brandName?: string;
}

export const ${compName}: React.FC<${compName}Props> = ({
  brandName = '${nav.brandName || 'Brand'}'
}) => {
  return (
    <header className="w-full h-16 bg-white dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800 px-6 flex items-center justify-between">
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
          {brandName.charAt(0)}
        </div>
        <span className="font-bold text-base text-zinc-900 dark:text-white">{brandName}</span>
      </div>

      <nav className="flex items-center gap-6">
        ${links
          .map(
            (l: string) =>
              `<a href="#" className="text-sm text-zinc-600 dark:text-zinc-300 hover:text-black dark:hover:text-white transition-colors">${l}</a>`
          )
          .join('\n        ')}
      </nav>

      <div className="flex items-center gap-3">
        <button className="px-4 py-2 text-sm font-medium rounded-full bg-black text-white dark:bg-white dark:text-black hover:opacity-90 transition">
          Get Started
        </button>
      </div>
    </header>
  );
};
`;
  }

  // Generic Container Frame
  return `import React from 'react';

interface ${compName}Props {
  children?: React.ReactNode;
  className?: string;
}

export const ${compName}: React.FC<${compName}Props> = ({ children, className = '' }) => {
  return (
    <div
      style={{
        width: '${Math.round(node.width)}px',
        height: '${Math.round(node.height)}px',
        backgroundColor: '${node.fill || '#FFFFFF'}'
      }}
      className={\`relative rounded-xl border border-zinc-200 dark:border-zinc-800 p-4 \${className}\`}
    >
      {children}
    </div>
  );
};
`;
}

/**
 * Generates Next.js App Router compatible React Server/Client Component.
 */
export function generateNextJsCode(node: ChigmaNode): string {
  const tailwindJsx = generateReactTailwindCode(node);
  return `'use client';\n\n${tailwindJsx}`;
}

/**
 * Generates CSS stylesheet for the selected node with CSS variables.
 */
export function generateCssCode(node: ChigmaNode): string {
  return generateCssForNode(node);
}
