import type { Language } from "../types/settings";

export const translations = {
  en: {
    // Toolbar
    openFolder: "Open Folder",
    scanning: "Scanning...",
    searchPlaceholder: "Search cards...",
    sortBy: "Sort by",
    sortTitleAsc: "Title(▲)",
    sortTitleDesc: "Title(▼)",
    sortCreatedAsc: "Created(▲)",
    sortCreatedDesc: "Created(▼)",
    sortUpdatedAsc: "Updated(▲)",
    sortUpdatedDesc: "Updated(▼)",
    sortSizeAsc: "Size(▲)",
    sortSizeDesc: "Size(▼)",
    recentFolders: "Recent Folders",
    noRecentFolders: "No recent folders",
    clearRecent: "Clear Recent",

    // Settings Panel
    displaySettings: "Display Settings",
    columnCount: "Columns",
    titleFontSize: "Title Size",
    bodyFontSize: "Body Size",
    titleLines: "Title Lines",
    previewLines: "Preview Lines",
    scanDepth: "Folder Depth",
    language: "Language",
    unlimited: "Unlimited",
    layers: "layers",

    // Card Detail
    createdAt: "Created",
    updatedAt: "Updated",
    words: "words",
    edit: "Edit",
    delete: "Delete",
    save: "Save",
    cancel: "Cancel",

    // Status Bar
    cards: "cards",

    // Dialog
    confirmDelete: "Confirm Delete",
    confirmDeleteMessage: "Are you sure you want to delete this card? This action cannot be undone.",

    // Empty State
    emptySelectFolder: "Click \"Open Folder\" to select a directory with .md files",
    emptyNoMatch: "No matching cards found",
    emptyNoFiles: "No .md files in this directory",
  },
  zh: {
    // Toolbar
    openFolder: "打开文件夹",
    scanning: "扫描中...",
    searchPlaceholder: "搜索卡片...",
    sortBy: "排序",
    sortTitleAsc: "标题(▲)",
    sortTitleDesc: "标题(▼)",
    sortCreatedAsc: "创建时间(▲)",
    sortCreatedDesc: "创建时间(▼)",
    sortUpdatedAsc: "更新时间(▲)",
    sortUpdatedDesc: "更新时间(▼)",
    sortSizeAsc: "大小(▲)",
    sortSizeDesc: "大小(▼)",
    recentFolders: "最近文件夹",
    noRecentFolders: "无最近文件夹",
    clearRecent: "清除记录",

    // Settings Panel
    displaySettings: "显示设置",
    columnCount: "显示列数",
    titleFontSize: "标题字号",
    bodyFontSize: "正文字号",
    titleLines: "标题行数",
    previewLines: "预览行数",
    scanDepth: "文件夹深度",
    language: "语言",
    unlimited: "无限制",
    layers: "层",

    // Card Detail
    createdAt: "创建于",
    updatedAt: "更新于",
    words: "字",
    edit: "编辑",
    delete: "删除",
    save: "保存",
    cancel: "取消",

    // Status Bar
    cards: "张",

    // Dialog
    confirmDelete: "确认删除",
    confirmDeleteMessage: "确定删除这张卡片？此操作无法撤销。",

    // Empty State
    emptySelectFolder: "点击「打开文件夹」选择一个包含 .md 文件的目录",
    emptyNoMatch: "没有找到匹配的卡片",
    emptyNoFiles: "该目录下没有 .md 文件",
  },
} as const;

export type TranslationKey = keyof typeof translations.en;

export function t(key: TranslationKey, language: Language): string {
  return translations[language][key] || translations.en[key] || key;
}
