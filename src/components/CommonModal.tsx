/*
 * @Author: lxf
 * @Description: 通用弹窗
 */
import { defineComponent } from 'vue'
import { Modal } from 'ant-design-vue'
export default defineComponent({
  props:{
    title:{
      type:String,
      required:true
    },
    visible:{
      type:Boolean,
      required:true
    },
    // 过载元素的id
    idWrap:{
      type:String,
      required:true
    },
    footer: { // 底部
      type:[Boolean, Array],
      default:undefined
    },
  },
  setup() {
    return {
    }
  },
  render(props:any) {
    const { title, visible, idWrap, footer, $emit, $slots } = this
    const routeDiv = document.getElementById(idWrap)
    return (
      routeDiv && (
        <Modal
          open={ visible }
          title={ title }
          mask={ false }
          getContainer={ () => routeDiv}
          footer={footer}
          onOk={ () => $emit('handleOk') }
          onCancel={ (e) => $emit('handleCancel', e) }
          { ...props.$attrs }
        >
          <div class="modalCont">
            { $slots.content && $slots.content() }
          </div>
        </Modal>
      )
    )
  }
})
