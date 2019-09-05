export const keywords = {
  op: ['+', '-', '*', '/'],
  relop: ['>', '<', '>=', '<=', '==', '!='],
  assign: ['='],
  logical: ['and', 'or', 'not'],
  words: ["while", "if", "elif", "else", "end", "return", "def", 
    "break", "Array", "global"],
  other: ['True', 'False', '[POSE]']
}

export var builtin = {
  move: { 
    expand: true,
    desc: '移动控制',
    items: {
      'movej': {
        desc: '控制机械臂从当前状态，按照关节运动的方式移动到目标关节角状态',
        param: {
          axis: {
            type: 'array',
            desc: '对应1-7关节的目标关节角度',
          },
          v: {
            type: 'float',
            desc: '关节角速度，单位（系统内最大速度的百分比%）',
          },
          a: {
            type: 'float',
            desc: '关节加速度'
          }
        },
        ret: null,
      },
      'movej_pose': {
        desc: '控制机械臂从当前状态，按照关节运动的方式移动到末端目标位置',
        param: {
          p: {
            type: 'pose',
            desc: 'POSE数据结构，对应末端在基坐标系下的位置'
          },
          v: {
            type: 'float',
            desc: '关节角速度，单位（系统内最大速度的百分比%）'
          },
          a: {
            type: 'float',
            desc: '关节加速度'
          }
        },
        ret: null,
      },
      'movel': {
        desc: '控制机械臂末端从当前状态按照直线路径移动到目标状态',
        param: {
          p: {
            type: 'pose',
            desc: 'pose类型变量，目标位姿状态'
          },
          v: {
            type: 'float',
            desc: '末端速度，单位（mm/s）'
          },
          a: {
            type: 'float',
            desc: '末端加速度，单位（mm/s2）'
          },
          rad: {
            type: 'float',
            desc: '关节融合半径（单位：mm），默认值为 0，表示无融合。当数值大于0时表示与下一条movel、movec运动融合'
          },
          psi: {
            type: 'float',
            desc: '臂形角， 范围在-3.14~3.14之间，不填写或范围不正确时会使用上一个状态结束时的臂形角'
          }
        },
        ret: null,
      },
      'movec': {
        desc: '控制机械臂做圆弧运动，起始点为运动开始时的任意点，途径p1点，终点为p2点',
        param: {
          p1: {
            type: 'pose',
            desc: 'pose类型变量，圆弧运动中间点'
          },
          p2: {
            type: 'pose',
            desc: 'pose类型变量，圆弧运动结束点'
          },
          v: {
            type: 'float',
            desc: '末端速度，单位（mm/s）'
          },
          a: {
            type: 'float',
            desc: '末端加速度，单位（mm/s2）'
          },
          rad: {
            type: 'float',
            desc: '关节融合半径（单位：mm），默认值为 0，表示无融合。当数值大于0时表示与下一条movel、movec运动融合'
          },
          psi: {
            type: 'float',
            desc: '臂形角， 范围在-3.14~3.14之间，不填写或范围不正确时会使用上一个状态结束时的臂形角'
          }
        },
        ret: null,
      },
      'tcp_move': {
        desc: '控制机械臂沿工具坐标系直线移动一个增量，增量用[x,y,z, rx, ry, rz]矩阵表示',
        param: {
          x: {
            type: 'float',
            desc: '增量矩阵[x, y, z, rx, ry, rz]中的x，单位（mm）'
          },
          y: {
            type: 'float',
            desc: '增量矩阵[x, y, z, rx, ry, rz]中的y，单位（mm）'
          },
          z: {
            type: 'float',
            desc: '增量矩阵[x, y, z, rx, ry, rz]中的z，单位（mm） '
          },
          rx: {
            type: 'float',
            desc: '增量矩阵[x, y, z, rx, ry, rz]中的rx，单位（mm）'
          },
          ry: {
            type: 'float',
            desc: '增量矩阵[x, y, z, rx, ry, rz]中的ry，单位（mm）'
          },
          rz: {
            type: 'float',
            desc: '增量矩阵[x, y, z, rx, ry, rz]中的rz，单位（mm）'
          },
          v: {
            type: 'float',
            desc: '直线移动的速度，单位（mm/s）'
          }
        },
        ret: null,
      },
      'move_phi': {
        desc: '控制机械臂向某个方向转动一个臂形角的增量，末端保持空间位置不变',
        param: {
          angle_inc: {
            type: 'float',
            desc: '臂形角的增量，单位：度。范围：-180°~180°'
          },
          v: {
            type: 'float',
            desc: '移动速度，单位（系统内最大速度的百分比%）'
          }
        },
        ret: null,
      },
      'speedj': {
        desc: '控制机械臂每个关节按照给定的速度一直运动，函数执行后会直接运行后续指令。运行speedj函数后，机械臂会持续运动并忽略后续运动指令，直到接收到speed_stop();函数后停止',
        param: {
          axis_speed: {
            type: 'array',
            desc: '每个关节的速度'
          }
        },
        ret: null,
      },
      'speedl': {
        desc: '控制机械臂末端按照给定的速度一直运动，函数执行后会直接运行后续指令。运行speedl函数后，机械臂会持续运动并忽略后续运动指令，直到接收到speed_stop();函数后停止',
        param: {
          position_speed: {
            type: 'pose',
            desc: '工具坐标下，末端速度向量'
          }
        },
        ret: null,
      },
      'speed_stop': {
        desc: '停止speedj及speedl函数的运动',
        param: null,
        ret: null,
      },
      'move_camera_offset': {
        desc: '该指令应用于相机拍照抓取',
        param: {
          p1: {
            type: 'pose',
            desc: '示教的拍照点'
          },
          p2: {
            type: 'pose',
            desc: '示教的抓取点'
          },
          offset: {
            type: 'pose',
            desc: '相机返回的位置补偿'
          },
          v: {
            type: 'float',
            desc: '速度，单位mm/s'
          }
        },
        ret: null,
      },
    }
  },

  comm: {
    expand: true,
    desc: '网络通信',
    items: {
      'socket_open': {
        desc: '打开一个以太网的通信链接，如果三秒内没有创建成功，那么链接创建失败',
        param: {
          ip: {
            type: 'string',
            desc: '服务器端的IP地址，(注意要用""括起来)'
          },
          port: {
            type: 'int',
            desc: '服务器端的端口号'
          }
        },
        ret: {
          type: 'boolean',
          desc: '打开成功返回True ，失败返回 False'
        },
        example: 'socket_open("192.168.67.60",2003);'
      },
      'socket_send_string': {
        desc: '发送字符串给已连接的服务器',
        param: {
          msg_send: {
            type: 'string',
            desc: '需要发送的字符串，需要用""括起来'
          }
        },
        ret: {
          type: 'boolean',
          desc: 'True / False'
        },
        example: 'socket_send_string ("send message");'
      },
      'socket_send_float': {
        desc: '发送浮点数数组给已连接的服务器',
        param: {
          array_send: {
            type: 'array',
            desc: '需要发送的浮点数数组，数组中每个数据为32位'
          }
        },
        ret: {
          type: 'boolean',
          desc: 'True / False'
        },
        example: 'a = Array(2, FLO);\na[0] = 3.1416;\na[1] = 2.71828;\nsocket_send_float(a);'
      },
      'socket_send_int': {
        desc: '发送整型数组给已连接的服务器',
        param: {
          array_send: {
            type: 'array',
            desc: '需要发送的整型数组，数组中每个数据为8位'
          }
        },
        ret: {
          type: 'boolean',
          desc: 'True / False'
        }
      },
      'socket_read_string': {
        desc: '从已连接的服务器接收一定长度的字符串',
        param: {
          receive: {
            type: 'string',
            desc: '接收信息的字符串，收到的字符串会存在此变量中'
          },
          length: {
            type: 'int',
            desc: '需要接收的字符串长度'
          },
          timeout: {
            type: 'int',
            desc: '超时时间，单位ms. 不填写时默认为3000ms'
          }
        },
        ret: {
          type: 'boolean',
          desc: 'True / False'
        }
      },
      'socket_read_str_float': {
        desc: '从已连接的服务器接收一组字符串，解析成浮点数',
        param: {
          receive: {
            type: 'array',
            desc: '接收信息的数组，收到的浮点数会存在此数组中,所有数据应当在括号内，浮点数之间通过“，”隔开， \
                 示例：（1.23, 3.1416, 1.0）\
                注：字符串长度最大为100'
          },
          timeout: {
            type: 'int',
            desc: '超时时间，单位ms.不填写时默认为3000ms'
          }
        },
        ret: {
          type: 'int',
          desc: '收到的字节数量'
        }
      },
      'socket_read_float': {
        desc: '从已连接的服务器接收一组浮点数',
        param: {
          receive: {
            type: 'array',
            desc: '接收信息的数组，收到的浮点数会存在此数组中 \
                注：一个命令中最多可读取30个数值，每个数据为32位'
          },
          timeout: {
            type: 'int',
            desc: '超时时间，单位ms.不填写时默认为3000ms'
          }
        },
        ret: {
          type: 'boolean',
          desc: 'True / False'
        }
      },
      'socket_read_str_int': {
        desc: '从已连接的服务器接收字符串，解析成一组整型数',
        param: {
          receive: {
            type: 'array',
            desc: '接收信息的数组，收到的整型数会存在此数组中,所有数据应当在括号内，整数之间通过“,”隔开，\
          示例：（1, 3, 5）\
          注：字符串长度最大为100'
          },
          timeout: {
            type: 'int',
            desc: '超时时间，单位ms.不填写时默认为3000ms'
          }
        },
        ret: {
          type: 'boolean',
          desc: 'True / False'
        }
      },
      'socket_read_int': {
        desc: '从已连接的服务器接收一组整型数据',
        param: {
          receive: {
            type: 'array',
            desc: '接收信息的数组，收到的整型数会存在此数组中 \
                注：一个命令中最多可读取30个数值，每个数据8位.'
          },
          timeout: {
            type: 'int',
            desc: '超时时间，单位ms.不填写时默认为3000ms'
          }
        },
        ret: {
          type: 'boolean',
          desc: 'True / False'
        }
      },
      'socket_close': {
        desc: '关闭和服务器端的以太网通信链接',
        param: null,
        ret: null
      },
    } 
  },

  io: {
    expand: true,
    desc: '',
    items: {
      'sleep': {
        desc: '该函数会让程序暂停一定时间',
        param: {
          time: {
            type: 'int',
            desc: '需要暂停的时间，单位ms'
          }
        },
        ret: null
      },
      'io_out': {
        desc: '该函数可控制控制柜上的IO输出口的高低电平',
        param: {
          portnum: {
            type: 'int',
            desc: '控制柜上的IO输出口序号，范围从1-8'
          },
          val: {
            type: 'int',
            desc: '1为高电平，0为低电平'
          }
        },
        ret: null,
      },
      'io_in': {
        desc: '该函数可读取控制柜上的用户 IO输入口的高低电平，返回1为高电平，0为低电平',
        param: {
          portnum: {
            type: 'int',
            desc: '控制柜上的IO输出口序号，范围从1-8'
          }
        },
        ret: {
          type: 'int',
          desc: '返回1为高电平，0为低电平，-1表示参数错误'
        }
      },
      'sys_io_in': {
        desc: '该函数可读取系统IO输入，返回1为高电平，0为低电平',
        param: {
          portnum: {
            type: 'int',
            desc: '控制柜上的IO输出口序号，范围从1-6.\n \
              1：预留\n \
              2：预留\n \
              3：机械臂锁定\n \
              4：启动程序\n\
              5：暂停程序\n\
              6：停止程序'
          }
        },
        ret: {
          type: 'int',
          desc: '返回1为高电平，0为低电平，-1表示参数错误'
        }
      },
      'io_v_out': {
        desc: '该函数可控制系统内部虚拟IO的高低电平',
        param: {
          portnum: {
            type: 'int',
            desc: '虚拟IO序号，范围从1-9'
          },
          val: {
            type: 'int',
            desc: '1为高电平，0为低电平'
          }
        },
        ret: null
      },
      'io_v_in': {
        desc: '该函数可读取系统内部虚拟IO的高低电平，返回1为高电平，0为低电平',
        param: {
          portnum: {
            type: 'int',
            desc: '虚拟IO序号，范围从1-9'
          }
        },
        ret: {
          type: 'int',
          desc: '返回1为高电平，0为低电平，-1表示参数错误'
        }
      },
      'tool_io_out': {
        desc: '该函数可控制机械臂末端的IO输出口的高低电平',
        param: {
          portnum: {
            type: 'int',
            desc: '机械臂末端的IO输出口序号，范围从1-2'
          },
          val: {
            type: 'int',
            desc: '1为高电平，0为低电平'
          }
        },
        ret: null
      },
      'tool_io_in': {
        desc: '该函数可读取控机械臂末端的IO输入口的高低电平，返回1为高电平，0为低电平',
        param: {
          portnum: {
            type: 'int',
            desc: '机械臂末端的IO输出口序号，范围从1-2'
          }
        },
        ret: {
          type: 'int',
          desc: '返回1为高电平，0为低电平，-1表示参数错误'
        }
      },
      'w_reg_bool': {
        desc: '该函数可修改内部bool寄存器的值',
        param: {
          num: {
            type: 'int',
            desc: '内部bool寄存器序号，范围从1-32'
          },
          val: {
            type: 'int',
            desc: '1为true，0为false'
          }
        },
        ret: null,
      },
      'r_reg_bool': {
        desc: '该函数可读取内部bool寄存器的值',
        param: {
          num: {
            type: 'int',
            desc: '内部bool寄存器序号，范围从1-32'
          }
        },
        ret: {
          type: 'int',
          desc: '返回1为true，0为false，-1表示参数错误'
        }
      },
      'w_reg_char': {
        desc: '该函数可修改内部char寄存器的值',
        param: {
          num: {
            type: 'int',
            desc: '内部char寄存器序号，范围从1-32'
          },
          c: {
            type: 'char',
            desc: '字符，使用时用""括起来'
          }
        },
        ret: null,
        example: 'w_reg_char( 5, "b" );'
      },
      'r_reg_char': {
        desc: '该函数可读取内部char寄存器的值',
        param: {
          num: {
            type: 'int',
            desc: '内部char寄存器序号，范围从1-32'
          }
        },
        ret: {
          type: 'char'
        }
      },
      'w_reg_float': {
        desc: '该函数可修改内部float寄存器的值',
        param: {
          num: {
            type: 'int',
            desc: '内部float寄存器序号，范围从1-32'
          },
          value: {
            type: 'float',
            desc: '浮点型数值'
          }
        },
        ret: null,
      },
      'r_reg_float': {
        desc: '该函数可读取内部float寄存器的值',
        param: {
          num: {
            type: 'int',
            desc: '内部float寄存器序号，范围从1-32'
          }
        },
        ret: {
          type: 'float'
        }
      },
    }
  },

  coordinate: {
    expand: true,
    desc: '',
    items: {
      'coordinate_user': {
        desc: '设置用户坐标系相对于基坐标系的位移，设置后，后续运动函数中的位置均使用此工具坐标系',
        param: {
          x: {
            type: 'float',
            desc: '相对于基坐标系x方向的位移，单位mm'
          },
          y: {
            type: 'float',
            desc: '相对于基坐标系y方向的位移，单位mm'
          },
          z: {
            type: 'float',
            desc: '相对于基坐标系z方向的位移，单位mm'
          },
          rx: {
            type: 'float',
            desc: '相对于基坐标系rx方向的位移，单位deg'
          },
          ry: {
            type: 'float',
            desc: '相对于基坐标系ry方向的位移，单位deg'
          },
          rz: {
            type: 'float',
            desc: '相对于基坐标系rz方向的位移，单位deg'
          }
        },
        ret: null,
      },
      'coordinate_tool': {
        desc: '设置工具末端相对于法兰面坐标系的位移，设置后，后续运动函数中的位置均使用此工具坐标系',
        param: {
          x: {
            type: 'float',
            desc: '工具末端相对于法兰面坐标系x方向的位移（单位：mm）'
          },
          y: {
            type: 'float',
            desc: '工具末端相对于法兰面坐标系y方向的位移（单位：mm）'
          },
          z: {
            type: 'float',
            desc: '工具末端相对于法兰面坐标系z方向的位移（单位：mm）'
          },
          rx: {
            type: 'float',
            desc: '工具末端相对于法兰面坐标系rx方向的位移（单位：rad）'
          },
          ry: {
            type: 'float',
            desc: '工具末端相对于法兰面坐标系ry方向的位移（单位：rad）'
          },
          rz: {
            type: 'float',
            desc: '工具末端相对于法兰面坐标系rz方向的位移（单位：rad）'
          },
          tcpload: {
            type: 'float',
            desc: '负载质量（单位：kg），可省略此参数，省略后系统会使用当前设置的负载质量进行计算'
          },
          xload: {
            type: 'float',
            desc: '负载质心相对末端x方向的偏移, 可省略（单位：mm）'
          },
          yload: {
            type: 'float',
            desc: '负载质心相对末端y方向的偏移，可省略（单位：mm）'
          },
          zload: {
            type: 'float',
            desc: '负载质心相对末端z方向的偏移，可省略（单位：mm）'
          },
        },
        ret: null,
      },
      'coordinate_clear': {
        desc: '取消已设定的坐标系，后续移动函数使用基坐标',
        param: null,
        ret: null,
      },
      'set_tcp_load': {
        desc: '设置末端工具的质量质心',
        param: {
          tcpload: {
            type: 'float',
            desc: '负载质量（单位：kg）'
          },
          x: {
            type: 'float',
            desc: '负载质心相对末端x方向偏移（单位：mm）'
          },
          y: {
            type: 'float',
            desc: '负载质心相对末端y方向偏移（单位：mm）'
          },
          z: {
            type: 'float',
            desc: '负载质心相对末端z方向偏移（单位：mm）'
          }
        },
        ret: null,
      },
      'cal_ikine': {
        desc: '计算逆解',
        param: {
          p: {
            type: 'pose',
            desc: '需要计算逆解的末端位置'
          },
          res: {
            type: 'array',
            desc: '获取的1-7轴关节角度会记录在此Array变量中'
          }
        },
        ret: null,
      },
      'cal_fkine': {
        desc: '计算正解',
        param: {
          axis: {
            type: 'array',
            desc: '需要计算正解的关节角'
          },
          res: {
            type: 'pose',
            desc: '计算的末端位置会记录在此[POSE]变量中'
          }
        },
        ret: null,
      },
      'get_flange_pose': {
        desc: '该函数可获取当前状态下机械臂的末端位置',
        param: {
          p: {
            type: 'pose',
            desc: '获取的末端位置会记录在此[POSE]变量中'
          }
        },
        ret: null,
      },
      'get_tcp_pose': {
        desc: '该函数可获取当前状态下机械臂工具末端点在基坐标系下的位置',
        param: {
          p: {
            type: 'pose',
            desc: '获取的末端位置会记录在此[POSE]变量中'
          }
        },
        ret: null,
      },
      'get_joint_pose': {
        desc: '该函数可获取当前状态下机械臂各关节的角度',
        param: {
          axis: {
            type: 'array',
            desc: '获取的1-7轴关节角度会记录在此Array变量中'
          }
        },
        ret: null,
      }
    }
  },

  debug: {
    expand: true,
    desc: '',
    items: {
      'print_i': {
        desc: '该函数可在程序栏旁输出参数i的值，方便调试使用. \
             注：函数运行时有1s延时，建议仅在调试时使用',
        param: {
          i: {
            type: 'int',
            desc: '整型INT变量'
          }
        },
        ret: null,
      },
      'print_f': {
        desc: '该函数可在程序栏旁输出参数f的值，方便调试使用. \
             注：函数运行时有1s延时，建议仅在调试时使用',
        param: {
          f: {
            type: 'float',
            desc: '浮点型FLO变量'
          }
        },
        ret: null,
      },
      'print_s': {
        desc: '该函数可在程序栏旁输出参数s的值，方便调试使用. \
             注：函数运行时有1s延时，建议仅在调试时使用',
        param: {
          s: {
            type: 'string',
            desc: '字符串变量'
          }
        },
        ret: null,
      }
    }
  },

  modbus: {
    expand: true,
    desc: '',
    items: {
      'modbus_read': {
        desc: '该函数可读取modbus节点的数据，返回值为int类型',
        param: {
          signal_name: {
            type: 'string',
            desc: 'modbus节点名'
          }
        },
        ret: {
          type: 'int',
        },
        example: 'modbus_read("mbus1");'
      },
      'modbus_write_d': {
        desc: '该函数可对digital类型的modbus节点进行写操作',
        param: {
          signal_name: {
            type: 'string',
            desc: 'modbus节点名'
          },
          digital_value: {
            type: 'int',
            desc: '要写入的数值，取值为0或1'
          }
        },
        ret: null,
        example: 'modbus_write_d("mbus1", 1);'
      },
      'modbus_write_r': {
        desc: '该函数可对register类型的modbus节点进行写操作',
        param: {
          signal_name: {
            type: 'string',
            desc: 'modbus节点名'
          },
          register_value: {
            type: 'int',
            desc: '要写入的数值，取值范围 -32768~32767'
          }
        },
        ret: null,
        example: 'modbus_write_r("mbus1", 255);'
      },
      'modbus_set_frequency': {
        desc: '该函数可修改modbus节点的刷新频率，默认频率为10Hz',
        param: {
          signal_name: {
            type: 'string',
            desc: 'modbus节点名'
          },
          frequence: {
            type: 'int',
            desc: '频率值，取值范围：1~100Hz'
          }
        },
        ret: null,
      },
      'modbus_add_signal': {
        desc: '该函数可添加modbus节点，也可在系统设置中手动添加',
        param: {
          ip: {
            type: 'string',
            desc: 'Modbus服务器的IP地址，用字符串表示'
          },
          slave_number: {
            type: 'int',
            desc: 'slave编号'
          },
          signal_address: {
            type: 'int',
            desc: '节点地址偏移Addr'
          },
          signal_type: {
            type: 'int',
            desc: '0：Read Discrete Input (1x)\n \
                1: Read Write Coils(0x)\n \
                2: Read Input Register(3x)\n \
                3: Read Write Holding Register(4x)'
          },
          signal_name: {
            type: 'string',
            desc: 'modbus节点名，用字符串表示'
          }
        },
        ret: null,
        example: 'modbus_add_signal ("127.0.0.1", 1, 3, 0, "mbus1");'
      },
      'modbus_delete_signal': {
        desc: '该函数可删除modbus节点，也可在系统设置中删除modbus节点',
        param: {
          signal_name: {
            type: 'string',
            desc: 'modbus节点名'
          }
        },
        ret: null,
        example: 'modbus_delete_signal ("mbus1");'
      }
    }
  }
}
