/**
 * 图形化编程相关交互、设置
 */

import _ from 'lodash'
import { createLine } from '@/views/program/components/progUtil.js'
const state = {
  progs: [
    {
      tag: 'START',
      type: 'logic',
    },
    // {
    //   tag: 'IF',
    //   type: 'logic',
    //   cond: 'a<3',
    //   expanded: true,
    //   body: [{
    //     tag: 'IF',
    //     type: 'logic',
    //     cond: '',
    //     expanded: true,
    //     body: [{
    //       type: 'action',
    //       body: [{
    //         id: 99,
    //         type: 'Move',
    //         show: true
    //       }, {
    //         id: 100,
    //         type: 'Wait',
    //         show: true
    //       }, ]
    //     }, ]
    //   },
    //   {
    //     tag: 'ELSE',
    //     type: 'logic',
    //     cond: '',
    //     expanded: true,
    //     body: [{
    //       type: 'action',
    //       body: [{
    //         id: 99,
    //         type: 'Move',
    //         show: true
    //       }, {
    //         id: 100,
    //         type: 'Wait',
    //         show: true,
    //         params:{
    //           delay: 0,
    //         }
    //       },]
    //     },]
    //   },
    //   {
    //     type: 'action',
    //     body: [{
    //       id: 101,
    //       type: 'IO',
    //       show: true,
    //       params:[{
    //         type: 'base',
    //         port: 8,
    //         val: true,
    //       },]
    //     }, {
    //       id: 102,
    //       type: 'Set',
    //       show: true,
    //       params:[{var: 'count', val: 2,}]
    //     }, ]
    //   },
    //   {
    //     tag: 'WHILE',
    //     type: 'logic',
    //     cond: '',
    //     expanded: true,
    //     body: [{
    //       type: 'action',
    //       body: [{
    //         id: 103,
    //         type: 'Coord',
    //         show: true,
    //         params:[{type: 'user',val:[]}],
    //       }, ]
    //     }, ]
    //   }
    //   ]
    // },
    // {
    //   type: 'action',
    //   body: [{
    //     id: 101,
    //     type: 'fun',
    //     show: true,
    //     params: {
    //       name: '',
    //       param: [],
    //       ret: '',
    //     }
    //   }, {
    //     id: 102,
    //     type: 'script',
    //     show: true,
    //     params: {
    //       name: ''
    //     }
    //   },]
    // },
  ],
  vars: [],
  // vars: [{
  //   name: 'a',
  //   type: 'String',
  //   value: '',
  //   comment: '',
  // },
  // {
  //   name: 'abs',
  //   type: 'String',
  //   value: '',
  //   comment: '设定初始值',
  // },
  // {
  //   name: 'ccs',
  //   type: 'String',
  //   value: '',
  //   comment: '',
  // }],

  funs: [],

  segments: [],
  // [{ name: 'test', body: '', desc: '' }, { name: 'test2', body: '', desc: '' }]

  temp: {
    // 存放正在拖动中的功能块的index
    dragIndex: '',
    // 存放选中的功能块的索引
    checkedIndex: '',
    // 选中的功能块配置是否有更改
    configChanged: false,
  }
}
const mutations = {
  // 设置程序
  setProg(state,payload) {
    state.progs = _.cloneDeep(payload.progs)
    state.vars = _.cloneDeep(payload.vars)
    state.funs = _.cloneDeep(payload.funs)
    state.segments = _.cloneDeep(payload.segments)
    
    state.temp.dragIndex = ''
    state.temp.checkedIndex = ''
    state.temp.configChanged = false
  },

  clearProg(state) {
    state.progs = [{
      tag: 'START',
      type: 'logic'
    },]
  },

  clearAllProg(state) {
    state.progs = [{
      tag: 'START',
      type: 'logic'
    },]
    state.vars = []
    state.funs = []
    state.segments = []
    state.temp.dragIndex = ''
    state.temp.checkedIndex = ''
    state.temp.configChanged = false
  },
  insertLine(state, payload) {
    var rowid = payload.rowid
    var line = payload.line

    var parent = state.progs
    if (typeof rowid == 'number') {
      parent.splice(rowid, 0, line)
    } else {
      // console.log(parent)
      var ind = rowid.split('-').map(x => { return parseInt(x) })
      var len = ind.length
      for (let i = 0; i < len - 1; i++) {
        parent = parent[ind[i]].body
        if (!Array.isArray(parent)) break 
      }
      var index = ind[len - 1]
      // if..else的处理
      if (parent[index].tag=='IF') {
        while ((index + 1) < parent.length && (parent[index + 1].tag == 'ELSE' || parent[index + 1].tag == 'ELIF')) {
          index += 1
        }
      }
      parent.splice(index + 1, 0, line)
    } 
  },
  /**
   * 
   */
  insertLogicLine(state, payload) {
    var rowid = payload.rowid
    var line = payload.line

    var parent = state.progs
    var preParent = null
    if (typeof rowid == 'number') {
      parent.splice(rowid, 0, line)
    } else {
      var ind = rowid.split('-').map(x => { return parseInt(x) })
      var len = ind.length
      for (let i = 0; i < len - 1; i++) {
        preParent = parent
        parent = parent[ind[i]].body
        if (!Array.isArray(parent)) break
      }
      var lIndex = ind[len - 1]
      var pIndex = ind[len - 2]

      if (line.tag == 'ELIF') {
        // console.log(pIndex)
        // console.log(preParent)
        // console.log(preParent[pIndex].tag)
        if (pIndex >= 0 && ["IF","ELIF"].includes(preParent[pIndex].tag)) {          
          preParent.splice(pIndex + 1, 0, line)
        }
        return 
      }
      if (line.tag == 'ELSE') {
        if (pIndex >= 0 && ["IF","ELIF"].includes(preParent[pIndex].tag)) {          
          // 保证else 模块必须在if-elif-else最后
          if (pIndex < preParent.length - 1 && ['ELIF','ELSE'].includes(preParent[pIndex+1].tag)) {
            return
          }
          preParent.splice(pIndex + 1, 0, line)
        }
        return
      }

      // console.log(parent.map(x=>{return x.tag}))
      // if..else的处理 
      if (parent[lIndex].tag == 'IF') {
        while (lIndex < parent.length-1 && (parent[lIndex + 1].tag == 'ELSE' || parent[lIndex + 1].tag == 'ELIF')) {
          lIndex += 1
        }
      }
      // 判断是否有功能块
      if (parent[lIndex].body.length == 0) {
        parent.splice(lIndex, 1, line)
      } else {
        parent.splice(lIndex + 1, 0, line)
      }
    }
  },

  pushLine(state, payload) {
    var line = payload.line
    var len = state.progs.length
    if (line.tag == 'ELIF' || line.tag == 'ELSE') {
      if (!['IF', 'ELIF'].includes(state.progs[len - 1].tag)) {
        return
      }
    }

    state.progs.push(line)
  },

  deleteLine(state, payload) {
    var i = payload.rowid

    state.progs.splice(i, 1)
  },

  insertBlock(state, payload) {
    var index = payload.index
    var block = payload.block

    var line = state.progs
    if (typeof index.i == 'number') {
      if (index.i == line.length) {
        var l = createLine()
        line.push(l)
      }
      
      line = line[index.i].body

    } else {
      var ind = index.i.split('-').map(x => { return parseInt(x) })
      for (let i = 0; i < ind.length; i++) {
        line = line[ind[i]].body
      }
    }
    
    line.splice(index.j, 0, block)
  },

  deleteBlock(state, payload) {
    var index = payload.index

    var line = state.progs
    var preLine = line
    if (typeof index.i == 'number') {
      line = line[index.i].body

      if ('j' in index) {
        line.splice(index.j, 1)
      } else {
        var h = index.i
        var num = 1
        // 处理if..elif..else 这种结构，当删去if时，需要将其后的elif\else都删去
        if (preLine[h].tag == 'IF') {
          while (h + 1 < preLine.length && ['ELIF','ELSE'].includes(preLine[h+1].tag)) {
            h = h + 1
            num +=1
          }
        }
        preLine.splice(index.i, num)
      }
    } else {

      var ind = index.i.split('-').map(x => { return parseInt(x) })
      for (let i = 0; i < ind.length; i++) {
        preLine = line
        line = line[ind[i]].body
      }

      if ('j' in index) {
        line.splice(index.j, 1)
      } else {

        var h = ind[ind.length - 1]
        var num = 1
        // 处理if..elif..else 这种结构，当删去if时，需要将其后的elif\else都删去
        if (preLine[h].tag == 'IF') {
          while (h + 1 < preLine.length && ['ELIF', 'ELSE'].includes(preLine[h + 1].tag)) {
            h = h + 1
            num += 1
          }
        }
        preLine.splice(ind[ind.length - 1], num)
      }
    }
  },

  // 清除多余的空行
  deleteNull(state, payload) {
    var index = payload.index
    var line = state.progs
    var preLine = line

    if (typeof index.i == 'number') {
      // 若删掉功能块后该行无元素，则删掉该行
      if (line[index.i].body.length == 0) {
        line.splice(index.i, 1)
      }
    } else {

      var ind = index.i.split('-').map(x => { return parseInt(x) })
      for (let i = 0; i < ind.length; i++) {
        preLine = line
        line = line[ind[i]].body
      }

      if (preLine.length > 1 && line.length == 0) {
        preLine.splice(ind[ind.length - 1], 1)
      }
    }
  },

  showBlock(state, payload) {
    var index = payload.index
    var on = payload.on

    var line = state.progs
    if (typeof index.i == 'number') {
      line = line[index.i].body

    } else {
      var ind = index.i.split('-').map(x => { return parseInt(x) })
      for (let i = 0; i < ind.length; i++) {
        line = line[ind[i]].body
      }
    }
    
    var block = line[index.j]
    block.show = on
  },

  enableBlock(state, payload) {
    var index = payload.index
    var enable = payload.enable

    var line = state.progs
    if (typeof index.i == 'number') {
      line = line[index.i]
    } else {
      var ind = index.i.split('-').map(x => { return parseInt(x) })
      for (let i = 0; i < ind.length - 1; i++) {
        line = line[ind[i]].body
      }
      line = line[ind[ind.length - 1]]
    }

    var block
    if ('j' in index) {
      block = line.body[index.j]
    } else {
      block = line
      if (block.tag == 'IF') {
        // while () {
          
        // }
      }
    }

    block.enable = enable
  },

  checkBlock(state, payload) {
    var index = payload.index
    var on = payload.on

    var line = state.progs
    if (typeof index.i == 'number') {
      line = line[index.i]
    } else {
      var ind = index.i.split('-').map(x => { return parseInt(x) })
      for (let i = 0; i < ind.length - 1; i++) {
        line = line[ind[i]].body
      }
      line = line[ind[ind.length - 1]]
    }

    var block
    if ('j' in index) {
      block = line.body[index.j]
    } else {
      block = line
    }

    block.checked = on
  },

  updateBlockParam(state, payload) {
    var index = payload.index
    var params = payload.params
    
    var line = state.progs
    if (typeof index.i == 'number') {
      line = line[index.i].body

    } else {
      var ind = index.i.split('-').map(x => { return parseInt(x) })
      for (let i = 0; i < ind.length; i++) {
        line = line[ind[i]].body
      }
    }

    var o = line[index.j]

    o.params = _.cloneDeep(params)
  },

  updateBlockComment(state, payload) {
    state.comment = payload.comment
  },

  updateControlBlock(state, payload) {
    var index = payload.index
    var cond = payload.cond

    var line = state.progs
    if (typeof index.i == 'number') {
      line = line[index.i]

    } else {
      var ind = index.i.split('-').map(x => { return parseInt(x) })
      for (let i = 0; i < ind.length-1; i++) {
        line = line[ind[i]].body
      }
      line = line[ind[ind.length - 1]]
    }

    // console.log(cond)
    line.cond = _.cloneDeep(cond)
  },

  createVar(state, payload) {
    var o = {}
    o.name = payload.name
    o.type = payload.type
    o.value = payload.value
    o.comment = payload.comment

    state.vars.push(o)
  },

  updateVar(state, payload) {
    var index = payload.index
    if (index < 0 || index > state.vars.length - 1) {
      return
    }

    var v = state.vars[index]
    v.name = payload.name
    v.type = payload.type
    v.value = payload.value
    v.comment = payload.comment
  },

  deleteVar(state, payload) {
    var index = payload.index
    if (index < 0 || index > state.vars.length - 1) {
      return
    }

    state.vars.splice(index, 1)
  },

  createFun(state, payload) {
    var o = {}
    o.name = payload.name
    o.params = _.cloneDeep(payload.params)
    o.body = payload.body
    o.comment = payload.comment

    state.funs.push(o)
  },

  updateFun(state, payload) {
    var index = payload.index
    // var index = state.funs.indexOf(payload.name)
    if (index == -1) {
      return
    }
    var f = state.funs[index]
    f.name = payload.name
    f.params = _.cloneDeep(payload.params)
    f.body = payload.body
    f.comment = payload.comment
  },

  deleteFun(state, payload) {
    var index = payload.index
    if (index == -1) {
      return
    }

    state.funs.splice(index, 1)
  },

  createSegment(state, payload) {
    var o = {}
    o.name = payload.name
    o.body = payload.body
    o.desc = payload.desc

    state.segments.push(o)
  },

  updateSegment(state, payload) {
    var index = payload.index
    // var index = state.segments.indexOf(payload.name)
    if (index == -1) {
      return
    }
    var s = state.segments[index]
    s.body = payload.body
    s.desc = payload.desc
  },

  deleteSegment(state, payload) {
    var index = payload.index
    // var array = state.segments
    // var index = -1
    // for (let i = 0; i < array.length; i++) {
    //   if (array[i].name == payload.name) {
    //     index = i        
    //   }
    // }
    if (index == -1) {
      return
    }
    state.segments.splice(index,1)
  },

  setDragIndex(state, payload) {
    state.temp.dragIndex = payload.index
  },
  setCheckedIndex(state, payload) {
    state.temp.checkedIndex = payload.index
  },
  setConfigChanged(state, payload) {
    state.temp.configChanged = payload.changed
  }
}

const getters = {
  getLine: (state) => (index) => {
    // console.log("get line")

    var line = state.progs
    if (typeof index.i == 'number') {
      line = line[index.i]

    } else {
      var ind = index.i.split('-').map(x => { return parseInt(x) })
      for (let i = 0; i < ind.length-1; i++) {
        line = line[ind[i]].body
      }
      line = line[ind[ind.length-1]]
    }

    return line
  },
  getBlockByIndex: (state, getters) => (index) => {
    // console.log("get block")
    var l= getters.getLine(index)
    // console.log(index)
    if ('j' in index) {
      return l.body[index.j]
    }
    return l
  },

}

const actions = {

}

export default {
  namespaced: false,
  state,
  getters,
  actions,
  mutations
}
