import { defineComponent, onMounted, reactive, ref } from 'vue'
import {
  Row, Col, Input, RangePicker, ConfigProvider,
  Button, Tabs, Modal, Tooltip, Tag, Switch, message
} from 'ant-design-vue'
import dayjs from 'dayjs'
import zhCN from 'ant-design-vue/lib/locale/zh_CN'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import EditModel from './components/EditModel'
import NewTab from './components/NewTab'
import BarEchart from './components/BarEchart'
import PieEchart from './components/PieEchart'
import { createDefaultTabList, getTabList, saveTabList, TabItem } from '@/storage/tabListDb'

export default defineComponent({
  setup() {
    const searchDate = ref({
      name: '',
      taskTime: [] as string[],
    })
    const curTab = ref(1)
    const searchList = ref([]) //搜索结果
    const otherData = reactive({
      time: new Date().getTime().toString(),
      curItem: {},
      showEdit: false,
      showTab: false,
      showsearch: false,
      showPie: false,
      loading: true,
    })
    const tabList = ref<TabItem[]>([])
     

    const refreshCharts = () => {
      otherData.showPie = false
      setTimeout(() => {
        otherData.showPie = true
      }, 1000)
    }

    const persistTabList = async () => {
      try {
        await saveTabList(tabList.value)
      } catch (error) {
        message.error('任务数据保存失败')
        throw error
      }
    }

    const loadStoredTabList = async () => {
      otherData.loading = true

      try {
        tabList.value = await getTabList()
      } catch (error) {
        tabList.value = createDefaultTabList()
        message.error('任务数据加载失败，已回退到默认数据')
      } finally {
        if (curTab.value > tabList.value.length) {
          curTab.value = 1
        }

        otherData.loading = false
        otherData.showPie = true
      }
    }
    const columns = ref([
      { title: '任务名称', align: 'center', width: 200, dataIndex: 'name',},
      { title: '优先级', align: 'center', dataIndex: 'level', width: 100,
        sorter: (a: any, b: any) => a.level - b.level,
        sortDirections: ['descend', 'ascend'],
        customRender: ({value}: any) => {
           if(value===1){
             return <Tag color="error">{value}</Tag>
           }else if (value===2){
             return <Tag color="warning">{value}</Tag>
           }else if (value===3){
             return <Tag color="processing">{value}</Tag>
           }
        }
      },
      {
        title: '任务时间',
        align: 'center',
        width: 300,
        ellipsis: {
          showTitle: false,
        },
        customRender: ({value}: any) => {
          return <Tooltip title={dayjs(value.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') + '-' + dayjs(value.endTime * 1000).format('YYYY-MM-DD HH:mm:ss')}>
            <div class={'oneLine'}>
              { dayjs(value.startTime * 1000).format('YYYY-MM-DD HH:mm:ss') } - {  dayjs(value.endTime * 1000).format('YYYY-MM-DD HH:mm:ss')}
            </div> </Tooltip>
        }
      },
      {
        title: '是否完成',
        align: 'center',
        width: 150,
        customRender: ({ value }) => (
          <Switch
            checked={Boolean(value.status)}
            onChange={(e) => changeStatus(e, value)}
          />
        )
      },
      { title: '备注', align: 'center', dataIndex: 'remark', width: 200,
        customRender: ({value}: any) => (
         <Tooltip title={value}>
          <div class={'oneLine'}>{value}</div>
        </Tooltip>
        ),
      },
      { title: '操作',
        key: 'operation',
        align: 'center',
        fixed: 'right',
        width: 150,
        className:'smallHandleTd',
        customRender: ({ value }) => {
          return (
            <div class="flexBox flexcenterX">
              <span class={`edit mr10`} onClick={() => handleReply(value, 'showEdit')}>编辑</span>
              <span class={`edit`} onClick={() => deleteComfirm(value)}>删除</span>
            </div>
          )
        }
      },
    ])
    
    const handleReply = (value: any, type: string) => {
      const state = otherData as Record<string, any>
      otherData.curItem = value
      state[type] = true
    }

    const setModelFn = async (type: string, flag = false, data: Record<string, any> = {}) => {
      const state = otherData as Record<string, any>
      state[type] = false
      otherData.curItem = data

      if (!flag) {
        return
      }

      if (type === 'showEdit') {
        const currentTab = tabList.value[curTab.value - 1]

        if (!currentTab) {
          return
        }

        otherData.showPie = false
        const targetIndex = currentTab.list.findIndex((item: any) => item.id === data.id)

        if (targetIndex !== -1) {
          currentTab.list[targetIndex] = { ...data }
        } else {
          currentTab.list.push({ ...data })
        }

        await persistTabList()
        refreshCharts()
        return
      }

      if (type === 'showTab') {
        const targetIndex = tabList.value.findIndex((item) => item.title === data.title)
        if (targetIndex !== -1) {
          message.error('已有相同名字的任务分类表')
          return
        }
        otherData.showPie = false
        tabList.value.push({ title: data.title, list: [] })
        await persistTabList()
        refreshCharts()
        message.success('新增成功')
      }
    }

    const rangePickerChange = (value: any) => {
      if (!value) {
        searchDate.value.taskTime = []
      }
    }

    const getListHand = () => {
      const { name: searchName, taskTime: searchTaskTime } = searchDate.value
      const currentTabList = tabList.value[curTab.value - 1]?.list || []
      let targetList: any[] = []
      const hasName = !!searchName?.trim()
      const hasValidTaskTime = Array.isArray(searchTaskTime) && searchTaskTime.length === 2

      if (hasName || hasValidTaskTime) {
        targetList = currentTabList.filter((item: any) => {
          const nameMatch = !hasName || item.name?.includes(searchName.trim())
          const timeMatch = !hasValidTaskTime
            ? true
            : Number(item.startTime) <= Number(searchTaskTime[0]) &&
              Number(item.endTime) >= Number(searchTaskTime[1])

          return nameMatch && timeMatch
        })

        otherData.showsearch = true
      } else {
        otherData.showsearch = false
      }

      searchList.value = targetList
      return targetList
    }

    const onEdit = (targetKey: string | MouseEvent, action: string) => {
      if (action === 'remove') {
        Modal.confirm({
          title: '删除',
          icon: <ExclamationCircleFilled />,
          content: '是否确认删除整个任务表?',
          onOk: async () => {
            const targetIndex = Number(targetKey) - 1

            if (Number.isNaN(targetIndex)) {
              return
            }

            otherData.showPie = false
            tabList.value.splice(targetIndex, 1)
            await persistTabList()
            curTab.value = 1
            refreshCharts()
          },
          onCancel() {},
        })
        return
      }

      handleReply({}, 'showTab')
    }

    const deleteComfirm = (data: Record<string, any>) => {
      Modal.confirm({
        title: '删除',
        icon: <ExclamationCircleFilled />,
        content: '是否确认删除这个任务',
        onOk: async () => {
          const currentTab = tabList.value[curTab.value - 1]

          if (!currentTab) {
            return
          }

          const targetIndex = currentTab.list.findIndex((item: any) => item.id === data.id)

          if (targetIndex !== -1) {
            currentTab.list.splice(targetIndex, 1)
          }

          await persistTabList()
          refreshCharts()
        },
        onCancel() {},
      })
    }

    const changeStatus = async (checked: boolean, item: Record<string, any>) => {
      const data = {
        ...item,
        status: checked,
      }

      await setModelFn('showEdit', true, data)
      return checked ? message.success('恭喜你已完成任务') : message.error('任务已标记为未完成')
    }

    const onchange = (value: string | number) => {
      otherData.showPie = false
      curTab.value = Number(value)
      setTimeout(() => {
        otherData.showPie = true
      }, 1000)
    }

    onMounted(() => {
      void loadStoredTabList()
    })

    return {
      searchDate,
      otherData,
      rangePickerChange,
      getListHand,
      curTab,
      onchange,
      tabList,
      onEdit,
      columns,
      setModelFn,
      handleReply,
      searchList
    }
  },
  render () {
    const {otherData, searchDate, rangePickerChange, getListHand, curTab, onchange,
      tabList, onEdit, columns, setModelFn, handleReply, searchList
    } = this
    const activeTab = tabList[curTab - 1]
    return (
      <div id={otherData.time as string} class={`pt30`}>
        <div class="bg-f9 container">
          <div class="containerbox">
            <div>
              <Row align="middle" gutter={40}>
                <Col sm={24} md={6} class={'mt10'}>
                    <Input placeholder={'任务名称'}
                           v-model={[searchDate.name, 'value']}
                           allowClear
                    />
                </Col>
                <Col sm={24} md={9} class={'mt10'}>
                  <ConfigProvider locale={zhCN}>
                  <RangePicker
                    valueFormat="X"
                    placeholder={[`任务时间开始`, `任务时间截止`]}
                    format={'YYYY-MM-DD HH:mm:ss'}
                    v-model={[searchDate.taskTime, 'value']}
                    showTime={{
                      defaultValue: [
                        dayjs('00:00:00', 'HH:mm:ss'),
                        dayjs('23:59:59', 'HH:mm:ss')
                      ]
                    }}
                    onChange={rangePickerChange}
                  />
                  </ConfigProvider>
                </Col>
                <Col sm={24} md={6} class={'mt10'}>
                  <Button type="primary"  onClick={getListHand}>查询</Button>
                </Col>
              </Row>
              <Tabs activeKey={curTab} type="editable-card" class={'mt15'}
                    onChange={(e) => onchange(e as number)}
                    onEdit={onEdit}>
                  {tabList.map((item, index) => {
                    return (<Tabs.TabPane tab={item.title} key={index+1} closable={tabList.length>1?true:false}>
                      <div>
                        <div class={'mb10'}>
                          <Button type="primary"  onClick={()=>handleReply({}, 'showEdit')}>新增任务</Button>
                        </div>
                        <div class="tableWrap mt10">
                          <common-table
                            columns={columns}
                            data={!otherData.showsearch?item.list:searchList}
                            rowKey="id"
                            pagination={false}
                            loading={otherData.loading}
                            maxHeight={'200px'}
                          />
                        </div>
                      </div>
                    </Tabs.TabPane>)
                  })}
              </Tabs>

            </div>
            {otherData.showPie && activeTab && <Row gutter={[10, 10]}>
              <Col xs={{span:24}} md={{span:12}}>
                <div class={'mt20 ml10'}>分类比</div>
                <BarEchart curItem={{tabList:tabList}} />
              </Col>
              <Col xs={{span:24}} md={{span:12}}>
                <div class={'mt20 ml10'}>{tabList[curTab-1].title}-完成比</div>
                  <PieEchart curItem={{id:curTab, orderData:[...tabList[curTab-1].list], title:tabList[curTab-1].title}} />
              </Col>
            </Row>}
          </div>
          {otherData.showEdit && <EditModel isModalVisible={otherData.showEdit} curItem={{ ...otherData.curItem, time: otherData.time }} onSetModelFn={setModelFn} />}
          {otherData.showTab && <NewTab isModalVisible={otherData.showTab} curItem={{ ...otherData.curItem, time: otherData.time }} onSetModelFn={setModelFn} />}
        </div>
      </div>
    )
  }
})
