var loop = 0
var segments = []
var funs = []
// 定义异常
function TypeException(message) {
  this.message = message
  this.name = "typeException"
}

function generateCode(prog, config) {
  if (!prog) {
    return null
  }
  segments = prog.segments
  funs = prog.funs
  try {
    var code = genSegment(prog.progs)
  } catch (error) {
    console.log(error)
  }
 
  return addHeader() 
        + addModbus(config.modbus) 
        + varsGen(prog.vars)  
        + code 
        + clearModbus(config.modbus)
}

function genSegment(lines) {
  console.log('gen...')
  var len = lines.length
  var code = ''
  for (let i = 0; i < len; i++) {
    var line = lines[i]
    var l = ''
    if (line.type == 'logic') {
      if (line.tag == 'START')
        l = '# START \n'
      if (line.tag == 'WHILE') {
        l = genWhile(line)
      }

      if (line.tag == 'IF'|| line.tag == 'ELIF') {
        if (i < len - 1) {
          var nextLine = lines[i+1]
          if (nextLine.type=='logic' && ['ELSE','ELIF'].indexOf(nextLine.tag) != -1) {
            l = genIf(line, false)
          } else {
            l = genIf(line, true)
          }
        } else {
          l = genIf(line, true)
        } 
      }
      if (line.tag == 'ELSE') {
        l = genElse(line)
      }
    } else if (line.type == 'action') {
      l = genAction(line.body)
    }
    code = code + l 
  }
  return code
}

// end 表示if语句是否结束
function genIf(line, end) {
  var tag, preCode, code
  if (line.tag == 'IF') {
    tag = 'if'
  } else if (line.tag == 'ELIF') {
    tag = 'elif'
  }
  if (line.cond.type == 'di') {
    var port = Number(line.cond.port)
    var val = Number(line.cond.val)
    if (port < 100) {
      preCode = `${tag}(io_in(${port})==${val}):\n${genSegment(line.body)}\n`
    } else {
      preCode = `${tag}(tool_io_in(${port - 100})==${val}):\n${genSegment(line.body)}\n`
    }
    
  } else if (line.cond.type == 'expr') {
    preCode = `${tag} (${line.cond.val}):\n${genSegment(line.body)}\n`
  }
  if (end) {
    code = preCode + `end\n`
  } else {
    code = preCode
  }
  return code
}

function genElse(line) {
  return `else:\n${genSegment(line.body)}\nend\n`
}

function genWhile(line) {
  loop = loop + 1
  var opt = line.cond.option
  var val = line.cond.val
  var code = ''
  if (opt == 'expr') {      
    code = `while(${val}):\n${genSegment(line.body)}end\n`
  } else if (opt == 'infinite') {
    code = `while(True):\n${genSegment(line.body)}end\n`
  } else if (opt == 'count') {
    var v = `FLAG_loop_${loop}`
    var c = `${v} < ${parseInt(val)}`
    code = `${v}=0;\nwhile(${c}):\n${v}=${v}+1;\n${genSegment(line.body)}end\n`
  }

  return code
}

function genAction(items) {
  if (!Array.isArray(items)) {
    throw new TypeException('action type should be the array')
  }
  var code = ''
  for (let i = 0; i < items.length; i++) {
    var params = items[i].params
    var l = ''
    if (!items[i].enable) continue
    switch(items[i].type) {
      case 'Move':
        l = movesGen(params)
        break;
      case 'Wait':
        l = waitGen(params)
        break;
      case 'IO':
        l = iosGen(params)
        break;
      case 'Set':
        l = setGen(params)
        break;
      case 'Coord':
        l = coordGen(params)
        break;
      case 'Modbus':
        l = modbusListGen(params)
        break;
      case 'Fun':
        l = funCallGen(params)
        break;
      case 'Script':
        l = segmentCallGen(params)
        break;
      case 'moveCam':
        l = moveCamGen(params)
        break;
      default:
        break;
    }
    code = code + l
  }
  return code
}

function movesGen(list) {
  var statement = ''
  for (let i = 0; i < list.length; i++) {
    var s = moveGen(list[i])
    if (s) {
      statement = statement + s + '\n'
    }
  }
  return statement
}

function moveGen(item) {
  var ret
  var param = item.param.join(',')
  switch (item.type) {
    case 'MoveL':    
      ret = `movel(${item.pose}, ${param});`
      break;
    case 'MoveJ':
      ret = `movej(${item.pose}, ${param});`
      break;
    case 'MoveC':
      ret = `movec(${item.pose}, ${item.posec}, ${param});`
      break;
    case 'tcp_Move':
      ret = `tcp_move(${param});`
      break;
    case 'Move_phi':
      ret = `move_phi(${param});`
      break;
    default:
      break;
  }
  return ret
}
function modbusListGen(items) {
  var statement = ''
  for (let i = 0; i < items.length; i++) {
    var s = modbusGen(items[i])
    if (s) {
      statement = statement + s + '\n'
    }
  }
  return statement
}

function modbusGen(item) {
  if (item.type == 1) {
    return `modbus_write_d("${item.name}", ${item.val});`
  }
  if (item.type == 3) {
    return `modbus_write_r("${item.name}", ${item.val});`
  }
}

function iosGen(items) {
  var statement = ''
  for (let i = 0; i < items.length; i++) {
    var s = ioGen(items[i])
    if (s) {
      statement = statement + s + '\n'
    }
  }
  return statement
}

