function wordRegexp(words) {
  return new RegExp("^((" + words.join(")|(") + "))\\b");
}

var idReg = /^[A-Za-z][_A-Za-z0-9]*/

var builtins = ["Array", "movej", "movej_pose", "movel", "movec",
  "tcp_move", "move_phi", "speedj", "speedl", "speed_stop", "move_camera_offset",
  "socket_open", "socket_send_string", "socket_send_float", "socket_send_int",
  "socket_read_string", "socket_read_str_float", "socket_read_float",
  "socket_read_str_int", "socket_read_int", "socket_close", "sleep",
  "io_out", "io_in", "io_v_out", "io_v_in", "tool_io_out", "tool_io_in",
  "w_reg_bool", "r_reg_bool", "w_reg_ char", "r_reg_char", "w_reg_ float",
  "r_reg_float", "coordinate_user", "coordinate_tool", "coordinate_clear",
  "set_tcp_load", "cal_ikine", "cal_fkine", "get_flange_pos", "get_tcp_pos",
  "get_joint_pos", "print_i", "print_f", "print_s", "modbus_read", "modbus_write_d",
  "modbus_write_r", "modbus_set_frequency", "modbus_add_signal", "modbus_delete_signal",
]

var keywords = ["break", "continue",
  "def", "elif", "else", "end",
  "for", "global", "if", "return", "while"
];

var operators = ["and", "or", "not"]

var keyReg = wordRegexp(builtins.concat(keywords, operators))

var builtinVar = []

// 内部变量：DI: 数字输入； TDI: 末端工具数字输入； mbus: Modbus节点
var varReg = /(^T?DI[0-9]+)|(^mbus[0-9]+)/

export {
  idReg,
  keyReg,
  varReg
}