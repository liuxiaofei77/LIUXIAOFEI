/*
 * @Descripttion: 新增编辑
 * @Author: lxf
 */
import {computed, defineComponent, onMounted, reactive, ref} from 'vue'
import FormCreate from '@/components/Form'
import { message } from 'ant-design-vue'
import dayjs from "dayjs"

export default defineComponent({
  props: {
    isModalVisible: {
      type: Boolean,
      required: true
    },
    curItem: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  setup(props, {emit}:any) {
    const defaultForm = reactive<any>({
      ...props.curItem,
      taskTime:props.curItem.startTime?[props.curItem.startTime, props.curItem.endTime]:[]
    })
    const ruleForm = ref<any>(null)
    const formArray =  [
      {
        label: '任务名称',
        prop: 'name',
        col: '24',
        type: 'input',
      },
      {
        label: '优先级',
        prop: 'level',
        col: '24',
        type: 'select',
        options:[{value:1, label:1}, {value:2, label:2}, {value:3, label:3}]
      },
      {
        label: '是否完成',
        prop: 'status',
        col: '24',
        type: 'switch'
      },
      {
        label: '任务时间',
        prop: 'taskTime',
        col: '24',
        type: 'rangeDate',
        format: 'YYYY-MM-DD HH:mm:ss',
        attrs: {
          showTime: { defaultValue: [dayjs('00:00:00', 'HH:mm:ss'), dayjs('23:59:59', 'HH:mm:ss')] },
        }
      },
      {
        label: '备注',
        prop: 'remark',
        col: '24',
        type: 'textarea',
        attrs: {
          autoSize: {minRows: 2, maxRows: 2}, maxlength: 100, showCount: true,
          placeholder: '请输入备注'
        },
      }
    ]

    const rules = computed(() => (
      {
        name: [{required: true, message:  '请输入任务名称'}],
        level: [{required: true, message:  '请选择优先级'}],
        taskTime: [{required: true, message:  '完成时间不能为空'}],
      }
    ))

    const handleCancel = ()=>{
      emit('setModelFn', 'showEdit', false, {})
    }

    const handleOk = async()=>{
      await ruleForm.value.onFinish()
      const params = {
        ...defaultForm,
        id: props.curItem.id||new Date().getTime().toString(),
        startTime:defaultForm.taskTime[0],
        endTime:defaultForm.taskTime[1]
      }
      delete params.taskTime
      message.success('保存成功')
      emit('setModelFn', 'showEdit', true, params)
    }

    onMounted(async () => {

    })
    return {
      formArray,
      defaultForm,
      rules,
      ruleForm,
      handleCancel,
      handleOk,
    }
  },
  render() {
    const { isModalVisible, curItem, formArray, defaultForm, rules, handleCancel, handleOk } = this
    return (
      <common-modal
        {...{
          visible: isModalVisible,
          title: curItem.id?'编辑任务':'新增任务',
          idWrap: curItem.time,
          width: '60%',
          onHandleCancel: handleCancel,
          onHandleOk: handleOk,
          cancelText:'取消',
          okText:'确认'
        }}
        v-slots={{
          content: () => (
            <div>
              <FormCreate
                ref={'ruleForm'}
                formAttr={{labelCol: {span:4}}}
                formArray={formArray}
                rules={rules}
                class={'forms'}
                defaultData={defaultForm}
              />
            </div>
          )
        }}
      />
    )
  }
})