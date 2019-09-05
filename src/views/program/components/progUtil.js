function createBlock(type) {
  var o = new Object()
  o.id = new Date().getTime()
  o.type = type
  o.enable = true
  // o.checked = false
  o.show = true
  o.comment = ''

  if (type == 'Move') {
    var p = {
      type: 'MoveL',
      pose: [],
      posec: [],
      param: [100, 500, -1, 888],
      wait: 0
    }
    o.params = []
    o.params.push(p)
  }
  if (type == 'IO') {
    var p = {
      type: 'base',
      port: 0,
      val: false,
    }
    o.params = []
    o.params.push(p)
  }
  if (type == 'Set') {
    var p = {
      type: 'do',
      var: '',
      val: '',
    }
    o.params = p
  }

  if (type == 'Coord') {
    var p = {
      type: 'base',
      index: -1,
      val: null
    }
    o.params = p
  }

  if (type == 'Wait') {
    var p = {
      type: 'delay',
      val: 0,
    }
    o.params = p
  }

  if (type == 'Script') {
    var p = {
      type: 'file',
      val: ''
    }
    o.params = p
  }
  if (type == 'Fun') {
    var p = {
      name: '',
      params: [],
      ret: ''
    }
    o.params = p
  }
  if (type == 'Modbus') {
    var p = {
      type: 'o',
      v: [],
    }
    var m = {
      name: '',
      type: 0,
      val: 0,
    }
    p.v.push(m)
    o.params = p
  }
  if (type == 'moveCam') {
    var p = {
      p1: null,
      p2: null,
      offset: [0, 0, 0, 0, 0, 0],
      v: 0,
    }
    o.params = p
  }
  if (type == 'Subprog') {
    var p = {
      name: '',
    }
    o.params = p
  }
  if (type == 'Print') {
    var p = {
      type: '',
      var: ''
    }
    o.params = []
    o.params.push(p)
  }

  return o
}

function createLine(tag) {
  var o = new Object()

  if (['IF', 'ELSE', 'ELIF', 'WHILE'].includes(tag)) {
    o.type = 'logic'
    o.tag = tag
    if (tag == "WHILE") {
      o.cond = {
        option: 'infinite',
        val: ''
      }
    } else if (tag == "IF" || tag == 'ELIF') {
      o.cond = {
        type: 'expr',
        port: 1,
        val: '',
      }
    }
    o.enable = true
    o.body = []
    o.comment = ''
    o.expanded = true
    var a = {
      type: 'action',
      body: [],
      enable: true
    }
    o.body.push(a)
    return o

  } else {
    o.enable = true
    o.type = 'action'
    o.body = []
    if (tag != null) {
      var a = createBlock(tag)
      o.body.push(a)
    }
    return o
  }
}

function createLineFromSwap(block) {
  var o = new Object()
  o.type = 'action'
  o.enable = true
  o.body = []
  block.show = true
  o.body.push(block)
  return o
}

export {
  createBlock,
  createLine,
  createLineFromSwap
}
