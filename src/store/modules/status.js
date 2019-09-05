/**
 * 机械臂状态，从中间层接收
 */
var joint = {
    axisNum: 0,
    actualPos: 0,
    setPos: 0,
    actualVel: 0,
    actualAcc: 0,
    actualCurrent: 0,
    actualVoltage: 0,
    actualTemp: 16,
    jointMode: 0,         // @/constants/robot.js  JOINT_MODE
    connected: false,
    enabled: false
}

const state = {
    //error info
    errorInfo: {
        errorIndex: 0,
        errorType: 0,
        errorMsg: '',
    },

    //program info
    progInfo: {
        programLine: 0,
        progRunning: false,
        printIndex: 0,
        printMsg: '',
    },

    //remote control info
    remoteInfo: {
        port2000: false,
        port2001: false,
        remoteRun: false,
        progPath: '',
        remoteStop: false,
        remotePause: false,
        remoteResume: false,
        remoteSpeed: 0,
        remoteLogin: false,
        remoteDisconnect: false,
        remoteShutdown: false,
    },

    //feedback from plc
    fromPLC: {
        taskID: 0,
        jointInfo: [joint, joint, joint, joint, joint, joint, joint],
        cartesianInfo: {
            actPos: [0.0,0.1,0.2,0.3,0.4,0.5],
            setFeedbackPos: [],
            actVel: [],
            actAcc: [],
            tcpExternalForce: [1,2,2,3,4,5]
        },
        fbRobotData: {
            analogIn: 0,
            analogOut: 0,
            digitalIn: [false,false,false,false,false,false,false,false,false,false,false,false,false,false],
            digitalOut: [false,false,false,false,false,false,false,false,false,false,false,false,false,false],
            ioLinkStatus: [],
            controllerTemp: 37,
            robotVoltage: 0,
            robotCurrent: 0,
            toolIoIn: [false,false,false,false],
            toolIoOut: [false,false,false,false],
            toolButton: [],
            toolReceiveData: [],
            toolSendData: [],
            collision: false,
            collisionAxis: 0,
            exceedJointLimit: [],
            exceedWorkingLimit: false,
            emcStopSignal: false,
            slaveReady: [],
            errorID: [],
            controllerVersion: 0,
            robotLibVersion: 0,
            ikineJointPose: [],
            fkineEndPose: [],
            reserve: [],
            operationMode: 0,    // see @/constants/robot.js  OPERATION_MODE
            taskState: 0,        // see @/constants/robot.js  TASK_STATE
            taskType: 0,         // see @/constants/robot.js  TASK_TYPE
            safetyMode: 0,       // see @/constants/robot.js  SAFETY_MODE
            robotState: 0,       // see @/constants/robot.js  ROBOT_STATE
        },
        // virtualIO: [],
    },
    //modbus
    modbusConnection: [],

    terminalCount: 0,

    version0: 0,
    version1: 0,
    version2: 0,
    adsConnected: false,
}

const getters = {
    jointPosRad: ()=>{
        let pos = []
        for (let i = 0; i < 7; i++) {
            let v = state.fromPLC.jointInfo[i].actualPos
            let vr = Math.round(v * 100) / 100
            pos.push(vr * 2 * Math.PI / 360)
        }
        return pos
    },
    jointPos: ()=> {
        let pos = []
        for (let i = 0; i < 7; i++) {
            let v = state.fromPLC.jointInfo[i].actualPos
            let vr = Math.round(v * 100) / 100
            pos.push(vr)
        }
        return pos
    }
}

const mutations = {
    updateState(state, params) {
        function deepCopy(newobj, obj) {
            if (typeof obj != 'object') {
                return
            }
            for (let attr in obj) {
                if (typeof attr != 'object') {
                    newobj[attr] = obj[attr]
                } else {
                    deepCopy(newobj[attr], obj[attr])
                }

            }
        }
        deepCopy(state, params)
    },
}

const actions = {
}

export default {
    namespaced: false,
    state,
    actions,
    mutations
}
