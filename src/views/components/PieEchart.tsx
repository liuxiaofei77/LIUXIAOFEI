/*
 * @Author: djw
 * @Description: 饼状图
 */
import { defineComponent, onMounted } from 'vue'
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
    const initChart = ()=>{
      const myChart= window.echarts.init(document.getElementById('piechart'+props.curItem.id) as HTMLElement)
      const arr= props.curItem.orderData||[]
      const xData = [{
          value:arr.filter((subitem)=>subitem.status===true).length||0,
          name:'已完成'}, {
          value:arr.filter((subitem)=>subitem.status!==true).length||0,
          name:'未完成'}]

      const option:any = {
        tooltip: {
          trigger: 'item',
          formatter: '{a} <br/>{b} : {c} ({d}%)'
        },
        grid: {
          left: '0%',
          right: '0%',
          top:'0%',
          bottom: '0%',
        },
        series: [
          {
            name: props.curItem.title,
            type: 'pie',
            radius:  ['40%', '70%'],
            center:  ['50%', '50%'],
            data:xData
          },
        ],
      }


      option && myChart.setOption(option)
    }

    onMounted( () => {
      if(props.curItem.id){
        initChart()
      }
    })
    return {
      initChart
    }
  },
  render() {
    const { curItem } = this
    return (
      <div >
        <div id={`piechart${curItem.id}`} style={{height: '250px', width:"100%" }}></div>
      </div>
    )
  }
})
