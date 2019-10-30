export default {
  button: {
    confirm: 'Confirm',
    cancel: 'Cancel',
    delete: 'Delete',
    edit: 'Edit'
  },
  navbar: {
    cobot: 'SIASUN Cobot',
    program: 'Program',
    status: 'Status',
    run: 'Run',
    settings: 'Settings',
    users: 'Users Manage',
    homePage: 'Home',
    logout: 'Logout'
  },
  dashboard: {
    totalTime: 'Total Time',
    taskTime: 'Task Time',
    currentTask: 'Current Task',
    loadProg: 'Load Program',
    robotState: 'Robot State'
  },
  status: {
    IOStatus: 'IO Status',
    digitalInTitle: 'Digital Input',
    digitalOutTitle: 'Digital Output',
    toolInTitle: 'Tool Input',
    toolOutTitle: 'Tool Output',
    log: 'Log',
    currentTemperature: 'Current Temperature',
    currentPosition: 'Current Position',
    jointPosition: 'Joint Position',
    cartesianPosition: 'Cartesian Position',
    externalForce: 'TCP External Force'
  },
  settings: {
    coordinates: 'Coordinates',
    coordName: 'Coord Name',
    coordType: 'Coord Type',
    coordParams: 'Coord Params',
    actions: 'Actions',
    addToolCoord: 'Add Tool Coord',
    toolCoord: 'Tool Coordinate',
    setLoad: 'Set Load Params',
    pcLoad: 'PC Load',
    pcLoadPos: 'PC Load Position',
    addUserCoord: 'Add User Coord',
    userCoord: 'User Coordinate',
    desc: 'Description',
    descPlaceholder: 'Input description here...',
    defaultProg: 'Default Program',
    loadDefaultProg: 'Load Default Program',
    trigger: 'Trigger: ',
    is: ' is ',
    high: 'High',
    low: 'Low',
    functions: 'Functions',
    createFunction: 'Create Custom Function',
    customFunction: 'Custom Function',
    funcName: 'Function Name',
    funcDesc: 'Description',
    argNumber: 'Number of Arguments',
    argList: 'List of Arguments',
    argType: 'Type',
    argName: 'Name',
    funcContent: 'Content of Function',
    funcReturn: 'Return Value',
    modbus: 'Modbus',
    modbusName: 'Name',
    modbusType: 'Type',
    addModbus: 'Add Modbus',
    digitalIn: 'Digital In',
    digitalOut: 'Digital Out',
    registerIn: 'Register In',
    registerOut: 'Register Out'
  },
  users: {
    userName: 'UserName',
    type: "User Type",
    initCode: 'Initial Code',
    addUser: 'Add User',
    admin: 'Administrator',
    user: 'Normal User'
  },
  program: {
    create: 'Create Program',
    open: 'Open Program',
    graph: 'Graph',
    text: 'Text',
    progName: 'Name',
    type: 'Type',
    name: 'Name',
    mtime: 'mtime',
    operation: 'Operations',
    importLocal: 'Import from local',
    prog: 'program',
    varsConf: 'Variables',
    funsConf: 'Functions',
    scriptConf: 'Scripts',
    deleteHint: 'This will permanently delete the program. Continue?',
    warn: 'Warning',
    nameRepeatHint: 'The program name already exists, please rename the program'
  },
  errMsg: {
    initFile: 'Init file error',
    comm: 'Communication error',
    safetyModule: 'Safety module error',
    tcpBoard: 'TCP board error',
    middleDisconnect: 'Middleware disconnect',
    toolWeightSet: 'Tool weight setting error\nOr install orientation setting error',
    dhParam: 'DH parameter error',
    enterPoints: 'Entered points all 0',
    endPoint: 'End point error',
    exceedLimit: 'Exceed working limit',
    notContinuous: 'Inverse solution not continuous',
    safetyController: 'Safety controller alert',
    jointSpacePlan: 'Joint space planning error',
    cartSpacePlan: 'Cartesian space planning error',
    onlinePlan: 'Online planning error',
    bezierBlendPlan: 'Bezier blend planning error',
    jointBlendPlan: 'Joint blend planning error',
    encoder: 'Encoder error',
    axis: 'Axis error',
    axisEnable: 'Axis enable error',
    axisReset: 'Axis reset error',
    internal: 'Internal error',
  }
}