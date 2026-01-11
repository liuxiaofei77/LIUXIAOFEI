import { defineComponent, reactive, ref  } from 'vue'
import {
  Row, Col, Input, RangePicker, ConfigProvider,
  Button, Tabs, Modal, Tooltip, Tag, Switch, message
} from 'ant-design-vue'
import dayjs from "dayjs"
import zhCN from 'ant-design-vue/lib/locale/zh_CN'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import EditModel from './components/EditModel'
import NewTab from "./components/NewTab"
import BarEchart from "./components/BarEchart"
import PieEchart from "./components/PieEchart"

export default defineComponent({
  setup() {
    const searchDate = ref({
      name: '',
      taskTime: [],
    })
    const curTab = ref(1)
    const searchList = ref([]) //搜索结果
    const otherData = reactive({
      time: new Date().getTime().toString(),
      curItem:{},
      showEdit:false,
      showTab:false,
      showsearch:false,
      showPie:true
    })
    const tabList = ref(localStorage.getItem('tabList') ? JSON.parse(localStorage.getItem('tabList')) :
      [{"title":"工作","key":1,"list":[{"id":2,"name":"demo","level":1,"startTime":1764518400,"endTime":1767196799,"remark":"demoresfafasffsffsfsfsfmark","status":false},{"id":3,"name":"demsso","level":2,"startTime":1764518400,"endTime":1767196799,"remark":"demoresfafasffsffsfsfsfmark","time":"1768036775958","status":true},{"id":"1766916518224","time":"1766916773375","name":"对接","level":3,"remark":"对接同事","startTime":"1764604800","endTime":"1766851199","status":true},{"time":"1766916773375","name":"项目1","level":1,"remark":"完成项目1跟踪","id":"1766916857504","startTime":"1762444800","endTime":"1768060799"},{"time":"1766928270484","name":"项目2","level":2,"id":"1766928495586","startTime":"1764691200","endTime":"1766213635"},{"time":"1768039289888","name":"付大夫","level":2,"id":"1768039323875","startTime":"1767196800","endTime":"1767974399"}]},{"title":"生活","key":2,"list":[{"time":"1766916773375","name":"刷牙","level":1,"id":"1766916910118","startTime":"1766937600","endTime":"1766969999"},{"time":"1766916773375","name":"洗脸","level":2,"id":"1766916940994","startTime":"1766937600","endTime":"1766973599"}]},{"title":"学习","list":[]},{"title":"的哦莫demo","list":[]}]
    )
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
            <div class="flexBox flexcenterX flexWrap2">
              <span class={`edit mr10`} onClick={() => handleReply(value, 'showEdit')}>编辑</span>
              <span class={`edit`} onClick={() => deleteComfirm(value)}>删除</span>
            </div>
          )
        }
      },
    ])
    // 处理弹窗显示
    const handleReply = (value: any, type: string) => {
      otherData.curItem = value
      otherData[type] = true
    }
    // 处理弹窗
    const setModelFn = (type: string, flag = false, data={}) => {
      otherData[type] = false
      otherData.curItem = data
      if (flag) {
        //更新
        if (type === 'showEdit'){
          otherData.showPie=false
          const arr = tabList.value[curTab.value - 1].list
          const targetIndex = arr.findIndex(item => item.id === data.id)
          if (targetIndex !== -1) {
            tabList.value[curTab.value - 1].list[targetIndex] = {...data}
          } else {
            tabList.value[curTab.value - 1].list.push({...data})
          }
          localStorage.setItem('tabList', JSON.stringify(tabList.value))
          setTimeout(()=>{
            otherData.showPie=true
          }, 1000)
        }else if(type === 'showTab'){
          otherData.showPie=false
          tabList.value.push({title: data.title, list:[]})
          localStorage.setItem('tabList', JSON.stringify(tabList.value))
          setTimeout(()=>{
            otherData.showPie=true
          }, 1000)
        }
      }
    }
    const rangePickerChange = (e:any)=>{
      if (!e) {
        searchDate.value.taskTime = []
      }
    }
    const getListHand = () => {
      // 1. 解构赋值+语义化命名，减少重复访问，提升可读性
      const { name: searchName, taskTime: searchTaskTime } = searchDate.value
      // 2. 空值保护：避免curTab越界、list不存在导致报错，兜底空数组
      const currentTabList = tabList.value[curTab.value - 1]?.list || []
      let targetList = []

      // 3. 提取搜索条件，简化后续判断（提前处理模糊搜索和时间数组有效性）
      const hasName = !!searchName?.trim() // 排除空字符串、全空格的无效名称
      const hasValidTaskTime = Array.isArray(searchTaskTime) && searchTaskTime.length === 2

      // 4. 整合过滤逻辑，避免多分支重复调用filter，逻辑更清晰
      if (hasName || hasValidTaskTime) {
        targetList = currentTabList.filter((item) => {
          // 条件1：名称模糊匹配（无效名称时直接通过）
          const nameMatch = !hasName || item.name?.includes(searchName.trim())
          // 条件2：时间范围匹配（无效时间时直接通过）
          const timeMatch = !hasValidTaskTime ? true : (item.startTime <= searchTaskTime[0] && item.endTime >= searchTaskTime[1])

          // 组合条件：“且”逻辑（与你的原分支逻辑一致）
          return nameMatch && timeMatch
        })

        otherData.showsearch = true
      } else {
        // 无有效搜索条件时的处理
        otherData.showsearch = false
      }

      // 5. 统一赋值并返回结果，避免重复赋值
      searchList.value = targetList
      return targetList
    }
    const onEdit = (targetKey: string | MouseEvent, action: string) => {
      // console.log(targetKey, action)
      if(action==='remove'){
          Modal.confirm(
            {
              title: '删除',
              icon: <ExclamationCircleFilled />,
              content: '是否确认删除整个任务表',
              onOk: () => {
                tabList.value.splice(targetKey-1, 1)
                localStorage.setItem('tabList', JSON.stringify(tabList.value))
                console.log(tabList.value)
              },
              onCancel() {},
            }
          )
      }else{
        handleReply({}, 'showTab')
      }

    }
    const deleteComfirm = (data) => {
      Modal.confirm(
        {
          title: '删除',
          icon: <ExclamationCircleFilled />,
          content: '是否确认删除这个任务',
          onOk: () => {
            const arr = tabList.value[curTab.value-1].list
            const targetIndex = arr.findIndex(item => item.id === data.id)
            if (targetIndex !== -1) {
              tabList.value[curTab.value-1].list.splice(targetIndex, 1)
            }
            localStorage.setItem('tabList', JSON.stringify(tabList.value))
          },
          onCancel() {},
        }
      )
    }
    const changeStatus = (e, item) => {
      const data = {
        ...item,
        status:e
      }
      setModelFn('showEdit', true, data)
      return e ? message.success('恭喜你已完成任务') : message.error('未完成任务')
    }
    const onchange = (e) => {
      otherData.showPie=false
      curTab.value=e
      setTimeout(()=>{
        otherData.showPie=true
      }, 1000)
    }
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
    // console.log(tabList, 77)
    return (
      <div id={otherData.time as string} class={`page`}>
        <div class="bg-f9">
          <div class="container pt10 pb20 pl30 pr30">
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
              <Tabs activeKey={curTab} type="editable-card" class={'mt20'}
                    onChange={(e) => onchange(e as number)}
                    onEdit={onEdit}>
                  {tabList.map((item, index) => {
                    return (<Tabs.TabPane tab={item.title} key={index+1} closable={tabList.length>1?true:false}>
                      <div>
                        <div class={'mb10'}>
                          <Button type="primary"  onClick={()=>handleReply({}, 'showEdit')}>新增任务</Button>
                        </div>
                        <div class="tableWrap mt20">
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
            {otherData.showPie&&<Row gutter={[10, 10]}>
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
