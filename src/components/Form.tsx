/*
 * @Author: lxf
 * @Description: 创建表单
 */
import {defineComponent, ref, reactive, computed} from 'vue'
import {Row, Col, Input, Select, Form,  DatePicker, ConfigProvider} from 'ant-design-vue'
import styles from './css/Form.module.less'
import dayjs from 'dayjs'
import zhCN from "ant-design-vue/lib/locale/zh_CN"

export default defineComponent({
  props: {
    formArray: { // 表单配置数据
      type: Array,
      required: true,
      default: () => ([])
    },
    rules: { // 表单规则
      type: Object,
      required: true
    },
    formAttr: { // 表单属性
      type: Object,
      default: () => ({})
    },
    defaultData: { // 表单初始值
      type: Object,
      default: () => ({})
    },
    custom: {
      type: Object,
      default: () => ({})
    }
  },
  setup(props) {
    const ruleForm = ref<any>(null)
    const formData  = reactive(props.defaultData)
    const currentSize = ref()
    // const momentTime = (time:string, format:string) => {
    //   return moment(time, format)
    // }

    // select的搜索
    const filterOption = (input: string, option: any) => {
      return option.label?.toLowerCase()?.indexOf(input.toLowerCase()) >= 0
    }

    // 验证表单返回数据
    const onFinish = () => {
      return new Promise((resolve, reject) => {
        ruleForm.value.validateFields().then(() => {
          resolve(formData)
        }).catch((err:any) => {
          console.log(err)
          reject(err)
        })
      })
    }
    // 获取表单的值
    const getFromValue = () => {
      return formData
    }

    const formSetArray = computed(() => {
      return props.formArray.filter((item:any) => {
        return !item.checkShow || item.checkShow(formData)
      })
    })

    const selectChange = (val, item) => {
      if (item.attrs?.mode  && item.attrs?.maxlength && formData[item.prop].length >= item.attrs?.maxlength) {
        formData[item.prop] = formData[item.prop].slice(0, item.attrs.maxlength)
      }
    }



    const inputValueNum = (val) => {
      currentSize.value = val
    }

    return {
      ruleForm,
      formSetArray,
      formData,
      currentSize,
      onFinish,
      // momentTime,
      getFromValue,
      filterOption,
      selectChange,
      inputValueNum,
    }
  },
  render(props: any) {
    const { RangePicker } = DatePicker
    const { formAttr, rules, custom } = props
    const { formSetArray, formData, filterOption, selectChange, inputValueNum, currentSize } = this

    return(
      <Form
        ref={'ruleForm'}
        {...formAttr}
        model={formData}
        rules={rules}
        class={styles.forms}
      >
        <Row align="">
          {
            formSetArray.map((item: any) => {
              return (
                <Col span={item.col} {...item.colAttr} class={item.class}>
                    <Form.Item
                      name={item.prop}
                      label={item.label}
                      {...item.itemAttrs}
                    >
                      {
                        item.type === 'input' && (
                          item.trim?<Input v-model={[formData[item.prop], 'value', ['trim']]} {...item.attrs} placeholder={item.placeholder || `请输入${item.label}`} v-slots={item.slots} />:<Input v-model={[formData[item.prop], 'value', currentSize]} {...item.attrs} placeholder={item.placeholder || `请输入${item.label}`} onChange={e => inputValueNum(e.target.value?.length) }  v-slots={item.slots} />
                        ) || item.type === 'textarea' && (
                          <Input.TextArea v-model={[formData[item.prop], 'value']}  {...item.attrs} placeholder={item.placeholder || `请输入${item.label}`}/>
                        )  || item.type === 'select' && (
                          <Select
                            v-model={[formData[item.prop], 'value']}
                            showSearch
                            dropdownMatchSelectWidth={false}
                            filterOption={filterOption}
                            options={item.options}
                            {...item.attrs}
                            placeholder={item.placeholder || `请选择${item.label}`}
                            onChange={(val) => { selectChange(val, item) }}
                          ></Select>
                        ) || item.type === 'rangeDate' && (
                          <ConfigProvider locale={zhCN}>
                            <RangePicker
                              format={item.format || 'YYYY-MM-DD HH:mm:ss'}
                              v-model={[formData[item.prop], 'value']}
                              valueFormat="X" // value格式
                              showTime={{
                                defaultValue: item.defaultTime || [
                                  dayjs('00:00:00', 'HH:mm:ss'),
                                  dayjs('23:59:59', 'HH:mm:ss')
                                ]
                              }}
                              {...item.attrs}
                            />
                          </ConfigProvider>
                        ) || item.type === 'customScope' && (
                          custom[item.prop] && custom[item.prop]()
                        )
                      }
                      { item.tips && <div class={'c-666'}>{item.tips}</div>}
                    </Form.Item>
                </Col>
              )
            })
          }
        </Row>
      </Form>
    )
  }
})
