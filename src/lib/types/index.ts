export interface MenuItem {
  icon: string
  label: string
  component: string
  action?: () => void
}

export interface Message {
  role: string
  content: string
}

export interface Bookmark {
  dateAdded: number | undefined
  id: string | undefined
  index: number | undefined
  parentId: string | undefined
  title: string | undefined
  url: string | undefined
  children: Bookmark[] | undefined
  dateGroupModified: number | undefined
}

export interface History {
  id: string
  title: string
  url: string
  lastVisitTime: number
}
