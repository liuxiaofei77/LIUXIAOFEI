import Dexie, { Table } from 'dexie'

export interface TaskItem {
  [key: string]: any
}

export interface TabItem {
  key?: number
  title: string
  list: TaskItem[]
}

interface StorageRecord<T> {
  key: string
  value: T
  updatedAt: number
}

const STORAGE_KEY = 'tabList'
const LEGACY_STORAGE_KEY = 'tabList'

const defaultTabList: TabItem[] = [
  {
    title: '工作',
    key: 1,
    list: [
      {
        id: 2,
        name: 'demo',
        level: 1,
        startTime: 1764518400,
        endTime: 1767196799,
        remark: 'demoresfafasffsffsfsfsfmark',
        status: false,
      },
      {
        time: '1768123423324',
        name: '项目1',
        level: 3,
        remark: '完成项目1跟踪',
        id: '1766916857504',
        startTime: '1762444800',
        endTime: '1768060799',
        status: true,
      },
      {
        time: '1766928270484',
        name: '项目2',
        level: 2,
        id: '1766928495586',
        startTime: '1764691200',
        endTime: '1766213635',
      },
    ],
  },
  {
    title: '生活',
    key: 2,
    list: [
      {
        time: '1766916773375',
        name: '刷牙',
        level: 1,
        id: '1766916910118',
        startTime: '1766937600',
        endTime: '1766969999',
      },
      {
        time: '1766916773375',
        name: '洗脸',
        level: 2,
        id: '1766916940994',
        startTime: '1766937600',
        endTime: '1766973599',
      },
    ],
  },
  {
    title: '学习',
    list: [
      {
        time: '1768123423324',
        name: '数学',
        level: 1,
        remark: '数学作业',
        id: '1768123711147',
        startTime: '1767196800',
        endTime: '1769788799',
        status: true,
      },
      {
        time: '1768123423324',
        name: '语文',
        level: 2,
        status: false,
        remark: '学习语文',
        id: '1768123744820',
        startTime: '1767196800',
        endTime: '1801411199',
      },
    ],
  },
  {
    title: '娱乐',
    list: [
      {
        time: '1768123423324',
        name: '甄嬛传',
        level: 3,
        remark: '第3集',
        id: '1768123781374',
        startTime: '1767283200',
        endTime: '1768665599',
      },
    ],
  },
]

const cloneTabList = (tabList: TabItem[]) => JSON.parse(JSON.stringify(tabList)) as TabItem[]

export const createDefaultTabList = () => cloneTabList(defaultTabList)

class AppDatabase extends Dexie {
  settings!: Table<StorageRecord<TabItem[]>, string>

  constructor() {
    super('sunshelt-db')
    this.version(1).stores({
      settings: '&key',
    })
  }
}

const db = new AppDatabase()

const readLegacyTabList = (): TabItem[] | null => {
  if (typeof window === 'undefined') {
    return null
  }

  const rawTabList = window.localStorage.getItem(LEGACY_STORAGE_KEY)

  if (!rawTabList) {
    return null
  }

  try {
    return JSON.parse(rawTabList)
  } catch (error) {
    return null
  }
}

export const saveTabList = async (tabList: TabItem[]) => {
  await db.settings.put({
    key: STORAGE_KEY,
    value: cloneTabList(tabList),
    updatedAt: Date.now(),
  })
}

export const getTabList = async (): Promise<TabItem[]> => {
  const storedTabList = await db.settings.get(STORAGE_KEY)

  if (storedTabList) {
    return cloneTabList(storedTabList.value || [])
  }

  const legacyTabList = readLegacyTabList()
  const nextTabList = legacyTabList || createDefaultTabList()

  await saveTabList(nextTabList)

  if (legacyTabList && typeof window !== 'undefined') {
    window.localStorage.removeItem(LEGACY_STORAGE_KEY)
  }

  return cloneTabList(nextTabList)
}
