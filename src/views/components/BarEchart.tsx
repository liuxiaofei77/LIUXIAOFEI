/*
 * @Author: lxf
 * @Description: 柱壮图
 */
import {defineComponent, onMounted} from 'vue'
// import '../../../public/static/echarts.min.js'

export default defineComponent({
  props: {
    curItem: {
      type: Object,
      required: true,
      default: () => {
        return {}
      }
    }
  },
  setup(props) {
    // 初始化 echarts
    const domaininitEchart = ()=>{
      const myChart= window.echarts.init(document.getElementById('barchart') as HTMLElement)
      const xlist = props.curItem.tabList.map(item=> item.title)||[]
      const ylist = props.curItem.tabList.map(item=>item.list.length)||[]
      const option = {
        tooltip: {
          trigger: 'axis',
          textStyle:{
            color:'#333',
          },
        },
        grid:{
          align:'center',
          top:"20px",
          left:"30px",
          bottom:'0px',
          right: '0px',
          // containLabel: true
        },
        yAxis: {
          axisTick: {
            show: false
          },
          axisLine: {
            show: false,
            lineStyle: {
              color: '#333',
            },
          },

          splitLine: {
            show: true,
            lineStyle: {
              width: 1,
              type: 'dashed',
              color: '#333',
              opacity:0.5,
            }
          },
        },
        xAxis: {
          type: 'category',
          data:xlist,
          axisTick: {
            show: false,
          },
          axisLabel: {
            show: true,
            interval: 0,
            fontSize: 10,
            lineHeight: 10,
            margin: 10,
            color: '#333',
            align: 'center',
            rotate:0,
            formatter:  (value)=> { //x轴的文字改为竖版显示
              let ret = "" //拼接加\n返回的类目项
              const maxLength = 4 //每项显示文字个数
              const valLength = value.length //X轴类目项的文字个数
              const rowN = Math.ceil(valLength / maxLength)  //类目项需要换行的行数
              if (rowN > 1){   //如果类目项的文字大于3,
                for (let i = 0; i < rowN; i++) {
                  let temp = "" //每次截取的字符串
                  const start = i * maxLength //开始截取的位置
                  const end = start + maxLength //结束截取的位置
                  //这里也可以加一个是否是最后一行的判断，但是不加也没有影响，那就不加吧
                  temp = value.substring(start, end) + '\n'
                  ret += temp //凭借最终的字符串
                }
                return ret
              } else {return value}
            },
          },
          axisLine: {
            lineStyle: {
              color: '#333',
            },
          },
          splitLine: {
            show: false,
          },
        },
        series: [{
          name: '任务',
          type: 'bar',
          data: ylist,
          barWidth: 20,
          itemStyle: {
            color: '#1677ff'
          },
          emphasis: {
            focus: 'series'
          },
        }],
      }
      option && myChart.setOption(option)
    }

    onMounted( () => {
      domaininitEchart()
    })
  },
  render() {

    return (
      <div class={'overChart'}>
        <div style={{position:'relative'}} class={'pl-20 pr-20'}>
          <div id={`barchart`} style={{height: '250px', width: '100%'}}></div>
        </div>
      </div>
    )
  }
})
