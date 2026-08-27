import type { IconDefinition } from '../../models/icons';

export const BUILT_IN_ICONS: IconDefinition[] = [
  // 1. Navigation
  {
    name: 'home',
    category: 'navigation',
    svgPath: '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
    tags: ['main', 'house', 'dashboard']
  },
  {
    name: 'menu',
    category: 'navigation',
    svgPath: '<line x1="4" x2="20" y1="12" y2="12"/><line x1="4" x2="20" y1="6" y2="6"/><line x1="4" x2="20" y1="18" y2="18"/>',
    tags: ['hamburger', 'drawer', 'sidebar']
  },
  {
    name: 'compass',
    category: 'navigation',
    svgPath: '<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>',
    tags: ['explore', 'direction']
  },
  {
    name: 'map',
    category: 'navigation',
    svgPath: '<polygon points="3 6 9 3 15 6 21 3 21 18 15 21 9 18 3 21"/><line x1="9" x2="9" y1="3" y2="18"/><line x1="15" x2="15" y1="6" y2="21"/>',
    tags: ['location', 'gps']
  },
  {
    name: 'layers',
    category: 'navigation',
    svgPath: '<path d="m12.83 2.18a2 2 0 0 0-1.66 0L2.6 6.08a1 1 0 0 0 0 1.83l8.58 3.91a2 2 0 0 0 1.66 0l8.58-3.9a1 1 0 0 0 0-1.83Z"/><path d="m22 12.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 12.5"/><path d="m22 17.5-8.58 3.91a2 2 0 0 1-1.66 0L2.6 17.5"/>',
    tags: ['stack', 'design']
  },

  // 2. Actions
  {
    name: 'search',
    category: 'actions',
    svgPath: '<circle cx="11" cy="11" r="8"/><line x1="21" x2="16.65" y1="21" y2="16.65"/>',
    tags: ['find', 'lookup', 'query']
  },
  {
    name: 'close',
    category: 'actions',
    svgPath: '<path d="M18 6 6 18"/><path d="m6 6 12 12"/>',
    tags: ['cancel', 'delete', 'x']
  },
  {
    name: 'check',
    category: 'actions',
    svgPath: '<polyline points="20 6 9 17 4 12"/>',
    tags: ['tick', 'confirm', 'success', 'done']
  },
  {
    name: 'plus',
    category: 'actions',
    svgPath: '<line x1="12" x2="12" y1="5" y2="19"/><line x1="5" x2="19" y1="12" y2="12"/>',
    tags: ['add', 'create', 'new']
  },
  {
    name: 'minus',
    category: 'actions',
    svgPath: '<line x1="5" x2="19" y1="12" y2="12"/>',
    tags: ['remove', 'subtract']
  },
  {
    name: 'edit',
    category: 'actions',
    svgPath: '<path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>',
    tags: ['pencil', 'modify', 'write']
  },
  {
    name: 'trash',
    category: 'actions',
    svgPath: '<path d="M3 6h18"/><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"/>',
    tags: ['delete', 'remove', 'bin']
  },
  {
    name: 'copy',
    category: 'actions',
    svgPath: '<rect width="14" height="14" x="8" y="8" rx="2" ry="2"/><path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>',
    tags: ['duplicate', 'clipboard']
  },
  {
    name: 'share',
    category: 'actions',
    svgPath: '<circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><line x1="8.59" x2="15.42" y1="13.51" y2="17.49"/><line x1="15.41" x2="8.59" y1="6.51" y2="10.49"/>',
    tags: ['send', 'link', 'social']
  },
  {
    name: 'filter',
    category: 'actions',
    svgPath: '<polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/>',
    tags: ['sort', 'refine']
  },

  // 3. Communication
  {
    name: 'mail',
    category: 'communication',
    svgPath: '<rect width="20" height="16" x="2" y="4" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>',
    tags: ['email', 'letter', 'message']
  },
  {
    name: 'phone',
    category: 'communication',
    svgPath: '<path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/>',
    tags: ['call', 'contact']
  },
  {
    name: 'message-square',
    category: 'communication',
    svgPath: '<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>',
    tags: ['chat', 'comment', 'sms']
  },
  {
    name: 'bell',
    category: 'communication',
    svgPath: '<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>',
    tags: ['notification', 'alert']
  },

  // 4. Media
  {
    name: 'play',
    category: 'media',
    svgPath: '<polygon points="6 3 20 12 6 21 6 3"/>',
    tags: ['start', 'video', 'audio']
  },
  {
    name: 'pause',
    category: 'media',
    svgPath: '<rect width="4" height="16" x="6" y="4"/><rect width="4" height="16" x="14" y="4"/>',
    tags: ['stop', 'hold']
  },
  {
    name: 'image',
    category: 'media',
    svgPath: '<rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/>',
    tags: ['photo', 'picture']
  },
  {
    name: 'camera',
    category: 'media',
    svgPath: '<path d="M14.5 4h-5L7 7H4a2 2 0 0 0-2 2v9a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-3l-2.5-3z"/><circle cx="12" cy="13" r="3"/>',
    tags: ['photo', 'snapshot']
  },
  {
    name: 'video',
    category: 'media',
    svgPath: '<path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/>',
    tags: ['record', 'movie']
  },

  // 5. Commerce
  {
    name: 'shopping-cart',
    category: 'commerce',
    svgPath: '<circle cx="8" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.05 2.05h2l2.66 12.42a2 2 0 0 0 2 1.58h9.78a2 2 0 0 0 1.95-1.57l1.65-7.43H5.12"/>',
    tags: ['buy', 'store', 'checkout']
  },
  {
    name: 'credit-card',
    category: 'commerce',
    svgPath: '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
    tags: ['payment', 'card', 'bank']
  },
  {
    name: 'tag',
    category: 'commerce',
    svgPath: '<path d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z"/><path d="M7 7h.01"/>',
    tags: ['price', 'discount', 'label']
  },
  {
    name: 'dollar-sign',
    category: 'commerce',
    svgPath: '<line x1="12" x2="12" y1="2" y2="22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>',
    tags: ['money', 'finance', 'cash']
  },

  // 6. Files
  {
    name: 'file',
    category: 'files',
    svgPath: '<path d="M15 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7Z"/><path d="M14 2v4a2 2 0 0 0 2 2h4"/>',
    tags: ['document', 'page']
  },
  {
    name: 'folder',
    category: 'files',
    svgPath: '<path d="M4 20h16a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-7.93a2 2 0 0 1-1.66-.9l-.82-1.2A2 2 0 0 0 7.93 3H4a2 2 0 0 0-2 2v13c0 1.1.9 2 2 2Z"/>',
    tags: ['directory', 'storage']
  },
  {
    name: 'download',
    category: 'files',
    svgPath: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/>',
    tags: ['save', 'export', 'fetch']
  },
  {
    name: 'upload',
    category: 'files',
    svgPath: '<path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/>',
    tags: ['import', 'send']
  },

  // 7. Users
  {
    name: 'user',
    category: 'users',
    svgPath: '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
    tags: ['profile', 'account', 'person']
  },
  {
    name: 'users',
    category: 'users',
    svgPath: '<path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>',
    tags: ['team', 'group', 'members']
  },

  // 8. Settings
  {
    name: 'settings',
    category: 'settings',
    svgPath: '<path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"/><circle cx="12" cy="12" r="3"/>',
    tags: ['gear', 'configure', 'options']
  },
  {
    name: 'lock',
    category: 'settings',
    svgPath: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
    tags: ['security', 'private', 'password']
  },
  {
    name: 'unlock',
    category: 'settings',
    svgPath: '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 9.9-1"/>',
    tags: ['open', 'public']
  },

  // 9. Status
  {
    name: 'heart',
    category: 'status',
    svgPath: '<path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>',
    tags: ['like', 'favorite', 'love']
  },
  {
    name: 'star',
    category: 'status',
    svgPath: '<polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>',
    tags: ['rating', 'bookmark', 'favorite']
  },
  {
    name: 'alert-circle',
    category: 'status',
    svgPath: '<circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/>',
    tags: ['warning', 'error', 'danger']
  },
  {
    name: 'clock',
    category: 'status',
    svgPath: '<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>',
    tags: ['time', 'recent', 'history']
  },

  // 10. Arrows
  {
    name: 'arrow-left',
    category: 'arrows',
    svgPath: '<path d="m12 19-7-7 7-7"/><path d="M19 12H5"/>',
    tags: ['back', 'previous']
  },
  {
    name: 'arrow-right',
    category: 'arrows',
    svgPath: '<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>',
    tags: ['forward', 'next']
  },
  {
    name: 'arrow-up',
    category: 'arrows',
    svgPath: '<path d="m5 12 7-7 7 7"/><path d="M12 19V5"/>',
    tags: ['top', 'ascend']
  },
  {
    name: 'arrow-down',
    category: 'arrows',
    svgPath: '<path d="M12 5v14"/><path d="m19 12-7 7-7-7"/>',
    tags: ['bottom', 'descend']
  },
  {
    name: 'chevron-left',
    category: 'arrows',
    svgPath: '<path d="m15 18-6-6 6-6"/>',
    tags: ['back', 'slider']
  },
  {
    name: 'chevron-right',
    category: 'arrows',
    svgPath: '<path d="m9 18 6-6-6-6"/>',
    tags: ['forward', 'slider']
  },
  {
    name: 'chevron-up',
    category: 'arrows',
    svgPath: '<path d="m18 15-6-6-6 6"/>',
    tags: ['accordion', 'collapse']
  },
  {
    name: 'chevron-down',
    category: 'arrows',
    svgPath: '<path d="m6 9 6 6 6-6"/>',
    tags: ['dropdown', 'expand']
  },
  {
    name: 'external-link',
    category: 'arrows',
    svgPath: '<path d="M15 3h6v6"/><path d="M10 14 21 3"/><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>',
    tags: ['url', 'new tab', 'open']
  },

  // 11. Editor
  {
    name: 'align-left',
    category: 'editor',
    svgPath: '<line x1="21" x2="3" y1="6" y2="6"/><line x1="15" x2="3" y1="12" y2="12"/><line x1="17" x2="3" y1="18" y2="18"/>',
    tags: ['text', 'format']
  },
  {
    name: 'align-center',
    category: 'editor',
    svgPath: '<line x1="21" x2="3" y1="6" y2="6"/><line x1="19" x2="5" y1="12" y2="12"/><line x1="21" x2="3" y1="18" y2="18"/>',
    tags: ['text', 'format']
  },
  {
    name: 'align-right',
    category: 'editor',
    svgPath: '<line x1="21" x2="3" y1="6" y2="6"/><line x1="21" x2="9" y1="12" y2="12"/><line x1="21" x2="7" y1="18" y2="18"/>',
    tags: ['text', 'format']
  },

  // 12. Social
  {
    name: 'globe',
    category: 'social',
    svgPath: '<circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/>',
    tags: ['web', 'world', 'internet']
  },
  {
    name: 'github',
    category: 'social',
    svgPath: '<path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/>',
    tags: ['code', 'git', 'repo']
  }
];

export function getIconByName(name: string): IconDefinition | undefined {
  return BUILT_IN_ICONS.find((i) => i.name.toLowerCase() === name.toLowerCase());
}
