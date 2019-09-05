export default {
    inserted(el, binding, vNode) {
        el.setAttribute('style', 'position: fixed; z-index: 9999')
        console.log('drag inserted')
    },

    bind(el, binding, vNode) {
        const dragDom = el.querySelector('.header')
        dragDom.style.cssText += ';cursor:move;'


        // 获取原有属性 ie dom元素.currentStyle 火狐谷歌 window.getComputedStyle(dom元素, null);
        const getStyle = (function () {
            if (window.document.currentStyle) {
                return (dom, attr) => dom.currentStyle[attr]
            } else {
                return (dom, attr) => getComputedStyle(dom, false)[attr]
            }
        })()

        el.onmousedown = (e) =>{
            const disX = e.clientX - dragDom.offsetLeft
            const disY = e.clientY - dragDom.offsetTop

            const elWidth = el.offsetWidth
            const elHeight = el.offsetHeight

            // 浏览器视口的大小
            const screenWidth = document.body.clientWidth
            const screenHeight = document.body.clientHeight

            // 元素左上角相对于父元素左边界的偏移值
            const minDragDomLeft = el.offsetLeft
            // 元素框右边界的最大可拖拽距离
            const maxDragDomLeft = screenWidth - el.offsetLeft - elWidth
            // 元素左上角相对于父元素上边界的偏移值
            const minDragDomTop = el.offsetTop
            // 元素框下边界的最大可拖拽距离
            const maxDragDomTop = screenHeight - el.offsetTop - elHeight

            // 获取到的值带px 正则匹配替换，元素左/上边界与包含块左/上边界的偏移值
            let styL = getStyle(el, 'left')
            let styT = getStyle(el, 'top')

            if (styL.includes('%')) {
                styL = +document.body.clientWidth * (+styL.replace(/\%/g, '') / 100)
                styT = +document.body.clientHeight * (+styT.replace(/\%/g, '') / 100)
            } else {
                styL = +styL.replace(/\px/g, '')
                styT = +styT.replace(/\px/g, '')
            }



            document.onmousemove = function (e) {
                // 通过事件委托，计算移动的距离
                let left = e.clientX - disX
                let top = e.clientY - disY

                // 边界处理
                // 向左移动
                if (-(left) > minDragDomLeft) {
                    left = -minDragDomLeft
                    // 向右移动
                } else if (left > maxDragDomLeft) {
                    left = maxDragDomLeft
                }
                // 向上移动
                if (-(top) > minDragDomTop) {
                    top = -minDragDomTop
                    // 向下移动
                } else if (top > maxDragDomTop) {
                    top = maxDragDomTop
                }

                el.style.cssText += `margin: 0;`
                // 移动当前元素
                el.style.cssText += `;left:${left + styL}px;top:${top + styT}px;`
            }

            document.onmouseup = function (e) {
                document.onmousemove = null
                document.onmouseup = null
            }

        }

    },
}
