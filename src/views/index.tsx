import { defineComponent, reactive, ref  } from 'vue'
import { Row,
  Col,
  Input,
  RangePicker,
  ConfigProvider,
  Button,
  Tabs,
  Modal,
  Tooltip,
  Tag,
  Switch
} from 'ant-design-vue'
import styles from '../assets/css/index.less'
import dayjs from "dayjs"
import zhCN from 'ant-design-vue/lib/locale/zh_CN'
import { ExclamationCircleFilled } from '@ant-design/icons-vue'
import EditModel from './components/EditModel'
import NewTab from "@/views/components/NewTab"

export default defineComponent({
  setup() {
    const searchDate = ref({
      name: [],
      taskTime: '',
    })
    const curTab = ref(1)
    const otherData = reactive({
      time: new Date().getTime().toString(),
      curItem:{},
      showEdit:false,
      showTab:false
    })
    const tabList = ref(localStorage.getItem('tabList') ? JSON.parse(localStorage.getItem('tabList')) :
      [
        {title: '工作', list:[{
            id:1,
            name: 'demo',
            level: 1,
            startTime: 1764518400,
            endTime: 1767196799,
            status:0,
            remark: 'demoresfafasffsffsfsfsfmark',
          }, {
              id:2,
              name: 'demo',
              level: 1,
              startTime: 1764518400,
              endTime: 1767196799,
              status:0,
              remark: 'demoresfafasffsffsfsfsfmark',
            },{
              id:3,
              name: 'demsso',
              level: 2,
              startTime: 1764518400,
              endTime: 1767196799,
              status:0,
              remark: 'demoresfafasffsffsfsfsfmark',
            },]},
        {title: '生活', list:[]},
        {title: '学习', list:[]}
      ]
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
        title: '完成状态',
        align: 'center',
        dataIndex: 'status',
        width: 150,
        customRender: ({ status }) => (
          <Switch
            disabled={true}
            checked={Boolean(status)}
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
    const setModelFn = (type: string, flag = true, data={}) => {
      otherData[type] = false
      otherData.curItem = data
      if (flag) {
        //更新
        if (type === 'showEdit'){
          const arr = tabList.value[curTab.value - 1].list
          const targetIndex = arr.findIndex(item => item.id === data.id)
          if (targetIndex !== -1) {
            tabList.value[curTab.value - 1].list[targetIndex] = {...data}
          } else {
            tabList.value[curTab.value - 1].list.push({...data})
          }
          localStorage.setItem('tabList', JSON.stringify(tabList.value))
        }else if(type === 'showTab'){
          tabList.value.push({title: data.title, list:[]})
          localStorage.setItem('tabList', JSON.stringify(tabList.value))
        }
      }
    }
    const rangePickerChange = (e:any)=>{
      console.log(e, 99)
      if (!e) {
        searchData.value.date = []
      }
    }
    const getListHand = () => {

    }
    const onEdit = (targetKey: string | MouseEvent, action: string) => {
      console.log(targetKey, action)
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
    const onchange = (e) => {
      curTab.value=e
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
    }
  },
  render () {
    const {otherData, searchDate, rangePickerChange, getListHand, curTab, onchange,
      tabList, onEdit, columns, setModelFn, handleReply,
    } = this
    console.log(tabList, 77)
    return (
      <div id={otherData.time as string} class={`${styles.container} page`}>
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
                  <Button type="primary" class={`${styles.btn}`} onClick={getListHand}>查询</Button>
                </Col>
              </Row>
              <Tabs activeKey={curTab} type="editable-card" class={'mt20'}
                    onChange={(e) => onchange(e as number)}
                    onEdit={onEdit}>
                  {tabList.map((item, index) => {
                    return (<Tabs.TabPane tab={item.title} key={index+1} closable>
                      <div>
                        <div class={'mb10'}>
                          <Button type="primary" class={`${styles.btn}`} onClick={()=>handleReply({}, 'showEdit')}>新增事项</Button>
                        </div>
                        <div class="tableWrap mt20">
                          <common-table
                            columns={columns}
                            data={item.list}
                            attr={{bordered: 'bordered'}}
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
          </div>
          {otherData.showEdit && <EditModel isModalVisible={otherData.showEdit} curItem={{ ...otherData.curItem, time: otherData.time }} onSetModelFn={setModelFn} />}
          {otherData.showTab && <NewTab isModalVisible={otherData.showTab} curItem={{ ...otherData.curItem, time: otherData.time }} onSetModelFn={setModelFn} />}
        </div>
      </div>
    )
  }
})
