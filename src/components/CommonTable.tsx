/*
 * @Author: lxf
 * @Description: 表格组件
 */
import {defineComponent, onMounted, ref} from 'vue'
import {Table, Empty} from 'ant-design-vue'
import styles from './css/CommonTable.module.less'
export default defineComponent({
  props:{
    columns:{
      type:Array,
      required:true
    },
    data:{
      type:Array,
      required:true,
      default: () => ([])
    },
    loading:{
      type: Boolean,
    },
    rowKey:{
      type:String,
      default:'id'
    },
    maxHeight:{ //表格最高高度
      type:[Number, String],
      default: null
    }
  },
  setup(props) {
    const windowWin = ref(window.innerWidth)

    const setDom = (data) => {
      const html = data.map((item, index) => {
        let children = null
        if (item.children?.length) {
          children = setDom(item.children)
        }
        const htmls = (
          <div key={item.id || index} class={styles.card}>

            { props.columns.map(i => {
              return (
                <div class={'flexBox pt5'}>
                  <div class={'fs15 cardLeft'}>{typeof i.title === 'string' ? `${i.title}:` : typeof i.title === 'function' ? i.title() : i.title}</div>
                  <div class={'ml10 fs15 cardRight'}>
                    { i.customRender ? i.customRender({value: i.dataIndex ? item[i.dataIndex] : item, text: i.dataIndex ? item[i.dataIndex] : item, record: i.dataIndex ? item[i.dataIndex] : item, index: index}) : item[i.dataIndex] }
                  </div>
                </div>
              )
            }) }
            {children ? (
              <div class={'pl20 pt15'}>
                {children}
              </div>
            ) : null}
          </div>
        )
        return htmls
      })
      return html
    }

    onMounted(() => {

    })
    return {
      windowWin,
      setDom,
    }
  },
  render() {
    const {  windowWin, columns, data, loading,
      rowKey, maxHeight, setDom} = this

    return windowWin > 768  ? (
      <div ref = {'tableRef'} class={`${styles.commonTable} ${maxHeight ? styles.overTable : ''}`}>
        <Table
          columns={columns as any}
          dataSource={data}
          rowKey={rowKey}
          pagination={false}
          row-class-name={(_record:any, index:number) => (index % 2 !== 1 ? 'table-striped' : null)}
          scroll={{ x: '100%', y:maxHeight }} // max-content
          loading={loading}

        />
      </div>
    ) : (
      <div class={styles.mobileTable}>
        {
          data && data.length > 0 ? (
            <div>
             <div class={'innerMobileTable'}>
               {setDom(data)}
             </div>
            </div>
          ) : (
           <div class={'mt30'}>
             <Empty />
           </div>
          )
        }
      </div>
    )
  }
})

