import React from 'react';
import type {
  ButtonNode,
  InputNode,
  TextareaNode,
  CheckboxNode,
  RadioNode,
  ToggleNode,
  DropdownNode,
  NavbarNode,
  SidebarNode,
  CardNode,
  AvatarNode,
  BadgeNode,
  TableNode,
  TabsNode,
  BreadcrumbNode,
  ProgressNode,
  SliderNode,
  PaginationNode,
  ModalNode,
  ToastNode
} from '../../models/node';

export const ButtonRenderer: React.FC<{ node: ButtonNode }> = React.memo(({ node }) => {
  const { width, height, label, variant = 'primary', cornerRadius = 6, fill, textColor } = node;

  let bg = fill || '#18181B';
  let border = 'none';
  let color = textColor || '#FFFFFF';

  if (variant === 'secondary') {
    bg = fill || '#F4F4F5';
    color = textColor || '#18181B';
  } else if (variant === 'outline') {
    bg = 'transparent';
    border = '#D4D4D8';
    color = textColor || '#18181B';
  } else if (variant === 'ghost') {
    bg = 'transparent';
    color = textColor || '#18181B';
  } else if (variant === 'danger') {
    bg = fill || '#EF4444';
    color = textColor || '#FFFFFF';
  }

  return (
    <g>
      <rect
        width={width}
        height={height}
        rx={cornerRadius}
        ry={cornerRadius}
        fill={bg}
        stroke={border !== 'none' ? border : undefined}
        strokeWidth={border !== 'none' ? 1 : 0}
      />
      <text
        x={width / 2}
        y={height / 2 + 5}
        fontFamily="Inter, sans-serif"
        fontSize={14}
        fontWeight={500}
        fill={color}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
});

export const InputRenderer: React.FC<{ node: InputNode }> = React.memo(({ node }) => {
  const { width, height, label, placeholder, value, cornerRadius = 6 } = node;
  const hasLabel = Boolean(label);
  const inputY = hasLabel ? 20 : 0;
  const inputH = hasLabel ? height - 20 : height;

  return (
    <g>
      {hasLabel && (
        <text x={0} y={13} fontFamily="Inter, sans-serif" fontSize={12} fontWeight={500} fill="#3F3F46">
          {label}
        </text>
      )}
      <rect
        x={0}
        y={inputY}
        width={width}
        height={inputH}
        rx={cornerRadius}
        fill="#FFFFFF"
        stroke="#D4D4D8"
        strokeWidth={1}
      />
      <text
        x={12}
        y={inputY + inputH / 2 + 4}
        fontFamily="Inter, sans-serif"
        fontSize={13}
        fill={value ? '#18181B' : '#A1A1AA'}
      >
        {value || placeholder}
      </text>
    </g>
  );
});

export const TextareaRenderer: React.FC<{ node: TextareaNode }> = React.memo(({ node }) => {
  const { width, height, label, placeholder, value, cornerRadius = 6 } = node;
  const hasLabel = Boolean(label);
  const boxY = hasLabel ? 20 : 0;
  const boxH = hasLabel ? height - 20 : height;

  return (
    <g>
      {hasLabel && (
        <text x={0} y={13} fontFamily="Inter, sans-serif" fontSize={12} fontWeight={500} fill="#3F3F46">
          {label}
        </text>
      )}
      <rect
        x={0}
        y={boxY}
        width={width}
        height={boxH}
        rx={cornerRadius}
        fill="#FFFFFF"
        stroke="#D4D4D8"
        strokeWidth={1}
      />
      <text
        x={12}
        y={boxY + 20}
        fontFamily="Inter, sans-serif"
        fontSize={13}
        fill={value ? '#18181B' : '#A1A1AA'}
      >
        {value || placeholder}
      </text>
    </g>
  );
});

export const CheckboxRenderer: React.FC<{ node: CheckboxNode }> = React.memo(({ node }) => {
  const { label, checked = true } = node;
  return (
    <g>
      <rect
        x={0}
        y={2}
        width={18}
        height={18}
        rx={4}
        fill={checked ? '#3B82F6' : '#FFFFFF'}
        stroke={checked ? '#3B82F6' : '#D4D4D8'}
        strokeWidth={1.5}
      />
      {checked && (
        <path
          d="M 4 11 L 8 15 L 14 7"
          fill="none"
          stroke="#FFFFFF"
          strokeWidth={2}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      )}
      <text x={26} y={16} fontFamily="Inter, sans-serif" fontSize={13} fill="#18181B">
        {label}
      </text>
    </g>
  );
});

export const RadioRenderer: React.FC<{ node: RadioNode }> = React.memo(({ node }) => {
  const { label, checked = true } = node;
  return (
    <g>
      <circle
        cx={10}
        cy={11}
        r={9}
        fill="#FFFFFF"
        stroke={checked ? '#3B82F6' : '#D4D4D8'}
        strokeWidth={1.5}
      />
      {checked && <circle cx={10} cy={11} r={4.5} fill="#3B82F6" />}
      <text x={26} y={15} fontFamily="Inter, sans-serif" fontSize={13} fill="#18181B">
        {label}
      </text>
    </g>
  );
});

export const ToggleRenderer: React.FC<{ node: ToggleNode }> = React.memo(({ node }) => {
  const { label, checked = true } = node;
  return (
    <g>
      <rect
        x={0}
        y={3}
        width={36}
        height={20}
        rx={10}
        fill={checked ? '#3B82F6' : '#E4E4E7'}
      />
      <circle
        cx={checked ? 26 : 10}
        cy={13}
        r={7}
        fill="#FFFFFF"
      />
      {label && (
        <text x={44} y={17} fontFamily="Inter, sans-serif" fontSize={13} fill="#18181B">
          {label}
        </text>
      )}
    </g>
  );
});

export const DropdownRenderer: React.FC<{ node: DropdownNode }> = React.memo(({ node }) => {
  const { width, height, label, placeholder, options = [], selectedIndex = 0, cornerRadius = 6 } = node;
  const textVal = options[selectedIndex] || placeholder;
  const hasLabel = Boolean(label);
  const boxY = hasLabel ? 20 : 0;
  const boxH = hasLabel ? height - 20 : height;

  return (
    <g>
      {hasLabel && (
        <text x={0} y={13} fontFamily="Inter, sans-serif" fontSize={12} fontWeight={500} fill="#3F3F46">
          {label}
        </text>
      )}
      <rect
        x={0}
        y={boxY}
        width={width}
        height={boxH}
        rx={cornerRadius}
        fill="#FFFFFF"
        stroke="#D4D4D8"
        strokeWidth={1}
      />
      <text x={12} y={boxY + boxH / 2 + 5} fontFamily="Inter, sans-serif" fontSize={13} fill="#18181B">
        {textVal}
      </text>
      <path
        d={`M ${width - 24} ${boxY + boxH / 2 - 2} L ${width - 18} ${boxY + boxH / 2 + 4} L ${width - 12} ${boxY + boxH / 2 - 2}`}
        fill="none"
        stroke="#71717A"
        strokeWidth={1.5}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </g>
  );
});

export const NavbarRenderer: React.FC<{ node: NavbarNode }> = React.memo(({ node }) => {
  const { width, height, brandName, links = [], showAvatar = true, fill = '#FFFFFF', textColor = '#18181B' } = node;

  return (
    <g>
      <rect width={width} height={height} fill={fill} stroke="#E4E4E7" strokeWidth={1} />
      <rect x={20} y={height / 2 - 12} width={24} height={24} rx={6} fill="#3B82F6" />
      <text
        x={54}
        y={height / 2 + 5}
        fontFamily="Inter, sans-serif"
        fontSize={16}
        fontWeight={700}
        fill={textColor}
      >
        {brandName}
      </text>

      {links.map((link, idx) => (
        <text
          key={idx}
          x={200 + idx * 80}
          y={height / 2 + 5}
          fontFamily="Inter, sans-serif"
          fontSize={13}
          fontWeight={idx === 0 ? 600 : 400}
          fill={idx === 0 ? textColor : '#71717A'}
        >
          {link}
        </text>
      ))}

      {showAvatar && (
        <circle cx={width - 32} cy={height / 2} r={16} fill="#E4E4E7" stroke="#D4D4D8" strokeWidth={1} />
      )}
    </g>
  );
});

export const SidebarRenderer: React.FC<{ node: SidebarNode }> = React.memo(({ node }) => {
  const { width, height, title, items = [], fill = '#F4F4F5' } = node;

  return (
    <g>
      <rect width={width} height={height} fill={fill} stroke="#E4E4E7" strokeWidth={1} />
      <text x={20} y={32} fontFamily="Inter, sans-serif" fontSize={14} fontWeight={700} fill="#18181B">
        {title}
      </text>

      {items.map((item, idx) => {
        const itemY = 60 + idx * 40;
        const isActive = Boolean(item.active);

        return (
          <g key={idx}>
            {isActive && (
              <rect x={12} y={itemY} width={width - 24} height={32} rx={6} fill="#E4E4E7" />
            )}
            <circle cx={28} cy={itemY + 16} r={5} fill={isActive ? '#3B82F6' : '#A1A1AA'} />
            <text
              x={44}
              y={itemY + 20}
              fontFamily="Inter, sans-serif"
              fontSize={13}
              fontWeight={isActive ? 600 : 400}
              fill={isActive ? '#18181B' : '#52525B'}
            >
              {item.label}
            </text>
          </g>
        );
      })}
    </g>
  );
});

export const CardRenderer: React.FC<{ node: CardNode }> = React.memo(({ node }) => {
  const { width, height, title, subtitle, content, hasImage = true, showFooter = true, footerText, cornerRadius = 8, fill = '#FFFFFF', stroke = '#E4E4E7', strokeWidth = 1 } = node;
  const imgH = hasImage ? Math.min(80, height * 0.4) : 0;

  return (
    <g>
      <rect
        width={width}
        height={height}
        rx={cornerRadius}
        fill={fill}
        stroke={stroke}
        strokeWidth={strokeWidth}
      />
      {hasImage && (
        <rect
          x={0}
          y={0}
          width={width}
          height={imgH}
          fill="#F4F4F5"
          rx={cornerRadius}
        />
      )}
      <text
        x={16}
        y={imgH + 24}
        fontFamily="Inter, sans-serif"
        fontSize={14}
        fontWeight={600}
        fill="#18181B"
      >
        {title}
      </text>
      {subtitle && (
        <text
          x={16}
          y={imgH + 40}
          fontFamily="Inter, sans-serif"
          fontSize={11}
          fill="#71717A"
        >
          {subtitle}
        </text>
      )}
      <text
        x={16}
        y={imgH + (subtitle ? 60 : 46)}
        fontFamily="Inter, sans-serif"
        fontSize={12}
        fill="#52525B"
      >
        {content}
      </text>
      {showFooter && (
        <>
          <line x1={16} y1={height - 36} x2={width - 16} y2={height - 36} stroke="#F4F4F5" strokeWidth={1} />
          <text
            x={16}
            y={height - 14}
            fontFamily="Inter, sans-serif"
            fontSize={12}
            fontWeight={500}
            fill="#3B82F6"
          >
            {footerText || 'Learn more →'}
          </text>
        </>
      )}
    </g>
  );
});

export const AvatarRenderer: React.FC<{ node: AvatarNode }> = React.memo(({ node }) => {
  const { width, height, name, shape = 'circle', fill = '#6366F1', statusIndicator = 'online' } = node;
  const initials = (name || 'U')
    .split(' ')
    .map(p => p[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const rx = shape === 'circle' ? width / 2 : shape === 'rounded' ? 8 : 0;

  return (
    <g>
      <rect width={width} height={height} rx={rx} fill={fill} />
      <text
        x={width / 2}
        y={height / 2 + 5}
        fontFamily="Inter, sans-serif"
        fontSize={Math.max(10, width * 0.35)}
        fontWeight={600}
        fill="#FFFFFF"
        textAnchor="middle"
      >
        {initials}
      </text>
      {statusIndicator === 'online' && (
        <circle cx={width - 4} cy={height - 4} r={4} fill="#10B981" stroke="#FFFFFF" strokeWidth={1.5} />
      )}
    </g>
  );
});

export const BadgeRenderer: React.FC<{ node: BadgeNode }> = React.memo(({ node }) => {
  const { width, height, label, variant = 'default', fill, textColor } = node;

  let bg = fill || '#F4F4F5';
  let fg = textColor || '#18181B';

  if (variant === 'success') {
    bg = fill || '#DEF7EC';
    fg = textColor || '#03543F';
  } else if (variant === 'warning') {
    bg = fill || '#FEF08A';
    fg = textColor || '#854D0E';
  } else if (variant === 'danger') {
    bg = fill || '#FDE8E8';
    fg = textColor || '#9B1C1C';
  } else if (variant === 'info') {
    bg = fill || '#E1EFFE';
    fg = textColor || '#1E429F';
  }

  return (
    <g>
      <rect width={width} height={height} rx={height / 2} fill={bg} />
      <text
        x={width / 2}
        y={height / 2 + 4}
        fontFamily="Inter, sans-serif"
        fontSize={11}
        fontWeight={600}
        fill={fg}
        textAnchor="middle"
      >
        {label}
      </text>
    </g>
  );
});

export const TableRenderer: React.FC<{ node: TableNode }> = React.memo(({ node }) => {
  const { width, height, headers = [], rows = [], striped = true } = node;
  const colCount = Math.max(headers.length, 1);
  const colW = width / colCount;
  const headerH = 34;
  const rowCount = Math.max(rows.length, 1);
  const rowH = Math.max(26, (height - headerH) / rowCount);

  return (
    <g>
      <rect width={width} height={height} rx={6} fill="#FFFFFF" stroke="#E4E4E7" strokeWidth={1} />
      <rect width={width} height={headerH} fill="#F4F4F5" />
      {headers.map((h, i) => (
        <text
          key={i}
          x={i * colW + 12}
          y={22}
          fontFamily="Inter, sans-serif"
          fontSize={12}
          fontWeight={600}
          fill="#3F3F46"
        >
          {h}
        </text>
      ))}

      {rows.map((row, rIdx) => {
        const y = headerH + rIdx * rowH;
        const isOdd = rIdx % 2 === 1;

        return (
          <g key={rIdx}>
            {striped && isOdd && (
              <rect x={0} y={y} width={width} height={rowH} fill="#FAFAFA" />
            )}
            <line x1={0} y1={y} x2={width} y2={y} stroke="#F4F4F5" strokeWidth={1} />
            {row.map((cell, cIdx) => (
              <text
                key={cIdx}
                x={cIdx * colW + 12}
                y={y + rowH / 2 + 4}
                fontFamily="Inter, sans-serif"
                fontSize={12}
                fill="#18181B"
              >
                {cell}
              </text>
            ))}
          </g>
        );
      })}
    </g>
  );
});

export const TabsRenderer: React.FC<{ node: TabsNode }> = React.memo(({ node }) => {
  const { width, height, tabs = [], activeIndex = 0 } = node;
  const tabW = width / Math.max(tabs.length, 1);

  return (
    <g>
      <line x1={0} y1={height} x2={width} y2={height} stroke="#E4E4E7" strokeWidth={1} />
      {tabs.map((tab, idx) => {
        const isActive = idx === activeIndex;
        const x = idx * tabW;

        return (
          <g key={idx}>
            <text
              x={x + tabW / 2}
              y={height - 12}
              fontFamily="Inter, sans-serif"
              fontSize={13}
              fontWeight={isActive ? 600 : 400}
              fill={isActive ? '#3B82F6' : '#71717A'}
              textAnchor="middle"
            >
              {tab}
            </text>
            {isActive && (
              <line
                x1={x + 8}
                y1={height - 1}
                x2={x + tabW - 8}
                y2={height - 1}
                stroke="#3B82F6"
                strokeWidth={2}
              />
            )}
          </g>
        );
      })}
    </g>
  );
});

export const BreadcrumbRenderer: React.FC<{ node: BreadcrumbNode }> = React.memo(({ node }) => {
  const { items = [], separator = '>' } = node;

  return (
    <g>
      {items.map((item, idx) => {
        const isLast = idx === items.length - 1;
        const xOffset = idx * 90;

        return (
          <g key={idx}>
            <text
              x={xOffset}
              y={16}
              fontFamily="Inter, sans-serif"
              fontSize={12}
              fontWeight={isLast ? 600 : 400}
              fill={isLast ? '#18181B' : '#71717A'}
            >
              {item}
            </text>
            {!isLast && (
              <text
                x={xOffset + 74}
                y={16}
                fontFamily="Inter, sans-serif"
                fontSize={12}
                fill="#A1A1AA"
              >
                {separator}
              </text>
            )}
          </g>
        );
      })}
    </g>
  );
});

export const ProgressRenderer: React.FC<{ node: ProgressNode }> = React.memo(({ node }) => {
  const { width, height, value = 50, barColor = '#3B82F6' } = node;
  const barW = (Math.min(100, Math.max(0, value)) / 100) * width;

  return (
    <g>
      <rect width={width} height={height} rx={height / 2} fill="#E4E4E7" />
      <rect width={barW} height={height} rx={height / 2} fill={barColor} />
    </g>
  );
});

export const SliderRenderer: React.FC<{ node: SliderNode }> = React.memo(({ node }) => {
  const { width, height, value = 50, min = 0, max = 100 } = node;
  const ratio = (value - min) / (max - min || 1);
  const thumbX = ratio * width;

  return (
    <g>
      <line x1={0} y1={height / 2} x2={width} y2={height / 2} stroke="#E4E4E7" strokeWidth={4} strokeLinecap="round" />
      <line x1={0} y1={height / 2} x2={thumbX} y2={height / 2} stroke="#3B82F6" strokeWidth={4} strokeLinecap="round" />
      <circle cx={thumbX} cy={height / 2} r={8} fill="#FFFFFF" stroke="#3B82F6" strokeWidth={2} />
    </g>
  );
});

export const PaginationRenderer: React.FC<{ node: PaginationNode }> = React.memo(({ node }) => {
  const { height, currentPage = 1, totalPages = 5 } = node;
  const btnSize = height;
  const pages = [1, 2, 3, 4, 5].filter(p => p <= totalPages);

  return (
    <g>
      {pages.map((p, idx) => {
        const x = idx * (btnSize + 8);
        const isActive = p === currentPage;

        return (
          <g key={idx}>
            <rect
              x={x}
              y={0}
              width={btnSize}
              height={btnSize}
              rx={6}
              fill={isActive ? '#3B82F6' : '#FFFFFF'}
              stroke="#D4D4D8"
              strokeWidth={1}
            />
            <text
              x={x + btnSize / 2}
              y={btnSize / 2 + 5}
              fontFamily="Inter, sans-serif"
              fontSize={12}
              fontWeight={isActive ? 600 : 400}
              fill={isActive ? '#FFFFFF' : '#18181B'}
              textAnchor="middle"
            >
              {p}
            </text>
          </g>
        );
      })}
    </g>
  );
});

export const ModalRenderer: React.FC<{ node: ModalNode }> = React.memo(({ node }) => {
  const { width, height, title, message, confirmText, cancelText, cornerRadius = 10 } = node;

  return (
    <g>
      <rect width={width} height={height} rx={cornerRadius} fill="#FFFFFF" stroke="#D4D4D8" strokeWidth={1} />
      <text x={20} y={32} fontFamily="Inter, sans-serif" fontSize={16} fontWeight={700} fill="#18181B">
        {title}
      </text>
      <text x={20} y={64} fontFamily="Inter, sans-serif" fontSize={13} fill="#52525B">
        {message}
      </text>

      <rect x={width - 180} y={height - 48} width={80} height={34} rx={6} fill="#F4F4F5" stroke="#D4D4D8" strokeWidth={1} />
      <text x={width - 140} y={height - 26} fontFamily="Inter, sans-serif" fontSize={13} fill="#18181B" textAnchor="middle">
        {cancelText || 'Cancel'}
      </text>

      <rect x={width - 92} y={height - 48} width={80} height={34} rx={6} fill="#3B82F6" />
      <text x={width - 52} y={height - 26} fontFamily="Inter, sans-serif" fontSize={13} fontWeight={500} fill="#FFFFFF" textAnchor="middle">
        {confirmText || 'Confirm'}
      </text>
    </g>
  );
});

export const ToastRenderer: React.FC<{ node: ToastNode }> = React.memo(({ node }) => {
  const { width, height, title, message, variant = 'success', cornerRadius = 8 } = node;
  const barColor = variant === 'success' ? '#10B981' : variant === 'error' ? '#EF4444' : variant === 'warning' ? '#F59E0B' : '#3B82F6';

  return (
    <g>
      <rect width={width} height={height} rx={cornerRadius} fill="#18181B" />
      <rect x={0} y={0} width={6} height={height} rx={cornerRadius} fill={barColor} />
      <text x={18} y={26} fontFamily="Inter, sans-serif" fontSize={13} fontWeight={600} fill="#FFFFFF">
        {title}
      </text>
      <text x={18} y={46} fontFamily="Inter, sans-serif" fontSize={11} fill="#A1A1AA">
        {message}
      </text>
    </g>
  );
});
