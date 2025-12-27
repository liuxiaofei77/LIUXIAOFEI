import { defineComponent, reactive } from 'vue'
import { Row,
  Col,
  Input,
} from 'ant-design-vue'
import styles from '../assets/css/index.less'

export default defineComponent({
  setup() {
    const otherData = reactive({
      time: new Date().getTime().toString(),
    })
    return {
      otherData
    }
  },
  render () {
    const {otherData} = this
    return (
      <div id={otherData.time as string} class={`${styles.container} page`}>
        <div class="bg-f9">
          <div class="container pt20 pb20 pl30 pr30">
            <div>
              <Row align="middle" gutter={40}>
                <Col span={4}>
                  <div class={`pb15 form`}>
                    <Input
                      type={'text'}
                      placeholder={` sfa`}
                      value={''}
                    />
                  </div>
                </Col>
                <Col span={4}>
                  <div class={`pb15 form`}>
                   发顺丰
                  </div>
                </Col>
              </Row>
            </div>
          </div>
        </div>
      </div>
    )
  }
})
