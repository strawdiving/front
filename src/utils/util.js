
/**
 * localStorage
 */
export const setStore = (name, content) =>{
    if (!name) return
    if (typeof content !== 'string') {
        content = JSON.stringify(content)
    }
    window.localStorage.setItem(name, content)
}

/**
 * get localStorage item
 */
export const getStore = (name) =>{
    if (!name) return
    return window.localStorage.getItem(name)
}

/**
 * remove localStorage item
 */
export const removeStore = (name) => {
    if (!name) return
    window.localStorage.removeItem(name)
}

/**
 * 获取浏览器类型
 */
export const getBrowserType = () =>{
    var ua = navigator.userAgent.toLowerCase()
    
    if (ua.indexOf('firefox')!=-1) {
        return 'firefox'
    } else if (ua.indexOf('chrome')!=-1){
        return 'chrome'
    }
}

/**
 * 双字节16进制转换为十进制带符号
 * @param  x 16进制数 0x
 */
export const hex2dec = (x) => {
    // 最高位符号
    if (x>>>15==1) {
        return -parseInt(~(x - 1) & 0x0000ffff)
    } else {
        return parseInt(x)
    } 
}

/**
 * 十进制转换为16进制，带符号
 */
export const dec2hex = (x) => {
    if (x < -32768 || x > 32767) {
        return
    }
    if (x >= 0) {
        return x.toString(16)
    } else {
        return (-(~(x&0xffff)+1)).toString(16)
    }
}

