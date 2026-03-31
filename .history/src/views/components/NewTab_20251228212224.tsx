/*
 * @Descripttion: 新增标签
 * @Author: lxf
 */
import {computed, defineComponent, onMounted, reactive, ref} from 'vue'
import FormCreate from '@/components/Form'
import { message } from 'ant-design-vue'

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

    })
    const ruleForm = ref<any>(null)
    const formArray =  [
      {
        label: '标签名称',
        prop: 'title',
        col: '24',
        type: 'input',
      },

    ]

    const rules = computed(() => (
      {
        title: [{required: true, message:  '请输入标签名称'}]
      }
    ))

    const handleCancel = ()=>{
      emit('setModelFn', 'showTab', false, {})
    }

    const handleOk = async()=>{
      await ruleForm.value.onFinish()
      const params = {
        ...defaultForm,
      }
      message.success('新增成功')
      emit('setModelFn', 'showTab', true, params)
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
          title: '新增标签',
          idWrap: curItem.time,
          width: '50%',
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
                formAttr={{labelCol: {span: 4}}}
                formArray={formArray}
                rules={rules}
                defaultData={defaultForm}
              />
            </div>
          )
        }}
      />
    )
  }
})