function ioGen(item) {
  var l
  // if (typeof (item.port) != 'number')
  //   throw new TypeException("Invalid port")
  if (item.type=='base') {
    if (item.val) {
      l = `io_out(${item.port}, 1);`
    } else {
      l = `io_out(${item.port}, 0);`
    }
    
  } else if (item.type=='tool') {
    if (item.val) {
      l = `tool_io_out(${item.port}, 1);`
    } else {
      l = `tool_io_out(${item.port}, 0);`
    }
  }
  return l
}

function varsGen(items) {
  var seg = ''
  for (let i = 0; i < items.length; i++) {
    seg += varGen(items[i])+'\n'
  }
  return seg
}

function varGen(item) {
  var l
  switch (item.type) {
    case 'String':
      if (item.value) {
        l = `${item.name} = "${item.value}";`
      } else {
        l = `${item.name}`
      }
      break;
    case 'int':
    case 'float':
      if (item.value) {
        l = `${item.name} = ${item.value};`
      } else {
        l = `${item.name}`
      }
      break;
    case 'bool':
      if (item.value) {
        l = `${item.name} = True;`
      } else {
        l = `${item.name} = False;`
      }
      break;
    case 'pose':
      l = `${item.name} = ${item.value};`
      break;
    case 'array':
      var len = item.value.len
      var typ = item.value.typ
      var def = item.value.default
      // if (item.value.typ == 'int') {
      //   typ = 'INT'
      // } else if (item.value.typ == 'float') {
      //   typ = 'FLO'
      // }
      // if (def) {
      //   // 移除中间可能存在的空白字符
      //   var re = /\s*(?:,|$)\s*/
      //   var ret = def.trim().split(re)
      //   var v = ret.map(x=>{return Number(x)})
      // }
      if (def) {
        l = `${item.name} = Array(${len}, ${typ}, ${def});`
      } else {
        l = `${item.name} = Array(${len}, ${typ});`
      }
      break;
    default:
      break;
  }
  return l
}

function funsGen(items) {
  var seg = ''
  for (let i = 0; i < items.length; i++) {
    seg += funGen(items[i]) + '\n\n'
  }
  return seg
}

function funGen(item) {
  var p = ''
  var len = item.params.length
  if (len == 0) {
    p = ''
  } else {
    for (let i = 0; i < len; i++) {
      var param = item.params[i]
      p = p + `${param.type}:${param.name}` + ', '      
    }
  }

  var def = `def ${item.name}(${p}):\n`
  var statement = `${item.body}\n`
  var ret = `return ${item.ret};\n`

  return `# ${item.comment} \n` + def + statement + ret + 'end'
}

function waitGen(item) {
  // if (typeof item.delay != 'number') 
  //   throw new TypeException("Invalid param")
  if (item.type == 'delay') {
    return `sleep(${item.val});\n`
  } else if (item.type == 'di') {
    var port = Number(item.val.port)
    var val = Number(item.val.val)
    if (port < 100) {
      return `while(True):\nif(io_in(${port})==${val}):\nbreak;\nend\nend\n`
    } else {
      return `while(True):\nif(tool_io_in(${port-100})==${val}):\nbreak;\nend\nend\n`
    }
    
  } else if (item.type == 'expr') {
    return `while(True):\nif(${item.val}):\nbreak;\nend\nend\n`
  }
  
}

function coordGen(item) {
  var pre = 'coordinate_clear();\n'
  var param = item.val
  var l = ''
  if (item.type == 'base') {
    return pre
  }
  if (item.type == 'user') {
    var p = param.join(',')
    l = `coordinate_user(${p});\n`
  } else if(item.type == 'tool') {
    var p = param.bias.join(',')
    l = `coordinate_tool(${p});\n`
  }
  return pre + l
}

function setGen(item) {
  var l
  if (item.type == 'do') {
    var port = Number(item.var)
    if (port < 100) {
      l = `io_out(${port},${item.val});\n`
    } else {
      l = `tool_io_out(${port-100},${item.val});\n`
    }
  } else if (item.type == 'expr') {
    l = `${item.var}=${item.val};\n`
  }
  return l
}

function segmentCallGen(item) {
  if (item.type == 'line') {
    return `${item.val}\n`
  } else if (item.type == 'file') {
    if (!segments) return
    var rets = segments.filter((x)=>{return x.name == item.val})
    if (rets.length == 0) return
    var seg = rets[0]
    return `# script: ${seg.name} ${seg.desc} \n${seg.body}\n# script end`
  }
  
}

function funCallGen(item) {
  var p = ''
  if (item.params.length > 0) {
    p = item.params.join(',')
  }
  
  if (item.ret) {
    return `${item.ret} = ${item.name}(${p});\n`
  } else {
    return `${item.name}(${p});\n`
  }
}

function moveCamGen(item) {
  return `move_camera_offset(${item.p1},${item.p2},${item.offset},${item.v});\n`
}

function addModbus(items) {
  if (!items || items.length == 0) return ''
  var l = '# add modbus\n'
  for (let i = 0; i < items.length; i++) {
    var o = items[i]
    l = l + `modbus_add_signal("${o.ip}",${o.slave},${o.addr},${o.type},"${o.name}");\n`
  }
  return l  
}

function clearModbus(items) {
  if (!items || items.length == 0) return ''
  var l = '# clear modbus\n'
  for (let i = 0; i < items.length; i++) {
    var o = items[i]
    l = l + `modbus_delete_signal("${o.name}");\n`
  }
  return l
}

// 加入头说明
function addHeader() {
  return '# AUTO-GENERATED by graph program. DO NOT Modify\n'
}

export {
  generateCode,
}