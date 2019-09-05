/**
 * 定义机器人状态的一些常量
 * 与Qt程序 dataupdate.h 中保持一致
 */

const ROBOT_STATE = {
    unConnected:   0,
    power:         1,
    initial:       2,
    disable:       3,
    enable:        4,
    standstill:    5,
    moving:        6,
    stopping:      7,
    estop:         8,
    error:         9,
    recovery:      10,
    idle:          11,
    maintenance:   98,
    userItf:       99
}
Object.freeze(ROBOT_STATE)

const SAFETY_MODE = {
    normal:          0,
    emergencyStop:   1,
    posViolation:    2,
    velViolation:    3,
    accViolation:    4,
    externalStop:    5,
    error:           6,
    recover:         7,
    stop1Fail:       8,
    stop1Triggered:  9,
    stop2Triggered:  30,
    reduceModeTriggered: 31,
}
Object.freeze(SAFETY_MODE)

const OPERATION_MODE = {
    idle:       0,
    manual:     1,
    automatic:  2
}
Object.freeze(OPERATION_MODE)

const TASK_STATE = {
    idle:      0,
    running:   1,
    stopping:  2,
    pause:     3,
    finished:  4,
    error:     5
}
Object.freeze(TASK_STATE)

const TASK_TYPE = {
    none:         0,
    jog:          1,
    moveLine:     3,
    moveCircle:   4,
    movePTP:      5,
    moveBatch:    6,
    moveSpline:   7,
    handingTeach: 8,
    setValue:     9,
    dynamicID:    10,
    FTSensorID:   11,
    loadCOGID:    12
}
Object.freeze(TASK_TYPE)

const JOINT_MODE = {
    ncMode:          0,
    posMode:         1,
    velMode:         2,
    torqueMode:      3,
    simulationMode:  4
}
Object.freeze(JOINT_MODE)

export { ROBOT_STATE, SAFETY_MODE, OPERATION_MODE, TASK_STATE, TASK_TYPE, JOINT_MODE }