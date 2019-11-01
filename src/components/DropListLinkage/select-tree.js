/**
 *   nodeType  组件类型
 *       SELECT  下拉框【默认值】
 *   SELECT_TAG  下拉框，多选标签
 *       DATE_1  单选日期
 *       DATE_2  多选日期
 *        INPUT  输入框
 *  PLACEHOLDER  占位【默认渲染 select】
 *
 * selectTree  整个select映射
 *       header  select的标题
 *         name  select的option显示的名称
 *      visible  子集列表可见
 *     children  子集列表
 *         type  组件类型，默认select
 */

const nodeType = {
  DEFAULT: 'SELECT',
  SELECT: 'SELECT',
  SELECT_TAG: 'SELECT_TAG',
  DATE_2: 'DATE_2',
  INPUT: 'INPUT',
  PLACEHOLDER: 'PLACEHOLDER',
}
const selectTree = {
  name: '筛选',
  header: '选一个筛选条件',
  visible: false,
  children: [
    {
      name: '状态',
      header: '状态',
      visible: false,
      id: 'status',
      children: [
        {
          name: '打开',
        },
        {
          name: '归档订单',
        },
        {
          name: '已取消',
        },
      ],
    },
    {
      name: '待付款状态',
      header: '发货状态',
      visible: false,
      children: [
        {
          name: '已授权',
        },
        {
          name: '已支付',
        },
        {
          name: '已部分退款',
        },
        {
          name: '部分付款',
        },
        {
          name: '待处理',
        },
        {
          name: '已退款',
        },
        {
          name: '未付款',
        },
        {
          name: '已作废',
        },
      ],
    },
    {
      name: '发货状态',
      header: '发货状态',
      visible: false,
      children: [
        {
          name: '已发货',
        },
        {
          name: '未发货',
        },
        {
          name: '部分已发货',
        },
        {
          name: '未发货和已部分发货',
        },
      ],
    },
    {
      name: '标签',
      header: '标签',
      visible: false,
      type: nodeType.INPUT,
    },
    {
      name: '退款和查询状态',
      header: '退款和查询状态',
      visible: false,
    },
    {
      name: '日期',
      header: '日期',
      visible: false,
      children: [
        {
          name: '今天',
        },
        {
          name: '过去7天',
        },
        {
          name: '过去30天',
        },
        {
          name: '过去90天',
        },
        {
          name: '过去12月',
        },
        {
          name: '自定义',
          header: '自定义',
          type: 'DATE_2',
        },
      ],
    },
    {
      name: '信用卡后四位',
      header: '信用卡后四位',
      visible: false,
      type: nodeType.INPUT,
    },
  ],
}

module.exports = {
  selectTree,
  nodeType,
}
